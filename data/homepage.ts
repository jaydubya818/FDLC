export const heroHeadline = "The SDLC for software built by autonomous AI agents.";

export const heroSubhead = "FDLC is an open framework for engineering leaders and platform teams who want AI agents doing real delivery work. It gives you one lifecycle, clear checkpoints, and an evidence trail, so agent-written changes ship only after they are independently verified and approved.";

// One familiar SDLC phase per row, its FDLC stage, and what changes when agents do the work.
export const sdlcToFdlc = [
  ["Requirements", ["Intent"], "Requirements become a written contract an agent can be checked against: outcome, constraints, owner, and acceptance criteria."],
  ["Design", ["Planning"], "The plan also sets each agent's scope, permissions, budget, and stop conditions before any work starts."],
  ["Build", ["Execution"], "Agents write the change in an isolated sandbox, with limits on tools, network, time, and spend."],
  ["Test", ["Evidence", "Verification"], "Test results are recorded against the exact change, and a separate verifier, not the agent that wrote it, decides whether it passes."],
  ["Review and approve", ["Approval"], "A named person or policy approves that specific verified change. An agent can never approve its own work."],
  ["Release", ["Release"], "Only the approved artifact ships, through your existing CI/CD, with a tested rollback path."],
  ["Operate", ["Outcomes"], "Success is measured in production against the original intent, not by a green test run."],
  ["Retrospective", ["Learning"], "Lessons become tested changes to prompts, skills, and guardrails, which go through the same lifecycle before anyone relies on them."],
] as const;

export const workedExampleContrast = {
  before: [
    "An agent opens one large pull request that bumps the dependency and edits code across repositories.",
    "The agent says “all tests pass,” and that claim is the only proof anyone has.",
    "Reviewers either re-check everything by hand or skim and merge.",
    "If production breaks, nobody can say which run, prompt, or permission caused it.",
  ],
  after: [
    "The upgrade starts as written intent: preserve the public API and touch only approved repositories.",
    "The agent works in a sandbox with scoped permissions and a budget.",
    "Tests, scans, and the diff are tied to that exact change, and an independent verifier checks them.",
    "A named owner approves that change. It ships with a rollback path, and the result is measured.",
  ],
} as const;

export const homepageExampleSteps = [
  ["Intent", "Upgrade a dependency across approved repositories without changing public behavior."],
  ["Factory", "Planning → Execution → Evidence → Verification → Approval"],
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
