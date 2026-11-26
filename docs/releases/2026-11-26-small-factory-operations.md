# Small-factory operating path

Status: implemented release candidate; hosted browser and composed-deployment qualification required before production.

## Purpose and reader experience

The existing FDLC journey explains a bounded factory and its evidence gates. This update adds the recurring operating experience: specialize one workload, preserve its records across a restart, review the exact candidate, and learn from measured outcomes.

| Surface | Addition |
| --- | --- |
| `/` | A focused invitation to the operating exercise and morning review, within the existing four-step journey. |
| `/start` | Test-repair and documentation-drift presets; a separate design-only Operating Profile export with owner, intake, time zone, shared limits, recovery rules and review target. |
| `/lab#operate-a-small-factory` | Template-to-operation walkthrough, persisted local exercise, six review situations and outcome/attention measurement. |
| `/simulator#morning-review` | Six fixed examples with distinct execution, verification, authorization and observed-outcome states; retained receipts and exact-subject decisions. |
| `/factory-engineering#small-factory-operations` | Agent inspection, authorized action parity, specialist roles and controlled template changes. |
| Guide companion change | Additions in existing canonical chapters and the engineering-experience appendix, with TSF crosswalk, glossary aliases and accepted research provenance. |

The nine-stage governing lifecycle, existing lifecycle crosswalks, Factory Definition v0.2 schema, Mission Control boundary, Microfrontends routing, and production-deployment guards remain unchanged. The operating profile is not an executable manifest. The browser review is explicitly synthetic.

## Executable deliverable

Reference Lab **v1.2.0** adds `operations.mjs`, its subprocess tests and a fixed runtime teaching profile to the original eight-scenario Lab. It records intake, separate Attempt workspaces, candidate hashes, verifier output, local effect receipts and operator decisions.

The companion demonstrates duplicate intake, process restart, unknown-effect reconciliation, exact candidate/verifier-output binding, bounded correction and cumulative parent budget enforcement. Its local acceptance never performs a release. It uses a scripted producer, manual intake and serialized same-machine CLI ownership; it does not qualify a scheduler, live agent, distributed lease or security boundary.

Published archive: `/downloads/fdlc-reference-lab-v1.2.0.zip`

SHA-256: `2d724997045d371a71479dc9630cbe613bd8a24378f5ebe3dc5c7c4b896d68d6`

All 13 packaged sources have matching public readable mirrors and per-file hashes. The final repack changes README wording only from the independently executed archive; executable file hashes are unchanged.

## Local evidence

| Check | Result |
| --- | --- |
| FDLC typecheck, including Fab types | Passed |
| FDLC lint | Passed |
| FDLC unit suite on final feature logic | 115 passed |
| FDLC Vinext build and rendered routes | Passed; 31 rendered-route tests |
| FDLC native Next production build and emitted CSS | Passed |
| Existing Factory Skills starter package/test gate | Passed; 17 tests |
| Original Reference Lab scenarios from fresh ZIP extraction | 8 passed |
| Original contracts plus operating subprocess tests from extraction | 16 passed |
| Operating demo and fresh status from extraction | 10 checks passed; expected retained state and one receipt |
| Deterministic Lab package/mirror check after final README precision edit | Passed |
| Guide lint, types and Markdown links | Passed; 77 Markdown files checked |
| Guide build/test suite | 90 passed |
| Guide native Next compile, static generation and emitted CSS | Passed; 89 pages |
| New Guide heading links | 27 checked; no missing targets |

Local managed visual preview stopped at the Cloudflare development runtime's `uv_interface_addresses` environment error. Browser execution is not qualified locally: the pinned Chromium binary is absent and its download endpoint returns HTTP 403. Guide's native runtime check reached browser launch after successful compilation. These environment limitations do not count as passing browser gates.

The repository browser suite now includes the six morning-review scenarios, both reconciliation branches, receipts, keyboard/mobile focus, reduced motion, profile validation and exact export contents, both presets, and the tutorial handoff. The existing hosted CI must execute those checks on the exact pull-request source. Fab's contained native gate remains owned by its declared macOS arm64 CI environment.

## Release contract

Follow `docs/integrations/source-release-policy.md`. Qualify both repository previews, merge through pull requests, qualify clean main, then select and verify the exact FDLC/Guide deployment pair before controlled production release. Preserve `git.deploymentEnabled.main = false`; a source merge is not a production deployment.

The current Vercel connector returned a team-scope authorization error during project inspection. Team access must be authorized through the supported consent flow before this connection can inspect and release that exact deployment pair. No protection, environment, alias, project setting or production release was changed as part of this implementation.
