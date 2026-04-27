# Ralph Loop Prompt — Epic 27: Workbox + Advanced Workflow

## Your Mission

Build the Workbox — a dedicated workflow management dashboard modeled after Sitecore's Workbox. Includes inline approve/reject actions, rejection comments with banner display, scheduled publishing integration, publishing history timeline, and bulk workflow actions.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 27 tasks
3. `.ai-reports/PRD-admin-panel.md` — Section 8 (Workbox) + Section 7 (Workflow System)
4. `.ai-reports/research-sitecore-admin-interface.md` — Section 6.2 (Workbox)

## Dependencies

- Epic 22 (Admin Foundation) must be complete — workflow states, transitions, locking, and roles are prerequisites
- Workflow action bar (22.4) and scheduled publishing (22.7) are already built

## Tasks

### 27.1 Workbox view (`/admin/workbox`)
- Custom Payload admin view at route `/admin/workbox`
- Layout per PRD Section 8.1:
  - Tab bar: [All] [In Review (N)] [Needs Revision (N)] [Approved (N)] [Scheduled (N)]
  - Items list grouped by state, with count badges per tab
  - Each item row shows: title, content type icon, author, time since submission
  - Refresh button, Filters dropdown
- Fetch items via Payload REST API: `GET /api/pages?where[workflowState][equals]=in_review` (and similar for other states)
- Authors see only their own items; Editors/Admins see all items
- **Output:** Workbox renders with tabbed state groups, items listed

### 27.2 Inline workflow actions
- Each item row has action buttons based on state:
  - **In Review:** [Preview] [Approve] [Reject]
  - **Needs Revision:** [Open] [View History]
  - **Approved:** [Preview] [Publish Now] [Schedule]
  - **Scheduled:** [Preview] [Cancel Schedule] [Reschedule]
- Actions execute via Payload API (PATCH to update workflowState)
- Approve: transitions to `approved`, logs in workflowHistory
- Reject: opens comment modal (mandatory), transitions to `needs_revision`
- Publish Now: transitions to `published` immediately
- Schedule: opens date picker, sets `publishOn` field
- Actions update the list in-place (optimistic UI update)
- **Output:** All inline actions work without leaving workbox

### 27.3 Rejection comment modal + banner
- When clicking "Reject" — modal opens with:
  - Item title (read-only)
  - Comment textarea (required — can't submit empty)
  - [Reject] [Cancel] buttons
- Comment saved in `workflowHistory` entry
- When Author opens a "Needs Revision" item in the editor, show rejection banner (PRD Section 7.3):
  ```
  ! NEEDS REVISION
  Rejected by [Editor Name] on [Date]:
  "[Comment text]"
  [Dismiss]
  ```
- Banner pulls from latest `needs_revision` entry in workflowHistory
- Dismiss hides banner for current session (localStorage flag)
- **Output:** Rejection requires comment, banner shows on rejected items

### 27.4 Workflow history timeline
- "View History" button on workbox items opens a timeline panel
- Chronological list of all workflow transitions for the item:
  - State change arrow (Draft -> In Review)
  - User who performed the action
  - Timestamp (absolute + relative)
  - Comment (if any, e.g., rejection reason)
- Also accessible from the edit view (new "History" tab or section)
- Uses `workflowHistory` array from the item
- **Output:** Timeline shows full audit trail of state changes

### 27.5 Workbox filters + sorting
- Filter by: board (dropdown), content type (dropdown), author (dropdown), date range (date pickers)
- Sort by: date submitted (default, newest first), author name, content type
- Filters persist in URL query params (shareable filter URLs)
- Empty state: "No items in this state" with appropriate message
- **Output:** Filters narrow the list, sort changes order, URL reflects state

### 27.6 Bulk workflow actions
- Multi-select checkboxes on workbox items
- "Select All" checkbox in toolbar
- Bulk action buttons (appear when items selected):
  - **Bulk Approve** (only on In Review items)
  - **Bulk Publish** (only on Approved items)
  - **Bulk Reject** (opens single comment modal, applies same comment to all)
- Count indicator: "3 items selected"
- Confirmation dialog before bulk actions: "Approve 3 items?"
- **Output:** Multi-select works, bulk actions execute on all selected items

## Validation

```bash
npx tsc --noEmit  # TypeScript clean
npm run dev  # Workbox loads without errors
```

Per task:
- 27.1: Workbox at `/admin/workbox`, tabs show correct counts, items listed per state
- 27.2: Click "Approve" on In Review item — item moves to Approved tab, count updates
- 27.3: Click "Reject" — modal appears, empty comment blocked, comment saved in history, banner shows on item edit
- 27.4: Click "View History" — timeline shows all transitions with comments
- 27.5: Filter by board "AcSB" — only AcSB items shown, URL updates
- 27.6: Select 3 In Review items, click "Bulk Approve" — all 3 move to Approved

## Workflow

1. Read MASTER_TODO.md -> find first `[ ]` task in Epic 27
2. Mark `[~]`, build it, validate, mark `[x]`
3. When ALL tasks are `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPIC 27 COMPLETE</promise>
```

## IMPORTANT

- Workbox queries can be expensive on large datasets — use Payload's pagination (`limit`, `page` params)
- Inline actions should be optimistic (update UI immediately, rollback on API error)
- Rejection comment is MANDATORY — the modal's submit button should be disabled until comment has content
- Sidebar nav badge count (from Epic 22.1) should reflect the same counts as Workbox tabs
- All workflow transitions must go through the same Payload hooks defined in Epic 22.3 — don't bypass validation
- **Payload docs priority:** `payload-super` skill reference (`QUERIES.md` for filtering, `HOOKS.md` for hook reuse) > Context7 MCP > web search
- Author role filter: use `where[createdBy][equals]=currentUserId` for author-scoped queries

### Data Test IDs

Add `data-testid` attributes to key structural elements for automated self-testing:
- Page containers: `data-testid="page-<name>"`
- Sections: `data-testid="section-<name>"`
- Interactive elements: `data-testid="<element-name>"`
- Layout regions: `data-testid="sidebar-nav"`, `data-testid="main-content"`, `data-testid="right-rail"`

### Self-Test

After all tasks pass, run the automated self-test before outputting `<promise>`:

```bash
node scripts/self-test.mjs --epic epic-27
```

Config: `scripts/self-test-configs/epic-27.json`
Note: admin-only, desktop breakpoint only
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
