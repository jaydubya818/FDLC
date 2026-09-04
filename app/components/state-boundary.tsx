type StateBoundaryMode = "compact" | "primary" | "mission-control";

const stateMeanings = [
  ["Completion", "An agent finishing its Attempt is only a claim."],
  ["Verification", "An independent, evidence-bound decision against the exact subject."],
  ["Approval", "A human—or explicitly delegated—consequential judgment."],
  ["Release", "Controlled promotion of one exact accepted artifact."],
  ["Outcome", "The result observed in reality after release."],
] as const;

export function StateBoundary({ dark = false, eyebrow, mode = "compact" }: { dark?: boolean; eyebrow?: string; mode?: StateBoundaryMode }) {
  if (mode === "mission-control") return (
    <aside className={dark ? "state-boundary is-dark is-mission-control" : "state-boundary is-mission-control"} aria-labelledby="mission-control-boundary-title">
      <div>
        <p className="section-label">Separate records in Mission Control</p>
        <h2 id="mission-control-boundary-title">Attempt completion → Quality Gate Decision → Human Acceptance → Release → Outcome.</h2>
      </div>
      <p className="state-boundary-explanation">No single actor can advance more than one boundary without the required evidence and authority.</p>
      <p className="state-boundary-sequence" aria-label="Execution complete is not verification passed, is not approved, is not released, and is not outcome proven." role="group">
        <strong>Execution complete</strong><span aria-hidden="true">≠</span><strong>Verified</strong><span aria-hidden="true">≠</span><strong>Approved</strong><span aria-hidden="true">≠</span><strong>Released</strong><span aria-hidden="true">≠</span><strong>Outcome proven</strong>
      </p>
    </aside>
  );

  return (
    <aside className={`${dark ? "state-boundary is-dark" : "state-boundary"}${mode === "primary" ? " is-primary" : ""}`} aria-labelledby="state-boundary-title">
      <div>
        <p className="section-label">{eyebrow ?? "Non-collapsible states"}</p>
        <h2 id="state-boundary-title">Execution complete ≠ Verified ≠ Approved ≠ Released ≠ Outcome proven</h2>
      </div>
      <p className="state-boundary-explanation">Each transition answers a different question and requires distinct authority. Collapsing them creates false confidence and unauditable releases.</p>
      {mode === "primary" ? <>
        <div className="state-boundary-meanings">{stateMeanings.map(([name, meaning]) => <article key={name}><strong>{name}</strong><p>{meaning}</p></article>)}</div>
        <p className="state-boundary-warning">Collapsing any boundary turns a governed factory into optimistic automation.</p>
      </> : <p className="state-boundary-sequence" aria-label="Execution complete is not verification passed, is not approved, is not released, and is not outcome proven." role="group">
        <strong>Execution complete</strong><span aria-hidden="true">≠</span><strong>Verified</strong><span aria-hidden="true">≠</span><strong>Approved</strong><span aria-hidden="true">≠</span><strong>Released</strong><span aria-hidden="true">≠</span><strong>Outcome proven</strong>
      </p>}
    </aside>
  );
}
