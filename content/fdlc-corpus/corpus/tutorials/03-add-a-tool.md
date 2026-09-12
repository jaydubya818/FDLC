---
title: Add a Tool
description: Register a governed MCP tool as a Tool Manifest, qualify it, issue an expiring grant for one operation, and read the two-phase receipts a call produces.
path: /tutorials/add-a-tool
audience: [factory-engineer, security, platform]
level: [practitioner]
status: draft
related: [/tutorials, /tutorials/add-a-skill, /tutorials/configure-a-model-route, /tutorials/create-an-execution-profile, /patterns/tool-grant-and-receipt, /patterns/bounded-agent, /anti-patterns/unlimited-tool-access, /specification/v1/capability-manifest, /specification/v1/evidence, /architecture/authority, /glossary]
diagrams: [D19, D23]
mc_refs: [docs/decisions/governed-mcp-tool-capability.md, docs/software-factory/worker-runtime-operations.md, convex/factory/governedMcp.ts, convex/lib/governedMcp.ts, apps/orchestration-server/src/governedMcpBroker.ts, scripts/prepare-phase4-mcp-qualification.mjs, docs/testing/evidence/governed-mcp-phase4-recovery/README.md, packages/workflow-engine/src/harnessManifests.ts]
---

# Add a Tool

## Goal

Give the dependency-modernization factory one governed tool: a read-only package-registry lookup exposed over MCP. You will author its Tool Manifest, register and qualify a Tool Version, issue a Tool Grant for exactly one operation with an expiry, and see what a governed call leaves behind: an authorization receipt before the transport starts and a completion receipt after it ends. You will also revoke the grant and watch new calls fail closed.

The authority chain this tutorial builds is `Work Order → Attempt lease → Execution Profile → Tool Grant → Tool Version → operation → authorization receipt → call → completion receipt → evidence` (`docs/decisions/governed-mcp-tool-capability.md`). A tool manifest never grants authority; the grant does, and only while it is current.

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Tool Manifest (Capability Manifest, kind `tool`) | `CAP-tool-package-registry-1.2.0` | `factories/dependency-modernization/capabilities/tool-package-registry.yaml` |
| Tool Version (Mission Control) | `<toolVersionId>` with `toolVersionDigest` | `mcpToolVersions` |
| Tool Grant | `GRANT-depmod-registry-3` (FDLC id); `<toolGrantId>` with `grantDigest` | `mcpToolGrants` |
| Receipts (after tutorial 09 runs an Attempt) | `EV-104-05` (kind `TOOL_CALL_RECEIPT`) | `mcpToolCallReceipts`, projected into `runEvents` and `runArtifacts` |
| Manifest binding | `tools[]` entry in `FM-depmod` | `manifest.yaml` |

## Prerequisites

- Tutorial 02 complete.
- Mission Control checkout, dev deployment, and an operator with `factory.automation.manage` (registration, grants) and `factory.approve` (qualification, revocation) permissions (`convex/lib/companyAccess.ts`).
- For the real-service path: outbound HTTPS to `mcp.context7.com:443` from the orchestration host. For the fixture path: nothing external.

## Concepts

- Capability ≠ permission ≠ authority: [/architecture/authority](/architecture/authority).
- Tool Manifest fields (`operations[]`, `sideEffectClass`, `grants`, `mcpBinding`): [/specification/v1/capability-manifest](/specification/v1/capability-manifest).
- The two-phase receipt pattern and the broker: [/patterns/tool-grant-and-receipt](/patterns/tool-grant-and-receipt) (D23).
- What happens without this: [/anti-patterns/unlimited-tool-access](/anti-patterns/unlimited-tool-access).

**Mission Control status: Experimental.** Two Tool Versions are registrable and both are read-only: a local stdio qualification fixture (`read_factory_doctrine_excerpt`) and one real service, Context7 `query-docs` at `@upstash/context7-mcp@4.0.5`, admitted for one fixed public React documentation query (`docs/decisions/governed-mcp-tool-capability.md`, Phase 4 addendum). There is no generic "register any MCP server" mutation; the Tool Version snapshot is built from constants in `convex/lib/governedMcp.ts`. Harness manifests (`codex/v1`, DeepSeek) declare `tools.mcp: UNSUPPORTED`; the host broker is the only MCP client. No write operation, dynamic discovery authority, or credential-bearing tool is admitted. The steps below use the real-service Tool Version to exercise the chain and label the package-registry tool as the FDLC step it is.

## Steps

### 1. Author the Tool Manifest

**FDLC step; Mission Control status: Experimental (only the two exact Tool Versions above can be registered).** Write the manifest for the tool you want. The specification's worked example is exactly this tool; the complete instance is on the Capability Manifest page.

```yaml
# factories/dependency-modernization/capabilities/tool-package-registry.yaml — CAP-tool-package-registry-1.2.0 (excerpt)
schemaVersion: "1.0"
type: fdlc://v1/capability-manifest
id: CAP-tool-package-registry-1.2.0
namespace: https://acme.example/factories/checkout
kind: tool
name: package-registry
version: 1.2.0
owner: {kind: human, id: "user:sam.reyes", identitySource: authenticated}
provenance: {sourceRepository: https://git.acme.example/platform/mcp-package-registry, sourceCommit: b9759359b0d6d70a6593146e72040391245e204f, contentDigest: sha256:d00c0a4eaad4392eac3867625ffa0e3c78665fe66b1df8743333530bd224bef3}
permissions: {required: [registry:read], credentialClasses: [registry:read-token:attempt-scoped], networkDestinations: [registry.acme.example], filesystem: NONE, maxSideEffectClass: READ_ONLY}
security: {scanStatus: PASSED, injectionSafetyReviewed: true, findings: []}
qualification: {status: UNQUALIFIED, records: []}
deprecation: {deprecated: false}
spec:
  operations:
    - {name: resolve-version, sideEffectClass: READ_ONLY, idempotent: true, requiredPermissions: [registry:read], inputSchemaDigest: sha256:82d2…, outputSchemaDigest: sha256:3ac6…, rateLimit: {calls: 60, perSeconds: 60}}
    - {name: audit, sideEffectClass: READ_ONLY, idempotent: true, requiredPermissions: [registry:read], inputSchemaDigest: sha256:1678…, outputSchemaDigest: sha256:400a…, commandClass: DEPENDENCY_SCAN}
  sideEffectClass: READ_ONLY
  grants: {model: PER_OPERATION_EXPIRING, defaultTtlSeconds: 7776000, revocationMode: DENY_NEW_CALLS, absentGrantMeans: NO_TOOL_CAPABILITY, receiptPhases: [AUTHORIZATION, COMPLETION]}
  mcpBinding: {serverKey: acme/package-registry, serverVersion: 1.2.0, transport: stdio, implementationDigest: sha256:d00c…, inputSchemaDigest: sha256:44f3…, broker: GOVERNED_BROKER, outputTrust: UNTRUSTED_CONTENT}
  poisoningDetection: true
  redaction: SUPPORTED
state: DRAFT
```

Each operation is classified individually; `sideEffectClass` at the top is the maximum over operations. `absentGrantMeans: NO_TOOL_CAPABILITY` is the rule Mission Control enforces: a profile without a grant has no tool, not a default one (`docs/decisions/governed-mcp-tool-capability.md`).

### 2. Register a Tool Version

FDLC requires registration to be descriptive and disabled. Mission Control: "Registration is descriptive and disabled; qualification is the only path to admission" (`convex/schema.ts`, `mcpToolVersions`). Register the real read-only service (`convex/factory/governedMcp.ts`):

```bash
npx convex run factory/governedMcp:registerContext7QueryDocs '{"projectId":"<projectId>","registrationIdempotencyKey":"depmod-context7-v4.0.5:<repositoryId>"}'
```

The result carries `toolVersionId` and `toolVersionDigest` (`sha256:` over server key, version, implementation digest, protocol, SDK, transport, schemas, limits, credential class, side-effect class). Re-running with the same idempotency key returns the same row; the same key with different bytes is rejected. The fixture alternative is `factory/governedMcp:registerQualificationFixture` with an `implementationDigest` of the checked-in fixture entrypoint.

### 3. Qualify the Tool Version

FDLC requires `PUBLISHED → QUALIFIED` to cite a Qualification Record with scope and expiry. Mission Control binds an evidence reference and digest to the exact `toolVersionDigest`, single-use, with a lifetime of at most 30 days (`MCP_MAX_QUALIFICATION_LIFETIME_MS`, `convex/lib/governedMcp.ts`).

```bash
npx convex run factory/governedMcp:qualifyVersion '{"toolVersionId":"<toolVersionId>","expectedDigest":"<toolVersionDigest>","evidenceReference":"docs/software-factory/phase4-real-mcp-service-selection-v2.md","evidenceDigest":"sha256:<sha256 of that file>","validUntil":<epoch ms, ≤ now + 30 days>}'
```

The mutation requires `factory.approve`, refuses a second qualification of the same version ("single-use"), and refuses a digest that does not match the stored bytes. The evidence you cite for a real service must be a reviewed selection record; Mission Control's own is `docs/software-factory/phase4-real-mcp-service-selection-v2.md`.

### 4. Issue a Tool Grant

FDLC requires grants to be per operation, expiring, and immutable. Mission Control implements exactly that: workspace-scoped, one operation, `maxCallsPerAttempt: 1`, `revocationMode: DENY_NEW_CALLS`, expiry capped at the Tool Version's qualification expiry (`convex/lib/governedMcp.ts`, `mcpToolGrantSnapshot`).

```bash
npx convex run factory/governedMcp:createGrant '{"projectId":"<projectId>","toolVersionId":"<toolVersionId>","grantKey":"depmod-context7-query-docs","expiresAt":<epoch ms>,"registrationIdempotencyKey":"depmod-context7-grant:<repositoryId>"}'
```

Record the returned `toolGrantId` and `grantDigest`; tutorial 05 freezes them into `EP-depmod-1.0-prod`. A grant is never attached to an existing profile or a historical Attempt (`docs/software-factory/worker-runtime-operations.md`, "Governed read-only MCP v42").

### 5. Bind the tool in the Factory Manifest

```yaml
tools:
  - capabilityId: CAP-tool-package-registry-1.2.0
    versionConstraint: "1.2.x"
    operations: [resolve-version, audit]
    grantPolicy: PER_OPERATION_EXPIRING
    maxSideEffectClass: READ_ONLY
```

### 6. Run a governed call and read the receipts

This step completes after tutorial 09, when an Attempt runs under a profile that froze the grant. The worker performs the one qualified read before invoking the harness; Convex commits an `ALLOWED` authorization receipt only while the Attempt lease, fencing generation, profile, grant, Tool Version, qualification expiry, and one-call budget are all current (`convex/factory/governedMcp.ts`, `authorizationDenialReason`). The broker then starts the transport, validates the observed server version and input-schema digest against the frozen Tool Version, and writes a completion receipt.

```bash
npx convex run factory/governedMcp:listReceiptsForAttempt '{"workflowRunId":"<workflowRunId>"}'
./scripts/mc run-events <workflowRunDocId>        # projections of the same receipts
./scripts/mc run-artifacts <workflowRunDocId>
```

Expect two rows: `phase: AUTHORIZATION, status: ALLOWED` and `phase: COMPLETION, status: SUCCEEDED`, each bound to the Attempt, lease, profile digest, grant digest, tool version digest, operation, request digest, and the expected-vs-observed server identity. `costStatus` is `UNKNOWN`; Mission Control never invents a zero.

### 7. Revoke and observe fail-closed

```bash
npx convex run factory/governedMcp:revokeGrant '{"toolGrantId":"<toolGrantId>","expectedDigest":"<grantDigest>","reason":"Tutorial: exercise DENY_NEW_CALLS"}'
```

A later Attempt under the same profile gets an authorization receipt with `status: DENIED`; historical receipts are untouched. Rollback of a tool in Mission Control is grant revocation plus removing the profile from new Factory Version selection; it is never an edit of the old profile.

## Verify

| Check | How |
|---|---|
| Tool Version is qualified and current | `npx convex run factory/governedMcp:list '{"projectId":"<projectId>"}'` shows the version with `current: true`, `qualificationStatus: EVIDENCE_QUALIFIED`, and `maturity: QUALIFIED_ONE_REAL_READ_ONLY_SERVICE` |
| Grant is active and bounded | The same query shows the grant `state: ACTIVE`, `current: true`, `expiresAt` ≤ the tool's `qualificationExpiresAt` |
| Receipts exist and match | After tutorial 09: `listReceiptsForAttempt` returns AUTHORIZATION then COMPLETION with equal `toolVersionDigest` and `grantDigest`, and `expected` equals `observed` server identity |
| Revocation denies new calls | A post-revocation Attempt shows `DENIED`; earlier receipts unchanged |
| Deterministic regression | `pnpm run test:mcp:phase4` passes without contacting Context7 |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `Tool Version qualification is single-use.` | You qualified the same version twice | Register a new version (new idempotency key) if bytes changed; otherwise nothing to do |
| `Tool Grant requires one current exact qualified Tool Version.` | Qualification expired or `validUntil` was in the past | Re-qualify a new version; expiry is never extended in place |
| `Execution Profile requires one current exact Tool Grant.` (tutorial 05) | Grant revoked or expired at profile registration | Create a new grant, then a new profile version |
| `LEASE_STALE` denial | The worker's lease, session, or generation changed before the call | Expected; a retry is a new Attempt with current admission |
| You want a write-capable tool | Not admitted; the ADR lists what a write phase must add (operation-specific approval, pre/post-effect receipts, rollback, post-condition verification) | Author the manifest with `sideEffectClass: WRITE_REMOTE`; Mission Control status: Planned |

## Next tutorial

[Configure a model route](/tutorials/configure-a-model-route) — the other capability the Execution Profile must pin exactly.

## Related

- Spec: [/specification/v1/capability-manifest](/specification/v1/capability-manifest) (Tool Manifest) · [/specification/v1/evidence](/specification/v1/evidence) (`TOOL_CALL_RECEIPT`) · [/specification/v1/execution-profile](/specification/v1/execution-profile)
- Patterns: [/patterns/tool-grant-and-receipt](/patterns/tool-grant-and-receipt) · [/patterns/bounded-agent](/patterns/bounded-agent) · Anti-pattern: [/anti-patterns/unlimited-tool-access](/anti-patterns/unlimited-tool-access)
- Architecture: [/architecture/authority](/architecture/authority) · [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses)
- Mission Control: `docs/decisions/governed-mcp-tool-capability.md`; `docs/testing/evidence/governed-mcp-phase4-recovery/README.md`; ledger row "Tools/MCP runtime — Experimental; one real read-only operation qualified"
- Glossary: Tool, Tool Manifest, Grant, Receipt, Broker
