export const fdeWorkflow = [
  { number: "01", name: "Discover", description: "Understand the engineering system and identify work worth turning into a factory line.", input: "Real workflow + baseline", output: "Opportunity map", evidence: "Cycle time, defects, cost, human effort" },
  { number: "02", name: "Define", description: "Specify the intended outcome, operating boundaries, capabilities, and proof contract.", input: "Qualified opportunity", output: "Factory Definition", evidence: "Acceptance criteria + authority map" },
  { number: "03", name: "Assemble", description: "Compose the agents, models, tools, context, execution environment, and policy.", input: "Factory Definition", output: "Factory Version", evidence: "Versioned capability manifest" },
  { number: "04", name: "Qualify", description: "Prove the line before it is allowed to perform consequential work.", input: "Candidate version", output: "Qualification record", evidence: "Eval, security, recovery, and policy results" },
  { number: "05", name: "Operate", description: "Run bounded WorkOrders through Mission Control with evidence at every transition.", input: "Authorized WorkOrders", output: "Verified outcomes", evidence: "Attempts, decisions, cost, and traces" },
  { number: "06", name: "Transfer & Scale", description: "Turn what worked into reusable organizational capability and an explicit scale path.", input: "Proven operating line", output: "Operating playbook", evidence: "Baseline comparison + scale gates" },
] as const;

export const factoryDefinition = [
  ["Intent", "The outcome the factory exists to produce."],
  ["Workflow", "The bounded path from request to accepted outcome."],
  ["Agents", "Named roles with explicit responsibilities and identity."],
  ["Models", "Routable intelligence selected for each responsibility."],
  ["Tools", "Versioned capabilities through which work affects systems."],
  ["Context", "Approved knowledge assembled for the current WorkOrder."],
  ["Execution", "Isolated, durable, recoverable runtime boundaries."],
  ["Verification", "Independent evidence that criteria are satisfied."],
  ["Policy", "Machine-enforced permissions, limits, and escalation."],
  ["Human Authority", "Consequential decisions reserved for accountable people."],
  ["Economics", "Attributable resource cost per accepted outcome."],
  ["Outcomes", "Production results compared with the original intent."],
] as const;

export const engagementPhases = [
  {
    number: "01",
    name: "FDLC Readiness",
    purpose: "Understand the system and choose the right first factory line.",
    inputs: ["Workflows", "Repositories", "Architecture", "Baseline metrics", "Governance", "Constraints"],
    work: ["Maturity assessment", "Opportunity discovery", "Workflow decomposition", "Baseline measurement", "Factory Definition"],
    output: "A qualified Lighthouse candidate.",
  },
  {
    number: "02",
    name: "FDLC Lighthouse",
    purpose: "Build one real governed production line and prove whether it creates value.",
    inputs: ["Factory Definition", "Mission Control", "Factory Version", "Real WorkOrders", "Independent verification"],
    work: ["Cycle time", "Quality and defects", "Attributable cost", "Human effort", "Verification reliability"],
    output: "Evidence that the operating model works—or evidence that it does not.",
  },
  {
    number: "03",
    name: "FDLC Scale",
    purpose: "Turn a proven line into organizational capability.",
    inputs: ["Repositories", "Teams", "Workflow classes", "Shared capabilities", "Policies"],
    work: ["Evaluation", "Economics", "Operating controls", "Reuse boundaries", "Scale qualification"],
    output: "A governed path to expansion, conditional on Lighthouse evidence.",
  },
] as const;

export const deliverables = [
  ["definition", "Factory Definition", "A complete, reviewable specification for the line."],
  ["factory", "Governed production line", "The bounded system that performs the selected workflow."],
  ["control", "Mission Control configuration", "Authority, execution, evidence, and recovery controls."],
  ["evaluation", "Evaluation suite", "Repeatable tests for capabilities and end-to-end outcomes."],
  ["verify", "Verification contract", "The evidence required before state may advance."],
  ["measure", "Outcome baseline", "The before-state against which value is measured."],
  ["economics", "Economics model", "Attributable cost per attempt and accepted outcome."],
  ["playbook", "Operating playbook", "Roles, exceptions, recovery, and day-two practices."],
  ["reuse", "Reusable capabilities", "Proven skills, tools, profiles, and policy components."],
  ["scale", "Scale roadmap", "The evidence gates for extending the operating model."],
] as const;

export const lighthouseCandidates = [
  ["dependency", "Dependency modernization", "Upgrade libraries and frameworks with compatibility proof."],
  ["api", "API migration", "Replace deprecated interfaces with supported patterns and contract tests."],
  ["shield", "Vulnerability remediation", "Find, fix, test, and verify known vulnerability classes."],
  ["quality", "Quality remediation", "Repair flaky tests, coverage gaps, and recurring static-analysis debt."],
  ["docs", "Documentation maintenance", "Detect stale technical documentation and validate it against source."],
  ["review", "Code review assistance", "Produce evidence-backed findings while reviewers retain decisions."],
  ["test", "Test modernization", "Move brittle suites toward stable, meaningful behavioral proof."],
  ["framework", "Framework migration", "Migrate repeated application patterns with explicit compatibility gates."],
  ["pipeline", "CI/CD remediation", "Repair repeatable delivery failures with observable acceptance criteria."],
] as const;

export const qualificationFacts = [
  ["AWS qualification account", "083665737366"],
  ["Region", "us-east-1"],
  ["Qualification hostname", "qual.factory-engineer.fdlc.ai"],
  ["Convex deployment", "calm-buffalo-854"],
  ["Mission Control workspace", "mission-control://qualification/fdlc-phase-3"],
  ["Mission Control project", "j17ve66cdc005ntgr6qj31b0fs8dwc62"],
] as const;

export const qualifiedBaselineDeployment = "dpl_BHi24iX4NmZZ8WNyuspDHaYg5DX2";
export const rollbackDeployment = "dpl_3dH5VgLN9abgG9B8L9vdGKNnHiCn";
