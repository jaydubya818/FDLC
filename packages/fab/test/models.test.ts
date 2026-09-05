import test from 'node:test';
import assert from 'node:assert/strict';
import { HttpModelProvider, parseReply, requestBody } from '../src/models.ts';
import { EnvironmentCredentialProvider, Redactor } from '../src/credentials.ts';
import { PLAN_TOOLS } from '../src/tools.ts';
import type { ProviderId } from '../src/types.ts';
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
test('unknown usage stays null and malformed tool arguments fail closed', () => {
  assert.equal(parseReply('openai', { choices: [{ message: { content: 'No calls' }, finish_reason: 'stop' }] }).usage.inputTokens, null);
  assert.throws(() => parseReply('openai', { choices: [{ message: { tool_calls: [{ id: 'x', type: 'function', function: { name: 'write_file', arguments: 'broken' } }] }, finish_reason: 'tool_calls' }] }), /malformed/);
  assert.throws(() => parseReply('anthropic', { content: [{ type: 'thinking', thinking: 'unsupported' }], stop_reason: 'end_turn' }), /Unsupported/);
  const body = requestBody('openai', 'fixture', [], PLAN_TOOLS); assert.equal(body.store, false); assert.equal(body.stream, false);
});
