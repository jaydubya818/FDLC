# Factory Updates research — November 22, 2026

## Findings and applied changes

Production was `dpl_DM9AxDPQNH4cpsQrXPLJGzEfpoyU`, source
`9252a6687efdc21300fe09a8d3485793b09a08cd`, with ten entries and a November 5
review date. The feed is static source content, and no FDLC recurring task was
configured. The test's ten-entry maximum also prevented adding history indefinitely.

Added thirteen entries while retaining the previous ten. Corrected copy that claimed
all historical links were first-party, allowed the archive to grow, and made
reviewed resources and operator perspectives explicit. The feed itself records
the canonical links and summaries of these original sources:

- [Warp Learn](https://www.warp.dev/learn), including its introductory and factory-building unit outlines. No launch date was shown. Unit 3 was marked coming soon.
- [Kiro Crew conductor mode](https://kiro.dev/blog/conductor-mode/), November 20. Its engineering account includes failure analysis and a human escalation, rather than only a launch claim.
- [Gemini CLI 0.69.0](https://github.com/google-gemini/gemini-cli/releases/tag/v0.69.0), November 19.
- [Codex 0.170.0](https://github.com/openai/codex/releases/tag/rust-v0.170.0), November 18.
- [Factory's Azure/MXC announcement](https://factory.com/news/microsoft-collaboration), November 18. Deployment and containment claims remain attributed to Factory.
- [Vercel eve 1.0](https://vercel.com/blog/eve-is-now-generally-available), November 17.
- [Replit Missions](https://replit.com/blog/introducing-replit-missions), published November 17, updated November 19. Entry uses publication date.
- [GitHub/Microsoft MDASH](https://github.blog/open-source/maintainers/maintainers-dont-need-more-ai-bug-reports-they-need-fixes/), November 17. The source's bounded six-project results remain attributed.
- [Anthropic's evaluation guidance](https://www.anthropic.com/research/building-strong-safety-evaluations), November 13.
- [Cursor CLI release notes](https://prod.cursor.com/docs/release-notes), November 12 section.
- [AlphaProof Code](https://deepmind.google/blog/introducing-alphaproof-code/), November 10. Specification scope and trusted checking remain explicit.
- [8090 v0.60.0](https://docs.8090.ai/resources/changelog), November 10.
- [Jeffrey Lee-Chan's article](https://x.com/jleechan2015/status/2119218626293358612), November 7. Read in the browser after web retrieval returned 403. Labeled an operator perspective; its forecast is not a verified outcome.

## Cross-checking the factory debate

Also read [Factory's software-factory description](https://factory.com/news/software-factory)
(June 15), [Warp's workflow](https://docs.warp.dev/factories/how-factories-work/),
[Warp's self-improvement article](https://www.warp.dev/blog/engineering-self-improving-software-factories)
(August 26), Steve Yegge's [Fences, not Sandboxes](https://yegge.ai/essays/fences-not-sandboxes/)
(August 24) and [Wheelhouse account](https://yegge.ai/essays/the-shape-of-things-to-come/)
(August). These older pieces supply context; they are not new November launches.

Factory emphasizes integrated, model-independent feedback and organizational
learning. Warp exposes staged workflows, runtime controls and evaluation. Lee-Chan
and Yegge question the durability of reusable orchestration as models improve.
These are competing implementation arguments. FDLC's practical response is to
preserve organization-owned standards and independent evidence, and test whether
removing orchestration improves or preserves verified outcomes. This does not
justify weakening isolation or release controls.

No framework rewrite or new runtime feature follows solely from this debate.
The current update applies it through attributed coverage, concrete FDLC readings,
and a broader daily research watchlist. Future framework changes need specific
evidence of a gap and their own review.

## Limits

This is a targeted catch-up and representative leader review, not an exhaustive
survey of every leader or release. Older material is not relabeled as recent.
Performance anecdotes are not independent benchmarks. Daily research must keep
extending coverage and report access failures honestly.

## PR #86 reconciliation

Preserve all 23 entries from the already-published refresh, and add three distinct
items from PR #86: the November 12 official AI Engineer keynote reading edition,
Warp's November 5 review-bottleneck article, and its November 4 production-factory
article. The combined feed has 26 entries and retains its November 22 review date.
Warp Learn remains one reviewed resource rather than a duplicate launch item.

The new factory-engineering page adapts Warp's stack without prescribing a fixed
runtime architecture. Isolation does not grant authority for consequential actions;
evidence collection requires access controls, redaction, and retention limits.
Public performance figures stay attributed, and missing attribution definitions
are not filled in by inference. Responsive checks identified long source URLs in
the debate and benchmark sections; wrapping them prevents horizontal overflow
on mobile. The shared header switches to its compact menu before the extra
navigation link can clip the GitHub action. The existing browser gate now includes
the factory-engineering route and identifies the route if overflow recurs.

## Security qualification

The complete CI run passed both browser matrices but failed the unchanged high
severity audit gate on the existing React Server Components dependency. The
[React advisory](https://github.com/advisories/GHSA-xqc2-xf4c-x3h3) identifies
19.2.9 as the patched release on the existing 19.2 line. Update React, React DOM,
and react-server-dom-webpack from 19.2.8 to 19.2.9, and Next from 16.4.1 to the
16.4.6 patch release. These are supported patch updates rather than the major
versions proposed by a blanket force-fix. The lockfile changes are limited to
these packages and Next's own platform packages. The patched local audit reports
zero high or critical findings; two low and ten moderate findings remain for
separate maintenance. Repeat the full qualification on the patched candidate.
