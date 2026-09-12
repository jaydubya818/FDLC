---
title: Configure a Model Route
description: Register an exact model route, qualify it for a workload and risk scope against one harness tuple, and declare the logical routes the factory will use.
path: /tutorials/configure-a-model-route
audience: [factory-engineer, platform, architect]
level: [practitioner]
status: draft
related: [/tutorials, /tutorials/add-a-tool, /tutorials/create-an-execution-profile, /patterns/model-routing, /anti-patterns/model-lock-in, /anti-patterns/frontier-model-everywhere, /anti-patterns/cheapest-model-everywhere, /architecture/routing, /architecture/economics, /specification/v1/capability-manifest, /enterprise/model-gateway, /glossary]
diagrams: [D10, D22]
mc_refs: [docs/architecture/execution-routing-v1.md, docs/decisions/model-route-runtime-identity-separation.md, convex/modelCatalog.ts, convex/lib/modelRouteAdmission.ts, convex/modelRoutingPolicies.ts, convex/executionRouting.ts, packages/workflow-engine/src/harnessManifests.ts, apps/mission-control-ui/src/ModelRoutingView.tsx, scripts/prepare-phase4-mcp-qualification.mjs]
---

# Configure a Model Route

## Goal

Declare the logical model routes the dependency-modernization factory uses, register one exact provider route for the implementation role, and qualify that route for a workload class and risk scope bound to an exact harness, runtime artifact, and execution backend. At the end the factory has a route the Execution Profile (tutorial 05) can pin by digest, and you have seen why a model route is an inference identity, not an execution composition.

Models are replaceable execution resources; the factory is more durable than the model inside it ([/framework/principles](/framework/principles), design principle 9).

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Logical routes in the manifest | `architecture-reasoning`, `implementation-workhorse`, `verification-independent` | `model_routes[]` in `FM-depmod` |
| Capability Manifest, kind `model-route` | `CAP-model-route-workhorse-a-2.0.0` | `factories/dependency-modernization/capabilities/model-route-workhorse-a.yaml` |
| Exact route (Mission Control) | `<modelCatalogId>` with `routeDigest` (`factory-model-route/v2`) and `qualificationDigest` (`factory-model-route-qualification/v2`) | `modelCatalog` |
| Routing policy | version 1, mode `ADVISORY` | `modelRoutingPolicies` |

## Prerequisites

- Tutorial 01 complete; tutorial 03 recommended (the Execution Profile needs both).
- An operator with `factory.automation.manage` (registration, policy) and `factory.approve` (promotion).
- A provider route you are allowed to use. The tutorial uses the repository's own qualified example, the `codex/v1` adapter advertising `openai/gpt-5.6-terra` (`packages/workflow-engine/src/harnessManifests.ts`), because it is the only harness with Production admission. Substitute your own provider and model id; the shape is the same.

## Concepts

- Three-level routing and the Capability Router (D10): [/architecture/routing](/architecture/routing).
- The four-part identity: Model Route + Harness + Runtime Artifact + Execution Backend. A valid route cannot authorize a different harness; a valid harness cannot authorize an unqualified route (`docs/architecture/execution-routing-v1.md`, "Identity and qualification").
- Cost per accepted outcome and route economics (D22): [/architecture/economics](/architecture/economics).
- Anti-patterns this prevents: [/anti-patterns/model-lock-in](/anti-patterns/model-lock-in), [/anti-patterns/frontier-model-everywhere](/anti-patterns/frontier-model-everywhere), [/anti-patterns/cheapest-model-everywhere](/anti-patterns/cheapest-model-everywhere).

**Mission Control status.** Exact route registration and human promotion are Available (`convex/modelCatalog.ts`). Routing policies and the execution-tuple router are Implemented, gated: `ADVISORY` by default, `PINNED` per Work Order, and `GUARDED_AUTO` disabled behind the `execution-routing.guarded-auto` flag (`README.md`, "Guarded Auto is disabled"). Mission Control has no logical route object; a catalog row is one exact provider route plus one immutable qualification instance.

## Steps

### 1. Declare the logical routes

FDLC routes work by role and tier, then binds each logical route to qualified providers. **FDLC step; Mission Control status: not implemented (no logical route id).** Add to `FM-depmod`:

```yaml
model_routes:
  - routeId: architecture-reasoning
    role: PLAN
    tier: FRONTIER
    qualifiedProviders: [acme-gateway/frontier-a]
  - routeId: implementation-workhorse
    role: IMPLEMENT
    tier: WORKHORSE
    qualifiedProviders: [acme-gateway/workhorse-a, acme-gateway/workhorse-b]
    constraints: [temperature<=0.2]
  - routeId: verification-independent
    role: VERIFY
    tier: WORKHORSE
    qualifiedProviders: [acme-gateway/workhorse-b]
    independentFromProducer: true
```

The four canonical route names are `architecture-reasoning`, `implementation-workhorse`, `transformation-small`, `verification-independent`. The specification's worked example spells the implementation route `implement-workhorse`; treat that as an alias of `implementation-workhorse`. `verification-independent` lists only providers that are not the producer's, which is one of the two ways independence is proven ([/architecture/verification](/architecture/verification)).

### 2. Register an exact route

FDLC requires each qualified provider behind a logical route to be a Capability Manifest of kind `model-route` with `provider`, `modelId`, `routeDigest`, reasoning config, and runtime identity. Mission Control implements an inference-only identity, `factory-model-route/v2`: provider, provider route, model id, and bounded reasoning configuration, digested (`convex/lib/modelRouteAdmission.ts`). It deliberately contains no harness, executable, or image identity.

```bash
npx convex run modelCatalog:registerExactRoute '{"projectId":"<projectId>","provider":"openai","providerRoute":"openai","modelId":"gpt-5.6-terra","displayName":"Implementation workhorse A","tier":"BALANCED","capabilities":["text","code"],"supportsTools":true,"contextWindow":200000,"reasoningConfig":{"temperature":0.1,"maxTokens":16000}}'
npx convex run modelCatalog:list '{"projectId":"<projectId>"}'      # read routeDigest for the new row
```

The row starts `enabled: false`, `qualificationStatus: UNQUALIFIED`, `admissionStatus: DISABLED`, `availability: UNAVAILABLE`. Registration records identity only. The same route bytes registered twice reuse the in-flight draft; a row that already carries qualification is never reused or mutated.

### 3. Compute the compatibility tuple

Route qualification binds the exact harness the route was reviewed with. Take the digests from the known manifests:

```bash
node -e '
import("@mission-control/workflow-engine/harness-contract").then(m => {
  console.log(JSON.stringify({
    adapter: "codex", version: "v1",
    capabilityManifestDigest: m.harnessCapabilityManifestDigest(m.CODEX_V1_HARNESS_MANIFEST),
    effectiveConfigSha256: m.CODEX_V1_HARNESS_MANIFEST.effectiveConfigSha256,
    runtimeArtifactDigest: m.harnessRuntimeArtifactDigest(m.CODEX_V1_RUNTIME_ARTIFACT),
    executionBackend: "persistent-worker"
  }, null, 2));
})'
```

This is what `scripts/prepare-phase4-mcp-qualification.mjs` does before promoting a route. If you change the harness, adapter version, effective configuration, executable digest, or backend later, this route's qualification no longer admits the new tuple; a route qualified with a different runtime artifact is a different qualification ([/specification/v1/execution-profile](/specification/v1/execution-profile), invariants).

### 4. Qualify (promote) the route for a scope

FDLC requires qualification to be scoped (workload class × environment × risk tier × autonomy level) and evidence-backed. Mission Control's `promoteExactRoute` binds an evidence reference and digest, `workloadClasses[]` (uppercase identifiers), `riskClasses[]` (`GREEN|YELLOW|RED`), optional `repositoryIds[]`, and the compatibility tuple; it requires `factory.approve`; it is immutable once recorded (`convex/modelCatalog.ts:287-428`).

```bash
npx convex run modelCatalog:promoteExactRoute '{"modelCatalogId":"<modelCatalogId>","expectedRouteDigest":"<routeDigest>","evidenceReference":"docs/testing/evidence/production-execution-admission-foundation-v1/final-validation.md","evidenceDigest":"sha256:<sha256 of that file>","workloadClasses":["SOFTWARE_CHANGE"],"riskClasses":["GREEN","YELLOW"],"repositoryIds":["<repositoryId>"],"compatibility":{"adapter":"codex","version":"v1","capabilityManifestDigest":"<from step 3>","effectiveConfigSha256":"<from step 3>","runtimeArtifactDigest":"<from step 3>","executionBackend":"persistent-worker"}}'
```

`RED` (FDLC HIGH/CRITICAL) requires an auditable `costPolicy` bound to an approved Work Order and an explicit repository scope; the tutorial's scope stops at `YELLOW`. Mission Control's three risk classes map to FDLC's four as GREEN → LOW, YELLOW → MEDIUM, RED → HIGH and CRITICAL; the specification keeps four because CRITICAL is never auto-routed.

To re-qualify the same route for a different scope later, call `modelCatalog:registerQualificationRevision` with the promoted row as source; it creates a new disabled row with the same `routeDigest` rather than editing the promoted one.

### 5. Write the model-route Capability Manifest

**FDLC step; Mission Control status: Partial (the catalog row carries identity and qualification but not the manifest envelope).**

```yaml
# factories/dependency-modernization/capabilities/model-route-workhorse-a.yaml — CAP-model-route-workhorse-a-2.0.0 (excerpt)
kind: model-route
name: workhorse-a
version: 2.0.0
capabilities: [implementation-workhorse]
provenance: {contentDigest: "<routeDigest from Mission Control>"}
permissions: {required: [inference:invoke], credentialClasses: [inference:attempt-scoped], networkDestinations: [gateway.acme.example], filesystem: NONE, maxSideEffectClass: READ_ONLY}
security: {scanStatus: NOT_APPLICABLE, injectionSafetyReviewed: true}
qualification:
  status: EVIDENCE_QUALIFIED
  records: [{qualificationRecordId: QR-route-workhorse-a-01, digest: "<qualificationDigest>", scope: "SOFTWARE_CHANGE; GREEN,YELLOW; codex/v1 persistent-worker", expiresAt: "2026-12-10T00:00:00Z"}]
spec:
  provider: acme-gateway
  modelId: workhorse-a
  tier: WORKHORSE
  routeDigest: "<routeDigest>"
  reasoningConfig: {temperature: 0.1, maxTokens: 16000}
  runtimeIdentity: {gateway: acme-gateway, apiVersion: "2026-06"}
  availability: HEALTHY
x-mission-control: {modelCatalogId: "<modelCatalogId>", qualificationDigest: "<qualificationDigest>"}
```

### 6. Save an advisory routing policy

FDLC requires eligibility to be filtered before ranking and any automatic selection to be gated by evidence. Mission Control's policy holds ordered rules by task type, operating lane, risk, and complexity, plus the execution-routing gates: evidence window, minimum verified Attempts, minimum evidence coverage, minimum score margin (`convex/modelRoutingPolicies.ts`, `save`; defaults 30 days, 5, 0.6, 5). UI: the model routing view (`apps/mission-control-ui/src/ModelRoutingView.tsx`).

```bash
npx convex run modelRoutingPolicies:save '{"projectId":"<projectId>","name":"depmod advisory v1","defaultModelId":"gpt-5.6-terra","rules":[{"id":"implement-medium","order":1,"taskType":"ENGINEERING","operatingLane":"EXECUTE","riskLevel":"MEDIUM","modelId":"gpt-5.6-terra"}],"fallbackChain":["gpt-5.6-terra"],"executionRouting":{"mode":"ADVISORY","evidenceWindowDays":30,"minimumVerifiedAttempts":5,"minimumEvidenceCoverage":0.6,"minimumScoreMargin":5},"canaryPercent":0,"killSwitch":false}'
```

Policy rules use the four-class risk vocabulary (`LOW|MEDIUM|HIGH|CRITICAL`) while route qualification uses `GREEN|YELLOW|RED`; the two are joined by the Work Order's server-owned risk classification. Every model id named in the policy must be an available, non-deprecated catalog entry. Saving archives the previous version and creates version n+1; policies are immutable versions, not edited rows. Leave `mode: ADVISORY`. Promotion to `GUARDED_AUTO` (`executionRouting:promoteGuardedAuto`) needs one to twenty-five reviewed routing decisions with algorithm versions and digests, creates another policy version, and still does nothing at run time until the `execution-routing.guarded-auto` flag is on; RED Work Orders are never auto-routed (`docs/architecture/execution-routing-v1.md`, "Guarded Auto promotion"). Tutorial 13 returns to this.

## Verify

| Check | How |
|---|---|
| Route is qualified for the intended scope | `modelCatalog:list` shows `enabled: true`, `qualificationStatus: EVIDENCE_QUALIFIED`, `admissionStatus: PRODUCTION_PILOT_ELIGIBLE`, `qualificationSnapshot.scope.workloadClasses` and `riskClasses` as submitted, and `qualificationSnapshot.compatibility` equal to step 3 |
| Qualification is immutable | A second `promoteExactRoute` on the same row fails with "qualification is immutable after promotion" |
| Route is inference-only | `routeSnapshot.schema` is `factory-model-route/v2` and contains no `capabilityIdentity` or `runtimeIdentity` block (those belong to the legacy v1 shape) |
| Policy is active and advisory | `modelRoutingPolicies:getActive '{"projectId":"<projectId>"}'` returns version 1 with `executionRouting.mode: ADVISORY`; `modelRoutingPolicies:simulate` returns the expected model for `riskLevel: MEDIUM` |
| Independence is declared | `verification-independent` in the manifest lists no provider shared with `implementation-workhorse`'s primary |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `Exact model route qualification evidence or scope is invalid.` | `evidenceDigest` not `sha256:` + 64 hex, or a workload class not matching `^[A-Z][A-Z0-9_]{1,63}$` | Compute the digest over the file bytes; use uppercase workload classes |
| `RED route qualification requires an auditable cost policy and explicit repository scope.` | You asked for RED without `costPolicy` | Stop at YELLOW for the tutorial, or supply a cost policy bound to an approved Work Order |
| `Model route "…" is unavailable` on policy save | The catalog row is `availability: UNAVAILABLE` (never reported healthy) or deprecated | Health is reported by internal ingestion (`modelCatalog:reportExactRouteHealth`); in a dev deployment, use a route the worker has reported, or accept that policy save waits for health |
| Route qualified, profile registration still fails | The profile's harness tuple differs from the qualification's `compatibility` | Tutorial 05: register the profile with the same adapter, version, digests, and backend |
| You expect the factory to "pick the best model" | Guarded Auto is off; the router is advisory and the Work Order can be pinned | This is intended at this maturity; see [/patterns/progressive-autonomy](/patterns/progressive-autonomy) |

## Next tutorial

[Create an execution profile](/tutorials/create-an-execution-profile) — pin the route, harness, runtime artifact, backend, sandbox, and tool grant into one admitted composition.

## Related

- Spec: [/specification/v1/capability-manifest](/specification/v1/capability-manifest) (model-route) · [/specification/v1/execution-profile](/specification/v1/execution-profile) · [/specification/v1/decision](/specification/v1/decision) (kind `routing`)
- Architecture: [/architecture/routing](/architecture/routing) (D10) · [/architecture/economics](/architecture/economics) (D22) · [/enterprise/model-gateway](/enterprise/model-gateway)
- Patterns: [/patterns/model-routing](/patterns/model-routing) · [/patterns/capability-based-routing](/patterns/capability-based-routing) · [/patterns/progressive-autonomy](/patterns/progressive-autonomy)
- Mission Control: `docs/architecture/execution-routing-v1.md`; `docs/decisions/model-route-runtime-identity-separation.md`; ledger row "Model/harness/backend routing — Implemented, gated"
- Glossary: Model route, Capability Router, Guarded Auto, Four-part identity
