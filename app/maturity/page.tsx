import type { Metadata } from "next";
import Link from "next/link";
import { MaturityAssessment } from "../components/maturity-assessment";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { maturityLevels } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Maturity", "Assess the maturity of your AI software factory across eleven operating dimensions.", "/maturity");

export default function MaturityPage() {
  return <SiteShell><div className="page-wrap maturity-page">
    <PageHero eyebrow="FDLC maturity / 11" variant="compact" title="How mature is your software factory?" description="Maturity is the quality of your operating system for autonomous work: intent, authority, execution, verification, oversight, observability, reuse, and learning." meta={[["Levels", "L0–L5"], ["Dimensions", "11"], ["Privacy", "Browser only"]]}>
      <div className="hero-actions"><a className="button button-dark" href="#assessment">Start the assessment</a><Link className="text-action" href="/framework#measurement">How FDLC measures →</Link></div>
    </PageHero>
    <section className="maturity-model" aria-labelledby="maturity-model-title">
      <div className="maturity-model-intro">
        <p className="section-label">The maturity journey</p>
        <h2 id="maturity-model-title">Capability must be earned in sequence.</h2>
        <p>Each level describes what the factory can reliably operate today and the next capability needed to progress. More agents do not create maturity; stronger controls and better evidence do.</p>
      </div>
      <ol className="maturity-overview">{maturityLevels.map((level) => <li key={level.level}><span>L{level.level}</span><div><h3>{level.name}</h3><p>{level.description}</p><dl><div><dt>Operating model</dt><dd>{level.operatingModel}</dd></div><div><dt>Next capability to earn</dt><dd>{level.nextMove}</dd></div></dl></div></li>)}</ol>
    </section>
    <section className="section-block" id="assessment"><SectionHeader eyebrow="Assessment" title="Score what is demonstrably true today." description="This is an educational diagnostic, not certification. The useful output is the next control or evidence gap to close." /><MaturityAssessment /></section>
    <section className="reading-next"><p className="section-label">Turn the result into work</p><h2>Improve one control boundary at a time.</h2><div><Link href="/start">Define a factory line →</Link><Link href="/architecture">Inspect the architecture →</Link><Link href="/benchmarks">Establish outcome measures →</Link></div></section>
  </div></SiteShell>;
}
