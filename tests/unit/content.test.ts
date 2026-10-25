import assert from "node:assert/strict";
import test from "node:test";
import { factoryExplorerCapabilities, factoryExplorerStages } from "../../data/factory-explorer.ts";
import { governingLifecycle, guideStageBridge } from "../../data/governing-lifecycle.ts";
import { architectureAreas, canonicalDefinition, categoryComparison, ecosystemRoles, evidencePositioning, factoryControls, guideValueStream, lifecycleStages, manifesto, primaryPositioning, protocolSteps, runtimeLifecycle } from "../../data/fdlc.ts";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example.ts";
import { guideDiscovery } from "../../data/guide-discovery.ts";
import { guideEntryPaths, guideParts, proposedGuideMap } from "../../data/guide.ts";

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

test("keeps the factory explorer complete and internally linked", () => {
  // The explorer teaches the same nine stages, in the same order, as the governing lifecycle.
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.name), governingLifecycle.map((stage) => stage.name));
  // Every runtime step is covered, in order, by the governing stages.
  assert.deepEqual([...new Set(factoryExplorerStages.flatMap((stage) => stage.runtimeSteps))], runtimeLifecycle.map((stage) => stage.id));
  // Every protocol artifact in the worked example appears exactly once, in order.
  assert.deepEqual(factoryExplorerStages.flatMap((stage) => stage.exampleArtifacts), dependencyModernizationExample.artifacts.map((artifact) => artifact.protocolId));
  assert.equal(factoryExplorerCapabilities.length, 10);

  const capabilityIds = new Set(factoryExplorerCapabilities.map((capability) => capability.id));
  const usedCapabilityIds = new Set(factoryExplorerStages.flatMap((stage) => stage.capabilities));
  assert.deepEqual(usedCapabilityIds, capabilityIds);

  for (const stage of factoryExplorerStages) {
    assert.ok(stage.capabilities.length > 0, stage.name);
    assert.ok(stage.capabilities.some((capabilityId) => capabilityId === stage.focusCapability), stage.name);
    assert.ok(stage.question.endsWith("?"), stage.name);
    assert.ok(stage.proof.length > 20, stage.name);
    assert.match(stage.guideHref, /^\/guide\//, stage.name);
    for (const stepId of stage.runtimeSteps) assert.ok(dependencyModernizationExample.runtimeSteps.some((step) => step.stepId === stepId), stage.name);
    assert.ok(stage.exampleAction.length > 20, stage.name);
  }

  for (const capability of factoryExplorerCapabilities) {
    assert.match(capability.architectureHref, /^\/architecture#(?:harness|capability|model|trust)$/);
    assert.ok(capability.responsibility.length > 20, capability.name);
  }
});

test("maps the Guide's eight stages onto the nine governing stages", () => {
  assert.deepEqual(guideStageBridge.flatMap((row) => row.governing), governingLifecycle.map((stage) => stage.name));
  const bridged = guideStageBridge.flatMap((row) => row.guide.map(([name, href]) => [name, href]));
  assert.deepEqual(new Set(bridged.map(([name]) => name)), new Set(guideValueStream.map((stage) => stage.name)));
  for (const [name, href] of bridged) assert.equal(href, guideValueStream.find((stage) => stage.name === name)?.href, name);
});

test("keeps ecosystem roles and status boundaries stable", () => {
  assert.deepEqual(ecosystemRoles.map((item) => item.role), ["Defines it.", "Demonstrates it.", "Teaches it.", "Discovers and designs it.", "Industrializes it."]);
  assert.equal(ecosystemRoles.at(-1)?.status, "Proposed");
});

test("preserves the manifesto and complete guide map", () => {
  assert.equal(manifesto.length, 10);
  assert.equal(guideParts.length, 6);
  assert.equal(guideParts.reduce((count, part) => count + part.chapters.length, 0), 44);
  assert.equal(guideValueStream.length, 8);
  assert.equal(guideEntryPaths.length, 6);
  assert.equal(proposedGuideMap.length, 25);
  const mapHrefs = new Set(proposedGuideMap.map(([, href]) => href));
  for (const [page, links] of Object.entries(guideDiscovery)) {
    assert.equal(links.length, 3, page);
    for (const [, href] of links) assert.ok(href.startsWith("/guide/") && mapHrefs.has(href), `${page} ${href}`);
  }
});

test("maps the worked example to every canonical model", () => {
  assert.deepEqual(dependencyModernizationExample.factoryStages.map((item) => item.stageId), lifecycleStages.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.runtimeSteps.map((item) => item.stepId), runtimeLifecycle.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.architecture.map((item) => item.areaId), architectureAreas.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.artifacts.map((item) => item.protocolId), protocolSteps.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.baselineMetrics.map(([name]) => name), ["Cycle time", "Human review minutes", "Reopen / rollback risk", "Escaped defect potential"]);
  assert.deepEqual(dependencyModernizationExample.outcomeMetrics.map(([name]) => name), ["Verified completion rate", "Cost per verified outcome", "Human review minutes", "Cycle time", "First-pass verification rate", "Reopen / rollback rate"]);
});
