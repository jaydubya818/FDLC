# FDLC UX acceptance and unified AI-FDE shell

## Scope

Reconciles PR #45 with main `9528253`, preserving the education-first journey and the standard `/deploy/app` external proxy. The original dirty working directory is untouched. Production deployment remains disabled. AI-FDE remains independently deployed; no additional paid Microfrontends project is introduced.

## Resolved review findings

- YAML uses the existing serializer and round-trips reserved values and empty collections without changing types.
- Clipboard denial opens, focuses and selects the fallback. Format buttons use ordinary pressed-button semantics.
- Draft storage denial and malformed drafts do not break the builder.
- New maturity shares encode scores in the fragment, with legacy query restoration supported.
- The missing Mission Control fragment now targets its architecture section.
- The optional command palette is deferred.
- Main's `/deploy/app` integration and exact AI-FDE terminology are preserved; guessed sibling URLs and the stale demo fallback are removed.

## UI and content

One generated FDLC masthead covers the child list, engagement, authentication and error surfaces. Native same-origin links cross the base-path boundary. The operational rail contains engagement and stages; the compact app bar carries operator context. A byte-checked versioned contract mirrors the authoritative header, navigation, style tokens and logo without imports outside the child build root.

The governing lifecycle is explicit on the homepage, Framework and five-minute walkthrough:
**intent → planning → execution → evidence → verification → approval → release → outcomes → learning**.
Each stage has a plain-language technical explanation. Learning proposes changes through the same verification and approval controls. Separate diagrams on the builder and Mission Control explain the narrower Factory Definition → human approval → qualification → Factory Version handoff, without implying runtime activation.

Visual review corrected compressed mobile operator context and header reflow at 200% CSS zoom. Screenshots in `2026-09-14-ux-evidence/` record the synthetic local build at desktop, tablet and 390px mobile widths.

## Local evidence

- FDLC lint/typecheck, unit tests, Vinext build and 27 rendered-HTML checks pass.
- FDLC Vinext and native Next builds each pass 60 browser checks across 25 flows, including real exports, denied clipboard, blocked storage, shared-result restoration and fragment destinations.
- Fab contained tests pass.
- AI-FDE formatting, lint, TypeScript and fail-closed production build pass.
- AI-FDE golden path, internal alpha, accessibility and five-width shell suites: 17 pass. Mock partner handoff: 1 pass.
- Python Ruff, mypy and generated contract pass; pytest: 342 pass, 61 skipped without the isolated PostgreSQL environment. Full database/container trust qualification remains a CI gate.
- Guide companion: lint, 88 tests, link checks and reader browser pass. Native Next qualification and composed Preview acceptance are tracked separately until complete.

## Delivery gates still pending at source review

1. Exact-commit GitHub qualification and child Preview inspection.
2. Guide snapshot synchronization to committed FDLC source and composed Guide search/deep links.
3. Qualified UI merge and exact-main checks.
4. A separate immutable child binding PR, protected composed checks and exact-main qualification.

No production deployment or live Auth0/customer-data qualification is claimed. Existing rollback pair: FDLC `fdlc-5gm0p5x8s-jaydubya818.vercel.app` with child `ai-pvrsq6rnm-jaydubya818.vercel.app` (`dpl_GKGuLiaoyDhULK6rrfSj9o76nKrD`). Preserve both together.
