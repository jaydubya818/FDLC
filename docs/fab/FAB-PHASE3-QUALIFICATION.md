# Fab Phase 3 qualification

Status: **Experimental; offline implementation qualified, external qualification pending.** Fab is Fabrication: the coding/component-building agent within FDLC. Mission Control governs its execution, verification, approval and publication. This record does not claim Phase 3 completion, design-partner readiness or production readiness.

Latest local source integration: [later upstream qualification](qualification/phase3-upstream/README.md) preserves FDLC main `d954370` and MC main `6d7146d`. The merged FDLC site passes both Vinext and Vercel/Next production builds and the full 62-check browser gate on each runtime. MC's later incoming changes are documentation only; its qualified executable source remains unchanged. Existing source-specific receipts below remain historical evidence rather than being relabeled.

## Exact package and source

`@fdlc/fab@0.1.0-experimental.2` is the private immutable runtime consumed by MC. Its source is `1d1240c219d9bf3c1fa5fbb0a80ded96cf13df1f`, archive SHA-256 is `b3a1af223e246208c01745678cbe48a91786070b016b9a1ad7bdb0ad274d8a8d`, and the installed 41-file closure SHA-256 is `121ef8e14b085f6dba6e7f5598070ad80e79f5c1bfa5c71b890871bf83214999`. Two builds in one checkout and a third build from a fresh detached checkout produced the same archive. MC independently checks the installed files and actual Node executable before execution; a manifest declaration alone is insufficient. See [package identity](qualification/phase3/package-identity.json).

The packaged native helpers target **macOS 26.0+, arm64**, built with Node 24.18.1, TypeScript 5.9.3 and Apple clang 21.0.0. Older macOS, Intel, Linux and Windows are not qualified. A future rebuild uses a new immutable version and qualification; CI builds are not substituted for MC's pinned archive. CI uses the documented [GitHub macOS 26 arm64 runner](https://docs.github.com/en/actions/reference/runners/github-hosted-runners).

The archive has no runtime npm dependencies. Developer-ID signing and notarization were not performed; no unrelated signing identity was used. Public signed distribution requires `SIGNING_AUTHORIZATION_REQUIRED`. FDLC has no tracked license grant for Fab; MC's MIT license does not determine Fab's license. Public release requires `LICENSING_DECISION_REQUIRED`. Neither gate prevents private Experimental implementation qualification.

## Live and engineering evidence

**No live provider/model is qualified. No paid inference request was made for this task.** OpenAI and Anthropic protocol tests use explicitly labeled injected transports and synthetic credentials. Requested, returned and qualified identities are separate. Live requests require the selected, enrolled credential reference and exact model; standard provider environment variables, unrelated Keychain entries, `.env` files and browser accounts are not discovered.

The live protocol runner permits at most three requests, 128 output tokens each and zero automatic retries. It flushes private request intent before dispatch, records observed provider/response IDs, returned model, usage and latency, and keeps lost responses UNKNOWN. Usage/cost are nullable where unavailable; no estimated price or fabricated usage is reported. Streaming, reasoning controls, provider-native schema mode and context-window discovery are **DEFERRED / NOT QUALIFIED**. Current bounded JSON tool arguments and configured context limits remain enforced.

The engineering runner prepares fresh controlled repositories for bug fix, feature, refactor, test repair and component tasks. Each has a bounded file scope and executable reference check. Running a real evaluation requires a matching live qualification within 24 hours and a separate explicit request budget (1–24 requests, at most 4,096 output tokens per request, no automatic transport retries). It records actual completion, first checks, corrections, calls, usage, elapsed time, intervention and candidate identity. Runner tests are injected conformance evidence; **all five real-model evaluations remain NOT RUN**. Its local reference check does not substitute for MC's separate verifier Attempt or human acceptance.

## Governed integration and recovery

The MC implementation binds immutable WorkOrder/contract/repository/source/runtime/model-route identities. A policy-v2 candidate records base, head, tree and raw diff before a PR exists, then pauses for a separately admitted verifier. Current evidence and human approval precede a consumed publication permit. Publication creates a separate immutable subject-to-permit-to-human-to-PR binding. Acceptance still requires current trusted GitHub PR/head evidence. Fab receives no approval or merge authority.

Regression fixtures exercise real local Git changes and contained checks with injected model/control-plane/GitHub transport. They cover source substitution, candidate drift, packet rollback, independent verification rejection before dependency preparation, human identity tampering, lease/cancellation/expiry fences, missing acknowledgments, process crash and read-only publication reconciliation. Unknown provider/publication effects cannot authorize replay. Private local session evidence is not represented as deployed Convex persistence.

Deployed admission, durable restart/requery, real-model governed lineage, the human checkpoint, controlled PR creation and actual remote response-loss recovery remain **NOT RUN**. They require an explicitly authorized non-production MC environment, enrolled exact provider/model and dedicated qualification GitHub repository/App installation. Implementation PR delivery to FDLC and MC is a separate action; automatic approval review requires explicit destination/data authorization before export.

## Containment, credentials and repository classes

Local Fab remains **LOCAL_DEVELOPER_MODE**. Its project checks run in a disposable macOS sandbox with filesystem/process/network denials, scrubbed environment and bounded output/time. The entire agent process is not isolated from a malicious same-user process. Known credential redaction and excluded context paths are measured controls, not universal secret detection.

An actual existing Docker engine ran the [pinned local canary](qualification/phase3/docker-canary.json): non-root UID 65534, no network, read-only root, dropped capabilities, no-new-privileges, 128 MB, 0.5 CPU, 32 PIDs, temporary writable output and verified teardown. This qualifies that canary only. **Whole-agent Fab containment and remote Fab credentials remain NOT QUALIFIED.** MC's broker/backend architecture is reusable, but local Keychain credentials must not be copied into a remote sandbox. A remote Fab adapter needs an admitted broker-side/scoped grant and independent isolation proof before becoming available; no placeholder grant or cloud credential was created.

| Repository class | Current measured boundary |
| --- | --- |
| Small dependency-free | Qualified bounded local Node check fixtures; maximum 300 UTF-8 files, 2 MB total, 100 KB/file |
| Medium typed | Same snapshot limits; no general TypeScript build qualification |
| Dependency-heavy | MC preparation separately demonstrated with real offline `pnpm`, a prewarmed store and `picocolors@1.1.1`; Fab dependency-heavy checks remain unqualified |
| Monorepo | No broader class qualification or increased global limits |
| Generated-heavy | Generated/dependency paths excluded; no generated-tree qualification |
| Binary-heavy | Binary source rejected/excluded; no binary-heavy qualification |

The [dependency preparation receipt](qualification/phase3/offline-dependencies.json) proves frozen/offline install with lifecycle hooks and pnpmfile disabled, explicit external store, empty HOME/config and unchanged source. A cold empty store failed closed within the 300-second preparation limit; this does not claim an immediate cache-miss diagnostic. Dependency preparation is not untrusted project-check execution and grants no arbitrary network access to checks.

## Qualification and delivery

Fab's native suite passes 59 tests with zero skips. MC's initial full System Qualification passed at `ac8e38c`; subsequent main reconciliation is qualified separately in MC's Phase 3 evidence. Independent security and main-thread data-integrity, architecture and simplicity reviews are GO for the inspected offline implementation. Follow-up recovery findings were fixed and independently cleared; the final canonical mutation suite passes 22 tests. These results do not establish live/deployed qualification.

The repeatable browser gate passed **62 checks, 9 interactive flows and 20 internal routes**, including 1440px/390px layouts, all 20 public pages, zero axe violations and zero page errors. Functional checks cover builder validation/generation/reset, the eleven-dimension assessment, Mission Control tabs, factory-explorer keyboard controls and mobile navigation/table scrolling. These are local site/browser checks. Cross-project Microfrontend composition and deployed artifacts were not exercised; they are not implied by browser success. See [browser results](qualification/phase3/site-browser.json).

The FDLC site receives focused accessibility repairs and a repeatable production-browser gate, preserving its design. Root and package TypeScript scopes are checked separately. The site security update replaces vulnerable Next.js 16.2.9 and its transitive dependencies with 16.3.4; npm reports zero vulnerabilities. See the upstream [Next.js advisory](https://github.com/vercel/next.js/security/advisories/GHSA-m99w-x7hq-7vfj) and [sharp advisory](https://github.com/lovell/sharp/security/advisories/GHSA-f88m-g3jw-g9cj).

Phase 2 files are unchanged: [hash verification](qualification/phase3/phase2-immutability.json). New results, including failed qualification runs, are preserved separately. CI, PR, merge and clean-main results are recorded in the delivery receipt when observed. External live/deployed gates remain open regardless of green offline CI.

A fresh detached FDLC checkout at `484b02b2dc49a14128ea98b1e4c8c3be6df070a0` independently passes standard root/package installs, 12 site units, 14 rendered-route tests, build, both TypeScript scopes, lint, all 59 native Fab tests with zero skips, and the full 62-check browser gate. No dependencies were linked from another worktree. The [fresh validation receipt](qualification/phase3-final/manifest.json) records exact source and evidence hashes; generated package builds do not replace MC's earlier pinned archive.

Mission Control's fresh detached checkout at `f5ed5d10ac58ba4472eddd882a06406fd96d9830` passes its standard frozen pnpm install, all 19 System Qualification gates, 15 critical browser tests and exact installed Fab/Node identity check. Its main baseline is `f90c50f5b4191467b2117bb8762754f697b1cefd`; runtime contract is v43. The source-specific receipt is `docs/testing/evidence/fab-phase3-clean-final/clean-validation.json` in MC. These are branch qualifications, not post-merge main results.

GitHub PRs, CI, merge and post-merge qualification remain **NOT RUN**, pending `GITHUB_PUBLICATION_AUTHORIZATION_REQUIRED`. Automatic approval review rejected GitHub export of implementation code and qualification records until the destination/data authorization is explicit; the requested repositories are `jaydubya818/FDLC` and `jaydubya818/MissionControl`. Local implementation and qualification records are preserved. Optional persistent CI artifact uploads were omitted after a separate approval-review rejection. No GitHub push, PR, deployment, registry release or paid provider call was performed.
