# Ralph Loop Prompt — Layer 3: Admin Medium Lifts

## Your Mission

Build 5 medium-complexity admin features: a full publishing schedule view, a language version audit tool, a version comparison viewer, a notification center, and a dictionary/labels manager. These features require more design and architectural thought than Layer 2 — each touches multiple existing systems.

**Estimated tasks:** 5 (3.1–3.5)
**Stop condition:** `<promise>LAYER 3 COMPLETE</promise>`
**Gate required:** No

---

## Context Files (READ THESE FIRST, IN ORDER)

1. `CLAUDE.md` — project rules, Payload skill priority, Ralph loop workflow
2. `.ai-reports/MASTER_TODO.md` — find the "Layer 3" section; read every task entry
3. `.ai-reports/PRD-admin-panel.md` — Sections 3.2 (Publishing Schedule widget), 5.2 (Language Behavior), 7 (Workflow System), 7.4 (Workflow History)
4. `src/admin/views/WorkboxClient.tsx` — existing workflow implementation
5. `src/admin/components/WorkflowActionBar.tsx` — existing workflow action bar

---

## Skills to Invoke

- `payload-super` — before tasks 3.1, 3.2, 3.3 (Payload versions/drafts API for comparison)
- `/ui` — for component design questions
- `accessibility` — before 3.4 (notification center focus management)
- `e2e-testing-patterns` — before writing Playwright tests

---

## Key Context

### Payload Versions API
The version comparison feature (3.3) requires Payload's versions API:
- `GET /api/{collection}/{id}/versions` — list all versions
- `GET /api/{collection}/versions/{versionId}` — get a specific version
- Consult `~/.claude/skills/payload-super/reference/COLLECTIONS.md` for draft/version patterns

### Diff Libraries
Task 3.3 requires two diff approaches:
- **Text fields** (`@pierre/diffs` or `diff-match-patch`): character-level diff with green=added, red=removed highlighting
- **Lexical rich text:** Lexical JSON structures can't be diffed as strings. Extract plain text from Lexical JSON (walk the AST), then diff the extracted text. Do NOT try to diff raw Lexical JSON — it produces noise.

### Localization Query Pattern
To find items missing FR translations (task 3.2):
```typescript
// Fetch with EN locale (base)
const enItems = await payload.find({ collection: 'news', locale: 'en' })
// Fetch same items with FR locale
const frItems = await payload.find({ collection: 'news', locale: 'fr' })
// Compare: items where FR title is null/empty = missing translation
```

---

## Tasks

### 3.1 Publishing schedule full view
**What:** Expand the Dashboard's publishing schedule widget into a full-page calendar/list view showing all scheduled content.

**Spec:**
- Route: `/admin/schedule` — custom Payload admin view
- Two view modes toggled by a button in the toolbar:
  - **List view** (default): grouped by day, each item shows title, type icon, scheduled time, author, board. "Publish Now" + "Reschedule" + "Cancel" actions per item.
  - **Calendar view**: monthly calendar grid. Days with scheduled items show a count badge. Clicking a day expands to show items scheduled that day.
- Items shown: all items where `workflowState === 'approved'` AND `publishOn` is set (future or past-due)
- Past-due items (publishOn has passed but still showing approved state — not yet auto-published) highlighted in red with "Overdue" badge
- Filtering:
  - By board (dropdown — same as Workbox board filter)
  - By content type (dropdown)
  - By date range (date pickers)
- "Schedule New" button links to Workbox (where items can be scheduled from the Approved tab)
- Add "Scheduling" link to admin sidebar under Tools section
- `data-testid="schedule-view"`, `data-testid="schedule-list"`, `data-testid="schedule-calendar"`, `data-testid="overdue-badge"`

**Files to create:**
- `src/admin/views/ScheduleView.tsx` + `src/admin/views/ScheduleViewClient.tsx`
- `src/admin/components/ScheduleCalendar.tsx`
- `src/admin/components/ScheduleList.tsx`
- Register in `payload.config.ts` admin views

**Storybook stories:** `ScheduleList.stories.tsx` — Empty + WithItems + WithOverdue; `ScheduleCalendar.stories.tsx` — Default + WithEvents

**Playwright E2E:**
- Navigate to `/admin/schedule` → list view renders
- Toggle to calendar view → calendar grid renders
- Overdue item shows red highlight

---

### 3.2 Language version audit
**What:** A dashboard view showing all content items that are missing French translations, so editors can prioritize translation work.

**Spec:**
- Route: `/admin/translation-audit` — custom Payload admin view
- Scanned collections: pages, news, projects, events, boards (all collections that have localized fields)
- For each collection, the audit shows:
  - Total items
  - Items with FR translation (FR title is non-null)
  - Items missing FR translation (FR title is null or empty)
  - % complete
- Main content area: a table of items missing FR translation:
  - Columns: Title (EN), Collection, Board, Last Modified, Actions
  - Actions per row: "Translate Now" (opens item with `?locale=fr`), "Skip" (hides from audit until item changes)
  - Sortable columns: Last Modified (default desc), Title, Collection
  - Filtered by collection (dropdown) + board (dropdown)
- Progress bar at the top per collection (like a completion bar: "News: 78% translated")
- "Refresh" button re-runs the audit (can be slow on large datasets — show loading state)
- Add "Translation Audit" link to admin sidebar under Tools
- `data-testid="translation-audit"`, `data-testid="audit-progress-{collection}"`, `data-testid="translate-now"`

**Files to create:**
- `src/admin/views/TranslationAudit.tsx` + `src/admin/views/TranslationAuditClient.tsx`
- `src/admin/hooks/useTranslationAudit.ts` — fetches and computes translation coverage
- Register in `payload.config.ts` admin views

**Implementation note:** Fetching FR translation status for all items can be slow. Use batched parallel fetches: `Promise.all` across collections, then compare EN vs FR results. Cache the result in state (don't re-fetch on every render).

**Storybook stories:** `TranslationAudit.stories.tsx` — Loading + AllTranslated + MissingItems + Error

**Playwright E2E:**
- Navigate to `/admin/translation-audit` → progress bars render for each collection
- Click "Translate Now" on an item → navigates to item edit view with `?locale=fr`

---

### 3.3 Version comparison viewer
**What:** Let editors compare any two versions of a content item side-by-side, with diffs highlighted for all changed fields.

**Spec:**
- Triggered from the existing item edit view — add a "Compare Versions" button in the action bar / history section
- Opens a full-width panel (or modal) with:
  - Left selector: "Compare version" dropdown (list of past versions with date + author)
  - Right: always shows the current version
  - For each localized/text field: side-by-side display with character-level diff highlighting (green=added, red=removed, gray=unchanged)
  - For Lexical rich text fields: extract plain text from the Lexical JSON AST, then diff the extracted text. Show the diff in a read-only text area. Add a note: "Rich text diff shows text content only."
  - For EN/FR localized fields: show EN diff and FR diff in separate sub-tabs within the same comparison
  - Fields with no changes are collapsed by default with a "No changes" label, expandable
  - Navigation: "Previous change ↑" / "Next change ↓" keyboard shortcuts to jump between diffs
- If the item has only one version (no history), show "No previous versions to compare"
- `data-testid="version-compare"`, `data-testid="version-selector"`, `data-testid="diff-field-{fieldName}"`

**Libraries to install:**
```bash
npm install diff-match-patch
npm install --save-dev @types/diff-match-patch
```

**Implementation notes:**
- Use `diff-match-patch` for character-level diff computation
- To extract plain text from Lexical JSON: walk `root.children` recursively, collect `text` node values
- The version list comes from `GET /api/{collection}/{id}/versions?limit=20`
- The version data comes from `GET /api/{collection}/versions/{versionId}`
- See `~/.claude/skills/payload-super/reference/COLLECTIONS.md` for the versions API shape

**Files to create:**
- `src/admin/components/VersionComparison.tsx` — main comparison panel
- `src/admin/components/FieldDiff.tsx` — single-field diff display
- `src/admin/hooks/useVersions.ts` — version list + version fetch
- `src/lib/lexical-text-extractor.ts` — utility to extract plain text from Lexical JSON

**Storybook stories:**
- `VersionComparison.stories.tsx` — WithChanges (text fields modified) + RichTextChanges + NoChanges + NoHistory
- `FieldDiff.stories.tsx` — TextAdded + TextRemoved + TextModified + NoChange

**Playwright E2E:**
- Open an item that has versions → click "Compare Versions" → comparison panel opens
- Select an older version → field diffs appear
- Press N → jumps to next changed field

---

### 3.4 Notification center
**What:** A bell-icon notification center in the admin header showing workflow events relevant to the current user.

**Spec:**
- Bell icon (🔔) in the top admin header bar, right side, next to the user avatar
- Unread count badge on the bell (red dot with number, max "9+")
- Clicking the bell opens a dropdown panel (~360px wide, max 480px tall, scrollable)
- Notifications are generated by workflow transitions:
  - Author submitted for review → notify all Editors and Admins: "New item for review: {title}"
  - Editor approved → notify the Author: "Your item was approved: {title}"
  - Editor rejected → notify the Author: "Your item needs revision: {title}"
  - Item published → notify the Author: "Your item is now live: {title}"
  - Item overdue (scheduledPublishOn has passed, still approved) → notify Editors and Admins: "Overdue: {title} was scheduled for {date}"
- Per notification: item title, event type icon (colored per workflow state), time ago, action link (opens item)
- Mark individual notifications as read on click
- "Mark all as read" button at top of panel
- Notifications older than 30 days are auto-purged
- Store notifications in a `notifications` Payload collection (not localStorage — needs to be server-side for multi-device/team visibility):
  ```typescript
  {
    recipient: { type: 'relationship', relationTo: 'users', required: true },
    message: { type: 'text', required: true },
    itemTitle: { type: 'text' },
    itemUrl: { type: 'text' },
    eventType: { type: 'select', options: ['submitted', 'approved', 'rejected', 'published', 'overdue'] },
    read: { type: 'checkbox', default: false },
    createdAt: { type: 'date', auto: true },
  }
  ```
- Hook notifications into workflow afterChange hooks (created alongside the existing workflow transition logic)
- Badge count refreshes every 60 seconds (polling — simple `setInterval`, not websocket)
- WCAG 2.2 AA: dropdown is accessible (focus trapping, Escape to close, aria-live for count updates)
- `data-testid="notification-bell"`, `data-testid="notification-badge"`, `data-testid="notification-panel"`, `data-testid="notification-item"`

**Files to create:**
- `src/collections/Notifications.ts` — Payload collection
- `src/admin/components/NotificationBell.tsx` — bell icon + badge + dropdown panel
- `src/admin/components/NotificationPanel.tsx` — the dropdown panel itself
- `src/admin/hooks/useNotifications.ts` — fetch, poll, mark-read
- Wire into admin header (`src/admin/components/CustomNav.tsx` or the Payload header component override)
- Register `Notifications` collection in `payload.config.ts`

**Storybook stories:**
- `NotificationBell.stories.tsx` — Unread (3) + Unread (10+ shows "9+") + AllRead + Loading
- `NotificationPanel.stories.tsx` — WithNotifications + Empty + MixedReadUnread

**Playwright E2E:**
- Trigger a workflow transition → notification appears in bell
- Click bell → panel opens with notification
- Click notification → navigates to item; notification marked read
- Badge count decrements after marking all read

---

### 3.5 Dictionary / labels manager
**What:** A UI for managing the EN/FR display labels used across the site (navigation labels, badge labels, button text, etc.) so editors can update them without a code deployment.

**Spec:**
- A `site-labels` Payload Global (or collection) with key-value pairs for translatable UI strings
- Schema approach:
  ```typescript
  // Option A: Global with array field (simpler but less flexible)
  {
    labels: {
      type: 'array',
      fields: {
        key: { type: 'text', required: true, unique: true, label: 'Key (camelCase, e.g. navHome)' },
        en: { type: 'text', required: true, label: 'English label' },
        fr: { type: 'text', required: true, label: 'French label' },
        context: { type: 'text', label: 'Where this label is used (for reference)' },
      }
    }
  }
  ```
  Use Option A (Global with array). Label keys are defined by developers; values are edited by content admins.

- Route: `/admin/labels` — custom Payload admin view providing a better UX than the raw Global edit view
- The custom view shows labels in a table: Key | English | French | Context | Edit button
- Searchable by key or label value
- Click Edit on a row → inline edit (or expand row to show inputs) with Save/Cancel
- "Export CSV" button exports all labels as `key,en,fr` CSV
- "Import CSV" button to bulk-update labels (same format; updates existing keys, ignores unknown keys)
- Seed the initial labels with commonly-used site strings (navigation, badges, form labels):
  ```
  key: navHome | en: Home | fr: Accueil
  key: navAbout | en: About Us | fr: À propos
  key: navProjects | en: Active Projects | fr: Projets actifs
  key: navConsultations | en: Open Consultations | fr: Consultations ouvertes
  key: navNews | en: News | fr: Nouvelles
  key: badgeExposureDraft | en: Exposure Draft | fr: Exposé-sondage
  key: badgePublicComment | en: Public Comment | fr: Commentaires publics
  key: badgeWebinar | en: Webinar | fr: Webinaire
  key: footerCopyright | en: © 2026 Reporting and Assurance Standards Canada | fr: © 2026 Normes d'information financière et de certification Canada
  ```
  Add any other obvious navigation/UI labels from the existing codebase.

- Add "Labels" link to admin sidebar under Tools
- Add a `useLabels()` hook in `src/lib/use-labels.ts` that frontend components can use to fetch a label by key with locale support: `useLabels('navHome', 'fr')` → `"Accueil"`
- `data-testid="labels-view"`, `data-testid="labels-table"`, `data-testid="label-edit-{key}"`, `data-testid="export-csv"`, `data-testid="import-csv"`

**Files to create:**
- `src/globals/SiteLabels.ts` — Payload Global definition
- `src/admin/views/LabelsView.tsx` + `src/admin/views/LabelsViewClient.tsx`
- `src/lib/use-labels.ts` — frontend hook
- Seed: `src/seed/seed-labels.ts`
- Register Global in `payload.config.ts`

**Storybook stories:** `LabelsView.stories.tsx` — WithLabels + EditingRow + SearchFiltered + Empty

**Playwright E2E:**
- Navigate to `/admin/labels` → table renders with seeded labels
- Search "nav" → table filters to nav* keys
- Click Edit on "navHome" → inline edit shows; change English value, Save → value updates

---

## Validation Gates (Layer 3 is complete when ALL of these pass)

```bash
# TypeScript clean
npx tsc --noEmit

# Production build
npm run build

# Tests passing
npx vitest run

# Storybook builds
npx storybook build --quiet

# E2E tests
npx playwright test --grep "schedule|translation-audit|version-compare|notification|labels"
```

---

## Workflow

1. Read MASTER_TODO.md → find the "Layer 3" section → read all task entries
2. If Layer 3 section doesn't exist yet, ADD IT with tasks 3.1–3.5 as `[ ]` items
3. Work through tasks sequentially (tasks have some shared context but are otherwise independent)
4. Each task: mark `[~]`, build, validate, `[x]`, commit

---

## Stop Condition

When ALL 5 tasks are `[x]` AND all validation gates pass:

1. Update `.ai-reports/AUDIT_LOG.md` (date, Type: BUILD, Layer 3, tasks, files, deviations)
2. Create summary commit: `feat(layer-3): admin medium lifts — all tasks complete`
3. Output EXACTLY:
```
<promise>LAYER 3 COMPLETE</promise>
```

---

## EXIT PROTOCOL (MANDATORY)

### Per-Task Completion
A task is DONE when ALL of these pass:
1. Feature works end-to-end in browser
2. Unit tests pass (`npx vitest run`)
3. Storybook story compiles
4. Playwright E2E passes
5. `npx tsc --noEmit` passes
6. Task updated to `[x]` in MASTER_TODO.md
7. Git commit created: `feat(layer-3): task 3.N — [short description]`

### Per-Task Failure (3-strike rule)
1. First attempt: diagnose, fix, re-validate
2. Second attempt: alternative approach, re-validate
3. Third attempt: mark `[!]` with reason, next task

### HARD STOPS
Output `<promise>LAYER 3 ABORTED: [reason]</promise>` if:
- Dev server won't start after 3 fix attempts
- Unresolvable dependency conflict
- More than 5 structural TypeScript errors
- Playwright environment broken after 3 fix attempts

### What NOT To Do
- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT skip Playwright E2E — each feature requires one
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push`
