# FDLC / Guide migration bridge release plan

Status: **BLOCKED — additional immutable-old-Guide keyboard exception requires explicit approval.**

No Production authorization. The dedicated non-main bridge branch has been
pushed, and its Preview deployment is READY with MFE configuration success.
Both dedicated PRs are open as drafts and remain unmerged. No Production promotion, canonical alias movement,
Production environment change, protection change or QA bypass has occurred.
Preview-scoped non-secret environment pins were added only to
`codex/fdlc-guide-migration-bridge`: Guide Preview approval, trusted digest/source
and standalone canonical; FDLC's origin override names the observed Guide branch
alias. No Production-scoped environment entries were added.

## New authority boundary: immutable old-Guide modal focus

Additional keyboard testing found that the unchanged current Guide's search
dialog does not contain focus. Four fresh cookie-free visits (1280px and 390×844,
two rounds each) reproduced eight escapes: Shift+Tab reaches the background
Search trigger and forward Tab reaches the background theme button while the
dialog remains open with `aria-modal="true"`. Escape still closes the dialog and
restores trigger focus. The exact old document identity and bare immutable asset
URLs were retained in `2026-09-05-migration-bridge-old-guide-focus-evidence.json`.

This is outside the previously approved hydration/ID/overflow exception. It must
not be silently accepted by the harness or called SAFE. The requested additional
decision is a temporary exception for this existing keyboard-focus defect only
while `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` remains active behind the bridge. No such
additional exception has been approved or implemented. All new/final Guide
candidates still require correct modal focus and complete requalification.

The repaired Guide has a local corrective checkpoint
`221766d7b990ff8015244de516f6a081f770c17c`, after anchor/mobile repair
`8cf00f9e1882fb01af58d22a95881d4833d39d06`. Independent source review, lint,
typecheck and whitespace checks passed for the two-file keyboard repair. Its
native/browser rebuild and hosted requalification remain pending; the keyboard
checkpoint has not been pushed or deployed. Production approval is not requested
at this boundary.

## Approved temporary baseline exception

The user explicitly approved the requested exception on 2026-09-05. It applies
only while the unchanged `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` is active, and only to
the pre-existing defects enumerated below. It does not authorize Production
promotion, settings changes, new regressions, or exceptions for repaired/new or
final Guide candidates. Every accepted defect remains visible in the evidence.

The browser harness requires the explicit `current-guide-2026-09-05` exception
identifier, edition `old`, and that exact deployment ID. It bounds duplicate IDs
to the existing changelog counts, mobile overflow to the five recorded paths and
maximum widths at 390px, and hydration to the existing React #418 route/count.
Network failures, asset ownership, new errors and larger regressions still fail.

Cookie-free Chromium acceptance against the exact current public Guide made
151 page visits across 73 unique paths, derived from its 66-document authoritative index. All
32 observed JS/CSS resources returned HTTP 200, and no unexpected network failures
occurred. The unchanged artifact nevertheless fails the requested quality gates:

| Existing failure | Reproduction |
| --- | --- |
| React hydration error #418 | `/docs/03-build/25-the-12-layer-production-ai-agent-stack`; repeated direct loads/reloads at desktop and 390×844 |
| Duplicate document IDs | `/docs/appendix/changelog`; `added` and `changed` each occur eight times |
| Horizontal overflow at 390px | Intent/specification (572px), quality contracts (572px), observability (416px), architecture communication (495px), capability/workflow map (393px) |

Independent reproduction confirmed hydration and duplicate IDs in two rounds,
desktop/mobile, direct/reload: eight visits per affected route. The old Markdown
renderer wraps linked headings in another anchor, causing invalid nested anchors
and hydration recovery. Repeated changelog headings generate repeated IDs.

These are existing Guide output defects, not failures that a routing-only FDLC
bridge can repair. The strict requirements "use unchanged current Guide artifact"
and "zero hydration failures / duplicate IDs / overflow" cannot both be certified.
The approved temporary exception resolves that baseline conflict without altering
the immutable artifact. It expires when the repaired Guide replaces the old Guide.
The ban on Production changes remains in force until separately authorized.

Durable, sanitized evidence is retained alongside this plan in
`2026-09-05-migration-bridge-baseline-evidence.json` and
`2026-09-05-migration-bridge-independent-evidence.json`.
The full primary record includes the browser's expected custom-404 console line
as an initial harness false positive; its exact URL/status have been verified,
and the harness now classifies only that expected 404 separately. It does not
explain or excuse the hydration, duplicate-ID or overflow failures.

### New-Guide corrections implemented; review and requalification pending

The exact `7b9f00beda0eab41348c8650a61009c6ab630fbf` local native build fixes the
stack chapter's nested-anchor hydration error. Independent desktop/mobile,
direct/reload checks reproduced the remaining changelog IDs and chapter06's 572px
document width at a 390px viewport. The isolated corrective source now uses one
document-wide heading-ID allocator for rendering, TOC and search, preserving first
anchors and avoiding suffix collisions. A targeted inline-code wrapping rule
preserves preformatted-code and Mermaid scrolling. No Guide content, Mission
Control source, snapshot, MFE prefix/configuration, gates or environment files were
changed.

The nine-file repair is in
`/tmp/guide-bridge-compat-qualification.eO34aY/repo/.worktrees/codex/fdlc-guide-bridge-compat-source`.
Its first corrective SHA is `8cf00f9e1882fb01af58d22a95881d4833d39d06`, with
independent architecture/security/simplicity review PASS. The later two-file
keyboard checkpoint and pending runtime gates are recorded above. Full
bridge/new-Guide acceptance is not certified. Passing
source checks do not certify that mixed-version state. These authorized fixes do
not alter the immutable old Guide or extend its temporary exception to a new
candidate.

### Completed source checks and independent review

- Bridge unit tests: 64/64 (including strict network-evidence tests); earlier
  rendered tests: 17/17; lint, typecheck, native Next
  webpack build and whitespace checks passed. Local Turbopack encountered a host
  process/port EPERM restriction. The subsequent git-backed bridge Preview build
  completed and reports READY/MFE success; full hosted-state qualification is
  still pending.
- Unchanged Guide standard checks: 62/62 unit tests; snapshot, links, editorial,
  lint, Vinext build, native build/smoke browser tests and typecheck passed. These
  narrower checks did not cover the newly reproduced ID/mobile defects.
- Repaired Guide source: 66/66 tests passed, including collision cases,
  corpus-wide duplicate-ID and search-anchor checks. Native Next webpack build
  generated 81/81 pages. Native browser checks passed for duplicate headings,
  chapter06 direct load/reload at 390×844, pre/Mermaid scrolling, hydration,
  console/page/asset errors, search, theme persistence and custom 404. Vinext
  build, lint, standalone typecheck, local links, editorial integrity, snapshot
  validation and whitespace checks passed. The final standalone typecheck ran
  after native generation, avoiding competing Vinext-generated `.next` types;
  `next-env.d.ts` remains unchanged.
- Architecture's page-alias and sitemap findings were fixed and re-reviewed.
  Prior bridge-source security and simplicity reviews are GO within scope; the
  earlier documentation review approved the bounded NO-GO record. Repaired-Guide
  independent source reviews pass; updated release-record review remains pending. None of
  these reviews constitutes full release qualification.
- Mission Control diff is empty. No credential or `.vercel` artifacts were added.
- The 2026-09-05 19:19 UTC read-only Production verification maps FDLC to
  `dpl_GvmTzMNUmpKt3825k69MUgL6YwTX` / `e4112bb06333b8244c18fc4a9736b1f3c807bc78`
  and Guide to `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` /
  `87d3841f96353d03278311dfc7e7b2d25649a331`. Reverification at qualification
  completion remains required.

## Scope and immutable baseline

The FDLC bridge is routing compatibility only; the separate Guide repair is
limited to heading-anchor correctness and inline-code wrapping. Neither changes
Guide content, FDLC presentation, Mission Control, Production settings, protection,
credentials, or canonical aliases. No Production deployment may be promoted during
this task.

| Role | Source SHA | Existing deployment |
| --- | --- | --- |
| Current FDLC / rollback | `e4112bb06333b8244c18fc4a9736b1f3c807bc78` | `dpl_GvmTzMNUmpKt3825k69MUgL6YwTX` |
| Current Guide / rollback | `87d3841f96353d03278311dfc7e7b2d25649a331` | `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` |
| Bridge Preview checkpoint | `982c5626a301792d00accf1d05d23327b6296067` | `dpl_7UcCC1vE5YScr3eMYZL1fPfWACft` — READY/MFE success, not full release qualification |
| Final FDLC source | `8057d1fd2c9aafaad309488aaa6038bd61b61e57` | `dpl_3citBEKomhN1hhtDk9QR1CZqF4Ru` (not yet recertified) |
| New Guide baseline source | `7b9f00beda0eab41348c8650a61009c6ab630fbf` | Corrective descendant and both build modes require separate qualification |

MFE group: `mfe_1we4N3uLnAPIkT2Gpgv2T4NJ5PO4`.
Final normalized configuration / Guide snapshot digest:
`e63f913563c1864feac38c7786e06d146892d34a4f0f74179999ff1d565e7e8b`.
Bridge normalized configuration digest:
`794d525585a7f491e520b1332b3347e85f88cb580db6ef46883c918ed6e8458f`.
Bridge Preview URL: `https://fdlc-jm35xg5ma-jaydubya818.vercel.app`.
The checkpoint source/deployment above is recorded, but exact fully qualified
forward/reverse candidate pairs remain pending and are not approved.

## Why another sequential attempt is unsafe

The prior Guide-first cutover returned HTTP 200 at canonical `/guide`, but served
old FDLC HTML and assets. Old FDLC had no MFE routing substrate. The Guide was
rolled back in approximately 8.2 seconds; FDLC was never promoted. The immutable
failure record is `docs/releases/2026-09-05T175444Z-public-cutover.md` in the
release workspace. A successful HTTP status is not ownership proof.

## Alternatives and chosen topology

| Alternative | Disposition | Reason |
| --- | --- | --- |
| A. Compose old Guide directly under a bridge FDLC origin | Rejected | Old Guide uses `/` for Guide home and `/architecture` for its own explorer; these conflict with FDLC destinations. A local direct-composition spike also captured an RSC module error before browser fallback. |
| B. Guide first with old FDLC unchanged | Rejected | Repeats the production-proven routing failure. A standalone-compatible Guide alone cannot install FDLC's routing substrate. |
| C. Temporary custom reverse proxy / HTML rewriting | Rejected | Introduces a second routing implementation, response rewriting, asset/header/cache risks, and new rollback state. |
| D. Two-step FDLC bridge, then final native MFE composition | Selected with host isolation | Introduces native routing while keeping the old Guide on its original origin. |
| E. Simultaneous promotion or version/session-based routing | Rejected | No demonstrated atomic multi-project promotion; session/referrer routing cannot establish deterministic anonymous ownership. |

The bridge uses the supported Vercel MFE host flag and catch-all child route.
Guide-host requests go to the Guide application, including root, architecture,
assets and unknown-page handling. FDLC-host requests remain FDLC-owned, except
explicit Guide entry routes that temporarily redirect to the standalone Guide.
No HTML/RSC rewriting or Guide chapter copies are introduced.

The repaired Guide descendant of source `7b9f00b…` needs two build configurations:

- **Guide-compatible:** standalone canonical origin, absolute FDLC navigation,
  legacy-host retirement disabled. The source default provides this mode.
- **Guide-final:** canonical `https://www.fdlc.ai`, with the exact legacy-host
  retirement configuration to be qualified and recorded before release approval.

This extra artifact prevents the relative FDLC navigation in the final Guide
configuration from resolving back to Guide while host isolation is active.

## Compatibility matrix

`SAFE` requires the complete evidence below. Expected behavior is not certification.

| FDLC | Current Guide | Guide-compatible (new source) | Guide-final (new source) |
| --- | --- | --- | --- |
| Current | Baseline with explicitly approved old-Guide exceptions; no composition change | UNSAFE for target composition | UNSAFE: observed old FDLC fallback |
| Bridge | BLOCKED / UNPROVEN: earlier suites passed approved exceptions, but expanded keyboard coverage found an additional unapproved old-artifact defect | UNPROVEN: initial repaired Preview composes correctly; keyboard repair runtime/full hosted requalification pending | UNSAFE: relative FDLC links conflict on Guide origin |
| Final | UNSAFE: old root-relative links and asset ownership | UNPROVEN: composed Guide with standalone canonical during bounded transition | UNPROVEN: intended final composed authority |

For each intended state, qualification must record landing and all authoritative
chapters, direct loads/reloads, client navigation, JS/CSS attribution and prefix,
search, Mermaid, theme persistence, custom 404, summary/legacy redirects,
canonical URLs/sitemaps/metadata, desktop and 390×844, header/footer, navigation
both ways, one main landmark, duplicate IDs, overflow, browser/page errors and
runtime logs. Mission Control is regression-tested without changing its source.

## Ownership contract

| Surface | Bridge on FDLC host | Bridge on Guide host | Final FDLC |
| --- | --- | --- | --- |
| `/`, `/architecture`, primary FDLC routes | FDLC | Guide's own root/explorer semantics | FDLC; legacy Guide-host retirement handled explicitly |
| `/guide`, `/guide/*` | Temporary 307 to standalone Guide | Guide | Guide via native MFE |
| Six FDLC summary slugs | Temporary redirect to authoritative old `/docs/…` chapter, also supported by new Guide | Guide | New Guide's authoritative redirects |
| `/docs/*`, namespaced chapter and Guide tool page aliases | Temporary redirect through old page aliases supported by both Guide generations | Guide; no re-normalization that could loop new routes | New Guide's native redirect contract |
| Old `/_next/static/immutable/*` | FDLC namespace; never blanket hijacked | Old Guide | Not an accepted new Guide asset namespace |
| New `/vc-ap-dd2962/_next/*` | Native SDK application prefix | New Guide | New Guide |
| Unknown `/guide/*` | Redirect then Guide custom 404 | Guide custom 404 | Guide custom 404 |
| Other unknown URLs | FDLC 404 | Guide 404 | FDLC 404 unless a documented legacy Guide route |

Cross-origin redirects are GET/HEAD only, temporary and non-cacheable. Only `q`
values on search routes survive a cross-origin redirect; other query parameters
are dropped. Other methods on FDLC-host Guide entries return 405, not shadow
FDLC content or a forwarded request body. Bare FDLC public assets remain owned by
FDLC. Old and new Guide asset namespaces are version-specific on the Guide host,
not interchangeable aliases. Production has a fixed Guide origin. Preview origin overrides are
restricted to team-qualified Guide deployment hosts; explicit local overrides
are loopback-only and forbidden on Vercel.

## Configuration authority and fail-closed contract

FDLC remains the routing authority. The bridge configuration has its own exact
semantic digest; the final digest is not reused. Bridge build validation must
reject missing, modified, stale, ambiguous inline, or conflicting configuration.

The repaired new Guide continues consuming its unchanged committed sanitized final
snapshot. Its digest is not falsely changed to match the bridge. Compatibility
requires the same child application identity and asset prefix, and functional
proof under both root configurations. If that compatibility cannot be proven,
the pair remains UNPROVEN; validators must not be weakened to make it pass.
No build dynamically fetches a configuration from FDLC.

## Exact state graph and rollback

Proposed states; **none may be executed in Production until qualified and
explicitly authorized with exact deployment IDs**:

1. Current FDLC + current Guide.
2. Bridge FDLC + current Guide.
3. Bridge FDLC + Guide-compatible.
4. Final FDLC + Guide-compatible.
5. Final FDLC + Guide-final.

With the baseline exception approved, the topology remains proposed until proven. Forward order:
bridge FDLC, Guide-compatible, final FDLC, Guide-final.
Rollback reverses the state graph: Guide-final → Guide-compatible **first**,
then final FDLC → bridge FDLC, then Guide-compatible → current Guide, then
bridge FDLC → current FDLC. Never place Guide-final behind bridge FDLC, or new
Guide behind current FDLC as an attempted composed state.

Each mixed-version window lasts only for its acceptance gate. Do not progress on
HTTP status alone. On failure stop, capture ownership/assets/browser/log evidence,
and reverse to the immediately preceding qualified state. Reuse immutable
qualified artifacts; no ad hoc patch or rebuild is authorized during cutover.

## Qualification and evidence limits

Completed native local evidence:

- `/tmp/fdlc-migration-bridge.2CP43B/bridge-old-native/acceptance.json` reports
  `PASS_WITH_APPROVED_OLD_GUIDE_BASELINE_EXCEPTIONS`: 1,531 checks, 151 visits,
  eight exact accepted baseline exceptions and no unexpected failures. All 32/32
  observed Guide JS/CSS assets are byte-identical to the exact old-Guide baseline.
  The run finished at 19:22:34 UTC on 2026-09-05.
- `/tmp/fdlc-migration-bridge.2CP43B/fdlc-regression-old-guide-qualified/fdlc-acceptance.json`
  reports PASS: 4,061 checks and 84 visits across all 13 FDLC routes, including
  Mission Control tabs/capabilities and full desktop/390×844 regression checks.
  There were no unexpected errors; four preload warnings and two expected
  custom-404 console responses remain recorded. The run finished at 19:31:26 UTC
  on 2026-09-05.

These runs used native local MFE routing. Asset bytes are evidence of agreement
with the old baseline, not independent proof of Vercel's Production-current
selector. Immutable deployment/config metadata, hosted mixed-state acceptance
and recent runtime logs remain separate gates. The FDLC suite's old-Guide return
check uses browser Back: the unchanged old Guide has no FDLC-home link, so it does
not certify a nonexistent navigation control. Preview READY/MFE success proves
the recorded Preview build/config state, not the full compatibility matrix or
anonymous Production behavior. The new Guide full bridge run has no recorded
passing result yet.

Requirements that must be complete for each qualified candidate/state:

- Run deterministic host, route, redirect privacy, assets and missing/stale-config
  tests; lint, typecheck, unit/rendered tests, native Next and Vercel-style builds.
- Run cookie-free real-browser acceptance with error listeners retained across
  document navigation. Distinguish anonymous behavior from protected Preview
  diagnostics. Do not create QA bypasses or alter protection.
- Prove current Guide against its exact active artifact, not a local substitute.
- Use native local MFE routing for repeatable mixed-version tests and supported
  git-branch Preview composition for every exposable state. Local routing is not
  proof of Vercel's Production-current selector; document that residual limit.
- Every composed Guide JS/CSS response must have successful status, expected
  prefix and independently established deployment identity; no FDLC fallback.
- Inspect MFE deployment/config status for success and absence of `no_config`.
- Check recent runtime logs and exact immutable source/deployment metadata.
- Require independent architecture, simplicity, security and documentation GO.
- Verify Production aliases, environment/protection settings and rollback
  targets remain unchanged at completion; verify no credentials or `.vercel`
  artifacts enter the changeset.

## PR and lifecycle

Dedicated branch: `codex/fdlc-guide-migration-bridge`, based on current FDLC main.
PR: [FDLC #12](https://github.com/jaydubya818/FDLC/pull/12), draft.
Guide repair: [Guide #12](https://github.com/jaydubya818/ai-software-factory-mastery/pull/12),
draft stacked on the previously qualified `7b9f00b…` branch to isolate the repair.
Keep unmerged: FDLC main autoassigns Production, and the Guide's
companion documentation project also autoassigns Production on main. No merge
can be treated as source-only under the current project policy.

Introduce the bridge only under a later exact Production approval. Its supported
window is current Guide and new Guide-compatible, not arbitrary future Guide
revisions. Final FDLC removes the adapter after Guide-compatible is qualified;
the subsequent Guide-final artifact completes canonical authority transfer.
Retain bridge/Guide-compatible immutable deployments as rollback dependencies
for the release observation window. A later explicit cleanup release may retire
them once rollback to this migration is no longer required. Do not leave the
adapter on the final source branch or add permanent feature flags for it.

The bridge branch contains the pushed source checkpoint
`982c5626a301792d00accf1d05d23327b6296067` and its READY Preview
`dpl_7UcCC1vE5YScr3eMYZL1fPfWACft`. It is not a fully qualified migration release.
Full hosted/staged qualification, the repaired Guide's exact source/deployment
IDs, final-pair and reverse-state acceptance, independent reviews, runtime logs,
final Production reconfirmation and a release-ready PR remain outstanding.
Do not mistake local passing suites, a READY Preview or source-security review
for migration approval. The current blocked record and sanitized focus evidence
are also retained in the main release workspace.

## Release gate

Do not report `READY_FOR_MIGRATION_BRIDGE_PRODUCTION_APPROVAL` until all intended
forward and reverse states are SAFE, CI/Preview and independent reviews pass,
exact source/deployment IDs are recorded, and Production is reconfirmed unchanged.
The next authorization request must name the four promotions, every intermediate
acceptance gate, and the reverse artifact sequence; not vague permission to deploy.
