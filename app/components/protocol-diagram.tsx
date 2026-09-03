import { protocolSteps } from "../../data/fdlc";

export function ProtocolDiagram({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={detailed ? "protocol-track is-detailed" : "protocol-track"} aria-label="FDLC governed execution protocol">
      {protocolSteps.map((step) => (
        <li key={step.id}>
          <span>{String(step.number).padStart(2, "0")}</span>
          <strong>{step.name}</strong>
          {detailed && <><p>{step.question}</p><small>{step.requiredProof}</small></>}
        </li>
      ))}
    </ol>
  );
}

