import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CorpusCatalog } from "../components/corpus/corpus-catalog";
import { CorpusStatus } from "../components/corpus/corpus-status";
import { PageHero } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { corpusCatalogDocuments, corpusCollection, corpusCollisions, corpusDocuments, corpusRawArtifacts, corpusSourceDigest } from "../../lib/corpus";
import { corpusJourneys } from "../../lib/corpus-journeys";

export const metadata: Metadata = {
  title: "FDLC Learning Library Preview",
  description: "Explore guided paths and the complete draft FDLC reference library before it is promoted into the canonical site.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noarchive: true } },
};

const topicDefinitions = [
  ["Foundations", "The lifecycle, delivery loop, maturity model, and operating principles.", "framework"],
  ["Architecture", "Control boundaries, authority, evidence, security, routing, and operations.", "architecture"],
  ["Build guides", "Complete factory patterns for common engineering outcomes.", "guides"],
  ["Tutorials", "Step-by-step implementation tasks for factory engineers.", "tutorials"],
  ["Patterns", "Reusable solutions for governing and operating software factories.", "patterns"],
  ["Specification", "Normative objects, schemas, examples, and conformance guidance.", "specification"],
] as const;

export default function CorpusPreviewPage() {
  const catalog = corpusCatalogDocuments();
  const wordCount = corpusDocuments.reduce((sum, document) => sum + document.wordCount, 0);
  const topics = topicDefinitions.map(([title, description, collection]) => ({
    title,
    description,
    collection,
    count: corpusDocuments.filter((document) => corpusCollection(document) === collection).length,
  }));

  return <SiteShell><div className="page-wrap corpus-preview-page">
    <PageHero eyebrow="FDLC learning library / Review candidate" variant="compact" title="Find the guidance you need to build a trustworthy software factory." description="Choose a practical path, explore a topic, or search the complete FDLC draft reference. The library connects the operating model to concrete architecture, implementation, and adoption work.">
      <div className="hero-actions"><a className="button button-dark" href="#paths">Choose a learning path →</a><a className="button button-light" href="#catalog">Search all {corpusDocuments.length} documents</a></div>
    </PageHero>
    <CorpusStatus />

    <section className="corpus-journeys" id="paths" aria-labelledby="corpus-paths-heading">
      <header className="corpus-section-heading"><div><p className="section-label">Start with your outcome</p><h2 id="corpus-paths-heading">Choose a path through FDLC.</h2></div><p>You do not need to read the corpus front to back. Each path connects a question to a short, deliberate sequence.</p></header>
      <div className="corpus-journey-grid">{corpusJourneys.map((journey) => <article className="corpus-journey" key={journey.id}>
        <header><span>{journey.audience}</span><small>About {journey.readingMinutes} min</small></header>
        <h3>{journey.title}</h3><p>{journey.description}</p>
        <div className="corpus-journey-outcome"><span>You will leave with</span><strong>{journey.outcome}</strong></div>
        <ol>{journey.documents.map((document, index) => <li key={document.path}><Link href={document.previewHref}><span>{String(index + 1).padStart(2, "0")}</span><span><strong>{document.title}</strong><small>{document.wordCount.toLocaleString()} words</small></span><span aria-hidden="true" className="corpus-journey-arrow" /></Link></li>)}</ol>
      </article>)}</div>
    </section>

    <section className="corpus-community-value"><header><p className="section-label">What the library gives the community</p><h2>From shared language to repeatable practice.</h2></header><div><article><span>01</span><h3>Learn the model</h3><p>Build a common vocabulary for intent, authority, evidence, qualification, and outcomes.</p></article><article><span>02</span><h3>Apply it to real work</h3><p>Use guides, tutorials, patterns, and examples to design one bounded factory line.</p></article><article><span>03</span><h3>Adopt it responsibly</h3><p>Connect architecture and operations to maturity, governance, and organizational ownership.</p></article></div></section>

    <section className="corpus-topics" aria-labelledby="corpus-topics-heading"><header className="corpus-section-heading"><div><p className="section-label">Explore by topic</p><h2 id="corpus-topics-heading">Use the library as a reference.</h2></div><p>Go directly to the part of FDLC that matches the decision or implementation work in front of you.</p></header><div>{topics.map((topic) => <Link href={`/corpus-preview?collection=${topic.collection}#catalog`} key={topic.collection}><span>{topic.count} documents</span><h3>{topic.title}</h3><p>{topic.description}</p><strong>Browse {topic.title.toLowerCase()} →</strong></Link>)}</div></section>

    <div id="catalog"><Suspense fallback={<div className="corpus-loading" role="status">Loading the corpus catalog…</div>}><CorpusCatalog documents={catalog} /></Suspense></div>

    <section className="corpus-review" id="review-evidence" aria-labelledby="corpus-review-heading">
      <header className="corpus-section-heading"><div><p className="section-label">For reviewers and maintainers</p><h2 id="corpus-review-heading">Inspect the evidence behind the preview.</h2></div><p>These checks establish integrity and publication boundaries. They do not qualify the draft or replace Product Owner review.</p></header>
      <details className="corpus-review-details"><summary>Open verification evidence and publication limits</summary><div>
        <section className="corpus-proof" aria-label="Corpus preview facts"><article><span>Documents</span><strong>{corpusDocuments.length}</strong><p>Manifest-backed routes</p></article><article><span>Words</span><strong>{wordCount.toLocaleString()}</strong><p>Manifest-derived</p></article><article><span>Collisions</span><strong>{corpusCollisions.length}</strong><p>Reported, never shadowed</p></article><article><span>Source digest</span><strong>{corpusSourceDigest.slice(0, 10)}</strong><p>Detects stale output</p></article></section>
        <section className="corpus-review-boundary"><div><p className="section-label">What automation proves</p><h3>The content pipeline can be reproduced and tested.</h3></div><div><p>It does not settle open semantic decisions, verify external Mission Control files, adjudicate proposed taxonomy, or authorize replacement of existing pages.</p><ul><li>{Object.keys(corpusRawArtifacts).length} allowlisted review and machine-readable artifacts</li><li>Canonical collisions remain a future preserve, merge, or supersede decision</li><li>Preview routes remain outside navigation, sitemaps, and search indexing</li></ul></div></section>
        <nav className="corpus-evidence" aria-label="Corpus review evidence"><a href="/corpus-artifacts/audit/06-corpus-verification.md">Claude corpus verification</a><a href="/corpus-artifacts/audit/07-strategic-roadmap.md">Strategic roadmap</a><a href="/corpus-artifacts/canon/00-FDLC-CANON.md">FDLC canon source</a><a href="/corpus-artifacts/site-implementation/RUNBOOK.md">Original implementation runbook</a><Link href="/framework">Compare the current Framework</Link><Link href="/start#factory-builder">Confirm the current Start tool</Link></nav>
      </div></details>
    </section>
  </div></SiteShell>;
}
