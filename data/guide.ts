export const guideParts = [
  {
    id: "understand", number: "I", verb: "Understand", title: "See the factory as a system", question: "What is an AI software factory, and why does it require a lifecycle?",
    overview: "Start with the category boundary: the agent is a worker, not the factory. The factory is the governed system that turns intent into validated outcomes.",
    retain: ["A software factory is an operating model, not a coding tool.", "Execution never creates its own authority.", "Validated customer value—not generated code—is the outcome."],
    chapters: [
      [1, "Why software engineering is changing", "Why coordination, verification, and operating discipline become the bottleneck."],
      [2, "The factory in one view", "The full system, its boundaries, architecture areas, lifecycle, and value stream."],
      [3, "First principles: trust, evidence, and authority", "How bounded autonomy earns confidence through proof."],
    ],
  },
  {
    id: "design", number: "II", verb: "Design", title: "Define ownership, records, and authority", question: "What must be true before any agent runs?",
    overview: "Design turns a desired outcome into durable records, decision rights, measurable proof, and a bounded execution envelope.",
    retain: ["Intent and acceptance criteria precede execution.", "Plans are governed, versioned artifacts.", "Risk determines authority and approval—not agent confidence."],
    chapters: [
      [4, "The human–agent operating model", "Responsibility, accountability, and operator attention."],
      [5, "Authoritative records: from company to release", "The durable objects that preserve lineage."],
      [6, "Intent and specification engineering", "Measurable outcomes, constraints, and executable requirements."],
      [7, "Governance, policy, and risk-proportional approval", "How policy and risk bound action."],
      [8, "Economics, metrics, and human attention", "Cost per trusted outcome and review effort."],
      [9, "Multi-repository design and coordinated delivery", "Scope, ownership, dependencies, and release order across repositories."],
    ],
  },
  {
    id: "build", number: "III", verb: "Build", title: "Assemble capability and execution", question: "How do you build the system around the agent?",
    overview: "Build the reusable capabilities, model abstraction, context systems, runtime, harnesses, environments, and workflows that make governed execution repeatable.",
    retain: ["Use the lightest orchestration model that satisfies the workflow.", "Capabilities are versioned supply, not loose prompts.", "The sandbox defines what intelligence is allowed to affect."],
    chapters: [
      [10, "The Agent Factory: reusable capabilities", "Create and govern agents, skills, tools, profiles, and configurations."],
      [11, "Control plane, orchestrator, and execution plane", "Separate authority, coordination, and work."],
      [12, "Durable execution: tasks, attempts, leases, and recovery", "Survive failures without losing truth."],
      [13, "Coding harnesses and agent protocols", "Own the model/tool loop and its external contract."],
      [14, "Development environments, sandboxes, and compute", "Contain side effects and prove cleanup."],
      [15, "Agent architecture: loop, MCP, tools, context, and memory", "Design one bounded worker as a system."],
      [16, "Data, knowledge, semantic, and context engineering", "Ground work with attributable, permitted context."],
      [17, "Models: routing, profiles, and capability selection", "Match intelligence and cost to the work."],
      [18, "Agent and loop engineering", "Design loops, stopping conditions, and eval surfaces."],
      [19, "The 12-layer production AI agent stack", "Place each production responsibility in a named layer."],
      [20, "Autonomous engineering workflows", "Compose bounded workflows around real engineering work."],
    ],
  },
  {
    id: "prove", number: "IV", verb: "Prove", title: "Verify exact outcomes", question: "How do you know the output is correct, safe, and releasable?",
    overview: "Prove separates a producer’s completion claim from independent, current evidence that an exact candidate satisfies an explicit contract.",
    retain: ["Producers should not be their only verifier.", "Evidence must bind to an exact subject.", "Passing verification makes work eligible; it does not authorize every consequence."],
    chapters: [
      [21, "Quality and evidence architecture", "Build criterion-level proof and evidence lineage."],
      [22, "Testing strategy for agentic change", "Make deterministic checks the hard floor."],
      [23, "Evaluation engineering", "Compare configurations across representative work."],
      [24, "Quality contracts, proof packages, and certificates", "Package proof for decisions and reuse."],
      [25, "CI/CD, progressive delivery, and production verification", "Carry evidence through the existing supply chain."],
      [26, "Security: identity, secrets, threats, and supply chain", "Keep authorization deterministic and external to the model."],
    ],
  },
  {
    id: "operate", number: "V", verb: "Operate", title: "Run the factory as a platform", question: "How do you operate autonomous work in production?",
    overview: "Operate treats the factory as a production system with explicit ownership, telemetry, incident handling, storage contracts, and a paved road for adoption.",
    retain: ["A truthful blocked state is better than a false success.", "Exceptions and evidence belong ahead of activity feeds.", "The safest paved road also needs to be the fastest."],
    chapters: [
      [27, "The factory as a platform", "Productize the common control and delivery path."],
      [28, "Observability, telemetry, and forensics", "Reconstruct what happened and why."],
      [29, "Resilience, incidents, and the control tower", "Detect, contain, restore, and learn."],
      [30, "Control surfaces, event contracts, and storage", "Keep views and integrations over one authority model."],
      [31, "Enterprise adoption and the infrastructure landscape", "Scale proven paths without forcing a big-bang migration."],
    ],
  },
  {
    id: "improve", number: "VI", verb: "Improve", title: "Learn without self-authorizing change", question: "How does the factory get better safely?",
    overview: "Improve converts validated production outcomes and failure evidence into proposals, experiments, and governed new versions.",
    retain: ["Learning can be autonomous; promotion should be governed.", "Every meaningful failure should make the system harder to fail the same way twice.", "Never jump straight to training."],
    chapters: [
      [32, "Production feedback, automated review, and the agentic merge queue", "Turn downstream signals into governed attention."],
      [33, "Governed learning and compounding engineering", "Move from signal to tested improvement."],
      [34, "Mission Control as a living case study", "Inspect one control-plane implementation with its gaps visible."],
      [35, "Mastering the factory", "Connect the architecture, operating model, and improvement discipline."],
      [36, "Where this is going", "The likely path toward interoperable, evidence-native factories."],
    ],
  },
] as const;

export type GuidePart = (typeof guideParts)[number];

export const proposedGuideMap = [
  "What Is an AI Software Factory?", "Coding Agents vs. Software Factories", "Factory Development Lifecycle", "Reference Architecture", "Intent and Specification Engineering", "Planning and Work Decomposition", "Agent Harnesses", "Agents and Agent Definitions", "Skills and Reusable Capabilities", "Tools and MCP", "Context and Enterprise Knowledge", "Model Abstraction and Routing", "Execution Environments and Sandboxes", "State, Checkpoints, and Recovery", "Verification and Evaluation", "Security and Delegated Authority", "Human Oversight", "Observability and Cost", "Failure Taxonomy", "Continuous Learning", "Organizational Operating Model", "Forward-Deployed Engineering", "Build vs. Buy", "Factory Maturity Model", "Implementation Playbook",
] as const;

export function getGuidePart(id: string) {
  return guideParts.find((part) => part.id === id);
}

export function adjacentGuideParts(id: string) {
  const index = guideParts.findIndex((part) => part.id === id);
  return { previous: index > 0 ? guideParts[index - 1] : undefined, next: index >= 0 && index < guideParts.length - 1 ? guideParts[index + 1] : undefined };
}

