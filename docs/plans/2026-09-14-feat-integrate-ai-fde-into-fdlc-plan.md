---
title: "feat: Integrate AI-FDE into FDLC"
type: feat
status: active
date: 2026-09-14
approved: true
---

# Integrate AI-FDE into FDLC

## Approved outcome

Make **AI-FDE — AI Factory Deployed Engineer** a first-class FDLC product. Keep `/deploy` as its canonical public page and compose its operational cockpit at `/deploy/app`. Import AI-FDE source into `products/ai-fde/` with provenance while preserving independent web, API, worker, data, infrastructure, failure, credential, and release boundaries.

This approval authorizes implementation, testing, review, commits, pushes, pull requests, qualified merges, and exact-main qualification through the milestones below. It does not authorize Production release, live customer data, live model calls, or dormant qualification-environment activation.

## Architecture invariants

1. FDLC defines the operating model.
2. AI-FDE is a product/system.
3. Factory Deployed Engineer (FDE) is the accountable human role.
4. AI-FDE augments rather than replaces the FDE.
5. Factory Definition is AI-FDE's canonical governed output.
6. Factory Definition is the canonical bridge into Mission Control.
7. Factory Definition is not Factory Version.
8. Mission Control owns governed runtime qualification, Factory Versions, WorkOrders, Attempts, execution evidence, verification, approval, release, recovery, and outcome lineage.
9. Enterprise source evidence is not Mission Control execution evidence.
10. Repository convergence does not imply runtime convergence.
11. Synthetic evidence is not live evidence.
12. Merge is not Production release.
13. Microfrontend routing is not authorization.
14. Capability and maturity claims remain evidence-backed.
15. Runtime and provider infrastructure remain independently deployable.

## Canonical product model

| Concept | Definition | Public framing |
| --- | --- | --- |
| FDLC | Framework, lifecycle, architecture, and discipline | Defines it |
| Factory Deployed Engineer | Accountable human who owns architecture, judgment, authority, adoption, and outcomes | Owns it |
| AI-FDE | Evidence-driven engineering product that discovers how work happens, models current state, designs the governed factory, and produces verified implementation intent | Discovers and designs it |
| Factory Definition | Inspectable, versionable, diffable, reviewable, attributable governed implementation intent describing what factory should exist | Specifies it |
| Mission Control | Governed execution and decision system of record | Governs it |
| Factory / workers / Fab | Bounded execution capabilities and operating system | Executes it |
| Outcome | Validated result that may inform controlled learning or promotion | Proves it |

Retire “FDLC Deploy,” “Factory Engineer,” and product-level “FDE” as current public names. Preserve `ai_fde`, `AI_FDE_*`, historical evidence, compatibility aliases, and other internal identifiers where broad renaming would add operational risk. Fab remains a distinct execution/engineering capability; do not collapse Fab, AI-FDE, Mission Control, or Factory into one product.

## Canonical bridge

```text
Enterprise source evidence
  → current-state model
  → candidate claims
  → human review
  → verified operating intent
  → approved Factory Definition
  → qualification/package material
  → Mission Control validation
  → qualified immutable Factory Version
  → WorkOrder / bounded execution
  → independently verified outcome
```

The Factory Definition describes **what factory should exist**. Mission Control validates the definition and transforms approved intent into a qualified immutable runtime composition. AI-FDE must not silently create or activate a Factory Version.

The Factory Definition progressively covers objective, workflow, source lineage, target workflow, repositories, systems, actors, agents, models, Agentic SDKs, Agent Harnesses, Coding Harnesses, tools, capabilities, Capability Implementations, context and retrieval, execution environment, runtime, sandbox, Work Graph, orchestration, policy, authority, approvals, verification, evidence, economics, budgets, reliability, recovery, rollout, rollback, outcomes, maturity, confidence, and known unknowns.

## Reviewed baseline

- FDLC baseline: `origin/main@22a76d8e709805fbe8da762ae4320295730a2a4e`.
- AI-FDE reviewed baseline: `jaydubya818/AI-FDE-Agent@9d335fa7c64fbb5fc482aa6d6fcb7c7b42879012`.
- AI-FDE qualified source: `jaydubya818/AI-FDE-Agent@21305bbdb64b86bade75f4673d3e1a8233a2922e` (full CI, fast checks, and Vercel passed on 2026-09-14).
- The original FDLC checkout is dirty and based on `026d0fba1838466f06417313a28216306efcbca7`; preserve it unchanged.
- The reviewed baseline's full CI failed because its pinned MinIO image was unavailable, and its Vercel build depended on missing safety environment variables. Both defects were repaired in AI-FDE PR #5 and qualified on the exact merged source above.
- FDLC already has content-addressed, schema-validated, fail-closed Vercel Microfrontends composition and a policy separating merge from Production.

## Target repository and routing

```text
FDLC repository
├── app/                         # public FDLC site and /deploy
├── packages/                    # shared/runtime packages
├── products/ai-fde/
│   ├── apps/web/                # /deploy/app and deep links
│   ├── apps/api/
│   ├── apps/worker/
│   ├── src/ai_fde/
│   ├── migrations/
│   ├── infrastructure/
│   ├── docs/
│   └── tests/
├── data/
├── docs/
├── microfrontends.json
└── .github/workflows/
```

Keep the FDLC root npm toolchain and AI-FDE's uv/pnpm toolchains explicit. Do not reorganize the entire repository or force package-manager unification. `/deploy` remains the only marketing URL; `/deploy/app` and `/deploy/app/:path*` belong deterministically to the AI-FDE child application.

## Milestone A — AI-FDE becomes part of FDLC

- [x] Create a clean isolated branch/worktree from current `origin/main`; preserve the dirty checkout.
- [x] Fix AI-FDE current-source full CI, including the unavailable MinIO dependency, and diagnose the current-source Vercel failure.
- [x] Run migrations, integration/isolation tests, static checks, builds, browser tests, and accessibility tests against the fixed source.
- [x] Import AI-FDE into `products/ai-fde/` using a provenance-preserving subtree or unrelated-history merge.
- [x] Record original repository, source SHA, tree digest, timestamp, MIT license, and import strategy in `docs/migrations/ai-fde-repository-import.md`.
- [x] Move executable AI-FDE workflows to root `.github/workflows/` with explicit path filters; make the full gate required and tier/remove misleading duplicates.
- [x] Update build contexts, scripts, Compose, migrations, Terraform paths, documentation, ownership, and release boundaries for the prefix.
- [x] Add a typed Factory Definition product model and typed AI-FDE → Mission Control handoff contract.
- [x] Rebrand `/deploy` using eyebrow “AI FACTORY DEPLOYED ENGINEER” and H1 “Turn how your organization builds software into a governed AI software factory.”
- [x] Add primary “Launch synthetic demo” and secondary “See how AI-FDE works,” “Assess readiness,” and “Build a Factory Definition” actions.
- [x] Update global/mobile/footer navigation, homepage ecosystem, About, Enterprise, Guide mappings, Start, Maturity, sitemap, metadata, structured data, tests, and corpus references.
- [x] Remove raw infrastructure coordinates from public UI and replace them with bounded status, qualification date, limitations, and a sanitized evidence link.
- [x] Commit, push, open a Milestone A PR, pass CI, merge when qualified, and run exact-main qualification without releasing Production.

**Complete when:** AI-FDE is canonical in FDLC source, docs, navigation, terminology, Factory Definition architecture, and public Preview.

## Milestone B — AI-FDE becomes usable from FDLC

- [x] Make the AI-FDE web app prefix-native beneath `/deploy/app`; verify Links, router navigation, forms, return URLs, errors, assets, callbacks, refresh, deep links, 404, logout, and back/forward.
- [x] Proxy the exact `/deploy/app/:path*` namespace to an independently deployed AI-FDE child pinned by immutable Preview URL; keep the paid Microfrontends group limited to the existing Guide applications and preserve paired rollback through the shell's exact child binding.
- [x] Preserve the synthetic adapter's zero live API calls, zero customer data, zero Production credentials, zero model calls, zero Mission Control writes, invalid fallback origin, explicit simulated labels, and fail-the-build safety configuration.
- [x] Align the cockpit to the FDLC logo, paper/surface/ink/green/amber tokens, semantic states, typography hierarchy, buttons, focus, borders, and spacing through a versioned/shared token contract.
- [x] Preserve operational density and a compact AI-FDE shell with a clear return to FDLC; do not flatten the cockpit into a marketing page.
- [x] Add/promote a first-class Factory Definition surface with version, status, lineage, unresolved claims, workflows, capabilities, implementations, execution architecture, verification, authority, economics, rollout, rollback, outcomes, readiness, review, diff, approval/rejection, export, copy, download, and handoff preparation.
- [ ] Qualify visitor, synthetic evaluator, returning operator, real authorized operator, and failure/recovery flows.
- [ ] Test loading, not-started, none-found, blocked, error, partial, stale, conflict, permission-denied, degraded-sync, success, and durable-success states without color-only meaning.
- [x] Validate desktop, tablet, 390×844 mobile, 200% reflow, keyboard, reduced motion, contrast, targeted screen reader, hard refresh, and deep links.
- [x] Capture before/after and operational screenshots for PR review.
- [ ] Commit, push, open a Milestone B PR, pass child/site/composed CI, merge when qualified, and run exact-main qualification without releasing Production.

**Complete when:** a visitor can move from FDLC → AI-FDE → synthetic demo → source evidence → claim review → Factory Definition → explained Mission Control handoff without leaving the canonical FDLC experience.

## Milestone C — AI-FDE becomes operationally qualified

- [ ] Preserve independent FastAPI, worker, PostgreSQL, object storage, migrations, provider, and Terraform deployment and failure boundaries.
- [ ] Qualify Auth0/OIDC callbacks, cookie domain/path, CORS, CSP `connect-src`, CSRF, expiry, reauthentication, logout, and engagement authorization. MFE routing remains non-authoritative.
- [ ] Preserve row isolation, server authorization, upload limits, storage boundaries, provenance, human approval, immutable digests, fail-closed readiness, sanitized errors, and source-map hygiene.
- [ ] Implement the typed handoff: approved Factory Definition → qualification/package material → Mission Control validation of version, digest, provenance, approval, currentness, requirements, authority, policy compatibility, and qualification state.
- [ ] Ensure Mission Control rejects arbitrary AI-FDE state and remains the sole owner of Factory Version creation/qualification and governed execution.
- [ ] Run frozen installs, Ruff, mypy, unit, integration, isolation, Alembic, frontend contract, Terraform, non-root container, browser, accessibility, auth, routing, header, cookie, CSRF, sanitization, recovery, and zero-network demo gates.
- [ ] Perform a clean-environment rehearsal from clone through FDLC build, AI-FDE build, synthetic demo, Factory Definition, and composed Preview; record tools, commands, SHAs, config digest, screenshots, and results.
- [ ] Commit, push, open a Milestone C PR, pass all required CI, merge when qualified, and run exact-main qualification without releasing Production.
- [ ] Leave the prior AI-FDE repository available/read-only with a migration notice after the canonical import is accepted; do not delete it.

**Complete when:** the real product boundary is qualified without treating synthetic/demo results as live operational evidence.

## Release and rollback boundary

- Preserve `git.deploymentEnabled.main = false`.
- Source merge does not authorize Production.
- Keep the AI-FDE child and FDLC shell independently controlled.
- For any later authorized Production release: produce and verify exact child → bind a production AI-FDE origin in an explicit release change → produce and verify exact shell/proxy → promote child → promote shell → verify `/deploy` and `/deploy/app` → observe → retain the exact compatible rollback pair.
- Rollback must restore both the compatible routing/config digest and compatible child application. Never roll back only one side of an incompatible pair.

## Deferred

Live customer data, design-partner activation, live Bedrock qualification, billing, self-service onboarding, customer administration, multi-region runtime, broad package/database/environment renaming, runtime convergence with Mission Control, repository-wide reorganization, package-manager unification, and broad analytics remain out of scope.

## Acceptance criteria

- [ ] AI-FDE is consistently presented as a product/system and FDE as the accountable human.
- [ ] Factory Definition is the first-class canonical AI-FDE output and Mission Control bridge.
- [ ] Factory Definition and Factory Version are never interchangeable in schema, UI, tests, or docs.
- [ ] `/deploy` and `/deploy/app` work on the composed FDLC Preview with prefix-safe deep links.
- [ ] Public capability/maturity claims are current, bounded, and free of raw infrastructure coordinates.
- [ ] Full FDLC, full AI-FDE, and composed gates are green on exact source revisions.
- [ ] The synthetic demo makes zero live calls and cannot fall through to a live service.
- [ ] The public site and every AI-FDE operational service remain independently deployable and recoverable.
- [ ] No Production release or live-system activation occurs without separate explicit authorization.

## 2026-09-14 UX follow-up

The PR45 reconciliation adds a byte-checked FDLC shell contract in the independently built child, removes duplicate branding, and retains the operational rail. The governing lifecycle is **intent → planning → execution → evidence → verification → approval → release → outcomes → learning**; the Factory Definition handoff is a narrower design/qualification boundary within that lifecycle. Local evidence and unresolved deployment gates are recorded in [the acceptance review](../reviews/2026-09-14-ux-acceptance.md). Milestone C live operational items remain unqualified.

### Immutable shell binding follow-up

The unified child UI was qualified at source `065563d5feffb2efe8752603c7324acfcb10891c` and merged by #45. Both `/deploy/app` rewrites now target `https://ai-hu09aqvzj-jaydubya818.vercel.app` (`dpl_Gyrz6d2GxRA7TxsBSMq81C8DSH63`). The old compatible child is `ai-pvrsq6rnm-jaydubya818.vercel.app`; restore both rewrite entries together to roll back. Keep the Guide's compatible canonical snapshot with its shell. This binding is Preview-only; Production promotion and Milestone C remain separately controlled.

### AI-FDE navigation correction

AI-FDE must first explain the product at `/deploy`. An adjacent dropdown exposes **Engagement workspace** at `/deploy/app`, with the same hierarchy on desktop, mobile, and the independently deployed child. Implementation and qualification evidence are tracked in [the navigation review](../reviews/2026-09-14-ai-fde-navigation.md). This correction does not complete any real Auth0 or live operational Milestone C items.

UI PR #51 merged the correction as `53017b83aa615b593207962f7d9c3ccde0beb988`. Its inspected immutable child is `ai-of84ak7sr-jaydubya818.vercel.app` (`dpl_5FfyMrXQr4FydCuV8cEH5yNGZRN3`). The follow-up binding replaces both rewrites together; the compatible prior child is `ai-hu09aqvzj-jaydubya818.vercel.app`. Exact qualification and composed evidence remain linked from the navigation review.

The composed explanation/dropdown/workspace journey passes on protected Preview `fdlc-qkejscgde-jaydubya818.vercel.app` at binding source `bd14d20380498e844ebd83483f7a7b35581b8338`, with desktop/tablet/mobile navigation, engagement refresh/back/forward, 200% reflow, zero browser errors/API requests, and all 12 child script digests matching. Final binding and exact-main qualification are tracked in [PR #52](https://github.com/jaydubya818/FDLC/pull/52). This evidence completes the navigation correction's visual review, not live operational qualification or Production release.
