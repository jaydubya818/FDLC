import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteFooter } from "../../components/site-footer";
import { SiteHeader } from "../../components/site-header";
import { adjacentGuideParts, getGuidePart, guideParts } from "../../../data/guide";

export function generateStaticParams() { return guideParts.map((part) => ({ slug: part.id })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const part = getGuidePart(slug);
  if (!part) return {};
  const title = `${part.verb}: ${part.title}`;
  const description = part.overview;
  return { title, description, openGraph: { title: `${title} · FDLC.ai`, description, images: [] }, twitter: { card: "summary", title: `${title} · FDLC.ai`, description, images: [] } };
}

export default async function GuidePartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const part = getGuidePart(slug);
  if (!part) notFound();
  const adjacent = adjacentGuideParts(part.id);
  return <><SiteHeader /><main id="main-content" className="docs-layout">
    <aside className="docs-sidebar"><Link className="docs-back" href="/guide">← Guide home</Link><p>The six parts</p><nav aria-label="Guide parts">{guideParts.map((item) => <Link aria-current={item.id === part.id ? "page" : undefined} href={`/guide/${item.id}`} key={item.id}><span>{item.number}</span>{item.verb}</Link>)}</nav></aside>
    <article className="docs-article">
      <nav className="breadcrumbs" aria-label="Breadcrumb"><Link href="/guide">Guide</Link><span>/</span><span>Part {part.number}</span></nav>
      <header><p className="section-label">Part {part.number} / {part.verb}</p><h1>{part.title}</h1><p>{part.overview}</p></header>
      <section id="question"><h2>Question this part answers</h2><p className="docs-emphasis">{part.question}</p></section>
      <section id="chapters"><h2>Chapters</h2><ol className="chapter-list">{part.chapters.map(([number, title, summary, href]) => <li id={`chapter-${number}`} key={number}><span>{String(number).padStart(2, "0")}</span><div><h3><a href={href}>{title} ↗</a></h3><p>{summary}</p></div></li>)}</ol></section>
      <section id="retain"><h2>Retain this</h2><ul className="retain-list">{part.retain.map((item) => <li key={item}>{item}</li>)}</ul></section>
      <aside className="docs-callout"><strong>Guide portal</strong><p>This is a concise FDLC part index. Chapter titles open the complete, authoritative prose on the dedicated Guide site.</p><a href={part.startHref}>Open Part {part.number} in the full Guide ↗</a></aside>
      <nav className="docs-pagination" aria-label="Guide pagination">{adjacent.previous ? <Link href={`/guide/${adjacent.previous.id}`}><span>Previous</span>{adjacent.previous.verb}</Link> : <span />}{adjacent.next ? <Link href={`/guide/${adjacent.next.id}`}><span>Next</span>{adjacent.next.verb}</Link> : <Link href="/mission-control"><span>Next</span>Mission Control</Link>}</nav>
    </article>
    <aside className="docs-toc"><p>On this page</p><a href="#question">Question</a><a href="#chapters">Chapters</a><a href="#retain">Retain this</a></aside>
  </main><SiteFooter /></>;
}
