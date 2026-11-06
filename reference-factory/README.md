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
The optional Factory Skills Starter Kit at `../factory-starter/` is a separate
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
