# FDLC.ai Implementation Plan

Date: 2026-09-03

Complexity uses S, M, and L. P0 is required for the first public-quality build; P1 is a meaningful preview or enhancement; P2 is intentionally deferred.

## Epic 1 — Foundation (P0)

### Feature: Application and design-system shell

- **Tasks:** Initialize the supported Sites/Next-compatible TypeScript application; define tokens and primitives; implement header, footer, responsive navigation, section shell, cards, badges, and buttons.
- **Acceptance criteria:** All routes share a consistent shell; navigation is keyboard-operable; mobile navigation works without JavaScript-only hidden state; no starter content remains.
- **Dependencies:** Source audit, IA, design system.
- **Risk:** Overbuilding primitives before content proves their value.
- **Complexity:** M.

### Feature: Canonical content layer

- **Tasks:** Add typed data for lifecycle, architecture, protocol, manifesto, maturity, metrics, guide map, and Mission Control status.
- **Acceptance criteria:** Repeated sequences render from one data source; names and order are consistent site-wide; content utilities have focused tests.
- **Dependencies:** Content model.
- **Risk:** Mixing FDLC concepts with Mission Control implementation names.
- **Complexity:** M.

### Feature: Metadata and release surfaces

- **Tasks:** Add route metadata, canonical URLs, robots, sitemap, manifest/icons, JSON-LD, and one site-level social card.
- **Acceptance criteria:** Each major route has a useful title/description; canonical host is configurable; sitemap includes all public routes; no invented availability claims appear in metadata.
- **Dependencies:** Final route list and brand direction.
- **Risk:** Incorrect production hostname before DNS exists.
- **Complexity:** M.

## Epic 2 — Category and education pages (P0)

### Feature: Homepage

- **Tasks:** Implement the eleven-section narrative using reusable architecture, lifecycle, and protocol diagrams.
- **Acceptance criteria:** A technical leader can answer the ten primary success-test questions in roughly one minute; CTAs route to real destinations; Mission Control and commercial boundaries are clear.
- **Dependencies:** Epic 1.
- **Risk:** Excessive length obscuring the first-minute explanation.
- **Complexity:** L.

### Feature: Framework, Architecture, and Manifesto

- **Tasks:** Build the canonical reference page, detailed six-area architecture page, and shareable ten-principle manifesto.
- **Acceptance criteria:** Framework is understandable without the Guide; every architecture area covers purpose, responsibilities, components, decisions, failure modes, maturity, examples, and relationships; manifesto implications are actionable.
- **Dependencies:** Canonical data and source mapping.
- **Risk:** Duplicated copy drifting across pages.
- **Complexity:** L.

### Feature: Guide shell and mapping

- **Tasks:** Build guide home, six-part chapter map, reading paths, breadcrumbs, sidebar, table of contents, heading anchors, and next/previous navigation; prepare for mechanical content migration.
- **Acceptance criteria:** The 36 authoritative chapters are represented without implying 25 rewrites are complete; route structure is search-ready; long-form layout is accessible and responsive.
- **Dependencies:** Guide repository audit.
- **Risk:** Attempting a full editorial rewrite inside the site build.
- **Complexity:** L.

### Feature: About

- **Tasks:** Explain why lifecycle discipline, evidence, model independence, Mission Control, and openness matter.
- **Acceptance criteria:** Philosophy leads; no confidential employer information is present; founder copy is restrained.
- **Dependencies:** Source audit.
- **Risk:** Unsupported personal credibility claims.
- **Complexity:** S.

## Epic 3 — Mission Control evidence (P0)

### Feature: Public product page

- **Tasks:** Implement hero, golden path, execution timeline, core objects, architecture, governance, verification, adapters, execution environments, screenshots, status matrix, limitations, roadmap boundary, quickstart, and GitHub CTA.
- **Acceptance criteria:** Every present-tense capability maps to current source/evidence; experimental/planned items are labeled; screenshots are from the public README set; quickstart matches current repository docs.
- **Dependencies:** Capability matrix.
- **Risk:** Deterministic proof being read as fleet-scale production maturity.
- **Complexity:** L.

## Epic 4 — Interactive learning (P0)

### Feature: Maturity self-assessment

- **Tasks:** Implement eleven client-side dimensions, six response levels, scoring, strengths, gaps, and recommended next actions.
- **Acceptance criteria:** No authentication or backend; keyboard and screen-reader usable; incomplete state is handled; result calculation is tested; result is described as educational, not certification.
- **Dependencies:** Maturity data.
- **Risk:** False precision from an unvalidated rubric.
- **Complexity:** M.

### Feature: Build Your First Software Factory

- **Tasks:** Implement a five-step client-side flow for outcome, acceptance criteria, authority, deterministic verification, and human judgment; generate a conceptual Factory Definition.
- **Acceptance criteria:** Users can add/remove criteria, navigate safely, review their inputs, and restart; empty/error/success states are explicit; generator logic is tested; no execution claim is made.
- **Dependencies:** Factory Definition content model.
- **Risk:** Output being mistaken for an executable Mission Control manifest.
- **Complexity:** L.

## Epic 5 — Transparent previews (P1)

### Feature: Specification preview

- **Tasks:** Present entity map, intended versioning, invariants, and maturity notice.
- **Acceptance criteria:** Clearly Proposed; reuses Mission Control concepts without claiming compatibility; no parallel schema is published as final.
- **Dependencies:** Mission Control mapping.
- **Risk:** Premature standardization.
- **Complexity:** M.

### Feature: Benchmarks preview

- **Tasks:** Publish measurement philosophy and metric definitions without values.
- **Acceptance criteria:** No invented benchmark numbers; outcome metrics are separated from activity telemetry.
- **Dependencies:** Metrics data.
- **Risk:** Readers assuming a benchmark program already exists.
- **Complexity:** S.

### Feature: Enterprise and Deploy previews

- **Tasks:** Implement restrained future capability and services pages with status labels and design-partner CTA.
- **Acceptance criteria:** No pricing or availability implication; open framework remains primary; contact action does not pretend a backend exists.
- **Dependencies:** Product relationship model.
- **Risk:** Over-commercializing the category launch.
- **Complexity:** S.

## Epic 6 — Quality and release (P0)

### Feature: Automated quality

- **Tasks:** Add tests for content utilities, maturity scoring, Factory Definition generation, and key navigation; run lint, typecheck, tests, and production build.
- **Acceptance criteria:** All configured checks pass with no disabled strictness or ignored accessibility failures.
- **Dependencies:** All implementation epics.
- **Risk:** Vinext/Cloudflare and Next compatibility differences.
- **Complexity:** M.

### Feature: Manual quality

- **Tasks:** Review keyboard flow, responsive behavior, diagrams, metadata, copy consistency, broken links, and source provenance.
- **Acceptance criteria:** All routes render; loading/empty/error/success states are complete where relevant; no inconsistent brand or protocol terms remain.
- **Dependencies:** Complete build.
- **Risk:** Scope pressure reducing polish.
- **Complexity:** M.

## P2 backlog

- Versioned machine-readable FDLC schemas and compatibility test kit.
- Downloadable Factory Definition JSON/YAML.
- Maturity result export.
- Validated benchmarks and benchmark tooling.
- Hosted search if the corpus outgrows lightweight local indexing.
- Community profiles, newsletter, and inquiry backend.
- Production analytics after a privacy decision and provider selection.

