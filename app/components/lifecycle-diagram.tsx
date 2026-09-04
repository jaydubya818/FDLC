import Link from "next/link";
import { factoryControls, lifecycleStages } from "../../data/fdlc";
import { ResponsiveDetails } from "./responsive-details";

export function LifecycleDiagram({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className={detailed ? "lifecycle-system is-detailed" : "lifecycle-system"}>
      <ol className={detailed ? "lifecycle-track is-detailed" : "lifecycle-track"} aria-label="Factory Development Lifecycle stages">
        {lifecycleStages.map((stage) => detailed ? (
          <li id={stage.id} key={stage.id}>
            <ResponsiveDetails className="model-disclosure">
              <summary><span>{String(stage.number).padStart(2, "0")}</span><strong>{stage.name}</strong><small>Expand</small></summary>
              <div className="model-disclosure-body"><p>{stage.purpose}</p><ul>{stage.activities.map((activity) => <li key={activity}>{activity}</li>)}</ul><em>Output · {stage.output}</em></div>
            </ResponsiveDetails>
          </li>
        ) : (
          <li key={stage.id}><Link href={`/framework#${stage.id}`}><span>{String(stage.number).padStart(2, "0")}</span><strong>{stage.name}</strong></Link></li>
        ))}
      </ol>
      <div className="lifecycle-controls" aria-label="Continuous factory controls" role="group">
        <span>Continuous controls</span>
        {factoryControls.map((control) => <article key={control.name}><strong>{control.name}</strong>{detailed && <p>{control.purpose}</p>}</article>)}
      </div>
    </div>
  );
}
