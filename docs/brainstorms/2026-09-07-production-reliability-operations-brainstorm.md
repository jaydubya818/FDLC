---
date: 2026-09-07
topic: production-reliability-operations
---

# Production reliability and incident operations

## What we're building

Turn the post-compensation system-design material and the production-reliability
material into one practical operating layer for FDLC users. The Guide will own a
new production-operations playbook, while the Architecture and Mission Control
pages will expose its governing contracts and implementation priorities.

The work keeps the six FDLC architecture areas and the existing factory
lifecycle. It adds no second framework, vendor taxonomy, or claim that Mission
Control already provides broad incident automation.

## Why this approach

Most of the source material reinforces Chapters 14, 35, and 36. Copying hundreds
of scenario prompts would make the Guide harder to use. A compact playbook adds
the missing value: a saga and compensation contract, blast-radius and known-good
records, declared degraded modes, scenario-driven drills, and verified incident
closure. The public site should summarize those decisions and link to the Guide.

## Key decisions

- Preserve the canonical FDLC model and strengthen its operating practice.
- Treat retry, reconciliation, compensation, rollback, and restoration as
  different authorized operations with different preconditions.
- Make incident impact and recovery traceable through existing Factory Version,
  Execution Profile, WorkOrder, Attempt, Evidence, release, and outcome records.
- Keep Mission Control's four development priorities in their current order.
  Add incident-operating controls as requirements inside that sequence.
- Label broad blast-radius analysis, degraded-mode control, saga recovery, and
  verified incident closure as required work rather than available capability.
- Exclude source organizations, internal product labels, interview framing, and
  personal names from public content.

## Open questions

None block the documentation and public product work. Mission Control runtime
implementation still requires repository-specific design and qualification.

## Next steps

1. Add the Guide playbook and link it from the canonical chapters and Guide home.
2. Add a concise reliability contract to the FDLC Architecture page.
3. Add Mission Control incident-operating requirements without changing roadmap
   priority or maturity claims.
4. Run content, link, type, lint, build, and responsive browser checks.
