# Author brief (read fully before writing anything)

You are writing normative and explanatory content for FDLC.ai — the intended industry-standard body of knowledge for autonomous AI software factories. Register: technical standard + practitioner handbook (think Kubernetes docs, AWS Well-Architected, OWASP guides, Martin Fowler, Google SRE). Not marketing.

## Must read first
1. `/home/claude/work/canon/00-FDLC-CANON.md` — the normative canon. Names, sequences, layers, artifacts, states, principles, terminology decisions, page template, visual canon. Do not deviate.
2. The audit files relevant to your assignment (listed in your task). Full set: `/home/claude/work/audit/01-fdlc-site-audit.md` (site), `02-mission-control-study.md` (reference implementation; §2 concept map, §3 state machines, §4 invariants, §5 gaps, §6 worked flows), `03-mission-control-enterprise-study.md`, `04-guide-corpus-study.md`, `05-industry-landscape.md`.
3. Existing site content to preserve/extend: `/home/claude/repos/FDLC-main/data/*.ts` and `app/**/page.tsx`. Preserve strong existing material (see canon §14 and audit §8 preserve list); strengthen, don't discard.

## Source repos (cite file paths; never invent)
- Mission Control: `/home/claude/repos/MissionControl` (convex/schema.ts is the data model; docs/ has contracts; packages/workflow-engine has verification subject/independence/currentness).
- Mission Control Enterprise: `/home/claude/repos/MissionControlEnterprise` (use only the three real patterns: authorization ratchet `convex/lib/authedFunctions.ts`, authn/authz separation + tenant-boundary qualification, `contracts/venture-factory/v1/` execution-intent contract set).
- The Guide: `/home/claude/repos/ai-software-factory-mastery/guide/` (narrative source; reuse explanations, keep canon names).

## Output conventions
- Markdown files under the path given in your task. One file per page. Filename = slug.
- YAML front matter on every page:
  ```
  ---
  title: <Page title>
  description: <one sentence, ≤160 chars, for SEO>
  path: </canonical/url/path>
  audience: [executive|leader|architect|platform|builder|security|factory-engineer] (list)
  level: [beginner|practitioner|architect|enterprise|expert]
  status: draft
  related: [</path>, ...]
  diagrams: [D02, D10]   # canon §16 ids used
  mc_refs: [convex/workOrders.ts, ...]
  ---
  ```
- Page template (canon §15): What is it · Why it matters · How it works (diagram first) · Components · Tradeoffs · Implementation ("FDLC requires X. Mission Control implements this through Y (file, status).") · Governance · How you know it worked · What can go wrong · How it scales · Related.
- Diagrams: Mermaid fenced blocks (```mermaid). Use flowchart/sequenceDiagram/stateDiagram-v2. Label with the canon diagram id in a comment line `%% D10 Three-level routing`. Keep node labels short.
- Tables for comparisons, fields, criteria. Lists only when items are parallel and short.
- Specs use MUST / SHOULD / MAY (RFC 2119). Everything else: plain imperative prose.
- Mission Control statuses: Available / Experimental / Planned / Proposed, with the limitation. Never claim production certification, fleet scale, zero-touch, autonomous self-improvement.
- No pricing, no infrastructure identifiers (no AWS account ids, hostnames, deployment ids), no invented benchmark numbers. Illustrative numbers must be labeled "illustrative".
- Cross-link generously using canonical paths from canon §15. Every page ends with `## Related`.
- Length: ≤2,500 words per page unless it is a reference page (spec, glossary, enterprise reference architecture); split otherwise. Prefer density over padding.
- American spelling. Short sentences. No "genuinely", "honestly", "straightforward", "delve", "leverage".
- Write files with the Write tool; build long files in sections if needed. At the end, return a ≤300-word summary listing every file written with word counts and any canon conflicts you noticed (do not resolve conflicts silently — report them).
