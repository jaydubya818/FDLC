export function StateBoundary({ dark = false }: { dark?: boolean }) {
  return (
    <aside className={dark ? "state-boundary is-dark" : "state-boundary"} aria-labelledby="state-boundary-title">
      <div>
        <p className="section-label">Non-collapsible states</p>
        <h2 id="state-boundary-title">“Done” is not one state.</h2>
      </div>
      <p className="state-boundary-explanation">Each transition answers a different question and requires distinct authority. Collapsing them creates false confidence and unauditable releases.</p>
      <p className="state-boundary-sequence" aria-label="Execution complete is not verification passed, is not approved, is not released, and is not outcome proven." role="group">
        <strong>Execution complete</strong><span aria-hidden="true">≠</span><strong>Verified</strong><span aria-hidden="true">≠</span><strong>Approved</strong><span aria-hidden="true">≠</span><strong>Released</strong><span aria-hidden="true">≠</span><strong>Outcome proven</strong>
      </p>
    </aside>
  );
}
