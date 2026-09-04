import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "../components/architecture-diagram";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { architectureAreas } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Architecture", "Explore the six capability areas of the FDLC architecture: Intent, Harness, Capability, Model, Trust, and Learning.", "/architecture");

const contents = [
  { label: "Overview", href: "#overview" },
  { label: "Intent", href: "#intent" },
  { label: "Harness", href: "#harness" },
  { label: "Capability", href: "#capability" },
  { label: "Model", href: "#model" },
  { label: "Trust", href: "#trust" },
  { label: "Learning", href: "#learning" },
  { label: "System flow", href: "#system-flow" },
] as const;

export default function ArchitecturePage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="Reference architecture / 02" title="Six areas. Explicit boundaries." description="An AI software factory is a system of responsibilities. The architecture makes each responsibility visible so teams can decide what to build, buy, govern, verify, and operate." />
    <PageContentsNav items={contents} />
    <section className="architecture-overview" id="overview"><ArchitectureDiagram /><p>Trust constrains every area. Learning closes the loop only through governed promotion. The model is replaceable; the control contract is not.</p></section>

    <StateBoundary />

    <section className="section-block architecture-details">
      <SectionHeader eyebrow="Capability map" title="Inspect each area as an operating contract." description="Purpose describes why the area exists. Responsibilities and components describe what it owns. Decisions and failure modes reveal what must remain explicit." />
      {architectureAreas.map((area) => <article id={area.id} key={area.id}>
        <header><span>{String(area.number).padStart(2, "0")}</span><div><p>Architecture area</p><h2>{area.name}</h2><strong>{area.short}</strong></div><p>{area.purpose}</p></header>
        <div className="architecture-detail-grid">
          <section><h3>Responsibilities</h3><ul>{area.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Common components</h3><ul>{area.components.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Required decisions</h3><ul>{area.decisions.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Failure modes</h3><ul>{area.failureModes.map((item) => <li key={item}>{item}</li>)}</ul></section>
          <section><h3>Maturity progression</h3><ol>{area.maturity.map((item, index) => <li key={item}><span>L{index + 1}</span>{item}</li>)}</ol></section>
          <section><h3>Examples</h3><ul>{area.examples.map((item) => <li key={item}>{item}</li>)}</ul></section>
        </div>
        <p className="relationship"><span>Relationship</span>{area.relationships}</p>
      </article>)}
    </section>

    <section className="factory-system-diagram" id="system-flow">
      <SectionHeader eyebrow="Software factory concept" title="Authority flows down. Evidence flows back." />
      <div className="system-map" aria-label="Software factory concept from human intent through control, execution, evidence, outcome, and learning" role="group">
        <div className="system-map-human"><span>Humans</span><strong>Intent + policy</strong><small>Own goals, judgment, and material risk</small></div>
        <div className="system-map-control"><span>Control plane</span><strong>Plan · govern · route</strong><small>Identity, authority, budget, and state</small></div>
        <div className="system-map-supply"><span>Capability supply</span><strong>Agents · models · skills · tools · context</strong></div>
        <div className="system-map-execution"><span>Execution</span><strong>Harness + isolated environment</strong><small>Attempts, leases, checkpoints, recovery</small></div>
        <div className="system-map-proof"><span>Trust</span><strong>Evidence + independent verification</strong><small>Policy and human approval at consequence</small></div>
        <div className="system-map-outcome"><span>Outcome</span><strong>Accepted, observed value</strong><small>Feeds governed learning—not direct mutation</small></div>
      </div>
    </section>

    <section className="reading-next"><p className="section-label">Continue</p><h2>Move from architecture to implementation.</h2><div><Link href="/guide/build">Build the capability stack →</Link><Link href="/mission-control">Inspect Mission Control →</Link><Link href="/start">Design a factory line →</Link></div></section>
  </div></SiteShell>;
}
