import { governingStage, type GoverningStageId } from "./governing-lifecycle.ts";

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

type ExplorerStageContent = {
  id: GoverningStageId;
  artifact: string;
  question: string;
  purpose: string;
  proof: string;
  stateEarned: string;
  participation: string;
  capabilities: ReadonlyArray<FactoryCapabilityId>;
  focusCapability: FactoryCapabilityId;
};

// Explorer copy per governing stage. Stage names, order and Guide links come from data/governing-lifecycle.ts.
const explorerContent = [
  {
    id: "intent",
    artifact: "Intent · Specification",
    question: "What outcome is worth admitting, and what must be true?",
    purpose: "Turn a request into explicit intent and a versioned contract before the factory spends authority or compute.",
    proof: "A named outcome, accountable owner, constraints, initial risk, acceptance criteria and evidence expectations bound to one revision.",
    stateEarned: "Intent admitted",
    participation: "Frame the request, resolve ambiguity, bind domain context and establish who may authorize the work.",
    capabilities: ["agents", "skills", "context", "policy", "human-control"],
    focusCapability: "context",
  },
  {
    id: "planning",
    artifact: "Plan · Work Order",
    question: "How will the factory achieve it, and what bounded work is authorized?",
    purpose: "Choose a reviewable path, decomposition, capability set, risk posture and verification strategy, then authorize bounded Work Orders.",
    proof: "An approved plan revision with sequence, dependencies, budgets and escalation, plus Work Orders that carry scope, authority and a verification contract.",
    stateEarned: "Plan governed",
    participation: "Reason over the specification, select capabilities, and bind the work to explicit limits.",
    capabilities: ["agents", "models", "skills", "context", "policy", "human-control"],
    focusCapability: "agents",
  },
  {
    id: "execution",
    artifact: "Attempt",
    question: "What bounded work actually ran?",
    purpose: "Run the authorized Work Order as attributable Attempts inside a governed execution boundary.",
    proof: "Identity, delegated authority, versions, environment, lease, checkpoints and execution trace.",
    stateEarned: "Candidate produced",
    participation: "Coordinate intelligence and tools inside an isolated, observable, recoverable runtime.",
    capabilities: ["agents", "models", "skills", "tools", "context", "runtime", "policy", "observability"],
    focusCapability: "runtime",
  },
  {
    id: "evidence",
    artifact: "Evidence",
    question: "What was observed about the exact candidate?",
    purpose: "Bind attributable proof from the exact execution to the exact candidate before anyone judges it.",
    proof: "Change digest, tool receipts, test results and configuration bound to the candidate, with secrets redacted.",
    stateEarned: "Evidence bound",
    participation: "Collect receipts and traces, preserve lineage and fail closed when proof is missing or stale.",
    capabilities: ["tools", "runtime", "policy", "evals", "observability"],
    focusCapability: "observability",
  },
  {
    id: "verification",
    artifact: "Verification",
    question: "Does the exact candidate satisfy the specification?",
    purpose: "Evaluate the produced candidate independently and bind every finding to the exact subject.",
    proof: "Independent checks against each acceptance and policy criterion, using current evidence for the exact candidate.",
    stateEarned: "Candidate verified",
    participation: "Run independent checks against the frozen contract and return failures for correction.",
    capabilities: ["agents", "models", "skills", "tools", "context", "runtime", "policy", "evals", "observability"],
    focusCapability: "evals",
  },
  {
    id: "approval",
    artifact: "Approval",
    question: "May this consequence proceed?",
    purpose: "Apply accountable authority only after verification establishes the candidate's current state.",
    proof: "An attributable, reasoned decision by an authorized policy or human decision-maker.",
    stateEarned: "Release authorized",
    participation: "Present decision-grade evidence and route material consequences to the correct authority.",
    capabilities: ["context", "policy", "evals", "observability", "human-control"],
    focusCapability: "human-control",
  },
  {
    id: "release",
    artifact: "Release",
    question: "What exact artifact was promoted?",
    purpose: "Promote only the accepted candidate while preserving identity, currentness, and rollback readiness.",
    proof: "The exact artifact, current approval and policy state, target environment, and tested recovery path.",
    stateEarned: "Artifact released",
    participation: "Perform the bounded promotion, enforce release policy, and retain a recoverable audit trail.",
    capabilities: ["tools", "runtime", "policy", "observability", "human-control"],
    focusCapability: "policy",
  },
  {
    id: "outcomes",
    artifact: "Outcome",
    question: "Did the intended result hold in reality?",
    purpose: "Compare production behavior with the original outcome instead of treating release as success.",
    proof: "Attributable technical, operational, and user signals collected against the stated success measure.",
    stateEarned: "Outcome established",
    participation: "Collect production signals, detect regressions, and keep the result linked to its originating intent.",
    capabilities: ["tools", "context", "runtime", "policy", "evals", "observability", "human-control"],
    focusCapability: "observability",
  },
  {
    id: "learning",
    artifact: "Learning Signal",
    question: "What should change in the factory?",
    purpose: "Turn validated outcomes into controlled improvement proposals, never silent self-modification.",
    proof: "An attributable outcome, baseline comparison, bounded proposal, regression test, and promotion authority.",
    stateEarned: "Improvement proposed",
    participation: "Diagnose the signal, test a bounded change, and return it through governance before promotion.",
    capabilities: ["models", "skills", "context", "policy", "evals", "observability", "human-control"],
    focusCapability: "skills",
  },
] as const satisfies ReadonlyArray<ExplorerStageContent>;

export const factoryExplorerStages = explorerContent.map((content, index) => {
  const stage = governingStage(content.id);
  return { ...content, number: index + 1, name: stage.name, guideHref: stage.guideHref, guideLabel: stage.guideLabel };
});
