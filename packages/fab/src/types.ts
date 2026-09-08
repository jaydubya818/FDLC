export type ProviderId = 'openai' | 'anthropic' | 'openrouter' | 'bedrock';
export interface BedrockRoute {
  accountId: string; region: 'us-east-1'; modelId: 'anthropic.claude-sonnet-4-6';
  inferenceProfileId: 'us.anthropic.claude-sonnet-4-6'; inferenceProfileArn: string;
}
export type JsonObject = Record<string, unknown>;
export interface ToolCall { id: string; name: string; arguments: JsonObject }
export type Message =
  | { role: 'user'; content: string }
  | { role: 'assistant'; content: string; calls: ToolCall[] }
  | { role: 'tool'; content: string; callId: string; error: boolean };
export interface ToolDefinition { name: string; description: string; parameters: JsonObject }
export interface Usage {
  inputTokens: number | null; outputTokens: number | null;
  cachedTokens: number | null; costUsd: number | null;
  cacheWriteTokens?: number | null; reasoningTokens?: number | null;
}
/** Bounded metadata only. A STARTED receipt is uncertain until a terminal receipt is durable. */
export interface ProviderRequestReceipt {
  version: 1; localRequestId: string; provider: ProviderId; requestedModel: string;
  endpoint: string; protocol: string; credentialReference: string;
  startedAt: string; completedAt: string | null; latencyMs: number;
  phase: 'STARTED' | 'RESPONSE_HEADERS' | 'SUCCEEDED' | 'FAILED';
  outcome: 'UNKNOWN' | 'RESPONSE_RECEIVED';
  inputBytes: number; maximumOutputTokens: number; retries: 0;
  httpStatus: number | null; requestId: string | null; responseId: string | null;
  returnedModel: string | null; usage: Usage | null; costClassification: 'ACTUAL' | 'UNKNOWN'; errorCode: string | null;
  upstreamProvider?: string | null;
  /** Exact routing observation, not a grant or fabricated provider-returned model. */
  bedrockRoute?: BedrockRoute; requestDigest?: string;
}
export type ObserveProviderRequest = (receipt: ProviderRequestReceipt) => Promise<void> | void;
export interface ModelReply {
  returnedModel?: string | null;
  upstreamProvider?: string | null;
  content: string; calls: ToolCall[]; usage: Usage;
  finish: 'complete' | 'tools' | 'limited';
}
export interface ModelProvider {
  readonly provider: ProviderId;
  readonly model: string;
  readonly capabilities: { tools: true; streaming: false; reasoningControls: false; contextWindow: null };
  invoke(messages: Message[], tools: ToolDefinition[], signal: AbortSignal, observe?: ObserveProviderRequest): Promise<ModelReply>;
}
export interface CredentialReference {
  id: string; owner: string; provider: ProviderId;
  scope: { kind: 'repository'; root: string };
  source: { kind: 'environment'; variable: string } | { kind: 'keychain' } | { kind: 'broker' };
}
export interface CredentialMetadata { reference: string; configured: boolean; storage: 'environment' | 'keychain' }
export interface CredentialStore {
  set(reference: CredentialReference, secret: string): Promise<void>;
  get(reference: CredentialReference): Promise<string | null>;
  delete(reference: CredentialReference): Promise<void>;
  has(reference: CredentialReference): Promise<boolean>;
  listMetadata(): Promise<CredentialReference[]>;
}
export interface CredentialProvider {
  metadata(): CredentialMetadata;
  use<T>(reference: CredentialReference, operation: (value: string) => Promise<T>): Promise<T>;
}
export interface CheckDefinition { id: string; argv: string[] }
export interface FabConfig {
  version: 1; repository: string; provider: ProviderId; model: string;
  credential: CredentialReference;
  bedrockRoute?: BedrockRoute;
  writableFiles: string[]; checks: CheckDefinition[];
  acceptanceCriteria: string[];
  maxTurns: number; timeoutMs: number; checkTimeoutMs: number;
}
export interface Plan { summary: string; steps: string[] }
export type SessionStatus = 'planning' | 'awaiting_approval' | 'executing' | 'candidate' | 'failed' | 'blocked' | 'cancelled';
export interface CheckResult {
  id: string; argv: string[]; candidateDigest: string;
  status: 'passed' | 'failed' | 'blocked' | 'cancelled' | 'timed_out';
  exitCode: number | null; signal: string | null;
  stdout: string; stderr: string; durationMs: number;
  isolation: 'macos-seatbelt-snapshot'; independent: false;
}
export interface Event {
  sequence: number; at: string; kind: string; data: unknown;
}
export interface Session {
  governed?: GovernedLinkage;
  version: 1; id: string; config: FabConfig; baseline: string; branch: string;
  task: string; status: SessionStatus; createdAt: string; updatedAt: string;
  plan: Plan | null; approvalDigest: string | null;
  messages: Message[]; events: Event[]; checks: CheckResult[];
  usage: Usage; modelCalls: number; retries: number;
  filesRead: string[]; filesModified: string[];
  candidateDigest: string | null; candidateRevision: string | null; diff: string;
  summary: string | null; unresolved: string[];
  independent: false; acceptance: 'not_evaluated';
}
/** Observation linkage supplied by MC; this record grants no authority. */
export interface GovernedLinkage {
  workOrderId: string; attemptId: string; executionId: string; executorIdentity: string;
  environmentReference: string; credentialReference: string; sourceRevision: string;
  candidateRevision: string | null; startedAt: string; completedAt: string | null;
}
