# FDLC.ai Canonical Content Model

Date: 2026-09-03

## Principles

- Canonical concepts live in typed data and are rendered in multiple contexts.
- Long-form explanation can be page-specific; names, sequence, definitions, and status must not be duplicated manually.
- Status is a property of a specific product capability, not a whole future product.
- FDLC entities and Mission Control entities are mapped explicitly rather than forced into identical names.
- FDLC is the discipline and architecture; FDLC.ai is the ecosystem that develops and applies it.
- The seven-step delivery loop is a homepage orientation layer, not a replacement for the eight-stage lifecycle or nine-artifact execution protocol.

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
  | "Available"
  | "Experimental"
  | "Planned"
  | "Proposed";

type ProductCapability = {
  name: string;
  status: CapabilityStatus;
  summary: string;
  limitation: string;
  evidenceHref?: string;
};
```

## Canonical records

### Lifecycle

`Discover → Design → Assemble → Govern → Operate → Verify → Release → Learn & Scale`

Each stage owns an output that becomes a governed input to later stages. The lifecycle describes evolution of the factory itself and can repeat at the factory, line, or capability level.

### Architecture

`Intent · Harness · Capability · Model · Trust · Learning`

The six areas are capabilities, not deployment tiers. Trust is cross-cutting even when displayed as one area; Learning consumes only validated signals and never self-authorizes promotion.

### Execution Protocol

`Goal → Plan → Work Order → Attempt → Evidence → Verification → Approval → Release → Outcome`

Associated objects include Acceptance Criterion, Agent Identity, Delegation, Execution Lease, and Learning Signal. Mission Control maps Goal to Mission and adds Specification, Task, candidate, pull request, and explicit human acceptance where its concrete contract requires them.

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
  goal: { outcome: string; workType: string };
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
