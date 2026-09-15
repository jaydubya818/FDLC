import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";

const root = new URL("../", import.meta.url);
const child = new URL("products/ai-fde/apps/web/", root);
const read = (path) => readFile(new URL(path, root), "utf8");
const navigation = await read("lib/global-navigation.ts");
const styles = await read("app/design-system.css");
const source = await read("app/components/site-header.tsx");
// Global destinations cross the child basePath; document links must remain at the public origin.
const header = source.replace('import Link from "next/link";\n', "")
  .replace('import { usePathname } from "next/navigation";\n', "")
  .replaceAll('usePathname() ?? ""', '"/deploy"')
  .replace('"../../lib/global-navigation"', '"./global-navigation"')
  .replaceAll('<Link ', '<a ').replaceAll('</Link>', '</a>')
  .replace('src="/fdlc-logo-transparent.png"', 'src="/deploy/app/fdlc-logo-transparent.png"');
const css = styles.replace(":root {", ".global-header {") + '\n.global-header a { color: inherit; text-decoration: none; }\n.global-header a:focus-visible, .global-header button:focus-visible { outline: 2px solid var(--focus); outline-offset: 3px; }\n';
const files = {
  "components/fdlc-shell/site-header.tsx": header,
  "components/fdlc-shell/global-navigation.ts": navigation,
  "components/fdlc-shell/design-system.css": css,
};
const logo = await readFile(new URL("public/fdlc-logo-transparent.png", root));
files["public/fdlc-logo-transparent.png"] = logo;
const manifest = { version: 1, sources: Object.fromEntries([
  ["app/components/site-header.tsx", source], ["app/design-system.css", styles],
  ["lib/global-navigation.ts", navigation], ["public/fdlc-logo-transparent.png", logo],
].map(([name, value]) => [name, createHash("sha256").update(value).digest("hex")])) };
files["components/fdlc-shell/manifest.json"] = JSON.stringify(manifest, null, 2) + "\n";
await mkdir(new URL("components/fdlc-shell/", child), { recursive: true });
for (const [name, value] of Object.entries(files)) {
  const destination = new URL(name, child);
  if (process.argv.includes("--check")) assert.deepEqual(await readFile(destination), Buffer.from(value), `${name} drifted; run node scripts/sync-ai-fde-shell.mjs`);
  else await writeFile(destination, value);
}
console.log("AI-FDE shell contract v1 matches FDLC.");
