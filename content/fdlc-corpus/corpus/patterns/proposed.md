---
title: Proposed Patterns (Unwritten)
description: Named patterns identified during corpus authoring; catalogued here pending full write-ups in the patterns library.
path: /patterns/proposed
audience: [architect, platform, factory-engineer]
level: practitioner
status: draft
related: [/patterns, /anti-patterns]
diagrams: []
mc_refs: []
---

# Proposed Patterns (Unwritten)

While authoring the [pattern library](/patterns) and [anti-pattern library](/anti-patterns), contributors named additional patterns in passing — inside enterprise, architecture, and economics pages — that were never given full write-ups. This page is the honest record of that gap: every name below is real (it was coined to describe something the authors of those pages actually observed) but does not yet have a page following the canon page template.

**Status: proposed.** These are candidates for the next authoring wave, not part of the qualified patterns library. Do not cite them as canon; cite the linking page's own text instead, which carries the actual claim.

## Proposed pattern register

| Name | Named in | One-line description (from context) |
|---|---|---|
| [/patterns/admission-before-scheduling](#admission-before-scheduling) | `enterprise/execution-fleet.md` | /patterns/admission-before-scheduling |
| [Allocation journal and reconciler](#allocation-journal) | `architecture/sandboxing.md` | Allocation journal and reconciler |
| [Asymmetric autonomy by action class](#asymmetric-autonomy) | `architecture/learning.md` | Asymmetric autonomy by action class |
| [Attention budget](#attention-budget) | `architecture/transformation.md` | Attention budget |
| [/patterns/authorization-ratchet](#authorization-ratchet) | `enterprise/identity-tenancy.md` | /patterns/authorization-ratchet |
| [Budget-aware escalation](#budget-aware-escalation) | `architecture/economics.md` | Budget-aware escalation |
| [Builder entry points](#builder-entry-points) | `architecture/transformation.md` | Builder entry points |
| [Command / ack / effect](#command-ack-effect) | `architecture/operations.md` | Command / ack / effect |
| [Completion record](#completion-record) | `architecture/observability.md` | Completion record |
| [Context firewall](#context-firewall) | `architecture/context.md` | Context firewall |
| [/patterns/contribution-model](#contribution-model) | `enterprise/organization.md` | /patterns/contribution-model |
| [Correlation spine](#correlation-spine) | `architecture/observability.md` | Correlation spine |
| [Decision packet](#decision-packet) | `architecture/transformation.md` | Decision packet |
| [Declared cohort](#declared-cohort) | `architecture/economics.md` | Declared cohort |
| [Declared degraded mode](#declared-degraded-mode) | `architecture/operations.md` | Declared degraded mode |
| [/patterns/embedded-engineering-loop](#embedded-engineering-loop) | `enterprise/organization.md` | /patterns/embedded-engineering-loop |
| [/patterns/exception-decision](#exception-decision) | `enterprise/policy-governance.md` | /patterns/exception-decision |
| [/patterns/execution-profile](#execution-profile) | `enterprise/enterprise.md` | /patterns/execution-profile |
| [/patterns/fenced-lease](#fenced-lease) | `enterprise/execution-fleet.md` | /patterns/fenced-lease |
| [Forensic bundle](#forensic-bundle) | `architecture/observability.md` | Forensic bundle |
| [Frozen Context Package](#frozen-context-package) | `architecture/context.md` | Frozen Context Package |
| [/patterns/gravity-well-adoption](#gravity-well-adoption) | `enterprise/adoption.md` | /patterns/gravity-well-adoption |
| [/patterns/lighthouse-factory](#lighthouse-factory) | `enterprise/adoption.md` | /patterns/lighthouse-factory |
| [Lockfile-pinned skills](#lockfile-pinned-skills) | `architecture/context.md` | Lockfile-pinned skills |
| [/patterns/logical-model-route](#logical-model-route) | `enterprise/model-gateway.md` | /patterns/logical-model-route |
| [/patterns/objective-planner](#objective-planner) | `enterprise/enterprise.md` | /patterns/objective-planner |
| [/patterns/policy-bundle](#policy-bundle) | `enterprise/policy-governance.md` | /patterns/policy-bundle |
| [/patterns/prequalified-fallback](#prequalified-fallback) | `enterprise/model-gateway.md` | /patterns/prequalified-fallback |
| [Proposal-only loop](#proposal-only-loop) | `architecture/learning.md` | Proposal-only loop |
| [Publication broker](#publication-broker) | `architecture/security.md` | Publication broker |
| [Regression case from failure](#regression-case-from-failure) | `architecture/learning.md` | Regression case from failure |
| [/patterns/reserved-containment-capacity](#reserved-containment-capacity) | `enterprise/execution-fleet.md` | /patterns/reserved-containment-capacity |
| [Saga with compensation](#saga-compensation) | `architecture/operations.md` | Saga with compensation |
| [Six-proof cleanup](#six-proof-cleanup) | `architecture/sandboxing.md` | Six-proof cleanup |
| [Skill install policy](#skill-install-policy) | `architecture/security.md` | Skill install policy |
| [/patterns/sponsor-chain](#sponsor-chain) | `enterprise/identity-tenancy.md` | /patterns/sponsor-chain |
| [Tool Version → Grant → receipt](#tool-grant-receipt) | `architecture/security.md` | Tool Version → Grant → receipt |

## Entries

### /patterns/admission-before-scheduling {#admission-before-scheduling}

Referenced from `enterprise/execution-fleet.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Allocation journal and reconciler {#allocation-journal}

Referenced from `architecture/sandboxing.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Asymmetric autonomy by action class {#asymmetric-autonomy}

Referenced from `architecture/learning.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Attention budget {#attention-budget}

Referenced from `architecture/transformation.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/authorization-ratchet {#authorization-ratchet}

Referenced from `enterprise/identity-tenancy.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Budget-aware escalation {#budget-aware-escalation}

Referenced from `architecture/economics.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Builder entry points {#builder-entry-points}

Referenced from `architecture/transformation.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Command / ack / effect {#command-ack-effect}

Referenced from `architecture/operations.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Completion record {#completion-record}

Referenced from `architecture/observability.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Context firewall {#context-firewall}

Referenced from `architecture/context.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/contribution-model {#contribution-model}

Referenced from `enterprise/organization.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Correlation spine {#correlation-spine}

Referenced from `architecture/observability.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Decision packet {#decision-packet}

Referenced from `architecture/transformation.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Declared cohort {#declared-cohort}

Referenced from `architecture/economics.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Declared degraded mode {#declared-degraded-mode}

Referenced from `architecture/operations.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/embedded-engineering-loop {#embedded-engineering-loop}

Referenced from `enterprise/organization.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/exception-decision {#exception-decision}

Referenced from `enterprise/policy-governance.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/execution-profile {#execution-profile}

Referenced from `enterprise/enterprise.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/fenced-lease {#fenced-lease}

Referenced from `enterprise/execution-fleet.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Forensic bundle {#forensic-bundle}

Referenced from `architecture/observability.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Frozen Context Package {#frozen-context-package}

Referenced from `architecture/context.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/gravity-well-adoption {#gravity-well-adoption}

Referenced from `enterprise/adoption.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/lighthouse-factory {#lighthouse-factory}

Referenced from `enterprise/adoption.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Lockfile-pinned skills {#lockfile-pinned-skills}

Referenced from `architecture/context.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/logical-model-route {#logical-model-route}

Referenced from `enterprise/model-gateway.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/objective-planner {#objective-planner}

Referenced from `enterprise/enterprise.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/policy-bundle {#policy-bundle}

Referenced from `enterprise/policy-governance.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/prequalified-fallback {#prequalified-fallback}

Referenced from `enterprise/model-gateway.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Proposal-only loop {#proposal-only-loop}

Referenced from `architecture/learning.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Publication broker {#publication-broker}

Referenced from `architecture/security.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Regression case from failure {#regression-case-from-failure}

Referenced from `architecture/learning.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/reserved-containment-capacity {#reserved-containment-capacity}

Referenced from `enterprise/execution-fleet.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Saga with compensation {#saga-compensation}

Referenced from `architecture/operations.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Six-proof cleanup {#six-proof-cleanup}

Referenced from `architecture/sandboxing.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Skill install policy {#skill-install-policy}

Referenced from `architecture/security.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### /patterns/sponsor-chain {#sponsor-chain}

Referenced from `enterprise/identity-tenancy.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

### Tool Version → Grant → receipt {#tool-grant-receipt}

Referenced from `architecture/security.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified pattern.

## Related

- [/patterns](/patterns)
- [/anti-patterns](/anti-patterns)
- [/specification/conformance](/specification/conformance)
