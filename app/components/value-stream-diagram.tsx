import { guideValueStream } from "../../data/fdlc";

export function ValueStreamDiagram({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={detailed ? "runtime-track is-detailed" : "runtime-track"} aria-label="Software factory value stream">
      {guideValueStream.map((stage) => (
        <li id={detailed ? `value-stream-${stage.id}` : undefined} key={stage.id}>
          <span>{String(stage.number).padStart(2, "0")} / Guide stage</span>
          <strong>{stage.name}</strong>
          {detailed && <p>{stage.purpose}</p>}
        </li>
      ))}
    </ol>
  );
}
