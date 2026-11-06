/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EngineeringJourney } from "./components/engineering-journey";
import { FactoryExplorer } from "./components/factory-explorer";
import { GoverningLifecycleDiagram } from "./components/governing-lifecycle-diagram";
import { SectionHeader } from "./components/page-hero";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { WhatsRealToday } from "./components/whats-real-today";
import { homepageActions, homepageExampleSteps, homepageThesis, operatingModelBridge, operatingModelMoves } from "../data/homepage";
import { evidencePositioning, primaryPositioning } from "../data/fdlc";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("FDLC: Learn the framework. Build your factory. Verify the outcome.", "FDLC is an open, implementation-independent engineering framework for designing, building, operating, verifying, governing and improving software factories.", "/");

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <a className="home-guide-banner" href="/guide/00-front-matter/00-how-to-read-this-guide">
          <span>New to FDLC? Start with the Guide.</span>
          <strong>Start here <span aria-hidden="true">→</span></strong>
        </a>
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow"><span>Factory Development Lifecycle (FDLC)</span><span>Open framework · v0.1</span></p>
            <h1 className="engineering-title">Learn the framework. Build your factory. Verify the outcome.</h1>
            <p className="hero-lede">FDLC is an open, implementation-independent engineering framework for designing, building, operating, verifying, governing and continuously improving software factories. Its operating model and technical foundation help you build the factory that builds your software.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/framework">Explore the Framework</Link>
              <Link className="button button-light" href="/simulator">Experience a Factory</Link>
            </div>
            <div><Link className="text-action hero-example-link" href="/lab">Build Your Own →</Link><a className="text-action" href="/guide">Read the Guide →</a></div>
            <p className="hero-audience">For engineering leaders, platform teams, software-factory architects, and builders evaluating governed AI delivery.</p>
            <div className="hero-category-contrast" aria-label="Difference between SDLC and FDLC" role="group">
              <div><span>SDLC</span><p>Governs the lifecycle of <strong>software.</strong></p></div>
              <div><span>FDLC</span><p>Governs the <strong>factory that builds it.</strong></p></div>
            </div>
            <p className="hero-problem">Code generation is becoming abundant. Trusted autonomous software delivery is not.</p>
          </div>
          <aside className="hero-model hero-value-model" aria-labelledby="hero-model-title">
            <div className="model-chrome"><span>FDLC / OPERATING MODEL</span><span>01—04</span></div>
            <h2 id="hero-model-title">Make autonomous delivery governable.</h2>
            <ol>
              {operatingModelMoves.map(([number, title, description]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}
            </ol>
            <p className="model-bridge">{operatingModelBridge.summary}</p>
            <nav aria-label="Deeper system lenses" className="model-bridge-links">
              {operatingModelBridge.links.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}
            </nav>
            <div className="model-outcome"><span>Unit of value</span><strong>Verified outcome</strong></div>
          </aside>
        </section>

        <section className="statement-band" aria-label="FDLC category statement">
          <p>FDLC / Category promise</p><strong>{primaryPositioning}</strong><span>{evidencePositioning}</span>
        </section>

        <section className="content-section" id="software-factory-engineering"><p className="section-label">Software Factory Engineering</p><h2>The factory is the engineering artifact.</h2><p>Design, build, integrate, operate, measure and improve the systems that produce verified software outcomes: workflows, Agent interfaces, recovery, organizational knowledge, independent verification and executable governance.</p><Link className="text-action" href="/about#engineering-discipline">What a Software Factory Engineer builds →</Link></section>

        <EngineeringJourney />

        <section className="content-section"><GoverningLifecycleDiagram /></section>

        <section className="home-guide-invite" aria-labelledby="home-guide-invite-title">
          <div>
            <p className="section-label">Go deeper</p>
            <h2 id="home-guide-invite-title">Follow the complete guide.</h2>
            <p>Move from the factory overview to the chapters on design, agents, evidence, operations, and improvement.</p>
          </div>
          <a className="button button-dark" href="/guide">Browse all chapters →</a>
        </section>

        <section className="content-section adoption-example" id="worked-example">
          <SectionHeader eyebrow="One illustrative example" title="Modernize a dependency without surrendering control." description="A software factory does more than generate a patch. It coordinates bounded work, returns evidence, preserves human authority, and produces a candidate that can earn release." />
          <ol className="adoption-example-flow" aria-label="Dependency modernization factory flow">
            {homepageExampleSteps.map(([name, description], index) => <li key={name}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{name}</strong><p>{description}</p></div></li>)}
          </ol>
          <div className="adoption-example-actions"><Link className="button button-dark" href="/in-5-minutes">Follow the complete example</Link><Link className="button button-light" href="/start">Build your Factory Definition</Link></div>
        </section>

        <div className="content-section factory-explorer-home">
          <FactoryExplorer />
        </div>

        <section className="adoption-thesis">
          <div><p className="section-label">Why FDLC</p><h2>Autonomy becomes useful when the surrounding system is trustworthy.</h2></div>
          <div className="adoption-thesis-grid">
            {homepageThesis.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section className="content-section adoption-actions">
          <SectionHeader eyebrow="Use FDLC now" title="Choose the next useful step." description="Start with the depth that matches your question. Every path leads back to one governed system." />
          <div className="adoption-action-grid">
            {homepageActions.map(([label, description, href, action]) => href.startsWith("/guide")
              ? <a href={href} key={label}><span>{label}</span><p>{description}</p><strong>{action} →</strong></a>
              : <Link href={href} key={label}><span>{label}</span><p>{description}</p><strong>{action} →</strong></Link>)}
          </div>
          <nav className="adoption-reference-links" aria-label="FDLC technical references"><Link href="/architecture">Architecture</Link><a href="/guide">Guide</a><Link href="/mission-control">Mission Control</Link><Link href="/manifesto">Manifesto</Link></nav>
        </section>

        <section className="mission-preview adoption-mission-preview">
          <div className="mission-preview-copy">
            <p className="section-label">Optional open-source reference implementation</p><h2>See the operating model in Mission Control.</h2>
            <p>Mission Control demonstrates selected control-plane concepts. Inspect plans, WorkOrders, Attempts, evidence and human decisions, with each capability’s current limits visible. FDLC does not require it.</p>
            <div className="hero-actions"><Link className="button button-dark" href="/mission-control">Inspect Mission Control</Link><a className="button button-light" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">View source ↗</a></div>
          </div>
          <figure className="product-frame"><div><span>MISSION CONTROL / COMMAND CENTER</span><span>DEMO VIEW</span></div><Image src="/mission-control/command-center.png" alt="Mission Control command center showing ranked work that needs operator attention" width={1600} height={1050} sizes="(max-width: 980px) 100vw, 65vw" /><figcaption>Deterministic demo view. Current capability status is documented on the Mission Control page.</figcaption></figure>
        </section>

        <section className="content-section">
          <WhatsRealToday compact />
        </section>

        <section className="content-section adoption-enterprise">
          <div><p className="section-label">Need help applying FDLC?</p><h2>Start with one bounded factory line.</h2></div>
          <div><p>AI-FDE helps an accountable human Factory Deployed Engineer turn reviewed enterprise evidence into an approved Factory Definition for Mission Control validation.</p><div className="hero-actions"><Link className="button button-dark" href="/deploy">Explore AI-FDE</Link><Link className="text-action" href="/enterprise">Enterprise path →</Link></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
