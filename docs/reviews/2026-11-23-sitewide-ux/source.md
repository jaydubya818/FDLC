# Source inventory

These comparisons use the base and head of each reviewed implementation. The documentation-only evidence commit is independent of both application builds.

## FDLC

Base `35fe77fceba3a973bc497748f85acd450b253b87` · Candidate `9e3cf0e9dd89249486af0b2579aa87b3c12d672f` · 26 files. [Pull request #92](https://github.com/jaydubya818/FDLC/pull/92)

### Commits

- Clarify the FDLC visitor journey and qualify responsive layouts. [e20d22c0](https://github.com/jaydubya818/FDLC/commit/e20d22c09b8f50ab7c23ef8da0877f1947265b7c)
- Keep mobile navigation dismissible with Escape in WebKit. [7d4c9cd4](https://github.com/jaydubya818/FDLC/commit/7d4c9cd4a8508d6c6dd0c7eb69541acba4567ad7)
- Preload reader fonts and avoid delayed layout shifts. [90f7d22b](https://github.com/jaydubya818/FDLC/commit/90f7d22b5c7a2e411d5153fe72f1c158c8aade24)
- Align explicit builder transitions below the sticky masthead. [9e3cf0e9](https://github.com/jaydubya818/FDLC/commit/9e3cf0e9dd89249486af0b2579aa87b3c12d672f)

### Files

| Change | File at the tested commit |
|---|---|
| Modified | [app/components/artifact-export.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/components/artifact-export.tsx) |
| Modified | [app/components/factory-builder.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/components/factory-builder.tsx) |
| Modified | [app/components/maturity-assessment.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/components/maturity-assessment.tsx) |
| Modified | [app/components/runtime-simulator.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/components/runtime-simulator.tsx) |
| Modified | [app/components/site-header.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/components/site-header.tsx) |
| Modified | [app/design-system.css](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/design-system.css) |
| Modified | [app/factory-engineering/practice.module.css](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/factory-engineering/practice.module.css) |
| Modified | [app/globals.css](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/globals.css) |
| Modified | [app/lab/page.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/lab/page.tsx) |
| Modified | [app/layout.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/layout.tsx) |
| Modified | [app/page.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/page.tsx) |
| Added | [app/reader-experience.css](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/reader-experience.css) |
| Modified | [app/start/page.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/app/start/page.tsx) |
| Modified | [docs/design-system.md](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/docs/design-system.md) |
| Modified | [lib/global-navigation.ts](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/lib/global-navigation.ts) |
| Modified | [package-lock.json](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/package-lock.json) |
| Modified | [package.json](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/package.json) |
| Modified | [products/ai-fde/apps/web/components/fdlc-shell/design-system.css](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/products/ai-fde/apps/web/components/fdlc-shell/design-system.css) |
| Modified | [products/ai-fde/apps/web/components/fdlc-shell/global-navigation.ts](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/products/ai-fde/apps/web/components/fdlc-shell/global-navigation.ts) |
| Modified | [products/ai-fde/apps/web/components/fdlc-shell/manifest.json](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/products/ai-fde/apps/web/components/fdlc-shell/manifest.json) |
| Modified | [products/ai-fde/apps/web/components/fdlc-shell/site-header.tsx](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/products/ai-fde/apps/web/components/fdlc-shell/site-header.tsx) |
| Modified | [tests/browser.mjs](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/tests/browser.mjs) |
| Added | [tests/experience-layout.mjs](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/tests/experience-layout.mjs) |
| Modified | [tests/helpers/global-navigation.mjs](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/tests/helpers/global-navigation.mjs) |
| Modified | [tests/rendered-html.test.mjs](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/tests/rendered-html.test.mjs) |
| Added | [tests/visual/macos-chrome.json.gz](https://github.com/jaydubya818/FDLC/blob/9e3cf0e9dd89249486af0b2579aa87b3c12d672f/tests/visual/macos-chrome.json.gz) |

## Guide

Base `dcc47c470e3c7103c247d4c225baa6c1c8bd8baf` · Candidate `c21a4cc86bfad61d828cd120cad70a8a6bc9e536` · 22 files. [Pull request #50](https://github.com/jaydubya818/ai-software-factory-mastery/pull/50)

### Commits

- Improve Guide search, chapter navigation and deep links. [f33e9456](https://github.com/jaydubya818/ai-software-factory-mastery/commit/f33e9456f670a24120c6ac154250e07d1e55bc04)
- Return mobile menu keyboard control to its trigger. [a1856caa](https://github.com/jaydubya818/ai-software-factory-mastery/commit/a1856caaa5c1dedc366fa9c01f520ca9ccdab915)
- Keep Guide typography stable while fonts load. [2983fca7](https://github.com/jaydubya818/ai-software-factory-mastery/commit/2983fca7b8d6540c2bd5fbba06a1790b681610cc)
- Verify preloaded Guide fonts as published WOFF2 assets. [c21a4cc8](https://github.com/jaydubya818/ai-software-factory-mastery/commit/c21a4cc86bfad61d828cd120cad70a8a6bc9e536)

### Files

| Change | File at the tested commit |
|---|---|
| Modified | [guide/02-design/10-multi-repository-design.md](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/guide/02-design/10-multi-repository-design.md) |
| Modified | [guide/03-build/15-coding-harnesses-and-agent-protocols.md](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/guide/03-build/15-coding-harnesses-and-agent-protocols.md) |
| Modified | [guide/03-build/22-routing-and-the-escalation-ladder.md](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/guide/03-build/22-routing-and-the-escalation-ladder.md) |
| Modified | [guide/03-build/24-loop-engineering-patterns-and-defaults.md](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/guide/03-build/24-loop-engineering-patterns-and-defaults.md) |
| Modified | [guide/04-prove/27-quality-and-evidence-architecture.md](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/guide/04-prove/27-quality-and-evidence-architecture.md) |
| Modified | [guide/06-improve/40-governed-learning.md](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/guide/06-improve/40-governed-learning.md) |
| Modified | [guide/06-improve/41-meta-loops-and-the-closed-loop-factory.md](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/guide/06-improve/41-meta-loops-and-the-closed-loop-factory.md) |
| Modified | [site/app/components/ChapterTOC.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/components/ChapterTOC.tsx) |
| Modified | [site/app/components/CommandPalette.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/components/CommandPalette.tsx) |
| Modified | [site/app/components/GuideDocument.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/components/GuideDocument.tsx) |
| Modified | [site/app/components/ReferenceSearch.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/components/ReferenceSearch.tsx) |
| Modified | [site/app/components/SearchExperience.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/components/SearchExperience.tsx) |
| Modified | [site/app/components/SiteHeader.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/components/SiteHeader.tsx) |
| Modified | [site/app/design-system.generated.css](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/design-system.generated.css) |
| Modified | [site/app/globals.css](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/globals.css) |
| Modified | [site/app/guide/coverage/page.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/guide/coverage/page.tsx) |
| Modified | [site/app/layout.tsx](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/app/layout.tsx) |
| Modified | [site/lib/global-navigation.generated.ts](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/lib/global-navigation.generated.ts) |
| Modified | [site/lib/search-client.ts](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/lib/search-client.ts) |
| Modified | [site/lib/text.ts](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/lib/text.ts) |
| Modified | [site/tests/search-reader.test.mjs](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/tests/search-reader.test.mjs) |
| Modified | [site/tests/site-crawl.test.mjs](https://github.com/jaydubya818/ai-software-factory-mastery/blob/c21a4cc86bfad61d828cd120cad70a8a6bc9e536/site/tests/site-crawl.test.mjs) |
