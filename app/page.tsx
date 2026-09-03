import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArchitectureDiagram } from "./components/architecture-diagram";
import { LifecycleDiagram } from "./components/lifecycle-diagram";
import { ProtocolDiagram } from "./components/protocol-diagram";
import { SectionHeader } from "./components/page-hero";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { manifesto, maturityLevels } from "../data/fdlc";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Build the factory that builds your software", "FDLC is the open framework for governed, verifiable AI software factories.", "/");

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow"><span>Open framework</span><span>v0.1</span></p>
            <h1>Build the factory that builds your software.</h1>
            <p className="hero-lede">
              FDLC — the Factory Development Lifecycle — is an open framework for
              designing, governing, verifying, operating, and continuously improving
              AI software factories.
            </p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/framework">Explore FDLC</Link>
              <Link className="button button-light" href="/guide">Read the Guide</Link>
              <Link className="text-action" href="/mission-control">See Mission Control <span aria-hidden="true">↗</span></Link>
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
          <p>Not another coding agent.</p>
          <strong>The control system around them.</strong>
          <span>Intent → governed execution → evidence → outcome</span>
        </section>

        <section className="content-section shift-section">
          <SectionHeader eyebrow="The shift" title="Coding agents are not software factories." description="Codex, Claude Code, Cursor, Copilot, internal agents, and the providers still to come can all perform valuable work. The durable problem is the governed system around them." />
          <div className="governance-grid" aria-label="What FDLC governs">
            {[
              "Intent", "Plans", "Agent identity", "Authority", "Tools", "Execution",
              "Evidence", "Verification", "Release", "Outcomes", "Learning",
            ].map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</div>)}
          </div>
        </section>

        <section className="comparison-section">
          <div className="comparison-intro">
            <p className="section-label">What is FDLC?</p>
            <h2>Two lifecycles.<br />Different responsibilities.</h2>
            <p>FDLC does not replace the software development lifecycle. It surrounds and governs the increasingly autonomous system that performs parts of it.</p>
          </div>
          <div className="comparison-table">
            <article><span>SDLC</span><h3>Manages the lifecycle of software.</h3><p>Requirements, design, implementation, testing, release, maintenance.</p></article>
            <article><span>FDLC</span><h3>Manages the lifecycle of the factory that produces software.</h3><p>Intent, capabilities, authority, execution, evidence, outcomes, learning.</p></article>
          </div>
        </section>

        <section className="dark-section">
          <div className="content-section">
            <SectionHeader eyebrow="Architecture" title="Six areas. One governed system." description="Every factory needs a way to understand intent, execute durably, assemble capability, route intelligence, establish trust, and improve from reality." />
            <ArchitectureDiagram />
            <Link className="section-link light-link" href="/architecture">Explore the reference architecture <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="content-section lifecycle-section">
          <SectionHeader eyebrow="Lifecycle" title="The factory is engineered, not installed." description="FDLC manages the factory as a living production system—from selecting the right work through governed improvement." />
          <LifecycleDiagram />
        </section>

        <section className="protocol-section">
          <div className="content-section">
            <SectionHeader eyebrow="Governed execution" title="Every transition earns its state." description="One unit of autonomous software work advances through durable artifacts, not optimistic status labels." />
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
          <div><p>The AI Software Factory Guide covers architecture, governance, agents, harnesses, tools, context, models, verification, security, operations, and governed learning across 36 chapters.</p><Link className="button button-light" href="/guide">Read the Guide</Link></div>
        </section>

        <section className="content-section paths-section">
          <SectionHeader eyebrow="Build with FDLC" title="Start at the layer you need." />
          <div className="path-cards">
            <Link href="/framework"><span>01 / Learn</span><h3>Understand the system.</h3><p>Framework, architecture, manifesto, and field guide.</p><strong>Explore the framework →</strong></Link>
            <Link href="/mission-control"><span>02 / Build</span><h3>Inspect a real implementation.</h3><p>Mission Control, the execution protocol, and the emerging Specification.</p><strong>See Mission Control →</strong></Link>
            <Link href="/deploy"><span>03 / Adopt</span><h3>Prove one factory line.</h3><p>Assess readiness, implement a lighthouse line, then scale what works.</p><strong>Explore deployment →</strong></Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
