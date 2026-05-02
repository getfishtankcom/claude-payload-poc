# Ralph Loop Prompt — Layer 2: Admin Quick Wins

## Your Mission

Build 6 self-contained admin panel improvements. These are independent features — they can be parallelized across worktrees, but they each follow the same full-quality bar: unit tests, Storybook story, and Playwright E2E. Work through them sequentially if running in a single session, or assign one feature per worktree if parallelizing.

**Estimated tasks:** 6 (2.1–2.6)
**Stop condition:** `<promise>LAYER 2 COMPLETE</promise>`
**Gate required:** No

---

## Context Files (READ THESE FIRST, IN ORDER)

1. `CLAUDE.md` — project rules, Payload skill priority, Ralph loop workflow
2. `.ai-reports/MASTER_TODO.md` — find the "Layer 2" section; read every task entry
3. `.ai-reports/PRD-admin-panel.md` — Sections 3 (Dashboard), 4 (Content Tree), 8 (Workbox), 10 (Navigation)
4. `src/admin/views/WorkboxClient.tsx` — Workbox implementation context
5. `src/admin/components/builder/registry.ts` — component registry (for insert options task)

---

## Skills to Invoke

- `payload-super` — before task 2.5 (insert options enforcement uses Payload hooks/config)
- `/ui` — for any component styling questions
- `accessibility` — before task 2.4 (command palette must meet WCAG 2.2 AA focus management)
- `motion` — for task 2.4 animation (command palette open/close transitions)

---

## Key Context

### Parallelization Note
Tasks 2.1–2.6 are independent. If running with git worktrees, assign one task per worktree. Each builds to a different file area:
- 2.1: `WorkboxClient.tsx` + new board filter UI
- 2.2: Admin edit view + translation gutter icon
- 2.3: localStorage favorites + nav section
- 2.4: Global command palette (new file)
- 2.5: Registry + Payload insert options config
- 2.6: New redirect manager view

### Per-Feature Quality Bar
Every task in this layer requires:
1. The feature working end-to-end in the browser
2. At least 2 unit tests (Vitest)
3. 1 Storybook story
4. 1 Playwright E2E test (happy path + one negative case)
5. `npx tsc --noEmit` passing

---

## Tasks

### 2.1 Board filter in Workbox
**What:** Add a Board filter to the Workbox dashboard so editors can narrow workflow items to a single board.

**Spec:**
- A "Board" dropdown filter above the items list in `/admin/workbox`
- Options: "All Boards" + one entry per board (fetched from `boards` collection)
- When a board is selected, the item list filters to show only items whose `board` relationship matches
- The filter value is reflected in the URL query param: `?board=acsb`
- Filter persists when switching between state tabs (In Review / Needs Revision / etc.)
- Combine with existing author/date filters (AND logic)
- The filter dropdown is accessible: keyboard navigable, role="combobox" or role="listbox"
- `data-testid="workbox-board-filter"` on the select element

**Files to modify:**
- `src/admin/views/WorkboxClient.tsx` — add filter state + URL param sync
- New component: `src/admin/components/WorkboxBoardFilter.tsx`

**Unit tests (`WorkboxBoardFilter.test.tsx`):**
- Renders "All Boards" by default
- Selecting a board updates the URL param

**Storybook story:** `WorkboxBoardFilter.stories.tsx` with Default + WithBoardSelected

**Playwright E2E (`e2e/workbox-board-filter.spec.ts`):**
- Navigate to Workbox → select "AcSB" → verify items list is filtered
- Select "All Boards" → verify full list returns

---

### 2.2 FR translation gutter icon
**What:** Add a language warning indicator in the Content Tree gutter next to any item that has no French translation yet.

**Spec:**
- In the Content Tree (right of the lock icon and workflow dot in the gutter), show a small `!FR` pill or flag icon when:
  - The item has `locale: 'en'` content BUT no corresponding `locale: 'fr'` version
  - Determine this by checking: does the item's localized title field have a non-null FR value?
- Tooltip on hover: "French translation missing"
- Icon: a yellow triangle with exclamation (warning), or a two-letter `FR` badge with orange background
- Clicking the icon navigates to the FR version of the item in the field editor (with `?locale=fr` param)
- The icon must NOT appear for items where FR translation exists
- `data-testid="fr-warning-icon"` on the indicator

**Files to modify:**
- `src/admin/components/TreeNode.tsx` (or wherever tree node gutter is rendered)
- The icon needs locale data — pass `hasFrTranslation: boolean` as a prop from the tree data

**Implementation notes:**
- When building the tree data in `useTreeData.ts`, add a `hasFrTranslation` field
- Use the Payload Local API or REST API to check the FR locale: `GET /api/collection/id?locale=fr` — if `title` is null/empty, it's untranslated
- Performance: batch-check translations when the tree loads a folder; don't check one-by-one on render

**Unit tests (`TreeNode.test.tsx`):**
- Shows FR warning when `hasFrTranslation === false`
- Does NOT show FR warning when `hasFrTranslation === true`

**Storybook story:** `TreeNode.stories.tsx` — add a `MissingFrTranslation` story

**Playwright E2E:**
- Navigate to Content Tree → verify an untranslated item shows the FR warning icon
- Click the icon → verify navigation to FR locale edit view

---

### 2.3 Favorites / bookmarks
**What:** Let editors bookmark frequently-used content items for quick access. Favorites are stored in localStorage per-user.

**Spec:**
- A star (☆) icon appears on each item row in the Content Tree
- Clicking the star toggles the item as a favorite (filled star = favorited)
- A "Favorites" section appears at the top of the sidebar navigation (below Dashboard, above Content Tree)
- The Favorites section shows up to 10 starred items with their title and type icon
- Each favorite item is clickable → opens the item in the field editor
- Favorites persist in localStorage using the key `ras-favorites-{userId}` (include user ID to avoid cross-user contamination on shared browsers)
- If an item is deleted in Payload, it should be removed from favorites gracefully (404 on load = remove from list)
- The nav section shows "Favorites (0)" when empty with a subtitle "Star items in the tree to bookmark them"
- Maximum 20 favorites (once limit reached, oldest is bumped when a new one is added)
- `data-testid="favorite-star"` on the star icon; `data-testid="favorites-nav-section"` on the nav section

**Files to create/modify:**
- `src/admin/hooks/useFavorites.ts` — localStorage management hook
- `src/admin/components/FavoriteStar.tsx` — star toggle component
- `src/admin/components/FavoritesNavSection.tsx` — nav sidebar section
- `src/admin/components/CustomNav.tsx` — mount the new nav section

**Unit tests (`useFavorites.test.ts`):**
- `addFavorite()` stores item in localStorage
- `removeFavorite()` removes item from localStorage
- Favorite list caps at 20 items (21st bumps oldest)
- `isFavorite()` returns correct boolean

**Storybook stories:**
- `FavoriteStar.stories.tsx` — Starred + Unstarred states
- `FavoritesNavSection.stories.tsx` — Empty + WithItems (3 favorites) + AtLimit (20 items)

**Playwright E2E:**
- Star a tree item → Favorites section shows it
- Unstar → Favorites section removes it
- Reload page → favorites persist

---

### 2.4 Command palette (Cmd+K)
**What:** A global command palette that lets editors jump to any content item or perform quick actions without navigating the tree.

**Spec:**
- Triggered by `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux) from anywhere in the admin
- Full-screen dimmed overlay with centered search dialog (~600px wide)
- Search input autofocuses on open
- Shows results in real-time as the user types (debounced 200ms)
- Result types:
  - **Content items:** searched by title + slug across all major collections (pages, news, projects, events, boards). Shows: item title, collection icon, board name if applicable.
  - **Quick actions:** pre-defined list always visible (or filtered by query):
    - "New Page" → `/admin/collections/pages/create`
    - "New News Article" → `/admin/collections/news/create`
    - "New Project" → `/admin/collections/projects/create`
    - "Open Workbox" → `/admin/workbox`
    - "Open Media Library" → `/admin/media`
- Recent items section (last 5 items opened by this user, from localStorage) shown when query is empty
- Keyboard navigation: arrow keys move through results, Enter selects, Escape closes
- Selecting a content item opens it in the field editor (navigate to `/admin/collections/{collection}/{id}`)
- Selecting a quick action navigates to the target route
- Close on Escape, on overlay click, or after navigation
- Focus must return to the previously focused element when closed (WCAG 2.2 AA 2.4.3)
- `data-testid="command-palette"`, `data-testid="command-palette-input"`, `data-testid="command-palette-results"`

**Animation (use `motion` skill for this):**
- Dialog slides in from top + fades in (spring animation, ~150ms)
- Overlay fades in (opacity 0→1, 100ms)
- Closing: reverse of opening

**Implementation notes:**
- Use `cmdk` package (`npm install cmdk`) for the accessible command palette primitive
- Search API: `GET /api/pages?where[title][like]={query}&limit=5` etc. — fan out to multiple collections in parallel with `Promise.all`
- Register the keyboard shortcut at admin root level with `useEffect` on `keydown`
- Do NOT block shortcuts when an input is focused elsewhere (check `e.target.tagName !== 'INPUT'`)

**Files to create:**
- `src/admin/components/CommandPalette.tsx`
- `src/admin/hooks/useCommandPalette.ts` — open/close state, keyboard shortcut registration

**Unit tests (`CommandPalette.test.tsx`):**
- Renders when `isOpen === true`
- Does not render when `isOpen === false`
- Pressing Escape calls `onClose`

**Storybook story:** `CommandPalette.stories.tsx` — Open with results + Open empty + Open with recent items

**Playwright E2E:**
- Press Cmd+K → palette opens with focus on input
- Type "Board" → results appear
- Press Escape → palette closes
- Click result → navigates to correct admin URL

---

### 2.5 Insert options enforcement
**What:** Enforce the parent→allowed-children insert option rules from PRD Section 4.4. The Content Tree's right-click "Insert" submenu should dynamically filter to only show valid child types for the selected parent.

**Spec (insert option rules from PRD Section 4.4):**

| Parent Type | Allowed Children |
|-------------|-----------------|
| Root (RAS Canada) | Page, Folder |
| Boards folder | Board Detail Page |
| Board Detail Page | Page (sub-pages) |
| Projects folder | Project |
| News folder | News Article |
| Events folder | Event |
| Documents folder | Document |
| Consultations folder | Consultation / Document for Comment |
| Settings | Global config items |
| Data folder | Contacts, Standards, Decision Summaries |
| Page | Page (unlimited nesting) |

**Implementation:**
- Create `src/admin/lib/insert-options.ts` — a map of `parentType → allowedChildTypes[]`
- In `TreeContextMenu.tsx`, when building the "Insert" submenu, call `getInsertOptions(parentNode.type)` and render only the allowed child types
- If `getInsertOptions()` returns empty array, hide the "Insert >" menu item entirely
- Tree depth limit: 5 levels max — at depth 5, the Insert menu is always hidden
- `data-testid="insert-menu"` on the Insert submenu; `data-testid="insert-option-{type}"` on each option

**Files to create/modify:**
- `src/admin/lib/insert-options.ts` — insert options map + helper function
- `src/admin/components/TreeContextMenu.tsx` — filter insert submenu

**Unit tests (`insert-options.test.ts`):**
- `getInsertOptions('boards-folder')` returns `['board-detail-page']`
- `getInsertOptions('page')` returns `['page']`
- `getInsertOptions('unknown')` returns `[]`
- `isAllowedChild('root', 'page')` returns `true`
- `isAllowedChild('root', 'news-article')` returns `false`

**Storybook story:** `TreeContextMenu.stories.tsx` — add `InsideNewsFolder` + `AtMaxDepth` stories

**Playwright E2E:**
- Right-click a News folder node → Insert submenu shows only "News Article"
- Right-click root node → Insert submenu shows "Page" and "Folder"

---

### 2.6 Redirect manager view
**What:** A basic admin view for managing URL redirects — from old Sitecore URLs to new RAS Canada URLs. Essential for the content migration phase.

**Spec:**
- Route: `/admin/redirects` — custom Payload admin view
- A Payload collection `redirects` must be created with fields:
  ```typescript
  {
    from: { type: 'text', required: true, unique: true, label: 'Old URL (e.g. /frascanada/boards/acsb)' },
    to: { type: 'text', required: true, label: 'New URL (e.g. /boards/acsb)' },
    type: { type: 'select', options: ['301', '302'], default: '301', label: 'Redirect type' },
    enabled: { type: 'checkbox', default: true },
    note: { type: 'textarea', label: 'Internal note (optional)' },
  }
  ```
- The custom view at `/admin/redirects` shows a table of all redirect records with columns: From, To, Type, Enabled, Note, Actions
- Table includes: search bar (filters by From URL), pagination (50 per page), "Add Redirect" button
- Clicking a row opens the Payload edit view for that redirect record
- "Add Redirect" links to `/admin/collections/redirects/create`
- Bulk import: a "Import CSV" button opens a modal allowing paste/upload of CSV in format `from,to,type` — imports all valid rows, shows count of imported/skipped
- The Next.js `middleware.ts` (or `next.config.ts` redirects array) should be wired to read from this collection at build time or via a cached fetch — document this in a code comment even if not fully implemented yet
- `data-testid="redirects-view"`, `data-testid="redirects-table"`, `data-testid="add-redirect"`, `data-testid="import-csv"`

**Files to create:**
- `src/collections/Redirects.ts` — Payload collection definition
- `src/admin/views/Redirects.tsx` + `src/admin/views/RedirectsClient.tsx` — custom view
- Register collection in `payload.config.ts`
- Add "Redirects" link to admin sidebar (in `CustomNav.tsx` under the Tools section)

**Unit tests (`RedirectsClient.test.tsx`):**
- Renders a table with headers: From, To, Type, Enabled
- Search input filters rows (mock data)

**Storybook story:** `RedirectsClient.stories.tsx` — Empty + WithRecords (5 redirects) + SearchFiltered

**Playwright E2E:**
- Navigate to `/admin/redirects` → table renders
- Search for a URL → table filters
- Click "Add Redirect" → navigates to create form

---

## Validation Gates (Layer 2 is complete when ALL of these pass)

```bash
# Per-feature checks (run after each feature):
npx tsc --noEmit
npx vitest run
npx storybook build --quiet

# Full suite:
npm run build
npx playwright test --grep "workbox-board-filter|fr-warning|favorites|command-palette|insert-options|redirects"
```

---

## Workflow

1. Read MASTER_TODO.md → find the "Layer 2" section → read all task entries
2. If Layer 2 section doesn't exist yet, ADD IT with tasks 2.1–2.6 as `[ ]` items
3. Work through tasks sequentially (or in parallel worktrees if instructed)
4. Each task: mark `[~]`, build, test, story, E2E, `[x]`, commit

---

## Stop Condition

When ALL 6 tasks are `[x]` AND all validation gates pass:

1. Update `.ai-reports/AUDIT_LOG.md` (date, Type: BUILD, Layer 2, tasks, files, deviations)
2. Create summary commit: `feat(layer-2): admin quick wins — all tasks complete`
3. Output EXACTLY:
```
<promise>LAYER 2 COMPLETE</promise>
```

---

## EXIT PROTOCOL (MANDATORY)

### Per-Task Completion
A task is DONE when ALL of these pass:
1. Feature works end-to-end in browser
2. At least 2 unit tests pass (`npx vitest run`)
3. 1 Storybook story compiles (`npx storybook build --quiet`)
4. 1 Playwright E2E test passes
5. `npx tsc --noEmit` passes
6. Task updated to `[x]` in MASTER_TODO.md
7. Git commit created: `feat(layer-2): task 2.N — [short description]`

### Per-Task Failure (3-strike rule)
1. First attempt: diagnose, fix, re-validate
2. Second attempt: alternative approach, re-validate
3. Third attempt: mark `[!]` with reason, next task

### HARD STOPS
Output `<promise>LAYER 2 ABORTED: [reason]</promise>` if:
- Dev server won't start after 3 fix attempts
- Unresolvable dependency conflict
- More than 5 structural TypeScript errors
- Playwright environment broken after 3 fix attempts

### What NOT To Do
- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT skip tests — each task requires unit tests + Playwright E2E
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push`
