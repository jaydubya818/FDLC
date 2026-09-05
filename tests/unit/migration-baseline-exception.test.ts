import assert from "node:assert/strict";
import test from "node:test";
import { approvedBaselineFailure, BASELINE_EXCEPTION, OLD_GUIDE_DEPLOYMENT, validateBaselineException } from "../../lib/migration-baseline-exception.ts";

test("baseline exception requires explicit approval identifier, old edition and exact old deployment", () => {
  assert.equal(validateBaselineException(undefined, "new", "anything"), false);
  assert.equal(validateBaselineException(BASELINE_EXCEPTION, "old", OLD_GUIDE_DEPLOYMENT), true);
  assert.throws(() => validateBaselineException(BASELINE_EXCEPTION, "new", OLD_GUIDE_DEPLOYMENT));
  assert.throws(() => validateBaselineException(BASELINE_EXCEPTION, "old", "dpl_other"));
  assert.throws(() => validateBaselineException("ignore-all", "old", OLD_GUIDE_DEPLOYMENT));
});

test("duplicate-ID exception matches only exact old changelog counts", () => {
  const name = "/docs/appendix/changelog duplicate IDs";
  assert.equal(approvedBaselineFailure(true, name, { added: 8, changed: 8 }), true);
  for (const actual of [{ added: 9, changed: 8 }, { added: 8, changed: 8, other: 2 }, ["added", "changed"], null]) {
    assert.equal(approvedBaselineFailure(true, name, actual), false);
  }
  assert.equal(approvedBaselineFailure(false, name, { added: 8, changed: 8 }), false);
  assert.equal(approvedBaselineFailure(true, "/guide/appendix/changelog duplicate IDs", { added: 8, changed: 8 }), false);
});

test("mobile exception cannot expand to other routes, widths or desktop", () => {
  const name = "/docs/02-design/06-intent-and-specification-engineering overflow 390";
  assert.equal(approvedBaselineFailure(true, name, 572), true);
  assert.equal(approvedBaselineFailure(true, name, 573), false);
  assert.equal(approvedBaselineFailure(true, name, NaN), false);
  assert.equal(approvedBaselineFailure(true, name.replace("390", "1440"), 572), false);
  assert.equal(approvedBaselineFailure(true, "/docs/another overflow 390", 400), false);
});

test("hydration exception is bounded to the existing route, error and visit count", () => {
  const name = "zero page errors / hydration failures";
  const error = { page: "https://ai-software-factory-mastery.vercel.app/docs/03-build/25-the-12-layer-production-ai-agent-stack", message: "Minified React error #418; existing baseline" };
  assert.equal(approvedBaselineFailure(true, name, [error, error]), true);
  assert.equal(approvedBaselineFailure(true, name, [error, error, error]), false);
  assert.equal(approvedBaselineFailure(true, name, [{ ...error, page: "https://example.com/guide" }]), false);
  assert.equal(approvedBaselineFailure(true, name, [{ ...error, message: "New runtime error" }]), false);
  assert.equal(approvedBaselineFailure(true, "zero unexpected network failures", [error]), false);
});
