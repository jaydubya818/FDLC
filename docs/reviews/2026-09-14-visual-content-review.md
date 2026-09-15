# Visual and content review

## Decision

Improve the existing learning journey rather than add more top-level pages. The site already contains substantial architecture, operations, context, skills, and evaluation material. Its main gap is explanation through diagrams and concrete artifacts.

## Changes

- Replace the static nine-stage lifecycle grid with a selectable, connected diagram. Each stage explains its input, output, control, and part of one dependency-upgrade example. Previous/next controls close the learning loop. Selection is educational and never performs an operation.
- Preserve the canonical sequence: Intent → Planning → Execution → Evidence → Verification → Approval → Release → Outcomes → Learning.
- Surface the governing lifecycle immediately after the Framework definition and add its missing navigation entry.
- Replace the Architecture context/skills wall of text with a package → evaluate → authorize → observe diagram and five expandable operating practices.
- Reduce shared section padding and section-heading size. The shared rules affect reference pages as well as the homepage; verify their responsive layouts together.
- Shorten the AI-FDE introduction and distinguish reviewed Factory Definition from Mission Control runtime qualification. Replace cramped comparison columns with readable handoff steps.

## Useful content from the supplied material

| Topic | Treatment |
| --- | --- |
| Inputs and outputs at each lifecycle stage | Added to the interactive inspector. |
| Verification versus evaluation | Explain under Verification: checking a candidate differs from measuring system behavior across representative workloads. Neither grants release authority. |
| Existing delivery infrastructure | Release explicitly uses existing merge queues and CI/CD, with current authorization and rollback. |
| Governed learning | Learning proposes a revision; representative evaluations, protected holdouts, qualification, and approval precede rollout. |
| Evidence provenance and retention | Evidence binds records to the exact candidate; redact secrets and apply retention policy. |
| Harness, runtime, and authority | Execution distinguishes the loop from enforced runtime limits; Approval makes external authority explicit. |
| Context engineering and versioned skills | Existing technical practices retained, reorganized into progressive disclosure. |
| Multi-agent reliability and recovery | Existing architecture design decisions and production operating contracts already cover these; avoid duplicate overview sections. |
| Model training, vendor comparisons, and organizational strategy | Defer additional pages until there is a concrete reader decision and evidence to support the guidance. |

Only general software-factory concepts are included. Source-specific personal, recruiting, and organizational material is excluded. Proposed architecture must not be presented as an implemented product capability.

## Verification

Use rendered HTML checks for the canonical stage sequence and product boundaries. Browser checks must exercise all nine selections, keyboard activation, next/previous wraparound, disclosure expansion, accessibility, and narrow viewport reflow. Inspect screenshots of the actual rendered diagrams and page sections.

## Delivery boundary

Preview only. Keep production auto-deployment disabled and retain the existing AI-FDE proxy binding. No backend, runtime, credential, or release-authority changes.
