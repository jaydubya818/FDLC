# FDLC Corpus Integration Preview

**Date:** 2026-09-12
**Status:** Implemented; ready for local Product Owner review
**Branch:** `codex/corpus-integration-preview`

## What we are building

Integrate Claude's reviewed FDLC corpus into the existing FDLC site as a locally testable, explicitly non-canonical preview. The preview will ingest the corpus from version-controlled Markdown and assets, generate a typed route manifest at build time, render the documents with the existing FDLC shell, and ship with reproducible verification evidence.

The preview will live under `/corpus-preview/**`. Existing public routes such as `/framework`, `/architecture`, `/enterprise`, `/start`, and `/specification` will remain unchanged until the Product Owner reviews the corpus locally and approves a separate route-promotion plan.

## Why this approach

The current site is a static-first Next/Vinext application with multiple established top-level routes and a composed Guide experience. Mounting the archive directly at its declared canonical paths would create route collisions, mix draft content with production content, and make rollback harder. A preview namespace makes the change reversible, testable, and honest about editorial status.

The archive also contains claims that are not yet fully reproducible: stale banned-term results, unresolved links, a missing verifier, inconsistent route counts, and a proposed-pattern register that needs taxonomy review. Those are integration inputs to fix or expose—not assertions to inherit.

## Product and architecture decisions

1. **Preview before promotion.** All corpus routes are namespaced under `/corpus-preview`; the preview is excluded from the production sitemap and marked Draft/Preview on every page.
2. **One version-controlled source.** Markdown, diagrams, schemas, examples, audit notes, and the implementation runbook are imported into a stable `content/fdlc-corpus/` tree. Generated route data is derived from that tree and never edited by hand.
3. **Build-time content contract.** A generator validates front matter, route uniqueness, route collisions, internal links, anchors, diagram references, schema/example pairs, and prohibited language before emitting the route manifest consumed by both Vinext and Next builds.
4. **Safe Markdown, not executable MDX.** Corpus prose is treated as data. Rendering supports GitHub-flavored Markdown, deterministic heading IDs, code blocks, tables, callouts, and Mermaid diagrams without executing arbitrary components from content.
5. **Verification must be reproducible.** The repository will contain the verifier source, fixtures that prove it fails when expected, tool/runtime versions, and machine-readable plus human-readable reports produced from the final tree.
6. **No silent link failures.** Known corpus targets are rewritten into the preview namespace. Existing site routes remain explicit. Missing targets or fragments fail verification; the renderer does not hide them with a permissive fallback.
7. **Taxonomy is a register, not canon.** The 73 proposed pattern and anti-pattern names remain visibly unqualified. Obvious aliases, specification artifacts, and duplicates are classified before canonical promotion; the preview must not imply that all 73 are accepted library entries.
8. **Canonical semantics are a release gate.** Identifier-family conflicts and the first-activation authority invariant must be resolved consistently across canon, prose, schemas, and examples before route promotion. Passing JSON Schema alone is not evidence of semantic consistency.

## Reader experience

The preview landing page will provide:

- clear status and provenance;
- corpus counts by collection and level;
- search/filter over titles, paths, audience, level, and status;
- section navigation that reflects the actual route manifest;
- a visible list of verification limitations and unresolved editorial decisions.

Each document page will provide:

- global FDLC navigation and a preview banner;
- breadcrumbs and collection navigation;
- title, description, audience, level, status, and source path;
- deterministic table of contents with working fragments;
- rendered prose, diagrams, tables, code, and accessible Mermaid fallback;
- previous/next navigation;
- clear loading, empty, diagram-error, and route-not-found states.

## Scope for this branch

### Must ship

- archive ingestion with provenance and checksum;
- generated content/route manifest;
- `/corpus-preview` catalog and `/corpus-preview/**` document pages;
- route/link/anchor/schema/example/content-policy verification;
- representative Mermaid rendering with a readable source fallback;
- contract, rendering, accessibility, and dual-build tests;
- a final local validation report with exact pass/fail/skip counts.

### Improve while integrating

- correct the known unresolved route targets instead of carrying 404s;
- eliminate stale absolute `/home/claude/work` references from executable instructions and reports;
- align corpus inventory counts with one generated source of truth;
- correct "Proposed Proposed" labeling and classify obvious taxonomy duplicates/aliases;
- distinguish independently verified checks from checks skipped because Mission Control or external tooling is unavailable;
- add an explicit bootstrap rule for an initial authority grant and normalize identifier terminology where the canon already makes the intended rule clear.

### Deferred until review

- replacing existing canonical site pages;
- changing the main navigation or production sitemap to advertise the preview;
- deleting current authored pages or redirects;
- licensing/governance ratification;
- accepting all proposed patterns into the qualified library;
- production deployment or merge into `main`.

## Risks and controls

- **Content volume can inflate bundles.** Generate metadata and document modules deliberately, inspect build output, and avoid shipping the entire search body to the client.
- **Dual runtime drift.** Treat Vinext/Cloudflare and Next/Vercel builds as separate required gates.
- **Mermaid can fail only in the browser.** Test at least one diagram from every Mermaid family in a real browser and retain readable source on failure.
- **Route rewrites can disguise bad source links.** Keep rewrite rules narrow, explicit, and contract-tested; do not add a generic catch-all compatibility shim.
- **Mechanical terminology changes can alter meaning.** Use a reviewed mapping, test every schema/example pair, and list remaining semantic decisions rather than guessing.
- **A green report can become stale after edits.** Generate the final report only after all content and generated artifacts are complete, then run the full gate once more without modifying inputs.

## Success criteria

The branch is ready for local Product Owner review when:

1. every preview route is generated from the same manifest the verifier checked;
2. no preview navigation or content link returns an unintended 404;
3. internal fragments resolve, duplicate preview routes are zero, and the nine canonical collisions remain explicitly inventoried;
4. all schema/example pairs validate, with semantic limitations stated separately;
5. diagrams render or expose an accessible source fallback without breaking the page;
6. unit, rendered HTML, browser accessibility, lint, typecheck, Vinext build, and Next build gates pass;
7. the final report is reproducible and does not overstate skipped checks;
8. the existing canonical routes behave exactly as they did before the branch.

## Open decisions after local validation

- Which corpus pages should replace existing canonical routes, and which should remain deeper reference material?
- Should the long-form corpus become the canonical Guide, a separate Reference area, or a hybrid mapped to existing pages?
- Which proposed patterns are true new candidates versus aliases, artifacts, or anti-pattern misclassifications?
- What repository and governance model should own canon, schemas, examples, and qualification decisions after launch?

## Next step

Validate the implementation locally using `docs/reviews/2026-09-12-corpus-preview-validation.md`. Canonical route promotion requires a separate Product Owner decision after local review.
