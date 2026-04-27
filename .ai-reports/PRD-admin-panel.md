# FRAS Canada -- Custom Admin Panel PRD

> **Version:** 1.0
> **Date:** 2026-03-05
> **Status:** Draft -- requirements gathering complete
> **Source:** Sitecore 10.2 XM/SXA interface research, stakeholder Q&A sessions
> **Research:** `.ai-reports/research-sitecore-admin-interface.md`

---

## 1. Executive Summary

FRAS Canada's content team (5-15 people) is migrating from Sitecore 10.2 XM/SXA to Payload CMS 3.x + Next.js 15. They want a custom admin panel that preserves the Sitecore editorial experience they're accustomed to -- specifically the unified content tree, visual page builder, and structured workflow -- while eliminating Sitecore's well-documented pain points (slow Experience Editor, hidden Standard Fields, confusing publishing modes, lack of multi-select, version bloat from lock/edit).

**Architecture decision:** Extend Payload CMS's existing admin panel with custom views. Payload handles auth, RBAC, field rendering, API, and collection CRUD. Custom code handles the content tree, page builder, workbox, media browser, and dashboard.

**Key surfaces:**
1. **Dashboard** -- personalized landing with workflow queue, recent items, publishing schedule, quick actions
2. **Content Tree** -- Sitecore-style unified hierarchy with full right-click CRUD
3. **Field Editor** -- Payload's OOTB collection/globals editing (with language switcher)
4. **Page Builder** -- template-first visual editor with toolbox, placeholder zones, drag-and-drop, responsive preview
5. **Workbox** -- 5-state workflow management dashboard
6. **Media Library** -- folder-based browser with search, filters, upload

---

## 2. User Roles & Permissions

### 2.1 Role Definitions

| Role | Count (est.) | Capabilities |
|------|-------------|--------------|
| **Author** | 5-8 | Create/edit content, submit for review, view all content |
| **Editor** | 2-4 | Everything Author + approve/reject, publish/unpublish, schedule publishing |
| **Admin** | 1-2 | Everything + manage users/roles, edit templates/layouts, system settings, delete anything |

### 2.2 Permission Matrix

| Action | Author | Editor | Admin |
|--------|--------|--------|-------|
| Create content | Yes | Yes | Yes |
| Edit own drafts | Yes | Yes | Yes |
| Edit others' drafts | No | Yes | Yes |
| Submit for review | Yes | Yes | Yes |
| Approve / Reject | No | Yes | Yes |
| Publish | No | Yes | Yes |
| Unpublish | No | Yes | Yes |
| Schedule publish | No | Yes | Yes |
| Delete draft items | Own only | Yes | Yes |
| Delete published items | No | No | Yes |
| Manage users & roles | No | No | Yes |
| Edit page templates/layouts | No | No | Yes |
| System settings | No | No | Yes |
| Lock/unlock others' items | No | No | Yes |
| View workflow queue | Own items | All items | All items |
| Bulk operations | No | Yes | Yes |

### 2.3 Implementation

- Use Payload's built-in auth + RBAC system
- Define roles as Payload access control functions on collections
- Custom middleware for page builder and tree permissions
- Lock ownership tracked per-item in a `lockedBy` field

---

## 3. Dashboard (`/admin`)

The first screen editors see after login. Personalized by role.

### 3.1 Layout

```
+-------------------------------------------------------+
|  FRAS Canada CMS                    [User] [Settings]  |
+-------------------------------------------------------+
|                                                         |
|  Welcome, [Name]                          [Role Badge]  |
|                                                         |
|  +---------------------------+  +---------------------+ |
|  |  WORKFLOW QUEUE           |  |  QUICK ACTIONS      | |
|  |                           |  |                     | |
|  |  In Review (3)            |  |  + New Page         | |
|  |  - Board update (AcSB)   |  |  + New News Article | |
|  |  - Project: IFRS S1...   |  |  + New Project      | |
|  |  - News: March update    |  |  + New Event        | |
|  |                           |  |                     | |
|  |  Needs Revision (1)      |  |  [Open Tree]        | |
|  |  - FAQ page (returned)   |  |  [Search Content]   | |
|  +---------------------------+  +---------------------+ |
|                                                         |
|  +---------------------------+  +---------------------+ |
|  |  MY RECENT ITEMS          |  |  PUBLISHING         | |
|  |                           |  |  SCHEDULE           | |
|  |  AcSB Board Detail  2m   |  |                     | |
|  |  IFRS S1 Project   15m   |  |  Today:             | |
|  |  March Newsletter   1h   |  |  - News: Q1 report  | |
|  |  Homepage hero      3h   |  |  Tomorrow:          | |
|  |                           |  |  - Event: Webinar   | |
|  +---------------------------+  +---------------------+ |
+-------------------------------------------------------+
```

### 3.2 Widgets

| Widget | Description | Roles |
|--------|-------------|-------|
| **Workflow Queue** | Items grouped by state (In Review, Needs Revision, Approved). Authors see own items; Editors/Admins see all. Click to open item. | All |
| **Quick Actions** | Create new content shortcuts. Opens directly to field editor with collection pre-selected. | All |
| **My Recent Items** | Last 10 items the user edited. Relative timestamps. Click to open. | All |
| **Publishing Schedule** | Upcoming scheduled publishes grouped by day. Shows item title, type, scheduled time. | Editor, Admin |

### 3.3 Behavior

- Dashboard is the default route (`/admin`)
- Widgets refresh on page focus (not polling)
- Workflow queue badge count shown in sidebar nav at all times
- Quick actions respect role permissions (Authors don't see "New Page" if page creation requires Admin)

---

## 4. Content Tree (`/admin/tree`)

Sitecore-style unified content tree showing all content in a single hierarchy.

### 4.1 Layout

```
+------- SIDEBAR -------+---------- MAIN PANEL ----------+
|                        |                                 |
|  [Search...] [+]       |  [Breadcrumb: FRAS > Boards >  |
|                        |   AcSB]                        |
|  FRAS Canada           |                                 |
|  +-- Home              |  +-- FIELD EDITOR ----------+  |
|  +-- Boards            |  |   (or Page Builder)       |  |
|  |   +-- AcSB          |  |                           |  |
|  |   +-- PSAB          |  |   Title: [____________]   |  |
|  |   +-- CSSB          |  |   Slug:  [____________]   |  |
|  |   +-- AASB          |  |   Body:  [Rich Text    ]  |  |
|  |   +-- RASOC         |  |   ...                     |  |
|  +-- Projects          |  +---------------------------+  |
|  |   +-- IFRS S1...    |                                 |
|  |   +-- ASPE Rev...   |  [Save Draft] [Submit Review]   |
|  +-- Consultations     |  [Open in Page Builder]         |
|  +-- News              |                                 |
|  +-- Events            |                                 |
|  +-- Documents         |                                 |
|  +-- Members           |                                 |
|  +-- Settings          |                                 |
|  +-- Data              |                                 |
|                        |                                 |
|  --- MEDIA LIBRARY --- |                                 |
|  +-- Images            |                                 |
|  +-- Documents         |                                 |
|  +-- Logos             |                                 |
+------------------------+---------------------------------+
```

### 4.2 Tree Behavior

| Feature | Description |
|---------|-------------|
| **Expand/collapse** | Click chevron to expand children. State persisted in localStorage. |
| **Select** | Click item to load it in the main panel (field editor). |
| **Icons** | Type-specific icons: page, folder, news article, project, event, document, media, settings. |
| **Gutter indicators** | Small icons left of each item: lock (locked by user), workflow state (colored dot: gray=draft, blue=review, yellow=revision, green=approved, purple=published), language warning (missing FR version). |
| **Search** | Search bar at top of tree. Filters tree items in real-time. Searches title + slug. |
| **Drag and drop** | Drag items to reorder within same parent, or move to new parent. Shows drop target highlight. Respects permissions. |
| **Lazy loading** | Large folders (News, Projects) load children on expand, not upfront. |

### 4.3 Right-Click Context Menu

```
+------------------------+
|  Insert >              |
|    Page                |
|    News Article        |
|    Project             |
|    (filtered by valid  |
|     child types)       |
|  ----------------------|
|  Open in Page Builder  |
|  Open in New Tab       |
|  ----------------------|
|  Copy                  |
|  Move To...            |
|  Duplicate             |
|  Rename                |
|  ----------------------|
|  Lock / Unlock         |
|  ----------------------|
|  Delete                |
+------------------------+
```

### 4.4 Insert Options (Sitecore Parity)

Each content type defines which child types can be inserted beneath it:

| Parent Type | Allowed Children |
|-------------|-----------------|
| **Root (FRAS Canada)** | Page, Folder |
| **Boards folder** | Board Detail Page |
| **Board Detail Page** | Page (sub-pages like About, Members) |
| **Projects folder** | Project |
| **News folder** | News Article |
| **Events folder** | Event |
| **Documents folder** | Document |
| **Consultations folder** | Consultation |
| **Settings** | Global config items |
| **Data folder** | Contacts, Standards, Decision Summaries |
| **Page** | Page (unlimited nesting) |

Insert menu is dynamically filtered to show only valid child types for the selected parent.

### 4.5 Implementation Notes

- Tree state stored in a `pages` collection with `parent` relationship for hierarchy
- Tree component: use `@dnd-kit/core` for drag-and-drop, custom React tree with virtualization for performance
- Context menu: custom React component, positioned at cursor
- Gutter indicators: computed from item's `_status`, `lockedBy`, and locale fields
- Search: client-side filter for expanded nodes + server-side API for deep search

---

## 5. Field Editor (Payload OOTB + Customizations)

When an item is selected in the tree, the main panel shows the Payload field editor. This is largely Payload's built-in edit view with these customizations:

### 5.1 Language Switcher

```
+--------------------------------------------------+
|  Language: [EN v]  [FR]     ! FR: NOT TRANSLATED  |
+--------------------------------------------------+
|                                                    |
|  Title:  [About FRAS Canada________________]      |
|  Slug:   [about-fras-canada_________________]     |
|                                                    |
|  --- Content ---  (collapsible section)             |
|  Body:  [Rich Text Editor                    ]     |
|                                                    |
|  --- Metadata ---  (collapsible section)            |
|  Meta Title: [__________________________]          |
|  Meta Desc:  [__________________________]          |
|                                                    |
|  --- Relationships ---  (collapsible section)       |
|  Board:     [AcSB v]                               |
|  Standard:  [IFRS S1 v]                            |
|                                                    |
|  --- Publishing ---  (collapsible section)          |
|  Status:    [Draft]  Workflow: [In Review]          |
|  Publish On: [2026-03-15]                          |
|  Unpublish On: [__________]                        |
+--------------------------------------------------+
|  [Save Draft]  [Submit for Review]  [Preview]      |
+--------------------------------------------------+
```

### 5.2 Language Behavior

| Feature | Description |
|---------|-------------|
| **Switcher** | Dropdown in toolbar. Switches all localized fields to selected language. |
| **Translation status** | Banner warning when viewing a language that has no translation yet. |
| **Shared fields** | Fields like `board`, `standard`, `image`, `slug` are not localized -- shown once regardless of language selection. Labeled "Shared" in the UI. |
| **Localized fields** | `title`, `body`, `meta_title`, `meta_description` are per-language. Switching language shows that language's values. |
| **Auto-copy** | When creating FR version of an untranslated item, option to "Copy from EN" to pre-populate fields. |

### 5.3 Field Sections

Fields organized in collapsible sections (mirrors Sitecore's section groups):

1. **Content** -- title, body, and content-type-specific fields
2. **Metadata** -- SEO fields (meta title, description, OG image)
3. **Relationships** -- board, standard, project, parent linkages
4. **Publishing** -- workflow status, publish/unpublish dates, restrictions
5. **Settings** -- slug, template, display options

Sections remember collapsed/expanded state in localStorage.

### 5.4 Action Bar

| Button | Role | Action |
|--------|------|--------|
| **Save Draft** | All | Saves without changing workflow state |
| **Submit for Review** | Author | Transitions to "In Review" state |
| **Approve** | Editor, Admin | Transitions to "Approved" state |
| **Reject** | Editor, Admin | Transitions to "Needs Revision" + requires comment |
| **Publish** | Editor, Admin | Publishes approved content |
| **Schedule** | Editor, Admin | Sets future publish date |
| **Preview** | All | Opens frontend preview in new tab |
| **Open in Page Builder** | All (pages only) | Switches to visual page builder view |
| **Lock / Unlock** | All | Locks item for exclusive editing |

### 5.5 Implementation

- Payload's `localization` config with `locales: ['en', 'fr']`
- Payload's `versions` + `drafts` for draft/published state
- Custom Payload admin components for: language switcher toolbar, workflow action bar, lock indicator
- Collapsible sections via Payload's `admin.group` on field configs

---

## 6. Page Builder (`/admin/builder/:id`)

Template-first visual page editor. Pages start from a template with locked structural zones and one or more editable zones where editors can add, remove, reorder, and configure components.

### 6.1 Layout

```
+--------+-------------------------------------+----------+
|TOOLBOX |  PAGE CANVAS                         |PROPS     |
|        |                                      |DRAWER    |
| Search |  Toolbar:                            |(slides   |
| [____] |  [Save] [Undo] [Redo] [Preview]     | out on   |
|        |  [Desktop] [Tablet] [Mobile]         | click)   |
| CONTENT|  Language: [EN v]                    |          |
|  Rich  |                                      |          |
|  Text  |  +---[header]--- LOCKED ---+         |          |
|  Heading|  | SiteHeader component    |         |          |
|  Image |  +-------------------------+         |          |
|  Video |                                      |          |
|  Accord|  +---[hero]--- LOCKED -----+         |          |
|  Tabs  |  | Hero Banner             |         |          |
|  Table |  | "Canada's Official..."   |         |          |
|  Quote |  +-------------------------+         |          |
|  Divider|                                     |          |
|        |  +---[main]--- EDITABLE ---+         |          |
| LAYOUT |  |                          |         |          |
|  Cards |  |  [Rich Text] (gear)(x)(arrows)    |          |
|  2-Col |  |  [Card Grid] (gear)(x)(arrows)    |          |
|  3-Col |  |  [News Feed] (gear)(x)(arrows)    |          |
|  Hero  |  |                          |         |          |
|  CTA   |  |  [+ Add Component]       |         |          |
|  Feature|  +-------------------------+         |          |
|  Stats |                                      |          |
|        |  +---[footer]--- LOCKED ---+         |          |
| DATA   |  | SiteFooter component    |         |          |
|  Proj. |  +-------------------------+         |          |
|  News  |                                      |          |
|  Events|                                      |          |
|  Docs  |                                      |          |
|  Contac|                                      |          |
|  Board |                                      |          |
|  Conslt|                                      |          |
|        |                                      |          |
| INTER. |                                      |          |
|  Search|                                      |          |
|  Filter|                                      |          |
|  Signup|                                      |          |
|  Downld|                                      |          |
|  Anchor|                                      |          |
+--------+--------------------------------------+----------+
```

### 6.2 Toolbox (Left Panel)

Categorized component palette. Drag from toolbox into editable placeholder zones.

#### Content Blocks
| Component | Description | Configurable Props |
|-----------|-------------|-------------------|
| **Rich Text** | WYSIWYG block with formatting toolbar | Content (rich text) |
| **Heading** | H1-H6 heading | Level (1-6), text, alignment |
| **Image** | Single image with caption | Image (media picker), alt text, caption, alignment, size |
| **Video** | Embedded video | URL (YouTube/Vimeo), poster image, autoplay |
| **Accordion** | Expandable sections | Items (title + content pairs), default expanded |
| **Tabs** | Tabbed content panels | Tabs (label + content pairs), default active |
| **Table** | Data table | Rows/columns, header row toggle, striped toggle |
| **Blockquote** | Styled quotation | Quote text, attribution, style variant |
| **Divider** | Visual separator | Style (line, dots, space), spacing |
| **Image Grid** | Multi-image display grid for logos, partner badges, or photo galleries. | Images (media picker, multi-select), columns (2-6), gap size, image fit (cover/contain), link per image (optional), caption per image (optional) |

#### Layout Components
| Component | Description | Configurable Props |
|-----------|-------------|-------------------|
| **Card Grid** | Grid of content cards | Columns (2-4), items (title, image, description, link), style variant |
| **2-Column** | Two-column layout | Left/right content (nested components), ratio (50/50, 60/40, 70/30) |
| **3-Column** | Three-column layout | Column content (nested), equal or custom widths |
| **Hero Banner** | Full-width hero section | Heading, subheading, CTA button, background image/gradient |
| **CTA Banner** | Call-to-action strip | Heading, body text, button label, button URL, style variant |
| **Feature Row** | Icon + text feature block | Icon, heading, description, link, layout (horizontal/vertical) |
| **Stats Bar** | Key statistics display | Stats (number, label, icon) array, background style |

#### Data-Driven Widgets
| Component | Description | Configurable Props |
|-----------|-------------|-------------------|
| **Project List** | Dynamic project listing | Board filter, status filter, limit, sort order, display style (cards/list) |
| **News Feed** | Dynamic news listing | Board filter, category filter, limit, show excerpts toggle |
| **Event Calendar** | Upcoming events | Board filter, event type filter, limit, display style (list/calendar) |
| **Document Table** | Filterable document list | Board filter, type filter, sort by, searchable toggle |
| **Contact Card** | Staff contact display | Contact (relationship picker), layout (card/inline) |
| **Board Members Grid** | Board member listing | Board (relationship), show bio toggle, columns |
| **Consultation Countdown** | Active consultation with timer | Consultation (relationship picker), show description toggle |
| **Standards List** | Grouped list of standards with section headers and links. Renders hierarchical standards sections (e.g., IFRS, ASPE) with clickable items. | Board filter, grouping (by section/by type), show descriptions toggle, collapse/expand default |
| **Effective Dates Table** | Structured date table with colored section headers, multi-column rows, and footnotes. Used for standards effective date tracking. | Board filter, section header color (board-specific), columns (standard, effective date, early adoption, notes), footnotes (rich text), sort order |

#### Interactive Elements
| Component | Description | Configurable Props |
|-----------|-------------|-------------------|
| **Search Bar** | Inline search input | Placeholder text, search scope (all/board/collection) |
| **Filter Panel** | Faceted filter controls | Facets (board, type, date range, status), layout (horizontal/vertical) |
| **Newsletter Signup** | Email subscription form | Heading, description, button text, HubSpot form ID |
| **Download Button** | File download CTA | Document (media picker), button text, style variant |
| **Anchor Link** | In-page navigation anchor | Anchor ID, display (visible heading or invisible) |

### 6.3 Page Canvas (Center Panel)

The rendered page in an iframe with editing overlays.

#### Placeholder Zones

Each page template defines placeholder zones:

| Zone Type | Behavior | Visual Indicator |
|-----------|----------|-----------------|
| **Locked** | Cannot be modified. Structural elements (header, footer, hero). Content comes from template or global. | Gray dashed border, lock icon, "Locked" label |
| **Editable** | Editors can add, remove, reorder components. Primary editing area. | Blue dashed border, "Editable Zone" label, "+" button at bottom |

#### Component Chrome

When hovering over a placed component in an editable zone:

```
+--- [Rich Text] -------- [gear] [arrows] [x] ---+
|                                                   |
|  Lorem ipsum dolor sit amet, consectetur          |
|  adipiscing elit. Sed do eiusmod tempor...        |
|                                                   |
+---------------------------------------------------+
```

- **Label** -- component type name (top-left)
- **Gear icon** -- opens props drawer (right side)
- **Arrows** -- drag handle for reordering
- **X icon** -- remove component (with confirmation)
- **Blue border** -- highlights active component

#### Adding Components

Two methods:
1. **Drag from toolbox** -- drag a component from left panel, drop into editable zone. Drop target highlighted with green indicator.
2. **Click "+" button** -- at bottom of editable zone. Opens a component picker modal (searchable, categorized grid).

#### Responsive Preview

Toolbar toggles:

| Breakpoint | Width | Description |
|------------|-------|-------------|
| **Desktop** | 1440px | Full-width canvas |
| **Tablet** | 768px | Canvas constrained to tablet width, centered |
| **Mobile** | 375px | Canvas constrained to mobile width, centered |

Canvas iframe resizes with smooth animation. Toolbox collapses to icon-only on tablet/mobile preview to preserve canvas space.

### 6.4 Props Drawer (Right Panel)

Slides out when clicking gear icon on a component. 300px wide overlay.

```
+------- PROPS DRAWER --------+
|                              |
|  Card Grid             [x]  |
|                              |
|  --- Layout ---              |
|  Columns:  [3 v]             |
|  Style:    [Default v]       |
|                              |
|  --- Data Source ---         |
|  Source:   [Manual v]        |
|                              |
|  --- Items ---               |
|  [Card 1]  [edit] [x]       |
|    Title: [___________]     |
|    Image: [Select...]       |
|    Desc:  [___________]     |
|    Link:  [___________]     |
|  [Card 2]  [edit] [x]       |
|  [Card 3]  [edit] [x]       |
|  [+ Add Card]                |
|                              |
|  [Apply] [Cancel]            |
+------------------------------+
```

#### Data Source Modes

Components that display dynamic content (Project List, News Feed, etc.) support two data source modes:

| Mode | Description |
|------|-------------|
| **Manual** | Editor configures items inline in the props drawer |
| **Dynamic** | Editor selects a collection + filters. Component auto-populates from CMS data. |

### 6.5 Page Templates

Templates define the locked/editable zone structure. Managed by Admins.

| Template | Locked Zones | Editable Zones |
|----------|-------------|----------------|
| **Homepage** | Header, Footer | Hero (1 component), Main (unlimited), Newsletter (1 component) |
| **Board Detail** | Header, Hero Banner, Tab Nav, Footer | Tab Content (unlimited per tab) |
| **Project Detail** | Header, Hero, Timeline, Footer | Main (unlimited), Sidebar (limited) |
| **Active Projects** | Header, Hero, Filter Bar, Footer | Results Zone (1 component: Project List) |
| **Open Consultations** | Header, Hero, Footer | Main (unlimited) |
| **Search Results** | Header, Search Bar, Footer | Results Zone (locked to Search Results component) |
| **Content Page** | Header, Footer | Main (unlimited), Sidebar (optional, limited) |
| **Flexible Page** | Header, Footer | Full Body (unlimited) -- most freedom |

### 6.6 Implementation Notes

- Page builder is a custom Payload admin view at `/admin/builder/:id`
- Canvas renders via iframe pointing to Next.js frontend with `?preview=true&editing=true` query params
- Component placement stored as JSON in a `layout` field on the page:
  ```json
  {
    "zones": {
      "main": [
        { "type": "rich-text", "id": "abc123", "props": { "content": "..." } },
        { "type": "card-grid", "id": "def456", "props": { "columns": 3, "items": [...] } }
      ]
    }
  }
  ```
- Drag-and-drop: `@dnd-kit/core` + `@dnd-kit/sortable`
- Component registry: each component type registered with schema (props definition), thumbnail, category, and allowed zones
- Communication between admin and iframe: `postMessage` API for hover highlights, selection sync, and inline editing
- Responsive preview: iframe `width` style change, not CSS media queries

---

## 7. Workflow System

5-state publishing workflow with role-based transitions.

### 7.1 States

```
                    +--- reject ---+
                    |              |
                    v              |
[Draft] --> [In Review] --> [Approved] --> [Published]
   ^              |                            |
   |              +--- reject ---+             |
   |                             |             |
   +---- [Needs Revision] <-----+             |
   |         (with comments)                   |
   |                                           |
   +------- [Unpublished] <-------------------+
```

| State | Color | Who Can Enter | Description |
|-------|-------|--------------|-------------|
| **Draft** | Gray | Author, Editor, Admin | Initial state. Work in progress. |
| **In Review** | Blue | Author (submit), Editor, Admin | Awaiting editorial review. |
| **Needs Revision** | Yellow/Orange | Editor (reject), Admin | Returned with mandatory reviewer comments. |
| **Approved** | Green | Editor (approve), Admin | Content approved, ready to publish. |
| **Published** | Purple | Editor (publish), Admin | Live on the frontend. |
| **Unpublished** | Red | Editor, Admin | Removed from frontend, content preserved. |

### 7.2 Transitions

| From | To | Actor | Requirements |
|------|-----|-------|-------------|
| Draft | In Review | Author+ | Content passes field validation |
| In Review | Approved | Editor+ | -- |
| In Review | Needs Revision | Editor+ | Mandatory rejection comment |
| Needs Revision | In Review | Author+ | Must acknowledge/address feedback |
| Approved | Published | Editor+ | Immediate or scheduled |
| Approved | Needs Revision | Editor+ | If issues found post-approval |
| Published | Unpublished | Editor+ | -- |
| Published | Draft | Admin | Creates new draft version of published content |
| Unpublished | Draft | Editor+ | -- |

### 7.3 Rejection Comments

When an Editor rejects content (In Review -> Needs Revision):

1. Modal prompt with mandatory comment field
2. Comment stored in `workflowHistory` array on the item
3. Author sees rejection banner at top of field editor:
   ```
   +----------------------------------------------------------+
   | ! NEEDS REVISION                                         |
   | Rejected by [Editor Name] on [Date]:                     |
   | "The third paragraph needs a citation for the IFRS       |
   |  reference. Also update the French translation."         |
   |                                                [Dismiss] |
   +----------------------------------------------------------+
   ```
4. Author addresses feedback, then resubmits for review

### 7.4 Workflow History

Every state transition logged:

```json
{
  "workflowHistory": [
    { "from": "draft", "to": "in_review", "user": "author@fras.ca", "date": "2026-03-05T10:00:00Z", "comment": null },
    { "from": "in_review", "to": "needs_revision", "user": "editor@fras.ca", "date": "2026-03-05T14:00:00Z", "comment": "Missing FR translation for body text." },
    { "from": "needs_revision", "to": "in_review", "user": "author@fras.ca", "date": "2026-03-06T09:00:00Z", "comment": "FR translation added." },
    { "from": "in_review", "to": "approved", "user": "editor@fras.ca", "date": "2026-03-06T10:00:00Z", "comment": null },
    { "from": "approved", "to": "published", "user": "editor@fras.ca", "date": "2026-03-06T10:05:00Z", "comment": null }
  ]
}
```

### 7.5 Scheduled Publishing

- Editor sets a `publishOn` date on an Approved item
- Cron job (or Payload hook on interval) checks for items past their `publishOn` date and transitions them to Published
- Optional `unpublishOn` date for time-limited content (consultations, job postings)
- Dashboard widget shows upcoming scheduled publishes

### 7.6 Item Locking

| Feature | Description |
|---------|-------------|
| **Auto-lock on edit** | When an Author/Editor opens an item for editing, it auto-locks to them |
| **Lock indicator** | Lock icon + "Locked by [Name]" in tree gutter and field editor toolbar |
| **Unlock** | User can unlock when done. Item auto-unlocks after 30 min idle. |
| **Admin override** | Admins can force-unlock any item |
| **Concurrent edit prevention** | If locked by another user, field editor opens in read-only mode with "Request Unlock" button |

### 7.7 Email Notifications

Workflow transitions trigger configurable email notifications. Based on the existing Sitecore Fras Workflow, the following default notifications are required:

| Transition | Recipient | Subject Template | Notes |
|------------|-----------|-----------------|-------|
| **Submit for Review** | Editors / communications team | "For Review: {frasIdNumber} - {title}" | Default `to`: configurable (Sitecore used `communications@frascanada.ca`) |
| **Submit for Review (CC)** | Translation team | "FYI - Content submitted: {frasIdNumber} - {title}" | Default `to`: configurable (Sitecore used `webtranslation@cpacanada.ca`) |
| **Reject** | Original author | "Revision Required: {frasIdNumber} - {title}" | Body includes the mandatory rejection comment from Section 7.3 |
| **Publish** | Translation team | "Published: {frasIdNumber} - {title}" | Notification that content is live; translation team can schedule FR update |

#### Email Template Configuration

Each notification is a configurable **Email Template** record in Payload admin settings (`/admin/settings/email-templates`):

| Field | Type | Description |
|-------|------|-------------|
| **name** | text | Internal label (e.g., "Submit for Review - Editors") |
| **trigger** | select | Workflow transition that fires this email (`submit`, `reject`, `approve`, `publish`) |
| **from** | email | Sender address (default: `noreply@frascanada.ca`) |
| **to** | email[] | Recipient addresses -- configurable per template, not hardcoded |
| **cc** | email[] | Optional CC addresses |
| **subject** | text | Subject line template. Supports `{title}`, `{frasIdNumber}`, `{author}`, `{board}` tokens. |
| **body** | rich text | Body template. Same tokens plus `{rejectionComment}`, `{pageUrl}`, `{adminUrl}`. |
| **enabled** | boolean | Toggle to disable without deleting |

> **Implementation note:** Email addresses MUST be configurable in Payload admin settings -- never hardcoded. The Sitecore addresses above are defaults only. Use Payload's email adapter (Nodemailer) for delivery.

---

## 8. Workbox (`/admin/workbox`)

Dedicated workflow management dashboard (modeled after Sitecore's Workbox).

### 8.1 Layout

```
+-------------------------------------------------------+
|  WORKBOX                          [Refresh] [Filters]  |
+-------------------------------------------------------+
|                                                         |
|  [All] [In Review (5)] [Needs Revision (2)]            |
|  [Approved (3)] [Scheduled (1)]                        |
|                                                         |
|  +---------------------------------------------------+ |
|  | IN REVIEW                                     (5) | |
|  +---------------------------------------------------+ |
|  |  ! AcSB Board Update       Author: J.Smith  2h    | |
|  |    [Preview] [Approve] [Reject]                    | |
|  |                                                    | |
|  |  ! IFRS S1 Project Page    Author: M.Chen   5h    | |
|  |    [Preview] [Approve] [Reject]                    | |
|  |                                                    | |
|  |  ! March Newsletter        Author: K.Lee    1d    | |
|  |    [Preview] [Approve] [Reject]                    | |
|  +---------------------------------------------------+ |
|                                                         |
|  +---------------------------------------------------+ |
|  | NEEDS REVISION                                (2) | |
|  +---------------------------------------------------+ |
|  |  ! FAQ Page                 Rejected by: P.Roy     | |
|  |    "Missing citations..."                          | |
|  |    [Open] [View History]                           | |
|  +---------------------------------------------------+ |
|                                                         |
|  +---------------------------------------------------+ |
|  | APPROVED (ready to publish)                   (3) | |
|  +---------------------------------------------------+ |
|  |  ! Contact Page Update     Approved by: P.Roy     | |
|  |    [Preview] [Publish Now] [Schedule]              | |
|  +---------------------------------------------------+ |
+-------------------------------------------------------+
```

### 8.2 Features

- Tab filters by workflow state
- Badge counts per state
- Inline actions (approve, reject, publish) without leaving workbox
- Preview button opens frontend preview in new tab
- View History shows full workflow timeline for an item
- Filterable by: board, content type, author, date range
- Sortable by: date submitted, author, type

---

## 9. Media Library (`/admin/media`)

Folder-based media browser with Sitecore-style organization.

### 9.1 Layout

```
+------- FOLDERS -------+---------- MEDIA GRID ----------+
|                        |                                 |
|  [Search...]           |  [Search...] [Filter: All v]   |
|                        |  [Upload] [New Folder]         |
|  Media Library         |                                 |
|  +-- Images            |  Showing: Images/Boards/AcSB   |
|  |   +-- Boards        |  12 items                      |
|  |   |   +-- AcSB      |                                |
|  |   |   +-- PSAB      |  +------+ +------+ +------+   |
|  |   +-- News          |  | [img] | | [img] | | [img] | |
|  |   +-- Heroes        |  | hero  | | logo  | | photo| |
|  +-- Documents         |  | 1.2MB | | 45KB  | | 800KB| |
|  |   +-- PDFs          |  +------+ +------+ +------+   |
|  |   +-- Reports       |                                |
|  +-- Logos             |  +------+ +------+ +------+   |
|  +-- Videos            |  | [img] | | [img] | | [img] | |
|                        |  | chart | | team  | | event| |
+------------------------+---------------------------------+
```

### 9.2 Features

| Feature | Description |
|---------|-------------|
| **Folder tree** | Left panel hierarchy. Create, rename, delete folders. Drag media between folders. |
| **Grid/List toggle** | Thumbnail grid (default) or detail list view |
| **Upload** | Drag-and-drop onto grid area, or click Upload button. Bulk upload supported. |
| **Search** | Full-text search across filename, alt text, title, description |
| **Filters** | File type (Image, Document, Video, Audio), date uploaded, file size, dimensions |
| **Media detail panel** | Click item to open detail: preview, metadata (alt text, title, description, dimensions, file size, uploaded by, date), usage list (which pages reference this media) |
| **Image editing** | Basic crop and resize within the admin (Payload's built-in image manipulation) |
| **Bulk operations** | Multi-select with checkboxes. Bulk move, bulk delete, bulk download. |
| **Accepted types** | Images: jpg, png, webp, svg, gif. Docs: pdf, docx, xlsx, pptx. Video: mp4, webm. |

#### Per-Locale Metadata (WCAG 2.2 AA)

Media items store a **single file blob** but support **per-locale text fields** for bilingual compliance. This matches the Sitecore media library pattern (separate alt text per language, shared binary).

| Field | Localized? | Description |
|-------|-----------|-------------|
| **alt** | Yes (EN/FR) | Alt text for screen readers. Required for images (WCAG 2.2 AA 1.1.1). |
| **title** | Yes (EN/FR) | Display title / tooltip text. |
| **description** | Yes (EN/FR) | Extended description for media detail panel and search indexing. |
| **filename** | No | Original uploaded filename. Shared across locales. |
| **mimeType** | No | Auto-detected file type. |

> **Implementation note:** Leverage Payload's built-in field-level localization (`localized: true`) on the `alt`, `title`, and `description` fields of the `media` collection. The language switcher in the media detail panel toggles between EN/FR metadata while displaying the same file preview.

### 9.3 Media Picker Integration

When a field or component needs an image/file:
1. Opens media browser as a modal overlay
2. Editor browses folders, searches, or uploads new
3. Selects media item -> returns to field/component with reference
4. Shows thumbnail preview in the field

---

## 10. Admin Navigation

### 10.1 Sidebar Navigation

```
+---------------------------+
|  FRAS Canada CMS          |
|  [logo]                   |
+---------------------------+
|                           |
|  Dashboard                |
|  Content Tree             |
|  Workbox            (5)   |
|                           |
|  --- COLLECTIONS ---      |
|  Boards                   |
|  Projects                 |
|  Consultations            |
|  News                     |
|  Events                   |
|  Documents                |
|  Contacts                 |
|  Standards                |
|  Members                  |
|  Pages                    |
|                           |
|  --- TOOLS ---            |
|  Media Library            |
|  Search Config            |
|                           |
|  --- SYSTEM ---           |
|  Globals                  |
|  Users          (Admin)   |
|  Settings       (Admin)   |
|                           |
+---------------------------+
```

### 10.2 Navigation Behavior

- Sidebar is persistent (always visible on desktop)
- Collapsible to icons on smaller screens
- Workbox badge shows total items awaiting action
- Collection links go to Payload's OOTB list views
- Content Tree, Workbox, Media Library go to custom views
- Admin-only links hidden for Author/Editor roles

---

## 11. Technical Architecture

### 11.1 Custom Payload Admin Views

| Route | Component | Type |
|-------|-----------|------|
| `/admin` | `Dashboard` | Custom view (replaces default) |
| `/admin/tree` | `ContentTree` | Custom view |
| `/admin/builder/:id` | `PageBuilder` | Custom view |
| `/admin/workbox` | `Workbox` | Custom view |
| `/admin/media` | `MediaLibrary` | Custom view |
| `/admin/collections/*` | Payload default | OOTB |
| `/admin/globals/*` | Payload default | OOTB |

### 11.2 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@dnd-kit/core` + `@dnd-kit/sortable` | Drag-and-drop for tree and page builder |
| `react-arborist` or custom | Virtualized tree component |
| `@payloadcms/richtext-lexical` | Rich text editing (Payload's default) |
| `iframe-resizer` or `postMessage` | Page builder canvas communication |
| `date-fns` | Date formatting for workflow timestamps |
| `cmdk` or custom | Command palette for quick navigation |

### 11.3 Data Model Additions

New fields/collections needed beyond existing build plan:

#### `pages` collection (enhanced)
```typescript
{
  // Existing fields from BUILD_PLAN...
  layout: {
    type: 'json',  // Page builder zone/component JSON
  },
  template: {
    type: 'select',
    options: ['homepage', 'board-detail', 'project-detail', 'active-projects',
              'open-consultations', 'search-results', 'content-page', 'flexible-page'],
  },
  parent: {
    type: 'relationship',
    relationTo: 'pages',  // Self-referential for tree hierarchy
  },
  sortOrder: {
    type: 'number',  // For manual ordering in tree
  },
  lockedBy: {
    type: 'relationship',
    relationTo: 'users',
  },
  lockedAt: {
    type: 'date',
  },
  workflowState: {
    type: 'select',
    options: ['draft', 'in_review', 'needs_revision', 'approved', 'published', 'unpublished'],
    defaultValue: 'draft',
  },
  workflowHistory: {
    type: 'array',
    fields: [
      { name: 'from', type: 'text' },
      { name: 'to', type: 'text' },
      { name: 'user', type: 'relationship', relationTo: 'users' },
      { name: 'date', type: 'date' },
      { name: 'comment', type: 'textarea' },
    ],
  },
  publishOn: { type: 'date' },
  unpublishOn: { type: 'date' },
}
```

#### Component Registry (code-level, not CMS)
```typescript
// Each component type registers:
{
  type: 'card-grid',
  label: 'Card Grid',
  category: 'layout',
  icon: CardGridIcon,
  thumbnail: '/admin/components/card-grid-thumb.png',
  allowedZones: ['main', 'sidebar', 'full-body'],  // Which placeholder zones accept this
  propsSchema: {
    columns: { type: 'select', options: [2, 3, 4], default: 3 },
    style: { type: 'select', options: ['default', 'bordered', 'shadowed'] },
    items: { type: 'array', fields: [...] },
  },
  render: CardGridComponent,
}
```

### 11.4 Payload Configuration

```
src/
  admin/
    views/
      Dashboard.tsx        -- Custom dashboard
      ContentTree.tsx      -- Unified tree view
      PageBuilder.tsx      -- Visual page builder
      Workbox.tsx          -- Workflow management
      MediaLibrary.tsx     -- Folder-based media browser
    components/
      TreeNode.tsx         -- Individual tree item
      TreeContextMenu.tsx  -- Right-click menu
      ComponentToolbox.tsx -- Draggable component palette
      PlaceholderZone.tsx  -- Droppable zone on canvas
      ComponentChrome.tsx  -- Hover overlay with actions
      PropsDrawer.tsx      -- Slide-out configuration panel
      WorkflowActions.tsx  -- Approve/reject/publish buttons
      LanguageSwitcher.tsx -- EN/FR toggle
      LockIndicator.tsx    -- Lock state display
      GutterIcons.tsx      -- Tree gutter workflow indicators
    hooks/
      useTreeData.ts       -- Fetch and manage tree hierarchy
      usePageLayout.ts     -- Manage page builder state
      useWorkflow.ts       -- Workflow transition logic
      useLocking.ts        -- Lock/unlock logic
      useMediaFolders.ts   -- Media folder navigation
  components/
    registry.ts            -- Component type registry
    schemas/               -- Props schemas per component type
```

### 11.5 Performance Considerations

| Concern | Mitigation |
|---------|-----------|
| Tree with 1000+ items | Virtualized rendering, lazy-load children on expand |
| Page builder iframe | Loaded once, updates via postMessage (no full reload) |
| Media library thumbnails | Lazy-loaded, Payload's image resize for thumbnails |
| Workflow queries | Database indexes on `workflowState`, `lockedBy`, `publishOn` |
| Concurrent editing | Optimistic locking with conflict detection, auto-unlock after timeout |

---

## 12. Sitecore Parity Checklist

> **Reference:** Sitecore dump analysis reports available at `.ai-reports/sitecore-dump/` -- 6 reports covering templates (92), renderings (56), workflows (3), content tree (~1,400 items), media library (~1,112 items), and site architecture. These reports informed the parity decisions below.

Features explicitly replicated from Sitecore 10.2 XM/SXA:

| Sitecore Feature | FRAS Admin Equivalent | Status |
|------------------|----------------------|--------|
| Content tree hierarchy | Unified content tree | Planned |
| Right-click context menu (Insert, Copy, Move, Delete, Rename) | Full context menu | Planned |
| Content Editor field sections | Collapsible field groups | Planned |
| Field validation indicators | Payload validation + custom errors | Planned |
| Language versioning + switcher | EN/FR language switcher | Planned |
| Workflow states in tree gutter | Colored dot gutter indicators | Planned |
| Lock/Edit mechanism | Auto-lock + manual lock/unlock | Planned |
| Experience Editor visual editing | Page Builder with canvas iframe | Planned |
| SXA Toolbox drag-and-drop | Component toolbox + drag-to-zone | Planned |
| Placeholder zones (locked/editable) | Template-defined zones | Planned |
| Component properties dialog | Slide-out props drawer | Planned |
| SXA Page Designs | Page templates with zone definitions | Planned |
| Device preview (desktop/tablet/mobile) | Responsive breakpoint toggle | Planned |
| Media Library folder browser | Custom media library view | Planned |
| Workbox workflow dashboard | Custom workbox view | Planned |
| Insert Options (valid child types) | Dynamic insert menu filtering | Planned |
| Publishing restrictions (date range) | publishOn / unpublishOn fields | Planned |
| Favorites/Recent items | Dashboard recent items widget | Planned |
| Preview before publish | Frontend preview in new tab | Planned |
| Ribbon toolbar (Save, Publish, etc.) | Action bar in field editor + builder toolbar | Planned |

### Intentionally NOT Replicated

| Sitecore Feature | Reason |
|------------------|--------|
| Personalization/A-B testing in editor | Out of scope -- handled at CDN/edge layer if needed later |
| Rendering Variants | Replaced by component props (style variants as a prop) |
| Creative Exchange (ZIP export) | Not relevant in modern stack |
| Template inheritance | Payload's collection system handles this differently |
| Raw Values view | Not needed -- all values are human-readable in Payload |
| Dual-database publishing (web/master) | Single database with `_status` field (draft/published) |
| Item Buckets | Replaced by collection list views with search/filter |
| PowerShell Extensions | Replaced by Payload's API + admin scripts |

---

## 13. Phasing Recommendation

### Phase 1A: Foundation (build alongside existing Phase 1)
- Custom dashboard with all 4 widgets
- Language switcher in field editor
- Workflow system (5 states + transitions + history)
- Item locking
- Custom sidebar navigation

### Phase 1B: Content Tree
- Unified tree view with hierarchy
- Expand/collapse, lazy loading
- Right-click context menu (Insert, Delete, Rename, Duplicate)
- Gutter indicators (workflow state, lock, language)
- Tree search
- Drag-and-drop reorder/move

### Phase 1C: Media Library
- Folder-based browser
- Upload, search, filter
- Grid/list view toggle
- Media picker modal for field/component integration
- Bulk operations

### Phase 2A: Page Builder
- Template system (zone definitions)
- Component toolbox (all 4 categories)
- Drag-and-drop from toolbox to canvas
- Component chrome (hover toolbar)
- Props drawer (slide-out configuration)
- Component reordering within zones
- Canvas iframe with postMessage communication

### Phase 2B: Page Builder Polish
- Responsive preview (desktop/tablet/mobile)
- Undo/redo
- Copy/paste components
- Component duplication
- Save/load page layouts as template presets

### Phase 3: Workbox + Advanced Workflow
- Workbox dashboard view
- Inline approve/reject actions
- Rejection comments with banner display
- Scheduled publishing (cron)
- Publishing history timeline
- Bulk workflow actions

---

## 14. Resolved Questions

All 7 open questions resolved via stakeholder Q&A (2026-03-05):

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | **Board scoping model** | **Tree-based scoping** -- board IS the tree location. Content lives under its board's subtree. Moving in tree changes board association. | Matches Sitecore mental model. Board field auto-derived from tree position. |
| 2 | **Component versioning** | **Page-level drafts** -- editing any component creates a new draft version of the entire page. Published version stays live until new version is approved + published. | Simpler model, matches Payload's built-in versioning. No per-component draft state. |
| 3 | **Media folder permissions** | **No folder scoping** -- all editors can access all media folders. Relies on convention, not enforcement. | Small team (5-15). Over-engineering permissions for a team this size adds complexity without value. |
| 4 | **Tree depth limit** | **5 levels max** -- Root > Section > Subsection > Page > Subpage. Handles board structures and committee hierarchies. | Balances flexibility with navigability. Enforced in Insert Options (level 5 items can't have children). |
| 5 | **Conflict resolution** | **Last write wins** with warning banner. If item was modified since you loaded it, warning shows "Modified by [Name] at [Time]" with [Save Anyway] and [Reload First] options. | Simple, predictable. No merge UI complexity. Warning prevents accidental overwrites. |
| 6 | **Component library governance** | **Code-only** -- new component types require a developer to register them in the component registry. Admins cannot create custom component types in the CMS. | Prevents broken pages from bad component configs. Toolbox is curated, not user-extensible. |
| 7 | **Audit trail** | **Version diffs only** -- no explicit field-level change log. Each save creates a version; editors can compare any two versions to see what changed. Payload supports version comparison OOTB. | Leverages Payload's built-in versioning. Avoids custom audit storage overhead. Workflow transitions still logged explicitly. |
