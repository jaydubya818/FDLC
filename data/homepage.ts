export const operatingModelMoves = [
  ["01", "Define the outcome", "State what the software must do and how success will be checked."],
  ["02", "Bound the work", "Set tasks, permissions, budgets and approval requirements before agents act."],
  ["03", "Require evidence", "Use tests and independent review to check each result."],
  ["04", "Learn from outcomes", "Improve the system using observed results and approved changes."],
] as const;

export const operatingModelBridge = {
  summary: "Apply these controls when you design the factory, qualify it for use, operate it and improve it from measured results.",
} as const;

export const homepageExampleSteps = [
  ["Intent", "Upgrade a dependency across approved repositories without changing public behavior."],
  ["Factory", "Plan → Modify → Test → Verify → Approve"],
  ["Evidence", "Compatibility · Tests · Security · Cost · Human authority"],
  ["Outcome", "A production-ready modernization candidate with an attributable evidence trail."],
] as const;

// The visitor journey: understand → experience → define → build. Order matters; each step links to the next.
export const homepageActions = [
  ["01 / Understand", "Follow one dependency upgrade from intent to verified outcome, across every FDLC view.", "/in-5-minutes", "Experience FDLC in 5 minutes"],
  ["02 / Experience", "Run a sample factory in your browser. Inject a fault and watch evidence block the release.", "/simulator", "Run the factory simulator"],
  ["03 / Define", "Turn one engineering outcome into a Factory Definition you can review and keep.", "/start", "Define your first factory line"],
  ["04 / Build", "Download the dependency-free Reference Lab, run its gates locally, then swap in your own stack.", "/lab", "Build and run a minimal factory"],
] as const;

export const homepageReferences = [
  ["Assess your maturity", "/maturity"],
  ["Read the Guide", "/guide"],
  ["Architecture", "/architecture"],
  ["Manifesto", "/manifesto"],
  ["Mission Control (optional reference)", "/mission-control"],
] as const;

export const homepageThesis = [
  ["01", "Intent stays explicit.", "The factory begins with a governed outcome and acceptance contract."],
  ["02", "Authority stays bounded.", "Agents, models, and tools act inside declared operational limits."],
  ["03", "Evidence earns progress.", "Execution, verification, approval, release, and outcomes remain distinct."],
] as const;
