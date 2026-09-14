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
    <PageHero eyebrow="Interactive guide / 12" variant="compact" title="Build your first software factory." description="Start with one bounded engineering outcome. Define its evidence, authority, deterministic checks, and human control boundaries. FDLC begins with the work—not the agent." meta={[["Output", "Factory Definition"], ["Steps", "05"], ["Privacy", "Browser only"]]}>
      <div className="hero-actions"><a className="button button-dark" href="#factory-builder">Start the builder</a><Link className="text-action" href="/in-5-minutes">See a completed example →</Link></div>
    </PageHero>
    <aside className="builder-orientation"><strong>Before you begin</strong><p>Bring one bounded outcome, observable acceptance criteria, the minimum authority execution needs, and the decisions a human must retain. {factoryDefinitionBridge.definition} {factoryDefinitionBridge.version} {factoryDefinitionBridge.boundary}</p><span>No account · no upload · conceptual output</span></aside>
    <FactoryBuilder />
    <NextSteps {...pageHandoffs.start} />
  </div></SiteShell>;
}
