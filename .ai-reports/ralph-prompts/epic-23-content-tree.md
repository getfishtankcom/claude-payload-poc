# Ralph Loop Prompt — Epic 23: Content Tree

## Your Mission

Build the Sitecore-style unified content tree view for the admin panel. This is the primary navigation surface — a hierarchical tree showing all content (pages, data, media, settings) with right-click context menu, drag-and-drop, gutter indicators, and search.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 23 tasks
3. `.ai-reports/PRD-admin-panel.md` — Sections 4 (Content Tree) + 11 (Technical Architecture)
4. `.ai-reports/research-sitecore-admin-interface.md` — Section 1 (Content Tree)
5. `.ai-reports/BUILD_PLAN.md` — existing collections for tree population

## Key Decisions (from PRD Section 14)

- **Tree model:** Sitecore-style unified hierarchy — pages, data, media, settings all in one tree
- **Board scoping:** Tree-based — content lives under its board's subtree. Moving in tree changes board.
- **Depth limit:** 5 levels max (Root > Section > Subsection > Page > Subpage)
- **Insert Options:** Each content type defines valid child types (enforced in context menu)

## Tasks

### 23.1 Tree data model + API
- Add `parent` (self-referential relationship) and `sortOrder` (number) fields to `pages` collection
- Create a Payload custom endpoint `GET /api/tree` that returns the full tree hierarchy as nested JSON
- Endpoint supports `?parentId=X` for lazy-loading children of a specific node
- Include item metadata in response: id, title, type, workflowState, lockedBy, hasChildren, locale status (has EN, has FR)
- Index on `parent` field for fast tree queries
- Seed data: create the base tree structure (FRAS Canada root > Boards > [AcSB, PSAB, CSSB, AASB, RASOC] > sub-pages, Projects folder, News folder, etc.)
- **Output:** API returns tree data, seed data creates initial hierarchy

### 23.2 Tree view component (`/admin/tree`)
- Custom Payload admin view at route `/admin/tree`
- Left panel: tree component with expand/collapse, item selection
- Right panel: Payload's edit view for the selected item (embed or navigate)
- Use `react-arborist` (or `@dnd-kit/core` with custom tree) for virtualized rendering
- Tree state (expanded/collapsed nodes) persisted in localStorage
- Lazy-load children on expand for large folders (News, Projects — 100+ items)
- Click item to load it in right panel
- **Output:** Tree renders with full hierarchy, items open in editor

### 23.3 Tree icons + gutter indicators
- Type-specific icons per item (PRD Section 4.2):
  - Page: document icon
  - Folder: folder icon
  - News article: newspaper icon
  - Project: clipboard icon
  - Event: calendar icon
  - Document: file icon
  - Media: image icon
  - Settings: gear icon
- Gutter indicators (narrow left column, PRD Section 4.2):
  - Workflow state: colored dot (gray=draft, blue=review, yellow=revision, green=approved, purple=published)
  - Lock: lock icon when locked by another user
  - Language: warning icon when missing FR version
- Icons from Heroicons (`@heroicons/react`)
- **Output:** Each tree item shows correct icon + gutter state

### 23.4 Right-click context menu
- Custom context menu component (PRD Section 4.3)
- Positioned at cursor on right-click
- Menu items:
  - **Insert >** submenu — filtered by valid child types (PRD Section 4.4 insert options table)
  - **Open in Page Builder** (pages only — links to `/admin/builder/:id`)
  - **Open in New Tab**
  - Separator
  - **Copy** / **Move To...** (opens tree picker modal) / **Duplicate** / **Rename**
  - Separator
  - **Lock / Unlock**
  - Separator
  - **Delete** (with confirmation dialog)
- Insert menu dynamically filtered: e.g., under Boards folder, only "Board Detail Page" appears
- Depth limit enforced: items at level 5 show no Insert option
- Role-based: Authors can't delete published items, can't see admin-only actions
- Close on Escape or click-outside
- **Output:** Right-click menu works with all actions, insert options filtered correctly

### 23.5 Drag-and-drop reorder + move
- Drag items to reorder within same parent (updates `sortOrder`)
- Drag items to a different parent to move (updates `parent` relationship)
- Drop target highlighting: blue outline on valid drop targets, red on invalid
- Moving item under a Board subtree auto-updates the board relationship field
- Depth limit enforced: can't drag level-4 item into level-4 parent (would create level 5+)
- Confirmation dialog for moves: "Move [Item] to [New Parent]? This will change the board from AcSB to PSAB."
- Use `@dnd-kit/core` with tree adapter
- **Output:** Drag-and-drop moves/reorders items, database updated

### 23.6 Tree search
- Search bar at top of tree panel
- Client-side filter for expanded/visible nodes (instant, as-you-type)
- Server-side API search for deep search (searches all items, not just expanded): `GET /api/tree/search?q=...`
- Search matches on: title, slug
- Results highlight matching items in tree, auto-expand parents to show matches
- Clear search button returns to normal tree view
- **Output:** Search filters tree in real-time, deep search finds buried items

## Validation

```bash
npx tsc --noEmit  # TypeScript clean
npm run dev  # Tree view loads without errors
```

Per task:
- 23.1: `/api/tree` returns nested JSON, lazy-load works with `?parentId=X`
- 23.2: Tree renders at `/admin/tree`, items expand/collapse, selection loads editor
- 23.3: Icons match item types, gutter dots show correct workflow colors
- 23.4: Right-click menu appears, Insert shows only valid children, Delete confirms
- 23.5: Drag item from AcSB to PSAB — parent updates, board field updates, sort order updates
- 23.6: Type "IFRS" in search — matching items highlighted, parents auto-expanded

## Workflow

1. Read MASTER_TODO.md -> find first `[ ]` task in Epic 23
2. Mark `[~]`, build it, validate, mark `[x]`
3. When ALL tasks are `[x]`: update AUDIT_LOG.md, then output:

```
<promise>EPIC 23 COMPLETE</promise>
```

## IMPORTANT

- Performance is critical — tree may have 1000+ items. Use virtualization (react-arborist or @dnd-kit with virtual list)
- Lazy-load children for folders with 50+ items
- Context menu is a custom React component — NOT the browser's native context menu
- All tree mutations go through Payload's REST API (PATCH for moves, POST for inserts, DELETE for deletes)
- Board relationship auto-update on move: derive board from tree ancestry, update the `board` field on the item
- Tree is an admin-only view — no frontend rendering needed
- Reference Payload 3.x custom views documentation via Context7 MCP
