import test from 'node:test';
import assert from 'node:assert/strict';
import { qualifyProvider } from '../src/qualification.ts';
import { HttpModelProvider } from '../src/models.ts';
import { EnvironmentCredentialProvider, Redactor } from '../src/credentials.ts';
import { call, fixture, TEST_KEY, wireReply } from './helpers.ts';

for (const provider of ['openai', 'anthropic', 'openrouter'] as const) {
  test(`${provider}: qualification requires explicit live opt-in and a selected credential`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); let calls = 0;
    for (const [live, environment] of [[false, { FAB_TEST_MODEL_KEY: TEST_KEY }], [true, {}]] as const) {
      const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, environment);
      const report = await qualifyProvider({ config: f.config, credentials, redactor, live, signal: new AbortController().signal, fetchImpl: async () => { calls++; throw new Error('must not call'); } });
      assert.equal(report.status, 'NOT RUN'); assert.equal(calls, 0);
    }
  });
  test(`${provider}: mock qualification exercises exact model, inference and full tool continuation`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
    let index = 0;
    const report = await qualifyProvider({ config: f.config, credentials, redactor, live: true, signal: new AbortController().signal, fetchImpl: async (_url, options) => {
      const body = JSON.parse(String(options?.body)); assert.equal(body.model, f.config.model);
      assert.equal(body[provider === 'openai' ? 'max_completion_tokens' : 'max_tokens'], 128);
      const reply = wireReply(provider, index === 1 ? [call('qualification_echo', { value: 7 })] : [], index === 0 ? 'FAB_OK' : 'FAB_CONTINUATION_OK'); index++;
      return Response.json({ ...await reply.json(), model: 'fixture-returned-model' });
    } });
    assert.equal(index, 3); assert.equal(report.status, 'PASS'); assert.equal(report.usage.inputTokens, 30);
    assert.deepEqual(report.returnedModels, ['fixture-returned-model']); assert(!JSON.stringify(report).includes(TEST_KEY));
    assert.equal(report.requestCount, 3); assert.equal(report.maximumRequests, 3); assert.equal(report.retries, 0);
    assert.equal(report.transport, 'INJECTED'); assert.deepEqual(report.qualifiedModels, []);
    assert.equal(new Set(report.requests.map(item => item.localRequestId)).size, 3);
    assert(report.requests.every(item => item.phase === 'SUCCEEDED' && item.costClassification === (provider === 'openrouter' ? 'ACTUAL' : 'UNKNOWN')));
    assert.equal(report.costClassification, provider === 'openrouter' ? 'ACTUAL' : 'UNKNOWN');
    assert(report.checks.filter(item => item.mode === 'unsupported').every(item => item.status === 'NOT RUN'));
  });
  test(`${provider}: qualification refuses latest and does not retry failed calls`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
    let calls = 0;
    const run = (model: string) => qualifyProvider({ config: { ...f.config, model }, credentials, redactor, live: true, signal: new AbortController().signal,
      fetchImpl: async () => { calls++; return new Response(TEST_KEY, { status: 429, headers: { [provider === 'anthropic' ? 'request-id' : 'x-request-id']: 'req_fixture_123' } }); } });
    assert.equal((await run('model-latest')).status, 'FAIL'); assert.equal(calls, 0);
    const failed = await run(f.config.model);
    assert.equal(calls, 1); assert.equal(failed.requestCount, 1); assert.equal(failed.status, 'FAIL');
    assert.equal(failed.requests[0]?.requestId, 'req_fixture_123');
    assert.equal(failed.requests[0]?.errorCode, 'PROVIDER_RATE_LIMIT');
  });
  test(`${provider}: cancellation, timeout, context limit and echoed HTTP/transport errors fail closed`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
    let calls = 0;
    const model = new HttpModelProvider({ provider, model: f.config.model, credentials, reference: f.config.credential, redactor, fetchImpl: async () => { calls++; return wireReply(provider, []); } });
    await assert.rejects(model.invoke([], [], AbortSignal.abort())); assert.equal(calls, 0);
    await assert.rejects(model.invoke([{ role: 'user', content: 'x'.repeat(210000) }], [], new AbortController().signal), /Context byte/); assert.equal(calls, 0);
    const keepAlive = setInterval(() => {}, 1000); t.after(() => clearInterval(keepAlive));
    const hanging = new HttpModelProvider({ provider, model: f.config.model, credentials, reference: f.config.credential, redactor, timeoutMs: 10, fetchImpl: async () => new Promise(() => {}) });
    await assert.rejects(hanging.invoke([], [], new AbortController().signal), /cancelled/);
    const controller = new AbortController(); setTimeout(() => controller.abort(), 1);
    await assert.rejects(hanging.invoke([], [], controller.signal), /cancelled/);
    for (const fetchImpl of [async () => new Response(TEST_KEY + TEST_KEY.slice(0, 8), { status: 401 }), async () => { throw new Error(TEST_KEY, { cause: new Error(TEST_KEY) }); }]) {
      const failed = new HttpModelProvider({ provider, model: f.config.model, credentials, reference: f.config.credential, redactor, fetchImpl });
      await assert.rejects(failed.invoke([], [], new AbortController().signal), error => !JSON.stringify(redactor.value(error)).includes(TEST_KEY));
    }
  });
}
