import { protocolSteps } from "../../data/fdlc";
import { ResponsiveDetails } from "./responsive-details";

export function ProtocolDiagram({ detailed = false }: { detailed?: boolean }) {
  return (
    <ol className={detailed ? "protocol-track is-detailed" : "protocol-track"} aria-label="FDLC governed execution protocol">
      {protocolSteps.map((step) => detailed ? (
        <li key={step.id}>
          <ResponsiveDetails className="model-disclosure">
            <summary><span>{String(step.number).padStart(2, "0")}</span><strong>{step.name}</strong><small>Expand</small></summary>
            <div className="model-disclosure-body"><p>{step.question}</p><em>{step.requiredProof}</em></div>
          </ResponsiveDetails>
        </li>
      ) : (
        <li key={step.id}><span>{String(step.number).padStart(2, "0")}</span><strong>{step.name}</strong></li>
      ))}
    </ol>
  );
}
