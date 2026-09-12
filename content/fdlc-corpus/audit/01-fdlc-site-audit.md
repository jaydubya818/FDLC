# FDLC.ai Site and Repository Audit

Date: 2026-09-11 (revised against near-main source)
Primary source: `/home/claude/repos/FDLC-main` — worktree on `codex/production-reliability-fdlc`, rebased on `origin/main` `0ba3e27` (2026-09-10); `origin/main` is now `ff7b25f`. All `path:line` citations below are relative to this worktree unless prefixed `FDLC/` (the stale `codex/updateui` checkout, used only for the repo-hygiene note in §3.9).
Live comparison: `https://fdlc.ai` fetched 2026-09-11 — 14 routes, `sitemap.xml`, `robots.txt`, `/guide/sitemap.xml`, `/guide/glossary`, `/guide/architecture`, one Guide chapter.

Two caveats:

1. **The worktree is one or two commits behind `origin/main`.** Live `/architecture` carries an "Agentic system stack" section (six layers: Control Plane, Orchestrator, Agentic SDK, Agent Harness, Agent, Model) and an "Agentic SDK" vocabulary term that are absent from `data/execution-taxonomy.ts` (20 terms) and `app/architecture/page.tsx` (no stack section). Those are treated as live-only and cited from the fetch.
2. **The worktree copy is filtered.** `app/globals.css` (read by `tests/unit/source-reconciliation.test.ts:68`), `app/components/copy-button.tsx` (imported by `app/mission-control/page.tsx:5`), `public/`, `packages/fab/`, `docs/fab/`, `scripts/check-built-design-system.mjs` (referenced by `package.json:14`, `README.md:68-70`) are not present. The requester-reported ≈85 MB evidence tree, `" 2.tsx"` duplicates, `.worktrees`, and `nonexistent` directory could not be verified in either copy; see §3.9.

---

## 1. Executive summary

### What exists

FDLC.ai is a data-driven Next.js 16 / React 19 site composed with the separately-deployed AI Software Factory Guide via Vercel Microfrontends (`microfrontends.json`, `next.config.ts:1-6`, `README.md:30-47`). Canonical content lives in nine typed modules under `data/`. The framework is stated as **four views** — 7-stage factory lifecycle, 9-step runtime lifecycle, 6-area architecture (Intent, Harness, Capability, Model, Trust, Learning), 11-object artifact protocol (`data/fdlc.ts:39-172`) — plus 10 manifesto principles, a 6-level / 11-dimension maturity model, 12 outcome metrics, and one worked example. Near-main adds, in data: a 20-term execution vocabulary and 7-step relationship chain (`data/execution-taxonomy.ts`), six system-design decisions with invariants and five Mission Control enhancement priorities (`data/system-design.ts`), five production operating contracts and five incident requirements (`data/production-operations.ts`), an enterprise reference architecture with three routing levels, nine platform services, four factory types, and a Factory Version lifecycle (`data/enterprise.ts`, `app/enterprise/page.tsx`), an 11-object Mission Control admission model and 16-row capability matrix (`data/mission-control.ts`), and a Factory Deployed Engineer services page with its own six-stage workflow and twelve-concern Factory Definition (`app/deploy/fde-content.ts`). Interactive tools: maturity assessment with per-level next action (`app/components/maturity-assessment.tsx:40-52`), Factory Definition builder with Markdown copy/download (`lib/factory-definition.ts:68-116`).

### What is strong (preserve — full list in §8)

- The **control-boundary thesis** ("Allow intelligence to vary. Always bound authority." `app/architecture/page.tsx:59`) with the Expected-to-change / Required-to-persist split (`:60-63`), and the **non-collapsible state boundary** (`app/components/state-boundary.tsx:29`).
- **Evidence-bound design decisions**: each of the six decisions carries problem, decision, rationale, invariant, failure behavior, status, evidence, and relationship (`data/system-design.ts`), enforced by `tests/unit/source-reconciliation.test.ts:9-16`.
- **Honesty discipline**: 16 capabilities each with a `limitation` (`data/mission-control.ts:1-18`), pinned by exact-text tests (`source-reconciliation.test.ts:18-39`); "Proposed"/"Required"/"Illustrative"/"Dormant" labels; "Missing cost is never zero" (`system-design.ts:61`).
- The **execution vocabulary** (`data/execution-taxonomy.ts`) — the site's answer to the harness/loop/runtime/control-plane ambiguity.
- The **typed data layer + sequence-pinning tests** (`tests/unit/content.test.ts:15-21`).

### The ten biggest gaps

| # | Gap | Evidence | Priority |
|---|-----|----------|----------|
| 1 | **Eleven ordered sequences and seven layer/plane models are published with no reconciliation matrix** (full catalog in §4). `data/fdlc.ts` now carries *two* runtime sequences (`runtimeLifecycle` 9 steps `:39-49` and `guideValueStream` 8 stages `:51-60`); the homepage hard-codes a third 4-step model (`app/page.tsx:52-55`) and a fourth 5-verb chain (`:15`); `/deploy` adds three more. `docs/FDLC_PRODUCTION_RELIABILITY_REVIEW.md:71` says "No second lifecycle or architecture stack" — the source contradicts the policy. | both | P0 |
| 2 | **Factory Version is defined in three places and is first-class in none of the framework's canonical structures.** Definitions: `data/execution-taxonomy.ts:17`, `data/mission-control.ts:21`, `app/enterprise/page.tsx:88-89`. Absent from `protocolSteps` (`data/fdlc.ts:160-172`), `/specification` (`app/specification/page.tsx:12,29`), and `lifecycleStages` outputs (prose only, `data/fdlc.ts:85-86`). | both | P0 |
| 3 | **`/specification` is a placeholder**: 11 names, one identical four-line card per entity (`app/specification/page.tsx:29`), six "associated objects" as bare words (`:12`), a route list whose last id (`learning`, `:41`) does not match the data id (`learning-signal`, `data/fdlc.ts:171`). Mission Control's 11-object admission model (`data/mission-control.ts:20-32`) is a second, unmapped eleven. | both | P0 |
| 4 | **The enterprise reference architecture lives only on the "Design partnership" commercial page.** Three routing levels (`data/enterprise.ts:39-43`), two evidence levels (`app/enterprise/page.tsx:78-85`), nine platform services (`data/enterprise.ts:19-29`), Factory Version lifecycle (`app/enterprise/page.tsx:89`), and readiness controls (`data/enterprise.ts:52-57`) are not referenced from `/framework`; `/architecture` links out with one sentence (`app/architecture/page.tsx:77-80`). | both | P0 |
| 5 | **Infrastructure identifiers are published** on `/deploy` and in the README: AWS account, region, qualification hostname, Convex deployment, Mission Control workspace/project IDs, Vercel deployment IDs (`app/deploy/fde-content.ts:77-87`, `app/deploy/page.tsx:231-236`, `README.md:64`). | both | P0 |
| 6 | **Standards governance is absent**: no license, changelog, versioning policy, RFC process, or FDLC repository link ("Open framework · v0.1", `app/page.tsx:34`; header GitHub → Mission Control, `app/components/site-header.tsx:70`; footer "Source audit" → the Guide repo, `lib/global-navigation.ts:35`). | both | P0 |
| 7 | **Canonical host is contested.** Source declares `https://www.fdlc.ai` as canonical (`lib/site.ts:2`, `proxy.ts:4`, `microfrontends.json:8`, tested at `tests/unit/routing.test.ts:17-21`); the apex `fdlc.ai` serves every page with HTTP 200 and no redirect to www (observed); the 2026-09-06 release record states the opposite ("`www.fdlc.ai` intentionally returns 308 to `fdlc.ai`"). Two hosts, one canonical, no host-level redirect either way. | live | P1 |
| 8 | **Diagrams**: nine of ten visual components are CSS grids/lists with no arrows or flow (`app/components/*-diagram.tsx`, 15–26 lines each). The single raster architecture diagram is a PNG "supplied by Jay West" on `/enterprise` (`app/enterprise/page.tsx:31-36`). Nothing is SVG; nothing but that PNG is exportable. | both | P1 |
| 9 | **Methodology is not executable**: lifecycle stages have purpose/activities/output only (`data/fdlc.ts:81-89`); no entry/exit criteria, roles, or templates. Three incompatible "Factory Definition" shapes exist: `lib/factory-definition.ts:10-21` (10 fields, `0.1-draft`), `app/deploy/fde-content.ts:10-23` (12 concerns), `docs/FDLC_CONTENT_MODEL` (stale checkout; adds `generatedAt`). | both | P1 |
| 10 | **Orphaned and stale surfaces**: `FactoryExplorer` (`app/components/factory-explorer.tsx`, 225 lines, the only interactive integration of runtime × capabilities × example) is rendered by no route yet still tested as "the homepage factory explorer" (`tests/unit/content.test.ts:23`); `/guide` and `/guide/[slug]` are rollback shadows (`app/guide/page.tsx:37`); `app/mission-control/page.tsx:115` still links `/spec`; `data/guide.ts:123` still says "Forward-Deployed Engineering" while the site says "Factory Deployed Engineer". | both | P1 |

---

## 2. Inventory

### 2.1 Routes — near-main source vs live

| Route | Source (`FDLC-main`) | Live delta |
|---|---|---|
| `/` | `app/page.tsx` (107 lines): hero with problem line, audience line, SDLC/FDLC contrast (`:39-42`), hard-coded 4-step operating model (`:52-55`), statement band, 4-step illustrative example (`:13-18`), "Why FDLC" ×3 (`:76-78`), 4 action cards (`:20-25`), Mission Control preview, FDE/Enterprise CTA | Matches live. |
| `/framework` | `app/framework/page.tsx` (151 lines): 13 sections; four views; `LifecycleDiagram`, `RuntimeLifecycleDiagram`, `ArchitectureDiagram`, `ProtocolDiagram`, `CategoryDistinction`, `StateBoundary` | Matches. |
| `/architecture` | `app/architecture/page.tsx` (147 lines): control boundary, execution vocabulary (20 terms), "Across factories" pointer, six areas, five practices, six design decisions, five production contracts, system flow | Live adds "Agentic system stack" (6 layers) + "Agentic SDK" term — post-worktree commit. |
| `/in-5-minutes` | `app/in-5-minutes/page.tsx` (177 lines): 10 sections over `data/dependency-modernization-example.ts` | Matches. |
| `/manifesto` | `app/manifesto/page.tsx`: 10 principles + `StateBoundary` | Matches. |
| `/guide`, `/guide/[slug]` | Rollback shadows: "This shadow page remains only as a reversible cutover surface" (`app/guide/page.tsx:37`); MFE routes `/guide/:path*` to the Guide app (`microfrontends.json:14-18`) | Live serves the Guide app: 76 URLs (`/guide/sitemap.xml`), chapters, atlas, topics, glossary, search. |
| `/mission-control` | `app/mission-control/page.tsx` (117 lines): 6-stage flow, 11-object admission model, 5 implementation layers, 16 capabilities (7 Available / 8 Experimental / 1 Planned), 5 development priorities, 5 incident requirements, quickstart | Matches. |
| `/specification`; `/spec` → 308 | `app/specification/page.tsx` (48 lines); `app/spec/page.tsx` redirect preserving query (`lib/routing.ts`) | Matches. |
| `/maturity` | `app/maturity/page.tsx` + `maturity-assessment.tsx` (level-keyed next action `:40-49`) | Matches. |
| `/benchmarks` | `app/benchmarks/page.tsx`: 12 metrics, 3 comparable-results cards, Guide links via `guideRoot` | Matches. |
| `/enterprise` | `app/enterprise/page.tsx` (108 lines) over `data/enterprise.ts`: operating model + PNG diagram, 3 scale dimensions, 7-step example flow, 9 platform services, 5 reusable capability classes, 4 factory types, 3 routing levels + WO-101…107 worked objective, 2 evidence levels, Factory Version lifecycle, 4 readiness controls, 4-step adoption, `support@fdlc.ai` | Matches. |
| `/deploy` (nav "FDE") | `app/deploy/page.tsx` (249 lines) over `app/deploy/fde-content.ts`: 6-stage FDE workflow, 12-concern Factory Definition, 3 phases, 10 deliverables, 9 lighthouse candidates, before/after, 6 FDE metrics, product tour, qualification identity ledger | Matches. |
| `/start` | `app/start/page.tsx` + `factory-builder.tsx` (copy/download Markdown) | Matches. |
| `/about` | `app/about/page.tsx` | Matches. |
| `/examples/dependency-modernization` | 308 → `/in-5-minutes` | — |
| `/sitemap.xml` | 13 routes, hard-coded `lastModified: "2026-09-04"` (`app/sitemap.ts:7`); `/guide` intentionally excluded (`tests/unit/routing.test.ts:23`) | Matches; hostname `www.fdlc.ai`. |
| `/robots.txt` | Allows all incl. GPTBot/Google-Extended/OAI-SearchBot; two sitemaps (`app/robots.ts:13`) | Matches. |
| `/error`, `/not-found` | `app/error.tsx`, `app/not-found.tsx` with Guide search fallback | — |

**Navigation** (`lib/global-navigation.ts`): primary Framework · Architecture (`:4-7`); Guide ▾ Overview · Atlas · Reference · Glossary · Search (`:9-15`); Mission Control · FDE · Maturity (`:17-21`); More ▾ FDLC in 5 Minutes · Manifesto · Start · Enterprise · About (`:23-29`). Specification and Benchmarks are footer/contextual only, enforced by `tests/rendered-html.test.mjs:14-38` ("global More stays focused while contextual artifacts remain discoverable"). The Guide consumes a generated copy (`README.md:80-84`).

### 2.2 Content models (`data/`)

| File | Exports (count) | Role |
|---|---|---|
| `fdlc.ts` (236) | `canonicalDefinition`, positioning ×2, `categoryComparison` (3), `categoryTransitions` (2), `runtimeLifecycle` (9), **`guideValueStream` (8, `:51-60`)**, `factoryControls` (4), `factorySystemComponents` (10), `ecosystemRoles` (5), `lifecycleStages` (7), `architectureAreas` (6), `protocolSteps` (11), `manifesto` (10), `maturityLevels` (6), `maturityDimensions` (11), `metrics` (12), `factoryLines` (6) | Canonical four views + Guide stream |
| `execution-taxonomy.ts` (32) | `executionTaxonomy` (20 terms: Model, Agent, Agent Loop, Agent Harness, Coding Harness, IDE Harness, Work Graph, Orchestrator, Runtime, Sandbox, Capability, Capability Implementation, Control Plane, Factory, Factory Platform, Factory Version, Loop/Graph/Harness Engineering, AI Harness), `executionRelationship` (7) | Vocabulary |
| `system-design.ts` (113) | `systemDesignDecisions` (6), `missionControlEnhancements` (5) | Design decisions |
| `production-operations.ts` (60) | `productionOperatingContracts` (5), `missionControlIncidentRequirements` (5) | Reliability |
| `enterprise.ts` (64) | `enterpriseStages` (7), `enterpriseScale` (3), `enterprisePlatformServices` (9), `enterpriseReusableCapabilities` (5), `enterpriseRouting` (3), `enterpriseFactories` (4), `enterpriseControls` (4), `enterpriseAdoption` (4), `enterpriseGuideHref` | Enterprise architecture |
| `mission-control.ts` (34) | `missionControlCapabilities` (16), `missionControlObjects` (11), `missionControlTimeline` (11) | Reference implementation |
| `guide.ts` (139) | `guideRoot = "/guide"`, `guideParts` (6/44), `guideEntryPaths` (6), `proposedGuideMap` (25) | Guide portal |
| `factory-explorer.ts` (246) | 10 capabilities × 9 stages | **Unused by any route** |
| `dependency-modernization-example.ts` (76) | Example over all four views; 11 record IDs | Worked example |
| `context-skills-practices.ts` (8) | 5 practices | Architecture |
| `app/deploy/fde-content.ts` (87) | `fdeWorkflow` (6), `factoryDefinition` (12), `engagementPhases` (3), `deliverables` (10), `lighthouseCandidates` (9), `qualificationFacts` (6), deployment IDs | FDE (data outside `data/`) |

### 2.3 Components (`app/components/`)

| Component | Lines | Client | Rendered by | Notes |
|---|---|---|---|---|
| `architecture-diagram.tsx` | 16 | no | `/framework`, `/architecture` | Six `<Link>` cards |
| `lifecycle-diagram.tsx` | 26 | no | `/framework` | `<ol>` + controls band; `ResponsiveDetails` |
| `protocol-diagram.tsx` | 19 | no | `/framework`, `/specification` | `<ol>` |
| `runtime-lifecycle-diagram.tsx` | 15 | no | `/framework` | `<ol>` |
| `state-boundary.tsx` | 40 | no | 5 routes | "≠" sequence |
| `category-distinction.tsx` | 26 | no | `/framework` | table + 2 transitions |
| `factory-explorer.tsx` | 225 | yes | **none** | Orphaned |
| `factory-builder.tsx` | 126 | yes | `/start` | Copy/download, focus management |
| `maturity-assessment.tsx` | 63 | yes | `/maturity` | Level-keyed next step |
| `mission-control-experience.tsx` | 206 | yes | `/mission-control`, `/deploy` | 6-stage flow + 3 screenshots |
| `page-contents-nav.tsx` | 82 | yes | long pages | Rail/floating/mobile ToC |
| `site-header.tsx` | 146 | yes | all | Keyboard-accessible dropdowns from `lib/global-navigation.ts` |
| `site-footer.tsx`, `site-shell.tsx`, `page-hero.tsx`, `status-badge.tsx`, `responsive-details.tsx`, `copy-value.tsx` | 32/8/36/4/29/22 | mixed | — | Shell |
| `copy-button.tsx` | — | — | `/mission-control:5` | **Absent from this copy** |

### 2.4 Library, build, CI

- `lib/site.ts:2` — `siteUrl` defaults to `https://www.fdlc.ai`. `lib/metadata.ts` — one `/og.png` for every route. `lib/maturity.ts:19` — `Math.floor(average)`. `lib/factory-definition.ts` — generator + Markdown export. `lib/routing.ts` — query-preserving redirect helper. `lib/global-navigation.ts` — canonical nav.
- `next.config.ts` — `withMicrofrontends`. `proxy.ts` — legacy Guide-host redirects, gated by `GUIDE_LEGACY_REDIRECTS_ENABLED`. `scripts/check-microfrontends-config.mjs` — digest-pinned config guard (`expectedDigest` `:7`).
- Two build paths remain: `vinext` + Cloudflare worker (`package.json:9-11`, `npm test` builds it) and `next build` for Vercel (`build:vercel`). CI (`.github/workflows/ci.yml`) runs both plus Playwright suites on `macos-26` because the Fab package's native bridge is macOS-only (`:15-16`).
- `vercel.json` — `git.deploymentEnabled.main=false` guard, pinned by `tests/unit/source-reconciliation.test.ts:41-46`.

### 2.5 Docs (7 files, 76 KB in this copy)

`FDLC_SYSTEM_DESIGN_REVIEW.md` (293 lines; decision record for the six decisions and MC priorities), `FDLC_EXECUTION_TERMINOLOGY_REVIEW.md` (vocabulary decision + nine MC enhancements + acceptance criteria), `FDLC_PRODUCTION_RELIABILITY_REVIEW.md` (five contracts; "No second lifecycle or architecture stack"), `MISSION_CONTROL_PUBLIC_CAPABILITIES.md` (20-row matrix with source evidence; public copy rules 1–6), `FDLC_SITE_SOURCE_AUDIT.md`, `design-system.md`, `ui-polish-review.md`. The stale checkout's `FDLC_CONTENT_MODEL`, `FDLC_SITE_INFORMATION_ARCHITECTURE`, `FDLC_DESIGN_SYSTEM`, `FDLC_IMPLEMENTATION_PLAN`, `FDLC_RELEASE_CHECKLIST`, brainstorms, plans, releases, and integrations are not in this copy; `README.md:68-70` references `docs/fab/*` which is also absent.

### 2.6 Tests

| File | Tests | Notes |
|---|---|---|
| `tests/unit/content.test.ts` | 6 | Pins four views, explorer ↔ runtime mapping (`:23-45`, test name says "homepage" — explorer is unmounted), guide counts, example mapping. |
| `tests/unit/source-reconciliation.test.ts` | 5 | Pins six decisions' field lengths, exact MC capability text, `vercel.json` guard, area contract strings, CSS selectors (`app/globals.css`, absent here), MC capabilities doc SHA. |
| `tests/unit/routing.test.ts` | 9+ | www origin (`:17-21`), no cross-origin Guide links, MFE schema/routing, legacy-host proxy. |
| `tests/unit/microfrontends-build.test.ts` | 5 | Build guard fails closed. |
| `tests/unit/factory-definition.test.ts` | 4 | Generator + Markdown. |
| `tests/rendered-html.test.mjs` | 20 | 13 routes; nav contract; spec redirect; design-decisions section (`:241-256`). Runs against the vinext worker. |
| `tests/browser.mjs` | — | Playwright: routes ×3 widths, axe, nav keyboard, flows. |
| **Missing** | — | No test for `lib/maturity.ts` despite `README.md:22` ("unit coverage for … maturity scoring"). |

---

## 3. Findings by dimension

### 3.1 Positioning

**Strengths.** The canonical definition (`data/fdlc.ts:2-3`) is one sentence, test-pinned, and repeated verbatim across `/framework` and `/in-5-minutes`. The hero pairs a problem statement ("Code generation is becoming abundant. Trusted autonomous software delivery is not." `app/page.tsx:35`), an audience line (`:38`), and the SDLC/FDLC contrast (`:39-42`). "Not another coding agent." appears on `/framework` (`app/framework/page.tsx:76`), `/mission-control` (`app/mission-control/page.tsx:37`), and `/deploy` (`app/deploy/page.tsx:44`). The three-category table with primary object and question answered (`data/fdlc.ts:8-24`) is the sharpest differentiation device. The "six operating shifts" (`app/framework/page.tsx:26-33`) — especially "Verification becomes the scarce resource" — are a genuine thesis.

**Weaknesses.**
1. **The coding-agent ≠ factory distinction is asserted in a sentence, never developed.** No page names it as a reusable contrast; the topic map routes "Coding Agents vs. Software Factories" to Guide chapter 1 (`data/guide.ts:104`). The homepage, the only page most visitors read, no longer contains the three-category table or the two transitions (`CategoryDistinction` is rendered only on `/framework`).
2. **"Agentic SDLC", agent frameworks, and adjacent standards are unaddressed.** The table uses "AI-Native SDLC". No comparison to DORA/SPACE, NIST AI RMF, ISO/IEC 42001, SLSA, or OWASP agentic guidance exists anywhere in source. The live "Agentic SDK" layer is the only framework-boundary statement and it is on the architecture page, not a positioning page.
3. **The homepage teaches a model the framework does not define.** "Define the outcome / Bound the work / Require evidence / Learn from outcomes" (`app/page.tsx:52-55`) and "Plan → Modify → Test → Verify → Approve" (`:15`) are hard-coded JSX, not data, not tested, not mapped to the nine-step runtime lifecycle.
4. **The name promises a lifecycle; the lifecycle is the thinnest view.** `lifecycleStages` is 9 lines of data (`data/fdlc.ts:81-89`); the runtime lifecycle, protocol, vocabulary, decisions, and enterprise model carry the substance.
5. **Standard-making claims without standard-making artifacts.** "Open framework · v0.1" (`app/page.tsx:34`), "Proposed standard" (`app/framework/page.tsx:20`), "Compatibility: Not yet claimable" (`app/specification/page.tsx:23`) — and no license, version history, governance, or contribution route (§3.9).

### 3.2 Architecture

**What the six areas do well.** Each has purpose, responsibilities, components, decisions, failure modes, five-step maturity, examples, and a relationship sentence (`data/fdlc.ts:91-158`). The Harness area was rewritten to match the vocabulary: "Turn model intelligence into bounded, observable agent operation" (`:104`), components "Agent Harness, Agent Loop, Orchestrator and Work Graph, Runtime, Sandbox, Harness adapter" (`:107`), failure mode "Calling a loop, runtime, or control plane a harness" (`:109`). The control-boundary map (`app/architecture/page.tsx:54-58`) and the durability split (`:60-63`) are precise.

**Boundary explicitness.**

| Concept | Where explicit | Assessment |
|---|---|---|
| Model vs Agent vs Agent Loop | `execution-taxonomy.ts:2-4` | Explicit. |
| Agent Harness vs Orchestrator vs Runtime vs Sandbox | `execution-taxonomy.ts:5,9-11`; relationship `:24-32` | Explicit in vocabulary. But all four still sit *inside* the area named "Harness" (`fdlc.ts:107,112`) — the area name is narrower than its contents. |
| Control Plane | `execution-taxonomy.ts:14` ("Enterprise authority") | Defined as a term; **not an area**. Control-plane responsibilities are split between Harness (state, leases) and Trust (policy, identity). Mission Control — the reference implementation — is a control plane mapped to no single area. |
| Factory / Factory Platform / Factory Version | `execution-taxonomy.ts:15-17` | Defined; Factory Version not in protocol/spec (§3.4). |
| Capability vs Capability Implementation | `execution-taxonomy.ts:12-13` | Explicit. Conflicts with "capability" = MC product feature (`mission-control.ts`) and "factory capabilities" = explorer's 10 items (`factory-explorer.ts:15-103`). |
| Verification / Trust | Trust area `fdlc.ts:137-146`; Verification Subject / Verifier Attempt `mission-control.ts:28-29` | Adequate; naming split (§5). |

**Enterprise-scale concerns** are represented only in `data/enterprise.ts` and `app/enterprise/page.tsx`: builder/repository/workload scale (`enterprise.ts:13-17`), nine platform services incl. identity, policy/compliance, evidence/audit (`:19-29`), tenancy/residency/DLP nouns (`:27,53-56`), three routing levels (`:39-43`), local vs global evidence (`enterprise/page.tsx:78-85`), Factory Version lifecycle (`:89`). The open `/architecture` references all this in one paragraph and two links (`app/architecture/page.tsx:77-80`). `docs/FDLC_SYSTEM_DESIGN_REVIEW.md:54` explicitly classifies "Multi-tenancy, noisy neighbors, regional failover, large fleets" as "Conditional later work".

**Requested first-class concepts — status in source.**

| Concept | Defined at | In framework data (`fdlc.ts`)? | In protocol/spec? |
|---|---|---|---|
| Factory Version | `execution-taxonomy.ts:17`; `mission-control.ts:21`; `enterprise/page.tsx:88-89`; `system-design.ts:72-78`; `fde-content.ts:4` (output of Assemble) | Prose in stage outputs only (`:85-86`) | No |
| Execution Profile | `mission-control.ts:22`; `enterprise.ts:36`; `execution-taxonomy.ts:25` | No | No |
| Capability registry | Area component (`fdlc.ts:118`); platform service (`enterprise.ts:22`); MC enhancement 7 (`docs/FDLC_EXECUTION_TERMINOLOGY_REVIEW.md`) | Name only | No |
| Factory registry | Implied by `enterprise.ts:45-50` "factory creation test"; not named | No | No |
| Multi-factory orchestration | `enterprise.ts:4-11`, `:39-43`; `architecture/page.tsx:78` | No | No |
| Objective planner | `enterprise.ts:5,40` ("Mission Control classifies the objective"); `system-design.ts:7` ("planner as replaceable intelligence") | No | No |
| Three routing levels | `enterprise.ts:39-43` (Objective / WorkOrder / Task; "Factory Router", "Capability Router") | No (Model area has one-level routing `:128`) | No |
| Context Package | `mission-control.ts:6` | No | No |
| Work Graph | `execution-taxonomy.ts:8`; Harness components `:107` | Yes (component name) | No |

**Structural problems.**
1. **Areas × layers matrix is missing.** Live adds a six-layer stack (Control Plane → Orchestrator → Agentic SDK → Agent Harness → Agent → Model). Six areas and six layers on one page, both numbered 01–06, with no table showing which layers each area owns.
2. **No flow, no sequence, no state machine.** The "system flow" section is six stacked cards (`app/architecture/page.tsx:131-141`); the `executionRelationship` chain is rendered as a `→`-joined sentence (`:72`).
3. **Guide divergence is acknowledged in policy but not in copy.** `docs/FDLC_PRODUCTION_RELIABILITY_REVIEW.md:56-60` admits the vocabulary "maps directly to the existing six architecture areas, the cross-cutting control and context planes, and adoption surrounding the factory" — i.e. the Guide has *three more* structural concerns (control plane, context plane, adoption) that the six-area model does not name. `/guide/architecture` (live) presents "six architectural planes" and calls the eight-stage stream "canonical".

### 3.3 Methodology

- Stages: `purpose`, four `activities`, one `output` (`data/fdlc.ts:81-89`). No entry/exit criteria, required artifacts, owners, or checklists. The example maps stages to one sentence each (`dependency-modernization-example.ts:19-27`).
- **The services page has a more operational lifecycle than the framework.** `fdeWorkflow` (`app/deploy/fde-content.ts:1-8`) gives each of six stages an `input`, `output`, and `evidence` — the structure the canonical seven stages lack — under different names (Define, Qualify, Transfer & Scale vs Design, Validate, Deploy/Improve). `enterpriseAdoption` (`data/enterprise.ts:59-64`) is a fourth adoption sequence (Scope/Prove/Expand/Operate).
- **Three Factory Definition shapes**: `lib/factory-definition.ts:10-21` (intent, acceptanceCriteria, planBoundaries, candidateWorkOrders, requiredCapabilities, authority, verificationContract, humanControls, outcomeMetrics); `app/deploy/fde-content.ts:10-23` (Intent, Workflow, Agents, Models, Tools, Context, Execution, Verification, Policy, Human Authority, Economics, Outcomes); `app/enterprise/page.tsx:55` ("outcome contract, ownership, planning semantics, capability composition, qualification, verification, authority, service objectives, and lifecycle"). The builder's Markdown export (`lib/factory-definition.ts:68-116`) implements the first; the FDE page markets the second.
- Authority: principle 3 (`fdlc.ts:177`), Trust decisions (`:141`), six builder checkboxes (`factory-builder.tsx:8`), "Human Authority" (`mission-control.ts:31`). No roles, delegation chain, or risk-class → autonomy-level matrix, although principle 7 says "Raise autonomy by risk class" (`fdlc.ts:181`).
- Maturity scoring: `Math.floor(average)` (`lib/maturity.ts:19`) — Security = 0 with ten 5s yields L4, contradicting "A failed authority or security gate cannot be averaged away" (`app/benchmarks/page.tsx:24`) and "Averaging a failed hard gate into a passing score" as a Trust failure mode (`fdlc.ts:142`). Untested.

### 3.4 Specification

`app/specification/page.tsx`: 11 `protocolSteps` names + `requiredProof` (`:28`); an entity grid where every card renders the same four `<dd>` strings (`:29`); six associated objects as words (`:12`); a route list (`:30-41`). Honest notice at `:26`.

| Target object | Present in `protocolSteps`? | Defined elsewhere in source |
|---|---|---|
| Mission | No (MC mapping of Intent, `fdlc.ts:161`) | — |
| Specification / Plan / WorkOrder / Evidence / Release / Outcome | Yes | — |
| Factory | No | `execution-taxonomy.ts:15` |
| Factory Version | No | `execution-taxonomy.ts:17`; `mission-control.ts:21` |
| Execution Profile | No | `mission-control.ts:22` |
| Capability | No | `execution-taxonomy.ts:12-13` |
| Context Package | No | `mission-control.ts:6` |
| Verification Attempt | No — protocol has Attempt (#5) and Verification (#7); the verifier's attempt is unmodeled | `mission-control.ts:28-29` (Verification Subject, Verifier Attempt) |
| Acceptance Decision | Conflated into Approval (#8): MC mapping "Plan approval + WorkOrder acceptance" (`fdlc.ts:168`) names two decisions | `mission-control-experience.tsx:54` ("Acceptance decision") |
| Learning Proposal | No — protocol #11 is Learning Signal | "Improvement Candidates" (`system-design.ts:74,78`); "human-reviewed proposals" (`mission-control.ts:12`) |

Also: no fields, state machines, invariants (beyond manifesto and decision invariants), JSON examples, conformance suite, versioning policy, or license. Route id `learning` (`:41`) vs data id `learning-signal` (`fdlc.ts:171`). The MC admission model (`mission-control.ts:20-32`) is an eleven that shares four names with the protocol eleven; `missionControlTimeline` (`:34`) is an eleven-step sequence that matches neither.

### 3.5 Education

**Assets.** `/in-5-minutes`; the Guide (44 chapters, 76 URLs, ~300+ glossary terms, seven role paths); `guideEntryPaths` (`data/guide.ts:92-99`); `proposedGuideMap` (25, `:101-127`); maturity assessment; Factory Definition builder; Mission Control quickstart; FDE "before/after" (`app/deploy/page.tsx:166-169`).

**The Guide dependency.** The Guide is a separate repository composed at `/guide` (`microfrontends.json`; `README.md:30-47`). Consequences in source: every Guide link must be an `<a>` not `<Link>` (`tests/unit/routing.test.ts:29-36`; eslint-disable banners on `app/page.tsx:1`, `app/architecture/page.tsx:1`, etc.); the local `/guide` route is a rollback shadow (`app/guide/page.tsx:37`); shared CSS and navigation are generated into the Guide and must be re-synced per release (`docs/design-system.md`, `README.md:80-84`); the Guide build "fails closed" if the FDLC digest drifts (`README.md:44`). Architecture, benchmarks, decisions, and reliability sections all link to Guide appendices (`app/architecture/page.tsx:50,74,109,118,127`) — the framework's depth now lives in Guide appendices that this repo cannot edit or test.

**Learning levels.**

| Level | Coverage | Gap |
|---|---|---|
| Beginner | Hero, `/in-5-minutes`, Guide ch1–3 | "AI software factory" is defined only as the vocabulary term "Factory" (`execution-taxonomy.ts:15`); no primer, no fdlc.ai glossary. |
| Practitioner | `/start`, quickstart, Guide Part III, "Factory System Design Playbook" appendix (linked, `architecture/page.tsx:118`) | No hands-on tutorial; Factory Definition is not runnable. |
| Architect | `/architecture`, vocabulary, decisions, Guide Part II | Areas × layers unmapped; no reference topology. |
| Enterprise | `/enterprise`, Guide "enterprise-multi-factory-delivery" appendix (`enterprise.ts:1`), readiness controls | On a commercial page; no compliance crosswalk, DR, SLOs. |
| Expert | — | No spec, conformance, certification, RFC process. |

Reading-time claims are hard-coded: "≈ 12 min" (`app/framework/page.tsx:54`), "≈ 10 min" (`app/architecture/page.tsx:46`) on a page that has since tripled.

### 3.6 Enterprise readiness

Coverage in source (near-main):

| Concern | Evidence | Assessment |
|---|---|---|
| Identity / authz | `enterprise.ts:21` (SSO/OIDC, RBAC/ABAC, workload identity, short-lived credentials); `:53` | Named, not modeled |
| Tenancy / isolation | `enterprise.ts:14,53`; MC "Cross-company production operation is not qualified" (`docs/MISSION_CONTROL_PUBLIC_CAPABILITIES.md`) | Named |
| Policy / compliance | `enterprise.ts:27` (residency, risk, DLP) | Nouns only; no crosswalk |
| Sandboxing / secrets | `execution-taxonomy.ts:11`; `enterprise.ts:25` (ephemeral credentials); `architecture/page.tsx:57` | Good at concept level |
| Audit / evidence | `enterprise.ts:28`; Trust area | Good |
| Observability / cost | `enterprise.ts:26`; decision 05 (`system-design.ts:55-66`); benchmarks | Good |
| Reliability / recovery | `production-operations.ts:1-37`; decision 03 | Good (contracts, not designs) |
| Scale / capacity | `enterprise.ts:13-17,55` | Named |
| Deployment topology / DR / SLOs | `enterprise.ts:56` ("deployment topology, rollout gates, observation windows, rollback procedures") | Named once; no RTO/RPO, no topology options, no control-plane availability objective |
| Incident | `production-operations.ts:39-60` (Required, not available); MC pause/restore Available for one repository (`mission-control.ts:15`) | Honest |

**Credibility issues on `/deploy`.** `qualificationFacts` (`app/deploy/fde-content.ts:77-84`) and deployment IDs (`:86-87`, `app/deploy/page.tsx:33,233-236`) publish an AWS account ID, region, hostname, Convex deployment, MC workspace/project IDs, and Vercel deployment IDs with copy buttons; `README.md:64` repeats the account and Convex deployment. The status widget "Production: Qualified / Healthy" (`app/deploy/page.tsx:225`) sits beside "Bedrock live calls: 0" (`:228`) and "Dormant / Not activated" (`:227`). The maturity-boundary aside (`:242-245`) is honest; the identifiers add attack surface without adding buyer value. `/deploy` also says "Contact FDLC Enterprise for pricing" (`:52`) while `/enterprise` says pricing "require[s] a scoped agreement" (`app/enterprise/page.tsx:105`).

### 3.7 Developer experience

| Builder question | Answered in source | Gap |
|---|---|---|
| How does work enter? | Receive (`fdlc.ts:40`); Intent → Plan (`enterprise.ts:4-5`) | No intake schema/example payload. |
| How are factories selected? | `enterprise.ts:41` "Factory Router selects an eligible, immutable Factory Version and an approved Execution Profile" | Only on `/enterprise`; no policy example. |
| How is work decomposed? | Plan → WorkOrders (`enterprise.ts:5`); WO-101…107 example (`enterprise/page.tsx:65-73`); builder templates (`lib/factory-definition.ts:23-30`); Work Graph (`execution-taxonomy.ts:8`) | No Work Graph illustration; no decomposition rules. |
| How are models selected? | Model area (`fdlc.ts:126-135`); decision 02 (`system-design.ts:16-27`); `enterprise.ts:23,42` | No routing-policy example. |
| How do agents execute? | Harness area; vocabulary; relationship chain (`execution-taxonomy.ts:24-32`) | No sequence diagram; no harness manifest example. |
| How is context assembled? | Practice 01 (`context-skills-practices.ts:2`); MC Context Packages (`mission-control.ts:6`); `enterprise.ts:24` | Context Package not a framework object. |
| How is output verified? | Verify step; Trust area; Verification Subject/Verifier Attempt; two evidence levels (`enterprise/page.tsx:78-85`) | No verification-contract template. |
| How do failures recover? | Decision 03; contracts 01–05 (`production-operations.ts`) | Contracts, no worked recovery example on fdlc.ai (Guide appendix has drills). |
| How do humans intervene? | Approve; principle 8; Human Authority (`mission-control.ts:31`); decision packet states (`docs/FDLC_SYSTEM_DESIGN_REVIEW.md` "Required operator states") | No escalation ladder on fdlc.ai. |
| How does software reach production? | Release; Deploy-vs-Release callout (`app/framework/page.tsx:103`); WO-106/107 (`enterprise/page.tsx:71-72`) | No CI/CD integration pattern. |

No code beyond the quickstart; no CLI/API/manifest; Factory Definition is prose Markdown by design (`lib/factory-definition.ts:114`). The Factory Explorer — the one interactive "how the parts interact" device — is unmounted.

### 3.8 Content quality

**Duplication.** `metrics` (`fdlc.ts:214-227`) vs example `outcomeMetrics` (`dependency-modernization-example.ts:66-73`), pinned as *intentionally different* by `source-reconciliation.test.ts:61-64`. `frameworkPieces` (`app/framework/page.tsx:18-24`) vs `ecosystemRoles` (`fdlc.ts:73-79`) — same five things, different statuses. FDE metric names (`app/deploy/page.tsx:175`: "Human engineering minutes", "Defect escape rate", "Verification pass rate", "Cost per accepted WorkOrder", "Cost per released outcome") differ from the canonical twelve ("Human review minutes", "Escaped defect rate", "First-pass verification rate", "Cost per verified outcome"). `lighthouseCandidates` (9, `fde-content.ts:65-75`) supersets `factoryLines` (6, `fdlc.ts:229-236`) with slightly different descriptions. Principle-like lists: 10 principles, 6 shifts, 3 "Why FDLC", 5 practices, 6 decisions, 5 contracts, 7 "Good first factory lines have".

**Weak or missing explanations.** No fdlc.ai definition of "AI software factory" outside the vocabulary. `factorySystemComponents` (`fdlc.ts:69-71`) is ten bare nouns. "Four views" are asserted distinct (`app/framework/page.tsx:85`) but never mapped to one another or to the vocabulary/decisions/contracts that arrived later. The spec's entity cards are boilerplate.

**Unsupported or inconsistent claims.** "Open framework · v0.1" without a version record. `/enterprise` H1 "One platform. Many verified outcomes." (`app/enterprise/page.tsx:24`) for a product that is "not generally available" (`:105`). `/deploy` "Production: Qualified / Healthy" beside zero live calls. `README.md:22` claims maturity-scoring tests. `README.md:64-66` publishes infra identity in a README that also says "no secret values are published".

**Missing topics on fdlc.ai.** AI-software-factory primer; comparison with adjacent standards; authority/delegation model; risk class → autonomy matrix; Factory Version in the open framework; registries; context assembly as an object; escalation ladder; failure taxonomy (named at `fdlc.ts:150`, never given); threat model; deployment topologies; DR/SLOs; license; governance; changelog; FAQ; glossary.

**Honesty discipline — preserve.** `missionControlCapabilities[].limitation` (`mission-control.ts`), text-pinned by tests; "Illustrative" (`dependency-modernization-example.ts:5-6`); "Proposed"/"Pre-standardization"/"Not yet claimable" (`specification/page.tsx:23`); "No public benchmark results are claimed" (`benchmarks/page.tsx:13`); "Qualification-ready infrastructure is not live qualification" (`deploy/page.tsx:243`); `status` fields on every decision (`system-design.ts`); "Proof before expansion" gates (`system-design.ts:87-111`); public copy rules 1–6 (`docs/MISSION_CONTROL_PUBLIC_CAPABILITIES.md`).

### 3.9 Information architecture, SEO, repo hygiene

**Navigation.** Six primary + Guide dropdown + five in More (`lib/global-navigation.ts`). Specification and Benchmarks are deliberately out of nav (`tests/rendered-html.test.mjs:14-38`). For an "aspiring industry standard", the standard and the measurement contract are less prominent than the services page (FDE in primary).

**Route naming.** `/deploy` hosts "FDE" whose page title is "Factory Deployed Engineer (FDE)" (`app/deploy/page.tsx:21`); `data/guide.ts:123` still labels it "Forward-Deployed Engineering". `/spec` → `/specification` handled (`app/spec/page.tsx`), but `app/mission-control/page.tsx:115` still links `/spec`. `guideByArea` (`app/architecture/page.tsx:35-42`) links `/guide/design`, `/guide/build`, `/guide/prove`, `/guide/improve` — slugs owned by the rollback shadow, resolved on live only through legacy redirects.

**Canonical host.** Source: `lib/site.ts:2` defaults to `https://www.fdlc.ai`; `proxy.ts:4` `canonicalOrigin = "https://www.fdlc.ai"`; `microfrontends.json:8` fallback `https://www.fdlc.ai`; `tests/unit/routing.test.ts:17-21` "publishes one www origin". Observed: `https://fdlc.ai/*` returns 200 with `canonical=https://www.fdlc.ai/*`; `https://www.fdlc.ai/framework` returns 200. The stale checkout's release record (`FDLC/docs/releases/2026-09-06-production-ui-ux-polish.md`) states "`www.fdlc.ai` intentionally returns 308 to `fdlc.ai`" — contradicted by both source and observation. Marketing copy uses the apex ("Live at fdlc.ai", "Production aliases: fdlc.ai · www.fdlc.ai" `app/deploy/page.tsx:236`). Net: two serving hosts, canonical on www, no redirect from apex, and a release record that describes the reverse.

**Sitemap / metadata / structured data.** Hard-coded `lastModified` (`app/sitemap.ts:7`); flat priorities. One OG image for all routes (`lib/metadata.ts:9`); `/guide/[slug]` sets `images: []` (`app/guide/[slug]/page.tsx:17`). JSON-LD is a single `WebSite` (`app/layout.tsx`); no `Organization`, `BreadcrumbList`, `DefinedTermSet`, `TechArticle`. `robots.ts` invites AI crawlers but there is no `llms.txt` or machine-readable export of `data/`.

**Repo hygiene.**
- *Verified in this copy:* two build toolchains (vinext/Cloudflare + Next/Vercel) with `npm test` exercising only the first (`package.json:9-16`); CI pinned to `macos-26` for a Fab package that is not part of the site (`.github/workflows/ci.yml:15-16`, `package.json:20`); README references absent paths (`docs/fab/*`, `packages/fab/README.md`, `scripts/check-built-design-system.mjs`); `app/deploy/fde-content.ts` is page-local data outside `data/`; the orphaned `factory-explorer.tsx`/`.ts` pair; `guideValueStream` duplicating the Guide's stage list inside the framework data file (`data/fdlc.ts:51-60`).
- *Stale-checkout note (`FDLC/`, `codex/updateui`):* that branch predates the homepage rewrite, `/specification`, FDE, vocabulary, decisions, contracts, enterprise, and MFE composition; its `docs/` (39 files) includes 168 KB of release forensics (`docs/releases/*`) with SHAs, deployment IDs, and alias states. `FDLC/docs/reviews/skill-evidence-2026-09-04/README.md` records "pre-existing duplicate generated `.next/types/* 2.ts` files" and `FDLC/.git/config` tracks 13 `codex/*` branches plus a `sites` remote on a ChatGPT-hosted git URL. The ≈85 MB evidence tree, `.worktrees`, and `nonexistent` directory reported by the requester are consistent with those records but were not present in either copy. Recommendation unchanged: evidence and forensics out of the site repo; one toolchain; `.gitignore` for `* 2.*` and `.worktrees/`.

### 3.10 Visual content inventory

| Component / asset | Shows | Built with | Interactive | Exportable |
|---|---|---|---|---|
| `architecture-diagram.tsx` (16) | Six area cards | `<div>` + `<Link>` grid | Links | No |
| `lifecycle-diagram.tsx` (26) | 7 stages + 4 controls band | `<ol>`, `ResponsiveDetails` | Disclosure | No |
| `protocol-diagram.tsx` (19) | 11 objects | `<ol>` | Disclosure | No |
| `runtime-lifecycle-diagram.tsx` (15) | 9 steps | `<ol>` | No | No |
| `state-boundary.tsx` (40) | "≠" sequence + 5 meanings | HTML/CSS | No | No |
| `category-distinction.tsx` (26) | 3×2 table + 2 transitions | `<table>` | No | No |
| `factory-explorer.tsx` (225) | Stage tabs × 10 capabilities + example records | React tablist | Yes | No; **unmounted** |
| `factory-builder.tsx` (126) | 5-step wizard → definition grid | React | Yes | Markdown copy/download |
| `maturity-assessment.tsx` (63) | 11-question wizard → result | React | Yes | No export |
| `mission-control-experience.tsx` (206) | 6-stage flow console; 3-screenshot tour | React + PNG | Yes | Screenshots only |
| Control-boundary map, durability map, system map | `app/architecture/page.tsx:54-64, 131-141` | CSS cards | No | No |
| Vocabulary grid, decisions, contracts | `app/architecture/page.tsx:67-129` | `ResponsiveDetails` cards | Disclosure | No |
| FDE factory map | `app/deploy/page.tsx:56-77` | CSS layers with `↓` glyphs | No | No |
| Enterprise diagram | `/enterprise/multi-factory-software-delivery.png`, 1521×908, "supplied by Jay West" (`app/enterprise/page.tsx:31-36`) | Raster PNG | Full-res link | **Yes** (PNG) |
| Live-only: agentic stack | Six layer cards | (assumed CSS) | — | No |
| Rasters | 3 MC screenshots, `og.png`, logos | PNG | — | — |

Summary: one exportable diagram (a supplied PNG on the commercial page), zero SVG, zero arrows/sequence/state diagrams in the open framework pages. `docs/design-system.md` mandates semantic HTML/CSS; that is compatible with inline SVG carrying `<title>`/`<desc>` and a text equivalent.

---

## 4. Competing models catalog

Every ordered sequence and every layer/plane/level model currently published, verbatim from source. "Live-only" items come from the 2026-09-11 fetch and are not in this worktree.

### 4.1 Ordered sequences (lifecycles, step lists, chains)

| # | Name in source | Steps (verbatim) | Source | Status |
|---|---|---|---|---|
| S1 | `lifecycleStages` — "Factory lifecycle" | Discover → Design → Assemble → Validate → Deploy → Operate → Improve | `data/fdlc.ts:81-89` | Canonical view 01 |
| S2 | `runtimeLifecycle` — "Runtime lifecycle" | Receive → Specify → Plan → Execute → Verify → Approve → Release → Observe → Learn | `data/fdlc.ts:39-49` | Canonical view 02 |
| S3 | `protocolSteps` — "Artifact protocol" | Intent → Specification → Plan → Work Order → Attempt → Evidence → Verification → Approval → Release → Outcome → Learning Signal | `data/fdlc.ts:160-172` | Canonical view 04 |
| S4 | `guideValueStream` — "Software factory value stream" | Intent → Plan → Define Agent → Execute through Harness → Apply Skills → Evaluate → Improve → Deliver Software | `data/fdlc.ts:51-60`; rendered `app/guide/page.tsx:63-65` ("Level 02 / Software factory value stream"); live `/guide/architecture` calls it "the canonical eight-stage value stream" | In framework data since near-main |
| S5 | Homepage "FDLC / OPERATING MODEL 01—04" | Define the outcome → Bound the work → Require evidence → Learn from outcomes | `app/page.tsx:49-56` (hard-coded JSX) | Not in data; untested |
| S6 | Homepage example "Factory" step | Plan → Modify → Test → Verify → Approve | `app/page.tsx:15` | Not in data |
| S7 | Homepage `exampleSteps` | Intent → Factory → Evidence → Outcome | `app/page.tsx:13-18` | Not in data |
| S8 | `flowStages` — Mission Control "Governed delivery trace" | Define → Authorize → Execute → Verify → Decide → Observe | `app/components/mission-control-experience.tsx:6-73` | Component-local |
| S9 | `missionControlTimeline` | Intent → Plan → Factory Version → WorkOrder → Task → Producer Attempt → Unpublished Candidate → Verification Subject → Verifier Attempt → Human decision → Release + outcome | `data/mission-control.ts:34` | Exported, not rendered by any route in this copy |
| S10 | `executionRelationship` — "Canonical relationship" | Control Plane authorizes an Execution Profile → Orchestrator advances the Work Graph → Agent Harness governs one Agent → Agent Loop iterates inside a graph node → Runtime hosts execution → Sandbox isolates effects → Evidence returns for independent judgment | `data/execution-taxonomy.ts:24-32`; rendered `app/architecture/page.tsx:72` | Data |
| S11 | `enterpriseStages` — "Example flow" | Intent → Plan → Route → Execute → Verify → Release → Learn | `data/enterprise.ts:4-11` | Data |
| S12 | Enterprise Mission Control ownership chain | Objective → Plan → WorkOrders → routing → state → evidence → authority → outcomes | `app/enterprise/page.tsx:47` | Prose |
| S13 | `enterpriseAdoption` — "Recommended adoption path" | Scope → Prove → Expand → Operate | `data/enterprise.ts:59-64` | Data |
| S14 | Enterprise "Version lifecycle" | Develop → Qualify → Promote → Activate → Observe → Improve | `app/enterprise/page.tsx:89` | Prose |
| S15 | Decision 06 promotion sequence | observe, propose, evaluate, qualify, approve, promote, and observe | `data/system-design.ts:72` | Data (conflicts with S14) |
| S16 | Enterprise worked objective | WO-101 Analyze → WO-102 Modernize → WO-103 Secure + WO-104 Tests → WO-105 Verify → Release authority → WO-106 Deploy → WO-107 Validate | `app/enterprise/page.tsx:65-73` | Second worked example, different ID scheme from `INT-104…LS-104-01` |
| S17 | `fdeWorkflow` — "What a Factory Deployed Engineer does" | Discover → Define → Assemble → Qualify → Operate → Transfer & Scale | `app/deploy/fde-content.ts:1-8` | Data (page-local) |
| S18 | FDE factory map, FDE layer | Discover → Define → Assemble → Qualify → Operate → Transfer | `app/deploy/page.tsx:65` | JSX; drops "& Scale" |
| S19 | FDE factory map, "Governed factory line" layer | Intent → Plan → Execute → Verify → Approve → Release → Learn | `app/deploy/page.tsx:70` | JSX (S2 minus Specify/Observe) |
| S20 | FDE "After factory line" | Intent → Governed planning → Bounded execution → Independent verification → Human authority → Delivery → Measured outcome | `app/deploy/page.tsx:168` | JSX |
| S21 | FDE section title | Understand. Design. Build. Prove. Scale. | `app/deploy/page.tsx:102` | Heading (≈ Guide parts minus Operate/Improve) |
| S22 | `engagementPhases` | FDLC Readiness → FDLC Lighthouse → FDLC Scale | `app/deploy/fde-content.ts:25-50`; `README.md:60` | Data |
| S23 | FDE ecosystem flow | FDLC → The Guide → Mission Control → Factory Deployed Engineer → Factory line → Outcomes | `app/deploy/page.tsx:91-98` | JSX |
| S24 | Capability package flow — "Five operating practices" | Author → Package → Evaluate → Admit → Activate → Observe → Compare → Promote or roll back → Improve | `app/architecture/page.tsx:105` | Prose |
| S25 | Guide parts | Understand → Design → Build → Prove → Operate → Improve | `data/guide.ts:3-90` | Data |
| S26 | `ecosystemRoles` | Defines it → Demonstrates it → Teaches it → Applies it → Industrializes it | `data/fdlc.ts:73-79` | Data |
| S27 | Non-collapsible states | Execution complete ≠ Verified ≠ Approved ≠ Released ≠ Outcome proven | `app/components/state-boundary.tsx:29` | Component |
| S28 | Mission Control state sequence | Attempt completion → Quality Gate Decision → Human Acceptance → Release → Outcome | `app/components/state-boundary.tsx:16`; `app/in-5-minutes/page.tsx:152` | Component |
| S29 | Decision relationship chains (six) | Intent → Plan revision → WorkOrder readiness · WorkOrder → Factory Version → Execution Profile → Attempt · Attempt → checkpoint/effect → reconciliation → replacement Attempt · Candidate → Verification Subject → Evidence → decision · Attempt cost → WorkOrder cost → accepted/released outcome → observed value · Outcome → Learning Signal → Improvement Candidate → Factory Version decision | `data/system-design.ts:13,26,39,52,65,78` | Data — the most precise object chains on the site, and the only ones naming Factory Version, Execution Profile, Verification Subject, Improvement Candidate together |
| S30 | Live-only: Guide "canonical eight-stage value stream" | same as S4 | `/guide/architecture` | Guide repo |

**Reconciliation note.** S2, S4, S8, S11, S19, S20 all describe "how one unit of work moves"; S1, S17, S13, S14, S15, S22 all describe "how a factory line comes to exist and changes"; S5 is a compression of both. S29 is the only chain that threads the near-main objects (Factory Version, Execution Profile, Verification Subject, Improvement Candidate) through the runtime — it should become the spine of the canonical runtime lifecycle rather than a per-decision footnote.

### 4.2 Layer, plane, level, and taxonomy models

| # | Name | Members (verbatim) | Source | Status |
|---|---|---|---|---|
| L1 | Six architecture areas | Intent · Harness · Capability · Model · Trust · Learning | `data/fdlc.ts:91-158` | Canonical view 03 |
| L2 | Continuous controls | Govern · Secure · Observe · Measure | `data/fdlc.ts:62-67` | Canonical |
| L3 | Control boundary (three) | 01 Intelligence supply · 02 Factory control plane · 03 Governed execution | `app/architecture/page.tsx:54-58` | Page |
| L4 | System map (six) | Humans · Control plane · Capability supply · Execution (Harness · Runtime · Sandbox) · Trust · Outcome | `app/architecture/page.tsx:133-140` | Page |
| L5 | Live-only: Agentic system stack (six) | Control Plane · Orchestrator · Agentic SDK · Agent Harness · Agent · Model | live `/architecture` | Post-worktree commit |
| L6 | Execution vocabulary (20 terms) | Model, Agent, Agent Loop, Agent Harness, Coding Harness, IDE Harness, Work Graph, Orchestrator, Runtime, Sandbox, Capability, Capability Implementation, Control Plane, Factory, Factory Platform, Factory Version, Loop Engineering, Graph Engineering, Harness Engineering, AI Harness | `data/execution-taxonomy.ts:1-22` | Data; live adds Agentic SDK |
| L7 | Mission Control implementation layers (five) | 01 Operator surfaces · 02 Authoritative control plane · 03 Orchestration · 04 Execution · 05 Verification + publication | `app/mission-control/page.tsx:76-80` | Page |
| L8 | Mission Control admission model (eleven objects) | Factory Version, Execution Profile, WorkOrder, Readiness, Task, Attempt, Unpublished Candidate, Verification Subject, Verifier Attempt, Evidence, Human Authority | `data/mission-control.ts:20-32` | Data |
| L9 | Factory capabilities / system components (ten) | Agents, Models, Skills, Tools, Context, Runtime, Policy, Evals, Observability, Human control | `data/fdlc.ts:69-71`; `data/factory-explorer.ts:15-103` (mapped onto only Harness/Capability/Model/Trust) | Data; explorer unmounted |
| L10 | Enterprise tiers (three) | One platform · Composable factories · Reusable capabilities | `app/enterprise/page.tsx:37` | Page |
| L11 | Enterprise scale dimensions (three) | Builder scale · Repository scale · Workload scale | `data/enterprise.ts:13-17` | Data |
| L12 | Enterprise platform services (nine) | Mission Control · Identity and access · Capability registry · Model gateway · Context intelligence · Execution control · Observability and cost · Policy and compliance · Evidence and audit | `data/enterprise.ts:19-29` | Data |
| L13 | Enterprise reusable capabilities (five) | Agents · Harnesses · Tools and skills · Models and inference · Execution Profiles | `data/enterprise.ts:31-37` | Data |
| L14 | Enterprise routing levels (three) | Objective · WorkOrder · Task | `data/enterprise.ts:39-43` | Data |
| L15 | Enterprise evidence levels (two) | Local / WorkOrder · Global / Objective | `app/enterprise/page.tsx:81-82` | Page |
| L16 | Enterprise factory types (four) | Software Delivery / broad default · Modernization / when justified · Security Remediation / when justified · Additional factories / evidence led | `data/enterprise.ts:45-50` | Data |
| L17 | FDE factory map (four layers) | Your engineering system · Factory Deployed Engineer · Governed factory line · Measurable outcomes | `app/deploy/page.tsx:58-76` | Page |
| L18 | FDE operating team (three) | 01 Human lead · 02 Bounded execution · 03 Control plane | `app/deploy/page.tsx:83-85` | Page |
| L19 | FDE Factory Definition (twelve concerns) | Intent, Workflow, Agents, Models, Tools, Context, Execution, Verification, Policy, Human Authority, Economics, Outcomes | `app/deploy/fde-content.ts:10-23` | Data (page-local) |
| L20 | Builder Factory Definition (ten fields) | version, intent, acceptanceCriteria, planBoundaries, candidateWorkOrders, requiredCapabilities, authority, verificationContract, humanControls, outcomeMetrics | `lib/factory-definition.ts:10-21` | Type |
| L21 | Maturity levels (six) | L0 Ad Hoc Prompting · L1 Assisted Development · L2 Governed Agents · L3 Orchestrated Workflows · L4 Verified Factory Lines · L5 Continuously Learning Factory | `data/fdlc.ts:187-194` | Data |
| L22 | Maturity answer scale (six) | Not established · Individual / manual · Documented · Governed · Verified · Continuously improved | `data/fdlc.ts:196` | Data |
| L23 | Per-area maturity ladders (six ladders × five rungs, all different labels) | e.g. Intent: Prompt · Template · Versioned Plan · Executable specification · Outcome-linked portfolio; Harness: Interactive session · Scripted runner · Durable Attempt · Recoverable workflow · Fleet control; … | `data/fdlc.ts:99,110,121,132,143,154` | Data; L1–L5 numbering does not align with L0–L5 overall levels |
| L24 | Live-only: Guide six planes | Human governance · Control plane · Execution plane · Knowledge plane · Quality plane · Delivery and outcome | `/guide/architecture` | Guide repo |
| L25 | Live-only: Guide extra structural concerns | "cross-cutting control and context planes, and adoption surrounding the factory" | `docs/FDLC_PRODUCTION_RELIABILITY_REVIEW.md:56-58`; Guide ch2 "Six areas, one surrounding concern" | Acknowledged, not in L1 |
| L26 | Live-only: Guide stacks | "The 12-layer production AI agent stack" (ch25, `data/guide.ts:47`); "Five-layer tech stack", "Three cross-cutting planes", "Seven layers of Mission Control" (glossary / ch2) | Guide repo | — |

**Reconciliation note.** L3, L4, L5, L7, L17, L18 are all "who governs / who executes / what returns" stacks with 3–6 tiers and different labels. L9, L13, L19 are all "what a factory is made of" inventories (10, 5, 12 members). L1 is the responsibility model; nothing publishes L1 × (L5 or L6) or L1 × L12. A single areas × runtime-layers × platform-services matrix would retire most of these.

---

## 5. Terminology table

| Term | Where used | Variants / conflicts |
|---|---|---|
| Work Order | `data/fdlc.ts:43,164`; `factory-explorer.ts:152`; `app/page.tsx:93` ("Work Orders"); `/specification` | **WorkOrder**: `data/mission-control.ts:23`, `data/enterprise.ts:16,20,41`, `data/system-design.ts:9,26`, `app/deploy/fde-content.ts:6`, `app/enterprise/page.tsx:65-73`, `app/deploy/page.tsx:30,175`. Both spellings appear in FDLC-authored (non-MC) copy. |
| Attempt | Protocol #5 (`fdlc.ts:165`) | **Producer Attempt** / **Verifier Attempt** (`mission-control.ts:26,29,34`), **Verification Subject** (`:28`), **WorkflowRun / Attempt** (`fdlc.ts:165`), **replacement Attempt** (`system-design.ts:39`). Protocol has no verifier-side object. |
| factory line | `fdlc.ts:82-89` (all seven stages), `:229-236`; `app/deploy/*`; `app/in-5-minutes/*` | **Factory** (`execution-taxonomy.ts:15`), **Factory Platform** (`:16`), **Factory Version** (`:17`), **factory type** (`enterprise.ts:45-50`), **Factory Definition** (three shapes, §3.3), **governed production line** (`fde-content.ts:54`). "Factory line" is not in the Guide glossary (live). |
| Factory Version | `execution-taxonomy.ts:17`; `mission-control.ts:21`; `enterprise/page.tsx:88-89`; `system-design.ts:72-78`; `fde-content.ts:4`; example "dependency-modernization@1.0" (`in-5-minutes/page.tsx:63`) | "factory version" lower-case in `fdlc.ts:85-86`; two lifecycles (S14 vs S15). |
| Learning Signal | Protocol #11 (`fdlc.ts:171`); runtime step 9 (`:48`) | **Improvement Candidate** (`system-design.ts:74,78`), **human-reviewed proposals** (`mission-control.ts:12`), **learning-signal store** (`fdlc.ts:151`), route `/specification/v1/learning` (`specification/page.tsx:41`) vs id `learning-signal`. |
| Trust | Area 5 (`fdlc.ts:137`) | **Verification** (protocol #7, runtime step 5, maturity dimension `:203`), **Evals** (`factory-explorer.ts:73-79` → Trust), **Quality plane** (Guide, live), **Prove** (`guide.ts` Part IV), **Trust level** (Guide glossary, capability certification level). |
| Harness | Area 2 name (`fdlc.ts:104`) whose components are Agent Harness, Agent Loop, Orchestrator and Work Graph, Runtime, Sandbox, Harness adapter (`:107`) | **Agent Harness** (`execution-taxonomy.ts:5`, narrower), **Coding Harness / IDE Harness / AI Harness** (`:6-7,21`), **Harnesses** as a reusable capability class (`enterprise.ts:33`), **Harness adapter / Codex harness adapter** (`docs/MISSION_CONTROL_PUBLIC_CAPABILITIES.md`), **Execute through Harness** (`fdlc.ts:55`), **Harness Engineering** (`execution-taxonomy.ts:20`), operating shift "The Harness becomes the control boundary" (`framework/page.tsx:29`) — which the vocabulary now says it is not (`execution-taxonomy.ts:20`: "leaving enterprise authority in the Control Plane"). |
| Approval / Acceptance | Protocol #8 "Approval" (`fdlc.ts:168`, MC mapping "Plan approval + WorkOrder acceptance") | **Acceptance decision** (`mission-control-experience.tsx:54`), **Human Authority** (`mission-control.ts:31`), **Human decision** (`:34`), **Release authority** (`enterprise/page.tsx:70`), **permit-gated publication** (`mission-control.ts:5`). |
| Intent / Mission / Objective | Protocol #1; area 1 | **Mission** (`fdlc.ts:161`), **Mission Spec** (`:162`), **Objective** (`enterprise.ts:20,40`; `enterprise/page.tsx:47`; routing level 1), **Builder Intent** (`fdlc.ts:52` href), **Goal** (Guide glossary). |
| Specification | Protocol #2 (`fdlc.ts:162`) | **FDLC Specification** (the standard, `/specification`), **Mission Spec** (MC), **Specification baseline** (Guide glossary). |
| Deploy / Release / Deliver | Lifecycle stage 5 (`fdlc.ts:86`) vs runtime step 7 (`:46`); callout distinguishing them (`framework/page.tsx:103`) | Route `/deploy` = FDE services; **Deliver Software** (`fdlc.ts:59`); **Delivery** (`deploy/page.tsx:168`); **WO-106 Deploy** = software deployment (`enterprise/page.tsx:71`); **Activate / Promote** (S14). |
| Validate / Qualify / Verify / Evaluate | Lifecycle stage 4 Validate (`fdlc.ts:85`) | **Qualify** (`fde-content.ts:5`; S14; `mission-control.ts:14` "qualified"), **Verify** (runtime step 5), **Evaluate** (`fdlc.ts:57`), **WO-107 Validate** = post-release observation (`enterprise/page.tsx:72`) — same verb, opposite lifecycle position. |
| Capability | Area 3 (`fdlc.ts:115`) | **Capability** = stable operation (`execution-taxonomy.ts:12`), **Capability Implementation** (`:13`), **capability** = MC product feature (`mission-control.ts:1-18`), **factory capabilities** = ten explorer items, **reusable capabilities** (`enterprise.ts:31-37`), **Capability Router** (`enterprise.ts:42`). |
| Control plane | `execution-taxonomy.ts:14` ("Enterprise authority") | **Factory control plane** (L3), **Authoritative control plane** = Convex (L7), **Mission Control is the meta-factory control plane** (`enterprise/page.tsx:47`), **the proposed commercial control plane** = FDLC Enterprise (`fdlc.ts:78`), **Control plane** = Guide plane (live). |
| FDE | `fdlc.ts:77` "Factory Deployed Engineer (FDE)"; `app/deploy/page.tsx:21`; nav label "FDE" (`lib/global-navigation.ts:19`) | **Forward-Deployed Engineering** (`data/guide.ts:123`); route `/deploy`. |
| Human control / oversight / authority | `factory-explorer.ts:89-95`; `fdlc.ts:205`; `mission-control.ts:31`; `fde-content.ts:20` | Four labels for the same concern. |
| Plan / Work Graph | Protocol #3 | **Work Graph** (`execution-taxonomy.ts:8`; Harness component `fdlc.ts:107`), **Plan revision** (`system-design.ts:7-13`), **Graph Engineering** (`execution-taxonomy.ts:19`). |
| Task / Candidate | "Associated objects" (`specification/page.tsx:12`) | Central in MC admission (`mission-control.ts:25,27`) and enterprise routing level 3 (`enterprise.ts:42`); **Unpublished Candidate** (`mission-control.ts:27`). |
| Evidence | Protocol #6 | **Evidence Envelopes** (`fdlc.ts:166`), **receipts** (`:167`), **decision brief / decision packet** (`docs/FDLC_SYSTEM_DESIGN_REVIEW.md`), **forensic bundle** (`production-operations.ts:34`). |
| Metrics | `fdlc.ts:214-227` | FDE renames: Human engineering minutes / Defect escape rate / Verification pass rate / Cost per accepted WorkOrder / Cost per released outcome (`deploy/page.tsx:175`); enterprise "cost per accepted outcome" (`enterprise.ts:63`) vs "Cost per verified outcome" (`fdlc.ts:216`) — decision 05 defines both as different denominators (`system-design.ts:59-60`), but the metrics list has only one. |
| Governance | Control "Govern"; framework `#governance` section = manifesto (`framework/page.tsx:121-125`) | One word for a control, a page section, and a Trust responsibility. |

---

## 6. What already exists that the brief asks for

Completeness is judged against "a builder could implement or an implementer could conform to it", not against prose presence. 100% = defined in data, rendered on an open framework page, tied into the protocol/spec, tested, and exemplified.

| Brief topic | Where it lives today | What is there | What is missing | Completeness |
|---|---|---|---|---|
| Three routing levels | `data/enterprise.ts:39-43`; `app/enterprise/page.tsx:60-62`; decision 02 (`system-design.ts:16-27`); MC "Model and backend routing" Experimental (`mission-control.ts:9`) | Objective / WorkOrder / Task with question + description; "Factory Router" and "Capability Router" named; routing vs scheduling invariant | Not on `/framework` or `/architecture` (one-sentence pointer at `architecture/page.tsx:78`); Model area still describes one-level routing (`fdlc.ts:128`); no eligibility-filter example; not in spec | 45% |
| Factory Version | `execution-taxonomy.ts:17`; `mission-control.ts:21`; `enterprise/page.tsx:87-90` (Develop → Qualify → Promote → Activate → Observe → Improve); `system-design.ts:68-79` (decision 06 + invariant "Learning creates Improvement Candidates; it cannot mutate or activate Production Factory behavior"); `fde-content.ts:4`; MC "Canonical Factory admission" Experimental (`mission-control.ts:14`) | Three consistent definitions; lifecycle; promotion/revocation invariant; example id `dependency-modernization@1.0` | Not in `protocolSteps` or `lifecycleStages` data; not in `/specification`; two lifecycle spellings (S14 vs S15); no manifest example | 60% |
| Execution Profile | `mission-control.ts:22`; `enterprise.ts:36`; `execution-taxonomy.ts:25`; decision 02 relationship (`system-design.ts:26`); MC enhancement 1 (`:83-88`) | Defined as the per-Attempt identity composition; named as reusable capability class | No fields; no example; not in framework data or spec; live term "Agentic SDK" not yet here | 50% |
| Capability registry | Area component (`fdlc.ts:118`); platform service (`enterprise.ts:22`); Capability / Capability Implementation (`execution-taxonomy.ts:12-13`); MC enhancement 7 (`docs/FDLC_EXECUTION_TERMINOLOGY_REVIEW.md`) | Named and scoped ("Versioned agents, harnesses, tools, skills, model routes, context providers, verifiers, and execution backends") | No registry contract (identity, version, qualification, permissions, deprecation); no factory registry at all | 30% |
| Enterprise architecture | `data/enterprise.ts` (64 lines); `app/enterprise/page.tsx` (108 lines) + supplied PNG; Guide appendix `enterprise-multi-factory-delivery` (linked) | Scale dimensions, example flow, nine services, five capability classes, four factory types + creation test, routing, two evidence levels, versioning, readiness controls, adoption path, honest availability | Lives on the commercial page; no compliance crosswalk, deployment topology options, DR/RTO/RPO, SLOs; MC tenancy "not qualified" | 65% |
| Execution taxonomy | `data/execution-taxonomy.ts` (20 terms + 7-step relationship); `app/architecture/page.tsx:67-75`; `docs/FDLC_EXECUTION_TERMINOLOGY_REVIEW.md` (responsibility map, nine MC enhancements, acceptance criteria); Guide appendix `execution-boundaries-and-terminology` (linked) | Term / role / question / boundary for each; Harness area rewritten to match | Live adds Agentic SDK + six-layer stack (not here); no areas × layers matrix; area still named "Harness" while containing Orchestrator/Runtime/Sandbox; Guide glossary lacks "factory line"/"Learning Signal" | 80% |
| System design decisions | `data/system-design.ts:1-80`; `app/architecture/page.tsx:113-120`; `docs/FDLC_SYSTEM_DESIGN_REVIEW.md`; `tests/unit/source-reconciliation.test.ts:9-16` (field lengths); `rendered-html.test.mjs:241-256`; Guide playbook appendix (linked) | Six decisions × eight fields incl. invariant, failure behavior, status, evidence, relationship chain | Chains (S29) not integrated into the runtime lifecycle; worksheet/drills only in Guide | 85% |
| Production operating contracts | `data/production-operations.ts:1-37` (five contracts) + `:39-60` (five MC requirements); `app/architecture/page.tsx:122-129`; `app/mission-control/page.tsx:100-104`; `docs/FDLC_PRODUCTION_RELIABILITY_REVIEW.md`; Guide appendix `production-reliability-operations-playbook` (linked) | Question / required behavior / invariant per contract; shared "Required record" sentence; MC status honest ("Required", pause/restore Available for one repository) | Incident object not in protocol; no drill or worked incident on fdlc.ai; degraded-mode matrix only in Guide | 75% |
| Maturity model | `data/fdlc.ts:187-212`; `lib/maturity.ts`; `app/components/maturity-assessment.tsx` (level-keyed next action `:40-49`, focus management); `app/maturity/page.tsx`; per-area ladders (`fdlc.ts:99…154`) | Six levels with operating model + next move; eleven dimensions × six-point scale; recommended next action and links | `floor(average)` lets a hard-gate zero pass (`lib/maturity.ts:19`); no test for `lib/maturity.ts`; three unaligned level vocabularies (L21/L22/L23); no export; no rubric validation | 65% |
| Metrics / benchmarks | `data/fdlc.ts:214-227` (12); `app/benchmarks/page.tsx` (measurement contract: cohort, cost coverage ACTUAL/ESTIMATED/UNKNOWN, guardrails); decision 05 (`system-design.ts:55-66`); example primary metric + formula (`dependency-modernization-example.ts:60-65`) | Outcome-based, activity telemetry rejected, denominators distinguished | Verified vs accepted vs released cost not in the metrics list; FDE page uses six differently-named metrics (`deploy/page.tsx:175`); no public results (honestly stated) | 80% |
| Worked example | `data/dependency-modernization-example.ts` (76 lines) → `/in-5-minutes` (all four views, 11 record IDs, baseline, primary metric, guardrails); second partial example WO-101…107 (`enterprise/page.tsx:63-75`); FDE "Representative Lighthouse" (`deploy/page.tsx:162-165`) | Complete mapping across S1/S2/S3/L1, illustrative labels, MC screenshots | Explorer unmounted; second example uses a different ID scheme and does not reuse the first; no JSON/YAML record instances; no second full example | 70% |
| FDE | `app/deploy/fde-content.ts`; `app/deploy/page.tsx` (249 lines); `README.md:57-66`; `fdlc.ts:77` | Six-stage workflow with input/output/evidence; three phases with inputs/work/output; ten deliverables; nine candidates; selection criteria; before/after; measurement; product tour; maturity boundary | Stage names conflict with lifecycle (Define/Qualify/Transfer vs Design/Validate/Deploy/Improve); infra identifiers published; "pricing" CTA vs no pricing; metric names diverge; `guide.ts:123` still "Forward-Deployed" | 80% as a services page; 40% as framework-consistent methodology |
| Control boundary thesis | `app/architecture/page.tsx:52-65`; `app/framework/page.tsx:26-33` (six shifts); `state-boundary.tsx` | Complete and repeated | — | 90% |
| Artifact protocol | `data/fdlc.ts:160-172`; `/framework#protocol`; `/specification`; `/in-5-minutes#artifacts` | Eleven objects with question, proof, MC mapping, example IDs | No fields/states; Approval conflates two decisions; no Factory Version/Execution Profile/Verifier Attempt/Improvement Candidate | 55% |
| Specification | `app/specification/page.tsx` | Names, route plan, honest status | Everything else (§3.4) | 15% |
| Multi-factory orchestration / objective planner / factory registry | `enterprise.ts:4-11,39-50`; `enterprise/page.tsx:47,55-57,63-75`; `system-design.ts:7` | Meta-factory control plane statement; factory creation test; planner as replaceable intelligence | Not in framework data; no registry; no cross-factory dependency example beyond WO-101…107 | 35% |
| Context Package | `mission-control.ts:6`; practice 01 (`context-skills-practices.ts:2`); `enterprise.ts:24` | Named, MC Available (advisory) | Not a framework/protocol object; no fields | 30% |

---

## 7. Gap table

Priority: P0 = blocks credibility as a standard or is a defect; P1 = needed for the "architect and operate" promise; P2 = completeness; P3 = polish. Difficulty: S ≤ 1 day, M ≤ 1 week, L ≤ 1 month, XL > 1 month.

| # | Area | Current state | Target state | Gap | Priority | Recommended change | Difficulty |
|---|---|---|---|---|---|---|---|
| 1 | Sequence models | 30 ordered sequences in source (§4.1), two of them in `data/fdlc.ts` (`:39-49`, `:51-60`), four hard-coded on `/` and `/deploy` | One canonical runtime lifecycle, one factory lifecycle; every other sequence is a labeled projection with a mapping row | No matrix; policy ("No second lifecycle", `docs/FDLC_PRODUCTION_RELIABILITY_REVIEW.md:71`) not enforced | P0 | Add `data/model-reconciliation.ts` mapping S4–S23 onto S1/S2/S3; render as a matrix on `/framework#models`; source S5–S7, S18–S20 from data or delete; add a test that any exported `*Stages`/`*Flow` array declares a `mapsTo` | M |
| 2 | Layer/plane models | L1 + at least 12 tier/inventory models (§4.2), plus live L5 and Guide L24–L26 | Six areas × runtime layers (L5/L6) × platform services (L12) matrix; L9/L13/L19 merged into one factory inventory | No cross-reference anywhere | P0 | Publish the matrix on `/architecture` between the vocabulary and the areas; rename area 2 "Execution" or split Orchestration out; align Guide `/guide/architecture` wording | M (site) + L (Guide) |
| 3 | Factory Version / Execution Profile | Defined in `execution-taxonomy.ts`, `mission-control.ts`, `enterprise/page.tsx`; absent from protocol, spec, lifecycle data | First-class framework objects with fields and one lifecycle (pick S14 or S15) | Three definitions, zero canonical | P0 | Add both to `protocolSteps` (or a parallel `factoryArtifacts` array), to `/specification`, and to `lifecycleStages[validate|deploy].output`; unify S14/S15 | M |
| 4 | Specification | Boilerplate entity cards (`specification/page.tsx:29`); id mismatch (`:41`) | v0.1 spec with fields, states, invariants (reuse the six decision invariants), JSON instances from `INT-104…LS-104-01`, conformance checklist | All but names | P0 | Generate `/specification/v1/*` pages from a new `data/specification.ts`; add Mission, Factory, Factory Version, Execution Profile, Capability, Context Package, Verifier Attempt, Acceptance Decision, Improvement Candidate; fix `learning` → `learning-signal` | XL |
| 5 | Enterprise architecture placement | `data/enterprise.ts` rendered only at `/enterprise` | Routing levels, evidence levels, platform services, version lifecycle, readiness in the open framework | Ownership inverted | P0 | Render `enterpriseRouting`, `enterprisePlatformServices`, `enterpriseControls`, version lifecycle in a new `/architecture#enterprise-scale` section; leave offer/pricing on `/enterprise` | S–M |
| 6 | Infra identifiers | `app/deploy/fde-content.ts:77-87`; `app/deploy/page.tsx:231-236`; `README.md:64` | Status words only; identities in a retained evidence record | Public attack-surface disclosure | P0 | Delete `qualificationFacts` and deployment IDs from the page and README; keep "environment ready / phase dormant / live calls 0" | S |
| 7 | Standards governance | No license page, changelog, versioning policy, RFC path, governing body; header GitHub → Mission Control (`site-header.tsx:70`); footer "Source audit" → Guide repo (`global-navigation.ts:35`) | `/governance` + `CHANGELOG.md` + license + contribution path + FDLC repo link | All absent | P0 | Decide license/governance; add pages and links; version the data layer (`fdlc.ts` → `version: "0.1.x"`) | M (decision-bound) |
| 8 | Canonical host | Source canonical `www` (`lib/site.ts:2`, `proxy.ts:4`, `routing.test.ts:17-21`); apex serves 200 without redirect; release record says the reverse | One host serves; the other 308s; docs match | Contradiction between source, live, and release record | P1 | Choose apex or www; add the host redirect at the platform layer; correct the release record; add a browser check that the non-canonical host redirects | S |
| 9 | Diagrams | Nine CSS list components; one supplied PNG (`enterprise/page.tsx:31-36`) | Inline SVG set: four-views overview, areas × layers, one WorkOrder sequence (S29 as swimlanes), artifact state machine, authority-down/evidence-back flow, enterprise composition; downloadable SVG/PNG | No SVG anywhere | P1 | Author SVGs with `<title>/<desc>` + text equivalents (keeps `docs/design-system.md` commitments); add "Download SVG"; redraw the supplied PNG as SVG | L |
| 10 | Methodology depth | Stages: purpose/activities/output (`fdlc.ts:81-89`); FDE stages have input/output/evidence (`fde-content.ts:1-8`) | Canonical stages carry entry/exit criteria, input, output, evidence, roles; FDE stages reference them by id | Services page richer than framework | P1 | Extend `LifecycleStage` with `input`, `evidence`, `entryCriteria`, `exitCriteria`, `roles`; make `fdeWorkflow[].mapsTo` point at `lifecycleStages` ids; publish templates | M |
| 11 | Factory Definition | Three shapes (`lib/factory-definition.ts:10-21`, `fde-content.ts:10-23`, `enterprise/page.tsx:55`) | One schema, versioned, exported by the builder, marketed by FDE, admitted (eventually) by Mission Control | Divergent | P1 | Adopt the 12-concern list as the schema; regenerate builder output and Markdown from it; add JSON export | M |
| 12 | Authority model | Principle 3, Trust decisions, six checkboxes, "Human Authority" | Roles, delegation chain, risk class × autonomy matrix, escalation ladder | No model | P1 | Add `data/authority.ts` and an `/architecture#authority` section; reuse Guide ch22 ladder | M |
| 13 | Approval vs Acceptance; Learning chain | Protocol #8 conflates; #11 lacks Proposal/Candidate | Plan Approval, Acceptance Decision, Learning Signal → Improvement Candidate → Factory Version decision as distinct objects | Two objects missing, one conflated | P1 | Split #8; add Improvement Candidate (already named in `system-design.ts:74`) | S (data) / M (spec) |
| 14 | Harness area naming | Area "Harness" contains Agent Harness, Orchestrator, Runtime, Sandbox (`fdlc.ts:107`); vocabulary says Harness ≠ those (`execution-taxonomy.ts:20-21`) | Area name matches contents | Self-contradiction | P1 | Rename area 2 "Execution" (or "Harness & Runtime"); update tests `content.test.ts:19`, copy, and shift 03 (`framework/page.tsx:29`) | S–M |
| 15 | Factory Explorer | Unmounted (`factory-explorer.tsx`, `factory-explorer.ts`); test name stale (`content.test.ts:23`) | Mounted at `/framework#explorer` or `/explore`, linked from `/` "Go deeper" | Orphaned | P1 | Mount; extend capabilities to cover Intent and Learning areas (currently excluded by `content.test.ts:42`) | S |
| 16 | "AI software factory" definition | Only as vocabulary term "Factory" (`execution-taxonomy.ts:15`) | One sentence in `data/fdlc.ts`, rendered beside `canonicalDefinition` | Site defines FDLC, not its subject | P1 | Add `factoryDefinition`; render in hero and `/framework#definition` | S |
| 17 | Differentiation | Category table on `/framework` only; homepage dropped it; no Agentic SDLC / SDK / standards comparison | `/compare` page + table restored to `/` | Missing | P1 | Build from `categoryComparison` + live SDK-layer text + a standards crosswalk | M |
| 18 | Glossary on fdlc.ai | None; Guide glossary lacks core FDLC terms | `/glossary` of ~40 normative terms generated from `data/` (vocabulary + protocol + areas), linking to Guide entries | Missing; conflicts unresolved | P1 | Generate; adopt one spelling per term (recommend "Work Order", "Learning Signal", "Factory Version", "Factory Deployed Engineer") | M |
| 19 | Tutorial | None beyond quickstart | "Your first factory line": Factory Definition → MC demo golden path → evidence inspection | Missing | P1 | Write with real commands; export Factory Definition as MC-compatible YAML once schema exists | L |
| 20 | Enterprise operations | Nouns for topology/DR/SLOs (`enterprise.ts:56`) | Deployment topology options, control-plane DR/RTO/RPO, SLOs, compliance crosswalk | Missing | P2 | Add "Operating the control plane" section + crosswalk table | L |
| 21 | Maturity scoring | `floor(average)` (`lib/maturity.ts:19`); untested; three level vocabularies | Gated/min scoring; test; aligned L0–L5 labels; export | Contradicts benchmarks copy | P2 | Change to `min` (or floor(avg) capped at min+1); add `tests/unit/maturity.test.ts`; align per-area ladders to L1–L5 = overall L1–L5 | S |
| 22 | Metrics consistency | FDE renames (`deploy/page.tsx:175`); "cost per accepted outcome" vs "verified" | One list with verified/accepted/released denominators; FDE references by id | Drift | P2 | Add accepted/released variants to `metrics`; derive FDE grid from it | S |
| 23 | Structured data / AI readability | `WebSite` JSON-LD only; no `llms.txt`; no data export | `Organization`, `BreadcrumbList`, `DefinedTermSet`, `TechArticle`; `/llms.txt`; `/fdlc.json` | Minimal | P2 | Generate from `data/` at build | S–M |
| 24 | Stale references | `mission-control/page.tsx:115` → `/spec`; `guide.ts:123` "Forward-Deployed"; `architecture/page.tsx:35-42` legacy Guide slugs; `README.md:22` claims maturity tests; README references absent `docs/fab`, `scripts/check-built-design-system.mjs` | Clean | Drift | P2 | Fix links/labels; add maturity test; reconcile README with tree | S |
| 25 | Toolchain | vinext + Next; `npm test` builds vinext only; CI on macOS for Fab | One production build path tested; site CI decoupled from Fab | Two paths | P2 | Drop vinext/worker if Vercel is production; move Fab to its own workflow | M |
| 26 | Repo hygiene | Page-local data in `app/deploy/fde-content.ts`; stale-branch forensics (`FDLC/docs/releases`, 168 KB); reported ` 2.tsx` / `.worktrees` / evidence trees | Data in `data/`; evidence in an evidence repo; ignores for generated duplicates | Mixed concerns | P2 | Move `fde-content.ts` to `data/fde.ts`; move release forensics out; add `* 2.*`, `.worktrees/` to `.gitignore` | S–M |
| 27 | Duplicate lists | `frameworkPieces` vs `ecosystemRoles`; `lighthouseCandidates` vs `factoryLines`; example `outcomeMetrics` vs `metrics` | Single source each | Drift (some pinned as intentional by tests) | P3 | Derive by id; delete duplicates; update `source-reconciliation.test.ts:61-64` | S |
| 28 | Reading-time / lastmod | Hard-coded (`framework/page.tsx:54`, `architecture/page.tsx:46`, `sitemap.ts:7`) | Computed | Stale signals | P3 | Compute from rendered word count / data mtimes | S |
| 29 | Nav prominence | Specification/Benchmarks out of nav by test (`rendered-html.test.mjs:14-38`); FDE primary | Standard artifacts visible | Signals services > standard | P2 | "Standard ▾" dropdown (Framework, Architecture, Specification, Manifesto, Benchmarks); FDE under More or Adopt | S |
| 30 | Guide coupling | Framework depth links to Guide appendices (`architecture/page.tsx:50,74,109,118,127`); shared CSS/nav synced by script | Framework-normative content in this repo; Guide holds pedagogy | Normative content split across repos | P2 | Move the vocabulary reference, decision worksheet, and reliability playbook *summaries* into `data/`; keep long-form in Guide | M |

---

## 8. Preserve list

1. **Canonical definition and positioning** (`data/fdlc.ts:2-6`) and the hero's problem/audience/contrast sequence (`app/page.tsx:35-42`).
2. **Control-boundary thesis**: Intelligence supply / Factory control plane / Governed execution; "Authority flows down → … ← Evidence flows back"; Expected-to-change / Required-to-persist (`app/architecture/page.tsx:52-65`).
3. **Non-collapsible state boundary** and its five meanings (`state-boundary.tsx`); the Deploy-vs-Release callout (`framework/page.tsx:103`).
4. **Four views as distinct lenses** (`framework/page.tsx:84-91`) — keep the distinction, add the mapping.
5. **Eleven-artifact protocol** with question / required proof / MC mapping (`fdlc.ts:160-172`) — extend, do not replace.
6. **Ten manifesto principles with explanation and implication** (`fdlc.ts:174-185`).
7. **Six areas' internal structure**, especially failure modes (`fdlc.ts:98,109,120,131,142,153`) and the rewritten Harness relationship (`:112`).
8. **Execution vocabulary** (`data/execution-taxonomy.ts`) and the terminology decision record (`docs/FDLC_EXECUTION_TERMINOLOGY_REVIEW.md`) — including "AI Harness: Non-canonical external label".
9. **Six system-design decisions** with invariants, failure behavior, status, evidence, and relationship chains (`data/system-design.ts:1-80`); the "Proof before expansion" gates (`:82-113`).
10. **Five production operating contracts** and the shared "Required record" sentence (`data/production-operations.ts`; `architecture/page.tsx:125`).
11. **Enterprise model content**: routing levels, factory creation test, two evidence levels, "Changed inputs invalidate assumptions", version lifecycle (`data/enterprise.ts`; `enterprise/page.tsx:47-89`) — move, do not cut.
12. **Twelve metrics + measurement contract** (`fdlc.ts:214-227`; `benchmarks/page.tsx:17-25`; decision 05 invariant `system-design.ts:61`).
13. **Honesty discipline**: `limitation` on every capability, text-pinned tests (`source-reconciliation.test.ts:18-39`), "Proposed"/"Required"/"Illustrative"/"Dormant", the FDE maturity boundary (`deploy/page.tsx:242-245`), public copy rules 1–6.
14. **Worked example with record IDs** (`data/dependency-modernization-example.ts`) — the seed for spec instances.
15. **Typed data layer + pinning tests** (`tests/unit/content.test.ts`, `source-reconciliation.test.ts`) and the fail-closed MFE/build guards (`scripts/check-microfrontends-config.mjs`, `tests/unit/microfrontends-build.test.ts`).
16. **Factory Explorer** (`factory-explorer.tsx`) — remount it.
17. **Interactive tool ergonomics**: focus management, validation messages, Markdown export, level-keyed next actions (`factory-builder.tsx`, `maturity-assessment.tsx`, `lib/factory-definition.ts:68-116`).
18. **Six operating shifts** (`framework/page.tsx:26-33`).
19. **Accessibility commitments** (`docs/design-system.md`: 44 px targets, status independent of color, reduced motion, keyboard dropdowns in `site-header.tsx:19-37`).
20. **FDE selection criteria and "bad first factory line"** (`deploy/page.tsx:29,154-157`) — good adoption guidance regardless of the services framing.
