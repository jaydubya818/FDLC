export const enterpriseGuideHref = "/guide/appendix/enterprise-multi-factory-delivery";

export const enterpriseStages = [
  ["Intent", "Describe the outcome, scope, constraints, and acceptance criteria from any approved entry point. Repository and organizational context ground the request; intent alone grants no authority."],
  ["Plan", "Mission Control classifies the objective and materializes a durable Plan of WorkOrders, dependencies, verification contracts, budgets, stop conditions, and decision points."],
  ["Route", "Filter for policy, authorization, compatibility, and qualification first. Select and pin the eligible Factory Version and Execution Profile for each WorkOrder."],
  ["Execute", "A factory supervisor composes bounded Tasks from reusable agents, harnesses, tools, model routes, context, and execution infrastructure. Attempts produce attributable Candidates."],
  ["Verify", "Independent verification checks each WorkOrder locally and checks the integrated Candidate globally against the Objective and current upstream artifacts."],
  ["Release", "The accountable authority reviews evidence and approves the exact artifact, environment, rollout scope, and rollback conditions before controlled delivery acts."],
  ["Learn", "Observe production and business outcomes. Attribute quality, time, cost, and human effort to the composition; qualify improvements as new versions instead of silently changing production."],
] as const;

export const enterpriseScale = [
  ["Builder scale", "Scheduling, quotas, tenant fairness, concurrency, and backpressure"],
  ["Repository scale", "Repository intelligence, ownership, policy, language, toolchain, and Execution Profiles"],
  ["Workload scale", "Durable WorkOrders, Tasks, Attempts, queues, sandbox capacity, and horizontal execution"],
] as const;

export const enterprisePlatformServices = [
  ["Mission Control", "Objective, Plan, WorkOrder, dependency, routing, evidence, authority, and outcome coordination"],
  ["Identity and access", "SSO/OIDC, provisioning, RBAC/ABAC, workload identity, delegated authority, and short-lived credentials"],
  ["Capability registry", "Versioned agents, harnesses, tools, skills, model routes, context providers, verifiers, and execution backends"],
  ["Model gateway", "Provider-independent logical routes, policy, quotas, fallbacks, regional constraints, quality, latency, and cost"],
  ["Context intelligence", "Authorized code and knowledge retrieval with ACL filtering, provenance, reranking, compaction, and token budgets"],
  ["Execution control", "Queues, schedulers, isolated sandboxes, resource and network limits, ephemeral credentials, and artifact capture"],
  ["Observability and cost", "Objective-level traces across WorkOrders, Attempts, inference, tools, verification, human effort, and accepted outcomes"],
  ["Policy and compliance", "External enforcement of model, tool, data, network, autonomy, residency, risk, DLP, and release controls"],
  ["Evidence and audit", "Artifact lineage, hashes, tests, scans, policy results, verifier decisions, approvals, and immutable audit events"],
] as const;

export const enterpriseReusableCapabilities = [
  ["Agents", "Reusable reasoning roles for planning, coding, testing, research, security analysis, review, and verification"],
  ["Harnesses", "Controlled context, tools, state, retries, budgets, recovery, and stopping conditions around Tasks and agents"],
  ["Tools and skills", "Governed Git, issue tracking, CI/CD, scanners, build systems, APIs, MCP services, and domain knowledge"],
  ["Models and inference", "Qualified logical routes across commercial, open, and specialized models without making a provider the factory identity"],
  ["Execution Profiles", "Versioned runtime, toolchain, sandbox, network, resource, context, autonomy, and verification settings"],
] as const;

export const enterpriseRouting = [
  ["Objective", "Which capabilities does the outcome require?", "Mission Control and the planner propose modernization, security, testing, delivery, and reliability work."],
  ["WorkOrder", "Which qualified factory can do this work?", "The Factory Router selects an eligible, immutable Factory Version and an approved Execution Profile."],
  ["Task", "Which qualified resources should perform this step?", "The Capability Router selects skills, model routes, harnesses, tools, and context within the WorkOrder’s authority."],
] as const;

export const enterpriseFactories = [
  ["Software Delivery / broad default", "Features, defects, refactoring, tests, dependency updates, routine security fixes, release preparation, and approved deployments", "One outcome contract can contain many workflows and reusable capability routes."],
  ["Modernization / when justified", "Migration waves, framework and language changes, platform upgrades, compatibility analysis, and repository transformation", "Separate only when ownership, lifecycle, qualification, or exception handling materially differs from normal delivery."],
  ["Security Remediation / when justified", "Enterprise vulnerability discovery, remediation, exception tracking, verification, reporting, and continuous risk reduction", "Separate when risk, evidence, compliance, sandbox, or authority requirements form a distinct operating contract."],
  ["Additional factories / evidence led", "Reliability, test engineering, delivery, data migration, accessibility, compliance, or domain-specific outcomes", "Create one only when outcome semantics, ownership, qualification, governance, authority, or lifecycle are materially different."],
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
