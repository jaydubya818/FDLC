# FDLC Factory Skills Starter Kit

Run one bounded bug fix with your existing Codex session and the skills from
[jaydubya818/skillz](https://github.com/jaydubya818/skillz).

This is a local pilot for dependency-free Node.js repositories on macOS and
Linux. It requires Node.js 22.13+ and Git. No npm install, API key, account,
background service, or automatic agent invocation is required for the runner.
Your existing coding harness supplies the agent and its execution permissions.

## Try the scripted example

Extract the download, then run from its parent folder:

```sh
git clone https://github.com/jaydubya818/skillz.git skillz
git -C skillz checkout --detach 44df27bc06f11d76d9f490c76578f222e254be6f
node factory-starter/demo.mjs ./skillz
```

Use a new `skillz` folder so you do not change an existing installation. The
commit is pinned in `skills.lock.json`; the runner rejects a different commit
or a dirty checkout. The complete checkout preserves the skills' supporting
references, runtime mappings, and attribution. This kit does not redistribute
or install the skills globally. See `skillz/LICENSES.md` for their licenses.

Starter v0.1.1 updates the Skillz pin to the latest source as of November 6,
2026, including the refreshed workflow instructions and supporting references.
The same five phases and local runner remain in use. To update an older kit,
extract v0.1.1 into a new folder and use its pinned checkout for new runs.
Keep existing runs with the kit and Skillz revision that created them.

The demo creates a temporary Git repository and an isolated branch. Its batch
counter returns two batches for five items at capacity two. A new regression
expects three, records the `2 !== 3` mismatch, and then passes after the script
applies the known fix. Existing validation and zero-item tests also pass.

Expected output includes:

```text
BEFORE: 5 items / capacity 2 returned 2; regression expected 3.
AFTER: regression and baseline pass.
"status": "verified"
```

The script prints the worktree and evidence directory. This demonstrates the
runner with a known fix; it is not evidence of an agent solving a new task.

## Fix a bug with Codex

1. Start with a small, trusted Git repository and a clean commit. This profile
   rejects untracked and ignored files, submodules, symlinks, and files over
   5 MiB. It does not install dependencies. Choose explicit Node `.test.mjs`
   files that run without services or packages. Use a fresh clone if needed.
2. Write a task JSON file **outside the repository**, using the example below.
   List the existing implementation files that may change, the existing tests
   to rerun, a new regression-test path, and the assertion mismatch you predict.
   A person still needs to check that the failure measures the reported bug.
3. Begin the run. Use an output directory that does not exist, outside the repo:

   ```sh
   node factory-starter/runner.mjs begin /absolute/repo /absolute/task.json /absolute/new-run /absolute/skillz
   ```

4. The runner records the base commit, creates `codex/fdlc-fix-*` and a worktree,
   and requires the baseline tests to pass. It writes `PROMPT.md` in the run
   directory. Open the printed worktree in Codex and ask it to follow that file.
   Give the session only the permissions needed for that repository and checks.
   The prompt selects the pinned skills one phase at a time.
5. Inspect `HANDOFF.md`, `run.json`, the logs, `implementation.diff`, and the
   copied regression. Run `status` immediately before reviewing/committing:

   ```sh
   node factory-starter/runner.mjs status /absolute/new-run
   ```

6. After human review, commit the listed implementation files and regression
   from the printed worktree. Create a PR using your normal repository process.
   Publication, merge, and release remain separate decisions. The kit performs
   none of them. Evidence refers to the uncommitted candidate and base recorded
   in `run.json`; your normal CI must verify the resulting PR commit.

Example task (`example/task.json` contains the runnable demo's contract):

```json
{
  "task": "Count a partially filled final batch. Preserve validation and zero-item behavior.",
  "expectedFailure": "2 !== 3",
  "regression": "tests/partial-batch.test.mjs",
  "allow": ["src/batches.mjs"],
  "baselineTests": ["tests/batches.test.mjs"]
}
```

## Five phases, existing skills

| Phase | Skill in the pinned Skillz checkout | Output |
| --- | --- | --- |
| Inspect | `how` | Affected code and existing behavior |
| Define | `blast-radius` | Scope, expected behavior, and risks in `plan.md` |
| Implement | `tdd` | Failing regression, then the production fix |
| Verify | `principle-prove-it-works` | Same regression passing, baseline passing |
| Handoff | `make-pr-easy-to-review` | Diff, evidence, limitations, review instructions |

`PROMPT.md` gives the exact skill paths. Read runtime mappings and supporting
references when the selected skill calls for them. Existing repository and
user instructions still govern the agent's work. Selecting a skill does not
create permission to publish or execute unrelated actions.

## Checkpoints and recovery

- `begin` requires a clean repo and passing baseline. A failure leaves a
  `blocked` run with the reason and logs. Inspect it, fix the prerequisite in
  the source repo, commit it, and begin a new run in a new directory.
- `reproduce RUN` permits only the new regression file to change. It requires
  an assertion failure containing the predicted mismatch. Syntax errors,
  passing tests, timeouts, and missing tools do not count. Inspect the actual
  failure content. Up to three recorded reproduction attempts are allowed.
- `verify RUN` requires the frozen regression to be unchanged, limits changed
  files to the contract, and requires all selected tests to pass without skips,
  cancellations, or todos. Up to three recorded verification attempts are
  allowed. Fix implementation within scope and retry; revise the test or scope
  by starting a new run.
- `status RUN` checks a verified candidate and log hashes for later changes.
  Any stale evidence requires re-verification. Staging or committing ends this
  uncommitted-candidate workflow; use normal PR CI afterward.
- Checks stop after 60 seconds or 1 MiB of combined output. The runner stops
  the process group on macOS/Linux. It has no autonomous retry loop.
- A `.runner.lock` serializes mutations. After a crash, inspect running
  processes before manually removing that lock. Do not retry concurrently.

Logs and outputs remain local. Inspect them for private data before sharing.
Keep the worktree and evidence until review is complete. To discard a demo,
first inspect it, then remove its worktree with Git's normal worktree command;
remove its temporary repository only when you no longer need its evidence.
The kit never force-deletes your work.

## What this proves, and what it does not

The runner checks stages, changed paths, candidate hashes, log hashes, and
selected test results at checkpoints. It rejects repository writes made by
tests when their before/after snapshots differ. It does not sandbox code,
block network access, protect secrets, enforce OS permissions, or stop an
agent from acting outside this workflow. Local evidence and state are editable;
hashes detect accidental staleness, not a hostile actor rewriting the record.
Test output is also emitted by repository code, so it is not independent proof.
Run trusted repositories inside your harness's normal isolation. A human must
review whether the regression tests the intended behavior and whether the
selected checks are sufficient. `verified` means these selected checks passed,
not that the change is secure, production-ready, or approved to merge.

The first external-user pilot, other test runners/languages, signed evidence,
automatic PR creation, and Mission Control admission are not implemented.

## Maintainer checks

```sh
node --test factory-starter/test/*.test.mjs
node factory-starter/demo.mjs ./skillz
```

The automated tests use synthetic skill files to exercise the runner without
network access. The demo uses the real pinned Skillz checkout. Neither alone
establishes that a new user can complete the workflow without help.
