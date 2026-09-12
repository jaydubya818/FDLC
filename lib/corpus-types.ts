import type { CorpusHeading, CorpusLink } from "./corpus-contract";

export type CorpusDocument = {
  audience: string[];
  body: string;
  description: string;
  diagrams: string[];
  headings: CorpusHeading[];
  level: string[];
  links: CorpusLink[];
  mcRefs: string[];
  nextPath: string | null;
  path: string;
  previewHref: string;
  previousPath: string | null;
  related: string[];
  sourcePath: string;
  status: string;
  title: string;
  wordCount: number;
};

export type CorpusRawArtifact = {
  content: string;
  contentType: string;
};

export type CorpusData = {
  collisions: string[];
  documents: CorpusDocument[];
  generatedAt: string;
  previewPrefix: string;
  rawArtifacts: Record<string, CorpusRawArtifact>;
  schema: string;
  sourceDigest: string;
};
