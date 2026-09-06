import { guideRoot } from "./guide.ts";

export type FactoryCapabilityId =
  | "agents"
  | "models"
  | "skills"
  | "tools"
  | "context"
  | "runtime"
  | "policy"
  | "evals"
  | "observability"
  | "human-control";

export const factoryExplorerCapabilities = [
  {
    id: "agents",
    number: 1,
    name: "Agents",
    architectureArea: "Capability",
    architectureHref: "/architecture#capability",
    responsibility: "Execute named, bounded roles for an accountable sponsor under explicit authority.",
  },
  {
    id: "models",
    number: 2,
    name: "Models",
    architectureArea: "Model",
    architectureHref: "/architecture#model",
    responsibility: "Supply reasoning selected by capability, risk, latency, and cost per accepted outcome.",
  },
  {
    id: "skills",
    number: 3,
    name: "Skills",
    architectureArea: "Capability",
    architectureHref: "/architecture#capability",
    responsibility: "Package versioned domain procedures that agents can discover, invoke, and evaluate.",
  },
  {
    id: "tools",
    number: 4,
    name: "Tools",
    architectureArea: "Capability",
    architectureHref: "/architecture#capability",
    responsibility: "Expose governed actions through scoped, attributable, and auditable interfaces.",
  },
  {
    id: "context",
    number: 5,
    name: "Context",
    architectureArea: "Capability",
    architectureHref: "/architecture#capability",
    responsibility: "Supply the exact repository, policy, and domain information required for the work.",
  },
  {
    id: "runtime",
    number: 6,
    name: "Runtime",
    architectureArea: "Harness",
    architectureHref: "/architecture#harness",
    responsibility: "Persist Attempts, leases, checkpoints, isolation, retries, cancellation, and recovery.",
  },
  {
    id: "policy",
    number: 7,
    name: "Policy",
    architectureArea: "Trust",
    architectureHref: "/architecture#trust",
    responsibility: "Determine what may run, what may advance, and when escalation or approval is required.",
  },
  {
    id: "evals",
    number: 8,
    name: "Evals",
    architectureArea: "Trust",
    architectureHref: "/architecture#trust",
    responsibility: "Test the exact candidate against acceptance, quality, security, and policy criteria.",
  },
  {
    id: "observability",
    number: 9,
    name: "Observability",
    architectureArea: "Harness",
    architectureHref: "/architecture#harness",
    responsibility: "Preserve traces, cost, state changes, evidence, decisions, and incidents end to end.",
  },
  {
    id: "human-control",
    number: 10,
    name: "Human control",
    architectureArea: "Trust",
    architectureHref: "/architecture#trust",
    responsibility: "Place accountable human judgment at material, ambiguous, or irreversible boundaries.",
  },
] as const satisfies ReadonlyArray<{
  id: FactoryCapabilityId;
  number: number;
  name: string;
  architectureArea: string;
  architectureHref: string;
  responsibility: string;
}>;

export const factoryExplorerStages = [
  {
    id: "receive",
    number: 1,
    name: "Receive",
    artifact: "Intent",
    question: "What outcome is worth admitting?",
    purpose: "Turn a request into explicit intent before the factory spends authority or compute.",
    proof: "A named outcome, constraints, accountable owner, initial risk, and proof of success.",
    stateEarned: "Intent admitted",
    guideHref: `${guideRoot}/stages/01-builder-intent`,
    participation: "Frame the request, retrieve its operating context, and establish who may authorize it.",
    capabilities: ["agents", "context", "policy", "human-control"],
    focusCapability: "context",
  },
  {
    id: "specify",
    number: 2,
    name: "Specify",
    artifact: "Specification",
    question: "What must be true?",
    purpose: "Convert intent into a versioned contract the producer and verifier can evaluate independently.",
    proof: "Requirements, boundaries, acceptance criteria, and evidence expectations bound to one revision.",
    stateEarned: "Specification frozen",
    guideHref: `${guideRoot}/02-design/06-intent-and-specification-engineering`,
    participation: "Resolve ambiguity, bind domain knowledge, and define the policy-aware acceptance contract.",
    capabilities: ["agents", "skills", "context", "policy", "human-control"],
    focusCapability: "context",
  },
  {
    id: "plan",
    number: 3,
    name: "Plan",
    artifact: "Plan",
    question: "How will the factory achieve it?",
    purpose: "Choose a reviewable path, decomposition, capability set, risk posture, and verification strategy.",
    proof: "An approved plan revision with sequence, dependencies, budgets, escalation, and verification strategy.",
    stateEarned: "Plan governed",
    guideHref: `${guideRoot}/stages/02-plan`,
    participation: "Reason over the specification, select capabilities, and bind the work to explicit limits.",
    capabilities: ["agents", "models", "skills", "context", "policy", "human-control"],
    focusCapability: "agents",
  },
  {
    id: "execute",
    number: 4,
    name: "Execute",
    artifact: "Work Order · Attempt",
    question: "What bounded work actually ran?",
    purpose: "Run the approved work as attributable Attempts inside a governed execution boundary.",
    proof: "Scope, identity, delegated authority, versions, environment, lease, checkpoints, and execution trace.",
    stateEarned: "Candidate produced",
    guideHref: `${guideRoot}/stages/04-execute-through-harness`,
    participation: "Coordinate intelligence and tools inside an isolated, observable, recoverable runtime.",
    capabilities: ["agents", "models", "skills", "tools", "context", "runtime", "policy", "observability"],
    focusCapability: "runtime",
  },
  {
    id: "verify",
    number: 5,
    name: "Verify",
    artifact: "Evidence · Verification",
    question: "Does the exact candidate satisfy the specification?",
    purpose: "Evaluate the produced candidate independently and bind every finding to the exact subject.",
    proof: "Current, attributable evidence plus independent checks against each acceptance and policy criterion.",
    stateEarned: "Candidate verified",
    guideHref: `${guideRoot}/stages/06-evaluate`,
    participation: "Collect evidence, run independent checks, preserve lineage, and fail closed on missing proof.",
    capabilities: ["agents", "models", "skills", "tools", "context", "runtime", "policy", "evals", "observability"],
    focusCapability: "evals",
  },
  {
    id: "approve",
    number: 6,
    name: "Approve",
    artifact: "Approval",
    question: "May this consequence proceed?",
    purpose: "Apply accountable authority only after verification establishes the candidate's current state.",
    proof: "An attributable, reasoned decision by an authorized policy or human decision-maker.",
    stateEarned: "Release authorized",
    guideHref: `${guideRoot}/02-design/07-governance-policy-and-risk-proportional-approval`,
    participation: "Present decision-grade evidence and route material consequences to the correct authority.",
    capabilities: ["context", "policy", "evals", "observability", "human-control"],
    focusCapability: "human-control",
  },
  {
    id: "release",
    number: 7,
    name: "Release",
    artifact: "Release",
    question: "What exact artifact was promoted?",
    purpose: "Promote only the accepted candidate while preserving identity, currentness, and rollback readiness.",
    proof: "The exact artifact, current approval and policy state, target environment, and tested recovery path.",
    stateEarned: "Artifact released",
    guideHref: `${guideRoot}/stages/08-deliver-software`,
    participation: "Perform the bounded promotion, enforce release policy, and retain a recoverable audit trail.",
    capabilities: ["tools", "runtime", "policy", "observability", "human-control"],
    focusCapability: "policy",
  },
  {
    id: "observe",
    number: 8,
    name: "Observe",
    artifact: "Outcome",
    question: "Did the intended result hold in reality?",
    purpose: "Compare production behavior with the original outcome instead of treating release as success.",
    proof: "Attributable technical, operational, and user signals collected against the stated success measure.",
    stateEarned: "Outcome established",
    guideHref: `${guideRoot}/05-operate/35-observability-telemetry-and-forensics`,
    participation: "Collect production signals, detect regressions, and keep the result linked to its originating intent.",
    capabilities: ["tools", "context", "runtime", "policy", "evals", "observability", "human-control"],
    focusCapability: "observability",
  },
  {
    id: "learn",
    number: 9,
    name: "Learn",
    artifact: "Learning Signal",
    question: "What should change in the factory?",
    purpose: "Turn validated outcomes into controlled improvement proposals, never silent self-modification.",
    proof: "An attributable outcome, baseline comparison, bounded proposal, regression test, and promotion authority.",
    stateEarned: "Improvement proposed",
    guideHref: `${guideRoot}/stages/07-improve`,
    participation: "Diagnose the signal, test a bounded change, and return it through governance before promotion.",
    capabilities: ["models", "skills", "context", "policy", "evals", "observability", "human-control"],
    focusCapability: "skills",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  number: number;
  name: string;
  artifact: string;
  question: string;
  purpose: string;
  proof: string;
  stateEarned: string;
  guideHref: string;
  participation: string;
  capabilities: ReadonlyArray<FactoryCapabilityId>;
  focusCapability: FactoryCapabilityId;
}>;
