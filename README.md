# FDLC.ai

The canonical public home of the Factory Development Lifecycle.

> The Factory Development Lifecycle is the process for designing, assembling, governing, operating, measuring, and continuously improving an AI software factory.

FDLC is the engineering discipline for the factory itself: the control system around agents, models, tools, people, policies, evidence, and workflows. Its standard is verified delivery, not merely generated code.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm install
npm run dev
```

The local site runs at `http://localhost:3000`.

## Quality checks

```bash
npm run typecheck
npm run lint
npm test
```

`npm test` runs unit coverage for the content model, maturity scoring, and factory definition; builds the production worker; and verifies the rendered HTML for every public route.

## Project shape

- `app/` — routes, components, metadata, sitemap, robots, and presentation
- `data/` — canonical FDLC, Guide, and Mission Control content models
- `app/in-5-minutes/` — the canonical worked scenario connecting the four system views without claiming unverified operating results
- `lib/` — scoring and factory-definition logic
- `docs/` — source audit, information architecture, content model, design system, implementation plan, capability matrix, and release checklist
- `tests/` — unit and rendered-route checks

Mission Control and the source Guide are separate open-source projects. This site links to them without importing their runtime systems or private material.

## Fab local engineering pilot

The independent [Fab package](packages/fab/README.md) is staged here for local review. It is an experimental CLI with its own build and qualification suite; the website does not import it. The [reuse audit and design](docs/fab/FAB-REUSE-AUDIT.md) explain the boundaries with Mission Control and Factory Engineer.

Fab remains **Experimental**. See the [Phase 3 qualification record](docs/fab/FAB-PHASE3-QUALIFICATION.md) for exact package identities, offline evidence and the remaining live/deployed gates. Run `npm run test:browser` after `npm run build` to repeat the site browser, mobile, accessibility, link and interactive-flow checks (install Chromium with `npx --no-install playwright install chromium`).

The existing Vercel/Next build has the same browser gate: run `npm run build:vercel`, then `npm run test:browser:vercel`. Both commands exercise local production artifacts and do not deploy a website. Reports identify their runtime and are kept separately under `output/playwright/site/` and `output/playwright/site-next/`.
