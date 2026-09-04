# FDLC.ai Canonical Content Model

Date: 2026-09-04

## Principles

- Canonical concepts live in typed data and are rendered in multiple contexts.
- Long-form explanation can be page-specific; names, sequence, definitions, and status must not be duplicated manually.
- Status is a property of a specific product capability, not a whole future product.
- FDLC entities and Mission Control entities are mapped explicitly rather than forced into identical names.
- FDLC is the discipline and architecture; FDLC.ai is the ecosystem that develops and applies it.
- Three abstraction levels stay distinct: the Factory Development Lifecycle,
  software factory value stream, and governed execution protocol. The
  six-domain architecture is a structural view across those levels, not a
  competing lifecycle.
- Lifecycle verbs describe what the system does. Protocol nouns preserve what existed, ran, was observed, and was decided.
- Governance, Security, Observability, Measurement, and Human Authority are
  cross-cutting disciplines rather than sequential lifecycle stages.

## Core types

```ts
type Link = { label: string; href: string };

type LifecycleStage = {
  id: string;
  number: number;
  name: string;
  purpose: string;
  activities: string[];
  output: string;
  href: string;
};

type FactoryControl = {
  name: "Governance" | "Security" | "Observability" | "Measurement" | "Human Authority";
  purpose: string;
};

type ValueStreamStage = {
  id: string;
  number: number;
  name: string;
  artifact: string;
  purpose: string;
};

type ArchitectureArea = {
  id: string;
  number: number;
  name: "Intent" | "Harness" | "Capability" | "Model" | "Trust" | "Learning";
  purpose: string;
  responsibilities: string[];
  components: string[];
  decisions: string[];
  failureModes: string[];
  maturity: string[];
  examples: string[];
  relationships: string;
};

type ProtocolStep = {
  id: string;
  number: number;
  name: string;
  question: string;
  requiredProof: string;
  missionControlMapping?: string;
};

type ManifestoPrinciple = {
  number: number;
  principle: string;
  explanation: string;
  implication: string;
};

type MaturityLevel = {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  name: string;
  description: string;
  operatingModel: string;
  nextMove: string;
};

type MaturityDimension = {
  id: string;
  name: string;
  question: string;
  options: Array<{ score: 0 | 1 | 2 | 3 | 4 | 5; label: string }>;
};

type CapabilityStatus =
  | "Qualified"
  | "Qualified; advisory"
  | "Qualified diagnostic system"
  | "Implemented, gated"
  | "Production-pilot eligible; Preview"
  | "Partial"
  | "Missing"
  | "Missing canonical lifecycle"
  | "Experimental"
  | "Proposed"
  | "Design partner";

type ProductCapability = {
  name: string;
  status: CapabilityStatus;
  summary: string;
  limitation: string;
  evidenceHref?: string;
};
```

## Canonical records

### Definition and category boundary

> FDLC is the Factory Development Lifecycle—the open operating model,
> engineering framework, and reference architecture for designing, building,
> governing, operating, measuring, and continuously improving AI software
> factories.

Primary positioning: **Verified delivery, not merely generated code.**

Supporting thesis: **Autonomy without evidence is just faster guessing.**

| Category | Primary object | Question answered |
| --- | --- | --- |
| Traditional SDLC | Software | How do we build software? |
| AI-Native SDLC | Software + AI-assisted workflow | How does AI change software development? |
| AI Software Factory | Persistent governed production system | How does intent become independently verified software? |
| FDLC | The software factory | How do we engineer the factory that performs autonomous software delivery? |

The first transition, SDLC → AI-Native SDLC, brings agents into the lifecycle. The second, AI-Native SDLC → AI Software Factory, makes those workflows a persistent, governed production system. FDLC is the engineering discipline for that factory.

### Lifecycle

`Discover → Design → Assemble → Validate → Deploy → Operate → Improve`

Each stage owns an output that becomes a governed input to later stages. The lifecycle describes evolution of the factory itself and can repeat at the factory, line, or capability level. `Governance · Security · Observability · Measurement · Human Authority` span every stage as cross-cutting disciplines.

### Software factory value stream

`Intent → Plan → Define Agent → Execute through Harness → Apply Skills → Evaluate → Improve → Deliver Software`

This value stream describes how software work moves through an operating
factory. It is not a second lifecycle for engineering the factory itself.
`Deploy` belongs to the outer Factory Development Lifecycle; `Deliver Software`
includes the governed decision, release, observation, and measured outcome for
the software produced by a factory run.

### Architecture

`Intent · Harness · Capability · Model · Trust · Learning`

The six areas are capabilities, not deployment tiers. Trust is cross-cutting even when displayed as one area; Learning consumes only validated signals and never self-authorizes promotion.

### Artifact protocol

`Intent → Specification → Plan → Work Order → Attempt → Evidence → Verification → Approval → Release → Outcome → Learning`

Associated objects include Acceptance Criterion, Agent Identity, Delegation, Execution Lease, Task, and Candidate. Mission Control maps Intent to Mission and Specification to Mission Spec, then adds implementation records such as Tasks, candidates, pull requests, and explicit human acceptance where its concrete contract requires them.

### Manifesto

The ten numbered principles in the master brief are canonical. Explanatory copy may evolve, but the principle meaning and order must remain stable unless the framework is deliberately versioned.

### Maturity

- Level 0 — Ad Hoc Prompting
- Level 1 — Assisted Development
- Level 2 — Governed Agents
- Level 3 — Orchestrated Workflows
- Level 4 — Verified Factory Lines
- Level 5 — Continuously Learning Factory

Assessment dimensions: Intent, Planning, Agent governance, Execution, Verification, Security, Human oversight, Observability, Learning, Reuse, and Scale. V0 scores each dimension from 0–5, reports the rounded-down average as the overall level, and surfaces the three lowest dimensions as gaps. This is an educational self-assessment, not certification.

### Metrics

Primary outcome measures:

- verified completion rate;
- cost per verified outcome;
- human review minutes per accepted change;
- cycle time;
- first-pass verification rate;
- reopen rate;
- rollback rate;
- escaped defect rate;
- policy violation rate;
- recovery success rate;
- cost by work type;
- verifier disagreement rate.

Generated tokens, lines of code, prompt count, and agent count are operational telemetry only.

### Worked examples

Worked examples map one bounded workflow to every canonical model without creating a second taxonomy. Each example must include:

- all seven Factory Development Lifecycle stages and five cross-cutting disciplines;
- all eight software factory value-stream stages;
- all six architecture areas;
- all eleven artifact protocol objects;
- one primary outcome metric and explicit guardrails;
- a pre-automation baseline contract, clearly labeled illustrative values, and concrete next actions;
- implementation evidence or screenshots whose capability boundaries remain explicit;
- a visible boundary between illustrative records and observed production evidence.

The first example is dependency modernization at `/in-5-minutes`. It explains why the line is a useful lighthouse candidate, traces Mission Control participation, and defines verified completion plus five operating measures. Its sample identifiers and targets are educational records, not benchmark results or customer proof. The former `/examples/dependency-modernization` path permanently redirects to the canonical route.

### Product relationships

```text
FDLC.ai
├── FDLC Framework — defines the discipline and reference architecture
├── FDLC Specification — formalizes interoperable artifacts
├── Mission Control — open-source reference implementation
├── AI Software Factory Guide — teaches the discipline
├── FDLC Deploy — design-partner implementation services
└── FDLC Enterprise — proposed commercial organizational control plane
```

## Factory Definition output model

V0 generates a client-side conceptual record:

```ts
type FactoryDefinition = {
  version: "0.1-draft";
  generatedAt: string;
  intent: { outcome: string; workType: string };
  acceptanceCriteria: string[];
  planBoundaries: string[];
  candidateWorkOrders: Array<{ name: string; outcome: string }>;
  requiredCapabilities: string[];
  authority: string[];
  verificationContract: string[];
  humanControls: string[];
  outcomeMetrics: string[];
};
```

The V0 record is explicitly educational and not accepted directly by Mission Control. Future schema work should align identifiers and invariants with Mission Control rather than introduce a competing execution contract.
