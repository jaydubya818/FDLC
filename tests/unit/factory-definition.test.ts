import assert from "node:assert/strict";
import test from "node:test";
import { factoryFormErrors, formatFactoryDefinitionMarkdown, generateFactoryDefinition, splitLines } from "../../lib/factory-definition.ts";

const completeForm = {
  workType: "API migration",
  outcome: "Replace every deprecated payments client call without changing public behavior.",
  criteria: "All contract tests pass\n- No deprecated imports remain",
  authority: ["Repository read", "Code modification", "Test execution"],
  verification: ["Tests", "Type checking"],
  humanControls: ["Plan approval", "Merge"],
};

test("normalizes one acceptance criterion per line", () => {
  assert.deepEqual(splitLines("- One\n* Two\n\nThree"), ["One", "Two", "Three"]);
});

test("generates a bounded conceptual factory definition", () => {
  const definition = generateFactoryDefinition(completeForm);
  assert.equal(definition.version, "0.1-draft");
  assert.equal(definition.intent.workType, "API migration");
  assert.equal(definition.acceptanceCriteria.length, 2);
  assert.equal(definition.candidateWorkOrders.length, 3);
  assert.ok(definition.requiredCapabilities.includes("Independent verification"));
  assert.deepEqual(factoryFormErrors(completeForm), []);
});

test("exports a reusable Markdown artifact with its status boundary", () => {
  const markdown = formatFactoryDefinitionMarkdown(generateFactoryDefinition(completeForm));
  assert.match(markdown, /^# Factory Definition: API migration/m);
  assert.match(markdown, /## Acceptance criteria\n\n- All contract tests pass/);
  assert.match(markdown, /## Candidate Work Orders\n\n- \*\*Map deprecated API usage:/);
  assert.match(markdown, /not an executable Mission Control manifest/);
});

test("requires all five teaching boundaries", () => {
  const errors = factoryFormErrors({ workType: "", outcome: "", criteria: "", authority: [], verification: [], humanControls: [] });
  assert.equal(errors.length, 6);
});
