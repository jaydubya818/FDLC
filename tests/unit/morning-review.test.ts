import assert from "node:assert/strict";
import test from "node:test";
import {
  availableReviewActions,
  createMorningReview,
  hasCurrentAuthorization,
  hasCurrentVerification,
  morningReviewReducer,
  reviewActionActors,
  reviewBinding,
  reviewCaseIds,
  type MorningReviewState,
  type ReviewActionId,
  type ReviewCaseId,
} from "../../lib/morning-review.ts";

function act(state: MorningReviewState, id: ReviewCaseId, action: ReviewActionId, reconciliation?: "found" | "absent") {
  return morningReviewReducer(state, { type: "act", id, action, actor: reviewActionActors[action], subject: reviewBinding(state.items[id]), reconciliation });
}

test("a complete and verified candidate still needs authorization, execution, and observation", () => {
  let state = createMorningReview();
  assert.equal(state.items.verified.execution, "complete");
  assert.equal(hasCurrentVerification(state.items.verified), true);
  assert.equal(hasCurrentAuthorization(state.items.verified), false);
  assert.equal(act(state, "verified", "apply"), state);
  assert.equal(act(state, "verified", "observe"), state);

  state = act(state, "verified", "approve");
  assert.equal(state.items.verified.phase, "authorized");
  assert.equal(state.items.verified.effect, "none");
  assert.equal(act(state, "verified", "observe"), state);

  state = act(state, "verified", "apply");
  assert.equal(state.items.verified.phase, "awaiting-observation");
  assert.equal(state.items.verified.effect, "submitted");
  assert.equal(act(state, "verified", "apply"), state, "a repeated click must not submit twice");

  state = act(state, "verified", "observe");
  assert.equal(state.items.verified.phase, "observed");
  assert.equal(state.items.verified.effectAttempts, 1);
  assert.deepEqual(state.items.verified.receipts.at(-1)?.subject, reviewBinding(state.items.verified));
});

test("only the sample owner can authorize the exact current subject", () => {
  const state = createMorningReview();
  const event = { type: "act", id: "verified", action: "approve", actor: "sample-owner", subject: reviewBinding(state.items.verified) } as const;
  assert.equal(morningReviewReducer(state, { ...event, actor: "sample-producer" }), state);
  assert.equal(morningReviewReducer(state, { ...event, subject: { ...event.subject, candidateId: "CAND-DOCS-42/older" } }), state);
  assert.equal(morningReviewReducer(state, { ...event, subject: { ...event.subject, factoryVersion: "docs-maintenance@1.1.0" } }), state);
  assert.equal(morningReviewReducer(state, { ...event, subject: { ...event.subject, workOrderId: "WO-DOCS-another" } }), state);

  const declined = act(state, "verified", "decline");
  assert.equal(declined.items.verified.phase, "declined");
  assert.equal(act(declined, "verified", "approve"), declined);
  assert.equal(act(declined, "verified", "apply"), declined);
});

test("one correction preserves failed evidence and requires a distinct verifier and fresh decision", () => {
  let state = createMorningReview();
  const first = state.items.failed;
  assert.equal(act(state, "failed", "approve"), state);
  assert.equal(act(state, "failed", "apply"), state);
  state = act(state, "failed", "correct");
  assert.notEqual(state.items.failed.candidateId, first.candidateId);
  assert.deepEqual(state.items.failed.verifications, first.verifications);
  assert.equal(state.items.failed.correctionsUsed, 1);
  assert.equal(hasCurrentVerification(state.items.failed), false);
  assert.equal(act(state, "failed", "correct"), state);
  assert.equal(act(state, "failed", "approve"), state);
  assert.equal(morningReviewReducer(state, { type: "act", id: "failed", action: "verify", actor: "sample-producer", subject: reviewBinding(state.items.failed) }), state);

  const oldRequest = { type: "act", id: "failed", action: "verify", actor: "sample-verifier", subject: reviewBinding(first) } as const;
  assert.equal(morningReviewReducer(state, oldRequest), state, "an old UI request cannot verify a different candidate");
  state = act(state, "failed", "verify");
  assert.deepEqual(state.items.failed.verifications.map((record) => record.result), ["FAIL", "PASS"]);
  assert.equal(state.items.failed.phase, "awaiting-decision");
  assert.equal(hasCurrentAuthorization(state.items.failed), false);
  state = act(state, "failed", "approve");
  assert.deepEqual(state.items.failed.decisions.at(-1)?.subject, reviewBinding(state.items.failed));
});

test("stale verification and approval cannot transfer to a new candidate or Factory Version", () => {
  let state = createMorningReview();
  const originalDecision = state.items.stale.decisions[0];
  assert.equal(hasCurrentVerification(state.items.stale), false);
  assert.equal(hasCurrentAuthorization(state.items.stale), false);
  assert.equal(act(state, "stale", "approve"), state);
  assert.equal(act(state, "stale", "apply"), state);

  state = act(state, "stale", "verify");
  assert.equal(hasCurrentVerification(state.items.stale), true);
  assert.equal(hasCurrentAuthorization(state.items.stale), false);
  assert.equal(act(state, "stale", "apply"), state);
  state = act(state, "stale", "approve");
  assert.equal(state.items.stale.decisions.length, 2);
  assert.deepEqual(state.items.stale.decisions[0], originalDecision);
  assert.equal(hasCurrentAuthorization(state.items.stale), true);

  const changedVersion = { ...state.items.stale, factoryVersion: "docs-maintenance@1.4.0" };
  assert.equal(hasCurrentVerification(changedVersion), false);
  assert.equal(hasCurrentAuthorization(changedVersion), false);
  assert.deepEqual(availableReviewActions(changedVersion), []);
});

test("new verification evidence for the same candidate does not inherit an earlier decision", () => {
  const approved = act(createMorningReview(), "verified", "approve").items.verified;
  const previousVerification = approved.verifications.at(-1)!;
  assert.equal(approved.decisions.at(-1)?.evidenceReceiptId, previousVerification.receiptId);
  const reverified = { ...approved, verifications: [...approved.verifications, { ...previousVerification, receiptId: "REC-REVERIFIED-01" }] };
  assert.equal(hasCurrentVerification(reverified), true);
  assert.equal(hasCurrentAuthorization(reverified), false);
  assert.deepEqual(availableReviewActions(reverified), []);
});

test("an unknown external effect is reconciled without a second write when the exact subject exists", () => {
  let state = createMorningReview();
  assert.equal(state.items.unknown.effectAttempts, 1);
  assert.equal(act(state, "unknown", "retry"), state);
  assert.equal(act(state, "unknown", "apply"), state);
  assert.equal(act(state, "unknown", "observe"), state);
  assert.equal(act(state, "unknown", "reconcile"), state, "a missing target result cannot establish an outcome");

  state = act(state, "unknown", "reconcile", "found");
  assert.equal(state.items.unknown.phase, "observed");
  assert.equal(state.items.unknown.effectAttempts, 1);
  assert.equal(act(state, "unknown", "retry"), state);
  assert.equal(state.items.unknown.receipts.at(-1)?.facts.additionalWrites, 0);
});

test("confirmed absence allows one retry with the same binding and operation identity", () => {
  let state = act(createMorningReview(), "unknown", "reconcile", "absent");
  const subject = reviewBinding(state.items.unknown);
  assert.deepEqual(availableReviewActions(state.items.unknown), ["retry"]);
  assert.equal(state.items.unknown.effectAttempts, 1);
  state = act(state, "unknown", "retry");
  assert.equal(state.items.unknown.effectAttempts, 2);
  assert.equal(state.items.unknown.phase, "awaiting-observation");
  assert.deepEqual(state.items.unknown.receipts.at(-1)?.subject, subject);
  assert.equal(state.items.unknown.receipts.at(-1)?.facts.operationKey, "OP-DOCS-44/r1");
  assert.equal(act(state, "unknown", "retry"), state);
  assert.equal(act(state, "unknown", "reconcile", "absent"), state);
  state = act(state, "unknown", "observe");
  assert.equal(state.items.unknown.phase, "observed");
});

test("reconciliation and observation cannot be reused for a changed subject", () => {
  const state = createMorningReview();
  const changed = { ...state.items.unknown, candidateId: "CAND-DOCS-44/r2" };
  assert.deepEqual(availableReviewActions(changed), []);

  const ready = act(state, "unknown", "reconcile", "absent").items.unknown;
  const mismatchedProbe = { ...ready, effectSubject: { ...reviewBinding(ready), factoryVersion: "docs-maintenance@older" } };
  assert.deepEqual(availableReviewActions(mismatchedProbe), []);
  const submitted = act(act(state, "verified", "approve"), "verified", "apply").items.verified;
  assert.deepEqual(availableReviewActions({ ...submitted, candidateId: "CAND-DOCS-42/r2" }), []);
});

test("exhausted limits allow a retained stop, never an extra correction or external action", () => {
  let state = createMorningReview();
  for (const action of ["correct", "verify", "apply", "approve", "retry"] as const) assert.equal(act(state, "budget", action), state);
  const evidence = state.items.budget.verifications;
  assert.equal(evidence.length, 2);
  assert.equal(evidence.at(-1)?.subject.candidateId, state.items.budget.candidateId);
  state = act(state, "budget", "stop");
  assert.equal(state.items.budget.phase, "stopped");
  assert.equal(state.items.budget.spendCents, state.items.budget.limitCents);
  assert.deepEqual(state.items.budget.verifications, evidence);
  assert.equal(state.items.budget.effectAttempts, 0);
  assert.equal(act(state, "budget", "stop"), state);

  const cannotAffordCorrection = { ...createMorningReview().items.failed, spendCents: 95 };
  assert.deepEqual(availableReviewActions(cannotAffordCorrection), ["stop"]);
  const correctionUsed = { ...createMorningReview().items.failed, correctionsUsed: 1 };
  assert.deepEqual(availableReviewActions(correctionUsed), ["stop"]);
});

test("an empty scan remains empty and never invents WorkOrders or external actions", () => {
  let state = createMorningReview();
  for (const action of ["correct", "verify", "approve", "apply", "retry"] as const) assert.equal(act(state, "empty", action), state);
  state = act(act(state, "empty", "scan"), "empty", "scan");
  assert.equal(state.items.empty.workOrderId, null);
  assert.equal(state.items.empty.candidateId, null);
  assert.equal(state.items.empty.phase, "idle");
  assert.equal(state.items.empty.effectAttempts, 0);
  assert.equal(state.items.empty.spendCents, 0);
  assert.ok(state.items.empty.receipts.every((receipt) => receipt.facts.workOrdersCreated === 0));
});

test("selection retains other examples and reset restores the entire deterministic morning", () => {
  const initial = createMorningReview();
  assert.deepEqual(Object.keys(initial.items), reviewCaseIds);
  let state = act(initial, "verified", "approve");
  state = morningReviewReducer(state, { type: "select", id: "failed" });
  assert.equal(state.selected, "failed");
  assert.equal(state.items.verified.phase, "authorized");
  assert.deepEqual(morningReviewReducer(state, { type: "reset" }), initial);
});
