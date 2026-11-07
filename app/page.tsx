/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FactoryExplorer } from "./components/factory-explorer";
import { GoverningLifecycleDiagram } from "./components/governing-lifecycle-diagram";
import { SectionHeader } from "./components/page-hero";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { WhatsRealToday } from "./components/whats-real-today";
import { homepageActions, homepageExampleSteps, homepageReferences, homepageThesis, operatingModelBridge, operatingModelMoves } from "../data/homepage";
import { evidencePositioning, primaryPositioning } from "../data/fdlc";
import { missionControlRepository } from "../lib/global-navigation";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Factory Development Lifecycle (FDLC)", "The Factory Development Lifecycle (FDLC) is an open framework for building and running AI software factories, with clear limits, verification and human approval.", "/");

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <a className="home-guide-banner" href="/guide/00-front-matter/00-how-to-read-this-guide">
          <span>The AI Software Factory Guide: 44 chapters on designing, building and running a factory.</span>
          <strong>Read the Guide <span aria-hidden="true">→</span></strong>
        </a>
        <section className="hero-shell">
          <div className="hero-copy">
            <p className="eyebrow"><span>A framework for AI software factories</span><span>Open framework · v0.1</span></p>
            <h1 className="engineering-title">Factory Development Lifecycle (FDLC)</h1>
            <p className="hero-lede">An open framework for engineering AI software factories—the systems of AI agents, tools and people that build, test and deliver software. FDLC defines how work is bounded, verified, approved and improved, so autonomous delivery can be trusted.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/in-5-minutes">Experience FDLC in 5 Minutes</Link>
              <Link className="button button-light" href="/framework">Explore the Framework</Link>
            </div>
            <p className="hero-audience">For engineering leaders and teams building reliable AI software delivery. Use your own agents, models and tools: FDLC defines the engineering discipline, not the technology stack.</p>
            <div className="hero-category-contrast" aria-label="Difference between SDLC and FDLC" role="group">
              <div><span>SDLC</span><p>The Software Development Lifecycle manages a <strong>software product.</strong></p></div>
              <div><span>FDLC</span><p>The Factory Development Lifecycle manages the <strong>system that produces it.</strong></p></div>
            </div>
            <p className="hero-problem">Code generation is becoming abundant. Trusted autonomous software delivery is not.</p>
          </div>
          <aside className="hero-model hero-value-model" aria-labelledby="hero-model-title">
            <div className="model-chrome"><span>How the framework works</span><span>01—04</span></div>
            <h2 id="hero-model-title">Give AI software delivery a clear process.</h2>
            <ol>
              {operatingModelMoves.map(([number, title, description]) => <li key={number}><span>{number}</span><div><strong>{title}</strong><p>{description}</p></div></li>)}
            </ol>
            <p className="model-bridge">{operatingModelBridge.summary}</p>
            <div className="model-outcome"><span>Unit of value</span><strong>Verified outcome</strong></div>
          </aside>
        </section>

        <section className="statement-band" aria-label="FDLC category statement">
          <p>FDLC / Category promise</p><strong>{primaryPositioning}</strong><span>{evidencePositioning}</span>
        </section>

        <section className="content-section adoption-actions">
          <SectionHeader eyebrow="Your path through FDLC" title="Understand it, see it run, then build your own." description="Start in the browser in five minutes, then run a governed factory on your own machine. No account, and no particular agent, model or vendor, is required." />
          <div className="adoption-action-grid" id="your-path">
            {homepageActions.map(([label, title, description, href, action]) => <Link href={href} key={label}><span>{label}</span><h3>{title}</h3><p>{description}</p><strong>{action} →</strong></Link>)}
          </div>
          <nav className="adoption-reference-links" aria-label="Go deeper">{homepageReferences.map(([label, href]) => href.startsWith("/guide") ? <a href={href} key={href}>{label}</a> : <Link href={href} key={href}>{label}</Link>)}</nav>
        </section>



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


        <section className="mission-preview adoption-mission-preview">
          <div className="mission-preview-copy">
            <p className="section-label">Optional open-source reference implementation</p><h2>See the operating model in Mission Control.</h2>
            <p>Mission Control demonstrates selected control-plane concepts. Inspect plans, WorkOrders, Attempts, evidence and human decisions, with each capability’s current limits visible. FDLC does not require it.</p>
            <div className="hero-actions"><Link className="button button-dark" href="/mission-control">Inspect Mission Control</Link><a className="button button-light" href={missionControlRepository} rel="noreferrer" target="_blank">Mission Control source ↗</a></div>
          </div>
          <figure className="product-frame"><div><span>MISSION CONTROL / COMMAND CENTER</span><span>DEMO VIEW</span></div><Image src="/mission-control/command-center.png" alt="Mission Control command center showing ranked work that needs operator attention" width={1600} height={1050} sizes="(max-width: 980px) 100vw, 65vw" /><figcaption>Deterministic demo view. Current capability status is documented on the Mission Control page.</figcaption></figure>
        </section>

        <section className="content-section">
          <WhatsRealToday compact />
        </section>

        <section className="content-section adoption-enterprise">
          <div><p className="section-label">Need help applying FDLC?</p><h2>Start with one bounded factory line.</h2></div>
          <div><p>AI-FDE (Preview) helps an accountable human Factory Deployed Engineer turn reviewed enterprise evidence into an approved Factory Definition, ready for qualification on the runtime you choose. FDLC does not require it.</p><div className="hero-actions"><Link className="button button-dark" href="/deploy">Explore AI-FDE</Link><Link className="text-action" href="/enterprise">Enterprise path →</Link></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
