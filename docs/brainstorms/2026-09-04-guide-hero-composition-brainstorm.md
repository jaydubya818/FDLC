---
date: 2026-09-04
topic: guide-hero-composition
---

# Guide hero composition

## What We're Building

Recompose the Guide landing hero so its headline and portal information begin on the same visual axis, fit comfortably in the first viewport, and present one unmistakable primary action. The page remains an FDLC-native portal into the full Guide rather than a second copy of the book.

## Why This Approach

The current hero uses the shared vertically centered two-column pattern. The right column is substantially taller than the left, so the headline floats low in a large empty field and the three actions wrap according to available width rather than intended priority. A page-specific alignment and action layout fixes the actual composition without introducing a one-off component or changing every editorial page.

## Key Decisions

- Top-align both hero columns and reduce page-specific vertical padding.
- Preserve the editorial headline and the existing FDLC/Guide distinction.
- Keep the full Guide as the primary CTA, FDLC in 5 Minutes as secondary, and Framework as a quiet tertiary link on its own row.
- Preserve generous negative space, but make it directional and bounded rather than accidental.
- Stack actions on mobile and retain touch-friendly targets.

## Open Questions

- None. The screenshot identifies a clear layout defect rather than a product-direction decision.

## Next Steps

- Implement the page-scoped CSS.
- Compare at desktop and mobile viewports.
- Run accessibility and production checks, then republish.
