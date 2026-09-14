export const operatingModelMoves = [
  ["01", "Define the outcome", "State what should happen and how success will be judged."],
  ["02", "Bound the work", "Give each attempt explicit scope, identity, and authority."],
  ["03", "Require evidence", "Verify the exact candidate before it advances."],
  ["04", "Learn from outcomes", "Improve the factory only from validated results."],
] as const;

export const operatingModelBridge = {
  summary: "Four moves explain the operating model. The lifecycle explains progression. The runtime explains execution. Architecture explains composition.",
  links: [
    ["Factory lifecycle", "/framework#lifecycle"],
    ["Runtime", "/framework#runtime"],
    ["Architecture", "/architecture"],
    ["Protocol", "/framework#protocol"],
  ],
} as const;

export const homepageExampleSteps = [
  ["Intent", "Upgrade a dependency across approved repositories without changing public behavior."],
  ["Factory", "Plan → Modify → Test → Verify → Approve"],
  ["Evidence", "Compatibility · Tests · Security · Cost · Human authority"],
  ["Outcome", "A production-ready modernization candidate with an attributable evidence trail."],
] as const;

export const homepageActions = [
  ["Understand", "See one workflow move from intent to verified outcome.", "/in-5-minutes", "Follow the five-minute example"],
  ["Assess", "Identify your current factory maturity and the next capability to earn.", "/maturity", "Assess your factory"],
  ["Build", "Turn one engineering outcome into a reusable Factory Definition.", "/start", "Build a Factory Definition"],
  ["Read", "Use the Guide as the field book for the deeper system.", "/guide", "Open the Guide"],
] as const;

export const homepageThesis = [
  ["01", "Intent stays explicit.", "The factory begins with a governed outcome and acceptance contract."],
  ["02", "Authority stays bounded.", "Agents, models, and tools act inside declared operational limits."],
  ["03", "Evidence earns progress.", "Execution, verification, approval, release, and outcomes remain distinct."],
] as const;
