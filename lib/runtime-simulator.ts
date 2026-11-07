import type { GoverningStageId } from "../data/governing-lifecycle";

/** Deterministic teaching model. No agents, external calls or real authority.
 * Each step names the FDLC governing-lifecycle stage it belongs to (`stage`). */
export const artifactChain = [
  { id: "intent", stage: "intent", name: "Intent", producer: "Mission owner", meaning: "Fix GET /sum so 2 + 3 returns 5; preserve invalid-input behavior.", inputs: "A failing API test and an accountable owner.", authority: "Approve this sample objective only.", evidence: "INT-API-1: AC-1 sum=5; AC-2 invalid input=400; AC-3 unknown path=404.", failure: "An ambiguous outcome or missing acceptance criteria blocks planning.", next: "Decompose the objective without expanding scope.", guide: "/guide/02-design/06-intent-and-specification-engineering" },
  { id: "plan", stage: "planning", name: "Plan", producer: "Planner + owner", meaning: "Reproduce the failure, correct src/add.js, then independently verify the API.", inputs: "INT-API-1 and protected acceptance tests.", authority: "Approve Plan revision 1; no dispatch or release authority.", evidence: "PLAN-API-1/r1: one implementation task, one verification task, one correction allowed.", failure: "Changing the acceptance test to hide the failure invalidates the Plan.", next: "Materialize bounded work from the approved revision.", guide: "/guide/02-design/05-authoritative-records" },
  { id: "work-order", stage: "planning", name: "WorkOrder", producer: "Control plane", meaning: "WO-API-1 binds the approved Plan, acceptance contract and file scope.", inputs: "Approved PLAN-API-1/r1.", authority: "Write src/add.js only; tests and credentials are outside producer scope.", evidence: "WO-API-1 → TASK-FIX-1 + TASK-VERIFY-1; no network or publication grant.", failure: "Missing approval or an incompatible workload blocks admission.", next: "Select an eligible Factory Version.", guide: "/guide/03-build/13-control-plane-orchestrator-and-execution-plane" },
  { id: "selection", stage: "execution", name: "Factory selection", producer: "Router", meaning: "Select api-fix@1.0.0 after checking the workload and verification contract.", inputs: "WO-API-1, workload api-arithmetic, scope and qualification requirements.", authority: "Select only the sample eligible composition.", evidence: "Synthetic qualification Q-API-1: local fixture only. A documentation-only factory is rejected: wrong workload.", failure: "Availability or a cheaper model cannot override eligibility.", next: "Route implementation and verification to separate roles.", guide: "/guide/03-build/22-routing-and-the-escalation-ladder" },
  { id: "routing", stage: "execution", name: "Task routing", producer: "Scheduler", meaning: "TASK-FIX-1 goes to producer-1; TASK-VERIFY-1 goes to verifier-1.", inputs: "Selected Factory Version, dependencies and bounded execution profile.", authority: "One producer; one independent verification role; at most one correction.", evidence: "Profile scripted-local-v1: fixed context, protected tests, no model, no external tool access.", failure: "An unqualified fallback or shared producer/verifier identity blocks routing.", next: "Admit a producer Attempt against the frozen profile.", guide: "/guide/03-build/16-harness-engineering" },
  { id: "attempt", stage: "execution", name: "Agent execution", producer: "Scripted producer", meaning: "A scripted stand-in proposes the known correction. No live agent is running.", inputs: "TASK-FIX-1 and the frozen src/add.js write scope.", authority: "Produce an unpublished candidate; never approve it.", evidence: "Attributable producer Attempt, changed-file list and candidate identity.", failure: "An out-of-scope change stops the run; retry never expands authority.", next: "Freeze the output as a Candidate.", guide: "/guide/03-build/14-durable-execution" },
  { id: "candidate", stage: "evidence", name: "Artifact creation", producer: "Artifact store", meaning: "Freeze the patch and API response for exact-subject verification.", inputs: "Producer output and unchanged protected tests.", authority: "Retain an unpublished Candidate only.", evidence: "Frozen src/add.js patch and candidate identity, bound to the producer Attempt. A proposed correction can still be wrong.", failure: "Any later edit invalidates evidence for the older Candidate.", next: "Verify this exact Candidate against the acceptance contract.", guide: "/guide/04-prove/31-quality-contracts-proof-packages-and-certificates" },
  { id: "verification", stage: "verification", name: "Independent verification", producer: "Verifier role", meaning: "Evaluate AC-1, AC-2 and AC-3 separately from production.", inputs: "Exact Candidate and protected tests; no producer assertions as proof.", authority: "Record pass or fail; verification cannot authorize release.", evidence: "A separate verifier Attempt records criterion-level results for the Candidate.", failure: "Failed checks, self-verification, missing proof or stale identity block progression.", next: "Retain the verifier record, including failed results.", guide: "/guide/04-prove/27-quality-and-evidence-architecture" },
  { id: "evidence", stage: "verification", name: "Evidence inspection", producer: "Control plane", meaning: "Make the candidate, verifier, criteria and policy decision inspectable together.", inputs: "Current independent verification record.", authority: "Establish eligibility for the bounded decision only.", evidence: "Evidence ledger retains every failed and passing verifier Attempt.", failure: "Missing lineage or a changed Candidate requires re-verification.", next: "Evaluate authority independently of verification success.", guide: "/guide/04-prove/29-evaluation-engineering" },
  { id: "decision", stage: "approval", name: "Authorization decision", producer: "Policy / human owner", meaning: "Local completion may be allowed; a production request waits for a human decision.", inputs: "Current passing evidence and the action's authority policy.", authority: "No browser action publishes, merges or deploys anything.", evidence: "A recorded allow, pending-human or deny decision with its reason.", failure: "Passing tests never grants production authority; rejection ends the run safely.", next: "Record a controlled final disposition.", guide: "/guide/02-design/07-governance-policy-and-risk-proportional-approval" },
  { id: "outcome", stage: "outcomes", name: "Final outcome", producer: "Observation", meaning: "Record a verified sample outcome and the next engineering step.", inputs: "Satisfied contract and an explicit bounded decision.", authority: "Finish the demonstration; production remains outside this demo.", evidence: "Final disposition with preserved lineage and known limitations.", failure: "A sample success is not qualification for a real operating domain.", next: "Run the local Lab, test your own stack, then qualify a new Factory Version.", guide: "/guide/06-improve/40-governed-learning" },
] as const satisfies readonly ({ id: string; stage: GoverningStageId } & Record<string, string>)[];

export type ArtifactId = (typeof artifactChain)[number]["id"];
export const faults = [
  { id: "authority-exceeded", label: "Agent exceeds its authority", at: "attempt" },
  { id: "failed-verification", label: "API verification fails", at: "verification" },
  { id: "missing-evidence", label: "No evidence is produced", at: "verification" },
  { id: "self-verification", label: "Producer verifies its own work", at: "verification" },
  { id: "stale-evidence", label: "Evidence is bound to an older candidate", at: "verification" },
] as const satisfies readonly { id: string; label: string; at: ArtifactId }[];
export type FaultId = (typeof faults)[number]["id"];
export type Scenario = "happy" | "recovery" | "human";
export type Verification = { id: string; producerAttempt: string; verifierAttempt: string; candidate: string; verifier: string; result: "PASS" | "FAIL"; criteria: readonly [string, string][]; reason: string };
export type Block = { at: ArtifactId; fault: FaultId; reason: string; rule: string; fix: string; recoverable?: boolean };
export type SimRun = { completed: ArtifactId[]; active: FaultId[]; blocked: Block | null; candidate: string; attempt: number; evidence: Verification[]; approval: "not-required" | "pending" | "approved" | "denied"; humanRequired: boolean; log: string[] };

export function newRun(active: FaultId[] = [], humanRequired = false): SimRun {
  return { completed: [], active: [...active], blocked: null, candidate: "4b7a0d1", attempt: 1, evidence: [], approval: "not-required", humanRequired, log: ["Sample run created. No live execution or real authority."] };
}
export function scenarioRun(scenario: Scenario) { return newRun(scenario === "recovery" ? ["failed-verification"] : [], scenario === "human"); }
export function nextArtifact(run: SimRun): ArtifactId | null { return artifactChain.find((item) => !run.completed.includes(item.id))?.id ?? null; }

function blockFor(fault: FaultId): Block {
  switch (fault) {
    case "authority-exceeded": return { at: "attempt", fault, reason: "The Attempt changed .env outside the WorkOrder scope.", rule: "Execution never creates its own authority.", fix: "Discard that Candidate and start a new Attempt restricted to src/add.js." };
    case "failed-verification": return { at: "verification", fault, reason: "AC-1 failed: GET /sum?a=2&b=3 returned -1; expected 5.", rule: "Failed acceptance checks block progression, even if the producer says complete.", fix: "Create correction Attempt 2, change subtraction to addition, and re-verify the new Candidate." };
    case "missing-evidence": return { at: "verification", fault, reason: "No verifier evidence exists for the Candidate.", rule: "A worker report is not proof.", fix: "Run the independent verifier against the current Candidate." };
    case "self-verification": return { at: "verification", fault, reason: "producer-1 signed its own verification.", rule: "A producer cannot be its own verifier.", fix: "Use verifier-1 in a separate verification Attempt." };
    case "stale-evidence": return { at: "verification", fault, reason: "Evidence is bound to 9f3c1e2, but the Candidate is 4b7a0d1.", rule: "Evidence must bind to the exact subject being accepted.", fix: "Re-verify the current Candidate; preserve the rejected record." };
  }
}
function verification(run: SimRun, fault?: FaultId): Verification {
  return { id: `EV-${run.evidence.length + 1}`, producerAttempt: `ATT-P-${run.attempt}`, verifierAttempt: `ATT-V-${run.evidence.length + 1}`, candidate: fault === "stale-evidence" ? "9f3c1e2" : run.candidate, verifier: fault === "self-verification" ? "producer-1" : "verifier-1", result: fault ? "FAIL" : "PASS", criteria: [["AC-1 / sum = 5", fault === "failed-verification" ? "FAIL: observed -1" : "PASS"], ["AC-2 / invalid input = 400", "PASS"], ["AC-3 / unknown path = 404", "PASS"]], reason: fault ? blockFor(fault).reason : "All sample criteria passed; exact Candidate and independent identity checked." };
}
export function stepRun(run: SimRun): SimRun {
  if (run.blocked || run.approval === "pending" || run.approval === "denied") return run;
  const next = nextArtifact(run);
  if (!next) return run;
  const fault = faults.find((item) => item.at === next && run.active.includes(item.id));
  if (fault) {
    const exhausted = run.attempt >= 2 && (fault.id === "failed-verification" || fault.id === "authority-exceeded");
    const blocked = { ...blockFor(fault.id), recoverable: !exhausted };
    if (exhausted) blocked.fix = "The one-correction budget is exhausted. Stop and request a new approved WorkOrder; this run cannot expand its authority.";
    const evidence = next === "verification" && fault.id !== "missing-evidence" ? [...run.evidence, verification(run, fault.id)] : run.evidence;
    return { ...run, blocked, evidence, log: [...run.log, `Blocked at ${next}: ${blocked.reason}`] };
  }
  if (next === "decision" && run.humanRequired && run.approval !== "approved") return { ...run, approval: "pending", log: [...run.log, "PENDING HUMAN: production is outside local completion authority. Passing evidence cannot grant release permission."] };
  const evidence = next === "verification" ? [...run.evidence, verification(run)] : run.evidence;
  return { ...run, evidence, completed: [...run.completed, next], log: [...run.log, `${artifactChain.find((item) => item.id === next)!.name} recorded${next === "decision" ? ": local completion only; no publication or deployment" : ""}.`] };
}
export function runToEnd(run: SimRun): SimRun {
  let current = run;
  for (let guard = 0; guard < artifactChain.length + 1; guard += 1) { const stepped = stepRun(current); if (stepped === current) break; current = stepped; }
  return current;
}
export function applyFix(run: SimRun, fault: FaultId): SimRun {
  if (run.blocked?.fault !== fault || run.blocked.recoverable === false) return run;
  const correction = fault === "failed-verification" || fault === "authority-exceeded";
  const boundary = artifactChain.findIndex((item) => item.id === (correction ? "attempt" : "verification"));
  return { ...run, active: run.active.filter((item) => item !== fault), blocked: null, completed: run.completed.filter((id) => artifactChain.findIndex((item) => item.id === id) < boundary), attempt: run.attempt + (correction ? 1 : 0), candidate: correction ? "7c2e5a9" : run.candidate, log: [...run.log, `Correction recorded: ${run.blocked.fix} Previous evidence retained; no stage auto-approved.`] };
}
export function decideRun(run: SimRun, approved: boolean): SimRun {
  if (run.approval !== "pending") return run;
  return { ...run, approval: approved ? "approved" : "denied", log: [...run.log, approved ? "Sample human approved review handoff. This grants no real production authority." : "Sample human rejected the request. Candidate and evidence retained; no release."] };
}
export function toggleFault(run: SimRun, fault: FaultId): SimRun {
  if (run.completed.length > 0 || run.blocked) return run;
  return { ...run, active: run.active.includes(fault) ? run.active.filter((item) => item !== fault) : [...run.active, fault] };
}
export type RunStatus = "not-started" | "in-progress" | "blocked" | "awaiting-approval" | "denied" | "complete";
export function runStatus(run: SimRun): RunStatus {
  if (run.blocked) return "blocked";
  if (run.approval === "pending") return "awaiting-approval";
  if (run.approval === "denied") return "denied";
  if (run.completed.length === artifactChain.length) return "complete";
  return run.completed.length === 0 ? "not-started" : "in-progress";
}
