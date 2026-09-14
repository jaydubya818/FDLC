---
title: Glossary
description: The canonical FDLC vocabulary — about 120 terms with definitions, families, related terms, and Mission Control names — plus the alias table and the crosswalk to industry usage.
path: /glossary
audience: [executive, leader, architect, platform, builder, security, factory-engineer]
level: [beginner, practitioner, architect, enterprise, expert]
status: draft
related: [/framework, /framework/delivery-loop, /framework/factory-lifecycle, /architecture/agents-skills-tools-harnesses, /architecture/execution-vocabulary, /specification, /compare, /mission-control]
diagrams: []
mc_refs: [convex/schema.ts, data/execution-taxonomy.ts, data/mission-control.ts]
---

# Glossary

## How to use it

Terms are canonical as written here. Capitalized terms (Work Order, Factory Version, Decision) are artifacts, roles, or named structures; lower-case terms are concepts. **Family** uses the artifact families (A Intent, B Factory, C Execution, D Trust, E Learning) or an area (Lifecycle, Architecture, Role, Maturity, Governance). **Mission Control name** is given only where the reference implementation uses a different word. If you meet a word that is not here, check the [alias table](#alias-table) before using it; if it is not there either, it is not FDLC vocabulary.

Spelling rules: **Work Order** in prose, `WorkOrder` in code. American spelling throughout.

## Terms

| Term | Definition | Family / area | Related | Mission Control name |
|---|---|---|---|---|
| **Acceptance** | A Decision of kind `acceptance`: the authorized determination that a verified Candidate may proceed. The unit of acceptance is the Work Order. | D Trust | Decision, Approve, Verification | `workOrders.accept`, `approvalDecisions` |
| **Adoption Path** | The organizational sequence Scope → Prove → Expand → Operate for introducing factories. Not a lifecycle. | Governance | Factory Lifecycle, Maturity | — |
| **Ad Hoc AI Use (L0)** | Maturity level 0: chat and IDE assistants used by individuals with no shared process or retained evidence. | Maturity | Maturity model | — |
| **Admission** | The control-plane check that a unit (Intent, Attempt, worker) is well-formed, authorized, and within scope before it may proceed. | D Trust | Receive, Execute, Execution Profile | worker admission, readiness |
| **Agent** | A reasoning loop capable of acting toward a goal: model intelligence plus goal, instructions, context, working state, and capabilities. A worker inside a factory; never the factory. | Architecture (L5) | Agent Loop, Harness, Coding Agent | agent templates / versions / instances |
| **Agent Definition** | The versioned capability contract for an Agent: purpose, eligible task classes, instructions by digest, model requirements, skills, tool grants and denials, context policy, budgets, stop conditions, owner. Never a credential. | B Factory | Agent, Capability Manifest | `agentTemplates`, `agentTemplateVersions` |
| **Agent Harness** | See Harness. | Architecture (L5) | Harness | harness manifest |
| **Agent Loop** | The iteration cycle of one agent: load → select → act → observe → evaluate → replan → stop. Runs inside one Work Graph node. | Architecture (L5) | Agent, Harness, Loop Engineering | — |
| **Agentic SDK** | A vendor or open toolkit used to implement an agent or harness (agent classes, runners, tool wrappers, handoffs, guardrails, sessions, tracing). An implementation choice inside L5; FDLC sits above SDK choice. | Architecture (L5) | Harness, Agent, Factory Version | — |
| **Agentic System** | Any system in which agents act toward goals with tools. A factory is an agentic system with governance, verification, and evidence; not every agentic system is a factory. | Architecture | Factory, Coding Agent | — |
| **Approve (step 7)** | Delivery Loop step: may this consequence proceed? Produces a Decision of kind acceptance by human or policy authority at the risk tier. | Lifecycle | Decision, Risk tier | Human Acceptance |
| **Assemble (stage 4)** | Factory Lifecycle stage: compose and build the exact composition into a candidate Factory Version with a content-addressed manifest. | Lifecycle | Factory Version, Capability lifecycle | `factoryDefinitionVersions` |
| **Assisted Development (L1)** | Maturity level 1: agents in IDE or CLI with no shared control; a human reviews every change. | Maturity | Maturity model | — |
| **Attempt** | One immutable execution of a Task under a fenced lease and frozen execution manifest. Retries create new Attempts. Has a role: producer or verifier. | C Execution | Task, Lease, Candidate, Verification Attempt | `workflowRuns` |
| **Authority** | The delegated right to make a consequence real. Distinct from capability (can act) and permission (allowed to invoke). Held by the control plane; delegated to humans and policy; never inferred from capability. | D Trust | Control Plane, Decision, Capability | — |
| **Autonomous Software Factory** | See Factory (AI Software Factory). | Architecture | Factory | — |
| **Builder** | A human who defines what should be accomplished and holds accountability for the outcome. May be an engineer, QA, security, architect, product manager, or domain expert. Never an agent. | Role | Intent, Decision | Mission owner |
| **Candidate** | The exact output of a producer Attempt, identified by commit + tree + diff hash + contract digest + source Attempt. Unpublished until permitted. | C Execution | Attempt, Verification Subject, Evidence | `verificationSubject` on `workflowRuns`; Unpublished Candidate |
| **Capability** | A stable, provider-independent operation ("run tests", "open PR"). Realized by a Capability Implementation. | Architecture | Capability Implementation, Capability Registry | — |
| **Capability Implementation** | The exact tool, skill, model, or adapter version that realizes a Capability, with permissions and evidence. | Architecture | Capability, Capability Manifest | — |
| **Capability lifecycle** | Author → Package → Evaluate → Admit → Activate → Observe → Compare → Promote / Roll back → Improve. A sub-lifecycle of Assemble, Qualify, and Improve. | Lifecycle | Capability Manifest, Skill, Tool | — |
| **Capability Manifest** | Registry entry for a Capability Implementation. Kinds: agent, skill, tool, model-route, harness, verifier, context-source. Carries identity, version, permissions, qualification, evidence, deprecation. | B Factory | Capability Registry, Skill Manifest, Tool Manifest | `modelCatalog`, `mcpToolVersions`, `contextPackageVersions`, harness manifests |
| **Capability Registry** | The control-plane registry of Capability Manifests with qualification scopes. | Architecture (L3) | Factory Registry | — |
| **Capability Router** | The level-3 router inside a factory: selects model route, skill, tool, runtime, sandbox, and provider for one Task. | Architecture (L4) | Routing | model routing, context router |
| **Coding Agent** | A reasoning loop that generates or modifies software using a model, tools, and context. A worker inside a factory; not a factory. | Architecture | Agent, Coding Harness | — |
| **Coding Harness** | A Harness specialized for software engineering: code, shell, compiler, test, package, Git, diagnostic, and artifact workflows. | Architecture (L5) | Harness, IDE Harness | Codex adapter, Fab |
| **Conformance tracks** | The four groups of Factory Conformance Criteria — Intent, Execution, Trust, Learning — with the maturity level at which each capability is required. | Governance | Maturity model, Specification | — |
| **Context Package** | The frozen, digested, authorized set of context supplied to an Attempt, with provenance and freshness. Advisory: never evidence, never authority. | C Execution | Context policy, Attempt | `factoryContextPackages` |
| **Context policy** | The rules for which sources may be retrieved, how fresh they must be, who may see them, and how they are assembled into a Context Package. | Architecture (L6) | Context Package | context router |
| **Continuous controls** | Govern · Secure · Observe · Measure — the four controls spanning every Factory Lifecycle stage. | Lifecycle | Factory Lifecycle | — |
| **Control Plane** | The durable system of record that holds authority: identity, delegated authority, policy, budgets, routing, state, registries, evidence requirements, decisions, emergency control. Authority flows down from it; evidence flows back. | Architecture (L3) | Authority, Factory Platform | Mission Control (Convex authoritative state) |
| **Cost per verified / accepted / released outcome** | Three metrics with three denominators: total cohort cost (including failed work and retries) divided by independently verified, accepted, or released outcomes. Missing cost is never zero; report coverage. | Governance | Measurement contract | inference accounting (`MEASURED / ESTIMATED / UNKNOWN`) |
| **Currentness** | The condition that evidence binds to an exact subject and its validity conditions still hold. Newest candidate plus newest exact-bound verification decide; a moved pull-request head invalidates eligibility. | D Trust | Evidence, Verification | `verificationCurrentness` |
| **Decision** | An attributable, reasoned, authorized decision record. Kinds: `plan-approval`, `routing`, `admission`, `acceptance`, `release-authorization`, `promotion`, `restoration`, `exception`. Human or policy actor; always server-authorized. Replaces "Approval" as an artifact. | D Trust | Approve, Authority | `approvalDecisions`, `workOrders.accept`, routing decisions, permits |
| **Decision packet** | The compact input to a Decision: requested outcome, material changes, affected systems, risk, evidence and gaps, alternatives, rollout, rollback, and the exact decision required. Leads with surprises. | D Trust | Decision, Approve | required actions / approvals (partial) |
| **Define (stage 2)** | Factory Lifecycle stage: state the outcome contract, risk class, authority, and acceptance criteria as the definition part of the Factory Manifest. | Lifecycle | Factory Manifest | `factoryDefinitions` |
| **Delivery Loop** | The Autonomous Software Delivery Loop, FDLC's inner lifecycle: Receive → Specify → Plan → Route → Execute → Verify → Approve → Release → Observe → Learn. Runs inside an Active Factory Version. | Lifecycle | Factory Lifecycle | — |
| **Deploy (stage 6)** | Factory Lifecycle stage: promote the exact qualified Factory Version into an environment with a rollback target. Deploy promotes a factory; Release promotes software. | Lifecycle | Factory Version, Promotion | `activate` |
| **Deprecated / Retired** | Terminal Factory Version states: no longer routable; retained for audit. | B Factory | Factory Version state machine | — |
| **Design (stage 3)** | Factory Lifecycle stage: design the Work Graph, capabilities, routing, context policy, verification contract, sandbox policy, and economics; completes the Factory Manifest. | Lifecycle | Factory Manifest, Verification contract | — |
| **Design principles** | The ten foundational statements (canon §1.3): "Models reason. Control planes govern." through "Optimize for cost per accepted outcome." | Governance | Manifesto | — |
| **Discover (stage 1)** | Factory Lifecycle stage: find work worth turning into a factory and establish the baseline; output is an opportunity record. | Lifecycle | Opportunity record | — |
| **Effective autonomy** | For any scope, min(factory, objective, work order, policy, trust level). Demotes immediately on evidence regression. | Governance | HITL spectrum, Risk tier | not implemented (Planned) |
| **Evidence** | Durable, attributable record of what was authorized, executed, observed, verified, or decided — bound to an exact subject with provenance, integrity, and validity conditions. Proves what ran, not that it is correct. | C Execution | Verification, Currentness, Evidence states | `evidenceEnvelopes`, `runArtifacts`, `verificationReceipts` |
| **Evidence states** | Missing · Pending · Current · Stale · Conflicting · Superseded. Only Current evidence on the exact subject can satisfy a mandatory check. | D Trust | Evidence, Currentness | receipt validity / invalidation |
| **Execute (step 5)** | Delivery Loop step: what exactly ran? Produces Context Package, Attempt, Candidate, and Evidence under a fenced lease. | Lifecycle | Attempt, Harness | `workflowRuns` |
| **Execution (area)** | Responsibility area 2 (renamed from "Harness"): make execution durable, bounded, isolated, observable, recoverable. Contains Orchestrator, Harness, Runtime, Sandbox. | Architecture | Harness, Runtime, Sandbox | — |
| **Execution environment** | Layer L7: runtime, sandboxes, compute, network, credentials, artifact extraction. | Architecture (L7) | Runtime, Sandbox | — |
| **Execution manifest** | The frozen per-Attempt record of exact identities (model route, agent, harness, skills, tools, context, sandbox, policy) with a digest. The Execution Profile as admitted for one Attempt. | C Execution | Execution Profile, Attempt | `workflowRuns.executionManifest` |
| **Execution Profile** | The admitted per-Attempt composition: which Model, Agent, Harness, Work Graph, Runtime, Sandbox, Capability Implementations, and policy identities apply, plus autonomy ceiling and resource limits. States: DISABLED → OFFLINE_ELIGIBLE / PRODUCTION_PILOT_ELIGIBLE → REVOKED. | B Factory | Factory Version, Route | `factoryExecutionProfiles` |
| **Factory (AI Software Factory)** | A governed production system that converts intent into independently verified software outcomes, composing agents, models, skills, tools, context, harnesses, execution environments, verification, evidence, policy, human authority, delivery, and learning under a control plane. More durable than any model, agent, or harness inside it. | Architecture | Factory Version, Specialized factory | `factoryDefinitions` |
| **AI-FDE (AI Factory Deployed Engineer)** | The evidence-driven product that turns enterprise source evidence and reviewed claims into a versioned Factory Definition and typed Mission Control handoff material. It does not own runtime qualification or execution. | Product | Factory Definition, Factory Deployed Engineer, Mission Control | Internal alpha |
| **Factory Deployed Engineer (FDE)** | The accountable human role that owns architecture, judgment, authority, adoption, and outcomes while using AI-FDE. | Role | AI-FDE, Factory Lifecycle | — |
| **Factory Development Lifecycle (FDLC)** | The lifecycle, architecture, vocabulary, artifact model, governance model, and learning model for designing, assembling, qualifying, operating, and continuously improving autonomous AI software factories. | Governance | Factory Lifecycle, Delivery Loop | — |
| **Factory Ecosystem** | Many specialized factories coordinated through one enterprise control plane with shared identity, policy, routing, verification, evidence, observability, and organizational authority. Also maturity level L5. | Architecture; Maturity | Factory Platform, Objective Planner | Planned |
| **Factory Engineer** | The role that designs, assembles, and qualifies Factory Versions. | Role | Factory Lifecycle | — |
| **Factory Lifecycle** | The Factory Development Lifecycle proper, FDLC's outer lifecycle: Discover → Define → Design → Assemble → Qualify → Deploy → Operate → Improve. | Lifecycle | Delivery Loop | — |
| **Factory Manifest** | The declarative definition of a factory: identity, capabilities, inputs/outputs, planner, execution profiles, models, skills, tools, context sources, runtime, sandbox, network/credential policy, verification, evidence, approval policy, risk class, observability, economics, qualification, release policy. | B Factory | Factory Version, Define, Design | `factoryDefinitions` |
| **Factory Owner** | The role accountable for a factory's outcome contract, scope, risk class, and promotion decisions. | Role | Decision (promotion) | — |
| **Factory Platform** | Shared enterprise foundation many factories reuse: control plane, registries, execution, evidence, evaluation. The infrastructure under a Factory Ecosystem. | Architecture | Factory Ecosystem | — |
| **Factory Registry** | The control-plane registry of factories and their qualified versions with scopes. | Architecture (L3) | Capability Registry, Routing | Planned |
| **Factory Router** | The level-2 router: selects the qualified Factory Version and Execution Profile for a Work Order. | Architecture (L4) | Routing | `executionRouting` (repository-scoped) |
| **Factory Version** | Immutable, content-addressed composition of exact identities (planner, agent definitions, harness versions, skills, tools, model routes, runtime artifact, sandbox image, context config, verification config, approval requirements, policy bundle). Qualified per scope; activated per environment. `FV-<factory>-<semver>`. | B Factory | Qualification Record, Execution Profile | `factoryDefinitionVersions` + readiness |
| **Factory Version state machine** | Draft → Candidate → Qualified(scope) → Active(env) → Deprecated → Retired, with Rejected, Restricted, and Suspended side states. | B Factory | Factory Version, Promotion, Restoration | — |
| **Fail closed** | The rule that a hard gate with missing or unknown evidence, or a hard budget with unknown cost, fails. | D Trust | Evidence, Routing | Work Order governance |
| **Fenced lease** | The atomic, generation-numbered claim under which one worker executes one Attempt; a stale fence can report but cannot mutate. | C Execution | Attempt, Runtime | `workflowRuns.lease` |
| **Governed Agents (L2)** | Maturity level 2: bounded identities, permissions, sandboxes; evidence retained; human approves. The lowest conformance level. | Maturity | Conformance tracks | — |
| **Governed learning** | The pipeline Learning Signal → evaluation dataset → Improvement Candidate → candidate Factory Version → Qualify → promotion Decision. Learning never mutates production. | E Learning | Improve, Improvement Candidate | `factoryLearning` |
| **Graph Engineering** | The discipline of designing the Work Graph: dependencies, branches, joins, gates, retries, terminal states. | Architecture | Work Graph, Orchestrator | — |
| **Harness (Agent Harness)** | The runtime envelope that controls the agent loop and connects models, tools, context, policy, state, budgets, recovery, telemetry, and stopping. Bounds one agent. Enforces locally; never holds enterprise authority. Coding Harness and IDE Harness are specializations. | Architecture (L5) | Agent Loop, Control Plane, Harness Engineering | harness manifest, harness adapter |
| **Harness Engineering** | The discipline of improving how an agent may operate while leaving enterprise authority in the Control Plane. | Architecture | Harness | — |
| **HITL spectrum** | Human executes → Human reviews → Human approves → Human supervises → Human handles exceptions → Policy governs autonomously. A maturity spectrum, not a binary. | Governance | Effective autonomy, Risk tier | — |
| **Human authority** | The actor that approves consequential decisions and retains override and restoration authority. Exercised through Decisions. | D Trust | Decision, Builder, Factory Owner | Human Authority |
| **IDE Harness** | An editor-integrated Coding Harness that may use open files, selections, diagnostics, terminal, Git, and approval state. An IDE alone is not a Harness. | Architecture (L5) | Coding Harness | — |
| **Improve (stage 8)** | Factory Lifecycle stage: turn Learning Signals into Improvement Candidates and, through Qualify and Deploy, into the next Factory Version. Never mutates an active version. | Lifecycle | Improvement Candidate | `metaLoopSuggestions` → Mission Plan |
| **Improvement Candidate** | A proposed factory change (routing, skill, evaluator, policy, prompt, config) with regression cases and expected effect; enters Qualify as a candidate Factory Version. `IC-…`. | E Learning | Learning Signal, Qualify | `metaLoopSuggestions`; Learning Proposal |
| **Independence (verifier)** | Proven by lineage (separate Attempt, lease, worktree, invocation) and by standard (verifier did not rely on artifacts the candidate could shape; candidate did not modify files that determine its verdict). | D Trust | Verification Attempt | `verificationIndependence` |
| **Intent** | The requested outcome: goal, constraints, owner, risk, stop condition, budget. Produced by Receive. An Intent admitted for planning is the Objective of its Plan. `INT-…`. | A Intent | Objective, Specification, Builder | `missions`; Mission |
| **Learn (step 10)** | Delivery Loop step: what should change in the factory? Produces a Learning Signal and Improvement Candidate; proposal only. | Lifecycle | Learning Signal | `learningSignals` |
| **Learning Signal** | An attributable, reviewed signal from executions, failures, retries, verifications, overrides, cost, incidents, outcomes. `LS-…`. | E Learning | Improvement Candidate | `learningSignals`, `learningSignalClusters` |
| **Lease** | See Fenced lease. | C Execution | Attempt | — |
| **Local Factory** | A factory scoped to one repository, product, domain, or bounded context with an embedded or single-tenant control plane and level 2–3 routing. | Architecture | Factory Ecosystem | — |
| **Loop Engineering** | The discipline of improving one agent's Agent Loop: choosing, evaluating, replanning, stopping. | Architecture | Agent Loop | Loop Engineering records |
| **Manifesto** | The ten FDLC governance principles, each with explanation and implication. | Governance | Design principles | — |
| **Maturity model** | The L0–L5 ladder (Ad Hoc AI Use, Assisted Development, Governed Agents, Orchestrated Delivery, Qualified Factory, Factory Ecosystem) on six facets, assessed on eleven dimensions with min-gated scoring. | Maturity | Conformance tracks | — |
| **Measurement contract** | The declared start event, stop event, evidence, exclusions, denominators, qualifying events, and windows for each metric, fixed before data exists. | Governance | Outcome, Observe | outcome projections |
| **Mission Control** | The open-source FDLC reference implementation: a control plane demonstrating governed Plans, Work Orders, Attempts, evidence, verification, and human acceptance with capability boundaries visible. Not the definition of FDLC. | Ecosystem | Control Plane | — |
| **Model** | An inference resource that supplies reasoning or generation. Replaceable; never the worker or the authority. | Architecture (L5) | Model route | `modelCatalog` |
| **Model route** | A logical route ("workhorse-implementation", "independent-verifier") resolved to qualified providers by policy, quality, latency, and cost. | Architecture (L5) | Model, Routing | `factory-model-route/v2` |
| **Model Platform Team** | The role that operates the model gateway, logical routes, provider qualification, and cost and quota policy. | Role | Model route | — |
| **Objective** | An Intent admitted for planning; the unit that level-1 routing operates on and that objective-level verification integrates. | A Intent | Intent, Objective Planner | Mission |
| **Objective Planner** | The control-plane component that performs level-1 routing: which factories an Objective needs and the dependency graph across Work Orders. | Architecture (L4) | Routing, Factory Ecosystem | Planned |
| **Observe (step 9)** | Delivery Loop step: did the intended result hold in reality? Produces an Outcome over an observation window. | Lifecycle | Outcome, Measurement contract | production feedback (Experimental) |
| **Operate (stage 7)** | Factory Lifecycle stage: run the Delivery Loop durably; manage exceptions, incidents, capacity, cost. | Lifecycle | Delivery Loop, Incident | `factoryIncidents` |
| **Opportunity record** | The output of Discover: workload class, baseline cost, cycle time, defect rate, human effort, owner, stop condition. | B Factory (proposed) | Discover | — |
| **Orchestrated Delivery (L3)** | Maturity level 3: durable Plans, Work Orders, Attempts, leases, recovery; independent verification on at least one workflow. | Maturity | Maturity model | — |
| **Orchestrator** | Durable coordinator that advances the Work Graph across agents, deterministic steps, and human waits. Part of the factory; not a harness. | Architecture (L4) | Work Graph, Harness | orchestration server |
| **Outcome** | The observed technical, operational, and business result over an observation window, attributed to the release and its cost cohort. `OUT-…`. | D Trust | Observe, Release | outcome records |
| **Plan** | Governed, versioned decomposition: Work Graph, Work Orders, verification strategy, dependencies, budgets, decision points. Approval binds one exact revision. `PLAN-…-r2`. | A Intent | Work Order, Plan Approval | `missionPlans` |
| **Plan (step 3)** | Delivery Loop step: how will the factory achieve it? | Lifecycle | Plan | `missionPlanning` |
| **Plan Approval** | A Decision of kind `plan-approval` binding one exact Plan revision. Releases Work Orders; does not dispatch them. | D Trust | Plan, Decision | plan approval |
| **Platform Engineer** | The role that operates the control plane, registries, runtime, sandboxes, evidence services, and SLOs. | Role | Factory Platform | — |
| **Policy engine** | The component that authorizes within delegated bounds and never widens them; evaluates risk tiers, grants, budgets. | Architecture (L3) | Authority, Decision | `governancePolicies`, `policyEnvelopes` |
| **Policy Owner** | The role accountable for risk tiers, approval policy, credential and network policy, and exceptions. | Role | Decision (exception) | — |
| **Producer Attempt** | An Attempt with role producer: it creates a Candidate. Never its own verifier. | C Execution | Attempt, Verification Attempt | Producer Attempt |
| **Promotion** | A Decision of kind `promotion` moving a Factory Version from Qualified to Active with a current Qualification Record. | D Trust | Deploy, Factory Version state machine | `activate` |
| **Qualification** | The evidence-backed determination that a Factory Version or Capability meets the Qualification Standard for a declared scope (workload class × environment × risk tier × autonomy level). Fail closed. | B Factory | Qualification Record, Qualify | readiness (subset) |
| **Qualification Record** | The record of a qualification: scope, per-dimension evidence, expiry, revocation conditions. `QR-…`. | B Factory | Factory Version | `factoryReadinessAssessments` (readiness only) |
| **Qualification Standard** | The dimensions a qualification must cover: functional correctness, task success, regression, security, sandbox isolation, policy compliance, tool permissions, credential handling, unsupported actions, model-route compatibility, cost, latency, reliability, determinism where required, evidence completeness, recovery, failure behavior, observability coverage. | B Factory | Qualification | — |
| **Qualified Factory (L4)** | Maturity level 4: immutable Factory Versions, qualification, evidence-bound acceptance, release controls, outcome measurement. | Maturity | Maturity model | — |
| **Qualify (stage 5)** | Factory Lifecycle stage: evaluate and qualify the Factory Version for a declared scope; Evaluate is the activity inside it. | Lifecycle | Qualification Record | `factoryReadinessAssessments`, eval control plane |
| **Quality Gate** | The deterministic aggregation of required verification results into eligible, blocked, or needs-human-judgment. Establishes eligibility, not acceptance. | D Trust | Verification, Currentness | `qualityGateDecisions` |
| **Receive (step 1)** | Delivery Loop step: what outcome matters? Produces an Intent under an admission decision. | Lifecycle | Intent | `missions` |
| **Release** | Promotion of an exact accepted artifact into an environment with current policy, rollout scope, and rollback readiness. `REL-…`. Also Delivery Loop step 8. | D Trust | Release authorization, Deploy | `factoryReleases` (Experimental); publication |
| **Release authorization** | A Decision of kind `release-authorization` permitting a Release; publication permits are its mechanism. | D Trust | Release, Decision | permits, `authorizePublication` |
| **Restoration** | A Decision of kind `restoration` returning a Suspended Factory Version to Active, or restoring dispatch after an incident. Separately authorized from the pause. | D Trust | Factory Version state machine, Incident | `factoryIncident` restoration |
| **Restricted / Suspended** | Factory Version side states: scope narrowed after regression; execution paused for incident containment. | B Factory | Factory Version state machine | — |
| **Risk tier** | Low · Medium · High · Critical. Selects execution, verification, and approval requirements. | Governance | Effective autonomy, Approve | Green / Yellow / Red |
| **Route (step 4)** | Delivery Loop step: which factory, version, profile, and resources may do this work? Produces a Routing Decision and a bound Work Order. Eligibility before ranking. | Lifecycle | Routing, Execution Profile | `executionRouting` |
| **Routing (three levels)** | Level 1 Objective routing (Objective → factory set; Objective Planner). Level 2 Work Order routing (Work Order → qualified Factory Version + Execution Profile; Factory Router). Level 3 Task routing (Task → model/skill/tool/runtime/sandbox; Capability Router). | Architecture (L4) | Route, Factory Router, Capability Router | model routing policies / decisions |
| **Runtime** | Execution substrate: process lifecycle, compute, queues, leases, persistence, resume, concurrency, recovery. Hosts execution. | Architecture (L7) | Sandbox, Harness | worker runtime |
| **Sandbox** | Isolation boundary: filesystem, process, network, credentials, dependencies, resources. Contains effects. | Architecture (L7) | Runtime | `factorySandboxProfiles`, Remote Sandbox |
| **Skill** | A reusable, versioned, domain-specific procedure or playbook loaded by the harness into an agent's context. May narrow how an agent works; never widens scope, data, tools, budget, or autonomy. | Architecture (L5) | Skill Manifest, Skill Author, Tool | `contextPackages` (skills / context registry) |
| **Skill Author** | The role that authors, evaluates, publishes, and deprecates skills. | Role | Skill | — |
| **Skill Manifest** | The Capability Manifest of kind skill: purpose, instructions, required context, allowed tools, typed inputs and outputs, examples, self-checks, evaluation suite, owner, version, digest. | B Factory | Skill, Capability Manifest | — |
| **Specialized factory** | A factory for one class of outcome (Code Generation, Code Review, Test Generation, Security Remediation, Dependency Upgrade, Migration, Modernization, Refactoring, Documentation, Infrastructure, Incident Remediation, Data Migration, Accessibility, Release). Created only when outcome semantics, ownership, qualification, governance, authority, or lifecycle materially differ. | Architecture | Factory, Factory Ecosystem | — |
| **Specification** | Immutable, versioned statement of what must be true: acceptance criteria, boundaries, verification requirements. Finalized ≠ approved. `SPEC-…-r1`. | A Intent | Intent, Plan, Specify | `missionSpecRevisions`; Mission Spec |
| **Specify (step 2)** | Delivery Loop step: what must be true? | Lifecycle | Specification | `missionSpecs` |
| **Task** | A bounded executable portion of an admitted Work Order; executed by Attempts. Completion does not accept the Work Order. | A Intent | Work Order, Attempt | `tasks` |
| **Tool** | A capability the agent may invoke (API, CLI, MCP operation) under a grant, governed by a Tool Manifest. Acts; does not decide. | Architecture (L5) | Tool Manifest, Tool Owner, Capability | `mcpToolVersions`, `mcpToolGrants` |
| **Tool Manifest** | The Capability Manifest of kind tool: contract, permissions, version, evidence, deprecation. | B Factory | Tool | `mcpToolVersions` |
| **Tool Owner** | The role that publishes, grants, and revokes tools. | Role | Tool | — |
| **Verification** | An independent Verification Attempt against a frozen Verification Subject and Plan, producing a Result and a Quality Gate decision. Judges whether evidence satisfies the specification. Makes work eligible; never accepts. `VER-…`. | D Trust | Verification Attempt, Quality Gate, Evidence | `verificationRuns`; Verification Run |
| **Verification Attempt** | An Attempt with role verifier: independent of the producer by lineage and by standard. | D Trust | Attempt, Independence | Verifier Attempt; Verification Run |
| **Verification contract** | The Factory Manifest section mapping each acceptance criterion to a verifier, independence rule, and currentness rule. | B Factory | Design, Verification | Quality Contract projection |
| **Verification Engineer** | The role accountable for the verification contract, verifier independence, evaluator calibration, and currentness rules. | Role | Verification | — |
| **Verification hierarchy** | Task verification → Work Order verification (unit of acceptance) → Objective / integration verification → Release verification. Factory qualification is the orthogonal axis. | D Trust | Verification | — |
| **Verification Plan** | The frozen plan of checks for one Verification Subject. | D Trust | Verification Subject | `verificationRuns.verificationPlan` |
| **Verification Subject** | The frozen identity and contract of exactly what a verifier evaluates: the Candidate identity plus contract digest. | D Trust | Candidate, Verification | `workflowRuns.verificationSubject` |
| **Verifier** | The actor role that attests independently; realized by Verification Attempts, deterministic checks, evaluators, or human review. | D Trust | Verification Attempt | — |
| **Verify (step 6)** | Delivery Loop step: does the evidence satisfy the specification? | Lifecycle | Verification | `verificationRuns` |
| **Work Graph** | The topology of work: nodes, dependencies, gates, joins, retries, terminal states. Advanced by the Orchestrator. | Architecture (L4) | Orchestrator, Graph Engineering, Plan | graph workflows |
| **Work Order** | The bounded, authorized unit of work: scope, risk class, authority envelope, verification contract, change budget, bound Factory Version + Execution Profile. Contains Tasks. The unit of acceptance. `WO-…-01`. Code spelling `WorkOrder`. | A Intent | Plan, Task, Route | `workOrders` |

## Alias table

Non-canonical terms and the canonical term to use instead. Terms marked *warning* are ambiguous in the wild; ask which boundary is meant.

| Non-canonical | Canonical | Note |
|---|---|---|
| Mission | Intent | Mission Control name; an Intent admitted for planning is an Objective |
| Mission Spec | Specification | Mission Control name |
| Goal | Intent | Guide usage |
| Requester, Owner (of an intent) | Builder | Human only |
| factory line, governed production line | Factory (specialized) | Retired synonym; each line is a specialized factory |
| Software Delivery Factory | Factory (specialized: Code Generation / broad default) | Enterprise page usage |
| Factory Definition (three site shapes) | Factory Manifest | Builder output, FDE twelve concerns, content-model shape unify here |
| Factory Configuration | Factory Version | Guide usage; "configuration digest" is its hash |
| Learning Proposal, human-reviewed proposal | Improvement Candidate | — |
| Approval (artifact), Acceptance (artifact), Human Authority (object) | Decision (kind: acceptance) | One record type with typed kinds; "human authority" remains the actor |
| Approved Plan | Plan + Decision (kind: plan-approval) | — |
| Release authority | Decision (kind: release-authorization) | — |
| Verification Run | Verification Attempt | Mission Control name; an Attempt with role verifier |
| Verifier Attempt | Verification Attempt | Mission Control name; acceptable informally |
| WorkflowRun | Attempt | Mission Control table name |
| Unpublished Candidate | Candidate | Mission Control name; all Candidates are unpublished until permitted |
| Evidence Envelope, receipt, receipt packet, forensic bundle, decision brief | Evidence (kinds) | Envelope and receipt are evidence containers; decision packet is the input to a Decision |
| Readiness | Qualification Record (readiness subset) | Mission Control's readiness checks identities and authorities, not behavior |
| WorkOrder (in prose), work order | Work Order | `WorkOrder` only in code |
| AI harness | Harness | *warning* — translate to Agent Harness, Coding Harness, Evaluation Harness, Runtime, Orchestrator, or Control Plane |
| inner harness | Agent Loop | *warning* |
| outer harness | Harness or Orchestrator | *warning* — depends on whether one agent or many are meant |
| meta-harness, meta-factory control plane | Control Plane | *warning* — the enterprise control plane |
| Harness (as an area name) | Execution (area) | The area contains Orchestrator, Runtime, Sandbox, which are not the Harness |
| Agent Factory | Capability Registry + Capability lifecycle | Guide term for the capability supply side |
| Forward-Deployed Engineer / Engineering | Factory Deployed Engineer (FDE), human role | Site decision |
| Factory Engineer, FDLC Deploy | AI-FDE, product | Product naming decision |
| runtime lifecycle, inner lifecycle, value stream | Delivery Loop | "inner loop" allowed informally |
| outer lifecycle | Factory Lifecycle | "outer loop" allowed informally |
| Define Agent (stage) | Route (step 4), mechanic: capability binding | Guide stage retired as a phase |
| Apply Skills (stage) | Execute (step 5), mechanic: skill application | Guide stage retired as a phase |
| Evaluate (stage) | Verify (step 6); Evaluate is the activity inside Qualify (stage 5) | Two different homes |
| Deliver Software (stage) | Approve (7) + Release (8) + Observe (9) | — |
| Validate (stage) | Qualify (stage 5) | Renamed; "validate" collided with verification |
| Build (stage) | Assemble (stage 4) | Renamed; avoids Builder collision |
| Develop → Qualify → Promote → Activate → Observe → Improve | Factory Version state machine | Replaced |
| Ad Hoc Prompting | Ad Hoc AI Use (L0) | Renamed |
| Orchestrated Workflows | Orchestrated Delivery (L3) | Renamed |
| Verified Factory Lines | Qualified Factory (L4) | Renamed |
| Continuously Learning Factory | Factory Ecosystem (L5) | Renamed; governed learning is required at L4–L5 |
| Factory Operational Autonomy Levels, Trust Score, trust band | Effective autonomy inputs (trust level) | Guide terms; scope-level controls, not maturity levels |
| cost per trusted outcome, cost per accepted WorkOrder | cost per verified / accepted / released outcome | Three named denominators |
| Human review / Human oversight / Human control | Human authority (actor); Human oversight (maturity dimension) | — |
| Quality Contract | Verification contract (in the Factory Manifest); Quality Contract projection (Mission Control) | — |

## Crosswalk to industry usage

How FDLC terms relate to words used by vendors, frameworks, and standards. "Align" means FDLC uses the industry noun with a stated scope; "differentiate" means FDLC owns a distinct term.

| FDLC term | Industry usage | Relationship |
|---|---|---|
| **Harness** | "Harness engineering" (repository-resident rules, linters, instruction files); session-spanning scaffolding around a coding agent; hook-based control layers; "the layer that runs an agent" | Align on the noun, narrow the scope: FDLC's Harness bounds one agent. Instruction files are Harness inputs; workflow coordination is the Orchestrator; policy and kill switches are the Control Plane. |
| **Control Plane** | Agent control planes (routing, MCP access, secrets, budgets, audit); platform control planes; governance toolkits | Align on the noun, differentiate on scope: FDLC's Control Plane is enterprise *authority* (authorize, revoke, approve, promote, release); runtime control is L4 and the Harness. |
| **Capability / Skill / Tool** | MCP tools and servers; skills (versioned instruction packages) and skills registries; function calling | Align. Capability = provider-independent operation; Capability Implementation = bound version. MCP standardizes connectivity, not identity, authorization, audit, or approval. |
| **Evidence** | SLSA provenance; in-toto attestations; OpenTelemetry traces; signed attestations; ISO 42001 records | Align. Evidence is attestation-shaped (in-toto/SLSA-compatible statement + OTel trace refs). Evidence proves what ran, not that it is correct; Verification judges. |
| **Verification vs Approval** | Review, evals, gates, human-in-the-loop; "agents cannot pass their own tests"; DORA's "verification tax" | Differentiate. Verification = does evidence satisfy the spec, independently. Approval = may this consequence proceed, by authority (Decision). Acceptance = the Work Order-level acceptance Decision. |
| **Work Order** | Issue, task, unit, bolt, work unit, mission, request/session | Differentiate — own it. A bounded, authorized, attributable unit with a verification contract and bound Factory Version. |
| **Factory Version** | Agent deployments with canary and approvals; SLSA build provenance; agent bills of materials | Differentiate — the most defensible object. A signed, content-addressed composition that can carry SLSA/in-toto provenance and an AgBOM. |
| **Execution Profile** | Steering files, instruction files, routing policies, staged-autonomy ladders ("observe → recommend → bounded write → governed authority") | Differentiate; align the autonomy dimension with staged-autonomy vocabulary. |
| **Qualification** | Evals; certification; conformance | Differentiate carefully. Qualification = evals + policy tests + recovery drills, recorded per scope with expiry. |
| **FDLC** | ADLC (Agent Development Lifecycle); AI-DLC; agentic SDLC; AI-native SDLC | Differentiate. ADLC = building agents. Agentic SDLC = how AI changes software development. FDLC = the lifecycle of the factory that builds software with governed agents; sits above both. |
| **AI Software Factory** | A vendor brand; "software factory" definitional content from platforms and internal programs; historical model-driven "software factories" | Align — cannot be owned. FDLC is the neutral lifecycle standard any factory can conform to. |
| **Builder** | Agent-builder products; app builders; "builder" as developer or community member | Scope narrowly: FDLC's Builder is the human who defines the what. Never the agent, never a product. |
| **Agent Loop / Loop Engineering / Work Graph** | "Loop engineering" in practitioner writing; graph-based orchestration frameworks; work-graph trackers | Align; cite as precedents. |
| **Mission Control** | Used informally for agent dashboards and "mission control for agents" | Risk of collision; always "Mission Control (FDLC reference implementation)" in external copy. |
| **Maturity model** | DORA capabilities; vendor maturity ladders; autonomy ladders (L0–L5 driving-style) | Align on the form; differentiate on facets: architecture, autonomy, governance, verification, organization, metrics, with min-gated scoring. |

## Related

- Framework: [/framework](/framework) · [/framework/delivery-loop](/framework/delivery-loop) · [/framework/factory-lifecycle](/framework/factory-lifecycle) · [/framework/principles](/framework/principles) · [/framework/maturity](/framework/maturity)
- Vocabulary pages: [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) · [/architecture/execution-vocabulary](/architecture/execution-vocabulary) · [/architecture/builders](/architecture/builders)
- Specification: [/specification](/specification) (artifact ids, JSON Schemas)
- Landscape: [/compare](/compare)
- Reference implementation: [/mission-control](/mission-control)
- The Guide's extended vocabulary (non-canonical): [/guide/glossary](/guide/glossary)
