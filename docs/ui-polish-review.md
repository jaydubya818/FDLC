# Public UI polish acceptance

The Production audit covered 23 routes at 1440, 900, and 390px. It included the marketing pages, Framework, Architecture, Mission Control, FDE, Maturity, Guide home, Atlas, Reference, Glossary, Search, two deep chapters, governed admission, and both 404 surfaces.

Observed issues: different header sizes and breakpoints, trapped Tab navigation, tablet home overflow, a long mobile qualification label, duplicate Guide scroll-region labels, tiny evidence identifiers, inconsistent footer treatments, and dense mobile tables.

The shared CSS and navigation source now belong to FDLC and are generated into the Guide. Guide reading controls remain application-owned below the common header. Both footers use the transparent FDLC mark. Specification is linked from Framework, Architecture, Reference, and the footer. Benchmarks remains linked from Maturity, FDE measurement, the economics chapter, and the footer. More remains exactly five destinations.

Read-only visual review covered the exact native candidates at desktop, tablet, mobile, and 1920px. Header geometry and fonts matched exactly at all four widths. No document-level horizontal overflow or axe violations remained across the 69 page states. Both 404s returned expected 404 responses; other console and page errors were absent.

The separate visual review identified dense mobile table columns and unclear diagram loading/failure presentation. Wider local table scrolling, a visible scroll cue, and explicit diagram states address those findings. The refined mobile table was rechecked visually and with axe. Full identifiers remain selectable; copy success and denied-permission feedback both passed.

FDLC qualification passed 31 unit and 20 rendered checks, both production builds, and 50 browser checks, 13 flows, and 14 local links per runtime. Guide qualification passed 82 rendered/content checks, links, and native browser acceptance in compatibility and final canonical modes, including light/dark palette focus restoration, code/diagram scrolling, search, redirects, and prefixed assets.

The concurrently merged FDE redesign at `42713423c96cd698c7a27240547b5b7e7d843f03` is preserved. Qualification-ready, dormant, experimental, and unproven boundaries retain their original meaning. No runtime, inference, backend, release-gate, or MFE ownership behavior was changed.

Production acceptance, exact final-main SHAs, deployment attribution, performance comparison, and rollback receipts must be recorded after the release; local acceptance is not a claim of Production acceptance.
