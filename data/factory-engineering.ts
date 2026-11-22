/**
 * Factory Engineering in practice: data for the /factory-engineering page.
 * All external claims are attributed; figures are the source's own claims unless noted.
 * Sources were read before being cited.
 */

// ─── Factory stack layers ───────────────────────────────────────────────────

export type FactoryStackLayer = {
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly fdlcMapping: string;
  readonly sourceNote: string;
};

/**
 * Seven-layer factory stack, adapted from Zach Lloyd's public posts and
 * Warp's blog, mapped to FDLC stages and capabilities.
 * Source: https://www.warp.dev/blog/the-factory-stack (Sep 5, 2026);
 *   https://x.com/zachlloydtweets/status/2121318753711583254 (Nov 13, 2026).
 * Principles: open, composable, defined in code.
 */
export const factoryStackLayers: readonly FactoryStackLayer[] = [
  {
    number: "00",
    name: "Factories-as-code",
    description: "Every aspect of the factory—agent workflows, access permissions, sandbox configuration—is version-controlled code that humans and agents can read and modify. Changes are diffs with code owners; branches enable safe experiments; agents can propose changes to their own setup.",
    fdlcMapping: "Intent and Learning: a reviewable, versioned definition of the factory's governing intent; self-improvement proposals become Improvement Candidates, never self-activated.",
    sourceNote: "Zach Lloyd, 'Terraform for agents' (Sep 30, 2026): https://www.warp.dev/blog/software-factory-as-code",
  },
  {
    number: "01",
    name: "Data and context",
    description: "Keep the skills, run metadata, approved evidence, and telemetry needed to evaluate the factory in an organization-controlled, API-accessible store. Apply access controls, redaction, and retention limits before collecting prompts or tool results; never treat secrets or personal data as unrestricted evaluation material.",
    fdlcMapping: "Evidence and Observability: centralized trace storage is what FDLC's Evidence stage depends on for the scorer inputs that feed Evals and Learning.",
    sourceNote: "Zach Lloyd, factory stack post (Nov 13, 2026): https://x.com/zachlloydtweets/status/2121318753711583254",
  },
  {
    number: "02",
    name: "Compute",
    description: "Use isolated execution environments with enforced file, network, identity, and resource limits. Pre-warm environments when interactive latency justifies the cost. Isolation limits what an agent can reach; consequential actions still require the authority declared in the task and approval policy.",
    fdlcMapping: "Runtime and Policy: execution sandboxing is a Policy-layer control; pre-warmed sandboxes serve the Runtime capability's durability requirement.",
    sourceNote: "Warp, 'Don't vibe code your software factory' (Nov 4, 2026): https://www.warp.dev/blog/build-production-software-factory",
  },
  {
    number: "03",
    name: "Inference",
    description: "Any model, any harness: the factory is not bound to one provider or coding-agent vendor. Model routing assigns different model classes to different task types, driven by benchmark results on your own prior tasks rather than published frontier scores.",
    fdlcMapping: "Models: model-agnostic routing from evidence is the FDLC approach to the Models capability; never make a provider the factory identity.",
    sourceNote: "Zach Lloyd, factory stack (Sep 5, 2026): https://www.warp.dev/blog/the-factory-stack",
  },
  {
    number: "04",
    name: "Improvement",
    description: "Cost-per-PR, cycle time, DORA metrics, scorer results, and benchmark evidence. Scorers run over full traces; self-improvement agents cluster low-scoring runs and propose changes to skills, AGENTS.md, or factory config. The improvement loop is closed, measurable, and runs empirically—not on vibes.",
    fdlcMapping: "Evals and Learning: improvement proposals are Improvement Candidates under FDLC's Learning stage; scorers feed the Evals capability; the whole loop maps to the FDLC governing lifecycle's Learning → Intent path.",
    sourceNote: "Zach Lloyd, 'Measure and improve' thread (Nov 17, 2026): https://x.com/zachlloydtweets/status/2122706371905049006",
  },
  {
    number: "05",
    name: "Orchestration",
    description: "Launch, track, and recover work across agents. The orchestration layer reads the factory code (or a branch for experiments), spins up sandboxes, routes to agents with the right model and harness, records approved evidence and redacted traces, loops in humans at declared gates, and integrates with error monitoring, issue trackers, and forges.",
    fdlcMapping: "Runtime and Human control: durability, checkpointing, and human hand-off gates are Runtime requirements; the human-gate pattern maps to FDLC's Approval stage.",
    sourceNote: "Zach Lloyd (Nov 16, 2026): https://x.com/zachlloydtweets/status/2122343954595340414",
  },
  {
    number: "06",
    name: "Access",
    description: "Meet engineers in the tools they already use—Slack, Teams, GitHub, Linear, Jira—and accept work at any lifecycle stage (a ticket, a spec, or a local PR via a factory MCP). Do not build a new web portal as the primary interface; it creates another place engineers must go.",
    fdlcMapping: "Human control: access through existing team tools reduces adoption friction and keeps context where it already lives, supporting FDLC's human-gate design.",
    sourceNote: "Zach Lloyd, 'Tactics for rolling out software factories' (Oct 15, 2026): https://x.com/zachlloydtweets/status/2110808772058960367",
  },
] as const;

// ─── Measure and improve toolkit ────────────────────────────────────────────

export type MeasureImproveTool = {
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly fdlcGuardrail: string;
  readonly sourceNote: string;
};

/**
 * Five measure-and-improve tools for factory engineers.
 * Source: Zach Lloyd (Nov 17, 2026): https://x.com/zachlloydtweets/status/2122706371905049006
 *   Ben Holmes, 'Becoming a factory engineer' (Nov 19, 2026): https://www.warp.dev/blog/factory-engineering-software-factories
 *   Warp, 'Using LLM-as-a-judge scoring' (Sep 18, 2026): https://www.warp.dev/blog/using-llm-as-a-judge-scoring-to-measure-your-software-factory
 *   Warp, factory benchmarks (Sep 3, 2026): https://www.warp.dev/blog/warp-factory-benchmarks
 */
export const measureImproveTools: readonly MeasureImproveTool[] = [
  {
    number: "01",
    name: "Scorers / online evals",
    description: "LLM-as-a-judge scoring over full traces and artifacts—prompts, tool calls, MCP results, PRs, screenshots. One scorer per dimension (task compliance, architecture quality, test redundancy, tool-call efficiency, custom checks). Include a sampling strategy, scheduled runs, and human scorers for calibration.",
    fdlcGuardrail: "Calibrate judges against human labels before deploying them; track verifier disagreement (an FDLC benchmark metric) as a signal that scorer confidence is overstated.",
    sourceNote: "Warp, 'Using LLM-as-a-judge scoring' (Sep 18, 2026): https://www.warp.dev/blog/using-llm-as-a-judge-scoring-to-measure-your-software-factory",
  },
  {
    number: "02",
    name: "Self-improvement loops",
    description: "Agents cluster low-scoring conversations, find common failure causes, and propose changes to skills, AGENTS.md, or factory config as diffs. Because factory config is code, proposals are pull requests that engineers review. Self-improvement closes the outer loop without replacing human judgment.",
    fdlcGuardrail: "Proposals are Improvement Candidates: they enter FDLC's Learning stage and require an authorized human to approve activation. Agents propose; humans accept.",
    sourceNote: "Ben Holmes, 'The road to self-improving software' (Oct 15, 2026): https://x.com/BHolmesDev/status/2110793920930107817",
  },
  {
    number: "03",
    name: "Replay benchmarks ('your own SWE-bench')",
    description: "A benchmark is a set of prior tasks × factory configurations × scorers × repetitions. Run against your own history, not published frontier leaderboards. Change one variable at a time. Benchmarks are not cheap; run them when new models release or when you are considering config changes, not continuously.",
    fdlcGuardrail: "Hermetic replay: reset tracker state and all side-effects before replaying a task; naively replaying completed tasks breaks the benchmark. Report cost per verified outcome and verifier disagreement beside every result.",
    sourceNote: "Warp, factory benchmarks (Sep 3, 2026): https://www.warp.dev/blog/warp-factory-benchmarks · Warp, 'Don't vibe code your factory' (Nov 4, 2026): https://www.warp.dev/blog/build-production-software-factory",
  },
  {
    number: "04",
    name: "Model routing",
    description: "Classifier-driven routes assign model class and reasoning effort per task type, based on benchmark results. Defined in code (not hard-coded per-call), so changes are diffs, can be branched for experiments, and can be proposed by self-improvement agents. The biggest lever in cost-per-PR is model selection.",
    fdlcGuardrail: "Route changes are factory config changes: they require the same review and qualification as any other factory change. Run benchmarks before and after to verify the tradeoff.",
    sourceNote: "Ben Holmes, 'Becoming a factory engineer' (Nov 19, 2026): https://www.warp.dev/blog/factory-engineering-software-factories · Warp benchmarks (Sep 3, 2026): https://www.warp.dev/blog/warp-factory-benchmarks",
  },
  {
    number: "05",
    name: "A/B tests of factory versions",
    description: "Treat factory configurations as hypotheses. Branch the factory config, route a declared cohort of live work to the branch, and compare scorer results and cost on matching task types. Close the branch when the evidence is in.",
    fdlcGuardrail: "Declare the cohort, the denominator, and the observation window before you start. Report both legs together; a quality improvement that triples cost is a tradeoff to decide, not a win.",
    sourceNote: "Zach Lloyd (Nov 17, 2026): https://x.com/zachlloydtweets/status/2122706371905049006",
  },
] as const;

// ─── Verification and merge risk ─────────────────────────────────────────────

export type MergeRiskCriterion = {
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly fdlcMapping: string;
};

/**
 * Five merge-risk criteria from Warp's /merge-risk skill.
 * Source: Ben Holmes (Oct 20 and Nov 6, 2026):
 *   https://x.com/BHolmesDev/status/2112653011369807971
 *   https://x.com/BHolmesDev/status/2118807366250721741
 * Skill install: npx skills add warpdotdev/common-skills --skill merge-risk
 */
export const mergeRiskCriteria: readonly MergeRiskCriterion[] = [
  {
    number: "01",
    name: "Alignment",
    description: "Does the change do what the spec or intent said? Check the diff against the stated goal, acceptance criteria, and test coverage before measuring anything else.",
    fdlcMapping: "Intent: maps to the Factory Definition's outcome contract—the first gate in FDLC's governing lifecycle.",
  },
  {
    number: "02",
    name: "Impact / blast radius",
    description: "How widely does the change propagate? Sensitive paths (auth, payments, data schemas, public interfaces), call-graph breadth, and whether the change is reversible all increase impact.",
    fdlcMapping: "Policy: maps to FDLC's operating domain constraints; high-impact paths require the narrower scopes and explicit authorities defined in Policy.",
  },
  {
    number: "03",
    name: "Verification",
    description: "What evidence is attached? Tests (unit, integration, e2e), screen recordings or before-and-after screenshots from computer use, and staging-environment results all count. Absence of verification evidence is itself a risk signal.",
    fdlcMapping: "Evidence: the FDLC Evidence stage requires an exact, attributable proof package; a merge-risk score with no verification evidence is incomplete.",
  },
  {
    number: "04",
    name: "Rollback cost",
    description: "Is the change a one-way or two-way door? Database migrations, protocol changes, and published API changes are hard to roll back; a UI copy edit is easy. Rollback cost sets the bar for review depth.",
    fdlcMapping: "Release: maps to FDLC's Release stage requirements for rollback conditions and recovery procedures; one-way doors require named recovery plans.",
  },
  {
    number: "05",
    name: "Error detection",
    description: "Will a failure be caught quickly, or could it propagate silently? Strong error detection (alerting, tracing, canary metrics) lowers the cost of a mistake; weak error detection raises the bar for pre-merge evidence.",
    fdlcMapping: "Outcomes: maps to FDLC's Outcomes stage—observable failure modes, production monitoring, and feedback loops that make regressions detectable.",
  },
] as const;

export const verificationPractice = {
  headline: "Review is risk mitigation, not a quality check.",
  coreNote: "Code review is now primarily about assessing and routing risk, not about catching every issue. Close line-by-line review will become progressively less needed as verification evidence improves.",
  evidenceArtifacts: {
    description: "For user-visible or behavior-changing work, attach end-to-end evidence to the candidate: a screen recording trimmed to the decision-relevant segment, or before-and-after screenshots captured via computer use or browser tooling. Simulate realistic backends (staging DB, test credentials, access logs). Guard against over-verification: capturing the same behavior twice wastes cycles without improving signal.",
    fdlcNote: "These artifacts belong in FDLC's Evidence stage. A PR without verification evidence is an unverified candidate; it should not reach the Approval stage.",
    source: "Warp (Oct 23, 2026): https://x.com/zachlloydtweets/status/2113655321189359831 · Warp, 'Addressing the code review bottleneck' (Nov 5, 2026): https://www.warp.dev/blog/agent-code-review-bottleneck",
  },
  reviewAgentLoop: {
    description: "Implementation and review agents iterate off the PR thread. Only unresolved or ambiguous findings surface as PR comments that require human input. Gate multi-round review by change size or risk score to control cost.",
    fdlcNote: "Agent-to-agent review is part of Verification, not Authorization. A named human still holds Approval authority; the review-agent loop reduces the evidence gap, not the authority requirement.",
    contestedPractice: "Warp reports making agents the PR author and removing the requirement for a second engineer's review in certain cases. FDLC position: this is acceptable only inside a declared operating domain where a named human still holds approval authority. Verification is not authorization.",
    source: "Zach Lloyd (Nov 12, 2026): https://x.com/zachlloydtweets/status/2121000139410321774 · Zach Lloyd (Oct 22, 2026): https://x.com/zachlloydtweets/status/2113284357918224422",
  },
} as const;

// ─── Rollout and adoption ─────────────────────────────────────────────────────

export type RolloutTactic = {
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly sourceNote?: string;
};

/**
 * Adoption tactics for rolling out software factories.
 * Source: Zach Lloyd, 'Tactics for rolling out software factories' (Oct 15, 2026):
 *   https://x.com/zachlloydtweets/status/2110808772058960367
 *   https://www.warp.dev/blog/software-factory-adoption-challenges (Nov 16, 2026)
 */
export const rolloutTactics: readonly RolloutTactic[] = [
  {
    number: "01",
    name: "The goal is not full automation",
    description: "The goal is quality software with customer impact, measured. Factories that run invisibly without shared ownership risk attrition and produce a 'dark factory' that engineers don't trust or understand.",
    sourceNote: "Zach Lloyd (Oct 15, 2026): https://x.com/zachlloydtweets/status/2110808772058960367",
  },
  {
    number: "02",
    name: "Crawl: start with chore automations",
    description: "Begin with simple, low-risk automations that engineers view as chores—Sentry crash triage, dogfood issue triage, changelog and documentation. Avoid launching a full backlog auto-fixer first; the team will conclude it is a 'slop cannon'. A team of factory champions tunes automations before wide rollout.",
    sourceNote: "Zach Lloyd (Oct 21, 2026): https://x.com/zachlloydtweets/status/2113042668993614069 · Warp, 'Crawl, walk, run' (Sep 15, 2026): https://www.warp.dev/blog/adopting-the-software-factory-model-crawl-walk-run",
  },
  {
    number: "03",
    name: "Walk: first end-to-end line on a simple surface",
    description: "Deploy one complete factory line on a low-complexity surface—a marketing site, documentation, or an isolated service. This is FDLC's Lighthouse pattern: prove one workflow end to end before expanding.",
    sourceNote: "Warp, 'Crawl, walk, run' (Sep 15, 2026): https://www.warp.dev/blog/adopting-the-software-factory-model-crawl-walk-run",
  },
  {
    number: "04",
    name: "Run: complex repos, watch the bottlenecks",
    description: "Scale to complex codebases when the simpler lines are proven. Watch for: environment setup time, telling genuine improvement from churn, cost, security signoff, multi-stakeholder approval, PR pile-up, and closing the monitoring loop.",
    sourceNote: "Warp, 'Crawl, walk, run' (Sep 15, 2026): https://www.warp.dev/blog/adopting-the-software-factory-model-crawl-walk-run",
  },
  {
    number: "05",
    name: "Meet engineers in the tools they already use",
    description: "Make work accessible via Slack, Teams, GitHub, Linear, and Jira. Accept work at any lifecycle stage: a ticket, a spec, or a local PR via a factory MCP. Do not build a new factory web portal as the primary interface; it creates a destination engineers must remember to visit.",
    sourceNote: "Zach Lloyd (Oct 15, 2026): https://x.com/zachlloydtweets/status/2110808772058960367",
  },
  {
    number: "06",
    name: "Position the factory as infrastructure, not a product",
    description: "Everyone on the team does factory engineering: they can debug it, improve it, and propose changes. Factory work counts in feedback and performance reviews. The factory is shared infrastructure, not a product someone else owns.",
    sourceNote: "Zach Lloyd (Oct 15, 2026): https://x.com/zachlloydtweets/status/2110808772058960367",
  },
  {
    number: "07",
    name: "Encourage, don't require; celebrate shipped work, not tokens",
    description: "Token spend, lines of code, and agent counts are costs, not value. The right signals are shipped outcomes, cycle time, and adoption (the percentage of merged PRs that flowed through the factory). Token leaderboards 'can make us all feel like cogs in a machine.'",
    sourceNote: "Zach Lloyd (Oct 22, 2026): https://x.com/zachlloydtweets/status/2113405050903237103",
  },
  {
    number: "08",
    name: "Metric order: adoption first, then efficiency",
    description: "Track in this order: adoption percentage (what fraction of merged PRs flowed through the factory) → throughput → cycle time → cost per PR → scorer metrics. Efficiency numbers without adoption context are ungrounded.",
    sourceNote: "Zach Lloyd (Oct 15, 2026): https://x.com/zachlloydtweets/status/2110808772058960367",
  },
  {
    number: "09",
    name: "Working in public: benefits and costs",
    description: "Shared factory sessions let teammates add context, pick up work from any device, and build a searchable history. The costs are real too: working in public changes how effort feels, and token-spend visibility can expose individuals. Acknowledge both when introducing the shift.",
    sourceNote: "Zach Lloyd, 'Adapting for a world of software factories' (Sep 29, 2026): https://www.warp.dev/blog/adapting-for-a-world-of-software-factories",
  },
  {
    number: "10",
    name: "Reframe: design the factory, not work the line",
    description: "The objection 'my personal productivity depends on my local setup' is real and reasonable. Meet it by framing the shift as moving up an abstraction layer—from individual agent cockpit to team-owned factory infrastructure—not as giving up tools that work. The transition has a short-term step back.",
    sourceNote: "Zach Lloyd, 'Overcoming challenges in software factory adoption' (Nov 16, 2026): https://www.warp.dev/blog/software-factory-adoption-challenges",
  },
] as const;

// ─── Taxonomy ────────────────────────────────────────────────────────────────

export type TaxonomyTerm = {
  readonly term: string;
  readonly definition: string;
  readonly sourceNote?: string;
};

/**
 * Factory engineering taxonomy: the ladder from coding agent to software factory,
 * plus terms that have entered 2026 practice.
 * Primary source: Zach Lloyd, coding-agent glossary (Nov 6, 2026):
 *   https://x.com/zachlloydtweets/status/2118725953966715217
 *   https://x.com/zachlloydtweets/status/2120245800924262816 (Nov 10, 2026)
 */
export const factoryTaxonomyTerms: readonly TaxonomyTerm[] = [
  {
    term: "Coding agent",
    definition: "An AI agent that takes a coding task and produces a code change. Runs locally or in the cloud; the base unit of automated coding work.",
    sourceNote: "Zach Lloyd, glossary (Nov 6, 2026): https://x.com/zachlloydtweets/status/2118725953966715217",
  },
  {
    term: "Cloud coding agent automation",
    definition: "A coding agent that runs headlessly in the cloud, triggered by an event or schedule, without requiring a human to be present. The step above interactive use.",
    sourceNote: "Zach Lloyd, glossary (Nov 6, 2026): https://x.com/zachlloydtweets/status/2118725953966715217",
  },
  {
    term: "Software factory",
    definition: "An automation loop in the cloud that orchestrates agents to build better and better software over time. Zach Lloyd's criteria: headless infrastructure; workflows defined in code; runs in the cloud; runs different coding agents; stores all agent data; measurable, testable, and self-improving.",
    sourceNote: "Zach Lloyd (Nov 12, 2026): https://x.com/zachlloydtweets/status/2121015195216785887 · Zach Lloyd, glossary (Nov 6, 2026): https://x.com/zachlloydtweets/status/2118725953966715217",
  },
  {
    term: "What a software factory is not",
    definition: "Per Zach Lloyd (Nov 10, 2026): (1) a loose collection of automations around cloud agents; (2) a team of AI Engineers that developers manage interactively; (3) a set of skills and MCPs that individual engineers all adopt independently across a team; (4) a personal agent swarm.",
    sourceNote: "Zach Lloyd (Nov 10, 2026): https://x.com/zachlloydtweets/status/2120245800924262816",
  },
  {
    term: "Human touches per PR",
    definition: "The number of times a human intervenes per pull request: approval, steering, correction, or escalation. A factory efficiency signal: over time, you want to drive this down. Distinct from approval authority—a named human still holds approval even when touches are low.",
    sourceNote: "Zach Lloyd (Sep 30, 2026): https://x.com/zachlloydtweets/status/2105296615783436436",
  },
  {
    term: "Factory leaderboard",
    definition: "A view of factory performance ranked by shipped work and cost efficiency, not by token spend or PR volume. The leaderboard should champion real outcomes; token leaderboards misalign incentives.",
    sourceNote: "Zach Lloyd (Oct 22, 2026): https://x.com/zachlloydtweets/status/2113405050903237103",
  },
  {
    term: "Hermetic replay",
    definition: "Re-running a past task in a fully reset environment—tracker state, side-effects, and all—so the benchmark result reflects the configuration change, not residual state from the first run. Required for valid replay benchmarks.",
    sourceNote: "Warp (Nov 4, 2026): https://www.warp.dev/blog/build-production-software-factory",
  },
  {
    term: "Factory champions",
    definition: "A small team that tunes and owns factory automations before wide rollout. Champions have permission to experiment, break things safely, and report back; they lower the risk that a broad rollout surfaces poorly calibrated automations.",
    sourceNote: "Zach Lloyd (Oct 15, 2026): https://x.com/zachlloydtweets/status/2110808772058960367",
  },
  {
    term: "Gardening / outer loop",
    definition: "The supervisory practice of watching what the factory produces, pruning bad patterns, and proposing improvements. Ben Holmes credits @poteto with the 'gardening' framing; the outer loop is factory engineering, while the inner loop is product engineering.",
    sourceNote: "Ben Holmes (Oct 6, 2026): https://x.com/BHolmesDev/status/2107588784275816461",
  },
  {
    term: "Multi-player interactive agents",
    definition: "A stepping stone between individual local agent use and a full factory: individuals still prompt directly, but in shared tools (Slack, GitHub) so teammates can add context and the conversation history is searchable by the whole team.",
    sourceNote: "Zach Lloyd (Sep 22, 2026): https://x.com/zachlloydtweets/status/2102520507883012589",
  },
] as const;

// ─── Public numbers caution ───────────────────────────────────────────────────

/**
 * Notes on reading public factory performance figures.
 * Every figure below is the source's own claim; several are contested.
 * This section applies FDLC's 'publish the denominator' principle to public data.
 */
export const publicNumbersNotes = {
  headline: "Reading public factory numbers",
  instruction: "Before citing a public figure, check: what was the cohort, the observation window, and the denominator? Several widely-cited figures count different things.",
  cases: [
    {
      company: "Uber",
      figures: [
        "Uber Engineering's Aug 2026 blog (https://www.uber.com/us/en/blog/efficient-software-factory/) reports that 'weekly agent requests grew 9.4x while spend stabilized.'",
        "Other coverage cites '11% of PRs', while Uber's engineering article says more than 70% are attributed to local or cloud agents. Verify the attribution definition, cohort, and time window before treating these as comparable figures.",
      ],
      lesson: "State what 'agent PR' means and which pull requests are counted. Authored, assisted, and reviewed work can measure different activity; a missing definition is a limitation, not a reason to infer one.",
      source: "https://www.uber.com/us/en/blog/efficient-software-factory/ · https://software-factories.port.io/companies/uber",
    },
    {
      company: "Warp",
      figures: [
        "Warp reports various cost-per-PR improvements across different windows and scopes. These figures are Warp's own claims and reflect different cohorts, windows, and task mixes.",
        "Warp's Sep 3, 2026 benchmark post reports '63% cost reduction on certain types of tasks' (https://www.warp.dev/blog/warp-factory-benchmarks).",
        "Warp's Oct 20, 2026 post reports '40% more PRs merged and 67% lower cost per PR' over three months (https://x.com/warpdotdev/status/2112605226196750762).",
      ],
      lesson: "Different task mixes and observation windows make these figures unsuitable for a combined estimate. Check each source's cohort, cost boundaries, and baseline before making a comparison.",
      source: "https://www.warp.dev/blog/warp-factory-benchmarks · https://x.com/warpdotdev/status/2112605226196750762",
    },
  ],
  fdlcPrinciple: "FDLC's 'publish the denominator and the missing evidence' principle applies to external figures as much as to your own. Report cohort, window, what counts as a PR, and what costs are included. Unknown costs are not zero.",
} as const;

// ─── Debate and balance ───────────────────────────────────────────────────────

export const factoryEngineeringDebate = {
  headline: "Is 'software factory' just marketing?",
  counterpoint: "Critics—including experienced engineers working at coding-agent companies—argue that 'software factory' is marketing for what should just be called good software engineering with thoughtful token allocation. @poteto (Nov 6, 2026) wrote: 'hot take: you don't need a software factory, and i don't love the term. it's just marketing. all you need is good software engineering and investing your tokens in the right places.' (https://x.com/poteto/status/2118613050462728659)",
  support: "Supporters, including Matt Pocock (Nov 9, 2026) and Zach Lloyd, say the term is imperfect but names a real move up in abstraction: from writing code, to writing prompts, to engineering the system of agents that executes on those prompts. (https://x.com/mattpocockuk/status/2119748545691402733)",
  fdlcPosition: "The label matters less than the discipline. Bounded intent, attributable evidence, explicit authority, and measured improvement apply whether you call it a software factory, an agentic pipeline, or a well-governed CI system. FDLC defines the engineering discipline, not the technology stack.",
} as const;

// ─── Sources ─────────────────────────────────────────────────────────────────

export const factoryEngineeringPageSources = [
  { label: "Ben Holmes, 'Becoming a factory engineer' (Nov 19, 2026)", url: "https://www.warp.dev/blog/factory-engineering-software-factories" },
  { label: "Zach Lloyd, AI Engineer Code Summit keynote (Nov 12, 2026)", url: "https://ai.engineer/code/2026/talks/zach-lloyd" },
  { label: "Zach Lloyd, 'Overcoming challenges in software factory adoption' (Nov 16, 2026)", url: "https://www.warp.dev/blog/software-factory-adoption-challenges" },
  { label: "Warp, 'Don't vibe code your software factory' (Nov 4, 2026)", url: "https://www.warp.dev/blog/build-production-software-factory" },
  { label: "Warp, 'Addressing the code review bottleneck' (Nov 5, 2026)", url: "https://www.warp.dev/blog/agent-code-review-bottleneck" },
  { label: "Warp, 'The factory stack' (Sep 5, 2026)", url: "https://www.warp.dev/blog/the-factory-stack" },
  { label: "Warp, 'Terraform for agents: how we define our software factory in code' (Sep 30, 2026)", url: "https://www.warp.dev/blog/software-factory-as-code" },
  { label: "Warp, 'Using LLM-as-a-judge scoring' (Sep 18, 2026)", url: "https://www.warp.dev/blog/using-llm-as-a-judge-scoring-to-measure-your-software-factory" },
  { label: "Warp, 'Adopting the software factory model: crawl, walk, run' (Sep 15, 2026)", url: "https://www.warp.dev/blog/adopting-the-software-factory-model-crawl-walk-run" },
  { label: "Warp factory benchmarks (Sep 3, 2026)", url: "https://www.warp.dev/blog/warp-factory-benchmarks" },
  { label: "Warp, 'Adapting for a world of software factories' (Sep 29, 2026)", url: "https://www.warp.dev/blog/adapting-for-a-world-of-software-factories" },
  { label: "Uber Engineering, 'Running a Software Factory Efficiently at Uber Scale' (Aug 27, 2026)", url: "https://www.uber.com/us/en/blog/efficient-software-factory/" },
  { label: "Linux Foundation Research, Enterprise Transitions to the Agentic Era (2026)", url: "https://www.linuxfoundation.org/research/enterprise-transitions-to-agentic-2026" },
] as const;
