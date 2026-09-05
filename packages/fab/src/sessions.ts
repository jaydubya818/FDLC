import { constants, closeSync, fstatSync, lstatSync, mkdirSync, openSync, readFileSync, realpathSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Session } from './types.ts';
import { Redactor } from './credentials.ts';
import { digest, fail, object, parseConfig } from './validation.ts';

export class SessionStore {
  readonly directory: string;
  #redactor: Redactor;
  constructor(directory: string, repository: string, redactor: Redactor) {
    const requested = path.resolve(directory);
    if (requested === repository || requested.startsWith(repository + path.sep)) fail('STATE_SCOPE', 'Session storage must be outside the repository.');
    mkdirSync(requested, { recursive: true, mode: 0o700 });
    this.directory = realpathSync(requested);
    const stat = lstatSync(requested);
    if (stat.isSymbolicLink() || !stat.isDirectory() || (stat.mode & 0o077) !== 0 || (process.getuid && stat.uid !== process.getuid())) fail('STATE_PERMISSIONS', 'Use an owner-only session directory (mode 0700).');
    if (this.directory === repository || this.directory.startsWith(repository + path.sep)) fail('STATE_SCOPE', 'Session storage resolves inside the repository.');
    this.#redactor = redactor;
  }
  #path(id: string): string {
    if (!/^[a-f0-9-]{36}$/.test(id)) fail('SESSION_ID', 'Invalid session ID.');
    return path.join(this.directory, `${id}.json`);
  }
  save(session: Session): void {
    const clean = this.#redactor.value(session);
    const payload = JSON.stringify({ digest: digest(clean), session: clean });
    if (Buffer.byteLength(payload) > 8000000) fail('SESSION_LIMIT', 'Session evidence exceeds the local storage limit.');
    const temporary = path.join(this.directory, `.save-${randomUUID()}`);
    writeFileSync(temporary, payload + '\n', { mode: 0o600, flag: 'wx' });
    renameSync(temporary, this.#path(session.id));
  }
  load(id: string): Session {
    const fd = openSync(this.#path(id), constants.O_RDONLY | constants.O_NOFOLLOW);
    let raw: Record<string, unknown>;
    try {
      const stat = fstatSync(fd);
      if (!stat.isFile() || stat.nlink !== 1 || (stat.mode & 0o077) !== 0 || stat.size > 8000000 || (process.getuid && stat.uid !== process.getuid())) fail('SESSION_PERMISSIONS', 'Session file permissions or size are invalid.');
      raw = object(JSON.parse(readFileSync(fd, 'utf8')));
    } finally { closeSync(fd); }
    const session = object(raw.session);
    if (session.version !== 1 || session.id !== id || digest(session) !== raw.digest) fail('SESSION_INTEGRITY', 'Session integrity or version check failed.');
    parseConfig(session.config);
    if (!['planning', 'awaiting_approval', 'executing', 'candidate', 'failed', 'blocked', 'cancelled'].includes(String(session.status)) || !Array.isArray(session.events) || !Array.isArray(session.messages)) fail('SESSION_INVALID', 'Session state is invalid.');
    return session as unknown as Session;
  }
  async locked<T>(id: string, operation: () => Promise<T>): Promise<T> {
    const lock = `${this.#path(id)}.lock`;
    try { mkdirSync(lock, { mode: 0o700 }); } catch { fail('SESSION_LOCKED', 'Session is in use or interrupted. Inspect the process and partial diff before manually removing its lock directory.'); }
    try { return await operation(); } finally { rmSync(lock, { recursive: true, force: true }); }
  }
}
