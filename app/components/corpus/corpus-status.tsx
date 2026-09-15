export function CorpusStatus({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`corpus-status${compact ? " is-compact" : ""}`} aria-label="Learning Library preview status">
      <strong>{compact ? "Learning Library Preview" : "Review candidate — not FDLC canon"}</strong>
      {!compact && <p>Explore and test this material while it is reviewed. Existing FDLC pages remain authoritative until individual routes are approved for promotion.</p>}
    </aside>
  );
}
