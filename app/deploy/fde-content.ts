export const fdeWorkflow = [
  { number: "01", name: "Discover", description: "Ingest enterprise source evidence and identify a bounded workflow worth modeling.", input: "Evidence + baseline", output: "Source map", evidence: "Attributed documents and observations" },
  { number: "02", name: "Define", description: "Extract candidate claims and model the current workflow without treating inference as truth.", input: "Source map", output: "Current-state model", evidence: "Claim-to-source lineage" },
  { number: "03", name: "Assemble", description: "Design target workflow, capabilities, execution architecture, economics, and authority boundaries.", input: "Reviewed current state", output: "Draft Factory Definition", evidence: "Decisions, assumptions, and unresolved claims" },
  { number: "04", name: "Qualify", description: "Review the definition against readiness, verification, policy, rollout, and rollback requirements.", input: "Draft definition", output: "Review decision", evidence: "Attributable human approval or rejection" },
  { number: "05", name: "Operate", description: "Prepare approved definition and qualification material for Mission Control validation.", input: "Approved definition", output: "Typed handoff request", evidence: "Version, digest, provenance, and approval" },
  { number: "06", name: "Transfer & Scale", description: "Use independently verified runtime outcomes to inform controlled definition changes.", input: "Mission Control outcome evidence", output: "Change proposal", evidence: "Baseline comparison + governed review" },
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
  ["factory", "Current-state model", "An evidence-backed description of how the selected workflow operates today."],
  ["control", "Authority model", "The people, permissions, decisions, and escalation boundaries the factory requires."],
  ["evaluation", "Qualification requirements", "The tests and evidence Mission Control must require before execution."],
  ["verify", "Verification contract", "The evidence required before state may advance."],
  ["measure", "Outcome baseline", "The before-state against which value is measured."],
  ["economics", "Economics model", "Attributable cost per attempt and accepted outcome."],
  ["playbook", "Rollout and recovery plan", "Roles, exceptions, rollback, and day-two operating intent."],
  ["reuse", "Capability requirements", "The agents, tools, profiles, and policy implementations to qualify."],
  ["scale", "Handoff material", "Digest-bound approved intent for validation by Mission Control."],
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
