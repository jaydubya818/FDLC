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

export const factoryUpdatesReviewed = "2026-10-24";

export const factoryUpdates = [
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
  {
    id: "factory-opencompute",
    date: "2026-10-14",
    title: "Factory introduces OpenCompute for self-hosted agent sandboxes",
    source: "Factory",
    url: "https://factory.com/news/opencompute",
    summary: "OpenCompute, in private preview, orchestrates agent sandboxes on customer-controlled infrastructure. It records desired state and reconciles toward it, and each provider driver must pass black-box conformance tests for the lifecycle profiles it claims.",
    whyItMatters: "Runtime: on-demand compute for agents stays inside the customer's boundary, behind explicit, testable contracts.",
    touches: "Runtime",
    tags: ["sandboxes", "infrastructure", "self-hosted"],
  },
  {
    id: "anthropic-scion-source-control",
    date: "2026-10-13",
    title: "Anthropic replaces git with an in-house system built for agent-scale merges",
    source: "Anthropic Engineering",
    url: "https://www.anthropic.com/engineering/redesigning-source-control",
    summary: "Merged changes grew from about 2,500 a day in May to more than 30,000 a day in September, so a seven-person team built Scion and migrated the monorepo off git in five months. Reviewers now examine the intent of each change rather than every line.",
    whyItMatters: "Release: when agents write the code, source control, CI, and the merge queue become the bottleneck, so post-merge and pre-deploy evidence carry more weight.",
    touches: "Release",
    tags: ["source control", "ci", "scale"],
  },
  {
    id: "google-gemini-agent-governance",
    date: "2026-10-08",
    title: "Google Cloud frames agent governance around identity, policy, audit, and a gateway",
    source: "Google Cloud Blog",
    url: "https://cloud.google.com/blog/products/ai-machine-learning/welcome-to-gemini-at-work-2026",
    summary: "With the Gemini agent, each agent gets a cryptographically attested identity, actions are audited and attributed to the agent rather than a person, execution runs in a sandbox, and all traffic passes through Agent Gateway, which enforces organization policy.",
    whyItMatters: "Policy: the four governance questions (who, allowed to do what, what it did, what it must never touch) map directly to factory controls.",
    touches: "Policy",
    tags: ["identity", "audit", "governance"],
  },
  {
    id: "github-copilot-local-sandboxing-ga",
    date: "2026-10-07",
    title: "Local sandboxing for GitHub Copilot is generally available",
    source: "GitHub Changelog",
    url: "https://github.blog/changelog/2026-10-07-local-sandboxing-for-github-copilot-now-generally-available/",
    summary: "Commands that Copilot starts in the CLI, the Copilot app, and VS Code Agent Host sessions now run with restricted access to files, network, and credentials. Enterprises can require sandboxing and enforce policies that developers cannot weaken.",
    whyItMatters: "Policy: tool execution is bounded by policy regardless of which model is in use, which is the precondition for granting more autonomy.",
    touches: "Policy",
    tags: ["sandboxing", "enterprise controls", "github"],
  },
  {
    id: "github-copilot-dynamic-workflows",
    date: "2026-10-01",
    title: "Dynamic workflows bring code-defined orchestration to Copilot",
    source: "GitHub Changelog",
    url: "https://github.blog/changelog/2026-10-01-dynamic-workflows-in-copilot-cli-and-the-copilot-app/",
    summary: "Copilot CLI, the Copilot app, and the Copilot SDK can run dynamic workflows: programs that define the steps, when agents are involved, and how their structured results flow, including cross-verification and checkpoints that pause for human review. The feature is in public preview.",
    whyItMatters: "Planning: the process becomes a versionable artifact, so the same steps and gates run every time.",
    touches: "Planning",
    tags: ["orchestration", "multi-agent", "github"],
  },
  {
    id: "openai-agents-api",
    date: "2026-09-10",
    title: "OpenAI opens the Codex harness to developers through the Agents API",
    source: "OpenAI",
    url: "https://openai.com/index/introducing-the-agents-api/",
    summary: "The Agents API, in public beta, runs cloud agents on the open-source Codex harness, with context compaction, tool search, and subagents. Agents run in an OpenAI-hosted sandbox, on the developer's own infrastructure, or with a sandbox partner.",
    whyItMatters: "Agents: the harness is becoming a managed, versioned dependency, so factories should pin and evaluate it like any other component.",
    touches: "Agents",
    tags: ["harness", "api", "openai"],
  },
  {
    id: "cursor-origin-code-hosting",
    date: "2026-08-17",
    title: "Cursor begins hosting code with Origin",
    source: "Cursor Changelog",
    url: "https://cursor.com/changelog/origin-code-hosting",
    summary: "Origin, in early beta on paid plans, hosts repositories and pull requests designed for agent scale and can sync GitHub repositories. Agents work in the same place as the code and its pull requests.",
    whyItMatters: "Execution: coding-agent vendors are moving into the system of record, which changes where the factory's evidence and approvals live.",
    touches: "Execution",
    tags: ["code hosting", "pull requests", "cursor"],
  },
] as const satisfies readonly FactoryUpdate[];
