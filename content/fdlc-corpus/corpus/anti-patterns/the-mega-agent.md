---
title: The Mega-Agent
description: One giant agent plans, implements, tests, reviews, and ships, so nothing is bounded, independent, attributable, or recoverable.
path: /anti-patterns/the-mega-agent
audience: [architect, platform, builder, leader, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/bounded-agent, /patterns/objective-decomposition, /patterns/independent-verifier, /patterns/multi-factory-orchestration, /anti-patterns/agent-to-agent-spaghetti, /anti-patterns/self-verifying-agent, /architecture/agents-skills-tools-harnesses]
diagrams: [D19]
mc_refs: [convex/schema.ts, packages/workflow-engine/src/harnessManifests.ts, convex/lib/workOrderDispatch.ts]
---

# The Mega-Agent

**Also known as:** One Giant Agent · The Universal Agent · "Just give it the whole ticket"

**Severity:** Critical

## Symptoms

- One agent session receives the objective, decides scope, edits the repository, writes and runs tests, reviews its own diff, opens the PR, and sometimes merges.
- The "workflow" is a single prompt with numbered phases.
- Tool access is the union of everything any phase might need.
- No record distinguishes the planning decision from the implementation from the verification; they are turns in one transcript.
- When it fails, the fix is a longer prompt.

## Why it fails

A factory's guarantees come from separation: the actor that produced a change is not the sole authority that certifies it; execution completion is not verification; verification is not acceptance. A mega-agent collapses all of them into one reasoning loop with one set of assumptions and one credential set.

Scenario: the agent is told to upgrade a payments SDK. It misreads the migration guide and believes a compatibility shim is required. It writes the shim, writes tests that assert the shim works, runs them (green), reviews the diff ("looks correct, shim preserves behavior"), and opens the PR. Every phase inherited the same wrong belief, and every phase reported success. The correlated error passed because there was no second process with a different standard. Meanwhile, the agent's tool set included a deploy command it needed for a different phase, and a prompt injection in a dependency README used it.

## How it shows up in the wild

- "Autonomous engineer" products that run a single long session from issue to PR, with self-review as the quality step.
- Internal pipelines where one system prompt contains sections titled Plan, Implement, Test, Review.
- Multi-agent frameworks configured with one "orchestrator" persona that also does the work.
- Long-running agent harnesses that carry a progress file across sessions but never hand off to a different actor.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No Plan artifact, no Work Order scope, no Decision record; approvals, if any, approve a transcript |
| Security | Union of all permissions in one process; prompt injection anywhere reaches everything |
| Cost | The frontier model does transformation work; retries re-run the whole session |
| Reliability | A crash loses everything; a restart cannot resume; no Attempt boundary to retry |

## The fix

Patterns: [bounded-agent](/patterns/bounded-agent), [objective-decomposition](/patterns/objective-decomposition), [independent-verifier](/patterns/independent-verifier), [multi-factory-orchestration](/patterns/multi-factory-orchestration) when roles belong to different factories.

Minimal migration:

1. Split the transcript's phases into artifacts: Intent → Specification → Plan (approved revision) → Work Orders.
2. Give each Work Order one bounded agent with its own Agent Definition, tool grants, change budget, and stop condition.
3. Move verification to a separate Verifier Attempt with its own lease, worktree, and model route.
4. Make acceptance and publication control-plane actions the agent cannot call.
5. Keep the phases' prompts, but version them inside a Factory Version so the split is attributable.

## How Mission Control prevents it

Mission Control's workflow model separates roles as distinct agents (`workflows` table with steps of kind `AGENT|REDUCE|ROUTER|VERIFY|GATE|DETERMINISTIC`; the `feature-dev` workflow has planner, developer, verifier, tester, pr-creator, reviewer roles — `convex/schema.ts:5147`, Available). Each Attempt binds one purpose (`attemptPurpose: IMPLEMENTATION|VERIFICATION|AUTOMATION`), and the harness manifest declares `PROHIBITED_AUTHORITIES` including verification subjects, evidence authority, publication, and acceptance (`packages/workflow-engine/src/harnessManifests.ts:62-77`, Available). One active mutating Attempt per repository is enforced at dispatch (`convex/lib/workOrderDispatch.ts`, Available). A single agent therefore cannot hold the whole loop; the control plane does.

Limitation: Mission Control does not prevent an operator from authoring a workflow with one agent step and a permissive verification contract in `OBSERVE_ONLY` mode; the guard is the enforced contract and the independence check, which only apply when policy-v2 is `ENFORCED`.

## Detection

- One Attempt whose trace spans planning, implementation, and verification phases with no change of lease, worktree, or invocation.
- Verification evidence whose producer identity equals the candidate's producer identity.
- Tool grants on a single Execution Profile that include both read-repository and publish/deploy operations.
- Absence of a Plan revision and Work Order records for work that reached a PR.
- Independence result reasons: "Implementation/automation and verification use the same Attempt."

## Related

- Fixing patterns: [bounded-agent](/patterns/bounded-agent) · [objective-decomposition](/patterns/objective-decomposition) · [independent-verifier](/patterns/independent-verifier)
- Sibling anti-patterns: [self-verifying-agent](/anti-patterns/self-verifying-agent) · [agent-to-agent-spaghetti](/anti-patterns/agent-to-agent-spaghetti) · [unlimited-tool-access](/anti-patterns/unlimited-tool-access)
- [Top 10 F01 Unbounded Agent Authority](/anti-patterns/top-10) · [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) · Glossary: Coding Agent, Factory
