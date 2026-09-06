import { execFileSync } from 'node:child_process';
import { constants, lstatSync, mkdirSync, openSync, closeSync, readFileSync, realpathSync, renameSync, unlinkSync, writeFileSync, fstatSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { contentHash, digest, fail, fileName } from './validation.ts';

export const MAX_FILE_BYTES = 100000;
export const MAX_REPOSITORY_BYTES = 2000000;
export class Repository {
  readonly root: string;
  #writable: Set<string>;
  constructor(root: string, writable: string[] = []) {
    this.root = realpathSync(root);
    this.#writable = new Set(writable.map(fileName));
    if (this.git(['rev-parse', '--show-toplevel']).trim() !== this.root) fail('REPOSITORY_ROOT', 'Select the Git repository root, not a subdirectory.');
  }
  git(args: string[]): string {
    try {
      return execFileSync('/usr/bin/git', ['-c', 'core.fsmonitor=false', '-c', 'core.hooksPath=/dev/null', '-c', 'core.untrackedCache=false', '-c', 'core.quotePath=true', ...args], {
        cwd: this.root, encoding: 'utf8', timeout: 10000, maxBuffer: 4000000,
        env: { PATH: '/usr/bin:/bin', HOME: '/nonexistent', GIT_CONFIG_NOSYSTEM: '1', GIT_CONFIG_GLOBAL: '/dev/null', GIT_TERMINAL_PROMPT: '0', GIT_OPTIONAL_LOCKS: '0', LC_ALL: 'C' },
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch (error) {
      if (args[0] === 'check-ignore' && (error as { status?: number }).status === 1) return '';
      fail('GIT_FAILED', 'Local Git inspection failed; a committed Git repository and /usr/bin/git are required.');
    }
  }
  revision(): string { return this.git(['rev-parse', '--verify', 'HEAD']).trim(); }
  branch(): string { return this.git(['branch', '--show-current']).trim() || '(detached)'; }
  status(): string { return this.git(['status', '--porcelain=v1', '--untracked-files=all']); }
  assertClean(): void { this.revision(); if (this.status()) fail('DIRTY_REPOSITORY', 'Start from a clean committed checkout. Fab will not stash or overwrite existing changes.'); }
  files(): string[] {
    const all = this.git(['ls-files', '-z', '--cached', '--others', '--exclude-standard']).split('\0').filter(Boolean);
    if (all.length > 10000) fail('REPOSITORY_LIMIT', 'Repository file map exceeds the pilot limit.');
    return [...new Set(all)].filter(name => { try { fileName(name); return true; } catch { return false; } }).sort();
  }
  resolve(name: string, creating = false): string {
    fileName(name);
    const parts = name.split('/'); let current = this.root;
    if (realpathSync(this.root) !== this.root) fail('PATH_DENIED', 'Repository root changed.');
    for (let i = 0; i < parts.length; i++) {
      current = path.join(current, parts[i]!);
      let info;
      try { info = lstatSync(current); } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT' && creating) continue;
        fail('FILE_UNAVAILABLE', 'Repository file is unavailable.');
      }
      if (info.isSymbolicLink() || (i < parts.length - 1 ? !info.isDirectory() : !info.isFile() || info.nlink !== 1)) fail('PATH_DENIED', 'Linked or non-regular repository files are unavailable.');
    }
    return current;
  }
  read(name: string): string {
    const target = this.resolve(name);
    const fd = openSync(target, constants.O_RDONLY | constants.O_NOFOLLOW);
    try {
      const info = fstatSync(fd);
      if (!info.isFile() || info.nlink !== 1 || info.size > MAX_FILE_BYTES) fail('FILE_LIMIT', 'File is linked, non-regular or exceeds the file byte limit.');
      const bytes = readFileSync(fd);
      const value = bytes.toString('utf8');
      if (value.includes('\0') || !Buffer.from(value).equals(bytes)) fail('FILE_BINARY', 'Only UTF-8 text files are available in this pilot.');
      return value;
    } finally { closeSync(fd); }
  }
  write(name: string, content: string, expectedHash: string | null): void {
    fileName(name);
    if (!this.#writable.has(name)) fail('WRITE_DENIED', 'File is outside the approved writable file list.');
    if (Buffer.byteLength(content) > MAX_FILE_BYTES || content.includes('\0')) fail('FILE_LIMIT', 'New content exceeds the text-file limit.');
    const target = this.resolve(name, true);
    let existing: string | null = null;
    try { existing = this.read(name); } catch (error) {
      if (!(error instanceof Error) || !('code' in error) || error.code !== 'FILE_UNAVAILABLE') throw error;
    }
    if ((existing === null ? null : contentHash(existing)) !== expectedHash) fail('FILE_DRIFT', 'File changed since it was read; reread before editing.');
    if (existing === null && this.git(['check-ignore', '--no-index', name]).trim()) fail('WRITE_DENIED', 'Ignored files cannot become candidates.');
    mkdirSync(path.dirname(target), { recursive: true });
    this.resolve(name, true);
    const temporary = path.join(path.dirname(target), `.fab-${randomUUID()}`);
    const mode = existing === null ? 0o644 : lstatSync(target).mode & 0o777;
    try {
      writeFileSync(temporary, content, { flag: 'wx', mode });
      this.resolve(name, true);
      renameSync(temporary, target);
    } finally { try { unlinkSync(temporary); } catch { /* Renamed or not created. */ } }
  }
  snapshot(): Record<string, string> {
    const files = this.files();
    if (files.length > 300) fail('REPOSITORY_LIMIT', 'Contained checks currently support at most 300 text files.');
    const output: Record<string, string> = Object.create(null) as Record<string, string>;
    let bytes = 0;
    for (const file of files) {
      const content = this.read(file); bytes += Buffer.byteLength(content);
      if (bytes > MAX_REPOSITORY_BYTES) fail('REPOSITORY_LIMIT', 'Contained snapshot exceeds 2 MB.');
      output[file] = content;
    }
    return output;
  }
  candidate(): { digest: string; changed: string[]; diff: string } {
    const tracked = this.git(['diff', '--name-only', '-z', 'HEAD']).split('\0').filter(Boolean);
    const untracked = this.git(['ls-files', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean);
    const changed = [...new Set([...tracked, ...untracked])].sort();
    if (changed.some(file => !this.#writable.has(file))) fail('SCOPE_DRIFT', 'A changed file is outside the approved scope.');
    for (const file of changed) this.resolve(file);
    let diff = this.git(['diff', '--no-ext-diff', '--no-textconv', '--no-renames', '--no-color', 'HEAD', '--', ...changed]);
    for (const file of untracked) {
      const content = this.read(file);
      diff += `diff --git a/${file} b/${file}\nnew file mode 100644\n--- /dev/null\n+++ b/${file}\n@@ -0,0 +1,${content.split('\n').length - (content.endsWith('\n') ? 1 : 0)} @@\n`;
      diff += content.split('\n').filter((_, i, all) => i !== all.length - 1 || !content.endsWith('\n')).map(line => `+${line}\n`).join('');
      if (!content.endsWith('\n')) diff += '\\ No newline at end of file\n';
    }
    return { digest: digest({ revision: this.revision(), files: this.snapshot() }), changed, diff };
  }
  inspect(): unknown {
    const files = this.files();
    const languages = Object.entries({ TypeScript: /\.(?:ts|tsx|mts|cts)$/, JavaScript: /\.(?:js|jsx|mjs|cjs)$/, Python: /\.py$/, Ruby: /\.rb$/, Rust: /\.rs$/, Go: /\.go$/ })
      .filter(([, pattern]) => files.some(file => pattern.test(file))).map(([language]) => language);
    const packageManagers = Object.entries({ npm: 'package-lock.json', pnpm: 'pnpm-lock.yaml', yarn: 'yarn.lock', uv: 'uv.lock', cargo: 'Cargo.lock', bundler: 'Gemfile.lock', go: 'go.mod' })
      .filter(([, lockfile]) => files.includes(lockfile)).map(([manager]) => manager);
    return { repository: this.root, revision: this.revision(), branch: this.branch(), status: this.status() || 'clean', files: files.slice(0, 300), fileCount: files.length,
      languages, packageManagers,
      checkConfiguration: files.filter(file => /(^|\/)(?:eslint\.config\.[cm]?[jt]s|tsconfig[^/]*\.json|vitest\.config\.[cm]?[jt]s|jest\.config\.[cm]?[jt]s|pytest\.ini|ruff\.toml|playwright\.config\.[cm]?[jt]s)$/.test(file)),
      testFiles: files.filter(file => /(?:\.(?:test|spec)\.[cm]?[jt]sx?$|(^|\/)test_[^/]+\.py$)/.test(file)).slice(0, 50),
      buildFiles: files.filter(file => /(^|\/)(package.json|pyproject.toml|Cargo.toml|Gemfile|go.mod|Makefile|pnpm-lock.yaml|package-lock.json|yarn.lock)$/.test(file)),
      instructions: files.filter(file => /(^|\/)(AGENTS.md|README.md|CONTRIBUTING.md|CLAUDE.md)$/.test(file)),
    };
  }
}
