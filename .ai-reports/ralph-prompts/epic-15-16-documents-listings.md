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

### Data Test IDs

Add `data-testid` attributes to key structural elements for automated self-testing:
- Page containers: `data-testid="page-<name>"`
- Sections: `data-testid="section-<name>"`
- Interactive elements: `data-testid="<element-name>"`
- Layout regions: `data-testid="sidebar-nav"`, `data-testid="main-content"`, `data-testid="right-rail"`

### Self-Test

After all tasks pass, run the automated self-test before outputting `<promise>`:

```bash
node scripts/self-test.mjs --epic epic-15-16
```

Config: `scripts/self-test-configs/epic-15-16.json`
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
