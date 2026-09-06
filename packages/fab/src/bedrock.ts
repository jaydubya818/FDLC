import { randomUUID } from 'node:crypto';
import { Redactor } from './credentials.ts';
import { abortable, parseReply, requestBody } from './models.ts';
import { digest, fail, FabError, integer, object, parseConfig } from './validation.ts';
import type { BedrockRoute, FabConfig, Message, ModelProvider, ModelReply, ObserveProviderRequest, ProviderRequestReceipt, ToolDefinition } from './types.ts';

export interface BedrockBrokerIdentity {
  route: BedrockRoute; credentialReference: string; maximumAttempts: 1;
}
export interface BedrockBrokerRequest {
  requestId: string; requestDigest: string; route: BedrockRoute;
  credentialReference: string; body: string; maximumOutputTokens: number;
}
export interface BedrockBrokerResponse {
  requestDigest: string; providerRequestId: string; httpStatus: number;
  attempts: number; body: string;
}
/** Trusted host boundary. The implementation must verify canonical authority,
 * count exact input, durably reserve liability, and claim once before dispatch.
 * It owns AWS credentials and durable settlement; Fab never receives a secret.
 * This interface or its metadata alone is not evidence of that authorization. */
export interface BedrockBrokerTransport {
  identity(): BedrockBrokerIdentity;
  invoke(request: BedrockBrokerRequest, signal: AbortSignal): Promise<BedrockBrokerResponse>;
}

export function bedrockRequestBody(messages: Message[], tools: ToolDefinition[], maximumOutputTokens: number): string {
  if (!messages.length || messages.length > 500 || tools.length > 30) fail('PROVIDER_REQUEST', 'Bedrock requires bounded message and tool lists.');
  const pending = new Set<string>();
  const seen = new Set<string>();
  const toolNames = new Set(tools.map(tool => tool.name));
  if (toolNames.size !== tools.length) fail('PROVIDER_REQUEST', 'Duplicate tool definitions are invalid.');
  for (const message of messages) {
    if (message.role === 'assistant') {
      if (pending.size) fail('PROVIDER_REQUEST', 'Unresolved tool calls cannot be replaced by another assistant turn.');
      for (const call of message.calls) {
        if (seen.has(call.id) || !/^[A-Za-z0-9_-]{1,150}$/.test(call.id) || !/^[a-z_]{1,60}$/.test(call.name)) fail('PROVIDER_REQUEST', 'Tool history contains duplicate or invalid identifiers.');
        seen.add(call.id); pending.add(call.id);
      }
    } else if (message.role === 'tool') {
      if (!pending.delete(message.callId)) fail('PROVIDER_REQUEST', 'Tool result has no matching pending call.');
    } else if (pending.size) fail('PROVIDER_REQUEST', 'Tool results must precede the next user turn.');
  }
  if (pending.size) fail('PROVIDER_REQUEST', 'All tool calls require results before inference.');
  const body = requestBody('anthropic', 'anthropic.claude-sonnet-4-6', messages, tools, maximumOutputTokens);
  delete body.model; delete body.stream;
  // Only the Anthropic text/tool subset is serialized. No passthrough AWS fields,
  // caching, extended thinking, service tiers, streaming, or model fallbacks.
  body.anthropic_version = 'bedrock-2023-05-31';
  const serialized = JSON.stringify(body);
  if (Buffer.byteLength(serialized) > 200000) fail('CONTEXT_LIMIT', 'Bedrock request exceeds the bounded context byte limit.');
  return serialized;
}

/** Credential-free native Bedrock protocol adapter. A host-supplied broker is
 * mandatory; there is no SDK, ambient AWS credential chain, shell, or HTTP path. */
export class BedrockModelProvider implements ModelProvider {
  readonly provider = 'bedrock' as const;
  readonly model = 'anthropic.claude-sonnet-4-6';
  readonly capabilities = { tools: true, streaming: false, reasoningControls: false, contextWindow: null } as const;
  #config: FabConfig;
  #transport: BedrockBrokerTransport;
  #redactor: Redactor;
  #maximumOutputTokens: number;
  #timeoutMs: number;
  constructor(input: { config: FabConfig; transport: BedrockBrokerTransport; redactor: Redactor; maximumOutputTokens?: number; timeoutMs?: number }) {
    this.#config = parseConfig(structuredClone(input.config));
    if (this.#config.provider !== 'bedrock' || !this.#config.bedrockRoute || this.#config.credential.source.kind !== 'broker') fail('BEDROCK_ROUTE', 'Bedrock requires an exact broker-bound configuration.');
    this.#transport = input.transport;
    this.#redactor = input.redactor;
    this.#maximumOutputTokens = integer(input.maximumOutputTokens ?? 1024, 1, 4096);
    this.#timeoutMs = integer(input.timeoutMs ?? 60000, 1, 60000);
    this.#assertIdentity();
  }
  #assertIdentity() {
    const identity = this.#transport.identity();
    if (identity.maximumAttempts !== 1 || identity.credentialReference !== this.#config.credential.id
      || digest(identity.route) !== digest(this.#config.bedrockRoute)) fail('BEDROCK_ROUTE', 'Broker identity, profile, or retry policy differs from the frozen Fab configuration.');
  }
  async invoke(messages: Message[], tools: ToolDefinition[], signal: AbortSignal, observe?: ObserveProviderRequest): Promise<ModelReply> {
    signal.throwIfAborted(); this.#assertIdentity();
    const body = bedrockRequestBody(this.#redactor.value(messages), this.#redactor.value(tools), this.#maximumOutputTokens);
    const route = Object.freeze(structuredClone(this.#config.bedrockRoute!));
    const requestId = randomUUID();
    const requestDigest = digest({ route, credentialReference: this.#config.credential.id, body });
    const request: BedrockBrokerRequest = Object.freeze({ requestId, requestDigest, route,
      credentialReference: this.#config.credential.id, body, maximumOutputTokens: this.#maximumOutputTokens });
    const started = Date.now();
    const deadline = AbortSignal.any([signal, AbortSignal.timeout(this.#timeoutMs)]);
    const receipt: ProviderRequestReceipt = {
      version: 1, localRequestId: requestId, provider: 'bedrock', requestedModel: this.model,
      endpoint: 'https://bedrock-runtime.us-east-1.amazonaws.com', protocol: 'bedrock-invoke-model/anthropic-messages/bedrock-2023-05-31',
      credentialReference: request.credentialReference, startedAt: new Date(started).toISOString(), completedAt: null, latencyMs: 0,
      phase: 'STARTED', outcome: 'UNKNOWN', inputBytes: Buffer.byteLength(body), maximumOutputTokens: this.#maximumOutputTokens,
      retries: 0, httpStatus: null, requestId: null, responseId: null, returnedModel: null, usage: null, costClassification: 'UNKNOWN', errorCode: null,
      bedrockRoute: structuredClone(route), requestDigest,
    };
    const publish = async () => {
      receipt.latencyMs = Date.now() - started;
      try { await abortable(Promise.resolve(observe?.(this.#redactor.value(receipt))), deadline); }
      catch { throw new FabError('PROVIDER_OBSERVATION', 'Durable provider observation did not complete.'); }
    };
    try {
      // A failed durable observer prevents broker dispatch. No receipt grants authority.
      await publish();
      deadline.throwIfAborted(); this.#assertIdentity();
      const response = await abortable(this.#transport.invoke(request, deadline), deadline);
      deadline.throwIfAborted(); this.#assertIdentity();
      if (response.requestDigest !== requestDigest || response.attempts !== 1) fail('PROVIDER_BROKER_BINDING', 'Broker response has a different request or unqualified retry count.');
      if (typeof response.providerRequestId !== 'string' || !/^[A-Za-z0-9_.:-]{1,200}$/.test(response.providerRequestId)) fail('PROVIDER_RESPONSE', 'Provider request identity is missing or invalid.');
      receipt.requestId = response.providerRequestId;
      receipt.httpStatus = integer(response.httpStatus, 100, 599);
      receipt.outcome = 'RESPONSE_RECEIVED';
      receipt.phase = 'RESPONSE_HEADERS';
      await publish();
      if (receipt.httpStatus !== 200) fail('PROVIDER_HTTP', 'Bedrock returned a non-success HTTP status; no retry was made.');
      if (typeof response.body !== 'string' || Buffer.byteLength(response.body) > 1000000) fail('PROVIDER_RESPONSE', 'Bedrock response exceeds the byte limit.');
      const raw: unknown = JSON.parse(response.body);
      const reply = this.#redactor.value(parseReply('anthropic', raw));
      const responseId = object(raw).id;
      receipt.responseId = typeof responseId === 'string' && /^[A-Za-z0-9_.:-]{1,200}$/.test(responseId) ? responseId : null;
      receipt.returnedModel = reply.returnedModel ?? null;
      receipt.usage = reply.usage;
      // Observed identity/usage survive policy rejection; rejection cannot erase liability.
      if (reply.returnedModel && !['anthropic.claude-sonnet-4-6', 'claude-sonnet-4-6'].includes(reply.returnedModel)) fail('PROVIDER_MODEL', 'Bedrock returned a model outside the exact Sonnet 4.6 route.');
      if (reply.usage.outputTokens !== null && reply.usage.outputTokens > this.#maximumOutputTokens) fail('PROVIDER_BUDGET', 'Provider output usage exceeded its request ceiling.');
      receipt.phase = 'SUCCEEDED'; receipt.completedAt = new Date().toISOString();
      await publish();
      return reply;
    } catch (error) {
      const code = deadline.aborted ? (signal.aborted ? 'PROVIDER_CANCELLED' : 'PROVIDER_TIMEOUT') : bedrockErrorCode(error);
      receipt.phase = 'FAILED'; receipt.completedAt = new Date().toISOString(); receipt.errorCode = code;
      // Failure evidence is best effort within the same deadline. Storage failure
      // cannot hang cancellation, authorize another call, or erase the failure.
      try { await publish(); } catch { /* The caller still receives the safe failure. */ }
      // Broker/provider exceptions may contain request, credential, or response text.
      throw new FabError(code, 'Bedrock request stopped; inspect safe broker evidence. No automatic retry was made.');
    }
  }
}

export function bedrockErrorCode(error: unknown): string {
  if (error instanceof FabError && ['BEDROCK_ROUTE', 'PROVIDER_BROKER_BINDING', 'PROVIDER_RESPONSE', 'PROVIDER_HTTP', 'PROVIDER_MODEL', 'PROVIDER_BUDGET', 'PROVIDER_REFUSAL', 'PROVIDER_OBSERVATION'].includes(error.code)) return error.code;
  const name = error instanceof Error ? error.name : '';
  const codes: Record<string, string> = {
    AccessDeniedException: 'PROVIDER_AUTHORIZATION', UnrecognizedClientException: 'PROVIDER_AUTHENTICATION',
    ExpiredTokenException: 'PROVIDER_AUTHENTICATION', ThrottlingException: 'PROVIDER_RATE_LIMIT',
    ModelNotReadyException: 'PROVIDER_NOT_READY', ModelTimeoutException: 'PROVIDER_TIMEOUT',
    ServiceUnavailableException: 'PROVIDER_UNAVAILABLE', InternalServerException: 'PROVIDER_UNAVAILABLE',
    ValidationException: 'PROVIDER_REQUEST', ResourceNotFoundException: 'PROVIDER_ROUTE',
  };
  return codes[name] ?? 'PROVIDER_BROKER';
}
