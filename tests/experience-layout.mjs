import assert from "node:assert/strict";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { gunzipSync } from "node:zlib";
import { chromium, firefox, webkit } from "playwright";
import sharp from "sharp";

const arg = (key, fallback) => process.argv.find((item) => item.startsWith("--" + key + "="))?.split("=").slice(1).join("=") || fallback;
const site = arg("site", "http://127.0.0.1:4381");
const guide = arg("guide", site);
const output = path.resolve(arg("output", "output/playwright/experience"));
const engine = arg("engine", "chromium");
const widths = arg("widths", "1920,1440,1280,1024,900,768,390,375,320").split(",").map(Number);
const golden = arg("compare", "");
const cases = [
  ["home", "/"], ["getting-started", "/start"], ["builder", "/start", "#factory-builder"],
  ["simulator", "/simulator", ".simulator"], ["maturity", "/maturity", ".assessment-panel"],
  ["architecture", "/architecture"], ["enterprise", "/enterprise"], ["mission-control", "/mission-control"],
  ["guide", "/guide"], ["chapter", "/guide/01-understand/02-the-factory-in-one-view"],
  ["search", "/guide/search"], ["atlas", "/guide/atlas"],
];
const only = arg("cases", "").split(",").filter(Boolean);
const browsers = { chromium, firefox, webkit };
const browser = await browsers[engine].launch({ headless: true, ...(process.env.CHROMIUM_PATH && engine === "chromium" ? { executablePath: process.env.CHROMIUM_PATH } : {}) });
const failures = [];
const pages = [];
const signatures = {};
const baseline = golden ? await readFile(golden) : null;
const reference = baseline ? JSON.parse((golden.endsWith(".gz") ? gunzipSync(baseline) : baseline).toString("utf8")) : null;
await mkdir(output, { recursive: true });

try {
  for (const [id, route, component] of cases.filter(([id]) => !only.length || only.includes(id))) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "reduce", colorScheme: "light", deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    await page.addInitScript(() => {
      window.__experienceMetrics = { lcp: null, cls: 0, interactions: [] };
      const collect = (type, callback, extra = {}) => {
        if (PerformanceObserver.supportedEntryTypes.includes(type)) new PerformanceObserver((list) => list.getEntries().forEach(callback)).observe({ type, buffered: true, ...extra });
      };
      collect("largest-contentful-paint", (entry) => { window.__experienceMetrics.lcp = Math.round(entry.startTime); });
      collect("layout-shift", (entry) => { if (!entry.hadRecentInput) window.__experienceMetrics.cls += entry.value; });
      collect("event", (entry) => { if (entry.interactionId) window.__experienceMetrics.interactions.push(entry.duration); }, { durationThreshold: 16 });
    });
    try {
      const response = await page.goto((route.startsWith("/guide") ? guide : site) + route, { waitUntil: "load", timeout: 45000 });
      assert.equal(response?.status(), 200, id);
      await page.evaluate(() => document.fonts.ready);
      await page.locator("main h1").first().waitFor();
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      const assets = await page.evaluate(() => {
        const resources = performance.getEntriesByType("resource");
        const bytes = (suffix) => resources.filter((r) => suffix.test(new URL(r.name).pathname)).reduce((a, r) => a + r.transferSize, 0);
        return { scripts: bytes(/\.js$/), styles: bytes(/\.css$/), fonts: bytes(/\.woff2?$/), images: bytes(/\.(webp|png|svg|avif|jpg)$|\/_next\/image$/), ...window.__experienceMetrics };
      });
      for (const width of widths) {
        await page.setViewportSize({ width, height: width <= 390 ? 812 : width <= 900 ? 960 : 900 });
        await page.evaluate(() => { window.scrollTo({ top: 0, behavior: "instant" }); });
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        const geometry = await page.evaluate(() => {
          const header = document.querySelector(".global-header")?.getBoundingClientRect();
          const heading = document.querySelector("main h1").getBoundingClientRect();
          const range = document.createRange(); range.selectNodeContents(document.querySelector("main h1"));
          const text = range.getBoundingClientRect();
          return { width: innerWidth, overflow: Math.max(0, document.documentElement.scrollWidth - innerWidth), headingClearance: Math.round(heading.top - (header?.bottom || 0)), headingFits: text.left >= -1 && text.right <= innerWidth + 1, headerHeight: Math.round(header?.height || 0) };
        });
        pages.push({ id, route, ...geometry, ...(width === widths[0] ? { assets } : {}) });
        if (geometry.overflow > 1 || geometry.headingClearance < -1 || !geometry.headingFits) failures.push({ id, width, geometry });
        if (component) {
          if (id === "maturity") {
            const start = page.getByRole("button", { name: "Start assessment", exact: true });
            if (await start.count() && await start.isVisible()) await start.click();
          }
          const target = page.locator(component).first();
          await target.waitFor();
          await target.evaluate((el) => el.scrollIntoView({ block: "start", behavior: "instant" }));
        }
        if ([1440,768,390].includes(width)) {
          const file = id + "-" + width;
          const image = await page.screenshot({ path: path.join(output, file + ".png"), animations: "disabled", caret: "hide" });
          const small = await sharp(image).resize(72, 48, { fit: "fill" }).removeAlpha().raw().toBuffer();
          signatures[file] = small.toString("base64");
          if (reference) {
            const prior = Buffer.from(reference[file] || "", "base64");
            assert.equal(prior.length, small.length, "Missing reviewed baseline for " + file);
            let changed = 0;
            for (let i = 0; i < prior.length; i += 3) if (Math.max(...[0,1,2].map((n) => Math.abs(prior[i+n] - small[i+n]))) > 22) changed++;
            if (changed / (small.length / 3) > 0.035) failures.push({ file, changedFraction: changed / (small.length / 3) });
          }
        }
      }
      if (errors.length) failures.push({ id, errors });
    } catch (error) { failures.push({ id, error: error.message }); }
    finally { await context.close(); }
  }
} finally { await browser.close(); }
await writeFile(path.join(output, "signatures.json"), JSON.stringify(signatures) + "\n");
await writeFile(path.join(output, "layout.json"), JSON.stringify({ engine, version: browser.version(), site, guide, pages, failures }, null, 2) + "\n");
console.log(JSON.stringify({ engine, viewports: pages.length, captures: Object.keys(signatures).length, failures }));
if (failures.length) process.exitCode = 1;
