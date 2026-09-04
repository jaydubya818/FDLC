import assert from "node:assert/strict";
import test from "node:test";
import { architectureAreas, ecosystemRoles, factoryControls, lifecycleStages, manifesto, protocolSteps, runtimeLifecycle } from "../../data/fdlc.ts";
import { guideParts } from "../../data/guide.ts";

test("keeps the four canonical system views stable", () => {
  assert.deepEqual(lifecycleStages.map((item) => item.name), ["Discover", "Design", "Assemble", "Validate", "Deploy", "Operate", "Improve"]);
  assert.deepEqual(factoryControls.map((item) => item.name), ["Govern", "Secure", "Observe", "Measure"]);
  assert.deepEqual(runtimeLifecycle.map((item) => item.name), ["Receive", "Specify", "Plan", "Execute", "Verify", "Approve", "Release", "Observe", "Learn"]);
  assert.deepEqual(architectureAreas.map((item) => item.name), ["Intent", "Harness", "Capability", "Model", "Trust", "Learning"]);
  assert.deepEqual(protocolSteps.map((item) => item.name), ["Intent", "Specification", "Plan", "Work Order", "Attempt", "Evidence", "Verification", "Approval", "Release", "Outcome", "Learning Signal"]);
});

test("keeps ecosystem roles and status boundaries stable", () => {
  assert.deepEqual(ecosystemRoles.map((item) => item.role), ["Defines it.", "Demonstrates it.", "Teaches it.", "Implements it.", "Industrializes it."]);
  assert.equal(ecosystemRoles.at(-1)?.status, "Proposed");
});

test("preserves the manifesto and complete guide map", () => {
  assert.equal(manifesto.length, 10);
  assert.equal(guideParts.length, 6);
  assert.equal(guideParts.reduce((count, part) => count + part.chapters.length, 0), 36);
});
