import assert from "node:assert/strict";
import test from "node:test";

import { corpusJourneys } from "../../lib/corpus-journeys.ts";

test("curated corpus journeys resolve to distinct manifest-backed documents", () => {
  assert.equal(corpusJourneys.length, 4);
  assert.deepEqual(corpusJourneys.map((journey) => journey.id), ["understand", "build", "design", "adopt"]);
  assert.ok(corpusJourneys.every((journey) => journey.documents.length >= 3));
  assert.ok(corpusJourneys.every((journey) => journey.readingMinutes > 0));

  const routes = corpusJourneys.flatMap((journey) => journey.documents.map((document) => document.path));
  assert.equal(new Set(routes).size, routes.length);
  assert.ok(corpusJourneys.every((journey) => journey.documents.every((document) => document.previewHref === `/corpus-preview${document.path}`)));
});
