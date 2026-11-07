#!/usr/bin/env node
// Local composed preview: this site's production build plus the Guide, on one origin.
// `npm run start` serves only FDLC routes, so every /guide/* page except the index 404s.
// This runs the built FDLC site on its Microfrontends development port and the official
// @vercel/microfrontends proxy in front of it. /guide routes go to the Guide's development
// fallback from microfrontends.json, or to a local Guide app when --with-local-guide is passed.
// Read-only: no deployment, environment or domain changes. Run `npm run build` first.
import { spawn, execFileSync } from "node:child_process";
import { existsSync } from "node:fs";

const root = new URL("../", import.meta.url);
const proxyPort = process.env.PORT ?? "3000";
const withLocalGuide = process.argv.includes("--with-local-guide");
if (!existsSync(new URL("dist/server/index.js", root))) {
  console.error("No production build found. Run `npm run build` first.");
  process.exit(1);
}
const cli = new URL("node_modules/@vercel/microfrontends/cli/index.cjs", root).pathname;
const appPort = execFileSync(process.execPath, [cli, "port"], { cwd: root, encoding: "utf8" }).trim().split(/\s+/).at(-1);

const children = [
  spawn(process.execPath, [new URL("node_modules/vinext/dist/cli.js", root).pathname, "start", "--hostname", "127.0.0.1", "--port", appPort], { cwd: root, stdio: ["ignore", "ignore", "inherit"], env: { ...process.env, WRANGLER_LOG_PATH: ".wrangler/wrangler.log" } }),
  spawn(process.execPath, [cli, "proxy", "microfrontends.json", "--local-apps", "fdlc", ...(withLocalGuide ? ["ai-software-factory-mastery"] : []), "--port", proxyPort], { cwd: root, stdio: ["ignore", "ignore", "inherit"] }),
];
const stop = () => { for (const child of children) child.kill("SIGTERM"); process.exit(0); };
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
for (const child of children) child.on("exit", (code) => { if (code) { console.error(`A preview process exited with code ${code}.`); stop(); } });

console.log(`FDLC composed preview: http://localhost:${proxyPort}`);
console.log(`  FDLC routes  → this branch's build (port ${appPort})`);
console.log(withLocalGuide
  ? "  /guide routes → the Guide app running locally on its Microfrontends development port"
  : "  /guide routes → the deployed Guide (development fallback in microfrontends.json)");
console.log("Press Ctrl+C to stop.");
