# FDLC production reliability review

Date: 2026-09-07

## Decision

Preserve FDLC's six architecture areas and lifecycle. The supplied material after
the compensation section and the additional production-operations material
largely reinforce existing Guide chapters on durable execution, observability,
resilience, delivery, security, and learning. The missing product value is a
concise operating playbook that joins those chapters at incident time.

## Public changes

- Add five production operating contracts to the Architecture page: contain and
  preserve, reconcile before repeating, declared degraded mode, exact known-good
  restoration, and independently verified closure.
- Add a Guide appendix with a saga contract, partial dependency-graph recovery,
  blast-radius query, incident record, response vocabulary, degraded-mode matrix,
  known-good definition, closure packet, and ten representative drill families.
- Deepen Chapter 14 at the saga and partial-failure boundary and Chapter 36 at the
  incident procedure boundary. Keep their existing ownership intact.
- Add a direct reliability entry point on the Guide home.
- Add Mission Control incident-operating requirements beneath the existing
  development priorities without reordering them or changing capability status.

## Coverage decisions

| Material reviewed | Canonical owner | Decision |
| --- | --- | --- |
| Saga, compensation, partial dependency-graph failure, orphaned work, reconciliation | Guide Chapter 14 | Add the missing saga contract and move the operational packet to the new appendix. |
| State stores, recovery, failover, regional design, RTO/RPO | Guide Chapter 36 | Already covered; link the practical incident and restoration packet. |
| Data boundaries, minimization, caches, context, memory, deletion | Guide Chapters 19, 20, and 33 | Existing ownership is sufficient. Do not create another data architecture. |
| Holdouts, baselines, regression budgets, canaries, restoration, governed learning | Guide Chapters 29, 30, and 40 | Existing qualification and promotion model remains canonical. |
| Capability lifecycle, authority, credentials, tool gateways, provenance, supply chain | Guide Chapters 7, 11, 12, 18, and 33 | Existing contracts remain; incident response uses their exact version and dependency records. |
| Routing, model and agent selection, abstention, escalation | Guide Chapters 21–23 | Existing eligibility-first routing and escalation ladder remain canonical. |
| Acceptance, evaluator quality, trajectory and outcome evidence | Guide Chapters 27–31 | Existing proof model remains; incident escapes become protected evaluation cases. |
| Repository readiness, enterprise retrieval, platform adoption, operating metrics | Guide Chapters 10, 34, 38, and 43 | Existing guidance remains; no new score or product surface is needed. |
| Production failures, incident command, degraded modes, communications, game days, closure | Guide Chapter 36 plus new appendix | Consolidate into one copyable operating playbook and representative drill set. |

The source set includes many useful prompts, but its repeated answers reduce to
these existing contracts. Importing the prompt catalog would increase reading
cost without improving a builder's or operator's next decision.

## Mission Control implementation boundary

Reuse current Factory Version, Execution Profile, WorkOrder, Task, Attempt,
Evidence, decision, release, outcome, and incident-control records. Add an impact
projection and durable incident timeline rather than another authoritative
system. Expand the qualified pause and restoration path one subject and control
at a time. Require separate authority and observed enforcement for containment
and restoration.

No public copy claims broad automated response, cross-repository containment,
disaster recovery, saga compensation, or autonomous restoration is available.

## Vocabulary reconciliation

The additional vocabulary maps directly to the existing six architecture areas,
the cross-cutting control and context planes, and adoption surrounding the
factory. The Guide already holds the forty-concept architecture map and almost
all supporting terms. Add canonical glossary entries for the remaining concept
and alias gaps, then link the FDLC Architecture overview to that map and glossary.
Do not create a seventh architecture area or another competing taxonomy.

## Rejected additions

- No second lifecycle or architecture stack.
- No catalog of hundreds of interview questions.
- No generic product or vendor comparison.
- No new top-level maturity scale.
- No source organization, internal platform label, or personal attribution.
- No implementation claim derived from study material.
