# FDLC.ai Site Source Audit

Date: 2026-09-03

## Scope and baselines

This audit covers the two authoritative local sources named in the product brief. No source files were changed.

| Source | Local path | Studied revision | Working-tree note |
| --- | --- | --- | --- |
| AI Software Factory Guide | `/Users/jaywest/Documents/ChatGPT/ai-software-factory-mastery_documentation` | `2db7fd86e8532ad255be58589e29ba56f6ae276b` | Existing user changes are present in the source repository and must remain untouched. |
| Mission Control | `/Users/jaywest/MissionControl` | `07a96ac3623c8a6772455fcf4c9cdf4ca78e6d2f` | The checkout is on `codex/github-app-multi-repo-installations`; untracked user files are present and must remain untouched. |
| FDLC.ai application | `/Users/jaywest/Documents/ChatGPT/FDLC` | New repository with no commits | No existing application was found. |

Both source repositories declare the MIT License. That allows reuse, but copied or adapted content still needs clear attribution and a provenance record before release.

## What was inspected

### AI Software Factory Guide

- Root and guide READMEs, license, source-material index, current Git history, and repository structure.
- The complete current guide map: eight stage pages, 36 chapters across Understand, Design, Build, Prove, Operate, and Improve, plus reference appendices.
- Key canonical chapters covering the whole-factory model, authority and evidence, durable execution, verification, Mission Control, maturity, principles, and the glossary.
- The current documentation site architecture, navigation, generated-content system, diagrams, search index, metadata, tests, and accessibility/link checks.
- Existing diagram slots and Mermaid source. No finished reusable infographic assets exist in `guide/assets`; the existing visuals are primarily structured diagrams in Markdown.

### Mission Control

- Root instructions, README, license, monorepo package metadata, current Git history, public overview, architecture, North Star, V1 strategy, capability maturity ledger, governed Mission contract, verification contracts/state machines, worker runtime, continuous learning, security references, release documentation, and evidence indexes.
- The actual Convex schema and domain surface for Missions, Plan revisions, WorkOrders, Tasks, workflow runs/Attempts, leases, evidence envelopes, verification runs/receipts, quality-gate decisions, approvals, Factory versions/readiness, releases, traces, evals, and learning signals.
- The React/Vite operator UI route map, supported local demo path, architecture boundaries, package layout, tests, and public screenshots.

## Important reusable source knowledge

### Category and whole-factory model

The Guide already makes the durable distinction FDLC.ai needs:

- a coding agent is a worker, not the factory;
- the Agent Factory supplies versioned agents, skills, tools, profiles, and configurations;
- the AI software factory composes people, policy, capability, execution, verification, delivery, and feedback;
- Mission Control is one implementation of the control-plane responsibilities, not the definition of the whole factory;
- validated outcomes, not model assertions or generated code volume, are the unit of value.

The proposed FDLC category gives this body of knowledge a cleaner organizing layer: Lifecycle, Architecture, and Execution Protocol.

### Guide content ready to reorganize

The current Guide is unusually deep and already structured for repository-based publishing. Its 36 chapters contain the authoritative material needed for all six FDLC architecture areas and all eight lifecycle stages. The strongest V0 reuse strategy is to preserve the Guide’s six-part reading arc while adding the FDLC taxonomy as the primary orientation layer. Rewriting the entire Guide would create editorial drift without improving the category definition.

### Mission Control capabilities supported by source and evidence

The most defensible public claims are:

- Governed Mission intake, immutable/versioned planning artifacts, human Plan approval, and WorkOrder release are implemented and qualified for the documented V1 path.
- WorkOrders, Tasks, Attempts/workflow runs, frozen execution manifests, worker admission, fenced leases, immutable candidates, and recovery records are implemented.
- Independent verification, evidence envelopes and receipts, exact-subject currentness, Quality Gate decisions, and a separate human acceptance boundary are implemented and qualified.
- Codex is the production-admitted harness adapter. DeepSeek is experimental and disabled by default. MCP execution is not yet an admitted production capability.
- Factory Memory, observability/evals, and Factory Learning exist as advisory systems; they do not grant acceptance or promotion authority.
- Remote Sandbox is Preview and production-pilot eligible under documented constraints, not generally production-certified.
- GitHub App publication/currentness is implemented for the bounded V1 path. Merge remains human-owned.
- Release and production feedback are partial. Fleet-scale production operation, full enterprise tenancy, complete cost attribution, canonical incident response, and sustained adoption are not proven.

The source of truth for public status is `/Users/jaywest/MissionControl/docs/product/software-factory-capability-maturity.md`, checked against source and retained evidence. Plans are not implementation evidence.

## Reusable assets

### Safe candidates

- `MissionControl/docs/software-factory/screenshots/readme/mission-control-command-center.png`
- `MissionControl/docs/software-factory/screenshots/readme/mission-control-work-orders.png`
- `MissionControl/docs/software-factory/screenshots/readme/mission-control-audit.png`

These are already used by the public README and can support the Mission Control page. Captions must identify them as deterministic demo/product views, not proof of fleet scale. CSS/HTML diagrams should be created for the FDLC signature models rather than rasterizing Mermaid diagrams.

### Assets requiring review or exclusion

- Screenshots under historical test/evidence folders may expose transient branch names, repository details, or internal fixtures. Do not publish them by default.
- `.env.local`, private credentials, worktree state, temporary bundles, internal review folders, raw traces, and local operational artifacts are excluded.
- Source-material files may contain personal or pre-publication material. Use the reviewed Guide, public Mission Control documentation, and source code as the publication boundary.

## Terminology conflicts and resolutions

| Source term or conflict | Resolution for FDLC.ai |
| --- | --- |
| Mission Control sometimes uses `Mission` where the proposed protocol begins with `Goal`. | Define `Goal` as the protocol-level intent object. Explain that Mission Control realizes it as a governed `Mission` with a Specification and approved Plan. Do not rename Mission Control’s implemented domain objects. |
| The implemented hierarchy includes `Task` and `candidate`, while the concise FDLC chain omits them. | Keep the canonical FDLC chain concise. On Mission Control pages, show the concrete expansion: Mission → Spec → Plan → WorkOrder → Task → Attempt → candidate → evidence/verification → acceptance → release. |
| The Guide’s stage mnemonic differs from the proposed FDLC Lifecycle. | Use the brief’s eight lifecycle stages as the category model. Map the Guide’s stages into them; do not erase the Guide’s useful execution-oriented teaching sequence. |
| `Harness` can mean the inner model/tool loop, an outer supervisor, or the whole runtime. | On FDLC.ai, `Harness` is the architectural area for orchestration, durable state, lifecycle, recovery, scheduling, leases, and handoffs. Guide pages can preserve the narrower inner/outer distinction. |
| Agent Factory vs. Capability area. | Treat the Agent Factory as an important implementation pattern inside the broader FDLC Capability area. |
| Loom appears in technical status material. | Do not use Loom as a public product identity. Omit it from marketing and overview content; mention only in developer documentation if needed to explain an unsupported adapter identifier. |
| “Operating system” and “control plane” both describe Mission Control. | Lead with “open-source reference implementation” and “governed control plane.” Reserve “operating system” for attributed product doctrine, not the category definition. |

## Stale or superseded material

- Historical Mission Control plans and the older Guide maturity appendix contain point-in-time status rows that have been superseded by the current capability maturity ledger and current checkout.
- Mission Control’s legacy README copy and package description include older OpenClaw-oriented framing that is not the preferred public positioning.
- The Guide’s archived V1 curriculum is retained for provenance and should not enter primary navigation.
- Several intended production capabilities are documented in architecture or plans but explicitly not admitted. Those must remain Planned or Proposed on FDLC.ai.

## Missing content

- A canonical, versioned FDLC Specification and schema package do not yet exist.
- No public benchmark dataset or benchmark results exist.
- No production-proven FDLC Enterprise product exists.
- No final licensing decision exists for the future framework/spec split proposed in the brief; current source material is MIT.
- The proposed FDLC maturity model needs a stable scoring rubric and validation against real organizations.
- The `Build Your First Software Factory` experience and export schema are new teaching products, not existing Mission Control features.
- Mission Control needs a stable public release/version story before the website should advertise a one-command production deployment.

## Publication and security concerns

- Treat current local working trees as source material, not as automatically public content.
- Never publish secrets, internal URLs, raw traces, ticket references, employer material, or unreviewed evidence artifacts.
- Avoid turning deterministic fixture counts into adoption, reliability, or scale claims.
- Status labels must be attached to individual capabilities. A qualified deterministic contract does not imply general production readiness.
- External provider names can be examples, but FDLC must remain model- and agent-agnostic.
- Use the Mission Control MIT license unchanged. Do not select new framework, Guide, schema, or commercial licenses without Product Owner approval.

## Recommendations

1. Launch FDLC.ai as a repository-based static content site with a small client-side surface for the assessment and educational builder.
2. Make Lifecycle, Architecture, and Execution Protocol the repeated orientation model across the site.
3. Preserve the Guide’s six-part book and 36-chapter source as the long-form body; add the FDLC taxonomy as an index and cross-link layer.
4. Publish a capability matrix for Mission Control with status, limitation, and source evidence. Never collapse all status into a single “available” claim.
5. Use three first-party public Mission Control screenshots and label them as product/demo views.
6. Keep Specification, Benchmarks, Enterprise, and Deploy transparent preview pages until their underlying programs exist.
7. Ship V0 without a CMS, database, authentication, hosted search service, or analytics dependency.

