---
title: Shared Mutable Workspace
description: Attempts, agents, or verifiers share one checkout or container, so state, effects, and credentials bleed between them and independence is impossible.
path: /anti-patterns/shared-mutable-workspace
audience: [architect, platform, security, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/sandbox-per-work-order, /patterns/lease-based-worker, /patterns/independent-verifier, /patterns/recovery-checkpoint, /anti-patterns/no-sandbox, /anti-patterns/hidden-agent-state, /architecture/sandboxing]
diagrams: [D25]
mc_refs: [convex/schema.ts, packages/workflow-engine/src/verificationIndependence.ts, convex/lib/workOrderDispatch.ts, apps/orchestration-server/src/factoryWorkspaceOwnership.ts]
---

# Shared Mutable Workspace

**Also known as:** One checkout for everyone · The long-lived agent VM · "Reuse the container, it's faster"

**Severity:** High

## Symptoms

- Several agents or Attempts operate in the same directory or container, concurrently or in sequence.
- The verifier runs in the producer's worktree.
- `node_modules`, build caches, and `.env` files persist between unrelated Work Orders.
- Two Work Orders on the same repository run at once and one overwrites the other's branch.
- A failed Attempt leaves half-applied changes that the next Attempt builds on without knowing.

## Why it fails

An Attempt is an immutable execution against a frozen base. Shared state destroys the "frozen base" half: the input to Attempt N includes the residue of Attempts 1..N−1. Verification independence requires a different worktree with a clean initial state and a final state that matches the subject; a shared workspace fails both. Concurrency adds races: the branch head the verifier checked is not the head the publisher pushed.

Scenario: two dependency-upgrade Work Orders for the same repository are dispatched to a shared worker directory. Attempt A upgrades the payments SDK; Attempt B upgrades the logging library and runs `npm install`, which resolves the payments SDK to a different patch version. A's verifier runs against a tree that now contains B's lockfile. A's tests pass on a candidate that will never exist in production. Later, cleanup for B deletes A's untracked migration script.

## How it shows up in the wild

- A persistent "agent box" per repository where all sessions land.
- CI runners with workspace caching enabled for agent jobs.
- Multi-agent frameworks where agents pass file paths to each other in one container.
- "Review" agents pointed at the same working directory as the "coder" agent.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Candidates cannot be tied to an exact base; evidence describes a mixed state |
| Security | Credentials and secrets from one Attempt visible to the next; cross-tenant leakage in shared fleets |
| Cost | Flaky verification; reruns; manual cleanup |
| Reliability | Races, lost work, and cleanup that destroys evidence |

## The fix

Patterns: [sandbox-per-work-order](/patterns/sandbox-per-work-order), [lease-based-worker](/patterns/lease-based-worker), [independent-verifier](/patterns/independent-verifier), [recovery-checkpoint](/patterns/recovery-checkpoint).

Minimal migration:

1. Allocate a fresh isolation boundary per Attempt (container, remote sandbox, or at minimum a detached worktree from a control-plane snapshot at the exact base commit).
2. Enforce one active mutating Attempt per repository at dispatch.
3. Give the verifier its own allocation; attest clean initial state and matching final subject.
4. Extract results as bundles (commit, tree, diff hash, artifacts); never let the next Attempt read the previous workspace.
5. Reconcile and tear down with proofs; on ambiguity preserve, never reuse.

## How Mission Control prevents it

Dispatch "enforces one active mutating Attempt per repository across Missions" (`docs/OVERVIEW.md`; `convex/lib/workOrderDispatch.ts`, Available). Independence derivation rejects a verifier that "reused the builder worktree", whose isolation attestation "points at the builder root", or whose workspace did not preserve "the clean immutable subject boundary" (`packages/workflow-engine/src/verificationIndependence.ts:149-166`, Available). Isolation modes for Git verification are limited to `DETACHED_GIT_WORKTREE`, `FRESH_CLONE`, `REMOTE_SANDBOX`, `ISOLATED_CONTAINER` (line 169). Remote sandboxes are allocated per Attempt from a `CONTROL_PLANE_SNAPSHOT` with attempt-scoped credentials (`convex/schema.ts:1222, 1538`, Experimental). Workspace ownership after restart is reconciled with fail-closed cleanup (`apps/orchestration-server/src/factoryWorkspaceOwnership.ts`, Available).

Limitation: the `persistent-worker` backend uses detached Git worktrees on one canonical host; filesystem-level isolation between worktrees is weaker than container isolation, which is why Mission Control gates confidential repositories on provider-enforced egress and FDLC treats worktree isolation as a lower-tier mode.

## Detection

- Two Attempts on one repository with overlapping `RUNNING` intervals.
- Verifier isolation attestation with `initialClean: false` or `finalSubjectMatch: false`.
- Independence reasons mentioning worktree reuse or builder root.
- Candidate tree hashes that include files not in the diff (residue from a previous Attempt).
- Sandbox allocations reused across Attempt ids; teardown receipts missing.

## Related

- Fixing patterns: [sandbox-per-work-order](/patterns/sandbox-per-work-order) · [lease-based-worker](/patterns/lease-based-worker) · [independent-verifier](/patterns/independent-verifier)
- Sibling anti-patterns: [no-sandbox](/anti-patterns/no-sandbox) · [hidden-agent-state](/anti-patterns/hidden-agent-state) · [self-verifying-agent](/anti-patterns/self-verifying-agent)
- [Top 10 F06 Unisolated Execution with Live Credentials](/anti-patterns/top-10) · [/architecture/sandboxing](/architecture/sandboxing) · Glossary: Sandbox, Attempt
