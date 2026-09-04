import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { fullGuideUrl, guideEntryPaths, guideParts, guideStages, proposedGuideMap } from "../../data/guide";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("AI Software Factory Guide", "The field guide to designing, building, proving, operating, and improving an engineering system in which evidence—not an agent saying done—decides what advances.", "/guide");

export default function GuidePage() {
  const chapterCount = guideParts.reduce((count, part) => count + part.chapters.length, 0);
  return <SiteShell><div className="page-wrap guide-page">
    <PageHero eyebrow="The AI Software Factory Guide / 04" title="Build the system around the agent." description="A field guide to designing, building, proving, operating, and improving an engineering system in which evidence—not an agent saying done—decides what advances.">
      <div className="guide-identity"><p><strong>FDLC</strong> is the operating model and category definition.</p><p><strong>The AI Software Factory Guide</strong> is the detailed methodology that teaches how to implement it.</p></div>
      <p className="guide-hero-note">The full Guide—44 chapters, six parts, and eight stage deep-dives—lives at the canonical source. This page is the FDLC-native front door: clear reading paths, model alignment, and direct links into the material that matters.</p>
      <div className="hero-actions">
        <a className="button button-dark" href={fullGuideUrl}>Open the full Guide ↗</a>
        <Link className="button button-light" href="/in-5-minutes">Understand FDLC in 5 minutes</Link>
        <Link className="text-action" href="/framework">Framework →</Link>
      </div>
      <div className="guide-stats"><span><strong>{chapterCount}</strong> chapters</span><span><strong>6</strong> parts</span><span><strong>8</strong> Guide stages</span></div>
    </PageHero>

    <aside className="guide-portal-note" aria-label="Guide hosting note">
      <strong>One framework. One full book.</strong>
      <p>The complete Guide lives on its dedicated reading site. This page is the FDLC index—not a second, incomplete edition.</p>
      <div className="guide-portal-actions"><a href={`${fullGuideUrl}/guide`}>Complete table of contents ↗</a><a href={`${fullGuideUrl}/search`}>Search the Guide ↗</a></div>
    </aside>

    <section className="guide-paths"><p className="section-label">Choose a reading path</p><h2>Start with the outcome you need.</h2><div>
      {guideEntryPaths.map((path) => <article key={path.label}><span>{path.label}</span><strong>{path.need}</strong><nav aria-label={`${path.label} reading links`}>{path.links.map(([label, href]) => href.startsWith("/") ? <Link href={href} key={href}>{label} →</Link> : <a href={href} key={href}>{label} ↗</a>)}</nav></article>)}
    </div></section>

    <section className="section-block guide-model-bridge">
      <SectionHeader eyebrow="One system / different lenses" title="How FDLC and the Guide relate." description="FDLC defines the operating system. The Guide teaches you how to build and run it. The models align without collapsing into one another." />
      <div className="model-bridge-grid">
        <article><span>FDLC / Factory lifecycle</span><h3>How a factory line evolves.</h3><p>The Guide shows how to discover, design, assemble, validate, deploy, operate, and improve a factory line.</p><Link href="/framework#lifecycle">View the canonical lifecycle →</Link></article>
        <article><span>FDLC / Runtime + artifacts</span><h3>How work advances and persists.</h3><p>The Guide supplies authoritative records, stage contracts, and the chain from intent to outcome.</p><a href={`${fullGuideUrl}/guide`}>Open the Guide stages ↗</a></article>
        <article><span>FDLC / Architecture</span><h3>What the factory must contain.</h3><p>The Guide goes deep on intent, harnesses, capabilities, models, trust and verification, and learning.</p><Link href="/architecture">Explore the six areas →</Link></article>
        <article><span>FDLC / Principles</span><h3>What must remain true.</h3><p>The Guide develops the first principles of trust, evidence, authority, and human–agent operating models.</p><Link href="/manifesto">Read the Manifesto →</Link></article>
      </div>
      <p className="model-bridge-note"><strong>These are the same system described at different levels of abstraction.</strong> The Guide’s eight stages are not a competing FDLC lifecycle.</p>
    </section>

    <section className="section-block">
      <SectionHeader eyebrow="Six parts / One arc" title="Six parts. Forty-four chapters. One path to verified delivery." description="Use the six-part arc for a complete read, or enter through the role and topic indexes below. Every part opens directly in the authoritative Guide." />
      <ol className="guide-part-list">{guideParts.map((part) => <li key={part.id}><a href={part.startHref}><span>{part.number}</span><div><p>{part.verb}</p><h2>{part.title}</h2><strong>{part.question}</strong></div><small>{part.range}<br />Open in full Guide ↗</small></a></li>)}</ol>
    </section>

    <section className="section-block guide-stage-section">
      <SectionHeader eyebrow="Eight stages / The runtime one line" title="Follow autonomous delivery from intent to software." description="These technical deep-dives explain the contracts, records, and decision rights across each step. They map across the FDLC Runtime Lifecycle and Artifact Protocol; they are not a second lifecycle or a one-to-one artifact list." />
      <p className="guide-stage-summary">Intent → Plan → Define Agent → Execute through Harness → Apply Skills → Evaluate → Improve → Deliver Software</p>
      <ol className="guide-stage-line" aria-label="The Guide's eight-stage value stream">{guideStages.map(([number, name, href]) => <li key={number}><a href={href}><span>{number}</span><strong>{name}</strong></a></li>)}</ol>
    </section>

    <section className="guide-map-section"><SectionHeader eyebrow="FDLC topic map" title="Twenty-five entry points into the same source." description="Use these routes when you already know the concept you need. First-time readers should start with the structured parts and stages above." /><ol>{proposedGuideMap.map(([title, href, status], index) => <li key={title}>{href.startsWith("/") ? <Link href={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{status} →</small></Link> : <a href={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{status} ↗</small></a>}</li>)}</ol><p className="guide-map-note">Full chapter links are maintained in the <a href={`${fullGuideUrl}/guide`}>canonical Guide ↗</a></p></section>

    <section className="reference-callout"><div><p className="section-label">Mission Control and the Guide</p><h2>A living implementation, with its boundaries visible.</h2></div><div><p>Mission Control is the open-source reference implementation of FDLC. Guide chapters and appendices use it as a living case study for capability maturity, verification-first flows, and operator surfaces—while separating enduring architecture from point-in-time implementation evidence.</p><div className="hero-actions"><Link className="button button-light" href="/mission-control">Review current limitations</Link><a className="text-action light-link" href={`${fullGuideUrl}/docs/06-improve/42-mission-control-as-a-living-case-study`}>Read the case study ↗</a></div></div></section>

    <section className="source-note"><div><p className="section-label">Source provenance</p><h2>Open, attributable, and visibly evolving.</h2></div><div><p>The Guide is maintained in Git, while its dedicated reading site provides search, the complete table of contents, stage pages, role paths, appendices, and a public changelog.</p><div className="hero-actions"><a className="button button-light" href="https://github.com/jaydubya818/ai-software-factory-mastery" rel="noreferrer" target="_blank">View source on GitHub ↗</a><a className="text-action light-link" href={`${fullGuideUrl}/docs/appendix/changelog`}>Read the changelog ↗</a></div></div></section>

    <section className="framework-start guide-next" id="next-steps">
      <p className="section-label">Next steps on FDLC.ai</p><h2>Continue with the depth you need.</h2>
      <div className="framework-start-grid"><Link href="/in-5-minutes"><span>01</span><strong>FDLC in 5 Minutes</strong><small>One factory line end to end →</small></Link><Link href="/framework"><span>02</span><strong>Framework</strong><small>Canonical definition and system views →</small></Link><Link href="/architecture"><span>03</span><strong>Architecture</strong><small>Six areas in depth →</small></Link><Link href="/manifesto"><span>04</span><strong>Manifesto</strong><small>Ten operating principles →</small></Link><Link href="/maturity"><span>05</span><strong>Maturity</strong><small>Assess your current state →</small></Link><Link href="/mission-control"><span>06</span><strong>Mission Control</strong><small>Reference implementation →</small></Link></div>
      <blockquote>Verified delivery, not merely generated code.</blockquote>
    </section>
  </div></SiteShell>;
}
