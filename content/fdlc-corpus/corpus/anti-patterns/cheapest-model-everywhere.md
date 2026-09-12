---
title: Cheapest Model Everywhere
description: Token price is the routing rule, so rework, escalation, reviewer time, and escaped defects raise the real cost per accepted outcome.
path: /anti-patterns/cheapest-model-everywhere
audience: [architect, platform, leader, factory-engineer]
level: [practitioner]
status: draft
related: [/anti-patterns, /patterns/model-routing, /patterns/fail-closed-qualification, /patterns/progressive-autonomy, /anti-patterns/frontier-model-everywhere, /anti-patterns/no-outcome-metrics, /anti-patterns/model-lock-in, /architecture/economics]
diagrams: [D22]
mc_refs: [convex/schema.ts, convex/lib/executionRouting.ts, docs/architecture/execution-routing-v1.md]
---

# Cheapest Model Everywhere

**Also known as:** Token-price optimization · The small-model mandate · "Use the cheap one unless it fails"

**Severity:** Medium

## Symptoms

- Routing policy selects the lowest price-per-token route for every task class, including architecture reasoning and independent review.
- First-pass verification rate is low; most Work Orders need two or more Attempts.
- Escalation to a larger model is frequent and triggered by the agent giving up.
- Reviewers spend more time per accepted change than before the factory existed.
- The finance dashboard shows falling token spend and rising total cost.

## Why it fails

Design principle 10 measures cost per accepted outcome, with failed and retried Attempts in the denominator. A route that is a third of the price but needs three tries and a human fix is more expensive, not less. Small models are the right choice for bounded transformation with deterministic verification; they are the wrong choice for reasoning-heavy planning, ambiguous specifications, and independent verification of subtle changes. Choosing by price alone also ignores qualification: the cheapest route may not be qualified for the risk tier at all, and a fallback "up" to a qualified route under pressure is a form of unplanned escalation.

Scenario: a factory routes the SDK migration to its cheapest route. Attempt 1 produces a diff that compiles but misses the v4 retry semantics; the verifier fails it. Attempt 2 fixes retries but breaks idempotency keys; failed again. Attempt 3 escalates to the workhorse route and passes. Three Attempts, two verifier runs, one human triage — for a Work Order the workhorse route would have finished in one.

## How it shows up in the wild

- Cost-reduction initiatives that set a global default model.
- Routers that sort by `pricePerToken` with no evidence or qualification input.
- Agent products that advertise low per-run cost and hide retry rates.
- Verification performed by the same cheap route as production, "to save money".

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Routes selected outside their qualification scope; risk tiers ignored |
| Security | Weak independent review at High tier; subtle regressions pass |
| Cost | Higher cost per accepted outcome despite lower token price |
| Reliability | Low first-pass rate; retry storms; reviewer fatigue |

## The fix

Patterns: [model-routing](/patterns/model-routing), [fail-closed-qualification](/patterns/fail-closed-qualification), [progressive-autonomy](/patterns/progressive-autonomy).

Minimal migration:

1. Define logical routes per task class; qualify each candidate model route per workload class and risk tier.
2. Rank eligible routes by cost per accepted outcome over an evidence window, not by token price.
3. Declare an escalation ladder triggered by verification evidence, each rung a new Attempt with attributed cost.
4. Require the verification route to be qualified for verification; at High and Critical tiers, require a risk-approved route.
5. Report first-pass verification rate and cost per accepted outcome per route; retire routes that lose.

## How Mission Control prevents it

Routing filters eligibility before ranking and ranks by an evidence window (`evidenceWindowDays`, `minimumVerifiedAttempts`, `minimumEvidenceCoverage`, `minimumScoreMargin`) rather than by price alone; "an unknown component contributes no favorable score" (`convex/lib/executionRouting.ts:34-44, 561-608`; `docs/architecture/execution-routing-v1.md`, Available — Implemented, gated). "Failed and retried Attempt spend remains part of the denominator cost." High and Critical Work Orders require `riskApproved` model routes (`executionRouting.ts:515-524`). Model routes carry `tier: FAST|BALANCED|POWERFUL`, `capabilities[]`, a `costPolicyDigest`, and a qualification scope (`convex/schema.ts:1763`). `inferenceRouteComparisons` produce `ADVISORY_ONLY` or `NO_GO` with `automaticPromotionAuthorized: false`, so a cheaper route is promoted only by a human citing evidence.

Limitation: Guarded Auto is disabled, so route selection in production is advisory or pinned; evidence-based ranking is implemented but human-applied. Cost per accepted outcome is Partial, so ranking uses verified-outcome evidence more than measured cost.

## Detection

- Routing policies whose only rule input is price or tier.
- First-pass verification rate by route: a cheap route far below others on the same workload class.
- Attempts per accepted outcome rising after a model change.
- Escalation events triggered by the agent rather than by verification verdicts.
- Human review minutes per accepted outcome rising while token spend falls.

## Related

- Fixing patterns: [model-routing](/patterns/model-routing) · [fail-closed-qualification](/patterns/fail-closed-qualification) · [progressive-autonomy](/patterns/progressive-autonomy)
- Sibling anti-patterns: [frontier-model-everywhere](/anti-patterns/frontier-model-everywhere) · [no-outcome-metrics](/anti-patterns/no-outcome-metrics) · [model-lock-in](/anti-patterns/model-lock-in)
- [Top 10 F05 Unqualified Composition](/anti-patterns/top-10) · [/architecture/economics](/architecture/economics) · Design principle 10
