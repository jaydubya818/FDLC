/**
 * Public status vocabulary. Use exactly these labels on page heroes and in this table:
 * - Available: usable today, with stated limits.
 * - Demo: runs on synthetic or precomputed records; teaches, does not execute real work.
 * - Preview: incomplete product or content; expect change.
 * - Experimental: built but not qualified.
 * - Proposed: described direction; not built or not generally available.
 */
export const statusVocabulary = ["Available", "Demo", "Preview", "Experimental", "Proposed"] as const;
export type PublicStatus = (typeof statusVocabulary)[number];

export const whatsRealToday = [
  { name: "FDLC", kind: "Framework", status: "Available", meaning: "Open, implementation-independent operating model and engineering discipline. Source is public on GitHub.", href: "/framework" },
  { name: "Guide", kind: "Book", status: "Available", meaning: "The field guide that teaches how to implement FDLC. Separate public repository.", href: "/guide" },
  { name: "Reference Lab", kind: "Hands-on lab", status: "Available", meaning: "Dependency-free local factory with real gates and evidence. Teaching scope; not production-qualified.", href: "/lab" },
  { name: "Factory Definition builder", kind: "Tool", status: "Available", meaning: "Browser-only builder for a reviewable Factory Definition. Produces design intent, not an executable manifest.", href: "/start" },
  { name: "Maturity assessment", kind: "Tool", status: "Available", meaning: "Browser-only self-assessment across eleven dimensions. Educational, not certification.", href: "/maturity" },
  { name: "Factory Simulator", kind: "Browser demo", status: "Demo", meaning: "Deterministic sample run with synthetic records. Executes no code and grants no authority.", href: "/simulator" },
  { name: "Mission Control", kind: "Optional reference implementation", status: "Available", meaning: "Open-source control plane with capability-specific evidence and limits. Not required to use FDLC.", href: "/mission-control" },
  { name: "AI-FDE", kind: "Product", status: "Preview", meaning: "Internal alpha with a synthetic demo. Helps design a Factory Definition; a Factory Deployed Engineer (FDE) remains the accountable human.", href: "/deploy" },
  { name: "Fab", kind: "Executor", status: "Experimental", meaning: "Local factory agent builder. No live model qualification yet.", href: "/architecture#execution-vocabulary" },
  { name: "Specification", kind: "Standard", status: "Proposed", meaning: "Machine-readable contract for portable artifacts and state transitions. Not yet published.", href: "/specification" },
  { name: "Benchmarks", kind: "Measurement", status: "Proposed", meaning: "Outcome-based comparison method. No public results are claimed.", href: "/benchmarks" },
  { name: "Enterprise", kind: "Platform", status: "Proposed", meaning: "Commercial multi-factory control plane. Not generally available.", href: "/enterprise" },
] as const satisfies readonly { name: string; kind: string; status: PublicStatus; meaning: string; href: string }[];
