import { GuideReference } from "../components/guide-reference";
import { ReferenceDiagram } from "../components/reference-diagrams";
/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */
import { ContextSkillsMap } from "../components/context-skills-map";
import { productionOperatingContracts } from "../../data/production-operations";
import { systemDesignDecisions } from "../../data/system-design";
import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "../components/architecture-diagram";
import { GuideReading } from "../components/guide-reading";
import { LensSwitcher } from "../components/lens-switcher";
import { NextSteps } from "../components/next-steps";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { ResponsiveDetails } from "../components/responsive-details";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { architectureAreas } from "../../data/fdlc";
import { executionRelationship, executionTaxonomy } from "../../data/execution-taxonomy";
import { agenticSystemLayers, sdkBoundaryComparisons } from "../../data/agentic-system-taxonomy";
import { pageHandoffs } from "../../data/page-handoffs";
import { systemLenses } from "../../data/system-lenses";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Architecture", "Explore the six capability areas of the FDLC architecture: Intent, Harness, Capability, Model, Trust, and Learning.", "/architecture");

const contents = [
  { label: "Overview", href: "#overview" },
  { label: "Control boundary", href: "#control-boundary" },
  { label: "Execution vocabulary", href: "#execution-vocabulary" },
  { label: "Agentic system stack", href: "#agentic-system-stack" },
  { label: "01 Intent", href: "#intent" },
  { label: "02 Harness", href: "#harness" },
  { label: "03 Capability", href: "#capability" },
  { label: "04 Model", href: "#model" },
  { label: "05 Trust", href: "#trust" },
  { label: "06 Learning", href: "#learning" },
  { label: "Context & skills", href: "#context-skills" },
  { label: "Design decisions", href: "#design-decisions" },
  { label: "Production operations", href: "#production-operations" },
  { label: "Operating checks", href: "#operating-checks" },
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
    <GuideReference description="Learn how the architecture fits together, with detailed chapters on capabilities, harnesses, models, trust, and learning." />
    <div className="longform-layout">
    <PageContentsNav items={contents} mobileTitle="Jump to area" title="Architecture areas" variant="rail" />
    <div className="longform-content">
    <LensSwitcher items={systemLenses} />
    <section className="architecture-overview" id="overview"><ArchitectureDiagram /><p>Trust constrains every area. Learning closes the loop only through governed promotion. The model is replaceable; the control contract is not.</p><p><a href="/guide/appendix/principles#fifty-concepts-to-have-cold">Learn the fifty core concepts →</a> <a href="/guide/appendix/glossary">Open the canonical glossary →</a></p></section>

    <section className="architecture-control-boundary" id="control-boundary">
      <SectionHeader eyebrow="The control boundary" title="Intelligence can change. Authority cannot be implicit." description="Models reason and agents act, but neither should own identity, permission, authoritative state, release policy, or the evidence used to judge its work. Those responsibilities belong to the factory around them." />
      <div className="control-boundary-map" aria-label="Intelligence supply, factory control plane, and bounded execution environment" role="group">
        <article className="control-boundary-supply"><span>01 / Intelligence supply</span><h3>Models reason.<br />Agents act.</h3><p>Selected for the exact Work Order by capability and operating constraints.</p><ul><li>Task and complexity fit</li><li>Quality and risk profile</li><li>Latency and availability</li><li>Cost per verified outcome</li></ul><small>Replaceable by design</small></article>
        <article className="control-boundary-plane"><span>02 / Factory control plane</span><h3>The factory governs.</h3><p>Durable controls remain outside the model and apply to every provider, agent, and tool.</p><ul><li>Identity and delegated authority</li><li>Policy, budget, and routing</li><li>State, leases, and recovery</li><li>Evidence, decisions, and audit</li></ul><small>Durable system of record</small></article>
        <article className="control-boundary-execution"><span>03 / Governed execution</span><h3>Operation stays bounded.</h3><p>The Harness governs one Agent, the Runtime hosts it, and the Sandbox isolates its effects.</p><ul><li>Explicit Agent Loop</li><li>Scoped capabilities and file access</li><li>Short-lived credentials</li><li>Network, time, and resource limits</li></ul><small>Constrained and recoverable</small></article>
      </div>
      <div className="control-boundary-rail" aria-label="Authority flows from the control plane into execution and evidence flows back for independent judgment" role="group"><span>Authority flows down →</span><strong>Allow intelligence to vary. Always bound authority.</strong><span>← Evidence flows back</span></div>
      <div className="control-durability-map">
        <article><span>Expected to change</span><strong>Models · agents · skills · prompts · tool adapters</strong><p>Capability supply should evolve as better options emerge.</p></article>
        <article><span>Required to persist</span><strong>Intent · identity · authority · state · evidence · decisions · outcomes</strong><p>The operating record must survive every capability substitution.</p></article>
      </div>
      <p className="control-boundary-rule">Every Attempt returns attributable evidence. No producing system may promote its own result.</p>
    </section>

    <section id="factory-composition" className="section-block"><ReferenceDiagram name="composition" /></section>

    <section className="section-block architecture-details" id="execution-vocabulary">
      <SectionHeader eyebrow="Canonical execution vocabulary" title="Name the boundary before assigning the responsibility." description="Most disagreement about agent harnesses is a boundary disagreement. FDLC separates the worker, its iteration loop, its operating envelope, workflow coordination, execution infrastructure, isolation, and enterprise authority so each has a clear owner, lifecycle, identity, and qualification boundary." />
      <div className="architecture-detail-grid">
        {executionTaxonomy.map((item) => <section key={item.term}><h3>{item.term}</h3><p><strong>{item.role}.</strong> {item.boundary}</p><p><small>{item.question}</small></p></section>)}
      </div>
      <p className="relationship"><span>Canonical relationship</span>{executionRelationship.join(" → ")}</p>
      <p>A Harness may enforce a local rule, but the Control Plane owns the identity, policy, approval, budget, and revocation authority behind that rule. A packaged product may implement several boundaries; the immutable identities must remain distinct.</p>
      <div className="hero-actions"><a className="button button-dark" href="/guide/appendix/execution-boundaries-and-terminology">Read the full terminology reference</a><a className="text-action" href="/guide/appendix/glossary">Open the canonical glossary →</a></div>
    </section>

    <section className="section-block agentic-system-section" id="agentic-system-stack">
      <SectionHeader eyebrow="Agentic systems architecture" title="A toolkit can implement layers. It does not become the system." description="Agentic SDKs are useful because they package common agent-building primitives. FDLC keeps the responsibilities separate so adopting an SDK never silently transfers enterprise authority, durable orchestration, runtime ownership, or release control to a library." />
      <ol className="agentic-stack" aria-label="Agentic system architecture from enterprise control to model execution">
        {agenticSystemLayers.map((layer) => <li className={`agentic-layer agentic-layer-${layer.id}`} key={layer.id}>
          <div className="agentic-layer-heading"><span>{layer.number}</span><div><small>{layer.role}</small><h3>{layer.term}</h3><p>{layer.purpose}</p></div></div>
          <ul>{layer.owns.map((item) => <li key={item}>{item}</li>)}</ul>
          <div className="agentic-layer-examples"><span>Examples</span><p>{layer.examples.join(" · ")}</p></div>
        </li>)}
      </ol>
      <div className="sdk-key-point"><span>Key boundary</span><p><strong>An Agentic SDK is a construction toolkit.</strong> It may provide an Agent Loop, Harness implementation, Work Graph helpers, or Runtime integration. Those supplied parts still require separate identities, qualification evidence, and authority from the Control Plane.</p></div>
      <div className="sdk-comparison" role="table" aria-label="Agentic SDK compared with adjacent system boundaries">
        {sdkBoundaryComparisons.map(([term, meaning, example]) => <div key={term} role="row"><strong role="cell">{term}</strong><span role="cell">{meaning}</span><p role="cell">{example}</p></div>)}
      </div>
      <h3 className="sdk-ecosystem-title">What this means for FDLC</h3>
      <div className="sdk-ecosystem-map">
        <article><span>Mission Control</span><h3>Control Plane and factory coordination</h3><p>Mission Control owns governed WorkOrders, resolved execution identities, authority, durable state, verification, acceptance, and release coordination. It may invoke SDK-built components without transferring those decisions to the SDK.</p></article>
        <article><span>Fab · Experimental</span><h3>Coding Harness and capability implementation</h3><p>Fab operates a bounded repository-editing Agent Loop and integrates through Mission Control&apos;s Harness adapter contract. Its model adapters and loop are implementation details; Fab has no independent acceptance, publication, or Control Plane authority.</p></article>
      </div>
      <p className="control-boundary-rule">SDK guardrails can enforce behavior inside an execution framework. They do not establish enterprise authority to modify a repository, spend a budget, accept a Candidate, publish a release, or change Production.</p>
      <div className="hero-actions"><a className="button button-dark" href="/guide/appendix/execution-boundaries-and-terminology#agentic-sdk-toolkit-not-authority">Read the canonical SDK boundary</a><a className="text-action" href="/guide/03-build/15-coding-harnesses-and-agent-protocols">Compare implementation choices →</a></div>
    </section>

    <section className="section-block">
      <SectionHeader eyebrow="Across factories" title="One objective can require several qualified factories." description="Mission Control owns the governed Plan, WorkOrder dependencies, and artifact handoffs. Factory supervisors coordinate Tasks inside their assigned boundary. Local evidence verifies each WorkOrder; global evidence verifies the integrated result." />
      <div className="hero-actions"><Link className="button button-dark" href="/enterprise#operating-model">Explore the enterprise delivery diagram</Link><a className="text-action" href="/guide/appendix/enterprise-multi-factory-delivery">Read the complete operating contract →</a></div>
    </section>

    <StateBoundary />

    <section className="section-block architecture-details">
      <SectionHeader eyebrow="Capability map" title="Inspect each area as an operating contract." description="Purpose describes why the area exists. Responsibilities and components describe what it owns. Decisions and failure modes reveal what must remain explicit." />
      {architectureAreas.map((area) => <ResponsiveDetails defaultCollapsed className={`architecture-area area-${area.id}`} collapseAt="tablet" id={area.id} key={area.id}>
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
      <SectionHeader eyebrow="Context & skills" title="Treat skills as production dependencies." description="A skill changes how an agent works. Give it an owner, pin its version, test its behavior, and control where it can run." />
      <ContextSkillsMap />
      <p><a href="/guide/appendix/context-skills-engineering">Read the complete practices and worked playbook in the Guide →</a></p>
      <p>The worked local example records a harness-version mismatch and zero executed trials. It demonstrates an honest stop condition, not improved performance or production qualification.</p>
    </section>

    <section className="section-block" id="design-decisions">
      <SectionHeader eyebrow="Architecture in practice" title="Six decisions before a factory takes on real work." description="Use these checks when designing a new workflow or reviewing an existing one. Each connects a design choice to the evidence needed to operate it. They refine the six architecture areas without adding another lifecycle." />
      <div className="architecture-areas">
        {systemDesignDecisions.map((decision) => <ResponsiveDetails key={decision.number} className="architecture-area" defaultCollapsed collapseAt="tablet"><summary><span>{decision.number}</span><div><p>Operating decision</p><h3>{decision.title}</h3></div><p>{decision.question}</p><small className="disclosure-status"><span className="when-closed">Read decision</span><span className="when-open">Collapse decision</span></small></summary><div className="architecture-area-body"><div className="architecture-detail-grid"><section><h3>Problem</h3><p>{decision.problem}</p></section><section><h3>Architectural decision</h3><p>{decision.decision}</p></section><section><h3>Why it exists</h3><p>{decision.rationale}</p></section><section><h3>Governing invariant</h3><p>{decision.invariant}</p></section><section><h3>Failure behavior</h3><p>{decision.failure}</p></section><section><h3>Maturity and implementation</h3><p>{decision.status}</p></section></div><p><strong>Evidence required: </strong>{decision.evidence}</p><p className="relationship"><span>Implementation relationship</span>{decision.relationship}</p></div></ResponsiveDetails>)}
      </div>
      <p><a href="/guide/appendix/factory-system-design-playbook">Use the design worksheet, recovery drills, and worked example in the Guide →</a></p>
      <p><Link href="/mission-control#enhancements">See the implementation priorities for Mission Control →</Link></p>
    </section>

    <section className="section-block" id="production-operations">
      <SectionHeader eyebrow="Production reliability" title="Treat failure as governed work." description="A factory can remain trustworthy while a model, worker, dependency, or release is unhealthy only when impact, containment, effects, recovery, and closure are explicit operating records." />
      <div className="architecture-areas">
        {productionOperatingContracts.map((contract) => <ResponsiveDetails key={contract.number} className="architecture-area" defaultCollapsed collapseAt="tablet"><summary><span>{contract.number}</span><div><p>Operating contract</p><h3>{contract.title}</h3></div><p>{contract.question}</p><small className="disclosure-status"><span className="when-closed">Read contract</span><span className="when-open">Collapse contract</span></small></summary><div className="architecture-area-body"><div className="architecture-detail-grid"><section><h3>Required behavior</h3><p>{contract.decision}</p></section><section><h3>Governing invariant</h3><p>{contract.invariant}</p></section><section><h3>Required record</h3><p>Bind the decision, actor, authority, exact subject, observed effect, evidence, unknowns, deadline, and next permitted action.</p></section></div></div></ResponsiveDetails>)}
      </div>
      <p><a href="/guide/appendix/production-reliability-operations-playbook">Use the incident packet, degraded-mode matrix, saga contract, and failure drills in the Guide →</a></p>
      <p><Link href="/mission-control#incident-operations">See what Mission Control must add to support these controls →</Link></p>
    </section>

    <section className="section-block" id="operating-checks">
      <SectionHeader eyebrow="Practical qualification" title="Prove the behavior behind the architecture." description="Start with one outcome, an accountable owner, a baseline, and explicit stop conditions. Qualify the exact implementation against that workload." />
      <div className="metric-grid is-full">
        <article><span>01</span><h3>Diagnose retrieval</h3><p>Trace source freshness, permissions, candidate recall, assembled context, and claim support separately. Citations alone do not prove an answer; cached evidence must remain eligible.</p></article>
        <article><span>02</span><h3>Choose recovery</h3><p>Retry transient failures within limits. Reconcile unknown write effects before repeating them. Replan within scope, use qualified fallbacks, and stop when authority or budget is missing.</p></article>
        <article><span>03</span><h3>Qualify the runtime</h3><p>Test cancellation, recovery, tool contracts, isolation, traceability, and upgrades. Tool discovery is inventory; execution still needs a qualified version and current authorization.</p></article>
        <article><span>04</span><h3>Decide on outcomes</h3><p>Compare accepted results, human effort, quality, and total cost against the baseline. Expand, revise, or stop on evidence; a calendar milestone does not prove readiness.</p></article>
      </div>
      <h3>Choose autonomy per action.</h3>
      <p>Use fixed workflows for known steps and bounded agent judgment for uncertain ones. Reading, editing, publishing, and releasing need distinct grants. Recheck authority after a wait or changed revision; an earlier approval cannot authorize a different action.</p>
      <p><a href="/guide/appendix/agentic-system-operating-checks#choose-autonomy-for-each-decision">Walk through the dependency-update example and execution-time checks →</a></p>
      <p><a href="/guide/appendix/agentic-system-operating-checks">Use the operating tables and outcome brief in the Guide →</a></p>
    </section>

    <section className="factory-system-diagram" id="system-flow">
      <SectionHeader eyebrow="Software factory concept" title="Authority flows down. Evidence flows back." />
      <div className="system-map" aria-label="Software factory concept from human intent through control, execution, evidence, outcome, and learning" role="group">
        <div className="system-map-human"><span>Humans</span><strong>Intent + policy</strong><small>Own goals, judgment, and material risk</small></div>
        <div className="system-map-control"><span>Control plane</span><strong>Plan · govern · route</strong><small>Identity, authority, budget, and state</small></div>
        <div className="system-map-supply"><span>Capability supply</span><strong>Agents · models · skills · tools · context</strong></div>
        <div className="system-map-execution"><span>Execution</span><strong>Harness · Runtime · Sandbox</strong><small>Agent Loop, Attempts, leases, checkpoints, recovery</small></div>
        <div className="system-map-proof"><span>Trust</span><strong>Evidence + independent verification</strong><small>Policy and human approval at consequence</small></div>
        <div className="system-map-outcome"><span>Outcome</span><strong>Accepted, observed value</strong><small>Feeds governed learning—not direct mutation</small></div>
      </div>
    </section>

    <GuideReading page="architecture" />
    <NextSteps {...pageHandoffs.architecture} />
    </div>
    </div>
  </div></SiteShell>;
}
