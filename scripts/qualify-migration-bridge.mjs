/** Read-only, cookie-free browser qualification. Never promotes or changes settings. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { approvedBaselineFailure, validateBaselineException } from "../lib/migration-baseline-exception.ts";
import { isSuccessfulGuidePrefetchCancellation } from "../lib/migration-browser-network.ts";

const options = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const separator = argument.indexOf("=");
  assert.ok(argument.startsWith("--") && separator > 2, "Use --key=value arguments");
  return [argument.slice(2, separator), argument.slice(separator + 1)];
}));
const guideOrigin = new URL(options.guide).origin;
const fdlcOrigin = options.fdlc ? new URL(options.fdlc).origin : null;
const canonicalOrigin = new URL(options.canonical).origin;
const edition = options.edition;
assert.ok(["old", "new"].includes(edition), "--edition must be old or new");
const baselineException = validateBaselineException(options["baseline-exception"], edition, options.deployment);
const output = resolve(options.output);
await mkdir(output, { recursive: true });
const prefix = edition === "old" ? "/_next/" : "/vc-ap-dd2962/_next/";
const guidePath = (slug) => slug === "guide" ? "/guide"
  : edition === "new" && slug === "appendix/glossary" ? "/guide/glossary"
    : `${edition === "old" ? "/docs" : "/guide"}/${slug}`;
const searchPath = edition === "old" ? "/search" : "/guide/search";
const indexPath = edition === "old" ? "/search-index.json" : "/guide/search-index.json";
const mermaidPath = guidePath("02-design/07-governance-policy-and-risk-proportional-approval");
const chapterPath = guidePath("01-understand/02-the-factory-in-one-view");
const result = {
  startedAt: new Date().toISOString(), edition, guideOrigin, fdlcOrigin, canonicalOrigin,
  expectedGuideDeployment: options.deployment ?? null,
  expectedAssetPrefix: prefix, anonymous: true, checks: [], pages: [], assets: [],
  console: [], pageErrors: [], networkFailures: [], successfulPrefetchCancellations: [], failures: [], acceptedBaselineExceptions: [],
  attributionLimit: "Public response bytes and asset hashes are recorded; deployment identity requires separate immutable deployment/config evidence.",
};
const check = (name, condition, actual) => {
  const acceptedBaselineException = !condition && approvedBaselineFailure(baselineException, name, actual);
  const entry = { name, pass: Boolean(condition), ...(actual === undefined ? {} : { actual }), ...(acceptedBaselineException ? { acceptedBaselineException } : {}) };
  result.checks.push(entry);
  if (acceptedBaselineException) result.acceptedBaselineExceptions.push(entry);
  else if (!condition) result.failures.push({ name, actual });
};
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
async function request(path, origin = guideOrigin) {
  const response = await fetch(new URL(path, origin), { redirect: "manual", signal: AbortSignal.timeout(30_000) });
  return { response, body: await response.text() };
}

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const managedAssets = new Map();
const pendingResponses = new Set();
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  check("fresh browser context has no cookies", (await context.cookies()).length === 0);
  const page = await context.newPage();
  const requestPages = new WeakMap();
  page.on("request", (request) => requestPages.set(request, page.url()));
  const expected404 = new URL("/guide/bridge-qualification-no-such-page", guideOrigin).href;
  page.on("pageerror", (error) => result.pageErrors.push({ page: page.url(), message: error.message }));
  page.on("console", (message) => {
    if (!["error", "warning"].includes(message.type())) return;
    result.console.push({ type: message.type(), page: page.url(), message: message.text(), location: message.location() });
  });
  page.on("requestfailed", (request) => {
    const job = (async () => {
      const response = await request.response();
      const headers = request.headers();
      const responseHeaders = response?.headers() ?? {};
      const observation = {
        pageUrl: requestPages.get(request) ?? "", url: request.url(), method: request.method(),
        type: request.resourceType(), isNavigationRequest: request.isNavigationRequest(), error: request.failure()?.errorText,
        requestHeaders: Object.fromEntries(["rsc", "next-router-prefetch", "next-router-segment-prefetch", "next-router-state-tree", "next-action"].filter((key) => headers[key] !== undefined).map((key) => [key, headers[key]])),
        response: response ? { url: response.url(), status: response.status(), headers: Object.fromEntries(["content-type", "vary"].filter((key) => responseHeaders[key] !== undefined).map((key) => [key, responseHeaders[key]])) } : null,
      };
      if (isSuccessfulGuidePrefetchCancellation(observation, guideOrigin)) result.successfulPrefetchCancellations.push(observation);
      else result.networkFailures.push(observation);
    })().catch((error) => result.failures.push({ name: "failed request inspection", message: error.message }));
    pendingResponses.add(job);
    void job.finally(() => pendingResponses.delete(job));
  });
  page.on("response", (response) => {
    const job = (async () => {
      const request = response.request();
      const url = new URL(response.url());
      if (response.status() >= 400 && response.url() !== expected404) {
        result.networkFailures.push({ url: response.url(), type: request.resourceType(), status: response.status() });
      }
      if (!["script", "stylesheet"].includes(request.resourceType()) || !url.pathname.includes("/_next/")) return;
      const key = response.url();
      if (managedAssets.has(key)) return;
      const entry = { url: key, page: page.url(), type: request.resourceType(), status: response.status() };
      managedAssets.set(key, entry);
      try { entry.sha256 = sha256(await response.body()); } catch (error) { entry.bodyError = error.message; }
    })();
    pendingResponses.add(job);
    job.finally(() => pendingResponses.delete(job));
  });

  async function inspect(path, { reload = false, expectStatus = 200, canonical = true } = {}) {
    const response = reload
      ? await page.reload({ waitUntil: "networkidle" })
      : await page.goto(new URL(path, guideOrigin).href, { waitUntil: "networkidle" });
    check(`${path} ${reload ? "reload" : "direct"} HTTP`, response?.status() === expectStatus, response?.status());
    const details = await page.evaluate(() => {
      const ids = Array.from(document.querySelectorAll("[id]")).map((element) => element.id);
      const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
      return {
        title: document.title, h1: document.querySelector("h1")?.textContent,
        mainCount: document.querySelectorAll("main").length, duplicateIds,
        duplicateIdCounts: Object.fromEntries(duplicateIds.sort().map((id) => [id, ids.filter((value) => value === id).length])),
        width: window.innerWidth, scrollWidth: document.documentElement.scrollWidth,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
        headerCount: document.querySelectorAll("header").length, footerCount: document.querySelectorAll("footer").length,
        assetPaths: [...document.querySelectorAll('script[src], link[rel="stylesheet"]')].map((element) => element.getAttribute("src") ?? element.getAttribute("href")),
      };
    });
    result.pages.push({ path, url: page.url(), reload, ...details });
    check(`${path} one main`, details.mainCount === 1, details.mainCount);
    check(`${path} duplicate IDs`, details.duplicateIds.length === 0, details.duplicateIdCounts);
    check(`${path} overflow ${details.width}`, details.scrollWidth <= details.width + 1, details.scrollWidth);
    check(`${path} Guide heading`, Boolean(details.h1), details.h1);
    check(`${path} header/footer`, details.headerCount >= 1 && details.footerCount === 1, [details.headerCount, details.footerCount]);
    if (canonical && expectStatus === 200) {
      check(`${path} canonical origin`, details.canonical && new URL(details.canonical).origin === canonicalOrigin, details.canonical);
      if (edition === "new") {
        check(`${path} exact canonical path`, details.canonical === new URL(new URL(page.url()).pathname, canonicalOrigin).href, details.canonical);
      }
      check(`${path} description`, Boolean(details.description));
    }
    const assets = details.assetPaths.filter((asset) => asset?.includes("/_next/"));
    check(`${path} JS/CSS present`, assets.some((asset) => /\.js(?:\?|$)/.test(asset)) && assets.some((asset) => /\.css(?:\?|$)/.test(asset)));
    check(`${path} asset namespace`, assets.length > 0 && assets.every((asset) => new URL(asset, guideOrigin).pathname.startsWith(prefix)), assets);
    return details;
  }

  const index = await request(indexPath);
  check("search index HTTP", index.response.status === 200, index.response.status);
  const documents = JSON.parse(index.body);
  assert.ok(Array.isArray(documents) && documents.length >= 60, "Authoritative Guide index missing/incomplete");
  result.authoritativeDocumentCount = documents.length;
  const paths = [...new Set(["/guide", ...documents.map((document) => guidePath(document.slug))])];
  const supplementary = edition === "old"
    ? ["/architecture", "/visuals", "/topics", "/coverage", "/glossary", "/search"]
    : ["/guide/architecture", "/guide/atlas", "/guide/topics", "/guide/coverage", "/guide/glossary", "/guide/search"];
  for (const path of [...new Set([...paths, ...supplementary])]) {
    await inspect(path);
    if (edition === "new") await inspect(path, { reload: true });
    process.stdout.write(`Checked desktop ${path}\n`);
  }
  await inspect(chapterPath);
  await inspect(chapterPath, { reload: true });
  await inspect(searchPath);
  const search = page.getByPlaceholder("Search agents, harnesses, evidence, environments…");
  await search.fill("evidence architecture");
  await page.waitForFunction(() => /matching section/.test(document.querySelector(".search-summary")?.textContent ?? ""));
  check("hydrated search", await page.locator(".search-result").count() > 0);
  await page.getByRole("button", { name: "Use dark theme" }).click();
  check("theme changes", await page.locator("html").getAttribute("data-theme") === "dark");
  await page.reload({ waitUntil: "networkidle" });
  check("theme persists on reload", await page.locator("html").getAttribute("data-theme") === "dark");
  await inspect(mermaidPath);
  await page.locator(".mermaid-diagram svg").first().waitFor({ timeout: 20_000 });
  check("Mermaid SVG rendered", await page.locator(".mermaid-diagram svg").count() > 0);
  check("no Mermaid fallback", await page.locator(".mermaid-fallback").count() === 0);
  const guideHome = edition === "old"
    ? page.getByRole("link", { name: /Guide home$/i }).first()
    : page.getByRole("navigation", { name: "Primary navigation", exact: true }).getByRole("link", { name: "Guide", exact: true });
  await guideHome.click();
  await page.waitForLoadState("networkidle");
  check("Guide home stays in Guide", new URL(page.url()).origin === guideOrigin && /guide/i.test(await page.title()), page.url());

  await inspect("/guide/bridge-qualification-no-such-page", { expectStatus: 404, canonical: false });
  check("Guide custom 404", await page.locator("h1").textContent() === "That page is not in the guide.");
  check("404 theme hydrated", await page.getByRole("button", { name: "Use light theme" }).count() === 1);
  await page.getByRole("button", { name: "Use light theme" }).click();

  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of [...new Set([...paths, ...supplementary])]) {
    await inspect(path);
    if (edition === "new") await inspect(path, { reload: true });
    process.stdout.write(`Checked mobile ${path}\n`);
  }
  await inspect("/guide");
  await page.screenshot({ path: resolve(output, "guide-mobile.png"), fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await inspect("/guide");
  await page.screenshot({ path: resolve(output, "guide-desktop.png"), fullPage: true });

  for (const path of edition === "old" ? ["/sitemap.xml", "/robots.txt"] : ["/guide/sitemap.xml", "/guide/robots.txt"]) {
    const discovery = await request(path);
    check(`${path} discovery HTTP`, discovery.response.status === 200, discovery.response.status);
    check(`${path} canonical authority`, discovery.body.includes(canonicalOrigin));
    result.checks.push({ name: `${path} bytes`, pass: true, sha256: sha256(discovery.body) });
  }

  // Evaluate Guide-only requests before visiting the other application.
  await Promise.all([...pendingResponses]);
  result.assets = [...managedAssets.values()];
  result.guideAssets = [...managedAssets.values()];
  check("all Guide managed assets use expected namespace", result.assets.every((asset) => new URL(asset.url).pathname.startsWith(prefix)));
  check("all Guide managed assets successful", result.assets.every((asset) => asset.status === 200));
  check("all Guide managed asset bodies hashed", result.assets.every((asset) => /^[a-f0-9]{64}$/.test(asset.sha256 ?? "") && !asset.bodyError));

  if (fdlcOrigin) {
    await page.goto(fdlcOrigin, { waitUntil: "networkidle" });
    check("FDLC root identity", (await page.title()).includes("FDLC"), await page.title());
    await page.getByRole("navigation", { name: "Primary navigation", exact: true }).getByRole("link", { name: "Guide", exact: true }).click();
    await page.waitForLoadState("networkidle");
    check("FDLC to Guide ownership", new URL(page.url()).origin === guideOrigin && /guide/i.test(await page.title()), page.url());
  }
  await Promise.all([...pendingResponses]);
  const productErrors = result.console.filter((entry) => entry.type === "error" && !(
    /^Failed to load resource: the server responded with a status of 404 \((?:Not Found)?\)$/.test(entry.message)
    && entry.location.url === expected404
  ));
  check("zero product console errors", productErrors.length === 0, productErrors);
  check("zero page errors / hydration failures", result.pageErrors.length === 0, result.pageErrors);
  check("zero unexpected network failures", result.networkFailures.length === 0, result.networkFailures);
} catch (error) {
  result.failures.push({ name: "qualification interrupted", message: error.stack });
} finally {
  await Promise.all([...pendingResponses]);
  result.assets = [...managedAssets.values()];
  await browser.close();
  result.finishedAt = new Date().toISOString();
  result.pass = result.failures.length === 0;
  result.disposition = !result.pass ? "FAIL" : result.acceptedBaselineExceptions.length
    ? "PASS_WITH_APPROVED_OLD_GUIDE_BASELINE_EXCEPTIONS" : "PASS";
  await writeFile(resolve(output, "acceptance.json"), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ pass: result.pass, checks: result.checks.length, pages: result.pages.length, failures: result.failures, output })}\n`);
  if (!result.pass) process.exitCode = 1;
}
