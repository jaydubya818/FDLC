import test from 'node:test';
import assert from 'node:assert/strict';
import { linkSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { EnvironmentCredentialProvider, Redactor } from '../src/credentials.ts';
import { Repository } from '../src/repository.ts';
import { SessionStore } from '../src/sessions.ts';
import { newSession } from '../src/agent.ts';
import { contentHash, fileName, parseConfig } from '../src/validation.ts';
import { fixture, TEST_KEY } from './helpers.ts';

test('credentials require the exact owner/provider/repository binding and never fall back to ambient keys', async t => {
  const f = fixture({ 'index.js': 'export const value = 1;\n' }); t.after(f.cleanup);
  const redactor = new Redactor();
  const missing = new EnvironmentCredentialProvider(f.config.credential, redactor, { OPENAI_API_KEY: TEST_KEY });
  assert.equal(missing.metadata().configured, false);
  await assert.rejects(missing.use(f.config.credential, async () => true), /Set the explicitly/);
  const credentials = new EnvironmentCredentialProvider(f.config.credential, redactor, { FAB_TEST_MODEL_KEY: TEST_KEY });
  for (const changed of [{ ...f.config.credential, owner: 'other' }, { ...f.config.credential, scope: { kind: 'repository' as const, root: '/other' } }]) {
    await assert.rejects(credentials.use(changed, async () => true), /ownership or execution scope/);
  }
  assert(!JSON.stringify(credentials).includes(TEST_KEY));
  assert(!JSON.stringify(credentials.metadata()).includes(TEST_KEY));
});

test('redaction covers exact and encoded secrets, nested evidence and terminal escape sequences', () => {
  const redactor = new Redactor(); redactor.register(TEST_KEY);
  const output = redactor.value({ error: `${TEST_KEY} ${Buffer.from(TEST_KEY).toString('base64')} ${encodeURIComponent(TEST_KEY)}`, nested: [{ text: TEST_KEY }], [TEST_KEY]: 'key names must also be sanitized', count: null });
  assert(!JSON.stringify(output).includes(TEST_KEY));
  assert(!JSON.stringify(output).includes(Buffer.from(TEST_KEY).toString('base64')));
  assert.equal(output.count, null);
  assert(!redactor.terminal('\x1b]52;c;clipboard\x07').includes('\x1b'));
  assert.match(redactor.text('-----BEGIN PRIVATE KEY-----\nfixture\n-----END PRIVATE KEY-----'), /REDACTED_PRIVATE_KEY/);
});

test('scope denies traversal, secrets, hidden paths, symlinks and hard links before writes', t => {
  const f = fixture({ 'src/code.js': 'const value = 1;\n' }); t.after(f.cleanup);
  const repository = new Repository(f.root, ['src/code.js', 'src/new.js']);
  for (const denied of ['../escape.js', '/tmp/escape.js', 'src/../escape.js', '.git/config', '.env', 'src/private.key', 'src/credentials.json', 'src\\file.js']) assert.throws(() => fileName(denied));
  const outside = path.join(f.directory, 'outside'); writeFileSync(outside, 'private fixture');
  symlinkSync(outside, path.join(f.root, 'linked.js'));
  linkSync(outside, path.join(f.root, 'hard.js'));
  assert.throws(() => repository.read('linked.js'), /Linked/);
  assert.throws(() => repository.read('hard.js'), /Linked/);
  assert.throws(() => repository.write('unapproved.js', 'x', null), /outside/);
  assert.throws(() => repository.write('src/code.js', 'new', contentHash('old')), /changed since/);
  repository.write('src/code.js', 'const value = 2;\n', contentHash(repository.read('src/code.js')));
  repository.write('src/new.js', 'export const added = true;\n', null);
  assert.equal(repository.read('src/new.js'), 'export const added = true;\n');
  assert.equal(readFileSync(outside, 'utf8'), 'private fixture');
});

test('configuration rejects extra authority, ambient credentials, duplicate checks and unsafe file scopes', t => {
  const f = fixture({ 'index.js': '1\n' }); t.after(f.cleanup);
  assert.throws(() => parseConfig({ ...f.config, shell: 'unrestricted' }), /Unexpected/);
  assert.throws(() => parseConfig({ ...f.config, checks: [f.config.checks[0], f.config.checks[0]] }), /unique/);
  assert.throws(() => parseConfig({ ...f.config, writableFiles: ['.env'] }), /unavailable/);
  assert.throws(() => parseConfig({ ...f.config, credential: { ...f.config.credential, source: { kind: 'environment', variable: 'OPENAI_API_KEY' } } }), /FAB_/);
});

test('private session persistence redacts values, detects corruption, and excludes repository storage', async t => {
  const f = fixture({ 'index.js': '1\n' }); t.after(f.cleanup);
  const redactor = new Redactor(); redactor.register(TEST_KEY);
  assert.throws(() => new SessionStore(path.join(f.root, 'state'), f.root, redactor), /outside/);
  const directory = path.join(f.directory, 'state');
  const store = new SessionStore(directory, f.root, redactor);
  const session = newSession(f.config, 'A task'); session.events.push({ sequence: 1, at: 'test', kind: 'test', data: TEST_KEY });
  store.save(session);
  const stored = readFileSync(path.join(directory, session.id + '.json'), 'utf8'); assert(!stored.includes(TEST_KEY));
  assert.equal(store.load(session.id).id, session.id);
  await store.locked(session.id, async () => assert.rejects(store.locked(session.id, async () => true), /Session is in use/));
  const envelope = JSON.parse(stored); envelope.session.status = 'candidate';
  writeFileSync(path.join(directory, session.id + '.json'), JSON.stringify(envelope));
  assert.throws(() => store.load(session.id), /integrity/);
  mkdirSync(path.join(f.directory, 'public'), { mode: 0o755 });
  assert.throws(() => new SessionStore(path.join(f.directory, 'public'), f.root, redactor), /owner-only/);
});
