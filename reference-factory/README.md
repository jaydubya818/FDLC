# FDLC Reference Lab

A dependency-free teaching factory for one bounded objective: fix `GET /sum`
without changing protected acceptance tests. Requires Node 22.13+. Download and extract the Lab package from `/lab`; no repository access, account or dependency installation is needed.
This extends the existing Reference Lab; it does not run a live coding agent.

From this directory:

```sh
node lab.mjs all
node lab.mjs failed
node lab.mjs recovery
node lab.mjs approval
node lab.mjs --report > qualification.json
```

All eight scenarios should match their expectations. A deliberately blocked
case exits 0 when the gate blocks for the expected reason. `ALLOW` establishes
local review eligibility; `WAIT` demonstrates absent production authority.
Neither publishes, merges, deploys or grants real permission.

Inspect `factory-definition.json` (a pedagogical contract, not a canonical
Factory Manifest payload), `work-order.json`, `runAgent`, `runVerifier`, `gate`,
`sandbox/src/api.mjs` and `sandbox/tests/api.test.mjs`. The tests use native
Request/Response objects without opening a server or making network calls.
The producer changes only `src/add.js`; observed file changes, protected tests,
separate identity labels, exact candidate SHA-256 and passing evidence gate
progression. Verification uses a fresh Node process and rejects a changed
candidate. Temporary fixture copies are removed; the JSON report retains the
candidate identities, verifier outputs, output hashes, decisions and failed
history. Redirect it outside a fixture directory and retain it for review.

`recovery` keeps the first failed Attempt and evidence, corrects the candidate,
and re-runs verification. `approval` remains `awaiting-human`; this Lab has no
release command. `--report` records the exact local composition, environment,
acceptance criteria, all eight cases and remaining qualification gaps. It is an
illustrative evidence report, not the canonical Qualification Record schema.
`productionQualified` is always false.

To use your own stack, replace only the producer seam while keeping the
WorkOrder, protected criteria and gate contract. Re-qualify the exact agent,
harness, model, tools, context, runtime, authority and workload. This Lab does
not implement adapters for named products or claim cross-stack compatibility.
The optional Factory Skills Starter Kit (https://fdlc.ai/factory-skills; source in
`factory-starter/` of https://github.com/jaydubya818/FDLC) is a separate
opinionated pilot, not a framework requirement.

Run trusted code only. Local functions, identity strings and temporary folders
are not separate security principals or an OS sandbox. The producer and local
operator can edit the repository. A real factory must isolate execution,
protect verification and authority, authenticate identities, retain immutable
evidence, bound resources and qualify representative failure/recovery cases.
Production reliability, cost and model/harness compatibility are not proven.

Contract and negative-control checks from this directory:

```sh
node --test contract.test.mjs
```

The guided 30–60 minute exercise, stack-neutral contract map and engineering
playbook live at `/lab` and the Guide's engineering-experience appendix.

## Operating companion: work that survives the command

`operations.mjs` adds a separate, dependency-free local operating exercise.
It reuses this Lab's scripted producer, real API verifier and gate. It keeps
intake, WorkOrders, Attempts, candidates, evidence, local handoff receipts and
operator decisions on disk between fresh Node processes. The original eight
`lab.mjs` scenarios and their contracts remain unchanged.

Run the complete exercise in a new temporary directory:

```sh
node operations.mjs demo
```

The JSON report names the retained `directory`, ten checks, `passed`, and
`finalState`. Expected: `passed: true`, one `accepted-locally` WorkOrder, one
`cancelled` WorkOrder, two reserved work units, `released: false` and
`productionQualified: false`. The demo deliberately exits a child process after
a real filesystem receipt has been written but before its acknowledgment is
saved. It then reconciles that receipt without creating another Attempt or
another receipt. It also checks event replay, a failing API test, a correction,
stale review rejection, the shared budget limit and cancellation.

### Run each command yourself

Choose a directory that does not exist; `init` never overwrites an existing
directory. Its parent must already exist. Commands print JSON.

```sh
node operations.mjs init ./operations-run
node operations.mjs enqueue ./operations-run example-event-001
node operations.mjs enqueue ./operations-run example-event-001
node operations.mjs work ./operations-run
node operations.mjs status ./operations-run
```

The second enqueue returns `outcome: "duplicate"` and the original WorkOrder
ID. Reusing that event ID with different input is an error. `work` processes
one eligible item and should produce `review-ready`. The separate `status`
command reads its persisted candidate SHA-256 and verifier-output SHA-256 after the worker
has exited. With no eligible work, `work` returns `no-eligible-work`; this idle
response does not append a history entry.

Read the candidate, API verification output and gate result in `state.json` and
the Attempt's directory before making a decision. Copy that item's `id`,
`candidate` and `evidence` values from `status` into the three shell variables
below. Here, `evidence` is the digest of the saved verifier output, not a digest
of the whole evidence object. The command intentionally requires all three exact values:

```sh
node operations.mjs review ./operations-run "$WORK_ORDER_ID" accept \
  --candidate="$CANDIDATE_SHA256" --evidence="$EVIDENCE_SHA256"
```

`reject` replaces `accept` when the operator declines a review-ready candidate.
Acceptance records `accepted-locally` by the local exercise operator; rejection
records `rejected-locally`. Both are terminal for that WorkOrder. Neither means
release. An identical repeated decision returns the recorded receipt; a
conflicting decision fails. A stale digest, changed workspace, missing evidence
or mismatched handoff receipt cannot earn local acceptance.

| Command | Behavior |
| --- | --- |
| `init <new-directory>` | Create a new operating record and pin the local composition and teaching profile. |
| `enqueue <directory> <event-id> [--broken]` | Admit manually supplied intake; deduplicate by event ID and input digest. `--broken` deliberately makes the first producer Attempt fail API verification. |
| `work <directory>` | Run or resume one eligible item; reserve a unit only when admitting a new Attempt. |
| `status <directory>` | Read persisted states, exact review digests, budget and current writer-lock presence. |
| `review <directory> <work-order-id> accept\|reject --candidate=<sha256> --evidence=<sha256>` | Recheck the exact current subject and record a local operator decision. |
| `cancel <directory> <work-order-id>` | Stop eligible pending work between command invocations; retain its Attempts and budget history. |
| `reconcile <directory>` | Recover a provably dead same-host writer and inspect incomplete candidate or local effect records before resuming. |
| `demo [<new-directory>]` | Run the ten-check subprocess exercise and retain its evidence. |

These commands do not install a schedule. `enqueue` is a manual trigger adapter.
A clock, webhook, event queue or hosted worker would require a separately
implemented and qualified adapter.

### Restart and unknown-effect exercises

Use another new directory for each exercise. Add `--crash=after-candidate` or
`--crash=after-effect` to `work`. These explicit fault-injection options exit the
worker process with code **86**, leaving its writer lock and recorded state.
Ordinary validation errors exit **1** with an error object. A completed command
that records a failed verification or a budget block exits **0**; inspect its
`outcome` rather than interpreting the process exit as a verified result.

```sh
node operations.mjs init ./restart-exercise
node operations.mjs enqueue ./restart-exercise restart-001
node operations.mjs work ./restart-exercise --crash=after-effect
node operations.mjs status ./restart-exercise
node operations.mjs reconcile ./restart-exercise
node operations.mjs status ./restart-exercise
```

After an `after-candidate` crash, reconciliation preserves the saved candidate;
the next `work` resumes verification within the same Attempt. After an
`after-effect` crash, reconciliation inspects the real local receipt. A matching
receipt produces `review-ready`. An absent local receipt records that finding
and allows the same operation key to be retried by `work`. A different receipt
remains unresolved and blocks retry and cancellation. These observations apply
only to this local filesystem effect, not to a remote service whose outcome may
remain unknowable. Never delete a lock or receipt to make a gate pass.

The local receipt key binds factory instance, WorkOrder, operation and exact
candidate; it is retained across recovery. The receipt also binds the verifier
output digest. Candidates live in separate `attempts/<attempt-id>/` directories;
correction never overwrites the failed Attempt's files or evidence.

### Budgets, configuration and local ownership

`operating-profile.json` is this companion's **runtime teaching profile**. It is
not a Factory Definition export from `/start`, a canonical manifest, or an
adapter for that design-only export. Its default allows two Attempts per
WorkOrder and a **global parent budget of two scripted Attempts across this
entire operating directory**. The parent budget includes failed and interrupted
Attempts. It does not reset for a new event, correction or restarted process;
resuming the same Attempt and reconciling a receipt do not reserve another unit.

For a bounded correction, enqueue with `--broken`, run `work` twice and inspect
the linked first and second Attempts. The first fails real API tests; the second
uses the known correction and reruns the verifier. New work then reaches
`blocked-parent-budget`. This is scripted correction, not delegation to agents.
The verifier subprocess has a five-second timeout. Work units measure admission
count, not dollars, tokens or total execution time.

If exploring a different finite profile, edit a disposable copy of the template
before `init`. The operating record pins that profile; editing the template
profile later does not raise an existing directory's budget. Changes to the
companion code, Lab code, fixture or contracts fail the composition check on
further mutations. Preserve the old directory and initialize a new one.

Writers use an exclusive local owner directory and atomic JSON replacement.
`status` is read-only and may run while a writer is present. Reconciliation may
recover only a same-host lock whose recorded PID is no longer alive; a live,
unreadable, foreign-host or ambiguous owner fails closed. An interrupted lock
acquisition or recovery needs manual inspection. This is serialized local
process ownership, not distributed leases, network-filesystem coordination or
power-loss qualification. Cancellation applies between invocations; it does not
preempt a running verifier. The local owner can edit every file, so hashes and
role labels do not establish tamper-proof storage or independent authority.

The durable history is in `state.json`; filesystem handoff receipts are in
`receipts/`; recovered owner records remain in `recovered-locks/`. The command
never deletes an operating directory. Dispose of a directory only after you have
finished inspecting its evidence.

### Verify the operating contract

```sh
node --test contract.test.mjs operations.test.mjs
```

The companion tests use actual child-process exits and new processes reading
the retained files. They cover restart, duplicate intake, unknown/missing/wrong
receipts, preserved failed evidence, global and per-WorkOrder limits, exact
review binding, stale-candidate rejection, terminal decisions and cancellation.
The demonstration establishes these local teaching behaviors; it does not
qualify a model, scheduler, cloud runtime, security sandbox or production factory.
