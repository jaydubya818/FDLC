# Source integration and Production release

Decision: approved 2026-09-05. Keep this policy after the ecosystem integration.

Merging to `main` no longer automatically deploys Production for these projects. Production deployment requires a separately authorized release action.

The source/release separation is enforced by `git.deploymentEnabled.main = false` in each effective Vercel configuration:

| Project | Repository configuration |
| --- | --- |
| FDLC | Root `vercel.json` |
| Guide | `site/vercel.json` in the Guide repository |
| Guide companion | Root `vercel.json` in the Guide repository |
| Mission Control UI | Root `vercel.json` in Mission Control |

The branch-specific rule preserves automatic Preview deployments for other branches. It does not disable the Vercel integration, manual release commands or existing CI. Existing framework/build settings, headers, rewrites, asset prefixes, MFE configuration, protection and environment handling are preserved.

The guard was introduced because merging the documentation integration otherwise triggered Production builds, and FDLC plus the Guide companion also automatically assigned Production domains. Merge approval does not grant release authority. The separate FDLC/Guide migration-bridge release process remains authoritative for Production, including immutable artifacts, composition checks, explicit promotion, observation and rollback. Mission Control retains its own governed release gates.

The approved flow is Preview → qualification → PR → merge → clean-main qualification, followed only under separate authorization by a controlled Production release. A passing integration or Preview does not qualify a Production artifact.

## Verification and removal

For this integration, retain exact PR heads and Preview deployment IDs, verify the rule on each landed main, and compare Production deployment identities, canonical aliases and protection metadata before and after every merge. Stop the merge sequence if any automatic Production deployment starts despite the guard.

Future removal requires a separate explicit deployment-policy decision and reviewed change. The exact rollback is to remove or change the `main: false` entry in each applicable configuration. That change can itself re-enable automatic Production deployment when it lands; review it as a release-policy action. Do not remove the rule merely because this integration completed.

See [Vercel Git configuration](https://vercel.com/docs/project-configuration/git-configuration) for documented branch-specific deployment behavior. Final observed results and source identities belong in the ecosystem integration review record.
