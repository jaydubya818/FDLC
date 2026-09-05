# Fab product specification

Phase C, 2026-09-05. **From intent to review-ready software.** Fab is FDLC.ai's model-agnostic software engineering agent. This specification distinguishes the first local preview from later capabilities.

## Product and users

Developers need to understand unfamiliar code, implement bounded fixes/features/refactors, run checks, and review concrete changes. Factory operators need an executor that fits an approved work order without becoming another control plane. Factory Engineers supply intent; reviewers retain judgment. Optimize accepted changes per unit of human review effort and total cost, not generated lines or tool calls.

## First local workflow

1. Install the local package; enter one existing Git repository.
2. Inspect branch, revision, worktree state, recognized build files and project instructions without a model call.
3. Explicitly select a provider/model and bind the user's own credential reference. Missing credentials give an actionable error with no fallback.
4. Supply a bounded task, acceptance criteria, file scope and checks using operator-owned configuration.
5. Fab reads relevant context, produces a plan and displays scope/checks/model with a consent digest.
6. Approve that plan; Fab performs scoped edits and bounded checks, repairing failures within the turn/time budget.
7. Review the diff, checks, evidence, costs or unknown cost, and unresolved issues. Output remains a local candidate.

CLI target: `fab`, `fab inspect`, `fab plan`, `fab run`, `fab diff`, `fab status`, `fab resume`, `fab models`, `fab auth`, `fab config`. The package README lists only implemented forms. Do not add dead command stubs. `fab verify` cannot imply independent acceptance; `fab pr` must eventually call MC under its publication policy. Neither is part of the local preview.

## UX states

| State | Required behavior |
| --- | --- |
| No repository or unborn/dirty checkout | Explain prerequisite; no model spend or source edits |
| Missing/invalid config or credentials | Identify configuration field; never print secrets or search other stores |
| Planning | Visible model/tool progress and bounded context decisions |
| Awaiting consent | Show plan, files, checks, identity and digest; no writes |
| Working | Ordered tool/check events, cancellation, no fabricated progress |
| Check failure | Actual exit/signal/timeout evidence; allow bounded repair |
| Scope/credential attack | Denial evidence; no scope expansion |
| Interrupted | Retain partial diff and checkpoint; no ambiguous replay |
| Candidate | Diff, actual check results, usage, unresolved risks and review needed |
| Impossible/no change | Explicit blocked/incomplete status; never fabricate success |

## BYOK and supported scope

One local OS user, one writable repository, no platform-owned provider account. Explicit environment reference supports headless use; masked enrollment into macOS Keychain is implemented and tested with an isolated synthetic keychain. Secrets never appear in config, session or commands. Rotation replaces the user-controlled credential behind the reference; removal unsets the chosen variable or deletes the selected Fab keychain entry. Fab never enrolls source-control credentials implicitly. Initial Git use is offline/read-only; remote clone/authentication remain operator-owned.

First adapters: OpenAI and Anthropic text/tool protocols with the same suite. Supported model list remains empty until live qualification is recorded; explicit model IDs are experimental. No claim of streaming tokens, special reasoning controls, current prices, Bedrock, Azure, Google, IDE, hosted UI, remote execution or multi-repository writes before implementation and testing.

## Future surfaces and skills

IDE and browser clients stay thin: task/context, selection/diagnostics, progress, diff and evidence. MC UI remains authoritative for work orders, approval, verification and publication. Hosted credential settings use metadata-only responses and user/organization authorization. Browser-to-local execution requires an authenticated independently authorizing worker; no unrestricted bridge.

Skills reuse MC package/version/lock/eval concepts. A skill declares purpose, inputs, outputs, requested tools, model needs and validation, but cannot grant authority. Explore/Build/Test/Review are role profiles in one runtime; subagents require measured isolation benefit. Read-only dependency repositories precede governed multi-repository writes.

## Release gates and outcome metrics

The local preview must pass real filesystem/Git/check integration tests and deterministic protocol/attack tests. Live two-provider task success is a separate gate requiring dedicated user-supplied evaluation credentials. Record success, first-pass rate, regressions, review time, candidate/accepted latency, retries, token/cost completeness and blocked unauthorized actions. Fixture results are engineering conformance evidence, not measured autonomous model quality or accepted customer changes.

## Phase 2 status

`fab auth add|list|test|remove` and `fab qualify provider` are implemented. Provider/model configuration is explicit and changing it invalidates local plan consent. Qualification reports distinguish live checks, synthetic contract faults and unsupported capabilities. No live model is yet qualified.

MC integration is an Experimental local adapter with canonical registration, guarded Attempt linkage and candidate handoff. Offline fixtures demonstrate separate verification and approval/publication handling. This is not deployed MC operation or whole-agent hostile-code containment. The standalone CLI still has no publication or acceptance command.
