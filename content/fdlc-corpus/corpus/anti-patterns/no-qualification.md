---
title: No Qualification
description: A demo or a passing smoke test is the qualification; there is no scope, no evidence bundle, no expiry, and no revocation, so anything registered is admitted for everything.
path: /anti-patterns/no-qualification
audience: [architect, platform, security, leader, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/fail-closed-qualification, /patterns/immutable-factory-version, /patterns/capability-based-routing, /patterns/progressive-autonomy, /anti-patterns/no-versioning, /anti-patterns/frontier-model-everywhere, /architecture/factory-versioning, /framework/factory-lifecycle]
diagrams: [D13]
mc_refs: [convex/factory/executionProfiles.ts, convex/factory/configuration.ts, convex/schema.ts, docs/product/software-factory-capability-maturity.md]
---

# No Qualification

**Also known as:** "It worked in the demo" · Registration equals admission · Qualified for everything

**Severity:** High

## Symptoms

- A new model, tool, sandbox provider, or factory configuration is usable in production the moment it is configured.
- There is no record of which workloads, environments, risk tiers, or autonomy levels a component was tested for.
- Qualification "evidence" is a Slack thread or a green pipeline from months ago.
- Nothing ever un-admits a component; deprecations are manual and rare.
- Readiness is a checkbox an operator sets.

## Why it fails

Design principle 7: autonomy should increase only as verification confidence increases. Confidence is scoped: a composition that performs well on low-risk documentation changes in staging says nothing about high-risk payment changes in production. Without a Qualification Record with a scope, the factory has one implicit scope — everything — and one implicit expiry — never. Unknown is treated as pass. And because readiness is set rather than derived, it does not respond when a dependency's qualification lapses.

Scenario: a factory is "validated" by running three curated Work Orders on a demo repository. It is then routed Critical-risk migrations on a production monolith. It has never been tested for recovery under lease loss, for hallucinated package names, or for credential handling in a remote sandbox. The first lease loss produces a duplicate PR; the second Work Order installs a typosquatted package the qualification suite would have caught.

## How it shows up in the wild

- Vendor agent platforms where "enable model X" is a dropdown with no evaluation step.
- Internal factories promoted after a successful pilot with no written scope.
- MCP servers added to a config file and immediately callable in production.
- "Readiness" dashboards with manual toggles.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No Qualification Record; routing cannot filter by scope; autonomy cannot be earned per scope |
| Security | Isolation, credential handling, and unsupported-action behavior never tested |
| Cost | Failures discovered in production; escalations and rework |
| Reliability | Components fail on workload classes they were never tried on; no expiry means silent decay |

## The fix

Patterns: [fail-closed-qualification](/patterns/fail-closed-qualification), [immutable-factory-version](/patterns/immutable-factory-version), [capability-based-routing](/patterns/capability-based-routing), [progressive-autonomy](/patterns/progressive-autonomy).

Minimal migration:

1. Separate registration (disabled) from qualification (evidence + scope + expiry) from admission (derived) from activation (pointer).
2. Write the Qualification Standard: functional, regression, security, isolation, policy, tool permissions, credential handling, unsupported actions, route compatibility, cost, latency, reliability, determinism, evidence completeness, recovery, failure behavior, observability.
3. Run a qualification suite per candidate version on a synthetic cohort per workload class; record evidence digests; approve scope by a named human.
4. Make readiness derived with expiring checks; route only within scope; fail closed on unknown.
5. Revoke terminally; re-register as a new version.

## How Mission Control prevents it

Execution Profiles register `DISABLED` and become eligible only through `qualify`, which requires the exact profile digest, an evidence reference and digest, `workloadClasses[]`, `riskClasses[]`, and `validUntil`, and refuses scopes beyond the route's and sandbox's admitted scope (`convex/factory/executionProfiles.ts:280-394`, Available — Implemented, gated). Revocation is terminal ("register a new version", line 311). Model routes and tool versions carry `qualificationStatus: UNQUALIFIED|EVIDENCE_QUALIFIED` with expiry (`convex/schema.ts:1763, 1336`). Factory Version readiness derives twenty checks with `VERIFIED|MISSING|STALE|WAIVED|NOT_APPLICABLE` and an expiry; "Readiness is derived ... not an operator-set status"; activation requires a current PASS for the exact digest (`convex/factory/configuration.ts:1346-1495`, Available). The capability ledger refuses to label a family Available "merely because current main contains code" (`docs/product/software-factory-capability-maturity.md`).

Limitation: behavioral qualification of a whole Factory Version against a workload cohort is Planned; Mission Control's readiness proves admissibility, and workload-scoped qualification exists for routes and profiles plus out-of-band evidence packages. The eval control plane is `releaseBlocking: false`.

## Detection

- Components with `admissionStatus` enabled and no qualification evidence digest, scope, or expiry.
- Work Orders routed to versions whose qualification scope excludes their workload class, environment, or risk tier.
- Readiness records set by a human actor without an assessment, or with expired checks.
- Absence of a qualification suite run between version creation and activation.
- Incidents whose root cause is a failure class the Qualification Standard names (lease loss, hallucinated package, credential leak).

## Related

- Fixing patterns: [fail-closed-qualification](/patterns/fail-closed-qualification) · [immutable-factory-version](/patterns/immutable-factory-version) · [capability-based-routing](/patterns/capability-based-routing)
- Sibling anti-patterns: [no-versioning](/anti-patterns/no-versioning) · [frontier-model-everywhere](/anti-patterns/frontier-model-everywhere) · [human-approval-everywhere](/anti-patterns/human-approval-everywhere)
- [Top 10 F05 Unqualified Composition](/anti-patterns/top-10) · [/framework/factory-lifecycle](/framework/factory-lifecycle) (stage 5 Qualify) · Glossary: Qualification Record
