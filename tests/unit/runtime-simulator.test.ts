import assert from "node:assert/strict";
import test from "node:test";
import { applyFix, artifactChain, faults, newRun, runStatus, runToEnd, stepRun, toggleFault, type FaultId } from "../../lib/runtime-simulator.ts";

test("a fault-free run produces all eight artifacts in order", () => {
  const run = runToEnd(newRun());
  assert.deepEqual(run.completed, artifactChain.map((item) => item.id));
  assert.equal(runStatus(run), "complete");
  assert.equal(run.blocked, null);
});

test("each fault blocks at its own artifact with a stated reason and rule", () => {
  for (const fault of faults) {
    const run = runToEnd(newRun([fault.id]));
    assert.equal(runStatus(run), "blocked", fault.id);
    assert.equal(run.blocked?.at, fault.at);
    assert.ok(run.blocked?.reason && run.blocked.rule && run.blocked.fix);
    assert.ok(!run.completed.includes(fault.at), "the blocked artifact is not marked produced");
    assert.ok(!run.completed.includes("outcome"), "a blocked run never reaches an outcome");
  }
});

test("a blocked run stays blocked until the fix is applied", () => {
  let run = runToEnd(newRun(["self-verification"]));
  assert.equal(stepRun(run), run);
  run = applyFix(run, "self-verification");
  assert.equal(run.blocked, null);
  run = runToEnd(run);
  assert.equal(runStatus(run), "complete");
});

test("the earliest artifact wins when several faults are active", () => {
  const active: FaultId[] = ["stale-evidence", "authority-exceeded"];
  assert.equal(runToEnd(newRun(active)).blocked?.fault, "authority-exceeded");
});

test("faults can only be toggled before the run starts", () => {
  const started = stepRun(newRun());
  assert.equal(toggleFault(started, "missing-evidence"), started);
  const fresh = toggleFault(newRun(), "missing-evidence");
  assert.deepEqual(fresh.active, ["missing-evidence"]);
  assert.deepEqual(toggleFault(fresh, "missing-evidence").active, []);
});

test("stale evidence names both commits", () => {
  const run = runToEnd(newRun(["stale-evidence"]));
  assert.match(run.blocked!.reason, /9f3c1e2/);
  assert.match(run.blocked!.reason, /4b7a0d1/);
});
