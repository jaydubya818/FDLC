export const operatingModelMoves = [
  ["01", "Define the outcome", "State what the software must do and how success will be checked."],
  ["02", "Bound the work", "Set tasks, permissions, budgets and approval requirements before agents act."],
  ["03", "Require evidence", "Use tests and independent review to check each result."],
  ["04", "Learn from outcomes", "Improve the system using observed results and approved changes."],
] as const;

export const operatingModelBridge = {
  summary: "Apply these controls when you design the factory, qualify it for use, operate it and improve it from measured results.",
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
