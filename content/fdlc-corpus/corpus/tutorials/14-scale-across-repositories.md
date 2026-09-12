---
title: Scale Across Repositories
description: Operate the dependency-modernization factory over a cohort of repositories with per-repository classification, code scopes, qualification scope, readiness, budgets, and incident containment.
path: /tutorials/scale-across-repositories
audience: [platform, factory-engineer, architect, security]
level: [architect, enterprise]
status: draft
related: [/tutorials, /tutorials/route-an-objective-across-factories, /tutorials/build-enterprise-governance, /guides/multi-repository-factory, /enterprise/execution-fleet, /enterprise/operations, /architecture/qualification, /architecture/economics, /architecture/sandboxing, /patterns/sandbox-per-work-order, /patterns/degraded-mode, /anti-patterns/shared-mutable-workspace, /specification/v1/qualification-record, /specification/v1/factory-version, /glossary]
diagrams: [D20, D25, D33]
mc_refs: [convex/projects.ts, convex/factory/configuration.ts, convex/modelCatalog.ts, convex/factory/incidents.ts, convex/factory/incidentControls.ts, convex/workOrders.ts, convex/lib/repositoryExecutionPolicy.ts, docs/architecture/company-workspace-repository-control-plane.md, docs/software-factory/worker-runtime-operations.md, docs/software-factory/factory-incident-command.md, docs/testing/evidence/factory-incident-command-production-v55/README.md, docs/OVERVIEW.md]
---

# Scale Across Repositories

## Goal

Run the same factory composition over many repositories without weakening any per-repository boundary. At the end, `FV-depmod-1.0` is active for a cohort of repositories, each with its own classification, code scopes, readiness assessment, route qualification scope, and budget line, and you can pause dispatch for exactly one repository during an incident and resume it under a separate restoration authority. This is Factory Lifecycle stage 7, **Operate**, at the scale where fleet questions begin.

Qualification is scoped: workload class × environment × risk tier × autonomy level. A record never qualifies a scope it does not list, and a repository cohort is part of the scope ([/architecture/qualification](/architecture/qualification)).

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Repository cohort | `COHORT-checkout-repositories` (repositories `repo:checkout-api`, `repo:checkout-web`, `repo:payments-adapter`) | `factories/dependency-modernization/cohorts/checkout.yaml`; Mission Control `workspaceRepositories` |
| Per-repository code scopes | one per repository | `repositoryCodeScopes` |
| Per-repository Factory Versions | `FV-depmod-1.0` activations per environment with `rolloutCohort` | one `factoryDefinitions` + `factoryDefinitionVersions` per repository × purpose |
| Route qualification scoped to the cohort | `qualificationSnapshot.repositoryIds` on the route | `modelCatalog` |
| Qualification Record with cohort scope | `QR-depmod-1.0-02` (`x-repositoryCohort`) | factory repository |
| Budget tree | Mission, Work Order, Factory Version, policy limits | `missions.budgetUsd`, Work Order `implementationPolicy`, version `budget`, `modelRoutingPolicies.budgetLimitUsd`, lane pools |
| Incident with repository-scoped containment and restoration | `INC-…` | `factoryIncidents`, `repositoryDispatchControls`, `factoryIncidentControlAuthorizations`, receipts |

## Prerequisites

- Tutorials 08 and 13 complete on one repository.
- Two more repositories you own, one of them `CONFIDENTIAL`, to see classification gate execution.
- Permissions: `repositories.manage`, `factory.automation.manage`, `factory.approve`, `factory.incident.control`.

## Concepts

- Local factory vs ecosystem, and the repository as the unit of scope (D20): [/architecture/multi-factory](/architecture/multi-factory).
- Sandbox and classification-gated egress (D25): [/architecture/sandboxing](/architecture/sandboxing), [/patterns/sandbox-per-work-order](/patterns/sandbox-per-work-order).
- Incident Command lifecycle (D33) and degraded modes: [/enterprise/operations](/enterprise/operations), [/patterns/degraded-mode](/patterns/degraded-mode).
- Fleet execution: [/enterprise/execution-fleet](/enterprise/execution-fleet); the build guide: [/guides/multi-repository-factory](/guides/multi-repository-factory).

**Mission Control status.** Repository connections, classification, code scopes, per-repository Factory definitions and versions, per-repository route qualification scope, and repository-scoped incident containment are Available (incident pause/resume is Production-qualified for one exact repository operation). Divergences: a Mission binds one repository, so multi-repository objectives are Planned (audit §5.2–5.3); a Mission Control Factory Version freezes `repositoryId`, so "one composition, many repositories" is realized as one version per repository with identical components; fleet-scale worker enrollment is Planned ("does not provision remote compute, open inbound ports, enroll internet workers", `docs/software-factory/worker-runtime-operations.md`); a worker binds one repository (`CODEX_WORKER_REPOSITORY_ID`).

## Steps

### 1. Declare the cohort

**FDLC step; Mission Control status: Partial (no cohort object; `rolloutCohort` is an FDLC activation field).**

```yaml
# factories/dependency-modernization/cohorts/checkout.yaml — COHORT-checkout-repositories
id: COHORT-checkout-repositories
repositories:
  - {repositoryId: "repo:checkout-api",      classification: INTERNAL,     scopes: [checkout-api-services]}
  - {repositoryId: "repo:checkout-web",      classification: INTERNAL,     scopes: [checkout-web-app]}
  - {repositoryId: "repo:payments-adapter",  classification: CONFIDENTIAL, scopes: [payments-adapter-core]}
qualificationScope: {workloadClass: dependency-upgrade, environment: staging, riskTier: MEDIUM, autonomyLevel: L3}
budget: {perRepositoryMonthly: {amount: 200, currency: USD}, cohortMonthly: {amount: 500, currency: USD}}   # illustrative
```

### 2. Connect and classify each repository

Mission Control (`convex/projects.ts`):

```bash
npx convex run projects:createRepositoryConnection '{"projectId":"<projectId>","repository":"acme/checkout-web","defaultBranch":"main","dataClassification":"INTERNAL"}'
npx convex run projects:createRepositoryConnection '{"projectId":"<projectId>","repository":"acme/payments-adapter","defaultBranch":"main","dataClassification":"CONFIDENTIAL"}'
npx convex run projects:createRepositoryCodeScope '{"repositoryId":"<checkout-web id>","name":"checkout-web app","slug":"checkout-web-app","includePaths":["apps/checkout-web/**"],"excludePaths":["apps/checkout-web/auth/**"],"requiredReviewers":["priya.n"],"allowedEnvironments":["LOCAL"]}'
npx convex run projects:createRepositoryCodeScope '{"repositoryId":"<payments-adapter id>","name":"payments-adapter core","slug":"payments-adapter-core","includePaths":["src/**"],"excludePaths":["src/keys/**"],"requiredReviewers":["sam.reyes"],"allowedEnvironments":["LOCAL"]}'
```

New connections default to `INTERNAL`; unclassified legacy rows are treated as sensitive (`docs/OVERVIEW.md`). Classification participates in admission: a `CONFIDENTIAL` repository cannot use `remote-sandbox` unless the Sandbox Profile carries provider-enforced egress evidence (`convex/lib/repositoryExecutionPolicy.ts`; readiness check `provider-egress`). Local persistent-worker execution remains eligible, which is why `payments-adapter` is in the cohort with a local backend.

### 3. Extend the route qualification to the cohort

Route qualification carries `repositoryIds[]` (up to 100). A route promoted for one repository does not qualify another; register a qualification revision and promote it with the cohort:

```bash
npx convex run modelCatalog:registerQualificationRevision '{"sourceModelCatalogId":"<modelCatalogId>","expectedRouteDigest":"<routeDigest>","displayName":"Implementation workhorse A — checkout cohort"}'
npx convex run modelCatalog:promoteExactRoute '{"modelCatalogId":"<revisionId>","expectedRouteDigest":"<routeDigest>","evidenceReference":"<cohort evidence>","evidenceDigest":"sha256:<digest>","workloadClasses":["SOFTWARE_CHANGE"],"riskClasses":["GREEN","YELLOW"],"repositoryIds":["<checkout-api id>","<checkout-web id>","<payments-adapter id>"],"compatibility":{…same tuple as tutorial 04…}}'
```

Then register and qualify an Execution Profile on the new route revision (tutorial 05); a profile pins one exact catalog row.

### 4. Create, assess, and activate a version per repository

The composition is identical across the cohort except the repository binding. For each repository:

```bash
npx convex run factory/configuration:create '{"repositoryId":"<checkout-web id>","name":"Dependency Modernization Factory","purpose":"SOFTWARE"}'
npx convex run factory/configuration:createVersion '{"factoryDefinitionId":"<definition id>","workflowId":"<depmod-upgrade row id>","executionProfileId":"<cohort profile id>","codeScopeIds":["<checkout-web scope id>"],"agentBindings":[{"workflowAgentId":"implementer","agentVersionId":"<agentVersionId>"}],"policyEnvelopeId":"<policyEnvelopeId>","budget":{"maxCostUsd":25,"maxRuntimeMinutes":90,"maxAttempts":3},"verifierIds":["<verifier ids>"],"riskBoundary":"YELLOW","recovery":{"pause":false,"cancel":true,"retry":true,"resume":false}}'
npx convex run factory/configuration:assessReadiness '{"factoryDefinitionVersionId":"<version id>"}'
npx convex run factory/configuration:activate '{"factoryDefinitionVersionId":"<version id>"}'
```

Repeat for the verification factory (`FV-review-1.0`) on each repository, since verifier scheduling looks up the `VERIFICATION` definition per repository. Record in `FV-depmod-1.0.activations[]` one entry per environment with `rolloutCohort: COHORT-checkout-repositories` and keep the Mission Control row ids in `x-mission-control.perRepository[]`. Readiness is per repository: the `CONFIDENTIAL` repository's `provider-egress` check passes only for the local backend.

### 5. Write the cohort qualification record

**FDLC step; Mission Control status: Planned.** `QR-depmod-1.0-02` extends tutorial 08's record with the cohort. Its `cohort` block records `workloadSampleSize`, `cohortDigest`, and `syntheticShare`; `x-repositoryCohort: COHORT-checkout-repositories`. If the `CONFIDENTIAL` repository was not in the qualification cohort, it is not qualified: run the cohort on it or exclude it from `qualifiedScopes` until you do.

### 6. Set the budget tree

FDLC requires budgets at objective, Work Order, and factory levels with cost per accepted outcome including failed Attempts. Mission Control's tree (Available for limits; measurement Partial):

| Level | Mission Control field | Enforced where |
|---|---|---|
| Objective | `missions.budgetUsd`, `spentUsd`; Plan estimate ≤ Mission budget | `submitPlan` refuses estimates over budget; dispatch gate `budgetRemaining` |
| Work Order | `implementationPolicy.maxCostUsd`, `maxAttempts`, `timeoutMinutes` | Work Order `budgets`; `inferenceSpendingFence` blocks further inference admission |
| Factory Version | `budget {maxCostUsd ≤ 1000, maxRuntimeMinutes ≤ 480, maxAttempts ≤ 3}` | readiness check `budget`; frozen into the execution manifest |
| Routing policy | `budgetLimitUsd`; lane pools `dailyBudgetUsd`, `monthlyBudgetUsd` | `modelRoutingPolicies:save` |
| Sandbox | `spendLimitUsd`, `spendEnforcement` | Sandbox Profile |
| Inference accounting | price books, reservations, receipts, reconciliation | Experimental, default off |

Actual cost stays `null` where the harness does not report it; failed and retried Attempt spend remains part of the denominator (`docs/architecture/execution-routing-v1.md`). Do not derive a cohort efficiency claim from partial coverage.

### 7. Workers per repository

A canonical worker binds one repository (`CODEX_WORKER_REPOSITORY_ID`) and one stable `CODEX_WORKER_HOST_ID`; never reuse a host id on two machines. For three repositories run three worker processes (or hosts), each with its own checkout root, each reporting its repository access and Factory Version bindings before polling. Capacity is counted server-side across all repositories for the same worker id; the worker's own `currentRuns` is observational only. Fleet enrollment (remote provisioning, inbound ports, internet workers) is Planned.

### 8. Contain one repository, restore under separate authority

Incident Command runs `Clarify → Contain → Observe → Isolate → Restore → Correct → Prevent → Measure`; a command being issued, the executor acknowledging it, and the effect being observed are three separate records; restoration requires its own current, incident-scoped authorization (`docs/software-factory/factory-incident-command.md`; `README.md`). Pause dispatch for exactly one repository:

```bash
npx convex run factory/incidents:create '{"projectId":"<projectId>","repositoryId":"<payments-adapter id>","sourceFingerprint":"sha256=<64 hex>","title":"Suspected credential exposure in payments-adapter candidate","summary":"…","severity":"SEV2","businessImpact":"…","recoveryObjective":"Resume dispatch after independent review of the candidate.","evidenceRefs":[],"idempotencyKey":"INC-payments-adapter-01"}'
npx convex run factory/incidentControls:requestRepositoryDispatchControl '{"incidentId":"<incidentId>","repositoryId":"<payments-adapter id>","operation":"PAUSE_REPOSITORY_DISPATCH","expectedSequence":<n>,"expectedCommanderActorId":"<commander>","authorityExpiresAt":<epoch ms>,"requestId":"INC-payments-adapter-01:pause:1"}'
npx convex run factory/incidentControls:executeRepositoryDispatchControl '{...}'     # executor changes the repository admission projection; separate receipt + acknowledgment
```

While paused, `workOrders:dispatch` and automatic verifier scheduling for that repository fail closed with a `DISPATCH_DENIED` receipt (`requireRepositoryDispatchAdmission`); the other two repositories keep working. Resume requires `factory/incidentControls:authorizeRepositoryDispatchRestoration` (a durable, expiring authorization created before execution) followed by a `RESUME_REPOSITORY_DISPATCH` request; an independent observer records `EFFECT_OBSERVED`. The retained production drill is `docs/testing/evidence/factory-incident-command-production-v55/README.md`; its qualification covers one exact repository operation, not arbitrary controls.

### 9. Watch the portfolio

`/v2/command-center` (workspace and company lenses), `projects:getRepositoryPortfolioSummary`, and `workOrders:factoryOverview` rank attention by risk, age, and evidence state across repositories. Missing data shows as `UNKNOWN`, never as zero.

## Verify

| Check | How |
|---|---|
| Each repository has its own boundary | `projects:listRepositories` shows three connections with distinct classifications; `projects:listCodeScopes` per repository shows non-overlapping scopes |
| Classification gates execution | The `CONFIDENTIAL` repository's version is `BLOCKED` on `provider-egress` if you try a `remote-sandbox` profile, and `PASS` with the local profile |
| Route scope is explicit | The promoted revision's `qualificationSnapshot.repositoryIds` lists exactly the cohort; a Work Order in a fourth repository is ineligible (`model-route` fails readiness) |
| One composition, many activations | The three versions share `executionProfileDigest`, `modelRouteDigest`, `harnessCapabilityManifestDigest`, workflow, agent bindings, and verifiers; they differ in `repositoryId`, `repositoryDataClassification`, `codeScopeIds`, and therefore `configurationDigest` |
| Containment is repository-exact | During the pause, a dispatch in `payments-adapter` yields `DISPATCH_DENIED`; a dispatch in `checkout-api` proceeds |
| Restoration needed separate authority | Resume without a prior restoration authorization is refused; after it, the observer's `EFFECT_OBSERVED` receipt exists |
| Budget tree holds | A Plan whose `estimatedCostUsd` exceeds `missions.budgetUsd` fails `submitPlan`; a version with `maxCostUsd: 2000` fails readiness `budget` |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| One Mission for all three repositories | Not supported; Mission binds one repository | One Mission per repository, or wait for multi-repository Missions (Planned); coordinate through Plans and the cohort record |
| `provider-egress: MISSING` | Sensitive repository on a remote profile without provider-enforced egress proof | Local backend, or a certified Sandbox Profile |
| A worker claims Attempts for the wrong repository | It cannot; repository access and version bindings are checked at claim | Check `CODEX_WORKER_REPOSITORY_ID` per worker |
| Paused repository's Work Orders look "stuck" | Dispatch admission is denied by design | Read the `DISPATCH_DENIED` receipt in Incident Command; restore under authority |
| You want cohort-level cost per accepted outcome | Coverage is partial and model cost may be `null` | Report coverage with the number; never fill unknowns |

## Next tutorial

[Build enterprise governance](/tutorials/build-enterprise-governance) — tenancy, policy bundles, and an audit trail across both factories.

## Related

- Guide: [/guides/multi-repository-factory](/guides/multi-repository-factory)
- Spec: [/specification/v1/qualification-record](/specification/v1/qualification-record) (scope, cohort) · [/specification/v1/factory-version](/specification/v1/factory-version) (`activations[].rolloutCohort`) · [/specification/v1/work-order](/specification/v1/work-order) (`repository`, `codeScopes`)
- Enterprise: [/enterprise/execution-fleet](/enterprise/execution-fleet) · [/enterprise/operations](/enterprise/operations) (D33) · [/architecture/economics](/architecture/economics)
- Patterns: [/patterns/sandbox-per-work-order](/patterns/sandbox-per-work-order) · [/patterns/degraded-mode](/patterns/degraded-mode) · [/patterns/recovery-checkpoint](/patterns/recovery-checkpoint) · Anti-pattern: [/anti-patterns/shared-mutable-workspace](/anti-patterns/shared-mutable-workspace)
- Mission Control: `docs/architecture/company-workspace-repository-control-plane.md`; `docs/software-factory/factory-incident-command.md`; `docs/testing/evidence/factory-incident-command-production-v55/README.md`; ledger rows "Factory incident response — Production-qualified; one exact repository operation", "Cost per accepted outcome — Partial"
- Glossary: Cohort, Classification, Code Scope, Containment, Restoration, Budget tree
