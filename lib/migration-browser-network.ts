/** Browser-test evidence only; not imported by application runtime code. */
export type MigrationNetworkObservation = {
  url: string;
  /** Initiating document URL captured when the request starts, not on failure. */
  pageUrl: string;
  method: string;
  type: string;
  isNavigationRequest: boolean;
  error: string | null;
  requestHeaders: Record<string, string>;
  response: { url: string; status: number; headers: Record<string, string> } | null;
};

export const MIGRATION_PREFETCH_REQUEST_HEADERS = [
  "rsc", "next-router-prefetch", "next-router-segment-prefetch",
  "next-router-state-tree", "next-action",
] as const;

export const MIGRATION_PREFETCH_RESPONSE_HEADERS = ["content-type", "vary"] as const;

function lowerCaseHeaders(headers: Record<string, string>) {
  return Object.fromEntries(Object.entries(headers).map(([key, value]) => [key.toLowerCase(), value]));
}

/**
 * Narrow class independently reproduced with Next 16.3.3 on a stationary Guide
 * page: low-priority tree/metadata prefetches receive 200 Flight responses, then
 * Chromium reports cancellation. This does not establish a JS abort call or a
 * fully consumed response body. User-navigation RSC and all other failures stay
 * failures, even if their destination eventually renders.
 */
export function isSuccessfulGuidePrefetchCancellation(
  observation: MigrationNetworkObservation,
  guideOrigin: string,
) {
  if (
    observation.error !== "net::ERR_ABORTED" || observation.method !== "GET"
    || observation.type !== "fetch" || observation.isNavigationRequest !== false
    || !observation.response || observation.response.status !== 200
    || observation.response.url !== observation.url
  ) return false;

  let url: URL;
  let pageUrl: URL;
  try {
    url = new URL(observation.url);
    pageUrl = new URL(observation.pageUrl);
  } catch {
    return false;
  }
  if (
    !["http:", "https:"].includes(url.protocol) || url.origin !== guideOrigin
    || pageUrl.origin !== guideOrigin || url.username || url.password || url.hash
    || !(url.pathname === "/guide" || url.pathname.startsWith("/guide/"))
    || url.pathname.includes(".") || url.pathname.includes("%")
    || [...url.searchParams.keys()].length !== 1
    || !url.searchParams.get("_rsc")
  ) return false;

  const request = lowerCaseHeaders(observation.requestHeaders);
  const response = lowerCaseHeaders(observation.response.headers);
  if (request.rsc !== "1" || request["next-router-prefetch"] !== "1" || request["next-action"] !== undefined) return false;
  const treePrefetch = request["next-router-segment-prefetch"] === "/_tree" && request["next-router-state-tree"] === undefined;
  const metadataPrefetch = request["next-router-segment-prefetch"] === undefined
    && request["next-router-state-tree"] === encodeURIComponent(JSON.stringify(["", {}, null, "metadata-only"]));
  if (!treePrefetch && !metadataPrefetch) return false;
  if (!/^text\/x-component(?:\s*;|$)/i.test(response["content-type"] ?? "")) return false;
  const vary = new Set((response.vary ?? "").toLowerCase().split(",").map((value) => value.trim()));
  return ["rsc", "next-router-state-tree", "next-router-prefetch", "next-router-segment-prefetch"].every((header) => vary.has(header));
}
