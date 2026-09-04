import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { manifesto } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Manifesto", "Ten principles for designing AI software factories that are bounded, inspectable, recoverable, and accountable to real outcomes.", "/manifesto");

export default function ManifestoPage() {
  return <SiteShell><div className="page-wrap manifesto-page">
    <PageHero eyebrow="FDLC Manifesto / 03" title="Autonomy is useful only when it can be trusted." description="Ten principles for designing AI software factories that are bounded, inspectable, recoverable, and accountable to real outcomes." />
    <section className="manifesto-intro" aria-label="How to use the FDLC Manifesto">
      <p>These principles are the operating invariants of the Factory Development Lifecycle.</p>
      <p>They apply whether you use Mission Control, another control plane, or your own implementation.</p>
    </section>
    <p className="manifesto-list-heading section-label">The ten principles</p>
    <ol className="manifesto-list">{manifesto.map((item) => <li key={item.number}>
      <span>{String(item.number).padStart(2, "0")}</span>
      <div><h2>{item.principle}</h2><p>{item.explanation}</p><aside><strong>Implementation implication</strong>{item.implication}</aside></div>
    </li>)}</ol>
    <section className="manifesto-invariant">
      <StateBoundary eyebrow="The operational invariant" explanation="These are distinct states with distinct owners and evidence requirements. Collapsing them turns a governed factory into faster guessing." mode="primary" />
    </section>
    <section className="manifesto-close"><p>Build the system around the agent.</p><h2>Verified delivery,<br />not merely generated code.</h2><div><Link className="button button-light" href="/in-5-minutes">Understand FDLC in 5 minutes</Link><Link className="button button-light" href="/framework">Explore the Framework</Link><Link className="text-action light-link" href="/architecture">Architecture →</Link><Link className="text-action light-link" href="/mission-control">Mission Control →</Link></div></section>
  </div></SiteShell>;
}
