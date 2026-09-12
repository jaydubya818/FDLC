---
title: Start Here
description: Seven learning paths by role — ordered reading lists with time estimates and outcomes — and the five-level progression from Beginner to Expert mapped to canonical pages.
path: /start
audience: [executive, leader, architect, platform, builder, security, factory-engineer]
level: [beginner, practitioner, architect, enterprise, expert]
status: draft
related: [/in-5-minutes, /framework, /framework/maturity, /architecture, /specification, /guides, /tutorials, /mission-control, /glossary]
diagrams: []
mc_refs: []
---

# Start Here

## What is it

Seven learning paths, one per role, each an ordered reading list with a time estimate and a "you can now" outcome. Below them, the five-level progression (Beginner → Practitioner → Architect → Enterprise → Expert) maps every topic FDLC covers to its canonical page. Pages marked *(planned)* are in the canonical information architecture but not yet published; the path is still the right order.

If you have five minutes, read [/in-5-minutes](/in-5-minutes) first. If you want to know where your organization stands, take the assessment at [/framework/maturity](/framework/maturity) and it will name your next move.

## Why it matters

FDLC is layered: a five-minute explanation, then concepts, architecture, implementation, enterprise operation, and specification. Reading the specification first is a common way to conclude that FDLC is heavy; reading only the explanation is a common way to conclude that it is obvious. The paths give each role the right depth in the right order.

## The seven paths

### Executive — Understand Autonomous Software Factories in 15 Minutes

| # | Page | Minutes | What you get |
|---|---|---|---|
| 1 | [/in-5-minutes](/in-5-minutes) | 5 | The ten questions |
| 2 | [/framework](/framework) §What is it, §Two lifecycles | 4 | The definitions and the category distinction |
| 3 | [/framework/principles](/framework/principles) §Design principles | 3 | The ten statements to hold the program to |
| 4 | [/framework/maturity](/framework/maturity) §Ladder, §Next move | 3 | Where you are and the one next move |

**You can now** state what a software factory is and is not, explain why verified outcomes rather than generated code are the unit of value, ask your organization which maturity level it can demonstrate, and recognize a "prompt-installed factory" when one is presented to you.

### Engineering Leader — Adopting Software Factories in Your Organization

| # | Page | Minutes | What you get |
|---|---|---|---|
| 1 | [/in-5-minutes](/in-5-minutes) | 5 | Orientation |
| 2 | [/framework](/framework) | 12 | The full framework front door |
| 3 | [/framework/factory-lifecycle](/framework/factory-lifecycle) | 15 | Eight stages, roles, entry and exit criteria |
| 4 | [/framework/maturity](/framework/maturity) | 10 | Assessment and min-gated scoring |
| 5 | [/architecture/builders](/architecture/builders) | 8 | How engineering work shifts |
| 6 | [/enterprise/adoption](/enterprise/adoption) *(planned)* | 10 | Scope → Prove → Expand → Operate |
| 7 | [/enterprise/organization](/enterprise/organization) *(planned)* | 10 | Roles and team shapes |
| 8 | [/benchmarks](/benchmarks) *(planned)* | 8 | The measurement contract |

**You can now** choose a first factory with a baseline and a stop condition, name the Factory Owner, Verification Engineer, and Policy Owner, set the measurement contract before the first run, and defend an adoption sequence that expands only on evidence. About 80 minutes.

### Architect — Designing an Enterprise Factory Platform

| # | Page | Minutes | What you get |
|---|---|---|---|
| 1 | [/framework](/framework) | 12 | Definitions, lifecycles, reconciliation matrix |
| 2 | [/architecture](/architecture) *(planned)* | 15 | Twelve layers, four planes, six areas, control boundary |
| 3 | [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) | 12 | The boundaries and the SDK placement |
| 4 | [/architecture/factory-versioning](/architecture/factory-versioning) *(planned)* | 12 | Composition, immutability, state machine, qualification standard |
| 5 | [/architecture/multi-factory](/architecture/multi-factory) *(planned)* | 12 | Objective Planner, three-level routing, integration verification |
| 6 | [/architecture/verification](/architecture/verification) *(planned)* | 12 | Independence, hierarchy, currentness |
| 7 | [/architecture/evidence](/architecture/evidence) *(planned)* | 10 | Binding, states, provenance |
| 8 | [/architecture/authority](/architecture/authority) *(planned)* | 10 | Capability ≠ permission ≠ authority; risk tiers; HITL |
| 9 | [/architecture/context](/architecture/context) *(planned)* | 10 | Retrieval, assembly, policy, poisoning |
| 10 | [/architecture/design-decisions](/architecture/design-decisions) *(planned)* | 12 | Six evidence-bound decisions |
| 11 | [/enterprise/reference-architecture](/enterprise/reference-architecture) *(planned)* | 20 | The worked enterprise architecture |
| 12 | [/specification](/specification) *(planned)* | 15 | Artifact model and conformance tracks |

**You can now** draw the reference architecture for your organization, decide which responsibilities are shared platform services and which are per-factory, specify the Factory Version composition and its qualification scope, and place every vendor component at the boundary it actually occupies. About 2.5 hours.

### Platform Engineer — Building the Factory Control Plane

| # | Page | Minutes | What you get |
|---|---|---|---|
| 1 | [/framework/delivery-loop](/framework/delivery-loop) | 20 | Ten steps with inputs, outputs, decisions, evidence, MC status |
| 2 | [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) | 12 | Boundaries and the "which boundary failed" diagnostic |
| 3 | [/architecture/execution-vocabulary](/architecture/execution-vocabulary) *(planned)* | 8 | The relationship chain |
| 4 | [/architecture/sandboxing](/architecture/sandboxing) *(planned)* | 10 | Isolation requirements |
| 5 | [/architecture/observability](/architecture/observability) *(planned)* | 10 | Trace model and spans |
| 6 | [/architecture/economics](/architecture/economics) *(planned)* | 8 | Cost denominators and coverage |
| 7 | [/specification](/specification) *(planned)* and [/specification/v1/attempt](/specification/v1/attempt), [/specification/v1/work-order](/specification/v1/work-order), [/specification/v1/evidence](/specification/v1/evidence) *(planned)* | 30 | Fields, states, invariants, schemas |
| 8 | [/mission-control](/mission-control) *(planned)* | 15 | Capability ledger, admission model, worked flows |
| 9 | [/patterns](/patterns) *(planned)* | 20 | Fenced lease, exact-current gate, permit-gated publication, idempotent side effects |
| 10 | [/tutorials](/tutorials) *(planned)* | 60+ | Mission Control-connected build-alongs |

**You can now** implement durable Work Orders and fenced Attempts, produce Evidence bound to an exact Candidate, enforce verifier independence and currentness as deterministic functions, and gate publication and release on server-authorized decisions. About 3.5 hours plus tutorials.

### Developer / Builder — Working With a Software Factory {#builder}

| # | Page | Minutes | What you get |
|---|---|---|---|
| 1 | [/in-5-minutes](/in-5-minutes) | 5 | Orientation |
| 2 | [/architecture/builders](/architecture/builders) | 10 | What you do at each step; what you never do |
| 3 | [/framework/delivery-loop](/framework/delivery-loop) §Steps 1–3, 7, 9 | 10 | Receive, Specify, Plan, Approve, Observe |
| 4 | [/framework/principles](/framework/principles) §Manifesto | 6 | The governance rules you will be held to |
| 5 | [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) §The ten side by side | 6 | What the factory is made of |
| 6 | [/examples/dependency-modernization](/examples/dependency-modernization) *(planned)* | 10 | One factory end to end with records |
| 7 | [/tutorials](/tutorials) *(planned)* | 45 | Submit an Intent, approve a Plan, read a decision packet |

**You can now** write an Intent with acceptance criteria an agent and a verifier can both act on, review and approve one exact Plan revision, read a decision packet and accept on evidence and risk rather than on a green score, and recognize when you are being pulled into the loop instead of receiving decisions. About 90 minutes.

### Security — Securing Autonomous Software Execution

| # | Page | Minutes | What you get |
|---|---|---|---|
| 1 | [/framework](/framework) §Definitions, §Non-collapsible boundary | 6 | Vocabulary and the state boundary |
| 2 | [/architecture/authority](/architecture/authority) *(planned)* | 12 | Capability ≠ permission ≠ authority; actors; risk tiers |
| 3 | [/architecture/sandboxing](/architecture/sandboxing) *(planned)* | 10 | Isolation, credentials, egress |
| 4 | [/architecture/context](/architecture/context) *(planned)* | 10 | Context poisoning, provenance, authorization |
| 5 | [/architecture/evidence](/architecture/evidence) *(planned)* | 10 | Attestation-shaped evidence, integrity, SLSA/in-toto alignment |
| 6 | [/architecture/verification](/architecture/verification) *(planned)* | 12 | Independence by lineage and by standard |
| 7 | [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) §Diagnostic | 8 | Which boundary failed |
| 8 | [/enterprise/identity-tenancy](/enterprise/identity-tenancy) *(planned)* and [/enterprise/policy-governance](/enterprise/policy-governance) *(planned)* | 20 | Workload identity, delegation chains, tenant boundaries, authorization ratchet |
| 9 | [/enterprise/policy-governance](/enterprise/policy-governance) *(planned)* | 10 | Audit artifacts |
| 10 | [/anti-patterns](/anti-patterns) *(planned)* | 15 | Self-verification, permissions inferred from content, borrowed proof |

**You can now** review a Factory Version's credential, network, and sandbox policy, require that authority is delegated from the control plane and never inferred from content or SDK guardrails, specify the evidence integrity and independence a high-risk scope needs, and audit an incident to the boundary that failed. About 2 hours.

### Factory Engineer — Building and Qualifying Your First Factory

| # | Page | Minutes | What you get |
|---|---|---|---|
| 1 | [/framework/factory-lifecycle](/framework/factory-lifecycle) | 20 | Eight stages, the Factory Manifest skeleton |
| 2 | [/framework/delivery-loop](/framework/delivery-loop) | 20 | What the factory must produce at every step |
| 3 | [/architecture/factory-versioning](/architecture/factory-versioning) *(planned)* | 12 | Composition, state machine, qualification standard |
| 4 | [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) | 12 | What to assemble and how to pin it |
| 5 | [/architecture/verification](/architecture/verification) *(planned)* | 12 | Writing the verification contract |
| 6 | [/architecture/learning](/architecture/learning) *(planned)* | 10 | Improvement Candidates and governed promotion |
| 7 | [/guides](/guides) *(planned)* — "Define your first factory", "Qualify a Factory Version" | 40 | Build guides with the 13-section template |
| 8 | [/examples](/examples) *(planned)* | 20 | Case-study factories with artifacts and evidence |
| 9 | [/specification/v1/factory-manifest](/specification/v1/factory-manifest), [/specification/v1/factory-version](/specification/v1/factory-version), [/specification/v1/qualification-record](/specification/v1/qualification-record) *(planned)* | 25 | The exact fields |
| 10 | [/mission-control](/mission-control) *(planned)* | 15 | What the reference implementation can and cannot demonstrate |

**You can now** write a Factory Manifest from a measured opportunity, map every acceptance criterion to an independent verifier, assemble a content-addressed Factory Version, declare and run a qualification scope, and route an Improvement Candidate back through Qualify instead of editing production. About 3 hours plus guides.

## The five-level progression

The paths above are by role. The progression below is by depth. Each level lists the topics FDLC covers at that depth and the canonical page for each.

### Beginner

| Topic | Canonical page |
|---|---|
| What is an AI Software Factory | [/in-5-minutes](/in-5-minutes) §2 · [/framework](/framework) |
| Why coding agents are not factories | [/in-5-minutes](/in-5-minutes) §3 · [/framework](/framework) §Category |
| What is FDLC | [/framework](/framework) · [/compare](/compare) *(planned)* |
| Humans vs agents vs deterministic systems | [/architecture/builders](/architecture/builders) · [/architecture/authority](/architecture/authority) *(planned)* |
| The autonomous delivery lifecycle | [/framework/delivery-loop](/framework/delivery-loop) |
| The vocabulary | [/glossary](/glossary) · [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) |

### Practitioner

| Topic | Canonical page |
|---|---|
| Building your first factory | [/framework/factory-lifecycle](/framework/factory-lifecycle) · [/guides](/guides) *(planned)* · [/tutorials](/tutorials) *(planned)* |
| Agent harnesses | [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) · [/architecture/execution-vocabulary](/architecture/execution-vocabulary) *(planned)* |
| Context engineering | [/architecture/context](/architecture/context) *(planned)* |
| Tools and MCP | [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) §Crosswalk · [/specification/v1/capability-manifest](/specification/v1/capability-manifest) *(planned)* |
| Sandboxing | [/architecture/sandboxing](/architecture/sandboxing) *(planned)* |
| Verification | [/architecture/verification](/architecture/verification) *(planned)* |
| Evidence | [/architecture/evidence](/architecture/evidence) *(planned)* |
| Observability | [/architecture/observability](/architecture/observability) *(planned)* |
| Recovery | [/framework/delivery-loop](/framework/delivery-loop) §Execute · [/patterns](/patterns) *(planned)* |

### Architect

| Topic | Canonical page |
|---|---|
| Control planes | [/architecture](/architecture) *(planned)* · [/architecture/authority](/architecture/authority) *(planned)* |
| Factory registries | [/architecture/multi-factory](/architecture/multi-factory) *(planned)* · [/enterprise/reference-architecture](/enterprise/reference-architecture) *(planned)* |
| Multi-factory orchestration | [/architecture/multi-factory](/architecture/multi-factory) *(planned)* |
| Factory versions | [/architecture/factory-versioning](/architecture/factory-versioning) *(planned)* |
| Capability routing | [/architecture/multi-factory](/architecture/multi-factory) *(planned)* §Three-level routing |
| Model routing | [/architecture/economics](/architecture/economics) *(planned)* · [/enterprise/model-gateway](/enterprise/model-gateway) *(planned)* |
| Distributed execution | [/enterprise/execution-fleet](/enterprise/execution-fleet) *(planned)* |
| Verification architecture | [/architecture/verification](/architecture/verification) *(planned)* |
| Knowledge architecture | [/architecture/context](/architecture/context) *(planned)* |
| Design decisions | [/architecture/design-decisions](/architecture/design-decisions) *(planned)* |

### Enterprise

| Topic | Canonical page |
|---|---|
| Identity | [/enterprise/identity-tenancy](/enterprise/identity-tenancy) *(planned)* |
| Security | [/architecture/authority](/architecture/authority) *(planned)* · [/architecture/sandboxing](/architecture/sandboxing) *(planned)* · [/enterprise/policy-governance](/enterprise/policy-governance) *(planned)* |
| Governance | [/framework/principles](/framework/principles) · [/enterprise/policy-governance](/enterprise/policy-governance) *(planned)* |
| Tenancy | [/enterprise/identity-tenancy](/enterprise/identity-tenancy) *(planned)* |
| Compliance | [/enterprise/policy-governance](/enterprise/policy-governance) *(planned)* |
| Cost management | [/architecture/economics](/architecture/economics) *(planned)* · [/benchmarks](/benchmarks) *(planned)* |
| Fleet management | [/enterprise/execution-fleet](/enterprise/execution-fleet) *(planned)* · [/enterprise/operations](/enterprise/operations) *(planned)* |
| Organizational adoption | [/enterprise/adoption](/enterprise/adoption) *(planned)* |
| Operating models | [/enterprise/operations](/enterprise/operations) *(planned)* |
| Platform teams | [/enterprise/organization](/enterprise/organization) *(planned)* |
| Migration strategy | [/enterprise/adoption](/enterprise/adoption) *(planned)* · [/examples](/examples) *(planned)* (Migration / API Modernization factory) |

### Expert

| Topic | Canonical page |
|---|---|
| Factory economics | [/architecture/economics](/architecture/economics) *(planned)* · [/benchmarks](/benchmarks) *(planned)* |
| Autonomy theory | [/architecture/authority](/architecture/authority) *(planned)* · [/framework/maturity](/framework/maturity) |
| Verification science | [/architecture/verification](/architecture/verification) *(planned)* · [/essays](/essays) *(planned)* |
| Factory optimization | [/architecture/learning](/architecture/learning) *(planned)* · [/architecture/factory-versioning](/architecture/factory-versioning) *(planned)* |
| Governed learning | [/architecture/learning](/architecture/learning) *(planned)* |
| AI engineering org design | [/enterprise/organization](/enterprise/organization) *(planned)* · [/architecture/builders](/architecture/builders) |
| Future autonomous development organizations | [/essays](/essays) *(planned)* |
| Standards governance and contribution | [/project](/project) *(planned)* · [/specification/conformance](/specification/conformance) *(planned)* |

The Guide ([/guide](/guide)) is the narrative companion at every level: it explains; the pages above define. Where the two differ in a name, the page wins and the Guide's term is in the [alias table](/glossary#alias-table).

## What can go wrong

- Starting at the specification. Start at the level your role needs.
- Reading only the Executive path and then designing a factory.
- Skipping the maturity assessment and choosing a path for the level you want rather than the one you can demonstrate.

## Related

- [/in-5-minutes](/in-5-minutes) · [/framework](/framework) · [/framework/maturity](/framework/maturity)
- [/architecture](/architecture) · [/specification](/specification) · [/guides](/guides) · [/tutorials](/tutorials) · [/examples](/examples)
- [/mission-control](/mission-control) · [/glossary](/glossary) · [/guide](/guide)
