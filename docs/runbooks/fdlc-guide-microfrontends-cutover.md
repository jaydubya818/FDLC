# FDLC + Guide Microfrontends Cutover

## Purpose

Move the AI Software Factory Guide under `https://www.fdlc.ai/guide` without
coupling the FDLC and Guide release trains or removing the standalone rollback
path.

This runbook is intentionally gated. Creating a Vercel Microfrontends group is
reversible and does not change production behavior, but deploying the default
application's `microfrontends.json` to Production does. Do not perform the
production steps without Product Owner approval.

## Application contract

| Role | Vercel project | Package name | Owned routes |
| --- | --- | --- | --- |
| Default app | `fdlc` | `fdlc-site` | All routes except delegated Guide routes |
| Child app | `ai-software-factory-mastery` | `ai-software-factory-mastery-site` | `/guide`, `/guide/:path*`, and temporary non-conflicting legacy redirect surfaces |

The default app is the only repository that owns `microfrontends.json`. The
Guide receives that configuration for local development with
`VC_MICROFRONTENDS_CONFIG` or `vercel microfrontends pull`.

Do not add a Next.js `basePath`. Both applications use physical public routes,
and `withMicrofrontends` owns their framework asset prefixes. Guide-owned
public files live below `/guide`.

## Required evidence before production approval

- Both repositories pass typecheck, lint, unit tests, route-contract tests, and
  native `next build`.
- A paired Preview using branch `codex/fdlc-guide-consolidation` serves FDLC at
  `/` and the Guide at `/guide` plus a deep chapter.
- Search JSON, one infographic, Mermaid rendering, breadcrumbs, previous/next,
  glossary, Atlas, and both 404 scopes work through the composed Preview.
- Canonical URLs, Open Graph URLs, JSON-LD, robots, and sitemaps have been
  inspected in rendered HTML.
- Redirect checks prove single-hop permanent redirects, query preservation, and
  the moved-fragment behavior.
- The Vercel team plan, Microfrontends allowance, routing-request quota, and
  expected cost are confirmed.
- The current Production deployment IDs for both projects are recorded below.

## Release record

Complete this section before changing Production.

```text
Approved by:
Approval timestamp:
FDLC previous Production deployment ID:
Guide previous Production deployment ID:
Guide compatibility deployment ID:
FDLC routing deployment ID:
Guide canonical-cutover deployment ID:
Operator:
```

## Preview procedure

1. Create the Microfrontends group with `fdlc` as default and
   `ai-software-factory-mastery` as child.
2. Set the group's Fallback Environment to Production and explicitly enable
   polyrepo branch routing. Confirm that the group contains only these two
   projects before any Preview deployment.
3. Push the FDLC branch first so the default application's
   `microfrontends.json` produces the initial routed Preview.
4. Establish the stable FDLC branch/Preview origin that will be used for the
   composed check.
5. Set the Guide's branch-scoped Preview `NEXT_PUBLIC_SITE_URL` to that FDLC
   origin so build-time canonicals and cross-app links use the composed context.
   Set branch-scoped `GUIDE_LEGACY_REDIRECTS_ENABLED=true` on both projects for
   the evidence builds; the flag remains unset in Production.
6. Push the Guide using the same branch name. If either Preview was built before
   its branch-scoped variables were set, redeploy it; that initial build is not
   evidence.
7. Confirm both Preview deployments report the same Git branch name; Vercel
   uses matching commit or branch metadata to pair group deployments.
8. Confirm the Guide Preview is `noindex`.
9. Enable deployed routing debug headers with the `VERCEL_MFE_DEBUG=1` browser
   cookie and record:
   - `x-vercel-mfe-app`;
   - `x-vercel-mfe-target-deployment-id`;
   - `x-vercel-mfe-default-app-deployment-id`;
   - `x-vercel-mfe-matched-path`; and
   - `x-vercel-mfe-response-reason`.
10. Run the route and browser acceptance checks against the FDLC Preview URL.

Creating the group alone must not be treated as a release. Production behavior
changes only when the default app's routing configuration is promoted.

## Local composed development

In the Guide repository, expose the default repository's configuration:

```sh
export VC_MICROFRONTENDS_CONFIG=/absolute/path/to/FDLC/microfrontends.json
export NEXT_PUBLIC_SITE_URL=http://localhost:3024
export GUIDE_LEGACY_REDIRECTS_ENABLED=true
```

Start the native Next.js development process for each application on the port
assigned by `microfrontends port`. Then start one proxy for both application
keys:

```sh
microfrontends proxy --local-apps fdlc ai-software-factory-mastery
```

Use the proxy URL—not either application server URL—for composed checks. Set
`MFE_DEBUG=1` when routing diagnostics are needed. The `--local-apps` values are
the application keys from `microfrontends.json`; the package names determine
their local ports.

## Production procedure

### 1. Confirm the compatibility release

Promote the Guide compatibility build first while its canonical origin still
equals the standalone Guide origin and
`GUIDE_LEGACY_REDIRECTS_ENABLED` remains unset. Confirm that the following work
directly on that origin:

- `/guide`;
- a deep `/guide/<chapter>` route;
- `/guide/search-index.json`;
- a `/guide/infographics/...` asset;
- every known legacy redirect; and
- an unknown URL returning a real 404.

If this step fails, stop. Do not promote FDLC routing.

### 2. Promote shared-domain routing

With explicit Product Owner approval, promote the verified FDLC deployment
containing `microfrontends.json` and the enabled retired-host guard. Immediately
check:

```text
https://www.fdlc.ai/
https://www.fdlc.ai/framework
https://www.fdlc.ai/guide
https://www.fdlc.ai/guide/<deep-chapter>
https://www.fdlc.ai/guide/search-index.json
https://www.fdlc.ai/guide/infographics/<known-asset>
```

The response/debug headers must show `fdlc` for root routes and
`ai-software-factory-mastery` for Guide routes.

### 3. Flip canonical ownership and retire the old origin

Only after shared routing is healthy:

1. Set the Guide Production canonical-origin environment variable to
   `https://www.fdlc.ai`.
2. Set Guide Production `GUIDE_LEGACY_REDIRECTS_ENABLED=true` and promote the
   pre-verified Guide canonical-cutover build.
3. Verify that shared-domain Guide routes still return 200 and canonicalize to
   `https://www.fdlc.ai/guide/...`.
4. Verify that every published Guide route and explicit legacy alias on the old
   Guide hostname permanently redirects to its allowlisted canonical path on
   `https://www.fdlc.ai`. Cross-origin redirects deliberately drop query strings
   and do not forward arbitrary unknown paths, so potentially sensitive URL data
   is not copied to a different origin. In particular, `/` maps to `/guide`,
   `/architecture` maps to `/guide/architecture`, and each known
   `/docs/<chapter>` maps to `/guide/<chapter>`.
5. Verify that the old origin has no independently indexable 200 pages; unknown
   paths may remain true 404s.

## Synthetic acceptance checks

For every redirect, inspect the response without automatically following it.
The expected result is a single `308` to the final destination.

Check at minimum:

- FDLC: `/`, `/framework`, `/architecture`, `/specification`, `/mission-control`;
- Guide: `/guide`, a numbered chapter, a stage brief, an appendix, search,
  glossary, Atlas, architecture, topics, and coverage;
- legacy: `/spec`, `/docs/<chapter>`, `/docs/guide`, `/visuals`, `/glossary`, and
  the six retired FDLC Guide summaries;
- assets: Guide search JSON, one Open Graph image, favicon, and one infographic;
- failure behavior: one unknown FDLC URL and one unknown Guide URL;
- browser behavior: FDLC → Guide → FDLC, Back navigation, a hash target, and a
  same-origin route redirect carrying repeated and encoded query parameters;
- privacy behavior: allowlisted old-host routes reach their known canonical
  destination without a query; an unknown path is not forwarded.

## Rollback

Rollback is application-specific. Never roll back both projects blindly.

### Guide compatibility failure

Restore the recorded previous Guide deployment. Do not promote FDLC routing.

### FDLC shared-routing failure

Restore the recorded previous FDLC deployment. The Guide remains available on
its standalone origin. Confirm `/`, `/framework`, and the standalone Guide deep
chapter before closing the incident.

### Guide content or asset failure after routing succeeds

Restore the recorded Guide compatibility deployment while leaving the FDLC
routing deployment in place. Confirm `/guide`, one deep chapter,
`/guide/search-index.json`, and one infographic.

### Canonical or old-origin redirect failure

Restore the Guide compatibility deployment, which keeps the Guide reachable on
both surfaces while canonicals are corrected. Do not change the FDLC routing
deployment unless routing itself is failing.

The recovery target is five minutes from the rollback decision to healthy
responses for `/guide`, a deep chapter, search data, and one asset.

## Seven-day stabilization

Monitor Microfrontends routing, 404s, redirect traffic, search-index failures,
asset failures, Core Web Vitals, and application errors for seven days. Keep the
FDLC shadow Guide code and the standalone rollback deployment during this
window. Remove shadows only after traffic and error evidence show that rollback
no longer depends on them.

## References

- [Vercel Microfrontends quickstart](https://vercel.com/docs/microfrontends/quickstart)
- [Microfrontends configuration](https://vercel.com/docs/microfrontends/configuration)
- [Polyrepo local development](https://vercel.com/docs/microfrontends/local-development)
- [Testing and troubleshooting](https://vercel.com/docs/microfrontends/troubleshooting)
- [Managing preview fallbacks](https://vercel.com/docs/microfrontends/managing-microfrontends)
- [Preview links across grouped projects](https://vercel.com/changelog/preview-links-between-microfrontends-projects-now-serve-all-paths)
- [Branch-domain routing across grouped projects](https://vercel.com/changelog/microfrontends-routing-now-applies-to-vc-alias-and-branch-domains)
- [Next.js Multi Zones fallback](https://nextjs.org/docs/pages/guides/multi-zones)
