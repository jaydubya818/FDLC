import type { Metadata } from "next";
import { FactoryBuilder } from "../components/factory-builder";
import { PageHero } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Build Your First Software Factory", "Turn one engineering outcome into a conceptual FDLC Factory Definition.", "/start");

export default function StartPage() {
  return <SiteShell><div className="page-wrap start-page">
    <PageHero eyebrow="Interactive guide / 12" title="Build your first software factory." description="Start with one bounded engineering outcome. Define its evidence, authority, deterministic checks, and human control boundaries. FDLC begins with the work—not the agent." />
    <FactoryBuilder />
  </div></SiteShell>;
}
