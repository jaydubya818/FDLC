# FDLC Canon v1.0 — Normative Decision Record

Status: Proposed canon for FDLC.ai. Every page, spec, pattern, guide, and diagram authored for FDLC.ai MUST conform to this document. Where this document changes an existing FDLC.ai term or model, the change is listed in §14 with its rationale and migration.

Evidence base: `/home/claude/work/audit/01..05` (site audit, Mission Control study, Mission Control Enterprise study, Guide corpus study, industry landscape). Source repos: `/home/claude/repos/FDLC-main` (near-main site), `/home/claude/repos/MissionControl`, `/home/claude/repos/MissionControlEnterprise`, `/home/claude/repos/ai-software-factory-mastery`.

---

## 0. How to use this document

- **Authors**: use the exact names, spellings, step orders, and definitions here. Do not invent a new sequence, layer model, or level ladder. If a page needs a compressed view, label it "compression of the Delivery Loop" (or Factory Lifecycle) and keep step ids.
- **Pattern**: "FDLC requires X. Mission Control implements this through Y (file/table)." Never present Mission Control as the definition of FDLC.
- **Honesty**: every capability claim about Mission Control carries its ledger status (Available / Experimental / Planned / Proposed) and its limitation. FDLC content never claims production certification, fleet scale, zero-touch delivery, or autonomous self-improvement.
- **Layered depth**: 5-minute explanation → concepts → architecture → implementation → enterprise operation → specification. Don't duplicate; link down.
- **Visual first**: any concept with structure gets a diagram (Mermaid in markdown; SVG for hero diagrams). No page is a wall of text.

---

## 1. Positioning and thesis

### 1.1 Definitions (canonical, verbatim)

**FDLC (Factory Development Lifecycle)** — The lifecycle, architecture, vocabulary, artifact model, governance model, and learning model for designing, assembling, qualifying, operating, and continuously improving autonomous AI software factories. FDLC governs the complete path from human or machine intent to trusted software outcomes.

**AI Software Factory (Factory)** — A governed production system that converts intent into independently verified software outcomes. A factory composes agents, models, skills, tools, context, harnesses, execution environments, verification, evidence, policy, human authority, delivery, and learning under a control plane. A factory is more durable than any model, agent, or harness operating inside it.

**Coding Agent** — A reasoning loop that generates or modifies software using a model, tools, and context. A coding agent is a worker inside a factory; it is not a factory.

**Control Plane** — The durable system of record that holds authority: identity, delegated authority, policy, budgets, routing, state, registries, evidence requirements, decisions, and emergency control. Authority flows down from the control plane; evidence flows back to it.

**Factory Ecosystem** — Many specialized factories coordinated through one enterprise control plane with shared identity, policy, routing, verification, evidence, observability, and organizational authority.

**Builder** — A human who defines what should be accomplished and holds accountability for the outcome. Builders may be software engineers, QA engineers, security engineers, architects, product engineers, product managers, domain experts, or other authorized participants. The term never refers to an agent.

### 1.2 The category distinction (repeat on every entry page)

```
Coding Agent ≠ AI Software Factory
SDLC governs the lifecycle of software.
FDLC governs the lifecycle of the factory that builds it.
```

| | Traditional SDLC | AI-Native / Agentic SDLC | FDLC |
|---|---|---|---|
| Primary object | Software | Software + AI-assisted workflow | The factory |
| Question | How do we build software? | How does AI change development? | How do we engineer, govern, and improve the system that performs autonomous delivery? |
| Unit of value | Shipped feature | Generated change | Verified outcome |

Adjacent terms, drawn explicitly: *Agent Development Lifecycle (ADLC)* = lifecycle of building agents (Gartner/Harness). FDLC = lifecycle of building software with governed factories of agents. FDLC sits above agent SDKs, harnesses, and coding assistants.

### 1.3 Foundational statements (use verbatim; these are the "ten design principles")

1. Models reason. Control planes govern.
2. The model proposes. The system decides what becomes real.
3. Builders define the what. Factories determine the how.
4. The producer should not be the sole judge of its own work.
5. Evidence enables authority. Missing, stale, or unrelated evidence cannot become success.
6. Learning can be autonomous. Promotion should be governed.
7. Autonomy should increase only as verification confidence increases.
8. Factories are governed systems, not giant prompts.
9. Models are replaceable execution resources; a factory is more durable than the model operating inside it.
10. Optimize for cost per accepted outcome, not tokens or generated volume.

The existing **FDLC Manifesto** (ten principles with explanation + implication, `data/fdlc.ts:174-185`) is preserved as the governance principles. The ten statements above are the *design* principles. Both are published; the Manifesto page cross-links them.

### 1.4 The core promise

**Verified delivery, not merely generated code.** / **Autonomy without evidence is just faster guessing.** (preserve both lines)

---

## 2. The composition hierarchy

Canonical seven-level composition (top = governs, bottom = executes). Each level is a distinct identity with its own lifecycle, version, qualification, and failure question.

```
FDLC                     Lifecycle, architecture, artifacts, governance, learning model
  └ FACTORY ECOSYSTEM    Many factories under one enterprise control plane
      └ CONTROL PLANE    Authority, policy, routing, state, registries, budgets
          └ FACTORY      Reusable governed production capability (versioned → Factory Version)
              └ HARNESS  Operating envelope + loop controls around one agent
                  └ AGENT  Reasoning + goal + tools + context + working state
                      └ MODEL  Inference resource (replaceable)
```

Cross-cutting roles inside the hierarchy:

| Term | One-line definition | Relationship |
|---|---|---|
| **Tool** | A capability the agent may invoke (API, CLI, MCP operation) under a grant. | Used by an agent through the harness; governed by a Tool Manifest and grant. |
| **Skill** | A reusable, versioned, domain-specific procedure or playbook. | Loaded by the harness into an agent's context; governed by a Skill Manifest. |
| **Agent** | A reasoning loop capable of acting toward a goal. | Hosted by a harness; defined by an Agent Definition. |
| **Agent Loop** | The iteration cycle of one agent: load → select → act → observe → evaluate → replan → stop. | Runs inside one Work Graph node. |
| **Harness (Agent Harness)** | The runtime envelope that controls the agent loop and connects models, tools, context, policy, state, budgets, recovery, telemetry, and stopping. Coding Harness / IDE Harness are specializations. | Bounds one agent. Enforces locally; never holds enterprise authority. |
| **Agentic SDK** | A vendor or open framework used to implement an agent or harness (OpenAI Agents SDK, Claude Agent SDK, LangGraph, Google ADK, Semantic Kernel / Agent Framework, CrewAI, Mastra…). | Implementation choice inside the Agent & Harness layer. FDLC sits above SDK choice. |
| **Work Graph** | The topology of work: nodes, dependencies, gates, joins, retries, terminal states. | Advanced by the Orchestrator. |
| **Orchestrator** | Durable coordinator that advances the Work Graph across agents, deterministic steps, and human waits. | Part of the factory; not a harness. |
| **Runtime** | Execution substrate: process lifecycle, compute, queues, leases, persistence, resume. | Hosts execution. |
| **Sandbox** | Isolation boundary: filesystem, process, network, credentials, resources. | Contains effects. |
| **Capability** | A stable, provider-independent operation ("run tests", "open PR"). | Realized by a Capability Implementation (exact tool/skill/model/adapter version). |
| **Factory Platform** | Shared enterprise foundation many factories reuse (control plane, registries, execution, evidence, evaluation). | The infrastructure under a Factory Ecosystem. |

Diagram: "Agent vs Skill vs Tool vs Harness vs Factory" (visual spec in §16). "AI Harness", "inner/outer/meta-harness", "meta-factory control plane" are non-canonical aliases (glossary alias table).

---

## 3. Two lifecycles

FDLC contains exactly two lifecycles. Every other published sequence is a labeled compression or projection of one of them (§3.4).

### 3.1 The Delivery Loop (inner loop) — how one unit of intent becomes a verified outcome

Formal name: **Autonomous Software Delivery Loop** ("the Delivery Loop"). Ten steps. Verbs are steps; nouns are artifacts.

| # | Step | Question | Primary artifact(s) produced | Governing decision |
|---|---|---|---|---|
| 1 | **Receive** | What outcome matters? | Intent | Admission (is it well-formed, owned, in scope?) |
| 2 | **Specify** | What must be true? | Specification (acceptance criteria, constraints, verification requirements) | Specification finalized (planning-ready ≠ approved) |
| 3 | **Plan** | How will the factory achieve it? | Plan (Work Graph, Work Orders, verification strategy, budgets) | Plan Approval (binds one exact revision) |
| 4 | **Route** | Which factory, version, profile, and resources may do this work? | Routing Decision; Work Order bound to Factory Version + Execution Profile | Eligibility before ranking; scheduling separate |
| 5 | **Execute** | What exactly ran? | Context Package, Attempt, Candidate, Evidence | Admission of the Attempt under a fenced lease |
| 6 | **Verify** | Does the evidence satisfy the specification? | Verification (independent Verification Attempt + Result), currentness | Verification makes work *eligible*; it never accepts |
| 7 | **Approve** | May this consequence proceed? | Decision (kind: acceptance) | Human or policy authority at the risk tier |
| 8 | **Release** | What was promoted? | Release (exact artifact, environment, rollback readiness) | Release authorization; publication permits |
| 9 | **Observe** | Did the intended result hold in reality? | Outcome (technical, operational, business) | Observation window; measurement contract |
| 10 | **Learn** | What should change in the factory? | Learning Signal → Improvement Candidate | Proposal only; promotion is a Factory Lifecycle decision |

Change from current site: adds **Route** (step 4) between Plan and Execute. Rationale: routing to a qualified Factory Version is the enterprise-scale step the nine-step model hid inside Plan/Execute; the three routing levels (§8) need a home. Step 9 keeps the verb Observe (artifact Outcome). Step 7 keeps the verb Approve (artifact Decision of kind acceptance).

**Non-collapsible states** (preserve verbatim): Execution complete ≠ Verified ≠ Approved ≠ Released ≠ Outcome proven. Add the Mission Control extension: verification passed ≠ current-gate eligible ≠ accepted ≠ merged ≠ production verified.

**Compressions allowed** (must be labeled): 6-step "Intent → Plan → Execute → Verify → Release → Learn" (executive); 4-step "Define the outcome → Bound the work → Require evidence → Learn from outcomes" (hero). Each compression declares `mapsTo` step ids.

### 3.2 The Factory Lifecycle (outer loop) — how a factory comes to exist, earns trust, and changes

Formal name: **Factory Development Lifecycle** (the "FDLC lifecycle" proper). Eight stages. Each stage declares entry criteria, exit criteria, inputs, outputs, evidence, and roles (authored in the lifecycle spec).

| # | Stage | Purpose | Output artifact | Exit criterion (summary) |
|---|---|---|---|---|
| 1 | **Discover** | Find work worth turning into a factory; establish the baseline. | Opportunity record (baseline cost, cycle time, defect rate, human effort) | A measured, owned opportunity with a stop condition |
| 2 | **Define** | State the outcome contract, risk class, authority, and acceptance criteria. | Factory Manifest (definition part) | Manifest reviewed by the Factory Owner and Policy Owner |
| 3 | **Design** | Design the Work Graph, capabilities, routing, context policy, verification contract, sandbox policy, economics. | Factory Design (manifest complete) | Every acceptance criterion maps to a verifier; every capability to a registry entry |
| 4 | **Assemble** | Compose and build the exact composition: agents, skills, tools, harness, model routes, runtime, sandbox image, policies. | Factory Version (candidate; immutable manifest + digests) | Content-addressed manifest; all identities resolved |
| 5 | **Qualify** | Evaluate and qualify the Factory Version for a declared scope. | Qualification Record → Qualified Factory Version | Qualification passes for scope (workload × environment × risk tier × autonomy level) |
| 6 | **Deploy** | Promote the exact qualified version into an environment. | Active Factory Version (environment binding, rollout cohort, restoration target) | Promotion decision recorded; previous version preserved as rollback |
| 7 | **Operate** | Run the Delivery Loop durably; manage exceptions, incidents, capacity, cost. | Verified outcomes; operating evidence | SLOs and measurement contract satisfied; incidents closed with proof |
| 8 | **Improve** | Turn Learning Signals into Improvement Candidates → new Factory Version through Qualify/Deploy. | Improvement Candidate → next Factory Version | Never mutates an active version |

Change from current site (7 stages Discover → Design → Assemble → Validate → Deploy → Operate → Improve): **Design split into Define + Design** (the Factory Definition builder and the FDE engagement both need a Define stage); **Validate renamed Qualify** (Factory Version qualification is first-class; "validate" collided with software verification). Evaluate is the activity inside Qualify; Learn is Delivery Loop step 10 whose signals enter Improve.

### 3.3 Relationship between the loops

```
FACTORY LIFECYCLE (outer)   Discover → Define → Design → Assemble → Qualify → Deploy → Operate → Improve
                                                                                     │         ▲
                                                                        runs inside  │         │ Learning Signals
                                                                                     ▼         │
DELIVERY LOOP (inner)       Receive → Specify → Plan → Route → Execute → Verify → Approve → Release → Observe → Learn
```

- **Deploy** promotes a Factory Version. **Release** promotes a software artifact. Neither transition creates its own authority (preserve callout).
- The inner loop runs only inside an Active Factory Version; the outer loop can only change behavior by producing a new Factory Version.
- The intuitive analogy: the Delivery Loop is the production line running; the Factory Lifecycle is how you build, certify, commission, and retool the line.

### 3.4 Reconciliation of existing sequences (normative mapping)

| Existing sequence (audit id) | Disposition |
|---|---|
| S1 `lifecycleStages` (7) | Becomes the 8-stage Factory Lifecycle (Design→Define+Design; Validate→Qualify). |
| S2 `runtimeLifecycle` (9) | Becomes the 10-step Delivery Loop (+Route). |
| S3 `protocolSteps` (11) | Becomes the 19-artifact model (§5); ids preserved where unchanged. |
| S4 `guideValueStream` (8) | Retired as a lifecycle. "Define Agent" and "Apply Skills" become named mechanics inside Route/Execute. Guide stage briefs renamed to Delivery Loop steps. |
| S5 homepage 4-step | Labeled compression (mapsTo 1-2 / 3-5 / 6-8 / 9-10). Sourced from data. |
| S6, S7 homepage example chains | Replaced by the worked example rendered from data. |
| S8 MC "Governed delivery trace" (6) | Labeled compression of the Delivery Loop, MC view. |
| S9 `missionControlTimeline` (11) | Kept as the Mission Control admission timeline; each item maps to an artifact id. |
| S10 `executionRelationship` (7) | Kept; it is the Execution plane relationship chain, not a lifecycle. |
| S11 `enterpriseStages` (7) | Labeled compression of the Delivery Loop (drops Specify/Observe/Approve→Release). Prefer full 10 in enterprise content. |
| S12 ownership chain | Prose; align nouns to artifacts. |
| S13 `enterpriseAdoption` (Scope→Prove→Expand→Operate) | Kept as the **Adoption Path** (organizational), explicitly not a lifecycle. |
| S14 Version lifecycle (Develop→Qualify→Promote→Activate→Observe→Improve) and S15 decision-06 sequence | Both replaced by the Factory Version state machine (§7.3). |
| S16 enterprise worked objective WO-101..107 | Kept as the multi-factory worked example; IDs re-keyed to the canonical scheme. |
| S17–S23 FDE sequences | FDE workflow maps to Factory Lifecycle stage ids (Discover, Define, Assemble, Qualify, Operate; "Transfer & Scale" = engagement phase). Engagement phases Readiness → Lighthouse → Scale kept as commercial phases. |
| S24 capability package flow | Kept as the Capability lifecycle (Author → Package → Evaluate → Admit → Activate → Observe → Compare → Promote/Roll back → Improve), a sub-lifecycle of Assemble/Qualify/Improve. |
| S25 Guide parts (Understand…Improve) | Book structure only; each Part maps to lifecycle stages. |
| S26 ecosystem roles | Kept (Defines / Demonstrates / Teaches / Applies / Industrializes). |
| S27, S28 state boundaries | Preserved verbatim. |
| S29 decision relationship chains | Promoted: they become the spine of the Delivery Loop artifact diagram. |

---

## 4. Reference architecture

### 4.1 Twelve layers in four planes (canonical stack)

```
┌──────────────────────────────────────────────────────────────────────────┐
│ PLANE I — INTENT                                                         │
│  L1  Experience          Builder UI · CLI · IDE · API · issue trackers   │
│  L2  Intent & Planning   Intent · Specification · Objective Planner ·    │
│                          Plan · Work Graph · Work Orders                 │
├──────────────────────────────────────────────────────────────────────────┤
│ PLANE II — CONTROL                                                       │
│  L3  Control Plane       Identity · Authority · Policy · Budgets ·       │
│                          State · Factory Registry · Capability Registry  │
│  L4  Routing &           Objective → Work Order → Task routing ·         │
│      Orchestration       Factory Versions · Execution Profiles ·         │
│                          Orchestrator · Scheduling · Leases · Queues     │
├──────────────────────────────────────────────────────────────────────────┤
│ PLANE III — EXECUTION                                                    │
│  L5  Agent & Harness     Agents · Agent Loop · Harness · Skills · Tools ·│
│                          Agentic SDKs · Model routes                     │
│  L6  Context & Knowledge Retrieval · Assembly · Context Policy ·         │
│                          Provenance · Freshness · Authorization          │
│  L7  Execution           Runtime · Sandboxes · Compute · Network ·       │
│      Environment         Credentials · Artifact extraction               │
├──────────────────────────────────────────────────────────────────────────┤
│ PLANE IV — TRUST                                                         │
│  L8  Verification        Tests · Static/dynamic analysis · Security ·    │
│                          Policy checks · AI evaluators · Independent     │
│                          verifier attempts · Human review                │
│  L9  Evidence &          Artifacts · Traces · Receipts · Provenance ·    │
│      Provenance          Currentness · Evidence store                    │
│  L10 Authority &         Decisions · Publication · Promotion · Release · │
│      Release             CI/CD & delivery systems                        │
├──────────────────────────────────────────────────────────────────────────┤
│ CROSS-CUTTING                                                            │
│  L11 Observability &     Traces · Quality · Cost · Tokens · Latency ·    │
│      Economics           Reliability · Attribution                       │
│  L12 Learning            Outcomes · Signals · Evaluation datasets ·      │
│                          Improvement Candidates · Factory evolution      │
└──────────────────────────────────────────────────────────────────────────┘
        Authority flows down ↓                       ↑ Evidence flows back
```

Changes from the brief's stacks: **Context & Knowledge** is its own layer (shared enterprise service with distinct security concerns); **Factory Orchestration** merges with routing into L4 (routing and scheduling are the orchestration decisions); **Authority** is split: *holding* authority is L3 (control plane), *exercising* it on candidates is L10.

### 4.2 Six responsibility areas (preserved; one rename)

| Area | Responsibility | Primary layers |
|---|---|---|
| 1 Intent | Define what should happen and how success is judged | L1, L2 |
| 2 **Execution** (renamed from "Harness") | Make execution durable, bounded, isolated, observable, recoverable | L4 (orchestrator), L5, L7 |
| 3 Capability | Package reusable ways to act: agents, skills, tools, context services | L5, L6; registries in L3 |
| 4 Model | Match reasoning capability to work without lock-in | L5 (model routes), gateway in L3/L4 |
| 5 Trust | Decide what may run, advance, and needs judgment | L3 (authority/policy), L8, L9, L10 |
| 6 Learning | Improve the factory from validated outcomes under change control | L12 |
| Continuous controls: Govern · Secure · Observe · Measure | | L3, L7, L11 |

Rename rationale: the area contained Orchestrator, Runtime, and Sandbox, which the execution vocabulary says are not the Harness. The Harness remains a term (L5).

### 4.3 Control boundary thesis (preserve verbatim)

Intelligence supply (models reason, agents act — replaceable) · Factory control plane (durable system of record) · Execution environment (effects stay bounded). "Allow intelligence to vary. Always bound authority." Expected to change: models, agents, skills, prompts, tool adapters. Required to persist: intent, identity, authority, state, evidence, decisions, outcomes.

### 4.4 Local Factory vs Enterprise Factory Ecosystem

| | Local Factory | Enterprise Factory Ecosystem |
|---|---|---|
| Scope | One repository, product, domain, or bounded context | Many factories across BUs, repos, environments |
| Control plane | Embedded or single-tenant | Shared, multi-tenant, federated ownership |
| Routing | Level 2–3 (version, task) | All three levels; Objective Planner selects factories |
| Registries | Local capability list | Factory Registry + Capability Registry with qualification scopes |
| Identity | Repo/app credentials | Enterprise identity, workload identity, delegation chains |
| Verification | Work Order level | + Objective (integration) and Release levels |
| Learning | Per factory | Cross-factory evaluation datasets; governed promotion per version |

Principle: **The control plane orchestrates the objective. Factories execute bounded work. Factories do not orchestrate one another.** (Why: governance, composability, observability, recovery, security, determinism, auditability — each explained in the multi-factory page.)

---

## 5. Canonical artifact model (19 artifacts, 5 families)

Identifier scheme: `fdlc://v1/<artifact>`; example instances use the worked-example prefix scheme (`INT-104`, `SPEC-104`, `PLAN-104-r2`, `WO-104-01`, `FV-depmod-1.0`, `EP-depmod-1.0-prod`, `ATT-…`, `CAND-…`, `EV-…`, `VER-…`, `DEC-…`, `REL-…`, `OUT-…`, `LS-…`, `IC-…`).

| Family | Artifact | One-line definition | Mission Control implementation (status) |
|---|---|---|---|
| A Intent | **Intent** | The requested outcome: goal, constraints, owner, risk, stop condition, budget. An Intent admitted for planning is the **Objective** of its Plan. | `missions` (Available). Alias: Mission. |
| A | **Specification** | Immutable, versioned statement of what must be true: acceptance criteria, boundaries, verification requirements. Finalized ≠ approved. | `missionSpecRevisions` (Experimental, default off). Alias: Mission Spec. |
| A | **Plan** | Governed, versioned decomposition: Work Graph, Work Orders, verification strategy, dependencies, budgets, decision points. Approval binds one exact revision. | `missionPlans` + Quality Contract projection (Available). |
| A | **Work Order** | The bounded, authorized unit of work: scope, risk class, authority envelope, verification contract, change budget, bound Factory Version + Execution Profile. Contains Tasks. | `workOrders` (Available). Code spelling `WorkOrder`; prose "Work Order". |
| B Factory | **Factory Manifest** | The declarative definition of a factory: identity, capabilities, inputs/outputs, planner, execution profiles, models, skills, tools, context sources, runtime, sandbox, network/credential policy, verification, evidence, approval policy, risk class, observability, economics, qualification, release policy. | `factoryDefinitions` (Available). Three site shapes unify here. |
| B | **Factory Version** | Immutable, content-addressed composition of exact identities (planner, agent definitions, harness versions, skills, tools, model routes, runtime artifact, sandbox image, context config, verification config, approval requirements, policy bundle). Qualified per scope; activated per environment. | `factoryDefinitionVersions` + readiness (Available; behavioral qualification not yet). |
| B | **Execution Profile** | The admitted per-Attempt composition: which Model, Agent, Harness, Work Graph, Runtime, Sandbox, Capability Implementations, and policy identities apply, plus autonomy ceiling and resource limits. | `factoryExecutionProfiles` (DISABLED → OFFLINE_ELIGIBLE / PRODUCTION_PILOT_ELIGIBLE → REVOKED). |
| B | **Capability Manifest** | Registry entry for a Capability Implementation. Kinds: agent, skill, tool, model-route, harness, verifier, context-source. Carries identity, version, permissions, qualification, evidence, deprecation. | `modelCatalog`, `mcpToolVersions`, `contextPackageVersions`, harness manifests, agent templates. |
| B | **Qualification Record** | The evidence-backed determination that a Factory Version (or Capability) meets the Qualification Standard for a declared scope, with expiry and revocation. | `factoryReadinessAssessments` (readiness only; behavioral qualification = FDLC requirement). |
| C Execution | **Context Package** | The frozen, digested, authorized set of context supplied to an Attempt, with provenance and freshness. Advisory: never evidence, never authority. | `factoryContextPackages` (Available, advisory). |
| C | **Attempt** | One immutable execution of a Task under a fenced lease and frozen execution manifest. Retries create new Attempts. Producer Attempt vs Verifier Attempt. | `workflowRuns` (Available). |
| C | **Candidate** | The exact output of a Producer Attempt, identified by commit + tree + diff hash + contract digest + source Attempt. Unpublished until permitted. | `verificationSubject` on `workflowRuns` (Available). |
| C | **Evidence** | Durable, attributable record of what was authorized, executed, observed, verified, or decided — bound to an exact subject with provenance, integrity, and validity conditions. Six states (see §10). | `evidenceEnvelopes`, `runArtifacts`, `verificationReceipts` (Available). |
| D Trust | **Verification** | An independent Verification Attempt against a frozen Verification Subject and Plan, producing a Result and a Quality Gate decision. Independence is proven (separate attempt, lease, invocation, files). | `verificationRuns`, `qualityGateDecisions`, `verificationIndependence` (Available). |
| D | **Decision** | An attributable, reasoned, authorized decision record. Kinds: `plan-approval`, `routing`, `admission`, `acceptance`, `release-authorization`, `promotion`, `restoration`, `exception`. Human or policy actor; always server-authorized. | `approvalDecisions`, `workOrders.accept`, routing decisions, permits (Available). Replaces "Approval" as artifact #8. |
| D | **Release** | Promotion of an exact accepted artifact into an environment with current policy, rollout scope, and rollback readiness. | `factoryReleases` (Experimental/Partial). |
| D | **Outcome** | The observed technical, operational, and business result over an observation window, attributed to the release and its cost cohort. | outcome records / production feedback (Experimental). |
| E Learning | **Learning Signal** | An attributable, reviewed signal from executions, failures, retries, verifications, overrides, cost, incidents, outcomes. | `learningSignals`, clusters (Available, advisory). |
| E | **Improvement Candidate** | A proposed factory change (routing, skill, evaluator, policy, prompt, config) with regression cases and expected effect; enters Qualify as a candidate Factory Version. Alias: Learning Proposal. | `metaLoopSuggestions` → submitted Mission Plan (Manual; `autoPromote:false`). |

Every artifact spec defines: identity, required fields, lifecycle states + permitted transitions, invariants (MUST/MUST NOT), evidence requirements, extension namespace, Mission Control mapping, JSON Schema, and one example instance.

---

## 6. What qualifies as an AI Software Factory

### 6.1 Factory Conformance Criteria (21 capabilities → 4 conformance tracks)

A system is an AI Software Factory when it demonstrably provides all Level-1 capabilities; conformance levels map to the maturity model.

| Track | Capability (from brief §5) | Required at |
|---|---|---|
| Intent | 1 Defined intent · 2 Machine-readable specification · 3 Planning/decomposition · 15 Acceptance criteria | L2+ |
| Execution | 4 Context acquisition · 5 Capability discovery · 6 Factory selection · 7 Model/agent routing · 8 Governed execution · 9 Isolated environments · 10 Tool access · 11 Credential boundaries · 12 Durable state · 19 Recovery | L2 (8–12), L3 (4,5,7,19), L5 (6) |
| Trust | 13 Evidence production · 14 Independent verification · 16 Human authority · 17 Release controls · 18 Observability | L2 (13,16,18), L3 (14), L4 (17) |
| Learning | 20 Outcome measurement · 21 Continuous (governed) learning | L4 (20), L4–L5 (21) |

Conformance is machine-checkable where possible (the artifact set emitted, verification ≠ producer enforced, Factory Version immutable). The Conformance Suite is a roadmap item (§15).

### 6.2 Specialized factories (catalog)

Organizations operate many specialized factories, not one universal factory. Canonical catalog (each gets a case-study page): Code Generation · Code Review · Test Generation · Security Remediation · Dependency Upgrade · Migration / API Modernization · Application Modernization · Refactoring · Documentation · Infrastructure · Incident Remediation · Data Migration · Accessibility · Release. Creation test (preserve from `enterprise.ts`): create a separate factory only when outcome semantics, ownership, qualification, governance, authority, or lifecycle materially differ.

"Factory line" is retired as a synonym; each line *is* a specialized factory (alias kept in glossary).

---

## 7. Factory Version and Qualification

### 7.1 Composition (immutable)

```
Factory Version FV-<factory>-<semver>
 ├── Planner version
 ├── Agent Definitions (versions)
 ├── Harness versions (adapters)
 ├── Skills (versions, digests)
 ├── Tools (Tool Manifests + grants)
 ├── Model routes (logical route → qualified providers)
 ├── Context configuration (sources, policy, freshness)
 ├── Runtime artifact + Sandbox image (digests)
 ├── Network, credential, filesystem policy
 ├── Verification contract (criteria → verifiers, independence rules)
 ├── Approval policy (risk tier → decision authority)
 ├── Execution Profiles (admitted compositions)
 ├── Economics (budgets, cost coverage rules)
 └── Qualification evidence (scopes, expiry)
```

Why mutable factory configuration cannot be governed at scale: no attributable behavior (which composition ran?), no reproducible evidence, no safe rollback target, silent authority widening, unauditable learning, cross-tenant blast radius. Production routes work to a **qualified immutable Factory Version**, never to a mutable factory.

### 7.2 Qualification Standard (dimensions)

Functional correctness · task success · regression performance · security · sandbox isolation · policy compliance · tool permissions · credential handling · unsupported actions / hallucinated effects · model-route compatibility · cost · latency · reliability · determinism where required · evidence completeness · recovery behavior · failure behavior · observability coverage. Qualification is scoped: workload class × environment × risk tier × autonomy level. Fail-closed: a hard gate with unknown evidence fails.

### 7.3 Factory Version state machine (canonical; replaces S14/S15)

```
Draft → Candidate → Qualified(scope) → Active(env) → Deprecated → Retired
                        │                 │  ▲
                        │                 ├──┼── Restricted (scope narrowed after regression)
                        │                 └──┼── Suspended (incident containment) ──restoration──┘
                        └── Rejected (qualification failed; preserved)
```

Transitions require a Decision of kind promotion / restoration and a current Qualification Record. Qualification levels named on the page: Experimental (Draft/Candidate), Qualified, Production (Active in production), Restricted, Suspended, Deprecated, Retired.

Promotion pipeline: Observe → Propose (Improvement Candidate) → Evaluate → Qualify → Approve → Promote (Activate) → Observe; restoration to a separately identified previous version when thresholds fail.

---

## 8. Three-level routing

| Level | Input → Output | Decides | Owner |
|---|---|---|---|
| 1 Objective routing | Objective → required capabilities → factory set | Which factories are needed; dependency graph across Work Orders | Objective Planner (in the control plane) |
| 2 Work Order routing | Work Order → qualified Factory Version + Execution Profile | Which immutable, qualified composition performs bounded work | Factory Router |
| 3 Task routing | Task → model / skill / tool / runtime / sandbox / provider | Which qualified resources perform one step (frontier for architecture reasoning, workhorse for implementation, small/local for transformation, independent model for verification) | Capability Router inside the factory |

Invariants: eligibility (policy, authorization, compatibility, qualification, authority) is filtered **before** ranking by performance and economics; an ineligible candidate never receives a score; scheduling is a separate decision; a hard budget with unknown estimated cost fails closed; critical-risk Work Orders are never auto-routed without explicit policy; fallbacks must be prequalified.

---

## 9. Verification-first engineering

- Execution success ≠ Task success ≠ Verification success ≠ Business outcome.
- **Independence**: the producer is never the sole judge. Independence is proven by lineage (separate Attempt, lease, worktree, invocation) *and* by standard (verifier did not rely on artifacts the candidate could shape; the candidate did not modify files that determine its own verdict).
- **Hierarchy (local → global)**: Task verification → Work Order verification (the unit of acceptance) → Objective / integration verification (integrated candidate across Work Orders and factories) → Release verification (environment validation, canary, production verification). Factory qualification is the orthogonal axis (verifying the factory, not the work).
- **Strategies**: deterministic tests, unit, integration, acceptance, static analysis, dynamic analysis, security scanning, policy validation, independent model review, adversarial verification, runtime/browser validation, environment validation, canary/production validation, human review.
- **Currentness**: evidence binds to an exact subject and validity conditions; newest candidate + newest exact-bound verification decide; never fall back to an older pass; a moved PR head invalidates eligibility.
- Only PASS satisfies a mandatory check; missing, stale, skipped, unconfigured, errored, insufficiently independent, or conflicting proof cannot become success.

---

## 10. Evidence model

```
Claim → Evidence → Verification → Decision → Authority
```

- Evidence proves *what ran and what was observed*; Verification judges whether it satisfies the Specification; a Decision applies authority; Authority is delegated from the control plane, never inferred from capability.
- Binding: subject identity (commit, tree, diff hash, contract digest, source Attempt), producer identity, verifier identity + independence result, integrity (hash/signature), validity conditions (currentness), provenance chain (in-toto/SLSA-compatible statement; OTel trace refs).
- Evidence states: Missing · Pending · Current · Stale · Conflicting · Superseded (authored in the Evidence spec; aligned with Guide ch27 and MC docs).
- Evidence kinds: test results, execution logs, diffs, screenshots, trace ids, code review output, security scan results, evaluation scores, provenance records, runtime metadata, model identity, tool-call receipts, deployment checks, approvals.
- Never borrow proof from another Attempt, candidate, PR head, Work Order revision, verifier, or policy.

---

## 11. Authority model and human-in-the-loop

Capability ≠ Permission ≠ Authority. Capability = can act; Permission = allowed to invoke; Authority = the delegated right to make a consequence real.

| Actor | May |
|---|---|
| Agent | propose (candidates, plans, learning signals) |
| Factory | execute bounded work under an admitted Execution Profile |
| Verifier | attest (independently) |
| Policy engine | authorize within delegated bounds; never widen them |
| Human | approve consequential decisions; retain override and restoration authority |
| Release system | promote exact accepted artifacts |

Risk-tiered autonomy:

| Tier | Execution | Verification | Approval |
|---|---|---|---|
| Low | Auto | Auto (deterministic) | Policy accepts |
| Medium | Auto | Independent verification required | Policy accepts within envelope |
| High | Auto | Independent verification | Human acceptance required |
| Critical | Human-authorized before execution | Independent + human review | Human acceptance + release authorization |

HITL spectrum (a maturity spectrum, not a binary): Human executes → Human reviews → Human approves → Human supervises → Human handles exceptions → Policy governs autonomously. Effective autonomy for any scope = min(factory, objective, work order, policy, trust level). Autonomy demotes immediately on evidence regression.

---

## 12. Governed learning

```
Executions · Failures · Retries · Verifications · Overrides · Cost · Latency · Incidents · Accepted/Rejected outcomes
   ↓ Learning Signal (attributable, reviewed)
   ↓ Evaluation dataset (regression cases, held-out, adversarial)
   ↓ Improvement Candidate (proposal: routing, skill, evaluator, policy, prompt, config)
   ↓ Candidate Factory Version → Qualify → Decision(promotion) → Active
```

Invariant: learning creates Improvement Candidates; it never mutates or activates production behavior. The learning subsystem is subject to the same policy, verification, and acceptance controls as the work the factory performs. Memory is not learning; model confidence is not evidence.

---

## 13. Maturity model (revised ladder; 11 dimensions preserved)

| Level | Name | Architecture | Autonomy | Governance | Verification | Organization | Metrics |
|---|---|---|---|---|---|---|---|
| L0 | Ad Hoc AI Use | Chat/IDE assistants | Human executes | None | Human review | Individuals | None retained |
| L1 | Assisted Development | Agents in IDE/CLI; no shared control | Human reviews every change | Team norms | Existing CI | Team-level | Anecdotal |
| L2 | Governed Agents | Bounded identities, permissions, sandboxes; evidence retained | Human approves; agents execute bounded tasks | Policy for tools/credentials/budget | CI + retained evidence | Named owners for agents and tools | Verified completion rate, review minutes |
| L3 | Orchestrated Delivery | Durable Plans, Work Orders, Attempts, leases, recovery; independent verification on ≥1 workflow | Human supervises; auto execute + independent verify (low/medium risk) | Delegated authority; risk tiers | Independent verifier attempts; currentness | Factory Owner + Verification Engineer roles | Cycle time, first-pass verification rate, cost per verified outcome |
| L4 | Qualified Factory | Immutable Factory Versions; qualification; evidence-bound acceptance; release controls; outcome measurement | Human handles exceptions; risk-tiered autonomy | Qualification standard; promotion decisions | Objective + release verification | Factory Engineers, Skill Authors, Tool Owners | Cost per accepted/released outcome, reopen & rollback rate |
| L5 | Factory Ecosystem | Many factories; shared control plane; three-level routing; registries; fleet operations; governed cross-factory learning | Policy governs autonomously within scopes; human at consequential boundaries | Enterprise identity, tenancy, audit, compliance | Cross-factory integration V&V; evaluation datasets | Factory Platform team; federated ownership | Fleet economics, verifier disagreement, escaped defects, observed business value |

Crosswalk from current names: L3 "Orchestrated Workflows" → Orchestrated Delivery; L4 "Verified Factory Lines" → Qualified Factory; L5 "Continuously Learning Factory" → Factory Ecosystem (governed learning becomes a required capability of L4–L5 rather than the ladder's name). The brief's alternative ladders (L0–L5 "AI Assistance…Learning Software Production System"; L0–L6 "Manual…Adaptive Autonomous Engineering") map onto this one; a 7-level ladder was rejected because "Agentic Tasks" and "Governed Agents" are not observably distinct capabilities. Scoring rule: overall level = min over hard-gate dimensions (Security, Verification, Governance), then floor(average) for the rest.

---

## 14. Terminology decisions (normative)

| Decision | Canonical | Retired / alias | Rationale |
|---|---|---|---|
| Spelling | **Work Order** (prose), `WorkOrder` (code) | "work order", "WorkOrder" in prose | Two words is the site's protocol spelling; code identifiers differ by convention |
| Human decision artifact | **Decision** (kinds) | "Approval" as artifact; "Acceptance" as separate artifact | One record type, typed kinds; resolves Approval/Acceptance/Human Authority drift |
| Learning | **Learning Signal → Improvement Candidate** | "Learning Proposal" (alias), "human-reviewed proposal" | Matches `system-design.ts` decision 06 |
| Verifier | **Verification Attempt** (a Verifier Attempt is an Attempt with role=verifier) | "Verification Run" (MC name) | One Attempt type with a role |
| Area 2 | **Execution** | "Harness" as an area name | Contains orchestrator/runtime/sandbox |
| Harness | **Harness** = Agent Harness (Coding/IDE specializations) | "AI harness", "inner/outer/meta-harness" (aliases with warning) | Per terminology review |
| Factory unit | **Factory** (specialized) | "factory line" (alias) | Multi-factory thesis |
| Intent | **Intent**; **Objective** = an Intent admitted for planning (routing level 1 operates on Objectives) | "Mission" (MC alias), "Goal" | One artifact; two roles |
| Factory Version lifecycle | §7.3 states | S14, S15 | One state machine |
| Lifecycle names | **Delivery Loop** (10) / **Factory Lifecycle** (8) | "runtime lifecycle", "outer/inner lifecycle" (allowed informally) | Distinct, memorable names |
| Stage 4/5 | **Assemble**, **Qualify** | "Build", "Validate" | Avoids Builder collision; qualification first-class |
| Human role | **Builder** (human only) | "Requester" (alias in glossary) | User direction; collision noted in glossary |
| Metrics | cost per **verified** / **accepted** / **released** outcome as three metrics | FDE renames | Decision 05 denominators |
| Services | **Factory Deployed Engineer (FDE)** | "Forward-Deployed" | Site decision; fix `guide.ts` |
| Canonical host | one host (recommend apex `fdlc.ai`), the other 308s | — | Host consolidation |

Five terms to own publicly (per landscape): Work Order · Evidence · Verification (vs Approval) · Factory Version · Control Plane (as authority). Everything else is reference vocabulary with crosswalks (harness ↔ OpenAI/Anthropic usage; capability ↔ skill/tool; evidence ↔ SLSA/in-toto/OTel).

---

## 15. Target information architecture (site)

```
/                         Home (category, promise, 4-step compression → 10-step loop, paths by role)
/in-5-minutes             The 10 questions (§16 of brief) — rewritten, visual
/start                    Learning paths by role (Executive, Eng Leader, Architect, Platform Eng, Builder, Security, Factory Engineer)
/glossary                 Canonical glossary (~120 terms, alias table, crosswalks)

/framework                The standard: definitions, two lifecycles, four views + reconciliation matrix, principles
/framework/delivery-loop  Ten steps, each with inputs/outputs/decision/evidence/failure modes
/framework/factory-lifecycle  Eight stages with entry/exit criteria, roles, templates
/framework/principles     Manifesto (10) + design principles (10)
/framework/maturity       Model + assessment tool (min-gated scoring)

/architecture             12 layers / 4 planes; six areas; areas × layers matrix; control boundary
/architecture/execution-vocabulary   20-term taxonomy + relationship chain + crosswalk to industry usage
/architecture/design-decisions       Six decisions (+ new ones)
/architecture/multi-factory          Objective planner, three-level routing, integration V&V
/architecture/factory-versioning     Composition, immutability, state machine, qualification standard
/architecture/verification           Independence, hierarchy, strategies, currentness
/architecture/evidence               Evidence model, binding, states
/architecture/authority              Capability/permission/authority; roles; risk tiers; HITL spectrum
/architecture/context                Retrieval → assembly → policy → reasoning; poisoning; provenance
/architecture/sandboxing             Isolation requirements
/architecture/observability          Trace model, spans, example traces
/architecture/economics              Cost model, denominators, routing by economics
/architecture/learning               Governed learning pipeline
/architecture/agents-skills-tools-harnesses   The distinction page + SDK placement
/architecture/builders               The Builder role and the engineering transformation

/enterprise               OPEN enterprise reference architecture (moved out of commercial page)
/enterprise/reference-architecture   30k / 10k / 500 repos / 50 factories worked architecture
/enterprise/identity-tenancy · /policy · /execution-fleet · /model-gateway · /audit-compliance · /operations (SLOs, DR, incidents) · /organization (roles, teams) · /adoption (Scope→Prove→Expand→Operate)
/services                 FDE engagement (commercial; renamed from /deploy; 301)

/specification            v1 index: artifact model, ID scheme, conformance tracks, versioning, governance
/specification/v1/<artifact>  19 pages: fields, states, invariants, JSON Schema, example, MC mapping
/specification/schemas/   Downloadable JSON Schemas + YAML examples
/specification/conformance  Criteria + checklist (suite roadmap)

/patterns · /patterns/<slug>          Pattern library (≥17)
/anti-patterns · /anti-patterns/<slug> Anti-pattern library (≥18)

/guides · /guides/<slug>  Build guides (10) with the 13-section template
/tutorials · /tutorials/<slug>  Mission Control-connected tutorials (15)
/examples · /examples/<factory>  Case-study factories (5+) with architecture, artifacts, evidence, governance
/mission-control          Reference implementation (capability ledger, admission model, worked flows)
/benchmarks               Measurement contract + annual "State of the AI Software Factory"
/compare                  Landscape: FDLC vs SDLC/ADLC/agent SDKs/platforms/standards (fair)
/essays                   Cornerstone articles
/project                  Governance, license, versioning, changelog, RFC process, roadmap, contributing
/about
/guide/*                  The book (microfrontend) — narrative & pedagogy; chapter zero maps to canon
```

Navigation (primary): Start · Framework · Architecture · Specification · Patterns · Guides · Enterprise · Mission Control · Guide. Secondary: Glossary, Compare, Essays, Benchmarks, Services, Project, About.

Page template (quality bar): What is it · Why it matters · How it works (diagram) · Components · Tradeoffs · Implementation (Mission Control mapping, status) · Governance · How you know it worked (evidence/metrics) · What can go wrong (anti-patterns) · How it scales · Related (patterns, spec, glossary).

---

## 16. Visual canon (diagram ids)

Every diagram has an id, a Mermaid source, and (for the 12 hero diagrams) an SVG. Ids: D01 What is an autonomous software factory · D02 Delivery Loop · D03 Factory Lifecycle · D04 Two loops relationship · D05 Composition hierarchy (Model→FDLC) · D06 Reference architecture (12 layers) · D07 Areas × layers matrix · D08 Control boundary (authority down / evidence back) · D09 Multi-factory orchestration · D10 Three-level routing · D11 Factory Version composition · D12 Factory Version state machine · D13 Qualification · D14 Evidence architecture (Claim→Authority) · D15 Verification hierarchy · D16 Authority model · D17 HITL / risk-tier matrix · D18 Builder experience · D19 Agent vs Skill vs Tool vs Harness vs Factory · D20 Local factory vs ecosystem · D21 Governed learning loop · D22 Economics (cost denominators) · D23 Observability trace (sequence) · D24 Maturity model · D25 Sandbox architecture · D26 Context/RAG architecture · D27 Work Order lifecycle (state machine) · D28 Objective dependency graph · D29 Production promotion pipeline · D30 Enterprise reference architecture · D31 Attempt/lease state machine · D32 Non-collapsible state boundary.

Colour semantics (consistent across all): Intent = blue, Control = slate, Execution = amber, Trust = green, Learning = violet, Human authority = red outline. Authority arrows solid downward; evidence arrows dashed upward.

---

## 17. Author style rules

1. Lead with the diagram or table; prose explains it.
2. Use the page template (§15). Every page ends with Related links (spec · pattern · anti-pattern · glossary · MC).
3. Mission Control references: cite the table/file and ledger status. Never "MC does X" without status.
4. Enterprise examples derive from MissionControlEnterprise only for the three real patterns (authorization ratchet, authn/authz separation with tenant-boundary qualification, execution-intent contract set); everything else is stated as FDLC requirement.
5. No pricing, no infrastructure identifiers, no unverified benchmark numbers.
6. Sentences short; no marketing adjectives; standards register ("MUST", "SHOULD", "MAY" in specs; plain imperative elsewhere).
7. British/American: American spelling.
8. Each page ≤ 2,500 words unless it is a reference page; split otherwise.

---

## 18. Errata and decisions from Wave 1 authoring (normative)

1. **Instance id scheme (final)**: `INT-104` · `SPEC-104-r1` · `PLAN-104-r2` · `WO-104-01` · `CTX-104-01` · `FV-depmod-1.0` · `EP-depmod-1.0-prod` · `QR-depmod-1.0-01` · `ATT-104-01-p1` (producer) / `ATT-104-01-v1` (verifier) · `CAND-104-01-01` · `EV-104-09` · `VER-104-01` · `DEC-104-03` (kind in parentheses when shown) · `REL-104-01` · `OUT-104-01` · `LS-104-01` · `IC-104-01`. Lower-case revision suffix `-rN`. Site data (`dependency-modernization-example.ts`: `SPEC-104-R1`, `EVD-`, `APR-`) is to be re-keyed.
2. **Conformance floor**: conformance levels start at FDLC-L2 (L0–L1 are pre-factory). §6.1 wording "all Level-1 capabilities" is superseded.
3. **Evidence states**: six canonical states stand. `REVOKED` (MC/Guide) maps to STALE with `invalidatedBy`; `REJECTED` maps to MISSING with reason.
4. **`/start` collision**: `/start` becomes the learning-paths page. The Factory Definition builder moves to `/tools/factory-definition` (nav: under Guides/Tools), linked from the Define stage.
5. **Operating shift 03** is restated: "The control plane becomes the control boundary." (The Harness enforces locally; authority is in the control plane.)
6. **`/architecture/transformation`** is an accepted page (engineering transformation); `/architecture/builders` covers the role. Both link to `/enterprise/organization`.
7. **Diagram D33** = Incident Command lifecycle (added to the visual canon).
8. **Work Order `ROUTED` state** and **Intent `ADMITTED` state** are canonical in the spec (make Route and Admission observable); recorded as divergences from Mission Control.
9. **Composition digest**: SHA-256 over JCS-canonicalized manifest. MC's FNV-1a is a divergence.
10. **Policy acceptance** for LOW/MEDIUM risk tiers is permitted by the spec; MC's `workOrders.accept` is human-only (MC stricter; spec allows policy acceptance only inside a delegated envelope with a server-authorized Decision).
11. **Logical route names** (`architecture-reasoning`, `implementation-workhorse`, `transformation-small`, `verification-independent`) are the canonical example route taxonomy.
12. **Pattern pages** end with "Related Patterns / Related Anti-patterns / Specification references" (accepted variant of `## Related`).
13. **Ratchet figures** for MCE: cite 624 → 184 (main baseline → enterprise baseline) and note MCE's own 637 → 184 branch history.
14. **Mission Control self-assessment**: overall FDLC-L2 (Intent L3, Execution L2, Trust L3, Learning L3) — use this consistently wherever MC conformance is stated.
15. `convex/traces.ts` does not exist; observability lives in `convex/observability.ts` and `convex/lib/observabilityPersistence.ts`. Governed MCP broker lives in `apps/orchestration-server/src/governedMcpBroker.ts` + `convex/lib/governedMcp.ts`.
