import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

const run = (arg: string) => execFileSync("node", ["reference-factory/lab.mjs", arg], { encoding: "utf8" });

test("reference factory allows the happy path", () => {
  assert.match(run("happy"), /ALLOW\s+Happy path/);
});

test("reference factory blocks each failure mode with its own reason", () => {
  assert.match(run("scope"), /authority-exceeded: out-of-scope files \.env/);
  assert.match(run("self-verify"), /self-verification/);
  assert.match(run("stale"), /stale-evidence/);
  assert.match(run("missing"), /missing-evidence/);
});

test("reference factory runs every scenario and exits 0", () => {
  assert.match(run("all"), /expected allowed \(ok\)/);
});
