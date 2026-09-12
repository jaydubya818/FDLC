---
title: Unlimited Tool Access
description: Every discovered tool, shell command, and network destination is callable; discovery becomes authority and tool output becomes policy.
path: /anti-patterns/unlimited-tool-access
audience: [architect, platform, security, factory-engineer]
level: [practitioner, architect]
status: draft
related: [/anti-patterns, /patterns/tool-grant-and-receipt, /patterns/bounded-agent, /patterns/sandbox-per-work-order, /patterns/fail-closed-qualification, /anti-patterns/agent-as-authorization-system, /anti-patterns/agent-has-production-credentials, /architecture/agents-skills-tools-harnesses]
diagrams: [D19]
mc_refs: [apps/orchestration-server/src/governedMcpContracts.ts, apps/orchestration-server/src/governedMcpBroker.ts, convex/schema.ts, docs/decisions/governed-mcp-tool-capability.md]
---

# Unlimited Tool Access

**Also known as:** Tool sprawl · "Connect all the MCP servers" · Implicit permissions

**Severity:** Critical

## Symptoms

- The agent's tool list is whatever the connected servers advertise at startup.
- Shell, filesystem, and network are available without allowlists.
- Tool servers are updated in place; nobody records which implementation answered.
- There is no per-call record of arguments, output, server version, or cost.
- A tool's response can instruct the agent, and the agent complies.

## Why it fails

Discovery is descriptive. A server saying "I offer `delete_branch`" is information, not a grant. When every advertised operation is callable, the agent's effective permissions are the union of every server's surface, and they change whenever any server changes. Tool output is data returned by a third party; treating it as instructions turns every tool into an injection channel. Without receipts, the factory cannot show what the agent did, and without qualification it cannot say what the tool would do.

Scenario: a documentation-lookup server is upgraded overnight. The new version adds a `submit_feedback` operation that posts to an external endpoint. The agent, asked to "report anything unclear in the docs", discovers the tool and posts a summary containing an internal API key it had read from a config file. No grant existed for the operation because no grants existed at all.

## How it shows up in the wild

- Agent configs with a dozen MCP servers, each exposing 20–50 tools, all enabled.
- "Computer use" or unrestricted shell in a container with the developer's environment variables.
- Plugin marketplaces where installing a plugin equals authorizing its operations.
- Tool responses rendered into the system prompt without separation.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No mapping from Work Order scope to tool operations; no evidence of tool use |
| Security | Exfiltration and privilege escalation through any tool; supply-chain substitution of server implementations |
| Cost | Unattributed tool spend; runaway calls in loops |
| Reliability | Tool schema drift breaks Attempts nondeterministically |

## The fix

Patterns: [tool-grant-and-receipt](/patterns/tool-grant-and-receipt), [bounded-agent](/patterns/bounded-agent), [fail-closed-qualification](/patterns/fail-closed-qualification), [sandbox-per-work-order](/patterns/sandbox-per-work-order).

Minimal migration:

1. Inventory every tool operation the factory's Work Orders need; most need fewer than ten.
2. Register each as a Tool Version with an implementation digest, frozen schemas, side-effect class, credential class, and destination; registered means disabled.
3. Qualify read-only operations first; issue Grants per operation per Execution Profile with expiry.
4. Put a broker outside the sandbox between agent and server; write authorization and completion receipts; scan output for secrets and injected instructions.
5. Block direct egress from the sandbox to tool destinations.

## How Mission Control prevents it

The governed MCP path enforces the full chain: `evaluateGovernedMcpCall` (`apps/orchestration-server/src/governedMcpContracts.ts:116-141`) denies on scope mismatch, stale lease, missing or mismatched grant, unqualified or expired tool version, server substitution, non-read-only operation, wrong destination, non-`NONE` credential class, and replay; `GovernedMcpBroker.call` verifies the implementation digest before invoking, validates output schema and size, withholds output on secret detection, flags instruction poisoning, and withholds late results (`governedMcpBroker.ts:115-200`). `mcpToolVersions` are "descriptive and disabled" until qualified; `mcpToolGrants` are immutable, expiring, single-operation (`convex/schema.ts:1334-1383`). The ADR states "MCP server discovery is descriptive input, not authority" and "Tool output is untrusted content, not policy" (`docs/decisions/governed-mcp-tool-capability.md`). Status: Experimental — one real read-only operation qualified.

Limitation: harness-native tools (shell, file write, git) are governed by the legacy `policies` risk map and allowlists, not by two-phase receipts; Mission Control's ledger marks "Native tool authorization — Partial".

## Detection

- Execution Profiles with no tool grant field treated as permissive (should mean no capability).
- Tool calls in traces with no authorization receipt preceding them.
- Server version or input-schema digest observed ≠ expected in completion receipts.
- Agent trace turns where tool output text is followed by behavior the Work Order did not authorize.
- Egress logs from sandboxes to tool destinations not on the allowlist.

## Related

- Fixing patterns: [tool-grant-and-receipt](/patterns/tool-grant-and-receipt) · [bounded-agent](/patterns/bounded-agent) · [fail-closed-qualification](/patterns/fail-closed-qualification)
- Sibling anti-patterns: [agent-as-authorization-system](/anti-patterns/agent-as-authorization-system) · [agent-has-production-credentials](/anti-patterns/agent-has-production-credentials) · [invisible-context](/anti-patterns/invisible-context)
- [Top 10 F01 Unbounded Agent Authority](/anti-patterns/top-10) · [/architecture/agents-skills-tools-harnesses](/architecture/agents-skills-tools-harnesses) · Glossary: Tool, Capability, Tool Manifest
