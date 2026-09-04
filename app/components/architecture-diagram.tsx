import Link from "next/link";
import { architectureAreas } from "../../data/fdlc";

export function ArchitectureDiagram({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "architecture-diagram is-compact" : "architecture-diagram"} aria-label="Six areas of the FDLC architecture" role="group">
      {architectureAreas.map((area) => (
        <Link className="architecture-node" href={`/architecture#${area.id}`} key={area.name}>
          <span>{String(area.number).padStart(2, "0")}</span>
          <strong>{area.name}</strong>
          <small>{area.short}</small>
        </Link>
      ))}
    </div>
  );
}
