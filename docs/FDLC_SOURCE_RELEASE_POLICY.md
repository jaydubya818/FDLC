# Source integration and Production release

Decision: approved 2026-09-05. Keep the FDLC `main`-branch deployment guard
until a separate policy decision removes it.

## Policy

**MERGE != PRODUCTION DEPLOYMENT.**

Pull-request and feature branches continue to receive automatic Preview
deployments. Merges to `main` do not automatically deploy Production because
the effective root `vercel.json` sets `git.deploymentEnabled.main` to `false`.

Production requires separate, explicit release authorization. The existing
migration-bridge release process remains authoritative; this source-integration
guard does not change its approval, qualification, rollout, observation, or
rollback requirements.

The guard changes no framework or build setting, environment, domain, alias,
credential, protection rule, Microfrontend behavior, or asset behavior. Removing
or weakening it requires a separate reviewed deployment-policy decision because
that change can re-enable automatic Production deployments from `main`.

For every guarded merge, retain the exact Preview source and deployment identity,
then verify that no new Production deployment or canonical alias movement
occurred. A guarded source merge is not evidence of a Production release.
