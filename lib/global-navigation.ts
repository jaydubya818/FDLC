// Canonical FDLC global navigation. The Guide consumes a generated copy.
export type NavLink = readonly [label: string, href: string];

// Keep the top level to a handful of destinations a first-time visitor can parse.
// Everything else lives under More; every route stays reachable.
export const primary = [
  ["What is FDLC", "/framework"],
] as const satisfies readonly NavLink[];

export const guide = [
  ["Overview", "/guide"],
  ["Atlas", "/guide/atlas"],
  ["Reference", "/guide/topics"],
  ["Glossary", "/guide/glossary"],
  ["Search", "/guide/search"],
] as const satisfies readonly NavLink[];

// Shown as a top-level dropdown only while the visitor is inside AI-FDE (/deploy).
export const aiFde = [
  ["Engagement workspace", "/deploy/app"],
] as const satisfies readonly NavLink[];
export const aiFdeHome = "/deploy";

export const afterGuide = [
  ["Mission Control", "/mission-control"],
  ["Assess", "/maturity"],
] as const satisfies readonly NavLink[];

export const secondary = [
  ["In 5 Minutes", "/in-5-minutes"],
  ["Architecture", "/architecture"],
  ["AI-FDE", "/deploy"],
  ["Start", "/start"],
  ["Simulator", "/simulator"],
  ["Reference Lab", "/lab"],
  ["Learning Library (Preview)", "/corpus-preview"],
  ["Manifesto", "/manifesto"],
  ["Enterprise", "/enterprise"],
  ["Factory Updates", "/updates"],
  ["About", "/about"],
] as const satisfies readonly NavLink[];

export const footerGroups = [
  ["Learn", [["Framework", "/framework"], ["Architecture", "/architecture"], ["FDLC Guide", "/guide"], ["Learning Library (Preview)", "/corpus-preview"], ["Manifesto", "/manifesto"]]],
  ["Build", [["In 5 Minutes", "/in-5-minutes"], ["Mission Control", "/mission-control"], ["Specification", "/specification"], ["Start", "/start"], ["Simulator", "/simulator"], ["Reference Lab", "/lab"], ["GitHub", "https://github.com/jaydubya818/MissionControl"]]],
  ["Adopt", [["Maturity", "/maturity"], ["Benchmarks", "/benchmarks"], ["Enterprise", "/enterprise"], ["AI-FDE", "/deploy"]]],
  ["Project", [["About", "/about"], ["Factory Updates", "/updates"], ["What's real today", "/framework#whats-real"], ["Source audit", "https://github.com/jaydubya818/ai-software-factory-mastery"], ["Mission Control status", "https://github.com/jaydubya818/MissionControl/blob/main/docs/product/software-factory-capability-maturity.md"]]],
] as const;
