import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import test from "node:test";

const projectRoot = resolve(import.meta.dirname, "../..");
const validatorPath = join(projectRoot, "scripts/check-microfrontends-config.mjs");
const validConfig = readFileSync(join(projectRoot, "microfrontends.json"), "utf8");

function runValidator(setup: (directory: string) => void) {
  const directory = mkdtempSync(join(tmpdir(), "fdlc-microfrontends-check-"));
  try {
    setup(directory);
    return spawnSync(process.execPath, [validatorPath], {
      cwd: directory,
      encoding: "utf8",
    });
  } finally {
    rmSync(directory, { force: true, recursive: true });
  }
}

test("runs the root Microfrontends guard before every Vercel build", () => {
  const packageJson = JSON.parse(readFileSync(join(projectRoot, "package.json"), "utf8"));
  assert.equal(packageJson.scripts["microfrontends:check"], "node scripts/check-microfrontends-config.mjs");
  assert.equal(packageJson.scripts["prebuild:vercel"], "npm run microfrontends:check");
  assert.equal(packageJson.scripts["build:vercel"], "next build");
});

test("accepts only the approved root Microfrontends configuration", () => {
  const result = runValidator((directory) => {
    writeFileSync(join(directory, "microfrontends.json"), validConfig);
  });

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /e63f913563c1864feac38c7786e06d146892d34a4f0f74179999ff1d565e7e8b/);
});

test("fails closed when the Microfrontends configuration is absent or moved", () => {
  for (const setup of [
    () => {},
    (directory: string) => {
      mkdirSync(join(directory, "config"));
      writeFileSync(join(directory, "config/microfrontends.json"), validConfig);
    },
  ]) {
    const result = runValidator(setup);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /must exist at the repository root/);
  }
});

test("fails closed when the Microfrontends configuration is invalid or modified", () => {
  const modifiedConfig = JSON.parse(validConfig);
  modifiedConfig.applications["ai-software-factory-mastery"].packageName = "unexpected-guide";

  for (const source of ["{}", JSON.stringify(modifiedConfig)]) {
    const result = runValidator((directory) => {
      writeFileSync(join(directory, "microfrontends.json"), source);
    });
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /microfrontends:check/);
  }
});
