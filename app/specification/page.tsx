import type { Metadata } from "next";
import Link from "next/link";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { ProtocolDiagram } from "../components/protocol-diagram";
import { SiteShell } from "../components/site-shell";
import { protocolSteps } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Specification", "Preview the proposed versioned FDLC Specification and its governed artifact model.", "/specification");

const associated = ["Acceptance Criterion", "Agent Identity", "Delegation", "Execution Lease", "Task", "Candidate"];

const contents = [
  { label: "Artifact chain", href: "#artifact-chain" },
  { label: "Entity semantics", href: "#entity-semantics" },
  { label: "Versioning", href: "#versioning" },
  { label: "Next steps", href: "#spec-next" },
] as const;

export default function SpecificationPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="FDLC Specification / 06" status="Proposed" variant="compact" title="A machine-readable contract for governed software work." description="The FDLC Specification will formalize portable artifact semantics, state transitions, authority, evidence, and extension points. V0 publishes the shape—not a false standard." meta={[["Current state", "Pre-standardization"], ["Protocol objects", "11"], ["Compatibility", "Not yet claimable"]]}>
      <div className="hero-actions"><a className="button button-dark" href="#artifact-chain">Inspect the proposed shape</a><Link className="text-action" href="/mission-control#capabilities">See the implementation evidence →</Link></div>
    </PageHero>
    <section className="spec-notice"><StatusText /><p>No stable FDLC schema is released yet. Mission Control’s implemented domain model is the primary reference, and compatibility must be designed rather than declared.</p></section>
    <PageContentsNav items={contents} title="Specification sections" />
    <section className="section-block" id="artifact-chain"><SectionHeader eyebrow="Autonomous execution and artifact protocol" title="Eleven durable protocol objects." description="These nouns make one bounded execution inspectable from initial Intent through governed Learning. Implementations may add records without weakening their semantics or transition requirements." /><ProtocolDiagram detailed /><div className="associated-objects"><span>Associated objects</span>{associated.map((item) => <strong key={item}>{item}</strong>)}</div></section>
    <section className="section-block" id="entity-semantics"><SectionHeader eyebrow="Entity semantics" title="What a later versioned contract would need to define." description="Every object needs portable meaning before independent implementations can safely exchange it. These cards describe the proposed contract surface. They are not a released V1 schema." /><div className="spec-entity-grid">{protocolSteps.map((step) => <article key={step.id}><span>fdlc://v1/{step.id}</span><h3>{step.name}</h3><p>{step.question}</p><dl><div><dt>Required proof</dt><dd>{step.requiredProof}</dd></div><div><dt>Mission Control</dt><dd>{step.missionControlMapping}</dd></div><div><dt>Identifier</dt><dd>Stable and globally unique within its authority domain</dd></div><div><dt>Lifecycle</dt><dd>Explicit states and permitted transitions</dd></div><div><dt>Evidence</dt><dd>Exact subject, provenance, freshness, and integrity</dd></div><div><dt>Extension</dt><dd>Namespaced without changing canonical semantics</dd></div></dl></article>)}</div></section>
    <section className="spec-versioning" id="versioning"><div><p className="section-label">Versioning model</p><h2>Stable routes. Explicit evolution.</h2><p>Versioned namespaces would make breaking changes visible. No V1 schema is released, and compatibility must not be claimed from these placeholders.</p></div><pre><code>{`/specification/v1
/specification/v1/intent
/specification/v1/specification
/specification/v1/plan
/specification/v1/work-order
/specification/v1/attempt
/specification/v1/evidence
/specification/v1/verification
/specification/v1/approval
/specification/v1/release
/specification/v1/outcome
/specification/v1/learning-signal`}</code></pre></section>
    <section className="reading-next" id="spec-next"><p className="section-label">Use what exists today</p><h2>Inspect the model before claiming compatibility.</h2><div><Link href="/framework#protocol">Review the artifact protocol →</Link><Link href="/mission-control">Inspect Mission Control →</Link><a href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Mission Control source ↗</a></div></section>
  </div></SiteShell>;
}

function StatusText() {
  return <strong><span className="capability-status status-proposed">Proposed</span> Pre-standardization draft</strong>;
}
