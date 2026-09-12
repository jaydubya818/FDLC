---
title: SEO and discovery plan
description: Internal plan for how FDLC.ai earns the queries that define the category — target queries, owning pages, topic clusters, structured data, machine-readable exports, canonical host, sitemap policy, OG images, and site-experience priorities.
path: /project/seo
audience: [leader, platform]
level: [practitioner]
status: draft
related: [/project, /project/governance, /compare, /essays, /glossary, /in-5-minutes, /benchmarks]
diagrams: []
mc_refs: []
---

# SEO and discovery plan

Internal working document. Not linked from primary navigation; published under `/project` so that contributors can see how discovery decisions were made. Source data: the industry landscape audit (`audit/05-industry-landscape.md` §E) and the site audit (`audit/01-fdlc-site-audit.md` §3.9, §7 rows 16–18, 23, 29).

## What is it

A plan for FDLC.ai to be found for the queries that define its category, and to be read as what it is: an authoritative standard with a reference implementation, not a marketing microsite. Two facts from the landscape audit shape everything below. First, no neutral, non-vendor page ranks today for any of the head queries; the results are vendor definitional blogs, glossaries, and listicles. Second, "what is X" explainers and glossary-style pages are what win. The plan therefore favors definitional pillar pages with canonical vocabulary, dense internal linking, and machine-readable exports over campaign content.

## Principles

1. **One query, one owner.** Every target query has exactly one page that is meant to rank for it. Supporting pages link to the owner with the query's language in the anchor text; they do not compete for it.
2. **Definitions win.** The owning page states the canonical definition in its first hundred words, in a sentence that can be quoted.
3. **Neutral beats loud.** Comparison content is fair and cited; the [landscape page](/compare) is the model.
4. **Machine readers are readers.** `llms.txt`, `/fdlc.json`, JSON Schemas, and JSON-LD are first-class outputs, since a growing share of discovery is by assistants that cite sources.
5. **No content without a canon path.** Every page in this plan exists in canon §15. New paths are proposed here, not created here.

## Target queries

"Who ranks now" is taken from the landscape audit §E where surveyed; queries the audit did not survey are marked **[not surveyed]** with the nearest surveyed row.

### Head queries

| # | Query | Intent | Who ranks now (Sep 2026) | Owning page | Pillar cluster |
|---|---|---|---|---|---|
| H1 | autonomous software factory | Informational, category-defining | Factory.ai (news), HCLTech, Upsun "trust dial", Intercode, Medium/HN show-and-tells | `/` | C1 Home |
| H2 | AI software factory | Informational, "what is" | Cortex, Port (blog, glossary, Uber case study), Mastra, Pulumi, Encore, Faros, AgilePoint, Intercode | `/in-5-minutes` | C2 In 5 minutes |
| H3 | agentic software development | Informational; also "agentic SDLC" | GitLab (Agentic SDLC), Uber, IBM, EPAM, Augment, DeployProAI, listicles | `/framework` | C3 Framework |
| H4 | autonomous software engineering | Informational, aspirational | **[not surveyed]**; nearest row H1 (vendor and SI thought pieces) | `/framework/maturity` | C5 Maturity |
| H5 | AI developer platform | Commercial investigation (buyers comparing) | **[not surveyed]**; audit §4 shows IDP vendors (Port, Cortex) and hyperscaler platform pages publishing here | `/compare` | C6 Compare |
| H6 | software engineering agents | Informational, comparison | Firecrawl, daily.dev, comparison listicles, OpenHands benchmarks explainer, harness catalogs | `/architecture/agents-skills-tools-harnesses` | C8 Agents |
| H7 | coding agent architecture | Informational, technical | Same row as H6 | `/architecture/execution-vocabulary` | C9 Execution vocabulary |
| H8 | enterprise agent platform | Commercial investigation | Gartner hype cycle commentary, hyperscaler platform pages | `/enterprise` | C10 Enterprise |
| H9 | multi-agent software development | Informational, technical | Framework comparisons (LangGraph, CrewAI, ADK) | `/architecture/multi-factory` | C11 Multi-factory |
| H10 | agent governance | Informational; currently security-framed | Boomi, WitnessAI, Aryaka, Zenity, Flowable, AvePoint, IncWorx; almost no software-engineering framing | `/architecture/authority` | C12 Authority |
| H11 | AI software development lifecycle | Informational, "what is" | IBM (AI-DLC, AI in SDLC), Augment, EPAM, agencies | `/framework/delivery-loop` | C4 Delivery Loop |
| H12 | software factory architecture | Informational, technical; encyclopedic competition | Wikipedia (Software factory; Microsoft .NET), Faros, Encore, Microsoft patterns & practices (2004) | `/architecture` | C7 Architecture |

### Long-tail queries (derived)

| # | Query | Intent | Who ranks now | Owning page | Pillar cluster |
|---|---|---|---|---|---|
| L1 | what is an AI software factory | Informational | Port glossary, Cortex, Encore | `/in-5-minutes` | C2 |
| L2 | coding agent vs software factory | Informational, distinction | **[not surveyed]**; no neutral page found in any pass | `/essays/the-agent-is-not-the-factory` | C2 (supports `/in-5-minutes`) |
| L3 | agentic SDLC | Informational, vendor-coined | GitLab, TCS co-marketing | `/compare` | C6 |
| L4 | agent development lifecycle (ADLC) vs SDLC | Informational, distinction | Gartner, Harness, Sierra, IBM | `/compare` | C6 |
| L5 | verification vs approval AI agents | Informational, technical | **[not surveyed]**; DevOps.com "agent proposes, pipeline disposes" is the nearest | `/architecture/verification` | C13 Verification |
| L6 | agents cannot pass their own tests / independent verification AI code | Informational, technical | DevOps.com, Thoughtworks Radar | `/patterns/independent-verifier` | C13 |
| L7 | work order software delivery agents | Informational; term is unowned | No vendor uses "work order" (audit §C) | `/specification/v1/work-order` | C14 Work Order |
| L8 | factory version / immutable agent configuration | Informational; term is unowned | No competitor uses it; adjacent: Harness "agent deployments", SLSA, AgBOM | `/architecture/factory-versioning` | C15 Factory Version |
| L9 | agent control plane vs harness | Informational, vocabulary | OpenHands, IBM glossary, Futurum, Obot, Lyzr; harness catalogs | `/architecture/execution-vocabulary` | C9 |
| L10 | AI agent evidence provenance SLSA | Informational, technical | Red Hat, Cloudsmith, DevOps.com | `/architecture/evidence` | C16 Evidence |
| L11 | AI software factory maturity model | Informational, assessment | **[not surveyed]**; DORA capabilities model is adjacent | `/framework/maturity` | C5 |
| L12 | human in the loop AI coding agents risk tiers | Informational | Augment (gate placement), Upsun (trust dial), HCLTech (Red Zone) | `/architecture/authority` | C12 |
| L13 | AI coding agent sandbox isolation requirements | Informational, technical | Sandbox vendor comparisons (MarkTechPost, wincent gist), Cloudflare | `/architecture/sandboxing` | C17 Sandboxing |
| L14 | cost per accepted outcome AI agents | Informational, metrics | Uber (outcome-denominated cost), DORA ROI | `/architecture/economics` | C18 Economics |
| L15 | spec-driven development Kiro spec-kit Tessl | Informational, comparison | martinfowler.com (Böckeler), AWS Kiro, GitHub spec-kit | `/compare` (with `/specification/v1/specification` as support) | C6 |
| L16 | state of the AI software factory report | Informational, recurring | None; DORA State of DevOps is the analog | `/benchmarks` | C19 Benchmarks |
| L17 | Mission Control FDLC reference implementation | Navigational | GitHub repository; GitHub Agent HQ "mission control" collides | `/mission-control` | C20 Mission Control |
| L18 | agent governance OWASP agentic top 10 crosswalk | Informational, security | OWASP, Cycode, Microsoft toolkit | `/anti-patterns/top-10` | C12 |

## Topic clusters

Each cluster names its pillar, five to eight supporting pages, the internal-link plan, and the pillar's title tag (≤60 characters) and meta description (≤160 characters). Character counts were checked by script; keep them within limits when editing.

### C1 Home — `/`

- **Owns:** H1 autonomous software factory.
- **Supporting:** `/in-5-minutes`, `/framework`, `/architecture`, `/specification`, `/mission-control`, `/start`, `/compare`, `/essays/the-agent-is-not-the-factory`.
- **Internal links:** The home page links down to every pillar with the pillar's query in the anchor ("the FDLC framework for agentic software development"). Every page's footer links home with the brand only. The four-step compression on the home page declares `mapsTo` step ids and links each step to `/framework/delivery-loop#step-n`.
- **Title tag:** `FDLC — The Standard for Autonomous Software Factories`
- **Meta description:** `The open lifecycle, artifact model, and governance model for autonomous AI software factories. Verified delivery, not merely generated code.`

### C2 In 5 minutes — `/in-5-minutes`

- **Owns:** H2 AI software factory; L1 what is an AI software factory.
- **Supporting:** `/essays/the-agent-is-not-the-factory` (L2), `/framework`, `/glossary`, `/architecture/agents-skills-tools-harnesses`, `/framework/maturity`, `/compare`, `/mission-control`.
- **Internal links:** Question 1 ("What is an AI software factory?") carries the canonical definition verbatim and is the `FAQPage` entity. Each of the ten questions links to its depth page with the depth page's query as anchor. `/glossary#terms` links up with "what is an AI software factory". The essay links to the page with "the five-minute version".
- **Title tag:** `What Is an AI Software Factory? FDLC in 5 Minutes`
- **Meta description:** `An AI software factory is a governed production system that converts intent into independently verified software outcomes. Ten questions, ten answers.`

### C3 Framework — `/framework`

- **Owns:** H3 agentic software development; also "factory development lifecycle" and "FDLC" (brand).
- **Supporting:** `/framework/delivery-loop`, `/framework/factory-lifecycle`, `/framework/principles`, `/framework/maturity`, `/framework/agents-skills-tools-harnesses`, `/glossary`, `/compare`, `/specification`.
- **Internal links:** The SDLC / Agentic SDLC / FDLC table is rendered here and on `/` (audit row 17). `/compare` links to it with "agentic software development"; GitLab and AWS relationship notes link to `/framework#category` for the distinction. Every framework child page links up to `/framework` in its breadcrumb and Related.
- **Title tag:** `Agentic Software Development: The FDLC Framework`
- **Meta description:** `SDLC governs software; FDLC governs the factory that builds it. Definitions, two lifecycles, ten principles, and every published sequence reconciled.`

### C4 Delivery Loop — `/framework/delivery-loop`

- **Owns:** H11 AI software development lifecycle.
- **Supporting:** `/specification/v1/intent`, `/specification/v1/specification`, `/specification/v1/plan`, `/specification/v1/work-order`, `/architecture/verification`, `/specification/v1/decision`, `/specification/v1/release`, `/architecture/learning`.
- **Internal links:** Each step section has a stable anchor (`#step-1-receive` … `#step-10-learn`) and links to the artifact it produces and the decision it makes. Spec pages link back with "step n of the Delivery Loop". Essays 14, 16, 31 link here.
- **Title tag:** `AI Software Development Lifecycle: The Delivery Loop`
- **Meta description:** `Receive, Specify, Plan, Route, Execute, Verify, Approve, Release, Observe, Learn. The ten steps by which one unit of intent becomes a verified outcome.`

### C5 Maturity — `/framework/maturity`

- **Owns:** H4 autonomous software engineering; L11 AI software factory maturity model.
- **Supporting:** `/specification/conformance`, `/architecture/authority` (HITL spectrum), `/enterprise/adoption`, `/benchmarks`, `/start`, `/essays/maturity-is-gated`, `/patterns/progressive-autonomy`.
- **Internal links:** The assessment tool's result links to the level's next actions and to `/specification/conformance#levels`. `/benchmarks` links here with "assess your maturity level". Conformance links with "the maturity model the levels map to".
- **Title tag:** `Autonomous Software Engineering Maturity Model (L0–L5)`
- **Meta description:** `Six levels from ad hoc AI use to a factory ecosystem, eleven dimensions, and min-gated scoring on security, verification, and governance. Assess your system.`

### C6 Compare — `/compare`

- **Owns:** H5 AI developer platform; L3 agentic SDLC; L4 ADLC vs SDLC; L15 spec-driven development comparison.
- **Supporting:** `/framework`, `/architecture/agents-skills-tools-harnesses`, `/glossary` (alias and crosswalk tables), `/specification/conformance`, `/project/governance`, `/essays/sdlc-adlc-fdlc`, `/essays/the-five-words`, `/anti-patterns/top-10`.
- **Internal links:** Each "FDLC and X" note gets a stable anchor (`#fdlc-and-gitlab-agentic-sdlc`) so that essays and enterprise pages can deep-link. When a note grows into its own page, the anchor 308s to it. The glossary crosswalk links to the relevant note for each contested term.
- **Title tag:** `AI Developer Platforms and Standards: Where FDLC Fits`
- **Meta description:** `The agentic software landscape by layer, a fair comparison of twelve platforms and standards, and how FDLC relates to each. Dated, cited, corrections welcome.`

### C7 Architecture — `/architecture`

- **Owns:** H12 software factory architecture.
- **Supporting:** `/architecture/execution-vocabulary`, `/architecture/design-decisions`, `/architecture/multi-factory`, `/architecture/factory-versioning`, `/architecture/verification`, `/architecture/evidence`, `/architecture/authority`, `/enterprise/reference-architecture`.
- **Internal links:** The twelve-layer diagram is an image map: each layer links to its page. The areas × layers matrix links both axes. Wikipedia-style competition is met by a short "history of the term" section (Microsoft 2004, DoD DevSecOps, agentic) with the canonical definition.
- **Title tag:** `AI Software Factory Architecture: 12 Layers, 4 Planes`
- **Meta description:** `The FDLC reference architecture: twelve layers in four planes, six responsibility areas, and the control boundary. Authority flows down; evidence flows back.`

### C8 Agents — `/architecture/agents-skills-tools-harnesses`

- **Owns:** H6 software engineering agents.
- **Supporting:** `/architecture/execution-vocabulary`, `/patterns/bounded-agent`, `/anti-patterns/the-mega-agent`, `/specification/v1/capability-manifest`, `/architecture/routing`, `/essays/end-of-the-monolithic-agent`, `/compare`.
- **Internal links:** The distinction diagram (D19) links each node to its glossary entry. The SDK placement section links to `/compare#fdlc-and-anthropic-managed-agents-claude-agent-sdk` and its siblings.
- **Title tag:** `Software Engineering Agents, Skills, Tools, and Harnesses`
- **Meta description:** `What an agent, a skill, a tool, a harness, and a factory each are, how they compose, and where agent SDKs sit. An agent is a worker, never the factory.`

### C9 Execution vocabulary — `/architecture/execution-vocabulary`

- **Owns:** H7 coding agent architecture; L9 agent control plane vs harness.
- **Supporting:** `/glossary`, `/architecture/agents-skills-tools-harnesses`, `/architecture/sandboxing`, `/patterns/lease-based-worker`, `/patterns/recovery-checkpoint`, `/essays/harness-orchestrator-control-plane`, `/essays/a-distributed-systems-problem`.
- **Internal links:** Each of the twenty terms is a `DefinedTerm` with an anchor; the glossary hover-card feature reads from these. The crosswalk section links out to primary vendor usage (Anthropic, OpenAI, Antigravity) and to `/compare`.
- **Title tag:** `Coding Agent Architecture: The Execution Vocabulary`
- **Meta description:** `Twenty terms — Agent, Agent Loop, Harness, Orchestrator, Runtime, Sandbox, Control Plane, and more — with a relationship chain and a crosswalk to industry use.`

### C10 Enterprise — `/enterprise`

- **Owns:** H8 enterprise agent platform.
- **Supporting:** `/enterprise/reference-architecture`, `/enterprise/identity-tenancy`, `/enterprise/policy-governance`, `/enterprise/execution-fleet`, `/enterprise/model-gateway`, `/enterprise/operations`, `/enterprise/organization`, `/enterprise/adoption`.
- **Internal links:** `/deploy` (commercial) links to `/enterprise` with "the open enterprise reference architecture", never the reverse in body copy (footer only). `/architecture/multi-factory` links here for the worked 30k/10k/500/50 architecture.
- **Title tag:** `Enterprise Agent Platform Reference Architecture`
- **Meta description:** `The open reference architecture for running many software factories under one control plane: identity, policy, fleet, model gateway, audit, operations.`

### C11 Multi-factory — `/architecture/multi-factory`

- **Owns:** H9 multi-agent software development.
- **Supporting:** `/architecture/routing`, `/patterns/multi-factory-orchestration`, `/patterns/objective-decomposition`, `/anti-patterns/agent-to-agent-spaghetti`, `/enterprise/reference-architecture`, `/essays/multiple-software-factories`, `/essays/agents-do-not-orchestrate-each-other`.
- **Internal links:** The principle "the control plane orchestrates the objective; factories execute bounded work; factories do not orchestrate one another" is quoted verbatim on the supporting pages with a link back. Framework-comparison competition (LangGraph, CrewAI, ADK) is met by the SDK placement paragraph linking to `/compare`.
- **Title tag:** `Multi-Agent Software Development at Factory Scale`
- **Meta description:** `Objective planning, three-level routing, and integration verification across factories. The control plane orchestrates; factories never orchestrate each other.`

### C12 Authority — `/architecture/authority`

- **Owns:** H10 agent governance; L12 human-in-the-loop risk tiers; L18 OWASP crosswalk (with `/anti-patterns/top-10`).
- **Supporting:** `/anti-patterns/top-10`, `/patterns/human-authority-gate`, `/patterns/tool-grant-and-receipt`, `/patterns/decision-record`, `/specification/v1/decision`, `/enterprise/policy-governance`, `/essays/models-reason-control-planes-govern`, `/essays/capability-permission-authority`.
- **Internal links:** The page's H1 phrase is "agent governance for software delivery" to claim the software-engineering framing the security vendors lack. The OWASP ASI crosswalk lives on `/anti-patterns/top-10` and is linked with "crosswalk to the OWASP Agentic Top 10". `/enterprise/policy-governance` links here for the authority model and keeps enterprise policy mechanics.
- **Title tag:** `Agent Governance for Software Delivery: The Authority Model`
- **Meta description:** `Capability is not permission is not authority. Roles, delegation, risk-tiered autonomy, and the human-in-the-loop spectrum for agents that build software.`

### Long-tail clusters (owners with title and meta)

| Cluster | Pillar | Supporting pages (5–8) | Title tag | Meta description |
|---|---|---|---|---|
| C13 Verification | `/architecture/verification` | `/patterns/independent-verifier`, `/patterns/candidate-currentness`, `/patterns/verification-contract`, `/anti-patterns/self-verifying-agent`, `/specification/v1/verification`, `/essays/verification-is-the-scarce-resource`, `/essays/verification-is-not-approval` | `Verification vs Approval: Independent Checks of AI Code` | `Verification judges evidence against the specification; approval applies authority. Independence by lineage and standard, the hierarchy, and currentness.` |
| C14 Work Order | `/specification/v1/work-order` | `/framework/delivery-loop`, `/specification/v1/plan`, `/specification/v1/attempt`, `/patterns/verification-contract`, `/patterns/sandbox-per-work-order`, `/essays/the-work-order`, `/glossary#terms` | `Work Order — FDLC Specification v1` | `The bounded, authorized unit of work: scope, risk class, authority envelope, verification contract, change budget, Factory Version binding. Schema and example.` |
| C15 Factory Version | `/architecture/factory-versioning` | `/specification/v1/factory-version`, `/specification/v1/execution-profile`, `/architecture/qualification`, `/patterns/immutable-factory-version`, `/anti-patterns/mutable-production-factory`, `/essays/the-case-for-factory-versioning` | `Factory Version: Immutable, Qualified Agent Compositions` | `Why production work must route to an immutable, content-addressed, qualified Factory Version — composition, state machine, and the qualification standard.` |
| C16 Evidence | `/architecture/evidence` | `/specification/v1/evidence`, `/specification/v1/candidate`, `/patterns/evidence-bound-acceptance`, `/anti-patterns/no-evidence-lineage`, `/architecture/observability`, `/essays/evidence-is-the-foundation`, `/compare#fdlc-and-slsa-in-toto` | `Evidence and Provenance for AI Agents: Claim to Authority` | `Evidence bound to an exact candidate with provenance and validity conditions, six states, in-toto and SLSA alignment, and why context and traces are not proof.` |
| C17 Sandboxing | `/architecture/sandboxing` | `/patterns/sandbox-per-work-order`, `/anti-patterns/no-sandbox`, `/patterns/publication-permit`, `/architecture/security`, `/enterprise/execution-fleet`, `/essays/sandboxes-contain-effects` | `AI Coding Agent Sandbox Isolation Requirements` | `Filesystem, process, network, credential, and resource isolation for agent execution — and why a sandbox contains effects but never confers authority.` |
| C18 Economics | `/architecture/economics` | `/benchmarks`, `/architecture/routing`, `/anti-patterns/no-outcome-metrics`, `/anti-patterns/cheapest-model-everywhere`, `/essays/economics-of-autonomous-delivery`, `/essays/cost-per-accepted-outcome` | `Cost per Accepted Outcome: AI Software Factory Economics` | `The cost model for autonomous delivery: verified, accepted, and released outcome denominators, cost coverage, and routing by economics after eligibility.` |
| C19 Benchmarks | `/benchmarks` | `/architecture/economics`, `/framework/maturity`, `/specification/conformance`, `/architecture/observability`, `/essays#the-program` | `State of the AI Software Factory — FDLC Benchmarks` | `The measurement contract for AI software factories and the proposed annual State of the AI Software Factory program. No public results are claimed today.` |
| C20 Mission Control | `/mission-control` | `/specification/conformance`, `/tutorials`, `/architecture/verification`, `/architecture/factory-versioning`, `/patterns/publication-permit`, `/enterprise/operations` | `Mission Control — FDLC Reference Implementation` | `The open-source reference implementation of the Factory Development Lifecycle: capability ledger with limits, admission model, worked flows, self-assessment.` |

## Structured data plan

All JSON-LD is generated at build from `data/` and page front matter; nothing is hand-written per page.

| Type | Where | Fields | Source |
|---|---|---|---|
| `WebSite` | every page (site-wide, existing) | `name`, `alternateName`, `url`, `description`; add `potentialAction: SearchAction` once site search ships | `lib/site.ts`, `data/fdlc.ts` |
| `Organization` | every page | `name: FDLC.ai`, `url`, `logo`, `sameAs` (specification repository, Mission Control repository), `contactPoint` (public contact from `/about`) | new `data/organization.ts` |
| `BreadcrumbList` | every page below `/` | Items from path segments mapped to page titles; `/specification/v1/work-order` → Home › Specification › v1 › Work Order | route tree |
| `TechArticle` | `/essays/*`, `/architecture/*`, `/framework/*`, `/patterns/*`, `/anti-patterns/*`, `/guides/*` | `headline`, `description`, `author` (Organization), `datePublished`, `dateModified` (from front matter), `about` (canon pages), `citation` (external anchors), `isPartOf` (the pillar), `proficiencyLevel` (from `level`) | front matter |
| `DefinedTermSet` + `DefinedTerm` | `/glossary`; `DefinedTerm` also on `/architecture/execution-vocabulary` | `name`, `description`, `inDefinedTermSet`, `@id` = `/glossary#<slug>`; alias table as `alternateName` | glossary data |
| `FAQPage` | `/in-5-minutes` | Ten `Question`/`Answer` pairs; answer text is the first paragraph of each question | page data |
| `SoftwareSourceCode` | `/mission-control` | `name`, `codeRepository`, `programmingLanguage`, `license: MIT`, `runtimePlatform` | page data |
| `Dataset` | `/specification/schemas`, `/fdlc.json` | `name`, `distribution` (schema files, export), `license` (Apache 2.0 for schemas per governance proposal), `version` | schema index |

Validation runs in CI with a JSON-LD linter; a page that declares a type without its required fields fails the build.

## `llms.txt` and `/fdlc.json`

**`/llms.txt`** follows the emerging convention: an H1, a one-paragraph summary in a blockquote, then sections of links with one-line descriptions. Proposed content:

```markdown
# FDLC — Factory Development Lifecycle

> The open lifecycle, artifact model, and governance model for autonomous
> AI software factories. SDLC governs software; FDLC governs the factory
> that builds it. Canonical definitions are on /framework and /glossary.

## Start here
- [FDLC in 5 minutes](https://fdlc.ai/in-5-minutes): the ten questions
- [Framework](https://fdlc.ai/framework): definitions, two lifecycles, principles
- [Glossary](https://fdlc.ai/glossary): canonical vocabulary and alias table

## Specification
- [Specification v1](https://fdlc.ai/specification): nineteen artifacts, identifiers, invariants
- [JSON Schemas](https://fdlc.ai/specification/schemas): machine-readable artifact schemas
- [Conformance](https://fdlc.ai/specification/conformance): tracks, levels, self-assessment

## Architecture
- [Reference architecture](https://fdlc.ai/architecture): twelve layers, four planes
- [Verification](https://fdlc.ai/architecture/verification) · [Evidence](https://fdlc.ai/architecture/evidence) · [Authority](https://fdlc.ai/architecture/authority) · [Factory versioning](https://fdlc.ai/architecture/factory-versioning)

## Reference implementation
- [Mission Control](https://fdlc.ai/mission-control): capability ledger with statuses and limits

## Machine-readable
- [fdlc.json](https://fdlc.ai/fdlc.json): full data export
- [llms-full.txt](https://fdlc.ai/llms-full.txt): concatenated canonical pages

## Optional
- [Compare](https://fdlc.ai/compare) · [Essays](https://fdlc.ai/essays) · [Benchmarks](https://fdlc.ai/benchmarks) · [Project](https://fdlc.ai/project)
```

`/llms-full.txt` concatenates the Markdown source of the framework, architecture, specification, and glossary pages in canonical order with a header per page giving its path and last-reviewed date. Generated at build; excluded from the HTML sitemap; listed in `robots.txt`.

**`/fdlc.json`** is the versioned data export the audit asked for (row 23). Generated at build from `data/*.ts` and the specification index; served as `application/json` with an `ETag` and a `Cache-Control` of one day. Proposed top-level shape:

```json
{
  "$schema": "https://fdlc.ai/schemas/export/v1.schema.json",
  "version": "1.0.0-draft",
  "generatedAt": "2026-09-11",
  "canonicalHost": "https://fdlc.ai",
  "definitions": { "fdlc": "...", "factory": "...", "codingAgent": "...", "controlPlane": "...", "builder": "..." },
  "principles": { "design": [ "..." ], "manifesto": [ { "number": 1, "principle": "...", "explanation": "...", "implication": "..." } ] },
  "lifecycles": {
    "deliveryLoop": [ { "step": 1, "name": "Receive", "artifacts": [ "intent" ], "decision": "admission" } ],
    "factoryLifecycle": [ { "stage": 1, "name": "Discover", "output": "opportunity-record" } ],
    "compressions": [ { "name": "hero-4-step", "mapsTo": [ [1, 2], [3, 4, 5], [6, 7, 8], [9, 10] ] } ]
  },
  "artifacts": [ { "id": "fdlc://v1/work-order", "family": "A", "name": "Work Order", "schema": "https://fdlc.ai/schemas/v1/work-order.schema.json", "page": "/specification/v1/work-order", "missionControl": { "table": "workOrders", "status": "Available" } } ],
  "layers": [ { "id": "L3", "plane": "II", "name": "Control Plane", "page": "/architecture" } ],
  "maturity": { "levels": [ { "level": 2, "name": "Governed Agents" } ], "dimensions": [ "..." ], "scoring": "min over hard gates, then floor(average)" },
  "metrics": [ { "name": "Verified completion rate", "definition": "..." } ],
  "glossary": [ { "term": "Work Order", "slug": "work-order", "definition": "...", "aliases": [ "WorkOrder" ], "family": "A" } ],
  "missionControl": { "revision": "<commit>", "capabilities": [ { "name": "...", "status": "Available", "summary": "...", "limitation": "..." } ] },
  "pages": [ { "path": "/framework", "title": "...", "updated": "2026-09-11" } ]
}
```

Rule: `/fdlc.json` never contains a claim that is not on a page. It is a projection of the site, not a second source of truth.

## Canonical host decision

**Decision: apex `https://fdlc.ai` is canonical.** `https://www.fdlc.ai/*` returns `308 Permanent Redirect` to the same path and query on the apex. Rationale (canon §14): one host, and the apex is what marketing copy, the repository, and the Guide already say.

Current state, per the site audit §3.9: source defaults canonical to `www` (`lib/site.ts`, `proxy.ts`, `microfrontends.json`, `tests/unit/routing.test.ts`), the apex serves 200 without a redirect, and a release record describes the reverse. Two serving hosts with self-referential canonicals split link equity and confuse crawlers.

Change list:

1. `lib/site.ts`: default `siteUrl` to `https://fdlc.ai`; `NEXT_PUBLIC_SITE_URL` set the same in every environment.
2. `proxy.ts` `canonicalOrigin` and `microfrontends.json` fallback: apex.
3. Platform-level redirect rule: `www.fdlc.ai/*` → `fdlc.ai/*`, status 308, before any application routing, including for `/guide/*` served by the microfrontend.
4. `robots.ts` `host` and `sitemap` URLs: apex. `alternates.canonical` stays path-relative and resolves through `metadataBase`.
5. `tests/unit/routing.test.ts`: assert one apex origin; add a browser check that a `www` URL redirects with 308 and preserves path and query.
6. Correct the release record that describes the reverse.
7. HSTS on both hosts; the redirect must be served over HTTPS.

Why 308 and not 301: 308 is explicitly permanent and forbids the user agent from changing the request method, so form posts and API calls are preserved; search engines treat both as permanent. Why not the reverse: the apex is what humans type and what every external citation already uses.

## Sitemap and lastmod policy

- **Coverage.** All canonical routes, including `/specification/v1/*`, `/patterns/*`, `/anti-patterns/*`, `/essays/*`, `/guides/*`, `/tutorials/*`, `/examples/*`. Today's sitemap lists thirteen routes with a hard-coded date (audit §3.9).
- **Structure.** A sitemap index at `/sitemap.xml` pointing to per-section sitemaps (`/sitemap/framework.xml`, `/sitemap/specification.xml`, …) and to the Guide microfrontend's `/guide/sitemap.xml`.
- **`lastmod`.** From the page's front-matter `updated` date (set by the editor on content change), falling back to the data file's last commit date. Never the build time. A page whose content did not change keeps its old `lastmod`.
- **`changefreq`.** `weekly` for `/`, `/compare`, `/benchmarks`, `/mission-control`; `monthly` for framework, architecture, patterns, essays; `yearly` for specification pages between releases (they change by release, and `lastmod` carries the release date).
- **`priority`.** `1.0` home; `0.9` cluster pillars in this plan; `0.8` specification and architecture children; `0.7` patterns, anti-patterns, guides; `0.6` essays, tutorials, examples; `0.4` project, about, services.
- **Exclusions.** `/project/seo` (this page) is `noindex`; `/llms-full.txt` and `/fdlc.json` are linked from `robots.txt` and `llms.txt`, not the sitemap.

## OG image plan per section

One image for every route today (audit §3.9); the Guide sets none. Proposal: images generated at build with the site's font and the visual canon colors, 1200×630, with a static fallback.

| Section | Template | Color (visual canon) | Content |
|---|---|---|---|
| Home, `/in-5-minutes`, `/start` | Brand | slate | Wordmark, "Verified delivery, not merely generated code." |
| Framework | Lifecycle | blue (Intent) | Page title, a ten-dot Delivery Loop or eight-dot Factory Lifecycle strip |
| Architecture | Layers | slate (Control) | Page title, the twelve-layer strip with the page's layer highlighted |
| Specification | Artifact | green (Trust) | Artifact name, `fdlc://v1/<slug>`, family letter, schema version |
| Patterns / anti-patterns | Pattern | amber (Execution) / red outline (anti-pattern) | Name, one-line intent, "Pattern" or "Anti-pattern" |
| Essays | Essay | violet (Learning) | Title, one-line thesis, "Essay" |
| Enterprise | Ecosystem | slate | Title, the local-vs-ecosystem glyph |
| Mission Control | Ledger | green | "Mission Control — FDLC reference implementation", Available/Experimental/Planned counts |
| Benchmarks | Metric | green | Title, "Measure the outcome, not the activity." |
| Guide | Book | blue | Chapter number and title (fix `images: []`) |

Alt text is the page title plus the section; the `openGraph.images[].alt` field is generated, not shared.

## Site experience: an authoritative standard, not a marketing microsite

Prioritized. P0 items are prerequisites for being read as a standard; P1 items make the corpus navigable at its intended size; P2 items are polish.

| Priority | Recommendation | Why | Notes |
|---|---|---|---|
| P0 | **Fix the canonical host** (above) | Everything else compounds on one host | Audit gap 8 |
| P0 | **Navigation: Standard first.** Primary: Start · Framework · Architecture · Specification · Patterns · Guides · Enterprise · Mission Control · Guide. Secondary: Glossary, Compare, Essays, Benchmarks, Services, Project, About | Specification and Benchmarks are currently out of nav by test while the commercial page is primary (audit row 29) | Canon §15 navigation; update `rendered-html.test.mjs` |
| P0 | **Version and date on every page.** Specification pages show `schemaVersion` and a release banner; all other pages show "last reviewed" | A standard that cannot be cited by version is a blog | From front matter; no hard-coded dates (audit row 28) |
| P0 | **Breadcrumbs** on every page, matching `BreadcrumbList` | Depth is the design; readers must know where they are | |
| P0 | **Standardized Related block** at the end of every page: spec · pattern · anti-pattern · glossary · Mission Control | Cross-references are the corpus's structure | Canon §17.2 |
| P0 | **Fix stale links** (`/spec`, legacy Guide slugs, "Forward-Deployed") | Broken internal links on a standard read as neglect | Audit row 24 |
| P1 | **Site search.** A static index built at deploy over titles, headings, glossary terms, and artifact ids; keyboard-openable; results grouped by section | ~200 pages cannot be browsed | Client-side index; no external service |
| P1 | **Glossary hover-cards.** Any capitalized canon term in body copy renders as a link with a hover/focus card showing the glossary definition and a "Read more" link; source of truth is the `DefinedTerm` set | Vocabulary is the product; readers should never leave a page to learn a word | Accessible: focusable, dismissible, no hover-only |
| P1 | **Code and schema examples.** Every specification page shows the JSON Schema and the example instance in tabs with copy buttons; examples are validated in CI against the schemas | "Machine-checkable" must be visible | Existing `CopyButton` |
| P1 | **Diagram download.** Every Mermaid diagram renders to inline SVG with `<title>`/`<desc>`, has a text equivalent, and offers "Download SVG" | Neutral diagrams get linked and reused | Audit gap 9; design-system accessibility commitments |
| P1 | **Onboarding by role.** `/start` offers the seven learning paths (Executive, Eng Leader, Architect, Platform Eng, Builder, Security, Factory Engineer) as ordered reading lists with time estimates computed from word counts | The corpus has layered depth; roles need a route through it | Canon §15 |
| P1 | **Mobile.** Tables and comparison matrices in `overflow-x: auto` containers with a sticky first column; diagrams pinch-zoomable; 44 px targets kept | Standards are read on phones in meetings | Design-system commitments |
| P1 | **"How others use this word" sections** on glossary entries for contested terms (control plane, harness, mission control, software factory) | Directly answers the semantic-diffusion problem and earns the vocabulary queries | Landscape §C |
| P2 | **Print and PDF** of the specification at each release, with a stable URL per version | Procurement and audit teams cite PDFs | Generated from Markdown |
| P2 | **Per-version specification URLs** (`/specification/v1/...` today; `/specification/v2/...` later) with a version switcher and an "unversioned" alias that always points to current | Standards are cited at versions | Governance versioning policy |
| P2 | **Interactive tools mounted and exportable**: Factory Explorer remounted; Factory Definition builder at `/tools/factory-definition` with JSON export; maturity assessment with exportable result | Preserve list items 16–17; canon §18.4 | |
| P2 | **Dark mode** following the visual canon's color semantics | Reader preference | |
| P2 | **Changelog page** rendering `CHANGELOG.md` with anchors per version and links to RFCs | Predictable change is a governance guarantee | `/project` |

## How you know it worked

Track quarterly: rank position for the twelve head queries and the eighteen long-tail queries; share of assistant-cited answers that link to an FDLC page for the head queries (sampled); inbound links from vendors named on `/compare`; `/fdlc.json` and schema fetch counts; search usage on site; percentage of pages with a `lastmod` younger than one year.

## What can go wrong

- **Content without hygiene.** Publishing more pages on two hosts with a hard-coded sitemap date wastes the work. Host and sitemap first.
- **Query cannibalization.** Two pages targeting one query. The owner table is the arbiter; when in doubt, the more definitional page owns it and the other links in.
- **Vocabulary sprawl in titles.** Title tags use the market's words (agent governance, AI software development lifecycle) and the body introduces FDLC's; never the reverse.
- **Machine exports drifting from pages.** `/fdlc.json` and `llms.txt` are generated from the same data as the pages, in the same build.

## Related

- [/project](/project) · [/project/governance](/project/governance)
- [/compare](/compare) — the landscape this plan competes in
- [/essays](/essays) — query clusters per essay
- [/glossary](/glossary) — the `DefinedTermSet`
- [/in-5-minutes](/in-5-minutes) — the `FAQPage`
