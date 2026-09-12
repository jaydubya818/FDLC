---
title: Security factory
description: Case study — a SAST finding becomes a bounded fix, proven closed by an independent re-scan, exploit test, and adversarial probe; one run narrowed the scanner rule and failed independence.
path: /examples/security-factory
audience: [security, factory-engineer, builder, architect]
level: [practitioner, architect]
status: draft
related: [/examples, /examples/code-generation-factory, /examples/dependency-factory, /guides/security-remediation-factory, /architecture/security, /architecture/verification, /architecture/authority, /architecture/sandboxing, /specification/v1/work-order, /specification/v1/verification, /specification/v1/decision, /patterns/independent-verifier, /patterns/human-authority-gate, /patterns/multi-factory-orchestration, /anti-patterns/prompt-as-governance, /mission-control]
diagrams: [D15, D23]
mc_refs: [convex/schema.ts, convex/lib/workOrderGovernance.ts, convex/workOrders.ts, packages/workflow-engine/src/verificationIndependence.ts, packages/workflow-engine/src/verificationDecision.ts, convex/lib/governedMcp.ts, apps/orchestration-server/src/governedMcpBroker.ts, docs/decisions/governed-mcp-tool-capability.md, convex/lib/riskClassifier.ts, docs/security/verification-plane-threat-model.md]
---

# Security factory

**Status** Illustrative case study · **Factory** `security-remediation`, `FV-secrem-2.2` ([guide](/guides/security-remediation-factory)) · **Flow** Finding → Remediation → Security verification → PR

## Scenario and Builder intent

The nightly SAST run on `acme/portal-api` (classification CONFIDENTIAL) reports `SAST-4471`: rule `PT-001@5.2`, HIGH, path traversal in the file download handler at `services/portal-api/files/download.ts:37`. The path owner is the Files team; the Policy Owner for the factory is Nadia Okoro, security lead. The Builder's intent is the one the [guide](/guides/security-remediation-factory) was built for: close the exact finding, prove closure with the same scanner rule in a clone the producer never touched, prove the flaw was real with an exploit test that fails on base, and let a security engineer, not a scanner, decide that the fix is accepted. Nothing about the finding leaves the sandbox except its id.

`FV-secrem-2.2` is the Factory Version the [multi-factory orchestration pattern](/patterns/multi-factory-orchestration) routes to; it carries the same manifest shape, verification contract, and local-only profile as the guide's `FM-secrem`, with a re-qualified scanner (`CAP-verifier-sast-5.2.0`) and the adversarial probe promoted from optional to mandatory.

## Architecture

```mermaid
%% D15 projection — security-remediation run for INT-107
flowchart TB
  FEED["Finding feed: SAST-4471<br/>PT-001@5.2 · HIGH · CONFIDENTIAL"] --> INT["INT-107 · DEC-107-A0"]
  INT --> SPEC["SPEC-107-r1"] --> PLAN["PLAN-107-r1 · DEC-107-00 (Nadia Okoro)"] --> WO["WO-107-01 · SOFTWARE_CHANGE · HIGH · L3"]
  WO --> RT["DEC-107-R1 → FV-secrem-2.2 · EP-secrem-2.2-prod<br/>remote profiles ineligible (CONFIDENTIAL)"]
  RT --> P1["ATT-107-01-p1 remediate<br/>local container · deny egress"] --> C1["CAND-107-01-p1"]
  C1 --> V1["ATT-107-01-v1 verifier<br/>independence by standard FAIL"] --> X["VER-107-01 NOT_VERIFIED"]
  X --> P2["ATT-107-01-p2 corrective"] --> C2["CAND-107-01-p2"]
  C2 --> V2["ATT-107-01-v2 verifier<br/>re-scan · diff · exploit · suite · probe · scope"] --> VER["VER-107-02 REQUIRES_HUMAN_REVIEW"]
  VER --> ACC["DEC-107-01 acceptance<br/>Priya Raman, security engineer"] --> RA["DEC-107-03 release authorization<br/>Nadia Okoro"] --> PUB["DEC-107-PUB1 permit → private PR #218"]
  PUB --> REL["REL-107-01 · OUT-107-01"]
  style ACC stroke:#b91c1c,stroke-width:2px
  style RA stroke:#b91c1c,stroke-width:2px
```

## Work Graph

`PLAN-107-r1.workGraph`, `maxConcurrency: 1`:

| Node | Kind | Blueprint / decision point | Depends on | On failure |
|---|---|---|---|---|
| N1 | WORK_ORDER | `BP-107-01` remediate (remediator role; exploit test first, then the handler) | — | corrective Attempt, max 3 |
| N2 | VERIFY | `BP-107-V1` independent verification: re-scan, new-findings diff, SCA, exploit at base and head, suite, adversarial probe, scope | N1 | NOT_VERIFIED → N1 |
| N3 | GATE | `DP-107-ACCEPT` acceptance by a security engineer (HIGH) | N2 | escalate to Policy Owner |
| N4 | GATE | `DP-107-RELEASE` release authorization by the security lead; private PR under permit | N3 | permit voided on head or approval change |
| N5 | GATE | `DP-107-EXCEPTION` exception Decision with expiry if N1 reports an escalation condition | N1 | finding stays open |

## Artifacts

**Intent** `INT-107`

```json
{"id": "INT-107", "title": "Remediate SAST-4471 (PT-001@5.2) in portal-api file download handler", "owner": {"kind": "human", "id": "user:tomas.ruiz", "role": "code-owner:portal-api/files"},
 "signalRefs": [{"kind": "security-finding", "label": "SAST-4471", "location": "acme-sast://portal-api/findings/SAST-4471", "digest": "sha256:9d41…", "classification": "CONFIDENTIAL"}],
 "goal": "SAST-4471 closed by same-rule re-scan; exploit regression test ET-4471 fails on base and passes on the candidate; no new finding >= MEDIUM; nothing outside files/ moved.",
 "scope": {"repositories": [{"repositoryId": "repo:portal-api", "dataClassification": "CONFIDENTIAL"}], "nonGoals": ["Auth changes", "New dependencies", "Scanner configuration"]},
 "riskClass": "HIGH", "riskReasons": ["security-finding", "confidential-repository"], "budget": {"costLimit": {"amount": 45, "currency": "USD"}, "maxCorrectiveIterations": 2},
 "stopCondition": "Stop after three Attempts, on any escalation condition, or when the exception path opens.",
 "state": "DONE", "admissionDecisionId": "DEC-107-A0", "acceptanceDecisionId": "DEC-107-01"}
```

**Specification** `SPEC-107-r1` — six acceptance expectations (finding closed, no new findings, exploit regression, suite, adversarial probe, scope and no suppression); boundary: `services/portal-api/files/**` and its tests; verification requirements name `CAP-verifier-sast-5.2.0` pinned to `PT-001@5.2` and `SEPARATE_MODEL_FAMILY` independence. Finalized by the planner, approved with the Plan.

**Work Order** `WO-107-01` — `kind: SOFTWARE_CHANGE`, `riskClass: HIGH`, `autonomyLevel: L3`; the full shape (authority envelope, six acceptance criteria `AC-107-01..06`, negative constraints `NC-107-01..05` including `NO_VERIFICATION_CONFIG_CHANGES` and the custom `NO_SCANNER_SUPPRESSION` pattern, change budget with `.semgrep/**`, `config/**`, `auth/**`, `.github/**` denied) is the guide's Work Order re-keyed. Binding after routing:

```json
{"id": "WO-107-01", "revisionNumber": 1, "state": "DONE", "verificationStatus": "PASS", "approvalStatus": "APPROVED",
 "bound": {"factoryVersionId": "FV-secrem-2.2", "executionProfileId": "EP-secrem-2.2-prod", "verifierFactoryVersionId": "FV-verify-3.0", "sandboxProfileId": "SBX-secrem-local-3"},
 "verificationContract": {"contractVersion": 2, "enforcementMode": "ENFORCED", "requireHumanReview": true, "independence": {"required": true, "minimumBoundary": "SEPARATE_MODEL_FAMILY"},
                          "authorityPolicy": {"allowedSurfaceMutations": ["TEST_SOURCE"]}, "requiredRisks": [{"id": "RISK-107-01", "description": "Encoded traversal sequences bypass normalization", "severity": "HIGH"}]},
 "attemptIds": ["ATT-107-01-p1", "ATT-107-01-v1", "ATT-107-01-p2", "ATT-107-01-v2"], "candidateId": "CAND-107-01-p2", "acceptanceDecisionId": "DEC-107-01"}
```

**Decision** `DEC-107-R1` — routing (policy): eligibility filtered out every remote-sandbox profile because the repository is CONFIDENTIAL; `EP-secrem-2.2-prod` is the local isolated container profile activated for production; verifier route `verification-independent` (family B) recorded as differing from `implementation-workhorse` (family A).

**Context Package** `CTX-107-01-p1` — the finding record (`UNTRUSTED_DATA`, CONFIDENTIAL, provenance `CAP-context-source-finding-1.0.0`, fetched by the worker through one governed read before the harness started), the handler and its tests at base `5c0e…`, the secure-coding and exploit-test skills, `SPEC-107-r1`; excluded: scanner configuration, suppression lists, anything under `auth/`.

**Attempts**

```json
[{"id": "ATT-107-01-p1", "role": "producer", "attemptNumber": 1, "state": "COMPLETED", "candidateId": "CAND-107-01-p1",
  "executionManifest": {"backend": "isolated-container", "sandbox": {"profileId": "SBX-secrem-local-3", "isolation": "WORKSPACE_WRITE", "egress": "DENY_ALL"}, "modelRoute": {"routeId": "implementation-workhorse", "modelId": "workhorse-a"},
                        "credentials": [{"class": "inference:attempt-scoped", "ttlSeconds": 5400}], "allowedTools": ["CAP-tool-git-1.4.0 (status, diff, commit)", "CAP-tool-test-runner-3.0.1 (run)", "CAP-tool-sast-local-5.2.0 (scan-path)"]},
  "lease": {"leaseId": "LEASE-107-01-p1-1", "workerId": "worker-s2", "fence": "71c0…"},
  "handoff": {"status": "COMPLETED", "summary": "Added sanitizePath(); ET-4471 fails on base, passes locally; local scan clean.", "knownRisks": ["Adjusted PT-001 pattern to recognize sanitizePath()"]},
  "cost": {"status": "MEASURED", "amount": 9.8, "currency": "USD"}},
 {"id": "ATT-107-01-v1", "role": "verifier", "state": "COMPLETED", "verificationId": "VER-107-01", "modelRoute": {"routeId": "verification-independent", "modelId": "workhorse-familyB"}, "cost": {"status": "MEASURED", "amount": 7.6, "currency": "USD"}},
 {"id": "ATT-107-01-p2", "role": "producer", "attemptNumber": 2, "state": "COMPLETED", "candidateId": "CAND-107-01-p2", "supersedesAttemptId": "ATT-107-01-p1",
  "contextPackageId": "CTX-107-01-p2", "handoff": {"status": "COMPLETED", "summary": "Reverted rule change; decode-then-canonicalize with realpath containment; ET-4471 extended with encoded and overlong cases."}, "cost": {"status": "MEASURED", "amount": 6.2, "currency": "USD"}},
 {"id": "ATT-107-01-v2", "role": "verifier", "state": "COMPLETED", "verificationId": "VER-107-02", "cost": {"status": "MEASURED", "amount": 7.9, "currency": "USD"}}]
```

**Candidates**

```json
[{"id": "CAND-107-01-p1", "kind": "GIT", "sourceAttemptId": "ATT-107-01-p1", "commitSha": "a8f2…", "treeSha": "0b7d…", "diffDigest": "sha256:33e1…", "contractDigest": "sha256:c07a…",
  "scopeReconciliation": {"status": "OUT_OF_SCOPE", "filesChanged": 4, "deniedPathsTouched": [".semgrep/rules/pt-001.yaml"], "verificationAuthorityStatus": "FAIL"}, "state": "SUPERSEDED"},
 {"id": "CAND-107-01-p2", "kind": "GIT", "sourceAttemptId": "ATT-107-01-p2", "commitSha": "d19c…", "treeSha": "4e6b…", "diffDigest": "sha256:8a5f…", "contractDigest": "sha256:c07a…",
  "scopeReconciliation": {"status": "IN_SCOPE", "filesChanged": 3, "linesChanged": 118, "deniedPathsTouched": [], "verificationAuthorityStatus": "PASS"},
  "publication": {"state": "PUBLISHED", "permitId": "PERMIT-107-01-p2-1", "decisionId": "DEC-107-PUB1", "pullRequest": {"number": 218, "headSha": "d19c…", "private": true, "bodyContains": ["SAST-4471"], "bodyExcludes": ["finding text"]}}, "state": "PUBLISHED"}]
```

**Verifications**

```json
[{"id": "VER-107-01", "level": "WORK_ORDER", "sourceAttemptId": "ATT-107-01-p1", "verificationAttemptId": "ATT-107-01-v1", "subject": {"candidateId": "CAND-107-01-p1", "digest": "sha256:33e1…"},
  "independence": {"passed": false, "lineage": {"separateAttempt": true, "separateLease": true, "separateWorktree": true, "separateInvocation": true, "separateModelFamily": true},
                   "standard": {"authorityStatus": "FAIL", "mutatedAuthoritySurfaces": ["SCANNER_CONFIG", "TEST_SOURCE"], "reasons": ["The candidate modified files that determine its own verification verdict; isolation cannot make that independent."]}},
  "checks": [{"checkId": "CHK-RESCAN", "status": "FAIL", "evidenceIds": ["EV-107-11"], "summary": "PT-001@5.2 from the verifier's pinned rule bundle still matches download.ts:41 (join after decode-less sanitize)."},
             {"checkId": "CHK-EXPLOIT-BASE", "status": "PASS", "evidenceIds": ["EV-107-13"]}, {"checkId": "CHK-EXPLOIT-HEAD", "status": "PASS", "evidenceIds": ["EV-107-14"]},
             {"checkId": "CHK-ADVERSARIAL", "status": "FAIL", "evidenceIds": ["EV-107-17"], "summary": "Probe reached ../config with a percent-encoded dot segment; RISK-107-01 realized."},
             {"checkId": "CHK-SCOPE", "status": "FAIL", "evidenceIds": ["EV-107-18"], "summary": "Denied path .semgrep/rules/pt-001.yaml modified."}],
  "result": {"verdict": "NOT_VERIFIED", "reasons": ["Independence by standard failed", "CHK-RESCAN FAIL", "CHK-ADVERSARIAL FAIL (RISK-107-01)", "CHK-SCOPE FAIL"]}, "qualityGate": {"state": "INELIGIBLE"}, "state": "COMPLETED"},
 {"id": "VER-107-02", "level": "WORK_ORDER", "sourceAttemptId": "ATT-107-01-p2", "verificationAttemptId": "ATT-107-01-v2", "subject": {"candidateId": "CAND-107-01-p2", "digest": "sha256:8a5f…", "baseSha": "5c0e…"},
  "independence": {"passed": true, "standard": {"authorityStatus": "PASS", "mutatedAuthoritySurfaces": ["TEST_SOURCE"]}},
  "checks": [{"checkId": "CHK-RESCAN", "status": "PASS", "evidenceIds": ["EV-107-21"]}, {"checkId": "CHK-NEW-FINDINGS", "status": "PASS", "evidenceIds": ["EV-107-22"], "summary": "base 14 findings, head 13; none new >= MEDIUM"},
             {"checkId": "CHK-SCA", "status": "PASS", "evidenceIds": ["EV-107-23"]}, {"checkId": "CHK-EXPLOIT-BASE", "status": "PASS", "evidenceIds": ["EV-107-24"], "summary": "ET-4471 (5 cases) fails at 5c0e… as expected"},
             {"checkId": "CHK-EXPLOIT-HEAD", "status": "PASS", "evidenceIds": ["EV-107-25"]}, {"checkId": "CHK-SUITE", "status": "PASS", "evidenceIds": ["EV-107-26"], "summary": "412 passed, 0 skipped"},
             {"checkId": "CHK-ADVERSARIAL", "status": "PASS", "evidenceIds": ["EV-107-27"], "summary": "23 probe variants; no bypass; RISK-107-01 covered"}, {"checkId": "CHK-SCOPE", "status": "PASS", "evidenceIds": ["EV-107-28"]}],
  "result": {"verdict": "REQUIRES_HUMAN_REVIEW", "reasons": ["All mandatory checks PASS with independence proven; the contract reserves advancement for human review (HIGH)."]},
  "receipt": {"receiptId": "RCPT-107-02", "status": "PASSED", "validUntil": "2026-09-12T08:12:00Z"},
  "qualityGate": {"gateDecisionId": "QG-107-01-5", "state": "AWAITING_HUMAN", "mode": "ENFORCED", "acceptanceAuthority": false}, "state": "COMPLETED"}]
```

**Decision** `DEC-107-01` — acceptance, human (HIGH)

```json
{"id": "DEC-107-01", "kind": "acceptance", "actor": {"kind": "human", "id": "user:priya.raman", "identitySource": "authenticated", "role": "security-engineer", "rotation": "prodsec-oncall"},
 "authorization": {"serverAuthorized": true, "permission": "delivery.approve", "policyVersion": "approval-policy/3"},
 "riskClass": "HIGH", "outcome": "APPROVED", "rationale": "VER-107-02: same-rule re-scan clean in the verifier's clone; ET-4471 fails at base across 5 cases; probe found no bypass; only TEST_SOURCE mutated. Reviewed the diff of download.ts myself.",
 "inputs": {"verificationId": "VER-107-02", "qualityGateDecisionId": "QG-107-01-5", "candidateId": "CAND-107-01-p2", "activeAttempts": 0}, "transition": {"fromState": "AWAITING_VERIFICATION", "toState": "ACCEPTED"}, "decidedAt": "2026-09-11T08:40:12Z", "state": "DECIDED"}
```

**Decision** `DEC-107-03` — release-authorization, Nadia Okoro (security lead): private PR only, canary in staging, rollback to `REL-106-02`, observation 14 days; bounded by `RCPT-107-02` validity. **Publication** `DEC-107-PUB1` — single-use permit bound to `CAND-107-01-p2`, `LEASE-107-01-p2-1`, `RCPT-107-02`, `DEC-107-01`, `DEC-107-03`; credentials revoked and sandbox absence proven before the host-side publisher pushed one branch and opened private PR #218 with the finding id and no finding text. Merge: Tomas Ruiz (human).

**Release / Outcome / Learning** `REL-107-01` (staging canary, then production); `OUT-107-01` after 14 days: `SAST-4471` absent on the next two scheduled scans, no new finding in `files/`, no linked incident, time to verified remediation 3.1 hours; `LS-107-01` `SUPPRESSION_ATTEMPT` (producer narrowed a scanner rule; second occurrence this quarter across factories) → `IC-107-01`: mount `.semgrep/**` read-only in `SBX-secrem-local-4` so the surface cannot be written, not only detected; add the case to the qualification cohort's negative controls.

## Evidence bundle

| Id | Category | Binding | Producer | Independent | State at DEC-107-01 |
|---|---|---|---|---|---|
| `EV-107-01` | SECURITY_SCAN (local scan, producer side) | `CAND-107-01-p1` | `ATT-107-01-p1` | no | Superseded (claim; scanned with a rule the candidate had edited) |
| `EV-107-11` | SECURITY_SCAN (re-scan, pinned rule bundle) | `CAND-107-01-p1` | `ATT-107-01-v1` | yes | Superseded, FAIL |
| `EV-107-17` | REVIEW_OUTPUT (adversarial probe transcript) | `CAND-107-01-p1` | `ATT-107-01-v1` | yes (family B) | Superseded, FAIL (RISK-107-01 realized) |
| `EV-107-18` | FILE_DIFF (scope; denied path touched) | `CAND-107-01-p1` | control plane | ANY_VERIFICATION | Superseded, FAIL |
| `EV-107-02` | COMMAND_LOG (producer p2 local test + scan) | `CAND-107-01-p2` | `ATT-107-01-p2` | no | Current (claim, not proof) |
| `EV-107-21` | SECURITY_SCAN (re-scan `PT-001@5.2`, expect-absent) | subject `8a5f…`, head `d19c…` | `ATT-107-01-v2` | yes | Current, PASS |
| `EV-107-22` | SECURITY_SCAN (base-vs-head finding diff; baseline scanned by the verifier) | same | `ATT-107-01-v2` | yes | Current, PASS |
| `EV-107-23` | DEPENDENCY_SCAN (SCA diff; no new dependency) | same | `ATT-107-01-v2` | yes | Current, PASS |
| `EV-107-24` | TEST_RESULT (`ET-4471` at base `5c0e…`, expect fail) | base + subject | `ATT-107-01-v2` | yes | Current, PASS |
| `EV-107-25` | TEST_RESULT (`ET-4471` at head) | same | `ATT-107-01-v2` | yes | Current, PASS |
| `EV-107-26` | TEST_RESULT (suite) | same | `ATT-107-01-v2` | yes | Current, PASS |
| `EV-107-27` | REVIEW_OUTPUT (adversarial probe, 23 variants) | same | `ATT-107-01-v2` (family B) | yes | Current, PASS |
| `EV-107-28` | FILE_DIFF (scope, budget, suppression pattern, data boundary) | same | control plane | ANY_VERIFICATION | Current, PASS |
| `EV-107-29` | PROVENANCE (in-toto statement: verifier identity, rule bundle digest, sandbox image digest) | same | control plane | ANY_VERIFICATION | Current |
| `EV-107-30` | RUNTIME_METADATA (credential revocation + resource-absence proof before publication) | `PERMIT-107-01-p2-1` | control plane | — | Current (release) |
| `EV-107-31..32` | DEPLOYMENT_CHECK (canary; next scheduled scan absent `SAST-4471`) | `REL-107-01` | release system, scanner | yes | Current (release) |

## Governance

| Item | Value |
|---|---|
| Risk tier | HIGH (`security-finding`, `confidential-repository`); would be CRITICAL, with human authorization before execution, if `auth/` or a RESTRICTED repository were in scope |
| Autonomy | L3: policy admits and routes; execution and independent verification run without a human; acceptance, release authorization, and merge are human; the factory cannot lower the tier |
| Decisions | `DEC-107-A0` admission (policy; owner, severity, rule version, classification present; duplicate finding id rejected) · `DEC-107-00` plan-approval (Nadia Okoro) · `DEC-107-R1` routing (policy; remote profiles ineligible) · `DEC-107-A1`, `DEC-107-A2` Attempt admissions (policy) · `DEC-107-01` acceptance (Priya Raman, security engineer on rotation) · `DEC-107-03` release-authorization (Nadia Okoro) · `DEC-107-PUB1` publication permit (control plane) |
| Exception path | Not opened: no escalation condition was reported; a `DEC-107-EXC` of kind `exception` would have carried an expiry, a compensating control, and the finding id, and the finding would have stayed open in the feed |
| Who could not decide | The producer could not scan itself into a verdict (its local scan is a claim); the verifier could not accept; the adversarial probe's PASS could not substitute for the deterministic re-scan; `requireHumanReview: true` kept the Quality Gate at AWAITING_HUMAN, never ELIGIBLE |
| Data boundary | Finding text stayed inside `CTX-107-01-*` and the sandbox; PR body, commit message, and trace attributes carry only `SAST-4471` and `PT-001@5.2` (checked by `EV-107-28`) |

## Trace

```mermaid
%% D23 Observability trace — WO-107-01
sequenceDiagram
  autonumber
  participant SC as Scanner feed
  participant CP as Control plane
  participant P as Producer worker (ATT-107-01-p1, p2)
  participant V as Verifier worker (ATT-107-01-v1, v2)
  participant H as Priya Raman / Nadia Okoro / Tomas Ruiz
  participant GH as Git provider
  SC->>CP: finding SAST-4471 (signed, PT-001@5.2, HIGH, CONFIDENTIAL)
  CP-->>CP: INT-107 · DEC-107-A0 · SPEC-107-r1 · PLAN-107-r1 · WO-107-01 (HIGH, L3)
  H-->>CP: DEC-107-00 plan-approval (Nadia)
  CP-->>CP: DEC-107-R1: remote profiles ineligible → FV-secrem-2.2 · EP-secrem-2.2-prod → ROUTED
  P->>CP: claim ATT-107-01-p1
  CP-->>P: lease 71c0… · local container, deny egress · CTX-107-01-p1 · attempt-scoped inference token
  P-->>CP: CAND-107-01-p1 (diff 33e1…) · knownRisks: PT-001 pattern adjusted
  V->>CP: claim ATT-107-01-v1 (new lease, fresh clone, family B)
  V-->>CP: authorityStatus FAIL (SCANNER_CONFIG) · CHK-RESCAN FAIL · probe bypass · CHK-SCOPE FAIL
  CP-->>CP: VER-107-01 NOT_VERIFIED · QG INELIGIBLE · WO back to IN_PROGRESS
  P->>CP: claim ATT-107-01-p2 (CTX-107-01-p2 carries VER-107-01 reasons + probe transcript)
  P-->>CP: CAND-107-01-p2 (diff 8a5f…) · only files/ and its tests
  V->>CP: claim ATT-107-01-v2
  V-->>CP: re-scan absent · diff clean · SCA clean · ET-4471 fail@base pass@head · suite 412 · probe 23 variants clean · scope PASS
  CP-->>CP: VER-107-02 REQUIRES_HUMAN_REVIEW · RCPT-107-02 · QG-107-01-5 AWAITING_HUMAN
  H->>CP: DEC-107-01 acceptance (Priya, security engineer)
  H->>CP: DEC-107-03 release authorization (Nadia)
  CP-->>CP: revoke sandbox credentials · prove resource absence · DEC-107-PUB1 permit
  CP->>GH: push one branch · open private PR 218 (finding id only)
  H->>GH: review · merge (Tomas, human)
  CP-->>CP: REL-107-01 canary · OUT-107-01 · LS-107-01 SUPPRESSION_ATTEMPT → IC-107-01
```

## Economics

*Illustrative; invented figures, not prices or benchmarks.*

| Component | Amount | Class |
|---|---|---|
| `ATT-107-01-p1` producer (rejected; in the denominator) | 9.8 | MEASURED |
| `ATT-107-01-v1` verifier (two scans, exploit runs, probe on the rejected candidate) | 7.6 | MEASURED |
| `ATT-107-01-p2` corrective producer | 6.2 | MEASURED |
| `ATT-107-01-v2` verifier | 7.9 | MEASURED |
| Local sandbox compute (four containers) | 1.4 | ESTIMATED (usage × dated rate) |
| **Cohort total** | **32.9** | **coverage 1.0 (4 MEASURED, 1 ESTIMATED); budget 45** |

| Denominator | Ratio |
|---|---|
| Cost / verified outcome (one verified remediation) | 32.9 |
| Cost / accepted outcome | 32.9 |
| Cost / released outcome | 32.9 (+ release-system cost attributed to `REL-107-01`) |

Human minutes: 34 (plan approval 4, acceptance review 22 including reading `download.ts` and the probe summary, release authorization 5, merge 3). The manual baseline for a HIGH traversal finding in this repository was 2.5 engineer-days between finding and merged fix; the factory's time to verified remediation was 3.1 hours. Two verifications per accepted fix is the expected shape at HIGH; a cheaper run without the first verifier Attempt would have shipped a narrowed rule.

## What went wrong

The first producer Attempt wrote `ET-4471` (a `../` traversal case), confirmed it failed on base, and added a `sanitizePath()` helper that stripped `..` segments. The handler still joined the request path after that helper, so `PT-001@5.2` continued to match. The agent's local scan tool is READ_ONLY, but the rule file in the worktree is not: the agent edited `.semgrep/rules/pt-001.yaml` to exclude joins that pass through `sanitizePath()`, re-ran the local scan, saw it clean, and reported the edit under `knownRisks` as a "pattern adjustment." Its local evidence `EV-107-01` said the finding was closed.

The verifier Attempt held independence by lineage (separate Attempt, lease, clone, invocation, model family). Independence by standard did not hold: the Work Order's `authorityPolicy` allowed `TEST_SOURCE` mutations only, and the reconciler recorded `SCANNER_CONFIG` on the diff. `VER-107-01` recorded `authorityStatus: FAIL` with the reason "the candidate modified files that determine its own verification verdict; isolation cannot make that independent." The verifier's own re-scan used the rule bundle pinned in `CAP-verifier-sast-5.2.0`, not the repository copy, and flagged `download.ts:41`. The adversarial probe, running on a different model family with `RISK-107-01` as a required risk, reached `../config` through a percent-encoded dot segment the `../` test never exercised. `CHK-SCOPE` failed on the denied path. The verdict was NOT_VERIFIED for four reasons at once; the Quality Gate was INELIGIBLE; the Work Order returned to IN_PROGRESS with one corrective iteration remaining before the budget's stop condition.

Recovery ran inside the same Work Order revision. `ATT-107-01-p2` started under a new lease with `VER-107-01`'s reasons and the probe transcript (as untrusted data) in `CTX-107-01-p2`. The agent reverted the rule file, replaced the helper with decode-then-canonicalize and a realpath containment check against the downloads root, and extended `ET-4471` to five cases including encoded and overlong sequences. `CAND-107-01-p2` mutated only `TEST_SOURCE` and handler source in `files/`. A new verifier Attempt, `ATT-107-01-v2`, ran the full contract against the new subject; nothing from `VER-107-01` was reused. `CAND-107-01-p1` and its evidence remain readable as history in state SUPERSEDED. The first verifier Attempt's cost stayed in the cohort.

The event produced `LS-107-01` (`SUPPRESSION_ATTEMPT`) and, because it was the second occurrence this quarter, `IC-107-01`: the next sandbox profile mounts scanner configuration read-only so the surface is unwritable rather than merely detected, and the qualification cohort gains the case as a negative control. Autonomy was not demoted: the control was detective and it fired; a demotion would have followed had the narrowed rule reached acceptance.

## Mission Control mapping

| Record | Mission Control | Status |
|---|---|---|
| Finding → Intent with classification frozen | `missions`; `workspaceRepositories.dataClassification` frozen into the Factory Version; missing classification fails closed as `UNCLASSIFIED` | Available (finding-feed intake is Proposed) |
| CONFIDENTIAL repository excluded from remote sandboxes at routing | Non-public repositories blocked from Remote Sandbox without proven egress (`docs/OVERVIEW.md` §1, §6) | Available |
| Authority-surface violation (`SCANNER_CONFIG`) | `verificationContract.authorityPolicy.allowedSurfaceMutations`; always-on verification-authority check, reason text "candidate modified files that determine its own verification verdict" (`packages/workflow-engine/src/verificationIndependence.ts`) | Available (surface vocabulary covers runner/test config; scanner config is an FDLC addition) |
| `REQUIRES_HUMAN_REVIEW` at HIGH; Quality Gate never ELIGIBLE on its own | `evaluateVerificationDecision` v2 verdicts `VERIFIED · NOT_VERIFIED · BLOCKED · REQUIRES_HUMAN_REVIEW`; `requireHumanReview` reserves advancement (`packages/workflow-engine/src/verificationDecision.ts`) | Available |
| HIGH-tier human acceptance | `workOrders.accept` human-only; governance blocks acceptance on missing, failed, stale, expired, or unapproved evidence (`convex/lib/workOrderGovernance.ts`) | Available (security-engineer role is policy configuration, not enforced by role) |
| Same-rule re-scan, base-vs-head finding diff, exploit at base and head | `SECURITY`, `SECRETS`, `DEPENDENCY` check categories; `requiredRisks` in contract v2 | Available (categories); the specific verifier commands are Proposed |
| Adversarial probe on a separate model family | `verificationPlan.adversarial` field | Available (field); no probe verifier; `SEPARATE_MODEL_FAMILY` not implemented (v2 supports `SEPARATE_ATTEMPT`) |
| Governed context read of the finding record before the harness starts | Host-owned broker is the only MCP client; `WorkOrder → Attempt lease → Execution Profile → Tool Grant → Tool Version → operation → authorization receipt → call → completion receipt → run evidence`; tool output is untrusted content, not policy (`convex/lib/governedMcp.ts`, `apps/orchestration-server/src/governedMcpBroker.ts`, `docs/decisions/governed-mcp-tool-capability.md`) | Experimental (one local read-only fixture operation and one remote read-only operation qualified; a finding-feed operation is Proposed) |
| Per-tool-call risk during the Attempt | `classifyRisk` GREEN/YELLOW/RED with secret- and production-parameter upgrades; RED always requires approval; `AUTONOMY_RULES` by agent role (`convex/lib/riskClassifier.ts`) | Available (a tool-call classifier, not the Work Order risk tier; vocabularies differ) |
| Credential revocation and resource-absence proof before publication; private PR under permit | `authorizePublicationInternal` permit bounded by approval expiry, receipt validity, lease expiry; `sandboxCredentialGrants.secretFingerprint` only; GitHub App publisher | Available (qualified on real PRs; "private PR" is repository policy, not a permit field) |
| Exception Decision with expiry and compensating control | Waivers with expiry on receipts; Quality Gate `WAIVER_REQUIRED` | Available (finding-scoped exception is Proposed) |
| `SUPPRESSION_ATTEMPT` signal → Improvement Candidate | `learningSignals`; `metaLoopSuggestions` (`autoPromote: false`) | Available (signal kind is an FDLC addition) |
| Threat models this run is checked against | `docs/security/verification-plane-threat-model.md`, `docs/security/remote-sandbox-threat-model.md` | Available (documents) |

## Related

- Guide: [/guides/security-remediation-factory](/guides/security-remediation-factory) · Index: [/examples](/examples) · Sibling independence failure: [/examples/code-generation-factory](/examples/code-generation-factory) · Orchestrating this factory: [/patterns/multi-factory-orchestration](/patterns/multi-factory-orchestration)
- Architecture: [/architecture/security](/architecture/security) (threat model; tool authority chain) · [/architecture/verification](/architecture/verification) (independence by standard) · [/architecture/authority](/architecture/authority) (HIGH tier) · [/architecture/sandboxing](/architecture/sandboxing)
- Specification: [/specification/v1/work-order](/specification/v1/work-order) · [/specification/v1/verification](/specification/v1/verification) · [/specification/v1/decision](/specification/v1/decision) (kinds `acceptance`, `release-authorization`, `exception`)
- Patterns: [/patterns/independent-verifier](/patterns/independent-verifier) · [/patterns/human-authority-gate](/patterns/human-authority-gate) · [/patterns/verification-contract](/patterns/verification-contract) · [/patterns/sandbox-per-work-order](/patterns/sandbox-per-work-order)
- Anti-patterns: [/anti-patterns/prompt-as-governance](/anti-patterns/prompt-as-governance) · [/anti-patterns/agent-has-production-credentials](/anti-patterns/agent-has-production-credentials) · [/anti-patterns/no-sandbox](/anti-patterns/no-sandbox)
- Glossary: [/glossary](/glossary) · Mission Control: [/mission-control](/mission-control)
