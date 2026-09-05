export type ProviderId = 'openai' | 'anthropic';
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
}
export interface ModelReply {
  returnedModel?: string | null;
  content: string; calls: ToolCall[]; usage: Usage;
  finish: 'complete' | 'tools' | 'limited';
}
export interface ModelProvider {
  readonly provider: ProviderId;
  readonly model: string;
  readonly capabilities: { tools: true; streaming: false; reasoningControls: false; contextWindow: null };
  invoke(messages: Message[], tools: ToolDefinition[], signal: AbortSignal): Promise<ModelReply>;
}
export interface CredentialReference {
  id: string; owner: string; provider: ProviderId;
  scope: { kind: 'repository'; root: string };
  source: { kind: 'environment'; variable: string } | { kind: 'keychain' };
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
  version: 1; id: string; config: FabConfig; baseline: string; branch: string;
  task: string; status: SessionStatus; createdAt: string; updatedAt: string;
  plan: Plan | null; approvalDigest: string | null;
  messages: Message[]; events: Event[]; checks: CheckResult[];
  usage: Usage; modelCalls: number; retries: number;
  filesRead: string[]; filesModified: string[];
  candidateDigest: string | null; candidateRevision: null; diff: string;
  summary: string | null; unresolved: string[];
  independent: false; acceptance: 'not_evaluated';
}
