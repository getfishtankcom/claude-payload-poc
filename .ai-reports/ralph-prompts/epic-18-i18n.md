# Ralph Loop Prompt — Epic 18: Bilingual (i18n)

## Your Mission

Add full EN/FR bilingual support: Next.js locale routing, Payload CMS localization, language switcher, translation strings, hreflang metadata.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 18 tasks (18.1–18.5)
3. `.ai-reports/BUILD_PLAN-phase2.md` — Epic 18 task details
4. `.ai-reports/PRD.md` — Q2 bilingual strategy (RESOLVED)
5. `data/fr-slug-mapping.json` — FR URL slug translations

## What to Build

### 18.1 Configure Next.js i18n routing
- App Router `[locale]` segment: `app/[locale]/(frontend)/...`
- Middleware for locale detection and redirect
- Default locale: `en`

### 18.2 Add locale support to Payload CMS
- Enable `localization: { locales: ['en', 'fr'], defaultLocale: 'en' }` in payload.config.ts
- All text/richtext fields get locale support
- Admin panel locale switcher

### 18.3 Language switcher component
- Toggle between EN/FR preserving current page path
- Integrate with SiteHeader utility bar and MobileMenu
- Handle pages that exist in only one locale

### 18.4 FR translation strings
- `messages/en.json` and `messages/fr.json`
- All UI text: nav labels, buttons, form labels, error messages, empty states
- FR URL slug mappings from `data/fr-slug-mapping.json`

### 18.5 hreflang and locale metadata
- `<link rel="alternate" hreflang="en/fr">` on all pages
- `<html lang="...">` per locale
- Locale in OpenGraph/Twitter metadata
- Sitemap with hreflang entries

## Locale-Aware CMS Fetching (MANDATORY)

- **ALL `payload.find()` and `payload.findGlobal()` calls must include the `locale` parameter**
- Update `src/lib/payload-helpers.ts` to accept a `locale` param on every helper function
- Pattern: `getHomepage(locale: string)`, `getLatestNews(limit: number, locale: string)`, etc.
- The `locale` value comes from the `[locale]` route segment param
- Ensure generated types reflect locale-aware fields

## IMPORTANT
- This is an APPROVAL GATE epic — locale routing affects ALL pages
- Use `next-intl` or similar i18n library (check Context7 for Next.js 15 patterns)
- Don't translate CMS content — that's a content migration task
- Only translate UI strings (chrome, labels, buttons)

## Stop Condition

When ALL 5 tasks `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPIC 18 COMPLETE</promise>
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
node scripts/self-test.mjs --epic epic-18
```

Config: `scripts/self-test-configs/epic-18.json`
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
- Create FR locale variant stories for key user-facing components (e.g., Header, Footer, forms) to verify bilingual rendering

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
