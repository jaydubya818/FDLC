"use client";

import Image from "next/image";
import { useState } from "react";

const flowStages = [
  {
    verb: "Define",
    title: "Capture the mission",
    records: "Mission + Mission Spec",
    question: "What outcome is required—and what would prove success?",
    summary: "Intent becomes a versioned contract with scope, non-goals, constraints, and acceptance expectations before an agent receives authority.",
    authority: "Mission owner",
    control: "Specification readiness",
    proof: "Immutable spec revision",
    next: "Planning eligible",
  },
  {
    verb: "Authorize",
    title: "Approve the plan",
    records: "Plan + WorkOrder",
    question: "Is the proposed work bounded, reviewable, and safe to release?",
    summary: "A reviewed Plan decomposes the mission into WorkOrders with exact scope, budgets, tools, policies, and acceptance obligations.",
    authority: "Plan approver",
    control: "Versioned plan approval",
    proof: "Approved Plan revision",
    next: "Dispatch eligible",
  },
  {
    verb: "Execute",
    title: "Run bounded attempts",
    records: "Task + Attempt",
    question: "May this worker perform this action against these exact inputs?",
    summary: "Workers are admitted against frozen configuration. Leases, checkpoints, and recovery keep execution attributable and prevent duplicate authority.",
    authority: "Worker admission",
    control: "Identity + fenced lease",
    proof: "Attempt trace + candidate",
    next: "Verification required",
  },
  {
    verb: "Verify",
    title: "Prove the candidate",
    records: "Evidence + Quality Gate",
    question: "Does this exact candidate satisfy the approved specification?",
    summary: "A logically separate verifier evaluates the candidate and binds receipts to the relevant criteria, Attempt, policy, and source revision.",
    authority: "Independent verifier",
    control: "Fail-closed quality gate",
    proof: "Current evidence receipts",
    next: "Acceptance eligible",
  },
  {
    verb: "Decide",
    title: "Apply human judgment",
    records: "Acceptance decision",
    question: "Should this verified change advance across the consequential boundary?",
    summary: "The operator reviews the decision packet, accepts the exact candidate, rejects it, or requests revision. Verification never silently becomes approval.",
    authority: "Named human owner",
    control: "Consequential approval",
    proof: "Attributable decision record",
    next: "Release eligible",
  },
  {
    verb: "Observe",
    title: "Release and learn",
    records: "Release + Outcome",
    question: "Did the accepted change produce the intended result in reality?",
    summary: "Publication is permit-gated, the production outcome is observed separately, and only validated evidence may become a governed learning proposal.",
    authority: "Release owner",
    control: "Publication permit",
    proof: "Outcome + learning signal",
    next: "Governed improvement",
  },
] as const;

const productViews = [
  {
    name: "Command Center",
    short: "Attention",
    image: "/mission-control/command-center.png",
    alt: "Mission Control Command Center showing ranked work that needs operator attention",
    headline: "See decisions, blockers, and proof—not agent activity.",
    description: "The command center ranks work requiring judgment and gives every item an owner, a next action, and an inspectable proof source.",
    action: "Prioritize consequential work",
  },
  {
    name: "Work Orders",
    short: "Execution",
    image: "/mission-control/work-orders.png",
    alt: "Mission Control Work Orders view showing governed delivery state",
    headline: "Keep scope, authority, and verification on one record.",
    description: "WorkOrders expose the approved outcome, execution state, risk, assignment, evidence status, and the exact decision still required.",
    action: "Inspect bounded delivery",
  },
  {
    name: "Approvals & Audit",
    short: "Evidence",
    image: "/mission-control/audit.png",
    alt: "Mission Control approvals and audit view showing durable governance records",
    headline: "Retain the causal trail behind every transition.",
    description: "Approval, deployment, rollback, and policy records remain independently inspectable after the run instead of disappearing into a chat transcript.",
    action: "Review durable lineage",
  },
] as const;

export function MissionControlFlow() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = flowStages[activeIndex];

  const selectStage = (index: number) => setActiveIndex(index);
  const move = (direction: number) => setActiveIndex((current) => (current + direction + flowStages.length) % flowStages.length);

  return (
    <div className="mc-flow-console">
      <header className="mc-console-chrome">
        <div><span className="mc-console-light" /> Governed delivery trace</div>
        <span>Deterministic example · 01 mission</span>
      </header>
      <div className="mc-flow-layout">
        <div className="mc-flow-tabs" aria-label="Mission Control delivery stages" role="tablist">
          {flowStages.map((stage, index) => (
            <button
              aria-controls="mc-flow-panel"
              aria-selected={activeIndex === index}
              className={activeIndex === index ? "is-active" : undefined}
              id={`mc-flow-tab-${index}`}
              key={stage.verb}
              onClick={() => selectStage(index)}
              role="tab"
              type="button"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{stage.verb}</strong>
              <small>{stage.records}</small>
            </button>
          ))}
        </div>
        <section aria-labelledby={`mc-flow-tab-${activeIndex}`} className="mc-flow-panel" id="mc-flow-panel" role="tabpanel">
          <header>
            <div>
              <span>0{activeIndex + 1} / 06</span>
              <p>{active.records}</p>
            </div>
            <strong>{active.next}</strong>
          </header>
          <div className="mc-flow-copy">
            <p className="mc-flow-kicker">Decision boundary</p>
            <h3>{active.question}</h3>
            <p>{active.summary}</p>
          </div>
          <dl className="mc-flow-ledger">
            <div><dt>Authority</dt><dd>{active.authority}</dd></div>
            <div><dt>Control</dt><dd>{active.control}</dd></div>
            <div><dt>Required proof</dt><dd>{active.proof}</dd></div>
          </dl>
          <footer>
            <div aria-hidden="true" className="mc-flow-progress"><span style={{ width: `${((activeIndex + 1) / flowStages.length) * 100}%` }} /></div>
            <div>
              <button aria-label="Previous stage" onClick={() => move(-1)} type="button">←</button>
              <span>{active.title}</span>
              <button aria-label="Next stage" onClick={() => move(1)} type="button">→</button>
            </div>
          </footer>
        </section>
      </div>
    </div>
  );
}

export function MissionControlProductTour() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = productViews[activeIndex];

  return (
    <div className="mc-product-tour">
      <div className="mc-product-tabs" aria-label="Mission Control operator views" role="tablist">
        {productViews.map((view, index) => (
          <button
            aria-controls="mc-product-panel"
            aria-selected={activeIndex === index}
            className={activeIndex === index ? "is-active" : undefined}
            id={`mc-product-tab-${index}`}
            key={view.name}
            onClick={() => setActiveIndex(index)}
            role="tab"
            type="button"
          >
            <span>0{index + 1}</span>
            <strong>{view.name}</strong>
            <small>{view.short}</small>
          </button>
        ))}
      </div>
      <div aria-labelledby={`mc-product-tab-${activeIndex}`} id="mc-product-panel" role="tabpanel">
        <figure className="mc-product-window">
          <div className="mc-product-chrome"><span>Mission Control / {active.name}</span><span>Software Factory Demo</span></div>
          <Image alt={active.alt} height={1050} key={active.image} sizes="(max-width: 980px) 100vw, 900px" src={active.image} width={1600} />
        </figure>
        <aside className="mc-product-caption">
          <span>{active.action}</span>
          <h3>{active.headline}</h3>
          <p>{active.description}</p>
        </aside>
      </div>
    </div>
  );
}
