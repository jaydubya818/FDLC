import type { Metadata } from "next";
import Link from "next/link";
import { PageContentsNav } from "../components/page-contents-nav";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { guideValueStream } from "../../data/fdlc";
import { guideEntryPaths, guideParts, guideRoot, proposedGuideMap } from "../../data/guide";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("The FDLC Guide (The AI Software Factory Guide)", "The field guide to designing, building, proving, operating, and improving an engineering system in which evidence—not an agent saying done—decides what advances.", "/guide");

const contents = [
  { label: "Reading paths", href: "#reading-paths" },
  { label: "Model alignment", href: "#model-alignment" },
  { label: "Six parts", href: "#parts" },
  { label: "Eight stages", href: "#stages" },
  { label: "Topic map", href: "#topic-map" },
  { label: "Implementation", href: "#implementation" },
  { label: "Next steps", href: "#next-steps" },
] as const;

export default function GuidePage() {
  const chapterCount = guideParts.reduce((count, part) => count + part.chapters.length, 0);
  return <SiteShell><div className="page-wrap guide-page">
    <PageHero eyebrow="The FDLC Guide · The AI Software Factory Guide" variant="compact" title="Build the system around the agent." description="The FDLC-native portal into the full field guide for designing, building, proving, operating, and improving an AI software factory.">
      <div className="guide-stats is-hero-meta"><span><strong>{chapterCount}</strong> chapters</span><span><strong>6</strong> parts</span><span><strong>8</strong> Guide stages</span></div>
      <div className="hero-actions">
        <a className="button button-dark" href={`${guideRoot}/01-understand/01-why-software-engineering-is-changing`}>Start the full Guide →</a>
        <Link className="button button-light" href="/in-5-minutes">Understand FDLC in 5 minutes</Link>
        <Link className="text-action" href="/framework">Framework →</Link>
      </div>
    </PageHero>

    <aside className="guide-portal-note" aria-label="Guide hosting note">
      <strong>One framework. One full book.</strong>
      <div className="guide-identity"><p><strong>FDLC</strong> is the operating model and category definition.</p><p><strong>The FDLC Guide</strong> (published as The AI Software Factory Guide) is the detailed methodology that teaches how to implement it.</p></div>
      <p>The complete 44-chapter Guide is part of FDLC.ai and owns every route under <code>/guide</code>. This shadow page remains only as a reversible cutover surface.</p>
      <div className="guide-portal-actions"><a href={guideRoot}>Complete contents →</a><a href={`${guideRoot}/search`}>Search the Guide →</a></div>
    </aside>
    <PageContentsNav items={contents} title="Guide portal" />

    <section className="guide-paths" id="reading-paths"><p className="section-label">Choose a reading path</p><h2>Start with the outcome you need.</h2><div>
      {guideEntryPaths.map((path) => <article key={path.label}><span>{path.label}</span><strong>{path.need}</strong><nav aria-label={`${path.label} reading links`}>{path.links.map(([label, href]) => href.startsWith("/guide") ? <a href={href} key={href}>{label} →</a> : <Link href={href} key={href}>{label} →</Link>)}</nav></article>)}
    </div></section>

    <section className="section-block guide-model-bridge" id="model-alignment">
      <SectionHeader eyebrow="One system / different lenses" title="How FDLC and the Guide relate." description="FDLC defines the operating system. The Guide teaches you how to build and run it. The models align without collapsing into one another." />
      <div className="model-bridge-grid">
        <article><span>FDLC / Factory lifecycle</span><h3>How a factory line evolves.</h3><p>The Guide shows how to discover, design, assemble, validate, deploy, operate, and improve a factory line.</p><Link href="/framework#lifecycle">View the canonical lifecycle →</Link></article>
        <article><span>FDLC / Value stream + protocol</span><h3>How work flows, advances, and persists.</h3><p>The Guide teaches the eight-stage software factory value stream; the specification defines the eleven-artifact governed execution protocol.</p><a href={`${guideRoot}/stages/01-builder-intent`}>Open the Guide stages →</a></article>
        <article><span>FDLC / Architecture</span><h3>What the factory must contain.</h3><p>The Guide goes deep on intent, harnesses, capabilities, models, trust and verification, and learning.</p><Link href="/architecture">Explore the six areas →</Link></article>
        <article><span>FDLC / Principles</span><h3>What must remain true.</h3><p>The Guide develops the first principles of trust, evidence, authority, and human–agent operating models.</p><Link href="/manifesto">Read the Manifesto →</Link></article>
      </div>
      <p className="model-bridge-note"><strong>These are the same system described at different levels of abstraction.</strong> The Guide’s eight stages are not a competing FDLC lifecycle.</p>
    </section>

    <section className="section-block" id="parts">
      <SectionHeader eyebrow="Six parts / One arc" title="Six parts. Forty-four chapters. One path to verified delivery." description="Use the six-part arc for a complete read, or enter through the role and topic indexes below. Every part opens directly in the authoritative Guide." />
      <ol className="guide-part-list">{guideParts.map((part) => <li key={part.id}><a href={part.startHref}><span>{part.number}</span><div><p>{part.verb}</p><h2>{part.title}</h2><strong>{part.question}</strong></div><small>{part.range}<br />Open in full Guide ↗</small></a></li>)}</ol>
    </section>

    <section className="section-block guide-stage-section" id="stages">
      <SectionHeader eyebrow="Level 02 / Software factory value stream" title="Follow software work from intent to delivery." description="These technical deep-dives explain how software flows through the factory. The value stream is distinct from the seven-stage Factory Development Lifecycle and the eleven-artifact governed execution protocol." />
      <p className="guide-stage-summary">Intent → Plan → Define Agent → Execute through Harness → Apply Skills → Evaluate → Improve → Deliver Software</p>
      <ol className="guide-stage-line" aria-label="The Guide's eight-stage value stream">{guideValueStream.map((stage) => <li key={stage.id}><a href={stage.href}><span>{String(stage.number).padStart(2, "0")}</span><strong>{stage.name}</strong></a></li>)}</ol>
    </section>

    <section className="guide-map-section" id="topic-map"><SectionHeader eyebrow="FDLC topic map" title="Twenty-five entry points into the same source." description="Use these routes when you already know the concept you need. First-time readers should start with the structured parts and stages above." /><ol>{proposedGuideMap.map(([title, href, status], index) => <li key={title}>{href.startsWith("/guide") ? <a href={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{status} →</small></a> : <Link href={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{status} →</small></Link>}</li>)}</ol><p className="guide-map-note">Full chapter links are maintained in the <a href={guideRoot}>canonical Guide →</a></p></section>

    <section className="reference-callout" id="implementation"><div><p className="section-label">Mission Control and the Guide</p><h2>A living implementation, with its boundaries visible.</h2></div><div><p>Mission Control is the open-source reference implementation of FDLC. Guide chapters and appendices use it as a living case study for capability maturity, verification-first flows, and operator surfaces—while separating enduring architecture from point-in-time implementation evidence.</p><div className="hero-actions"><Link className="button button-light" href="/mission-control">Review current limitations</Link><a className="text-action light-link" href={`${guideRoot}/06-improve/42-mission-control-as-a-living-case-study`}>Read the case study →</a></div></div></section>

    <section className="source-note"><div><p className="section-label">Source provenance</p><h2>Open, attributable, and visibly evolving.</h2></div><div><p>The Guide is maintained in Git, while its documentation application provides search, the complete table of contents, stage pages, role paths, appendices, and a public changelog under the FDLC.ai origin.</p><div className="hero-actions"><a className="button button-light" href="https://github.com/jaydubya818/ai-software-factory-mastery" rel="noreferrer" target="_blank">View source on GitHub ↗</a><a className="text-action light-link" href={`${guideRoot}/appendix/changelog`}>Read the changelog →</a></div></div></section>

    <section className="framework-start guide-next" id="next-steps">
      <p className="section-label">Next steps on FDLC.ai</p><h2>Continue with the depth you need.</h2>
      <div className="framework-start-grid"><Link href="/in-5-minutes"><span>01</span><strong>FDLC in 5 Minutes</strong><small>One factory line end to end →</small></Link><Link href="/framework"><span>02</span><strong>Framework</strong><small>Canonical definition and system views →</small></Link><Link href="/architecture"><span>03</span><strong>Architecture</strong><small>Six areas in depth →</small></Link><Link href="/manifesto"><span>04</span><strong>Manifesto</strong><small>Ten operating principles →</small></Link><Link href="/maturity"><span>05</span><strong>Maturity</strong><small>Assess your current state →</small></Link><Link href="/mission-control"><span>06</span><strong>Mission Control</strong><small>Reference implementation →</small></Link></div>
      <blockquote>Verified delivery, not merely generated code.</blockquote>
    </section>
  </div></SiteShell>;
}
