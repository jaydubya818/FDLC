import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CorpusDocument } from "../../components/corpus/corpus-document";
import { corpusDocuments, getCorpusDocument } from "../../../lib/corpus";

export const dynamicParams = false;

export function generateStaticParams() {
  return corpusDocuments.map((document) => ({ slug: document.path.slice(1).split("/") }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const document = getCorpusDocument(slug);
  if (!document) return {};
  return {
    title: `${document.title} · Corpus Preview`,
    description: document.description,
    robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false, noarchive: true } },
  };
}

export default async function CorpusDocumentPage({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<{ from?: string }> }) {
  const { slug } = await params;
  const document = getCorpusDocument(slug);
  if (!document) notFound();
  const requestedReturnState = (await searchParams).from ?? "";
  const returnState = requestedReturnState.length <= 500 && !requestedReturnState.includes("#") ? requestedReturnState : "";
  return <CorpusDocument document={document} returnState={returnState} />;
}
