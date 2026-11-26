#!/usr/bin/env node
// A single-machine teaching companion. Local records are writable by their owner;
// process locking and role labels are not a security or distributed lease boundary.
import { spawnSync } from 'node:child_process';
import { createHash, randomUUID } from 'node:crypto';
import {
  closeSync, cpSync, existsSync, fsyncSync, mkdirSync, mkdtempSync, openSync,
  readFileSync, readdirSync, renameSync, rmSync, writeFileSync,
} from 'node:fs';
import { hostname, tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gate, runAgent, runVerifier, stateHash } from './lab.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const script = fileURLToPath(import.meta.url);
const fixture = join(here, 'sandbox');
const sha256 = value => createHash('sha256').update(value).digest('hex');
const isDigest = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const encode = value => `${JSON.stringify(value, null, 2)}\n`;
const limits = [
  'Trusted local fixture and scripted producer; no model or installed scheduler.',
  'One machine, serialized CLI writers, atomic JSON replacement; no distributed lease or power-loss guarantee.',
  'Local operator and identity labels are not authenticated principals or security isolation.',
  'The parent budget counts scripted Attempts, not money, tokens or all resource consumption.',
  'A local review decision never merges, publishes, deploys or authorizes production.',
];

function fail(code, message) {
  const error = new Error(message); error.code = code; throw error;
}
function requireValue(condition, code, message) { if (!condition) fail(code, message); }
function readJson(path) { return JSON.parse(readFileSync(path, 'utf8')); }
function atomicJson(path, value) {
  const temporary = `${path}.${randomUUID()}.tmp`;
  const fd = openSync(temporary, 'wx', 0o600);
  try { writeFileSync(fd, encode(value)); fsyncSync(fd); }
  finally { closeSync(fd); }
  renameSync(temporary, path);
}
function compositionDigest(profile) {
  return sha256([
    readFileSync(script), readFileSync(join(here, 'lab.mjs')),
    readFileSync(join(here, 'factory-definition.json')),
    readFileSync(join(here, 'work-order.json')), stateHash(fixture), encode(profile),
  ].join('\n'));
}
function readState(directory, { currentComposition = true } = {}) {
  const state = readJson(join(directory, 'state.json'));
  requireValue(state.kind === 'fdlc-local-operations-state' && state.version === 1,
    'INVALID_STATE', 'Use an operating directory created by this companion.');
  requireValue(Array.isArray(state.workOrders) && Array.isArray(state.events) && Array.isArray(state.history),
    'INVALID_STATE', 'Operating records are incomplete.');
  requireValue(Number.isSafeInteger(state.budget.reserved) && state.budget.reserved >= 0 &&
    state.budget.reserved <= state.profile.parentWorkBudget,
  'INVALID_STATE', 'Parent budget record is invalid.');
  for (const item of state.workOrders) {
    requireValue(/^WO-[a-f0-9]{16}$/.test(item.id) && Array.isArray(item.attempts),
      'INVALID_STATE', 'WorkOrder identity or attempt history is invalid.');
    for (const attempt of item.attempts) {
      requireValue(attempt.id === `${item.id}-A${attempt.number}` &&
        Number.isSafeInteger(attempt.number) && attempt.number >= 1,
      'INVALID_STATE', 'Attempt identity is invalid.');
    }
  }
  if (currentComposition) requireValue(state.compositionDigest === compositionDigest(state.profile),
    'COMPOSITION_CHANGED', 'The local composition changed. Preserve this directory and initialize a new one.');
  return state;
}
function save(directory, state, action, details = {}) {
  state.revision += 1;
  state.history.push({ revision: state.revision, action, at: new Date().toISOString(), ...details });
  atomicJson(join(directory, 'state.json'), state);
}
function activeAttempt(item) { return item.attempts.find(attempt => attempt.id === item.activeAttemptId); }
function workspace(directory, attempt) { return join(directory, 'attempts', attempt.id); }
function ownerIsAlive(owner) {
  requireValue(owner.hostname === hostname() && Number.isSafeInteger(owner.pid) && owner.pid > 0,
    'LOCK_UNKNOWN', 'Lock ownership is not provably on this machine. Preserve it for manual inspection.');
  try { process.kill(owner.pid, 0); return true; }
  catch (error) { if (error.code === 'ESRCH') return false; return true; }
}
function acquireLock(directory, recoverDead) {
  const lock = join(directory, '.writer-lock');
  const recovery = join(directory, '.recovery-lock');
  let recovering = false;
  if (recoverDead && existsSync(lock)) {
    try { mkdirSync(recovery); recovering = true; }
    catch { fail('RECOVERY_LOCKED', 'Another reconciliation owns recovery. An interrupted recovery requires inspection.'); }
    try {
      let owner;
      try { owner = readJson(join(lock, 'owner.json')); }
      catch { fail('LOCK_UNKNOWN', 'Lock metadata is incomplete; do not infer that its owner is dead.'); }
      requireValue(!ownerIsAlive(owner), 'LOCKED', `Writer ${owner.pid} is still alive; wait for it to finish.`);
      // Only reconciliation may remove a dead lock. The recovery lock serializes
      // that operation; normal writers never remove another writer's lock.
      renameSync(lock, join(directory, 'recovered-locks', randomUUID()));
    } finally { if (recovering) rmSync(recovery, { recursive: true }); }
  }
  try { mkdirSync(lock); }
  catch { fail('LOCKED', 'Another writer owns this directory. After a crashed process exits, run reconcile.'); }
  const owner = { pid: process.pid, hostname: hostname(), nonce: randomUUID(), startedAt: new Date().toISOString() };
  atomicJson(join(lock, 'owner.json'), owner);
  return () => {
    if (readJson(join(lock, 'owner.json')).nonce === owner.nonce) rmSync(lock, { recursive: true });
  };
}
function withLock(directory, action, recoverDead = false) {
  requireValue(existsSync(join(directory, 'state.json')), 'NOT_INITIALIZED', 'Run init with a new directory first.');
  const release = acquireLock(directory, recoverDead);
  try { return action(readState(directory)); } finally { release(); }
}
function summary(directory, state) {
  return {
    kind: 'fdlc-local-operations-status', directory, factoryInstance: state.factoryInstance,
    compositionDigest: state.compositionDigest, revision: state.revision,
    budget: { ...state.budget, limit: state.profile.parentWorkBudget, remaining: state.profile.parentWorkBudget - state.budget.reserved, unit: state.profile.budgetUnit },
    maxAttemptsPerWorkOrder: state.profile.maxAttemptsPerWorkOrder,
    workOrders: state.workOrders.map(item => {
      const latest = item.attempts.at(-1);
      return {
        id: item.id, eventId: item.eventId, status: item.status,
        attempts: item.attempts.length, activeAttemptId: item.activeAttemptId,
        candidate: latest?.candidate ?? null, evidence: latest?.evidence?.outputDigest ?? null,
        effectKey: latest?.effect?.key ?? null, decision: item.decision ?? null,
      };
    }),
    writerLockPresent: existsSync(join(directory, '.writer-lock')),
    stateFile: join(directory, 'state.json'), productionQualified: false, limitations: limits,
  };
}
function init(directory) {
  requireValue(!existsSync(directory), 'DIRECTORY_EXISTS', 'init requires a new directory; existing files are never overwritten.');
  const profile = readJson(join(here, 'operating-profile.json'));
  requireValue(profile.kind === 'fdlc-local-operations-profile' && profile.version === 1 &&
    ['parentWorkBudget', 'maxAttemptsPerWorkOrder', 'workUnitsPerAttempt', 'maxWorkOrders'].every(key =>
      Number.isSafeInteger(profile[key]) && profile[key] > 0) &&
    profile.publication === false && profile.productionQualified === false,
  'INVALID_PROFILE', 'The teaching profile must declare finite positive limits and no publication authority.');
  mkdirSync(directory, { recursive: false });
  for (const name of ['attempts', 'receipts', 'recovered-locks']) mkdirSync(join(directory, name));
  const state = {
    kind: 'fdlc-local-operations-state', version: 1, factoryInstance: randomUUID(),
    compositionDigest: compositionDigest(profile), profile, createdAt: new Date().toISOString(),
    revision: 0, budget: { reserved: 0 }, events: [], workOrders: [], history: [],
  };
  save(directory, state, 'initialized');
  return summary(directory, state);
}
function enqueue(directory, eventId, broken) {
  requireValue(typeof eventId === 'string' && eventId.length > 0 && eventId.length <= 200,
    'INVALID_EVENT', 'Use a nonempty event ID of at most 200 characters.');
  return withLock(directory, state => {
    const inputDigest = sha256(encode({ source: 'manual-cli', eventId, broken }));
    const previous = state.events.find(event => event.eventId === eventId);
    if (previous) {
      requireValue(previous.inputDigest === inputDigest, 'EVENT_CONFLICT', 'This event ID was already used with different input.');
      return { command: 'enqueue', outcome: 'duplicate', workOrderId: previous.workOrderId, inputDigest };
    }
    requireValue(state.workOrders.length < state.profile.maxWorkOrders, 'QUEUE_LIMIT', 'This teaching directory has reached its WorkOrder limit.');
    const id = `WO-${sha256(`${state.factoryInstance}\0${eventId}`).slice(0, 16)}`;
    state.events.push({ eventId, inputDigest, workOrderId: id });
    state.workOrders.push({ id, eventId, inputDigest, brokenFirstAttempt: broken, status: 'queued', attempts: [], activeAttemptId: null, decision: null });
    save(directory, state, 'intake-accepted', { workOrderId: id, eventId, inputDigest });
    return { command: 'enqueue', outcome: 'queued', workOrderId: id, inputDigest };
  });
}
function receipt(directory, state, item, attempt) {
  const key = sha256(`${state.factoryInstance}\0${item.id}\0local-review-handoff\0${attempt.candidate}`);
  const content = {
    kind: 'fdlc-local-review-handoff', key, workOrderId: item.id,
    candidate: attempt.candidate, evidence: attempt.evidence.outputDigest,
    compositionDigest: state.compositionDigest, destination: 'local-exercise-review-inbox',
  };
  return { key, content, path: join(directory, 'receipts', `${key}.json`), digest: sha256(encode(content)) };
}
function assertEvidence(directory, state, item, attempt) {
  requireValue(attempt?.agent && attempt.evidence && isDigest(attempt.candidate), 'MISSING_EVIDENCE', 'This Attempt has no complete candidate and evidence.');
  requireValue(attempt.evidence.outputDigest === sha256(attempt.evidence.output), 'EVIDENCE_CHANGED', 'The persisted verifier output digest does not match.');
  requireValue(attempt.candidate === attempt.evidence.commit, 'CANDIDATE_MISMATCH', 'The recorded candidate and evidence disagree.');
  const currentGate = gate({ dir: workspace(directory, attempt), attempt: attempt.agent, evidence: attempt.evidence });
  requireValue(currentGate.allowed, 'GATE_BLOCKED', currentGate.reasons.join('; '));
  const expected = receipt(directory, state, item, attempt);
  if (attempt.effect) requireValue(attempt.effect.key === expected.key && attempt.effect.receiptDigest === expected.digest,
    'RECEIPT_IDENTITY_CHANGED', 'The recorded effect identity does not match the exact candidate and evidence.');
  return expected;
}
function finishHandoff(directory, state, item, attempt, expected, action) {
  requireValue(existsSync(expected.path), 'RECEIPT_MISSING', 'The local handoff receipt is absent.');
  requireValue(sha256(readFileSync(expected.path)) === expected.digest, 'RECEIPT_MISMATCH', 'The local receipt differs from the intended effect; preserve it for inspection.');
  attempt.effect.status = 'confirmed';
  attempt.phase = 'complete'; attempt.finishedAt = new Date().toISOString();
  item.status = 'review-ready'; item.activeAttemptId = null;
  save(directory, state, action, { workOrderId: item.id, attemptId: attempt.id, effectKey: expected.key });
}
function work(directory, crash) {
  requireValue(!crash || ['after-candidate', 'after-effect'].includes(crash), 'INVALID_CRASH_POINT', 'Crash point must be after-candidate or after-effect.');
  return withLock(directory, state => {
    requireValue(!state.workOrders.some(item => item.status === 'reconciliation-required'),
      'RECONCILIATION_REQUIRED', 'Resolve the unknown local effect with reconcile before any further work.');
    const item = state.workOrders.find(entry => ['queued', 'failed-verification', 'candidate-recorded', 'verified'].includes(entry.status));
    if (!item) return { command: 'work', outcome: 'no-eligible-work', state: summary(directory, state) };
    let attempt = activeAttempt(item);
    if (!attempt) {
      if (item.attempts.length >= state.profile.maxAttemptsPerWorkOrder) {
        item.status = 'blocked-attempt-limit'; save(directory, state, 'attempt-limit', { workOrderId: item.id });
        return { command: 'work', outcome: item.status, state: summary(directory, state) };
      }
      if (state.budget.reserved + state.profile.workUnitsPerAttempt > state.profile.parentWorkBudget) {
        item.status = 'blocked-parent-budget'; save(directory, state, 'parent-budget-limit', { workOrderId: item.id });
        return { command: 'work', outcome: item.status, state: summary(directory, state) };
      }
      const number = item.attempts.length + 1;
      attempt = { id: `${item.id}-A${number}`, number, parentAttemptId: item.attempts.at(-1)?.id ?? null, phase: 'admitted', budgetUnits: state.profile.workUnitsPerAttempt, startedAt: new Date().toISOString() };
      item.attempts.push(attempt); item.activeAttemptId = attempt.id; item.status = 'executing';
      state.budget.reserved += attempt.budgetUnits;
      save(directory, state, 'attempt-admitted', { workOrderId: item.id, attemptId: attempt.id });
      const dir = workspace(directory, attempt);
      cpSync(fixture, dir, { recursive: true, errorOnExist: true, force: false });
      attempt.agent = runAgent(dir, { broken: item.brokenFirstAttempt && number === 1 });
      attempt.candidate = stateHash(dir); attempt.phase = 'candidate-recorded'; item.status = 'candidate-recorded';
      save(directory, state, 'candidate-recorded', { workOrderId: item.id, attemptId: attempt.id, candidate: attempt.candidate });
      if (crash === 'after-candidate') process.exit(86);
    }
    requireValue(attempt.phase !== 'admitted', 'RECONCILIATION_REQUIRED', 'An interrupted producer needs reconciliation before a new Attempt.');
    if (attempt.phase === 'candidate-recorded') {
      requireValue(stateHash(workspace(directory, attempt)) === attempt.candidate, 'CANDIDATE_CHANGED', 'The saved candidate changed before verification.');
      attempt.evidence = runVerifier(workspace(directory, attempt));
      attempt.gate = gate({ dir: workspace(directory, attempt), attempt: attempt.agent, evidence: attempt.evidence });
      if (!attempt.gate.allowed) {
        attempt.phase = 'failed-verification'; attempt.finishedAt = new Date().toISOString();
        item.status = 'failed-verification'; item.activeAttemptId = null;
        save(directory, state, 'verification-failed', { workOrderId: item.id, attemptId: attempt.id });
        return { command: 'work', outcome: item.status, state: summary(directory, state) };
      }
      attempt.phase = 'verified'; item.status = 'verified';
      save(directory, state, 'evidence-recorded', { workOrderId: item.id, attemptId: attempt.id });
    }
    const expected = assertEvidence(directory, state, item, attempt);
    attempt.effect = { key: expected.key, receiptDigest: expected.digest, status: 'unknown' };
    item.status = 'reconciliation-required'; attempt.phase = 'effect-pending';
    save(directory, state, 'effect-intent-recorded', { workOrderId: item.id, attemptId: attempt.id, effectKey: expected.key });
    // The write is local and repeatable. A crash between this atomic rename and
    // acknowledgement leaves a real receipt to reconcile under the same key.
    if (!existsSync(expected.path)) atomicJson(expected.path, expected.content);
    if (crash === 'after-effect') process.exit(86);
    finishHandoff(directory, state, item, attempt, expected, 'handoff-confirmed');
    return { command: 'work', outcome: item.status, state: summary(directory, state) };
  });
}
function reconcile(directory) {
  return withLock(directory, state => {
    const results = [];
    for (const item of state.workOrders) {
      const attempt = activeAttempt(item); if (!attempt) continue;
      if (attempt.phase === 'effect-pending') {
        const expected = assertEvidence(directory, state, item, attempt);
        if (existsSync(expected.path)) {
          finishHandoff(directory, state, item, attempt, expected, 'effect-reconciled');
          results.push({ workOrderId: item.id, outcome: 'receipt-confirmed', effectKey: expected.key });
        } else {
          attempt.effect.status = 'not-observed'; attempt.phase = 'verified'; item.status = 'verified';
          save(directory, state, 'effect-absence-recorded', { workOrderId: item.id, effectKey: expected.key });
          results.push({ workOrderId: item.id, outcome: 'receipt-absent-resume-same-operation', effectKey: expected.key });
        }
      } else if (attempt.phase === 'candidate-recorded') {
        requireValue(stateHash(workspace(directory, attempt)) === attempt.candidate, 'CANDIDATE_CHANGED', 'The interrupted candidate changed; preserve it for inspection.');
        save(directory, state, 'candidate-resumable', { workOrderId: item.id, attemptId: attempt.id });
        results.push({ workOrderId: item.id, outcome: 'resume-verification', attemptId: attempt.id });
      } else if (attempt.phase === 'admitted') {
        attempt.phase = 'interrupted'; attempt.finishedAt = new Date().toISOString();
        item.activeAttemptId = null; item.status = 'queued';
        save(directory, state, 'unrecorded-producer-interrupted', { workOrderId: item.id, attemptId: attempt.id });
        results.push({ workOrderId: item.id, outcome: 'new-attempt-required-budget-retained', attemptId: attempt.id });
      } else if (attempt.phase === 'verified') {
        assertEvidence(directory, state, item, attempt);
        results.push({ workOrderId: item.id, outcome: 'resume-local-handoff', attemptId: attempt.id });
      }
    }
    return { command: 'reconcile', results, state: summary(directory, state) };
  }, true);
}
function findItem(state, id) {
  const item = state.workOrders.find(entry => entry.id === id);
  requireValue(item, 'UNKNOWN_WORK_ORDER', 'No such WorkOrder exists in this directory.'); return item;
}
function review(directory, id, decision, candidate, evidence) {
  requireValue(['accept', 'reject'].includes(decision) && isDigest(candidate) && isDigest(evidence),
    'REVIEW_CONTRACT_REQUIRED', 'Supply accept|reject and the exact --candidate=<sha256> and --evidence=<sha256>.');
  return withLock(directory, state => {
    const item = findItem(state, id);
    if (item.decision) {
      requireValue(item.decision.decision === decision && item.decision.candidate === candidate && item.decision.evidence === evidence,
        'DECISION_CONFLICT', 'This WorkOrder already has a different terminal review decision.');
      return { command: 'review', outcome: 'already-recorded', decision: item.decision };
    }
    requireValue(item.status === 'review-ready', 'NOT_REVIEW_READY', `Cannot review a WorkOrder in ${item.status}.`);
    const attempt = item.attempts.at(-1);
    requireValue(attempt.candidate === candidate && attempt.evidence.outputDigest === evidence,
      'STALE_REVIEW', 'The supplied candidate or evidence does not match this review item.');
    const expected = assertEvidence(directory, state, item, attempt);
    requireValue(existsSync(expected.path) && sha256(readFileSync(expected.path)) === expected.digest,
      'RECEIPT_MISMATCH', 'The local handoff receipt is absent or different.');
    const record = { decision, candidate, evidence, reviewer: state.profile.reviewer, recordedAt: new Date().toISOString() };
    item.decision = { ...record, digest: sha256(encode({ workOrderId: id, ...record })) };
    item.status = decision === 'accept' ? 'accepted-locally' : 'rejected-locally';
    save(directory, state, 'review-recorded', { workOrderId: id, decisionDigest: item.decision.digest });
    return { command: 'review', outcome: item.status, decision: item.decision, released: false, productionQualified: false };
  });
}
function cancel(directory, id) {
  return withLock(directory, state => {
    const item = findItem(state, id);
    requireValue(!item.decision, 'TERMINAL_DECISION', 'A completed review cannot be replaced by cancellation.');
    requireValue(item.status !== 'reconciliation-required', 'RECONCILIATION_REQUIRED', 'Reconcile the unknown local effect before cancellation.');
    if (item.status !== 'cancelled') {
      const attempt = activeAttempt(item);
      if (attempt) { attempt.phase = 'cancelled'; attempt.finishedAt = new Date().toISOString(); }
      item.status = 'cancelled'; item.activeAttemptId = null;
      save(directory, state, 'cancelled', { workOrderId: id });
    }
    return { command: 'cancel', outcome: 'cancelled', workOrderId: id };
  });
}
function demo(directory) {
  directory ??= join(mkdtempSync(join(tmpdir(), 'fdlc-operations-')), 'factory');
  const checks = [];
  function invoke(args, expectedExit = 0) {
    const result = spawnSync(process.execPath, [script, ...args], { encoding: 'utf8', timeout: 15000 });
    requireValue(result.status === expectedExit, 'DEMO_FAILED', `${args[0]} exited ${result.status}; ${result.stderr || result.error || result.stdout}`);
    return result.stdout.trim() ? JSON.parse(result.stdout) : null;
  }
  const check = (name, passed) => { checks.push({ name, passed: Boolean(passed) }); requireValue(passed, 'DEMO_FAILED', name); };
  invoke(['init', directory]);
  const queued = invoke(['enqueue', directory, 'demo-broken-api', '--broken']);
  check('duplicate event returns the same WorkOrder', invoke(['enqueue', directory, 'demo-broken-api', '--broken']).workOrderId === queued.workOrderId);
  check('real API verification blocks the first candidate', invoke(['work', directory]).outcome === 'failed-verification');
  invoke(['work', directory, '--crash=after-effect'], 86);
  check('crashed writer cannot be blindly retried', invoke(['work', directory], 1).error.code === 'LOCKED');
  const recovered = invoke(['reconcile', directory]);
  check('a real local receipt resolves the unknown effect', recovered.results[0]?.outcome === 'receipt-confirmed');
  const ready = recovered.state.workOrders[0];
  check('recovery preserves both Attempts and their parent budget', ready.attempts === 2 && recovered.state.budget.reserved === 2);
  check('only one local handoff receipt exists', readdirSync(join(directory, 'receipts')).filter(name => name.endsWith('.json')).length === 1);
  check('an exact-subject review rejects a stale candidate', invoke(['review', directory, ready.id, 'accept', `--candidate=${'0'.repeat(64)}`, `--evidence=${ready.evidence}`], 1).error.code === 'STALE_REVIEW');
  check('the operator records local acceptance', invoke(['review', directory, ready.id, 'accept', `--candidate=${ready.candidate}`, `--evidence=${ready.evidence}`]).outcome === 'accepted-locally');
  const extra = invoke(['enqueue', directory, 'demo-over-budget']);
  check('new work cannot reset the shared parent budget', invoke(['work', directory]).outcome === 'blocked-parent-budget');
  check('a pending WorkOrder can be cancelled', invoke(['cancel', directory, extra.workOrderId]).outcome === 'cancelled');
  return { kind: 'fdlc-local-operations-demo', directory, passed: checks.every(check => check.passed), checks, finalState: invoke(['status', directory]), released: false, productionQualified: false, limitations: limits };
}

export function main(args) {
  const [command = 'help', rawDirectory, ...rest] = args;
  if (command === 'help') return {
    commands: ['init <new-directory>', 'enqueue <directory> <event-id> [--broken]', 'work <directory> [--crash=after-candidate|after-effect]', 'status <directory>', 'review <directory> <work-order-id> accept|reject --candidate=<sha256> --evidence=<sha256>', 'cancel <directory> <work-order-id>', 'reconcile <directory>', 'demo [<new-directory>]'],
    scope: 'Single-machine teaching exercise; no scheduler, model, merge, release or deployment.',
  };
  const directory = rawDirectory ? resolve(rawDirectory) : undefined;
  if (command === 'demo') return demo(directory);
  requireValue(directory, 'DIRECTORY_REQUIRED', 'Supply an operating directory.');
  const flag = name => rest.find(value => value.startsWith(`--${name}=`))?.slice(name.length + 3);
  if (command === 'init') return init(directory);
  if (command === 'enqueue') return enqueue(directory, rest[0], rest.includes('--broken'));
  if (command === 'work') return work(directory, flag('crash'));
  if (command === 'status') return summary(directory, readState(directory, { currentComposition: false }));
  if (command === 'reconcile') return reconcile(directory);
  if (command === 'review') return review(directory, rest[0], rest[1], flag('candidate'), flag('evidence'));
  if (command === 'cancel') return cancel(directory, rest[0]);
  fail('UNKNOWN_COMMAND', `Unknown command ${command}; use help.`);
}

if (process.argv[1] && resolve(process.argv[1]) === script) {
  try { console.log(encode(main(process.argv.slice(2))).trimEnd()); }
  catch (error) {
    console.log(encode({ error: { code: error.code || 'OPERATION_FAILED', message: error.message } }).trimEnd());
    process.exitCode = 1;
  }
}
