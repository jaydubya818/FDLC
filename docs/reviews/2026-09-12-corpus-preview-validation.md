---
title: FDLC corpus preview validation
status: ready-for-local-review
date: 2026-09-12
branch: codex/corpus-integration-preview
base: origin/main@ff7b25f
---

# FDLC corpus preview validation

## Outcome

The corpus is integrated as a reversible, non-canonical preview. It is ready for Product Owner testing on `codex/corpus-integration-preview`; it is not approved for canonical route promotion or production deployment.

The implementation renders 157 manifest-backed documents and 95 allowlisted source artifacts without replacing an existing page. The preview is absent from primary navigation and the sitemap, carries `noindex` metadata, and is disallowed in `robots.txt`. Both Vinext and native Next browser suites pass at desktop and mobile widths.

## What shipped

- Version-controlled archive import with checksum, provenance, and publication classifications.
- Strict build-time front matter, route, link, fragment, schema/example, diagram-reference, prohibited-term, and stale-output verification.
- One shared route and heading contract for verification and rendering, including duplicate heading suffixes and `{#custom-id}` anchors.
- A generated catalog and document reader under `/corpus-preview/**`.
- Safe GitHub-flavored Markdown rendering without MDX or raw HTML execution.
- Strict, lazy Mermaid rendering with loading, source, and per-diagram error states.
- Manifest-only raw artifacts under `/corpus-artifacts/**` with `nosniff`, noindex, and real 404 behavior.
- URL-addressable catalog search and collection filters, preserved catalog-return state, contextual 404s, and JavaScript-disabled document reading.
- Progressive catalog disclosure: 24 of 157 cards initially, then 24 more per request. This replaced a 49,000-pixel initial mobile result page found during visual review.
- Generated taxonomy and semantic-decision registers so draft claims cannot be mistaken for approved canon.

## Corpus verification

Source: `docs/reviews/corpus-preview-verification.json`

| Check | Result |
|---|---:|
| Imported archive files | 277 |
| Routed documents | 157 |
| Routed words | 370,144 |
| JSON Schemas/examples | 19 / 19 |
| Mermaid sources | 33 |
| Duplicate or reserved document routes | 0 |
| Unresolved internal links/fragments | 0 |
| Verification errors | 0 |
| Editorial description-length warnings | 81 |
| Existing canonical collisions inventoried | 9 |
| Unique Mission Control references externally unverifiable here | 183 |

Archive SHA-256: `54583e8f18d3e474617b6d63b25ddac1c58ff196c8271a2dcb22f7f4a6e38a49`

Current normalized source digest: `80794d5aa50f29d59f094b764a9fd65e86e1670d09d1c74be83831c6f85435e3`

To verify Mission Control citations against a local checkout, run:

```bash
MC_REPO_PATH=/absolute/path/to/MissionControl npm run corpus:verify
```

That optional check fails closed for a missing or escaping path. The current report correctly labels those checks externally unverifiable; it does not count them as passes.

## Validation evidence

| Gate | Result | Evidence |
|---|---|---|
| Clean install | Pass | `npm ci`; 711 packages restored from lockfile |
| Production dependency audit | Pass | 0 production vulnerabilities |
| Corpus verification/stale output | Pass | 0 errors; generated JSON matches source digest |
| Unit suite | Pass | 39/39 |
| Lint | Pass | 0 errors |
| TypeScript | Pass | root and `packages/fab` |
| Vinext production build | Pass | all preview and artifact routes emitted |
| Vinext rendered HTML | Pass | 25/25 |
| Vinext corpus browser suite | Pass | 13/13 |
| Vinext whole-site browser regression | Pass | 52 checks across 21 flows and 15 links |
| Native Next webpack build/runtime | Pass | 279 pages generated; runtime 200/308/query/404/metadata smoke passed |
| Native Next corpus browser suite | Pass | 13/13 |
| Native Next whole-site browser regression | Pass | 52 checks across 21 flows and 15 links |
| Mermaid browser parsing | Pass | 33/33 source files in each runtime suite |
| Desktop/mobile accessibility | Pass | axe: 0 violations on catalog and long technical document at 1440px and 390px |
| JavaScript-disabled reading | Pass | document prose and diagram source available in both runtime suites |

The default Turbopack `npm run build:vercel` reaches compilation but cannot complete inside this managed environment because its PostCSS worker is denied an internal loopback bind (`EPERM`). Running with elevated sandbox permissions produces the same host restriction. The native Next webpack production build, runtime smoke, and browser suite all pass. `npm run build:vercel` remains unchanged and must be run once in a normal local shell or Vercel environment before merge approval.

The full audit still reports four high-severity development-only advisories in the pre-existing Cloudflare/Wrangler toolchain. The new Mermaid dependency initially added production advisories; it was pinned to 11.17.2 with `lodash-es` 4.18.1 overridden, returning the production audit to zero. Upgrade Cloudflare/Wrangler separately to keep this content branch's blast radius clear.

## Measured cost

- Imported source tree: 14 MB.
- Generated server corpus module: 5,315,069 bytes.
- Vinext output: 22 MB.
- Largest lazy Mermaid client chunks observed: approximately 425 KB and 647 KB minified.
- Catalog client input contains metadata only; document bodies remain server-side.
- Mermaid is dynamically imported only on pages that contain diagrams.

The centralized generated module is acceptable for this private review branch, but it should be split per collection or document before broad canonical publication if production traces show cold-start or build-memory regression.

## Remaining promotion blockers

These do not block local review or a preview-only merge. They do block treating the corpus as qualified canon:

1. Five semantic families remain open: Qualification Record IDs, security-remediation Factory Version IDs, first-activation authority, Attempt/Candidate suffix grammar, and D31 state vocabulary.
2. The 73 proposed taxonomy entries are dispositions, not qualifications: 53 candidates, 9 aliases, 10 needing evidence, and 1 specification artifact.
3. The 183 unique Mission Control references need verification against a named repository revision.
4. The nine current-route collisions need explicit preserve/merge/supersede decisions. The recommendation register currently favors preserving every bespoke entry experience and promoting deeper material selectively.
5. The 81 descriptions over 160 characters should be edited before public SEO metadata is derived from corpus front matter.

## Local review

The isolated worktree is:

```text
/Users/jaywest/Documents/ChatGPT/FDLC/.worktrees/fab-openrouter-ready/.worktrees/codex/corpus-integration-preview
```

From that directory:

```bash
npm ci
npm run corpus:verify
npm run test:unit
npm run lint
npm run typecheck
npm run build
node --test tests/rendered-html.test.mjs
npm run test:corpus-browser
npm run test:next
npm run test:corpus-browser:vercel
npm run build:vercel
```

For visual review:

```bash
npm run dev
```

Then inspect:

- `http://localhost:3000/corpus-preview`
- `http://localhost:3000/corpus-preview/framework`
- `http://localhost:3000/corpus-preview/architecture/verification`
- `http://localhost:3000/corpus-preview/start#builder`
- `http://localhost:3000/corpus-artifacts/corpus/specification/schemas/intent.schema.json`
- `http://localhost:3000/corpus-preview/not-a-real-document`
- `http://localhost:3000/start#factory-builder` to confirm the current interactive tool remains intact

The Vinext development command may choose a different open port; use the URL it prints.

## Recommendations

### Before merging this preview branch

1. Run `npm run build:vercel` in a normal local shell to close the one environment-specific gap.
2. Review one long architecture document, one tutorial, one pattern register, one schema, and `/start#builder` on desktop and mobile.
3. Confirm that a preview-only merge is desirable. Do not combine this approval with canonical route promotion.

### Next phase

1. Resolve the five semantic decisions and pin the Mission Control revision used for citation verification.
2. Reduce the 81 long descriptions and perform an editorial pass on the highest-traffic candidate pages.
3. Write a page-by-page cutover plan for the nine collisions. Preserve the current Start builder, five-minute walkthrough, maturity assessment, and visual landing pages.
4. Split generated document bodies if production profiling shows material memory or cold-start cost.
5. Add version/diff views and source-linked feedback only after repository ownership and corpus release governance are decided.
6. Publish canonical schema endpoints, `llms.txt`, and role-based reading paths only with an approved versioning and compatibility contract.

## Decision requested

After local testing, choose one of three bounded outcomes:

- merge the preview as an unadvertised review surface;
- request changes on this branch;
- decline the preview integration and retain the archive only.

Canonical route replacement remains a separate decision in every case.
