import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { factoryLines } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Deploy", "Apply FDLC in a real customer environment, prove one bounded factory line, and turn recurring challenges into reusable capabilities.", "/deploy");

const engagements = [
  ["01", "FDLC Readiness", "Find the right first line.", ["Current maturity", "Candidate workflows", "Baseline metrics", "Governance and architecture", "Lighthouse opportunity"]],
  ["02", "FDLC Lighthouse", "Implement one bounded production line.", ["Speed and cycle time", "Quality and defects", "Attributable cost", "Human effort", "Verification reliability"]],
  ["03", "FDLC Scale", "Expand a proven operating model.", ["Repositories", "Teams", "Workflow classes", "Shared capabilities", "Organization controls"]],
] as const;

export default function DeployPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="FDLC Deploy / 09" status="Design partner" variant="compact" title="Implement one factory line where it must actually work." description="A forward-deployed path for applying FDLC in real customer environments, proving a governed and measurable workflow, and turning recurring challenges into reusable factory capabilities. No pricing or packaged availability is published yet." meta={[["First scope", "One factory line"], ["Proof", "Measured baseline"], ["Pricing", "Not published"]]}>
      <div className="hero-actions"><Link className="button button-dark" href="/maturity">Assess readiness</Link><Link className="button button-light" href="/start">Define your first line</Link></div>
    </PageHero>
    <section className="section-block"><SectionHeader eyebrow="Engagement model" title="Three phases. One evidence trail." /><div className="engagement-grid">{engagements.map(([number, name, headline, items]) => <article key={name}><span>{number}</span><h2>{name}</h2><strong>{headline}</strong><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}</div></section>
    <section className="section-block"><SectionHeader eyebrow="Good lighthouse candidates" title="Start with bounded, repetitive, verifiable work." description="The first factory line should have clear evidence and business value. Fully autonomous greenfield product development is a poor first proof." /><div className="factory-line-grid">{factoryLines.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}</div></section>
    <section className="restrained-cta"><div><p className="section-label">Design partnership</p><h2>Bring one real workflow and its current baseline.</h2></div><div><p>Begin with the maturity assessment and Factory Definition. Direct intake is intentionally not open until the engagement model and privacy path are ready; the preparation tools are available now.</p><div className="hero-actions"><Link className="button button-light" href="/maturity">Assess readiness</Link><Link className="text-action light-link" href="/start">Build a Factory Definition →</Link></div></div></section>
  </div></SiteShell>;
}
