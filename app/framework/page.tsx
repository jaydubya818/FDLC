import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "../components/architecture-diagram";
import { LifecycleDiagram } from "../components/lifecycle-diagram";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { ProtocolDiagram } from "../components/protocol-diagram";
import { RuntimeLifecycleDiagram } from "../components/runtime-lifecycle-diagram";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { canonicalDefinition, manifesto, metrics } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Framework", "FDLC is the lifecycle for the factory itself: the operating model, architecture, execution protocol, and principles for AI software factories.", "/framework");

const contents = [
  { label: "Definition", href: "#definition" },
  { label: "Why FDLC", href: "#why" },
  { label: "Four views", href: "#models" },
  { label: "Factory lifecycle", href: "#lifecycle" },
  { label: "Runtime", href: "#runtime" },
  { label: "Architecture", href: "#architecture" },
  { label: "Artifacts", href: "#protocol" },
  { label: "Principles", href: "#governance" },
  { label: "Measurement", href: "#measurement" },
  { label: "Mission Control", href: "#mission-control" },
] as const;

export default function FrameworkPage() {
  return <SiteShell>
    <div className="page-wrap">
      <PageHero eyebrow="FDLC Framework / 01" title="The lifecycle for the factory itself." description={canonicalDefinition}>
        <div className="hero-actions"><Link className="button button-dark" href="/in-5-minutes">See FDLC in 5 minutes</Link><Link className="button button-light" href="/architecture">Explore architecture</Link></div>
      </PageHero>
      <div className="longform-layout">
      <PageContentsNav items={contents} mobileTitle="Jump to section" title="Framework sections" variant="rail" />
      <div className="longform-content">

      <section className="definition-block" id="definition" aria-labelledby="definition-title">
        <p className="section-label">Canonical definition</p>
        <blockquote id="definition-title">“{canonicalDefinition}”</blockquote>
        <div><p>SDLC manages the lifecycle of software.</p><p><strong>FDLC manages the lifecycle of the factory that produces software.</strong></p></div>
      </section>

      <section className="section-block" id="why">
        <SectionHeader eyebrow="Why FDLC exists" title="When code stops being the bottleneck, factory maturity becomes the constraint." description="An agent can produce code. A factory must coordinate durable work, bound authority, require evidence, route consequential decisions, observe outcomes, and improve without silently weakening its controls." />
        <div className="reason-grid">
          <article><span>01</span><h3>Models are probabilistic.</h3><p>Authorization, state, and consequential decisions cannot be.</p></article>
          <article><span>02</span><h3>Sessions are temporary.</h3><p>Plans, work, evidence, decisions, and recovery must be durable.</p></article>
          <article><span>03</span><h3>Completion is a claim.</h3><p>Independent, exact-current evidence decides what advances.</p></article>
          <article><span>04</span><h3>Learning can amplify error.</h3><p>Only validated outcomes should shape governed improvements.</p></article>
        </div>
      </section>

      <section className="section-block model-distinction" id="models">
        <SectionHeader eyebrow="Four views of the system" title="Related models. Different responsibilities." />
        <div className="system-models">
          <article><span>01 / Factory lifecycle</span><h3>How the factory evolves.</h3><p>Discover, design, assemble, validate, deploy, operate, and improve.</p><a href="#lifecycle">View outer lifecycle ↓</a></article>
          <article><span>02 / Runtime lifecycle</span><h3>How software moves inside it.</h3><p>One autonomous delivery loop from received intent to governed learning.</p><a href="#runtime">View inner lifecycle ↓</a></article>
          <article><span>03 / Architecture</span><h3>What the factory contains.</h3><p>Six capability areas that every implementation must address.</p><a href="#architecture">View architecture ↓</a></article>
          <article><span>04 / Artifact protocol</span><h3>What makes work durable.</h3><p>Eleven semantic objects from Intent to Learning Signal.</p><a href="#protocol">View protocol ↓</a></article>
        </div>
      </section>

      <section className="section-block" id="lifecycle">
        <SectionHeader eyebrow="Model 01 / Factory lifecycle" title="How the factory evolves." description="The outer lifecycle applies when creating a factory line and whenever validated evidence says the existing line should change. Its continuous controls span every stage." />
        <LifecycleDiagram detailed />
        <div className="section-links"><Link href="/in-5-minutes#factory-lifecycle">See the lifecycle applied to one factory line →</Link></div>
      </section>

      <section className="section-block" id="runtime">
        <SectionHeader eyebrow="Model 02 / Runtime lifecycle" title="How software moves inside an operating factory." description="The inner lifecycle transforms intent into independently verified software under explicit policy and human authority, then returns production outcomes as controlled learning signals." />
        <RuntimeLifecycleDiagram detailed />
        <aside className="callout"><strong>Keep the boundaries clear</strong><p>Deploy promotes a validated factory version during the outer lifecycle. Release promotes an accepted software artifact during the inner lifecycle. Neither transition creates its own authority.</p></aside>
        <div className="section-links"><Link href="/in-5-minutes#runtime">Follow one runtime walkthrough →</Link></div>
      </section>

      <section className="section-block architecture-framework" id="architecture">
        <SectionHeader eyebrow="Model 03 / Architecture" title="What the factory requires." description="The six areas are capability boundaries, not vendor product categories or deployment tiers." />
        <ArchitectureDiagram />
        <Link className="section-link" href="/architecture">Read the detailed architecture <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section-block" id="protocol">
        <SectionHeader eyebrow="Model 04 / Artifact protocol" title="How one unit of work becomes durable and inspectable." description="Lifecycle verbs describe what the factory does. Protocol nouns preserve what existed, ran, was observed, was decided, and may improve next." />
        <ProtocolDiagram detailed />
        <aside className="callout"><strong>Mission Control mapping</strong><p>Mission Control realizes Intent as a governed Mission, Specification as a Mission Spec, and expands bounded execution with Tasks, candidates, pull requests, and explicit WorkOrder acceptance.</p></aside>
        <div className="section-links"><Link href="/mission-control">See Mission Control objects →</Link><Link href="/in-5-minutes#artifacts">Inspect all eleven example records →</Link></div>
      </section>

      <StateBoundary mode="primary" />

      <section className="section-block governance-principles" id="governance">
        <SectionHeader eyebrow="Governance" title="Ten principles hold the system together." />
        <ol>{manifesto.map((item) => <li key={item.number}><span>{String(item.number).padStart(2, "0")}</span><p>{item.principle}</p></li>)}</ol>
        <Link className="section-link" href="/manifesto">Read the FDLC Manifesto <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section-block" id="measurement">
        <SectionHeader eyebrow="Measurement" title="The unit of value is a verified outcome." description="Generation volume is operational telemetry. Factory value is accepted change with known quality, cost, effort, recovery, and risk." />
        <div className="metric-grid">{metrics.slice(0, 8).map(([name, definition], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{definition}</p></article>)}</div>
      </section>

      <section className="reference-callout" id="mission-control"><div><p className="section-label">Reference implementation</p><h2>Mission Control makes the protocol concrete.</h2></div><div><p>Inspect how one open-source control plane models governed Plans, WorkOrders, Attempts, evidence, verification, and human acceptance—with current limitations visible.</p><div className="hero-actions"><Link className="button button-light" href="/mission-control">Explore Mission Control</Link><Link className="text-action light-link" href="/in-5-minutes">See the walkthrough →</Link></div></div></section>
      </div>
      </div>
    </div>
  </SiteShell>;
}
