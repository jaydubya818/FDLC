import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Entry = {
  anchor: string;
  disposition: string;
  evidence: string;
  kind: "pattern" | "anti-pattern";
  name: string;
  source: string;
  target?: string;
};

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const corpusRoot = path.join(projectRoot, "content/fdlc-corpus/corpus");
const outputPath = path.join(projectRoot, "docs/reviews/corpus-taxonomy-dispositions.md");
const writeMode = process.argv.includes("--write");

const knownDispositions: Record<string, { disposition: string; target: string }> = {
  "pattern:declared-degraded-mode": { disposition: "alias", target: "/patterns/degraded-mode" },
  "pattern:execution-profile": { disposition: "specification-artifact", target: "/specification/v1/execution-profile" },
  "pattern:tool-grant-receipt": { disposition: "alias", target: "/patterns/tool-grant-and-receipt" },
  "anti-pattern:approval-everywhere": { disposition: "alias", target: "/anti-patterns/human-approval-everywhere" },
  "anti-pattern:authorization-inside-the-model": { disposition: "alias", target: "/anti-patterns/agent-as-authorization-system" },
  "anti-pattern:peer-to-peer-factories": { disposition: "alias", target: "/anti-patterns/agent-to-agent-spaghetti" },
  "anti-pattern:policy-in-the-prompt": { disposition: "alias", target: "/anti-patterns/prompt-as-governance" },
  "anti-pattern:producer-as-judge": { disposition: "alias", target: "/anti-patterns/self-verifying-agent" },
  "anti-pattern:retry-storm": { disposition: "alias", target: "/anti-patterns/infinite-retry-loop" },
  "anti-pattern:whole-window-stuffing": { disposition: "alias", target: "/anti-patterns/context-dumping" },
};

function plainName(value: string): string {
  const pathName = value.match(/^\/(?:anti-)?patterns\/(.+)$/)?.[1];
  return (pathName ?? value).replaceAll("-", " ").replace(/\s+/g, " ").trim();
}

function cleanEvidence(value: string): string {
  return value.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*_]/g, "").replace(/^#+\s*/, "").replace(/^[-|]\s*/, "").replace(/\s+/g, " ").trim().replaceAll("|", "—");
}

function findEvidence(raw: string, name: string, anchor: string): string {
  const phrase = plainName(name).toLowerCase();
  const meaningful = phrase.split(" ").filter((part) => part.length > 2);
  const lines = raw.split("\n").filter((line) => !line.includes(`/proposed#${anchor}`) && !line.startsWith("related:") && line.trim().length > 20);
  const exact = lines.find((line) => cleanEvidence(line).toLowerCase().includes(phrase));
  const partial = exact ?? lines.find((line) => {
    const normalized = cleanEvidence(line).toLowerCase();
    return meaningful.length > 1 && meaningful.every((part) => normalized.includes(part));
  });
  return partial ? cleanEvidence(partial) : "No supporting context was found outside the proposed-index backlink.";
}

async function entriesFor(kind: Entry["kind"]): Promise<Entry[]> {
  const directory = kind === "pattern" ? "patterns" : "anti-patterns";
  const proposed = await readFile(path.join(corpusRoot, directory, "proposed.md"), "utf8");
  const rows = [...proposed.matchAll(/^\| \[([^\]]+)\]\(#([^)]+)\) \| `([^`]+)` \|[^\n]+$/gm)];
  return Promise.all(rows.map(async ([, name, anchor, source]) => {
    const raw = await readFile(path.join(corpusRoot, source), "utf8");
    const evidence = findEvidence(raw, name, anchor);
    const known = knownDispositions[`${kind}:${anchor}`];
    return {
      anchor,
      disposition: known?.disposition ?? (evidence.startsWith("No supporting") ? "needs-evidence" : "candidate"),
      evidence,
      kind,
      name,
      source: `corpus/${source}`,
      target: known?.target,
    };
  }));
}

function render(entries: Entry[]): string {
  const counts = new Map<string, number>();
  for (const entry of entries) counts.set(entry.disposition, (counts.get(entry.disposition) ?? 0) + 1);
  const summary = [...counts].sort(([left], [right]) => left.localeCompare(right)).map(([name, count]) => `- **${name}:** ${count}`).join("\n");
  const sections = entries.map((entry) => `### ${entry.name} {#${entry.anchor}}\n\n- **Type:** ${entry.kind}\n- **Disposition:** ${entry.disposition}${entry.target ? ` → \`${entry.target}\`` : ""}\n- **Source:** \`${entry.source}\`\n- **Supporting context:** ${entry.evidence}\n`).join("\n");
  return `# Corpus taxonomy disposition register\n\n**Status:** Generated review evidence; not canon\n**Entries:** ${entries.length}\n\nThis register replaces the unsupported assumption that every coined name is a new qualified pattern. Candidate means only that distinct supporting context was found. Alias and specification-artifact entries should be repointed before canonical promotion. Needs-evidence entries have no supporting context beyond the backlink that created the proposed index.\n\n## Summary\n\n${summary}\n\n## Dispositions\n\n${sections}`;
}

const entries = [...await entriesFor("pattern"), ...await entriesFor("anti-pattern")];
const output = render(entries);
if (writeMode) {
  await writeFile(outputPath, output);
} else {
  let current = "";
  try { current = await readFile(outputPath, "utf8"); } catch { /* Missing output is stale. */ }
  if (current !== output) {
    console.error("taxonomy: docs/reviews/corpus-taxonomy-dispositions.md is stale");
    process.exitCode = 1;
  }
}
console.log(JSON.stringify({ entries: entries.length, dispositions: Object.fromEntries([...new Set(entries.map((entry) => entry.disposition))].sort().map((disposition) => [disposition, entries.filter((entry) => entry.disposition === disposition).length])) }, null, 2));
