import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { architectureAreas, factoryControls, lifecycleStages, protocolSteps, runtimeLifecycle } from "../../data/fdlc";
import { dependencyModernizationExample as example } from "../../data/dependency-modernization-example";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("FDLC in 5 Minutes", "Follow one dependency-modernization factory line through four FDLC system views, eleven durable artifacts, Mission Control, and one measurable outcome.", "/in-5-minutes");

const contents = [
  { label: "01 Factory line", href: "#scope" },
  { label: "02 Four views", href: "#views" },
  { label: "03 Factory lifecycle", href: "#factory-lifecycle" },
  { label: "04 Runtime", href: "#runtime" },
  { label: "04 Artifacts", href: "#artifacts" },
  { label: "05 Architecture", href: "#architecture" },
  { label: "06 Mission Control", href: "#mission-control" },
  { label: "07 Boundaries", href: "#boundaries" },
  { label: "08 Measure", href: "#measure" },
  { label: "09 Next steps", href: "#next-steps" },
] as const;

const views = [
  ["01", "Factory lifecycle", "How the production system itself is created, validated, operated, and improved.", "/framework#lifecycle"],
  ["02", "Runtime lifecycle", "How one unit of software work advances inside the operating factory.", "/framework#runtime"],
  ["03", "Architecture", "The six capability areas the factory must make explicit.", "/architecture"],
  ["04", "Artifact protocol", "The eleven durable records that make every transition auditable.", "/framework#protocol"],
] as const;

const missionControlViews = [
  { image: "/mission-control/command-center.png", alt: "Mission Control Command Center showing governed work requiring attention", label: "Command Center", title: "Plan and approval boundaries stay visible.", description: "Governed work surfaces an owner, next decision, and proof source instead of disappearing into an activity feed." },
  { image: "/mission-control/work-orders.png", alt: "Mission Control Work Orders view showing governed execution and verification state", label: "Work Order", title: "Execution is bounded before an Attempt begins.", description: "The Work Order carries scope, acceptance, risk, authority, and verification state; leased Attempts cannot silently become releases." },
  { image: "/mission-control/audit.png", alt: "Mission Control approvals and audit view showing durable change records", label: "Audit and evidence", title: "Evidence and consequential decisions become records.", description: "Verification, human acceptance, deployment, rollback, and policy decisions remain independently inspectable." },
] as const;

export default function FiveMinuteWalkthroughPage() {
  return <SiteShell><div className="page-wrap example-page">
    <PageHero eyebrow="FDLC in 5 Minutes" status="Illustrative" title="One workflow. Four views. Eleven artifacts. One measurable outcome." description="Watch a dependency-upgrade factory line move from opportunity to verified outcome—and see exactly which records, gates, and architecture areas make it trustworthy.">
      <div className="hero-actions"><a className="button button-dark" href="#factory-lifecycle">Follow the example</a><Link className="button button-light" href="/mission-control#quickstart">Run the Mission Control demo</Link></div>
    </PageHero>

    <div className="example-thesis" aria-label="One workflow, four system views, eleven artifacts, and one measurable outcome" role="group">
      <span>One workflow</span><strong>Four system views</strong><strong>Eleven artifacts</strong><strong>One measurable outcome</strong>
    </div>
    <PageContentsNav items={contents} title="Walkthrough" />

    <section className="section-block example-scope" id="scope">
      <SectionHeader eyebrow="01 / The concrete factory line" title="Modernize a payment dependency without changing behavior." description={example.businessCase} />
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
      <div className="example-baseline"><span>Baseline before automation</span>{example.baselineMetrics.map(([name, definition]) => <article key={name}><strong>{name}</strong><p>{definition}</p></article>)}</div>
      <p className="example-disclaimer"><strong>{example.status}.</strong> {example.boundary}</p>
    </section>

    <section className="section-block example-views" id="views">
      <SectionHeader eyebrow="02 / Four system views" title="The same factory. Four different questions." description="The views connect, but they are not interchangeable. Together they explain how the line evolves, how work moves, what capabilities participate, and what records preserve proof." />
      <div className="example-view-grid">{views.map(([number, name, description, href]) => <Link href={href} key={name}><span>{number}</span><h3>{name}</h3><p>{description}</p><strong>Explore the full view →</strong></Link>)}</div>
    </section>

    <section className="section-block" id="factory-lifecycle">
      <SectionHeader eyebrow="03 / Factory lifecycle" title="First, engineer the line that will do the work." description="The factory line is designed and validated once, then operates repeatedly for eligible dependency upgrades. Evidence from real outcomes may propose a new version; it cannot silently rewrite the active line." />
      <ol className="example-factory-stages">
        {example.factoryStages.map((item) => {
          const stage = lifecycleStages.find((candidate) => candidate.id === item.stageId);
          if (!stage) return null;
          return <li key={item.stageId}><span>{String(stage.number).padStart(2, "0")}</span><div><h3>{stage.name}</h3><p>{item.action}</p><small>Output · {item.output}</small></div></li>;
        })}
      </ol>
      <div className="example-controls"><span>Across every stage</span>{factoryControls.map((control) => <strong key={control.name}>{control.name}</strong>)}</div>
      <p className="example-factory-note"><strong>Engineered once. Operated many times.</strong> The factory version remains fixed until validated evidence justifies a governed improvement.</p>
    </section>

    <section className="example-runtime-section" id="runtime">
      <div className="example-inner">
        <SectionHeader eyebrow="04 / Runtime lifecycle" title="Now run one software change through the operating factory." description="Runtime verbs move the work. Artifact links point to the durable records that make every transition attributable and reviewable." />
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

    <section className="example-artifacts-section" id="artifacts">
      <div className="example-inner">
        <SectionHeader eyebrow="04 / Eleven artifacts" title="The records freeze what happened and why." description="These are representative semantic records, not a finalized wire format. Tasks, candidates, pull requests, and evidence envelopes may expand an implementation, but they cannot collapse the eleven canonical authority and evidence boundaries." />
        <ol className="example-artifact-ledger">
          {example.artifacts.map((item) => {
            const artifact = protocolSteps.find((candidate) => candidate.id === item.protocolId);
            if (!artifact) return null;
            return <li id={`artifact-${artifact.id}`} key={item.protocolId}><span>{String(artifact.number).padStart(2, "0")}</span><div><small>{item.exampleId}</small><h3>{artifact.name}</h3></div><p>{item.preserves}</p><strong>{artifact.question}</strong></li>;
          })}
        </ol>
      </div>
    </section>

    <section className="section-block" id="architecture">
      <SectionHeader eyebrow="05 / Architecture participation" title="Six capability areas participate in the same run." description="No single agent owns the outcome. Each architectural area contributes a distinct responsibility and maps to concrete Mission Control records or decisions." />
      <div className="example-architecture-grid">
        {example.architecture.map((item) => {
          const area = architectureAreas.find((candidate) => candidate.id === item.areaId);
          if (!area) return null;
          return <article key={item.areaId}><span>{String(area.number).padStart(2, "0")} / {area.name}</span><h3>{area.short}</h3><p>{item.contribution}</p><dl><dt>Mission Control</dt><dd>{item.missionControl}</dd></dl><div><Link href={`/architecture#${area.id}`}>Architecture →</Link><Link href={item.guideHref}>Guide →</Link></div></article>;
        })}
      </div>
      <p className="example-evidence-link">Implementation status remains capability-specific. <Link href="/mission-control#capabilities">Inspect the current Mission Control maturity ledger →</Link></p>
    </section>

    <section className="example-mission-section" id="mission-control">
      <div className="example-inner">
        <SectionHeader eyebrow="06 / Mission Control in the loop" title="The control plane materializes the records, gates, and attention boundaries." description="These reference-implementation views show where governed work, evidence, and decisions become inspectable. They demonstrate the operating model; they do not claim fleet-scale production certification." />
        <div className="example-mission-grid">{missionControlViews.map((view) => <figure className="product-frame" key={view.image}><div><span>{view.label}</span><span>Reference view</span></div><Image src={view.image} alt={view.alt} width={1600} height={1050} sizes="(max-width: 820px) 100vw, 33vw" /><figcaption><strong>{view.title}</strong><span>{view.description}</span></figcaption></figure>)}</div>
        <div className="example-mission-actions"><Link className="button button-dark" href="/mission-control#quickstart">Run the deterministic demo</Link><a className="text-action" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Inspect the source ↗</a></div>
      </div>
    </section>

    <section className="example-boundary-section" id="boundaries"><StateBoundary dark mode="primary" /></section>

    <section className="section-block example-measure" id="measure">
      <SectionHeader eyebrow="08 / How we know the factory improved" title="Measure verified completion—not generated activity." description="The first run does not get to claim improvement. Baseline the manual path, observe accepted outcomes, and protect quality with explicit guardrails." />
      <div className="example-metric">
        <div><span>Primary measure</span><h3>{example.primaryMetric.name}</h3><code>{example.primaryMetric.formula}</code></div>
        <dl><div><dt>Baseline</dt><dd>{example.primaryMetric.baseline}</dd></div><div><dt>What success looks like</dt><dd>{example.primaryMetric.success}</dd></div></dl>
      </div>
      <div className="example-guardrails"><span>Guardrails</span>{example.guardrailMetrics.slice(0, 6).map((metric) => <strong key={metric}>{metric}</strong>)}</div>
    </section>

    <section className="example-next-section" id="next-steps">
      <div className="example-inner"><SectionHeader eyebrow="09 / Next steps" title="Move from mental model to one bounded factory line." />
        <div className="example-next-grid">
          <Link href="/maturity"><span>Assess</span><strong>Assess your factory maturity.</strong><small>Find the weakest operating boundary →</small></Link>
          <Link href="/architecture"><span>Explore</span><strong>Study the full architecture.</strong><small>Inspect all six capability areas →</small></Link>
          <Link href="/mission-control#quickstart"><span>Run</span><strong>Run Mission Control locally.</strong><small>Use the deterministic demo →</small></Link>
          <Link href="/deploy"><span>Design partner</span><strong>Tell us about one workflow.</strong><small>Define a bounded proof path →</small></Link>
        </div>
        <p className="example-footer-note">This is a canonical example, not a claim of fleet-scale production. Mission Control’s current capability boundaries are documented on the <Link href="/mission-control#capabilities">Mission Control page →</Link></p>
      </div>
    </section>
  </div></SiteShell>;
}
