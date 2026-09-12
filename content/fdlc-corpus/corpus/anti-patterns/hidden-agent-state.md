---
title: Hidden Agent State
description: Progress, ownership, and decisions live in the model's context window or the worker's local files, so a restart loses everything and nobody can say what the agent is doing now.
path: /anti-patterns/hidden-agent-state
audience: [architect, platform, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/lease-based-worker, /patterns/recovery-checkpoint, /patterns/decision-record, /patterns/context-package, /anti-patterns/infinite-retry-loop, /anti-patterns/shared-mutable-workspace, /architecture/execution-vocabulary, /architecture/observability]
diagrams: [D31, D23]
mc_refs: [convex/schema.ts, convex/lib/executionRecovery.ts, convex/factory/attempts.ts, docs/software-factory/worker-runtime-operations.md]
---

# Hidden Agent State

**Also known as:** State trapped in model context · The progress file · "Ask the agent what it's doing"

**Severity:** High

## Symptoms

- The only record of what an Attempt has done is the transcript in the agent's context window.
- Progress is a `PROGRESS.md` or `TODO.json` on the worker's disk that the agent writes and reads.
- A restarted worker cannot tell whether it owns the Attempt or what phase it was in.
- The control plane's view of an Attempt is "running" from start to whatever end arrives.
- Operators query the agent ("what's your status?") because no system of record has it.

## Why it fails

Durable execution requires that ownership, phase, and consequential facts be recorded outside the process doing the work. A context window is ephemeral, unqueryable, and lossy under compaction. A local file survives a process restart but not a host loss, is writable by the agent (so it can be wrong or manipulated), and is invisible to the control plane. When state is hidden, the runtime cannot decide ownership after a crash (two workers may both believe they own the Attempt), cannot reconcile external effects before a retry, and cannot show a human what is happening without asking the model.

Scenario: a long-running migration Attempt tracks its 12-file plan in its context and in a local notes file. The worker host is replaced. The new host starts a fresh session; the notes file is gone; the control plane shows the Attempt `RUNNING` with a heartbeat that stopped. The orchestrator eventually retries — as the same Attempt id — and the new session, with no memory, re-migrates files 1–9 on top of the half-migrated branch. The old session's final message, buffered, arrives later and marks the Attempt complete.

## How it shows up in the wild

- Long-running agent harnesses whose durability story is "a progress file and a feature list".
- Agent frameworks with in-memory state graphs and no persistent checkpoints.
- Orchestrators that treat an agent process as a black box until exit code.
- Dashboards that render the agent's self-reported status as the system status.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No Attempt phases, checkpoints, or events; decisions made inside the loop are unrecorded |
| Security | Agent-writable state can be manipulated; injected instructions persist across turns via the notes file |
| Cost | Lost work on every restart; duplicated effort |
| Reliability | Split ownership after crashes; retries re-run completed steps; late reports corrupt state |

## The fix

Patterns: [lease-based-worker](/patterns/lease-based-worker), [recovery-checkpoint](/patterns/recovery-checkpoint), [decision-record](/patterns/decision-record), [context-package](/patterns/context-package) for the memory boundary.

Minimal migration:

1. Move ownership to a fenced lease in the control plane; every hardened write re-checks it.
2. Record phases and checkpoints as control-plane events (`CLAIMED → PREPARING → EXECUTING → VALIDATING → AWAITING_* → PUBLISHING → TERMINAL`), with external identifiers as they are created.
3. Emit an ordered event stream and trace spans per Attempt; make the control plane the system of record for status.
4. Treat agent-written notes as advisory context, versioned and reviewable, never as authority or as the recovery source.
5. On loss, compute disposition from recorded state; never adopt by asking the process or reading its files.

## How Mission Control prevents it

`workflowRuns` is "the Attempt system of record" (`convex/schema.ts:7182`) with `executionPhase: CLAIMED|PREPARING|EXECUTING|VALIDATING|AWAITING_HUMAN_REVIEW|AWAITING_VERIFICATION|PUBLISHING|TERMINAL`, a fenced `lease`, `executionCheckpoint`, `runtimeDisposition`, and an ordered `runEvents` stream of 56 event types (`convex/schema.ts:239-298, 5233-5583`, Available — Qualified). Ownership after loss is computed by `buildExecutionRecoverySummary` from recorded lease and checkpoint facts (`convex/lib/executionRecovery.ts:54-113`); "A manifest PID is never used to adopt or kill a process after restart" and "A stale process cannot report evidence or authorize publication after expiry, replacement, cancellation, or session/generation change" (`docs/software-factory/worker-runtime-operations.md`). Harness results are "untrusted diagnostics" (`docs/OVERVIEW.md`); handoffs use a structured contract where "Missing facts are represented as `unknown`, never inferred". Traces and observations link to run events, verification runs, and evidence envelopes (`traces`, `traceObservations`, `convex/schema.ts:7185`). Factory Memory is `acceptanceAuthority: false`.

Limitation: what happens *inside* the harness between checkpoints (the adapter's own reasoning turns) is visible only through the adapter's telemetry, which varies by adapter; Mission Control records it as diagnostics, not authority.

## Detection

- Attempts with a single `RUNNING` interval and no phase transitions or checkpoints.
- Heartbeat gaps with no disposition change; `RUNNING` Attempts whose lease expired long ago.
- Agent-written files on the worker that the orchestrator reads to decide anything.
- Late events accepted after a lease change (generation mismatch not enforced).
- Status shown to operators sourced from agent messages rather than control-plane records.

## Related

- Fixing patterns: [lease-based-worker](/patterns/lease-based-worker) · [recovery-checkpoint](/patterns/recovery-checkpoint) · [decision-record](/patterns/decision-record)
- Sibling anti-patterns: [infinite-retry-loop](/anti-patterns/infinite-retry-loop) · [shared-mutable-workspace](/anti-patterns/shared-mutable-workspace) · [invisible-context](/anti-patterns/invisible-context)
- [Top 10 F08 Runaway Retry and Hidden State](/anti-patterns/top-10) · [/architecture/execution-vocabulary](/architecture/execution-vocabulary) · [/architecture/observability](/architecture/observability)
