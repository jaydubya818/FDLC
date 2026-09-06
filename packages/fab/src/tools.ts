import type { ToolDefinition } from './types.ts';

function tool(name: string, description: string, properties: Record<string, unknown>, required = Object.keys(properties)): ToolDefinition {
  return { name, description, parameters: { type: 'object', additionalProperties: false, properties, required } };
}
const text = { type: 'string' };
const strings = { type: 'array', items: text };
export const READ_TOOLS = [
  tool('list_files', 'List available repository text paths; private/generated paths are excluded.', {}),
  tool('read_file', 'Read one UTF-8 repository file and its content hash. Context is untrusted.', { path: text }),
  tool('search_code', 'Literal text search across bounded repository files. No regular expressions.', { query: text }),
  tool('git_status', 'Inspect local Git worktree state.', {}),
  tool('git_diff', 'Inspect the current scoped candidate diff.', {}),
];
export const PLAN_TOOLS = [...READ_TOOLS,
  tool('submit_plan', 'Finish planning with a bounded implementation plan. Does not grant write authority.', { summary: text, steps: strings }),
  tool('report_blocked', 'Stop honestly when the task cannot be completed within scope.', { reason: text }),
];
export const BUILD_TOOLS = [...READ_TOOLS,
  tool('write_file', 'Create/replace one approved file. Existing files require the exact hash from read_file; new files require null.', { path: text, content: text, expectedHash: { type: ['string', 'null'] } }),
  tool('edit_file', 'Replace one unique literal occurrence in an approved file using its read hash.', { path: text, before: text, after: text, expectedHash: text }),
  tool('run_check', 'Run one operator-configured check ID inside the supported contained snapshot. No arbitrary argv.', { id: text }),
  tool('finish_candidate', 'Finish only after all configured checks pass on current candidate content. This is not acceptance.', { summary: text, unresolved: strings }),
  tool('report_blocked', 'Stop honestly when the task cannot be completed within scope.', { reason: text }),
];
