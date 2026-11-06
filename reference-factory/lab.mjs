#!/usr/bin/env node
// Existing FDLC Reference Lab: deterministic producer, real API checks and a fail-closed gate.
// Local role labels illustrate separation; they are not an OS security boundary.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const fixture = join(here, 'sandbox');
const definition = JSON.parse(readFileSync(join(here, 'factory-definition.json'), 'utf8'));
const workOrder = JSON.parse(readFileSync(join(here, 'work-order.json'), 'utf8'));
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const globToRegExp = (g) => new RegExp('^' + g.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*\*/g, '@@DS@@').replace(/\*/g, '[^/]*').replace(/@@DS@@/g, '.*') + '$');
export const inScope = (file, globs) => globs.some((g) => globToRegExp(g).test(file));
function walk(dir, base = dir) { return readdirSync(dir, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(dir, e.name), base) : [join(dir, e.name).slice(base.length + 1)]); }
export const stateHash = (dir) => hash(walk(dir).sort().map((f) => `${f}\0${hash(readFileSync(join(dir, f)))}`).join('\n'));
function changedFiles(dir) {
  const names = [...new Set([...walk(fixture), ...walk(dir)])].sort();
  return names.filter((f) => { try { return !readFileSync(join(fixture, f)).equals(readFileSync(join(dir, f))); } catch { return true; } });
}
export function runAgent(dir, { overstep = false, broken = false } = {}) {
  writeFileSync(join(dir, 'src/add.js'), `export const add = (a, b) => a ${broken ? '-' : '+'} b;\n`);
  if (overstep) writeFileSync(join(dir, '.env'), 'DEMO_ONLY=out-of-scope\n');
  return { agent: 'agent-1', changedFiles: changedFiles(dir) };
}
export function runVerifier(dir, verifier = 'verifier-1') {
  const before = stateHash(dir);
  // Node's parent test-runner context can suppress a nested --test run.
  const env = { ...process.env }; delete env.NODE_TEST_CONTEXT;
  let passed = true, output = '';
  try { output = execFileSync(process.execPath, definition.verification.commandArgs, { cwd: dir, env, encoding: 'utf8', timeout: 5000, maxBuffer: 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] }); }
  catch (e) { passed = false; output = String(e.stdout || e.message); }
  const candidate = stateHash(dir);
  if (candidate !== before) { passed = false; output += '\nVerification mutated the candidate.'; }
  return { verifier, passed, commit: candidate, output: output.trim(), outputDigest: hash(output.trim()) };
}
export function gate({ dir, attempt, evidence }) {
  if (!evidence) return { allowed: false, reasons: ['missing-evidence: no verifier evidence was recorded'] };
  const reasons = [], actual = changedFiles(dir);
  if (evidence.verifier === attempt.agent) reasons.push(`self-verification: ${attempt.agent} verified its own work`);
  const out = actual.filter((f) => !inScope(f, definition.authority.pathScopes));
  if (out.length) reasons.push(`authority-exceeded: out-of-scope files ${out.join(', ')}`);
  if (actual.length > definition.authority.maxFilesChanged) reasons.push('authority-exceeded: too many files changed');
  if (JSON.stringify(actual) !== JSON.stringify([...attempt.changedFiles].sort())) reasons.push('incomplete-lineage: changed-file declaration differs from observed files');
  if (evidence.commit !== stateHash(dir)) reasons.push(`stale-evidence: evidence is for ${evidence.commit}, code is now ${stateHash(dir)}`);
  if (!evidence.passed) reasons.push('failed-checks: the verifier command failed');
  return { allowed: reasons.length === 0, reasons };
}
export const scenarios = {
  happy: { title: 'Happy path', expect: 'allowed', run: (d) => { const a = runAgent(d); return { attempt: a, evidence: runVerifier(d) }; } },
  scope: { title: 'Agent edits a file outside its authority', expect: 'blocked: authority-exceeded', run: (d) => { const a = runAgent(d, { overstep: true }); return { attempt: a, evidence: runVerifier(d) }; } },
  'self-verify': { title: 'Agent signs its own evidence', expect: 'blocked: self-verification', run: (d) => { const a = runAgent(d); return { attempt: a, evidence: runVerifier(d, a.agent) }; } },
  stale: { title: 'Code changes after verification', expect: 'blocked: stale-evidence', run: (d) => { const a = runAgent(d), e = runVerifier(d); writeFileSync(join(d, 'src/add.js'), 'export const add = (a, b) => a + b + 0;\n'); return { attempt: a, evidence: e }; } },
  missing: { title: 'No verification step ran', expect: 'blocked: missing-evidence', run: (d) => ({ attempt: runAgent(d), evidence: null }) },
  failed: { title: 'API acceptance fails', expect: 'blocked: failed-checks', run: (d) => { const a = runAgent(d, { broken: true }); return { attempt: a, evidence: runVerifier(d) }; } },
  recovery: { title: 'Failed evidence retained, corrected Candidate re-verified', expect: 'allowed', run: (d) => { const first = runAgent(d, { broken: true }), failed = runVerifier(d), blocked = gate({ dir: d, attempt: first, evidence: failed }); const attempt = runAgent(d); return { attempt, evidence: runVerifier(d), history: [{ id: 'ATT-1', attempt: first, evidence: failed, gate: blocked }] }; } },
  approval: { title: 'Production request waits for human authority', expect: 'awaiting-human', run: (d) => { const a = runAgent(d); return { attempt: a, evidence: runVerifier(d), requiresHuman: true }; } },
};
export function runScenario(name) {
  const s = scenarios[name];
  if (!s) throw new Error(`Unknown scenario "${name}". Try: ${Object.keys(scenarios).join(', ')}`);
  const dir = mkdtempSync(join(tmpdir(), 'fdlc-lab-'));
  try {
    cpSync(fixture, dir, { recursive: true });
    const result = s.run(dir), decision = gate({ dir, ...result });
    const disposition = !decision.allowed ? 'blocked: ' + decision.reasons[0].split(':')[0] : result.requiresHuman ? 'awaiting-human' : 'allowed';
    return { name, title: s.title, expect: s.expect, ...decision, ...result, candidate: stateHash(dir), disposition, matchesExpectation: disposition === s.expect, released: false };
  } finally { rmSync(dir, { recursive: true, force: true }); }
}
export function qualificationReport() {
  const results = Object.keys(scenarios).map(runScenario);
  const compositionDigest = hash([readFileSync(join(here, 'factory-definition.json')), readFileSync(join(here, 'work-order.json')), readFileSync(fileURLToPath(import.meta.url)), stateHash(fixture)].join('\n'));
  return { kind: 'fdlc-reference-lab-local-evidence', schema: 'illustrative report, not the canonical Qualification Record wire format', generatedAt: new Date().toISOString(), factoryVersion: `api-reference@1.1.0+${compositionDigest.slice(0, 12)}`, compositionDigest, workloadClass: definition.workload, environment: { node: process.version, platform: process.platform, arch: process.arch, execution: 'temporary local directory; no OS sandbox' }, configuration: definition, acceptanceCriteria: workOrder.acceptance, suite: { total: results.length, matched: results.filter((r) => r.matchesExpectation).length, mismatched: results.filter((r) => !r.matchesExpectation).length }, results, dimensions: { functionalCorrectness: 'MEASURED: protected API and baseline checks in each scenario', evidenceCompleteness: 'MEASURED: candidate SHA-256, output digest, role labels and gate reasons', policy: 'MEASURED: file scope, self-verification, stale and missing evidence denied', recovery: 'MEASURED: failed record retained, new Candidate independently checked', contextSufficiency: 'BOUNDED: fixture, contract and protected tests only', independence: 'ILLUSTRATIVE: separate functions and identity labels, not security principals', isolation: 'NOT QUALIFIED: temporary directory is not a sandbox', modelHarnessCompatibility: 'NOT TESTED: scripted producer only', reliability: 'NOT ESTABLISHED: one deterministic suite, no production cohort', cost: 'UNKNOWN: no model calls; compute and human cost not measured' }, qualifiedOperatingDomain: 'NONE for production; demonstration limited to this exact trusted local fixture', productionQualified: false, limitations: definition.limitations, nextGate: 'Replace the producer behind the same contracts, protect verifier authority, and qualify the exact stack and workload before operation.' };
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  try {
    if (process.argv[2] === '--report') { const report = qualificationReport(); console.log(JSON.stringify(report, null, 2)); process.exitCode = report.suite.mismatched === 0 ? 0 : 1; }
    else {
      const arg = process.argv[2] ?? 'all', results = (arg === 'all' ? Object.keys(scenarios) : [arg]).map(runScenario);
      console.log(`Factory: ${definition.name}\nWork order: ${workOrder.id} - ${workOrder.title}\n`);
      for (const r of results) { console.log(`${r.disposition === 'awaiting-human' ? 'WAIT' : r.allowed ? 'ALLOW' : 'BLOCK'}  ${r.title}`); for (const reason of r.reasons) console.log(`       ${reason}`); console.log(`       expected ${r.expect} ${r.matchesExpectation ? '(ok)' : '(MISMATCH)'}\n`); }
      console.log('ALLOW means gate eligibility for local review only. No publication, merge or deployment.');
      process.exitCode = results.every((r) => r.matchesExpectation) ? 0 : 1;
    }
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
