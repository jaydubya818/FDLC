import assert from "node:assert/strict";
import test from "node:test";
import { architectureAreas, canonicalDefinition, categoryComparison, ecosystemRoles, evidencePositioning, factoryControls, lifecycleStages, manifesto, primaryPositioning, protocolSteps, runtimeLifecycle } from "../../data/fdlc.ts";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example.ts";
import { guideEntryPaths, guideParts, guideStages, proposedGuideMap } from "../../data/guide.ts";

test("keeps the canonical category positioning stable", () => {
  assert.equal(canonicalDefinition, "The Factory Development Lifecycle is the process for designing, assembling, governing, operating, measuring, and continuously improving an AI software factory.");
  assert.equal(primaryPositioning, "Verified delivery, not merely generated code.");
  assert.equal(evidencePositioning, "Autonomy without evidence is just faster guessing.");
  assert.deepEqual(categoryComparison.map((item) => item.name), ["Traditional SDLC", "AI-Native SDLC", "FDLC"]);
});

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
  assert.equal(guideParts.reduce((count, part) => count + part.chapters.length, 0), 44);
  assert.equal(guideStages.length, 8);
  assert.equal(guideEntryPaths.length, 6);
  assert.equal(proposedGuideMap.length, 25);
});

test("maps the worked example to every canonical model", () => {
  assert.deepEqual(dependencyModernizationExample.factoryStages.map((item) => item.stageId), lifecycleStages.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.runtimeSteps.map((item) => item.stepId), runtimeLifecycle.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.architecture.map((item) => item.areaId), architectureAreas.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.artifacts.map((item) => item.protocolId), protocolSteps.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.baselineMetrics.map(([name]) => name), ["Cycle time", "Human review minutes", "Reopen / rollback risk", "Escaped defect potential"]);
  assert.deepEqual(dependencyModernizationExample.outcomeMetrics.map(([name]) => name), ["Verified completion rate", "Cost per verified outcome", "Human review minutes", "Cycle time", "First-pass verification rate", "Reopen / rollback rate"]);
});
