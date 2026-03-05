# Ralph Loop Prompt — Epic 4: Homepage

## Your Mission

Build the FRAS Canada homepage — the main landing page at `/`.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 4 tasks
3. `.ai-reports/BUILD_PLAN.md` — Epic 4 task details (4.1–4.5)
4. `.ai-reports/wireframe-specs.md` — Homepage wireframe (frames 1-3: desktop, mobile, browse by standard)
5. `.ai-reports/dogfood-frascanada/design-tokens.md` — hero gradient, colors
6. `.ai-reports/PRD.md` — homepage section specs

## What to Build

Route: `src/app/(frontend)/page.tsx`

### 4.1 Hero section
- H1 "Canada's Official Hub for Financial Reporting Standards"
- Subtitle text
- Search bar (opens SearchModal on click — wire to placeholder if Epic 5 not done)
- Hero gradient background from design tokens
- Mobile: responsive stacking

### 4.2 "New to FRAS?" CTA section
- Intro text + "Get Started" button
- Content from `homepage` global

### 4.3 "Important News & Events" 3-column grid
- Column 1: Top News (3 items via `<NewsItem />`) + "All News →" link
- Column 2: Exposure Drafts with ED number, title, date
- Column 3: Upcoming Events with date, title, type badge
- Mobile: stack as 3 sections
- Data from `news`, `events`, `documents` collections

### 4.4 "Browse by Standard" section
- 4-column card grid: Sustainability, Accounting, Public Sector, Assurance
- Each card: category heading + list of standard/board links
- Mobile: expandable list cards
- Data from `standards` collection

### 4.5 Wire homepage route
- Server component fetching `homepage` global + news + events + standards
- Client interactive sections where needed (search bar click, expandable cards)

## Validation

```bash
npx tsc --noEmit
npm run dev
# Visit http://localhost:3000 — homepage renders all 4 sections
# Check at 390px, 768px, 1440px — responsive layout correct
# Hero gradient displays correctly
# News/events/standards data loads from CMS (or shows empty state gracefully)
```

## Workflow

1. Read MASTER_TODO.md → find first `[ ]` task in Epic 4
2. Mark `[~]`, build, validate, mark `[x]`
3. When ALL Epic 4 tasks `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPIC 4 COMPLETE</promise>
```

## IMPORTANT

- Homepage is the most visually complex page — match wireframe closely
- Use `<Container />` primitive for max-width wrapper
- Use `<Stack />` for section spacing
- Hero uses the gradient token, NOT a hardcoded gradient
- If CMS collections aren't seeded yet, build with empty state handling
- Search bar is a visual element that triggers SearchModal — don't build search logic here
