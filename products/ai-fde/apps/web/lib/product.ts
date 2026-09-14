export const PRODUCT = {
  name: "AI-FDE",
  shortName: "AI-FDE",
  description:
    "The evidence-backed AI Factory Deployed Engineer that helps a human FDE turn customer reality into an approved Factory Definition.",
  conciseDescription: "Define the factory before Mission Control runs it.",
  northStar:
    "Make deploying an AI software factory faster without sacrificing evidence, verification, economics, security, accountability, or human authority.",
} as const;

export const APP_BASE_PATH = "/deploy/app" as const;

export const ECOSYSTEM_LINKS = [
  {
    key: "framework",
    label: "Framework",
    href: "/framework",
  },
  {
    key: "guide",
    label: "Guide",
    href: "/guide",
  },
  {
    key: "mission-control",
    label: "Mission Control",
    href: "/mission-control",
  },
] as const;

const GUIDE_BASE_URL = "/guide";

export const GUIDE_LINKS = {
  "autonomy.lowest-ceiling": {
    title: "Autonomy is scoped and the lowest ceiling wins",
    path: "/docs/01-understand/03-first-principles-trust-evidence-and-authority#autonomy-is-scoped-and-the-lowest-ceiling-wins",
    lastReviewed: "2026-09-04",
  },
  "authority.permission": {
    title: "Permission is not authority",
    path: "/docs/02-design/07-governance-policy-and-risk-proportional-approval#permission-is-not-authority",
    lastReviewed: "2026-09-04",
  },
  "autonomy.per-action": {
    title: "Autonomy per action class",
    path: "/docs/02-design/07-governance-policy-and-risk-proportional-approval#autonomy-per-action-class",
    lastReviewed: "2026-09-04",
  },
  "trust.evidence-record": {
    title: "The evidence record",
    path: "/docs/04-prove/27-quality-and-evidence-architecture#the-evidence-record",
    lastReviewed: "2026-09-04",
  },
  "trust.independent-verification": {
    title: "Validation must be independent",
    path: "/docs/04-prove/27-quality-and-evidence-architecture#validation-must-be-independent",
    lastReviewed: "2026-09-04",
  },
  "trust.verification-contract": {
    title: "The verification contract",
    path: "/docs/04-prove/27-quality-and-evidence-architecture#the-verification-contract",
    lastReviewed: "2026-09-04",
  },
  "records.traceability": {
    title: "The traceability chain",
    path: "/docs/02-design/05-authoritative-records#the-traceability-chain",
    lastReviewed: "2026-09-04",
  },
  "capability.agent-definition": {
    title: "The Agent Definition is a contract, not a prompt",
    path: "/docs/03-build/11-the-agent-factory#the-agent-definition-is-a-contract-not-a-prompt",
    lastReviewed: "2026-09-04",
  },
  "capability.factory-boundary": {
    title: "Two factories, one boundary",
    path: "/docs/03-build/11-the-agent-factory#two-factories-one-boundary",
    lastReviewed: "2026-09-04",
  },
  "context.retrieval-contract": {
    title: "The retrieval contract",
    path: "/docs/03-build/20-context-engineering#the-retrieval-contract",
    lastReviewed: "2026-09-04",
  },
  "field.forward-deployed-loop": {
    title: "Forward-deployed engineering and its failure mode",
    path: "/docs/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape#forward-deployed-engineering-and-its-failure-mode",
    lastReviewed: "2026-09-04",
  },
} as const;

export type GuideTopic = keyof typeof GUIDE_LINKS;

export function guideHref(topic: GuideTopic): string {
  return `${GUIDE_BASE_URL}${GUIDE_LINKS[topic].path}`;
}
