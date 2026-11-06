import type { Metadata } from "next";
import { NextSteps } from "../components/next-steps";
import { PageHero } from "../components/page-hero";
import { RuntimeSimulator } from "../components/runtime-simulator";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";
import "./simulator.css";

export const metadata: Metadata = pageMetadata("Runtime Simulator", "Step an artifact chain through a software factory and inject faults to see which gate blocks the release.", "/simulator");

export default function SimulatorPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="Interactive / Runtime" variant="compact" status="Deterministic demo" title="Fix a failing API test. Earn every transition." description="Follow intent through WorkOrder, qualified factory selection, Task routing, producer and verifier Attempts, evidence and authorization. See a failed check block progression and a human decision remain explicit." />
    <aside className="builder-orientation"><strong>Experience the engineering boundaries</strong><p>This browser model uses synthetic records. It executes no code and grants no real authority. You can implement the same contracts with your preferred agents, harnesses, models and infrastructure; Mission Control is optional.</p><span>Browser only · deterministic · no account required</span></aside>
    <noscript><p>Enable JavaScript for the interactive demonstration, or <a href="/lab">run the documented Reference Lab locally</a>.</p></noscript>
    <RuntimeSimulator />
    <NextSteps eyebrow="Next" title="Reproduce the boundaries in code." links={[["/lab", "Build and run your first factory"], ["/start", "Define your factory"], ["/guide/appendix/engineering-experience#qualification", "Inspect qualification requirements"]]} />
  </div></SiteShell>;
}
