import { execFile } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import type { CredentialReference, CredentialStore } from './types.ts';
import { Redactor } from './credentials.ts';
import { digest, fail, object } from './validation.ts';

export type KeychainBridge = (request: Record<string, unknown>) => Promise<unknown>;

const nativeBridge: KeychainBridge = request => new Promise((resolve, reject) => {
  if (process.platform !== 'darwin') return reject(new Error('Unsupported secure store.'));
  const child = execFile(fileURLToPath(new URL('./fab-keychain', import.meta.url)), [], {
    encoding: 'utf8', maxBuffer: 1000000, timeout: 30000, env: { PATH: '/usr/bin:/bin', HOME: '/nonexistent' },
  }, (error, stdout) => {
    if (error) return reject(new Error('Secure store bridge unavailable.'));
    try { resolve(JSON.parse(stdout)); } catch { reject(new Error('Secure store bridge response invalid.')); }
  });
  child.stdin?.on('error', () => {});
  child.stdin?.end(JSON.stringify(request));
});

function assertReference(reference: CredentialReference): void {
  if (reference.source.kind !== 'keychain' || reference.owner !== `local:${process.getuid?.() ?? 'user'}`
    || !['openai', 'anthropic'].includes(reference.provider) || reference.scope.kind !== 'repository'
    || !reference.scope.root.startsWith('/') || !/^[a-zA-Z0-9:_-]{1,100}$/.test(reference.id)) {
    fail('CREDENTIAL_SCOPE', 'Secure-store reference must match this OS owner and explicit provider/repository.');
  }
}

export class KeychainCredentialStore implements CredentialStore {
  #bridge: KeychainBridge;
  #redactor: Redactor;
  constructor(redactor: Redactor, bridge: KeychainBridge = nativeBridge) { this.#bridge = bridge; this.#redactor = redactor; }
  async #call(operation: string, reference?: CredentialReference, secret?: string): Promise<unknown> {
    if (reference) assertReference(reference);
    try {
      const result = object(await this.#bridge({ operation, ...(reference ? { account: digest(reference), reference } : {}), ...(secret ? { secret } : {}) }));
      if (result.status === -25300) return null;
      if (result.status !== 0) fail('CREDENTIAL_STORE', 'OS secure store denied the operation. Unlock your keychain or check enrollment.');
      return result.value;
    } catch { return fail('CREDENTIAL_STORE', 'OS secure store unavailable or denied access. No alternate credential source was used.'); }
  }
  async set(reference: CredentialReference, secret: string): Promise<void> { this.#redactor.register(secret); await this.#call('set', reference, secret); }
  async get(reference: CredentialReference): Promise<string | null> {
    const secret = await this.#call('get', reference);
    if (secret === null) return null;
    if (typeof secret !== 'string') fail('CREDENTIAL_STORE', 'Secure store response is invalid.');
    this.#redactor.register(secret); return secret;
  }
  async delete(reference: CredentialReference): Promise<void> { await this.#call('delete', reference); }
  async has(reference: CredentialReference): Promise<boolean> { return await this.#call('has', reference) === true; }
  async listMetadata(): Promise<CredentialReference[]> {
    const result = await this.#call('list');
    if (result === null) return [];
    if (!Array.isArray(result)) fail('CREDENTIAL_STORE', 'Secure store metadata is invalid.');
    // Return only the known metadata fields. Never echo unrecognized stored attributes.
    return result.map(item => {
      const raw = object(item); const scope = object(raw.scope);
      const reference = { id: raw.id, owner: raw.owner, provider: raw.provider, scope: { kind: scope.kind, root: scope.root }, source: { kind: 'keychain' } } as CredentialReference;
      assertReference(reference); return reference;
    });
  }
}
