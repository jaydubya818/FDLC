export const missionControlCapabilities = [
  { name: "Governed Missions, Plans, and WorkOrders", status: "Available", summary: "Versioned Plans can be reviewed and approved before releasing bounded WorkOrders.", limitation: "Qualified for the documented one-repository V1 golden path." },
  { name: "Attempts, leases, and recovery", status: "Available", summary: "Execution is admitted against frozen configuration, fenced by a lease, and retained as immutable Attempt lineage.", limitation: "Fleet-scale provider-failure operation is not claimed." },
  { name: "Independent verification and Quality Gates", status: "Available", summary: "Exact candidates are checked by logically separate verifier Attempts and bound to evidence receipts.", limitation: "Verification establishes eligibility; it does not accept, merge, or release." },
  { name: "GitHub App publication and currentness", status: "Available", summary: "Publication can be permit-gated and reconciled to the exact pull-request head and evidence lineage.", limitation: "Merge remains human-owned." },
  { name: "Factory Memory and Context Packages", status: "Available", summary: "Provenance-backed context can be frozen to an exact Attempt and inspected.", limitation: "Advisory and phase-gated; cannot satisfy acceptance." },
  { name: "Observability, traces, and evals", status: "Available", summary: "Runs can produce traces, scores, datasets, and experiments for diagnostic comparison.", limitation: "Diagnostic only; no acceptance authority." },
  { name: "Spec-driven Mission intake", status: "Experimental", summary: "Immutable Mission Spec revisions and deterministic spec-quality checks are implemented.", limitation: "Default off; finalized means planning-ready, not approved." },
  { name: "Model and backend routing", status: "Experimental", summary: "Policy-aware routing records capability selection against qualification and execution constraints.", limitation: "Advisory and gated; complete outcome economics and broader live fallback qualification remain incomplete." },
  { name: "Governed inference accounting", status: "Experimental", summary: "Aggregate reservations, bounded dispatch allowance, immutable observations, settlement correction, and durable recovery are qualified offline.", limitation: "Default off. Live provider billing, comparison of two exact routes, and real accepted-workload economics remain unqualified." },
  { name: "Remote Sandbox", status: "Experimental", summary: "A bounded live cohort is qualified for production-pilot evaluation.", limitation: "Preview only; provider-enforced egress and sustained real-work evidence remain open." },
  { name: "Factory Learning", status: "Experimental", summary: "Evidence can produce bounded learning signals and human-reviewed proposals.", limitation: "No automatic promotion; real production signals are limited." },
  { name: "Governed MCP runtime", status: "Experimental", summary: "One exact Context7 query-docs read was qualified through versioned authority, brokered execution, durable receipts, and independent verification.", limitation: "One fixed public React query only; writes, arbitrary servers and operations, broad credentials, and harness-native MCP remain unsupported." },
  { name: "Canonical Factory admission", status: "Experimental", summary: "One deterministic synthetic path qualified exact Factory Versions, derived WorkOrder readiness, producer and verifier Attempts, an unpublished candidate, and current verification evidence.", limitation: "No external model calls, publication, acceptance, or Production mutation occurred; live autonomous delivery remains unqualified." },
  { name: "Factory incident pause and restoration", status: "Available", summary: "Incident Command qualified pause and separately authorized restoration of dispatch admission for the Mission Control repository, with independently observed effects.", limitation: "One exact repository operation using a synthetic qualification incident; other controls, arbitrary repositories, customer incidents, and autonomous emergency authority remain unqualified." },
  { name: "Release and production feedback", status: "Experimental", summary: "Release records and advisory learning provide foundations for connecting delivery to observed outcomes.", limitation: "A complete real release, observation, rollback, and governed improvement loop remains unproven." },
  { name: "Broader containment controls", status: "Planned", summary: "Extend qualified containment to additional capability versions, control actions, and targets as workload needs justify them.", limitation: "Each control and target requires separate qualification and authority; the existing pause operation grants no broader permission." },
] as const;

export const missionControlObjects = [
  ["Factory Version", "An immutable, qualified composition of Factory capabilities used to govern a class of execution. Qualification alone does not activate it."],
  ["Execution Profile", "The governed composition binding runtime, harness, model and tool capabilities, backend, environment, and policy for an Attempt."],
  ["WorkOrder", "The canonical governed unit of approved work, bound to an exact revision and Factory Version."],
  ["Readiness", "A derived determination that required identities, qualifications, authorities, resources, and policies are satisfied. It is never a manually asserted READY flag."],
  ["Task", "A bounded executable portion of an admitted WorkOrder; completion does not accept the WorkOrder."],
  ["Attempt", "One authoritative execution of a Task with durable identity, authority, runtime, evidence, and outcome lineage."],
  ["Unpublished Candidate", "An exact producer output that has not received independent verification or publication authority."],
  ["Verification Subject", "The frozen identity and verification contract describing exactly what a verifier evaluates."],
  ["Verifier Attempt", "A separate canonical Attempt that independently evaluates a Verification Subject."],
  ["Evidence", "Durable, attributable records of what was authorized, executed, observed, verified, or decided."],
  ["Human Authority", "Explicit authority retained for consequential decisions such as acceptance, publication, release, restoration, or policy promotion."],
] as const;

export const missionControlTimeline = ["Intent", "Plan", "Factory Version", "WorkOrder", "Task", "Producer Attempt", "Unpublished Candidate", "Verification Subject", "Verifier Attempt", "Human decision", "Release + outcome"] as const;
