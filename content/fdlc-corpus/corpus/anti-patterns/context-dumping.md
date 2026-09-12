---
title: Context Dumping
description: The whole repository, every document, and all history are stuffed into the window, so cost and latency climb, quality drops, and the poisoning surface becomes the entire corpus.
path: /anti-patterns/context-dumping
audience: [architect, platform, builder, factory-engineer]
level: [practitioner]
status: draft
related: [/anti-patterns, /patterns/context-package, /patterns/model-routing, /anti-patterns/invisible-context, /anti-patterns/frontier-model-everywhere, /architecture/context, /architecture/economics]
diagrams: [D26]
mc_refs: [convex/schema.ts, packages/memory/src/factory/planner.ts, docs/architecture/factory-memory-context-intelligence.md]
---

# Context Dumping

**Also known as:** "Just give it the whole repo" · Million-token prompts · Context as a substitute for retrieval

**Severity:** Medium

## Symptoms

- Prompts routinely approach the model's context limit regardless of task size.
- Context assembly has no budget, no ranking, and no per-item reason.
- Latency and cost per Attempt scale with repository size, not task size.
- Quality degrades on long inputs ("lost in the middle"), and the response is to add more context.
- The verifier receives the same dump as the producer.

## Why it fails

Context is a budget, not a bucket. Every token costs money and latency, competes for the model's attention, and is a potential injection vector. Dumping trades a retrieval problem (find the relevant 2%) for an attention problem (ignore the irrelevant 98%) and hands the attention problem to the component least able to audit it. It also destroys attribution: when everything was in context, nothing explains the output. Context dumping is distinct from [invisible-context](/anti-patterns/invisible-context): a dump can be perfectly recorded and still be wrong; invisible context can be small and still unexplainable. Both are fixed by the same pattern.

Scenario: a dependency-upgrade Attempt loads the entire monorepo (illustrative: 400k tokens) because "the SDK might be used anywhere". The model, working near its limit, misses that `src/payments/legacy/` still imports v3, because that directory sat between two much larger unrelated services. A targeted retrieval — "files importing `@acme/payments`" — would have returned 14 files, including the one that was missed.

## How it shows up in the wild

- Repository "flattening" tools that concatenate the codebase into one prompt.
- Agents that `cat` every file they encounter with no budget.
- Long-context marketing taken as a design principle ("the model can handle it").
- Memory features that prepend the full history of prior sessions.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Per-item authorization impossible; classification boundaries crossed wholesale |
| Security | Any poisoned file in the repository is in every prompt |
| Cost | Cost per accepted outcome dominated by input tokens; frontier models required to cope |
| Reliability | Attention failures on exactly the details that matter; nondeterministic omissions |

## The fix

Patterns: [context-package](/patterns/context-package), [model-routing](/patterns/model-routing) (right-sized routes need right-sized context).

Minimal migration:

1. Set a context budget per logical route and per Work Order kind; make it part of the Factory Version.
2. Build a retrieval plan: scope from the Work Order (paths, data boundaries), then rank by relevance; record the reason each item was included and why others were dropped.
3. Prefer structured retrieval (symbol references, dependency graphs, test ownership) over raw file dumps.
4. Give the verifier its own package derived from the verification plan, not the producer's.
5. Measure: tokens per accepted outcome and first-pass verification rate before and after.

## How Mission Control prevents it

`factoryContextPackages` carries an explicit `budget` and an `items[]` list produced by a retrieval plan (`factoryRetrievalPlans`, `convex/schema.ts:6433-6678`; planner in `packages/memory/src/factory/planner.ts`, Experimental — Factory Memory phases default off). The Factory Memory architecture separates ingestion, retrieval, graph, and context assembly so that assembly is a ranked, budgeted step rather than a dump (`docs/architecture/factory-memory-context-intelligence.md`). Repository code scopes (`repositoryCodeScopes`) and Work Order `dataBoundaries[]` bound what may be retrieved (Available). Governed MCP responses are capped by `maxResponseBytes` per tool version (Experimental).

Limitation: Mission Control does not prevent a harness adapter from reading arbitrarily many files inside its worktree; the budget applies to the assembled package and governed tool outputs, not to the adapter's own file reads. Token attribution for cost is `UNKNOWN` in the retained evidence, so Mission Control cannot yet report tokens per accepted outcome.

## Detection

- Context Package `budget` at or near the model limit for small Work Orders.
- Items with no retrieval reason, or items outside the Work Order's data boundaries.
- Input-token share of Attempt cost above a threshold (set per factory; illustrative: > 80%).
- Verification failures on details present in the context but ignored (compare package items to the missed file).
- Producer and verifier packages with identical content hashes.

## Related

- Fixing patterns: [context-package](/patterns/context-package) · [model-routing](/patterns/model-routing)
- Sibling anti-patterns: [invisible-context](/anti-patterns/invisible-context) · [frontier-model-everywhere](/anti-patterns/frontier-model-everywhere) · [no-outcome-metrics](/anti-patterns/no-outcome-metrics)
- [Top 10 F07 Invisible or Poisoned Context](/anti-patterns/top-10) · [/architecture/context](/architecture/context) · [/architecture/economics](/architecture/economics)
