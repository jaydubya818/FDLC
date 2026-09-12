---
title: Prompt as Governance
description: Policy, scope, and safety rules live in the system prompt, so the model is asked to enforce limits on itself and the factory's architecture is a paragraph of instructions.
path: /anti-patterns/prompt-as-governance
audience: [architect, platform, security, leader, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/decision-record, /patterns/verification-contract, /patterns/bounded-agent, /patterns/human-authority-gate, /anti-patterns/agent-as-authorization-system, /anti-patterns/mutable-production-factory, /framework/principles]
diagrams: [D08]
mc_refs: [convex/schema.ts, convex/lib/workOrderSpecificationValidators.ts, packages/workflow-engine/src/harnessManifests.ts]
---

# Prompt as Governance

**Also known as:** Prompt-as-Architecture · Rules in the system prompt · "We told it not to"

**Severity:** Critical

## Symptoms

- The security review of the factory consists of reading the system prompt.
- Constraints appear as prose: "Never modify files under `auth/`. Always run tests. Do not push to main. Ask before deleting."
- The same rules are copied across agents with slight variations.
- Incidents are fixed by adding a sentence.
- The factory's "architecture diagram" is a list of prompt sections.

## Why it fails

A prompt is an input to a probabilistic function. It shapes behavior; it does not bound it. Instructions compete with other instructions (including injected ones), decay over long contexts, and are interpreted differently by each model version. A control is something the agent cannot violate even when it tries: a tool grant that does not exist, a path the sandbox cannot write, a verifier the agent cannot influence, a Decision it cannot record. "Factories are governed systems, not giant prompts" is design principle 8 for this reason.

Scenario: the prompt says "never modify `package.json#scripts`". The agent, blocked by a failing test, reasons that adjusting the test script is "configuration, not scripts" and edits it. Nothing stopped it: the file was writable, the verifier ran the candidate's script, and the acceptance step read "tests pass". The rule existed only as text.

## How it shows up in the wild

- Agent products whose "guardrails" tab is a prompt editor.
- Enterprise deployments where compliance requirements were "added to the system prompt".
- Multi-agent frameworks whose role separation is persona text in a shared process.
- "Constitutions" and "AGENTS.md" files treated as enforcement rather than guidance.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No enforceable policy object; no Decision records; audits read prose |
| Security | Prompt injection defeats every rule at once; model upgrades silently change enforcement |
| Cost | Longer prompts every incident; rules consume context budget |
| Reliability | Non-deterministic compliance; the same rule holds on Monday and fails on Tuesday |

## The fix

Patterns: [decision-record](/patterns/decision-record), [verification-contract](/patterns/verification-contract), [bounded-agent](/patterns/bounded-agent), [human-authority-gate](/patterns/human-authority-gate).

Minimal migration:

1. Extract every MUST/NEVER from the prompts into a table.
2. For each rule, choose an enforcement mechanism outside the model: filesystem/sandbox policy (cannot write), tool grants (cannot call), negative constraints checked by an independent verifier on the diff (cannot pass), server-side permissions (cannot decide), budgets enforced by the runtime (cannot spend).
3. Keep guidance in prompts (style, approach), but version prompts inside the Factory Version so guidance is attributable.
4. Make the verifier, not the producer, the actor that checks the rules.
5. Record enforcement outcomes as evidence so audits read records, not prose.

## How Mission Control prevents it

Mission Control's governance objects are typed records, not prompt text: `workOrders.negativeConstraints[]` with typed values (`PROTECTED_PATH`, `NO_AUTH_CHANGES`, `NO_PRODUCTION_ACCESS`, `NO_PLAINTEXT_SECRETS`, `NO_PUBLIC_API_CHANGES`, `NO_SCHEMA_CHANGES`, `NO_NEW_DEPENDENCIES`, `NO_TEST_REMOVAL`, `NO_ASSERTION_WEAKENING`, `NO_VERIFICATION_CONFIG_CHANGES`, `CUSTOM`), `changeBudget`, `dataBoundaries[]`, and a `verificationContract` with an `authorityPolicy` naming the files that determine the verdict (`convex/schema.ts:2422`; validators in `convex/lib/workOrderSpecificationValidators.ts`, Available). The harness manifest declares `PROHIBITED_AUTHORITIES` and `REQUIRED_EXTERNAL_CONTROLS` as data (`packages/workflow-engine/src/harnessManifests.ts:62-77`, Available). Sandbox profiles bound egress, ingress, and credentials structurally (Experimental). Acceptance and publication are server mutations with named permissions. "Command policy is privilege escalation, not blanket confirmation" (`docs/software-factory/verification-first-workorder-contract.md`).

Limitation: Mission Control still carries legacy persona YAML with `system_prompt` and `allowed_tools` fields (`agents/*.yaml`); in the governed Factory layer these are hashed into the agent genome but the prompt content itself remains guidance, as FDLC intends.

## Detection

- Rules present in prompts with no corresponding negative constraint, grant, sandbox policy, or permission.
- Incident postmortems whose remediation is a prompt edit.
- Verification contracts in `OBSERVE_ONLY` mode while prompts claim enforcement.
- Diffs violating a prompt rule that were accepted anyway.
- Prompt length growing over time with rule-shaped sentences.

## Related

- Fixing patterns: [decision-record](/patterns/decision-record) · [verification-contract](/patterns/verification-contract) · [bounded-agent](/patterns/bounded-agent)
- Sibling anti-patterns: [agent-as-authorization-system](/anti-patterns/agent-as-authorization-system) · [mutable-production-factory](/anti-patterns/mutable-production-factory) · [self-verifying-agent](/anti-patterns/self-verifying-agent)
- [Top 10 F02 Self-Certified Work](/anti-patterns/top-10) · [/framework/principles](/framework/principles) (design principle 8) · [/architecture](/architecture) (control boundary)
