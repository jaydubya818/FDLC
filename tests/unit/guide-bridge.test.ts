import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { NextRequest } from "next/server.js";
import { validateMiddlewareConfig, validateRouting } from "@vercel/microfrontends/next/testing";
import "../../next.config.ts";
import {
  GUIDE_HOST_FLAG,
  STANDALONE_GUIDE_ORIGIN,
  guideBridgeOrigin,
  guideSummaryDestinations,
  isStandaloneGuideHost,
  standaloneGuideRedirect,
} from "../../lib/guide-bridge.ts";
import { config, proxy } from "../../proxy.ts";

const previewOrigin = "https://ai-software-factory-mastery-abc123-jaydubya818.vercel.app";
const previewEnvironment = { VERCEL: "1", VERCEL_ENV: "preview" };
const localOrigin = "http://guide.localhost:4317";
const guidePaths = [
  "/", "/architecture", "/guide",
  "/docs/01-understand/01-why-software-engineering-is-changing",
  "/guide/01-understand/01-why-software-engineering-is-changing",
  "/search", "/guide/search", "/search-index.json", "/guide/search-index.json",
  "/infographics/diagram.svg", "/guide/infographics/diagram.svg",
  "/_next/static/chunks/old-guide.js", "/guide/not-a-real-page",
  "/not-a-real-guide-page", "/sitemap.xml", "/robots.txt",
];

test("keeps production fixed to the canonical Guide origin", () => {
  for (const environment of [{}, { VERCEL: "1", VERCEL_ENV: "production" }]) {
    assert.equal(guideBridgeOrigin(environment), STANDALONE_GUIDE_ORIGIN);
  }
  for (const origin of [STANDALONE_GUIDE_ORIGIN, previewOrigin, localOrigin, ""]) {
    assert.throws(() => guideBridgeOrigin({
      VERCEL: "1", VERCEL_ENV: "production", FDLC_BRIDGE_GUIDE_ORIGIN: origin,
    }), /Production must not override/);
    assert.throws(() => guideBridgeOrigin({
      VERCEL_TARGET_ENV: "production", FDLC_BRIDGE_GUIDE_ORIGIN: origin,
    }), /Production must not override/);
  }
});

test("allows only explicit local or team-qualified Preview origins", () => {
  assert.equal(guideBridgeOrigin({ ...previewEnvironment, FDLC_BRIDGE_GUIDE_ORIGIN: previewOrigin }), previewOrigin);
  for (const host of ["localhost", "127.0.0.1", "guide.localhost"]) {
    const origin = `http://${host}:4317`;
    assert.equal(guideBridgeOrigin({ FDLC_BRIDGE_LOCAL: "1", FDLC_BRIDGE_GUIDE_ORIGIN: origin }), origin);
  }
  assert.equal(guideBridgeOrigin({ FDLC_BRIDGE_GUIDE_ORIGIN: STANDALONE_GUIDE_ORIGIN }), STANDALONE_GUIDE_ORIGIN);
  for (const environment of [
    { FDLC_BRIDGE_GUIDE_ORIGIN: previewOrigin },
    { FDLC_BRIDGE_GUIDE_ORIGIN: localOrigin },
    { ...previewEnvironment, FDLC_BRIDGE_LOCAL: "1", FDLC_BRIDGE_GUIDE_ORIGIN: localOrigin },
    { FDLC_BRIDGE_LOCAL: "true", FDLC_BRIDGE_GUIDE_ORIGIN: localOrigin },
    { FDLC_BRIDGE_LOCAL: "1", FDLC_BRIDGE_GUIDE_ORIGIN: "http://other.localhost:4317" },
    { FDLC_BRIDGE_LOCAL: "1", FDLC_BRIDGE_GUIDE_ORIGIN: "http://localhost" },
  ]) assert.throws(() => guideBridgeOrigin(environment), /Guide bridge/);
});

test("rejects unsafe, malformed, wrong-team and non-origin qualification values", () => {
  for (const origin of [
    "", "/guide", "https://example.com", "http://ai-software-factory-mastery-abc123-jaydubya818.vercel.app",
    "https://ai-software-factory-mastery-abc123-otherteam.vercel.app",
    "https://fdlc-abc123-jaydubya818.vercel.app",
    `${previewOrigin}.evil.test`, `${previewOrigin}:8443`, `${previewOrigin}/`,
    `${previewOrigin}/guide`, `${previewOrigin}?token=secret`, `${previewOrigin}#fragment`,
    "https://user:password@ai-software-factory-mastery-abc123-jaydubya818.vercel.app",
    ` ${previewOrigin}`, `${previewOrigin}\n`,
  ]) assert.throws(() => guideBridgeOrigin({ ...previewEnvironment, FDLC_BRIDGE_GUIDE_ORIGIN: origin }), /Guide bridge/);
});

test("route ownership uses exact Host, including the qualified local port", () => {
  for (const host of ["ai-software-factory-mastery.vercel.app", "AI-SOFTWARE-FACTORY-MASTERY.VERCEL.APP:443"]) {
    assert.equal(isStandaloneGuideHost(host, previewOrigin), true, host);
  }
  assert.equal(isStandaloneGuideHost(new URL(previewOrigin).host, previewOrigin), true);
  assert.equal(isStandaloneGuideHost("guide.localhost:4317", localOrigin), true);
  for (const host of [
    null, "", "www.fdlc.ai", "fdlc.ai", "guide.localhost", "guide.localhost:4318",
    "ai-software-factory-mastery.vercel.app.evil.test",
    "ai-software-factory-mastery.vercel.app@evil.test",
    "ai-software-factory-mastery.vercel.app/path",
    "ai-software-factory-mastery.vercel.app?host=good",
    " ai-software-factory-mastery.vercel.app",
    "ai-software-factory-mastery.vercel.app:80",
  ]) assert.equal(isStandaloneGuideHost(host, localOrigin), false, String(host));
});

test("temporarily redirects legacy Guide page entries without copying content", () => {
  for (const path of [
    "/guide", "/guide/", "/docs/chapter", "/docs",
    "/visuals", "/topics", "/coverage", "/glossary",
  ]) {
    const destination = standaloneGuideRedirect(path, "?token=private", "GET", STANDALONE_GUIDE_ORIGIN);
    assert.equal(destination, `${STANDALONE_GUIDE_ORIGIN}${path.replace(/\/$/, "")}`, path);
  }
  assert.equal(standaloneGuideRedirect("/atlas", "", "HEAD", STANDALONE_GUIDE_ORIGIN), `${STANDALONE_GUIDE_ORIGIN}/visuals`);
  for (const [slug, path] of Object.entries(guideSummaryDestinations)) {
    for (const method of ["GET", "HEAD"]) {
      assert.equal(
        standaloneGuideRedirect(`/guide/${slug}`, "?token=private", method, STANDALONE_GUIDE_ORIGIN),
        `${STANDALONE_GUIDE_ORIGIN}${path}`,
      );
    }
  }
});

test("normalizes FDLC-origin page entries to aliases supported by both Guide generations", () => {
  const commonAliases = [
    ["/guide/search", "/search"],
    ["/guide/architecture", "/architecture"],
    ["/guide/atlas", "/visuals"],
    ["/guide/topics", "/topics"],
    ["/guide/coverage", "/coverage"],
    ["/guide/glossary", "/glossary"],
    ["/guide/01-understand/01-why-software-engineering-is-changing", "/docs/01-understand/01-why-software-engineering-is-changing"],
    ["/guide/appendix/glossary", "/docs/appendix/glossary"],
    ["/guide/not-a-real-page", "/docs/not-a-real-page"],
  ];
  for (const [source, target] of commonAliases) {
    for (const method of ["GET", "HEAD"]) {
      assert.equal(standaloneGuideRedirect(source, "?token=private", method, STANDALONE_GUIDE_ORIGIN), `${STANDALONE_GUIDE_ORIGIN}${target}`);
    }
  }
});

test("does not move FDLC public assets or invent shared old/new Guide asset aliases", () => {
  for (const path of [
    "/og.png", "/og-v2.png", "/icon.svg", "/favicon.svg", "/fdlc-logo-updated.png",
    "/search-index.json", "/infographics/diagram.svg", "/_next/static/chunks/fdlc.js",
  ]) assert.equal(standaloneGuideRedirect(path, "", "GET", STANDALONE_GUIDE_ORIGIN), null, path);
  for (const path of ["/guide/search-index.json", "/guide/infographics/diagram.svg", "/guide/og.png", "/guide/sitemap.xml"]) {
    assert.equal(standaloneGuideRedirect(path, "", "GET", STANDALONE_GUIDE_ORIGIN), `${STANDALONE_GUIDE_ORIGIN}${path}`, path);
  }
});

test("retains repeated q values only on search navigation and drops other cross-origin queries", () => {
  for (const path of ["/search", "/guide/search", "/search/"]) {
    const destination = standaloneGuideRedirect(path, "?q=control+plane&token=private&q=harness%2Feval&debug=1", "GET", STANDALONE_GUIDE_ORIGIN);
    assert.ok(destination);
    assert.deepEqual([...new URL(destination).searchParams], [["q", "control plane"], ["q", "harness/eval"]]);
  }
  assert.equal(standaloneGuideRedirect("/guide", "?q=secret&token=private", "HEAD", STANDALONE_GUIDE_ORIGIN), `${STANDALONE_GUIDE_ORIGIN}/guide`);
});

test("does not redirect FDLC paths, framework assets, unsafe methods or traversal", () => {
  for (const path of ["/", "/architecture", "/mission-control", "/framework", "/robots.txt", "/sitemap.xml", "/_next/static/chunks/fdlc.js"]) {
    assert.equal(standaloneGuideRedirect(path, "?q=keep", "GET", STANDALONE_GUIDE_ORIGIN), null, path);
  }
  for (const method of ["POST", "PUT", "DELETE", "PATCH", "OPTIONS", "get"]) {
    assert.equal(standaloneGuideRedirect("/guide", "", method, STANDALONE_GUIDE_ORIGIN), null, method);
  }
  for (const path of ["//evil.test", "/guide/../architecture", "/guide/%2e%2e/architecture", "/guide/%2f%2fevil.test", "/guide/%5cevil", "/guide/\\evil", "/guide/%00", "/guide/%", "guide/chapter"]) {
    assert.equal(standaloneGuideRedirect(path, "", "GET", STANDALONE_GUIDE_ORIGIN), null, path);
  }
  assert.equal(standaloneGuideRedirect("/guide/__proto__", "", "GET", STANDALONE_GUIDE_ORIGIN), `${STANDALONE_GUIDE_ORIGIN}/docs/__proto__`);
  assert.equal(standaloneGuideRedirect("/guide/constructor", "", "GET", STANDALONE_GUIDE_ORIGIN), `${STANDALONE_GUIDE_ORIGIN}/docs/constructor`);
});

test("native routing accepts the flagged host partition for both Guide generations", () => {
  validateRouting("./microfrontends.json", {
    fdlc: ["/", "/architecture", "/guide", "/_next/static/chunks/fdlc.js", "/not-a-real-page"],
    "ai-software-factory-mastery": guidePaths.map((path) => ({ path, flag: GUIDE_HOST_FLAG })),
  });
  validateMiddlewareConfig(config, "./microfrontends.json");
  assert.deepEqual(config.matcher, [
    "/.well-known/vercel/microfrontends/client-config",
    "/((?!vc-ap-dd2962(?:/|$)).*)",
  ]);
});

test("Guide Host routes pages, old/new assets and custom 404 paths through the native SDK", async () => {
  for (const path of guidePaths) {
    const response = await proxy(new NextRequest(`${STANDALONE_GUIDE_ORIGIN}${path}`, {
      headers: { host: new URL(STANDALONE_GUIDE_ORIGIN).host },
    }));
    assert.equal(response.headers.get("x-middleware-request-x-vercel-mfe-zone"), "ai-software-factory-mastery", path);
    assert.equal(response.headers.has("location"), false, path);
  }
});

test("new Guide's other host paths dispatch without FDLC normalization or redirect loops", async () => {
  for (const path of [
    "/guide/search", "/search", "/architecture",
    "/guide/atlas", "/visuals", "/guide/01-understand/01-why-software-engineering-is-changing",
    "/docs/01-understand/01-why-software-engineering-is-changing",
  ]) {
    const request = new NextRequest(`${STANDALONE_GUIDE_ORIGIN}${path}`, { headers: { host: new URL(STANDALONE_GUIDE_ORIGIN).host } });
    const response = await proxy(request);
    assert.equal(response.headers.has("location"), false, path);
    assert.equal(response.headers.get("x-middleware-request-x-vercel-mfe-zone"), "ai-software-factory-mastery", path);
    assert.equal(request.nextUrl.pathname, path);
  }
});

test("only the bridge's verified Guide host normalizes architecture before child dispatch", async () => {
  for (const method of ["GET", "HEAD"]) for (const path of ["/guide/architecture", "/guide/architecture/"]) {
    const request = new NextRequest(`${STANDALONE_GUIDE_ORIGIN}${path}?ref=first&ref=second&q=a%2Fb`, { method });
    const response = await proxy(request);
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), `${STANDALONE_GUIDE_ORIGIN}/architecture?ref=first&ref=second&q=a%2Fb`);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    assert.equal(response.headers.has("x-middleware-request-x-vercel-mfe-zone"), false);
    assert.equal(request.nextUrl.pathname, path);
  }
  for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
    const response = await proxy(new NextRequest(`${STANDALONE_GUIDE_ORIGIN}/guide/architecture`, { method }));
    assert.equal(response.headers.has("location"), false, method);
    assert.equal(response.headers.get("x-middleware-request-x-vercel-mfe-zone"), "ai-software-factory-mastery", method);
  }
  const fdlc = await proxy(new NextRequest("https://www.fdlc.ai/guide/architecture?ref=private", { headers: { "x-forwarded-host": new URL(STANDALONE_GUIDE_ORIGIN).host } }));
  assert.equal(fdlc.headers.get("location"), `${STANDALONE_GUIDE_ORIGIN}/architecture`);
});

test("FDLC Host preserves root, architecture, assets and Mission Control despite forwarded-host input", async () => {
  for (const path of ["/", "/architecture", "/framework", "/mission-control", "/_next/static/chunks/fdlc.js", "/og.png", "/fdlc-logo-updated.png", "/infographics/diagram.svg"]) {
    const response = await proxy(new NextRequest(`https://www.fdlc.ai${path}`, {
      headers: { host: "www.fdlc.ai", "x-forwarded-host": new URL(STANDALONE_GUIDE_ORIGIN).host },
    }));
    assert.equal(response.headers.get("x-middleware-next"), "1", path);
    assert.equal(response.headers.has("x-middleware-request-x-vercel-mfe-zone"), false, path);
    assert.equal(response.headers.has("location"), false, path);
  }
});

test("FDLC Guide entry uses an uncached temporary navigation redirect", async () => {
  for (const method of ["GET", "HEAD"]) {
    const response = await proxy(new NextRequest("https://www.fdlc.ai/guide?token=private", {
      method, headers: { host: "www.fdlc.ai" },
    }));
    assert.equal(response.status, 307);
    assert.equal(response.headers.get("location"), `${STANDALONE_GUIDE_ORIGIN}/guide`);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
  }
});

test("FDLC Guide entry rejects other methods without forwarding bodies or rendering shadows", async () => {
  for (const path of ["/guide", "/guide/design", "/docs/chapter", "/search", "/guide/infographics/diagram.svg"]) {
    for (const method of ["POST", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      const response = await proxy(new NextRequest(`https://www.fdlc.ai${path}`, {
        method, headers: { host: "www.fdlc.ai" },
      }));
      assert.equal(response.status, 405, `${method} ${path}`);
      assert.equal(response.headers.get("allow"), "GET, HEAD");
      assert.equal(response.headers.get("cache-control"), "private, no-store");
      assert.equal(response.headers.has("location"), false);
      assert.equal(response.headers.has("x-middleware-next"), false);
      assert.equal(await response.text(), "Method not allowed");
    }
  }
  const response = await proxy(new NextRequest(`${STANDALONE_GUIDE_ORIGIN}/guide`, {
    method: "POST", headers: { host: new URL(STANDALONE_GUIDE_ORIGIN).host },
  }));
  assert.equal(response.headers.get("x-middleware-request-x-vercel-mfe-zone"), "ai-software-factory-mastery");
  assert.equal(response.headers.has("location"), false);
});

test("serves host-specific native client routing information without a redirect", async () => {
  for (const host of ["www.fdlc.ai", new URL(STANDALONE_GUIDE_ORIGIN).host]) {
    const response = await proxy(new NextRequest(`https://${host}/.well-known/vercel/microfrontends/client-config`, { headers: { host } }));
    assert.equal(response.status, 200);
    assert.equal(response.headers.has("location"), false);
    const body = await response.json();
    const applications = Object.values(body.config.applications) as { default: boolean; routing?: unknown[] }[];
    const child = applications.find((application) => !application.default);
    assert.ok(child);
    assert.equal(child.routing?.length, host === "www.fdlc.ai" ? 0 : 1);
  }
});

test("keeps content presentation intact while Guide navigation uses hard document boundaries", () => {
  for (const path of ["app/components/site-header.tsx", "app/components/site-footer.tsx", "app/page.tsx", "app/framework/page.tsx"]) {
    assert.match(readFileSync(path, "utf8"), /=== "\/guide" \? "a" : Link/, path);
  }
  for (const path of ["app/page.tsx", "app/framework/page.tsx", "app/architecture/page.tsx", "app/in-5-minutes/page.tsx"]) {
    assert.doesNotMatch(readFileSync(path, "utf8"), /<Link\b[^>]*href=(?:"\/guide|\{(?:guideByArea|item\.guideHref))/, path);
  }
});
