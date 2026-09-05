import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { fixture, TEST_KEY } from './helpers.ts';

const cli = fileURLToPath(new URL('../bin/fab.mjs', import.meta.url));
const transport = fileURLToPath(new URL('./fixture-transport.mjs', import.meta.url));
const contained = process.env.FAB_TEST_CONTAINMENT === '1';
test('built CLI: clean inspection, explicit auth, persisted plan, consent, execution, status and diff', { skip: !contained }, t => {
  const f = fixture({ 'math.mjs': 'export const add = (a,b) => a-b;\n', 'math.test.mjs': "import {add} from './math.mjs'; import assert from 'node:assert/strict'; assert.equal(add(2,3),5);\n" }); t.after(f.cleanup);
  f.config.writableFiles = ['math.mjs'];
  const configPath = path.join(f.directory, 'operator.json'); writeFileSync(configPath, JSON.stringify(f.config), { mode: 0o600 });
  const common = ['--config', configPath, '--state-dir', path.join(f.directory, 'state')];
  const run = (args: string[], key = true) => spawnSync(process.execPath, ['--import', transport, cli, ...args], {
    cwd: f.root, encoding: 'utf8', timeout: 15000,
    env: { PATH: '/usr/bin:/bin', HOME: f.directory, ...(key ? { FAB_TEST_MODEL_KEY: TEST_KEY } : {}) },
  });
  const inspected = run(['inspect']); assert.equal(inspected.status, 0, inspected.stderr); assert.equal(JSON.parse(inspected.stdout).status, 'clean');
  const missing = run(['plan', 'Fix addition', ...common], false); assert.equal(missing.status, 2); assert.match(missing.stderr, /CREDENTIAL_MISSING/);
  const auth = run(['auth', ...common]); assert.equal(auth.status, 0, auth.stderr); assert.equal(JSON.parse(auth.stdout).configured, true); assert(!auth.stdout.includes(TEST_KEY));
  const planned = run(['plan', 'Fix addition', ...common]); assert.equal(planned.status, 0, planned.stderr); const plan = JSON.parse(planned.stdout);
  const denied = run(['run', plan.session, ...common, '--approve', 'wrong']); assert.equal(denied.status, 2); assert.match(denied.stderr, /APPROVAL_REQUIRED/);
  const executed = run(['run', plan.session, ...common, '--approve', plan.approvalDigest]); assert.equal(executed.status, 0, executed.stderr + executed.stdout);
  const status = run(['status', plan.session, ...common]); assert.equal(status.status, 0, status.stderr); assert.equal(JSON.parse(status.stdout).status, 'candidate');
  const diff = run(['diff', plan.session, ...common]); assert.equal(diff.status, 0); assert.match(diff.stdout, /a\+b/);
  assert.equal(readFileSync(path.join(f.root, 'math.mjs'), 'utf8'), 'export const add = (a,b) => a+b;\n');
  for (const result of [planned, denied, executed, status, diff]) assert(!(result.stdout + result.stderr).includes(TEST_KEY));
});
