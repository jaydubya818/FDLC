# FDLC.ai

The canonical public home of the Factory Development Lifecycle: an open framework for discovering, designing, assembling, validating, deploying, operating, and improving AI software factories under continuous governance, security, observability, and measurement.

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
- `app/examples/` — bounded worked scenarios that connect the four system views without claiming unverified operating results
- `lib/` — scoring and factory-definition logic
- `docs/` — source audit, information architecture, content model, design system, implementation plan, capability matrix, and release checklist
- `tests/` — unit and rendered-route checks

Mission Control and the source Guide are separate open-source projects. This site links to them without importing their runtime systems or private material.
