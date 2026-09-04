import Link from "next/link";
import { factoryControls, lifecycleStages } from "../../data/fdlc";

export function LifecycleDiagram({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={detailed ? "lifecycle-system is-detailed" : "lifecycle-system"}>
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
      <div className="lifecycle-controls" aria-label="Continuous factory controls" role="group">
        <span>Continuous controls</span>
        {factoryControls.map((control) => <article key={control.name}><strong>{control.name}</strong>{detailed && <p>{control.purpose}</p>}</article>)}
      </div>
    </div>
  );
}
