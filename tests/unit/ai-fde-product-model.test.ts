import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  factoryDefinitionConcerns,
  factoryDefinitionStatuses,
  missionControlHandoffBoundary,
  type FactoryDefinition,
  type MissionControlHandoff,
} from "../../data/ai-fde.ts";

test("Factory Definition is versioned governed intent, not a Factory Version", () => {
  assert.deepEqual(factoryDefinitionStatuses, ["draft", "in_review", "approved", "rejected", "stale"]);
  assert.equal(new Set(factoryDefinitionConcerns.map(({ id }) => id)).size, factoryDefinitionConcerns.length);
  assert.ok(factoryDefinitionConcerns.some(({ id }) => id === "lineage"));
  assert.ok(factoryDefinitionConcerns.some(({ id }) => id === "authority"));
  assert.ok(factoryDefinitionConcerns.some(({ id }) => id === "readiness"));
  assert.ok(missionControlHandoffBoundary.aiFdeMayNot.includes("create a Factory Version"));
  assert.ok(missionControlHandoffBoundary.missionControlOwns.includes("Factory Version qualification"));
});

test("Mission Control handoff binds one approved Factory Definition revision", () => {
  const definition: FactoryDefinition = {
    schema: "fdlc.factory-definition/v1",
    definitionId: "fd_demo",
    version: 3,
    status: "approved",
    engagementId: "eng_demo",
    sourceRevision: "evidence-set-4",
    contentDigest: "sha256:definition",
    approvedAt: "2026-09-14T18:00:00Z",
    approvedBy: "human:factory-deployed-engineer",
    concerns: factoryDefinitionConcerns,
    unresolvedClaimIds: [],
  };
  const handoff: MissionControlHandoff = {
    schema: "fdlc.ai-fde.mission-control-handoff/v1",
    handoffId: "handoff_demo",
    factoryDefinition: definition,
    qualificationMaterialDigest: "sha256:material",
    requestedEnvironment: "qualification",
    requestedAction: "validate_factory_definition",
    requestedAt: "2026-09-14T18:01:00Z",
  };

  assert.equal(handoff.factoryDefinition.contentDigest, definition.contentDigest);
  assert.equal(handoff.requestedEnvironment, "qualification");
  assert.equal(handoff.requestedAction, "validate_factory_definition");
});

test("AI-FDE cockpit links use the canonical FDLC Guide, not the retired Guide host", () => {
  const source = readFileSync("products/ai-fde/apps/web/lib/product.ts", "utf8");
  assert.match(source, /href: "https:\/\/fdlc\.ai\/guide"/);
  assert.match(source, /const GUIDE_BASE_URL = "https:\/\/fdlc\.ai"/);
  assert.doesNotMatch(source, /ai-software-factory-mastery\.vercel\.app/);
  assert.doesNotMatch(source, /path: "\/docs\//);
});
