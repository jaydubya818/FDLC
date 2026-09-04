---
date: 2026-09-03
topic: interactive-factory-explorer
---

# Interactive Factory Explorer

## What We're Building

Replace the homepage's static runtime and architecture grids with one interactive explorer. A visitor chooses a runtime stage and immediately sees the governing question, durable record, evidence required, and the factory capabilities participating at that point. Selecting a capability explains its responsibility and links to the corresponding architecture area.

## Why This Approach

The current diagram names the parts but does not teach how they work together. A stage-led explorer preserves the lifecycle as the primary mental model while making the architecture concrete without adding a separate product demo or simulated workflow. It also works as fully rendered content before JavaScript hydrates.

## Key Decisions

- Default to **Verify** because independent verification is FDLC's clearest differentiator.
- Use one shared detail panel instead of popovers so explanations remain readable, keyboard-accessible, and usable on mobile.
- Make runtime stages WAI-style tabs with arrow-key navigation; make capability cells toggle buttons with visible participating and selected states.
- Keep the design in FDLC's editorial/industrial language: ink control surface, ruled records, mono metadata, and restrained motion.
- Link each capability to the closest canonical Architecture area rather than inventing a second architecture taxonomy.
- Keep all interaction local. No loading, account, persistence, or simulated production claims are needed.

## Open Questions

- None for this release. A later version can connect the explorer to a live Mission Control trace once representative production evidence exists.

## Next Steps

Implement the explorer, test mouse and keyboard behavior at desktop and mobile widths, and deploy it with the rest of the homepage.
