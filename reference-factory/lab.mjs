#!/usr/bin/env node
// FDLC reference factory: a zero-dependency, runnable miniature of the artifact chain.
// intent -> work order -> attempt -> evidence -> decision. The gate is code, not a prompt.
// The "agent" is a scripted stand-in; the point is the control plane around it.
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { cpSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const definition = JSON.parse(readFileSync(join(here, "factory-definition.json"), "utf8"));
const workOrder = JSON.parse(readFileSync(join(here, "work-order.json"), "utf8"));

const globToRegExp = (g) => new RegExp("^" + g.replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*\*/g, "@@DS@@").replace(/\*/g, "[^/]*").replace(/@@DS@@/g, ".*") + "$");
export const inScope = (file, globs) => globs.some((g) => globToRegExp(g).test(file));

function walk(dir, base = dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(dir, e.name), base) : [join(dir, e.name).slice(base.length + 1)]);
}
export const stateHash = (dir) => createHash("sha1").update(walk(dir).sort().map((f) => f + readFileSync(join(dir, f), "utf8")).join("\n")).digest("hex").slice(0, 7);

// The stand-in agent: it "fixes" add() and, if asked, oversteps.
export function runAgent(dir, { overstep = false } = {}) {
  const changed = ["src/add.js"];
  writeFileSync(join(dir, "src/add.js"), "export const add = (a, b) => a + b;\n");
  if (overstep) { writeFileSync(join(dir, ".env"), "TOKEN=leaked\n"); changed.push(".env"); }
  return { agent: "agent-1", changedFiles: changed };
}

// The verifier: a different identity runs the checks and signs the evidence.
export function runVerifier(dir, verifier = "verifier-1") {
  let passed = true, output = "";
  try { output = execFileSync("node", [definition.verification.command], { cwd: dir, encoding: "utf8" }); }
  catch (e) { passed = false; output = String(e.stdout || e.message); }
  return { verifier, passed, commit: stateHash(dir), output: output.trim() };
}

// The gate: blocks on anything the definition forbids.
export function gate({ dir, attempt, evidence }) {
  if (!evidence) return { allowed: false, reasons: ["missing-evidence: no verifier evidence was recorded"] };
  const reasons = [];
  if (evidence.verifier === attempt.agent) reasons.push(`self-verification: ${attempt.agent} verified its own work`);
  const out = attempt.changedFiles.filter((f) => !inScope(f, definition.authority.pathScopes));
  if (out.length) reasons.push(`authority-exceeded: out-of-scope files ${out.join(", ")}`);
  if (attempt.changedFiles.length > definition.authority.maxFilesChanged) reasons.push("authority-exceeded: too many files changed");
  if (evidence.commit !== stateHash(dir)) reasons.push(`stale-evidence: evidence is for ${evidence.commit}, code is now ${stateHash(dir)}`);
  if (!evidence.passed) reasons.push("failed-checks: the verifier command failed");
  return { allowed: reasons.length === 0, reasons };
}

export const scenarios = {
  happy: { title: "Happy path", expect: "allowed", run: (d) => { const a = runAgent(d); return { attempt: a, evidence: runVerifier(d) }; } },
  scope: { title: "Agent edits a file outside its authority", expect: "blocked: authority-exceeded", run: (d) => { const a = runAgent(d, { overstep: true }); return { attempt: a, evidence: runVerifier(d) }; } },
  "self-verify": { title: "Agent signs its own evidence", expect: "blocked: self-verification", run: (d) => { const a = runAgent(d); return { attempt: a, evidence: runVerifier(d, a.agent) }; } },
  stale: { title: "Code changes after verification", expect: "blocked: stale-evidence", run: (d) => { const a = runAgent(d); const e = runVerifier(d); writeFileSync(join(d, "src/add.js"), "export const add = (a, b) => a + b + 0;\n"); return { attempt: a, evidence: e }; } },
  missing: { title: "No verification step ran", expect: "blocked: missing-evidence", run: (d) => ({ attempt: runAgent(d), evidence: null }) },
};

export function runScenario(name) {
  const s = scenarios[name];
  if (!s) throw new Error(`Unknown scenario "${name}". Try: ${Object.keys(scenarios).join(", ")}`);
  const dir = mkdtempSync(join(tmpdir(), "fdlc-lab-"));
  cpSync(join(here, "sandbox"), dir, { recursive: true });
  const { attempt, evidence } = s.run(dir);
  return { name, title: s.title, expect: s.expect, ...gate({ dir, attempt, evidence }), attempt, evidence };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const arg = process.argv[2] ?? "all";
  const names = arg === "all" ? Object.keys(scenarios) : [arg];
  console.log(`Factory: ${definition.name}\nWork order: ${workOrder.id} - ${workOrder.title}\n`);
  let ok = true;
  for (const n of names) {
    const r = runScenario(n);
    const matches = (r.allowed ? "allowed" : "blocked: " + r.reasons[0].split(":")[0]) === r.expect;
    ok = ok && matches;
    console.log(`${r.allowed ? "ALLOW" : "BLOCK"}  ${r.title}`);
    for (const reason of r.reasons) console.log(`       ${reason}`);
    console.log(`       expected ${r.expect} ${matches ? "(ok)" : "(MISMATCH)"}\n`);
  }
  process.exit(ok ? 0 : 1);
}
