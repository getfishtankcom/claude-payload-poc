# Ralph Loop Prompt — Epics 12-14: Content Templates, People, Standards

## Your Mission

Build Phase 2 content page templates (T3A, T3B, T17), people/organization pages (members T4, committees T14), and standards section pages (T5 overview, T10 effective dates).

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epics 12-14 tasks
3. `.ai-reports/BUILD_PLAN-phase2.md` — full task details
4. `.ai-reports/dogfood-frascanada/wireframe-specs-phase2.md` — ASCII wireframes for T3, T4, T5, T10, T14, T17
5. `.ai-reports/dogfood-frascanada/design-tokens.md` — visual tokens

## CMS Data Pattern (MANDATORY)

All page content MUST come from Payload CMS. Follow this pattern:

1. **Page route (server component):** Fetch data via typed helpers from `src/lib/payload-helpers.ts` or direct `payload.find()` / `payload.findGlobal()` calls
2. **Pass data as props:** Never fetch CMS data inside presentational components
3. **No hardcoded content:** Component props must NOT have default values for user-facing text. The only acceptable defaults are empty states ("No items found")
4. **Typed props:** Component interfaces must match Payload collection/global field shapes (use generated types from `payload-types.ts`)
5. **Empty states:** Handle missing CMS data with fallback UI (skeleton or "No data" message), NOT fallback text
6. **Canonical names:** Use `document-for-comment` (not consultations), `resources` (not documents), `events` (not meetings)
7. **Exception:** Form field labels, button labels like "Submit", and structural UI text ("Showing X of Y") are acceptable hardcoded strings — these are UI chrome, not CMS content

## Epic 12: Content Page Templates (6 tasks)
- 12.1 `<StaffContactCard />` — purple heading, contact info with tel/mailto links
- 12.2 `<SectionNavSidebar />` — vertical link list, active state bold+underline
- 12.3 `<SectionTabs />` — horizontal tabs, active bottom border, mobile: horizontal scroll
- 12.4 Template 3A: Content + Staff Contact sidebar (70/30 split) — **page route fetches from Payload, passes to components as props**
- 12.5 Template 3B: Content + Section Nav sidebar — **page route fetches from Payload, passes to components as props**
- 12.6 Template 17: Simple content / empty state (jobs page)

## Epic 13: People & Organization (4 tasks)
- 13.1 `<MemberCard />` — 205x205 photo, name link, credentials, role label, dates
- 13.2 Template 4: People listing (members) — 2-column grid, section groups — **fetch from `board-members` collection**
- 13.3 `<AnchorNav />` — scroll-spy sidebar, "On this page", Intersection Observer
- 13.4 Template 14: Committee index/directory — anchor nav sidebar — **fetch from `committees` collection**

## Epic 14: Standards Section (6 tasks)
- 14.1 `<BoardLogoHero />` — board crest, name, brand-color bg
- 14.2 `<ActiveProjectsTable />` — 2-column table, mobile: stacked cards
- 14.3 `<FeatureCTABlock />` — 1-2 CTA cards, light/dark-purple variants
- 14.4 Template 5: Standards overview (tabbed) — hero + tabs + projects table + CTAs + news — **fetch from `standards` collection**
- 14.5 `<EffectiveDatesTable />` — purple section headers, alternating rows, footnotes, print-friendly
- 14.6 Template 10: Effective dates page — **fetch from `effective-dates` collection**

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

### Data Test IDs

Add `data-testid` attributes to key structural elements for automated self-testing:
- Page containers: `data-testid="page-<name>"`
- Sections: `data-testid="section-<name>"`
- Interactive elements: `data-testid="<element-name>"`
- Layout regions: `data-testid="sidebar-nav"`, `data-testid="main-content"`, `data-testid="right-rail"`

### Self-Test

After all tasks pass, run the automated self-test before outputting `<promise>`:

```bash
node scripts/self-test.mjs --epic epic-12-14
```

Config: `scripts/self-test-configs/epic-12-14.json`
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
