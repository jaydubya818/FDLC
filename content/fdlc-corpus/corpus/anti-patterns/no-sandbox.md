---
title: No Sandbox
description: Agents execute on developer machines, shared CI runners, or long-lived VMs with inherited credentials, network, and filesystem, so effects are unbounded and unprovable.
path: /anti-patterns/no-sandbox
audience: [architect, platform, security, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/sandbox-per-work-order, /patterns/bounded-agent, /patterns/tool-grant-and-receipt, /patterns/fail-closed-qualification, /anti-patterns/shared-mutable-workspace, /anti-patterns/agent-has-production-credentials, /architecture/sandboxing]
diagrams: [D25]
mc_refs: [convex/schema.ts, convex/factory/configuration.ts, docs/security/remote-sandbox-threat-model.md, docs/architecture/remote-sandbox-execution.md]
---

# No Sandbox

**Also known as:** Run it on my laptop · The agent VM · "The CI runner is isolated enough"

**Severity:** Critical

## Symptoms

- Agents execute with the host user's filesystem, environment variables, and network.
- Package installs, test suites, and arbitrary shell commands run with no egress control.
- The same host serves multiple repositories, tenants, or classification levels.
- There is no record that an execution environment existed, was torn down, or what it could reach.
- Isolation is asserted in a document, not enforced or attested per Attempt.

## Why it fails

Manifesto principle 4: execution must be isolated, observable, and recoverable. An agent runs untrusted code (dependencies, test suites, generated scripts) under the influence of untrusted text (repository content, tool output). Without a sandbox, the blast radius of a mistake or an injection is the host: its credentials, its other checkouts, its network position. Without per-Attempt allocation and teardown attestation, nothing proves the environment was clean before or gone after. Isolation is also a qualification dimension: a factory cannot be qualified for confidential repositories if its execution boundary cannot be proven.

Scenario: an agent installs the v4 SDK to run tests. A transitive dependency runs a postinstall script that reads `~/.aws/credentials` and the developer's SSH keys from the shared runner and exfiltrates them over an unrestricted network. The Attempt's tests pass. The verifier, running on the same runner, passes too. Nothing in the factory's records shows the outbound connection.

## How it shows up in the wild

- IDE and CLI agents given "full access" on a developer workstation for unattended runs.
- CI runners shared between human-authored jobs and agent jobs with workspace caching and broad secrets.
- Docker containers started with the host's environment and a bind-mounted home directory.
- "Isolated" cloud VMs that persist for weeks and accumulate credentials.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | Sandbox policy cannot be part of the Factory Version; qualification scope cannot include isolation |
| Security | Credential theft, lateral movement, cross-tenant exposure, supply-chain payload execution |
| Cost | Incident response; inability to run untrusted dependencies safely means manual gating |
| Reliability | State contamination across Attempts; unreproducible failures |

## The fix

Patterns: [sandbox-per-work-order](/patterns/sandbox-per-work-order), [bounded-agent](/patterns/bounded-agent), [tool-grant-and-receipt](/patterns/tool-grant-and-receipt), [fail-closed-qualification](/patterns/fail-closed-qualification).

Minimal migration:

1. Define a Sandbox Profile: image digest, resources, `networkEgress` mode with allowlist, no public ingress, credential mode attempt-scoped, repository access by control-plane snapshot.
2. Allocate per Attempt; attest clean start; extract results as bundles; revoke credentials; verify resource absence; record teardown.
3. Gate remote execution on data classification: confidential repositories require provider-enforced egress proof.
4. Freeze the profile digest into the Factory Version; readiness fails without a dispatchable profile.
5. Threat-model the provider and qualify it as a supply-chain component.

## How Mission Control prevents it

`factorySandboxProfiles` declare provider, image, resources, `networkEgress: UNRESTRICTED|RESTRICTED_ALLOWLIST|DENY_ALL`, `publicIngress: v.literal(false)`, `inferenceCredentialMode`, `repositoryAccessMode: CONTROL_PLANE_SNAPSHOT|NONE`, `egressEnforcementProven`, and an `admissionState` (`convex/schema.ts:1222`, Experimental — production-pilot eligible, Preview; egress not provider-enforced in the retained cohort). Allocations are per Attempt with a durable lifecycle and orphan reconciliation (`sandboxAllocations`, `sandboxCredentialGrants`). Readiness includes `sandbox-profile`, `provider-egress`, and `host` checks (`convex/factory/configuration.ts:1367, 1403-1404`, Available); non-public repositories cannot use Remote Sandbox without immutable profile evidence of provider-enforced egress. Isolated-container execution (`isolated-container`) is offline and deterministic with `inference: DENIED` and `network: NONE` (Experimental). A threat model exists (`docs/security/remote-sandbox-threat-model.md`).

Limitation: the qualified production path today is the `persistent-worker` backend on a canonical host with detached Git worktrees — process- and worktree-level isolation, not container isolation. Mission Control is explicit that this is why remote sandbox certification is the next gate.

## Detection

- Attempts with no sandbox allocation or isolation attestation record.
- Egress logs showing connections from execution hosts to destinations outside any allowlist.
- Secrets or credentials present on execution hosts beyond attempt-scoped grants.
- Multiple tenants' or classifications' repositories executed on one host.
- Readiness assessments passing with `sandbox-profile` waived.

## Related

- Fixing patterns: [sandbox-per-work-order](/patterns/sandbox-per-work-order) · [bounded-agent](/patterns/bounded-agent) · [tool-grant-and-receipt](/patterns/tool-grant-and-receipt)
- Sibling anti-patterns: [shared-mutable-workspace](/anti-patterns/shared-mutable-workspace) · [agent-has-production-credentials](/anti-patterns/agent-has-production-credentials) · [unlimited-tool-access](/anti-patterns/unlimited-tool-access)
- [Top 10 F06 Unisolated Execution with Live Credentials](/anti-patterns/top-10) · [/architecture/sandboxing](/architecture/sandboxing) · Manifesto principle 4
