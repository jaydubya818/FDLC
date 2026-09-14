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

Mission Control and the Guide remain separate open-source projects. The Guide is composed into FDLC.ai through Vercel Microfrontends while retaining its own source, runtime, routes, and assets.

## Guide and Microfrontends

FDLC.ai is the umbrella experience and the default Microfrontends application. The [AI Software Factory Guide](https://github.com/jaydubya818/ai-software-factory-mastery) is a separate Next.js application that owns the canonical `/guide` namespace, including its chapters, Atlas, Reference, Glossary, Search, Mermaid rendering, and Guide-specific theme behavior.

The ownership boundary is explicit:

- This repository owns the FDLC global shell, all non-Guide routes, and the authoritative [`microfrontends.json`](microfrontends.json) configuration.
- The Guide repository owns Guide content and rendering, including every route under `/guide` and its Vercel-prefixed JavaScript and CSS assets.
- Vercel composes the two applications on the canonical FDLC.ai domain. Direct loads and reloads stay on the same public origin while requests and assets continue to resolve from the owning deployment.
- Compatibility routes such as `/docs`, `/visuals`, `/topics`, `/search`, and `/glossary` remain declared in the Microfrontends configuration only for the controlled legacy migration path.

The Guide does not fetch Microfrontends configuration dynamically during every build. It commits a generated, sanitized snapshot and manifest derived from this repository. Guide Preview and Production builds fail closed when that snapshot is absent, stale, modified, or does not match the independently trusted FDLC digest and source revision.

Treat an FDLC/Guide release as a qualified pair: verify the exact source revisions and deployments, preserve the previous pair as rollback targets, and run browser acceptance against the composed canonical domain before considering Production complete.

## AI-FDE — AI Factory Deployed Engineer

The [AI-FDE product](https://fdlc.ai/deploy) is the evidence-driven workspace for an accountable human Factory Deployed Engineer. AI-FDE discovers how work happens and produces a reviewable Factory Definition. The human FDE owns architecture, judgment, authority, adoption, and outcomes. Mission Control separately validates approved intent, qualifies immutable Factory Versions, and governs execution.

The engagement advances through three evidence-gated phases: **FDLC Readiness → FDLC Lighthouse → FDLC Scale**. Readiness establishes the baseline and selects a suitable first line; Lighthouse proves one bounded workflow; Scale expands only what the evidence supports. The organization keeps the factory line, evidence, reusable capabilities, operating playbook, and scale path.

The AWS qualification environment in account `083665737366` (`us-east-1`) and the Mission Control qualification deployment `calm-buffalo-854` are ready for controlled activation. FDLC.ai Production is qualified and healthy. Runtime images are pinned by immutable digest, runtime services remain scaled to zero, and no secret values are published.

**Phase 3 is dormant and has not been activated. No Factory Engineer workload or Bedrock model call has occurred.** Qualification readiness is not evidence of live workload execution, sustained customer operation, or fleet-scale reliability.

## Fab local engineering pilot

The independent [Fab package](packages/fab/README.md) is staged here for local review. It is an experimental CLI with its own build and qualification suite; the website does not import it. The [reuse audit and design](docs/fab/FAB-REUSE-AUDIT.md) explain the boundaries with Mission Control and Factory Engineer.

Fab remains **Experimental**. See the [Phase 3 qualification record](docs/fab/FAB-PHASE3-QUALIFICATION.md) for exact package identities, offline evidence and the remaining live/deployed gates. Run `npm run test:browser` after `npm run build` to repeat the site browser, mobile, accessibility, link and interactive-flow checks (install Chromium with `npx --no-install playwright install chromium`).

The existing Vercel/Next build has the same browser gate: run `npm run build:vercel`, then `npm run test:browser:vercel`. Both commands exercise local production artifacts and do not deploy a website. Reports identify their runtime and are kept separately under `output/playwright/site/` and `output/playwright/site-next/`.

## Shared global navigation

[`lib/global-navigation.ts`](lib/global-navigation.ts) is the authoritative desktop and mobile navigation definition for FDLC and the Guide. The Guide renders its own copy at the MFE boundary so the global shell remains stable without coupling the two runtimes at request time.

When changing global navigation, regenerate the Guide copy with `node site/scripts/sync-global-navigation.mjs --source=/path/to/FDLC` from the Guide repository. Run the same command with `--check` against the exact qualified FDLC source before releasing both applications. Guide-specific active states stay in the Guide header, but labels, destinations, ordering, and layout must remain synchronized across both deployments.
