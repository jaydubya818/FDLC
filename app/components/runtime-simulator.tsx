"use client";
import { useRef, useState } from "react";
import { applyFix, artifactChain, decideRun, faults, nextArtifact, runStatus, runToEnd, scenarioRun, stepRun, toggleFault, type Scenario, type SimRun } from "../../lib/runtime-simulator";

const scenarios = [["happy", "Verified local outcome", "Follow the bounded API fix."], ["recovery", "Failed verification + recovery", "Keep failed evidence; correct and re-verify."], ["human", "Human approval required", "Passing tests cannot authorize production."]] as const;
const statusText = { "not-started": "Not started", "in-progress": "In progress", blocked: "Blocked", "awaiting-approval": "Awaiting human approval", denied: "Denied — safely stopped", complete: "Complete — sample only" } as const;

export function RuntimeSimulator() {
  const [scenario, setScenario] = useState<Scenario>("happy");
  const [run, setRun] = useState<SimRun>(() => scenarioRun("happy"));
  const [selected, setSelected] = useState(0);
  const statusRef = useRef<HTMLDivElement>(null);
  const status = runStatus(run);
  const next = nextArtifact(run);
  const stage = artifactChain[selected];
  const stopped = ["blocked", "awaiting-approval", "denied", "complete"].includes(status);
  const started = run.completed.length > 0 || run.blocked !== null;
  const inspectedState = run.completed.includes(stage.id) ? "Recorded" : run.blocked?.at === stage.id ? "Blocked" : stage.id === next ? "Next" : "Not reached";

  function advance(all = false) {
    const updated = all ? runToEnd(run) : stepRun(run);
    setRun(updated);
    const id = updated.blocked?.at ?? nextArtifact(updated) ?? "outcome";
    setSelected(artifactChain.findIndex((item) => item.id === id));
  }
  function reset(value: Scenario) { setScenario(value); setRun(scenarioRun(value)); setSelected(0); }
  function resolve(approved: boolean) { setRun((current) => decideRun(current, approved)); statusRef.current?.focus(); }

  return <section className="simulator factory-experience" aria-labelledby="simulator-title">
    <header className="experience-heading"><div><p className="section-label">Deterministic demonstration / API repair</p><h2 id="simulator-title" className="simulator-title">One objective. Inspect every boundary.</h2></div><p>Precomputed sample records. No accounts, live agents, external calls or production permissions. The executable counterpart is in the <a href="/lab">Reference Lab →</a></p></header>
    <fieldset className="experience-scenarios"><legend>Choose a scenario</legend><div>{scenarios.map(([value, title, description]) => <label aria-label={title} key={value} className={scenario === value ? "is-selected" : ""}><input type="radio" name="scenario" value={value} checked={scenario === value} onChange={() => reset(value)} /><span><strong>{title}</strong><small>{description}</small></span></label>)}</div><p>Choosing a scenario resets this sample run.</p></fieldset>
    <form className="experience-intent" onSubmit={(event) => { event.preventDefault(); advance(); }}>
      <label htmlFor="sample-intent">Bounded sample intent</label><input id="sample-intent" readOnly value="Fix GET /sum: 2 + 3 must return 5. Preserve 400 and 404 responses." />
      <button type="submit" className="button button-dark" disabled={started}>Submit sample intent</button>
    </form>
    <details className="experience-extra-faults"><summary>Explore additional failure boundaries</summary><fieldset className="simulator-faults" disabled={started}><legend>Inject faults before execution</legend><div>{faults.map((fault) => <label key={fault.id} className={run.active.includes(fault.id) ? "is-selected" : ""}><input type="checkbox" checked={run.active.includes(fault.id)} onChange={() => setRun((current) => toggleFault(current, fault.id))} /><span>{fault.label}</span></label>)}</div><p>Reset to change faults after submission.</p></fieldset></details>

    <div className="experience-workspace">
      <nav className="experience-timeline" aria-label="Execution timeline"><ol>{artifactChain.map((item, index) => {
        const state = run.completed.includes(item.id) ? "recorded" : run.blocked?.at === item.id ? "blocked" : item.id === next ? "next" : "waiting";
        return <li key={item.id}><button type="button" aria-current={selected === index ? "step" : undefined} onClick={() => setSelected(index)}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.name}</strong><small className={`is-${state}`}>{state}</small></button></li>;
      })}</ol></nav>
      <article className="experience-stage" aria-labelledby="inspected-stage-title">
        <p className="section-label">Step {selected + 1} / {artifactChain.length} · {inspectedState}</p><h3 id="inspected-stage-title">{stage.name}</h3><p className="experience-stage-lede">{stage.meaning}</p>
        <dl>{[["Responsible component", stage.producer], ["Required inputs", stage.inputs], ["Authority boundary", stage.authority], ["Expected record", stage.evidence], ["What could fail", stage.failure], ["What happens next", stage.next]].map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <p className="experience-sample-note">Expected records describe the teaching scenario. Inspect the ledger below to see what this run has actually reached.</p>
        <a className="text-action" href={stage.guide}>Read the governing Guide chapter →</a>
        <div className="experience-inspection-nav"><button type="button" disabled={selected === 0} onClick={() => setSelected((value) => value - 1)}>← Previous step</button><button type="button" disabled={selected === artifactChain.length - 1} onClick={() => setSelected((value) => value + 1)}>Next step →</button></div>
      </article>
    </div>
    <div className="simulator-actions"><button className="button button-dark" disabled={stopped || !started} onClick={() => advance()} type="button">Produce next artifact</button><button className="button button-light" disabled={stopped || !started} onClick={() => advance(true)} type="button">Run to the next boundary</button><button className="button button-light" onClick={() => reset(scenario)} type="button">Reset</button></div>
    <div className={`simulator-result is-${status}`} ref={statusRef} tabIndex={-1}>
      <p className="section-label" role="status" aria-live="polite">Run status: {statusText[status]}</p>
      {status === "blocked" && run.blocked && <><h3>Progression blocked. Evidence stays available.</h3><dl><div><dt>What happened</dt><dd>{run.blocked.reason}</dd></div><div><dt>The rule</dt><dd>{run.blocked.rule}</dd></div><div><dt>Recovery</dt><dd>{run.blocked.fix}</dd></div></dl><button className="button button-light" disabled={run.blocked.recoverable === false} type="button" onClick={() => { setRun(applyFix(run, run.blocked!.fault)); setSelected(artifactChain.findIndex((item) => item.id === (run.blocked!.fault === "failed-verification" || run.blocked!.fault === "authority-exceeded" ? "attempt" : "verification"))); statusRef.current?.focus(); }}>Apply the fix and continue</button></>}
      {status === "awaiting-approval" && <><h3>Verified does not mean authorized.</h3><p>The requested production action exceeds this profile&apos;s local completion grant. Only the accountable human can decide. These buttons simulate that decision; neither performs a release.</p><div className="simulator-actions"><button type="button" className="button button-dark" onClick={() => resolve(true)}>Record sample human approval</button><button type="button" className="button button-light" onClick={() => resolve(false)}>Reject sample request</button></div></>}
      {status === "denied" && <h3>Human decision: denied. Candidate and evidence retained. No release.</h3>}
      {status === "complete" && <h3>Verified sample outcome recorded. No software was published or deployed. Next: reproduce these boundaries in the Reference Lab.</h3>}
      {status === "not-started" && <h3>Submit the sample intent to begin.</h3>}
      {status === "in-progress" && <h3>{artifactChain.length - run.completed.length} steps remain. Continue until verification or authority requires a decision.</h3>}
    </div>

    <section className="experience-records" aria-labelledby="records-title"><h3 id="records-title">Inspect this run&apos;s records</h3>
      <details open><summary>WorkOrder + Factory Version</summary>{run.completed.includes("work-order") ? <dl><div><dt>WorkOrder / Plan</dt><dd>WO-API-1 / PLAN-API-1 revision 1</dd></div><div><dt>Acceptance contract</dt><dd>AC-1 sum=5 · AC-2 invalid input=400 · AC-3 unknown path=404</dd></div><div><dt>Tasks / scope</dt><dd>TASK-FIX-1 → TASK-VERIFY-1 · producer writes src/add.js only</dd></div><div><dt>Factory / qualification</dt><dd>{run.completed.includes("selection") ? "api-fix@1.0.0 · Q-API-1 synthetic local fixture; not a real qualification receipt" : "Selection not reached"}</dd></div></dl> : <p>No WorkOrder yet. Submit intent, then advance through Plan.</p>}</details>
      <details open><summary>Attempts + artifacts</summary>{run.completed.includes("attempt") || run.blocked?.at === "attempt" ? <dl><div><dt>Producer Attempt</dt><dd>ATT-P-{run.attempt} / producer-1 / scripted-local-v1</dd></div><div><dt>Candidate</dt><dd>{run.candidate} (synthetic identifier) · {run.completed.includes("candidate") ? "frozen sample artifact" : "not yet frozen"}</dd></div><div><dt>Change</dt><dd>{run.active.includes("failed-verification") ? "Faulty correction: GET /sum returns -1; verification must reject it." : "src/add.js: replace subtraction with addition."}</dd></div><div><dt>Environment / tools</dt><dd>Browser state machine; no model, harness process, network access or file writes.</dd></div></dl> : <p>No Attempt yet. Routing must finish before execution.</p>}</details>
      <details open><summary>Verification + evidence ({run.evidence.length} records)</summary>{run.evidence.length === 0 ? <p>No evidence recorded. Missing evidence cannot be treated as passing.</p> : <ol className="experience-evidence">{run.evidence.map((record) => <li key={record.id}><strong>{record.id} · {record.result}</strong><p>{record.producerAttempt} → {record.verifierAttempt} / {record.verifier} · Candidate <code>{record.candidate}</code></p><ul>{record.criteria.map(([criterion, result]) => <li key={criterion}>{criterion}: <b>{result}</b></li>)}</ul><p>{record.reason}</p></li>)}</ol>}</details>
      <details open><summary>Policy decision + final disposition</summary><p>{status === "blocked" ? "DENY progression: a required boundary failed. The Candidate is not eligible." : status === "awaiting-approval" ? "PENDING HUMAN: production authority is absent; passing checks cannot supply it." : status === "denied" ? "DENY: human rejected the requested action. Terminal controlled stop." : status === "complete" ? "ALLOW bounded sample completion. Publication, merge, release and production verification did not occur." : "No final decision. Work and verification are incomplete."}</p><p>Operating domain: one synthetic API fixture. Isolation, provider compatibility, production reliability and costs are unmeasured.</p></details>
    </section>
    <details className="simulator-log"><summary>Execution event log ({run.log.length})</summary><ol>{run.log.map((entry, index) => <li key={index}>{entry}</li>)}</ol></details>
  </section>;
}
