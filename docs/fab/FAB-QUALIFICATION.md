# Fab Phase 2 qualification

2026-09-05. **Experimental. Offline implementation and conformance pass; production readiness is not established.**

Runtime source: FDLC `6f27dbc8a1f4bc2891d0ef656299f9760864d108`. MC integration: `0d64de5b2efce09525b5e83ccd3f7fa6dce589ce`. Both repositories have local `codex/fab` branches. The isolated worktrees are clean after the subsequent evidence commit; the original working copies retain unrelated changes. The evidence [manifest](qualification/phase2/manifest.json) pins source commits, the private package archive and every qualification artifact.

## Release gates

| Gate | Status | Evidence and practical limit |
| --- | --- | --- |
| Existing local CLI/native loop | **PASS** | 48 Fab tests, real repository edits/checks, 0 failures/skips; bounded dependency-free fixtures |
| Native secure credential storage | **PASS** | Actual macOS Keychain add/get/has/list/rotate/delete in a separately created synthetic keychain; no owner entries inspected |
| Masked input and secret-free child execution | **PASS** | Real pseudo-terminal input does not echo the synthetic key; contained check environment has no model credential |
| Adversarial redaction | **PASS** | Exact/base64/URI forms, known prefixes/suffixes, circular exceptions, model errors, actual check stdout/stderr and persisted artifacts |
| OpenAI provider protocol | **PASS — MOCK ONLY** | Actual HTTP adapter parsing and tool-result continuation, with scripted transport |
| Anthropic provider protocol | **PASS — MOCK ONLY** | Same protocol and engineering fixtures; no live model claim |
| Live OpenAI qualification | **NOT RUN — USER CREDENTIAL REQUIRED** | [Report](qualification/phase2/openai-qualification.json); exact user model remains unselected |
| Live Anthropic qualification | **NOT RUN — USER CREDENTIAL REQUIRED** | [Report](qualification/phase2/anthropic-qualification.json); exact user model remains unselected |
| MC generic contract, registry and admission | **PASS — OFFLINE** | Canonical manifest/result validation, registry and `factoryWorkerEligibility`; explicitly bounded local profile |
| WorkOrder/Attempt/session/candidate linkage | **PASS — OFFLINE** | Actual worker request, lease checkpoints, private session and MC candidate commit binding |
| Separate exact-candidate verifier | **PASS — OFFLINE** | Distinct verifier worker/Attempt and detached worktree; frozen subject/plan and canonical independence derivation |
| Approval/publication behavior | **PASS — FIXTURE ONLY** | Human-review pause, explicit authority before mocked publisher; lost authority and uncertain outcomes fail closed |
| Deployed MC authorization/persistence | **NOT RUN** | Convex transport is modeled in fixtures; backend authorization/recovery functions are separately tested |
| Whole-agent OS containment | **NOT RUN — UNSUPPORTED** | Fab rejects `WORKSPACE_ONLY`; only project checks have measured Seatbelt isolation |
| Real repository publication | **NOT RUN** | No authorized controlled remote target or GitHub account was used |
| Pack/install/typecheck/lint | **PASS** | Built JavaScript/native bridge installed offline; installed files compared with build outputs; Fab and MC orchestration typechecks pass |
| Production release | **NOT RUN — GATES OPEN** | No push, merge, release or deployment |

PASS labels apply to the stated fixture/environment, not to an untested deployment. No user-enrolled live credential was available or required to finish the offline work. Missing live credentials are an external qualification gate, not a product defect.

## Implemented

- `CredentialStore.set/get/delete/has/listMetadata`, native macOS Security.framework IPC, opaque owner/provider/repository references, masked `fab auth add`, metadata `list`, explicit one-inference `test`, rotation and removal. A config selects exactly one keychain or named `FAB_` environment source, with no fallback/discovery.
- `fab qualify provider <provider> --config ...` runs synthetic contract faults and records live checks as NOT RUN. Adding `--live` deliberately opts into up to three paid provider requests using the selected credential and exact configured model. It records authentication, inference, JSON tool arguments, continuation, requested/returned IDs, usage and latency. Fault tests are separately marked `contract`; unsupported capabilities are never marked PASS.
- MC's opt-in `FabExecutorAdapter`, generic Attempt context/authority checkpoints, atomic session reservation, normalized producer evidence, bounded event metadata and exact post-commit candidate linkage. Local resume cannot bypass MC for a governed session.
- A deterministic governed fixture that runs actual Fab planning, edits and contained checks, actual MC candidate capture, a fresh detached verifier Attempt, canonical independence checks, approval pause/reconnect and mocked publication. Negative cases include scope/credential/authority injection, model/check cancellation, real SIGKILL during a pending model call and an active check, lease loss, candidate mutation and duplicate execution/publication uncertainty.

## Reused MC capabilities

All paths here are relative to the MC repository; source remains owned there.

| Existing capability | Exact integration/reuse |
| --- | --- |
| Generic harness and identity | `packages/workflow-engine/src/executorAdapter.ts`: `HarnessExecutorAdapter`, manifests, canonical hashes, normalized results and all authorities `NONE` |
| Registration/admission | `apps/orchestration-server/src/harnessAdapterRegistry.ts`; `convex/lib/factoryWorkerRuntime.ts` |
| Authorized attempts/leases/events | `factoryAttemptWorker.ts`, `serviceCommandClient.ts`, `convex/serviceCommands.ts`, `convex/factory/attempts.ts`, `convex/lib/factoryAttempt.ts` |
| Worktree and candidate lifecycle | `factoryGitRuntime.ts`, `factoryPathScope.ts`, `factoryWorkspaceOwnership.ts`; Fab does not allocate/commit/publish governed worktrees itself |
| Separate verification | Worker verification path, `factoryVerification.ts`, `verificationSubject.ts`, `verificationPlan.ts`, `verificationIndependence.ts`, authority/currentness logic and `verificationPersistence.ts` |
| Approval/publication/recovery | Existing human review, publication permits, GitHub publisher/runtime and recovery logic; no alternate Fab control plane |
| Remote broker/reconciler | Existing sandbox credential/reconciliation tests rerun; **Fab remote execution and remote credential grants remain unimplemented** |

The change adds optional execution context and candidate-observation seams to the existing contract. It adds no WorkOrder database, lease service, verifier authority, approval state machine or publication service.

## Exact tests and evidence

| Layer | Passed | Failed | Skipped |
| --- | ---: | ---: | ---: |
| Fab boundaries/config/session tests | 5 | 0 | 0 |
| Fab credentials, native keychain, terminal and output redaction | 5 | 0 | 0 |
| Fab HTTP/provider qualification contracts | 11 | 0 | 0 |
| Fab built CLI integration | 1 | 0 | 0 |
| Fab engineering/evaluation/recovery scenarios | 23 | 0 | 0 |
| Fab OS containment tests | 3 | 0 | 0 |
| **Fab total** | **48** | **0** | **0** |
| MC orchestration integration/security/recovery (12 files) | 67 | 0 | 0 |
| MC backend authority/governance/recovery functions (7 files) | 48 | 0 | 0 |
| MC canonical verifier authority/currentness/independence (3 files) | 49 | 0 | 0 |
| **MC total** | **164** | **0** | **0** |
| Unchanged tracked FDLC content/unit suite | 12 | 0 | 0 |
| **Combined** | **224** | **0** | **0** |

Evidence: [Fab TAP](qualification/phase2/fab-tests.tap), [MC test results](qualification/phase2/mc-tests.json), [governed fixture](qualification/phase2/governed-golden-path.json), [site units](qualification/phase2/site-unit.txt), [build](qualification/phase2/build.txt), [Fab typecheck](qualification/phase2/typecheck.txt), [lint](qualification/phase2/lint.txt), [install](qualification/phase2/install.txt). MC orchestration TypeScript exited 0 with no diagnostics; its [output file](qualification/phase2/mc-typecheck.txt) is intentionally empty.

The same five engineering scenarios run through both real provider parsers: bug fix, feature, refactor, test repair and new component. Responses are scripted. No autonomous live model quality, first-pass success rate, customer acceptance or model cost is inferred. Mock IDs include `fixture-model` and `fixture-explicit-model`; no live model ID is qualified. Unknown cost/cache/context fields remain null.

Reproduce Fab from its checkout:

```sh
npm --prefix packages/fab run typecheck
npm --prefix packages/fab run lint
npm --prefix packages/fab run test:contained
npm --prefix packages/fab run test:provider
```

The full local suite requires macOS, Node 24, Apple Command Line Tools, Python 3 for the terminal test, permission to create a temporary synthetic keychain, and a host where `sandbox-exec` can establish its boundary. A nested sandbox may require running these controlled tests outside that sandbox. No unrestricted check fallback exists. Ordinary tests never invoke live models.

Reproduce MC's selected layers from its checkout after installing its dependencies:

```sh
node node_modules/vitest/vitest.mjs run --config vitest.fab.config.ts --no-cache
node node_modules/typescript/bin/tsc --noEmit -p apps/orchestration-server/tsconfig.json
```

The run used existing MC dependencies linked into an isolated worktree and the exact private Fab archive, with an empty HOME/environment and synthetic test service keys. No MC server entrypoint, dotenv file or live service was loaded. The added archive lock entry has measured SHA-512 integrity. A full MC workspace reinstall was not qualified: its pre-existing manifests/lock need unrelated dependency metadata, so no broad lockfile rewrite was performed. The archive itself installs offline and its CLI runs.

## Security and remaining gaps

No repository-owner provider key, browser session, source-control token, `.env`, cloud profile or unrelated keychain entry was used. Authentication headers exist only inside model transport. Native enrollment uses stdin, not argv or plaintext files. Known synthetic credentials and base64 forms are absent from saved qualification artifacts. Full source/tool buffers stay in private Fab sessions; MC receives bounded observations and candidate identity. There is no separate telemetry service to qualify.

Open release gates and unsupported behavior:

1. Live developer-enrolled OpenAI and Anthropic models, genuine model identity/usage/latency and autonomous engineering evaluation. No key was borrowed to bypass this gate.
2. Deployed MC admission/authorization, persistent evidence, real worker reconnect and controlled GitHub publication. Offline fixtures are not deployed persistence evidence.
3. Whole-agent hostile-code containment. File guards assume an operator-controlled checkout; only checks are OS-contained. Remote sandbox and short-lived per-attempt native-provider grants are not implemented.
4. MC policy-v2 Git verification subjects require a PR identity. The fixture supplies a controlled provider identity; it does not implement a deployed pre-publication subject route. Existing MC draft-publication/currentness policy is unchanged.
5. Automatic recovery after an ambiguous operation or publication outcome. A real SIGKILL during an in-flight synthetic model request leaves an uncertain session/lock and replay is denied. A separate real SIGKILL during a sandboxed project check proves active-check termination and snapshot cleanup by the native supervisor; checks cannot fork. Current behavior preserves state and denies replay; MC/operator reconciliation or a new authoritative Attempt is required. The successful approval resume reuses the recorded candidate and does not rebuild/reverify.
6. Other OSes, signed/universal native distribution, hosted tenant stores, streaming tokens, reasoning controls, native schema-response mode and provider context-window discovery.
7. Broader repository support: snapshots remain bounded to 300 UTF-8 files/2 MB, exclude private/hidden/generated/dependency files, and checks deny child processes/network. Dependency-heavy projects need separate qualification.
8. Arbitrary unknown secrets/encodings and malicious same-UID processes are outside the redactor/local integrity guarantee. Known partial prefix/suffix handling does not identify every possible fragment.
9. Full website build/lint/rendered-route qualification and full MC dependency reinstall were not established. Fab did not modify site runtime features. Repository/license/public release decisions remain separate.

## Git and earlier evidence

FDLC Phase 2 implementation commits: `8f041fd`, `b0c1b7c`, `e82fc67`, `f2f21b5`, `026d0fb`, `3ea9fb8`, `6f27dbc`; this report is recorded by a subsequent documentation commit. MC commits: `5e413c7`, `20309e5`, `62394f3`, `0d64de5`.

Active Fab worktrees: `/private/tmp/fab-fdlc` and `/private/tmp/fab-mission-control`, both on `codex/fab`. Another task switched the shared FDLC checkout to `codex/newinfo`; Fab-only commit `026d0fb` was preserved on both branches, and remaining work moved to the isolated checkout. The original site/MC working copies retain their existing and concurrent unrelated changes. No push, merge, PR, remote publication or deployment occurred.

Phase 1 evidence remains under `qualification/`: source `6c40f41`, 36 Fab tests and 12 site units. It is historical evidence, superseded by the scoped Phase 2 results above.

### Uncommitted-file snapshot at completion

The Fab worktrees are clean after the evidence commit. The following original-checkout files were left untouched by this isolated continuation; another task may continue changing them.

FDLC original checkout (`codex/newinfo`):

```text
 M app/architecture/page.tsx
 M app/benchmarks/page.tsx
 M app/globals.css
 M data/dependency-modernization-example.ts
 M data/fdlc.ts
 M data/mission-control.ts
 M docs/MISSION_CONTROL_PUBLIC_CAPABILITIES.md
 M next-env.d.ts
?? "app/components/factory-explorer 2.tsx"
?? data/context-skills-practices.ts
?? "data/factory-explorer 2.ts"
?? "docs/brainstorms/2026-09-03-factory-control-boundary-brainstorm 2.md"
?? "docs/brainstorms/2026-09-03-interactive-factory-explorer-brainstorm 2.md"
?? docs/integrations/
?? docs/prompts/
?? docs/releases/
?? docs/reviews/
?? public/fdlc-logo.png
```

MC original checkout (`codex/github-app-multi-repo-installations`):

```text
?? "MissionContorl review/"
?? rt-body.md
?? rt.bundle
```
