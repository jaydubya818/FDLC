# AI-FDE Milestone B visual review

Date: 2026-09-14

## Surfaces reviewed

- `/deploy/app` at 1280px desktop
- `/deploy/app` at 390×844 mobile
- `/deploy/app/engagements/acme-engagement#factory-definition`
- Unknown prefixed route and recovery to AI-FDE home

## Result

The cockpit now uses the canonical FDLC paper, surface, ink, green, amber, serif, and sans-serif system. The FDLC.ai logo and compact AI-FDE product lockup preserve ecosystem identity while keeping the operational workspace distinct from the marketing site.

The Factory Definition surface remains dense and review-oriented. It exposes lineage, unresolved claims, workflow and outcome, readiness, capabilities, implementation inputs, verification, authority, economics, rollout and rollback, review decisions, version comparison, export, copy, download, and staged handoff preparation. It explicitly distinguishes a Factory Definition from a Mission Control-owned Factory Version.

Desktop and 390×844 layouts preserve hierarchy, readable measure, visible state labels, and non-color status cues. Keyboard, reduced-motion, WCAG A/AA automated checks, prefixed 404 recovery, deep-linking, and browser back/forward checks pass.

## Evidence

- `landing-desktop.png`
- `landing-mobile.png`
- `factory-definition.png`

## Boundaries retained

- Synthetic mode makes no API or model calls.
- AI-FDE prepares definition and handoff intent; it does not create a Factory Version or dispatch a WorkOrder.
- Mission Control remains the owner of qualification, execution evidence, governed execution, release, and deployment state.
- `/deploy/app/:path*` is composed through a narrow same-origin external rewrite pinned to an immutable, independently deployed AI-FDE child; no paid Microfrontends project was added.
- The FDLC Preview remains protected. The pinned AI-FDE Preview is intentionally public only in its fail-closed hosted synthetic mode and remains `noindex`; it has no customer data, Production credentials, live API, provider/model call, or Mission Control write path.
- No production release was performed.
