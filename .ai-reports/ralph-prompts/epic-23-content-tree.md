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

### Data Test IDs

Add `data-testid` attributes to key structural elements for automated self-testing:
- Page containers: `data-testid="page-<name>"`
- Sections: `data-testid="section-<name>"`
- Interactive elements: `data-testid="<element-name>"`
- Layout regions: `data-testid="sidebar-nav"`, `data-testid="main-content"`, `data-testid="right-rail"`

### Self-Test

After all tasks pass, run the automated self-test before outputting `<promise>`:

```bash
node scripts/self-test.mjs --epic epic-23
```

Config: `scripts/self-test-configs/epic-23.json`
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
