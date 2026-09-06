import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { architectureAreas, metrics } from "../../data/fdlc.ts";
import { dependencyModernizationExample } from "../../data/dependency-modernization-example.ts";
import { missionControlCapabilities } from "../../data/mission-control.ts";

test("preserves current-main narrow MCP authority within the final capability vocabulary", () => {
  assert.equal(missionControlCapabilities.length, 13);
  const qualified = new Set(["Qualified", "Qualified; advisory", "Qualified diagnostic system"]);
  const bounded = new Set(["Implemented, gated", "Production-pilot eligible; Preview", "Partial"]);
  assert.equal(missionControlCapabilities.filter((item) => qualified.has(item.status)).length, 7);
  assert.equal(missionControlCapabilities.filter((item) => bounded.has(item.status)).length, 5);
  assert.equal(missionControlCapabilities.filter((item) => item.status === "Missing canonical lifecycle").length, 1);
  const mcp = missionControlCapabilities.find((item) => item.name === "Tools/MCP runtime");
  assert.deepEqual(mcp, {
    name: "Tools/MCP runtime", status: "Partial",
    summary: "One exact Context7 query-docs read was qualified through versioned authority, brokered execution, durable receipts, and independent verification.",
    limitation: "One fixed public React query only; writes, arbitrary servers and operations, broad credentials, and harness-native MCP remain unsupported.",
  });
  const tools = missionControlCapabilities.find((item) => item.name === "Native tool authorization");
  assert.equal(tools?.status, "Partial");
  assert.equal(tools?.summary, "A canonical Tool Version, Tool Grant, broker, and durable-receipt boundary covers fixtures and one qualified real read.");
  assert.equal(tools?.limitation, "Harness-native tools do not yet use the same canonical authority.");
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
