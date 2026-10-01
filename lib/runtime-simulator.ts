/**
 * Illustrative runtime simulator.
 *
 * Steps one unit of work through the FDLC artifact chain and lets a learner
 * inject faults. It models the protocol's rules (execution never creates its
 * own authority; evidence must be independent and bound to the exact
 * candidate; a producer is not its own verifier). It is NOT Mission Control's
 * runtime and makes no claim about operating results.
 */
export const artifactChain = [
  { id: "intent", name: "Intent", producer: "Human", meaning: "The outcome and acceptance contract a person approves." },
  { id: "plan", name: "Plan", producer: "Human + planner", meaning: "A reviewable revision that bounds scope, authority and checks." },
  { id: "work-order", name: "Work Order", producer: "Control plane", meaning: "Bounded work released from the approved plan." },
  { id: "attempt", name: "Attempt", producer: "Agent", meaning: "One attributable execution that produces a candidate change." },
  { id: "evidence", name: "Evidence", producer: "Independent verifier", meaning: "Proof about the exact candidate, produced by someone other than its author." },
  { id: "decision", name: "Decision", producer: "Human", meaning: "A recorded acceptance based on current evidence." },
  { id: "release", name: "Release", producer: "Control plane", meaning: "The accepted candidate becomes a reviewable pull request." },
  { id: "outcome", name: "Outcome", producer: "Observation", meaning: "What actually happened, fed back as a learning signal." },
] as const;

export type ArtifactId = (typeof artifactChain)[number]["id"];

export const faults = [
  { id: "authority-exceeded", label: "Agent exceeds its authority", at: "attempt" },
  { id: "missing-evidence", label: "No evidence is produced", at: "evidence" },
  { id: "self-verification", label: "Producer verifies its own work", at: "evidence" },
  { id: "stale-evidence", label: "Evidence is bound to an older candidate", at: "evidence" },
] as const satisfies readonly { id: string; label: string; at: ArtifactId }[];

export type FaultId = (typeof faults)[number]["id"];

export type Block = { at: ArtifactId; fault: FaultId; reason: string; rule: string; fix: string };

export type SimRun = {
  completed: ArtifactId[];
  active: FaultId[];
  blocked: Block | null;
  candidate: string;
  log: string[];
};

const CANDIDATE = "4b7a0d1";
const STALE_CANDIDATE = "9f3c1e2";

export function newRun(active: FaultId[] = []): SimRun {
  return { completed: [], active: [...active], blocked: null, candidate: CANDIDATE, log: ["Run created. Nothing has been produced yet."] };
}

export function nextArtifact(run: SimRun): ArtifactId | null {
  return artifactChain.find((item) => !run.completed.includes(item.id))?.id ?? null;
}

function blockFor(fault: FaultId): Block {
  switch (fault) {
    case "authority-exceeded":
      return { at: "attempt", fault, reason: "The Attempt changed files outside the Work Order's declared scope.", rule: "Execution never creates its own authority.", fix: "Restrict the Attempt to its scope, or send a new plan for approval." };
    case "missing-evidence":
      return { at: "evidence", fault, reason: "No evidence artifact exists for the candidate.", rule: "A worker report or a completed status is not proof.", fix: "Run the independent verifier against the candidate." };
    case "self-verification":
      return { at: "evidence", fault, reason: "The evidence was produced by the same identity that produced the change.", rule: "A producer cannot be its own verifier.", fix: "Run verification under a separate identity." };
    case "stale-evidence":
      return { at: "evidence", fault, reason: `The evidence is bound to ${STALE_CANDIDATE}, but the candidate is now ${CANDIDATE}.`, rule: "Evidence must bind to the exact subject being accepted.", fix: "Re-verify the current candidate." };
  }
}

/** Attempt to produce the next artifact. A blocked run stays blocked and never reports success. */
export function stepRun(run: SimRun): SimRun {
  if (run.blocked) return run;
  const next = nextArtifact(run);
  if (!next) return run;
  const fault = faults.find((item) => item.at === next && run.active.includes(item.id));
  const name = artifactChain.find((item) => item.id === next)!.name;
  if (fault) {
    const blocked = blockFor(fault.id);
    return { ...run, blocked, log: [...run.log, `Blocked at ${name}: ${blocked.reason}`] };
  }
  const completed = [...run.completed, next];
  const note = next === "decision" ? "Decision recorded by a person, based on current evidence." : `${name} produced.`;
  return { ...run, completed, log: [...run.log, note] };
}

export function runToEnd(run: SimRun): SimRun {
  let current = run;
  for (let guard = 0; guard < artifactChain.length + 1; guard += 1) {
    const stepped = stepRun(current);
    if (stepped === current) break;
    current = stepped;
  }
  return current;
}

/** Remove a fault (the learner applied the fix) and clear a block it caused. */
export function applyFix(run: SimRun, fault: FaultId): SimRun {
  const active = run.active.filter((item) => item !== fault);
  const cleared = run.blocked?.fault === fault;
  return { ...run, active, blocked: cleared ? null : run.blocked, log: cleared ? [...run.log, `Fix applied: ${run.blocked!.fix}`] : run.log };
}

export function toggleFault(run: SimRun, fault: FaultId): SimRun {
  if (run.completed.length > 0 || run.blocked) return run;
  const active = run.active.includes(fault) ? run.active.filter((item) => item !== fault) : [...run.active, fault];
  return { ...run, active };
}

export type RunStatus = "not-started" | "in-progress" | "blocked" | "complete";

export function runStatus(run: SimRun): RunStatus {
  if (run.blocked) return "blocked";
  if (run.completed.length === artifactChain.length) return "complete";
  return run.completed.length === 0 ? "not-started" : "in-progress";
}
