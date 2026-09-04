/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary and require document navigation. */
import type { Metadata } from "next";
import Link from "next/link";
import { ArchitectureDiagram } from "../components/architecture-diagram";
import { CategoryDistinction } from "../components/category-distinction";
import { LifecycleDiagram } from "../components/lifecycle-diagram";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { ProtocolDiagram } from "../components/protocol-diagram";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { ValueStreamDiagram } from "../components/value-stream-diagram";
import { canonicalDefinition, manifesto, metrics } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Framework", canonicalDefinition, "/framework");

const frameworkPieces = [
  ["FDLC Framework", "Open methodology", "The operating model and engineering discipline defined on this page.", "/framework"],
  ["FDLC Specification", "Proposed standard", "Formal definitions and invariants for portable artifacts and state transitions.", "/specification"],
  ["AI Software Factory Guide", "Open field guide", "The detailed methodology from first principles through production.", "/guide"],
  ["Mission Control", "Open-source reference", "The reference implementation that makes the FDLC protocol concrete.", "/mission-control"],
  ["FDLC Enterprise", "Proposed product", "The commercial control plane for operating proven factories at organizational scale.", "/enterprise"],
] as const;

const operatingShifts = [
  ["01", "Intent becomes the interface.", "Builders define the outcome, constraints, acceptance criteria, context, and success measures. The factory determines the governed how."],
  ["02", "Intelligence becomes routable.", "Route models and agents by capability, risk, latency, availability, and cost per verified outcome—not provider loyalty."],
  ["03", "The Harness becomes the control boundary.", "Identity, authority, budgets, state, policy, isolation, and audit remain outside the model and survive every model substitution."],
  ["04", "Verification becomes the scarce resource.", "Generation can scale faster than human review. Independent, automated verification must scale trust without collapsing judgment into generation."],
  ["05", "Evidence becomes part of the deliverable.", "The output is code plus attributable tests, traces, security results, decisions, and production outcomes bound to the exact candidate."],
  ["06", "Learning becomes governed promotion.", "Runs may propose changes to routing, skills, evaluators, and policy. Nothing changes production until it is tested, reviewed, versioned, and reversible."],
] as const;

const contents = [
  { label: "Definition", href: "#definition" },
  { label: "Category boundary", href: "#category" },
  { label: "Why FDLC", href: "#why" },
  { label: "Three levels", href: "#levels" },
  { label: "Factory lifecycle", href: "#lifecycle" },
  { label: "Value stream", href: "#value-stream" },
  { label: "Execution protocol", href: "#protocol" },
  { label: "Six domains", href: "#architecture" },
  { label: "Principles", href: "#governance" },
  { label: "Measurement", href: "#measurement" },
  { label: "How the pieces fit", href: "#ecosystem" },
  { label: "Mission Control", href: "#mission-control" },
  { label: "Start here", href: "#start-here" },
] as const;

export default function FrameworkPage() {
  return <SiteShell>
    <div className="page-wrap">
      <PageHero eyebrow="FDLC Framework / 01" title="The lifecycle for the factory itself." description={canonicalDefinition} meta={[["Abstraction levels", "03"], ["Architecture domains", "06"], ["Protocol artifacts", "11"]]}>
        <div className="hero-actions"><Link className="button button-dark" href="/in-5-minutes">Understand FDLC in 5 minutes</Link><Link className="button button-light" href="/architecture">Explore the Architecture</Link><Link className="text-action" href="/manifesto">Read the Manifesto →</Link></div>
      </PageHero>
      <div className="longform-layout">
      <PageContentsNav items={contents} mobileTitle="Jump to section" title="Framework sections" variant="rail" />
      <div className="longform-content">

      <section className="definition-block" id="definition" aria-labelledby="definition-title">
        <p className="section-label">Canonical definition</p>
        <blockquote id="definition-title">“{canonicalDefinition}”</blockquote>
        <div><p>Traditional SDLC organizes software production.</p><p><strong>FDLC engineers the factory that increasingly performs it.</strong></p><p>It is the durable discipline around agents, models, tools, people, policies, evidence, and workflows.</p><p><strong>Verified delivery, not merely generated code.</strong></p></div>
      </section>

      <section className="section-block framework-category" id="category">
        <SectionHeader eyebrow="The category boundary" title="Three transitions, then a distinct engineering discipline." description="Traditional software production becomes AI-native. Agentic workflows become a persistent software factory. FDLC is the lifecycle for engineering and evolving that factory—not another SDLC variant." />
        <CategoryDistinction />
      </section>

      <section className="section-block" id="why">
        <SectionHeader eyebrow="Why FDLC exists" title="Code generation is no longer the bottleneck. Process is." description="Organizations can give every developer a powerful coding agent. They then encounter a different class of operating, authority, evidence, and learning problems." />
        <div className="framework-why-copy">
          <article><p>FDLC exists to answer these questions systematically:</p><ul><li>Who defines intent, and when is it complete?</li><li>What agent may act, with what authority, tools, and blast radius?</li><li>What evidence proves the work is correct?</li><li>Can the producing agent certify its own output?</li><li>When must a human intervene?</li><li>How does the system improve without learning the wrong thing?</li></ul></article>
          <aside><strong>Not another coding agent. The control system around them.</strong><p>Your organization may use Codex, Claude Code, Cursor, GitHub Copilot, internal agents, or models that do not exist yet. FDLC provides the durable operating layer around them.</p></aside>
        </div>
        <p className="orientation-label">Six operating shifts</p>
        <div className="operating-shifts">
          {operatingShifts.map(([number, title, description]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{description}</p></article>)}
        </div>
      </section>

      <section className="section-block model-distinction" id="levels">
        <SectionHeader eyebrow="Three abstraction levels" title="Three questions. Three exact sequences." description="The levels relate, but they are not interchangeable. Keeping the factory lifecycle, software value stream, and governed artifact protocol distinct makes the operating model understandable and implementable." />
        <div className="system-models">
          <article><span>01 / Factory Development Lifecycle</span><h3>How the factory evolves.</h3><p>Discover → Design → Assemble → Validate → Deploy → Operate → Improve.</p><a href="#lifecycle">View the factory lifecycle ↓</a></article>
          <article><span>02 / Software factory value stream</span><h3>How software flows through it.</h3><p>Intent → Plan → Define Agent → Execute through Harness → Apply Skills → Evaluate → Improve → Deliver Software.</p><a href="#value-stream">View the Guide value stream ↓</a></article>
          <article><span>03 / Governed execution protocol</span><h3>How one unit becomes proven.</h3><p>Eleven durable artifacts from Intent through Specification, evidence, outcome, and Learning.</p><a href="#protocol">View the artifact protocol ↓</a></article>
        </div>
        <aside className="callout"><strong>The architecture is structural</strong><p>Intent, Harness, Capability, Model, Trust, and Learning describe what the factory contains. They span the three levels; they are not a fourth lifecycle.</p></aside>
      </section>

      <section className="section-block" id="lifecycle">
        <SectionHeader eyebrow="Level 01 / Factory Development Lifecycle" title="How the factory itself is developed and evolved." description="Discover, design, assemble, validate, deploy, operate, and improve a factory line. Governance, Security, Observability, Measurement, and Human Authority span every stage." />
        <LifecycleDiagram detailed />
        <div className="section-links"><Link href="/in-5-minutes#factory-lifecycle">See the lifecycle applied to one factory line →</Link></div>
      </section>

      <section className="section-block" id="value-stream">
        <SectionHeader eyebrow="Level 02 / Software factory value stream" title="How software work flows through the factory." description="The Guide’s eight stages preserve the practical teaching sequence from intent through delivered software. This value stream explains the work performed by an operating factory, not how the factory itself evolves." />
        <ValueStreamDiagram detailed />
        <aside className="callout"><strong>Keep the boundaries clear</strong><p>Deploy promotes a validated factory version in the Factory Development Lifecycle. Deliver Software advances accepted software in the value stream. Neither transition creates its own authority.</p></aside>
        <div className="section-links"><a href="/guide/stages/01-builder-intent">Read the full Guide value stream →</a></div>
      </section>

      <section className="section-block" id="protocol">
        <SectionHeader eyebrow="Level 03 / Autonomous execution and artifact protocol" title="How one bounded unit of work becomes governed and proven." description="Intent, Specification, Plan, Work Order, Attempt, Evidence, Verification, Approval, Release, Outcome, and Learning preserve what existed, ran, was observed, was decided, and may improve next." />
        <ProtocolDiagram detailed />
        <aside className="callout"><strong>Mission Control mapping</strong><p>Mission Control realizes Intent as a governed Mission, Specification as a Mission Spec, and expands bounded execution with Tasks, candidates, pull requests, and explicit WorkOrder acceptance.</p></aside>
        <div className="section-links"><Link href="/specification">Review the proposed Specification →</Link><Link href="/mission-control">See Mission Control objects →</Link><Link href="/in-5-minutes#artifacts">Inspect all eleven example records →</Link></div>
      </section>

      <section className="section-block architecture-framework" id="architecture">
        <SectionHeader eyebrow="Structural view / Six architecture domains" title="What the factory requires." description="Intent, Harness, Capability, Model, Trust, and Learning are capability boundaries, not a lifecycle, vendor taxonomy, or deployment tier." />
        <ArchitectureDiagram />
        <Link className="section-link" href="/architecture">Read the detailed architecture <span aria-hidden="true">→</span></Link>
      </section>

      <StateBoundary mode="primary" />

      <section className="section-block governance-principles" id="governance">
        <SectionHeader eyebrow="Governance" title="Ten principles hold the system together." />
        <ol>{manifesto.map((item) => <li key={item.number}><span>{String(item.number).padStart(2, "0")}</span><p>{item.principle}</p></li>)}</ol>
        <Link className="section-link" href="/manifesto">Read the FDLC Manifesto <span aria-hidden="true">→</span></Link>
      </section>

      <section className="section-block" id="measurement">
        <SectionHeader eyebrow="Measurement" title="The unit of value is a verified outcome." description="Generation volume is operational telemetry. Factory value is accepted change with known quality, cost, effort, recovery, and risk." />
        <div className="metric-grid">{metrics.slice(0, 8).map(([name, definition], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{definition}</p></article>)}</div>
      </section>

      <section className="section-block" id="ecosystem">
        <SectionHeader eyebrow="How the pieces fit" title="One open discipline. Distinct ways to define, teach, demonstrate, and scale it." description="The Framework remains the definition of FDLC. Specifications, teaching material, implementations, and commercial products support the discipline without becoming the category itself." />
        <div className="framework-piece-grid">{frameworkPieces.map(([name, status, description, href], index) => href.startsWith("/guide")
          ? <a href={href} key={name}><span>{String(index + 1).padStart(2, "0")} / {status}</span><h3>{name}</h3><p>{description}</p><small>Explore →</small></a>
          : <Link href={href} key={name}><span>{String(index + 1).padStart(2, "0")} / {status}</span><h3>{name}</h3><p>{description}</p><small>Explore →</small></Link>)}</div>
      </section>

      <section className="reference-callout" id="mission-control"><div><p className="section-label">Reference implementation</p><h2>Mission Control makes the protocol concrete.</h2></div><div><p>Inspect how one open-source control plane models governed Plans, WorkOrders, Attempts, evidence, verification, and human acceptance—with current limitations visible.</p><div className="hero-actions"><Link className="button button-light" href="/mission-control">Explore Mission Control</Link><Link className="text-action light-link" href="/in-5-minutes">See the walkthrough →</Link></div></div></section>

      <section className="framework-start" id="start-here">
        <p className="section-label">Start here</p><h2>Choose the next depth you need.</h2>
        <div className="framework-start-grid"><Link href="/in-5-minutes"><span>01</span><strong>FDLC in 5 Minutes</strong><small>One factory line end to end →</small></Link><Link href="/architecture"><span>02</span><strong>Architecture</strong><small>Six capability areas →</small></Link><Link href="/manifesto"><span>03</span><strong>Manifesto</strong><small>Ten governing principles →</small></Link><Link href="/mission-control"><span>04</span><strong>Mission Control</strong><small>Reference implementation →</small></Link><Link href="/maturity"><span>05</span><strong>Maturity</strong><small>Assess what is true today →</small></Link><a href="/guide"><span>06</span><strong>Guide</strong><small>Full methodology →</small></a></div>
        <blockquote>Verified delivery, not merely generated code.</blockquote>
      </section>
      </div>
      </div>
    </div>
  </SiteShell>;
}
