---
status: complete
priority: p1
issue_id: "002"
tags: [content, navigation, discovery, accessibility, verification]
dependencies: ["001"]
---

# Turn the corpus preview into a useful community hub

## Problem Statement

The verified corpus preview is optimized for inspecting a 157-document manifest. It does not clearly show an FDLC community member what the library helps them accomplish or where to begin.

## Findings

- The first result is an anti-pattern page because the catalog is alphabetical rather than task-oriented.
- Verification counts and audit links appear before reader outcomes.
- Users can filter only by collection, despite audience and level metadata being available.
- Every automated acceptance box was marked complete while the Product Owner review and shipping Turbopack build remain open.

## Proposed Solutions

### Option 1: Curated hub over the existing preview

Add outcome-based paths, topic discovery, richer filters, and a clearer reader-first hierarchy while preserving the namespace and verification contract.

**Pros:** Useful now, reversible, and no canonical cutover risk.

**Cons:** Curated paths require deliberate maintenance.

### Option 2: Promote the corpus directly

Replace the current canonical information architecture with corpus routes.

**Pros:** Immediate public visibility.

**Cons:** Premature, collision-prone, and implies qualification that has not happened.

## Recommended Action

Implement Option 1. Keep canonical promotion, taxonomy adjudication, and route replacement as explicit Product Owner decisions.

## Acceptance Criteria

- [x] Four outcome-based reading paths use only manifest-backed routes.
- [x] Community value is explained before audit mechanics.
- [x] Catalog supports URL-addressable collection, audience, level, and keyword filters.
- [x] Desktop and mobile layouts remain accessible and free of horizontal overflow.
- [x] Existing corpus documents, artifacts, noindex controls, and canonical pages remain unchanged.
- [x] Automated tests, dual supported runtimes, and the actual Vercel/Turbopack build are reported separately.
- [x] The actual Vercel/Turbopack build passes in a normal local or Vercel environment.
- [x] The local Product Owner review checklist remains unchecked for the Product Owner to complete.

## Work Log

### 2026-09-12 - Product diagnosis and scope

**By:** Codex

**Actions:**

- Reviewed the running preview as a first-time user and confirmed that the audit-first hierarchy obscures community value.
- Accepted the independent criticism that producer-run automation is not Product Owner acceptance and that the shipping build target needs its own visible gate.
- Selected a curated, goal-oriented hub that preserves the noindex review boundary.

**Learnings:**

- A complete content inventory is not the same thing as usable information architecture.
- Governance evidence should support trust without becoming the primary user journey.

### 2026-09-12 - Implementation and final-source validation

**By:** Codex

**Actions:**

- Added four curated learning paths, six topic entry points, and audience/depth catalog filters backed by shareable URLs.
- Reduced the initial catalog from 24 to 9 documents and collapsed maintainer-only evidence to shorten the mobile reading path.
- Found and fixed a sequential-filter state-loss bug during manual browser interaction.
- Added manifest contract, rendered HTML, browser flow, responsive layout, and accessibility coverage.
- Passed the final-source Vinext and native Next webpack builds, 40 unit checks, 25 rendered checks, both 14-check corpus browser suites, both 52-check whole-site suites, lint, typecheck, and the production dependency audit.
- Attempted `npm run build:vercel` against the final source. Next 16.3.4 Turbopack was blocked before application compilation because this managed host denies the PostCSS worker's internal port bind.

**Learnings:**

- Draft filter values should be submitted atomically; auto-applying independent selects can lose state during overlapping client transitions.
- A technically complete corpus becomes useful only after outcome-based wayfinding is placed ahead of the raw inventory.
- The shipping build remains a separate gate until it succeeds in a normal Terminal or Vercel environment.

### 2026-09-12 - External shipping gate closed

**By:** Product Owner and Codex

**Actions:**

- The Product Owner ran `npm run build:vercel` from the isolated worktree in a normal macOS Terminal.
- Next 16.3.4 Turbopack compiled successfully, completed TypeScript and page data collection, generated 279 of 279 static pages, and passed the post-build design-system check.
- Restored the generated `next-env.d.ts` file to its committed dual-runtime form and completed the final merge review.

**Learnings:**

- Environment restrictions must be reported separately from product failures and closed with evidence from the real shipping path.
