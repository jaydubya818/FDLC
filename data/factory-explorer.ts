import { publicExecutionStages, type PublicExecutionStageId } from "./fdlc.ts";

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

type FactoryExplorerStageDetail = {
  question: string;
  proof: string;
  stateEarned: string;
  guideHref: string;
  participation: string;
  capabilities: ReadonlyArray<FactoryCapabilityId>;
  focusCapability: FactoryCapabilityId;
};

const factoryExplorerStageDetails = {
  intent: {
    question: "What outcome is worth admitting?",
    proof: "A named outcome, constraints, accountable owner, risk, acceptance criteria, and evidence expectations.",
    stateEarned: "Intent specified",
    guideHref: "/guide/stages/01-builder-intent",
    participation: "Frame the request, retrieve its operating context, resolve ambiguity, and establish who may authorize it.",
    capabilities: ["agents", "skills", "context", "policy", "human-control"],
    focusCapability: "context",
  },
  plan: {
    question: "What bounded path is authorized?",
    proof: "An approved Plan revision and Work Order with scope, dependencies, budgets, risk, and verification strategy.",
    stateEarned: "Work authorized",
    guideHref: "/guide/stages/02-plan",
    participation: "Reason over the specification, select capabilities, and bind the work to explicit limits.",
    capabilities: ["agents", "models", "skills", "context", "policy", "human-control"],
    focusCapability: "agents",
  },
  execute: {
    question: "What bounded work actually ran?",
    proof: "Scope, identity, delegated authority, versions, environment, lease, checkpoints, and execution trace.",
    stateEarned: "Candidate produced",
    guideHref: "/guide/stages/04-execute-through-harness",
    participation: "Coordinate intelligence and tools inside an isolated, observable, recoverable runtime.",
    capabilities: ["agents", "models", "skills", "tools", "context", "runtime", "policy", "observability"],
    focusCapability: "runtime",
  },
  prove: {
    question: "Has the exact candidate earned progression?",
    proof: "Current, attributable evidence, independent checks against each criterion, and an authorized reasoned decision.",
    stateEarned: "Release authorized",
    guideHref: "/guide/stages/06-evaluate",
    participation: "Collect evidence, run independent checks, preserve lineage, and route the decision to the correct authority.",
    capabilities: ["agents", "models", "skills", "tools", "context", "runtime", "policy", "evals", "observability", "human-control"],
    focusCapability: "evals",
  },
  release: {
    question: "What was promoted, and did it hold?",
    proof: "The exact artifact, current approval, target environment, tested recovery path, and attributable outcome signals.",
    stateEarned: "Outcome observed",
    guideHref: "/guide/stages/08-deliver-software",
    participation: "Perform the bounded promotion, retain a recoverable audit trail, and collect production evidence.",
    capabilities: ["tools", "context", "runtime", "policy", "evals", "observability", "human-control"],
    focusCapability: "policy",
  },
  learn: {
    question: "What should change in the factory?",
    proof: "An attributable outcome, baseline comparison, bounded proposal, regression test, and promotion authority.",
    stateEarned: "Improvement proposed",
    guideHref: "/guide/stages/07-improve",
    participation: "Diagnose the signal, test a bounded change, and return it through governance before promotion.",
    capabilities: ["agents", "models", "skills", "context", "policy", "evals", "observability", "human-control"],
    focusCapability: "skills",
  },
} as const satisfies Record<PublicExecutionStageId, FactoryExplorerStageDetail>;

export const factoryExplorerStages = publicExecutionStages.map((stage) => ({
  ...stage,
  ...factoryExplorerStageDetails[stage.id],
}));
