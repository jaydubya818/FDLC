import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "../components/architecture-diagram";
import { LifecycleDiagram } from "../components/lifecycle-diagram";
import { PageHero, SectionHeader } from "../components/page-hero";
import { ProtocolDiagram } from "../components/protocol-diagram";
import { SiteShell } from "../components/site-shell";
import { canonicalDefinition, manifesto, metrics } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Framework", "FDLC is the lifecycle for the factory itself: the operating model, architecture, execution protocol, and principles for AI software factories.", "/framework");

export default function FrameworkPage() {
  return <SiteShell>
    <div className="page-wrap">
      <PageHero eyebrow="FDLC Framework / 01" title="The lifecycle for the factory itself." description={canonicalDefinition}>
        <div className="hero-actions"><Link className="button button-dark" href="/architecture">Explore architecture</Link><Link className="button button-light" href="/guide">Read the Guide</Link></div>
      </PageHero>

      <section className="definition-block" aria-labelledby="definition-title">
        <p className="section-label">Canonical definition</p>
        <blockquote id="definition-title">“{canonicalDefinition}”</blockquote>
        <div><p>SDLC manages the lifecycle of software.</p><p><strong>FDLC manages the lifecycle of the factory that produces software.</strong></p></div>
      </section>

      <section className="section-block">
        <SectionHeader eyebrow="Why FDLC exists" title="The bottleneck moved from generation to confidence." description="An agent can produce code. A factory must decide what work is suitable, which capabilities may act, what evidence is required, when people must intervene, and whether the outcome should change the next run." />
        <div className="reason-grid">
          <article><span>01</span><h3>Models are probabilistic.</h3><p>Authorization, state, and consequential decisions cannot be.</p></article>
          <article><span>02</span><h3>Sessions are temporary.</h3><p>Plans, work, evidence, decisions, and recovery must be durable.</p></article>
          <article><span>03</span><h3>Completion is a claim.</h3><p>Independent, exact-current evidence decides what advances.</p></article>
          <article><span>04</span><h3>Learning can amplify error.</h3><p>Only validated outcomes should shape governed improvements.</p></article>
        </div>
      </section>

      <section className="section-block model-distinction">
        <SectionHeader eyebrow="The three models" title="Do not collapse these into one diagram." />
        <div className="three-models">
          <article><span>01 / Lifecycle</span><h3>How the factory evolves.</h3><p>Design, build, operate, measure, and improve the production system.</p><a href="#lifecycle">View lifecycle ↓</a></article>
          <article><span>02 / Architecture</span><h3>What the factory contains.</h3><p>Six capability areas that every implementation must address.</p><a href="#architecture">View architecture ↓</a></article>
          <article><span>03 / Protocol</span><h3>How governed work flows.</h3><p>Durable artifacts and evidence gates from Goal to Outcome.</p><a href="#protocol">View protocol ↓</a></article>
        </div>
      </section>

      <section className="section-block" id="lifecycle">
        <SectionHeader eyebrow="Model 01 / Lifecycle" title="How the factory evolves." description="The lifecycle applies when creating a new factory line and again whenever evidence says the existing line should change." />
        <LifecycleDiagram detailed />
      </section>

      <section className="section-block architecture-framework" id="architecture">
        <SectionHeader eyebrow="Model 02 / Architecture" title="What the factory requires." description="The six areas are capability boundaries, not vendor product categories or deployment tiers." />
        <ArchitectureDiagram />
        <Link className="section-link" href="/architecture">Read the detailed architecture <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section-block" id="protocol">
        <SectionHeader eyebrow="Model 03 / Execution Protocol" title="How one unit of work earns its way forward." description="The public protocol is intentionally concise. Implementations may add concrete records without weakening these boundaries." />
        <ProtocolDiagram detailed />
        <aside className="callout"><strong>Mission Control mapping</strong><p>Mission Control realizes Goal as a governed Mission and adds a Mission Spec, Task, candidate, pull request, and explicit WorkOrder acceptance to its concrete delivery contract.</p></aside>
      </section>

      <section className="section-block governance-principles">
        <SectionHeader eyebrow="Governance" title="Ten principles hold the system together." />
        <ol>{manifesto.map((item) => <li key={item.number}><span>{String(item.number).padStart(2, "0")}</span><p>{item.principle}</p></li>)}</ol>
        <Link className="section-link" href="/manifesto">Read the FDLC Manifesto <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section-block">
        <SectionHeader eyebrow="Measurement" title="The unit of value is a verified outcome." description="Generation volume is operational telemetry. Factory value is accepted change with known quality, cost, effort, recovery, and risk." />
        <div className="metric-grid">{metrics.slice(0, 8).map(([name, definition], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{definition}</p></article>)}</div>
      </section>

      <section className="reference-callout"><div><p className="section-label">Reference implementation</p><h2>Mission Control makes the protocol concrete.</h2></div><div><p>Inspect how one open-source control plane models governed Plans, WorkOrders, Attempts, evidence, verification, and human acceptance—with current limitations visible.</p><Link className="button button-light" href="/mission-control">Explore Mission Control</Link></div></section>
    </div>
  </SiteShell>;
}
