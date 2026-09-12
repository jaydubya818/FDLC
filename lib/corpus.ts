import { corpusData } from "../data/corpus.generated";
import type { CorpusDocument } from "./corpus-types";

export const corpusDocuments = corpusData.documents;
export const corpusRoutes = new Set(corpusDocuments.map((document) => document.path));
export const corpusDocumentByPath = new Map(corpusDocuments.map((document) => [document.path, document]));
export const corpusRawArtifacts = corpusData.rawArtifacts;
export const corpusCollisions = corpusData.collisions;
export const corpusSourceDigest = corpusData.sourceDigest;

export function getCorpusDocument(slug: string[]): CorpusDocument | undefined {
  const route = `/${slug.join("/")}`;
  return corpusDocumentByPath.get(route);
}

export function corpusCollection(document: Pick<CorpusDocument, "path">): string {
  return document.path.split("/").filter(Boolean)[0] ?? "overview";
}

export function corpusCollectionLabel(collection: string): string {
  return collection.split("-").map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join(" ");
}

export function corpusCatalogDocuments() {
  return corpusDocuments.map((document) => ({
    audience: document.audience,
    collection: corpusCollection(document),
    description: document.description,
    level: document.level,
    path: document.path,
    previewHref: document.previewHref,
    sourcePath: document.sourcePath,
    status: document.status,
    title: document.title,
    wordCount: document.wordCount,
  }));
}
