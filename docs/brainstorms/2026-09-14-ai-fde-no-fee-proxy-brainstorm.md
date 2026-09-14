---
date: 2026-09-14
topic: ai-fde-no-fee-proxy
---

# AI-FDE no-fee proxy

## What we're building

FDLC keeps `/deploy/app` on its canonical origin while forwarding that exact prefix to the independently deployed AI-FDE Next.js application. The child remains built with `basePath: "/deploy/app"`, and the shell pins an immutable child Preview URL only after that candidate qualifies.

## Why this approach

Adding a third project to the managed Vercel Microfrontends group would add a $250 monthly project fee plus routed-request usage. Vercel external rewrites provide the same same-origin URL behavior for this bounded route without that fixed subscription. Embedding AI-FDE in the FDLC build was rejected because it would erase the required independent deployment and rollback boundary.

## Key decisions

- Keep managed Microfrontends unchanged for FDLC and the Guide.
- Route only `/deploy/app/:path*` through a Vercel external rewrite.
- Pin Preview to the qualified immutable child deployment `dpl_5dZYnmLEixasnyXjzQki6KDedHox` (`ai-64p4dfzr2-jaydubya818.vercel.app`).
- Keep the FDLC Preview protected. Expose only the browser-local AI-FDE synthetic Preview so the platform rewrite can retrieve it without an authentication redirect; its Vercel build is locked to the invalid API origin, makes no live API or model calls, contains no customer data or Production credentials, and remains `noindex`.
- Keep `git.deploymentEnabled.main=false` for both projects; merge remains distinct from Production release.
- Treat the pinned child URL and FDLC shell deployment as a qualified pair. Roll back by restoring the prior compatible shell deployment; its rewrite remains bound to the prior child.

## Open questions

- Production origin and promotion remain intentionally unresolved until a separate Production release is authorized.

## Next steps

Implement the narrow rewrite, remove the AI-FDE child dependency on managed Microfrontends, pin the qualified child Preview, expose only the public-safe synthetic child artifact, then qualify the composed FDLC Preview.
