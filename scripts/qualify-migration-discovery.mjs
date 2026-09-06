/**
 * Read-only new-Guide discovery/accessibility qualification. No exceptions.
 * Node >=22.13; Guide dependencies must already be installed.
 * Example (existing native bridge pair; this script never starts a server):
 * node --experimental-strip-types scripts/qualify-migration-discovery.mjs \
 *   --guide=http://127.0.0.1:3024 --fdlc=http://localhost:3024 \
 *   --direct-guide=http://127.0.0.1:6125 --transport=composed --topology=bridge \
 *   --canonical=standalone --mode=compatible --guide-source=/absolute/Guide \
 *   --output=/tmp/discovery
 * Final FDLC composition uses --topology=final, without --fdlc. Canonical and
 * mode remain explicit: final FDLC can first serve compatible standalone Guide.
 * --plan validates source contracts without contacting any origin.
 * --mermaid=all additionally visits every generated document containing diagrams.
 * --native-flag-hop=http://localhost:3024 records the official local SDK's
 * flagged-route rewrite. It requires loopback bridge origins and raw Guide;
 * standalone-host normalization through that hop is NOT_EXPOSED, never PASS.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { dirname, isAbsolute, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isSuccessfulGuidePrefetchCancellation, MIGRATION_PREFETCH_REQUEST_HEADERS, MIGRATION_PREFETCH_RESPONSE_HEADERS } from "../lib/migration-browser-network.ts";

const allowed = new Set(["guide", "fdlc", "direct-guide", "native-flag-hop", "canonical", "mode", "transport", "topology", "guide-source", "output", "mermaid", "plan"]);
const options = {};
for (let index = 2; index < process.argv.length; index++) {
  const argument = process.argv[index];
  const separator = argument.indexOf("=");
  const key = argument.slice(2, separator === -1 ? undefined : separator);
  assert.ok(argument.startsWith("--") && allowed.has(key) && !Object.hasOwn(options, key), "Use unique allowed --key=value or --key value arguments");
  const value = separator === -1 ? (key === "plan" ? "true" : process.argv[++index]) : argument.slice(separator + 1);
  assert.ok(value && !value.startsWith("--"), `Missing --${key} value`);
  options[key] = value;
}
function origin(value, key) {
  const url = new URL(value);
  assert.ok(["http:", "https:"].includes(url.protocol) && url.origin === value && !url.username && !url.password, `--${key} must be an exact credential-free HTTP(S) origin`);
  return url.origin;
}
const guide = origin(options.guide, "guide");
const fdlc = options.fdlc ? origin(options.fdlc, "fdlc") : null;
const directGuide = options["direct-guide"] ? origin(options["direct-guide"], "direct-guide") : null;
const nativeFlagHop = options["native-flag-hop"] ? origin(options["native-flag-hop"], "native-flag-hop") : null;
assert.ok(["standalone", "www"].includes(options.canonical), "--canonical must be standalone or www");
assert.ok(["compatible", "final"].includes(options.mode), "--mode must be compatible or final");
assert.ok(["direct", "composed"].includes(options.transport), "--transport must be direct or composed");
assert.ok(options.transport === "direct" ? options.topology === undefined && !fdlc && !directGuide : ["bridge", "final"].includes(options.topology), "Composed transport requires --topology=bridge|final; direct transport has no topology/secondary origins");
assert.ok(!fdlc || (options.topology === "bridge" && fdlc !== guide), "--fdlc is only the distinct bridge FDLC origin");
assert.ok(options.topology !== "bridge" || (options.mode === "compatible" && options.canonical === "standalone" && fdlc), "Bridge qualification requires compatible standalone Guide and --fdlc");
assert.ok(options.mode !== "final" || options.canonical === "www", "Final Guide must have www canonicals");
assert.ok(options.mode !== "compatible" || options.canonical === "standalone", "Compatible Guide must retain standalone canonicals");
if (nativeFlagHop) {
  assert.ok(options.transport === "composed" && options.topology === "bridge" && directGuide,
    "Native flagged-hop qualification requires composed bridge topology and a separate raw Guide origin");
  const guideUrl = new URL(guide), fdlcUrl = new URL(fdlc), directUrl = new URL(directGuide);
  assert.ok(guideUrl.protocol === "http:" && guideUrl.hostname === "127.0.0.1" && guideUrl.port
    && fdlcUrl.origin === `http://localhost:${guideUrl.port}`
    && directUrl.protocol === "http:" && directUrl.hostname === "127.0.0.1" && directUrl.port && directUrl.port !== guideUrl.port
    && nativeFlagHop === fdlcUrl.origin,
  "Native flagged-hop scope is limited to distinct loopback Guide/FDLC bridge hosts and a distinct raw Guide port");
}
assert.ok(!options.plan || options.plan === "true", "--plan takes no value other than true");
assert.ok(!options.mermaid || ["all", "visited"].includes(options.mermaid), "--mermaid must be all or visited");
assert.ok(isAbsolute(options["guide-source"] ?? "") && isAbsolute(options.output ?? ""), "--guide-source and --output must be absolute paths");

const site = resolve(options["guide-source"], "site");
const output = resolve(options.output);
const harnessDirectory = dirname(fileURLToPath(import.meta.url));
const require = createRequire(`${site}/package.json`);
const { chromium } = require("playwright");
const { default: AxeBuilder } = await import(pathToFileURL(require.resolve("@axe-core/playwright")));
const { legacyDocumentRedirects, retiredFdlcSummaryRedirects, legacyAnchorRedirects } = await import(pathToFileURL(`${site}/lib/legacy-routes.ts`));
const { publishedGuideDocuments } = await import(pathToFileURL(`${site}/lib/routes.generated.ts`));
const { documents } = await import(pathToFileURL(`${site}/lib/content.generated.ts`));
const { legacyGuideRedirectPaths } = await import(pathToFileURL(`${site}/lib/legacy-host.ts`));
const { GUIDE_ROUTES, STANDALONE_GUIDE_ORIGIN, FDLC_ORIGIN, standaloneGuidePagePath, guideNavigationHref } = await import(pathToFileURL(`${site}/lib/paths.ts`));
const { compatibleGuideRedirectPath } = await import(pathToFileURL(`${site}/lib/compatible-host.ts`));
const canonical = options.canonical === "standalone" ? STANDALONE_GUIDE_ORIGIN : FDLC_ORIGIN;
const compatible = options.mode === "compatible";
const canonicalPath = (path) => compatible ? standaloneGuidePagePath(path) ?? path : path;
// Guide architecture is the one legacy path colliding with final FDLC ownership.
const requestPath = (path) => compatible && !(options.topology === "final" && path === GUIDE_ROUTES.architecture) ? canonicalPath(path) : path;
const rawGuide = options.transport === "direct" ? guide : directGuide;
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const git = (...args) => execFileSync("git", args, { cwd: site, encoding: "utf8" }).trim();
const source = { commit: git("rev-parse", "HEAD"), trackedDiffSha256: sha256(git("diff", "HEAD", "--", ".")), files: {} };
for (const path of ["lib/routes.generated.ts", "lib/content.generated.ts", "lib/legacy-routes.ts", "lib/legacy-host.ts", "lib/compatible-host.ts", "lib/paths.ts", "lib/metadata.ts", "app/globals.css", "config/microfrontends.generated.json", "config/microfrontends.generated.manifest.json"]) source.files[path] = sha256(await readFile(`${site}/${path}`));
const record = {
  startedAt: new Date().toISOString(), guide, fdlc, directGuide, nativeFlagHop, canonical, guideSource: resolve(options["guide-source"]),
  mode: options.mode, transport: options.transport, topology: options.topology ?? "standalone", source,
  harness: { commit: execFileSync("git", ["rev-parse", "HEAD"], { cwd: harnessDirectory, encoding: "utf8" }).trim(), sha256: sha256(await readFile(fileURLToPath(import.meta.url))), networkClassifierSha256: sha256(await readFile(resolve(harnessDirectory, "../lib/migration-browser-network.ts"))) },
  anonymous: true, exceptions: [], checks: [], failures: [], notExposed: [], redirects: [], seo: [], accessibility: [], contrastRegressions: [], diagrams: [], movedAnchors: [], console: [], pageErrors: [], networkFailures: [], successfulPrefetchCancellations: [],
  evidenceLimits: [
    "Observed source lineage and selected origins are recorded; source arguments alone do not prove hosted deployment identity or current-selector behavior.",
    "Raw Next aliases/discovery and native MFE composed ownership are distinct scopes. FDLC-owned root and /architecture are never tested as composed Guide aliases in final topology.",
    "No Host overrides, authentication, protection bypasses, server starts, project settings, environment changes, Production writes or Mission Control backend requests.",
    "Legacy-host retirement identity and runtime logs require separate qualification. This harness checks app aliases and bridge cross-origin query privacy, not an unqualified old-host Production redirect.",
    "Axe WCAG2 A/AA runs without exclusions or impact filtering. Every violation fails; incomplete results are retained for manual review, not asserted as passing tests.",
  ],
};
if (nativeFlagHop) {
  record.notExposed.push({ scope: "composed-Guide standalone-host normalization", status: "NOT_EXPOSED", reason: "The official local SDK rewrites flagged child routes to localhost; raw Guide GET/HEAD and hosted Guide-host qualification independently test normalization. Every composed route must prove the exact observed x-middleware-rewrite hop." });
  const sdkMiddleware = resolve(harnessDirectory, "../node_modules/@vercel/microfrontends/dist/next/middleware.js");
  record.harness.nativeFlaggedHopSdk = { path: sdkMiddleware, sha256: sha256(await readFile(sdkMiddleware)) };
}
let completed = false;
function check(name, pass, actual) {
  const entry = { name, pass: Boolean(pass), status: pass ? "PASS" : "FAIL", ...(actual === undefined ? {} : { actual }) };
  record.checks.push(entry);
  if (!pass) record.failures.push(entry);
}
async function save() {
  await mkdir(output, { recursive: true });
  record.updatedAt = new Date().toISOString();
  if (completed) record.finishedAt = record.updatedAt;
  record.manualReviewRequired = record.accessibility.some(({ incomplete }) => incomplete.length > 0);
  record.status = options.plan ? "NOT_RUN" : record.failures.length ? "NO_GO" : !completed ? "RUNNING" : record.manualReviewRequired ? "AUTOMATED_PASS_MANUAL_REVIEW_REQUIRED" : "PASS";
  await writeFile(`${output}/discovery.json`, JSON.stringify(record, null, 2));
}
async function request(base, path, method = "GET") {
  return fetch(new URL(path, base), { method, redirect: "manual", signal: AbortSignal.timeout(20_000) });
}
const query = "ref=first&ref=second&q=a%2Fb&q=evidence&token=synthetic-qa-marker";
const tools = { "/": GUIDE_ROUTES.home, "/architecture": GUIDE_ROUTES.architecture, "/atlas": GUIDE_ROUTES.atlas, "/visuals": GUIDE_ROUTES.atlas, "/coverage": GUIDE_ROUTES.coverage, "/glossary": GUIDE_ROUTES.glossary, "/search": GUIDE_ROUTES.search, "/topics": GUIDE_ROUTES.topics };
const aliases = new Map(Object.entries(tools));
for (const [slug, destination] of publishedGuideDocuments) aliases.set(`/docs/${slug}`, destination);
for (const [old, current] of Object.entries(legacyDocumentRedirects)) {
  aliases.set(`/docs/${old}`, `/guide/${current}`);
  aliases.set(`/guide/${old}`, `/guide/${current}`);
}
for (const [summary, slug] of Object.entries(retiredFdlcSummaryRedirects)) aliases.set(`/guide/${summary}`, `/guide/${slug}`);
aliases.set("/guide/guide", GUIDE_ROUTES.home);
aliases.set("/guide/appendix/glossary", GUIDE_ROUTES.glossary);
const canonicalPaths = [...new Set([...publishedGuideDocuments.map(([, path]) => path), ...Object.values(GUIDE_ROUTES)])].sort();
const sitemapPaths = canonicalPaths.filter((path) => path !== GUIDE_ROUTES.search);
assert.equal(canonicalPaths.length, 71, "Authoritative Guide route count changed; review contract");
assert.equal(aliases.size, 138, "Guide alias count changed; review contract");
for (const path of canonicalPaths) assert.equal(legacyGuideRedirectPaths.get(path), path, `Legacy-host allowlist lost canonical ${path}`);
for (const [path, target] of aliases) assert.equal(legacyGuideRedirectPaths.get(path), target, `App alias differs from legacy-host allowlist: ${path}`);
const routeContracts = new Map([...aliases, ...canonicalPaths.map((path) => [path, path])]);
const composedContracts = [...routeContracts].filter(([path]) => options.topology !== "final" || (path !== "/" && path !== "/architecture"));
record.coverage = { canonicalPaths, physicalCanonicalPaths: canonicalPaths.map(canonicalPath), sitemapPaths: sitemapPaths.map(canonicalPath), appAliasCount: aliases.size, appRouteContractCount: routeContracts.size, composedRouteContractCount: composedContracts.length, rawGuideAliases: Boolean(rawGuide), movedAnchorCount: Object.values(legacyAnchorRedirects).reduce((total, values) => total + Object.keys(values).length, 0), axeRoutes: ["/guide", "/guide/atlas", "/guide/topics", "/guide/01-understand/02-the-factory-in-one-view", "/guide/glossary"], axeWidths: [1280, 390], axeThemes: ["light", "dark"], mermaidScope: options.mermaid ?? "visited" };
record.coverage.movedAnchorCaseCount = Object.entries(legacyAnchorRedirects).reduce((total, [source, anchors]) => total + Object.keys(anchors).length * new Set([`/guide/${source}`, standaloneGuidePagePath(`/guide/${source}`)]).size, 0);

function expectedRoute(base, path, destination, method) {
  if (!compatible) return { status: aliases.has(path) ? 308 : 200, destination };
  // This calls the committed source's pure host classifier with explicit local
  // qualification context. It never overrides HTTP Host or a running process.
  const temporary = compatibleGuideRedirectPath(new URL(base).host, path, method, { GUIDE_NATIVE_LOCAL: "1" }, canonical);
  if (temporary) return { status: 307, destination: temporary, private: true };
  if (!aliases.has(path)) return { status: 200, destination };
  const slug = path.startsWith("/docs/") ? path.slice("/docs/".length) : null;
  const currentDocument = publishedGuideDocuments.some(([published]) => published === slug);
  const currentTool = Object.hasOwn(tools, path) && !["/", "/atlas"].includes(path);
  if ((currentDocument && !["guide", "appendix/glossary"].includes(slug)) || currentTool) return { status: 200, destination };
  return { status: 308, destination: guideNavigationHref(destination, canonical) };
}

async function redirects(base, routes, scope) {
  for (const [path, destination] of routes) for (const method of ["GET", "HEAD"]) {
    const response = await request(base, `${path}?${query}`, method);
    const location = response.headers.get("location");
    const throughNativeFlagHop = scope === "composed-Guide" && nativeFlagHop;
    // Host-isolation bridge normalizes this one alias before SDK dispatch.
    // Every other route must still prove the original native flagged hop.
    const bridgeArchitecture = throughNativeFlagHop && compatible && path === "/guide/architecture";
    const expected = bridgeArchitecture
      ? { status: 307, destination: "/architecture", private: true }
      : expectedRoute(throughNativeFlagHop || base, path, destination, method);
    const actual = { scope, path, method, status: response.status, location, cache: response.headers.get("cache-control"), rewrite: response.headers.get("x-middleware-rewrite"), expected };
    record.redirects.push(actual);
    if (throughNativeFlagHop) check(`${scope}: ${method} ${path} proves the exact native flagged-hop boundary`, bridgeArchitecture ? actual.rewrite === null : actual.rewrite === `${nativeFlagHop}${path}?${query}`, actual);
    const resolved = location ? new URL(location, base).href : null;
    if (expected.status === 200) {
      const html = method === "GET" ? await response.text() : "";
      const canonicalUrl = `${canonical}${canonicalPath(destination)}`;
      const hasExpectedCanonical = method === "HEAD" || html.includes(`rel="canonical" href="${canonicalUrl}"`);
      check(`${scope}: ${method} ${path} serves the canonical Guide page`, response.status === 200 && !location && hasExpectedCanonical, actual);
    } else {
      check(`${scope}: ${method} ${path} preserves the same-origin query`, response.status === expected.status && resolved === `${base}${expected.destination}?${query}` && (!expected.private || (actual.cache?.includes("private") && actual.cache?.includes("no-store"))), actual);
    }
    if (!response.bodyUsed) await response.body?.cancel();
  }
}
async function bridgeRedirects() {
  const paths = new Map([
    ["/guide", "/guide"], ["/guide/search", "/search"], ["/search", "/search"], ["/guide/architecture", "/architecture"], ["/guide/atlas", "/visuals"], ["/atlas", "/visuals"], ["/guide/topics", "/topics"], ["/guide/coverage", "/coverage"], ["/guide/glossary", "/glossary"], ["/visuals", "/visuals"], ["/topics", "/topics"], ["/coverage", "/coverage"], ["/glossary", "/glossary"],
  ]);
  for (const [slug] of publishedGuideDocuments) {
    paths.set(`/docs/${slug}`, `/docs/${slug}`);
    paths.set(`/guide/${slug}`, `/docs/${slug}`);
  }
  for (const old of Object.keys(legacyDocumentRedirects)) {
    paths.set(`/docs/${old}`, `/docs/${old}`);
    paths.set(`/guide/${old}`, `/docs/${old}`);
  }
  for (const [summary, slug] of Object.entries(retiredFdlcSummaryRedirects)) paths.set(`/guide/${summary}`, `/docs/${slug}`);
  for (const [path, destination] of paths) for (const method of ["GET", "HEAD"]) {
    const response = await request(fdlc, `${path}?${query}`, method);
    const location = response.headers.get("location");
    const cache = response.headers.get("cache-control");
    const expected = `${guide}${destination}${["/guide/search", "/search"].includes(path) ? "?q=a%2Fb&q=evidence" : ""}`;
    const actual = { scope: "bridge-cross-origin", path, method, status: response.status, location, cache };
    record.redirects.push(actual);
    check(`bridge: ${method} ${path} temporary redirect retains search q only`, response.status === 307 && location === expected && cache?.includes("private") && cache?.includes("no-store"), actual);
    await response.body?.cancel();
  }
}
const locations = (xml) => [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
async function discovery() {
  const robotsText = `User-agent: *\nAllow: /guide/\nSitemap: ${canonical}/guide/sitemap.xml\n`;
  for (const method of ["GET", "HEAD"]) {
    const response = await request(guide, "/guide/robots.txt", method);
    check(`namespaced robots ${method}`, response.status === 200 && (method === "HEAD" || await response.text() === robotsText), { status: response.status });
    if (!response.bodyUsed) await response.body?.cancel();
    const sitemap = await request(guide, "/guide/sitemap.xml", method);
    const actualLocations = method === "GET" ? locations(await sitemap.text()) : [];
    check(`namespaced sitemap ${method} has exact authoritative paths without search`, sitemap.status === 200 && (method === "HEAD" || JSON.stringify([...actualLocations].sort()) === JSON.stringify(sitemapPaths.map((path) => `${canonical}${canonicalPath(path)}`).sort())), { status: sitemap.status, locations: actualLocations });
    if (!sitemap.bodyUsed) await sitemap.body?.cancel();
  }
  // In final composition root discovery belongs to FDLC, not the Guide app.
  const rootOrigin = rawGuide ?? (options.topology === "bridge" ? guide : null);
  if (rootOrigin) for (const method of ["GET", "HEAD"]) for (const path of ["/robots.txt", "/sitemap.xml"]) {
    const response = await request(rootOrigin, path, method);
    const body = method === "GET" ? await response.text() : "";
    const compatible = options.mode === "compatible";
    const exactBody = path === "/robots.txt" ? body === robotsText : body.includes("<sitemapindex") && JSON.stringify(locations(body)) === JSON.stringify([`${canonical}/guide/sitemap.xml`]);
    check(`Guide-owned root ${method} ${path}: ${compatible ? "standalone discovery" : "retired discovery absent"}`, compatible ? response.status === 200 && (method === "HEAD" || exactBody) : response.status === 404, { origin: rootOrigin, status: response.status });
    if (!response.bodyUsed) await response.body?.cancel();
  }
  for (const path of canonicalPaths) {
    const physicalPath = requestPath(path);
    const response = await request(guide, physicalPath);
    const html = await response.text();
    const canonicals = [...html.matchAll(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"[^>]*>/g)].map((match) => match[1]);
    const metadata = (property) => [...html.matchAll(new RegExp(`<meta\\b[^>]*(?:property|name)="${property}"[^>]*content="([^"]+)"[^>]*>`, "g"))].map((match) => match[1]);
    const actual = { path, requestPath: physicalPath, status: response.status, canonicals, ogUrl: metadata("og:url"), ogImage: metadata("og:image"), twitterImage: metadata("twitter:image"), robots: metadata("robots"), mains: [...html.matchAll(/<main(?:\s|>)/g)].length };
    record.seo.push(actual);
    check(`canonical, OG and main ${path}`, response.status === 200 && JSON.stringify(canonicals) === JSON.stringify([`${canonical}${canonicalPath(path)}`]) && JSON.stringify(actual.ogUrl) === JSON.stringify(canonicals) && JSON.stringify(actual.ogImage) === JSON.stringify([`${canonical}/guide/og-v2.png`]) && JSON.stringify(actual.twitterImage) === JSON.stringify(actual.ogImage) && actual.mains === 1, actual);
    if (path === GUIDE_ROUTES.search) check("Search is noindex and excluded from sitemap", actual.robots.some((value) => value.split(/,\s*/).includes("noindex")) && !sitemapPaths.includes(path), actual.robots);
  }
  const socialImage = await request(guide, "/guide/og-v2.png");
  check("namespaced OpenGraph image resolves", socialImage.status === 200 && socialImage.headers.get("content-type")?.startsWith("image/png"), { status: socialImage.status, type: socialImage.headers.get("content-type") });
  await socialImage.body?.cancel();
}

const selectedHeaders = (headers, names) => Object.fromEntries(names.filter((name) => headers[name] !== undefined).map((name) => [name, headers[name]]));
let checkpoint = "startup";
function observe(page) {
  const requests = new WeakMap();
  page.on("request", (request) => requests.set(request, { url: request.url(), pageUrl: page.url(), method: request.method(), type: request.resourceType(), isNavigationRequest: request.isNavigationRequest(), requestHeaders: selectedHeaders(request.headers(), MIGRATION_PREFETCH_REQUEST_HEADERS), response: null }));
  page.on("response", (response) => {
    const entry = requests.get(response.request());
    if (entry) entry.response = { url: response.url(), status: response.status(), headers: selectedHeaders(response.headers(), MIGRATION_PREFETCH_RESPONSE_HEADERS) };
    if (response.status() >= 400) record.networkFailures.push({ checkpoint, url: response.url(), status: response.status() });
  });
  page.on("requestfailed", (request) => {
    const entry = { ...requests.get(request), error: request.failure()?.errorText ?? null };
    if (isSuccessfulGuidePrefetchCancellation(entry, guide)) record.successfulPrefetchCancellations.push({ checkpoint, ...entry });
    else record.networkFailures.push({ checkpoint, ...entry });
  });
  page.on("console", (message) => { if (["error", "warning"].includes(message.type())) record.console.push({ checkpoint, type: message.type(), message: message.text(), location: message.location() }); });
  page.on("pageerror", (error) => record.pageErrors.push({ checkpoint, message: error.message, url: page.url() }));
}
async function diagrams(page, path) {
  await page.waitForFunction(() => [...document.querySelectorAll(".mermaid-diagram")].every((element) => element.querySelector("svg")), undefined, { timeout: 30_000 });
  const actual = await page.evaluate(() => ({ containers: document.querySelectorAll(".mermaid-diagram").length, svgs: document.querySelectorAll(".mermaid-diagram > svg").length, fallbacks: document.querySelectorAll(".mermaid-fallback").length }));
  const document = documents.find((document) => publishedGuideDocuments.find(([slug]) => slug === document.slug)?.[1] === path);
  // Generated Markdown is authoritative for document diagrams. Tool pages use
  // their observed containers; their own data models are not invented here.
  const expected = document && ![GUIDE_ROUTES.home, GUIDE_ROUTES.glossary].includes(path) ? [...document.content.matchAll(/^\s*```mermaid\s*$/gm)].length : actual.containers;
  record.diagrams.push({ checkpoint, path, expected, ...actual });
  check(`Mermaid SVGs match source/container count: ${checkpoint}`, actual.containers === expected && actual.svgs === expected && actual.fallbacks === 0, { expected, ...actual });
}
async function contrastControls(page, path, width) {
  const selectors = [];
  if ([GUIDE_ROUTES.home, GUIDE_ROUTES.atlas].includes(path)) selectors.push(".button-secondary");
  if (["/guide/01-understand/02-the-factory-in-one-view", GUIDE_ROUTES.glossary].includes(path)) {
    selectors.push(".document-pagination span", ".document-pagination strong");
    selectors.push(...(width === 390 ? [".document-nav-mobile > summary"] : [".document-sidebar .document-nav-groups a", ".table-of-contents a"]));
  }
  // Axe cannot determine background-gradient contrast. These permanent checks
  // cover the exact formerly low-contrast reading controls, including surfaces
  // below the fold. Other incomplete findings retain their manual-review gate.
  const observations = await page.evaluate((selectors) => {
    function rgba(css) {
      if (/^color\(srgb /.test(css)) {
        const [values, alpha] = css.slice(11, -1).split("/").map((part) => part.trim());
        return [...values.split(/\s+/).map(Number), alpha === undefined ? 1 : Number(alpha)];
      }
      if (/^rgba?\(/.test(css)) {
        const values = css.match(/[\d.]+/g).map(Number);
        return [...values.slice(0, 3).map((value) => value / 255), values[3] ?? 1];
      }
      throw new Error(`Unsupported contrast color: ${css}`);
    }
    const luminance = (rgb) => rgb.slice(0, 3).map((value) => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, index) => sum + value * [.2126, .7152, .0722][index], 0);
    const blend = (foreground, background) => foreground.slice(0, 3).map((value, index) => value * foreground[3] + background[index] * (1 - foreground[3]));
    const gradient = getComputedStyle(document.body).backgroundImage;
    const colors = gradient.match(/(?:rgba?|color)\([^)]*\)/g) ?? [];
    if (!/^linear-gradient\((?:180deg, )?(?:color|rgb)/.test(gradient) || colors.length !== 2 || !gradient.endsWith("420px)")) throw new Error("Reading-control gradient changed; contrast model requires review");
    const endpoints = colors.map(rgba);
    if (endpoints.some((color) => color[3] !== 1)) throw new Error("Body gradient endpoints must be opaque");
    return selectors.flatMap((selector) => {
      const elements = [...document.querySelectorAll(selector)];
      if (!elements.length) throw new Error(`Required reading control is absent: ${selector}`);
      return elements.map((element) => {
        const style = getComputedStyle(element);
        const foreground = rgba(style.color);
        if (foreground[3] !== 1) throw new Error("Reading-control foreground became translucent");
        const chain = [];
        for (let ancestor = element; ancestor; ancestor = ancestor.parentElement) {
          const current = getComputedStyle(ancestor);
          if (Number(current.opacity) !== 1 || current.filter !== "none" || current.backdropFilter !== "none" || current.mixBlendMode !== "normal" || (ancestor !== document.body && current.backgroundImage !== "none")) throw new Error("Reading-control compositing changed; contrast model requires review");
          chain.unshift({ body: ancestor === document.body, background: rgba(current.backgroundColor) });
        }
        const backgrounds = endpoints.map((endpoint) => chain.reduce((background, layer) => layer.body ? endpoint.slice(0, 3) : blend(layer.background, background), [1, 1, 1]));
        const deltas = backgrounds[1].map((value, index) => value - backgrounds[0][index]);
        if (!(deltas.every((value) => value >= -1e-9) || deltas.every((value) => value <= 1e-9))) throw new Error("Reading-control gradient is not monotone");
        const range = backgrounds.map(luminance).sort((a, b) => a - b);
        const text = luminance(foreground);
        const minimum = text >= range[0] && text <= range[1] ? 1 : Math.min(...range.map((background) => (Math.max(background, text) + .05) / (Math.min(background, text) + .05)));
        return { selector, text: element.textContent.trim().slice(0, 100), foreground: style.color, backgrounds, minimum, required: 4.5 };
      });
    });
  }, selectors);
  record.contrastRegressions.push({ checkpoint, observations });
  for (const entry of observations) check(`${checkpoint}: reading-control contrast ${entry.selector}: ${entry.text}`, entry.minimum >= entry.required, entry);
}
async function browserChecks() {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (const width of record.coverage.axeWidths) for (const theme of record.coverage.axeThemes) for (const path of record.coverage.axeRoutes) {
      checkpoint = `axe/${width}/${theme}${path}`;
      const context = await browser.newContext({ viewport: { width, height: 844 }, colorScheme: "light" });
      const page = await context.newPage();
      observe(page);
      try {
        const physicalPath = requestPath(path);
        const response = await page.goto(`${guide}${physicalPath}`, { waitUntil: "networkidle" });
        check(`${checkpoint}: canonical page loaded`, response?.status() === 200 && page.url() === `${guide}${physicalPath}`, { status: response?.status(), url: page.url() });
        if (await page.locator("html").getAttribute("data-theme") !== theme) await page.locator(".theme-toggle").click();
        await page.waitForFunction((expected) => document.documentElement.dataset.theme === expected, theme);
        await page.evaluate(async () => { await Promise.all(document.getAnimations().filter((animation) => Number.isFinite(animation.effect?.getComputedTiming().endTime)).map((animation) => animation.finished.catch(() => undefined))); });
        await diagrams(page, path);
        await contrastControls(page, path, width);
        check(`${checkpoint}: one main landmark`, await page.locator("main").count() === 1);
        if (path === GUIDE_ROUTES.topics) {
          const link = page.locator(".reference-count a");
          const decoration = await link.evaluate((element) => getComputedStyle(element).textDecorationLine);
          check(`${checkpoint}: inline table-of-contents link has a persistent non-color cue`, decoration.includes("underline"), { decoration });
        }
        const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa"]).analyze();
        record.accessibility.push({ checkpoint, width, theme, path, requestPath: physicalPath, testEngine: results.testEngine, violations: results.violations, incomplete: results.incomplete, passes: results.passes.map(({ id }) => id) });
        check(`${checkpoint}: zero WCAG2 A/AA violations without exclusions`, results.violations.length === 0, results.violations.map(({ id, impact, nodes }) => ({ id, impact, nodes: nodes.map(({ target, failureSummary }) => ({ target, failureSummary })) })));
        console.log(`${checkpoint}: ${results.violations.length} violations; ${results.incomplete.length} incomplete rules retained`);
      } finally { await context.close(); }
      await save();
    }
    const context = await browser.newContext({ viewport: { width: 1280, height: 844 } });
    const page = await context.newPage();
    observe(page);
    try {
      for (const [source, mapping] of Object.entries(legacyAnchorRedirects)) for (const [anchor, target] of Object.entries(mapping)) for (const sourcePath of new Set([`/guide/${source}`, standaloneGuidePagePath(`/guide/${source}`)])) {
        checkpoint = `moved-anchor${sourcePath}#${anchor}`;
        const expected = new URL(guideNavigationHref(target, canonical), guide);
        expected.search = "ref=first&ref=second&q=a%2Fb";
        await page.goto(`${guide}${sourcePath}?${expected.search.slice(1)}#${anchor}`, { waitUntil: "networkidle" });
        await page.waitForURL(expected.href, { timeout: 20_000 });
        const count = await page.locator(`[id="${expected.hash.slice(1)}"]`).count();
        record.movedAnchors.push({ source, sourcePath, anchor, expected: expected.href, actual: page.url(), targetCount: count });
        check(checkpoint, page.url() === expected.href && count === 1, { targetCount: count, url: page.url() });
        if (record.movedAnchors.length % 12 === 0) {
          console.log(`Moved anchors: ${record.movedAnchors.length}/${record.coverage.movedAnchorCaseCount}`);
          await save();
        }
      }
      if (options.mermaid === "all") for (const document of documents.filter(({ content }) => /^\s*```mermaid\s*$/m.test(content))) {
        const path = publishedGuideDocuments.find(([slug]) => slug === document.slug)?.[1];
        if (!path || [GUIDE_ROUTES.home, GUIDE_ROUTES.glossary].includes(path)) continue;
        checkpoint = `all-diagrams${path}`;
        await page.goto(`${guide}${requestPath(path)}`, { waitUntil: "networkidle" });
        await diagrams(page, path);
        await save();
      }
    } finally { await context.close(); }
  } finally { await browser.close(); }
  check("Supplementary browser flows have no console errors", record.console.every(({ type }) => type !== "error"), record.console.filter(({ type }) => type === "error"));
  check("Supplementary browser flows have no page errors", record.pageErrors.length === 0, record.pageErrors);
  check("Supplementary browser flows have no unexpected failed requests", record.networkFailures.length === 0, record.networkFailures);
}
try {
  if (!options.plan) {
    checkpoint = "HTTP aliases and bridge cross-origin query privacy";
    if (rawGuide) await redirects(rawGuide, routeContracts, "raw-Guide");
    if (options.transport === "composed") await redirects(guide, composedContracts, "composed-Guide");
    if (fdlc) await bridgeRedirects();
    checkpoint = "sitemap, robots and authoritative canonical metadata";
    await discovery();
    await save();
    await browserChecks();
    check("Network evidence classifier stayed unchanged", record.harness.networkClassifierSha256 === sha256(await readFile(resolve(harnessDirectory, "../lib/migration-browser-network.ts"))));
    check("Source commit and tracked diff stayed unchanged", source.commit === git("rev-parse", "HEAD") && source.trackedDiffSha256 === sha256(git("diff", "HEAD", "--", ".")));
    for (const [path, digest] of Object.entries(source.files)) check(`Source contract stayed unchanged: ${path}`, digest === sha256(await readFile(`${site}/${path}`)));
  }
} catch (error) {
  check(`Harness execution completed at ${checkpoint}`, false, { name: error.name, message: error.message });
} finally {
  completed = !options.plan;
  await save();
  console.log(JSON.stringify({ status: record.status, checks: record.checks.length, failures: record.failures.length, evidence: `${output}/discovery.json` }));
  process.exitCode = record.failures.length ? 1 : 0;
}
