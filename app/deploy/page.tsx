import type { Metadata } from "next";
import Link from "next/link";
import { MissionControlProductTour } from "../components/mission-control-experience";
import { NextSteps } from "../components/next-steps";
import { SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { factoryDefinitionConcerns, missionControlHandoffBoundary } from "../../data/ai-fde";
import { pageHandoffs } from "../../data/page-handoffs";
import { pageMetadata } from "../../lib/metadata";
import { FdeIcon } from "./fde-icon";
import {
  deliverables,
  engagementPhases,
  fdeWorkflow,
  lighthouseCandidates,
} from "./fde-content";

export const metadata: Metadata = pageMetadata(
  "AI-FDE — AI Factory Deployed Engineer",
  "AI-FDE turns enterprise evidence into an approved Factory Definition for governed qualification in Mission Control, with an accountable human Factory Deployed Engineer in control.",
  "/deploy",
);

const humanResponsibilities = ["Discovery", "Architecture", "Factory Definition", "Workflow decomposition", "Trust boundaries", "Evaluation strategy", "Rollout", "Organizational adoption"];
const workerResponsibilities = ["Evidence ingestion", "Candidate claims", "Current-state modeling", "Target workflow design", "Economics", "Readiness", "Handoff preparation"];
const controlResponsibilities = ["Authority", "Orchestration", "Execution", "Evidence", "Verification", "Recovery", "Approval", "Economics"];
const selectionCriteria = ["Bounded scope", "Repetitive work", "Clear acceptance criteria", "Existing baseline", "Independent verification", "Measurable business value", "Safe rollback"];
const missionControlObjects = ["WorkOrders", "Attempts", "Factory Versions", "Execution Profiles", "Evidence", "Verification", "Human Authority", "Recovery", "Economics"];

export default function DeployPage() {
  return (
    <SiteShell>
      <div className="page-wrap fde-page">
        <header className="fde-product-hero">
          <div className="fde-product-hero-copy">
            <p className="section-label">AI FACTORY DEPLOYED ENGINEER</p>
            <h1>Design your <em>software factory.</em></h1>
            <p className="fde-product-lede">Use AI-FDE to turn evidence about your engineering workflow into a reviewed Factory Definition. An accountable human Factory Deployed Engineer owns the design; Mission Control qualifies the runtime.</p>
            <div className="fde-product-proof" aria-label="What AI-FDE is">
              <strong>Evidence → Reviewed design → Runtime qualification</strong>
              <span>Internal alpha · Explore a synthetic workspace.</span>
            </div>
            <div className="hero-actions">
              <a className="button button-dark" href="/deploy/app">Open AI-FDE <span aria-hidden="true">→</span></a>
              <a className="button button-light" href="#how-ai-fde-works">See how AI-FDE works</a>
              <Link className="text-action" href="/maturity">Assess readiness <span aria-hidden="true">→</span></Link>
              <Link className="text-action" href="/start">Build a Factory Definition <span aria-hidden="true">→</span></Link>
            </div>
          </div>

          <figure className="fde-factory-map" aria-label="How AI-FDE turns enterprise evidence into governed implementation intent">
            <div className="fde-map-chrome"><span>AI-FDE / Evidence workspace</span><span>Source → definition</span></div>
            <div className="fde-map-layer is-input">
              <span>Your engineering system</span>
              <div>{["Repositories", "Teams", "CI/CD", "Backlog", "Standards", "Context"].map((item) => <b key={item}>{item}</b>)}</div>
            </div>
            <span className="fde-map-arrow" aria-hidden="true">↓</span>
            <div className="fde-map-layer is-fde">
              <span>AI-FDE + accountable FDE</span>
              <div>{["Ingest", "Model", "Review", "Design", "Approve", "Prepare"].map((item, index) => <b key={item}><i>{String(index + 1).padStart(2, "0")}</i>{item}</b>)}</div>
            </div>
            <span className="fde-map-arrow" aria-hidden="true">↓</span>
            <div className="fde-map-layer is-line">
              <span>Factory Definition</span>
              <div>{["Objective", "Workflow", "Capabilities", "Authority", "Verification", "Economics"].map((item) => <b key={item}>{item}</b>)}</div>
            </div>
            <span className="fde-map-arrow" aria-hidden="true">↓</span>
            <div className="fde-map-outcomes">
              <span>Mission Control boundary</span>
              <div><b>Validate</b><b>Qualify</b><b>Version</b><b>Execute</b><b>Verify</b><b>Release</b></div>
            </div>
          </figure>
        </header>

        <section className="fde-human-system" id="human-digital-system">
          <header><p className="section-label">The operating team</p><h2>AI-FDE assists.<br />The human FDE remains accountable.</h2><p>AI-FDE is the product. The Factory Deployed Engineer is the human role that owns architecture, judgment, authority, adoption, and outcomes. Mission Control owns governed runtime qualification and execution.</p></header>
          <div className="fde-responsibility-grid">
            <article className="is-human"><span>01 / Human lead</span><h3>Factory Deployed Engineer</h3><p>Owns the factory design and organizational outcome.</p><ul>{humanResponsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="is-workers"><span>02 / Evidence product</span><h3>AI-FDE</h3><p>Discovers and designs from reviewed enterprise evidence.</p><ul>{workerResponsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
            <article className="is-control"><span>03 / Control plane</span><h3>Mission Control</h3><p>Governs the runtime and preserves the operating record.</p><ul>{controlResponsibilities.map((item) => <li key={item}>{item}</li>)}</ul></article>
          </div>
        </section>

        <section className="section-block fde-ecosystem-section" id="ecosystem">
          <SectionHeader eyebrow="AI-FDE in the FDLC ecosystem" title="One product boundary at every stage." description="FDLC defines the model. AI-FDE discovers and designs the factory. The human FDE owns the judgment. Mission Control governs qualification and execution." />
          <ol className="fde-ecosystem-flow">
            <li><span>01</span><strong>FDLC</strong><p>Defines the operating model.</p></li>
            <li><span>02</span><strong>AI-FDE</strong><p>Discovers and designs it.</p></li>
            <li className="is-fde"><span>03</span><strong>Human FDE</strong><p>Owns it.</p></li>
            <li><span>04</span><strong>Mission Control</strong><p>Governs it.</p></li>
            <li><span>05</span><strong>Factory</strong><p>Executes it.</p></li>
            <li className="is-outcome"><span>06</span><strong>Outcome</strong><p>Proves it.</p></li>
          </ol>
        </section>

        <section className="section-block fde-workflow-section" id="how-ai-fde-works">
          <SectionHeader eyebrow="How AI-FDE works" title="Evidence in. Governed intent out." description="AI-FDE assists the human FDE through six explicit stages. It does not silently promote inference to truth or approved intent to runtime." />
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
            <p>AI-FDE does not begin by choosing a model. It helps the human FDE define what the factory must produce, what may act, what evidence must return, where people decide, and how value will be measured.</p>
            <div className="hero-actions"><Link className="button button-light" href="/start">Explore Factory Definition <span aria-hidden="true">→</span></Link><Link className="text-action light-link" href="/architecture">Inspect the architecture <span aria-hidden="true">→</span></Link></div>
          </div>
          <div className="fde-definition-card">
            <div className="fde-definition-chrome"><span>Factory Definition</span><span>12 required concerns</span></div>
            <div className="fde-definition-core"><span>Outcome</span><strong>A governed factory line</strong><small>Select a component to inspect its responsibility.</small></div>
            <div className="fde-definition-grid">
              {factoryDefinitionConcerns.map(({ name, description }, index) => <details key={name}><summary><span>{String(index + 1).padStart(2, "0")}</span>{name}</summary><p>{description}</p></details>)}
            </div>
          </div>
        </section>

        <section className="section-block fde-engagement-v2" id="engagement-model">
          <SectionHeader eyebrow="The human-led engagement model" title="Three phases. One evidence trail." description="AI-FDE supports the evidence and design work. The human FDE owns the decisions. Scale remains conditional on evidence from real operation." />
          <ol className="fde-phase-journey">
            {engagementPhases.map((phase, index) => (
              <li className={index === 1 ? "is-lighthouse" : ""} key={phase.name}>
                <header><span>{phase.number}</span><div><h3>{phase.name}</h3><p>{phase.purpose}</p></div></header>
                <div className="fde-phase-body">
                  <div><strong>{index === 1 ? "Factory path" : "Inputs"}</strong><ul>{phase.inputs.map((item) => <li key={item}>{item}</li>)}</ul></div>
                  <div><strong>{index === 1 ? "Measure" : "Human + AI-FDE work"}</strong><ul>{phase.work.map((item) => <li key={item}>{item}</li>)}</ul></div>
                </div>
                <footer><span>Output</span><strong>{phase.output}</strong></footer>
              </li>
            ))}
          </ol>
        </section>

        <section className="section-block fde-deliverables" id="deliverables">
          <SectionHeader eyebrow="What AI-FDE produces" title="A governed definition—not an unreviewed recommendation." description="The primary output is an inspectable, attributable Factory Definition. Runtime qualification and execution remain separate Mission Control responsibilities." />
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
          <header><p className="section-label">Before / after</p><h2>Make the handoff explicit.</h2></header>
          <aside className="fde-representative-example" aria-label="Representative Lighthouse engagement example">
            <div><span>Representative Lighthouse</span><strong>Dependency modernization</strong><small>Illustrative contract—no performance result claimed</small></div>
            <dl><div><dt>Input</dt><dd>Upgrade backlog + current baseline</dd></div><div><dt>Artifacts</dt><dd>Factory Definition, Factory Version, evaluation suite</dd></div><div><dt>Decision gates</dt><dd>Independent verification + human release authority</dd></div><div><dt>Outcome contract</dt><dd>Cycle time, defects, human minutes, accepted-upgrade cost</dd></div></dl>
          </aside>
          <div className="fde-before-after">
            <article><span>Before AI-FDE</span><ol>{["Scattered source material obscures the current workflow.", "Unstated assumptions become implementation decisions.", "Teams start work without agreed acceptance criteria."].map((item) => <li key={item}>{item}</li>)}</ol><strong>Engineering starts from uncertain intent.</strong></article>
            <article className="is-after"><span>After the AI-FDE handoff</span><ol>{["AI-FDE links source evidence to reviewable claims.", "The human FDE approves a Factory Definition.", "Mission Control qualifies a Factory Version before execution."].map((item) => <li key={item}>{item}</li>)}</ol><strong>Reviewed intent. Qualified execution.</strong></article>
          </div>
        </section>

        <section className="section-block fde-measurement-section" id="measurement">
          <SectionHeader eyebrow="Define proof before execution" title="Compare the future line with the baseline it replaces." description="AI-FDE captures a measurement contract, not invented improvement claims. Real values appear only after Mission Control produces attributable execution evidence." />
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
          <SectionHeader eyebrow="How the human FDE works with you" title="Your domain. Reviewed evidence. Accountable decisions." description="The human FDE leads the engagement with your experts while AI-FDE makes evidence, claims, decisions, and implementation intent inspectable." />
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
          <SectionHeader eyebrow="Current AI-FDE status" title="Synthetic product path qualified. Live operation not claimed." description="The public demo is deterministic and synthetic. Its source and browser gates are current, but this is not customer-operation, live-model, or Production-runtime evidence." />
          <div className="fde-qualification-states">
            <article><span>Product stage</span><strong>Internal alpha</strong></article>
            <article><span>Public path</span><strong>Synthetic demo</strong></article>
            <article className="is-dormant"><span>Live qualification</span><strong>Not activated</strong></article>
            <article><span>Live model calls</span><strong>0</strong></article>
          </div>
          <div className="fde-evidence-ledger">
            <div><p className="section-label">Evidence boundary</p><dl>
              <div><dt>Qualified source</dt><dd>Exact merged revision; full trust, contract, build, browser, and accessibility gates passed 2026-09-14.</dd></div>
              <div><dt>Demo data</dt><dd>Deterministic synthetic fixtures only. Browser-local demo state.</dd></div>
              <div><dt>Network boundary</dt><dd>Invalid fallback API origin; hosted demo must not make live service calls.</dd></div>
            </dl></div>
            <div><p className="section-label">Factory Definition handoff</p><dl>
              <div><dt>AI-FDE may</dt><dd>{missionControlHandoffBoundary.aiFdeMay.join(" · ")}</dd></div>
              <div><dt>AI-FDE may not</dt><dd>{missionControlHandoffBoundary.aiFdeMayNot.join(" · ")}</dd></div>
              <div><dt>Mission Control owns</dt><dd>{missionControlHandoffBoundary.missionControlOwns.join(" · ")}</dd></div>
              <div><dt>Sanitized evidence</dt><dd><a href="https://github.com/jaydubya818/AI-FDE-Agent/actions/runs/34879502699" rel="noreferrer" target="_blank">Inspect the exact-source qualification run ↗</a></dd></div>
            </dl></div>
          </div>
        </section>

        <aside className="fde-maturity-boundary" aria-label="AI-FDE maturity boundary">
          <div><p className="section-label">Maturity boundary</p><h2>Synthetic qualification is not live operational proof.</h2></div>
          <p>The current evidence proves the deterministic synthetic workflow and its release safety controls. It does not prove customer operation, live inference, runtime convergence with Mission Control, realized ROI, or fleet-scale reliability.</p>
        </aside>
        <NextSteps {...pageHandoffs.deploy} />
      </div>
    </SiteShell>
  );
}
