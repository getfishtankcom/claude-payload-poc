# Ralph Loop Prompt — Epic 1: CMS Collections & Globals

## Your Mission

Build all Payload CMS collections and globals for FRAS Canada Phase 1. This defines the data model for the entire site.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules and conventions
2. `.ai-reports/MASTER_TODO.md` — find Epic 1 tasks, check status
3. `.ai-reports/BUILD_PLAN.md` — Epic 1 full task details (tasks 1.1–1.11)
4. `.ai-reports/PRD.md` — Section 5 (CMS Architecture), collection field specs
5. `.ai-reports/dogfood-frascanada/notion-research-cross-reference.md` — field parity notes

## What to Build

11 collections + 4 globals in `src/collections/` and `src/globals/`:

### Collections
1. **boards** — name, abbreviation, slug, description, tabs[], quick_actions[], resources[]
2. **standards** — name, slug, category (enum), parts[] (for Accounting), board (belongsTo)
3. **projects** — title, slug, summary (richText), key_proposals (richText), status (enum), badges[], timeline_stages[], current_stage, relationships to board/standard/documents/contacts
4. **consultations** — title, slug, type (enum), deadline_date, description (richText), action_documents[], relationships to board/standard/project
5. **news** — title, slug, date, category (enum), excerpt, body (richText), featured_image (upload), board (belongsTo)
6. **events** — title, slug, date, type (enum: Webinar/Meeting/Deadline), description, registration_url, board (belongsTo)
7. **documents** — title, slug, type (enum), file (upload), description, relationships to board/standard/project
8. **decision-summaries** — title, slug, date, body (richText), board (belongsTo)
9. **contacts** — name, credentials, title, phone, email, photo (upload)
10. **pages** — title, slug, content (richText), sidebar_type (enum), meta (group: title, description, og_image)
11. _(no 11th in Phase 1 — 10 collections + globals)_

### Globals
1. **navigation** — utility_links[], primary_nav[], mega_menu config
2. **footer** — columns[], boards_links[], quick_links[], newsletter config
3. **homepage** — hero_heading, hero_subtitle, cta_block, newsletter_text, browse_by_standard
4. **search-config** — popular_tags[], default_filters

### For Each Collection:
- Create the Payload collection config in `src/collections/[Name].ts`
- Define ALL fields with correct types (text, richText, date, upload, relationship, select, array, group)
- Add slug auto-generation where needed
- Set proper access control (read: public for now)
- Add to `payload.config.ts` collections array

### For Each Global:
- Create in `src/globals/[Name].ts`
- Add to `payload.config.ts` globals array

## Validation

For each collection/global:
```bash
npm run dev  # No errors on startup
# Navigate to /admin — collection/global appears in sidebar
# Create a test entry — all fields render correctly
# Save entry — no validation errors
npx tsc --noEmit  # Clean TypeScript
```

## Workflow

1. Read MASTER_TODO.md → find first `[ ]` task in Epic 1
2. Mark `[~]`, build it, validate, mark `[x]`
3. Repeat for all tasks
4. When ALL tasks `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPIC 1 COMPLETE</promise>
```

## IMPORTANT

- This is an APPROVAL GATE epic — user reviews data model before building UI
- Use Payload CMS 3.x patterns (not v2) — check Context7 MCP for docs if unsure
- Every field must have a `label` and appropriate validation
- Use `relationship` type for foreign keys, not embedded objects
- Enable localization fields where text content needs EN/FR support (prepare for Epic 18)
- Seed data tasks are in Epic 10 — just define the schema here
