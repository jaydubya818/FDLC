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

export const factoryUpdatesReviewed = "2026-10-29";

export const factoryUpdates = [
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
    id: "microsoft-copilot-harness-foundry",
    date: "2026-10-28",
    title: "Microsoft makes the GitHub-built Copilot harness available through Foundry",
    source: "Official Microsoft Blog",
    url: "https://blogs.microsoft.com/blog/2026/10/28/introducing-the-microsoft-copilot-harness-unlocking-the-potential-of-truly-multi-model-agentic-work/",
    summary: "The multi-model harness behind Copilot Code, the GitHub Copilot app, the CLI, and VS Code is now offered as a managed Foundry service, with 20+ frontier models plus bring-your-own-key and support for MCP and agent skills. Microsoft runs the agent loop and sandbox with governance built in, and the SDK is available separately.",
    whyItMatters: "Runtime: a managed, model-agnostic harness with a built-in sandbox shows the agent loop becoming a platform layer that FDLC's controls must sit on top of.",
    touches: "Runtime",
    tags: ["harness", "multi-model", "foundry"],
  },
  {
    id: "github-agentic-workflows-ga",
    date: "2026-10-28",
    title: "GitHub Agentic Workflows is generally available",
    source: "GitHub Changelog",
    url: "https://github.blog/changelog/2026-10-28-github-agentic-workflows-generally-available/",
    summary: "The open source project compiles natural-language Markdown automations into standard Actions YAML so coding agents can handle issue triage, CI failure analysis, documentation updates, and test writing. Agents run read-only by default inside a sandboxed container behind a firewall, outputs pass safe-output validation, and a threat detection job scans proposed changes.",
    whyItMatters: "Policy: layered, default-deny safeguards around agent automation inside CI mirror the controls FDLC expects at the Execution stage.",
    touches: "Policy",
    tags: ["github actions", "sandboxes", "governance"],
  },
  {
    id: "github-code-scanning-ai-applications",
    date: "2026-10-28",
    title: "GitHub code scanning for AI applications enters public preview",
    source: "GitHub Changelog",
    url: "https://github.blog/changelog/2026-10-28-code-scanning-for-ai-applications-in-public-preview/",
    summary: "Code scanning now flags agent vulnerabilities such as indirect prompt injection, sensitive information disclosure, and excessive agency, and runs automatically on pull requests with mitigation guidance. It requires a GitHub Advanced Security license.",
    whyItMatters: "Verification: pull-request checks for agent-specific risks such as excessive agency add an evidence gate before approval.",
    touches: "Verification",
    tags: ["security", "prompt injection", "github"],
  },
  {
    id: "jellyfish-ai-engineering-trends-october",
    date: "2026-10-27",
    title: "Jellyfish data: agents touch 27.7% of pull requests, but AI-only merges are just 0.5%",
    source: "R&D World (Jellyfish report)",
    url: "https://www.rdworldonline.com/jellyfish-claude-code-bills-hit-252-a-month-per-developer-as-software-factories-automate-code-production-among-early-adopters/",
    summary: "Jellyfish's October report, covering more than 1,300 companies, found agents opened or committed code to 27.7% of pull requests at the median company in September, while software factories opened 0.0% of pull requests even at the 90th percentile. Only 62% of surveyed developers said their organization manages AI-code risk effectively.",
    whyItMatters: "Approval: full autonomy is still rare and humans sign off on nearly every merge, which supports FDLC's earned-autonomy gates.",
    touches: "Approval",
    tags: ["adoption", "software factory", "governance"],
  },
  {
    id: "akamai-agent-sandbox",
    date: "2026-10-27",
    title: "Akamai launches Agent Sandbox with WebAssembly isolation for agent-written code",
    source: "Akamai Newsroom",
    url: "https://www.akamai.com/newsroom/press-release/akamai-launches-ai-inference-service-and-agent-execution-environment",
    summary: "Akamai Agent Sandbox, an open source component of the Spin framework, runs agent-written code in its own isolated environment with set limits on compute, memory, outbound connections, and system capabilities. It is in beta alongside Akamai Inference.",
    whyItMatters: "Runtime: another vendor puts a hard boundary around what agent-generated code can reach, a core control for the Execution stage.",
    touches: "Runtime",
    tags: ["sandboxes", "isolation", "infrastructure"],
  },
  {
    id: "mabl-agentic-testing-harness",
    date: "2026-10-21",
    title: "mabl launches an agentic testing harness for independent verification of agent-written code",
    source: "PR Newswire (mabl)",
    url: "https://www.prnewswire.com/news-releases/mabl-introduces-agentic-testing-harness-to-clear-the-verification-bottleneck-created-by-coding-agents-302914831.html",
    summary: "mabl added agent guardrails, a knowledge graph that maps a change to the tests that verify it, and terminal-based impact checks that run before a pull request is opened. Test cases in Xray, Zephyr, TestRail, and Azure DevOps become the bar every coding agent is held to.",
    whyItMatters: "Verification: an independent verdict, separate from the agent that wrote the code, is the evidence gate FDLC expects before approval.",
    touches: "Verification",
    tags: ["testing", "verification", "guardrails"],
  },
  {
    id: "gitlab-ai-native-engineering-playbook",
    date: "2026-10-20",
    title: "GitLab publishes an AI-native engineering playbook built on earned autonomy and layered verification",
    source: "GitLab Blog",
    url: "https://about.gitlab.com/blog/redesign-how-your-team-ships-software-with-ai-agents/",
    summary: "The playbook describes a four-stage autonomy ladder in which no rung is skipped and each step up needs evidence from the rung below. It pairs that with layered review that matches depth to risk and records every agentic review decision.",
    whyItMatters: "Approval: autonomy is widened only on measured evidence, with a named human accountable, which matches FDLC's gate model.",
    touches: "Approval",
    tags: ["autonomy", "code review", "governance"],
  },
  {
    id: "github-agentic-autofix-ga",
    date: "2026-10-15",
    title: "Agentic autofix for code scanning alerts is generally available",
    source: "GitHub Changelog",
    url: "https://github.blog/changelog/2026-10-15-agentic-autofix-for-code-scanning-alerts-general-availability/",
    summary: "Assigning a code scanning alert to Copilot now explores the codebase, proposes a fix, and reruns CodeQL to confirm the alert closes before opening a draft pull request that records the validation steps it took.",
    whyItMatters: "Verification: the agent must prove its fix against the same check that raised the alert, and a human still reviews the pull request.",
    touches: "Verification",
    tags: ["security", "remediation", "github"],
  },
] as const satisfies readonly FactoryUpdate[];
