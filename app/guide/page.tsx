import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionHeader } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { guideParts, proposedGuideMap } from "../../data/guide";
import { pageMetadata } from "../../lib/metadata";

export const metadata: Metadata = pageMetadata("AI Software Factory Guide", "A field guide to designing, building, proving, operating, and improving governed AI software factories.", "/guide");

export default function GuidePage() {
  const chapterCount = guideParts.reduce((count, part) => count + part.chapters.length, 0);
  return <SiteShell><div className="page-wrap guide-page">
    <PageHero eyebrow="The AI Software Factory Guide / 04" title="Build the system around the agent." description="A field guide to designing, building, proving, operating, and improving an engineering system in which evidence—not an agent saying done—decides what advances.">
      <div className="guide-stats"><span><strong>{chapterCount}</strong> chapters</span><span><strong>6</strong> parts</span><span><strong>7</strong> factory stages</span></div>
    </PageHero>
    <section className="guide-paths"><p className="section-label">Choose a reading path</p><div>
      <Link href="/guide/understand"><span>10 minutes</span><strong>Understand the model</strong><p>Start with the category, boundaries, and first principles.</p></Link>
      <Link href="/architecture"><span>Reference</span><strong>Trace the architecture</strong><p>Inspect all six areas and their operating contracts.</p></Link>
      <Link href="/guide/build"><span>Implementation</span><strong>Build the system</strong><p>Move into capabilities, harnesses, models, context, and runtime.</p></Link>
    </div></section>
    <section className="section-block">
      <SectionHeader eyebrow="The book" title="Six parts. One path from intent to evidence." description="The current authoritative Guide remains a 36-chapter book. FDLC adds a category-level index without throwing away the source’s mature reading arc." />
      <ol className="guide-part-list">{guideParts.map((part) => <li key={part.id}><Link href={`/guide/${part.id}`}><span>{part.number}</span><div><p>{part.verb}</p><h2>{part.title}</h2><strong>{part.question}</strong></div><small>{part.chapters.length} chapters<br />Read part →</small></Link></li>)}</ol>
    </section>
    <section className="guide-map-section"><SectionHeader eyebrow="FDLC topic map" title="Twenty-five ways into the same source." description="This is the editorial migration map requested for FDLC.ai—not a claim that 25 replacement chapters are already complete." /><ol>{proposedGuideMap.map((title, index) => <li key={title}><span>{String(index + 1).padStart(2, "0")}</span>{title}</li>)}</ol></section>
    <section className="source-note"><div><p className="section-label">Source provenance</p><h2>Open, attributable, and still evolving.</h2></div><div><p>The Guide is maintained in Git. Current chapters distinguish enduring architecture from point-in-time Mission Control evidence and keep historical material for provenance.</p><a className="button button-light" href="https://github.com/jaydubya818/ai-software-factory-mastery" rel="noreferrer" target="_blank">View source on GitHub ↗</a></div></section>
  </div></SiteShell>;
}
