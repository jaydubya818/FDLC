import { mkdtemp, cp, writeFile, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { begin, reproduce, verify, status, command } from './runner.mjs';

const kit = path.dirname(fileURLToPath(import.meta.url));
const skills = process.argv[2];
if (!skills) { console.error('Usage: node demo.mjs /absolute/path/to/pinned/skillz'); process.exit(1); }
const root = await mkdtemp(path.join(tmpdir(), 'fdlc-starter-demo-'));
const repo = path.join(root, 'example');
await cp(path.join(kit, 'example'), repo, { recursive: true });
for (const args of [['init', '-q'], ['add', '.'], ['-c', 'user.name=FDLC Demo', '-c', 'user.email=demo@localhost', 'commit', '-qm', 'Example baseline']]) {
  const result = await command('git', args, repo);
  if (result.code !== 0) throw new Error(result.output);
}
const run = path.join(root, 'run');
const state = await begin(repo, path.join(repo, 'task.json'), run, skills);
await writeFile(path.join(state.worktree, 'tests/partial-batch.test.mjs'), `import test from 'node:test';
import assert from 'node:assert/strict';
import { batchCount } from '../src/batches.mjs';
test('counts a partially filled final batch', () => assert.equal(batchCount(5, 2), 3));
`);
await reproduce(run);
console.log('BEFORE: 5 items / capacity 2 returned 2; regression expected 3.');
const source = path.join(state.worktree, 'src/batches.mjs');
await writeFile(source, (await readFile(source, 'utf8')).replace('Math.floor', 'Math.ceil'));
await verify(run);
console.log('AFTER: regression and baseline pass.');
console.log(JSON.stringify(await status(run), null, 2));
console.log(`Evidence: ${run}\nScripted demonstration only: the known fix above is not an agent-generated result.`);
