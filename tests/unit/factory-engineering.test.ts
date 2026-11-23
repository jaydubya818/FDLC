import assert from "node:assert/strict";
import test from "node:test";
import {
  factoryEngineeringDebate,
  factoryEngineeringPageSources,
  factoryStackLayers,
  factoryTaxonomyTerms,
  measureImproveTools,
  mergeRiskCriteria,
  publicNumbersNotes,
  rolloutTactics,
  verificationPractice,
  type PracticeSource,
} from "../../data/factory-engineering.ts";
import { antiMetrics, publicNumbersCaution } from "../../data/software-factory-engineering.ts";
import { twoJobsFraming } from "../../data/homepage.ts";

function assertSources(sources: readonly PracticeSource[], subject: string) {
  assert.ok(sources.length > 0, `missing source for ${subject}`);
  const urls = new Set<string>();
  for (const { label, url } of sources) {
    assert.ok(label.trim() && !label.startsWith("https://"), `missing source title for ${subject}`);
    assert.equal(new URL(url).protocol, "https:", subject);
    assert.ok(!urls.has(url), `duplicate source for ${subject}`);
    urls.add(url);
  }
}

test("twoJobsFraming has the required fields and attributed sources", () => {
  assert.ok(twoJobsFraming.headline.length > 0, "headline is non-empty");
  assert.ok(twoJobsFraming.productEngineering.name.length > 0);
  assert.ok(twoJobsFraming.productEngineering.definition.length > 0);
  assert.ok(twoJobsFraming.factoryEngineering.name.length > 0);
  assert.ok(twoJobsFraming.factoryEngineering.definition.length > 0);
  assert.ok(twoJobsFraming.fdlcPosition.length > 0);
  assert.ok(twoJobsFraming.discipline.length > 0);
  assert.ok(twoJobsFraming.governanceNote.length > 0);
  assert.ok(twoJobsFraming.attribution.sources.length >= 2, "at least two attribution sources");
  for (const s of twoJobsFraming.attribution.sources) {
    assert.match(s.url, /^https:\/\//, `source URL must be https: ${s.url}`);
    assert.ok(s.label.length > 0);
  }
});

test("factoryStackLayers has seven layers, each with number, name, description, FDLC mapping, and linked sources", () => {
  assert.equal(factoryStackLayers.length, 7, "should have exactly 7 layers");
  const numbers = new Set<string>();
  for (const layer of factoryStackLayers) {
    assert.ok(layer.number.length > 0, "number is non-empty");
    assert.ok(!numbers.has(layer.number), `duplicate layer number ${layer.number}`);
    numbers.add(layer.number);
    assert.ok(layer.name.length > 0, "name is non-empty");
    assert.ok(layer.description.length > 20, `description too short for ${layer.name}`);
    assert.ok(layer.fdlcMapping.length > 10, `fdlcMapping too short for ${layer.name}`);
    assert.ok(layer.question.endsWith("?"), layer.name);
    assertSources(layer.sources, layer.name);
  }
});

test("measureImproveTools has five tools, each with FDLC guardrail and source URL", () => {
  assert.equal(measureImproveTools.length, 5, "should have exactly 5 tools");
  const numbers = new Set<string>();
  for (const tool of measureImproveTools) {
    assert.ok(!numbers.has(tool.number), `duplicate tool number ${tool.number}`);
    numbers.add(tool.number);
    assert.ok(tool.name.length > 0);
    assert.ok(tool.description.length > 20, `description too short for ${tool.name}`);
    assert.ok(tool.fdlcGuardrail.length > 10, `fdlcGuardrail too short for ${tool.name}`);
    assert.ok(tool.question.endsWith("?"), tool.name);
    assertSources(tool.sources, tool.name);
  }
});

test("mergeRiskCriteria has five criteria, each mapped to an FDLC stage", () => {
  assert.equal(mergeRiskCriteria.length, 5, "should have exactly 5 criteria");
  const names = new Set<string>();
  for (const criterion of mergeRiskCriteria) {
    assert.ok(!names.has(criterion.name), `duplicate criterion name ${criterion.name}`);
    names.add(criterion.name);
    assert.ok(criterion.description.length > 20, `description too short for ${criterion.name}`);
    assert.ok(criterion.fdlcMapping.length > 10, `fdlcMapping too short for ${criterion.name}`);
  }
});

test("verificationPractice has evidence artifacts, review-agent loop, and contested practice note", () => {
  assert.ok(verificationPractice.headline.length > 0);
  assert.ok(verificationPractice.coreNote.length > 0);
  assert.ok(verificationPractice.evidenceArtifacts.description.length > 20);
  assert.ok(verificationPractice.evidenceArtifacts.fdlcNote.length > 0);
  assertSources(verificationPractice.evidenceArtifacts.sources, "evidence artifacts");
  assert.ok(verificationPractice.reviewAgentLoop.description.length > 20);
  assert.ok(verificationPractice.reviewAgentLoop.fdlcNote.length > 0);
  assert.ok(verificationPractice.reviewAgentLoop.contestedPractice.length > 20, "must include contested practice note");
  assertSources(verificationPractice.reviewAgentLoop.sources, "review-agent loop");
});

test("rolloutTactics has at least eight tactics, each numbered and sourced", () => {
  assert.ok(rolloutTactics.length >= 8, `expected at least 8 tactics, got ${rolloutTactics.length}`);
  const numbers = new Set<string>();
  for (const tactic of rolloutTactics) {
    assert.ok(!numbers.has(tactic.number), `duplicate tactic number ${tactic.number}`);
    numbers.add(tactic.number);
    assert.ok(tactic.name.length > 0);
    assert.ok(tactic.description.length > 20, `description too short for ${tactic.name}`);
    assertSources(tactic.sources ?? [], tactic.name);
  }
});

test("factoryTaxonomyTerms has at least eight terms, each with a definition", () => {
  assert.ok(factoryTaxonomyTerms.length >= 8, `expected at least 8 terms, got ${factoryTaxonomyTerms.length}`);
  const terms = new Set<string>();
  for (const entry of factoryTaxonomyTerms) {
    assert.ok(!terms.has(entry.term), `duplicate term ${entry.term}`);
    terms.add(entry.term);
    assert.ok(entry.definition.length > 20, `definition too short for '${entry.term}'`);
    assertSources(entry.sources ?? [], entry.term);
  }
  const termNames = [...terms];
  assert.ok(termNames.some((t) => t.toLowerCase().includes("software factory")), "should include 'software factory' term");
  assert.ok(termNames.some((t) => t.toLowerCase().includes("hermetic")), "should include 'hermetic replay' term");
});

test("publicNumbersNotes has cases with figures, lesson, source, and fdlcPrinciple", () => {
  assert.ok(publicNumbersNotes.headline.length > 0);
  assert.ok(publicNumbersNotes.instruction.length > 0);
  assert.ok(publicNumbersNotes.cases.length >= 2, "at least two company cases");
  for (const c of publicNumbersNotes.cases) {
    assert.ok(c.company.length > 0);
    assert.ok(c.figures.length >= 1, `${c.company} should have at least one figure`);
    assert.ok(c.lesson.length > 0);
    assertSources(c.sources, c.company);
  }
  assert.ok(publicNumbersNotes.fdlcPrinciple.length > 0);
});

test("factoryEngineeringPageSources has unique https URLs with labels", () => {
  const urls = new Set<string>();
  for (const s of factoryEngineeringPageSources) {
    assert.ok(s.label.length > 0);
    assert.match(s.url, /^https:\/\//, `source URL must be https: ${s.url}`);
    assert.ok(!urls.has(s.url), `duplicate source URL ${s.url}`);
    urls.add(s.url);
  }
  assert.ok(factoryEngineeringPageSources.length >= 8, "at least 8 sources");
});

test("factoryEngineeringDebate has counterpoint, support, and fdlcPosition", () => {
  assert.ok(factoryEngineeringDebate.headline.length > 0);
  assert.ok(factoryEngineeringDebate.counterpoint.length > 20);
  assert.ok(factoryEngineeringDebate.support.length > 20);
  assert.ok(factoryEngineeringDebate.fdlcPosition.length > 20);
  assertSources([factoryEngineeringDebate.counterpointSource, factoryEngineeringDebate.supportSource], "operator perspectives");
});

test("antiMetrics has good and bad lists plus a note", () => {
  assert.ok(antiMetrics.bad.length >= 3);
  assert.ok(antiMetrics.good.length >= 3);
  assert.ok(antiMetrics.note.length > 0);
  assert.ok(antiMetrics.openQuestion.length > 0);
  assert.match(antiMetrics.source, /https:\/\//);
});

test("publicNumbersCaution has adversarial review, open weights, and uber figures with sources", () => {
  assert.ok(publicNumbersCaution.warpAdversarialReview.length > 20);
  assert.match(publicNumbersCaution.warpAdversarialReview, /https:\/\//);
  assert.ok(publicNumbersCaution.warpOpenWeights.length > 20);
  assert.match(publicNumbersCaution.warpOpenWeights, /https:\/\//);
  assert.ok(publicNumbersCaution.uberCounting.length > 20);
  assert.match(publicNumbersCaution.uberCounting, /https:\/\//);
  assert.ok(publicNumbersCaution.fdlcPrinciple.length > 20);
});
