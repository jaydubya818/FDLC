---
status: pending
priority: p2
issue_id: "005"
tags: [code-review, security, content, artifacts]
dependencies: ["003"]
---

# Sandbox SVG artifacts before accepting future imports

## Problem Statement

Allowlisted SVG files are served as same-origin `image/svg+xml`. The current files contain no scripts, event handlers, foreign objects, or executable URLs, but the admission gate does not guarantee that future imports remain passive.

## Findings

- Current artifact responses correctly include `nosniff` and `noindex`.
- Current SVG sources passed a scan for active-content constructs.
- A future imported SVG could become active content when navigated to directly unless it is rejected, sanitized, or sandboxed.

## Proposed Solutions

### Option 1: Reject active SVG constructs and add a restrictive CSP

Verify SVG structure during generation and return a sandboxed `default-src 'none'` content policy.

**Pros:** Defense in depth while retaining inline image rendering.

**Cons:** Needs XML-aware validation to avoid brittle regex-only security. **Effort:** Medium. **Risk:** Low.

### Option 2: Convert every SVG to a passive raster asset

Expose PNG/WebP only.

**Pros:** Removes active SVG behavior.

**Cons:** Loses scalable/vector assets and adds generation cost. **Effort:** Medium. **Risk:** Low.

## Recommended Action

Use Option 1 before importing diagrams from any additional source.

## Acceptance Criteria

- [ ] Active SVG constructs fail corpus admission.
- [ ] SVG responses carry a restrictive content security policy.
- [ ] Valid diagrams still render when embedded and opened directly.
- [ ] A malicious SVG fixture proves the gate fails closed.

## Work Log

### 2026-09-12 - Final review finding

**By:** Codex

**Actions:** Scanned every current SVG and confirmed no active-content constructs are present.

**Learnings:** Path allowlisting limits exposure but does not make an active document format passive.
