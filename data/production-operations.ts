export const productionOperatingContracts = [
  {
    number: "01",
    title: "Contain and preserve",
    question: "What is the smallest control that stops the harm without destroying the facts?",
    decision: "Scope containment to the affected Attempt, capability version, route, workflow class, publication path, or environment. Preserve state, effects, evidence, decisions, and configuration before repair when safety permits.",
    invariant: "A control acknowledgement is not enforcement; the observed stop is recorded separately.",
  },
  {
    number: "02",
    title: "Reconcile before repeating",
    question: "What actually happened at every external boundary?",
    decision: "Classify each effect as absent, completed, failed, or unknown. Retry only with current authority and an idempotency or reconciliation contract; model multi-system work as a saga with explicit compensation.",
    invariant: "Unknown outcomes never become implicit failures, successes, or permission to retry.",
  },
  {
    number: "03",
    title: "Operate a declared degraded mode",
    question: "Which work may continue when assurance or capacity is reduced?",
    decision: "Predefine fail-closed, queue, read-only, qualified-fallback, and shutdown behavior for identity, policy, context, model, tool, evidence, telemetry, capacity, and control-state failures.",
    invariant: "Availability cannot weaken the workload's authority, data, quality, or evidence requirements silently.",
  },
  {
    number: "04",
    title: "Restore an exact known-good state",
    question: "Which artifact and configuration remain compatible, qualified, and authorized now?",
    decision: "Bind recovery to immutable source and artifact identity, runtime configuration, policy, schema, dependencies, qualification scope, restoration authority, and an observation plan.",
    invariant: "Previous is not synonymous with known-good; rollback, compensation, and reconciliation remain separate operations.",
  },
  {
    number: "05",
    title: "Close with independent proof",
    question: "What proves the impact stopped and the required outcome is healthy again?",
    decision: "Reconcile downstream effects, verify recovery independently, review stale queued work, preserve the forensic bundle, record residual risk, and route corrective changes through governed improvement.",
    invariant: "Restored service is a milestone. Verified recovery and dispositioned unknowns permit closure.",
  },
] as const;

export const missionControlIncidentRequirements = [
  {
    title: "Impact graph and blast-radius query",
    description: "Traverse Factory Versions, Execution Profiles, capabilities, WorkOrders, Attempts, effects, evidence, approvals, releases, environments, and outcomes with currentness and explicit unknown states.",
  },
  {
    title: "Incident command and decision timeline",
    description: "Bind severity, owners, hypotheses, decisions, commands, acknowledgements, observed enforcement, communications, handoffs, and evidence to one durable incident identity.",
  },
  {
    title: "Scoped containment and degraded modes",
    description: "Extend the qualified pause path one subject and control at a time. Reserve capacity for cancellation and reconciliation, require step-up authority, and keep restoration separately authorized.",
  },
  {
    title: "Saga recovery and effect reconciliation",
    description: "Show partial dependency-graph state, operation receipts, unknown effects, orphaned work, compensation choices, and the exact safe boundary for a replacement Attempt.",
  },
  {
    title: "Known-good restoration and verified closure",
    description: "Bind recovery candidates to exact artifacts and configuration, then require independent recovery evidence, residual risk, backlog disposition, and governed corrective actions before closure.",
  },
] as const;
