import { contextSkillsPractices } from "../../data/context-skills-practices";

const stages = [
  { name: "Package", caption: "Version + owner", path: "M4 7 12 3 20 7 12 11 4 7Z M4 7v10l8 4 8-4V7 M12 11v10" },
  { name: "Evaluate", caption: "Tests + holdouts", path: "M9 3h6 M10 3v7L4 19q-1 2 2 2h12q3 0 2-2l-6-9V3 M7 16h10" },
  { name: "Authorize", caption: "Scope + policy", path: "M12 3 20 6v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z M8 12l3 3 5-6" },
  { name: "Observe", caption: "Runs + outcomes", path: "M3 12h4l3-7 4 14 3-7h4" },
] as const;

export function ContextSkillsMap() {
  return <div className="skills-explainer">
    <figure className="skills-map">
      <figcaption><span className="section-label">From skill to production dependency</span><h3>Every version has to earn its place.</h3></figcaption>
      <ol>{stages.map((stage, index) => <li key={stage.name}>
        <div className="skills-map-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={stage.path} /></svg></div>
        <div><span>0{index + 1}</span><strong>{stage.name}</strong><small>{stage.caption}</small></div>
      </li>)}</ol>
      <div className="skills-feedback"><span aria-hidden="true">↺</span><p>Observed failures become new test cases. Revisions repeat evaluation and authorization before rollout.</p></div>
      <p className="skills-boundary"><strong>Separate decisions:</strong> admitting a skill does not accept its work or authorize a release.</p>
    </figure>
    <div className="skills-practices"><p className="section-label">Inspect the five operating practices</p>
      {contextSkillsPractices.map((practice, index) => <details key={practice.number} open={index === 0}>
        <summary><span>{practice.number}</span><strong>{practice.title}</strong><span className="skills-disclosure" aria-hidden="true">+</span></summary>
        <div><p>{practice.purpose}</p><dl><div><dt>Apply it</dt><dd>{practice.practice}</dd></div><div><dt>Evidence</dt><dd>{practice.evidence}</dd></div><div><dt>Watch for</dt><dd>{practice.failure}</dd></div></dl></div>
      </details>)}
    </div>
  </div>;
}
