import type { Metadata } from "next";
import Link from "next/link";
import { SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Factory Deployed Engineer (FDE)",
  "Assess readiness, prove one bounded factory line, and scale the operating model with evidence throughout.",
  "/deploy",
);

const phases = [
  {
    number: "01",
    name: "FDLC Readiness",
    subtitle: "Find the right first line.",
    items: ["Current maturity", "Candidate workflows", "Baseline metrics", "Governance and architecture", "Lighthouse opportunity"],
    outcome: "Understand. Plan. Select.",
    purpose: "Establish where the organization is today, what work is suitable for a first factory line, and what evidence will define success.",
  },
  {
    number: "02",
    name: "FDLC Lighthouse",
    subtitle: "Implement one bounded production line.",
    items: ["Speed and cycle time", "Quality and defects", "Attributable cost", "Human effort", "Verification reliability"],
    outcome: "Prove value. Measure impact.",
    purpose: "Build and evaluate one governed workflow against its existing baseline without pretending that one proof establishes fleet-scale maturity.",
  },
  {
    number: "03",
    name: "FDLC Scale",
    subtitle: "Expand a proven operating model.",
    items: ["Repositories", "Teams", "Workflow classes", "Shared capabilities", "Organization controls"],
    outcome: "Scale reliably. Multiply outcomes.",
    purpose: "Extend only what the lighthouse has proven, preserving the controls, evidence contracts, and measurement discipline that made it trustworthy.",
  },
] as const;

const candidates = [
  ["dependency", "Dependency modernization", "Upgrade libraries and frameworks across repositories with compatibility proof."],
  ["api", "API migration", "Replace deprecated interfaces with supported patterns and contract tests."],
  ["shield", "Vulnerability remediation", "Find, fix, test, and verify known vulnerability classes."],
  ["quality", "Quality remediation", "Repair flaky tests, coverage gaps, static-analysis findings, and recurring debt."],
  ["docs", "Documentation maintenance", "Detect stale technical documentation and validate updates against source."],
  ["review", "Code review assistance", "Produce evidence-backed findings while leaving consequential decisions to reviewers."],
] as const;

const qualificationFacts = [
  ["AWS qualification account", "083665737366"],
  ["Region", "us-east-1"],
  ["Qualification hostname", "qual.factory-engineer.fdlc.ai"],
  ["Convex deployment", "calm-buffalo-854"],
  ["Mission Control workspace", "mission-control://qualification/fdlc-phase-3"],
  ["Mission Control project", "j17ve66cdc005ntgr6qj31b0fs8dwc62"],
] as const;

const qualifiedBaselineDeployment = "dpl_BHi24iX4NmZZ8WNyuspDHaYg5DX2";
const rollbackDeployment = "dpl_3dH5VgLN9abgG9B8L9vdGKNnHiCn";

function CandidateIcon({ type }: { type: (typeof candidates)[number][0] }) {
  const shared = { fill: "none", stroke: "currentColor", strokeLinecap: "round" as const, strokeLinejoin: "round" as const, strokeWidth: 1.5 };
  return (
    <svg aria-hidden="true" className="fde-candidate-icon" viewBox="0 0 32 32">
      {type === "dependency" && <><path {...shared} d="M9 8h14v6H9zM9 18h14v6H9z" /><path {...shared} d="M16 14v4M6 11h3m14 0h3M6 21h3m14 0h3" /></>}
      {type === "api" && <><path {...shared} d="M12 7 5 16l7 9M20 7l7 9-7 9M18 5l-4 22" /></>}
      {type === "shield" && <><path {...shared} d="M16 4 26 8v7c0 6.5-4.2 10.7-10 13-5.8-2.3-10-6.5-10-13V8z" /><path {...shared} d="m11.5 16 3 3 6-7" /></>}
      {type === "quality" && <><circle {...shared} cx="16" cy="16" r="11" /><path {...shared} d="m10.5 16 3.5 3.5 7.5-8" /></>}
      {type === "docs" && <><path {...shared} d="M8 4h11l5 5v19H8z" /><path {...shared} d="M19 4v6h5M12 15h8M12 20h8" /></>}
      {type === "review" && <><path {...shared} d="M6 7h20v15H14l-6 5v-5H6z" /><path {...shared} d="m11 14 3 3 7-7" /></>}
    </svg>
  );
}

export default function DeployPage() {
  const productionDeployment = process.env.VERCEL_DEPLOYMENT_ID ?? qualifiedBaselineDeployment;

  return (
    <SiteShell>
      <div className="page-wrap fde-page">
        <header className="fde-hero">
          <div className="fde-hero-copy">
            <p className="section-label">Factory Deployed Engineer (FDE)</p>
            <h1>Three phases.<br />One evidence trail.</h1>
            <p className="fde-hero-lede">Assess readiness, prove one bounded factory line, and scale the operating model—while preserving the evidence, controls, and human authority required to trust every outcome.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/maturity">Assess readiness</Link>
              <Link className="button button-light" href="/start">Build a Factory Definition</Link>
            </div>
          </div>

          <aside className="fde-status-card" aria-label="Factory Deployed Engineer qualification status">
            <div className="fde-status-chrome"><span>FDE status</span><span>Qualification environment</span></div>
            <div className="fde-status-heading">
              <span className="fde-status-mark" aria-hidden="true">✓</span>
              <div><p>Qualification ready</p><h2>Prepared and verified.<br />Deliberately dormant.</h2></div>
            </div>
            <p className="fde-status-summary">The environment is provisioned and verified. Phase 3 live activation has not started.</p>
            <dl className="fde-status-states">
              <div><dt>Production</dt><dd><span aria-hidden="true">●</span> Qualified / Healthy</dd></div>
              <div><dt>Qualification environment</dt><dd><span aria-hidden="true">●</span> Ready</dd></div>
              <div className="is-dormant"><dt>Phase 3</dt><dd><span aria-hidden="true">○</span> Dormant / Not activated</dd></div>
            </dl>
            <dl className="fde-status-meta">
              <div><dt>Current deployment</dt><dd><code>{productionDeployment}</code></dd></div>
              <div><dt>Rollback target</dt><dd><code>{rollbackDeployment}</code></dd></div>
              <div><dt>Qualified baseline</dt><dd><code>{qualifiedBaselineDeployment}</code></dd></div>
              <div><dt>Bedrock live calls</dt><dd><strong>0</strong></dd></div>
            </dl>
          </aside>
        </header>

        <section className="fde-role-strip" aria-label="How Factory Deployed Engineer fits the FDLC ecosystem">
          <article><span>01 / Operating model</span><strong>FDLC defines it.</strong></article>
          <article><span>02 / Control plane</span><strong>Mission Control governs it.</strong></article>
          <article><span>03 / Applied engagement</span><strong>FDE applies it.</strong></article>
        </section>

        <section className="section-block fde-engagement" id="engagement-model">
          <SectionHeader eyebrow="The FDE engagement model" title="From readiness to real impact." description="Each phase earns the next. Start with the operating baseline, prove one bounded line against measurable outcomes, then scale only what the evidence supports." />
          <ol className="fde-phase-grid">
            {phases.map((phase) => (
              <li key={phase.name}>
                <div className="fde-phase-index"><span>{phase.number}</span><span aria-hidden="true">→</span></div>
                <h2>{phase.name}</h2>
                <strong>{phase.subtitle}</strong>
                <ul>{phase.items.map((item) => <li key={item}>{item}</li>)}</ul>
                <p className="fde-phase-outcome">{phase.outcome}</p>
                <p className="fde-phase-purpose">{phase.purpose}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-block fde-candidates" id="lighthouse-candidates">
          <SectionHeader eyebrow="Good lighthouse candidates" title="Start with bounded, repetitive, verifiable work." description="The first factory line should have clear evidence and business value. Fully autonomous greenfield product development is a poor first proof." />
          <div className="fde-candidate-grid">
            {candidates.map(([icon, name, description], index) => (
              <article key={name}>
                <div><CandidateIcon type={icon} /><span>{String(index + 1).padStart(2, "0")}</span></div>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fde-partnership" id="design-partnership">
          <div><p className="section-label">Design partnership</p><h2>Bring one real workflow<br />and its current baseline.</h2></div>
          <div>
            <p>Begin with the maturity assessment and Factory Definition. Direct intake remains closed until the engagement and privacy paths are ready; the preparation tools are available now.</p>
            <div className="hero-actions"><Link className="button button-light" href="/maturity">Assess readiness</Link><Link className="text-action light-link" href="/start">Build a Factory Definition <span aria-hidden="true">→</span></Link></div>
          </div>
        </section>

        <section className="section-block fde-evidence" id="qualification-status">
          <SectionHeader eyebrow="Evidence & qualification" title="Trust starts with an inspectable state." description="The public identifiers below record the prepared qualification environment and release posture without exposing credentials or secret material." />
          <div className="fde-evidence-ledger">
            <div>
              <p className="section-label">Qualification identity</p>
              <dl>{qualificationFacts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><code>{value}</code></dd></div>)}</dl>
            </div>
            <div>
              <p className="section-label">Release and recovery</p>
              <dl>
                <div><dt>Current Production deployment</dt><dd><code>{productionDeployment}</code></dd></div>
                <div><dt>Qualified baseline</dt><dd><code>{qualifiedBaselineDeployment}</code></dd></div>
                <div><dt>Retained rollback target</dt><dd><code>{rollbackDeployment}</code></dd></div>
                <div><dt>Production aliases</dt><dd><code>fdlc.ai · www.fdlc.ai</code></dd></div>
                <div><dt>Immutable runtime supply chain</dt><dd>Immutable ECR image digests and exact secret-version references are pinned. No secret values are published.</dd></div>
                <div><dt>Bedrock live calls</dt><dd><strong>0</strong></dd></div>
              </dl>
            </div>
          </div>
        </section>

        <aside className="fde-maturity-boundary" aria-label="Factory Deployed Engineer maturity boundary">
          <div><p className="section-label">Maturity boundary</p><h2>Qualification-ready infrastructure is not live qualification.</h2></div>
          <p>The current evidence proves a prepared, no-drift qualification environment and a healthy public FDLC release. It does not prove Phase 3 execution, Bedrock inference, sustained customer operation, provider economics, or fleet-scale reliability. Those claims require separately authorized live evidence.</p>
        </aside>
      </div>
    </SiteShell>
  );
}
