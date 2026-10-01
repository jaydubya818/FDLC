import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { generateFactoryDefinition } from "../../lib/factory-definition.ts";
import {
  definitionToForm,
  exampleFactoryForm,
  factoryDefinitionV2Errors,
  formatFactoryDefinitionV2Json,
  formatFactoryDefinitionV2Yaml,
  generateFactoryDefinitionV2,
  parseFactoryDefinition,
  upgradeFactoryDefinition,
} from "../../lib/factory-definition-v2.ts";

const workTypes = ["Dependency upgrade", "Vulnerability remediation", "Test repair", "API migration", "Feature implementation", "Documentation update"];

test("every work type produces a valid, distinct v0.2 definition", () => {
  const scopes = new Set<string>();
  for (const workType of workTypes) {
    const definition = generateFactoryDefinitionV2({ ...exampleFactoryForm, workType });
    assert.deepEqual(factoryDefinitionV2Errors(definition), [], workType);
    assert.ok(definition.knownFailureModes.length >= 3, `${workType} lists failure modes`);
    scopes.add(JSON.stringify(definition.workOrders[0].scope));
  }
  assert.ok(scopes.size >= 4, "work types get different path scopes");
});

test("work orders are chained and the final one cannot modify code", () => {
  const definition = generateFactoryDefinitionV2(exampleFactoryForm);
  assert.deepEqual(definition.workOrders.map((item) => item.dependsOn), [[], ["WO-1"], ["WO-2"]]);
  const last = definition.workOrders.at(-1)!;
  assert.deepEqual(last.scope, []);
  assert.ok(!last.authority.includes("Code modification"));
});

test("every criterion has an id and a verifier; verification is independent", () => {
  const definition = generateFactoryDefinitionV2(exampleFactoryForm);
  assert.deepEqual(definition.acceptanceCriteria.map((item) => item.id), ["AC-1", "AC-2", "AC-3"]);
  assert.ok(definition.acceptanceCriteria.every((item) => item.verifier));
  assert.ok(definition.verification.every((item) => item.independent));
});

test("JSON and YAML export round-trip through the parser", () => {
  const definition = generateFactoryDefinitionV2(exampleFactoryForm);
  for (const text of [formatFactoryDefinitionV2Json(definition), formatFactoryDefinitionV2Yaml(definition)]) {
    const parsed = parseFactoryDefinition(text);
    assert.ok(parsed.ok);
    if (parsed.ok) assert.deepEqual(parsed.definition, definition);
  }
});

test("a v0.1 definition upgrades on import", () => {
  const v1 = generateFactoryDefinition(exampleFactoryForm);
  const parsed = parseFactoryDefinition(JSON.stringify(v1));
  assert.ok(parsed.ok);
  if (parsed.ok) {
    assert.equal(parsed.upgradedFrom, "0.1-draft");
    assert.deepEqual(parsed.definition, upgradeFactoryDefinition(v1));
  }
});

test("import then edit then export preserves the builder fields", () => {
  const definition = generateFactoryDefinitionV2(exampleFactoryForm);
  const form = definitionToForm(definition);
  assert.deepEqual(form, exampleFactoryForm);
  assert.deepEqual(generateFactoryDefinitionV2(form), definition);
});

test("rejects malformed input with readable errors", () => {
  assert.equal(parseFactoryDefinition("{ not json").ok, false);
  assert.equal(parseFactoryDefinition("42").ok, false);
  const broken = generateFactoryDefinitionV2(exampleFactoryForm);
  broken.workOrders[1].dependsOn = ["WO-99"];
  const parsed = parseFactoryDefinition(JSON.stringify(broken));
  assert.equal(parsed.ok, false);
  if (!parsed.ok) assert.match(parsed.errors.join(" "), /unknown work order WO-99/);
  broken.workOrders[1].dependsOn = ["WO-1"];
  broken.acceptanceCriteria[1].id = "AC-1";
  assert.match(factoryDefinitionV2Errors(broken).join(" "), /unique/);
});

test("the published JSON Schema requires the same top-level keys as the validator", () => {
  const schema = JSON.parse(readFileSync(new URL("../../public/schemas/factory-definition-0.2.json", import.meta.url), "utf8"));
  const definition = generateFactoryDefinitionV2(exampleFactoryForm);
  assert.equal(schema.$id, definition.$schema);
  assert.deepEqual([...schema.required].sort(), Object.keys(definition).sort());
  assert.equal(schema.properties.version.const, "0.2-draft");
});
