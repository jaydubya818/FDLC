# FDLC hero diagrams (SVG)

Twelve hand-authored, self-contained SVG hero diagrams from the visual canon (`/diagrams`). Each file: 1600×900 viewBox (16:9), embedded `<style>` with CSS variables for light and dark (`prefers-color-scheme`), system font stack, `<title>` + `<desc>`, one `<g id>` per element, arrowheads via `<marker>`, canon colour semantics, no external references, 11–14 KB. PNG previews are rendered at 2× (3200×1800) in `png/`; `-dark` files are the same diagram under `prefers-color-scheme: dark`.

Regenerate PNGs with any headless browser; the renders here came from Chromium via Playwright (`<img src="Dxx.svg">` at device scale 2).

| File | Diagram | One line | PNG preview (light) | PNG preview (dark) |
|---|---|---|---|---|
| `D01.svg` | What is an Autonomous Software Factory | Builder → Intent → factory (Plan · Route · Execute · Verify) under a control plane; Evidence → Decision → Verified outcome; learning returns as a new Factory Version. | `png/D01.png` | `png/D01-dark.png` |
| `D02.svg` | The Delivery Loop | Ten steps in two rows with question and artifact per step, loop-backs (Verify → Execute, Approve → Plan), hand-off to Improve, and the non-collapsible state strip. | `png/D02.png` | `png/D02-dark.png` |
| `D03.svg` | The Factory Lifecycle | Eight stages with purpose, output artifact and exit criterion; Improve → Qualify loop; Factory Version states along the lifecycle. | `png/D03.png` | `png/D03-dark.png` |
| `D04.svg` | Two Loops | Outer Factory Lifecycle row, inner Delivery Loop row, the Operate wedge that hosts the inner loop, Learning Signals up to Improve, new Factory Version back to Qualify. | `png/D04.png` | `png/D04-dark.png` |
| `D05.svg` | The Composition Hierarchy | Seven stepped levels FDLC → Factory Ecosystem → Control Plane → Factory → Harness → Agent → Model, authority down / evidence back, and the cross-cutting roles panel. | `png/D05.png` | `png/D05-dark.png` |
| `D06.svg` | Reference Architecture — Twelve Layers in Four Planes | Stacked planes I–IV with all ten layers and their contents, L11/L12 cross-cutting column, authority-down and evidence-back side arrows. | `png/D06.png` | `png/D06-dark.png` |
| `D08.svg` | The Control Boundary | Human authority → control plane; authority down to intelligence supply and governed execution; evidence back; independent verification; expected-to-change vs required-to-persist. | `png/D08.png` | `png/D08-dark.png` |
| `D09.svg` | Multi-Factory Orchestration — SSO Example | Objective INT-100 through the Objective Planner, Plan, Factory Router and Registry; three Work Orders to two factories; join, Integration V&V, human acceptance, Release, Outcome back. | `png/D09.png` | `png/D09-dark.png` |
| `D10.svg` | Three-Level Routing | Level 1 Objective routing, Level 2 Work Order routing (eligibility before ranking, blocked path, scheduling separate), Level 3 Task routing to a frozen Attempt. | `png/D10.png` | `png/D10-dark.png` |
| `D11.svg` | Factory Version Composition | Manifest card for FV-depmod-1.0 with fourteen pinned component tiles, why mutable configuration cannot be governed, and the Draft → Active states. | `png/D11.png` | `png/D11-dark.png` |
| `D14.svg` | Evidence Architecture — Claim to Authority | Claim → Evidence → Verification → Decision → Authority chain with the control plane delegating and the consequence below; binding panel, six evidence states, Decision kinds. | `png/D14.png` | `png/D14-dark.png` |
| `D19.svg` | Agent, Skill, Tool, Harness, Factory | Nested Ecosystem → Factory → Runtime → Sandbox → Harness → Agent + Agent Loop; Skills, Tools, Model, Context Package, Verifier as satellites with labeled edges. | `png/D19.png` | `png/D19-dark.png` |

Authoring source for regeneration lives with the visual-canon tooling (a small Python SVG kit); the SVGs are the deliverable and can be edited directly.
