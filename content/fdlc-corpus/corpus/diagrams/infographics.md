---
title: Infographic briefs
description: Twenty-five infographic opportunities for FDLC — purpose, page, composition, copy, dimensions, image-generation prompt, and alt text — mapped to canon diagram ids.
path: /diagrams/infographics
audience: [leader, architect, platform, builder, executive, factory-engineer]
level: practitioner
status: draft
related: [/diagrams, /diagrams/decision-trees, /framework, /architecture, /enterprise, /start]
diagrams: [D01, D02, D03, D04, D05, D06, D08, D09, D10, D11, D12, D13, D14, D15, D16, D17, D18, D19, D20, D21, D22, D24, D29, D32]
mc_refs: []
---

# Infographic briefs

## What is it

Twenty-five briefs, one per infographic opportunity in the FDLC corpus. Each brief is enough for a designer, an image model, or an author with the hero SVG kit to produce the piece without re-reading the source page. Every brief maps to a canon diagram id (`/diagrams`), so the infographic and the page diagram never disagree.

## Shared production spec

| Use | Size | Aspect | Adaptation rule |
|---|---|---|---|
| Docs hero | 1600×900 (export 3200×1800) | 16:9 | The master. Title, subtitle, legend included. |
| Conference slide | 1920×1080 | 16:9 | Same master; drop the subtitle if the slide has a title bar; keep the legend. |
| LinkedIn landscape | 1200×627 | 1.91:1 | Crop the master's centre band (y 90–720 at 1600 base); headline becomes the post's first line. |
| LinkedIn square | 1080×1080 | 1:1 | Re-flow: stack rows vertically; one idea per card; headline at top, one-sentence takeaway at bottom. |
| Print | A4 landscape, 300 dpi (3508×2480) | 1.41:1 | Light palette only; add 12 mm margins; minimum 8 pt text; include the diagram id and the page URL in the footer. |
| Training handout | A4 portrait | 1:1.41 | Split into two stacked panels: the diagram and a "how to read it" box. |

**Style (all prompts share this base):** clean technical editorial; flat vector; muted palette on cream paper `#f3f1ea` — Intent blue `#2f5f78`/`#dce8ef`, Control slate `#4a5d68`/`#e4e9ec`, Execution amber `#9a4f1c`/`#f5e6d0`, Trust green `#1a654b`/`#dcefe4`, Learning violet `#5c3f8f`/`#e9e2f4`, red outline `#b3261e` only for human authority; rounded rectangles with 2 px strokes; solid arrows for authority and flow, dashed arrows for evidence; system sans-serif labels; no photorealism, no people or faces, no vendor logos, no 3D, no gradients, no icons that imply a product. Below, each prompt states only what is specific to the piece; prepend this base.

## Index by learning path

| Path (`/start`) | Briefs |
|---|---|
| Executive | 1, 2, 5, 22, 23, 24 |
| Engineering leader | 1, 3, 4, 17, 18, 22, 23, 25 |
| Architect | 6, 7, 8, 9, 10, 11, 14, 15, 16, 20 |
| Platform engineer | 9, 10, 11, 12, 13, 20, 25 |
| Builder | 2, 3, 18, 19, 24 |
| Security | 8, 13, 14, 16, 17 |
| Factory engineer | 4, 11, 12, 13, 21, 25 |

## Index by audience

| Audience | Briefs |
|---|---|
| Enterprise architecture presentations | 6, 7, 8, 9, 10, 11, 20 |
| Technical documentation | all; heroes 1, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 19 exist as SVG |
| LinkedIn | 1, 2, 5, 14, 19, 22, 24 |
| Conference talks | 1, 2, 3, 8, 14, 16, 19, 24 |
| CTO discussions | 1, 2, 22, 23, 24, 25 |
| Training | 3, 4, 5, 12, 13, 15, 17, 18, 21 |

---

## 1 · What is an Autonomous Software Factory? — D01

**Purpose.** Establish the category in one glance: intent goes in, a verified outcome comes out, and a control plane — not the model — holds authority.
**Page.** `/`, `/in-5-minutes` §2, `/framework`. Hero SVG: `svg/D01.svg`.
**Visual structure.** Left: Builder (red outline) above an Intent card. Centre: a wide amber factory container with four step tiles Plan · Route · Execute · Verify, and a slate control-plane band above it joined by a solid down-arrow ("authority") and a dashed up-arrow ("evidence"). Right: Evidence → Decision (red outline) → Verified outcome stacked vertically. A violet dashed loop runs under the factory from Outcome back to the factory: Learn. Footer tagline.
**Copy.** Headline: *What is an Autonomous Software Factory?* Subhead: *A governed production system that converts intent into independently verified software outcomes.* Labels: Builder · Intent · Control Plane · Plan · Route · Execute · Verify · Evidence · Decision (human or policy) · Verified outcome · Learn. Tagline: *Coding Agent ≠ AI Software Factory. The model proposes. The system decides what becomes real.*
**Dimensions.** All six uses; the square card keeps only Intent → Factory → Verified outcome with the control plane above.
**Prompt.** "Infographic on cream paper, 16:9. A large amber-outlined container labelled 'AI Software Factory' holds four rounded tiles in a row: Plan (blue), Route (slate), Execute (amber), Verify (green), connected by solid arrows. Above the container a wide slate band labelled 'Control Plane — identity · authority · policy · budgets · state'. One solid slate arrow points down from the band into the container labelled 'authority flows down'; one dashed green arrow points up labelled 'evidence flows back'. Left of the container: a small red-outlined tile 'Builder (human)' above a blue tile 'Intent'. Right of the container: three green tiles stacked — 'Evidence', 'Decision — human or policy' with a red outline, 'Verified outcome' — connected by solid arrows downward. A violet dashed arrow loops from 'Verified outcome' under the container back into it, labelled 'Learn → next Factory Version'. Bottom-left caption: 'Coding Agent ≠ AI Software Factory.' Legend chips for the five colours and the two arrow styles."
**Alt text.** A Builder states an Intent that enters an AI Software Factory. Inside the factory the work is planned, routed, executed and independently verified. Above the factory a control plane holds authority and sends it down as a solid arrow; evidence returns as a dashed arrow. The factory's output is Evidence, which a human or policy Decision turns into a verified outcome. A dashed learning loop carries the outcome back to the factory as a new Factory Version. Caption: a coding agent is not a software factory.

## 2 · Coding Agent ≠ AI Software Factory — D01 (comparison), D05

**Purpose.** Draw the category line the market blurs: assistant, agent, agent platform, factory.
**Page.** `/in-5-minutes` §3, `/compare`, `/framework` §1.2.
**Visual structure.** Four columns rising left to right like steps: Coding assistant · Coding agent · Agent platform · AI Software Factory. Each column has four rows: Unit · Authority and acceptance · Outcome boundary · What it cannot do. The factory column is the only one with a slate control-plane cap and a green verification band. A thin red line separates the first three ("reasons and acts") from the fourth ("governs").
**Copy.** Headline: *Coding Agent ≠ AI Software Factory.* Subhead: *SDLC governs the lifecycle of software. FDLC governs the lifecycle of the factory that builds it.* Column labels as above; row labels: Unit — Prompt or edit · Delegated task · Agent and run · Governed outcome; Authority — stays with the user · task-level permissions · governs agents, not the lifecycle · explicit authority, evidence, audit, human accountability; Outcome — suggested code · proposed change · reliable execution · verified outcome.
**Dimensions.** 16:9 master; square card shows only two columns (agent vs factory).
**Prompt.** "Four ascending columns on cream paper, each a rounded card: 'Coding assistant', 'Coding agent', 'Agent platform' in amber, 'AI Software Factory' in slate with a green band labelled 'independent verification' and a small red-outlined tile 'human authority'. A table grid inside each card with four rows: Unit, Authority, Outcome, Cannot. A vertical red hairline between the third and fourth columns with the caption 'reasons and acts | governs'. Headline top-left: 'Coding Agent ≠ AI Software Factory'."
**Alt text.** A four-column comparison rising from coding assistant to coding agent to agent platform to AI Software Factory. Only the factory column has a control plane, independent verification, and human authority; its unit is a governed outcome and its result is a verified outcome, whereas the others produce suggested code, a proposed change, or reliable execution without lifecycle authority.

## 3 · The Delivery Loop — D02

**Purpose.** Teach the ten steps, their questions and artifacts, and the fact that Verify does not accept.
**Page.** `/framework/delivery-loop`. Hero SVG: `svg/D02.svg`.
**Visual structure.** Two rows of five numbered tiles (1–5 blue/slate/amber, 6–10 green/violet); Approve carries the red outline. A return connector links 5 to 6. Loop-back tags under Verify ("fail / stale → 5") and Approve ("reject / revise → 3"). Below: the non-collapsible strip Execution complete ≠ Verified ≠ Approved ≠ Released ≠ Outcome proven. Right: a violet tile "Factory Lifecycle · 8 Improve" fed by Learn.
**Copy.** Headline: *The Delivery Loop.* Subhead: *How one unit of intent becomes a verified outcome — verbs are steps, nouns are artifacts.* Tiles: 1 Receive → Intent · 2 Specify → Specification · 3 Plan → Plan · Work Orders · 4 Route → Routing Decision · 5 Execute → Attempt · Candidate · Evidence · 6 Verify → Verification · 7 Approve → Decision (acceptance) · 8 Release → Release · 9 Observe → Outcome · 10 Learn → Learning Signal · Improvement Candidate.
**Dimensions.** All uses; the square card is one row of ten small chips plus the ≠ strip.
**Prompt.** "Ten numbered rounded tiles in two rows of five, connected by solid arrows with a return connector from tile 5 to tile 6. Tiles 1–3 blue ('Receive', 'Specify', 'Plan'), 4 slate ('Route'), 5 amber ('Execute'), 6–9 green ('Verify', 'Approve' with a thick red outline, 'Release', 'Observe'), 10 violet ('Learn'). Each tile shows a number, a verb, an italic question, and an artifact name after an arrow. Under the second row a strip of five chips joined by '≠' signs: Execution complete, Verified, Approved, Released, Outcome proven. A violet dashed arrow from 'Learn' to a violet tile 'Factory Lifecycle · Improve'."
**Alt text.** The ten-step Delivery Loop laid out in two rows: Receive, Specify, Plan, Route, Execute, then Verify, Approve, Release, Observe, Learn. Each step names its question and the artifact it produces. Verify can send work back to Execute; Approve can send it back to Plan. A strip states that execution complete, verified, approved, released and outcome proven are distinct states. Learn feeds the Factory Lifecycle's Improve stage.

## 4 · The Factory Lifecycle — D03

**Purpose.** Teach the eight stages and the rule that improvement never mutates an Active version.
**Page.** `/framework/factory-lifecycle`. Hero SVG: `svg/D03.svg`.
**Visual structure.** Two rows of four stage tiles (Discover, Define, Design blue; Assemble amber; Qualify green; Deploy green with red outline; Operate amber; Improve violet), each with purpose, output artifact and exit criterion. A violet dashed loop from Improve back to Qualify. Below: a chip strip of Factory Version states aligned to stages: Draft · Candidate · Qualified · Active · Restricted/Suspended · Deprecated · Retired.
**Copy.** Headline: *The Factory Lifecycle.* Subhead: *How a factory comes to exist, earns trust, and changes — never by mutating an Active version.* Stage labels and outputs as in canon §3.2.
**Dimensions.** All uses; square card: the eight stages as a ring with the Improve → Qualify chord.
**Prompt.** "Eight rounded stage tiles in two rows of four, numbered 1–8: Discover, Define, Design (blue), Assemble (amber), Qualify (green), Deploy (green, thick red outline), Operate (amber), Improve (violet). Solid arrows connect them in order with a return connector from tile 4 to tile 5. A violet dashed arrow from Improve loops under the second row back to Qualify, labelled 'candidate Factory Version'. Beneath, a horizontal chip strip 'Draft → Candidate → Qualified → Active → Restricted · Suspended → Deprecated → Retired' with small stage numbers under each chip."
**Alt text.** The eight-stage Factory Lifecycle: Discover, Define, Design, Assemble, Qualify, Deploy, Operate, Improve, each with its output artifact. Qualify can reject back to Assemble; Operate can suspend or restrict back to Deploy; Improve produces a candidate Factory Version that re-enters Qualify. A strip shows the Factory Version states produced along the way.

## 5 · Two loops, one factory — D04

**Purpose.** Show that the Delivery Loop runs *inside* the Operate stage and that learning flows out of it into Improve.
**Page.** `/framework` §3.3, `/framework/factory-lifecycle`, `/in-5-minutes` §6. Hero SVG: `svg/D04.svg`.
**Visual structure.** Outer row of eight stage tiles at the top, inner row of ten step tiles at the bottom, a translucent amber wedge from Operate fanning down over the inner row, a violet dashed arrow from Learn up the right edge to Improve, and a violet dashed arrow along the top from Improve to Qualify.
**Copy.** Headline: *Two loops, one factory.* Subhead: *The Delivery Loop is the production line running; the Factory Lifecycle is how you build, certify, commission, and retool the line.* Callout: *The Delivery Loop runs only inside an Active Factory Version.* Footer: *Deploy promotes a Factory Version. Release promotes a software artifact. Neither creates its own authority.*
**Dimensions.** 16:9 and slide; for square, stack the two rows and shorten the wedge to a bracket.
**Prompt.** "Top row: eight small tiles 'Discover' to 'Improve' in canon colours. Bottom row: ten small tiles 'Receive' to 'Learn'. A translucent amber trapezoid descends from the top-row tile 'Operate' to span the full bottom row, with centred text 'The Delivery Loop runs only inside an Active Factory Version'. A violet dashed arrow rises along the right edge from 'Learn' to 'Improve' labelled 'Learning Signals'; another violet dashed arrow runs over the top row from 'Improve' back to 'Qualify' labelled 'new Factory Version'."
**Alt text.** Two rows of tiles: the eight-stage Factory Lifecycle above and the ten-step Delivery Loop below. A wedge from the Operate stage covers the inner loop to show that the Delivery Loop runs inside an Active Factory Version. Learning Signals rise from Learn to Improve, and a new Factory Version flows from Improve back to Qualify.

## 6 · The composition hierarchy — D05

**Purpose.** Fix the seven nested levels and which level governs which.
**Page.** `/framework` §2, `/architecture/execution-vocabulary`, `/architecture/agents-skills-tools-harnesses`. Hero SVG: `svg/D05.svg`.
**Visual structure.** Seven stepped bands narrowing downward: FDLC (neutral), Factory Ecosystem and Control Plane (slate), Factory, Harness, Agent, Model (amber), each with a one-line definition; small labels between bands: governs · governs · governs · bounds · bounds · uses. A solid down-arrow "authority flows down" and a dashed up-arrow "evidence flows back" beside the stack. Right panel: cross-cutting roles (Tool, Skill, Agent Loop, Work Graph, Orchestrator, Runtime, Sandbox, Capability, Factory Platform).
**Copy.** Headline: *The composition hierarchy.* Subhead: *Each level is a distinct identity with its own lifecycle, version, qualification, and failure question.* Bands: FDLC · Factory Ecosystem · Control Plane · Factory · Harness · Agent · Model.
**Dimensions.** All uses; the square card shows the seven bands only.
**Prompt.** "An inverted stepped pyramid of seven wide horizontal bands, each narrower than the one above: 'FDLC' (cream, dark outline), 'Factory Ecosystem' and 'Control Plane' (slate), 'Factory', 'Harness', 'Agent', 'Model' (amber). Each band has a bold name and a one-line grey definition. Small arrows between bands labelled 'governs' or 'bounds'. To the right of the pyramid a solid vertical arrow pointing down labelled 'authority flows down' and a dashed green arrow pointing up labelled 'evidence flows back'. A right-hand panel lists nine terms with one-line definitions."
**Alt text.** Seven nested levels from FDLC at the top through Factory Ecosystem, Control Plane, Factory, Harness, Agent, to Model at the bottom, each narrower than the one above. Upper levels govern lower ones; authority flows down, evidence flows back. A side panel defines the cross-cutting roles Tool, Skill, Agent Loop, Work Graph, Orchestrator, Runtime, Sandbox, Capability, and Factory Platform.

## 7 · Reference architecture: twelve layers, four planes — D06

**Purpose.** The single structural picture architects will pin up: where every function lives and who owns it.
**Page.** `/architecture`. Hero SVG: `svg/D06.svg`.
**Visual structure.** Four stacked plane panels (Intent, Control, Execution, Trust) containing ten labelled layer rows with their component lists; a violet cross-cutting column on the right holding L11 Observability & Economics and L12 Learning; a solid authority arrow down the left and a dashed evidence arrow up the right.
**Copy.** Headline: *Reference architecture — twelve layers in four planes.* Subhead: *Authority flows down from the control plane; evidence flows back.* Layer names L1–L12 as in canon §4.1.
**Dimensions.** 16:9, slide, print (this is the print poster candidate). Square card: planes only, without component lists.
**Prompt.** "A tall stack of four rounded plane panels labelled 'Plane I — Intent' (blue), 'Plane II — Control' (slate), 'Plane III — Execution' (amber), 'Plane IV — Trust' (green). Inside each panel, horizontal layer rows with a bold label on the left ('L1 Experience', 'L2 Intent & Planning', … 'L10 Authority & Release') and a grey list of components on the right. A narrow violet column to the right holds two tall boxes 'L11 Observability & Economics' and 'L12 Learning'. A solid arrow runs down the far left labelled 'authority flows down'; a dashed green arrow runs up between the stack and the violet column labelled 'evidence flows back'."
**Alt text.** Four stacked planes. Plane I Intent holds L1 Experience and L2 Intent & Planning. Plane II Control holds L3 Control Plane and L4 Routing & Orchestration. Plane III Execution holds L5 Agent & Harness, L6 Context & Knowledge, and L7 Execution Environment. Plane IV Trust holds L8 Verification, L9 Evidence & Provenance, and L10 Authority & Release. Beside the stack, L11 Observability & Economics and L12 Learning cut across all planes. Authority flows down the stack; evidence flows back up.

## 8 · The control boundary — D08

**Purpose.** Make the thesis "allow intelligence to vary, always bound authority" visible: what changes, what persists.
**Page.** `/architecture` (control boundary), `/framework/principles`, `/anti-patterns/top-10`. Hero SVG: `svg/D08.svg`.
**Visual structure.** A slate control-plane band across the top fed by a red-outlined Human authority tile; two amber panels below — Intelligence supply (left) and Governed execution (right) — each receiving a solid authority arrow and returning a dashed evidence arrow; a green Independent verification tile at the bottom centre receiving Candidate + Evidence and returning a verification result; two neutral panels at the foot: Expected to change vs Required to persist.
**Copy.** Headline: *The control boundary.* Subhead: *Allow intelligence to vary. Always bound authority.* Panels: 01 Intelligence supply — models reason, agents act — replaceable by design · 02 Factory control plane — the factory governs — durable system of record · 03 Governed execution — operation stays bounded — constrained and recoverable. Foot: Expected to change: models · agents · skills · prompts · tool adapters. Required to persist: intent · identity · authority · state · evidence · decisions · outcomes.
**Dimensions.** All uses; the square card is the two-column foot panel alone with the headline.
**Prompt.** "A wide slate band at the top labelled '02 / Factory control plane — the factory governs', with a small red-outlined tile 'Human authority' to its left connected by a solid arrow labelled 'Decision'. Two large amber panels below: '01 / Intelligence supply — models reason, agents act' on the left and '03 / Governed execution — operation stays bounded' on the right. From the band, solid slate arrows point down into each panel labelled 'authority'; dashed green arrows point up from each panel labelled 'evidence'. A green tile 'Independent verification' sits centred below the panels, receiving a dashed green arrow from the right panel labelled 'Candidate + Evidence' and sending a dashed arrow up to the band labelled 'verification result'. Two neutral boxes at the foot: 'Expected to change' and 'Required to persist'."
**Alt text.** A human authority feeds decisions to the factory control plane, the durable system of record. The control plane sends authority down to intelligence supply — models and agents that are replaceable by design — and to governed execution, where a harness, runtime and sandbox keep operation bounded. Evidence returns upward. Governed execution hands candidates and evidence to independent verification, whose result goes back to the control plane. Models, agents, skills, prompts and tool adapters are expected to change; intent, identity, authority, state, evidence, decisions and outcomes must persist.

## 9 · Multi-factory orchestration — D09

**Purpose.** Show one enterprise objective decomposed across specialized factories with the control plane, not the factories, coordinating.
**Page.** `/architecture/multi-factory`, `/patterns/multi-factory-orchestration`. Hero SVG: `svg/D09.svg`.
**Visual structure.** Builder and Objective INT-100 on the left; a slate control-plane band with Objective Planner, Plan PLAN-100-r1, Factory Router, Factory Registry; three Work Order tiles fanned from the router; two amber factory panels (Code Generation FV-codegen-2.3; Security Remediation FV-secrem-1.4) with a red ✕ between them; a green right column Join → Integration V&V → Decision (red outline) → Release; a dashed outcome path back to the Objective.
**Copy.** Headline: *Multi-factory orchestration — SSO example.* Subhead: *The control plane orchestrates the objective. Factories execute bounded work. Factories do not orchestrate one another.* Labels: WO-101 Backend · WO-102 Frontend · WO-103 Security · Join: integrated Candidate · Integration V&V · Decision: acceptance (human, High tier) · Release REL-100 · Outcome OUT-100.
**Dimensions.** 16:9, slide, print; square card: Objective → three Work Orders → two factories → one Decision.
**Prompt.** "Top-left a red-outlined tile 'Builder' above a blue tile 'Objective INT-100 — Add SSO to the customer portal'. A wide slate panel across the top labelled 'Enterprise Control Plane' contains four tiles in a row: 'Objective Planner', 'Plan PLAN-100-r1' (blue), 'Factory Router', 'Factory Registry'. Three blue tiles in a row below: 'WO-101 Backend', 'WO-102 Frontend', 'WO-103 Security', each receiving a solid arrow from the Factory Router. Below them two amber panels: a wide 'Code Generation Factory FV-codegen-2.3' under the first two Work Orders and a narrower 'Security Remediation Factory FV-secrem-1.4' under the third, with a red ✕ mark in the gap between the panels. On the right a green column of four tiles connected by solid arrows: 'Join: integrated Candidate', 'Integration V&V', 'Decision: acceptance — human, High tier' with a thick red outline, 'Release REL-100'. Dashed green arrows carry 'Candidates + Evidence' from both factories into the Join. A dashed green arrow runs from Release along the bottom back up to the Objective, labelled 'Outcome'."
**Alt text.** A Builder's Objective to add SSO enters the enterprise control plane, where the Objective Planner produces a Plan with three Work Orders and the Factory Router binds each to a qualified Factory Version: backend and frontend to the Code Generation Factory, security to the Security Remediation Factory. The factories never coordinate directly. Their candidates and evidence join into an integrated candidate, pass Integration V&V, receive a human acceptance Decision at the High tier, and are released; the outcome flows back to the Objective.

## 10 · Three-level routing — D10

**Purpose.** Separate objective, Work Order and Task routing, and show eligibility before ranking.
**Page.** `/architecture/routing`, `/enterprise`, `/patterns/capability-based-routing`. Hero SVG: `svg/D10.svg`.
**Visual structure.** Three horizontal bands. Level 1: Objective → Objective Planner → factory set → Work Orders. Level 2: Work Order → Eligibility filter → Rank by evidence → qualified Factory Version + Execution Profile, with a red-outlined "empty set → Blocked" tile and a neutral "Scheduling is separate" tile beneath. Level 3: Task → Capability Router → model route · skill · tool · runtime · sandbox · provider → Attempt. Vertical arrows on the left link the bands.
**Copy.** Headline: *Three-level routing.* Subhead: *Routing decides who may; scheduling decides when. Eligibility is filtered before anything is ranked.* Foot: invariants list.
**Dimensions.** All uses; square card: the three levels as three stacked chips with input → output.
**Prompt.** "Three stacked rounded bands: the top two slate, the bottom amber, each with a small uppercase tag at top-right: 'LEVEL 1 · OBJECTIVE ROUTING', 'LEVEL 2 · WORK ORDER ROUTING', 'LEVEL 3 · TASK ROUTING'. In each band a left-to-right chain of tiles connected by solid arrows: band 1 'Objective' (blue) → 'Objective Planner' → 'required capabilities → factory set' → 'Work Orders' (blue); band 2 'Work Order' (blue) → '1 · Eligibility filter' → '2 · Rank by evidence' → 'Qualified Factory Version + Execution Profile' (amber), with a red-outlined green tile 'empty set → Blocked / escalate' under the filter and a neutral tile 'Scheduling is a separate decision' under the ranking; band 3 'Task' (blue) → 'Capability Router' → 'model route · skill · tool · runtime · sandbox · provider' (amber) → 'Attempt' (amber). Solid slate arrows connect the bands vertically on the left, labelled 'Work Orders' and 'Tasks'."
**Alt text.** Three routing levels. Level 1: the Objective Planner turns an Objective into required capabilities, a factory set and Work Orders. Level 2: the Factory Router filters eligible Factory Versions by policy, authorization, compatibility, qualification and authority before ranking them by evidence, yielding a qualified Factory Version and Execution Profile; an empty eligible set blocks rather than relaxing a gate, and scheduling is a separate decision. Level 3: the Capability Router binds a Task to a model route, skill, tool, runtime, sandbox and provider inside the admitted set, producing an Attempt with a frozen routing snapshot.

## 11 · Factory Version composition — D11

**Purpose.** Show what an immutable Factory Version pins, and why a mutable factory cannot be governed.
**Page.** `/architecture/factory-versioning`, `/specification/v1/factory-version`. Hero SVG: `svg/D11.svg`.
**Visual structure.** A slate manifest header card (FV-depmod-1.0, digest rule) above a 4×4 grid of fourteen component tiles coloured by family, plus one wide neutral note tile. Right column: "Why mutable configuration cannot be governed" list and a vertical Draft → Candidate → Qualified → Active chip strip.
**Copy.** Headline: *Factory Version composition.* Subhead: *Production routes work to a qualified immutable Factory Version, never to a mutable factory.* Tiles: Planner version · Agent Definitions · Harness versions · Skills · Tools · Model routes · Context configuration · Runtime + Sandbox · Isolation policy · Verification contract · Approval policy · Execution Profiles · Economics · Qualification evidence.
**Dimensions.** All uses; square card: header card plus a 2×7 tile grid.
**Prompt.** "A wide slate header card 'Factory Version FV-depmod-1.0 — immutable · content-addressed · digest = SHA-256 over the canonicalized manifest'. Beneath it a four-by-four grid of rounded tiles, each with a bold name and a grey subline, coloured by family: one blue ('Planner version'), seven amber ('Agent Definitions', 'Harness versions', 'Skills', 'Tools', 'Model routes', 'Context configuration', 'Runtime + Sandbox'), three slate ('Isolation policy', 'Execution Profiles', 'Economics'), three green ('Verification contract', 'Approval policy' with a thick red outline, 'Qualification evidence'), and one wide cream note tile '14 pinned identities, one digest'. A right-hand panel lists six crossed-out items under 'Why mutable configuration cannot be governed' and a vertical chip strip 'Draft → Candidate → Qualified → Active'."
**Alt text.** A Factory Version manifest card for FV-depmod-1.0 with fourteen pinned components: planner version, agent definitions, harness versions, skills, tools, model routes, context configuration, runtime and sandbox image, isolation policy, verification contract, approval policy, execution profiles, economics, and qualification evidence. A side panel lists why mutable configuration cannot be governed — no attributable behavior, no reproducible evidence, no safe rollback target, silent authority widening, unauditable learning, cross-tenant blast radius — and shows the states Draft, Candidate, Qualified, Active.

## 12 · Factory Version state machine — D12

**Purpose.** Show the states a version can be in and which Decisions move it.
**Page.** `/architecture/factory-versioning`, `/specification/v1/factory-version`, `/patterns/immutable-factory-version`.
**Visual structure.** A left-to-right state chain Draft → Candidate → Qualified → Active → Deprecated → Retired with a Rejected branch below Candidate, and Restricted and Suspended as two side states above Active with return transitions. Transition labels name the Decision kind (promotion, restoration) or the Qualification Record.
**Copy.** Headline: *A Factory Version never changes — its state does.* Subhead: *Transitions require a Decision (promotion, restoration) and a current Qualification Record.* Labels: Draft · Candidate · Qualified (scope) · Active (environment) · Restricted · Suspended · Deprecated · Retired · Rejected (preserved).
**Dimensions.** 16:9 docs and training handout; square card: the six main states in a ring.
**Prompt.** "A horizontal state diagram: pill-shaped states connected by curved arrows with small labels. Left to right: 'Draft' and 'Candidate' (amber), 'Qualified' and 'Active' (green), 'Deprecated' and 'Retired' (cream). Above 'Active' two amber pills with red outlines, 'Restricted' and 'Suspended', with arrows to and from 'Active' labelled 'regression — scope narrowed', 're-qualified', 'incident containment', 'Decision: restoration'. Below 'Candidate' a cream pill 'Rejected (preserved)'. Start and end dots at the ends."
**Alt text.** A Factory Version moves from Draft to Candidate when its composition is frozen, to Qualified when a Qualification Record passes for a scope, to Active by a promotion Decision, and later to Deprecated and Retired. From Active it can be Restricted after a regression or Suspended during an incident, returning to Active by re-qualification or a restoration Decision. A Candidate that fails qualification becomes Rejected and is preserved.

## 13 · Qualification: scoped and fail-closed — D13

**Purpose.** Explain that qualification is per scope, covers eighteen dimensions, and fails closed on unknowns.
**Page.** `/architecture/qualification`, `/specification/v1/qualification-record`, `/patterns/fail-closed-qualification`.
**Visual structure.** A funnel from left to right: Candidate Factory Version → Declare scope (four multiplied facets) → five evidence lanes (evals, policy tests, security tests, recovery drills, operational measures) → Qualification Record → two outcomes: Qualified (scope) or Rejected (preserved), with the rule "any hard gate FAIL or UNKNOWN → Rejected".
**Copy.** Headline: *Qualification is scoped and fail-closed.* Subhead: *workload × environment × risk tier × autonomy level — a hard gate with unknown evidence fails.* Lane labels as above; outcome labels: Qualified (scope) → Decision: promotion; Rejected (preserved).
**Dimensions.** 16:9 docs, training; square card: scope formula plus the two outcomes.
**Prompt.** "Left: an amber tile 'Candidate Factory Version FV-x-1.4.0'. Solid arrow to a slate tile 'Declare scope — workload × environment × risk tier × autonomy'. Arrow to a slate tile 'Assess 18 dimensions' which fans into five parallel green lanes: 'Evals', 'Policy tests', 'Security tests', 'Recovery drills', 'Operational measures'. The lanes converge into a green tile 'Qualification Record — per-dimension result · evidence · expiry'. Two outgoing arrows: 'all hard gates PASS' to a green pill 'Qualified (scope)' and then to a red-outlined tile 'Decision: promotion'; 'any hard gate FAIL or UNKNOWN' to a cream pill 'Rejected (preserved)'."
**Alt text.** A candidate Factory Version declares a scope of workload, environment, risk tier and autonomy level, then is assessed across eighteen dimensions through evaluations, policy tests, security tests, recovery drills and operational measures. The results form a Qualification Record. If every hard gate passes the version is Qualified for that scope and may be promoted by a Decision; if any hard gate fails or is unknown it is Rejected and preserved.

## 14 · Evidence architecture: Claim → Authority — D14

**Purpose.** The anti-hype poster: a claim is not evidence, evidence is not verification, verification is not a decision.
**Page.** `/architecture/evidence`, `/in-5-minutes` §8, `/patterns/evidence-bound-acceptance`. Hero SVG: `svg/D14.svg`.
**Visual structure.** Five tiles in a row — Claim (amber), Evidence, Verification, Decision (red outline), Authority (slate) — with the Control Plane above Authority and the consequence "Merge · Deploy · Activate" below it. Under the row: red "never" notes; a binding panel; a six-chip evidence-state strip with only Current marked; a Decision-kinds panel.
**Copy.** Headline: *Evidence architecture — Claim to Authority.* Subhead: *Evidence proves what ran. Verification judges it. A Decision applies authority. Authority is delegated, never inferred.* Strip: Missing · Pending · Current ✓ · Stale · Conflicting · Superseded.
**Dimensions.** All uses; square card: the five-tile chain vertical with one line each.
**Prompt.** "Five rounded tiles in a row joined by solid arrows: 'Claim' (amber), 'Evidence' (green), 'Verification' (green), 'Decision' (green, thick red outline), 'Authority' (slate). Above 'Authority' a slate tile 'Control Plane' with a solid arrow down; below it an amber tile 'Merge · Deploy · Activate' with a solid arrow down. Under the first three tiles small red captions: 'a claim never proves', 'evidence never accepts', 'verification never accepts'. Lower left a cream panel 'Evidence binding' with six bullets. Beneath it a strip of six pills: 'Missing', 'Pending', 'Current ✓' (green), 'Stale', 'Conflicting', 'Superseded'. Lower right a green panel listing eight Decision kinds in monospace."
**Alt text.** A chain of five: a producer's Claim is backed by Evidence bound to the exact subject, judged by independent Verification against the Specification, applied by a human or policy Decision, which exercises Authority delegated from the control plane to authorize a merge, deploy or activation. Evidence never accepts and a claim never proves. Evidence has six states — Missing, Pending, Current, Stale, Conflicting, Superseded — and only Current satisfies a mandatory check.

## 15 · Verification hierarchy — D15

**Purpose.** Show the four verification levels and that factory qualification is an orthogonal axis.
**Page.** `/architecture/verification`, `/patterns/verification-contract`.
**Visual structure.** Four green tiles stacked bottom-up: Task verification → Work Order verification (the unit of acceptance) → Objective / integration verification → Release verification; a slate tile "Factory qualification — verifies the factory, not the work" to the side with dashed arrows to all four. A footer line: Execution success ≠ Task success ≠ Verification success ≠ Business outcome.
**Copy.** Headline: *Verification has levels.* Subhead: *Local to global: Task → Work Order → Objective → Release. Qualification verifies the factory, not the work.*
**Dimensions.** 16:9 docs, training; square card: the four tiles as a staircase.
**Prompt.** "Four green rounded tiles arranged as an ascending staircase from bottom-left to top-right: 'Task verification — fast, local, often deterministic', 'Work Order verification — the unit of acceptance, independent Verification Attempt on the exact Candidate', 'Objective / integration verification — integrated Candidate across Work Orders and factories', 'Release verification — environment validation, canary, production window'. Solid arrows connect them upward. To the left a slate tile 'Factory qualification — verifies the factory, not the work' with dashed arrows to each step. Footer caption in grey: 'Execution success ≠ Task success ≠ Verification success ≠ Business outcome'."
**Alt text.** Four levels of verification rise from Task verification, to Work Order verification — the unit of acceptance — to Objective or integration verification across Work Orders and factories, to Release verification in the environment. Factory qualification sits beside the staircase as an orthogonal axis that verifies the factory rather than the work. Execution success, task success, verification success and business outcome are distinct.

## 16 · Authority model: Capability ≠ Permission ≠ Authority — D16

**Purpose.** Separate what a component *can* do, *may* invoke, and is *authorized* to make real; name who may do what.
**Page.** `/architecture/authority`, `/architecture/security`, `/enterprise/identity-tenancy`.
**Visual structure.** A slate Control Plane at top with three delegation arrows: to Human (red outline: approves, overrides, restores), to Policy engine (authorizes within bounds, never widens), to Factory (executes bounded work) which contains Agent (proposes) and Verifier (attests). Human and Policy engine send a Decision to the Release system (promotes exact accepted artifacts). Dashed evidence: Agent → Verifier → Human / Policy; Release system → Control Plane (Outcome). A three-chip definition strip at the foot.
**Copy.** Headline: *Capability ≠ Permission ≠ Authority.* Subhead: *Capability = can act. Permission = allowed to invoke. Authority = the delegated right to make a consequence real.* Actor labels: Agent proposes · Factory executes · Verifier attests · Policy engine authorizes within bounds · Human approves, overrides, restores · Release system promotes.
**Dimensions.** 16:9 docs, slide; square card: the three-chip definition strip with the six actors under it.
**Prompt.** "Top centre a slate tile 'Control Plane — holds authority: identity · delegation · policy · budgets'. Three solid slate arrows fan down to: a red-outlined tile 'Human — approves consequential decisions; retains override and restoration' (left), a slate tile 'Policy engine — authorizes within delegated bounds; never widens them' (centre), and an amber panel 'Factory — executes bounded work' (right) containing two tiles 'Agent — proposes' (amber) and 'Verifier — attests independently' (green). Solid arrows labelled 'Decision' from Human and Policy engine to a green tile 'Release system — promotes exact accepted artifacts'. Dashed green arrows: Agent to Verifier labelled 'Candidate + Evidence'; Verifier to Human and to Policy engine labelled 'eligibility'; Release system up to Control Plane labelled 'Outcome'. Footer: three chips 'Capability', 'Permission', 'Authority' separated by ≠."
**Alt text.** The control plane holds authority and delegates it to a human, who approves consequential decisions and retains override and restoration; to a policy engine, which authorizes within delegated bounds and never widens them; and to the factory, which executes bounded work under an admitted Execution Profile. Inside the factory the agent proposes and an independent verifier attests. Human or policy Decisions let the release system promote exact accepted artifacts, and outcomes return to the control plane. Capability, permission and authority are three different things.

## 17 · HITL and risk tiers — D17

**Purpose.** Show that autonomy is a spectrum tied to risk and verification confidence, not a switch.
**Page.** `/architecture/authority`, `/enterprise/policy-governance`, `/patterns/progressive-autonomy`.
**Visual structure.** A 4×3 matrix: rows Low, Medium, High, Critical; columns Execute, Verify, Approve. Cells that require a human carry the red outline (High/Approve; Critical/all three). Beneath, the six-step HITL spectrum as a horizontal scale from "Human executes" to "Policy governs autonomously", with the formula for effective autonomy.
**Copy.** Headline: *Autonomy is earned per tier.* Subhead: *Autonomy should increase only as verification confidence increases.* Cells as in canon §11. Footer: *Effective autonomy = min(factory, objective, work order, policy, trust level). It demotes immediately on evidence regression.*
**Dimensions.** All uses; square card: the matrix alone.
**Prompt.** "A four-row, three-column grid of rounded cells with row headers 'Low', 'Medium', 'High', 'Critical' and column headers 'Execute', 'Verify', 'Approve'. Execute cells amber, Verify and Approve cells green. Cells reading 'human acceptance required' (High/Approve), 'human-authorized before execution', 'independent + human review', and 'human acceptance + release authorization' (Critical row) have thick red outlines. Below the grid a horizontal scale with six evenly spaced ticks labelled 'Human executes', 'Human reviews', 'Human approves', 'Human supervises', 'Human handles exceptions', 'Policy governs autonomously', shaded from red-outlined cream on the left to slate on the right."
**Alt text.** A matrix of four risk tiers by three steps. Low: auto execute, deterministic auto verify, policy accepts. Medium: auto execute, independent verification required, policy accepts within envelope. High: auto execute, independent verify, human acceptance required. Critical: human-authorized before execution, independent plus human review, human acceptance plus release authorization. Below, the human-in-the-loop spectrum runs from human executes to policy governs autonomously; effective autonomy is the minimum across factory, objective, work order, policy and trust level.

## 18 · The Builder experience — D18

**Purpose.** Contrast the traditional developer flow with the factory-driven flow and show where human judgment moves.
**Page.** `/architecture/builders`, `/architecture/transformation`.
**Visual structure.** Two horizontal lanes. Top lane (neutral): Ticket → Developer reads, designs, writes code → Pull request → Reviewer reads the diff → CI → Merge → Deploy, with dashed notes "context in the developer's head" and "judgment collapsed into diff review". Bottom lane (canon colours): Builder (red outline) → Specification → Plan → Route → Execute → Independent Verification → Decision (red outline) → Release → Outcome → Learning Signal, with dashed arrows from Builder to Plan ("approves the Plan") and to Decision ("reads the decision packet").
**Copy.** Headline: *Builders define the what. Factories determine the how.* Subhead: *Human judgment moves from reading diffs to approving plans and accepting evidence.*
**Dimensions.** 16:9 docs, slide, LinkedIn landscape; square card: the two lanes stacked with four tiles each.
**Prompt.** "Two horizontal swim lanes. Upper lane titled 'Traditional', seven cream tiles connected by solid arrows: 'Ticket', 'Developer reads, designs, writes code', 'Pull request', 'Reviewer reads the diff', 'CI', 'Merge', 'Deploy', with two dashed grey arcs above labelled 'context lives in the developer's head' and 'judgment collapsed into diff review'. Lower lane titled 'Factory-driven', ten tiles: 'Builder' (red outline), 'Specification' (blue), 'Plan' (blue), 'Route' (slate), 'Execute in sandbox' (amber), 'Independent Verification' (green), 'Decision: acceptance' (green, red outline), 'Release' (green), 'Outcome' (green), 'Learning Signal' (violet). Dashed arcs from 'Builder' to 'Plan' labelled 'approves the Plan' and to 'Decision' labelled 'reads the decision packet'."
**Alt text.** Two lanes. In the traditional flow a ticket becomes code written by a developer, reviewed by reading a diff, run through CI, merged and deployed; context lives in the developer's head and judgment collapses into diff review. In the factory-driven flow a Builder states intent and acceptance criteria, approves the Plan, and later accepts on a decision packet, while the factory routes, executes in a sandbox, verifies independently, releases, observes the outcome and raises Learning Signals.

## 19 · Agent, Skill, Tool, Harness, Factory — D19

**Purpose.** End the vocabulary collision: ten nested or adjacent responsibilities, each with one owner.
**Page.** `/architecture/agents-skills-tools-harnesses`, `/architecture/execution-vocabulary`, `/patterns/bounded-agent`. Hero SVG: `svg/D19.svg`.
**Visual structure.** Nested rounded zones: Factory Ecosystem (slate, dashed) → Control Plane band → Factory (amber) → Orchestrator tile on the left and Runtime → Sandbox → Harness → Agent + Agent Loop nested on the centre; a right column of Skills, Tools, Model, Context Package (amber) and Verifier (green) with labelled edges: loads, invokes, calls, frozen in, Candidate + Evidence; verification result returns to the control plane.
**Copy.** Headline: *Agent, Skill, Tool, Harness, Factory.* Subhead: *A Tool acts · a Skill packages a method · an Agent pursues a goal · a Harness is the envelope · a Factory turns intent into verified outcomes.*
**Dimensions.** All uses; square card: the nesting only (Factory → Runtime → Sandbox → Harness → Agent) as concentric rounded rectangles.
**Prompt.** "Concentric rounded rectangles on cream paper. Outermost dashed slate: 'Factory Ecosystem'. Inside at the top a slate band 'Control Plane'. Below it a large amber zone 'Factory — one immutable Factory Version'. Inside the factory, at the left, a slate tile 'Orchestrator — advances the Work Graph'. In the centre three nested dashed amber zones labelled 'Runtime', 'Sandbox', and a solid amber zone 'Harness — operating envelope for ONE agent' containing an amber tile 'Agent' and a wide amber tile 'Agent Loop — load → select → act → observe → evaluate → replan → stop'. On the right inside the factory, a column of tiles: 'Skills', 'Tools', 'Model', 'Context Package' (amber) and 'Verifier — independent Verification Attempt' (green). Solid arrows from the Harness to Skills ('loads'), Tools ('invokes'), Model ('calls'); an arrow from Context Package into the Harness ('frozen in'); a dashed green arrow from the Harness to the Verifier ('Candidate + Evidence') and from the Verifier up to the Control Plane ('verification result'). A solid slate arrow from the Control Plane to the Orchestrator ('authorizes an Execution Profile') and from the Orchestrator into the Harness ('dispatches one Work Graph node')."
**Alt text.** Nested containers show the vocabulary: a Factory Ecosystem holds a control plane and factories; a factory holds an orchestrator that advances the Work Graph, and a runtime that hosts a sandbox that isolates a harness bounding exactly one agent and its loop. Skills are loaded, tools invoked under a grant, a model called, a context package frozen into the attempt, and a separate verifier attests the candidate and evidence, returning its result to the control plane.

## 20 · Local factory vs Enterprise Factory Ecosystem — D20

**Purpose.** Show that the twelve layers stay the same and only ownership, routing levels, and verification levels change with scale.
**Page.** `/architecture` (local vs ecosystem), `/enterprise`.
**Visual structure.** Two panels side by side. Left, small: embedded control plane → one factory → Work Order verification, per-factory learning. Right, large: shared control plane → Objective Planner → Factory A, B, C → Objective / integration verification → Release verification, with cross-factory learning returning to the control plane. A thick arrow between the panels labelled "Scope → Prove → Expand → Operate". Beneath, a seven-row comparison table (scope, control plane, routing, registries, identity, verification, learning).
**Copy.** Headline: *One factory, then many — the layers do not change.* Subhead: *Scale by adding factories under one control plane, not by making one factory universal.*
**Dimensions.** 16:9 docs and enterprise presentations; square card: two panels only.
**Prompt.** "Left: a compact slate-outlined panel 'Local Factory' with three stacked tiles connected by solid arrows: 'Embedded control plane' (slate), 'One factory — one repo / product' (amber), 'Work Order verification' (green). Right: a wider slate-outlined panel 'Enterprise Factory Ecosystem' with a top tile 'Shared control plane — identity · policy · registries · routing' (slate), below it 'Objective Planner' (slate) fanning to three amber tiles 'Factory A vX', 'Factory B vY', 'Factory C vZ', converging into 'Objective / integration verification' (green) then 'Release verification' (green); a dashed violet arrow from the bottom back to the shared control plane labelled 'cross-factory learning'. A thick solid arrow between panels labelled 'Scope → Prove → Expand → Operate'. Below, a two-column comparison table with seven rows."
**Alt text.** A local factory has an embedded control plane, one factory for one repository or product, and Work Order-level verification. An enterprise factory ecosystem has a shared control plane with enterprise identity, policy, registries and routing; an Objective Planner that selects among many factories; objective-level and release-level verification; and cross-factory governed learning. Organizations move from one to the other by adding factories under one control plane.

## 21 · The governed learning loop — D21

**Purpose.** Show that learning proposes and never mutates production; promotion is a governed Factory Lifecycle decision.
**Page.** `/architecture/learning`, `/patterns/governed-learning`.
**Visual structure.** A left-to-right pipeline in violet: sources (executions, failures, retries, verifications, overrides, cost, incidents, outcomes) → Learning Signal → cluster → evaluation dataset + Improvement Candidate → Human review (red outline diamond) → Candidate Factory Version (amber) → Qualify (green) → Decision: promotion (red outline) → Active Factory Version (slate) with a canary window; a dashed return from Active to the sources; a red ✕ link from Improvement Candidate to "Live configuration · acceptance · evidence · authority".
**Copy.** Headline: *Learning can be autonomous. Promotion is governed.* Subhead: *Learning creates Improvement Candidates; it never mutates or activates production behavior.*
**Dimensions.** 16:9 docs, training; LinkedIn landscape; square card: five chips Signal → Candidate → Review → Qualify → Promote.
**Prompt.** "A left-to-right pipeline. A violet panel listing sources: 'executions · failures · retries · verifications · overrides · cost · latency · incidents · outcomes'. Solid arrow to a violet tile 'Learning Signal — attributable · reviewed · acceptanceAuthority: false', then to 'Recurring cluster', then splitting to 'Evaluation dataset' and 'Improvement Candidate' (violet). Arrow to a diamond 'Human review' with a thick red outline. Then an amber tile 'Candidate Factory Version', a green tile 'Qualify — baseline vs candidate · regression suites', a diamond 'Decision: promotion' with red outline, and a slate tile 'Active Factory Version — canary · observation window'. A dashed violet arrow from the Active tile back to the sources labelled 'outcomes'. A short red-crossed dashed line from 'Improvement Candidate' to a cream tile 'Live configuration · acceptance · evidence · authority' labelled 'never'."
**Alt text.** Executions, failures, retries, verifications, overrides, cost, incidents and outcomes become attributable Learning Signals, which cluster into evaluation datasets and Improvement Candidates. A human reviews each candidate; approved ones become a candidate Factory Version that must qualify before a promotion Decision activates it with a canary and an observation window. Outcomes flow back as new signals. An Improvement Candidate never touches live configuration, acceptance, evidence or authority.

## 22 · Economics: cost per accepted outcome — D22

**Purpose.** Replace "tokens" with the right denominator: cost per verified, accepted, released, and production outcome.
**Page.** `/architecture/economics`, `/benchmarks`.
**Visual structure.** Left: a stacked bar of attributed cost components (inference, compute and sandbox, tool calls and retrieval, independent verification, retries and failed Attempts, human review minutes, remediation and incidents) feeding a "Total cohort cost" block. Right: five denominators fanning out — Work Orders admitted · independently verified · verified and accepted · released · production-verified — each yielding a metric name. A callout: failed and retried work stays in the numerator, never in a denominator. A note that each component is ACTUAL, ESTIMATED or UNKNOWN.
**Copy.** Headline: *Optimize for cost per accepted outcome, not tokens.* Subhead: *Attributed cost over a declared cohort and window, divided by outcomes that survived verification and acceptance.* Metric labels: Cost per Work Order · Cost per verified outcome · Cost per accepted outcome · Cost per released outcome · Cost per production outcome.
**Dimensions.** All uses; LinkedIn landscape and square (this is the most shareable chart); CTO one-pager.
**Prompt.** "Left half: a vertical stacked bar with seven segments in amber and green shades, each labelled to the left: 'Inference tokens · model cost', 'Compute · sandbox · storage', 'Tool calls · retrieval', 'Independent verification', 'Retries · failed Attempts', 'Human review minutes', 'Remediation · incidents', with a slate block to its right 'Total cohort cost — each component ACTUAL · ESTIMATED · UNKNOWN'. Right half: five horizontal slate tiles fanning from the total, each beginning with a division sign: '÷ Work Orders admitted = Cost per Work Order', '÷ independently verified = Cost per verified outcome', '÷ verified and accepted = Cost per accepted outcome' (emphasized), '÷ released = Cost per released outcome', '÷ production-verified in window = Cost per production outcome'. A dashed grey callout: 'Failed, retried, abandoned work stays in the numerator, never in a denominator.' No numbers."
**Alt text.** A stacked bar of attributed cost — inference, compute and sandbox, tool calls and retrieval, independent verification, retries and failed attempts, human review minutes, remediation and incidents — forms a total cohort cost. The total is divided by five different denominators to give cost per Work Order, per verified outcome, per accepted outcome, per released outcome and per production outcome. Failed and retried work stays in the numerator and never counts as an outcome.

## 23 · The maturity model — D24

**Purpose.** Give leaders a ladder they can locate themselves on, with conformance starting at L2.
**Page.** `/framework/maturity`, `/enterprise/adoption`.
**Visual structure.** Six ascending steps L0–L5 (Ad Hoc AI Use, Assisted Development, Governed Agents, Orchestrated Delivery, Qualified Factory, Factory Ecosystem), each step showing architecture, autonomy, and the metric that appears at that level; a bracket over L2–L5 labelled "Factory conformance"; a footer with the scoring rule (minimum over hard-gate dimensions Security, Verification, Governance; floor of the average for the rest).
**Copy.** Headline: *Where is your factory?* Subhead: *Six levels, eleven dimensions, hard gates for Security, Verification, and Governance.* Step labels as above with one-line descriptors from canon §13.
**Dimensions.** All uses; LinkedIn square works well as a staircase; CTO discussion handout.
**Prompt.** "A staircase of six ascending rounded steps from left to right labelled 'L0 Ad Hoc AI Use' (cream), 'L1 Assisted Development' (cream), 'L2 Governed Agents' (amber), 'L3 Orchestrated Delivery' (slate), 'L4 Qualified Factory' (green), 'L5 Factory Ecosystem' (violet). Each step carries two short grey lines: what the architecture has and what the human does. A thin bracket over steps L2 to L5 labelled 'Factory conformance begins at L2'. Footer text: 'Overall level = min over hard-gate dimensions (Security · Verification · Governance), then floor(average) of the rest'."
**Alt text.** Six maturity levels rise from L0 Ad Hoc AI Use and L1 Assisted Development, through L2 Governed Agents with bounded identities and retained evidence, L3 Orchestrated Delivery with durable Plans, Work Orders and independent verification, L4 Qualified Factory with immutable Factory Versions and release controls, to L5 Factory Ecosystem with a shared control plane and three-level routing. Conformance begins at L2. The overall level is the minimum over the hard-gate dimensions Security, Verification and Governance.

## 24 · The non-collapsible states — D32

**Purpose.** The one-line antidote to "the agent said it's done".
**Page.** `/framework/delivery-loop`, `/architecture/verification`, `/anti-patterns`, `/in-5-minutes` §8.
**Visual structure.** A single horizontal strip of five to six chips joined by large ≠ signs: Execution complete (amber) ≠ Verified (green) ≠ Gate eligible ≠ Approved (green, red outline) ≠ Released ≠ Outcome proven; under each chip the record that proves it (Attempt COMPLETED · Verification receipt, current · currentness recomputed · Decision: acceptance · Release · Outcome over a window). Optional second row: which anti-pattern collapses each boundary.
**Copy.** Headline: *Execution complete ≠ Verified ≠ Approved ≠ Released ≠ Outcome proven.* Subhead: *Each boundary needs its own record and its own authority.* Footer: *Missing, stale, or unrelated evidence cannot become success.*
**Dimensions.** LinkedIn landscape and square first; docs strip; slide.
**Prompt.** "A single wide strip on cream paper: six pill-shaped chips separated by large '≠' glyphs — 'Execution complete' (amber), 'Verified' (green), 'Gate eligible' (green), 'Approved' (green with a thick red outline), 'Released' (green), 'Outcome proven' (green). Under each chip a small grey line naming the record: 'Attempt COMPLETED', 'Verification receipt, current', 'currentness recomputed', 'Decision: acceptance', 'Release', 'Outcome over a window'. Headline above in bold; one-line footer below."
**Alt text.** Six states separated by not-equal signs: execution complete, verified, gate eligible, approved, released, outcome proven. Each requires its own record — a completed Attempt, a current verification receipt, a recomputed currentness check, an acceptance Decision, a Release, an Outcome observed over a window — and its own authority. Missing, stale or unrelated evidence cannot become success.

## 25 · Production promotion pipeline — D29

**Purpose.** Show how a change to the factory itself reaches production and how it is restored when thresholds fail.
**Page.** `/architecture/factory-versioning`, `/architecture/learning`, `/enterprise/operations`.
**Visual structure.** A ring or a left-to-right loop of seven tiles: Observe (violet) → Propose: Improvement Candidate (violet) → Evaluate (green) → Qualify (green) → Approve: Decision promotion (green, red outline) → Promote / Activate (slate) → Observe (violet) → back to the start when thresholds hold; a branch from the second Observe labelled "thresholds fail" to Restore: Decision restoration (slate, red outline) → previous version. A callout: never mutate an Active version; restoration targets a separately identified previous version.
**Copy.** Headline: *Promote exact versions. Restore to exact versions.* Subhead: *Observe → Propose → Evaluate → Qualify → Approve → Promote → Observe.* Labels as above.
**Dimensions.** 16:9 docs, platform and factory-engineer training; square card: the seven tiles as a ring.
**Prompt.** "Seven rounded tiles arranged in a loop on cream paper: 'Observe — outcomes · incidents · cost' (violet), 'Propose — Improvement Candidate' (violet), 'Evaluate — regression · held-out · adversarial' (green), 'Qualify — candidate Factory Version for scope' (green), 'Approve — Decision: promotion' (green with thick red outline), 'Promote / Activate — environment · cohort · restoration target' (slate), 'Observe — window · thresholds' (violet), with a solid arrow from the last Observe back to the first labelled 'thresholds hold'. From the last Observe a second arrow labelled 'thresholds fail' leads to a slate tile with red outline 'Restore — Decision: restoration → previous version', which arrows back to the first Observe. A grey callout: 'Never mutate an Active version.'"
**Alt text.** A loop for changing the factory: observe outcomes, propose an Improvement Candidate, evaluate it against regression, held-out and adversarial cases, qualify the candidate Factory Version for its scope, approve promotion by a Decision, promote and activate it for an environment and cohort with a named restoration target, then observe over a window. If thresholds hold the loop continues; if they fail a restoration Decision returns to the separately identified previous version. An Active version is never mutated.

## Related

- [/diagrams](/diagrams) — colour semantics, arrow grammar, export rules, inventory
- [/diagrams/decision-trees](/diagrams/decision-trees)
- [/framework](/framework) · [/architecture](/architecture) · [/enterprise](/enterprise) · [/start](/start)
