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

export const factoryUpdatesReviewed = "2026-11-05";

export const factoryUpdates = [
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
    id: "dynatrace-ai-observability-coding-agents",
    date: "2026-10-29",
    title: "Dynatrace unifies AI observability ingest across coding agents, OneAgent, and OpenInference",
    source: "Dynatrace",
    url: "https://www.dynatrace.com/news/blog/dynatrace-unifies-ai-observability-ingest-across-coding-agents-oneagent-and-openinference/",
    summary: "Dynatrace now ingests OpenTelemetry signals from coding agents including Claude Code, Codex, Cursor and GitHub Copilot, tracking token use, cost, session activity and tool behavior, and normalizes OpenInference spans into its gen_ai data model. It says teams can tie agent activity to the commits, pull requests and production behavior that followed.",
    whyItMatters: "Observability: connecting agent sessions to what shipped and how it ran in production feeds the Outcomes and Learning stages.",
    touches: "Observability",
    tags: ["observability", "opentelemetry", "coding agents"],
  },
  {
    id: "factory-droid-1-harness",
    date: "2026-10-29",
    title: "Factory ships Droid 1.0 with programmatic tool calling and bounded-autonomy rules in the loop",
    source: "Factory",
    url: "https://factory.com/news/frontier-harness",
    summary: "Droid 1.0 makes programmatic tool calling the default, so the agent writes a sandboxed script that runs many tool calls in one model request, and Factory reports a 15% cost cut on Claude Opus 5.5 versus direct calls. Stuck and repeat detection (nudge, retry, or stop) lives in the loop rather than the model, and an internal agent proposes harness changes that an engineer must review and merge.",
    whyItMatters: "Agents: loop-level limits and human-merged harness changes are concrete patterns for bounded autonomy at the Execution stage.",
    touches: "Agents",
    tags: ["harness", "tool calling", "bounded autonomy"],
  },
  {
    id: "hud-agentic-rollouts",
    date: "2026-10-29",
    title: "Hud launches agentic rollouts to validate AI-written changes against production behavior",
    source: "The Next Web (contributed article)",
    url: "https://thenextweb.com/news/hud-agentic-rollouts-ai-code-production",
    summary: "Hud's runtime code sensor learns function-level baselines from production, scores each pull request's production risk before merge, and watches each new version against the baseline, with rollback and root-cause feedback to the coding agent on regression. This is a vendor-contributed article, and the customer example reports reverting flawed deploys in about eight minutes.",
    whyItMatters: "Outcomes: runtime evidence that feeds back to the agent closes the loop between Release and Learning that FDLC treats as part of the lifecycle.",
    touches: "Outcomes",
    tags: ["runtime", "rollout", "feedback loop"],
  },
  {
    id: "coforge-autonomous-software-factory",
    date: "2026-10-29",
    title: "Coforge introduces an Autonomous Software Factory operating model for governing AI agents across the SDLC",
    source: "Capital Market",
    url: "https://www.capitalmarket.com/markets/news/results-announcements-news/coforge-launches-new-operating-model-for-managing-ai-agents/1741096",
    summary: "Coforge announced its Autonomous Software Factory (ASF), an operating model in which specialized agents run coding, testing, validation, code review and QA in parallel inside secure execution environments. The company frames the main enterprise challenge as governing and coordinating agents rather than generating code. This is a company announcement reported by a news outlet.",
    whyItMatters: "Policy: IT-services vendors are packaging governance and human oversight as the product, which is the control layer FDLC models across every stage.",
    touches: "Policy",
    tags: ["software factory", "governance", "enterprise"],
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
