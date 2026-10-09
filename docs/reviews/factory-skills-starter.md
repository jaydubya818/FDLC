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

## Release blocker

The original audit reported 13 high-severity entries. The 2026-10-09
remediation updates `@cloudflare/vite-plugin` to 1.63.1, `wrangler` to
4.149.0, and transitive `source-map-js` to 1.2.2. This installs patched
`sharp` 0.35.5 and reduces the audit to eight high-severity entries.
All eight remaining entries trace to braces 3.0.3 and its dependents.

[GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm)
reports no patched braces version. npm proposes breaking downgrades of
microfrontends, Vinext, and the Next ESLint plugin; these were not applied.
This review does not establish that vulnerable pattern parsing is unreachable
in every build or runtime path.

The audit threshold and release controls remain unchanged. The user authorized
merge and production publication, but a specific residual-risk decision has
been requested because qualification still fails. No security exception has
been approved or implemented. Keep release on hold until remediation or an
explicitly reviewed exception resolves the qualification gate.
