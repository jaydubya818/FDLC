import type { Metadata } from "next";
import { PageHero, SectionHeader } from "../components/page-hero";
import { ProtocolDiagram } from "../components/protocol-diagram";
import { SiteShell } from "../components/site-shell";
import { protocolSteps } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Specification", "Preview the proposed versioned FDLC Specification and its governed artifact model.", "/spec");

const associated = ["Acceptance Criterion", "Agent Identity", "Delegation", "Execution Lease", "Learning Signal"];

export default function SpecPage() {
  return <SiteShell><div className="page-wrap">
    <PageHero eyebrow="FDLC Specification / 06" status="Proposed" title="A machine-readable contract for governed software work." description="The FDLC Specification will formalize portable artifact semantics, lifecycle, state transitions, authority, evidence, and extension points. V0 publishes the shape—not a false standard." />
    <section className="spec-notice"><StatusText /><p>No stable FDLC schema is released yet. Mission Control’s implemented domain model is the primary reference, and compatibility must be designed rather than declared.</p></section>
    <section className="section-block"><SectionHeader eyebrow="Entity chain" title="Core protocol objects." description="The concise protocol defines the durable semantic boundary. Implementations may add records without weakening the meaning of these transitions." /><ProtocolDiagram detailed /><div className="associated-objects"><span>Associated objects</span>{associated.map((item) => <strong key={item}>{item}</strong>)}</div></section>
    <section className="section-block"><SectionHeader eyebrow="Entity semantics" title="What V1 will need to define." /><div className="spec-entity-grid">{protocolSteps.map((step) => <article key={step.id}><span>fdlc://v1/{step.id}</span><h3>{step.name}</h3><p>{step.requiredProof}</p><dl><div><dt>Identifier</dt><dd>Stable and globally unique within its authority domain</dd></div><div><dt>Lifecycle</dt><dd>Explicit states and permitted transitions</dd></div><div><dt>Evidence</dt><dd>Exact subject, provenance, freshness, and integrity</dd></div><div><dt>Extension</dt><dd>Namespaced without changing canonical semantics</dd></div></dl></article>)}</div></section>
    <section className="spec-versioning"><div><p className="section-label">Versioning model</p><h2>Stable routes. Explicit evolution.</h2></div><pre><code>{`/spec/v1
/spec/v1/goal
/spec/v1/plan
/spec/v1/work-order
/spec/v1/attempt
/spec/v1/evidence
/spec/v1/verification
/spec/v1/approval
/spec/v1/release
/spec/v1/outcome`}</code></pre></section>
  </div></SiteShell>;
}

function StatusText() { return <strong><span className="capability-status status-proposed">Proposed</span> Pre-standardization draft</strong>; }
