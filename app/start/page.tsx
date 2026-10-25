import { FactoryHandoffDiagram } from "../components/factory-handoff-diagram";
import type { Metadata } from "next";
import Link from "next/link";
import { FactoryBuilder } from "../components/factory-builder";
import { NextSteps } from "../components/next-steps";
import { PageHero } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { factoryDefinitionBridge } from "../../data/maturity-actions";
import { pageHandoffs } from "../../data/page-handoffs";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Build Your First Software Factory", "Turn one engineering outcome into a conceptual FDLC Factory Definition.", "/start");

export default function StartPage() {
  return <SiteShell><div className="page-wrap start-page">
    <PageHero eyebrow="Interactive guide / 12" variant="compact" title="Define your first factory line." description="Start with one bounded engineering outcome. Define its evidence, authority, deterministic checks, and human control boundaries. FDLC begins with the work—not the agent." meta={[["Output", "Factory Definition"], ["Steps", "05"], ["Privacy", "Browser only"]]}>
      <div className="hero-actions"><a className="button button-dark" href="#factory-builder">Start the builder</a><Link className="text-action" href="/in-5-minutes">See a completed example →</Link></div>
    </PageHero>
    <aside className="builder-orientation"><strong>Before you begin</strong><p>Bring one outcome, measurable acceptance criteria, and the actions a human must approve. {factoryDefinitionBridge.boundary}</p><span>No account · no upload · conceptual output</span></aside>
    <aside className="guide-reference" aria-label="Try the Factory Skills Starter Kit"><div><h2>Ready to try a small workflow?</h2><p>Run a bounded bug fix with your Skillz skills, an isolated branch, and before/after test evidence.</p></div><Link className="button button-dark" href="/factory-skills">Try the starter kit →</Link></aside>
    <FactoryBuilder />
    <FactoryHandoffDiagram builder />
    <NextSteps {...pageHandoffs.start} />
  </div></SiteShell>;
}
