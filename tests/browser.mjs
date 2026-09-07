import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";
import { checkGlobalNavigation } from "./helpers/global-navigation.mjs";

// A local production build, a new browser profile and synthetic form inputs only.
const require = createRequire(import.meta.url);
const runtime = process.argv[2] ?? "vinext";
assert.ok(["vinext", "next"].includes(runtime), "Browser runtime must be vinext or next");
const origin = "http://127.0.0.1:4186";
const output = new URL(runtime === "next" ? "../output/playwright/site-next/" : "../output/playwright/site/", import.meta.url);
await mkdir(output, { recursive: true });
const serverCli = runtime === "next" ? "../node_modules/next/dist/bin/next" : "../node_modules/vinext/dist/cli.js";
const server = spawn(process.execPath, [new URL(serverCli, import.meta.url).pathname, "start", "--hostname", "127.0.0.1", "--port", "4186"], {
  cwd: new URL("..", import.meta.url),
  env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/browser.log" },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", chunk => { serverLog += chunk; });
server.stderr.on("data", chunk => { serverLog += chunk; });
const report = { schema: "fdlc-browser/v1", environment: "LOCAL_PRODUCTION_BUILD", runtime, results: [], links: [], flows: [], errors: [], result: "FAIL" };
let browser;
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    assert.equal(server.exitCode, null, `Preview exited: ${serverLog}`);
    try { ready = (await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok; } catch { /* Wait for local startup. */ }
    if (ready) break;
    await delay(100);
  }
  assert.ok(ready, "Production preview did not start");
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  const page = await browser.newPage();
  page.on("pageerror", error => report.errors.push({ url: page.url(), message: error.message }));
  // This suite owns the FDLC artifact. Composed /guide routes belong to the
  // independently built Guide artifact and are covered by the migration's
  // exact-deployment composition suites, not by a mutable remote dependency
  // during the FDLC local-build gate.
  const routes = ["/", "/framework", "/architecture", "/in-5-minutes", "/manifesto", "/mission-control", "/spec", "/maturity", "/benchmarks", "/enterprise", "/deploy", "/start", "/about"];
  const links = new Set();
  async function audit(label) {
    // Measure settled styles; entry fades are deliberately below final contrast.
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(document.getAnimations().map(animation => animation.finished.catch(() => {})));
    });
    await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
    const result = await page.evaluate(async () => ({
      overflow: document.documentElement.scrollWidth > innerWidth,
      violations: (await window.axe.run(document)).violations.map(v => ({ id: v.id, impact: v.impact, targets: v.nodes.map(n => n.target) })),
    }));
    report.results.push({ label, width: page.viewportSize().width, ...result });
    assert.equal(result.overflow, false, `${label}: horizontal overflow`);
    assert.deepEqual(result.violations, [], `${label}: accessibility violations`);
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const route of routes) {
      const response = await page.goto(`${origin}${route}`);
      assert.equal(response.status(), 200, route);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await checkGlobalNavigation(page, { mobile: width === 390, keyboard: route === "/" });
      await audit(route);
      for (const href of await page.locator("a[href]").evaluateAll(nodes => nodes.map(n => n.getAttribute("href")))) {
        if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/guide")) links.add(href.split("#")[0]);
      }
      if (["/", "/start", "/mission-control"].includes(route)) {
        await page.screenshot({ path: new URL(`${route === "/" ? "home" : route.slice(1)}-${width}.png`, output).pathname, fullPage: true });
      }
    }

    if (width === 1440) {
      await page.goto(origin);
      const guideTrigger = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("button", { name: "Guide", exact: true });
      await guideTrigger.focus();
      await page.keyboard.press("Enter");
      assert.equal(await guideTrigger.getAttribute("aria-expanded"), "true");
      await page.keyboard.press("ArrowDown");
      await page.waitForFunction(() => document.activeElement?.textContent === "Overview");
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), "Overview");
      await page.keyboard.press("End");
      await page.waitForFunction(() => document.activeElement?.textContent === "Search");
      assert.equal(await page.evaluate(() => document.activeElement?.textContent), "Search");
      await page.keyboard.press("Escape");
      assert.equal(await guideTrigger.getAttribute("aria-expanded"), "false");
      assert.ok(await guideTrigger.evaluate(node => node === document.activeElement));
      report.flows.push({ name: "guide-dropdown-keyboard-and-focus-return", width, result: "PASS" });

      const navGeometry = async () => page.locator(".desktop-nav > a, .desktop-nav > .nav-dropdown > button").evaluateAll(nodes => nodes.map(node => ({
        label: node.textContent?.trim(),
        left: node.getBoundingClientRect().left,
        width: node.getBoundingClientRect().width,
      })));
      await page.goto(`${origin}/architecture`);
      const architectureGeometry = await navGeometry();
      await page.goto(`${origin}/guide`);
      const guideGeometry = await navGeometry();
      assert.deepEqual(guideGeometry.map(({ label }) => label), architectureGeometry.map(({ label }) => label));
      for (let index = 0; index < architectureGeometry.length; index += 1) {
        assert.ok(Math.abs(guideGeometry[index].left - architectureGeometry[index].left) < 0.1, `${architectureGeometry[index].label} must not shift when Guide becomes active`);
        assert.ok(Math.abs(guideGeometry[index].width - architectureGeometry[index].width) < 0.1, `${architectureGeometry[index].label} must keep a stable width`);
      }
      report.flows.push({ name: "global-navigation-stable-across-active-routes", width, result: "PASS" });
    }

    await page.goto(`${origin}/start`);
    assert.ok(await page.getByRole("button", { name: "Continue", exact: true }).isDisabled());
    await page.getByRole("combobox").selectOption("Test repair");
    await page.getByLabel("Outcome", { exact: true }).fill("Repair the synthetic date conversion regression.");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByLabel("What proves the work succeeded?").fill("The date regression test passes\nExisting contracts remain unchanged");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("checkbox", { name: "Repository read", exact: true }).check();
    await page.getByRole("checkbox", { name: "Code modification", exact: true }).check();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("checkbox", { name: "Tests", exact: true }).check();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    assert.ok(await page.getByRole("button", { name: "Generate Factory Definition" }).isDisabled());
    await page.getByRole("checkbox", { name: "Merge", exact: true }).check();
    await page.getByRole("button", { name: "Generate Factory Definition" }).click();
    await page.getByRole("heading", { name: "Test repair", exact: true }).waitFor();
    assert.match(await page.locator(".factory-result").innerText(), /Repair the synthetic date conversion regression/);
    await audit("factory-definition-result");
    await page.getByRole("button", { name: "Start over" }).click();
    assert.equal(await page.getByLabel("Outcome", { exact: true }).inputValue(), "");
    report.flows.push({ name: "factory-builder-validation-generate-reset", width, result: "PASS" });

    await page.goto(`${origin}/maturity`);
    await page.getByRole("button", { name: "Start assessment", exact: true }).click();
    for (let index = 0; index < 11; index++) {
      const next = page.getByRole("button", { name: index === 10 ? "View result" : "Next dimension", exact: true });
      assert.ok(await next.isDisabled());
      await page.getByRole("radio").first().check();
      await next.click();
    }
    await page.getByRole("button", { name: "Retake assessment" }).waitFor();
    assert.match(await page.locator(".assessment-result").innerText(), /Level 0/);
    await audit("maturity-result");
    await page.getByRole("button", { name: "Retake assessment" }).click();
    await page.getByRole("button", { name: "Start assessment", exact: true }).waitFor();
    report.flows.push({ name: "eleven-dimension-assessment-result-reset", width, result: "PASS" });

    await page.goto(`${origin}/mission-control`);
    for (const name of ["Mission Control delivery stages", "Mission Control operator views"]) {
      const tabs = page.getByRole("tablist", { name }).getByRole("tab");
      for (let index = 0; index < await tabs.count(); index++) {
        await tabs.nth(index).click();
        assert.equal(await tabs.nth(index).getAttribute("aria-selected"), "true");
        await page.locator(`#${await tabs.nth(index).getAttribute("aria-controls")}`).waitFor();
        await audit(`${name}-${index}`);
      }
    }
    report.flows.push({ name: "mission-control-delivery-and-operator-tabs", width, result: "PASS" });

    await page.goto(origin);
    const stages = page.getByRole("tablist", { name: "Runtime lifecycle stages" }).getByRole("tab");
    // Prove hydration through an observable state change; prefetch may stay active.
    await stages.first().click();
    await page.waitForFunction(() => document.querySelector('.factory-explorer-stages button:first-child').getAttribute("aria-selected") === "true");
    await stages.first().focus();
    await page.keyboard.press("End");
    await page.waitForFunction(() => document.querySelector('.factory-explorer-stages button:last-child') === document.activeElement && document.activeElement.getAttribute("aria-selected") === "true");
    assert.equal(await stages.last().getAttribute("aria-selected"), "true");
    await page.keyboard.press("Home");
    await page.waitForFunction(() => document.querySelector('.factory-explorer-stages button:first-child') === document.activeElement && document.activeElement.getAttribute("aria-selected") === "true");
    assert.equal(await stages.first().getAttribute("aria-selected"), "true");
    await page.keyboard.press("ArrowRight");
    await page.waitForFunction(() => document.querySelector('.factory-explorer-stages button:nth-child(2)').getAttribute("aria-selected") === "true");
    assert.equal(await stages.nth(1).getAttribute("aria-selected"), "true");
    report.flows.push({ name: "factory-explorer-keyboard", width, result: "PASS" });

    await page.goto(`${origin}/deploy`);
    const definitionDetail = page.locator(".fde-definition-grid details").first();
    assert.equal(await definitionDetail.getAttribute("open"), null);
    await definitionDetail.locator("summary").click();
    assert.notEqual(await definitionDetail.getAttribute("open"), null);
    assert.match(await definitionDetail.innerText(), /Intent.*outcome the factory exists to produce/is);
    await audit("factory-definition-component-open");
    report.flows.push({ name: "fde-factory-definition-disclosure", width, result: "PASS" });

    if (width === 390) {
      await page.getByLabel("Open navigation", { exact: true }).click();
      await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Framework", exact: true }).click();
      await page.waitForURL(`${origin}/framework`);
      await page.waitForFunction(() => document.querySelector(".global-mobile > button")?.getAttribute("aria-expanded") === "false");
      const comparison = page.getByRole("region", { name: "Category comparison" });
      await comparison.focus();
      assert.ok(await comparison.evaluate(node => node === document.activeElement));
      await page.keyboard.press("ArrowRight");
      await page.waitForFunction(() => document.querySelector(".category-table-shell").scrollLeft > 0);
      report.flows.push({ name: "mobile-navigation-and-keyboard-table-scroll", width, result: "PASS" });
    }
  }
  for (const route of [...links].sort()) {
    const response = await page.request.get(`${origin}${route}`);
    report.links.push({ route, status: response.status() });
    assert.equal(response.status(), 200, route);
  }
  assert.deepEqual(report.errors, []);
  assert.equal(server.exitCode, null, `The owned production preview exited during qualification: ${serverLog}`);
  report.result = "PASS";
} finally {
  await browser?.close();
  if (server.exitCode === null) {
    const exited = once(server, "exit");
    server.kill("SIGTERM");
    await Promise.race([exited, delay(5000).then(() => server.kill("SIGKILL"))]);
  }
  await writeFile(new URL("report.json", output), `${JSON.stringify(report, null, 2)}\n`);
  await writeFile(new URL("server.log", output), serverLog);
  console.log(JSON.stringify({ result: report.result, browserChecks: report.results.length, flows: report.flows.length, links: report.links.length, report: new URL("report.json", output).pathname }));
}
