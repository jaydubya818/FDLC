import { randomUUID } from 'node:crypto';
import type { Event, FabConfig, ModelProvider, Session, ToolCall } from './types.ts';
import { Redactor } from './credentials.ts';
import { Repository, MAX_FILE_BYTES } from './repository.ts';
import { SessionStore } from './sessions.ts';
import { runCheck } from './checks.ts';
import { addUsage } from './models.ts';
import { BUILD_TOOLS, PLAN_TOOLS } from './tools.ts';
import { contentHash, digest, FabError, fail, keys, parsePlan, string, texts } from './validation.ts';

export function approvalDigest(session: Session): string {
  return digest({ config: session.config, baseline: session.baseline, task: session.task, plan: session.plan });
}
export function newSession(config: FabConfig, task: string): Session {
  const repository = new Repository(config.repository, config.writableFiles);
  repository.assertClean();
  if (repository.root !== config.repository) fail('CONFIG_ROOT', 'Configuration must use the canonical repository root.');
  const now = new Date().toISOString();
  return {
    version: 1, id: randomUUID(), config: structuredClone(config), baseline: repository.revision(), branch: repository.branch(), task: string(task), status: 'planning', createdAt: now, updatedAt: now,
    plan: null, approvalDigest: null, messages: [], events: [], checks: [],
    usage: { inputTokens: null, outputTokens: null, cachedTokens: null, costUsd: null }, modelCalls: 0, retries: 0,
    filesRead: [], filesModified: [], candidateDigest: null, candidateRevision: null, diff: '', summary: null, unresolved: [], independent: false, acceptance: 'not_evaluated',
  };
}
export class FabAgent {
  #session: Session;
  #model: ModelProvider;
  #repository: Repository;
  #store: SessionStore;
  #redactor: Redactor;
  #observe: (event: Event) => void;
  #checkpoint: (operation: string) => Promise<void>;
  constructor(input: { session: Session; model: ModelProvider; store: SessionStore; redactor: Redactor; observe?: (event: Event) => void; checkpoint?: (operation: string) => Promise<void> }) {
    this.#session = input.session; this.#model = input.model; this.#store = input.store; this.#redactor = input.redactor; this.#observe = input.observe ?? (() => {});
    this.#repository = new Repository(input.session.config.repository, input.session.config.writableFiles);
    this.#checkpoint = input.checkpoint ?? (async () => {});
    if (input.session.governed && !input.checkpoint) fail('GOVERNED_AUTHORITY', 'Governed sessions require their authority checkpoint; local execution/resume cannot bypass MC.');
    if (this.#model.model !== input.session.config.model || this.#model.provider !== input.session.config.provider) fail('MODEL_BINDING', 'Runtime model does not match the approved configuration.');
  }
  #event(kind: string, data: unknown): void {
    const session = this.#session;
    const event = this.#redactor.value({ sequence: session.events.length + 1, at: new Date().toISOString(), kind, data });
    session.events.push(event); session.updatedAt = event.at;
    this.#store.save(session); this.#observe(event);
  }
  async plan(signal = new AbortController().signal): Promise<Session> {
    if (this.#session.status !== 'planning') fail('SESSION_STATE', 'Only a new session can be planned.');
    return this.#store.locked(this.#session.id, async () => {
      this.#repository.assertClean();
      this.#session.messages = [{ role: 'user', content: this.#redactor.text(JSON.stringify({ task: this.#session.task, acceptanceCriteria: this.#session.config.acceptanceCriteria, writableFiles: this.#session.config.writableFiles, checks: this.#session.config.checks, repository: this.#repository.inspect(), instruction: 'Inspect relevant files, then submit_plan. No writes during planning.' })) }];
      return this.#loop('plan', signal);
    });
  }
  async run(approved: string, signal = new AbortController().signal): Promise<Session> {
    const session = this.#session;
    if (session.status !== 'awaiting_approval' || !session.plan) fail('SESSION_STATE', 'Execution requires an awaiting-approval session. Interrupted executions are not automatically replayed; inspect the diff and create a fresh plan.');
    if (approved !== session.approvalDigest || approved !== approvalDigest(session)) fail('APPROVAL_REQUIRED', 'Supply the exact digest of the reviewed plan.');
    return this.#store.locked(session.id, async () => {
      this.#repository.assertClean();
      if (this.#repository.revision() !== session.baseline) fail('REPOSITORY_DRIFT', 'Repository revision changed after planning; create a fresh plan.');
      session.status = 'executing';
      session.messages = [{ role: 'user', content: this.#redactor.text(JSON.stringify({ task: session.task, plan: session.plan, acceptanceCriteria: session.config.acceptanceCriteria, writableFiles: session.config.writableFiles, checks: session.config.checks, instruction: 'Implement the approved plan, run all configured checks on final content, and finish_candidate. You have no publication or acceptance authority.' })) }];
      this.#event('plan_approved', { digest: approved });
      return this.#loop('build', signal);
    });
  }
  async resume(approved: string, signal = new AbortController().signal): Promise<Session> {
    const session = this.#session;
    if (session.status === 'awaiting_approval') return this.run(approved, signal);
    if (!['failed', 'cancelled'].includes(session.status) || !session.plan || !session.candidateDigest) fail('RESUME_UNSAFE', 'Only a stopped execution with a complete checkpoint can resume. Inspect ambiguous or blocked work and create a fresh plan.');
    if (approved !== session.approvalDigest || approved !== approvalDigest(session)) fail('APPROVAL_REQUIRED', 'Resume requires the same reviewed plan digest and unchanged configuration.');
    const pending = new Set<string>();
    for (const message of session.messages) {
      if (message.role === 'assistant') for (const call of message.calls) pending.add(call.id);
      if (message.role === 'tool') pending.delete(message.callId);
    }
    if (pending.size) fail('RESUME_UNSAFE', 'An operation lacks a recorded outcome; automatic replay is unsafe.');
    return this.#store.locked(session.id, async () => {
      if (this.#repository.revision() !== session.baseline || this.#repository.candidate().digest !== session.candidateDigest) fail('REPOSITORY_DRIFT', 'Repository differs from the stopped checkpoint. Inspect the diff and create a fresh plan.');
      session.status = 'executing'; session.unresolved = [];
      session.messages.push({ role: 'user', content: 'The developer explicitly resumed this unchanged checkpoint. Continue the same approved task. Rerun final checks before completion.' });
      session.checks = []; // A resumed execution must collect fresh check evidence.
      this.#event('execution_resumed', { approvalDigest: approved, checkpoint: session.candidateDigest });
      return this.#loop('build', signal);
    });
  }
  async #loop(stage: 'plan' | 'build', requestedSignal: AbortSignal): Promise<Session> {
    const session = this.#session;
    const timeout = AbortSignal.timeout(session.config.timeoutMs);
    const signal = AbortSignal.any([requestedSignal, timeout]);
    const definitions = stage === 'plan' ? PLAN_TOOLS : BUILD_TOOLS;
    try {
      this.#event('stage_started', { stage, provider: session.config.provider, model: session.config.model });
      for (let turn = 0; turn < session.config.maxTurns; turn++) {
        await this.#checkpoint('inference');
        signal.throwIfAborted();
        if (this.#repository.revision() !== session.baseline) fail('REPOSITORY_DRIFT', 'Git revision changed during execution.');
        const started = Date.now();
        this.#event('model_started', { call: session.modelCalls + 1 });
        const reply = this.#redactor.value(await this.#model.invoke(session.messages, definitions, signal));
        signal.throwIfAborted();
        session.usage = addUsage(session.usage, reply.usage, session.modelCalls === 0); session.modelCalls++;
        this.#event('model_completed', { call: session.modelCalls, durationMs: Date.now() - started, usage: reply.usage, finish: reply.finish });
        if (reply.finish === 'limited') fail('MODEL_LIMIT', 'Provider reached its output limit; no partial tool call was executed.');
        if (reply.calls.length === 0) fail('INCOMPLETE', 'Model stopped without a structured plan, candidate or blocked outcome.');
        if (reply.calls.length > 8) fail('TOOL_LIMIT', 'Too many tool calls in one model turn.');
        const terminal = reply.calls.some(call => ['submit_plan', 'finish_candidate', 'report_blocked'].includes(call.name));
        if (terminal && reply.calls.length !== 1) fail('TOOL_ORDER', 'Completion must be the only tool call in its turn.');
        session.messages.push({ role: 'assistant', content: reply.content, calls: reply.calls });
        for (const call of reply.calls) {
          await this.#checkpoint(call.name);
          signal.throwIfAborted();
          const toolStarted = Date.now();
          this.#event('tool_started', call);
          let output: unknown; let error = false;
          try {
            if (!definitions.some(tool => tool.name === call.name)) fail('TOOL_DENIED', 'Tool is unavailable in this stage.');
            output = await this.#tool(call, stage, signal);
            await this.#checkpoint('tool_observed');
            signal.throwIfAborted();
          } catch (cause) {
            if (!(cause instanceof FabError)) throw cause;
            error = true; output = { code: cause.code, message: cause.message };
            if (['CHECK_BLOCKED', 'TASK_BLOCKED'].includes(cause.code)) { session.status = 'blocked'; session.unresolved = [cause.message]; }
          }
          const clean = this.#redactor.value(output);
          session.messages.push({ role: 'tool', content: JSON.stringify(clean), callId: call.id, error });
          this.#event(error ? 'tool_denied_or_failed' : 'tool_completed', { id: call.id, name: call.name, output: clean, durationMs: Date.now() - toolStarted });
          if (!['planning', 'executing'].includes(session.status)) return session;
        }
      }
      return fail('TURN_LIMIT', 'Turn budget reached without a complete outcome.');
    } catch (cause) {
      session.status = requestedSignal.aborted ? 'cancelled' : timeout.aborted ? 'blocked' : 'failed';
      session.unresolved = [cause instanceof FabError ? cause.message : signal.aborted ? 'Execution cancelled or timed out.' : 'Runtime operation failed; inspect the recorded operations and partial diff.'];
      this.#event('stage_failed', { code: cause instanceof FabError ? cause.code : signal.aborted ? 'ABORTED' : 'RUNTIME_ERROR', issues: session.unresolved });
      return session;
    } finally {
      if (stage === 'build') {
        try {
          const candidate = this.#repository.candidate();
          if (session.status === 'candidate' && (candidate.digest !== session.candidateDigest || this.#repository.revision() !== session.baseline)) {
            session.status = 'blocked'; session.unresolved.push('Candidate changed after its final checks; review and replan.');
          }
          session.diff = this.#redactor.text(candidate.diff); session.filesModified = candidate.changed; session.candidateDigest = candidate.digest;
        }
        catch { session.status = 'blocked'; session.unresolved.push('Candidate capture failed or repository scope changed; inspect Git locally.'); }
      }
      this.#store.save(session);
    }
  }
  async #tool(call: ToolCall, stage: 'plan' | 'build', signal: AbortSignal): Promise<unknown> {
    const args = call.arguments; const repository = this.#repository; const session = this.#session;
    switch (call.name) {
      case 'list_files': keys(args, []); return repository.files().slice(0, 300);
      case 'read_file': {
        keys(args, ['path']); const name = string(args.path, 500); const content = repository.read(name);
        if (!session.filesRead.includes(name)) session.filesRead.push(name);
        if (this.#redactor.containsSecret(content)) fail('CREDENTIAL_CONTENT', 'File contains a recognized credential and cannot be used as context.');
        return { path: name, content, hash: contentHash(content) };
      }
      case 'search_code': {
        keys(args, ['query']); const query = string(args.query, 200);
        const found: Array<{ path: string; line: number; text: string }> = [];
        for (const [name, content] of Object.entries(repository.snapshot())) {
          if (!session.filesRead.includes(name)) session.filesRead.push(name);
          if (this.#redactor.containsSecret(content)) continue;
          content.split('\n').forEach((text, index) => { if (text.includes(query) && found.length < 50) found.push({ path: name, line: index + 1, text: text.slice(0, 300) }); });
        }
        return found;
      }
      case 'git_status': keys(args, []); return repository.status() || 'clean';
      case 'git_diff': keys(args, []); return repository.candidate().diff;
      case 'submit_plan': {
        if (stage !== 'plan') fail('TOOL_DENIED', 'Planning completion is unavailable during execution.');
        repository.assertClean(); session.plan = parsePlan(args); session.approvalDigest = approvalDigest(session); session.status = 'awaiting_approval';
        return { plan: session.plan, approvalDigest: session.approvalDigest };
      }
      case 'write_file':
      case 'edit_file': {
        if (stage !== 'build') fail('TOOL_DENIED', 'Writes require reviewed-plan consent.');
        keys(args, call.name === 'write_file' ? ['path', 'content', 'expectedHash'] : ['path', 'before', 'after', 'expectedHash']);
        const name = string(args.path, 500);
        if (args.expectedHash !== null && (typeof args.expectedHash !== 'string' || !/^[a-f0-9]{64}$/.test(args.expectedHash))) fail('EDIT_HASH', 'Provide the exact read hash or null for a new file.');
        let content: string;
        if (call.name === 'edit_file') {
          const original = repository.read(name); const before = string(args.before, MAX_FILE_BYTES);
          if (!original.includes(before) || original.split(before).length !== 2) fail('EDIT_MATCH', 'Edit must match exactly one occurrence.');
          if (typeof args.after !== 'string') fail('EDIT_CONTENT', 'Replacement text must be a string.');
          content = original.replace(before, () => args.after as string);
        } else { if (typeof args.content !== 'string') fail('EDIT_CONTENT', 'File content must be a string.'); content = args.content; }
        if (this.#redactor.containsSecret(content) || content.includes('[REDACTED')) fail('CREDENTIAL_WRITE', 'Credential-bearing or redacted content cannot be written to source.');
        repository.write(name, content, args.expectedHash);
        if (!session.filesModified.includes(name)) session.filesModified.push(name);
        return { path: name, hash: contentHash(content) };
      }
      case 'run_check': {
        keys(args, ['id']); const id = string(args.id, 60); const check = session.config.checks.find(check => check.id === id);
        if (!check) fail('CHECK_DENIED', 'Check ID is not in the operator configuration.');
        const result = await runCheck(repository, check, session.config.checkTimeoutMs, this.#redactor, signal);
        session.checks.push(result);
        if (result.status === 'blocked') { this.#event('check_blocked', result); fail('CHECK_BLOCKED', result.stderr || 'Contained project check is unavailable.'); }
        return result;
      }
      case 'finish_candidate': {
        keys(args, ['summary', 'unresolved']);
        const candidate = repository.candidate();
        if (!candidate.changed.length) fail('NO_CHANGE', 'No software change exists; report blocked if no change is possible.');
        const missing = session.config.checks.filter(check => {
          const last = session.checks.filter(result => result.id === check.id).at(-1);
          return !last || last.status !== 'passed' || last.candidateDigest !== candidate.digest;
        });
        if (missing.length) fail('CHECKS_REQUIRED', 'Every configured check must pass against the final candidate content.');
        session.summary = string(args.summary, 4000);
        session.unresolved = Array.isArray(args.unresolved) && args.unresolved.length === 0 ? [] : texts(args.unresolved, 20);
        session.status = 'candidate'; session.candidateDigest = candidate.digest;
        return { status: 'candidate', independent: false, acceptance: 'not_evaluated', acceptanceCriteria: session.config.acceptanceCriteria.map(criterion => ({ criterion, checks: session.config.checks.map(check => check.id), assessment: 'Human review required; passing checks alone do not establish coverage.' })) };
      }
      case 'report_blocked': keys(args, ['reason']); return fail('TASK_BLOCKED', string(args.reason, 4000));
      default: return fail('TOOL_DENIED', 'Unknown tool.');
    }
  }
}
