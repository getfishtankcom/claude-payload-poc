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

### Data Test IDs

Add `data-testid` attributes to key structural elements for automated self-testing:
- Page containers: `data-testid="page-<name>"`
- Sections: `data-testid="section-<name>"`
- Interactive elements: `data-testid="<element-name>"`
- Layout regions: `data-testid="sidebar-nav"`, `data-testid="main-content"`, `data-testid="right-rail"`

### Self-Test

After all tasks pass, run the automated self-test before outputting `<promise>`:

```bash
node scripts/self-test.mjs --epic epic-02-03
```

Config: `scripts/self-test-configs/epic-02-03.json`
See exit protocol for handling failures vs warnings.

### Storybook Stories

For EVERY component built in this epic, create a co-located story file:

- File: `ComponentName.stories.tsx` next to `ComponentName.tsx`
- Format: CSF3 with `satisfies Meta<typeof Component>` and `tags: ['autodocs']`
- Title hierarchy: `Category/ComponentName` (e.g., `Layout/SiteHeader`, `UI/Button`, `Board/SectionNav`)
- Required stories per component:
  - Default (all default props)
  - Each variant (if component has variants)
  - Mobile viewport (`parameters: { viewport: { defaultViewport: 'mobile' } }`)
  - Edge case (empty data, long text, error state)
- Use mock data from `src/__mocks__/cms-data.ts` for CMS-driven components — extend the mock file if needed
- For compound components (e.g., Card with Card.Header, Card.Body), show all slot combinations

**Validation:** `npx storybook build --quiet` must exit 0

---

## EXIT PROTOCOL (MANDATORY — applies to every Ralph loop)

### Per-Task Completion

A task is DONE when ALL of these pass. Do not skip any.

1. Every acceptance criteria checkbox in MASTER_TODO.md is satisfied
2. Every validation command listed for the task exits with code 0
3. `npx tsc --noEmit` passes (zero TypeScript errors)
4. Task status updated to `[x]` in MASTER_TODO.md
5. Git commit created: `feat(epic-N): task N.M — [short description]`

### Per-Task Failure (3-strike rule)

If a task fails validation:
1. First attempt: diagnose root cause, fix, re-validate
2. Second attempt: try alternative approach, re-validate
3. Third attempt: mark task `[!]` with reason, move to next task
4. Do NOT loop endlessly — 3 attempts max per task

### Per-Epic Completion

When ALL tasks in the epic are `[x]`:

1. Run full validation suite:
   ```bash
   npx tsc --noEmit
   npm run build
   ```
2. If both pass:
   - Update `.ai-reports/AUDIT_LOG.md` with:
     - Date (run `date '+%Y-%m-%d'`)
     - Type: BUILD
     - Epic number and name
     - All tasks completed
     - Files created/modified (list them)
     - Any deviations from spec
   - Create summary git commit: `feat(epic-N): [epic description] — all tasks complete`
   - Output EXACTLY this (the runner script watches for it):
     ```
     <promise>EPIC N COMPLETE</promise>
     ```
3. If build fails: treat as a task failure, apply 3-strike rule to the build fix

### Blocked Exit

When you cannot proceed:

1. Mark current task `[!]` in MASTER_TODO.md with reason
2. Try remaining tasks in the epic (skip blocked ones)
3. When no more tasks can be attempted, output EXACTLY:
   ```
   <promise>EPIC N BLOCKED: [one-line reason]</promise>
   ```

### HARD STOPS (abort the entire loop immediately)

Output `<promise>EPIC N ABORTED: [reason]</promise>` if ANY of these occur:
- Dev server won't start after 3 fix attempts
- Unresolvable dependency conflict (e.g., peer dep hell)
- Task requires output from a GATE epic not yet approved
- More than 5 structural TypeScript errors (not typos — architectural issues)
- Database connection fails and cannot be recovered
- You detect you're in an infinite loop (same error 3+ times)

### What NOT To Do

- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT mark tasks `[x]` before validation passes
- Do NOT skip reading MASTER_TODO.md at the start — always check current state
- Do NOT retry the same failing approach more than 3 times
- Do NOT install packages not specified in the build plan without documenting why
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push` — the runner script handles that after human review
