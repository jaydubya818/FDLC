import test from 'node:test';
import assert from 'node:assert/strict';
import { HttpModelProvider, parseReply, requestBody } from '../src/models.ts';
import { EnvironmentCredentialProvider, Redactor } from '../src/credentials.ts';
import { PLAN_TOOLS } from '../src/tools.ts';
import type { ProviderId, ProviderRequestReceipt } from '../src/types.ts';
import { call, fixture, TEST_KEY, wireReply } from './helpers.ts';

for (const provider of ['openai', 'anthropic'] as ProviderId[]) {
  test(`${provider}: real adapter maps tool calls/results and uses only bound authentication`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
    const model = new HttpModelProvider({ provider, model: 'fixture-model', credentials, reference: f.config.credential, redactor,
      fetchImpl: async (url, init) => {
        assert.equal(String(url), provider === 'openai' ? 'https://api.openai.com/v1/chat/completions' : 'https://api.anthropic.com/v1/messages');
        assert.equal(init?.redirect, 'error');
        assert(JSON.stringify(init?.headers).includes(TEST_KEY));
        assert(!String(init?.body).includes(TEST_KEY));
        const body = JSON.parse(String(init?.body));
        assert.equal(body.messages.at(-1).role, provider === 'openai' ? 'tool' : 'user');
        return wireReply(provider, [call('submit_plan', { summary: 'Fix it', steps: ['Read', 'Edit', 'Check'] })], TEST_KEY);
      },
    });
    const reply = await model.invoke([{ role: 'user', content: TEST_KEY }, { role: 'assistant', content: '', calls: [call('read_file', { path: 'index.js' })] }, { role: 'tool', content: 'File content', callId: 'call_read_file', error: false }], PLAN_TOOLS, new AbortController().signal);
    assert.equal(reply.calls[0]?.name, 'submit_plan'); assert.equal(reply.usage.costUsd, null); assert.equal(reply.usage.inputTokens, 10); assert(!reply.content.includes(TEST_KEY));
  });
  test(`${provider}: error bodies and network exceptions cannot leak credentials`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
    for (const fetchImpl of [async () => new Response(TEST_KEY, { status: 401 }), async () => { throw new Error(TEST_KEY); }]) {
      const model = new HttpModelProvider({ provider, model: 'fixture-model', credentials, reference: f.config.credential, redactor, fetchImpl });
      await assert.rejects(model.invoke([], PLAN_TOOLS, new AbortController().signal), error => !String(error).includes(TEST_KEY));
    }
  });
}
for (const provider of ['openai', 'anthropic'] as const) {
  test(`${provider}: request receipts retain attribution through response loss and prevent dispatch without a checkpoint`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
    let calls = 0; const receipts: ProviderRequestReceipt[] = [];
    const model = new HttpModelProvider({ provider, model: f.config.model, credentials, reference: f.config.credential, redactor,
      fetchImpl: async () => { calls++; assert.equal(receipts.at(-1)?.phase, 'STARTED'); throw new Error(TEST_KEY); } });
    await assert.rejects(model.invoke([], [], new AbortController().signal, receipt => { receipts.push(receipt); }), /no automatic retry/);
    assert.equal(calls, 1); assert.deepEqual(receipts.map(item => item.phase), ['STARTED', 'FAILED']);
    assert.equal(receipts[0]?.localRequestId, receipts[1]?.localRequestId);
    assert.equal(receipts[1]?.outcome, 'UNKNOWN'); assert.equal(receipts[1]?.usage, null);
    assert(!JSON.stringify(receipts).includes(TEST_KEY));
    await assert.rejects(model.invoke([], [], new AbortController().signal, () => { throw new Error('durable checkpoint unavailable'); }), /checkpoint/);
    assert.equal(calls, 1);
  });
  test(`${provider}: response headers are recorded before the body and missing usage is never invented`, async t => {
    const f = fixture({ 'index.js': '1\n' }, provider); t.after(f.cleanup);
    const redactor = new Redactor(); const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
    const receipts: ProviderRequestReceipt[] = [];
    const model = new HttpModelProvider({ provider, model: f.config.model, credentials, reference: f.config.credential, redactor,
      fetchImpl: async () => new Response('malformed', { headers: { [provider === 'openai' ? 'x-request-id' : 'request-id']: 'req_received_789' } }) });
    await assert.rejects(model.invoke([], [], new AbortController().signal, receipt => { receipts.push(receipt); }), /decoded/);
    assert.deepEqual(receipts.map(item => item.phase), ['STARTED', 'RESPONSE_HEADERS', 'FAILED']);
    assert.equal(receipts.at(-1)?.requestId, 'req_received_789');
    assert.equal(receipts.at(-1)?.outcome, 'RESPONSE_RECEIVED');
    assert.equal(receipts.at(-1)?.usage, null);
  });
}
test('provider usage fields preserve their distinct cache and reasoning semantics', () => {
  const openai = parseReply('openai', { model: 'fixture-returned', choices: [{ message: { content: 'ok' }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 30, completion_tokens: 9, prompt_tokens_details: { cached_tokens: 20 }, completion_tokens_details: { reasoning_tokens: 5 } } });
  assert.equal(openai.usage.inputTokens, 30); assert.equal(openai.usage.reasoningTokens, 5); assert.equal(openai.usage.cachedTokens, 20);
  const anthropic = parseReply('anthropic', { content: [{ type: 'text', text: 'ok' }], stop_reason: 'end_turn',
    usage: { input_tokens: 10, output_tokens: 3, cache_read_input_tokens: 20, cache_creation_input_tokens: 7 } });
  assert.equal(anthropic.usage.inputTokens, 10); assert.equal(anthropic.usage.cacheWriteTokens, 7); assert.equal(anthropic.usage.reasoningTokens, null);
});
test('unknown usage stays null and malformed tool arguments fail closed', () => {
  assert.equal(parseReply('openai', { choices: [{ message: { content: 'No calls' }, finish_reason: 'stop' }] }).usage.inputTokens, null);
  assert.throws(() => parseReply('openai', { choices: [{ message: { tool_calls: [{ id: 'x', type: 'function', function: { name: 'write_file', arguments: 'broken' } }] }, finish_reason: 'tool_calls' }] }), /malformed/);
  assert.throws(() => parseReply('anthropic', { content: [{ type: 'thinking', thinking: 'unsupported' }], stop_reason: 'end_turn' }), /Unsupported/);
  const body = requestBody('openai', 'fixture', [], PLAN_TOOLS); assert.equal(body.store, false); assert.equal(body.stream, false);
});
