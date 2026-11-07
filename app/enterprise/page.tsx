/* eslint-disable @next/next/no-html-link-for-pages -- Guide routes cross the microfrontend boundary. */
import type { Metadata } from "next";
import { operatingDomainExamples } from "../../data/software-factory-engineering";
import { ReferenceDiagram } from "../components/reference-diagrams";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { PageContentsNav } from "../components/page-contents-nav";
import { SiteShell } from "../components/site-shell";
import { enterpriseAdoption, enterpriseControls, enterpriseFactories, enterpriseGuideHref, enterprisePlatformServices, enterpriseReusableCapabilities, enterpriseRouting, enterpriseScale, enterpriseStages } from "../../data/enterprise";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Enterprise AI software factory platform", "One shared enterprise platform, composable outcome-specific factories, reusable capabilities, and verified outcomes. Explore governance, routing, verification, adoption, and FDLC Enterprise pricing discussions.", "/enterprise");

const contents = [
  { label: "Operating model", href: "#operating-model" },
  { label: "Shared platform", href: "#platform" },
  { label: "Factory portfolio", href: "#factory-portfolio" },
  { label: "Routing and dependencies", href: "#routing" },
  { label: "Verification", href: "#verification" },
  { label: "Operating domains", href: "#operating-domains" },
  { label: "Enterprise readiness", href: "#readiness" },
  { label: "Adoption and pricing", href: "#pricing" },
] as const;

export default function EnterprisePage() {
  return <SiteShell><div className="page-wrap enterprise-page">
    <PageHero eyebrow="FDLC Enterprise · design partnership" status="Proposed" variant="compact" title="One platform. Many verified outcomes." description="Proposed — not generally available. Centralize the enterprise infrastructure that should be shared. Compose factories only for materially different governed outcomes. Reuse qualified agents, harnesses, tools, model routes, context, and execution profiles across the portfolio." meta={[["Architecture", "Shared platform"], ["Operating units", "Composable factories"], ["Pricing", "Contact FDLC Enterprise"]]}>
      <div className="hero-actions"><a className="button button-dark" href="mailto:support@fdlc.ai?subject=FDLC%20Enterprise%20pricing%20and%20scope">Contact FDLC Enterprise</a><a className="text-action" href={enterpriseGuideHref}>Read the enterprise guide →</a></div>
    </PageHero>
    <PageContentsNav items={contents} />

    <section className="section-block" id="operating-model">
      <SectionHeader eyebrow="Enterprise operating model" title="Centralize infrastructure. Specialize outcomes." description="The architecture separates a singular enterprise platform from outcome-specific factories and reusable execution capabilities. Scale increases capacity and concurrency without requiring a factory per team or repository." />
      <ReferenceDiagram name="enterprise" />
      <p className="enterprise-note"><a href="/enterprise/multi-factory-software-delivery.png" target="_blank" rel="noreferrer">Original reference illustration ↗</a> · Its scale figures are illustrative, not a capacity benchmark.</p>
      <div className="enterprise-thesis" aria-label="Enterprise architecture thesis"><strong>One platform.</strong><strong>Composable factories.</strong><strong>Reusable capabilities.</strong></div>
      <p className="enterprise-note"><strong>Organizational scale and factory count are different dimensions.</strong> Builder scale is primarily a scheduling, quota, and concurrency problem. Repository scale is primarily a context, policy, ownership, and configuration problem. Workload scale is handled through WorkOrders, Tasks, Attempts, queues, sandboxes, and horizontal execution. Create another Factory Definition only when the governed outcome contract materially changes.</p>
      <div className="enterprise-routing">{enterpriseScale.map(([dimension, response], index) => <article key={dimension}><p className="section-label">Scale dimension {index + 1}</p><h3>{dimension}</h3><p>{response}</p></article>)}</div>
      <SectionHeader eyebrow="Example flow" title="From builder intent to a verified outcome." description="The builder states the result. Mission Control materializes and coordinates the durable execution contract. Factories perform bounded work; evidence and authority govern what advances." />
      <ReferenceDiagram name="delivery" />
      <details><summary>Read the stage responsibilities</summary><ol className="enterprise-stages">{enterpriseStages.map(([title, description], index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{title}</h3><p>{description}</p></div></li>)}</ol></details>
    </section>

    <section className="section-block" id="platform">
      <SectionHeader eyebrow="Shared enterprise infrastructure" title="One control plane and one governed capability ecosystem." description="Factories consume common platform services instead of duplicating orchestration, identity, inference, context, sandboxes, observability, policy, and evidence systems." />
      <ReferenceDiagram name="shared-platform" />
      <div className="enterprise-platform-grid">{enterprisePlatformServices.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}</div>
      <p className="enterprise-note"><strong>Mission Control is the meta-factory control plane.</strong> It owns Objective → Plan → WorkOrders → routing → state → evidence → authority → outcomes, including the cross-factory dependency graph. Factories do not form an uncontrolled peer-to-peer orchestration network. Every Objective, WorkOrder, Task, Attempt, tool call, and consequential action remains attributable to a human or service principal and bounded by delegated authority.</p>
      <p className="enterprise-note"><strong>Inference is not execution, and policy is not a prompt.</strong> Logical model routes select approved inference under quality, cost, availability, and regional constraints. Actual code changes, tests, scans, and builds run in isolated execution environments with filesystem, network, resource, and credential controls. Gateways, brokers, sandboxes, and release boundaries enforce policy outside the model.</p>
      <SectionHeader eyebrow="Reusable capabilities" title="Build and qualify capabilities for reuse across factory compositions." description="Agent count, model count, profile count, and factory count are independent. The same qualified coding agent or test harness can participate in several factories under different Plans, policies, profiles, and verification contracts." />
      <div className="enterprise-capability-grid">{enterpriseReusableCapabilities.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}</div>
      <p className="enterprise-note"><strong>Keep the boundaries clear.</strong> An agent is a reasoning role. A harness controls execution around a Task or agent. A model supplies inference. An Execution Profile absorbs repository, runtime, environment, and risk variation. A factory owns a stable class of governed outcomes.</p>
    </section>

    <section className="section-block" id="factory-portfolio">
      <SectionHeader eyebrow="Outcome-specific operating units" title="Start with a broad default. Add factories only when evidence justifies them." description="A Factory Definition carries an outcome contract, ownership, planning semantics, capability composition, qualification, verification, authority, service objectives, and lifecycle. A different workflow or implementation technique alone does not justify another factory." />
      <div className="enterprise-catalog">{enterpriseFactories.map(([name, scope, evidence]) => <article key={name}><h3>{name}</h3><p>{scope}</p><p><strong>Boundary:</strong> {evidence}</p></article>)}</div>
      <p className="enterprise-note"><strong>Factory creation test.</strong> Create a separate factory when outcome semantics, ownership, qualification, governance, risk, authority, lifecycle, or verification requirements are materially different. Otherwise use another skill, workflow, harness, capability route, or Execution Profile inside the existing factory.</p>
    </section>

    <section className="section-block" id="routing">
      <SectionHeader eyebrow="Routing and dependencies" title="Three decisions, with qualification before optimization." description="A routing score can rank eligible choices. It cannot override policy, missing qualification, expired evidence, or the builder’s authority." />
      <ReferenceDiagram name="routing" />
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
      <ReferenceDiagram name="verification" />
      <div className="enterprise-verification">
        <article><p className="section-label">Local / WorkOrder</p><h3>Did this factory satisfy its contract?</h3><ul><li>Exact input and Candidate artifact identities</li><li>WorkOrder acceptance criteria and required evidence</li><li>Build, tests, scans, policy, and artifact integrity</li><li>Independent verifier Attempt and attributable verdict</li></ul><p>A failure enters a bounded remediation path. Missing evidence is a blocked or incomplete result.</p></article>
        <article><p className="section-label">Global / Objective</p><h3>Does the composition achieve the outcome?</h3><ul><li>Required upstream WorkOrders complete with current evidence</li><li>Correct versions combined into one integrated Candidate</li><li>End-to-end behavior, regression, security, and performance</li><li>Objective acceptance criteria and release readiness</li></ul><p>Pre-release verification establishes eligibility. If the objective includes production outcomes, completion also requires post-release observation.</p></article>
      </div>
      <p className="enterprise-note"><strong>Independent verification is more than a second model.</strong> Prefer deterministic checks for builds, tests, policy, and digests. Use specialized evaluators and human review where judgment is required. Shared prompts, models, or missing context can create correlated failures even across separate agents.</p>
    </section>

    <section className="section-block" id="factory-versioning">
      <SectionHeader eyebrow="Factory versioning" title="Qualify immutable compositions and activate them for a declared scope." description="A Factory Definition names the governed outcome capability. A Factory Version identifies its immutable composition. An Execution Profile specializes the qualified operating envelope for a workload and environment." />
      <ReferenceDiagram name="composition" />
      <div className="enterprise-version"><p className="section-label">Version lifecycle</p><h3>Develop → Qualify → Promote → Activate → Observe → Improve</h3><p>Pin the supervisor recipe, skills, model routes, harnesses, tools, context policies, sandbox, and verification contract. Qualify the composition as well as its components. A published version is not automatically eligible for routing.</p><p>Improvements create new candidates. Suspending a bad version stops new admissions; routing can return to a previously qualified version that remains eligible. Reverting factory routing does not undo an application deployment or a database change.</p></div>
    </section>

    <section className="section-block" id="readiness">
      <SectionHeader eyebrow="Enterprise readiness" title="Make the operating requirements explicit before scaling." description="Use these as architecture and procurement requirements to validate together. Availability, deployment options, support, and commercial commitments must be confirmed for the agreed scope." />
      <div className="enterprise-grid">{enterpriseControls.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
      <div className="enterprise-version"><h3>Measure accepted outcomes and the effort to achieve them.</h3><p>Track objective success, first-attempt verification, escaped defects, rollback and recovery, end-to-end cycle time, human review minutes, and adoption. Attribute inference, compute, tools, verification, retries, and human intervention to the outcome.</p><p>Compare similar workloads over a declared observation window. Report sample size and missing data. Cost per accepted outcome is undefined when no outcomes are accepted; activity and token volume alone do not establish business value.</p><Link className="section-link" href="/benchmarks">Use the measurement contract →</Link></div>
    </section>

    <section className="section-block" id="operating-domains">
      <SectionHeader eyebrow="Autonomous Operating Domains" title="Delegate a class of work under explicit conditions." description="An Autonomous Operating Domain specifies the engineering work a qualified factory may execute within workload, authority, evidence, risk and operational boundaries. This is a framework contract to implement and qualify." />
      <ReferenceDiagram name="autonomy" />
      <details><summary>Compare eight workload classes</summary><div className="engineering-grid">{operatingDomainExamples.map(([name, conditions]) => <article key={name}><h3>{name}</h3><p>{conditions}</p></article>)}</div></details>
      <p>Record the Factory Version, workload scope, environment, tool permissions, credential scope, evidence requirements, named approvers, limits and safe-stop / recovery paths. Qualification must cover the whole composition. Routine recoverable failures can use bounded reconciliation without interrupting a human; consequential decisions retain an authorized owner.</p>
      <p><Link href="/about#engineering-discipline">Assign factory engineering responsibilities</Link> · <a href="/guide/02-design/07-governance-policy-and-risk-proportional-approval#autonomous-operating-domains">Use the Guide’s operating-domain contract</a></p>
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
