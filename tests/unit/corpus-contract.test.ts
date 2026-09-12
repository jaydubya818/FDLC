import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

import { corpusData } from "../../data/corpus.generated.ts";
import { createHeadingIdFactory, isUnsafeHref, normalizeRoute, rewriteCorpusHref, toPreviewHref } from "../../lib/corpus-contract.ts";
import { classifyLinks, parseDocument, validateSchemas, type Finding } from "../../scripts/corpus/generate.ts";

const fixtures = path.resolve(import.meta.dirname, "../fixtures/corpus");

test("normalizes corpus routes and rejects traversal", () => {
  assert.equal(normalizeRoute("/architecture//evidence/"), "/architecture/evidence");
  assert.equal(toPreviewHref("/architecture/evidence"), "/corpus-preview/architecture/evidence");
  assert.throws(() => normalizeRoute("architecture/evidence"), /start with/);
  assert.throws(() => normalizeRoute("/architecture/../canon"), /traverse/);
  assert.throws(() => normalizeRoute("/architecture?draft=1"), /query/);
});

test("uses one deterministic heading contract for generated TOCs and rendered headings", () => {
  const nextHeading = createHeadingIdFactory();
  assert.deepEqual(nextHeading("What is it"), { duplicateExplicitId: false, id: "what-is-it", text: "What is it" });
  assert.deepEqual(nextHeading("What is it"), { duplicateExplicitId: false, id: "what-is-it-1", text: "What is it" });
  assert.deepEqual(nextHeading("8. Improve {#improve}"), { duplicateExplicitId: false, id: "improve", text: "8. Improve" });
  assert.equal(nextHeading("Duplicate {#improve}").duplicateExplicitId, true);
});

test("blocks executable URL schemes and rewrites only declared corpus routes", () => {
  for (const href of ["javascript:alert(1)", " java\nscript:alert(1)", "data:text/html,bad", "vbscript:bad"]) assert.equal(isUnsafeHref(href), true, href);
  const routes = new Set(["/framework", "/architecture/evidence"]);
  assert.equal(rewriteCorpusHref("/architecture/evidence#what-is-it", routes), "/corpus-preview/architecture/evidence#what-is-it");
  assert.equal(rewriteCorpusHref("/start#factory-builder", routes), "/start#factory-builder");
  assert.equal(rewriteCorpusHref("https://example.com", routes), "https://example.com");
});

test("generated corpus contract is closed and collision-aware", () => {
  assert.equal(corpusData.documents.length, 157);
  assert.deepEqual(corpusData.collisions, ["/about", "/architecture", "/benchmarks", "/enterprise", "/framework", "/in-5-minutes", "/mission-control", "/specification", "/start"]);
  assert.equal(new Set(corpusData.documents.map((document) => document.path)).size, corpusData.documents.length);
  assert.equal(corpusData.documents.flatMap((document) => document.links).filter((link) => link.kind === "missing" || link.kind === "unsafe").length, 0);
  assert.ok(corpusData.documents.every((document) => document.previewHref.startsWith("/corpus-preview/")));
  assert.ok(Object.keys(corpusData.rawArtifacts).every((artifact) => !artifact.split("/").includes("..")));
});

test("negative Markdown fixtures fail the same parser and link contract", async () => {
  const duplicateFindings: Finding[] = [];
  parseDocument("corpus/duplicate-anchor.md", await readFile(path.join(fixtures, "duplicate-anchor.md"), "utf8"), duplicateFindings);
  assert.ok(duplicateFindings.some((finding) => finding.check === "anchor" && finding.severity === "error"));

  for (const name of ["missing-link", "unsafe-link"]) {
    const findings: Finding[] = [];
    const document = parseDocument(`corpus/${name}.md`, await readFile(path.join(fixtures, `${name}.md`), "utf8"), findings);
    assert.ok(document);
    classifyLinks([document], new Set(), findings);
    assert.ok(findings.some((finding) => finding.severity === "error"), name);
  }
});

test("negative schema fixture proves example mismatch detection", async () => {
  const findings: Finding[] = [];
  await validateSchemas([
    path.join(fixtures, "schema-mismatch/corpus/specification/schemas/fixture.schema.json"),
    path.join(fixtures, "schema-mismatch/corpus/specification/examples/fixture.example.json"),
  ], findings);
  assert.ok(findings.some((finding) => finding.check === "schema-example" && finding.severity === "error"));
});
