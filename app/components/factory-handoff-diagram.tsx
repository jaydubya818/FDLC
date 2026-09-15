import { factoryHandoff } from "../../data/factory-handoff";

export function FactoryHandoffDiagram({ builder = false }: { builder?: boolean }) {
  return <figure className="factory-handoff-diagram" aria-label="From Factory Definition to Factory Version">
    <figcaption><span className="section-label">Design → qualification</span><h2>{factoryHandoff.title}</h2><p>{factoryHandoff.description}</p></figcaption>
    <ol>{factoryHandoff.steps.map((step, index) => <li key={step.title}>
      <span className="handoff-number" aria-hidden="true">0{index + 1}</span>
      <p className="handoff-owner">{step.owner}</p><h3>{step.title}</h3><p>{step.detail}</p><strong>{step.state}</strong>
    </li>)}</ol>
    {builder && <p className="handoff-boundary">{factoryHandoff.boundary}</p>}
  </figure>;
}
