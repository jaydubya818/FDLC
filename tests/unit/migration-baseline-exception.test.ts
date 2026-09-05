import assert from "node:assert/strict";
import test from "node:test";
import { approvedBaselineFailure, BASELINE_EXCEPTION, OLD_GUIDE_DEPLOYMENT, validateBaselineException, OLD_GUIDE_SEARCH_FOCUS_TRAP, classifyOldGuideSearchFocusException, validateSearchFocusException, type SearchFocusExceptionContext, type SearchFocusObservation } from "../../lib/migration-baseline-exception.ts";

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

const focusContext: SearchFocusExceptionContext = {
  exception: OLD_GUIDE_SEARCH_FOCUS_TRAP, edition: "old", deployment: OLD_GUIDE_DEPLOYMENT, state: "bridge-old",
};
const escapedFocus: SearchFocusObservation = {
  issue: "focus-escaped", dialogId: "command-palette", dialogName: "Command palette",
  key: "Tab", dialogOpen: true, focusInside: false,
};

test("search-focus exception requires separate explicit approval and exact bridge/old identity", () => {
  assert.equal(validateSearchFocusException(undefined, "new", undefined, "final-new"), false);
  assert.equal(validateSearchFocusException(OLD_GUIDE_SEARCH_FOCUS_TRAP, "old", OLD_GUIDE_DEPLOYMENT, "bridge-old"), true);
  for (const [option, edition, deployment, state] of [
    [BASELINE_EXCEPTION, "old", OLD_GUIDE_DEPLOYMENT, "bridge-old"],
    [OLD_GUIDE_SEARCH_FOCUS_TRAP, "new", OLD_GUIDE_DEPLOYMENT, "bridge-old"],
    [OLD_GUIDE_SEARCH_FOCUS_TRAP, "old", "dpl_other", "bridge-old"],
    [OLD_GUIDE_SEARCH_FOCUS_TRAP, "old", OLD_GUIDE_DEPLOYMENT, "current-old"],
    [OLD_GUIDE_SEARCH_FOCUS_TRAP, "old", OLD_GUIDE_DEPLOYMENT, "final-new"],
  ]) assert.throws(() => validateSearchFocusException(option, edition, deployment, state));
});

test("records accepted focus escapes as KNOWN_EXCEPTION / ACCEPTED_TEMPORARILY, never PASS", () => {
  for (const key of ["Tab", "Shift+Tab"]) {
    const classification = classifyOldGuideSearchFocusException(focusContext, { ...escapedFocus, key });
    assert.equal(classification?.exceptionId, OLD_GUIDE_SEARCH_FOCUS_TRAP);
    assert.equal(classification?.status, "KNOWN_EXCEPTION");
    assert.equal(classification?.disposition, "ACCEPTED_TEMPORARILY");
    assert.equal(classification?.finalStateAcceptance, "NOT EXEMPT");
    assert.equal(classification?.productionPromotionAuthorized, false);
  }
});

test("search-focus exception expires upon any state, edition, artifact or approval change", () => {
  for (const change of [
    { exception: undefined }, { exception: BASELINE_EXCEPTION }, { edition: "new" },
    { deployment: "dpl_new" }, { deployment: undefined },
    { state: "current-old" }, { state: "bridge-new" }, { state: "final-new" }, { state: "future" },
  ]) assert.equal(classifyOldGuideSearchFocusException({ ...focusContext, ...change }, escapedFocus), null);
});

test("search-focus exception cannot cover another modal, Escape, restoration, ordering or other accessibility failure", () => {
  for (const change of [
    { issue: "focus-restoration" }, { issue: "incorrect-focus-order" }, { issue: "aria-modal" },
    { issue: "focus-entry" }, { dialogId: "another-modal" }, { dialogName: "Another dialog" },
    { dialogOpen: false }, { focusInside: true }, { key: "Escape" }, { key: "Enter" },
  ]) assert.equal(classifyOldGuideSearchFocusException(focusContext, { ...escapedFocus, ...change }), null);
  assert.equal(approvedBaselineFailure(true, OLD_GUIDE_SEARCH_FOCUS_TRAP, escapedFocus), false);
});
