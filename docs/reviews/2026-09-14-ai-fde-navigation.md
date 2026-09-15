# AI-FDE explanation and engagement workspace navigation

## Product correction

The AI-FDE label opens `/deploy`, which explains the product, the accountable human FDE, and the Factory Definition handoff. Its adjacent dropdown contains **Engagement workspace**, linking to `/deploy/app`. The explanation page's primary action uses the same destination name.

Desktop and mobile use the same hierarchy. The independently built child receives the versioned FDLC shell through the existing generated contract. Global links remain same-origin document navigation across the proxy boundary. The workspace item, rather than the explanatory page, is current inside the child. Keyboard users can open the dropdown with Enter, Space, or arrow keys; Escape closes it and restores focus without closing the surrounding mobile menu.

## Review evidence

Local screenshots at 1440px, 1024px, and 390×844 are in [the screenshot directory](2026-09-14-ai-fde-navigation/). They show the explanatory product page and workspace dropdown. Child screenshots show the same navigation above the engagement list.

- AI-FDE formatting, lint, TypeScript, and hosted synthetic production build pass.
- AI-FDE golden-path, internal-alpha, accessibility, and shell suites: 17 pass, including nested menu keyboard behavior, five viewport widths, 200% reflow, engagement reload/back/forward, zero console/page errors, and zero API requests.
- FDLC lint, TypeScript, unit tests, Vinext build, 27 rendered-HTML checks, and native Next production build pass.
- Exact-commit CI, immutable child Preview inspection, and the separate composed binding remain delivery gates until their results are recorded.

The browser qualification runner accepts `FDLC_BROWSER_PORT` so an existing task's server cannot supply the wrong artifact during parallel local work. No other task's server or checkout was changed.

## Boundaries

The standard external proxy, independent API/worker/storage boundaries, synthetic-only behavior, and disabled main auto-deploy guards remain intact. No Production release or live operational qualification is authorized or claimed by this change. The Guide's independently released header remains outside this child/root correction.
