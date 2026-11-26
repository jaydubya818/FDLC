import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const here = dirname(fileURLToPath(import.meta.url));
const defaultScript = join(here, 'operations.mjs');
function fixture(t, script = defaultScript) {
  const root = mkdtempSync(join(tmpdir(), 'fdlc-operations-test-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const directory = join(root, 'factory');
  const cli = (command, args = [], expectedExit = 0) => {
    const result = spawnSync(process.execPath, [script, command, directory, ...args], { encoding: 'utf8', timeout: 15000 });
    assert.equal(result.status, expectedExit, `${command}: ${result.stderr || result.stdout || result.error}`);
    return result.stdout.trim() ? JSON.parse(result.stdout) : null;
  };
  const state = () => JSON.parse(readFileSync(join(directory, 'state.json'), 'utf8'));
  return { root, directory, cli, state };
}
function exactReview(item, decision = 'accept') {
  return [item.id, decision, `--candidate=${item.candidate}`, `--evidence=${item.evidence}`];
}

test('the operations CLI persists work through a real directory symlink', t => {
  const root = mkdtempSync(join(tmpdir(), 'fdlc-operations-symlink-'));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const alias = join(root, 'template-link');
  symlinkSync(here, alias, 'dir');
  const f = fixture(t, join(alias, 'operations.mjs'));
  f.cli('init');
  const queued = f.cli('enqueue', ['symlink-entry']);
  const result = f.cli('work');
  assert.equal(result.outcome, 'review-ready');
  assert.equal(f.cli('status').workOrders[0].id, queued.workOrderId);
  assert.equal(f.state().budget.reserved, 1);
  assert.equal(f.cli('review', exactReview(result.state.workOrders[0])).outcome, 'accepted-locally');
});

test('a real process restart preserves the candidate and resumes verification without a new reservation', t => {
  const f = fixture(t); f.cli('init');
  f.cli('enqueue', ['restart-candidate']);
  f.cli('work', ['--crash=after-candidate'], 86);
  const interrupted = f.state();
  const first = interrupted.workOrders[0].attempts[0];
  assert.equal(first.phase, 'candidate-recorded');
  assert.equal(first.evidence, undefined);
  assert.equal(f.cli('work', [], 1).error.code, 'LOCKED');
  assert.equal(f.cli('reconcile').results[0].outcome, 'resume-verification');
  const ready = f.cli('work');
  assert.equal(ready.outcome, 'review-ready');
  assert.equal(ready.state.workOrders[0].candidate, first.candidate);
  assert.equal(ready.state.workOrders[0].attempts, 1);
  assert.equal(ready.state.budget.reserved, 1);
  const reopened = f.cli('status');
  assert.equal(reopened.workOrders[0].evidence, ready.state.workOrders[0].evidence);
  assert.equal(reopened.writerLockPresent, false);
  assert.equal(readdirSync(join(f.directory, 'recovered-locks')).length, 1);
});

test('a crash after a filesystem effect requires reconciliation and reuses its stable receipt', t => {
  const f = fixture(t); f.cli('init'); f.cli('enqueue', ['restart-effect']);
  f.cli('work', ['--crash=after-effect'], 86);
  const pending = f.state().workOrders[0].attempts[0];
  assert.equal(pending.effect.status, 'unknown');
  const receipt = join(f.directory, 'receipts', `${pending.effect.key}.json`);
  const originalReceipt = readFileSync(receipt, 'utf8');
  assert.equal(f.cli('status').workOrders[0].status, 'reconciliation-required');
  assert.equal(f.cli('work', [], 1).error.code, 'LOCKED');
  const reconciled = f.cli('reconcile');
  assert.equal(reconciled.results[0].outcome, 'receipt-confirmed');
  assert.equal(reconciled.results[0].effectKey, pending.effect.key);
  assert.equal(readFileSync(receipt, 'utf8'), originalReceipt);
  assert.equal(reconciled.state.budget.reserved, 1);
  assert.equal(reconciled.state.workOrders[0].attempts, 1);
  assert.equal(f.cli('work').outcome, 'no-eligible-work');
  assert.equal(readdirSync(join(f.directory, 'receipts')).length, 1);
  assert.equal(f.cli('reconcile').results.length, 0);
});

test('a mismatched real receipt stays unresolved and blocks retry and cancellation', t => {
  const f = fixture(t); f.cli('init');
  const queued = f.cli('enqueue', ['bad-receipt']);
  f.cli('work', ['--crash=after-effect'], 86);
  const pending = f.state().workOrders[0].attempts[0];
  const receipt = join(f.directory, 'receipts', `${pending.effect.key}.json`);
  writeFileSync(receipt, '{"candidate":"different"}\n');
  assert.equal(f.cli('reconcile', [], 1).error.code, 'RECEIPT_MISMATCH');
  assert.equal(f.cli('work', [], 1).error.code, 'RECONCILIATION_REQUIRED');
  assert.equal(f.cli('cancel', [queued.workOrderId], 1).error.code, 'RECONCILIATION_REQUIRED');
  assert.equal(f.cli('status').workOrders[0].status, 'reconciliation-required');
  assert.equal(readFileSync(receipt, 'utf8'), '{"candidate":"different"}\n');
});

test('a missing local receipt is observed before repeating the same logical operation', t => {
  const f = fixture(t); f.cli('init'); f.cli('enqueue', ['missing-receipt']);
  f.cli('work', ['--crash=after-effect'], 86);
  const pending = f.state().workOrders[0].attempts[0];
  const receipt = join(f.directory, 'receipts', `${pending.effect.key}.json`);
  // Deliberate local fault injection: no network or third-party operation exists.
  rmSync(receipt);
  const result = f.cli('reconcile');
  assert.equal(result.results[0].outcome, 'receipt-absent-resume-same-operation');
  assert.equal(result.state.workOrders[0].status, 'verified');
  assert.equal(f.cli('work').outcome, 'review-ready');
  assert.ok(existsSync(receipt));
  assert.equal(f.state().workOrders[0].attempts[0].effect.key, pending.effect.key);
  assert.equal(f.state().budget.reserved, 1);
  assert.equal(f.state().workOrders[0].attempts.length, 1);
});

test('failed evidence remains intact and correction consumes the shared parent budget', t => {
  const f = fixture(t); f.cli('init'); f.cli('enqueue', ['broken-api', '--broken']);
  assert.equal(f.cli('work').outcome, 'failed-verification');
  const failed = f.state().workOrders[0].attempts[0];
  assert.equal(failed.evidence.passed, false);
  const failedWorkspace = readFileSync(join(f.directory, 'attempts', failed.id, 'src/add.js'), 'utf8');
  assert.equal(f.cli('work').outcome, 'review-ready');
  const state = f.state();
  assert.equal(state.workOrders[0].attempts[1].parentAttemptId, failed.id);
  assert.deepEqual(state.workOrders[0].attempts[0], failed);
  assert.equal(readFileSync(join(f.directory, 'attempts', failed.id, 'src/add.js'), 'utf8'), failedWorkspace);
  const extra = f.cli('enqueue', ['new-work']);
  assert.equal(f.cli('work').outcome, 'blocked-parent-budget');
  assert.equal(f.state().workOrders[1].attempts.length, 0);
  assert.equal(f.state().budget.reserved, 2);
  assert.equal(f.cli('cancel', [extra.workOrderId]).outcome, 'cancelled');
});

test('the separately configured attempt ceiling stops correction before the parent budget is exhausted', t => {
  const templateRoot = mkdtempSync(join(tmpdir(), 'fdlc-profile-test-'));
  t.after(() => rmSync(templateRoot, { recursive: true, force: true }));
  const template = join(templateRoot, 'template');
  cpSync(here, template, { recursive: true });
  const profilePath = join(template, 'operating-profile.json');
  const profile = JSON.parse(readFileSync(profilePath, 'utf8'));
  profile.maxAttemptsPerWorkOrder = 1;
  writeFileSync(profilePath, JSON.stringify(profile));
  const f = fixture(t, join(template, 'operations.mjs'));
  f.cli('init'); f.cli('enqueue', ['one-attempt', '--broken']);
  assert.equal(f.cli('work').outcome, 'failed-verification');
  assert.equal(f.cli('work').outcome, 'blocked-attempt-limit');
  assert.equal(f.state().budget.reserved, 1);
  assert.equal(f.state().workOrders[0].attempts.length, 1);
});

test('event replay deduplicates across processes and conflicting input cannot reuse the key', t => {
  const f = fixture(t); f.cli('init');
  const first = f.cli('enqueue', ['replayed']);
  const revision = f.state().revision;
  const duplicate = f.cli('enqueue', ['replayed']);
  assert.equal(duplicate.outcome, 'duplicate');
  assert.equal(duplicate.workOrderId, first.workOrderId);
  assert.equal(f.state().revision, revision);
  assert.equal(f.cli('enqueue', ['replayed', '--broken'], 1).error.code, 'EVENT_CONFLICT');
  assert.equal(f.state().events.length, 1);
  assert.equal(f.state().workOrders.length, 1);
  assert.equal(f.cli('init', [], 1).error.code, 'DIRECTORY_EXISTS');
  assert.equal(f.state().revision, revision);
});

test('review binds exact candidate and evidence and records one terminal operator decision', t => {
  const f = fixture(t); f.cli('init'); f.cli('enqueue', ['review']);
  const item = f.cli('work').state.workOrders[0];
  assert.equal(f.cli('review', [item.id, 'accept'], 1).error.code, 'REVIEW_CONTRACT_REQUIRED');
  assert.equal(f.cli('review', [item.id, 'accept', `--candidate=${'0'.repeat(64)}`, `--evidence=${item.evidence}`], 1).error.code, 'STALE_REVIEW');
  assert.equal(f.cli('review', [item.id, 'accept', `--candidate=${item.candidate}`, `--evidence=${'0'.repeat(64)}`], 1).error.code, 'STALE_REVIEW');
  const accepted = f.cli('review', exactReview(item));
  assert.equal(accepted.outcome, 'accepted-locally');
  assert.equal(accepted.released, false);
  const repeated = f.cli('review', exactReview(item));
  assert.equal(repeated.outcome, 'already-recorded');
  assert.equal(repeated.decision.digest, accepted.decision.digest);
  assert.equal(f.cli('review', exactReview(item, 'reject'), 1).error.code, 'DECISION_CONFLICT');
  assert.equal(f.cli('status').workOrders[0].status, 'accepted-locally');
});

test('a changed workspace invalidates saved evidence before review', t => {
  const f = fixture(t); f.cli('init'); f.cli('enqueue', ['tampered']);
  const item = f.cli('work').state.workOrders[0];
  const attempt = f.state().workOrders[0].attempts[0];
  writeFileSync(join(f.directory, 'attempts', attempt.id, 'src/add.js'), 'export const add = () => 0;\n');
  assert.equal(f.cli('review', exactReview(item), 1).error.code, 'GATE_BLOCKED');
  assert.equal(f.state().workOrders[0].decision, null);
});

test('operator rejection and cancellation persist without rerunning their WorkOrders', t => {
  const f = fixture(t); f.cli('init'); f.cli('enqueue', ['reject']);
  const item = f.cli('work').state.workOrders[0];
  assert.equal(f.cli('review', exactReview(item, 'reject')).outcome, 'rejected-locally');
  const queued = f.cli('enqueue', ['cancel']);
  assert.equal(f.cli('cancel', [queued.workOrderId]).outcome, 'cancelled');
  assert.equal(f.cli('enqueue', ['cancel']).outcome, 'duplicate');
  assert.equal(f.cli('work').outcome, 'no-eligible-work');
  assert.equal(f.state().budget.reserved, 1);
  assert.equal(f.cli('review', [queued.workOrderId, 'accept', `--candidate=${item.candidate}`, `--evidence=${item.evidence}`], 1).error.code, 'NOT_REVIEW_READY');
});

test('the CLI demonstration executes failure, restart, reconciliation, exact review and budget controls', t => {
  const f = fixture(t);
  const result = f.cli('demo');
  assert.equal(result.kind, 'fdlc-local-operations-demo');
  assert.equal(result.passed, true);
  assert.equal(result.checks.length, 10);
  assert.ok(result.checks.every(check => check.passed));
  assert.equal(result.productionQualified, false);
  assert.equal(result.released, false);
  assert.deepEqual(result.finalState.workOrders.map(item => item.status), ['accepted-locally', 'cancelled']);
});
