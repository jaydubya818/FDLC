"use client";

import { useId, useState } from "react";
import { governingLifecycle } from "../../data/governing-lifecycle";

export function GoverningLifecycleDiagram() {
  const [selected, setSelected] = useState(0);
  const panelId = useId();
  const step = governingLifecycle[selected];
  return (
    <figure className="governing-lifecycle" aria-label="FDLC governing lifecycle">
      <figcaption>
        <p className="section-label">The FDLC governing lifecycle</p>
        <h2>Follow the work. Inspect the controls.</h2>
        <p>Select a stage to see what enters, what leaves, and what permits the work to move forward.</p>
      </figcaption>
      <div className="governing-explorer">
      <div className="governing-orbit">
        <svg className="governing-track" viewBox="0 0 500 500" aria-hidden="true">
          <circle cx="250" cy="250" r="184" fill="none" stroke="currentColor" strokeWidth="2" />
          {governingLifecycle.map((item, index) => <path key={item.name} d="M 259 66 l -9 -5 l 0 10 Z" fill="currentColor" transform={`rotate(${index * 40 + 20} 250 250)`} />)}
          <circle cx="250" cy="250" r="113" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 7" opacity=".3" />
        </svg>
        <div className="governing-center" aria-hidden="true"><span>FDLC</span><strong>Work earns<br />progression.</strong><small>9 stages · one feedback loop</small></div>
      <ol aria-label="Select a lifecycle stage">
        {governingLifecycle.map((step, index) => (
          <li key={step.name} style={{ left: `${(50 + 36.8 * Math.sin(index * Math.PI * 2 / 9)).toFixed(4)}%`, top: `${(50 - 36.8 * Math.cos(index * Math.PI * 2 / 9)).toFixed(4)}%` }}>
            <h3><button type="button" aria-pressed={selected === index} aria-controls={panelId} onClick={() => setSelected(index)}>
              <span className="governing-node" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <span>{step.name}</span>
            </button></h3>
          </li>
        ))}
      </ol>
      </div>
      <div className="governing-inspector">
        <div id={panelId} aria-live="polite" aria-atomic="true">
          <p className="section-label">Stage {String(selected + 1).padStart(2, "0")} / 09</p>
          <h4>{step.name}</h4><p className="governing-purpose">{step.detail}</p>
          <dl className="governing-artifacts"><div><dt>Input</dt><dd>{step.input}</dd></div><div><dt>Output</dt><dd>{step.output}</dd></div></dl>
          <div className="governing-control"><strong>Control at this stage</strong><p>{step.control}</p></div>
          <div className="governing-example"><strong>Example · dependency upgrade</strong><p>{step.example}</p></div>
        </div>
        <nav aria-label="Walk through the lifecycle"><button type="button" onClick={() => setSelected((selected + 8) % 9)}>← Previous stage</button><button type="button" onClick={() => setSelected((selected + 1) % 9)}>{selected === 8 ? "Return to Intent ↺" : "Next stage →"}</button></nav>
      </div>
      </div>
      <p className="governing-feedback"><span aria-hidden="true">↺</span><span><strong>Learning closes the loop.</strong> Improvements return through verification and approval. This explorer illustrates the lifecycle; it does not execute work or grant authority.</span></p>
    </figure>
  );
}
