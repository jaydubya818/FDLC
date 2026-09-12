import { createHash } from "node:crypto";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import matter from "gray-matter";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import YAML from "yaml";

import {
  CORPUS_PREVIEW_PREFIX,
  CORPUS_RAW_PREFIX,
  createHeadingIdFactory,
  existingSiteRoutes,
  isExistingSiteRoute,
  isGuideOwnedRoute,
  isUnsafeHref,
  normalizeRoute,
  splitHref,
  toPreviewHref,
  type CorpusHeading,
  type CorpusLink,
} from "../../lib/corpus-contract.ts";

export type FrontMatter = {
  audience: string[];
  description: string;
  diagrams: string[];
  level: string[];
  mcRefs: string[];
  path: string;
  related: string[];
  status: string;
  title: string;
};

export type SourceDocument = FrontMatter & {
  body: string;
  headings: CorpusHeading[];
  links: CorpusLink[];
  sourcePath: string;
  wordCount: number;
};

export type Finding = {
  check: string;
  detail: string;
  severity: "error" | "warning" | "external";
  source?: string;
};

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const contentRoot = path.join(projectRoot, "content/fdlc-corpus");
const outputPath = path.join(projectRoot, "data/corpus.generated.ts");
const reportPath = path.join(projectRoot, "docs/reviews/corpus-preview-verification.json");
const publicationPath = path.join(contentRoot, "publication.json");
const packageLockPath = path.join(projectRoot, "package-lock.json");
const generatorVersion = "1.0.0";
const excludedMarkdown = new Set([
  "corpus/README.md",
  "corpus/diagrams/svg/README.md",
  "corpus/specification/CHANGELOG.md",
]);
const canonicalCollisions = new Set([...existingSiteRoutes].filter((route) => route !== "/"));
const bannedTerms = ["genuinely", "honestly", "straightforward", "delve", "leverage"];
const args = new Set(process.argv.slice(2));
const writeMode = args.has("--write");

async function walk(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map(async (entry) => {
    const absolute = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  }));
  return nested.flat().sort();
}

function relative(absolute: string): string {
  return path.relative(contentRoot, absolute).split(path.sep).join("/");
}

function asStringArray(value: unknown): string[] {
  if (value == null) return [];
  return (Array.isArray(value) ? value : [value]).map((item) => String(item));
}

function textOf(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const value = "value" in node && typeof node.value === "string" ? node.value : "";
  const children = "children" in node && Array.isArray(node.children) ? node.children.map(textOf).join("") : "";
  return `${value}${children}`;
}

export function parseDocument(sourcePath: string, raw: string, findings: Finding[]): SourceDocument | undefined {
  let parsed: matter.GrayMatterFile<string>;
  try {
    parsed = matter(raw);
  } catch (error) {
    findings.push({ check: "front-matter", detail: error instanceof Error ? error.message : String(error), severity: "error", source: sourcePath });
    return;
  }
  const required = ["title", "description", "path", "audience", "level", "status"] as const;
  for (const key of required) if (parsed.data[key] == null || parsed.data[key] === "") findings.push({ check: "front-matter", detail: `Missing ${key}`, severity: "error", source: sourcePath });
  let route: string;
  try {
    route = normalizeRoute(String(parsed.data.path ?? ""));
  } catch (error) {
    findings.push({ check: "route", detail: error instanceof Error ? error.message : String(error), severity: "error", source: sourcePath });
    return;
  }
  const body = parsed.content.replace(/^\s*#\s+[^\n]+\n+/, "");
  const tree = unified().use(remarkParse).parse(body);
  const nextHeadingId = createHeadingIdFactory();
  const headings: CorpusHeading[] = [];
  const rawLinks: string[] = [];
  visit(tree, (node: { depth?: number; type?: string; url?: string }) => {
    if (node.type === "heading" && node.depth) {
      const resolved = nextHeadingId(textOf(node));
      if (resolved.duplicateExplicitId) findings.push({ check: "anchor", detail: `Duplicate explicit heading id #${resolved.id}`, severity: "error", source: sourcePath });
      headings.push({ depth: node.depth, id: resolved.id, text: resolved.text });
    }
    if ((node.type === "link" || node.type === "image") && node.url) rawLinks.push(node.url);
    if (node.type === "html") findings.push({ check: "unsafe-html", detail: "Raw HTML is neutralized by the preview renderer", severity: "warning", source: sourcePath });
  });
  return {
    audience: asStringArray(parsed.data.audience),
    body,
    description: String(parsed.data.description ?? ""),
    diagrams: asStringArray(parsed.data.diagrams),
    headings,
    level: asStringArray(parsed.data.level),
    links: rawLinks.map((href) => ({ href, kind: isUnsafeHref(href) ? "unsafe" : "missing" })),
    mcRefs: asStringArray(parsed.data.mc_refs),
    path: route,
    related: asStringArray(parsed.data.related),
    sourcePath,
    status: String(parsed.data.status ?? ""),
    title: String(parsed.data.title ?? ""),
    wordCount: body.trim().split(/\s+/).filter(Boolean).length,
  };
}

function resolveRelativeLink(document: SourceDocument, href: string, sourceToRoute: Map<string, string>, rawArtifacts: Set<string>): CorpusLink {
  const { fragment, pathname, query } = splitHref(href);
  if (!pathname) return { href, kind: "fragment", resolvedHref: fragment };
  const sourceDirectory = path.posix.dirname(document.sourcePath);
  const resolvedSource = path.posix.normalize(path.posix.join(sourceDirectory, pathname));
  const route = sourceToRoute.get(resolvedSource);
  if (route) return { href, kind: "corpus", resolvedHref: `${toPreviewHref(route)}${query}${fragment}` };
  if (rawArtifacts.has(resolvedSource)) return { href, kind: "raw", resolvedHref: `${CORPUS_RAW_PREFIX}/${resolvedSource}${query}${fragment}` };
  return { href, kind: "missing" };
}

export function classifyLinks(documents: SourceDocument[], rawArtifacts: Set<string>, findings: Finding[]) {
  const routes = new Set(documents.map((document) => document.path));
  const sourceToRoute = new Map(documents.map((document) => [document.sourcePath, document.path]));
  for (const document of documents) {
    const combined = [...document.links.map((link) => link.href), ...document.related];
    const classified = combined.map((href): CorpusLink => {
      if (isUnsafeHref(href)) return { href, kind: "unsafe" };
      if (/^(https?:|mailto:)/i.test(href)) return { href, kind: "external", resolvedHref: href };
      if (!href.startsWith("/") && !href.startsWith("#")) return resolveRelativeLink(document, href, sourceToRoute, rawArtifacts);
      const { fragment, pathname, query } = splitHref(href);
      if (!pathname) return { href, kind: "fragment", resolvedHref: fragment };
      let route: string;
      try { route = normalizeRoute(decodeURIComponent(pathname)); } catch { return { href, kind: "missing" }; }
      if (routes.has(route)) return { href, kind: "corpus", resolvedHref: `${toPreviewHref(route)}${query}${fragment}` };
      if (isGuideOwnedRoute(route)) return { href, kind: "guide", resolvedHref: href };
      if (isExistingSiteRoute(route)) return { href, kind: "site", resolvedHref: href };
      if (route.startsWith("/schemas/v1/") && rawArtifacts.has(`corpus/specification/schemas/${path.posix.basename(route)}`)) {
        return { href, kind: "raw", resolvedHref: `${CORPUS_RAW_PREFIX}/corpus/specification/schemas/${path.posix.basename(route)}` };
      }
      return { href, kind: "missing" };
    });
    document.links = [...new Map(classified.map((link) => [`${link.kind}:${link.href}:${link.resolvedHref ?? ""}`, link])).values()];
    const ownAnchors = new Set(document.headings.map((heading) => heading.id));
    for (const link of document.links) {
      if (link.kind === "unsafe") findings.push({ check: "unsafe-link", detail: link.href, severity: "error", source: document.sourcePath });
      if (link.kind === "missing") findings.push({ check: "link", detail: `Unresolved link ${link.href}`, severity: "error", source: document.sourcePath });
      if (link.kind === "fragment" && link.href.startsWith("#") && !ownAnchors.has(link.href.slice(1))) findings.push({ check: "fragment", detail: `Missing local fragment ${link.href}`, severity: "error", source: document.sourcePath });
      if (link.kind === "corpus" && link.resolvedHref?.includes("#")) {
        const [targetHref, targetFragment] = link.resolvedHref.split("#", 2);
        const targetRoute = targetHref.slice(CORPUS_PREVIEW_PREFIX.length) || "/";
        const target = documents.find((candidate) => candidate.path === targetRoute);
        if (!target?.headings.some((heading) => heading.id === targetFragment)) findings.push({ check: "fragment", detail: `Missing target fragment ${link.href}`, severity: "error", source: document.sourcePath });
      }
    }
  }
}

export async function validateSchemas(allFiles: string[], findings: Finding[]) {
  const schemaFiles = allFiles.filter((file) => /corpus\/specification\/schemas\/[^/]+\.schema\.json$/.test(file));
  const exampleFiles = allFiles.filter((file) => /corpus\/specification\/examples\/[^/]+\.(json|ya?ml)$/.test(file));
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  const schemas = new Map<string, { absolute: string; schema: object }>();
  for (const absolute of schemaFiles) {
    const name = path.basename(absolute).replace(".schema.json", "");
    try {
      const schema = JSON.parse(await readFile(absolute, "utf8"));
      ajv.compile(schema);
      schemas.set(name, { absolute, schema });
    } catch (error) {
      findings.push({ check: "schema", detail: error instanceof Error ? error.message : String(error), severity: "error", source: relative(absolute) });
    }
  }
  for (const absolute of exampleFiles) {
    const name = path.basename(absolute).replace(/\.example\.(json|ya?ml)$/, "");
    const pair = schemas.get(name);
    if (!pair) {
      findings.push({ check: "schema-pair", detail: `No schema for example ${name}`, severity: "error", source: relative(absolute) });
      continue;
    }
    try {
      const raw = await readFile(absolute, "utf8");
      const instance = absolute.endsWith(".json") ? JSON.parse(raw) : YAML.parse(raw);
      const validate = ajv.compile(pair.schema);
      if (!validate(instance)) findings.push({ check: "schema-example", detail: ajv.errorsText(validate.errors), severity: "error", source: relative(absolute) });
    } catch (error) {
      findings.push({ check: "schema-example", detail: error instanceof Error ? error.message : String(error), severity: "error", source: relative(absolute) });
    }
  }
  for (const name of schemas.keys()) if (!exampleFiles.some((file) => path.basename(file).startsWith(`${name}.example.`))) findings.push({ check: "schema-pair", detail: `No example for schema ${name}`, severity: "error" });
}

function stableJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function moduleSource(payload: unknown): string {
  return `/* This file is generated by scripts/corpus/generate.ts. Do not edit. */\nimport type { CorpusData } from "../lib/corpus-types";\n\nexport const corpusData: CorpusData = ${JSON.stringify(payload)};\n`;
}

async function main() {
  const findings: Finding[] = [];
  const allFiles = await walk(contentRoot);
  JSON.parse(await readFile(publicationPath, "utf8"));
  const markdownFiles = allFiles.filter((file) => file.endsWith(".md"));
  const documentFiles = markdownFiles.filter((file) => relative(file).startsWith("corpus/") && !excludedMarkdown.has(relative(file)));
  const rawArtifactPaths = new Set(allFiles.filter((file) => {
    const rel = relative(file);
    return rel.startsWith("audit/") || rel.startsWith("canon/") || rel === "site-implementation/RUNBOOK.md" || rel === "corpus/specification/CHANGELOG.md" || /corpus\/specification\/(schemas|examples)\//.test(rel) || /corpus\/diagrams\/(mermaid|svg)\//.test(rel);
  }).map(relative));
  const documents: SourceDocument[] = [];
  for (const absolute of documentFiles) {
    const sourcePath = relative(absolute);
    const raw = await readFile(absolute, "utf8");
    const document = parseDocument(sourcePath, raw, findings);
    if (document) documents.push(document);
  }
  documents.sort((left, right) => left.path.localeCompare(right.path));
  const routeSources = new Map<string, string>();
  for (const document of documents) {
    const prior = routeSources.get(document.path);
    if (prior) findings.push({ check: "route", detail: `Duplicate route ${document.path}; first declared in ${prior}`, severity: "error", source: document.sourcePath });
    routeSources.set(document.path, document.sourcePath);
    for (const term of bannedTerms) {
      const matches = `${document.title}\n${document.description}\n${document.body}`.match(new RegExp(`\\b${term}\\b`, "gi"));
      if (matches) findings.push({ check: "prohibited-term", detail: `${term}: ${matches.length}`, severity: "error", source: document.sourcePath });
    }
    if (document.description.length > 160) findings.push({ check: "description-length", detail: `${document.description.length} characters`, severity: "warning", source: document.sourcePath });
    if (document.status !== "draft") findings.push({ check: "status", detail: `Unexpected preview status ${document.status}`, severity: "warning", source: document.sourcePath });
    if (document.path === CORPUS_RAW_PREFIX || document.path.startsWith(`${CORPUS_RAW_PREFIX}/`)) findings.push({ check: "route", detail: `Reserved artifact route ${document.path}`, severity: "error", source: document.sourcePath });
  }
  classifyLinks(documents, rawArtifactPaths, findings);
  const diagramIds = new Set(allFiles.filter((file) => /corpus\/diagrams\/mermaid\/D\d+\.mmd$/.test(file)).map((file) => path.basename(file, ".mmd")));
  for (const document of documents) for (const id of document.diagrams) if (!diagramIds.has(id)) findings.push({ check: "diagram", detail: `Missing diagram ${id}`, severity: "error", source: document.sourcePath });
  await validateSchemas(allFiles, findings);

  const rawArtifacts: Record<string, { content: string; contentType: string }> = {};
  for (const rel of [...rawArtifactPaths].sort()) {
    const absolute = path.join(contentRoot, rel);
    if ((await stat(absolute)).size > 1_000_000 || rel.endsWith(".png")) continue;
    const contentType = rel.endsWith(".json") ? "application/json; charset=utf-8" : rel.endsWith(".svg") ? "image/svg+xml; charset=utf-8" : "text/plain; charset=utf-8";
    rawArtifacts[rel] = { content: await readFile(absolute, "utf8"), contentType };
  }
  const digestInput = documents.map(({ sourcePath, body, ...metadata }) => ({ sourcePath, body, metadata })).concat([]);
  const digest = createHash("sha256").update(JSON.stringify(digestInput)).digest("hex");
  const routeSet = new Set(documents.map((document) => document.path));
  const collisions = [...canonicalCollisions].filter((route) => routeSet.has(route)).sort();
  const payload = {
    schema: "fdlc-corpus-preview/v1",
    generatedAt: "SOURCE_DERIVED",
    sourceDigest: digest,
    previewPrefix: CORPUS_PREVIEW_PREFIX,
    collisions,
    documents: documents.map((document, index) => ({
      ...document,
      previewHref: toPreviewHref(document.path),
      previousPath: documents[index - 1]?.path ?? null,
      nextPath: documents[index + 1]?.path ?? null,
    })),
    rawArtifacts,
  };
  const missionControlReferences = [...new Map(documents.flatMap((document) => document.mcRefs.map((reference) => [reference, { reference, source: document.sourcePath }] as const))).values()].sort((left, right) => left.reference.localeCompare(right.reference));
  const missionControlRoot = process.env.MC_REPO_PATH ? path.resolve(process.env.MC_REPO_PATH) : undefined;
  const external: Finding[] = [];
  let verifiedMissionControlReferences = 0;
  for (const { reference, source } of missionControlReferences) {
    if (!missionControlRoot) {
      external.push({ check: "mission-control-reference", detail: reference, severity: "external", source });
      continue;
    }
    const absolute = path.resolve(missionControlRoot, reference);
    if (absolute !== missionControlRoot && !absolute.startsWith(`${missionControlRoot}${path.sep}`)) {
      findings.push({ check: "mission-control-reference", detail: `Reference escapes MC_REPO_PATH: ${reference}`, severity: "error", source });
      continue;
    }
    try {
      await stat(absolute);
      verifiedMissionControlReferences += 1;
    } catch {
      findings.push({ check: "mission-control-reference", detail: `Missing from MC_REPO_PATH: ${reference}`, severity: "error", source });
    }
  }
  const errors = findings.filter((finding) => finding.severity === "error");
  const warnings = findings.filter((finding) => finding.severity === "warning");
  let existingReport: { generatedAt?: string } = {};
  try { existingReport = JSON.parse(await readFile(reportPath, "utf8")); } catch { /* A missing report is expected before the first sync. */ }
  const generatedAt = writeMode ? new Date().toISOString() : existingReport.generatedAt ?? "MISSING—RUN npm run corpus:sync";
  const packageLock = JSON.parse(await readFile(packageLockPath, "utf8")) as { packages?: Record<string, { version?: string }> };
  const packageVersion = (name: string) => packageLock.packages?.[`node_modules/${name}`]?.version ?? "unavailable";
  const checks = [
    { name: "front-matter-and-routes", result: errors.some((finding) => ["front-matter", "route"].includes(finding.check)) ? "fail" : "pass" },
    { name: "links-and-fragments", result: errors.some((finding) => ["link", "fragment", "unsafe-link"].includes(finding.check)) ? "fail" : "pass" },
    { name: "schema-example-pairs", result: errors.some((finding) => finding.check.startsWith("schema")) ? "fail" : "pass" },
    { name: "diagram-references", result: errors.some((finding) => finding.check === "diagram") ? "fail" : "pass" },
    { name: "mermaid-source-syntax", result: "skip", detail: "Validated in both real-browser runtime suites, not by the build-time generator." },
    { name: "mission-control-files", result: missionControlRoot ? (errors.some((finding) => finding.check === "mission-control-reference") ? "fail" : "pass") : "externally-unverifiable", detail: missionControlRoot ? `${verifiedMissionControlReferences} unique paths verified` : "Set MC_REPO_PATH to a Mission Control checkout to verify these paths." },
  ] as const;
  const outcomes = Object.fromEntries(["pass", "fail", "skip", "externally-unverifiable"].map((result) => [result, checks.filter((check) => check.result === result).length]));
  const report = {
    schema: "fdlc-corpus-verification/v1",
    generatedAt,
    generatorVersion,
    reproduce: "npm run corpus:sync && npm run corpus:verify",
    archiveSha256: "54583e8f18d3e474617b6d63b25ddac1c58ff196c8271a2dcb22f7f4a6e38a49",
    sourceDigest: digest,
    toolVersions: {
      node: process.version,
      ajv: packageVersion("ajv"),
      grayMatter: packageVersion("gray-matter"),
      mermaid: packageVersion("mermaid"),
      next: packageVersion("next"),
      reactMarkdown: packageVersion("react-markdown"),
      vinext: packageVersion("vinext"),
      yaml: packageVersion("yaml"),
    },
    outcomes,
    checks,
    counts: {
      importedArchiveFiles: allFiles.length - 2,
      contentTreeFiles: allFiles.length,
      corpusMarkdownFiles: markdownFiles.filter((file) => relative(file).startsWith("corpus/")).length,
      reviewMarkdownFiles: markdownFiles.filter((file) => !relative(file).startsWith("corpus/") && relative(file) !== "PROVENANCE.md").length,
      routedDocuments: documents.length,
      words: documents.reduce((sum, document) => sum + document.wordCount, 0),
      schemas: allFiles.filter((file) => file.endsWith(".schema.json")).length,
      examples: allFiles.filter((file) => /\.example\.(json|ya?ml)$/.test(file)).length,
      mermaidSources: diagramIds.size,
      canonicalCollisions: collisions.length,
      errors: errors.length,
      warnings: warnings.length,
      externallyUnverifiable: external.length,
      verifiedMissionControlReferences,
    },
    collisions,
    findings: [...errors, ...warnings, ...external],
  };
  const nextModule = moduleSource(payload);
  const nextReport = stableJson(report);
  if (writeMode) {
    await writeFile(reportPath, nextReport);
    if (errors.length === 0) await writeFile(outputPath, nextModule);
  } else {
    for (const [target, expected] of [[outputPath, nextModule], [reportPath, nextReport]] as const) {
      let current = "";
      try { current = await readFile(target, "utf8"); } catch { /* Missing generated output is stale. */ }
      if (current !== expected) findings.push({ check: "stale-output", detail: path.relative(projectRoot, target), severity: "error" });
    }
  }
  const finalErrors = findings.filter((finding) => finding.severity === "error");
  console.log(JSON.stringify({ ...report.counts, errors: finalErrors.length }, null, 2));
  if (finalErrors.length) {
    for (const finding of finalErrors.slice(0, 100)) console.error(`${finding.check}: ${finding.source ?? "corpus"}: ${finding.detail}`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
