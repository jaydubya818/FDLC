# Migration bridge: read-only platform preflight and staging boundary

Observed 2026-09-05 20:05:33–20:05:46 UTC. Public schema and installed Vercel CLI 50.35.0 inspected afterward. No remote mutations, deployments, aliases, merges, environment writes, bypass use, or credential reads were performed by this reviewer.

## Current authority

Latest decision is attachment `1d64e063-98e9-4157-91fa-30d5dff7ab21/pasted-text.txt`. `OLD_GUIDE_SEARCH_FOCUS_TRAP` is **KNOWN_EXCEPTION / ACCEPTED_TEMPORARILY** for the exact old Guide `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur` in the bridge/old window only; it expires on leaving that window. It is not PASS and does not apply to the repaired/new Guide.

The latest decision does not authorize Production bridge deployment, promotion, canonical aliases, or PR merges. Production-target deployment discussion below is future conditional research, not an executable approved plan.

## Identity and protection snapshot

- FDLC Production: `dpl_GvmTzMNUmpKt3825k69MUgL6YwTX`, SHA `e4112bb06333b8244c18fc4a9736b1f3c807bc78`, READY. Canonical aliases unchanged.
- Guide Production: `dpl_EZemFq1QbGX1YG5WG8C1BAmd8Yur`, SHA `87d3841f96353d03278311dfc7e7b2d25649a331`, READY. Canonical aliases unchanged.
- MFE group: `mfe_1we4N3uLnAPIkT2Gpgv2T4NJ5PO4`, fallback `PRODUCTION`, polyrepo branch routing enabled, current Production config deployment remains old FDLC Gvm. Old Production `no_config` is an existing baseline condition, not a new successful production configuration.
- Both projects retain `all_except_custom_domains` SSO. FDLC automation-bypass metadata count remains zero. Guide count remains one pre-existing automation bypass; no value was read or used. Consequently, do not claim all project-wide bypass entries are revoked.
- FDLC saved project settings remain framework/buildCommand/rootDirectory null; Node 24.x; auto-assign custom production domains true.
- Guide saved settings remain framework nextjs, rootDirectory `site`, buildCommand null, Node 24.x, source files outside root enabled; auto-assign custom production domains false.
- All observed environment entries are Preview-only. Current paired branch has FDLC `FDLC_BRIDGE_GUIDE_ORIGIN` plus Guide `FDLC_MFE_CONFIG_SHA256`, `GUIDE_MFE_PREVIEW_ENABLED`, `NEXT_PUBLIC_SITE_URL`, and `FDLC_MFE_SOURCE_COMMIT`, all encrypted entries scoped to `codex/fdlc-guide-migration-bridge`. Values were not retained/read by this preflight. No Production-target entries returned.

Raw sanitized evidence: `keyboard-exception-platform-preflight.json` in this directory.

## Preview and Draft PR snapshot

- FDLC: `dpl_GYsajDzvwdN52HkApSK12SmUkA7A`, `982c5626a301792d00accf1d05d23327b6296067`, READY, config upload success. Immutable URL `https://fdlc-9fd96dafq-jaydubya818.vercel.app`; assigned branch alias `https://fdlc-git-codex-fdlc-guide-migration-bridge-jaydubya818.vercel.app`.
- Guide: `dpl_EYYQaUg7BAcUhVVtQTzxMjFCJgLN`, `8cf00f9e1882fb01af58d22a95881d4833d39d06`, READY. Immutable URL `https://ai-software-factory-mastery-pxvr0h18x-jaydubya818.vercel.app`; assigned branch alias `https://ai-software-factory-mastery-git-codex-fdlc-g-cf0ba7-jaydubya818.vercel.app`.
- Both deployments have real GitHub gitSource with the same non-main branch name, their own repository IDs, and the exact SHAs above. This is a topology checkpoint, not qualification of the pending keyboard repair.
- FDLC PR 12 and Guide PR 12 remain open, Draft, unmerged at those source heads. At the snapshot, both descriptions still said the keyboard exception was not granted and qualification was paused; update those stale descriptions/records in the authorized workflow.
- Both GitHub combined statuses are success. Actual returned checks are Vercel deployment statuses and Vercel Preview Comments. Zero GitHub Actions workflow runs returned for those SHAs. Do not equate this with complete repository acceptance/review coverage.

## Supported Preview creation shape

Use the existing authenticated API path and real branch-scoped Preview pins; omit `target`, `projectSettings`, `files`, and `withLatestCommit`. Example FDLC body, not executed here:

```json
{
  "name": "fdlc",
  "project": "prj_MTztpwHj7IeGwuSMUzdcytLjo6zs",
  "gitSource": {
    "type": "github",
    "repoId": 1356471667,
    "ref": "codex/fdlc-guide-migration-bridge",
    "sha": "982c5626a301792d00accf1d05d23327b6296067"
  }
}
```

Endpoint: `POST /v13/deployments?teamId=team_p8z8exJRTGfOPk1GC9vUOpv3&forceNew=1`. Guide uses project `prj_KZQBsEEmJMnEpCx3DHW4mfzIOAuO`, name `ai-software-factory-mastery`, repository ID `1321328855`, and the fully qualified, actually published repaired SHA. Verify the real branch resolves to the supplied SHA before requesting a deployment; do not fabricate Git metadata.

This omits the documented settings-persistence field. Existing Preview requests using this pattern have not changed the saved settings observed above. It still creates a Preview deployment and its normal Preview alias, so it is not a claim of zero remote side effects.

After the repaired Guide is frozen/published and READY, create a fresh FDLC Preview at its exact qualified bridge revision, then record actual composed Guide deployment/asset provenance. Do not treat an older FDLC Preview or a moving Guide branch alias as proof of the new pair. Keep the old exact-artifact exception explicit. The branch currently has a new Guide deployment, so a fresh same-branch Preview must not be described as an old-Guide fallback test without readback proving that selection.

Final FDLC/repaired Guide qualification needs genuine paired non-main refs and separate compatibility/final-mode artifacts as required by the migration plan. Neither a Preview nor an unpromoted Production-target deployment proves the live Production-current pair: Vercel documents that Production requests use each project's promoted Production deployment.

## Future Production staging: unsupported combination under the present constraints

No documented supported route was found in installed CLI 50.35.0 or the public deployment API that combines all four requirements:

1. Exact Git-provider `gitSource` fetch.
2. Production target without production-domain promotion/alias assignment.
3. Per-deployment build/runtime pin overrides.
4. No saved project-settings/environment mutation.

The public OpenAPI downloaded directly from `https://openapi.vercel.sh/` has `additionalProperties: false` on `/v13/deployments` POST body. Top-level keys are `customEnvironmentSlugOrId`, `deploymentId`, `files`, `gitAccessToken`, `gitMetadata`, `gitSource`, `meta`, `monorepoManager`, `name`, `project`, `projectSettings`, `target`, `withLatestCommit`. It does **not** document `env`, `build`, or `autoAssignCustomDomains`. Do not invent these fields in a public API request, or put variables in unrelated metadata.

The documented CLI supports `--prod --skip-domain`, `--build-env KEY=VALUE`, and `--env KEY=VALUE`. However, installed source constructs and sends `projectSettings` from local `vercel.json` plus saved root/Node context. FDLC would send framework `nextjs` and buildCommand `npm run build:vercel` while the saved project has null/null. The API documents settings supplied in `projectSettings` as persisting for following deployments. `--skip-domain` disables automatic production-domain promotion; it does not suppress project-settings handling. Therefore this recipe has a material settings-mutation risk and is not approved as a no-settings-change procedure.

A clean normal clone would preserve ordinary Git discovery better than a linked worktree and avoid missing `.git/config` assumptions, but CLI deployment is source upload with `gitMetadata`, not the same exact provider-fetch contract as `gitSource`. A clean clone does not remove the settings-persistence risk. For Guide, CLI cwd would be the clean repository root, not `site`, because saved rootDirectory `site` is appended by CLI; source outside the site root must remain available. Setting VERCEL_ORG_ID/VERCEL_PROJECT_ID can avoid local linking artifacts, but does not suppress `projectSettings`.

Installed `vercel redeploy` sends deploymentId/target/customEnvironmentSlugOrId and offers no per-env override or skip-domain control. Public `deploymentId` redeployment inherits original settings/environment; `withLatestCommit=true` explicitly discards the prior SHA. Neither is a safe workaround for switching Preview gates to Production gates with no aliases/settings changes.

Future next step: obtain Vercel confirmation of a supported contract satisfying these constraints, or obtain explicit user approval for a precisely enumerated alternative workflow/settings impact. Do not deploy Production while that boundary is unresolved. This does not block authorized Preview qualification.

## Sources

- [Create deployment API](https://vercel.com/docs/rest-api/deployments/create-a-new-deployment): gitSource, target, inherited redeployment data, and projectSettings persistence.
- [Public OpenAPI schema](https://openapi.vercel.sh/): exact allowed request keys and additionalProperties false; read directly on 2026-09-05.
- [CLI deploy](https://vercel.com/docs/cli/deploy): build/runtime environment flags and scope of skip-domain.
- [CLI global options](https://vercel.com/docs/cli/global-options): project/team identifier environment variables.
- [Managing microfrontends](https://vercel.com/docs/microfrontends/managing-microfrontends): fallback only applies to Preview/custom environments; Production-current routing.
- Installed source `/opt/homebrew/lib/node_modules/vercel/dist/commands/deploy/index.js`, lines 1421–1486: override construction and projectSettings.
- Installed source `/opt/homebrew/lib/node_modules/vercel/dist/chunks/chunk-MRILE22L.js`, approximately lines 4560–4635: CLI request body includes env/build/projectSettings/autoAssignCustomDomains.
- Installed source `/opt/homebrew/lib/node_modules/vercel/dist/commands-bulk.js`, lines 23870 onward: redeploy body and options.

## Independent final keyboard delta review

Review against Guide HEAD `221766d7b990ff8015244de516f6a081f770c17c` of the two uncommitted files `site/app/components/CommandPalette.tsx` and `site/scripts/check-next-runtime.mjs`: **PASS** for architecture/security/simplicity, no material findings. The change captures/restores the actual invoking control, safely falls back to the trigger, and expands deterministic keyboard/mouse regression to 16 direct/reload/theme/viewport/repeat cases. No rendering/styles/routes/snapshot/prefix/env/protection/dependency/Mission Control change. Independent targeted ESLint, syntax check, and diff check passed. This review does not substitute for the parent's full native/hosted runtime qualification.
