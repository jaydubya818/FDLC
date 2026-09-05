import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const projectRoot = resolve(import.meta.dirname, "../..");
const validator = join(projectRoot, "scripts/check-microfrontends-config.mjs");
const validConfig = readFileSync(join(projectRoot, "microfrontends.json"), "utf8");
const bridgeDigest = "794d525585a7f491e520b1332b3347e85f88cb580db6ef46883c918ed6e8458f";

function check(source: string | null, environment: Record<string, string | undefined> = {}) {
  const directory = mkdtempSync(join(tmpdir(), "fdlc-bridge-validator-"));
  try {
    if (source !== null) writeFileSync(join(directory, "microfrontends.json"), source);
    return spawnSync(process.execPath, [validator], {
      cwd: directory, encoding: "utf8",
      env: {
        PATH: process.env.PATH,
        NODE_ENV: "test",
        ...environment,
      },
    });
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

test("every Vercel build runs the checked-in fail-closed routing preflight", () => {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
  const vercelConfig = JSON.parse(readFileSync(join(projectRoot, "vercel.json"), "utf8"));
  assert.equal(packageJson.scripts["microfrontends:check"], "node scripts/check-microfrontends-config.mjs");
  assert.equal(packageJson.scripts["prebuild:vercel"], "npm run microfrontends:check");
  assert.equal(packageJson.scripts["build:vercel"], "next build");
  assert.equal(vercelConfig.buildCommand, "npm run build:vercel");
  assert.equal(packageJson.dependencies["@vercel/microfrontends"], "2.4.0");
  assert.equal(packageJson.dependencies.next, "16.3.4");
  assert.equal(packageJson.devDependencies.playwright, "1.62.1");
});

test("accepts the exact semantic bridge digest regardless of whitespace and key order", () => {
  const parsed = JSON.parse(validConfig);
  const reordered = Object.fromEntries(Object.entries(parsed).reverse());
  for (const source of [validConfig, JSON.stringify(reordered)]) {
    const result = check(source);
    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, new RegExp(bridgeDigest));
  }
});

test("fails closed for absent, invalid or altered routing, including the previous final contract", () => {
  const changed = JSON.parse(validConfig);
  delete changed.applications["ai-software-factory-mastery"].routing[0].flag;
  const finalLike = JSON.parse(validConfig);
  finalLike.applications["ai-software-factory-mastery"].routing = [
    { group: "guide", paths: ["/guide", "/guide/:path*"] },
  ];
  for (const source of [null, "{", "{}", JSON.stringify(changed), JSON.stringify(finalLike)]) {
    const result = check(source);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /microfrontends:check/);
  }
});

test("rejects alternate config sources and unsafe qualification origins at build time", () => {
  for (const environment of [
    { VC_MICROFRONTENDS_CONFIG: "{}" },
    { VC_MICROFRONTENDS_CONFIG_FILE_NAME: "another.json" },
    { VERCEL: "1", VERCEL_ENV: "production", FDLC_BRIDGE_GUIDE_ORIGIN: "https://ai-software-factory-mastery.vercel.app" },
    { VERCEL: "1", VERCEL_ENV: "preview", FDLC_BRIDGE_GUIDE_ORIGIN: "https://evil.test" },
    { VERCEL: "1", VERCEL_ENV: "production", FDLC_BRIDGE_LOCAL: "1" },
  ]) {
    const result = check(validConfig, environment);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /microfrontends:check/);
  }
});
