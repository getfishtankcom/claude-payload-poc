# Ralph Loop Prompt — Epic 22: Admin Panel Foundation

## Your Mission

Build the custom admin panel foundation: dashboard, sidebar navigation, workflow system (5-state), item locking, language switcher, and workflow action bar. These extend Payload CMS's built-in admin panel with custom views and components.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 22 tasks
3. `.ai-reports/PRD-admin-panel.md` — full admin panel PRD (Sections 3, 5, 7, 10)
4. `.ai-reports/research-sitecore-admin-interface.md` — Sitecore reference
5. `.ai-reports/BUILD_PLAN.md` — existing data model context

## Key Decisions (from PRD Section 14)

- **Architecture:** Extend Payload admin with custom views (NOT standalone app)
- **Roles:** 3 roles — Author, Editor, Admin (use Payload's RBAC)
- **Workflow:** 5-state — Draft, In Review, Needs Revision, Approved, Published (+ Unpublished)
- **Locking:** Auto-lock on edit, 30min auto-unlock, Admin force-unlock
- **Conflicts:** Last write wins with warning banner
- **Audit:** Version diffs only (Payload OOTB), workflow transitions logged explicitly
- **Language:** Sitecore-style switcher (one language at a time, NOT side-by-side)

## Tasks

### 22.1 Custom sidebar navigation
- Override Payload's default admin nav with custom sidebar (PRD Section 10.1)
- Sections: Dashboard, Content Tree, Workbox (with badge count), Collections, Tools, System
- Admin-only links hidden for Author/Editor roles
- Collapsible to icons on smaller screens
- Use Payload's `admin.components.Nav` override
- **Output:** Custom nav renders on all admin pages

### 22.2 Custom dashboard (`/admin`)
- Replace Payload's default dashboard (PRD Section 3)
- 4 widgets in 2x2 grid:
  - **Workflow Queue** — items grouped by state (In Review, Needs Revision, Approved). Authors see own items; Editors/Admins see all. Click to open item.
  - **Quick Actions** — Create new [Page/News/Project/Event] shortcuts. Respect role permissions.
  - **My Recent Items** — Last 10 items current user edited. Relative timestamps.
  - **Publishing Schedule** — Upcoming scheduled publishes grouped by day. Editor/Admin only.
- Widgets refresh on page focus (not polling)
- Use Payload's `admin.components.views` to replace default dashboard
- **Output:** Dashboard renders at `/admin` with all 4 widgets

### 22.3 Workflow state field + transitions
- Add `workflowState` select field to `pages` collection (and all content collections that need workflow)
- Options: `draft`, `in_review`, `needs_revision`, `approved`, `published`, `unpublished`
- Default: `draft`
- Add `workflowHistory` array field (from, to, user, date, comment)
- Payload `beforeChange` hook enforces valid transitions (PRD Section 7.2)
- Payload `afterChange` hook logs transition to workflowHistory
- Rejection requires mandatory comment (validated in hook)
- Email notifications fire on workflow transitions (configurable per transition)
- Default: "Submit for Review" sends email to editors, "Reject" sends email to author with rejection comment, "Publish" sends notification to translation team
- Email template fields: from, to, subject (supports `{title}` and `{frasIdNumber}` variables), body
- Email addresses configurable via Payload admin settings (default: `communications@frascanada.ca`, `webtranslation@cpacanada.ca`)
- **Output:** Workflow state persists, transitions validated server-side, email notifications sent

### 22.4 Workflow action bar component
- Custom Payload admin component shown at bottom of edit view for workflow-enabled collections
- Buttons change based on current state + user role (PRD Section 5.4):
  - Draft: [Save Draft] [Submit for Review]
  - In Review: [Save Draft] [Approve] [Reject] (Editor/Admin only)
  - Needs Revision: [Save Draft] [Submit for Review] (shows rejection banner)
  - Approved: [Publish Now] [Schedule] (Editor/Admin only)
  - Published: [Edit (creates new draft)] [Unpublish]
- Rejection modal with mandatory comment field
- Rejection banner at top of editor showing reviewer's comment
- Use Payload's `admin.components.edit` field-level components
- **Output:** Action bar renders below fields, transitions work end-to-end

### 22.5 Item locking system
- Add `lockedBy` (relationship to users) and `lockedAt` (date) fields to pages collection
- Auto-lock on edit open (Payload `beforeRead` hook or admin component `useEffect`)
- Lock indicator in edit view toolbar: "Locked by [Name]" with lock icon
- If locked by another user: read-only mode + "Request Unlock" button
- Auto-unlock after 30 min idle (check `lockedAt` in `beforeChange` hook)
- Admin force-unlock capability
- **Output:** Locking prevents concurrent edits, auto-expires

### 22.6 Language switcher component
- Dropdown in edit view toolbar showing [EN] [FR]
- Switches Payload's locale context for localized fields
- Shows translation status banner: "FR version: NOT TRANSLATED" when no FR content exists
- "Copy from EN" button when creating FR version of untranslated item
- Shared fields (board, image, slug) shown once regardless of language — labeled "Shared"
- Use Payload's `localization` config (`locales: ['en', 'fr']`, `defaultLocale: 'en'`)
- **Output:** Language switcher works, fields swap per locale

### 22.7 Scheduled publishing cron
- Payload `afterInit` hook or custom endpoint that runs on interval (every 5 min)
- Query items where `workflowState === 'approved'` AND `publishOn <= now`
- Transition matching items to `published`, log in workflowHistory
- Query items where `workflowState === 'published'` AND `unpublishOn <= now`
- Transition to `unpublished`
- Dashboard widget reads `publishOn` field for upcoming schedule display
- **Output:** Items auto-publish/unpublish on schedule

### 22.8 Role-based access control
- Define 3 roles in Payload auth: `author`, `editor`, `admin`
- `users` collection with `role` field (select: author/editor/admin)
- Access control functions on collections per PRD Section 2.2:
  - Authors: create/edit own drafts, submit for review, view all, delete own drafts
  - Editors: everything Author + approve/reject, publish/unpublish, schedule, delete drafts
  - Admins: everything + manage users, edit templates, system settings, delete anything
- Apply to all content collections (pages, news, projects, events, etc.)
- **Output:** Role enforcement works end-to-end

## Validation

```bash
npx tsc --noEmit  # TypeScript clean
npm run dev  # Admin panel loads without errors
```

Per task:
- 22.1: Custom sidebar renders, links navigate correctly, Admin-only items hidden for Author
- 22.2: Dashboard shows at `/admin`, all 4 widgets render with data
- 22.3: Workflow state saves, invalid transitions rejected (e.g., Author can't approve)
- 22.4: Action bar buttons change per state + role, rejection modal requires comment
- 22.5: Item locks on edit, shows read-only for other users, auto-unlocks after timeout
- 22.6: Language dropdown switches fields, banner shows for untranslated content
- 22.7: Item with `publishOn` in the past auto-publishes within 5 min
- 22.8: Author cannot approve/publish, Editor cannot manage users, Admin can do everything

## Workflow

1. Read MASTER_TODO.md -> find first `[ ]` task in Epic 22
2. Mark `[~]`, build it, validate, mark `[x]`
3. When ALL tasks are `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPIC 22 COMPLETE</promise>
```

## IMPORTANT

- This is a Payload CMS admin customization — use Payload's extension APIs, not raw React routing
- Reference Payload 3.x docs via Context7 MCP for admin customization patterns
- All custom views go in `src/admin/views/`, components in `src/admin/components/`, hooks in `src/admin/hooks/`
- Use Payload's built-in auth system — do NOT build custom auth
- Use Payload's built-in localization — do NOT build custom i18n for admin
- Server Components by default in admin; `'use client'` only where interactivity requires it
- Test workflow transitions with all 3 roles (create test users in seed data)
- Sitecore's Fras Workflow sent emails to `communications@frascanada.ca` and `webtranslation@cpacanada.ca` on transitions — replicate this with configurable email hooks
