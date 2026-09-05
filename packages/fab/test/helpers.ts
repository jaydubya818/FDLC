import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { Repository } from '../src/repository.ts';
import { parseConfig } from '../src/validation.ts';
import type { FabConfig, ProviderId, ToolCall } from '../src/types.ts';

export const TEST_KEY = 'fab-non-secret-fixture-value-123456';
export function fixture(files: Record<string, string>, provider: ProviderId = 'openai'): { directory: string; root: string; config: FabConfig; cleanup: () => void } {
  const directory = mkdtempSync('/private/tmp/fab-evaluation-');
  const root = path.join(directory, 'repo'); mkdirSync(root);
  for (const [name, content] of Object.entries(files)) {
    const target = path.join(root, name); mkdirSync(path.dirname(target), { recursive: true }); writeFileSync(target, content);
  }
  const git = (args: string[]) => execFileSync('/usr/bin/git', ['-c', 'commit.gpgsign=false', '-c', 'core.hooksPath=/dev/null', ...args], {
    cwd: root, stdio: 'pipe', env: { PATH: '/usr/bin:/bin', HOME: directory, GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1', GIT_AUTHOR_NAME: 'Fab Test Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Fab Test Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' },
  });
  git(['init', '-q']); git(['add', '.']); git(['commit', '-qm', 'Non-secret evaluation baseline']);
  const repository = new Repository(root);
  const config = parseConfig({ version: 1, repository: repository.root, provider, model: 'fixture-model',
    credential: { id: 'fixture:model', owner: `local:${process.getuid?.() ?? 'user'}`, provider, scope: { kind: 'repository', root: repository.root }, source: { kind: 'environment', variable: 'FAB_TEST_MODEL_KEY' } },
    writableFiles: Object.keys(files).filter(name => !name.startsWith('.') && name !== 'README.md'),
    checks: [{ id: 'test', argv: [process.execPath, '--test', '--test-isolation=none'] }], acceptanceCriteria: ['The fixture behavior passes its actual project tests.'], maxTurns: 12, timeoutMs: 20000, checkTimeoutMs: 5000,
  });
  return { directory, root: repository.root, config, cleanup: () => rmSync(directory, { recursive: true, force: true }) };
}
export function wireReply(provider: ProviderId, calls: ToolCall[], text = ''): Response {
  const usage = provider === 'openai' ? { prompt_tokens: 10, completion_tokens: 5, prompt_tokens_details: { cached_tokens: 0 } } : { input_tokens: 10, output_tokens: 5, cache_read_input_tokens: 0 };
  return Response.json(provider === 'openai'
    ? { choices: [{ message: { content: text || null, tool_calls: calls.map(call => ({ type: 'function', id: call.id, function: { name: call.name, arguments: JSON.stringify(call.arguments) } })) }, finish_reason: calls.length ? 'tool_calls' : 'stop' }], usage }
    : { content: [...(text ? [{ type: 'text', text }] : []), ...calls.map(call => ({ type: 'tool_use', id: call.id, name: call.name, input: call.arguments }))], stop_reason: calls.length ? 'tool_use' : 'end_turn', usage });
}
export function call(name: string, args: Record<string, unknown> = {}): ToolCall { return { id: `call_${name}`, name, arguments: args }; }
