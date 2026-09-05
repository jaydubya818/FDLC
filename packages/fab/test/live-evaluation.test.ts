import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { prepareEvaluation, runEvaluation } from '../src/evaluation.ts';
import { EnvironmentCredentialProvider, Redactor } from '../src/credentials.ts';
import { qualifyProvider } from '../src/qualification.ts';
import { SessionStore } from '../src/sessions.ts';
import { contentHash, parseConfig } from '../src/validation.ts';
import { call, TEST_KEY, wireReply } from './helpers.ts';

async function setup(t: test.TestContext) {
  const directory = mkdtempSync('/private/tmp/fab-live-evaluation-'); t.after(() => rmSync(directory, { recursive: true, force: true }));
  const prepared = prepareEvaluation('bug-fix', path.join(directory, 'repo'));
  const config = parseConfig({ version: 1, repository: prepared.repository, provider: 'openai', model: 'fixture-model',
    credential: { id: 'evaluation-fixture', owner: `local:${process.getuid?.()}`, provider: 'openai', scope: { kind: 'repository', root: prepared.repository }, source: { kind: 'environment', variable: 'FAB_EVALUATION_TEST' } },
    writableFiles: prepared.writableFiles, checks: prepared.checks, acceptanceCriteria: prepared.acceptanceCriteria, maxTurns: 8, timeoutMs: 20000, checkTimeoutMs: 5000 });
  const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(config.credential, redactor, { FAB_EVALUATION_TEST: TEST_KEY });
  let probe = 0;
  const qualification = await qualifyProvider({ config, credentials, redactor, live: true, signal: new AbortController().signal, fetchImpl: async () => {
    const reply = wireReply('openai', probe === 1 ? [call('qualification_echo', { value: 7 })] : [], probe++ === 0 ? 'FAB_OK' : 'FAB_CONTINUATION_OK');
    return Response.json({ ...await reply.json(), model: config.model });
  } });
  return { directory, config, redactor, credentials, qualification, store: new SessionStore(path.join(directory, 'state'), config.repository, redactor),
    signal: new AbortController().signal, family: 'bug-fix', live: true, maximumRequests: 4 };
}

test('all five evaluation families prepare a fresh repository without replacing existing work', t => {
  const directory = mkdtempSync('/private/tmp/fab-evaluation-families-'); t.after(() => rmSync(directory, { recursive: true, force: true }));
  for (const family of ['bug-fix', 'feature', 'refactor', 'test-repair', 'component']) {
    const prepared = prepareEvaluation(family, path.join(directory, family));
    assert.equal(prepared.writableFiles.length, 1); assert.match(prepared.sourceRevision, /^[a-f0-9]{40}$/);
    assert.throws(() => prepareEvaluation(family, prepared.repository), /exist/);
  }
});

test('live evaluation requires matching scope, recent qualification and explicit authority before inference', async t => {
  const f = await setup(t); let calls = 0;
  const fetchImpl: typeof fetch = async () => { calls++; throw new Error('Unexpected inference'); };
  await assert.rejects(runEvaluation({ ...f, fetchImpl, live: false }), /authorization/);
  await assert.rejects(runEvaluation({ ...f, fetchImpl, maximumRequests: 25 }), /limit/);
  await assert.rejects(runEvaluation({ ...f, fetchImpl, qualification: { ...f.qualification, requestedModel: 'different' } }), /qualification/);
  await assert.rejects(runEvaluation({ ...f, fetchImpl, qualification: { ...f.qualification, completedAt: new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString() } }), /qualification/);
  await assert.rejects(runEvaluation({ ...f, fetchImpl, config: { ...f.config, writableFiles: ['TASK.md'] } }), /scope/);
  writeFileSync(path.join(f.config.repository, 'unrelated.txt'), 'Unrelated content');
  await assert.rejects(runEvaluation({ ...f, fetchImpl }), /clean/);
  assert.equal(calls, 0);
});

test('live runner request cap stops before an additional model request and preserves the failed session', async t => {
  const f = await setup(t); let calls = 0;
  const result = await runEvaluation({ ...f, maximumRequests: 1, fetchImpl: async () => {
    calls++; return wireReply('openai', [call('submit_plan', { summary: 'Fix addition', steps: ['Edit math.mjs', 'Run reference'] })]);
  } });
  assert.equal(calls, 1); assert.equal(result.requestCount, 1); assert.equal(result.completion, false);
  assert.equal(f.store.load(result.sessionId).status, 'failed'); assert.equal(result.retries, 0);
  assert.deepEqual(result.failureClassification, { code: 'PROVIDER_BUDGET', issues: ['Authorized evaluation request budget exhausted.'] });
});

test('live runner measures a real candidate and an additional contained reference check with injected transport', { skip: process.env.FAB_TEST_CONTAINMENT !== '1' }, async t => {
  const f = await setup(t);
  const steps = [call('submit_plan', { summary: 'Fix addition', steps: ['Edit math.mjs', 'Run reference'] }),
    call('write_file', { path: 'math.mjs', expectedHash: contentHash('export const add = (a,b) => a-b;\n'), content: 'export const add = (a,b) => a+b;\n' }),
    call('run_check', { id: 'reference' }), call('finish_candidate', { summary: 'Addition corrected', unresolved: [] })];
  let calls = 0;
  const result = await runEvaluation({ ...f, fetchImpl: async () => wireReply('openai', [steps[calls++]!]) });
  assert.equal(result.transport, 'INJECTED'); assert.equal(result.completion, true); assert.equal(result.firstPassCheckSuccess, true);
  assert.equal(result.requestCount, 4); assert.equal(result.referenceCheck?.status, 'passed'); assert.equal(result.referenceCheck?.independent, false);
  assert.equal(result.candidateUnchanged, true); assert.equal(result.usage.inputTokens, 40); assert.equal(result.humanInterventions, 0);
  assert(!JSON.stringify(result).includes(TEST_KEY));
});
