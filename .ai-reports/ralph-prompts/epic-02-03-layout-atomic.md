# Ralph Loop Prompt — Epics 2 & 3: Layout + Atomic Components

## Your Mission

Build all shared layout components (header, footer, mobile menu, mega menu, breadcrumbs, root layout) and atomic/utility components (badges, chips, pagination, page header, newsletter CTA, news item). These are used across every page.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 2 and Epic 3 tasks
3. `.ai-reports/BUILD_PLAN.md` — Epics 2 & 3 full task details
4. `.ai-reports/wireframe-specs.md` — wireframe specs for header, footer, mobile menu, mega menu
5. `.ai-reports/dogfood-frascanada/design-tokens.md` — all visual tokens
6. `.ai-reports/PRD.md` — component specs

## Epic 2: Layout Components (tasks 2.1–2.6)

Build in `src/components/layout/`:

### 2.1 `<SiteHeader />`
- Row 1: Utility bar (About Us ▾, Boards ▾, Contact, Newsletter, Volunteer, FR, Sign In)
- Row 2: Logo + persistent search input
- Row 3: Primary nav (Active Projects ▾, Open Consultations, News)
- Mobile: collapse to logo + search icon + hamburger
- Wire to `navigation` global via Payload API
- Use Headless UI for dropdown menus

### 2.2 `<SiteFooter />`
- 4-column layout: Org info, Boards, Quick Links (2 sub-cols), Account
- Newsletter CTA row: heading + email input + Subscribe button
- Copyright bar with policy links + LinkedIn icon
- Mobile: stack to single column
- Wire to `footer` global

### 2.3 `<MobileMenu />`
- Full-screen overlay with close (X) button
- Search input at top, FR toggle + Sign In
- Expandable sections with nested board nav
- Use Headless UI `<Dialog>` for overlay
- Animate open/close with CSS transitions or Motion

### 2.4 `<MegaMenu />`
- About Us: single column, 4 links
- Boards: 4-column mega-menu with 7 sub-links per board
- Active Projects: single column, 4 board links
- Use Headless UI `<Popover>` for dropdowns
- Escape/click-outside to close

### 2.5 `<Breadcrumb />`
- Auto-generate from route path
- Support custom overrides via page data
- Separator: " > " or chevron icon

### 2.6 Root layout
- `src/app/(frontend)/layout.tsx` with SiteHeader + SiteFooter
- Inter font loading via `next/font/google`
- Default metadata
- Import globals.css with theme

## Epic 3: Atomic Components (tasks 3.1–3.6)

Build in `src/components/`:

### 3.1 `<ContentTypeBadge />`
- Extends the `<Badge />` primitive from `ui/`
- Maps content types to badge variants
- Props: `type` (string enum), `label?` (override)

### 3.2 `<TagChip />`
- Pill-style chip for search tags
- Props: `label`, `onClick`, `active` (boolean)
- Active: filled bg, inactive: outline

### 3.3 `<Pagination />`
- "Showing X-Y of Z results" text
- Numbered page buttons with prev/next arrows
- Props: `totalItems`, `itemsPerPage`, `currentPage`, `onChange`

### 3.4 `<PageHeader />`
- Icon + H1 title pattern
- Props: `icon?` (React node), `title`, `subtitle?`
- Purple H1 using text-heading color

### 3.5 `<NewsletterCTA />`
- "Trusted by 3,000+..." heading
- Email input + Subscribe button
- LinkedIn CTA link
- Wire submit to HubSpot Forms API (or placeholder action for now)

### 3.6 `<NewsItem />`
- Date + title + excerpt + "Read More →"
- Props: `news` object `{ date, title, excerpt, slug }`

## Validation

For each component:
```bash
npx tsc --noEmit  # TypeScript clean
npm run dev  # No console errors
# Visual check: component renders correctly at 390px, 768px, 1440px
```

Layout components specifically:
- Header renders on every page
- Footer renders on every page
- Mobile menu opens/closes smoothly
- Mega menu dropdowns work with keyboard (Escape to close)
- Breadcrumbs auto-generate from URL path

## Workflow

1. Read MASTER_TODO.md → find first `[ ]` task in Epic 2 or 3
2. Mark `[~]`, build it, validate, mark `[x]`
3. Work through both epics (they're parallel — no dependency between them)
4. When ALL tasks in BOTH epics are `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPICS 2 AND 3 COMPLETE</promise>
```

## IMPORTANT

- Use design tokens — NEVER hardcode colors, spacing, or font sizes
- Use Tailwind CSS v4 classes — reference the `@theme inline` variables
- Use Headless UI for all interactive overlays/dropdowns (already installed in Epic 0)
- Use Heroicons for icons
- All components must be responsive (mobile-first)
- Server Components by default; add `'use client'` only where interactivity requires it
- Refer to wireframe-specs.md for exact layout specs
