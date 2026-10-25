import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { command } from '../runner.mjs';

const kit = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const regression = `import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { batchCount } from '../src/batches.mjs';\ntest('partial batch', () => assert.equal(batchCount(5, 2), 3));\n`;
function git(cwd, ...args) { return execFileSync('git', args, { cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); }
function init(repo) { git(repo, 'init', '-q'); git(repo, 'add', '.'); git(repo, '-c', 'user.name=Test', '-c', 'user.email=test@localhost', 'commit', '-qm', 'baseline'); }
function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fdlc-runner-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const repo = path.join(root, 'repo'), skills = path.join(root, 'skillz'), runner = path.join(root, 'runner.mjs');
  fs.cpSync(path.join(kit, 'example'), repo, { recursive: true }); init(repo);
  const lock = JSON.parse(fs.readFileSync(path.join(kit, 'skills.lock.json')));
  for (const phase of lock.phases) { const folder = path.join(skills, 'skills', phase.skill); fs.mkdirSync(folder, { recursive: true }); fs.writeFileSync(path.join(folder, 'SKILL.md'), `Fixture for ${phase.skill}`); }
  init(skills); lock.commit = git(skills, 'rev-parse', 'HEAD');
  fs.writeFileSync(path.join(root, 'skills.lock.json'), JSON.stringify(lock));
  fs.copyFileSync(path.join(kit, 'runner.mjs'), runner);
  const run = path.join(root, 'run');
  const cli = (...args) => spawnSync(process.execPath, [runner, ...args], { encoding: 'utf8' });
  const start = (task = path.join(repo, 'task.json')) => cli('begin', repo, task, run, skills);
  const state = () => JSON.parse(fs.readFileSync(path.join(run, 'run.json')));
  const addRegression = (source = regression) => fs.writeFileSync(path.join(state().worktree, 'tests/partial-batch.test.mjs'), source);
  const fix = () => { const f = path.join(state().worktree, 'src/batches.mjs'); fs.writeFileSync(f, fs.readFileSync(f, 'utf8').replace('Math.floor', 'Math.ceil')); };
  return { root, repo, skills, run, cli, start, state, addRegression, fix };
}
const ok = (result) => assert.equal(result.status, 0, result.stderr);
const blocked = (result, pattern) => { assert.notEqual(result.status, 0); assert.match(result.stderr, pattern); };

test('real failing-before/passing-after flow leaves source untouched and detects stale evidence', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression(); ok(f.cli('reproduce', f.run));
  assert.match(fs.readFileSync(path.join(f.run, f.state().attempts[1].log), 'utf8'), /2 !== 3/);
  f.fix(); ok(f.cli('verify', f.run)); ok(f.cli('status', f.run));
  assert.equal(f.state().status, 'verified'); assert.match(fs.readFileSync(path.join(f.run, 'HANDOFF.md'), 'utf8'), /Ready for human review/);
  assert.match(fs.readFileSync(path.join(f.repo, 'src/batches.mjs'), 'utf8'), /Math.floor/);
  assert.equal(git(f.repo, 'status', '--porcelain'), '');
  fs.appendFileSync(path.join(f.state().worktree, 'src/batches.mjs'), '\n// changed\n');
  blocked(f.cli('status', f.run), /stale/);
});
test('blocks implementation before reproduction and verification out of order', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression(); f.fix();
  blocked(f.cli('reproduce', f.run), /Out-of-scope/); blocked(f.cli('verify', f.run), /Cannot verify/);
});
test('syntax errors cannot stand in for an assertion mismatch', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression('this is invalid syntax');
  blocked(f.cli('reproduce', f.run), /Not the expected assertion/); assert.equal(f.state().status, 'awaiting-regression');
});
test('frozen regression, baseline tests, and unrelated files cannot change', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression(); ok(f.cli('reproduce', f.run)); f.fix();
  f.addRegression(regression + '\n'); blocked(f.cli('verify', f.run), /Frozen regression/);
  f.addRegression(); fs.appendFileSync(path.join(f.state().worktree, 'tests/batches.test.mjs'), '\n'); blocked(f.cli('verify', f.run), /Out-of-scope/);
});
test('passing regression before the fix is not reproduction', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression(regression.replace('5, 2), 3', '4, 2), 2'));
  blocked(f.cli('reproduce', f.run), /Not the expected assertion/);
});
test('dirty inputs and wrong skill pins are rejected before worktree creation', (t) => {
  const f = fixture(t); fs.writeFileSync(path.join(f.repo, 'untracked'), 'dirty'); blocked(f.start(), /clean repository/);
  fs.unlinkSync(path.join(f.repo, 'untracked')); fs.appendFileSync(path.join(f.skills, 'skills/how/SKILL.md'), 'dirty'); blocked(f.start(), /clean skillz/);
  assert.equal(fs.existsSync(f.run), false);
});
test('rejects traversal and refuses to overwrite an existing run', (t) => {
  const f = fixture(t); const task = JSON.parse(fs.readFileSync(path.join(f.repo, 'task.json'))); task.allow = ['../escape'];
  const config = path.join(f.root, 'bad.json'); fs.writeFileSync(config, JSON.stringify(task)); blocked(f.start(config), /Invalid relative path/);
  ok(f.start()); blocked(f.start(), /EEXIST/);
});
test('detects changed evidence logs', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression(); ok(f.cli('reproduce', f.run)); f.fix(); ok(f.cli('verify', f.run));
  fs.appendFileSync(path.join(f.run, f.state().attempts[0].log), 'tampered'); blocked(f.cli('status', f.run), /Evidence log changed/);
});
test('test side effects invalidate evidence', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression("import fs from 'node:fs'; fs.writeFileSync('side-effect', 'bad');\n" + regression);
  blocked(f.cli('reproduce', f.run), /test changed repository files/);
});
test('blocks concurrent commands and symlink candidates', (t) => {
  const f = fixture(t); ok(f.start()); fs.writeFileSync(path.join(f.run, '.runner.lock'), 'busy'); blocked(f.cli('reproduce', f.run), /locked/);
  fs.unlinkSync(path.join(f.run, '.runner.lock')); fs.symlinkSync('/etc/hosts', path.join(f.state().worktree, 'tests/partial-batch.test.mjs'));
  blocked(f.cli('reproduce', f.run), /regular files/);
});
test('command timeout terminates a hanging check', async () => {
  const result = await command(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], kit, 100);
  assert.equal(result.stopped, 'timeout'); assert.notEqual(result.code, 0);
});

test('baseline failure leaves a blocked run and preserves the source', (t) => {
  const f = fixture(t); fs.writeFileSync(path.join(f.repo, 'tests/batches.test.mjs'), "import test from 'node:test'; test('baseline', () => { throw new Error('broken baseline'); });");
  git(f.repo, 'add', '.'); git(f.repo, '-c', 'user.name=Test', '-c', 'user.email=test@localhost', 'commit', '-qm', 'broken baseline');
  blocked(f.start(), /Baseline must pass/); assert.equal(f.state().status, 'blocked'); assert.equal(git(f.repo, 'status', '--porcelain'), '');
});
test('skipped regression cannot qualify a fix', (t) => {
  const f = fixture(t); ok(f.start());
  f.addRegression(regression + "test.skip('unimplemented edge', () => {});\n"); ok(f.cli('reproduce', f.run)); f.fix();
  blocked(f.cli('verify', f.run), /Verification failed or skipped/); assert.equal(f.state().status, 'reproduced'); assert.equal(fs.existsSync(path.join(f.run, 'HANDOFF.md')), false);
});
test('failed re-verification removes a prior handoff', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression(); ok(f.cli('reproduce', f.run)); f.fix(); ok(f.cli('verify', f.run));
  const file = path.join(f.state().worktree, 'src/batches.mjs'); fs.writeFileSync(file, fs.readFileSync(file, 'utf8').replace('Math.ceil', 'Math.floor'));
  blocked(f.cli('verify', f.run), /No implementation change/); assert.equal(fs.existsSync(path.join(f.run, 'HANDOFF.md')), false);
});
test('reproduction attempts have a hard budget', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression('bad syntax');
  for (let i = 0; i < 3; i++) blocked(f.cli('reproduce', f.run), /Not the expected assertion/);
  blocked(f.cli('reproduce', f.run), /budget exhausted/); assert.equal(f.state().attempts.length, 4);
});
test('an assertion failing for a different reason is rejected', (t) => {
  const f = fixture(t); ok(f.start()); f.addRegression(regression.replace('5, 2), 3', '4, 2), 9'));
  blocked(f.cli('reproduce', f.run), /Not the expected assertion/);
});

test('supports normal tracked dotfiles but rejects ignored local state', (t) => {
  const f = fixture(t); fs.writeFileSync(path.join(f.repo, '.gitignore'), 'local-state\n'); git(f.repo, 'add', '.gitignore'); git(f.repo, '-c', 'user.name=Test', '-c', 'user.email=test@localhost', 'commit', '-qm', 'ignore local state');
  fs.writeFileSync(path.join(f.repo, 'local-state'), 'ignored'); blocked(f.start(), /clean repository/);
  fs.unlinkSync(path.join(f.repo, 'local-state')); ok(f.start());
});
