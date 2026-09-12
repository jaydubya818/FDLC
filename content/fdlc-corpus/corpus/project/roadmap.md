---
title: The 3-5 year path to industry-standard status
description: What would need to be true for FDLC to become the accepted standard for autonomous software factories, and the concrete strategy to get there.
path: /project/roadmap
audience: [executive, leader, architect]
level: enterprise
status: draft
related: [/specification/conformance, /project/governance, /compare]
diagrams: []
mc_refs: []
---

# What would need to be true for FDLC to become the accepted standard?

Several durable technical standards that reached broad adoption did so through similar forcing functions across their domains. Kubernetes (container orchestration), SLSA (supply-chain integrity), OWASP (application security), DORA (delivery performance), and the AWS Well-Architected Framework (cloud architecture) provide useful comparisons. This page evaluates FDLC against that path plainly — including where it is not yet close — and gives a concrete strategy to close the distance.

## The seven forcing functions, applied to FDLC today

| Forcing function | What it took for the precedents | Where FDLC is now |
|---|---|---|
| **A namable problem nobody else names as precisely** | Kubernetes named "container orchestration" when everyone else said "container tools." OWASP named "the top 10 risks" when security advice was diffuse. | Done, provisionally. "The agent is not the factory" and "the producer is not the sole judge of its own work" are precise, and the industry landscape survey (`05-industry-landscape.md`) found no comparator using this framing. Not yet tested outside this corpus — no independent adoption yet. |
| **A reference implementation that is actually used** | Kubernetes had Borg's lessons and Google's internal usage before it was ever open-sourced. SLSA had Google's internal build provenance work. | Partial. Mission Control exists, is real code (219-table schema, working verification-independence and currentness logic), and self-assesses candidly at FDLC-L2 — but it is one team's implementation, not yet used by an organization other than its own author. |
| **A specification independent of the reference implementation** | Kubernetes' API objects were specified well enough that multiple runtimes (containerd, CRI-O) could implement the same contract. | Done in this pass: 19 artifacts, JSON Schema 2020-12, validated structurally and against real and negative example instances (`specification/schemas/`). Not yet: no second implementation has tried to conform to it, so the specification's independence is unproven, only intended. |
| **A conformance test another team can run without asking the standard's authors** | SLSA levels are self-assessable from a public rubric. CNCF conformance tests are automated and vendor-run. | Started: `specification/conformance.md` defines FDLC-L0–L5 with per-facet criteria. Missing: there is no automated conformance test suite yet — conformance today is a documented self-assessment (which is exactly how Mission Control's own FDLC-L2 rating was produced), not a runnable check. This is the single largest gap between "documented" and "standard." |
| **A neutral home** | CNCF for Kubernetes, OpenSSF for SLSA, a nonprofit foundation for OWASP. No single vendor owns the mark. | Not started. FDLC is currently owned entirely by one person and one repository. A standard that only one company can change is a specification, not a standard — this is the most consequential structural gap. |
| **A community that extends it without the original authors** | Kubernetes' SIG structure, OWASP's chapter model, SLSA's public working groups. | Not started. No contribution process, no public issue tracker for the specification, no second author has proposed a change. |
| **Enterprises citing it in their own procurement and audit language** | "SOC 2 attested," "SLSA Level 3," "Well-Architected reviewed" appear in vendor RFPs today. | Not started, and cannot start until the prior two gaps close — nobody cites a specification with one owner and no conformance test in a procurement document. |

Three of seven are done or well underway. Four are not started. That is the honest read: FDLC has a strong specification and a credible (if early) reference implementation, and has not yet done the organizational work that separates a specification from a standard.

## The concrete strategy, in sequence

The four unstarted forcing functions have a dependency order — governance before community, community before conformance tooling has external pressure to exist, conformance tooling before procurement citation. Doing them out of order (for example, seeking enterprise adoption before a conformance test exists) produces the failure mode every unsuccessful "standard" hits: a specification that only its author can interpret, which enterprises correctly treat as a product pitch rather than a standard.

**Year 1 — Prove the specification is implementable by someone else.**
1. Publish the 19 JSON Schemas and the conformance rubric as their own versioned, standalone artifact (not embedded in the FDLC.ai site) — a `github.com/fdlc-spec/spec` repository with its own release cadence, separate from Mission Control. This is the highest-impact action available in year 1: it is the precondition for every later step, and it costs authoring time, not new code.
2. Recruit one team outside the current author's control to attempt a from-scratch implementation of one bounded piece of the spec — a Work Order object and a Verification Result object are the smallest useful slice. Their friction reports are the first real test of specification independence, and will surface ambiguities no amount of internal review will find.
3. Build the conformance test suite as executable code, not prose — a CLI that takes a candidate implementation's API responses and checks them against the JSON Schemas plus a set of behavioral assertions per FDLC level (for example: "an FDLC-L2 claim requires evidence of at least one independent-verifier pattern instance in the last N accepted Work Orders"). Mission Control becomes the first system this tool is run against, and its result must be allowed to be lower than L2 if the tool finds gaps the self-assessment missed — a conformance tool that always agrees with the vendor's self-rating is not a conformance tool.

**Year 2 — Create a neutral home before seeking a community, not after.**
4. Move specification governance (not the reference implementation) to a structure with at least one other named maintainer and a public change-proposal process — even a lightweight one (a `CHANGES.md` plus a public review window) is enough to stop being single-owner. This does not require a foundation; it requires proof that a specification change can happen without the original author's unilateral edit.
5. Publish the pattern and anti-pattern libraries as a citable, versioned corpus independent of the site's marketing surface — practitioners cite pattern names in design reviews the way they cite "the strangler fig pattern" or "circuit breaker," and that only happens once the names are stable across versions.
6. Start the essay/thought-leadership program deliberately (36 titles are already catalogued in `essays/essays.md`; 3 are written) as the mechanism that gets the vocabulary in front of engineers who are not already looking for it — essays are how "the twelve-factor app" and "you build it, you run it" entered common usage before there was a foundation behind either.

**Year 3 — Let conformance and community produce procurement pull, don't manufacture it.**
7. Once a second implementation exists and the conformance suite has run against both, publish a comparison the way SLSA publishes per-project levels — this is what turns "a specification we wrote" into "a standard two systems meet to different degrees," which is the sentence a procurement document can actually use.
8. Seek the first external enterprise adoption case study only after steps 1–7 are real — an adoption story on top of a single-owner, non-conformance-tested specification reads as a testimonial, not evidence, and undermines the honesty discipline that is FDLC's actual differentiator against the marketing-heavy comparators surveyed in `05-industry-landscape.md`.

## What NOT to do

Do not seek a standards-body affiliation (CNCF, IETF, ISO) before a second independent implementation exists — bodies like these require prior art from more than one party, and arriving without it wastes the credibility the specification has earned so far. Do not claim "industry standard" in the site's own copy at any point in this sequence; let the conformance tool, the second implementation, and the citations do that work — a standard that calls itself a standard before others do is the exact failure mode this roadmap is designed to avoid, and the site's existing capability-ledger discipline (Available/Experimental/Planned/Proposed, always paired with a limitation) is precisely the right instinct to extend to this claim as well.

## Related

- [/specification/conformance](/specification/conformance)
- [/project/governance](/project/governance)
- [/compare](/compare)
- [05-industry-landscape.md](../../audit/05-industry-landscape.md)
