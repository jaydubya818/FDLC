// Test-only transport. Loaded explicitly by the CLI integration test with --import.
// The product CLI has no mock-provider switch or fallback.
import { createHash } from 'node:crypto';
let step = 0;
globalThis.fetch = async (_url, init) => {
  const body = JSON.parse(String(init.body));
  const planning = body.tools.some(tool => (tool.function?.name ?? tool.name) === 'submit_plan');
  let name, args;
  if (planning) { name = 'submit_plan'; args = { summary: 'Repair addition.', steps: ['Read arithmetic module', 'Fix addition', 'Run project tests'] }; }
  else {
    const actions = [
      ['read_file', { path: 'math.mjs' }],
      ['write_file', { path: 'math.mjs', content: 'export const add = (a,b) => a+b;\n', expectedHash: createHash('sha256').update('export const add = (a,b) => a-b;\n').digest('hex') }],
      ['run_check', { id: 'test' }],
      ['finish_candidate', { summary: 'Addition repaired; actual project checks passed.', unresolved: [] }],
    ];
    [name, args] = actions[step++] ?? ['report_blocked', { reason: 'Fixture expected a successful prior operation.' }];
  }
  return Response.json({ choices: [{ message: { content: null, tool_calls: [{ id: 'fixture_call', type: 'function', function: { name, arguments: JSON.stringify(args) } }] }, finish_reason: 'tool_calls' }], usage: { prompt_tokens: 10, completion_tokens: 5 } });
};
