# Mission Control — Implementation Study for FDLC

Repository: `jaydubya818/MissionControl` (local checkout `/home/claude/repos/MissionControl`)
Study date: 2026-09-11. Runtime contract at study time: v58 (`README.md:493`).
Method: direct read of `README.md`, `docs/OVERVIEW.md`, `docs/FACTORY_VOCABULARY.md`,
`docs/product/*`, `docs/software-factory/*`, `docs/architecture/*`, `docs/decisions/*`,
the full `convex/schema.ts` (9,003 lines, 219 `defineTable` calls), the validator
libraries under `convex/lib/`, `packages/workflow-engine/src/verification*.ts`,
`packages/workflow-engine/src/harnessManifests.ts`, `packages/state-machine/src/*`,
`convex/workOrders.ts` (`accept`), `convex/factory/attempts.ts`
(`authorizePublicationInternal`), `convex/factory/configuration.ts` (`activate`),
and the orchestration-server source tree listing. Line numbers cite the checkout.
Items I did not read are marked **(not read)** or **(uncertain)**.

Legend for maturity: I use Mission Control's own Capability Maturity Ledger
vocabulary (`docs/product/software-factory-capability-maturity.md:79-95`) —
**Qualified**, **Production-pilot eligible**, **Implemented, gated**, **Partial**,
**Preview**, **Experimental**, **Future or missing** — and map it to the
requested Available / Experimental / Planned scale in the concept map.

---

## 0. Executive orientation

Mission Control (MC) is a Convex + TypeScript monorepo whose *schema is the
product*. Almost every FDLC-relevant concept exists as one or more Convex tables
with union-literal state fields, digests, idempotency keys and
`acceptanceAuthority: v.literal(false)` markers on anything advisory. The
governing hierarchy (README.md:143-168; docs/OVERVIEW.md:265-289) is:

```
Company → Workspace → Repository
  ├── Project Constitution revision
  ├── Active Factory Version
  └── Mission → Mission Spec revision → Approved Plan (+ Quality Contract)
        → WorkOrder → Task → Attempt (workflowRuns)
              ├── frozen execution manifest + Context Package
              ├── immutable candidate (Verification Subject)
              └── ordered runEvents / runArtifacts
Candidate → Verification Subject → frozen Verification Plan → verifier Attempt
  → evidenceEnvelopes + verificationReceipts → qualityGateDecisions
  → exact-current PR → workOrders.accept (human)
PR → Merge → Deployment → Activation → Production Verification (factoryReleases)
```

The single most important invariant, repeated in doctrine and enforced in code:

> `execution completed ≠ verification passed ≠ gate eligible ≠ WorkOrder accepted
> ≠ PR merged ≠ production verified` (README.md:194-200;
> `docs/software-factory/verification-and-gate-state-machines.md:16-22`)

and

> "`workOrders.accept` is the canonical WorkOrder acceptance boundary and the only
> implementation that writes the `WORK_ORDER_ACCEPTED` transition"
> (docs/OVERVIEW.md:734-738). Code: `convex/workOrders.ts:5279-5589`; the test
> `convex/__tests__/governedHardeningAuthority.test.ts:26` asserts no other file
> writes that event.

Two important caveats for anyone using MC as the FDLC reference implementation:

1. **Two generations of code coexist.** A legacy agent-orchestration layer
   (`tasks`, `agents`, `runs`, `toolCalls`, `approvals`, `packages/coordinator`,
   `packages/state-machine`, `packages/policy-engine`, `packages/agent-runtime`,
   `agents/*.yaml` personas) predates the governed Factory layer. The Factory
   layer (`missions`, `missionPlans`, `workOrders`, `workflowRuns`-as-Attempt,
   `factoryDefinitionVersions`, `verification*`, `evidenceEnvelopes`,
   `qualityGateDecisions`, `factoryReleases`, `factoryIncidents`) is the
   FDLC-relevant one. `docs/ARCHITECTURE.md` still describes the legacy layer.
2. **Status claims are unusually disciplined.** The repo separates "code exists"
   from "qualified at revision X". FDLC should adopt that discipline rather than
   treat every table as "Available".

---

## 1. Concept-by-concept study

Each entry answers: (a) exists? (b) files/tables/types (c) fields/states/transitions
(d) invariants (e) maturity (f) spec / pattern / implementation detail.

### 1.1 Mission

**(a)** Yes — first-class.
**(b)** Table `missions` (`convex/schema.ts:1969-2027`); mutations in
`convex/missions.ts`; contract in `docs/software-factory/governed-missions-contract.md`.
**(c)** Key fields: `title`, `objective`, `context`, `constraints[]`,
`sourceOfTruthRefs[] {kind: REPO|DOC|PRD|ISSUE|URL}`, `repositoryId`,
`codeScopeIds[]`, `executionEnvironment: LOCAL|CLOUD|REMOTE|POLICY_SELECTED`,
`executionPolicy: "SERIAL_MUTATIONS"` (literal — only value), `maxReadOnlyConcurrency`,
`maxCorrectiveIterations`, `correctiveIterations`, `stopCondition`, `budgetUsd`,
`spentUsd`, `currentPlanId`, `currentSpecRevisionId`, `activeWorkOrderId`,
`blockingReason`, `requiredHumanAction`, `acceptedAt`.
States (`schema.ts:1998-2003`): `DRAFT, PLANNING, AWAITING_PLAN_APPROVAL, READY,
IN_PROGRESS, BLOCKED, AWAITING_VALIDATION, AWAITING_ACCEPTANCE, DONE, CANCELED,
SUPERSEDED`.
Transitions (governed-missions-contract.md:54-72):
`DRAFT→PLANNING`, `PLANNING→AWAITING_PLAN_APPROVAL`, `AWAITING_PLAN_APPROVAL→READY`
(approve), `AWAITING_PLAN_APPROVAL→DRAFT` (reject), `READY→IN_PROGRESS`,
`IN_PROGRESS→AWAITING_VALIDATION`, `AWAITING_VALIDATION→IN_PROGRESS` (corrective),
`AWAITING_VALIDATION→AWAITING_ACCEPTANCE`, `AWAITING_ACCEPTANCE→DONE`,
`DRAFT→CANCELED`, `{PLANNING,READY,IN_PROGRESS,AWAITING_VALIDATION}→BLOCKED`,
`BLOCKED→READY`. State writes confirmed in `convex/missions.ts:721,1004,1036,1093,1115,1168,1270,1333,1421,1509,1537`. `SUPERSEDED` is declared in schema but I did not find the writer **(uncertain)**.
**(d)** Invariants (governed-missions-contract.md:9-19, 22-41):
exactly one repository-mutating WorkOrder active per Mission (`executionPolicy:
SERIAL_MUTATIONS`); WorkOrders are created/released only from an approved Plan;
plan approval "never dispatches an agent, starts a WorkflowRun, satisfies a
WorkOrder risk approval, merges code, or deploys"; approval + materialization
idempotent; a Mission cannot be `READY` with a partial release; Mission stops
on acceptance, cancellation, budget exhaustion, max corrective iterations, or
explicit blocked; a worker handoff is never proof of pass.
**(e)** Qualified (ledger row "Governed intent, Plans, and WorkOrders").
**(f)** **Spec-worthy.** Mission = FDLC "unit of intent"
(operating-contract-evidence-map.md:12). The state list and the
`SERIAL_MUTATIONS` + stop-condition invariants are spec MUSTs.

### 1.2 Mission Spec / Specification (and Project Constitution)

**(a)** Yes — "Spec-Driven Mission Intake V1", default-off behind project flag
`missions.spec-intake-v1` (OVERVIEW.md:223).
**(b)** Tables `projectConstitutionRevisions` (`schema.ts:2271-2288`),
`missionSpecRevisions` (`2292-2309`), `missionSpecQualityEvaluations` (`2311-2331`),
`missionSpecDecisions` (`2335-2350`), `missionIntentContributions` (`2354-2399`),
`missionIntentContributionDecisions` (`2403-2420`). Validators in
`convex/lib/missionSpecValidators.ts`; logic `convex/missionSpecs.ts`,
`convex/missionIntentContributions.ts`.
**(c)** Spec revisions are insert-only with `baseRevisionId`, `revisionNumber`,
`projectConstitutionRevisionId` + `projectConstitutionDigest`, `content`, `digest`,
`createdActorSource: AUTHENTICATED|DEVELOPMENT_FALLBACK`. Quality evaluation:
`result: PASS|FAIL`, `findings[]`, `rulesetVersion`. Decision:
`decisionType: v.literal("FINALIZED")` only — the schema comment (2333-2334):
"FINALIZED means planning-ready only. It is intentionally not APPROVED and carries
no execution, verification, publication, or acceptance authority."
Contribution roles: `PRODUCT|QA|DESIGN|ENGINEERING|SECURITY_OPERATIONS`; target
sections `OUTCOME|REQUIREMENTS|NON_FUNCTIONAL_REQUIREMENTS|ACCEPTANCE_EXPECTATIONS|
VERIFICATION_EXPECTATIONS|NON_GOALS|CONSTRAINTS|RISKS|REPOSITORY_SCOPE`;
decisions `ACCEPTED|REJECTED` are "append-only and human-only".
Implicit state machine: `(draft revision) → evaluated (PASS|FAIL) → FINALIZED`;
any content change = new revision.
**(d)** "Plan submission and approval revalidate the exact Spec, evaluation, and
Constitution IDs and digests. A newer Spec never silently rebinds an existing
Plan" (OVERVIEW.md:415-417). Trace: `Spec requirement → Plan assertion → WorkOrder
blueprint → acceptance criterion → verification check and evidence expectation`
(OVERVIEW.md:423-429); `missionPlans.assertions[].sourceRequirementIds /
sourceAcceptanceExpectationIds / sourceVerificationExpectationIds` carry it
(`schema.ts:2082-2084`).
**(e)** "Merged and qualified; default off" (OVERVIEW.md:223); shared builder
intent "Preview; default off".
**(f)** **Spec-worthy** as the FDLC "Specification" artifact: immutable
revisions, digest lineage to the Plan, deterministic quality evaluation, and the
`FINALIZED ≠ APPROVED` rule.

### 1.3 Plan (missionPlans, approval, revisions)

**(a)** Yes.
**(b)** Table `missionPlans` (`schema.ts:2029-2137`); `validationAssertions`
(`2201-2224`); `missionPlanningRuns` / `missionPlanningRunEvents` (`428-548`,
agent planning runs); `convex/missions.ts`, `convex/missionPlanning.ts`,
`convex/lib/missionPlan.ts`, `convex/lib/qualityContract.ts`.
**(c)** Fields: `basePlanId`, `revisionNumber`, `draftVersion`,
`status: DRAFT|PROPOSED|APPROVED|REJECTED|SUPERSEDED`, `summary`,
`rollbackApproach`, `estimatedCostUsd`, `repository`, `repositoryBranch`,
`planningRunId`, `planningRepositorySha`, `planningResearchPacketDigest`,
`planningCandidateDigest`, `submittedBy/At/ActorSource`, `approvedBy/At`,
`decidedBy/At/ActorSource`, `releaseIdempotencyKey`, `releasedAt`,
`releasedWorkOrderIds[]`, `materializationVersion`, `qualityContractProjection`,
`qualityContractDigest`, `missionSpecRevisionId`+`missionSpecDigest`,
`projectConstitutionRevisionId`+`projectConstitutionDigest`,
`requirementsCoverageProjection`, `specConsistencyFindings`, `assertions[]`
(`verificationMethod: COMMAND|TEST|BROWSER|MANUAL|CHECKLIST`,
`requiresIndependentValidation`, `waiverAllowed`), `workOrderBlueprints[]`
(role `WORKER|VALIDATOR`, `isMutating`, `riskLevel`, `implementationPolicy
{allowedCommands, independentVerification{executable,args,category,commandClass,
evidenceCategory,timeoutMs}, maxFilesChanged, maxLinesChanged, maxCostUsd,
maxAttempts, timeoutMinutes, stopCondition}`, `dependsOnBlueprintIds`,
`assertionIds`).
Plan states: `DRAFT → PROPOSED → APPROVED | REJECTED`; `SUPERSEDED` when a new
revision is approved. Documented projection lifecycle
(verification-and-gate-state-machines.md:26-36): `PLAN_DRAFT → PLAN_IN_REVIEW →
PLAN_APPROVED → PROJECTION_COMPILED → PROJECTION_SUPERSEDED | PROJECTION_WITHDRAWN
| PROJECTION_EXPIRED`.
Planning-run states: `QUEUED → RESEARCHING → GENERATING → VALIDATING → SUCCEEDED
| FAILED | CANCELED` with a lease (`schema.ts:434-454`); comment (2194-2196):
"A successful row may supply an editable candidate ... but cannot submit,
approve, dispatch, publish, verify, or accept delivery work."
**(d)** Editable only in `DRAFT`; submission freezes; rejection needs rationale;
"a submitted plan cannot be approved by its author"
(factory-learning-continuous-improvement.md:94-95); approval atomically
compiles the Quality Contract projection + digest and releases WorkOrders +
assertions idempotently (VF-002, `docs/decisions/verification-first-architecture-decisions.md:27-44`).
Quality Contract "is not a separate aggregate ... has no independent mutable
status or owner" (verification-first-domain-contracts.md:35-62).
**(e)** Qualified (golden path + System V2).
**(f)** **Spec-worthy.** Plan revision immutability, author≠approver, approval ≠
dispatch, and the Quality Contract as a *projection with a digest* (not a
second aggregate) are FDLC MUSTs. The blueprint field list is a good pattern.

### 1.4 WorkOrder

**(a)** Yes — "the canonical governed unit of approved work"
(FACTORY_VOCABULARY.md:73-76).
**(b)** Table `workOrders` (`schema.ts:2422-2539`), `workOrderEvents`
(`2541-2593`), `workOrderRevisions` (`2622-2653`), `reopenDecisions`
(`2655-2674`), `workOrderSupersessions` (`2676-2693`), `approvalDecisions`
(`2695-2725`), `governancePolicies` (`2595-2620`). Validators
`convex/lib/workOrderSpecificationValidators.ts`. Logic `convex/workOrders.ts`,
`convex/lib/workOrderDispatch.ts`, `workOrderReadiness.ts`, `workOrderRevision.ts`,
`workOrderGovernance.ts`, `workOrderCreate.ts`.
**(c)** States (`schema.ts:159-171`): `DRAFT, READY, DISPATCHED, IN_PROGRESS,
BLOCKED, AWAITING_APPROVAL, AWAITING_VERIFICATION, REOPENED, DONE, CANCELED,
SUPERSEDED`. Parallel status axes: `verificationStatus: PENDING|PASS|FAIL|WAIVED|
STALE` and `approvalStatus: NOT_REQUIRED|PENDING|APPROVED|REJECTED|CONDITIONAL|
REVISION_REQUESTED|EXPIRED|REVOKED`.
Transition logic is distributed, not tabular: `validateDispatchable`
(`workOrderDispatch.ts:233-253`) allows dispatch from `READY, BLOCKED, DISPATCHED,
IN_PROGRESS, AWAITING_APPROVAL, AWAITING_VERIFICATION, REOPENED` and refuses
`active-run-exists` / `approval-required`; `nextStateForRunStatus`
(`workOrderDispatch.ts:255-272`) derives WorkOrder state from Attempt status:
`PENDING→DISPATCHED`, `RUNNING→IN_PROGRESS`, `PAUSED→AWAITING_APPROVAL`,
`FAILED→BLOCKED`, `CANCELED→CANCELED`, `COMPLETED→AWAITING_VERIFICATION` (if
approval `APPROVED|CONDITIONAL|NOT_REQUIRED`) else `AWAITING_APPROVAL`.
`accept` (`workOrders.ts:5333`) refuses from `DONE|CANCELED|DRAFT` and writes
`DONE`. Reopen writes `REOPENED` (`workOrders.ts:5829`); supersede writes
`SUPERSEDED` (`3864`).
Specification fields: `kind: SOFTWARE_CHANGE|VERIFICATION|AUTOMATION`,
`requirements[]` (MUST/SHOULD, FUNCTIONAL/NON_FUNCTIONAL), `acceptanceCriteria[]`
(givenWhenThen, `requiredEvidence[] {category, minimumCount, independent,
independenceLevel: ANY_VERIFICATION|CANDIDATE_DEPENDENT_ALLOWED|INDEPENDENT_REQUIRED}`),
`negativeConstraints[]` (typed: `PROTECTED_PATH, NO_AUTH_CHANGES, NO_PRODUCTION_ACCESS,
NO_PLAINTEXT_SECRETS, NO_PUBLIC_API_CHANGES, NO_SCHEMA_CHANGES, NO_NEW_DEPENDENCIES,
NO_TEST_REMOVAL, NO_ASSERTION_WEAKENING, NO_VERIFICATION_CONFIG_CHANGES, CUSTOM`),
`dataBoundaries[]`, `changeBudget` (files/lines/paths/command classes/dependency/
schema/migration/infra), `verificationContract` (v1|v2; v2 adds `requiredRisks`,
`independence.minimumBoundary: "SEPARATE_ATTEMPT"`, `authorityPolicy`),
`autonomyLevel: LEVEL_0..LEVEL_5`, `riskLevel: LOW|MEDIUM|HIGH|CRITICAL`,
`riskReasons[]`, `executionRoutingPin`, `inferenceSpendingFence`,
`missionSpecLineage`, `qualityContractDigest`, `currentRevisionNumber`,
`acceptedRevisionNumber`.
Revision materiality (`schema.ts:210-216`): `NO_ACTION|REVERIFICATION|REAPPROVAL|
BOTH|FULL_REOPEN`; revision status `APPLIED|PENDING_APPROVAL|REJECTED|SUPERSEDED`.
`governancePolicies` fixes approval validity hours by risk, verification validity
hours, and re-approval/re-verification triggers after material/code/workflow/
environment change.
**(d)** (verification-first-domain-contracts.md:71-78) execution uses the current
approved revision; criteria/requirement IDs unique per version; every required
criterion maps to ≥1 evidence category; denied paths override allowed; "absence
of an enforced contract cannot be presented as verified"; revisions invalidate
affected receipts/approvals per policy. Also "its existence does not make it
ready for execution" (FACTORY_VOCABULARY.md:76); "Task completion does not accept
a WorkOrder, and WorkOrder completion does not accept a Mission" (OVERVIEW.md:432-433).
**(e)** Qualified.
**(f)** **Spec-worthy** — the WorkOrder is FDLC's executable contract. Its
three-axis status (lifecycle × verification × approval), revision materiality,
change budget and typed negative constraints are all spec material.

### 1.5 Task

**(a)** Yes, but it is the *legacy* operational unit that the Factory layer
re-parented under WorkOrders.
**(b)** Table `tasks` (`schema.ts:3189-3380`), `taskTransitions` (`3403-3442`),
`taskEvents` (`3447-3478`), `taskDependencies`, `taskRelations`. Transition
matrix in `packages/state-machine/src/transitions.ts:23-326`; a duplicated
lowercase mirror in `convex/lib/stateMachine.ts:25-58` (appears unused — only
referenced by generated API types).
**(c)** States (`schema.ts:99-110`): `INBOX, READY, ASSIGNED, IN_PROGRESS, REVIEW,
NEEDS_APPROVAL, BLOCKED, FAILED, DONE, CANCELED`. The transition table encodes
allowed actors (`agent|human|system`) and required artifacts; e.g. `REVIEW→DONE`
and `NEEDS_APPROVAL→DONE` are `human` only with `approvalRecord` required;
`FAILED→INBOX` and `DONE→REVIEW` are human-only reopen paths. `tasks.workOrderId`
is "canonical governed-delivery parent. Mission is derived through Work Order"
(`schema.ts:3227-3228`). `workOrders.accept` syncs the legacy parent task to
`DONE` (`workOrders.ts:5466-5563`).
**(d)** "A Task can complete without accepting the parent WorkOrder"
(FACTORY_VOCABULARY.md:82-83).
**(e)** Qualified (task/WorkOrder linkage evidence packages).
**(f)** **Pattern**, not spec. FDLC should keep "Task" as a bounded operational
unit inside a WorkOrder; the legacy 10-state Kanban machine is an implementation
detail. The actor-gated transition table is a reusable *pattern*.

### 1.6 Attempt (workflowRuns) and Candidate identity

**(a)** Yes — `workflowRuns` "remains the Attempt system of record"
(`schema.ts:7182`).
**(b)** Table `workflowRuns` (`schema.ts:5233-5583`); `runEvents` (`3070-3103`),
`runArtifacts` (`3105-3134`); logic `convex/factory/attempts.ts`,
`convex/lib/factoryAttempt.ts`, `convex/lib/executionManifest.ts`;
worker `apps/orchestration-server/src/factoryAttemptWorker.ts`.
**(c)** Lifecycle status: `PENDING, RUNNING, COMPLETED, FAILED, PAUSED, CANCELED`;
`executionPhase: CLAIMED|PREPARING|EXECUTING|VALIDATING|AWAITING_HUMAN_REVIEW|
AWAITING_VERIFICATION|PUBLISHING|TERMINAL`; `runtimeDisposition: RETRYABLE|LOST|
CANCELLED|FAILED|RECOVERABLE`; `attemptPurpose: IMPLEMENTATION|VERIFICATION|
AUTOMATION`; `factoryPurpose: SOFTWARE|VERIFICATION|INTELLIGENT_AUTOMATION`;
`evidenceState: PASSING|FAILING|STALE|MISSING|UNKNOWN`;
`failureClass: RETRYABLE_INFRA|RETRYABLE_EXECUTION|NON_RETRYABLE_RESULT|UNKNOWN`.
Documented transitions (verification-and-gate-state-machines.md:45-56):
`PENDING→RUNNING` (lease claimed), `RUNNING→PAUSED` (external decision),
`PAUSED→RUNNING` (valid continuation), `RUNNING→COMPLETED|FAILED|CANCELED`,
`PAUSED→FAILED|CANCELED`. "A retry that represents a new execution try creates a
new Attempt identity."
Frozen bindings on the row: `factoryDefinitionVersionId` + `factoryConfigurationDigest`,
`executionProfileId/Key/Version/Digest/Snapshot/QualificationDigest`,
`executionManifest` + `executionManifestDigest`, `workOrderRevisionNumber/Id`,
`verificationContractDigest`, `qualityContractDigest`, `factoryContextPackageId`,
`hostBindingId`, `policyEnvelopeId`, `sandboxAllocationId`, `routingDecisionId/Digest`,
`executionRoutingSnapshot`, `executionCostAuthorization`.
**Candidate identity**: `executionBaseSha`, `headSha`, `treeSha`,
`candidateReadyAt`, `verificationSubject` (see 1.19), `subjectPublicationBinding`,
`pullRequestNumber/Id/ProviderId/Url`. The Verification Subject
(`workOrderSpecificationValidators.ts:205-288`; `verificationSubject.ts:11-80`)
binds `{version, subjectId, workOrderId, workOrderRevisionNumber,
verificationContractDigest, sourceAttemptId, digest}` plus, for `GIT_CANDIDATE`,
`repositoryId, candidateSha, treeSha` and either GitHub PR identity
(`providerPullRequestId, number, url, baseRef, headRef, headSha, draftAtPublication`,
v1) or v2 pre-publication `{baseSha, candidateSha, treeSha, rawDiffSha256,
baseRef, headRef}`. Constructor enforces "exact lowercase commit/tree SHA lineage
and a matching bound head" (`verificationSubject.ts:103-105`).
**(d)** "Retries, corrections, and recovery create new Attempts rather than
rewriting history" (FACTORY_VOCABULARY.md:85-88); "Producer completion freezes a
subject; it does not accept, publish, merge, or release it" (89-92); one active
mutating Attempt per repository across Missions (OVERVIEW.md:674-675); "Missing
token, cost, model-request, or retry telemetry remains `null`; Mission Control
never invents zeroes" (OVERVIEW.md:514-516); "Dispatch is idempotent and
enforces one active mutating Attempt per repository across Missions"
(OVERVIEW.md:674-675).
**(e)** Qualified.
**(f)** **Spec-worthy.** Attempt immutability, frozen-manifest binding, and the
Verification Subject as the exact candidate identity (commit + tree + diff hash
+ contract digest + source Attempt) are FDLC MUSTs.

### 1.7 Context assembly / Context Package / Factory Memory

**(a)** Yes, in two distinct systems that MC itself distinguishes
(factory-memory-context-intelligence.md:57-80):
- **Context Registry** (installable/versioned skills): `contextPackages`
  (`schema.ts:6688-6711`), `contextPackageVersions` (`6722-6768`),
  `contextManifests` (`6779-6788`), `contextLocks` (`6797-6805`),
  `contextInstallations` (`6816-6834`), `contextActivationReceipts` /
  `workflowContextActivationReceipts` (`6944-6980`), `contextEvalScenarios/Runs`,
  `contextVerifiers` (`8091-8109`); packages `packages/context-tools`
  (manifest/lock/resolver), `packages/context-router` (classifier/router);
  docs `docs/CONTEXT_MANIFESTS.md`.
- **Factory Memory** (Attempt-bound advisory retrieval): `factoryMemoryDocuments`,
  `factoryMemoryChunks`, `factoryMemoryIngestionRuns`, `factoryEntities`,
  `factoryRelationships`, `factoryRetrievalPlans`, `factoryContextPackages`,
  `factoryContextVerificationAdvisories` (`schema.ts:6433-6678`);
  `convex/factoryMemory.ts` (2,291 lines); algorithms in
  `packages/memory/src/factory/{ingestion,retrieval,graph,planner,context,evals,security}.ts`.
**(c)** Registry: package types `SKILL|RULES|DOCUMENTATION|SOUL|WORKFLOW|TOOL_GUIDE|
PROMPT_TEMPLATE|POLICY|ARCHITECTURE_GUIDE|EVALUATION_GUIDE`; package status
`DRAFT|ACTIVE|DEPRECATED`; version status `DRAFT|PUBLISHED|DEPRECATED` (immutable
after publish; `contentHash` `sha256:<64hex>` required at publish);
`securityStatus: UNSCANNED|PASSED|FAILED|QUARANTINED`; installation state
`INSTALLED|STALE|MISSING|INCOMPATIBLE`. Manifest `mc-context.json` + lock
`mc-context.lock` pin version + contentHash + sourceCommitSha; only 4 range forms.
Factory Memory: `factoryContextPackages` has `frozen: v.literal(true)`,
`acceptanceAuthority: v.literal(false)`, `contentHash`, `budget`, `items[]`,
`retrievalPlanId`, `primaryTraceId`, `qualityContractDigest`; an Attempt binds
at most one (`workflowRuns.factoryContextPackageId`). Five phase flags
(`factory-memory.hybrid|relationships|agentic-retrieval|knowledge-graph|context-engine`)
all default off.
**(d)** "Retrieval from it is context, not evidence" (FACTORY_VOCABULARY.md:52);
"Retrieved content is untrusted data. It cannot grant tool, identity, permission,
execution, approval, or acceptance authority" (factory-memory doc:123-125);
"loading one does not certify its contents are current" (VOCABULARY:34-35);
package digests and diffs deterministic.
**(e)** Registry: Qualified (context-skills admission, synthetic). Factory Memory:
"Qualified; advisory", phase-gated, default off.
**(f)** Context Package freezing onto an Attempt with digest + `acceptanceAuthority:false`
is **spec-worthy** (FDLC "Context is current, attributable and scoped"). The
registry manifest/lock format is a **pattern** (lockfile-style pinning of skills).
Retrieval algorithms are implementation detail.

### 1.8 Agent execution and agent definitions

**(a)** Yes, two layers.
**(b)** Legacy personas `agents/*.yaml` (13 files: coder, qa, coordinator, …) with
`role`, `risk_profile`, `allowed_tools`, `budgets`, `capabilities`, `system_prompt`;
runtime `packages/agent-runtime/src/lifecycle.ts` (persona load → register →
heartbeat → claim tasks). Governed registry ("ARM"): `agentTemplates`
(`schema.ts:714-729`), `agentVersions` (`734-768`), `agentInstances` (`773-793`),
`policyEnvelopes` (`798-816`), `deployments` (`898-916`), `agentIdentities`
(`4923-4962`); `convex/registry/*`. Workflow YAML in `workflows/*.yaml`
(`feature-dev` = planner/setup/developer/verifier/tester/pr-creator/reviewer) →
`workflows` table (`5147-5228`) with step kinds `AGENT|REDUCE|ROUTER|VERIFY|GATE|
DETERMINISTIC`, `isolation: SHARED|WORKTREE|READ_ONLY`, `failurePolicy`. Roles
dir `roles/support_triage_agent` is an agent-hiring fixture (not Factory).
**(c)** `agentVersions.genome {modelConfig, promptBundleHash, toolManifestHash,
provenance}` + `genomeHash`; status `DRAFT→TESTING→CANDIDATE→APPROVED→DEPRECATED→RETIRED`;
instance status `PROVISIONING|ACTIVE|PAUSED|READONLY|DRAINING|QUARANTINED|RETIRED`;
deployment status `PENDING|ACTIVE|ROLLING_BACK|RETIRED`. Factory Versions bind
`agentBindings[] {workflowAgentId, agentVersionId}` and readiness requires every
workflow agent bound to an `APPROVED` version with non-empty prompt/tool hashes
(`convex/factory/configuration.ts:1388-1399`).
**(d)** "Agent definitions, skills, tools, and harnesses configure execution; they
do not create a second lifecycle or authority hierarchy" (OVERVIEW.md:25-26;
ledger:33-35).
**(e)** "Agent definitions and Factory binding — Qualified".
**(f)** **Pattern.** Versioned agent genome (model + prompt hash + tool manifest
hash) bound into the Factory Version is a strong pattern; the persona YAML
shape is implementation detail.

### 1.9 Harnesses and harness manifests

**(a)** Yes — "Generic Harness Contract V1".
**(b)** `packages/workflow-engine/src/harnessManifests.ts` (394 lines),
`executorAdapter.ts` (820), `harnessContract.ts`; adapters in
`apps/orchestration-server/src/{codexExecutorAdapter,deepseekHarnessExecutorAdapter,
codexBedrockExecutorAdapter,fabExecutorAdapter,isolatedInvocationAdapter}.ts`,
`harnessAdapterRegistry.ts`; doc `docs/architecture/generic-harness-contract-v1.md`.
**(c)** Lifecycle: `prepare → execute → (cancel) → collectResult → cleanup`
(generic-harness-contract-v1.md:78-89). Manifest schema
`harness-capability-manifest/v1` (v2 for isolated-invocation) with sections
`identity{harnessId,harnessVersion,harnessCommit,adapterId,adapterVersion}`,
`effectiveConfigSha256`, `models`, `filesystem`, `shell`, `git`, `browser`,
`tools{native,mcp,structuredOutput,telemetry}`, `subagents`, `streaming`,
`context`, `headless`, `cancellation`, `sandbox`, `network`, `credentials`,
`telemetry`, `admission{maturity, executionBackends, requiredExternalControls,
prohibitedAuthorities}`, `limitations[]`. Values are `SUPPORTED|PARTIAL|UNSUPPORTED`.
Runtime artifact sidecar `harness-runtime-artifact/v1 {kind: EXECUTABLE|CONTAINER_IMAGE,
executableSha256, imageDigest, closureSha256?}`.
Known manifests (`harnessManifests.ts:355-361`): `codex/v1` (PRODUCTION,
backends persistent-worker+remote-sandbox, `tools.mcp: UNSUPPORTED`,
`telemetry.cost: UNSUPPORTED`), `deepseek-harness/0.2.0` (EXPERIMENTAL,
persistent-worker only, loopback Ollama `qwen3.5:35b-a3b-q8_0` pinned by digest),
`codex/bedrock-v1` (EXPERIMENTAL, remote-sandbox, `network: NONE`),
`isolated-invocation/1` and `/2` (EXPERIMENTAL, offline deterministic,
`inference: DENIED`).
`PROHIBITED_AUTHORITIES = [worker-leases, verification-subjects, verification-plans,
evidence-authority, github-publication, acceptance]`; `REQUIRED_EXTERNAL_CONTROLS =
[canonical-worker-lease, mission-control-sandbox-policy, repository-scope-reconciliation,
independent-verification, publication-permit]` (`harnessManifests.ts:62-77`).
**(d)** "The harness owns execution reliability, not business authority"
(README.md:436-437); "Normalized harness results are untrusted diagnostics"
(OVERVIEW.md:514); an installed adapter with a different executable/image "is
not the same admitted runtime" (contract doc:108-109); each adapter declares an
all-`NONE` authority profile.
**(e)** Contract: "Qualified architecture"; Codex: "Production admission";
DeepSeek/Fab/Bedrock: Experimental.
**(f)** **Spec-worthy.** The capability manifest schema, the sidecar runtime
artifact digest, `prohibitedAuthorities`, and the four-part identity
(Model Route / Harness / Runtime Artifact / Execution Backend) should be an FDLC
specification. `SUPPORTED|PARTIAL|UNSUPPORTED` tri-state is a good pattern.

### 1.10 Workers, worker admission, orchestration server

**(a)** Yes.
**(b)** `workspaceHostBindings` (`schema.ts:1689-1758`, `workerRuntime{sessionId,
generation, executionBackends, supportedExecutors[], sandboxCapabilities,
repositoryAccess[], factoryVersionBindings, readiness: STARTING|READY|DRAINING|BLOCKED,
draining, lastHeartbeatAt}`); `serviceCommandReceipts` (`1623-1652`);
`convex/executionWorker.ts`, `convex/serviceCommands.ts`, `convex/lib/factoryWorkerRuntime.ts`,
`convex/lib/serviceCommandAuth.ts`; `apps/orchestration-server/src/{factoryAttemptWorker,
factoryHostReporter,durableCodexWorker,serviceCommandClient,orchestrationSecurity}.ts`;
docs `docs/software-factory/worker-runtime-operations.md`,
`docs/architecture/remote-worker-enrollment-interface.md` (not read in full).
**(c)** Worker identity = stable `CODEX_WORKER_HOST_ID` + ephemeral session +
server-derived generation (worker-runtime-operations.md:15-23). Claim
(`attempts.claim`, ops doc:61-67) atomically checks registration, heartbeat,
readiness/draining, repository access, executor, isolation, required harness
capabilities, capability/config digests, provider/model, sandbox capabilities,
backend, profile qualification, Factory Version binding, and server-counted
leases; "the reported `currentRuns` value is observational only". Service
commands are HMAC-signed envelopes with `serviceId, capability, commandId,
claimedProjectId/RepositoryId, payloadDigest, issuedAt/expiresAt`; receipts
`RECEIVED|SUCCEEDED|FAILED|DENIED` with `replayDetectedAt`.
Host binding status `READY|MISSING|STALE|DIRTY|ERROR`.
**(d)** "Public clients cannot claim `SYSTEM` or `AGENT` authority to dispatch
work" (OVERVIEW.md:492-493); registration failure is fail-closed; worker "does
not discover, install, or select a profile independently" (ops doc:44-48).
**(e)** "Durable execution and recovery — Qualified"; fleet-scale not claimed.
**(f)** Admission check list is **spec-worthy** (FDLC "Harness" area: worker
admission MUSTs); HMAC envelope shape is a **pattern**.

### 1.11 Execution profiles

**(a)** Yes.
**(b)** `factoryExecutionProfiles` (`schema.ts:1278-1332`); `convex/factory/executionProfiles.ts`;
`convex/lib/executionProfile.ts`, `executionProfileAdmission.ts`;
ADR `docs/decisions/execution-profile-identity.md`.
**(c)** Immutable rows: `profileKey`+`version`, `profileDigest`, `immutableSnapshot`
(`factory-execution-profile/v1`, v2 for offline), `executor{adapter,version}`,
`harnessCapabilityManifest`+digest, `harnessEffectiveConfigSha256`,
`harnessRuntimeArtifact`+digest, `executionBackend: persistent-worker|remote-sandbox|
isolated-container`, `sandboxProfileId/Digest`, `modelCatalogId`, `modelRouteDigest`,
`modelQualificationDigest`, `isolationModes[]`, `requiredHarnessCapabilities[]`,
`requiredSandboxCapabilities[]`, `toolGrantId/Digest`, `qualificationStatus:
UNQUALIFIED|EVIDENCE_QUALIFIED`, `admissionStatus: DISABLED|OFFLINE_ELIGIBLE|
PRODUCTION_PILOT_ELIGIBLE|REVOKED`, `qualificationExpiresAt`.
Transitions (executionProfiles.ts:254,372,411-417): register → `DISABLED`;
qualify → `OFFLINE_ELIGIBLE` (offline) or `PRODUCTION_PILOT_ELIGIBLE`; revoke →
`REVOKED` (terminal; "never mutate the old receipt/profile", ops doc:257-259).
**(d)** "no active pointer ... cannot be routed or dispatched independently of a
Factory Definition Version" (`schema.ts:1275-1277`); "A profile revoked after a
valid lease is issued does not rewrite that in-flight Attempt; a retry is a new
Attempt and must pass current admission" (execution-routing-v1.md:105-107);
"Neither the router nor the profile can substitute another profile, model route,
harness, runtime artifact, backend, or adapter" (103-105).
**(e)** Implemented, gated (v40 rollout in ops doc).
**(f)** **Spec-worthy** as the FDLC "qualified execution composition" with an
explicit admission state machine and expiry.

### 1.12 Factory / Factory Version / factory releases

**(a)** Yes for Factory Definition + immutable Version + readiness + activation;
"factory releases" is a *code release* lifecycle (merge→deploy→verify), not a
"release of a new Factory Version".
**(b)** `factoryDefinitions` (`schema.ts:1197-1220`; status `DRAFT|ACTIVE|ARCHIVED`,
`activeVersionId`, `qualificationActivation`), `factoryDefinitionVersions`
(`1434-1505`), `factoryReadinessAssessments` (`1507-1536`), `factorySandboxProfiles`
(`1222-1273`); `convex/factory/configuration.ts` (`activate` at 1427-1495,
readiness checks 1348-1405); digest `convex/lib/factoryConfiguration.ts:79-95`;
releases `factoryReleases` (`8658-8731`), `factoryReleaseEvidence` (`8733-8758`),
`convex/factory/releases.ts`, `convex/lib/factoryRelease.ts`.
**(c)** Factory Version freezes: `repositoryId`, `repositoryDataClassification`,
`purpose: SOFTWARE|VERIFICATION|INTELLIGENT_AUTOMATION`, `workflowId`, `executor`,
harness manifest/config/runtime digests, execution profile identity + qualification,
model route + qualification, `executionBackend`, `sandboxProfile`, `codeScopeIds[]`,
`agentBindings[]`, `policyEnvelopeId`, `environmentId`, `budget{maxCostUsd≤1000,
maxRuntimeMinutes≤480, maxAttempts≤3}` (`factoryConfiguration.ts:116-120`),
`verifierIds[]`, `riskBoundary: GREEN|YELLOW|RED`, `recovery{pause,cancel,retry,resume}`,
`configurationDigest` (FNV-1a over canonical JSON, `factory-v1-<8hex>`).
Readiness assessment `status: PASS|BLOCKED` with checks `VERIFIED|MISSING|STALE|
WAIVED|NOT_APPLICABLE` and `expiresAt`; check IDs: `local-repository-admission,
github, repository, repository-classification, provider-egress, workflow,
workflow-contract, executor, execution-profile, governed-mcp, model-route,
qualification-environment, code-scopes, agent-manifests, policy, budget, verifiers,
sandbox-profile, host, recovery` (`configuration.ts:1348-1405`).
Activation (`configuration.ts:1468-1470`): "A current passing readiness assessment
for this exact Factory version is required" — status `PASS`, unexpired,
`configurationDigest` match; sets `factoryDefinitions.activeVersionId`.
Implicit Version machine: `created → assessed(PASS|BLOCKED) → active (definition
pointer) → superseded (new version) / archived`. Versions themselves have no
status column — activity is the pointer.
Release machine (`factoryRelease.ts:29-41`): staging `MERGED→DEPLOYED→VERIFIED|
ROLLED_BACK; VERIFIED→ROLLED_BACK`; production `ELIGIBLE→DEPLOYED→VERIFIED→PROMOTED;
{DEPLOYED,VERIFIED,PROMOTED}→ROLLED_BACK`. Evidence kinds `MERGE, DEPLOYMENT_APPROVAL,
DEPLOYMENT, PROVENANCE, SMOKE_TEST, HEALTH_CHECK, ROLLBACK, PRODUCTION_*`.
Production eligibility requires ≥3 distinct verified staging releases
(`factoryRelease.ts:105-113`, default `minimumVerifiedReleases = 3`).
**(d)** "Material changes create a new version and leave the previous version
auditable" (OVERVIEW.md:484-486); "Qualification alone does not activate the
version or authorize a particular WorkOrder" (VOCABULARY:63-64); "A later
reclassification therefore requires a new Factory version" (OVERVIEW.md:399-400);
readiness "is not an operator-set status" (README.md:250-252).
**(e)** Factory config: Qualified. Releases: "Release and production feedback —
Partial" (human merge outside V1 authority).
**(f)** **Spec-worthy.** Immutable Factory Version + derived readiness +
activation-requires-current-assessment is the FDLC "Factory Version
qualification" core. The release state machine is spec-worthy for the Deploy
phase. The FNV digest is implementation detail (FDLC should require SHA-256).

### 1.13 Model routing

**(a)** Yes — two routers: the older per-task *model* router and the newer
*execution tuple* router.
**(b)** `modelCatalog` (`schema.ts:1763-1817`), `modelRoutingPolicies` (`1819-1888`),
`agentModelOverrides` (`1890-1902`), `modelRoutingDecisions` (`1904-1964`);
`convex/modelRoutingPolicies.ts`, `convex/modelRoutingDecisions.ts`,
`convex/executionRouting.ts`, `convex/lib/executionRouting.ts` (759 lines),
`convex/lib/modelRouteAdmission.ts`, `convex/lib/factoryModelRoute.ts`;
`packages/model-router/src/*` (re-exports `resolveExecutionRoute` from
`@mission-control/shared`, `execution-routing.ts:1-24`); doc
`docs/architecture/execution-routing-v1.md`; ADR
`docs/decisions/model-route-runtime-identity-separation.md` (not read).
Note: there is no `convex/modelRouting.ts`; the file is `convex/executionRouting.ts`
plus the two policy/decision modules.
**(c)** Catalog entries carry `tier: FAST|BALANCED|POWERFUL`, `capabilities[]`,
`riskApproved`, `availability: HEALTHY|DEGRADED|RATE_LIMITED|UNAVAILABLE`,
additive exact-route lifecycle (`providerRoute`, `routeSnapshot`, `routeDigest`
= `factory-model-route/v2`, `qualificationStatus: UNQUALIFIED|EVIDENCE_QUALIFIED`,
`admissionStatus: DISABLED|PRODUCTION_PILOT_ELIGIBLE`, `costPolicyDigest`).
Policies: ordered `rules[] {taskType, operatingLane: PLAN|EXECUTE|REVIEW|LOCAL|
LONG_RUNNING, riskLevel, complexity, requiredCapabilities, modelId}`, `lanePools`,
`fallbackChain`, `killSwitch`, `canaryPercent`, and `executionRouting {mode:
ADVISORY|GUARDED_AUTO, evidenceWindowDays, minimumVerifiedAttempts,
minimumEvidenceCoverage, minimumScoreMargin, guardedAutoPromotedAt/By/Reason,
guardedAutoEvidenceDecisionIds}`. Defaults (`lib/executionRouting.ts:34-44`):
`ADVISORY`, 30 days, 5 verified attempts, 0.6 coverage, 5-point margin.
Decisions record `source: RUN_OVERRIDE|LANE_POOL|WORKFLOW_TIER|AGENT_OVERRIDE|
POLICY_RULE|WORKSPACE_DEFAULT|SYSTEM_DEFAULT`, `mode: SHADOW|ENFORCED|KILLED|
EXHAUSTED`, `alternativesConsidered[]`, `algorithmVersion`, `decisionDigest`,
`executionRoutingSnapshot`. Routing modes: `ADVISORY`, `GUARDED_AUTO`, `PINNED`
(via `workOrders.executionRoutingPin`) (execution-routing-v1.md:66-69).
**(d)** "The routed unit is an active immutable Factory Version. Mission Control
never constructs an arbitrary Cartesian product of model, harness, runtime, and
backend components at dispatch time" (routing doc:16-18); "An ineligible
candidate never receives a score" (84); "an unknown component contributes no
favorable score" (133-135); "RED/critical WorkOrders are never auto-routed in
V1" (206); "A hard budget with unknown estimated cost fails closed" (137);
Guarded Auto promotion is a separate mutation creating a new immutable policy
version plus a default-off flag `execution-routing.guarded-auto` (199-204;
`lib/executionRouting.ts:354`).
**(e)** "Implemented, gated"; Guarded Auto disabled (README.md:565-567).
**(f)** **Spec-worthy**: eligibility-before-score, evidence-window scoring with
explicit unknowns, frozen decision snapshot on the Attempt, and human-promoted
Guarded Auto with a kill switch. Lane-pool rule shape is implementation detail.

### 1.14 Capabilities / capability registry / Tool Version / Grant (MCP)

**(a)** Yes — narrow, but the most explicit capability-authority chain in the
repo.
**(b)** `mcpToolVersions` (`schema.ts:1336-1357`), `mcpToolGrants` (`1360-1383`),
`mcpToolCallReceipts` (`1387-1432`); `convex/factory/governedMcp.ts`,
`convex/lib/governedMcp.ts`; broker `apps/orchestration-server/src/governedMcpBroker.ts`,
`governedMcpContracts.ts`, `factoryGovernedMcpContext.ts`; ADR
`docs/decisions/governed-mcp-tool-capability.md`; policy
`docs/software-factory/governed-mcp-recertification-policy.md` (not read).
Legacy tool policy: `policies` table (`4000-4035`, `toolRiskMap`, `shellAllowlist`,
`fileWritePaths`, `networkAllowlist`), `toolCalls` (`3597-3649`, `riskLevel
GREEN|YELLOW|RED`, `policyResult`), `packages/policy-engine`.
**(c)** Authority chain: `WorkOrder → Attempt lease → Execution Profile → Tool
Grant → Tool Version → operation → authorization receipt → stdio MCP call →
completion receipt → run evidence` (ADR:21-23). Tool Version: `serverKey`,
`serverVersion`, `toolVersionDigest`, `enabled`, `qualificationStatus:
UNQUALIFIED|EVIDENCE_QUALIFIED`, `qualificationExpiresAt`, `revokedAt` —
"Registration is descriptive and disabled; qualification is the only path to
admission" (`schema.ts:1334-1335`). Grant: `state: ACTIVE|REVOKED`, `issuedAt`,
`expiresAt`, `grantDigest` — "Workspace-scoped, immutable, expiring authority
for exactly one operation" (1359). Receipt: `phase: AUTHORIZATION|COMPLETION`,
`status: ALLOWED|DENIED|SUCCEEDED|FAILED|CANCELED|TIMED_OUT`, `costStatus:
v.literal("UNKNOWN")`, `lateOrStale`, `poisoningDetected`, `redactionApplied`,
expected vs observed server version and input-schema digests.
**(d)** "MCP server discovery is descriptive input, not authority" (ADR:44);
"Tool output is untrusted content, not policy" (50); "An Attempt may invoke only
the exact tool operation frozen into its governed execution configuration" (52);
absent grant on a profile means `NO_TOOL_CAPABILITY`, never a default (27-30);
revocation mode `DENY_NEW_CALLS`; late completion "is not promoted to current
evidence or acceptance authority" (98-104).
**(e)** "Experimental; one real read-only operation qualified" (Context7
`query-docs`, fixed React query). Native harness tools "still lack the same
canonical authority" ("Native tool authorization — Partial").
**(f)** **Spec-worthy.** The Tool Version / Tool Grant / two-phase receipt model
is exactly the FDLC "Capability" area contract. The legacy `policies` tool-risk
map is implementation detail.

### 1.15 Sandboxing / Remote Sandbox

**(a)** Yes — backends `persistent-worker` (local worktree), `remote-sandbox`
(exe.dev, FakeSandboxProvider, Docker), `isolated-container` (offline
deterministic).
**(b)** `factorySandboxProfiles` (`schema.ts:1222-1273`), `sandboxAllocations`
(`1538-1592`), `sandboxCredentialGrants` (`1594-1618`);
`apps/orchestration-server/src/{sandboxProvider,exeDevSandboxProvider,
fakeSandboxProvider,dockerSandboxProvider,sandboxSupervisor,sandboxReconciler,
sandboxCredentials,sandboxResultBundle,remoteSandboxRuntime}.ts`; docs
`docs/architecture/remote-sandbox-execution.md`,
`docs/software-factory/remote-sandbox-runtime.md`,
`docs/security/remote-sandbox-threat-model.md` (not read).
**(c)** Sandbox Profile: `provider: EXE_DEV|FAKE|DOCKER|LOCAL_CONTAINER`,
`machineImage`, cpu/mem/disk, `executorTransport: SSH|DOCKER_STDIN|STDIO`,
`networkEgress: UNRESTRICTED|RESTRICTED_ALLOWLIST|DENY_ALL`, `publicIngress:
v.literal(false)`, `inferenceCredentialMode: ATTEMPT_SCOPED_OPENROUTER|NONE`,
`repositoryAccessMode: CONTROL_PLANE_SNAPSHOT|NONE`, `spendLimitUsd`,
`spendEnforcement`, `readinessState: READY|DEGRADED|BLOCKED` with expiry,
`egressEnforcementProven` (+provider/guest), `admissionState:
QUALIFICATION_ONLY|PRODUCTION_PILOT_ELIGIBLE|OFFLINE_ELIGIBLE`.
Allocation states (schema 1555-1560): `REQUESTED, ALLOCATING, READY, RUNNING,
RESULT_READY, CANCELING, TERMINATING, TERMINATED, FAILED, ORPHANED`;
`resourceAbsentAt`, `teardownReceipt`, `failureClass`. Credential grant states:
`ISSUED → REVOCATION_PENDING → REVOKED | EXPIRED`, `secretFingerprint` only.
Run events: `SANDBOX_REQUESTED, SANDBOX_ALLOCATED, SANDBOX_STARTED,
SANDBOX_RESULT_RECEIVED, SANDBOX_CANCELLATION_REQUESTED, SANDBOX_CREDENTIAL_REVOKED,
SANDBOX_TERMINATION_REQUESTED, SANDBOX_TERMINATED, SANDBOX_ORPHANED,
ORPHAN_RECONCILED, SANDBOX_FAILED` (`schema.ts:282-292`).
**Terminology drift**: `remote-sandbox-execution.md:128-137` documents
`REQUESTED → PROVISIONING → HEALTH_CHECKING → READY → RUNNING → RESULT_READY →
TEARING_DOWN → TERMINATED`; the schema uses `ALLOCATING`/`TERMINATING` and adds
`CANCELING`.
**(d)** Sandbox "receives no GitHub App, Mission Control service,
provider-management, or long-lived inference credentials" (OVERVIEW.md:550-551);
"The sandbox never pushes its own branch" (remote-sandbox-execution.md:152);
"requires provider resource-absence proof before publication can proceed"
(OVERVIEW.md:553); non-public repositories "cannot use Remote Sandbox unless
immutable profile evidence independently proves provider-enforced egress"
(OVERVIEW.md:145-147); manifest asserts `credentialsRevokedBeforePublication:
true` and `resourceAbsenceRequiredBeforePublication: true`
(`executionManifest.ts:132-135`).
**(e)** "Production-pilot eligible; Preview" (3/3 live exe.dev cohort; egress
not provider-enforced).
**(f)** **Spec-worthy** for the isolation invariants (no publication identity
in sandbox, credential revocation + resource absence before publication,
classification-gated egress). Provider lifecycle states are a **pattern**.

### 1.16 Leases (fenced leases, expiry, reclamation)

**(a)** Yes — central to durability.
**(b)** `workflowRuns.lease {leaseId, ownerId, workerId, workerSessionId,
workerGeneration, claimedAt, heartbeatAt, expiresAt}` (`schema.ts:5287-5296`),
`checkpointLease` ("historical workspace owner at a pause, never an active lease
or authority", 5281-5286), `executionClaimId/ClaimedBy/ClaimedAt/LeaseExpiresAt/
HeartbeatAt/AttemptNumber/StaleRecoveryCount/RetryOfClaimId/RetryReason`
(5473-5481), `executionQuarantine` (5464-5470), `executionCheckpoint` (5453-5463);
`operatorControls.leaseDurationMs/staleRecoveryLimit/mode: NORMAL|PAUSED|DRAINING|
KILLED|QUARANTINED` (3893-3916); `missionPlanningRuns.lease`;
`inferenceReservations.leaseId/leaseExpiresAt`; `convex/factory/attempts.ts`
(`claimInternal` 531+, `renewInternal` 1330+, `activeLeaseMatches`);
`convex/lib/executionRecovery.ts`; ADR `docs/decisions/worker-runtime-leases-recovery.md`
(not read).
**(c)** Lease = "a random fencing ID bound to worker ID, session, and generation.
It is not a credential" (worker-runtime-operations.md:20-21). Renewal "extends
the lease only for that complete identity"; "every hardened mutation also
re-checks the current server registration in the same transaction" (71-73).
Recovery states (`executionRecovery.ts:1-8`): `WAITING, ACTIVE, CANCELING,
RECOVERABLE, EXHAUSTED, RECOVERED, TERMINAL`; stale = `RUNNING` with no active
lease; `staleRecoveryCount` increments; quarantine after repeated stale loss
(CONTINUOUS_LEARNING.md:36-40). Runtime dispositions table
(worker-runtime-operations.md:105-115) maps observed conditions to
`RECOVERABLE|CANCELLED|FAILED|LOST`.
**(d)** "A stale process cannot report evidence or authorize publication after
expiry, replacement, cancellation, or session/generation change" (ops doc:70-71);
"Unknown or expired execution ownership becomes `LOST`, preserves the workspace,
and requires a new Attempt" (OVERVIEW.md:533-535); "A manifest PID is never used
to adopt or kill a process after restart" (ops doc:168-169); publication permit
validity is bounded by `min(approval.expiresAt, receipt.validUntil, lease.expiresAt)`
and rejected if within `PUBLICATION_SAFETY_WINDOW_MS` (`attempts.ts:1298-1304`).
**(e)** Qualified.
**(f)** **Spec-worthy**: fenced lease tuple (worker, session, generation, random
fence), heartbeat renewal, `LOST` disposition, and lease-bounded permits. The
reconciliation table is a good pattern for FDLC "Durable execution".

### 1.17 Verification / Verification Runs / Quality Gates / receipts

**(a)** Yes — the deepest part of the codebase.
**(b)** Tables `verificationRuns` (`schema.ts:2794-2848`), `verificationReceipts`
(`2727-2792`), `evidenceEnvelopes` (`2850-2910`), `qualityGateDecisions`
(`2912-2959`), `validationAssertions` (`2201-2224`); `workflowRuns.verificationSubject/
verificationAttemptBinding/verificationIsolationAttestation`; engine
`packages/workflow-engine/src/{verification,verificationPlan,verificationSubject,
verificationIndependence,verificationCurrentness,verificationDecision,
verificationAuthority,verificationIdentity}.ts`; Convex
`convex/lib/policyV2Verification.ts`, `currentVerification.ts`, `qualityGateDecision.ts`,
`verificationPersistence.ts`; worker `apps/orchestration-server/src/factoryVerification.ts`;
docs `verification-first-domain-contracts.md`, `verification-and-gate-state-machines.md`,
`verification-first-workorder-contract.md`, `verification-receipt.md`,
`v1-verification-profile.md` (last two not read in full).
**(c)** Verification Run status (schema): `PLANNED, RUNNING, COMPLETED, FAILED,
CANCELED` (doc says `PENDING→RUNNING→COMPLETED|ERROR|CANCELED` — **drift**).
Check status: `PASS|FAIL|SKIPPED|NOT_CONFIGURED|ERROR`. Verdict: `VERIFIED|
NOT_VERIFIED|BLOCKED|REQUIRES_HUMAN_REVIEW`. Check categories: `BUILD, TYPECHECK,
UNIT_TEST, INTEGRATION_TEST, CONTRACT_TEST, SECURITY, SECRETS, DEPENDENCY, POLICY,
CHANGE_BUDGET, ACCEPTANCE, INDEPENDENT_REVIEW`. Command classes: `BUILD, TYPECHECK,
TEST, LINT, SECURITY_SCAN, DEPENDENCY_SCAN, MIGRATION, INFRASTRUCTURE,
PRODUCTION_ACCESS, SECRETS_ACCESS, DESTRUCTIVE, PUBLISH`. Receipt status: `PENDING|
PASSED|FAILED|WAIVED|STALE`, `receiptScope: ACCEPTANCE_CRITERION|WORK_ORDER`,
`validUntil`, `invalidatedAt/ByRevisionId/ByReopenDecisionId`, `independenceValid`,
`decisionInputDigest`, `evidenceEnvelopeIds[]`. Verification Plan
(`verificationPlan.ts:39-60`): `planId`, `planDigest`, identity tuple,
`generatedBy{factoryDefinitionId, factoryDefinitionVersionId, attemptId,
executorInvocationId}`, `requirements[]`, `requiredRisks[]`, `discoveredRisks[]`,
`requiredEvidence[]`, `adversarial?`. Coverage v2 (`validators:369-381`).
Isolation attestation modes: `DETACHED_GIT_WORKTREE|FRESH_CLONE|REMOTE_SANDBOX|
AUTOMATION_SNAPSHOT|LOCAL_DOCKER_CANARY|ISOLATED_CONTAINER`.
Quality Gate: `state: ELIGIBLE|INELIGIBLE|UNKNOWN|STALE|WAIVER_REQUIRED|AWAITING_HUMAN`,
`mode: OBSERVE_ONLY|SHADOW|ENFORCED|EMERGENCY_BYPASS`, append-only; transitions
documented in state-machines doc:116-128; V1 appends one decision per recomputed
packet (`currentVerification.ts:193-266`, `metadata.authoritative: false`).
Independence (`verificationIndependence.ts:93-198`) requires: different Attempt,
`attemptPurpose = VERIFICATION`, `factoryPurpose = VERIFICATION`, Factory Version
purpose `VERIFICATION`, binding tuple match, separate `executorInvocationId`,
separate `leaseId`, `reportCapability === "verification:report"`,
`authorityStatus === "PASS"` ("The candidate modified files that determine its
own verification verdict; isolation cannot make that independent", 138-140),
isolation digest server-reproducible, clean initial and final subject match,
different worktree, Git-capable isolation mode, checkout attestation matching
`repositoryId/candidateSha/treeSha`.
**(d)** Invariants quoted in §3. Key: "Only `PASS` satisfies a mandatory check"
(state-machines:83); "Verification only establishes eligibility; acceptance still
occurs through `workOrders.accept`" (OVERVIEW.md:467-468); "Evidence never accepts
work" (domain-contracts:135); "Acceptance must never read this projection
[Quality Gate] back as authority" (`currentVerification.ts:190-192`).
**(e)** Qualified (System V2; 15/15 first-pass independent verification in V3).
**(f)** **Spec-worthy — the crown jewel.** Verification Subject, frozen
Verification Plan, verifier Attempt independence rules, check-status semantics,
verdict semantics, receipt validity/invalidation, and Quality Gate decision
modes should each become FDLC normative text.

### 1.18 Evidence envelopes and artifacts

**(a)** Yes.
**(b)** `evidenceEnvelopes` (`schema.ts:2850-2910`), `runArtifacts` (`3105-3134`),
`runEvents` (`3070-3103`), `missionHandoffs` (`2226-2249`), `harnessPrChecks`
(`8165-8238`), `prEvidenceReconciliations` (`8242-8265`).
**(c)** Envelope fields: `evidenceKey`, `checkId`, `category` (`TEST_RESULT,
BUILD_RESULT, STATIC_ANALYSIS, SECURITY_SCAN, COMMAND_LOG, FILE_DIFF, SCREENSHOT,
BROWSER_RESULT, PERFORMANCE_RESULT, REVIEW_RESULT, POLICY_RESULT, CI_RESULT,
RUNTIME_OBSERVATION`), `result` (check status), `acceptanceCriterionIds[]`,
`requirementIds`, `requiredRiskIds`, `producer{actorType: SYSTEM|SERVICE|AGENT|HUMAN,
actorId, role, independent, factoryPurpose, factoryDefinitionVersionId, attemptId,
executorInvocationId, executorAdapter}`, `tool{name,version,command,exitCode,durationMs}`,
`independence`, `artifactIds[]`, `sourceRevision`, `candidateRevision`, `contentHash`,
`provenance: LIVE|SYNTHETIC|DEMO|IMPORTED|LEGACY`, full identity tuple.
Artifact types: `CODE_DIFF, TEST_OUTPUT, BUILD_OUTPUT, LOG_BUNDLE, SCREENSHOT,
GENERATED_DOCUMENT, VERIFICATION_EVIDENCE, PULL_REQUEST, CHECKPOINT, AUTOMATION_DESIGN,
AUTOMATION_OUTPUT_SNAPSHOT, STRUCTURED_OUTPUT, OTHER`. Run event types: 56 literals
(`schema.ts:239-298`) covering execution, verification, sandbox, command policy,
retry, checkpoint, human intervention.
Documented evidence lifecycle (`RECORDED→USABLE→STALE|SUPERSEDED|REVOKED|CONFLICTED`,
state-machines:100-112) is **not** a schema column — it is a target; the schema
tracks `result` + `provenance` + receipt-level invalidation. Only `provenance ===
"LIVE"` and not `CONTROL_FIXTURE` evidence counts toward acceptance
(`currentVerification.ts:143-148`).
Handoff contract: `outcome: COMPLETE|INCOMPLETE|NEEDS_HUMAN_INPUT`,
`completed/incomplete/unknownAssertionIds`, `commands[] {command, exitCode}`,
`nextAction`, `nextOwner`; "Missing facts are represented as `unknown`, never
inferred" (governed-missions-contract.md:97-98).
**(d)** "Qualifying evidence binds its subject, actor, method, environment,
source revision, artifact, time, result, and currentness" (VOCABULARY:102-104);
"Never borrow proof from another Attempt, candidate, pull-request head, WorkOrder
revision, verifier, or policy" (OVERVIEW.md:1168-1169).
**(e)** Qualified.
**(f)** **Spec-worthy**: the envelope field set (producer identity +
independence + subject tuple + provenance class) is the FDLC "Evidence" record.
The documented lifecycle states should be adopted by FDLC even though MC has not
yet materialised them.

### 1.19 Provenance

**(a)** Yes, pervasively, but as digests/lineage fields rather than a single
provenance record type.
**(b)** Digests everywhere: `configurationDigest`, `executionManifestDigest`,
`qualityContractDigest`, `verificationContractDigest`, `verificationSubjectDigest`,
`verificationPlanDigest`, `evidenceSetDigest`, `decisionInputDigest`,
`receiptDigest`, `grantDigest`, `toolVersionDigest`, `profileDigest`,
`routeDigest`, `planDigest`, `contentHash`, `genomeHash`; actor source
`AUTHENTICATED|DEVELOPMENT_FALLBACK|SERVICE_COMMAND`; evidence `provenance` enum;
`factoryMemoryProvenanceValidator`; `factoryReleaseEvidence.kind: PROVENANCE|
PRODUCTION_PROVENANCE`; GitHub webhook ledger `githubWebhookDeliveries`
(`signatureStatus`, `replayState: ORIGINAL|DUPLICATE`); `serviceCommandReceipts`.
Supply-chain: harness runtime artifact `executableSha256/imageDigest/closureSha256`,
Fab pin `apps/orchestration-server/src/fabRuntimePin.ts` (43-file closure hash).
**(d)** "Immutable lineage. Revisions, candidates, subjects, plans, evidence,
decisions, and Attempts remain attributable. Newer data supersedes history; it
does not rewrite it" (OVERVIEW.md:1160-1162); "Every authoritative transition
records subject and prior version, actor and identity source, reason,
policy/contract version, idempotency key, timestamp, required evidence IDs,
before/after state, and invalidated dependent records" (state-machines:149-153).
**(e)** "Supply-chain provenance — Strong partial" (attestations not normalized
into every release consumption boundary).
**(f)** **Spec-worthy as a principle** (the transition audit contract quoted
above) and as a MUST list of digest bindings; concrete hash algorithms are
implementation detail (note the FNV-1a factory digest vs SHA-256 elsewhere).

### 1.20 Currentness (PR head, evidence freshness)

**(a)** Yes — a dedicated engine.
**(b)** `packages/workflow-engine/src/verificationCurrentness.ts`
(`evaluateCurrentVerificationEligibility` / `evaluatePrepublicationVerification`,
146-383); `convex/lib/currentVerification.ts`; provider heads from `harnessPrChecks`
(`headSha`, `prState`, `attestationExpiresAt`, `installationId`); `governancePolicies`
validity hours; `verificationReceipts.validUntil`; `factoryReadinessAssessments.expiresAt`;
`mcpToolGrants.expiresAt`; `approvalDecisions.expiresAt`.
**(c)** The algorithm (currentness.ts:155-383), in order: require Quality
Contract and verification-contract digests → pick the **newest** candidate-ready
`IMPLEMENTATION|AUTOMATION` source Attempt ("older passing candidates cannot be
reused") → source must be `COMPLETED` with canonical subject bound to the same
WorkOrder revision/contract → newest non-superseded `VERIFICATION` Attempt whose
binding tuple matches → `COMPLETED` → matching Verification Result, not
invalidated, `independenceValid === true`, plan identity and decision-input
digest present → verdict mapped to SUCCESS/FAILURE → matching WorkOrder-scope
receipt with same run/attempt/plan/subject, status consistent with verdict,
`independenceValid`, not invalidated, `validUntil > now`, decision-input digest
equal, evidence-set present with no duplicates and every envelope bound to the
same lineage → for `LOCAL_GIT` subjects a trusted verifier observation ≤60 s old
→ for GitHub subjects a trusted App projection with `state === "OPEN"`, same PR
number/URL, `headSha === candidateSha`, unexpired attestation, and (v2) a human
publication binding → then and only then `eligible: true`.
**(d)** "A moved pull-request head invalidates current eligibility until a new
exact subject and verification lineage pass" (OVERVIEW.md:466-467); "Late
evidence remains history and cannot advance the new subject" (VF-004); "even
independently verified `LOCAL_GIT` evidence is not acceptance-current without a
trusted publication projection" (ops doc:286-287).
**(e)** Qualified.
**(f)** **Spec-worthy** — this is FDLC's "currentness" concept implemented as a
deterministic total function. The ordering ("newest candidate first, never fall
back to an older pass") is a MUST.

### 1.21 Acceptance (WorkOrder acceptance, approvalDecisions)

**(a)** Yes.
**(b)** `convex/workOrders.ts:5279-5589` (`accept`); `convex/missions.ts:1523`
(`missions.accept`); `approvalDecisions` (`schema.ts:2695-2725`); `approvals`
(legacy, `3654-3709`); `approvalRecords` (ARM, `821-850`); `reviewJudgments`,
`decisionCandidates`, `residualReviewAnalyses` (advisory review intelligence,
`2963-3068`, all `acceptanceAuthority: v.literal(false)`).
**(c)** `accept` requires `actorType === "HUMAN"` (5289-5291), workspace
permission `factory.approve` + company `delivery.approve` (5295-5309), demo mode
only with `MC_ALLOW_LOCAL_OPERATOR_GOVERNED_ACCEPTANCE=1`; idempotent by key
(5313-5332); refuses `DONE|CANCELED|DRAFT`; refuses while any run is active
(5355-5357); for policy-v2 ENFORCED contracts recomputes currentness and appends
a Quality Gate decision, logging `WORK_ORDER_ACCEPTANCE_INELIGIBLE` +
`WORK_ORDER_ACCEPTANCE_REJECTED` on failure (5379-5410); requires the acceptance
run `COMPLETED`; checks approval status; writes `state: DONE`,
`acceptedRevisionNumber`, syncs legacy parent Task, logs `WORK_ORDER_ACCEPTED`.
Approval decision statuses: `PENDING|APPROVED|CONDITIONAL|REJECTED|REVISION_REQUESTED|
EXPIRED|SUPERSEDED|REVOKED`; actions `APPROVE|APPROVE_WITH_CONDITIONS|REJECT|
REQUEST_REVISION`; `expiresAt`, `invalidatedByRevisionId`, `workOrderRevisionNumber`.
**(d)** "Passing execution and verification only make a WorkOrder eligible for
acceptance; they do not accept it" (README.md:218-219); "The primary governed V1
product path is explicit acceptance by an authorized human. Current `main` also
retains limited orchestration and legacy automation callers that invoke this same
server-side mutation" (OVERVIEW.md:740-745) — note the mutation itself now
rejects non-HUMAN actors, so any such caller would fail **(uncertain whether
those callers still exist)**.
**(e)** Qualified (golden path).
**(f)** **Spec-worthy**: single acceptance boundary, human-only, idempotent,
recomputes currentness at decision time, and *records* ineligibility as events.

### 1.22 Human authority (server-authorized decisions, permits, Guarded Auto)

**(a)** Yes.
**(b)** `convex/lib/companyAccess.ts` (`COMPANY_PERMISSIONS`: `company.manage,
members.manage, workspaces.create/manage, repositories.manage, teams.manage,
delivery.assign/dispatch/write/verify/approve`; `FACTORY_PERMISSIONS`: `factory.read,
factory.improve, factory.approve, factory.automation.manage, factory.incident.control`,
lines 8-28); `deliveryAuthorization.ts`, `factoryActionAuthorization.ts`;
publication permit `convex/factory/attempts.ts:1136-1328`; `factoryContinuation`
on `workflowRuns` (`schema.ts:5493-5517`, statuses `AWAITING_HUMAN_REVIEW→
READY_TO_PUBLISH→PUBLICATION_AUTHORIZED→PUBLISHED|CLOSED`); matrix
`docs/security/human-service-authorization-matrix.md`; incident authority
`factoryIncidentControlAuthorizations` (`schema.ts:8827-8844`).
**(c)** Human review continuation (state-machines:137-147): verifier produces
`REQUIRES_HUMAN_REVIEW` → control plane reserves approval and pauses the same
Attempt → unconditional approval queues the same Attempt → worker re-verifies
manifest/candidate/receipt/approval/lease/checkpoint → control plane issues and
atomically consumes a short-lived permit `factory-publication:<runId>:<leaseId>:<ts>`
immediately before GitHub mutation. Permit validity = min(approval expiry,
receipt validUntil, lease expiry) minus safety window (`attempts.ts:1298-1304`).
Guarded Auto: policy-level `mode: GUARDED_AUTO` requires a separate promotion
mutation citing reviewed decision IDs and a default-off feature flag; incident
containment action `DISABLE_GUARDED_AUTO` exists (`factoryIncident.ts:22-26`).
**(d)** "Human approval is not a decorative UI state. It is a server-enforced
authority boundary" (README.md:217-218); "The browser does not decide which
company, workspace, repository, team, or delivery record an operator may act on"
(OVERVIEW.md:390-391); "Browser actor labels never determine authority or audit
attribution" (CONTINUOUS_LEARNING.md:140-141); "Verification eligibility does
not itself authorize GitHub writes" (VF-008).
**(e)** Enforced for company/workspace admin and Factory paths; Mission/WorkOrder
human-vs-service split "still require the tested golden-path security slice"
(authorization matrix:42-47). Enterprise multi-tenancy "Partial".
**(f)** **Spec-worthy**: permit-gated publication, named permissions per
consequential action, and the rule that advisory systems carry
`acceptanceAuthority: false` in their schema.

### 1.23 Recovery (attempts, checkpoints, reconciliation, zombie workers)

**(a)** Yes.
**(b)** `workflowRuns.{runtimeDisposition, runtimeDispositionReason,
runtimeReconciledAt, executionCheckpoint, checkpointLease, executionQuarantine,
retryDecision, failureClass, failureCode, failureStage, retryable,
humanInterventions}`; `convex/lib/executionRecovery.ts`, `preExecutionRecovery.ts`,
`localCandidateRecovery.ts`, `dockerAllocationRecovery.ts`; worker
`factoryWorkspaceOwnership.ts`, `sandboxReconciler.ts`; run events
`STALE_RUN_RECOVERED, RUN_QUARANTINED, CHECKPOINT_CREATED, RETRY_STARTED,
RETRY_COMPLETED, ORPHAN_RECONCILED`; docs worker-runtime-operations.md §"Deterministic
reconciliation" and §"Cleanup invariant"; `verification-failure-recovery-reconciliation.md`
(not read).
**(c)** Disposition table (ops doc:105-115) and recovery state machine
(`executionRecovery.ts`); cleanup runs only after six proofs (manifest match,
PID terminated, worktree registered, clean + HEAD == published PR head, exact PR
URL with matching lineage, exact github.com remote) and "ambiguity fails closed
to `PRESERVED`" (OVERVIEW.md:535-536). Read-only candidate recovery creates "a
new linked, fenced Attempt that transfers the already-owned workspace, attests
the existing commit and allowed-path diff ... It cannot publish" (ops doc:280-287).
Sandbox orphans: `ORPHANED → ORPHAN_RECONCILED` via reconciler.
**(d)** "Repeating the same failed action without new evidence is prohibited"
(north-star.md:150-151); "A retry creates normal new Attempt/run lineage ...
runtime recovery does not rewrite prior events, evidence, verification receipts,
or traces" (ops doc:117-119); "A mismatch is a preservation signal, not a repair
instruction" (100-101).
**(e)** Qualified (PR #62 cancel/retry/fail/success chain; V3 17 failure
injections).
**(f)** **Spec-worthy**: disposition vocabulary (`RECOVERABLE|LOST|CANCELLED|
FAILED|RETRYABLE`), "new Attempt for every retry", and fail-closed cleanup.
The six-proof cleanup list is a strong **pattern**.

### 1.24 Observability (traces, evals, telemetry)

**(a)** Yes.
**(b)** `traces` (`schema.ts:7185-7241`), `traceObservations` (`7243-7300`),
`evalDefinitions/evalScores/evalDatasets/evalDatasetItems/experiments/
experimentVariants` (`7302-7447`), eval control plane tables `evalSuites,
evalSuiteCases, evalBaselines, evalControlRuns, evalCaseResults, evalRunReceipts`
(`convex/lib/evalControlPlaneSchema.ts`); legacy `runs`, `toolCalls`, `opEvents`,
`executionTraces`, `costEvents`; `convex/observability.ts`, `convex/evalControlPlane.ts`,
`convex/lib/observabilityPersistence.ts`; `packages/shared/src/evalControlPlane.ts`;
`evals/mission-control-golden-v1/{baselines,receipts}`, `evals/schemas/eval-receipt.schema.json`.
Note: there is no `convex/evals.ts`; evals live in `observability.ts` +
`evalControlPlane.ts`.
**(c)** Trace `purpose: SOFTWARE|VERIFICATION|AUTOMATION|EVALUATION|SYSTEM`,
`status: RUNNING|SUCCESS|FAILED|CANCELED`, `tokenUsage`, `estimatedCostUsd`,
`humanInterventionCount`; observation `type: SPAN|GENERATION|AGENT|TOOL|RETRIEVAL|
EMBEDDING|EVENT|EVALUATOR`, links to `runEventId`, `verificationRunId`,
`evidenceEnvelopeIds`. Eval definitions `scope: OBSERVATION|TRACE|ATTEMPT|EXPERIMENT`,
`evaluatorType: DETERMINISTIC|LLM_JUDGE|HUMAN|EXTERNAL`. Eval control plane:
run status `QUEUED|RUNNING|COMPLETED|FAILED|CANCELED`; case verdict `PASS|FAIL|
INVALID|SKIPPED`; receipt verdict `PASS|WARN|FAIL|INVALID`; `releaseBlocking:
v.literal(false)` and `acceptanceAuthority: v.literal(false)`
(`evalControlPlaneSchema.ts:89-90,144-145`). Golden suite: 6 blocking cases + 7
negative controls; current receipt is `WARN` because token attribution is unknown
(README.md:384-387).
**(d)** "an eval score never becomes a verification receipt, exact-current Quality
Gate Decision, or acceptance" (OVERVIEW.md:594-596); "Skipped and invalid cases
never count as passing" (eval-control-plane-v1.md:42); "No placeholder value is
invented" (64).
**(e)** "Qualified diagnostic system" (traces/evals); Eval Control Plane
"committed; live pilot suite binding pending".
**(f)** Eval receipt with sealed assertions + negative controls +
`releaseBlocking:false` is **spec-worthy** for FDLC "Prove/Evaluation
engineering". Trace/observation schema is a **pattern** (OpenTelemetry-adjacent).

### 1.25 Evaluations (as a distinct concept)

Covered in 1.24. Additional: `contextEvalScenarios/Runs` (skill-level evals,
`schema.ts:6985-7052`), `operatorEvalScenarios/Runs/HumanObservations`
(`7079-7148`), `automationEvaluations`. Factory Learning experiments are
"human-approved canonical Evals experiment" with exactly two variants
(VOCABULARY:170-179). Promotion recommendation always returns
`statisticallySignificant: false` and `autoPromote: false`
(`convex/lib/factoryLearning.ts:567-633`); `< 30` samples → `LOW_SAMPLE`.
**(f)** The two-variant experiment + advisory recommendation is a **pattern**;
the "never claims significance / never auto-promotes" rule is **spec-worthy**.

### 1.26 Factory learning (signals, proposals, promotion)

**(a)** Yes — "proposal-only".
**(b)** `learningSignals` (`schema.ts:7457-7536`), `learningSignalClusters`
(`7538-7608`), `metaLoopSuggestions` (Improvement Candidate store, `8270-8365`),
`experiments/experimentVariants`; `convex/factory/learning.ts`, `convex/factory/metaLoop.ts`,
`convex/lib/factoryLearning.ts`, `convex/lib/metaLoopSignals.ts`; there is no
`convex/factoryLearning.ts`. Docs `factory-learning-continuous-improvement.md`,
`decisions/factory-self-improvement-governance.md`, `CONTINUOUS_LEARNING.md`.
**(c)** 17 signal types; sources `VERIFICATION_RECEIPT|QUALITY_GATE_DECISION|
WORKFLOW_RUN|RUN_EVENT|TRACE|HUMAN_DECISION|REVIEW_JUDGMENT|CONFIGURATION_REGISTRY|
MISSION_SPEC_QUALITY`; cluster status `BELOW_THRESHOLD|ACTIVE|CANDIDATE_CREATED|
SNOOZED|CLOSED`; candidate status `OPEN|ACCEPTED|WORK_ORDERED|IMPLEMENTED|VERIFIED|
EFFECTIVE|DISMISSED|SNOOZED|REJECTED|ROLLED_BACK|RETIRED`; 12 candidate types incl.
`REPLACE_AGENT_WITH_CODE`; recommendation `PROMOTION_RECOMMENDED|HOLD_RECOMMENDED|
REJECT_RECOMMENDED`. Pipeline: `Evidence → Signals → Clusters → Candidates →
Human review → frozen Experiment → Recommendation → Mission + submitted Plan →
separate human Plan approval` (OVERVIEW.md:601-611). Scanner window 30 days,
200 rows/query, version `factory-learning-v1`; no LLM calls in V1.
**(d)** "`LearningSignalInput.acceptanceAuthority` is typed as the literal
`false`, so the type system itself refuses a signal that claims otherwise"
(VOCABULARY:132-134); "The loop may not self-authorize, mutate governance,
bypass verification, or become a token sink" (198-199); "Recursive improvement
boundary — the system improving the factory is subject to the same policy,
verification, and acceptance controls as the work the factory performs" (201-204);
"Any evidence of acceptance, verification, routing, Factory Version, or repository
mutation from the learning subsystem is a release blocker" (learning arch:173-174).
**(e)** "Qualified; advisory"; promotion intentionally manual.
**(f)** **Spec-worthy**: the proposal-only loop, the recursive-improvement
boundary, and the risk-classification table (self-improvement-governance.md:43-50).
Signal taxonomy is a **pattern**.

### 1.27 Multi-factory orchestration

**(a)** **Partially / not in the FDLC sense.** MC has *many Factory Definitions
per workspace* (one per repository × purpose) and selects among their active
Versions for one WorkOrder, but no "factory registry", no objective→factory
router, and no cross-factory integration V&V.
**(b)** `factoryDefinitions.index by_repository_purpose_status`
(`schema.ts:1219`); `convex/lib/executionRouting.ts:376-378` loads "at most 25
active Factory Version candidates for the WorkOrder repository"; verifier
Factory selection `convex/factory/attempts.ts:3175-3177` (purpose `VERIFICATION`
with `activeVersionId`); `packages/coordinator` is a *legacy task*
decomposer/delegator (`index.ts:1-27`), not a factory coordinator; the only hit
for "factory registry" is a harness-adapter registry
(`docs/testing/evidence/capability-convergence-accounting-recovery-development/source-freeze-summary.json:130`).
**(c)** Routing scope = same repository; purpose axis `SOFTWARE|VERIFICATION|
INTELLIGENT_AUTOMATION` separates producer and verifier factories. Mission is
bound to one `repositoryId`; VF ADR revisit trigger names "multi-repository
Missions" as future (verification-first-architecture-decisions.md:113-118).
`factoryPackageImports` (`schema.ts:2142-2192`, schema
`fdlc.factory-deployment-package/v1`) imports an *external* "Factory Engineer"
package into a Mission/Plan draft — evidence that a cross-deployment handoff
format is emerging but it is an intake receipt, not orchestration.
**(e)** Missing/Future.
**(f)** FDLC must specify this itself; MC offers only the pattern of
purpose-separated Factory Definitions and repository-scoped routing.

### 1.28 Policy engine (packages/policy-engine)

**(a)** Yes, legacy.
**(b)** `packages/policy-engine/src/{evaluator,rules,allowlists}.ts`; `classifyRisk`
returns `green|yellow|red` from `TOOL_RISK_MAP`, upgraded to red on secrets/production
params (`evaluator.ts:19-35`); `requiresApproval` by autonomy level. Governed
equivalents: `governancePolicies`, `policyEnvelopes`, `changeRiskPolicies`
(`schema.ts:8114-8131`), `repositoryCodeScopes.approvalPolicy/verificationPolicy`,
`convex/lib/riskClassifier.ts`, `executionPolicy.ts`, `repositoryExecutionPolicy.ts`.
**(d)** "Risk is a server-owned minimum classification" (verification-first-workorder-contract.md:65-66);
"Command policy is privilege escalation, not blanket confirmation" (71-72).
**(e)** Legacy package: unqualified/implementation detail; governed policy tables: Qualified.
**(f)** Implementation detail. The *idea* of server-owned minimum risk with
`riskReasons[]` is a spec principle.

### 1.29 State machine package

**(a)** Yes, legacy Task-only (`packages/state-machine`, §1.5). No generic state
machine library governs WorkOrder/Attempt/Mission; those transitions are coded
inline in mutations and helper libs. **(f)** Implementation detail; FDLC should
not model its state machines on this package.

### 1.30 Identity / company / workspace scoping / authorization

**(a)** Yes.
**(b)** `tenants` (=Company, `schema.ts:586-602`), `projects` (=Workspace, 965-1026),
`workspaceRepositories` (1031-1083, `dataClassification: PUBLIC|INTERNAL|CONFIDENTIAL|
RESTRICTED`, `repositoryMode: GITHUB|LOCAL_SYNTHETIC_QUALIFICATION`),
`repositoryCodeScopes` (1656-1685), `environments` (dev|staging|prod), `operators`,
`roles`, `permissions`, `roleAssignments` (scope `tenant|project|team|repository|
environment`), `orgMembers` (systemRole `OWNER|ADMIN|MANAGER|MEMBER|VIEWER`),
`scrumTeams`, `teamMemberships`, `missionAssignments`, `scopeEnforcementReceipts`
(`stage: DISPATCH|EXECUTOR_BINDING`, `mode: SHADOW|ENFORCED|LEGACY`, `outcome:
ALLOWED|DENIED|MISMATCH`); `convex/lib/companyAccess.ts`, `companyContextGate.ts`,
`deliveryAuthorization.ts`; docs `docs/architecture/company-workspace-repository-control-plane.md`,
`MULTI_PROJECT_MODEL.md` (not read), `docs/security/human-service-authorization-matrix.md`.
**Terminology**: schema says `tenants`/`projects`; doctrine says Company/Workspace.
**(d)** "Resolve `projectId` to its tenant and authorize that relationship on the
server; never infer authority from a client-selected project alone"
(authorization matrix:29-31); missing classification "fail[s] closed as
UNCLASSIFIED" (`schema.ts:1064-1065`).
**(e)** "Multi-tenant enterprise operation — Partial".
**(f)** Company→Workspace→Repository→Code Scope hierarchy + data classification
gating execution is **spec-worthy**; RBAC tables are implementation detail.

### 1.31 GitHub App publication

**(a)** Yes.
**(b)** `githubAppInstallations` (`schema.ts:1088-1120`, `status: CONNECTED|DEGRADED|
REVOKED`, `permissions[]`, `lastTokenIssuedAt`), `githubAppSetupSessions`,
`githubWebhookDeliveries` (1146-1178), `harnessPrChecks` (PR head projection);
`apps/orchestration-server/src/{githubAppPublisher,githubAppRuntime}.ts`;
`convex/github.ts`, `githubAppConnections.ts`, `convex/factory/githubCi.ts`,
`convex/lib/githubAppAuth.ts`, `githubAppReadiness.ts`, `githubCiIngest.ts`;
docs `docs/security/github-app-connection.md`, `durable-codex-github-pr.md` (not read).
**(c)** Publication requires: active lease match + registration current
(`attempts.ts:1149-1158`), repository publication allowed, WorkOrder
`currentExecutionRunId === run` and revision match, for ENFORCED v2 contracts a
current `PREPUBLICATION` evaluation with matching candidate and human-resolved
receipt (1175-1183), required approvals current, bounded validity, then a
single-use permit; `subjectPublicationBinding` records permit + approval +
receipt + PR identity (`validators:277-282`). Webhooks: HMAC over untouched body,
delivery GUID replay ledger. App permissions in proof: Metadata read, Checks
read, Contents write, Pull requests write (OVERVIEW.md:783-785).
**(d)** "installation tokens, OAuth tokens, private keys, client secrets, and
webhook secrets are never stored in product records" (OVERVIEW.md:658-659);
"A changed head preserves old evidence as history and blocks acceptance until a
new exact lineage passes" (663-664); "Merge remains human-only in V1" (1135).
**(e)** Qualified (PRs #61/#62/#63); merge outside V1 authority.
**(f)** **Spec-worthy**: publication as a separately permitted, candidate-bound,
lease-bound action; PR-head projection as trusted provider evidence; signed
webhook + replay ledger.

### 1.32 Cost / budget accounting

**(a)** Yes — layered, honest about gaps.
**(b)** Legacy `costEvents` (`schema.ts:4256-4294`), `agents.budgetDaily/PerRun`,
`tasks.actualCost`; Factory budgets `factoryDefinitionVersions.budget`,
`missions.budgetUsd/spentUsd`, `workflowRuns.budgetUsd/spentUsd/reservedCostUsd/
executionCostAuthorization` (5390-5443, `actualCost.status: MEASURED|UNAVAILABLE`);
governed inference: `inferencePriceBooks` (4355-4385, `state: DRAFT|ACTIVE|RETIRED`),
`inferenceReservations` (4387-4423, `state: ACTIVE|EXHAUSTED|EXPIRED|CANCELLED`),
`inferencePhysicalIntents` (4425-4446, `PERSISTED|CLAIMED|CANCELLED|RECEIPTED|AMBIGUOUS`),
`inferencePhysicalReceipts` (4448-4491, `delivery: DELIVERED|NOT_DELIVERED|UNKNOWN`,
`usageCompleteness/costCompleteness: COMPLETE|PARTIAL|UNKNOWN`, `costClassification:
ESTIMATED|UNKNOWN`), `inferenceReconciliations`, `factoryOutcomeEvents` (stages
`VERIFICATION_PASSED|HUMAN_ACCEPTED|MERGED|DEPLOYED|PRODUCTION_VERIFIED|INCIDENT|
ROLLED_BACK|REJECTED|ABANDONED`), `factoryOutcomeProjections` (formula
`accepted-outcome-economics/v1|v2`, `costCoverage`, `confidence: HIGH|LOW|NONE`),
`inferenceRouteComparisons` (`status: NO_GO|ADVISORY_ONLY`,
`automaticPromotionAuthorized: v.literal(false)`), `factoryProviderPrices/Reservations/
UsageEvents`, `fabChatBudgets/UsageReceipts`, `workOrders.inferenceSpendingFence`;
docs `inference-dispatch-authority-contract.md`, `inference-ledger-identity-contract.md`,
`accounting-delivery-contract.md` (not read).
**(d)** "Unavailable cost remains `null` with a reason and coverage impact; it
cannot support an efficiency claim" (OVERVIEW.md:706-707); "failed and retried
Attempt spend remains part of the denominator cost" (execution-routing-v1.md:115-116);
"A WorkOrder fence blocks further inference admission; historical settlement
grants no execution authority" (OVERVIEW.md:216-218).
**(e)** "Cost per accepted outcome — Partial"; "Governed inference accounting —
Experimental; default off".
**(f)** **Spec-worthy**: `MEASURED|ESTIMATED|UNKNOWN` classification, cost
coverage, reservation→intent→receipt→reconciliation chain, and
"cost per accepted outcome includes failed work". Price-book shape is a pattern.

### 1.33 Incident response

**(a)** Yes — "Factory Incident Command".
**(b)** `factoryIncidents` (`schema.ts:8765-8806`), `repositoryDispatchControls`
(8810-8824), `factoryIncidentControlAuthorizations` (8827-8844),
`factoryIncidentControlReceipts` (8848-8873), `factoryIncidentTransitions`
(8875-8909), `factoryIncidentProposals` (8911-8932); `convex/lib/factoryIncident.ts`,
`factoryIncidentControl.ts`, `factoryIncidentDrills.ts`; `convex/factory/{incidents,
incidentControls,incidentControlObserver}.ts`; doc `factory-incident-command.md`.
**(c)** Phases (sequential only, `factoryIncident.ts:3-13,111-130`): `CLARIFY →
CONTAIN → OBSERVE → ISOLATE → RESTORE → CORRECT → PREVENT → MEASURE → RESOLVED`;
status `OPEN|CONTAINED|RECOVERING|MONITORING|RESOLVED`; severity `SEV1..SEV4`;
`containmentState: UNCONTAINED|CONTAINED|RESTORED`; containment actions
`PAUSE_REPOSITORY_DISPATCH, PAUSE_WORKSPACE_DISPATCH, CANCEL_ATTEMPT,
REVOKE_ATTEMPT_CREDENTIALS, QUARANTINE_WORKER|HARNESS|MODEL_ROUTE|TOOL|FACTORY_VERSION,
DISABLE_GUARDED_AUTO, HOLD_PUBLICATION, HOLD_RELEASE`; control receipts
`COMMAND_REQUESTED, COMMAND_ISSUED, ACKNOWLEDGED, EFFECT_OBSERVED, DISPATCH_DENIED`
(doc:42-58); restoration requires a prior expiring incident-scoped authorization
(`operation: RESUME_REPOSITORY_DISPATCH`).
**(d)** "An acknowledgment is diagnostic evidence; it cannot certify containment"
(README.md:516-517); "Restoration is a new consequential action and requires its
own current, incident-scoped authority" (517-518); "Only the independent observer
may produce EFFECT_OBSERVED rows" (`schema.ts:8846-8847`); "Closing an alert,
recovering an Attempt, or observing a healthy provider does not restore authority
or resolve an incident" (doc:27-29).
**(e)** "Production-qualified; one exact repository operation" (`PAUSE_REPOSITORY_DISPATCH`
on `jaydubya818/MissionControl`).
**(f)** **Spec-worthy**: the phase sequence, command/ack/effect separation, and
separate restoration authority belong in FDLC "Operate".

---

## 2. Mission Control → FDLC concept map

Status column uses MC's ledger; the parenthetical maps to Available (A) /
Experimental (E) / Planned (P).

| FDLC concept | MC object(s) | Primary file(s) | Status | Spec-worthy? |
| --- | --- | --- | --- | --- |
| Objective / Intent | `missions` | `convex/schema.ts:1969`; `convex/missions.ts` | Qualified (A) | **Y** — unit of intent; stop condition, budget, serial-mutation policy |
| Specification | `missionSpecRevisions`, `projectConstitutionRevisions`, `missionSpecQualityEvaluations`, `missionSpecDecisions` | `schema.ts:2271-2350`; `convex/missionSpecs.ts` | Qualified, default off (A/E) | **Y** — immutable revisions, `FINALIZED ≠ APPROVED`, digest lineage into Plan |
| Plan | `missionPlans`, `validationAssertions`, `missionPlanningRuns` | `schema.ts:2029`; `convex/missionPlanning.ts` | Qualified (A) | **Y** — author≠approver, approval≠dispatch, Quality Contract projection |
| Quality Contract | `missionPlans.qualityContractProjection/Digest` → `workOrders.qualityContractDigest` | `convex/lib/qualityContract.ts` | Implemented (A) | **Y** — projection, not aggregate |
| WorkOrder | `workOrders` + revisions/reopen/supersession/approvalDecisions | `schema.ts:2422`; `convex/workOrders.ts` | Qualified (A) | **Y** — executable contract, change budget, negative constraints |
| Task | `tasks` (+ transition matrix) | `schema.ts:3189`; `packages/state-machine` | Qualified legacy (A) | N — pattern only |
| Attempt | `workflowRuns` | `schema.ts:5233`; `convex/factory/attempts.ts` | Qualified (A) | **Y** — immutable try, frozen manifest |
| Candidate | `workflowRuns.verificationSubject` (+`headSha/treeSha`) | `packages/workflow-engine/src/verificationSubject.ts` | Qualified (A) | **Y** — exact commit+tree+diff+contract identity |
| Execution Manifest | `workflowRuns.executionManifest` (`factory-execution-manifest/v1..v4`) | `convex/lib/executionManifest.ts` | Qualified (A) | **Y** — frozen authority for one Attempt |
| Context Package | `factoryContextPackages` | `schema.ts:6619`; `convex/factoryMemory.ts` | Qualified advisory, flag-gated (E) | **Y** — frozen, digested, `acceptanceAuthority:false` |
| Skills / context registry | `contextPackages`, `contextPackageVersions`, manifests/locks | `schema.ts:6688-6834`; `packages/context-tools` | Qualified synthetic (A/E) | Pattern (lockfile pinning) |
| Factory Memory | `factoryMemory*`, `factoryEntities/Relationships` | `convex/factoryMemory.ts`; `packages/memory/src/factory` | Qualified advisory (E) | Principle only ("retrieval is context, not evidence") |
| Agent definition | `agentTemplates/Versions/Instances`, `agents/*.yaml`, `workflows` | `schema.ts:714-793,5147` | Qualified (A) | Pattern (versioned genome bound to Factory Version) |
| Harness | manifests + adapters (`codex/v1`, deepseek, bedrock, fab, isolated) | `packages/workflow-engine/src/harnessManifests.ts` | Codex Production; others E | **Y** — capability manifest, prohibited authorities, runtime artifact |
| Worker | `workspaceHostBindings.workerRuntime`, service commands | `schema.ts:1689,1623`; `apps/orchestration-server` | Qualified (A) | **Y** — admission MUSTs |
| Execution Profile | `factoryExecutionProfiles` | `schema.ts:1278`; `convex/factory/executionProfiles.ts` | Implemented, gated (A/E) | **Y** — qualified composition with admission states |
| Factory / Factory Version | `factoryDefinitions`, `factoryDefinitionVersions`, `factoryReadinessAssessments` | `schema.ts:1197,1434,1507`; `convex/factory/configuration.ts` | Qualified (A) | **Y** — immutable version, derived readiness, activation |
| Factory Version qualification | readiness assessment (`PASS/BLOCKED`, expiring) + `activate` | `configuration.ts:1348-1495` | Qualified (A) | **Y**, but MC's is *readiness*, not behavioural qualification (see §5) |
| Model Route | `modelCatalog` (`factory-model-route/v2`) | `schema.ts:1763`; `convex/lib/modelRouteAdmission.ts` | Implemented (A) | **Y** — inference-only identity + qualification |
| Routing | `modelRoutingPolicies/Decisions`, `executionRoutingSnapshot` | `convex/lib/executionRouting.ts` | Implemented, gated; Guarded Auto off (E) | **Y** — eligibility-before-score, human-promoted auto |
| Capability / Tool Version / Grant | `mcpToolVersions/Grants/CallReceipts` | `schema.ts:1336-1432`; `governedMcpBroker.ts` | Experimental, one real op (E) | **Y** — authority chain and two-phase receipts |
| Sandbox | `factorySandboxProfiles`, `sandboxAllocations`, `sandboxCredentialGrants` | `schema.ts:1222,1538,1594` | Production-pilot eligible; Preview (E) | **Y** (invariants) / pattern (lifecycle) |
| Lease | `workflowRuns.lease`, claim/renew | `convex/factory/attempts.ts:531,1330` | Qualified (A) | **Y** — fenced tuple, LOST disposition |
| Verification Subject / Plan | `workflowRuns.verificationSubject`, `verificationRuns.verificationPlan` | `packages/workflow-engine/src/verification{Subject,Plan}.ts` | Qualified (A) | **Y** |
| Verification Run / Result | `verificationRuns` | `schema.ts:2794` | Qualified (A) | **Y** |
| Independence | `verificationIndependence` result on run/receipt | `packages/workflow-engine/src/verificationIndependence.ts` | Qualified (A) | **Y** — 20+ enumerated failure reasons |
| Evidence | `evidenceEnvelopes`, `runArtifacts`, `runEvents` | `schema.ts:2850,3105,3070` | Qualified (A) | **Y** |
| Receipt | `verificationReceipts` | `schema.ts:2727` | Qualified (A) | **Y** |
| Quality Gate | `qualityGateDecisions` | `schema.ts:2912`; `convex/lib/qualityGateDecision.ts` | V1 implemented (A) | **Y** — states + modes |
| Currentness | `evaluateCurrentVerificationEligibility` | `packages/workflow-engine/src/verificationCurrentness.ts` | Qualified (A) | **Y** — deterministic function |
| Acceptance | `workOrders.accept`, `missions.accept` | `convex/workOrders.ts:5279` | Qualified (A) | **Y** — single human boundary |
| Human authority / permit | `factoryContinuation`, `authorizePublicationInternal`, permissions | `convex/factory/attempts.ts:1136`; `convex/lib/companyAccess.ts` | Qualified (A) | **Y** |
| Publication | GitHub App publisher, `subjectPublicationBinding`, `harnessPrChecks` | `apps/orchestration-server/src/githubAppPublisher.ts` | Qualified (A) | **Y** |
| Release / Deploy | `factoryReleases`, `factoryReleaseEvidence`, `deployments` | `schema.ts:8658`; `convex/lib/factoryRelease.ts` | Partial (E) | **Y** — staging/production state machines |
| Recovery | dispositions, checkpoints, quarantine, reconciliation | `convex/lib/executionRecovery.ts`; ops doc | Qualified (A) | **Y** |
| Observability | `traces`, `traceObservations` | `schema.ts:7185` | Qualified diagnostic (A) | Pattern |
| Evaluation | `evalDefinitions/Scores`, eval control plane | `convex/lib/evalControlPlaneSchema.ts` | Qualified diagnostic (A) | **Y** — sealed cases, negative controls, `releaseBlocking:false` |
| Learning signal / proposal | `learningSignals`, `learningSignalClusters`, `metaLoopSuggestions` | `schema.ts:7457,7538,8270` | Qualified advisory (A) | **Y** — proposal-only loop |
| Learning promotion | `recommendImprovementPromotion` → submitted Mission Plan | `convex/lib/factoryLearning.ts:567` | Manual (A) | **Y** — returns to Mission/Plan path |
| Factory registry / multi-factory routing | — (repository-scoped only) | `convex/lib/executionRouting.ts:376` | Missing (P) | FDLC must define |
| Objective planner across factories | — | — | Missing (P) | FDLC must define |
| Identity / tenancy | `tenants`, `projects`, `workspaceRepositories`, `repositoryCodeScopes`, RBAC | `schema.ts:586-1083,1656` | Partial (A) | **Y** (hierarchy + classification) |
| Provenance | digests + actor sources + webhook/service ledgers | pervasive | Strong partial (A) | **Y** (transition audit contract) |
| Cost / economics | inference reservation→receipt→reconciliation, outcome projections | `schema.ts:4355-4581` | Partial / Experimental (E) | **Y** (`MEASURED/ESTIMATED/UNKNOWN`) |
| Incident | `factoryIncidents` + controls | `schema.ts:8765-8932`; `convex/lib/factoryIncident.ts` | Production-qualified, one op (A) | **Y** — phases, cmd/ack/effect |
| Policy engine | `governancePolicies`, `policyEnvelopes`, `changeRiskPolicies`; legacy `packages/policy-engine` | `schema.ts:2595,798,8114` | Mixed | Principle only |

---

## 3. State machines found

Each is a candidate FDLC diagram. "Source" says whether states come from schema
(S), code (C) or doctrine (D).

1. **Mission** (S+D) — `DRAFT, PLANNING, AWAITING_PLAN_APPROVAL, READY, IN_PROGRESS,
   BLOCKED, AWAITING_VALIDATION, AWAITING_ACCEPTANCE, DONE, CANCELED, SUPERSEDED`.
   Transitions in §1.1 (governed-missions-contract.md:54-72).
2. **Mission Plan** (S) — `DRAFT → PROPOSED → APPROVED | REJECTED; APPROVED → SUPERSEDED`.
   Quality-contract projection overlay (D): `PLAN_DRAFT → PLAN_IN_REVIEW →
   PLAN_APPROVED → PROJECTION_COMPILED → PROJECTION_SUPERSEDED | WITHDRAWN | EXPIRED`.
3. **Mission Planning Run** (S) — `QUEUED → RESEARCHING → GENERATING → VALIDATING →
   SUCCEEDED | FAILED | CANCELED` (leased).
4. **Mission Spec revision** (S, implicit) — `revision → evaluated(PASS|FAIL) →
   FINALIZED`; any change = new revision.
5. **WorkOrder lifecycle** (S+C) — `DRAFT, READY, DISPATCHED, IN_PROGRESS, BLOCKED,
   AWAITING_APPROVAL, AWAITING_VERIFICATION, REOPENED, DONE, CANCELED, SUPERSEDED`.
   Derived from Attempt status by `nextStateForRunStatus` (`workOrderDispatch.ts:255-272`);
   `accept` → `DONE`; reopen → `REOPENED`; supersede → `SUPERSEDED`.
6. **WorkOrder verificationStatus** (S) — `PENDING, PASS, FAIL, WAIVED, STALE`.
7. **WorkOrder approvalStatus / approvalDecisions** (S) — `NOT_REQUIRED, PENDING,
   APPROVED, CONDITIONAL, REJECTED, REVISION_REQUESTED, EXPIRED, SUPERSEDED, REVOKED`.
8. **WorkOrder revision** (S) — `PENDING_APPROVAL → APPLIED | REJECTED | SUPERSEDED`
   with materiality `NO_ACTION | REVERIFICATION | REAPPROVAL | BOTH | FULL_REOPEN`.
9. **Task** (S+C) — 10 states, actor-gated matrix (`packages/state-machine/src/transitions.ts`).
10. **Attempt (workflowRuns.status)** (S+D) — `PENDING → RUNNING → PAUSED ⇄ RUNNING;
    RUNNING → COMPLETED | FAILED | CANCELED; PAUSED → FAILED | CANCELED`.
11. **Attempt executionPhase** (S) — `CLAIMED → PREPARING → EXECUTING → VALIDATING →
    AWAITING_HUMAN_REVIEW | AWAITING_VERIFICATION → PUBLISHING → TERMINAL`.
12. **Attempt runtimeDisposition** (S+D) — `RETRYABLE | RECOVERABLE | LOST | CANCELLED | FAILED`.
13. **Execution recovery** (C) — `WAITING, ACTIVE, CANCELING, RECOVERABLE, EXHAUSTED,
    RECOVERED, TERMINAL` (`executionRecovery.ts:1-8`).
14. **Human-review continuation** (S) — `AWAITING_HUMAN_REVIEW → READY_TO_PUBLISH →
    PUBLICATION_AUTHORIZED → PUBLISHED | CLOSED`.
15. **Verification Run** (S) — `PLANNED → RUNNING → COMPLETED | FAILED | CANCELED`
    (doc variant: `PENDING → RUNNING → COMPLETED | ERROR | CANCELED`).
16. **Check result** (S) — `PASS | FAIL | SKIPPED | NOT_CONFIGURED | ERROR` (terminal values).
17. **Verdict** (S) — `VERIFIED | NOT_VERIFIED | BLOCKED | REQUIRES_HUMAN_REVIEW`.
18. **Verification Receipt** (S) — `PENDING → PASSED | FAILED | WAIVED; → STALE`;
    invalidation by revision/reopen.
19. **Evidence lifecycle** (D only) — `RECORDED → USABLE → STALE | SUPERSEDED |
    REVOKED | CONFLICTED; RECORDED → REJECTED`.
20. **Quality Gate Decision** (S+D) — `UNKNOWN → INELIGIBLE | STALE | WAIVER_REQUIRED |
    AWAITING_HUMAN | ELIGIBLE; WAIVER_REQUIRED → UNKNOWN; AWAITING_HUMAN → ELIGIBLE;
    ELIGIBLE → STALE | INELIGIBLE`; modes `OBSERVE_ONLY | SHADOW | ENFORCED | EMERGENCY_BYPASS`.
21. **Factory Definition** (S) — `DRAFT → ACTIVE → ARCHIVED`; **Factory Version**
    (C, implicit) — `created → assessed(PASS|BLOCKED, expiring) → active pointer →
    superseded`.
22. **Readiness check** (S) — `VERIFIED | MISSING | STALE | WAIVED | NOT_APPLICABLE`.
23. **Execution Profile admission** (S+C) — `DISABLED → OFFLINE_ELIGIBLE |
    PRODUCTION_PILOT_ELIGIBLE → REVOKED`; qualification `UNQUALIFIED → EVIDENCE_QUALIFIED`.
24. **Sandbox Profile admission** (S) — `QUALIFICATION_ONLY | PRODUCTION_PILOT_ELIGIBLE |
    OFFLINE_ELIGIBLE`; readiness `READY | DEGRADED | BLOCKED`.
25. **Sandbox Allocation** (S) — `REQUESTED → ALLOCATING → READY → RUNNING → RESULT_READY
    → TERMINATING → TERMINATED; → CANCELING; → FAILED; → ORPHANED (→ reconciled)`.
26. **Sandbox Credential Grant** (S) — `ISSUED → REVOCATION_PENDING → REVOKED | EXPIRED`.
27. **Model catalog admission** (S) — `UNQUALIFIED → EVIDENCE_QUALIFIED`;
    `DISABLED → PRODUCTION_PILOT_ELIGIBLE`.
28. **Routing decision mode** (S) — `SHADOW | ENFORCED | KILLED | EXHAUSTED`; policy
    `ADVISORY → GUARDED_AUTO` (promotion) with `killSwitch`.
29. **Tool Version / Grant** (S) — Version `UNQUALIFIED → EVIDENCE_QUALIFIED (→ revoked/expired)`;
    Grant `ACTIVE → REVOKED | expired`; call receipt `AUTHORIZATION(ALLOWED|DENIED) →
    COMPLETION(SUCCEEDED|FAILED|CANCELED|TIMED_OUT)`.
30. **Worker readiness** (S) — `STARTING → READY → DRAINING | BLOCKED`; host binding
    `READY | MISSING | STALE | DIRTY | ERROR`; operator control `NORMAL | PAUSED |
    DRAINING | KILLED | QUARANTINED`.
31. **Inference reservation / intent / receipt** (S) — reservation `ACTIVE → EXHAUSTED |
    EXPIRED | CANCELLED`; intent `PERSISTED → CLAIMED → RECEIPTED | CANCELLED | AMBIGUOUS`;
    receipt `SUCCEEDED | FAILED | CANCELLED | TIMED_OUT | UNKNOWN` × delivery
    `DELIVERED | NOT_DELIVERED | UNKNOWN`.
32. **Factory outcome stage** (S) — `VERIFICATION_PASSED → HUMAN_ACCEPTED → MERGED →
    DEPLOYED → PRODUCTION_VERIFIED | INCIDENT | ROLLED_BACK | REJECTED | ABANDONED`.
33. **Factory Release (staging)** (C) — `MERGED → DEPLOYED → VERIFIED | ROLLED_BACK;
    VERIFIED → ROLLED_BACK`. **Production** — `ELIGIBLE → DEPLOYED → VERIFIED → PROMOTED;
    {DEPLOYED, VERIFIED, PROMOTED} → ROLLED_BACK`.
34. **Agent Version** (S) — `DRAFT → TESTING → CANDIDATE → APPROVED → DEPRECATED → RETIRED`;
    **Agent Instance** — `PROVISIONING → ACTIVE ⇄ PAUSED | READONLY → DRAINING →
    QUARANTINED | RETIRED`; **Deployment** — `PENDING → ACTIVE → ROLLING_BACK | RETIRED`.
35. **Context package / version** (S) — package `DRAFT → ACTIVE → DEPRECATED`;
    version `DRAFT → PUBLISHED → DEPRECATED`; security `UNSCANNED → PASSED | FAILED |
    QUARANTINED`; installation `INSTALLED | STALE | MISSING | INCOMPATIBLE`.
36. **Learning cluster** (S) — `BELOW_THRESHOLD → ACTIVE → CANDIDATE_CREATED | SNOOZED | CLOSED`.
37. **Improvement Candidate** (S) — `OPEN → ACCEPTED → WORK_ORDERED → IMPLEMENTED →
    VERIFIED → EFFECTIVE; OPEN → DISMISSED | SNOOZED | REJECTED; → ROLLED_BACK | RETIRED`.
38. **Experiment** (S) — `DRAFT → RUNNING → COMPLETED | FAILED | CANCELED`;
    recommendation `PROMOTION_RECOMMENDED | HOLD_RECOMMENDED | REJECT_RECOMMENDED`.
39. **Eval control run / receipt** (S) — run `QUEUED → RUNNING → COMPLETED | FAILED |
    CANCELED`; case `PASS | FAIL | INVALID | SKIPPED`; receipt `PASS | WARN | FAIL | INVALID`.
40. **Factory Incident** (S+C) — phase `CLARIFY → CONTAIN → OBSERVE → ISOLATE →
    RESTORE → CORRECT → PREVENT → MEASURE → RESOLVED` (strictly sequential,
    `factoryIncident.ts:128-130`); status `OPEN → CONTAINED → RECOVERING → MONITORING →
    RESOLVED`; containment `UNCONTAINED → CONTAINED → RESTORED`; control receipts
    `COMMAND_REQUESTED → COMMAND_ISSUED → ACKNOWLEDGED → EFFECT_OBSERVED (+ DISPATCH_DENIED)`.
41. **Research source** (D) — `Draft → Verified → Active ⇄ Paused → Degraded → Revoked → Retired`
    (CONTINUOUS_LEARNING.md:83-93).
42. **GitHub App installation** (S) — `CONNECTED → DEGRADED | REVOKED`; webhook delivery
    `RECEIVED → PROCESSED | IGNORED | FAILED` × `ORIGINAL | DUPLICATE`.
43. **Service command receipt** (S) — `RECEIVED → SUCCEEDED | FAILED | DENIED` (+ replay).

---

## 4. Invariants / rules that should become FDLC principles or spec MUSTs

Quoted verbatim with source. Grouped by FDLC area.

**Authority separation**
- "execution completed ≠ verification passed / verification passed ≠ exact-current gate eligible / gate eligible ≠ WorkOrder accepted / WorkOrder accepted ≠ pull request merged / pull request merged ≠ production verified" — README.md:194-200.
- "The actor that produced a material change cannot be the sole authority that certifies it." — README.md:132-133.
- "No lower state silently completes its parent." — README.md:138-139.
- "No subsystem gains a later authority merely because it completed an earlier step." — OVERVIEW.md:718-719.
- "Passing execution and verification only make a WorkOrder eligible for acceptance; they do not accept it." — README.md:218-219.
- "`workOrders.accept` is the canonical WorkOrder acceptance boundary and the only implementation that writes the `WORK_ORDER_ACCEPTED` transition." — OVERVIEW.md:734-736.
- "Approval never dispatches an agent, starts a WorkflowRun, satisfies a WorkOrder risk approval, merges code, or deploys software." — governed-missions-contract.md:33-34.
- "`FINALIZED` means planning-ready only. It is intentionally not APPROVED and carries no execution, verification, publication, or acceptance authority." — `convex/schema.ts:2333-2334`.
- "Verification eligibility does not itself authorize GitHub writes ... Publication requires a short-lived, candidate-bound, lease-bound permit immediately before mutation." — VF-008.
- "Advisory stays advisory. Memory, traces, evals, and learning cannot become evidence or authority by implication." — OVERVIEW.md:1166-1167. (Enforced by `acceptanceAuthority: v.literal(false)` on 10 tables in `convex/schema.ts` (lines 2997, 3026, 3064, 6639, 6672, 6862, 6904, 6936, 7525, 7594), 2 in `evalControlPlaneSchema.ts`, and `v.optional(v.literal(false))` on `metaLoopSuggestions` at 8340.)

**Fail-closed evidence**
- "Missing, stale, skipped, unconfigured, errored, insufficiently independent, or conflicting proof cannot become verified success." — OVERVIEW.md:465-466.
- "Only `PASS` satisfies a mandatory check." — verification-and-gate-state-machines.md:83.
- "Evidence never accepts work. It supports or refutes a claim evaluated by policy." — verification-first-domain-contracts.md:135.
- "Never borrow proof from another Attempt, candidate, pull-request head, WorkOrder revision, verifier, or policy." — OVERVIEW.md:1168-1169.
- "This intentionally chooses the newest candidate and newest exact-bound Verification Attempt before it looks at a verdict. It never falls back to an older pass." — `verificationCurrentness.ts:125-127`.
- "A moved pull-request head invalidates current eligibility until a new exact subject and verification lineage pass." — OVERVIEW.md:466-467.
- "Missing token, cost, model-request, or retry telemetry remains `null`; Mission Control never invents zeroes." — OVERVIEW.md:514-516.
- "Missing facts are represented as `unknown`, never inferred." — governed-missions-contract.md:98.
- "Skipped and invalid cases never count as passing." — eval-control-plane-v1.md:42.

**Independence**
- "The candidate modified files that determine its own verification verdict; isolation cannot make that independent." — `verificationIndependence.ts:138-139`.
- "Verification must use a separate executor invocation." / "... a separate execution lease." — `verificationIndependence.ts:130,134`.
- "Lineage isolation (separate Attempt, lease, worktree, invocation) proves the verifier was a *different process*. It does not prove the verifier applied a *different standard*." — `verificationIndependence.ts:67-70`.
- "A worker handoff is never proof of pass." — governed-missions-contract.md:16.

**Immutability and lineage**
- "Retries, corrections, and recovery create new Attempts rather than rewriting history." — FACTORY_VOCABULARY.md:87-88.
- "Newer data supersedes history; it does not rewrite it." — OVERVIEW.md:1161-1162.
- "Material changes create a new version and leave the previous version auditable." — OVERVIEW.md:485-486.
- "A later reclassification therefore requires a new Factory version instead of silently changing an active execution boundary." — OVERVIEW.md:399-400.
- "Every authoritative transition records subject and prior version, actor and identity source, reason, policy/contract version, idempotency key, timestamp, required evidence IDs, before/after state, and invalidated dependent records." — verification-and-gate-state-machines.md:151-153.
- "A new approved Plan revision creates a new projection and digest." — verification-first-domain-contracts.md:60-61.

**Admission and configuration**
- "Readiness is derived from current repository, worker, runtime, policy, and qualification evidence; it is not an operator-set status." — README.md:250-252.
- "Qualification alone does not activate the version or authorize a particular WorkOrder." — FACTORY_VOCABULARY.md:63-64.
- "Mission Control never constructs an arbitrary Cartesian product of model, harness, runtime, and backend components at dispatch time." — execution-routing-v1.md:16-18.
- "An installed adapter with a different executable or image is not the same admitted runtime." — generic-harness-contract-v1.md:108-109.
- "An ineligible candidate never receives a score." — execution-routing-v1.md:84.
- "A hard budget with unknown estimated cost fails closed." — execution-routing-v1.md:137.
- "RED/critical WorkOrders are never auto-routed in V1." — execution-routing-v1.md:206.
- "Unknown or stale authority fails closed." — README.md:128.

**Capabilities / tools**
- "MCP server discovery is descriptive input, not authority." — governed-mcp-tool-capability.md:44.
- "Tool output is untrusted content, not policy." — ibid.:50.
- "An Attempt may invoke only the exact tool operation frozen into its governed execution configuration." — ibid.:52.
- "A historical profile without that field means `NO_TOOL_CAPABILITY`; it does not inherit a default." — ibid.:28-29.

**Context**
- "Retrieval from it is context, not evidence." — FACTORY_VOCABULARY.md:52.
- "A package supplies material to reason with. It does not grant authority, and loading one does not certify its contents are current." — FACTORY_VOCABULARY.md:33-35.
- "Retrieved content is untrusted data. It cannot grant tool, identity, permission, execution, approval, or acceptance authority." — factory-memory-context-intelligence.md:123-125.

**Durability / recovery**
- "A stale process cannot report evidence or authorize publication after expiry, replacement, cancellation, or session/generation change." — worker-runtime-operations.md:70-71.
- "Unknown or expired execution ownership becomes `LOST`, preserves the workspace, and requires a new Attempt." — OVERVIEW.md:533-535.
- "A mismatch is a preservation signal, not a repair instruction." — worker-runtime-operations.md:100-101.
- "Repeating the same failed action without new evidence is prohibited." — mission-control-north-star.md:150-151.
- "Inability to prove absence is not permission to retry." — operating-contract-evidence-map.md:48.

**Sandbox / publication**
- "The sandbox never pushes its own branch." — remote-sandbox-execution.md:152.
- "Installation tokens, OAuth tokens, private keys, client secrets, and webhook secrets are never stored in product records." — OVERVIEW.md:658-659.
- "Merge remains human-only in V1." — OVERVIEW.md:1135.

**Learning / self-improvement**
- "The system improving the factory is subject to the same policy, verification, and acceptance controls as the work the factory performs." — FACTORY_VOCABULARY.md:201-204.
- "The loop may not self-authorize, mutate governance, bypass verification, or become a token sink." — FACTORY_VOCABULARY.md:198-199.
- "Any evidence of acceptance, verification, routing, Factory Version, or repository mutation from the learning subsystem is a release blocker." — factory-learning-continuous-improvement.md:173-174.
- "The result always reports `statisticallySignificant: false` and `autoPromote: false`." — FACTORY_VOCABULARY.md:188-189.

**Incident**
- "An acknowledgment is diagnostic evidence; it cannot certify containment." — README.md:516-517.
- "Restoration is a new consequential action and requires its own current, incident-scoped authority." — README.md:517-518.

**Economics**
- "Unavailable cost remains `null` with a reason and coverage impact; it cannot support an efficiency claim." — OVERVIEW.md:706-707.
- "Failed and retried Attempt spend remains part of the denominator cost." — execution-routing-v1.md:115-116.

**Maturity discipline (meta-principle)**
- "No family is labeled AVAILABLE merely because current main contains code." — capability-maturity ledger:61.
- "Architecture documents define intended contracts. Plans describe proposed or historical work. Evidence packages prove behavior at an exact revision." — README.md:847-849.

---

## 5. What MC does NOT implement that the FDLC vision requires

1. **Immutable Factory Version *qualification* (behavioural).** MC's
   `factoryReadinessAssessments` is a *configuration readiness* check
   (repository, GitHub, workflow, executor, profile, MCP, model route, scopes,
   agent manifests, policy, budget, verifiers, sandbox, host, recovery —
   `configuration.ts:1348-1405`). It proves the composition is *admissible*, not
   that the Factory Version *performs* on a workload cohort. Behavioural
   qualification exists only for sub-components (model route qualification
   snapshots, execution-profile qualification receipts with `workloadClasses`/
   `riskClasses` scope, `factoryConfiguration.ts:178`) and as out-of-band evidence
   packages (`docs/testing/evidence/production-factory-pilot-v3`). There is no
   table binding "Factory Version X passed qualification suite Y with receipt Z"
   in the control plane. The eval control plane (`evalRunReceipts`) is explicitly
   `releaseBlocking: false`.
2. **Factory registry and capability-based routing across factories.** Routing
   is repository-scoped (`executionRouting.ts:376-378`) and selects among
   Factory Versions of the *same* repository. No registry of factories with
   declared capabilities, no objective→factory matching, no cross-workspace
   factory discovery.
3. **Objective planner above Missions.** `missionPlanningRuns` plans *one*
   Mission for *one* repository. Portfolio decomposition of an objective into
   multiple Missions/factories is manual (`missionAssignments`, `scrumTeams`
   are HR-style records, not planners). The legacy `packages/coordinator`
   decomposes *tasks* to *agents*, not objectives to factories.
4. **Learning proposal → qualification → approval → new Factory Version pipeline.**
   MC stops at `Improvement Candidate → experiment → recommendation → submitted
   Mission Plan`. The Plan then follows the ordinary WorkOrder path; there is no
   automatic or even semi-automatic "create new Factory Version from accepted
   improvement, qualify it, activate it" step, and `experimentVariants.
   factoryDefinitionVersionId` is optional and unrouted. `inferenceRouteComparisons.
   automaticPromotionAuthorized: v.literal(false)`.
5. **Multi-factory integration V&V.** Verification is per WorkOrder/candidate.
   There is no integration-level Verification Subject spanning multiple
   candidates, repositories or factories. VF ADR lists "multi-repository
   Missions" as a revisit trigger, i.e. unaddressed.
6. **Deploy/Activate/Production-verify as a governed Factory stage.**
   `factoryReleases` exists with state machines, but the ledger marks release
   "Partial": merge is human and outside authority; production observation
   feeds no learning loop yet ("Observe one real release and feed rollback/
   customer outcome into governed learning" is the next gate).
7. **Generalised capability/tool authority.** Only one MCP fixture + one
   Context7 read is qualified; harness-native tools "still lack the same
   canonical authority" (ledger). No write-capable tool contract (ADR §Consequences
   lists what a write phase must add).
8. **Evidence lifecycle states.** The documented `RECORDED→USABLE→STALE|SUPERSEDED|
   REVOKED|CONFLICTED` machine is not a schema column; only receipt-level
   invalidation and provenance class exist.
9. **Fleet-scale worker enrollment / remote workers.** Single outbound-polling
   worker per host; "does not provision remote compute, open inbound ports,
   enroll internet workers" (worker-runtime-operations.md:10-13).
10. **Complete cost attribution.** Model/provider cost per accepted outcome is
    `null` in the retained V3 evidence; governed inference accounting is
    default-off.
11. **Cross-company tenancy proof.** Company/workspace scoping exists; live
    cross-company denial tests are a pending gate.
12. **Generic state-machine specification.** Transitions are inlined per
    mutation; there is no declarative, testable transition table for Mission/
    WorkOrder/Attempt comparable to the legacy Task matrix. FDLC diagrams must be
    reconstructed (as in §3), and MC has documented/schema drift (§7).

---

## 6. Strongest worked-example flows for FDLC guides

1. **Real Codex → GitHub PR golden path** —
   `docs/testing/evidence/real-codex-github-pr-golden-path/README.md`. PR #61
   (clean recovered Mission: exact Mission/Plan/WorkOrder/Task/Attempt/branch/
   commit/file/PR lineage, Mission `DONE` with 1/1 assertions), PR #62
   (cancel → two failed retries → fourth Attempt success, immutable retry
   history, restart without duplicate PR), PR #63 (signature-valid
   `pull_request.edited` webhook, exact head correlation). Best single example
   of Intent→Plan→WorkOrder→Attempt→evidence→PR→human acceptance with recovery.
2. **Policy-v2 independent verification and currentness** — the pair
   `packages/workflow-engine/src/verificationIndependence.ts` (enumerated
   independence failures) and `verificationCurrentness.ts` (ordered currentness
   check), backed by `docs/testing/evidence/system-factory-e2e-v2` and
   `production-factory-pilot-v3` (15/15 first-pass independent verification, 17
   fail-closed injections). Ideal for an FDLC "Trust" chapter walkthrough.
3. **Human review continuation and permit-gated publication** —
   `docs/software-factory/verification-and-gate-state-machines.md:137-147` plus
   `convex/factory/attempts.ts:1136-1328` and evidence
   `docs/testing/evidence/pr-72-human-review-resume`,
   `human-review-live-exercise-v2`. Shows `REQUIRES_HUMAN_REVIEW` → paused
   Attempt → approval → single-use permit bounded by lease/approval/receipt.
4. **Governed MCP capability (Phase 3 fixture + Phase 4 Context7)** —
   `docs/decisions/governed-mcp-tool-capability.md`,
   `docs/testing/evidence/governed-mcp-phase4-recovery/README.md`. Cleanest
   illustration of Tool Version → Grant → authorization receipt → call →
   completion receipt, with revocation/replay/late-completion semantics.
5. **Factory Incident Command production drill** —
   `docs/testing/evidence/factory-incident-command-production-v55/README.md`,
   incident `INC-MTQR363Y-DA535A`: pause → live `DISPATCH_DENIED` → separately
   authorized resume → independent restoration observation → measure → resolve
   → refresh recovery. Demonstrates command/ack/effect separation.
6. (Honourable mention) **Context & Skills canonical Factory admission**
   (`docs/testing/evidence/context-skills-factory-admission-v1/README.md`,
   status `SYNTHETIC_FACTORY_ADMISSION_QUALIFIED`) — a deterministic,
   no-model path from Factory Version → readiness → WorkOrder → producer
   Attempt → unpublished candidate → verifier Attempt; useful precisely because
   it isolates the control plane from model behaviour.

---

## 7. Terminology drift between MC and fdlc.ai

Observed in MC's own vocabulary and across MC docs/schema. (FDLC-side terms are
taken from how MC cites fdlc.ai — Intent, Harness, Capability, Model, Trust,
Learning areas per `operating-contract-evidence-map.md:10` — and from the task
brief; I did not fetch fdlc.ai.)

| fdlc.ai / FDLC term | MC term(s) | Note |
| --- | --- | --- |
| Company / Workspace | `tenants` / `projects` (schema) vs "Company / Workspace" (docs) | Two-layer naming; UI uses Company/Workspace |
| Factory Version | `factoryDefinitionVersions`; "Factory Version" / "Factory version" / "Factory Configuration" / "Factory Definition Version" | Four spellings in docs |
| Attempt | `workflowRuns` (table) ⇄ "Attempt" (docs) ⇄ "WorkflowRun" ⇄ "run" (legacy `runs` = agent turns) | Three overlapping "run" concepts |
| Context Package (FDLC: assembled per-Attempt context) | MC: **two** things — registry `contextPackages` (installable skills) and `factoryContextPackages` (frozen Attempt context). MC explicitly warns "Registry `contextPackages` are not Attempt Context Packages" | High collision risk |
| Verification / Validation | `verificationRuns`/`verificationReceipts` vs Mission-level `validationAssertions`, Mission states `AWAITING_VALIDATION`, plan blueprint role `VALIDATOR` | "Validation" is the Mission-tier word, "Verification" the WorkOrder-tier word |
| Qualification | MC uses "qualification" for (a) evidence packages at a revision, (b) `qualificationStatus: EVIDENCE_QUALIFIED` on profiles/routes/tools, (c) the offline `QUALIFICATION` activation target, (d) `LOCAL_SYNTHETIC_QUALIFICATION` repo mode; "readiness" is the Factory-Version-level check | FDLC should pin one meaning |
| Candidate | "candidate", "Unpublished Candidate", "Verification Subject", `candidateSha`, `candidateRevision` (may be a content hash for automation subjects) | Subject is the identity; candidate the artifact |
| Evidence / Receipt / Proof | `evidenceEnvelopes` (observations), `verificationReceipts` (verdicts), "receipt" also used for service commands, MCP calls, inference, incident controls, eval runs, release evidence | "Receipt" is overloaded across 7 record types |
| Quality Gate | `qualityGateDecisions` (append-only projection) vs workflow step kind `GATE` vs "deterministic gates" in learning candidates | Different granularity |
| Approval | `approvalDecisions` (WorkOrder), `approvals` (legacy agent tool), `approvalRecords` (ARM), Plan approval (fields on `missionPlans`), `missionIntentContributionDecisions` | Five approval stores; only `approvalDecisions` matters for FDLC |
| Policy | `policies` (legacy tool policy), `policyEnvelopes` (ARM), `governancePolicies` (WorkOrder validity), `changeRiskPolicies`, `modelRoutingPolicies` | No single "Policy" object |
| Task | legacy Kanban task (10 states) vs FDLC bounded work unit | Keep name, drop legacy semantics |
| Agent | `agents` (legacy runtime rows), `agentVersions` (genome), workflow `agents[]` (persona refs), `AGENT` actor type | |
| Sandbox lifecycle | doc `PROVISIONING/HEALTH_CHECKING/TEARING_DOWN` vs schema `ALLOCATING/TERMINATING/CANCELING` | Doc/schema drift |
| Verification Run states | doc `PENDING/ERROR` vs schema `PLANNED/FAILED` | Doc/schema drift |
| Guarded Auto | policy `executionRouting.mode: GUARDED_AUTO` + flag `execution-routing.guarded-auto` + incident action `DISABLE_GUARDED_AUTO` | Consistent; good candidate FDLC term |
| Release | `factoryReleases` = *code* release (merge→deploy→verify), not release of a Factory Version | FDLC "Factory release/promotion" has no MC equivalent |
| Recipe | UI-only composition preset (`recipeCatalog.ts`) | Not a lifecycle object |
| Harness vs Executor vs Adapter | `executor{adapter,version}` in schema; "harness" in docs; `HarnessExecutorAdapter` in code | Three words for one thing |
| Deploy / Environment | `environments` (dev/staging/prod release channels), `executionEnvironment: LOCAL|CLOUD|REMOTE|POLICY_SELECTED`, `executionBackend: persistent-worker|remote-sandbox|isolated-container` | Three "environment" axes |

---

## 8. Items not read / uncertain

- `docs/software-factory/domain-contracts.md` (740 lines), `verification-receipt.md`,
  `v1-verification-profile.md`, `durable-codex-github-pr.md`, `remote-sandbox-runtime.md`
  body, `MULTI_PROJECT_MODEL.md`, `OPENCLAW_INTEGRATION.md`, `docs/decisions/
  worker-runtime-leases-recovery.md`, `model-route-runtime-identity-separation.md`,
  the Bedrock/FDLC-phase documents, and most `docs/testing/evidence/*` READMEs
  beyond the golden path — skimmed by title only.
- `convex/schema.ts` regions 5606-6414 (QC runs, test recordings, scheduled jobs,
  metrics, content/revenue, knowledge chunks, agent hiring) and 7620-8091
  (research sources, loop engineering cycles) were skimmed, not studied.
- Whether any non-human caller of `workOrders.accept` still exists (OVERVIEW.md
  says yes; the mutation rejects non-`HUMAN` actors at line 5289).
- Writer of `missions.state = "SUPERSEDED"`.
- Exact schema of `factory-execution-manifest/v3` and `/v4` beyond the input type
  (`executionManifest.ts:63-192`).
