export const siteName = "FDLC.ai";
export const canonicalDefinition =
  "The Factory Development Lifecycle is the process for designing, assembling, governing, operating, measuring, and continuously improving an AI software factory.";

export const primaryPositioning = "Verified delivery, not merely generated code.";
export const evidencePositioning = "Autonomy without evidence is just faster guessing.";

export const categoryComparison = [
  {
    name: "Traditional SDLC",
    primaryObject: "Software",
    question: "How do we build software?",
  },
  {
    name: "AI-Native SDLC",
    primaryObject: "Software + AI-assisted workflow",
    question: "How does AI change software development?",
  },
  {
    name: "FDLC",
    primaryObject: "The software factory",
    question: "How do we engineer the factory that performs autonomous software delivery?",
  },
] as const;

export const categoryTransitions = [
  {
    from: "SDLC",
    to: "AI-Native SDLC",
    meaning: "Agents move beyond code generation and participate across planning, design, implementation, testing, deployment, and maintenance.",
  },
  {
    from: "AI-Native SDLC",
    to: "AI Software Factory",
    meaning: "Individual agent workflows become persistent, orchestrated production systems that transform intent into verified software with decreasing human intervention.",
  },
] as const;

export const runtimeLifecycle = [
  { id: "receive", number: 1, name: "Receive", artifact: "Intent", purpose: "Capture the desired outcome, constraints, owner, and initial risk." },
  { id: "specify", number: 2, name: "Specify", artifact: "Specification", purpose: "Define what must be true and what evidence will establish it." },
  { id: "plan", number: 3, name: "Plan", artifact: "Plan", purpose: "Choose the governed path, decomposition, and verification strategy." },
  { id: "execute", number: 4, name: "Execute", artifact: "Work Order · Attempt", purpose: "Run bounded, authorized work as attributable attempts." },
  { id: "verify", number: 5, name: "Verify", artifact: "Evidence · Verification", purpose: "Evaluate the exact candidate against the specification." },
  { id: "approve", number: 6, name: "Approve", artifact: "Approval", purpose: "Apply policy and human authority at consequential boundaries." },
  { id: "release", number: 7, name: "Release", artifact: "Release", purpose: "Promote the exact accepted software artifact with rollback readiness." },
  { id: "observe", number: 8, name: "Observe", artifact: "Outcome", purpose: "Compare the production result with the intended outcome." },
  { id: "learn", number: 9, name: "Learn", artifact: "Learning Signal", purpose: "Propose controlled changes to the factory from validated outcomes." },
] as const;

export const factoryControls = [
  { name: "Govern", purpose: "Bound identity, delegated authority, policy, spend, approval, and accountability." },
  { name: "Secure", purpose: "Protect data, secrets, tools, environments, and the capability supply chain." },
  { name: "Observe", purpose: "Preserve state, traces, lineage, evidence, decisions, and incidents end to end." },
  { name: "Measure", purpose: "Compare quality, cost, time, human effort, recovery, and risk with a baseline." },
] as const;

export const factorySystemComponents = [
  "Agents", "Models", "Skills", "Tools", "Context", "Runtime", "Policy", "Evals", "Observability", "Human control",
] as const;

export const ecosystemRoles = [
  { name: "FDLC", role: "Defines it.", description: "The open operating model, engineering discipline, and reference architecture.", status: "Open framework", href: "/framework" },
  { name: "Mission Control", role: "Demonstrates it.", description: "The open-source reference implementation with current capability boundaries visible.", status: "Available reference", href: "/mission-control" },
  { name: "The Guide", role: "Teaches it.", description: "The methodology and engineering practices from first principles through operation.", status: "Open methodology", href: "/guide" },
  { name: "FDLC Deploy", role: "Implements it.", description: "A forward-deployed path for proving one bounded factory line in a real environment.", status: "Design partner", href: "/deploy" },
  { name: "FDLC Enterprise", role: "Industrializes it.", description: "The proposed commercial control plane for organizational scale and reliability.", status: "Proposed", href: "/enterprise" },
] as const;

export const lifecycleStages = [
  { id: "discover", number: 1, name: "Discover", purpose: "Find work worth turning into a factory line and establish the baseline.", activities: ["Candidate workflows", "Cycle-time baseline", "Cost and human effort", "Defect and failure rates"], output: "A measured opportunity" },
  { id: "design", number: 2, name: "Design", purpose: "Define the outcome, runtime flow, evidence contract, risk, and human control boundaries.", activities: ["Intended outcome", "Acceptance criteria", "Runtime lifecycle", "Autonomy and escalation"], output: "A factory definition" },
  { id: "assemble", number: 3, name: "Assemble", purpose: "Compose the capabilities and environment required to do the work.", activities: ["Agents and skills", "Tools and MCP", "Context services", "Models and evaluators"], output: "A runnable factory line" },
  { id: "validate", number: 4, name: "Validate", purpose: "Prove that the factory line can operate safely, reliably, and measurably before promotion.", activities: ["Capability evals", "Policy and security tests", "Failure and recovery drills", "End-to-end acceptance"], output: "A release-ready factory version" },
  { id: "deploy", number: 5, name: "Deploy", purpose: "Promote the exact validated factory version into its intended operating environment.", activities: ["Version promotion", "Environment binding", "Change approval", "Rollback readiness"], output: "An active factory line" },
  { id: "operate", number: 6, name: "Operate", purpose: "Run the software-delivery lifecycle durably while managing exceptions and consequential decisions.", activities: ["Runtime orchestration", "State and recovery", "Evidence and decisions", "Human intervention"], output: "Verified software outcomes" },
  { id: "improve", number: 7, name: "Improve", purpose: "Change the factory from validated outcomes, telemetry, incidents, and controlled experiments.", activities: ["Outcome signals", "Failure taxonomy", "Baseline comparison", "Governed promotion"], output: "A governed factory improvement" },
] as const;

export const architectureAreas = [
  {
    id: "intent", number: 1, name: "Intent", short: "Define what should happen and how success will be judged.",
    purpose: "Turn human goals into explicit, reviewable work before execution begins.",
    responsibilities: ["Goals and requirements", "Acceptance criteria", "Planning and decomposition", "Prioritization and specification"],
    components: ["Intent workspace", "Specification store", "Plan registry", "Dependency graph"],
    decisions: ["What outcome matters?", "What is out of scope?", "What evidence will prove success?", "Who can approve change?"],
    failureModes: ["Ambiguous outcomes", "Plans that are treated as disposable prompts", "Unmeasurable acceptance criteria", "Scope drift after approval"],
    maturity: ["Prompt", "Template", "Versioned Plan", "Executable specification", "Outcome-linked portfolio"],
    examples: ["Dependency upgrade policy", "API migration specification", "Vulnerability remediation acceptance criteria"],
    relationships: "Intent supplies the frozen contract that Harness executes, Trust verifies, and Learning may propose changing only through governance.",
  },
  {
    id: "harness", number: 2, name: "Harness", short: "Make execution durable, bounded, observable, and recoverable.",
    purpose: "Control the agent lifecycle outside the model so work survives sessions, failures, and handoffs.",
    responsibilities: ["Execution loop and orchestration", "Durable state and checkpoints", "Scheduling, leases, and handoffs", "Retries, cancellation, and recovery"],
    components: ["Orchestrator", "Worker runtime", "State machine", "Checkpoint store", "Sandbox adapter"],
    decisions: ["What owns authoritative state?", "When is a lease valid?", "What may be retried?", "How is abandoned work recovered?"],
    failureModes: ["State trapped in chat", "Duplicate side effects", "Zombie workers", "Retry loops without new evidence"],
    maturity: ["Interactive session", "Scripted runner", "Durable Attempt", "Recoverable workflow", "Fleet control"],
    examples: ["Fenced Work Order lease", "Checkpointed migration", "Restart-safe verification run"],
    relationships: "Harness binds Intent, Capability, Model, and Trust into one exact Attempt and returns observations to Learning.",
  },
  {
    id: "capability", number: 3, name: "Capability", short: "Package reusable ways for agents to act in a domain.",
    purpose: "Make agents, skills, tools, context services, and interfaces versioned, discoverable, and governable.",
    responsibilities: ["Agent definitions", "Skills and tools", "MCP and APIs", "Reusable domain capability"],
    components: ["Capability registry", "Agent Factory", "Skill packages", "Tool gateway", "Context adapters"],
    decisions: ["What should be reusable?", "Which version is admitted?", "What permissions are required?", "How is capability quality evaluated?"],
    failureModes: ["Prompt folders without ownership", "Tool sprawl", "Implicit permissions", "Capabilities promoted without evals"],
    maturity: ["Ad hoc prompt", "Named skill", "Versioned package", "Evaluated registry", "Governed supply chain"],
    examples: ["Repository research skill", "Dependency modernization agent", "Read-only issue tracker tool"],
    relationships: "Capability is selected from Intent, admitted by Trust, run by Harness, and may use one or more Models.",
  },
  {
    id: "model", number: 4, name: "Model", short: "Match reasoning capability to the work without provider lock-in.",
    purpose: "Abstract and route models by capability, quality, latency, cost, and policy.",
    responsibilities: ["Provider abstraction", "Model selection and routing", "Capability matching", "Fallbacks and cost control"],
    components: ["Model catalog", "Routing policy", "Evaluation profile", "Fallback chain", "Cost ledger"],
    decisions: ["What capability does this work require?", "What is the risk ceiling?", "When may a fallback run?", "What result justifies the cost?"],
    failureModes: ["One-model monoculture", "Routing by hype", "Silent fallback", "Optimizing token price instead of outcome cost"],
    maturity: ["Hard-coded model", "Manual choice", "Policy routing", "Evidence-calibrated routing", "Outcome-optimized portfolio"],
    examples: ["Low-cost documentation route", "High-reasoning architecture review", "Deterministic fallback for structured checks"],
    relationships: "Model executes inside the Harness, uses Capability and context, and remains constrained by Trust regardless of intelligence.",
  },
  {
    id: "trust", number: 5, name: "Trust", short: "Decide what may run, what can advance, and what requires judgment.",
    purpose: "Keep authority outside the model and require evidence for consequential state transitions.",
    responsibilities: ["Evaluation and verification", "Policy and security", "Delegated authority", "Evidence, approvals, and oversight"],
    components: ["Policy engine", "Identity service", "Verification plane", "Evidence store", "Approval control"],
    decisions: ["Who is acting for whom?", "What exact authority was delegated?", "Is the verifier independent enough?", "Is the evidence current?"],
    failureModes: ["Self-verification", "Permissions inferred from content", "Stale evidence", "Approval theater"],
    maturity: ["Trust the response", "Human review", "Policy gates", "Independent verification", "Risk-calibrated autonomy"],
    examples: ["Exact-head PR gate", "Security scan receipt", "Human approval for production deployment"],
    relationships: "Trust constrains every other area and separates completion, verification, approval, and release.",
  },
  {
    id: "learning", number: 6, name: "Learning", short: "Improve the factory from validated outcomes under change control.",
    purpose: "Turn real outcomes, failures, cost, and reviewer decisions into bounded improvement proposals.",
    responsibilities: ["Outcome and feedback capture", "Failure taxonomy", "Experiments and baselines", "Controlled improvement"],
    components: ["Learning-signal store", "Eval datasets", "Experiment registry", "Promotion workflow"],
    decisions: ["Is the signal attributable?", "What baseline should change?", "How will regression be detected?", "Who approves promotion?"],
    failureModes: ["Treating memory as learning", "Optimizing on model confidence", "Self-modifying production", "Unversioned prompt drift"],
    maturity: ["No feedback", "Manual lessons", "Structured signals", "Controlled experiments", "Governed continuous learning"],
    examples: ["Failure becomes an eval case", "Routing change tested against a baseline", "Skill revision promoted after canary"],
    relationships: "Learning consumes Trust-approved signals and returns proposed changes to Intent, Capability, Model, or policy—not directly to production.",
  },
] as const;

export const protocolSteps = [
  { id: "intent", number: 1, name: "Intent", question: "What outcome matters?", requiredProof: "Named outcome, constraints, owner, and risk", missionControlMapping: "Mission" },
  { id: "specification", number: 2, name: "Specification", question: "What must be true?", requiredProof: "Versioned requirements, boundaries, and acceptance criteria", missionControlMapping: "Mission Spec" },
  { id: "plan", number: 3, name: "Plan", question: "How will the factory achieve it?", requiredProof: "Approved decomposition, sequence, risk, and verification strategy", missionControlMapping: "Approved Plan" },
  { id: "work-order", number: 4, name: "Work Order", question: "What bounded unit is authorized?", requiredProof: "Scope, risk, authority, and verification contract", missionControlMapping: "WorkOrder + Tasks" },
  { id: "attempt", number: 5, name: "Attempt", question: "What exactly ran?", requiredProof: "Identity, lease, versions, environment, and trace", missionControlMapping: "WorkflowRun / Attempt" },
  { id: "evidence", number: 6, name: "Evidence", question: "What was observed?", requiredProof: "Attributable artifacts bound to the exact candidate", missionControlMapping: "Evidence Envelopes + artifacts" },
  { id: "verification", number: 7, name: "Verification", question: "Does the evidence satisfy the specification?", requiredProof: "Independent checks against exact criteria", missionControlMapping: "Verification Run + receipts + Quality Gate" },
  { id: "approval", number: 8, name: "Approval", question: "May this consequence proceed?", requiredProof: "Authorized, attributable, reasoned decision", missionControlMapping: "Plan approval + WorkOrder acceptance" },
  { id: "release", number: 9, name: "Release", question: "What was promoted?", requiredProof: "Exact artifact, current policy, and rollback readiness", missionControlMapping: "PR currentness + separate release records" },
  { id: "outcome", number: 10, name: "Outcome", question: "Did the intended result hold in reality?", requiredProof: "Observed technical, operational, and user result", missionControlMapping: "Production feedback + outcome records" },
  { id: "learning-signal", number: 11, name: "Learning Signal", question: "What should change in the factory?", requiredProof: "Attributable outcome and a controlled improvement proposal", missionControlMapping: "LearningSignal + governed promotion" },
] as const;

export const manifesto = [
  { number: 1, principle: "Intent must be explicit before execution begins.", explanation: "A factory cannot govern an implied objective. The outcome, constraints, owner, and proof of success must be visible before capability is delegated.", implication: "Reject work that cannot state its outcome and acceptance criteria." },
  { number: 2, principle: "The Plan is a governed artifact.", explanation: "A Plan is not disposable chain-of-thought or a chat summary. It is a versioned, reviewable commitment that defines scope, sequence, risk, and evidence expectations.", implication: "Approval binds one exact Plan revision; changes require a new decision." },
  { number: 3, principle: "Every agent has an identity, sponsor, and bounded authority.", explanation: "Capability does not confer permission. Every action must be attributable to an identity acting for a named sponsor within explicit limits.", implication: "Resolve identity, repository, tools, budget, and expiry before execution." },
  { number: 4, principle: "Execution must be isolated, observable, and recoverable.", explanation: "Autonomous work will fail. Safe operation depends on containing effects, preserving state, seeing what happened, and resuming without rewriting history.", implication: "Use isolated environments, durable Attempts, checkpoints, and fenced leases." },
  { number: 5, principle: "Producers should not be their only verifier.", explanation: "The system that created a material change shares assumptions with that change. Independent verification reduces correlated error and makes disagreement inspectable.", implication: "Separate candidate production from verification authority." },
  { number: 6, principle: "State transitions require evidence.", explanation: "An agent reporting completion is an assertion. Progression requires current, attributable proof bound to the exact subject and acceptance criterion.", implication: "Fail closed when evidence is missing, stale, conflicting, or unrelated." },
  { number: 7, principle: "Autonomy must be earned through measured performance.", explanation: "Autonomy is not a product setting to maximize. It should expand only for bounded work classes with reliable verification and a demonstrated operating history.", implication: "Raise autonomy by risk class, and demote immediately when evidence regresses." },
  { number: 8, principle: "Human attention belongs at consequential boundaries.", explanation: "Humans are not fallback processors for routine activity. Their judgment is most valuable where risk, ambiguity, authority, or irreversible consequences are present.", implication: "Route decisions and exceptions—not activity feeds—to people." },
  { number: 9, principle: "Learning must come from validated outcomes, not merely model confidence.", explanation: "Confidence and memory do not establish improvement. Learning requires attributable outcomes, reviewed signals, controlled comparison, and governed promotion.", implication: "Let the factory propose changes; never let it silently rewrite its own controls." },
  { number: 10, principle: "The value of a factory is measured in verified outcomes, not generated tokens.", explanation: "Generation is activity. The factory creates value only when an accepted outcome is delivered with known quality, cost, effort, and risk.", implication: "Optimize cost per verified outcome and human review minutes—not output volume." },
] as const;

export const maturityLevels = [
  { level: 0, name: "Ad Hoc Prompting", description: "Individuals manually prompt AI tools with little shared process or retained evidence.", operatingModel: "Personal experimentation", nextMove: "Choose one bounded workflow and baseline its current cost, time, quality, and human effort." },
  { level: 1, name: "Assisted Development", description: "AI assists developers, while people still coordinate and own each workflow step.", operatingModel: "Human-led work with AI support", nextMove: "Make intent and acceptance criteria reusable before adding more autonomy." },
  { level: 2, name: "Governed Agents", description: "Agents have bounded identities, permissions, policies, and measurable execution.", operatingModel: "Delegated units with explicit controls", nextMove: "Persist Plans, Work Orders, Attempts, and recovery state outside individual sessions." },
  { level: 3, name: "Orchestrated Workflows", description: "Multiple capabilities operate through durable plans, work states, handoffs, and recovery.", operatingModel: "Durable governed workflows", nextMove: "Define independent verification contracts and evidence gates for one repeatable line." },
  { level: 4, name: "Verified Factory Lines", description: "Repeatable workflows use explicit verification contracts, evidence, policy, and quality gates.", operatingModel: "Outcome-producing factory lines", nextMove: "Connect accepted work to production outcomes, cost, reviewer effort, and regression data." },
  { level: 5, name: "Continuously Learning Factory", description: "Validated outcomes drive controlled improvements to routing, skills, evaluators, policy, and configuration.", operatingModel: "Governed continuous improvement", nextMove: "Keep promotion governed and continuously test that autonomy remains justified." },
] as const;

const optionLabels = ["Not established", "Individual / manual", "Documented", "Governed", "Verified", "Continuously improved"] as const;

export const maturityDimensions = [
  ["intent", "Intent", "How consistently are outcomes, constraints, and success measures explicit before work begins?"],
  ["planning", "Planning", "How durable, versioned, and reviewable are implementation Plans?"],
  ["governance", "Agent governance", "How clearly are agent identity, sponsor, authority, and budget bounded?"],
  ["execution", "Execution", "How durable, isolated, observable, and recoverable is agent work?"],
  ["verification", "Verification", "How independently and deterministically is each exact candidate checked?"],
  ["security", "Security", "How consistently are policy, secrets, data, tools, and supply-chain boundaries enforced?"],
  ["oversight", "Human oversight", "How precisely is human attention routed to consequential decisions?"],
  ["observability", "Observability", "Can you reconstruct runs, costs, failures, evidence, and decisions end to end?"],
  ["learning", "Learning", "Do validated outcomes drive controlled changes to the factory?"],
  ["reuse", "Reuse", "Are agents, skills, tools, evaluators, and patterns versioned and reusable?"],
  ["scale", "Scale", "Can proven factory lines operate reliably across teams and repositories?"],
].map(([id, name, question]) => ({ id, name, question, options: optionLabels.map((label, score) => ({ score, label })) })) as readonly {
  id: string; name: string; question: string; options: readonly { score: number; label: string }[];
}[];

export const metrics = [
  ["Verified completion rate", "The share of admitted work that satisfies its verification contract."],
  ["Cost per verified outcome", "Model, compute, tooling, and human-attention cost divided by accepted outcomes."],
  ["Human review minutes", "Judgment time required per accepted change."],
  ["Cycle time", "Elapsed time from approved intent to accepted outcome."],
  ["First-pass verification rate", "Candidates that satisfy required checks without corrective work."],
  ["Reopen rate", "Accepted or closed work that must re-enter governed execution."],
  ["Rollback rate", "Released outcomes that require reversal."],
  ["Escaped defect rate", "Defects discovered after the governed release boundary."],
  ["Policy violation rate", "Attempts blocked or found outside their delegated authority."],
  ["Recovery success rate", "Interrupted work safely resumed or reconciled without loss of lineage."],
  ["Cost by work type", "Outcome cost segmented by repeatable factory-line class."],
  ["Verifier disagreement rate", "Material disagreement among deterministic, model, or human evaluators."],
] as const;

export const factoryLines = [
  ["Dependency modernization", "Upgrade libraries and frameworks across repositories with compatibility proof."],
  ["API migration", "Replace deprecated interfaces with supported patterns and contract tests."],
  ["Vulnerability remediation", "Find, fix, test, and verify known vulnerability classes."],
  ["Quality remediation", "Repair flaky tests, coverage gaps, static-analysis findings, and recurring debt."],
  ["Documentation maintenance", "Detect stale technical documentation and validate updates against source."],
  ["Code review assistance", "Produce evidence-backed findings while leaving consequential decisions to reviewers."],
] as const;
