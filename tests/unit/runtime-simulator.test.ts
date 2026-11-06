import assert from "node:assert/strict";
import test from "node:test";
import { applyFix, artifactChain, faults, newRun, runStatus, runToEnd, stepRun, toggleFault, type FaultId, decideRun, scenarioRun } from "../../lib/runtime-simulator.ts";

test("a fault-free run produces all eleven teaching steps in order", () => {
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


test("failed verification retains evidence through a new producer and verifier Attempt", () => {
  const failed = runToEnd(scenarioRun("recovery"));
  assert.equal(failed.blocked?.fault, "failed-verification");
  assert.equal(failed.evidence[0].result, "FAIL");
  assert.ok(!failed.completed.includes("decision"));
  const corrected = applyFix(failed, "failed-verification");
  assert.equal(corrected.attempt, 2);
  assert.notEqual(corrected.candidate, failed.candidate);
  assert.deepEqual(corrected.evidence, failed.evidence);
  assert.ok(!corrected.completed.includes("attempt"));
  const complete = runToEnd(corrected);
  assert.equal(runStatus(complete), "complete");
  assert.deepEqual(complete.evidence.map((e) => e.result), ["FAIL", "PASS"]);
  assert.notEqual(complete.evidence[0].producerAttempt, complete.evidence[1].producerAttempt);
  assert.notEqual(complete.evidence[0].verifierAttempt, complete.evidence[1].verifierAttempt);
});

test("passing evidence cannot bypass the human decision, including repeated run requests", () => {
  const waiting = runToEnd(scenarioRun("human"));
  assert.equal(runStatus(waiting), "awaiting-approval");
  assert.equal(waiting.evidence.at(-1)?.result, "PASS");
  assert.ok(!waiting.completed.includes("decision"));
  assert.equal(runToEnd(waiting), waiting);
  assert.equal(stepRun(waiting), waiting);
  const denied = decideRun(waiting, false);
  assert.equal(runStatus(denied), "denied");
  assert.equal(runToEnd(denied), denied);
  assert.equal(decideRun(denied, true), denied);
  assert.equal(runStatus(runToEnd(decideRun(waiting, true))), "complete");
});

test("approval and recovery cannot be invoked out of state", () => {
  const run = scenarioRun("happy");
  assert.equal(decideRun(run, true), run);
  assert.equal(applyFix(run, "failed-verification"), run);
});


test("multiple injected faults cannot spend more than the one-correction budget", () => {
  const first = runToEnd(newRun(["authority-exceeded", "failed-verification"]));
  const second = runToEnd(applyFix(first, "authority-exceeded"));
  assert.equal(second.attempt, 2);
  assert.equal(second.blocked?.fault, "failed-verification");
  assert.equal(second.blocked?.recoverable, false);
  assert.match(second.blocked!.fix, /budget is exhausted/);
  assert.equal(applyFix(second, "failed-verification"), second);
  assert.equal(runToEnd(second), second);
});
