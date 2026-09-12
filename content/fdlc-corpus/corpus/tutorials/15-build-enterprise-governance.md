---
title: Build Enterprise Governance
description: Put both factories under one enterprise control plane — tenancy and identity, a digested policy bundle, an authorization ratchet, an external-intent boundary, and an audit trail you can export.
path: /tutorials/build-enterprise-governance
audience: [platform, security, architect, leader]
level: [enterprise]
status: draft
related: [/tutorials, /tutorials/scale-across-repositories, /guides/enterprise-factory-platform, /enterprise, /enterprise/identity-tenancy, /enterprise/policy-governance, /enterprise/policy-governance, /enterprise/organization, /enterprise/reference-architecture, /architecture/authority, /architecture/security, /architecture/learning, /specification/conformance, /specification/v1/decision, /specification/v1/evidence, /anti-patterns/hidden-learning, /anti-patterns/prompt-as-governance, /glossary]
diagrams: [D30, D16, D21]
mc_refs: [convex/registry/tenants.ts, convex/companyContext.ts, convex/companyMembers.ts, convex/governance/roles.ts, convex/governance/roleAssignments.ts, convex/lib/companyAccess.ts, convex/featureFlags.ts, convex/schema.ts, scripts/check-convex-authorization.mjs, scripts/convex-authorization-baseline.json, docs/security/human-service-authorization-matrix.md, docs/security/service-command-authentication.md, docs/security/evidence-retention-policy.md, docs/architecture/company-workspace-repository-control-plane.md, docs/architecture/factory-learning-continuous-improvement.md, convex/factory/learning.ts, convex/lib/factoryLearning.ts]
---

# Build Enterprise Governance

## Goal

Operate `FV-depmod-1.0` and `FV-review-1.0` as part of an enterprise factory ecosystem: one control plane holding identity, delegated authority, a versioned policy bundle, registries, and an audit trail across both factories and all repositories. At the end you have a tenancy model with server-resolved permissions, `POL-bundle-checkout` v7 pinned by digest and enforced through Mission Control's policy records and feature flags, an authorization ratchet that only shrinks, an external-intent boundary for a second governed system, a governed learning loop that proposes and never promotes, and an exportable audit of every authoritative transition.

FDLC's Factory Ecosystem is many specialized factories coordinated through one enterprise control plane with shared identity, policy, routing, verification, evidence, observability, and organizational authority ([/enterprise](/enterprise), D30).

## What you will have at the end

| Artifact | Id | Where |
|---|---|---|
| Tenancy model | Company `acme` → Workspace `checkout` → repositories → code scopes; roles Factory Owner, Policy Owner, Verification Engineer, Incident Commander | Mission Control `tenants`, `projects`, `roles`, `roleAssignments`, `companyMembers`; `enterprise/tenancy.yaml` |
| Policy bundle | `POL-bundle-checkout` v7 (`sha256:…`), pinned by `FV-depmod-1.1` and `FV-review-1.1` | `enterprise/policy-bundle.yaml`; realized as `governancePolicies`, `changeRiskPolicies`, `policyEnvelopes`, `modelRoutingPolicies`, feature flags |
| Authorization ratchet | baseline that only shrinks | `scripts/convex-authorization-baseline.json` |
| External-intent boundary | `execution-intent/v1` contract lock, `SHADOW` mode | MissionControlEnterprise `contracts/venture-factory/v1/` (pattern) |
| Governed learning record | `LS-104-01` → `IC-104-01` → submitted Plan, promotion manual | `learningSignals`, `metaLoopSuggestions`, `missionPlans` |
| Audit export | `audit/2026-09/transitions.jsonl` | `activities`, `workOrderEvents`, `missionEvents`, `serviceCommandReceipts`, `githubWebhookDeliveries`, `factoryIncidentTransitions` |
| Conformance self-assessment | `conformance/self-assessment.md` | Per [/specification/conformance](/specification/conformance) |

## Prerequisites

- Tutorials 11–14 complete.
- Company administration: `platform.tenants.create` (tenant creation is platform-controlled), `company.manage`, `members.manage`, `workspaces.create`.
- A real identity provider. Mission Control supports Clerk-backed human identity (`VITE_AUTH_MODE`, `VITE_CLERK_PUBLISHABLE_KEY`, `MC_BOOTSTRAP_OWNER_SUBJECT`, `MC_BOOTSTRAP_TENANT_SLUG`; `docs/OVERVIEW.md`, "Production-bound configuration"); the legacy development provider is local-only.

## Concepts

- Enterprise reference architecture (D30): [/enterprise/reference-architecture](/enterprise/reference-architecture); identity and tenancy: [/enterprise/identity-tenancy](/enterprise/identity-tenancy); policy: [/enterprise/policy-governance](/enterprise/policy-governance); audit: [/enterprise/policy-governance](/enterprise/policy-governance); roles: [/enterprise/organization](/enterprise/organization).
- Authority model (D16): [/architecture/authority](/architecture/authority); security: [/architecture/security](/architecture/security).
- Governed learning (D21): [/architecture/learning](/architecture/learning); anti-pattern: [/anti-patterns/hidden-learning](/anti-patterns/hidden-learning).
- Conformance tracks and levels: [/specification/conformance](/specification/conformance).

**Mission Control status: Partial** ("Multi-tenant enterprise operation — Partial"; "Enterprise tenancy is not fully qualified", `README.md`). Available: `Company → Workspace → Repository → Code Scope` with row-level `tenantId` scoping, server-resolved membership and named permissions, roles with scoped assignments, project-scoped feature flags, signed service commands, signed webhooks with replay ledgers, append-only activities and events. Divergences: no hierarchy above the tenant (enterprise → business unit); no per-tenant deployment isolation; policy is four record types plus flags rather than one digested bundle (Planned); live cross-company denial evidence is a pending gate. Three enterprise patterns come from MissionControlEnterprise and are cited as patterns, not as Mission Control main capabilities: the authorization ratchet with `authedFunctions.ts` (624 → 184 unauthorized public functions), authn/authz separation with a two-company qualification, and the `ExecutionIntent/v1` contract set (canon §17.4, §18.13).

## Steps

### 1. Model tenancy and identity

FDLC requires enterprise identity for every Actor (`identitySource` set by the control plane), workload identity for services, and delegation chains. Mission Control: tenant (Company) → project (Workspace) → repository → code scope (`docs/architecture/company-workspace-repository-control-plane.md`).

```bash
npx convex run registry/tenants:createTenant '{"name":"Acme","slug":"acme","description":"Acme engineering"}'
npx convex run companyContext:createWorkspace '{"tenantId":"<tenantId>","name":"Checkout Platform","slug":"checkout","description":"Checkout services","purpose":"Governed delivery for checkout","owner":"priya.n","defaultPolicy":"verification-first-v1","status":"ACTIVE"}'
npx convex run companyMembers:ensureDefaultRoles '{"tenantId":"<tenantId>"}'
npx convex run governance/roles:createRole '{"tenantId":"<tenantId>","name":"policy-owner","description":"Qualifies routes, profiles, tools; activates versions; waives","permissions":["factory.read","factory.approve","workspaces.manage"]}'
npx convex run governance/roles:createRole '{"tenantId":"<tenantId>","name":"factory-owner","permissions":["factory.read","factory.improve","factory.automation.manage","delivery.write","delivery.assign","delivery.dispatch"]}'
npx convex run governance/roles:createRole '{"tenantId":"<tenantId>","name":"verification-engineer","permissions":["factory.read","factory.improve","delivery.verify"]}'
npx convex run governance/roles:createRole '{"tenantId":"<tenantId>","name":"incident-commander","permissions":["factory.read","factory.incident.control"]}'
npx convex run governance/roleAssignments:assignRole '{"operatorId":"<sam operatorId>","roleId":"<policy-owner roleId>","scope":{"type":"project","id":"<projectId>"}}'
```

Assignments are scoped (`tenant | project | environment`) and must stay within one company (`convex/governance/roleAssignments.ts`). Every mutation resolves `projectId` to its tenant and authorizes the relationship on the server; "never infer authority from a client-selected project alone" (`docs/security/human-service-authorization-matrix.md`). Services authenticate separately through HMAC-signed service commands (`MISSION_CONTROL_SERVICE_COMMAND_SECRET`, `docs/security/service-command-authentication.md`) and never through the browser token.

Write the FDLC view in `enterprise/tenancy.yaml` with the levels the specification names (enterprise → business unit → factory → workspace) and mark the business-unit level `x-mission-control: not-modeled`.

### 2. Author the policy bundle

**FDLC step; Mission Control status: Planned (no single bundle).** A policy bundle is one versioned, digested document the Factory Version pins (`composition.policyBundle`). Compose it from the policies you already created and record where each is enforced:

```yaml
# enterprise/policy-bundle.yaml — POL-bundle-checkout v7
policyId: POL-bundle-checkout
version: "7"
scope: {tenant: acme, workspace: checkout}
members:
  - {policyId: POL-approval-risk-tiers, version: "1", digest: "sha256:…", enforcedBy: [governancePolicies, changeRiskPolicies, workOrders.accept]}
  - {policyId: POL-net-restricted-allowlist, version: "3", digest: "sha256:…", enforcedBy: [factorySandboxProfiles.networkEgress, harness manifest network]}
  - {policyId: POL-cred-attempt-scoped, version: "2", digest: "sha256:…", enforcedBy: [sandboxCredentialGrants, executionManifest.credentialsRevokedBeforePublication]}
  - {policyId: POL-fs-worktree-only, version: "1", digest: "sha256:…", enforcedBy: [repositoryCodeScopes, changeBudget, worker ownership manifests]}
  - {policyId: POL-routing-advisory, version: "1", digest: "sha256:…", enforcedBy: [modelRoutingPolicies v1, flag execution-routing.guarded-auto=off]}
  - {policyId: POL-tool-read-only, version: "1", digest: "sha256:…", enforcedBy: [mcpToolGrants, governed broker]}
  - {policyId: POL-learning-proposal-only, version: "1", digest: "sha256:…", enforcedBy: [metaLoopSuggestions autoPromote=false]}
flags:                                  # project-scoped feature flags that gate behavior
  missions.spec-intake-v1: on
  context.registry: on
  execution-routing.guarded-auto: off
  factory-engineer.package-import-v1: off
digest: "sha256:<over members + flags canonical JSON>"
```

Set the flags per project (`featureFlags:setFlag`, or `./scripts/mc flags set <key> on|off`); a global flag row cannot enable a project-gated path such as package import (`docs/software-factory/factory-engineer-package-import.md`). Changing any member is a new bundle version; a new bundle digest requires new Factory Versions (`FV-depmod-1.1`, `FV-review-1.1`) through Qualify, never an in-place change.

### 3. Ratchet public authorization

FDLC requires every Decision and every authoritative transition to be server-authorized. Mission Control ships a ratchet: `scripts/check-convex-authorization.mjs` fails on any public Convex function that resolves no server-side authorization and is not in `scripts/convex-authorization-baseline.json`; the baseline may only shrink (main: 624 unauthorized entries). MissionControlEnterprise's branch drove the same baseline to 184, all non-Live read-only queries, by wrapping mutations in `authedMutation` with object-derived scoping (`convex/lib/authedFunctions.ts`; `docs/security/AUTHORIZATION_REMEDIATION.md`; canon §18.13).

```bash
pnpm run security:authorization        # scripts/lib/convex-authorization-scan.test.mjs + check-convex-authorization.mjs
pnpm run release:security              # dependency audit + authorization + secrets + factory docs gate
node scripts/check-convex-authorization.mjs --update    # only after a migration that authorized functions
```

Adopt the rule for your own control plane: a public function is either authorized, internal, or explicitly anonymous with a reviewed reason. Track the number in the audit export.

### 4. Accept intents from another governed system

FDLC's Factory Ecosystem receives Intents from other systems through an authenticated boundary that grants no authority. MissionControlEnterprise's `contracts/venture-factory/v1/` is the reference shape: `execution-intent.schema.json` (`schema_version: execution-intent/v1`, `intent_id`, `organization_id`, `idempotency_key`, `correlation {correlation_id, causation_id, trace_id}`, `requested_by`, `subject`, `desired_business_outcome`, `constraints`, `evidence_requirements`, `budget_ceiling`, `rights_constraints`, `governance`, `provenance`), a response schema, an event schema, and `contract-lock.json` with `mode: SHADOW`, `dispatch_authority: false`, `software_acceptance_authority: false`, and a SHA-256 per schema. Mission Control main has the related Factory Engineer package import (`factoryPackageImports:preview`, `importDrafts`), which projects an immutable, digested `fdlc.factory-deployment-package/v1` into a Mission and a `DRAFT` Plan and nothing more; both statuses must be `PUBLISHED`, attestations older than the freshness window fail closed, and a real Clerk identity with `delivery.write` and `delivery.assign` is required.

**FDLC step:** publish your own `contract-lock.json` for the Intent boundary, keep `mode: SHADOW` until a two-organization denial test exists, and map the received intent to `fdlc://v1/intent` with `identitySource: workload-identity` on the requesting actor.

### 5. Run learning as proposal-only

FDLC requires learning to create Improvement Candidates and never to mutate or activate production behavior (D21). Mission Control's loop is `Evidence → Signals → Clusters → Improvement Candidates → Human Review → frozen Experiment → Recommendation → Mission + submitted Plan → separate human Plan approval` (`docs/architecture/factory-learning-continuous-improvement.md`; Available, advisory; promotion manual).

```bash
npx convex run factory/learning:refresh '{"projectId":"<projectId>"}'          # deterministic scan, 30-day window, no model calls
npx convex run factory/learning:getDashboard '{"projectId":"<projectId>"}'
npx convex run factory/metaLoop:listInbox '{"projectId":"<projectId>"}'
npx convex run factory/learning:reviewCandidate '{...}'                        # DISMISS | REJECT | SNOOZE with a reason
npx convex run factory/learning:approveExperiment '{...}'                      # marks the candidate ACCEPTED; two variants, frozen dataset and evaluators
npx convex run factory/metaLoop:resolve '{"suggestionId":"<id>","action":"ACCEPT","reason":"…"}'   # human promotion → Mission + submitted Plan
```

The recommendation is `PROMOTION_RECOMMENDED | HOLD_RECOMMENDED | REJECT_RECOMMENDED`, always `statisticallySignificant: false` and `autoPromote: false` (`convex/lib/factoryLearning.ts`). Promotion by a human (`metaLoop:resolve` with `ACCEPT`, requiring the `missions.plan-release-v1` flag and an active workflow) creates a submitted Mission Plan with one bounded implementation Work Order; a different human approves it; the resulting change reaches production only as a new Factory Version through tutorials 07–08. Record `LS-104-01 → IC-104-01` in your learning directory with the experiment ids. "Any evidence of acceptance, verification, routing, Factory Version, or repository mutation from the learning subsystem is a release blocker."

### 6. Export the audit trail

FDLC requires every authoritative transition to record subject, prior version, from/to state, actor with identity source, reason, policy version, idempotency key, timestamp, required evidence ids, Decision id, and invalidated dependents. Mission Control keeps these across several append-only stores; export them into one `Transition` stream:

| Store | What it records | Read with |
|---|---|---|
| `activities` | Factory, profile, route, tool, policy, role, incident actions with `actorType`, `actorId`, `beforeState`, `afterState`, `metadata` | `/v2/audit` (`AuditView.tsx`); Convex query per module |
| `workOrderEvents`, `missionEvents` | Release, dispatch, retry, receipts, acceptance, rejection with idempotency keys | `workOrders:get` (`events`), `missions:get` |
| `workOrderRevisions`, `reopenDecisions`, `workOrderSupersessions`, `approvalDecisions` | Materiality, invalidated receipts and approvals, decisions with expiry | `./scripts/mc revision-history`, `governance`, `expired-approvals` |
| `serviceCommandReceipts`, `githubWebhookDeliveries`, `scopeEnforcementReceipts` | Signed service commands (`RECEIVED | SUCCEEDED | FAILED | DENIED`, replay), signed webhook deliveries, dispatch scope enforcement | Convex queries; `docs/security/service-command-authentication.md` |
| `factoryIncidentTransitions`, `factoryIncidentControlReceipts`, `factoryIncidentControlAuthorizations` | Incident phases, command/ack/effect receipts, restoration authority | `factory/incidents:get` |
| `mcpToolCallReceipts`, `verificationReceipts`, `evidenceEnvelopes`, `qualityGateDecisions` | Tool, verification, evidence, gate | tutorials 03 and 10 |

Write each row as a `Transition` (`subjectId`, `fromState`, `toState`, `actor {kind, id, identitySource}`, `reason`, `policyVersion`, `idempotencyKey`, `occurredAt`, `requiredEvidenceIds`, `decisionId`, `invalidatedDependents`) into `audit/2026-09/transitions.jsonl`, sign the file (DSSE), and retain it per `docs/security/evidence-retention-policy.md` and the manifest's `evidence.retentionDays`. Missing fields stay missing; do not backfill an `identitySource` the control plane did not record. Runtime contract changes are their own audit line: `pnpm run ci:runtime-contract` guards the public Convex contract version (v58 at the studied revision).

### 7. Assess conformance with the min-gated rule

Score each track against [/specification/conformance](/specification/conformance) with the min-gated rule. For Mission Control at the studied revision the canonical self-assessment is overall **FDLC-L2** (Intent L3, Execution L2, Trust L3, Learning L3; canon §18.14): immutable versions and readiness exist, but a behavioral Qualification Record, a factory registry with objective routing, a single Decision record type, and evidence-state columns are Planned. Write `conformance/self-assessment.md` with evidence ids per item; a claim without evidence at an exact revision is not a claim.

## Verify

| Check | How |
|---|---|
| Authority is server-resolved | A browser session with a client-side "admin" label but no membership is refused by `requireCompanyPermission`; a cross-company `assignRole` fails with "must belong to the same company" |
| Tenancy scoping holds | A query with a `projectId` from another tenant returns the generic unavailable-or-unauthorized error, not data |
| Bundle is pinned | `FV-depmod-1.1.composition.policyBundle.digest` equals `POL-bundle-checkout` v7's digest; changing a flag or policy produces v8 and a new version |
| Ratchet does not regress | `pnpm run security:authorization` passes; the baseline count did not grow since the last export |
| External intents grant nothing | Package import creates only a `PLANNING` Mission and a `DRAFT` Plan; no Work Order, Attempt, or activation appears |
| Learning cannot promote | No learning function writes `activeVersionId`, routing policy, or acceptance; every recommendation carries `autoPromote: false` |
| Audit is complete for one Work Order | For `WO-104-01`, the export contains release, routing pin, dispatch, claim, candidate, verification receipt, gate decision, acceptance, each with actor and idempotency key |

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `Company account is required while company enforcement is enabled.` | Company context enforcement on and no `tenantId` | Pass the tenant; do not disable enforcement (`MC_ALLOW_ANONYMOUS_COMPANY_CONTEXT` is a development escape) |
| `Platform tenant administration is required.` | Tenant creation is platform-controlled | Use the platform identity; tenants are not self-provisioned |
| A policy change "took effect" without a new version | It cannot for pinned policies; readiness detects a policy envelope change and the next version freezes the new one | Bump the bundle version and assemble |
| Two organizations share one deployment and you claim isolation | Isolation is authorization-enforced logical separation, not per-tenant deployment | State it that way; per-tenant isolation is an FDLC requirement Mission Control does not implement |
| The learning inbox fills with fixture signals | Fixture and qualification signals dominate until real accepted outcomes exist | Feed real outcomes; do not lower the cluster threshold to make it look active |
| Audit rows lack `identitySource` for legacy service callers | Migration pending per the authorization matrix | Record as `unknown`; track in the ratchet |

## Next tutorial

This is the last tutorial. Continue with the guides ([/guides/enterprise-factory-platform](/guides/enterprise-factory-platform)), the enterprise reference architecture ([/enterprise/reference-architecture](/enterprise/reference-architecture)), or the conformance checklist ([/specification/conformance](/specification/conformance)).

## Related

- Guide: [/guides/enterprise-factory-platform](/guides/enterprise-factory-platform)
- Enterprise: [/enterprise](/enterprise) · [/enterprise/identity-tenancy](/enterprise/identity-tenancy) · [/enterprise/policy-governance](/enterprise/policy-governance) · [/enterprise/policy-governance](/enterprise/policy-governance) · [/enterprise/organization](/enterprise/organization) · [/enterprise/reference-architecture](/enterprise/reference-architecture) (D30)
- Spec: [/specification/conformance](/specification/conformance) · [/specification/v1/decision](/specification/v1/decision) · [/specification/v1/evidence](/specification/v1/evidence) · [/specification/v1/improvement-candidate](/specification/v1/improvement-candidate)
- Architecture: [/architecture/authority](/architecture/authority) (D16) · [/architecture/security](/architecture/security) · [/architecture/learning](/architecture/learning) (D21)
- Patterns: [/patterns/governed-learning](/patterns/governed-learning) · [/patterns/decision-record](/patterns/decision-record) · Anti-patterns: [/anti-patterns/hidden-learning](/anti-patterns/hidden-learning), [/anti-patterns/prompt-as-governance](/anti-patterns/prompt-as-governance)
- Mission Control: `docs/security/human-service-authorization-matrix.md`; `scripts/check-convex-authorization.mjs`; `docs/architecture/factory-learning-continuous-improvement.md`; ledger rows "Multi-tenant enterprise operation — Partial", "Factory Learning — Qualified; advisory". MissionControlEnterprise: `convex/lib/authedFunctions.ts`, `contracts/venture-factory/v1/`
- Glossary: Control Plane, Factory Ecosystem, Policy bundle, Tenant, Workload identity, Improvement Candidate, Transition
