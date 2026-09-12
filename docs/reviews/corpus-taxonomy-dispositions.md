# Corpus taxonomy disposition register

**Status:** Generated review evidence; not canon
**Entries:** 73

This register replaces the unsupported assumption that every coined name is a new qualified pattern. Candidate means only that distinct supporting context was found. Alias and specification-artifact entries should be repointed before canonical promotion. Needs-evidence entries have no supporting context beyond the backlink that created the proposed index.

## Summary

- **alias:** 9
- **candidate:** 53
- **needs-evidence:** 10
- **specification-artifact:** 1

## Dispositions

### /patterns/admission-before-scheduling {#admission-before-scheduling}

- **Type:** pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/enterprise/execution-fleet.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### Allocation journal and reconciler {#allocation-journal}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/sandboxing.md`
- **Supporting context:** Orphan risk — Low — Real; requires allocation journal and reconciler —

### Asymmetric autonomy by action class {#asymmetric-autonomy}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/learning.md`
- **Supporting context:** Promotion creates a new immutable Factory Version through Qualify and a Decision of kind promotion; it never edits historical runs. After promotion: bounded canary, observation window, automatic stop on risk. Autonomy is asymmetric by action class:

### Attention budget {#attention-budget}

- **Type:** pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/architecture/transformation.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### /patterns/authorization-ratchet {#authorization-ratchet}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/identity-tenancy.md`
- **Supporting context:** Logical (row-scoped) isolation for non-regulated tenants — One cell, cheap cross-BU Objectives — Authorization code is the boundary; it must be ratcheted and tested continuously —

### Budget-aware escalation {#budget-aware-escalation}

- **Type:** pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/architecture/economics.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### Builder entry points {#builder-entry-points}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/transformation.md`
- **Supporting context:** Developer Experience — The Builder's entry points, decision packets, adoption, escape hatches —

### Command / ack / effect {#command-ack-effect}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/operations.md`
- **Supporting context:** Command / ack / effect — factoryIncidentControlReceipts: COMMANDREQUESTED, COMMANDISSUED, ACKNOWLEDGED, EFFECTOBSERVED, DISPATCHDENIED; only the independent observer (incidentControlObserver.ts) may write EFFECTOBSERVED; validateFactoryIncidentTransition requires every declared containment action to have a control execution before CONTAIN — Production-qualified (PAUSEREPOSITORYDISPATCH) —

### Completion record {#completion-record}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/observability.md`
- **Supporting context:** Builders — Where their Work Order is; what decision is required of them; the completion record (what changed → why → by whom → with what → verified how → evidenced by what) — Raw agent activity feeds —

### Context firewall {#context-firewall}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/context.md`
- **Supporting context:** The producer's reasoning, when the agent is a verifier — Context firewall: a plausible explanation must not substitute for a correct result —

### /patterns/contribution-model {#contribution-model}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/organization.md`
- **Supporting context:** Mission Control's permission vocabulary (company.manage, members.manage, delivery.dispatch—verify—approve, factory.read—improve—approve—automation.manage) and its human/service authorization matrix (docs/security/human-service-authorization-matrix.md) map to Builder, Factory Owner, Verification Engineer, and administrator roles; status Available. Its capability ledger names owning functions per capability (Platform, Security, ML/AI, Product, SRE, QA) and states that "no contribution model, forward-deployed function, or three-clock release process exists around it." Permission bundles per platform-team role, separation of duties across bodies, and the cadences above are FDLC requirements not implemented in either repository.

### Correlation spine {#correlation-spine}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/observability.md`
- **Supporting context:** The observability standard governs the fourth row and the correlation spine that lets all four be joined. A trace showing status=success cannot accept a Work Order. It is diagnostic only; it carries no acceptance authority.

### Decision packet {#decision-packet}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/transformation.md`
- **Supporting context:** This is the Delivery Loop (/framework/delivery-loop) seen from the Builder's chair. What the Builder writes is the Intent and the acceptance criteria; what the Builder decides is the consequential Decision; what the Builder reads is a decision packet with evidence, not a transcript.

### Declared cohort {#declared-cohort}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/economics.md`
- **Supporting context:** subgraph Inputs["Attributed cost (declared cohort, declared window)"]

### Declared degraded mode {#declared-degraded-mode}

- **Type:** pattern
- **Disposition:** alias → `/patterns/degraded-mode`
- **Source:** `corpus/architecture/operations.md`
- **Supporting context:** 03 — Operate a declared degraded mode — Which work may continue when assurance or capacity is reduced? — Predefine fail-closed, queue, read-only, qualified-fallback, and shutdown behavior for identity, policy, context, model, tool, evidence, telemetry, capacity, and control-state failures. — Availability cannot weaken the workload's authority, data, quality, or evidence requirements silently. —

### /patterns/embedded-engineering-loop {#embedded-engineering-loop}

- **Type:** pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/enterprise/organization.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### /patterns/exception-decision {#exception-decision}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/policy-governance.md`
- **Supporting context:** — Risk mitigation (CC9) — Risk tiers, autonomy ceilings, exception process — Risk assignments, exception Decisions —

### /patterns/execution-profile {#execution-profile}

- **Type:** pattern
- **Disposition:** specification-artifact → `/specification/v1/execution-profile`
- **Source:** `corpus/enterprise/enterprise.md`
- **Supporting context:** Repository scale — Repository intelligence, ownership, policy, language, toolchain, and Execution Profiles —

### /patterns/fenced-lease {#fenced-lease}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/execution-fleet.md`
- **Supporting context:** Fenced leases, dispositions, ownership manifest, conservative cleanup — docs/decisions/worker-runtime-leases-recovery.md, docs/software-factory/worker-runtime-operations.md — Qualified (single worker); fleet-scale restart not claimed —

### Forensic bundle {#forensic-bundle}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/observability.md`
- **Supporting context:** description: What a factory must trace, the Objective → Work Order → Attempt span model, OpenTelemetry alignment, reconstruction after restart, forensic bundles, and why telemetry never decides.

### Frozen Context Package {#frozen-context-package}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/context.md`
- **Supporting context:** The context layer is a shared enterprise service with four stages: Context Retrieval → Context Assembly → Context Policy → Agent Reasoning. Its output is a Context Package: the frozen, digested, authorized set of context supplied to one Attempt, with provenance and freshness recorded.

### /patterns/gravity-well-adoption {#gravity-well-adoption}

- **Type:** pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/enterprise/adoption.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### /patterns/lighthouse-factory {#lighthouse-factory}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/adoption.md`
- **Supporting context:** S["Scope<br/>one workflow · baseline · stop conditions"] --> P["Prove<br/>lighthouse factory · independent verification · human release authority"]

### Lockfile-pinned skills {#lockfile-pinned-skills}

- **Type:** pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/architecture/context.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### /patterns/logical-model-route {#logical-model-route}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/model-gateway.md`
- **Supporting context:** description: Logical model routes, provider abstraction, route qualification per workload class, quotas, prequalified fallbacks, residency constraints, telemetry, catalog governance, inference accounting, and outage handling at fleet scale.

### /patterns/objective-planner {#objective-planner}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/enterprise.md`
- **Supporting context:** EC --> OP["Objective Planner"]

### /patterns/policy-bundle {#policy-bundle}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/policy-governance.md`
- **Supporting context:** A policy bundle is a content-addressed set of rules for one or more domains, owned by a Policy Owner, signed, and versioned. Bundles attach at hierarchy nodes and compose by narrowing. A Factory Version MUST record the digest of every bundle it was qualified under; a bundle change MUST NOT alter the behavior of an Active Factory Version in place. Instead:

### /patterns/prequalified-fallback {#prequalified-fallback}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/model-gateway.md`
- **Supporting context:** description: Logical model routes, provider abstraction, route qualification per workload class, quotas, prequalified fallbacks, residency constraints, telemetry, catalog governance, inference accounting, and outage handling at fleet scale.

### Proposal-only loop {#proposal-only-loop}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/learning.md`
- **Supporting context:** FDLC requires a proposal-only learning loop with deterministic signals, evaluation datasets with negative controls, and promotion through Qualify. Mission Control implements this through:

### Publication broker {#publication-broker}

- **Type:** pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/architecture/security.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### Regression case from failure {#regression-case-from-failure}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/learning.md`
- **Supporting context:** Regression cases from failures — Every escaped defect or recurring correction becomes a case (EVALSCENARIO) with the PR lineage that fixed it — Re-derived when that code changes —

### /patterns/reserved-containment-capacity {#reserved-containment-capacity}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/execution-fleet.md`
- **Supporting context:** Fleet stop — All admission stops; reserved capacity keeps containment and verification running — Platform lead + Security lead (two humans) —

### Saga with compensation {#saga-compensation}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/operations.md`
- **Supporting context:** 02 — Reconcile before repeating — What actually happened at every external boundary? — Classify each effect as absent, completed, failed, or unknown. Retry only with current authority and an idempotency or reconciliation contract; model multi-system work as a saga with explicit compensation. — Unknown outcomes never become implicit failures, successes, or permission to retry. —

### Six-proof cleanup {#six-proof-cleanup}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/sandboxing.md`
- **Supporting context:** Persistent-worker isolation — Attempt-specific worktree, ownership manifest under .mission-control/worker-state outside the agent-writable tree, explicit environment allowlist for the agent child (no service, Convex, GitHub App, or provider secrets), six-proof cleanup (worker-runtime-operations.md) — Available (Codex production path) —

### Skill install policy {#skill-install-policy}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/security.md`
- **Supporting context:** Supply-chain compromise — Digest binding; verified provenance; SBOM policy; skill install policy — Failed verification at consumption —

### /patterns/sponsor-chain {#sponsor-chain}

- **Type:** pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/identity-tenancy.md`
- **Supporting context:** Delegation and sponsor chains

### Tool Version → Grant → receipt {#tool-grant-receipt}

- **Type:** pattern
- **Disposition:** alias → `/patterns/tool-grant-and-receipt`
- **Source:** `corpus/architecture/security.md`
- **Supporting context:** Tool authority: Tool Version → Grant → receipt

### Activity mistaken for value {#activity-as-value}

- **Type:** anti-pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/architecture/economics.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### Ambient access {#ambient-access}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/sandboxing.md`
- **Supporting context:** The principle: autonomy should come with narrower execution boundaries, not broader ambient access. An agent can be intelligent without being trusted; the sandbox defines what intelligence is allowed to affect. Grants vary with the Work Order's risk class and policy, never with the model's track record.

### /anti-patterns/approval-everywhere {#approval-everywhere}

- **Type:** anti-pattern
- **Disposition:** alias → `/anti-patterns/human-approval-everywhere`
- **Source:** `corpus/enterprise/organization.md`
- **Supporting context:** Patterns: /patterns/embedded-engineering-loop · /patterns/contribution-model · Anti-patterns: /anti-patterns/permanent-consulting-layer · /anti-patterns/approval-everywhere

### Authorization inside the model {#authorization-inside-the-model}

- **Type:** anti-pattern
- **Disposition:** alias → `/anti-patterns/agent-as-authorization-system`
- **Source:** `corpus/architecture/security.md`
- **Supporting context:** Authorization inside the model — Nothing stops a disallowed tool call if the model makes one — Enforce identity, scope, and policy outside the model —

### Autonomy reported as automation {#autonomy-as-automation}

- **Type:** anti-pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/architecture/transformation.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### Availability over containment {#availability-over-containment}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/operations.md`
- **Supporting context:** Availability over containment — Factory keeps running while unable to prove authority, configuration, or evidence — Containment wins; hold release —

### /anti-patterns/big-bang-rollout {#big-bang-rollout}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/adoption.md`
- **Supporting context:** Big-bang rollout — Every team onboarded in one quarter; a fleet before a lighthouse — No promotion rule was ever met; the first visible mistake stops the program — One corridor, then evidence, then the next —

### Budget as a bill {#budget-as-a-bill}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/economics.md`
- **Supporting context:** Budget as a bill — Spend known only from the invoice; no run ever stopped — Enforce budgets in the harness with stop or escalate behavior —

### Confused deputy {#confused-deputy}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/security.md`
- **Supporting context:** Confused deputy — A broad-rights service acts for a caller who lacked them — Carry originating authority through delegation —

### Context edited in place {#context-edited-in-place}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/context.md`
- **Supporting context:** Context edited in place — A rule file changes with no version; forty repositories change at once — Immutable published versions; installs bind exact versions —

### Cost per token {#cost-per-token}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/economics.md`
- **Supporting context:** Design principle 10: Optimize for cost per accepted outcome, not tokens or generated volume. This page defines what a factory measures, the denominators it reports, and how economics feed routing, budgets, and learning without becoming a surveillance system or a marketing number.

### Done as the record {#done-as-the-record}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/observability.md`
- **Supporting context:** "Done" as the record — Status plus a model-written summary; reviewer reconstructs from the diff — Completion record filled from digests, receipts, and the routing trace —

### Evaluator overfitting {#evaluator-overfitting}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/learning.md`
- **Supporting context:** Evaluator overfitting — Dev-set gains, holdout flat or worse — Holdout protection; controlled search —

### /anti-patterns/factory-per-team {#factory-per-team}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/enterprise.md`
- **Supporting context:** Organizational scale and factory count are different dimensions. Scale increases capacity and concurrency; it does not require a factory per team or repository.

### /anti-patterns/fail-open {#fail-open}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/policy-governance.md`
- **Supporting context:** Fail-open on timeout — Work proceeds during a policy outage — Deny on error; reserved capacity; tested outage drill —

### False success {#false-success}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/operations.md`
- **Supporting context:** A worker that disappears three hours into a Work Order is the ordinary case. The right response reads persisted state and answers four questions: what completed, which side effects occurred, what the last safe checkpoint was, what can safely resume. Recovery never depends on the model's recollection. If resumption cannot be made safe, the work moves to a truthful blocked state with evidence preserved. A truthful blocked state is better than a false success.

### Faster typist {#faster-typist}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/transformation.md`
- **Supporting context:** Organizations that treat coding agents as faster typists automate the part of engineering that was never the bottleneck and hit the next one unprepared: review, then verification, then context quality, then intent definition, then factory engineering itself. Each of those was work that review and senior attention were silently doing. A team that measures only the stage it just automated is surprised by the next one. Naming the shift lets an organization staff, measure, and govern it instead of discovering it as a queue.

### Isolation by brochure {#isolation-by-brochure}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/sandboxing.md`
- **Supporting context:** Isolation by brochure — "Secure" with no test per dimension — Write the isolation model; rate providers against it —

### Jumping to training {#jumping-to-training}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/learning.md`
- **Supporting context:** Jumping to training — A rule-shaped problem fine-tuned — Climb the ladder; record why each rung was insufficient —

### Memory as instruction {#memory-as-instruction}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/context.md`
- **Supporting context:** Memory poisoning — An injected instruction persisted in Factory Memory, affecting every future run — Provenance on every write; quarantine reaches memory; retrieved memory wrapped as untrusted —

### /anti-patterns/peer-to-peer-factories {#peer-to-peer-factories}

- **Type:** anti-pattern
- **Disposition:** alias → `/anti-patterns/agent-to-agent-spaghetti`
- **Source:** `corpus/enterprise/enterprise.md`
- **Supporting context:** The governing principle: The control plane orchestrates the objective. Factories execute bounded work. Factories do not orchestrate one another. Peer-to-peer factory calls destroy governance (who authorized the second factory?), composability (which version was called?), observability (where is the trace root?), recovery (who owns the retry?), security (whose credentials crossed the boundary?), determinism (which Plan revision applies?), and auditability (which Decision covers the handoff?). See /architecture/multi-factory.

### /anti-patterns/permanent-consulting-layer {#permanent-consulting-layer}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/organization.md`
- **Supporting context:** Embedded engineers — Platform learns where abstractions break — Risk of a permanent consulting layer; count repeated integrations —

### /anti-patterns/policy-in-the-prompt {#policy-in-the-prompt}

- **Type:** anti-pattern
- **Disposition:** alias → `/anti-patterns/prompt-as-governance`
- **Source:** `corpus/enterprise/policy-governance.md`
- **Supporting context:** Policy in the prompt — Rule disappears on model upgrade — Move to an enforcement point; qualification checks the prompt carries no authority —

### /anti-patterns/producer-as-judge {#producer-as-judge}

- **Type:** anti-pattern
- **Disposition:** alias → `/anti-patterns/self-verifying-agent`
- **Source:** `corpus/enterprise/identity-tenancy.md`
- **Supporting context:** Rules: an agent MUST NOT hold a long-lived credential of its own; a workload identity MUST be bound to the Attempt id, lease id, Factory Version digest, and tenant; a verifier Attempt MUST run under a different workload identity from the producer Attempt it judges; a service identity MUST NOT be used as a substitute for a human decision.

### /anti-patterns/provider-as-identity {#provider-as-identity}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/model-gateway.md`
- **Supporting context:** At 1.3 million inference calls a day across four providers and four regions (illustrative), three things go wrong without a gateway. Cost becomes unattributable: teams discover what agents can do faster than finance discovers what it cost. Provider identity leaks into factory identity: a factory "is" a vendor's model, and the vendor's deprecation becomes the factory's outage. And substitution becomes silent: a router swaps in a cheaper or available model under load, and a qualified composition is no longer the one that ran. The gateway exists so that every call is attributable, every route is qualified, and every substitution is a recorded admission decision.

### /anti-patterns/retry-storm {#retry-storm}

- **Type:** anti-pattern
- **Disposition:** alias → `/anti-patterns/infinite-retry-loop`
- **Source:** `corpus/enterprise/execution-fleet.md`
- **Supporting context:** Autonomous workloads have unbounded appetite. One Objective can consume hundreds of inference calls, several sandboxes, thousands of tool requests, and a stack of retries. Without admission control, budgets, fairness, and backpressure, urgent work queues behind experiments, one tenant's burst starves another, provider rate limits cascade into retry storms, and the capacity needed to stop a runaway factory has already been consumed by it. A queue with implicit policy is an invisible governance system; the fleet makes that policy explicit.

### Review theater {#review-theater}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/transformation.md`
- **Supporting context:** Review theater — Human approval exists but the packet cannot support a decision — Decision packets with evidence, options, uncertainty, deadline —

### Sandbox with postage {#sandbox-with-postage}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/sandboxing.md`
- **Supporting context:** Sandbox with postage — The runtime can push and open PRs itself — Move credential minting outside; quarantine results —

### Self-authorized mutation {#self-authorized-mutation}

- **Type:** anti-pattern
- **Disposition:** needs-evidence
- **Source:** `corpus/architecture/learning.md`
- **Supporting context:** No supporting context was found outside the proposed-index backlink.

### /anti-patterns/shared-credentials {#shared-credentials}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/identity-tenancy.md`
- **Supporting context:** Identity volume grows with Attempts, not with Builders: at 15,000 Attempts a day the workload identity service issues 15,000 short-lived identities and the broker issues several times that many scoped credentials. Both are stateless services that scale horizontally; the constraint is the control plane's membership lookup on every protected call, which the Reference Enterprise caches per session with revocation on any membership change. Regulated tenants move to their own cell; the identity provider and the hierarchy stay shared. Federation with an external organization never shares identity: the intake boundary authenticates the external system as a service identity and the receiving control plane re-authorizes under its own records.

### Silent self-repair {#silent-self-repair}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/operations.md`
- **Supporting context:** Automated response — Speed — Bounded actions, cooldowns, human escalation; never silent self-repair —

### /anti-patterns/silent-substitution {#silent-substitution}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/execution-fleet.md`
- **Supporting context:** Silent substitutions (region, route, risk class) — Zero —

### Telemetry as evidence {#telemetry-as-evidence}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/observability.md`
- **Supporting context:** Limitations: no end-to-end OpenTelemetry export with cross-service trace context, no standardized GenAI span mapping, no cardinality or sampling policy, no lifecycle-wide linkage across CI and deployment, no cached/reasoning token attribution to outcomes, and no forensic-bundle contract are established by the studied evidence. Note: there is no convex/observability.ts; trace and observation logic lives in convex/observability.ts and convex/lib/observabilityPersistence.ts.

### The trusted skill {#the-trusted-skill}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/architecture/security.md`
- **Supporting context:** The trusted skill — A public skill carries an injection or exfiltration payload — Scan at install; install policy; execution controls that make a followed payload a wasted run —

### /anti-patterns/tool-first {#tool-first}

- **Type:** anti-pattern
- **Disposition:** candidate
- **Source:** `corpus/enterprise/adoption.md`
- **Supporting context:** Bring existing agents in as a gravity well, not a migration mandate: offer the model gateway first (one endpoint change; cost attribution and eligibility for everything that passes through), then common evaluation, then observability, then governed tools, then the runtime. At no point is a team told to rewrite.

### Whole-window stuffing {#whole-window-stuffing}

- **Type:** anti-pattern
- **Disposition:** alias → `/anti-patterns/context-dumping`
- **Source:** `corpus/architecture/context.md`
- **Supporting context:** Anti-patterns: Whole-window stuffing · Memory as instruction · Context edited in place
