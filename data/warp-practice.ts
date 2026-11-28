/**
 * Provider-neutral FDLC design examples informed by Warp's practical lessons.
 * These records illustrate handoff contracts; they are not executable schemas
 * or claims about a connected tracker, runtime, verifier, or deployment.
 */

const lessonBase = "https://www.warp.dev/learn/build-a-self-improving-software-factory";

export const warpPracticeSources = {
  hello: { title: "Hello factory", url: `${lessonBase}/hello-factory` },
  backlog: { title: "Connect an issue backlog", url: `${lessonBase}/connect-an-issue-backlog` },
  specs: { title: "Route work with triage and specs", url: `${lessonBase}/tackle-larger-features-with-specs` },
  verification: { title: "Add verification and merge risk", url: `${lessonBase}/add-verification-and-merge-risk` },
  alerts: { title: "Close the loop with alert monitoring", url: `${lessonBase}/close-the-loop-with-alert-monitoring` },
} as const;

export type IntakeExampleField = {
  readonly label: string;
  readonly value: string;
  readonly detail: string;
};

export type IntakeExample = {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly source: keyof typeof warpPracticeSources;
  readonly sourceFinding: string;
  readonly introduction: string;
  readonly input: readonly IntakeExampleField[];
  readonly output: readonly IntakeExampleField[];
  readonly choices?: readonly { readonly condition: string; readonly response: string }[];
  readonly boundary: string;
  readonly guide: { readonly label: string; readonly href: string };
};

export const factoryIntakeExamples: readonly IntakeExample[] = [
  {
    id: "admit-one-issue",
    title: "Admit one issue",
    summary: "An incoming event becomes work only after an admission decision.",
    source: "backlog",
    sourceFinding: "Warp uses a maintainer-controlled issue label to start work, suppresses its own bot events, and treats issue text as untrusted input.",
    introduction: "A label is an intake signal. Check the sender, eligible scope, existing work and shared capacity before admitting a WorkOrder.",
    input: [
      { label: "Delivery", value: "evt-label-007", detail: "Authenticated tracker event; record its receipt separately from the issue identity." },
      { label: "Source", value: "issue-42@r3", detail: "Malformed reservation timestamps return a server error. Preserve this request revision and its author." },
    ],
    output: [
      { label: "Admission", value: "admit-42@r1 → WO-42", detail: "An authorized admission decision records eligibility, owner and scope. The label itself grants no authority." },
      { label: "Operating limit", value: "api-repair@1.2.0", detail: "Pin the Factory Version. Permit a candidate and draft PR; allow two implementation Attempts across all workers and one active WorkOrder. Merge and deployment require their own decisions." },
    ],
    choices: [
      { condition: "Same delivery", response: "Return the existing intake receipt; do not start another Attempt." },
      { condition: "Same issue revision", response: "Find the existing WorkOrder and its current disposition before considering more work." },
      { condition: "Changed request", response: "Assess the new revision against accepted scope. Amend through an explicit decision or admit separately eligible work." },
    ],
    boundary: "A worker-created issue or status update must not silently create another allowance. Begin with a small representative batch and inspect rejected, blocked and duplicate inputs too.",
    guide: { label: "Read the backlog and alert intake contract", href: "/guide/05-operate/37-control-surfaces-event-contracts-and-storage#backlog-and-alert-intake-examples" },
  },
  {
    id: "route-before-implementation",
    title: "Resolve intent before implementation",
    summary: "Answer, change or clarify; use a spec when a real decision remains.",
    source: "specs",
    sourceFinding: "Warp routes requests as answer, change or unclear, separates researchable facts from product decisions, and reuses an existing issue or active PR for follow-up work.",
    introduction: "Research can establish callers and current behavior. Ask for unresolved behavior choices or material approach trade-offs, with a recommendation. Batch questions that actually block the work.",
    input: [
      { label: "Work", value: "WO-42 / issue-42@r3", detail: "The request says to make date handling forgiving. Repository research finds a throwing parser and an existing validation-error format." },
      { label: "Open decision", value: "Reject or coerce?", detail: "Research cannot decide whether malformed dates should be rejected or silently changed. That is a product behavior choice." },
    ],
    output: [
      { label: "Accepted spec", value: "SPEC-42@r2", detail: "The product owner chooses HTTP 400 with INVALID_TIMESTAMP. Valid requests retain their behavior; date coercion is out of scope." },
      { label: "Bounded tasks", value: "T-42-implement → T-42-verify", detail: "Both pin SPEC-42@r2 and api-repair@1.2.0. The verifier checks each accepted criterion against the resulting candidate. Delegation shares the parent budget." },
    ],
    choices: [
      { condition: "Answer", response: "Return an evidence-backed answer. Do not create an implementation task unless a change is requested." },
      { condition: "Change", response: "Implement clear, bounded work directly. Use an approved spec when unresolved choices or complexity require it." },
      { condition: "Unclear", response: "Record the precise missing decision and await the owner. Keep the existing work identity and context." },
    ],
    boundary: "Spec approval settles the named behavior and scope. It does not approve a future candidate for merge or release. Material spec changes invalidate dependent plans and evidence as required by policy.",
    guide: { label: "Read triage before implementation", href: "/guide/02-design/06-intent-and-specification-engineering#triage-before-implementation" },
  },
  {
    id: "prepare-the-review",
    title: "Prepare a decision with evidence",
    summary: "Bind the requested action to the exact candidate and its proof.",
    source: "verification",
    sourceFinding: "Warp asks workers to exercise the requested path in the running app, attach visual evidence, and report blocked verification honestly before assessing merge risk.",
    introduction: "Check that the environment and required test access exist before promising verification. Show the criterion results first, with links to the underlying runs and artifacts.",
    input: [
      { label: "Candidate", value: "CAND-42@r2", detail: "Pins SPEC-42@r2 and api-repair@1.2.0. Evidence binds the candidate's immutable content digest, not just a branch name." },
      { label: "Evidence", value: "EV-42@r2 / test-env@r5", detail: "Protected checks cover malformed and valid requests. If the request includes a UI path, exercise that exact path and attach its recording. Preserve failures and inaccessible checks." },
    ],
    output: [
      { label: "Review packet", value: "REVIEW-42@r1", detail: "Names CAND-42@r2, EV-42@r2, criterion results, raw evidence references and the proposed merge target. Merge-risk assessment is advisory." },
      { label: "Decision", value: "Awaiting authorized reviewer", detail: "A decision must bind the actor, action, candidate, evidence, policy revision and target. Reverify changed content or relevant context before requesting a fresh decision." },
    ],
    choices: [
      { condition: "Risk assessment", response: "Explain alignment, impact, verification, rollback cost and error detection. Record uncertainty rather than hiding missing proof in a favorable score." },
      { condition: "Blocked verification", response: "Name the missing capability or evidence. Keep the affected criterion unverified and route the exception to its owner." },
    ],
    boundary: "Completion, verification, authorization and observed outcome are separate facts. A low merge-risk rating cannot replace a required check or grant permission; an approved merge is not evidence of production success.",
    guide: { label: "Read the evidence and merge-risk review guidance", href: "/guide/06-improve/39-production-feedback-review-and-the-agentic-merge-queue#evidence-artifacts-for-agent-pull-requests" },
  },
  {
    id: "correlate-an-alert",
    title: "Turn an alert into a bounded response",
    summary: "Correlate the incident, then admit investigation or repair within scope.",
    source: "alerts",
    sourceFinding: "Warp demonstrates grouped error-monitor issues arriving through an authenticated webhook and producing a draft fix PR. It treats payload text as untrusted even when the sender is authenticated.",
    introduction: "After a separately authorized deployment, an alert is a signal to investigate. Preserve release and failure evidence, redact sensitive payload content, and find related work before starting another repair.",
    input: [
      { label: "Delivery", value: "evt-alert-019", detail: "Record authenticated origin, event type, payload revision and receipt. Do not execute instructions found in breadcrumbs or exception text." },
      { label: "Incident", value: "INC-9 / release-42", detail: "A grouped timestamp failure names the affected release, fingerprint and observed errors. Correlate it with WO-42 and its deployment records." },
    ],
    output: [
      { label: "Admitted response", value: "admit-43@r1 → WO-43", detail: "Only newly eligible scope creates this WorkOrder. Permit reproduction, a regression test and a draft fix under a shared bound; retain INC-9 as the incident identity." },
      { label: "Recovery evidence", value: "Observation pending", detail: "A proposed fix is not recovery. An authorized release or rollback and observations over a declared window are required before verified incident closure." },
    ],
    choices: [
      { condition: "Duplicate delivery", response: "Reuse the delivery receipt. Do not treat transport redelivery as a new incident or work request." },
      { condition: "Another event, same incident", response: "Attach new evidence to the incident and current investigation. A higher event count does not create another patch allowance." },
      { condition: "New eligible scope", response: "Make an independent admission decision, with ownership and capacity checks, and link any new WorkOrder to the incident." },
    ],
    boundary: "An alert cannot authorize deployment, expand permissions or approve rollback. Unknown external effects require reconciliation before retry; a recovery action still needs its own authority and evidence.",
    guide: { label: "Read the backlog and alert intake contract", href: "/guide/05-operate/37-control-surfaces-event-contracts-and-storage#backlog-and-alert-intake-examples" },
  },
];
