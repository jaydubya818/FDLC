---
status: pending
priority: p2
issue_id: "004"
tags: [code-review, performance, content, architecture]
dependencies: ["002"]
---

# Split the corpus runtime payload before canonical publication

## Problem Statement

The generated corpus module is approximately 5.3 MB and places all document bodies and raw artifacts into shared server chunks. The catch-all document route is currently dynamic because it preserves query-based catalog return state.

## Findings

- The production trace includes an approximately 4.9 MB shared corpus chunk for both the catalog and document route.
- The Next build reports `/corpus-preview/[...slug]` as dynamic rather than statically generated.
- This is acceptable for a low-traffic review surface but should be qualified before public navigation increases traffic.

## Proposed Solutions

### Option 1: Generate one module per document and artifact

Keep a small metadata manifest and load only the selected content module.

**Pros:** Bounded server payload and clearer cache behavior.

**Cons:** More generated files. **Effort:** Medium. **Risk:** Medium.

### Option 2: Move reviewed content to a deploy-time content store

Fetch immutable, digest-addressed documents at runtime.

**Pros:** Small application bundle and independent content releases.

**Cons:** Adds network, caching, and operational complexity. **Effort:** Large. **Risk:** Medium.

## Recommended Action

Use Option 1 and benchmark representative cold starts before canonical promotion.

## Acceptance Criteria

- [ ] Catalog routes load metadata without the full body corpus.
- [ ] Document routes load only the requested document and required artifacts.
- [ ] Static versus dynamic rendering is an explicit, tested decision.
- [ ] Cold-start and bundle measurements are recorded before and after.

## Work Log

### 2026-09-12 - Final review finding

**By:** Codex

**Actions:** Measured the generated module and traced the shared production chunk.

**Learnings:** Preview traffic does not justify early storage complexity, but canonical traffic requires a bounded payload.
