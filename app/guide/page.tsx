import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { fullGuideUrl, guideParts, guideRolePaths, guideStages, proposedGuideMap } from "../../data/guide";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("AI Software Factory Guide", "The FDLC index and reading paths into the full 44-chapter AI Software Factory Guide.", "/guide");

export default function GuidePage() {
  const chapterCount = guideParts.reduce((count, part) => count + part.chapters.length, 0);
  return <SiteShell><div className="page-wrap guide-page">
    <PageHero eyebrow="Guide portal / 04" title="The index into the full Guide." description="The AI Software Factory Guide is the detailed methodology for designing, building, proving, operating, and improving governed software factories. FDLC.ai provides the category map and clear reading paths into it.">
      <div className="hero-actions">
        <a className="button button-dark" href={fullGuideUrl}>Open the full Guide ↗</a>
        <a className="button button-light" href={`${fullGuideUrl}/search`}>Search the Guide ↗</a>
      </div>
      <div className="guide-stats"><span><strong>{chapterCount}</strong> chapters</span><span><strong>6</strong> parts</span><span><strong>8</strong> Guide stages</span></div>
    </PageHero>

    <aside className="guide-portal-note" aria-label="Guide hosting note">
      <strong>One framework. One full book.</strong>
      <p>The complete 44-chapter Guide lives on its dedicated reading site. This page is the FDLC index—not a second, incomplete edition.</p>
      <a href={`${fullGuideUrl}/guide`}>View the complete table of contents ↗</a>
    </aside>

    <section className="guide-paths"><p className="section-label">Choose a reading path</p><div>
      <a href={`${fullGuideUrl}/docs/01-understand/02-the-factory-in-one-view`}><span>10 minutes</span><strong>Understand the model</strong><p>Read “The factory in one view” and leave with the complete mental model.</p><small>Open chapter 2 ↗</small></a>
      <Link href="/architecture"><span>Reference</span><strong>Trace the architecture</strong><p>Inspect the six FDLC areas, their contracts, decisions, and failure modes.</p><small>Explore the six areas →</small></Link>
      <a href={`${fullGuideUrl}/docs/03-build/11-the-agent-factory`}><span>Implementation</span><strong>Build the system</strong><p>Start with reusable capability supply, then follow the Build chapters into runtime.</p><small>Open chapter 11 ↗</small></a>
    </div></section>

    <section className="section-block guide-model-bridge">
      <SectionHeader eyebrow="One system / different lenses" title="The models align without collapsing into one another." description="FDLC defines the factory’s canonical operating model. The Guide explains that same system at implementation depth, using an eight-stage reader-facing value stream and a richer set of authoritative records." />
      <div className="model-bridge-grid">
        <article><span>FDLC / Factory lifecycle</span><h3>How a factory line evolves.</h3><p>Maps to the Guide’s governed operating model for moving from an opportunity to an operated, improving factory line.</p><Link href="/framework#lifecycle">View the canonical lifecycle →</Link></article>
        <article><span>FDLC / Runtime + artifacts</span><h3>How work advances and persists.</h3><p>Maps to the Guide’s eight-stage implementation value stream and its expanded set of authoritative records.</p><a href={`${fullGuideUrl}/guide`}>Open the Guide stages ↗</a></article>
        <article><span>FDLC / Architecture</span><h3>What the factory must contain.</h3><p>Maps to the Guide’s capability, stack, platform, and control-plane views.</p><Link href="/architecture">Explore the six areas →</Link></article>
      </div>
      <p className="model-bridge-note"><strong>These are the same system described at different levels of abstraction.</strong> The Guide’s eight stages are not a competing FDLC lifecycle.</p>
      <ol className="guide-stage-line" aria-label="The Guide's eight-stage value stream">{guideStages.map(([number, name, href]) => <li key={number}><a href={href}><span>{number}</span><strong>{name}</strong></a></li>)}</ol>
    </section>

    <section className="section-block">
      <SectionHeader eyebrow="The full book" title="Six parts. Forty-four chapters. One path to verified delivery." description="Use the six-part arc for a complete read, or enter through the role and topic indexes below. Every part opens directly in the authoritative Guide." />
      <ol className="guide-part-list">{guideParts.map((part) => <li key={part.id}><a href={part.startHref}><span>{part.number}</span><div><p>{part.verb}</p><h2>{part.title}</h2><strong>{part.question}</strong></div><small>{part.range}<br />Open in full Guide ↗</small></a></li>)}</ol>
    </section>

    <section className="guide-role-section">
      <SectionHeader eyebrow="Start by role" title="Begin with the decisions you own." description="Each path opens at the part of the Guide most useful to the work in front of you." />
      <div className="guide-role-grid">{guideRolePaths.map(([role, description, href], index) => <a href={href} key={role}><span>{String(index + 1).padStart(2, "0")}</span><h3>{role}</h3><p>{description}</p><small>Open reading path ↗</small></a>)}</div>
    </section>

    <section className="guide-map-section"><SectionHeader eyebrow="FDLC topic index" title="Twenty-five working routes into the system." description="Every topic now resolves to a specific Guide chapter, Guide stage, FDLC reference page, assessment, or offering." /><ol>{proposedGuideMap.map(([title, href, status], index) => <li key={title}>{href.startsWith("/") ? <Link href={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{status} →</small></Link> : <a href={href}><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong><small>{status} ↗</small></a>}</li>)}</ol></section>

    <section className="source-note"><div><p className="section-label">Source provenance</p><h2>Open, attributable, and visibly evolving.</h2></div><div><p>The Guide is maintained in Git, while its dedicated reading site provides search, the complete table of contents, stage pages, role paths, appendices, and a public changelog.</p><div className="hero-actions"><a className="button button-light" href="https://github.com/jaydubya818/ai-software-factory-mastery" rel="noreferrer" target="_blank">View source on GitHub ↗</a><a className="text-action light-link" href={`${fullGuideUrl}/docs/appendix/changelog`}>Read the changelog ↗</a></div></div></section>
  </div></SiteShell>;
}
