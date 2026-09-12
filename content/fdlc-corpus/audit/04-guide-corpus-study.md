# 04 — Guide corpus study: `ai-software-factory-mastery`

Repo: `/home/claude/repos/ai-software-factory-mastery` (jaydubya818/ai-software-factory-mastery), served at
https://ai-software-factory-mastery.vercel.app and linked from https://fdlc.ai/guide as "The Guide — teaches FDLC".
Studied 2026-09-11, single-commit shallow clone at `b7109e5`. Nothing was modified.

---

## 1. Inventory

### 1.1 Size and shape

| Unit | Count | Words |
| --- | --- | --- |
| Chapters (`guide/01-understand` … `guide/06-improve`) | 44 | ~294,800 |
| Front matter (`guide/00-front-matter/`) | 2 | 2,639 |
| Stage briefs (`guide/stages/01…08`) | 8 | 7,377 (874–1,042 each) |
| Appendices (`guide/appendix/*.md` + `mission-control/` + `research/`) | 18 | ~68,000 (glossary alone 23,825) |
| Infographic PNGs (`guide/assets/infographics/`) | 187 | 184 slots referenced, 100 % have assets; 3 orphan PNGs (`harness-control-plane`, `inner-outer-harness`, `meta-harness`) |
| Archived v1 curriculum (`archive/guide-v1/`) | 81 files | 126,625 |
| Site (`site/`, Next.js 16 + Vinext, Vercel Microfrontends child) | — | 49 generated documents |

The chapter corpus is roughly a 900-page book. **No chapter is a stub.** The thinnest is Chapter 21 (1,665 words); the next are 24 (3,068), 28 (3,680), 30 (3,969), 16 (4,030). Everything else is 4,300–12,900 words. The heaviest are 42 (12,923), 38 (11,791), 7 (10,699), 5 (10,275), 13 (10,200).

### 1.2 Chapter table

| # | Title | Path | Words | Notes |
| --- | --- | --- | --- | --- |
| FM0 | How to read this guide | `guide/00-front-matter/00-how-to-read-this-guide.md` | 1,316 | Names the 8-stage stream + 6 areas as the two orientation models |
| FM1 | What this guide covers | `guide/00-front-matter/01-what-this-guide-covers.md` | 1,323 | Stage→chapter and area→chapter ownership map; "Recommended routes" (5 reader routes) |
| 1 | Why software engineering is changing | `guide/01-understand/01-…` | 4,934 | Definition, coding-agent-vs-factory table, 12 threshold capabilities, three measures |
| 2 | The factory in one view | `guide/01-understand/02-…` | 4,373 | Canonical models; labels every other diagram a "lens" |
| 3 | First principles: trust, evidence, authority | `guide/01-understand/03-…` | 5,158 | Autonomy Levels 0–5, effective autonomy = min(…), Trust Score, decision packet |
| 4 | The human–agent operating model | `guide/02-design/04-…` | 8,109 | Three parties (human/agent/deterministic), decision rights, daily rhythm |
| 5 | Authoritative records | `guide/02-design/05-…` | 10,275 | 12-record spine, companion records, 7 state machines, factory data model |
| 6 | Intent and specification engineering | `guide/02-design/06-…` | 6,763 | Mission Spec, Definition of Correct, task graph, plan admission |
| 7 | Governance, policy, risk-proportional approval | `guide/02-design/07-…` | 10,699 | Green/Yellow/Red, autonomy matrix, 10 control families, recipes |
| 8 | Economics, metrics, human attention | `guide/02-design/08-…` | 6,995 | Lead time / CFR / leverage; attention budget |
| 9 | Tokenomics and factory economics | `guide/02-design/09-…` | 5,041 | Split from 8 (same `absorbs:` list); links fdlc.ai/benchmarks |
| 10 | Multi-repository design | `guide/02-design/10-…` | 4,390 | Workspace manifests, coordinated change sets |
| 11 | The Agent Factory | `guide/03-build/11-…` | 8,206 | Capability supply chain, registries, Agent Definition |
| 12 | Skills as packages | `guide/03-build/12-…` | 5,031 | Split from 11; **unpinned 36-word "In Mission Control"** |
| 13 | Control plane, orchestrator, execution plane | `guide/03-build/13-…` | 10,200 | Component families, engine authority split, executor snapshot, 3 release clocks |
| 14 | Durable execution | `guide/03-build/14-…` | 5,813 | Task/Attempt, leases, fencing, idempotency, reliability vocabulary |
| 15 | Coding harnesses and agent protocols | `guide/03-build/15-…` | 5,624 | Boundary table uses "Canonical FDLC term" |
| 16 | Harness engineering | `guide/03-build/16-…` | 4,030 | Split from 15; inner/outer/meta loops, harness profiles, adapter admission; **unpinned IMC** |
| 17 | Environments, sandboxes, compute | `guide/03-build/17-…` | 7,444 | Isolation model, pets vs cattle, worker fleet |
| 18 | Agent architecture | `guide/03-build/18-…` | 9,023 | Loop, MCP gateway, tools, memory kinds |
| 19 | Data, knowledge, semantic engineering | `guide/03-build/19-…` | 6,391 | Ontology maturity L1–L5 |
| 20 | Context engineering | `guide/03-build/20-…` | 6,165 | Split from 19; Context CDL, CBOM, context firewall; **unpinned IMC**; internal precedence contradiction (see §6) |
| 21 | Models and capability selection | `guide/03-build/21-…` | 1,665 | **Thinnest chapter**; split from 22; self-referential "Go deeper"; unpinned IMC |
| 22 | Routing and the escalation ladder | `guide/03-build/22-…` | 7,002 | Escalation ladder, lanes, cache-aware routing, Pareto selection |
| 23 | Agent and loop engineering | `guide/03-build/23-…` | 6,448 | Least-agentic mechanism, topologies |
| 24 | Loop engineering patterns and defaults | `guide/03-build/24-…` | 3,068 | Split from 23; unpinned IMC |
| 25 | The 12-layer production AI agent stack | `guide/03-build/25-…` | 4,636 | Reference model; maps layers→chapters |
| 26 | Autonomous engineering workflows | `guide/03-build/26-…` | 8,827 | Repo onboarding, issue→PR wedge, workflow catalog |
| 27 | Quality and evidence architecture | `guide/04-prove/27-…` | 7,349 | Five records, six evidence states, verification contract, validate-the-validator |
| 28 | Testing strategy for agentic change | `guide/04-prove/28-…` | 3,680 | |
| 29 | Evaluation engineering | `guide/04-prove/29-…` | 7,019 | |
| 30 | Evals as factory assets | `guide/04-prove/30-…` | 3,969 | Split from 29; unpinned IMC |
| 31 | Quality contracts, proof packages, certificates | `guide/04-prove/31-…` | 7,737 | Only chapter with real schemas (YAML QC, envelope, certificate, API surface) |
| 32 | CI/CD, progressive delivery, production verification | `guide/04-prove/32-…` | 4,834 | |
| 33 | Security | `guide/04-prove/33-…` | 8,594 | Threat model, identity chain, supply chain, 7-layer security map |
| 34 | The factory as a platform | `guide/05-operate/34-…` | 6,209 | Golden paths, Factory Board, EOS shell, admission vs scheduling, cost ledger |
| 35 | Observability, telemetry, forensics | `guide/05-operate/35-…` | 5,697 | |
| 36 | Resilience, incidents, control tower | `guide/05-operate/36-…` | 6,410 | |
| 37 | Control surfaces, event contracts, storage | `guide/05-operate/37-…` | 6,858 | |
| 38 | Enterprise adoption and infrastructure landscape | `guide/05-operate/38-…` | 11,791 | Maturity 0–5, skills→loops→factory ladder, build/buy, tenancy, control checklist, dated vendor tables |
| 39 | Production feedback, review, agentic merge queue | `guide/06-improve/39-…` | 9,704 | |
| 40 | Governed learning | `guide/06-improve/40-…` | 4,816 | Learning chain, Improvement Candidate, 6 self-improvement levels; **unpinned 36-word IMC; self-referential Go deeper** |
| 41 | Meta-loops and the closed-loop factory | `guide/06-improve/41-…` | 8,633 | Split from 40; factory-as-code, adaptation ladder, promotion gate |
| 42 | Mission Control as a living case study | `guide/06-improve/42-…` | 12,923 | 1,315-word pinned IMC; master chain; 8 actors |
| 43 | Mastering the factory | `guide/06-improve/43-…` | 7,157 | Four fluency levels, 30/60/90, 12-month build |
| 44 | Where this is going | `guide/06-improve/44-…` | 4,329 | |

### 1.3 Stage briefs and appendices

- `guide/stages/01-builder-intent.md` … `08-deliver-software.md` — eight ~900-word "contract briefs" (Purpose / Inputs / What happens / Outputs / Governing decision / Required evidence / Common failure / In Mission Control / Retain this / Canonical chapters). Well-formed, pinned to MC commits. These are the closest thing the Guide has to a runtime-lifecycle spec.
- Appendices: `glossary.md` (654 entries, 33 marked 🔑 though the principles appendix promises "fifty"), `principles.md` (5,843 w; "Fifty concepts to have cold"), `execution-boundaries-and-terminology.md` (2,891 w; **explicitly written as FDLC canon** — "FDLC separates these concerns…", "FDLC ecosystem mapping: Mission Control and Fab"), `enterprise-multi-factory-delivery.md` (4,142 w; contains **commercial copy** — `mailto:support@fdlc.ai?subject=FDLC Enterprise pricing`, "FDLC Enterprise remains a proposed commercial offering"), `context-skills-engineering.md` (2,118 w; states "FDLC defines the responsibilities and evidence boundaries. The Guide explains the engineering decisions… Mission Control should implement the controls"), `factory-system-design-playbook.md`, `production-reliability-operations-playbook.md`, `architecture-communication.md` (7,263 w), `coverage-and-maturity.md`, `changelog.md`, `reviewer-guide.md`, `operator-surfaces.md`, `governed-factory-admission.md`, three `mission-control/0x-*.md` case studies plus one evidence folder (`mission-control/evidence/2026-08-08-golden-path/` with 5 PNG screenshots + manifest), `research/initial-canon.md`.

### 1.4 Thin or defective chapters

No chapter is under 800 words, but eight chapters are visibly the product of a mechanical split (identical `absorbs:` frontmatter to a sibling: 8/9, 11/12, 15/16, 19/20, 21/22, 23/24, 29/30, 40/41) and the split children carry template residue:

- **Unpinned "In Mission Control" sections** of 33–41 words with no commit hash: chapters 12, 16, 20, 21, 24, 30, 40. This violates the book's own honesty rule (`00-how-to-read-this-guide.md`: "pinned to a specific commit, and labelled implemented, partial, or future").
- **Templated 3-link "Go deeper"** ("…for the foundation this chapter builds on"): chapters 9, 12, 16, 20, 21, 24, 30, 40. Two are **self-referential** (21 links to 21; 40 links to 40).
- **Dangling cross-references** from the split: Chapter 41 opens "One published pattern makes the six levels concrete" but the six self-improvement levels live in Chapter 40; Chapter 41's Go deeper cites "[Chapter 16 — Coding harnesses and agent protocols]" (that is 15's title); Chapter 25 heads its Context Engineering layer "[Chapter 19]" while the context chapter is 20.
- `guide/appendix/coverage-and-maturity.md` still claims "Hands-on mastery — Thirteen executable specifications available"; `docs/plans/coverage-map.md` records that every v1 lab, whiteboard and design-review section was "dropped per template" with pointers to "appendix labs 01–11" — **no labs directory exists anywhere in `guide/`**. The claim is stale.

---

## 2. What was read

Fully: README, `guide/README.md`, both front-matter files, chapters 1, 2, 3, 5, 13, 14, 16, 20, 21, 22, 25, 27, 31, 33, 34, 38, 40, 41, 42 (§§ problem, layers, ownership, principles, three-factories, thesis, stack, maturity, failure modes), stage brief 4, appendices `context-skills-engineering`, `execution-boundaries-and-terminology`, `enterprise-multi-factory-delivery` (head), `coverage-and-maturity`, `principles` (fifty concepts), glossary (structure + ~120 targeted entries), `docs/editorial/concept-ownership-map.md`, `site/README.md`, `site/lib/paths.ts`, `site/lib/global-navigation.generated.ts`, `docs/NIGHTLY-BACKLOG.md`. Skimmed by heading: 4, 6, 7, 11, 12, 15, 17, 18, 23, 26, 35, 36, 37, 39, 43, 44.

---

## 3. Canonical terminology (Guide glossary + chapters)

Definitions below are condensed from `guide/appendix/glossary.md` unless a chapter is cited. Terms the task asked for that the Guide **does not define** are flagged.

| Term | Guide definition (condensed) | Owner |
| --- | --- | --- |
| **AI Software Factory** | Governed engineering operating model turning business intent into validated customer value through human accountability, agent execution, policy, independent validation, evidence, feedback. Larger than a coding tool or agent runtime. | Ch 1, 2; glossary |
| **Software Factory** | Repeatable delivery system composing people, process, automation, environments, quality controls, feedback from intent through production. Also appears as "Software Delivery Factory" (5×) and as a thin versioned config record in Ch 5. | glossary; Ch 5, 25, 42 |
| **Factory** | Governed, versioned composition of workflows, capabilities, policies, context, environments, verification rules, evidence requirements, authority designed to produce one outcome class. | glossary; appendix execution-boundaries |
| **Factory Platform** | Shared enterprise infrastructure supporting many Factories (control plane, identity, registries, gateway, runtime, sandbox, observability, evidence). | glossary; Ch 38 |
| **Agent Factory** | Governed capability supply chain that creates, packages, versions, evaluates, publishes, admits, deprecates, revokes agents, skills, tools, model profiles, configs. Supplies capabilities; does not authorize or accept outcomes. | Ch 11; glossary |
| **Mission Control** | The Guide's living control-plane implementation and case study; governs Missions, admission, verification, evidence, human authority; "not the universal definition of a software factory." | Ch 42; glossary |
| **Three actors** | Humans (intent, risk, consequential decisions); agents (bounded execution); deterministic code (contracts, scope, identity, verification, gates). | Ch 2, 4, 42 |
| **Factory line** | **Not defined.** Nearest: "the factory in one line" = the 8-stage value stream mnemonic (Ch 2). | — |
| **Control plane** 🔑 | Authoritative system for intent, policy, identity, authorization, workflow state, approvals, evidence requirements, audit, governance decisions. "Decides what may happen." | Ch 13 |
| **Orchestrator** | Durable coordinator that advances a Work Graph: dependencies, task state, fan-out/in, retries, pauses, human waits, compensation, recovery, terminal state. Does not approve its own Plan or evidence. | Ch 13; appendix execution-boundaries |
| **Execution plane** | Agents, processes, tools, worktrees, CI, deployment systems that perform authorized work; reports, never grants itself authority. | Ch 13 |
| **Harness / Agent Harness** 🔑 | Bounded operating envelope governing how an Agent uses models, context, tools, state, resources, external systems; binds loop, permissions, budgets, stopping, recovery, telemetry, provenance, artifacts. Enforces locally; authority stays in Control Plane. Sub-types: Coding Harness, IDE Harness; "AI harness", "inner/outer harness", "meta-harness" are explicitly **non-canonical aliases**. | Ch 15, 16; appendix |
| **Agent Loop (Execution Loop)** | Load state → plan/select → act → observe → evaluate → update/replan → repeat until success, bound, stall, escalation, or human stop. "FDLC does not use 'harness' as the name of this loop." | Ch 18, 23 |
| **Work Graph (Agent Graph)** | Explicit topology of nodes, dependencies, branches, joins, gates, interrupts, cycles, error transitions, terminal states. | Ch 23 |
| **Runtime (Agent Runtime)** 🔑 | Execution substrate that starts, observes, controls, persists, resumes, terminates sessions/Attempts using an exact Harness, environment, identity, Model Route. | Ch 13, 17 |
| **Sandbox** | Isolated environment beneath a Runtime constraining filesystem, process, network, credential, dependency, resource effects for one Attempt. | Ch 17 |
| **Worker** | **No standalone entry.** Appears as "Worker pool", "Worker capability attestation", and in the canonical "Orchestrator → worker → validator" pattern (Ch 27). Chapter 14 uses worker = the process that claims an Attempt via lease. | Ch 13, 14, 27 |
| **Attempt** | One authoritative execution of a Task with durable identity, authority, runtime, evidence, outcome lineage. Retries create new Attempts (immutable). Aliases: ExecutionRun, WorkflowRun. Sub-unit: **Run** (one agent turn). | Ch 5, 14 |
| **Lease and heartbeat** | Runtime controls establishing which worker owns work and whether it is alive; with fencing generation, expiry, renewal. Expiry ⇒ Suspect, not Failed. | Ch 14 |
| **Task** | Bounded executable portion of an admitted WorkOrder; completion does not accept the parent. | Ch 5, 14 |
| **WorkOrder** | Canonical governed unit of approved work bound to an exact revision and Factory Version; scope, repos, tools, agents, constraints, risk, budget, acceptance criteria, gates, evidence. "Contract between human intent and agent execution." Spelled `WorkOrder` 553×, "Work Order" 5×. | Ch 5 |
| **Plan** | Versioned proposal for achieving a Mission; approval freezes one version and authorizes WorkOrders; does not dispatch, merge, or deploy. | Ch 5, 6 |
| **Mission** | Durable governed outcome owning objective, business reason, constraints, risk, acceptance criteria, accountable owner. Not an agent session. Parent: **Goal** (strategic result; no execution state). Enterprise appendix uses **Objective** instead (22×). | Ch 5 |
| **Mission Spec** | Immutable statement of Mission meaning: requirement IDs, measurable outcomes, non-goals, clarifications, acceptance expectations, scope; deterministic spec-quality checks run before planning. (Chapter term; glossary has only "Specification baseline".) | Ch 5, 6 |
| **Candidate** | Immutable artifact set produced by an Attempt, bound to exact source and manifest; input to verification, not a success declaration. | Ch 5, 31 |
| **Evidence** 🔑 | Durable, attributable record of what was authorized, executed, observed, verified, decided; identifies subject, producer/verifier, method, environment, source revision, artifact, time, result. Six states: pass / fail / pending-unknown / stale / waived / not-applicable. | Ch 27 |
| **Verification receipt** | Immutable record that a known verifier applied a defined method to an exact artifact and observed a result. Observation, not decision. **Receipt packet** = bundle a runtime emits to prove it stayed in its envelope. | Ch 27, 31 |
| **Verification Subject / Verification Plan / Verifier Attempt** | Frozen candidate identity + contract a verifier evaluates; frozen list of checks; separate Attempt that produces the evidence. Basis of **currentness** ("verified on A ≠ authorized on B"). | Ch 5, 31 |
| **Verification contract** 🔑 | Structured list of claims that must be demonstrated and how each is validated. **Verification completeness** = share of claims with an independent verifier → **verification-driven autonomy**. | Ch 27 |
| **Quality Contract** | Versioned, machine-readable projection of the approved Plan: requirements, assertions, invariants, assurance expectations, evidence requirements, approval policy; frozen before execution. | Ch 31 |
| **Quality Gate Decision** | Versioned policy decision over exact contract + candidate + evidence set; states ELIGIBLE / INELIGIBLE / UNKNOWN / STALE / WAIVER_REQUIRED / AWAITING_HUMAN. Gate ≠ acceptance. | Ch 31 |
| **Quality Proof Package** | Complete assurance case for one release candidate: contract, evidence graph, raw artifacts, provenance, receipts, risks, gates, waivers, approvals, deployment, production evidence. | Ch 31 |
| **Software Quality Certificate** | Signed projection stating an exact artifact satisfied a particular Quality Contract at a time; expires/revocable; "not defect-free." | Ch 31 |
| **Acceptance** | Governed (human) decision that an outcome satisfies its criteria; distinct from completion and from verification ("correctness and authority are separate concerns"). | Ch 5, 27, 31 |
| **Approval** | Human decision granting a specific authority or accepting a specific risk; own state machine (NOT_REQUIRED / PENDING / APPROVED / REJECTED / CONDITIONAL / EXPIRED). Grains: plan approval, dispatch, acceptance, **merge authority**, **release authority**. | Ch 5, 13 |
| **Release** | Governed progression of an accepted change through merge, deployment, activation, observation, rollback readiness, production verification. | Ch 5, 32 |
| **Outcome** | Observable result the work was intended to create, measured after delivery against Mission success criteria; nothing upstream proves it. | Ch 8, 27 |
| **Signal** | Observable event indicating potential need for change (feedback, incident, telemetry…); factory boundary is signal→outcome. | Ch 5, 26 |
| **Learning Signal** | Bounded, attributable observation derived from Attempt/eval/review/incident/outcome; supports proposals; cannot modify active config. Computed deterministically ("zero model calls on refresh"). | Ch 40 |
| **Improvement Candidate** | Reviewable proposal (prompt, Agent Definition, skill, tool, context policy, route, evaluator, budget, workflow) naming evidence, baseline, benefit, risk, evaluation, promotion, rollback. Four human verbs: approve-experiment / snooze / dismiss / reject; no authority. | Ch 40 |
| **Promotion** 🔑 | Human-approved increase in eligible autonomy or activation of a candidate after sustained evidence; creates a new Factory Version; demotion may be automatic. **Asymmetric autonomy by action class** (bounded tuning / capability change / authority change). | Ch 3, 40, 41 |
| **Meta loop** 🔑 | Governed loop that observes executions, failures, corrections, outcomes and proposes factory improvements; may not self-authorize. Seven named meta-loops (failure analyzer, cost optimizer, context-drift detector, skill optimizer, verifier-quality monitor, routing optimizer, factory-health monitor). | Ch 16, 40, 41 |
| **Context Package** | Immutable, provenance-backed, budgeted set of code/docs/decisions/retrieval frozen for one Attempt; advisory; cannot change intent, grant authority, or satisfy criteria. Companion: **CBOM** (context bill of materials), **Context CDL** (draft/publish/install/deprecate). | Ch 5, 20 |
| **Definition of Correct** 🔑 | Machine-consumable description of acceptable work (requirements, standards, policies, architecture, constraints, acceptance criteria, verification rules); the factory's first artifact. | Ch 6, 19, 20 |
| **Skill** 🔑 | Reusable, versioned, evaluated method (instructions, decision criteria, examples, tool-use patterns) for a task class; teaches behavior, grants no authority. **Skill → verifier pair**. | Ch 12 |
| **Capability / Capability Implementation** | Qualified ability to perform a defined work type (tool, model, agent, human, API, workflow); one concrete qualified composition binding Agent Definition, Harness, Model Route, Runtime Artifact, Execution Backend, tools, Context Policy, evidence. | Ch 11; appendix |
| **Agent Definition** | Versioned declaration of role, objective, instructions, capabilities, eligible models, tools, skills, context policy, permissions, budgets, stop conditions, escalation, success criteria, eval policy. "Configuration, not a credential." | Ch 11 |
| **Model profile** | Chapter term (Ch 21): pins provider, model id, version/snapshot, region, input classes, eligibility, system prompt, sampling, limits, structured-output settings, safety policy, fallback order, budgets, eval suite, retirement. Glossary has **Exact model route** and **Model router** instead — **no "Model profile" glossary entry**. | Ch 21 |
| **Model routing** 🔑 | Policy-governed selection of which model serves a step (eligibility → capability → quality → context → tools → latency → reliability → cost). Lanes: PLAN / EXECUTE / REVIEW / LOCAL / LONG_RUNNING. Routing trace. | Ch 22 |
| **Escalation ladder** | Chapter term (Ch 22): Deterministic → cheap model → specialised model → frontier → human, with budget-aware step-up thresholds per workload class. **Not a glossary entry** (glossary has "Dynamic intelligence escalation", "Budget-aware escalation"). | Ch 22 |
| **12-layer stack** | Chapter term (Ch 25): Business Understanding, Data Understanding, Knowledge, Model, Context, Semantic, Agent, Loop, Evaluation, Harness, Infrastructure, Continual Learning; six contracts per layer. **Not a glossary entry.** Labelled a "reference model", not canon. | Ch 25 |
| **Paved road / Golden path** | Glossary defines **Golden path** (supported, observable, self-service route with defaults, templates, controls, docs, recovery, ownership, adoption, extension/exception model); "paved road" used as synonym in Ch 34/38 with no entry. | Ch 34 |
| **Control Tower** | Operations projection linking system inventory to authority, health, quality, safety, cost, drift, incidents, response, verified closure; invokes control APIs, does not replace records. | Ch 36 |
| **Factory Version / Factory Configuration** | Immutable qualified composition (Work Graph, Agent Definitions, Harness Version, Capability Implementations, Model Profiles, Runtime Artifacts, Sandbox Profiles, context, policy, verifier, budget, repo); Factory Configuration = same idea from the repository side, digest-hashed. **Two names for one concept** (Ch 5 admits this). | Ch 5, 11 |
| **Execution Manifest** | Immutable per-Attempt contract freezing lineage, base revision, scope, workflow, agent/skill bindings, harness, route, context, tools, sandbox, policy, budgets, stop conditions, completion schema. **Executor snapshot** = copy of executor config onto the Attempt. | Ch 5, 13 |
| **Execution Profile** | Governed composition binding Runtime, Harness, Model, Capability Implementations, Backend, Sandbox Profile, environment, policy for an Attempt. | appendix; Ch 22 |
| **Decision packet** | Operator-facing explanation of the exact decision required, why automation stopped, scope, risk, evidence present/missing, options, recommendation, uncertainty, deadline. | Ch 3, 37 |
| **Factory Operational Autonomy Levels** | Chapter term (Ch 3): L0 Human Execution/Advisory … L5 Trusted Factory/Factory autonomy; effective autonomy = min(factory, mission, work order, policy, trust). **Not a glossary entry** (glossary has "Trust Score", "Agent trust score"). | Ch 3 |
| **Factory Trust Score** | 0–100 numeric, banded (Very Low → Trusted), five weighted dimensions, hard overrides, 90-day decay. | Ch 3 |
| **Human-in / on / out-of-the-loop** 🔑 | L0–L2 in; L3–L4 on; narrow L5 slice out. | Ch 3 |
| **Compounding Engineering** | Turning recurring human corrections into evaluated improvements to tests, controls, docs, skills, tools, context, routing, workflows; promotion stays governed. | Ch 40, 41 |
| **Closed-loop factory** | Factory defined as code, cloud-hosted, API-first, evals/benchmarks built in, multi-model/agent (Warp's 5 criteria). | Ch 34, 41 |
| **Intent-to-Delivery Lifecycle** | Glossary name for the 8-stage mnemonic. | glossary |
| **Fab** | "Experimental Coding Harness and Capability Implementation" in the "FDLC ecosystem" — mentioned only in `appendix/execution-boundaries-and-terminology.md`; no glossary entry, no chapter. | appendix |

Other notable Guide-only vocabulary: Project Constitution, Goal, host binding, code scope, Run, FactorySystemRecord, Factory Board, Factory Health, Engineering OS (EOS), Labs, controlled execution system vs dark factory, progressive autonomy, Risk Review, corridor, gravity well, Builder Experience (BX), commodity vs differentiated layer, three release clocks, CBOM, Context CDL, context firewall, sufficiency loop, harness profile, harness debt/pruning, `factory-result/v1`, canonical run event types (`run.created` … `learning.candidate.proposed`), Decision Candidate, Residual AI, the two counts (execution progress vs acceptance readiness), merge gate, adaptation ladder, six self-improvement levels, ontology maturity L1–L5.

---

## 4. Guide vocabulary vs fdlc.ai vocabulary

### 4.1 Lifecycles

fdlc.ai (per the brief) has two: a **7-stage factory lifecycle** (Discover → Design → Assemble → Validate → Deploy → Operate → Improve) and a **9-step runtime lifecycle** (Receive → Specify → Plan → Execute → Verify → Approve → Release → Observe → Learn).

The Guide has **neither**, and instead carries at least fifteen ordered sequences, three of which it calls canonical or primary:

| # | Sequence | Where | Status in Guide |
| --- | --- | --- | --- |
| A | **Intent → Plan → Define Agent → Execute through Harness → Apply Skills → Evaluate → Improve → Deliver Software** (8) | README, front matter, Ch 2, `guide/stages/*`, glossary "Intent-to-Delivery Lifecycle", `docs/editorial/concept-ownership-map.md` | **"Primary reader model"** |
| B | **Understand → Design → Build → Prove → Operate → Improve** (6 parts) | README, `guide/README.md` | Book structure (a *learning* lifecycle) |
| C | Signal → Intent → Factory → Outcome → Learning → new Signal | Ch 2 "boundary lens", Ch 5 | Boundary lens |
| D | **Signal → Intent → Plan → Task → Attempt → Artifact → Evidence → Verification → Decision → Deployment → Outcome** (11) | Ch 5 "factory data model" | "Canonical object chain" (practitioner-converged) |
| E | Business intent → governed Mission/Plan → authorized work → agent execution → independent validation → evidence-based decision → deployment authorization → CI/CD execution → production verification → measured outcome → reviewed learning (11) | Ch 1 operating loop | Infographic |
| F | Mission → Plan → WorkOrder → Task → Attempt → tool call (commands) / receipt → event → Candidate → evidence → acceptance → release outcome (observations) | Ch 2 system map | Implementation view |
| G | Company → Workspace → Repository → Constitution → Mission → Mission Spec → Plan → Plan approval → Quality Contract → WorkOrder → Task → Attempt → Execution Manifest → Context Package → admission + lease → Execution → Candidate → Verification Subject → Verification Plan → verifier → Evidence + receipt + Gate → PR (exact-current) → acceptance → Merge → Deployment → Activation → Production verification → Learning (27 links) | Ch 5 companion chain; Ch 42 "master chain" | Full record chain |
| H | **Intent → Plan → Build → Verify → Validate → Release → Observe → Learn** (8) | Ch 31 "one continuous assurance loop" | Assurance loop |
| I | Intent validation → Plan validation → Preflight → Implementation feedback → Independent validation → PR validation → Release validation → Production validation (8) | Ch 27 | Validation ladder |
| J | admit → assemble context → select capability → attempt → observe → evaluate → decide → {accept/correct/retry/reduce autonomy/escalate/fail} → deliver → observe outcome → propose improvement | Ch 25 | Operating loop |
| K | Research → Verify → Recommend → Approve → Implement → Validate → Measure → Iterate (8) | Ch 40 (Mission Control's learning loop) | MC vocabulary |
| L | Execute → Observe → Evaluate → Learn → Propose → Verify → Promote (7) | Ch 40 | Learning loop |
| M | Observe → Assist → Delegate → Shadow govern → Enforce → Conditionally automate → Scale (7) | Ch 38 | Adoption path |
| N | **Intent → Plan → Route → Execute → Verify → Release → Learn** (7) | `appendix/enterprise-multi-factory-delivery.md` | Enterprise flow; the same appendix has a table row "Seven-stage FDLC — the outer lifecycle governs the factories used here" — the **only** acknowledgement of fdlc.ai's 7-stage model in the corpus, and it does not name the stages |
| O | Author → Package → Evaluate → Admit → Activate → Observe → Compare → Promote/Rollback → Improve (9) | `appendix/context-skills-engineering.md` | Capability lifecycle |
| P | create → review → version → distribute → execute → observe → evaluate → improve → deprecate (9) | Ch 20 | Context lifecycle |

`grep` confirms: **zero** occurrences of "Receive → Specify" or "Ad Hoc Prompting" / "Continuously Learning Factory" anywhere in `guide/`.

**Conflicts and drift, specifically:**

1. **Stage A vs fdlc.ai's 9-step runtime lifecycle.** They describe the same thing (one unit of work moving through the factory) with different cuts. Stage A has no *Receive/Specify* split (Ch 6 and Ch 5 do have the Mission Spec + spec-quality-check step, but the value stream folds it into "Intent"); it has no *Approve* stage (approval is spread across "Plan", "Evaluate" and "Deliver Software"); it has no *Observe* stage ("Deliver Software" is defined to include production verification); and it inserts two stages fdlc.ai does not have — *Define Agent* and *Apply Skills* — which are capability-binding mechanics rather than lifecycle phases (Ch 2 itself concedes "skills are selected and frozen before execution, then applied inside the harnessed loop", i.e. Apply Skills is not sequentially after Execute). Stage A also puts *Improve* **before** *Deliver Software*, which the Guide has to explain away in every chapter ("read it as a value stream, not eight boxes wired in series"). fdlc.ai's Receive → … → Observe → Learn is strictly ordered and does not need that disclaimer.
2. **Part structure B vs fdlc.ai's 7-stage factory lifecycle.** Understand/Design/Build/Prove/Operate/Improve are chapters a *reader* moves through; Discover/Design/Assemble/Validate/Deploy/Operate/Improve are phases an *organisation building a factory* moves through. They share Design/Operate/Improve, and "Build ≈ Assemble", "Prove ≈ Validate", but the Guide has no *Discover* or *Deploy* phase, and fdlc.ai has no *Understand*. A reader arriving from fdlc.ai's "Design" will land in Guide Part II (records, governance, economics) — plausible — but from fdlc.ai's "Deploy" there is nowhere to go (Guide Ch 32 is under "Prove", Ch 34–38 under "Operate").
3. **Object chain D vs fdlc.ai's 11 protocol artifacts.** This is the closest match and the most fixable: Guide D = Signal, Intent, Plan, Task, Attempt, Artifact, Evidence, Verification, Decision, Deployment, Outcome; fdlc.ai = Intent, Specification, Plan, Work Order, Attempt, Evidence, Verification, Approval, Release, Outcome, Learning Signal. Deltas: Guide adds *Signal* at the front and *Artifact* (= Candidate) between Attempt and Evidence, and folds *Learning Signal* into Outcome; fdlc.ai adds *Specification* (Guide: Mission Spec) and names *Work Order* where the Guide's D-chain says *Task* (Ch 5 explicitly notes "the canonical chain uses one word for the authority-and-acceptance unit and the operational unit; this chapter keeps them apart" — i.e. the Guide's own body text sides with fdlc.ai's WorkOrder ≠ Task split). *Decision* vs *Approval*, *Deployment* vs *Release* are synonyms with different names.
4. **Spelling.** Guide: `WorkOrder` (553×, CamelCase, from the Convex schema); fdlc.ai: "Work Order". Guide: `Mission Spec` (36×); fdlc.ai: "Specification". Guide uses `Mission` as the top intent record (and `Goal` above it, `Objective` in the enterprise appendix); fdlc.ai uses "Intent".
5. **Six areas.** The Guide's Intent / Harness / Capability / Model / Trust / Learning match fdlc.ai's six architecture areas exactly — this is the one place the two are already aligned (and the glossary/appendix language "FDLC Harness", "FDLC Trust" with links to fdlc.ai/architecture#harness shows the Guide treats fdlc.ai as the owner of the areas).
6. **Maturity.** fdlc.ai: L0 Ad Hoc Prompting → L5 Continuously Learning Factory. The Guide has **three** ladders of its own, none of which uses those names: (a) Ch 3 *Factory Operational Autonomy Levels* 0–5 (Human Execution/Advisory, Assisted/Drafting, Delegated/Supervised, Governed Autonomy, Conditional/Continuous, Trusted Factory/Factory autonomy) — itself dual-named; (b) Ch 38 *maturity levels* 0–5 (Human execution → Trusted factory operation) that "line up with" (a) but "describe the organization"; (c) Ch 38 *skills → loops → factory* L0–L5 (AI assistance → Skills → Automated workflows → Loops → Factory → Adaptive factory) with a "loose mapping" table to (b). Plus Ch 40's six self-improvement levels (1–6) and Ch 19's ontology maturity L1–L5. A reader who has seen fdlc.ai/maturity will find five different "L3"s in the Guide.
7. **Duplication with the FDLC site's own surfaces.** `site/lib/global-navigation.generated.ts` shows fdlc.ai owns `/framework`, `/architecture`, `/specification`, `/maturity`, `/benchmarks`, `/mission-control`, `/deploy` (FDE), `/enterprise`, `/manifesto`, `/in-5-minutes`. The Guide independently covers every one of those: architecture (Ch 2, 13, 25, appendix execution-boundaries), specification (Ch 5, 6, 31 schemas), maturity (Ch 3, 38), benchmarks/economics (Ch 8, 9, 22), Mission Control (Ch 42 + 3 appendices), FDE (Ch 38 "forward-deployed loop", Ch 43), enterprise (Ch 38 + `appendix/enterprise-multi-factory-delivery.md`, including pricing mailto), manifesto (Ch 1, `appendix/principles.md`), in-5-minutes (Ch 2, Ch 43 "Three lengths, one shape"). Two IAs cover one subject.
8. **The Guide already defers to FDLC in places, inconsistently.** `appendix/context-skills-engineering.md` says "FDLC defines the responsibilities and evidence boundaries. The Guide explains the engineering decisions and worked examples." `appendix/execution-boundaries-and-terminology.md` is written in FDLC's voice ("FDLC separates…", "FDLC ecosystem mapping: Mission Control and Fab"). Chapters 13, 14, 15, 20 cite fdlc.ai/architecture#harness / #trust as the "architectural owner". Yet the same corpus says of its own 8-stage stream "this eight-stage value stream is the primary reader model" and of its glossary "the canonical wording". Two documents each claim to be canon.

### 4.2 Term-level reconciliation table

| fdlc.ai term | Guide term(s) | Verdict |
| --- | --- | --- |
| Intent | Builder Intent (stage 1), Goal, Mission, Objective | Guide is richer (Goal ⊃ Mission ⊃ Mission Spec); fdlc.ai collapses to one |
| Specification | Mission Spec; Definition of Correct; Specification baseline | Guide's "Definition of Correct" is the stronger concept and absent from fdlc.ai's list |
| Plan | Plan (+ Plan approval, Quality Contract as its projection) | Aligned; Guide adds Quality Contract |
| Work Order | WorkOrder (+ Task beneath it) | Same concept, spelling differs; Guide's D-chain uses "Task" — drift inside the Guide |
| Attempt | Attempt (+ Run beneath, Execution Manifest, executor snapshot, lease) | Aligned; Guide richer |
| Evidence | Evidence + receipt + Candidate/Artifact before it | fdlc.ai has no Candidate artifact between Attempt and Evidence |
| Verification | Verification Subject / Plan / Verifier Attempt / Quality Gate Decision | Aligned; Guide richer |
| Approval | Acceptance (human) + Approval record (grains: plan, dispatch, merge, release) + Decision (D-chain) | Three names in the Guide for what fdlc.ai calls Approval |
| Release | Release (merge, deploy, activate, observe, verify) / Deployment (D-chain) | Aligned; D-chain drift |
| Outcome | Outcome, production verification, validated customer value | Aligned |
| Learning Signal | Learning Signal → Improvement Candidate → promotion | Aligned; Guide richer |
| (none) | Candidate, Context Package, Factory Version, Quality Contract, Certificate, Decision packet | Guide concepts fdlc.ai's 11-artifact list lacks |

---

## 5. Learning-path coverage

The Guide offers only five "recommended routes" (first-time reader, executive, architect, builder, reviewer — `guide/00-front-matter/01-what-this-guide-covers.md`) and Ch 43's four fluency levels (Conceptual = Part I, Architectural = Parts II–III, Applied = Parts IV–V, Executive = Part VI). Neither is a curriculum. Mapping the corpus onto the five target paths:

### Beginner
| Topic | Coverage | Gap |
| --- | --- | --- |
| What is an AI Software Factory | Ch 1 (definition, sociotechnical framing), Ch 2 | Strong, but 4,900 + 4,400 words of dense prose; no 500-word explainer, no "in 5 minutes" |
| Why coding agents aren't factories | Ch 1 "Coding assistant, agent, platform, factory" table; 12 threshold capabilities; Ch 42 "what MC is not" | Strong |
| What is FDLC | **Missing.** The term "FDLC" appears ~40× but is never introduced or defined in the Guide; a reader cannot learn from the Guide what FDLC is, that it has 7 stages, 9 steps, or a maturity ladder | Critical gap for a book marketed as "teaches FDLC" |
| Humans vs agents vs deterministic systems | Ch 2 "three actors", Ch 4 "Three parties, not two", Ch 42 eight-actor table | Strong |
| The autonomous delivery lifecycle | Stage briefs 1–8; Ch 2 lifecycle table | Present but in the Guide's 8-stage cut, not fdlc.ai's 9-step; the "why are Define Agent and Apply Skills stages?" question is never answered for a beginner |

### Practitioner
| Topic | Coverage | Gap |
| --- | --- | --- |
| Building your first factory | Ch 2 "initial production corridor" (10 steps), Ch 3 "Governed Issue → Validated PR" (8 steps), Ch 26 wedge workflow, Ch 43 30/60/90 | All prescriptive prose; **no walkthrough with code, config, repo, or commands**. The v1 labs were deleted (see §1.4) |
| Agent harnesses | Ch 15, 16 (adapter contract, `factory-result/v1`, event types, conformance suite) | Strong conceptually; no example adapter |
| Context engineering | Ch 19, 20, appendix context-skills | Strong; Ch 20 contradicts itself on precedence (§6) |
| Tools and MCP | Ch 18 (MCP gateway, tool registry), Ch 33 (MCP poisoning) | Adequate; no worked MCP server contract |
| Sandboxing | Ch 17 (isolation model, pets vs cattle), Ch 33 | Adequate |
| Verification | Ch 27, 28, 29, 31 | Strong; 31 is the only chapter with schemas |
| Evidence | Ch 27, 31, 35 | Strong |
| Observability | Ch 35 | Adequate (skimmed) |
| Recovery | Ch 14 (best chapter for practitioners: contracts `claimAttempt/renewLease/completeAttempt/cancelAttempt/reconcileAttempt`), Ch 36, appendix production-reliability playbook | Strong |

### Architect
| Topic | Coverage | Gap |
| --- | --- | --- |
| Control planes | Ch 13 (component families, policy hooks, engine authority split), 37 | Strong |
| Factory registries | Ch 11 (registry vs catalog, lifecycle verbs), 12 | Strong |
| Multi-factory orchestration | `appendix/enterprise-multi-factory-delivery.md`, Ch 13 "cross-factory", Ch 10 | Present but the appendix is half reference architecture, half sales page |
| Factory versions | Ch 5, 11; appendix execution-boundaries | Strong but two names (Factory Version / Factory Configuration) |
| Capability routing | Ch 22 "three levels of routing", appendix enterprise §3 | Adequate |
| Model routing | Ch 21 (thin), 22 (excellent) | 21 should be merged back into 22 |
| Distributed execution | Ch 13, 14, 17 | Strong |
| Verification architecture | Ch 27, 31 | Strong |
| Knowledge architecture | Ch 19 (ontology), 20 | Strong |

### Enterprise
| Topic | Coverage | Gap |
| --- | --- | --- |
| Identity | Ch 33 (principal types, identity chain, workload identity) | Strong |
| Security | Ch 33 (7-layer map, threat table, supply chain) | Strong |
| Governance | Ch 7 (10 control families, autonomy matrix), 3 | Strong |
| Tenancy | Ch 38 "four layers", Ch 17 "Multi-tenancy", Ch 5 Company/Workspace | Adequate |
| Compliance | Ch 33 §privacy/compliance (one paragraph), Ch 38 checklist row | **Thin** — no SOC2/ISO/AI-Act mapping, no audit-artifact catalogue |
| Cost management | Ch 8, 9, 34 (cost ledger, showback/chargeback), 22 | Strong |
| Fleet management | Ch 17 "worker fleet", Ch 34 scheduling, Ch 36 | Adequate; "fleet-scale" is repeatedly disclaimed as unproven |
| Organizational adoption | Ch 38 (corridors, gravity well, FDE loop), 43 | Strong |
| Operating models | Ch 4, 34, 38 | Strong |
| Platform teams | Ch 34, 38 "contribution model" | Strong |
| Migration strategy | Ch 38 "gravity well", "adopt a multi-factory operating model" | Adequate; no migration runbook |

### Expert
| Topic | Coverage | Gap |
| --- | --- | --- |
| Factory economics | Ch 8, 9, 22 (cost per trusted outcome, Pareto selection) | Strong |
| Autonomy theory | Ch 3 (grant not trait; effective = min; promotion asymmetry), 7, 41 (asymmetric autonomy by action class) | Strong and original |
| Verification science | Ch 27 (validate the validator, verification completeness), 29 | Strong |
| Factory optimization | Ch 16 (harness pruning, model × harness matrix), 22, 41 (adaptation ladder) | Strong |
| Governed learning | Ch 40, 41 | Strong |
| AI engineering org design | Ch 4 "two roles the factory creates", 38, 43 "founder-architect" | Adequate |
| Future autonomous dev orgs | Ch 44 | Adequate; hypotheses are labelled with falsifiers |

**Net:** Architect / Expert / Enterprise-technical content is abundant and often excellent. The Guide is weakest exactly where fdlc.ai's audience funnel starts — Beginner (no FDLC explainer, no short on-ramp) — and where practitioners convert — no build-along tutorial, no code beyond Ch 31's YAML and Ch 13's JSON envelope, no runnable reference implementation despite Mission Control being cited on every page.

---

## 6. Quality assessment

**Actionable vs abstract.** Every chapter has the same spine (problem / how it works / how to build it / failure modes / In Mission Control / Retain this / Go deeper), and the "How to build it" sections are genuinely procedural (numbered build sequences, review checklists, contracts, field lists). Failure-mode sections consistently pair *detect* with *fix*. Tables are dense (Ch 7: 14 tables; Ch 18: 13; Ch 38: 12). Mermaid diagrams: 201 across the chapters. So the book is far more operational than a typical "AI strategy" text. But:

- **Code and artifacts are nearly absent.** Only Ch 31 ships schemas (Quality Contract YAML, Evidence Envelope, Certificate, API list) and Ch 13 one JSON envelope. There is no example Agent Definition, no example execution manifest, no example WorkOrder, no adapter, no policy file, no repository profile — despite each being defined in prose at length. `guide/assets` has PNGs only.
- **No tutorials.** The v1 "Lab" content type (81 files, 126k words, with whiteboards and design-review questions) was dropped at the v2 rewrite (`docs/plans/coverage-map.md` records the drops), and the promised "appendix labs 01–11" were never created. `coverage-and-maturity.md` still advertises "thirteen executable specifications".
- **Infographics** are present (187/184 slots, 100 % coverage) and each is echoed by a Mermaid diagram in source so the mechanism survives without the PNG. Good discipline. Three PNGs are orphans.
- **Evidence honesty** is a real strength: 37/44 chapters pin Mission Control claims to commits (`8014d5a`, `b31e275`, `9d5f8e3`, `d902fae`, `a490648`, `b3dfcee`, `af414acf`, `ed77c46`, `352a8ee`) and label implemented / partial / future. The 7 unpinned chapters are the split residue.
- **Internal contradictions found:**
  - Ch 20 body: "Precedence runs downward: a repository convention cannot override an organisation standard" vs Ch 20 "Retain this" and `appendix/principles.md` #12: "the specific layer may override the general".
  - Ch 25 lists the twelve layers as "Knowledge Engineering… Context Engineering — [Chapter 19]" though Ch 20 owns context.
  - Ch 41 references "the six levels above" and "Chapter 16 — Coding harnesses…" (wrong titles after the split).
  - `principles.md` promises fifty 🔑 concepts; glossary marks 33.
  - Factory Version vs Factory Configuration; Goal vs Objective; Acceptance vs Approval vs Decision; Task vs WorkOrder in the D-chain — all acknowledged in-text rather than resolved.
- **Length.** 295k words is a barrier. Ch 42 (12.9k) partly restates Ch 5, 13, 27, 31 in Mission Control vocabulary; Ch 38 (11.8k) contains a dated vendor landscape that will rot; Ch 7 (10.7k) and Ch 5 (10.3k) each carry three or four models that could be tables.
- **Commercial content inside the open book:** `guide/README.md` line 17 and `appendix/enterprise-multi-factory-delivery.md` contain `mailto:support@fdlc.ai … Enterprise pricing` links and "FDLC Enterprise remains a proposed commercial offering". This belongs on fdlc.ai/enterprise, not in a CC-licensed guide.

---

## 7. Structural dependency: fdlc.ai/guide → separate Vercel deployment

**Current state (from `site/README.md`, `site/lib/paths.ts`, `site/lib/legacy-host.ts`, `site/lib/compatible-host.ts`, `site/lib/microfrontends-config.ts`, `site/config/microfrontends.generated.json`):**

- The Guide is a **Vercel Microfrontends child** of the FDLC app. FDLC's root `microfrontends.json` is "the sole routing authority"; the Guide owns physical `/guide/...` routes but "FDLC owns bare `/architecture`". Header/footer/nav are **generated from FDLC** (`scripts/sync-global-navigation.mjs`) — the Guide cannot change its own nav.
- Two build modes exist: *compatibility* (canonicals on `ai-software-factory-mastery.vercel.app`, hard links to fdlc.ai absolute) and *final* (`NEXT_PUBLIC_SITE_URL=https://www.fdlc.ai`, `GUIDE_LEGACY_REDIRECTS_ENABLED=true` → 301 the old host into `www.fdlc.ai/guide/...`). The final cutover is gated behind a "five-state release plan" with digest/commit trust anchors and is **not done** (`vercel.json` disables auto-deploys on `main`; production flags "must stay absent until a separate production-cutover approval").
- Legacy `/docs/<slug>` URLs are still the article canonical in compatibility mode "so a visited URL survives a rollback to old Guide".

**Risks:**

1. **Split canon.** Two sites, each with a glossary, each claiming canonical vocabulary (Guide: 654 terms; fdlc.ai: its own framework/spec/glossary), with different lifecycles (8-stage vs 9-step), different maturity ladders (3 vs 1), different spellings (WorkOrder / Work Order). Any reader who moves between them meets a second taxonomy within one click. The Guide already links *out* to fdlc.ai/architecture#harness and fdlc.ai/benchmarks as "owner" — so the canon is currently *circular*: fdlc.ai says the Guide teaches FDLC; the Guide says FDLC defines the boundaries.
2. **Two IAs.** fdlc.ai nav: Framework / Architecture / Guide / Mission Control / FDE / Maturity / Enterprise / Manifesto / Specification / Benchmarks. Guide nav: Overview / Atlas / Reference / Glossary / Search + 44 chapters + 8 stages + 18 appendices. The Guide's Atlas, Architecture, Coverage and Glossary pages duplicate fdlc.ai's Architecture, Maturity and Specification pages in intent.
3. **SEO dilution.** Until cutover, canonicals sit on `ai-software-factory-mastery.vercel.app` (a `vercel.app` subdomain), with a second live tree under `/guide` and a legacy `/docs` tree; the same 295k words are reachable at three URL shapes. Once cut over, 301s "drop the entire query string" and only allowlisted paths forward. Search engines currently index the vercel.app host, not fdlc.ai.
4. **Operational coupling.** Every FDLC nav change requires a manual sync + regenerate + PR in the Guide repo; every Guide build validates an FDLC-sourced config digest and fails closed on mismatch. A stale snapshot = a broken Guide build. `docs/NIGHTLY-BACKLOG.md` already records dead links on the published site caused by the content generator skipping `evidence/` directories.
5. **Brand.** The Vercel host name "ai-software-factory-mastery" (the v1 "mastery guide" name) is not "FDLC" and not "The Guide"; the `<title>` and README call it "The AI Software Factory Guide".

**Consolidation options:**

| Option | Description | Pros | Cons |
| --- | --- | --- | --- |
| A. Finish the microfrontend cutover as designed | Flip to `NEXT_PUBLIC_SITE_URL=https://www.fdlc.ai`, enable legacy redirects, retire the vercel.app host | Already engineered; keeps Guide repo/build separate | Leaves two IAs, two glossaries, two lifecycles inside one domain; nav still synced by script |
| B. Move `guide/` markdown into the FDLC repo and render with FDLC's site | One repo, one nav, one glossary build, one search index | Ends the sync scripts, digest anchors, and dual build modes; enables cross-linking by slug | Requires FDLC's renderer to handle Mermaid, infographic slots, 44-chapter reader; loses independent Guide release cadence |
| C. Split the corpus by role | Canon (definitions, lifecycles, records, contracts, boundaries) moves to fdlc.ai pages; the narrative book stays as "the Guide" at fdlc.ai/guide and *links to* canon rather than restating it | Resolves split canon regardless of hosting; shrinks the Guide | Large editorial project; every chapter's "definitions" paragraphs must be rewritten as links |
| D. Status quo | Two hosts, link-out | None | All five risks persist |

Recommended: **C, delivered through B** (single repo, single renderer, canon pages + book pages), with A's redirect map used for the URL migration.

---

## 8. Recommendations

### 8.1 What to pull into fdlc.ai as canon

These are already written as normative reference and are largely hosting-agnostic; they should become fdlc.ai pages (Framework / Specification / Architecture / Maturity) and be *removed* from the book, which then links to them:

1. `guide/appendix/execution-boundaries-and-terminology.md` — it is already written in FDLC's voice; it is the boundary map for Model / Agent / Agent Loop / Agentic SDK / Harness / Work Graph / Orchestrator / Runtime / Sandbox / Capability / Factory / Factory Platform / Control Plane. This is fdlc.ai/architecture material.
2. `guide/appendix/glossary.md` — collapse 654 entries to a canon of ~150 under fdlc.ai/specification/glossary; keep the rest as a Guide "extended vocabulary" appendix labelled non-canonical. The 33 🔑 entries + the "fifty concepts" list are the seed.
3. Chapter 5 §"The authoritative state machines" (seven state lists), §"Record cards", §"The companion records", §"The five invariants" — this is the record spec fdlc.ai's 11 protocol artifacts need behind them.
4. Chapter 31 schemas (Quality Contract, Evidence Envelope, Gate decision model, Certificate, API surface, lifecycle state machines) — fdlc.ai/specification.
5. Chapter 13 §"The interface is an execution contract", §"Pluggable execution engines: who decides what", §"Admission: what an engine adapter may never hold", and Chapter 16 §"The adapter contract" / `factory-result/v1` / canonical event types — the harness adapter contract.
6. Chapter 14 §contracts (`claimAttempt`, `renewLease`, `completeAttempt`, `cancelAttempt`, `reconcileAttempt`) and the Attempt record fields — durable-execution spec.
7. Chapter 27 §"Evidence states", §"The evidence record" (envelope fields), §"The verification contract".
8. Chapter 3 §"The six levels", §"Autonomy is scoped, and the lowest ceiling wins", §"Trust-loss events" and Chapter 38 §"Maturity is observable capability" — merged into **one** fdlc.ai/maturity ladder (see 8.3).
9. The eight `guide/stages/*.md` briefs — after renaming to the 9-step runtime lifecycle (8.3), they are fdlc.ai/framework's per-step contract pages (Inputs / What happens / Outputs / Governing decision / Required evidence / Common failure).
10. `guide/appendix/enterprise-multi-factory-delivery.md` — split: the reference architecture (§1–§6) to fdlc.ai/architecture/enterprise; the pricing/scoping brief (§"contact FDLC Enterprise", mailto links, `guide/README.md` line 17) to fdlc.ai/enterprise and out of the book.
11. Chapter 42 + the three `appendix/mission-control/*` case studies + evidence folder — fdlc.ai/mission-control, pinned to commits, with the Capability Maturity Ledger as the linked source of truth.

### 8.2 What stays as "the book"

The narrative, argumentative and pedagogical material: Ch 1, 2 (rewritten to *introduce* fdlc.ai's lifecycles rather than a competing one), 4, 6, 7, 8, 9, 10, 11, 12, 17, 18, 19, 20 (with the precedence contradiction fixed), 22 (absorbing 21), 23 (absorbing 24), 25 (kept as "reference model", cross-mapped to the six areas), 26, 28, 29 (absorbing 30), 32, 33 (threat model narrative; the control checklist and supply-chain verification order can be canon), 34, 35, 36, 37, 38 (adoption narrative; drop or date-stamp the vendor tables), 39, 40 (absorbing 41's narrative), 43, 44, `appendix/principles.md`, `appendix/architecture-communication.md`, the two playbooks, `research/initial-canon.md`. Re-merging the eight split pairs returns the book to ~36 chapters and removes the seven unpinned "In Mission Control" stubs.

Add what the book lacks: (a) a 1,500-word "FDLC in the Guide" chapter zero that *names* the 7 stages, 9 steps, 6 areas, 11 artifacts and L0–L5 and maps every Part and chapter to them; (b) a build-along tutorial track (restore the best of the 81 archived v1 labs as `guide/labs/`) that produces a real WorkOrder, execution manifest, Attempt, receipt, and decision packet against Mission Control at a pinned commit; (c) example artifacts (`examples/agent-definition.yaml`, `work-order.yaml`, `execution-manifest.json`, `evidence-envelope.json`) linked from the chapters that define them.

### 8.3 Terminology reconciliation — proposed single canonical vocabulary

Rule: **fdlc.ai owns names; the Guide owns explanations.** Where the Guide has a richer concept, keep it as a *sub-term* of the fdlc.ai name, never a sibling.

**Lifecycles (three, no more):**
- *Factory lifecycle* (7): Discover → Design → Assemble → Validate → Deploy → Operate → Improve. Map the book's six Parts onto it explicitly: Understand+Design→Discover/Design; Build→Assemble; Prove→Validate; Operate→Deploy/Operate; Improve→Improve. Retire "Understand/Design/Build/Prove/Operate/Improve" as a lifecycle; keep it only as Part titles.
- *Runtime lifecycle* (9): Receive → Specify → Plan → Execute → Verify → Approve → Release → Observe → Learn. Retire the 8-stage "Intent → … → Deliver Software" as a *lifecycle*; keep "Define Agent" and "Apply Skills" as named mechanics *inside* Plan/Execute (they are capability-binding steps, not phases). Rename `guide/stages/0x` to the nine steps. Retire the Ch 31 assurance loop and the enterprise appendix's 7-step flow as separate sequences; present them as views of the 9 steps.
- *Learning loop* (the Guide's Execute → Observe → Evaluate → Learn → Propose → Verify → Promote) — keep as the expansion of steps 8–9 (Observe, Learn), and drop the Mission Control-specific "Research → Verify → Recommend → …" naming from the book.

**Protocol artifacts (11 + named sub-records):** Intent (sub: Goal, Mission) → Specification (sub: Mission Spec, Definition of Correct, Project Constitution) → Plan (sub: Plan revision, Quality Contract) → Work Order (spelling: two words in prose, `WorkOrder` only in code; sub: Task) → Attempt (sub: Run, Execution Manifest, executor snapshot, lease, **Candidate** as the Attempt's output) → Evidence (sub: receipt, receipt packet, evidence envelope; six states) → Verification (sub: Verification Subject, Verification Plan, Verifier Attempt, Quality Gate decision, verification contract, currentness) → Approval (replaces the Guide's "Acceptance" as the canonical human decision; keep "acceptance" as the Work Order-level instance and "decision packet" as its input; grains: plan, dispatch, merge, release, promotion) → Release (sub: merge, deployment, activation, rollout, production verification) → Outcome → Learning Signal (sub: Improvement Candidate, promotion). Adopt the Guide's **Signal** as an explicit pre-Intent record (fdlc.ai gains it) and drop the Guide's separate "Artifact" and "Decision" and "Deployment" names.

**Architecture areas (6):** Intent / Harness / Capability / Model / Trust / Learning — already aligned; formally assign every Guide chapter to one area (the front matter already does this).

**Boundaries:** Model, Agent, Agent Loop, Agentic SDK, Agent Harness (Coding/IDE sub-types), Work Graph, Orchestrator, Runtime, Sandbox, Control Plane, Capability / Capability Implementation, Factory, **Factory Version** (retire "Factory Configuration" as a synonym; keep "configuration digest" as its hash), Factory Platform, Execution Profile. Declare "AI harness", "inner/outer/meta-harness", "meta-factory control plane", "Software Delivery Factory", "Objective" as non-canonical aliases in one alias table.

**Maturity (one ladder):** Use fdlc.ai's L0 Ad Hoc Prompting → L5 Continuously Learning Factory as the organisational ladder, and fold the Guide's two 0–5 ladders into it with a single crosswalk row each; keep Ch 3's *autonomy ceiling per scope* (effective autonomy = min(factory, mission, work order, policy, trust)) as a **scope-level control** that is not a maturity level, and keep the skills→loops→factory continuum as a "what you have built" diagnostic lens with letters (A–F), not L-numbers, so no reader meets a second "L3". Rename Ch 40's "six self-improvement levels" to "six self-improvement *capabilities*".

**Three definitions to retain** (already stable across README / Ch 1 / Ch 2 / Ch 42 / glossary and should be the fdlc.ai/framework opener): Agent Factory *creates* reusable capabilities; AI Software Factory *delivers* validated value from governed intent; Mission Control *governs* one control plane. Add the fourth that the Guide implies but never states: **FDLC** is the lifecycle and vocabulary both are built on.

### 8.4 Immediate hygiene (cheap, independent of consolidation)

- Fix the two self-referential "Go deeper" sections (Ch 21, 40) and the seven unpinned "In Mission Control" stubs (12, 16, 20, 21, 24, 30, 40).
- Fix Ch 20 / principles #12 precedence contradiction; Ch 25 "Context Engineering — Chapter 19"; Ch 41 "six levels above" and "Chapter 16 — Coding harnesses".
- Correct or remove `coverage-and-maturity.md` "thirteen executable specifications available".
- Remove the three orphan PNGs or add slots.
- Move the pricing `mailto:` links out of `guide/README.md` and the enterprise appendix.
- Reconcile "fifty concepts" (principles) with 33 🔑 glossary markers.
