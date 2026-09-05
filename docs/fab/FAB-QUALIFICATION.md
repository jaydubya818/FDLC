# Fab local qualification

Date: 2026-09-05. Runtime source commit: `6c40f41` on `codex/fab` (subsequent documentation-only commit records this report). Audit/design commit: `8137080`.

**Outcome: the experimental local CLI foundation is implemented and passes its local conformance suite. It is not a production release, live model qualification, independent verification or governed Mission Control delivery.**

## Actual results

| Check | Result | Evidence |
| --- | --- | --- |
| Strict TypeScript check | Passed, TypeScript 5.9.3 with `strict` and `noUncheckedIndexedAccess` | [typecheck.txt](qualification/typecheck.txt) |
| Package lint | Passed, zero reported errors | [lint.txt](qualification/lint.txt) |
| Compiled package | Passed; executable JavaScript and declaration files emitted | [build.txt](qualification/build.txt), [package inventory](qualification/package.json) |
| Full Fab conformance suite | **36 passed, 0 failed, 0 skipped** | [local.tap](qualification/local.tap) |
| Existing FDLC content/unit tests | **12 passed, 0 failed** | [site-unit.tap](qualification/site-unit.tap) |
| Pack/install smoke | Local tarball installed offline into a temporary prefix; installed `fab --help` exited 0 | [install.txt](qualification/install.txt) |
| Diff whitespace check | Passed | `git diff --check` |
| Credential absence in persisted fixture artifacts | Passed for the registered non-secret fixture value | Artifact scan; the fixture key is intentionally present only in test source |

The suite runs the same five engineering cases through both actual HTTP adapter parsers: known bug fix, bounded feature, behavior-preserving refactor, test repair and new component. Every positive case performs actual Git inspection, file edits, a sandboxed Node test command, diff capture and private session persistence. Both adapters also exercise impossible tasks, repository-scope attacks, credential-file attacks and unknown tools. These are **scripted mock model responses**, not measurements of an autonomous model's ability to solve those tasks.

Additional tests cover exact credential ownership/scope, no ambient fallback, encoded/key-name redaction, provider error privacy, unknown usage, malformed tool arguments, symlinks/hard links/traversal, private storage, corrupt sessions, plan/configuration drift, planning-stage write denial, no-change completion, cancellation, failing-check repair, invalidation of earlier passing checks, checkpoint resume without duplicate writes and cross-process built-CLI operation.

The OS tests actually attempt and verify denied reads/writes outside the disposable snapshot, reads of the original repository, inherited credential/environment access, network connection, another executable and detached child creation. They also verify timeout, cancellation and output-limit outcomes. Child processes are denied, so project Node tests use `--test-isolation=none`.

## Reviewable fixture execution

- [Representative session and event evidence](qualification/representative-session.json)
- [Representative candidate diff](qualification/representative-candidate.diff)

This representative record is labeled **non-secret fixture conformance**. The model transport was mocked; the code edits and project checks were real local operations. The temporary repository was removed by test cleanup. The result says `candidate`, `independent: false`, `acceptance: not_evaluated`, and unknown cost. Its fixed mock token counts are not billable-provider measurements. No real customer change, independent acceptance, or live model success is claimed.

## Environment and reproduction

macOS, Node `v24.18.1` (Homebrew), Git at `/usr/bin/git`, TypeScript `5.9.3`, ESLint `9.39.4`. Fab's package has its own pinned development lockfile and no runtime npm dependencies.

```sh
npm --prefix packages/fab ci --ignore-scripts
npm --prefix packages/fab run typecheck
npm --prefix packages/fab run lint
npm --prefix packages/fab run build
npm --prefix packages/fab run test:contained
```

The evidence-recording run used:

```sh
FAB_TEST_CONTAINMENT=1 \
FAB_QUALIFICATION_OUTPUT="$PWD/docs/fab/qualification" \
node --test --test-reporter=tap packages/fab/test/*.test.ts \
  > docs/fab/qualification/local.tap
```

No live provider requests, repository-owner keys, cloud profiles, authenticated browser sessions or source-control credentials were used. Validation dependencies came from public npm into an isolated temporary toolchain using an empty environment and empty user/global npm configuration, then were installed offline into `packages/fab/node_modules`. No dependency lifecycle scripts ran and the site's dependency tree was not replaced.

The existing site's installed tooling behaved inconsistently: its TypeScript shim exited without output/artifacts, direct compilation stalled, ESLint failed while loading `ConfigOps`, and the site build command exited without normal build output. Those initial exits were **not accepted as successful qualification**. A fresh package-local toolchain produced real diagnostics/artifacts and passed. Site content/unit tests passed; a fresh full-site lint/build/rendered-route qualification is not claimed by this work. No site runtime/component files were changed by Fab.

## Milestone status

| Milestone | Status and remaining gate |
| --- | --- |
| M0 audit/design | Completed; four-repo capability audit and all five requested documents |
| M1 CLI pilot | Implemented and locally tested; private experimental package |
| M2 native loop | Implemented and locally tested on bounded dependency-free fixtures; not broad repository qualification |
| M3 model independence | Two adapter protocols tested against the same deterministic suite. **Live qualification not completed.** No model ID is advertised as qualified. |
| M4 MC governed execution | Designed, not implemented/admitted. No new work-order, verification, approval or publication service. |
| M5–M8 IDE/browser/remote/skills | Planned; no working functionality advertised |

M1 and the bounded M2 slice were implemented together: wrapping an external installed agent would have introduced account-discovery and runtime assumptions that the audit did not qualify. The native package proves the narrower loop directly without moving or modifying MC/FDE code.

## Remaining release gates

1. **Dedicated BYOK live evaluation.** A user must explicitly supply Fab evaluation credentials and exact model IDs. Run the same tasks with live OpenAI and Anthropic paths, record genuine usage/latency/cost or unknown cost, failures and reviewer outcomes. Never borrow the repository owner's existing accounts or infer authorization from an installed CLI.
2. **Usable secure credential enrollment.** Environment references work; masked OS-native secure-store enrollment, deletion and rotation UX remain designed. Hosted tenant-scoped encrypted credentials are not implemented.
3. **Broader local repository qualification.** Current snapshots cap at 300 text files/2 MB, omit hidden/generated/dependency paths, and deny child processes/network. Package-manager/dependency-heavy workloads and other OSes need explicit controls and qualification.
4. **MC adapter admission.** Implement an adapter in MC against its current `generic-harness-contract/v1`, all authorities `NONE`, canonical manifest, cancellation/cleanup and scoped credential broker. Reuse MC's independent verifier, currentness checks, approval and publisher, then prove the governed golden path.
5. **Release decision.** Decide repository/license/package publication only after those gates. Recommendation remains an independent `jaydubya818/fdlc-fab` release, with the current package staged privately here.

Local file guards do not defend against a concurrent malicious process under the same OS account, and local hashes do not provide externally immutable evidence. The check sandbox has bounded, measured conformance; the entire native runtime is not yet an MC-admitted hostile-code execution environment. These are material limits, not hidden claims of production readiness.
