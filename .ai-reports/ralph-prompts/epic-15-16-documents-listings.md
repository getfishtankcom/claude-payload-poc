# Ralph Loop Prompt — Epics 15-16: Document Workflow + Listings

## Your Mission

Build document workflow pages (T8 listing, T9 detail) and listing templates (T11 resources, T12 news, T13 meetings).

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epics 15-16 tasks
3. `.ai-reports/BUILD_PLAN-phase2.md` — full task details
4. `.ai-reports/dogfood-frascanada/wireframe-specs-phase2.md` — wireframes for T8, T9, T11, T12, T13

## Epic 15: Document Workflow (8 tasks)
- 15.1 `<TabPills />` — Open/Closed toggle, active filled, inactive outline
- 15.2 `<GroupedTable />` — gray banner section headers, alternating rows
- 15.3 `<DocumentRow />` — title link + Submit Comment / View Comments buttons
- 15.4 Template 8: Documents for Comment listing — tabs + grouped table
- 15.5 `<DarkPurpleCTA />` — dark purple bg, white text, "How to Reply" block
- 15.6 `<BlockquoteQuestion />` — bordered box, question number + text
- 15.7 `<SupportMaterialsList />` — chain-link icon + labeled doc links
- 15.8 Template 9: Document detail (exposure draft) — highlights + questions + How to Reply + sidebar

## Epic 16: Listings (7 tasks)
- 16.1 `<CategoryPills />` — horizontal filter pills, mobile: select dropdown
- 16.2 `<SortFilterBar />` — sort, items per page, type filter, date range
- 16.3 `<ListingItem />` — date + badges + title link + excerpt
- 16.4 Template 11: Resources listing — category pills + sort bar + items + pagination
- 16.5 Template 12: News listing — category pills + sort bar + items (also volunteer variant)
- 16.6 `<TabToggle />` — Upcoming/Past two-state toggle
- 16.7 Template 13: Meetings & events listing — tab toggle + items per page + pagination

## Validation

```bash
npx tsc --noEmit
npm run dev
# Documents listing: Open/Closed tabs switch content, grouped table renders
# Document detail: all sections render (highlights, questions, How to Reply, sidebar)
# Resources listing: category pills filter, sort works, pagination
# News listing: filters, pagination, volunteer variant
# Meetings listing: upcoming/past toggle, server-side pagination
```

## Stop Condition

When ALL tasks across Epics 15-16 are `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPICS 15 AND 16 COMPLETE</promise>
```
