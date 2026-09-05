import { createHash } from 'node:crypto';
import path from 'node:path';
import type { FabConfig, JsonObject, Plan, ProviderId } from './types.ts';

export class FabError extends Error {
  readonly code: string;
  constructor(code: string, message: string) { super(message); this.name = 'FabError'; this.code = code; }
}
export function fail(code: string, message: string): never { throw new FabError(code, message); }
export function object(value: unknown): JsonObject {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('INVALID_DATA', 'Expected an object.');
  return value as JsonObject;
}
export function keys(value: JsonObject, allowed: string[]): void {
  if (Object.keys(value).some(key => !allowed.includes(key))) fail('INVALID_DATA', 'Unexpected object field.');
}
export function string(value: unknown, maximum = 16000): string {
  if (typeof value !== 'string' || !value.trim() || value.length > maximum || value.includes('\0')) fail('INVALID_DATA', 'Missing, oversized or invalid text.');
  return value;
}
export function texts(value: unknown, maximum = 50): string[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > maximum) fail('INVALID_DATA', 'Expected a bounded non-empty list.');
  return value.map(item => string(item));
}
export function integer(value: unknown, min: number, max: number): number {
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < min || value > max) fail('INVALID_DATA', 'Numeric limit is invalid.');
  return value;
}
export function providerId(value: unknown): ProviderId {
  if (value !== 'openai' && value !== 'anthropic') fail('INVALID_PROVIDER', 'Select openai or anthropic.');
  return value;
}
export function digest(value: unknown): string {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}
export function contentHash(value: string): string { return createHash('sha256').update(value).digest('hex'); }
export function fileName(value: unknown): string {
  const name = string(value, 500);
  const hasControl = [...name].some(character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127);
  if (path.isAbsolute(name) || name.includes('\\') || hasControl
    || name.split('/').some(part => !part || part === '.' || part === '..') || path.posix.normalize(name) !== name) {
    fail('PATH_DENIED', 'Use a normalized relative repository file path.');
  }
  if (name.split('/').some(part => part.startsWith('.') || /^(node_modules|vendor|coverage|dist|build)$/i.test(part)
    || /(?:secret|credential|id_rsa|id_ed25519)|\.(?:pem|key|p12|pfx|keystore)$/i.test(part))) {
    fail('PATH_DENIED', 'Private, generated and credential paths are unavailable.');
  }
  return name;
}
export function parsePlan(value: unknown): Plan {
  const raw = object(value); keys(raw, ['summary', 'steps']);
  return { summary: string(raw.summary, 4000), steps: texts(raw.steps, 20) };
}
export function parseConfig(value: unknown): FabConfig {
  const raw = object(value);
  keys(raw, ['version', 'repository', 'provider', 'model', 'credential', 'writableFiles', 'checks', 'acceptanceCriteria', 'maxTurns', 'timeoutMs', 'checkTimeoutMs']);
  if (raw.version !== 1) fail('CONFIG_VERSION', 'Configuration must use version 1.');
  const repository = string(raw.repository, 1000);
  if (!path.isAbsolute(repository)) fail('CONFIG_ROOT', 'Configuration repository must be absolute.');
  const provider = providerId(raw.provider);
  const credential = object(raw.credential);
  keys(credential, ['id', 'owner', 'provider', 'scope', 'source']);
  const source = object(credential.source); keys(source, ['kind', 'variable']);
  const scope = object(credential.scope); keys(scope, ['kind', 'root']);
  if (credential.provider !== provider || source.kind !== 'environment' || scope.kind !== 'repository' || scope.root !== repository) fail('CREDENTIAL_SCOPE', 'Credential must match the selected provider and repository.');
  const variable = string(source.variable, 100);
  if (!/^FAB_[A-Z][A-Z0-9_]*$/.test(variable)) fail('CREDENTIAL_SOURCE', 'Choose an explicit FAB_ environment variable; ambient provider keys are not loaded.');
  const id = string(credential.id, 100);
  if (!/^[a-zA-Z0-9:_-]+$/.test(id)) fail('CREDENTIAL_REFERENCE', 'Credential reference is invalid.');
  if (!Array.isArray(raw.checks) || raw.checks.length < 1 || raw.checks.length > 8) fail('CONFIG_CHECKS', 'Configure one to eight fixed project checks.');
  const checks = raw.checks.map(value => {
    const check = object(value); keys(check, ['id', 'argv']);
    const checkId = string(check.id, 60);
    if (!/^[a-zA-Z0-9_-]+$/.test(checkId)) fail('CONFIG_CHECKS', 'Check ID is invalid.');
    const argv = texts(check.argv, 30);
    if (!path.isAbsolute(argv[0]!)) fail('CONFIG_CHECKS', 'Check executable must be an absolute path.');
    return { id: checkId, argv };
  });
  if (new Set(checks.map(check => check.id)).size !== checks.length) fail('CONFIG_CHECKS', 'Check IDs must be unique.');
  const writableFiles = texts(raw.writableFiles, 30).map(fileName);
  if (new Set(writableFiles).size !== writableFiles.length) fail('CONFIG_FILES', 'Writable files must be unique.');
  const model = string(raw.model, 150);
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._:/-]*$/.test(model)) fail('CONFIG_MODEL', 'Model identifier is invalid.');
  return {
    version: 1, repository, provider, model,
    credential: { id, owner: string(credential.owner, 100), provider, scope: { kind: 'repository', root: repository }, source: { kind: 'environment', variable } },
    writableFiles, checks, acceptanceCriteria: texts(raw.acceptanceCriteria, 20),
    maxTurns: integer(raw.maxTurns ?? 16, 1, 50), timeoutMs: integer(raw.timeoutMs ?? 300000, 1000, 900000),
    checkTimeoutMs: integer(raw.checkTimeoutMs ?? 30000, 100, 120000),
  };
}
