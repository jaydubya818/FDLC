# Fab implementation plan

Phase E, 2026-09-05. Complete safe local work; retain explicit gates for live provider qualification and governed admission. Do not treat a fixture suite as broad model independence.

| Milestone | Deliverable and dependency | Acceptance and tests | Rollout |
| --- | --- | --- | --- |
| M0 Audit and architecture | Four-repo source audit, capability matrix, boundaries/security/product/location decision | Every requested capability mapped; credential and duplication risks explicit | Docs first, no runtime migration |
| M1 CLI integration pilot | Independent local CLI, config, repository inspect, private evidence and consent; follows M0 | Missing/dirty repo, missing credential, stale consent, secret redaction and check isolation tests | Private local package |
| M2 Native Fab agent | Typed model/tool loop, planning, scoped edits, real project checks, candidate diff, cancellation and conservative recovery | End-to-end known defect, feature, refactor, test repair and component fixtures; failures/attacks denied | Experimental local use |
| M3 Model independence | OpenAI + Anthropic protocol paths and shared evaluation suite; follows M2 | Same live tasks with explicit dedicated BYOK evaluation credentials; record exact model IDs, tokens, latency, costs/unknowns and behavioral limits | No production claim until live gates pass |
| M4 MC governed execution | Adapter in MC using existing generic harness contracts, broker, workers, verifier and publisher | Admission/cancel/cleanup/manifest conformance; exact candidate verification; rejection of self-acceptance; approved PR golden path | Gated MC configuration, no local shortcut |
| M5 IDE | Thin current-file/selection/diagnostics/diff client | Same runtime and authority; restart/error/apply/reject behavior | One editor first |
| M6 Browser | Session/diff/provider metadata client; existing MC approval UI | Tenant credential ownership, CSRF/auth/session isolation, no secret echo | Authenticated preview |
| M7 Remote execution | Existing MC sandbox/worker integration, per-attempt credentials | Scope/network/resource bounds, revocation, lease loss, cancellation, cleanup and recovery | Exact admitted tuple only |
| M8 Skills/ecosystem | Reuse MC package/lock/eval contracts; scoped MCP | Malicious skill cannot expand tools/credentials; pin/version/compatibility tests | Qualified packages only |

## M1/M2 stories and sequencing

1. As a developer, inspect one committed checkout without loading credentials. Implement safe Git and bounded file enumeration; reject ambiguous roots and linked secret paths.
2. As a developer, explicitly configure my provider and reference. Implement strict configuration and scoped CredentialProvider; redact all output and return metadata-only errors. Test no ambient-key fallback.
3. As a developer, review a concrete plan before writes. Implement bounded read-only planning and a digest covering task/root/revision/config/plan. Test stale/replayed consent and planning-stage write denial.
4. As a developer, get working edits. Implement native tool dispatch, read/write/edit guards and checked completion. Test failed commands, repairs, no-change completion and out-of-scope actions.
5. As a reviewer, see what actually happened. Persist private versioned events/checkpoints, actual check outcomes and a candidate digest/diff. Costs remain unknown until reliable; no fabricated verifier or acceptance status.
6. As a developer, interrupt safely. Propagate aborts/timeouts, stop process groups and reconcile interrupted state conservatively. Test drift, partial failure and concurrent session access.
7. As a maintainer, reproduce conformance. Run the same deterministic tasks through both real wire parsers with non-secret mock transport. Run actual filesystem/Git/check operations on disposable fixtures. Separate this from live autonomous model-quality evaluation.

## Qualification and stop conditions

Use existing installed toolchains and non-secret fixtures. Do not use repository-owner credentials, authenticated browser sessions, existing model configs or cloud profiles for live tests. Run package typecheck/tests and affected site checks; record actual commands/results in `FAB-QUALIFICATION.md`. Keep changes in package/docs plus minimal development scripts; preserve unrelated dirty files.

Safety blockers: unavailable OS containment for project checks, no dedicated authorized credentials for live model evaluations, and no admitted MC Fab tuple. Continue other independent local work; do not bypass these gates. Future integration code must be validated against MC's current contract before enabling it. Repository creation, publication and deployment remain outside this local implementation.

## Rollback and release

Incremental local commits: audit/design; runtime/CLI; qualification/hardening/docs. Package is private and unimported by the site. Revert the package addition to remove the pilot without changing MC/FDE services. Sessions/candidates remain local user data; no destructive automatic rollback. A public release requires separate repository/license decision, platform qualification, BYOK UX, live two-provider evidence and reviewed security limitations.

## Phase 2 completion and remaining gates

Secure local enrollment, adversarial redaction, deliberate provider qualification, generic MC adapter registration, Attempt linkage/checkpoints, exact candidate recording and deterministic separate-verifier/approval/publication fixtures are implemented. See `FAB-PHASE-2.md` for the isolated MC worktree and `FAB-QUALIFICATION.md` for source pins and measured results.

M3 live model qualification remains NOT RUN — USER CREDENTIAL REQUIRED. M4 has offline integration evidence, but deployed MC authorization/persistence, a live model tuple, full runtime containment and controlled real publication remain release gates. Unsupported streaming/reasoning/native response schemas, other OSes, dependency-heavy repositories and remote/hosted credentials are separate future work. These limits do not prevent running or extending the offline suite.
