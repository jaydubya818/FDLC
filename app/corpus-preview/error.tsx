"use client";

import Link from "next/link";

import { SiteShell } from "../components/site-shell";

export default function CorpusPreviewError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <SiteShell><div className="corpus-state" role="alert"><p className="section-label">Corpus preview error</p><h1>This document could not be rendered.</h1><p>The existing FDLC site is unaffected. Retry this preview page or return to its catalog.</p><div className="hero-actions"><button className="button button-dark" onClick={reset} type="button">Try again</button><Link className="button button-light" href="/corpus-preview">Corpus catalog</Link></div></div></SiteShell>;
}
