---
title: No Candidate Identity
description: Evidence and decisions are keyed by branch, PR number, or Work Order, not by exact content, so stale passes are accepted for newer candidates.
path: /anti-patterns/no-candidate-identity
audience: [architect, platform, security, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/candidate-currentness, /patterns/independent-verifier, /patterns/publication-permit, /anti-patterns/no-evidence-lineage, /anti-patterns/self-verifying-agent, /architecture/evidence]
diagrams: [D14]
mc_refs: [packages/workflow-engine/src/verificationSubject.ts, packages/workflow-engine/src/verificationCurrentness.ts, convex/schema.ts]
---

# No Candidate Identity

**Also known as:** "The branch is green" · PR-number evidence · Verification by reference

**Severity:** High

## Symptoms

- The verification record says `branch: factory/wo-104-01` or `pr: 418`, not a commit, tree, and diff hash.
- Approval is attached to the PR and survives new pushes.
- A retry replaces the candidate but the previous verification still "counts".
- Nobody can produce the exact bytes that were verified.
- Reviewers approve a diff view that changes under them.

## Why it fails

A branch is a mutable pointer; a PR is a conversation about a mutable pointer. Evidence is a statement about a specific input. Keying evidence by a pointer means the evidence silently re-attaches to whatever the pointer points to next. The candidate must be identified by content — commit, tree, diff hash — plus the Work Order revision and verification contract digest it was produced under and the Attempt that produced it. Without that tuple, currentness cannot be computed and independence cannot be attested (the verifier cannot prove it checked *this* candidate).

Scenario: an Attempt produces commit A; the verifier passes it; a human approves PR #418. The agent, responding to a reviewer comment, pushes commit B to the same branch. The pipeline's acceptance check reads "PR #418: verified, approved" and merges B. B was never verified. The reviewer approved A.

## How it shows up in the wild

- CI status checks keyed to the PR head at check time but consumed at merge time without re-comparison.
- Approval bots that carry approvals forward across pushes ("dismiss stale reviews" disabled).
- Agent frameworks that report "task complete" with a branch name.
- Artifact promotion by tag (`latest`, `release-candidate`) rather than digest.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Decisions bind to nothing exact; audits cannot reproduce what was approved |
| Security | A late push after approval is an unreviewed change with an approval attached |
| Cost | Escaped defects; emergency rollbacks |
| Reliability | Races between verify and merge; flaky "verified" state |

## The fix

Patterns: [candidate-currentness](/patterns/candidate-currentness), [independent-verifier](/patterns/independent-verifier), [publication-permit](/patterns/publication-permit).

Minimal migration:

1. When a producer Attempt finishes, freeze a Verification Subject: repository, commit, tree, diff hash, Work Order id and revision, contract digest, source Attempt id; compute its digest.
2. Bind every evidence envelope, receipt, and verifier Attempt to that digest.
3. Bind approvals and permits to the candidate revision, not the PR.
4. At acceptance and publication, recompute: newest candidate, newest exact-bound verification, provider head equals the candidate commit.
5. Treat a moved head as "not current" until a new lineage passes.

## How Mission Control prevents it

`createGitVerificationSubject` requires "exact lowercase commit/tree SHA lineage and a matching bound head" and computes a subject digest over Work Order, revision, contract digest, source Attempt, repository, and provider identity (`packages/workflow-engine/src/verificationSubject.ts:91-135`, Available). The v2 pre-publication subject adds `baseSha` and `rawDiffSha256` (lines 73-79). Currentness selects the newest candidate-ready source Attempt and requires the GitHub App projection's `headSha === subject.candidateSha` with an unexpired attestation (`verificationCurrentness.ts:158-169, 342-363`); "A moved pull-request head invalidates current eligibility until a new exact subject and verification lineage pass" (Available, Qualified). Publication permits are issued for a `candidateRevision` and recorded in `subjectPublicationBinding` (`convex/factory/attempts.ts:1136-1328`). Approvals bind `workOrderRevisionNumber` and are invalidated by revision (`approvalDecisions`, `convex/schema.ts:2695`).

Limitation: none observed for Git candidates; automation subjects use output snapshot content hashes, which is the same principle for non-Git outputs.

## Detection

- Evidence records without `candidateSha`/`treeSha` (or equivalent content hash) and `sourceAttemptId`.
- Approvals whose recorded head differs from the head at merge.
- Receipts reused across multiple commits on the same branch.
- Currentness denials with "head is stale" that were overridden or absent.
- PRs merged with commits later than the last verified candidate.

## Related

- Fixing patterns: [candidate-currentness](/patterns/candidate-currentness) · [independent-verifier](/patterns/independent-verifier) · [publication-permit](/patterns/publication-permit)
- Sibling anti-patterns: [no-evidence-lineage](/anti-patterns/no-evidence-lineage) · [self-verifying-agent](/anti-patterns/self-verifying-agent) · [agent-has-production-credentials](/anti-patterns/agent-has-production-credentials)
- [Top 10 F03 Untraceable Candidates and Borrowed Evidence](/anti-patterns/top-10) · [/architecture/evidence](/architecture/evidence) · Glossary: Candidate, Verification Subject
