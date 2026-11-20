// Factory Updates: notable, sourced changes in AI software factories.
// Every entry links to a first-party source that was read before it was cited.
// Keep entries sorted newest first; the unit test enforces order and shape.

export const fdlcStages = ["Intent", "Planning", "Execution", "Evidence", "Verification", "Approval", "Release", "Outcomes", "Learning"] as const;
export const fdlcCapabilities = ["Agents", "Models", "Skills", "Tools", "Context", "Runtime", "Policy", "Evals", "Observability", "Human control"] as const;

export type FdlcStage = (typeof fdlcStages)[number];
export type FdlcCapability = (typeof fdlcCapabilities)[number];

export type FactoryUpdate = {
  /** Stable kebab-case identifier, unique across the feed. */
  id: string;
  /** Publication date of the source, YYYY-MM-DD. */
  date: string;
  title: string;
  /** Publisher of the source. */
  source: string;
  url: string;
  /** One or two sentences on what changed. */
  summary: string;
  /** One line tying the change to an FDLC stage or capability. */
  whyItMatters: string;
  /** The FDLC stage or capability the change bears on most. */
  touches: FdlcStage | FdlcCapability;
  tags: readonly string[];
};

export const factoryUpdatesReviewed = "2026-11-19";

export const factoryUpdates = [
  {
    id: "warp-learn-factory-engineering-course",
    date: "2026-11-19",
    title: "Warp launches Warp Learn: free course on building a self-improving software factory",
    source: "Warp",
    url: "https://www.warp.dev/blog/warp-learn-software-factory-course",
    summary: "Warp launched Warp Learn, a free course 'Build a Self-Improving Software Factory' taught by Ben Holmes. Three units cover getting started with agents, automations, runners, skills, scorers, and benchmarks; building the factory with triage, specs, verification, merge-risk assessment, and error-monitoring webhooks; and measuring and improving with scorers, self-improvement agents, and benchmarks. Units 1 and 2 were live at launch.",
    whyItMatters: "Learning: a structured course on scorers, self-improvement loops, and replay benchmarks names the FDLC Learning-stage toolkit—scorers calibrated against evidence, self-improvement surfaced as an Improvement Candidate pending human acceptance, and benchmarks run on model releases or config changes rather than continuously.",
    touches: "Learning",
    tags: ["factory engineering", "benchmarks", "self-improvement", "course"],
  },
  {
    id: "aie-code-factory-engineering-keynote",
    date: "2026-11-12",
    title: "AI Engineer Code Summit keynote: 'Software Engineering Is Becoming Factory Engineering'",
    source: "AI Engineer Code Summit",
    url: "https://ai.engineer/code/2026/talks/zach-lloyd",
    summary: "Warp CEO Zach Lloyd delivered the keynote at the AI Engineer Code Summit, defining factory engineering as building, measuring, and improving the system of agents that builds the product—as distinct from product engineering, which decides what to build. The talk covers the factory stack, measurement tools (scorers, replay benchmarks, model routing, A/B tests), and adoption patterns, arguing that factory engineers should learn these tools the way earlier engineers learned linters, profilers, and debuggers.",
    whyItMatters: "Evals: the keynote names online scorers, replay benchmarks, model routing, and A/B tests as the new tools factory engineers must learn—corresponding to FDLC's Evals capability—and frames factory engineering as a systems discipline that owns continuous improvement through measured evidence.",
    touches: "Evals",
    tags: ["factory engineering", "keynote", "benchmarks", "evals"],
  },
  {
    id: "warp-code-review-bottleneck",
    date: "2026-11-05",
    title: "Warp documents three levers for the agent code-review bottleneck",
    source: "Warp",
    url: "https://www.warp.dev/blog/agent-code-review-bottleneck",
    summary: "Warp published a guide naming three levers for the code-review bottleneck: off-PR review-agent rounds (implementation and review agents iterate privately; only unresolved findings reach the PR); end-to-end computer-use verification with before-and-after states, staging credentials, and trimmed screen recordings while guarding against over-verification; and merge-risk scoring across alignment, impact, verification, rollback cost, and error detection. Warp writes: 'None of these remove the human bottleneck on code review.'",
    whyItMatters: "Verification: off-PR review-agent rounds, computer-use evidence artifacts, and a five-criterion merge-risk rubric map to FDLC's Evidence → Verification → Approval sequence; Warp's statement that none of these remove the human bottleneck is consistent with FDLC's separation of verification from authorization.",
    touches: "Verification",
    tags: ["verification", "code review", "merge risk", "computer use"],
  },
  {
    id: "aws-kiro-bots-crew-coordination",
    date: "2026-11-05",
    title: "AWS launches Kiro bots to coordinate parallel coding agents in Kiro Crew",
    source: "InfoWorld",
    url: "https://www.infoworld.com/article/4245120/aws-launches-kiro-bots-to-help-devs-coordinate-ai-coding-agents.html",
    summary: "Kiro bots are generally available in Kiro Crew, AWS's open-source multi-agent environment. Each bot owns a responsibility such as issue triage or release readiness, launches parallel worker sessions, asks for approval when needed, and keeps editable persistent Notes. Analysts warn of coordination-tax costs, harder audit trails, and permission creep.",
    whyItMatters: "Human control: scoped bot permissions, approval requests, and inspectable memory map to FDLC's Approval stage, while the audit and permission-creep concerns bear on Policy.",
    touches: "Human control",
    tags: ["aws", "multi-agent", "governance"],
  },
  {
    id: "warp-production-software-factory",
    date: "2026-11-04",
    title: "Warp publishes production software factory guide: factories-as-code, durable orchestration, hermetic replay",
    source: "Warp",
    url: "https://www.warp.dev/blog/build-production-software-factory",
    summary: "Warp's production guide covers factories-as-code (all workflows and permissions in version control so changes are diffs with code owners), durable orchestration with checkpointing and pre-warmed sandboxes, centralized trace and artifact storage, and hermetic task replay for benchmarks—noting that naively replaying completed tasks without resetting side-effects breaks benchmarks. It includes a worked Sentry-crash workflow showing the configuration a 'simple' automation requires, and recommends API- and MCP-first access over web portals.",
    whyItMatters: "Runtime: factories-as-code, durable execution with checkpointing, and hermetic replay give FDLC's Runtime capability its three measurability requirements—reproducibility, auditability, and benchmark-safe task execution—while centralized trace storage enables the scorer inputs the Evals and Learning stages depend on.",
    touches: "Runtime",
    tags: ["factories as code", "runtime", "benchmarks", "orchestration"],
  },
  {
    id: "launchdarkly-release-autopilot",
    date: "2026-11-04",
    title: "LaunchDarkly introduces Release Autopilot for automated release control of AI-built code",
    source: "LaunchDarkly",
    url: "https://launchdarkly.com/blog/introducing-release-autopilot",
    summary: "Release Autopilot classifies a pull request's risk, adds a feature flag where needed, rolls changes out progressively against guardrail metrics, rolls back automatically, and opens a cleanup PR. LaunchDarkly says agents ship over 20% of its PRs directly to production; GA is November 16, with some features in beta.",
    whyItMatters: "Release: risk-tiered autonomy with metric-driven rollback is a pattern for FDLC's Release and Outcomes stages.",
    touches: "Release",
    tags: ["release", "feature flags", "software factory"],
  },
  {
    id: "tessl-software-factory-platform",
    date: "2026-11-04",
    title: "Tessl launches an open software factory platform built on skills, loops, and verifiers",
    source: "DEVOPSdigest",
    url: "https://www.devopsdigest.com/tessl-launches-software-factory-platform",
    summary: "Tessl's agent- and model-agnostic platform lets teams define reusable skills, combine them into repeatable loops, and add verification and feedback. Starter workflows cover ticket to PR, code review, and vulnerability remediation; verifiers check repository rules and evaluations test changes to agent context.",
    whyItMatters: "Skills: verifier-gated loops with evals on agent context line up with FDLC's Skills capability and Verification stage.",
    touches: "Skills",
    tags: ["software factory", "skills", "evals"],
  },
  {
    id: "qodo-codex-plugin-review-loop",
    date: "2026-11-02",
    title: "Qodo's Codex plugin feeds org rules into coding sessions and returns independent review before the PR",
    source: "OpenAI",
    url: "https://openai.com/index/qodo-codex-plugin/",
    summary: "Qodo's plugin in the Codex marketplace retrieves codebase rules and pull request history before Codex writes code, then reviews the changes and returns findings in the same session before a pull request opens. Qodo's CEO describes agents debating findings and surfacing only unresolved ones to humans.",
    whyItMatters: "Verification: a separate review agent with organizational context, escalating only disputed findings, is a pattern for FDLC's Verification stage.",
    touches: "Verification",
    tags: ["code review", "codex", "software factory"],
  },
  {
    id: "deepseek-super-agent-prototype",
    date: "2026-11-01",
    title: "DeepSeek open-sources Super-Agent, a proactive repo-level coding agent prototype",
    source: "The Next Web",
    url: "https://thenextweb.com/news/deepseek-super-agent-open-source-coding-agent",
    summary: "DeepSeek released an MIT-licensed research prototype that works on one GitHub repository, turns requests from approved people into tasks in separate agent sessions, replies with pull requests, and lists items needing a human on a web panel. It acts only when asked or when a team rule allows it, and DeepSeek says the public code differs from its internal version.",
    whyItMatters: "Human control: an allow-list of who can trigger work and a panel of items awaiting a human are concrete approval-gate patterns for FDLC's Approval stage.",
    touches: "Human control",
    tags: ["open source", "coding agents", "approval"],
  },
  {
    id: "opsera-forge-ai-native-software-factory",
    date: "2026-10-29",
    title: "Opsera relaunches as an AI-native software factory built around spec-driven Forge",
    source: "DEVOPSdigest",
    url: "https://www.devopsdigest.com/opsera-relaunches-ai-native-software-factory",
    summary: "Opsera's Forge turns business intent into living specs and reviewable work orders for any model or coding assistant, with a human in the loop and evals, security and compliance checks at every stage. The vendor claims time to market falls from two weeks to two days.",
    whyItMatters: "Planning: spec-to-work-order decomposition with checks at each stage mirrors FDLC's Intent and Planning stages (efficiency figures are vendor claims).",
    touches: "Planning",
    tags: ["software factory", "spec-driven", "governance"],
  },
] as const satisfies readonly FactoryUpdate[];
