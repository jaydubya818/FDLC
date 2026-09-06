import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { missionControlCapabilities } from "../../data/mission-control.ts";
import { migrationFdlcCapabilityContract } from "../../lib/migration-fdlc-contract.ts";

test("retains current-main narrow MCP status without changing the bridge catalog vocabulary", () => {
  const contract = migrationFdlcCapabilityContract("bridge", "reconciled-main");
  assert.equal(missionControlCapabilities.length, 12);
  for (const [status, expected] of [["Available", 6], ["Experimental", 5], ["Planned", 1]] as const) {
    assert.equal(missionControlCapabilities.filter((item) => item.status === status).length, expected);
  }
  const mcp = missionControlCapabilities.find((item) => item.name === contract.mcp.name);
  assert.deepEqual(mcp, { name: contract.mcp.name, status: "Experimental", summary: contract.mcp.summary, limitation: contract.mcp.limitation });
});

test("keeps distinct exact pre-reconciliation rollback and reconciled browser contracts", () => {
  assert.deepEqual(migrationFdlcCapabilityContract("bridge", "pre-reconciliation").groups, [["available", 6], ["experimental", 4], ["planned", 2]]);
  assert.deepEqual(migrationFdlcCapabilityContract("final", "pre-reconciliation").groups, [["qualified", 7], ["bounded", 4], ["missing", 2]]);
  assert.deepEqual(migrationFdlcCapabilityContract("bridge", "pre-reconciliation").mcp, {
    name: "Governed MCP runtime", status: "Planned", group: "planned",
    summary: "The architecture reserves a default-deny MCP authority boundary.",
    limitation: "Current admitted harness manifests mark MCP unsupported.",
  });
  assert.deepEqual(migrationFdlcCapabilityContract("final", "pre-reconciliation").mcp, {
    name: "Tools/MCP runtime", status: "Missing", group: "missing",
    summary: "The architecture reserves a default-deny MCP authority boundary.",
    limitation: "MCP is unsupported for the currently admitted Codex and DeepSeek manifests.",
  });
  assert.deepEqual(migrationFdlcCapabilityContract("bridge", "reconciled-main").groups, [["available", 6], ["experimental", 5], ["planned", 1]]);
  const final = migrationFdlcCapabilityContract("final", "reconciled-main");
  assert.deepEqual(final.groups, [["qualified", 7], ["bounded", 5], ["missing", 1]]);
  assert.equal(final.mcp.status, "Partial");
  assert.equal(final.publicStatusSource, "7a184b52a21bac207c0d7cfab99b46f40a880af8");
  assert.equal(final.presentationSource, "8057d1fd2c9aafaad309488aaa6038bd61b61e57");
  assert.throws(() => migrationFdlcCapabilityContract("unknown", "reconciled-main"), RangeError);
  assert.throws(() => migrationFdlcCapabilityContract("bridge", "unknown"), RangeError);
});

test("preserves the reviewed main-deployment guard and original FDLC build settings", () => {
  const config = JSON.parse(readFileSync(new URL("../../vercel.json", import.meta.url), "utf8"));
  assert.deepEqual(config.git, { deploymentEnabled: { main: false } });
  assert.equal(config.framework, "nextjs");
  assert.equal(config.buildCommand, "npm run build:vercel");
});
