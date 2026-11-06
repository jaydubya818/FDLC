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
