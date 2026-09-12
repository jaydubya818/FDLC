---
title: Create a Factory Version
description: Assemble FV-depmod-1.0 — bind the workflow, execution profile, code scopes, agent definitions, policy, budget, and verifiers into one immutable, digested composition.
path: /tutorials/create-a-factory-version
audience: [factory-engineer, platform, architect]
level: [practitioner]
status: draft
related: [/tutorials, /tutorials/define-verification-rules, /tutorials/qualify-a-factory-version, /architecture/factory-versioning, /patterns/immutable-factory-version, /patterns/bounded-agent, /anti-patterns/mutable-production-factory, /anti-patterns/no-versioning, /specification/v1/factory-version, /specification/v1/factory-manifest, /specification/v1/capability-manifest, /glossary]
diagrams: [D11, D12]
mc_refs: [convex/factory/configuration.ts, convex/lib/factoryConfiguration.ts, convex/registry/agentTemplates.ts, convex/registry/agentVersions.ts, convex/governance/policyEnvelopes.ts, convex/schema.ts, docs/OVERVIEW.md, docs/FACTORY_VOCABULARY.md, apps/mission-control-ui/src/workspace/FactoryConfigurationPanel.tsx, scripts/prepare-phase4-mcp-qualification.mjs]
---

# Create a Factory Version

## Goal

Turn the designed manifest into an immutable composition. At the end, `FV-depmod-1.0` exists as a content-addressed record that pins every component by digest: planner, agent definitions, harness, skills, tools with grants, model route, context configuration, work graph, runtime artifact, sandbox policy, verification contract, approval policy, execution profiles, economics. Editing the manifest afterward changes nothing about this version. This is Factory Lifecycle stage 4, **Assemble**; the version leaves this tutorial in state `CANDIDATE`, not active.

Production routes work to a qualified immutable Factory Version, never to a mutable factory ([/architecture/factory-versioning](/architecture/factory-versioning)).

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Factory Version | `FV-depmod-1.0` (`state: CANDIDATE`, `compositionDigest: sha256:…`) | `factories/dependency-modernization/versions/1.0.0.yaml`; Mission Control `factoryDefinitionVersions` row with `configurationDigest` |
| Agent Definition (Capability Manifest, kind `agent`) | `CAP-agent-upgrade-implementer-1.6.0` | Mission Control `agentTemplates` + `agentVersions` (genome hash) |
| Policy envelope | `POL-bundle-checkout` v1 | Mission Control `policyEnvelopes` |
| Manifest state | `FM-depmod` `DEFINED → DESIGNED` | `manifest.yaml` |

## Prerequisites

- Tutorials 01–06: a classified repository with a code scope; a production workflow; a published skill; a qualified Tool Version and grant; a promoted model route; a qualified Execution Profile; verifier ids.
- An operator with `factory.automation.manage` (version creation) and `factory.approve` (approving an agent version).

## Concepts

- Factory Version composition (D11) and state machine (D12): [/architecture/factory-versioning](/architecture/factory-versioning), [/specification/v1/factory-version](/specification/v1/factory-version).
- Why mutable configuration cannot be governed at scale: [/anti-patterns/mutable-production-factory](/anti-patterns/mutable-production-factory), [/anti-patterns/no-versioning](/anti-patterns/no-versioning).
- Agent Definition as a versioned genome (model config + prompt bundle digest + tool manifest digest): [/specification/v1/capability-manifest](/specification/v1/capability-manifest) (kind `agent`), [/patterns/bounded-agent](/patterns/bounded-agent).

**Mission Control status: Available (Qualified).** `factory/configuration:createVersion` freezes repository, classification, workflow, executor and harness digests, execution profile identity and qualification, model route and qualification, backend, sandbox profile, code scopes, agent bindings, policy envelope, budget, verifiers, risk boundary, and recovery, and computes `configurationDigest` (ledger row "Agent definitions and Factory binding — Qualified"; `docs/OVERVIEW.md`, "Versioned Factory configuration"). Divergences: the digest is FNV-1a over canonical JSON (`convex/lib/factoryConfiguration.ts:79-95`), where FDLC requires SHA-256 over RFC 8785 canonical JSON; versions have no state column (activity is the definition's `activeVersionId` pointer); the manifest digest is not recorded on the version.

## Steps

### 1. Complete the manifest and mark it DESIGNED

**FDLC step; Mission Control status: Partial.** The `DEFINED → DESIGNED` transition requires every `verification.contract` entry to name a verifier capability and every `capabilities[]` entry to be realizable by a bound capability. Add the remaining sections to `FM-depmod`: `planner`, `agents`, `context_sources`, `observability`, `economics`, `qualification`, `release_policy`, `outcome_metrics` (the complete instance is on [/specification/v1/factory-manifest](/specification/v1/factory-manifest)), then:

```yaml
economics:
  budgets: {maxCostPerWorkOrder: {amount: 25, currency: USD}, maxAttemptsPerWorkOrder: 3, maxRuntimeMinutes: 90}
  costCoverageRule: unknown-cost-is-null
  denominators: [VERIFIED, ACCEPTED, RELEASED]
  includeFailedAttempts: true
qualification:
  standardVersion: fdlc-qualification-standard/1.0
  requiredScopes:
    - {workloadClass: dependency-upgrade, environment: staging,    riskTier: MEDIUM, autonomyLevel: L3}
    - {workloadClass: dependency-upgrade, environment: production, riskTier: MEDIUM, autonomyLevel: L3}
  expiryDays: 90
  hardGates: [security, sandbox-isolation, policy-compliance, credential-handling, evidence-completeness]
state: DESIGNED
```

Compute and record `digest` (SHA-256 over canonical JSON of every section except `state`, `reviewedBy`, `factoryVersionIds`, timestamps, `history`). The Factory Version records this value as `factoryManifestDigest`.

### 2. Create the Agent Definition

FDLC requires each agent to be a versioned definition whose identity is a genome digest over model config, prompt bundle, and tool manifest. Mission Control implements `agentTemplates` + `agentVersions.genome` with `genomeHash` (`convex/registry/agentVersions.ts`; Available). A Factory Version requires every workflow agent to bind to an `APPROVED` version with non-empty prompt bundle hash, tool manifest hash, and model id.

```bash
npx convex run registry/agentTemplates:createTemplate '{"projectId":"<projectId>","name":"Upgrade implementer","slug":"depmod-upgrade-implementer","description":"Bounded dependency-upgrade implementer with no publication authority."}'
npx convex run registry/agentVersions:createVersion '{"projectId":"<projectId>","templateId":"<templateId>","status":"APPROVED","notes":"Reviewed prompt bundle and tool manifest for FV-depmod-1.0.","genome":{"modelConfig":{"provider":"openai","modelId":"gpt-5.6-terra","temperature":0.1,"maxTokens":16000},"promptBundleHash":"sha256:aec5b08b1e0f0295a1412790d1f8286ba9078950f7db7e8325fb876d518cf24e","toolManifestHash":"sha256:a72c59753779940ad10ace0408907d37297011ae41c8feeab76fda19c65a6db5","provenance":{"createdBy":"user:priya.n","source":"factories/dependency-modernization/agents/upgrade-implementer","createdAt":<epoch ms>}}}'
```

Creating a version with `status: "APPROVED"` requires `factory.approve`; a `DRAFT` version needs only `factory.improve` and can be transitioned later (`registry/agentVersions:transitionVersion`). The `modelConfig.modelId` must resolve to the promoted route; the readiness check `model-route` compares the workflow's resolved model against the version's frozen route snapshot (`convex/factory/configuration.ts`, `factoryWorkflowModelRouteMatches`).

Author the matching Capability Manifest (`CAP-agent-upgrade-implementer-1.6.0`, kind `agent`) with `role`, `promptBundleDigest`, `toolManifestDigest`, `modelRouteId: implementation-workhorse`, loop limits, and output contract; `genomeDigest` is the same value Mission Control stores as `genomeHash`.

### 3. Create the policy envelope

FDLC requires a policy bundle pinned by digest. Mission Control's `policyEnvelopes` row holds free-form `rules` and is required active by the readiness check `policy` (`convex/governance/policyEnvelopes.ts`; Available). The shape below is the one the repository's qualification uses:

```bash
npx convex run governance/policyEnvelopes:createPolicyEnvelope '{"projectId":"<projectId>","name":"POL-bundle-checkout v1","priority":100,"rules":{"defaultDecision":"NEEDS_APPROVAL","requireApprovalOnRisk":["YELLOW","RED"],"toolPolicies":{"shell":"NEEDS_APPROVAL","exec":"NEEDS_APPROVAL","write_file":"NEEDS_APPROVAL","delete_file":"DENY"},"autonomyTier":2,"executionEnvironments":["LOCAL"]},"metadata":{"policyId":"POL-bundle-checkout","version":"1"}}'
```

Tutorial 11 revisits what belongs in this envelope versus the governance and change-risk policies.

### 4. Assemble the version

FDLC requires `DRAFT → CANDIDATE` to resolve every component digest and freeze the composition. Mission Control's `createVersion` does the resolution server-side and refuses any unresolved or non-current component (`convex/factory/configuration.ts:793-1170`). UI: **Settings → Workspaces & Repositories → Factory** panel, "create version" (`FactoryConfigurationPanel.tsx`). Function:

```bash
npx convex run factory/configuration:createVersion '{"factoryDefinitionId":"<factoryDefinitionId>","workflowId":"<workflows row id for depmod-upgrade>","executionProfileId":"<executionProfileId>","codeScopeIds":["<codeScopeId>"],"agentBindings":[{"workflowAgentId":"implementer","agentVersionId":"<agentVersionId>"}],"policyEnvelopeId":"<policyEnvelopeId>","budget":{"maxCostUsd":25,"maxRuntimeMinutes":90,"maxAttempts":3},"verifierIds":["<verifierId-1>","<verifierId-2>","<verifierId-3>"],"riskBoundary":"YELLOW","recovery":{"pause":false,"cancel":true,"retry":true,"resume":false}}'
```

What is checked before the insert: the definition is not archived; the Execution Profile is in the workspace, currently eligible, and its backend class matches its inference authority; the repository is classified; the workflow is workspace-owned under `factory-workflow-contract/v1` with no contract issues; the policy, environment, and verifiers are in scope; at least one active code scope from this repository; every workflow agent bound exactly once to an approved version with manifests; budget within V1 limits (cost ≤ 1,000, runtime ≤ 480 minutes, attempts ≤ 3). The resulting row freezes the profile snapshot and digest, the route snapshot and qualification digest, the harness manifest, effective config, and runtime artifact digests, the sandbox profile digest when remote, the repository classification, and `configurationDigest`.

`recovery.pause` and `resume` stay `false`: the Generic Harness Contract V1 adds no pause or in-process resume authority (readiness check `recovery`).

On `riskBoundary`: the manifest declares `risk_class: HIGH` (the highest risk the factory may ever be routed), while this Mission Control version is created with `riskBoundary: YELLOW` (FDLC MEDIUM) because the route and profile were qualified for `GREEN, YELLOW` in tutorials 04–05 and a `RED` boundary requires a route qualification with an auditable cost policy. The Work Order in tutorial 09 is `MEDIUM` risk, inside that boundary. A later version can widen the boundary once a RED-qualified route exists; widening never happens in place.

### 5. Write the Factory Version document

**FDLC step; Mission Control status: Partial (the row is the composition; the FDLC document adds the manifest digest, SHA-256 content address, state, and per-component capability ids).** Take every digest from the Mission Control row and the manifests from tutorials 02–06; the full instance is on the specification page. The head of the document:

```yaml
# factories/dependency-modernization/versions/1.0.0.yaml — FV-depmod-1.0
schemaVersion: "1.0"
type: fdlc://v1/factory-version
id: FV-depmod-1.0
namespace: https://acme.example/factories/checkout
factoryManifestId: FM-depmod
factoryManifestDigest: "<digest from step 1>"
factoryName: dependency-modernization
version: 1.0.0
purpose: SOFTWARE
riskBoundary: HIGH
composition:
  planner: {capabilityId: CAP-planner-objective-1.3.0, version: 1.3.0, digest: "sha256:…"}
  agentDefinitions:
    - {capabilityId: CAP-agent-upgrade-implementer-1.6.0, version: 1.6.0, digest: "<genomeHash>", role: implementer, promptBundleDigest: "sha256:aec5…", toolManifestDigest: "sha256:a72c…", modelRouteId: implementation-workhorse}
  harnesses:
    - {capabilityId: CAP-harness-codex-adapter-1.0.0, version: 1.0.0, digest: "<harnessCapabilityManifestDigest>", adapterId: codex, adapterVersion: v1, capabilityManifestDigest: "<row>", effectiveConfigDigest: "<row.harnessEffectiveConfigSha256>", runtimeArtifactDigest: "<row.harnessRuntimeArtifactDigest>"}
  skills:
    - {capabilityId: CAP-skill-sdk-migration-2.1.0, version: 2.1.0, digest: "<contentHash from mc-context.lock>"}
    - {capabilityId: CAP-skill-lockfile-hygiene-1.0.3, version: 1.0.3, digest: "<contentHash>"}
  tools:
    - {capabilityId: CAP-tool-package-registry-1.2.0, version: 1.2.0, digest: "<toolVersionDigest>", operations: [resolve-version, audit], grantId: GRANT-depmod-registry-3, grantDigest: "<grantDigest>"}
  modelRoutes:
    - {routeId: implementation-workhorse, role: IMPLEMENT, provider: acme-gateway, modelId: workhorse-a, reasoningConfig: {temperature: 0.1, maxTokens: 16000}, routeDigest: "<row.modelRouteDigest>", qualificationDigest: "<row.modelQualificationDigest>"}
  workGraph: {workflowId: depmod-upgrade, version: 1, digest: "sha256:…"}
  runtimeArtifact: {kind: EXECUTABLE, name: codex, version: 0.146.0, digest: "<row.harnessRuntimeArtifactDigest>"}
  verificationContract: {policyId: VC-depmod, version: "2", digest: "<sha256 of contract.yaml canonical JSON>"}
  approvalPolicy: {policyId: POL-approval-risk-tiers, version: "1", digest: "sha256:…"}
  policyBundle: {policyId: POL-bundle-checkout, version: "1", digest: "sha256:…"}
  executionProfiles:
    - {executionProfileId: EP-depmod-1.0-prod, key: prod, digest: "<row.executionProfileDigest>"}
  economics: {maxCostPerWorkOrder: {amount: 25, currency: USD}, maxAttempts: 3, maxRuntimeMinutes: 90, digest: "sha256:…"}
compositionDigest: "<sha256 over the sorted list of every component digest>"
qualification: {standardVersion: fdlc-qualification-standard/1.0, records: [], qualifiedScopes: []}
activations: []
state: CANDIDATE
x-mission-control: {factoryDefinitionVersionId: "<factoryDefinitionVersionId>", configurationDigest: "<row.configurationDigest>"}
```

Every component carries a digest. A reference without one, or to a tag such as `latest`, must fail assembly; that rule is why tutorial 02 rejected wildcard ranges.

### 6. Record the version on the manifest

Add `factoryVersionIds: [FV-depmod-1.0]` to `FM-depmod`. The manifest's `history` does not change; assembling a version is a Factory Version transition, not a manifest transition.

## Verify

| Check | How |
|---|---|
| The version exists and is frozen | `factory/configuration:getDetail '{"factoryDefinitionId":"<id>"}'` lists `versions[0]` with `version: 1`, `configurationDigest: factory-v1-…`, `executionProfileId`, `executionProfileDigest`, `modelRouteDigest`, `modelQualificationDigest`, `harnessCapabilityManifestDigest`, `harnessRuntimeArtifactDigest`, `repositoryDataClassification: INTERNAL`, `codeScopeIds`, `agentBindings`, `verifierIds`, `budget`, `riskBoundary: YELLOW` |
| The definition is not active yet | `definition.activeVersionId` is absent; `definition.status` is still `DRAFT` |
| Immutability | There is no update mutation for a version; a second `createVersion` with any changed input produces `version: 2` with a different digest and leaves version 1 intact |
| Digest reproducibility | `factoryVersionConfigurationDigest(row) === row.configurationDigest` (Mission Control recomputes this at readiness and refuses activation on mismatch) |
| Every FDLC component is digested | No `digest` field in `versions/1.0.0.yaml` is empty or a tag |
| Subordination | The Execution Profile row has no pointer back; `FV-depmod-1.0` lists it under `composition.executionProfiles[]` |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `Execution Profile is not current (…)` | Profile expired, revoked, or components changed since qualification | Tutorial 05: register and qualify a new profile version |
| `Every workflow agent must bind to exactly one approved agent version.` | `agentBindings` missing an agent id from the workflow, duplicated, or referencing a `DRAFT` version | Bind every `agents[].id` from the workflow to an `APPROVED` version |
| `Approved agent versions require prompt, tool, and model manifests.` | Empty `promptBundleHash`, `toolManifestHash`, or `modelConfig.modelId` | Fill the genome |
| `Set positive V1 limits: cost <= $1,000, runtime <= 480 minutes, attempts <= 3.` (at readiness) | Budget outside V1 bounds | Respect the bounds; larger budgets are a policy change, not a version field |
| You want to "update" the active version's route | Not possible by design | Create a new version; tutorial 08 qualifies and activates it; the old version remains the restoration target |
| Two spellings of the same thing | Mission Control docs use "Factory Version", "Factory version", "Factory Configuration", and "Factory Definition Version" | They are one object: `factoryDefinitionVersions` |

## Next tutorial

[Qualify a Factory Version](/tutorials/qualify-a-factory-version) — readiness, the 18-dimension qualification record, and activation.

## Related

- Spec: [/specification/v1/factory-version](/specification/v1/factory-version) · [/specification/v1/factory-manifest](/specification/v1/factory-manifest) · [/specification/v1/capability-manifest](/specification/v1/capability-manifest) (agent) · [/specification/v1/execution-profile](/specification/v1/execution-profile)
- Architecture: [/architecture/factory-versioning](/architecture/factory-versioning) (D11, D12) · [/architecture/design-decisions](/architecture/design-decisions)
- Patterns: [/patterns/immutable-factory-version](/patterns/immutable-factory-version) · [/patterns/bounded-agent](/patterns/bounded-agent) · Anti-patterns: [/anti-patterns/mutable-production-factory](/anti-patterns/mutable-production-factory), [/anti-patterns/no-versioning](/anti-patterns/no-versioning), [/anti-patterns/the-mega-agent](/anti-patterns/the-mega-agent)
- Mission Control: `convex/factory/configuration.ts` (`createVersion`); `convex/lib/factoryConfiguration.ts` (digest); `docs/FACTORY_VOCABULARY.md` (Factory Version)
- Glossary: Factory Version, Composition digest, Agent Definition, Genome, Policy bundle
