import test from 'node:test';
import assert from 'node:assert/strict';
import { BedrockModelProvider, bedrockRequestBody, type BedrockBrokerIdentity, type BedrockBrokerRequest, type BedrockBrokerTransport } from '../src/bedrock.ts';
import { HttpModelProvider, parseReply, providerProtocol, requestBody } from '../src/models.ts';
import { Redactor } from '../src/credentials.ts';
import { FabError, parseConfig } from '../src/validation.ts';
import { qualifyProvider } from '../src/qualification.ts';
import type { FabConfig, Message, ProviderRequestReceipt, ToolDefinition } from '../src/types.ts';

const route = { accountId: '123456789012', region: 'us-east-1', modelId: 'anthropic.claude-sonnet-4-6', inferenceProfileId: 'us.anthropic.claude-sonnet-4-6', inferenceProfileArn: 'arn:aws:bedrock:us-east-1:123456789012:inference-profile/us.anthropic.claude-sonnet-4-6' } as const;
const config = (): FabConfig => parseConfig({ version: 1, repository: '/private/tmp/fab-bedrock-fixture', provider: 'bedrock', model: route.modelId,
  bedrockRoute: route, credential: { id: 'mc-fixture-broker', owner: 'local:501', provider: 'bedrock', source: { kind: 'broker' }, scope: { kind: 'repository', root: '/private/tmp/fab-bedrock-fixture' } },
  writableFiles: ['app.mjs'], checks: [{ id: 'test', argv: ['/usr/bin/true'] }], acceptanceCriteria: ['Fixture only'] });
const messages: Message[] = [{ role: 'user', content: 'Synthetic protocol probe.' }];
const tool: ToolDefinition = { name: 'qualification_echo', description: 'Synthetic echo.', parameters: { type: 'object', properties: { value: { type: 'integer' } }, required: ['value'] } };
const responseBody = () => ({ id: 'msg-fixture-1', model: 'claude-sonnet-4-6', content: [{ type: 'text', text: 'FAB_OK' }], stop_reason: 'end_turn', usage: { input_tokens: 12, output_tokens: 3 } });
function fixture(change?: (request: BedrockBrokerRequest) => Promise<unknown>, identityChange?: (identity: BedrockBrokerIdentity) => void) {
  let calls = 0;
  const requests: BedrockBrokerRequest[] = [];
  const transport: BedrockBrokerTransport = {
    identity: () => { const identity: BedrockBrokerIdentity = { route: structuredClone(route), credentialReference: 'mc-fixture-broker', maximumAttempts: 1 }; identityChange?.(identity); return identity; },
    invoke: async request => {
      calls++; requests.push(request);
      return { requestDigest: request.requestDigest, providerRequestId: 'aws-fixture-request-1', httpStatus: 200, attempts: 1, body: JSON.stringify(change ? await change(request) : responseBody()) };
    },
  };
  return { transport, requests, calls: () => calls };
}
const code = (expected: string) => (error: unknown) => error instanceof FabError && error.code === expected;

test('Bedrock configuration requires a broker, exact account/profile binding, and selected model', () => {
  assert.equal(config().credential.source.kind, 'broker');
  for (const change of [
    (c: FabConfig) => { c.credential.source = { kind: 'environment', variable: 'FAB_AWS_KEY' }; },
    (c: FabConfig) => { c.credential.source = { kind: 'keychain' }; },
    (c: FabConfig) => { c.model = 'claude-other'; },
    (c: FabConfig) => { c.bedrockRoute!.inferenceProfileArn = 'arn:aws:bedrock:us-east-1:123456789012:inference-profile/global.anthropic.claude-sonnet-4-6'; },
    (c: FabConfig) => { c.bedrockRoute!.accountId = '111111111111'; },
  ]) { const c = config(); change(c); assert.throws(() => parseConfig(c)); }
});

test('all HTTP entry points reject Bedrock without credential use or endpoint fallback', () => {
  for (const run of [() => parseReply('bedrock', {}), () => requestBody('bedrock', route.modelId, messages, []), () => providerProtocol('bedrock'),
    () => new HttpModelProvider({ provider: 'bedrock', model: route.modelId, credentials: { metadata: () => ({ configured: false, reference: 'none', storage: 'environment' }), use: async () => { throw new Error('Must not read credentials'); } }, reference: config().credential, redactor: new Redactor() })]) assert.throws(run, code('BROKER_REQUIRED'));
});

test('serializer uses the Bedrock Anthropic protocol and preserves tool results', () => {
  const history: Message[] = [...messages, { role: 'assistant', content: '', calls: [{ id: 'echo_1', name: tool.name, arguments: { value: 7 } }] }, { role: 'tool', callId: 'echo_1', content: '{"value":7}', error: false }];
  const body = JSON.parse(bedrockRequestBody(history, [tool], 128));
  assert.equal(body.anthropic_version, 'bedrock-2023-05-31'); assert.equal(body.max_tokens, 128);
  assert.equal(body.model, undefined); assert.equal(body.stream, undefined); assert.equal(body.thinking, undefined);
  assert.equal(body.messages[1].content[0].input.value, 7); assert.equal(body.messages[2].content[0].tool_use_id, 'echo_1');
  assert.throws(() => bedrockRequestBody(history.slice(0, 2), [tool], 128), code('PROVIDER_REQUEST'));
  assert.throws(() => bedrockRequestBody([...messages, history[2]!], [tool], 128), code('PROVIDER_REQUEST'));
  assert.throws(() => bedrockRequestBody(history, [tool, tool], 128), code('PROVIDER_REQUEST'));
  // A denied/unavailable historical tool can be followed by its error result.
  assert.doesNotThrow(() => bedrockRequestBody(history, [], 128));
});

test('broker identity is frozen before dispatch, including route, reference, and attempts', () => {
  for (const change of [
    (i: BedrockBrokerIdentity) => { i.route.accountId = '111111111111'; },
    (i: BedrockBrokerIdentity) => { i.credentialReference = 'other'; },
    (i: BedrockBrokerIdentity) => { Object.assign(i, { maximumAttempts: 2 }); },
  ]) { const f = fixture(undefined, change); assert.throws(() => new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() }), code('BEDROCK_ROUTE')); assert.equal(f.calls(), 0); }
});

test('request intent precedes the broker and safe response metadata retains actual usage and unknown cost', async () => {
  const receipts: ProviderRequestReceipt[] = [];
  const f = fixture(async request => { assert.equal(receipts[0]?.phase, 'STARTED'); assert.equal(receipts[0]?.requestDigest, request.requestDigest); assert(Object.isFrozen(request)); assert(Object.isFrozen(request.route)); return responseBody(); });
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor(), maximumOutputTokens: 128 });
  const reply = await model.invoke(messages, [], new AbortController().signal, r => { receipts.push(r); });
  assert.equal(f.calls(), 1); assert.equal(reply.content, 'FAB_OK');
  assert.deepEqual(receipts.map(r => r.phase), ['STARTED', 'RESPONSE_HEADERS', 'SUCCEEDED']);
  assert.equal(receipts.at(-1)?.requestId, 'aws-fixture-request-1'); assert.equal(receipts.at(-1)?.responseId, 'msg-fixture-1');
  assert.equal(receipts.at(-1)?.returnedModel, 'claude-sonnet-4-6'); assert.equal(receipts.at(-1)?.usage?.inputTokens, 12);
  assert.equal(reply.usage.cachedTokens, null); assert.equal(reply.usage.reasoningTokens, null); assert.equal(reply.usage.costUsd, null);
  assert.equal(receipts.at(-1)?.costClassification, 'UNKNOWN'); assert.equal(receipts.at(-1)?.bedrockRoute?.inferenceProfileArn, route.inferenceProfileArn);
});

test('missing returned model and usage remain unknown rather than fabricated', async () => {
  const f = fixture(async () => ({ content: [{ type: 'text', text: 'OK' }], stop_reason: 'end_turn' }));
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  const reply = await model.invoke(messages, [], new AbortController().signal);
  assert.equal(reply.returnedModel, null); assert.equal(reply.usage.inputTokens, null); assert.equal(reply.usage.outputTokens, null);
});

test('valid tool arguments survive a complete tool-result continuation', async () => {
  const f = fixture(async () => ({ model: route.modelId, content: [{ type: 'tool_use', id: 'echo_1', name: tool.name, input: { value: 7 } }], stop_reason: 'tool_use', usage: { input_tokens: 12, output_tokens: 3 } }));
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  const reply = await model.invoke(messages, [tool], new AbortController().signal);
  assert.equal(reply.finish, 'tools'); assert.deepEqual(reply.calls[0]?.arguments, { value: 7 });
  const history: Message[] = [...messages, { role: 'assistant', content: reply.content, calls: reply.calls }, { role: 'tool', callId: 'echo_1', content: '7', error: false }];
  assert.doesNotThrow(() => bedrockRequestBody(history, [tool], 128));
});

test('observer refusal and pre-cancellation both prevent broker calls', async () => {
  const f = fixture(); const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  await assert.rejects(model.invoke(messages, [], AbortSignal.abort()));
  await assert.rejects(model.invoke(messages, [], new AbortController().signal, () => { throw new Error('Durable state unavailable'); }));
  assert.equal(f.calls(), 0);
});

test('changed broker after durable intent is rejected before dispatch', async () => {
  let changed = false;
  const f = fixture(undefined, identity => { if (changed) identity.credentialReference = 'replacement'; });
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  await assert.rejects(model.invoke(messages, [], new AbortController().signal, r => { if (r.phase === 'STARTED') changed = true; }), code('BEDROCK_ROUTE'));
  assert.equal(f.calls(), 0);
});

test('in-flight cancellation retains one unknown request and makes no retry', async () => {
  const controller = new AbortController(); const receipts: ProviderRequestReceipt[] = [];
  const f = fixture(async () => { controller.abort(); return new Promise(() => {}); });
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  await assert.rejects(model.invoke(messages, [], controller.signal, r => { receipts.push(r); }), code('PROVIDER_CANCELLED'));
  assert.equal(f.calls(), 1); assert.equal(receipts.at(-1)?.outcome, 'UNKNOWN'); assert.equal(receipts.at(-1)?.retries, 0);
});

test('timeout stops an unresponsive broker with no automatic retry', async () => {
  const f = fixture(async () => new Promise(() => {}));
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor(), timeoutMs: 10 });
  const keepAlive = setInterval(() => {}, 1000);
  try { await assert.rejects(model.invoke(messages, [], new AbortController().signal), code('PROVIDER_TIMEOUT')); }
  finally { clearInterval(keepAlive); }
  assert.equal(f.calls(), 1);
});

test('SDK error text is withheld while classification and zero retries survive', async () => {
  const f = fixture(async () => { const e = new Error('sensitive-credential-fixture-do-not-expose'); e.name = 'ThrottlingException'; throw e; });
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  await assert.rejects(model.invoke(messages, [], new AbortController().signal), e => code('PROVIDER_RATE_LIMIT')(e) && !String(e).includes('sensitive-credential'));
  assert.equal(f.calls(), 1);
});

test('substituted response subject, hidden retries, and missing provider request identity fail closed', async () => {
  for (const delta of [{ requestDigest: 'wrong' }, { attempts: 2 }, { providerRequestId: '' }, { providerRequestId: undefined }, { providerRequestId: null }, { providerRequestId: 123 }]) {
    const f = fixture(); const invoke = f.transport.invoke;
    f.transport.invoke = async (request, signal) => ({ ...await invoke(request, signal), ...delta }) as Awaited<ReturnType<BedrockBrokerTransport['invoke']>>;
    const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
    await assert.rejects(model.invoke(messages, [], new AbortController().signal)); assert.equal(f.calls(), 1);
  }
});

test('unsupported reasoning, wrong returned model, and excessive output usage are rejected', async () => {
  for (const change of [
    () => ({ ...responseBody(), model: 'claude-other' }),
    () => ({ ...responseBody(), content: [{ type: 'thinking', thinking: 'unsupported' }] }),
    () => ({ ...responseBody(), usage: { input_tokens: 12, output_tokens: 129 } }),
  ]) {
    const f = fixture(async () => change()); const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor(), maximumOutputTokens: 128 });
    await assert.rejects(model.invoke(messages, [], new AbortController().signal)); assert.equal(f.calls(), 1);
  }
});

test('oversized requests never reach broker transport', async () => {
  const f = fixture(); const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  await assert.rejects(model.invoke([{ role: 'user', content: 'a'.repeat(200001) }], [], new AbortController().signal), code('CONTEXT_LIMIT'));
  assert.equal(f.calls(), 0);
});

test('policy rejection retains observed model and token usage in failed evidence', async () => {
  for (const raw of [{ ...responseBody(), model: 'claude-other' }, { ...responseBody(), usage: { input_tokens: 12, output_tokens: 129 } }]) {
    const receipts: ProviderRequestReceipt[] = [];
    const f = fixture(async () => raw); const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor(), maximumOutputTokens: 128 });
    await assert.rejects(model.invoke(messages, [], new AbortController().signal, r => { receipts.push(r); }));
    const failed = receipts.at(-1)!;
    assert.equal(failed.phase, 'FAILED'); assert.equal(failed.outcome, 'RESPONSE_RECEIVED');
    assert.equal(failed.returnedModel, raw.model); assert.equal(failed.usage?.outputTokens, raw.usage.output_tokens);
    assert.equal(failed.responseId, 'msg-fixture-1'); assert.equal(failed.requestId, 'aws-fixture-request-1');
  }
});

test('known non-success and malformed complete responses retain response-delivery evidence', async () => {
  for (const delta of [{ httpStatus: 403 }, { body: 'malformed-json' }]) {
    const receipts: ProviderRequestReceipt[] = []; const f = fixture(); const invoke = f.transport.invoke;
    f.transport.invoke = async (request, signal) => ({ ...await invoke(request, signal), ...delta });
    const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
    await assert.rejects(model.invoke(messages, [], new AbortController().signal, r => { receipts.push(r); }));
    assert.equal(receipts.at(-1)?.outcome, 'RESPONSE_RECEIVED'); assert.equal(receipts.at(-1)?.phase, 'FAILED');
  }
});

test('stalled observers obey timeout before dispatch and after a response', async () => {
  const keepAlive = setInterval(() => {}, 1000);
  try {
    for (const phase of ['STARTED', 'RESPONSE_HEADERS', 'SUCCEEDED']) {
      const f = fixture(); const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor(), timeoutMs: 10 });
      await assert.rejects(model.invoke(messages, [], new AbortController().signal, r => r.phase === phase ? new Promise(() => {}) : undefined), code('PROVIDER_TIMEOUT'));
      assert.equal(f.calls(), phase === 'STARTED' ? 0 : 1);
    }
  } finally { clearInterval(keepAlive); }
});

test('cancellation terminates stalled intent observation without a broker call', async () => {
  const controller = new AbortController(); const f = fixture();
  const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  await assert.rejects(model.invoke(messages, [], controller.signal, () => { controller.abort(); return new Promise(() => {}); }), code('PROVIDER_CANCELLED'));
  assert.equal(f.calls(), 0);
});

test('post-response persistence rejection cannot return a successful model result', async () => {
  const f = fixture(); const model = new BedrockModelProvider({ config: config(), transport: f.transport, redactor: new Redactor() });
  await assert.rejects(model.invoke(messages, [], new AbortController().signal, r => {
    if (r.phase === 'RESPONSE_HEADERS') throw new Error('storage failure');
  }), code('PROVIDER_OBSERVATION'));
  assert.equal(f.calls(), 1);
});

test('live qualification uses only the explicit Bedrock broker for all three bounded calls', async () => {
  let calls = 0;
  const transport: BedrockBrokerTransport = {
    identity: () => ({ route: structuredClone(route), credentialReference: 'mc-fixture-broker', maximumAttempts: 1 }),
    invoke: async request => {
      calls++;
      const body = JSON.parse(request.body);
      assert.equal(body.max_tokens, 128);
      const content = calls === 2
        ? [{ type: 'tool_use', id: 'echo_qualification', name: 'qualification_echo', input: { value: 7 } }]
        : [{ type: 'text', text: calls === 1 ? 'FAB_OK' : 'FAB_CONTINUATION_OK' }];
      return {
        requestDigest: request.requestDigest,
        providerRequestId: `aws-qualification-${calls}`,
        httpStatus: 200,
        attempts: 1,
        body: JSON.stringify({ id: `msg-${calls}`, model: 'claude-sonnet-4-6', content,
          stop_reason: calls === 2 ? 'tool_use' : 'end_turn', usage: { input_tokens: 12, output_tokens: 3 } }),
      };
    },
  };
  const credentials = {
    metadata: () => ({ configured: true, reference: 'mc-fixture-broker', storage: 'environment' as const }),
    use: async () => { throw new Error('Bedrock must not request a local credential'); },
  };
  const report = await qualifyProvider({ config: config(), credentials, redactor: new Redactor(), live: true,
    signal: new AbortController().signal, bedrockTransport: transport });
  assert.equal(calls, 3);
  assert.equal(report.status, 'PASS');
  assert.equal(report.transport, 'LIVE');
  assert.equal(report.requestCount, 3);
  assert.deepEqual(report.qualifiedModels, ['claude-sonnet-4-6']);
  assert(report.checks.filter(item => item.mode === 'contract').every(item => item.status === 'PASS'));
});
