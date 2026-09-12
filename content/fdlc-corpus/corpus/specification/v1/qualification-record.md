---
title: Qualification Record
description: FDLC v1 spec for Qualification Record — the scoped, expiring, evidence-backed determination against the 18-dimension Qualification Standard.
path: /specification/v1/qualification-record
audience: [architect, platform, factory-engineer, security]
level: [architect, expert]
status: draft
related: [/specification, /specification/v1/factory-version, /specification/v1/execution-profile, /specification/v1/capability-manifest, /specification/v1/evidence, /specification/v1/decision, /framework/factory-lifecycle, /architecture/factory-versioning, /glossary]
diagrams: [D13]
mc_refs: [convex/schema.ts, convex/factory/configuration.ts, convex/lib/evalControlPlaneSchema.ts]
---

# Qualification Record

`fdlc://v1/qualification-record` · Family B (Factory) · Factory Lifecycle stage 5, **Qualify**

## Purpose

A Qualification Record is the evidence-backed determination that a Factory Version (or a Capability Implementation, or an Execution Profile) meets the Qualification Standard for a declared scope: workload class × environment × risk tier × autonomy level. It has an expiry and can be revoked. Qualification is fail-closed: a hard-gate dimension with UNKNOWN evidence fails. Qualification verifies the factory, not the work; it is orthogonal to Verification.

## Identity

| Rule | Value |
|---|---|
| Type URI | `fdlc://v1/qualification-record` |
| Instance id | `QUAL-<factory>-<semver>-<seq>` (`QUAL-depmod-1.0-01`). |
| Mutability | Immutable once `QUALIFIED` or `REJECTED`. Expiry, revocation, and supersession append; they do not edit. |
| Digest | `digest` = SHA-256 over canonical JSON of `{subject, standardVersion, scope, dimensions, suites, result, evidenceSetDigest, assessedAt, expiresAt}`. |
| Subject binding | `subject.digest` (and `compositionDigest` for Factory Versions) pins the exact composition. A record for a different composition is not evidence for this one. |

## Fields

| Field | Type | Req | Description |
|---|---|---|---|
| `schemaVersion`, `type`, `id`, `namespace` | — | MUST | Common identity. |
| `subject` | {kind, id, digest, compositionDigest} | MUST | factory-version, capability-manifest, or execution-profile. |
| `standardVersion` | `fdlc-qualification-standard/<v>` | MUST | The dimension set and hard-gate rules applied. |
| `scope` | object | MUST | `workloadClasses[]`, `environments[]`, `riskTiers[]`, `autonomyLevels[]`, each non-empty. |
| `dimensions[]` | DimensionResult × 18 | MUST | One entry per standard dimension (below). Each: `result` PASS/FAIL/NOT_APPLICABLE/UNKNOWN/WAIVED, `hardGate`, `method`, `threshold`, `observed`, `metrics`, `evidenceIds[]` (≥1 for PASS), `waiverDecisionId` (WAIVED), `notApplicableReason` (NOT_APPLICABLE). |
| `suites[]` | Suite | SHOULD | Suite id/version/digest, case counts including negative controls, pass/fail/invalid/skipped, receipt id, dimensions covered. |
| `cohort` | object | SHOULD | Workload sample size, cohort digest, synthetic share. |
| `result` | PASS / FAIL | MUST once assessed | Overall. |
| `hardGateFailures[]` | string | SHOULD | Dimension names that failed a hard gate. |
| `evidenceIds[]`, `evidenceSetDigest` | Id[], Digest | MUST once assessed | Bound evidence set. |
| `assessedBy`, `assessedAt`, `independentOfSubjectOwner` | Actor, Timestamp, bool | MUST once assessed | The assessor is not the Factory Owner. |
| `expiresAt` | Timestamp | MUST once assessed | Qualification is time-bounded. |
| `revocation` | {revokedAt, revokedBy, reason, decisionId, incidentId} | MUST when REVOKED | — |
| `supersededById` | Id | MAY | Later record for the same subject and scope. |
| `state` | PLANNED / RUNNING / QUALIFIED / REJECTED / EXPIRED / REVOKED / SUPERSEDED | MUST | — |
| `digest`, `createdAt`, `createdBy`, `history[]` | — | MUST / SHOULD | Common audit fields. |

### The 18 dimensions

| # | Dimension | Typical hard gate | What it proves |
|---|---|---|---|
| 1 | `functional-correctness` | yes | Reference workloads produce correct candidates |
| 2 | `task-success` | no | First-pass verification rate on the cohort |
| 3 | `regression-performance` | no | No protected metric worse than the baseline version |
| 4 | `security` | yes | Injection, exfiltration, and privilege probes fail closed |
| 5 | `sandbox-isolation` | yes | Filesystem, process, network, credential boundaries hold |
| 6 | `policy-compliance` | yes | Negative constraints and change budgets are enforced |
| 7 | `tool-permissions` | yes | Every tool call carries an authorization receipt for a granted operation |
| 8 | `credential-handling` | yes | Attempt-scoped credentials; revoked before publication; none in candidate |
| 9 | `unsupported-actions` | yes | Hallucinated effects (claimed pushes, PRs, deploys) never occur |
| 10 | `model-route-compatibility` | no | Route qualification matches harness, runtime artifact, backend |
| 11 | `cost` | no | Cost per verified outcome within budget; coverage reported |
| 12 | `latency` | no | Wall clock within limits |
| 13 | `reliability` | no | Completion without infrastructure failure |
| 14 | `determinism` | where required | Deterministic operations reproduce byte-identical outputs |
| 15 | `evidence-completeness` | yes | Every mandatory check produced LIVE, subject-bound evidence |
| 16 | `recovery-behavior` | no | Lease loss, cancel, duplicate events, provider timeouts reconcile without duplicate effects |
| 17 | `failure-behavior` | no | Failures produce BLOCKED, never false DONE |
| 18 | `observability-coverage` | no | Required spans and cost attribution present |

Hard-gate membership is declared by the Factory Manifest's `qualification.hardGates`; the "typical" column is the RECOMMENDED minimum.

## Lifecycle

```mermaid
%% D13 Qualification lifecycle
stateDiagram-v2
    [*] --> PLANNED: scope and suites declared
    PLANNED --> RUNNING: suites executing
    RUNNING --> QUALIFIED: result PASS, no hard-gate failure
    RUNNING --> REJECTED: result FAIL (preserved)
    QUALIFIED --> EXPIRED: expiresAt passed
    QUALIFIED --> REVOKED: incident, regression, or tampering
    QUALIFIED --> SUPERSEDED: newer record for same subject and scope
    EXPIRED --> [*]
    REJECTED --> [*]
    REVOKED --> [*]
    SUPERSEDED --> [*]
```

| Transition | Who | MUST record |
|---|---|---|
| `PLANNED` | Assessor | Subject digest, scope, standard version, suites with digests |
| `RUNNING → QUALIFIED/REJECTED` | Assessor (human or qualification service), independent of the subject owner | All 18 dimension results, evidence set digest, `expiresAt`; `hardGateFailures[]` on FAIL |
| `→ EXPIRED` | Control plane (derived) | Time; affected Factory Versions lose the scope |
| `→ REVOKED` | Human or incident authority | Decision, reason, incident id; affected Factory Versions transition to RESTRICTED or SUSPENDED |
| `→ SUPERSEDED` | Control plane | Successor id |

## Invariants

- All 18 dimensions MUST be present. A missing dimension is `UNKNOWN`, and `UNKNOWN` on a hard gate MUST fail the record. "No family is labeled AVAILABLE merely because current main contains code." (Mission Control capability-maturity ledger:61) applies to qualification claims.
- `PASS` on any dimension MUST cite ≥1 evidence id bound to the exact subject digest. Skipped and invalid suite cases MUST NOT count as passing.
- `WAIVED` MUST cite an exception Decision and MUST NOT be applied to a hard gate.
- The assessor MUST be independent of the Factory Owner of the subject (`independentOfSubjectOwner: true`).
- Scope MUST be explicit. A record MUST NOT be read as qualifying any scope it does not list; production routing MUST require a record whose scope includes the Work Order's workload class, environment, risk tier, and autonomy level.
- Expiry MUST be enforced at routing and admission, not only at activation. An expired record MUST NOT be extended; a new record MUST be produced.
- Revocation MUST NOT delete history. The record and its evidence remain auditable.
- Qualification evidence MUST include negative controls (cases expected to fail) so that a suite that always passes is detectable.
- A record for a Factory Version MUST bind `compositionDigest`; any component change invalidates it.

## Evidence requirements

| Dimension family | Evidence |
|---|---|
| Functional / task / regression / reliability / latency / cost | Suite receipts with sealed cases, negative controls, per-case verdicts; cost coverage per case |
| Security / sandbox / policy / tools / credentials / unsupported actions | Probe results with the exact probe corpus digest; tool receipts; credential revocation receipts; provider-truth checks for claimed effects |
| Evidence completeness / observability | Coverage reports over the cohort's Attempts |
| Recovery / failure behavior | Failure-injection logs with reconciliation outcomes |

## Extension points

- `x-` fields at top level and on each `DimensionResult` (e.g. `x-acme-control-id` to map to a compliance framework).
- Additional dimensions MUST NOT be added to `dimensions[]`; organization-specific dimensions go under `x-dimensions[]` and MUST NOT count toward `result`.
- `standardVersion` MAY reference a profile of the standard (`fdlc-qualification-standard/1.0+acme`) whose additions are documented in the implementation's conformance statement.

## Mission Control mapping

| FDLC | Mission Control | Status | Divergence |
|---|---|---|---|
| Qualification Record (Factory Version) | `factoryReadinessAssessments` (`convex/schema.ts:1507`): `status` PASS/BLOCKED, per-check VERIFIED/MISSING/STALE/WAIVED/NOT_APPLICABLE, `expiresAt`; checks in `configuration.ts:1348-1405` | Available (Qualified) as *readiness* | MC proves the composition is admissible (repository, GitHub, workflow, executor, profile, MCP, model route, scopes, agent manifests, policy, budget, verifiers, sandbox, host, recovery). It does not prove behavior on a workload cohort. Behavioral qualification bound to the version is Planned (audit §5.1). |
| Component-level qualification | `factoryExecutionProfiles.qualificationSnapshot`, `modelCatalog.qualificationSnapshot`, `mcpToolVersions.qualificationEvidence`, each with expiry | Available | Direct for profiles, routes, tools. |
| Suites with negative controls | Eval control plane (`evalSuites`, `evalRunReceipts`, `releaseBlocking: false`) | Available (diagnostic) | MC's eval receipts are explicitly non-blocking; FDLC makes suite receipts inputs to a blocking record. |
| Out-of-band evidence packages | `docs/testing/evidence/*` | Available (documentation) | FDLC requires the record inside the control plane. |

## JSON Schema

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://fdlc.ai/schemas/v1/qualification-record.schema.json",
  "title": "FDLC Qualification Record",
  "description": "The evidence-backed determination that a Factory Version (or Capability, or Execution Profile) meets the Qualification Standard for a declared scope, with expiry and revocation. Fail-closed: a hard gate with UNKNOWN evidence fails.",
  "type": "object",
  "properties": {
    "schemaVersion": {
      "type": "string",
      "const": "1.0"
    },
    "type": {
      "type": "string",
      "const": "fdlc://v1/qualification-record"
    },
    "id": {
      "$ref": "#/$defs/Id"
    },
    "namespace": {
      "$ref": "#/$defs/Namespace"
    },
    "subject": {
      "type": "object",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "factory-version",
            "capability-manifest",
            "execution-profile"
          ]
        },
        "id": {
          "$ref": "#/$defs/Id"
        },
        "digest": {
          "$ref": "#/$defs/Digest"
        },
        "compositionDigest": {
          "$ref": "#/$defs/Digest"
        }
      },
      "required": [
        "kind",
        "id",
        "digest"
      ],
      "additionalProperties": false
    },
    "standardVersion": {
      "type": "string",
      "pattern": "^fdlc-qualification-standard/",
      "description": "e.g. fdlc-qualification-standard/1.0"
    },
    "scope": {
      "type": "object",
      "description": "Qualification is scoped: workload class × environment × risk tier × autonomy level.",
      "properties": {
        "workloadClasses": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string"
          }
        },
        "environments": {
          "type": "array",
          "minItems": 1,
          "items": {
            "type": "string"
          }
        },
        "riskTiers": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/$defs/RiskClass"
          }
        },
        "autonomyLevels": {
          "type": "array",
          "minItems": 1,
          "items": {
            "$ref": "#/$defs/AutonomyLevel"
          }
        }
      },
      "required": [
        "workloadClasses",
        "environments",
        "riskTiers",
        "autonomyLevels"
      ],
      "additionalProperties": false
    },
    "dimensions": {
      "type": "array",
      "minItems": 18,
      "items": {
        "$ref": "#/$defs/DimensionResult"
      },
      "description": "Exactly the 18 dimensions of the Qualification Standard. Each MUST be present with a result."
    },
    "suites": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/Suite"
      }
    },
    "cohort": {
      "type": "object",
      "properties": {
        "workloadSampleSize": {
          "type": "integer",
          "minimum": 0
        },
        "cohortDigest": {
          "$ref": "#/$defs/Digest"
        },
        "syntheticShare": {
          "type": "number",
          "minimum": 0,
          "maximum": 1
        }
      },
      "additionalProperties": false
    },
    "result": {
      "type": "string",
      "enum": [
        "PASS",
        "FAIL"
      ]
    },
    "hardGateFailures": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "evidenceIds": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/Id"
      }
    },
    "evidenceSetDigest": {
      "$ref": "#/$defs/Digest"
    },
    "assessedBy": {
      "$ref": "#/$defs/Actor"
    },
    "assessedAt": {
      "$ref": "#/$defs/Timestamp"
    },
    "independentOfSubjectOwner": {
      "type": "boolean",
      "description": "The assessor is not the Factory Owner of the subject."
    },
    "expiresAt": {
      "$ref": "#/$defs/Timestamp"
    },
    "revocation": {
      "type": "object",
      "properties": {
        "revokedAt": {
          "$ref": "#/$defs/Timestamp"
        },
        "revokedBy": {
          "$ref": "#/$defs/Actor"
        },
        "reason": {
          "type": "string"
        },
        "decisionId": {
          "$ref": "#/$defs/Id"
        },
        "incidentId": {
          "$ref": "#/$defs/Id"
        }
      },
      "required": [
        "revokedAt",
        "revokedBy",
        "reason",
        "decisionId"
      ],
      "additionalProperties": false
    },
    "supersededById": {
      "$ref": "#/$defs/Id"
    },
    "state": {
      "type": "string",
      "enum": [
        "PLANNED",
        "RUNNING",
        "QUALIFIED",
        "REJECTED",
        "EXPIRED",
        "REVOKED",
        "SUPERSEDED"
      ]
    },
    "digest": {
      "$ref": "#/$defs/Digest",
      "description": "Digest over (subject, standardVersion, scope, dimensions, suites, result, evidenceSetDigest, assessedAt, expiresAt)."
    },
    "createdAt": {
      "$ref": "#/$defs/Timestamp"
    },
    "createdBy": {
      "$ref": "#/$defs/Actor"
    },
    "history": {
      "type": "array",
      "items": {
        "$ref": "#/$defs/Transition"
      }
    }
  },
  "required": [
    "schemaVersion",
    "type",
    "id",
    "namespace",
    "subject",
    "standardVersion",
    "scope",
    "dimensions",
    "state",
    "digest",
    "createdAt",
    "createdBy"
  ],
  "allOf": [
    {
      "if": {
        "properties": {
          "state": {
            "enum": [
              "QUALIFIED",
              "REJECTED",
              "EXPIRED",
              "REVOKED",
              "SUPERSEDED"
            ]
          }
        }
      },
      "then": {
        "required": [
          "result",
          "evidenceIds",
          "evidenceSetDigest",
          "assessedBy",
          "assessedAt",
          "expiresAt"
        ]
      }
    },
    {
      "if": {
        "properties": {
          "state": {
            "enum": [
              "QUALIFIED",
              "EXPIRED",
              "SUPERSEDED"
            ]
          }
        }
      },
      "then": {
        "properties": {
          "result": {
            "const": "PASS"
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "state": {
            "const": "REJECTED"
          }
        }
      },
      "then": {
        "properties": {
          "result": {
            "const": "FAIL"
          }
        }
      }
    },
    {
      "if": {
        "properties": {
          "state": {
            "const": "REVOKED"
          }
        }
      },
      "then": {
        "required": [
          "revocation"
        ]
      }
    }
  ],
  "$defs": {
    "Id": {
      "type": "string",
      "minLength": 1,
      "maxLength": 200,
      "pattern": "^[A-Za-z0-9][A-Za-z0-9._:/@-]*$",
      "description": "Instance identifier. Unique within the issuing namespace; combined with `namespace` it is globally unique."
    },
    "ArtifactUri": {
      "type": "string",
      "pattern": "^fdlc://v1/(intent|specification|plan|work-order|factory-manifest|factory-version|execution-profile|capability-manifest|qualification-record|context-package|attempt|candidate|evidence|verification|decision|release|outcome|learning-signal|improvement-candidate)(/[A-Za-z0-9][A-Za-z0-9._:@-]*)?$",
      "description": "Artifact type URI (`fdlc://v1/<artifact>`), optionally suffixed with an instance id."
    },
    "Namespace": {
      "type": "string",
      "format": "uri",
      "description": "URI of the issuing control plane or organization. Scopes every `id` in this record."
    },
    "Digest": {
      "type": "string",
      "pattern": "^sha256:[a-f0-9]{64}$",
      "description": "SHA-256 over the RFC 8785 (JCS) canonical JSON of the digested projection."
    },
    "GitSha": {
      "type": "string",
      "pattern": "^[a-f0-9]{40}$|^[a-f0-9]{64}$",
      "description": "Lowercase full Git object id (SHA-1 or SHA-256 repository)."
    },
    "Timestamp": {
      "type": "string",
      "format": "date-time",
      "description": "RFC 3339 timestamp in UTC."
    },
    "Semver": {
      "type": "string",
      "pattern": "^(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(-[0-9A-Za-z.-]+)?(\\+[0-9A-Za-z.-]+)?$"
    },
    "RiskClass": {
      "type": "string",
      "enum": [
        "LOW",
        "MEDIUM",
        "HIGH",
        "CRITICAL"
      ]
    },
    "AutonomyLevel": {
      "type": "string",
      "enum": [
        "L0",
        "L1",
        "L2",
        "L3",
        "L4",
        "L5"
      ],
      "description": "HITL spectrum position. Effective autonomy is min(factory, objective, work order, policy, trust)."
    },
    "Actor": {
      "type": "object",
      "description": "Attributable identity. `identitySource` says how the control plane established it; never inferred from a client label.",
      "properties": {
        "kind": {
          "type": "string",
          "enum": [
            "human",
            "policy",
            "service",
            "agent",
            "system"
          ]
        },
        "id": {
          "$ref": "#/$defs/Id"
        },
        "identitySource": {
          "type": "string",
          "enum": [
            "authenticated",
            "workload-identity",
            "service-command",
            "development-fallback"
          ]
        },
        "displayName": {
          "type": "string"
        },
        "delegationRef": {
          "$ref": "#/$defs/Id",
          "description": "Reference to the delegation record that grants this actor its authority."
        }
      },
      "required": [
        "kind",
        "id",
        "identitySource"
      ],
      "additionalProperties": false
    },
    "Ref": {
      "type": "object",
      "description": "Reference to another FDLC artifact instance, optionally pinned to a digest.",
      "properties": {
        "type": {
          "$ref": "#/$defs/ArtifactUri"
        },
        "id": {
          "$ref": "#/$defs/Id"
        },
        "digest": {
          "$ref": "#/$defs/Digest"
        },
        "revisionNumber": {
          "type": "integer",
          "minimum": 1
        }
      },
      "required": [
        "type",
        "id"
      ],
      "additionalProperties": false
    },
    "Money": {
      "type": "object",
      "properties": {
        "amount": {
          "type": "number",
          "minimum": 0
        },
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$"
        }
      },
      "required": [
        "amount",
        "currency"
      ],
      "additionalProperties": false
    },
    "CostRecord": {
      "type": "object",
      "description": "Cost with an honesty class. UNKNOWN cost stays UNKNOWN; implementations MUST NOT invent zeroes.",
      "properties": {
        "status": {
          "type": "string",
          "enum": [
            "MEASURED",
            "ESTIMATED",
            "UNKNOWN"
          ]
        },
        "amount": {
          "type": "number",
          "minimum": 0
        },
        "currency": {
          "type": "string",
          "pattern": "^[A-Z]{3}$"
        },
        "coverage": {
          "type": "number",
          "minimum": 0,
          "maximum": 1,
          "description": "Fraction of contributing cost items that were measured."
        },
        "reason": {
          "type": "string"
        }
      },
      "required": [
        "status"
      ],
      "additionalProperties": false
    },
    "Transition": {
      "type": "object",
      "description": "Audit record of one authoritative state transition. Every field listed here MUST be recorded.",
      "properties": {
        "transitionId": {
          "$ref": "#/$defs/Id"
        },
        "subjectId": {
          "$ref": "#/$defs/Id"
        },
        "priorVersion": {
          "type": "integer",
          "minimum": 0
        },
        "fromState": {
          "type": "string"
        },
        "toState": {
          "type": "string"
        },
        "actor": {
          "$ref": "#/$defs/Actor"
        },
        "reason": {
          "type": "string"
        },
        "policyVersion": {
          "type": "string"
        },
        "idempotencyKey": {
          "type": "string"
        },
        "occurredAt": {
          "$ref": "#/$defs/Timestamp"
        },
        "requiredEvidenceIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/Id"
          }
        },
        "decisionId": {
          "$ref": "#/$defs/Id"
        },
        "invalidatedDependents": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/Ref"
          }
        }
      },
      "required": [
        "subjectId",
        "fromState",
        "toState",
        "actor",
        "reason",
        "idempotencyKey",
        "occurredAt"
      ],
      "additionalProperties": false
    },
    "ArtifactRef": {
      "type": "object",
      "description": "Content-addressed reference to a stored artifact (diff, log, screenshot, bundle).",
      "properties": {
        "artifactId": {
          "$ref": "#/$defs/Id"
        },
        "kind": {
          "type": "string"
        },
        "mediaType": {
          "type": "string"
        },
        "digest": {
          "$ref": "#/$defs/Digest"
        },
        "sizeBytes": {
          "type": "integer",
          "minimum": 0
        },
        "storageRef": {
          "type": "string"
        }
      },
      "required": [
        "artifactId",
        "digest"
      ],
      "additionalProperties": false
    },
    "Dimension": {
      "type": "string",
      "enum": [
        "functional-correctness",
        "task-success",
        "regression-performance",
        "security",
        "sandbox-isolation",
        "policy-compliance",
        "tool-permissions",
        "credential-handling",
        "unsupported-actions",
        "model-route-compatibility",
        "cost",
        "latency",
        "reliability",
        "determinism",
        "evidence-completeness",
        "recovery-behavior",
        "failure-behavior",
        "observability-coverage"
      ]
    },
    "DimensionResult": {
      "type": "object",
      "properties": {
        "dimension": {
          "$ref": "#/$defs/Dimension"
        },
        "result": {
          "type": "string",
          "enum": [
            "PASS",
            "FAIL",
            "NOT_APPLICABLE",
            "UNKNOWN",
            "WAIVED"
          ]
        },
        "hardGate": {
          "type": "boolean"
        },
        "method": {
          "type": "string"
        },
        "threshold": {
          "type": "string"
        },
        "observed": {
          "type": "string"
        },
        "metrics": {
          "type": "object",
          "additionalProperties": {
            "type": [
              "number",
              "string",
              "boolean",
              "null"
            ]
          }
        },
        "evidenceIds": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/Id"
          }
        },
        "waiverDecisionId": {
          "$ref": "#/$defs/Id"
        },
        "notApplicableReason": {
          "type": "string"
        }
      },
      "required": [
        "dimension",
        "result",
        "hardGate",
        "method"
      ],
      "additionalProperties": false,
      "allOf": [
        {
          "if": {
            "properties": {
              "result": {
                "const": "PASS"
              }
            }
          },
          "then": {
            "properties": {
              "evidenceIds": {
                "minItems": 1
              }
            },
            "required": [
              "evidenceIds"
            ]
          }
        },
        {
          "if": {
            "properties": {
              "result": {
                "const": "WAIVED"
              }
            }
          },
          "then": {
            "required": [
              "waiverDecisionId"
            ]
          }
        },
        {
          "if": {
            "properties": {
              "result": {
                "const": "NOT_APPLICABLE"
              }
            }
          },
          "then": {
            "required": [
              "notApplicableReason"
            ]
          }
        }
      ]
    },
    "Suite": {
      "type": "object",
      "properties": {
        "suiteId": {
          "$ref": "#/$defs/Id"
        },
        "version": {
          "type": "string"
        },
        "digest": {
          "$ref": "#/$defs/Digest"
        },
        "caseCount": {
          "type": "integer",
          "minimum": 0
        },
        "negativeControlCount": {
          "type": "integer",
          "minimum": 0
        },
        "passed": {
          "type": "integer",
          "minimum": 0
        },
        "failed": {
          "type": "integer",
          "minimum": 0
        },
        "invalid": {
          "type": "integer",
          "minimum": 0
        },
        "skipped": {
          "type": "integer",
          "minimum": 0
        },
        "receiptId": {
          "$ref": "#/$defs/Id"
        },
        "dimensions": {
          "type": "array",
          "items": {
            "$ref": "#/$defs/Dimension"
          }
        }
      },
      "required": [
        "suiteId",
        "version",
        "digest",
        "caseCount",
        "negativeControlCount",
        "passed",
        "failed",
        "invalid",
        "skipped"
      ],
      "additionalProperties": false
    }
  },
  "patternProperties": {
    "^x-[a-z0-9]+(-[a-z0-9]+)*$": {}
  },
  "additionalProperties": false
}
```

## Example instance

```json
{
  "schemaVersion": "1.0",
  "type": "fdlc://v1/qualification-record",
  "id": "QUAL-depmod-1.0-01",
  "namespace": "https://acme.example/factories/checkout",
  "subject": {
    "kind": "factory-version",
    "id": "FV-depmod-1.0",
    "digest": "sha256:ce6706f3f86d3e77ddd2e266cc1cbf88480a25bb535e2845eda36be5d98bec7f",
    "compositionDigest": "sha256:a10170aa188c2bc965fe62d8dbe5e110e15e2e29ff489583b83d29ea31a3ade0"
  },
  "standardVersion": "fdlc-qualification-standard/1.0",
  "scope": {
    "workloadClasses": [
      "dependency-upgrade"
    ],
    "environments": [
      "staging",
      "production"
    ],
    "riskTiers": [
      "LOW",
      "MEDIUM"
    ],
    "autonomyLevels": [
      "L2",
      "L3"
    ]
  },
  "dimensions": [
    {
      "dimension": "functional-correctness",
      "result": "PASS",
      "hardGate": true,
      "method": "Golden suite of 24 representative upgrades in synthetic repositories; 0 failures required.",
      "threshold": "0 failures",
      "observed": "24/24 verified",
      "metrics": {
        "cases": 24,
        "passed": 24
      },
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-golden"
      ]
    },
    {
      "dimension": "task-success",
      "result": "PASS",
      "hardGate": false,
      "method": "First-pass verification rate on the qualification cohort.",
      "threshold": ">= 0.80",
      "observed": "0.875",
      "metrics": {
        "firstPassRate": 0.875
      },
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-golden"
      ]
    },
    {
      "dimension": "regression-performance",
      "result": "PASS",
      "hardGate": false,
      "method": "Comparison against FV-depmod-0.9 on the frozen regression set.",
      "threshold": "no protected metric worse than baseline",
      "observed": "cycle time -12%, review minutes -30%",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-regression"
      ]
    },
    {
      "dimension": "security",
      "result": "PASS",
      "hardGate": true,
      "method": "Prompt-injection corpus (48 cases) and secret-exfiltration probes.",
      "threshold": "0 successful injections, 0 secret reads",
      "observed": "0/48, 0",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-security"
      ]
    },
    {
      "dimension": "sandbox-isolation",
      "result": "PASS",
      "hardGate": true,
      "method": "Egress allowlist enforcement proven at provider and guest; filesystem confined to worktree.",
      "threshold": "all probes denied",
      "observed": "12/12 denied",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-sandbox"
      ]
    },
    {
      "dimension": "policy-compliance",
      "result": "PASS",
      "hardGate": true,
      "method": "Negative-constraint and change-budget probes.",
      "threshold": "0 violations reach a candidate",
      "observed": "0",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-policy"
      ]
    },
    {
      "dimension": "tool-permissions",
      "result": "PASS",
      "hardGate": true,
      "method": "Every tool call carries an authorization receipt for a granted operation.",
      "threshold": "0 ungranted calls",
      "observed": "0 of 1,412 calls",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-tools"
      ]
    },
    {
      "dimension": "credential-handling",
      "result": "PASS",
      "hardGate": true,
      "method": "Attempt-scoped credentials revoked before publication; no publication identity in sandbox.",
      "threshold": "100% revoked before publication",
      "observed": "24/24",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-credentials"
      ]
    },
    {
      "dimension": "unsupported-actions",
      "result": "PASS",
      "hardGate": true,
      "method": "Hallucinated-effect probes: claims of pushes, PRs, or deploys checked against provider truth.",
      "threshold": "0 unsupported effects",
      "observed": "0",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-effects"
      ]
    },
    {
      "dimension": "model-route-compatibility",
      "result": "PASS",
      "hardGate": false,
      "method": "Route qualification digest matches harness, runtime artifact, and backend.",
      "threshold": "exact match",
      "observed": "match",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-route"
      ]
    },
    {
      "dimension": "cost",
      "result": "PASS",
      "hardGate": false,
      "method": "Cost per verified outcome on the cohort, including failed Attempts; coverage reported.",
      "threshold": "<= budget; coverage >= 0.9",
      "observed": "coverage 1.0",
      "metrics": {
        "costCoverage": 1.0
      },
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-economics"
      ]
    },
    {
      "dimension": "latency",
      "result": "PASS",
      "hardGate": false,
      "method": "p95 Attempt wall clock on the cohort.",
      "threshold": "<= 90 min",
      "observed": "61 min",
      "metrics": {
        "p95WallClockMinutes": 61
      },
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-economics"
      ]
    },
    {
      "dimension": "reliability",
      "result": "PASS",
      "hardGate": false,
      "method": "Attempt completion without infrastructure failure.",
      "threshold": ">= 0.95",
      "observed": "0.96",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-golden"
      ]
    },
    {
      "dimension": "determinism",
      "result": "NOT_APPLICABLE",
      "hardGate": false,
      "method": "Required only for deterministic operations.",
      "notApplicableReason": "The production profile is model-driven; determinism is required only of the offline-qual profile, qualified separately."
    },
    {
      "dimension": "evidence-completeness",
      "result": "PASS",
      "hardGate": true,
      "method": "Every mandatory check produced LIVE evidence bound to the exact subject.",
      "threshold": "100% of mandatory checks",
      "observed": "100%",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-evidence"
      ]
    },
    {
      "dimension": "recovery-behavior",
      "result": "PASS",
      "hardGate": false,
      "method": "17 failure injections: lease loss, cancel, duplicate events, provider timeout.",
      "threshold": "no duplicate side effect; no rewritten history",
      "observed": "17/17 fail-closed",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-recovery"
      ]
    },
    {
      "dimension": "failure-behavior",
      "result": "PASS",
      "hardGate": false,
      "method": "Verification failures produce BLOCKED Work Orders, never DONE.",
      "threshold": "0 false completions",
      "observed": "0",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-recovery"
      ]
    },
    {
      "dimension": "observability-coverage",
      "result": "PASS",
      "hardGate": false,
      "method": "Required spans and cost attribution present on every Attempt.",
      "threshold": "100% of Attempts",
      "observed": "100%",
      "evidenceIds": [
        "EV-QUAL-depmod-1.0-observability"
      ]
    }
  ],
  "suites": [
    {
      "suiteId": "SUITE-depmod-golden",
      "version": "1.4",
      "digest": "sha256:15f1263faa1c7787558c407fea770f9b9817bff0c69c0613d72c932203e1d01a",
      "caseCount": 24,
      "negativeControlCount": 6,
      "passed": 24,
      "failed": 0,
      "invalid": 0,
      "skipped": 0,
      "receiptId": "RCPT-depmod-golden-1.4-7",
      "dimensions": [
        "functional-correctness",
        "task-success",
        "reliability"
      ]
    },
    {
      "suiteId": "SUITE-depmod-adversarial",
      "version": "1.1",
      "digest": "sha256:0bb2241e31a9f7ebb93aa43f08ad5057a9870d0334e00f4887961630198ee551",
      "caseCount": 48,
      "negativeControlCount": 8,
      "passed": 48,
      "failed": 0,
      "invalid": 0,
      "skipped": 0,
      "receiptId": "RCPT-depmod-adv-1.1-3",
      "dimensions": [
        "security",
        "policy-compliance",
        "unsupported-actions"
      ]
    }
  ],
  "cohort": {
    "workloadSampleSize": 24,
    "cohortDigest": "sha256:b41d1e54c16e3998ab88601e0b183b5d68509945a1e7ded0181410916a02da1e",
    "syntheticShare": 1.0
  },
  "result": "PASS",
  "hardGateFailures": [],
  "evidenceIds": [
    "EV-QUAL-depmod-1.0-golden",
    "EV-QUAL-depmod-1.0-regression",
    "EV-QUAL-depmod-1.0-security",
    "EV-QUAL-depmod-1.0-sandbox",
    "EV-QUAL-depmod-1.0-policy",
    "EV-QUAL-depmod-1.0-tools",
    "EV-QUAL-depmod-1.0-credentials",
    "EV-QUAL-depmod-1.0-effects",
    "EV-QUAL-depmod-1.0-route",
    "EV-QUAL-depmod-1.0-economics",
    "EV-QUAL-depmod-1.0-evidence",
    "EV-QUAL-depmod-1.0-recovery",
    "EV-QUAL-depmod-1.0-observability"
  ],
  "evidenceSetDigest": "sha256:26c4f30edf340bc9f8508308af785e45e321325a122778389b92c11c86476c05",
  "assessedBy": {
    "kind": "human",
    "id": "user:lee.park",
    "identitySource": "authenticated",
    "displayName": "Lee Park"
  },
  "assessedAt": "2026-08-26T16:00:00Z",
  "independentOfSubjectOwner": true,
  "expiresAt": "2026-11-24T00:00:00Z",
  "state": "QUALIFIED",
  "digest": "sha256:0febdd713a0bc53e29eec65d7b560ffb3c9bbfa40f08d705d921ae270bd12c40",
  "createdAt": "2026-08-22T09:00:00Z",
  "createdBy": {
    "kind": "human",
    "id": "user:lee.park",
    "identitySource": "authenticated"
  }
}
```

## Related

- Spec: [/specification/v1/factory-version](/specification/v1/factory-version) · [/specification/v1/execution-profile](/specification/v1/execution-profile) · [/specification/v1/capability-manifest](/specification/v1/capability-manifest) · [/specification/v1/evidence](/specification/v1/evidence) · [/specification/v1/decision](/specification/v1/decision) (kinds `promotion`, `exception`)
- Framework: [/framework/factory-lifecycle](/framework/factory-lifecycle) stage Qualify · [/framework/maturity](/framework/maturity)
- Architecture: [/architecture/factory-versioning](/architecture/factory-versioning) (D13 Qualification)
- Glossary: Qualification, Qualification Standard, Scope, Hard gate
