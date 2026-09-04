# Engineering launch UI/UX pass

Date: 2026-09-04

## What we are building

A shared launch-quality interface system across Framework, Architecture, Guide, Mission Control, Maturity, FDLC in 5 Minutes, Manifesto, Specification, Benchmarks, Start, Enterprise, Deploy, and About.

The goal is not thirteen independent visual redesigns. It is one coherent engineering publication and product ecosystem in which every page answers four questions quickly:

1. Where am I?
2. What does this page establish?
3. What is real today versus proposed or illustrative?
4. What should I inspect or do next?

## Audience and quality bar

The near-term audience is technical: engineers, architects, engineering leaders, and potential design partners. They will test the precision of the model, the honesty of capability claims, the usefulness of the artifacts, and the quality of the implementation itself.

The experience should feel calm, rigorous, inspectable, and finished. It should not resemble a generic SaaS landing page or a slide deck translated literally into a website.

## Chosen direction

- Preserve the editorial typography, restrained palette, grid language, and visible system boundaries.
- Reduce unproductive first-viewport whitespace and align hero content around the reader's first decision.
- Add active navigation state so the site always shows location, including pages inside More.
- Add section position and reading progress to long technical pages.
- Use page-specific status language for external, illustrative, proposed, experimental, and available material.
- Add compact orientation bands where a page needs to distinguish concept, implementation, and availability.
- Make deep pages navigable without flattening their content into cards.
- Give every page an explicit handoff to the next useful depth or action.
- Keep interactive tools local and privacy-conscious, with visible progress, disabled-state clarity, and a useful completed state.

## Page priorities

### Canonical technical pages

Framework and Architecture remain the source-of-truth pages. They keep desktop contents rails, gain explicit progress, tighter hero entry, and stronger cross-links to worked evidence.

### Builder onboarding

FDLC in 5 Minutes remains the primary explanation. Its first viewport should introduce the example and start the walkthrough without forcing the reader through a poster-sized title. Start remains an educational builder, with a clear statement of output and privacy before the first form field.

### Evidence and implementation

Mission Control should foreground capability truth, source access, the deterministic quickstart, and the separation between the reference implementation and the framework. The Guide should behave as an intentional portal to the full reading site, not as an incomplete duplicate.

### Emerging assets

Specification, Benchmarks, Enterprise, and Deploy must make current status impossible to miss. They should communicate the contract or proposed direction, show what is available now, and provide a real next action without inventing availability or evidence.

### Principles and project context

Manifesto and About should remain the most editorial pages, but still expose orientation, anchors, and onward paths.

## Alternatives considered

### Rebuild every page around a dashboard UI

Rejected. It would erase the site's distinctive authority and make enduring concepts look like transient product screens.

### Add more diagrams and animation everywhere

Rejected. The content already has sufficient visual models. More motion would add cognitive load without improving evidence or navigation.

### Leave the visual system untouched and only edit copy

Rejected. The audit found structural issues: oversized entry viewports, missing active navigation, weak long-page position awareness, and inconsistent status/action handoffs.

## Constraints

- Do not claim production capability, benchmark results, standards status, pricing, or availability that does not exist.
- Do not add data collection or a contact form before privacy/legal requirements are satisfied.
- Do not make the Guide appear hosted twice.
- Do not collapse execution, verification, approval, release, and outcome into one state.
- Preserve existing content depth and source provenance.

## Validation

- Desktop and mobile browser audit of every core route.
- Keyboard and semantic checks for navigation, disclosures, and interactive tools.
- Unit, rendered-route, lint, typecheck, and production build verification.
- Preview deployment for review; production remains a separate decision.
