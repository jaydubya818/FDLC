export const missionControlCapabilities = [
  { name: "Governed Missions, Plans, and WorkOrders", status: "Available", summary: "Versioned Plans can be reviewed and approved before releasing bounded WorkOrders.", limitation: "Qualified for the documented one-repository V1 golden path." },
  { name: "Attempts, leases, and recovery", status: "Available", summary: "Execution is admitted against frozen configuration, fenced by a lease, and retained as immutable Attempt lineage.", limitation: "Fleet-scale provider-failure operation is not claimed." },
  { name: "Independent verification and Quality Gates", status: "Available", summary: "Exact candidates are checked by logically separate verifier Attempts and bound to evidence receipts.", limitation: "Verification establishes eligibility; it does not accept, merge, or release." },
  { name: "GitHub App publication and currentness", status: "Available", summary: "Publication can be permit-gated and reconciled to the exact pull-request head and evidence lineage.", limitation: "Merge remains human-owned." },
  { name: "Factory Memory and Context Packages", status: "Available", summary: "Provenance-backed context can be frozen to an exact Attempt and inspected.", limitation: "Advisory and phase-gated; cannot satisfy acceptance." },
  { name: "Observability, traces, and evals", status: "Available", summary: "Runs can produce traces, scores, datasets, and experiments for diagnostic comparison.", limitation: "Diagnostic only; no acceptance authority." },
  { name: "Spec-driven Mission intake", status: "Experimental", summary: "Immutable Mission Spec revisions and deterministic spec-quality checks are implemented.", limitation: "Default off; finalized means planning-ready, not approved." },
  { name: "Model and backend routing", status: "Experimental", summary: "WorkOrder inference reservations are conserved across requests, and canonical call intents and receipts preserve durable lineage.", limitation: "Inference is default off. Live provider qualification, billing settlement and complete outcome economics remain incomplete." },
  { name: "Remote Sandbox", status: "Experimental", summary: "A bounded live cohort is qualified for production-pilot evaluation.", limitation: "Preview only; provider-enforced egress and sustained real-work evidence remain open." },
  { name: "Factory Learning", status: "Experimental", summary: "Evidence can produce bounded learning signals and human-reviewed proposals.", limitation: "No automatic promotion; real production signals are limited." },
  { name: "Governed MCP runtime", status: "Experimental", summary: "One exact Context7 query-docs read was qualified through versioned authority, brokered execution, durable receipts, and independent verification.", limitation: "One fixed public React query only; writes, arbitrary servers and operations, broad credentials, and harness-native MCP remain unsupported." },
  { name: "Factory incident lifecycle", status: "Planned", summary: "A canonical incident aggregate can unify existing alerts, events, evidence, and recovery.", limitation: "The end-to-end lifecycle is not implemented." },
] as const;

export const missionControlObjects = [
  ["Mission", "The governed outcome and scope. This is Mission Control’s concrete realization of FDLC Intent."],
  ["Mission Spec", "An immutable, attributable statement of requirements, non-goals, and acceptance expectations."],
  ["Plan", "A versioned artifact bound to exact Specification lineage and approved before WorkOrder release."],
  ["WorkOrder", "The governed delivery and acceptance contract for one bounded unit."],
  ["Task", "An operational unit inside a WorkOrder; never the acceptance authority."],
  ["Attempt", "One immutable execution or verification try against frozen inputs and a fenced lease."],
  ["Evidence Envelope", "Attributable proof bound to the exact candidate, criterion, Attempt, and policy."],
  ["Quality Gate Decision", "A fail-closed eligibility decision assembled from current verification evidence."],
] as const;

export const missionControlTimeline = ["Mission", "Specification", "Approved Plan", "WorkOrders", "Tasks + Attempts", "Candidate", "Evidence", "Independent verification", "Human acceptance", "Release + outcome"] as const;
