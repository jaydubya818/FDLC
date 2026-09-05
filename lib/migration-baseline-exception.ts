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
