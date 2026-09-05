import { closeSync, fsyncSync, openSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { randomUUID } from 'node:crypto';
import path from 'node:path';
import os from 'node:os';
import { parseArgs } from 'node:util';
import { createInterface } from 'node:readline/promises';
import { FabAgent, newSession } from './agent.ts';
import { EnvironmentCredentialProvider, Redactor, StoredCredentialProvider } from './credentials.ts';
import { KeychainCredentialStore } from './keychain.ts';
import { readMaskedCredential } from './masked-input.ts';
import { qualifyProvider } from './qualification.ts';
import { prepareEvaluation, runEvaluation } from './evaluation.ts';
import type { QualificationReport } from './qualification.ts';
import { HttpModelProvider } from './models.ts';
import { Repository } from './repository.ts';
import { SessionStore } from './sessions.ts';
import { digest, FabError, fail, parseConfig } from './validation.ts';
import type { Session } from './types.ts';

const HELP = `Fab — Factory Agent Builder (experimental local preview)
From intent to review-ready software.

fab inspect                         Inspect this repository without a model
fab config                          Print a non-secret configuration example
fab evaluate prepare FAMILY ROOT    Create a new bounded synthetic repository
fab evaluate run FAMILY --live --maximum-requests N --qualification FILE
                                    Evaluate using the exact configured scope
fab models                          Show adapter maturity and limitations
fab auth --config /path/config.json  Show explicit credential metadata
fab auth add|remove|test <provider> --config /path/config.json
fab auth list                       List Fab keychain metadata only
fab qualify provider <provider> --config /path/config.json [--live]
fab plan "task" --config /path/config.json
fab run <session-id> --config /path/config.json --approve <plan-digest>
fab run "task" --config /path/config.json   Plan and ask for consent in a terminal
fab status <session-id> --config /path/config.json
fab diff <session-id> --config /path/config.json
fab resume <session-id> --config /path/config.json --approve <plan-digest>

Optional: --state-dir /private/path (outside repository, mode 0700)
No remote execution, PR publication or independent acceptance in this preview.
Select your own Fab keychain reference or explicit FAB_ environment credential.
Enrollment input is hidden. Never put a key in argv. --live makes up to three paid requests.
`;

function summary(session: Session): unknown {
  return { session: session.id, status: session.status, repository: session.config.repository, branch: session.branch, task: session.task,
    plan: session.plan, approvalDigest: session.approvalDigest, provider: session.config.provider, model: session.config.model,
    filesModified: session.filesModified, checks: session.checks.map(({ id, status, durationMs, candidateDigest }) => ({ id, status, durationMs, candidateDigest })),
    usage: session.usage, modelCalls: session.modelCalls, retries: session.retries,
    candidateDigest: session.candidateDigest, candidateRevision: session.candidateRevision, summary: session.summary, unresolved: session.unresolved,
    independent: session.independent, acceptance: session.acceptance, governed: session.governed ?? null };
}

export async function main(argv = process.argv.slice(2)): Promise<void> {
  const redactor = new Redactor();
  const print = (value: unknown) => process.stdout.write(redactor.terminal(typeof value === 'string' ? value : JSON.stringify(value, null, 2)) + '\n');
  try {
    const { positionals, values } = parseArgs({ args: argv, allowPositionals: true, strict: true,
      options: { config: { type: 'string' }, 'state-dir': { type: 'string' }, approve: { type: 'string' }, live: { type: 'boolean' }, qualification: { type: 'string' }, 'maximum-requests': { type: 'string' }, help: { type: 'boolean', short: 'h' } } });
    const command = positionals[0];
    if (values.help || !command) { print(HELP); return; }
    if (command === 'models') {
      print({ providers: ['openai', 'anthropic'], maturity: 'Experimental HTTP adapters; deterministic protocol tests only', qualifiedModels: [], modelSelection: 'Explicit model ID required', streaming: false, reasoningControls: false, contextWindow: null, costUsd: null }); return;
    }
    if (command === 'inspect') { print(new Repository(process.cwd()).inspect()); return; }
    if (command === 'evaluate' && positionals[1] === 'prepare' && positionals.length === 4) {
      print(prepareEvaluation(positionals[2]!, positionals[3]!)); return;
    }
    if (command === 'config') {
      const repository = realpathSync(process.cwd());
      print({ version: 1, repository, provider: 'openai', model: 'YOUR_EXPLICIT_MODEL_ID', credential: {
        id: randomUUID(), owner: `local:${process.getuid?.() ?? 'user'}`, provider: 'openai', scope: { kind: 'repository', root: repository }, source: { kind: 'keychain' },
      }, writableFiles: ['src/example.ts'], checks: [{ id: 'test', argv: [process.execPath, '--test', '--test-isolation=none'] }], acceptanceCriteria: ['Describe the expected behavior and relevant checks.'], maxTurns: 16, timeoutMs: 300000, checkTimeoutMs: 30000 }); return;
    }
    if (!['auth', 'qualify', 'evaluate', 'plan', 'run', 'resume', 'status', 'diff'].includes(command)) fail('COMMAND_UNKNOWN', 'Unknown command. Run fab --help.');
    const secureStore = new KeychainCredentialStore(redactor);
    if (command === 'auth' && positionals[1] === 'list' && positionals.length === 2) { print(await secureStore.listMetadata()); return; }
    if (!values.config || !path.isAbsolute(values.config)) fail('CONFIG_REQUIRED', 'Supply an absolute --config path to your operator-owned JSON configuration.');
    const configText = readFileSync(values.config, 'utf8');
    if (Buffer.byteLength(configText) > 32000) fail('CONFIG_LIMIT', 'Configuration exceeds 32 KB.');
    const config = parseConfig(JSON.parse(configText));
    const configPath = realpathSync(values.config);
    if (configPath === config.repository || configPath.startsWith(config.repository + path.sep)) fail('CONFIG_AUTHORITY', 'Operator configuration must be outside the repository. Repository content cannot grant authority.');
    if (config.credential.owner !== `local:${process.getuid?.() ?? 'user'}`) fail('CREDENTIAL_OWNER', 'Local credential owner must match this OS user. Use fab config for an example.');
    if (command === 'auth' && positionals.length > 1) {
      const operation = positionals[1];
      if (!['add', 'remove', 'test'].includes(operation ?? '') || positionals[2] !== config.provider || positionals.length !== 3) fail('AUTH_COMMAND', 'Use fab auth add|remove|test with the exact configured provider.');
      if (operation !== 'test') {
        if (config.credential.source.kind !== 'keychain') fail('CREDENTIAL_SOURCE', 'Add/remove require a keychain reference. Manage explicitly selected environment variables in your own shell.');
        if (redactor.containsSecret(configText)) fail('CONFIG_SECRET', 'Configuration must contain only a credential reference.');
        if (operation === 'add') await secureStore.set(config.credential, await readMaskedCredential());
        else await secureStore.delete(config.credential);
        print({ reference: config.credential.id, operation, status: 'complete', providerRevoked: false }); return;
      }
    }
    if (command === 'qualify' && (positionals[1] !== 'provider' || positionals[2] !== config.provider || positionals.length !== 3)) fail('QUALIFY_COMMAND', 'Use fab qualify provider with the exact configured provider; model comes only from config.');
    const credentials = config.credential.source.kind === 'environment'
      ? new EnvironmentCredentialProvider(config.credential, redactor)
      : await StoredCredentialProvider.create(config.credential, secureStore, redactor);
    // Register a selected stored value before task/config output or model request serialization.
    if (config.credential.source.kind === 'keychain' && credentials.metadata().configured && !['auth', 'status', 'diff'].includes(command)) await credentials.use(config.credential, async () => {});
    if (redactor.containsSecret(configText)) fail('CONFIG_SECRET', 'Configuration contains credential-like text; store only a reference.');
    if (command === 'auth') {
      if (positionals[1] === 'test') {
        const model = new HttpModelProvider({ provider: config.provider, model: config.model, credentials, reference: config.credential, redactor });
        const reply = await model.invoke([{ role: 'user', content: 'Reply FAB_OK. Do not use tools.' }], [], AbortSignal.timeout(60000));
        print({ ...credentials.metadata(), validated: true, requestedModel: config.model, returnedModel: reply.returnedModel, usage: reply.usage, message: 'One authenticated inference succeeded; full qualification is separate.' });
      } else print({ ...credentials.metadata(), validated: false, message: 'Presence is not provider authentication validation.' });
      return;
    }
    const store = new SessionStore(values['state-dir'] ?? path.join(os.homedir(), '.local', 'state', 'fab'), config.repository, redactor);
    if (command === 'evaluate') {
      if (positionals[1] !== 'run' || positionals.length !== 3 || !values.qualification || !path.isAbsolute(values.qualification) || !values['maximum-requests']) {
        fail('EVALUATION_COMMAND', 'Use evaluate run FAMILY with --live, --maximum-requests and an absolute --qualification report path.');
      }
      const bytes = readFileSync(values.qualification);
      if (bytes.byteLength > 100000) fail('EVALUATION_QUALIFICATION', 'Provider qualification report exceeds its byte limit.');
      const controller = new AbortController(); const cancel = () => controller.abort();
      process.once('SIGINT', cancel); process.once('SIGTERM', cancel);
      try {
        const report = await runEvaluation({ family: positionals[2]!, config, qualification: JSON.parse(bytes.toString('utf8')) as QualificationReport,
          credentials, redactor, store, signal: controller.signal, live: values.live === true, maximumRequests: Number(values['maximum-requests']) });
        const output = path.join(store.directory, `evaluation-${report.sessionId}.json`);
        writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
        print(report); print(`Evidence: ${output}`); process.exitCode = report.completion ? 0 : 2;
      } finally { process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
      return;
    }
    if (command === 'qualify') {
      const controller = new AbortController(); const cancel = () => controller.abort();
      const identity = randomUUID();
      const journal = path.join(store.directory, `qualification-${identity}-requests.jsonl`);
      const journalFd = openSync(journal, 'wx', 0o600);
      process.once('SIGINT', cancel); process.once('SIGTERM', cancel);
      try {
        const report = await qualifyProvider({ config, credentials, redactor, live: values.live === true, signal: controller.signal,
          observe: receipt => { writeFileSync(journalFd, JSON.stringify(redactor.value(receipt)) + '\n'); fsyncSync(journalFd); } });
        const output = path.join(store.directory, `qualification-${identity}.json`);
        writeFileSync(output, JSON.stringify(report, null, 2) + '\n', { mode: 0o600, flag: 'wx' });
        print(report); print(`Evidence: ${output}`); print(`Request journal: ${journal}`); process.exitCode = report.status === 'FAIL' ? 2 : 0;
      } finally { closeSync(journalFd); process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
      return;
    }
    const input = positionals.slice(1).join(' ');
    if (!input) fail('INPUT_REQUIRED', 'Supply a task or session ID. Run fab --help.');
    if (command === 'status' || command === 'diff') {
      const session = store.load(input);
      if (digest(config) !== digest(session.config)) fail('CONFIG_DRIFT', 'Configuration differs from this session. Use its original configuration.');
      print(command === 'diff' ? session.diff || '(No captured diff. For an interrupted execution, inspect Git locally.)' : summary(session)); return;
    }
    if (!credentials.metadata().configured) fail('CREDENTIAL_MISSING', 'Enroll your configured keychain reference, or set the explicitly selected FAB_ environment variable.');
    const model = new HttpModelProvider({ provider: config.provider, model: config.model, credentials, reference: config.credential, redactor });
    const controller = new AbortController();
    const cancel = () => controller.abort();
    process.once('SIGINT', cancel); process.once('SIGTERM', cancel);
    try {
      const existing = /^[a-f0-9-]{36}$/.test(input) && command !== 'plan';
      let session = existing ? store.load(input) : newSession(config, redactor.text(input));
      if (digest(config) !== digest(session.config)) fail('CONFIG_DRIFT', 'Configuration differs from the reviewed session; create a fresh plan.');
      if (command === 'resume' && !existing) fail('SESSION_ID', 'Resume requires a session ID.');
      const agent = new FabAgent({ session, model, store, redactor, observe: event => {
        process.stderr.write(redactor.terminal(`[${event.sequence}] ${event.kind}${event.kind === 'tool_started' ? ` ${String((event.data as { name?: string }).name ?? '')}` : ''}`) + '\n');
      } });
      if (!existing) { session = await agent.plan(controller.signal); print(summary(session)); }
      const resumable = command === 'resume' && ['failed', 'cancelled'].includes(session.status);
      if (command === 'plan' || (session.status !== 'awaiting_approval' && !resumable)) { if (existing) print(summary(session)); process.exitCode = session.status === 'awaiting_approval' ? 0 : 2; return; }
      let approved = values.approve;
      if (!approved && process.stdin.isTTY && process.stdout.isTTY) {
        if (existing) print(summary(session));
        print({ writableFiles: config.writableFiles, checks: config.checks, notice: 'Approval permits local candidate edits and contained checks. It does not accept or publish software.' });
        const input = createInterface({ input: process.stdin, output: process.stdout });
        try { if ((await input.question('Apply this plan? Type yes: ', { signal: controller.signal })).trim() === 'yes') approved = session.approvalDigest!; }
        finally { input.close(); }
      }
      if (!approved) fail('APPROVAL_REQUIRED', 'Plan saved. Review it, then run this session with --approve and its exact plan digest.');
      session = command === 'resume' ? await agent.resume(approved, controller.signal) : await agent.run(approved, controller.signal);
      print(summary(session));
      if (session.diff) print(session.diff);
      print(`Evidence: ${path.join(store.directory, session.id + '.json')}`);
      process.exitCode = session.status === 'candidate' ? 0 : session.status === 'cancelled' ? 130 : 2;
    } finally { process.removeListener('SIGINT', cancel); process.removeListener('SIGTERM', cancel); }
  } catch (error) {
    const message = error instanceof FabError ? `${error.code}: ${error.message}` : 'Fab could not complete the operation. Check the command, private config/state paths and repository. Raw error details were withheld.';
    process.stderr.write(redactor.terminal(message) + '\n'); process.exitCode = 2;
  }
}
