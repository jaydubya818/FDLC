# FDLC.ai Information Architecture

Date: 2026-09-04

## Organizing principle

Every primary page reinforces three distinct abstraction levels:

1. **Factory Development Lifecycle** — how the factory is discovered,
   designed, assembled, validated, deployed, operated, and improved.
2. **Software factory value stream** — how software work moves through an
   operating factory from Intent through Deliver Software.
3. **Governed execution protocol** — the durable artifacts that make one unit
   of work inspectable from Intent through Learning.

The six-domain architecture—Intent, Harness, Capability, Model, Trust, and
Learning—is a structural view across those levels, not a fourth lifecycle.
Governance, Security, Observability, Measurement, and Human Authority are
cross-cutting disciplines. They are not sequential stages.

FDLC defines the discipline. Mission Control demonstrates it. The Guide teaches it. FDLC Deploy implements it in bounded customer environments. FDLC Enterprise is intended to industrialize proven patterns. The Specification will formalize interoperability. None replaces the FDLC framework itself.

## Sitemap and ownership

| Route | Purpose | Primary audience | Primary CTA | Canonical source | Owner |
| --- | --- | --- | --- | --- | --- |
| `/` | Establish the category and route users within 60 seconds | Engineering leaders, platform leaders, developers | Explore FDLC | Brief + Guide whole-factory chapters | FDLC product/editorial |
| `/framework` | Canonical definition and technical reference | Architects, engineering leaders | Study the architecture | Brief + Guide chapters 1–3 | FDLC framework |
| `/architecture` | Explain six required capability areas and their relationships | Architects, platform engineers | Explore the Guide | Guide chapters 2, 10–19, 21–33 | FDLC architecture |
| `/in-5-minutes` | Show all three abstraction levels and the structural view through one bounded worked scenario | Builders, evaluators, engineering leaders | Inspect Mission Control | Framework + Guide + Mission Control capability model | FDLC education |
| `/manifesto` | State the ten governance principles clearly | All audiences | Read the Framework | Brief + Guide principles | FDLC framework |
| `/guide` | Book home, reading paths, chapters, and documentation shell | Builders and operators | Start reading | Guide repository | Guide editorial |
| `/guide/<chapter>` | Long-form Guide content with navigation and anchors | Builders and operators | Continue reading | Guide repository | Guide editorial |
| `/mission-control` | Demonstrate implemented FDLC concepts with honest status | Developers, adopters, contributors | View on GitHub | Mission Control current source + maturity ledger | Mission Control |
| `/maturity` | Explain and assess factory maturity | Engineering leaders, transformation teams | Run assessment | Brief + Guide maturity content | FDLC framework |
| `/start` | Teach users to create a conceptual Factory Definition | Developers, platform teams | Build definition | Brief + Guide intent/governance/verification | FDLC education |
| `/about` | Explain why the discipline and open model exist | All audiences | Read the Manifesto | Brief + Guide principles | FDLC editorial |
| `/specification` | Preview a future formal, versioned specification | Implementers | Follow specification work | Mission Control schema + FDLC protocol | FDLC spec |
| `/benchmarks` | Publish measurement philosophy and future methodology | Leaders, researchers | Review metrics | Guide economics/evals + brief | FDLC benchmarks |
| `/enterprise` | Restrained future commercial governance path | Enterprise buyers | Become a design partner | Brief only; all capabilities future unless verified | Commercial |
| `/deploy` | Explain readiness, lighthouse, and scale engagements | Buyers and implementation partners | Discuss a design partnership | Brief + Guide FDE/adoption content | Services |

Future versioned routes are reserved under `/specification/v1`,
`/specification/v1/<entity>`, and optional `/guide/<edition>/...` redirects if
editorial versioning becomes necessary. `/spec` is a permanent compatibility
redirect only.

## Navigation

Desktop primary navigation:

- Framework
- Architecture
- Guide
- Mission Control
- Maturity
- More

`More` contains Manifesto, Specification, Benchmarks, Start, Enterprise, Deploy, and About. The primary utility CTA is GitHub and points to Mission Control until an FDLC organization repository exists.

Mobile navigation uses one accessible disclosure containing the same hierarchy. The footer repeats Learn, Build, Adopt, and Project groups. `/examples/dependency-modernization` is retained only as a permanent redirect to `/in-5-minutes`.

## Page-to-page narrative

```text
Homepage
  ├─ understand the category → Framework → Architecture → Manifesto
  ├─ see one complete example → FDLC in 5 Minutes → Mission Control
  ├─ learn the discipline → Guide → chapter pages
  ├─ see implementation → Mission Control → GitHub / quickstart
  ├─ assess current state → Maturity → recommended next actions
  ├─ practice the model → Start → Factory Definition
  └─ explore future paths → Specification / Benchmarks / Enterprise / Deploy
```

## Homepage content contract

The homepage uses a scannable category-to-adoption sequence:

1. Memorable category hero and three entry points: the five-minute model, Framework, and Mission Control.
2. Primary promise: verified delivery, not merely generated code; autonomy without evidence is just faster guessing.
3. Six-step public shorthand plus the factory system components.
4. Traditional SDLC versus AI-Native SDLC versus AI Software Factory versus
   FDLC, including the transition from agent participation to a persistent
   factory and then to the discipline that engineers it.
5. The six-domain architecture diagram.
6. The seven-stage Factory Development Lifecycle with five cross-cutting
   disciplines.
7. The eight-stage Guide value stream and eleven-artifact governed execution
   protocol, with their distinct questions made explicit.
8. Manifesto preview.
9. Mission Control as reference implementation, with capability caveat.
10. Maturity model preview.
11. Guide preview.
12. Five-part ecosystem model with Deploy and Enterprise status boundaries.

## Guide contract

The full Guide is a six-part, 44-chapter book with an eight-stage software
factory value stream. It is part of FDLC.ai and is served by the Guide
application under `/guide`; the FDLC application does not maintain a second
edition.

- The primary CTA opens the canonical same-origin `/guide` experience.
- Three task-oriented paths cover a ten-minute introduction, architecture reference, and implementation.
- Four role paths serve executives, architects, builders, and operators.
- The six part cards open the first chapter of each part in the full Guide.
- The 25-topic FDLC index resolves each topic to a specific Guide chapter, Guide stage, FDLC reference page, assessment, or offering.
- The model bridge states explicitly that the Guide’s eight stages describe
  software flowing through the factory, while FDLC’s seven stages describe the
  factory being engineered and evolved. The governed execution protocol is the
  artifact-level contract, and the six domains are structural.

The current route map and exact chapter links live in `data/guide.ts`, so chapter counts and public navigation are tested from one source.

## Cross-link rules

- Every architecture area links to its relevant Guide topics.
- Every lifecycle stage links to the Framework and appropriate Guide stage.
- Every execution-protocol object links to the Specification preview and Mission Control mapping.
- Mission Control status claims link to the public GitHub source/evidence, not internal local paths.
- Preview pages link back to available open resources before presenting commercial CTAs.

## Documentation UX

Guide detail pages use breadcrumbs, desktop sidebar, mobile section navigation, generated table of contents, heading anchors, previous/next links, responsive tables, callouts, and readable code blocks. Framework and Architecture use an active sticky side rail on wide screens, a floating contents disclosure on narrower desktop, and an in-flow disclosure on mobile. Detailed factory stages, protocol artifacts, Architecture areas, failure modes, and maturity progressions progressively disclose on mobile. Search is prepared through semantic structure and deterministic content metadata; lightweight search is P1 and must not block V0.
