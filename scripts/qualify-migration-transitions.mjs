/**
 * Retained-session transition evidence; never changes a server or deployment.
 * Start: node --experimental-strip-types scripts/qualify-migration-transitions.mjs
 *   --scope=local --output=/absolute/evidence
 * Send one JSON object per stdin line. Wait for PHASE_COMPLETE before switching
 * the actual topology externally. The browser stays alive between commands.
 *
 * First command:
 * {"phase":"capture","checkpoint":"bridge-compatible-before","state":"bridge-new",
 *  "guideOrigin":"http://127.0.0.1:3024","fdlcOrigin":"http://localhost:3024",
 *  "guideSource":"<40-hex SHA>","fdlcSource":"<40-hex SHA>",
 *  "guideDeployment":null,"fdlcDeployment":null,
 *  "pages":[{"key":"chapter","path":"/docs/<real-slug>#<real-anchor>","navigate":true}]}
 * After the root has changed and independently identified the actual topology:
 * {"phase":"check","checkpoint":"old-after","state":"bridge-old", ...same identity fields...,
 *  "expectedUrls":{"chapter":"http://127.0.0.1:3024/docs/<real-slug>#<real-anchor>"},
 *  "expectedNavigationUrls":{"chapter":"<actual captured link's expected resolved URL>"}}
 * End with {"phase":"finish"}. EOF closes the browser but is NOT completion.
 *
 * Guide-compatible → old may be tested directly (adjacent graph states). A full
 * reverse run starts final-new, then final-compatible, bridge-new, bridge-old,
 * current-old. Only actual supported switches qualify: no cold matrix, URL
 * rewriting, storage import/export, auth, bypass, synthetic proxy or alias move.
 * Declared SHAs/IDs are recorded assertions, not independent deployment proof.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { isAbsolute, resolve } from "node:path";
import { createInterface } from "node:readline";
import { fileURLToPath, pathToFileURL } from "node:url";
import { isSuccessfulGuidePrefetchCancellation, MIGRATION_PREFETCH_REQUEST_HEADERS, MIGRATION_PREFETCH_RESPONSE_HEADERS } from "../lib/migration-browser-network.ts";

export const TRANSITION_STATES = ["current-old", "bridge-old", "bridge-new", "final-compatible", "final-new"];
const identityKeys = ["checkpoint", "state", "guideOrigin", "fdlcOrigin", "guideSource", "fdlcSource", "guideDeployment", "fdlcDeployment"];
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const managedPath = (path) => /^\/(?:_next|vc-ap-dd2962\/_next)\/static\/.+\.(?:js|css)$/.test(path);
export const TRANSITION_SEARCH_SELECTOR = '.search-experience input[type="search"]';
const isSearchDocument = (url) => ["/search", "/guide/search"].includes(new URL(url).pathname);

/** Browser callback: a layout rectangle alone does not expose closed details content. */
export function transitionLinkSnapshots(elements) {
  return elements.map((element, index) => ({
    index, href: element.href, raw: element.getAttribute("href"), text: element.textContent?.trim(),
    inMain: Boolean(element.closest("main")),
    inArticle: Boolean(element.closest("article.document-article")),
    visible: !element.closest("details:not([open])") && element.getClientRects().length > 0
      && typeof element.checkVisibility === "function"
      && element.checkVisibility({ checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true }),
  }));
}

/** Never serialize arbitrary exception names/messages or user-supplied stage text. */
export function safeTransitionFailure(error, stage) {
  const errorNames = ["AssertionError", "TimeoutError", "TypeError", "SyntaxError", "RangeError", "Error"];
  const stages = ["command", "capture", "retained-identity", "retained-link-visibility", "retained-link-click", "retained-navigation", "direct-load", "reload", "asset-verification"];
  return { errorName: errorNames.includes(error?.name) ? error.name : "UnknownError", stage: stages.includes(stage) ? stage : "command" };
}

/**
 * Compare observed UI state, not a query inferred from the URL.
 * @param {{url: string, searchInputCount: number, searchInputValue: string | null}} observed
 * @param {{url: string, searchInputCount: number, searchInputValue: string | null} | null} [baseline]
 */
export function transitionSearchStateMatches(observed, baseline = null) {
  if (!isSearchDocument(observed.url) && !(baseline && isSearchDocument(baseline.url))) return true;
  return isSearchDocument(observed.url) && observed.searchInputCount === 1 && typeof observed.searchInputValue === "string"
    && (!baseline || (isSearchDocument(baseline.url) && baseline.searchInputCount === 1
      && typeof baseline.searchInputValue === "string" && observed.searchInputValue === baseline.searchInputValue));
}

export function transitionOrigin(value, scope) {
  const url = new URL(value);
  assert.ok(["http:", "https:"].includes(url.protocol) && url.origin === value && !url.username && !url.password, "Use an exact credential-free HTTP(S) origin");
  if (scope === "local") assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(url.hostname), "Local evidence cannot silently navigate to a hosted origin");
  else assert.ok(scope === "hosted-preview" && url.protocol === "https:" && url.hostname.endsWith(".vercel.app"), "Hosted qualification accepts explicit Vercel origins only");
  return url.origin;
}

function pageUrl(value, origins) {
  const url = new URL(value);
  assert.ok(origins.includes(url.origin) && !url.username && !url.password, "Page origin is outside the explicit topology");
  assert.ok(!url.pathname.includes("%") && !url.pathname.includes("..") && !url.pathname.includes("//"), "Ambiguous page path");
  assert.ok([...url.searchParams.keys()].every((key) => key === "q"), "Only public search q parameters are permitted in page evidence");
  return url.href;
}

/** @param {string | null} [previousState] */
export function validateTransitionCommand(command, scope, previousState = null) {
  assert.ok(command && typeof command === "object" && !Array.isArray(command), "Expected a JSON command object");
  if (command.phase === "finish") {
    assert.deepEqual(Object.keys(command), ["phase"]);
    return command;
  }
  assert.ok(["capture", "check"].includes(command.phase));
  const allowed = new Set(["phase", ...identityKeys, ...(command.phase === "capture" ? ["pages"] : ["expectedUrls", "expectedNavigationUrls"])]);
  assert.ok(Object.keys(command).every((key) => allowed.has(key)), "Unknown command field");
  assert.match(command.checkpoint, /^[a-zA-Z0-9_-]{1,100}$/);
  assert.ok(TRANSITION_STATES.includes(command.state));
  const origins = [transitionOrigin(command.guideOrigin, scope), transitionOrigin(command.fdlcOrigin, scope)];
  for (const key of ["guideSource", "fdlcSource"]) assert.match(command[key], /^[a-f0-9]{40}$/);
  for (const key of ["guideDeployment", "fdlcDeployment"]) {
    assert.ok(command[key] === null && scope === "local" || /^dpl_[A-Za-z0-9]+$/.test(command[key] ?? ""), "Hosted identity requires explicit deployment IDs; local identities may be null");
  }
  if (command.phase === "capture") {
    assert.equal(previousState, null, "Capture is allowed once, before any topology switch");
    assert.ok(Array.isArray(command.pages) && command.pages.length >= 1 && command.pages.length <= 8);
    assert.equal(new Set(command.pages.map((page) => page.key)).size, command.pages.length);
    assert.ok(command.pages.some((page) => page.navigate === true), "At least one retained page must exercise a real link");
    for (const page of command.pages) {
      assert.ok(Object.keys(page).every((key) => ["key", "path", "navigate"].includes(key)));
      assert.match(page.key, /^[a-zA-Z0-9_-]{1,60}$/);
      assert.ok(typeof page.path === "string" && page.path.startsWith("/") && !page.path.startsWith("//"));
      assert.ok(typeof page.navigate === "boolean");
      pageUrl(new URL(page.path, command.guideOrigin).href, [command.guideOrigin]);
    }
  } else {
    assert.ok(TRANSITION_STATES.includes(previousState) && Math.abs(TRANSITION_STATES.indexOf(previousState) - TRANSITION_STATES.indexOf(command.state)) === 1, "Only adjacent real state transitions are admissible");
    for (const field of ["expectedUrls", "expectedNavigationUrls"]) {
      assert.ok(command[field] && typeof command[field] === "object" && !Array.isArray(command[field]));
      for (const [key, value] of Object.entries(command[field])) {
        assert.match(key, /^[a-zA-Z0-9_-]{1,60}$/);
        pageUrl(value, origins);
      }
    }
  }
  return command;
}

export function verifyTransitionAsset(asset, observed) {
  assert.ok(managedPath(new URL(asset.url).pathname), "Unrecognized managed asset namespace");
  const expectedType = new URL(asset.url).pathname.endsWith(".css") ? "stylesheet" : "script";
  assert.equal(asset.type, expectedType);
  assert.equal(observed.status, 200, "Saved asset URL must still resolve directly");
  assert.equal(observed.url, asset.url, "Saved immutable asset URL must not redirect or be substituted");
  assert.ok(expectedType === "stylesheet" ? /^text\/css(?:;|$)/i.test(observed.contentType) : /^(?:text|application)\/(?:javascript|x-javascript|ecmascript)(?:;|$)/i.test(observed.contentType), "Saved asset MIME changed");
  assert.match(asset.sha256, /^[a-f0-9]{64}$/);
  assert.equal(observed.sha256, asset.sha256, "Saved asset bytes changed across the transition");
}

/** Only freshly loaded documents assert the current deployment; retained clients may remain pinned. */
export function verifyDocumentDeploymentParameters(assetUrls, expectedDeployment) {
  const ids = [...new Set(assetUrls.map((url) => new URL(url).searchParams.get("dpl")).filter(Boolean))];
  if (expectedDeployment) assert.ok(ids.every((id) => id === expectedDeployment), "Current document asset deployment parameter differs");
  return ids; // Empty parameters are explicitly not independent deployment evidence.
}

async function main() {
  const options = {};
  for (const argument of process.argv.slice(2)) {
    const match = /^--(scope|output)=(.+)$/.exec(argument);
    assert.ok(match && !Object.hasOwn(options, match[1]), "Use unique --scope= and --output= arguments");
    options[match[1]] = match[2];
  }
  assert.ok(["local", "hosted-preview"].includes(options.scope));
  assert.ok(isAbsolute(options.output ?? ""));
  const output = resolve(options.output);
  await mkdir(output, { recursive: true });
  const record = {
    startedAt: new Date().toISOString(), scope: options.scope, anonymous: true,
    harnessSha256: sha256(await readFile(fileURLToPath(import.meta.url))),
    productionPromotionAuthorized: false, provesProductionRollback: false,
    identityProof: "Declared source/deployment IDs require separate live metadata and artifact qualification; browser bytes and exposed asset dpl parameters are observed independently here.",
    evidenceLimits: [
      "This process never switches a topology. A root/operator must perform each independently authorized supported switch before sending check.",
      "Local transitions prove only the actually exposed native local topology, not Vercel Production selectors, deployment retention or deployed rollback.",
      "An inaccessible protected Preview remains unqualified. No cookies, storage state, bypass, authentication, custom Host or response rewriting are imported.",
      "Historical defects have no generic waiver in this focused transition harness. Full-state acceptance, four-ID exception policy, accessibility, route coverage and runtime logs are separate gates.",
      "Exact observed asset URLs are fetched again without URL rewriting or cache-busting; returned bodies must match their captured SHA-256. Browser caches are retained, not cleared.",
      "Search URL q values and actual input values are separate observations. Matching input state does not prove that URL q initializes search or loads corresponding results.",
    ],
    phases: [], checks: [], failures: [], console: [], pageErrors: [], networkFailures: [], successfulPrefetchCancellations: [], assets: [],
  };
  let checkpoint = "startup";
  let current = null;
  let finished = false;
  let stopped = false;
  let currentStage = "command";
  const tabs = [];
  const contexts = [];
  const assetHistory = new Map();
  const pendingBodies = new Set();
  const phaseAssets = new Set();
  const { chromium } = await import("playwright");
  let browser;
  try { browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined }); }
  catch {
    record.status = "NO_GO";
    record.failures.push({ checkpoint, name: "browser launch unavailable", pass: false });
    await writeFile(resolve(output, "transitions.json"), `${JSON.stringify(record, null, 2)}\n`);
    process.stdout.write(`${JSON.stringify({ event: "SESSION_CLOSED", status: "NO_GO", reason: "Browser launch unavailable; no transition was inspected", output })}\n`);
    process.exitCode = 1;
    return;
  }
  const selected = (headers, keys) => Object.fromEntries(keys.filter((key) => headers[key] !== undefined).map((key) => [key, headers[key]]));
  function check(name, pass, actual) {
    const entry = { checkpoint, name, pass: Boolean(pass), ...(actual === undefined ? {} : { actual }) };
    record.checks.push(entry);
    if (!pass) record.failures.push(entry);
  }
  async function save() {
    record.updatedAt = new Date().toISOString();
    record.assets = [...assetHistory.values()];
    record.status = record.failures.length ? "NO_GO" : finished ? (record.phases.filter((phase) => phase.phase === "check").length ? "TRANSITION_CHECKS_PASS_EXTERNAL_IDENTITY_REQUIRED" : "NOT_RUN") : "WAITING_FOR_ROOT_CONTROLLED_SWITCH";
    await writeFile(resolve(output, "transitions.json"), `${JSON.stringify(record, null, 2)}\n`);
  }
  function observe(page) {
    const requests = new WeakMap();
    page.on("request", (request) => requests.set(request, { url: request.url(), pageUrl: page.url(), method: request.method(), type: request.resourceType(), isNavigationRequest: request.isNavigationRequest(), requestHeaders: selected(request.headers(), MIGRATION_PREFETCH_REQUEST_HEADERS), response: null }));
    page.on("response", (response) => {
      const request = response.request();
      const observation = requests.get(request);
      if (observation) observation.response = { url: response.url(), status: response.status(), headers: selected(response.headers(), MIGRATION_PREFETCH_RESPONSE_HEADERS) };
      if (response.status() >= 400) record.networkFailures.push({ checkpoint, url: response.url(), status: response.status(), type: request.resourceType() });
      if (!["script", "stylesheet"].includes(request.resourceType())) return;
      const assetCheckpoint = checkpoint;
      const task = (async () => {
        try {
          const asset = { url: response.url(), type: request.resourceType(), status: response.status(), contentType: response.headers()["content-type"] ?? "", sha256: sha256(await response.body()), capturedAt: assetCheckpoint };
          verifyTransitionAsset(asset, asset);
          const url = new URL(asset.url);
          assert.ok([current.guideOrigin, current.fdlcOrigin].includes(url.origin), "Managed asset left the explicit topology");
          if (assetHistory.has(asset.url)) assert.equal(assetHistory.get(asset.url).sha256, asset.sha256, "An identical asset URL returned different bytes");
          assetHistory.set(asset.url, asset);
          phaseAssets.add(asset.url);
        } catch { check("managed response identity is valid", false, { url: response.url(), capturedAt: assetCheckpoint }); }
      })();
      pendingBodies.add(task);
      task.finally(() => pendingBodies.delete(task));
    });
    page.on("requestfailed", (request) => {
      const observation = { ...requests.get(request), error: request.failure()?.errorText ?? null };
      if (isSuccessfulGuidePrefetchCancellation(observation, current.guideOrigin)) record.successfulPrefetchCancellations.push({ checkpoint, ...observation });
      else record.networkFailures.push({ checkpoint, ...observation });
    });
    page.on("console", (message) => { if (["error", "warning"].includes(message.type())) record.console.push({ checkpoint, type: message.type(), message: message.text() }); });
    page.on("pageerror", (error) => record.pageErrors.push({ checkpoint, url: page.url(), message: error.message }));
  }
  async function drainAssets() { while (pendingBodies.size) await Promise.all([...pendingBodies]); }
  async function snapshot(page) {
    const data = await page.evaluate((searchSelector) => {
      const searchInputs = [...document.querySelectorAll(searchSelector)];
      return {
        url: location.href, title: document.title, h1: document.querySelector("h1")?.textContent?.trim() ?? "",
        theme: document.documentElement.dataset.theme, timeOrigin: performance.timeOrigin,
        mainCount: document.querySelectorAll("main").length,
        fragmentExists: !location.hash || Boolean(document.getElementById(decodeURIComponent(location.hash.slice(1)))),
        urlSearchQ: new URLSearchParams(location.search).getAll("q"),
        searchInputCount: searchInputs.length,
        searchInputValue: searchInputs.length === 1 ? searchInputs[0].value : null,
        assets: [...document.querySelectorAll('script[src]:not([nomodule]),link[rel="stylesheet"]')].map((element) => new URL(element.getAttribute("src") ?? element.getAttribute("href"), location.href).href),
      };
    }, TRANSITION_SEARCH_SELECTOR);
    return { ...data, links: await page.locator("a[href]").evaluateAll(transitionLinkSnapshots) };
  }
  function checkSearchState(tab, data, baseline, stage) {
    if (!isSearchDocument(data.url) && !(baseline && isSearchDocument(baseline.url))) return;
    const requirement = baseline ? "search input equals captured actual value" : "exactly one actual search input";
    check(`${tab.label}: ${stage} ${requirement}`, transitionSearchStateMatches(data, baseline), {
      urlSearchQ: data.urlSearchQ, searchInputCount: data.searchInputCount,
      searchInputValue: data.searchInputValue, baselineInputValue: baseline?.searchInputValue ?? null,
    });
  }
  function assertPage(tab, data, expectedUrl) {
    check(`${tab.label}: exact persisted URL`, data.url === expectedUrl, { expected: expectedUrl, actual: data.url });
    check(`${tab.label}: theme survived`, data.theme === tab.theme, data.theme);
    check(`${tab.label}: Guide document identity and fragment`, data.mainCount === 1 && data.h1 === tab.captured.h1 && data.fragmentExists, { h1: data.h1, expectedH1: tab.captured.h1, mainCount: data.mainCount, fragmentExists: data.fragmentExists });
    checkSearchState(tab, data, tab.captured, "direct/reload");
  }
  async function captureTab(tab) {
    const data = await snapshot(tab.page);
    checkSearchState(tab, data, null, "capture");
    await drainAssets();
    check(`${tab.label}: declared managed dependencies have body evidence`, data.assets.length > 0 && data.assets.every((url) => assetHistory.has(url)), data.assets);
    const link = data.links.find((link) => link.inMain && link.inArticle && link.visible && new URL(link.href).origin === new URL(data.url).origin && /^\/(?:docs|guide)\/(?:\d|appendix)/.test(new URL(link.href).pathname) && new URL(link.href).pathname !== new URL(data.url).pathname);
    if (tab.navigate) check(`${tab.label}: actual visible article chapter link available`, Boolean(link));
    if (tab.navigate && link) {
      const newTab = await tab.page.context().newPage();
      observe(newTab);
      try {
        const response = await newTab.goto(link.href, { waitUntil: "networkidle" });
        const target = await snapshot(newTab);
        check(`${tab.label}: copied link opens a real Guide document in a new tab`, response?.status() === 200 && target.mainCount === 1 && Boolean(target.h1) && target.fragmentExists);
        link.resolvedUrl = target.url;
        link.h1 = target.h1;
      } finally { await newTab.close(); }
    }
    tab.captured = { ...data, links: undefined, link: link ?? null };
    return { key: tab.key, viewport: tab.width, theme: tab.theme, ...tab.captured };
  }
  async function refetchAssets() {
    await drainAssets();
    const assets = [];
    for (const asset of assetHistory.values()) {
      let observed;
      try {
        const response = await fetch(asset.url, { redirect: "manual", signal: AbortSignal.timeout(20_000) });
        observed = { url: response.url, status: response.status, contentType: response.headers.get("content-type") ?? "", sha256: sha256(Buffer.from(await response.arrayBuffer())) };
        verifyTransitionAsset(asset, observed);
        assets.push({ url: asset.url, ...observed, pass: true });
      } catch {
        const failure = { url: asset.url, ...observed, expectedSha256: asset.sha256, pass: false };
        assets.push(failure);
        check("exact saved asset URL remains byte-identical", false, failure);
      }
    }
    check("captured JavaScript and CSS both exist", [...assetHistory.values()].some((asset) => asset.type === "script") && [...assetHistory.values()].some((asset) => asset.type === "stylesheet"));
    return assets;
  }
  async function execute(command) {
    currentStage = "command";
    validateTransitionCommand(command, options.scope, current?.state ?? null);
    if (command.phase === "finish") { finished = true; return; }
    assert.ok(!stopped, "A failed transition stopped this session; preserve evidence and start a separately qualified run");
    assert.ok(!record.phases.some((phase) => phase.checkpoint === command.checkpoint), "Checkpoint must be unique");
    checkpoint = command.checkpoint;
    const prior = current;
    current = command;
    phaseAssets.clear();
    const phase = { ...command, assertedAt: new Date().toISOString(), previousState: prior?.state ?? null, observations: [] };
    record.phases.push(phase);
    if (command.phase === "capture") {
      currentStage = "capture";
      for (const width of [1440, 390]) for (const theme of ["light", "dark"]) {
        const context = await browser.newContext({ viewport: { width, height: 844 }, colorScheme: "light" });
        contexts.push(context);
        for (const configuration of command.pages) {
          const page = await context.newPage();
          page.setDefaultTimeout(15_000);
          observe(page);
          const response = await page.goto(new URL(configuration.path, command.guideOrigin).href, { waitUntil: "networkidle" });
          check("capture document HTTP 200", response?.status() === 200, response?.status());
          if (await page.locator("html").getAttribute("data-theme") !== theme) await page.getByRole("button", { name: /Use (dark|light) theme/ }).click();
          await page.waitForFunction((expected) => document.documentElement.dataset.theme === expected, theme);
          const tab = { ...configuration, page, width, theme, label: `${configuration.key}/${width}/${theme}` };
          tabs.push(tab);
          phase.observations.push(await captureTab(tab));
          check(`${tab.label}: initial Guide document and anchor`, tab.captured.mainCount === 1 && Boolean(tab.captured.h1) && tab.captured.fragmentExists);
        }
      }
    } else {
      assert.deepEqual(Object.keys(command.expectedUrls).sort(), [...new Set(tabs.map((tab) => tab.key))].sort(), "Every captured page needs an explicit post-switch URL");
      assert.deepEqual(Object.keys(command.expectedNavigationUrls).sort(), [...new Set(tabs.filter((tab) => tab.navigate).map((tab) => tab.key))].sort(), "Every retained navigation needs an explicit post-switch URL");
      for (const tab of tabs) {
        currentStage = "retained-identity";
        const retained = tab.captured;
        const before = await snapshot(tab.page);
        check(`${tab.label}: actual document and browser session retained through switch`, before.url === retained.url && before.timeOrigin === retained.timeOrigin && before.theme === tab.theme, { before: before.timeOrigin, captured: retained.timeOrigin });
        checkSearchState(tab, before, retained, "retained before navigation");
        if (tab.navigate && retained.link) {
          const links = tab.page.locator("a[href]");
          const link = links.nth(retained.link.index);
          check(`${tab.label}: retained link unchanged`, await link.getAttribute("href") === retained.link.raw);
          pageUrl(retained.link.href, [command.guideOrigin, command.fdlcOrigin]);
          currentStage = "retained-link-visibility";
          const observedLink = (await links.evaluateAll(transitionLinkSnapshots))[retained.link.index];
          const visible = observedLink?.inMain === true && observedLink.inArticle === true && observedLink.visible === true && await link.isVisible();
          check(`${tab.label}: retained link is actually visible before normal click`, visible);
          assert.ok(visible, "Retained link must remain visibly available before clicking");
          currentStage = "retained-link-click";
          await link.click();
          currentStage = "retained-navigation";
          await tab.page.waitForLoadState("networkidle");
          const navigated = await snapshot(tab.page);
          check(`${tab.label}: retained UI navigation reaches the exact Guide chapter`, navigated.url === command.expectedNavigationUrls[tab.key] && navigated.h1 === retained.link.h1 && navigated.mainCount === 1 && navigated.theme === tab.theme, { url: navigated.url, expected: command.expectedNavigationUrls[tab.key], title: navigated.title, kind: navigated.timeOrigin === retained.timeOrigin ? "client" : "document" });
        }
        currentStage = "direct-load";
        const response = await tab.page.goto(retained.url, { waitUntil: "networkidle" });
        check(`${tab.label}: saved URL direct load HTTP 200`, response?.status() === 200, response?.status());
        assertPage(tab, await snapshot(tab.page), command.expectedUrls[tab.key]);
        currentStage = "reload";
        const reload = await tab.page.reload({ waitUntil: "networkidle" });
        check(`${tab.label}: saved page reload HTTP 200`, reload?.status() === 200, reload?.status());
        assertPage(tab, await snapshot(tab.page), command.expectedUrls[tab.key]);
        phase.observations.push(await captureTab(tab));
      }
    }
    currentStage = "asset-verification";
    phase.savedAssets = await refetchAssets();
    phase.observedAssetUrls = [...phaseAssets];
    phase.observedAssetDeploymentParameters = [...new Set([...phaseAssets].map((url) => new URL(url).searchParams.get("dpl")).filter(Boolean))];
    phase.currentDocumentAssetUrls = [...new Set(phase.observations.flatMap((observation) => observation.assets))];
    phase.currentDocumentDeploymentParameters = verifyDocumentDeploymentParameters(phase.currentDocumentAssetUrls, command.guideDeployment);
    phase.currentDocumentHasDeploymentParameters = phase.currentDocumentDeploymentParameters.length > 0;
    for (const context of contexts) check("retained browser context remains cookie-free", (await context.cookies()).length === 0);
    check("zero browser errors", !record.console.some((entry) => entry.type === "error"));
    check("zero page errors", record.pageErrors.length === 0);
    check("zero unexpected network failures", record.networkFailures.length === 0);
    stopped = record.failures.length > 0;
    await save();
    process.stdout.write(`${JSON.stringify({ event: "PHASE_COMPLETE", checkpoint, state: command.state, status: stopped ? "NO_GO" : "WAITING_FOR_ROOT_CONTROLLED_SWITCH", output })}\n`);
  }
  const commands = createInterface({ input: process.stdin, crlfDelay: Infinity });
  try {
    process.stdout.write(`${JSON.stringify({ event: "AWAITING_CAPTURE", scope: options.scope, output })}\n`);
    for await (const line of commands) {
      if (!line.trim()) continue;
      try { currentStage = "command"; await execute(JSON.parse(line)); }
      catch (error) { stopped = true; const diagnostic = safeTransitionFailure(error, currentStage); check("phase command or transition failed", false, diagnostic); await save(); process.stdout.write(`${JSON.stringify({ event: "PHASE_FAILED", checkpoint, output, ...diagnostic })}\n`); }
      if (finished) break;
    }
    if (!finished) check("explicit finish received", false, "EOF is not a completed transition qualification");
  } finally {
    commands.close();
    process.stdin.pause();
    await drainAssets();
    await browser.close();
    record.finishedAt = new Date().toISOString();
    await save();
    process.stdout.write(`${JSON.stringify({ event: "SESSION_CLOSED", status: record.status, phases: record.phases.length, failures: record.failures.length, output })}\n`);
    if (record.failures.length || !finished || !record.phases.some((phase) => phase.phase === "check")) process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
