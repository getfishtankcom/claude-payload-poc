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
- Author role filter: use `where[createdBy][equals]=currentUserId` for author-scoped queries
