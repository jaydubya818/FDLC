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
const port = process.env.FDLC_BROWSER_PORT ?? "4186";
const origin = `http://127.0.0.1:${port}`;
const output = new URL(runtime === "next" ? "../output/playwright/site-next/" : "../output/playwright/site/", import.meta.url);
await mkdir(output, { recursive: true });
const serverCli = runtime === "next" ? "../node_modules/next/dist/bin/next" : "../node_modules/vinext/dist/cli.js";
const server = spawn(process.execPath, [new URL(serverCli, import.meta.url).pathname, "start", "--hostname", "127.0.0.1", "--port", port], {
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
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"], { origin });
  page.on("pageerror", error => report.errors.push({ url: page.url(), message: error.message }));
  // This suite owns the FDLC artifact. Composed /guide routes belong to the
  // independently built Guide artifact and are covered by the migration's
  // exact-deployment composition suites, not by a mutable remote dependency
  // during the FDLC local-build gate.
  const routes = ["/", "/framework", "/architecture", "/in-5-minutes", "/manifesto", "/mission-control", "/spec", "/maturity", "/benchmarks", "/enterprise", "/deploy", "/start", "/factory-skills", "/lab", "/simulator", "/about", "/updates", "/corpus-preview", "/corpus-preview/compare", "/corpus-preview/anti-patterns/hidden-agent-state", "/corpus-preview/tutorials/scale-across-repositories"];
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
  async function keyboardActivateButton(name) {
    const button = page.getByRole("button", { name, exact: true });
    for (let attempt = 0; attempt < 100 && !(await button.isEnabled()); attempt++) await delay(10);
    assert.ok(await button.isEnabled(), `${name} must become enabled after keyboard input`);
    await button.focus();
    assert.ok(await button.evaluate(node => node === document.activeElement));
    await page.keyboard.press("Enter");
  }
  async function waitForFactoryStep(stepNumber) {
    const selector = `section[aria-label="Factory Definition builder, step ${stepNumber} of 5"]`;
    await page.locator(selector).waitFor();
    await page.waitForFunction((stepSelector) => document.activeElement?.matches(stepSelector), selector);
  }
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    for (const route of routes) {
      const response = await page.goto(`${origin}${route}`);
      assert.equal(response.status(), 200, route);
      await page.getByRole("heading", { level: 1 }).waitFor();
      await checkGlobalNavigation(page, { mobile: width === 390, keyboard: route === "/" });
      await audit(route);
      const presentation = await page.evaluate(() => {
        const visible = node => !node.closest("svg") && node.getClientRects().length && getComputedStyle(node).visibility !== "hidden";
        const rect = node => { const box = node.getBoundingClientRect(); return { name: node.id || node.className || node.tagName, left: box.left, right: box.right, height: box.height, width: box.width }; };
        return {
          clippedText: [...document.querySelectorAll("main h1, main h2, main h3, main p")].filter(visible).map(rect).filter(box => box.width > 0 && (box.left < -.5 || box.right > innerWidth + .5)),
          oversizedButtons: [...document.querySelectorAll("main .button")].filter(visible).map(rect).filter(box => box.height > 80),
          hero: document.querySelector(".page-hero") && rect(document.querySelector(".page-hero")),
          contained: [...document.querySelectorAll(".page-wrap > :is(.guide-reference, .guide-reading, .factory-handoff-diagram, .enterprise-note, .governing-lifecycle, .starter-outcome, .starter-limits, .starter-download-note)"), ...document.querySelectorAll(innerWidth >= 1024 ? ".page-wrap > .longform-layout" : ".longform-content > .section-block")].filter(visible).map(rect),
          wrapperOverflow: document.querySelector(".page-wrap") && getComputedStyle(document.querySelector(".page-wrap")).overflowX,
        };
      });
      assert.deepEqual(presentation.clippedText, [], `${route}: visible reading text stays within the page`);
      assert.deepEqual(presentation.oversizedButtons, [], `${route}: actions keep their intended control height`);
      assert.ok(!["hidden", "clip"].includes(presentation.wrapperOverflow), `${route}: page wrapper must not hide layout failures`);
      for (const block of presentation.contained) if (presentation.hero) {
        assert.ok(Math.abs(block.left - presentation.hero.left) < 2, `${route} ${block.name}: aligned left gutter`);
        assert.ok(Math.abs(block.right - presentation.hero.right) < 2, `${route} ${block.name}: aligned right gutter`);
      }
      if (route === "/lab") {
        const layout = await page.evaluate(() => {
          const hero = document.querySelector(".engineering-tutorial .page-hero").getBoundingClientRect();
          return {
            hero: { left: hero.left, right: hero.right, width: hero.width },
            sections: [...document.querySelectorAll(".tutorial-nav, .tutorial-orientation, .tutorial-section")].map(node => {
              const rect = node.getBoundingClientRect();
              return { name: node.id || node.className, left: rect.left, right: rect.right };
            }),
            introTextWidth: document.querySelector(".tutorial-orientation-copy > p").getBoundingClientRect().width,
            downloadHeight: document.querySelector(".tutorial-download-actions .button").getBoundingClientRect().height,
          };
        });
        for (const section of layout.sections) {
          assert.ok(Math.abs(section.left - layout.hero.left) < 2, `${section.name}: shares the hero's left gutter`);
          assert.ok(Math.abs(section.right - layout.hero.right) < 2, `${section.name}: shares the hero's right gutter`);
        }
        assert.ok(layout.introTextWidth >= layout.hero.width * (width < 820 ? .75 : .55), "Lab introduction has a readable column width");
        assert.ok(layout.downloadHeight >= 44 && layout.downloadHeight <= 72, "Lab download action keeps a normal touch-target height");
        report.flows.push({ name: "lab-page-gutters-and-readable-introduction", width, result: "PASS" });
      }
      if (route === "/lab" && width === 390) {
        const code = page.getByRole("region", { name: "Reference Lab commands", exact: true });
        await code.focus();
        assert.ok(await code.evaluate(node => node === document.activeElement));
        if (await code.evaluate(node => node.scrollWidth > node.clientWidth)) {
          await page.keyboard.press("ArrowRight");
          await page.waitForFunction(() => document.querySelector('pre[aria-label="Reference Lab commands"]').scrollLeft > 0);
        }
        report.flows.push({ name: "tutorial-commands-keyboard-scroll", width, result: "PASS" });
      }
      if (route === "/factory-skills") {
        assert.equal(await page.locator(".starter-outcome").evaluate(node => getComputedStyle(node).display), "grid", "Starter layout styles must reach the browser");
      }
      if (route === "/architecture") {
        const systemFlow = page.locator("#system-flow");
        const layout = await systemFlow.evaluate(section => {
          const heading = section.querySelector("h2");
          return {
            headingLines: heading.getBoundingClientRect().height / parseFloat(getComputedStyle(heading).lineHeight),
            mapWidthRatio: section.querySelector(".system-map").getBoundingClientRect().width / section.getBoundingClientRect().width,
          };
        });
        assert.ok(layout.headingLines <= (width === 390 ? 4.1 : 2.1), "System flow heading must not collapse into a narrow column");
        assert.ok(layout.mapWidthRatio >= .8, "System map uses the content column instead of repeated viewport gutters");
        await systemFlow.screenshot({ path: new URL(`architecture-system-flow-${width}.png`, output).pathname });
        report.flows.push({ name: "architecture-system-flow-readable-width", width, result: "PASS" });
      }
      for (const href of await page.locator("a[href]").evaluateAll(nodes => nodes.map(n => n.getAttribute("href")))) {
        if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/guide") && !href.startsWith("/deploy/app")) links.add(href.split("#")[0]);
      }
      if (["/", "/start", "/factory-skills", "/mission-control"].includes(route)) {
        await page.screenshot({ path: new URL(`${route === "/" ? "home" : route.slice(1)}-${width}.png`, output).pathname, fullPage: true });
      }
    }

    if (width === 1440) {
      await page.goto(origin);
      const guideTrigger = page.getByRole("navigation", { name: "Primary navigation" }).getByRole("button", { name: "Guide navigation", exact: true });
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

    await page.goto(`${origin}/about`);
    await page.evaluate(() => sessionStorage.removeItem("fdlc.factory-definition.draft.v1"));
    await page.goto(`${origin}/start`);
    const continueButton = page.getByRole("button", { name: "Continue", exact: true });
    await continueButton.waitFor();
    assert.ok(await continueButton.isDisabled());
    await page.getByRole("combobox").selectOption("Test repair");
    await page.getByLabel("Describe the outcome", { exact: true }).fill("Repair the synthetic date conversion regression.");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByLabel("What proves the work succeeded?").fill("The date regression test passes\nExisting contracts remain unchanged");
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("checkbox", { name: "Read repositories", exact: true }).check();
    await page.getByRole("checkbox", { name: "Modify code", exact: true }).check();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    await page.getByRole("checkbox", { name: "Automated tests", exact: true }).check();
    await page.getByRole("button", { name: "Continue", exact: true }).click();
    assert.ok(await page.getByRole("button", { name: "Generate Factory Definition" }).isDisabled());
    await page.getByRole("checkbox", { name: "Approve merge", exact: true }).check();
    await page.getByRole("button", { name: "Generate Factory Definition" }).click();
    await page.getByRole("heading", { name: "Test repair", exact: true }).waitFor();
    assert.ok(await page.locator(".factory-result").evaluate(node => node === document.activeElement));
    assert.match(await page.locator(".factory-result").innerText(), /Repair the synthetic date conversion regression/);
    await page.getByRole("button", { name: "Copy Factory Definition" }).click();
    await page.getByText("Copied to your clipboard.", { exact: true }).waitFor();
    assert.match(await page.evaluate(() => navigator.clipboard.readText()), /# Factory Definition: Test repair/);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download Factory Definition" }).click();
    const download = await downloadPromise;
    assert.equal(download.suggestedFilename(), "test-repair-factory-definition.md");
    await audit("factory-definition-result");
    await page.screenshot({ path: new URL(`factory-definition-result-${width}.png`, output).pathname, fullPage: true });
    await page.getByRole("button", { name: "Start over" }).click();
    assert.equal(await page.getByLabel("Describe the outcome", { exact: true }).inputValue(), "");
    await page.getByRole("combobox").selectOption("Test repair");
    await page.getByLabel("Describe the outcome", { exact: true }).fill("Persist this draft across refresh.");
    await page.reload();
    assert.equal(await page.getByLabel("Describe the outcome", { exact: true }).inputValue(), "Persist this draft across refresh.");
    report.flows.push({ name: "factory-builder-validation-export-reset", width, result: "PASS" });

    await page.goto(`${origin}/start`);
    const keyboardWorkType = page.getByRole("combobox");
    await keyboardWorkType.focus();
    await page.keyboard.type("Test repair");
    assert.equal(await keyboardWorkType.inputValue(), "Test repair");
    await page.getByLabel("Describe the outcome", { exact: true }).focus();
    await page.keyboard.type("Repair the synthetic keyboard navigation regression.");
    await keyboardActivateButton("Continue");
    await waitForFactoryStep(2);
    await page.getByLabel("What proves the work succeeded?").focus();
    await page.keyboard.type("The keyboard regression test passes");
    await keyboardActivateButton("Continue");
    await waitForFactoryStep(3);
    for (const name of ["Read repositories", "Modify code"]) {
      await page.getByRole("checkbox", { name, exact: true }).focus();
      await page.keyboard.press("Space");
    }
    await keyboardActivateButton("Continue");
    await waitForFactoryStep(4);
    await page.getByRole("checkbox", { name: "Automated tests", exact: true }).focus();
    await page.keyboard.press("Space");
    await keyboardActivateButton("Continue");
    await waitForFactoryStep(5);
    await page.getByRole("checkbox", { name: "Approve merge", exact: true }).focus();
    await page.keyboard.press("Space");
    await keyboardActivateButton("Generate Factory Definition");
    assert.ok(await page.locator(".factory-result").evaluate(node => node === document.activeElement));
    await page.getByRole("button", { name: "Copy Factory Definition" }).focus();
    await page.keyboard.press("Enter");
    await page.getByText("Copied to your clipboard.", { exact: true }).waitFor();
    const keyboardDownloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download Factory Definition" }).focus();
    await page.keyboard.press("Enter");
    assert.equal((await keyboardDownloadPromise).suggestedFilename(), "test-repair-factory-definition.md");
    // Verify every reusable format, including the browser's denied-clipboard fallback.
    const exported = {};
    for (const format of ["JSON", "YAML"]) {
      await page.getByRole("button", { name: format, exact: true }).click();
      await page.getByText(`View reusable ${format}`, { exact: true }).click();
      exported[format] = await page.getByRole("textbox", { name: `${format} artifact`, exact: true }).inputValue();
      const download = page.waitForEvent("download");
      await page.getByRole("button", { name: `Download ${format}`, exact: true }).click();
      assert.match((await download).suggestedFilename(), new RegExp(format.toLowerCase() + "$"));
      await page.getByText(`View reusable ${format}`, { exact: true }).click();
    }
    const { parse } = await import("yaml");
    assert.deepEqual(parse(exported.YAML), JSON.parse(exported.JSON));
    await page.evaluate(() => { navigator.clipboard.writeText = async () => { throw new DOMException("Denied", "NotAllowedError"); }; });
    await page.getByRole("button", { name: "Copy YAML", exact: true }).click();
    const fallback = page.getByRole("textbox", { name: "YAML artifact", exact: true });
    assert.ok(await fallback.isVisible());
    assert.ok(await fallback.evaluate(field => field === document.activeElement && field.selectionEnd === field.value.length));
    await page.reload();
    report.flows.push({ name: "factory-builder-keyboard-only-complete-copy-download", width, result: "PASS" });

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
    for (const name of ["Define one bounded factory line", "Use the Guide", "Explore AI-FDE"]) assert.ok(await page.getByRole("link", { name }).isVisible());
    await audit("maturity-result");
    await page.screenshot({ path: new URL(`maturity-result-${width}.png`, output).pathname, fullPage: true });
    const shared = new URL(page.url());
    assert.equal(shared.search, "");
    assert.ok(shared.hash.includes("intent="));
    await page.reload();
    await page.getByRole("button", { name: "Retake assessment" }).waitFor();
    assert.match(await page.locator(".assessment-result").innerText(), /Level 0/);
    const maturityDownload = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download Markdown", exact: true }).click();
    assert.match((await maturityDownload).suggestedFilename(), /fdlc-maturity-l0\.md/);
    await page.getByRole("button", { name: "Retake assessment" }).click();
    await page.getByRole("button", { name: "Start assessment", exact: true }).waitFor();
    report.flows.push({ name: "eleven-dimension-assessment-result-reset", width, result: "PASS" });

    await page.goto(`${origin}/maturity`);
    await page.getByRole("button", { name: "Start assessment", exact: true }).focus();
    await page.keyboard.press("Enter");
    for (let index = 0; index < 11; index++) {
      await page.getByRole("radio").first().focus();
      await page.keyboard.press("Space");
      const nextLabel = index === 10 ? "View result" : "Next dimension";
      await keyboardActivateButton(nextLabel);
      if (index < 10) {
        const expectedDimension = `dimension ${index + 2} of`;
        let assessmentLabel = "";
        for (let attempt = 0; attempt < 100; attempt++) {
          assessmentLabel = await page.locator(".assessment-panel").getAttribute("aria-label") ?? "";
          const panelHasFocus = await page.locator(".assessment-panel").evaluate(node => node === document.activeElement);
          if (assessmentLabel.includes(expectedDimension) && panelHasFocus) break;
          await delay(10);
        }
        assert.match(assessmentLabel, new RegExp(expectedDimension), `Keyboard assessment must advance to ${expectedDimension}`);
      }
    }
    assert.ok(await page.locator(".assessment-result").evaluate(node => node === document.activeElement));
    const keyboardNextStep = page.getByRole("link", { name: "Define one bounded factory line" });
    await keyboardNextStep.focus();
    await page.keyboard.press("Enter");
    await page.waitForURL(`${origin}/start`);
    report.flows.push({ name: "maturity-assessment-keyboard-only-complete-next-step", width, result: "PASS" });

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
    assert.match(await page.locator(".hero-problem").innerText(), /Trusted autonomous software delivery is not/);
    await page.getByRole("link", { name: "Experience a Factory", exact: true }).click();
    await page.waitForURL(`${origin}/simulator`);
    await keyboardActivateButton("Submit sample intent");
    await keyboardActivateButton("Run to the next boundary");
    assert.match(await page.locator(".simulator-result").innerText(), /Complete.*sample only/is);
    await audit("simulator-happy-outcome");
    await page.getByRole("radio", { name: "Failed verification + recovery", exact: true }).check();
    await keyboardActivateButton("Submit sample intent");
    await keyboardActivateButton("Run to the next boundary");
    assert.match(await page.locator(".simulator-result").innerText(), /Blocked/i);
    assert.equal(await page.locator(".experience-evidence > li").count(), 1);
    await keyboardActivateButton("Apply the fix and continue");
    await keyboardActivateButton("Run to the next boundary");
    assert.equal(await page.locator(".experience-evidence > li").count(), 2);
    assert.match(await page.locator(".experience-evidence").innerText(), /EV-1.*FAIL.*EV-2.*PASS/s);
    await audit("simulator-recovery-evidence");
    for (const approved of [false, true]) {
      await page.getByRole("radio", { name: "Human approval required", exact: true }).check();
      if (approved) await keyboardActivateButton("Reset");
      await keyboardActivateButton("Submit sample intent");
      await keyboardActivateButton("Run to the next boundary");
      assert.match(await page.locator(".simulator-result").innerText(), /Awaiting human approval/i);
      assert.ok(await page.getByRole("button", { name: "Run to the next boundary", exact: true }).isDisabled());
      await keyboardActivateButton(approved ? "Record sample human approval" : "Reject sample request");
      assert.ok(await page.locator(".simulator-result").evaluate(node => node === document.activeElement));
      if (approved) await keyboardActivateButton("Run to the next boundary");
      assert.match(await page.locator(".simulator-result").innerText(), approved ? /Complete.*sample only/is : /Denied.*safely stopped/is);
      await audit(approved ? "simulator-human-approved" : "simulator-human-denied");
    }
    report.flows.push({ name: "homepage-to-simulator-success-failure-recovery-human-decisions", width, result: "PASS" });
    await page.goto(origin);
    assert.ok(await page.getByRole("list", { name: "Dependency modernization factory flow" }).isVisible());

    const explorer = page.locator("#factory-explorer");
    await explorer.scrollIntoViewIfNeeded();
    const verifyTab = explorer.getByRole("tab", { name: /Verify/ });
    assert.equal(await verifyTab.getAttribute("aria-selected"), "true");
    await verifyTab.focus();
    await page.keyboard.press("ArrowRight");
    assert.equal(await explorer.getByRole("tab", { name: /Approve/ }).getAttribute("aria-selected"), "true");
    await explorer.getByRole("button", { name: /Evals/ }).click();
    assert.match(await explorer.locator(".factory-explorer-capability-detail").innerText(), /Evals/);
    const exampleRecord = explorer.locator(".factory-explorer-example a").first();
    assert.match(await exampleRecord.getAttribute("href") ?? "", /in-5-minutes/);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await explorer.getByRole("tab", { name: /Verify/ }).click();
    assert.equal(await verifyTab.getAttribute("aria-selected"), "true");
    await page.emulateMedia({ reducedMotion: "no-preference" });
    report.flows.push({ name: "factory-explorer-keyboard-capabilities-example-links", width, result: "PASS" });

    await page.goto(`${origin}/deploy`);
    const definitionDetail = page.locator(".fde-definition-grid details").first();
    assert.equal(await definitionDetail.getAttribute("open"), null);
    await definitionDetail.locator("summary").click();
    assert.notEqual(await definitionDetail.getAttribute("open"), null);
    assert.match(await definitionDetail.innerText(), /Objective.*measurable outcome the factory should produce/is);
    await audit("factory-definition-component-open");
    report.flows.push({ name: "ai-fde-factory-definition-disclosure", width, result: "PASS" });

    const fdeProductTour = page.getByLabel("Mission Control operator views");
    await fdeProductTour.getByRole("tab", { name: /Work Orders/ }).click();
    assert.match(await page.locator("#mc-product-panel").innerText(), /Keep scope, authority, and verification on one record/i);
    await audit("fde-customer-product-work-orders");
    report.flows.push({ name: "ai-fde-mission-control-boundary-tour", width, result: "PASS" });

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

  // Storage failure must leave the builder usable, and malformed drafts must be ignored.
  const denied = await browser.newPage();
  await denied.addInitScript(() => {
    Storage.prototype.setItem = () => { throw new DOMException("Storage denied", "SecurityError"); };
    Storage.prototype.removeItem = () => { throw new DOMException("Storage denied", "SecurityError"); };
  });
  await denied.goto(`${origin}/start`);
  await denied.getByText("Draft could not be saved in this browser. Keep this page open until you export your result.", { exact: true }).waitFor();
  await denied.getByRole("combobox").selectOption("Test repair");
  await denied.getByLabel("Describe the outcome", { exact: true }).fill("Repair the storage-denial test case.");
  await denied.getByRole("button", { name: "Continue", exact: true }).click();
  await denied.getByLabel("What proves the work succeeded?").waitFor();
  await denied.close();
  const malformed = await browser.newPage();
  await malformed.addInitScript(() => sessionStorage.setItem("fdlc.factory-definition.draft.v1", JSON.stringify({ step: 2, form: { outcome: null, authority: "broken" }, submitted: true })));
  await malformed.goto(`${origin}/start`);
  await malformed.getByLabel("Describe the outcome", { exact: true }).waitFor();
  assert.equal(await malformed.getByLabel("Describe the outcome", { exact: true }).inputValue(), "");
  await malformed.close();
  report.flows.push({ name: "builder-storage-denial-and-malformed-draft", result: "PASS" });

  // Verify local fragment targets rather than accepting only a page-level 200.
  const { maturityGapLinks } = await import("../data/maturity-actions.ts");
  for (const href of new Set(Object.values(maturityGapLinks).flat().map(([, href]) => href).filter(href => href.includes("#") && !href.startsWith("/guide")))) {
    await page.goto(`${origin}${href}`);
    assert.equal(await page.locator(`[id="${href.split("#")[1]}"]`).count(), 1, `Missing fragment target: ${href}`);
  }
  // WCAG 1.4.10: 200% zoom of a 1280px layout is 640 CSS pixels.
  await page.setViewportSize({ width: 640, height: 512 });
  for (const route of ["/", "/in-5-minutes", "/framework", "/architecture", "/start", "/factory-skills", "/maturity", "/deploy", "/mission-control"]) {
    const response = await page.goto(`${origin}${route}`);
    assert.equal(response.status(), 200, `${route} @200%`);
    await page.getByRole("heading", { level: 1 }).waitFor();
    await audit(`${route}@200%`);
  }
  report.flows.push({ name: "reflow-200-percent-key-journeys", width: 640, result: "PASS" });
  // The lifecycle is an educational explorer: selection changes explanation,
  // never execution state or release authority.
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(origin);
    const explorer = page.locator(".governing-lifecycle");
    const stages = ["Intent", "Planning", "Execution", "Evidence", "Verification", "Approval", "Release", "Outcomes", "Learning"];
    for (const stage of stages) {
      const button = explorer.getByRole("button", { name: stage, exact: true });
      await button.focus();
      await page.keyboard.press("Enter");
      assert.equal(await button.getAttribute("aria-pressed"), "true");
      assert.equal(await explorer.locator('button[aria-pressed="true"]').count(), 1);
      const panel = page.locator(`[id="${await button.getAttribute("aria-controls")}"]`);
      assert.equal(await panel.locator("h4").innerText(), stage);
      assert.equal(await panel.locator("dt").allTextContents().then(items => items.join(",")), "Input,Output");
      assert.ok((await panel.locator(".governing-example p").innerText()).length > 40);
    }
    await explorer.getByRole("button", { name: "Return to Intent" }).click();
    assert.equal(await explorer.getByRole("button", { name: "Intent", exact: true }).getAttribute("aria-pressed"), "true");
    await explorer.getByRole("button", { name: "Previous stage" }).click();
    assert.equal(await explorer.getByRole("button", { name: "Learning", exact: true }).getAttribute("aria-pressed"), "true");
    await audit(`interactive-lifecycle@${width}`);
    await page.goto(`${origin}/architecture#context-skills`);
    const practice = page.locator(".skills-practices details").nth(1);
    await practice.locator("summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await practice.getAttribute("open"), "");
    await audit(`skills-disclosure@${width}`);
    await page.goto(`${origin}/architecture`);
    const harness = page.locator("details#harness");
    await harness.locator(":scope > summary").waitFor();
    assert.equal(await harness.getAttribute("open"), null);
    await page.goto(`${origin}/architecture#harness`);
    await page.waitForFunction(() => document.querySelector("details#harness")?.open);
    await harness.locator(":scope > summary").focus();
    await page.keyboard.press("Enter");
    assert.equal(await harness.getAttribute("open"), null);
    await page.keyboard.press("Enter");
    assert.equal(await harness.getAttribute("open"), "");
    await page.goto(`${origin}/maturity`);
    const journey = page.locator(".maturity-journey");
    for (const button of await journey.getByRole("button").all()) {
      await button.focus();
      await page.keyboard.press("Enter");
      assert.equal(await button.getAttribute("aria-pressed"), "true");
      assert.equal(await journey.locator('button[aria-pressed="true"]').count(), 1);
      assert.equal(await journey.locator("h3").innerText(), await button.locator("strong").innerText());
    }
    await audit(`maturity-explorer@${width}`);

  }
  report.flows.push({ name: "interactive-lifecycle-and-skills-keyboard", result: "PASS" });
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
