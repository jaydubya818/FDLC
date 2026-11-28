import assert from "node:assert/strict";
import test from "node:test";
import { generateOperatingProfile, initialOperatingProfile, operatingProfileErrors } from "../../lib/factory-operating-profile.ts";

const valid = { ...initialOperatingProfile, definitionRef: "api-repair / revision 1", owner: "API quality", intakeSource: "Failed checks in approved repository" };

test("profile keeps design separate from execution and retains shared limits", () => {
  const result = generateOperatingProfile(valid);
  assert.equal(result.executionEnabled, false);
  assert.equal(result.status, "design-only");
  assert.equal(result.sharedWorkOrderBudget.maxAttempts, 2);
  assert.match(result.sharedWorkOrderBudget.includes, /delegated work/);
  assert.match(result.recovery.ambiguousEffect, /reconciliation/);
  assert.match(result.humanReview.overdue, /no new authority/);
  assert.ok(!("scheduleIntent" in result.intake));
});

test("scheduled intake requires a valid time zone and records missed work policy", () => {
  assert.match(operatingProfileErrors({ ...valid, trigger: "schedule", timezone: "Mars/Olympus" }).join(" "), /IANA time zone/);
  assert.throws(() => generateOperatingProfile({ ...valid, trigger: "schedule", schedule: " " }));
  const result = generateOperatingProfile({ ...valid, trigger: "schedule", timezone: "America/Chicago" });
  assert.equal(result.intake.timezone, "America/Chicago");
  assert.match(result.intake.missedSchedulePolicy ?? "", /owner review/);
});

test("invalid, unbounded and inconsistent budgets cannot be exported", () => {
  for (const value of ["", "0", "-1", "Infinity", "NaN", "1e999"]) {
    assert.throws(() => generateOperatingProfile({ ...valid, maxCostUsd: value }), value);
  }
  assert.throws(() => generateOperatingProfile({ ...valid, maxAttempts: "1.5" }));
  assert.throws(() => generateOperatingProfile({ ...valid, maxAttempts: "9007199254740992" }));
  assert.throws(() => generateOperatingProfile({ ...valid, maxAttempts: "2", maxConcurrentAttempts: "3" }));
  assert.throws(() => generateOperatingProfile({ ...valid, owner: " " }));
});
