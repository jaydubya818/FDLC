import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FactoryExplorer } from "./components/factory-explorer";
import { SectionHeader } from "./components/page-hero";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { heroContrast, heroName, heroSubhead, heroValue, homepageExampleSteps, homepageProblems, sdlcToFdlc, workedExampleContrast } from "../data/homepage";
import { pageMetadata } from "../lib/metadata";

export const metadata: Metadata = pageMetadata("Factory Development Lifecycle (FDLC): The SDLC for software built by autonomous AI agents", "FDLC is the open framework for delivering software with autonomous AI agents: one lifecycle, clear checkpoints, and an evidence trail, so agent-written changes ship only after they are verified and approved.", "/");

const guideStart = "/guide/00-front-matter/00-how-to-read-this-guide";
const evidenceTrail = ["Intent written", "Tests attached", "Independently verified", "Owner approved"] as const;

// Renders "Factory Development Lifecycle" with the four letters of the acronym marked.
function FdlcName() {
  return (
    <h1 className="fdlc-name">
      <span><b>F</b>actory</span>{" "}
      <span><b>D</b>evelopment</span>{" "}
      <span><b>L</b>ife<b>c</b>ycle</span>
    </h1>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero-shell home-hero" aria-label={`FDLC: ${heroName}`}>
          <div className="hero-copy">
            <p className="fdlc-wordmark" aria-hidden="true"><span>F</span><span>D</span><span>L</span><span>C</span></p>
            <FdlcName />
            <p className="home-hero-subhead">{heroSubhead}</p>
            <p className="hero-lede">{heroValue}</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/in-5-minutes">Understand FDLC in 5 minutes</Link>
              <a className="button button-light" href={guideStart}>Read the FDLC Guide</a>
            </div>
            <p className="home-hero-meta">Open framework · v0.1 · Free to use</p>
          </div>
          <aside className="hero-model home-contrast" aria-labelledby="home-contrast-title">
            <div className="model-chrome"><span>ONE CHANGE / TWO LIFECYCLES</span><span>SDLC · FDLC</span></div>
            <h2 id="home-contrast-title">Same software. Different questions.</h2>
            <div className="home-contrast-table" role="table" aria-label="How the SDLC and FDLC answer the same questions">
              <div className="home-contrast-row home-contrast-head" role="row"><span role="columnheader">Question</span><span role="columnheader">SDLC</span><span role="columnheader">FDLC</span></div>
              {heroContrast.map(([question, sdlc, fdlc]) => (
                <div className="home-contrast-row" role="row" key={question}>
                  <span role="rowheader">{question}</span>
                  <span role="cell">{sdlc}</span>
                  <span role="cell">{fdlc}</span>
                </div>
              ))}
            </div>
            <div className="home-evidence-trail">
              <p>Every change carries its proof</p>
              <ol aria-label="Example evidence trail for one change">
                {evidenceTrail.map((step) => <li key={step}><span aria-hidden="true">✓</span>{step}</li>)}
                <li className="is-ship"><span aria-hidden="true">→</span>Ships</li>
              </ol>
            </div>
          </aside>
        </section>

        <section className="content-section home-problem" id="problem" aria-labelledby="home-problem-title">
          <SectionHeader eyebrow="Why the old SDLC breaks" id="home-problem-title" title="Agents write code faster than the old process can trust it." description="The classic SDLC assumes people write the code and people check it. Once agents do most of the writing, three things stop working." />
          <ol className="home-problem-grid">
            {homepageProblems.map(([number, title, description]) => <li key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></li>)}
          </ol>
        </section>

        <section className="content-section sdlc-map" id="sdlc-to-fdlc" aria-labelledby="sdlc-to-fdlc-title">
          <SectionHeader eyebrow="SDLC → FDLC · The nine stages" id="sdlc-to-fdlc-title" title="The phases you already know, rebuilt for agents doing the work." description="FDLC keeps the familiar lifecycle and names nine stages. What changes is who does each step and what has to be proven before the work moves on." />
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
          <p className="sdlc-map-note">Reading the Guide? Its eight chapters group these nine stages from the builder&apos;s seat. <Link href="/framework#guide-stage-bridge">See how they line up →</Link></p>
        </section>

        <section className="content-section adoption-example" id="worked-example" aria-labelledby="worked-example-title">
          <SectionHeader eyebrow="Example · A dependency upgrade" id="worked-example-title" title="Upgrade a dependency without losing control." description="The same task, run two ways. The difference is not the agent. It is the process around it." />
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
          <ol className="adoption-example-flow" aria-label="Dependency upgrade, step by step">
            {homepageExampleSteps.map(([name, description], index) => <li key={name}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{name}</strong><p>{description}</p></div></li>)}
          </ol>
          <div className="adoption-example-actions"><Link className="text-action" href="/in-5-minutes">Follow the complete example →</Link></div>
        </section>

        <div className="content-section factory-explorer-home" id="lifecycle">
          <FactoryExplorer />
        </div>

        <section className="content-section try-it" aria-labelledby="try-it-title">
          <p className="section-label">Try it</p>
          <h2 id="try-it-title">Don&apos;t just read about it. Break something.</h2>
          <ol className="try-it-grid">
            <li><span>5 minutes</span><h3>Inject a fault</h3><p>Step a change through the lifecycle and watch FDLC refuse a bad release.</p><Link className="text-action" href="/simulator">Open the simulator →</Link></li>
            <li><span>30 minutes</span><h3>Run a real check</h3><p>A small Node project with an independent verifier and a release check you can read in one sitting.</p><Link className="text-action" href="/lab">Run the reference lab →</Link></li>
            <li><span>An afternoon</span><h3>Describe your own</h3><p>Start from an example, edit it, and export your own lifecycle setup as JSON or YAML.</p><Link className="text-action" href="/start">Open the builder →</Link></li>
          </ol>
        </section>

        <section className="mission-preview adoption-mission-preview" aria-labelledby="home-mission-title">
          <div className="mission-preview-copy">
            <p className="section-label">Open-source reference implementation</p><h2 id="home-mission-title">See FDLC running in Mission Control.</h2>
            <p>Mission Control is the open-source dashboard that runs this lifecycle: plans, agent runs, evidence, approvals, and releases in one place.</p>
            <div className="hero-actions"><Link className="button button-dark" href="/mission-control">Inspect Mission Control</Link><a className="button button-light" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">View source ↗</a></div>
          </div>
          <figure className="product-frame"><div><span>MISSION CONTROL / COMMAND CENTER</span><span>DEMO VIEW</span></div><Image src="/mission-control/command-center.png" alt="Mission Control command center showing ranked work that needs operator attention" width={1600} height={1050} sizes="(max-width: 980px) 100vw, 65vw" /><figcaption>A demo screenshot with sample data.</figcaption></figure>
        </section>

        <section className="home-closing" aria-labelledby="home-closing-title">
          <div>
            <p className="section-label">Start here</p>
            <h2 id="home-closing-title">Put your agents on a lifecycle you can trust.</h2>
            <p>Read the Guide end to end, or find out where your team stands today.</p>
          </div>
          <div className="home-closing-actions">
            <a className="button button-light" href={guideStart}>Read the FDLC Guide</a>
            <Link className="button button-outline-light" href="/maturity">Assess your maturity</Link>
            <Link className="text-action" href="/framework#whats-real">What&apos;s available today →</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
