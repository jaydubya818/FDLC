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
| `/factory-engineering#intake-to-review` | Four keyboard-operable examples for issue admission, intent/specification, candidate-bound review and correlated alert response. |
| Guide companion change | Additions in existing canonical chapters and the engineering-experience appendix, with TSF crosswalk, glossary aliases and accepted research provenance. |

The nine-stage governing lifecycle, existing lifecycle crosswalks, Factory Definition v0.2 schema, Mission Control boundary, Microfrontends routing, and production-deployment guards remain unchanged. The operating profile is not an executable manifest. The browser review is explicitly synthetic.

## Warp course and article follow-up

The follow-up source review covers all ten supplied Warp Learn lessons and the supplied article, *How to build a software factory you'll actually use*. The Guide's research intake maps each source to its existing canonical owner. Existing coverage of roles, scoring, benchmarking and governed learning is retained; the additions make the intake and review handoffs concrete.

The site playbook follows one illustrative API repair through an admitted issue, an approved specification revision, candidate-bound evidence and a later correlated incident. Native disclosures show input/output records, possible dispositions, decision boundaries and primary-source links. The section is instructional; it does not connect a tracker, verifier, monitor or runtime.

The Guide adds answer/change/unclear triage, researched facts versus product decisions, backlog/alert examples, a user-flow verification preflight and a first-batch calibration exercise. Its existing five review-risk dimensions now explicitly preserve evidence gaps and remain advisory to policy. Chapter 41 corrects two older conflations: a manifest is an authoring input to a Factory Version, and a merged definition revision is not qualification or authorization to activate it. Its diagram makes qualification and activation distinct.

## Executable deliverable

Reference Lab **v1.2.0** adds `operations.mjs`, its subprocess tests and a fixed runtime teaching profile to the original eight-scenario Lab. It records intake, separate Attempt workspaces, candidate hashes, verifier output, local effect receipts and operator decisions.

The companion demonstrates duplicate intake, process restart, unknown-effect reconciliation, exact candidate/verifier-output binding, bounded correction and cumulative parent budget enforcement. Its local acceptance never performs a release. It uses a scripted producer, manual intake and serialized same-machine CLI ownership; it does not qualify a scheduler, live agent, distributed lease or security boundary.

Published archive: `/downloads/fdlc-reference-lab-v1.2.0.zip`

SHA-256: `3a4cd83b8cb09b28d04892e243d7bc1f48d14864b5e94a93c58594a23519fd58`

All 13 packaged sources have matching public readable mirrors and per-file hashes. Both CLI entrypoints resolve their filesystem paths before checking whether they were invoked directly, including macOS temporary-directory aliases and directory symlinks.

## Local evidence

| Check | Result |
| --- | --- |
| FDLC typecheck, including Fab types | Passed |
| FDLC lint | Passed |
| FDLC unit suite after CLI portability correction | 117 passed |
| FDLC Vinext build and rendered routes | Passed; 31 rendered-route tests |
| FDLC native Next production build and emitted CSS | Passed |
| Existing Factory Skills starter package/test gate | Passed; 17 tests |
| Original Reference Lab scenarios from fresh ZIP extraction | 8 passed |
| Original contracts plus operating subprocess tests from fresh ZIP extraction | 18 passed, including both CLI entrypoints through real directory symlinks |
| Operating demo and fresh status from extraction | 10 checks passed; expected retained state and one receipt |
| Deterministic Lab package/mirror check after CLI portability correction | Passed |
| Guide lint, types and Markdown links | Passed; 77 Markdown files checked |
| Guide build/test suite | 90 passed |
| Guide native Next compile, static generation and emitted CSS | Passed; 89 pages |
| New Guide heading links | 27 checked; no missing targets |

Local managed visual preview stopped at the Cloudflare development runtime's `uv_interface_addresses` environment error. Browser execution is not qualified locally: the pinned Chromium binary is absent and its download endpoint returns HTTP 403. Guide's native runtime check reached browser launch after successful compilation. These environment limitations do not count as passing browser gates.

The repository browser suite now includes the six morning-review scenarios, both reconciliation branches, receipts, keyboard/mobile focus, reduced motion, profile validation and exact export contents, both presets, the tutorial handoff, and the fully expanded intake playbook. The existing hosted CI must execute those checks on the exact pull-request source. Fab's contained native gate remains owned by its declared macOS arm64 CI environment.

## Hosted qualification history

The Guide's initial candidate at `3f70b75f7669ca007d527933f4636e2e55a24ad7` passed its full hosted workflow, including browser and native runtime checks. FDLC's initial candidate at `a8a7dc2c24f5a99a41ec8ce0f0d6e11ee8a3fb33` reached a macOS CLI entrypoint failure in its unit gate: a temporary-directory path alias caused a subprocess to exit without running the command. The canonical-path correction and two real-subprocess regressions address that failure. A fresh hosted run must qualify the corrected source before release.

## Release contract

Follow `docs/integrations/source-release-policy.md`. Qualify both repository previews, merge through pull requests, qualify clean main, then select and verify the exact FDLC/Guide deployment pair before controlled production release. Preserve `git.deploymentEnabled.main = false`; a source merge is not a production deployment.

The current Vercel connector returned a team-scope authorization error during project inspection. Team access must be authorized through the supported consent flow before this connection can inspect and release that exact deployment pair. No protection, environment, alias, project setting or production release was changed as part of this implementation.
