/**
 * Anti-metrics: signals that measure activity, not value.
 * Source: Zach Lloyd (Oct 22, 2026): https://x.com/zachlloydtweets/status/2113405050903237103
 */
export const antiMetrics = {
  headline: "Don't celebrate the wrong signals.",
  bad: ["Lines of code written", "Tokens used", "Agents running", "PRs opened", "Token leaderboard rank"],
  good: ["Cost per verified outcome", "Cycle time from intent to validated production outcome", "Human touches per accepted outcome", "Adoption percentage (share of merged PRs through the factory)", "Escaped consequential defects"],
  note: "A factory leaderboard should take cost into account and champion shipped work, not token spend.",
  openQuestion: "Zach Lloyd (Nov 17, 2026) notes: 'we need a better productivity metric than PRs merged.' FDLC's answer is the verified outcome: a production-ready candidate with an attributable evidence trail.",
  source: "https://x.com/zachlloydtweets/status/2113405050903237103 · https://x.com/zachlloydtweets/status/2122772833772462472",
} as const;

/**
 * Notes on reading public factory performance figures.
 * See data/factory-engineering.ts for the full version.
 */
export const publicNumbersCaution = {
  headline: "Reading public factory numbers",
  instruction: "Before citing a public figure, check: what was the cohort, the window, and the denominator? Several widely-cited figures count different things.",
  warpAdversarialReview: "Warp's adversarial-review benchmark (Nov 6, 2026): +140% cost for +7.5% quality improvement on its task set, later reported as '2–3x cost' for a quality increase on a different run. Source: https://x.com/zachlloydtweets/status/2118519684387512450 · https://x.com/zachlloydtweets/status/2120621519487586629",
  warpOpenWeights: "Warp reports that for some task types, open-weights models are more expensive than frontier equivalents once total cost is counted. Source: https://x.com/warpdotdev/status/2115849706131661029 (Oct 29, 2026)",
  uberCounting: "Uber's own engineering article reports more than 70% of PRs attributed to local or cloud agents, while other coverage cites about 11%. Check attribution rules, cohort, and time window before comparing them; the percentages alone do not establish why they differ. Sources: https://www.uber.com/us/en/blog/efficient-software-factory/ · https://software-factories.port.io/companies/uber",
  fdlcPrinciple: "FDLC's 'publish the denominator' principle applies to external figures as much as your own. Report cohort, window, what counts, and what costs are included.",
} as const;

/** Framework guidance and illustrative contracts; no measured operating results. */
export const engineeringOwnership = [
  ["Factory architecture", "Factory Definition, Outcome Contract, versioned workflows and replaceable component contracts.", "Business and service owners accept scope and service obligations."],
  ["Agent and Harness integration", "Adapters, conformance suites, pinned Models, Tools, Skills and Execution Profiles.", "Security approves credentials and environments; vendors document supported interfaces."],
  ["Context and knowledge", "Owned source registry, versioned knowledge, retrieval and revocation controls, applicability evaluations.", "Domain owners validate facts; security owners retain access-policy authority."],
  ["Independent verification", "Protected criteria, local and global checks, exact-Candidate evidence and verifier calibration.", "Requirements owners set acceptance; reviewers retain independent judgment."],
  ["Executable governance", "Action-level authority policies, operating domains, approval records and safe-stop controls.", "Leadership delegates authority; risk and security owners approve consequential exceptions."],
  ["Reliability and operations", "Durable state, leases, concurrency limits, reconciliation, CI/CD, telemetry and incident runbooks.", "Service owners authorize rollout, production response and recovery objectives."],
  ["Performance and economics", "Workload scorecards, cost attribution, human-attention studies and build-versus-buy evaluations.", "Finance and engineering leaders agree cost assumptions and outcome value."],
  ["Factory evolution", "Improvement Candidates, independent comparisons, composition qualification and Factory Version promotion records.", "An authorized owner approves activation; policy owners control changes to controls."],
] as const;

export const factoryScorecard = [
  ["Delivery", "Verified outcomes per window; median / p90 time from intent to validated production outcome.", "Cohort by intent intake; report accepted count, pending age and unresolved outcomes."],
  ["Quality", "Escaped consequential defects per observed release; releases rolled back / observed releases.", "Use a declared post-release observation period; mark immature releases pending."],
  ["Autonomy", "Accepted work completed without unplanned human rescue / all admitted work in the approved domain.", "Count failures and escalations in the denominator; report outside-domain work separately."],
  ["Reliability", "Successfully reconciled recovery events / all recovery events; median / p90 recovery time.", "Include unresolved events, interruption rate and recurrence by root cause."],
  ["Human attention", "Interventions and verification + investigation minutes per accepted outcome.", "Include failed work; report context switches and a fixed perceived-effort survey with response coverage."],
  ["Economics", "All attributable model + compute + tooling + verification + human cost / verified outcomes.", "Separate cost per accepted change; include retries and incidents. Unknown costs remain unknown."],
  ["Knowledge", "Decisions with current authoritative context / decisions requiring it; applicability errors / audited uses.", "Report freshness, recurrent gaps and audit coverage; missing provenance is incomplete."],
  ["Governance", "Correct policy decisions / audited decisions; improper blocks, missed escalations and complete evidence packages.", "Report false blocks / authorized cases and missed escalations / cases requiring escalation separately."],
] as const;

export const operatingDomainExamples = [
  ["Documentation", "Autonomous edits within approved paths, with links and rendering verified; security or contractual claims need owner review."],
  ["Isolated bug fixes", "A qualified repository and bounded fix with protected regression checks; behavior changes return to the contract owner."],
  ["Test generation", "Propose and execute tests in a sandbox; independent review controls changes to protected acceptance tests."],
  ["Dependency updates", "Only qualified versions and update classes with compatibility, supply-chain and rollback evidence."],
  ["Refactoring", "Preserve contracted behavior and inspect integration evidence; cross-service effects can require narrower scope or approval."],
  ["Database migrations", "Require qualified migration and recovery procedures, data-integrity evidence and named data / service owner authority."],
  ["Authentication / security", "A small diff may be high consequence. Require threat and negative tests, independent security review and delegated decision rights."],
  ["Production deployments", "Separate deployment authority from edit or merge authority; bind approval to Candidate, environment, rollout and recovery conditions."],
] as const;
