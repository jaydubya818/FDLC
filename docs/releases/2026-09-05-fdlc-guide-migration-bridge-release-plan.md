# FDLC / Guide migration bridge release plan

Status: **QUALIFICATION IN PROGRESS — limited old-Guide exception approved.**

No Production authorization. No promotion, alias movement, environment/protection
change, remote branch push, PR creation or deployment has occurred in this task.

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

### New-Guide corrective engineering remains outstanding

The exact `7b9f00beda0eab41348c8650a61009c6ab630fbf` local native build fixes the
stack chapter's nested-anchor hydration error. Independent desktop/mobile,
direct/reload checks still reproduce the changelog IDs and chapter06's 572px
document width at a 390px viewport. Unique document-wide heading IDs and wrapping
of long inline code require source fixes and full requalification. These ordinary
engineering fixes are already within the task's authorization; they are not a
second permission request. They cannot repair the required immutable old artifact.

### Completed source checks and independent review

- Bridge unit tests: 33/33; rendered tests: 17/17; lint, typecheck, native Next
  webpack build and whitespace checks passed. Local Turbopack encountered a host
  process/port EPERM restriction; the ordinary Vercel compiler remains unqualified.
- Unchanged Guide standard checks: 62/62 unit tests; snapshot, links, editorial,
  lint, Vinext build, native build/smoke browser tests and typecheck passed. These
  narrower checks did not cover the newly reproduced ID/mobile defects.
- Architecture's page-alias and sitemap findings were fixed and re-reviewed.
  Source security and simplicity are GO within scope; documentation is GO as a
  NO-GO record. None of these reviews constitutes full release qualification.
- Mission Control diff is empty. No credential or `.vercel` artifacts were added.
- Final read-only alias verification still maps FDLC to `dpl_GvmTzMNUmpKt3825k69MUgL6YwTX`
  and Guide to `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur`.

## Scope and immutable baseline

This change is routing compatibility only. It does not change Guide content,
FDLC presentation, Mission Control, Production settings, protection, credentials,
or canonical aliases. No Production deployment may be promoted during this task.

| Role | Source SHA | Existing deployment |
| --- | --- | --- |
| Current FDLC / rollback | `e4112bb06333b8244c18fc4a9736b1f3c807bc78` | `dpl_GvmTzMNUmpKt3825k69MUgL6YwTX` |
| Current Guide / rollback | `87d3841f96353d03278311dfc7e7b2d25649a331` | `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` |
| Final FDLC source | `8057d1fd2c9aafaad309488aaa6038bd61b61e57` | `dpl_3citBEKomhN1hhtDk9QR1CZqF4Ru` (not yet recertified) |
| New Guide baseline source | `7b9f00beda0eab41348c8650a61009c6ab630fbf` | Corrective descendant and both build modes require separate qualification |

MFE group: `mfe_1we4N3uLnAPIkT2Gpgv2T4NJ5PO4`.
Final normalized configuration / Guide snapshot digest:
`e63f913563c1864feac38c7786e06d146892d34a4f0f74179999ff1d565e7e8b`.
Bridge normalized configuration digest:
`794d525585a7f491e520b1332b3347e85f88cb580db6ef46883c918ed6e8458f`.
Bridge source SHA and exact qualified deployments: pending, not approved.

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
| Bridge | UNPROVEN: old-Guide exception is approved, but routing/asset/browser qualification must still pass | UNPROVEN: standalone Guide ownership | UNSAFE: relative FDLC links conflict on Guide origin |
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
PR: pending. Keep unmerged: FDLC main autoassigns Production, and the Guide's
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

The bridge branch contains a locally tested source checkpoint.
It is not a qualified immutable release artifact. Preview/staged qualification,
exact candidate SHAs/IDs, final-pair acceptance and a release-ready PR remain
outstanding. Do not mistake implementation progress or source-security review
for migration approval.

## Release gate

Do not report `READY_FOR_MIGRATION_BRIDGE_PRODUCTION_APPROVAL` until all intended
forward and reverse states are SAFE, CI/Preview and independent reviews pass,
exact source/deployment IDs are recorded, and Production is reconfirmed unchanged.
The next authorization request must name the four promotions, every intermediate
acceptance gate, and the reverse artifact sequence; not vague permission to deploy.
