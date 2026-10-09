import { createHash, randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const kit = path.dirname(fileURLToPath(import.meta.url));
const lock = JSON.parse(await fs.readFile(path.join(kit, 'skills.lock.json'), 'utf8'));
const hash = (value) => createHash('sha256').update(value).digest('hex');
const check = (condition, message) => { if (!condition) throw new Error(message); };
const quote = (value) => "'" + value.replaceAll("'", "'\"'\"'") + "'";
const read = async (file) => JSON.parse(await fs.readFile(file, 'utf8'));
const write = async (file, value) => {
  await fs.writeFile(`${file}.tmp`, JSON.stringify(value, null, 2) + '\n', { mode: 0o600 });
  await fs.rename(`${file}.tmp`, file);
};

export function command(executable, args, cwd, timeout = 60000) {
  return new Promise((resolve, reject) => {
    const env = { ...process.env };
    for (const key of Object.keys(env)) if (key.startsWith('GIT_') || key === 'NODE_OPTIONS' || key === 'NODE_PATH' || key.startsWith('NODE_TEST_')) delete env[key];
    const child = spawn(executable, args, { cwd, env, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '', stopped = '';
    const stop = (reason) => {
      if (stopped) return;
      stopped = reason;
      try { process.kill(-child.pid, 'SIGKILL'); } catch { /* The process may have just exited. */ }
    };
    const timer = setTimeout(() => stop('timeout'), timeout);
    const collect = (chunk) => {
      output += chunk.toString();
      if (Buffer.byteLength(output) > 1024 * 1024) { output = output.slice(0, 1024 * 1024); stop('output-limit'); }
    };
    child.stdout.on('data', collect); child.stderr.on('data', collect);
    child.on('error', (error) => { clearTimeout(timer); reject(error); });
    child.on('close', (code, signal) => { clearTimeout(timer); resolve({ args: [executable, ...args], code, signal, stopped, output }); });
  });
}
async function git(cwd, ...args) {
  const result = await command('git', args, cwd);
  check(result.code === 0 && !result.stopped, `Git failed: ${args.join(' ')}\n${result.output}`);
  return result.output.trim();
}
function relative(file) {
  check(typeof file === 'string' && /^[a-zA-Z0-9_.][a-zA-Z0-9_./-]*$/.test(file) && !file.split('/').some((s) => !s || s === '.' || s === '..' || s === '.git'), `Invalid relative path: ${file}`);
  return file;
}
function config(value) {
  check(value && typeof value.task === 'string' && value.task.trim().length > 0, 'Task description is required.');
  check(typeof value.expectedFailure === 'string' && value.expectedFailure.trim().length > 0, 'expectedFailure must quote the assertion mismatch expected before the fix.');
  relative(value.regression);
  check(value.regression.endsWith('.test.mjs'), 'Use a new .test.mjs regression file.');
  for (const key of ['allow', 'baselineTests']) {
    check(Array.isArray(value[key]) && value[key].length > 0 && value[key].length <= 20, `${key} must contain 1–20 explicit file paths.`);
    value[key].forEach(relative);
    check(new Set(value[key]).size === value[key].length, `Duplicate ${key} paths.`);
  }
  check(value.baselineTests.every((file) => file.endsWith('.test.mjs')), 'Baseline tests must use Node .test.mjs files.');
  check(!value.allow.includes(value.regression) && !value.baselineTests.includes(value.regression), 'Regression must be a separate new file.');
  check(value.allow.every((file) => !value.baselineTests.includes(file) && !file.endsWith('.test.mjs')), 'Existing tests cannot be authorized as implementation files.');
  return value;
}
async function snapshot(cwd) {
  const tracked = (await git(cwd, 'ls-files', '-z')).split('\0').filter(Boolean);
  const extra = (await git(cwd, 'ls-files', '--others', '-z')).split('\0').filter(Boolean);
  const result = {};
  for (const file of [...new Set([...tracked, ...extra])].sort()) {
    relative(file);
    const full = path.join(cwd, file);
    let stat;
    try { stat = await fs.lstat(full); } catch (error) { if (error.code === 'ENOENT') { result[file] = null; continue; } throw error; }
    check(stat.isFile() && !stat.isSymbolicLink(), `Only regular files are supported: ${file}`);
    check(stat.size <= 5 * 1024 * 1024, `File exceeds starter profile limit: ${file}`);
    const real = await fs.realpath(full);
    check(real.startsWith(`${await fs.realpath(cwd)}${path.sep}`), `File escapes checkout: ${file}`);
    result[file] = { hash: hash(await fs.readFile(full)), executable: Boolean(stat.mode & 0o111) };
  }
  return result;
}
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const changed = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])].filter((key) => !same(a[key], b[key]));
async function inspect(state, onlyRegression = false) {
  check(await git(state.worktree, 'rev-parse', 'HEAD') === state.base, 'HEAD changed. Begin a new run for a new base.');
  check(!(await git(state.worktree, 'diff', '--cached', '--name-only')), 'Keep the candidate unstaged until the handoff is recorded.');
  const current = await snapshot(state.worktree);
  const allowed = onlyRegression ? [state.config.regression] : [...state.config.allow, state.config.regression];
  const outside = changed(state.original, current).filter((file) => !allowed.includes(file));
  check(!outside.length, `Out-of-scope changes: ${outside.join(', ')}`);
  return current;
}
function passed(result) {
  const count = (name) => Number(result.output.match(new RegExp(`^# ${name} (\\d+)$`, 'm'))?.[1] ?? -1);
  return result.code === 0 && !result.stopped && count('pass') > 0 && ['fail', 'cancelled', 'skipped', 'todo'].every((key) => count(key) === 0);
}
async function testFiles(state, files, label) {
  const before = await snapshot(state.worktree);
  const result = await command(process.execPath, ['--test', '--test-reporter=tap', ...files], state.worktree);
  const attempt = `${label}-${randomUUID()}`;
  const log = `${attempt}.log`;
  await fs.writeFile(path.join(state.directory, log), result.output, { mode: 0o600 });
  const record = { ...result, output: undefined, log, logHash: hash(result.output), time: new Date().toISOString() };
  state.attempts.push(record);
  await write(path.join(state.directory, 'run.json'), state);
  check(same(before, await snapshot(state.worktree)), 'A test changed repository files; evidence rejected.');
  return result;
}
export async function begin(repo, taskFile, directory, skills) {
  const [major, minor] = process.versions.node.split('.').map(Number);
  check(major > 22 || (major === 22 && minor >= 13), 'Use Node.js 22.13 or newer.');
  check(process.platform !== 'win32', 'Starter v0.1 supports macOS and Linux.');
  repo = await fs.realpath(repo); skills = await fs.realpath(skills);
  directory = path.resolve(directory);
  check(!(directory === repo || directory.startsWith(repo + path.sep)), 'Run directory must be outside the source repository.');
  const cfg = config(await read(taskFile));
  check(await git(skills, 'rev-parse', 'HEAD') === lock.commit && !(await git(skills, 'status', '--porcelain')), 'Use the clean skillz checkout pinned in skills.lock.json.');
  for (const phase of lock.phases) await fs.access(path.join(skills, 'skills', phase.skill, 'SKILL.md'));
  check(await git(repo, 'rev-parse', '--show-toplevel') === repo, 'Pass the repository root.');
  check(!(await git(repo, 'status', '--porcelain')) && !(await git(repo, 'ls-files', '--others')), 'Start from a clean repository, including ignored files; this profile is dependency-free.');
  const original = await snapshot(repo);
  check(!Object.hasOwn(original, cfg.regression), 'Regression file already exists. Choose a new path.');
  for (const file of [...cfg.allow, ...cfg.baselineTests]) check(original[file], `Required tracked file missing: ${file}`);
  await fs.mkdir(directory, { recursive: false, mode: 0o700 });
  directory = await fs.realpath(directory);
  const base = await git(repo, 'rev-parse', 'HEAD');
  const branch = `codex/fdlc-fix-${randomUUID().slice(0, 8)}`;
  const worktree = path.join(directory, 'worktree');
  const state = { version: 1, directory, repo, worktree, branch, base, config: cfg, original, skills, skillCommit: lock.commit, status: 'starting', attempts: [] };
  await write(path.join(directory, 'run.json'), state);
  try {
    await git(repo, 'worktree', 'add', '-b', branch, worktree, base);
    const baseline = await testFiles(state, cfg.baselineTests, 'baseline');
    check(passed(baseline), 'Baseline must pass without skipped, cancelled, or todo tests. See the baseline log.');
    await inspect(state);
    state.status = 'awaiting-regression';
    const prompt = `# Bounded bug fix\n\nTask: ${cfg.task}\n\nWork only in ${worktree}. Read this repository's instructions first.\n\nSkill source: ${skills}, commit ${lock.commit}. Read its runtime mapping at skills/poteto-mode/references/harness-tools.md when needed. Load these skills one phase at a time:\n${lock.phases.map((p) => `- ${p.phase}: ${path.join(skills, 'skills', p.skill, 'SKILL.md')}`).join('\n')}\n\n1. Inspect the affected code and record scope and expected behavior in ${path.join(directory, 'plan.md')}.\n2. Write only ${cfg.regression}. Predict and inspect the actual assertion mismatch: ${cfg.expectedFailure}.\n3. Run: node ${quote(path.join(kit, 'runner.mjs'))} reproduce ${quote(directory)}\n4. Only after reproduction succeeds, fix within: ${cfg.allow.join(', ')}. Do not change the frozen regression or existing tests.\n5. Run: node ${quote(path.join(kit, 'runner.mjs'))} verify ${quote(directory)}\n6. Review the evidence and handoff. Stop before commit, push, PR creation, merge, or release.\n\nCommands above use POSIX shell quoting. The runner enforces stage/scope checks at checkpoints, not OS permissions. Use your harness sandbox and trust only repositories you are authorized to execute. Stop on ambiguous behavior, unrelated failures, missing tools, or scope expansion. No autonomous repair loop.\n`;
    await fs.writeFile(path.join(directory, 'PROMPT.md'), prompt);
    await write(path.join(directory, 'run.json'), state);
    return state;
  } catch (error) { state.status = 'blocked'; state.reason = error.message; await write(path.join(directory, 'run.json'), state); throw error; }
}
async function load(directory) {
  directory = await fs.realpath(directory);
  const state = await read(path.join(directory, 'run.json'));
  check(state.version === 1 && state.directory === directory, 'Unsupported or moved run directory.');
  config(state.config);
  return state;
}
async function doReproduce(directory) {
  const state = await load(directory);
  check(state.status === 'awaiting-regression', `Cannot reproduce from ${state.status}.`);
  check(state.attempts.length < 4, 'Reproduction budget exhausted. Start a new run after reviewing the failure.');
  const current = await inspect(state, true);
  check(current[state.config.regression], 'Write the regression test before reproducing.');
  const result = await testFiles(state, [state.config.regression], 'reproduce');
  check(result.code === 1 && !result.stopped && /code: ['"]ERR_ASSERTION['"]/.test(result.output) && result.output.includes(state.config.expectedFailure), 'Not the expected assertion failure. Inspect the log; do not fix production code yet.');
  await inspect(state, true);
  state.regression = current[state.config.regression];
  state.status = 'reproduced';
  await write(path.join(state.directory, 'run.json'), state);
  return state;
}
async function doVerify(directory) {
  const state = await load(directory);
  check(['reproduced', 'verified'].includes(state.status), `Cannot verify from ${state.status}.`);
  // Invalidate a prior handoff before any new verification attempt.
  state.status = 'reproduced'; delete state.candidate;
  await fs.rm(path.join(state.directory, 'HANDOFF.md'), { force: true });
  await write(path.join(state.directory, 'run.json'), state);
  check(state.attempts.filter((a) => a.log.startsWith('verify-')).length < 3, 'Verification budget exhausted. Start a new run.');
  const current = await inspect(state);
  check(same(current[state.config.regression], state.regression), 'Frozen regression changed. Start a new run to revise the test.');
  check(changed(state.original, current).some((file) => state.config.allow.includes(file)), 'No implementation change to verify.');
  const result = await testFiles(state, [...state.config.baselineTests, state.config.regression], 'verify');
  check(passed(result), 'Verification failed or skipped tests. Inspect the log; no handoff is authorized.');
  check(same(current, await inspect(state)), 'Candidate changed during verification.');
  state.candidate = current;
  const diff = await git(state.worktree, 'diff', '--no-ext-diff', '--no-textconv', state.base, '--', ...state.config.allow);
  await fs.writeFile(path.join(state.directory, 'implementation.diff'), diff + '\n');
  await fs.copyFile(path.join(state.worktree, state.config.regression), path.join(state.directory, 'regression.test.mjs'));
  await fs.writeFile(path.join(state.directory, 'HANDOFF.md'), `# Ready for human review\n\n${state.config.task}\n\nBase: ${state.base}\nBranch: ${state.branch}\nWorktree: ${state.worktree}\nSkillz: ${state.skillCommit}\n\nChanged files: ${changed(state.original, current).join(', ')}\n\nEvidence: run.json and the baseline, reproduce, and verify logs. implementation.diff contains the production patch; regression.test.mjs is the new test. Review the assertion mismatch, intended behavior, scope, and test quality before accepting. These local records are editable and are not independent attestation.\n\nBefore committing, rerun: node ${quote(path.join(kit, 'runner.mjs'))} status ${quote(state.directory)}\n\nNo commit, push, pull request, merge, or release has been performed. Commit only the named changed files after human review. PR summary: fixes the reported behavior with a failing-before/passing-after regression; include the relevant logs and any limitations.\n`);
  state.status = 'verified';
  await write(path.join(state.directory, 'run.json'), state);
  return state;
}
async function exclusive(directory, action) {
  const file = path.join(await fs.realpath(directory), '.runner.lock');
  let handle;
  try { handle = await fs.open(file, 'wx', 0o600); }
  catch (error) { if (error.code === 'EEXIST') throw new Error('Run is locked. Let the active command finish. If it crashed, inspect processes before removing .runner.lock.'); throw error; }
  try { return await action(directory); }
  finally { await handle.close(); await fs.unlink(file); }
}
export const reproduce = (directory) => exclusive(directory, doReproduce);
export const verify = (directory) => exclusive(directory, doVerify);
export async function status(directory) {
  const state = await load(directory);
  if (state.status === 'verified') {
    check(same(state.candidate, await inspect(state)), 'Evidence is stale: the candidate changed after verification.');
    for (const attempt of state.attempts) check(hash(await fs.readFile(path.join(state.directory, attempt.log))) === attempt.logHash, `Evidence log changed: ${attempt.log}`);
  }
  return { status: state.status, worktree: state.worktree, branch: state.branch, reason: state.reason, attempts: state.attempts.length };
}
if (process.argv[1] && await fs.realpath(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const [action, ...args] = process.argv.slice(2);
    const usage = 'Usage: node runner.mjs begin REPO TASK_JSON NEW_RUN_DIRECTORY SKILLZ_CHECKOUT | reproduce RUN | verify RUN | status RUN';
    let result;
    if (action === 'begin' && args.length === 4) result = await begin(...args);
    else if (['reproduce', 'verify', 'status'].includes(action) && args.length === 1) result = await ({ reproduce, verify, status })[action](...args);
    else throw new Error(usage);
    console.log(JSON.stringify({ status: result.status, worktree: result.worktree, branch: result.branch, reason: result.reason, directory: result.directory }, null, 2));
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
