# Corpus semantic and promotion decisions

**Status:** Open Product Owner decisions
**Applies to:** canonical promotion, not the isolated preview

The preview intentionally renders the source without silently deciding normative conflicts. These decisions must be approved and propagated through canon, prose, schemas, examples, diagrams, and tests before any corpus page replaces a canonical route.

## Recommended semantic decisions

### 1. Qualification Record identifier

- **Conflict:** corpus examples use both `QUAL-` and `QR-`.
- **Canon signal:** canon §18.1 specifies `QR-`.
- **Recommendation:** adopt `QR-` and mechanically update all references in one change followed by schema/example, link, and full-text verification.
- **Status:** recommended; not applied.

### 2. Security-remediation Factory Version

- **Conflict:** `FV-secrem-2.2`, `FV-secrem-1.4`, and `FV-secrem-2.1` identify what appears to be the same illustrative version.
- **Evidence signal:** the Qualification Record cross-reference uses `FV-secrem-2.1`.
- **Recommendation:** adopt `FV-secrem-2.1` unless the example chronology proves that these are intentionally different versions.
- **Status:** requires example-owner confirmation.

### 3. First activation bootstrap

- **Conflict:** the invariant requiring a prior `ACTIVE` version is impossible for the first activation in an environment.
- **Recommendation:** allow the first `QUALIFIED` Factory Version in an environment to activate without a predecessor when an authorized activation Decision names the environment, scope, evidence, and rollback/disable procedure. Every later activation retains the predecessor rule.
- **Status:** recommended normative change; requires approval.

### 4. Attempt and Candidate suffixes

- **Conflict:** examples mix `ATT-104-01-p1` with `ATT-104-01-a1`, and `CAND-...-p1` with `CAND-...-01`.
- **Recommendation:** define suffix semantics once, then update examples and reference validators from that definition. Do not treat this as cosmetic until the identifiers' version/attempt meaning is explicit.
- **Status:** needs a canonical identifier grammar.

### 5. D31 vocabulary

- **Conflict:** the diagram state vocabulary drifts from the prose/state-machine vocabulary.
- **Recommendation:** generate D31 labels from the accepted state list or add a contract test that compares the diagram labels to the canonical list.
- **Status:** needs a canon-to-diagram mapping.

## Route-promotion decisions

| Corpus path | Current owner | Recommendation |
|---|---|---|
| `/about` | Bespoke site page | Preserve the concise landing page; attach deeper corpus material below it or at a reference route. |
| `/architecture` | Bespoke visual architecture page | Preserve; use corpus architecture as deeper topic pages. |
| `/benchmarks` | Bespoke measurement-contract page | Merge only after benchmark language is reconciled; preserve current guardrails. |
| `/enterprise` | Bespoke enterprise landing page | Preserve as the entry point; promote non-colliding enterprise subpages selectively. |
| `/framework` | Canonical category page | Preserve until normative conflicts are resolved; then merge deliberately. |
| `/in-5-minutes` | Worked interactive narrative | Preserve; do not replace with duplicate prose. |
| `/mission-control` | Product/reference-implementation experience | Preserve; corpus article can become a deeper implementation note. |
| `/specification` | Current specification overview | Merge only as part of an approved versioned specification release. |
| `/start` | Factory Definition builder | Preserve the tool. If learning paths become canonical, move them to a distinct route; fragments cannot be redirected server-side. |

## Ownership decisions still required

- Keep `https://www.fdlc.ai` as the current canonical host; treat apex-host migration as separate infrastructure work.
- Keep `/guide/**`, `/search`, and `/glossary` ownership coordinated with the Guide microfrontend.
- Publish canonical `/schemas/v1/*.schema.json` only when versioning, compatibility, and release ownership are approved.
- Decide whether long-form corpus material becomes the Guide, a Reference area, or deeper pages under the existing information architecture.

## Promotion gate

Canonical promotion is blocked until these decisions are resolved, the 73-item taxonomy register has no `needs-evidence` entries, external Mission Control references are verified against a named revision, and both runtime suites pass after the final content change.
