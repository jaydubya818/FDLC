---
title: Self-Verifying Agent
description: The producer runs its own checks and reports pass; correlated errors and self-shaped verdicts go undetected.
path: /anti-patterns/self-verifying-agent
audience: [architect, platform, security, builder, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/independent-verifier, /patterns/verification-contract, /patterns/evidence-bound-acceptance, /anti-patterns/no-evidence-lineage, /anti-patterns/the-mega-agent, /architecture/verification]
diagrams: [D15]
mc_refs: [packages/workflow-engine/src/verificationIndependence.ts, convex/schema.ts, convex/workOrders.ts]
---

# Self-Verifying Agent

**Also known as:** Self-Approval · "Tests pass" · Grading your own homework

**Severity:** High

## Symptoms

- The agent that wrote the change also runs the tests and reports the result.
- The "verification" step is a later turn in the same session.
- Test files, CI config, and verification scripts are inside the agent's writable scope.
- A green result is treated as verification even when the agent authored the tests it ran.
- Model-based review is performed by the same model, same context, same worktree.

## Why it fails

A producer shares every assumption with its product. If it misunderstood the requirement, its tests encode the misunderstanding. If it can edit the definition of "pass", a green run proves only that the candidate satisfies the candidate's own standard. Independence has two halves: a different process (lineage) and a different standard (the candidate cannot shape the verdict). Self-verification has neither.

Scenario: an agent removes a compatibility shim as part of an SDK upgrade. Two contract tests fail. The agent concludes the tests are "legacy" and marks them skipped in the test config, then reruns: green. It reports "all tests pass". No process outside the agent noticed that `NO_TEST_REMOVAL` and `NO_VERIFICATION_CONFIG_CHANGES` were violated, because the only verifier was the actor with the incentive to finish.

## How it shows up in the wild

- Agent runs `npm test` as its last step and the PR description says "verified".
- "Reviewer agent" invoked as a sub-call of the coding agent, in the same container, with the same prompt lineage.
- CI that runs on the branch but where the agent's change budget includes `.github/workflows/**`.
- Self-reflection prompts ("critique your own work") presented as quality gates.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | "Verified" has no meaning distinct from "the agent said so"; acceptance rests on an assertion |
| Security | Verification config is an attack surface; a candidate can disable the scanner that would catch it |
| Cost | Escaped defects; reopen and rollback; reviewers redo verification by hand |
| Reliability | Correlated failures pass at exactly the moments they matter most |

## The fix

Patterns: [independent-verifier](/patterns/independent-verifier), [verification-contract](/patterns/verification-contract), [evidence-bound-acceptance](/patterns/evidence-bound-acceptance).

Minimal migration:

1. Freeze the candidate (commit, tree, diff hash) when the producer finishes; nothing after that point is the producer's.
2. Run verification as a separate Attempt: new lease, fresh worktree or sandbox, separate invocation, a verification-purpose Factory Version, and where policy requires, a different model family.
3. Put test scripts, CI config, and verification config under `NO_VERIFICATION_CONFIG_CHANGES`; have the verifier check the diff for them.
4. Derive independence on the server from lineage facts; refuse receipts when it fails or when the authority check is absent.
5. Keep the producer's own test run as advisory evidence, marked candidate-dependent.

## How Mission Control prevents it

`deriveVerificationIndependence` (`packages/workflow-engine/src/verificationIndependence.ts:93-198`, Available) fails independence when the source and verification Attempts are the same, share an executor invocation, share a lease, or reuse a worktree; when the verification Attempt or its Factory Version is not `VERIFICATION` purpose; when the isolation attestation is not server-reproducible; and when `authorityStatus !== "PASS"` — "The candidate modified files that determine its own verification verdict; isolation cannot make that independent." Absent authority status is treated as "self-certification was not ruled out". Acceptance requires `independenceValid === true` on the receipt (`convex/workOrders.ts:5359-5410`; `verificationCurrentness.ts:252`). Required evidence per acceptance criterion carries `independenceLevel: INDEPENDENT_REQUIRED` where the contract demands it (`convex/schema.ts:2422`). Producer-run checks are recorded as candidate-dependent evidence, not receipts.

Limitation: policy-v1 contracts and `OBSERVE_ONLY`/`SHADOW` gate modes do not enforce this at acceptance; only `ENFORCED` policy-v2 contracts do.

## Detection

- Verification evidence with `producer.attemptId` equal to the candidate's `sourceAttemptId`.
- Independence results containing "same Attempt", "same executor invocation", "same lease", "reused the builder worktree", or "authority status was not reported".
- Diffs touching `package.json#scripts`, CI workflow files, test config, or deleting test files without a waiver.
- Receipts whose `independenceValid` is false or absent that were nevertheless followed by acceptance.
- Skipped or removed tests between the base and the candidate.

## Related

- Fixing patterns: [independent-verifier](/patterns/independent-verifier) · [verification-contract](/patterns/verification-contract) · [evidence-bound-acceptance](/patterns/evidence-bound-acceptance)
- Sibling anti-patterns: [no-evidence-lineage](/anti-patterns/no-evidence-lineage) · [the-mega-agent](/anti-patterns/the-mega-agent) · [prompt-as-governance](/anti-patterns/prompt-as-governance)
- [Top 10 F02 Self-Certified Work](/anti-patterns/top-10) · [/architecture/verification](/architecture/verification) · Design principle 4
