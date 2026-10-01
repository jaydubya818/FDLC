import type { Metadata } from "next";
import { NextSteps } from "../components/next-steps";
import { PageHero } from "../components/page-hero";
import { RuntimeSimulator } from "../components/runtime-simulator";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Runtime Simulator", "Step an artifact chain through a software factory and inject faults to see which gate blocks the release.", "/simulator");

export default function SimulatorPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="Interactive / Runtime" variant="compact" status="Illustrative" title="Watch a factory block a bad release." description="Step one run through intent, plan, work order, attempt, evidence, decision, release and outcome. Inject a fault and see where the line stops." />
    <aside className="builder-orientation"><strong>What this models</strong><p>A state machine over the artifact chain, with four fault types. It is a teaching model, not a runtime: nothing here executes agents or touches your systems.</p><span>Browser only · deterministic · illustrative</span></aside>
    <RuntimeSimulator />
    <NextSteps eyebrow="Next" title="Run it for real, or define your own." links={[["/lab", "Run the reference factory"], ["/start", "Define your factory"], ["/framework#protocol", "Read the protocol"]]} />
  </div></SiteShell>;
}
