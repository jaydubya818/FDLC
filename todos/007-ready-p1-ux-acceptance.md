---
status: ready
priority: p1
issue_id: "007"
tags: [ux, acceptance, ai-fde]
dependencies: []
---
# Complete FDLC UX and unify AI-FDE

## Problem Statement
Approved UX functionality has acceptance defects; the independently deployed cockpit feels like another site.

## Findings
See the supplied PR45 review and approved integration handoff. Preserve synthetic isolation and standard proxy; no Production release.

## Proposed Solutions
- Recommended: integrate PR45 with current main, fix defects and mirror a versioned FDLC header contract in the child.
- Deferred: optional command palette; no paid MFE project or backend consolidation.

## Recommended Action
Deliver the qualified UI first, then bind a separate FDLC change to its immutable Preview.

## Acceptance Criteria
- [x] Reconcile source conflicts with latest main.
- [x] Correct exports, storage handling, sharing and fragment links with regression coverage.
- [x] Unified global header and restrained AI-FDE context on every child state.
- [x] Inspect and refine desktop, tablet, mobile and reflow screenshots.
- [ ] Synchronize Guide navigation/configuration and verify book/search/deep links.
- [ ] Full FDLC and AI-FDE checks and independent final review.
- [ ] Push UI changes; qualify Preview and exact-main source.
- [ ] Separate immutable binding PR, composed checks, qualified merge and exact-main checks.

## Work Log
### 2026-09-14
Created isolated worktree from main 9528253; integrated PR45. Core defect fixes and shell mirroring underway. User authorized end-to-end Preview delivery and qualified source merges, explicitly excluding Production.
