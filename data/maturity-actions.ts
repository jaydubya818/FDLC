export const factoryDefinitionBridge = {
  definition: "Factory Definition is governed implementation intent.",
  version: "Factory Version is the immutable qualified runtime composition.",
  boundary: "A Factory Definition is not automatically accepted or executed by Mission Control.",
} as const;

export const factoryDefinitionNextSteps = [
  ["/maturity", "Assess organizational maturity"],
  ["/guide/02-design/06-intent-and-specification-engineering", "Read relevant Guide material"],
  ["/deploy", "Explore AI-FDE"],
  ["/mission-control", "Inspect Mission Control"],
] as const;

export const maturityGapLinks: Record<string, readonly [label: string, href: string][]> = {
  intent: [
    ["Framework: explicit intent", "/framework#definition"],
    ["Architecture: Intent area", "/architecture#intent"],
    ["Guide: intent and specification", "/guide/02-design/06-intent-and-specification-engineering"],
  ],
  planning: [
    ["Framework: runtime plan", "/framework#runtime"],
    ["Guide: planning and work decomposition", "/guide/stages/02-plan"],
    ["Mission Control architecture", "/mission-control#architecture"],
  ],
  governance: [
    ["Architecture: control boundary", "/architecture#control-boundary"],
    ["Guide: governance and approval", "/guide/02-design/07-governance-policy-and-risk-proportional-approval"],
    ["AI-FDE role boundary", "/deploy#human-digital-system"],
  ],
  execution: [
    ["Architecture: execution vocabulary", "/architecture#execution-vocabulary"],
    ["Guide: durable execution", "/guide/03-build/14-durable-execution"],
    ["Mission Control", "/mission-control"],
  ],
  verification: [
    ["Framework: evidence gates", "/framework#protocol"],
    ["Guide: evaluation engineering", "/guide/04-prove/29-evaluation-engineering"],
    ["Mission Control capabilities", "/mission-control#capabilities"],
  ],
  security: [
    ["Architecture: Trust", "/architecture#trust"],
    ["Guide: security", "/guide/04-prove/33-security"],
    ["AI-FDE trust boundaries", "/deploy#factory-definition"],
  ],
  oversight: [
    ["Manifesto: human judgment", "/manifesto#principle-8"],
    ["Guide: human–agent operating model", "/guide/02-design/04-the-human-agent-operating-model"],
    ["AI-FDE", "/deploy"],
  ],
  observability: [
    ["Architecture: production operations", "/architecture#production-operations"],
    ["Guide: observability", "/guide/05-operate/35-observability-telemetry-and-forensics"],
    ["Mission Control", "/mission-control"],
  ],
  learning: [
    ["Framework: improve", "/framework#lifecycle"],
    ["Guide: governed learning", "/guide/06-improve/40-governed-learning"],
    ["Mission Control enhancements", "/mission-control#enhancements"],
  ],
  reuse: [
    ["Architecture: Capability", "/architecture#capability"],
    ["Guide: skills as packages", "/guide/03-build/12-skills-as-packages"],
    ["Start: Factory Definition", "/start"],
  ],
  scale: [
    ["AI-FDE scale path", "/deploy#engagement-model"],
    ["Enterprise path", "/enterprise"],
    ["Guide: enterprise adoption", "/guide/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape"],
  ],
};

export const defaultMaturityHandoffs = [
  ["Define one bounded factory line", "/start"],
  ["Use the Guide", "/guide"],
  ["Explore AI-FDE", "/deploy"],
] as const;
