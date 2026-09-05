import type { CredentialMetadata, CredentialProvider, CredentialReference } from './types.ts';
import { digest, fail } from './validation.ts';

export class Redactor {
  #values = new Set<string>();
  register(secret: string): void {
    if (secret.length < 12 || secret.length > 8192 || /\s/.test(secret)) fail('CREDENTIAL_INVALID', 'Credential must be a non-empty provider token without whitespace (12–8192 characters).');
    this.#values.add(secret);
    this.#values.add(encodeURIComponent(secret));
    this.#values.add(Buffer.from(secret).toString('base64'));
    this.#values.add(JSON.stringify(secret).slice(1, -1));
  }
  text(value: string): string {
    let output = value;
    for (const secret of [...this.#values].sort((a, b) => b.length - a.length)) output = output.split(secret).join('[REDACTED]');
    return output
      .replace(/-----BEGIN [^-]*PRIVATE KEY-----[\s\S]*?-----END [^-]*PRIVATE KEY-----/g, '[REDACTED_PRIVATE_KEY]')
      .replace(/\b(?:sk-[A-Za-z0-9_-]{12,}|gh[pousr]_[A-Za-z0-9_]{12,}|github_pat_[A-Za-z0-9_]+|AKIA[A-Z0-9]{16})\b/g, '[REDACTED_TOKEN]')
      .replace(/((?:authorization|api[_-]?key|password|secret|access[_-]?token)\s*["']?\s*[:=]\s*["']?)(?:Bearer\s+)?[^\s,"';}]+/gi, '$1[REDACTED]')
      .replace(/https?:\/\/[^\s/@]+:[^\s/@]+@/g, 'https://[REDACTED]@');
  }
  value<T>(value: T): T {
    if (typeof value === 'string') return this.text(value) as T;
    if (Array.isArray(value)) return value.map(item => this.value(item)) as T;
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([key, item]) => [this.text(key), this.value(item)])) as T;
    return value;
  }
  terminal(value: string): string {
    // eslint-disable-next-line no-control-regex -- Strip untrusted terminal control characters while preserving tabs/newlines.
    return this.text(value).replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f]/g, '');
  }
  containsSecret(value: string): boolean { return this.text(value) !== value; }
}

/** One explicitly selected binding. No enumeration, dotenv, credential-chain or host-account fallback. */
export class EnvironmentCredentialProvider implements CredentialProvider {
  #reference: CredentialReference;
  #secret: string | undefined;
  constructor(reference: CredentialReference, redactor: Redactor, environment: NodeJS.ProcessEnv = process.env) {
    this.#reference = structuredClone(reference);
    this.#secret = environment[reference.source.variable];
    if (this.#secret) redactor.register(this.#secret);
  }
  metadata(): CredentialMetadata { return { reference: this.#reference.id, configured: Boolean(this.#secret), storage: 'environment' }; }
  async use<T>(reference: CredentialReference, operation: (value: string) => Promise<T>): Promise<T> {
    if (digest(reference) !== digest(this.#reference)) fail('CREDENTIAL_SCOPE', 'Credential ownership or execution scope does not match.');
    if (!this.#secret) fail('CREDENTIAL_MISSING', 'Set the explicitly configured FAB_ environment variable in your own shell.');
    return operation(this.#secret);
  }
}
