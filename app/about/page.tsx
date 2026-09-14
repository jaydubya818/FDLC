import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("About", "FDLC.ai advances the open operating model, reference architecture, and ecosystem for trusted autonomous software delivery.", "/about");

const reasons = [
  ["A lifecycle", "Factories change faster than the software they produce. They need an explicit method for design, operation, verification, and controlled improvement."],
  ["Evidence", "Probabilistic execution can be useful, but consequential progression needs attributable, exact-current proof."],
  ["Model independence", "Models and coding agents will keep changing. The durable asset is the governed contract around them."],
  ["Mission Control", "A category needs a working reference implementation with its constraints visible—not only diagrams."],
  ["An open foundation", "Independent implementations should be able to share artifact semantics, verification contracts, and maturity language."],
] as const;

export default function AboutPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="About FDLC.ai / 10" variant="compact" title="Software factories need engineering discipline, too." description="FDLC is the factory operating system: the disciplined layer around agents, models, tools, people, policies, evidence, and workflows. FDLC.ai is the ecosystem that develops, demonstrates, teaches, and applies it." meta={[["Framework", "Open discipline"], ["Reference", "Mission Control"], ["Method", "The Guide"]]}>
      <div className="hero-actions"><Link className="button button-dark" href="/framework">Read the canonical definition</Link><Link className="text-action" href="/manifesto">Ten operating principles →</Link></div>
    </PageHero>
    <section className="about-thesis"><blockquote>“Autonomy without evidence is just faster guessing.”</blockquote><p>The goal is neither maximum human involvement nor zero human involvement. It is appropriately governed autonomy, earned through measured performance.</p></section>
    <section className="section-block"><SectionHeader eyebrow="Why this exists" title="An open discipline around a moving stack." /><ol className="reason-list">{reasons.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{description}</p></li>)}</ol></section>
    <section className="founder-note"><div><p className="section-label">Built in the open</p><h2>FDLC defines it. AI-FDE discovers and designs it. Mission Control governs it.</h2></div><div><p>FDLC.ai is led by Jay West, drawing on engineering leadership, quality engineering, automation, platform engineering, and agentic software systems. AI-FDE helps a human Factory Deployed Engineer turn evidence into governed implementation intent; the proposed Enterprise layer is intended to industrialize proven factory lines. Public content is intentionally separated from confidential employer systems and unsupported claims.</p><div className="hero-actions"><Link className="button button-light" href="/manifesto">Read the Manifesto</Link><a className="text-action light-link" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Explore the source ↗</a></div></div></section>
    <section className="reading-next"><p className="section-label">Choose your entry point</p><h2>Understand the model, inspect the implementation, or try the method.</h2><div><Link href="/in-5-minutes">Understand FDLC →</Link><Link href="/mission-control">Inspect Mission Control →</Link><Link href="/start">Build a Factory Definition →</Link></div></section>
  </div></SiteShell>;
}
