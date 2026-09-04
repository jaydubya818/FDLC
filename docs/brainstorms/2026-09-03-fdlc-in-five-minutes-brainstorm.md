---
date: 2026-09-03
topic: fdlc-in-five-minutes
status: completed
---

# FDLC in Five Minutes

> Superseded model note: the current walkthrough uses three abstraction levels
> plus the six-domain structural view. References below to four views describe
> the earlier implementation preserved by this historical brainstorm.

## What We're Building

Publish one worked dependency-modernization scenario that shows the same bounded factory line through all four FDLC views: how the factory evolves, how software moves through it, what capabilities participate, and which durable artifacts preserve proof and decisions. Add the core state-boundary invariant to Framework, Architecture, and Mission Control, plus compact long-page navigation for Framework and Architecture.

The page is a reference scenario, not a production case study or benchmark. It may define example records and a measurement contract, but it must not imply that illustrative values are observed customer results.

## Why This Approach

The site already has sufficient taxonomy. A single end-to-end example reduces cognitive load and makes the relationship between the framework, Guide, and Mission Control inspectable. Dependency modernization is broadly understood, deterministically verifiable, and less likely than vulnerability remediation to make FDLC appear security-specific.

## Key Decisions

- Scope: One repository and one dependency-major-version upgrade.
- Evidence boundary: Illustrative artifacts are labeled; Mission Control capability claims link to the canonical public maturity ledger.
- Measurement: Define baseline and target signals without fabricating achieved results.
- Navigation: Use a sticky horizontal contents rail on desktop and an in-flow disclosure on mobile; avoid a second permanent sidebar.
- State invariant: Reuse one semantic component so wording cannot drift across core pages.
- CTA: Lead homepage visitors to the worked example before deeper framework material.

## Open Questions

- None blocking this release. A future evidence-backed case study requires retained real-run data and explicit permission to publish it.

## Next Steps

- [x] Add typed example content and shared navigation/state-boundary components.
- [x] Build `/examples/dependency-modernization` and connect it to the homepage and global navigation.
- [x] Add state boundaries and section navigation to the three core pages.
- [x] Update metadata, sitemap, tests, and documentation.
- [x] Run automated, responsive, accessibility, and production-deployment verification.
