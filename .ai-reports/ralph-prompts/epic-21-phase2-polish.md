# Ralph Loop Prompt — Epic 21: Phase 2 Integration & Polish

## Your Mission

Final polish for Phase 2: seed all Phase 2 CMS data, responsive testing, accessibility audit, performance optimization, SEO, and end-to-end integration testing.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 21 tasks (21.1–21.6)
3. `.ai-reports/BUILD_PLAN-phase2.md` — Epic 21 task details

## What to Build

- 21.1 Seed Phase 2 CMS data (20+ members, 25+ committees, 30+ resources, effective dates, documents, meetings, jobs, auth config)
- 21.2 Phase 2 responsive testing (all templates at 4 breakpoints)
- 21.3 Phase 2 accessibility audit (WCAG 2.1 AA, keyboard nav, screen reader, ReCaptcha alt)
- 21.4 Performance optimization (Core Web Vitals, member photos, server/client split, large lists)
- 21.5 Phase 2 SEO (metadata, structured data, sitemap update, hreflang)
- 21.6 E2E integration testing (contact form, login, document comment flow, bilingual nav, search, registration/recovery)

## Stop Condition

When ALL 6 tasks `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPIC 21 COMPLETE — PHASE 2 DONE</promise>
```

## Validation

```bash
npx tsc --noEmit
npx storybook build --quiet  # Storybook compiles without errors
npm run build
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
node scripts/self-test.mjs --epic epic-21
```

Config: `scripts/self-test-configs/epic-21.json`
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
