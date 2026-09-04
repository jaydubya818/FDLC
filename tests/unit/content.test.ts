import assert from "node:assert/strict";
import test from "node:test";
import { factoryExplorerCapabilities, factoryExplorerStages } from "../../data/factory-explorer.ts";
import { architectureAreas, canonicalDefinition, categoryComparison, categoryTransitions, ecosystemRoles, evidencePositioning, factoryControls, guideValueStream, lifecycleStages, manifesto, officialLongDescription, primaryPositioning, protocolSteps, publicExecutionStages } from "../../data/fdlc.ts";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example.ts";
import { guideEntryPaths, guideParts, guideRoot, proposedGuideMap } from "../../data/guide.ts";

test("keeps the canonical category positioning stable", () => {
  assert.equal(canonicalDefinition, "FDLC is the Factory Development Lifecycle—the open operating model, engineering framework, and reference architecture for designing, building, governing, operating, measuring, and continuously improving AI software factories.");
  assert.equal(officialLongDescription, "FDLC.ai is an open framework, reference architecture, and enterprise platform for designing, governing, and operating AI software factories that deliver trusted autonomy at enterprise scale. It establishes the Factory Development Lifecycle as the end-to-end operating model, engineering discipline, and technical architecture for autonomous software delivery. FDLC defines how organizations design, assemble, orchestrate, operate, govern, verify, measure, and continuously improve the agents, models, skills, tools, context, workflows, execution environments, policies, and human decision points that transform business and engineering intent into secure, independently verified, production-ready software. Mission Control provides the open-source reference implementation, the AI Software Factory Guide defines the methodology, forward-deployed engineering converts real customer challenges into reusable factory capabilities, and the commercial control plane enables organizations to scale autonomous software delivery across teams, repositories, and delivery pipelines—without sacrificing quality, security, accountability, or human oversight.");
  assert.equal(primaryPositioning, "Verified delivery, not merely generated code.");
  assert.equal(evidencePositioning, "Autonomy without evidence is just faster guessing.");
  assert.deepEqual(categoryComparison.map((item) => item.name), ["Traditional SDLC", "AI-Native SDLC", "AI Software Factory", "FDLC"]);
  assert.deepEqual(categoryTransitions.map((item) => `${item.from} → ${item.to}`), ["SDLC → AI-Native SDLC", "AI-Native SDLC → AI Software Factory", "AI Software Factory → FDLC"]);
});

test("keeps the three abstraction levels and structural views distinct", () => {
  assert.deepEqual(lifecycleStages.map((item) => item.name), ["Discover", "Design", "Assemble", "Validate", "Deploy", "Operate", "Improve"]);
  assert.deepEqual(guideValueStream.map((item) => item.name), ["Intent", "Plan", "Define Agent", "Execute through Harness", "Apply Skills", "Evaluate", "Improve", "Deliver Software"]);
  assert.deepEqual(publicExecutionStages.map((item) => item.name), ["Intent", "Plan", "Execute", "Prove", "Release", "Learn"]);
  assert.deepEqual(factoryControls.map((item) => item.name), ["Governance", "Security", "Observability", "Measurement", "Human Authority"]);
  assert.deepEqual(architectureAreas.map((item) => item.name), ["Intent", "Harness", "Capability", "Model", "Trust", "Learning"]);
  assert.deepEqual(protocolSteps.map((item) => item.name), ["Intent", "Specification", "Plan", "Work Order", "Attempt", "Evidence", "Verification", "Approval", "Release", "Outcome", "Learning"]);
});

test("keeps the homepage factory explorer complete and internally linked", () => {
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.id), publicExecutionStages.map((stage) => stage.id));
  assert.deepEqual(factoryExplorerStages.map((stage) => stage.artifact), publicExecutionStages.map((stage) => stage.artifact));
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
    assert.doesNotMatch(stage.guideHref, /\/docs\//, stage.name);
    assert.ok(dependencyModernizationExample.runtimeSteps.some((step) => step.stepId === stage.id), stage.name);
  }

  for (const capability of factoryExplorerCapabilities) {
    assert.match(capability.architectureHref, /^\/architecture#(?:harness|capability|model|trust)$/);
    assert.ok(capability.responsibility.length > 20, capability.name);
  }
});

test("keeps ecosystem roles and status boundaries stable", () => {
  assert.deepEqual(ecosystemRoles.map((item) => item.role), ["Defines it.", "Demonstrates it.", "Teaches it.", "Implements it.", "Industrializes it."]);
  assert.equal(ecosystemRoles.at(-1)?.status, "Proposed");
});

test("preserves the manifesto and complete guide map", () => {
  assert.equal(manifesto.length, 10);
  assert.equal(guideParts.length, 6);
  assert.equal(guideParts.reduce((count, part) => count + part.chapters.length, 0), 44);
  assert.equal(guideValueStream.length, 8);
  assert.equal(guideEntryPaths.length, 6);
  assert.equal(proposedGuideMap.length, 25);
  assert.equal(guideRoot, "/guide");
  const guideHrefs = [
    ...guideParts.flatMap((part) => [part.startHref, ...part.chapters.map((chapter) => chapter[3])]),
    ...guideValueStream.map((stage) => stage.href),
    ...guideEntryPaths.flatMap((path) => path.links.map((link) => link[1])),
    ...proposedGuideMap.map((entry) => entry[1]),
  ].filter((href) => href.startsWith("/guide"));
  assert.ok(guideHrefs.length > 50);
  for (const href of guideHrefs) {
    assert.match(href, /^\/guide(?:[/#]|$)/);
    assert.doesNotMatch(href, /\/docs(?:[/#]|$)/);
  }
});

test("maps the worked example to every canonical model", () => {
  assert.deepEqual(dependencyModernizationExample.factoryStages.map((item) => item.stageId), lifecycleStages.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.runtimeSteps.map((item) => item.stepId), publicExecutionStages.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.architecture.map((item) => item.areaId), architectureAreas.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.artifacts.map((item) => item.protocolId), protocolSteps.map((item) => item.id));
  assert.deepEqual(dependencyModernizationExample.baselineMetrics.map(([name]) => name), ["Cycle time", "Human review minutes", "Reopen / rollback risk", "Escaped defect potential"]);
  assert.deepEqual(dependencyModernizationExample.outcomeMetrics.map(([name]) => name), ["Verified completion rate", "Cost per verified outcome", "Human review minutes", "Cycle time", "First-pass verification rate", "Reopen / rollback rate"]);
});
