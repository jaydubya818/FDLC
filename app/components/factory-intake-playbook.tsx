/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes require document navigation across the microfrontend boundary. */
import { factoryIntakeExamples, warpPracticeSources, type IntakeExampleField } from "../../data/warp-practice";
import "./factory-intake-playbook.css";

function ExampleRecord({ title, fields }: { title: string; fields: readonly IntakeExampleField[] }) {
  return <div className="intake-playbook-record">
    <h3>{title}</h3>
    <dl>{fields.map((field) => <div key={field.label}>
      <dt>{field.label}</dt>
      <dd><strong>{field.value}</strong><span>{field.detail}</span></dd>
    </div>)}</dl>
  </div>;
}

export function FactoryIntakePlaybook() {
  return <section className="intake-playbook" id="intake-to-review" aria-labelledby="intake-playbook-title">
    <h2 id="intake-playbook-title">From intake to a reviewable change</h2>
    <p className="intake-playbook-intro">Follow one API repair through issue admission, intent, evidence and a later runtime alert. Keep the request, work, candidate and incident identities distinct at each handoff.</p>
    <p className="intake-playbook-note"><strong>FDLC design examples.</strong> These illustrative records explain contracts. They are not executable schemas or connected integrations; no tracker, agent or job runs here.</p>

    <div className="intake-playbook-examples">{factoryIntakeExamples.map((example) => {
      const source = warpPracticeSources[example.source];
      return <details className="intake-playbook-example" key={example.id} id={example.id}>
        <summary><span><strong>{example.title}</strong><span>{example.summary}</span></span><i className="intake-playbook-toggle" aria-hidden="true" /></summary>
        <div className="intake-playbook-body">
          <p className="intake-playbook-provenance">{example.sourceFinding} <a href={source.url}>Warp lesson: {source.title}</a>.</p>
          <p>{example.introduction}</p>
          <div className="intake-playbook-records">
            <ExampleRecord title="Input record" fields={example.input} />
            <ExampleRecord title="Output record" fields={example.output} />
          </div>
          {example.choices && <dl className="intake-playbook-choices">{example.choices.map((choice) => <div key={choice.condition}>
            <dt>{choice.condition}</dt><dd>{choice.response}</dd>
          </div>)}</dl>}
          <p className="intake-playbook-boundary">{example.boundary}</p>
          <a className="intake-playbook-guide" href={example.guide.href}>{example.guide.label} <span aria-hidden="true">→</span></a>
        </div>
      </details>;
    })}</div>

    <footer className="intake-playbook-sources">
      <p>Adapted from Warp&apos;s practical lessons. <a href={warpPracticeSources.hello.url}>Hello factory</a> introduces the implementation and handoff workflow. The examples above apply FDLC admission, evidence and authority contracts; no vendor is required.</p>
      <ul aria-label="Warp practice lesson sources">{Object.values(warpPracticeSources).map((source) => <li key={source.url}><a href={source.url}>{source.title}</a></li>)}</ul>
      <a className="intake-playbook-guide" href="/guide/appendix/engineering-experience#calibrate-the-first-backlog-batch">Calibrate a first batch before expanding the backlog <span aria-hidden="true">→</span></a>
    </footer>
  </section>;
}
