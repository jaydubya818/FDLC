"use client";

/* eslint-disable @next/next/no-html-link-for-pages -- Guide search is owned by the Guide microfrontend. */

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

const pageSize = 9;

type CatalogDocument = {
  audience: string[];
  collection: string;
  description: string;
  level: string[];
  path: string;
  previewHref: string;
  sourcePath: string;
  status: string;
  title: string;
  wordCount: number;
};

function includesQuery(document: CatalogDocument, query: string) {
  const haystack = [document.title, document.description, document.path, document.collection, ...document.audience, ...document.level].join(" ").toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function formatLabel(value: string) {
  return value.split("-").map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join(" ");
}

function CorpusCatalogContent({ documents, searchString }: { documents: CatalogDocument[]; searchString: string }) {
  const searchParams = new URLSearchParams(searchString);
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const collections = useMemo(() => [...new Set(documents.map((document) => document.collection))].sort(), [documents]);
  const audiences = useMemo(() => [...new Set(documents.flatMap((document) => document.audience))].sort(), [documents]);
  const levels = useMemo(() => [...new Set(documents.flatMap((document) => document.level))].sort(), [documents]);
  const requestedCollection = searchParams.get("collection") ?? "all";
  const collection = requestedCollection === "all" || collections.includes(requestedCollection) ? requestedCollection : "all";
  const requestedAudience = searchParams.get("audience") ?? "all";
  const audience = requestedAudience === "all" || audiences.includes(requestedAudience) ? requestedAudience : "all";
  const requestedLevel = searchParams.get("level") ?? "all";
  const level = requestedLevel === "all" || levels.includes(requestedLevel) ? requestedLevel : "all";
  const query = searchParams.get("q") ?? "";
  const [draftQuery, setDraftQuery] = useState(query);
  const [draftCollection, setDraftCollection] = useState(collection);
  const [draftAudience, setDraftAudience] = useState(audience);
  const [draftLevel, setDraftLevel] = useState(level);
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const invalidFilter = requestedCollection !== collection || requestedAudience !== audience || requestedLevel !== level;
  const filtered = useMemo(() => documents.filter((document) =>
    (collection === "all" || document.collection === collection)
    && (audience === "all" || document.audience.includes(audience))
    && (level === "all" || document.level.includes(level))
    && (!query || includesQuery(document, query)),
  ), [audience, collection, documents, level, query]);
  const visible = filtered.slice(0, visibleCount);

  function applyFilters() {
    const params = new URLSearchParams(searchParams.toString());
    if (draftCollection === "all") params.delete("collection"); else params.set("collection", draftCollection);
    if (draftAudience === "all") params.delete("audience"); else params.set("audience", draftAudience);
    if (draftLevel === "all") params.delete("level"); else params.set("level", draftLevel);
    if (draftQuery.trim()) params.set("q", draftQuery.trim()); else params.delete("q");
    setVisibleCount(pageSize);
    startTransition(() => router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false }));
  }

  function clearFilters() {
    setDraftQuery("");
    setDraftCollection("all");
    setDraftAudience("all");
    setDraftLevel("all");
    setVisibleCount(pageSize);
    startTransition(() => router.replace(pathname));
  }

  const returnState = new URLSearchParams();
  if (collection !== "all") returnState.set("collection", collection);
  if (audience !== "all") returnState.set("audience", audience);
  if (level !== "all") returnState.set("level", level);
  if (query) returnState.set("q", query);

  return (
    <section className="corpus-catalog" aria-labelledby="corpus-catalog-heading" aria-busy={pending}>
      <header>
        <div><p className="section-label">Complete draft reference</p><h2 id="corpus-catalog-heading">Search the full library.</h2></div>
        <p><strong>{filtered.length}</strong> of {documents.length} documents</p>
      </header>
      <form className="corpus-filters" onSubmit={(event) => { event.preventDefault(); applyFilters(); }} role="search">
        <label className="corpus-search-field">Search titles and metadata<input name="q" onChange={(event) => setDraftQuery(event.target.value)} placeholder="Try verification, security, or builder" type="search" value={draftQuery} /></label>
        <label>Collection<select name="collection" onChange={(event) => setDraftCollection(event.target.value)} value={draftCollection}><option value="all">All collections</option>{collections.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}</select></label>
        <label>Audience<select name="audience" onChange={(event) => setDraftAudience(event.target.value)} value={draftAudience}><option value="all">All audiences</option>{audiences.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}</select></label>
        <label>Depth<select name="level" onChange={(event) => setDraftLevel(event.target.value)} value={draftLevel}><option value="all">All levels</option>{levels.map((item) => <option key={item} value={item}>{formatLabel(item)}</option>)}</select></label>
        <button className="button button-dark corpus-apply" type="submit">Apply filters</button>
        {(query || collection !== "all" || audience !== "all" || level !== "all" || invalidFilter) && <button className="corpus-clear" onClick={clearFilters} type="button">Clear</button>}
      </form>
      {invalidFilter && <p className="corpus-filter-note" role="status">One or more requested filters do not exist. Valid filters are still applied.</p>}
      <p className="visually-hidden" aria-live="polite">{pending ? "Updating corpus results" : `${visible.length} of ${filtered.length} corpus documents shown`}</p>
      {filtered.length ? <><ol className="corpus-results">{visible.map((document) => {
        const href = `${document.previewHref}${returnState.size ? `?from=${encodeURIComponent(returnState.toString())}` : ""}`;
        return <li key={document.path}><Link href={href}><span>{formatLabel(document.collection)} · {document.status}</span><h3>{document.title}</h3><p>{document.description}</p><small>{document.path} · {document.wordCount.toLocaleString()} words</small></Link></li>;
      })}</ol>{visible.length < filtered.length && <div className="corpus-more"><p>Showing {visible.length} of {filtered.length} matching documents.</p><button className="button button-light" onClick={() => setVisibleCount((count) => count + pageSize)} type="button">Show {Math.min(pageSize, filtered.length - visible.length)} more</button></div>}</> : <div className="corpus-empty"><p className="section-label">No results</p><h3>No document matches those filters.</h3><p>Try a broader phrase or clear the selected collection. The Learning Library is a Preview surface; the Guide remains the field book.</p><div className="corpus-empty-actions"><button className="button button-dark" onClick={clearFilters} type="button">Clear filters</button><a className="button button-light" href="/guide/search">Search the Guide</a></div></div>}
    </section>
  );
}

export function CorpusCatalog({ documents }: { documents: CatalogDocument[] }) {
  const searchString = useSearchParams().toString();
  return <CorpusCatalogContent documents={documents} key={searchString} searchString={searchString} />;
}
