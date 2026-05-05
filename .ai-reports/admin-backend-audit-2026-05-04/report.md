# Admin Backend Audit — Inventory for Custom Shell Replacement

| Field | Value |
|-------|-------|
| **Date** | 2026-05-04 |
| **Purpose** | Catalogue every page / field / interaction in the current Payload-driven admin shell so we can plan the v2 replacement (epic #1) |
| **Auth** | admin@test.com / Test1234! |
| **Screenshots** | 71 (`screenshots/{custom,collections,globals,auth}/`) |
| **Element snapshots** | 70+ (`snapshots/*.txt`) |
| **Method** | Crawled every registered route, captured screenshot + accessibility-tree snapshot, extracted field/control inventory |

This is a **planning document**, not a bug report. Issues live in `.ai-reports/dogfood-2026-05-04-admin-shell/report.md`.

## Top-level inventory

The admin shell exposes:

- **3 top-level workspaces** (Dashboard / Content Tree / Workbox)
- **11 custom views** registered in `payload.config.ts` (8 routes + 3 implicit)
- **24 collections** (all CRUD'able; 2 — board-members, contacts — intentionally not search-indexed per #174)
- **6 globals** (singletons)
- **2 auth surfaces** (login, account)
- **1 left-rail navigation** with 27 entries grouped into MAIN / COLLECTIONS / TOOLS / SYSTEM

The full nav, captured with the menu open, lives at `screenshots/custom/custom-08-nav-expanded.png`.

---

## 1. Custom views (8 registered + 3 implicit)

| # | Path | Screenshot | Component | Status |
|---|------|------------|-----------|--------|
| 1 | `/admin` | dashboard | `/admin/views/Dashboard` | live, 4 widgets (Workflow Queue, Quick Actions, My Recent Items, Publishing Schedule) — see Custom view 1 below |
| 2 | `/admin/tree` | tree | `/admin/views/ContentTree` | **partial** — left rail works (expand, filter, context menu); workspace is a stub placeholder |
| 3 | `/admin/workbox` | workbox | `/admin/views/Workbox` | live, table view with status pills + per-row actions (Preview / Approve / Reject / Publish / History) |
| 4 | `/admin/builder/:id` | page-builder | `/admin/views/PageBuilder` | Puck-based; live |
| 5 | `/admin/builder` | builder-redir | `/admin/views/PageBuilderIndex` | redirects to `/admin/collections/pages` (#162 / PR #214) |
| 6 | `/admin/media` | media | `/admin/views/MediaLibrary` | live, folder rail + thumbnail grid + upload + filter |
| 7 | `/admin/schedule` | schedule | `/admin/views/ScheduleView` | live but missing global header chrome (regression — see dogfood #006) |
| 8 | `/admin/language-audit` | language-audit | `/admin/views/LanguageAuditView` | live, EN/FR translation completeness grid |

Implicit (from Payload defaults, not custom-registered):
- `/admin/account` — account/profile management
- `/admin/login`, `/admin/logout`, `/admin/forgot`, `/admin/reset` — auth flows
- `/admin/settings` — captured at `screenshots/custom/chrome-01-settings.png` (Payload defaults: locale, theme, etc.)

### Custom view 1 — Dashboard (`/admin`)

4 widgets in a 2×2 grid:

| Widget | Source | Data shape |
|--------|--------|------------|
| **Workflow Queue** | `WorkflowQueueWidget.tsx` | Items grouped by `workflowState` (in_review / needs_revision / approved). Click row → `/admin/collections/pages/:id`. Author-filtered for non-admin roles. |
| **Quick Actions** | `QuickActionsWidget.tsx` | Static buttons: + New Page / + New News Article / + New Project / + New Event |
| **My Recent Items** | `RecentItemsWidget.tsx` | Last N items the user touched, time-ago. Reads from a notification/activity log (per CLAUDE.md). |
| **Publishing Schedule** | `PublishingScheduleWidget.tsx` | Upcoming scheduled publishes, "Nothing scheduled" empty state |

**Notification bell** (top right) opens a panel — captured at `custom-09-notifications-panel.png`. 4 unread badge.

### Custom view 2 — Content Tree (`/admin/tree`)

| Element | State |
|---------|-------|
| Left rail tree (Home → Boards & Councils / News / Active projects → leaf docs) | ✓ working |
| Filter / search input | ✓ working |
| Right-click context menu (Insert / Rename / Duplicate / Delete) | ✓ working |
| Expand/collapse animations | ✓ working |
| **Workspace area** | ✗ **stub** — hardcoded "The persistent left tree spine is active in the rail. Native tree workspace lands in a follow-on." |
| Drag-and-drop reorder | not tested (visual cues for drag handles aren't visible) |

### Custom view 3 — Workbox (`/admin/workbox`)

Tabbed list view:
- **Tabs:** All (5) / In Review (3) / Needs Revision / Approved (2) / Scheduled
- **Filters:** All Types dropdown, Filter by author... textbox
- **Sort by:** Date ↓ / Author / Type buttons
- **Columns:** ☐ / Status pill / Title / Type (with collection icon) / Author / Updated / Actions
- **Per-row actions:** Preview, Approve, Reject (for In Review) | Preview, Publish, History (for Approved)
- **Bulk actions:** checkbox row selection (no bulk-action bar visible yet — capture didn't trigger one)

### Custom view 4 — Page Builder (`/admin/builder/:id`)

Three-pane Puck-based editor:
- **Left rail "Components"** with collapsible categories:
  - **CONTENT** — Heading, Rich Text
  - **ACTIONS & LABELS** — Button, Content Type Badge
  - **LAYOUT** — Section, Card Grid, Feature Card
- **Center canvas** — drop zone with placeholder dashed outline
- **Right rail "Page"** — selected component's prop editor (currently shows just `title` textbox for the empty page)
- **Top bar** — "Not saved" / Editing badge / EN | FR locale toggle / Preview / Submit for Review / Publish
- **Bottom-left "Outline"** — drag-to-reorder list of placed components ("No items" empty state)

Per CLAUDE.md the previous custom @dnd-kit-based builder was retired in favour of Puck — confirmed in screenshots.

### Custom view 5 — Media Library (`/admin/media`)

- **Left rail folders:** All Media / Images / Documents / Logos / Videos
- **Top toolbar:** Search box, "All Types" dropdown, "T" type-filter, "↑ Upload" button
- **Grid:** 6-up thumbnails on desktop (1440), filename truncation, file-type icon overlay
- **Detail panel** opens on click (not captured; CLAUDE.md confirms it exists)

### Custom view 6 — Schedule (`/admin/schedule`)

- "Today / This Week / This Month" toggle pills
- Empty state: "Nothing scheduled in this window."
- **Missing global admin header** — known regression (see dogfood-2026-05-04-admin-shell ISSUE-006).

### Custom view 7 — Language Audit (`/admin/language-audit`)

EN/FR translation-completeness grid. Did not deep-inspect.

---

## 2. Collections (24 total)

Snake-cased route slugs. List view columns are bespoke per collection; edit-view fields summarized below. Every collection has these baseline shell controls (when applicable):

- **Top action bar:** API link, Pin to favorites, Compare versions (when versioning enabled), Translate to FR (when localized), EN/FR locale buttons, Submit for Review / Approve / Reject / Publish / Unpublish (when workflow-enabled), Save, kebab menu (Copy / Duplicate / Delete)
- **Title strip:** breadcrumb (Collection → ID), Locale dropdown (top-right)
- **Right column "Workflow State"** select (when workflow-enabled)
- **Left column** — main fields

### COLLECTIONS group (left-nav order)

| Slug | Title | Workflow | Localized | Notable Fields | Notes |
|------|-------|----------|-----------|---------------|-------|
| `boards` | Boards | ✗ | ✓ | Board Name, Abbreviation, Description, Tabs (array), Quick Actions (array), Resources (array), Slug | Sub-pages stored as tabs not docs (per CLAUDE.md) |
| `projects` | Projects | ✓ | ✓ | Project Title, Lexical body, board (relation), standard (relation), timeline_stages (array, up to 7), key_proposals (Lexical), contacts (relation), status, slug | Heavy schema |
| `consultations` | Consultations | ✓ | ✓ | Title, type, deadline_date, board, standard, action_documents (array), slug | Listing data; rich content via `document-details` |
| `news` | News | ✓ | ✓ | Title (English-locale-marked), category, excerpt, body (Lexical), board, slug, FRAS ID Number, Volunteer Opportunity checkbox, publishedDate | Title + slug + excerpt are the localized leaves |
| `events` | Events | ✓ | ✓ | Title, type (meeting/webinar/deadline/decision-summary), date, time (webinar-only), board, summary, slug | Per CLAUDE.md events.type is the discriminator |
| `documents` | Documents | ✓ | ✓ | Title, body, board, file_type, slug | extraction hook (`extractDocumentText`) populates `extracted_text` for search |
| `documents-for-comment` | Documents for Comment | ✓ | ✓ | Listing-side rec + relation to `document-details` | Canonical name (replaces the legacy `consultations` per CLAUDE.md) |
| `document-details` | Document Detail | ✓ | ✓ | Title, highlights (Lexical), body content (Lexical), commentQuestions (array), replyDeadline, howToReply (group with embedded contact), supportMaterials (array of label/url/fileType), staffContacts (array) | The actual exposure-draft body — split from `documents-for-comment` (the listing) |
| `contacts` | Contacts | ✗ | partially | Name (with credentials), title, email, phone | Surfaced in author bylines, not a search target (#174 exclusion) |
| `standards` | Standards | ✗ | ✓ | Name, slug | Top-level (IFRS / ASPE / etc.) |
| `standards-sections` | Standards Sections | ✗ | ✓ | Name, parent standard (relation), slug | 11 confirmed live |
| `board-members` | Members | ✗ | ✗ | Name, photo (media relation), role enum, term_start, term_end, board (relation) | Not search-indexed (#174 exclusion) |
| `pages` | Pages | ✓ | ✓ | Page Title, Hero (group/tabs: Hero / Content / Sidebar / CTA & News / Form Config / Listing Config / SEO), Slug, layout (block array driven by Page Builder), sidebar_type, etc. | Largest schema in the project |
| `dictionary` | Dictionary | ✗ | ✓ | Term name (singular per #93), value | i18n string KV |

### TOOLS group

| Slug | Title | Workflow | Localized | Notable Fields |
|------|-------|----------|-----------|---------------|
| `media` | Media (file uploads) | ✗ | ✗ | filename, mimeType, alt text, sizes (auto), folder relation |
| `media-folders` | Media Folders | ✗ | ✗ | name, parent (self-relation) |
| `redirects` | Redirects | ✗ | ✗ | from, to, type (301/302) |

### SYSTEM-related collections (not in nav but exist)

| Slug | Title | Notes |
|------|-------|-------|
| `committees` | Committees | Per-board committees |
| `decision-summaries` | Decision Summaries | Per-board AGM/meeting outcome rollups (workflow-enabled) |
| `effective-dates` | Effective Dates | Per-standard effective-date table |
| `form-submissions` | Form Submissions | Inbound contact-form submissions stored with honeypot guard |
| `job-postings` | Job Postings | Workflow-enabled (per #83 follow-up) |
| `notifications` | Notifications | Per-user notification log |
| `resources` | Resources | Articles / guidance / webinars / uploaded files (workflow-enabled, search-indexed) |
| `users` | Users | Auth collection — Clerk handles end-user auth; this is editor accounts |

### Per-collection edit view shell

Each collection's edit view shares the same shell — only field shape differs. Captured controls (from `news/51` snapshot as the canonical example):

```
┌─ Top action bar ─────────────────────────────────────────┐
│ News (breadcrumb)              Locale: EN ▾    [avatar] │
│ API · Compare versions · Submit for Review · Translate to FR · Save
└──────────────────────────────────────────────────────────┘
┌─ Main column ───────────────┬─ Workflow State select ───┐
│ Title * — English           │ [draft / in_review / ...] │
│ Category combobox           │                           │
│ Excerpt — English           │ Pin to favorites button  │
│ Body (Lexical editor)       │ FrTranslationWarning     │
│   — Add block / Edit link   │ link (when FR null)      │
│ Board (relation)             │                           │
│ Standard (relation)         │                           │
│ Slug * — English            │                           │
│ Volunteer Opportunity ☐     │                           │
│ FRAS ID Number              │                           │
└──────────────────────────────┴───────────────────────────┘
```

The action bar varies per collection — workflow-disabled collections lose Submit/Approve, non-localized collections lose Translate, etc.

---

## 3. Globals (6 singletons)

All 6 are accessible at `/admin/globals/<slug>` and share the same shell as a collection edit view (action bar at top, form fields below).

| Slug | Title | Localized | Field structure |
|------|-------|-----------|----------------|
| `homepage` | Homepage | ✓ | **Hero** group (type discriminator → highImpact/lowImpact/none, richText, links array, search_enabled toggle) + **Content** layout (block array: CTA / NewsGrid / BrowseByStandard / RichText / Content) |
| `navigation` | Navigation | ✓ | utility_links (array), primary_nav (array), mega_menu (array of trigger_label + columns of [heading + links]) |
| `footer` | Footer | ✓ | columns (array of heading + links), boards_links, quick_links (renamed "Legal" per #91), newsletter_heading + description |
| `search-config` | Search Config | ✓ | popular_tags (array of [label * + query *]) |
| `site-alert` | Site Alert | ✓ | show_alert_bar checkbox, alert_message_text *, url, label, severity combobox |
| `auth-config` | Auth Config | ✓ | username_label, password_label, login_button_label, forgot_username_label, forgot_username_url, forgot_password_label, forgot_password_url, register_prompt, register_link_label, register_url + welcome content blocks (Lexical array) |

---

## 4. Field types in use (replacement coverage matrix)

Surveyed across all collections + globals. The custom shell needs editors for every type below:

| Type | Examples | Locale-aware variant? | Notes |
|------|----------|----------------------|-------|
| `text` | titles, slugs, abbreviations, urls | yes | Single-line; `Title *` shows the EN-locale marker when localized |
| `textarea` | excerpts, descriptions | yes | Multi-line plain text |
| `richText` (Lexical) | body, key_proposals, highlights, hero richText, body content | yes | Heaviest field — needs full Lexical editor parity (paragraphs, lists, links, headings, blocks) |
| `relationship` | board, standard, contacts, parent | (relation target may be localized) | Combobox + "Add new <X>" inline-create button + "Edit <selected>" deep-link |
| `select` (combobox) | type, status, severity, role | sometimes | Static options |
| `checkbox` | volunteer_opportunity, has_dropdown, show_alert_bar | n/a | Single boolean |
| `number` | FRAS ID Number, phase_number | n/a | |
| `date` / `dateTime` | publishedDate, deadline_date, term_start, term_end | n/a | Time-of-day shown when relevant (events.time) |
| `array` | tabs, quick_actions, resources, timeline_stages, links, columns, popular_tags, mega_menu | yes | Drag-to-move + Add/Remove/Toggle block + Collapse all/Show all controls |
| `group` | hero, mediaInquiries, howToReply, contactAddress | yes | Visually a labeled fieldset |
| `blocks` (polymorphic array) | layout (homepage, pages, auth-config welcome) | yes | Drag-to-move + per-block "Add block" picker by category |
| `tabs` (UI) | Pages: Hero / Content / Sidebar / CTA & News / Form Config / Listing Config / SEO | n/a | Container for grouped fields |
| `media upload` | media collection | n/a | + alt text, + folder selector, + auto-resize sizes |
| `code` / `json` | (none observed) | — | Probably needed for future edge cases |

**Localization marker convention:** every localized field shows ` — English` (or ` — French`) suffix on the label. EN/FR locale buttons in the action bar swap the active locale; the form re-renders with the same field shape but new values. The locale also shows in the breadcrumb dropdown.

---

## 5. Workflow / publishing surface

The Workbox + per-doc action bar implement a 4-state workflow (draft → in_review → approved → published, with a side branch needs_revision). Captured controls:

- **Per-doc** (when workflow-enabled): Submit for Review / Approve / Reject (with comment) / Publish / Unpublish / Create New Draft / Translate to FR / Compare versions
- **Workbox queue:** filter by state, by author, by type. Bulk-row checkbox selection. Per-row Preview / Approve / Reject / Publish / History.
- **Workflow State right-column dropdown** is the mechanical fallback for direct state edits.
- **Notifications bell** badge counts items needing the user's attention.

The workflow-state colors (workflow-review / workflow-revision / workflow-approved tokens) all pass AA contrast post-#100 cleanup.

---

## 6. Auth surfaces

| Path | Status |
|------|--------|
| `/admin/login` | Branded — RAS Canada wordmark + sub-label + "Sign in to..." headline (per #40) |
| `/admin/forgot-password` | Default Payload chrome — issue #41 still open |
| `/admin/reset-password` | Default Payload chrome — issue #42 still open |
| `/admin/account` | Default Payload chrome — issue #43 still open |
| `/admin/logout` | Bounces to login |

---

## 7. Translation pipeline (relevant to the rebuild)

Three integration points the new shell must preserve:

1. **`<TranslateButton>`** in the per-doc action bar — calls `/api/admin/translate` → AI translates EN content to FR. Fires a `fras:translation-completed` event on success (per #84 fix).
2. **`<FrTranslationWarning>`** orange flag in the right column when FR content is null. Subscribes to the `fras:translation-completed` event + re-fetches the FR doc to clear itself.
3. **EN/FR locale toggle** in the action bar swaps the form's active locale. Saving in one locale doesn't touch the other.

`scripts/batch-translate.mjs` runs the full corpus with cost guards; not invoked from the UI.

---

## 8. Replacement-shell scope (what to build)

Mapping the audit to the build plan in epic #1 + tickets #26–#46:

### Layer 0 — Shell foundation (already partially built)

- ✓ Top header bar with hamburger menu toggle + brand logo + locale + avatar
- ✓ Left-rail navigation (4 groups: MAIN / COLLECTIONS / TOOLS / SYSTEM)
- ✓ Notifications bell + panel
- ✓ Branded login (#40) + login intro
- ✗ Branded forgot-password / reset-password / account (#41 / #42 / #43)
- ✗ Final cleanup — zero @payloadcms/ui imports, zero iframes (#46)

### Layer 1 — Generic data table engine (#32)

Reusable for the 11+ collections that don't need bespoke list UX. Must support:
- Sortable columns (asc / desc per column) — observed on every list view
- Per-collection column picker dropdown
- Filters dropdown (combobox-driven, per field type)
- Search input (Title-only by default; needs left padding fixed — see dogfood ISSUE-004)
- Pagination + per-page selector + page number jump
- Optional "Board:" segmented control row (boards-aware lists: pages / news / events / projects)
- Bulk row selection (checkbox column) with intent for a bulk-action bar (not yet wired)

### Layer 2 — Bespoke list views

- ✗ #33 Pages (tree-aware — leverage the catch-all `[...slug]` routing)
- ✗ #34 News (thumbnail + headline + board + date)
- ✗ #35 Projects (timeline pill)
- ✗ #36 Events (date/time + type icon)
- ✓ #37 generic mount for the rest (delivered by Layer 1)

### Layer 3 — Native edit views (the big one)

Replace every `<EditView>` for these:

- ✗ #27 Pages (kills the Tree iframe seam)
- ✗ #28 News
- ✗ #29 Projects
- ✗ #30 Boards
- ✗ #31 DocumentsForComment
- ✗ #38 the remaining 11+ collections
- ✗ #39 the 6 globals

Native edit views must implement every field type from §4 above. They must preserve the workflow action bar (Submit / Approve / Reject / Publish / Translate / EN/FR / Compare Versions), the FrTranslationWarning, and the right-rail Workflow State dropdown.

### Layer 4 — Custom workspaces (already built but with gaps)

- ✓ Dashboard (4 widgets — needs visual polish per dogfood ISSUE-002)
- partial — Content Tree (left rail works; **workspace still a stub**, dogfood ISSUE-001)
- ✓ Workbox (Author column regression — dogfood ISSUE-005)
- ✓ Page Builder (Puck-based, post-G2 spike)
- ✓ Media Library
- ✓ Schedule (header chrome regression — dogfood ISSUE-006)
- ✓ Language Audit

### Layer 5 — Decommission

- ✗ #44 move Payload UI to `/admin/_payload/*` with admin-only banner (so the legacy chrome is reachable as a developer escape hatch but not the default)
- ✗ #45 retire `/cms` (301 redirect → `/admin`)
- ✗ #46 final cleanup — zero `@payloadcms/ui` imports, zero iframes

---

## 9. Hard requirements for the rebuild

Synthesized from the audit:

1. **Bilingual everywhere** — every field that's `localized: true` in Payload needs an EN/FR-aware editor. The shell's locale toggle is the canonical UX.
2. **Workflow as a first-class concept** — every workflow-enabled collection's edit view + the Workbox shell + the dashboard widget all need the same state machine view (in_review / needs_revision / approved / published).
3. **Lexical parity** — the rich-text editor is on at least 8 collections. The replacement must read/write the Lexical JSON format Payload stores.
4. **Block array editor** — Pages, Homepage, Auth Config all use polymorphic block arrays. The Page Builder (Puck) covers the layout case but inline block arrays in form fields need their own editor.
5. **Relations with inline-create** — most collections have `Add new <X>` and `Edit <selected>` deep-links. The picker UX needs both inline create AND edit.
6. **Drag-and-drop everywhere** — array fields, layout blocks, page-builder canvas, content-tree node reorder all need DnD. `@dnd-kit` is already a project dependency.
7. **Search filter on every list view** — the Title-search box is universal; collection-specific filters (Board, status, etc.) are per-list.
8. **Responsive collapse** — the left nav already has Open/Close Menu state; the rebuild should keep the rail closeable and reopenable.
9. **AA contrast on every interactive token** — the workflow-state pills, badges, buttons, and Quick Actions widget were retuned in #100. The rebuild needs the same audit pre-launch.
10. **Anti-regression test patterns** — the existing tests (workflow-action-bar-registration, brand-string-regression, no-admin-key-in-bundle, dual-write contract) form a template; the rebuild should ship with equivalent guards on its own surfaces.

---

## 10. Open questions

1. **Tree workspace UX** — when a node is selected, do we render an inline detail panel, redirect to the matching collection edit view, or both (split-pane)? CLAUDE.md says "Sitecore-style hierarchical browser" → split-pane is the canonical Sitecore pattern.
2. **Page Builder vs inline blocks** — Pages currently use Puck for layout. Smaller block arrays (Homepage layout, Auth Config welcome) use the form's array-of-blocks editor. Should the rebuild unify these?
3. **Settings view ownership** — `/admin/settings` is currently Payload's defaults page. Do we keep it, replace, or split into "User preferences" + "System config"?
4. **Notifications model** — the bell is wired to a `notifications` collection. Is the schema fixed for the rebuild or are we open to adopting a third-party (Knock, Novu)?
5. **`/admin` (root) vs `/cms`** — the project ships both. CLAUDE.md says `/cms` is the "Primary editor experience" and `/admin` is the "Developer backdoor". Today they look identical; #45 plans to retire `/cms`. Confirm direction.

---

## Appendix — Capture inventory

```
screenshots/
├── auth/                    2 files  (account, logout)
├── collections/            42 files  (24 list × 1 + 18 edit × 1)
├── custom/                 11 files  (8 routes + nav-expanded + notifications + page-builder)
└── globals/                 6 files  (all 6 globals)

snapshots/                  70+ accessibility-tree dumps
```

Each snapshot is the live accessibility tree at capture time (button labels, textbox labels, refs). Useful for regression testing the rebuild against the same nav structure.
