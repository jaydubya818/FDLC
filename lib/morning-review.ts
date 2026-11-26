/** A deterministic teaching model. Every identity, receipt and cost is synthetic. */
export type ReviewCaseId = "verified" | "failed" | "unknown" | "stale" | "budget" | "empty";
export type ReviewPhase = "awaiting-decision" | "verification-failed" | "awaiting-verification" | "unknown-effect" | "retry-ready" | "authorized" | "awaiting-observation" | "observed" | "stale-evidence" | "budget-exhausted" | "stopped" | "declined" | "idle";
export type ReviewActionId = "approve" | "decline" | "correct" | "verify" | "reconcile" | "retry" | "apply" | "observe" | "stop" | "scan";
export type ReviewActor = "sample-owner" | "sample-producer" | "sample-verifier" | "sample-control-plane";
export type ReviewBinding = { workOrderId: string | null; factoryVersion: string; candidateId: string | null };
export type ReviewReceipt = {
  id: string;
  kind: "execution" | "verification" | "decision" | "effect" | "observation" | "stop" | "scan";
  summary: string;
  actor: ReviewActor;
  subject: ReviewBinding;
  result: string;
  facts: Record<string, string | number | boolean>;
};
export type ReviewVerification = { receiptId: string; subject: ReviewBinding; actor: ReviewActor; result: "PASS" | "FAIL" };
export type ReviewDecision = { receiptId: string; evidenceReceiptId: string | null; subject: ReviewBinding; actor: ReviewActor; action: "publish-review-copy"; result: "APPROVED" | "DECLINED" };
export type ReviewItem = ReviewBinding & {
  id: ReviewCaseId;
  title: string;
  objective: string;
  trigger: string;
  phase: ReviewPhase;
  execution: "complete" | "incomplete" | "none";
  verifications: ReviewVerification[];
  decisions: ReviewDecision[];
  effect: "none" | "unknown" | "absent" | "submitted" | "observed";
  effectSubject: ReviewBinding | null;
  effectAttempts: number;
  correctionsUsed: number;
  correctionLimit: number;
  spendCents: number;
  limitCents: number;
  receipts: ReviewReceipt[];
};
export type MorningReviewState = { selected: ReviewCaseId; items: Record<ReviewCaseId, ReviewItem>; announcement: string };
export type MorningReviewEvent =
  | { type: "select"; id: ReviewCaseId }
  | { type: "reset" }
  | { type: "act"; id: ReviewCaseId; action: ReviewActionId; actor: ReviewActor; subject: ReviewBinding; reconciliation?: "found" | "absent" };

export const reviewCaseIds: readonly ReviewCaseId[] = ["verified", "failed", "unknown", "stale", "budget", "empty"];
export const reviewPhaseLabels: Record<ReviewPhase, string> = {
  "awaiting-decision": "Decision needed",
  "verification-failed": "Verification failed",
  "awaiting-verification": "Ready to verify",
  "unknown-effect": "Outcome unknown",
  "retry-ready": "Ready for one retry",
  authorized: "Action authorized",
  "awaiting-observation": "Awaiting observation",
  observed: "Outcome observed",
  "stale-evidence": "Evidence is stale",
  "budget-exhausted": "Budget exhausted",
  stopped: "Stopped within limits",
  declined: "Candidate declined",
  idle: "No eligible work",
};

export function reviewBinding(item: ReviewBinding): ReviewBinding {
  return { workOrderId: item.workOrderId, factoryVersion: item.factoryVersion, candidateId: item.candidateId };
}

export function sameReviewBinding(left: ReviewBinding, right: ReviewBinding): boolean {
  return left.workOrderId === right.workOrderId && left.factoryVersion === right.factoryVersion && left.candidateId === right.candidateId;
}

function currentVerification(item: ReviewItem) {
  return [...item.verifications].reverse().find((record) => sameReviewBinding(record.subject, item));
}

export function hasCurrentVerification(item: ReviewItem): boolean {
  const record = currentVerification(item);
  return Boolean(item.candidateId && record?.actor === "sample-verifier" && record.result === "PASS");
}

export function hasCurrentAuthorization(item: ReviewItem): boolean {
  const record = [...item.decisions].reverse().find((decision) => sameReviewBinding(decision.subject, item));
  return Boolean(item.candidateId && hasCurrentVerification(item) && record?.actor === "sample-owner" && record.action === "publish-review-copy" && record.result === "APPROVED" && record.evidenceReceiptId === currentVerification(item)?.receiptId);
}

export function reviewVerificationLabel(item: ReviewItem): string {
  const record = currentVerification(item);
  if (record?.result === "FAIL") return "Failed";
  if (hasCurrentVerification(item)) return "Current · passed";
  return item.verifications.length ? "Needs fresh evidence" : "Not run";
}

export function reviewAuthorizationLabel(item: ReviewItem): string {
  if (hasCurrentAuthorization(item)) return "Current · approved";
  const record = [...item.decisions].reverse().find((decision) => sameReviewBinding(decision.subject, item));
  if (record?.result === "DECLINED") return "Declined";
  return item.decisions.length ? "Needs a fresh decision" : "Not granted";
}

function addReceipt(item: ReviewItem, kind: ReviewReceipt["kind"], actor: ReviewActor, result: string, summary: string, facts: ReviewReceipt["facts"], subject = reviewBinding(item)): ReviewItem {
  const id = `REC-${item.id.toUpperCase()}-${String(item.receipts.length + 1).padStart(2, "0")}`;
  return { ...item, receipts: [...item.receipts, { id, kind, actor, subject, result, summary, facts }] };
}

function addVerification(item: ReviewItem, result: "PASS" | "FAIL", subject = reviewBinding(item)): ReviewItem {
  const summary = result === "PASS" ? "The independent verifier recorded all three checks as passing for this exact candidate and Factory Version." : "The link check failed. The producer finished its attempt, but the candidate did not meet the acceptance contract.";
  const updated = addReceipt(item, "verification", "sample-verifier", result, summary, {
    "AC-1 · API example matches source": "PASS",
    "AC-2 · documentation links resolve": result === "PASS" ? "PASS" : "FAIL: /reference/old-route does not resolve",
    "AC-3 · only permitted documentation changed": "PASS",
    independentOfProducer: true,
  }, subject);
  return { ...updated, verifications: [...item.verifications, { receiptId: updated.receipts.at(-1)!.id, subject, actor: "sample-verifier", result }] };
}

function addDecision(item: ReviewItem, result: ReviewDecision["result"], subject = reviewBinding(item)): ReviewItem {
  const evidenceReceiptId = [...item.verifications].reverse().find((record) => sameReviewBinding(record.subject, subject))?.receiptId ?? null;
  const updated = addReceipt(item, "decision", "sample-owner", result,
    result === "APPROVED" ? "The sample owner approved publishing this exact candidate to the review copy. No production action is included." : "The sample owner declined this candidate. Its changes and evidence remain available; no action follows.",
    { evidenceReceiptId: evidenceReceiptId ?? "none", permittedAction: "publish-review-copy", target: "synthetic documentation review copy", productionAuthority: false }, subject);
  return { ...updated, decisions: [...item.decisions, { receiptId: updated.receipts.at(-1)!.id, evidenceReceiptId, subject, actor: "sample-owner", action: "publish-review-copy", result }] };
}

function baseItem(id: ReviewCaseId, number: number, title: string, phase: ReviewPhase): ReviewItem {
  const empty = id === "empty";
  return {
    id, title, phase,
    workOrderId: empty ? null : `WO-DOCS-${number}`,
    factoryVersion: "docs-maintenance@1.2.0",
    candidateId: empty ? null : `CAND-DOCS-${number}/r1`,
    objective: empty ? "Check for documentation changes that meet the factory's admission rules." : "Refresh the API example and its reference link. Preserve all other documentation.",
    trigger: empty ? "Scheduled eligibility scan · 07:50" : `Source-change event · EVT-DOCS-${number}`,
    execution: empty ? "none" : "complete",
    verifications: [], decisions: [], effect: "none", effectSubject: null, effectAttempts: 0,
    correctionsUsed: 0, correctionLimit: 1, spendCents: empty ? 0 : 30, limitCents: 100, receipts: [],
  };
}

function produced(item: ReviewItem): ReviewItem {
  return addReceipt(item, "execution", "sample-producer", "COMPLETE", "The producer finished a bounded documentation update and recorded a candidate for verification.", { changedFiles: "docs/api.md", attempt: "producer-1", scope: "documentation only", externalWrites: 0 });
}

export function createMorningReview(): MorningReviewState {
  const verified = addVerification(produced(baseItem("verified", 42, "A candidate is ready for your decision", "awaiting-decision")), "PASS");
  const failed = addVerification(produced(baseItem("failed", 43, "A finished attempt failed verification", "verification-failed")), "FAIL");
  let unknown = addDecision(addVerification(produced(baseItem("unknown", 44, "A write timed out. Did it happen?", "unknown-effect")), "PASS"), "APPROVED");
  unknown = addReceipt({ ...unknown, effect: "unknown", effectSubject: reviewBinding(unknown), effectAttempts: 1, spendCents: 60 }, "effect", "sample-control-plane", "UNKNOWN", "The review-copy request timed out after dispatch. Its effect has not been confirmed, so a blind retry is blocked.", { operationKey: "OP-DOCS-44/r1", acknowledgement: "not received", retryAllowed: false });
  const staleBase = produced(baseItem("stale", 45, "The candidate changed after approval", "stale-evidence"));
  let stale = addDecision(addVerification(staleBase, "PASS"), "APPROVED");
  stale = addReceipt({ ...stale, factoryVersion: "docs-maintenance@1.3.0", candidateId: "CAND-DOCS-45/r2", spendCents: 45 }, "execution", "sample-producer", "COMPLETE", "A new candidate and Factory Version replaced the approved subject. The earlier evidence and decision remain in history but do not apply to this revision.", { supersedesCandidate: stale.candidateId!, supersedesFactoryVersion: stale.factoryVersion, changedFiles: "docs/api.md" });
  let budget = addVerification(produced(baseItem("budget", 46, "The work reached its spending limit", "budget-exhausted")), "FAIL");
  budget = addReceipt({ ...budget, candidateId: "CAND-DOCS-46/r2", correctionsUsed: 1 }, "execution", "sample-producer", "COMPLETE", "The one permitted correction produced a second candidate, which still requires independent verification.", { supersedesCandidate: "CAND-DOCS-46/r1", correctionNumber: 1, changedFiles: "docs/api.md", externalWrites: 0 });
  budget = { ...addVerification(budget, "FAIL"), execution: "incomplete", spendCents: 100 };
  budget = addReceipt(budget, "stop", "sample-control-plane", "LIMIT_REACHED", "The correction allowance and total sample budget are exhausted. Further work requires a new authorized WorkOrder.", { spendCents: 100, limitCents: 100, correctionsUsed: 1, correctionLimit: 1, authorityExpanded: false });
  const empty = addReceipt(baseItem("empty", 47, "Nothing eligible needs doing", "idle"), "scan", "sample-control-plane", "NO_ELIGIBLE_WORK", "The scheduled scan found no eligible changes. It created no WorkOrder, candidate, or external action.", { scanId: "SCAN-DOCS-47", eligibleChanges: 0, workOrdersCreated: 0, externalWrites: 0 });
  return { selected: "verified", items: { verified, failed, unknown, stale, budget, empty }, announcement: "Six sample situations are ready to inspect." };
}

export const reviewActionActors: Record<ReviewActionId, ReviewActor> = {
  approve: "sample-owner", decline: "sample-owner", correct: "sample-producer", verify: "sample-verifier",
  reconcile: "sample-control-plane", retry: "sample-control-plane", apply: "sample-control-plane", observe: "sample-control-plane", stop: "sample-control-plane", scan: "sample-control-plane",
};
const actionCosts: Partial<Record<ReviewActionId, number>> = { correct: 20, verify: 5, apply: 1, retry: 1 };

export function availableReviewActions(item: ReviewItem): ReviewActionId[] {
  const eligible = hasCurrentVerification(item);
  const authorized = hasCurrentAuthorization(item);
  let actions: ReviewActionId[];
  switch (item.phase) {
    case "awaiting-decision": actions = eligible ? ["approve", "decline"] : []; break;
    case "verification-failed": actions = item.correctionsUsed < item.correctionLimit ? ["correct", "stop"] : ["stop"]; break;
    case "awaiting-verification": case "stale-evidence": actions = ["verify"]; break;
    case "unknown-effect": actions = item.effect === "unknown" && item.effectSubject && sameReviewBinding(item.effectSubject, item) ? ["reconcile"] : []; break;
    case "retry-ready": actions = eligible && authorized && item.effect === "absent" && item.effectSubject && sameReviewBinding(item.effectSubject, item) ? ["retry"] : []; break;
    case "authorized": actions = eligible && authorized && item.effect === "none" ? ["apply"] : []; break;
    case "awaiting-observation": actions = item.effect === "submitted" && item.effectSubject && sameReviewBinding(item.effectSubject, item) ? ["observe"] : []; break;
    case "budget-exhausted": actions = ["stop"]; break;
    case "idle": actions = ["scan"]; break;
    default: actions = [];
  }
  return actions.filter((action) => item.spendCents + (actionCosts[action] ?? 0) <= item.limitCents);
}

export function morningReviewReducer(state: MorningReviewState, event: MorningReviewEvent): MorningReviewState {
  if (event.type === "reset") return createMorningReview();
  if (event.type === "select") return { ...state, selected: event.id, announcement: `${state.items[event.id].title}. ${reviewPhaseLabels[state.items[event.id].phase]}.` };
  const original = state.items[event.id];
  if (!sameReviewBinding(original, event.subject) || event.actor !== reviewActionActors[event.action] || !availableReviewActions(original).includes(event.action)) return state;
  let item = { ...original, spendCents: original.spendCents + (actionCosts[event.action] ?? 0) };
  switch (event.action) {
    case "approve":
      item = { ...addDecision(item, "APPROVED"), phase: "authorized" };
      break;
    case "decline":
      item = { ...addDecision(item, "DECLINED"), phase: "declined" };
      break;
    case "correct":
      item = addReceipt({ ...item, candidateId: `${item.candidateId!.split("/r")[0]}/r2`, phase: "awaiting-verification", execution: "complete", correctionsUsed: item.correctionsUsed + 1, effect: "none", effectSubject: null }, "execution", "sample-producer", "COMPLETE", "One permitted correction produced a new candidate. The failed result remains recorded; the new candidate needs independent verification.", { supersedesCandidate: original.candidateId!, correctionNumber: item.correctionsUsed + 1, changedFiles: "docs/api.md", externalWrites: 0 });
      break;
    case "verify":
      item = { ...addVerification(item, "PASS"), phase: "awaiting-decision" };
      break;
    case "reconcile": {
      if (event.reconciliation !== "found" && event.reconciliation !== "absent") return state;
      const found = event.reconciliation === "found";
      item = addReceipt({ ...item, phase: found ? "observed" : "retry-ready", effect: found ? "observed" : "absent" }, "observation", "sample-control-plane", found ? "MATCH_FOUND" : "CONFIRMED_ABSENT",
        found ? "The sample target contains this exact candidate under the original operation key. Its outcome is confirmed and no retry is performed." : "The sample target confirms the original operation is absent. One retry may reuse the operation key, current evidence, and existing approval.",
        { operationKey: "OP-DOCS-44/r1", targetReply: found ? "exact subject found" : "operation definitively absent in this fixed example", additionalWrites: 0, retryAllowed: !found });
      break;
    }
    case "apply": case "retry":
      item = addReceipt({ ...item, phase: "awaiting-observation", effect: "submitted", effectSubject: reviewBinding(item), effectAttempts: item.effectAttempts + 1 }, "effect", "sample-control-plane", "SUBMITTED", "The authorized review-copy action was submitted in the simulation. An acknowledgement is not yet an observed outcome.", { operationKey: `OP-DOCS-${item.workOrderId!.split("-").at(-1)}/${item.candidateId!.split("/").at(-1)}`, attempt: item.effectAttempts + 1, target: "synthetic documentation review copy", productionAction: false });
      break;
    case "observe":
      item = addReceipt({ ...item, phase: "observed", effect: "observed" }, "observation", "sample-control-plane", "MATCH_FOUND", "The sample target reports the exact approved candidate and Factory Version. The outcome is now observed.", { matchesCurrentCandidate: true, matchesFactoryVersion: true, target: "synthetic documentation review copy", productionAction: false });
      break;
    case "stop":
      item = addReceipt({ ...item, phase: "stopped" }, "stop", "sample-control-plane", "STOPPED", "The WorkOrder stopped within its existing limits. Its candidate and evidence are retained; no extra budget or authority was granted.", { additionalWrites: 0, requiresNewAuthorizedWorkOrderToContinue: true });
      break;
    case "scan":
      item = addReceipt(item, "scan", "sample-control-plane", "NO_ELIGIBLE_WORK", "The repeated sample scan still finds no eligible changes. Waiting is the correct result; no work is invented.", { scanId: "SCAN-DOCS-47", eligibleChanges: 0, workOrdersCreated: 0, externalWrites: 0 });
      break;
  }
  return { ...state, items: { ...state.items, [event.id]: item }, announcement: `${reviewPhaseLabels[item.phase]}. ${item.receipts.at(-1)!.summary}` };
}
