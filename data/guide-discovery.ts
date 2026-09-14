export const guideDiscovery = {
  framework: [
    ["The factory in one view", "/guide/01-understand/02-the-factory-in-one-view"],
    ["First principles: trust, evidence, and authority", "/guide/01-understand/03-first-principles-trust-evidence-and-authority"],
    ["Mastering the factory", "/guide/06-improve/43-mastering-the-factory"],
  ],
  architecture: [
    ["Execution boundaries and terminology", "/guide/appendix/execution-boundaries-and-terminology"],
    ["Control plane, orchestrator, and execution plane", "/guide/03-build/13-control-plane-orchestrator-and-execution-plane"],
    ["Quality and evidence architecture", "/guide/04-prove/27-quality-and-evidence-architecture"],
  ],
  manifesto: [
    ["First principles: trust, evidence, and authority", "/guide/01-understand/03-first-principles-trust-evidence-and-authority"],
    ["The human–agent operating model", "/guide/02-design/04-the-human-agent-operating-model"],
    ["Governed learning", "/guide/06-improve/40-governed-learning"],
  ],
  "mission-control": [
    ["Mission Control as a living case study", "/guide/06-improve/42-mission-control-as-a-living-case-study"],
    ["Durable execution", "/guide/03-build/14-durable-execution"],
    ["Quality contracts and proof packages", "/guide/04-prove/31-quality-contracts-proof-packages-and-certificates"],
  ],
} as const;

export type GuideDiscoveryPage = keyof typeof guideDiscovery;
