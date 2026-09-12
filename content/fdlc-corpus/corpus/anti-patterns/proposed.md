---
title: Proposed Anti-Patterns (Unwritten)
description: Named anti-patterns identified during corpus authoring; catalogued here pending full write-ups in the anti-patterns library.
path: /anti-patterns/proposed
audience: [architect, platform, factory-engineer]
level: practitioner
status: draft
related: [/patterns, /anti-patterns]
diagrams: []
mc_refs: []
---

# Proposed Anti-Patterns (Unwritten)

While authoring the [pattern library](/patterns) and [anti-pattern library](/anti-patterns), contributors named additional anti-patterns in passing — inside enterprise, architecture, and economics pages — that were never given full write-ups. This page is the honest record of that gap: every name below is real (it was coined to describe something the authors of those pages actually observed) but does not yet have a page following the canon page template.

**Status: proposed.** These are candidates for the next authoring wave, not part of the qualified anti-patterns library. Do not cite them as canon; cite the linking page's own text instead, which carries the actual claim.

## Proposed anti-pattern register

| Name | Named in | One-line description (from context) |
|---|---|---|
| [Activity mistaken for value](#activity-as-value) | `architecture/economics.md` | Activity mistaken for value |
| [Ambient access](#ambient-access) | `architecture/sandboxing.md` | Ambient access |
| [/anti-patterns/approval-everywhere](#approval-everywhere) | `enterprise/organization.md` | /anti-patterns/approval-everywhere |
| [Authorization inside the model](#authorization-inside-the-model) | `architecture/security.md` | Authorization inside the model |
| [Autonomy reported as automation](#autonomy-as-automation) | `architecture/transformation.md` | Autonomy reported as automation |
| [Availability over containment](#availability-over-containment) | `architecture/operations.md` | Availability over containment |
| [/anti-patterns/big-bang-rollout](#big-bang-rollout) | `enterprise/adoption.md` | /anti-patterns/big-bang-rollout |
| [Budget as a bill](#budget-as-a-bill) | `architecture/economics.md` | Budget as a bill |
| [Confused deputy](#confused-deputy) | `architecture/security.md` | Confused deputy |
| [Context edited in place](#context-edited-in-place) | `architecture/context.md` | Context edited in place |
| [Cost per token](#cost-per-token) | `architecture/economics.md` | Cost per token |
| [Done as the record](#done-as-the-record) | `architecture/observability.md` | Done as the record |
| [Evaluator overfitting](#evaluator-overfitting) | `architecture/learning.md` | Evaluator overfitting |
| [/anti-patterns/factory-per-team](#factory-per-team) | `enterprise/enterprise.md` | /anti-patterns/factory-per-team |
| [/anti-patterns/fail-open](#fail-open) | `enterprise/policy-governance.md` | /anti-patterns/fail-open |
| [False success](#false-success) | `architecture/operations.md` | False success |
| [Faster typist](#faster-typist) | `architecture/transformation.md` | Faster typist |
| [Isolation by brochure](#isolation-by-brochure) | `architecture/sandboxing.md` | Isolation by brochure |
| [Jumping to training](#jumping-to-training) | `architecture/learning.md` | Jumping to training |
| [Memory as instruction](#memory-as-instruction) | `architecture/context.md` | Memory as instruction |
| [/anti-patterns/peer-to-peer-factories](#peer-to-peer-factories) | `enterprise/enterprise.md` | /anti-patterns/peer-to-peer-factories |
| [/anti-patterns/permanent-consulting-layer](#permanent-consulting-layer) | `enterprise/organization.md` | /anti-patterns/permanent-consulting-layer |
| [/anti-patterns/policy-in-the-prompt](#policy-in-the-prompt) | `enterprise/policy-governance.md` | /anti-patterns/policy-in-the-prompt |
| [/anti-patterns/producer-as-judge](#producer-as-judge) | `enterprise/identity-tenancy.md` | /anti-patterns/producer-as-judge |
| [/anti-patterns/provider-as-identity](#provider-as-identity) | `enterprise/model-gateway.md` | /anti-patterns/provider-as-identity |
| [/anti-patterns/retry-storm](#retry-storm) | `enterprise/execution-fleet.md` | /anti-patterns/retry-storm |
| [Review theater](#review-theater) | `architecture/transformation.md` | Review theater |
| [Sandbox with postage](#sandbox-with-postage) | `architecture/sandboxing.md` | Sandbox with postage |
| [Self-authorized mutation](#self-authorized-mutation) | `architecture/learning.md` | Self-authorized mutation |
| [/anti-patterns/shared-credentials](#shared-credentials) | `enterprise/identity-tenancy.md` | /anti-patterns/shared-credentials |
| [Silent self-repair](#silent-self-repair) | `architecture/operations.md` | Silent self-repair |
| [/anti-patterns/silent-substitution](#silent-substitution) | `enterprise/execution-fleet.md` | /anti-patterns/silent-substitution |
| [Telemetry as evidence](#telemetry-as-evidence) | `architecture/observability.md` | Telemetry as evidence |
| [The trusted skill](#the-trusted-skill) | `architecture/security.md` | The trusted skill |
| [/anti-patterns/tool-first](#tool-first) | `enterprise/adoption.md` | /anti-patterns/tool-first |
| [Whole-window stuffing](#whole-window-stuffing) | `architecture/context.md` | Whole-window stuffing |

## Entries

### Activity mistaken for value {#activity-as-value}

Referenced from `architecture/economics.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Ambient access {#ambient-access}

Referenced from `architecture/sandboxing.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/approval-everywhere {#approval-everywhere}

Referenced from `enterprise/organization.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Authorization inside the model {#authorization-inside-the-model}

Referenced from `architecture/security.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Autonomy reported as automation {#autonomy-as-automation}

Referenced from `architecture/transformation.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Availability over containment {#availability-over-containment}

Referenced from `architecture/operations.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/big-bang-rollout {#big-bang-rollout}

Referenced from `enterprise/adoption.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Budget as a bill {#budget-as-a-bill}

Referenced from `architecture/economics.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Confused deputy {#confused-deputy}

Referenced from `architecture/security.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Context edited in place {#context-edited-in-place}

Referenced from `architecture/context.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Cost per token {#cost-per-token}

Referenced from `architecture/economics.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Done as the record {#done-as-the-record}

Referenced from `architecture/observability.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Evaluator overfitting {#evaluator-overfitting}

Referenced from `architecture/learning.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/factory-per-team {#factory-per-team}

Referenced from `enterprise/enterprise.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/fail-open {#fail-open}

Referenced from `enterprise/policy-governance.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### False success {#false-success}

Referenced from `architecture/operations.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Faster typist {#faster-typist}

Referenced from `architecture/transformation.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Isolation by brochure {#isolation-by-brochure}

Referenced from `architecture/sandboxing.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Jumping to training {#jumping-to-training}

Referenced from `architecture/learning.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Memory as instruction {#memory-as-instruction}

Referenced from `architecture/context.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/peer-to-peer-factories {#peer-to-peer-factories}

Referenced from `enterprise/enterprise.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/permanent-consulting-layer {#permanent-consulting-layer}

Referenced from `enterprise/organization.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/policy-in-the-prompt {#policy-in-the-prompt}

Referenced from `enterprise/policy-governance.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/producer-as-judge {#producer-as-judge}

Referenced from `enterprise/identity-tenancy.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/provider-as-identity {#provider-as-identity}

Referenced from `enterprise/model-gateway.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/retry-storm {#retry-storm}

Referenced from `enterprise/execution-fleet.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Review theater {#review-theater}

Referenced from `architecture/transformation.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Sandbox with postage {#sandbox-with-postage}

Referenced from `architecture/sandboxing.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Self-authorized mutation {#self-authorized-mutation}

Referenced from `architecture/learning.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/shared-credentials {#shared-credentials}

Referenced from `enterprise/identity-tenancy.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Silent self-repair {#silent-self-repair}

Referenced from `architecture/operations.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/silent-substitution {#silent-substitution}

Referenced from `enterprise/execution-fleet.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Telemetry as evidence {#telemetry-as-evidence}

Referenced from `architecture/observability.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### The trusted skill {#the-trusted-skill}

Referenced from `architecture/security.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### /anti-patterns/tool-first {#tool-first}

Referenced from `enterprise/adoption.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

### Whole-window stuffing {#whole-window-stuffing}

Referenced from `architecture/context.md`. Not yet authored to the canon page template (What is it · Why it matters · How it works · Components · Tradeoffs · Implementation · Governance · How you know it worked · What can go wrong · How it scales). Treat as a named observation, not a qualified anti-pattern.

## Related

- [/patterns](/patterns)
- [/anti-patterns](/anti-patterns)
- [/specification/conformance](/specification/conformance)
