---
title: FDLC Schemas and Examples
description: Downloadable JSON Schema 2020-12 documents and validated example instances for all nineteen FDLC v1 artifacts.
path: /specification/schemas
audience: [architect, platform, factory-engineer]
level: [architect, expert]
status: draft
related: [/specification, /specification/conformance]
diagrams: []
mc_refs: []
---

# FDLC Schemas and Examples

Each artifact has one JSON Schema (`$id: https://fdlc.ai/schemas/v1/<slug>.schema.json`) and one example instance from the dependency-modernization worked example. Records are JSON; the four human-authored manifests are YAML. Every example validates against its schema under `Draft202012Validator` with format checking. The schemas share the common `$defs` (`Id`, `ArtifactUri`, `Namespace`, `Digest`, `GitSha`, `Timestamp`, `Semver`, `RiskClass`, `AutonomyLevel`, `Actor`, `Ref`, `Money`, `CostRecord`, `Transition`, `ArtifactRef`) inlined in each file so that each is standalone.

| Artifact | Schema | Example |
|---|---|---|
| Intent | `schemas/intent.schema.json` | `examples/intent.example.json` |
| Specification | `schemas/specification.schema.json` | `examples/specification.example.json` |
| Plan | `schemas/plan.schema.json` | `examples/plan.example.json` |
| Work Order | `schemas/work-order.schema.json` | `examples/work-order.example.json` |
| Factory Manifest | `schemas/factory-manifest.schema.json` | `examples/factory-manifest.example.yaml` |
| Factory Version | `schemas/factory-version.schema.json` | `examples/factory-version.example.yaml` |
| Execution Profile | `schemas/execution-profile.schema.json` | `examples/execution-profile.example.yaml` |
| Capability Manifest | `schemas/capability-manifest.schema.json` | `examples/capability-manifest.example.yaml` |
| Qualification Record | `schemas/qualification-record.schema.json` | `examples/qualification-record.example.json` |
| Context Package | `schemas/context-package.schema.json` | `examples/context-package.example.json` |
| Attempt | `schemas/attempt.schema.json` | `examples/attempt.example.json` |
| Candidate | `schemas/candidate.schema.json` | `examples/candidate.example.json` |
| Evidence | `schemas/evidence.schema.json` | `examples/evidence.example.json` |
| Verification | `schemas/verification.schema.json` | `examples/verification.example.json` |
| Decision | `schemas/decision.schema.json` | `examples/decision.example.json` |
| Release | `schemas/release.schema.json` | `examples/release.example.json` |
| Outcome | `schemas/outcome.schema.json` | `examples/outcome.example.json` |
| Learning Signal | `schemas/learning-signal.schema.json` | `examples/learning-signal.example.json` |
| Improvement Candidate | `schemas/improvement-candidate.schema.json` | `examples/improvement-candidate.example.json` |

Validation (Python):

```python
import json, yaml
from jsonschema import Draft202012Validator, FormatChecker
schema = json.load(open("schemas/work-order.schema.json"))
Draft202012Validator.check_schema(schema)
example = json.load(open("examples/work-order.example.json"))
Draft202012Validator(schema, format_checker=FormatChecker()).validate(example)
```

Extension fields MUST match `^x-[a-z0-9]+(-[a-z0-9]+)*$`; all other unknown top-level fields are rejected.

## Related

- [/specification](/specification) · [/specification/conformance](/specification/conformance)
