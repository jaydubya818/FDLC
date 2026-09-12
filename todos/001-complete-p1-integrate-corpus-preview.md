---
status: complete
priority: p1
issue_id: "001"
tags: [content, routing, verification, accessibility, vinext, next]
dependencies: []
---

# Integrate and verify the FDLC corpus preview

## Problem Statement

The reviewed FDLC corpus exists only as an archive and contains route, verification, taxonomy, and semantic inconsistencies. It needs a reversible local preview that does not replace current canonical pages.

## Findings

- The archive contains 160 Markdown files and 157 declared routes, despite conflicting report counts.
- Nine corpus routes collide with existing static pages; Guide composition owns additional paths.
- The archive omits the verifier and reproducible evidence behind its quality claims.
- Known link, anchor, taxonomy, prohibited-term, and semantic conflicts must be resolved or surfaced before promotion.
- The root app has dual Vinext and Next build/runtime contracts and no current Markdown ingestion stack.

## Proposed Solutions

### Option 1: Namespaced verified preview

**Approach:** Import the corpus, generate and verify it at build time, and render it under `/corpus-preview/**` with noindex controls.

**Pros:** Reversible, preserves current routes, enables realistic review, supports reproducible validation.

**Cons:** Requires an explicit later promotion step and temporary preview URL mapping.

**Effort:** Large

**Risk:** Medium

### Option 2: Direct canonical cutover

**Approach:** Replace existing routes with corpus pages immediately.

**Pros:** Shortest apparent path to publication.

**Cons:** Route collisions, lost interactive experiences, premature canon claims, difficult rollback.

**Effort:** Large

**Risk:** High

### Option 3: Archive-only delivery

**Approach:** Keep the corpus as downloadable files without site rendering.

**Pros:** Minimal engineering risk.

**Cons:** Does not validate product navigation, readability, diagrams, links, or information architecture.

**Effort:** Small

**Risk:** Low engineering risk; high product-review risk

## Recommended Action

Implement Option 1 according to `docs/plans/2026-09-12-feat-corpus-integration-preview-plan.md`. Keep canonical promotion, deployment, and merge as separate Product Owner decisions.

## Technical Details

**Affected areas:**

- `content/fdlc-corpus/**`
- `scripts/corpus/**`
- `data/corpus.generated.*`
- `lib/corpus*.ts`
- `app/corpus-preview/**`
- `app/components/corpus/**`
- `tests/**`
- `package.json` and lockfile

No database, authentication, payment, or persistent user-state changes are planned.

## Resources

- `docs/brainstorms/2026-09-12-corpus-integration-preview-brainstorm.md`
- `docs/plans/2026-09-12-feat-corpus-integration-preview-plan.md`
- `/Users/jaywest/Documents/ChatGPT/FDLC/fdlc-corpus-review.tar.gz`

## Acceptance Criteria

- [x] Corpus is imported with provenance and explicit publication classifications.
- [x] Generation and strict verification share route, heading, link, and asset rules.
- [x] All routed content renders under `/corpus-preview/**` without changing canonical routes.
- [x] Preview catalog, document, loading, empty, error, Mermaid fallback, and 404 states are complete.
- [x] Known link/content/taxonomy defects are resolved or explicitly dispositioned.
- [x] Preview is noindex and excluded from discovery surfaces.
- [x] Negative fixtures and stale-output checks prove verifier behavior.
- [x] Unit, lint, typecheck, Vinext, Next, rendered, browser, and accessibility gates pass.
- [x] Final evidence is regenerated after the last content change and is reproducible.
- [x] Local handoff instructions and representative review URLs are documented.

## Work Log

### 2026-09-12 - Planning and isolation

**By:** Codex

**Actions:**

- Created `codex/corpus-integration-preview` from `origin/main@ff7b25f` in an isolated worktree.
- Reviewed the archive, current route ownership, adjacent Guide content pipeline, and existing quality gates.
- Wrote the brainstorm and comprehensive implementation plan.
- Selected the namespaced preview approach already authorized by the user's request to proceed on a test branch.

**Learnings:**

- Route promotion and corpus integration must be separate decisions.
- The generator/verifier/manifest must ship atomically to prevent stale or falsely green output.
- Semantic conflicts should block promotion, not local preview review.

### 2026-09-12 - Implementation and qualification

**By:** Codex

**Actions:**

- Imported 277 archive files and generated 157 preview routes plus 95 allowlisted artifacts.
- Implemented strict generation, shared route/heading/link rules, taxonomy dispositions, safe rendering, progressive catalog discovery, Mermaid fallback, and discovery controls.
- Fixed integration defects, mobile overflow, empty table headers, and Vinext JavaScript-disabled streaming behavior found during browser validation.
- Restored production dependency audit results to zero after replacing Mermaid 12's vulnerable parser path with Mermaid 11.17.2 and a patched `lodash-es` override.
- Passed 39 unit tests, 25 rendered tests, lint, typecheck, both production runtime builds, both 13-check browser suites, and 33/33 Mermaid source parses.
- Wrote the final validation report and local review instructions at `docs/reviews/2026-09-12-corpus-preview-validation.md`.

**Learnings:**

- A route-level loading boundary can make streamed Vinext content unreadable without JavaScript; generated synchronous documents should not use that boundary.
- The raw-artifact route must remain outside the document catch-all for consistent Vinext precedence.
- A full 157-card catalog is technically correct but poor review UX; progressive disclosure keeps the manifest complete without an excessive initial DOM.
- Canonical promotion remains a product/governance decision even after the preview implementation is qualified.

## Notes

- Do not merge, push, deploy, or replace canonical routes without Product Owner direction.
