# FDLC system design review and Mission Control enhancement plan

Date: 2026-09-07

## Decision

Keep FDLC's current definition, six architecture areas, factory lifecycle,
runtime lifecycle, and artifact protocol. The new material largely reinforces
existing contracts. Its value is in helping builders and operators make specific
design decisions and prove failure behavior, rather than expanding the category.

Add one practical Guide appendix, deepen two existing chapter sections, expose
the corresponding operating decisions on the architecture page, and reconcile
Mission Control's public capabilities with current evidence. Prioritize one
complete real operating loop before broader routing, fleet orchestration, or
autonomy. Mission Control runtime changes below are recommendations, not changes
implemented or authorized by this documentation task.

## Evidence and source scope

Fresh main-branch references were fetched before creating isolated branches:

| Repository | Baseline |
| --- | --- |
| FDLC | `3ec0d3d` |
| Guide | `2d16e04` |
| Mission Control | `ee870794cddb426824fc881a520ccdda028060d6` |

The supplied 282-section design material was reviewed as architectural input.
Personal narrative, organizational scale figures, implied implementation proof,
and commercial claims were not imported. Current source and retained evidence
determine implementation status; an architectural talking point cannot promote
a capability. Existing local work was preserved in all three repositories.

The original local checkouts were behind main. In particular, earlier website
copy described the entire incident lifecycle as unimplemented and conflated
routing with inference accounting. The current
[capability ledger](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/product/software-factory-capability-maturity.md)
and
[incident qualification](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/testing/evidence/factory-incident-command-production-v55/README.md)
justify narrow corrections. They do not establish complete customer outcomes,
general containment, live billing, or broad production autonomy.

## Coverage decisions

| Material | Decision | Canonical content owner and change |
| --- | --- | --- |
| Builder intent, Plan governance, control versus execution | Existing; sharpen practice | Chapter 6 gains Plan admission and revision-impact guidance. Playbook adds a workload brief and evidence packet. |
| Three routing levels, reusable factories and capabilities | Already covered | Keep the enterprise delivery companion and Chapter 22. Add the distinct scheduling decision and capacity boundary. |
| Context provenance, permissions, memory and state | Existing | Link the context/skills practices. Playbook joins freshness, scoped caches, retention, and evidence access to the execution contract. |
| Leases, checkpointing, cancellation, uncertain effects | Existing; operationalize | Chapter 14 remains canonical. Playbook provides thirteen failure drills with expected behavior and retained evidence. |
| Independent verification, evidence expiration and disagreement | Existing; consolidate review | Playbook adds a criterion-level decision brief, validity conditions, and independent failure-mode checks. |
| Cost per accepted outcome and token economics | Existing; preserve precision | Retain Chapter 9 and the benchmark measurement contract. Playbook distinguishes verified, accepted, released, and observed results with explicit missing-cost semantics. |
| Factory Version, Execution Profile, canary and revocation | Existing; connect lifecycle | Playbook links qualification, activation, observation, learning, containment, and separately authorized restoration. |
| Evaluator quality, reward gaming, trust and autonomy | Existing; make actionable | Require adversarial and held-out cases, calibrated judgment, workload-specific autonomy, and demotion conditions. No second maturity scale. |
| Platform ownership, extensibility, non-engineer builders | Existing | Reuse shared intent and domain-owned correctness. Do not create a product surface per persona. |
| Multi-tenancy, noisy neighbors, regional failover, large fleets | Conditional later work | Teach the constraints; keep actual implementation dependent on measured demand and qualified isolation/recovery. |
| Build versus adopt, custom harnesses, training | Preserve restraint | Prefer existing tools and the least complex effective correction. Do not infer a requirement for a new harness, training platform, or universal agent platform. |

## Site and Guide changes prepared

**FDLC architecture:** six expandable design decisions, each with a problem,
decision, rationale, invariant, failure behavior, status, evidence, and its
relationship to the rest of FDLC. Navigation links the section to the Guide and
Mission Control priorities. It uses the current visual system and introduces no
new interactive state or runtime service.

**Mission Control page:** four clearly proposed development priorities. The
capability list separates routing and accounting, corrects narrow incident
availability, retains experimental release/feedback, and labels wider containment
as planned. The public capability matrix retains exact evidence links and limits.

**Guide:** a Factory System Design Playbook with an immediately usable workload
worksheet, Plan admission, routing/scheduling table, execution and context
boundaries, thirteen recovery drills, evidence currentness, outcome economics,
controlled improvement, and a dependency-modernization example traced from
intent through learning. Chapters 6 and 22 own the two additions requiring
canonical prose. The Guide entry page, reference index, README, architecture
communication appendix, and changelog make the new material discoverable.

The homepage already explains the category and complete lifecycle; it needs no
additional feature marketing. Benchmarks and enterprise pages already own the
measurement and multi-factory explanations. The 44-chapter reading arc stays
intact. More detail belongs in the linked appendix, not in a longer homepage.

## Mission Control: enhance existing systems

Use the existing
[convergence program](https://github.com/jaydubya818/MissionControl/blob/ee870794cddb426824fc881a520ccdda028060d6/docs/software-factory/capability-convergence-program.md)
and its current ledger as the implementation authority. This review adds product
acceptance detail; it does not replace dependencies, reopen completed work, or
authorize live spend. Historical program entries may lag later evidence: the
current ledger and exact qualification records take precedence for status.

### First: make a complete real workload inspectable

**Problem:** a builder can see execution activity without a concise explanation
of whether the requested outcome is ready for a decision. Individual qualified
controls do not yet prove a complete real delivery and observation loop.

**Enhancement:** assemble a decision brief over existing records: approved intent
and Plan revision, WorkOrder readiness, current Attempt and checkpoint, criterion
coverage, candidate, verification, remaining liability, pending human action,
release, and observed result. Every blocker names the missing prerequisite and
responsible owner. Link directly to the durable source record.

**Reuse:** Mission/Plan, WorkOrder readiness, Tasks/Attempts, Verification Subject,
evidence, acceptance, release and diagnostic records. Follow existing pilot work
in Todo 059; do not add a parallel status database or another workflow engine.

**Proof:** a controlled real workload is reconstructable across refresh and
restart, including failed and recovered Attempts. A completed task cannot mark
the objective accepted. Missing verification or outcome data remains explicit.
Record baseline review effort, elapsed time, rework, outcome, and cost coverage.

**Owners:** Product + Platform + QA, with named workload and release owners in the
actual pilot packet.

### Next: improve Plan and recovery decisions

**Problem:** a syntactically valid Plan can still omit verification, overspend
through child tasks, or silently make earlier evidence obsolete after revision.

**Enhancement:** expose preflight checks for criterion coverage, graph validity,
scope, capability eligibility, total liability, concurrency, and verification
allowance. Show a material-revision diff and its affected downstream tasks,
artifacts, evidence, and approvals. In recovery, show the failure class, latest
durable checkpoint, uncertain side effects, changed hypothesis, and remaining
budget before the operator chooses the next permitted action.

**Reuse:** existing governed Plan and revision handling, dispatch readiness,
lease/recovery records, and inference reservations. Audit existing handlers and
tests first; implement only missing invariants or projections. A UI check alone
cannot authorize dispatch or enforce a budget.

**Proof:** reject missing criteria, cyclic dependencies, over-budget fan-out,
stale approval, stale-worker publication, and unsafe replay. Material revisions
invalidate affected eligibility without rewriting historical evidence. An
unknown external effect cannot release liability or cause a duplicate write.

**Owners:** Platform + QA; Product owns which changes require a new decision.

### Next: qualify selection and full outcome economics

**Problem:** token prices and model names do not explain why a route is permitted
or what accepted work actually costs.

**Enhancement:** show qualification by exact workload, configuration, environment,
quality floor, expiry/revocation, policy, and observed results. A route decision
shows its eligible set, rejected alternatives, selected capability, fallback,
and evidence. Keep scheduler queue/capacity reasons separate. Join existing
inference observations and settlement to workload cohorts; expose ACTUAL,
ESTIMATED, and UNKNOWN cost components and accepted/verified denominators.

**Reuse:** existing model router, capability identities, frozen Execution
Profiles, canonical Attempts, inference reservations, observations and settlement.
Continue Todo 063. Its offline accounting and durable-recovery work is already
valuable; do not build another gateway or financial ledger.

**Proof:** separately authorized real provider reconciliation and comparison of
two exact qualified routes, with complete declared accounting coverage. Include
timeouts, duplicate/late receipts, provider outage, revocation and budget
exhaustion. Qualified fallback preserves all hard constraints. Preserve unknown
charges and committed liability until authoritative reconciliation.

**Owners:** Platform + ML/AI + Product. Provider authority and approved spend are
inputs to real qualification, not something this report assumes.

### Next: join outcomes, learning, and exact version promotion

**Problem:** advisory learning can collect signals without proving a new factory
composition improves the outcome or can be restored safely.

**Enhancement:** join a release to an observation window and user success signal.
Attribute escaped defects, corrections, and incidents to the candidate,
configuration, context, routing, and verification involved. Turn an observed
failure into a regression case and an Improvement Candidate with a baseline,
evaluation, human decision, limited rollout, and restoration target.

**Reuse:** release records, advisory Factory Learning, Eval Control Plane, Factory
Versions, readiness and existing promotion boundaries. Continue Todo 064 after
its outcome/economics prerequisites. Do not make advisory signals authoritative.

**Proof:** one real observed failure leads to a reproducible regression, an
evaluated candidate composition, and separately attributable promotion and
restoration decisions. Evaluate the evaluator's false positives, missed defects,
and uncertainty. Preserve hard gates even if an aggregate score improves.

**Owners:** Product + QA + ML/AI + SRE.

### Extend containment without erasing its qualification boundary

**Current fact:** Todo 060 has completed evidence for Incident Command. Production
qualification covers pause and separately authorized restore of dispatch for
one exact repository using a synthetic qualification incident. The website's
older claim that the lifecycle is absent is incorrect.

**Enhancement:** qualify additional controls and targets only as required by the
pilot: a Factory Version, route, skill/tool version, profile, or repository.
Maintain separate requested, issued, acknowledged, and independently observed
states. Explicitly decide what happens to active work; stopping new admission
does not terminate every running worker or undo external effects.

**Proof:** the selected control actually denies the selected operation, an
independent observer confirms the effect, unaffected scopes behave as intended,
and restoration requires current separate authority. Record a real incident
when one occurs; do not relabel a synthetic drill as customer evidence.

**Owners:** SRE + Security + Platform. Reuse Incident Command, its executor and
independent observer. No second incident subsystem.

### Later: scale only after the loop works

Add fair-share scheduling, bounded fan-out/join, multi-repository coordination,
and broader tenant operation when the pilot supplies a concrete requirement.
Reuse shared control-plane services and qualify domain-specific correctness at
both local and integration boundaries. Parallel task count is not a reason to
create new factories.

Prove parent/child authority and budget conservation, noisy-neighbor behavior,
cross-scope data denial through retrieval/caches/evidence/exports, cancellation,
upstream-artifact invalidation, partial success and recovery under load. Name
service and outcome objectives before choosing sharding or regional topology.
Enterprise infrastructure scale remains unproven until those tests reflect the
actual workload and deployment.

## Required operator states

| Surface | States and next action |
| --- | --- |
| Plan review | Draft, checks running, incomplete, rejected with criterion, approved exact revision, superseded; show what must change and who decides. |
| Readiness and queue | Evaluating, ready, waiting for capacity, blocked by authority/budget/qualification, expired; show the authoritative reason. |
| Attempt and recovery | Running, cancelled, timed out, uncertain external effect, recoverable, terminal failure; preserve effect and lease evidence. |
| Verification | Pending, incomplete, failed, stale, disputed, satisfied; open the exact criterion and subject. |
| Outcome and economics | Awaiting observation, observed success/failure, missing signal; measured, estimated or unknown components with declared coverage. |
| Incident and improvement | Action requested, acknowledged, effect observed, restoration authorized; proposal, evaluated candidate, decision, activated version, rollback. |

These are presentation requirements over canonical states and records, not a
proposal to add these labels wholesale to backend enums. Loading errors must
not display an earlier result as current authority. Empty states explain the
missing prerequisite; action failures preserve the record and offer only a
permitted retry or reconciliation. Human and agent/API surfaces must consume
the same authorization and currentness checks.

## Release boundary and tradeoffs

The changes are isolated in `codex/system-design-playbook` in FDLC and Guide.
They alter content and existing presentation only. No Mission Control runtime,
schema, provider call, credential, activation, or production authority changes.

The main tradeoff is added depth versus discoverability. A single practical
appendix and expandable architecture sections keep the homepage and core chapter
sequence focused. Exact status caveats make the copy less sweeping but more
useful to a team deciding what it can actually run.

The site links to a new Guide route. Release the Guide route first, verify its
canonical path and search entry, then publish the FDLC changes. Both repositories
retain the existing main-branch deployment guards. Production remains a separate
authorized release under [the source/release policy](./FDLC_SOURCE_RELEASE_POLICY.md).
Do not publish all pre-existing local changes or use a hosting migration to
deliver this editorial update. A documentation release does not qualify any of
the proposed Mission Control runtime enhancements.

## Validation of the prepared changes

- FDLC: 32 unit tests and 22 rendered-page tests passed; ESLint, TypeScript
  (including the existing Fab package check), Vinext build, native Next Webpack
  build, Microfrontends configuration guard, and compiled design-system check
  passed.
- Guide: 83 tests passed, including the full content crawl, navigation, heading
  anchors, search, and public-content exclusions. Generation produced 70
  documents while retaining 44 main chapters. Local links in 73 Markdown files,
  ESLint, TypeScript, Vinext build, native local Next Webpack build, and compiled
  CSS verification passed.
- The Guide editorial report retains one inherited, non-rendered frontmatter
  classification warning in Chapter 43. No new excluded term was introduced;
  the public-route exclusion test passes across all generated documents.
- A focused rendered-source check confirmed the new architecture and Mission
  Control sections, their shared Guide target, and the absence of the excluded
  source identity. The new Guide document is included in the generated search
  and route corpus. No new diagrams, dependencies, or application services were
  introduced.
- The default FDLC Turbopack build was blocked twice by the local environment's
  subprocess-port restriction, including after requesting broader execution
  permission. The repository's supported Next Webpack path passed without
  changing build configuration. The standard deployment entrypoint still needs
  verification in normal CI before a Production release.
- The Guide deployment entrypoint correctly refuses a non-Vercel environment;
  validation used its documented native-local build mode. Hosted/composed-domain
  release checks and visual browser QA are not claimed by these local checks.
- Generated Next environment-file changes were removed from the patch. Existing
  local work, source/release guards, canonical routing and hosting configuration
  are preserved. No source was pushed, merged, or deployed by this task.
