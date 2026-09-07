import { execFileSync } from 'node:child_process';
import { mkdirSync, realpathSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { FabAgent, newSession } from './agent.ts';
import { runCheck } from './checks.ts';
import { Redactor } from './credentials.ts';
import { HttpModelProvider } from './models.ts';
import { BedrockModelProvider, type BedrockBrokerTransport } from './bedrock.ts';
import { Repository } from './repository.ts';
import { SessionStore } from './sessions.ts';
import { digest, fail, integer } from './validation.ts';
import type { CredentialProvider, FabConfig, ProviderRequestReceipt } from './types.ts';
import type { QualificationReport } from './qualification.ts';

/** Tasks and reference checks, never model answers. Reference checks remain outside model-writable scope. */
const SCENARIOS = {
  'bug-fix': {
    file: 'math.mjs', before: 'export const add = (a,b) => a-b;\n',
    task: 'Fix add so it correctly adds positive, negative and fractional numbers. Preserve the named export.',
    check: "import {add} from './math.mjs'; import assert from 'node:assert/strict'; assert.equal(add(2,3),5); assert.equal(add(-2,3),1); assert.equal(add(.25,.5),.75);",
  },
  feature: {
    file: 'page.mjs', before: 'export const page = values => values;\n',
    task: 'Add a limit argument to page. Return up to that many initial values without mutating input; zero returns an empty list. The limit is a nonnegative integer.',
    check: "import {page} from './page.mjs'; import assert from 'node:assert/strict'; const a=[1,2,3]; assert.deepEqual(page(a,2),[1,2]); assert.deepEqual(page(a,0),[]); assert.deepEqual(page(a,8),a); assert.deepEqual(a,[1,2,3]);",
  },
  refactor: {
    file: 'greet.mjs', before: "export function greet(name) { return 'Hello ' + name; }\n",
    task: 'Refactor greet to an exported const arrow function using a template literal, preserving behavior.',
    check: "import {greet} from './greet.mjs'; import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.equal(greet('Ada'),'Hello Ada'); assert.equal(greet(''),'Hello '); const text=readFileSync('greet.mjs','utf8'); assert.match(text,/export\\s+const\\s+greet/); assert(text.includes('=>') && text.includes('`'));",
  },
  'test-repair': {
    file: 'app.test.mjs', before: "import assert from 'node:assert/strict'; assert.equal(2+2,5);\n",
    task: 'Repair the incorrect expected value in the arithmetic assertion. Keep a real assertion that 2+2 equals its correct result; do not remove the test.',
    check: "import './app.test.mjs'; import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; assert.match(readFileSync('app.test.mjs','utf8'),/assert\\.equal\\(\\s*2\\s*\\+\\s*2\\s*,\\s*4\\s*\\)/);",
  },
  component: {
    file: 'formatter.mjs', before: null,
    task: 'Create formatter.mjs exporting formatLabel. It trims surrounding whitespace and converts the remaining string to uppercase. Empty or whitespace-only strings return an empty string.',
    check: "import {formatLabel} from './formatter.mjs'; import assert from 'node:assert/strict'; assert.equal(formatLabel(' fab '),'FAB'); assert.equal(formatLabel(''),''); assert.equal(formatLabel('  '),''); assert.equal(formatLabel('Ab c'),'AB C');",
  },
} as const;
export type EvaluationFamily = keyof typeof SCENARIOS;
function scenarioFor(family: string) {
  if (!Object.hasOwn(SCENARIOS, family)) fail('EVALUATION_FAMILY', 'Select bug-fix, feature, refactor, test-repair or component.');
  return SCENARIOS[family as EvaluationFamily];
}
function initialFiles(family: string) {
  const scenario = scenarioFor(family);
  return { 'TASK.md': scenario.task + '\n', ...(scenario.before === null ? {} : { [scenario.file]: scenario.before }) };
}
export function evaluationScope(family: string) {
  const scenario = scenarioFor(family);
  return { task: scenario.task, writableFiles: [scenario.file], acceptanceCriteria: [scenario.task],
    checks: [{ id: 'reference', argv: [process.execPath, '--input-type=module', '-e', scenario.check] }] };
}
/** Create a new local fixture only; never reset an existing checkout or enroll a credential. */
export function prepareEvaluation(family: string, directory: string) {
  const files = initialFiles(family);
  if (!path.isAbsolute(directory)) fail('EVALUATION_ROOT', 'Supply a new absolute evaluation directory.');
  mkdirSync(directory, { mode: 0o700 });
  const root = realpathSync(directory);
  for (const [name, content] of Object.entries(files)) writeFileSync(path.join(root, name), content, { flag: 'wx', mode: 0o600 });
  const git = (args: string[]) => execFileSync('/usr/bin/git', ['-c', 'core.hooksPath=/dev/null', '-c', 'commit.gpgsign=false', ...args], {
    cwd: root, stdio: 'ignore', env: { PATH: '/usr/bin:/bin', HOME: '/nonexistent', GIT_CONFIG_GLOBAL: '/dev/null', GIT_CONFIG_NOSYSTEM: '1',
      GIT_AUTHOR_NAME: 'Fab Qualification Fixture', GIT_AUTHOR_EMAIL: 'fixture@example.invalid', GIT_COMMITTER_NAME: 'Fab Qualification Fixture', GIT_COMMITTER_EMAIL: 'fixture@example.invalid' },
  });
  git(['init', '-q']); git(['add', '--', ...Object.keys(files)]); git(['commit', '-qm', 'Bounded Fab evaluation fixture']);
  return { family, repository: root, sourceRevision: new Repository(root).revision(), ...evaluationScope(family),
    nextAction: 'Create an operator configuration outside this repository using this exact scope. Explicitly enroll its repository-bound credential. Qualify the exact provider/model, then authorize the bounded evaluation.' };
}

export async function runEvaluation(input: {
  family: string; config: FabConfig; qualification: QualificationReport; credentials: CredentialProvider;
  redactor: Redactor; store: SessionStore; signal: AbortSignal; live: boolean; maximumRequests: number; fetchImpl?: typeof fetch;
  bedrockTransport?: BedrockBrokerTransport;
}) {
  const { config, qualification, redactor } = input;
  if (!input.live) fail('EVALUATION_AUTHORIZATION', 'Live evaluation requires explicit --live authorization and a request budget.');
  integer(input.maximumRequests, 1, 24);
  const scope = evaluationScope(input.family);
  if (digest({ writableFiles: config.writableFiles, checks: config.checks, acceptanceCriteria: config.acceptanceCriteria }) !==
    digest({ writableFiles: scope.writableFiles, checks: scope.checks, acceptanceCriteria: scope.acceptanceCriteria })) fail('EVALUATION_SCOPE', 'Configuration must match the prepared scenario scope exactly.');
  const repository = new Repository(config.repository, config.writableFiles);
  repository.assertClean();
  if (digest(repository.snapshot()) !== digest(initialFiles(input.family))) fail('EVALUATION_BASELINE', 'Evaluation requires the unmodified synthetic scenario baseline. No reset was attempted.');
  const age = Date.now() - Date.parse(qualification.completedAt);
  if (qualification.status !== 'PASS' || qualification.transport !== (input.fetchImpl ? 'INJECTED' : 'LIVE')
    || qualification.provider !== config.provider || qualification.requestedModel !== config.model
    || qualification.credentialReference !== config.credential.id || !Number.isFinite(age) || age < 0 || age > 24 * 60 * 60 * 1000
    || !qualification.returnedModels?.length || qualification.requests?.filter(item => item.phase === 'SUCCEEDED').length !== 3) {
    fail('EVALUATION_QUALIFICATION', 'A matching successful provider qualification from the last 24 hours is required.');
  }
  let requestCount = 0;
  if (config.provider === 'bedrock' ? !input.bedrockTransport || input.fetchImpl : Boolean(input.bedrockTransport)) {
    fail('BROKER_REQUIRED', 'Bedrock evaluation requires exactly one host-supplied broker transport.');
  }
  const reserveRequest = () => {
    if (requestCount >= input.maximumRequests) fail('PROVIDER_BUDGET', 'Authorized evaluation request budget exhausted.');
    requestCount++;
  };
  const model = config.provider === 'bedrock'
    ? new BedrockModelProvider({ config, redactor, maximumOutputTokens: 4096, transport: {
        identity: () => input.bedrockTransport!.identity(),
        invoke: async (request, signal) => { reserveRequest(); return await input.bedrockTransport!.invoke(request, signal); },
      } })
    : new HttpModelProvider({ provider: config.provider, model: config.model, credentials: input.credentials, reference: config.credential, redactor,
        fetchImpl: async (...args) => { reserveRequest(); return (input.fetchImpl ?? fetch)(...args); } });
  const session = newSession(config, scope.task); input.store.reserve(session);
  const agent = new FabAgent({ session, model, store: input.store, redactor,
    checkpoint: async operation => {
      if (operation === 'inference' && requestCount >= input.maximumRequests) fail('PROVIDER_BUDGET', 'Authorized evaluation request budget exhausted.');
    } });
  await agent.plan(input.signal);
  if (session.status === 'awaiting_approval' && session.approvalDigest) await agent.run(session.approvalDigest, input.signal);
  const candidateBefore = repository.candidate().digest;
  const referenceCheck = session.status === 'candidate'
    ? await runCheck(repository, scope.checks[0]!, config.checkTimeoutMs, redactor, input.signal) : null;
  const candidateUnchanged = repository.candidate().digest === candidateBefore && repository.revision() === session.baseline;
  const requests = new Map<string, ProviderRequestReceipt>();
  for (const event of session.events) if (event.kind === 'provider_request') {
    const receipt = event.data as ProviderRequestReceipt; requests.set(receipt.localRequestId, receipt);
  }
  const complete = session.status === 'candidate' && referenceCheck?.status === 'passed' && candidateUnchanged;
  return redactor.value({ version: 1, family: input.family, transport: input.fetchImpl ? 'INJECTED' : 'LIVE', maturity: 'Experimental',
    inputClassification: 'PUBLIC_SYNTHETIC_FIXTURE', repository: config.repository, sourceRevision: session.baseline, sessionId: session.id,
    provider: config.provider, requestedModel: config.model, returnedModels: [...new Set([...requests.values()].map(item => item.returnedModel).filter(Boolean))],
    qualificationCompletedAt: qualification.completedAt, completion: complete, firstPassCheckSuccess: session.checks[0] ? session.checks[0].status === 'passed' : null,
    requestCount, maximumRequests: input.maximumRequests, maximumOutputTokensPerRequest: 4096, modelInvocations: session.modelCalls, retries: session.retries,
    elapsedMs: Date.now() - Date.parse(session.createdAt), usage: session.usage, costClassification: session.usage.costUsd === null ? 'UNKNOWN' : 'ACTUAL',
    humanInterventions: 0, planAuthorization: 'EXPLICIT_BOUNDED_EVALUATION_INVOCATION', correctionAttempts: 0,
    referenceCheck, candidateUnchanged, candidateDigest: session.candidateDigest, sessionStatus: session.status,
    failureClassification: complete ? null : !candidateUnchanged ? 'CANDIDATE_DRIFT' : referenceCheck ? 'REFERENCE_CHECK_FAILED' : session.events.filter(event => event.kind === 'stage_failed').at(-1)?.data ?? session.status,
    requests: [...requests.values()], limitations: ['A bounded local reference check is not a canonical independent Mission Control verifier Attempt.', 'Same-user local agent; only project checks are OS-contained.', 'These five scenarios cannot establish general coding-agent quality.', 'No publication or merge authority.'],
  });
}
