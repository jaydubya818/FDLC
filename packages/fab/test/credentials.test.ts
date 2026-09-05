import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import { KeychainCredentialStore, type KeychainBridge } from '../src/keychain.ts';
import { EnvironmentCredentialProvider, Redactor, StoredCredentialProvider } from '../src/credentials.ts';
import { fixture, TEST_KEY } from './helpers.ts';
import { SessionStore } from '../src/sessions.ts';
import { newSession } from '../src/agent.ts';
import { parseConfig } from '../src/validation.ts';

test('secure-store binding, rotation, deletion, metadata and explicit source precedence', async t => {
  const f = fixture({ 'index.js': '1\n' }); t.after(f.cleanup);
  const ref = { ...f.config.credential, source: { kind: 'keychain' as const } };
  const entries = new Map<string, { secret: string; reference: unknown }>();
  const bridge: KeychainBridge = async raw => {
    const key = String(raw.account); const item = entries.get(key);
    if (raw.operation === 'set') entries.set(key, { secret: String(raw.secret), reference: raw.reference });
    if (raw.operation === 'delete') entries.delete(key);
    return { status: 0, value: raw.operation === 'list' ? [...entries.values()].map(item => item.reference) : raw.operation === 'has' ? Boolean(item) : raw.operation === 'get' ? item?.secret ?? null : null };
  };
  const redactor = new Redactor(); const store = new KeychainCredentialStore(redactor, bridge);
  assert.equal(await store.has(ref), false);
  const missing = await StoredCredentialProvider.create(ref, store, redactor);
  await assert.rejects(missing.use(ref, async () => true), /Enroll/);
  await store.set(ref, TEST_KEY);
  assert.equal(await store.get(ref), TEST_KEY);
  assert.deepEqual(await store.listMetadata(), [ref]);
  const bound = await StoredCredentialProvider.create(ref, store, redactor);
  await assert.rejects(bound.use({ ...ref, owner: 'another' }, async () => true), /scope/);
  assert.equal(await store.get({ ...ref, scope: { kind: 'repository', root: '/other' } }), null);
  await store.set(ref, 'replacement-non-secret-fixture-value');
  assert.equal(await bound.use(ref, async key => key), 'replacement-non-secret-fixture-value');
  assert.throws(() => new EnvironmentCredentialProvider(ref, redactor, { FAB_MODEL_KEY: TEST_KEY }), /explicitly/);
  assert.throws(() => parseConfig({ ...f.config, credential: { ...ref, source: { kind: 'keychain', variable: 'FAB_MODEL_KEY' } } }), /Unexpected/);
  await store.delete(ref); assert.equal(await store.has(ref), false); assert.deepEqual(await store.listMetadata(), []);
  assert(!JSON.stringify(bound.metadata()).includes(TEST_KEY));
});

test('adversarial redaction covers all persisted channels and provider-style partial echoes', t => {
  const f = fixture({ 'index.js': '1\n' }); t.after(f.cleanup);
  const key = 'sk-ant-testONLY-9qX7vB2nP8rL4mT6wZ0aK3cS';
  const redactor = new Redactor(); redactor.register(key);
  const variants = [key, encodeURIComponent(key), Buffer.from(key).toString('base64'), key.slice(0, 8), key.slice(-8)];
  const channels = ['stdout', 'stderr', 'error', 'requestLog', 'responseLog', 'toolOutput', 'evidence', 'telemetry', 'trace', 'serializedException'];
  const session = newSession(f.config, variants.join(' '));
  for (const kind of channels) session.events.push({ sequence: session.events.length + 1, at: 'fixture', kind, data: { [key]: variants, exception: new Error(key, { cause: new Error(key) }) } });
  session.diff = variants.join('\n'); session.messages.push({ role: 'user', content: key });
  const store = new SessionStore(path.join(f.directory, 'state'), f.root, redactor); store.save(session);
  const persisted = readFileSync(path.join(store.directory, session.id + '.json'), 'utf8');
  const terminal = redactor.terminal(JSON.stringify(redactor.value(session)));
  for (const variant of variants) { assert(!persisted.includes(variant)); assert(!terminal.includes(variant)); }
});

test('native macOS keychain stores, rotates and deletes only synthetic data in an isolated keychain', { skip: process.env.FAB_TEST_KEYCHAIN !== '1' }, async t => {
  const directory = mkdtempSync('/private/tmp/fab-keychain-test-');
  const keychainPath = path.join(directory, 'fixture.keychain');
  const binary = path.join(directory, 'bridge');
  const source = new URL('../native/keychain.m', import.meta.url);
  const environment = { PATH: '/usr/bin:/bin', HOME: directory, TMPDIR: '/private/tmp' };
  execFileSync('/usr/bin/xcrun', ['clang', '-fobjc-arc', '-DFAB_KEYCHAIN_TEST', '-Wno-deprecated-declarations', '-Wno-incompatible-pointer-types', '-framework', 'Foundation', '-framework', 'Security', source.pathname, '-o', binary], { env: environment, stdio: 'pipe' });
  const bridge: KeychainBridge = async request => JSON.parse(execFileSync(binary, [], { input: JSON.stringify({ ...request, keychainPath }), encoding: 'utf8', env: environment }));
  assert.equal((await bridge({ operation: 'create' }) as {status: number}).status, 0);
  t.after(async () => { await bridge({ operation: 'destroy' }); rmSync(directory, { recursive: true, force: true }); });
  const f = fixture({ 'index.js': '1\n' }); t.after(f.cleanup);
  const ref = { ...f.config.credential, source: { kind: 'keychain' as const } };
  const store = new KeychainCredentialStore(new Redactor(), bridge);
  assert.equal(await store.has(ref), false);
  await store.set(ref, TEST_KEY); assert.equal(await store.has(ref), true); assert.equal(await store.get(ref), TEST_KEY);
  assert.deepEqual(await store.listMetadata(), [ref]);
  await store.set(ref, 'rotated-non-secret-test-value-123456'); assert.equal(await store.get(ref), 'rotated-non-secret-test-value-123456');
  // The keychain file must not contain plaintext credential data.
  for (const filename of [keychainPath, keychainPath + '-db']) { try { assert(!readFileSync(filename).includes(Buffer.from(TEST_KEY))); } catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; } }
  await store.delete(ref); assert.equal(await store.get(ref), null); assert.deepEqual(await store.listMetadata(), []);
});
