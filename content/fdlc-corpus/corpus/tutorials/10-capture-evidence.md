---
title: Capture Evidence
description: Read the evidence envelopes, receipts, and gate decisions WO-104-01 produced, map them to the six evidence states, and export EV-104-09 as a bound, in-toto-wrapped Evidence record.
path: /tutorials/capture-evidence
audience: [factory-engineer, security, builder, platform]
level: [practitioner]
status: draft
related: [/tutorials, /tutorials/execute-a-work-order, /tutorials/configure-approval-policy, /architecture/evidence, /architecture/verification, /architecture/observability, /patterns/evidence-bound-acceptance, /patterns/candidate-currentness, /anti-patterns/no-evidence-lineage, /specification/v1/evidence, /specification/v1/verification, /specification/v1/release, /specification/v1/outcome, /glossary]
diagrams: [D14, D23]
mc_refs: [convex/schema.ts, convex/workOrders.ts, convex/workflowRuns.ts, convex/lib/currentVerification.ts, packages/workflow-engine/src/verificationCurrentness.ts, docs/software-factory/verification-and-gate-state-machines.md, docs/software-factory/verification-receipt.md, convex/observability.ts, convex/factory/releases.ts, convex/lib/factoryRelease.ts, scripts/mc, docs/security/evidence-retention-policy.md]
---

# Capture Evidence

## Goal

Find every record the run in tutorial 09 produced, read it as evidence rather than as status, and export one record in the FDLC Evidence shape with its binding, integrity, validity, and provenance fields filled from the source records. At the end you have `EV-104-09` (the contract-test result for `CHK-104-TEST`), `VER-104-01` (the verification that cites it), and you can say, for each item, which of the six evidence states it is in and why.

Evidence proves what ran and what was observed. Verification judges it; a Decision applies authority. Evidence never accepts work ([/architecture/evidence](/architecture/evidence), D14).

## What you will have at the end

| Artifact | Id | Source records |
|---|---|---|
| Evidence (category `TEST_RESULT`) | `EV-104-09` (`state: CURRENT`, `result: PASS`) | `evidenceEnvelopes` row for `CHK-104-TEST`; `runArtifacts` (junit output) |
| Evidence (category `TOOL_CALL_RECEIPT`) | `EV-104-05` | `mcpToolCallReceipts` (tutorial 03) |
| Verification | `VER-104-01` | `verificationRuns` + `WORK_ORDER`-scope `verificationReceipts` + `qualityGateDecisions` |
| Evidence inventory for the Work Order | `evidence/WO-104-01/index.json` | Your factory repository |
| Release and Outcome stubs | `REL-104-01`, `OUT-104-01` | `factoryReleases`, `factoryOutcomeEvents` (Experimental/Partial) |

## Prerequisites

- Tutorial 09 complete through independent verification (a `WORK_ORDER`-scope receipt exists).
- Read access: `factory.read` and delivery read on the workspace.
- `jq` or equivalent to reshape JSON.

## Concepts

- Claim → Evidence → Verification → Decision → Authority (D14): [/architecture/evidence](/architecture/evidence).
- Six states (`MISSING · PENDING · CURRENT · STALE · CONFLICTING · SUPERSEDED`) on the currentness axis, independent of `result` on the observation axis: [/specification/v1/evidence](/specification/v1/evidence).
- Binding: subject identity, producer, independence, integrity, validity assumptions, provenance class.
- Observability trace as forensics, never as evidence (D23): [/architecture/observability](/architecture/observability).

**Mission Control status.** Evidence envelopes, receipts, run artifacts, run events, gate decisions, and the currentness function are Available (Qualified). Divergences: the six-state lifecycle is documented (`RECORDED → USABLE → STALE | SUPERSEDED | REVOKED | CONFLICTED`, `docs/software-factory/verification-and-gate-state-machines.md`) but is not a schema column (Planned; audit §5.8); Mission Control's `REVOKED` maps to `STALE` with `invalidatedBy`, `REJECTED` to `MISSING` with a reason; the in-toto/DSSE wrapper is Partial ("Supply-chain provenance — Strong partial"). Release and outcome records are Experimental/Partial.

## Steps

### 1. Pull the Work Order's evidence set

`workOrders:get` returns, in one read, `executionRuns`, `events`, `approvalDecisions`, `verificationReceipts`, `verificationRuns`, `evidenceEnvelopes`, `qualityGateDecisions`, `revisions`, `reopenDecisions`, `governanceStatus`, `acceptanceSummary`, `currentVerification`, and `reviewPackage` (`convex/workOrders.ts:1774-1870`).

```bash
npx convex run workOrders:get '{"workOrderId":"<workOrderId>"}' > evidence/WO-104-01/work-order.json
./scripts/mc run-events <workflowRunDocId>     > evidence/WO-104-01/producer-events.json
./scripts/mc run-artifacts <workflowRunDocId>  > evidence/WO-104-01/producer-artifacts.json
./scripts/mc run-artifacts <verifierRunDocId>  > evidence/WO-104-01/verifier-artifacts.json
```

UI equivalents: `/v2/control-work-orders` (evidence tab), `/v2/tasks` (Attempt inspection), `/v2/audit`.

### 2. Read one envelope as a bound record

An `evidenceEnvelopes` row carries the FDLC binding fields almost one-to-one (`convex/schema.ts:2850-2910`):

| FDLC Evidence field | Mission Control envelope field |
|---|---|
| `evidenceKey`, `checkId`, `category`, `result`, `criterionIds`, `requirementIds`, `riskIds` | `evidenceKey`, `checkId`, `category`, `result`, `acceptanceCriterionIds`, `requirementIds`, `requiredRiskIds` |
| `subject` (candidate, subject digest, contract digest, source Attempt, Work Order revision) | `candidateRevision`, `sourceRevision`, `verificationSubjectId`, `verificationSubjectDigest`, `verificationContractDigest`, `sourceAttemptId`, `workOrderRevisionNumber` |
| `producer` (actor, role, independent, Attempt, factory version, adapter, invocation) | `producer {actorType, actorId, role, independent, factoryPurpose, factoryDefinitionVersionId, attemptId, executorInvocationId, executorAdapter}` |
| `independence` | `independence` (the enumerated independence result) |
| `tool`, `artifacts[]` | `tool {name, version, command, exitCode, durationMs}`, `artifactIds[]`, `artifactReferences[]` |
| `integrity.contentDigest` | `contentHash` |
| `provenance.class` | `provenance: LIVE | SYNTHETIC | DEMO | IMPORTED | LEGACY` |
| `validity` | Receipt-level: `validUntil`, `invalidatedAt`, `invalidatedByRevisionId`, `invalidatedByReopenDecisionId`, `invalidationReason` on `verificationReceipts` |

Select the envelope for the contract-test check:

```bash
jq '.evidenceEnvelopes[] | select(.checkId=="CHK-104-TEST")' evidence/WO-104-01/work-order.json
```

Confirm `producer.independent: true`, `producer.factoryPurpose: VERIFICATION`, `producer.attemptId` ≠ the producer Attempt, and `provenance: LIVE`. Only `LIVE` evidence counts toward acceptance (`convex/lib/currentVerification.ts`); `SYNTHETIC` is what the deterministic qualification proof emits, and it is fenced out of production currentness by design.

### 3. Determine the evidence state

**FDLC step; Mission Control status: Planned (no state column).** Derive the state from the records:

| State | Derivation from Mission Control |
|---|---|
| `MISSING` | A check in `workOrder.verificationContract.checks[]` has no envelope for the current revision |
| `PENDING` | A verifier Attempt is `RUNNING` and the verification run is not `COMPLETED` |
| `CURRENT` | The `WORK_ORDER`-scope receipt is `PASSED`, `validUntil` is in the future, `invalidatedAt` is absent, and `currentVerification.eligible` is true for this candidate |
| `STALE` | `./scripts/mc stale-evidence <workOrderId>` (`workOrders:listStaleEvidence`) lists it; or the receipt is `STALE` / invalidated by a revision, reopen, or head move |
| `SUPERSEDED` | A later receipt exists for the same slot on a newer candidate; the old one is retained |
| `CONFLICTING` | Two valid contemporaneous envelopes disagree on the same check; Mission Control's gate reports `UNKNOWN` and a human must resolve (Risk Review is an FDLC construct) |

Currentness is decided before any verdict is read: the newest candidate and its newest exact-bound verification are chosen; there is no fallback to an older pass (`packages/workflow-engine/src/verificationCurrentness.ts`).

```bash
./scripts/mc governance <workOrderId>         # workOrders:governanceValidity — validity, expiry, stale summary
./scripts/mc stale-evidence <workOrderId>
./scripts/mc expired-approvals <workOrderId>
```

### 4. Export the Evidence record

**FDLC step; Mission Control status: Partial (no in-toto wrapper).** Compose `EV-104-09` from the envelope, the receipt, and the artifact. Illustrative digests; take real values from your records.

```json
{
  "schemaVersion": "1.0", "type": "fdlc://v1/evidence", "id": "EV-104-09",
  "namespace": "https://acme.example/factories/checkout",
  "evidenceKey": "WO-104-01:1:CHK-104-TEST:AC-104-01",
  "category": "TEST_RESULT", "checkId": "CHK-104-TEST", "criterionIds": ["AC-104-01"], "requirementIds": ["REQ-104-03"], "riskIds": ["RISK-104-01"],
  "subject": {"kind": "CANDIDATE", "candidateId": "CAND-104-01-01", "subjectDigest": "<verificationSubjectDigest>", "commitSha": "<candidateSha>", "treeSha": "<treeSha>", "diffDigest": "sha256:…", "contractDigest": "<verificationContractDigest>", "sourceAttemptId": "ATT-104-01-p1", "workOrderId": "WO-104-01", "workOrderRevisionNumber": 1},
  "producer": {"actor": {"kind": "service", "id": "<producer.actorId>", "identitySource": "workload-identity"}, "role": "verifier", "independent": true, "attemptId": "ATT-104-01-v1", "factoryVersionId": "FV-review-1.0", "factoryPurpose": "VERIFICATION", "executorInvocationId": "<producer.executorInvocationId>", "leaseId": "<verifier run lease>", "adapterId": "<producer.executorAdapter>", "verifierCapabilityId": "CAP-verifier-test-runner-3.0.1"},
  "independence": {"policyVersion": "policy-v2", "passed": true, "reasons": [], "sourceAttemptId": "ATT-104-01-p1", "verificationAttemptId": "ATT-104-01-v1"},
  "result": "PASS",
  "summary": "CT-* and IT-* suites: 212 passed, 0 failed, 0 skipped.",
  "tool": {"name": "pnpm", "version": "9.0.0", "command": ["pnpm","test","--filter","checkout-api","--","--grep","CT-|IT-"], "exitCode": 0, "durationMs": 418000},
  "artifacts": [{"artifactId": "<runArtifactId>", "kind": "junit", "mediaType": "application/xml", "digest": "sha256:…"}],
  "integrity": {"contentDigest": "<envelope.contentHash>", "signature": {"format": "none"}},
  "validity": {"observedAt": "<recordedAt>", "validUntil": "<receipt.validUntil>", "assumptions": ["SUBJECT_HEAD", "WORK_ORDER_REVISION", "VERIFICATION_CONTRACT", "ENVIRONMENT_DIGEST", "VALIDITY_WINDOW"], "staleReasons": []},
  "provenance": {"class": "LIVE", "traceRefs": [{"traceId": "<trace>", "spanId": "<span>"}], "executionManifestDigest": "<verifier run manifest digest>", "executionProfileDigest": "<EP-review-1.0-prod digest>", "receiptPacketDigest": "<receipt.decisionInputDigest>"},
  "attestation": {"statementType": "https://in-toto.io/Statement/v1", "predicateType": "https://fdlc.ai/attestation/evidence/v1", "subjects": [{"name": "CAND-104-01-01", "digest": {"sha256": "<verificationSubjectDigest without prefix>", "gitCommit": "<candidateSha>", "gitTree": "<treeSha>"}}], "statementDigest": "sha256:…", "envelopeFormat": "none"},
  "state": "CURRENT",
  "recordedAt": "<recordedAt>", "createdBy": {"kind": "service", "id": "svc:control-plane", "identitySource": "workload-identity"}
}
```

Signing (`signature.format: dsse`, a `transparencyLogRef`) is recommended for cross-boundary exchange and proves issuer and integrity, not truth; a signed fabricated result is still fabricated. Tutorial 15 adds a signing step.

### 5. Export the Verification record

`VER-104-01` bundles the verifier Attempt, the frozen plan, the receipt, and the gate decision:

| FDLC Verification field | Mission Control source |
|---|---|
| `subject` (frozen Verification Subject) | `workflowRuns.verificationSubject` on the producer run |
| `plan` (frozen Verification Plan digest) | `verificationRuns[].verificationPlan` / `verificationPlanDigest` |
| `verifierAttemptId` | `verificationReceipts[].verificationAttemptId` |
| `checks[]` with status | `verificationReceipts[].checks[]` (`PASS | FAIL | SKIPPED | NOT_CONFIGURED | ERROR`) |
| `result` | `verdict` (`VERIFIED | NOT_VERIFIED | BLOCKED | REQUIRES_HUMAN_REVIEW`) |
| `independence` | `independenceValid` + `independence` on the envelope |
| `receipt` | `status`, `validUntil`, `decisionInputDigest`, `evidenceEnvelopeIds[]` |
| `qualityGate` | `qualityGateDecisions[0]` (`ELIGIBLE | INELIGIBLE | UNKNOWN | STALE | WAIVER_REQUIRED | AWAITING_HUMAN`), `evidenceSetDigest`, `mode` |
| `currentness` | `currentVerification` (eligible, reasons, evaluated at) |

### 6. Record release and outcome stubs

FDLC steps 8–9 (Release, Observe) produce `REL-104-01` and `OUT-104-01`. Mission Control's `factoryReleases` state machines are staging `MERGED → DEPLOYED → VERIFIED | ROLLED_BACK` and production `ELIGIBLE → DEPLOYED → VERIFIED → PROMOTED` with evidence kinds `MERGE, DEPLOYMENT_APPROVAL, DEPLOYMENT, PROVENANCE, SMOKE_TEST, HEALTH_CHECK, ROLLBACK, PRODUCTION_*`; production eligibility requires at least three verified staging releases (`convex/lib/factoryRelease.ts`). Merge is human and outside V1 authority (Experimental/Partial).

```bash
npx convex run factory/releases:reconcileMergedPullRequest '{...}'      # after a human merges; records MERGE evidence
npx convex run factory/releases:recordStagingDeployment '{...}'         # DEPLOYED with deployment evidence
npx convex run factory/releases:verifyStagingDeployment '{...}'         # VERIFIED with smoke/health evidence
npx convex run factory/releases:listForProject '{"projectId":"<projectId>"}'
```

Argument shapes are in `convex/factory/releases.ts`; they bind the release to the exact merged head and require deployment approval fields. Outcome events (`factoryOutcomeEvents`, stages `VERIFICATION_PASSED … PRODUCTION_VERIFIED | INCIDENT | ROLLED_BACK`) and projections (`accepted-outcome-economics/v2`, `costCoverage`, `confidence`) are the Observe surface; cost stays `null` where unmeasured.

### 7. Store and retain

Keep the exported set under `evidence/WO-104-01/` with an `index.json` listing every id, its Mission Control row id, `contentHash`, state, and `validUntil`. Mission Control's retention policy is `docs/security/evidence-retention-policy.md`; the manifest's `evidence.retentionDays: 730` is the FDLC declaration. Traces from `/v2/trace-inspector` (`observability:getTraceDetail`) are forensics; keep their ids in `provenance.traceRefs`, never as evidence.

## Verify

| Check | How |
|---|---|
| Every mandatory check has `LIVE` evidence | For each `verificationContract.checks[].mandatory === true` there is an envelope with `result: PASS`, `provenance: LIVE`, `producer.independent: true` |
| Binding is exact | Envelope `verificationSubjectDigest`, `verificationContractDigest`, `sourceAttemptId`, `workOrderRevisionNumber` equal the producer run's subject and the Work Order's current revision |
| Receipt cites the envelopes | `verificationReceipts[].evidenceEnvelopeIds` contains the envelope id; `decisionInputDigest` present |
| Currentness holds | `currentVerification.eligible: true`; `mc stale-evidence` returns nothing |
| Staleness is derived, not set | Request a Work Order revision (`./scripts/mc request-revision <id> '<patch>'`) and re-check: affected receipts are invalidated with `invalidatedByRevisionId`; `mc stale-evidence` lists them; nothing was manually flagged |
| Exported record validates | `EV-104-09` validates against `https://fdlc.ai/schemas/v1/evidence.schema.json` |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `provenance: SYNTHETIC` on all envelopes | The run used the deterministic qualification path | Expected for synthetic qualification; it cannot satisfy production currentness |
| `result: NOT_CONFIGURED` | Verifier or command unavailable at run time | Fix the check; unavailable mandatory checks never pass |
| Receipt `PASSED` but gate `INELIGIBLE` | Head moved, revision changed, approval expired, or independence failed | Read `currentVerification.reasons`; re-verify the new exact subject |
| Two envelopes disagree for one check | Different candidates or verifier runs | Currentness keeps the newest exact-bound one; if both are current and contradictory, raise governance, never average |
| `costStatus: UNKNOWN` on tool receipts, `actualCost.status: UNAVAILABLE` on runs | Provider does not report cost under this harness | Leave it; unknown cost cannot support an efficiency claim |
| You want to treat green CI as evidence | CI is provider evidence (`CI_RESULT`) about the PR head; it is not the verifier's receipt | Both are recorded; acceptance requires the exact-bound receipt |

## Next tutorial

[Configure approval policy](/tutorials/configure-approval-policy) — who may decide what, at which risk tier, with this evidence in front of them.

## Related

- Spec: [/specification/v1/evidence](/specification/v1/evidence) · [/specification/v1/verification](/specification/v1/verification) · [/specification/v1/candidate](/specification/v1/candidate) · [/specification/v1/release](/specification/v1/release) · [/specification/v1/outcome](/specification/v1/outcome)
- Architecture: [/architecture/evidence](/architecture/evidence) (D14) · [/architecture/verification](/architecture/verification) · [/architecture/observability](/architecture/observability) (D23) · [/architecture/economics](/architecture/economics)
- Patterns: [/patterns/evidence-bound-acceptance](/patterns/evidence-bound-acceptance) · [/patterns/candidate-currentness](/patterns/candidate-currentness) · Anti-patterns: [/anti-patterns/no-evidence-lineage](/anti-patterns/no-evidence-lineage), [/anti-patterns/no-outcome-metrics](/anti-patterns/no-outcome-metrics)
- Mission Control: `docs/software-factory/verification-and-gate-state-machines.md`; `docs/software-factory/verification-receipt.md`; `docs/security/evidence-retention-policy.md`; ledger rows "Supply-chain provenance — Strong partial", "Release and production feedback — Partial"
- Glossary: Evidence, Receipt, Envelope, Currentness, Provenance class, Quality Gate
