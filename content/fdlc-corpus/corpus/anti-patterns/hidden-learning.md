---
title: Hidden Learning
description: The factory rewrites its own prompts, memory, weights, or routing in production from model confidence, with no version, no evaluation, and no gate.
path: /anti-patterns/hidden-learning
audience: [architect, platform, security, leader, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/governed-learning, /patterns/immutable-factory-version, /patterns/fail-closed-qualification, /patterns/context-package, /anti-patterns/mutable-production-factory, /anti-patterns/invisible-context, /architecture/learning]
diagrams: [D21]
mc_refs: [convex/lib/factoryLearning.ts, convex/schema.ts, docs/architecture/factory-learning-continuous-improvement.md, docs/decisions/factory-self-improvement-governance.md]
---

# Hidden Learning

**Also known as:** Auto-Learning Directly Into Production · Self-modifying factory · "It gets smarter every run"

**Severity:** Critical

## Symptoms

- After each run the agent appends "lessons" to a file that every future run reads.
- An optimizer adjusts routing weights, prompt variants, or thresholds nightly based on success signals nobody reviewed.
- Prompts contain auto-generated sections with no author.
- The factory's behavior this week cannot be reproduced from any versioned artifact.
- "Improvement" is measured by the model's own scoring of its outputs.

## Why it fails

Learning that changes production behavior is a change to the factory. Every other change to the factory goes through Assemble → Qualify → Deploy with a version, evidence, and a Decision. Hidden learning bypasses all of it, and it bypasses it continuously. The signals it learns from are often the least trustworthy ones (self-reported success, model confidence) rather than verified outcomes. And because the learning subsystem reads everything, giving it write authority over any control makes it the highest-privilege component in the factory — one that a poisoned signal can steer.

Scenario: a factory's memory notes "reviewers rejected shim removal 3 times; keep shims". A later Work Order in a different repository keeps a shim that breaks the v4 SDK's retry semantics. Verification catches it; the memory now records "verifier rejected shim retention", and the next run flips back. The factory oscillates between two behaviors, neither versioned, both learned from three data points, with no human ever having seen the rule.

## How it shows up in the wild

- "Self-improving agent" features that write to their own instruction files.
- Reinforcement-style prompt optimizers wired to production traffic.
- Memory systems where every session's summary is injected into every subsequent session.
- Auto-promotion of A/B "winners" without sample-size or significance discipline.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Unversioned, unapproved behavior change; no Improvement Candidate, no Qualification Record |
| Security | The learning path is a write channel into controls; signal poisoning becomes control poisoning |
| Cost | Oscillation and regression; optimizer token spend; rework |
| Reliability | Non-reproducible behavior; regressions appear without any deploy |

## The fix

Patterns: [governed-learning](/patterns/governed-learning), [immutable-factory-version](/patterns/immutable-factory-version), [fail-closed-qualification](/patterns/fail-closed-qualification), [context-package](/patterns/context-package) for the memory boundary.

Minimal migration:

1. Cut every write path from the learning subsystem to prompts, routing, policy, and memory that Attempts read as instructions.
2. Turn observations into Learning Signals bound to their source records, typed `acceptanceAuthority: false`.
3. Aggregate to Improvement Candidates with expected effect and regression cases; review them.
4. Realize accepted candidates as candidate Factory Versions; qualify; promote by Decision.
5. Keep memory as advisory context in the Context Package, versioned and reviewable, never as instructions.

## How Mission Control prevents it

The learning loop is proposal-only: `learningSignals` and `learningSignalClusters` feed `metaLoopSuggestions` (Improvement Candidates), and `recommendImprovementPromotion` always returns `statisticallySignificant: false` and `autoPromote: false` (`convex/lib/factoryLearning.ts:567-633`, Available — Qualified, advisory). `LearningSignalInput.acceptanceAuthority` is typed as the literal `false`. Promotion goes through a submitted Mission Plan and separate human Plan approval; "The loop may not self-authorize, mutate governance, bypass verification, or become a token sink"; "Any evidence of acceptance, verification, routing, Factory Version, or repository mutation from the learning subsystem is a release blocker" (`docs/architecture/factory-learning-continuous-improvement.md`; `docs/decisions/factory-self-improvement-governance.md`). Routing experiments admit only two frozen, production-qualified variants and grant no authority; `inferenceRouteComparisons.automaticPromotionAuthorized: v.literal(false)`. Factory Memory is `acceptanceAuthority: false` and phase-gated (default off). V1 learning makes no LLM calls.

Limitation: the automatic assembly of a new Factory Version from an accepted Improvement Candidate is Planned; today the improvement re-enters as ordinary delivery work, which is governed but manual.

## Detection

- Files or records that Attempts read as instructions and that were written by a previous Attempt or a learning job.
- Routing policy or threshold changes with no Decision, no policy version increment, or an automated actor.
- Prompt digests changing between Attempts of the same Factory Version.
- Experiments promoted with sample sizes below the declared minimum or with significance claimed by the tool.
- Learning-service identity holding permissions on acceptance, verification, routing, versions, or repositories.

## Related

- Fixing patterns: [governed-learning](/patterns/governed-learning) · [immutable-factory-version](/patterns/immutable-factory-version) · [fail-closed-qualification](/patterns/fail-closed-qualification)
- Sibling anti-patterns: [mutable-production-factory](/anti-patterns/mutable-production-factory) · [invisible-context](/anti-patterns/invisible-context) · [no-outcome-metrics](/anti-patterns/no-outcome-metrics)
- [Top 10 F04 Mutable Production Factory](/anti-patterns/top-10) · [/architecture/learning](/architecture/learning) · Design principle 6; Manifesto principle 9
