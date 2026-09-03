import type { Metadata } from "next";
import { MaturityAssessment } from "../components/maturity-assessment";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { maturityLevels } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Maturity", "Assess the maturity of your AI software factory across eleven operating dimensions.", "/maturity");

export default function MaturityPage() {
  return <SiteShell><div className="page-wrap maturity-page">
    <PageHero eyebrow="FDLC maturity / 11" title="How mature is your software factory?" description="Maturity is the quality of your operating system for autonomous work: intent, authority, execution, verification, oversight, observability, reuse, and learning." />
    <ol className="maturity-overview">{maturityLevels.map((level) => <li key={level.level}><span>L{level.level}</span><div><h2>{level.name}</h2><p>{level.description}</p><small>{level.operatingModel}</small></div></li>)}</ol>
    <section className="section-block"><SectionHeader eyebrow="Assessment" title="Score what is demonstrably true today." description="This is an educational diagnostic, not certification. The useful output is the next control or evidence gap to close." /><MaturityAssessment /></section>
  </div></SiteShell>;
}
