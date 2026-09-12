---
title: Human Approval Everywhere
description: Humans are asked to approve every step regardless of risk, so they stop reading, the gate becomes theater, and the factory delivers neither autonomy nor assurance.
path: /anti-patterns/human-approval-everywhere
audience: [architect, leader, platform, builder, factory-engineer]
level: [practitioner]
status: draft
related: [/anti-patterns, /patterns/progressive-autonomy, /patterns/human-authority-gate, /patterns/evidence-bound-acceptance, /patterns/independent-verifier, /anti-patterns/no-outcome-metrics, /anti-patterns/no-qualification, /architecture/authority]
diagrams: [D17]
mc_refs: [convex/schema.ts, convex/lib/executionRouting.ts, convex/workOrders.ts, docs/architecture/execution-routing-v1.md]
---

# Human Approval Everywhere

**Also known as:** Approval fatigue · Click-through governance · "Safe because a human is in the loop"

**Severity:** Medium

## Symptoms

- Every tool call, file edit, or Work Order requires a human click, at every risk tier.
- Approvers process dozens of approvals per hour; median time-to-approve is seconds.
- Approvals carry no reason and no evidence reference.
- Throughput is bounded by approver availability; agents idle waiting.
- Leadership believes the factory is safe because "a human approves everything".

## Why it fails

Manifesto principle 8: human attention belongs at consequential boundaries. Attention is finite. Spending it on low-risk, deterministically verified changes trains approvers to click without reading, which removes the assurance from exactly the High and Critical decisions that need it. The gate that approves everything approves nothing. Meanwhile, no autonomy is ever earned because no scope is ever allowed to demonstrate a clean evidence window; the factory is stuck at "human approves" forever.

Scenario: a dependency-modernization factory requires human approval for every Work Order. An approver reviews forty low-risk patch bumps in a morning, each with green independent verification. Number forty-one is a major-version SDK upgrade in the payments module, flagged `REQUIRES_HUMAN_REVIEW` by the verifier for a shim removal. It looks like the other forty. Approved in four seconds. The removed shim was load-bearing.

## How it shows up in the wild

- Agent products whose only safety feature is "confirm each action".
- Policies that require senior review on all AI-authored changes regardless of size.
- Approval queues in chat channels with emoji reactions.
- Compliance interpretations that equate "human in the loop" with "human clicks on everything".

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Decisions without reasons or evidence; audit trails full of rubber stamps |
| Security | High-consequence approvals get the same attention as trivia; exceptions blend in |
| Cost | Human review minutes dominate cost per accepted outcome; throughput capped |
| Reliability | Approver availability is the bottleneck; batching leads to end-of-day dumps |

## The fix

Patterns: [progressive-autonomy](/patterns/progressive-autonomy), [human-authority-gate](/patterns/human-authority-gate), [evidence-bound-acceptance](/patterns/evidence-bound-acceptance), [independent-verifier](/patterns/independent-verifier).

Minimal migration:

1. Classify Work Orders by risk tier with server-owned minimums and reasons.
2. Let policy accept Low-tier work with deterministic verification and Medium-tier work within an explicit envelope after independent verification; require humans at High and Critical and on verifier-flagged exceptions.
3. Show approvers the exact candidate, the evidence set, and the verifier's reasons; require a reason on the Decision.
4. Measure human review minutes per accepted outcome and reopen rate per approver; use them to expand or contract autonomy per scope.
5. Route exceptions and disagreements to people; route activity feeds to dashboards.

## How Mission Control prevents it

Work Orders carry `riskLevel` and `autonomyLevel`, and approval requirements are derived by risk (`requiredApprovalTypes`; `governancePolicies` validity hours by risk; `convex/schema.ts:2422, 2595`, Available). Verification produces `REQUIRES_HUMAN_REVIEW` as a distinct verdict so human attention is routed to exceptions, and the human-review continuation pauses only those Attempts (`convex/factory/attempts.ts`, Available). Routing can move from `ADVISORY` (human selects) to `GUARDED_AUTO` when evidence thresholds are met, with a kill switch (`convex/lib/executionRouting.ts:34-44`; `docs/architecture/execution-routing-v1.md`, Experimental — disabled). Human acceptance requires named permissions and is idempotent and evidence-checked, so an approval is a Decision, not a click.

Limitation: Mission Control's primary governed V1 path is explicit human acceptance of every Work Order (`workOrders.accept` is human-only); policy-actor acceptance within an envelope for Low and Medium tiers is an FDLC requirement Mission Control does not yet implement. Mission Control's discipline here is deliberate — it prefers proven human gates before earned autonomy — but a deployment that never expands autonomy would exhibit this anti-pattern.

## Detection

- Approval Decisions with median decision time under a threshold (illustrative: < 30 s) and no reason text.
- Approvals at Low tier with deterministic verification and no exception flag.
- Human review minutes per accepted outcome flat or rising while first-pass verification rises.
- Approver reopen rate correlated with queue length.
- No scope with an autonomy level above "human approves" despite a clean evidence window.

## Related

- Fixing patterns: [progressive-autonomy](/patterns/progressive-autonomy) · [human-authority-gate](/patterns/human-authority-gate) · [evidence-bound-acceptance](/patterns/evidence-bound-acceptance)
- Sibling anti-patterns: [no-outcome-metrics](/anti-patterns/no-outcome-metrics) · [no-qualification](/anti-patterns/no-qualification) · [agent-as-authorization-system](/anti-patterns/agent-as-authorization-system) (the opposite failure)
- [Top 10 F10 Misplaced Human Judgment and Vanity Metrics](/anti-patterns/top-10) · [/architecture/authority](/architecture/authority) (HITL spectrum) · Manifesto principle 8
