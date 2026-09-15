export const guideRoot = "/guide";

export const guideParts = [
  {
    id: "understand", number: "I", verb: "Understand", title: "See the factory as a system", question: "What is an AI software factory, and why does it require a lifecycle?", range: "Chapters 1–3", startHref: `${guideRoot}/01-understand/01-why-software-engineering-is-changing`,
    overview: "Start with the category boundary: the agent is a worker, not the factory. The factory is the governed system that turns intent into validated outcomes.",
    retain: ["A software factory is an operating model, not a coding tool.", "Execution never creates its own authority.", "Validated customer value—not generated code—is the outcome."],
    chapters: [
      [1, "Why software engineering is changing", "Why coordination, verification, and operating discipline become the bottleneck.", `${guideRoot}/01-understand/01-why-software-engineering-is-changing`],
      [2, "The factory in one view", "The full system, its boundaries, architecture, lifecycle, and value stream.", `${guideRoot}/01-understand/02-the-factory-in-one-view`],
      [3, "First principles: trust, evidence, and authority", "How bounded autonomy earns confidence through proof.", `${guideRoot}/01-understand/03-first-principles-trust-evidence-and-authority`],
    ],
  },
  {
    id: "design", number: "II", verb: "Design", title: "Define ownership, records, and authority", question: "What must be true before any agent runs?", range: "Chapters 4–10", startHref: `${guideRoot}/02-design/04-the-human-agent-operating-model`,
    overview: "Design turns a desired outcome into durable records, decision rights, measurable proof, and a bounded execution envelope.",
    retain: ["Intent and acceptance criteria precede execution.", "Plans are governed, versioned artifacts.", "Risk determines authority and approval—not agent confidence."],
    chapters: [
      [4, "The human–agent operating model", "Responsibility, accountability, and operator attention.", `${guideRoot}/02-design/04-the-human-agent-operating-model`],
      [5, "Authoritative records: from company to release", "The durable objects that preserve authority, causality, and lineage.", `${guideRoot}/02-design/05-authoritative-records`],
      [6, "Intent and specification engineering", "Measurable outcomes, constraints, and executable requirements.", `${guideRoot}/02-design/06-intent-and-specification-engineering`],
      [7, "Governance, policy, and risk-proportional approval", "How policy and risk bound action.", `${guideRoot}/02-design/07-governance-policy-and-risk-proportional-approval`],
      [8, "Economics, metrics, and human attention", "Cost per trusted outcome and review effort.", `${guideRoot}/02-design/08-economics-metrics-and-human-attention`],
      [9, "Tokenomics and factory economics", "How architecture, budgets, and context drive full factory cost.", `${guideRoot}/02-design/09-tokenomics-and-factory-economics`],
      [10, "Multi-repository design and coordinated delivery", "Scope, ownership, dependencies, and release order across repositories.", `${guideRoot}/02-design/10-multi-repository-design`],
    ],
  },
  {
    id: "build", number: "III", verb: "Build", title: "Assemble capability and execution", question: "How do you build the system around the agent?", range: "Chapters 11–26", startHref: `${guideRoot}/03-build/11-the-agent-factory`,
    overview: "Build the reusable capabilities, model abstraction, context systems, runtime, harnesses, environments, and workflows that make governed execution repeatable.",
    retain: ["Use the lightest orchestration model that satisfies the workflow.", "Capabilities are versioned supply, not loose prompts.", "The sandbox defines what intelligence is allowed to affect."],
    chapters: [
      [11, "The Agent Factory", "Create and govern agents, skills, tools, profiles, and configurations.", `${guideRoot}/03-build/11-the-agent-factory`],
      [12, "Skills as packages", "Package and evaluate reusable capabilities rather than loose prompt files.", `${guideRoot}/03-build/12-skills-as-packages`],
      [13, "Control plane, orchestrator, and execution plane", "Separate authority, coordination, and work.", `${guideRoot}/03-build/13-control-plane-orchestrator-and-execution-plane`],
      [14, "Durable execution: tasks, attempts, leases, and recovery", "Survive failures without losing truth.", `${guideRoot}/03-build/14-durable-execution`],
      [15, "Coding harnesses and agent protocols", "Own the execution contract and place interoperability protocols deliberately.", `${guideRoot}/03-build/15-coding-harnesses-and-agent-protocols`],
      [16, "Harness engineering", "Engineer the bounded operating environment around Agents without collapsing Runtime, orchestration, or authority into it.", `${guideRoot}/03-build/16-harness-engineering`],
      [17, "Development environments, sandboxes, and compute", "Contain side effects and prove cleanup.", `${guideRoot}/03-build/17-development-environments-sandboxes-and-compute`],
      [18, "Agent architecture: loop, MCP, tools, context, and memory", "Compose one goal-directed worker from a Model, Loop, Harness, capabilities, context, state, and evaluation.", `${guideRoot}/03-build/18-agent-architecture`],
      [19, "Data, knowledge, and semantic engineering", "Prepare attributable knowledge and semantic contracts.", `${guideRoot}/03-build/19-data-knowledge-and-semantic-engineering`],
      [20, "Context engineering", "Compile the minimum sufficient, permission-aware Context Package.", `${guideRoot}/03-build/20-context-engineering`],
      [21, "Models and capability selection", "Treat models as qualified, replaceable capability profiles.", `${guideRoot}/03-build/21-models-and-capability-selection`],
      [22, "Routing and the escalation ladder", "Route work to the cheapest qualified capability and escalate on evidence.", `${guideRoot}/03-build/22-routing-and-the-escalation-ladder`],
      [23, "Agent and loop engineering", "Choose the least agentic mechanism and coordinate through explicit contracts.", `${guideRoot}/03-build/23-agent-and-loop-engineering`],
      [24, "Loop engineering patterns and defaults", "Bound retries and cost, detect oscillation, and stop honestly.", `${guideRoot}/03-build/24-loop-engineering-patterns-and-defaults`],
      [25, "The 12-layer production AI agent stack", "Place each production responsibility in a named layer.", `${guideRoot}/03-build/25-the-12-layer-production-ai-agent-stack`],
      [26, "Autonomous engineering workflows", "Give each workflow its own trigger, proof shape, authority, and autonomy.", `${guideRoot}/03-build/26-autonomous-engineering-workflows`],
    ],
  },
  {
    id: "prove", number: "IV", verb: "Prove", title: "Verify exact outcomes", question: "How do you know the output is correct, safe, and releasable?", range: "Chapters 27–33", startHref: `${guideRoot}/04-prove/27-quality-and-evidence-architecture`,
    overview: "Prove separates a producer’s completion claim from independent, current evidence that an exact candidate satisfies an explicit contract.",
    retain: ["Producers should not be their only verifier.", "Evidence must bind to an exact subject.", "Passing verification makes work eligible; it does not authorize every consequence."],
    chapters: [
      [27, "Quality and evidence architecture", "Build criterion-level proof and evidence lineage.", `${guideRoot}/04-prove/27-quality-and-evidence-architecture`],
      [28, "Testing strategy for agentic change", "Make deterministic, risk-based checks the hard floor.", `${guideRoot}/04-prove/28-testing-strategy-for-agentic-change`],
      [29, "Evaluation engineering", "Compare configurations across representative work and repeated trials.", `${guideRoot}/04-prove/29-evaluation-engineering`],
      [30, "Evals as factory assets", "Operate evaluation datasets, scorers, drift controls, and promotion ladders.", `${guideRoot}/04-prove/30-evals-as-factory-assets`],
      [31, "Quality contracts, proof packages, and certificates", "Compile proof for exact decisions and bounded reuse.", `${guideRoot}/04-prove/31-quality-contracts-proof-packages-and-certificates`],
      [32, "CI/CD, progressive delivery, and production verification", "Carry evidence through build, release, and production.", `${guideRoot}/04-prove/32-cicd-progressive-delivery-and-production-verification`],
      [33, "Security: identity, secrets, threats, and supply chain", "Keep authorization deterministic and external to the model.", `${guideRoot}/04-prove/33-security`],
    ],
  },
  {
    id: "operate", number: "V", verb: "Operate", title: "Run the factory as a platform", question: "How do you operate autonomous work in production?", range: "Chapters 34–38", startHref: `${guideRoot}/05-operate/34-the-factory-as-a-platform`,
    overview: "Operate treats the factory as a production system with explicit ownership, telemetry, incident handling, storage contracts, and a paved road for adoption.",
    retain: ["A truthful blocked state is better than a false success.", "Exceptions and evidence belong ahead of activity feeds.", "The safest paved road also needs to be the fastest."],
    chapters: [
      [34, "The factory as a platform", "Productize the common control and delivery path.", `${guideRoot}/05-operate/34-the-factory-as-a-platform`],
      [35, "Observability, telemetry, and forensics", "Reconstruct what happened, what was decided, and why.", `${guideRoot}/05-operate/35-observability-telemetry-and-forensics`],
      [36, "Resilience, incidents, and the control tower", "Detect, contain, restore, and prove recovery.", `${guideRoot}/05-operate/36-resilience-incidents-and-the-control-tower`],
      [37, "Control surfaces, event contracts, and storage", "Keep operator views and integrations over one authority model.", `${guideRoot}/05-operate/37-control-surfaces-event-contracts-and-storage`],
      [38, "Enterprise adoption and the infrastructure landscape", "Scale proven paths without forcing a big-bang migration.", `${guideRoot}/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape`],
    ],
  },
  {
    id: "improve", number: "VI", verb: "Improve", title: "Learn without self-authorizing change", question: "How does the factory get better safely?", range: "Chapters 39–44", startHref: `${guideRoot}/06-improve/39-production-feedback-review-and-the-agentic-merge-queue`,
    overview: "Improve converts validated production outcomes and failure evidence into proposals, experiments, and governed new versions.",
    retain: ["Learning can be autonomous; promotion should be governed.", "Every meaningful failure should make the system harder to fail the same way twice.", "Never jump straight to training."],
    chapters: [
      [39, "Production feedback, automated review, and the agentic merge queue", "Turn downstream signals into governed work and attention.", `${guideRoot}/06-improve/39-production-feedback-review-and-the-agentic-merge-queue`],
      [40, "Governed learning", "Move from outcome signal to tested Improvement Candidate.", `${guideRoot}/06-improve/40-governed-learning`],
      [41, "Meta-loops and the closed-loop factory", "Evaluate proposed factory changes without self-authorization.", `${guideRoot}/06-improve/41-meta-loops-and-the-closed-loop-factory`],
      [42, "Mission Control as a living case study", "Inspect one control-plane implementation with its evidence and gaps visible.", `${guideRoot}/06-improve/42-mission-control-as-a-living-case-study`],
      [43, "Mastering the factory: explaining, defending, and building it", "Build the fluency to implement and lead the operating model.", `${guideRoot}/06-improve/43-mastering-the-factory`],
      [44, "Where this is going", "Separate likely directions and open questions from current requirements.", `${guideRoot}/06-improve/44-where-this-is-going`],
    ],
  },
] as const;

export const guideEntryPaths = [
  { label: "10 minutes", need: "Grasp the whole model quickly", links: [["FDLC in 5 minutes", "/in-5-minutes"], ["The factory in one view", `${guideRoot}/01-understand/02-the-factory-in-one-view`]] },
  { label: "Builder", need: "Assemble capabilities, harnesses, and workflows", links: [["Part III — Build", `${guideRoot}#build`]] },
  { label: "Architect", need: "Draw boundaries, records, and authority", links: [["Part II — Design", `${guideRoot}#design`], ["FDLC Architecture", "/architecture"]] },
  { label: "Operator", need: "Run the factory as a production platform", links: [["Part V — Operate", `${guideRoot}#operate`]] },
  { label: "Executive / Fund", need: "Explain or justify the system", links: [["Architecture communication", `${guideRoot}/appendix/architecture-communication`]] },
  { label: "Front to back", need: "Read the complete methodology", links: [["Full table of contents", guideRoot]] },
] as const;

export const proposedGuideMap = [
  ["Execution Boundaries and Canonical Terminology", `${guideRoot}/appendix/execution-boundaries-and-terminology`, "Guide reference"],
  ["What Is an AI Software Factory?", `${guideRoot}/01-understand/02-the-factory-in-one-view`, "Guide chapter"],
  ["Coding Agents vs. Software Factories", `${guideRoot}/01-understand/01-why-software-engineering-is-changing`, "Guide chapter"],
  ["Factory Development Lifecycle", "/framework", "FDLC framework"],
  ["Reference Architecture", "/architecture", "FDLC framework"],
  ["Intent and Specification Engineering", `${guideRoot}/02-design/06-intent-and-specification-engineering`, "Guide chapter"],
  ["Planning and Work Decomposition", `${guideRoot}/stages/02-plan`, "Guide stage"],
  ["Agents and Agent Definitions", `${guideRoot}/stages/03-define-agent`, "Guide stage"],
  ["Skills and Reusable Capabilities", `${guideRoot}/03-build/12-skills-as-packages`, "Guide chapter"],
  ["Tools and MCP", `${guideRoot}/03-build/18-agent-architecture`, "Guide chapter"],
  ["Context and Enterprise Knowledge", `${guideRoot}/03-build/20-context-engineering`, "Guide chapter"],
  ["Model Abstraction and Routing", `${guideRoot}/03-build/22-routing-and-the-escalation-ladder`, "Guide chapter"],
  ["Execution Environments and Sandboxes", `${guideRoot}/03-build/17-development-environments-sandboxes-and-compute`, "Guide chapter"],
  ["State, Checkpoints, and Recovery", `${guideRoot}/03-build/14-durable-execution`, "Guide chapter"],
  ["Verification and Evaluation", `${guideRoot}/04-prove/29-evaluation-engineering`, "Guide chapter"],
  ["Security and Delegated Authority", `${guideRoot}/04-prove/33-security`, "Guide chapter"],
  ["Human Oversight", `${guideRoot}/02-design/04-the-human-agent-operating-model`, "Guide chapter"],
  ["Observability and Cost", `${guideRoot}/05-operate/35-observability-telemetry-and-forensics`, "Guide chapter"],
  ["Failure Taxonomy", `${guideRoot}/05-operate/36-resilience-incidents-and-the-control-tower`, "Guide chapter"],
  ["Continuous Learning", `${guideRoot}/06-improve/40-governed-learning`, "Guide chapter"],
  ["Organizational Operating Model", `${guideRoot}/02-design/04-the-human-agent-operating-model`, "Guide chapter"],
  ["AI-FDE", "/deploy", "FDLC product"],
  ["Build vs. Buy", `${guideRoot}/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape`, "Guide chapter"],
  ["Factory Maturity Model", "/maturity", "FDLC assessment"],
  ["Implementation Playbook", `${guideRoot}/06-improve/43-mastering-the-factory`, "Guide chapter"],
] as const;

export type GuidePart = (typeof guideParts)[number];

export function getGuidePart(id: string) {
  return guideParts.find((part) => part.id === id);
}

export function adjacentGuideParts(id: string) {
  const index = guideParts.findIndex((part) => part.id === id);
  return { previous: index > 0 ? guideParts[index - 1] : undefined, next: index >= 0 && index < guideParts.length - 1 ? guideParts[index + 1] : undefined };
}
