# FDLC canon corpus

This directory is the complete content deliverable from the FDLC.ai audit and authoring pass (September 2026): 159 markdown pages (~380,000 words), 19 validated JSON Schema specifications with examples, 33 validated Mermaid diagrams, and 12 hand-authored SVG hero diagrams. It is content only — no site code was changed (see `/home/claude/work/site-implementation/RUNBOOK.md` for how to ingest it).

Start here:

1. `/home/claude/work/canon/00-FDLC-CANON.md` — the normative canon (names, sequences, layers, artifacts, states, principles) every page in this corpus follows.
2. `/home/claude/work/audit/` — the six-part audit: site audit, Mission Control study, Mission Control Enterprise study, Guide corpus study, industry landscape survey, and this pass's corpus verification report.
3. `/home/claude/work/audit/07-strategic-roadmap.md` (also `corpus/project/roadmap.md`) — the concrete 3-year path to industry-standard status.
4. `corpus/in-5-minutes.md` and `corpus/start.md` — reader entry points.
5. `corpus/glossary.md` — canonical terms.

## Layout

```
corpus/
  glossary.md, in-5-minutes.md, start.md, compare.md, seo.md, mission-control.md,
  benchmarks.md, about.md, project.md
  framework/          7 pages  — lifecycle, principles, maturity, builders, vocabulary
  architecture/        18 pages — reference architecture, routing, versioning, verification,
                                  evidence, authority, context, sandboxing, observability,
                                  economics, learning, security, operations, transformation
  enterprise/           8 pages — reference architecture, identity/tenancy, policy,
                                  execution fleet, model gateway, organization, adoption
  specification/        + v1/ (19 artifact spec pages), schemas/ (19 .schema.json),
                                  examples/ (19), conformance.md, governance.md, CHANGELOG.md
  patterns/             23 pages — 22 patterns + proposed.md (73 catalogued, unwritten)
  anti-patterns/        26 pages — 24 anti-patterns + top-10 + proposed.md
  guides/               11 pages — build guides
  examples/              6 pages — 5 case studies
  tutorials/            16 pages — 15 Mission-Control-mapped tutorials
  diagrams/             mermaid/ (33 .mmd), svg/ (12 hero SVGs + PNG renders), infographics.md,
                                  decision-trees.md
  essays/                4 pages — essays.md (36 titles catalogued) + 3 full essays
  project/               roadmap.md
```

## What is draft vs. what is load-bearing

Every page carries `status: draft` in front matter — this entire corpus is pre-publication review material, per your instruction to review before any site change. Within it, two things are explicitly marked lower-confidence and should not be cited as settled: `patterns/proposed.md` / `anti-patterns/proposed.md` (73 named-but-unauthored concepts, see `06-corpus-verification.md`), and `essays/essays.md` (33 of 36 catalogued titles unwritten).

## Verification

`/home/claude/work/audit/06-corpus-verification.md` documents the mechanical and manual verification pass: front matter, internal links, diagram ids, Mission Control file citations, banned terms, and outstanding id-consistency issues in worked examples. Headline: 19/19 schemas and examples validate, 33/33 diagrams render, all real broken-link and citation defects found were fixed in place.
