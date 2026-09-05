/**
 * Anonymous, read-only FDLC browser acceptance; never deploys or changes settings.
 * node scripts/qualify-fdlc-regression.mjs --fdlc=https://candidate.example
 *   --guide=https://guide.example --mode=bridge --guide-edition=new
 *   --canonical=https://fdlc.ai --output=/tmp/fdlc-acceptance
 * Optional: --deployment=dpl_... --return-fdlc=https://www.fdlc.ai
 *   --resolved-return-fdlc=https://fdlc.ai
 * --return-fdlc asserts the Guide link's origin; --resolved-return-fdlc asserts
 * its final document origin and defaults to the link origin. Neither is rewritten.
 */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import {
  isSuccessfulGuidePrefetchCancellation,
  MIGRATION_PREFETCH_REQUEST_HEADERS,
  MIGRATION_PREFETCH_RESPONSE_HEADERS,
} from "../lib/migration-browser-network.ts";

const allowedOptions = new Set([
  "fdlc", "guide", "mode", "guide-edition", "canonical", "output", "deployment", "return-fdlc", "resolved-return-fdlc",
]);
const options = {};
for (const argument of process.argv.slice(2)) {
  const separator = argument.indexOf("=");
  assert.ok(argument.startsWith("--") && separator > 2, "Use --key=value arguments");
  const key = argument.slice(2, separator);
  assert.ok(allowedOptions.has(key) && !Object.hasOwn(options, key), `Unknown or repeated option: ${key}`);
  options[key] = argument.slice(separator + 1);
}
function exactOrigin(value, label) {
  assert.ok(value, `--${label} is required`);
  const url = new URL(value);
  assert.ok(["http:", "https:"].includes(url.protocol) && !url.username && !url.password, `Invalid ${label} protocol/credentials`);
  assert.equal(url.origin, value, `--${label} must be an exact origin without path/query/fragment`);
  return value;
}
const fdlcOrigin = exactOrigin(options.fdlc, "fdlc");
const guideOrigin = exactOrigin(options.guide, "guide");
const mode = options.mode ?? "bridge";
const guideEdition = options["guide-edition"] ?? "new";
assert.ok(["bridge", "final"].includes(mode), "--mode must be bridge or final");
assert.ok(["old", "new"].includes(guideEdition), "--guide-edition must be old or new");
const canonicalOrigin = exactOrigin(options.canonical ?? (mode === "final" ? "https://www.fdlc.ai" : "https://fdlc.ai"), "canonical");
const returnOrigin = exactOrigin(options["return-fdlc"] ?? fdlcOrigin, "return-fdlc");
const resolvedReturnOrigin = exactOrigin(options["resolved-return-fdlc"] ?? returnOrigin, "resolved-return-fdlc");
assert.ok(options.output, "--output is required");
if (options.deployment) assert.match(options.deployment, /^dpl_[A-Za-z0-9]+$/);
const output = resolve(options.output);
await mkdir(output, { recursive: true });
const specificationPath = mode === "final" ? "/specification" : "/spec";
const primaryLinks = [
  ["Framework", "/framework"], ["Architecture", "/architecture"], ["Guide", "/guide"],
  ["Mission Control", "/mission-control"], ["Maturity", "/maturity"],
];
const secondaryLinks = [
  ["FDLC in 5 Minutes", "/in-5-minutes"], ["Manifesto", "/manifesto"],
  ["Specification", specificationPath], ["Benchmarks", "/benchmarks"], ["Start", "/start"],
  ["Enterprise", "/enterprise"], ["Deploy", "/deploy"], ["About", "/about"],
];
const footerLinks = [
  ...primaryLinks, ...secondaryLinks,
  ["GitHub ↗", "https://github.com/jaydubya818/MissionControl"],
  ["Source audit ↗", "https://github.com/jaydubya818/ai-software-factory-mastery"],
  ["Mission Control status ↗", "https://github.com/jaydubya818/MissionControl/blob/main/docs/product/software-factory-capability-maturity.md"],
];
const routes = ["/", ...primaryLinks.filter(([, path]) => path !== "/guide").map(([, path]) => path), ...secondaryLinks.map(([, path]) => path)];
const expected404 = new URL("/fdlc-regression-no-such-page", fdlcOrigin).href;
const result = {
  startedAt: new Date().toISOString(), mode, guideEdition, fdlcOrigin, guideOrigin, canonicalOrigin, returnOrigin, resolvedReturnOrigin,
  expectedFdlcDeployment: options.deployment ?? null, anonymous: true, routes,
  checks: [], pages: [], interactions: [], navigation: [], assets: [], console: [], pageErrors: [], networkFailures: [], speculativeRscCancellations: [], failures: [],
  evidenceLimits: [
    "This browser suite does not promote, inspect runtime logs, or establish source/asset deployment identity independently of Vercel metadata.",
    "Cross-app landing/return checks supplement, not replace, full Guide acceptance.",
    "Recorded speculative RSC cancellations received successful Flight response headers; this does not prove full body consumption or a JavaScript abort source. Navigation/data/asset failures are never included in this class.",
    ...(guideEdition === "old" ? ["The unchanged old Guide has no FDLC-home link; its return check uses browser Back and does not certify a nonexistent link."] : []),
    ...(returnOrigin !== fdlcOrigin || resolvedReturnOrigin !== fdlcOrigin ? ["Guide return targets separately specified FDLC link/resolved origins; that return is not qualification of the candidate origin."] : []),
  ],
};
const check = (name, pass, actual) => {
  const entry = { name, pass: Boolean(pass), ...(actual === undefined ? {} : { actual }) };
  result.checks.push(entry);
  if (!entry.pass) result.failures.push(entry);
  return entry.pass;
};
const assetResponses = new Map();
const pendingResponses = new Set();
const expected404Responses = new Set();
const requestObservations = new WeakMap();
const selectedHeaders = (headers, names) => Object.fromEntries(names.filter((name) => headers[name] !== undefined).map((name) => [name, headers[name]]));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
let phase = "fdlc";
let checkpoint = "startup";
const page = await context.newPage();
page.setDefaultTimeout(15_000);
page.setDefaultNavigationTimeout(30_000);
page.on("pageerror", (error) => result.pageErrors.push({ checkpoint, phase, page: page.url(), message: error.message }));
page.on("console", (message) => {
  if (["error", "warning"].includes(message.type())) {
    result.console.push({ checkpoint, phase, page: page.url(), type: message.type(), message: message.text(), location: message.location() });
  }
});
page.on("requestfailed", (request) => {
  const observation = requestObservations.get(request);
  const failure = {
    checkpoint, phase, ...observation,
    url: request.url(), type: request.resourceType(), error: request.failure()?.errorText ?? null,
  };
  if (observation && isSuccessfulGuidePrefetchCancellation(failure, guideOrigin)) {
    result.speculativeRscCancellations.push(failure);
  } else {
    result.networkFailures.push(failure);
  }
});
page.on("request", (request) => {
  requestObservations.set(request, {
    url: request.url(), pageUrl: page.url(), method: request.method(), type: request.resourceType(),
    isNavigationRequest: request.isNavigationRequest(), error: null,
    requestHeaders: selectedHeaders(request.headers(), MIGRATION_PREFETCH_REQUEST_HEADERS), response: null,
  });
  if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
    result.navigation.push({ checkpoint, phase, url: request.url(), method: request.method() });
  }
});
page.on("response", (response) => {
  const observation = requestObservations.get(response.request());
  if (observation) observation.response = {
    url: response.url(), status: response.status(),
    headers: selectedHeaders(response.headers(), MIGRATION_PREFETCH_RESPONSE_HEADERS),
  };
  const responsePhase = phase;
  const responseCheckpoint = checkpoint;
  const job = (async () => {
    const request = response.request();
    if (response.status() === 404 && response.url() === expected404 && request.resourceType() === "document") {
      expected404Responses.add(response.url());
    } else if (response.status() >= 400) {
      result.networkFailures.push({ checkpoint: responseCheckpoint, phase: responsePhase, url: response.url(), type: request.resourceType(), status: response.status() });
    }
    if (!["script", "stylesheet"].includes(request.resourceType())) return;
    const key = `${responsePhase}:${response.url()}`;
    if (assetResponses.has(key)) return;
    const asset = {
      checkpoint: responseCheckpoint, phase: responsePhase, url: response.url(), type: request.resourceType(),
      status: response.status(), contentType: response.headers()["content-type"] ?? "",
    };
    assetResponses.set(key, asset);
    try { asset.sha256 = createHash("sha256").update(await response.body()).digest("hex"); }
    catch (error) { asset.bodyError = error.message; }
  })().catch((error) => result.failures.push({ name: "response inspection failed", message: error.message }));
  pendingResponses.add(job);
  void job.finally(() => pendingResponses.delete(job));
});
async function settle() {
  await page.waitForLoadState("networkidle");
  while (pendingResponses.size) await Promise.all([...pendingResponses]);
}
async function inspectCurrent(path, { status = 200, response, action = "direct" } = {}) {
  await settle();
  const logos = page.locator("header.site-header img.brand-logo, footer.site-footer img.brand-logo");
  for (let index = 0; index < await logos.count(); index++) {
    await logos.nth(index).scrollIntoViewIfNeeded();
    await logos.nth(index).evaluate((img) => img.decode());
  }
  await settle();
  const details = await page.evaluate(() => {
    const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
    const links = (selector) => [...document.querySelectorAll(selector)].map((element) => ({ text: element.textContent.trim(), href: element.getAttribute("href") }));
    return {
      title: document.title, path: location.pathname, origin: location.origin,
      h1: [...document.querySelectorAll("main h1")].map((element) => element.textContent.trim()),
      mains: document.querySelectorAll("main").length,
      duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))],
      width: innerWidth, scrollWidth: document.documentElement.scrollWidth,
      headers: document.querySelectorAll("header.site-header").length,
      footers: document.querySelectorAll("footer.site-footer").length,
      footerText: document.querySelector("footer.site-footer")?.textContent,
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
      description: document.querySelector('meta[name="description"]')?.getAttribute("content"),
      deploymentIds: [...new Set([...document.querySelectorAll("[data-dpl-id]")].map((element) => element.getAttribute("data-dpl-id")))],
      primaryLinks: links('header.site-header nav[aria-label="Primary navigation"] > a'),
      mobileLinks: links('header.site-header nav[aria-label="Mobile navigation"] a'),
      footerLinks: links("footer.site-footer nav a"),
      logos: [...document.querySelectorAll("header.site-header img.brand-logo, footer.site-footer img.brand-logo")].map((img) => ({ src: img.getAttribute("src"), alt: img.alt, loaded: img.complete && img.naturalWidth > 0 })),
      assets: [...document.querySelectorAll('script[src],link[rel="stylesheet"]')].map((element) => element.getAttribute("src") ?? element.getAttribute("href")),
    };
  });
  result.pages.push({ checkpoint, action, requestedPath: path, url: page.url(), status: response?.status(), ...details });
  if (response) check(`${checkpoint}: HTTP ${status}`, response.status() === status, response.status());
  check(`${checkpoint}: FDLC origin/path`, details.origin === fdlcOrigin && details.path === path, page.url());
  check(`${checkpoint}: FDLC document identity`, details.title.includes("FDLC") && details.h1.length === 1, { title: details.title, h1: details.h1 });
  check(`${checkpoint}: one main/header/footer`, details.mains === 1 && details.headers === 1 && details.footers === 1, [details.mains, details.headers, details.footers]);
  check(`${checkpoint}: duplicate IDs`, details.duplicateIds.length === 0, details.duplicateIds);
  check(`${checkpoint}: horizontal overflow`, details.scrollWidth <= details.width, { width: details.width, scrollWidth: details.scrollWidth });
  check(`${checkpoint}: current brand logos`, details.logos.length === 2 && details.logos.every((logo) => logo.loaded && logo.alt === "FDLC.ai — Factory Development Lifecycle" && logo.src?.includes("fdlc-logo-updated.png")), details.logos);
  check(`${checkpoint}: current footer`, details.footerText?.includes("The operating model and technical foundation for trusted autonomous software delivery.") && details.footerText?.includes("Factory Development Lifecycle") && details.footerText?.includes("Open framework · Working reference · Governed autonomy"));
  check(`${checkpoint}: complete navigation sets`, details.primaryLinks.length === primaryLinks.length && details.mobileLinks.length === primaryLinks.length + secondaryLinks.length && details.footerLinks.length === footerLinks.length, { primary: details.primaryLinks.length, mobile: details.mobileLinks.length, footer: details.footerLinks.length });
  for (const [label, href] of primaryLinks) {
    check(`${checkpoint}: primary ${label}`, details.primaryLinks.some((link) => link.text === label && link.href === href));
  }
  for (const [label, href] of [...primaryLinks, ...secondaryLinks]) {
    check(`${checkpoint}: mobile ${label}`, details.mobileLinks.some((link) => link.text === label && link.href === href));
  }
  for (const [label, href] of footerLinks) {
    check(`${checkpoint}: footer ${label}`, details.footerLinks.some((link) => link.text === label && link.href === href));
  }
  if (status === 200) {
    check(`${checkpoint}: exact canonical`, Boolean(details.canonical) && new URL(details.canonical, fdlcOrigin).href === new URL(path, canonicalOrigin).href, details.canonical);
    check(`${checkpoint}: description`, Boolean(details.description));
  }
  const managed = details.assets.filter((asset) => asset?.includes("/_next/"));
  check(`${checkpoint}: FDLC JS and CSS`, managed.some((asset) => /\.js(?:\?|$)/.test(asset)) && managed.some((asset) => /\.css(?:\?|$)/.test(asset)));
  check(`${checkpoint}: no Guide bundle in FDLC document`, managed.every((asset) => new URL(asset, fdlcOrigin).pathname.startsWith("/_next/")), managed);
  if (options.deployment) check(`${checkpoint}: HTML deployment attribution`, details.deploymentIds.length === 1 && details.deploymentIds[0] === options.deployment, details.deploymentIds);
  return details;
}
async function visit(path, device, reload = false, status = 200) {
  checkpoint = `${device} ${path} ${reload ? "reload" : "direct"}`;
  const response = reload ? await page.reload({ waitUntil: "networkidle" }) : await page.goto(new URL(path, fdlcOrigin).href, { waitUntil: "networkidle" });
  await inspectCurrent(path, { status, response, action: reload ? "reload" : "direct" });
  process.stdout.write(`Checked ${checkpoint}\n`);
}
async function missionControl(device) {
  await visit("/mission-control", device);
  const stages = page.getByRole("tablist", { name: "Mission Control delivery stages" }).getByRole("tab");
  const names = ["Define", "Authorize", "Execute", "Verify", "Decide", "Observe"];
  const panelTexts = new Set();
  check(`${device}: six governed stages`, await stages.count() === names.length);
  for (let index = 0; index < names.length; index++) {
    checkpoint = `${device} Mission Control stage ${names[index]}`;
    const tab = stages.nth(index);
    await tab.focus();
    await tab.press("Enter");
    await page.locator(`#mc-flow-tab-${index}[aria-selected="true"]`).waitFor();
    const panel = page.locator("#mc-flow-panel");
    check(`${checkpoint}: label and selected state`, (await tab.innerText()).includes(names[index]) && await panel.getAttribute("aria-labelledby") === `mc-flow-tab-${index}`);
    check(`${checkpoint}: one selected stage`, await page.locator('.mc-flow-tabs [role="tab"][aria-selected="true"]').count() === 1);
    const text = await panel.innerText();
    panelTexts.add(text);
    check(`${checkpoint}: authority/control/proof`, ["authority", "control", "required proof"].every((label) => text.toLowerCase().includes(label)));
    await inspectCurrent("/mission-control", { action: "stage interaction" });
  }
  check(`${device}: stages render six distinct states`, panelTexts.size === names.length, panelTexts.size);
  await page.getByRole("button", { name: "Next stage", exact: true }).click();
  check(`${device}: next wraps to Define`, await stages.nth(0).getAttribute("aria-selected") === "true");
  await page.getByRole("button", { name: "Previous stage", exact: true }).click();
  check(`${device}: previous wraps to Observe`, await stages.nth(5).getAttribute("aria-selected") === "true");

  const views = page.getByRole("tablist", { name: "Mission Control operator views" }).getByRole("tab");
  const viewNames = ["Command Center", "Work Orders", "Approvals & Audit"];
  check(`${device}: three operator views`, await views.count() === viewNames.length);
  const viewHeadings = new Set();
  for (let index = 0; index < viewNames.length; index++) {
    checkpoint = `${device} Mission Control operator ${viewNames[index]}`;
    await views.nth(index).focus();
    await views.nth(index).press("Enter");
    await page.locator(`#mc-product-tab-${index}[aria-selected="true"]`).waitFor();
    const panel = page.locator("#mc-product-panel");
    await panel.locator("img").scrollIntoViewIfNeeded();
    await panel.locator("img").evaluate((img) => img.decode());
    check(`${checkpoint}: selected tab/panel`, (await views.nth(index).innerText()).includes(viewNames[index]) && await panel.getAttribute("aria-labelledby") === `mc-product-tab-${index}`);
    check(`${checkpoint}: loaded product image`, await panel.locator("img").evaluate((img) => img.complete && img.naturalWidth > 0 && Boolean(img.alt)));
    viewHeadings.add(await panel.locator("h3").innerText());
    await inspectCurrent("/mission-control", { action: "operator interaction" });
  }
  check(`${device}: views render distinct captions`, viewHeadings.size === 3);
  const capabilities = page.locator("#capabilities .mc-capability-group details");
  check(`${device}: twelve bounded capability disclosures`, await capabilities.count() === 12, await capabilities.count());
  for (const [status, count] of [["available", 6], ["experimental", 4], ["planned", 2]]) {
    check(`${device}: ${status} capability group`, await page.locator(`#capabilities .is-${status} details`).count() === count);
  }
  for (let index = 0; index < await capabilities.count(); index++) {
    const detail = capabilities.nth(index);
    const summary = detail.locator("summary");
    const name = await summary.innerText();
    checkpoint = `${device} capability ${index + 1}`;
    if (!await detail.evaluate((element) => element.open)) await summary.click();
    const disclosureText = (await detail.innerText()).toLowerCase();
    check(`${checkpoint}: supported behavior and current boundary`, await detail.locator("p").count() === 2 && disclosureText.includes("current boundary") && disclosureText.includes("supported"), name);
    await summary.focus();
    await summary.press("Enter");
    check(`${checkpoint}: keyboard collapse`, !await detail.evaluate((element) => element.open), name);
  }
  await inspectCurrent("/mission-control", { action: "capability interactions" });
  result.interactions.push({ device, flowStages: names, operatorViews: viewNames, capabilityCount: await capabilities.count() });
}
async function crossApp(device) {
  phase = "fdlc";
  await visit("/", device);
  if (device === "mobile") await page.locator("header.site-header .mobile-nav > summary").click();
  const nav = page.getByRole("navigation", { name: device === "mobile" ? "Mobile navigation" : "Primary navigation", exact: true });
  await nav.scrollIntoViewIfNeeded();
  await settle();
  checkpoint = `${device} FDLC to Guide`;
  await page.evaluate(() => { window.__fdlcRegressionDocument = "fdlc-before-guide"; });
  const before = result.navigation.length;
  phase = "guide-boundary";
  await nav.getByRole("link", { name: "Guide", exact: true }).click();
  await settle();
  check(`${checkpoint}: Guide origin and landing`, new URL(page.url()).origin === guideOrigin && new URL(page.url()).pathname === "/guide" && /guide/i.test(await page.title()), page.url());
  check(`${checkpoint}: hard document navigation`, result.navigation.length > before && await page.evaluate(() => window.__fdlcRegressionDocument) === undefined);
  const guideAssets = await page.locator('script[src],link[rel="stylesheet"]').evaluateAll((elements) => elements.map((element) => element.getAttribute("src") ?? element.getAttribute("href")).filter((value) => value?.includes("/_next/")));
  const guidePrefix = guideEdition === "old" ? "/_next/" : "/vc-ap-dd2962/_next/";
  check(`${checkpoint}: Guide asset namespace`, guideAssets.length > 0 && guideAssets.every((asset) => new URL(asset, guideOrigin).pathname.startsWith(guidePrefix)), guideAssets);
  checkpoint = `${device} Guide to FDLC`;
  if (guideEdition === "old") {
    phase = "fdlc";
    await page.goBack({ waitUntil: "networkidle" });
    await settle();
    check(`${checkpoint}: browser Back restores FDLC`, new URL(page.url()).origin === fdlcOrigin && new URL(page.url()).pathname === "/" && (await page.title()).includes("FDLC"), page.url());
    result.interactions.push({ device, returnMechanism: "browser Back; old Guide has no FDLC home link" });
  } else {
    const home = page.getByRole("link", { name: "FDLC home", exact: true }).first();
    check(`${checkpoint}: return link destination`, new URL(await home.getAttribute("href"), guideOrigin).href === new URL("/", returnOrigin).href, await home.getAttribute("href"));
    await page.evaluate(() => { window.__fdlcRegressionDocument = "guide-before-fdlc"; });
    const beforeReturn = result.navigation.length;
    phase = returnOrigin === fdlcOrigin && resolvedReturnOrigin === fdlcOrigin ? "fdlc" : "separate-fdlc-return";
    await home.click();
    await settle();
    check(`${checkpoint}: FDLC home reached`, new URL(page.url()).origin === resolvedReturnOrigin && new URL(page.url()).pathname === "/" && (await page.title()).includes("FDLC"), page.url());
    check(`${checkpoint}: hard return navigation`, result.navigation.length > beforeReturn && await page.evaluate(() => window.__fdlcRegressionDocument) === undefined);
    const returnNavigations = result.navigation.slice(beforeReturn);
    check(`${checkpoint}: only the declared return origins`, returnNavigations.every((navigation) => [returnOrigin, resolvedReturnOrigin].includes(new URL(navigation.url).origin)), returnNavigations);
    result.interactions.push({ device, returnMechanism: "Guide FDLC home anchor", linkOrigin: returnOrigin, returnedOrigin: new URL(page.url()).origin, returnNavigations });
  }
  phase = "fdlc";
}

try {
  check("fresh context contains no cookies", (await context.cookies()).length === 0);
  for (const [device, viewport] of [["desktop", { width: 1440, height: 1000 }], ["mobile", { width: 390, height: 844 }]]) {
    await page.setViewportSize(viewport);
    for (const path of routes) {
      await visit(path, device);
      await visit(path, device, true);
    }
    await missionControl(device);
    await visit("/", device);
    if (device === "mobile") {
      checkpoint = "mobile keyboard navigation";
      const menu = page.locator("header.site-header .mobile-nav");
      await menu.locator(":scope > summary").focus();
      await menu.locator(":scope > summary").press("Enter");
      check(`${checkpoint}: opens`, await menu.evaluate((element) => element.open));
      const architecture = page.getByRole("navigation", { name: "Mobile navigation", exact: true }).getByRole("link", { name: "Architecture", exact: true });
      await architecture.focus();
      await architecture.press("Enter");
      await page.waitForURL(new URL("/architecture", fdlcOrigin).href);
      await settle();
      check(`${checkpoint}: hydrated menu closes after routing`, !await menu.evaluate((element) => element.open));
      check(`${checkpoint}: active page is announced`, await menu.locator('nav a[href="/architecture"]').getAttribute("aria-current") === "page");
      await inspectCurrent("/architecture", { action: "keyboard navigation" });
    } else {
      checkpoint = "desktop secondary navigation";
      await page.locator("header.site-header .more-menu > summary").click();
      await page.getByRole("navigation", { name: "Primary navigation", exact: true }).getByRole("link", { name: "Specification", exact: true }).click();
      await page.waitForURL(new URL(specificationPath, fdlcOrigin).href);
      await settle();
      check(`${checkpoint}: hydrated More menu closes`, !await page.locator("header.site-header .more-menu").evaluate((element) => element.open));
      await inspectCurrent(specificationPath, { action: "secondary navigation" });
    }
    await visit("/fdlc-regression-no-such-page", device, false, 404);
    check(`${device}: custom FDLC 404 remains visible`, await page.locator("main h1").innerText() === "This route has no verified outcome.");
    await visit("/", device);
    await page.screenshot({ path: resolve(output, `fdlc-${device}.png`), fullPage: true });
    await crossApp(device);
  }
  await settle();
} catch (error) {
  result.failures.push({ name: "FDLC qualification interrupted", checkpoint, message: error.stack });
} finally {
  while (pendingResponses.size) await Promise.all([...pendingResponses]);
  result.assets = [...assetResponses.values()];
  check("observed FDLC JavaScript and CSS", ["script", "stylesheet"].every((type) => result.assets.some((asset) => asset.phase === "fdlc" && asset.type === type)));
  check("zero unsuccessful JS/CSS responses", result.assets.every((asset) => asset.status >= 200 && asset.status < 300), result.assets.filter((asset) => asset.status < 200 || asset.status >= 300));
  check("JS/CSS content types", result.assets.every((asset) => asset.type === "stylesheet" ? /text\/css/i.test(asset.contentType) : /(?:java|ecma)script/i.test(asset.contentType)), result.assets.filter((asset) => !(asset.type === "stylesheet" ? /text\/css/i.test(asset.contentType) : /(?:java|ecma)script/i.test(asset.contentType))));
  check("FDLC managed bundles never use a Guide prefix", result.assets.filter((asset) => asset.phase === "fdlc" && new URL(asset.url).pathname.includes("/_next/")).every((asset) => new URL(asset.url).pathname.startsWith("/_next/")));
  const productErrors = result.console.filter((entry) => entry.type === "error" && !(expected404Responses.has(entry.location.url) && /^Failed to load resource: the server responded with a status of 404 \((?:Not Found)?\)$/.test(entry.message)));
  check("zero product console errors", productErrors.length === 0, productErrors);
  check("zero page errors / hydration failures", result.pageErrors.length === 0, result.pageErrors);
  check("zero unexpected network failures", result.networkFailures.length === 0, result.networkFailures);
  check("recorded cancellations meet the evidenced prefetch-only class", result.speculativeRscCancellations.every((entry) => isSuccessfulGuidePrefetchCancellation(entry, guideOrigin)), { count: result.speculativeRscCancellations.length });
  check("no cookies introduced", (await context.cookies()).length === 0);
  await context.close();
  await browser.close();
  result.finishedAt = new Date().toISOString();
  result.pass = result.failures.length === 0;
  await writeFile(resolve(output, "fdlc-acceptance.json"), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ pass: result.pass, checks: result.checks.length, pageVisits: result.pages.length, failures: result.failures, output })}\n`);
  if (!result.pass) process.exitCode = 1;
}
