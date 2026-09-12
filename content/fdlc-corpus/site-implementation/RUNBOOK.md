# Site-implementation runbook (phase 2 — not applied)

Per your decision ("Audit + full content corpus first"), no code was pushed to `FDLC-main` in this pass. This runbook is what phase 2 needs to do to turn `/home/claude/work/corpus` into the live site. It is deliberately a plan, not a diff dump — the corpus is 158 files and 380k words; hand-verifying a full Next.js ingestion pipeline without running the real build would be guessing, and guessing into a live repo is worse than handing you a checked plan.

## 1. Content ingestion

The corpus is plain Markdown + YAML front matter (schema in `AUTHOR-BRIEF.md`), already matching the shape `FDLC-main`'s existing `data/*.ts` files encode by hand. Two viable approaches, in order of effort:

- **A — MDX route per file (recommended).** Add `app/(canon)/[...slug]/page.tsx` that resolves a slug to a corpus file by its front-matter `path:` field, renders Markdown with `next-mdx-remote` or `@next/mdx`, and renders fenced ```mermaid blocks with the same Mermaid client component the site's existing diagrams use (check `app/architecture/page.tsx` for the current renderer before adding a second one). This preserves the corpus as the single source of truth — editing a `.md` file is editing the site.
- **B — Compile to `data/*.ts`.** Write a build-time script that parses each corpus file's front matter and body into the same object shapes `data/fdlc.ts`, `data/enterprise.ts`, etc. already use, and check in the generated files. Lower risk (fits the current architecture exactly) but creates a second copy of the content to keep in sync.

Recommendation: A, because the corpus's own cross-linking (`](/patterns/...)`) and diagram ids only stay correct if there is one copy.

## 2. Navigation

Current `lib/global-navigation.ts` exposes 2 primary links (Framework, Architecture) plus a Guide subnav and a secondary row. The corpus's IA is far deeper (framework/architecture/enterprise/specification/patterns/anti-patterns/guides/examples/tutorials/essays — 155 pages). Proposed top-level groups, preserving every existing route:

```
Framework      /framework, /framework/delivery-loop, /framework/factory-lifecycle,
               /framework/principles, /framework/maturity, /framework/builders,
               /framework/agents-skills-tools-harnesses
Architecture   /architecture, /architecture/routing, /architecture/factory-versioning,
               /architecture/qualification, /architecture/verification, /architecture/evidence,
               /architecture/authority, /architecture/context, /architecture/sandboxing,
               /architecture/observability, /architecture/economics, /architecture/learning,
               /architecture/security, /architecture/multi-factory, /architecture/transformation
Specification  /specification, /specification/conformance, /specification/schemas,
               /specification/v1/* (19 artifact pages)
Patterns       /patterns, /patterns/* (22), /patterns/proposed
Anti-patterns  /anti-patterns, /anti-patterns/* (24), /anti-patterns/proposed
Guides         /guides, /guides/* (10)
Examples       /examples, /examples/* (5 case studies)
Tutorials      /tutorials, /tutorials/* (15, Mission-Control-mapped)
Enterprise     /enterprise, /enterprise/reference-architecture, /enterprise/identity-tenancy,
               /enterprise/policy-governance, /enterprise/execution-fleet, /enterprise/model-gateway,
               /enterprise/organization, /enterprise/adoption
Essays         /essays, /essays/* (3 written of 36 catalogued)
```

Keep `/in-5-minutes` (now `/in-5-minutes`, content unchanged in intent but the corpus's `in-5-minutes.md` supersedes it — diff the two before replacing), `/manifesto`, `/start` (repointed to learning paths per canon §18.4 — see item 4), `/mission-control`, `/deploy`, `/maturity` (now framework/maturity.md is canonical; `/maturity` route should render it), `/benchmarks`, `/about`.

Do not remove `/services`, `/enterprise/audit-compliance`, `/enterprise/policy`, `/project/changelog` — the corpus links to all four (see `06-corpus-verification.md`) and none were part of this authoring pass's scope; confirm they still exist in the live tree and re-link, don't recreate.

## 3. Safe fixes queued (apply directly, low risk, no architecture decision needed)

1. Remove infrastructure identifiers from `app/deploy/fde-content.ts` / `README.md` if any remain (flagged in the original site audit; re-check against the current main branch before patching, since `FDLC-main` was a `codex/production-reliability` branch, not confirmed-current main, when staged).
2. Fix any remaining `/spec` links to `/specification` (the route was renamed at some point in `FDLC-main`'s history; confirm no stale internal links still use `/spec`).
3. `data/guide.ts`: "Forward-Deployed" → "Factory Deployed Engineer" if that terminology decision (canon-adjacent, not in `00-FDLC-CANON.md` itself — confirm with the FDE page owner before applying) is still wanted.
4. Route id `learning` → `learning-signal` wherever the artifact family enumeration is hard-coded, to match the canon's 19-artifact model (`Learning Signal`, not `Learning`).
5. `.gitignore`: add corpus build artifacts (`/tmp`, `*.pyc`, mermaid-cli render output) once ingestion tooling lands.
6. Operating-shift-03 wording: "The control plane becomes the control boundary." (canon §18.5) — apply to whichever `data/*.ts` currently states the old wording.
7. `data/dependency-modernization-example.ts`: re-key example instance ids to match `examples/dependency-factory.md`'s ids (both exist; confirm which is newer before treating either as source of truth).

None of these were applied to the live repo in this pass — they need a maintainer to confirm current main state first, since the local checkout used for research (`FDLC-main`) was a rebased feature branch, not a live pull of `origin/main`.

## 4. `/start` collision (canon §18.4, decided)

`/start` becomes the learning-paths entry point (Beginner/Practitioner/Architect/Enterprise/Expert). The existing Factory Definition builder tool moves to `/tools/factory-definition`. Update `lib/routing.ts` and `app/sitemap.ts` accordingly; add a redirect from the old `/start` builder deep link if one is bookmarked/indexed.

## 5. Known content gaps to close before or shortly after launch

See `06-corpus-verification.md` follow-ups: 73 proposed-but-unwritten patterns/anti-patterns, 33 of 36 catalogued essays unwritten, 3 example-id inconsistencies in the security/dependency worked examples, one canon bootstrap-clause gap (Factory Version first activation). None block publishing the corpus as-is — all are flagged in-page as "proposed" / "draft" status, which is itself part of the site's existing honesty discipline (Available/Experimental/Planned/Proposed ledger statuses), applied here to content maturity as well as capability claims.

## 6. Suggested order of operations

1. Confirm current `origin/main` state of `FDLC-main` (this pass worked from a rebased branch).
2. Stand up route A (MDX ingestion) behind a preview deployment; point it at a copy of `/home/claude/work/corpus`.
3. Diff-review `in-5-minutes.md`, `framework/*.md`, `architecture/*.md` against the live equivalents page-by-page (audit §8 preserve list has the specific concepts that must survive).
4. Wire navigation per §2 above.
5. Apply the 7 safe fixes in §3 after confirming each against current main.
6. Publish with all "proposed"/"draft" status pages visibly marked as such — do not silently upgrade their status.
7. Re-run `verify_corpus.py`-equivalent checks against the live route tree (internal links resolve against real Next.js routes, not just declared `path:` front matter) before removing the "draft" banner.

## What this pass did NOT produce (explicitly, so it isn't assumed done)

No Next.js code, no TypeScript data files, no unit tests, no working preview deployment. Two prior subagent dispatches assigned to build these were both cut off by the org's monthly API spend limit before writing any files. Rather than ship unverified generated TypeScript into a live repo's implementation, this runbook hands you the concrete plan instead — safer than a plausible-looking diff nobody ran `tsc` or `next build` against.
