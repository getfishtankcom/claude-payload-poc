# Ralph Loop Prompt — Epics 17 + 20: Forms, Auth & Gap Pages

## Your Mission

Build forms (contact, login), auth (Aptify integration), ReCaptcha, and all gap pages (error pages, RSS, registration, forgot password/username, member-only forms, missing components).

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epics 17 and 20 tasks
3. `.ai-reports/BUILD_PLAN-phase2.md` — full task details
4. `.ai-reports/PRD-phase2.md` — form specs, auth architecture
5. `.ai-reports/dogfood-frascanada/notion-research-cross-reference.md` — Aptify auth details, member boolean

## Epic 17: Forms & Auth (8 tasks)
- 17.1 `<ContactForm />` — vertical stacked form, validation, server action
- 17.2 `<ReCaptcha />` — invisible v3, `react-google-recaptcha-v3`, server verification
- 17.3 `<MediaInquiriesBlock />` — heading + contact info
- 17.4 Template 15: Contact page — form + ReCaptcha + media inquiries — **page content text comes from CMS; form field labels are UI chrome — OK to hardcode**
- 17.5 `<LoginForm />` — username + password, forgot links, "Log in" button
- 17.6 `<AuthLayout />` — centered card wrapper (~480px)
- 17.7 `<SupportContactBlock />` + `<CpaExplanationBlock />`
- 17.8 Template 16: Auth page — login + register link + CPA explanation + support — **page content text comes from CMS; form field labels are UI chrome — OK to hardcode**
  - **Auth: Aptify DB API** (NOT NextAuth/OAuth)
  - Simple member boolean (True/False)
  - HTTP-only JWT cookie session
  - Rate limiting: 5 attempts per 15 min

## Epic 20: Gap Pages & Forms (10 tasks)
- 20.1 Annual Report page — T3B pattern
- 20.2 Error pages (404/500) — branded, with header/footer
- 20.3 RSS feed endpoint — `/api/rss` and `/api/rss/[board]`
- 20.4 Decision Summaries listing — reuse T13 pattern — **fetch from `decision-summaries` collection**
- 20.5 Registration form — AuthLayout, Aptify API account creation
- 20.6 Forgot Username — AuthLayout, Aptify recovery
- 20.7 Forgot Password — AuthLayout, Aptify reset
- 20.8 Member-Only Form Template — auth gate, 3 form variants (doc comment, event reg, volunteer)
- 20.9 `<EventSummaryTable />` — tabular meeting summary
- 20.10 `<MeetingTopicsTable />` — agenda topics table

## CMS Data Pattern (MANDATORY)

All page content MUST come from Payload CMS. Follow this pattern:

1. **Page route (server component):** Fetch data via typed helpers from `src/lib/payload-helpers.ts` or direct `payload.find()` / `payload.findGlobal()` calls
2. **Pass data as props:** Never fetch CMS data inside presentational components
3. **No hardcoded content:** Component props must NOT have default values for user-facing text. The only acceptable defaults are empty states ("No items found")
4. **Typed props:** Component interfaces must match Payload collection/global field shapes (use generated types from `payload-types.ts`)
5. **Empty states:** Handle missing CMS data with fallback UI (skeleton or "No data" message), NOT fallback text
6. **Canonical names:** Use `document-for-comment` (not consultations), `resources` (not documents), `events` (not meetings)
7. **Exception:** Form field labels, button labels like "Submit", and structural UI text ("Showing X of Y") are acceptable hardcoded strings — these are UI chrome, not CMS content

**Note for this epic:** Form field labels ("Name", "Email", "Password"), button text ("Log In", "Submit"), and validation messages are UI chrome — OK to hardcode. **Page content text** (headings, descriptions, support blocks) comes from CMS.

## IMPORTANT Auth Notes
- Auth is Aptify DB API, NOT OAuth/SSO
- Members are simple True/False boolean
- Member-only forms submit → email with attachments, NO database storage
- Aptify API calls happen in Next.js server actions

## Validation

```bash
npx tsc --noEmit
npm run dev
# /contact-us — form renders, validation works, ReCaptcha loads
# /my-account/login — login form renders, forgot links work
# /my-account/register — registration form
# /my-account/forgot-username — recovery form
# /my-account/forgot-my-password — reset form
# 404 page — visit /nonexistent, branded error page shows
# /api/rss — returns valid XML
```

## Stop Condition

When ALL tasks across Epics 17 and 20 are `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPICS 17 AND 20 COMPLETE</promise>
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
node scripts/self-test.mjs --epic epic-17-20
```

Config: `scripts/self-test-configs/epic-17-20.json`
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
