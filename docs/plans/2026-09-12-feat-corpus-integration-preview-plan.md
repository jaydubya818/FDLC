---
title: "feat: Integrate the FDLC corpus as a verified preview"
type: feat
status: ready-for-local-review
date: 2026-09-12
branch: codex/corpus-integration-preview
base: origin/main@ff7b25f
brainstorm: docs/brainstorms/2026-09-12-corpus-integration-preview-brainstorm.md
---

# Integrate the FDLC corpus as a verified preview

## Overview

Import Claude's FDLC corpus into the current site as an additive, locally testable preview under `/corpus-preview/**`. Preserve every existing canonical page, Guide route, interactive tool, redirect, and sitemap entry while the corpus is reviewed. Build the preview from one version-controlled content tree through a strict generator/verifier contract shared by Next and Vinext.

This is intentionally a preview integration, not a canonical cutover. The branch may be merged only after local validation and Product Owner review; replacing canonical routes is a separate decision and plan.

## Implementation status

Implemented on `codex/corpus-integration-preview`. The final evidence and local commands are in `docs/reviews/2026-09-12-corpus-preview-validation.md`; the machine-readable corpus report is `docs/reviews/corpus-preview-verification.json`.

The preview implementation is green in Vinext and native Next webpack builds/runtimes, including both 13-check browser suites. The remaining unchecked items below are intentionally broader canonical-promotion work or proposed test-depth enhancements, not hidden prerequisites for local preview review. The default Turbopack Vercel build must still be run in a normal local/Vercel environment because this managed host denies Turbopack's internal worker port.

## Problem statement

Claude produced a substantial corpus and review package, but it is not ready to mount directly on the production route tree:

- the archive contains 160 Markdown files and 157 declared content routes while its reports cite inconsistent totals;
- nine declared paths collide with bespoke pages already owned by the site;
- `/glossary` and `/search` cross the composed Guide ownership boundary;
- four internal destinations and one planned essay are unresolved;
- 73 proposed pattern/anti-pattern entries need evidence and disposition, not automatic qualification;
- identifier terminology and the first-activation authority rule contain semantic conflicts that schema syntax checks cannot settle;
- the reported verifier, negative fixtures, tool versions, and final logs were not delivered;
- the implementation runbook assumes routing and Mermaid capabilities that do not exist on `origin/main`;
- a final corpus edit introduced prohibited terms after the reported verification pass.

Mounting the corpus at top-level paths now would create a false sense of qualification and risk regressing polished public flows. Leaving it as an archive prevents meaningful product review. A namespaced, noindex preview is the smallest correct step between those two extremes.

## Stakeholders and primary flows

### Reader/reviewer

1. Open `/corpus-preview` directly.
2. Understand preview status, provenance, limitations, and collection counts.
3. Filter/search by title, path, collection, level, audience, and status; preserve filters in the URL.
4. Open a deep document or fragment link directly.
5. Navigate breadcrumbs, table of contents, previous/next, internal corpus links, existing site links, diagrams, schemas, and examples.
6. Recover from no results, an unknown document, an invalid fragment, a diagram-render failure, or JavaScript being unavailable.
7. Return to the catalog with search/filter state preserved.

### Corpus maintainer

1. Add, edit, rename, or delete Markdown or an asset.
2. Run the same generation/verification command used by builds and CI.
3. Receive precise route, front matter, link, fragment, asset, schema, diagram, policy, or stale-output failures.
4. Regenerate the manifest and evidence only after source content is valid.
5. Prove negative fixtures still fail and that the final report describes the final tree.

### Product Owner

1. Check out `codex/corpus-integration-preview` without disturbing current work.
2. Install dependencies and run one documented local validation command.
3. Browse representative desktop and mobile flows.
4. Inspect the collision inventory, semantic-decision register, taxonomy dispositions, and verification report.
5. Decide whether to revise the preview, promote selected routes, or decline the corpus before anything replaces production content.

## Recommended solution

### Publication boundary

Classify every archive artifact before generation:

| Archive area | Preview treatment |
|---|---|
| `corpus/**/*.md` with valid `path` front matter | Rendered preview document |
| `corpus/specification/schemas/*` | Validated raw preview download and linked artifact |
| `corpus/specification/examples/*` | Validated raw preview download and linked artifact |
| `corpus/diagrams/{mermaid,svg,png}/**` | Manifest-listed rendered/downloadable asset |
| `canon/**` | Review-only downloadable source, not a public document route |
| `audit/**` | Review evidence linked from the preview status page, not indexed as corpus prose |
| `site-implementation/**` | Repository reference only; never a content route |
| README/reference files without route front matter | Excluded from public manifest and classified explicitly |

No file becomes public merely because it exists under the imported directory.

### Route ownership contract

- Corpus pages render at `/corpus-preview` plus their declared `path`.
- Exact duplicate preview paths or reserved prefixes fail generation.
- `/corpus-artifacts/**` is reserved for validated raw artifacts. Keeping artifacts outside the document catch-all avoids a Vinext route-precedence ambiguity discovered during dual-runtime validation.
- Existing canonical collisions are expected but emitted as an explicit promotion inventory.
- Guide-owned `/guide/**`, `/search`, and `/glossary` destinations are preserved and never shadowed.
- Corpus-owned links are rewritten through one shared helper into the preview namespace.
- Existing-site and external links are allowlisted/classified, not guessed.
- Unknown documents and raw artifacts return a real 404; path traversal never resolves a file.
- Preview URLs are excluded from the sitemap, disallowed in robots, and marked `noindex, nofollow, noarchive`.

### Content contract

`path` is the route authority. The generator fails closed on malformed YAML or missing required fields for routed pages. A shared library owns:

- route normalization and collision detection;
- relative and absolute link normalization;
- deterministic heading slugs and duplicate suffixes;
- `{#custom-id}` extraction;
- fragment validation and URL decoding;
- preview/internal/existing-site/external link classification;
- asset allowlisting and safe URL-scheme validation.

The renderer and verifier must consume this same behavior. Parallel implementations are not acceptable because they can produce a green report and broken browser navigation.

### Rendering contract

Render Markdown as data using `react-markdown` and `remark-gfm`; do not enable MDX or arbitrary raw HTML. Support headings, tables, task lists, code fences, blockquotes, local images, and Mermaid fences. Mermaid uses strict security settings and a per-diagram client boundary with loading, rendered, source, and error states. Diagram failure must never fail the rest of the document.

### Verification contract

One command performs import checks, strict verification, generation, stale-output comparison, and report emission. `build`, `build:vercel`, `typecheck`, and test entry points invoke the same prerequisite so none can serve old generated content.

Checks report `pass`, `fail`, `skip`, or `externally-unverifiable`; skipped checks are never summarized as passes. The final report records:

- original archive filename and SHA-256;
- normalized current corpus digest;
- generator/verifier version;
- Node, package, build, and relevant tool versions;
- exact source and route counts derived from the manifest;
- exact pass/fail/skip counts;
- canonical collisions and classified external links;
- unresolved semantic and external verification limitations;
- report timestamp and command to reproduce it.

## Technical approach

### Proposed file layout

```text
content/fdlc-corpus/
  PROVENANCE.md
  publication.json
  corpus/**
  canon/**
  audit/**
  site-implementation/RUNBOOK.md

scripts/corpus/
  generate.ts
  taxonomy.ts

data/
  corpus.generated.ts

lib/
  corpus.ts
  corpus-contract.ts
  corpus-types.ts

app/corpus-preview/
  page.tsx
  [...slug]/page.tsx
  error.tsx
  not-found.tsx

app/corpus-artifacts/
  [...artifact]/route.ts

app/components/corpus/
  corpus-catalog.tsx
  corpus-document.tsx
  corpus-markdown.tsx
  corpus-mermaid.tsx
  corpus-status.tsx

tests/fixtures/corpus/**
tests/unit/corpus-*.test.ts
docs/reviews/2026-09-12-corpus-preview-validation.md
docs/reviews/corpus-preview-verification.json
```

Exact names may be simplified during implementation, but publication, routing, generation, rendering, and verification responsibilities must stay explicit.

### Generated data shape

The manifest should contain only the data required for deterministic rendering and discovery:

- route, title, description, collection, audience, level, status, source path;
- normalized Markdown body or a split per-document generated module;
- ordered headings and fragments;
- classified outgoing links;
- referenced diagrams/assets/artifacts;
- previous/next route IDs;
- source digest and generation version.

Start with split generated document artifacts if a centralized TypeScript module materially increases memory, bundle size, or build time. Measure before settling the representation. The catalog client receives metadata only, never all 374k words.

## Implementation phases

### Phase 0 — Lock the source and baseline

- [x] Confirm the worktree is clean, based on `origin/main@ff7b25f`, and on `codex/corpus-integration-preview`.
- [x] Record baseline results for unit tests, lint, typecheck, Vinext build/render tests, Next build/runtime tests, and browser tests before integration.
- [x] Record the archive checksum `54583e8f18d3e474617b6d63b25ddac1c58ff196c8271a2dcb22f7f4a6e38a49` and inventory without trusting handwritten report counts.
- [x] Import the archive into `content/fdlc-corpus/` with a repository-relative provenance record; do not commit the tarball or absolute `/home/claude/work` execution paths.
- [x] Add `publication.json` classifications so audits, canon, runbooks, README files, schemas, examples, and diagram assets cannot become routes accidentally.

**Exit:** imported files are attributable and classified; the original site baseline is known.

### Phase 1 — Build the route/content contract and verifier first

- [x] Add the minimum parser/validation dependencies: `gray-matter`, `react-markdown`, `remark-gfm`, Mermaid, YAML parsing, and Draft 2020-12 JSON Schema validation. Do not add MDX.
- [x] Implement strict front-matter and route validation in `scripts/corpus/generate.ts`.
- [x] Implement a shared heading model supporting duplicates and `{#custom-id}` syntax; expose it to generator, verifier, and renderer.
- [x] Implement explicit link classification and preview rewriting with safe URL schemes, relative-path normalization, URL decoding, and fragment validation.
- [x] Generate the inventory of nine existing canonical collisions rather than treating them as either accidental failures or safe promotion.
- [x] Reserve `/corpus-artifacts/**` and reject content collisions with functional paths.
- [x] Validate JSON/YAML syntax, every schema/example pairing, local asset existence, and diagram IDs.
- [x] Validate prohibited terms and scan public output for absolute local paths and secret-like values.
- [x] Add optional Mission Control reference verification behind an explicit local repository path; report absent external state as `externally-unverifiable`.
- [x] Add negative fixtures for missing links, duplicate/custom anchors, unsafe schemes, path traversal, and schema/example mismatch; exercise stale output through the generated-report gate.
- [x] Add a stale-output check that fails when source digests do not match generated artifacts.

**Exit:** the verifier fails for every negative fixture and produces a truthful initial gap report for the imported tree.

### Phase 2 — Resolve integration-blocking corpus defects

- [x] Remove the known prohibited terms from the roadmap without changing its meaning.
- [x] Resolve `/enterprise/policy` against the existing policy-governance document using one declared route/alias decision.
- [x] Repoint `/enterprise/audit-compliance` references to verified existing material; do not invent a finished page.
- [x] Repoint `/services` references to the current `/deploy` experience for preview purposes, recording canonical `/services` as a future information-architecture decision.
- [x] Make `specification/CHANGELOG.md` an explicitly classified artifact and update links consistently.
- [x] Replace the unwritten essay link with verified existing material until the planned essay is authored.
- [x] Replace executable absolute workspace instructions with repository-relative commands and retain historical paths only as quoted audit evidence.
- [x] Generate all preview-facing corpus counts from the manifest.
- [x] Create a complete taxonomy disposition register for all 73 proposals with source files, supporting context, and explicit dispositions.
- [x] Correct “Proposed Proposed” labels and repoint obvious aliases such as degraded-mode, human-approval-everywhere, prompt-as-governance, self-verifying-agent, and tool-grant-and-receipt.
- [x] Inventory identifier-family and authority-bootstrap conflicts in a semantic decision register that blocks canonical promotion but not preview review.

**Exit:** zero unresolved navigable corpus links/fragments, zero prohibited terms, accurate generated counts, taxonomy claims are evidence-backed, and unresolved semantic choices are visible rather than silently guessed.

### Phase 3 — Generate and render the preview reader

- [x] Generate typed catalog metadata and deterministic document artifacts from the verified content tree.
- [x] Add `/corpus-preview` with preview status, provenance, manifest-derived counts, limitations, collections, and search/filter controls.
- [x] Keep search/filter state in query parameters; handle initial, filtered, no-results, invalid-filter, cleared-filter, and progressive-disclosure states.
- [x] Add `/corpus-preview/[...slug]` with static params, metadata, breadcrumbs, document status, source provenance, sidebar/collection context, TOC, previous/next, and catalog-return state.
- [x] Render corpus links through the route-ownership helper so known corpus targets remain inside preview while existing site/Guide destinations remain explicit.
- [x] Render Mermaid with strict mode, accessible caption/title, loading state, per-diagram error state, source disclosure, and scrollable full view.
- [x] Keep Mermaid source readable with JavaScript disabled and when rendering fails.
- [x] Add preview-specific meaningful loading, error, empty, success, and 404 surfaces using the existing calm FDLC visual system.
- [x] Expose only manifest-listed schema, example, diagram, and review artifacts through `/corpus-artifacts/**`; return 404 for unknown or traversal paths.
- [x] Apply `noindex, nofollow, noarchive`, disallow `/corpus-preview/` in robots, and confirm preview URLs remain absent from `app/sitemap.ts`.
- [x] Do not add the preview to primary navigation. Local review uses the direct URL until the Product Owner chooses its long-term placement.

**Exit:** the complete routed corpus is reviewable without changing any canonical route or Guide ownership boundary.

### Phase 4 — Add contract, render, and browser coverage

- [x] Add unit tests for route normalization, collision inventory, link rewriting, unsafe schemes, heading IDs, duplicate/custom anchors, artifact allowlisting, stale generation, and schema mismatches.
- [x] Add route-contract tests proving every manifest path maps to one preview URL and one document with deterministic ordering.
- [x] Add rendered-HTML tests for the catalog, representative document, metadata, noindex directives, raw artifacts, custom fragments, preview 404, and unchanged canonical route contracts.
- [x] Browser-test catalog progressive disclosure, filter/query persistence, no-results recovery, direct deep-link/fragment entry, and preview-context 404 recovery.
- [x] Browser-parse all 33 Mermaid sources and render a representative diagram with source fallback in both runtimes.
- [x] Run axe and horizontal-overflow checks for the catalog and long table/diagram document at desktop and mobile widths.
- [x] Verify JavaScript-disabled document readability and asynchronous Mermaid loading/source behavior.
- [x] Verify unknown documents/artifacts fail closed in both runtimes and path traversal is rejected by the shared contract.
- [x] Confirm canonical route contracts and the `/start#factory-builder` flow are unchanged.

**Exit:** reader, author, reviewer, unhappy-path, accessibility, and ownership flows are covered in both runtimes.

### Phase 5 — Final qualification and local handoff

- [x] Wire generation/verification into `build`, `build:vercel`, `typecheck`, and the test commands so stale output cannot bypass a gate.
- [x] Run install/lockfile verification, unit tests, lint, typecheck, Vinext build plus rendered tests, native Next webpack build/runtime tests, and both browser suites.
- [x] Measure generated artifact and client JavaScript size; keep catalog input metadata-only and Mermaid lazy-loaded.
- [x] Regenerate the machine-readable and Markdown verification reports after the final content change.
- [x] Rerun the full supported gate without modifying corpus inputs afterward.
- [x] Document exact local start/test commands and representative URLs in the branch review report.
- [x] Review the final diff for unrelated changes, copied executable paths, generated noise, and accidental canonical-route edits.
- [x] Commit on `codex/corpus-integration-preview`; do not merge, push, deploy, or create a canonical route cutover without Product Owner direction.

**Exit:** the user can check out the branch, reproduce validation, browse the preview, and make an informed merge/promotion decision.

## Acceptance criteria

### Functional

- [x] Every routed corpus page is available under `/corpus-preview/**` from one generated manifest.
- [x] Catalog counts, grouping, ordering, search, and filters are manifest-derived and URL-addressable.
- [x] Every internal corpus link and fragment resolves; existing site/Guide/external links are classified.
- [x] Previous/next order is deterministic and the catalog return link preserves filter state.
- [x] Unknown documents and raw artifacts return 404; traversal never exposes a file.
- [x] Schema/example files are downloadable only when manifest-listed and all pairs validate.
- [x] Mermaid failure affects only its diagram and leaves readable source.

### Publication safety

- [x] Existing canonical pages, redirects, Guide routes, `/start#factory-builder`, navigation, and sitemap behavior remain unchanged.
- [x] Preview pages are absent from the sitemap and include `noindex, nofollow, noarchive`; robots disallows `/corpus-preview/`.
- [x] Arbitrary HTML/MDX, unsafe URL schemes, unlisted assets, and secret/local-path leakage are rejected or neutralized.
- [x] Canon, audits, reports, and runbooks are not accidentally treated as public prose routes.

### Verification integrity

- [x] Zero duplicate or reserved preview routes.
- [x] Zero unresolved navigable links or fragments.
- [x] A generated canonical-collision inventory lists all expected collisions.
- [x] Negative fixtures and contract tests prove missing-link, invalid-anchor, unsafe-content, path-traversal, stale-manifest, and schema-mismatch failures.
- [x] Final reports include original checksum, current digest, tool versions, timestamp, and exact pass/fail/skip/externally-unverifiable totals.
- [x] Report counts match the final generated manifest and no corpus changes occur after the final full gate.

### Experience and quality

- [x] Desktop/mobile, keyboard, screen-reader, reduced-motion CSS, asynchronous-JavaScript, and JavaScript-disabled reading paths are usable.
- [x] Loading, empty, error, success, Mermaid failure, and 404 states are calm, explicit, and recoverable.
- [x] Client search receives metadata only; the complete corpus body is not included in the catalog bundle.
- [x] Vinext/Cloudflare and native Next builds serve representative catalog, prose, fragment, schema, diagram, and 404 paths consistently.
- [x] Unit, rendered HTML, browser accessibility, lint, typecheck, Vinext build, and native Next build gates pass.

### Promotion blockers

- [x] Canonical promotion remains blocked while identifier/authority semantics are undecided.
- [x] Canonical promotion remains blocked while taxonomy entries lack supporting evidence or qualification.
- [x] Canonical promotion remains blocked while external Mission Control references are unresolved or unverified.
- [x] Each of the nine canonical collisions has an explicit recommendation and still requires Product Owner preserve/merge/supersede approval in a future cutover plan.

## Improvements and feature recommendations

### Include in this branch

1. **URL-addressable catalog filters.** Makes review links shareable and preserves state through back/forward navigation.
2. **Verification status page.** Turns quality claims into inspectable evidence and makes limitations visible.
3. **Taxonomy disposition register.** Prevents a proposed-name backlog from masquerading as a qualified pattern library.
4. **Raw artifact viewer/downloads.** Lets reviewers inspect schemas/examples without creating premature canonical machine endpoints.
5. **Accessible Mermaid source fallback.** Keeps technical content usable when client rendering or JavaScript fails.
6. **Generated collision and semantic-decision registers.** Converts ambiguous cutover risk into explicit Product Owner decisions.

### Recommend next, after preview validation

1. **Selective canonical promotion.** Preserve interactive landing pages; merge or attach deeper corpus material page by page rather than replacing all nine collisions.
2. **Canonical machine-readable endpoints.** Publish `/schemas/v1/*.schema.json`, `fdlc.json`, `llms.txt`, and `llms-full.txt` only after host, versioning, and compatibility contracts are approved.
3. **Manifest-driven sitemap family.** Replace the hard-coded site sitemap only when corpus routes become canonical and coordinate the composed Guide sitemap boundary.
4. **Version and diff UI.** Show changes between qualified corpus releases after the governance/versioning model exists.
5. **Feedback hooks tied to source.** Add “report an issue” links with route/source context after the public repository and contribution workflow are settled.
6. **Role-based reading paths.** Build buyer/leader, platform, security, and factory-builder paths from reviewed metadata after the base taxonomy stabilizes.
7. **Cross-document concept graph.** Generate related concepts from explicit references, not embeddings, once links and aliases are qualified.

### Defer

- full-text client indexing of 374k words;
- CMS migration;
- personalized recommendations;
- account state, annotations, or reading progress persistence;
- automated acceptance of proposed patterns;
- production redirects or canonical-host changes;
- replacing the current Guide, Start tool, maturity assessment, or bespoke landing pages wholesale.

These are either premature before information architecture is approved or add state/operational burden without improving the immediate corpus-review decision.

## Alternatives considered

### Mount all corpus routes directly

Rejected for this branch. It collides with nine established pages, crosses Guide ownership, risks losing interactive functionality, and turns draft material into apparent canon before review.

### Build a separate corpus application

Not selected. It would avoid route collisions but duplicate the site shell, design system, deployment/runtime concerns, and composed-host routing. A namespace provides isolation with less operational surface.

### Render MDX at runtime

Rejected. The corpus does not require executable components, runtime filesystem access is unreliable across both targets, and MDX expands the trust boundary. Build-time Markdown generation is simpler and safer.

### Publish the archive as downloads only

Rejected as the final outcome. It is low risk but does not let the Product Owner validate navigation, readability, links, diagrams, or information architecture in the actual product.

## Dependencies and risks

| Risk | Impact | Mitigation |
|---|---|---|
| Central generated module is too large | Slow build or oversized bundles | Measure early; split per-document artifacts and keep catalog metadata-only |
| Vinext and Next disagree | Preview works in one target only | Treat both build/runtime suites as required gates |
| Renderer/verifier anchors drift | Green report, broken fragments | One shared heading/link contract and browser fragment tests |
| Semantic cleanup changes canon silently | Incorrect normative guidance | Inventory first; change only proven cases; Product Owner decides unresolved items |
| Mermaid blocks reading | Blank/broken documents | Lazy client boundary, strict mode, source fallback, per-diagram errors |
| Preview becomes discoverable prematurely | Draft corpus indexed or cited as canon | No nav, no sitemap, robots disallow, noindex/nofollow/noarchive, visible status |
| Cached/generated output becomes stale | Validation does not match served content | Source digests, stale-output gate, final clean rerun |
| Imported material leaks paths/secrets | Trust and security issue | Repository-relative display, scan, allowlisted artifacts, unsafe-scheme/traversal fixtures |
| Taxonomy work expands indefinitely | Branch never becomes reviewable | Disposition all items; authoring/qualification remains separate work |

## Validation commands

Final command names may change while wiring the scripts, but the handoff must provide one reproducible sequence equivalent to:

```bash
npm ci
npm run corpus:verify
npm run test:unit
npm run lint
npm run typecheck
npm run test
npm run test:next
npm run test:browser
npm run test:browser:vercel
```

The final report must record the actual commands and versions used, not this illustrative list.

## Local review checklist

- [ ] Open `/corpus-preview` and confirm status/provenance are unmistakable.
- [ ] Filter to at least three collections, share the URL, refresh, and use Back.
- [ ] Open one framework page, one architecture page, one tutorial, one schema page, one pattern register, and one diagram-heavy page.
- [ ] Follow an internal preview link, an existing-site link, a Guide link, and an external source link.
- [ ] Use TOC and a direct custom-fragment URL.
- [ ] Force or inspect Mermaid source/error fallback.
- [ ] Test narrow/mobile layout and keyboard navigation.
- [ ] Visit an invalid document and raw-artifact path and confirm contextual 404 recovery.
- [ ] Verify `/start#factory-builder`, `/maturity`, `/framework`, `/architecture`, `/enterprise`, and `/specification` still behave as before.
- [ ] Review collision, semantic-decision, taxonomy-disposition, and verification reports before approving merge or route promotion.

## Research and internal references

- Brainstorm: `docs/brainstorms/2026-09-12-corpus-integration-preview-brainstorm.md`
- Existing static-first decision: `docs/brainstorms/2026-09-03-fdlc-site-v0-brainstorm.md`
- Existing launch-quality decision: `docs/brainstorms/2026-09-04-engineering-launch-ui-ux-brainstorm.md`
- Guide composition plan: `docs/plans/2026-09-04-feat-unify-fdlc-guide-experience-plan.md`
- Current navigation contract: `lib/global-navigation.ts`
- Existing Guide shadow route: `app/guide/[slug]/page.tsx`
- Current sitemap ownership: `app/sitemap.ts`
- Existing rendered contract suite: `tests/rendered-html.test.mjs`
- Existing browser/accessibility suite: `tests/browser.mjs`
- Claude verification report in the archive: `audit/06-corpus-verification.md`
- Claude implementation assumptions in the archive: `site-implementation/RUNBOOK.md`

No external research was needed: the repository and adjacent Guide implementation already establish the relevant content-generation, reader, accessibility, and dual-runtime patterns. The work is constrained by local route ownership and corpus semantics rather than an unfamiliar framework or external API.
