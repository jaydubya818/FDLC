import type { Metadata } from "next";
import Link from "next/link";
import { CopyValue } from "../components/copy-value";
import { MissionControlProductTour } from "../components/mission-control-experience";
import { NextSteps } from "../components/next-steps";
import { SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { pageHandoffs } from "../../data/page-handoffs";
import { pageMetadata } from "../../lib/metadata";
import { FdeIcon } from "./fde-icon";
import {
  deliverables,
  engagementPhases,
  factoryDefinition,
  fdeWorkflow,
  lighthouseCandidates,
  qualificationFacts,
  qualifiedBaselineDeployment,
  rollbackDeployment,
} from "./fde-content";

export const metadata: Metadata = pageMetadata(
  "AI-FDE — Factory Deployed Engineer",
  "Work with AI-FDE to discover and design a Factory Definition. A Factory Deployed Engineer remains the accountable human role.",
  "/deploy",
);

const humanResponsibilities = ["Discovery", "Architecture", "Factory Definition", "Workflow decomposition", "Trust boundaries", "Evaluation strategy", "Rollout", "Organizational adoption"];
const workerResponsibilities = ["Planning", "Implementation", "Testing", "Migration", "Remediation", "Verification", "Evidence collection"];
const controlResponsibilities = ["Authority", "Orchestration", "Execution", "Evidence", "Verification", "Recovery", "Approval", "Economics"];
const selectionCriteria = ["Bounded scope", "Repetitive work", "Clear acceptance criteria", "Existing baseline", "Independent verification", "Measurable business value", "Safe rollback"];
const missionControlObjects = ["WorkOrders", "Attempts", "Factory Versions", "Execution Profiles", "Evidence", "Verification", "Human Authority", "Recovery", "Economics"];

export default function DeployPage() {
  const productionDeployment = process.env.VERCEL_DEPLOYMENT_ID ?? qualifiedBaselineDeployment;

  return (
    <SiteShell>
      <div className="page-wrap fde-page">
        <header className="fde-product-hero">
          <div className="fde-product-hero-copy">
            <p className="section-label">AI-FDE / AI Factory Deployed Engineer</p>
            <h1>Build your software factory with a <em>Factory Deployed Engineer.</em></h1>
            <p className="fde-product-lede">AI-FDE is the product/system for discovering and designing a Factory Definition. A Factory Deployed Engineer (FDE) works inside your engineering environment to identify the right automation opportunity, design the Factory Definition, assemble the governed production line, prove it against real outcomes, and help your organization scale what works.</p>
            <div className="fde-product-proof" aria-label="What Factory Deployed Engineer is">
              <strong>Not another coding agent.</strong>
              <strong>Not a consulting deck.</strong>
              <span>A working factory line, operating against your real engineering system, with measurable evidence.</span>
            </div>
            <div className="hero-actions">
              <Link className="button button-dark" href="/maturity">Assess your factory readiness</Link>
              <a className="button button-light" href="#how-fde-works">See how FDE works</a>
              <Link className="text-action" href="/start">Explore a Factory Definition <span aria-hidden="true">→</span></Link>
              <Link className="text-action" href="/enterprise#pricing">Contact FDLC Enterprise for pricing <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <figure className="fde-factory-map" aria-label="How a Factory Deployed Engineer turns an engineering system into measurable outcomes">
            <div className="fde-map-chrome"><span>FDE engagement / Factory line</span><span>Intent → outcome</span></div>
            <div className="fde-map-layer is-input">
              <span>Your engineering system</span>
              <div>{["Repositories", "Teams", "CI/CD", "Backlog", "Standards", "Context"].map((item) => <b key={item}>{item}</b>)}</div>
            </div>
            <span className="fde-map-arrow" aria-hidden="true">↓</span>
            <div className="fde-map-layer is-fde">
              <span>Factory Deployed Engineer</span>
              <div>{["Discover", "Define", "Assemble", "Qualify", "Operate", "Transfer"].map((item, index) => <b key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</b>)}</div>
            </div>
            <span className="fde-map-arrow" aria-hidden="true">↓</span>
            <div className="fde-map-layer is-line">
              <span>Governed factory line</span>
              <div>{["Intent", "Plan", "Execute", "Verify", "Approve", "Release", "Learn"].map((item) => <b key={item}>{item}</b>)}</div>
            </div>
            <span className="fde-map-arrow" aria-hidden="true">↓</span>
            <div className="fde-map-outcomes">
              <span>Measurable outcomes</span>
              <div><b>Cycle time ↓</b><b>Defects ↓</b><b>Cost / outcome ↓</b><b>Human toil ↓</b><b>Verification reliability ↑</b></div>
            </div>
          </figure>
        </header>

        <section className="fde-human-system" id="human-digital-system">
          <header><p className="section-label">The operating team</p><h2>Humans lead.<br />Digital workers execute.</h2><p>The FDE is the human implementation layer—not another autonomous agent. People design the system and retain consequential authority; workers perform bounded operations; Mission Control makes the boundary enforceable.</p></header>
          <div className="fde-responsibility-grid">
            <article className="is-human"><span>01 / Human lead</span><h3>Factory Deployed Engineer</h3><p>Owns the factory design and organizational outcome.</p><ul>{humanResponsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="is-workers"><span>02 / Bounded execution</span><h3>Digital workers</h3><p>Perform authorized work and return attributable evidence.</p><ul>{workerResponsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="is-control"><span>03 / Control plane</span><h3>Mission Control</h3><p>Governs the runtime and preserves the operating record.</p><ul>{controlResponsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
        </section>

        <section className="section-block fde-ecosystem-section" id="ecosystem">
          <SectionHeader eyebrow="FDE in the FDLC ecosystem" title="From operating model to proven outcome." description="Factory Deployed Engineers join the open framework, methodology, and control plane into one real, measurable workflow." />
          <ol className="fde-ecosystem-flow">
            <li><span>01</span><strong>FDLC</strong><p>Defines the operating model.</p></li>
            <li><span>02</span><strong>The Guide</strong><p>Teaches the practices.</p></li>
            <li><span>03</span><strong>Mission Control</strong><p>Governs execution.</p></li>
            <li className="is-fde"><span>04</span><strong>Factory Deployed Engineer</strong><p>Applies the system.</p></li>
            <li><span>05</span><strong>Factory line</strong><p>Solves a real workflow.</p></li>
            <li className="is-outcome"><span>06</span><strong>Outcomes</strong><p>Prove whether it worked.</p></li>
          </ol>
        </section>

        <section className="section-block fde-workflow-section" id="how-fde-works">
          <SectionHeader eyebrow="What a Factory Deployed Engineer does" title="Understand. Design. Build. Prove. Scale." description="The work moves through six explicit stages. Every stage produces a durable artifact and evidence for the next decision." />
          <ol className="fde-workflow-grid">
            {fdeWorkflow.map((stage) => (
              <li key={stage.name}>
                <span>{stage.number}</span><FdeIcon name={stage.name === "Discover" ? "measure" : stage.name === "Define" ? "definition" : stage.name === "Assemble" ? "factory" : stage.name === "Qualify" ? "verify" : stage.name === "Operate" ? "control" : "scale"} />
                <h3>{stage.name}</h3><p>{stage.description}</p>
                <dl><div><dt>Input</dt><dd>{stage.input}</dd></div><div><dt>Output</dt><dd>{stage.output}</dd></div><div><dt>Evidence</dt><dd>{stage.evidence}</dd></div></dl>
              </li>
            ))}
          </ol>
        </section>

        <section className="fde-definition-section" id="factory-definition">
          <div className="fde-definition-copy">
            <p className="section-label">The primary design artifact</p>
            <h2>Begin with the factory required to produce the outcome safely.</h2>
            <p>The FDE does not begin by choosing a model. The FDE begins by defining the full factory: what it must produce, what may act, what evidence must return, where people decide, and how value will be measured.</p>
            <div className="hero-actions"><Link className="button button-light" href="/start">Explore Factory Definition <span aria-hidden="true">→</span></Link><Link className="text-action light-link" href="/architecture">Inspect the architecture <span aria-hidden="true">→</span></Link></div>
          </div>
          <div className="fde-definition-card">
            <div className="fde-definition-chrome"><span>Factory Definition</span><span>12 required concerns</span></div>
            <div className="fde-definition-core"><span>Outcome</span><strong>A governed factory line</strong><small>Select a component to inspect its responsibility.</small></div>
            <div className="fde-definition-grid">
              {factoryDefinition.map(([name, description], index) => <details key={name}><summary><span>{String(index + 1).padStart(2, "0")}</span>{name}</summary><p>{description}</p></details>)}
            </div>
          </div>
        </section>

        <section className="section-block fde-engagement-v2" id="engagement-model">
          <SectionHeader eyebrow="The FDE engagement model" title="Three phases. One evidence trail." description="Readiness selects the line. Lighthouse proves it. Scale remains conditional on evidence from real operation." />
          <ol className="fde-phase-journey">
            {engagementPhases.map((phase, index) => (
              <li className={index === 1 ? "is-lighthouse" : ""} key={phase.name}>
                <header><span>{phase.number}</span><div><h3>{phase.name}</h3><p>{phase.purpose}</p></div></header>
                <div className="fde-phase-body">
                  <div><strong>{index === 1 ? "Factory path" : "Inputs"}</strong><ul>{phase.inputs.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><strong>{index === 1 ? "Measure" : "FDE work"}</strong><ul>{phase.work.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
                <footer><span>Output</span><strong>{phase.output}</strong></footer>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-block fde-deliverables" id="deliverables">
          <SectionHeader eyebrow="What you leave with" title="A working system—not a recommendation deck." description="The engagement leaves behind the line, the controls, the proof, and the organizational capability to operate and extend it." />
          <div className="fde-deliverable-grid">{deliverables.map(([icon, name, description], index) => <article key={name}><div><FdeIcon name={icon} /><span>{String(index + 1).padStart(2, "0")}</span></div><h3>{name}</h3><p>{description}</p></article>)}</div>
        </section>

        <section className="section-block fde-candidates-v2" id="lighthouse-candidates">
          <SectionHeader eyebrow="Good lighthouse candidates" title="Start where evidence is easiest to prove." description="The first line should be commercially relevant and operationally bounded. It should teach the organization how to trust the factory—not ask the organization to trust everything at once." />
          <div className="fde-candidate-grid-v2">{lighthouseCandidates.map(([icon, name, description]) => <article key={name}><FdeIcon name={icon} /><h3>{name}</h3><p>{description}</p></article>)}</div>
          <div className="fde-selection-model">
            <div><p className="section-label">Good first factory lines have</p><ul>{selectionCriteria.map((item) => <li key={item}><span aria-hidden="true">✓</span>{item}</li>)}</ul></div>
            <aside><span>Bad first factory line</span><blockquote>“Build our next product autonomously.”</blockquote><p>Unbounded scope, ambiguous proof, and consequential authority make greenfield autonomy a poor first learning environment.</p></aside>
          </div>
        </section>

        <section className="fde-transformation-section" id="transformation">
          <header><p className="section-label">Before / after</p><h2>Move human attention from every operation to outcomes and exceptions.</h2></header>
          <aside className="fde-representative-example" aria-label="Representative Lighthouse engagement example">
            <div><span>Representative Lighthouse</span><strong>Dependency modernization</strong><small>Illustrative contract—no performance result claimed</small></div>
            <dl><div><dt>Input</dt><dd>Upgrade backlog + current baseline</dd></div><div><dt>Artifacts</dt><dd>Factory Definition, Factory Version, evaluation suite</dd></div><div><dt>Decision gates</dt><dd>Independent verification + human release authority</dd></div><div><dt>Outcome contract</dt><dd>Cycle time, defects, human minutes, accepted-upgrade cost</dd></div></dl>
          </aside>
          <div className="fde-before-after">
            <article><span>Before FDE</span><ol>{["Human receives work", "Manually investigates", "Edits", "Tests", "Reviews", "Waits", "Repeats"].map((item) => <li key={item}>{item}</li>)}</ol><strong>Humans perform every operation.</strong></article>
            <article className="is-after"><span>After factory line</span><ol>{["Intent", "Governed planning", "Bounded execution", "Independent verification", "Human authority", "Delivery", "Measured outcome"].map((item) => <li key={item}>{item}</li>)}</ol><strong>Humans govern outcomes and exceptions.</strong></article>
          </div>
        </section>

        <section className="section-block fde-measurement-section" id="measurement">
          <SectionHeader eyebrow="Prove the factory with outcomes" title="Compare the line with the baseline it replaces." description="FDE uses a measurement contract, not invented improvement claims. Real values appear only after the line produces attributable evidence." />
          <div className="fde-measurement-grid">
            {["Cycle time", "Human engineering minutes", "Defect escape rate", "Verification pass rate", "Cost per accepted WorkOrder", "Cost per released outcome"].map((metric, index) => <article key={metric}><span>{String(index + 1).padStart(2, "0")}</span><h3>{metric}</h3><div><b>Baseline</b><i aria-hidden="true">→</i><b>Factory outcome</b></div><small>Measured, not assumed</small></article>)}
          </div>
          <Link className="section-link" href="/benchmarks">Inspect the measurement contract <span aria-hidden="true">→</span></Link>
        </section>

        <section className="fde-builders-section" id="builders-and-fde">
          <div className="fde-builder-shift">
            <p className="section-label">Organizational transformation</p><h2>From developers to builders.</h2>
            <p>FDLC expands the builder population beyond people writing every line of code manually. Builders express intent, constraints, acceptance criteria, and authority while governed digital workers execute bounded work. Managers increasingly lead humans <em>and</em> digital workers.</p>
            <div>{["Intent", "Constraints", "Acceptance criteria", "Authority"].map((item) => <span key={item}>{item}</span>)}</div>
          </div>
          <div className="fde-role-card">
            <p className="section-label">The FDE</p><h2>One role across the whole system.</h2>
            <p>A Factory Deployed Engineer combines the disciplines required to make the line real and adoptable.</p>
            <ul>{["Software architecture", "AI / agent engineering", "Platform engineering", "Developer experience", "Evaluation", "Security", "Change leadership", "Operating-model design"].map((item) => <li key={item}>{item}</li>)}</ul>
            <footer>{["People", "Process", "Architecture", "Factory", "Evidence", "Outcomes"].map((item) => <span key={item}>{item}</span>)}</footer>
          </div>
        </section>

        <section className="section-block fde-collaboration-section" id="collaboration">
          <SectionHeader eyebrow="How we work together" title="Your domain. One shared factory. Capability you keep." description="FDE is embedded implementation with your experts—not a black-box handoff and not permanent dependency on an outside team." />
          <div className="fde-collaboration-grid">
            <article><span>01 / You bring</span><ul>{["A real workflow", "A baseline", "Domain experts", "Engineering constraints"].map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="is-together"><span>02 / We build together</span><ul>{["Factory Definition", "Lighthouse", "Evidence", "Operating model"].map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article><span>03 / You keep</span><ul>{["The factory line", "The evidence", "The capabilities", "The operating playbook", "The ability to scale"].map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
        </section>

        <section className="screenshots-section fde-customer-product" id="customer-product">
          <SectionHeader eyebrow="The customer product" title="This is where your team runs the factory." description="Mission Control is the operating dashboard delivered with the factory line. Your team sees work that needs attention, inspects bounded execution, reviews evidence, makes consequential decisions, and retains the audit trail." />
          <MissionControlProductTour />
          <div className="fde-customer-product-footer">
            <p><strong>What these screens show:</strong> the deterministic Software Factory demo and its operator experience. They demonstrate product structure—not a live customer engagement, customer activity, or performance result.</p>
            <Link className="section-link" href="/mission-control">Explore the full Mission Control product <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <section className="fde-control-section" id="mission-control">
          <div className="fde-control-copy"><p className="section-label">Autonomy without abdicating control</p><h2>See what ran, why it advanced, and how to recover.</h2><p>Mission Control gives the team visibility into work, evidence, approvals, cost, and rollback. Agents may propose. Workers may execute. Verifiers may evaluate. Humans retain consequential authority. The control plane makes those boundaries enforceable.</p><Link className="button button-light" href="/mission-control">Explore Mission Control <span aria-hidden="true">→</span></Link></div>
          <div className="fde-control-plane"><div><span>Mission Control</span><strong>Governed runtime</strong></div><ul>{missionControlObjects.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ul><p>Execution complete ≠ Verified ≠ Approved ≠ Released ≠ Outcome proven</p></div>
        </section>

        <section className="fde-partnership-v2" id="design-partnership">
          <div><p className="section-label">Design partnership</p><h2>Bring one real workflow and its current baseline.</h2></div>
          <div><p>Begin with the maturity assessment and Factory Definition. Direct intake remains closed until the engagement and privacy paths are ready; the preparation tools are available now.</p><div className="hero-actions"><Link className="button button-light" href="/maturity">Assess your factory readiness</Link><Link className="text-action light-link" href="/start">Build a Factory Definition <span aria-hidden="true">→</span></Link></div></div>
        </section>

        <section className="section-block fde-qualification-v2" id="qualification-status">
          <SectionHeader eyebrow="Current FDE qualification environment" title="Prepared and verified. Deliberately dormant." description="This supporting evidence records the prepared qualification environment and public release posture. It is not presented as customer-operation evidence." />
          <div className="fde-qualification-states">
            <article><span>Production</span><strong>Qualified / Healthy</strong></article>
            <article><span>Qualification environment</span><strong>Ready</strong></article>
            <article className="is-dormant"><span>Phase 3</span><strong>Dormant / Not activated</strong></article>
            <article><span>Bedrock live calls</span><strong>0</strong></article>
          </div>
          <div className="fde-evidence-ledger">
            <div><p className="section-label">Qualification identity</p><dl>{qualificationFacts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd><CopyValue label={label} value={value} /></dd></div>)}</dl></div>
            <div><p className="section-label">Release and recovery</p><dl>
              <div><dt>Current Production deployment</dt><dd><CopyValue label="current Production deployment" value={productionDeployment} /></dd></div>
              <div><dt>Qualified baseline</dt><dd><CopyValue label="qualified baseline" value={qualifiedBaselineDeployment} /></dd></div>
              <div><dt>Retained rollback target</dt><dd><CopyValue label="retained rollback target" value={rollbackDeployment} /></dd></div>
              <div><dt>Production aliases</dt><dd><code>fdlc.ai · www.fdlc.ai</code></dd></div>
              <div><dt>Immutable runtime supply chain</dt><dd>Immutable ECR image digests and exact secret-version references are pinned. No secret values are published.</dd></div>
            </dl></div>
          </div>
        </section>

        <aside className="fde-maturity-boundary" aria-label="Factory Deployed Engineer maturity boundary">
          <div><p className="section-label">Maturity boundary</p><h2>Qualification-ready infrastructure is not live qualification.</h2></div>
          <p>The current evidence proves a prepared, no-drift qualification environment and a healthy public FDLC release. It does not prove Phase 3 execution, Bedrock inference, sustained customer operation, provider economics, or fleet-scale reliability. Those claims require separately authorized live evidence.</p>
        </aside>
        <NextSteps {...pageHandoffs.deploy} />
      </div>
    </SiteShell>
  );
}
