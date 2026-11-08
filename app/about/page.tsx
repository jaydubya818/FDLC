/* eslint-disable @next/next/no-html-link-for-pages -- Guide links cross the microfrontend boundary. */
import { GuideReference } from "../components/guide-reference";
import { engineeringOwnership } from "../../data/software-factory-engineering";
import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { fdlcRepository } from "../../lib/global-navigation";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("About", "FDLC.ai advances the open operating model, reference architecture, and ecosystem for trusted autonomous software delivery.", "/about");

const reasons = [
  ["A lifecycle", "Factories change faster than the software they produce. They need an explicit method for design, operation, verification, and controlled improvement."],
  ["Evidence", "Probabilistic execution can be useful, but consequential progression needs attributable, exact-current proof."],
  ["Model independence", "Models and coding agents will keep changing. The durable asset is the governed contract around them."],
  ["Working references", "A discipline needs runnable examples with their constraints visible—not only diagrams. The Reference Lab and the optional Mission Control implementation show the contracts working; neither is required."],
  ["An open foundation", "Independent implementations should be able to share artifact semantics, verification contracts, and maturity language."],
] as const;

export default function AboutPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="About FDLC.ai / 10" variant="compact" title="Software factories need engineering discipline, too." description="FDLC is the factory operating system: the disciplined layer around agents, models, tools, people, policies, evidence, and workflows. FDLC.ai is the ecosystem that develops, demonstrates, teaches, and applies it." meta={[["Framework", "Open, stack-independent"], ["Method", "The Guide"], ["Reference", "Mission Control (optional)"]]}>
      <div className="hero-actions"><Link className="button button-dark" href="/framework">Read the canonical definition</Link><Link className="text-action" href="/manifesto">Ten operating principles →</Link></div>
    </PageHero>
    <GuideReference description="Read the AI Software Factory Guide for the detailed methodology, engineering principles, and implementation guidance behind FDLC." />
    <section className="about-thesis"><blockquote>“Autonomy without evidence is just faster guessing.”</blockquote><p>The goal is neither maximum human involvement nor zero human involvement. It is appropriately governed autonomy, earned through measured performance.</p></section>
    <section className="section-block"><SectionHeader eyebrow="Why this exists" title="An open discipline around a moving stack." /><ol className="reason-list">{reasons.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{description}</p></li>)}</ol></section>
    <section className="section-block" id="engineering-discipline">
      <SectionHeader eyebrow="Software Factory Engineering" title="A hands-on systems discipline." description="The practice of designing, building, integrating, operating, measuring and continuously improving systems that produce verified software outcomes. The primary artifact is the factory itself." />
      <p>The engineer builds working interfaces, runtime and recovery mechanisms, knowledge infrastructure, protected verification, governance and production feedback. Prompt writing and agent coordination are parts of this work; the integrated production system is the responsibility.</p>
      <div className="engineering-grid">{engineeringOwnership.map(([area, artifacts, handoff]) => <article key={area}><h3>{area}</h3><p><strong>Artifacts:</strong> {artifacts}</p><p><strong>Decision handoff:</strong> {handoff}</p></article>)}</div>
      <p>One engineer may hold these responsibilities in a small organization; an enterprise may distribute them across teams with explicit interface ownership. Business leaders, domain experts, security owners and service owners keep their decision rights.</p>
      <h3>Build, buy and own the integration</h3><p>Evaluate components on quality, interoperability, security, reliability, observability, operational fit and total cost of ownership, including migration and exit cost. Purchased components still need conformance tests and workload qualification. The factory engineer remains accountable for the reliability of the integrated system.</p>
      <p>Itamar Friedman’s <a href="https://x.com/itamar_mar/status/2118356299612033305" target="_blank" rel="noreferrer">Software Factory Engineer framing ↗</a> is an external conceptual reference. The canonical FDLC glossary and contracts remain authoritative.</p>
      <a className="text-action" href="/guide/05-operate/38-enterprise-adoption-and-the-infrastructure-landscape#software-factory-engineering-ownership">Follow the practical ownership model in the Guide →</a>
    </section>
    <section className="founder-note"><div><p className="section-label">Built in the open</p><h2>FDLC defines the engineering discipline, not the technology stack.</h2></div><div><p>FDLC.ai is led by Jay West, drawing on engineering leadership, quality engineering, automation, platform engineering, and agentic software systems. Use FDLC with your own agents, harnesses, models, tools and runtime. Supporting projects are optional: Mission Control is an open-source reference implementation, AI-FDE (Preview) helps a human Factory Deployed Engineer (FDE) turn evidence into governed implementation intent, and the proposed Enterprise layer is intended to industrialize proven factory lines. Public content is intentionally separated from confidential employer systems and unsupported claims.</p><div className="hero-actions"><Link className="button button-light" href="/manifesto">Read the Manifesto</Link><a className="text-action light-link" href={fdlcRepository} rel="noreferrer" target="_blank">FDLC source on GitHub ↗</a></div></div></section>
    <section className="reading-next"><p className="section-label">Choose your entry point</p><h2>Understand the model, see it run, then build your own.</h2><div><Link href="/in-5-minutes">Experience FDLC in 5 minutes →</Link><Link href="/simulator">Run the factory simulator →</Link><Link href="/start">Define your first factory line →</Link></div></section>
  </div></SiteShell>;
}
