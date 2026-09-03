import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { manifesto } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Manifesto", "Ten principles for governed, verifiable AI software factories.", "/manifesto");

export default function ManifestoPage() {
  return <SiteShell><div className="page-wrap manifesto-page">
    <PageHero eyebrow="FDLC Manifesto / 03" title="Autonomy is useful only when it can be trusted." description="Ten principles for designing AI software factories that are bounded, inspectable, recoverable, and accountable to real outcomes." />
    <ol className="manifesto-list">{manifesto.map((item) => <li key={item.number}>
      <span>{String(item.number).padStart(2, "0")}</span>
      <div><h2>{item.principle}</h2><p>{item.explanation}</p><aside><strong>Implementation implication</strong>{item.implication}</aside></div>
    </li>)}</ol>
    <section className="manifesto-close"><p>Build the system around the agent.</p><h2>Verified delivery,<br />not merely generated code.</h2><div><Link className="button button-light" href="/framework">Read the Framework</Link><Link className="text-action light-link" href="/start">Build your first factory definition →</Link></div></section>
  </div></SiteShell>;
}
