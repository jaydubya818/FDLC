import type { CredentialProvider, FabConfig, Message, ModelReply, ObserveProviderRequest, ProviderRequestReceipt, ToolDefinition, Usage } from './types.ts';
import { HttpModelProvider, addUsage, providerProtocol } from './models.ts';
import { BedrockModelProvider, type BedrockBrokerRequest, type BedrockBrokerResponse, type BedrockBrokerTransport } from './bedrock.ts';
import { EnvironmentCredentialProvider, Redactor } from './credentials.ts';
import { FabError } from './validation.ts';

export interface QualificationCheck { name: string; status: 'PASS' | 'FAIL' | 'NOT RUN'; mode: 'live' | 'contract' | 'unsupported'; detail: string }
export interface QualificationReport {
  version: 1; maturity: 'Experimental'; provider: string; requestedModel: string; returnedModels: string[];
  credentialReference: string; startedAt: string; completedAt: string; latencyMs: number; usage: Usage;
  status: 'PASS' | 'FAIL' | 'NOT RUN'; checks: QualificationCheck[]; limitations: string[];
  transport: 'LIVE' | 'INJECTED'; endpoint: string; protocol: string; qualifiedModels: string[];
  requests: ProviderRequestReceipt[]; requestCount: number; maximumRequests: 3; retries: 0; maximumOutputTokensPerRequest: 128;
  costClassification: 'ACTUAL' | 'UNKNOWN'; contextLimit: { kind: 'CONFIGURED_UTF8_BYTES'; maximum: 200000 };
  usageSemantics: string;
}
const LIVE_CHECKS = ['authentication', 'basic inference', 'structured tool arguments', 'tool calling', 'tool-result continuation', 'model identity', 'usage reporting'];
const PROBE: ToolDefinition = { name: 'qualification_echo', description: 'Return the integer 7 in value to qualify this tool protocol.', parameters: { type: 'object', properties: { value: { type: 'integer', enum: [7] } }, required: ['value'], additionalProperties: false } };

/** Network is possible only when the caller explicitly selects live. Normal tests inject transport. */
export async function qualifyProvider(input: { config: FabConfig; credentials: CredentialProvider; redactor: Redactor; live: boolean; signal: AbortSignal; fetchImpl?: typeof fetch; bedrockTransport?: BedrockBrokerTransport; observe?: ObserveProviderRequest }): Promise<QualificationReport> {
  const started = Date.now(); const { config, credentials, redactor } = input;
  if (config.provider === 'bedrock' ? !input.bedrockTransport || input.fetchImpl : Boolean(input.bedrockTransport)) {
    throw new FabError('BROKER_REQUIRED', 'Bedrock qualification requires exactly one host-supplied broker transport.');
  }
  const protocol = config.provider === 'bedrock'
    ? { endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com', protocol: 'bedrock-invoke-model/anthropic-messages/bedrock-2023-05-31' }
    : providerProtocol(config.provider);
  const report: QualificationReport = { version: 1, maturity: 'Experimental', provider: config.provider, requestedModel: config.model, returnedModels: [], credentialReference: config.credential.id,
    transport: input.fetchImpl ? 'INJECTED' : 'LIVE', ...protocol, qualifiedModels: [], requests: [], requestCount: 0, maximumRequests: 3, retries: 0, maximumOutputTokensPerRequest: 128,
    costClassification: 'UNKNOWN', contextLimit: { kind: 'CONFIGURED_UTF8_BYTES', maximum: 200000 },
    usageSemantics: config.provider === 'openai' || config.provider === 'openrouter' ? 'Input includes cache reads; output includes reasoning tokens when reported. OpenRouter provider-reported cost is preserved when present; missing values remain null.' : 'Input excludes separately reported cache reads and cache writes. Reasoning tokens are not separately exposed by this adapter. Missing values remain null.',
    startedAt: new Date(started).toISOString(), completedAt: '', latencyMs: 0, usage: { inputTokens: null, outputTokens: null, cachedTokens: null, costUsd: null }, status: 'NOT RUN', checks: [],
    limitations: ['No automatic provider/model fallback or retry.', 'This is protocol qualification, not autonomous engineering quality or production certification.', 'Token streaming and reasoning controls are unsupported; context window and cost remain unknown.', 'Provider error, cancellation, timeout and context limits are fault-injected contract tests; they do not deliberately spend on failing live requests.'] };
  const check = (name: string, pass: boolean, mode: QualificationCheck['mode'], detail = '') => report.checks.push({ name, status: pass ? 'PASS' : 'FAIL', mode, detail });
  if (!input.live || !credentials.metadata().configured) {
    for (const name of LIVE_CHECKS) report.checks.push({ name, status: 'NOT RUN', mode: 'live', detail: !credentials.metadata().configured ? 'NOT RUN — USER CREDENTIAL REQUIRED' : 'Explicit --live invocation required.' });
  } else if (/(^|[-_:])latest($|[-_:])/i.test(config.model)) {
    check('model identity', false, 'live', 'An exact configured model is required; latest aliases are prohibited. No provider call was made.');
    report.status = 'FAIL';
  } else {
    const reserveRequest = () => {
      if (report.requestCount >= report.maximumRequests) throw new FabError('PROVIDER_BUDGET', 'Qualification call budget exhausted.');
      report.requestCount++;
    };
    const model = config.provider === 'bedrock'
      ? new BedrockModelProvider({ config, redactor, maximumOutputTokens: 128, transport: {
          identity: () => input.bedrockTransport!.identity(),
          invoke: async (request, signal) => { reserveRequest(); return await input.bedrockTransport!.invoke(request, signal); },
        } })
      : new HttpModelProvider({ provider: config.provider, model: config.model, credentials, reference: config.credential, redactor, maximumOutputTokens: 128,
          fetchImpl: async (...args) => { reserveRequest(); return (input.fetchImpl ?? fetch)(...args); } });
    let requests = 0;
    const invoke = async (messages: Message[], tools: ToolDefinition[]): Promise<ModelReply> => {
      const reply = await model.invoke(messages, tools, input.signal, async receipt => {
        const index = report.requests.findIndex(item => item.localRequestId === receipt.localRequestId);
        if (index < 0) report.requests.push(receipt); else report.requests[index] = receipt;
        await input.observe?.(receipt);
      });
      report.usage = addUsage(report.usage, reply.usage, requests++ === 0);
      report.costClassification = report.usage.costUsd === null ? 'UNKNOWN' : 'ACTUAL';
      if (reply.returnedModel && !report.returnedModels.includes(reply.returnedModel)) report.returnedModels.push(reply.returnedModel);
      return reply;
    };
    try {
      const basic = await invoke([{ role: 'user', content: 'This is a minimal provider qualification. Reply with FAB_OK. Do not use tools.' }], []);
      check('authentication', true, 'live', 'Provider accepted the explicitly bound credential.');
      check('basic inference', basic.finish === 'complete' && basic.content.includes('FAB_OK'), 'live');
      const messages: Message[] = [{ role: 'user', content: 'Call qualification_echo exactly once with value 7. This is the complete task; do not inspect any repository.' }];
      const tools = await invoke(messages, [PROBE]);
      const call = tools.calls[0];
      const valid = tools.calls.length === 1 && call?.name === PROBE.name && call.arguments.value === 7 && Object.keys(call.arguments).length === 1;
      check('structured tool arguments', valid, 'live', 'JSON tool arguments validated locally; native JSON-schema response mode is not implemented.');
      check('tool calling', valid, 'live');
      if (valid && call) {
        messages.push({ role: 'assistant', content: tools.content, calls: tools.calls }, { role: 'tool', callId: call.id, content: '{"result":"FAB_CONTINUATION_OK"}', error: false }, { role: 'user', content: 'Reply with the exact result string from the tool, without another tool call.' });
        const continued = await invoke(messages, [PROBE]);
        check('tool-result continuation', continued.finish === 'complete' && continued.content.includes('FAB_CONTINUATION_OK'), 'live');
      } else check('tool-result continuation', false, 'live', 'No valid tool call to continue.');
      check('model identity', report.returnedModels.length > 0, 'live', 'Requested ID was sent unchanged; returned IDs recorded separately because providers may resolve aliases.');
      check('usage reporting', report.usage.inputTokens !== null && report.usage.outputTokens !== null, 'live', report.costClassification === 'ACTUAL' ? 'Provider-reported cost is recorded as actual.' : 'Cost is unknown; missing cache counts stay null.');
    } catch (error) {
      for (const name of LIVE_CHECKS) if (!report.checks.some(item => item.name === name)) check(name, false, 'live', error instanceof FabError ? error.code : 'REQUEST_STOPPED');
    }
    report.status = report.checks.some(item => item.status === 'FAIL') ? 'FAIL' : 'PASS';
    if (report.status === 'PASS' && report.transport === 'LIVE') report.qualifiedModels = [...report.returnedModels];
  }
  for (const name of ['token streaming', 'reasoning controls', 'provider context-window discovery', 'native structured-response mode']) report.checks.push({ name, status: 'NOT RUN', mode: 'unsupported', detail: 'Not implemented; no support claim.' });
  report.checks.push(...await qualifyContracts(config));
  if (report.checks.some(item => item.status === 'FAIL')) report.status = 'FAIL';
  report.completedAt = new Date().toISOString(); report.latencyMs = Date.now() - started;
  return redactor.value(report);
}

/** Faults use a separate synthetic credential and transport, never the enrolled key or network. */
async function qualifyContracts(config: FabConfig): Promise<QualificationCheck[]> {
  if (config.provider === 'bedrock') return qualifyBedrockContracts(config);
  const redactor = new Redactor(); const key = 'qualification-non-secret-fixture-729105';
  const reference = { ...config.credential, id: 'qualification-fixture', source: { kind: 'environment' as const, variable: 'FAB_QUALIFICATION_FIXTURE' } };
  const credentials = new EnvironmentCredentialProvider(reference, redactor, { FAB_QUALIFICATION_FIXTURE: key });
  const checks: QualificationCheck[] = [];
  const model = (fetchImpl: typeof fetch, timeoutMs = 60000) => new HttpModelProvider({ provider: config.provider, model: config.model, credentials, reference, redactor, fetchImpl, timeoutMs });
  const exercise = async (name: string, run: () => Promise<boolean>) => {
    let pass = false; try { pass = await run(); } catch { /* Failure is recorded without exception content. */ }
    checks.push({ name, status: pass ? 'PASS' : 'FAIL', mode: 'contract', detail: 'Synthetic credential and fault-injected transport; no live provider request.' });
  };
  const rejectsSafely = async (operation: Promise<unknown>) => { try { await operation; return false; } catch (error) { return !JSON.stringify(redactor.value(error)).includes(key); } };
  await exercise('provider error redaction', async () => rejectsSafely(model(async () => new Response(key, { status: 401 })).invoke([], [], new AbortController().signal)));
  await exercise('transport exception redaction', async () => rejectsSafely(model(async () => { throw new Error(key, { cause: new Error(key) }); }).invoke([], [], new AbortController().signal)));
  await exercise('cancellation before inference', async () => {
    let called = false; const rejected = await rejectsSafely(model(async () => { called = true; throw new Error('Unexpected invocation'); }).invoke([], [], AbortSignal.abort())); return rejected && !called;
  });
  await exercise('request timeout', async () => {
    const keepAlive = setInterval(() => {}, 1000);
    try { return await rejectsSafely(model(async () => new Promise(() => {}), 10).invoke([], [], new AbortController().signal)); }
    finally { clearInterval(keepAlive); }
  });
  await exercise('rate limit with zero automatic retries', async () => {
    let calls = 0;
    try { await model(async () => { calls++; return new Response(key, { status: 429 }); }).invoke([], [], new AbortController().signal); }
    catch (error) { return calls === 1 && error instanceof FabError && error.code === 'PROVIDER_RATE_LIMIT'; }
    return false;
  });
  await exercise('malformed response with zero automatic retries', async () => {
    let calls = 0;
    const rejected = await rejectsSafely(model(async () => { calls++; return new Response('not-json'); }).invoke([], [], new AbortController().signal));
    return rejected && calls === 1;
  });
  await exercise('in-flight cancellation with zero automatic retries', async () => {
    let calls = 0; const controller = new AbortController();
    const rejected = await rejectsSafely(model(async () => { calls++; controller.abort(); return new Promise(() => {}); }).invoke([], [], controller.signal));
    return rejected && calls === 1;
  });
  await exercise('context byte budget', async () => {
    let called = false; const rejected = await rejectsSafely(model(async () => { called = true; throw new Error('Unexpected invocation'); }).invoke([{ role: 'user', content: 'x'.repeat(210000) }], [], new AbortController().signal)); return rejected && !called;
  });
  await exercise('evidence and partial-echo redaction', async () => {
    const variants = [key, key.slice(0, 8), key.slice(-8), Buffer.from(key).toString('base64')];
    const serialized = JSON.stringify(redactor.value({ stdout: variants, stderr: variants, trace: variants, error: new Error(key) }));
    return variants.every(value => !serialized.includes(value));
  });
  return checks;
}

async function qualifyBedrockContracts(config: FabConfig): Promise<QualificationCheck[]> {
  const redactor = new Redactor(); const secret = 'qualification-non-secret-fixture-729105'; redactor.register(secret);
  const checks: QualificationCheck[] = [];
  const exercise = async (name: string, run: () => Promise<boolean>) => {
    let pass = false; try { pass = await run(); } catch { /* Safe failure becomes a failed contract check. */ }
    checks.push({ name, status: pass ? 'PASS' : 'FAIL', mode: 'contract', detail: 'Synthetic broker and fault-injected transport; no live provider request.' });
  };
  const response = { id: 'msg-contract', model: 'claude-sonnet-4-6', content: [{ type: 'text', text: 'FAB_OK' }], stop_reason: 'end_turn', usage: { input_tokens: 3, output_tokens: 2 } };
  const model = (invoke: (request: BedrockBrokerRequest, signal: AbortSignal) => Promise<BedrockBrokerResponse>, timeoutMs = 60000) => new BedrockModelProvider({
    config, redactor, timeoutMs, transport: { identity: () => ({ route: structuredClone(config.bedrockRoute!), credentialReference: config.credential.id, maximumAttempts: 1 }), invoke },
  });
  const rejectedSafely = async (operation: Promise<unknown>) => { try { await operation; return false; } catch (error) { return !JSON.stringify(redactor.value(error)).includes(secret); } };
  const success = (request: BedrockBrokerRequest) => ({ requestDigest: request.requestDigest, providerRequestId: 'aws-contract-request', httpStatus: 200, attempts: 1, body: JSON.stringify(response) });
  await exercise('provider error redaction', async () => rejectedSafely(model(async request => ({ ...success(request), httpStatus: 401, body: secret })).invoke([{ role: 'user', content: 'probe' }], [], new AbortController().signal)));
  await exercise('transport exception redaction', async () => rejectedSafely(model(async () => { throw new Error(secret); }).invoke([{ role: 'user', content: 'probe' }], [], new AbortController().signal)));
  await exercise('cancellation before inference', async () => { let calls = 0; const rejected = await rejectedSafely(model(async request => { calls++; return success(request); }).invoke([{ role: 'user', content: 'probe' }], [], AbortSignal.abort())); return rejected && calls === 0; });
  await exercise('request timeout', async () => { const keepAlive = setInterval(() => {}, 1000); try { return await rejectedSafely(model(async () => new Promise(() => {}), 10).invoke([{ role: 'user', content: 'probe' }], [], new AbortController().signal)); } finally { clearInterval(keepAlive); } });
  await exercise('rate limit with zero automatic retries', async () => { let calls = 0; try { await model(async () => { calls++; const error = new Error(secret); error.name = 'ThrottlingException'; throw error; }).invoke([{ role: 'user', content: 'probe' }], [], new AbortController().signal); } catch (error) { return calls === 1 && error instanceof FabError && error.code === 'PROVIDER_RATE_LIMIT'; } return false; });
  await exercise('malformed response with zero automatic retries', async () => { let calls = 0; const rejected = await rejectedSafely(model(async request => { calls++; return { ...success(request), body: 'not-json' }; }).invoke([{ role: 'user', content: 'probe' }], [], new AbortController().signal)); return rejected && calls === 1; });
  await exercise('in-flight cancellation with zero automatic retries', async () => { let calls = 0; const controller = new AbortController(); const rejected = await rejectedSafely(model(async () => { calls++; controller.abort(); return new Promise(() => {}); }).invoke([{ role: 'user', content: 'probe' }], [], controller.signal)); return rejected && calls === 1; });
  await exercise('context byte budget', async () => { let calls = 0; const rejected = await rejectedSafely(model(async request => { calls++; return success(request); }).invoke([{ role: 'user', content: 'x'.repeat(210000) }], [], new AbortController().signal)); return rejected && calls === 0; });
  await exercise('evidence and partial-echo redaction', async () => { const variants = [secret, secret.slice(0, 8), secret.slice(-8), Buffer.from(secret).toString('base64')]; const serialized = JSON.stringify(redactor.value({ values: variants, error: new Error(secret) })); return variants.every(value => !serialized.includes(value)); });
  return checks;
}
