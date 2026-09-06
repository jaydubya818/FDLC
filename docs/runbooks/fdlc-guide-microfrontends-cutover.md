# FDLC + Guide Microfrontends Cutover

## Superseded execution sequence — migration bridge release

For the September 2026 migration, the
[FDLC / Guide migration bridge release plan](../releases/2026-09-05-fdlc-guide-migration-bridge-release-plan.md)
is the active authority and state-aware execution/rollback contract. The older
three-step instructions and application-specific rollback recipes below are
historical context, not independently executable release instructions.

The required forward sequence is current/current → bridge/current →
bridge/Guide-compatible → final/Guide-compatible → final/Guide-final. On a failed
gate, restore the immediately preceding qualified state using its exact recorded
immutable artifacts. A complete rollback reverses those edges: restore
Guide-compatible before replacing final FDLC with bridge; restore current Guide
before replacing bridge FDLC with current FDLC. Never put Guide-final behind
bridge FDLC or a new Guide behind current FDLC as a composed state. Verify every
rollback; HTTP 200 alone does not prove route or asset ownership.

Preserve the seven-day stabilization window below. Immediate acceptance and
runtime-log observation are required after every transition and after final
public cutover. Record their actual timestamps and elapsed time separately from
the remaining seven-day observation obligation. Keep every required immutable
rollback deployment and saved asset inventory for that window; do not claim
seven days have elapsed or retire a rollback dependency before the window and
its release-owner disposition are complete.

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

The default app is the only repository that owns the authoritative
`microfrontends.json`. The Guide commits a generated, schema-pure build snapshot
at `site/config/microfrontends.generated.json` plus a provenance manifest. The
snapshot is build input, never an independently edited routing authority.

Do not add a Next.js `basePath`. Both applications use physical public routes,
and `withMicrofrontends` owns their framework asset prefixes. Guide-owned
public files live below `/guide`.

## Required evidence before production approval

- Both repositories pass typecheck, lint, unit tests, route-contract tests, and
  native `next build`.
- The Guide snapshot check records the FDLC config commit and semantic SHA-256,
  and that digest exactly matches the Guide manifest and the branch-scoped
  `FDLC_MFE_CONFIG_SHA256` value. The branch-scoped
  `FDLC_MFE_SOURCE_COMMIT` must also equal the manifest's exact FDLC commit.
- Guide Vercel builds fail when the snapshot, manifest, trusted digest, source
  commit, exact Vercel target, or target-specific approval is missing or
  mismatched. The build performs no network config fetch.
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

## Preview evidence record

Complete this record for each candidate. It does not authorize Production.

```text
Paired branch:
FDLC Preview Git commit:
FDLC config source commit:
FDLC semantic config SHA-256 (`sha256-recursive-key-sort-json-v1`):
Guide snapshot commit:
Guide snapshot path: site/config/microfrontends.generated.json
Guide snapshot check result:
Guide Preview approval: GUIDE_MFE_PREVIEW_ENABLED=true
Guide trusted source commit / scope:
Guide trusted digest / scope:
FDLC Preview deployment ID / URL:
Guide Preview deployment ID / URL:
Fallback Environment:
Preview environment-scope confirmation:
Production environment-scope confirmation:
Operator / timestamp:
```

## Preview procedure

1. Commit and push the authoritative FDLC `microfrontends.json`. Fetch the FDLC
   checkout and confirm its `origin` resolves to
   `https://github.com/jaydubya818/FDLC.git`. Confirm the config source commit
   is reachable from the approved `origin/*` branch. From the Guide's `site/`
   directory, generate and immediately verify the tracked snapshot from that
   exact checkout:

   ```sh
   npm run microfrontends:sync -- /absolute/path/to/FDLC/microfrontends.json
   npm run microfrontends:check -- /absolute/path/to/FDLC/microfrontends.json
   ```

   Commit the snapshot and manifest in the Guide repository. The manifest's
   source commit is the last FDLC commit that changed `microfrontends.json`, so
   unrelated FDLC work does not stale the Guide snapshot. Record the separate
   FDLC Preview Git commit in the evidence record. A dirty or uncommitted
   authoritative config, a source-commit mismatch, or any digest mismatch is a
   hard stop. Record the digest emitted by `microfrontends:check` using
   `sha256-recursive-key-sort-json-v1`; never substitute a raw `shasum` of
   either JSON file. The manifest is
   `site/config/microfrontends.generated.manifest.json`.
2. For only the matching Guide Preview branch, set
   `FDLC_MFE_CONFIG_SHA256` to the recorded digest,
   `FDLC_MFE_SOURCE_COMMIT` to the full FDLC commit recorded by the manifest,
   and `GUIDE_MFE_PREVIEW_ENABLED=true`. Confirm all three are absent from
   Production and confirm `GUIDE_MFE_PRODUCTION_ENABLED` is absent from the
   Preview branch. These non-secret values bind the deployment to reviewed
   input and explicitly authorize only a Preview build; changing any of them
   requires a new deployment. Never configure `GUIDE_VERCEL_BUILD` in Vercel;
   the repository-owned deployment script sets that marker.
3. Create the Microfrontends group with `fdlc` as default and
   `ai-software-factory-mastery` as child.
4. Set the group's Fallback Environment to Production and explicitly enable
   polyrepo branch routing. Confirm that the group contains only these two
   projects before any Preview deployment.
5. Establish the stable FDLC branch/Preview origin that will be used for the
   composed check.
6. Set the Guide's branch-scoped Preview `NEXT_PUBLIC_SITE_URL` to that FDLC
   origin so build-time canonicals and cross-app links use the composed context.
   Set branch-scoped `GUIDE_LEGACY_REDIRECTS_ENABLED=true` on both projects for
   the evidence builds; the flag remains unset in Production.
7. Before either candidate push, prove `FDLC_MFE_CONFIG_SHA256`,
   `FDLC_MFE_SOURCE_COMMIT`, `GUIDE_MFE_PREVIEW_ENABLED`, and
   `NEXT_PUBLIC_SITE_URL` are scoped only to the exact Guide Preview branch.
   Prove `GUIDE_LEGACY_REDIRECTS_ENABLED` is scoped only to the exact Preview
   branch on both projects. Prove all five variables plus
   `GUIDE_MFE_PRODUCTION_ENABLED` are absent from Production. Do not proceed if
   any scope is broader.
8. Push the FDLC branch so the default application's `microfrontends.json`
   produces the routed Preview. `npm run build:vercel` must first run the
   repository-root `microfrontends:check` preflight and print the recorded
   semantic digest. Vercel can otherwise warn about a missing config, continue
   an ordinary application build, and report a Ready deployment with
   `mfeConfigUploadState=no_config`; that deployment is not a candidate.
9. Check out or verify the exact FDLC Preview Git commit, rerun
   `microfrontends:check` against it, and prove
   `git show <FDLC Preview Git commit>:microfrontends.json` produces the
   recorded semantic digest.
10. Push the Guide using the same branch name. If either Preview was built
   before its branch-scoped variables were set, redeploy it; that initial build
   is not evidence.
11. Confirm both Preview deployments report the same Git branch name; Vercel
   uses matching commit or branch metadata to pair group deployments.
12. Confirm the Guide Preview is `noindex`.
13. Enable deployed routing debug headers with the `VERCEL_MFE_DEBUG=1` browser
   cookie and record:
   - `x-vercel-mfe-app`;
   - `x-vercel-mfe-target-deployment-id`;
   - `x-vercel-mfe-default-app-deployment-id`;
   - `x-vercel-mfe-matched-path`; and
   - `x-vercel-mfe-response-reason`.
   `x-vercel-mfe-default-app-deployment-id` must equal the recorded FDLC
   Preview deployment ID. On Guide routes,
   `x-vercel-mfe-target-deployment-id` must equal the recorded Guide Preview
   deployment ID. Any mismatch invalidates the candidate.
14. Run the route and browser acceptance checks against the FDLC Preview URL.

Any later push to either branch or any Preview environment change invalidates
the evidence candidate and restarts this gate.

Creating the group alone must not be treated as a release. Production behavior
changes only when the default app's routing configuration is deployed to
Production.

## Local composed development

Refresh the Guide's tracked snapshot explicitly whenever the FDLC config
changes:

```sh
cd /absolute/path/to/Guide/site
npm run microfrontends:sync -- /absolute/path/to/FDLC/microfrontends.json
npm run microfrontends:check -- /absolute/path/to/FDLC/microfrontends.json
export NEXT_PUBLIC_SITE_URL=http://localhost:3024
export GUIDE_LEGACY_REDIRECTS_ENABLED=true
```

Do not set `VC_MICROFRONTENDS_CONFIG`; the Guide configuration accepts only the
tracked generated filename. Snapshot refresh is a deliberate release action,
not a build hook or dynamic fetch.

Start the native Next.js development process for each application on the port
assigned by `microfrontends port`. In the Guide `site/` directory, use the
reviewed wrapped entrypoint rather than direct `next dev` or standalone Vinext:

```sh
npm run microfrontends:port
npm run dev:next -- --port <printed-port>
```

Then start one proxy for both application keys:

```sh
npm run microfrontends:proxy
```

Use the proxy URL—not either application server URL—for composed checks. Set
`MFE_DEBUG=1` when routing diagnostics are needed. The `--local-apps` values are
the application keys from `microfrontends.json`; the package names determine
their local ports.

## Production procedure

### 1. Confirm the compatibility release

Before creating that Production build, obtain separate Product Owner approval
to add the already-proven `FDLC_MFE_CONFIG_SHA256` and
`FDLC_MFE_SOURCE_COMMIT` values plus
`GUIDE_MFE_PRODUCTION_ENABLED=true` to the Guide's Production environment.
Confirm `GUIDE_MFE_PREVIEW_ENABLED` remains absent there. Until then, the
missing trusted inputs and Production approval deliberately make Guide
Production builds fail closed. Never promote a Preview artifact whose
branch-only environment differs from Production; rebuild in Production after
approval.

Then create a fresh Guide Production-environment deployment from the recorded
commit and approved Production environment matrix while its canonical origin
still equals the standalone Guide origin and
`GUIDE_LEGACY_REDIRECTS_ENABLED` remains unset. Confirm that the following work
directly on that origin:

- `/guide`;
- a deep `/guide/<chapter>` route;
- `/guide/search-index.json`;
- a `/guide/infographics/...` asset;
- every known legacy redirect; and
- an unknown URL returning a real 404.

If this step fails, stop. Do not promote FDLC routing.

### 2. Deploy shared-domain routing

With explicit Product Owner approval, create a fresh FDLC
Production-environment deployment from the recorded commit and approved
Production environment matrix. Never promote a Preview deployment. The fresh
deployment must contain `microfrontends.json`; explicitly set FDLC Production
`GUIDE_LEGACY_REDIRECTS_ENABLED=true` so FDLC-owned requests on the retired
Guide host are guarded too. Immediately check:

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
2. Set Guide Production `GUIDE_LEGACY_REDIRECTS_ENABLED=true`, then create a
   fresh Guide Production-environment deployment from the recorded commit and
   approved Production environment matrix. Never promote a Preview deployment.
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
- framework assets: every Guide JavaScript and CSS URL uses the generated
  `/vc-ap-.../_next/` prefix and returns 200;
- failure behavior: one unknown FDLC URL and one unknown Guide URL;
- browser behavior: FDLC → Guide → FDLC, Back navigation, a hash target, and a
  same-origin route redirect carrying repeated and encoded query parameters;
- hydration behavior: search updates results, theme state changes, Mermaid
  renders to SVG, and the branded Guide 404 remains visible after hydration;
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

Use `x-vercel-mfe-app` and the matched path to identify the owner. For a Guide
canonical or Guide-owned redirect failure, restore the Guide compatibility
deployment, which keeps the Guide reachable on both surfaces while it is
corrected. For an FDLC-owned retired-host failure such as `/` or
`/architecture`, restore the recorded previous FDLC deployment. Do not roll
back the other application when its routes are healthy.

The recovery target is five minutes from the rollback decision to healthy
responses for `/guide`, a deep chapter, search data, and one asset.

## Seven-day stabilization

This observation obligation carries forward into the active migration bridge
plan; it does not reinstate the superseded execution or rollback recipes above.

Monitor Microfrontends routing, 404s, redirect traffic, search-index failures,
asset failures, Core Web Vitals, and application errors for seven days. Retain
the exact recorded starting, bridge, Guide-compatible and final deployment
artifacts and their saved asset inventories during this window. Do not add or
restore shadow Guide code to the final source. Retire rollback dependencies only
after the window, traffic/error evidence and release-owner disposition establish
that rollback no longer depends on them.

## References

- [Vercel Microfrontends quickstart](https://vercel.com/docs/microfrontends/quickstart)
- [Microfrontends configuration](https://vercel.com/docs/microfrontends/configuration)
- [Polyrepo local development](https://vercel.com/docs/microfrontends/local-development)
- [Testing and troubleshooting](https://vercel.com/docs/microfrontends/troubleshooting)
- [Managing preview fallbacks](https://vercel.com/docs/microfrontends/managing-microfrontends)
- [Preview links across grouped projects](https://vercel.com/changelog/preview-links-between-microfrontends-projects-now-serve-all-paths)
- [Branch-domain routing across grouped projects](https://vercel.com/changelog/microfrontends-routing-now-applies-to-vc-alias-and-branch-domains)
- [Next.js Multi Zones fallback](https://nextjs.org/docs/pages/guides/multi-zones)
