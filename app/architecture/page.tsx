/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */
import { contextSkillsPractices } from "../../data/context-skills-practices";
import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "../components/architecture-diagram";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { ResponsiveDetails } from "../components/responsive-details";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { architectureAreas } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Architecture", "Explore the six capability areas of the FDLC architecture: Intent, Harness, Capability, Model, Trust, and Learning.", "/architecture");

const contents = [
  { label: "Overview", href: "#overview" },
  { label: "Control boundary", href: "#control-boundary" },
  { label: "01 Intent", href: "#intent" },
  { label: "02 Harness", href: "#harness" },
  { label: "03 Capability", href: "#capability" },
  { label: "04 Model", href: "#model" },
  { label: "05 Trust", href: "#trust" },
  { label: "06 Learning", href: "#learning" },
  { label: "Context & skills", href: "#context-skills" },
  { label: "System flow", href: "#system-flow" },
] as const;

const guideByArea = {
  intent: "/guide/design",
  harness: "/guide/build",
  capability: "/guide/build",
  model: "/guide/build",
  trust: "/guide/prove",
  learning: "/guide/improve",
} as const;

export default function ArchitecturePage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="Reference architecture / 02" title="Six areas. Explicit boundaries." description="An AI software factory is a system of responsibilities. The architecture makes each responsibility visible so teams can decide what to build, buy, govern, verify, and operate." meta={[["Capability areas", "06"], ["System flow", "Authority ↘ Evidence ↖"], ["Reading time", "≈ 10 min"]]} />
    <div className="longform-layout">
    <PageContentsNav items={contents} mobileTitle="Jump to area" title="Architecture areas" variant="rail" />
    <div className="longform-content">
    <section className="architecture-overview" id="overview"><ArchitectureDiagram /><p>Trust constrains every area. Learning closes the loop only through governed promotion. The model is replaceable; the control contract is not.</p></section>

    <section className="architecture-control-boundary" id="control-boundary">
      <SectionHeader eyebrow="The control boundary" title="Intelligence can change. Authority cannot be implicit." description="Models reason and agents act, but neither should own identity, permission, authoritative state, release policy, or the evidence used to judge its work. Those responsibilities belong to the factory around them." />
      <div className="control-boundary-map" aria-label="Intelligence supply, factory control plane, and bounded execution environment" role="group">
        <article className="control-boundary-supply"><span>01 / Intelligence supply</span><h3>Models reason.<br />Agents act.</h3><p>Selected for the exact Work Order by capability and operating constraints.</p><ul><li>Task and complexity fit</li><li>Quality and risk profile</li><li>Latency and availability</li><li>Cost per verified outcome</li></ul><small>Replaceable by design</small></article>
        <article className="control-boundary-plane"><span>02 / Factory control plane</span><h3>The factory governs.</h3><p>Durable controls remain outside the model and apply to every provider, agent, and tool.</p><ul><li>Identity and delegated authority</li><li>Policy, budget, and routing</li><li>State, leases, and recovery</li><li>Evidence, decisions, and audit</li></ul><small>Durable system of record</small></article>
        <article className="control-boundary-execution"><span>03 / Execution environment</span><h3>Effects stay bounded.</h3><p>Every Attempt runs inside an explicit, observable, recoverable operating envelope.</p><ul><li>Isolated compute</li><li>Scoped tools and file access</li><li>Short-lived credentials</li><li>Network, time, and resource limits</li></ul><small>Constrained and recoverable</small></article>
      </div>
      <div className="control-boundary-rail" aria-label="Authority flows from the control plane into execution and evidence flows back for independent judgment" role="group"><span>Authority flows down →</span><strong>Allow intelligence to vary. Always bound authority.</strong><span>← Evidence flows back</span></div>
      <div className="control-durability-map">
        <article><span>Expected to change</span><strong>Models · agents · skills · prompts · tool adapters</strong><p>Capability supply should evolve as better options emerge.</p></article>
        <article><span>Required to persist</span><strong>Intent · identity · authority · state · evidence · decisions · outcomes</strong><p>The operating record must survive every capability substitution.</p></article>
      </div>
      <p className="control-boundary-rule">Every Attempt returns attributable evidence. No producing system may promote its own result.</p>
    </section>

    <section className="section-block">
      <SectionHeader eyebrow="Across factories" title="One objective can require several qualified factories." description="Mission Control owns the governed Plan, WorkOrder dependencies, and artifact handoffs. Factory supervisors coordinate Tasks inside their assigned boundary. Local evidence verifies each WorkOrder; global evidence verifies the integrated result." />
      <div className="hero-actions"><Link className="button button-dark" href="/enterprise#operating-model">Explore the enterprise delivery diagram</Link><a className="text-action" href="/guide/appendix/enterprise-multi-factory-delivery">Read the complete operating contract →</a></div>
    </section>

    <StateBoundary />

    <section className="section-block architecture-details">
      <SectionHeader eyebrow="Capability map" title="Inspect each area as an operating contract." description="Purpose describes why the area exists. Responsibilities and components describe what it owns. Decisions and failure modes reveal what must remain explicit." />
      {architectureAreas.map((area) => <ResponsiveDetails className={`architecture-area area-${area.id}`} collapseAt="tablet" id={area.id} key={area.id}>
        <summary><span>{String(area.number).padStart(2, "0")}</span><div><p>Architecture area</p><h2>{area.name}</h2><strong>{area.short}</strong></div><p>{area.purpose}</p><small className="disclosure-status"><span className="when-closed">Expand area</span><span className="when-open">Collapse area</span></small></summary>
        <div className="architecture-area-body">
          <div className="architecture-detail-grid">
            <section><h3>Responsibilities</h3><ul>{area.responsibilities.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section><h3>Common components</h3><ul>{area.components.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <section><h3>Required decisions</h3><ul>{area.decisions.map((item) => <li key={item}>{item}</li>)}</ul></section>
            <ResponsiveDetails className="architecture-detail-disclosure" collapseAt="tablet"><summary><h3>Failure modes</h3><span className="disclosure-status"><span className="when-closed">Expand</span><span className="when-open">Collapse</span></span></summary><ul>{area.failureModes.map((item) => <li key={item}>{item}</li>)}</ul></ResponsiveDetails>
            <ResponsiveDetails className="architecture-detail-disclosure" collapseAt="tablet"><summary><h3>Maturity progression</h3><span className="disclosure-status"><span className="when-closed">Expand</span><span className="when-open">Collapse</span></span></summary><ol>{area.maturity.map((item, index) => <li key={item}><span>L{index + 1}</span>{item}</li>)}</ol></ResponsiveDetails>
            <section><h3>Examples</h3><ul>{area.examples.map((item) => <li key={item}>{item}</li>)}</ul></section>
          </div>
          <p className="relationship"><span>Relationship</span>{area.relationships}</p>
          <div className="architecture-area-links"><a href={guideByArea[area.id]}>Related Guide chapters →</a><Link href="/mission-control#capabilities">See in Mission Control →</Link></div>
        </div>
      </ResponsiveDetails>)}
    </section>

    <section className="section-block" id="context-skills">
      <SectionHeader eyebrow="Five operating practices" title="Engineer the context. Prove the behavior." description="Skills are production dependencies. Version them, evaluate them, and govern their use. These practices connect Capability, Trust, and Learning across the existing factory lifecycle." />
      <p>Author → Package → Evaluate → Admit → Activate → Observe → Compare → Promote or roll back → Improve. Approval selects a package for a defined use; runtime admission, work acceptance, and release remain separate decisions.</p>
      <div className="architecture-areas">
        {contextSkillsPractices.map((practice) => <ResponsiveDetails key={practice.number} className="architecture-area" collapseAt="tablet"><summary><span>{practice.number}</span><div><p>Operating practice</p><h3>{practice.title}</h3></div><p>{practice.purpose}</p><small className="disclosure-status"><span className="when-closed">Read practice</span><span className="when-open">Collapse practice</span></small></summary><div className="architecture-area-body"><p>{practice.practice}</p><p><strong>Evidence required: </strong>{practice.evidence}</p><p><strong>Failure to watch: </strong>{practice.failure}</p></div></ResponsiveDetails>)}
      </div>
      <p><a href="/guide/appendix/context-skills-engineering">Read the complete practices and worked playbook in the Guide →</a></p>
      <p>The worked local example records a harness-version mismatch and zero executed trials. It demonstrates an honest stop condition, not improved performance or production qualification.</p>
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

    <section className="reading-next"><p className="section-label">Continue</p><h2>Move from architecture to implementation.</h2><div><Link href="/specification">Read the Specification →</Link><a href="/guide/03-build/11-the-agent-factory">Build the capability stack →</a><Link href="/mission-control">Inspect Mission Control →</Link><Link href="/start">Design a factory line →</Link></div></section>
    </div>
    </div>
  </div></SiteShell>;
}
