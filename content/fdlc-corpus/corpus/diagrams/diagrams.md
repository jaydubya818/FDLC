---
title: Visual canon
description: The FDLC diagram system — colour semantics, arrow grammar, node shapes, typography, accessibility, export rules, and the D01–D33 inventory.
path: /diagrams
audience: [architect, platform, builder, factory-engineer, leader]
level: practitioner
status: draft
related: [/framework, /architecture, /specification, /diagrams/infographics, /diagrams/decision-trees, /glossary]
diagrams: [D01, D02, D03, D04, D05, D06, D07, D08, D09, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D21, D22, D23, D24, D25, D26, D27, D28, D29, D30, D31, D32, D33]
mc_refs: []
---

# Visual canon

## What is it

The visual canon is the diagram system for FDLC.ai. It fixes one meaning per colour, one meaning per arrow style, one shape per artifact family, and one identifier per diagram (D01–D33, canon §16 and §18.7). Every page reuses these rules so that a reader who has learned one diagram can read every other diagram without a new legend.

Two source forms exist for every diagram:

| Form | Where | Purpose |
|---|---|---|
| Mermaid source (`mermaid/Dnn.mmd`) | Embedded in pages as fenced ` ```mermaid ` blocks; the file is the canonical text | Renders inline, diffable, editable by any author |
| Hero SVG (`svg/Dnn.svg`, twelve diagrams) | Page heroes, slides, social cards | Hand-laid, theme-aware, accessible, exportable |

Pages embed the Mermaid block and, where a hero exists, place the SVG first (canon §17.1: lead with the diagram).

## Why it matters

FDLC's argument is structural: authority flows down from a control plane, evidence flows back, and five artifact families move through two loops. If one page draws authority as a dashed line and another draws evidence solid, the structure disappears. A fixed grammar also makes diagrams checkable: a reviewer can reject an arrow that carries evidence *downward* or a human decision drawn without its red outline, because the grammar says those are wrong.

## Colour semantics

One colour per responsibility family. Colour is never the only carrier of meaning: every node also names its family in text or by position.

| Family | Meaning | Light fill · stroke · text | Dark fill · stroke · text | Mermaid class |
|---|---|---|---|---|
| Intent (blue) | Intent, Specification, Plan, Work Order, Objective, Builder-facing artifacts | `#dce8ef` · `#2f5f78` · `#1f4557` | `#1c3140` · `#8ec1dc` · `#cfe6f2` | `intent` |
| Control (slate) | Control plane, routing, orchestration, registries, policy, Execution Profiles, Factory Version identity | `#e4e9ec` · `#4a5d68` · `#2f3f47` | `#2a3438` · `#a8bcc6` · `#dbe5ea` | `control` |
| Execution (amber) | Factory, harness, agent, model, skills, tools, runtime, sandbox, Attempt, Candidate, Context Package | `#f5e6d0` · `#9a4f1c` · `#6b3612` | `#3b2812` · `#e2a468` · `#f5dcc0` | `execution` (`exec` in SVG) |
| Trust (green) | Evidence, Verification, Decision, Release, Outcome, Qualification Record, verifier | `#dcefe4` · `#1a654b` · `#114735` | `#143326` · `#7fd2a6` · `#cdeedb` | `trust` |
| Learning (violet) | Learning Signal, Improvement Candidate, evaluation datasets, L11/L12, Improve stage | `#e9e2f4` · `#5c3f8f` · `#3f2a66` | `#2b2142` · `#bfa5ea` · `#e3d8f5` | `learning` |
| Human authority (red outline) | A human actor or a Decision a human must make: Builder, Approve, Deploy (promotion), acceptance at High/Critical, restoration | stroke `#b3261e`, 3–3.5 px, fill unchanged | stroke `#ff8a80` | `human` (added to the family class) |
| Neutral | Notes, retired/terminal states, comparison boxes | `#faf9f5` · `#59605a` | `#1d2326` · `#a8b0aa` | `neutral` |
| Canvas | Page paper and ink, from `app/design-system.css` | paper `#f3f1ea`, ink `#171a18`, muted `#59605a` | paper `#15191b`, ink `#ecebe4`, muted `#a8b0aa` | — |

The light palette derives from the site tokens (`--blue`, `--status-proposed`, `--amber`, `--status-ready`, `--paper`, `--ink`, `--muted`); the violet is new because the site has no learning colour. Measured contrast (WCAG 2.1): ink on every family fill ≥ 13.9:1, family text on its own fill ≥ 7.9:1, muted text on every fill ≥ 5.1:1, family stroke on paper ≥ 5.3:1; in dark mode every pair ≥ 5.7:1. Red outline on paper: 5.8:1 light, 7.8:1 dark.

Human authority is an *outline*, not a fill, so a node keeps its family colour: an acceptance Decision is Trust green with a red outline; a Builder is neutral with a red outline; the Deploy stage is Trust green (promotion is a Decision) with a red outline.

## Arrow grammar

| Arrow | Style | Direction | Meaning |
|---|---|---|---|
| Authority | solid, slate, 3 px | downward (or control plane → subject) | Delegation, authorization, admission, dispatch. `class au` (SVG), `-->` from a control node (Mermaid) |
| Flow | solid, ink, 2.5 px | left → right or down | Step order in a loop, artifact hand-off. `class fl`, `-->` |
| Evidence | dashed, green, 2.5 px | upward or back toward the control plane / verifier | Evidence, Candidate + Evidence, verification result, outcome. `class ev`, `-.->` |
| Learning | dashed, violet | back toward Qualify / Improve | Learning Signal, Improvement Candidate, new Factory Version. `class ln`, `-.->` |
| Return / loop-back | short dashed, muted | back to an earlier step | Retry, revision, rejection. `class rt` |
| Prohibited | red ✕ on a hairline, or `x-.-x` | between peers | "Never": factories do not orchestrate one another; a Context Package never becomes evidence |

Rules: authority is never dashed; evidence is never solid; an arrow into a red-outlined node is a request for a human decision, the arrow out of it is a Decision. Labels sit on a paper-coloured backing so they stay legible over lines.

## Node shapes per artifact family

| Family (canon §5) | Shape | Notes |
|---|---|---|
| A Intent — Intent, Specification, Plan, Work Order | Rounded rectangle (6 px radius), Intent blue | The Objective is an Intent admitted for planning: same shape, label "Objective" |
| B Factory — Factory Manifest, Factory Version, Execution Profile, Capability Manifest, Qualification Record | Rectangle with a heavier top rule or a manifest card (D11), slate for identity, amber for composed parts, green for the Qualification Record | A Factory Version is always shown with its id `FV-<factory>-<semver>` |
| C Execution — Context Package, Attempt, Candidate, Evidence | Amber rounded rectangles for Attempt, Candidate, Context Package; Evidence is Trust green | Sandboxes and runtimes are dashed amber zones, not nodes |
| D Trust — Verification, Decision, Release, Outcome | Green rounded rectangles; Decision carries the red outline when human; gates use a diamond in Mermaid (`{}`) | Decision kind is always written: `Decision: acceptance` |
| E Learning — Learning Signal, Improvement Candidate | Violet rounded rectangles; human review points are violet with a red outline | Never drawn touching a live/Active node except through Qualify |
| Containers — Control plane, Factory, Ecosystem, planes, levels | Zones: tinted rectangle, 10 px radius, family stroke; nested zones use dashed strokes | Zone titles are bold, family-coloured text at top left |
| State machines (D12, D27, D31, D33) | Mermaid `stateDiagram-v2`; states carry the family class of the actor that owns the transition | Terminal preserved states (Rejected, Retired, Canceled) are neutral |

## Typography

- Family: the site stack — `"Avenir Next", Avenir, "Segoe UI", Helvetica, Arial, sans-serif`; identifiers and tags in `"SFMono-Regular", Consolas, "Liberation Mono", monospace`.
- Hero SVG sizes at the 1600 px base: title 34 px semibold; subtitle 18 px muted; node heading 20 px (18 px in dense grids); body 16 px; small 15 px; minimum 14 px. Nothing below 14 px at base, so the diagram stays legible at 800 px wide (7 px minimum rendered) and at 2× export.
- Tags (`LEVEL 2 · WORK ORDER ROUTING`) are 14 px mono, uppercase, +0.06 em tracking, muted.
- Sentence case everywhere except tags. Identifiers keep canon spelling (`WO-104-01`, `FV-depmod-1.0`, `DEC-104-03`). Two-word "Work Order" in prose labels.
- Mermaid renders with the page font; keep labels short and split with `<br/>`; set `%%{init: {"flowchart": {"wrappingWidth": 520}}}%%` so labels are not wrapped at the 200 px default.

## Accessibility

- Every SVG has `role="img"`, `aria-labelledby`, a `<title>` (the diagram name) and a `<desc>` (a full text equivalent that reads the diagram in order, including every arrow's meaning). The `<desc>` text is also the alt text for exported PNGs.
- No meaning is carried by colour alone: families are named in text, human authority nodes are labelled ("human", "Decision"), arrow classes differ in dash pattern as well as colour, and every hero carries a legend.
- Contrast ≥ 4.5:1 for all text in both themes (measured values above); arrows and strokes ≥ 3:1 against paper.
- Theme-aware: colours are CSS variables on `svg.fd`, redefined under `@media (prefers-color-scheme: dark)`; nothing is hard-coded in element attributes.
- Text is real SVG `<text>`, never outlined paths, so it is selectable, searchable and readable by assistive technology; `<g id>` groups name each element (`step-6`, `factory-router`, `a-evidence`).
- Mermaid blocks in pages are preceded by a sentence that states what the diagram shows, and followed by the table the diagram summarizes where one exists.

## Export rules

| Use | Format | Size | Notes |
|---|---|---|---|
| Docs page hero | SVG inline (preferred) or `<img>` | 1600×900 viewBox, responsive width | Inline keeps theme switching and `<desc>` |
| Docs raster fallback / social preview | PNG at 2× | 3200×1800 | `svg/png/Dnn.png`; `-dark` variant for dark decks |
| Slides (16:9) | SVG or PNG 2× | 1600×900 / 3200×1800 | Title and legend may be cropped when the slide has its own |
| Social card | PNG | 1200×630 (1.91:1) | Crop from the 16:9 master: keep the y-band 90–720 of the 1600 base, trim margins to 1200 wide, or rebuild with the title as the card headline |
| LinkedIn square | PNG | 1080×1080 | Re-flow: stack the hero's two rows; not an automatic crop |
| Print | SVG → PDF | A4 landscape | Force the light palette; minimum 8 pt text at A4 |

Rendering: any headless Chromium (`<img src>` at device scale 2). Never rasterize text into paths. Never export with a transparent background — the paper colour is part of the contrast contract. File names are the diagram id only (`D10.svg`, `D10.png`, `D10-dark.png`).

## Mermaid conventions

- First line: `%% Dnn <title>`; second line: type, hero SVG path, page location. Diagram ids are the only cross-reference between page, source and SVG.
- Types: `flowchart` (flow, architecture, matrix, infographic, decision tree), `sequenceDiagram` (traces, handshakes), `stateDiagram-v2` (lifecycles). Never draw a lifecycle as a flowchart.
- Colour: every flowchart ends with the shared `classDef` block (`intent`, `control`, `execution`, `trust`, `learning`, `human`, `neutral`) and `class` lines; state diagrams carry their own `classDef`; sequence diagrams group participants in `box` colours (control, execution, trust).
- Authority solid `-->`; evidence and learning dashed `-.->`; prohibitions `x-.-x`; invisible layout links `~~~`.
- Validated: all 33 sources render with mermaid-cli 11.14 (`mmdc -i Dnn.mmd -o out.svg`).

## Inventory

| Id | Title | Type | Page location | Mermaid source | SVG status |
|---|---|---|---|---|---|
| D01 | What is an Autonomous Software Factory | architecture | `/`, `/in-5-minutes`, `/framework` | `mermaid/D01.mmd` | `svg/D01.svg` — done |
| D02 | Delivery Loop | flow | `/framework/delivery-loop` (projection on `/architecture/design-decisions`) | `mermaid/D02.mmd` | `svg/D02.svg` — done |
| D03 | Factory Lifecycle | flow | `/framework/factory-lifecycle` | `mermaid/D03.mmd` | `svg/D03.svg` — done |
| D04 | Two loops relationship | flow | `/framework`, `/framework/factory-lifecycle`, `/in-5-minutes` | `mermaid/D04.mmd` | `svg/D04.svg` — done |
| D05 | Composition hierarchy (Model → FDLC) | architecture | `/framework`, `/architecture/execution-vocabulary`, `/architecture/agents-skills-tools-harnesses`, `/in-5-minutes` | `mermaid/D05.mmd` | `svg/D05.svg` — done |
| D06 | Reference architecture (12 layers, 4 planes) | architecture | `/architecture`, `/in-5-minutes`, `/patterns` (placement view) | `mermaid/D06.mmd` | `svg/D06.svg` — done |
| D07 | Areas × layers matrix | matrix | `/architecture` | `mermaid/D07.mmd` (+ table below) | not a hero; table is canonical |
| D08 | Control boundary (authority down / evidence back) | architecture | `/architecture`, `/framework/principles`, `/anti-patterns/top-10` | `mermaid/D08.mmd` | `svg/D08.svg` — done |
| D09 | Multi-factory orchestration (SSO example) | architecture | `/architecture/multi-factory`, `/patterns/multi-factory-orchestration` | `mermaid/D09.mmd` | `svg/D09.svg` — done |
| D10 | Three-level routing | flow | `/architecture/routing`, `/enterprise`, `/patterns/capability-based-routing`, `/patterns/model-routing` | `mermaid/D10.mmd` | `svg/D10.svg` — done |
| D11 | Factory Version composition | architecture | `/architecture/factory-versioning` | `mermaid/D11.mmd` | `svg/D11.svg` — done |
| D12 | Factory Version state machine | state | `/architecture/factory-versioning`, `/framework/factory-lifecycle`, `/specification/v1/factory-version`, `/patterns/immutable-factory-version`, `/patterns/degraded-mode` | `mermaid/D12.mmd` | Mermaid only |
| D13 | Qualification | flow | `/architecture/qualification`, `/specification/v1/qualification-record`, `/patterns/fail-closed-qualification` | `mermaid/D13.mmd` | Mermaid only |
| D14 | Evidence architecture (Claim → Authority) | architecture | `/architecture/evidence`, `/in-5-minutes`, `/patterns/evidence-bound-acceptance`, `/patterns/candidate-currentness` | `mermaid/D14.mmd` | `svg/D14.svg` — done |
| D15 | Verification hierarchy | architecture | `/architecture/verification`, `/patterns/independent-verifier`, `/patterns/verification-contract` | `mermaid/D15.mmd` | Mermaid only |
| D16 | Authority model | architecture | `/architecture/authority`, `/architecture/security`, `/enterprise/identity-tenancy`, `/enterprise/reference-architecture`, `/patterns/decision-record`, `/patterns/human-authority-gate`, `/patterns/publication-permit` | `mermaid/D16.mmd` | Mermaid only |
| D17 | HITL / risk-tier matrix | matrix | `/architecture/authority`, `/enterprise/policy-governance`, `/patterns/progressive-autonomy` | `mermaid/D17.mmd` | Mermaid only |
| D18 | Builder experience | flow | `/architecture/builders`, `/architecture/transformation` | `mermaid/D18.mmd` | Mermaid only |
| D19 | Agent vs Skill vs Tool vs Harness vs Factory | architecture | `/architecture/agents-skills-tools-harnesses`, `/architecture/execution-vocabulary`, `/patterns/bounded-agent` | `mermaid/D19.mmd` | `svg/D19.svg` — done |
| D20 | Local factory vs ecosystem | architecture | `/architecture`, `/enterprise` | `mermaid/D20.mmd` | Mermaid only |
| D21 | Governed learning loop | flow | `/architecture/learning`, `/patterns/governed-learning`, `/specification/v1/learning-signal` | `mermaid/D21.mmd` | Mermaid only |
| D22 | Economics (cost denominators) | infographic | `/architecture/economics` | `mermaid/D22.mmd` | Mermaid only (see `/diagrams/infographics` #17) |
| D23 | Observability trace | sequence | `/architecture/observability`, `/enterprise/reference-architecture`, `/patterns/tool-grant-and-receipt` | `mermaid/D23.mmd` | Mermaid only |
| D24 | Maturity model | infographic | `/framework/maturity`, `/enterprise/adoption` | `mermaid/D24.mmd` | Mermaid only (see `/diagrams/infographics` #19) |
| D25 | Sandbox architecture | architecture | `/architecture/sandboxing`, `/enterprise/execution-fleet`, `/enterprise/reference-architecture`, `/patterns/sandbox-per-work-order` | `mermaid/D25.mmd` | Mermaid only |
| D26 | Context / RAG architecture | architecture | `/architecture/context`, `/patterns/context-package` | `mermaid/D26.mmd` | Mermaid only |
| D27 | Work Order lifecycle | state | `/specification/v1/work-order` | `mermaid/D27.mmd` | Mermaid only |
| D28 | Objective dependency graph | flow | `/architecture/multi-factory`, `/enterprise/reference-architecture`, `/patterns/objective-decomposition` | `mermaid/D28.mmd` | Mermaid only |
| D29 | Production promotion pipeline | flow | `/architecture/factory-versioning` | `mermaid/D29.mmd` | Mermaid only |
| D30 | Enterprise reference architecture | architecture | `/enterprise/reference-architecture`, `/enterprise` | `mermaid/D30.mmd` | Mermaid only (hero candidate for a later wave) |
| D31 | Attempt / lease state machine | state | `/specification/v1/attempt`, `/enterprise/execution-fleet`, `/enterprise/operations`, `/patterns/lease-based-worker`, `/patterns/recovery-checkpoint` | `mermaid/D31.mmd` | Mermaid only |
| D32 | Non-collapsible state boundary | infographic | `/framework/delivery-loop`, `/framework`, `/architecture/verification`, `/anti-patterns`, `/in-5-minutes` | `mermaid/D32.mmd` | Mermaid only (strip also embedded in `svg/D02.svg`) |
| D33 | Incident Command lifecycle | state | `/enterprise/operations` (canon §18.7) | `mermaid/D33.mmd` | Mermaid only |

Twelve heroes exist (D01, D02, D03, D04, D05, D06, D08, D09, D10, D11, D14, D19), matching canon §16's "12 hero diagrams". The remaining 21 render from Mermaid.

## D07 — Areas × layers matrix (table form)

`mermaid/D07.mmd` groups each area's owned layers as a column; the table is the canonical cell set (from `/architecture`). ● = the area owns the layer's primary decisions. ○ = the area contributes a component or constraint.

| Area \ Layer | L1 Exp | L2 Intent | L3 Control | L4 Route/Orch | L5 Agent/Harness | L6 Context | L7 Env | L8 Verify | L9 Evidence | L10 Authority/Release | L11 Obs/Econ | L12 Learn |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Intent | ● | ● | ○ | ○ | | ○ | | ○ | | | | ○ |
| 2 Execution | | | ○ | ● | ● | ○ | ● | | ○ | | ○ | |
| 3 Capability | | | ○ | ○ | ● | ● | | ○ | | | | ○ |
| 4 Model | | | ○ | ○ | ● | | | ○ | | | ○ | ○ |
| 5 Trust | ○ | ○ | ● | ○ | | ○ | ○ | ● | ● | ● | ○ | ○ |
| 6 Learning | | ○ | | ○ | ○ | | | ○ | ○ | ○ | ● | ● |
| Govern · Secure · Observe · Measure | ○ | ○ | ● | ○ | ○ | ● | ● | ○ | ● | ○ | ● | ○ |

## How you know it worked

- A new page can be reviewed against this page alone: every node colour, arrow style and outline is either right or wrong.
- The `<desc>` of any hero reads as a complete paragraph without the picture.
- All 33 Mermaid sources render with mermaid-cli; all twelve SVGs are ≤ 40 KB, self-contained, and pass the contrast table above in both themes.

## What can go wrong

- **Colour drift** — a page invents a sixth family colour. Use `neutral` and text instead.
- **Direction drift** — evidence drawn downward or authority drawn dashed. The grammar is directional.
- **Human outline omitted** — an acceptance Decision drawn as plain green implies policy acceptance at every tier. Canon §11 requires human acceptance at High and Critical.
- **State machines as flowcharts** — loses terminal and preserved states; use `stateDiagram-v2`.
- **Mermaid label wrapping** — long labels wrap at 200 px unless the `wrappingWidth` directive is present.

## Related

- [/framework](/framework) · [/framework/delivery-loop](/framework/delivery-loop) · [/framework/factory-lifecycle](/framework/factory-lifecycle)
- [/architecture](/architecture) · [/architecture/execution-vocabulary](/architecture/execution-vocabulary) · [/architecture/evidence](/architecture/evidence)
- [/diagrams/infographics](/diagrams/infographics) · [/diagrams/decision-trees](/diagrams/decision-trees)
- [/specification](/specification) · [/glossary](/glossary)
