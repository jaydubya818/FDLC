# FDLC.ai V0 Release Checklist

Date: 2026-09-03  
Release target: public explanatory site  
Decision owner: Product Owner

This checklist separates what is verifiable in the repository from launch decisions that require an owner, account, or external system.

## Product and content

- [x] Canonical FDLC definition is consistent across routes.
- [x] The seven-stage factory lifecycle, four continuous controls, nine-step runtime lifecycle, six architecture areas, eleven-object artifact protocol, ten principles, and maturity dimensions are represented in the canonical content model.
- [x] Mission Control capabilities are labeled Available, Experimental, or Planned.
- [x] Private notes, Loom links, repository secrets, and unsupported performance claims are excluded from public pages.
- [x] The 36-chapter Guide map is represented with stable public part routes.
- [x] Every primary page has an explicit next action.
- [x] The five-minute worked example connects all four views and distinguishes illustrative records from production evidence.
- [x] The five-minute worked example includes a baseline contract, Mission Control reference views, measurable success criteria, and four concrete next steps.
- [x] Framework, Architecture, and Mission Control repeat the non-collapsible delivery-state boundary.
- [x] Empty, partial, and completion states exist for the two interactive tools.
- [x] Product Owner approves the reconciled lifecycle and protocol terminology for publication.
- [ ] Product Owner approves any future changes to manifesto language.
- [ ] Product Owner confirms whether the Guide repository should be public before launch; external links must not point visitors at a private or unavailable repository.

## Design and accessibility

- [x] Shared navigation, footer, page shell, buttons, status badges, and diagram language are implemented.
- [x] Keyboard-visible focus styles and a skip link are present.
- [x] Semantic headings, labels, fieldsets, legends, and status regions are used.
- [x] Reduced-motion preferences are respected.
- [x] Desktop and mobile layouts are defined without horizontal page overflow.
- [x] Long reference navigation adapts from an active side rail to floating and in-flow disclosures.
- [x] Detailed lifecycle, protocol, and Architecture content progressively discloses on mobile.
- [x] Images include useful alternative text and fixed dimensions.
- [ ] Run a human screen-reader pass with VoiceOver or NVDA.
- [ ] Confirm WCAG AA contrast with an independent automated scanner after final domain deployment.

## Engineering quality

- [x] TypeScript typecheck passes.
- [x] ESLint passes.
- [x] Unit tests cover canonical model shape, maturity scoring, and factory-definition validation.
- [x] The production build passes.
- [x] Rendered-route tests cover every public route and key V0 claims.
- [x] Production dependency audit reports no known vulnerabilities.
- [x] Build-tool dependencies are pinned to patched compatible versions.
- [x] No database, authentication, analytics, or form endpoint is introduced for this explanatory release.
- [ ] Add error monitoring only when the site gains server-side mutations or user accounts.

## SEO and sharing

- [x] Unique titles and descriptions exist for primary routes.
- [x] Canonical URLs, Open Graph metadata, and Twitter card metadata are present.
- [x] A dedicated social card and favicon are present.
- [x] `robots.txt` and `sitemap.xml` routes are present.
- [x] Guide child routes have crawlable headings, descriptions, and stable URLs.
- [x] Point `fdlc.ai` DNS to the production host.
- [x] Reconfirm canonical, Open Graph, JSON-LD, robots host, and sitemap host after DNS cutover.
- [ ] Submit the production sitemap to search engines after domain verification.

## Links, licensing, and policy

- [x] Internal route targets resolve in the production render test.
- [x] Mission Control and Guide references point to their canonical GitHub repositories.
- [x] Source projects currently declare MIT licensing.
- [ ] Product Owner confirms public repository visibility and organization ownership.
- [ ] Add privacy and terms pages before collecting analytics, contact details, account data, or assessment submissions.
- [ ] Confirm ownership or permission for every screenshot if Mission Control ownership changes.

## Operations and launch

- [x] Site can run without external services, secrets, or mutable storage.
- [x] Interactive assessments remain local to the browser and do not transmit answers.
- [x] A hosted release can be rolled forward by deploying a new immutable source version.
- [x] Connect the final custom domain and verify HTTPS.
- [ ] Define a named release owner and rollback contact.
- [ ] Decide whether to add privacy-preserving analytics and which events are genuinely decision-useful.
- [ ] After DNS cutover, smoke-test every route, both tools, external links, social previews, and mobile navigation on the public domain.

## Go / no-go

The source is eligible for a hosted V0 release after all automated checks pass. The branded `fdlc.ai` launch remains conditional on repository visibility/ownership and the minimum legal/privacy posture before the site collects analytics, contact details, accounts, or assessment submissions.
