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

## Qualified UI source and immutable child

UI PR #45 merged as `c1f13fe45090cf23a480825fba298e3ae93881b4`, with the same tree as qualified PR head `065563d5feffb2efe8752603c7324acfcb10891c`. Exact PR CI passed: FDLC/Fab run `34912499254` and AI-FDE trust/contract/browser run `34912499238`, including the database/container gates skipped locally. Exact merged-tree unit checks also pass.

The final immutable child is `https://ai-hu09aqvzj-jaydubya818.vercel.app`, deployment `dpl_Gyrz6d2GxRA7TxsBSMq81C8DSH63`, built from that UI source. Its five-width browser suite passes with zero console/page errors and zero API requests, including deep-link reload and back/forward. Child Preview feedback injection was disabled because Vercel's toolbar violated the unchanged strict CSP. The initially built `ai-16njnpbau` deployment is superseded and must not be pinned.

The protected root Preview `https://fdlc-2gzlx983j-jaydubya818.vercel.app` passes actual rendering, single masthead, responsive `/deploy` screenshots and lifecycle infographic review with zero errors. Access was authenticated; anonymous access is not claimed.

Guide PR #34 synchronizes the shell and canonical snapshot. Its local native Next runtime and CI pass on initial source `9e75298`. A small follow-up enables explicit exact-main workflow dispatch. The group supports polyrepo branch routing; the binding branch uses the same name in both repositories so the composed Preview selects the updated Guide rather than the unchanged Production fallback. Production group routing is unchanged.

Both repositories now expose manual CI dispatch because no push-triggered run was emitted for the first UI merge. The final merged source must receive explicit exact-main qualification. Binding/composed acceptance and final exact-main evidence are recorded below only after completion.
