---
date: 2026-09-12
topic: corpus-community-hub
---

# Turn the corpus preview into a community learning hub

## What we're building

The imported corpus remains a noindex review candidate, but its landing page should serve an FDLC reader rather than only an auditor. A visitor should be able to choose a concrete outcome, follow a short curated path, browse a topic, or search the complete reference library without understanding the archive structure first.

The review evidence, source digest, collision count, and governance limitations remain available, but they move below the reader experience. This branch does not promote draft material to canon, replace existing routes, or settle open taxonomy and route-ownership decisions.

## Why this approach

Three approaches were considered:

1. Keep the manifest-first audit page. Lowest effort, but it does not explain why the corpus matters to an FDLC user.
2. Replace current FDLC navigation with corpus routes. More visible, but premature while all 157 pages are draft and nine routes still need Product Owner disposition.
3. Add a curated hub over the verified corpus. This gives the material a useful reader experience while preserving the reversible preview boundary.

Option 3 is the smallest approach that improves community value without making governance decisions silently.

## Key decisions

- Organize entry points around four outcomes: understand FDLC, build a first factory, design a trusted platform, and adopt FDLC across an organization.
- Curate a short sequence of existing corpus documents for each outcome; do not generate recommendations from unreviewed similarity scores.
- Add audience and depth filters alongside collection and keyword search, with all state preserved in the URL.
- Explain the practical value of the library before showing mechanical verification facts.
- Keep every page visibly labeled as a review candidate and keep the namespace out of navigation, sitemap, and search indexing.
- Treat automated checks as producer evidence. Product Owner review and the real `npm run build:vercel` result remain separate merge gates.

## Success criteria

- A first-time visitor can choose a relevant path from the first substantive section.
- Each curated path states its audience, outcome, sequence, and approximate reading time.
- Every curated link is checked against the generated manifest.
- Search can be narrowed by collection, audience, and level with shareable URLs.
- Audit evidence remains available without dominating the reader experience.
- The production Turbopack/Vercel build is either proven green or explicitly reported as an unresolved blocker.

## Open questions

- Product Owner approval of the nine canonical route dispositions.
- Product Owner approval of taxonomy qualification or rejection for proposed entries.
- Which reviewed paths should eventually enter the public navigation.

## Next steps

Implement this experience on `codex/corpus-integration-preview`, rerun the supported gates, run the shipping build target, and then hand the still-unchecked human review checklist to the Product Owner.
