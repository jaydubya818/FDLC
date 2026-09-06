/** Run explicitly against a root-owned, already-running native Guide; never starts servers. */
import assert from "node:assert/strict";
import test from "node:test";
import { chromium } from "playwright";
import { transitionLinkSnapshots } from "../scripts/qualify-migration-transitions.mjs";

const argument = process.argv.find((value) => value.startsWith("--guide="));
assert.ok(argument, "Pass --guide=http://127.0.0.1:<existing-port> explicitly");
const origin = new URL(argument.slice("--guide=".length));
assert.ok(origin.protocol === "http:" && origin.hostname === "127.0.0.1" && origin.port && origin.href === `${origin.origin}/`, "This focused fixture uses only an explicitly existing loopback Guide origin");

test("mobile browser visibility rejects closed details and accepts normal summary-open navigation twice", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  try {
    for (let round = 1; round <= 2; round++) {
      const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
      await page.setContent('<main><details><summary>Browse</summary><a href="#target">Hidden chapter</a></details><article class="document-article"><a href="#target">Visible chapter</a><h1 id="target">Target</h1></article></main>');
      const closed = await page.locator("a[href]").evaluateAll(transitionLinkSnapshots);
      assert.equal(closed[0].visible, false);
      assert.equal(closed[0].inMain, true);
      assert.equal(closed[0].inArticle, false);
      assert.equal(closed[1].visible, true);
      assert.equal(closed[1].inMain, true);
      assert.equal(closed[1].inArticle, true);
      assert.equal(await page.getByText("Hidden chapter", { exact: true }).isVisible(), false);
      await page.locator("summary").click();
      const opened = await page.locator("a[href]").evaluateAll(transitionLinkSnapshots);
      assert.equal(opened[0].visible, true);
      await page.getByRole("link", { name: "Hidden chapter", exact: true }).click();
      assert.equal(new URL(page.url()).hash, "#target");
      await page.close();
    }
  } finally { await browser.close(); }
});

test("actual desktop and mobile Guide select the same rendered article link and follow it normally twice", async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
  const failures = [];
  try {
    for (let round = 1; round <= 2; round++) {
      const destinations = [];
      for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
        const page = await browser.newPage({ viewport, colorScheme: "light" });
        page.on("console", (message) => { if (message.type() === "error") failures.push("console error"); });
        page.on("pageerror", () => failures.push("page error"));
        page.on("requestfailed", () => failures.push("network failure"));
        const source = new URL("/docs/01-understand/03-first-principles-trust-evidence-and-authority#how-it-works", origin);
        assert.equal((await page.goto(source.href, { waitUntil: "networkidle" }))?.status(), 200);
        const links = await page.locator("a[href]").evaluateAll(transitionLinkSnapshots);
        const hidden = page.locator("details.document-nav-mobile a").first();
        assert.equal(await hidden.isVisible(), false);
        const candidate = links.find((link) => link.inMain && link.inArticle && link.visible && new URL(link.href).origin === origin.origin && /^\/(?:docs|guide)\/(?:\d|appendix)/.test(new URL(link.href).pathname) && new URL(link.href).pathname !== source.pathname);
        assert.ok(candidate, "A visibly rendered chapter link must exist outside the closed disclosure");
        const link = page.locator("a[href]").nth(candidate.index);
        assert.equal(await link.evaluate((element) => Boolean(element.closest("main")) && Boolean(element.closest("article.document-article")) && !element.closest("details:not([open])")), true);
        assert.equal(await link.isVisible(), true);
        assert.equal(await link.getAttribute("href"), candidate.raw);
        await link.click();
        await page.waitForLoadState("networkidle");
        assert.equal(page.url(), candidate.href);
        assert.equal(await page.locator("main").count(), 1);
        assert.ok(await page.locator("h1").innerText());
        destinations.push(page.url());
        console.log(JSON.stringify({ round, viewport: `${viewport.width}x${viewport.height}`, selectedIndex: candidate.index, selectedText: candidate.text, destination: page.url(), normalClick: true }));
        await page.close();
      }
      assert.equal(destinations[0], destinations[1], "Desktop and mobile must retain the same article destination");
    }
    assert.deepEqual(failures, []);
  } finally { await browser.close(); }
});
