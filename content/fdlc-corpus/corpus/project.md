---
title: Project
description: How the FDLC project is run — license, versioning, changelog, RFC process, roadmap, code of conduct, and the trademark and conformance-mark rules.
path: /project
audience: [leader, architect, platform, factory-engineer, executive]
level: [practitioner]
status: draft
related: [/project/governance, /specification, /specification/conformance, /about, /mission-control, /benchmarks, /compare, /project/seo]
diagrams: []
mc_refs: [LICENSE, CONTRIBUTING.md, SECURITY.md]
---

# Project

## What is it

The operating facts of the FDLC project on one page: what license the content carries, how the specification is versioned, where changes are recorded, how a change is proposed and decided, what is planned, how contributors are expected to behave, and what the name and the conformance marks may be used for. The detailed governance proposal, including the steering group, working groups, and standards alignment, is on [/project/governance](/project/governance). Everything below is a recommendation for the pre-standardization period and becomes binding when the steering group ratifies it through the first RFC.

## Why it matters

A standard another organization can implement needs three guarantees: the text and schemas can be used without legal friction; changes are predictable and reviewable; and "conformant" means something a third party can check. Without those, FDLC is one vendor's documentation. The landscape audit ranked fixing this hygiene above any content gap.

## License

Recommendation from the governance proposal.

| Asset | License | Why |
|---|---|---|
| Specification text, artifact pages, framework, architecture, guides, essays, diagrams (`*.md`, SVG) | **Creative Commons Attribution 4.0 International (CC BY 4.0)** | Anyone may implement, quote, translate, and build derivative documentation with attribution. The license used by SLSA and by many OWASP projects. |
| JSON Schemas, examples, conformance suite, validation tooling, reference adapters | **Apache License 2.0** | Permissive for commercial implementation, with an express patent grant, which matters for schemas vendors embed. |
| The FDLC name, "Factory Development Lifecycle", and conformance marks | Trademark and mark policy (below) | Names are governed separately from content so that "FDLC-conformant" keeps its meaning. |

Mission Control, the reference implementation, is licensed separately under the **MIT License** in its own repository (`LICENSE`). FDLC content that describes it cites file paths under CC BY 4.0. The Guide keeps the license stated in its own repository.

Status: **recommended, not yet applied.** The site currently states "open framework" without a license file (site audit gap 7). Applying the license is the first item on the roadmap.

## Versioning

- The **specification** follows semantic versioning: MAJOR for breaking changes to fields, states, or digest projections; MINOR for additive changes; PATCH for editorial changes and for updates to Mission Control mappings. The current version is **1.0.0-draft**.
- **Site content that is not the specification** (framework, architecture, patterns, guides, essays) is dated, not versioned. Each page carries `status` and a last-reviewed date; specification pages additionally carry `schemaVersion`.
- **Schemas** are published at `https://fdlc.ai/schemas/v1/<artifact>.schema.json`; a new MAJOR gets a new path segment, and the previous MAJOR remains served.
- **The conformance suite** version equals the specification version it tests.
- **Deprecation** of a field, state, or term is announced one MINOR before removal, with the alias kept in the glossary for that window.

## Changelog

One `CHANGELOG.md` at the specification root, in Keep-a-Changelog form: Added / Changed / Deprecated / Removed / Fixed / Security, plus an FDLC-specific **Invariants** section for any change to a MUST. Every entry links its RFC and decision record; breaking changes are listed first with a migration note.

The current changelog, with the 1.0.0-draft entry that records the changes from the informal v0.1 site content (the Route step, the Define and Qualify stages, the nineteen-artifact model, Decision replacing Approval, the renamed maturity levels, the Factory Version state machine), is available as the [Specification changelog](./specification/CHANGELOG.md) and ships from the same reviewed source as the specification.

## RFC process

| Stage | Who | Output | Time box |
|---|---|---|---|
| Proposal | Anyone | An RFC document: motivation, proposed change (fields, states, invariants, schema diff), alternatives, migration, conformance impact, Mission Control impact | — |
| Discussion | Public | Threaded comments; the author revises | 14 days minimum; 30 for MAJOR |
| Decision record | Owning working group recommends; steering group decides | An ADR-style record: context, decision, consequences, dissent | Within 14 days of discussion close |
| Release | Editors | Schema and page changes, suite changes, changelog entry, tagged release | Batched on the release train |

RFC classes: **Editorial** (no schema change; a working group may merge), **Additive** (MINOR; steering decision), **Breaking** (MAJOR; steering decision plus migration and a dual-read window), **Invariant** (any change to a MUST; steering decision with recorded rationale and at least one implementation's evidence that the invariant is unnecessary or wrong).

Until the steering group is seated, the interim editors (the specification editor and the Mission Control maintainer) decide RFCs and publish every decision record; those records are re-ratified by the steering group at its first meeting. Full detail: [/project/governance](/project/governance).

## Roadmap

Ordered by the landscape audit's assessment of what keeps FDLC a neutral standard. No dates; each item names its exit criterion. Items marked **proposed** have no owner yet.

| Horizon | Item | Exit criterion |
|---|---|---|
| Now | Apply the license recommendation; publish `LICENSE` files and the trademark policy | License files in the specification repository; footer notice on every page |
| Now | Public specification repository, separate from Mission Control; site header links to it | Repository public; RFC template and decision-record template in place; first RFC opened |
| Now | Canonical host consolidation (apex; `www` 308s) and sitemap/structured-data hygiene | Redirect verified in CI; sitemap index with computed `lastmod`; JSON-LD validated at build ([/project/seo](/project/seo)) |
| Now | Conformance suite phase 0–1: schema validation script; cross-record assertion library over an exported artifact set | Nineteen schema/example pairs validate; the five headline checks run against Mission Control's export |
| Next | Seat the technical steering group with at least two seats from non-maintainer organizations; charter the four working groups | Membership published on this page; first decision records ratified |
| Next | Two portability adapters that emit FDLC artifacts from other platforms (candidates: GitHub Agentic Workflows; Claude Code hooks) — **proposed** | Each adapter passes the artifact-shape checks and publishes a per-track self-assessment |
| Next | Mission Control gaps toward FDLC-L3 in Execution: post-run changed-file enforcement; generalized tool authority; SHA-256 composition digest | Ledger statuses move; self-assessment re-run and published |
| Next | Engage AAIF's Workflows & Process Integration and Taxonomy & Landscape working groups; propose the artifact protocol as a workflow taxonomy contribution — **proposed** | A submitted contribution and a recorded response |
| Next | State of the AI Software Factory pilot: instrument published, research partner named, pilot fielded ([/benchmarks](/benchmarks)) — **proposed** | Pilot report published with disclosed participation and no cross-year claims |
| Later | Conformance suite phase 2–4: probe harness; assessor guide; report registry; per-version conformance marks | First self-assessment report from an implementation other than Mission Control |
| Later | Behavioral Qualification Records and the learning-to-Factory-Version pipeline in the reference implementation | Mission Control self-assessment reaches FDLC-L4 in at least one track |
| Later | Sector profiles of the Qualification Standard (regulated, defense, open source, startup) | Published as `fdlc-qualification-standard/<v>+<profile>` without forking the core |

Roadmap items are not availability claims. The reference implementation's own priorities remain in its capability maturity ledger and are summarized on [/mission-control](/mission-control).

## Code of conduct

The project adopts the Contributor Covenant (version 2.1) as its code of conduct for the specification repository, the site repository, working-group meetings, and public discussion. Enforcement contacts are the interim editors until the steering group names a conduct committee. The full text lives at `CODE_OF_CONDUCT.md` in the specification repository once published; Mission Control's repository follows its own `CONTRIBUTING.md` and `SECURITY.md`, and this project defers to them for that codebase.

Status: **recommended; the file is not yet published.**

## Trademark and conformance marks

- "FDLC" and "Factory Development Lifecycle" may be used freely to refer to the specification, to describe compatibility, and in the titles of derivative documentation with attribution.
- **"FDLC-conformant"**, **"FDLC-L2" through "FDLC-L5"**, and any conformance badge may be used only for an implementation with a published self-assessment or suite result at a named specification version and implementation revision, following [/specification/conformance](/specification/conformance).
- Marks are per version. A claim ages out when the specification reaches its next MINOR unless re-assessed, and is revoked if a published report is shown to be false.
- Track badges MUST name the track ("FDLC-L3 Trust"). The overall level is the minimum over tracks.
- No mark implies production certification, fleet scale, zero-touch delivery, or autonomous self-improvement.
- Results not produced under the published benchmark methodology may not be called FDLC benchmarks.
- "Mission Control" names the reference implementation; in external copy write "Mission Control (FDLC reference implementation)" to distinguish it from other products that use the phrase.

## Governance

This page is reviewed on every specification release and on any change to the license, versioning, or mark policy. Changes are RFCs of class Editorial (wording) or Invariant (anything that changes who may decide what).

## How you know it worked

License files exist and are cited; the changelog has no unexplained breaking change; RFCs arrive from organizations other than the maintainer's; conformance marks in the wild trace to published reports; the roadmap's "Now" items have moved to done with their exit criteria met.

## What can go wrong

- **Governance as a page rather than a practice.** Mitigated by the interim-editor rule that every decision is a published record, starting now.
- **Single-vendor capture.** Mitigated by the seat rule and the outside-reviewer rule in the governance proposal.
- **Roadmap read as a promise.** Mitigated by exit criteria and the "proposed" marker.

## Related

- [/project/governance](/project/governance) — the full proposal: steering, working groups, standards alignment, CHANGELOG seed
- [Specification changelog](./specification/CHANGELOG.md)
- [/specification](/specification) · [/specification/conformance](/specification/conformance)
- [/benchmarks](/benchmarks) — the annual program
- [/about](/about) — who maintains it and how to contribute
- [/project/seo](/project/seo) — discovery plan (internal)
