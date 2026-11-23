/**
 * Factory Engineering in practice: data for the /factory-engineering page.
 * All external claims are attributed; figures are the source's own claims unless noted.
 * Sources were read before being cited.
 */

// ─── Factory stack layers ───────────────────────────────────────────────────

export type PracticeSource = { readonly label: string; readonly url: string };

export type FactoryStackLayer = {
  readonly question: string;
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly fdlcMapping: string;
  readonly sources: readonly PracticeSource[];
};

/** Design questions and further reading for each part of a workflow. */
export const factoryStackLayers: readonly FactoryStackLayer[] = [
  {
    number: "00",
    name: "Factories-as-code",
    question: "What rules govern this run?",
    description: "Version the workflow, permissions and checks together. A change to those rules gets its own review.",
    fdlcMapping: "Record the factory revision with each work order so a verifier can reconstruct the run.",
    sources: [
      { label: "Read the FDLC Specification", url: "/specification" },
    ],
  },
  {
    number: "01",
    name: "Data and context",
    question: "What can the worker read?",
    description: "Give workers approved skills and the context their task needs. Limit access and redact sensitive material before retaining traces.",
    fdlcMapping: "Record where evidence came from, who can see it and when it expires.",
    sources: [
      { label: "Guide to data, knowledge and semantic engineering", url: "/guide/03-build/19-data-knowledge-and-semantic-engineering" },
    ],
  },
  {
    number: "02",
    name: "Compute",
    question: "Where can the work run?",
    description: "Isolate the workspace and enforce limits on files, network access, identity and spend. Reuse prepared environments when the saved time justifies their cost.",
    fdlcMapping: "A worker still needs explicit permission for consequential actions inside a sandbox.",
    sources: [
      { label: "Execution environments and authority", url: "/guide/appendix/execution-boundaries-and-terminology" },
    ],
  },
  {
    number: "03",
    name: "Inference",
    question: "Which model fits the task?",
    description: "Compare candidate models on the team's own tasks. Put the routing decision in the reviewed configuration so the team can repeat the comparison.",
    fdlcMapping: "Record the model and harness alongside the candidate and its results.",
    sources: [
      { label: "Evaluate model choices against the workload", url: "/guide/04-prove/29-evaluation-engineering" },
    ],
  },
  {
    number: "04",
    name: "Improvement",
    question: "How do failures improve the next run?",
    description: "Group recurring failures and propose a change to a skill, workflow or check. Replay comparable tasks to see whether it helps.",
    fdlcMapping: "A named owner reviews improvements before activating a new factory revision.",
    sources: [
      { label: "Use production feedback to evaluate changes", url: "/guide/06-improve/39-production-feedback-review-and-the-agentic-merge-queue" },
    ],
  },
  {
    number: "05",
    name: "Orchestration",
    question: "How does interrupted work resume?",
    description: "Track assignments, checkpoints and evidence outside the conversation. Resume the same work order after an interruption and send unresolved decisions to its owner.",
    fdlcMapping: "Record which steps finished before retrying a tool or handing work to another agent.",
    sources: [
      { label: "Guide to durable execution", url: "/guide/03-build/14-durable-execution" },
    ],
  },
  {
    number: "06",
    name: "Access",
    question: "How does the team submit work?",
    description: "Accept a scoped request through the team's issue tracker, code host or chat. Return progress and the review decision to the same place.",
    fdlcMapping: "Preserve the requester's identity and the approval boundary across each handoff.",
    sources: [
      { label: "Intake and authority in the FDLC framework", url: "/framework" },
    ],
  },
] as const;

// ─── Measure and improve toolkit ────────────────────────────────────────────

export type MeasureImproveTool = {
  readonly question: string;
  readonly number: string;
  readonly name: string;
  readonly description: string;
  readonly fdlcGuardrail: string;
  readonly sources: readonly PracticeSource[];
};

/** Measurement methods and the checks FDLC uses when applying them. */
export const measureImproveTools: readonly MeasureImproveTool[] = [
  {
    number: "01",
    name: "Scorers / online evals",
    question: "Did the run meet a defined quality standard?",
    description: "LLM-as-a-judge scoring over full traces and artifacts—prompts, tool calls, MCP results, PRs, screenshots. One scorer per dimension (task compliance, architecture quality, test redundancy, tool-call efficiency, custom checks). Include a sampling strategy, scheduled runs, and human scorers for calibration.",
    fdlcGuardrail: "Calibrate judges against human labels before deploying them; track verifier disagreement (an FDLC benchmark metric) as a signal that scorer confidence is overstated.",
    sources: [
      { label: "Warp, 'Using LLM-as-a-judge scoring' (Sep 18, 2026)", url: "https://www.warp.dev/blog/using-llm-as-a-judge-scoring-to-measure-your-software-factory" },
    ],
  },
  {
    number: "02",
    name: "Self-improvement loops",
    question: "Which repeated failure merits a change?",
    description: "Agents cluster low-scoring conversations, find common failure causes, and propose changes to skills, AGENTS.md, or factory config as diffs. Because factory config is code, proposals are pull requests that engineers review. Self-improvement closes the outer loop without replacing human judgment.",
    fdlcGuardrail: "Proposals are Improvement Candidates: they enter FDLC's Learning stage and require an authorized human to approve activation. Agents propose; humans accept.",
    sources: [
      { label: "Ben Holmes, 'The road to self-improving software' (Oct 15, 2026)", url: "https://x.com/BHolmesDev/status/2110793920930107817" },
    ],
  },
  {
    number: "03",
    name: "Replay benchmarks ('your own SWE-bench')",
    question: "Does the change help on past work?",
    description: "A benchmark is a set of prior tasks × factory configurations × scorers × repetitions. Run against your own history, not published frontier leaderboards. Change one variable at a time. Benchmarks are not cheap; run them when new models release or when you are considering config changes, not continuously.",
    fdlcGuardrail: "Hermetic replay: reset tracker state and all side-effects before replaying a task; naively replaying completed tasks breaks the benchmark. Report cost per verified outcome and verifier disagreement beside every result.",
    sources: [
      { label: "Warp, factory benchmarks (Sep 3, 2026)", url: "https://www.warp.dev/blog/warp-factory-benchmarks" },
    ],
  },
  {
    number: "04",
    name: "Model routing",
    question: "Which model earns its cost on this task?",
    description: "Classifier-driven routes assign model class and reasoning effort per task type, based on benchmark results. Defined in code (not hard-coded per-call), so changes are diffs, can be branched for experiments, and can be proposed by self-improvement agents. The biggest lever in cost-per-PR is model selection.",
    fdlcGuardrail: "Route changes are factory config changes: they require the same review and qualification as any other factory change. Run benchmarks before and after to verify the tradeoff.",
    sources: [
      { label: "Ben Holmes, 'Becoming a factory engineer' (Nov 19, 2026)", url: "https://www.warp.dev/blog/factory-engineering-software-factories" },
      { label: "Warp benchmarks (Sep 3, 2026)", url: "https://www.warp.dev/blog/warp-factory-benchmarks" },
    ],
  },
  {
    number: "05",
    name: "A/B tests of factory versions",
    question: "How do two factory revisions compare?",
    description: "Treat factory configurations as hypotheses. Branch the factory config, route a declared cohort of live work to the branch, and compare scorer results and cost on matching task types. Close the branch when the evidence is in.",
    fdlcGuardrail: "Declare the cohort, the denominator, and the observation window before you start. Report both legs together; a quality improvement that triples cost is a tradeoff to decide, not a win.",
    sources: [
      { label: "Guide to evaluation engineering", url: "/guide/04-prove/29-evaluation-engineering" },
    ],
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
  headline: "Verify the change before release",
  coreNote: "Give the reviewer the intended behavior, the exact candidate and an independent check. Use the risk of the change to decide who reviews it and what recovery evidence they need.",
  evidenceArtifacts: {
    description: "Attach the smallest artifact that demonstrates the intended behavior. A contract-test result can establish an API response. A short recording can show a change a user can see.",
    fdlcNote: "Record the tested revision, environment and result together so the reviewer can identify exactly what passed.",
    sources: [
      { label: "Warp, 'Addressing the code review bottleneck' (Nov 5, 2026)", url: "https://www.warp.dev/blog/agent-code-review-bottleneck" },
    ],
  },
  reviewAgentLoop: {
    description: "A reviewer can return a specific failing check to the producer. Keep the evidence from both attempts and escalate a disagreement to the owner.",
    fdlcNote: "An independent review supplies evidence. The named owner decides whether to accept the change.",
    sources: [
      { label: "FDLC testing strategy for agentic changes", url: "/guide/04-prove/28-testing-strategy-for-agentic-change" },
    ],
  },
} as const;

// ─── Rollout and adoption ─────────────────────────────────────────────────────

export type RolloutTactic = {
  readonly phase?: "Start" | "Prove" | "Expand";
  readonly number: string;
  readonly name: string;
  readonly description: string;
};

/** Steps for qualifying one workflow before extending its scope. */
export const rolloutTactics: readonly RolloutTactic[] = [
  {
    number: "01", name: "Automate a low-risk chore", phase: "Start",
    description: "Start with crash triage, release notes or a documentation correction. Ask a maintainer to review the first few results and record what they had to fix.",
  },
  {
    number: "02", name: "Prove one complete workflow", phase: "Prove",
    description: "Run one change through a documentation site or an isolated service. Exercise the verifier, the approval handoff and the recovery procedure together.",
  },
  {
    number: "03", name: "Extend the proven boundary", phase: "Expand",
    description: "Add repositories or risk classes once the team can recover failed runs. Watch review queues, environment setup time, cost and escalation delays as the workload grows.",
  },
  {
    number: "04", name: "Name the release owner",
    description: "Record who can accept the candidate, stop the workflow and approve a restart after recovery.",
  },
  {
    number: "05", name: "Use the team’s normal intake",
    description: "Send requests through the issue tracker or review queue the team already uses. Return evidence and the final decision to the same request.",
  },
  {
    number: "06", name: "Agree on a baseline",
    description: "Collect the human review time, accepted changes and escaped defects for a comparable group of recent changes.",
  },
  {
    number: "07", name: "Rehearse recovery",
    description: "Interrupt a trial run. Verify that another operator can find the last confirmed state and resume the same request safely.",
  },
  {
    number: "08", name: "Review before expanding",
    description: "Inspect failures and cost alongside successful changes. Have the release owner record which permissions or workload classes the team can add next.",
  },
] as const;

// ─── Taxonomy ────────────────────────────────────────────────────────────────

export type TaxonomyTerm = {
  readonly term: string;
  readonly definition: string;
};

/** Working definitions used on this page. */
export const factoryTaxonomyTerms: readonly TaxonomyTerm[] = [
  {
    term: "Coding agent",
    definition: "A worker that can read repository context, use tools and propose a code change within its assigned permissions.",
  },
  {
    term: "Cloud coding agent",
    definition: "A coding worker that runs in a hosted environment. Its work order identifies the repository, revision, permissions and expected result.",
  },
  {
    term: "Software factory",
    definition: "A system of people, tools and agents that takes scoped software changes from request through verification and release.",
  },
  {
    term: "Factory Definition",
    definition: "The versioned description of what a factory may produce, the capabilities it needs and the conditions for accepting its work.",
  },
  {
    term: "Human touches per PR",
    definition: "The number of human interventions in a pull request. Record the reason and time spent so the team can distinguish planned review from unexpected rescue.",
  },
  {
    term: "Verified outcome",
    definition: "A result tied to a specific candidate and evidence showing whether it met the agreed acceptance criteria.",
  },
  {
    term: "Hermetic replay",
    definition: "Re-running a task with its starting revision, inputs and external state restored so that configurations can be compared on the same work.",
  },
  {
    term: "Release owner",
    definition: "The person with delegated authority to accept a candidate for release, request more evidence or stop the change.",
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
        "Uber Engineering reported that weekly agent requests grew 9.4 times while spending stabilized.",
        "Other coverage cites '11% of PRs', while Uber's engineering article says more than 70% are attributed to local or cloud agents. Verify the attribution definition, cohort, and time window before treating these as comparable figures.",
      ],
      lesson: "State what 'agent PR' means and which pull requests are counted. Authored, assisted, and reviewed work can measure different activity; a missing definition is a limitation, not a reason to infer one.",
      sources: [
        { label: "Uber Engineering’s operating report", url: "https://www.uber.com/us/en/blog/efficient-software-factory/" },
        { label: "Port’s Uber profile", url: "https://software-factories.port.io/companies/uber" },
      ],
    },
    {
      company: "Warp",
      figures: [
        "Warp reports various cost-per-PR improvements across different windows and scopes. These figures are Warp's own claims and reflect different cohorts, windows, and task mixes.",
        "Warp reported a 63% cost reduction for certain task types in its September benchmark.",
        "In a separate three-month report, Warp said it merged 40% more pull requests and reduced cost per pull request by 67%.",
      ],
      lesson: "Different task mixes and observation windows make these figures unsuitable for a combined estimate. Check each source's cohort, cost boundaries, and baseline before making a comparison.",
      sources: [
        { label: "Warp’s benchmark report", url: "https://www.warp.dev/blog/warp-factory-benchmarks" },
        { label: "Warp’s three-month report", url: "https://x.com/warpdotdev/status/2112605226196750762" },
      ],
    },
  ],
  fdlcPrinciple: "FDLC's 'publish the denominator and the missing evidence' principle applies to external figures as much as to your own. Report cohort, window, what counts as a PR, and what costs are included. Unknown costs are not zero.",
} as const;

// ─── Debate and balance ───────────────────────────────────────────────────────

export const factoryEngineeringDebate = {
  headline: "Is 'software factory' just marketing?",
  counterpoint: "Lauren Tan argues that good engineering and careful spending on model calls already describe the work.",
  counterpointSource: { label: "Lauren Tan’s argument", url: "https://x.com/poteto/status/2118613050462728659" },
  support: "Matt Pocock argues that designing the system that carries out the work is a distinct engineering responsibility.",
  supportSource: { label: "Matt Pocock’s response", url: "https://x.com/mattpocockuk/status/2119748545691402733" },
  fdlcPosition: "Either interpretation can be tested on one workflow. Name its owner, define success, keep the evidence and measure what happens after release.",
} as const;

// ─── Sources ─────────────────────────────────────────────────────────────────

export const factoryEngineeringPageSources = [
  { label: "How Warp Factories work", url: "https://docs.warp.dev/factories/how-factories-work/" },
  { label: "Ben Holmes, 'Becoming a factory engineer' (Nov 19, 2026)", url: "https://www.warp.dev/blog/factory-engineering-software-factories" },
  { label: "Warp, 'Addressing the code review bottleneck' (Nov 5, 2026)", url: "https://www.warp.dev/blog/agent-code-review-bottleneck" },
  { label: "Warp, 'Using LLM-as-a-judge scoring' (Sep 18, 2026)", url: "https://www.warp.dev/blog/using-llm-as-a-judge-scoring-to-measure-your-software-factory" },
  { label: "Warp, 'Adopting the software factory model: crawl, walk, run' (Sep 15, 2026)", url: "https://www.warp.dev/blog/adopting-the-software-factory-model-crawl-walk-run" },
  { label: "Warp factory benchmarks (Sep 3, 2026)", url: "https://www.warp.dev/blog/warp-factory-benchmarks" },
  { label: "Uber Engineering, 'Running a Software Factory Efficiently at Uber Scale' (Aug 27, 2026)", url: "https://www.uber.com/us/en/blog/efficient-software-factory/" },
  { label: "Linux Foundation Research, Enterprise Transitions to the Agentic Era (2026)", url: "https://www.linuxfoundation.org/research/enterprise-transitions-to-agentic-2026" },
] as const;
