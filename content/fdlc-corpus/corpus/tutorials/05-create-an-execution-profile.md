---
title: Create an Execution Profile
description: Register and qualify EP-depmod-1.0-prod, the admitted composition of model route, harness, runtime artifact, backend, sandbox, and tool grant that every Attempt freezes.
path: /tutorials/create-an-execution-profile
audience: [factory-engineer, platform, security]
level: [practitioner]
status: draft
related: [/tutorials, /tutorials/configure-a-model-route, /tutorials/define-verification-rules, /tutorials/create-a-factory-version, /specification/v1/execution-profile, /specification/v1/capability-manifest, /architecture/sandboxing, /architecture/execution-vocabulary, /patterns/sandbox-per-work-order, /patterns/lease-based-worker, /anti-patterns/no-sandbox, /glossary]
diagrams: [D11, D25]
mc_refs: [convex/factory/executionProfiles.ts, convex/lib/executionProfile.ts, convex/lib/executionProfileAdmission.ts, convex/lib/executionManifest.ts, convex/factory/configuration.ts, docs/decisions/execution-profile-identity.md, docs/architecture/generic-harness-contract-v1.md, docs/architecture/remote-sandbox-execution.md, docs/software-factory/worker-runtime-operations.md, packages/workflow-engine/src/harnessManifests.ts]
---

# Create an Execution Profile

## Goal

Freeze one exact execution composition for the dependency-modernization factory: the qualified model route from tutorial 04, the `codex/v1` harness and its runtime artifact, the execution backend, the sandbox policy, the isolation modes, and the tool grant from tutorial 03. Register it disabled, qualify it for a workload and risk scope with an expiry, and confirm that nothing at dispatch time can substitute a different composition.

An Execution Profile exists so that dispatch never assembles an arbitrary product of model, harness, runtime, and backend at run time ([/specification/v1/execution-profile](/specification/v1/execution-profile)). It is subordinate to a Factory Version: no active pointer, no routing authority.

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Execution Profile | `EP-depmod-1.0-prod` (`profileKey: prod`, `profileVersion: 1`, admission `PRODUCTION_PILOT_ELIGIBLE`) | `factories/dependency-modernization/execution-profiles/prod.yaml`; Mission Control `factoryExecutionProfiles` row with `profileDigest` and `qualificationDigest` |
| Optional offline profile | `EP-depmod-1.0-offline-qual` (`backend: isolated-container`, inference denied) | Same |
| Manifest declaration | `execution_profiles[]`, `runtime`, `sandbox`, `network_policy`, `credential_policy` sections in `FM-depmod` | `manifest.yaml` |

## Prerequisites

- Tutorials 03 and 04 complete (a current Tool Grant and a promoted route whose `compatibility` names `codex/v1` on `persistent-worker`).
- An operator with `factory.automation.manage` and `factory.approve`.
- For `remote-sandbox`: a Sandbox Profile with readiness evidence (`factory/configuration:createSandboxProfile`). The tutorial uses `persistent-worker` (a local worktree on the worker host) because it needs no provider.

## Concepts

- Execution Profile fields, admission lifecycle `DISABLED → OFFLINE_ELIGIBLE | PRODUCTION_PILOT_ELIGIBLE → REVOKED` (Mission Control) and the FDLC additions `PRODUCTION_ELIGIBLE`, `EXPIRED`: [/specification/v1/execution-profile](/specification/v1/execution-profile).
- Harness Manifest, prohibited authorities, required external controls: [/specification/v1/capability-manifest](/specification/v1/capability-manifest) (kind `harness`); [/architecture/execution-vocabulary](/architecture/execution-vocabulary).
- Sandbox requirements (D25): [/architecture/sandboxing](/architecture/sandboxing); [/patterns/sandbox-per-work-order](/patterns/sandbox-per-work-order).

**Mission Control status: Implemented, gated (Experimental).** `factoryExecutionProfiles` rows are immutable, digested, registered disabled, qualified by a single-use reviewed receipt, and revocable; the Factory Version freezes the profile row id, key, version, snapshot, digest, and qualification digest; every Attempt freezes them again into `factory-execution-manifest/v3` (`docs/software-factory/worker-runtime-operations.md`, "Execution Profile v40 rollout"). There is no UI for registering or qualifying a profile; the Factory configuration panel only selects an already qualified one. Registration order differs from the specification's numbering: Mission Control registers the profile before the Factory Version that will reference it.

## Steps

### 1. Choose the harness and read its manifest

FDLC requires a harness to declare its capabilities truthfully and to lack six authorities. Mission Control's known manifests are constants (`packages/workflow-engine/src/harnessManifests.ts`); `codex/v1` is the only one with `admission.maturity: PRODUCTION`. Read it before you pin it:

| Field | `codex/v1` value | Consequence |
|---|---|---|
| `identity` | harness `codex-cli` 0.146.0, adapter `codex` `v1`, `effectiveConfigSha256` over the frozen CLI configuration | Any change is a new adapter identity |
| `admission.executionBackends` | `persistent-worker`, `remote-sandbox` | `isolated-container` uses the `isolated-invocation` adapter instead |
| `admission.prohibitedAuthorities` | worker-leases, verification-subjects, verification-plans, evidence-authority, github-publication, acceptance | The harness cannot self-verify or publish |
| `admission.requiredExternalControls` | canonical-worker-lease, mission-control-sandbox-policy, repository-scope-reconciliation, independent-verification, publication-permit | Mission Control supplies these around the harness |
| `git.remotePublication` | `UNSUPPORTED` | The sandbox never pushes its own branch |
| `tools.mcp` | `UNSUPPORTED` | Tools reach the agent only through the host broker (tutorial 03) |
| `telemetry.cost`, `telemetry.modelRequests`, `telemetry.retries` | `UNSUPPORTED` | These stay `null`; never invented |
| Runtime artifact | `harness-runtime-artifact/v1`, kind `EXECUTABLE`, `codex` 0.146.0, executable SHA-256 | A different executable is a different admitted runtime |

DeepSeek (`deepseek-harness/0.2.0`) is Experimental, default off, persistent-worker only, with a full installation-tree closure digest; Fab and Bedrock adapters are Experimental. Registering a harness not in the known list requires the complete frozen manifest and runtime bytes (`registerVersion`, "External harness registration requires complete frozen manifest and runtime identity bytes").

### 2. Declare runtime, sandbox, network, and credential policy in the manifest

**FDLC step; Mission Control status: Partial (sandbox policy lives on `factorySandboxProfiles`; network and credential policy on the profile snapshot and harness manifest; no single policy identities).**

```yaml
runtime:
  backend: persistent-worker
  harness: {capabilityId: CAP-harness-codex-adapter-1.0.0, kind: harness, versionConstraint: "1.0.x"}
  artifactConstraint: EXECUTABLE
  leaseDurationMs: 300000
  checkpointPolicy: STEP
sandbox:
  isolation: WORKSPACE_WRITE
  provider: worker-host
  filesystem: WORKTREE_ONLY
  processIsolation: true
  resourceLimits: {maxRuntimeMs: 5400000}
  publicIngress: false
  resourceAbsenceRequiredBeforePublication: true
network_policy: {egress: RESTRICTED_ALLOWLIST, allowlist: [registry.acme.example, gateway.acme.example], classificationGated: true}
credential_policy: {classes: [inference:attempt-scoped], scoping: ATTEMPT_SCOPED, longLivedInSandbox: false, publicationIdentityInSandbox: false, revokeBeforePublication: true}
execution_profiles:
  - {key: prod, description: Local worktree on the canonical worker; workhorse route; production-pilot eligible., backend: persistent-worker, autonomyCeiling: L3, environments: [staging, production], modelRouteId: implementation-workhorse}
  - {key: offline-qual, description: Deterministic isolated container used only for qualification., backend: isolated-container, autonomyCeiling: L2, environments: [qualification]}
```

`publicIngress: false`, `publicationIdentityInSandbox: false`, and `revokeBeforePublication: true` are schema constants; a manifest that says otherwise does not validate. Mission Control enforces the same three at the sandbox and permit boundary ("The sandbox never pushes its own branch", `docs/architecture/remote-sandbox-execution.md`; `credentialsRevokedBeforePublication` and `resourceAbsenceRequiredBeforePublication` asserted in `convex/lib/executionManifest.ts`).

### 3. Register the profile (disabled)

FDLC requires registration to be descriptive and disabled. Mission Control (`convex/factory/executionProfiles.ts:70-277`):

```bash
npx convex run factory/executionProfiles:registerVersion '{"projectId":"<projectId>","profileKey":"prod","registrationIdempotencyKey":"ep:depmod:prod:1","executor":{"adapter":"codex","version":"v1"},"executionBackend":"persistent-worker","modelCatalogId":"<modelCatalogId>","toolGrantId":"<toolGrantId>","isolationModes":["WORKSPACE_WRITE"]}'
```

What the mutation checks before inserting: the route is a workspace route with `routeSnapshot`, `routeDigest`, `qualificationSnapshot`, `qualificationDigest`; the route's qualification `compatibility` equals this harness tuple (adapter, version, manifest digest, effective config digest, runtime artifact digest, backend); a `remote-sandbox` backend has one current production-pilot-eligible Sandbox Profile and a `persistent-worker` backend has none; the tool grant is `ACTIVE`, unexpired, and byte-current. It then builds the immutable snapshot (`factory-execution-profile/v1`), computes `profileDigest`, and inserts with `enabled: false`, `qualificationStatus: UNQUALIFIED`, `admissionStatus: DISABLED`. The result is `{executionProfileId, created}`.

Read it back and keep the digest:

```bash
npx convex run factory/executionProfiles:get '{"executionProfileId":"<executionProfileId>"}'
```

The response is `{profile, eligible: false, blockers: ["EXECUTION_PROFILE_DISABLED", …], validUntil}`. Blockers other than disabled/unqualified/qualification-missing mean a component is not admissible and qualification will refuse.

For the offline qualification profile (`EP-depmod-1.0-offline-qual`), register with `executionBackend: isolated-container`, `executor: {adapter: isolated-invocation, version: "2"}`, no `modelCatalogId`, no `toolGrantId`, and a `sandboxProfileId` from `factory/configuration:registerIsolatedSandboxProfile` followed by `promoteSandboxProfile`. Inference is denied by construction; this is the composition the canonical synthetic admission proof used (`docs/testing/evidence/context-skills-factory-admission-v1/README.md`).

### 4. Qualify the profile for a scope

FDLC requires admission only through a Qualification Record with scope and expiry. Mission Control's `qualify` binds a single-use reviewed receipt to the exact `profileDigest`; the scope must stay within the route's qualification scope and, for sandboxed backends, within the Sandbox Profile's admission scope (`convex/factory/executionProfiles.ts:280-394`).

```bash
npx convex run factory/executionProfiles:qualify '{"executionProfileId":"<executionProfileId>","expectedProfileDigest":"<profileDigest>","qualificationIdempotencyKey":"ep:depmod:prod:1:qual","evidenceReference":"docs/testing/evidence/system-factory-e2e-v2/README.md","evidenceDigest":"sha256:<sha256 of that file>","workloadClasses":["SOFTWARE_CHANGE"],"riskClasses":["GREEN","YELLOW"],"validUntil":<epoch ms>}'
```

The result is `{executionProfileId, profileDigest, qualificationDigest}`; the row becomes `enabled: true`, `EVIDENCE_QUALIFIED`, `PRODUCTION_PILOT_ELIGIBLE` (or `OFFLINE_ELIGIBLE` for isolated-container), with `qualificationExpiresAt`. A revoked profile cannot be requalified; register a new version.

### 5. Write the Execution Profile document

**FDLC step; Mission Control status: Partial.** The Mission Control row carries the composition and admission; FDLC adds `autonomyCeiling`, `resourceLimits`, `policyIdentities`, `requiredHarnessCapabilities` with minimum support levels, and a reference to a Qualification Record instead of an embedded snapshot. The full instance is on the specification page; the binding block is:

```yaml
id: EP-depmod-1.0-prod
factoryVersionId: FV-depmod-1.0            # assigned in tutorial 07
profileKey: prod
profileVersion: 1
backend: persistent-worker
harness: {capabilityId: CAP-harness-codex-adapter-1.0.0, harnessId: codex-cli, harnessVersion: 0.146.0, adapterId: codex, adapterVersion: v1, capabilityManifestDigest: "<from Mission Control row>", effectiveConfigDigest: "<row>", runtimeArtifact: {kind: EXECUTABLE, digest: "<row>"}}
modelRoute: {routeId: implementation-workhorse, capabilityId: CAP-model-route-workhorse-a-2.0.0, routeDigest: "<row>", qualificationDigest: "<row>", inferenceMode: ALLOWED}
capabilityImplementations:
  - {capabilityId: CAP-tool-package-registry-1.2.0, kind: tool, operations: [resolve-version, audit], grantId: GRANT-depmod-registry-3, grantDigest: "<row.toolGrantDigest>", grantExpiresAt: "<grant expiry>"}
requiredHarnessCapabilities:
  - {capability: filesystem.changedFileCapture, minimumSupport: SUPPORTED}
  - {capability: git.commit, minimumSupport: SUPPORTED}
  - {capability: headless.support, minimumSupport: SUPPORTED}
  - {capability: cancellation.support, minimumSupport: PARTIAL}
autonomyCeiling: L3
resourceLimits: {maxCost: {amount: 25, currency: USD}, maxRuntimeMinutes: 90, maxAttempts: 3}
admission: {status: PRODUCTION_PILOT_ELIGIBLE, qualificationStatus: EVIDENCE_QUALIFIED, qualificationRecordId: QR-ep-depmod-prod-01, qualificationDigest: "<row.qualificationDigest>", scopes: [{workloadClass: dependency-upgrade, environment: staging, riskTier: MEDIUM, autonomyLevel: L3}], expiresAt: "<row.qualificationExpiresAt>"}
immutable: true
digest: "<row.profileDigest>"
x-mission-control: {executionProfileId: "<executionProfileId>"}
```

## Verify

| Check | How |
|---|---|
| Profile is registered, immutable, and disabled before qualification | `factory/executionProfiles:get` after step 3 shows `admissionStatus: DISABLED`; a second `registerVersion` with the same idempotency key returns `created: false` and the same id; the same key with different args is rejected |
| Digest is reproducible | `qualify` with a wrong `expectedProfileDigest` fails with "digest does not match the reviewed immutable identity" |
| Profile is admitted for the intended scope | After step 4, `get` shows `eligible: true`, `blockers: []`, `validUntil` equal to `qualificationExpiresAt`, `admissionStatus: PRODUCTION_PILOT_ELIGIBLE` |
| The tool grant is frozen in | `profile.toolGrantId` and `profile.toolGrantDigest` equal tutorial 03's values; `profile.immutableSnapshot.toolGrant` exists |
| The profile has no authority of its own | It has no active pointer and cannot be dispatched; `factory/configuration:createVersion` (tutorial 07) is the only consumer |
| Scope discipline | `qualify` with a `riskClasses` value the route was not promoted for fails with "must remain within its exact admitted execution scope" |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `Execution Profile model route is not qualified for the exact harness, runtime artifact, and backend.` | The route's `compatibility` (tutorial 04 step 4) names a different adapter, digest, or backend | Promote a route qualification revision for this tuple, or register the profile with the matching tuple |
| `Remote Execution Profiles require one exact Sandbox Profile; persistent profiles cannot attach one.` | `sandboxProfileId` mismatch with backend | Omit it for `persistent-worker`; supply a current one for `remote-sandbox` |
| `Execution class and inference/tool authority do not match.` | Offline profile given a route or grant, or online profile without a route | Offline: no route, no grant. Online: a route is required |
| `Execution Profile components are not currently admissible (…)` at qualify | Route, sandbox, or grant expired or revoked between register and qualify | Fix the component, register a new profile version |
| Worker refuses to claim (tutorial 09) with a profile/qualification digest reason | The worker's advertised adapter, manifest digest, config digest, runtime artifact, or backend differs from the frozen profile | Never substitute; install the exact runtime the profile froze, or register a new profile |
| Qualification expired | `qualificationExpiresAt` passed | Register and qualify a new version; expiry is never extended in place |

## Next tutorial

[Define verification rules](/tutorials/define-verification-rules) — the verification contract the Factory Version pins beside this profile.

## Related

- Spec: [/specification/v1/execution-profile](/specification/v1/execution-profile) · [/specification/v1/capability-manifest](/specification/v1/capability-manifest) (harness) · [/specification/v1/attempt](/specification/v1/attempt) (frozen execution manifest)
- Architecture: [/architecture/sandboxing](/architecture/sandboxing) (D25) · [/architecture/execution-vocabulary](/architecture/execution-vocabulary) · [/architecture/factory-versioning](/architecture/factory-versioning) (D11)
- Patterns: [/patterns/sandbox-per-work-order](/patterns/sandbox-per-work-order) · [/patterns/lease-based-worker](/patterns/lease-based-worker) · Anti-pattern: [/anti-patterns/no-sandbox](/anti-patterns/no-sandbox)
- Mission Control: `docs/decisions/execution-profile-identity.md`; `docs/architecture/generic-harness-contract-v1.md`; `docs/software-factory/worker-runtime-operations.md`; ledger rows "Codex harness — Production admission", "DeepSeek harness — Experimental; default off", "Remote Sandbox — Production-pilot eligible; Preview"
- Glossary: Execution Profile, Harness, Runtime artifact, Execution backend, Admission
