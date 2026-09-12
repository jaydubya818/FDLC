---
title: Model Lock-In
description: The factory is a set of prompts tuned to one model and one provider, so a deprecation, price change, or outage becomes a rewrite.
path: /anti-patterns/model-lock-in
audience: [architect, platform, leader, factory-engineer]
level: [practitioner]
status: draft
related: [/anti-patterns, /patterns/model-routing, /patterns/immutable-factory-version, /patterns/fail-closed-qualification, /patterns/degraded-mode, /anti-patterns/frontier-model-everywhere, /anti-patterns/cheapest-model-everywhere, /architecture/economics]
diagrams: [D10]
mc_refs: [convex/schema.ts, convex/lib/modelRouteAdmission.ts, docs/decisions/model-route-runtime-identity-separation.md]
---

# Model Lock-In

**Also known as:** One-model monoculture · Hard-coded provider · "Our agent is built on model X"

**Severity:** Medium

## Symptoms

- Model names appear as string literals in agent code, prompts, or environment variables.
- Prompts contain provider-specific formatting, tool-call conventions, or workarounds.
- There is no notion of a logical route; every agent names its model directly.
- Switching models means re-running every eval by hand and editing every agent.
- Verification uses the same model as production because that is the only one wired in.

## Why it fails

Design principle 9: models are replaceable execution resources; a factory is more durable than the model operating inside it. A factory whose behavior is bound to one model identity inherits that model's deprecation schedule, pricing, rate limits, and regional availability as its own. Without a route indirection, the factory cannot be qualified for a model change as a controlled event; it can only be rewritten. And the factory loses the safety property that a verifier can be a *different* family from the producer.

Scenario: the provider announces the model the factory depends on will be retired in 90 days. Forty prompts reference it. The team swaps the name for the successor and ships. First-pass verification drops by a third because the successor formats tool calls differently and the prompts' workarounds now cause errors. There was no qualification scope to check, no route to roll back to, and no evidence window to compare.

## How it shows up in the wild

- Agent SDK configurations with `model: "<vendor-model-id>"` per agent.
- Prompt libraries with vendor-specific sections and no abstraction.
- Feature flags that toggle "the model" globally.
- Vendor-bundled agent platforms where model choice is not a first-class configuration.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Model changes are unqualified rewrites; no Decision, no scope |
| Security | Single-provider dependency for verification; no independent-family verifier |
| Cost | No pricing power; no right-sizing across task classes |
| Reliability | Provider outage is factory outage; deprecations force emergency changes |

## The fix

Patterns: [model-routing](/patterns/model-routing), [immutable-factory-version](/patterns/immutable-factory-version), [fail-closed-qualification](/patterns/fail-closed-qualification), [degraded-mode](/patterns/degraded-mode).

Minimal migration:

1. Name logical routes (`architecture-reasoning`, `implementation-workhorse`, `transformation-small`, `verification-independent`) and make agents reference routes, not models.
2. Register model routes in a catalog with digest, capabilities, qualification scope, cost policy, and availability.
3. Bind logical route → model route in the Factory Version; a change is a new version.
4. Qualify each route per workload class and risk tier; keep evaluation datasets so a successor route can be compared.
5. Declare a prequalified fallback chain and a kill switch per route.

## How Mission Control prevents it

`modelCatalog` gives each route an exact identity (`providerRoute`, `routeSnapshot`, `routeDigest` under `factory-model-route/v2`), a `tier`, `capabilities[]`, `riskApproved`, `availability`, `qualificationStatus`, `admissionStatus`, and `costPolicyDigest` (`convex/schema.ts:1763`, Available). The ADR `docs/decisions/model-route-runtime-identity-separation.md` separates model route identity from harness, runtime artifact, and execution backend, so a route can change without changing the runtime. Factory Versions bind `modelCatalogId`, `modelRouteDigest`, and `modelQualificationDigest`; the Attempt claim verifies the frozen manifest's route against the version (`convex/factory/attempts.ts:592-642`). `modelRoutingPolicies` carry `fallbackChain` and `killSwitch`. Harness manifests declare `models.supported` per provider (`harnessManifests.ts`), and routing checks `harnessModelSupported`.

Limitation: Mission Control does not name logical routes; agents bind through policies and lanes. Qualified routes in the retained evidence are few (one OpenRouter route, one Bedrock route, one local Ollama route pinned by digest), so route portability is demonstrated in structure more than in breadth.

## Detection

- Model identifiers as literals in agent definitions, prompts, or environment.
- Factory Versions with no route abstraction (model bound directly to agent).
- No evaluation dataset or qualification scope for the model in use.
- Verifier and producer sharing provider and model family across all risk tiers.
- Incident history containing "model deprecated" as a root cause.

## Related

- Fixing patterns: [model-routing](/patterns/model-routing) · [immutable-factory-version](/patterns/immutable-factory-version) · [fail-closed-qualification](/patterns/fail-closed-qualification)
- Sibling anti-patterns: [frontier-model-everywhere](/anti-patterns/frontier-model-everywhere) · [cheapest-model-everywhere](/anti-patterns/cheapest-model-everywhere) · [mutable-production-factory](/anti-patterns/mutable-production-factory)
- [Top 10 F05 Unqualified Composition](/anti-patterns/top-10) · [/architecture/economics](/architecture/economics) · Design principle 9
