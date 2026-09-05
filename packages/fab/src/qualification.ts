import type { CredentialProvider, FabConfig, Message, ModelReply, ToolDefinition, Usage } from './types.ts';
import { HttpModelProvider, addUsage } from './models.ts';
import { Redactor } from './credentials.ts';
import { FabError } from './validation.ts';

export interface QualificationCheck { name: string; status: 'PASS' | 'FAIL' | 'NOT RUN'; mode: 'live' | 'contract' | 'unsupported'; detail: string }
export interface QualificationReport {
  version: 1; maturity: 'Experimental'; provider: string; requestedModel: string; returnedModels: string[];
  credentialReference: string; startedAt: string; completedAt: string; latencyMs: number; usage: Usage;
  status: 'PASS' | 'FAIL' | 'NOT RUN'; checks: QualificationCheck[]; limitations: string[];
}
const LIVE_CHECKS = ['authentication', 'basic inference', 'structured tool arguments', 'tool calling', 'tool-result continuation', 'model identity', 'usage reporting'];
const PROBE: ToolDefinition = { name: 'qualification_echo', description: 'Return the integer 7 in value to qualify this tool protocol.', parameters: { type: 'object', properties: { value: { type: 'integer', enum: [7] } }, required: ['value'], additionalProperties: false } };

/** Network is possible only when the caller explicitly selects live. Normal tests inject transport. */
export async function qualifyProvider(input: { config: FabConfig; credentials: CredentialProvider; redactor: Redactor; live: boolean; signal: AbortSignal; fetchImpl?: typeof fetch }): Promise<QualificationReport> {
  const started = Date.now(); const { config, credentials, redactor } = input;
  const report: QualificationReport = { version: 1, maturity: 'Experimental', provider: config.provider, requestedModel: config.model, returnedModels: [], credentialReference: config.credential.id,
    startedAt: new Date(started).toISOString(), completedAt: '', latencyMs: 0, usage: { inputTokens: null, outputTokens: null, cachedTokens: null, costUsd: null }, status: 'NOT RUN', checks: [],
    limitations: ['No automatic provider/model fallback or retry.', 'This is protocol qualification, not autonomous engineering quality or production certification.', 'Token streaming and reasoning controls are unsupported; context window and cost remain unknown.', 'Provider error, cancellation, timeout and context limits are fault-injected contract tests; they do not deliberately spend on failing live requests.'] };
  const check = (name: string, pass: boolean, mode: QualificationCheck['mode'], detail = '') => report.checks.push({ name, status: pass ? 'PASS' : 'FAIL', mode, detail });
  if (!input.live || !credentials.metadata().configured) {
    for (const name of LIVE_CHECKS) report.checks.push({ name, status: 'NOT RUN', mode: 'live', detail: !credentials.metadata().configured ? 'NOT RUN — USER CREDENTIAL REQUIRED' : 'Explicit --live invocation required.' });
  } else {
    const model = new HttpModelProvider({ provider: config.provider, model: config.model, credentials, reference: config.credential, redactor, fetchImpl: input.fetchImpl });
    let requests = 0;
    const invoke = async (messages: Message[], tools: ToolDefinition[]): Promise<ModelReply> => {
      const reply = await model.invoke(messages, tools, input.signal);
      report.usage = addUsage(report.usage, reply.usage, requests++ === 0);
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
      check('usage reporting', report.usage.inputTokens !== null && report.usage.outputTokens !== null, 'live', 'Cost is unknown; missing cache counts stay null.');
    } catch (error) {
      for (const name of LIVE_CHECKS) if (!report.checks.some(item => item.name === name)) check(name, false, 'live', error instanceof FabError ? error.code : 'REQUEST_STOPPED');
    }
    report.status = report.checks.some(item => item.status === 'FAIL') ? 'FAIL' : 'PASS';
  }
  for (const name of ['token streaming', 'reasoning controls', 'provider context-window discovery', 'native structured-response mode']) report.checks.push({ name, status: 'NOT RUN', mode: 'unsupported', detail: 'Not implemented; no support claim.' });
  report.completedAt = new Date().toISOString(); report.latencyMs = Date.now() - started;
  return redactor.value(report);
}
