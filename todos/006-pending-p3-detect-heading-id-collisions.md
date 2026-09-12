---
status: pending
priority: p3
issue_id: "006"
tags: [code-review, quality, content, navigation]
dependencies: ["003"]
---

# Detect mixed explicit and generated heading-id collisions

## Problem Statement

The shared heading factory detects repeated explicit ids and suffixes repeated generated slugs, but it does not detect a collision between an explicit id and a generated slug.

## Findings

- The committed corpus currently contains no mixed heading-id collision.
- A future `## Alpha` and `## Other {#alpha}` pair could produce duplicate DOM ids and ambiguous fragments.

## Proposed Solutions

### Option 1: Track every assigned id in the shared factory

Reject an explicit collision and suffix generated ids around reserved explicit ids.

**Pros:** Small, deterministic fix shared by verifier and renderer.

**Cons:** Requires defining order-sensitive suffix behavior. **Effort:** Small. **Risk:** Low.

### Option 2: Ban explicit ids

Use generated slugs exclusively.

**Pros:** Simpler contract.

**Cons:** Breaks intentional stable anchors. **Effort:** Medium. **Risk:** Medium.

## Recommended Action

Use Option 1 with both ordering cases covered by unit fixtures.

## Acceptance Criteria

- [ ] Explicit/generated collisions cannot create duplicate DOM ids.
- [ ] Both explicit-first and generated-first ordering are tested.
- [ ] Existing corpus anchors remain unchanged.

## Work Log

### 2026-09-12 - Final review finding

**By:** Codex

**Actions:** Compared the verifier and renderer's shared heading-id allocation behavior.

**Learnings:** Duplicate detection must cover collisions across allocation modes, not only within one mode.
