# Ralph Loop Prompt — Layer 5: Polish

## Your Mission

The final layer before shipping. Run a full UI polish pass, complete architectural and security audits, and scope the plugin extraction. This layer produces no new features — it makes everything production-ready.

**Estimated tasks:** 3 (5.1–5.3)
**Stop condition:** `<promise>LAYER 5 COMPLETE</promise>`
**Gate required:** Yes — human review required after each task. This is the final gate before the admin platform is considered production-ready.

---

## Context Files (READ THESE FIRST, IN ORDER)

1. `CLAUDE.md` — project rules, security requirements, Payload skill priority
2. `SECURITY.md` — mandatory security requirements (read before task 5.2)
3. `.ai-reports/MASTER_TODO.md` — find the "Layer 5" section; read every task entry
4. `.ai-reports/PRD-admin-panel.md` — full spec to validate completeness against

---

## Skills to Invoke

- `/ui` — invoke before task 5.1 (UI polish pass)
- `accessibility` — invoke before task 5.1 (WCAG 2.2 AA audit)
- `core-web-vitals` — invoke before task 5.1 (performance metrics)
- `security-audit-orchestrator` — invoke before task 5.2 (comprehensive security audit)
- `dogfood` — invoke before task 5.1 (systematic browser-based exploration and testing)
- `improve-codebase-architecture` — invoke before task 5.3 (plugin extraction scoping)

---

## Key Context

### What "Polish" Means Here
Layer 5 polish is NOT cosmetic tweaks. It means:
1. Every admin view is accessible (WCAG 2.2 AA)
2. Every admin view performs well (no blocking renders, no memory leaks)
3. The codebase is secure (no leaked secrets, no SSRF vectors, proper access control)
4. The architecture is clean enough to extract into a reusable plugin

### Production Criteria
The admin platform is production-ready when:
- `npx axe-cli http://localhost:3000/admin` exits with zero critical/serious violations
- `npm run build` exits 0 with no warnings about bundle size thresholds
- Security audit produces no High or Critical findings
- `npx tsc --noEmit` is clean
- All Playwright E2E tests pass

---

## Tasks

### 5.1 UI.sh Full Pass
**What:** A systematic review of every admin view for visual quality, accessibility, and performance. Fix issues found. Document findings.

**Scope — every admin view must be reviewed:**
- `/admin` (Dashboard)
- `/admin/tree` (Content Tree)
- `/admin/workbox` (Workbox)
- `/admin/media` (Media Library)
- `/admin/builder/:id` (Page Builder)
- `/admin/schedule` (Publishing Schedule)
- `/admin/redirects` (Redirect Manager)
- `/admin/translation-audit` (Translation Audit)
- `/admin/labels` (Labels Manager)
- `/cms/dashboard` + all /cms routes

**Accessibility checklist (WCAG 2.2 AA) for each view:**
- [ ] All interactive elements are keyboard navigable (Tab order is logical)
- [ ] All interactive elements have visible focus indicators (not just outline: none)
- [ ] All images have alt text (or `aria-hidden="true"` if decorative)
- [ ] Color contrast ≥ 4.5:1 for text (3:1 for large text)
- [ ] Modals trap focus correctly (keyboard cannot escape the modal)
- [ ] All modals dismiss on Escape key press
- [ ] Status messages use `aria-live` regions (loading states, success messages, errors)
- [ ] Form fields have associated `<label>` elements or `aria-label`
- [ ] Error messages are programmatically associated with their fields (`aria-describedby`)
- [ ] Tree nodes are navigable with arrow keys (up/down to move focus, right to expand, left to collapse)
- [ ] Drag-and-drop operations have a keyboard alternative
- [ ] Toast notifications use `role="alert"` or `aria-live="polite"`

**Performance checklist for each view:**
- [ ] No useEffect that runs on every render without proper dependency array
- [ ] Lists with 20+ items use virtualization or pagination (no DOM with 500+ nodes)
- [ ] Images use `next/image` (not `<img>`)
- [ ] No synchronous operations blocking the main thread in event handlers
- [ ] TanStack Query results are cached (no re-fetching on every navigation)
- [ ] No memory leaks: all subscriptions, intervals, and event listeners cleaned up in useEffect cleanup

**Visual quality checklist:**
- [ ] Consistent spacing (no elements butting up against each other without padding)
- [ ] Consistent border-radius (matches design tokens)
- [ ] Loading states: every async operation shows a skeleton or spinner
- [ ] Empty states: every list/table has a designed empty state (not blank)
- [ ] Error states: every async operation has an error display with a retry option
- [ ] Responsive: all views function at 1024px width (tablet landscape)
- [ ] No horizontal scrolling at any admin viewport width

**How to run this task:**
1. Invoke the `dogfood` skill to systematically browse each view
2. Invoke the `accessibility` skill to run automated axe audit
3. For each issue found: create a fix, verify it resolves the issue
4. Document all findings + fixes in a new file: `.ai-reports/layer-5-ui-audit-{date}.md`
   - Format: View name → Issue found → Fix applied → Verification

**Automation:**
```bash
# Run axe against all admin views (requires dev server running)
npx axe-cli http://localhost:3000/admin --disable color-contrast
npx axe-cli http://localhost:3000/admin/tree --disable color-contrast
npx axe-cli http://localhost:3000/admin/workbox --disable color-contrast
# Repeat for all views...

# Run Playwright accessibility snapshot
npx playwright test --grep "a11y"
```

**Output:**
- Zero critical/serious axe violations across all admin views
- Audit report at `.ai-reports/layer-5-ui-audit-{date}.md`
- All identified issues fixed and committed

**Gate:** After this task, output the audit report summary and await human review before proceeding to 5.2.

---

### 5.2 Final Audits (Architecture + Security)
**What:** Run two systematic audits — architecture quality and security — and fix any findings.

#### Architecture Audit

**What to audit:**
1. **No N+1 queries:** Every list/tree fetch must use a single query + in-memory processing — not one query per item
2. **No duplicate type definitions:** All shared types should come from `src/types/admin.ts` (established in Layer 0)
3. **No circular dependencies:** Run `npx madge --circular src/` — zero circular imports
4. **Consistent error handling:** All async operations have try/catch; errors surface to the user (not silently swallowed)
5. **Bundle size:** Run `npm run build` and check the build output — no single admin chunk >500KB (gzip). If violated, identify large dependencies and apply code splitting.
6. **Dead imports:** Run `npx ts-prune` or `npx knip` — identify and remove unused exports
7. **Consistent file naming:** All component files PascalCase, all hook files `use*.ts`, all lib files camelCase

**Tools:**
```bash
npx madge --circular src/    # Check for circular deps
npx tsc --noEmit              # TypeScript clean
npm run build                 # Check bundle sizes
npx knip                      # Unused exports (if installed)
```

#### Security Audit

**Invoke the `security-audit-orchestrator` skill before starting this section.**

**What to audit (aligned with SECURITY.md):**

1. **Secrets:**
   - No `.env` values in committed code
   - No API keys, tokens, or passwords in `src/`
   - All environment variables accessed via `process.env` with proper `NEXT_PUBLIC_` prefix for client-side vars
   - Run: `grep -r "api_key\|apiKey\|secret\|password\|token" src/ --include="*.ts" --include="*.tsx"` — review any hits

2. **Access Control:**
   - All custom admin API routes check auth: `const user = await req.user` → reject if null
   - All Payload collection operations that modify data use `overrideAccess: false`
   - No collection has `access: { read: () => true, create: () => true }` without understanding why
   - The `Notifications` collection restricts read to: recipient === currentUser OR admin role

3. **Input Validation:**
   - All custom endpoints validate their inputs (types, required fields, max lengths)
   - The CSV import for redirects + labels validates row format before writing to DB
   - The workflow transition hook validates the `from → to` pair before accepting

4. **SSRF Prevention:**
   - The page builder canvas iframe only loads the site's own frontend (not arbitrary URLs)
   - Any endpoint that fetches an external URL (e.g., HubSpot API proxy) validates the URL against an allowlist

5. **Rate Limiting:**
   - Login endpoint rate limited (Payload handles this OOTB — verify it's not disabled)
   - The command palette search endpoint rate limited (max 20 requests/10s per IP)

6. **Redirect Safety:**
   - The `redirects` collection's `to` field must validate that the URL is either relative (`/path`) or on the allowed domain — prevent open redirect attacks

**Output:**
- Security findings document at `.ai-reports/layer-5-security-audit-{date}.md`
  - Format: Finding ID → Severity (Critical/High/Medium/Low/Info) → Description → Fix Applied
- Zero Critical or High severity findings unresolved
- Architecture circular deps: zero
- TypeScript: clean

**Gate:** After this task, output the security audit summary and await human review before proceeding to 5.3.

---

### 5.3 Plugin Extraction Scoping
**What:** Research and document a plan for extracting the custom admin panel into a reusable Payload CMS plugin (`payload-plugin-ras-admin` or similar). This task produces a scoping document — no code changes.

**Why this matters:** The RAS Canada admin panel (Content Tree, Workbox, Page Builder, Media Library, etc.) is valuable to other Payload CMS users. Packaging it as a plugin lets Fishtank reuse it across future projects and potentially open-source it.

**Scoping questions to answer:**

1. **What can be extracted?**
   - List each admin view/feature and classify it as: Extractable (no RAS-specific logic) / Partially Extractable (RAS-specific config but generic core) / Not Extractable (too RAS-specific)
   - Expected extractable: ContentTree, Workbox, MediaLibrary, CommandPalette, NotificationCenter, Favorites, PublishingSchedule, VersionComparison
   - Expected partially extractable: PageBuilder (component registry is RAS-specific, but the builder shell is generic), Dashboard (widgets are configurable)
   - Expected not extractable: TranslationAudit (RAS-specific FR/EN logic), Labels manager (RAS-specific label keys), Redirects manager (RAS-specific)

2. **What are the configuration points?**
   - What config would an adopter need to provide? (e.g., workflow states, collections to include in tree, component registry, branding)
   - Design a `PluginConfig` TypeScript interface

3. **What are the dependencies?**
   - List all npm packages the plugin would depend on
   - Identify any packages that need to be `peerDependencies` vs `dependencies`

4. **What's the Payload plugin structure?**
   - How does the plugin register custom views, components, and globals? (Consult `~/.claude/skills/payload-super/reference/PLUGIN-DEVELOPMENT.md`)
   - Draft the plugin's `index.ts` entry point structure

5. **What's the extraction effort?**
   - Estimate: Small (1-3 days), Medium (1 week), Large (2+ weeks) per feature
   - Total estimate for MVP plugin extraction

**Output:**
- Create `.ai-reports/plugin-extraction-scope.md` with:
  - Feature inventory table (Extractable / Partially / Not)
  - `PluginConfig` interface (TypeScript pseudocode)
  - Dependency list
  - Plugin entry point structure sketch
  - Effort estimate table
  - Recommended MVP scope (which features to extract first)
- No code changes in this task — documentation only

---

## Validation Gates (Layer 5 is complete when ALL of these pass)

```bash
# TypeScript clean
npx tsc --noEmit

# Production build (no errors, no large bundle warnings)
npm run build

# Zero critical/serious accessibility violations
npx axe-cli http://localhost:3000/admin --exit
npx axe-cli http://localhost:3000/admin/workbox --exit
npx axe-cli http://localhost:3000/admin/tree --exit

# Zero circular dependencies
npx madge --circular src/ --exit-code

# All tests passing
npx vitest run
npx playwright test

# Storybook builds
npx storybook build --quiet

# Audit documents exist
test -f .ai-reports/layer-5-ui-audit-*.md && echo "EXISTS"
test -f .ai-reports/layer-5-security-audit-*.md && echo "EXISTS"
test -f .ai-reports/plugin-extraction-scope.md && echo "EXISTS"
```

---

## Gate Points

This layer has 3 gates — one after each task:

**After 5.1:** Output the UI audit summary (view count, issues found, issues fixed, open items). Await human review before proceeding to 5.2.

**After 5.2:** Output the security audit summary (findings by severity, all Critical/High resolved). Await human review before proceeding to 5.3.

**After 5.3:** Output the plugin extraction scope summary. Then output the layer stop condition.

---

## Workflow

1. Read MASTER_TODO.md → find the "Layer 5" section → read all task entries
2. If Layer 5 section doesn't exist yet, ADD IT with tasks 5.1–5.3 as `[ ]` items
3. Work through tasks IN ORDER — do NOT skip ahead
4. After each task: mark `[x]`, commit, output gate message, STOP until approved

---

## Stop Condition

When ALL 3 tasks are `[x]` AND all validation gates pass:

1. Update `.ai-reports/AUDIT_LOG.md` (date, Type: BUILD, Layer 5, tasks, files, deviations)
2. Create summary commit: `feat(layer-5): polish — all tasks complete`
3. Output EXACTLY:
```
<promise>LAYER 5 COMPLETE</promise>
```

---

## EXIT PROTOCOL (MANDATORY)

### Per-Task Completion
A task is DONE when ALL of these pass:
1. Audit document created (5.1, 5.2) or scope document created (5.3)
2. All found issues resolved (5.1, 5.2) or documented with effort estimates (5.3)
3. Validation commands for the task pass
4. `npx tsc --noEmit` passes
5. Task updated to `[x]` in MASTER_TODO.md
6. Git commit created: `feat(layer-5): task 5.N — [short description]`

### Per-Task Failure (3-strike rule)
1. First attempt: diagnose, fix, re-validate
2. Second attempt: alternative approach, re-validate
3. Third attempt: mark `[!]` with note — for audit tasks, mark the finding as "unresolved" with explanation and continue

### HARD STOPS
Output `<promise>LAYER 5 ABORTED: [reason]</promise>` if:
- Dev server won't start after 3 fix attempts
- Security audit reveals a Critical finding that requires architectural changes beyond this scope
- More than 5 structural TypeScript errors introduced during fixes

### What NOT To Do
- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT skip the gate outputs after each task
- Do NOT mark security findings as "low priority" to avoid fixing them — all Critical/High must be resolved
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push`
