/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FactoryExplorer } from "./components/factory-explorer";
import { GoverningLifecycleDiagram } from "./components/governing-lifecycle-diagram";
import { SectionHeader } from "./components/page-hero";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { GuideStageBridge } from "./components/guide-stage-bridge";
import { WhatsRealToday } from "./components/whats-real-today";
import { governingLifecycle } from "../data/governing-lifecycle";
import { heroHeadline, heroSubhead, homepageActions, homepageExampleSteps, homepageThesis, sdlcToFdlc, workedExampleContrast } from "../data/homepage";
import { evidencePositioning, primaryPositioning } from "../data/fdlc";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Factory Development Lifecycle (FDLC): The SDLC for software built by autonomous AI agents", "FDLC is the open framework for delivering software with autonomous AI agents: one lifecycle, clear checkpoints, and an evidence trail, so agent-written changes ship only after they are verified and approved.", "/");

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
            <h1>{heroHeadline}</h1>
            <p className="hero-lede">{heroSubhead}</p>
            <div className="hero-actions">
              <a className="button button-dark" href="/guide/00-front-matter/00-how-to-read-this-guide">Start reading the FDLC Guide</a>
              <Link className="button button-light" href="/in-5-minutes">Understand FDLC in 5 minutes</Link>
            </div>
            <a className="text-action hero-example-link" href="#worked-example">See a before-and-after example →</a>
            <div className="hero-category-contrast" aria-label="Difference between SDLC and FDLC" role="group">
              <div><span>SDLC</span><p>Governs the lifecycle of <strong>software.</strong></p></div>
              <div><span>FDLC</span><p>Governs the <strong>factory that builds it</strong>: the agents, tools, checks, and people that turn intent into shipped code.</p></div>
            </div>
            <p className="hero-problem">Code generation is becoming abundant. Trusted autonomous software delivery is not.</p>
          </div>
          <aside className="hero-model hero-value-model hero-stage-model" aria-labelledby="hero-model-title">
            <div className="model-chrome"><span>FDLC / ONE LIFECYCLE</span><span>01—09</span></div>
            <h2 id="hero-model-title">Nine stages. Work moves on only with evidence.</h2>
            <ol className="hero-stage-list" aria-label="The nine FDLC stages">
              {governingLifecycle.map((stage, index) => <li key={stage.name}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage.name}</strong></li>)}
            </ol>
            <p className="model-bridge">Each stage has an owner, an output, and a check that must pass before the next one starts.</p>
            <nav aria-label="Explore the lifecycle" className="model-bridge-links">
              <a href="#sdlc-to-fdlc">Compare with the SDLC</a>
              <a href="#lifecycle">Walk through each stage</a>
              <Link href="/framework">Read the framework</Link>
            </nav>
            <div className="model-outcome"><span>Unit of value</span><strong>Verified outcome</strong></div>
          </aside>
        </section>

        <section className="statement-band" aria-label="FDLC category statement">
          <p>FDLC / Category promise</p><strong>{primaryPositioning}</strong><span>{evidencePositioning}</span>
        </section>

        <section className="content-section sdlc-map" id="sdlc-to-fdlc" aria-labelledby="sdlc-to-fdlc-title">
          <SectionHeader eyebrow="If you know the SDLC, you know the shape" id="sdlc-to-fdlc-title" title="The phases you already know, rebuilt for agents doing the work." description="FDLC keeps the familiar software lifecycle. What changes is who does each step and what has to be proven before the work moves on." />
          <div className="sdlc-map-table" role="table" aria-label="SDLC phases mapped to FDLC stages">
            <div className="sdlc-map-row sdlc-map-head" role="row"><span role="columnheader">SDLC phase</span><span role="columnheader">FDLC stage</span><span role="columnheader">What changes when agents do the work</span></div>
            {sdlcToFdlc.map(([phase, stages, change]) => (
              <div className="sdlc-map-row" role="row" key={phase}>
                <span role="cell" className="sdlc-map-phase">{phase}</span>
                <span role="cell" className="sdlc-map-stage">{stages.join(" + ")}</span>
                <span role="cell" className="sdlc-map-change">{change}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="content-section adoption-example" id="worked-example">
          <SectionHeader eyebrow="One illustrative example" title="Modernize a dependency without surrendering control." description="The same task, an agent-driven dependency upgrade, run two ways. The difference is not the agent. It is the system around it." />
          <div className="before-after" aria-label="Dependency upgrade with and without FDLC" role="group">
            <article className="before-after-card is-before">
              <p className="section-label">Before · Agents without FDLC</p>
              <h3>Fast, but you are trusting the agent&apos;s word.</h3>
              <ul>{workedExampleContrast.before.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article className="before-after-card is-after">
              <p className="section-label">After · Agents with FDLC</p>
              <h3>Just as fast, and every step leaves proof.</h3>
              <ul>{workedExampleContrast.after.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>
          <ol className="adoption-example-flow" aria-label="Dependency modernization factory flow">
            {homepageExampleSteps.map(([name, description], index) => <li key={name}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{name}</strong><p>{description}</p></div></li>)}
          </ol>
          <div className="adoption-example-actions"><Link className="button button-dark" href="/in-5-minutes">Follow the complete example</Link><Link className="button button-light" href="/start">Build your Factory Definition</Link></div>
        </section>

        <section className="content-section" id="lifecycle">
          <GoverningLifecycleDiagram />
          <GuideStageBridge />
        </section>

        <div className="content-section factory-explorer-home">
          <FactoryExplorer />
        </div>

        <section className="home-guide-invite" aria-labelledby="home-guide-invite-title">
          <div>
            <p className="section-label">Go deeper</p>
            <h2 id="home-guide-invite-title">Follow the complete FDLC Guide.</h2>
            <p>Move from the factory overview to the chapters on design, agents, evidence, operations, and improvement.</p>
          </div>
          <a className="button button-dark" href="/guide">Browse all chapters →</a>
        </section>

        <section className="content-section try-it" aria-labelledby="try-it-title">
          <p className="section-label">Learn by doing</p>
          <h2 id="try-it-title">Don&apos;t just read about a factory. Break one.</h2>
          <ol className="try-it-grid">
            <li><span>5 minutes</span><h3>Inject a fault</h3><p>Step a run through the artifact chain and watch the factory refuse a bad release.</p><Link className="text-action" href="/simulator">Open the simulator →</Link></li>
            <li><span>30 minutes</span><h3>Run a real gate</h3><p>A zero-dependency Node factory with an independent verifier and a gate you can read in one sitting.</p><Link className="text-action" href="/lab">Run the reference factory →</Link></li>
            <li><span>An afternoon</span><h3>Define your own</h3><p>Load an example, edit it, and export a v0.2 Factory Definition as JSON or YAML.</p><Link className="text-action" href="/start">Open the builder →</Link></li>
          </ol>
        </section>

        <section className="adoption-thesis">
          <div><p className="section-label">Why FDLC</p><h2>Agents become useful when you can trust the system around them.</h2></div>
          <div className="adoption-thesis-grid">
            {homepageThesis.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </section>

        <section className="content-section adoption-actions">
          <SectionHeader eyebrow="Use FDLC now" title="Choose the next useful step." description="Start with the depth that matches your question. Every path leads back to the same lifecycle." />
          <div className="adoption-action-grid">
            {homepageActions.map(([label, description, href, action]) => href.startsWith("/guide")
              ? <a href={href} key={label}><span>{label}</span><p>{description}</p><strong>{action} →</strong></a>
              : <Link href={href} key={label}><span>{label}</span><p>{description}</p><strong>{action} →</strong></Link>)}
          </div>
          <nav className="adoption-reference-links" aria-label="FDLC technical references"><Link href="/framework">Framework</Link><Link href="/architecture">Architecture</Link><a href="/guide">Guide</a><Link href="/mission-control">Mission Control</Link><Link href="/manifesto">Manifesto</Link></nav>
        </section>

        <section className="mission-preview adoption-mission-preview">
          <div className="mission-preview-copy">
            <p className="section-label">Open-source reference implementation</p><h2>See the lifecycle running in Mission Control.</h2>
            <p>Mission Control is the open-source control plane that shows plans, Work Orders, attempts, evidence, approvals, releases, and outcomes for agent work in one place.</p>
            <div className="hero-actions"><Link className="button button-dark" href="/mission-control">Inspect Mission Control</Link><a className="button button-light" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">View source ↗</a></div>
          </div>
          <figure className="product-frame"><div><span>MISSION CONTROL / COMMAND CENTER</span><span>DEMO VIEW</span></div><Image src="/mission-control/command-center.png" alt="Mission Control command center showing ranked work that needs operator attention" width={1600} height={1050} sizes="(max-width: 980px) 100vw, 65vw" /><figcaption>A demo screenshot with sample data. The Mission Control page shows what works today.</figcaption></figure>
        </section>

        <section className="content-section">
          <WhatsRealToday compact />
        </section>

        <section className="content-section adoption-enterprise">
          <div><p className="section-label">Need help applying FDLC?</p><h2>Start with one bounded factory line.</h2></div>
          <div><p>AI-FDE (preview) helps an engineer on your team turn what they learn about your systems into an approved Factory Definition that Mission Control can check.</p><div className="hero-actions"><Link className="button button-dark" href="/deploy">Explore AI-FDE</Link><Link className="text-action" href="/enterprise">Enterprise path →</Link></div></div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
