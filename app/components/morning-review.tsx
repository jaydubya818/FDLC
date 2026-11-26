"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */

import { useReducer, useRef, useState } from "react";
import {
  availableReviewActions,
  createMorningReview,
  morningReviewReducer,
  reviewActionActors,
  reviewAuthorizationLabel,
  reviewBinding,
  reviewCaseIds,
  reviewPhaseLabels,
  reviewVerificationLabel,
  type ReviewActionId,
  type ReviewPhase,
} from "../../lib/morning-review";

const guidance: Record<ReviewPhase, { title: string; description: string; consequence: string }> = {
  "awaiting-decision": {
    title: "The checks passed. An authorized decision comes next.",
    description: "Review the exact candidate and its evidence. This example lets you act as the accountable owner and approve or decline a change to a sample review copy.",
    consequence: "Approval applies only to the candidate and Factory Version shown above. It records permission; it does not perform the action or prove its outcome.",
  },
  "verification-failed": {
    title: "The attempt finished. One check failed.",
    description: "The documentation link does not resolve. The WorkOrder permits one bounded correction to docs/api.md, followed by independent verification.",
    consequence: "A correction creates a new candidate. The failed evidence stays in the history, and approval remains unavailable until the new candidate passes.",
  },
  "awaiting-verification": {
    title: "The correction is ready for a fresh check.",
    description: "The producer used its one correction allowance. A separate verifier must evaluate the new candidate against all three acceptance checks.",
    consequence: "In this fixed example, fresh verification passes. It will still require a new owner decision before any sample action can run.",
  },
  "unknown-effect": {
    title: "A timeout leaves the outcome unknown.",
    description: "The earlier approval is current, but the write may already have happened. Inspect the sample target using the original operation key before considering a retry.",
    consequence: "If the exact change exists, record it without another write. If the target confirms it is absent, a bounded retry becomes available under the existing approval.",
  },
  "retry-ready": {
    title: "The target confirmed the operation is absent.",
    description: "This fixed example provides a definitive absence result. The evidence and approval still match the candidate, so the same operation key can be retried once.",
    consequence: "The retry submits the sample action. You will then inspect the resulting target state before recording an observed outcome.",
  },
  authorized: {
    title: "Permission is recorded. The action has not run.",
    description: "The sample owner approved this exact candidate for the documentation review copy. Production and all other targets remain outside its scope.",
    consequence: "Running the sample action records a submitted request. A separate observation will check what the target actually contains.",
  },
  "awaiting-observation": {
    title: "The request was submitted. Inspect the result.",
    description: "An acknowledged request is not sufficient evidence that the intended candidate is present. Check the target's recorded candidate and Factory Version.",
    consequence: "This fixed observation confirms the exact approved subject. No additional write occurs.",
  },
  observed: {
    title: "The exact outcome is now observed.",
    description: "The sample target contains the approved candidate and its Factory Version. The receipts connect the work, checks, decision, and resulting state.",
    consequence: "The demonstration ends here. No software was published, deployed, or changed outside this page.",
  },
  "stale-evidence": {
    title: "An earlier approval cannot cover a new revision.",
    description: "The retained checks and decision refer to CAND-DOCS-45/r1 on docs-maintenance@1.2.0. The current candidate and Factory Version are different.",
    consequence: "Verify the current subject, then request a fresh decision. The previous records remain inspectable but cannot authorize the new action.",
  },
  "budget-exhausted": {
    title: "The factory has reached its agreed limit.",
    description: "The sample has spent $1.00 of its $1.00 allowance and used its one correction. It cannot start another attempt or expand its own authority.",
    consequence: "Record a bounded stop and retain the evidence. Continuing would require a separate authorized WorkOrder; this example does not create one.",
  },
  stopped: {
    title: "The work stopped within its existing limits.",
    description: "The candidate, failed checks, and stop reason are retained for the owner. No extra budget, permissions, or external action were introduced.",
    consequence: "Choose another example or reset the morning to explore a different outcome.",
  },
  declined: {
    title: "The owner declined this candidate.",
    description: "Passing checks did not override the owner's decision. The candidate and evidence remain available, and the sample action is blocked.",
    consequence: "Choose another example or reset the morning to try the approval path.",
  },
  idle: {
    title: "Waiting is the correct result.",
    description: "The scheduled scan found no source changes that meet the admission rules. It created no WorkOrder, candidate, or external action.",
    consequence: "Repeating this fixed scan produces the same empty result. A factory does not need to invent work to remain useful.",
  },
};

const actionLabels: Record<ReviewActionId, string> = {
  approve: "Approve sample candidate",
  decline: "Decline sample candidate",
  correct: "Make one bounded correction",
  verify: "Verify the current candidate",
  reconcile: "Reconcile the sample target",
  retry: "Retry the sample action once",
  apply: "Run the authorized sample action",
  observe: "Inspect the sample outcome",
  stop: "Record a bounded stop",
  scan: "Repeat the sample scan",
};

function phaseTone(phase: ReviewPhase): string {
  if (phase === "observed" || phase === "authorized") return "ready";
  if (["verification-failed", "unknown-effect", "stale-evidence", "budget-exhausted"].includes(phase)) return "attention";
  return "neutral";
}

export function MorningReview() {
  const [state, dispatch] = useReducer(morningReviewReducer, undefined, createMorningReview);
  const [targetReply, setTargetReply] = useState<"found" | "absent">("found");
  const actionHeadingRef = useRef<HTMLHeadingElement>(null);
  const caseHeadingRef = useRef<HTMLHeadingElement>(null);
  const item = state.items[state.selected];
  const actions = availableReviewActions(item);
  const instructions = guidance[item.phase];
  const latestReceipt = item.receipts.at(-1)!;
  const items = Object.values(state.items);
  const decisionCount = items.filter((entry) => entry.phase === "awaiting-decision").length;
  const observedCount = items.filter((entry) => entry.phase === "observed").length;
  const outcomeLabel = item.effect === "observed" ? "Exact subject observed" : item.effect === "unknown" ? "Unknown" : item.effect === "absent" ? "Confirmed absent" : item.effect === "submitted" ? "Not yet observed" : "No action taken";

  function act(action: ReviewActionId) {
    dispatch({ type: "act", id: item.id, action, actor: reviewActionActors[action], subject: reviewBinding(item), reconciliation: action === "reconcile" ? targetReply : undefined });
    requestAnimationFrame(() => actionHeadingRef.current?.focus({ preventScroll: true }));
  }

  function select(id: (typeof reviewCaseIds)[number]) {
    dispatch({ type: "select", id });
    requestAnimationFrame(() => {
      caseHeadingRef.current?.focus({ preventScroll: true });
      if (window.matchMedia("(max-width: 760px)").matches) caseHeadingRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
    });
  }

  return <section className="morning-review" id="morning-review" aria-labelledby="morning-review-title">
    <header className="morning-heading">
      <div>
        <p className="section-label">Operating a small factory</p>
        <h2 id="morning-review-title">Morning review</h2>
        <p>The factory worked while you were away. See what needs your decision, what needs recovery, and what can simply wait.</p>
      </div>
      <div className="morning-demo-note"><strong>Interactive simulation</strong><span>Six fixed examples. Every record and cost is synthetic. Nothing connects to a live system.</span></div>
    </header>

    <div className="morning-toolbar">
      <p><strong>{decisionCount}</strong> {decisionCount === 1 ? "decision" : "decisions"} waiting <span aria-hidden="true">/</span> <strong>{observedCount}</strong> {observedCount === 1 ? "outcome" : "outcomes"} observed</p>
      <button type="button" className="morning-reset" onClick={() => { dispatch({ type: "reset" }); setTargetReply("found"); }}>Reset the morning <span aria-hidden="true">↺</span></button>
    </div>
    <p className="morning-sr-only" role="status" aria-live="polite" aria-atomic="true">{state.announcement}</p>

    <div className="morning-workspace">
      <nav className="morning-queue" aria-label="Morning review examples">
        <p className="morning-queue-label">Choose a situation <span>06</span></p>
        <ol>
          {reviewCaseIds.map((id, index) => {
            const entry = state.items[id];
            return <li key={id}><button type="button" aria-pressed={state.selected === id} aria-controls="morning-selected-work" onClick={() => select(id)}>
              <span className="morning-queue-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span className="morning-queue-copy"><strong>{entry.title}</strong><span className={`morning-state is-${phaseTone(entry.phase)}`}>{reviewPhaseLabels[entry.phase]}</span><small>{entry.workOrderId ?? "SCAN-DOCS-47"}</small></span>
              <span className="morning-selected-mark" aria-hidden="true">{state.selected === id ? "→" : ""}</span>
            </button></li>;
          })}
        </ol>
      </nav>

      <article className="morning-detail" id="morning-selected-work" aria-labelledby="morning-case-title">
        <div className="morning-detail-heading"><span className={`morning-state is-${phaseTone(item.phase)}`}>{reviewPhaseLabels[item.phase]}</span><span className="morning-sample-label">Sample {reviewCaseIds.indexOf(item.id) + 1} / 6</span></div>
        <h3 id="morning-case-title" ref={caseHeadingRef} tabIndex={-1}>{item.title}</h3>
        <p className="morning-objective">{item.objective}</p>
        <dl className="morning-identities">
          <div><dt>{item.workOrderId ? "WorkOrder" : "Eligibility scan"}</dt><dd><code>{item.workOrderId ?? "SCAN-DOCS-47 · no WorkOrder created"}</code></dd></div>
          <div><dt>Factory Version</dt><dd><code>{item.factoryVersion}</code></dd></div>
          <div><dt>Current candidate</dt><dd><code>{item.candidateId ?? "None"}</code></dd></div>
          <div><dt>Trigger</dt><dd>{item.trigger}</dd></div>
        </dl>

        <div className="morning-boundaries">
          <p>Four separate facts</p>
          <dl>
            <div><dt>Execution</dt><dd>{item.execution === "none" ? "No work admitted" : item.execution === "complete" ? "Attempt complete" : "Work incomplete"}</dd></div>
            <div><dt>Verification</dt><dd>{item.workOrderId ? reviewVerificationLabel(item) : "Not applicable"}</dd></div>
            <div><dt>Authorization</dt><dd>{item.workOrderId ? reviewAuthorizationLabel(item) : "Not applicable"}</dd></div>
            <div><dt>Outcome</dt><dd>{outcomeLabel}</dd></div>
          </dl>
        </div>

        <section className="morning-next-action" aria-labelledby="morning-action-title">
          <p className="section-label">Your next step</p>
          <h4 id="morning-action-title" ref={actionHeadingRef} tabIndex={-1}>{instructions.title}</h4>
          <p>{instructions.description}</p>
          {item.phase === "unknown-effect" && <fieldset className="morning-target-choice"><legend>Choose the simulated target reply</legend><p>Explore either fixed result, then reconcile.</p>
            <label><input type="radio" name="morning-target-reply" value="found" checked={targetReply === "found"} onChange={() => setTargetReply("found")} /><span>The exact change already exists</span></label>
            <label><input type="radio" name="morning-target-reply" value="absent" checked={targetReply === "absent"} onChange={() => setTargetReply("absent")} /><span>The operation is confirmed absent</span></label>
          </fieldset>}
          {actions.length > 0 && <div className="morning-actions">{actions.map((action, index) => <button key={action} type="button" className={`button ${index === 0 ? "button-dark" : "button-light"}`} onClick={() => act(action)}>{actionLabels[action]}</button>)}{item.phase === "unknown-effect" && <button type="button" className="button button-light" disabled aria-describedby="morning-action-consequence">Retry is blocked</button>}</div>}
          <p className="morning-consequence" id="morning-action-consequence"><strong>What happens next</strong>{instructions.consequence}</p>
        </section>

        <div className="morning-limits"><span>Sample spend <strong>${(item.spendCents / 100).toFixed(2)} / ${(item.limitCents / 100).toFixed(2)}</strong></span><span>Corrections <strong>{item.correctionsUsed} / {item.correctionLimit} used</strong></span><span>External attempts <strong>{item.effectAttempts} simulated</strong></span></div>

        <section className="morning-evidence" aria-labelledby="morning-evidence-title">
          <p className="section-label" id="morning-evidence-title">Latest recorded evidence</p>
          <p>{latestReceipt.summary}</p>
          <details className="morning-receipts" key={item.id}><summary>Inspect receipts and raw evidence <span>{item.receipts.length} records</span></summary>
            <p>These fixed records show the exact subject and actor. Open any receipt to inspect the facts behind its summary.</p>
            <ol>{item.receipts.map((receipt) => <li key={receipt.id}>
              <div className="morning-receipt-label"><code>{receipt.id}</code><span>{receipt.kind}</span></div>
              <p>{receipt.summary}</p>
              <details><summary>Open {receipt.id}</summary><pre role="region" aria-label={`Raw evidence for ${receipt.id}`}>{JSON.stringify({ id: receipt.id, actor: receipt.actor, subject: receipt.subject, result: receipt.result, facts: receipt.facts }, null, 2)}</pre></details>
            </li>)}</ol>
          </details>
        </section>
      </article>
    </div>
    <footer className="morning-footer"><p>A useful factory brings you a bounded decision and the evidence to make it.</p><a href="/guide/03-build/14-durable-execution">Explore durable execution <span aria-hidden="true">→</span></a></footer>
  </section>;
}
