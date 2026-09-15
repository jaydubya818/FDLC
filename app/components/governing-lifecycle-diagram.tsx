import { governingLifecycle } from "../../data/governing-lifecycle";

export function GoverningLifecycleDiagram() {
  return (
    <figure className="governing-lifecycle" aria-label="FDLC governing lifecycle">
      <figcaption>
        <p className="section-label">The FDLC governing lifecycle</p>
        <h2>From intent to outcomes. From outcomes to learning.</h2>
        <p>One connected lifecycle makes the work, its proof, and the authority to proceed explicit.</p>
      </figcaption>
      <ol>
        {governingLifecycle.map((step, index) => (
          <li key={step.name}>
            <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <h3>{step.name}</h3>
            <p>{step.detail}</p>
          </li>
        ))}
      </ol>
      <p className="governing-feedback">↳ Learning informs the next intent and plan. Changes return through the same verification and approval controls.</p>
    </figure>
  );
}
