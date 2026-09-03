import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("About", "Why the Factory Development Lifecycle exists and why its framework and reference implementation are open.", "/about");

const reasons = [
  ["A lifecycle", "Factories change faster than the software they produce. They need an explicit method for design, operation, verification, and controlled improvement."],
  ["Evidence", "Probabilistic execution can be useful, but consequential progression needs attributable, exact-current proof."],
  ["Model independence", "Models and coding agents will keep changing. The durable asset is the governed contract around them."],
  ["Mission Control", "A category needs a working reference implementation with its constraints visible—not only diagrams."],
  ["An open foundation", "Independent implementations should be able to share artifact semantics, verification contracts, and maturity language."],
] as const;

export default function AboutPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="About FDLC.ai / 10" title="Software factories need engineering discipline, too." description="FDLC.ai exists because the industry is learning how to generate software faster than it is learning how to govern, verify, operate, and improve the systems doing the generation." />
    <section className="about-thesis"><blockquote>“Autonomy without evidence is faster guessing.”</blockquote><p>The goal is neither maximum human involvement nor zero human involvement. It is appropriately governed autonomy, earned through measured performance.</p></section>
    <section className="section-block"><SectionHeader eyebrow="Why this exists" title="An open discipline around a moving stack." /><ol className="reason-list">{reasons.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{description}</p></li>)}</ol></section>
    <section className="founder-note"><div><p className="section-label">Built in the open</p><h2>Framework, field guide, and working reference.</h2></div><div><p>FDLC.ai is led by Jay West, drawing on engineering leadership, quality engineering, automation, platform engineering, and agentic software systems. Public content is intentionally separated from confidential employer systems and claims.</p><div className="hero-actions"><Link className="button button-light" href="/manifesto">Read the Manifesto</Link><a className="text-action light-link" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Explore the source ↗</a></div></div></section>
  </div></SiteShell>;
}
