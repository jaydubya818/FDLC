import Link from "next/link";
import { lifecycleStages } from "../../data/fdlc";

export function LifecycleDiagram({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={detailed ? "lifecycle-track is-detailed" : "lifecycle-track"} aria-label="Factory Development Lifecycle stages">
      {lifecycleStages.map((stage) => (
        <li id={detailed ? stage.id : undefined} key={stage.id}>
          <Link href={`/framework#${stage.id}`}>
            <span>{String(stage.number).padStart(2, "0")}</span>
            <strong>{stage.name}</strong>
            {detailed && <><p>{stage.purpose}</p><small>Output · {stage.output}</small></>}
          </Link>
        </li>
      ))}
    </ol>
  );
}

