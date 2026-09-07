import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";

// Validate the emitted artifact, including Vercel builds restored from cache.
// Successful rendering and accessibility checks alone do not prove that the
// shared shell's stylesheet reached the browser.
const staticRoot = new URL("../.next/static/", import.meta.url);
const files = await readdir(staticRoot, { recursive: true });
const styles = (await Promise.all(files.filter(file => file.endsWith(".css"))
  .map(file => readFile(new URL(file, staticRoot), "utf8")))).join("\n");

for (const selector of [".global-header", ".global-header-inner", ".global-logo", ".global-mobile", ".global-footer", ".nav-dropdown-panel"]) {
  assert.ok(styles.includes(selector), `Built CSS is missing ${selector}`);
}
assert.match(styles, /--content-width\s*:\s*1240px/, "Built CSS contains the shared design tokens");
console.log("Built design system passed: shared header, logo, mobile menu, footer, dropdown, and tokens are present.");
