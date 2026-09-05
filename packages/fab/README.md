# Fab — Factory Agent Builder

The software engineering agent for the Factory Development Lifecycle.

**Experimental local CLI.** Understand one repository, review a bounded plan, implement scoped changes, run contained project checks and inspect a candidate diff with evidence. Fab has no independent acceptance or publication authority.

## What works

- One clean, committed local Git repository; repository/language/build/test inspection.
- Explicit user-owned macOS Keychain or environment credential reference, scoped to OS user, provider and repository.
- Native read/plan/edit/check loop with OpenAI and Anthropic HTTP adapters.
- Exact file allowlist, content-hash edits, plan consent, secret filtering and bounded context.
- Real project commands in a disposable macOS sandbox snapshot, with no model credentials or network.
- Private local sessions, ordered events, diff/check evidence, cancellation and guarded resume.
- Opt-in provider qualification with exact model identity, usage and explicit PASS/FAIL/NOT RUN results.
- Experimental MC harness adapter using its existing Attempt, candidate, verifier and publication lifecycle.
- Deterministic two-provider protocol and engineering-flow qualification using **mock model responses and real local operations**. No live model is qualified yet.

## Requirements and installation

Node.js 24+, Git at `/usr/bin/git`, macOS with `/usr/bin/sandbox-exec` for contained checks. The current proof uses Homebrew Node 24 on macOS arm64. Building the native Keychain bridge and check supervisor also requires Apple Command Line Tools; installed packages contain both compiled helpers. This preview is qualified only on macOS; other platforms are unqualified and cannot complete checks. A nested sandbox may prohibit `sandbox-exec`. There is no unsafe fallback.

From the FDLC checkout, using the already-installed development dependencies:

```sh
npm --prefix packages/fab run typecheck
npm --prefix packages/fab run build
node packages/fab/bin/fab.mjs --help
```

The built package contains plain JavaScript and has no runtime npm dependencies. To install a local copy into a directory you control:

```sh
npm install --prefix "$HOME/.local/share/fab-cli" --install-links --ignore-scripts /absolute/path/to/FDLC/packages/fab
export PATH="$HOME/.local/share/fab-cli/node_modules/.bin:$PATH"
fab --help
```

This is a private local package, not a published npm release. Do not install it from an unverified public package with a similar name. For standalone development after extraction, install this package's pinned dev dependencies and run the same scripts.

## Configure your own account

Inside the repository you want Fab to work on:

```sh
fab inspect
fab config > "$HOME/fab-project.json"
```

Edit that JSON outside the repository. Choose an explicit model ID, exact writable files, acceptance criteria and fixed check commands. Use the absolute executable path printed by your Node installation. Example fields:

```json
{
  "version": 1,
  "repository": "/absolute/path/to/my-project",
  "provider": "openai",
  "model": "YOUR_EXPLICIT_MODEL_ID",
  "credential": {
    "id": "model:default",
    "owner": "local:YOUR_OS_UID",
    "provider": "openai",
    "scope": { "kind": "repository", "root": "/absolute/path/to/my-project" },
    "source": { "kind": "keychain" }
  },
  "writableFiles": ["src/math.mjs"],
  "checks": [{ "id": "test", "argv": ["/absolute/path/to/node", "--test", "--test-isolation=none"] }],
  "acceptanceCriteria": ["Addition returns the sum, including negative inputs."],
  "maxTurns": 16,
  "timeoutMs": 300000,
  "checkTimeoutMs": 30000
}
```

`fab config` fills the actual root, OS UID and Node path, and creates a random opaque keychain reference. Choose your exact provider and model, then enroll your own key:

```sh
fab auth add openai --config "$HOME/fab-project.json"
fab auth list
fab auth --config "$HOME/fab-project.json"
# Optional: one paid inference to test authentication with the configured model.
fab auth test openai --config "$HOME/fab-project.json"
# Offline contract checks and explicit NOT RUN live results:
fab qualify provider openai --config "$HOME/fab-project.json"
# Deliberate opt-in: up to three paid provider requests, with no repository context.
fab qualify provider openai --config "$HOME/fab-project.json" --live
fab auth remove openai --config "$HOME/fab-project.json"
```

Enrollment input is hidden and travels to macOS Security.framework through stdin, never argv. `auth add` also rotates an existing reference. `auth list` reads only Fab's metadata; `auth remove` deletes the local entry and does not revoke the key at the provider. Authentication testing and qualification never run during ordinary tests or builds. Change both provider fields and the model explicitly for Anthropic.

For headless use, deliberately replace `credential.source` with `{"kind":"environment","variable":"FAB_MODEL_KEY"}` and set that exact variable in your shell. There is no precedence chain: the configured source is the only source. A missing keychain entry never falls back to environment values. Environment storage is not encrypted storage.

OpenAI/Anthropic standard environment keys, `.env`, shell history, unrelated keychain entries, cloud profiles and browser logins are not discovered. No raw secret belongs in configuration. The keychain is a local OS-user store; hosted tenant storage and remote short-lived provider grants remain unimplemented.

Qualification records authentication, inference, JSON tool arguments, continuation, requested/returned model IDs, usage and latency. Error/redaction/cancellation/timeout/context tests use separately labeled fault-injected transports. Streaming, native schema-response mode, reasoning controls and context-window discovery report NOT RUN. Passing protocol checks does not measure autonomous engineering quality or qualify a production release.

## Plan, implement and review

```sh
fab plan "Fix addition for negative numbers" --config "$HOME/fab-project.json"
fab run SESSION_ID --config "$HOME/fab-project.json" --approve PLAN_DIGEST
fab status SESSION_ID --config "$HOME/fab-project.json"
fab diff SESSION_ID --config "$HOME/fab-project.json"
```

Planning outputs the concrete plan and consent digest. Review the plan, exact files and commands in your config before applying. `fab run "task" --config ...` combines planning with a terminal confirmation; headless use requires the saved session ID and digest. No write occurs without consent. Editing configuration or the Git baseline invalidates consent.

Candidate means a nonempty scoped diff with every configured check passing on that exact captured content. It does not establish acceptance-criterion coverage, independent verification, human acceptance or production readiness. Review the tests themselves, diff and unresolved issues. Fab never commits, pushes, opens a PR or deploys.

Ctrl-C cancels active work. A normally stopped failed/cancelled execution can be resumed explicitly with `fab resume SESSION_ID --config ... --approve PLAN_DIGEST` if the repository, configuration and complete tool checkpoint still match. Completed writes are not replayed. Abrupt process death, missing tool outcomes, uncertain locks, scope changes or drift block automatic resume. Inspect Git and session evidence before manually resolving an abandoned lock or creating a fresh plan. Existing changes are never auto-stashed or reset.

A native supervisor watches each check's parent pipe. If Fab dies, including SIGKILL, it terminates the sandboxed check and removes its snapshot. Timeout, cancellation and output overflow use the same cleanup path. This is local process cleanup; it does not reconcile an uncertain governed Attempt or grant permission to replay it.

Sessions live in `~/.local/state/fab` with private directory/file permissions, or an explicit `--state-dir` outside the repository. A session contains task/plan, references, events, observed checks, nullable usage/cost and a redacted diff. It is local user-owned evidence, not tamper-proof MC evidence. The stored diff is the captured candidate; inspect Git for subsequent external changes. Delete the selected session JSON after review to remove its retained task/code context; provider-side retention is separate.

## Current limits

- The check snapshot supports at most 300 UTF-8 source files, 100 KB per file and 2 MB total. Hidden, credential, binary, linked and generated/dependency paths are excluded or rejected. No dependency installation, copied `node_modules`, writable Git metadata or arbitrary shell tool.
- Checks run one configured system/Homebrew executable. Child processes (including detached daemons), other binaries, external services and network are denied. Node tests must use `--test-isolation=none`. The current qualified workload is dependency-free Node tests. Projects needing package managers, child processes, native binaries, hidden configs or installed dependency trees need additional qualification.
- Model request context is capped at 200 KB; responses at 1 MB, output at 4,096 requested tokens; sessions at 8 MB. No RAG, compaction, token streaming, reasoning controls or model fallback. Automatic provider retries are zero; failed requests require deliberate resume/retry.
- Cost and context-window metadata remain unknown, not zero. Model token usage is reported when supplied. No claim of current model support or prices merely because an adapter accepts an ID.
- Local file guards assume an operator-controlled checkout without a concurrent same-user adversary. The macOS check sandbox is an experimental boundary with measured tests, not universal hostile-code containment certification. The entire agent process is not an MC-admitted sandbox.
- No hosted secret store, Git authentication/clone, multi-repository writes, IDE, browser, remote worker, MCP or skill registry. The MC adapter is an opt-in local integration; it has no independent acceptance or publication authority and rejects whole-agent WORKSPACE_ONLY isolation. See the [Phase 2 record](../../docs/fab/FAB-PHASE-2.md).

## Reproduce qualification

```sh
npm --prefix packages/fab run build
npm --prefix packages/fab run typecheck
npm --prefix packages/fab run lint
npm --prefix packages/fab test
# On a Mac where sandbox-exec can create its own sandbox:
npm --prefix packages/fab run test:contained
```

The default suite explicitly skips OS containment, terminal and native-keychain cases that require the full local qualification environment. The full suite must report **zero skipped tests** to qualify local execution. It exercises actual source edits/Git diffs/process results, a built-CLI flow, failing-test repair, stale-evidence rejection, resume, impossible tasks, scope/credential attacks and OS-denial behavior. Mock transcripts are fixed fixtures, not autonomous model performance measurements. Tests never use your configured provider account.

See [the audit](../../docs/fab/FAB-REUSE-AUDIT.md), [architecture](../../docs/fab/FAB-ARCHITECTURE.md), [security design](../../docs/fab/FAB-SECURITY.md), [product specification](../../docs/fab/FAB-PRODUCT-SPEC.md), [implementation plan](../../docs/fab/FAB-IMPLEMENTATION-PLAN.md) and [qualification record](../../docs/fab/FAB-QUALIFICATION.md).
