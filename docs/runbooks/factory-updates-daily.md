# Factory Updates daily maintenance

The feed at `https://fdlc.ai/updates` is maintained in `data/factory-updates.ts`.
It is compiled into the site; editing a file or merging source does not update production.
The initial review stopped on November 5, 2026. No recurring FDLC maintenance task
was configured when inspected on November 22. The old test also capped the feed
at ten entries. Preserve the archive as new entries are added.

## Research scope

Review daily at 08:00 America/Chicago. Cover the interval since the last completed
research record, with a seven-day overlap for late discoveries. Prioritize material
changes to delivery workflows over model launch coverage or corporate news.

| Source | What to follow |
| --- | --- |
| [Warp Learn](https://www.warp.dev/learn), [Warp docs](https://docs.warp.dev/factories/how-factories-work/), and Varoon Kodithala | Factory education, definitions as code, verification, scorers, feedback loops |
| [Factory](https://factory.com/news/software-factory), Matan Grinberg and Eno Reyes | Droid harnesses, validation, model independence, organizational learning |
| [OpenAI Codex releases](https://github.com/openai/codex/releases), official Codex engineering guidance | Harnesses, permissions, delegation, evals and operational reliability |
| [Anthropic engineering](https://www.anthropic.com/engineering), [Claude Code](https://github.com/anthropics/claude-code), Boris Cherny | Context, skills, long-running agents, verification and harness simplification |
| [Cursor releases](https://cursor.com/changelog), [CLI notes](https://prod.cursor.com/docs/release-notes) | Cloud agents, repository context, security review, human handoffs |
| [GitHub](https://github.blog/), Microsoft developer/security engineering | Agent workflows, reproducible findings, maintainer and release authority |
| [Google DeepMind](https://deepmind.google/blog/), [Gemini CLI](https://github.com/google-gemini/gemini-cli/releases), Antigravity | Formal verification, agent runtimes, failure recovery |
| [Replit](https://replit.com/blog), Amjad Masad | Outcome contracts, cloud agent execution, budgets, acceptance criteria |
| [Vercel](https://vercel.com/blog), Guillermo Rauch | Agent infrastructure, sandboxes, durable workflows, approvals, telemetry |
| [AWS Kiro](https://kiro.dev/blog/) | Specifications, agent coordination, enterprise permissions |
| [Tessl](https://tessl.io/blog/), Guy Podjarny, [8090](https://docs.8090.ai/resources/changelog) | Skills, verifiers, evaluation and organization-wide factory controls |
| [Steve Yegge](https://yegge.ai/), [Jeffrey Lee-Chan](https://x.com/jleechan2015/status/2119218626293358612), Lauren Tan | Operator experience, bespoke versus reusable harnesses, subtraction experiments |

This is a representative watchlist, not a ranking or an assertion that every
source publishes every day. Follow new credible builders when their work adds
evidence relevant to FDLC. Social posts are leads and attributed perspectives,
not proof of product availability, security, or performance. Keep the withdrawn keynote, its speaker’s personal posts, bylines and quotations out of the feed and public Guide. The rendered-page regression test enforces this editorial decision.

## Editorial contract

1. Read the original source, not only a search snippet. Prefer official release
   notes, repositories, papers and firsthand operator accounts. Verify dates and
   availability. Preserve explicitly identified historical reporting.
2. Add only material, distinct developments. Deduplicate by canonical URL and
   topic. Retain stable IDs and previous entries. Keep newest first.
3. Use the source publication date. For an undated resource, use the review date
   with `dateBasis: "reviewed"` and `kind: "Resource"`. Label arguments and
   predictions with `kind: "Perspective"`. Never present discovery as a launch.
4. Write an original, concise summary. Attribute vendor case studies and results.
   Explain a specific FDLC implication, leading with the `touches` label. Do not
   turn an individual's prediction into the framework's settled position.
5. Keep organization-owned specifications, skills, permissions, evidence and
   release authority distinct from replaceable tools and orchestration. Evaluate
   simpler harnesses on comparable tasks with the same acceptance requirements.
6. If there is no material news, do not invent an item. Advance the reviewed date
   only after completing the research, and distinguish a local draft from the
   published review date. Record inaccessible sources as limits, not empty scans.

## Draft and release workflow

The owner explicitly approved daily research at 08:00 America/Chicago and
automatic commits, pushes, and publication of validated FDLC updates on
November 22, 2026. This standing authorization covers this maintenance workflow;
it preserves the main-branch deployment guard and excludes unrelated releases.

The [daily GitHub Actions workflow](https://github.com/jaydubya818/FDLC/actions/workflows/factory-updates.yml) uses `0 8 * * *` in `America/Chicago`. GitHub hosts its Linux research and release runners and the macOS runner that qualifies Fab. GitHub may queue a scheduled start. The research runner reads publisher material and runs a checksum-pinned Qwen model locally on the hosted machine. Sources that are unavailable appear in the daily report. A second editorial pass checks shortlisted claims against their source and the archive. A day with no qualifying story still produces a dated review.

The `fdlc-daily-updates` GitHub environment accepts only `main`. Its `FDLC_PR_TOKEN` is a fine-grained credential limited to pull requests for this repository. Its `FDLC_VERCEL_TOKEN` belongs to the FDLC Vercel project. Rotate each at its issuer before expiration and replace only its matching environment secret. The temporary workflow token pushes the daily branch and merges after CI and both Vercel previews pass. A separate job qualifies the merged revision before the production stage. The production job checks the uploaded files, rendered feed and child applications, promotes explicitly, and tests both public hosts. Research inputs and the deployment receipt are attached to the run.

For cutover, dispatch the workflow on `main` with `publish=true` and `bootstrap_sha` set to the reviewed migration commit. This one-time option permits only the workflow, its scripts, CI wiring and this runbook in the gap from the deployed revision to the research base. Verify the production receipt and the public feed, set repository Actions variable `FDLC_DAILY_CLOUD_ACTIVE=true`, and then pause the desktop task. Subsequent scheduled runs need no input. To stop new scheduled publications, set the variable to `false`. To rehearse research without publishing, dispatch with `publish=false`. To retry a partial publication after merge, dispatch with `publish=true`; the runner resumes a completed daily review at the tip of `main`.

1. Inspect production deployment metadata and its Git SHA. Fetch current source.
   Reconcile any newer commits before editing. Use an isolated checkout and leave
   all other worktrees and dirty changes alone.
2. Prepare only feed, necessary presentation, validation and research-record
   changes. Record the research date, sources read, selected/omitted developments,
   limits and practical FDLC implications.
3. Run the feed test, corpus and shell checks, unit suite, site typecheck and
   production build. Preserve deployment configuration and the AI-FDE composition.
4. For an approved publication, record the prior production deployment/alias and
   exact candidate Git SHA. Commit and push only the scoped change. Stage the
   candidate using the established Vercel release workflow and inspect its build
   result. Check the rendered feed and representative existing routes before
   promoting the qualified candidate. Keep the prior deployment as rollback.
5. Confirm the live review date, expected IDs, sources and historical entries on
   `/updates`; confirm navigation and composed applications still work. Record
   source, deployment, checks and any verification limits. A source commit alone
   is not evidence of publication.

If credentials, research, checks or release fail, retain the local draft and report
the precise blocker. Never state that production changed without verification.

Local desktop scheduled tasks require the computer awake and the app running,
per the [official scheduled-task documentation](https://learn.chatgpt.com/docs/automations?surface=app).
