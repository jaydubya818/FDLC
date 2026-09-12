---
title: Decision trees
description: Five FDLC decision trees — new factory or new Factory Version, risk tier and autonomy, which routing level decides, evidence currentness and sufficiency, retry or recover or reconcile.
path: /diagrams/decision-trees
audience: [architect, platform, factory-engineer, builder, security]
level: practitioner
status: draft
related: [/diagrams, /architecture/factory-versioning, /architecture/authority, /architecture/routing, /architecture/evidence, /architecture/verification, /specification/v1/attempt, /patterns/candidate-currentness, /patterns/recovery-checkpoint]
diagrams: [D10, D11, D12, D13, D14, D17, D31]
mc_refs: [convex/lib/executionRouting.ts, packages/workflow-engine/src/verificationIndependence.ts, packages/workflow-engine/src/verificationCurrentness.ts, convex/workflowRuns.ts]
---

# Decision trees

## What is it

Five decisions that recur on every factory, each drawn as a tree with the canon colour semantics: blue for questions about intent, slate for control-plane decisions, amber for execution, green for trust outcomes, violet for learning, and a red outline where a human must decide. Each tree ends in a named artifact or state from the canon, never in "it depends".

Read a tree top-down. The first question that answers *yes* decides; later questions are not consulted. Where a tree fails closed, the closed branch is drawn first.

---

## (a) Do you need a new factory or a new Factory Version?

The creation test (canon §6.2): create a separate factory only when outcome semantics, ownership, qualification, governance, authority, or lifecycle materially differ. Everything else is a new Factory Version, a new Qualification Record, or not a factory change at all.

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 520}}}%%
%% Decision tree (a) — new factory or new Factory Version? (creation test, D11 / D12)
flowchart TB
  S["A change to how work is produced is proposed"] --> Q0{"Is it a per-Work-Order parameter?<br/>scope · change budget · negative constraints · risk class of one job"}
  Q0 -- "yes" --> WO["Not a factory change.<br/>Revise the Plan / Work Order (new revision, new plan-approval Decision)."]
  Q0 -- "no" --> Q1{"Do the outcome semantics differ?<br/>what counts as done, accepted, or released"}
  Q1 -- "yes" --> NF["Create a separate factory<br/>Discover → Define → Design → Assemble → Qualify → Deploy"]
  Q1 -- "no" --> Q2{"Does ownership or accountability differ?<br/>different Factory Owner · Policy Owner · tenant"}
  Q2 -- "yes" --> NF
  Q2 -- "no" --> Q3{"Does governance or authority differ?<br/>approval policy · risk tier ceiling · credential class · tenant boundary"}
  Q3 -- "yes" --> NF
  Q3 -- "no" --> Q4{"Does the lifecycle differ?<br/>cadence · retirement · evolution owned by another team"}
  Q4 -- "yes" --> NF
  Q4 -- "no" --> Q5{"Would one Qualification Record still cover both?<br/>same workload class × environment × risk tier × autonomy"}
  Q5 -- "no — scope is materially different" --> NF
  Q5 -- "yes" --> Q6{"Does the composition change?<br/>planner · agents · harness · skills · tools · model routes · context · runtime · sandbox · policies · verification contract"}
  Q6 -- "yes" --> FV["New Factory Version<br/>Assemble (new digest) → Qualify → Decision: promotion → Deploy"]
  Q6 -- "no" --> Q7{"Does only qualification scope or profile admission change?"}
  Q7 -- "yes" --> QR["New Qualification Record / Execution Profile admission<br/>same Factory Version, new scope or status"]
  Q7 -- "no" --> NONE["No factory change.<br/>If behavior still differs, the difference is unexplained: open a Learning Signal."]
  classDef intent fill:#dce8ef,stroke:#2f5f78,color:#171a18
  classDef control fill:#e4e9ec,stroke:#4a5d68,color:#171a18
  classDef execution fill:#f5e6d0,stroke:#9a4f1c,color:#171a18
  classDef trust fill:#dcefe4,stroke:#1a654b,color:#171a18
  classDef learning fill:#e9e2f4,stroke:#5c3f8f,color:#171a18
  classDef human stroke:#b3261e,stroke-width:3px
  classDef neutral fill:#faf9f5,stroke:#59605a,color:#171a18
  class S,Q0,WO intent
  class Q1,Q2,Q3,Q4,Q5,Q6,Q7 control
  class NF,FV execution
  class QR trust
  class NONE learning
  class NF human
```

**How to use it.** The first five questions are the creation test in canon order. Say *yes* to any of them and the answer is a new factory with its own Manifest, Owner, Qualification, and lifecycle. If all five are *no*, the change is inside one factory: a composition change (anything in the fourteen pinned components of D11) is a new Factory Version and must pass Qualify before a promotion Decision activates it; a change in *where* a version may run (scope, environment, profile admission) is a new Qualification Record or profile admission on the same digest. Mission Control: `factoryDefinitionVersions` (Available) and `factoryExecutionProfiles` admission states model the last two outcomes; behavioral qualification is an FDLC requirement, not yet implemented.

**What can go wrong.** Creating a factory per repository (ownership does not differ, semantics do not differ) multiplies qualification cost without adding governance. Editing an Active version "just this once" is the mutable-factory anti-pattern: the answer to Q6 is always a new digest.

---

## (b) Which risk tier and autonomy level?

Risk tier is a property of the Work Order (canon §5, §11). Autonomy is derived, never chosen: effective autonomy for any scope is the minimum of the factory's qualified autonomy, the Objective's cap, the Work Order's cap, the policy's cap, and the current trust level, and it demotes immediately on evidence regression.

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 520}}}%%
%% Decision tree (b) — risk tier and autonomy level (D17)
flowchart TB
  S["Work Order to be released from an approved Plan"] --> Q1{"Does it touch production credentials, authentication or<br/>authorization surfaces, regulated or payment data, or an<br/>irreversible action (data migration, deletion, external side effect)?"}
  Q1 -- "yes" --> CRIT["CRITICAL tier<br/>human-authorized before execution ·<br/>independent + human review ·<br/>human acceptance + release authorization"]
  Q1 -- "no" --> Q2{"Does it change a public API, schema, security-relevant code,<br/>or have a wide blast radius without instant rollback?"}
  Q2 -- "yes" --> HIGH["HIGH tier<br/>auto execute · independent verification ·<br/>human acceptance required"]
  Q2 -- "no" --> Q3{"Is it a mutating change with a bounded blast radius,<br/>rollback ready, and an independent verifier available?"}
  Q3 -- "yes" --> MED["MEDIUM tier<br/>auto execute · independent verification required ·<br/>policy accepts within envelope"]
  Q3 -- "no" --> Q4{"Is it read-only or a deterministic transformation<br/>fully covered by deterministic checks?"}
  Q4 -- "yes" --> LOW["LOW tier<br/>auto execute · auto (deterministic) verify ·<br/>policy accepts"]
  Q4 -- "no — verification is not deterministic" --> MED
  CRIT & HIGH & MED & LOW --> A0["Derive autonomy = min of the five caps"]
  A0 --> A1{"Factory Version qualified for this<br/>workload × environment × risk tier × autonomy?"}
  A1 -- "no" --> BLOCK["Ineligible: no dispatch.<br/>Qualify for the scope or route elsewhere."]
  A1 -- "yes" --> A2{"Objective cap · Work Order cap · policy cap<br/>all allow this level?"}
  A2 -- "no" --> LOWER["Effective autonomy = the lowest cap"]
  A2 -- "yes" --> A3{"Trust level from the evidence window at or above this level?<br/>no rollback · no failed hard gate · no open incident"}
  A3 -- "no" --> DEMOTE["Demoted one level (or more) until evidence recovers"]
  A3 -- "yes" --> EFF["Effective autonomy level recorded on the routing Decision"]
  LOWER --> EFF
  DEMOTE --> EFF
  classDef intent fill:#dce8ef,stroke:#2f5f78,color:#171a18
  classDef control fill:#e4e9ec,stroke:#4a5d68,color:#171a18
  classDef execution fill:#f5e6d0,stroke:#9a4f1c,color:#171a18
  classDef trust fill:#dcefe4,stroke:#1a654b,color:#171a18
  classDef learning fill:#e9e2f4,stroke:#5c3f8f,color:#171a18
  classDef human stroke:#b3261e,stroke-width:3px
  classDef neutral fill:#faf9f5,stroke:#59605a,color:#171a18
  class S intent
  class Q1,Q2,Q3,Q4,A0,A1,A2,A3 control
  class CRIT,HIGH,MED,LOW,EFF trust
  class BLOCK,LOWER,DEMOTE neutral
  class CRIT,HIGH human
```

**How to use it.** The tier questions are ordered from most to least consequential so that the first *yes* wins; a Work Order that touches production credentials is Critical even if the diff is one line. The tier fixes the execution, verification and approval rows of the canon table (§11). Autonomy is then computed, not negotiated: the factory must be qualified for the tier, every cap must allow it, and the evidence window must support it. Mission Control: risk classes on `workOrders` and the `guarded auto` routing mode are Available; policy acceptance for Low/Medium is permitted by the spec but MC's `workOrders.accept` remains human-only (canon §18.10).

**What can go wrong.** Choosing the tier from the size of the diff instead of the blast radius. Raising autonomy because a factory *has* passed before: trust is a window, not a badge, and a single failed hard gate demotes it.

---

## (c) Which routing level decides this?

Three levels, three owners, three records (canon §8). Scheduling is not routing.

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 520}}}%%
%% Decision tree (c) — which routing level decides? (D10)
flowchart TB
  S["A routing question arises"] --> Q1{"Is the question when it runs, or how much capacity it gets?"}
  Q1 -- "yes" --> SCHED["Not routing — Scheduling<br/>separate decision: capacity · fairness · leases · quotas"]
  Q1 -- "no" --> Q2{"Is the question which factories are needed,<br/>or how Work Orders depend on one another?"}
  Q2 -- "yes" --> L1["Level 1 — Objective routing<br/>Objective Planner in the control plane<br/>record: Plan (Work Graph, factory set)"]
  Q2 -- "no" --> Q3{"Is the question which immutable, qualified composition<br/>performs this bounded Work Order?"}
  Q3 -- "yes" --> E1{"Eligible set after policy · authorization ·<br/>compatibility · qualification · authority?"}
  E1 -- "empty" --> BLOCK["Blocked / escalate — never relax a gate<br/>Decision (routing) records the reasons"]
  E1 -- "non-empty" --> L2["Level 2 — Work Order routing<br/>Factory Router ranks by evidence<br/>record: Decision (routing) binding Factory Version + Execution Profile"]
  Q3 -- "no" --> Q4{"Is the question which model route, skill, tool,<br/>runtime, sandbox, or provider performs one step?"}
  Q4 -- "yes" --> E3{"Within the Execution Profile's admitted set?"}
  E3 -- "no" --> FAIL["Fail closed — the profile does not admit it.<br/>Prequalify a fallback or route the Work Order elsewhere (Level 2)."]
  E3 -- "yes" --> L3["Level 3 — Task routing<br/>Capability Router inside the factory<br/>record: routing snapshot frozen on the Attempt"]
  Q4 -- "no" --> Q5{"Is the question whether one factory may direct another?"}
  Q5 -- "yes" --> NEVER["Never — factories do not orchestrate one another.<br/>Return to Level 1: the control plane orchestrates the objective."]
  Q5 -- "no" --> Q6{"Is the question whether a version may be routed to at all?"}
  Q6 -- "yes" --> QUAL["Not routing — Qualification<br/>a current Qualification Record for the scope (D13)"]
  Q6 -- "no" --> ASK["Restate the question as who may, when, or what qualifies"]
  classDef intent fill:#dce8ef,stroke:#2f5f78,color:#171a18
  classDef control fill:#e4e9ec,stroke:#4a5d68,color:#171a18
  classDef execution fill:#f5e6d0,stroke:#9a4f1c,color:#171a18
  classDef trust fill:#dcefe4,stroke:#1a654b,color:#171a18
  classDef learning fill:#e9e2f4,stroke:#5c3f8f,color:#171a18
  classDef human stroke:#b3261e,stroke-width:3px
  classDef neutral fill:#faf9f5,stroke:#59605a,color:#171a18
  class S intent
  class Q1,Q2,Q3,Q4,Q5,Q6,E1,E3,L1,L2 control
  class L3 execution
  class QUAL trust
  class SCHED,ASK,NEVER neutral
  class BLOCK,FAIL neutral
  class BLOCK human
```

**How to use it.** Ask *who may* before *when*. Level 1 answers with a Plan; Level 2 answers with a routing Decision that binds an immutable Factory Version and Execution Profile after eligibility filtering and before ranking; Level 3 answers with a frozen snapshot on the Attempt. An empty eligible set at Level 2 blocks — it never relaxes a gate, and critical-risk Work Orders are never auto-routed without explicit policy. Mission Control: Level 2 and 3 are Available (`convex/lib/executionRouting.ts`, guarded); Level 1 across factories is Planned.

**What can go wrong.** Provider fallback treated as routing (it is a Level 3 change and must be prequalified). Capacity shortages treated as eligibility failures (they are scheduling). A factory "calling" another factory (it is a Level 1 decision the control plane must own).

---

## (d) Is this evidence current and sufficient?

Currentness is recomputed at decision time (canon §9, §10; `/patterns/candidate-currentness`). Only a Current PASS from an independent verifier, bound to the exact subject, satisfies a mandatory check.

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 520}}}%%
%% Decision tree (d) — is this evidence current and sufficient? (D14)
flowchart TB
  S["A mandatory criterion on Work Order WO-104-01 rev 1 is being evaluated"] --> Q1{"Is evidence recorded for this criterion?"}
  Q1 -- "no" --> MISS["MISSING — cannot become success"]
  Q1 -- "yes" --> Q2{"Is it bound to the exact subject?<br/>commit · tree · diff hash · contract digest · source Attempt"}
  Q2 -- "no" --> BORROW["Not usable — borrowed proof<br/>from another Attempt, candidate, PR head, revision, verifier, or policy"]
  Q2 -- "yes" --> Q3{"Is that subject the newest candidate-ready producer Attempt?"}
  Q3 -- "no" --> OLD["Not current — an older pass is never reused<br/>(newest candidate + newest exact-bound verification decide)"]
  Q3 -- "yes" --> Q4{"Was it produced by an independent Verification Attempt?<br/>lineage: separate Attempt, lease, worktree, invocation<br/>standard: verifier did not rely on artifacts the candidate could shape"}
  Q4 -- "no" --> DEP["Insufficiently independent — no receipt"]
  Q4 -- "yes" --> Q5{"Have validity conditions changed?<br/>PR head moved · Work Order revision · contract · policy ·<br/>environment · tool version · expiry passed"}
  Q5 -- "yes" --> STALE["STALE — new lineage required"]
  Q5 -- "no" --> Q6{"Does credible contemporaneous evidence contradict it?"}
  Q6 -- "yes" --> CONF["CONFLICTING — Risk Review;<br/>only an exception Decision with reason can resolve it"]
  Q6 -- "no" --> Q7{"Is the result PASS?<br/>not SKIPPED · NOT_CONFIGURED · ERROR · FAIL"}
  Q7 -- "no" --> NOPASS["Not sufficient — only PASS satisfies a mandatory check"]
  Q7 -- "yes" --> CUR["CURRENT PASS for this criterion"]
  CUR --> Q8{"Do all mandatory criteria in the verification contract have a CURRENT PASS?"}
  Q8 -- "no" --> INEL["Gate: INELIGIBLE (or AWAITING_HUMAN if only a human check remains)"]
  Q8 -- "yes" --> ELIG["Gate: ELIGIBLE — eligible ≠ accepted;<br/>acceptance is a separate Decision"]
  ELIG --> DEC["Decision: acceptance<br/>recomputes this tree at decision time"]
  classDef intent fill:#dce8ef,stroke:#2f5f78,color:#171a18
  classDef control fill:#e4e9ec,stroke:#4a5d68,color:#171a18
  classDef execution fill:#f5e6d0,stroke:#9a4f1c,color:#171a18
  classDef trust fill:#dcefe4,stroke:#1a654b,color:#171a18
  classDef learning fill:#e9e2f4,stroke:#5c3f8f,color:#171a18
  classDef human stroke:#b3261e,stroke-width:3px
  classDef neutral fill:#faf9f5,stroke:#59605a,color:#171a18
  class S intent
  class Q1,Q2,Q3,Q4,Q5,Q6,Q7,Q8 control
  class CUR,ELIG,DEC trust
  class MISS,BORROW,OLD,DEP,STALE,CONF,NOPASS,INEL neutral
  class DEC,CONF human
```

**How to use it.** The tree is the six-state evidence model in question form: Missing, then binding, then currentness (newest subject), then independence, then validity (Stale), then contradiction (Conflicting), then the verdict itself. Superseded evidence never reaches the tree because a newer record in the same slot replaced it. A Current PASS on one criterion does not make the Work Order eligible; every mandatory criterion must pass, and the whole tree is recomputed when the acceptance Decision is requested. Mission Control: `packages/workflow-engine/src/verificationIndependence.ts` and the currentness gate are Available; `REVOKED` maps to Stale, `REJECTED` to Missing (canon §18.3).

**What can go wrong.** Treating a green CI run on a moved PR head as current. Treating an agent's self-run tests as a verifier result. Reading an advisory projection (quality-gate view, review intelligence, memory) back as authority — `acceptanceAuthority` is always false for those.

---

## (e) Retry, recover, or reconcile?

An Attempt is immutable; a retry is a *new* Attempt with a new identity. Recovery resumes the *same* Attempt from a checkpoint only when ownership and world state are provable. Reconciliation decides which of those is safe (canon §5 Attempt; D31; `/patterns/recovery-checkpoint`).

```mermaid
%%{init: {"flowchart": {"wrappingWidth": 520}}}%%
%% Decision tree (e) — retry, recover, or reconcile? (D31)
flowchart TB
  S["An Attempt stopped making progress"] --> Q1{"Did it end with a structured result<br/>under the current lease fence?"}
  Q1 -- "yes — COMPLETED" --> DONE["Terminal: Candidate frozen → verification (separate Attempt)"]
  Q1 -- "yes — FAILED" --> F1{"Failure classified as retryable,<br/>and retry budget remaining?"}
  F1 -- "yes" --> RETRY["Retry = new Attempt<br/>new identity · new lease · retryOf recorded · manifest re-frozen"]
  F1 -- "no" --> BLOCK["Work Order BLOCKED<br/>operator revises the Plan or stops the Work Order"]
  Q1 -- "no" --> Q2{"Is ownership provable?<br/>lease valid · fence, worker, session, generation all match"}
  Q2 -- "yes — lease live, worker paused" --> PAUSE["PAUSED for a human decision<br/>resume only after manifest, lease, checkpoint revalidated"]
  Q2 -- "no — lease expired or generation changed" --> SUS["SUSPECT → RECONCILING<br/>no worker may act until disposition"]
  SUS --> Q3{"Cancellation durable?"}
  Q3 -- "yes" --> CAN["CANCELLED — history preserved"]
  Q3 -- "no" --> Q4{"Checkpoint exists?"}
  Q4 -- "yes" --> R1["Reconcile world vs checkpoint"]
  Q4 -- "no" --> R2["Reconcile world vs frozen manifest"]
  R1 --> D{"Disposition"}
  R2 --> D
  D -- "all observations MATCH, resumable" --> REC["RECOVERABLE — next authorized worker resumes<br/>the exact checkpoint under the same lease generation"]
  D -- "clean fresh start is safe" --> RT["RETRYABLE → new Attempt (retry)"]
  D -- "any UNKNOWN or MISMATCH" --> LOST["LOST — close the old Attempt,<br/>workspace PRESERVED, human decision required"]
  REC --> Q5{"Stale-recovery limit reached?"}
  Q5 -- "yes" --> EXH["EXHAUSTED — operator revises the Plan or stops the Work Order"]
  Q5 -- "no" --> RUN["RUNNING again — same Attempt, renewed lease"]
  RT --> F1
  classDef intent fill:#dce8ef,stroke:#2f5f78,color:#171a18
  classDef control fill:#e4e9ec,stroke:#4a5d68,color:#171a18
  classDef execution fill:#f5e6d0,stroke:#9a4f1c,color:#171a18
  classDef trust fill:#dcefe4,stroke:#1a654b,color:#171a18
  classDef learning fill:#e9e2f4,stroke:#5c3f8f,color:#171a18
  classDef human stroke:#b3261e,stroke-width:3px
  classDef neutral fill:#faf9f5,stroke:#59605a,color:#171a18
  class S intent
  class Q1,F1,Q2,Q3,Q4,Q5,D control
  class RETRY,RT,REC,RUN,R1,R2,PAUSE execution
  class DONE trust
  class SUS,CAN,BLOCK,EXH,LOST neutral
  class PAUSE,LOST,BLOCK,EXH human
```

**How to use it.** Start from whether the Attempt produced a *structured* result under the *current* fence. A result is terminal; a failure retries only as a new Attempt within budget. Without a result, ownership decides: a live lease with a paused worker is a human wait, not a failure; an expired lease is SUSPECT and nothing may act until reconciliation disposes it. Reconciliation compares the world with the checkpoint (or the manifest) and returns exactly one of RECOVERABLE, RETRYABLE, LOST or CANCELLED; ambiguity fails closed to LOST with the workspace preserved. Mission Control: fenced leases, heartbeat renewal, `LOST` disposition and workspace preservation are Available on `workflowRuns`; fleet-scale provider failure is not claimed.

**What can go wrong.** Retrying in place (same Attempt id) so that two workers write one workspace. Resuming from a checkpoint after the lease generation changed. Treating "no heartbeat" as "failed" and dispatching a duplicate before reconciliation.

---

## Related

- [/diagrams](/diagrams) · [/diagrams/infographics](/diagrams/infographics)
- [/architecture/factory-versioning](/architecture/factory-versioning) · [/architecture/qualification](/architecture/qualification) · [/architecture/authority](/architecture/authority) · [/architecture/routing](/architecture/routing)
- [/architecture/evidence](/architecture/evidence) · [/architecture/verification](/architecture/verification) · [/enterprise/operations](/enterprise/operations)
- [/specification/v1/factory-version](/specification/v1/factory-version) · [/specification/v1/work-order](/specification/v1/work-order) · [/specification/v1/attempt](/specification/v1/attempt) · [/specification/v1/evidence](/specification/v1/evidence)
- [/patterns/candidate-currentness](/patterns/candidate-currentness) · [/patterns/recovery-checkpoint](/patterns/recovery-checkpoint) · [/patterns/progressive-autonomy](/patterns/progressive-autonomy) · [/patterns/capability-based-routing](/patterns/capability-based-routing)
- [/glossary](/glossary)
