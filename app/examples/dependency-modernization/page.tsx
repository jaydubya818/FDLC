import type { Metadata } from "next";
import Link from "next/link";
import { PageContentsNav } from "../../components/page-contents-nav";
import { PageHero, SectionHeader } from "../../components/page-hero";
import { SiteShell } from "../../components/site-shell";
import { StateBoundary } from "../../components/state-boundary";
import { architectureAreas, factoryControls, lifecycleStages, protocolSteps, runtimeLifecycle } from "../../../data/fdlc";
import { dependencyModernizationExample as example } from "../../../data/dependency-modernization-example";
import { pageMetadata } from "../../../lib/metadata";

export const metadata: Metadata = pageMetadata("FDLC in 5 Minutes", "Follow one dependency-modernization factory line through the four FDLC system views, eleven durable artifacts, and one measurable outcome.", "/examples/dependency-modernization");

const contents = [
  { label: "Scope", href: "#scope" },
  { label: "Factory lifecycle", href: "#factory-lifecycle" },
  { label: "Runtime", href: "#runtime" },
  { label: "Architecture", href: "#architecture" },
  { label: "Artifacts", href: "#artifacts" },
  { label: "Measure", href: "#measure" },
] as const;

export default function DependencyModernizationExamplePage() {
  return <SiteShell><div className="page-wrap example-page">
    <PageHero eyebrow="FDLC in 5 minutes / Worked reference 01" status="Illustrative" title="One upgrade. Every boundary visible." description="Follow a bounded dependency-modernization factory line from its initial operating model through one governed software outcome. The same work is shown through all four FDLC views.">
      <div className="hero-actions"><a className="button button-dark" href="#runtime">Follow one run</a><Link className="button button-light" href="/mission-control">See Mission Control</Link></div>
    </PageHero>

    <div className="example-thesis" aria-label="One workflow, four system views, eleven artifacts, and one measurable outcome" role="group">
      <span>One workflow</span><strong>Four system views</strong><strong>Eleven artifacts</strong><strong>One measurable outcome</strong>
    </div>
    <PageContentsNav items={contents} />

    <section className="section-block example-scope" id="scope">
      <SectionHeader eyebrow="The bounded mission" title="Modernize a payment dependency without changing behavior." description="A useful factory line starts with an outcome and proof—not an instruction to an agent. This scenario uses concrete identifiers to make lineage visible; none represents a claimed customer result." />
      <div className="example-brief">
        <article className="example-intent">
          <span>INT-104 / Intent</span>
          <h3>{example.scope}</h3>
          <dl>
            <div><dt>Repository</dt><dd>checkout-api</dd></div>
            <div><dt>Risk class</dt><dd>Moderate · behavioral compatibility</dd></div>
            <div><dt>Release owner</dt><dd>Payments platform lead</dd></div>
            <div><dt>Factory version</dt><dd>dependency-modernization@1.0</dd></div>
          </dl>
        </article>
        <article className="example-criteria">
          <span>SPEC-104-R1 / Acceptance contract</span>
          <ol>{example.acceptanceCriteria.map((criterion, index) => <li key={criterion}><span>{String(index + 1).padStart(2, "0")}</span><p>{criterion}</p></li>)}</ol>
        </article>
      </div>
      <p className="example-disclaimer"><strong>{example.status}.</strong> {example.boundary}</p>
    </section>

    <StateBoundary />

    <section className="section-block" id="factory-lifecycle">
      <SectionHeader eyebrow="View 01 / Factory lifecycle" title="First, engineer the line that will do the work." description="These stages happen at factory level. They establish whether this class of work is worth automating, how it will be controlled, and when a validated factory version may operate." />
      <ol className="example-factory-stages">
        {example.factoryStages.map((item) => {
          const stage = lifecycleStages.find((candidate) => candidate.id === item.stageId);
          if (!stage) return null;
          return <li key={item.stageId}><span>{String(stage.number).padStart(2, "0")}</span><div><h3>{stage.name}</h3><p>{item.action}</p><small>Output · {item.output}</small></div></li>;
        })}
      </ol>
      <div className="example-controls"><span>Across every stage</span>{factoryControls.map((control) => <strong key={control.name}>{control.name}</strong>)}</div>
    </section>

    <section className="example-runtime-section" id="runtime">
      <div className="example-inner">
        <SectionHeader eyebrow="View 02 / Runtime lifecycle" title="Then, run one software change through the operating factory." description="The runtime verbs move the work. The artifact links point to the durable records that make each transition attributable and reviewable." />
        <ol className="example-runtime-ledger">
          {example.runtimeSteps.map((item) => {
            const step = runtimeLifecycle.find((candidate) => candidate.id === item.stepId);
            if (!step) return null;
            return <li key={item.stepId}><span>{String(step.number).padStart(2, "0")}</span><h3>{step.name}</h3><p>{item.action}</p><div>{item.artifacts.map((artifactId) => {
              const artifact = protocolSteps.find((candidate) => candidate.id === artifactId);
              return artifact ? <a href={`#artifact-${artifact.id}`} key={artifact.id}>{artifact.name} ↓</a> : null;
            })}</div></li>;
          })}
        </ol>
      </div>
    </section>

    <section className="section-block" id="architecture">
      <SectionHeader eyebrow="View 03 / Architecture" title="Six capability areas participate in the same run." description="No single agent owns the outcome. Each architectural area contributes a distinct responsibility and maps to concrete Mission Control records or decisions." />
      <div className="example-architecture-grid">
        {example.architecture.map((item) => {
          const area = architectureAreas.find((candidate) => candidate.id === item.areaId);
          if (!area) return null;
          return <article key={item.areaId}><span>{String(area.number).padStart(2, "0")} / {area.name}</span><h3>{area.short}</h3><p>{item.contribution}</p><dl><dt>Mission Control</dt><dd>{item.missionControl}</dd></dl><div><Link href={`/architecture#${area.id}`}>Architecture →</Link><Link href={item.guideHref}>Guide →</Link></div></article>;
        })}
      </div>
      <p className="example-evidence-link">Implementation status remains capability-specific. <Link href="/mission-control#capabilities">Inspect the current Mission Control maturity ledger →</Link></p>
    </section>

    <section className="example-artifacts-section" id="artifacts">
      <div className="example-inner">
        <SectionHeader eyebrow="View 04 / Artifact protocol" title="Eleven records preserve what happened and why." description="These are representative semantic records, not a finalized wire format. Implementations may add records, but they cannot collapse the authority and evidence boundaries between them." />
        <ol className="example-artifact-ledger">
          {example.artifacts.map((item) => {
            const artifact = protocolSteps.find((candidate) => candidate.id === item.protocolId);
            if (!artifact) return null;
            return <li id={`artifact-${artifact.id}`} key={item.protocolId}><span>{String(artifact.number).padStart(2, "0")}</span><div><small>{item.exampleId}</small><h3>{artifact.name}</h3></div><p>{item.preserves}</p><strong>{artifact.question}</strong></li>;
          })}
        </ol>
      </div>
    </section>

    <section className="section-block example-measure" id="measure">
      <SectionHeader eyebrow="One measurable outcome" title="Measure verified completion—not generated activity." description="The first run does not get to claim improvement. Baseline the manual path, observe accepted outcomes, and protect quality with explicit guardrails." />
      <div className="example-metric">
        <div><span>Primary measure</span><h3>{example.primaryMetric.name}</h3><code>{example.primaryMetric.formula}</code></div>
        <dl><div><dt>Baseline</dt><dd>{example.primaryMetric.baseline}</dd></div><div><dt>Success condition</dt><dd>{example.primaryMetric.success}</dd></div></dl>
      </div>
      <div className="example-guardrails"><span>Guardrails</span>{example.guardrailMetrics.map((metric) => <strong key={metric}>{metric}</strong>)}</div>
    </section>

    <section className="reference-callout"><div><p className="section-label">From reference to operation</p><h2>The example defines the contract. Mission Control makes it executable.</h2></div><div><p>Inspect the open-source reference implementation, its admitted capabilities, and its explicit limitations before treating this scenario as a deployable factory line.</p><div className="hero-actions"><Link className="button button-light" href="/mission-control">Explore Mission Control</Link><Link className="text-action light-link" href="/start">Define your own factory →</Link></div></div></section>
  </div></SiteShell>;
}
