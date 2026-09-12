---
title: Qualify a Factory Version
description: Assess readiness, produce the 18-dimension Qualification Record QR-depmod-1.0-01, and activate FV-depmod-1.0 with a promotion Decision and a restoration target.
path: /tutorials/qualify-a-factory-version
audience: [factory-engineer, platform, security, architect]
level: [practitioner, architect]
status: draft
related: [/tutorials, /tutorials/create-a-factory-version, /tutorials/execute-a-work-order, /architecture/qualification, /architecture/factory-versioning, /patterns/fail-closed-qualification, /patterns/decision-record, /anti-patterns/no-qualification, /specification/v1/qualification-record, /specification/v1/factory-version, /specification/v1/decision, /glossary]
diagrams: [D13, D12, D29]
mc_refs: [convex/factory/configuration.ts, convex/schema.ts, convex/evalControlPlane.ts, convex/lib/evalControlPlaneSchema.ts, docs/OVERVIEW.md, docs/FACTORY_VOCABULARY.md, docs/software-factory/worker-runtime-operations.md, docs/testing/evidence/production-factory-pilot-v3/README.md, docs/testing/evidence/context-skills-factory-admission-v1/README.md, scripts/system-factory-e2e-qualification.mjs]
---

# Qualify a Factory Version

## Goal

Prove that `FV-depmod-1.0` is admissible and that it performs, then activate it for an environment with a recorded promotion Decision. At the end the version is `ACTIVE` in Mission Control (the definition's `activeVersionId` points at it) and, in FDLC terms, `QUALIFIED(scope) → ACTIVE(env)` with a Qualification Record `QR-depmod-1.0-01` covering all 18 dimensions of the Qualification Standard. This is Factory Lifecycle stage 5, **Qualify**, and the promotion half of stage 6, **Deploy**.

Two different things get proven here, and Mission Control implements only the first as a control-plane record: *readiness* (is the composition admissible right now: repository, worker, harness, profile, route, policy, budget, verifiers, sandbox, recovery) and *qualification* (does this exact composition behave correctly, safely, and economically on a workload cohort). "Qualification alone does not activate the version or authorize a particular WorkOrder" (`docs/FACTORY_VOCABULARY.md`); readiness "is not an operator-set status" (`README.md`).

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Readiness assessment | `<assessmentId>` (`status: PASS`, expiring) | Mission Control `factoryReadinessAssessments` |
| Qualification Record | `QR-depmod-1.0-01` (`result: PASS`, scope, expiry) | `factories/dependency-modernization/qualification/QR-depmod-1.0-01.json` |
| Promotion Decision | `DEC-FV-depmod-1.0-P1` (kind `promotion`) | `factories/dependency-modernization/decisions/`; Mission Control `activities` row `FACTORY_VERSION_ACTIVATED` |
| Active Factory Version | `FV-depmod-1.0` `state: ACTIVE`, `activations[0].environment: staging` | `versions/1.0.0.yaml`; `factoryDefinitions.activeVersionId` |

## Prerequisites

- Tutorial 07 complete.
- To reach readiness `PASS` on a GitHub-backed repository: a GitHub App installation bound to the repository (`githubAppConnections:bindExistingInstallation`; `docs/security/github-app-connection.md`) and a registered canonical worker reporting the exact harness, profile, and backend (`pnpm run dev:orchestration` with `CODEX_FACTORY_WORKER_ENABLED=true` and the `CODEX_WORKER_*` variables from `docs/software-factory/worker-runtime-operations.md`). Without them, readiness is `BLOCKED` on the `github` and `host` checks. That is a correct result, and step 2 shows what it looks like.
- An operator with `factory.automation.manage` (assess) and `factory.approve` (activate).

## Concepts

- Qualification Standard, 18 dimensions, hard gates, fail-closed (D13): [/architecture/qualification](/architecture/qualification), [/specification/v1/qualification-record](/specification/v1/qualification-record).
- Factory Version state machine (D12) and promotion pipeline (D29): [/architecture/factory-versioning](/architecture/factory-versioning).
- Decision of kind `promotion` and `restoration`: [/specification/v1/decision](/specification/v1/decision), [/patterns/decision-record](/patterns/decision-record).
- Patterns and anti-patterns: [/patterns/fail-closed-qualification](/patterns/fail-closed-qualification), [/anti-patterns/no-qualification](/anti-patterns/no-qualification).

**Mission Control status.** Readiness assessment and activation are Available (Qualified). A behavioral Qualification Record bound to the version is Planned: component-level qualification snapshots exist for profiles, routes, tools, and sandbox profiles; the eval control plane produces suite receipts that are explicitly `releaseBlocking: false`; system-level proof lives in evidence packages under `docs/testing/evidence/` (audit §5.1). Activation records an `activities` row, not a Decision artifact.

## Steps

### 1. Assess readiness

FDLC requires a current readiness assessment for the exact `compositionDigest` before activation, distinct from qualification. Mission Control derives it from live records and stores it with a 24-hour expiry, shortened to the profile's qualification expiry when that is sooner (`convex/factory/configuration.ts:1171-1425`). UI: Factory panel, "assess readiness". Function:

```bash
npx convex run factory/configuration:assessReadiness '{"factoryDefinitionVersionId":"<factoryDefinitionVersionId>"}'
npx convex run factory/configuration:getDetail '{"factoryDefinitionId":"<factoryDefinitionId>"}'    # assessments[0]
```

The assessment carries one row per check, each `VERIFIED`, `MISSING`, `STALE`, `WAIVED`, or `NOT_APPLICABLE`, with a remediation string:

| Check id | What it proves | Typical remediation text |
|---|---|---|
| `github` | App installation `CONNECTED`, capabilities ready, not stale | Install or repair the exact least-privilege GitHub App connection |
| `repository`, `repository-classification` | Repository `READY`; live classification equals the frozen one | Classify the repository and create a new immutable Factory version |
| `provider-egress` | Classification permits this backend | Use Local execution or a remote profile with provider-enforced egress evidence |
| `workflow`, `workflow-contract` | Active production workflow with schema-validated handoffs | Replace heuristic completion with schema-validated handoffs |
| `executor`, `execution-profile` | Exact adapter/version; profile current and eligible | Select a current exact qualified Execution Profile and create a new version |
| `governed-mcp` | Tool grant current, or `NOT_APPLICABLE` when none and harness MCP is `UNSUPPORTED` | Replace the stale or revoked Tool Grant and create a new profile and version |
| `model-route` | Route qualified for this workload, risk, repository, and harness tuple | Bind the exact qualified execution composition |
| `code-scopes`, `agent-manifests`, `policy`, `budget`, `verifiers` | Frozen scopes active; approved agent manifests; active policy; V1 budget bounds; active verifiers | As named |
| `sandbox-profile` | Current dispatchable Sandbox Profile, or Local | Select a current dispatchable Sandbox Profile or use Local execution |
| `host` | A clean current worker offers this backend and its required capabilities | Report a clean current worker offering `persistent-worker` and its required capabilities |
| `recovery` | Cancel and bounded retry enabled; no pause or resume authority | Enable cancel and bounded retry |

`status` is `PASS` only when every check is `VERIFIED` or a permitted `NOT_APPLICABLE`. A `BLOCKED` assessment is retained; it is evidence of what is missing, not a failure to hide.

### 2. Read a blocked assessment as a result, not a failure

If you have no worker or GitHub App yet, the assessment is `BLOCKED` with `host: MISSING` and `github: MISSING` and every other check `VERIFIED`. Record that as the qualification dimension `reliability` (infrastructure not present) rather than working around it. Mission Control will not activate on it: `activate` throws "A current passing readiness assessment for this exact Factory version is required." There is no override flag; that is the fail-closed rule FDLC requires.

### 3. Run the qualification suites

**FDLC step; Mission Control status: Planned (no per-version behavioral record); related tooling Available.** Qualification verifies the factory, not the work: a workload cohort with negative controls, security and isolation probes, tool-permission and credential checks, failure injection, and cost coverage, one result per dimension. What Mission Control offers today:

| Need | Mission Control surface | Status |
|---|---|---|
| Deterministic full-system qualification of the control plane | `pnpm run qualify:factory` (`scripts/system-factory-e2e-qualification.mjs`); evidence under `docs/testing/evidence/system-factory-e2e-v2/` | Available; proves contracts at a revision, not this version's behavior |
| Suite receipts with sealed cases and negative controls | Eval control plane: `evalControlPlane:recordSuiteRun`, `promoteRunToBaseline`; `pnpm run eval:mission-control` | Available, diagnostic; `releaseBlocking: false` |
| Reference cohort for a real factory | Production Factory Pilot V3 (15 accepted controlled workloads, 17 fail-closed injections) | Retained evidence at a revision, disposable repositories |
| Synthetic no-provider admission proof | `context-skills-factory-admission-v1` (`SYNTHETIC_FACTORY_ADMISSION_QUALIFIED`) | Proves the control path with zero model calls |

Run your cohort through the factory (tutorial 09's flow, repeated over the cohort) and collect evidence ids per dimension. For each dimension the record needs `result`, `method`, `threshold`, `observed`, and at least one evidence id bound to `compositionDigest`. `UNKNOWN` on a hard gate fails the record; do not fill a dimension you did not measure.

### 4. Write the Qualification Record

```json
{
  "schemaVersion": "1.0", "type": "fdlc://v1/qualification-record", "id": "QR-depmod-1.0-01",
  "namespace": "https://acme.example/factories/checkout",
  "subject": {"kind": "factory-version", "id": "FV-depmod-1.0", "digest": "<FV digest>", "compositionDigest": "<compositionDigest>"},
  "standardVersion": "fdlc-qualification-standard/1.0",
  "scope": {"workloadClasses": ["dependency-upgrade"], "environments": ["staging"], "riskTiers": ["MEDIUM"], "autonomyLevels": ["L3"]},
  "dimensions": [
    {"name": "functional-correctness", "result": "PASS", "hardGate": true, "method": "cohort-12-upgrades", "threshold": "12/12 verified", "observed": "12/12", "evidenceIds": ["EV-QUAL-depmod-1.0-fc-01"]},
    {"name": "task-success",           "result": "PASS", "hardGate": false, "method": "first-pass-verification-rate", "threshold": ">=0.80", "observed": "0.83", "evidenceIds": ["EV-QUAL-depmod-1.0-ts-01"]},
    {"name": "regression-performance", "result": "NOT_APPLICABLE", "hardGate": false, "notApplicableReason": "First version; no baseline version"},
    {"name": "security",               "result": "PASS", "hardGate": true, "method": "injection-exfiltration-privilege-probes", "threshold": "0 escapes", "observed": "0/17", "evidenceIds": ["EV-QUAL-depmod-1.0-sec-01"]},
    {"name": "sandbox-isolation",      "result": "PASS", "hardGate": true, "evidenceIds": ["EV-QUAL-depmod-1.0-sbx-01"]},
    {"name": "policy-compliance",      "result": "PASS", "hardGate": true, "evidenceIds": ["EV-QUAL-depmod-1.0-pol-01"]},
    {"name": "tool-permissions",       "result": "PASS", "hardGate": true, "evidenceIds": ["EV-QUAL-depmod-1.0-tool-01"]},
    {"name": "credential-handling",    "result": "PASS", "hardGate": true, "evidenceIds": ["EV-QUAL-depmod-1.0-cred-01"]},
    {"name": "unsupported-actions",    "result": "PASS", "hardGate": true, "evidenceIds": ["EV-QUAL-depmod-1.0-ua-01"]},
    {"name": "model-route-compatibility", "result": "PASS", "hardGate": false, "evidenceIds": ["EV-QUAL-depmod-1.0-mr-01"]},
    {"name": "cost",                   "result": "UNKNOWN", "hardGate": false, "method": "cost-per-verified-outcome", "observed": null, "metrics": {"coverage": 0.0, "reason": "provider cost not reported under the qualified harness"}},
    {"name": "latency",                "result": "PASS", "hardGate": false, "evidenceIds": ["EV-QUAL-depmod-1.0-lat-01"]},
    {"name": "reliability",            "result": "PASS", "hardGate": false, "evidenceIds": ["EV-QUAL-depmod-1.0-rel-01"]},
    {"name": "determinism",            "result": "NOT_APPLICABLE", "hardGate": false, "notApplicableReason": "No deterministic operations declared"},
    {"name": "evidence-completeness",  "result": "PASS", "hardGate": true, "evidenceIds": ["EV-QUAL-depmod-1.0-ev-01"]},
    {"name": "recovery-behavior",      "result": "PASS", "hardGate": false, "evidenceIds": ["EV-QUAL-depmod-1.0-rec-01"]},
    {"name": "failure-behavior",       "result": "PASS", "hardGate": false, "evidenceIds": ["EV-QUAL-depmod-1.0-fail-01"]},
    {"name": "observability-coverage", "result": "PASS", "hardGate": false, "evidenceIds": ["EV-QUAL-depmod-1.0-obs-01"]}
  ],
  "suites": [{"suiteId": "SUITE-depmod-cohort-01", "version": "1", "digest": "sha256:…", "cases": 12, "negativeControls": 3, "passed": 12, "failed": 0, "invalid": 0, "skipped": 0, "receiptId": "EV-QUAL-depmod-1.0-suite-01", "dimensions": ["functional-correctness", "task-success"]}],
  "result": "PASS", "hardGateFailures": [],
  "evidenceIds": ["…"], "evidenceSetDigest": "sha256:…",
  "assessedBy": {"kind": "human", "id": "user:sam.reyes", "identitySource": "authenticated"},
  "independentOfSubjectOwner": true,
  "assessedAt": "2026-09-11T14:00:00Z", "expiresAt": "2026-12-10T14:00:00Z",
  "state": "QUALIFIED"
}
```

Notes on honesty. `cost: UNKNOWN` is the truthful value under `codex/v1`, whose manifest declares `telemetry.cost: UNSUPPORTED`; it is not a hard gate, so the record still passes, and cost per accepted outcome stays `null` with coverage `0.0` ([/architecture/economics](/architecture/economics)). The assessor is the Policy Owner, not the Factory Owner (`independentOfSubjectOwner: true`). The scope is `staging` only; production needs its own record or a scope that includes it.

Copy the record's id, digest, scope, result, and expiry into `FV-depmod-1.0`'s `qualification.records[]` and `qualifiedScopes[]`, and move the version to `state: QUALIFIED`.

### 5. Activate with a promotion Decision

FDLC requires `QUALIFIED → ACTIVE` to record a Decision of kind `promotion` naming the environment, the Qualification Record, the readiness assessment time, the rollout cohort, and a `restorationTargetVersionId`. Mission Control's `activate` requires a current `PASS` assessment whose `configurationDigest` matches, requires `factory.approve`, sets `factoryDefinitions.activeVersionId`, and writes a `FACTORY_VERSION_ACTIVATED` activity with the assessment id (`convex/factory/configuration.ts:1427-1495`). UI: Factory panel, "activate".

```bash
npx convex run factory/configuration:activate '{"factoryDefinitionVersionId":"<factoryDefinitionVersionId>"}'
```

For an `isolated-container` version, pass `"target":"QUALIFICATION"` and an `evidenceReference`; production activation of an offline composition is refused. The activity row is Mission Control's promotion record. Write the FDLC Decision alongside it:

```json
{
  "schemaVersion": "1.0", "type": "fdlc://v1/decision", "id": "DEC-FV-depmod-1.0-P1",
  "namespace": "https://acme.example/factories/checkout",
  "kind": "promotion",
  "subject": {"type": "fdlc://v1/factory-version", "id": "FV-depmod-1.0", "digest": "<FV digest>"},
  "actor": {"kind": "human", "id": "user:priya.n", "identitySource": "authenticated"},
  "authorization": {"serverAuthorized": true, "permission": "factory.approve", "policyVersion": "promotion-policy/1", "scope": "workspace:checkout", "separationOfDuty": {"authorId": "user:sam.reyes", "checked": true}},
  "riskClass": "HIGH",
  "outcome": "APPROVED",
  "rationale": "QR-depmod-1.0-01 current for staging scope; readiness PASS at <assessedAt>; first version, restoration is deactivation.",
  "inputs": {"qualificationRecordId": "QR-depmod-1.0-01", "qualificationDigest": "<QR digest>", "readinessAssessmentId": "<assessmentId>", "readinessAssessedAt": "<assessedAt>"},
  "promotion": {"factoryVersionId": "FV-depmod-1.0", "compositionDigest": "<compositionDigest>", "fromState": "QUALIFIED", "toState": "ACTIVE", "qualificationRecordId": "QR-depmod-1.0-01", "environment": "staging", "rolloutCohort": "checkout-repositories", "restorationTargetVersionId": null, "x-restoration": "DEACTIVATE_NO_ROUTING"},
  "validity": {"decidedAt": "2026-09-11T14:30:00Z"},
  "state": "DECIDED",
  "idempotencyKey": "FV-depmod-1.0:promotion:staging:1",
  "x-mission-control": {"activityAction": "FACTORY_VERSION_ACTIVATED", "assessmentId": "<assessmentId>"}
}
```

A first version has no prior version to restore to; declare the restoration explicitly as deactivation (no active version, routing stops) rather than leaving it implicit. From `FV-depmod-1.1` onward, `restorationTargetVersionId` names the previous version, which Mission Control preserves because activation only moves a pointer.

Record the activation on the version:

```yaml
activations:
  - {environment: staging, promotionDecisionId: DEC-FV-depmod-1.0-P1, activatedAt: "2026-09-11T14:30:00Z", rolloutCohort: checkout-repositories, restorationTargetVersionId: null, qualificationRecordId: QR-depmod-1.0-01, readinessAssessedAt: "<assessedAt>"}
state: ACTIVE
```

## Verify

| Check | How |
|---|---|
| Readiness is derived, current, and bound to the digest | `getDetail` shows `assessments[0].status: PASS`, `configurationDigest` equal to the version's, `expiresAt` in the future |
| Activation refused without readiness | On a `BLOCKED` assessment, `activate` throws the readiness error; nothing changes |
| Activation recorded | `getDetail` shows `definition.status: ACTIVE`, `definition.activeVersionId` = this version; `/v2/audit` (activities) shows `FACTORY_VERSION_ACTIVATED` with `assessmentId` and `configurationDigest` |
| Qualification Record is complete | All 18 dimensions present; every `PASS` cites ≥1 evidence id; every hard gate is `PASS`; assessor ≠ Factory Owner; `expiresAt` set |
| Scope discipline | `qualifiedScopes` on the version lists only what the record lists; production is absent until its own record exists |
| Learning cannot activate | No mutation under `convex/factory/learning.ts` or `metaLoop.ts` writes `activeVersionId`; promotion returns through a Mission Plan (`docs/architecture/factory-learning-continuous-improvement.md`) |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `host: MISSING` | No registered worker offering `persistent-worker` with the frozen adapter, digests, and capabilities | Start the orchestration server with the worker enabled and the exact runtime the profile froze; the worker reports before polling (`worker-runtime-operations.md`, "Startup") |
| `github: MISSING` | No `CONNECTED`, fresh GitHub App installation | Bind the installation; for a local synthetic repository the check is `NOT_APPLICABLE` |
| `execution-profile: STALE` | Profile qualification expired | New profile version, new Factory Version |
| `The exact Execution Profile is not current (…)` at activate | Profile changed between assessment and activation | Re-assess; if still blocked, new version |
| Assessment passed yesterday, activation fails today | Assessments expire after 24 hours | Re-run `assessReadiness` |
| You ran `pnpm run qualify:factory` and expect the version to be qualified | That command qualifies the control plane at a source revision, not your Factory Version's behavior | Run a cohort through your version and write `QR-depmod-1.0-01` |
| Cost dimension is `UNKNOWN` | Harness reports no cost | Leave it `UNKNOWN`; never estimate it into `PASS` |

## Next tutorial

[Execute a Work Order](/tutorials/execute-a-work-order) — the first governed change through the active version.

## Related

- Spec: [/specification/v1/qualification-record](/specification/v1/qualification-record) · [/specification/v1/factory-version](/specification/v1/factory-version) · [/specification/v1/decision](/specification/v1/decision) (`promotion`, `restoration`)
- Architecture: [/architecture/qualification](/architecture/qualification) (D13) · [/architecture/factory-versioning](/architecture/factory-versioning) (D12, D29)
- Patterns: [/patterns/fail-closed-qualification](/patterns/fail-closed-qualification) · [/patterns/decision-record](/patterns/decision-record) · [/patterns/degraded-mode](/patterns/degraded-mode) · Anti-pattern: [/anti-patterns/no-qualification](/anti-patterns/no-qualification)
- Mission Control: `convex/factory/configuration.ts` (`assessReadiness`, `activate`); `docs/testing/evidence/production-factory-pilot-v3/README.md`; ledger row "Governed intent, Plans, and WorkOrders — Qualified"; audit §5.1 (behavioral qualification gap)
- Glossary: Qualification, Qualification Record, Readiness, Hard gate, Restoration target, Promotion
