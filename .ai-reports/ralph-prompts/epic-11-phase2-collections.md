# Ralph Loop Prompt — Epic 11: Phase 2 CMS Collections

## Your Mission

Build all Phase 2 Payload CMS collections and globals (13 tasks). Extend existing collections and add new ones for content pages, people, standards, documents, listings, forms, and auth.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 11 tasks (11.1–11.13)
3. `.ai-reports/BUILD_PLAN-phase2.md` — Epic 11 full task details
4. `.ai-reports/PRD-phase2.md` — collection field specs
5. `.ai-reports/dogfood-frascanada/notion-research-cross-reference.md` — field references

## What to Build

13 tasks: `board-members`, `committees`, `resources`, `effective-dates`, `documents-for-comment`, `document-details`, `form-submissions`, `job-postings`, extend `pages`, extend `news`, `standards-sections`, `auth-config` global, extend/create `meetings`.

See BUILD_PLAN-phase2.md for exact field specs per collection.

## Validation

```bash
npx tsc --noEmit
npm run dev
# Each new collection/global appears in /admin sidebar
# Test entry creation for each — all fields render, save works
```

## Stop Condition

When ALL 13 tasks `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPIC 11 COMPLETE</promise>
```
