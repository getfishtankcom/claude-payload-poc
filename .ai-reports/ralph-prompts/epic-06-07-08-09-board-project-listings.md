# Ralph Loop Prompt — Epics 6-9: Board Detail, Project Detail, Active Projects, Open Consultations

## Your Mission

Build the core content pages: Board Detail, Project Detail, Active Projects listing, and Open Consultations listing. These share sidebar components and follow similar layout patterns.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epics 6-9 tasks
3. `.ai-reports/BUILD_PLAN.md` — Epics 6-9 full task details
4. `.ai-reports/wireframe-specs.md` — wireframes for Board Detail, Project Detail, Active Projects, Open Consultations
5. `.ai-reports/PRD.md` — page specs and data requirements

## What to Build

### Epic 6: Board Detail (tasks 6.1–6.6)

Components in `src/components/board/`:
- **6.1 `<SectionNav />`** — vertical nav sidebar, 7 items, active state, mobile: dropdown
- **6.2 `<QuickActions />`** — vertical button list (CPA Handbook, Implementation Tools, Webinars)
- **6.3 `<UpcomingEvents />`** — "View All" link + event items with date/title/badge
- **6.4 `<ResourcesList />`** — document links with file type icons
- **6.5 `<RecentNews />`** — "View All →" + news items via `<NewsItem />`
- **6.6 Board Detail route** — `app/(frontend)/boards/[board-slug]/page.tsx`
  - 3-column layout: SectionNav | Main (tabs, content) | Right sidebar (actions, events, resources)
  - Fetch board + projects + news + events from Payload
  - `generateStaticParams` for SSG (5 boards)

### Epic 7: Project Detail (tasks 7.1–7.2)

- **7.1 `<ProjectTimeline />`** — 5-stage vertical stepper with completed/current/future indicators, inline CTAs
- **7.2 Project Detail route** — `app/(frontend)/active-projects/[board]/[project-slug]/page.tsx`
  - 3-column layout reusing Epic 6 sidebar components
  - Main: summary, key proposals, timeline, contacts
  - `generateStaticParams` for SSG

### Epic 8: Active Projects Listing (tasks 8.1–8.3)

- **8.1 `<BoardNav />`** — vertical board name list with active state, mobile: dropdown
- **8.2 `<ProjectCard />`** — title, badges, description, stage indicator, action buttons
- **8.3 Active Projects route** — `app/(frontend)/active-projects/page.tsx`
  - 2-column: BoardNav + project list
  - Filter bar: text search + standards dropdown
  - Projects grouped under collapsible standard headers

### Epic 9: Open Consultations (tasks 9.1–9.2)

- **9.1 `<ConsultationCard />`** — title, badges, deadline badge, board/standard, description, "Comments due in X days"
- **9.2 Route** — `app/(frontend)/open-consultations/page.tsx`
  - Filter bar: text search + board dropdown + standard dropdown

## Validation

```bash
npx tsc --noEmit
npm run dev
# /boards/acsb — renders 3-column layout with sidebar nav
# /active-projects — lists projects grouped by standard
# /active-projects/acsb/[slug] — project detail with timeline
# /open-consultations — consultation cards with countdown
# All pages responsive at 390px, 768px, 1440px
```

## Workflow

Build in order: Epic 6 → 7 → 8 → 9 (7-9 reuse Epic 6 components).

When ALL tasks across Epics 6-9 are `[x]`: update AUDIT_LOG.md, output:

```
<promise>EPICS 6 THROUGH 9 COMPLETE</promise>
```

## IMPORTANT

- Reuse sidebar components across pages — don't duplicate
- Use `generateStaticParams` for all dynamic routes
- Server components for data fetching, client components only for interactive elements
- If CMS isn't seeded, handle empty states gracefully
- `days_remaining` for consultations: compute client-side from `deadline_date`
