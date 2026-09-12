---
title: Infinite Retry Loop
description: Failures trigger retries with no new evidence and no reconciliation of external effects, so effects duplicate, budgets burn, and history is rewritten.
path: /anti-patterns/infinite-retry-loop
audience: [architect, platform, factory-engineer, leader]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/recovery-checkpoint, /patterns/degraded-mode, /patterns/lease-based-worker, /patterns/model-routing, /anti-patterns/hidden-agent-state, /anti-patterns/frontier-model-everywhere, /architecture/execution-vocabulary]
diagrams: [D31]
mc_refs: [convex/lib/executionRecovery.ts, convex/schema.ts, docs/software-factory/worker-runtime-operations.md, docs/product/mission-control-north-star.md]
---

# Infinite Retry Loop

**Also known as:** Retry until green · The agent that never gives up · Retry storm

**Severity:** High

## Symptoms

- On any failure the same Attempt is re-run, sometimes as the same Attempt id.
- Retries do not check whether the previous try opened a PR, published a package, or ran a migration.
- Retry counts are large or unbounded; the "fix" for flakiness is more retries.
- A provider outage produces hundreds of identical failed Attempts.
- Cost per Work Order is dominated by failed tries nobody planned.

## Why it fails

A retry is only safe when two things are known: that the previous try's external effects are accounted for, and that something has changed so the next try can succeed. Blind retry knows neither. Retrying an unknown external effect duplicates it (two PRs, two publishes). Retrying the same inputs against the same failure repeats it while spending budget. Retrying under the same Attempt identity destroys the record of what happened. Under a dependency outage, blind retry becomes a storm that delays recovery.

Scenario: an Attempt pushes a branch and opens a PR, then crashes before recording the PR number. The orchestrator retries. The new try pushes to the same branch (force), opens a second PR, and crashes at the same step for the same reason (the provider is rate-limiting). Four hours and eleven PRs later, someone notices. Each PR has a slightly different candidate; none is verified; the branch history is unreadable.

## How it shows up in the wild

- Workflow engines with `retries: 10` on agent steps and no idempotency.
- Agent loops that catch exceptions and "try a different approach" indefinitely.
- Queue consumers that re-enqueue failed jobs without a dead-letter path.
- Escalation ladders triggered by the agent's own frustration rather than verification evidence.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Attempt history rewritten; no linked retry lineage; spend unattributable |
| Security | Duplicate external effects may include duplicate credential use or duplicate publication |
| Cost | Failed spend unbounded; frontier-model escalations multiply |
| Reliability | Retry storms extend outages; duplicated side effects require manual cleanup |

## The fix

Patterns: [recovery-checkpoint](/patterns/recovery-checkpoint) (reconcile before retry), [degraded-mode](/patterns/degraded-mode), [lease-based-worker](/patterns/lease-based-worker), [model-routing](/patterns/model-routing) for evidence-triggered escalation.

Minimal migration:

1. Bound retries per Work Order (`maxAttempts`) and per Factory Version; exhausting them yields a human decision, not more retries.
2. Before any retry, reconcile: workspace, branch head, PR existence, sandbox absence, credential revocation; `UNKNOWN` never maps to retry.
3. Make every retry a new Attempt linked to the prior one with a reason; never re-run an id.
4. Require new evidence for a retry of the same failure: a changed input, route, or context; otherwise stop.
5. Under dependency degradation, pause dispatch and quarantine rather than retry.

## How Mission Control prevents it

Factory Versions cap `budget.maxAttempts` (≤ 3 in V1; `convex/lib/factoryConfiguration.ts:116-120`), and `buildExecutionRecoverySummary` returns `EXHAUSTED` with "an operator must revise the plan or stop the WorkOrder" when the budget is spent (`convex/lib/executionRecovery.ts:81-83`, Available). Every retry is a new Attempt with `executionRetryOfClaimId` and `executionRetryReason`; "Retries, corrections, and recovery create new Attempts rather than rewriting history" (`docs/FACTORY_VOCABULARY.md`). Reconciliation precedes retry: "Inability to prove absence is not permission to retry" (`docs/software-factory/operating-contract-evidence-map.md`); cleanup requires proofs and "ambiguity fails closed to `PRESERVED`". Doctrine: "Repeating the same failed action without new evidence is prohibited" (`docs/product/mission-control-north-star.md`). Repeated stale-lease loss triggers `executionQuarantine` (`operatorControls.staleRecoveryLimit`). Publication is idempotent on branch (`findOrCreatePullRequest`) and permit-gated, so a retried publication cannot open a second PR. Evidence: PR #62 (cancel → two failed retries → fourth Attempt success, restart without duplicate PR).

Limitation: "no new evidence" is doctrine rather than an enforced predicate; Mission Control bounds and links retries but does not compute whether inputs changed between tries.

## Detection

- Attempts on one Work Order exceeding the configured budget, or multiple `RUNNING` records with the same Attempt id.
- Retry lineage without a recorded reason or with identical manifest, context hash, and route across tries.
- Duplicate external artifacts (PRs, packages, tickets) per Work Order.
- Burst of `FAILED` Attempts correlated with a provider availability change and no dispatch pause.
- Spend on failed Attempts exceeding spend on completed ones for a factory.

## Related

- Fixing patterns: [recovery-checkpoint](/patterns/recovery-checkpoint) · [degraded-mode](/patterns/degraded-mode) · [lease-based-worker](/patterns/lease-based-worker)
- Sibling anti-patterns: [hidden-agent-state](/anti-patterns/hidden-agent-state) · [frontier-model-everywhere](/anti-patterns/frontier-model-everywhere) · [no-outcome-metrics](/anti-patterns/no-outcome-metrics)
- [Top 10 F08 Runaway Retry and Hidden State](/anti-patterns/top-10) · [/architecture/execution-vocabulary](/architecture/execution-vocabulary) · Glossary: Attempt, Runtime
