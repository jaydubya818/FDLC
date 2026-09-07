export const enterpriseGuideHref = "/guide/appendix/enterprise-multi-factory-delivery";

export const enterpriseStages = [
  ["Builder intent", "Describe the outcome, scope, constraints, and acceptance criteria. Repository and organizational context ground the request; intent alone grants no authority."],
  ["Classify the objective", "Identify required capabilities using repository manifests, dependencies, ownership, data classification, and policy alongside model reasoning."],
  ["Approve a governed Plan", "A replaceable planner proposes WorkOrders and dependencies. The durable Plan records verification contracts, budgets, stop conditions, and approval of an exact revision."],
  ["Route each WorkOrder", "Filter for authorization, compatibility, and qualification first. Rank eligible Factory Versions using evidence for comparable workloads, then pin the version and Execution Profile."],
  ["Execute inside the factory", "A supervisor coordinates bounded Tasks across specialists, harnesses, and deterministic tools. Each Attempt records its inputs, capabilities, cost, and resulting Candidate."],
  ["Verify locally and globally", "Independent verification checks each WorkOrder. Objective verification checks the integrated Candidate against acceptance criteria and current upstream artifacts."],
  ["Authorize and release", "The accountable authority reviews evidence and approves the exact release scope. Controlled delivery applies rollout gates, observation, and a defined rollback path."],
  ["Measure and improve", "Validate production and business outcomes. Attribute quality, time, cost, and human effort to the composition; evaluate and qualify proposed changes before promotion."],
] as const;

export const enterpriseRouting = [
  ["Objective", "Which capabilities does the outcome require?", "Mission Control and the planner propose modernization, security, testing, delivery, and reliability work."],
  ["WorkOrder", "Which qualified factory can do this work?", "The Factory Router selects an eligible, immutable Factory Version and an approved Execution Profile."],
  ["Task", "Which qualified resources should perform this step?", "The Capability Router selects skills, model routes, harnesses, tools, and context within the WorkOrder’s authority."],
] as const;

export const enterpriseFactories = [
  ["Software Delivery", "Bounded features, defects, and refactoring", "Implementation Candidate with build and acceptance evidence."],
  ["Modernization", "Language, framework, runtime, and API migrations", "Migration Candidate with compatibility and regression evidence."],
  ["Security Remediation", "Vulnerabilities and insecure dependencies", "Remediation Candidate with dependency, scan, and regression evidence."],
  ["Test Engineering", "Coverage gaps, regression suites, and test reliability", "Test artifacts checked for relevant behavior, stability, and defect detection."],
  ["Verification", "Integrated behavior and objective acceptance", "Independent verdict on the integrated Candidate and its evidence."],
  ["Delivery", "Packaging, release preparation, and approved deployment", "Release artifacts and deployment records from controlled tooling."],
  ["Reliability", "Production health and post-release validation", "Observation results, SLO checks, and rollback recommendations."],
] as const;

export const enterpriseControls = [
  ["Identity and isolation", "Define tenant and business-unit boundaries, SSO and provisioning requirements, service identities, least privilege, sandbox isolation, and access to approved knowledge."],
  ["Policy and evidence", "Bind approvals to Plan and Candidate revisions. Set retention, residency, evidence export, exception ownership, and audit requirements before admitting sensitive work."],
  ["Capacity and recovery", "Budget at Objective, WorkOrder, and Attempt levels. Use queue fairness, concurrency quotas, cancellation, retry ceilings, durable recovery, and explicit blocked states."],
  ["Release and operations", "Name the release and incident owners. Define deployment topology, rollout gates, observation windows, rollback procedures, and suspension of unsafe factory versions."],
] as const;

export const enterpriseAdoption = [
  ["Scope", "Select one bounded workflow and representative repositories. Record today’s delivery time, defects, cost, and human effort; agree on acceptance and stop conditions."],
  ["Prove", "Run a constrained pilot with independent verification, artifact lineage, failure recovery, and human release authority. Compare outcomes with the baseline."],
  ["Expand", "Admit additional repositories, teams, and risk classes only after qualification. Reuse definitions and profiles; increase concurrency within measured capacity."],
  ["Operate", "Review service health, adoption, escaped defects, cost per accepted outcome, and review burden. Promote improvements through controlled evaluation and rollout."],
] as const;
