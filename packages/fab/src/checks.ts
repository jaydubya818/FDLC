import { spawn } from 'node:child_process';
import { lstatSync, mkdirSync, mkdtempSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CheckDefinition, CheckResult } from './types.ts';
import { Redactor } from './credentials.ts';
import { Repository } from './repository.ts';
import { fail } from './validation.ts';

const OUTPUT_LIMIT = 200000;
const quote = (value: string) => JSON.stringify(value);

/** Deny by default. Only the disposable snapshot, empty home and scratch directory are writable. */
export function sandboxProfile(directory: string, executable: string): string {
  const runtime = realpathSync(executable);
  if (!(runtime.startsWith('/usr/bin/') || runtime.startsWith('/bin/') || runtime.startsWith('/opt/homebrew/Cellar/'))) {
    fail('CHECK_EXECUTABLE', 'Pilot checks require a system executable or Homebrew Cellar executable.');
  }
  return `(version 1)
(deny default)
(allow process*)
(deny process-fork)
(deny process-exec (require-all (require-not (literal ${quote(runtime)})) (require-not (literal ${quote(executable)}))))
(allow sysctl-read)
(allow mach-lookup)
(allow file-read-metadata)
(allow file-read* (literal "/") (literal "/opt") (literal "/private")
  (subpath "/usr") (subpath "/System") (subpath "/Library")
  (subpath "/opt/homebrew/Cellar") (subpath "/opt/homebrew/opt")
  (literal "/opt/homebrew") (literal "/opt/homebrew/bin")
  (subpath "/private/var/db") (subpath "/private/etc")
  (subpath "/dev") (subpath ${quote(directory)}))
(allow file-write* (subpath ${quote(directory)}) (literal "/dev/null"))
`;
}

export async function runCheck(repository: Repository, check: CheckDefinition, timeoutMs: number, redactor: Redactor, signal: AbortSignal): Promise<CheckResult> {
  const candidate = repository.candidate();
  const started = Date.now();
  const result: CheckResult = { id: check.id, argv: check.argv, candidateDigest: candidate.digest, status: 'blocked', exitCode: null, signal: null, stdout: '', stderr: '', durationMs: 0, isolation: 'macos-seatbelt-snapshot', independent: false };
  if (process.platform !== 'darwin') return { ...result, stderr: 'Contained checks currently require macOS sandbox-exec. No command ran.' };
  if (signal.aborted) return { ...result, status: 'cancelled' };
  // Never use TMPDIR from the parent; it can point into a credential-bearing tree.
  const directory = realpathSync(mkdtempSync('/private/tmp/fab-check-'));
  const snapshot = path.join(directory, 'repository');
  const home = path.join(directory, 'home');
  const scratch = path.join(directory, 'tmp');
  try {
    for (const root of [snapshot, home, scratch]) mkdirSync(root, { mode: 0o700 });
    const files = repository.snapshot();
    for (const [name, content] of Object.entries(files)) {
      if (redactor.containsSecret(content)) return { ...result, stderr: 'Snapshot contains a recognized credential; checks were blocked.' };
      const target = path.join(snapshot, name);
      mkdirSync(path.dirname(target), { recursive: true, mode: 0o700 });
      writeFileSync(target, content, { flag: 'wx', mode: 0o600 });
    }
    const executable = check.argv[0]!;
    if (!lstatSync(realpathSync(executable)).isFile()) fail('CHECK_EXECUTABLE', 'Check executable is not a file.');
    const profile = sandboxProfile(directory, executable);
    const profilePath = path.join(directory, 'profile.sb');
    writeFileSync(profilePath, profile, { mode: 0o600, flag: 'wx' });
    const output = await new Promise<{ code: number | null; signal: string | null; stdout: string; stderr: string; timedOut: boolean; cancelled: boolean; overflow: boolean; failedStart: boolean }>(resolve => {
      const stdout: Buffer[] = []; const stderr: Buffer[] = [];
      let bytes = 0; let timedOut = false; let cancelled = false; let overflow = false; let failedStart = false;
      const guard = fileURLToPath(new URL(import.meta.url.endsWith('.ts') ? '../dist/fab-check-guard' : './fab-check-guard', import.meta.url));
      const child = spawn(guard, [directory, profilePath, ...check.argv], {
        cwd: snapshot, detached: true, stdio: ['pipe', 'pipe', 'pipe'],
        env: { PATH: '/usr/bin:/bin:/opt/homebrew/bin', HOME: home, TMPDIR: scratch, TMP: scratch, TEMP: scratch, LC_ALL: 'C', CI: '1', NODE_OPTIONS: '', OPENSSL_CONF: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0' },
      });
      const stop = () => { child.kill('SIGTERM'); };
      const reapGroup = () => { if (child.pid) { try { process.kill(-child.pid, 'SIGKILL'); } catch { /* Already terminated. */ } } };
      const abort = () => { cancelled = true; stop(); };
      const timer = setTimeout(() => { timedOut = true; stop(); }, timeoutMs);
      const capture = (target: Buffer[]) => (part: Buffer) => {
        bytes += part.length;
        if (bytes > OUTPUT_LIMIT) { overflow = true; stop(); return; }
        target.push(part);
      };
      child.stdout.on('data', capture(stdout)); child.stderr.on('data', capture(stderr));
      child.once('error', () => { failedStart = true; });
      child.stdin.on('error', () => {});
      child.once('exit', reapGroup); // Also fail closed if the trusted supervisor itself exits unexpectedly.
      child.once('close', (code, childSignal) => {
        clearTimeout(timer); signal.removeEventListener('abort', abort); stop();
        resolve({ code, signal: childSignal, stdout: Buffer.concat(stdout).toString('utf8'), stderr: Buffer.concat(stderr).toString('utf8'), timedOut, cancelled, overflow, failedStart });
      });
      signal.addEventListener('abort', abort, { once: true });
      if (signal.aborted) abort();
    });
    result.exitCode = output.code; result.signal = output.signal;
    result.stdout = redactor.text(output.stdout).slice(0, 16000);
    result.stderr = redactor.text(output.stderr).slice(0, 16000);
    result.status = output.cancelled ? 'cancelled' : output.timedOut ? 'timed_out' : output.overflow ? 'failed'
      : output.failedStart || output.code === 125 || output.stderr.includes('sandbox-exec:') ? 'blocked'
      : output.code === 0 && !output.overflow ? 'passed' : 'failed';
    if (output.overflow) { result.stdout = ''; result.stderr = 'Check output exceeded the byte limit; process group terminated and output withheld.'; }
    if (repository.candidate().digest !== candidate.digest) { result.status = 'blocked'; result.stderr = 'Repository changed while checks ran; result is stale.'; }
    return result;
  } finally { result.durationMs = Date.now() - started; rmSync(directory, { recursive: true, force: true }); }
}
