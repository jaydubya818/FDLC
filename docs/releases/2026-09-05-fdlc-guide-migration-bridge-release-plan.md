# FDLC / Guide migration bridge release plan

Status: **QUALIFICATION IN PROGRESS — four exact old-Guide keyboard exceptions approved.**

## Latest continuation checkpoint (2026-09-05)

This section supersedes the older checkpoint descriptions below, which retain
their original source/evidence identities. It is not release readiness.

### Completed native cold-state matrix; retained asset gate remains NO_GO

The repaired Guide source is frozen at
`efd23059007cf2050170a3653bfe3a831c9f245b`. The final-mode native build is
`M3uvKwkz2yBQZr40WMlEa`; compatible mode is `Qgs5YFZpmCGXA3Ue1DJwx`.
Frozen final FDLC remains `8057d1fd2c9aafaad309488aaa6038bd61b61e57`,
build `VeM0Vohi4DVXXJl7Q4F-7`. No application changes accompanied this
qualification continuation.

| Native composition | Full Guide | Keyboard | FDLC | Discovery | Exception policy |
| --- | --- | --- | --- | --- | --- |
| Bridge + repaired compatible | 3,222 checks / 291 visits PASS | 2,660 / 16 PASS | 4,068 / 84 PASS | 2,381 PASS | None |
| Final + repaired compatible | 3,222 / 291 PASS | 2,660 / 16 PASS | 4,072 / 84 PASS | 1,545 PASS | None |
| Final + repaired final | 3,222 / 291 PASS | 2,660 / 16 PASS | 4,072 / 84 PASS | 1,545 PASS | None |

These are cold-state native results, not SAFE labels for the complete migration
graph. Final/final evidence: `final-final-efd-full`,
`final-final-efd-focus`, `efd2305-fdlc-final-final-full`,
and `discovery-final-final-efd2305`. Exact clean source/build/HTML attestation
and 28/28 captured final Guide asset hashes match. Its discovery pass includes
832 GET/HEAD responses, 71 SEO routes, 144 anchors and 207 diagrams. Twenty
strict axe audits retain 40 incomplete entries; separately recorded manual
checks close the identified classes without claiming blanket accessibility
certification. No new-Guide keyboard or historical exception applies.

The corrected retained-browser harness uses actual visible article links,
normal unforced clicks, real search inputs, unchanged browser contexts and
exact saved asset URL/body hashes. Its SHA-256 is
`149249e3cfdfb74a4795b43a1770259119a9edcb9305147d4b7f9be7a0271248`.
A real native final-FDLC → bridge-FDLC → final-FDLC switch passed in both
directions with compatible Guide unchanged: eight retained page observations
per phase, 23 saved assets resolving 200 with identical bytes, no failed checks
or unexpected browser errors. The bounded intermediate record is
`efd2305-native-article-transitions/middle-edge-qualified-before-guide-switch.json`.

The subsequent compatible → final Guide build switch is **NO_GO**:
22 exact previously captured JavaScript URLs returned 404. All eight retained
document/navigation/direct/reload observations passed; CSS remained 200 with
identical bytes. The asset failures are not waived, ignored or rewritten as
PASS. Full preserved evidence is
`efd2305-native-article-transitions/transitions.json`. One local Next server
was replaced by another build; local asset URLs have no deployment parameter.
That observation does not establish Vercel's deployed-asset retention behavior.
No custom asset copying, synthetic proxy, URL rewriting or cache-busting
workaround is authorized or used.

The independently repeated final → compatible native Guide switch also
remains **NO_GO**, with exactly 22 saved final JavaScript URLs returning 404.
All eight retained page observations pass the correct compatible `/docs` and
`/search` contract, including hashes/query, H1, theme, navigation and reload;
there are zero browser-console, page-error or unexpected network events.
Evidence: `efd2305-native-guide-reverse-correct-contract/transitions.json`
(SHA-256 `6767e1fbb0cafabc251dc20a7b03a0b48f94633491944788c4cd8135174ec80c`).
The initial reverse run incorrectly expected the final namespace after rollback;
its 20 URL-fixture failures plus 22 asset failures remain preserved separately
at `efd2305-native-guide-reverse-transition`. Only command expectations were
corrected after source review; no application/harness waiver was added.
Independent physical build comparison confirms that the missing saved JS paths
are absent from the replacement build while the shared CSS is byte-identical.

Final independent QA-only review is GO: 113/113 unit tests, lint, compiler,
configuration validation, both harness syntax checks and diff checks pass.
An incidental Next type-generation import was restored exactly; the initial
source-guard failure is preserved and the restored-source run passes with all
reviewed hashes unchanged. Evidence: `efd2305-final-qa-checks/review.md` and
`efd2305-final-qa-checks/restored-source-checks/summary.json`.


The complete forward/reverse graph remains unqualified. Supported hosted
retained-session transitions and exact old/new asset resolution are required.
Native flagged standalone-host normalization also remains NOT_EXPOSED;
bounded authenticated Preview navigation does prove actual chapter and
architecture normalization, but is not a substitute for full hosted acceptance.
Production-target staging remains a separate unresolved platform mechanism.

The prior rejected branch-scoped Preview environment additions remain a real
permission gate. No new pins or protection changes were made. Explicit
Preview-only settings authority is still required for the two final
qualification branch pairs. Production, canonical aliases and both Draft PR
merge states remain unchanged; no Production approval is requested.


### Final/compatible native checkpoint and fresh bridge Preview

The reviewed QA/docs checkpoint was published on the existing non-main bridge
branch at `9aacb5d69206d91efe48f34b5766017aab782fbb`. Application/configuration
behavior remains unchanged from bridge `982c562`. Its exact Preview is READY:
`dpl_G8oVD1R3t1oFWB4NbGnVN7uFNdDK`. Actual browser navigation from that FDLC
Preview's Guide header anchor reaches Guide `dpl_4z6cLFMLHqtgW3fL9tApJYFChZsy`
at `/guide`; all nine observed DOM managed references name that Guide deployment.
This does not replace full hosted asset-body/route/transition qualification.
Provider/CI readback at 22:21 UTC confirms unchanged Production, aliases,
settings, protection and environment metadata, both PRs Draft/unmerged, and
successful Vercel checks. Exact report:
`9aacb5d-provider-ci-readback-2026-09-05T22-21-16-021Z.json`.

The native intermediate final-FDLC `8057d1f` + Guide-compatible `efd2305` now
passes cold-state qualification: Guide 3,222 checks / 291 visits, keyboard
2,660 / 16, and FDLC 4,072 / 84. All 32 Guide managed body hashes match the
running clean Guide build. Discovery passes 1,545 checks, 832 GET/HEAD responses,
71 SEO routes, 144 moved anchors, and all 207 diagrams; manual review separately
closes retained accessibility incomplete classes. No old exceptions apply.
Evidence: `final-compatible-efd-full`, `final-compatible-efd-focus`,
`efd2305-fdlc-final-compatible-source-oracle`, and
`discovery-final-compatible-efd2305` under the existing temporary evidence root.

Two harness defects were found and preserved, not relabeled as passes. The
initial FDLC/final fixture expected the bridge's 12 public capability disclosures;
independent source review verifies frozen final `8057d1f` already contains 13
(7 qualified / 4 bounded / 2 missing). Only the edition-specific QA oracle was
corrected. No Mission Control or frozen FDLC application source was changed.
The first warm transition completed both desktop contexts but selected a mobile
link inside a closed disclosure: a layout rectangle alone was not visibility.
Two independent normal-click reproductions establish that opening the disclosure
makes the link work; the harness is being tightened and actual transitions must
be rerun. An earlier capture-only run is NOT_RUN. Search capture now checks the
actual input and records URL `q` separately; the existing input does not initialize
from `q`, and no such behavior is claimed. Warm graph/hosted/final-final gates
remain open. No Production authorization is requested.

### Repaired-source checkpoint: `efd23059007cf2050170a3653bfe3a831c9f245b`

The later source checkpoint supersedes the in-progress `17ebd6e` description
below. Compatible URL repairs and six minimal CSS declarations are committed in
`b1982e81360ddeef6b6e0f3a0a45a9056f73e741`; `efd2305` only corrects two runtime
test assertions to accept valid relative Location headers while retaining exact
origin/path expectations. Both isolated Guide worktrees are clean.

- Compatible source/build qualification: all ten checks passed, including
  74 unit tests, native 81-page build and the 16-context keyboard lifecycle.
  Build ID: `Qgs5YFZpmCGXA3Ue1DJwx`. Evidence:
  `guide-efd2305-compatible-source-checks/summary.json`.
- Final www/legacy-enabled native build: seven qualification steps passed;
  build ID `M3uvKwkz2yBQZr40WMlEa`. Evidence:
  `guide-efd2305-final-native/qualification-summary.json`. This is not yet full
  composed final-state or rollback qualification.
- Exact compatible Preview: `dpl_4z6cLFMLHqtgW3fL9tApJYFChZsy`, source `efd2305`.
  Authenticated browser inspection confirmed namespace chapter navigation
  normalizes to the same Guide Preview host's `/docs/*` URL, then follows the
  next relative chapter link correctly. All ten observed DOM JS/CSS references
  carry this deployment ID and `/vc-ap-dd2962/_next/`. This bounded hosted check
  is not full route, asset-body, anonymous or transition acceptance.
- Independent source/security/simplicity and runtime-harness reviews are GO.
  Reviewed 45-file source digest:
  `d96346a5224966144b26cb207fcfcb60052e0104280bda249b6ecffa4700c2e6`.
  CSS digest:
  `03c069ce21a59e03557cf8204c7768f7fa6f2ab566a61d5c78225c1790e03283`.
- Initial fresh composed runs retain their original NO_GO evidence: all route,
  keyboard and FDLC assertions passed except successful `/docs/*` speculative
  Flight-response cancellations, outside the test classifier's prior path scope.
  Independent stationary desktop/mobile reproduction established both exact
  prefetch-header shapes, successful response headers, fixed URL/timeOrigin and
  working real navigation/reload. Only nonempty safe `/docs/<slug>` paths were
  added to the classifier. All 26 original negative guards were preserved and
  repeated for compatible paths; full unit suite is 109/109. No navigation,
  asset, HTTP, accessibility or old-artifact exception was broadened. Fresh
  full suites are running in new evidence directories; prior failures stay intact.
- Native flagged-host diagnosis: 48 repeated GET/HEAD responses confirm that
  SDK 2.4 rewrites the flagged Guide hop to `localhost:3024`. Native composed
  standalone normalization is therefore `NOT_EXPOSED`, never PASS. Raw Guide
  307/no-store checks and actual hosted normalization remain separate required
  gates. Evidence: `native-flag-hop-diagnosis/findings.md` and `observations.json`.
  No forwarded-host trust, custom headers or topology workaround was added.

The branch-scoped Preview environment authorization and local Convex rotation
coordination requests remain unanswered. Neither was inferred from a generic
instruction to continue. Unaffected engineering proceeds; Production is not
authorized and no release-readiness disposition is claimed.

Fresh repaired bridge/new results (22:10–22:15 UTC): Guide 3,222 checks / 291
visits, FDLC 4,068 / 84, keyboard 2,660 / 16, all PASS without exceptions.
Guide managed assets: 32 successful body hashes; keyboard restoration and
containment pass for every invoker. Discovery: 2,381 checks / 1,250 GET/HEAD
responses, 71 SEO pages, 144 moved anchors and 207 SVGs across 47 diagram pages,
zero failures. Twenty strict axe audits retain their incomplete entries; separate
manual evidence closes the identified contrast, link-cue and conditional-popup
classes. Native transport NOT_EXPOSED and hosted transition gates remain open.
Evidence directories: `efd2305-bridge-compatible-full-fresh`,
`efd2305-fdlc-bridge-compatible-reviewed`,
`efd2305-bridge-compatible-focus-fresh`, and
`discovery-bridge-new-efd2305-native-scoped`. Full bridge unit/config/lint/types
checks also passed (109 unit tests). Production/settings/aliases reconfirmed
unchanged at 22:14 UTC; both current PR heads report successful Vercel checks.

- The four-ID old keyboard gate now independently verifies live immutable
  deployment/project/alias identity and managed-asset hashes before every accepted
  exception. Fresh evidence at `approved-four-old-search-identity-v2/search-focus-acceptance.json`
  records 1,620 checks / 16 visits, 176 explicit non-PASS known entries
  (64 containment, 64 shortcut close, 32 wrong Escape invoker, 16 closed Escape),
  and zero unapproved errors. Independent security/simplicity review and 73 bridge
  unit tests passed. Each exception still expires outside exact bridge/old.
- Fresh old route/asset acceptance: 1,532 checks / 151 visits, eight narrowly
  approved non-keyboard baseline entries, 32 immutable JS/CSS hashes and no
  unexpected failures. FDLC/old regression: 4,062 checks / 84 visits. Full suite
  results are combined with the separate live identity gate; a CLI deployment
  argument alone is not identity evidence.
- Published new Guide keyboard checkpoint:
  `17ebd6e32deb2ef53b99dee9489aaca0c8c9d6ae`, Preview
  `dpl_ATbgSMiRTB4gXXAM3bHtunPCwd85`. Native bridge/new route suite passed
  3,222 checks / 291 visits with 27 Guide JS/CSS hashes; FDLC/new regression
  4,068 checks / 84 visits; new keyboard lifecycle 2,660 checks / 16 visits,
  all without exceptions. Ten source/build/runtime checks passed.
- The broader discovery/manual audit nevertheless found ordinary new-candidate
  defects. Six minimal CSS declaration changes repair link identification and
  theme contrast. Compatible standalone page URLs are being corrected to remain
  valid when rolled back to old Guide: relative old `/docs/*` and tool paths,
  reused repaired components, with the architecture alias temporarily normalized
  only on verified standalone hosts. Final `/guide/*` behavior is retained. No
  new environment flags, dynamic configuration fetch, asset-prefix change or
  topology change is introduced. The source is not frozen; the next exact SHA
  must be built and fully requalified. Earlier passes do not certify these edits.
- The single compatible architecture navigation href remains
  `/guide/architecture` to avoid colliding with FDLC's own `/architecture`.
  Standalone navigation/new-tab resolution must reach `/architecture` before its
  actual page URL is persisted. An unvisited copied alias is not promised to
  work on the immutable old Guide. Retained-session/asset transition evidence
  remains a separate required gate, not inferred from cold page checks.
- Exact unchanged final FDLC `8057d1fd2c9aafaad309488aaa6038bd61b61e57` was
  published to two non-main Preview qualification refs:
  `codex/fdlc-guide-migration-final-compat` and
  `codex/fdlc-guide-migration-final`. No merge or Production deployment occurred.
  Auto-review rejected adding a branch-scoped Preview environment pin as a
  project-settings mutation. No pin was added. Explicit authority for these
  Preview-only pins was requested; native/source work continues. Do not bypass
  that rejection or use the unsupported Production staging recipe.
- Production/settings reconfirmation at 21:35:17–21:35:36 UTC still maps FDLC to
  `dpl_GvmTzMNUmpKt3825k69MUgL6YwTX` / `e4112bb06333b8244c18fc4a9736b1f3c807bc78`
  and Guide to `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` /
  `87d3841f96353d03278311dfc7e7b2d25649a331`. Existing old FDLC still reports
  `no_config`; bridge Preview reports config success. No claim is made that
  unchanged old Production has already acquired the migration configuration.
  SSO/settings are unchanged, with zero FDLC and one pre-existing Guide bypass
  entry. None was created/read/used/revoked. Both PRs are Draft and unmerged;
  remote checks are green at their published checkpoints, not yet at future edits.
- Local MissionControl secret rotation remains separately required before reuse.
  The safe incident record is `2026-09-05-migration-bridge-secret-hygiene.md` in
  the main release workspace. Scoped scanning found zero exact matches across
  5,106 units / 670,520,381 bytes, and zero structural OCR candidates in 825
  rasters. Skipped dataless files, incomplete main history and transcript retention
  are explicitly recorded; do not overstate coverage. No backend reuse occurred.

The native evidence directories above live under
`/tmp/fdlc-migration-bridge.2CP43B/`. Full supported hosted/final/reverse
qualification, source freeze, fresh CI/reviews, asset identity/runtime logs and
final Production reconfirmation remain outstanding. No state is upgraded to SAFE
solely from this progress checkpoint. No Production approval is requested yet.

No Production authorization. The dedicated non-main bridge branch has been
pushed, and its Preview deployment is READY with MFE configuration success.
Both dedicated PRs are open as drafts and remain unmerged. No Production promotion, canonical alias movement,
Production environment change, protection change or QA bypass has occurred.
Preview-scoped non-secret environment pins were added only to
`codex/fdlc-guide-migration-bridge`: Guide Preview approval, trusted digest/source
and standalone canonical; FDLC's origin override names the observed Guide branch
alias. No Production-scoped environment entries were added.

## Approved exception: OLD_GUIDE_SEARCH_FOCUS_TRAP

Additional keyboard testing found that the unchanged current Guide's search
dialog does not contain focus. Four fresh cookie-free visits (1280px and 390×844,
two rounds each) reproduced eight escapes: Shift+Tab reaches the background
Search trigger and forward Tab reaches the background theme button while the
dialog remains open with `aria-modal="true"`. Escape still closes the dialog and
restores trigger focus. The exact old document identity and bare immutable asset
URLs were retained in `2026-09-05-migration-bridge-old-guide-focus-evidence.json`.

The user subsequently approved this separately and explicitly. Its ID is
`OLD_GUIDE_SEARCH_FOCUS_TRAP`; classification is `PRE_EXISTING / IMMUTABLE ARTIFACT`;
reproduction is 8/8. The only allowed state is bridge FDLC + old Guide
`dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur`. Record the test as
`KNOWN_EXCEPTION / ACCEPTED_TEMPORARILY`, never PASS or IGNORED. This does not
cover another dialog or any other accessibility defect. It expires immediately
when migration leaves bridge/old or old Guide is no longer active. All new/final
Guide candidates and future releases are NOT EXEMPT and require correct modal
focus and complete requalification.

If a later exact Production release is authorized, record bridge/old start,
bridge/old end and exception active duration, keeping the window as short as
operationally practical. Those timestamps and duration are currently not
applicable: no bridge Production window has begun. This exception authorizes
neither merge nor Production deployment/promotion, aliases or settings changes.

The user separately approved the three additional historical behaviors on
2026-09-05 in decision `7650fc66-d297-4617-9754-b0f597fb0511`. The four exceptions
remain distinct:

| Exception ID | Behavior | Reproduction |
| --- | --- | --- |
| `OLD_GUIDE_SEARCH_FOCUS_TRAP` | Tab/Shift+Tab escapes the open search dialog | Original 8/8; complete lifecycle sweep 64/64 |
| `OLD_GUIDE_SHORTCUT_CLOSE_FOCUS_RESTORE` | Cmd/Ctrl+K closes without restoring the actual invoker | 64/64 |
| `OLD_GUIDE_ESCAPE_WRONG_INVOKER_RESTORE` | Escape after shortcut opening from another control restores Search instead | 32/32 |
| `OLD_GUIDE_CLOSED_ESCAPE_FOCUS_INTERFERENCE` | Escape moves focus when search is already closed | 16/16 |

Each applies ONLY to bridge FDLC + old Guide
`dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur`, source
`87d3841f96353d03278311dfc7e7b2d25649a331`. The three newly approved behaviors are
classified `PRE_EXISTING / IMMUTABLE OLD ARTIFACT`; the original focus-trap
classification remains `PRE_EXISTING / IMMUTABLE ARTIFACT`. Every observed
exception is `KNOWN_EXCEPTION / ACCEPTED_TEMPORARILY`, with `pass: false`;
none may be PASS, IGNORED or a generic keyboard waiver.

Start condition: bridge FDLC is active with that exact old Guide and identity is
verified. Expiration: immediately when the migration leaves bridge/old or that
Guide artifact changes. Production activation/deactivation/duration are currently
N/A; no bridge/old Production window exists. New, Guide-compatible, Guide-final
and future Guide releases are NOT EXEMPT. No other dialog, accessibility behavior,
network/asset/identity failure or new regression is covered.

Before accepting any keyboard exception, the browser harness must independently
verify live authenticated Guide project/alias/deployment identity and browser
managed-asset body hashes against the pinned immutable baseline. A deployment
argument alone is insufficient. Missing/stale/mismatched identity fails closed;
a changed identity invalidates the exception classification.

Historical raw evidence remains unchanged in
`2026-09-05-migration-bridge-keyboard-lifecycle-evidence.json` and
`2026-09-05-migration-bridge-old-guide-focus-evidence.json`. The historical 112
FAIL records describe the pre-approval decision; they are not rewritten into
passes. A fresh identity-gated run is required for the new four-ID acceptance.

The repaired new Guide's last clean checkpoint at the start of this continuation
is `016a6e6b45f40745c54c8a71858a78e2008fa6b3`, after
`221766d7b990ff8015244de516f6a081f770c17c` and
`8cf00f9e1882fb01af58d22a95881d4833d39d06`. It passed 16 native keyboard/mouse
cases and all ten source/build/runtime commands, including 66 tests and the native
81-page build, with independent architecture/security/simplicity review. The
permanent regression is being expanded to explicitly cover Search-trigger,
theme-control and another stable control as shortcut invokers. Determine the
exact final SHA after that change; do not qualify an assumed checkpoint.

Full bridge/new, final/compatible, final/final, reverse-state and supported hosted
qualification remain required. No old-artifact exception applies to those new
Guide candidates. Source fixes and Preview qualification are authorized; merge,
Production deployment/promotion, canonical aliases, project settings, protection
and QA bypasses are not authorized.

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

### New-Guide corrections implemented; full mixed-state/hosted requalification pending

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
keyboard repair's native runtime pass and pending hosted gates are recorded above. Full
bridge/new-Guide acceptance is not certified. Passing
source checks do not certify that mixed-version state. These authorized fixes do
not alter the immutable old Guide or extend its temporary exception to a new
candidate.

### Completed source checks and independent review

- Bridge unit tests: 68/68 (including strict network-evidence and exception-scope tests); earlier
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
  independent source reviews and the prior bounded NO_GO release-record review pass;
  the newly approved exception policy and final matrix require updated review. None of
  these reviews constitutes full release qualification.
- Mission Control diff is empty. No credential or `.vercel` artifacts were added.
- The 2026-09-05 20:26:26–20:26:53 UTC read-only Production verification maps FDLC to
  `dpl_GvmTzMNUmpKt3825k69MUgL6YwTX` / `e4112bb06333b8244c18fc4a9736b1f3c807bc78`
  and Guide to `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` /
  `87d3841f96353d03278311dfc7e7b2d25649a331`. Reverification at qualification
  completion remains required.

## Scope and immutable baseline

The FDLC bridge is routing compatibility only; the separate Guide repair is
limited to heading-anchor correctness, inline-code wrapping and search keyboard
focus correctness with regression coverage. Neither changes
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
| Current | Unchanged baseline with historical defects; three additional focus failures now recorded | UNSAFE for target composition | UNSAFE: observed old FDLC fallback |
| Bridge | QUALIFICATION IN PROGRESS: four explicit keyboard exceptions plus exact historical baseline exceptions; every other gate and verified identity must pass | UNPROVEN: repaired keyboard native matrix passes without exceptions; complete mixed-state/hosted requalification pending | UNSAFE: relative FDLC links conflict on Guide origin |
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

- The refreshed old-Guide full run at
  `/tmp/fdlc-migration-bridge.2CP43B/bridge-old-approved-refresh/acceptance.json`
  completed at 20:07:39 UTC with 1,532 checks, 151 visits, eight approved baseline
  entries, no unexpected network failures and 32/32 Guide JS/CSS hashes matching
  the immutable baseline. This suite does not cover the complete search lifecycle.
  The earlier separate lifecycle NO_GO is historical; a fresh identity-gated run
  must apply the newly approved four-ID policy before bridge/old is qualified.
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

The current paired hosted checkpoint is FDLC
`dpl_GYsajDzvwdN52HkApSK12SmUkA7A` at `982c5626a301792d00accf1d05d23327b6296067`
and Guide `dpl_EYYQaUg7BAcUhVVtQTzxMjFCJgLN` at
`8cf00f9e1882fb01af58d22a95881d4833d39d06`. Both are READY; the observed composed
Guide DOM names the expected prefixed assets and Guide deployment. This is not
qualification of the later local keyboard repair. Both PRs remain Draft and
unmerged. The remote checks at these published SHAs are green Vercel statuses;
no GitHub Actions runs were returned. All local checkpoint SHAs, full-suite and
hosted evidence must be reconciled before any readiness declaration.

Read-only protection review found unchanged SSO, zero FDLC automation-bypass
entries and one pre-existing Guide automation-bypass entry. No bypass was created,
read, used or revoked during this qualification; do not claim all project-wide
bypasses are revoked. No Production environment entries or settings changes were
introduced. No credentials or `.vercel` artifacts were added to either changeset.

Future Production-target staging also has an unresolved platform constraint,
separate from the current keyboard decision. Installed CLI 50.35.0 sends persisted
`projectSettings` even with `--skip-domain`; that flag only avoids domain
promotion. The public deployment API does not document the proposed per-deployment
environment/no-alias fields. Do not execute the earlier CLI staging recipe or
invent API fields. A supported no-settings-change procedure or separately
enumerated user authorization is required before future Production staging.
This is not a reason to change the approved Preview workflow. See
`2026-09-05-migration-bridge-platform-boundary.md` for the read-only evidence and
official documentation.

## Release gate

Do not report `READY_FOR_MIGRATION_BRIDGE_PRODUCTION_APPROVAL` until all intended
forward and reverse states are SAFE, CI/Preview and independent reviews pass,
exact source/deployment IDs are recorded, and Production is reconfirmed unchanged.
Any future Production authorization request must name the four promotions, every intermediate
acceptance gate, and the reverse artifact sequence; not vague permission to deploy.
