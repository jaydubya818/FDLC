# Mission Control Public Capability Matrix

Date: 2026-09-07

Baseline: Mission Control `ed77c46c9d975a2ed0c666cdaf0a3f0e12e77d4d`. The current capability maturity ledger remains canonical. Website labels intentionally compress its detailed internal vocabulary into Available, Experimental, Planned, and Proposed.

The routing, inference accounting, and incident rows were reconciled against
Mission Control `ee870794cddb426824fc881a520ccdda028060d6` on 2026-09-07.
This updates only their cited scope; it does not establish live provider
billing, broad containment, accepted customer outcomes, or general production
qualification. Routing and inference accounting are distinct responsibilities.

| Capability | Public status | Safe public claim | Limitation to disclose | Source evidence |
| --- | --- | --- | --- | --- |
| Governed Missions, Plans, and WorkOrders | Available | Versioned Plans can be reviewed and approved before releasing bounded WorkOrders. | Qualified for the documented one-repository V1 golden path; consequential execution has separate gates. | `docs/product/software-factory-capability-maturity.md`; `convex/missions.ts`; `convex/missionPlans.ts`; `convex/workOrders.ts` |
| Spec-driven Mission intake | Experimental | Immutable Mission Spec revisions and deterministic spec-quality checks are implemented. | Default off; `FINALIZED` means planning-ready, not approved or authorized. | `docs/OVERVIEW.md`; `convex/missionSpecs.ts`; `convex/schema.ts` |
| Worker admission, Attempts, leases, and recovery | Available | Execution is admitted against frozen configuration, fenced by a lease, and recorded as immutable Attempt lineage. | Fleet-scale provider failure operation is not claimed. | `docs/software-factory/worker-runtime-operations.md`; `convex/attempts.ts`; `apps/orchestration-server/` |
| Independent verification and Quality Gates | Available | Exact candidates can be checked by a logically separate verifier and bound to evidence receipts and gate decisions. | Verification makes work eligible for acceptance; it does not accept, merge, or release work. | `docs/software-factory/verification-first-domain-contracts.md`; `docs/software-factory/verification-and-gate-state-machines.md`; `convex/verificationRuns.ts` |
| Human Plan approval and WorkOrder acceptance | Available | Human decisions are distinct, server-authorized boundaries. | Merge and production release remain separate decisions. | `docs/product/mission-control-north-star.md`; `convex/workOrders.ts`; `convex/approvalDecisions.ts` |
| Codex harness adapter | Available | `codex/v1` is the production-admitted execution adapter. | Admission is bounded to exact supported configuration and repository controls. | `packages/workflow-engine/src/harnessManifests.ts`; maturity ledger |
| DeepSeek harness adapter | Experimental | A pinned local persistent-worker adapter exists for evaluation. | Disabled by default and not production-admitted. | `docs/software-factory/worker-runtime-operations.md`; harness manifests |
| Model/harness/backend routing | Experimental | Policy-aware routing records capability selection against qualification and execution constraints. | Advisory and gated; complete outcome economics and broader live fallback qualification remain incomplete. | [Current ledger at ee870794](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/product/software-factory-capability-maturity.md) |
| Governed inference accounting | Experimental | Aggregate reservations, bounded dispatch allowance, immutable observations, settlement correction, and durable recovery are qualified offline. | Default off. Live provider billing, comparison of two exact routes, and real accepted-workload economics remain unqualified. | [Current convergence program at ee870794](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/software-factory/capability-convergence-program.md); [current ledger](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/product/software-factory-capability-maturity.md) |
| Factory Memory and Context Packages | Available | Provenance-backed context can be retrieved, frozen to an Attempt, and inspected. | Advisory and phase-gated; cannot alter frozen intent or satisfy acceptance. | `packages/memory/`; `convex/factoryMemory.ts`; maturity ledger |
| Observability, traces, and evals | Available | Runs can produce traces, scores, datasets, and experiments for diagnostic comparison. | Diagnostic only; these records do not confer acceptance authority. | `convex/traces.ts`; `convex/evals.ts`; maturity ledger |
| Factory Learning | Experimental | Accepted outcomes and evidence can form bounded learning signals and human-reviewed proposals. | Promotion remains manual and real production signals are limited. | `docs/software-factory/CONTINUOUS_LEARNING.md`; `convex/factoryLearning.ts`; maturity ledger |
| GitHub App publication/currentness | Available | Publication can be permit-gated and reconciled to exact pull-request head and evidence lineage. | Demonstrated in a bounded path; merge remains human-owned. | `docs/testing/evidence/real-codex-github-pr-golden-path/README.md`; `convex/githubApp.ts` |
| Remote Sandbox | Experimental | A bounded live Remote Sandbox cohort has been qualified for production-pilot evaluation. | Preview only; provider-enforced egress and sustained real-work evidence remain missing. | `docs/product/software-factory-capability-maturity.md`; remote sandbox qualification evidence |
| Native tool authorization | Experimental | A canonical Tool Version, Tool Grant, broker, and durable-receipt boundary covers fixtures and one qualified real read. | Harness-native tools do not yet use the same canonical authority. | governed MCP ADR; harness manifests; maturity ledger |
| MCP runtime | Experimental | One exact Context7 `query-docs` read was qualified through an exact Tool Version and Tool Grant, an Execution Profile and canonical Attempt, brokered execution, durable receipts, schema/currentness checks, and independent verification. | One fixed public React query only; writes, arbitrary services or operations, broad credentials, remote arbitrary MCP, and harness-native MCP remain unsupported. | [Phase 4 completion record at f90c50f](https://github.com/jaydubya818/MissionControl/blob/f90c50f5b4191467b2117bb8762754f697b1cefd/docs/testing/evidence/governed-mcp-phase4-recovery/completion-record.md); maturity ledger |
| Release and production feedback | Experimental | Release records and some gating/feedback structures exist. | No complete production observation, rollback, and outcome proof. | `convex/factoryReleases.ts`; maturity ledger |
| Multi-tenant enterprise operation | Experimental | Company/workspace scoping exists. | Cross-company production operation is not qualified. | `convex/schema.ts`; authorization tests; maturity ledger |
| Factory incident pause and restoration | Available | Incident Command qualified pause and separately authorized restoration of dispatch admission for the Mission Control repository, with independently observed effects. | One exact repository operation using a synthetic qualification incident; other controls, arbitrary repositories, customer incidents, and autonomous emergency authority remain unqualified. | [Production qualification v55 at ee870794](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/testing/evidence/factory-incident-command-production-v55/README.md) |
| Broader containment controls | Planned | Extend qualified containment to additional capability versions, control actions, and targets as workload needs justify them. | Each control and target requires separate qualification and authority; the existing pause operation grants no broader permission. | [Current limitation and next gate at ee870794](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/product/software-factory-capability-maturity.md) |
| Public benchmark program | Proposed | Mission Control exposes measurements useful for future FDLC benchmarks. | No public benchmark dataset or comparable result series exists. | Observability/eval sources; FDLC benchmark proposal |

## Public copy rules

1. Use “open-source reference implementation of the Factory Development Lifecycle.”
2. Describe Mission Control as a governed control plane; do not imply it supplies every component of a complete AI software factory.
3. Label screenshot data as deterministic demo data where applicable.
4. Keep Available statements narrow and pair them with their material limitation.
5. Do not claim general production certification, fleet scale, zero-touch delivery, full MCP support, automatic self-improvement, or enterprise availability.
6. Link the public page to the repository README, capability ledger, and exact quickstart.

## Production reliability requirements

The public incident-operations section describes required next capabilities, not
current availability. Preserve the existing roadmap order and extend current
records and controls in this sequence:

1. Build an impact graph and blast-radius query over Factory Versions, Execution
   Profiles, capabilities, WorkOrders, Attempts, effects, evidence, approvals,
   releases, environments, and outcomes. Retain explicit unknown states and
   evidence freshness.
2. Add one durable incident record with severity, roles, hypotheses, decisions,
   commands, acknowledgements, observed enforcement, communications, and handoff.
3. Qualify scoped containment and declared degraded modes one control and subject
   at a time. Do not infer broad authority from the existing repository pause.
4. Add effect reconciliation for saga and partial-DAG recovery, including stable
   logical operations, receipts, orphaned work, compensation, residual effects,
   and the safe boundary for a replacement Attempt.
5. Bind known-good restoration to exact artifact and configuration identity and
   require independent recovery evidence, backlog disposition, residual risk,
   and governed corrective actions before incident closure.

The acceptance bar includes negative tests for stale workers, ambiguous effects,
failed control enforcement, unavailable policy or identity, stale queued work,
failed restoration, and recovery that creates a new regression.
