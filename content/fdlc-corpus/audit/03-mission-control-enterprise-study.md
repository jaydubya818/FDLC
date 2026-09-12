# MissionControlEnterprise vs MissionControl — Enterprise Reference Architecture Study

**Scope:** `/home/claude/repos/MissionControlEnterprise` (MCE, `jaydubya818/MissionControlEnterprise`, HEAD `ffd5807 fix: finalize phase 2 accessible decision colors`) compared against `/home/claude/repos/MissionControl` (MC, HEAD `f518c9c Merge PR #222 codex/fab-personal-memory`). Both are single-commit shallow clones; all conclusions come from file-level diffing and reading, not git history.

**Question:** Is MCE a genuine "reference architecture for organizations operating at substantial scale" that FDLC (fdlc.ai) can cite as its Enterprise tier, or is it MC plus product experiments?

**Short answer:** MCE is *not* an enterprise architecture and is *not* a superset of MC. It is an **older, divergent branch of MC** (runtime contract v33 vs MC's v58) that carries **one genuine, unmerged enterprise-hardening slice** (server-side fail-closed authorization + Clerk two-company qualification), **one genuine integration contract** (the Venture Factory `ExecutionIntent/v1` shadow provider under `contracts/`), a UI/navigation "Phase 2 convergence," and sixteen stale root-level product-pitch documents that MC has since archived under `docs/history/`. It lacks ~27 Convex tables and ~9,000 lines of MC-only capability (incident command, governed MCP broker, governed inference gateway, Docker sandbox provider, execution profiles, eval control plane, Bedrock adapters). Neither repo implements SSO/SCIM, secrets management, OpenTelemetry export, disaster recovery, multi-region, or compliance frameworks.

---

## 1. Structural diff summary

`diff -rq MissionControl MissionControlEnterprise -x node_modules -x .git -x pnpm-lock.yaml` (883 lines):

| Category | Count | Where |
| --- | ---: | --- |
| Files that differ | 370 | `apps/mission-control-ui/src` (49), `apps/orchestration-server/src` (40), `packages/workflow-engine/src` (12), `convex/schema.ts`, `convex/lib/companyAccess.ts`, many `convex/*.ts` |
| Only in MCE | 61 | 16 root `*.md` status docs, `contracts/`, `convex/executionIntents.ts`, `convex/lib/{authedFunctions,clerkAuthConfig,executionIntentShadow}.ts`, 5 `convex/__tests__`, `apps/orchestration-server/src/executionIntentShadow.ts` + 4 tests, `packages/telegram-bot/src/approvalAuthority.ts`, `scripts/{enterprise-golden-path-qualification,authenticated-golden-path-preflight,report-live-route-authorization}.mjs`, `tests/e2e/authenticated-golden-path.e2e.spec.ts`, `playwright.authenticated.config.ts`, `docs/security/{AUTHORIZATION_REMEDIATION,authenticated-golden-path-qualification}.md`, `docs/FEATURE_MATRIX.md`, `docs/product/PHASE_2_*.md`, `docs/architecture/venture-factory-execution-intent-shadow-v1.md`, 4 evidence dirs, 8 todos |
| Only in MC | 448 | `docs/testing/evidence` (111), `convex/__tests__` (55), `docs/software-factory` (45), `apps/orchestration-server/src` (42 + 36 tests), `convex/lib` (35), `convex/factory/{executionProfiles,governedMcp,incidentControlObserver,incidentControls,incidents,providerLiability}.ts`, `convex/{evalControlPlane,fabChat,factoryPackageImports,inferenceGateway,localQualificationRepositories,missionIntentContributions,missionPlanning,qualificationEnvironmentFixture}.ts`, `evals/`, `fixtures/`, `vendor/`, `infra/docker-bedrock`, `infra/docker-factory`, `docs/history/` (the archived MCE root docs), `docs/decisions/{execution-profile-identity,governed-mcp-tool-capability,model-route-runtime-identity-separation}.md`, `docs/research/2026-09-04-fdlc-capability-audit/`, `SECURITY.md`, `.github/ISSUE_TEMPLATE` |

**Schema:** MC `convex/schema.ts` = 9,003 lines / 216 tables. MCE = 7,979 lines / 192 tables.
- MCE-only tables (3): `executionIntents`, `executionIntentEvents`, `executionIntentTransportReceipts` (`convex/schema.ts:419-470`).
- MC-only tables (27): `factoryIncidents`, `factoryIncidentControlAuthorizations`, `factoryIncidentControlReceipts`, `factoryIncidentProposals`, `factoryIncidentTransitions`, `factoryExecutionProfiles`, `factoryOutcomeEvents`, `factoryOutcomeProjections`, `factoryPackageImports`, `factoryProviderPrices`, `factoryProviderReservations`, `factoryProviderUsageEvents`, `inferencePhysicalIntents`, `inferencePhysicalReceipts`, `inferencePriceBooks`, `inferenceReconciliations`, `inferenceReservations`, `inferenceRouteComparisons`, `mcpToolCallReceipts`, `mcpToolGrants`, `mcpToolVersions`, `missionIntentContributions`, `missionIntentContributionDecisions`, `repositoryDispatchControls`, `fabChatBudgets`, `fabChatUsageReceipts`, `fabOperatorProfiles`.

**Timeline evidence:** MCE `README.md:94` and `docs/OVERVIEW.md:195` state runtime contract **v33**; MC `README.md:493` states **v58**. MCE `todos/` stop at 067 (`060-063` still `ready`); MC has them `complete` and continues to 072. MCE's `docs/plans/` latest dated entry is 2026-09-09; MC's continue through 2026-09-06 on different topics plus a September FDLC capability audit. MC's `docs/history/README.md` archives exactly the sixteen root docs MCE still carries at top level.

---

## 2. What MCE actually adds (implemented, tested)

### 2.1 Server-side fail-closed authorization (genuine, not in MC)

- `convex/lib/authedFunctions.ts` (135 lines): `authedQuery`, `authedMutation`, `authedAction` wrappers. `authedMutation` walks every `*Id`/`*Ids` argument up to depth 2 (`collectDocumentScope`), derives owning `projectId`/`tenantId` from the referenced documents, rejects cross-workspace argument sets, requires `factory.improve` in the owning workspace, and reserves global writes for a company administrator. Used in **84** `convex/*.ts` files; **zero** in MC.
- `convex/lib/companyAccess.ts` adds `assertAuthenticated(ctx)` (lines 49-59) that fails closed unless `MC_ALLOW_ANONYMOUS_COMPANY_CONTEXT=1`. `requireWorkspacePermission` call sites: 57 files in MCE vs 38 in MC.
- Ratchet: `scripts/convex-authorization-baseline.json` — MCE **184** unauthorized public functions vs MC **624**. `docs/security/AUTHORIZATION_REMEDIATION.md` records 924 → 917 public, 287 → 733 authorized, 0 unauthorized mutations/actions, 0 unauthorized Live-route functions, P0/P1/P2 = 0. Remaining 184 are non-Live read-only queries (44 Preview/Demo UI, 140 legacy/unreachable).
- `scripts/report-live-route-authorization.mjs` intersects `apps/mission-control-ui/src/shellV2/routeCapabilities.ts` route roots' import graphs with the scanner.
- Tests: `convex/__tests__/authorizationRemediation.test.ts` (180), `deliveryAuthorizationFailClosed.test.ts` (25), `authenticatedGoldenPathAuthorization.test.ts` (127), `clerkAuthConfig.test.ts`.
- Seven identity scan helpers converted from public to `internal*` functions.

**Assessment:** This is real engineering with measurable evidence and is the single most enterprise-relevant thing in MCE. MC main has not absorbed it (MC baseline is still 624). Note that MCE's `companyAccess.ts` also *lacks* MC's newer `factory.incident.control` permission and `temporaryFactoryAutomationGrantIsCurrent` (MC lines 27, 176-182, 233-244), so the two branches have diverged in both directions.

### 2.2 Clerk configuration fail-closed + two-company qualification

- `convex/lib/clerkAuthConfig.ts` (30 lines) + `convex/auth.config.ts` read `CLERK_JWT_ISSUER_DOMAIN` from deployment env and refuse to sync without it. MC's `convex/auth.config.ts` hardcodes `https://dear-sunbird-98.clerk.accounts.dev`.
- `docs/security/clerk-company-authorization.md`: Clerk authenticates; Convex `tenants/operators/roles/roleAssignments` authorize. **Clerk Organizations are deliberately not used.** `operators.authId` = exact Clerk `user_…`; email never establishes membership; one-time owner bootstrap via `MC_BOOTSTRAP_OWNER_SUBJECT`/`MC_BOOTSTRAP_TENANT_SLUG`.
- `docs/security/authenticated-golden-path-qualification.md`, `scripts/enterprise-golden-path-qualification.mjs` (259), `scripts/authenticated-golden-path-preflight.mjs`, `tests/e2e/authenticated-golden-path.e2e.spec.ts` (143), `playwright.authenticated.config.ts`, `tests/fixtures/authenticated-golden-path.manifest.example.json`.
- Evidence: `docs/testing/evidence/enterprise-golden-path/{README.md,lineage.json,automated-checks.json,scenario-evidence.json,clerk-fail-closed.png}`. Verdict recorded verbatim: **"TECHNICAL GOLDEN PATH PASS; PRODUCTION AUTHENTICATION BLOCKED EXTERNALLY."** Same-company read/write PASS, cross-company DENIED, unauthenticated DENIED — all deterministic; production Clerk browser isolation "BLOCKED — EXTERNAL."

**Assessment:** Honest and useful. It closes the exact gap MC's own maturity ledger names for "Multi-tenant enterprise operation: Partial — complete live cross-company denial and service-identity tests before a second organization" (`docs/product/software-factory-capability-maturity.md`, identical row in both repos). But it is still a single-Convex-deployment, row-scoped tenancy model with *no* live production proof.

### 2.3 Telegram approval authority

- `packages/telegram-bot/src/approvalAuthority.ts`, `packages/telegram-bot/src/commands/approvals.ts`, `.env.example:95` `TELEGRAM_CONVEX_OPERATOR_AUTH_TOKEN`, `docs/security/service-command-authentication.md` §"Telegram operator approvals" (MCE-only section). Chat identity is never the approver; a mapped operator token with `delivery.approve` is required; generic orchestration token refused.

**Assessment:** Small but correct pattern for "human decision over a chat channel."

### 2.4 Venture Factory `ExecutionIntent/v1` shadow provider (the `contracts/` directory)

- `contracts/venture-factory/v1/execution-intent.schema.json` — JSON Schema 2020-12, `additionalProperties:false` throughout; required `organization_id`, `idempotency_key`, `correlation{correlation_id,causation_id,trace_id}`, `subject{portfolio_id,venture_id,decision_id,…}`, `product_build{specification_digest,build_plan_digest,repository,base_sha,definition_of_done,compute_budget_minor,target_environment∈{LOCAL,TEST,PROTECTED_PREVIEW},expected_verification,callback_identity}`, `constraints{required,prohibited,data_boundaries,stop_conditions}`, `evidence_requirements{independent_verification_required:const true}`, `budget_ceiling{amount_minor,currency,reservation_id,includes_mission_control_cost:const true}`, `rights_constraints`, `governance{risk_level,policy_decision_id,approval_ids,maximum_autonomy∈{L0_OBSERVE,L1_RECOMMEND,L2_PREPARE}}`, `provenance{input_digest,decision_digest,evidence_set_digest,source_references}`.
- `execution-intent-response.schema.json` — `status ∈ {ACCEPTED_FOR_PLANNING, GOVERNANCE_REQUIRED, REJECTED, DUPLICATE, CONFLICT}`; "ACCEPTED_FOR_PLANNING never means software is verified, released, or accepted."
- `execution-event.schema.json` — CloudEvents 1.0-shaped, sequenced, twelve `mission_control.*` lifecycle types; `software_acceptance.accepted:true` requires `work_order_id`, `work_order_revision`, `candidate_digest`, `verification_receipt_id`, `quality_gate_decision_id`, `accepted_at`.
- `contract-lock.json` — pins `factory_baseline` SHA, `mode:"SHADOW"`, `dispatch_authority:false`, `software_acceptance_authority:false`, sha256 of each schema; enforced by `apps/orchestration-server/src/__tests__/executionIntentContractLock.test.ts`.
- Implementation: `apps/orchestration-server/src/executionIntentShadow.ts` (900 lines) — Hono sub-app, dedicated bearer token (must differ from `CONVEX_SERVICE_AUTH_TOKEN` and `ORCHESTRATION_API_TOKEN`), HMAC over a newline-delimited canonical string (method, path, keyId, epoch-ms, nonce, idempotency key, RFC-8785-style canonical JSON digest), 5-minute replay window, nonce replay cache, 256 KiB cap, browser-origin rejection, current+previous key rotation, signed responses including error bodies. `convex/executionIntents.ts` (316) persists intent/receipt/event with per-organization + service-subject checks. `apps/orchestration-server/src/auth.ts` adds `isDedicatedExecutionIntentRoute` so `/v1/execution-intents*` bypasses the orchestration bearer and uses its own boundary. Tests: `executionIntentRoutes.test.ts` (310), `executionIntentShadow.test.ts` (250), `convex/__tests__/executionIntentShadow.test.ts`.
- `docs/architecture/venture-factory-execution-intent-shadow-v1.md`: "It has no planning, dispatch, execution, verification, release, or software-acceptance authority."

**Assessment:** This is the best-designed artifact in MCE and the only thing that is architecturally *about* multi-organization operation: an authenticated anti-corruption boundary through which an *external* governed system (the "Autonomous Venture Factory") proposes intents to Mission Control, with idempotency, correlation/causation, signed transport, and a contract lock. It is explicitly SHADOW-only (records and acknowledges, creates nothing). It is not federation, but it is the seed of one.

### 2.5 Phase 2 product convergence (UI/product, not architecture)

- `docs/FEATURE_MATRIX.md`, `docs/product/PHASE_2_BACKEND_PRODUCT_MAP.md`, `docs/product/PHASE_2_CONVERGENCE_REPORT.md`, `apps/mission-control-ui/src/shellV2/eosNavConfig.ts`, `Sidebar.tsx`, `AppShellV2.tsx`, ~45 other UI files. Eight nav groups (Overview/Operate/Factory/Control/Observe/Build/Knowledge/Labs); route registry 23 Live / 26 Preview / 7 Demo; "Architecture duplicated: 0." Evidence in `docs/testing/evidence/phase-2-convergence/`.

**Assessment:** Legitimate product work, honest about limits, but it is information architecture for the operator UI, not enterprise platform architecture.

---

## 3. What MCE carries that is *not* enterprise architecture (ignore)

Sixteen root-level status/pitch documents that MC archived to `docs/history/` (with a README explaining they are historical):

| File | Nature | Verified against code? |
| --- | --- | --- |
| `LEAD_AGENT_SYSTEM_DEPLOYED.md` | Claims "Status: LIVE" for Jordan/Casey/Alex revenue agents | **False.** References `convex/agents/schema.ts`, `convex/tasks/mission.ts`, `apps/mission-control-ui/components/LeadAgentDashboard.tsx`, `workflows/sellerfi-revenue.json` — none exist. Zero code hits for `JORDAN_REVENUE_LEAD`, `revenueLeader`, `CASEY_RETENTION`. |
| `SELLERFI_PROFITFOUNDER_UPGRADE.md` | "$1M/year blueprint," "System live in 2 hours" | Marketing. SellerFi seed scripts (`convex/seedSellerFi.ts`, `convex/setupSellerFiAgents.ts`) exist in **both** repos as demo data. |
| `MISSION_STATEMENT_FEATURE.md`, `CHAT_FIXED_AND_ENHANCED.md`, `CHAT_VIEW_VERIFICATION.md`, `VIEWS_FIXED.md`, `FIXES_SUMMARY.md`, `FINAL_STATUS.md` | Session logs of UI fixes | Historical. |
| `QC_IMPLEMENTATION_GUIDE.md`, `QC_TEST_REPORT.md`, `QC_FIXES_APPLIED.md` | Quality-control feature notes | Historical; QC rulesets route is Preview per `FEATURE_MATRIX.md`. |
| `WORKFLOW_SYSTEM_COMPLETE.md`, `WORKFLOW_INTEGRATION_SUMMARY.md` | Workflow engine/executor build log | Historical; the code is in both repos. |
| `ARM_PRD_REVIEW.md`, `MIGRATION_PLAN.md`, `UNIFIED_SCHEMA_MAPPING.md`, `FORK_BOUNDARY.md` | Feb-2026 ARM ("HCM for AI agents") integration plan | Real design docs; the resulting `convex/registry/*`, `convex/governance/*`, `convex/operations/opEvents.ts`, `convex/migrations/backfillInstanceRefs.ts`, `convex/lib/{agentResolver,armAudit,armCompat,armPolicy,genomeHash}.ts` exist **in both repos**. `FORK_BOUNDARY.md` differs from MC's only by two path references. Not MCE-specific. |

Also shared (identical in both, therefore not an MCE differentiator): `docs/ENTERPRISE_UI_READINESS_REVIEW.md` (verdict "**No-ship** … 6.1/10"), `docs/IMPLEMENTATION_ORG_CHART.md`, `docs/ORG_CHART_VIEW.md`, `docs/architecture/company-workspace-repository-control-plane.md`, `docs/architecture/MULTI_PROJECT_MODEL.md`, `docs/ARM_CUTOVER_CHECKLIST.md`.

**Also note:** MCE `README.md` still says `git clone https://github.com/jaydubya818/MissionControl.git` and is titled "Mission Control." The word "Enterprise" appears only in the repo name, one shared UI review, and the golden-path qualification. `docs/runbook/RUNBOOK.md:237-489` instructs `pnpm run backup` / `pnpm run restore`; neither script exists in `package.json` (either repo).

---

## 4. What MC has that MCE lacks (relevant to enterprise)

| Capability | MC files | MC ledger status (`docs/product/software-factory-capability-maturity.md`) |
| --- | --- | --- |
| Factory incident command (Clarify→Contain→…→Measure, pause/resume with authorizations + receipts) | `convex/factory/incidents.ts` (765), `incidentControls.ts` (572), `incidentControlObserver.ts`, `convex/lib/factoryIncident*.ts`, `apps/mission-control-ui/src/controlPlane/FactoryIncidentWorkspace.tsx`, tables `factoryIncident*`, `repositoryDispatchControls` | "Production-qualified; one exact repository operation" — MCE ledger: "Missing canonical lifecycle" |
| Governed MCP (default-deny broker, tool versions, grants, receipts) | `apps/orchestration-server/src/governedMcpBroker.ts` (546), `governedMcpContracts.ts`, `convex/factory/governedMcp.ts` (499), tables `mcpToolVersions/Grants/CallReceipts`, ADR `docs/decisions/governed-mcp-tool-capability.md` | "Experimental; one real read-only operation qualified" — MCE: "Missing" |
| Governed inference gateway + economics (reservations, price books, reconciliation, liability ledger) | `convex/inferenceGateway.ts` (1,091), `apps/orchestration-server/src/governedInferenceGateway.ts` (432), `hardLiabilityLedger.ts`, `convex/factory/providerLiability.ts`, `packages/shared/src/governedInference.ts`, tables `inference*`, `factoryProvider*` | "Experimental; default off" |
| AWS Bedrock provider path + IAM spec | `apps/orchestration-server/src/bedrock*.ts` (11 files), `docs/software-factory/fdlc-bedrock-iam-specification.md`, `fdlc-bedrock-invocation-policy.json`, `infra/docker-bedrock/` | Offline-qualified; live blocked on AWS identity |
| Docker sandbox provider + admission | `apps/orchestration-server/src/dockerSandboxProvider.ts` (406), `convex/lib/dockerSandboxAdmission.ts`, `infra/docker-factory/` | Phase-1 qualification report exists |
| Execution profiles (composable, governed identity) | `convex/factory/executionProfiles.ts`, `convex/lib/executionProfile*.ts`, ADR `execution-profile-identity.md` | Surfaced Live in MCE's Feature Matrix *by name*, but MC has the dedicated table/module |
| Eval control plane | `convex/evalControlPlane.ts`, `packages/shared/src/evalControlPlane.ts`, `evals/`, `docs/architecture/eval-control-plane-v1.md` | "Partially proven" |
| Factory package import (signed handoff from a Factory Engineer) | `convex/factoryPackageImports.ts` (1,419), `packages/shared/src/factoryDeploymentPackage.ts` (1,333) | Complete todo 066 |
| FDLC capability audit + convergence program | `docs/research/2026-09-04-fdlc-capability-audit/`, `docs/software-factory/capability-convergence-program.md`, `docs/plans/2026-09-04-feat-fdlc-capability-convergence-plan.md`, `docs/FACTORY_VOCABULARY.md` | — |
| Hygiene | `SECURITY.md`, `.github/ISSUE_TEMPLATE`, `docs/history/` archive, `vendor/`, `fixtures/` | — |

---

## 5. Enterprise-concern matrix

Legend for the FDLC Enterprise brief: 100+ repos, thousands of builders, multiple orgs/factories/harnesses/providers, central governance + distributed ownership, enterprise identity, policy enforcement, audit, regulated workloads, platform teams, IDPs, multiple environments.

| Enterprise concern | MC status | MCE status | Gap vs FDLC Enterprise brief | Recommendation |
| --- | --- | --- | --- | --- |
| Organizational boundaries / multi-BU | `tenants` → `projects` (workspace) → `teams`/`orgMembers`; single Convex deployment; row-level `tenantId` scoping (`convex/registry/tenants.ts`, `docs/architecture/company-workspace-repository-control-plane.md`) | Same + deterministic two-company denial tests | No org-of-orgs, no BU hierarchy above tenant, no per-tenant deployment isolation, no cross-org federation (ARM P1.7 explicitly out of scope in `FORK_BOUNDARY.md` §10) | Cite MCE's two-company qualification as *evidence of the tenant boundary*; FDLC must specify a hierarchy (enterprise → BU → factory → workspace) that neither repo has |
| Repository ownership | Repository connections + code scopes with owning team, env policy, review requirements (`company-workspace-repository-control-plane.md`, shared); `repositoryDispatchControls` table (MC only) | Same minus dispatch controls | Designed for "one to several repos, monorepos"; no CODEOWNERS ingestion, no 100-repo inventory sync, no ownership drift detection | Cite the code-scope model as the ownership primitive; FDLC adds inventory/ownership-of-record at scale |
| Tenant isolation | Row-level; `requireWorkspacePermission`/`requireCompanyPermission`; anonymous demo bypass via env var; 624 unauthorized public functions | Same helpers + `authedMutation` object-derived scoping; 184 unauthorized (all non-Live read-only); 0 unauthorized mutations | Shared database, shared Convex functions, shared secrets; no noisy-neighbour, no data residency, no per-tenant KMS | **Cite MCE** (`authedFunctions.ts`, `AUTHORIZATION_REMEDIATION.md`, ratchet). Do not claim isolation beyond "authorization-enforced logical separation" |
| RBAC / ABAC | `roles`, `permissions`, `roleAssignments` (ARM, both); permission strings `company.*`, `members.*`, `delivery.*`, `factory.*` (`companyAccess.ts`); MC adds `factory.incident.control` and temporary time-boxed grants | Same minus MC's additions | RBAC only; no ABAC (no attribute policies over data classification, environment, risk); no permission bundles per platform-team role; no SoD constraints beyond "last owner" | Cite the permission vocabulary; FDLC defines ABAC over classification/environment/risk |
| Workload identity | Signed service-command envelope (`convex/serviceCommands.ts`, 869 lines): service identity, capability, project, repo, command ID, expiry, payload digest, replay rejection; `CONVEX_SERVICE_AUTH_TOKEN` mapped to an operator; GitHub App installation identity | Same + Telegram operator token + dedicated AVF bearer/HMAC with key rotation | Static shared tokens, no SPIFFE/OIDC workload federation, no short-lived per-Attempt credentials at platform level (MC's Bedrock IAM spec is the closest) | Cite `serviceCommands.ts` and the AVF transport protocol as the *pattern*; FDLC prescribes short-lived federated workload identity |
| Secrets | Env vars; `scripts/check-repository-secrets.mjs`; sandbox credential scrubbing (`sandboxCredentials.ts`); secret redaction in worker logs | Same | No vault/KMS integration, no per-tenant secret scoping, no secret rotation automation (only AVF key-pair rotation) | Gap; do not cite either repo |
| Policy engine | `packages/policy-engine` (risk GREEN/YELLOW/RED, autonomy rules, budgets, allowlists, loop detection); ARM `policyEnvelopes` with inheritance version > project > tenant (`convex/lib/armPolicy.ts`, `convex/governance/policyEnvelopes.ts`); Policies route Preview | Same | In-process TypeScript; no external policy-as-code (OPA/Cedar), no policy simulation UI (ARM review §5.4 recommends one), no central policy distribution to distributed factories | Cite envelope inheritance + fail-closed evaluation; FDLC adds policy-as-code distribution |
| Sandbox pools | Remote sandbox (`exeDevSandboxProvider.ts`, `infra/remote-sandbox/`, "Production-pilot eligible; Preview," unrestricted egress) + Docker provider + isolated invocation (MC only) | Remote sandbox only | No pool management, no capacity scheduling, no egress policy enforcement, no attestation of sandbox image at scale | Cite MC (`dockerSandboxProvider.ts`, `dockerSandboxAdmission.ts`, `remote-sandbox-threat-model.md`); MCE adds nothing |
| Execution workers / fleets | Durable worker with leases/recovery (`docs/decisions/worker-runtime-leases-recovery.md`, `worker-runtime-operations.md`); "fleet-scale restart … not claimed" | Same (older) | Single-worker qualification; no fleet scheduler, no multi-region workers | Cite lease/recovery ADR; fleet is a gap |
| Queues / admission | Execution queue (`/v2/atc`), dispatch idempotency, retry, lease; `repositoryDispatchControls` (MC) | Same minus dispatch controls | Convex-backed; no priority classes across orgs, no fairness/quota per BU | Cite admission validators; quotas are a gap |
| Artifact stores | Immutable candidates + evidence in Convex; `sandboxResultBundle.ts`; GitHub PR as delivery artifact | Same | No OCI/artifact registry, no SBOM store (MC ledger: "Supply-chain provenance: Strong partial") | Gap |
| Knowledge systems | Context catalog, manifests, Factory Memory (advisory, phase-gated) (`convex/lib/contextManifests.ts`, `factoryMemory*.ts`) | Same | Workspace-scoped; no enterprise knowledge federation or classification-aware retrieval | Cite as advisory pattern only |
| Model gateway | `packages/model-router` + governed inference gateway with reservations/price books/reconciliation (MC only) | `packages/model-router` only | MC ledger: "Router/proxy is not a fully qualified common inference gateway"; MCE has no gateway | Cite MC `inferenceGateway.ts`; MCE adds nothing |
| Model routing | Model Route v2 with four-part identity (route/harness/runtime/backend) (`docs/decisions/model-route-runtime-identity-separation.md`, MC) | Routing v1 (`packages/shared/src/execution-routing.ts`, older) | Advisory by default; no enterprise-wide route catalog | Cite MC ADR |
| Cost controls | Budget caps in policy engine; cost per accepted outcome "Partial … null"; hard liability ledger + provider reservations (MC) | Budget caps only; Cost & Usage route Preview | No chargeback/showback per BU, no FinOps export; ARM P1.5 cost ledger "later" | Cite MC liability ledger as the only real cost primitive; gap otherwise |
| Observability | Traces/observations/evals (`/v2/trace-inspector`); ledger: "OpenTelemetry GenAI conventions are not canonical IDs … add a versioned export adapter when an external consumer is selected" | Same (older) | No OTel export, no external metrics, no SLOs | Gap; do not cite |
| Audit | `changeRecords` (governance) split from `opEvents` (telemetry) (both); `activities` append-only; `/v2/audit` Live | Same + audit identity derived from authenticated context (client actor IDs no longer trusted in remediated paths) | No tamper-evidence beyond append-only, no signed Audit Pack (ARM P1.6 out of scope), no export/retention SLA (only `docs/security/evidence-retention-policy.md`) | Cite the governance/telemetry split; cite MCE for server-derived audit identity |
| Incident response | Factory incident command, production-qualified for one repo pause/resume (MC) | "Missing canonical lifecycle" per MCE's own ledger | Single-repo, single-control; no enterprise on-call/paging integration | Cite MC only |
| Compliance / regulated workloads | None (a `// GDPR fields` comment on `operators`; evidence retention policy doc) | None | No SOC 2 / ISO / HIPAA / FedRAMP controls mapping; no data classification enforcement (AVF intent schema has `data_boundaries` strings but nothing enforces them) | Gap; FDLC must supply controls mapping itself |
| Deployment options | Convex cloud + Vercel (`vercel.json`), PM2 (`ecosystem.config.cjs`), `docker-compose.yml`, orchestration Dockerfile | Same | No self-hosted/air-gapped Convex story, no Helm/Terraform, no multi-environment promotion pipeline beyond `environments` table (dev/staging/prod rows) | Gap |
| Disaster recovery | Runbook cites non-existent `pnpm run backup`/`restore`; Convex managed backups implied | Same | No RPO/RTO, no restore drill evidence | Gap; flag the runbook inaccuracy |
| SSO / SCIM | Clerk only; Clerk Orgs deliberately unused; membership provisioned by exact Clerk user ID in UI; "Provisioning by email alone is deliberately unsupported" | Same, fail-closed issuer config, bootstrap-owner procedure | No SAML/OIDC enterprise IdP beyond what Clerk brokers; no SCIM; manual provisioning does not scale to thousands of builders | Cite MCE's identity contract (`clerk-company-authorization.md`) for the *authn vs authz separation*; SCIM is a gap |
| Lead agent / org-chart | `orgMembers`, `orgAssignments` with positional INTERN/SPECIALIST/LEAD/CEO (both); ARM `agentTemplates/Versions/Instances` with autonomy tiers 0-5; `docs/IMPLEMENTATION_ORG_CHART.md` (shared) | Same; plus the fictional `LEAD_AGENT_SYSTEM_DEPLOYED.md` | ARM review itself says positional roles are inferior to autonomy tiers; org chart is a UI over agents, not an enterprise org model | Ignore the lead-agent docs; cite ARM autonomy tiers if FDLC wants agent-role governance |
| Cross-org intent intake / federation | None | AVF `ExecutionIntent/v1` shadow provider (`contracts/`, `executionIntentShadow.ts`) | Shadow only; one organization per deployment (`AVF_EXECUTION_INTENT_ORGANIZATION_ID`); no outbound federation | **Cite MCE** as the reference contract shape for factory-to-factory intent handoff |

---

## 6. Honest verdict

1. **MCE is MC at contract v33 plus one security slice, one integration contract, one UI convergence, and stale pitch docs.** It is not a superset, not a separate product, and not named or documented as an enterprise architecture anywhere except the repository name. Its own README still calls it "Mission Control" and points to the MC clone URL.
2. **The security slice is real and unmerged.** 84 files adopt `authedMutation/Query/Action`; the ratchet drops 624 → 184; every mutation/action and every Live-route function is authorized; negative cross-company tests exist. MC main has not absorbed this. This is the most valuable thing in MCE for FDLC Enterprise.
3. **The `contracts/` directory is the only multi-organization architecture in either repo.** It is a well-formed, locked, signed, idempotent intent-intake boundary — but SHADOW-only and single-organization-per-deployment.
4. **MC main is ahead everywhere else** that an enterprise brief cares about: incident command, governed MCP, governed inference/cost, Docker sandbox, execution profiles, evals, Bedrock IAM, package import, and an explicit FDLC capability audit. MCE's own maturity ledger still lists MCP as "Missing" and incident response as "Missing canonical lifecycle."
5. **Neither repo covers** SSO/SCIM, secrets management, OTel export, DR, multi-region, self-hosting, compliance controls, chargeback, fleet scheduling, or org hierarchy above a single tenant. The ARM plan explicitly deferred federation, signed evidence artifacts, eval gates, and the cost ledger (`FORK_BOUNDARY.md` §10, `MIGRATION_PLAN.md` "Out of Scope").
6. **Marketing vs code:** `LEAD_AGENT_SYSTEM_DEPLOYED.md` and `SELLERFI_PROFITFOUNDER_UPGRADE.md` claim "LIVE"/"deployed" systems whose referenced files do not exist. `docs/runbook/RUNBOOK.md` documents backup/restore commands that do not exist. The security and qualification docs, by contrast, are scrupulously honest ("BLOCKED — EXTERNAL," "PASS WITH LIMITATIONS," "not a product PASS").

**Recommendation for FDLC:** Do not present MCE as the enterprise reference architecture. Present FDLC Enterprise as a *synthesized* architecture that cites **MC main** as the base implementation and **MCE** for three specific patterns (fail-closed authorization ratchet, authn/authz separation with two-company qualification, and the ExecutionIntent contract set). Recommend upstreaming MCE's authorization slice into MC so a single lineage exists.

---

## 7. Components/contracts FDLC Enterprise should cite as implementation evidence

### From MCE (`/home/claude/repos/MissionControlEnterprise/`)

| Pattern | Files |
| --- | --- |
| Object-derived, fail-closed authorization wrappers | `convex/lib/authedFunctions.ts`; `convex/lib/companyAccess.ts` (`assertAuthenticated`, `requireWorkspacePermission`, `requireCompanyPermission`, `COMPANY_PERMISSIONS`, `FACTORY_PERMISSIONS`) |
| Monotonic authorization ratchet in CI | `scripts/convex-authorization-baseline.json` (184), `scripts/check-convex-authorization.mjs`, `scripts/lib/convex-authorization-scan.mjs`, `scripts/report-live-route-authorization.mjs`, `docs/security/AUTHORIZATION_REMEDIATION.md` |
| Authn (Clerk) vs authz (Convex records) separation; fail-closed issuer config; owner bootstrap | `convex/auth.config.ts`, `convex/lib/clerkAuthConfig.ts`, `docs/security/clerk-company-authorization.md`, `docs/security/human-service-authorization-matrix.md` |
| Two-company tenant-boundary qualification runbook + evidence | `docs/security/authenticated-golden-path-qualification.md`, `scripts/enterprise-golden-path-qualification.mjs`, `scripts/authenticated-golden-path-preflight.mjs`, `tests/e2e/authenticated-golden-path.e2e.spec.ts`, `playwright.authenticated.config.ts`, `convex/__tests__/authenticatedGoldenPathAuthorization.test.ts`, `docs/testing/evidence/enterprise-golden-path/{README.md,lineage.json,automated-checks.json,scenario-evidence.json}` |
| Human decision over chat channel with mapped operator identity | `packages/telegram-bot/src/approvalAuthority.ts`, `docs/security/service-command-authentication.md` §Telegram |
| Cross-organization intent intake contract (anti-corruption boundary) | `contracts/venture-factory/v1/execution-intent.schema.json`, `execution-intent-response.schema.json`, `execution-event.schema.json`, `contract-lock.json`; `apps/orchestration-server/src/executionIntentShadow.ts`; `convex/executionIntents.ts`; `convex/schema.ts:419-470`; `docs/architecture/venture-factory-execution-intent-shadow-v1.md`; `apps/orchestration-server/src/__tests__/executionIntent{ContractLock,Routes,Shadow}.test.ts` |
| Product-truth register (Live/Preview/Demo) | `docs/FEATURE_MATRIX.md`, `apps/mission-control-ui/src/shellV2/routeCapabilities.ts`, `docs/product/PHASE_2_CONVERGENCE_REPORT.md` |

### From MC main (`/home/claude/repos/MissionControl/`) — needed because MCE lacks them

| Pattern | Files |
| --- | --- |
| Tenant → workspace → team → repository → code-scope model | `docs/architecture/company-workspace-repository-control-plane.md` (also in MCE), `convex/registry/tenants.ts`, `convex/registry/environments.ts`, `convex/registry/operators.ts` |
| RBAC registry + policy envelopes with inheritance | `convex/governance/{roles,permissions,roleAssignments,policyEnvelopes}.ts`, `convex/lib/armPolicy.ts`, `packages/policy-engine/` |
| Governance audit vs telemetry split | `convex/governance/changeRecords.ts`, `convex/operations/opEvents.ts`, `convex/lib/armAudit.ts` |
| Signed service-command workload boundary | `convex/serviceCommands.ts`, `convex/lib/serviceCommandAuth.ts`, `apps/orchestration-server/src/serviceCommandClient.ts`, `docs/security/service-command-authentication.md` |
| Incident command lifecycle + controls | `convex/factory/{incidents,incidentControls,incidentControlObserver}.ts`, `convex/lib/factoryIncident*.ts`, `docs/software-factory/factory-incident-command.md`, `docs/testing/evidence/factory-incident-command-production-v55/` |
| Governed MCP default-deny broker with grants/receipts | `apps/orchestration-server/src/governedMcpBroker.ts`, `governedMcpContracts.ts`, `convex/factory/governedMcp.ts`, `docs/decisions/governed-mcp-tool-capability.md`, `docs/software-factory/governed-mcp-recertification-policy.md` |
| Governed inference gateway, reservations, liability ledger | `convex/inferenceGateway.ts`, `apps/orchestration-server/src/governedInferenceGateway.ts`, `hardLiabilityLedger.ts`, `convex/factory/providerLiability.ts`, `docs/software-factory/inference-dispatch-authority-contract.md`, `inference-ledger-identity-contract.md` |
| Provider IAM specification (AWS Bedrock) | `docs/software-factory/fdlc-bedrock-iam-specification.md`, `fdlc-bedrock-invocation-policy.json`, `apps/orchestration-server/src/bedrockIam.ts` |
| Sandbox providers and threat models | `apps/orchestration-server/src/dockerSandboxProvider.ts`, `exeDevSandboxProvider.ts`, `convex/lib/dockerSandboxAdmission.ts`, `docs/security/remote-sandbox-threat-model.md`, `infra/remote-sandbox/`, `infra/docker-factory/` |
| Execution profile / route / runtime identity separation | `convex/factory/executionProfiles.ts`, `docs/decisions/execution-profile-identity.md`, `docs/decisions/model-route-runtime-identity-separation.md` |
| Durable worker leases and recovery | `docs/decisions/worker-runtime-leases-recovery.md`, `docs/software-factory/worker-runtime-operations.md` |
| Capability maturity ledger (honest status register) | `docs/product/software-factory-capability-maturity.md`, `docs/research/2026-09-04-fdlc-capability-audit/current-main-reconciliation.md` |

### Explicitly do not cite

`LEAD_AGENT_SYSTEM_DEPLOYED.md`, `SELLERFI_PROFITFOUNDER_UPGRADE.md`, `MISSION_STATEMENT_FEATURE.md`, `CHAT_*.md`, `VIEWS_FIXED.md`, `FIXES_SUMMARY.md`, `FINAL_STATUS.md`, `QC_*.md`, `WORKFLOW_*_COMPLETE/SUMMARY.md`, `docs/LEAD_AGENT_SYSTEM_PLAN.md`, `docs/runbook/RUNBOOK.md` backup/restore section, and any "Status: LIVE"/"deployed" claim in the root docs. Treat `ARM_PRD_REVIEW.md`/`MIGRATION_PLAN.md`/`UNIFIED_SCHEMA_MAPPING.md` as design history for the shared ARM tables, not as MCE differentiation.
