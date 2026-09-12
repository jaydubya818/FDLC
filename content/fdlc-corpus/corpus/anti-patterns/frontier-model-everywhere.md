---
title: Frontier Model Everywhere
description: The largest model performs every task including bounded transformation, so cost and latency are unjustified, capacity is fragile, and outages force unqualified fallbacks.
path: /anti-patterns/frontier-model-everywhere
audience: [architect, platform, leader, factory-engineer]
level: [practitioner]
status: draft
related: [/anti-patterns, /patterns/model-routing, /patterns/degraded-mode, /patterns/fail-closed-qualification, /anti-patterns/cheapest-model-everywhere, /anti-patterns/model-lock-in, /anti-patterns/context-dumping, /architecture/economics]
diagrams: [D22]
mc_refs: [convex/schema.ts, convex/lib/executionRouting.ts, convex/lib/factoryIncident.ts, docs/architecture/execution-routing-v1.md]
---

# Frontier Model Everywhere

**Also known as:** Biggest model by default · "Quality first, cost later" · Fallback-to-whatever

**Severity:** Medium

## Symptoms

- Every agent, including the one that renames imports, uses the most capable and most expensive route.
- Latency per Attempt is dominated by inference; queues form during provider rate limits.
- When the frontier provider degrades, the factory either stops or silently falls back to a route nobody qualified.
- Cost per accepted outcome is high and flat; there is no cheaper route to compare against.
- Deterministic steps (formatting, codemods, digest computation) are performed by inference.

## Why it fails

The routing principle is right-sizing: frontier for architecture reasoning, workhorse for implementation, small or local for transformation, independent model for verification, and no model at all for deterministic steps. Using the largest model everywhere spends the most on the tasks that need it least, concentrates the factory's availability on one provider tier, and — the governance failure — leaves no *qualified* fallback, so a rate limit turns into either an outage or an unqualified route taking over. It also tends to co-occur with [context-dumping](/anti-patterns/context-dumping), since a large window invites a large prompt.

Scenario: a factory runs all four of its agents on the frontier route. A provider incident rate-limits the route for two hours. The policy's fallback chain names a mid-tier model that was added to the catalog last week and never qualified. Twelve Work Orders execute on it; three produce hallucinated package versions the qualification suite tests for; the verifier catches two. The third reaches a human who trusted the factory's normal quality.

## How it shows up in the wild

- Agent platforms defaulting every persona to the flagship model.
- Teams that equate "best model" with "safest" and never route by task class.
- Fallback chains configured for availability with no qualification gate.
- Codemod and formatting steps implemented as prompts.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Fallbacks outside qualification scope; degraded mode undeclared |
| Security | Unqualified fallback route may lack hallucinated-effect and credential-handling tests |
| Cost | Highest token cost for the lowest-value tasks; no comparison baseline |
| Reliability | Single-tier dependency; capacity fragility; long queues |

## The fix

Patterns: [model-routing](/patterns/model-routing), [degraded-mode](/patterns/degraded-mode), [fail-closed-qualification](/patterns/fail-closed-qualification).

Minimal migration:

1. Inventory task classes per Work Order kind; move deterministic steps to code (no route).
2. Define logical routes and qualify at least two model routes per logical route where risk allows.
3. Route transformation work to small or local routes with deterministic verification; reserve frontier for reasoning steps and Critical-tier verification.
4. Make fallback chains qualification-filtered: an unqualified route is not a fallback, it is an incident.
5. Declare degraded behavior per route: pause, narrow tier, or continue on a qualified alternative.

## How Mission Control prevents it

Model routes are catalog entries with `tier: FAST|BALANCED|POWERFUL`, per-route qualification scope, and `availability: HEALTHY|DEGRADED|RATE_LIMITED|UNAVAILABLE` (`convex/schema.ts:1763`, Available). Routing eligibility requires `modelAvailable` (`HEALTHY` or `DEGRADED`) and `modelRouteQualifiedFor` the Work Order's workload and risk class (`convex/lib/executionRouting.ts:509-524`), so a fallback route that is not qualified is not eligible — "Neither the router nor the profile can substitute another profile, model route, harness, runtime artifact, backend, or adapter" (`docs/architecture/execution-routing-v1.md`). Policies carry `fallbackChain` and `killSwitch`; incident command can `QUARANTINE_MODEL_ROUTE` (`convex/lib/factoryIncident.ts:25`). Deterministic operation is a first-class Factory Version mode (`isolated-container`, `inference: DENIED`) so steps that need no model can run without one. Workflow steps of kind `DETERMINISTIC` exist alongside `AGENT` steps.

Limitation: Mission Control has few qualified routes in its retained evidence, so right-sizing across a ladder is demonstrated structurally (tiers, scopes, eligibility) rather than operationally across many routes. Logical route naming is FDLC's addition.

## Detection

- One model route bound to every logical route or every agent in a Factory Version.
- Attempts on transformation-class Work Orders whose route tier is `POWERFUL`.
- Fallback chain entries without `EVIDENCE_QUALIFIED` status for the workload class.
- Attempts executed on a route during a window where that route's `qualificationStatus` was unqualified.
- Inference spend on steps that have deterministic equivalents (formatters, codemods, digests).

## Related

- Fixing patterns: [model-routing](/patterns/model-routing) · [degraded-mode](/patterns/degraded-mode) · [fail-closed-qualification](/patterns/fail-closed-qualification)
- Sibling anti-patterns: [cheapest-model-everywhere](/anti-patterns/cheapest-model-everywhere) · [model-lock-in](/anti-patterns/model-lock-in) · [context-dumping](/anti-patterns/context-dumping)
- [Top 10 F05 Unqualified Composition](/anti-patterns/top-10) · [/architecture/economics](/architecture/economics) · Design principles 9, 10
