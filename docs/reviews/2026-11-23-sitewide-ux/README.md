# FDLC website and Guide UI qualification

Implementation tested November 23, 2026. Production and GitHub status checked November 24, 2026, Central time.

## 1. Executive summary

The website and Guide changes are committed and available together in a protected Vercel Preview. A returning builder user now keeps their place on refresh. A reader asking “what is a factory version” reaches the glossary definition first. The full crawl resolved 4,329 distinct internal destinations. Both implementation PRs passed their hosted checks and remain open as drafts at the time of this report. [Combined Preview](https://fdlc-en91kejmi-jaydubya818.vercel.app/start) · [Website PR](https://github.com/jaydubya818/FDLC/pull/92) · [Guide PR](https://github.com/jaydubya818/ai-software-factory-mastery/pull/50)

## 2. Route inventory

| Family | Addresses | Coverage |
|---|---:|---|
| Website | 18 | Includes the framework, architecture, enterprise, factory engineering, experiences, specification, public references and updates |
| Guide | 79 | Landing, chapters, search, glossary, topics, coverage and Atlas |
| Learning library | 159 | Index and 158 reference documents |
| Public workspace | 4 | Landing and three synthetic engagements |
| Redirects | 111 | 74 standalone Guide compatibility paths and 37 other aliases |
| Downloads and supporting resources | 208 | Four versioned ZIPs and 204 other referenced resources |
| Expected missing routes | 2 | One website and one Guide recovery page |
| **Total** | **581** | **468 successful responses, 111 permanent redirects and two expected 404s** |

The inventory combines both sitemaps, generated document catalogs, public resources, legacy routing tables, and destinations discovered in page bodies. Each of the 262 rendered pages, including the two recovery pages, had one main heading and zero measured horizontal page overflow at 390 pixels. Downloads, redirects and static resources received HTTP checks. [Route qualification matrix](route-qualification.csv)

## 3. Route-level audit

Each address has an audience, purpose, primary action, original composition, visual and interaction findings, accessibility observations, content density, performance coverage, recommended action and priority. The accompanying qualification matrix identifies the test origin, response, heading, internal destinations and additional sampled widths. [Audit matrix](route-audit.csv) · [Qualification matrix](route-qualification.csv)

## 4. Prioritized findings

| Priority | Visitor impact | Scope and evidence |
|---|---|---|
| P0 | Refresh could hide the builder introduction. Simulator controls were remote from the record being inspected. Guide definitions and section links could send readers to the wrong place. | Reproduced through the actual flows. Seven chapters and the coverage page shared six stale destinations. |
| P0 during Preview | Font arrival shifted the Guide landing page. WebKit pointer activation could leave Escape without a focused menu trigger. | Slow-font browser trace and mixed pointer/keyboard interaction. |
| P1 | Assessment levels were hard to distinguish, tool controls used inconsistent offsets, and chapter navigation was cumbersome on phones. | Shared components, responsive option cards and keyboard paths. |
| P2–P3 | Several homepage actions competed, technical reading lacked a clear return path, and repeated search work increased latency. | Homepage and completion states, chapter template and benchmark across the full index. |

## 5. Root causes, changes and verification

| Issue | Cause | Change | Observed result |
|---|---|---|---|
| Builder heading disappeared after reopening a completed draft | Restoring session state triggered the same focus effect as pressing Generate | Request result focus only on explicit generation. Use the masthead offset for intentional step and result navigation | At 390px the restored heading moved from y = −2,599 to y = 138. At 1440px it moved from −706 to 194. Both reloads settled at scroll position zero. |
| Result or hash target landed under the header | Native focus scrolling and separate fixed offsets positioned the section inconsistently | Focus without implicit scrolling, then align the section to the shared offset | Both the entry anchor and generated result settled 12px below the header at 390px and 1440px. |
| Inspection looked like forward progress | Timeline browsing changed the displayed record while execution controls were elsewhere | Show the actual next artifact beside the inspector, with links to submission, blocked decisions or the Lab as appropriate | Browser journeys reached a real blocked state, applied the correction and reached completion. Unit coverage retained separate verification and approval decisions. |
| Guide search returned an unrelated section | Common words, substring matches and repeated normalization distorted results and added work | Match whole tokens, ignore stopwords, prefer exact definitions and reuse normalized text for the loaded index | The glossary definition ranked first. “station” no longer matched “workstation” and a query of “the” produced zero results. |
| Guide deep links missed their sections | Chapter references retained earlier heading slugs | Correct the source links to existing canonical targets | Six broken destinations across eight pages before the change, zero unresolved internal destinations in the final crawl. |
| Guide page jumped when fonts finished loading | A late font swap changed the dimensions of already-visible content | Preload both licensed faces and use optional font display | The intermediate Preview recorded 0.1344 cumulative layout shift. The final Preview recorded zero both normally and with 400ms added font latency. |
| Escape could leave a mobile menu open in WebKit | Pointer activation did not reliably focus the menu trigger | Give the trigger focus when it is activated | Opening by pointer then dismissing with Escape passed in Chrome, WebKit and Firefox. |

[Measurements and browser checks](measurements.json) · [Affected link origins](route-summary.json) · [Interaction screenshots](screenshots.md#interaction-states)

## 6. Design system

Both applications use the existing paper and green palette, Nunito Sans for controls, and Source Serif 4 for editorial text. Shared masthead inner heights are 88, 76 and 72 pixels across breakpoints. Anchor clearance includes its border and a 12px gap. Focus outlines, disclosure spacing and 44px target sizing are shared where applicable. Technical tables and code retain local scrolling. The website implementation owns the shared shell, which the Guide and the public workspace synchronize through existing checks. [Design system](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/docs/design-system.md)

## 7. Navigation and architectural accuracy

The existing Guide, Try, Build and Implementations menus remain familiar. Guide search is reachable from the footer, the mobile menus use the same breakpoint, and visitors can move from the site to a chapter and back with the shared header. The homepage routes beginners through the worked example, simulator, definition and Lab. Long chapters offer a mobile contents disclosure and a return to the chapter start.

The framework still distinguishes the nine governing stages for a work item, the seven stages for changing the factory itself, the seven-step enterprise flow, and the eight-stage Guide teaching sequence. The six architecture areas describe capabilities. The simulator breaks one runtime example into eleven steps. Evidence, independent verification and release approval retain separate records. [Authoritative model descriptions](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/data/governing-lifecycle.ts)

## 8. Homepage

“Experience FDLC in 5 Minutes” is the primary first action. “Explore the Framework” serves readers who already know what they need. The SDLC comparison now sits with the engineering explanation. The chapter invitation lives in the reading section. The worked example, governing diagram, evidence boundaries and optional implementations remain available. [Homepage comparison](screenshots.md)

## 9. Interactive experiences

- **Builder.** The introduction groups the output, five steps, time estimate and tab-local privacy. The form begins at y = 828 instead of 1,256 on the phone fixture, and at 593 instead of 898 on desktop. On completion, Markdown is the primary export. Versioned JSON and YAML, import validation, clipboard recovery and restart remain available. The next action leads to the Reference Lab.
- **Simulator.** The inspector distinguishes reading a stage from producing its artifact, identifies the current record count, and returns the visitor to a decision or recovery when progression stops. It still describes a deterministic teaching run.
- **Maturity.** The eleven dimensions retain their scoring and share-link behavior. Each of the six choices now describes the evidence a team should have. The cards fit three, two or one per row as the available space changes. The specific single-word wrapping report did not reproduce on the original 390px fixture.
- **Reference Lab.** The download and its checksum share a manifest. The published 1.1.1 archive matched SHA-256 `9f55000711b14def7ede586961326db133f17f616a887f6ec76d941ea154d7b9`. All ten files matched the manifest. From a fresh extraction, all eight scenarios reached their expected dispositions and all five contract tests passed. The generated report identifies its operating domain as a local teaching fixture.
- **Reference implementations.** Mission Control remains optional. The enterprise proposal, workspace Preview, demonstrated capabilities, qualification and operational authorization retain their original meanings. Workspace testing used public synthetic engagements.

## 10. Guide

Readers can navigate suggested and ranked results by keyboard, retry an unavailable search index, and follow a result to the section containing their search terms. A mobile contents selection closes the disclosure and moves focus to the actual heading. Chapter paragraphs and lists use a maximum measure of 72ch. Breadcrumbs, related chapters, glossary anchors, Atlas diagrams, full-size viewing and text alternatives remain accessible from their existing locations. The Guide’s local link check covered 77 Markdown files. [Guide implementation](https://github.com/jaydubya818/ai-software-factory-mastery/pull/50)

## 11. Responsive layout

The suite exercised twelve surfaces at 1920, 1440, 1280, 1024, 900, 768, 390, 375 and 320 CSS pixels in three engines. All 324 combinations cleared the masthead, fit the heading text and stayed within the viewport. The twelve surfaces include both the introduction and the form on `/start`. The mobile journeys also exercised an 812 × 375 landscape viewport and 150% root text on seven routes. Actual 200% and 400% browser zoom passed on nine routes each, including reflow to 320 CSS pixels from a 1280px window. [Qualification measurements](measurements.json)

## 12. Accessibility

Keyboard journeys covered menu dismissal, visible focus, keyboard selection, mobile chapter anchors, diagram dialog dismissal and focus return, builder step transitions, export, and search recovery. Reduced-motion fixtures ran in all three engines. The site’s browser gate reported zero axe violations across 93 audited page and interaction states. The Guide’s strict run found zero serious or critical failing nodes on five routes in both light and dark modes. Screen-reader speech and physical assistive devices were outside the measured coverage. [Interaction evidence](screenshots.md#interaction-states)

## 13. Performance

Each hosted row summarizes three fresh desktop Chrome contexts. All eight sampled website and Guide routes recorded zero layout shift on the final previews. The following numbers are median largest contentful paint in milliseconds.

| Route | Production baseline | Preview |
|---|---:|---:|
| Homepage | 460 | 380 |
| Getting Started | 324 | 336 |
| Simulator | 368 | 420 |
| Maturity | 324 | 352 |
| Guide homepage | 380 | 428 |
| Guide search | 324 | 336 |
| Guide chapter | 512 | 568 |
| Atlas | 308 | 424 |

For 110 warmed queries over 74 documents and 2,116 sections, median search time fell from 18.68 to 3.52ms and p95 from 22.63 to 4.53ms. The first measured lookup, which includes index preparation, rose from 21.49 to 25.98ms. Entering the test question and displaying an active result took a median 78ms on public Guide search and 77ms on the direct Preview.

Preloading both faces raised the main website’s measured font transfer from 31,376 to 82,612 bytes. The Guide chapter transferred about 381KB of scripts. Each sampled Guide route accounted for about 526KB of images on both releases. The one home-to-example navigation sample was 46ms on production and 105ms on Preview. Public and protected hosts, cache state and network timing differ. These samples do not establish a field performance regression rate.

The data includes LCP, CLS, interaction event durations, timing across two animation frames, JS, CSS, font and image bytes, DOM readiness, load and navigation. The working-menu measurement includes an intentional wait before clicking and gives an upper bound on interactivity. Field INP and real-user Core Web Vitals remain unmeasured. [Performance measurements](performance.csv)

## 14. Screenshots

The gallery pairs 36 reviewed production captures with 36 candidate captures. It also includes nine interaction states, two browser zoom screenshots and six contact sheets. Repeated Chrome comparison against the committed visual reference passed on all 36 candidate views. The visual review prompted a change to the maturity card grid before the reference was accepted. [Screenshot gallery](screenshots.md)

## 15. Files changed

The website changes span 26 files, including the website components and styles, generated shared workspace shell, design guidance, regression tests and screenshot reference. The Guide changes span 22 files, including the reader components, search normalization and ranking, synchronized navigation, corrected chapter links and tests. The route and component changes are individually listed against their tested commits. [File inventory](source.md)

## 16. Commits

Four website commits culminate in `9e3cf0e9dd89249486af0b2579aa87b3c12d672f`. Four Guide commits culminate in `c21a4cc86bfad61d828cd120cad70a8a6bc9e536`. The final Guide commit checks both preloaded WOFF2 assets. [Commit history and source links](source.md)

## 17. Test results

| Scope | Result |
|---|---|
| FDLC | 90 unit tests, 31 rendered-HTML tests, site and Fab type checks, lint, native runtime checks, shared-shell contract and corpus browser tests passed. The native-site browser run passed 93 audited states, 32 flows and 125 link checks. |
| Guide | 90 tests passed. The reader browser run passed 12 checkpoints with zero console errors. Markdown links, editorial checks, global navigation sync, Microfrontends configuration and strict light/dark accessibility checks passed. |
| Hosted | The FDLC and Fab job, AI-FDE trust, contract and browser job, and Guide qualification job succeeded on the reviewed branches. |
| Reference Lab | Eight expected scenario outcomes and five passing contract tests from the extracted ZIP. |

[FDLC and Fab run](https://github.com/jaydubya818/FDLC/actions/runs/45257399263) · [AI-FDE run](https://github.com/jaydubya818/FDLC/actions/runs/45257398993) · [Guide run](https://github.com/jaydubya818/ai-software-factory-mastery/actions/runs/45257674375)

## 18. Browser and deployment qualification

| Engine | Geometry checks | Additional coverage |
|---|---:|---|
| Chrome 158.0.8127.36 on macOS | 108 | Reviewed desktop, tablet and phone comparisons. Hosted Preview queries and interactive controls. |
| WebKit 26.5 on macOS | 108 | Mobile menu pointer and Escape, diagram focus return, mobile contents, retry, completion, large text and cross-application links. |
| Firefox 153.0 on Linux | 108 | Same interaction fixtures in a disposable browser container. |

The combined Preview returned deployment `dpl_C9wihZzmUmTzh9fRXip1qHaYPii9` on `/start` and `dpl_9dHEzncskt5gDp5e4mTQye8MBFTu` on `/guide/search`. Both match Vercel’s metadata for the tested commits. A fresh browser on the parent hostname ranked the expected glossary link first in all three samples. [Combined site and Guide](https://fdlc-en91kejmi-jaydubya818.vercel.app/guide/search) · [Standalone Guide Preview](https://ai-software-factory-mastery-1005r40id-jaydubya818.vercel.app/guide) · [Public workspace Preview](https://ai-4z4nqgi24-jaydubya818.vercel.app/deploy/app)

## 19. Known limitations

The route crawl exercised all discovered local page-body destinations. The count excludes external sources and arbitrary user-supplied query or URL parameters. Nine-width layout coverage used representative templates. Physical iOS and Android, Windows, Edge, Safari.app and spoken VoiceOver, NVDA and TalkBack sessions were untested. WCAG 2.2 AA was the accessibility target. Formal certification and a first-time visitor usability study remain outside the measured coverage.

## 20. Remaining issues

The optional workspace landing recorded CLS of 0.1030 in all three initial Preview samples. On November 24 we repeated the experiment side by side. The live workspace and the exact Preview both registered 0.1030 on landing and zero on the sampled engagement. This remains an existing issue in the workspace. Guide image weight and the higher Atlas LCP sample also warrant attention on slower connections. [Measurements by route](performance.csv)

## 21. Production readiness

The exact website and Guide pair is ready for product-owner review. The tested site branch was cut before the separate November 24 research release. A production candidate must include that feed change, retain all 37 entries, pass the existing checks on the combined source and serve the intended Guide and workspace deployments. The brief reserves production publishing for explicit approval. [November 24 feed change](https://github.com/jaydubya818/FDLC/pull/93)

## 22. Deployment status at the November 24 check

| Surface | Public production commit | Reviewed UI candidate | GitHub status |
|---|---|---|---|
| FDLC website | `14d9f937` | `9e3cf0e9` | PR #92 open, draft, checks passed |
| Guide | `cdce4bf3` | `c21a4cc8` | PR #50 open, draft, checks passed |
| Public workspace | `b61bbece` | `9e3cf0e9` | Shared shell included in PR #92, checks passed |

Production served the November 24 feed on the same deployment as `/start`. The new builder introduction was absent there. Vercel returned the earlier Guide deployment on the live search route. The Preview URLs above use normal team sign-in. [Public website](https://fdlc.ai/start) · [Public Guide](https://fdlc.ai/guide/search) · [Live research feed](https://fdlc.ai/updates)
