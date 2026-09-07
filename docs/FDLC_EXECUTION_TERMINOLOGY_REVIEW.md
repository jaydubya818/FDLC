# FDLC execution terminology review

## Decision

FDLC uses **Harness** for the bounded operating environment around one Agent. It does not use Harness as a synonym for the Agent Loop, Work Graph, Orchestrator, Runtime, Sandbox, Control Plane, or entire Factory.

Most disagreement about “agent harness” is a boundary disagreement. Sources may mean the loop inside a worker, the operating environment around the worker, the workflow coordinating many workers, or the enterprise authority layer. FDLC assigns each concern a separate owner, lifecycle, immutable identity, qualification boundary, and failure question.

## Canonical responsibility map

| Term | Responsibility | Diagnostic question |
| --- | --- | --- |
| Model | Inference and reasoning supply | Was the reasoning route suitable and correct? |
| Agent | Goal-directed worker | Was the right worker definition selected? |
| Agent Loop | Iteration and stopping within one worker | Did it observe, adapt, and stop correctly? |
| Agent Harness | Bounded operating envelope | Were context, tools, state, permissions, budgets, and lifecycle controls correct? |
| Work Graph | Nodes and transitions across work | Was the topology correct? |
| Orchestrator | Durable graph coordination | Did the correct eligible node run next? |
| Runtime | Execution hosting and survival | Did execution start, persist, resume, and recover? |
| Sandbox | Isolation of effects | Did filesystem, process, network, credential, or resource containment fail? |
| Capability | Provider-independent operation | What stable operation was required? |
| Capability Implementation | Qualified realization of an operation | Which exact implementation, version, and grant ran? |
| Control Plane | Enterprise authority and governed state | Who authorized, revoked, approved, promoted, or released? |
| Factory | Outcome-producing system | Did the full system produce an accepted outcome? |

Harness Engineering improves the Agent operating envelope. Loop Engineering improves iteration and stopping. Graph Engineering improves workflow topology. Runtime Engineering improves execution survival. Control Plane Engineering improves authority, policy, audit, promotion, and emergency control.

## Mission Control enhancements

Mission Control should extend existing records rather than add a parallel control model.

1. **Typed immutable identities.** Record Model Profile, Agent Definition, Harness Version, Work Graph Version, Runtime Artifact, Sandbox Profile, Capability Implementation versions, Orchestrator policy, and Control Plane policy bundle separately in every Execution Profile and Attempt manifest.
2. **Boundary-aware admission.** Resolve and qualify each identity before dispatch. A qualified Model cannot compensate for an unqualified Harness adapter, Runtime, Sandbox, graph, or capability implementation.
3. **Boundary-aware run inspection.** Show the active composition, effective local controls, authority source, lifecycle state, and evidence lineage without forcing operators to infer them from events.
4. **Failure attribution.** Require incident and Attempt failure records to select the failed boundary, observed symptom, evidence, containment action, and owning team. Preserve “unknown” when evidence is insufficient.
5. **Enforcement provenance.** For every consequential control, record the authority source, decision, enforcement point, observed result, and revocation path. Local Harness enforcement never becomes policy authority.
6. **Work Graph registry and replay.** Version nodes, edges, gates, failure transitions, and terminal states. Bind each execution to the exact graph revision and support replay from durable checkpoints.
7. **Capability implementation registry.** Keep a stable capability ID above provider-specific tools, skills, models, and adapters. Qualification, permissions, evidence, and rollback attach to the exact implementation.
8. **Composition conformance.** Test replacements one boundary at a time. A Harness, Runtime, or Capability Implementation is substitutable only for the workload and policy scope its evidence covers.
9. **Control surfaces.** Add a composition panel to readiness, Attempt, evidence, incident, and Factory Version views. Surface missing identities, expired qualifications, scope mismatches, and drift as blocking findings.

## Acceptance criteria

- The site architecture and Guide use the same canonical definitions.
- “Inner harness,” “outer harness,” “meta-harness,” and “AI harness” appear only as clearly marked external aliases or ambiguity warnings.
- The Claude and Claude Code example distinguishes a Model from a Coding Harness without implying either is the Factory, Runtime, Orchestrator, or Control Plane.
- Harness enforcement and Control Plane authority are explicitly distinct.
- Runtime and Sandbox are explicitly distinct.
- Agent Loop and Work Graph are explicitly distinct.
- Capability and Capability Implementation are separately defined and illustrated.
- Factory, Factory Platform, and Factory Version have separate definitions and identities.
- Mission Control priorities identify the exact records, admission checks, views, and conformance evidence required.
