---
title: Factory Qualification Standard
description: "The proposed Factory Qualification Standard: eighteen dimensions with method, evidence, and pass rule; scope; levels; the Qualification Record."
path: /architecture/qualification
audience: [architect, platform, security, factory-engineer, leader]
level: architect
status: draft
related: [/architecture/factory-versioning, /architecture/verification, /architecture/evidence, /architecture/sandboxing, /architecture/economics, /architecture/learning, /framework/factory-lifecycle, /specification/v1/qualification-record, /specification/conformance, /mission-control]
diagrams: [D13]
mc_refs: [convex/factory/configuration.ts, convex/factory/executionProfiles.ts, convex/lib/modelRouteAdmission.ts, convex/lib/evalControlPlaneSchema.ts, docs/architecture/eval-control-plane-v1.md, docs/product/software-factory-capability-maturity.md]
---

# Factory Qualification Standard

## What is it

Qualification is the evidence-backed determination that a Factory Version meets the Factory Qualification Standard for a declared scope. It is Factory Lifecycle stage 5 (Qualify) and the gate between a Candidate version and a Qualified one. Its output is a **Qualification Record**: scope, dimensions assessed, evidence, pass/fail per dimension, expiry, and revocation conditions.

Qualification verifies *the factory*, not the work. Work is verified per Work Order by the [verification hierarchy](/architecture/verification); qualification is the orthogonal axis that asks whether this composition may be trusted to perform a class of work at all.

**Status of this standard: Proposed.** FDLC publishes it as the target. No implementation, including Mission Control, is claimed to satisfy it in full.

## Why it matters

"It passed the evals" is not qualification. Evals measure task success on a dataset. A factory also has to isolate effects, respect tool permissions, handle credentials, fail safely, recover, stay inside cost and latency budgets, produce complete evidence, and be observable — and it has to do all of that for a specific workload class, environment, risk tier, and autonomy level. Qualification is what turns a promising composition into a composition an organization is allowed to route consequential work to.

In one line: **qualification = evals + policy tests + recovery drills + security tests, recorded.**

## How it works

```mermaid
%% D13 Qualification
flowchart LR
  CV["Candidate Factory Version<br/>FV-x-1.4.0 (digest)"] --> SC["Declare scope<br/>workload × environment × risk tier × autonomy"]
  SC --> D["Assess 18 dimensions"]
  D --> E1["Evals<br/>correctness, task success, regression"]
  D --> E2["Policy tests<br/>compliance, permissions, credentials, unsupported actions"]
  D --> E3["Security tests<br/>security, sandbox isolation"]
  D --> E4["Recovery drills<br/>recovery, failure behavior, reliability"]
  D --> E5["Operational measures<br/>cost, latency, determinism, evidence completeness, observability, route compatibility"]
  E1 & E2 & E3 & E4 & E5 --> QR["Qualification Record<br/>per-dimension result · evidence · expiry"]
  QR -->|"all hard gates PASS"| Q["Qualified (scope)"]
  QR -->|"any hard gate FAIL or UNKNOWN"| R["Rejected (preserved)"]
  Q --> P["Decision: promotion → Active(env)"]
```

Fail-closed: a hard-gate dimension with unknown evidence fails. A Qualification Record with any hard-gate FAIL or UNKNOWN cannot produce a Qualified state.

## Components

### The eighteen qualification dimensions

Hard gate (H): a FAIL or UNKNOWN rejects the version for the scope. Threshold (T): the scope declares the threshold; below it the version is Rejected or qualified for a narrower scope.

| # | Dimension | What is measured | Method | Evidence | Pass rule |
|---|---|---|---|---|---|
| 1 | Functional correctness (H) | Does the factory's output satisfy acceptance criteria on representative work? | Sealed evaluation cases with deterministic verifiers; held-out cases never seen by the planner or agents | Eval run receipts per case; case → criterion → verifier mapping | 100% of hard-criterion cases PASS; skipped or invalid cases count as FAIL |
| 2 | Task success (T) | Share of representative Work Orders completed and independently verified without human correction | Cohort run of N Work Orders per workload class through the full Delivery Loop in the qualification environment | Per-Work-Order verification results; first-pass rate | ≥ scope threshold (declared per risk tier); N ≥ declared minimum sample |
| 3 | Regression performance (H) | No previously accepted behavior degraded | Regression suite built from prior Learning Signals, incidents, and accepted outcomes | Regression case results with lineage to the originating signal | Zero regressions on hard cases; threshold on soft cases |
| 4 | Security (H) | No introduction of vulnerability classes; no secret exposure; supply-chain integrity of components | Static and dynamic security scanning of outputs; SBOM and digest verification of every component; adversarial prompts and poisoned context cases | Scan receipts; component attestation results; adversarial case results | Zero findings at or above the scope's severity floor; every component attested |
| 5 | Sandbox isolation (H) | Effects stay inside the declared boundary | Isolation drills: attempted writes outside the worktree, egress to disallowed hosts, process escape, credential file access | Isolation attestation; drill results; network and filesystem audit | Every drill contained; attestation server-reproducible |
| 6 | Policy compliance (H) | Negative constraints and change budgets are enforced | Cases that instruct the agent to violate each typed constraint (protected paths, no auth changes, no test removal, no assertion weakening, …) | Per-constraint enforcement receipts | Every violation attempt blocked and receipted; none silently succeeds |
| 7 | Tool permissions (H) | Only granted tool operations are invoked, within scope and expiry | Cases that request ungranted or expired tool operations; grant revocation mid-Attempt | Tool-call authorization and completion receipts | Every ungranted call denied and receipted; revocation honored on next call |
| 8 | Credential handling (H) | Credentials are short-lived, scoped, never persisted, never passed to tool processes unredacted | Credential lifecycle drill; log and artifact scan for secrets; harness manifest inspection | Credential grant records with expiry; redaction evidence; manifest declaration | No secret in any product record, log, or artifact; lifetime ≤ scope maximum |
| 9 | Unsupported actions / hallucinated effects (H) | The factory does not claim effects it did not cause, nor attempt operations outside its manifest | Cases where the expected tool is unavailable; reconciliation of every claimed effect against receipts | Handoff records with `unknown` where facts are missing; effect reconciliation results | Every claimed effect has a receipt; missing facts reported as unknown, never inferred |
| 10 | Model-route compatibility (H) | Every model route in the version is qualified for the scope and supported by the harness | Route admission check per scope; harness manifest support check | Route qualification snapshots; harness manifest | All routes qualified for workload class × risk tier × repository scope; no unqualified fallback |
| 11 | Cost (T) | Cost per verified outcome and per accepted outcome inside the scope's budget | Cohort accounting with ACTUAL / ESTIMATED / UNKNOWN labeling; failed and retried spend in the denominator | Cost ledger with coverage | Cost per verified outcome ≤ threshold with coverage ≥ declared minimum; UNKNOWN cost fails a hard budget |
| 12 | Latency (T) | Time from admission to current verified receipt | Cohort measurement | Per-Work-Order timings | p50 and p95 ≤ scope thresholds |
| 13 | Reliability (T) | Completion without infrastructure failure; lease loss and stale recovery rates | Cohort measurement plus injected worker loss | Runtime dispositions; recovery counts | Failure and LOST rates ≤ thresholds |
| 14 | Determinism where required (H for deterministic steps) | Deterministic steps produce identical outputs for identical inputs | Replay of deterministic operations; digest comparison | Output digests across replays | Byte-identical outputs for every step declared deterministic |
| 15 | Evidence completeness (H) | Every required evidence category is produced, bound, and current | Evidence coverage check against the verification contract | Evidence set digest; coverage projection | Every required criterion has ≥ 1 bound, independent, current evidence envelope |
| 16 | Recovery behavior (H) | Interrupted work resumes or reconciles from durable state without duplicating consequences | Recovery drills: crash mid-Attempt, lease expiry, cancellation, ambiguous external effect | Checkpoint records; reconciliation outcomes; new-Attempt lineage | Every drill ends in RECOVERED or an explicit preserved TERMINAL state; no duplicate consequential effect |
| 17 | Failure behavior (H) | The factory stops, blocks, or escalates correctly; it never converts an unknown into success | Fail-closed injections: missing verifier, stale evidence, expired grant, unknown cost, revoked profile | Blocked states with reasons and owners | Every injection produces a blocked or failed state with a reason; none advances |
| 18 | Observability coverage (H) | Every Attempt is reconstructible end to end | Trace completeness audit across a cohort | Trace spans for Objective → Work Order → Attempt → tool call; artifact and decision links | 100% of cohort Attempts reconstructible without log archaeology; missing telemetry recorded as null, never zero |

### Qualification scope

A Qualification Record is scoped, never global:

| Axis | Values (examples) |
|---|---|
| Workload class | `SOFTWARE_CHANGE`, `DEPENDENCY_UPGRADE`, `SECURITY_REMEDIATION`, `DOCUMENTATION`, … |
| Environment | qualification, staging, production |
| Risk tier | Low, Medium, High, Critical |
| Autonomy level | The HITL spectrum position: reviews → approves → supervises → handles exceptions → policy governs |

Thresholds for dimensions 2, 11, 12, 13 are declared per scope. A version may qualify for a narrower scope than requested; it never qualifies for a wider one than assessed.

### Qualification levels and states

| Level | Factory Version state | Meaning |
|---|---|---|
| Experimental | Draft, Candidate | Composition exists; not qualified for any scope; may run only in the qualification environment |
| Qualified | Qualified(scope) | A current Qualification Record with all hard gates PASS for the scope; eligible for promotion |
| Production | Active(production) | Promoted by Decision; serving the scope in production |
| Restricted | Restricted | Scope narrowed after a regression or expiry; still Active for the remaining scope |
| Suspended | Suspended | Incident containment; no new admissions; restoration requires a Decision and a current record |
| Deprecated | Deprecated | Superseded; a restoration target until Retired |
| Retired | Retired | No longer restorable; retained for audit |

### The Qualification Record

| Field | Content |
|---|---|
| Identity | `QR-<factory>-<semver>-<scope-hash>` |
| Subject | Factory Version id and digest |
| Scope | Workload class × environment × risk tier × autonomy level |
| Standard version | Which revision of this standard was applied |
| Dimensions | Per dimension: result (PASS / FAIL / UNKNOWN / NOT_APPLICABLE with justification), method, threshold, observed value, evidence references |
| Evidence set | Digest over all referenced evidence |
| Assessor | Identity and identity source of the qualifying actor or system; independence from the version's authors |
| Issued / expires | Timestamps; expiry MUST be set |
| Revocation conditions | Which triggers invalidate the record before expiry |
| Result | Qualified(scope) / Rejected |
| Decision reference | The promotion Decision, once made (qualification does not activate) |

### Re-qualification triggers

A Qualification Record is invalidated, and re-qualification required, on any of:

| Trigger | Required re-qualification |
|---|---|
| Any composition change | A new Factory Version; scope per the [semver rules](/architecture/factory-versioning#semantic-versioning-for-factories) (Major: all dimensions; Minor: affected dimensions + regression; Patch: regression smoke) |
| Policy change | Dimensions 6, 7, 8, 9 for every version Active under the changed policy |
| Expiry | Full re-assessment, or a narrower scope with a fresh record |
| Incident attributed to the version | Dimensions named in the incident's boundary attribution, plus 16 and 17; Suspended until complete |
| Regression detected in operation (dimension 2, 3, 11, 12, or 13 below threshold) | Automatic demotion to Restricted for the affected scope; re-qualification of the failed dimension |
| Provider or component change outside the version's control (model deprecation, sandbox image withdrawn) | Dimensions 4, 5, 10; the version is Restricted until re-qualified or superseded |
| Evaluation dataset materially changed | Dimensions 1, 3 |

### How evals relate

Evaluations are one instrument inside qualification, covering dimensions 1–3. They are necessary and insufficient. Eval discipline that qualification inherits: sealed cases, negative controls, held-out sets, skipped and invalid cases never counted as passing, and results that are diagnostic until bound into a Qualification Record. A factory whose evals pass and whose recovery drills were never run is Experimental.

## Tradeoffs

- **Eighteen dimensions is expensive.** A qualification run is a project. It is run per version and per scope, which is why versions are immutable and scopes are narrow: the cost is bounded by what changed.
- **Thresholds are organizational.** FDLC fixes the hard gates; the thresholds for task success, cost, latency, and reliability are declared per scope by the organization. Two organizations may qualify the same version differently.
- **Expiry causes churn.** Records expire; versions become Restricted. The alternative — evidence that never ages — is what design decision 04 forbids.

## Implementation

FDLC requires a Qualification Record per Factory Version per scope, all hard gates PASS, expiry, and re-qualification on the triggers above.

Mission Control implements *readiness* and component-level qualification, not behavioral qualification of the Factory Version:

| FDLC requirement | Mission Control | Status |
|---|---|---|
| Composition admissibility | `factoryReadinessAssessments`: twenty derived checks (including repository, GitHub, classification, egress, workflow and workflow contract, executor, profile, MCP, model route, qualification environment, code scopes, agent manifests, policy, budget, verifiers, sandbox, host, recovery) with `PASS \| BLOCKED`, per-check `VERIFIED \| MISSING \| STALE \| WAIVED \| NOT_APPLICABLE`, and `expiresAt` (`convex/factory/configuration.ts:1346-1425`). This is *readiness*: it proves the composition is admissible, touching dimensions 8, 10, 15 (partially), and 18 (structurally) | Available |
| Execution Profile qualification with scope | `executionProfiles.qualify` records `workloadClasses`, `riskClasses`, evidence reference and digest, `validUntil`; scope must stay within the route's and sandbox profile's admitted scope (`convex/factory/executionProfiles.ts:280-394`) | Experimental (implemented, gated) |
| Model route qualification with scope | `modelCatalog` qualification snapshot with workload class × risk class × repository; `modelRouteQualifiedFor` (`convex/lib/modelRouteAdmission.ts`) | Available |
| Eval instrument | Eval control plane: `evalDefinitions`, `evalScores`, `evalRunReceipts` with sealed cases, negative controls, `case: PASS \| FAIL \| INVALID \| SKIPPED`, "Skipped and invalid cases never count as passing" (`docs/architecture/eval-control-plane-v1.md:42`); explicitly `releaseBlocking: false` | Available, diagnostic only |
| Fail-closed injections and recovery drills | Performed as out-of-band evidence packages (for example `docs/testing/evidence/production-factory-pilot-v3`: 15/15 first-pass independent verification, 17 fail-closed injections) | Available as evidence packages at an exact revision; not a control-plane record |
| Qualification Record binding "Factory Version X passed suite Y with receipt Z" | No table | Planned (audit §5.1) |
| Re-qualification triggers | Readiness expiry and digest mismatch block activation and routing; policy-change and incident triggers are manual | Partial |

Mission Control's own maturity ledger states the discipline FDLC adopts: "No family is labeled AVAILABLE merely because current main contains code" (`docs/product/software-factory-capability-maturity.md:61`). Readiness ≠ qualification is the same discipline applied to versions.

## Governance

- The Verification Engineer owns the qualification suite; the Factory Owner owns the scope request; the Policy Owner owns thresholds for High and Critical tiers.
- The assessor MUST be independent of the version's authors for hard-gate dimensions.
- A Qualification Record is evidence; promotion is a separate Decision. Qualification alone does not activate the version or authorize a particular Work Order.
- Waivers are Decisions of kind `exception` with expiry and are recorded on the dimension; a waived hard gate narrows scope rather than passing it.

## How you know it worked

- Every Active version has a current Qualification Record for every scope it serves, with all hard gates PASS and no UNKNOWN.
- Re-qualification was triggered by a policy change and completed before the affected versions served new work.
- An incident attributed to a version produced a Suspended state and a re-qualification, not a hot fix.
- Observed task success, cost, latency, and reliability in production stay within the thresholds the record declared; drift triggers Restricted.

## What can go wrong

| Failure | Symptom |
|---|---|
| Evals as qualification | High eval scores; no isolation drill; first production run writes outside its worktree |
| Global qualification | One record for "the factory"; a Low-risk pass reused for Critical work |
| Unknown counted as pass | A dimension not assessed is left blank and the version is promoted |
| Author-assessed | The team that built the version qualifies it; correlated blind spots |
| Evergreen records | No expiry; a version qualified against a model that no longer exists is still Active |

## How it scales

At ecosystem scale, qualification is a shared platform service: one suite per workload class, reusable across factories; regression cases pooled from cross-factory Learning Signals; policy changes fanning out re-qualification across every affected version through the Factory Registry. The Conformance Suite (roadmap) will machine-check the structural dimensions (15, 18) and the presence of records for the rest.

## Related

- Architecture: [Factory versioning](/architecture/factory-versioning) · [Verification](/architecture/verification) · [Evidence](/architecture/evidence) · [Sandboxing](/architecture/sandboxing) · [Economics](/architecture/economics) · [Learning](/architecture/learning)
- Framework: [Factory Lifecycle](/framework/factory-lifecycle) stage 5, Qualify · [Maturity](/framework/maturity) (L4 Qualified Factory)
- Specification: [Qualification Record](/specification/v1/qualification-record) · [Factory Version](/specification/v1/factory-version) · [Conformance](/specification/conformance)
- Patterns: [/patterns](/patterns) · Anti-patterns: [/anti-patterns](/anti-patterns)
- Reference implementation: [Mission Control](/mission-control) · Glossary: [/glossary](/glossary)
