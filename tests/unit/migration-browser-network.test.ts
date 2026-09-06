import assert from "node:assert/strict";
import test from "node:test";
import { isSuccessfulGuidePrefetchCancellation, type MigrationNetworkObservation } from "../../lib/migration-browser-network.ts";

const guideOrigin = "http://127.0.0.1:3024";
function observation(path = "/guide/01-understand/01-why-software-engineering-is-changing"): MigrationNetworkObservation {
  const url = `${guideOrigin}${path}?_rsc=fixture`;
  return {
    url, pageUrl: `${guideOrigin}/guide`, method: "GET", type: "fetch",
    isNavigationRequest: false, error: "net::ERR_ABORTED",
    requestHeaders: { rsc: "1", "next-router-prefetch": "1", "next-router-segment-prefetch": "/_tree" },
    response: {
      url, status: 200,
      headers: { "content-type": "text/x-component", vary: "rsc, next-router-state-tree, next-router-prefetch, next-router-segment-prefetch, Accept-Encoding" },
    },
  };
}

test("recognizes only the evidenced successful-response tree and metadata prefetch cancellation patterns", () => {
  assert.equal(isSuccessfulGuidePrefetchCancellation(observation(), guideOrigin), true);
  const metadata = observation();
  delete metadata.requestHeaders["next-router-segment-prefetch"];
  metadata.requestHeaders["next-router-state-tree"] = encodeURIComponent(JSON.stringify(["", {}, null, "metadata-only"]));
  assert.equal(isSuccessfulGuidePrefetchCancellation(metadata, guideOrigin), true);
  const upperCase = observation();
  upperCase.requestHeaders = Object.fromEntries(Object.entries(upperCase.requestHeaders).map(([key, value]) => [key.toUpperCase(), value]));
  assert.equal(isSuccessfulGuidePrefetchCancellation(upperCase, guideOrigin), true);
});

const rejectionCases: [string, (value: MigrationNetworkObservation) => void][] = [
  ["real RSC navigation, even when it rendered successfully", (value) => { delete value.requestHeaders["next-router-prefetch"]; }],
  ["document navigation", (value) => { value.isNavigationRequest = true; value.type = "document"; }],
  ["JavaScript asset", (value) => { value.type = "script"; }],
  ["CSS asset", (value) => { value.type = "stylesheet"; }],
  ["image asset", (value) => { value.type = "image"; }],
  ["user-data JSON", (value) => { value.url = `${guideOrigin}/guide/search-index.json?_rsc=fixture`; value.response!.url = value.url; }],
  ["POST or Server Action", (value) => { value.method = "POST"; }],
  ["action-marked GET", (value) => { value.requestHeaders["next-action"] = "fixture"; }],
  ["request without response", (value) => { value.response = null; }],
  ["HTTP error", (value) => { value.response!.status = 500; }],
  ["HTTP redirect", (value) => { value.response!.status = 308; }],
  ["redirected response", (value) => { value.response!.url = `${guideOrigin}/guide/other?_rsc=fixture`; }],
  ["HTML mislabeled as RSC request", (value) => { value.response!.headers["content-type"] = "text/html"; }],
  ["RSC response lacking the Next vary contract", (value) => { value.response!.headers.vary = "rsc, Accept-Encoding"; }],
  ["arbitrary connection failure", (value) => { value.error = "net::ERR_CONNECTION_RESET"; }],
  ["prefetch without RSC marker", (value) => { delete value.requestHeaders.rsc; }],
  ["unknown prefetch mode", (value) => { value.requestHeaders["next-router-prefetch"] = "2"; }],
  ["arbitrary segment", (value) => { value.requestHeaders["next-router-segment-prefetch"] = "/guide/__PAGE__"; }],
  ["arbitrary router state", (value) => { delete value.requestHeaders["next-router-segment-prefetch"]; value.requestHeaders["next-router-state-tree"] = "%5B%22refetch%22%5D"; }],
  ["extra user query", (value) => { value.url += "&search=fixture"; value.response!.url = value.url; }],
  ["repeated cache query", (value) => { value.url += "&_rsc=again"; value.response!.url = value.url; }],
  ["missing cache query", (value) => { value.url = `${guideOrigin}/guide`; value.response!.url = value.url; }],
  ["non-Guide destination", (value) => { value.url = `${guideOrigin}/api/data?_rsc=fixture`; value.response!.url = value.url; }],
  ["other destination origin", (value) => { value.url = value.url.replace("127.0.0.1", "localhost"); value.response!.url = value.url; }],
  ["other initiating document origin", (value) => { value.pageUrl = "http://localhost:3024/guide"; }],
  ["malformed URL", (value) => { value.url = "not-a-url"; value.response!.url = value.url; }],
];
for (const [name, mutate] of rejectionCases) {
  test(`does not excuse ${name}`, () => {
    const value = observation();
    mutate(value);
    assert.equal(isSuccessfulGuidePrefetchCancellation(value, guideOrigin), false);
  });
}

const compatibleChapter = "/docs/01-understand/01-why-software-engineering-is-changing";
for (const path of [compatibleChapter, "/docs/appendix/architecture-communication"]) {
  for (const shape of ["tree", "metadata-only"]) {
    test(`recognizes the evidenced ${shape} prefetch cancellation on ${path}`, () => {
      const value = observation(path);
      if (shape === "metadata-only") {
        delete value.requestHeaders["next-router-segment-prefetch"];
        value.requestHeaders["next-router-state-tree"] = encodeURIComponent(JSON.stringify(["", {}, null, "metadata-only"]));
      }
      assert.equal(isSuccessfulGuidePrefetchCancellation(value, guideOrigin), true);
    });
  }
}

for (const [name, mutate] of rejectionCases) {
  test(`compatible chapter path still does not excuse ${name}`, () => {
    const value = observation(compatibleChapter);
    mutate(value);
    assert.equal(isSuccessfulGuidePrefetchCancellation(value, guideOrigin), false);
  });
}

test("compatible path addition does not include FDLC routes, tools, assets or unsafe path forms", () => {
  for (const path of [
    "/", "/architecture", "/visuals", "/search", "/topics", "/coverage", "/glossary",
    "/docs", "/docs/", "/docs//chapter", "/docs/appendix//chapter", "/docs/chapter/",
    "/docs/search-index.json", "/docs/chunk.js", "/docs/style.css", "/docs/image.svg",
    "/docs/_next/chunk", "/docs/%61ppendix/chapter", "/docs/appendix%2fchapter",
    "/docs/appendix%5cchapter", "/docs/chapter%20name",
  ]) {
    assert.equal(isSuccessfulGuidePrefetchCancellation(observation(path), guideOrigin), false, path);
  }
});
