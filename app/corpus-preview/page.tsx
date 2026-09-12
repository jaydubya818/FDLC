import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { CorpusCatalog } from "../components/corpus/corpus-catalog";
import { CorpusStatus } from "../components/corpus/corpus-status";
import { PageHero } from "../components/page-hero";
import { SiteShell } from "../components/site-shell";
import { corpusCatalogDocuments, corpusCollisions, corpusDocuments, corpusRawArtifacts, corpusSourceDigest } from "../../lib/corpus";

export const metadata: Metadata = {
  title: "FDLC Corpus Preview",
  description: "A non-canonical local review surface for the imported FDLC corpus.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noarchive: true } },
};

export default function CorpusPreviewPage() {
  const catalog = corpusCatalogDocuments();
  const wordCount = corpusDocuments.reduce((sum, document) => sum + document.wordCount, 0);
  return <SiteShell><div className="page-wrap corpus-preview-page">
    <PageHero eyebrow="Corpus integration / Local review" variant="compact" title="Review the corpus before it becomes the site." description="A generated, verified reading surface for Claude's FDLC corpus. Existing canonical pages remain unchanged while routing, semantics, and editorial quality are reviewed.">
      <div className="hero-actions"><a className="button button-dark" href="#catalog">Browse {corpusDocuments.length} documents →</a><a className="button button-light" href="/corpus-artifacts/audit/06-corpus-verification.md">Original verification report</a></div>
    </PageHero>
    <CorpusStatus />
    <section className="corpus-proof" aria-label="Corpus preview facts"><article><span>Documents</span><strong>{corpusDocuments.length}</strong><p>Routed from front matter</p></article><article><span>Words</span><strong>{wordCount.toLocaleString()}</strong><p>Manifest-derived</p></article><article><span>Collisions</span><strong>{corpusCollisions.length}</strong><p>Reported, never shadowed</p></article><article><span>Source digest</span><strong>{corpusSourceDigest.slice(0, 10)}</strong><p>Detects stale output</p></article></section>
    <section className="corpus-review-boundary"><div><p className="section-label">What this preview proves</p><h2>The corpus can be read and tested in the product.</h2></div><div><p>It does not qualify the draft, settle open semantic decisions, verify Mission Control files that are outside this repository, or authorize replacement of existing pages.</p><ul><li>{Object.keys(corpusRawArtifacts).length} allowlisted review and machine-readable artifacts</li><li>Canonical collisions remain a future preserve/merge/supersede decision</li><li>Preview routes are excluded from navigation and search discovery</li></ul></div></section>
    <section className="corpus-evidence"><p className="section-label">Review evidence</p><div><a href="/corpus-artifacts/audit/06-corpus-verification.md">Claude corpus verification</a><a href="/corpus-artifacts/audit/07-strategic-roadmap.md">Strategic roadmap</a><a href="/corpus-artifacts/canon/00-FDLC-CANON.md">FDLC canon source</a><a href="/corpus-artifacts/site-implementation/RUNBOOK.md">Original implementation runbook</a><Link href="/framework">Compare the current Framework</Link><Link href="/start#factory-builder">Confirm the current Start tool</Link></div></section>
    <div id="catalog"><Suspense fallback={<div className="corpus-loading" role="status">Loading the corpus catalog…</div>}><CorpusCatalog documents={catalog} /></Suspense></div>
  </div></SiteShell>;
}
