---
title: No Versioning
description: Skills, prompts, tools, agent definitions, and harness builds have no version or digest, so nothing can be pinned, compared, qualified, or rolled back.
path: /anti-patterns/no-versioning
audience: [architect, platform, factory-engineer, builder]
level: [practitioner]
status: draft
related: [/anti-patterns, /patterns/immutable-factory-version, /patterns/fail-closed-qualification, /patterns/context-package, /patterns/tool-grant-and-receipt, /anti-patterns/mutable-production-factory, /anti-patterns/no-qualification, /architecture/factory-versioning]
diagrams: [D11]
mc_refs: [convex/schema.ts, packages/workflow-engine/src/harnessManifests.ts, convex/lib/factoryConfiguration.ts, docs/CONTEXT_MANIFESTS.md]
---

# No Versioning

**Also known as:** Prompt folders · `latest` everywhere · "The skill is in the repo somewhere"

**Severity:** High

## Symptoms

- Skills and prompts are files in a directory with no version, digest, or owner.
- Tool servers and harness binaries are referenced by name or `latest` tag.
- Agent definitions are edited in place; there is no history of what an agent "was".
- Two factories claim to use "the migration skill" and behave differently.
- Rollback means checking out an older commit of a repository that mixes many components.

## Why it fails

Everything downstream of versioning depends on it: an immutable Factory Version needs versioned parts; qualification binds to a digest; routing selects by version; learning proposes a version change; rollback restores a version. Without component versions the factory cannot be described exactly, so it cannot be qualified, attributed, or restored. "The skill in the repo" is a mutable pointer, like a branch, and inherits every problem of [no-candidate-identity](/anti-patterns/no-candidate-identity) at the factory level instead of the candidate level.

Scenario: a skill author improves the migration skill's shim-detection heuristic and commits it. The change is picked up by three factories on their next run. One regresses because its verification contract relied on the old behavior. The postmortem asks which skill version each factory ran; the answer is "whatever was in the directory at the time", and the directory has changed twice since.

## How it shows up in the wild

- Prompt libraries as shared folders or wiki pages.
- MCP server references by command name with auto-update.
- Harness or CLI agent installed via package manager at unpinned versions.
- Agent "templates" in a UI with an edit button and no revision history.

## Consequences

| Dimension | Consequence |
|---|---|
| Governance | No Capability Manifests; registries cannot exist; qualification has no subject |
| Security | Supply-chain substitution undetectable; a changed binary is "the same tool" |
| Cost | Regressions traced by hand; no controlled comparison possible |
| Reliability | Non-reproducible behavior across time and across factories |

## The fix

Patterns: [immutable-factory-version](/patterns/immutable-factory-version), [fail-closed-qualification](/patterns/fail-closed-qualification), [context-package](/patterns/context-package) (lockfile pinning), [tool-grant-and-receipt](/patterns/tool-grant-and-receipt) (tool version digests).

Minimal migration:

1. Give every component a Capability Manifest: identity, semantic version, content digest, owner, permissions, qualification status, deprecation.
2. Publish skills and rules as immutable versions with content hashes; pin them in a lockfile per factory.
3. Reference harness builds and tool servers by executable or image digest; treat a different digest as a different runtime.
4. Version agent definitions as a genome (model config + prompt bundle hash + tool manifest hash) with a lifecycle (`DRAFT → TESTING → CANDIDATE → APPROVED → DEPRECATED → RETIRED`).
5. Compose the pinned parts into a Factory Version.

## How Mission Control prevents it

Skill and rule packages are published as immutable `contextPackageVersions` with a required `contentHash` (`sha256:<64hex>`) and pinned through `mc-context.json` / `mc-context.lock` with version, hash, and source commit (`convex/schema.ts:6688-6834`; `docs/CONTEXT_MANIFESTS.md`, Available). Agent definitions are versioned as `agentVersions.genome {modelConfig, promptBundleHash, toolManifestHash}` with `genomeHash` and a status lifecycle (`convex/schema.ts:734`, Available). Harness manifests carry `identity {harnessId, harnessVersion, harnessCommit, adapterId, adapterVersion}`, `effectiveConfigSha256`, and a runtime artifact sidecar with `executableSha256` / `imageDigest` / `closureSha256`; "An installed adapter with a different executable or image is not the same admitted runtime" (`packages/workflow-engine/src/harnessManifests.ts`; `docs/architecture/generic-harness-contract-v1.md`, Available). Tool versions carry `toolVersionDigest` and an implementation digest verified at call time (Experimental). The Factory Version's `configurationDigest` composes these (`convex/lib/factoryConfiguration.ts:79-95`).

Limitation: legacy persona YAML files under `agents/` are unversioned inputs to the legacy layer; the governed Factory layer does not read them directly, but they still exist in the repository.

## Detection

- Components referenced by name or `latest` in Factory Versions or execution manifests.
- Prompt or skill files whose digest is not recorded on any Attempt.
- Harness runtime artifacts without an executable or image digest.
- Agent definitions with edit history but no immutable version rows.
- Two Attempts claiming the same component version with different content hashes.

## Related

- Fixing patterns: [immutable-factory-version](/patterns/immutable-factory-version) · [fail-closed-qualification](/patterns/fail-closed-qualification) · [context-package](/patterns/context-package)
- Sibling anti-patterns: [mutable-production-factory](/anti-patterns/mutable-production-factory) · [no-qualification](/anti-patterns/no-qualification) · [model-lock-in](/anti-patterns/model-lock-in)
- [Top 10 F04 Mutable Production Factory](/anti-patterns/top-10) · [/architecture/factory-versioning](/architecture/factory-versioning) · Glossary: Capability Manifest, Skill, Tool
