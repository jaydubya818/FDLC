# Fab — Factory Agent Builder

The software engineering agent for the Factory Development Lifecycle.

**Experimental local CLI.** Understand one repository, review a bounded plan, implement scoped changes, run contained project checks and inspect a candidate diff with evidence. Fab has no independent acceptance or publication authority.

## What works

- One clean, committed local Git repository; repository/language/build/test inspection.
- Explicit user-owned environment credential reference, scoped to OS user, provider and repository.
- Native read/plan/edit/check loop with OpenAI and Anthropic HTTP adapters.
- Exact file allowlist, content-hash edits, plan consent, secret filtering and bounded context.
- Real project commands in a disposable macOS sandbox snapshot, with no model credentials or network.
- Private local sessions, ordered events, diff/check evidence, cancellation and guarded resume.
- Deterministic two-provider protocol and engineering-flow qualification using **mock model responses and real local operations**. No live model is qualified yet.

## Requirements and installation

Node.js 24+, Git at `/usr/bin/git`, macOS with `/usr/bin/sandbox-exec` for contained checks. The current proof uses Homebrew Node 24. This preview is qualified only on macOS; other platforms are unqualified and cannot complete checks. A nested sandbox may prohibit `sandbox-exec`. There is no unsafe fallback.

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
    "source": { "kind": "environment", "variable": "FAB_MODEL_KEY" }
  },
  "writableFiles": ["src/math.mjs"],
  "checks": [{ "id": "test", "argv": ["/absolute/path/to/node", "--test", "--test-isolation=none"] }],
  "acceptanceCriteria": ["Addition returns the sum, including negative inputs."],
  "maxTurns": 16,
  "timeoutMs": 300000,
  "checkTimeoutMs": 30000
}
```

`fab config` fills the actual root, OS UID and Node path. Set only the chosen environment variable in your own shell. For masked input in macOS's default zsh:

```sh
read -rs 'FAB_MODEL_KEY?Your provider key: '
export FAB_MODEL_KEY
fab auth --config "$HOME/fab-project.json"
```

The value is never echoed by Fab or passed in argv. `fab auth` reports configured/missing metadata; it does **not** claim the provider accepted the credential. OpenAI/Anthropic standard environment keys, `.env`, shell history, keychain entries, cloud profiles and browser logins are not discovered. The provider and credential provider fields must agree. Changing to Anthropic requires that provider's own key and an explicit model ID.

Environment storage is not encrypted storage. OS-native enrollment and a hosted encrypted secret store are designed follow-ups. Rotate the key in your provider account and replace the variable; remove it with `unset FAB_MODEL_KEY`. Revocation at the provider is separate from local removal. No raw secret belongs in this JSON.

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

Sessions live in `~/.local/state/fab` with private directory/file permissions, or an explicit `--state-dir` outside the repository. A session contains task/plan, references, events, observed checks, nullable usage/cost and a redacted diff. It is local user-owned evidence, not tamper-proof MC evidence. The stored diff is the captured candidate; inspect Git for subsequent external changes. Delete the selected session JSON after review to remove its retained task/code context; provider-side retention is separate.

## Current limits

- The check snapshot supports at most 300 UTF-8 source files, 100 KB per file and 2 MB total. Hidden, credential, binary, linked and generated/dependency paths are excluded or rejected. No dependency installation, copied `node_modules`, writable Git metadata or arbitrary shell tool.
- Checks run one configured system/Homebrew executable. Child processes (including detached daemons), other binaries, external services and network are denied. Node tests must use `--test-isolation=none`. The current qualified workload is dependency-free Node tests. Projects needing package managers, child processes, native binaries, hidden configs or installed dependency trees need additional qualification.
- Model request context is capped at 200 KB; responses at 1 MB, output at 4,096 requested tokens; sessions at 8 MB. No RAG, compaction, token streaming, reasoning controls or model fallback. Automatic provider retries are zero; failed requests require deliberate resume/retry.
- Cost and context-window metadata remain unknown, not zero. Model token usage is reported when supplied. No claim of current model support or prices merely because an adapter accepts an ID.
- Local file guards assume an operator-controlled checkout without a concurrent same-user adversary. The macOS check sandbox is an experimental boundary with measured tests, not universal hostile-code containment certification. The entire agent process is not an MC-admitted sandbox.
- No keychain enrollment, hosted secret store, Git authentication/clone, multi-repository writes, MC execution adapter, independent verifier, publication, IDE, browser, remote worker, MCP or skill registry in this preview.

## Reproduce qualification

```sh
npm --prefix packages/fab run build
npm --prefix packages/fab run typecheck
npm --prefix packages/fab run lint
npm --prefix packages/fab test
# On a Mac where sandbox-exec can create its own sandbox:
npm --prefix packages/fab run test:contained
```

The default suite explicitly skips containment-dependent cases. The full suite must report **zero skipped tests** to qualify local execution. It exercises actual source edits/Git diffs/process results, a built-CLI flow, failing-test repair, stale-evidence rejection, resume, impossible tasks, scope/credential attacks and OS-denial behavior. Mock transcripts are fixed fixtures, not autonomous model performance measurements. Tests never use your configured provider account.

See [the audit](../../docs/fab/FAB-REUSE-AUDIT.md), [architecture](../../docs/fab/FAB-ARCHITECTURE.md), [security design](../../docs/fab/FAB-SECURITY.md), [product specification](../../docs/fab/FAB-PRODUCT-SPEC.md), [implementation plan](../../docs/fab/FAB-IMPLEMENTATION-PLAN.md) and [qualification record](../../docs/fab/FAB-QUALIFICATION.md).
