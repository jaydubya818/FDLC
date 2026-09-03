import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { StatusBadge } from "../components/status-badge";
import { missionControlCapabilities, missionControlObjects, missionControlTimeline } from "../../data/mission-control";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("Mission Control", "The open-source reference implementation of the Factory Development Lifecycle.", "/mission-control");

export default function MissionControlPage() {
  return <SiteShell><div className="page-wrap mission-page">
    <PageHero eyebrow="Open-source reference implementation / 05" title="Mission Control" description="The open-source reference implementation of the Factory Development Lifecycle: a governed control plane for planning, executing, verifying, approving, and learning from autonomous software work.">
      <div className="hero-actions"><a className="button button-dark" href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">View on GitHub ↗</a><a className="button button-light" href="#quickstart">Local quickstart</a></div>
    </PageHero>

    <section className="mc-boundary"><strong>What it is</strong><p>A concrete control plane that demonstrates FDLC objects, gates, authority, evidence, and recovery.</p><strong>What it is not</strong><p>The definition of FDLC, every component of a complete factory, or a claim of fleet-scale autonomous production.</p></section>

    <section className="section-block">
      <SectionHeader eyebrow="Golden path" title="From governed intent to an evidence-backed decision." description="Mission Control expands the concise FDLC protocol with the concrete records needed to operate and audit one software delivery path." />
      <ol className="mc-timeline">{missionControlTimeline.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></li>)}</ol>
      <div className="golden-path-steps">
        <p>Engineering work enters as a Mission with explicit scope and acceptance expectations.</p>
        <p>A versioned Plan is reviewed before it releases bounded WorkOrders.</p>
        <p>Tasks and Attempts execute against frozen configuration under worker admission and leases.</p>
        <p>An exact candidate is verified by a logically separate verifier and current evidence.</p>
        <p>A human accepts or requests revision at the consequential boundary; release remains separate.</p>
        <p>Accepted evidence may become an advisory learning signal and a governed future proposal.</p>
      </div>
    </section>

    <section className="mc-dark-section">
      <SectionHeader eyebrow="Core objects" title="One hierarchy. No optimistic shortcuts." description="Each record has a distinct owner and authority. Completion, verification, acceptance, merge, release, and production outcome are not aliases." />
      <div className="object-grid">{missionControlObjects.map(([name, summary], index) => <article key={name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{name}</h3><p>{summary}</p></article>)}</div>
      <p className="inequality">execution complete <b>≠</b> verification passed <b>≠</b> accepted <b>≠</b> released <b>≠</b> outcome proven</p>
    </section>

    <section className="section-block mc-architecture">
      <SectionHeader eyebrow="Architecture" title="Authority stays in the control plane." description="The browser, agents, harnesses, and providers do not create their own permission to act or advance state." />
      <div className="mc-layers">
        <article><span>Operator surfaces</span><strong>React + TypeScript</strong><small>Exceptions, decisions, Plans, WorkOrders, traces, and evidence</small></article>
        <article><span>Authoritative control plane</span><strong>Convex</strong><small>State, policy, identity, admission, decisions, and immutable lineage</small></article>
        <article><span>Orchestration</span><strong>Hono + worker runtime</strong><small>Signed service commands, harness admission, leases, and recovery</small></article>
        <article><span>Execution</span><strong>Codex / bounded backends</strong><small>Frozen manifest, isolated worktree or Preview Remote Sandbox, exact candidate</small></article>
        <article><span>Verification + publication</span><strong>Independent Attempt + GitHub App</strong><small>Evidence receipts, currentness, Quality Gate, permit-gated publication</small></article>
      </div>
    </section>

    <section className="screenshots-section">
      <SectionHeader eyebrow="Operator experience" title="Exceptions and evidence before activity." description="These views are from Mission Control’s deterministic Software Factory demo. They show product structure, not fleet-scale production usage." />
      <figure className="product-frame is-large"><div><span>COMMAND CENTER</span><span>DEMO VIEW</span></div><Image src="/mission-control/command-center.png" alt="Mission Control command center with delivery metrics and ranked work requiring attention" width={1600} height={1050} sizes="(max-width: 1240px) 100vw, 1120px" /><figcaption>Command Center: ranked decisions, blockers, risk, and proof sources.</figcaption></figure>
      <div className="screenshot-grid">
        <figure className="product-frame"><div><span>WORK ORDERS</span><span>DEMO VIEW</span></div><Image src="/mission-control/work-orders.png" alt="Mission Control Work Orders view" width={1600} height={1050} sizes="(max-width: 820px) 100vw, 50vw" /><figcaption>Governed WorkOrders and delivery state.</figcaption></figure>
        <figure className="product-frame"><div><span>AUDIT</span><span>DEMO VIEW</span></div><Image src="/mission-control/audit.png" alt="Mission Control audit and approval history view" width={1600} height={1050} sizes="(max-width: 820px) 100vw, 50vw" /><figcaption>Approval and audit lineage.</figcaption></figure>
      </div>
    </section>

    <section className="section-block capability-section">
      <SectionHeader eyebrow="Current capability" title="Status belongs to the capability—not the slogan." description="Available means the bounded behavior exists in the current source and is backed by the repository’s stated evidence. It does not imply general production certification." />
      <div className="capability-table" role="table" aria-label="Mission Control capability status">
        <div className="capability-row capability-head" role="row"><span role="columnheader">Capability</span><span role="columnheader">Status</span><span role="columnheader">What is supported</span><span role="columnheader">Current boundary</span></div>
        {missionControlCapabilities.map((capability) => <div className="capability-row" role="row" key={capability.name}><strong role="cell">{capability.name}</strong><span role="cell"><StatusBadge status={capability.status} /></span><p role="cell">{capability.summary}</p><p role="cell">{capability.limitation}</p></div>)}
      </div>
      <a className="section-link" href="https://github.com/jaydubya818/MissionControl/blob/main/docs/product/software-factory-capability-maturity.md" rel="noreferrer" target="_blank">Read the canonical capability maturity ledger ↗</a>
    </section>

    <section className="quickstart-section" id="quickstart">
      <div><p className="section-label">Local quickstart</p><h2>Run the deterministic factory demo.</h2><p>Requires Node 20, pnpm 9, Git, and a Convex development deployment. Live providers are not required for the demo.</p></div>
      <pre><code>{`git clone https://github.com/jaydubya818/MissionControl.git
cd MissionControl
corepack enable && pnpm install
cp .env.example .env.local
pnpm exec convex dev --once

# Terminal 1
pnpm run dev:demo

# Terminal 2
pnpm run convex:seed:demo:force`}</code></pre>
      <p className="quickstart-note">Then open <code>http://localhost:5199/v2/command-center</code> and select <strong>Software Factory Demo</strong>.</p>
    </section>

    <section className="reading-next"><p className="section-label">Build with the model</p><h2>Inspect it, then define your own factory line.</h2><div><a href="https://github.com/jaydubya818/MissionControl" rel="noreferrer" target="_blank">Contribute on GitHub ↗</a><Link href="/start">Build a Factory Definition →</Link><Link href="/spec">Preview the Specification →</Link></div></section>
  </div></SiteShell>;
}
