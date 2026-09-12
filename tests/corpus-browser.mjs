import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { setTimeout as delay } from "node:timers/promises";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const runtime = process.argv[2] ?? "vinext";
assert.ok(["vinext", "next"].includes(runtime));
const origin = "http://127.0.0.1:4190";
const output = new URL(`../output/playwright/corpus-preview-${runtime}/`, import.meta.url);
await mkdir(output, { recursive: true });
const serverCli = runtime === "next" ? "../node_modules/next/dist/bin/next" : "../node_modules/vinext/dist/cli.js";
const server = spawn(process.execPath, [new URL(serverCli, import.meta.url).pathname, "start", "--hostname", "127.0.0.1", "--port", "4190"], {
  cwd: new URL("..", import.meta.url),
  env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/corpus-browser.log" },
  stdio: ["ignore", "pipe", "pipe"],
});
let serverLog = "";
server.stdout.on("data", chunk => { serverLog += chunk; });
server.stderr.on("data", chunk => { serverLog += chunk; });
const report = { schema: "fdlc-corpus-browser/v1", runtime, checks: [], result: "FAIL" };
let browser;

async function waitForServer() {
  for (let attempt = 0; attempt < 120; attempt++) {
    assert.equal(server.exitCode, null, `Corpus preview exited: ${serverLog}`);
    if (serverLog.includes("Production server running") || serverLog.includes("Ready in")) {
      await delay(250);
      return;
    }
    await delay(100);
  }
  assert.fail(`Corpus preview did not start: ${serverLog}`);
}

async function audit(page, label) {
  await page.addScriptTag({ path: require.resolve("axe-core/axe.min.js") });
  const result = await page.evaluate(async () => ({
    overflow: document.documentElement.scrollWidth > innerWidth,
    overflowTargets: [...document.querySelectorAll("body *")].filter((element) => element.getBoundingClientRect().right > document.documentElement.clientWidth + 1).slice(0, 12).map((element) => ({ className: element.className, right: Math.round(element.getBoundingClientRect().right), tag: element.tagName, width: Math.round(element.getBoundingClientRect().width) })),
    violations: (await window.axe.run()).violations.map(violation => ({ id: violation.id, targets: violation.nodes.map(node => node.target) })),
  }));
  assert.equal(result.overflow, false, `${label}: horizontal overflow ${JSON.stringify(result.overflowTargets)}`);
  assert.deepEqual(result.violations, [], `${label}: accessibility violations`);
  report.checks.push({ label, result: "PASS" });
}

try {
  await waitForServer();
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || undefined });
  const page = await browser.newPage();

  const diagramPage = await browser.newPage();
  await diagramPage.setContent("<!doctype html><html><body></body></html>");
  await diagramPage.addScriptTag({ path: new URL("../node_modules/mermaid/dist/mermaid.min.js", import.meta.url).pathname });
  const diagramRoot = new URL("../content/fdlc-corpus/corpus/diagrams/mermaid/", import.meta.url);
  const diagramFiles = (await readdir(diagramRoot)).filter((name) => name.endsWith(".mmd")).sort();
  for (const name of diagramFiles) {
    const source = await readFile(new URL(name, diagramRoot), "utf8");
    await diagramPage.evaluate(async ({ diagramName, diagramSource }) => {
      globalThis.mermaid.initialize({ securityLevel: "strict", startOnLoad: false, suppressErrorRendering: true });
      const valid = await globalThis.mermaid.parse(diagramSource, { suppressErrors: false });
      if (!valid) throw new Error(`${diagramName} did not parse`);
    }, { diagramName: name, diagramSource: source });
  }
  await diagramPage.close();
  assert.equal(diagramFiles.length, 33);
  report.checks.push({ label: "all-33-mermaid-sources-parse", result: "PASS" });

  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: width === 390 ? 844 : 900 });
    await page.goto(`${origin}/corpus-preview`);
    await page.getByRole("heading", { name: "Find the guidance you need to build a trustworthy software factory." }).waitFor();
    await page.getByRole("heading", { name: "Choose a path through FDLC." }).waitFor();
    await audit(page, `catalog-${width}`);
    await page.screenshot({ path: new URL(`catalog-${width}.png`, output).pathname, fullPage: true });

    await page.goto(`${origin}/corpus-preview/architecture/verification`);
    await page.getByRole("heading", { level: 1, name: "Verification-first engineering" }).waitFor();
    await audit(page, `document-${width}`);
    await page.screenshot({ path: new URL(`document-${width}.png`, output).pathname, fullPage: true });
  }

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${origin}/corpus-preview`);
  assert.equal(await page.locator(".corpus-journey").count(), 4);
  assert.equal(await page.locator(".corpus-journey a").count(), 14);
  assert.equal(await page.locator(".corpus-results > li").count(), 9);
  await page.getByRole("button", { name: "Show 9 more" }).click();
  assert.equal(await page.locator(".corpus-results > li").count(), 18);
  report.checks.push({ label: "catalog-progressive-disclosure", result: "PASS" });

  await page.getByLabel("Collection").selectOption("architecture");
  await page.getByLabel("Search titles and metadata").fill("verification");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page.waitForURL(/collection=architecture.*q=verification/);
  assert.ok(await page.locator(".corpus-results a").count() > 0);
  await page.locator(".corpus-results a").first().click();
  await page.getByRole("link", { name: "Corpus catalog" }).first().click();
  await page.waitForURL(/\/corpus-preview\?collection=architecture/);
  assert.match(page.url(), /collection=architecture/);
  assert.match(page.url(), /q=verification/);
  report.checks.push({ label: "url-addressable-filter-and-return", result: "PASS" });

  await page.goto(`${origin}/corpus-preview`);
  await page.getByLabel("Audience").selectOption("builder");
  await page.getByLabel("Depth").selectOption("beginner");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await page.waitForURL(/audience=builder.*level=beginner/);
  assert.equal(await page.getByLabel("Audience").inputValue(), "builder");
  assert.equal(await page.getByLabel("Depth").inputValue(), "beginner");
  assert.ok(await page.locator(".corpus-results a").count() > 0);
  report.checks.push({ label: "audience-and-depth-filters", result: "PASS" });

  await page.goto(`${origin}/corpus-preview?q=definitely-no-matching-document`);
  await page.getByRole("heading", { name: "No document matches those filters." }).waitFor();
  await page.getByRole("button", { name: "Clear filters" }).click();
  await page.waitForURL(`${origin}/corpus-preview`);
  report.checks.push({ label: "empty-state-recovery", result: "PASS" });

  await page.goto(`${origin}/corpus-preview/start#builder`);
  await page.locator("#builder").waitFor();
  assert.match(await page.locator("#builder").innerText(), /Developer \/ Builder/);
  report.checks.push({ label: "direct-custom-fragment", result: "PASS" });

  await page.goto(`${origin}/corpus-preview/framework`);
  await page.locator(".corpus-mermaid.is-ready").first().waitFor({ timeout: 20000 });
  assert.ok(await page.locator(".corpus-mermaid details").count() > 0);
  report.checks.push({ label: "mermaid-render-and-source", result: "PASS" });

  const raw = await page.request.get(`${origin}/corpus-artifacts/corpus/specification/schemas/intent.schema.json`);
  assert.equal(raw.status(), 200);
  assert.match(raw.headers()["content-type"], /^application\/json/);
  assert.equal((await page.request.get(`${origin}/corpus-artifacts/corpus/specification/schemas/nope.schema.json`)).status(), 404);
  assert.equal((await page.goto(`${origin}/corpus-preview/not-a-real-document`)).status(), 404);
  await page.getByRole("link", { name: "Return to the corpus catalog" }).waitFor();
  report.checks.push({ label: "raw-artifact-and-contextual-404", result: "PASS" });

  await page.goto(`${origin}/start#factory-builder`);
  await page.getByRole("heading", { name: "Build your first software factory." }).waitFor();
  assert.ok(await page.getByRole("button", { name: "Continue", exact: true }).isDisabled());
  report.checks.push({ label: "canonical-start-tool-unchanged", result: "PASS" });

  const noScript = await browser.newContext({ javaScriptEnabled: false });
  const noScriptPage = await noScript.newPage();
  await noScriptPage.goto(`${origin}/corpus-preview/framework`);
  await noScriptPage.getByRole("heading", { level: 1, name: "The FDLC Framework" }).waitFor();
  assert.ok(await noScriptPage.locator(".corpus-mermaid details code").count() > 0);
  await noScript.close();
  report.checks.push({ label: "javascript-disabled-reading-and-diagram-source", result: "PASS" });

  report.result = "PASS";
} finally {
  await browser?.close();
  server.kill("SIGTERM");
  await writeFile(new URL("report.json", output), `${JSON.stringify(report, null, 2)}\n`);
}

console.log(JSON.stringify(report, null, 2));
