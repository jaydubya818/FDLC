import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { factoryLines } from "../../data/fdlc";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata(
  "FDE",
  "Qualification status and engagement model for FDLC Deploy and the Factory Deployed Engineer.",
  "/deploy",
);

const engagements = [
  ["01", "FDLC Readiness", "Find the right first line.", ["Current maturity", "Candidate workflows", "Baseline metrics", "Governance and architecture", "Lighthouse opportunity"]],
  ["02", "FDLC Lighthouse", "Implement one bounded production line.", ["Speed and cycle time", "Quality and defects", "Attributable cost", "Human effort", "Verification reliability"]],
  ["03", "FDLC Scale", "Expand a proven operating model.", ["Repositories", "Teams", "Workflow classes", "Shared capabilities", "Organization controls"]],
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

export default function DeployPage() {
  const productionDeployment = process.env.VERCEL_DEPLOYMENT_ID ?? qualifiedBaselineDeployment;

  return (
    <SiteShell>
      <div className="page-wrap">
        <PageHero
          eyebrow="FDLC Deploy / FDE"
          status="Qualification ready"
          variant="compact"
          title="Deploy a governed factory line where it must actually work."
          description="FDLC Deploy is the forward-deployed path for applying FDLC in a real environment. The Factory Deployed Engineer qualification environment is ready, while Phase 3 live activation remains deliberately dormant."
          meta={[["Production", "Qualified / Healthy"], ["Environment", "Qualification ready"], ["Phase 3", "Dormant / Not activated"]]}
        >
          <div className="hero-actions">
            <a className="button button-dark" href="#qualification-status">View qualification status</a>
            <Link className="button button-light" href="/start">Define a factory line</Link>
          </div>
        </PageHero>

        <section className="section-block deployment-status-section" id="qualification-status">
          <SectionHeader
            eyebrow="Verified deployment state"
            title="Ready for controlled activation—not represented as live operation."
            description="The infrastructure, identity, immutable images, runtime bindings, and Mission Control qualification workspace are provisioned and verified. This state is a prerequisite for Phase 3; it is not evidence that Phase 3 workloads or model calls have run."
          />
          <div className="deployment-status-grid">
            <article>
              <span>Production</span>
              <strong>Qualified / Healthy</strong>
              <p>FDLC.ai is serving the exact qualified release through its canonical Production aliases.</p>
            </article>
            <article>
              <span>Qualification environment</span>
              <strong>Ready</strong>
              <p>AWS and Mission Control qualification resources are configured for a bounded, non-production activation.</p>
            </article>
            <article className="is-dormant">
              <span>Phase 3</span>
              <strong>Dormant / Not activated</strong>
              <p>Runtime services remain at zero desired tasks. No Factory Engineer workload has executed.</p>
            </article>
          </div>

          <div className="deployment-ledger">
            <div>
              <p className="section-label">Qualification identity</p>
              <dl>
                {qualificationFacts.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd><code>{value}</code></dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <p className="section-label">Release and recovery</p>
              <dl>
                <div><dt>Current Production deployment</dt><dd><code>{productionDeployment}</code></dd></div>
                <div><dt>Qualified baseline before this UI release</dt><dd><code>{qualifiedBaselineDeployment}</code></dd></div>
                <div><dt>Retained rollback target</dt><dd><code>{rollbackDeployment}</code></dd></div>
                <div><dt>Production aliases</dt><dd><code>fdlc.ai · www.fdlc.ai</code></dd></div>
                <div><dt>Runtime supply chain</dt><dd>Immutable ECR image digests and exact secret-version references are pinned. No secret values are published here.</dd></div>
                <div><dt>Bedrock live calls</dt><dd><strong>0</strong></dd></div>
              </dl>
            </div>
          </div>

          <aside className="deployment-boundary" aria-label="Qualification maturity and limitations">
            <div>
              <p className="section-label">Maturity boundary</p>
              <h2>Qualification-ready infrastructure is not live qualification.</h2>
            </div>
            <p>The current evidence proves a prepared, no-drift qualification environment and a healthy public FDLC release. It does not prove Phase 3 execution, Bedrock inference, sustained customer operation, provider economics, or fleet-scale reliability. Those claims require separately authorized live evidence.</p>
          </aside>
        </section>

        <section className="section-block">
          <SectionHeader eyebrow="Engagement model" title="Three phases. One evidence trail." />
          <div className="engagement-grid">
            {engagements.map(([number, name, headline, items]) => (
              <article key={name}><span>{number}</span><h2>{name}</h2><strong>{headline}</strong><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></article>
            ))}
          </div>
        </section>

        <section className="section-block">
          <SectionHeader eyebrow="Good lighthouse candidates" title="Start with bounded, repetitive, verifiable work." description="The first factory line should have clear evidence and business value. Fully autonomous greenfield product development is a poor first proof." />
          <div className="factory-line-grid">{factoryLines.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}</div>
        </section>

        <section className="restrained-cta">
          <div><p className="section-label">Design partnership</p><h2>Bring one real workflow and its current baseline.</h2></div>
          <div><p>Begin with the maturity assessment and Factory Definition. Direct intake remains closed until the engagement and privacy paths are ready; the preparation tools are available now.</p><div className="hero-actions"><Link className="button button-light" href="/maturity">Assess readiness</Link><Link className="text-action light-link" href="/start">Build a Factory Definition →</Link></div></div>
        </section>
      </div>
    </SiteShell>
  );
}
