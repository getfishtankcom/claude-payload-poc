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

### Data Test IDs

Add `data-testid` attributes to key structural elements for automated self-testing:
- Page containers: `data-testid="page-<name>"`
- Sections: `data-testid="section-<name>"`
- Interactive elements: `data-testid="<element-name>"`
- Layout regions: `data-testid="sidebar-nav"`, `data-testid="main-content"`, `data-testid="right-rail"`

### Self-Test

After all tasks pass, run the automated self-test before outputting `<promise>`:

```bash
node scripts/self-test.mjs --epic epic-04
```

Config: `scripts/self-test-configs/epic-04.json`
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
