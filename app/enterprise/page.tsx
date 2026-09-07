import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { PageContentsNav } from "../components/page-contents-nav";
import { SiteShell } from "../components/site-shell";
import { enterpriseAdoption, enterpriseControls, enterpriseFactories, enterpriseGuideHref, enterpriseRouting, enterpriseStages } from "../../data/enterprise";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Enterprise multi-factory software delivery", "Compose governed software factories around enterprise objectives. Explore routing, independent verification, human authority, adoption, and FDLC Enterprise pricing discussions.", "/enterprise");

const contents = [
  { label: "Operating model", href: "#operating-model" },
  { label: "Routing and dependencies", href: "#routing" },
  { label: "Verification", href: "#verification" },
  { label: "Factory catalog", href: "#factory-catalog" },
  { label: "Enterprise readiness", href: "#readiness" },
  { label: "Adoption and pricing", href: "#pricing" },
] as const;

export default function EnterprisePage() {
  return <SiteShell><div className="page-wrap enterprise-page">
    <PageHero eyebrow="FDLC Enterprise" status="Design partnership" variant="compact" title="Many factories. One governed objective." description="Enterprise software work crosses teams, repositories, and delivery systems. FDLC describes how to compose specialized factories around one objective, preserve authority, and verify the integrated outcome." meta={[["Model", "Multi-factory delivery"], ["Foundation", "Open framework"], ["Pricing", "Contact FDLC Enterprise"]]}>
      <div className="hero-actions"><a className="button button-dark" href="mailto:support@fdlc.ai?subject=FDLC%20Enterprise%20pricing%20and%20scope">Contact FDLC Enterprise</a><a className="text-action" href={enterpriseGuideHref}>Read the enterprise guide →</a></div>
    </PageHero>
    <PageContentsNav items={contents} />

    <section className="section-block" id="operating-model">
      <SectionHeader eyebrow="Enterprise operating model" title="From builder intent to a verified outcome." description="The builder describes the result. Mission Control owns the Plan, dependencies, routing, evidence, and authority across factories. Each factory executes a bounded WorkOrder." />
      <figure className="enterprise-diagram">
        <a href="/enterprise/multi-factory-software-delivery.png" target="_blank" rel="noreferrer" aria-label="Open the enterprise multi-factory software delivery diagram at full resolution in a new tab">
          <Image src="/enterprise/multi-factory-software-delivery.png" alt="Enterprise multi-factory delivery: eight stages from builder intent to outcomes, with panels for the governed Plan, factory internals, local and global verification, factory catalog, versioning, and learning. The full text explanation follows." width={1536} height={1024} sizes="(max-width: 1280px) 100vw, 1240px" />
        </a>
        <figcaption>Reference architecture supplied by Jay West. <a href="/enterprise/multi-factory-software-delivery.png" target="_blank" rel="noreferrer">Open full-resolution diagram ↗</a> Factory versions, skill counts, and scale examples are illustrative; they do not describe a published product catalog or measured capacity.</figcaption>
      </figure>
      <p className="enterprise-note">These eight stages describe delivery through multiple factories. The seven-stage <Link href="/framework">Factory Development Lifecycle</Link> governs how those factories are designed, qualified, operated, and improved.</p>
      <ol className="enterprise-stages">{enterpriseStages.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
    </section>

    <section className="section-block" id="routing">
      <SectionHeader eyebrow="Routing and dependencies" title="Three decisions, with qualification before optimization." description="A routing score can rank eligible choices. It cannot override policy, missing qualification, expired evidence, or the builder’s authority." />
      <div className="enterprise-routing">{enterpriseRouting.map(([level, question, description], index) => <article key={level}><p className="section-label">Level {index + 1} / {level}</p><h3>{question}</h3><p>{description}</p></article>)}</div>
      <div className="enterprise-example">
        <div><p className="section-label">Worked objective</p><h3>Modernize payments to Java 21, remediate vulnerabilities, improve tests, and deploy safely.</h3><p>The planner proposes the decomposition. Approval binds the exact Plan revision. Mission Control can recover from durable records even if the planner’s session is gone.</p></div>
        <ol className="enterprise-workorders" aria-label="WorkOrder dependencies">
          <li><strong>WO-101 · Analyze</strong><span>Establish repository and dependency baselines.</span></li>
          <li><strong>WO-102 · Modernize</strong><span>Consume the verified analysis and produce the migration Candidate.</span></li>
          <li><strong>WO-103 · Secure + WO-104 · Tests</strong><span>Run in parallel only on isolated, pinned inputs. Combine their changes and recheck the integrated result.</span></li>
          <li><strong>WO-105 · Verify</strong><span>Check the combined Candidate after both required branches pass.</span></li>
          <li className="enterprise-authority"><strong>Release authority</strong><span>Approve the exact artifact, environment, rollout scope, and rollback conditions.</span></li>
          <li><strong>WO-106 · Deploy</strong><span>Execute the authorized release through controlled delivery tooling.</span></li>
          <li><strong>WO-107 · Validate</strong><span>Observe production health and confirm the remaining objective criteria.</span></li>
        </ol>
      </div>
      <p className="enterprise-note"><strong>Changed inputs invalidate assumptions.</strong> If modernization replaces artifact A with artifact B, downstream evidence about A does not prove B. Mission Control identifies affected WorkOrders, blocks stale handoffs, and requires re-verification. Parallel agents do not share an uncontrolled mutable workspace.</p>
    </section>

    <section className="section-block" id="verification">
      <SectionHeader eyebrow="Two levels of evidence" title="Local PASS does not imply objective PASS." description="Execution produces a Candidate. Verification supports or rejects its claims. Release authorization remains a separate decision." />
      <div className="enterprise-verification">
        <article><p className="section-label">Local / WorkOrder</p><h3>Did this factory satisfy its contract?</h3><ul><li>Exact input and Candidate artifact identities</li><li>WorkOrder acceptance criteria and required evidence</li><li>Build, tests, scans, policy, and artifact integrity</li><li>Independent verifier Attempt and attributable verdict</li></ul><p>A failure enters a bounded remediation path. Missing evidence is a blocked or incomplete result.</p></article>
        <article><p className="section-label">Global / Objective</p><h3>Does the composition achieve the outcome?</h3><ul><li>Required upstream WorkOrders complete with current evidence</li><li>Correct versions combined into one integrated Candidate</li><li>End-to-end behavior, regression, security, and performance</li><li>Objective acceptance criteria and release readiness</li></ul><p>Pre-release verification establishes eligibility. If the objective includes production outcomes, completion also requires post-release observation.</p></article>
      </div>
      <p className="enterprise-note"><strong>Independent verification is more than a second model.</strong> Prefer deterministic checks for builds, tests, policy, and digests. Use specialized evaluators and human review where judgment is required. Shared prompts, models, or missing context can create correlated failures even across separate agents.</p>
    </section>

    <section className="section-block" id="factory-catalog">
      <SectionHeader eyebrow="Reusable capabilities" title="Scale through composition, not a factory per repository." description="A Factory Definition names a delivery capability. An immutable Factory Version identifies its qualified composition. An Execution Profile specializes the approved operating envelope for a workload and environment." />
      <div className="enterprise-catalog">{enterpriseFactories.map(([name, scope, evidence]) => <article key={name}><h3>{name}</h3><p>{scope}</p><p><strong>Expected output:</strong> {evidence}</p></article>)}</div>
      <div className="enterprise-version"><p className="section-label">Version lifecycle</p><h3>Develop → Qualify → Promote → Activate → Observe → Improve</h3><p>Pin the supervisor recipe, skills, model routes, harnesses, tools, context policies, sandbox, and verification contract. Qualify the composition as well as its components. A published version is not automatically eligible for routing.</p><p>Improvements create new candidates. Suspending a bad version stops new admissions; routing can return to a previously qualified version that remains eligible. Reverting factory routing does not undo an application deployment or a database change.</p></div>
    </section>

    <section className="section-block" id="readiness">
      <SectionHeader eyebrow="Enterprise readiness" title="Make the operating requirements explicit before scaling." description="Use these as architecture and procurement requirements to validate together. Availability, deployment options, support, and commercial commitments must be confirmed for the agreed scope." />
      <div className="enterprise-grid">{enterpriseControls.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
      <div className="enterprise-version"><h3>Measure accepted outcomes and the effort to achieve them.</h3><p>Track objective success, first-attempt verification, escaped defects, rollback and recovery, end-to-end cycle time, human review minutes, and adoption. Attribute inference, compute, tools, verification, retries, and human intervention to the outcome.</p><p>Compare similar workloads over a declared observation window. Report sample size and missing data. Cost per accepted outcome is undefined when no outcomes are accepted; activity and token volume alone do not establish business value.</p><Link className="section-link" href="/benchmarks">Use the measurement contract →</Link></div>
    </section>

    <section className="section-block" id="adoption">
      <SectionHeader eyebrow="Recommended adoption path" title="Prove one workflow. Expand on evidence." />
      <ol className="enterprise-stages">{enterpriseAdoption.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol>
    </section>

    <section className="restrained-cta" id="pricing">
      <div><p className="section-label">FDLC Enterprise / Pricing and scope</p><h2>Bring your enterprise delivery requirements.</h2></div>
      <div><p>For large organizations, contact FDLC Enterprise at <a href="mailto:support@fdlc.ai?subject=FDLC%20Enterprise%20pricing%20and%20scope">support@fdlc.ai</a> for details on pricing, design partnerships, and a rollout aligned to your environment.</p><p>Prepare your target workflows, repository and team scope, expected workload and concurrency, security and residency requirements, integration needs, support expectations, and success measures. These inputs help scope a discussion; they are not published pricing units.</p><div className="hero-actions"><a className="button button-light" href="mailto:support@fdlc.ai?subject=FDLC%20Enterprise%20pricing%20and%20scope">Email FDLC Enterprise</a><Link className="text-action light-link" href="/deploy">Prepare your engagement →</Link><a className="text-action light-link" href={enterpriseGuideHref}>Read the enterprise guide →</a></div><p className="enterprise-availability">FDLC Enterprise is a proposed commercial offering and is not generally available. Pricing, service levels, deployment options, and packaged availability require a scoped agreement. The FDLC framework and guide remain open.</p></div>
    </section>
  </div></SiteShell>;
}
