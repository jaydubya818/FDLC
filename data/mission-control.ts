export const missionControlMaturityLedgerUrl =
  "https://github.com/jaydubya818/MissionControl/blob/main/docs/product/software-factory-capability-maturity.md";

export const missionControlCapabilities = [
  { name: "Governed intent, Plans, and WorkOrders", status: "Qualified", summary: "Versioned Plans can be reviewed and approved before releasing bounded WorkOrders.", limitation: "One-repository V1 golden path; consequential actions remain separately gated." },
  { name: "Agent definitions and Factory binding", status: "Qualified", summary: "Agent definitions and factory configuration are bound into the governed delivery path.", limitation: "Builder-facing configuration is primarily developer and operator oriented." },
  { name: "Skills, context, and Factory Memory", status: "Qualified; advisory", summary: "Provenance-backed context can be frozen to an exact Attempt and inspected.", limitation: "Retrieval is deliberately non-authoritative and phase-gated." },
  { name: "Durable execution and recovery", status: "Qualified", summary: "Execution is admitted against frozen configuration, fenced by a lease, and retained as immutable Attempt lineage.", limitation: "Fleet-scale restart and provider-failure operation are not claimed." },
  { name: "Independent verification and Quality Gates", status: "Qualified", summary: "Exact candidates are checked by logically separate verifier Attempts and bound to evidence receipts.", limitation: "V1 verifier profiles and repository scope; verification establishes eligibility, not acceptance or release." },
  { name: "Observability, traces, and evals", status: "Qualified diagnostic system", summary: "Runs can produce traces, scores, datasets, and experiments for diagnostic comparison.", limitation: "Diagnostic only; no acceptance authority." },
  { name: "Factory Learning", status: "Qualified; advisory", summary: "Evidence can produce bounded learning signals and human-reviewed proposals.", limitation: "Fixture and qualification signals dominate; promotion is intentionally manual." },
  { name: "Model/harness/backend routing", status: "Implemented, gated", summary: "Policy-aware routing and recorded routing decisions exist behind gates.", limitation: "Advisory by default; the remote tuple has limited samples and incomplete costs." },
  { name: "Remote Sandbox", status: "Production-pilot eligible; Preview", summary: "A bounded live cohort is qualified for production-pilot evaluation.", limitation: "Unrestricted outbound egress, ephemeral Codex installation, and limited live samples remain." },
  { name: "Native tool authorization", status: "Partial", summary: "Native allowlists constrain selected harness operations.", limitation: "There is no canonical versioned tool authority with exact operation scope and receipts." },
  { name: "Tools/MCP runtime", status: "Missing", summary: "The architecture reserves a default-deny MCP authority boundary.", limitation: "MCP is unsupported for the currently admitted Codex and DeepSeek manifests." },
  { name: "Release and production feedback", status: "Partial", summary: "Pull-request publication can be permit-gated and reconciled to exact head and evidence lineage.", limitation: "Human merge remains outside V1 authority; full production observation and rollback proof are not established." },
  { name: "Factory incident response", status: "Missing canonical lifecycle", summary: "Alerts, operational events, traces, and run failures provide useful raw signals.", limitation: "They are not yet unified into an end-to-end incident lifecycle." },
] as const;

export type MissionControlCapabilityStatus = (typeof missionControlCapabilities)[number]["status"];

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

export const missionControlTimeline = ["Mission", "Specification", "Approved Plan", "WorkOrders", "Tasks + Attempts", "Candidate", "Evidence", "Independent verification", "Quality Gate", "Human acceptance", "Pull request publication"] as const;
