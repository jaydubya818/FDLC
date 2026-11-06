import { GuideReference } from "../components/guide-reference";
import { ReferenceDiagram } from "../components/reference-diagrams";
import type { Metadata } from "next";
import Link from "next/link";
import { MaturityAssessment } from "../components/maturity-assessment";
import { NextSteps } from "../components/next-steps";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { MaturityJourney } from "../components/maturity-journey";
import { pageHandoffs } from "../../data/page-handoffs";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Maturity", "Assess the maturity of your AI software factory across eleven operating dimensions.", "/maturity");

export default function MaturityPage() {
  return <SiteShell><div className="page-wrap maturity-page">
    <PageHero eyebrow="FDLC maturity / 11" variant="compact" title="How mature is your software factory?" description="Maturity is the quality of your operating system for autonomous work: intent, authority, execution, verification, oversight, observability, reuse, and learning." meta={[["Levels", "L0–L5"], ["Dimensions", "11"], ["Privacy", "Browser only"]]}>
      <div className="hero-actions"><a className="button button-dark" href="#assessment">Start the assessment</a><Link className="text-action" href="/framework#measurement">How FDLC measures →</Link></div>
    </PageHero>
    <GuideReference description="Turn assessment gaps into practical next steps with chapters on verification, operations, governance, and continuous improvement." />
    <section className="maturity-model" aria-labelledby="maturity-model-title">
      <div className="maturity-model-intro">
        <p className="section-label">The maturity journey</p>
        <h2 id="maturity-model-title">Capability must be earned in sequence.</h2>
        <p>Each level describes what the factory can reliably operate today and the next capability needed to progress. More agents do not create maturity; stronger controls and better evidence do.</p>
      </div>
      <MaturityJourney />
    </section>
    <section className="section-block" id="operating-domains">
      <SectionHeader eyebrow="Bounded autonomy" title="Assess each operating domain." description="Earn autonomy for a workload class, Factory Version and operating environment. A documentation corridor does not qualify migrations, authentication changes or production deployment." />
      <ReferenceDiagram name="autonomy" />
      <p>Expand scope only after representative evaluation, composition qualification, current evidence and explicit delegation. Revoke or narrow it when assumptions fail. Human decision rights remain explicit even when routine progression is autonomous.</p>
      <p>Itamar Friedman’s <a href="https://x.com/itamar_mar/status/2118356299612033305" target="_blank" rel="noreferrer">L4 Autonomous Software Factories concept ↗</a> is an external autonomy reference. It does not replace FDLC’s maturity levels, establish a universal certification or assert that FDLC has achieved L4.</p>
      <Link className="text-action" href="/enterprise#operating-domains">Compare workload conditions and authority →</Link>
    </section>
    <section className="section-block" id="assessment"><SectionHeader eyebrow="Assessment" title="Score what is demonstrably true today." description="This is an educational diagnostic, not certification. The useful output is the next control or evidence gap to close." /><MaturityAssessment /></section>
    <NextSteps {...pageHandoffs.maturity} />
  </div></SiteShell>;
}
