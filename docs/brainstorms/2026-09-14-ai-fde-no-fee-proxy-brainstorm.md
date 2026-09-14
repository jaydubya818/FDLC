---
date: 2026-09-14
topic: ai-fde-no-fee-proxy
---

# AI-FDE no-fee proxy

## What we're building

FDLC keeps `/deploy/app` on its canonical origin while forwarding that exact prefix to the independently deployed AI-FDE Next.js application. The child remains built with `basePath: "/deploy/app"`, and a stable Preview alias moves only after a candidate child deployment qualifies.

## Why this approach

Adding a third project to the managed Vercel Microfrontends group would add a $250 monthly project fee plus routed-request usage. Vercel external rewrites provide the same same-origin URL behavior for this bounded route without that fixed subscription. Embedding AI-FDE in the FDLC build was rejected because it would erase the required independent deployment and rollback boundary.

## Key decisions

- Keep managed Microfrontends unchanged for FDLC and the Guide.
- Route only `/deploy/app/:path*` through a Vercel external rewrite.
- Point Preview at `ai-fde-fdlc-preview.vercel.app`, a stable alias in the same Vercel team.
- Keep Vercel Authentication enabled. Vercel supports authenticated rewrites between protected deployments in the same team.
- Keep `git.deploymentEnabled.main=false` for both projects; merge remains distinct from Production release.
- Treat the alias and FDLC shell deployment as a qualified pair. Roll back by restoring the prior child alias target and compatible shell deployment.

## Open questions

- Production origin and promotion remain intentionally unresolved until a separate Production release is authorized.

## Next steps

Implement the narrow rewrite, remove the AI-FDE child dependency on managed Microfrontends, deploy and bind the qualified child Preview alias, then qualify the composed FDLC Preview.
