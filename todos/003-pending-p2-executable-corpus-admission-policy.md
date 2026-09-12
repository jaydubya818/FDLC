---
status: pending
priority: p2
issue_id: "003"
tags: [code-review, content, verification, architecture]
dependencies: ["002"]
---

# Make the corpus admission policy executable

## Problem Statement

`publication.json` documents content classifications, but the generator currently enforces a mirrored set of hard-coded path rules. The two representations can drift, and front-matter arrays are coerced rather than shape-validated.

## Findings

- `scripts/corpus/generate.ts` parses `publication.json` but does not consume its classifications.
- Route exclusions and raw-artifact inclusion are separately hard-coded in the generator.
- `audience`, `level`, `diagrams`, `mc_refs`, and `related` accept scalar or non-string values through coercion.

## Proposed Solutions

### Option 1: Make `publication.json` the typed source of truth

Parse and validate a small explicit schema, then derive route and artifact admission from it.

**Pros:** One enforceable policy with useful negative tests.

**Cons:** Requires a focused manifest schema and matcher. **Effort:** Medium. **Risk:** Low.

### Option 2: Remove the documentary manifest

Keep policy entirely in TypeScript and update provenance wording.

**Pros:** Simplest implementation.

**Cons:** Less approachable for content maintainers. **Effort:** Small. **Risk:** Low.

## Recommended Action

Use Option 1 before accepting another external corpus revision.

## Acceptance Criteria

- [ ] One typed policy controls routed documents, exclusions, and raw artifacts.
- [ ] Invalid or unknown classification rules fail the build.
- [ ] Front-matter arrays reject objects and unexpected scalar shapes.
- [ ] Negative fixtures prove policy drift and malformed metadata are rejected.

## Work Log

### 2026-09-12 - Final review finding

**By:** Codex

**Actions:** Recorded the duplicate documentary/executable policy discovered during final branch review.

**Learnings:** A manifest should either control admission or be clearly labeled as documentation.
