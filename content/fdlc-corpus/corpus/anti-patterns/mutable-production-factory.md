---
title: Mutable Production Factory
description: Prompts, model choices, tool lists, and policies are edited in place on the running factory, so behavior is unattributable, unrollbackable, and unqualified.
path: /anti-patterns/mutable-production-factory
audience: [architect, platform, security, leader, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/immutable-factory-version, /patterns/fail-closed-qualification, /patterns/governed-learning, /anti-patterns/no-versioning, /anti-patterns/hidden-learning, /anti-patterns/prompt-as-governance, /architecture/factory-versioning]
diagrams: [D11, D12]
mc_refs: [convex/schema.ts, convex/factory/configuration.ts, convex/lib/factoryConfiguration.ts]
---

# Mutable Production Factory

**Also known as:** Hot-edit the prompt · Live config · "It's just a YAML change"

**Severity:** Critical

## Symptoms

- A prompt file, model name, or tool list in the production factory can be changed by a commit, a config push, or a dashboard edit, and the next Attempt picks it up.
- Attempts record "the factory" but not which composition ran.
- "Rollback" means reverting a file and hoping.
- A tool grant widened for one incident stays widened.
- The same factory name has behaved five different ways this month.

## Why it fails

Governance needs an object to govern. If the factory's behavior is a moving target, nothing can be qualified (qualification evidence describes a composition that no longer exists), nothing can be attributed (which prompt produced this defect?), and nothing can be restored (the previous composition was overwritten). Learning becomes indistinguishable from drift. In a shared factory, one team's tweak changes every tenant's behavior at once.

Scenario: a factory engineer notices verifiers rejecting shim removals and edits the migration skill's prompt in production to "always remove shims". The next Attempt on a different repository removes a shim that was load-bearing; the verifier catches it, but three Attempts in flight were dispatched under the old prompt and two under the new one. The audit cannot say which; the Attempts recorded `factory: depmod`, not a digest. Restoring "the previous prompt" requires reading git history and guessing which commit was live.

## How it shows up in the wild

- Prompt files in a repository deployed continuously to the agent service with no version pin.
- Model names read from environment variables at runtime.
- Dashboard toggles for tools, budgets, and autonomy with no version or approval.
- "Agent configuration" tables edited in place by admins.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No Factory Version; qualification evidence describes nothing; Decisions cannot bind a composition |
| Security | Silent authority widening; a compromised config path is a compromised factory; cross-tenant blast radius |
| Cost | Regressions discovered late; retries across mixed compositions |
| Reliability | Non-reproducible behavior; no safe rollback target |

## The fix

Patterns: [immutable-factory-version](/patterns/immutable-factory-version), [fail-closed-qualification](/patterns/fail-closed-qualification), [governed-learning](/patterns/governed-learning).

Minimal migration:

1. Write down the full composition (planner, Agent Definitions with prompt digests, harness and runtime digests, skills, tools and grants, model routes, context config, sandbox image, policies, budgets) as a manifest.
2. Content-address it (SHA-256 over canonical JSON); that is `FV-<factory>-<semver>`.
3. Make activation a pointer to a version with a current readiness assessment; remove every in-place edit path.
4. Route work to the active version and freeze its digest onto every Attempt.
5. Treat every change as a new version through Qualify; keep the previous version as the restoration target.

## How Mission Control prevents it

`factoryDefinitionVersions` freezes the composition with a `configurationDigest` (`convex/schema.ts:1434`; digest in `convex/lib/factoryConfiguration.ts:79-95`, Available); "Material changes create a new version and leave the previous version auditable" (`docs/OVERVIEW.md`). Activation requires a current passing readiness assessment whose `configurationDigest` matches the exact version (`convex/factory/configuration.ts:1468-1470`), and readiness "is not an operator-set status" (Available). Attempts bind `factoryDefinitionVersionId` + `factoryConfigurationDigest`, and the claim refuses when the digest no longer matches (`convex/factory/attempts.ts:569-571`). Agent prompts and tool manifests are hashed into `agentVersions.genome` and bound to the version; readiness fails if any bound agent version is not `APPROVED` (`configuration.ts:1388-1399`). Execution Profiles, model routes, and tool versions are immutable rows with their own digests; revoked profiles "cannot be requalified; register a new version" (`executionProfiles.ts:311`).

Limitation: the digest is FNV-1a (`factory-v1-<8hex>`), which FDLC would replace with SHA-256; and `modelRoutingPolicies` are versioned policy rows rather than part of the Factory Version digest, so a routing-policy change does not itself produce a new Factory Version.

## Detection

- Attempts whose manifest lacks a Factory Version digest, or whose digest does not resolve to an immutable record.
- Prompt or config files changed in the deploy artifact between two Attempts with the same "factory" label.
- Readiness or activation records set by a human without an assessment.
- Tool grants, budgets, or model names differing across Attempts that claim the same version.
- Absence of a Decision of kind promotion preceding a behavior change.

## Related

- Fixing patterns: [immutable-factory-version](/patterns/immutable-factory-version) · [fail-closed-qualification](/patterns/fail-closed-qualification) · [governed-learning](/patterns/governed-learning)
- Sibling anti-patterns: [no-versioning](/anti-patterns/no-versioning) · [hidden-learning](/anti-patterns/hidden-learning) · [prompt-as-governance](/anti-patterns/prompt-as-governance)
- [Top 10 F04 Mutable Production Factory](/anti-patterns/top-10) · [/architecture/factory-versioning](/architecture/factory-versioning) · Glossary: Factory Version
