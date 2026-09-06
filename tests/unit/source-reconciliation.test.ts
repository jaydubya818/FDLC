import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { architectureAreas, metrics } from "../../data/fdlc.ts";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example.ts";
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
test("preserves current-main operating-contract and outcome-cost semantics", () => {
  const area = (id: string) => architectureAreas.find((item) => item.id === id);
  const includes = (values: readonly string[] | undefined, expected: string) => assert.ok(values?.includes(expected));
  includes(area("intent")?.responsibilities, "Acceptance criteria linked to verification requirements");
  includes(area("intent")?.responsibilities, "Versioned Plans and dependency graphs");
  includes(area("harness")?.responsibilities, "Scheduling, leases, quotas, and backpressure");
  includes(area("harness")?.responsibilities, "Bounded retries, cancellation, and reconciliation");
  includes(area("harness")?.failureModes, "Retrying an unknown external outcome before reconciliation");
  includes(area("capability")?.responsibilities, "Authorized, current, attributable context");
  includes(area("capability")?.decisions, "Can a deterministic tool satisfy this task?");
  assert.match(area("capability")?.relationships ?? "", /some work needs no model/);
  includes(area("model")?.failureModes, "Fallback that weakens qualification or policy");
  includes(area("trust")?.decisions, "Do producer and verifier have independent failure modes?");
  includes(area("trust")?.failureModes, "Averaging a failed hard gate into a passing score");
  assert.equal(metrics.find(([name]) => name === "Cost per verified outcome")?.[1],
    "Total cohort cost, including failed work and retries, divided by independently verified outcomes. Report cost coverage.");
  assert.equal(dependencyModernizationExample.outcomeMetrics.find(([name]) => name === "Cost per verified outcome")?.[1],
    "Total cohort cost, including failed upgrades and retries, divided by independently verified upgrades; report missing cost coverage.");
});

test("retains the incoming public tab contrast corrections and bounded evidence claim", () => {
  const css = readFileSync(new URL("../../app/globals.css", import.meta.url), "utf8");
  assert.match(css, /\.mc-flow-tabs button > span \{[^}]*color: #9fa8a1;/);
  assert.match(css, /\.mc-product-tabs small \{ color: var\(--muted\); \}/);
  const capabilities = readFileSync(new URL("../../docs/MISSION_CONTROL_PUBLIC_CAPABILITIES.md", import.meta.url), "utf8");
  assert.match(capabilities, /an Execution Profile and canonical Attempt/);
  assert.match(capabilities, /One fixed public React query only; writes, arbitrary services or operations, broad credentials, remote arbitrary MCP, and harness-native MCP remain unsupported/);
  assert.match(capabilities, /f90c50f5b4191467b2117bb8762754f697b1cefd/);
});
