/**
 * Anonymous browser qualification, never a deployment or application mutation.
 * --guide=http://127.0.0.1:3024 --edition=old --state=bridge-old
 * --deployment=dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur
 * --focus-exceptions=ID,ID,... --output=/tmp/search-focus (each approved ID must be explicit)
 * New Guide: --edition=new --state=bridge-new|final-compatible|final-new, no exception flag.
 * --repetitions=2 defaults to two direct/reload pairs per viewport/theme.
 */
import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { classifyOldGuideSearchFocusException, validateSearchFocusException, verifyOldGuideIdentity, verifyOldGuideMetadata, OLD_GUIDE_DEPLOYMENT, OLD_GUIDE_BASELINE_DIGEST } from "../lib/migration-baseline-exception.ts";
import { isSuccessfulGuidePrefetchCancellation, MIGRATION_PREFETCH_REQUEST_HEADERS, MIGRATION_PREFETCH_RESPONSE_HEADERS } from "../lib/migration-browser-network.ts";

const allowed = new Set(["guide", "edition", "state", "deployment", "focus-exception", "focus-exceptions", "output", "repetitions"]);
const options = {};
for (const argument of process.argv.slice(2)) {
  const separator = argument.indexOf("=");
  const key = argument.slice(2, separator);
  assert.ok(argument.startsWith("--") && separator > 2 && allowed.has(key) && !Object.hasOwn(options, key), "Use unique allowed --key=value arguments");
  options[key] = argument.slice(separator + 1);
}
const parsedOrigin = new URL(options.guide);
assert.ok(["http:", "https:"].includes(parsedOrigin.protocol) && !parsedOrigin.username && !parsedOrigin.password && parsedOrigin.origin === options.guide, "--guide must be an exact credential-free HTTP(S) origin");
const guideOrigin = parsedOrigin.origin;
const edition = options.edition;
const state = options.state;
assert.ok(["old", "new"].includes(edition), "--edition must be old or new");
assert.ok((edition === "old" ? ["current-old", "bridge-old"] : ["bridge-new", "final-compatible", "final-new"]).includes(state), "--state must identify the exact current/bridge/final pairing");
if (options.deployment) assert.match(options.deployment, /^dpl_[A-Za-z0-9]+$/);
assert.ok(!(options["focus-exception"] && options["focus-exceptions"]), "Use one explicit exception list, not both forms");
const exceptions = (options["focus-exceptions"] ?? options["focus-exception"])?.split(",") ?? [];
assert.equal(new Set(exceptions).size, exceptions.length, "Exception IDs must be unique");
for (const id of exceptions) validateSearchFocusException(id, edition, options.deployment, state);
const exceptionContext = { exceptions, edition, deployment: options.deployment, state, identity: undefined };
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
let baselineAssets = [];
let requiredAssets = [];
if (exceptions.length) {
  const bytes = await readFile(new URL("../docs/releases/2026-09-05-migration-bridge-baseline-evidence.json", import.meta.url));
  assert.equal(sha256(bytes), OLD_GUIDE_BASELINE_DIGEST, "Immutable old baseline record changed");
  const baseline = JSON.parse(bytes);
  assert.equal(baseline.expectedDeployment, OLD_GUIDE_DEPLOYMENT);
  assert.equal(baseline.origin, "https://ai-software-factory-mastery.vercel.app");
  assert.equal(baseline.assets.length, 32);
  baselineAssets = baseline.assets.map((asset) => ({ path: new URL(asset.url).pathname, status: asset.status, sha256: asset.sha256, type: asset.type }));
  // Exact stylesheet + six module scripts declared by old /guide HTML. noModule
  // polyfills and speculative desktop-only imports are not browser dependencies.
  // Every script actually requested (including speculation) still must hash-match.
  requiredAssets = ["20-q9ua8x_std.css", "2trvcokof4iy6.js", "2m7o5wpek9-l7.js", "turbopack-1s9e9p9-awa-3.js", "1sizbqpwhzwhd.js", "21en880woklcv.js", "137ummfue5qox.js"].map((file) => `/_next/static/immutable/chunks/${file}`);
  assert.ok(requiredAssets.every((path) => baselineAssets.some((asset) => asset.path === path)), "Old Guide document dependency manifest is incomplete");
}
const exec = promisify(execFile);
let immutableMetadata;
async function liveGuideIdentity() {
  const team = "team_p8z8exJRTGfOPk1GC9vUOpv3";
  const projectId = "prj_KZQBsEEmJMnEpCx3DHW4mfzIOAuO";
  async function get(endpoint) {
    try {
      const { stdout } = await exec("vercel", ["api", `${endpoint}?teamId=${team}`, "--method", "GET", "--raw"], { cwd: "/tmp", timeout: 30_000, maxBuffer: 4 * 1024 * 1024 });
      return JSON.parse(stdout);
    } catch { throw new Error("Authenticated read-only Guide identity metadata unavailable; no exception accepted"); }
  }
  if (!immutableMetadata) {
    const deployment = await get(`/v13/deployments/${OLD_GUIDE_DEPLOYMENT}`);
    immutableMetadata = { immutableDeployment: deployment.id, immutableSource: deployment.meta?.githubCommitSha ?? deployment.gitSource?.sha, immutableProjectId: deployment.projectId, immutableReadyState: deployment.readyState };
  }
  const [project, alias] = await Promise.all([get(`/v9/projects/${projectId}`), get("/v4/aliases/ai-software-factory-mastery.vercel.app")]);
  const target = project.targets?.production;
  const metadata = {
    checkedAt: Date.now(), projectId: project.id, projectDeployment: target?.id,
    projectSource: target?.meta?.githubCommitSha ?? target?.gitSource?.sha, projectReadyState: target?.readyState,
    alias: alias.alias, aliasProjectId: alias.projectId, aliasDeployment: alias.deploymentId ?? alias.deployment?.id,
    ...immutableMetadata,
  };
  verifyOldGuideMetadata(metadata);
  return metadata;
}
const repetitions = Number(options.repetitions ?? 2);
assert.ok(Number.isInteger(repetitions) && repetitions >= 2 && repetitions <= 5, "--repetitions must be 2 through 5");
assert.ok(options.output, "--output is required");
const output = resolve(options.output);
await mkdir(output, { recursive: true });
const result = {
  startedAt: new Date().toISOString(), guideOrigin, edition, state, repetitions,
  expectedDeployment: options.deployment ?? null, requestedExceptions: exceptions,
  anonymous: true, productionPromotionAuthorized: false,
  visits: [], checks: [], knownExceptions: [], failures: [], identityEvidence: [], console: [], pageErrors: [], networkFailures: [], successfulPrefetchCancellations: [],
  evidenceLimits: [
    "Old exceptions require fresh authenticated project/current-alias/immutable-deployment agreement plus each visit's managed JS/CSS body hashes matching the pinned old baseline. Arguments or empty DOM IDs are not identity proof.",
    "This proves the old Guide artifact's active identity and observed asset-byte agreement, not independent hosted bridge-selector behavior. Full routing qualification is separate. Protected immutable URLs are not fetched and no bypass is used.",
    "Runtime logs require separate review. This harness records browser console, page errors, network failures and observed DOM behavior.",
    "Only the four explicitly requested historical keyboard behaviors on verified exact old bridge/old may be KNOWN_EXCEPTION / ACCEPTED_TEMPORARILY. Every other defect remains NO_GO.",
  ],
};
let checkpoint = "startup";
function invalidateExceptions(reason) {
  for (const entry of result.knownExceptions) {
    entry.status = "FAIL";
    entry.disposition = "REJECTED_IDENTITY_NOT_VERIFIED";
    entry.identityInvalidation = reason;
    result.failures.push(entry);
  }
  result.knownExceptions = [];
  exceptionContext.identity = undefined;
}
function check(name, condition, actual, focusObservation) {
  const known = !condition && focusObservation ? classifyOldGuideSearchFocusException(exceptionContext, focusObservation) : null;
  const entry = {
    checkpoint, name, pass: Boolean(condition),
    status: known ? "KNOWN_EXCEPTION" : condition ? "PASS" : "FAIL",
    ...(actual === undefined ? {} : { actual }), ...(known ? { ...known } : {}),
  };
  result.checks.push(entry);
  if (known) result.knownExceptions.push(entry);
  else if (!condition) result.failures.push(entry);
}
const selectedHeaders = (headers, names) => Object.fromEntries(names.filter((name) => headers[name] !== undefined).map((name) => [name, headers[name]]));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
try {
  for (const width of [1440, 390]) for (const theme of ["light", "dark"]) {
    const context = await browser.newContext({ viewport: { width, height: 844 }, colorScheme: "light" });
    const page = await context.newPage();
    page.setDefaultTimeout(10_000);
    const observations = new WeakMap();
    let visitAssets = [];
    let pendingAssetBodies = [];
    page.on("request", (request) => observations.set(request, {
      url: request.url(), pageUrl: page.url(), method: request.method(), type: request.resourceType(),
      isNavigationRequest: request.isNavigationRequest(), error: null,
      requestHeaders: selectedHeaders(request.headers(), MIGRATION_PREFETCH_REQUEST_HEADERS), response: null,
    }));
    page.on("response", (response) => {
      const observation = observations.get(response.request());
      if (observation) observation.response = { url: response.url(), status: response.status(), headers: selectedHeaders(response.headers(), MIGRATION_PREFETCH_RESPONSE_HEADERS) };
      if (response.status() >= 400) result.networkFailures.push({ checkpoint, url: response.url(), status: response.status(), type: response.request().resourceType() });
      const type = response.request().resourceType();
      if (exceptions.length && ["script", "stylesheet"].includes(type)) {
        const asset = { path: new URL(response.url()).pathname, url: response.url(), status: response.status(), type, sha256: "" };
        visitAssets.push(asset);
        pendingAssetBodies.push((async () => {
          try {
            assert.equal(new URL(asset.url).origin, guideOrigin, "Guide managed asset changed origin");
            asset.sha256 = sha256(await response.body());
          } catch { asset.bodyError = "Managed asset origin or response body verification failed"; }
        })());
      }
    });
    page.on("requestfailed", (request) => {
      const observation = { ...observations.get(request), error: request.failure()?.errorText ?? null };
      if (isSuccessfulGuidePrefetchCancellation(observation, guideOrigin)) result.successfulPrefetchCancellations.push({ checkpoint, ...observation });
      else result.networkFailures.push({ checkpoint, ...observation });
    });
    page.on("pageerror", (error) => result.pageErrors.push({ checkpoint, page: page.url(), message: error.message }));
    page.on("console", (message) => {
      if (["error", "warning"].includes(message.type())) result.console.push({ checkpoint, type: message.type(), message: message.text(), location: message.location() });
    });
    const trigger = page.locator(".command-trigger");
    const dialog = page.getByRole("dialog", { name: "Command palette", exact: true });
    const input = dialog.getByRole("combobox");
    const themeToggle = page.getByRole("button", { name: /Use (dark|light) theme/ });
    const otherInvoker = page.locator("header a.brand");
    let openedBy;
    const settledFocus = () => page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done))));
    async function open(invoker = trigger, shortcut = "Enter") {
      await invoker.focus();
      openedBy = shortcut;
      await page.keyboard.press(shortcut);
      await dialog.waitFor();
      await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
      check("focus enters search input", await input.evaluate((element) => element === document.activeElement));
      check("search has exact modal identity", await dialog.getAttribute("id") === "command-palette" && await dialog.getAttribute("aria-modal") === "true");
    }
    async function close(key, invoker = trigger, label = key) {
      const wasOpen = await dialog.count() === 1;
      await page.keyboard.press(key);
      await dialog.waitFor({ state: "detached" });
      await settledFocus();
      check(`${label}: closes dialog`, await dialog.count() === 0);
      const focusReturned = await invoker.evaluate((element) => element === document.activeElement);
      const focus = await page.evaluate(() => ({ activeIsSearchTrigger: document.activeElement?.classList.contains("command-trigger") === true, activeIsBody: document.activeElement === document.body, activeTag: document.activeElement?.tagName }));
      const observation = { issue: key === "Escape" ? "escape-wrong-invoker" : "shortcut-close-focus-loss", dialogId: "command-palette", dialogName: "Command palette", key, openedBy, wasOpen, dialogOpen: await dialog.count() > 0, focusInside: false, invokerIsSearchTrigger: invoker === trigger, focusReturned, ...focus };
      check(`${label}: restores invoking control`, focusReturned, observation, observation);
      check(`${label}: trigger no longer expanded`, await trigger.getAttribute("aria-expanded") === "false");
    }
    async function cycle(key, label, zeroResults = false) {
      await open();
      if (zeroResults) {
        await input.fill("no-matching-palette-result-qa");
        await page.waitForFunction(() => document.querySelectorAll('#command-palette [role="option"]').length === 0);
        check("empty search state remains visible", await dialog.locator(".command-empty").isVisible());
      }
      const controls = dialog.locator("input:not([disabled]),button:not([disabled])");
      const count = await controls.count();
      check(`${label}: focusable controls exist`, count >= 1);
      for (let step = 1; step <= count * 2; step++) {
        await page.keyboard.press(key);
        const focus = await page.evaluate(() => {
          const modal = document.querySelector("#command-palette");
          const controls = modal ? [...modal.querySelectorAll("input:not([disabled]),button:not([disabled])")] : [];
          return {
            issue: "focus-escaped", dialogId: modal?.id ?? null, dialogName: modal?.getAttribute("aria-label") ?? null,
            dialogOpen: Boolean(modal), focusInside: Boolean(modal?.contains(document.activeElement)),
            activeIndex: controls.indexOf(document.activeElement), activeTag: document.activeElement?.tagName,
            activeClass: document.activeElement?.className, activeName: document.activeElement?.getAttribute("aria-label"),
          };
        });
        const expectedIndex = key === "Tab" ? step % count : (count - (step % count)) % count;
        check(`${label}: ${key} step ${step} contains and orders focus`, focus.focusInside && focus.activeIndex === expectedIndex, { ...focus, expectedIndex }, { ...focus, key });
        if (!focus.focusInside) break; // Record one real escape; do not cascade failures after the modal boundary has already been crossed.
      }
      await close("Escape", trigger, `${label} Escape`);
    }
    try {
      check(`${width}/${theme}: fresh context is cookie-free`, (await context.cookies()).length === 0);
      for (let round = 1; round <= repetitions; round++) for (const action of ["direct", "reload"]) {
        checkpoint = `${width}/${theme}/round-${round}/${action}`;
        try {
          exceptionContext.identity = undefined;
          const metadata = exceptions.length ? await liveGuideIdentity() : null;
          visitAssets = [];
          pendingAssetBodies = [];
          const response = action === "reload" ? await page.reload({ waitUntil: "networkidle" }) : await page.goto(`${guideOrigin}/guide`, { waitUntil: "networkidle" });
          check("Guide document HTTP 200", response?.status() === 200, response?.status());
          const loadedTheme = await page.locator("html").getAttribute("data-theme");
          if (action === "reload") check("selected theme persists on reload", loadedTheme === theme, loadedTheme);
          if (loadedTheme !== theme) await themeToggle.click();
          await page.waitForFunction((expected) => document.documentElement.dataset.theme === expected, theme);
          const before = await page.evaluate(() => ({ url: location.href, title: document.title, theme: document.documentElement.dataset.theme, deploymentIds: [...new Set([...document.querySelectorAll("[data-dpl-id]")].map((element) => element.getAttribute("data-dpl-id")))] }));
          result.visits.push({ checkpoint, width, theme, round, action, ...before });
          check("theme is selected", before.theme === theme);
          if (options.deployment && before.deploymentIds.length) check("exposed deployment IDs match expected artifact", before.deploymentIds.every((id) => id === options.deployment), before.deploymentIds);
          if (metadata) {
            await Promise.all(pendingAssetBodies);
            assert.ok(visitAssets.every((asset) => !asset.bodyError), "Guide asset body identity is incomplete");
            const declaredAssets = await page.evaluate(() => [...document.querySelectorAll('script[src]:not([nomodule]),link[rel="stylesheet"]')].map((element) => new URL(element.getAttribute("src") ?? element.getAttribute("href"), location.href).pathname));
            const identity = verifyOldGuideIdentity(metadata, visitAssets, baselineAssets, [...new Set([...requiredAssets, ...declaredAssets])], OLD_GUIDE_BASELINE_DIGEST);
            exceptionContext.identity = identity;
            result.identityEvidence.push({ checkpoint, ...identity, declaredAssets, requiredAssets, assets: visitAssets });
            check("exact old Guide identity verified before exceptions", true);
          }

          await cycle("Tab", "forward wrap");
          await cycle("Shift+Tab", "reverse wrap");
          await cycle("Tab", "empty forward wrap", true);
          await cycle("Shift+Tab", "empty reverse wrap", true);

          const invokers = [["search trigger", trigger], ["different control (theme)", themeToggle], ...(edition === "new" ? [["different control (brand link)", otherInvoker]] : [])];
          if (edition === "new") check("additional stable keyboard invoker is visible", await otherInvoker.isVisible());
          for (const [invokerName, invoker] of invokers) {
            for (const shortcut of ["Control+k", "Meta+k"]) {
              await open(invoker, shortcut);
              const active = await input.getAttribute("aria-activedescendant");
              await input.press("ArrowDown");
              check(`${shortcut}: arrow selects another result`, await input.getAttribute("aria-activedescendant") !== active);
              await input.press("ArrowUp");
              check(`${shortcut}: reverse arrow restores result`, await input.getAttribute("aria-activedescendant") === active);
              await close(shortcut, invoker, `${shortcut} toggle from ${invokerName}`);
              await open(invoker, shortcut);
              await close("Escape", invoker, `Escape after ${shortcut} from ${invokerName}`);
            }
          }
          for (const [invokerName, invoker] of invokers.slice(1)) {
            await invoker.focus();
            const wasOpen = await dialog.count() > 0;
            await page.keyboard.press("Escape");
            await settledFocus();
            const focusReturned = await invoker.evaluate((element) => element === document.activeElement);
            const observation = { issue: "closed-escape-interference", dialogId: "command-palette", dialogName: "Command palette", key: "Escape", wasOpen, dialogOpen: await dialog.count() > 0, focusInside: false, invokerIsSearchTrigger: false, focusReturned, activeIsSearchTrigger: await trigger.evaluate((element) => element === document.activeElement) };
            check(`Escape with search closed does not steal focus from ${invokerName}`, focusReturned, observation, observation);
          }

          for (let mouseRound = 1; mouseRound <= 2; mouseRound++) {
            await trigger.click();
            await input.waitFor();
            await page.waitForFunction(() => document.activeElement?.getAttribute("role") === "combobox");
            await input.click();
            await input.fill("architecture");
            check(`mouse ${mouseRound}: hydrated matching results`, await dialog.getByRole("option").count() > 0);
            await page.locator(".command-backdrop").click({ position: { x: 2, y: 2 } });
            await dialog.waitFor({ state: "detached" });
            await settledFocus();
            check(`mouse ${mouseRound}: backdrop closes and restores trigger`, await trigger.evaluate((element) => element === document.activeElement) && await trigger.getAttribute("aria-expanded") === "false");
          }
          const dom = await page.evaluate(() => {
            const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
            return { duplicateIds: [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))], width: innerWidth, scrollWidth: document.documentElement.scrollWidth };
          });
          check("search lifecycle leaves no duplicate IDs", dom.duplicateIds.length === 0, dom.duplicateIds);
          check("search lifecycle has no horizontal overflow", dom.scrollWidth <= dom.width, dom);
          if (metadata) {
            await Promise.all(pendingAssetBodies);
            assert.ok(visitAssets.every((asset) => !asset.bodyError), "Guide asset body identity is incomplete");
            verifyOldGuideIdentity(metadata, visitAssets, baselineAssets, requiredAssets, OLD_GUIDE_BASELINE_DIGEST);
          }
          process.stdout.write(`Checked search focus ${checkpoint}\n`);
        } catch (error) {
          if (exceptions.length) invalidateExceptions("Visit identity or lifecycle validation failed");
          result.failures.push({ checkpoint, name: "search lifecycle interrupted", message: error.message });
        }
      }
      check(`${width}/${theme}: no cookies introduced`, (await context.cookies()).length === 0);
    } finally { await context.close(); }
  }
} finally {
  await browser.close();
  if (exceptions.length) {
    try { result.identityEvidence.push({ checkpoint: "final-current-identity", ...await liveGuideIdentity() }); }
    catch (error) { invalidateExceptions("Final live Guide identity changed or became unavailable"); check("final old Guide identity unchanged", false, error.message); }
  }
  check("zero browser console errors", !result.console.some((entry) => entry.type === "error"), result.console.filter((entry) => entry.type === "error"));
  check("zero page errors / hydration failures", result.pageErrors.length === 0, result.pageErrors);
  check("zero unexpected network failures", result.networkFailures.length === 0, result.networkFailures);
  check("new/final states have no temporary focus exceptions", edition === "old" && state === "bridge-old" || result.knownExceptions.length === 0);
  result.finishedAt = new Date().toISOString();
  result.pass = result.failures.length === 0 && result.knownExceptions.length === 0;
  result.disposition = result.failures.length ? "NO_GO" : result.knownExceptions.length ? "KNOWN_EXCEPTION / ACCEPTED_TEMPORARILY" : "PASS";
  await writeFile(resolve(output, "search-focus-acceptance.json"), `${JSON.stringify(result, null, 2)}\n`);
  process.stdout.write(`${JSON.stringify({ disposition: result.disposition, pass: result.pass, visits: result.visits.length, checks: result.checks.length, knownExceptions: result.knownExceptions.length, failures: result.failures, output })}\n`);
  if (result.failures.length) process.exitCode = 1;
}
