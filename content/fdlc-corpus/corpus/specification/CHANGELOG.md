# Changelog

All notable changes to the FDLC specification are recorded here.
Format: Keep a Changelog. Versioning: semantic (see /specification).

## [1.0.0-draft] — 2026-09-11

Pre-standardization draft for public review. Supersedes the informal
v0.1 site content (nine-step runtime lifecycle, seven-stage factory
lifecycle, eleven protocol artifacts).

### Added
- Delivery Loop step 4 **Route** between Plan and Execute; Work Order
  state `ROUTED`; Decision kind `routing` with eligibility-before-ranking.
- Factory Lifecycle stages **Define** and **Qualify** (Design split into
  Define + Design; Validate renamed Qualify).
- Eight new artifacts, bringing the model to nineteen in five families:
  **Factory Manifest**, **Factory Version**, **Execution Profile**,
  **Capability Manifest**, **Qualification Record**, **Context Package**,
  **Candidate**, **Improvement Candidate**.
- JSON Schema 2020-12 for all nineteen artifacts at
  `https://fdlc.ai/schemas/v1/<slug>.schema.json`, with validated examples
  from the dependency-modernization worked example.
- Identifier scheme `fdlc://v1/<artifact>`, `namespace`, RFC 8785 + SHA-256
  content addressing, common `Actor`, `Ref`, `Transition`, `CostRecord`
  definitions.
- Evidence six-state lifecycle (MISSING, PENDING, CURRENT, STALE,
  CONFLICTING, SUPERSEDED) and in-toto Statement wrapper with predicate
  type `https://fdlc.ai/attestation/evidence/v1`.
- Qualification Standard with eighteen dimensions and scoped, expiring
  Qualification Records.
- Four conformance tracks (Intent, Execution, Trust, Learning), levels
  FDLC-L2 to FDLC-L5, self-assessment procedure, suite roadmap, and a
  worked Mission Control self-assessment.
- Extension policy (`x-` namespaced fields), versioning and deprecation
  policy, RFC process, working groups, license recommendation.

### Changed
- **Decision** replaces "Approval" as artifact #8; approvals, acceptance,
  routing, admission, release authorization, promotion, restoration, and
  exceptions are Decision kinds.
- Responsibility area 2 renamed from **Harness** to **Execution**
  (contains Orchestrator, Runtime, Sandbox; Harness remains an L5 term).
- Maturity level names: L3 "Orchestrated Workflows" → **Orchestrated
  Delivery**; L4 "Verified Factory Lines" → **Qualified Factory**;
  L5 "Continuously Learning Factory" → **Factory Ecosystem**.
- Verification Run → **Verification Attempt** (an Attempt with role
  verifier); Learning Proposal → **Improvement Candidate** (alias kept).
- Work Order spelled as two words in prose; `WorkOrder` in code.
- Factory Version state machine replaces the earlier version lifecycle and
  decision-06 sequences: DRAFT → CANDIDATE → QUALIFIED → ACTIVE →
  RESTRICTED / SUSPENDED → DEPRECATED → RETIRED; REJECTED.
- Composition digests MUST be SHA-256 over canonical JSON (Mission
  Control's FNV-1a configuration digest is recorded as a divergence).

### Deprecated
- "Factory line" as a synonym for a specialized factory (alias only).
- "AI harness", "inner/outer/meta-harness", "meta-factory control plane"
  (non-canonical aliases with warning).
- "Requester" for the human role (alias of Builder).

### Removed
- The eight-stage guide value stream as a lifecycle (its "Define Agent"
  and "Apply Skills" steps become mechanics inside Route/Execute).
- "Approval" and "Acceptance" as separate artifacts.

### Invariants
- Thirty global invariants published in /specification, attributed to
  Mission Control doctrine where taken from it; every MUST on an artifact
  page traces to one of them or to the page's own Invariants section.

## [0.1] — site content prior to 2026-09

Informal. Nine-step runtime lifecycle, seven-stage factory lifecycle,
eleven protocol artifacts, twelve Factory Definition concerns, ten-field
Factory Definition builder. Superseded by 1.0.0-draft; mappings in the
canon reconciliation table.
