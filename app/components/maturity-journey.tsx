"use client";

import { useId, useState } from "react";
import { maturityLevels } from "../../data/fdlc";

export function MaturityJourney() {
  const [selected, setSelected] = useState(0);
  const panelId = useId();
  const level = maturityLevels[selected];
  return <div className="maturity-journey">
    <ol aria-label="Explore maturity levels">
      {maturityLevels.map((item) => <li key={item.level}>
        <button type="button" aria-pressed={selected === item.level} aria-controls={panelId} onClick={() => setSelected(item.level)}>
          <span className="maturity-bar" style={{ height: `${24 + item.level * 14}px` }} aria-hidden="true"><b>L{item.level}</b></span>
          <strong>{item.name}</strong>
        </button>
      </li>)}
    </ol>
    <div className="maturity-level-detail" id={panelId} aria-live="polite" aria-atomic="true">
      <div><p className="section-label">L{level.level} / Operating model</p><h3>{level.name}</h3><p>{level.description}</p></div>
      <dl><div><dt>What operates today</dt><dd>{level.operatingModel}</dd></div><div><dt>Next capability to earn</dt><dd>{level.nextMove}</dd></div></dl>
    </div>
    <p className="maturity-selection-note">Select a level to explore its controls. Your assessment score comes from the eleven dimensions below.</p>
  </div>;
}
