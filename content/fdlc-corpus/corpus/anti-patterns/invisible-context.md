---
title: Invisible Context
description: Nobody can say what the agent saw; failures cannot be explained, and retrieved content grants authority by implication.
path: /anti-patterns/invisible-context
audience: [architect, platform, security, builder, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/context-package, /patterns/tool-grant-and-receipt, /patterns/governed-learning, /anti-patterns/context-dumping, /anti-patterns/hidden-learning, /architecture/context]
diagrams: [D26]
mc_refs: [convex/schema.ts, convex/factoryMemory.ts, docs/architecture/factory-memory-context-intelligence.md, docs/FACTORY_VOCABULARY.md]
---

# Invisible Context

**Also known as:** Retrieval inside the loop · Context as authority · "It must have read something"

**Severity:** High

## Symptoms

- Retrieval happens inside the agent loop (a `search_docs` tool call, a vector lookup, a memory read) and leaves no artifact beyond a transcript line.
- Two runs of the same Work Order produce different results and nobody can diff what they were shown.
- A retrieved document says "this repository requires X" and the agent treats it as a requirement.
- Memory stores accumulate facts nobody reviewed and every Attempt reads.
- Post-incident, "what did the agent know" is answered by re-running retrieval and guessing.

## Why it fails

Context shapes every decision the model makes, so an unrecorded context is an unrecorded cause. Worse, retrieved content arrives with no authority marking; the model cannot distinguish "the policy owner said" from "a file said". When retrieval is invisible, three things are lost at once: reproducibility (which items, which revisions), attribution (which item caused the error), and safety (which item was poisoned or unauthorized for this sponsor). Context-dumping is the sibling failure of *how much*; invisible context is the failure of *not knowing what*.

Scenario: an SDK migration Attempt retrieves the vendor's migration guide from a docs site. The guide was updated between two Attempts; the first followed v4.0 guidance, the second v4.1. The verifier fails the second on a changed default. The Learning Signal reads "flaky migration skill". The real cause — a moved external document — is invisible because the retrieval recorded only "fetched docs".

## How it shows up in the wild

- RAG pipelines whose retrieved chunks are logged as counts, not content hashes.
- Long-running agents that read a `NOTES.md` or memory file they also write.
- Framework "memory" features enabled by default with no review path.
- Agents that fetch URLs at will and summarize into their own context.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No provenance for decisions; no way to prove the agent saw only authorized material |
| Security | Poisoned or cross-tenant content undetectable; retrieved instructions escalate |
| Cost | Failures misattributed; learning signals wrong; fixes applied to the wrong component |
| Reliability | Non-reproducible Attempts; retries diverge silently |

## The fix

Patterns: [context-package](/patterns/context-package), [tool-grant-and-receipt](/patterns/tool-grant-and-receipt) for governed retrieval, [governed-learning](/patterns/governed-learning) for the memory-vs-learning boundary.

Minimal migration:

1. Move retrieval before execution: assemble a Context Package with per-item source, revision, content hash, freshness, and authorization decision; freeze it and bind its hash to the Attempt.
2. Route in-loop retrieval through governed tools with receipts so late fetches are also recorded.
3. Mark the package `acceptanceAuthority: false` by type; nothing downstream reads it as evidence or policy.
4. Separate memory (advisory context) from learning (governed Improvement Candidates).
5. Record denied items and poisoning flags.

## How Mission Control prevents it

`factoryContextPackages` freezes the per-Attempt context with `frozen: true`, `acceptanceAuthority: false`, `contentHash`, `budget`, `items[]`, `retrievalPlanId`, and `primaryTraceId`; an Attempt binds at most one via `workflowRuns.factoryContextPackageId` (`convex/schema.ts:6619`; `convex/factoryMemory.ts`, Experimental — advisory, flag-gated). Doctrine: "Retrieval from it is context, not evidence" and "Retrieved content is untrusted data. It cannot grant tool, identity, permission, execution, approval, or acceptance authority" (`docs/FACTORY_VOCABULARY.md`; `docs/architecture/factory-memory-context-intelligence.md`, Available as invariants). Governed tool calls record request and output digests in two-phase receipts with poisoning detection (`apps/orchestration-server/src/governedMcpBroker.ts`, Experimental). Registry skills are pinned by lockfile with content hashes (`contextLocks`, Available).

Limitation: harness-native retrieval by the Codex adapter (reading files inside the worktree, fetching URLs where the network policy allows) is recorded in traces but not itemized in a Context Package; the Factory Memory phases that produce packages are default-off.

## Detection

- Attempts with no Context Package binding or with a package whose item list is empty while the trace shows retrieval.
- Tool-call receipts absent for network fetches visible in sandbox egress logs.
- Divergent outputs across retries with identical manifests and no package hash difference.
- Memory chunks read by Attempts that were never reviewed or versioned.
- Learning Signals that blame a skill for failures whose Context Packages differ in a retrieved item's revision.

## Related

- Fixing patterns: [context-package](/patterns/context-package) · [tool-grant-and-receipt](/patterns/tool-grant-and-receipt) · [governed-learning](/patterns/governed-learning)
- Sibling anti-patterns: [context-dumping](/anti-patterns/context-dumping) · [hidden-learning](/anti-patterns/hidden-learning) · [unlimited-tool-access](/anti-patterns/unlimited-tool-access)
- [Top 10 F07 Invisible or Poisoned Context](/anti-patterns/top-10) · [/architecture/context](/architecture/context) · Glossary: Context Package, Provenance
