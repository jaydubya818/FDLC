export function CorpusStatus({ compact = false }: { compact?: boolean }) {
  return (
    <aside className={`corpus-status${compact ? " is-compact" : ""}`} aria-label="Corpus preview status">
      <strong>Draft corpus preview</strong>
      {!compact && <p>This material is under review. It is not the canonical FDLC site or a qualified standard release.</p>}
    </aside>
  );
}
