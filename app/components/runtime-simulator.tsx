"use client";

import { useState } from "react";
import { applyFix, artifactChain, faults, newRun, nextArtifact, runStatus, runToEnd, stepRun, toggleFault, type FaultId, type SimRun } from "../../lib/runtime-simulator";

const statusText = { "not-started": "Not started", "in-progress": "In progress", blocked: "Blocked", complete: "Complete" } as const;

export function RuntimeSimulator() {
  const [run, setRun] = useState<SimRun>(() => newRun());
  const status = runStatus(run);
  const next = nextArtifact(run);
  const started = run.completed.length > 0 || run.blocked !== null;

  return <section className="simulator" aria-labelledby="simulator-title">
    <h2 id="simulator-title" className="simulator-title">Run one unit of work</h2>
    <fieldset className="simulator-faults" disabled={started}>
      <legend>Inject a fault before you start</legend>
      <div>{faults.map((fault) => <label key={fault.id} className={run.active.includes(fault.id) ? "is-selected" : ""}>
        <input checked={run.active.includes(fault.id)} onChange={() => setRun((current) => toggleFault(current, fault.id))} type="checkbox" />
        <span>{fault.label}</span>
      </label>)}</div>
      {started && <p>Reset to change the faults.</p>}
    </fieldset>

    <ol className="simulator-chain" aria-label="Artifact chain">
      {artifactChain.map((item) => {
        const done = run.completed.includes(item.id);
        const blocked = run.blocked?.at === item.id;
        const state = done ? "produced" : blocked ? "blocked" : item.id === next ? "next" : "waiting";
        return <li className={`is-${state}`} key={item.id}>
          <span className="simulator-state">{state}</span>
          <strong>{item.name}</strong>
          <small>{item.producer}</small>
          <p>{item.meaning}</p>
        </li>;
      })}
    </ol>

    <div className="simulator-actions">
      <button className="button button-dark" disabled={status === "blocked" || status === "complete"} onClick={() => setRun((current) => stepRun(current))} type="button">Produce next artifact</button>
      <button className="button button-light" disabled={status === "blocked" || status === "complete"} onClick={() => setRun((current) => runToEnd(current))} type="button">Run to the end</button>
      <button className="button button-light" onClick={() => setRun(newRun())} type="button">Reset</button>
    </div>

    <div className={`simulator-result is-${status}`} role="status" aria-live="polite">
      <p className="section-label">Run status: {statusText[status]}</p>
      {status === "blocked" && run.blocked && <>
        <h3>Blocked at {artifactChain.find((item) => item.id === run.blocked!.at)!.name}. The factory stopped, and that is the correct result.</h3>
        <dl>
          <div><dt>What happened</dt><dd>{run.blocked.reason}</dd></div>
          <div><dt>The rule</dt><dd>{run.blocked.rule}</dd></div>
          <div><dt>What fixes it</dt><dd>{run.blocked.fix}</dd></div>
        </dl>
        <button className="button button-light" onClick={() => setRun((current) => applyFix(current, run.blocked!.fault as FaultId))} type="button">Apply the fix and continue</button>
      </>}
      {status === "complete" && <h3>Every artifact was produced by the right actor, in order, with current evidence. Only now is the outcome recorded.</h3>}
      {status === "not-started" && <h3>Nothing has been produced. Choose faults, or just step through the happy path.</h3>}
      {status === "in-progress" && <h3>{artifactChain.length - run.completed.length} artifacts remain. Each one must earn its state.</h3>}
    </div>

    <details className="simulator-log">
      <summary>Event log ({run.log.length})</summary>
      <ol>{run.log.map((entry, index) => <li key={index}>{entry}</li>)}</ol>
    </details>
  </section>;
}
