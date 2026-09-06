import assert from "node:assert/strict";
import test from "node:test";
import { approvedBaselineFailure, BASELINE_EXCEPTION, OLD_GUIDE_DEPLOYMENT, validateBaselineException, OLD_GUIDE_SEARCH_FOCUS_TRAP, classifyOldGuideSearchFocusException, validateSearchFocusException, type SearchFocusExceptionContext, type SearchFocusObservation, OLD_GUIDE_KEYBOARD_EXCEPTIONS, OLD_GUIDE_SHORTCUT_CLOSE_FOCUS_RESTORE, OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE, OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE, OLD_GUIDE_SOURCE, OLD_GUIDE_BASELINE_DIGEST, verifyOldGuideMetadata, verifyOldGuideIdentity } from "../../lib/migration-baseline-exception.ts";

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

const metadata = {
  checkedAt: Date.now(), projectId: "prj_KZQBsEEmJMnEpCx3DHW4mfzIOAuO",
  projectDeployment: OLD_GUIDE_DEPLOYMENT, projectSource: OLD_GUIDE_SOURCE, projectReadyState: "READY",
  alias: "ai-software-factory-mastery.vercel.app", aliasProjectId: "prj_KZQBsEEmJMnEpCx3DHW4mfzIOAuO", aliasDeployment: OLD_GUIDE_DEPLOYMENT,
  immutableDeployment: OLD_GUIDE_DEPLOYMENT, immutableSource: OLD_GUIDE_SOURCE, immutableProjectId: "prj_KZQBsEEmJMnEpCx3DHW4mfzIOAuO", immutableReadyState: "READY",
};
const assets = [
  { path: "/_next/static/immutable/chunks/test.js", type: "script", status: 200, sha256: "a".repeat(64) },
  { path: "/_next/static/immutable/chunks/test.css", type: "stylesheet", status: 200, sha256: "b".repeat(64) },
];
const identity = verifyOldGuideIdentity(metadata, assets, assets, assets.map((asset) => asset.path), OLD_GUIDE_BASELINE_DIGEST);
const focusContext: SearchFocusExceptionContext = {
  exception: OLD_GUIDE_SEARCH_FOCUS_TRAP, edition: "old", deployment: OLD_GUIDE_DEPLOYMENT, state: "bridge-old",
  identity,
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

const approvedCases: [string, SearchFocusObservation][] = [
  [OLD_GUIDE_SEARCH_FOCUS_TRAP, escapedFocus],
  [OLD_GUIDE_SHORTCUT_CLOSE_FOCUS_RESTORE, { ...escapedFocus, issue: "shortcut-close-focus-loss", key: "Control+k", openedBy: "Control+k", wasOpen: true, dialogOpen: false, focusReturned: false, activeIsBody: true }],
  [OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE, { ...escapedFocus, issue: "escape-wrong-invoker", key: "Escape", openedBy: "Meta+k", wasOpen: true, dialogOpen: false, invokerIsSearchTrigger: false, focusReturned: false, activeIsSearchTrigger: true }],
  [OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE, { ...escapedFocus, issue: "closed-escape-interference", key: "Escape", wasOpen: false, dialogOpen: false, invokerIsSearchTrigger: false, focusReturned: false, activeIsSearchTrigger: true }],
];

test("each historical behavior requires its own explicit ID and remains a visible non-PASS", () => {
  for (const [id, observation] of approvedCases) {
    validateSearchFocusException(id, "old", OLD_GUIDE_DEPLOYMENT, "bridge-old");
    const result = classifyOldGuideSearchFocusException({ ...focusContext, exception: undefined, exceptions: [id] }, observation);
    assert.equal(result?.exceptionId, id);
    assert.equal(result?.status, "KNOWN_EXCEPTION");
    assert.equal(result?.disposition, "ACCEPTED_TEMPORARILY");
    assert.equal(result?.finalStateAcceptance, "NOT EXEMPT");
    assert.equal(result?.productionPromotionAuthorized, false);
    for (const otherId of OLD_GUIDE_KEYBOARD_EXCEPTIONS.filter((value) => value !== id)) {
      assert.equal(classifyOldGuideSearchFocusException({ ...focusContext, exception: otherId }, observation), null);
    }
  }
});

test("all four exceptions fail closed without verified identity or outside exact bridge/old", () => {
  for (const [id, observation] of approvedCases) for (const change of [
    { identity: undefined }, { edition: "new" }, { deployment: "dpl_other" },
    { state: "current-old" }, { state: "bridge-new" }, { state: "final-new" }, { state: "future" },
    { identity: { ...identity, verifiedAt: Date.now() - 60_001 } },
  ]) assert.equal(classifyOldGuideSearchFocusException({ ...focusContext, exception: id, ...change }, observation), null);
});

test("historical close exceptions do not waive other outcomes, inputs, modals or restoration regressions", () => {
  for (const [id, observation] of approvedCases.slice(1)) for (const change of [
    { issue: "other-accessibility-defect" }, { dialogId: "another-modal" }, { dialogName: "Another dialog" },
    { key: "Enter" }, { dialogOpen: true }, { focusReturned: true },
    { activeIsSearchTrigger: false, activeIsBody: false },
  ]) assert.equal(classifyOldGuideSearchFocusException({ ...focusContext, exception: id }, { ...observation, ...change }), null);
  assert.equal(classifyOldGuideSearchFocusException({ ...focusContext, exception: OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE }, { ...approvedCases[2][1], openedBy: "Enter" }), null);
  assert.equal(classifyOldGuideSearchFocusException({ ...focusContext, exception: OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE }, { ...approvedCases[3][1], wasOpen: true }), null);
});

test("live identity rejects stale metadata or any changed active alias/project/deployment/source", () => {
  for (const change of [
    { checkedAt: Date.now() - 60_001 }, { checkedAt: Date.now() + 60_000 },
    { projectDeployment: "dpl_other" }, { aliasDeployment: "dpl_other" }, { immutableDeployment: "dpl_other" },
    { projectSource: "other" }, { immutableSource: "other" }, { alias: "other.vercel.app" },
    { projectId: "prj_other" }, { aliasProjectId: "prj_other" }, { immutableProjectId: "prj_other" },
    { projectReadyState: "ERROR" }, { immutableReadyState: "BUILDING" },
  ]) assert.throws(() => verifyOldGuideMetadata({ ...metadata, ...change }));
});

test("asset identity rejects absent, unknown, changed, unprefixed, unhashed or non-200 managed assets", () => {
  const required = assets.map((asset) => asset.path);
  for (const observed of [
    [], [assets[0]], assets.map((asset) => ({ ...asset, status: 404 })),
    assets.map((asset) => ({ ...asset, sha256: "c".repeat(64) })),
    assets.map((asset) => ({ ...asset, sha256: "" })),
    [...assets, { ...assets[0], path: "/_next/static/immutable/unknown.js" }],
    assets.map((asset) => ({ ...asset, path: "/other.js" })),
    assets.map((asset) => ({ ...asset, type: "fetch" })),
  ]) assert.throws(() => verifyOldGuideIdentity(metadata, observed, assets, required, OLD_GUIDE_BASELINE_DIGEST));
  assert.throws(() => verifyOldGuideIdentity(metadata, assets, assets, required, "wrong-baseline-digest"));
});
