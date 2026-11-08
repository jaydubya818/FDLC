import assert from "node:assert/strict";
import test from "node:test";
import { factoryExplorerCapabilities, factoryExplorerStages } from "../../data/factory-explorer.ts";
import { architectureAreas, canonicalDefinition, categoryComparison, ecosystemRoles, evidencePositioning, factoryControls, guideValueStream, lifecycleStages, manifesto, primaryPositioning, protocolSteps, runtimeLifecycle } from "../../data/fdlc.ts";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example.ts";
import { guideDiscovery } from "../../data/guide-discovery.ts";
import { guideEntryPaths, guideParts, proposedGuideMap } from "../../data/guide.ts";
import { governingLifecycle, governingStageNames, lifecycleViews } from "../../data/governing-lifecycle.ts";
import { statusVocabulary, whatsRealToday } from "../../data/whats-real.ts";
import { artifactChain } from "../../lib/runtime-simulator.ts";

test("keeps the canonical category positioning stable", () => {
  assert.equal(canonicalDefinition, "The Factory Development Lifecycle is the process for designing, assembling, governing, operating, measuring, and continuously improving an AI software factory.");
  assert.equal(primaryPositioning, "Verified delivery, not merely generated code.");
  assert.equal(evidencePositioning, "Autonomy without evidence is just faster guessing.");
  assert.deepEqual(categoryComparison.map((item) => item.name), ["Traditional SDLC", "AI-Native SDLC", "FDLC"]);
});

test("keeps the four canonical system views stable", () => {
  assert.deepEqual(lifecycleStages.map((item) => item.name), ["Discover", "Design", "Assemble", "Validate", "Deploy", "Operate", "Improve"]);
  assert.deepEqual(factoryControls.map((item) => item.name), ["Govern", "Secure", "Observe", "Measure"]);
  assert.deepEqual(governingStageNames, ["Intent", "Planning", "Execution", "Evidence", "Verification", "Approval", "Release", "Outcomes", "Learning"]);
  assert.deepEqual(runtimeLifecycle.map((item) => item.name), governingStageNames);
  assert.deepEqual(architectureAreas.map((item) => item.name), ["Intent", "Harness", "Capability", "Model", "Trust", "Learning"]);
  assert.deepEqual(protocolSteps.map((item) => item.name), ["Intent", "Specification", "Plan", "Work Order", "Attempt", "Evidence", "Verification", "Approval", "Release", "Outcome", "Learning Signal"]);
});

test("keeps the factory explorer complete and internally linked", () => {
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.id), runtimeLifecycle.map((stage) => stage.id));
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.artifact), runtimeLifecycle.map((stage) => stage.artifact));
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
    assert.ok(dependencyModernizationExample.runtimeSteps.some((step) => step.stepId === stage.id), stage.name);
  }

  for (const capability of factoryExplorerCapabilities) {
    assert.match(capability.architectureHref, /^\/architecture#(?:harness|capability|model|trust)$/);
    assert.ok(capability.responsibility.length > 20, capability.name);
  }
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

test("derives every lifecycle surface from the one governing lifecycle", () => {
  const ids = governingLifecycle.map((stage) => stage.id);
  assert.deepEqual(runtimeLifecycle.map((stage) => stage.id), ids);
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.id), ids);
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.name), governingStageNames);
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.number), ids.map((_, index) => index + 1));
  assert.deepEqual(dependencyModernizationExample.runtimeSteps.map((step) => step.stepId), ids);
  // Each of the eleven protocol records belongs to exactly one stage, in protocol order.
  assert.deepEqual(governingLifecycle.flatMap((stage) => stage.records), protocolSteps.map((step) => step.id));
  for (const step of dependencyModernizationExample.runtimeSteps) {
    assert.deepEqual(step.artifacts, governingLifecycle.find((stage) => stage.id === step.stepId)?.records, step.stepId);
  }
});

test("labels Guide links with the Guide stage or chapter they open", () => {
  for (const stage of governingLifecycle) {
    assert.match(stage.guideHref, /^\/guide\//, stage.name);
    assert.match(stage.guideLabel, /^Guide (stage \d+|chapter \d+) · /, stage.name);
    const stageNumber = stage.guideHref.match(/\/stages\/0(\d)-/)?.[1];
    if (stageNumber) {
      assert.ok(stage.guideLabel.startsWith(`Guide stage ${stageNumber} · `), stage.name);
      const guideStage = guideValueStream.find((item) => item.href === stage.guideHref);
      assert.ok(guideStage && stage.guideLabel.endsWith(guideStage.name), `${stage.name} → ${guideStage?.name}`);
    }
  }
});

test("labels each simulator step with a governing stage, in lifecycle order", () => {
  const order = governingLifecycle.map((stage) => stage.id);
  let previous = -1;
  for (const step of artifactChain) {
    const index = order.indexOf(step.stage);
    assert.ok(index >= 0, step.id);
    assert.ok(index >= previous, `${step.id} moves backwards in the governing lifecycle`);
    previous = index;
  }
});

test("explains how every other view relates to the governing lifecycle", () => {
  assert.equal(lifecycleViews[0].name, "Governing lifecycle");
  for (const name of ["Factory lifecycle", "Artifact protocol", "Enterprise delivery flow", "Guide value stream", "Simulator walkthrough"]) {
    assert.ok(lifecycleViews.some((view) => view.name === name), name);
  }
});

test("uses one public status vocabulary", () => {
  for (const item of whatsRealToday) assert.ok((statusVocabulary as readonly string[]).includes(item.status), item.name);
  assert.equal(whatsRealToday.find((item) => item.name === "Mission Control")?.kind, "Optional reference implementation");
});
