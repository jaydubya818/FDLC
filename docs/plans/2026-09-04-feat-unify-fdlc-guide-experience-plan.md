---
title: "feat: Unify FDLC and the AI Software Factory Guide"
type: feature
status: active
date: 2026-09-04
approved: 2026-09-04
owner: Jay West
fdlc_baseline_commit: 40bee1863ba36d40f6c9b443c231f55beafbb5df
fdlc_latest_main_integrated: d92be801b79947f9a031012fc2637a872ac51116
guide_baseline_commit: 87d3841f96353d03278311dfc7e7b2d25649a331
mission_control_audit_commit: 1d27266
current_phase: phase-3-shared-domain-integration
---

# Feature: Unify FDLC and the AI Software Factory Guide

## Outcome

Present FDLC and the AI Software Factory Guide as one authoritative public
experience at `https://www.fdlc.ai`, while keeping the FDLC and Guide
applications independently maintainable and deployable.

FDLC owns the umbrella positioning, framework, reference architecture,
specification, maturity model, implementation overview, and adoption surfaces.
The Guide owns all deep educational and reference content under `/guide`.
Mission Control remains a separate open-source reference implementation and is
not modified by this migration.

The completed experience has:

- one brand: FDLC.ai;
- one public origin: `https://www.fdlc.ai`;
- one canonical owner for every major concept;
- two independently deployable Next.js applications;
- one invisible path boundary at `/guide`;
- explicit, evidence-bounded Mission Control claims; and
- a reversible production cutover.

## Problem this solves

Today, readers encounter two public brands and origins, competing `/guide`
experiences, root-relative Guide routes, conflicting lifecycle diagrams, and
metadata that makes the Guide look like a separate publication. That weakens
category clarity and creates avoidable routing, SEO, and trust problems.

Copying roughly 44 chapters into the FDLC repository would remove the visible
split but create a larger operational problem: duplicated content ownership,
coupled releases, and two places to maintain the Guide. The public experience,
not the repositories, should be consolidated.

## Final decisions

### Brand and category

- `FDLC` always expands to **Factory Development Lifecycle** at first use and
  wherever the acronym could otherwise be ambiguous.
- Homepage H1 remains **Build the factory that builds your software.**
- The canonical supporting definition is:

  > FDLC is the Factory Development Lifecycle—the open operating model,
  > engineering framework, and reference architecture for designing, building,
  > governing, operating, measuring, and continuously improving AI software
  > factories.

- Category explanation follows one sequence: traditional SDLC → AI-native SDLC
  → AI software factory → Factory Development Lifecycle.

### Conceptual hierarchy

Publish three explicitly different abstraction levels. Do not collapse them
into one diagram.

1. **Factory Development Lifecycle** — how the factory itself is engineered and
   evolved: Discover → Design → Assemble → Validate → Deploy → Operate →
   Improve.
2. **Software factory value stream** — how software work flows through the
   factory: Intent → Plan → Define Agent → Execute through Harness → Apply
   Skills → Evaluate → Improve → Deliver Software.
3. **Autonomous execution and artifact protocol** — how a bounded unit of work
   becomes governed and proven: Intent → Specification → Plan → Work Order →
   Attempt → Evidence → Verification → Approval → Release → Outcome → Learning.

The public shorthand is Intent → Plan → Execute → Prove → Release → Learn.
The six architectural domains—Intent, Harness, Capability, Model, Trust, and
Learning—are a structural view, not a fourth lifecycle. Governance, Security,
Observability, Measurement, and Human Authority span every lifecycle stage.

### Content ownership

| Concept | Canonical owner |
| --- | --- |
| What FDLC is / Factory Development Lifecycle | `/framework` |
| FDLC reference architecture and six domains | `/architecture` |
| Deep method, teaching, and reference material | `/guide/...` |
| Formal artifacts, states, transitions, contracts, and invariants | `/specification` |
| Mission Control overview, limits, quickstart, and repository | `/mission-control` |
| Commercial enterprise control plane | `/enterprise` |
| Forward-deployed implementation | `/deploy` |

Principle: **one concept → one canonical page → many contextual links**.

### Deployment architecture

Use **Vercel Microfrontends**:

- FDLC is the default application.
- The Guide application owns `/guide` and `/guide/:path*`.
- The Guide application also temporarily owns the non-conflicting legacy
  redirect surfaces (`/docs/:path*`, `/visuals`, `/topics`, `/coverage`,
  `/search`, `/glossary`, and `/atlas`) so group-level routing cannot bypass
  the Guide's authoritative alias map.
- Both repositories use `@vercel/microfrontends` and matching application names.
- The Vercel project/package-name mismatch is declared explicitly:
  `fdlc` → `fdlc-site`, and `ai-software-factory-mastery` →
  `ai-software-factory-mastery-site`.
- Cross-repository previews use the same branch name and Production fallback.

Do **not** set Next.js `basePath`. Current Vercel Microfrontends documentation
states that `basePath` is unsupported. The Guide will instead expose physical
`app/guide/...` routes. `withMicrofrontends` owns framework asset isolation;
Guide public files and fetch targets are explicitly namespaced under `/guide`.

Use Next.js Multi Zones only if Microfrontends cannot be enabled for the account
or fails an integration gate. Do not operate both routing systems at once.

### Mission Control claims

Mission Control is described as the open-source reference implementation of
FDLC, with a qualified human-governed delivery kernel through verified pull
request and acceptance. Public copy must not imply that generalized release,
production outcome learning, fleet operation, governed MCP, complete incident
response, or enterprise authorization are already proven. Link to the current
public capability maturity ledger for time-bound detail.

## Route contract

### Final canonical routes

FDLC owns:

```text
/
/framework
/architecture
/maturity
/specification
/mission-control
/enterprise
/deploy
```

The Guide owns:

```text
/guide
/guide/00-front-matter/...
/guide/stages/...
/guide/01-understand/...
/guide/02-design/...
/guide/03-build/...
/guide/04-prove/...
/guide/05-operate/...
/guide/06-improve/...
/guide/search
/guide/glossary
/guide/atlas
/guide/architecture
/guide/topics
/guide/coverage
/guide/appendix/...
```

Keep the Guide's existing document slugs. Do not invent a new chapter taxonomy.
`/guide/architecture` is a supporting implementation explorer; `/architecture`
remains the authoritative FDLC reference architecture.

### Redirect disposition

| Current route | Final destination | Owner after cutover |
| --- | --- | --- |
| FDLC `/spec` | `/specification` | FDLC |
| FDLC `/guide/understand` | `/guide/01-understand/01-why-software-engineering-is-changing` | Guide |
| FDLC `/guide/design` | `/guide/02-design/04-the-human-agent-operating-model` | Guide |
| FDLC `/guide/build` | `/guide/03-build/11-the-agent-factory` | Guide |
| FDLC `/guide/prove` | `/guide/04-prove/27-quality-and-evidence-architecture` | Guide |
| FDLC `/guide/operate` | `/guide/05-operate/34-the-factory-as-a-platform` | Guide |
| FDLC `/guide/improve` | `/guide/06-improve/39-production-feedback-review-and-the-agentic-merge-queue` | Guide |
| Old Guide `/` and `/guide` | `/guide` | Guide / old-origin redirect surface |
| Old Guide `/docs/<slug>` | `/guide/<slug>` | old-origin redirect surface |
| Old Guide `/docs/guide` | `/guide` | old-origin redirect surface |
| Old Guide `/docs/appendix/glossary` and `/glossary` | `/guide/glossary` | old-origin redirect surface |
| Old Guide `/visuals` and courtesy `/atlas` | `/guide/atlas` | old-origin redirect surface |
| Old Guide `/topics` | `/guide/topics` | old-origin redirect surface |
| Old Guide `/coverage` | `/guide/coverage` | old-origin redirect surface |
| Old Guide `/search` | `/guide/search` | old-origin redirect surface |
| Old Guide `/architecture` | `/guide/architecture` | old-origin redirect surface |

All 28 existing Guide chapter aliases and 72 moved-fragment mappings remain
supported. Same-origin redirects go directly to the final route, preserve query
strings, and avoid redirect chains. Cross-origin redirects from the retired
Guide hostname are allowlisted and drop query strings by default; forwarding
them requires an explicit Product Owner privacy decision. Unknown routes remain
real 404s.

## Repository audit findings

### FDLC

- Next.js 16.3.4, React 19, TypeScript 5.9. The migration upgrades Next.js from
  16.2.9 so the production dependency audit is clean.
- Current sitemap publishes 20 routes, including a competing `/guide` portal
  and six summaries.
- `data/guide.ts`, the factory explorer, and the dependency-modernization
  example contain 94 references to 57 old Guide URLs.
- `/framework` and `/in-5-minutes` currently present four models; the target has
  three abstraction levels plus the six-domain structural view.
- The detailed protocol currently ends in `Learning Signal`; the canonical
  final artifact is `Learning`.
- Cross-cutting controls omit Human Authority and use verbs rather than the
  canonical discipline names.
- `/spec` is the current route and must become `/specification`.
- Production redirects `fdlc.ai` to `www.fdlc.ai`, while application metadata
  still defaults to the apex. Canonicals must use the actual public origin.
- The main checkout contains four unrelated untracked duplicate files; they are
  preserved and excluded from this work.

### AI Software Factory Guide

- Next.js 16.3.3, React 19, TypeScript 5.9; Vercel builds native Next.js while
  the default local build uses Vinext.
- 66 generated documents: 44 numbered chapters, eight stage briefs, two front
  matter documents, and supporting appendices/reference pages.
- 74 current static/canonical URLs, 28 legacy chapter aliases, and 72 moved
  fragments.
- Strong documentation UX already exists: sidebar, breadcrumbs, previous/next,
  full-text search, glossary, Atlas, diagrams, role entry paths, TOC, and a
  reading-oriented layout.
- Search data is approximately 2.17 MB; 186 infographic assets occupy roughly
  6.7 MB. Both currently use unowned root paths.
- Canonicals, JSON-LD, sitemap, robots, navigation, generated Markdown links,
  and public assets currently assume the standalone Vercel origin and `/docs`.
- Existing tests primarily render the Vinext output; native Next.js route and
  composed-app coverage is required.
- The strict editorial release gate initially exposed 24 baseline failures.
  The consolidation cleanup resolved them; the final editorial gate passes.

### Mission Control

- No source changes are required.
- The audited public baseline is `origin/main` at `1d27266`, not the dirty local
  feature branch.
- The implementation supports governed intent/specification, plans, bounded
  WorkOrders, durable Attempts, evidence, independent verification, approval,
  and scoped pull-request publication.
- Generalized production release/outcomes, governed learning, provider/fleet
  recovery, MCP admission, incident lifecycle, and enterprise authorization
  remain partial, preview, or unqualified.

## Implementation phases

### Phase 0 — Audit and freeze (complete)

- [x] Inventory FDLC routes, Guide routes, legacy aliases, generated assets,
      metadata, deployment configuration, and tests.
- [x] Audit Mission Control against its current public maturity evidence.
- [x] Fetch current upstream state without modifying user work.
- [x] Decide Microfrontends over Multi Zones and reject unsupported `basePath`.
- [x] Create matching `codex/fdlc-guide-consolidation` worktrees from clean
      baselines.
- [x] Preserve the existing FDLC and Mission Control local changes.

### Phase 1 — Guide compatibility release

Purpose: make the Guide independently correct at `/guide/*` before FDLC routes
traffic to it.

- [x] Add a single public-path module for Guide routes, public assets, search
      data, canonical URLs, and the FDLC origin.
- [x] Move/alias the document renderer to `app/guide/[...slug]` without moving
      the Markdown corpus.
- [x] Make `/guide` the one Guide landing page and add named routes for search,
      glossary, Atlas, architecture, topics, and coverage.
- [x] Preserve all chapter slugs, previous/next order, breadcrumbs, sidebar,
      TOC, role paths, search, diagrams, and deep links.
- [x] Convert generated Markdown links, navigation links, search results,
      command-palette entries, and role paths to `/guide/...`.
- [x] Namespace search data and public infographics under `/guide`.
- [x] Add build-aware metadata, canonical URLs, Open Graph data, JSON-LD,
      sitemap, robots, and favicon/OG paths. Keep the standalone Guide origin
      during the compatibility release; switch to `https://www.fdlc.ai` only
      in an approved composed Preview and cutover build.
- [x] Add direct permanent redirects for old Guide routes, 28 legacy aliases,
      the six retired FDLC summary routes, and the glossary/Atlas shortcuts.
- [x] Preserve query strings and the 72 moved-fragment mappings.
- [x] Add an implementation-status notice to Mission Control case-study content
      that links to the current public maturity ledger.
- [x] Pin `@vercel/microfrontends` without activating routing and keep the Guide
      independently buildable.
- [x] Add the Guide's `withMicrofrontends` wrapper during the approved
      integration phase, using a generated, validated snapshot of the default
      app's authoritative configuration.
- [x] Update route, link, rendered-HTML, accessibility, and generated-content
      tests.

Gate:

- Guide builds independently.
- Every canonical Guide route and known redirect is accounted for.
- No user-facing Guide URL points to the old host or `/docs/*`.
- Search, diagrams, public assets, query strings, fragments, 404s, and
  navigation pass on desktop and mobile.

### Phase 2 — FDLC framework and content consolidation

Purpose: establish one precise public model before routing changes.

- [x] Store the official long description and canonical short definition once.
- [x] Rewrite homepage category framing around the four-step category thesis.
- [x] Replace the four-view presentation with three abstraction levels and an
      explicit crosswalk.
- [x] Keep the seven-stage FDLC lifecycle and exact eight-stage Guide value
      stream distinct.
- [x] Change the public execution explorer to the six-step shorthand while the
      specification preserves the exact eleven-artifact protocol.
- [x] Rename `Learning Signal` to `Learning`.
- [x] Add Human Authority and use the five canonical cross-cutting discipline
      names.
- [x] Make `/specification` canonical and permanently redirect `/spec`.
- [x] Replace all old-host Guide links with same-origin `/guide/...` links.
- [x] Remove Guide summary pages from canonical navigation and the sitemap;
      keep their exact redirect ownership in the Guide application.
- [x] Bound Mission Control copy to the audited implementation state and link
      the current maturity ledger.
- [x] Normalize metadata, canonical origin, sitemap, and robots.
- [x] Update unit, route, rendered-HTML, and content-consistency tests.

Gate:

- A reader can explain the category progression and why the three abstraction
  levels coexist.
- There is one canonical page for each major concept.
- Every FDLC link targets a final route, not a redirect or old host.
- Mission Control copy contains no unqualified future-state claims.

### Phase 3 — Shared-domain integration

Purpose: compose the already-valid applications without coupling releases.

- [x] Keep `@vercel/microfrontends` pinned at the verified version in both apps.
- [x] Add `withMicrofrontends` to both Next.js configurations after Product
      Owner approval for Preview integration. The Guide activates the wrapper
      only through an explicit native-local or fail-closed Vercel deployment
      mode using the validated snapshot.
- [x] Add `microfrontends.json` with FDLC as default and Guide ownership of
      `/guide` plus `/guide/:path*` and the non-conflicting legacy redirect
      surfaces.
- [x] Declare package names and production fallbacks explicitly.
- [x] Use hard, first-party navigation at the application boundary so the
      framework cannot accidentally intercept cross-application routes. Revisit
      Microfrontends-aware prefetch only if Preview evidence shows material
      value.
- [x] Document the paired branch-preview workflow and production release order.
- [x] Add a deterministic route-contract checker covering both applications.
- [x] Commit a schema-pure Guide build snapshot generated from FDLC's committed
      `microfrontends.json`, with deterministic semantic SHA-256 provenance.
- [x] Add explicit source-to-snapshot sync/check commands; no build dynamically
      fetches configuration from Vercel or GitHub.
- [x] Fail Guide Vercel builds closed when the snapshot, manifest, external
      trusted digest, config source commit, exact Vercel target, or
      target-specific approval is absent or mismatched; pin the child
      application identity independently of ambient build metadata.
- [x] Add native asset-prefix, asset-response, hydration, interactive search,
      Mermaid, and hydrated branded-404 regression coverage.
- [x] Keep retired-host redirects disabled by default behind the server-only
      `GUIDE_LEGACY_REDIRECTS_ENABLED` cutover flag; enable them only in the
      explicit Preview evidence build and the later approved retirement build.
- [x] Create the approved two-project Microfrontends group, set its Preview
      fallback to Production, and enable matching polyrepo branch routing.
- [ ] Push the paired `codex/fdlc-guide-consolidation` branches and record the
      composed Preview evidence without promoting routing to Production.

Gate:

- The recorded FDLC semantic config SHA-256 and config source commit equal the
  Guide manifest, checked snapshot, and branch-scoped Preview trust values.
- Matching branch previews resolve to the intended pair of deployments.
- Unmatched child previews use the configured Production fallback.
- Representative root routes resolve to FDLC; all `/guide` routes and
  namespaced assets resolve to the Guide.
- Both applications remain independently buildable and deployable.

### Phase 4 — Integrated verification

- [x] Run typecheck, lint, unit, link, rendered-route, accessibility, and native
      Next.js production builds in both repositories.
- [x] Record the Guide editorial-gate baseline separately from migration
      regressions.
- [x] Crawl the complete canonical route manifest and every redirect.
- [x] Verify all 44 chapter H1s, all 186 infographics, search JSON, one
      Mermaid-heavy chapter, both applications' 404s, and navigation in both
      directions.
- [x] Verify canonicals, JSON-LD, Open Graph URLs, robots, and sitemap membership
      in standalone and generated composed modes.
- [x] Verify no redirect loops/chains and no old-host strings in composed-mode
      production HTML outside deliberate redirect/provenance tests.
- [ ] Capture desktop and mobile screenshots of the homepage, Guide landing,
      deep chapter, search, glossary, Atlas, and a cross-app return path.

Gate:

- Zero unexpected test, build, console, network, accessibility, link, route,
  or canonical failures.
- Any accepted pre-existing failure is documented with baseline evidence and
  is unrelated to the migration.

### Phase 5 — Production cutover (explicit Product Owner gate)

No production alias, domain, or routing configuration changes occur without a
separate approval after preview evidence is available.

- [ ] Confirm the Vercel plan, Microfrontends allowance, routing-request quota,
      and expected operating cost.
- [ ] Reconfirm the existing Microfrontends group, Fallback Environment, and
      matching branch/commit Preview pairing immediately before Production.
- [ ] Record both current production deployment IDs.
- [ ] Create a fresh Guide Production-environment compatibility deployment
      first; never promote a Preview artifact.
- [ ] Create a fresh FDLC Production-environment shared-routing deployment
      second; never promote a Preview artifact.
- [ ] Run synthetic checks for `/`, `/framework`, `/guide`, a deep chapter,
      search data, one image, both 404 scopes, and old-origin redirects.
- [ ] Change Guide canonicals to `www.fdlc.ai` only when shared-domain routing is
      live and verified.
- [ ] Keep the old Guide origin as a redirect-only compatibility surface.

Rollback:

- If the Guide release fails, do not promote FDLC routing.
- If shared routing fails, roll back only FDLC routing; the standalone Guide
  remains available.
- If Guide content/assets fail after handoff, roll back only the Guide project.
- Never roll back both projects blindly; use the recorded deployment IDs.
- Recovery target: restore `/guide`, a deep chapter, search data, and one asset
  within five minutes.

### Phase 6 — Stabilize and remove shadows

- [ ] Monitor routing, 404s, search loading, asset errors, and old-origin redirect
      traffic for seven days.
- [ ] Remove the shadowed FDLC Guide portal and summary implementation after the
      stabilization window.
- [ ] Remove temporary route flags or compatibility code only after rollback is
      no longer dependent on it.
- [ ] Keep old-origin redirects and legacy fragment support while they receive
      meaningful traffic.
- [ ] Update architecture, operations, and release documentation with the final
      deployment IDs and recovery procedure.

## Acceptance criteria

### Content and terminology

- [x] `FDLC` is expanded to Factory Development Lifecycle at first use.
- [x] The homepage presents the approved H1 and canonical supporting definition.
- [x] The category progression is explicit and does not describe FDLC as merely
      another SDLC variant.
- [x] The three abstraction levels use the exact approved sequences and explain
      the question each answers.
- [x] Governance, Security, Observability, Measurement, and Human Authority are
      visibly cross-cutting.
- [x] The six architecture domains retain one definition across both sites.
- [x] Mission Control statements distinguish implemented, bounded, partial, and
      conceptual capabilities.

### Routing and continuity

- [x] All 66 Guide documents are canonical, merged, or directly redirected.
- [x] All 44 numbered chapters return 200 at their final route with the expected
      H1.
- [x] All 28 legacy aliases resolve in one permanent redirect.
- [x] All 72 moved fragments land on the intended element.
- [x] Arbitrary, repeated, and encoded query parameters survive same-origin
      route redirects and fragment remapping. The old-host catch-all
      deliberately drops queries rather than forwarding potentially sensitive
      URL data across origins.
- [x] Unknown root and Guide paths return the correct application's 404 in each
      independent app. Composed ownership remains a Preview gate.
- [x] There are no loops, chains, blanket redirects, or content-disappearing
      route collisions.

### Guide experience

- [x] Sidebar, breadcrumbs, previous/next, search, glossary, Atlas, diagrams,
      role entry paths, references, TOC, deep links, and reading layout work.
- [x] The Guide clearly belongs to FDLC but remains documentation-first.
- [ ] Cross-app links are same-origin, same-tab, and visually first-party.
- [ ] Browser Back restores the prior app and hash/scroll position.
- [x] Search covers loading, error, empty, result, keyboard, and anchored-result
      states.

### Assets and discovery

- [x] Every Guide public asset and fetch target is under an owned `/guide`
      namespace or a Microfrontends-managed framework asset prefix.
- [ ] Canonical URLs, Open Graph URLs, and JSON-LD use
      `https://www.fdlc.ai`.
- [x] Sitemaps contain only canonical 200 URLs; redirects, search, duplicates,
      and 404s are absent.
- [ ] Preview deployments are `noindex`; production discovery pages are
      indexable.
- [ ] The old Vercel host returns permanent redirects rather than a second
      canonical edition after cutover.

### Deployment and recovery

- [ ] Each repository builds and previews independently.
- [ ] Cross-repository branch previews use the intended paired deployments.
- [ ] Routing/debug headers identify the expected application and deployment.
- [ ] A failed build never advances a production alias.
- [ ] The documented rollback drill meets the five-minute recovery target.

## Files expected to change

### FDLC repository

- `app/page.tsx`, `app/framework/page.tsx`, `app/architecture/page.tsx`,
  `app/in-5-minutes/page.tsx`, `app/mission-control/page.tsx`
- `app/spec/page.tsx` → `app/specification/page.tsx`
- shared header/footer/navigation and factory-explorer components
- `data/fdlc.ts`, `data/guide.ts`, `data/factory-explorer.ts`,
  `data/dependency-modernization-example.ts`, and Mission Control content data
- `app/sitemap.ts`, `app/robots.ts`, `next.config.ts`, `package.json`, lockfile,
  `microfrontends.json`
- affected unit/rendered-route tests and deployment documentation

### Guide repository

- `site/app/guide/**` route tree and route-specific metadata
- `site/lib/content.ts`, `site/lib/legacy-routes.ts`, and a central public-path
  module
- navigation, Markdown, search, command-palette, value-stream, Atlas, header,
  footer, and document-layout components
- `site/scripts/generate-content.mjs`
- `site/next.config.ts` for the approval-gated `withMicrofrontends` wrapper;
  `site/package.json` and lockfile for the pinned runtime dependency;
  `site/config/microfrontends.generated.json` and its manifest as generated
  build inputs; and the source-to-snapshot sync/check script. FDLC's root
  `microfrontends.json` remains the only routing authority.
- generated search/sitemap/robots/public assets
- affected link, route, rendered-HTML, accessibility, and generation tests

### Mission Control repository

- No changes planned.

## Risks and controls

| Risk | Control |
| --- | --- |
| Unsupported MFE + `basePath` combination | No `basePath`; physical `/guide` routes and tests that assert the config. |
| FDLC `/guide/[slug]` shadowing | Guide owns the complete prefix and implements all retired-summary redirects. |
| Group routing bypasses old-host Guide redirects | Route non-conflicting legacy paths to Guide; host-guard both apps for legacy-host requests that land on the default app. |
| Independent releases drift | Compatibility-first order, matching branch names, production fallback, recorded deployment IDs. |
| The Guide snapshot is missing or stale | Deterministic sync from committed FDLC authority, schema/contract validation, manifest fingerprint, independently managed Vercel digest, and a fail-closed build. |
| Search/images break at new mount | One path helper, `/guide`-namespaced public files, exhaustive asset/search checks. |
| SEO splits between origins | One canonical origin, exact sitemap manifests, redirect-only old host after cutover. |
| Legacy deep links lose context | Direct 308s, preserved queries, tested fragment remapping. |
| Old-host URLs contain sensitive path/query data | Cross-origin redirects are allowlisted to published Guide routes and explicit aliases, and drop queries; named same-origin route redirects still preserve queries. |
| Marketing copy overstates Mission Control | Evidence-bounded copy plus current maturity-ledger link. |
| Existing Guide editorial debt obscures migration regressions | Record the initial 24-failure baseline, resolve it separately from routing behavior, and require the final editorial gate to pass. |
| Production routing creates lock-in | Multi Zones documented as fallback; independent apps and standalone Guide remain deployable. |
| Vercel quota/cost is unsuitable | Treat account-plan and traffic check as a production gate, not an assumption. |

## Success measure

A reader can enter at `www.fdlc.ai`, understand what the Factory Development
Lifecycle is, move into the full Guide without perceiving an application
boundary, find precise implementation material, and return to FDLC surfaces
without duplicate concepts, broken links, or unsupported capability claims.
Either application can ship or roll back independently.
