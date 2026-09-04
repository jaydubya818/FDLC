import { runtimeLifecycle } from "../../data/fdlc";

export function RuntimeLifecycleDiagram({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={detailed ? "runtime-track is-detailed" : "runtime-track"} aria-label="Autonomous software delivery lifecycle">
      {runtimeLifecycle.map((step) => (
        <li id={detailed ? `runtime-${step.id}` : undefined} key={step.id}>
          <span>{String(step.number).padStart(2, "0")} / {step.artifact}</span>
          <strong>{step.name}</strong>
          {detailed && <p>{step.purpose}</p>}
        </li>
      ))}
    </ol>
  );
}
