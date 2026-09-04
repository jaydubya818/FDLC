# FDLC.ai Design System

Date: 2026-09-03

## Direction

FDLC.ai should feel like an inspectable engineering standard with the editorial confidence of a good technical journal. The primary visual metaphor is the control diagram: rails, boundaries, state transitions, evidence gates, and measured outcomes. Avoid AI spectacle.

## Visual language

- **Base:** warm off-white paper, graphite ink, quiet gray borders.
- **Primary signal:** deep infrastructure green for authority and trusted progression.
- **Secondary signal:** copper/amber for human decisions and consequential boundaries.
- **Evidence signal:** cool blue for verification and proof.
- **Risk:** red only for actual blockers or unavailable capability.
- **Dark surfaces:** near-black graphite used sparingly for protocol and Mission Control sections.

The design intentionally does not rely on gradients, glass effects, generated imagery, or decorative node networks.

## Typography

- Interface and body: a legible system sans stack.
- Technical labels and object names: system monospace.
- Major editorial headlines: a restrained serif stack.
- Body measure: 66–74 characters for long-form content.
- Headings use tight tracking and clear hierarchy; labels use modest uppercase tracking.

No remote font dependency is required for V0.

## Layout

- Wide shell: 1,240px maximum.
- Reading column: 720px maximum.
- Documentation shell: 240px left navigation, fluid article, 200px table of contents.
- Main spacing rhythm: 8px base with 16, 24, 32, 48, 72, 96, and 128px steps.
- Borders and spacing carry hierarchy more often than shadows.

## Components

- Global header with wordmark, six primary destinations, accessible More disclosure, and GitHub utility action.
- Footer grouped into Learn, Build, Adopt, and Project.
- Editorial hero with category statement, concise copy, and no oversized media.
- Section header with eyebrow, heading, explanatory copy, and optional status badge.
- Technical card with stable number, title, definition, and linked detail.
- Status badge: Available, Experimental, Planned, Proposed.
- Data table with responsive horizontal overflow and text alternative.
- Documentation callouts for Principle, Implementation Note, Status, and Warning.
- Form controls with persistent labels, visible focus, inline help, error text, and explicit success output.
- Active sticky page-contents rail on wide reference pages; it becomes a floating disclosure on narrower desktop and an in-flow disclosure on mobile.
- Progressive detail cards that remain fully visible on desktop and collapse secondary detail on mobile.
- State-boundary callout with a fixed semantic sequence plus distinct completion, verification, judgment, promotion, and reality definitions.
- Worked-example ledger combining editorial narrative, baseline contracts, Mission Control evidence views, attributable record IDs, and explicit evidence boundaries.

## Signature diagrams

Diagrams are semantic HTML/CSS components, not decorative raster art.

1. **Architecture:** six connected capability areas with Trust visibly crossing execution and Learning closing the loop.
2. **Factory lifecycle:** seven numbered stages with a persistent band for governance, security, observability, and measurement; mobile becomes a vertical sequence.
3. **Runtime lifecycle:** nine verbs describe software moving through an operating factory; horizontal on wide screens and vertical on mobile.
4. **Artifact protocol:** eleven durable objects preserve intent, work, proof, decisions, outcomes, and learning signals; horizontal on wide screens and vertical on mobile.
5. **Factory Concept:** humans and intent enter the control plane; capability/model/context feed execution; evidence and verification gate outcomes; validated outcomes feed governed learning.
6. **Worked Example:** one bounded workflow shown as a factory dossier across all four system views; concrete enough to inspect, explicitly labeled when illustrative.

Every diagram includes an `aria-label` or adjacent accessible text list. No information depends on color alone.

## Navigation and documentation

- Sticky header on site pages; active side rails appear only where viewport width and height permit.
- Current navigation state uses text weight, border, and `aria-current`.
- Heading anchors appear on hover and keyboard focus.
- Code blocks use high-contrast dark surfaces and preserve horizontal scrolling.
- Previous/next links remain large touch targets.

## Responsive behavior

- Desktop: full navigation and horizontal diagrams.
- Tablet: reduced columns, diagrams wrap into two rows, table of contents moves below article intro.
- Mobile: navigation disclosure, single-column cards, collapsed lifecycle/protocol detail, collapsed Architecture areas, no clipped labels, 44px minimum interactive targets.
- Documentation sidebars become an in-flow disclosure before the article.

## Theme

V0 uses one carefully tuned light editorial theme plus dark high-trust sections. This is simpler and more reliable than shipping an incomplete theme toggle. All components are tokenized so a full dark theme can be added later without structural changes.

## Motion

- 120–180ms hover/focus transitions.
- Optional one-time diagram emphasis on entry, never required for comprehension.
- `prefers-reduced-motion` disables smooth scrolling and transforms.
- No autoplay video, parallax, or continuous ambient motion.

## Accessibility standard

- Target WCAG 2.2 AA.
- Semantic landmarks and a skip link.
- One `h1` per page and sequential headings.
- Visible `:focus-visible` treatment with sufficient contrast.
- Native buttons, links, inputs, radio groups, and disclosure elements.
- Forms announce errors and assessment completion.
- Diagrams include text equivalents.
- Status never relies on color alone.
