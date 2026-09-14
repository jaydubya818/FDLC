export const whatsRealToday = [
  {
    name: "FDLC",
    kind: "Framework",
    status: "Available",
    meaning: "Open operating model and engineering discipline.",
    href: "/framework",
  },
  {
    name: "Guide",
    kind: "Book",
    status: "Available",
    meaning: "The field guide that teaches how to implement FDLC.",
    href: "/guide",
  },
  {
    name: "Mission Control",
    kind: "Runtime",
    status: "Available",
    meaning: "Open-source control plane with capability-specific evidence and limits.",
    href: "/mission-control",
  },
  {
    name: "AI-FDE",
    kind: "Product",
    status: "Preview",
    meaning: "Product/system for discovering and designing a Factory Definition. The Factory Deployed Engineer is the accountable human role.",
    href: "/deploy",
  },
  {
    name: "Fab",
    kind: "Executor",
    status: "Experimental",
    meaning: "Local factory agent builder. No live model qualification yet.",
    href: "/architecture#execution-vocabulary",
  },
  {
    name: "Enterprise",
    kind: "Platform",
    status: "Proposed",
    meaning: "Commercial multi-factory control plane. Not generally available.",
    href: "/enterprise",
  },
] as const;
