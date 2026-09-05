import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { setTimeout as delay } from 'node:timers/promises';
import path from 'node:path';
import { runCheck } from '../src/checks.ts';
import { Repository } from '../src/repository.ts';
import { Redactor } from '../src/credentials.ts';
import { fixture, TEST_KEY } from './helpers.ts';

const contained = process.env.FAB_TEST_CONTAINMENT === '1';
test('OS containment denies outside reads/writes, environment secrets, network and other executables', { skip: !contained }, async t => {
  const f = fixture({ 'index.js': 'const value = 1;\n' }); t.after(f.cleanup);
  const outside = path.join(f.directory, 'outside.txt'); writeFileSync(outside, 'protected fixture');
  const script = `const fs=require('node:fs'), assert=require('node:assert/strict'), net=require('node:net'), cp=require('node:child_process');
    assert.throws(()=>fs.readFileSync(${JSON.stringify(outside)}));
    assert.throws(()=>fs.writeFileSync(${JSON.stringify(outside)},'changed'));
    assert.throws(()=>fs.readFileSync(${JSON.stringify(path.join(f.root, 'index.js'))}));
    assert.equal(process.env.FAB_PARENT_TEST_VALUE,undefined);
    assert.equal(process.env.OPENAI_API_KEY,undefined);
    const spawned=cp.spawnSync('/bin/sh',['-c','exit 0']); assert.notEqual(spawned.status,0);
    const daemon=cp.spawnSync(process.execPath,['-e','setInterval(()=>{},1000)'],{detached:true,timeout:500}); assert.equal(daemon.error?.code,'EPERM');
    const socket=net.connect({host:'127.0.0.1',port:9});
    socket.once('error', error=>{assert.equal(error.code,'EPERM');console.log('containment assertions passed')});
    socket.once('connect',()=>{console.error('unexpected network connection');process.exit(9)});`;
  process.env.FAB_PARENT_TEST_VALUE = TEST_KEY; t.after(() => { delete process.env.FAB_PARENT_TEST_VALUE; });
  const redactor = new Redactor(); redactor.register(TEST_KEY);
  const result = await runCheck(new Repository(f.root, f.config.writableFiles), { id: 'boundary', argv: [process.execPath, '-e', script] }, 5000, redactor, new AbortController().signal);
  assert.equal(result.status, 'passed', JSON.stringify(result));
  assert.match(result.stdout, /containment assertions passed/); assert.equal(readFileSync(outside, 'utf8'), 'protected fixture');
});
test('timeout, output overflow and cancellation cannot report check success', { skip: !contained }, async t => {
  const f = fixture({ 'index.js': '1\n' }); t.after(f.cleanup);
  const repository = new Repository(f.root, f.config.writableFiles); const redactor = new Redactor();
  const timed = await runCheck(repository, { id: 'timeout', argv: [process.execPath, '-e', 'setInterval(()=>{},1000)'] }, 150, redactor, new AbortController().signal);
  assert.equal(timed.status, 'timed_out');
  const overflow = await runCheck(repository, { id: 'output', argv: [process.execPath, '-e', 'process.stdout.write("x".repeat(400000))'] }, 5000, redactor, new AbortController().signal);
  assert.equal(overflow.status, 'failed'); assert.equal(overflow.stdout, '');
  const controller = new AbortController(); setTimeout(() => controller.abort(), 150);
  const cancelled = await runCheck(repository, { id: 'cancel', argv: [process.execPath, '-e', 'setInterval(()=>{},1000)'] }, 5000, redactor, controller.signal);
  assert.equal(cancelled.status, 'cancelled');
});

test('SIGKILL of the Fab process terminates its active check and removes the snapshot', { skip: !contained }, async t => {
  const f = fixture({ 'index.js': 'unchanged\n' }); t.after(f.cleanup);
  const marker = `parent-loss-${randomUUID()}.json`;
  const checkScript = `require('node:fs').writeFileSync('../tmp/${marker}', JSON.stringify({ pid: process.pid, guard: process.ppid })); setInterval(()=>{},1000);`;
  const workerScript = `
    import { runCheck } from ${JSON.stringify(new URL('../dist/checks.js', import.meta.url).href)};
    import { Repository } from ${JSON.stringify(new URL('../dist/repository.js', import.meta.url).href)};
    import { Redactor } from ${JSON.stringify(new URL('../dist/credentials.js', import.meta.url).href)};
    await runCheck(new Repository(${JSON.stringify(f.root)}, ${JSON.stringify(f.config.writableFiles)}),
      { id: 'parent-loss', argv: ${JSON.stringify([process.execPath, '-e', checkScript])} },
      30000, new Redactor(), new AbortController().signal);`;
  const worker = spawn(process.execPath, ['--input-type=module', '-e', workerScript], {
    env: { PATH: '/usr/bin:/bin:/opt/homebrew/bin', HOME: f.directory, TMPDIR: '/private/tmp' },
    stdio: 'ignore',
  });
  const closed = once(worker, 'close');
  let snapshot: string | undefined; let checkPid: number | undefined; let guardPid: number | undefined;
  t.after(async () => {
    if (worker.exitCode === null && worker.signalCode === null) worker.kill('SIGKILL');
    await closed;
    if (guardPid && snapshot && existsSync(snapshot)) {
      try { process.kill(-guardPid, 'SIGKILL'); } catch { /* Already terminated. */ }
      rmSync(snapshot, { recursive: true, force: true });
    }
  });
  const deadline = Date.now() + 10000;
  while (!checkPid && Date.now() < deadline) {
    for (const name of readdirSync('/private/tmp').filter(name => name.startsWith('fab-check-'))) {
      const file = path.join('/private/tmp', name, 'tmp', marker);
      if (!existsSync(file)) continue;
      const owned = JSON.parse(readFileSync(file, 'utf8')) as { pid: number; guard: number };
      snapshot = path.join('/private/tmp', name); checkPid = owned.pid; guardPid = owned.guard;
    }
    if (!checkPid) await delay(20);
  }
  assert.ok(checkPid && guardPid && snapshot, 'The real sandboxed check must start before killing Fab.');
  assert.equal(worker.kill('SIGKILL'), true);
  const [code, signal] = await closed;
  assert.equal(code, null); assert.equal(signal, 'SIGKILL');
  const isAlive = () => { try { process.kill(checkPid, 0); return true; } catch { return false; } };
  const cleanupDeadline = Date.now() + 5000;
  while ((existsSync(snapshot) || isAlive()) && Date.now() < cleanupDeadline) await delay(20);
  assert.equal(isAlive(), false, 'An agent crash must not leave its check running.');
  assert.equal(existsSync(snapshot), false, 'The supervisor must remove the snapshot after parent loss.');
  assert.equal(readFileSync(path.join(f.root, 'index.js'), 'utf8'), 'unchanged\n');
});
