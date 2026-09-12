---
title: No Evidence Lineage
description: Pass/fail results carry no subject, producer, method, validity, or provenance, so proof is borrowed across Attempts, candidates, and verifiers, and missing evidence looks like success.
path: /anti-patterns/no-evidence-lineage
audience: [architect, platform, security, leader, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/evidence-bound-acceptance, /patterns/verification-contract, /patterns/candidate-currentness, /patterns/decision-record, /anti-patterns/no-candidate-identity, /anti-patterns/self-verifying-agent, /architecture/evidence]
diagrams: [D14]
mc_refs: [convex/schema.ts, convex/lib/currentVerification.ts, packages/workflow-engine/src/verificationCurrentness.ts, docs/software-factory/verification-first-domain-contracts.md]
---

# No Evidence Lineage

**Also known as:** No Evidence · The green badge · Status without provenance

**Severity:** High

## Symptoms

- Verification results are booleans or badges: `tests: ✓`, `security: ✓`.
- No record says which command ran, on which candidate, by whom, in which environment, when, or until when it is valid.
- A skipped or misconfigured check renders the same as a pass, or as a neutral gray.
- Evidence from a previous Attempt, another PR, or a different Work Order revision is reused.
- Acceptance reads a summary score that averages hard gates.

## Why it fails

Evidence is a durable, attributable record bound to an exact subject, with a producer identity, method, integrity hash, provenance class, and validity conditions. Strip any of those and it becomes an assertion. Without subject binding, proof is borrowed. Without producer identity, independence cannot be judged. Without validity, stale evidence lives forever. Without a distinct "missing" state, absence of proof reads as proof. The chain Claim → Evidence → Verification → Decision → Authority breaks at its second link.

Scenario: a factory shows a dashboard with five green checks. The security scan check is green because the scanner's API key expired and the wrapper script exits 0 on "not configured". The dependency check is green because it is reading the result from last week's run on a different commit (cached by branch). The human approver sees five green checks and accepts. Two of the five never happened for this candidate.

## How it shows up in the wild

- CI dashboards that display "passed" for skipped jobs.
- Status-check APIs that return the latest status for a branch regardless of commit.
- Agent reports: "Ran tests: all passing" with no artifact.
- Composite "quality scores" that average pass/fail across categories.
- Evidence stored as free text in PR comments.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Decisions have no evidence-set digest; audits cannot reconstruct the basis of acceptance |
| Security | Disabled scanners go unnoticed; borrowed proof masks real failures |
| Cost | Escaped defects; re-verification by hand |
| Reliability | "Verified" is a coin flip on whether the checks actually ran |

## The fix

Patterns: [evidence-bound-acceptance](/patterns/evidence-bound-acceptance), [verification-contract](/patterns/verification-contract), [candidate-currentness](/patterns/candidate-currentness), [decision-record](/patterns/decision-record).

Minimal migration:

1. Define an evidence envelope: subject tuple, producer identity (actor type, Attempt, invocation, adapter), tool and command, exit code, duration, content hash, provenance class, validity window, acceptance criterion ids.
2. Give every check five outcomes — `PASS`, `FAIL`, `SKIPPED`, `NOT_CONFIGURED`, `ERROR` — and let only `PASS` satisfy a mandatory criterion.
3. Store evidence as records with artifacts, never as booleans or comments.
4. At acceptance, evaluate each mandatory criterion against bound, current, live evidence; record the evidence-set digest on the Decision.
5. Reject any evidence whose subject tuple does not match the current candidate.

## How Mission Control prevents it

`evidenceEnvelopes` carry `category`, `result` (check status), `acceptanceCriterionIds[]`, `producer {actorType, actorId, role, independent, factoryPurpose, factoryDefinitionVersionId, attemptId, executorInvocationId, executorAdapter}`, `tool {name, version, command, exitCode, durationMs}`, `independence`, `artifactIds[]`, `sourceRevision`, `candidateRevision`, `contentHash`, `provenance: LIVE|SYNTHETIC|DEMO|IMPORTED|LEGACY`, and the full identity tuple (`convex/schema.ts:2850`, Available). Only `provenance === "LIVE"` evidence counts toward acceptance (`convex/lib/currentVerification.ts:143-148`). Check statuses are `PASS|FAIL|SKIPPED|NOT_CONFIGURED|ERROR` and "Only `PASS` satisfies a mandatory check" (`docs/software-factory/verification-and-gate-state-machines.md`). Currentness requires the receipt's evidence set to be present, deduplicated, and every envelope bound to the exact lineage (`verificationCurrentness.ts:290-316`). "Never borrow proof from another Attempt, candidate, pull-request head, WorkOrder revision, verifier, or policy" (`docs/OVERVIEW.md`). "Missing token, cost, model-request, or retry telemetry remains `null`; Mission Control never invents zeroes."

Limitation: the documented evidence lifecycle (`RECORDED → USABLE → STALE | SUPERSEDED | REVOKED | CONFLICTED`) is not a schema column; staleness is expressed through receipt `validUntil` and invalidation rather than a per-envelope state.

## Detection

- Evidence records lacking subject tuple, producer identity, or content hash.
- Checks reported as pass with no artifact or with exit code absent.
- Green results whose recorded `candidateRevision` differs from the accepted candidate.
- Acceptance Decisions without an evidence-set digest.
- Scanners whose last successful run is older than the last accepted candidate.

## Related

- Fixing patterns: [evidence-bound-acceptance](/patterns/evidence-bound-acceptance) · [verification-contract](/patterns/verification-contract) · [candidate-currentness](/patterns/candidate-currentness)
- Sibling anti-patterns: [no-candidate-identity](/anti-patterns/no-candidate-identity) · [self-verifying-agent](/anti-patterns/self-verifying-agent) · [prompt-as-governance](/anti-patterns/prompt-as-governance)
- [Top 10 F03 Untraceable Candidates and Borrowed Evidence](/anti-patterns/top-10) · [/architecture/evidence](/architecture/evidence) · Design principle 5
