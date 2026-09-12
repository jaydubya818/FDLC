---
title: Agent-to-Agent Spaghetti
description: Agents and factories call each other directly, so authority flows sideways, nobody holds the objective, and the topology is unobservable and unrecoverable.
path: /anti-patterns/agent-to-agent-spaghetti
audience: [architect, platform, security, leader, factory-engineer]
level: [practitioner, architect, enterprise]
status: draft
related: [/anti-patterns, /patterns/multi-factory-orchestration, /patterns/objective-decomposition, /patterns/capability-based-routing, /patterns/bounded-agent, /anti-patterns/the-mega-agent, /anti-patterns/agent-has-production-credentials, /architecture/multi-factory]
diagrams: [D09]
mc_refs: [convex/schema.ts, packages/workflow-engine/src/harnessManifests.ts, convex/factory/attempts.ts, docs/software-factory/governed-missions-contract.md]
---

# Agent-to-Agent Spaghetti

**Also known as:** Peer-to-peer orchestration · Factories calling factories · The agent mesh

**Severity:** Critical

## Symptoms

- Agent A's tool list includes "call agent B"; B's includes "call agent C"; C occasionally calls A.
- The code-generation factory has a "dispatch to security factory" step.
- To answer "what is outstanding for this objective" someone traces messages across services.
- A failure in one agent leaves others waiting on messages that will never arrive.
- Credentials for downstream systems are distributed to whichever agent might call them.

## Why it fails

Authority flows down from the control plane and evidence flows back. Lateral calls break both directions: the caller acquires authority over the callee's work (it decides what the callee does and consumes its output as if verified), and evidence never reaches a system of record because it passes agent-to-agent. The objective — the thing all this work serves — is held by no one; it is implicit in the call graph. Recovery is impossible because no component knows the whole graph. Security collapses to the union of every agent's credentials, reachable from any compromised node. Canon: "The control plane orchestrates the objective. Factories execute bounded work. Factories do not orchestrate one another."

Scenario: the migration factory finishes a candidate and calls the security factory's API with its own service token to "scan this branch". The security factory returns "clean". The migration factory records that as verification and calls the release factory. The security factory's scanner was misconfigured for the repository type and always returns clean. No control-plane record exists for the scan, so the acceptance step sees only the migration factory's claim that security passed.

## How it shows up in the wild

- Multi-agent frameworks where agents are tools of other agents by default.
- Microservice-style "agent meshes" with agent-to-agent protocols and no central work graph.
- Workflow steps that invoke another team's pipeline via webhook and treat the HTTP 200 as approval.
- "Manager agent" designs where the manager both delegates and executes.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No Objective record, no Work Graph, no Routing Decisions; approvals cannot bind to a topology |
| Security | Lateral credential flow; one compromised agent reaches all; no tenancy boundary |
| Cost | Duplicate work; cascading retries; unattributable spend |
| Reliability | Deadlocks, orphaned waits, cascading failures; no recovery point |

## The fix

Patterns: [multi-factory-orchestration](/patterns/multi-factory-orchestration), [objective-decomposition](/patterns/objective-decomposition), [capability-based-routing](/patterns/capability-based-routing), [bounded-agent](/patterns/bounded-agent).

Minimal migration:

1. Remove "call agent/factory" from every tool manifest; factories receive Work Orders and return candidates and evidence to the control plane only.
2. Put the Objective and its Work Graph in the control plane; make dependencies explicit edges.
3. Route each Work Order to a factory by capability and qualification; record the Routing Decision.
4. Verify integration at the Objective level with an independent verifier; accept at the control plane.
5. Issue credentials per Factory Version per Work Order; revoke lateral service tokens.

## How Mission Control prevents it

Dispatch, verification, publication, and acceptance are control-plane mutations; harness manifests declare `PROHIBITED_AUTHORITIES` including verification subjects, evidence authority, publication, and acceptance, and `REQUIRED_EXTERNAL_CONTROLS` including `independent-verification` and `publication-permit` (`packages/workflow-engine/src/harnessManifests.ts:62-77`, Available). The producer factory does not invoke the verifier factory; the control plane selects a verification-purpose Factory Version and creates the Verifier Attempt (`convex/factory/attempts.ts`, Available). "Public clients cannot claim `SYSTEM` or `AGENT` authority to dispatch work" (`docs/OVERVIEW.md`). Missions hold the objective and its Work Orders (`missions`, `missionPlans`, `workOrders`); "Task completion does not accept a WorkOrder, and WorkOrder completion does not accept a Mission" (`docs/software-factory/governed-missions-contract.md`).

Limitation: Mission Control's orchestration is two-factory (producer and verifier) within one repository. The multi-factory ecosystem — Factory Registry, Objective Planner, Level 1 routing, integration verification — is Planned, so Mission Control prevents lateral calls by construction but does not yet demonstrate the full alternative.

## Detection

- Tool manifests or agent definitions listing other agents or factories as callable operations.
- Service-to-service calls between factory runtimes not mediated by a control-plane Work Order.
- Evidence records whose producer is another factory but which have no Verifier Attempt in the control plane.
- Objectives with no Work Graph record; dependency knowledge living in code paths.
- Credentials for one factory's destinations present in another factory's environment.

## Related

- Fixing patterns: [multi-factory-orchestration](/patterns/multi-factory-orchestration) · [objective-decomposition](/patterns/objective-decomposition) · [capability-based-routing](/patterns/capability-based-routing)
- Sibling anti-patterns: [the-mega-agent](/anti-patterns/the-mega-agent) · [agent-has-production-credentials](/anti-patterns/agent-has-production-credentials) · [agent-as-authorization-system](/anti-patterns/agent-as-authorization-system)
- [Top 10 F09 Peer-to-Peer Agent Coordination](/anti-patterns/top-10) · [/architecture/multi-factory](/architecture/multi-factory) · Glossary: Orchestrator, Factory Ecosystem
