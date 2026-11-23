# Factory Updates research for November 23, 2026

The morning review covered November 16 through 13:57 UTC on November 23, including the seven-day overlap. The preceding publication already showed November 23 as the review date. Four additions bring the feed from 29 to 33 entries. Their dates below are the source publication or revision dates.

## Additions

| Published | Finding | Primary evidence |
| --- | --- | --- |
| Nov 22 | Alibaba's GitFlic and Gerrit examples could post findings and still report success after a review failed. Version 1.14.1 preserves the failure status. This concerns the two example integrations. | [Release](https://github.com/alibaba/open-code-review/releases/tag/v1.14.1) · [Maintainer change and test cases](https://github.com/alibaba/open-code-review/pull/2032) |
| Nov 20 | Codex 0.171.0 fixes an event-ordering error. Its regression test delivers a previous turn's completion while the current turn is waiting for approval and checks that the request survives. | [Release](https://github.com/openai/codex/releases/tag/rust-v0.171.0) · [Change and regression test](https://github.com/openai/codex/pull/61801) |
| Nov 19 | Warp's release corrects skill selection for runs on managed factory branches. The implementation checks out the requested definition commit before setup and fails if that revision is missing. | [Dated changelog](https://docs.warp.dev/changelog/2026#20261119-v0202611180817) · [Implementation](https://github.com/warpdotdev/warp/pull/16890) |
| Nov 17 | The fifth AgentLens revision links its public benchmark and SDK. The reported 10.7% applies to passing runs within the authors' 47-task evaluation subset. The result was already in the October revision. | [November paper](https://arxiv.org/abs/2605.12925v5) · [October paper](https://arxiv.org/abs/2605.12925v4) · [Research repository](https://github.com/agentlens-framework/agentlens) |

## Other sources and limits

- Warp's course and Jeffrey Lee-Chan's argument for a thinner orchestration layer remain in the archive. X blocked direct retrieval. The public article preview confirmed the author and title. [Warp Learn](https://www.warp.dev/learn) · [Lee-Chan's article](https://x.com/jleechan2015/status/2119218626293358612)
- Kiro's engineering account pairs offline scores with user feedback. Claude Code added timing metrics for self-hosted runners. These are supporting examples for interpreting runs. Lauren Tan's November 11 talk falls outside this review window. [Kiro](https://kiro.dev/blog/1m-evals-lessons/) · [Claude Code 2.1.330](https://github.com/anthropics/claude-code/releases/tag/v2.1.330) · [Tan's talk](https://ai.engineer/code/2026/talks/lauren-tan)
- Factory's Azure collaboration and Replit Missions already have dated entries. GitHub's November billing clarification updates an October announcement. 8090's November 16 release covers work-order status labels and background project copying. [Factory](https://factory.com/news/microsoft-collaboration) · [Replit](https://replit.com/blog/introducing-replit-missions) · [GitHub](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/) · [8090](https://docs.8090.ai/resources/changelog#version-0-61-0)
- Also checked the public indexes from Cursor, Vercel, DeepMind, Antigravity, Tessl and Steve Yegge. This review samples public material. Vendor release notes establish what maintainers reported. The FDLC implications are editorial judgments. [Cursor](https://cursor.com/changelog) · [Vercel](https://vercel.com/changelog) · [DeepMind](https://deepmind.google/blog/) · [Antigravity](https://antigravity.google/docs/changelog?tab=cli) · [Tessl](https://tessl.io/blog) · [Yegge](https://yegge.ai/)
