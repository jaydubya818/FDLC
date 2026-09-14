---
title: About
description: What FDLC is, who maintains it, the five ecosystem roles (defines, demonstrates, teaches, applies, industrializes), how to contribute, and how to reach the project.
path: /about
audience: [executive, leader, architect, platform, builder, security, factory-engineer]
level: [beginner]
status: draft
related: [/framework, /framework/principles, /mission-control, /guide, /deploy, /enterprise, /project, /project/governance, /in-5-minutes, /start]
diagrams: []
mc_refs: [README.md, LICENSE]
---

# About FDLC.ai

## What FDLC is

The **Factory Development Lifecycle (FDLC)** is the lifecycle, architecture, vocabulary, artifact model, governance model, and learning model for designing, assembling, qualifying, operating, and continuously improving autonomous AI software factories. It governs the complete path from human or machine intent to trusted software outcomes.

An **AI software factory** is a governed production system that converts intent into independently verified software outcomes. It composes agents, models, skills, tools, context, harnesses, execution environments, verification, evidence, policy, human authority, delivery, and learning under a control plane. A factory is more durable than any model, agent, or harness operating inside it.

```
Coding Agent ≠ AI Software Factory
SDLC governs the lifecycle of software.
FDLC governs the lifecycle of the factory that builds it.
```

FDLC.ai is the home of the specification and of the ecosystem that develops, demonstrates, teaches, and applies it. Its promise is verified delivery, not merely generated code. Its operating warning is that autonomy without evidence is just faster guessing.

> The goal is neither maximum human involvement nor zero human involvement. It is appropriately governed autonomy, earned through measured performance.

## Why it exists

| | Reason |
|---|---|
| 01 | **A lifecycle.** Factories change faster than the software they produce. They need an explicit method for design, operation, verification, and controlled improvement. |
| 02 | **Evidence.** Probabilistic execution can be useful, but consequential progression needs attributable, exact-current proof. |
| 03 | **Model independence.** Models and coding agents will keep changing. The durable asset is the governed contract around them. |
| 04 | **A reference implementation.** A category needs a working implementation with its constraints visible, not only diagrams. |
| 05 | **An open foundation.** Independent implementations should be able to share artifact semantics, verification contracts, and maturity language. |

The industry has converged on the premise that the surrounding system, not the model, determines outcomes. What did not exist was a vendor-neutral, versioned specification of that system. That is the gap FDLC fills; the [landscape page](/compare) shows where it sits.

## The ecosystem: five roles

FDLC defines it. Mission Control demonstrates it. The Guide teaches it.

| Role | Who | What | Status |
|---|---|---|---|
| **Defines it** | [FDLC](/framework) | The open operating model, reference architecture, artifact specification, conformance criteria, and maturity model | Open framework; specification v1.0-draft |
| **Demonstrates it** | [Mission Control](/mission-control) | The open-source reference implementation, MIT licensed, with a capability ledger that pairs every status with its limitation. Demonstrates; does not define. | Available reference; self-assessed FDLC-L2 |
| **Teaches it** | [The Guide](/guide) | The methodology and engineering practices from first principles through operation, as a book with chapters mapped to the lifecycle | Open methodology |
| **Discovers and designs it** | [AI-FDE](/deploy) | Evidence-driven product that turns reviewed enterprise source evidence into an approved Factory Definition, led by an accountable human Factory Deployed Engineer | Internal alpha; synthetic demo |
| **Industrializes it** | [Enterprise](/enterprise) | The open enterprise reference architecture for many factories under one control plane. A commercial enterprise control plane is proposed and is described only as such. | Reference architecture open; commercial layer Proposed |

The open material (framework, architecture, specification, patterns, guides, glossary, the enterprise reference architecture) is separated from the commercial material (services) by URL and by the [governance rules](/project/governance). No open page carries pricing.

## Who maintains it

FDLC.ai is led by Jay West, drawing on engineering leadership, quality engineering, automation, platform engineering, and agentic software systems. Public content is intentionally separated from confidential employer systems and from unsupported claims.

The project's governance proposal establishes a technical steering group of five to seven people, including at least two members from organizations that implement FDLC but do not maintain the reference implementation, and four working groups (Artifacts; Verification & Evidence; Factory Versioning & Qualification; Enterprise). Until that group is seated, the specification editor and the Mission Control maintainer act as interim editors, and every change goes through the published [RFC process](/project/governance). The steering group, once formed, is listed on [/project](/project).

## How to contribute

1. **Read the canon first.** Names, sequences, state names, and definitions are fixed unless an RFC changes them. Start with [/framework](/framework) and [/glossary](/glossary).
2. **Open an RFC** for any change to a schema, a state, an invariant, or a Mission Control status claim. Editorial fixes go straight to review. The process, time boxes, and RFC classes are on [/project/governance](/project/governance).
3. **Ship examples with schemas.** Every schema change includes an updated example that validates, and a conformance suite change when a MUST changes.
4. **Cite the reference implementation carefully.** Mission Control claims name a file path and a ledger status (Available / Experimental / Planned / Proposed). Never "Mission Control does X" without a status.
5. **No pricing, no infrastructure identifiers, no invented benchmark numbers.** Illustrative numbers are labeled.
6. **Sign off** commits with a Developer Certificate of Origin. Contributions are accepted under the asset's license: CC BY 4.0 for text and diagrams, Apache 2.0 for schemas and tooling (recommended; see [/project](/project)).
7. **Contribute to Mission Control** through its own repository and contributing guide; it keeps its own license and process.

Contributions that are especially welcome: conformance self-assessments of other control planes and harnesses; adapters that emit FDLC artifacts from existing platforms; case-study factories for the [examples](/examples) catalog; corrections to the [landscape page](/compare) from the vendors named on it; and reviewers from outside the maintainer's organization.

## Contact

- Specification issues, RFCs, and discussion: the FDLC specification repository (linked from the site header once the public repository is published; until then, through the Mission Control repository's issues).
- Reference implementation: [github.com/jaydubya818/MissionControl](https://github.com/jaydubya818/MissionControl).
- Security reports concerning the reference implementation: follow the repository's `SECURITY.md`.
- A public project contact address will be published here when the project mailbox is established; it is not yet.

Pricing questions belong to [/deploy](/deploy). This page and the open material carry none.

## Related

- [/in-5-minutes](/in-5-minutes) — understand FDLC
- [/start](/start) — learning paths by role
- [/framework/principles](/framework/principles) — the Manifesto and the design principles
- [/mission-control](/mission-control) — inspect the reference implementation
- [/project](/project) · [/project/governance](/project/governance) — license, versioning, RFCs, roadmap
- [/compare](/compare) — where FDLC fits
