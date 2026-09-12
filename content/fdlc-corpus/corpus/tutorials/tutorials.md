---
title: Tutorials
description: Fifteen Mission Control-connected tutorials that build one dependency-modernization factory, a second code-review factory, and the governance around them.
path: /tutorials
audience: [builder, factory-engineer, platform, architect, security]
level: [beginner, practitioner, architect, enterprise]
status: draft
related: [/guides, /framework/delivery-loop, /framework/factory-lifecycle, /specification, /mission-control, /patterns, /anti-patterns, /glossary]
diagrams: [D03, D02]
mc_refs: [README.md, docs/OVERVIEW.md, docs/product/software-factory-capability-maturity.md, scripts/mc, scripts/prepare-phase4-mcp-qualification.mjs, convex/factory/configuration.ts]
---

# Tutorials

## What these are

A tutorial is a build-along. Each one starts from a stated set of prerequisites, walks through numbered steps, and ends with a way to verify that the artifact it promised now exists. The fifteen tutorials build one factory end to end (`FV-depmod-1.0`, the dependency-modernization factory from the specification's worked example), then a second factory (`FV-review-1.0`, code review), then the routing, scaling, and governance that let both operate under one control plane.

Every step names what FDLC requires and what Mission Control implements. Where Mission Control has a command, Convex function, UI action, or file, the step cites it by path. Where Mission Control has no implementation, the step is labeled **FDLC step; Mission Control status: Planned / Proposed / not implemented** and shows the YAML or JSON you would author per the specification instead. No command in these tutorials is invented; each one was checked against the repository at the revision studied (runtime contract v58).

## How Mission Control is used here

Mission Control is the reference implementation, not the definition. It has three practical surfaces:

| Surface | What it is | Where |
|---|---|---|
| Operator UI | React app on Convex; Factory configuration under Settings → Workspaces & Repositories (`/v2/projects`), Work Orders under `/v2/control-work-orders`, evidence under `/v2/audit` and `/v2/trace-inspector` | `apps/mission-control-ui/` |
| Convex functions | The authoritative mutations and queries. Invoke from the UI, from `npx convex run <module>:<function> '<json>'` against a development deployment, or from a `ConvexHttpClient` script | `convex/` |
| `mc` shell CLI | Thin wrappers over the same Convex functions for dispatch, acceptance, revisions, run inspection, flags, skill lint, and context manifests | `scripts/mc` |

The tutorials prefer the Convex function path because it is the one every surface shares and the one the repository's own qualification scripts use (`scripts/prepare-phase4-mcp-qualification.mjs`, `scripts/qualification/*.mts`). Function paths are written as `module:function` (`factory/configuration:createVersion`), which is the form `npx convex run` and `makeFunctionReference` accept.

Two things to know before you start. First, the canonical `codex/v1` worker is disabled by default (`README.md`, "Production worker warning"); tutorials 09–10 run the deterministic demo or a no-provider synthetic path unless you have a Codex CLI, a GitHub App installation, and an orchestration server. Second, Mission Control's capability ledger (`docs/product/software-factory-capability-maturity.md`) is the source of every status word used below; a table exists in `convex/schema.ts` does not make a capability Available.

## Index

| # | Tutorial | Goal | Time (illustrative) | Prerequisites | Mission Control status of the underlying capability | FDLC concepts exercised |
|---|---|---|---|---|---|---|
| 01 | [Build your first software factory](/tutorials/build-your-first-software-factory) | Stand up a control plane and produce `FM-depmod` in state `DEFINED` | 2–3 h | Node 20+, pnpm 9+, a Convex dev deployment, one repository | Available (workspace, repository, code scope, Factory definition); Factory Manifest as one document: Partial | Factory Lifecycle Discover → Define; Factory Manifest; Company → Workspace → Repository → Code Scope |
| 02 | [Add a skill](/tutorials/add-a-skill) | Publish `CAP-skill-sdk-migration-2.1.0` and lock it into the repository | 1 h | Tutorial 01; `context.registry` flag | Available (synthetic qualification); flag-gated | Capability Manifest (kind skill); Skill Manifest; content digest; lockfile pinning |
| 03 | [Add a tool](/tutorials/add-a-tool) | Register `CAP-tool-package-registry-1.2.0`, qualify it, issue a grant, read a receipt | 1.5 h | Tutorial 02 | Experimental (one qualified read-only real-service operation; no writes) | Tool Manifest → Grant → two-phase receipt; `NO_TOOL_CAPABILITY` |
| 04 | [Configure a model route](/tutorials/configure-a-model-route) | Register and promote `CAP-model-route-workhorse-a-2.0.0` as `implementation-workhorse` | 1 h | Tutorial 01 | Available (exact route registration + promotion); routing policy Implemented, gated | Model route identity separate from harness; qualification scope; four-part tuple |
| 05 | [Create an execution profile](/tutorials/create-an-execution-profile) | Register and qualify `EP-depmod-1.0-prod` | 1.5 h | Tutorials 03–04 | Implemented, gated (Experimental); no UI | Execution Profile admission states; harness manifest; sandbox policy |
| 06 | [Define verification rules](/tutorials/define-verification-rules) | Author the `VC-depmod` verification contract and bind verifiers | 1.5 h | Tutorial 01 | Available (Work Order verification contract v2, verifiers); factory-level contract as a manifest section: Partial | Verification contract; independence; criterion → verifier mapping; authority surfaces |
| 07 | [Create a Factory Version](/tutorials/create-a-factory-version) | Assemble `FV-depmod-1.0` with a composition digest | 1 h | Tutorials 02–06 | Available (`createVersion`, configuration digest); SHA-256 canonical digest: divergence | Factory Version composition; immutability; DRAFT → CANDIDATE |
| 08 | [Qualify a Factory Version](/tutorials/qualify-a-factory-version) | Produce `QR-depmod-1.0-01`, activate `FV-depmod-1.0` | 2 h | Tutorial 07 | Available (readiness assessment + activation); behavioral qualification record: Planned | Qualification Record; 18 dimensions; readiness ≠ qualification; promotion Decision |
| 09 | [Execute a Work Order](/tutorials/execute-a-work-order) | Run `WO-104-01` through Attempt, Candidate, Verification, acceptance | 2–3 h | Tutorial 08; a worker | Available (Mission → Plan → Work Order → Attempt → verification → `workOrders.accept`) | Delivery Loop 1–7; lease; candidate identity; single acceptance boundary |
| 10 | [Capture evidence](/tutorials/capture-evidence) | Inspect and export `EV-104-09` and `VER-104-01` as bound evidence | 1 h | Tutorial 09 | Available (evidence envelopes, receipts, gate decisions); six-state lifecycle column: Planned; in-toto wrapper: Partial | Evidence binding; currentness; six states; Claim → Evidence → Verification → Decision |
| 11 | [Configure approval policy](/tutorials/configure-approval-policy) | Author `POL-approval-risk-tiers` and see it enforced at `DEC-104-03` | 1.5 h | Tutorial 09 | Available (governance policy, change-risk policy, approval decisions, human-only accept); policy acceptance for LOW/MEDIUM: Proposed | Risk tiers; Decision kinds; HITL spectrum; capability ≠ permission ≠ authority |
| 12 | [Create a second factory](/tutorials/create-a-second-factory) | Assemble and activate `FV-review-1.0` (code review) | 2 h | Tutorials 07–08 | Available (second Factory definition, purpose `VERIFICATION`, same repository); factory registry across workspaces: Planned | Specialized factories; producer vs verifier factory; independence by factory boundary |
| 13 | [Route an objective across factories](/tutorials/route-an-objective-across-factories) | Plan `INT-105` into `WO-105-01` (depmod) and `WO-105-02` (review) with routing Decisions | 2 h | Tutorial 12 | Experimental (Work Order routing among same-repository Factory Versions; Guarded Auto disabled); objective routing across factories: Planned | Three-level routing; eligibility before ranking; Objective Planner |
| 14 | [Scale across repositories](/tutorials/scale-across-repositories) | Operate `FV-depmod-1.0` over many repositories with per-repository qualification | 2 h | Tutorial 13 | Partial (repository connections, code scopes, per-repository readiness); multi-repository Missions: Planned | Qualification scope; budget tree; repository classification; fleet operation |
| 15 | [Build enterprise governance](/tutorials/build-enterprise-governance) | Tenancy, `POL-bundle-checkout`, and an audit trail across both factories | 3 h | Tutorial 14 | Partial (company/workspace scoping, permissions, activities); cross-company qualification and policy bundles as artifacts: Planned | Enterprise identity; policy bundles; audit; authorization ratchet; incident authority |

## Suggested paths

| If you are | Do |
|---|---|
| A Builder who wants to see one governed change end to end | 01 → 06 → 07 → 08 → 09 → 10 |
| A Factory Engineer assembling a factory | 01 through 08 in order |
| A Platform Engineer preparing a second factory and routing | 07, 08, 12, 13, 14 |
| A Security engineer or Policy Owner | 03, 05, 06, 11, 15 |
| An Architect evaluating the model | 01, 07, 08, 13, 15 |

## Conventions

| Convention | Rule |
|---|---|
| Artifact ids | Instance ids follow the canonical scheme (`INT-104`, `WO-104-01`, `FV-depmod-1.0`, `EP-depmod-1.0-prod`, `QR-depmod-1.0-01`, `ATT-104-01-p1`, `CAND-104-01-01`, `EV-104-09`, `VER-104-01`, `DEC-104-03`). Mission Control uses opaque Convex ids; the tutorials show those as `<factoryDefinitionVersionId>` placeholders and never invent values |
| Status words | Available / Experimental / Planned / Proposed, each with its limitation, mapped from Mission Control's ledger vocabulary |
| Commands | Only commands that exist in the repository: `pnpm run …` scripts from `package.json`, `scripts/mc` subcommands, `npx convex run <module>:<function>`, and Node scripts under `scripts/`. `QUICK_START.sh` is a legacy Telegram/agent-runner script and is not used |
| Numbers | Durations are illustrative planning estimates, not measurements |
| Spelling | Work Order in prose, `WorkOrder` in code identifiers |

## Related

- [/guides](/guides) — the ten build guides; each tutorial names the guide it supports
- [/framework/delivery-loop](/framework/delivery-loop) · [/framework/factory-lifecycle](/framework/factory-lifecycle)
- [/specification](/specification) — the nineteen artifacts the tutorials produce
- [/mission-control](/mission-control) — capability ledger and admission model
- [/patterns](/patterns) · [/anti-patterns](/anti-patterns) · [/glossary](/glossary)
