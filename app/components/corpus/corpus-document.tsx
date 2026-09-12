import Link from "next/link";

import { corpusCollection, corpusCollectionLabel, corpusDocuments } from "../../../lib/corpus";
import type { CorpusDocument as CorpusDocumentType } from "../../../lib/corpus-types";
import { SiteFooter } from "../site-footer";
import { SiteHeader } from "../site-header";
import { CorpusMarkdown } from "./corpus-markdown";
import { CorpusStatus } from "./corpus-status";

export function CorpusDocument({ document, returnState = "" }: { document: CorpusDocumentType; returnState?: string }) {
  const collection = corpusCollection(document);
  const siblings = corpusDocuments.filter((candidate) => corpusCollection(candidate) === collection);
  const siblingIndex = siblings.findIndex((candidate) => candidate.path === document.path);
  const previous = siblingIndex > 0 ? siblings[siblingIndex - 1] : undefined;
  const next = siblingIndex >= 0 ? siblings[siblingIndex + 1] : undefined;
  const preserve = returnState ? `?from=${encodeURIComponent(returnState)}` : "";
  const catalogHref = `/corpus-preview${returnState ? `?${returnState}` : ""}`;
  const toc = document.headings.filter((heading) => heading.depth >= 2 && heading.depth <= 3);
  return <><SiteHeader /><CorpusStatus compact /><main id="main-content" className="docs-layout corpus-document-layout">
    <aside className="docs-sidebar corpus-sidebar" aria-label="Corpus collection navigation">
      <Link className="docs-back" href={catalogHref}>← Corpus catalog</Link>
      <p>{corpusCollectionLabel(collection)}</p>
      <nav aria-label={`${corpusCollectionLabel(collection)} documents`}>{siblings.map((item, index) => <Link aria-current={item.path === document.path ? "page" : undefined} href={`${item.previewHref}${preserve}`} key={item.path}><span>{String(index + 1).padStart(2, "0")}</span>{item.title}</Link>)}</nav>
    </aside>
    <article className="docs-article corpus-article">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/corpus-preview">Corpus preview</Link><span>/</span><Link href={`/corpus-preview?collection=${collection}`}>{corpusCollectionLabel(collection)}</Link><span>/</span><span>{document.title}</span></nav>
      <header>
        <p className="section-label">{corpusCollectionLabel(collection)} · {document.status}</p>
        <h1>{document.title}</h1>
        <p>{document.description}</p>
        <dl className="corpus-document-meta"><div><dt>Audience</dt><dd>{document.audience.join(", ")}</dd></div><div><dt>Level</dt><dd>{document.level.join(", ")}</dd></div><div><dt>Source</dt><dd><code>{document.sourcePath}</code></dd></div><div><dt>Length</dt><dd>{document.wordCount.toLocaleString()} words</dd></div></dl>
      </header>
      <CorpusMarkdown document={document} />
      {document.related.length > 0 && <aside className="corpus-related"><p className="section-label">Related source routes</p><ul>{document.related.map((href) => {
        const resolved = document.links.find((link) => link.href === href)?.resolvedHref ?? href;
        return <li key={href}>{/^(https?:|mailto:)/i.test(resolved) ? <a href={resolved} rel="noreferrer" target={resolved.startsWith("http") ? "_blank" : undefined}>{href}</a> : <Link href={resolved}>{href}</Link>}</li>;
      })}</ul></aside>}
      <nav className="docs-pagination" aria-label="Corpus pagination">{previous ? <Link href={`${previous.previewHref}${preserve}`}><span>Previous</span>{previous.title}</Link> : <span />}{next ? <Link href={`${next.previewHref}${preserve}`}><span>Next</span>{next.title}</Link> : <Link href={catalogHref}><span>Return</span>Corpus catalog</Link>}</nav>
    </article>
    <aside className="docs-toc corpus-toc" aria-label="On this page"><p>On this page</p>{toc.map((heading) => <a className={`depth-${heading.depth}`} href={`#${heading.id}`} key={heading.id}>{heading.text}</a>)}</aside>
  </main><SiteFooter /></>;
}
