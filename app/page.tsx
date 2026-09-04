import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArchitectureDiagram } from "./components/architecture-diagram";
import { CategoryDistinction } from "./components/category-distinction";
import { LifecycleDiagram } from "./components/lifecycle-diagram";
import { ProtocolDiagram } from "./components/protocol-diagram";
import { RuntimeLifecycleDiagram } from "./components/runtime-lifecycle-diagram";
import { SectionHeader } from "./components/page-hero";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { ecosystemRoles, evidencePositioning, factorySystemComponents, manifesto, maturityLevels, primaryPositioning } from "../data/fdlc";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Factory Development Lifecycle (FDLC): Build the factory that builds your software", "FDLC is the open operating model and reference architecture for designing, governing, and continuously improving AI software factories.", "/");

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow"><span>Factory Development Lifecycle</span><span>Open framework · v0.1</span></p>
            <h1>Build the factory that builds your software.</h1>
            <p className="hero-lede">
              FDLC is the open operating model and reference architecture for designing,
              governing, and continuously improving AI software factories. Turn engineering
              intent into independently verified software using model-agnostic agents,
              governed plans, isolated execution, policy gates, and evidence-backed delivery.
            </p>
            <p className="hero-contrast"><strong>Not another coding agent.</strong> The control system around them.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/in-5-minutes">Understand FDLC in 5 minutes</Link>
              <Link className="button button-light" href="/framework">Explore the Framework</Link>
              <Link className="text-action" href="/mission-control">Mission Control →</Link>
            </div>
          </div>
          <aside className="hero-model" aria-labelledby="hero-model-title">
            <div className="model-chrome"><span>FDLC / SYSTEM MAP</span><span>01—06</span></div>
            <h2 id="hero-model-title">The system around the agent.</h2>
            <ArchitectureDiagram compact />
            <div className="model-outcome">
              <span>Unit of value</span>
              <strong>Verified outcome</strong>
            </div>
          </aside>
        </section>

        <section className="statement-band" aria-label="FDLC category statement">
          <p>FDLC / Category promise</p>
          <strong>{primaryPositioning}</strong>
          <span>{evidencePositioning}</span>
        </section>

        <section className="content-section shift-section">
          <SectionHeader eyebrow="Inside the factory" title="One autonomous software-delivery lifecycle." description="An operating factory receives intent, coordinates bounded work, earns release through evidence, observes the result, and learns. These runtime steps are distinct from the lifecycle used to engineer the factory itself." />
          <p className="orientation-label">Runtime lifecycle</p>
          <RuntimeLifecycleDiagram />
          <p className="orientation-note">This inner lifecycle produces software. The seven-stage FDLC lifecycle below evolves the factory that performs it.</p>
          <p className="orientation-label architecture-label">Factory architecture</p>
          <div className="governance-grid" aria-label="Factory architecture components" role="group">
            {factorySystemComponents.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</div>)}
          </div>
        </section>

        <section className="comparison-section">
          <div className="comparison-intro">
            <p className="section-label">The category boundary</p>
            <h2>Three categories. One critical distinction.</h2>
            <p>FDLC does not replace the SDLC. It engineers the persistent production system that increasingly performs parts of it. FDLC is the lifecycle for the factory itself.</p>
          </div>
          <div><CategoryDistinction /></div>
        </section>

        <section className="dark-section">
          <div className="content-section">
            <SectionHeader eyebrow="Architecture" title="Six areas. One governed system." description="Every factory needs a way to understand intent, execute durably, assemble capability, route intelligence, establish trust, and improve from reality." />
            <ArchitectureDiagram />
            <Link className="section-link light-link" href="/architecture">Explore the reference architecture <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="content-section lifecycle-section">
          <SectionHeader eyebrow="Factory lifecycle / Outer loop" title="The factory is engineered, not installed." description="FDLC evolves the production system from a measured opportunity to an operating factory line and then improves it from validated outcomes. Governance, security, observability, and measurement remain continuous throughout." />
          <LifecycleDiagram />
        </section>

        <section className="protocol-section">
          <div className="content-section">
            <SectionHeader eyebrow="Artifact protocol" title="Every transition earns its state." description="The runtime lifecycle is made inspectable by durable nouns: intent, specification, authorized work, attributable attempts, evidence, decisions, releases, outcomes, and learning signals." />
            <ProtocolDiagram />
            <div className="invariant-grid">
              <article><span>01</span><h3>The Plan is governed.</h3><p>Approval binds one exact, reviewable revision.</p></article>
              <article><span>02</span><h3>Evidence gates transitions.</h3><p>Missing, stale, or unrelated proof cannot become success.</p></article>
              <article><span>03</span><h3>Verification is separable.</h3><p>A producer should not be its only verifier.</p></article>
            </div>
          </div>
        </section>

        <section className="content-section principles-preview">
          <div className="principles-quote">
            <p className="section-label">FDLC Manifesto</p>
            <blockquote>“Human attention belongs at consequential boundaries.”</blockquote>
            <Link className="section-link" href="/manifesto">Read all ten principles <span aria-hidden="true">→</span></Link>
          </div>
          <ol>
            {manifesto.slice(0, 5).map((item) => <li key={item.number}><span>{String(item.number).padStart(2, "0")}</span><strong>{item.principle}</strong></li>)}
          </ol>
        </section>

        <section className="mission-preview">
          <div className="mission-preview-copy">
            <p className="section-label">Open-source reference implementation</p>
            <h2>Mission Control</h2>
            <p>A governed control plane for planning, executing, verifying, approving, and learning from autonomous software work.</p>
            <ol>
              {["Intent becomes an approved Plan", "Plans release bounded WorkOrders", "Attempts run under explicit authority", "Independent evidence gates acceptance", "Outcomes become governed learning signals"].map((item, index) => <li key={item}><span>{index + 1}</span>{item}</li>)}
            </ol>
            <div className="hero-actions"><Link className="button button-dark" href="/mission-control">Learn more</Link><a className="button button-light" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">GitHub ↗</a></div>
          </div>
          <figure className="product-frame">
            <div><span>MISSION CONTROL / COMMAND CENTER</span><span>DEMO VIEW</span></div>
            <Image src="/mission-control/command-center.png" alt="Mission Control command center showing ranked work that needs operator attention" width={1600} height={1050} sizes="(max-width: 980px) 100vw, 65vw" />
            <figcaption>Deterministic demo view. Capability status is documented separately.</figcaption>
          </figure>
        </section>

        <section className="content-section maturity-preview">
          <SectionHeader eyebrow="Factory maturity" title="How mature is your software factory?" description="Maturity is not the number of agents you run. It is the strength of your intent, execution, evidence, governance, and learning systems." />
          <ol className="maturity-ladder">
            {maturityLevels.map((level) => <li key={level.level}><span>L{level.level}</span><div><strong>{level.name}</strong><small>{level.operatingModel}</small></div></li>)}
          </ol>
          <Link className="section-link" href="/maturity">Assess your factory <span aria-hidden="true">→</span></Link>
        </section>

        <section className="guide-preview">
          <div><p className="section-label">The field guide</p><h2>Learn the discipline from first principles to production.</h2></div>
          <div><p>The full 44-chapter AI Software Factory Guide covers architecture, governance, agents, harnesses, tools, context, models, verification, security, operations, and governed learning.</p><Link className="button button-light" href="/guide">Choose a reading path</Link></div>
        </section>

        <section className="content-section ecosystem-section">
          <SectionHeader eyebrow="The FDLC.ai ecosystem" title="One discipline. Five distinct roles." description="The open foundation defines the category. Products and services make it concrete without becoming the definition of FDLC itself." />
          <div className="ecosystem-cards">
            {ecosystemRoles.map((item, index) => <Link href={item.href} key={item.name}><span>{String(index + 1).padStart(2, "0")} / {item.status}</span><h3>{item.name}</h3><strong>{item.role}</strong><p>{item.description}</p><small>Explore →</small></Link>)}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
