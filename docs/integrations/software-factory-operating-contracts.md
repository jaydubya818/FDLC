# Software Factory operating contracts — ecosystem integration

Date: 2026-09-05
Status: source content qualified; approved deployment guard undergoing PR and clean-main qualification

## Canonical meaning and scope

A Software Factory turns governed intent into verified outcomes through replaceable capabilities operating inside durable authority, state, evidence, and recovery contracts. FDLC defines those responsibilities; the Guide teaches the engineering; Mission Control demonstrates only the behavior supported by revision-specific evidence.

The supplied material largely corroborates existing coverage. This integration improves precise contracts and corrects claims. It does not add architecture areas, delivery states, a new agent platform, or production authority. Personal narratives and unverified performance figures are excluded.

## Coverage map prepared before implementation

| Concept | Classification | FDLC location | Guide owner | Mission Control evidence and gap |
| --- | --- | --- | --- | --- |
| Governed Mission; replaceable planner; durable Plan | EXISTING / REFINE | Architecture: Intent | Chapters 5, 6, 13 | `convex/missionPlanning.ts`; qualified bounded golden path, not unrestricted delivery |
| Deterministic control plane; bounded execution | EXISTING | Architecture: control boundary, Harness, Trust | Chapters 13, 16, 17, 33 | Attempt admission, leases, Execution Profiles; no new subsystem needed |
| Capability selection before model selection | REFINE | Architecture: Capability, Model | Chapter 22 | Model/harness/backend routing implemented and gated; a universal tool/skill/human router is PLANNED |
| Dependency graph, bounded parallelism, capacity | EXISTING / REFINE | Architecture: Harness; Benchmarks | Chapters 9, 23, 34 | Workflow engine, execution routing, budgets; fleet fairness and full work amplification accounting remain partial |
| Context, state, memory, knowledge and conflict resolution | REFINE | Architecture: Capability, Trust | Chapter 20; glossary | Factory Memory and frozen Context Packages exist; general authority-aware retrieval quality remains partial |
| Unknown external outcome and safe reconciliation | REFINE | Architecture: Harness | Chapter 14; glossary | Recovery and PR reconciliation exist; generic side-effecting tool reconciliation is PLANNED |
| Schema, semantic and policy validation of tool results | EXISTING / REFINE | Mission Control capability claim | Chapters 18, 29 | Governed MCP broker and Convex receipts; experimental local fixture plus one fixed read-only Context7 query qualified separately |
| Criterion-level verification; independent failure modes | EXISTING / REFINE | Architecture: Intent, Trust | Chapters 27, 29, 31 | Verification Subjects, verifier Attempts and Quality Gates; passing evidence does not accept or release |
| Trajectory diagnosis, hard gates and evaluator uncertainty | REFINE | Architecture: Trust; Benchmarks | Chapter 29 | Diagnostic traces/evals exist; full production trajectory scorecard is not qualified |
| Verified versus accepted cost; missing-data semantics | CONFLICT / REFINE | `data/fdlc.ts`; Benchmarks | Chapter 9; glossary | Cost coverage is partial; actual provider and human costs cannot be invented |
| Failure becomes regression; controlled promotion | EXISTING | Architecture: Learning | Chapters 30, 39, 40 | Factory Learning is advisory; no automatic promotion |
| Lighthouse adoption and reusable domain capability | EXISTING / DEFER | Framework; adoption surfaces | Chapters 34, 38, 43 | V1 strategy already prioritizes a real product-repository pilot; no new organization or product surface |

## Terminology and architectural decisions

- Preserve **Intent, Harness, Capability, Model, Trust, Learning**. The source's other groupings are operating concerns within these six areas.
- Preserve the outer lifecycle **Discover → Design → Assemble → Validate → Deploy → Operate → Improve**. Here Deploy means deploying the factory; Release means delivering software inside it.
- Preserve **Intent → Specification → Plan → Work Order → Attempt → Evidence → Verification → Approval → Release → Outcome → Learning Signal**. Mission Control uses Mission for Intent and Task inside WorkOrder.
- Unknown external outcome is a statement about operation evidence, not a new Mission/Task status and not an authority grant.
- Policy determines permitted action; current repository state establishes observed facts; approved intent/specification defines desired behavior. Their disagreement requires resolution, not a universal ranking that lets code override policy.
- Cost per verified outcome divides cohort spend by independently verified outcomes. Cost per accepted outcome uses verified, accepted outcomes. Use the same declared cohort/window for each numerator and denominator, include failed work, and retain ACTUAL / ESTIMATED / UNKNOWN coverage.
- Deterministic execution reduces variance but does not establish correctness, absence of bugs, or authorization.

## Lifecycle mapping

Discover sets the builder outcome, baseline and work class. Design defines verification, authority, recovery and measurement contracts. Assemble binds versions and existing capabilities. Validate exercises representative cases, negative controls and baseline comparisons. Deploy admits a frozen Factory Version under its existing gates. Operate reconciles uncertainty and records cost, evidence and outcomes. Improve turns attributed failures into regression cases and reviewed candidates.

## Repository changes selected

- **FDLC:** refine the typed architecture model, add a concise comparable-measurement contract, and correct the experimental tool-boundary claim.
- **Guide:** extend Chapters 9, 14, 20 and 29 with measurement definitions, an operation-reconciliation decision table, source-conflict rules and cross-layer negative cases. Add only missing glossary terms and an explicit current-evidence note; retain historical case-study assessments.
- **Mission Control:** add an operating-contract map over existing source/tests and a supplemental ledger note. No runtime behavior or maturity promotion is justified by this documentation integration.

The file count reflects separate chapter ownership and cross-repository evidence, not a runtime refactor. Hosting, migration bridges, schemas and runtime permissions are outside the change.

## Evidence baseline

Mission Control initial main inspected: `0d1a090`. Its Phase 3 completion record cites the qualified implementation `37953e4d2879` and clean-main qualification `6611a03c6025`. Those records prove one local stdio read-only qualification fixture, not a network service or general harness-native MCP support. Earlier evidence and Guide study revision `d902fae` remain historical.

During final review, the separately qualified [Mission Control #174](https://github.com/jaydubya818/MissionControl/pull/174) landed at `aa8c12b1d4907589b71cef3cb421ef2a2c380676`. Its [Phase 4 evidence](https://github.com/jaydubya818/MissionControl/blob/aa8c12b1d4907589b71cef3cb421ef2a2c380676/docs/testing/evidence/governed-mcp-phase4-recovery/README.md) qualifies exact Context7 `query-docs` for one fixed public React query. FDLC, Guide Chapter 29 and the implementation map were reconciled to that evidence, retaining Experimental status and the prohibition on generalized connector/write authority. This integration adds no service or model calls and preserves the separately landed runtime.

The existing Mission Control checkout was on another branch; changes use a dedicated checkout from current main. The Guide's cloud-backed files required a clean checkout. Existing local work is preserved.

## Validation, reviews and release

- FDLC: TypeScript, ESLint, unit tests, production build and all 14 rendered-route checks passed. A two-line tab-label contrast fix resolved findings on the affected Mission Control page.
- Guide: local links in 69 Markdown files, editorial integrity (zero excluded terms or duplicate definitions), generation of 66 documents and search index, lint, TypeScript, build and all 27 tests passed. Existing routing, assets and migration configuration remain unchanged. No Mermaid diagram was added or changed.
- Browser: 16 route/viewport combinations at 1440px and 390px; zero page errors, horizontal page overflow or serious/critical axe findings after corrections. See [browser results](./operating-contracts-browser-checks.json). Manual screenshot inspection covered the updated reading layouts. The new economics formulas use a wrapping table for mobile accessibility.
- Mission Control: all 19 System Factory qualification gates passed at `5783e76779e201db5701c974e240a905362bf2ce`. The retained eval receipt has six passing blocking cases and its existing advisory economics WARN. A later source-link correction and evidence commit changed documentation only and passed the relevant checks.
- Review covered architecture ownership, authority/security, evidence integrity, simplicity and editorial consistency. No runtime or schema changes require a separate implementation review. Corrections included a broken source link, terminology distinctions and accessible formula presentation.
- Seven cross-repository chapter/framework/evidence links returned HTTP 200. New public links use existing chapter routes or revision-pinned evidence, so either documentation PR can land independently. The experimental tool claim relies on already-merged implementation evidence.

Production remains unchanged. Dedicated branches and separate PRs preserve repository histories and existing local work. CI status and PR links are recorded below.

The approved [source/release policy](./source-release-policy.md) adds only a main-branch Git deployment guard to four effective Vercel configurations across these repositories. Non-main Previews remain enabled. Production deployment, canonical aliases and the separate migration-bridge release process retain their existing authority. The guard persists after this integration; removal requires a separately reviewed deployment-policy decision. Updated exact-head and post-merge results are retained in the ecosystem review record.

## Remaining gaps

Real-team adoption, complete outcome economics, general side-effecting tool recovery, production retrieval quality, fleet failure operation and automatic rollout remain evidence-gated work. This integration does not upgrade those capabilities.

## Review links

- [Guide PR #13](https://github.com/jaydubya818/ai-software-factory-mastery/pull/13), commit `9d11c75`.
- [Mission Control PR #173](https://github.com/jaydubya818/MissionControl/pull/173), documentation/evidence commit `2fc0048`; [qualification package](https://github.com/jaydubya818/MissionControl/blob/2fc0048/docs/testing/evidence/operating-contracts-5783e76/README.md).
- FDLC: this integration record ships with the framework PR; CI and merge status remain separate from local qualification.
