---
title: No Outcome Metrics
description: Success is measured in tokens, PRs, or velocity, so nobody knows cost per accepted outcome, autonomy cannot be earned, and learning optimizes activity.
path: /anti-patterns/no-outcome-metrics
audience: [leader, architect, platform, factory-engineer]
level: [practitioner]
status: draft
related: [/anti-patterns, /patterns/governed-learning, /patterns/progressive-autonomy, /patterns/model-routing, /anti-patterns/human-approval-everywhere, /anti-patterns/cheapest-model-everywhere, /architecture/economics, /architecture/observability, /benchmarks]
diagrams: [D22]
mc_refs: [convex/schema.ts, docs/software-factory/accounting-delivery-contract.md, docs/architecture/execution-routing-v1.md]
---

# No Outcome Metrics

**Also known as:** Token dashboards · PR count as productivity · "The agent generated 40k lines this week"

**Severity:** Medium

## Symptoms

- The factory dashboard shows tokens consumed, PRs opened, lines generated, and "tasks completed" (as reported by the agent).
- Nobody can state cost per verified, accepted, or released outcome.
- Failed and retried Attempts are excluded from cost because they "didn't ship".
- Missing cost data is recorded as zero.
- Autonomy and model decisions are argued from anecdotes.

## Why it fails

Design principle 10: optimize for cost per accepted outcome, not tokens or generated volume. Generation is activity. A factory creates value only when an accepted outcome is delivered with known quality, cost, effort, and risk. Metrics that count activity reward the factory for doing more, including more rework, more retries, and more reviewer time. They also break two dependent patterns: autonomy cannot be earned without verified-outcome evidence over a window, and learning cannot be governed without outcome attribution. Zeros invented for missing cost make every efficiency claim false.

Scenario: a factory reports 300 PRs merged this quarter, up 40%. Nobody counted that 35% were reopened, that reviewer minutes per accepted change doubled, that two escaped defects caused a rollback, or that the frontier-model escalation ladder now triggers on half of all Work Orders. The cost per accepted outcome rose while the dashboard celebrated.

## How it shows up in the wild

- Vendor dashboards centered on tokens, sessions, and "acceptance rate" of suggestions.
- Engineering metrics programs that count agent PRs like human PRs without reopen, rollback, or review-minute denominators.
- Cost reporting per provider invoice with no attribution to Work Orders.
- Learning loops optimizing "task completion" as self-reported by the agent.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Autonomy promotions and model changes lack evidence; measurement contract absent |
| Security | Escaped defects and rollbacks not tracked as outcomes; incidents invisible in the economics |
| Cost | Real cost per outcome unknown; spend grows with volume |
| Reliability | Reopen and rollback rates unmeasured; quality regressions undetected |

## The fix

Patterns: [governed-learning](/patterns/governed-learning) (outcome measurement feeds signals), [progressive-autonomy](/patterns/progressive-autonomy), [model-routing](/patterns/model-routing) (routing by cost per accepted outcome).

Minimal migration:

1. Adopt the three denominators: cost per verified outcome, cost per accepted outcome, cost per released outcome — each including failed and retried Attempt spend.
2. Record cost per Attempt as `MEASURED`, `ESTIMATED`, or `UNKNOWN` with coverage; never zero for unknown.
3. Track the guardrail set: cycle time, human review minutes, first-pass verification rate, reopen rate, rollback rate, escaped defects, verifier disagreement.
4. Bind Outcomes to releases over an observation window; attribute to the Factory Version and cost cohort.
5. Publish a measurement contract; feed outcomes to Learning Signals and autonomy decisions.

## How Mission Control prevents it

Attempt cost carries `actualCost.status: MEASURED|UNAVAILABLE`; "Unavailable cost remains `null` with a reason and coverage impact; it cannot support an efficiency claim"; "Mission Control never invents zeroes" (`convex/schema.ts:5390-5443`; `docs/OVERVIEW.md`, Available). `factoryOutcomeEvents` record stages `VERIFICATION_PASSED → HUMAN_ACCEPTED → MERGED → DEPLOYED → PRODUCTION_VERIFIED | INCIDENT | ROLLED_BACK | REJECTED | ABANDONED`, and `factoryOutcomeProjections` compute `accepted-outcome-economics/v1|v2` with `costCoverage` and `confidence: HIGH|LOW|NONE` (`convex/schema.ts:4514-4581`, Partial). Routing's evidence window scores verified-outcome rate and states "failed and retried Attempt spend remains part of the denominator cost" (`docs/architecture/execution-routing-v1.md`). Governed inference accounting chains reservation → intent → receipt → reconciliation with `costClassification: ESTIMATED|UNKNOWN` (Experimental, default off). The golden eval receipt is `WARN` precisely because token attribution is unknown.

Limitation: model/provider cost per accepted outcome is `null` in the retained V3 evidence, and production outcome observation does not yet feed the learning loop; Mission Control's ledger marks "Cost per accepted outcome — Partial". It refuses to claim the metric rather than invent it, which is the FDLC posture.

## Detection

- Dashboards without any of the three denominators or without reopen/rollback rates.
- Cost records showing exact zeros for Attempts with model usage.
- Cost cohorts excluding failed or retried Attempts.
- Autonomy or model-route changes justified without an evidence window.
- Outcome records absent for released changes, or with no observation window.

## Related

- Fixing patterns: [governed-learning](/patterns/governed-learning) · [progressive-autonomy](/patterns/progressive-autonomy) · [model-routing](/patterns/model-routing)
- Sibling anti-patterns: [human-approval-everywhere](/anti-patterns/human-approval-everywhere) · [cheapest-model-everywhere](/anti-patterns/cheapest-model-everywhere) · [hidden-learning](/anti-patterns/hidden-learning)
- [Top 10 F10 Misplaced Human Judgment and Vanity Metrics](/anti-patterns/top-10) · [/architecture/economics](/architecture/economics) · [/benchmarks](/benchmarks) · Design principle 10; Manifesto principle 10
