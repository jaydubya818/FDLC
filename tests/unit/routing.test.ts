import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? sourceFiles(path) : /\.(?:ts|tsx)$/.test(entry.name) ? [path] : [];
  });
}

test("publishes one www origin and delegates Guide discovery", () => {
  const siteSource = readFileSync("lib/site.ts", "utf8");
  const sitemapSource = readFileSync("app/sitemap.ts", "utf8");
  const robotsSource = readFileSync("app/robots.ts", "utf8");
  assert.match(siteSource, /https:\/\/www\.fdlc\.ai/);
  assert.match(sitemapSource, /"\/specification"/);
  assert.doesNotMatch(sitemapSource, /"\/guide(?:\/|"|`)/);
  assert.doesNotMatch(sitemapSource, /"\/spec"/);
  assert.match(robotsSource, /`\$\{siteUrl\}\/sitemap\.xml`/);
  assert.match(robotsSource, /`\$\{siteUrl\}\/guide\/sitemap\.xml`/);
});

test("keeps Guide links same-origin and forces navigation across the app boundary", () => {
  const sources = [...sourceFiles("app"), ...sourceFiles("data")];
  for (const path of sources) {
    const source = readFileSync(path, "utf8");
    assert.doesNotMatch(source, /ai-software-factory-mastery\.vercel\.app/, path);
    assert.doesNotMatch(source, /<Link\b[^>]*\bhref=(?:"\/guide|\{[^}]*guide)/i, path);
  }
});

test("pins the Microfrontends runtime dependency", () => {
  const packageJson = JSON.parse(readFileSync("package.json", "utf8"));
  assert.equal(packageJson.dependencies["@vercel/microfrontends"], "2.4.0");
});
