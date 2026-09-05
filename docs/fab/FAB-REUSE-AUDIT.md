# Fab reuse audit

Date: 2026-09-05. Phase A: completed source audit. This is a source and test inventory, not a production certification. No deployed service, owner credential, browser login, cloud profile, `.env` value, or credential store was used.

## Baseline and method

| Repository | Studied revision | Findings |
| --- | --- | --- |
| FDLC | `e4112bb` | Next/React public site, content models, deterministic unit/rendered-route tests; no coding-agent runtime. Working branch `codex/fab` already existed. |
| Mission Control (MC) | `07a96ac` | TypeScript/pnpm packages, Convex authority, orchestration worker, execution-only harness adapters, local worktrees and remote sandbox supervision. |
| AI Software Factory Guide (Guide) | `87d3841` | Architecture doctrine and a documentation site; no reusable execution service. |
| AI-FDE | `4c97374` | Python/FastAPI/Postgres evidence-to-intent product, Bedrock extraction, OIDC sessions, worker leases and artifact generation; internal alpha, synthetic-data qualification. |

All four working copies have pre-existing changes/untracked files. Those are excluded from this work. Findings below concern the named source files at the audited checkout; historical evidence is not a new Fab execution. No remote repository was fetched or published.

Read the README/build manifests, applicable project guidance, runtime/provider/credential contracts, representative implementations and test inventories. Traced MC from `convex/executionWorker.ts` through `apps/orchestration-server/src/factoryAttemptWorker.ts`, harness registry and adapter contracts, candidate collection, verification and GitHub publication. Traced AI-FDE's extraction, identity, telemetry and sandbox ADR. Cross-checked Guide chapters 13, 15, 21 and 33 and FDLC's product boundaries.

## Source index

Paths in this index are repository-relative. Matrix IDs refer to these concrete sources.

- **MC1** — `packages/workflow-engine/src/executorAdapter.ts`, `harnessContract.ts`, `harnessManifests.ts`; `apps/orchestration-server/src/harnessAdapterRegistry.ts` and its tests. Generic contract v1, capability digest, execution lifecycle, authority domains all `NONE`.
- **MC2** — `packages/model-router/src/types.ts`, `router.ts`, `cost-estimator.ts`, `providers/openai.ts`, `providers/claude.ts`, `__tests__/router.test.ts`. Completion routing and pricing; string-only messages cannot faithfully carry multi-turn tool results.
- **MC3** — `apps/orchestration-server/src/codexExecutorAdapter.ts`, `deepseekHarnessExecutorAdapter.ts` and corresponding tests. External agent adapters, process cancellation, environment handling, native-event normalization and capability reports.
- **MC4** — `apps/orchestration-server/src/factoryGitRuntime.ts`, `factoryPathScope.ts`, `factoryWorkspaceOwnership.ts`, `harnessRepository.ts` and tests. Frozen-base worktrees, path validation, candidate capture, ownership and dependency preparation.
- **MC5** — `convex/executionWorker.ts`, `executionRequests.ts`, `lib/executionRecovery.ts`, `lib/executionManifest.ts`, `lib/executionPolicy.ts`; lease/recovery/manifest tests under `convex/__tests__/`.
- **MC6** — `apps/orchestration-server/src/sandboxProvider.ts`, `sandboxSupervisor.ts`, `sandboxReconciler.ts`, `sandboxCredentials.ts`, `infra/remote-sandbox/`; provider, broker and supervisor tests.
- **MC7** — `packages/workflow-engine/src/verification{Independence,Identity,Authority,Subject,Currentness,Plan,Decision}.ts`; `apps/orchestration-server/src/factoryVerification.ts`; `convex/lib/verificationPersistence.ts`, `evidenceAuthority.ts` and tests.
- **MC8** — `convex/githubAppConnections.ts`, `lib/githubAppAuth.ts`, `lib/factoryHumanReview.ts`, `lib/deliveryAuthorization.ts`; `apps/orchestration-server/src/githubAppPublisher.ts`, `githubAppRuntime.ts`, `auth.ts`; GitHub and authorization tests.
- **MC9** — `packages/context-tools/src/{manifest,resolver,lock,skillFrontmatter,skillLint}.ts`; `convex/context/{packages,manifests,activation,evals}.ts`; context-tool and registry tests.
- **MC10** — `convex/lib/{observability,observabilityPersistence,workflowObservability,factoryMemoryTelemetry,executionRouting}.ts`; `packages/model-router/src/execution-routing.ts`; observability/routing tests.
- **MC11** — `apps/mission-control-ui/src/harness/`, `packages/cli/src/commands/workOrder.ts`, `packages/agent-runtime/src/{lifecycle,heartbeat,persona}.ts`, `packages/coordinator/src/loop.ts`; `docs/product/software-factory-capability-maturity.md`.
- **FDE1** — `src/ai_fde/adapters/extraction.py`, `config.py`, `modules/knowledge/extractor.py`, `tests/unit/test_bedrock_extraction.py`. Bedrock Converse extraction, explicit typed result validation, production configuration gates.
- **FDE2** — `src/ai_fde/modules/identity/{service,oidc,sessions}.py`, `telemetry.py`, `adapters/storage.py`, `worker.py`, `models.py`; identity and telemetry unit tests. OIDC ownership, opaque session tokens, metadata-only HTTP logs, stored artifacts/jobs.
- **FDE3** — `src/ai_fde/modules/artifacts/service.py`, `modules/engagements/evaluation.py`, `docs/adr/0006-sandboxed-coding-agent-execution.md`. Versioned engineering packet; coding orchestration explicitly post-V1 and not implemented.
- **G1** — `guide/03-build/{13-control-plane-orchestrator-and-execution-plane,15-coding-harnesses-and-agent-protocols,21-models-and-capability-selection}.md`, `guide/04-prove/33-security.md`; context/skill chapters. Doctrine, not runnable infrastructure.
- **D1** — FDLC `README.md`, `package.json`, `data/{fdlc,mission-control,guide}.ts`, `docs/MISSION_CONTROL_PUBLIC_CAPABILITIES.md`. Public vocabulary and maturity labeling, not an agent backend.

## Capability matrix

Readiness: **I/T** means implemented with relevant tests present in its owning repository, not rerun here; **partial** means capability or qualification gaps; **designed** is documentation only; **absent** means not found in inspected runtime sources. Reuse can mean contract or service integration, not copying code.

| Capability | Existing implementation | Repo | Reusable? | Modification required? | Production readiness | Fab ownership | MC ownership | Deferred? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Model abstraction | MC2 completion interfaces | MC | Concepts | Typed tool-result messages, null usage, cancellation | Partial | Native model interface | Governed route eligibility | No |
| Model providers | MC2 OpenAI/Anthropic; FDE1 Bedrock | MC/FDE | Reference | Fresh credential boundary and parser qualification | Partial for coding | Provider adapters | Admitted profile | Two paths first |
| Provider credentials | MC6 attempt broker; FDE1 service identity | MC/FDE | Governed broker | User ownership and local secret references | Partial for BYOK | Local CredentialProvider | Execution grants | Hosted store deferred |
| Streaming | MC3 process JSONL, MC1 events | MC | Event shape | Native event transport; model SSE later | I/T events | Local progress | Durable governed events | Model deltas deferred |
| Agent execution loop | MC3 external agents; MC11 coordinator | MC | Harness seam | New bounded inner engineering loop | No native Fab loop | Reason/tool/observe | Admission and attempts | No |
| Tool calling | MC2 tool schema; MC3 external tools | MC | Concepts | Strict args and result round trips | Partial | Native tool dispatch | Permitted capabilities | No |
| Tool permissions | MC1/4/5 capability, path and policy gates | MC | Contracts | Local non-escalating policy | I/T governed | Local intersection | Authority | No |
| Shell execution | MC3 process invocation | MC | Design | Explicit check IDs, scrubbed env, OS containment | I/T bounded adapters | Check runner | Admitted environment | Arbitrary shell deferred |
| Filesystem editing | MC3 delegates edits | MC | No direct primitive | Native scoped file tools | Absent standalone | Read/write/edit | Scope and environment | No |
| Git support | MC4 candidate/worktree functions | MC | Concepts/service | Credential-free local read operations | I/T | Status/diff | Governed Git lifecycle | No |
| GitHub integration | MC8 installation and publisher | MC | Service | Bind Fab candidates through MC | I/T, deployment gates | Metadata linkage | Tokens and publication | M4 |
| Local worktrees | MC4 ownership/frozen-base | MC | Service | Adapter consumes assigned worktree | I/T | Work within assigned root | Allocation/recovery | Developer auto-worktrees deferred |
| Sandbox support | MC6 provider/supervisor | MC | Service | Fab conformance/admission | Restricted tuple qualified, not universal | Local checker boundary | Governed sandbox | Remote deferred |
| Workers | MC5/6; FDE2 domain worker | MC/FDE | MC service | Register admitted Fab adapter | I/T | Inner session | Worker identity/lifecycle | M4 |
| Remote execution | MC6 | MC | Service | Exact Fab profile qualification | Partial, gated | Execute assigned task | Provision/lease/cleanup | M7 |
| Identity | MC8 service/company auth; FDE2 OIDC | MC/FDE | Ownership patterns | Local OS user; hosted tenant mapping later | I/T, distinct deployments | Local actor metadata | Governed identities | Hosted deferred |
| Authorization | MC5/8; FDE2 engagement checks | MC/FDE | Contracts/services | Local plan/config binding | I/T | Enforce granted subset | Grant authority | No |
| Leases | MC5 and FDE2 jobs | MC/FDE | MC service | None inside Fab | I/T | No distributed lease system | Authoritative leases | M4 |
| Cancellation | MC3 process group; MC5 durable flag | MC | Patterns | Native AbortSignal and checkpoints | I/T | Local abort | Durable cancellation | No |
| Recovery | MC5 frozen checkpoints | MC | Service | Local interrupted-state reconciliation | I/T governed | Local session safety | Lease recovery | Conservative first |
| Retries | MC2 fallback; MC5 reclaim | MC | Pattern | Bound retries, no silent model fallback | I/T, semantics differ | Provider/tool retries | Attempt recovery | No |
| Session persistence | MC5 execution state | MC | Data principles | Private local sessions separate from attempts | I/T governed | Local sessions | Durable delivery state | No |
| Artifact storage | MC5/6 bundles; FDE2 object storage | MC/FDE | MC service | Redacted local evidence format | I/T | Local candidate artifacts | Governed storage/lifecycle | No |
| Execution evidence | MC1/5/6 | MC | Contract | Map local evidence without elevating authority | I/T | Observations | Authoritative persistence | No |
| Testing | MC3/7 checks; repo test suites | All | Conventions | Reproducible Fab fixtures/attacks | I/T per subsystem | Tests and repairs | Governed verification orchestration | No |
| Independent verification | MC7 | MC | Entire service | Candidate/identity/contract binding | I/T, fail-closed | Never self-certify | Owns verification | M4 |
| Approvals | MC8/5 human gates | MC | Entire service | Local plan confirmation is developer consent only | I/T | Local change consent | Governed gates | M4 |
| PR publication | MC8 + exact-current checks | MC | Entire service | Adapter candidate integration | I/T, credential dependent | No publisher | Publication authority | M4 |
| Telemetry | MC10; FDE2 safe logging | MC/FDE | Schema/privacy ideas | Local metadata and redaction | I/T | Local events | Governed aggregation | No |
| Tracing | MC1/10 event lineage | MC | Mapping | Session/call/tool IDs | I/T | Local trace | Attempt lineage | No |
| Token usage | MC2/10; FDE1 | MC/FDE | Field semantics | Preserve unknown values and cache fields | Partial | Adapter accounting | Aggregate routing evidence | No |
| Model cost | MC2 static rates | MC | Avoid stale rate reuse | Null until verified pricing configured | Partial | Reliable estimate or unknown | Budget policy | Pricing deferred |
| Latency | MC2 timing; FDE1/2 | MC/FDE | Pattern | Model/check durations | I/T | Timings | Aggregate metrics | No |
| Structured event streaming | MC1/3/5 | MC | Names and mapping | JSONL local sink | I/T | Native progress | Governed persistence | No |
| MCP | MC3 external agent; MC11 maturity ledger | MC | Later registry integration | Per-server grants, isolation and secret scope | Partial | Tool client later | Admission | M8 |
| Skills | MC9 packages/locks/evals | MC | Contracts/services | Consume explicit pinned capability subset | I/T registry | Engineering instructions | Governance/promotion | M8 |
| Context retrieval | MC9/context-router; G1 | MC/Guide | Principles/registry | Bounded repository map and file/search tools | Partial for coding | Relevant code selection | Frozen governed context | Basic first |
| Browser UI | MC11 and D1/FDE UIs | All | MC components later | Thin Fab sessions/diffs | No Fab UI | Thin client | Approvals/work orders | M6 |
| CLI | MC11 WorkOrder CLI | MC | Naming patterns | Standalone installable Fab CLI | No Fab CLI | Developer workflow | Governed commands | No |
| IDE | No Fab-specific runtime found | — | No | Thin protocol client | Absent | IDE client | None | M5 |
| Repository connection | MC4/8 project repository identity | MC | Governed service | One explicit local Git root | I/T governed | Local inspect | Governed repo identity | Local first |
| Multi-repository | MC4 explicit scoped worktrees | MC | Scope principles | Separate candidates/verification/publication | Not qualified for Fab | Read-only deps later | Coordinated governance | Yes |

## Reuse decisions and duplication risks

Keep MC's generic harness, capability admission, identity, leases, worktrees, remote sandbox broker, independent verifier and publisher intact. Do not import the Convex application into a standalone CLI. MC's `agent-runtime` is lifecycle/heartbeat/persona support; it is not a ready-made native coding agent. AI-FDE's coding-agent ADR explicitly says not implemented, so its discovery worker must not become a competing builder.

Model adapters are narrow HTTP translations. MC's string-only message interface drops tool-result structure; static prices/model catalogs are not current qualification; raw provider error bodies reach exceptions; API keys are retained on adapter objects. A small native model seam with tested round trips is lower risk than modifying that router and every caller. No stable package is renamed or moved.

## Security and credential findings

1. MC's sandbox broker already separates secret-bearing grants from persisted references and verifies revocation. Reuse that governed path later. Its default process-environment management key is a deployment configuration, not a Fab default.
2. MC child-environment functions and some Git/dependency operations inherit host HOME/PATH or broad environment. That is not acceptable as Fab credential discovery or least-privilege check execution. Fab must construct its own minimal environment.
3. MC redaction uses token/assignment patterns; Fab also needs registered exact values, encoded variants, and redaction before persistence. No detector promises to find arbitrary unknown secrets.
4. FDE's Bedrock client uses the AWS credential chain for its deployed service role. Importing it unchanged would accidentally enable local cloud-profile discovery. Reuse its typed boundary ideas, not its default credential chain.
5. FDE's metadata-only HTTP logs are a good model: never include provider error bodies, headers or user configuration in operational exceptions.
6. Path checks alone do not sandbox code executed by tests. Require a contained check runner and explicit supported-platform qualification. Unsupported containment must block checks, not silently run on the host.
7. Historical evidence bundles remain historical. Local Fab output cannot become independently verified by changing a status label.

## Location recommendation

Stage an independent, private `packages/fab` package here to keep the audit and review atomic. Do not turn the public site into a runtime dependency. Recommend eventual `jaydubya818/fdlc-fab` with an independent release lifecycle; publishing, repository creation, license selection and package-name availability remain separate decisions. MC later owns its integration adapter, importing the versioned Fab API and canonical MC contracts. This staging choice moves no existing code and changes no deployed system.
