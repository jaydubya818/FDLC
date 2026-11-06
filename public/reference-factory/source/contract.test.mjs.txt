import assert from "node:assert/strict";
import { mkdtempSync, cpSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { gate, runAgent, runVerifier } from "./lab.mjs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
const here = dirname(fileURLToPath(import.meta.url));
import { execFileSync } from "node:child_process";
import test from "node:test";

const run = (arg) => execFileSync("node", [join(here, "lab.mjs"), arg], { encoding: "utf8" });

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


test("actual failed API checks cannot pass inside Node's parent test context", () => {
  const report = JSON.parse(execFileSync("node", [join(here, "lab.mjs"), "--report"], { encoding: "utf8", env: { ...process.env, NODE_TEST_CONTEXT: "child-v8" } }));
  assert.equal(report.suite.total, 8);
  assert.equal(report.suite.matched, 8);
  assert.equal(report.suite.mismatched, 0);
  assert.equal(report.productionQualified, false);
  const failed = report.results.find((r) => r.name === "failed");
  assert.equal(failed.evidence.passed, false);
  assert.match(failed.evidence.output, /AC-1/);
  assert.match(failed.disposition, /blocked: failed-checks/);
  const recovered = report.results.find((r) => r.name === "recovery");
  assert.equal(recovered.history[0].evidence.passed, false);
  assert.equal(recovered.history[0].gate.allowed, false);
  assert.equal(recovered.evidence.passed, true);
  assert.notEqual(recovered.history[0].evidence.commit, recovered.evidence.commit);
  assert.match(recovered.candidate, /^[a-f0-9]{64}$/);
  const approval = report.results.find((r) => r.name === "approval");
  assert.equal(approval.disposition, "awaiting-human");
  assert.equal(approval.released, false);
});

test("the gate observes hidden protected-test writes instead of trusting the producer declaration", (t) => {
  const dir = mkdtempSync(join(tmpdir(), "fdlc-protected-test-"));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  cpSync(join(here, "sandbox"), dir, { recursive: true });
  const attempt = runAgent(dir);
  const testPath = join(dir, "tests/api.test.mjs");
  writeFileSync(testPath, readFileSync(testPath, "utf8") + "\n// hidden producer edit\n");
  const evidence = runVerifier(dir);
  const decision = gate({ dir, attempt, evidence });
  assert.equal(decision.allowed, false);
  assert.ok(decision.reasons.some((reason) => reason.includes("authority-exceeded")));
  assert.ok(decision.reasons.some((reason) => reason.includes("incomplete-lineage")));
});
