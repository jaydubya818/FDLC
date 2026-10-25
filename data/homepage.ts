export const heroName = "Factory Development Lifecycle";

export const heroSubhead = "The SDLC for software built by autonomous AI agents.";

export const heroValue = "Your agents do the work; FDLC makes every change they produce verifiable, approved by a named owner, and safe to ship.";

// Plain-language reasons the classic SDLC stops working once agents write most of the code.
export const homepageProblems = [
  ["01", "More changes than anyone can review.", "Agents can open pull requests faster than people can read them. Review turns into a skim, or a queue that never empties."],
  ["02", "Agents grade their own homework.", "The agent that wrote a change often writes its tests and reports that they pass. Too often, that report is the only proof."],
  ["03", "Nobody can prove why a change was safe.", "When something breaks, there is no record of which run, instructions, or permissions produced the change, or who said it could ship."],
] as const;

// The hero card: the same questions, answered by the classic SDLC and by FDLC.
export const heroContrast = [
  ["Who does the work?", "Developers", "AI agents, inside set limits"],
  ["Who checks it?", "A teammate's review", "An independent verifier, never the agent that wrote it"],
  ["Who approves it?", "Whoever merges", "A named owner, for that exact change"],
  ["What proves it is safe?", "A green build", "A record of every step, tied to the change"],
] as const;

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
  ["Lifecycle", "Planning → Execution → Evidence → Verification → Approval"],
  ["Evidence", "Compatibility · Tests · Security · Cost · Owner approval"],
  ["Outcome", "An upgrade ready for production, with a record of who did what and why it passed."],
] as const;
