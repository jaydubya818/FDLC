import Link from "next/link";

import { SiteShell } from "../components/site-shell";

export default function CorpusPreviewNotFound() {
  return <SiteShell><div className="corpus-state"><p className="section-label">Corpus preview / 404</p><h1>That draft document is not in the manifest.</h1><p>It may have been renamed, excluded from publication, or left as planned work.</p><Link className="button button-dark" href="/corpus-preview">Return to the corpus catalog</Link></div></SiteShell>;
}
