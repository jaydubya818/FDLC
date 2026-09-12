"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState, useTransition } from "react";

const pageSize = 24;

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

export function CorpusCatalog({ documents }: { documents: CatalogDocument[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();
  const [draftQuery, setDraftQuery] = useState(searchParams.get("q") ?? "");
  const [visibleCount, setVisibleCount] = useState(pageSize);
  const collections = useMemo(() => [...new Set(documents.map((document) => document.collection))].sort(), [documents]);
  const requestedCollection = searchParams.get("collection") ?? "all";
  const collection = requestedCollection === "all" || collections.includes(requestedCollection) ? requestedCollection : "all";
  const query = searchParams.get("q") ?? "";
  const invalidCollection = requestedCollection !== collection;
  const filtered = useMemo(() => documents.filter((document) => (collection === "all" || document.collection === collection) && (!query || includesQuery(document, query))), [collection, documents, query]);
  const visible = filtered.slice(0, visibleCount);

  function update(next: { collection?: string; q?: string }) {
    const params = new URLSearchParams(searchParams.toString());
    const nextCollection = next.collection ?? collection;
    const nextQuery = next.q ?? query;
    if (nextCollection === "all") params.delete("collection"); else params.set("collection", nextCollection);
    if (nextQuery.trim()) params.set("q", nextQuery.trim()); else params.delete("q");
    setVisibleCount(pageSize);
    startTransition(() => router.replace(`${pathname}${params.size ? `?${params}` : ""}`, { scroll: false }));
  }

  const returnState = new URLSearchParams();
  if (collection !== "all") returnState.set("collection", collection);
  if (query) returnState.set("q", query);

  return (
    <section className="corpus-catalog" aria-labelledby="corpus-catalog-heading" aria-busy={pending}>
      <header>
        <div><p className="section-label">Generated route manifest</p><h2 id="corpus-catalog-heading">Browse the corpus.</h2></div>
        <p><strong>{filtered.length}</strong> of {documents.length} documents</p>
      </header>
      <form className="corpus-filters" onSubmit={(event) => { event.preventDefault(); update({ q: draftQuery }); }} role="search">
        <label>Search titles and metadata<input name="q" onChange={(event) => setDraftQuery(event.target.value)} placeholder="Try verification, security, or builder" type="search" value={draftQuery} /></label>
        <label>Collection<select name="collection" onChange={(event) => update({ collection: event.target.value })} value={collection}><option value="all">All collections</option>{collections.map((item) => <option key={item} value={item}>{item.replaceAll("-", " ")}</option>)}</select></label>
        <button className="button button-dark" type="submit">Apply filters</button>
        {(query || collection !== "all" || invalidCollection) && <button className="corpus-clear" onClick={() => { setDraftQuery(""); setVisibleCount(pageSize); startTransition(() => router.replace(pathname)); }} type="button">Clear</button>}
      </form>
      {invalidCollection && <p className="corpus-filter-note" role="status">The requested collection does not exist. Showing all collections.</p>}
      <p className="visually-hidden" aria-live="polite">{pending ? "Updating corpus results" : `${visible.length} of ${filtered.length} corpus documents shown`}</p>
      {filtered.length ? <><ol className="corpus-results">{visible.map((document) => {
        const href = `${document.previewHref}${returnState.size ? `?from=${encodeURIComponent(returnState.toString())}` : ""}`;
        return <li key={document.path}><Link href={href}><span>{document.collection.replaceAll("-", " ")} · {document.status}</span><h3>{document.title}</h3><p>{document.description}</p><small>{document.path} · {document.wordCount.toLocaleString()} words</small></Link></li>;
      })}</ol>{visible.length < filtered.length && <div className="corpus-more"><p>Showing {visible.length} of {filtered.length} matching documents.</p><button className="button button-light" onClick={() => setVisibleCount((count) => count + pageSize)} type="button">Show {Math.min(pageSize, filtered.length - visible.length)} more</button></div>}</> : <div className="corpus-empty"><p className="section-label">No results</p><h3>No document matches those filters.</h3><p>Try a broader phrase or clear the selected collection.</p><button className="button button-dark" onClick={() => { setDraftQuery(""); setVisibleCount(pageSize); startTransition(() => router.replace(pathname)); }} type="button">Clear filters</button></div>}
    </section>
  );
}
