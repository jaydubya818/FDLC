import { corpusData } from "../data/corpus.generated.ts";
import type { CorpusDocument } from "./corpus-types.ts";

type JourneyDefinition = {
  audience: string;
  description: string;
  id: string;
  outcome: string;
  paths: string[];
  title: string;
};

type CorpusJourney = Omit<JourneyDefinition, "paths"> & {
  documents: Pick<CorpusDocument, "path" | "previewHref" | "title" | "wordCount">[];
  readingMinutes: number;
};

const journeyDefinitions: JourneyDefinition[] = [
  {
    id: "understand",
    audience: "New to FDLC",
    title: "Understand the operating model.",
    description: "Learn why software factories need a lifecycle of their own and see the principles that keep autonomy governable.",
    outcome: "A clear mental model and vocabulary for explaining FDLC to your team.",
    paths: ["/start", "/in-5-minutes", "/framework/principles"],
  },
  {
    id: "build",
    audience: "Builders and factory engineers",
    title: "Build your first bounded factory.",
    description: "Move from an intended outcome to a working factory line with explicit verification and evidence.",
    outcome: "A practical sequence for building and proving one useful workflow.",
    paths: ["/guides/build-your-first-factory", "/tutorials/build-your-first-software-factory", "/tutorials/capture-evidence"],
  },
  {
    id: "design",
    audience: "Platform and security teams",
    title: "Design a trusted factory platform.",
    description: "Work through the control boundary, authority model, independent verification, and production observability.",
    outcome: "An architecture checklist for keeping intelligence flexible and authority bounded.",
    paths: ["/architecture", "/architecture/authority", "/architecture/verification", "/architecture/observability"],
  },
  {
    id: "adopt",
    audience: "Engineering and enterprise leaders",
    title: "Adopt FDLC across an organization.",
    description: "Assess maturity, sequence adoption, establish governance, and define the operating responsibilities around the factory.",
    outcome: "A staged adoption conversation grounded in controls, ownership, and measurable outcomes.",
    paths: ["/framework/maturity", "/enterprise/adoption", "/enterprise/policy-governance", "/enterprise/operations"],
  },
];

function requireCorpusDocument(path: string) {
  const document = corpusData.documents.find((candidate) => candidate.path === path);
  if (!document) throw new Error(`Corpus journey references an unknown route: ${path}`);
  return document;
}

export const corpusJourneys: CorpusJourney[] = journeyDefinitions.map(({ paths, ...journey }) => {
  const documents = paths.map(requireCorpusDocument);
  return {
    ...journey,
    documents,
    readingMinutes: Math.max(1, Math.ceil(documents.reduce((total, document) => total + document.wordCount, 0) / 225)),
  };
});
