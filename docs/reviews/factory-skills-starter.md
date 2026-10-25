# Factory Skills Starter Kit v0.1 review

## Scope

Adds a local bug-fix pilot backed by Skillz commit
`4942dde4b2a442df3ee45879bb22734c658426df`. Uses `how`, `blast-radius`, `tdd`,
`principle-prove-it-works`, and `make-pr-easy-to-review` without copying their
bodies or installing a second collection. The full source checkout retains
runtime mappings, supporting references, and licensing information.

The dependency-free runner creates a branch/worktree, captures the baseline,
requires the predicted regression assertion failure, freezes the test, checks
allowed paths, and records the passing candidate and local evidence. Mutating
commands are serialized; command duration, output, and retry budgets are bounded.
A changed candidate or log invalidates the status check. No model API, commit,
PR creation, merge, deployment, or cleanup is executed by the kit.

The website adds `/factory-skills`, a versioned ZIP with a SHA-256 manifest,
and entry links from the homepage and Factory Definition page. Packaging is
checked against source in CI. The new page enters the existing responsive,
accessibility, rendered-route, and link-check suites. Existing release gates
and permissions stay unchanged.

## Evidence and limits

- The runner regression suite exercises a real Git worktree, assertion failure,
  passing fix, preserved source checkout, stale candidate/log rejection,
  frozen tests, unrelated changes, syntax errors, false reproduction,
  baseline failure, skipped tests, invalidated handoffs, attempt budgets,
  concurrency, symlinks, path traversal, dotfiles, ignored state, and timeouts.
- The source and extracted ZIP demos use the real pinned Skillz checkout and
  capture the `2 !== 3` failure followed by four passing tests. The demo applies
  a known fix; it is not an agent adoption trial.
- The runner tests use synthetic skill fixtures for offline execution. These
  tests establish runner behavior, not the quality of each skill's reasoning.
- The runtime tested locally is macOS with Node 24. Linux and Node 22 are
  supported by the implementation but were not independently run locally.
- Local records are editable. The runner is not a sandbox, policy engine,
  independent verifier, or Mission Control admission mechanism. Repository
  code can fabricate output or affect the host. Use trusted code and the
  existing harness's execution permissions.
- The next product validation is an external user completing a real bounded
  task through Codex. Do not describe that milestone as achieved by the demo.

## Release qualification — 2026-10-25

Integrated current main, including dependency remediation from PR #67. The
resolved candidate audit contains zero high/critical findings and two low
findings. No security exception or audit-threshold change is required.

Updated the rendered navigation contract to include Factory Skills alongside
Factory Updates. Refreshed the official AWS RDS global CA bundle SHA-256 to
`90a6f1a7978a1b1b096dca6c57511ca48d3b8cf052f8e704baf358f34ea2f21b`
in both Docker builds and CI. The official HTTPS source and strict checksum
verification remain enabled. This repairs the stale external input that
blocked the child build; it does not deploy the child backend.

Merge and FDLC production publication are authorized in the chat. Qualification
must pass on the integrated candidate before merge and on clean main before
production promotion. Preserve the existing production deployment as rollback.
