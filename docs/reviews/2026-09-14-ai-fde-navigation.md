# AI-FDE explanation and engagement workspace navigation

## Product correction

The AI-FDE label opens `/deploy`, which explains the product, the accountable human FDE, and the Factory Definition handoff. Its adjacent dropdown contains **Engagement workspace**, linking to `/deploy/app`. The explanation page's primary action uses the same destination name.

Desktop and mobile use the same hierarchy. The independently built child receives the versioned FDLC shell through the existing generated contract. Global links remain same-origin document navigation across the proxy boundary. The workspace item, rather than the explanatory page, is current inside the child. Keyboard users can open the dropdown with Enter, Space, or arrow keys; Escape closes it and restores focus without closing the surrounding mobile menu.

## Review evidence

Local screenshots at 1440px, 1024px, and 390×844 are in [the screenshot directory](2026-09-14-ai-fde-navigation/). They show the explanatory product page and workspace dropdown. Child screenshots show the same navigation above the engagement list.

- AI-FDE formatting, lint, TypeScript, and hosted synthetic production build pass.
- AI-FDE golden-path, internal-alpha, accessibility, and shell suites: 17 pass, including nested menu keyboard behavior, five viewport widths, 200% reflow, engagement reload/back/forward, zero console/page errors, and zero API requests.
- FDLC lint, TypeScript, unit tests, Vinext build, 27 rendered-HTML checks, and native Next production build pass.
- FDLC browser qualification: 60 checks across 25 flows pass in both Vinext and native Next.

## Qualified UI and immutable child

[UI PR #51](https://github.com/jaydubya818/FDLC/pull/51) merged source `2543ee4ea2ffddebd1eb9ec8212f27ae8e6549bd` as `53017b83aa615b593207962f7d9c3ccde0beb988`; the trees are identical. Exact PR [FDLC/Fab CI](https://github.com/jaydubya818/FDLC/actions/runs/34925025806) and [AI-FDE trust/contract/browser CI](https://github.com/jaydubya818/FDLC/actions/runs/34925025808) passed.

Both exact-main gates passed on `53017b83aa615b593207962f7d9c3ccde0beb988`: [FDLC/Fab](https://github.com/jaydubya818/FDLC/actions/runs/34925351493) and [AI-FDE](https://github.com/jaydubya818/FDLC/actions/runs/34925351517).

The inspected child is `https://ai-of84ak7sr-jaydubya818.vercel.app`, deployment `dpl_5FfyMrXQr4FydCuV8cEH5yNGZRN3`. Its five-width shell suite passes, including keyboard dropdown behavior, engagement reload/back/forward, zero console/page errors, and zero API requests. The protected root UI Preview `https://fdlc-6dz52knts-jaydubya818.vercel.app/deploy` passes authenticated explanatory-page/menu inspection at 1440px, 1024px, and 390×844 with zero errors.

The separate binding changes both `/deploy/app` rewrites together to that immutable child. Rollback restores both rewrites to `https://ai-hu09aqvzj-jaydubya818.vercel.app`, deployment `dpl_Gyrz6d2GxRA7TxsBSMq81C8DSH63`. Binding CI, composed Preview checks, and exact-main results must be recorded before declaring delivery complete.

## Composed journey verified

The protected [binding Preview](https://fdlc-qkejscgde-jaydubya818.vercel.app/deploy), deployment `dpl_Cwn55ErYmgL3kDtuktjrjo9TZXVy`, was inspected at binding source `bd14d20380498e844ebd83483f7a7b35581b8338`. Authenticated browser checks pass at 1440px, 1024px, and 390×844: explanatory page → engagement workspace dropdown → engagement → hard refresh → list → browser back/forward → explanatory page. The workspace also passes 200% reflow. There is one FDLC masthead, zero console/page errors, and zero API requests. All 12 proxied child scripts match the pinned immutable child byte-for-byte.

[The composed report](2026-09-14-ai-fde-navigation/composed-report.json) and `composed-` screenshots record this result. The following documentation-only commit does not change the qualified routing or UI. [Binding PR #52](https://github.com/jaydubya818/FDLC/pull/52) is the acceptance ledger for final exact-head CI, the final Preview, and exact-main qualification links; merge and delivery remain gated on those results. Live Auth0 and operational Milestone C remain unqualified.

The browser qualification runner accepts `FDLC_BROWSER_PORT` so an existing task's server cannot supply the wrong artifact during parallel local work. No other task's server or checkout was changed.

## Boundaries

The standard external proxy, independent API/worker/storage boundaries, synthetic-only behavior, and disabled main auto-deploy guards remain intact. No Production release or live operational qualification is authorized or claimed by this change. The Guide's independently released header remains outside this child/root correction.
