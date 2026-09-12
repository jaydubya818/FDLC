---
title: Define Verification Rules
description: Author the VC-depmod verification contract — criterion classes mapped to verifier capabilities, independence rules, authority surfaces — and bind the verifiers Mission Control will run.
path: /tutorials/define-verification-rules
audience: [factory-engineer, security, builder]
level: [practitioner]
status: draft
related: [/tutorials, /tutorials/create-an-execution-profile, /tutorials/create-a-factory-version, /tutorials/capture-evidence, /architecture/verification, /architecture/evidence, /patterns/verification-contract, /patterns/independent-verifier, /patterns/candidate-currentness, /anti-patterns/self-verifying-agent, /specification/v1/work-order, /specification/v1/verification, /specification/v1/factory-manifest, /glossary]
diagrams: [D15, D32]
mc_refs: [docs/software-factory/verification-first-domain-contracts.md, docs/software-factory/verification-and-gate-state-machines.md, docs/software-factory/verification-first-workorder-contract.md, convex/lib/workOrderSpecificationValidators.ts, convex/lib/missionWorkOrderContract.ts, convex/context/verifiers.ts, convex/context/changeRisk.ts, convex/governancePolicies.ts, packages/workflow-engine/src/verificationIndependence.ts, packages/workflow-engine/src/verificationCurrentness.ts, packages/cli/src/commands/workOrder.ts]
---

# Define Verification Rules

## Goal

Decide, before any code exists, how every acceptance criterion the dependency-modernization factory accepts will be proven, by which verifier, with what independence, and which files the producer may never touch because they determine its own verdict. At the end you have a factory-level verification contract (`VC-depmod`) the Factory Version pins by digest, the per-Work-Order contract shape it compiles into, and the verifier records Mission Control requires before a Factory Version is ready.

Verification makes work eligible; it never accepts it. Only `PASS` satisfies a mandatory check ([/architecture/verification](/architecture/verification)).

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Factory verification contract | `VC-depmod` version 2 (a `PolicyDigest` the Factory Version pins) | `factories/dependency-modernization/verification/contract.yaml`; `verification` section of `FM-depmod` |
| Verifier Capability Manifests | `CAP-verifier-test-runner-3.0.1`, `CAP-verifier-dependency-scan-1.7.0`, `CAP-verifier-static-rules-2.2.0`, `CAP-verifier-scope-reconciler-1.0.0` | `factories/dependency-modernization/capabilities/verifier-*.yaml` |
| Mission Control verifiers | `<verifierId>` rows (`contextVerifiers`) | `context/verifiers:create` |
| Work Order contract template | `verificationContract` v2, `enforcementMode: ENFORCED` | Compiled at Plan approval (tutorial 09) or passed to `workOrders:create` |
| Change-risk and governance policies | `changeRiskPolicies` v1; `governancePolicies` "verification-first v1" | Mission Control |

## Prerequisites

- Tutorial 01 complete. Tutorials 02–05 are not required, but the verifiers you bind here appear in the Factory Version in tutorial 07.
- Test, dependency-scan, and lint commands that run from a clean checkout of your repository without interactive input.
- An operator with `factory.improve` (verifiers), `factory.approve` (change-risk policy), and `workspaces.manage` (governance policy).

## Concepts

- Verification hierarchy Task → Work Order → Objective → Release and the independence rule (D15): [/architecture/verification](/architecture/verification).
- The non-collapsible boundary (D32): execution complete ≠ verified ≠ current-gate eligible ≠ accepted ≠ merged ≠ released.
- Evidence categories and states: [/architecture/evidence](/architecture/evidence), [/specification/v1/evidence](/specification/v1/evidence).
- Contract shape on the Work Order: [/specification/v1/work-order](/specification/v1/work-order) (`verificationContract`); Verification artifact: [/specification/v1/verification](/specification/v1/verification).
- Patterns: [/patterns/verification-contract](/patterns/verification-contract), [/patterns/independent-verifier](/patterns/independent-verifier), [/patterns/candidate-currentness](/patterns/candidate-currentness). Anti-pattern: [/anti-patterns/self-verifying-agent](/anti-patterns/self-verifying-agent).

**Mission Control status: Available.** The Work Order verification contract (v1 and v2), the independence evaluator (`verificationIndependence.ts`), the currentness function (`verificationCurrentness.ts`), receipts, evidence envelopes, and Quality Gate Decisions are Qualified (ledger row "Independent verification and Quality Gates"). Divergences: Mission Control v2 `independence.minimumBoundary` is only `SEPARATE_ATTEMPT` (FDLC adds `SEPARATE_FACTORY`, `SEPARATE_MODEL_FAMILY`); FDLC adds the `ANALYSIS` verification method and `PERFORMANCE`/`ACCESSIBILITY` check categories; a factory-level contract as one manifest section is Partial; verifier calibration with measured false-success and false-failure rates is Proposed.

## Steps

### 1. List the criterion classes the factory accepts

Start from the outcome contract in `FM-depmod`, not from the tools you have. For a dependency upgrade the specification's worked example settles on four criterion classes:

| Criterion class | What must be true | Evidence category | Independence |
|---|---|---|---|
| `behavior-preserved` | Contract and integration suites pass on the exact candidate in a clean verifier worktree | `TEST_RESULT` | `INDEPENDENT_REQUIRED` |
| `dependency-graph` | No v3 artifacts remain, no new dependencies were added | `DEPENDENCY_SCAN` | `INDEPENDENT_REQUIRED` |
| `no-shims` | No compatibility shim imports (static rule) | `STATIC_ANALYSIS` | `INDEPENDENT_REQUIRED` |
| `scope` | Protected paths untouched; change budget respected | `FILE_DIFF` | `ANY_VERIFICATION` |

Every required criterion must map to at least one evidence category, and every mandatory check to a verifier capability; "absence of an enforced contract cannot be presented as verified" (`docs/software-factory/verification-first-domain-contracts.md`).

### 2. Write the factory-level contract

**FDLC step; Mission Control status: Partial.** This section becomes `verification` in `FM-depmod` and is digested as `VC-depmod` for the Factory Version.

```yaml
# factories/dependency-modernization/verification/contract.yaml — VC-depmod v2
verification:
  contract:
    - {criterionClass: behavior-preserved, verifierCapabilityId: CAP-verifier-test-runner-3.0.1,     evidenceCategory: TEST_RESULT,     mandatory: true, independence: INDEPENDENT_REQUIRED}
    - {criterionClass: dependency-graph,   verifierCapabilityId: CAP-verifier-dependency-scan-1.7.0, evidenceCategory: DEPENDENCY_SCAN, mandatory: true, independence: INDEPENDENT_REQUIRED}
    - {criterionClass: no-shims,           verifierCapabilityId: CAP-verifier-static-rules-2.2.0,    evidenceCategory: STATIC_ANALYSIS, mandatory: true, independence: INDEPENDENT_REQUIRED}
    - {criterionClass: scope,              verifierCapabilityId: CAP-verifier-scope-reconciler-1.0.0, evidenceCategory: FILE_DIFF,      mandatory: true, independence: ANY_VERIFICATION}
  independence: {required: true, minimumBoundary: SEPARATE_FACTORY, verifierFactoryName: verification-factory}
  levels: [WORK_ORDER, RELEASE]
  currentnessRule: newest-candidate-newest-exact-verification
evidence:
  requiredCategories: [TEST_RESULT, DEPENDENCY_SCAN, STATIC_ANALYSIS, FILE_DIFF, COMMAND_LOG, PROVENANCE]
  statementFormat: in-toto/v1
  retentionDays: 730
  traceContext: w3c-traceparent
```

`risk_class: HIGH` (tutorial 01) forces `independence.required: true` and, for a producer factory, `minimumBoundary: SEPARATE_FACTORY`. Mission Control proves `SEPARATE_ATTEMPT` today and separates producer and verifier by factory purpose (`SOFTWARE` vs `VERIFICATION`, tutorial 12); FDLC states the boundary explicitly.

### 3. Write the verifier manifests

**FDLC step; Mission Control status: Partial (verifier rows exist; measured error rates do not).** A verifier is a Capability Manifest of kind `verifier` with `acceptanceAuthority: false`. One example:

```yaml
# CAP-verifier-test-runner-3.0.1 (excerpt)
kind: verifier
name: test-runner
version: 3.0.1
spec:
  verifierType: COMMAND
  checkCategories: [INTEGRATION_TEST, CONTRACT_TEST]
  evidenceCategories: [TEST_RESULT]
  independenceClass: SEPARATE_ATTEMPT
  deterministic: true
  calibration: {suiteId: SUITE-verifier-test-runner-01, falseSuccessRate: null, falseFailureRate: null}   # measured during Qualify
  acceptanceAuthority: false
```

The `scope-reconciler` verifier is the one Mission Control performs itself: change budget and negative constraints are enforced against the approved base and the committed candidate, never against executor narration.

### 4. Register the verifiers in Mission Control

FDLC requires every mandatory check to name a verifier capability. Mission Control requires a Factory Version to bind at least one active workspace verifier (readiness check `verifiers`, `convex/factory/configuration.ts`). Verifiers are `contextVerifiers` rows: a label, an invariant statement, and glob patterns (`convex/context/verifiers.ts`; permission `factory.improve`).

```bash
npx convex run context/verifiers:create '{"projectId":"<projectId>","label":"Behavior preserved (contract and integration suites)","invariant":"CT-* and IT-* suites pass with 0 failures and 0 skipped on the exact candidate in a clean verifier worktree.","globPatterns":["services/checkout-api/**"],"idempotencyKey":"verifier:depmod:behavior-preserved"}'
npx convex run context/verifiers:create '{"projectId":"<projectId>","label":"No v3 artifacts and no new dependencies","invariant":"acme-depscan --fail-on acme-payments-sdk@3 --fail-on-new exits 0.","globPatterns":["services/checkout-api/package.json","services/checkout-api/pnpm-lock.yaml"],"idempotencyKey":"verifier:depmod:dependency-graph"}'
npx convex run context/verifiers:create '{"projectId":"<projectId>","label":"No compatibility shims","invariant":"acme-lint --rule DEP-V3-IMPORT reports zero findings.","globPatterns":["services/checkout-api/**/*.ts"],"idempotencyKey":"verifier:depmod:no-shims"}'
```

`context/verifiers:generateFromSkill` creates an adherence verifier from a published skill in one call; useful for `lockfile-hygiene`. Record each returned `<verifierId>`; tutorial 07 passes them as `verifierIds`.

### 5. Define the Work Order contract template

FDLC requires each Work Order to carry an executable `verificationContract` compiled from the factory contract and the Plan. Mission Control compiles it at Plan approval from the blueprint's `implementationPolicy.independentVerification` (`convex/lib/missionWorkOrderContract.ts`): one mandatory check `mission:independent-verification`, a required risk `mission:exact-candidate-integrity`, `independence.required: true`, `minimumBoundary: SEPARATE_ATTEMPT`, and three default negative constraints (`NO_PRODUCTION_ACCESS`, `NO_PLAINTEXT_SECRETS`, `NO_VERIFICATION_CONFIG_CHANGES`). A richer contract can be passed explicitly to `workOrders:create` (`convex/lib/workOrderSpecificationValidators.ts`, `verificationContractV2Validator`).

```json
{
  "schemaVersion": 2,
  "enforcementMode": "ENFORCED",
  "checks": [
    {"id": "CHK-104-TEST",  "name": "Contract and integration tests", "category": "INTEGRATION_TEST", "verifierId": "<verifierId behavior-preserved>", "mandatory": true, "acceptanceCriterionIds": ["AC-104-01"], "evidenceCategory": "TEST_RESULT",     "command": {"executable": "pnpm", "args": ["test", "--filter", "checkout-api", "--", "--grep", "CT-|IT-"], "commandClass": "TEST", "timeoutMs": 1200000}},
    {"id": "CHK-104-DEP",   "name": "Dependency scan",                "category": "DEPENDENCY",       "verifierId": "<verifierId dependency-graph>",   "mandatory": true, "acceptanceCriterionIds": ["AC-104-02"], "evidenceCategory": "STATIC_ANALYSIS", "command": {"executable": "acme-depscan", "args": ["--fail-on", "acme-payments-sdk@3", "--fail-on-new"], "commandClass": "DEPENDENCY_SCAN", "timeoutMs": 300000}},
    {"id": "CHK-104-SA",    "name": "Static analysis for v3 imports", "category": "POLICY",           "verifierId": "<verifierId no-shims>",           "mandatory": true, "acceptanceCriterionIds": ["AC-104-03"], "evidenceCategory": "STATIC_ANALYSIS", "command": {"executable": "acme-lint", "args": ["--rule", "DEP-V3-IMPORT"], "commandClass": "LINT", "timeoutMs": 300000}},
    {"id": "CHK-104-SCOPE", "name": "Change budget and protected paths", "category": "CHANGE_BUDGET", "verifierId": "factory-command/v1",             "mandatory": true, "acceptanceCriterionIds": ["AC-104-04"], "evidenceCategory": "FILE_DIFF"}
  ],
  "requiredRisks": [{"id": "RISK-104-01", "description": "v4 idempotency-key header semantics.", "severity": "MEDIUM", "source": "WORK_ORDER", "requiredEvidenceIds": ["CHK-104-TEST"]}],
  "requireHumanReview": false,
  "independence": {"required": true, "minimumBoundary": "SEPARATE_ATTEMPT"},
  "authorityPolicy": {"allowedSurfaceMutations": ["PACKAGE_MANIFEST", "LOCKFILE"], "reason": "The upgrade must edit the manifest and lockfile; runner, CI, and test config remain frozen."}
}
```

Mission Control's evidence category enum has no `DEPENDENCY_SCAN`; use `STATIC_ANALYSIS` there and keep `DEPENDENCY_SCAN` in the FDLC manifest, which is the divergence noted on the Work Order page.

### 6. Declare the authority surfaces

The `authorityPolicy` block is the rule that makes independence more than process separation: a candidate that modifies files determining its own verdict (test config, runner config, CI config, test sources) cannot be independently verified no matter how isolated the verifier is (`packages/workflow-engine/src/verificationIndependence.ts`, "the candidate modified files that determine its own verification verdict; isolation cannot make that independent"). Allow only the surfaces the work must touch; here `PACKAGE_MANIFEST` and `LOCKFILE`. Pair it with the negative constraint `NO_VERIFICATION_CONFIG_CHANGES` and `NO_TEST_REMOVAL`.

### 7. Activate the change-risk and governance policies

FDLC requires evidence validity conditions and re-verification rules to be declared. Mission Control (Available):

```bash
npx convex run context/changeRisk:upsertPolicy '{"projectId":"<projectId>","name":"depmod change risk v1","strictness":70,"rules":[{"id":"auth","label":"Authorization code requires a human","requireHuman":true,"globPatterns":["services/checkout-api/auth/**"]},{"id":"schema","label":"Schema changes require a human","requireHuman":true,"globPatterns":["services/checkout-api/schema/**"]}]}'
npx convex run governancePolicies:activateVerificationFirstV1 '{"projectId":"<projectId>"}'
```

The verification-first profile sets approval validity by risk (LOW 14 days, MEDIUM 7, HIGH 3, CRITICAL 1), verification validity 7 days, re-approval after material change, re-verification after code, workflow, or environment change, and full reopen when an accepted Work Order changes (`convex/governancePolicies.ts`). These are the validity assumptions that make evidence `STALE` later.

## Verify

| Check | How |
|---|---|
| Every criterion maps to a verifier and an evidence category | Walk the table in step 1 against step 5; no check lacks `verifierId` or `evidenceCategory` |
| Verifiers exist and are active | `npx convex run context/verifiers:list '{"projectId":"<projectId>","activeOnly":true}'` lists the three plus any skill-derived ones |
| Policies are active | `context/changeRisk:getActivePolicy` and `governancePolicies:getActiveForProject` return your rows |
| The contract validates | `workOrders:create` with the contract from step 5 succeeds in a scratch Mission (or wait for tutorial 09, where Plan approval compiles it) |
| Inspecting a Work Order shows the checks | Build the Node CLI once (`pnpm --filter @mission-control/cli build`), then `node packages/cli/dist/index.js work-order inspect <workOrderId>` prints each check with `Required: yes` and `Status: NOT RUN` before any verifier Attempt (`packages/cli/src/commands/workOrder.ts`). This Node `mc` is distinct from the `scripts/mc` shell CLI |
| Authority surfaces are minimal | `authorityPolicy.allowedSurfaceMutations` contains nothing a verifier reads to decide |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `Select at least one active workspace verifier.` at readiness (tutorial 08) | No `verifierIds` on the version | Step 4, then pass ids to `createVersion` |
| `Mutating Mission WorkOrders require a fully specified independent verification and change budget policy` at Plan approval | Blueprint lacks `implementationPolicy.independentVerification`, `maxFilesChanged`, or `maxLinesChanged` | Fill the blueprint (tutorial 09 step 3) |
| Verdict `NOT_VERIFIED` with reason `NOT_CONFIGURED` | A mandatory check's command is missing or its verifier is unavailable | Required unavailable checks return `NOT_CONFIGURED` and never pass; fix the command |
| Verdict `BLOCKED` | Change budget, negative constraint, or authority-surface violation | Read the receipt violations; the candidate touched a denied path or a verdict-determining file |
| Independence failed although a separate verifier ran | Lineage isolation passed but the standard failed (candidate modified test config, or verifier relied on candidate-shaped artifacts) | Tighten `authorityPolicy`; do not widen it to make the check pass |
| Green CI on the pull request but the gate is `INELIGIBLE` | CI is provider evidence; the exact-current gate also needs the verifier receipt, head match, and unexpired validity | See [/patterns/candidate-currentness](/patterns/candidate-currentness) |

## Next tutorial

[Create a Factory Version](/tutorials/create-a-factory-version) — pin `VC-depmod`, the verifiers, the profile, the skills, and the tools into one immutable composition.

## Related

- Spec: [/specification/v1/work-order](/specification/v1/work-order) · [/specification/v1/verification](/specification/v1/verification) · [/specification/v1/evidence](/specification/v1/evidence) · [/specification/v1/factory-manifest](/specification/v1/factory-manifest) (`verification`)
- Architecture: [/architecture/verification](/architecture/verification) (D15) · [/architecture/evidence](/architecture/evidence)
- Patterns: [/patterns/verification-contract](/patterns/verification-contract) · [/patterns/independent-verifier](/patterns/independent-verifier) · [/patterns/candidate-currentness](/patterns/candidate-currentness) · Anti-pattern: [/anti-patterns/self-verifying-agent](/anti-patterns/self-verifying-agent)
- Mission Control: `docs/software-factory/verification-first-domain-contracts.md`; `docs/software-factory/verification-and-gate-state-machines.md`; `packages/workflow-engine/src/verificationIndependence.ts`; ledger row "Independent verification and Quality Gates — Qualified"
- Glossary: Verification contract, Verifier, Independence, Currentness, Quality Gate, Authority surface
