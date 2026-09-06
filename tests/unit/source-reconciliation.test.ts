import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
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
