import assert from "node:assert/strict";
import test from "node:test";
import { maturityDimensions } from "../../data/fdlc.ts";
import { assessmentIsComplete, scoreMaturity } from "../../lib/maturity.ts";

test("scores an all-level-four factory as Level 4", () => {
  const answers = Object.fromEntries(maturityDimensions.map((dimension) => [dimension.id, 4]));
  const result = scoreMaturity(answers);
  assert.equal(result.score, 4);
  assert.equal(result.level.name, "Verified Factory Lines");
  assert.equal(result.answered, maturityDimensions.length);
  assert.equal(assessmentIsComplete(answers), true);
});

test("rounds down and identifies the lowest-scoring gaps", () => {
  const answers = Object.fromEntries(maturityDimensions.map((dimension) => [dimension.id, 3]));
  answers.intent = 5;
  answers.verification = 1;
  answers.security = 2;
  const result = scoreMaturity(answers);
  assert.equal(result.score, 2);
  assert.deepEqual(result.gaps.slice(0, 2), ["Verification", "Security"]);
  assert.ok(result.strengths.includes("Intent"));
});

test("does not treat a partial assessment as complete", () => {
  assert.equal(assessmentIsComplete({ intent: 3 }), false);
  assert.equal(scoreMaturity({ intent: 3 }).answered, 1);
});

