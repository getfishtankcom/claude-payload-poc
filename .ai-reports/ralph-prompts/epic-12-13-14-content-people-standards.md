# Ralph Loop Prompt — Epics 12-14: Content Templates, People, Standards

## Your Mission

Build Phase 2 content page templates (T3A, T3B, T17), people/organization pages (members T4, committees T14), and standards section pages (T5 overview, T10 effective dates).

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epics 12-14 tasks
3. `.ai-reports/BUILD_PLAN-phase2.md` — full task details
4. `.ai-reports/dogfood-frascanada/wireframe-specs-phase2.md` — ASCII wireframes for T3, T4, T5, T10, T14, T17
5. `.ai-reports/dogfood-frascanada/design-tokens.md` — visual tokens

## Epic 12: Content Page Templates (6 tasks)
- 12.1 `<StaffContactCard />` — purple heading, contact info with tel/mailto links
- 12.2 `<SectionNavSidebar />` — vertical link list, active state bold+underline
- 12.3 `<SectionTabs />` — horizontal tabs, active bottom border, mobile: horizontal scroll
- 12.4 Template 3A: Content + Staff Contact sidebar (70/30 split)
- 12.5 Template 3B: Content + Section Nav sidebar
- 12.6 Template 17: Simple content / empty state (jobs page)

## Epic 13: People & Organization (4 tasks)
- 13.1 `<MemberCard />` — 205x205 photo, name link, credentials, role label, dates
- 13.2 Template 4: People listing (members) — 2-column grid, section groups
- 13.3 `<AnchorNav />` — scroll-spy sidebar, "On this page", Intersection Observer
- 13.4 Template 14: Committee index/directory — anchor nav sidebar

## Epic 14: Standards Section (6 tasks)
- 14.1 `<BoardLogoHero />` — board crest, name, brand-color bg
- 14.2 `<ActiveProjectsTable />` — 2-column table, mobile: stacked cards
- 14.3 `<FeatureCTABlock />` — 1-2 CTA cards, light/dark-purple variants
- 14.4 Template 5: Standards overview (tabbed) — hero + tabs + projects table + CTAs + news
- 14.5 `<EffectiveDatesTable />` — purple section headers, alternating rows, footnotes, print-friendly
- 14.6 Template 10: Effective dates page

## Validation

```bash
npx tsc --noEmit
npm run dev
# Content pages render with correct sidebar type
# Members page shows 2-column card grid
# Committee page has working scroll-spy anchor nav
# Standards overview has tabs + projects table + CTA blocks
# Effective dates table renders grouped sections with purple headers
# All pages responsive at 390px, 768px, 1440px
```

## Stop Condition

When ALL tasks across Epics 12-14 are `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPICS 12 THROUGH 14 COMPLETE</promise>
```
