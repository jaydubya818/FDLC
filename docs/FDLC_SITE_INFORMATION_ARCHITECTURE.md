# FDLC.ai Information Architecture

Date: 2026-09-03

## Organizing principle

Every primary page reinforces three distinct mental models:

1. **Lifecycle** — how the factory is designed, built, operated, verified, and improved.
2. **Architecture** — what capabilities the factory contains.
3. **Execution Protocol** — how one governed unit of work moves from intent to outcome.

Mission Control demonstrates the protocol. The Guide teaches the discipline. The Specification will formalize interoperability. None replaces the FDLC framework itself.

## Sitemap and ownership

| Route | Purpose | Primary audience | Primary CTA | Canonical source | Owner |
| --- | --- | --- | --- | --- | --- |
| `/` | Establish the category and route users within 60 seconds | Engineering leaders, platform leaders, developers | Explore FDLC | Brief + Guide whole-factory chapters | FDLC product/editorial |
| `/framework` | Canonical definition and technical reference | Architects, engineering leaders | Study the architecture | Brief + Guide chapters 1–3 | FDLC framework |
| `/architecture` | Explain six required capability areas and their relationships | Architects, platform engineers | Explore the Guide | Guide chapters 2, 10–19, 21–33 | FDLC architecture |
| `/manifesto` | State the ten governance principles clearly | All audiences | Read the Framework | Brief + Guide principles | FDLC framework |
| `/guide` | Book home, reading paths, chapters, and documentation shell | Builders and operators | Start reading | Guide repository | Guide editorial |
| `/guide/[slug]` | Long-form guide content with navigation and anchors | Builders and operators | Continue reading | Guide repository | Guide editorial |
| `/mission-control` | Demonstrate implemented FDLC concepts with honest status | Developers, adopters, contributors | View on GitHub | Mission Control current source + maturity ledger | Mission Control |
| `/maturity` | Explain and assess factory maturity | Engineering leaders, transformation teams | Run assessment | Brief + Guide maturity content | FDLC framework |
| `/start` | Teach users to create a conceptual Factory Definition | Developers, platform teams | Build definition | Brief + Guide intent/governance/verification | FDLC education |
| `/about` | Explain why the discipline and open model exist | All audiences | Read the Manifesto | Brief + Guide principles | FDLC editorial |
| `/spec` | Preview a future formal, versioned specification | Implementers | Follow specification work | Mission Control schema + FDLC protocol | FDLC spec |
| `/benchmarks` | Publish measurement philosophy and future methodology | Leaders, researchers | Review metrics | Guide economics/evals + brief | FDLC benchmarks |
| `/enterprise` | Restrained future commercial governance path | Enterprise buyers | Become a design partner | Brief only; all capabilities future unless verified | Commercial |
| `/deploy` | Explain readiness, lighthouse, and scale engagements | Buyers and implementation partners | Discuss a design partnership | Brief + Guide FDE/adoption content | Services |

Future versioned routes are reserved under `/spec/v1`, `/spec/v1/[entity]`, and optional `/guide/[edition]/...` redirects if editorial versioning becomes necessary.

## Navigation

Desktop primary navigation:

- Framework
- Architecture
- Guide
- Mission Control
- Maturity
- More

`More` contains Manifesto, Specification, Benchmarks, Start, Enterprise, Deploy, and About. The primary utility CTA is GitHub and points to Mission Control until an FDLC organization repository exists.

Mobile navigation uses one accessible disclosure containing the same hierarchy. The footer repeats Learn, Build, Adopt, and Project groups.

## Page-to-page narrative

```text
Homepage
  ├─ understand the category → Framework → Architecture → Manifesto
  ├─ learn the discipline → Guide → chapter pages
  ├─ see implementation → Mission Control → GitHub / quickstart
  ├─ assess current state → Maturity → recommended next actions
  ├─ practice the model → Start → Factory Definition
  └─ explore future paths → Specification / Benchmarks / Enterprise / Deploy
```

## Homepage content contract

The homepage uses the requested eleven-section narrative but groups it into a scannable sequence:

1. Category hero and three clear entry CTAs.
2. The shift from isolated coding agents to governed factories.
3. FDLC versus SDLC.
4. The six-area architecture diagram.
5. The eight-stage lifecycle.
6. The execution protocol and its three key invariants.
7. Manifesto preview.
8. Mission Control as reference implementation, with capability caveat.
9. Maturity model preview.
10. Guide preview.
11. Learn / Build / Adopt paths.

## Guide content mapping

The Guide remains a six-part book while FDLC adds topic-level routes and indexes.

| Proposed FDLC chapter | Existing Guide source |
| --- | --- |
| 1. What Is an AI Software Factory? | Chapters 1–2 |
| 2. Coding Agents vs. Software Factories | Chapters 1–2 |
| 3. Factory Development Lifecycle | Stage pages + Chapters 2–3 |
| 4. Reference Architecture | Chapters 2, 11, 19 |
| 5. Intent and Specification Engineering | Chapters 5–7 |
| 6. Planning and Work Decomposition | Chapters 5–6, Stage 2 |
| 7. Agent Harnesses | Chapters 11–14, 18 |
| 8. Agents and Agent Definitions | Chapters 10, 15, 18 |
| 9. Skills and Reusable Capabilities | Chapter 10, Stages 3 and 5 |
| 10. Tools and MCP | Chapters 13, 15, 26 |
| 11. Context and Enterprise Knowledge | Chapter 16 |
| 12. Model Abstraction and Routing | Chapter 17 |
| 13. Execution Environments and Sandboxes | Chapter 14 |
| 14. State, Checkpoints, and Recovery | Chapters 11–12, 29–30 |
| 15. Verification and Evaluation | Chapters 21–25 |
| 16. Security and Delegated Authority | Chapters 3, 7, 26 |
| 17. Human Oversight | Chapters 4, 7–8 |
| 18. Observability and Cost | Chapters 8, 28 |
| 19. Failure Taxonomy | Chapters 12, 18, 21, 29 |
| 20. Continuous Learning | Chapters 32–33 |
| 21. Organizational Operating Model | Chapters 4, 27, 31 |
| 22. Forward-Deployed Engineering | Chapter 31 |
| 23. Build vs. Buy | Chapters 19, 27, 31 |
| 24. Factory Maturity Model | Chapters 3, 31, 35 + coverage appendix |
| 25. Implementation Playbook | Stages 1–8 + Chapters 27, 31, 35 |

V0 publishes the map and a high-quality documentation shell. The current 36-chapter book remains the canonical long-form source and should be migrated mechanically in a follow-on editorial pass rather than compressed into 25 shallow rewrites.

## Cross-link rules

- Every architecture area links to its relevant Guide topics.
- Every lifecycle stage links to the Framework and appropriate Guide stage.
- Every execution-protocol object links to the Specification preview and Mission Control mapping.
- Mission Control status claims link to the public GitHub source/evidence, not internal local paths.
- Preview pages link back to available open resources before presenting commercial CTAs.

## Documentation UX

Guide detail pages use breadcrumbs, desktop sidebar, mobile section navigation, generated table of contents, heading anchors, previous/next links, responsive tables, callouts, and readable code blocks. Search is prepared through semantic structure and deterministic content metadata; lightweight search is P1 and must not block V0.

