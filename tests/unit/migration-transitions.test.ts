import assert from "node:assert/strict";
import test from "node:test";
import { TRANSITION_STATES, transitionOrigin, validateTransitionCommand, verifyTransitionAsset, verifyDocumentDeploymentParameters } from "../../scripts/qualify-migration-transitions.mjs";

const identity = {
  checkpoint: "qualified-transition", state: "bridge-new",
  guideOrigin: "http://127.0.0.1:3024", fdlcOrigin: "http://localhost:3024",
  guideSource: "a".repeat(40), fdlcSource: "b".repeat(40),
  guideDeployment: null, fdlcDeployment: null,
};
const capture = { phase: "capture", ...identity, pages: [{ key: "chapter", path: "/docs/01-understand/chapter#overview", navigate: true }] };
const check = { phase: "check", ...identity, state: "bridge-old", expectedUrls: { chapter: "http://127.0.0.1:3024/docs/01-understand/chapter#overview" }, expectedNavigationUrls: { chapter: "http://127.0.0.1:3024/docs/01-understand/next" } };

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
