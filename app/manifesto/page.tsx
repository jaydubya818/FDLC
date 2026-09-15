import type { Metadata } from "next";
import Link from "next/link";
import { GuideReading } from "../components/guide-reading";
import { NextSteps } from "../components/next-steps";
import { PageContentsNav } from "../components/page-contents-nav";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { manifesto } from "../../data/fdlc";
import { pageHandoffs } from "../../data/page-handoffs";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Manifesto", "Ten principles for designing AI software factories that are bounded, inspectable, recoverable, and accountable to real outcomes.", "/manifesto");

const principleIndex = ["Explicit intent", "Governed plans", "Bounded authority", "Safe execution", "Independent verification", "Evidence gates", "Earned autonomy", "Human judgment", "Governed learning", "Verified outcomes"] as const;
const contents = principleIndex.map((label, index) => ({ label: `${String(index + 1).padStart(2, "0")} ${label}`, href: `#principle-${index + 1}` as `#${string}` }));

export default function ManifestoPage() {
  return <SiteShell><div className="page-wrap manifesto-page">
    <header className="manifesto-hero">
      <p className="section-label">FDLC Manifesto / 03</p>
      <div className="manifesto-hero-grid">
        <h1>Autonomy is useful only when it can be <span>trusted.</span></h1>
        <div className="manifesto-hero-aside">
          <p>Ten principles for designing AI software factories that are bounded, inspectable, recoverable, and accountable to real outcomes.</p>
          <dl className="manifesto-hero-facts">
            <div><dt>Operating principles</dt><dd>10</dd></div>
            <div><dt>State boundaries</dt><dd>05</dd></div>
            <div><dt>Unit of value</dt><dd>Verified outcomes</dd></div>
          </dl>
        </div>
      </div>
    </header>
    <section className="manifesto-intro" aria-label="How to use the FDLC Manifesto">
      <p>These principles are the operating invariants of the Factory Development Lifecycle.</p>
      <p>They apply whether you use Mission Control, another control plane, or your own implementation.</p>
    </section>
    <PageContentsNav items={contents} title="Manifesto principles" />
    <nav className="manifesto-index" aria-label="Manifesto principles">
      <div><p className="section-label">The ten principles</p><strong>Read in sequence or jump directly.</strong></div>
      <ol>{principleIndex.map((label, index) => <li key={label}><a href={`#principle-${index + 1}`}><span>{String(index + 1).padStart(2, "0")}</span><strong>{label}</strong></a></li>)}</ol>
    </nav>
    <ol className="manifesto-list">{manifesto.map((item) => <li id={`principle-${item.number}`} key={item.number}>
      <span>{String(item.number).padStart(2, "0")}</span>
      <div><p className="manifesto-principle-topic">{principleIndex[item.number - 1]}</p><h2>{item.principle}</h2><p>{item.explanation}</p><aside aria-label={`Implementation implication for principle ${item.number}`}><strong>Implementation implication</strong><p>{item.implication}</p></aside></div>
    </li>)}</ol>
    <section className="manifesto-invariant">
      <StateBoundary eyebrow="The operational invariant" explanation="These are distinct states with distinct owners and evidence requirements. Collapsing them turns a governed factory into faster guessing." mode="primary" warning="Autonomy without evidence is just faster guessing." />
    </section>
    <GuideReading page="manifesto" />
    <NextSteps {...pageHandoffs.manifesto} />
    <section className="manifesto-close"><p>Build the system around the agent.</p><h2>Verified delivery,<br />not merely generated code.</h2><div><Link className="button button-light" href="/in-5-minutes">Understand FDLC in 5 minutes</Link><Link className="button button-light" href="/framework">Explore the Framework</Link><Link className="text-action light-link" href="/architecture">Architecture →</Link><Link className="text-action light-link" href="/mission-control">Mission Control →</Link></div></section>
  </div></SiteShell>;
}
