import assert from "node:assert/strict";
import test from "node:test";
import { architectureAreas, lifecycleStages, manifesto, protocolSteps } from "../../data/fdlc.ts";
import { guideParts } from "../../data/guide.ts";

test("keeps the three canonical models stable", () => {
  assert.deepEqual(lifecycleStages.map((item) => item.name), ["Discover", "Design", "Assemble", "Govern", "Operate", "Verify", "Release", "Learn & Scale"]);
  assert.deepEqual(architectureAreas.map((item) => item.name), ["Intent", "Harness", "Capability", "Model", "Trust", "Learning"]);
  assert.deepEqual(protocolSteps.map((item) => item.name), ["Goal", "Plan", "Work Order", "Attempt", "Evidence", "Verification", "Approval", "Release", "Outcome"]);
});

test("preserves the manifesto and complete guide map", () => {
  assert.equal(manifesto.length, 10);
  assert.equal(guideParts.length, 6);
  assert.equal(guideParts.reduce((count, part) => count + part.chapters.length, 0), 36);
});
