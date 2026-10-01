import { GuideReference } from "../components/guide-reference";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { NextSteps } from "../components/next-steps";
import { GoverningLifecycleDiagram } from "../components/governing-lifecycle-diagram";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { architectureAreas, canonicalDefinition, factoryControls, lifecycleStages, protocolSteps, runtimeLifecycle } from "../../data/fdlc";
import { dependencyModernizationExample as example } from "../../data/dependency-modernization-example";
import { pageHandoffs } from "../../data/page-handoffs";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("FDLC in 5 Minutes", "One workflow. Four system views. Eleven artifacts. One measurable outcome. See how a dependency-modernization factory line moves from opportunity to verified result under the Factory Development Lifecycle.", "/in-5-minutes");

const contents = [
  { label: "01 Factory line", href: "#the-factory-line" },
  { label: "02 Four views", href: "#views" },
  { label: "03 Factory lifecycle", href: "#factory-lifecycle" },
  { label: "04 Runtime", href: "#runtime" },
  { label: "05 Artifacts", href: "#artifacts" },
  { label: "06 Architecture", href: "#architecture" },
  { label: "07 Mission Control", href: "#mission-control" },
  { label: "08 Boundaries", href: "#boundaries" },
  { label: "09 Measure", href: "#measure" },
  { label: "10 Next steps", href: "#next-steps" },
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
    <PageHero eyebrow="FDLC in 5 Minutes" status="Illustrative" variant="compact" title="One workflow. Four views. Eleven artifacts. One measurable outcome." description={canonicalDefinition} meta={[["Example", "Dependency modernization"], ["Views", "04"], ["Artifacts", "11"]]}>
      <div className="hero-actions"><a className="button button-dark" href="#the-factory-line">Follow the example</a><Link className="button button-light" href="/framework">Explore the Framework</Link><Link className="text-action" href="/mission-control#quickstart">Run Mission Control →</Link></div>
    </PageHero>
    <GuideReference description="Go beyond this worked example with the complete, chapter-by-chapter explanation of how to build and operate a software factory." />

    <div className="example-introduction"><p>This page walks one concrete factory line—dependency modernization—through the full system so you can see how FDLC turns intent into independently verified software.</p><p><strong>This is not a product tour.</strong> It is a concrete walkthrough of the Factory Development Lifecycle applied to one bounded, high-value class of work.</p></div>
    <div className="example-thesis" aria-label="One workflow, four system views, eleven artifacts, and one measurable outcome" role="group">
      <span>One workflow</span><strong>Four system views</strong><strong>Eleven artifacts</strong><strong>One measurable outcome</strong>
    </div>
    <GoverningLifecycleDiagram />
    <PageContentsNav items={contents} title="Walkthrough" />

    <section className="section-block example-scope" id="the-factory-line">
      <SectionHeader eyebrow="01 / The factory line" title="Dependency modernization." description="Upgrade a defined set of approved libraries across a single repository while preserving build integrity, test results, and public API compatibility." />
      <aside className="example-rationale"><strong>Why this line first</strong><p>{example.businessCase}</p></aside>
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
      <div className="example-baseline"><span>Baseline / illustrative</span>{example.baselineMetrics.map(([name, value, definition]) => <article key={name}><strong>{name}</strong><b>{value}</b><p>{definition}</p></article>)}</div>
      <p className="example-disclaimer"><strong>{example.status}.</strong> {example.boundary}</p>
      <p className="example-goal">The goal of the factory line is not “run an agent.” It is to produce verified, accepted upgrades at lower cost, lower risk, and with less scarce human attention—while preserving a complete evidence trail.</p>
    </section>

    <section className="section-block example-views" id="views">
      <SectionHeader eyebrow="02 / Four system views" title="The same factory. Four different questions." description="FDLC is not one diagram. The views connect, but they are not interchangeable. Collapsing them produces confusion; keeping them separate produces clarity." />
      <div className="example-view-grid">{views.map(([number, name, description, href]) => <Link href={href} key={name}><span>{number}</span><h3>{name}</h3><p>{description}</p><strong>Explore the full view →</strong></Link>)}</div>
    </section>

    <section className="section-block" id="factory-lifecycle">
      <SectionHeader eyebrow="03 / Factory lifecycle applied" title="The factory line itself is engineered. It is not installed by prompting." description="Discover, design, assemble, validate, deploy, operate, and improve the line under continuous governance, security, observability, and measurement. Evidence from real outcomes may propose a new version; it cannot silently rewrite the active line." />
      <ol className="example-factory-stages">
        {example.factoryStages.map((item) => {
          const stage = lifecycleStages.find((candidate) => candidate.id === item.stageId);
          if (!stage) return null;
          return <li key={item.stageId}><span>{String(stage.number).padStart(2, "0")}</span><div><h3>{stage.name}</h3><p>{item.action}</p><small>Output · {item.output}</small></div></li>;
        })}
      </ol>
      <div className="example-controls"><span>Across every stage</span>{factoryControls.map((control) => <strong key={control.name}>{control.name}</strong>)}</div>
      <p className="example-factory-note"><strong>Designed once. Run many times.</strong> Each run produces evidence that can improve the next run—under change control. The active factory version remains fixed until validated evidence justifies a governed improvement.</p>
    </section>

    <section className="example-runtime-section" id="runtime">
      <div className="example-inner">
        <SectionHeader eyebrow="04 / Runtime lifecycle" title="One unit of work advances only by earning the next state." description="Optimistic status labels are not sufficient. Runtime verbs move the work; artifact links point to the durable records that make every transition attributable and reviewable." />
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
        <SectionHeader eyebrow="05 / Eleven artifacts" title="The records freeze what happened and why." description="These are representative semantic records, not a finalized wire format. Tasks, candidates, pull requests, and evidence envelopes may expand an implementation, but they cannot collapse the eleven canonical authority and evidence boundaries." />
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
      <SectionHeader eyebrow="06 / Architecture participation" title="All six areas participate in the same run." description="No single agent owns the outcome. Each architectural area contributes a distinct responsibility and maps to concrete Mission Control records or decisions." />
      <div className="example-architecture-grid">
        {example.architecture.map((item) => {
          const area = architectureAreas.find((candidate) => candidate.id === item.areaId);
          if (!area) return null;
          return <article key={item.areaId}><span>{String(area.number).padStart(2, "0")} / {area.name}</span><h3>{area.short}</h3><p>{item.contribution}</p><dl><dt>Mission Control</dt><dd>{item.missionControl}</dd></dl><div><Link href={`/architecture#${area.id}`}>Architecture →</Link><a href={item.guideHref}>Guide →</a></div></article>;
        })}
      </div>
      <p className="example-architecture-invariant"><strong>Trust constrains every area.</strong> Learning captures validated outcomes and failures, but it never writes directly to production.</p>
      <p className="example-evidence-link">Implementation status remains capability-specific. <Link href="/mission-control#capabilities">Inspect the current Mission Control maturity ledger →</Link></p>
    </section>

    <section className="example-mission-section" id="mission-control">
      <div className="example-inner">
        <SectionHeader eyebrow="07 / Mission Control in the loop" title="The control plane materializes the records, gates, and attention boundaries." description="These reference-implementation views show where governed work, evidence, and decisions become inspectable. They demonstrate the operating model; they do not claim fleet-scale production certification." />
        <ul className="example-mission-ledger">
          <li><strong>Mission + Specification</strong><span>Define the governed outcome and proof contract.</span></li>
          <li><strong>Versioned Plan</strong><span>Must be approved before Work Orders are released.</span></li>
          <li><strong>Leased Attempts</strong><span>Execute against frozen configuration with durable lineage.</span></li>
          <li><strong>Evidence Envelopes</strong><span>Bind attributable proof to exact candidates.</span></li>
          <li><strong>Independent verification</strong><span>Produces explicit Quality Gate decisions.</span></li>
          <li><strong>Human acceptance</strong><span>Preserves accountable judgment at the consequential boundary.</span></li>
        </ul>
        <div className="example-mission-grid">{missionControlViews.map((view) => <figure className="product-frame" key={view.image}><div><span>{view.label}</span><span>Reference view</span></div><Image src={view.image} alt={view.alt} width={1600} height={1050} sizes="(max-width: 820px) 100vw, 33vw" /><figcaption><strong>{view.title}</strong><span>{view.description}</span></figcaption></figure>)}</div>
        <div className="example-mission-actions"><Link className="button button-dark" href="/mission-control#quickstart">Run the deterministic demo</Link><a className="text-action" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Inspect the source ↗</a></div>
      </div>
    </section>

    <section className="example-boundary-section" id="boundaries"><StateBoundary dark eyebrow="08 / The non-collapsible boundaries" mode="primary" /><p className="example-boundary-mapping">In Mission Control: Attempt completion → Quality Gate Decision → Human Acceptance → Release → Outcome. No single actor can advance more than one boundary without the required evidence and authority.</p></section>

    <section className="section-block example-measure" id="measure">
      <SectionHeader eyebrow="09 / How we know the factory improved" title="Measure verified completion—not generated activity." description="The first run does not get to claim improvement. Baseline the manual path, observe accepted outcomes, and protect quality with explicit guardrails." />
      <div className="example-metric">
        <div><span>Primary measure</span><h3>{example.primaryMetric.name}</h3><code>{example.primaryMetric.formula}</code></div>
        <dl><div><dt>Baseline</dt><dd>{example.primaryMetric.baseline}</dd></div><div><dt>What success looks like</dt><dd>{example.primaryMetric.success}</dd></div></dl>
      </div>
      <div className="example-measure-ledger">{example.outcomeMetrics.map(([name, definition], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{name}</strong><p>{definition}</p></article>)}</div>
      <div className="example-guardrails"><span>Quality guardrails</span>{example.guardrailMetrics.slice(3).map((metric) => <strong key={metric}>{metric}</strong>)}</div>
      <p className="example-measure-note">Improvement is measured against the original baseline, not against model confidence scores.</p>
    </section>

    <section className="example-next-section" id="next-steps">
      <div className="example-inner"><SectionHeader eyebrow="10 / Next steps" title="Move from mental model to one bounded factory line." />
        <NextSteps {...pageHandoffs["in-5-minutes"]} />
        <p className="example-footer-note">This walkthrough is a canonical example, not a certification of production readiness. The discipline is open. The reference implementation shows its limits. The value is determined by verified outcomes. Mission Control’s current capability boundaries are documented on the <Link href="/mission-control#capabilities">Mission Control page →</Link></p>
      </div>
    </section>
  </div></SiteShell>;
}
