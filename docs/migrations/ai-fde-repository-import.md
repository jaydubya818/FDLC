---
title: AI-FDE repository import
date: 2026-09-14
status: accepted
---

# AI-FDE repository import

AI-FDE became part of the FDLC repository under `products/ai-fde/` through a non-squashed Git subtree import. The import preserves the source commit and its ancestors so future changes can be reconciled by commit identity rather than by an untraceable file copy.

## Provenance

| Field | Value |
| --- | --- |
| Original repository | `https://github.com/jaydubya818/AI-FDE-Agent` |
| Qualified source revision | `21305bbdb64b86bade75f4673d3e1a8233a2922e` |
| Source tree | `7c9aea40ee3253e648062f13ec1320f22c157773` |
| Import commit | `b990825` |
| Imported at | `2026-09-14` |
| License | MIT, Copyright 2026 Jarrett West |
| Strategy | `git subtree add --prefix=products/ai-fde <source-revision>` without squash |

The source revision passed its full trust, migration, integration, isolation, container, frontend, browser, accessibility, and design-partner gates on exact `main` in [Factory Engineer CI run 34879502699](https://github.com/jaydubya818/AI-FDE-Agent/actions/runs/34879502699). Its Vercel status also passed on the exact revision. These facts qualify the imported source; they do not establish live customer operation or authorize an FDLC Production release.

## Ownership and release boundary

FDLC is now the canonical source repository for continued AI-FDE development. The original repository remains available for historical provenance and should receive a read-only migration notice only after the canonical import is accepted.

The AI-FDE web app, API, worker, PostgreSQL schema, object storage, migrations, provider integration, and Terraform retain independent deployment and failure boundaries. Repository convergence is not runtime convergence. Root workflows execute AI-FDE gates only when `products/ai-fde/**` or their workflow definitions change.

Production release remains disabled from `main`. A merge, passing workflow, subtree update, or composed Preview does not authorize Production, customer data, live model calls, or qualification-environment activation.
