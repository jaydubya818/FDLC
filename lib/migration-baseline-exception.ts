import assert from "node:assert/strict";

export const OLD_GUIDE_DEPLOYMENT = "dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur";
export const BASELINE_EXCEPTION = "current-guide-2026-09-05";

export function validateBaselineException(option: string | undefined, edition: string, deployment: string | undefined) {
  if (!option) return false;
  assert.equal(option, BASELINE_EXCEPTION);
  assert.equal(edition, "old", "The approved baseline exception never applies to new Guide");
  assert.equal(deployment, OLD_GUIDE_DEPLOYMENT, "The baseline exception is pinned to the unchanged old artifact");
  return true;
}

const approvedOldOverflow = new Map([
  ["/docs/02-design/06-intent-and-specification-engineering overflow 390", 572],
  ["/docs/04-prove/31-quality-contracts-proof-packages-and-certificates overflow 390", 572],
  ["/docs/05-operate/35-observability-telemetry-and-forensics overflow 390", 416],
  ["/docs/appendix/architecture-communication overflow 390", 495],
  ["/docs/appendix/mission-control/03-capability-workflow-and-admission-map overflow 390", 393],
]);

/** Explicit user-approved legacy defects only; never a general error allowlist. */
export function approvedBaselineFailure(enabled: boolean, name: string, actual: unknown) {
  if (!enabled) return false;
  if (name === "/docs/appendix/changelog duplicate IDs") {
    return actual !== null && typeof actual === "object" && Object.keys(actual).length === 2
      && "added" in actual && actual.added === 8 && "changed" in actual && actual.changed === 8;
  }
  const maximumWidth = approvedOldOverflow.get(name);
  if (maximumWidth !== undefined) return typeof actual === "number" && actual > 390 && actual <= maximumWidth;
  if (name === "zero page errors / hydration failures") {
    return Array.isArray(actual) && actual.length > 0 && actual.length <= 2 && actual.every((error: unknown) => {
      if (!error || typeof error !== "object" || !("page" in error) || !("message" in error)
        || typeof error.page !== "string" || typeof error.message !== "string") return false;
      try {
        return new URL(error.page).pathname === "/docs/03-build/25-the-12-layer-production-ai-agent-stack"
          && error.message.startsWith("Minified React error #418;");
      } catch { return false; }
    });
  }
  return false;
}

export const OLD_GUIDE_SEARCH_FOCUS_TRAP = "OLD_GUIDE_SEARCH_FOCUS_TRAP";
export const OLD_GUIDE_SHORTCUT_CLOSE_FOCUS_RESTORE = "OLD_GUIDE_SHORTCUT_CLOSE_FOCUS_RESTORE";
export const OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE = "OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE";
export const OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE = "OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE";
export const OLD_GUIDE_KEYBOARD_EXCEPTIONS = [OLD_GUIDE_SEARCH_FOCUS_TRAP, OLD_GUIDE_SHORTCUT_CLOSE_FOCUS_RESTORE, OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE, OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE] as const;
export const OLD_GUIDE_SOURCE = "87d3841f96353d03278311dfc7e7b2d25649a331";
export const OLD_GUIDE_BASELINE_DIGEST = "cd24db753bf2fdec8a89873654bc4586484c0fbc763f081e93a6d4c7bb56386f";
const identityProof = Symbol("live-old-guide-metadata-and-browser-asset-proof");

export type OldGuideMetadata = {
  checkedAt: number;
  projectId: string;
  projectDeployment: string;
  projectSource: string;
  projectReadyState: string;
  alias: string;
  aliasProjectId: string;
  aliasDeployment: string;
  immutableDeployment: string;
  immutableSource: string;
  immutableProjectId: string;
  immutableReadyState: string;
};
export type OldGuideAsset = { path: string; status: number; sha256: string; type: string };
export function verifyOldGuideMetadata(metadata: OldGuideMetadata, now = Date.now()) {
  assert.ok(now >= metadata.checkedAt && now - metadata.checkedAt <= 60_000, "Live Guide identity is absent or stale");
  assert.equal(metadata.projectId, "prj_KZQBsEEmJMnEpCx3DHW4mfzIOAuO");
  assert.equal(metadata.alias, "ai-software-factory-mastery.vercel.app");
  assert.equal(metadata.aliasProjectId, metadata.projectId);
  assert.equal(metadata.immutableProjectId, metadata.projectId);
  for (const deployment of [metadata.projectDeployment, metadata.aliasDeployment, metadata.immutableDeployment]) assert.equal(deployment, OLD_GUIDE_DEPLOYMENT, "Old Guide is no longer the active exact artifact");
  for (const source of [metadata.projectSource, metadata.immutableSource]) assert.equal(source, OLD_GUIDE_SOURCE);
  assert.equal(metadata.projectReadyState, "READY");
  assert.equal(metadata.immutableReadyState, "READY");
}

/** The harness pins the baseline file before passing its manifest. No CLI identity assertion suffices. */
export function verifyOldGuideIdentity(metadata: OldGuideMetadata, assets: OldGuideAsset[], baseline: OldGuideAsset[], requiredPaths: string[], baselineDigest: string, now = Date.now()) {
  verifyOldGuideMetadata(metadata, now);
  assert.equal(baselineDigest, OLD_GUIDE_BASELINE_DIGEST);
  assert.ok(requiredPaths.length > 0 && assets.some((asset) => asset.type === "script") && assets.some((asset) => asset.type === "stylesheet"), "Missing managed Guide JS/CSS evidence");
  const approved = new Map(baseline.map((asset) => [asset.path, asset]));
  for (const asset of assets) {
    assert.match(asset.path, /^\/_next\/static\/immutable\/[^?#]+\.(js|css)$/);
    assert.equal(asset.status, 200);
    assert.match(asset.sha256, /^[a-f0-9]{64}$/);
    assert.equal(approved.get(asset.path)?.sha256, asset.sha256, "Unknown or changed Guide asset");
    assert.equal(approved.get(asset.path)?.type, asset.type);
  }
  for (const path of requiredPaths) assert.ok(assets.some((asset) => asset.path === path), `Missing Guide asset: ${path}`);
  return Object.freeze({ [identityProof]: true as const, ...metadata, baselineDigest, assetCount: assets.length, verifiedAt: now });
}
type VerifiedOldGuideIdentity = ReturnType<typeof verifyOldGuideIdentity>;

export type SearchFocusExceptionContext = {
  exception?: string;
  exceptions?: string[];
  edition: string;
  deployment?: string;
  state: string;
  identity?: VerifiedOldGuideIdentity;
};

export type SearchFocusObservation = {
  issue: string;
  dialogId: string | null;
  dialogName: string | null;
  key: string;
  dialogOpen: boolean;
  focusInside: boolean;
  wasOpen?: boolean;
  openedBy?: string;
  invokerIsSearchTrigger?: boolean;
  focusReturned?: boolean;
  activeIsSearchTrigger?: boolean;
  activeIsBody?: boolean;
};

export function validateSearchFocusException(option: string | undefined, edition: string, deployment: string | undefined, state: string) {
  if (!option) return false;
  assert.ok(OLD_GUIDE_KEYBOARD_EXCEPTIONS.some((id) => id === option), "Only an explicitly approved historical keyboard exception is available");
  assert.equal(edition, "old", "New Guide never receives the old search-focus exception");
  assert.equal(deployment, OLD_GUIDE_DEPLOYMENT, "The search-focus exception is pinned to the unchanged old artifact");
  assert.equal(state, "bridge-old", "The search-focus exception expires immediately outside bridge/old");
  return true;
}

/** Recheck identity and state on every observation; an enabled flag cannot outlive bridge/old. */
export function classifyOldGuideSearchFocusException(context: SearchFocusExceptionContext, observation: SearchFocusObservation) {
  const identity = context.identity;
  const now = Date.now();
  if (
    context.edition !== "old" || !identity || identity[identityProof] !== true
    || now < identity.verifiedAt || now - identity.verifiedAt > 60_000
    || now < identity.checkedAt || now - identity.checkedAt > 60_000
    || context.deployment !== OLD_GUIDE_DEPLOYMENT || context.state !== "bridge-old"
    || observation.dialogId !== "command-palette" || observation.dialogName !== "Command palette"
  ) return null;
  let exceptionId: string | undefined;
  const shortcut = ["Control+k", "Meta+k"].includes(observation.key);
  const shortcutOpened = ["Control+k", "Meta+k"].includes(observation.openedBy ?? "");
  if (observation.issue === "focus-escaped" && observation.dialogOpen === true && observation.focusInside === false && ["Tab", "Shift+Tab"].includes(observation.key)) exceptionId = OLD_GUIDE_SEARCH_FOCUS_TRAP;
  if (observation.issue === "shortcut-close-focus-loss" && shortcut && shortcutOpened && observation.wasOpen === true && observation.dialogOpen === false && observation.focusReturned === false && observation.activeIsBody === true) exceptionId = OLD_GUIDE_SHORTCUT_CLOSE_FOCUS_RESTORE;
  if (observation.issue === "escape-wrong-invoker" && observation.key === "Escape" && shortcutOpened && observation.wasOpen === true && observation.dialogOpen === false && observation.invokerIsSearchTrigger === false && observation.focusReturned === false && observation.activeIsSearchTrigger === true) exceptionId = OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE;
  if (observation.issue === "closed-escape-interference" && observation.key === "Escape" && observation.wasOpen === false && observation.dialogOpen === false && observation.invokerIsSearchTrigger === false && observation.focusReturned === false && observation.activeIsSearchTrigger === true) exceptionId = OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE;
  const approvals = context.exceptions ?? (context.exception ? [context.exception] : []);
  if (!exceptionId || !approvals.includes(exceptionId)) return null;
  return {
    exceptionId,
    affectedDeployment: OLD_GUIDE_DEPLOYMENT,
    classification: exceptionId === OLD_GUIDE_SEARCH_FOCUS_TRAP ? "PRE_EXISTING / IMMUTABLE ARTIFACT" : "PRE_EXISTING / IMMUTABLE OLD ARTIFACT",
    status: "KNOWN_EXCEPTION",
    disposition: "ACCEPTED_TEMPORARILY",
    allowedState: "bridge-old",
    expiration: "Immediately when the migration leaves bridge/old or the old Guide artifact changes",
    finalStateAcceptance: "NOT EXEMPT",
    productionPromotionAuthorized: false,
    identityVerifiedAt: new Date(identity.verifiedAt).toISOString(),
    identityBaselineDigest: identity.baselineDigest,
  } as const;
}
