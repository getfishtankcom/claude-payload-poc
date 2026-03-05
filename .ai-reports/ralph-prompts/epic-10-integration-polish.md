# Ralph Loop Prompt — Epic 10: Integration & Polish

## Your Mission

CMS data wiring was completed in Epic 5. This epic focuses on seeding real content, verifying CMS-driven rendering, running responsive/accessibility/performance testing, setting up SEO, and integrating HubSpot newsletter. This is the Phase 1 capstone.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 10 tasks
3. `.ai-reports/BUILD_PLAN.md` — Epic 10 task details (10.1–10.5 + 10.1.1)
4. `.ai-reports/PRD.md` — Section 9 (Non-Functional Requirements), Section 10 (Integrations)

## What to Build

### 10.1 Seed CMS with sample data
- Create seed script: `src/seed/index.ts`
- **After seeding, verify ALL pages render real CMS data (not hardcoded text). Visit homepage and confirm hero heading matches `homepage` global. Visit `/boards/acsb` and confirm nav/footer content comes from globals.**
- 4 boards (AcSB, PSAB, AASB, CSSB) + RASOC
- 11 standards mapped to boards
- 8+ projects with timeline data
- 4 consultations with deadlines
- 10+ news items across categories
- 5+ events (webinars, meetings, deadlines)
- Configure navigation + footer globals
- Run via `npx payload seed` or custom script

### 10.1.1 Integrate HubSpot newsletter
- Wire `<NewsletterCTA />` submit to HubSpot Forms API
- `HUBSPOT_PORTAL_ID` and `HUBSPOT_FORM_ID` in `.env.example`
- Server action: POST to `https://api.hsforms.com/submissions/v3/integration/submit/{portalId}/{formId}`
- Success/error states in UI

### 10.2 Responsive testing
- Test all pages at 390px, 768px, 1024px, 1440px
- Verify mobile adaptations: sidebar→dropdown, grid→stack, filter→accordion

### 10.3 Accessibility audit
- WCAG 2.1 AA compliance
- Keyboard nav for mega-menu, search modal, mobile menu
- Screen reader testing
- Color contrast for all badge types

### 10.4 Performance optimization
- Core Web Vitals targets
- next/image optimization
- Server/client component split
- Bundle analysis

### 10.5 SEO setup
- Metadata for all pages
- Structured data: Organization, BreadcrumbList
- Sitemap generation
- robots.txt

## Validation

```bash
# Seed data exists
npm run seed  # or equivalent
# Visit /admin — all collections have entries
# Visit all pages — content renders

# SEO
curl -s http://localhost:3000/sitemap.xml | head
curl -s http://localhost:3000/robots.txt

npx tsc --noEmit
npx storybook build --quiet  # Storybook compiles without errors
```

## Workflow

When ALL Epic 10 tasks `[x]`: update AUDIT_LOG.md, output:

```
<promise>EPIC 10 COMPLETE — PHASE 1 DONE</promise>
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
node scripts/self-test.mjs --epic epic-10
```

Config: `scripts/self-test-configs/epic-10.json`
Note: a11y checks enabled
See exit protocol for handling failures vs warnings.

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
