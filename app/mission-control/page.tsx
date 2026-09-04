import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CopyButton } from "../components/copy-button";
import { MissionControlFlow, MissionControlProductTour } from "../components/mission-control-experience";
import { SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { StateBoundary } from "../components/state-boundary";
import { StatusBadge } from "../components/status-badge";
import { missionControlCapabilities, missionControlObjects } from "../../data/mission-control";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Mission Control", "The open-source reference implementation of the Factory Development Lifecycle.", "/mission-control");

const quickstartCommands = `git clone https://github.com/jaydubya818/MissionControl.git
cd MissionControl
corepack enable && pnpm install
cp .env.example .env.local
pnpm exec convex dev --once

# Terminal 1
pnpm run dev:demo

# Terminal 2
pnpm run convex:seed:demo:force`;

export default function MissionControlPage() {
  return <SiteShell><div className="page-wrap mission-page">
    <section className="mc-product-hero">
      <div className="mc-product-hero-copy">
        <p className="section-label">Mission Control / Open-source FDLC reference</p>
        <h1>Governed autonomous delivery.</h1>
        <p className="mc-product-hero-lede"><strong>Mission Control is the reference implementation of the Factory Development Lifecycle.</strong> It turns intent, execution, evidence, approval, and outcomes into durable operating records.</p>
        <p className="mc-product-hero-proof"><strong>Not another coding agent.</strong> The system that decides what agents may do—and what evidence must return before work advances.</p>
        <div className="hero-actions"><a className="button button-dark" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">View source on GitHub ↗</a><a className="button button-light" href="#quickstart">Run the demo</a></div>
      </div>
      <figure className="mc-hero-window">
        <div className="mc-product-chrome"><span>Mission Control / Command Center</span><span>Demo view</span></div>
        <Image alt="Mission Control command center showing ranked work requiring operator attention" height={1050} priority sizes="(max-width: 980px) 100vw, 720px" src="/mission-control/command-center.png" width={1600} />
        <figcaption><strong>Operator-first by design.</strong><span>Decisions, blockers, risk, owners, and proof sources—not a stream of agent activity.</span></figcaption>
      </figure>
      <dl className="mc-product-facts"><div><dt>License</dt><dd>Open source</dd></div><div><dt>Demo</dt><dd>Deterministic</dd></div><div><dt>Truth model</dt><dd>Capability-specific</dd></div></dl>
    </section>

    <section className="mc-purpose-strip" aria-label="Mission Control purpose">
      <article><span>01 / Govern</span><strong>Bound authority before execution.</strong></article>
      <article><span>02 / Verify</span><strong>Require evidence for every transition.</strong></article>
      <article><span>03 / Decide</span><strong>Put human attention at consequential boundaries.</strong></article>
    </section>

    <nav aria-label="Mission Control page sections" className="mc-section-nav"><a href="#how-it-works">How it works</a><a href="#operator-experience">Operator views</a><a href="#architecture">Architecture</a><a href="#capabilities">Capabilities</a><a href="#quickstart">Run locally</a></nav>

    <section className="section-block mc-how-section" id="how-it-works">
      <SectionHeader eyebrow="Interactive governed path" title="Follow one mission through the control plane." description="Select a stage to see the governing question, the authority allowed to answer it, and the proof required before state can advance." />
      <MissionControlFlow />
      <div className="mc-object-heading"><div><p className="section-label">Durable record model</p><h3>Every claim has an owner, lineage, and boundary.</h3></div><p>Mission Control expands the FDLC Artifact Protocol with implementation records needed to dispatch, recover, verify, and audit real work.</p></div>
      <ol className="mc-object-ledger">{missionControlObjects.map(([name, summary], index) => <li key={name}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{name}</strong><p>{summary}</p></div></li>)}</ol>
    </section>

    <section className="mc-boundary-section">
      <StateBoundary dark mode="mission-control" />
    </section>

    <section className="screenshots-section mc-operator-section" id="operator-experience">
      <SectionHeader eyebrow="Operator experience" title="Operate from exceptions, evidence, and decisions." description="Explore three real views from the deterministic Software Factory demo. Each surface is designed around the next responsible action—not activity for activity’s sake." />
      <MissionControlProductTour />
      <p className="mc-demo-disclaimer">These screens demonstrate product structure and the documented one-repository V1 path. They are not a claim of fleet-scale autonomous production.</p>
    </section>

    <section className="section-block mc-architecture" id="architecture">
      <SectionHeader eyebrow="Implementation architecture" title="Intelligence can vary. Authority remains explicit." description="The browser, agents, harnesses, and providers do not create their own permission to act or advance state. The control plane remains the source of identity, policy, state, and decisions." />
      <div className="mc-layers">
        <article><span>01 / Operator surfaces</span><div><strong>React + TypeScript</strong><small>Exceptions, decisions, Plans, WorkOrders, traces, and evidence</small></div><b>Human attention</b></article>
        <article className="is-control"><span>02 / Authoritative control plane</span><div><strong>Convex</strong><small>State, policy, identity, admission, decisions, and immutable lineage</small></div><b>Source of authority</b></article>
        <article><span>03 / Orchestration</span><div><strong>Hono + worker runtime</strong><small>Signed service commands, harness admission, leases, checkpoints, and recovery</small></div><b>Bounded coordination</b></article>
        <article><span>04 / Execution</span><div><strong>Codex + bounded backends</strong><small>Frozen manifest, isolated worktree or Preview Remote Sandbox, exact candidate</small></div><b>Replaceable intelligence</b></article>
        <article><span>05 / Verification + publication</span><div><strong>Independent Attempt + GitHub App</strong><small>Evidence receipts, currentness, Quality Gate, and permit-gated publication</small></div><b>Proof before promotion</b></article>
      </div>
      <p className="mc-architecture-rule"><span>Operating rule</span> Allow intelligence to change. Never allow authority to become implicit.</p>
    </section>

    <section className="section-block capability-section" id="capabilities">
      <SectionHeader eyebrow="Current capability" title="Inspect what is real—and where it stops." description="Status belongs to each capability, not the product slogan. Open any item to see the implemented behavior and its current boundary." />
      <div className="mc-capability-groups">{["Available", "Experimental", "Planned"].map((status) => {
        const capabilities = missionControlCapabilities.filter((capability) => capability.status === status);
        return <section className={`mc-capability-group is-${status.toLowerCase()}`} key={status}><header><StatusBadge status={status} /><span>{String(capabilities.length).padStart(2, "0")} capabilities</span></header><div>{capabilities.map((capability, index) => <details key={capability.name} open={status === "Available" && index === 0}><summary><strong>{capability.name}</strong><span aria-hidden="true">+</span></summary><div><p><b>Supported</b>{capability.summary}</p><p><b>Current boundary</b>{capability.limitation}</p></div></details>)}</div></section>;
      })}</div>
      <a className="section-link" href="https://github.com/jaydubya818/MissionControl/blob/main/docs/product/software-factory-capability-maturity.md" rel="noreferrer" target="_blank">Read the canonical capability maturity ledger ↗</a>
    </section>

    <section className="quickstart-section" id="quickstart">
      <div><p className="section-label">Local quickstart</p><h2>Run the deterministic factory demo.</h2><p>Requires Node 20, pnpm 9, Git, and a Convex development deployment. Live providers are not required for the demo.</p></div>
      <div className="quickstart-code" aria-label="Mission Control local quickstart commands" role="region">
        <div className="quickstart-code-toolbar"><a href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Mission Control repository ↗</a><CopyButton label="Copy commands" text={quickstartCommands} /></div>
        <pre><code>{quickstartCommands}</code></pre>
      </div>
      <p className="quickstart-note">Then open <code>http://localhost:5199/v2/command-center</code> and select <strong>Software Factory Demo</strong>. The seeded path runs without live model providers.</p>
    </section>

    <section className="reading-next" id="build-next"><p className="section-label">Build with the model</p><h2>Inspect it, then define your own factory line.</h2><div><a href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Contribute on GitHub ↗</a><Link href="/start">Build a Factory Definition →</Link><Link href="/spec">Preview the Specification →</Link></div></section>
  </div></SiteShell>;
}
