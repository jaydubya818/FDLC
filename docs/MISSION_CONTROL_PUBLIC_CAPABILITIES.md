# Mission Control Public Capability Matrix

Date: 2026-09-03

Original baseline: local Mission Control checkout `07a96ac3623c8a6772455fcf4c9cdf4ca78e6d2f`. The MCP and native-tool rows were reconciled against main `aa8c12b` on 2026-09-05 after the separately qualified read-only service landed. The current capability maturity ledger remains canonical. Website labels intentionally compress its detailed internal vocabulary into Available, Experimental, Planned, and Proposed.

| Capability | Public status | Safe public claim | Limitation to disclose | Source evidence |
| --- | --- | --- | --- | --- |
| Governed Missions, Plans, and WorkOrders | Available | Versioned Plans can be reviewed and approved before releasing bounded WorkOrders. | Qualified for the documented one-repository V1 golden path; consequential execution has separate gates. | `docs/product/software-factory-capability-maturity.md`; `convex/missions.ts`; `convex/missionPlans.ts`; `convex/workOrders.ts` |
| Spec-driven Mission intake | Experimental | Immutable Mission Spec revisions and deterministic spec-quality checks are implemented. | Default off; `FINALIZED` means planning-ready, not approved or authorized. | `docs/OVERVIEW.md`; `convex/missionSpecs.ts`; `convex/schema.ts` |
| Worker admission, Attempts, leases, and recovery | Available | Execution is admitted against frozen configuration, fenced by a lease, and recorded as immutable Attempt lineage. | Fleet-scale provider failure operation is not claimed. | `docs/software-factory/worker-runtime-operations.md`; `convex/attempts.ts`; `apps/orchestration-server/` |
| Independent verification and Quality Gates | Available | Exact candidates can be checked by a logically separate verifier and bound to evidence receipts and gate decisions. | Verification makes work eligible for acceptance; it does not accept, merge, or release work. | `docs/software-factory/verification-first-domain-contracts.md`; `docs/software-factory/verification-and-gate-state-machines.md`; `convex/verificationRuns.ts` |
| Human Plan approval and WorkOrder acceptance | Available | Human decisions are distinct, server-authorized boundaries. | Merge and production release remain separate decisions. | `docs/product/mission-control-north-star.md`; `convex/workOrders.ts`; `convex/approvalDecisions.ts` |
| Codex harness adapter | Available | `codex/v1` is the production-admitted execution adapter. | Admission is bounded to exact supported configuration and repository controls. | `packages/workflow-engine/src/harnessManifests.ts`; maturity ledger |
| DeepSeek harness adapter | Experimental | A pinned local persistent-worker adapter exists for evaluation. | Disabled by default and not production-admitted. | `docs/software-factory/worker-runtime-operations.md`; harness manifests |
| Model/harness/backend routing | Experimental | Policy-aware routing and recorded routing decisions are implemented behind gates. | Advisory/default-gated; evidence volume and cost coverage are incomplete. | `packages/model-router/`; `convex/modelRouting.ts`; maturity ledger |
| Factory Memory and Context Packages | Available | Provenance-backed context can be retrieved, frozen to an Attempt, and inspected. | Advisory and phase-gated; cannot alter frozen intent or satisfy acceptance. | `packages/memory/`; `convex/factoryMemory.ts`; maturity ledger |
| Observability, traces, and evals | Available | Runs can produce traces, scores, datasets, and experiments for diagnostic comparison. | Diagnostic only; these records do not confer acceptance authority. | `convex/traces.ts`; `convex/evals.ts`; maturity ledger |
| Factory Learning | Experimental | Accepted outcomes and evidence can form bounded learning signals and human-reviewed proposals. | Promotion remains manual and real production signals are limited. | `docs/software-factory/CONTINUOUS_LEARNING.md`; `convex/factoryLearning.ts`; maturity ledger |
| GitHub App publication/currentness | Available | Publication can be permit-gated and reconciled to exact pull-request head and evidence lineage. | Demonstrated in a bounded path; merge remains human-owned. | `docs/testing/evidence/real-codex-github-pr-golden-path/README.md`; `convex/githubApp.ts` |
| Remote Sandbox | Experimental | A bounded live Remote Sandbox cohort has been qualified for production-pilot evaluation. | Preview only; provider-enforced egress and sustained real-work evidence remain missing. | `docs/product/software-factory-capability-maturity.md`; remote sandbox qualification evidence |
| Native tool authorization | Experimental | Native allowlists exist; the canonical Tool Version/Grant and receipt contract now covers the MCP fixture and one read-only operation. | Native harness tools do not yet share that full canonical authority contract. | Governed MCP decision record; maturity ledger at `aa8c12b` |
| MCP runtime | Experimental | Exact Tool Version/Grant checks and durable broker receipts cover the local fixture and one fixed public React query through Context7 `query-docs`. | No write or generalized connector authority; general harness-native MCP remains unsupported. | [Phase 4 recovery record at aa8c12b](https://github.com/jaydubya818/MissionControl/blob/aa8c12b1d4907589b71cef3cb421ef2a2c380676/docs/testing/evidence/governed-mcp-phase4-recovery/README.md) |
| Release and production feedback | Experimental | Release records and some gating/feedback structures exist. | No complete production observation, rollback, and outcome proof. | `convex/factoryReleases.ts`; maturity ledger |
| Multi-tenant enterprise operation | Experimental | Company/workspace scoping exists. | Cross-company production operation is not qualified. | `convex/schema.ts`; authorization tests; maturity ledger |
| Factory incident response | Planned | Existing alerts and evidence can support a future incident lifecycle. | No canonical end-to-end incident aggregate and recovery lifecycle exists. | maturity ledger; convergence plan |
| Public benchmark program | Proposed | Mission Control exposes measurements useful for future FDLC benchmarks. | No public benchmark dataset or comparable result series exists. | Observability/eval sources; FDLC benchmark proposal |

## Public copy rules

1. Use “open-source reference implementation of the Factory Development Lifecycle.”
2. Describe Mission Control as a governed control plane; do not imply it supplies every component of a complete AI software factory.
3. Label screenshot data as deterministic demo data where applicable.
4. Keep Available statements narrow and pair them with their material limitation.
5. Do not claim general production certification, fleet scale, zero-touch delivery, full MCP support, automatic self-improvement, or enterprise availability.
6. Link the public page to the repository README, capability ledger, and exact quickstart.
