import assert from "node:assert/strict";
import test from "node:test";
import { TRANSITION_STATES, TRANSITION_SEARCH_SELECTOR, transitionOrigin, validateTransitionCommand, verifyTransitionAsset, verifyDocumentDeploymentParameters, transitionSearchStateMatches, transitionLinkSnapshots, safeTransitionFailure } from "../../scripts/qualify-migration-transitions.mjs";

const identity = {
  checkpoint: "qualified-transition", state: "bridge-new",
  guideOrigin: "http://127.0.0.1:3024", fdlcOrigin: "http://localhost:3024",
  guideSource: "a".repeat(40), fdlcSource: "b".repeat(40),
  guideDeployment: null, fdlcDeployment: null,
};
const capture = { phase: "capture", ...identity, pages: [{ key: "chapter", path: "/docs/01-understand/chapter#overview", navigate: true }] };
const check = { phase: "check", ...identity, state: "bridge-old", expectedUrls: { chapter: "http://127.0.0.1:3024/docs/01-understand/chapter#overview" }, expectedNavigationUrls: { chapter: "http://127.0.0.1:3024/docs/01-understand/next" } };

test("transition visibility rejects concealed disclosure contents despite nonempty layout rectangles", () => {
  const options: unknown[] = [];
  const visible = { href: `${identity.guideOrigin}/docs/chapter`, textContent: "Chapter", getAttribute: () => "/docs/chapter", closest: () => null, getClientRects: () => [{}], checkVisibility: (value: unknown) => { options.push(value); return true; } };
  const outside = transitionLinkSnapshots([visible])[0];
  assert.equal(outside.visible, true);
  assert.equal(outside.inMain, false);
  assert.equal(outside.inArticle, false);
  const article = transitionLinkSnapshots([{ ...visible, closest: (selector: string) => ["main", "article.document-article"].includes(selector) ? {} : null }])[0];
  assert.equal(article.inMain, true);
  assert.equal(article.inArticle, true);
  const sidebar = transitionLinkSnapshots([{ ...visible, closest: (selector: string) => selector === "main" ? {} : null }])[0];
  assert.equal(sidebar.inMain, true);
  assert.equal(sidebar.inArticle, false);
  assert.deepEqual(options, Array(3).fill({ checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true }));
  for (const change of [{ closest: () => ({ open: false }) }, { getClientRects: () => [] }, { checkVisibility: () => false }, { checkVisibility: undefined }]) {
    assert.equal(transitionLinkSnapshots([{ ...visible, ...change }])[0].visible, false);
  }
});

test("phase diagnostics only expose allowlisted error names and internal stages", () => {
  assert.deepEqual(safeTransitionFailure({ name: "TimeoutError", message: "sensitive payload" }, "retained-link-click"), { errorName: "TimeoutError", stage: "retained-link-click" });
  assert.deepEqual(safeTransitionFailure({ name: "credential-like-payload", message: "sensitive payload" }, "user supplied secret"), { errorName: "UnknownError", stage: "command" });
  assert.deepEqual(safeTransitionFailure(null, "reload"), { errorName: "UnknownError", stage: "reload" });
});

test("transition graph accepts every adjacent forward/reverse edge, not a cold matrix or unsafe skip", () => {
  validateTransitionCommand(capture, "local");
  for (let index = 0; index < TRANSITION_STATES.length - 1; index++) {
    validateTransitionCommand({ ...check, state: TRANSITION_STATES[index + 1] }, "local", TRANSITION_STATES[index]);
    validateTransitionCommand({ ...check, state: TRANSITION_STATES[index] }, "local", TRANSITION_STATES[index + 1]);
  }
  for (const state of ["bridge-new", "final-compatible", "final-new"]) assert.throws(() => validateTransitionCommand({ ...check, state }, "local", "current-old"));
  assert.throws(() => validateTransitionCommand(check, "local"));
  assert.throws(() => validateTransitionCommand({ ...check, state: "current-old" }, "local", "unknown"));
  assert.throws(() => validateTransitionCommand(capture, "local", "bridge-old"));
  assert.throws(() => validateTransitionCommand({ ...check, state: "bridge-new" }, "local", "bridge-new"));
});

test("transition origins reject credentials, canonical Production, local-to-hosted substitutions and unsafe command inputs", () => {
  for (const value of ["http://user:password@localhost:3024", "http://localhost:3024/", "https://www.fdlc.ai", "https://candidate.vercel.app"]) assert.throws(() => transitionOrigin(value, "local"));
  for (const value of ["http://candidate.vercel.app", "https://candidate.vercel.app.evil.example", "https://www.fdlc.ai"]) assert.throws(() => transitionOrigin(value, "hosted-preview"));
  assert.equal(transitionOrigin("https://candidate.vercel.app", "hosted-preview"), "https://candidate.vercel.app");
  for (const change of [
    { guideSource: "main" }, { guideSource: undefined }, { state: "other" },
    { bypass: "forbidden" }, { checkpoint: "../escape" },
    { pages: [{ key: "chapter", path: "//other.example/guide", navigate: true }] },
    { pages: [{ key: "chapter", path: "/docs/chapter?token=forbidden", navigate: true }] },
    { pages: [{ key: "chapter", path: "/guide", navigate: false }] },
  ]) assert.throws(() => validateTransitionCommand({ ...capture, ...change }, "local"));
  assert.throws(() => validateTransitionCommand({ phase: "finish", state: "final-new" }, "local"));
  assert.throws(() => validateTransitionCommand({ ...check, expectedUrls: { chapter: "https://www.fdlc.ai/guide" } }, "local", "bridge-new"));
});

test("hosted transition declarations require explicit IDs but never constitute provider identity proof", () => {
  const hosted = { ...capture, guideOrigin: "https://guide-candidate.vercel.app", fdlcOrigin: "https://fdlc-candidate.vercel.app" };
  assert.throws(() => validateTransitionCommand(hosted, "hosted-preview"));
  validateTransitionCommand({ ...hosted, guideDeployment: "dpl_Guide", fdlcDeployment: "dpl_Fdlc" }, "hosted-preview");
});

const asset = { url: "http://127.0.0.1:3024/vc-ap-dd2962/_next/static/chunks/app.js?dpl=dpl_Original", type: "script", status: 200, contentType: "application/javascript; charset=utf-8", sha256: "a".repeat(64) };
test("retained asset proof requires the exact URL, successful MIME and byte hash, even after a cache hit", () => {
  verifyTransitionAsset(asset, asset);
  const css = { ...asset, url: "http://127.0.0.1:3024/_next/static/immutable/chunks/old.css", type: "stylesheet", contentType: "text/css; charset=utf-8" };
  verifyTransitionAsset(css, css);
  for (const change of [
    { status: 304 }, { status: 404 }, { status: 308 },
    { url: asset.url.replace("dpl_Original", "dpl_Other") },
    { url: asset.url.replace("127.0.0.1", "localhost") },
    { contentType: "text/html" }, { sha256: "" }, { sha256: "b".repeat(64) },
  ]) assert.throws(() => verifyTransitionAsset(asset, { ...asset, ...change }));
  assert.throws(() => verifyTransitionAsset({ ...asset, url: "http://127.0.0.1:3024/not-managed.js" }, asset));
  assert.throws(() => verifyTransitionAsset({ ...asset, type: "fetch" }, asset));
});

test("current-document identity is separate from retained-client skew pins and absence is not identity proof", () => {
  const retained = asset.url;
  const current = retained.replace("dpl_Original", "dpl_Current");
  assert.deepEqual(verifyDocumentDeploymentParameters([current], "dpl_Current"), ["dpl_Current"]);
  verifyTransitionAsset(asset, asset); // Original URL/bytes remain valid retained-session evidence.
  assert.throws(() => verifyDocumentDeploymentParameters([retained], "dpl_Current"));
  assert.deepEqual(verifyDocumentDeploymentParameters([current.split("?")[0]], "dpl_Current"), []);
});

test("search capture requires exactly one actual Guide search input, never the obsolete ID", () => {
  assert.equal(TRANSITION_SEARCH_SELECTOR, '.search-experience input[type="search"]');
  for (const path of ["/search", "/guide/search"]) {
    const data = { url: `${identity.guideOrigin}${path}?q=evidence`, searchInputCount: 1, searchInputValue: "" };
    assert.equal(transitionSearchStateMatches(data), true);
    for (const searchInputCount of [0, 2]) assert.equal(transitionSearchStateMatches({ ...data, searchInputCount }), false);
    assert.equal(transitionSearchStateMatches({ ...data, searchInputValue: null }), false);
  }
  assert.equal(transitionSearchStateMatches({ url: `${identity.guideOrigin}/guide`, searchInputCount: 0, searchInputValue: null }), true);
});

test("retained and reloaded search state compares actual values separately from URL q", () => {
  const baseline = { url: `${identity.guideOrigin}/search?q=evidence`, urlSearchQ: ["evidence"], searchInputCount: 1, searchInputValue: "" };
  assert.equal(transitionSearchStateMatches({ ...baseline }, baseline), true);
  assert.equal(transitionSearchStateMatches({ ...baseline, url: `${identity.guideOrigin}/guide/search?q=evidence` }, baseline), true);
  assert.equal(transitionSearchStateMatches({ ...baseline, searchInputValue: "evidence" }, baseline), false);
  assert.equal(transitionSearchStateMatches({ ...baseline, searchInputCount: 0, searchInputValue: null }, baseline), false);
  assert.equal(transitionSearchStateMatches({ ...baseline, searchInputCount: 2 }, baseline), false);
  assert.equal(transitionSearchStateMatches({ ...baseline, url: `${identity.guideOrigin}/guide` }, baseline), false);
  const typed = { ...baseline, searchInputValue: "actual typed value" };
  assert.equal(transitionSearchStateMatches({ ...typed }, typed), true);
  assert.equal(transitionSearchStateMatches(baseline, typed), false);
  assert.equal(transitionSearchStateMatches(baseline, { ...baseline, searchInputCount: 0 }), false);
});
