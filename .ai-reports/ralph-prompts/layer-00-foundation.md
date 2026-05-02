# Ralph Loop Prompt — Layer 0: Admin Platform Foundation

## Your Mission

Harden the existing admin platform codebase before building new features. This layer covers upgrades, refactors, rename, tests, and dead-code removal. It is the prerequisite for all Layer 1–5 work. Treat every task as infrastructure — no new user-facing features, just a cleaner, faster, safer foundation.

**Estimated tasks:** 14 (0.1–0.14)
**Stop condition:** `<promise>LAYER 0 COMPLETE</promise>`
**Gate required:** Yes — human review before Layer 1 begins.

---

## Context Files (READ THESE FIRST, IN ORDER)

1. `CLAUDE.md` — project rules, Payload skill priority, Ralph loop workflow
2. `.ai-reports/MASTER_TODO.md` — find the "Layer 0" section; read every task entry before touching code
3. `.ai-reports/PRD-admin-panel.md` — full admin panel spec (architecture, roles, components)
4. `.ai-reports/BUILD_PLAN.md` — existing data model; understand what's already built

---

## Skills to Invoke (invoke before relevant tasks)

- `improve-codebase-architecture` — before tasks 0.3, 0.4, 0.5, 0.6, 0.7
- `payload-super` — before any Payload collection/hook changes (tasks 0.8, 0.9)
- `typescript-advanced-types` — before tasks 0.10, 0.11 (shared type definitions)
- `javascript-testing-patterns` — before task 0.12 (Vitest setup)
- `next-best-practices` — before tasks 0.1, 0.2 (upgrade work)

---

## Key Context

### Stack Versions (target after this layer)
- Next.js: upgrade from 15.x to **16.2.4**
- Payload CMS: upgrade from 3.79 to **3.84.1**
- TanStack Query v5 replaces raw `fetch()` in all client components

### FRAS → RAS Brand Rename
The product is being rebranded from **FRAS Canada** to **Reporting and Assurance Standards (RAS) Canada**.
- Create `src/lib/brand.ts` with exported constants (see task 0.11 details)
- Full name: `"Reporting and Assurance Standards (RAS) Canada"`
- Short name: `"RAS Canada"`
- `grep -r "FRAS Canada" src/` must return zero results after this layer

### Architecture Improvements
- `ContentTreeClient.tsx` (currently ~800+ lines) must be decomposed into smaller modules
- `MediaLibraryClient.tsx` (currently 1,866 lines) must be decomposed to ~200-line modules
- Both decompositions use the extract-as-hook + extract-as-component pattern
- TanStack Query `useQuery` / `useMutation` replace all raw `fetch()` calls

### Dead Code Removal
These files exist but are superseded by newer implementations — delete them:
- `src/admin/components/builder/PropsDrawer.tsx` (replaced by `InspectorPanel.tsx`)
- `src/admin/components/ComponentToolbox.tsx` if it exists at the root components level (superseded by builder version)

### Error Handling Standards
- All client `fetch()` calls (until replaced by TanStack Query) must show toast errors, not `console.error`
- `AbortController` must be used on all fetch calls inside `useEffect`
- Replace all `window.prompt()` / `window.confirm()` dialog calls with proper modal components

### Bug Fixes
- `WorkboxClient.tsx`: stale closure bug — the `handleAction` callback captures stale `items` state. Fix with `useCallback` + `items` in dependency array or use a ref.
- Workflow hooks: double-write bug — `afterChange` hook fires on both the initial save AND after the hook's own `payload.update()` call. Use `context` flag guard: `if (req.context.skipWorkflowHook) return`

### WCAG Level Update
All accessibility references must target **WCAG 2.2 AA** (not 2.1 AA). Update any comments, docs, or validation strings.

---

## Tasks

### 0.1 Upgrade Next.js to 16.2.4
- Run `npm install next@16.2.4`
- Fix any breaking API changes (check Next.js 16 release notes via Context7 MCP before starting)
- Verify `npm run build` exits 0
- Verify `npm run dev` starts without errors
- **Output:** `package.json` shows `"next": "16.2.4"`, build passes

### 0.2 Upgrade Payload CMS to 3.84.1
- Run `npm install payload@3.84.1 @payloadcms/next@3.84.1 @payloadcms/richtext-lexical@3.84.1 @payloadcms/db-postgres@3.84.1`
- Include all `@payloadcms/*` packages that are installed — check `package.json` for the full list
- Fix any breaking changes (use `payload-super` skill reference + Context7 MCP for migration notes)
- Run `npx payload generate:types` after upgrade
- Verify `npm run build` exits 0
- **Output:** All Payload packages at 3.84.1, types regenerated, build clean

### 0.3 Install TanStack Query + migrate ContentTreeClient
- Install: `npm install @tanstack/react-query@5`
- Wrap admin root layout (or the Payload admin shell) with `<QueryClientProvider>`
- In `ContentTreeClient.tsx`: replace all raw `fetch()` calls with `useQuery` / `useMutation`
  - Tree data fetch → `useQuery({ queryKey: ['tree'], queryFn: fetchTree })`
  - Node expand/collapse → optimistic `useMutation`
  - Rename/move/delete → `useMutation` with invalidation
- Add `AbortController` inside any remaining `useEffect` fetch calls not yet migrated
- **Output:** `ContentTreeClient.tsx` uses TanStack Query throughout; no raw `fetch()` in client tree code

### 0.4 Decompose ContentTreeClient (800+ lines → <200-line modules)
- Extract the following into separate files in `src/admin/components/builder/` or `src/admin/hooks/`:
  - `useTreeData.ts` — tree fetch, expand/collapse state, search filter
  - `useTreeActions.ts` — rename, move, delete, duplicate, lock/unlock
  - `TreeNode.tsx` — single node row with gutter icons (workflow dot, lock, FR warning)
  - `TreeSearch.tsx` — search input component with debounced filter
- `ContentTreeClient.tsx` becomes a thin orchestrator (<200 lines) that composes the above
- All extracted modules must have TypeScript types; no `any`
- **Output:** `ContentTreeClient.tsx` <200 lines; 4 new focused modules

### 0.5 Decompose MediaLibraryClient (1,866 lines → ~200-line modules)
- Extract the following into `src/admin/components/` sub-modules:
  - `useMediaData.ts` — folder tree fetch, file listing, pagination state
  - `useMediaActions.ts` — upload, move, delete, bulk ops
  - `MediaGrid.tsx` — thumbnail grid view
  - `MediaList.tsx` — detail list view
  - `MediaToolbar.tsx` — search bar, filter dropdown, upload button, view toggle
  - `MediaFolderTree.tsx` — left-panel folder hierarchy
- `MediaLibraryClient.tsx` becomes a thin orchestrator (<200 lines)
- Migrate all `fetch()` calls inside these modules to TanStack Query
- **Output:** `MediaLibraryClient.tsx` <200 lines; 6 new focused modules

### 0.6 Add toast error handling + AbortController to remaining client components
- Audit all `*.tsx` files in `src/admin/` for raw `fetch()` calls
- For each:
  1. Wrap error path with a toast notification (use the project's existing toast library, or install `sonner` if none exists)
  2. Add `AbortController` + `signal` to the fetch; call `abort()` in `useEffect` cleanup
- Files likely needing this: `DashboardClient.tsx`, `WorkboxClient.tsx`, `PageBuilderClient.tsx`
- **Output:** No silent `console.error` in client fetch paths; all effects clean up on unmount

### 0.7 Replace prompt()/confirm() dialogs with modals
- Find all `window.prompt()` and `window.confirm()` calls in `src/admin/`
- Replace each with the shared `Modal` component (create `src/admin/components/Modal.tsx` if it doesn't exist — a simple accessible dialog with title, body, confirm/cancel buttons)
- Specific replacements:
  - Tree rename prompt → `RenameModal.tsx` (inline input in modal)
  - Delete confirmation → `ConfirmModal.tsx` (destructive action pattern)
  - Any other `prompt()`/`confirm()` usages
- The shared `Modal` must trap focus, be closeable via Escape, and use `role="dialog"` + `aria-modal="true"`
- **Output:** Zero `window.prompt()` / `window.confirm()` calls in `src/admin/`

### 0.8 Fix WorkboxClient stale closure bug
- In `WorkboxClient.tsx`, locate the `handleAction` callback (or equivalent) that transitions workflow state
- The bug: the callback closes over `items` state at mount time; subsequent renders have stale item list
- Fix: use `useCallback` with `items` in the dependency array, OR use `useRef` to hold the latest items
- Verify: approve an item → it disappears from the list immediately (no stale re-render required)
- **Output:** Workflow state transitions update the UI correctly without requiring a page reload

### 0.9 Fix workflow hook double-write
- In the Payload `afterChange` hook(s) that handle workflow transitions (in `src/collections/` or wherever workflow hooks live):
- The bug: the hook calls `payload.update()` to write `workflowHistory`, which triggers `afterChange` again
- Fix: add a context flag guard at the top of every workflow hook:
  ```typescript
  if (req.context?.skipWorkflowHook) return doc
  ```
  And pass `req.context = { ...req.context, skipWorkflowHook: true }` when calling `payload.update()` inside the hook
- This pattern is documented in `~/.claude/skills/payload-super/reference/HOOKS.md` under "Recursive Hook Prevention"
- **Output:** Workflow hooks run exactly once per save; no duplicate `workflowHistory` entries

### 0.10 Extract shared TypeScript types
- Create `src/types/admin.ts` (or `src/admin/types.ts`) with the following shared interfaces:
  ```typescript
  // Workflow
  export type WorkflowState = 'draft' | 'in_review' | 'needs_revision' | 'approved' | 'published' | 'unpublished'
  export interface WorkflowHistoryEntry { from: WorkflowState; to: WorkflowState; user: string; date: string; comment?: string }

  // Auth
  export type UserRole = 'author' | 'editor' | 'admin'
  export interface UserWithRole { id: string; email: string; name: string; role: UserRole }

  // Content Tree
  export interface TreeNode { id: string; title: string; slug: string; type: string; parentId?: string; sortOrder: number; workflowState: WorkflowState; lockedBy?: string; hasTranslation: boolean; children?: TreeNode[] }
  export interface FolderNode extends TreeNode { type: 'folder'; childCount: number }
  ```
- Replace all inline redeclarations of these shapes throughout `src/admin/` with imports from this file
- Run `npx tsc --noEmit` to verify zero type errors
- **Output:** `src/types/admin.ts` exists; all admin code imports shared types; no duplicate type definitions

### 0.11 Create brand.ts constants + run FRAS→RAS rename
- Create `src/lib/brand.ts`:
  ```typescript
  export const BRAND = {
    fullName: 'Reporting and Assurance Standards (RAS) Canada',
    shortName: 'RAS Canada',
    abbreviation: 'RAS',
    formerName: 'FRAS Canada',
    tagline: "Canada's Official Hub for Accounting and Assurance Standards",
    url: 'https://rascanada.ca',
    adminTitle: 'RAS Canada CMS',
  } as const
  ```
- Find and replace all string literals `"FRAS Canada"`, `"FRAS"` (when used as the org name, not as a legacy field label), `"frascanada.ca"` etc. in `src/` — use `BRAND.*` constants instead
- Admin panel title (Payload `admin.meta.titleSuffix` or equivalent) must use `BRAND.adminTitle`
- **Gate check:** `grep -r "FRAS Canada" src/` must return zero results
- **Output:** `brand.ts` exists; zero hardcoded "FRAS Canada" strings in `src/`

### 0.12 Delete dead code
- Delete `src/admin/components/builder/PropsDrawer.tsx` — superseded by `InspectorPanel.tsx`
- Delete `src/admin/components/builder/PropsDrawer.stories.tsx` if it exists
- Check if `src/admin/components/ComponentToolbox.tsx` exists at root level (not in `builder/`) — delete if it does
- Grep for any imports referencing the deleted files and update/remove them
- **Output:** Dead files gone; no broken imports

### 0.13 Set up Vitest + write foundational tests
- Install: `npm install --save-dev vitest @vitest/ui jsdom @testing-library/react @testing-library/user-event`
- Create `vitest.config.ts` at project root:
  ```typescript
  import { defineConfig } from 'vitest/config'
  import react from '@vitejs/plugin-react'
  export default defineConfig({
    plugins: [react()],
    test: { environment: 'jsdom', globals: true, setupFiles: ['./src/__tests__/setup.ts'] },
  })
  ```
- Create `src/__tests__/setup.ts` with `@testing-library/jest-dom` import
- Write the following test files:
  - `src/admin/components/builder/__tests__/useBuilderState.test.ts` — unit tests for the `useBuilderState` reducer:
    - `ADD_COMPONENT` action adds to the correct zone
    - `REMOVE_COMPONENT` action removes from zone
    - `MOVE_COMPONENT` action reorders within zone
    - `UNDO` reverts to previous state
    - `REDO` advances to next state
    - History max 50 entries (51st push drops oldest)
  - `src/admin/components/builder/__tests__/registry.test.ts` — registry helper tests:
    - `getComponentsByCategory('content')` returns 10 items
    - `getComponentsByCategory('layout')` returns 7 items
    - `isAllowedInZone('rich-text', 'main')` returns true
    - `isAllowedInZone('rich-text', 'locked-header')` returns false
  - `src/lib/__tests__/brand.test.ts` — brand constants tests:
    - `BRAND.fullName` equals `"Reporting and Assurance Standards (RAS) Canada"`
    - `BRAND.abbreviation` equals `"RAS"`
- Add `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json` scripts
- **Output:** `npx vitest run` exits 0 with all tests passing

### 0.14 Update WCAG references to 2.2 AA
- Find all references to "WCAG 2.2 AA" in `src/` (code comments, strings, a11y audit config)
- Replace with "WCAG 2.2 AA"
- If `@axe-core/react` or similar is configured with a specific WCAG level, update its config
- **Output:** Zero "WCAG 2.2 AA" references in codebase; all say "WCAG 2.2 AA"

---

## Validation Gates (Layer 0 is complete when ALL of these pass)

```bash
# 1. TypeScript clean
npx tsc --noEmit

# 2. Production build
npm run build

# 3. Tests passing
npx vitest run

# 4. Storybook builds (regression check — no existing stories broken)
npx storybook build --quiet

# 5. Brand rename complete
grep -r "FRAS Canada" src/   # Must return ZERO results

# 6. Brand constants file exists
test -f src/lib/brand.ts && echo "EXISTS" || echo "MISSING"

# 7. Dead code gone
test ! -f src/admin/components/builder/PropsDrawer.tsx && echo "DELETED" || echo "STILL EXISTS"

# 8. MediaLibraryClient under 250 lines
wc -l src/admin/views/MediaLibraryClient.tsx   # Target: <250

# 9. ContentTreeClient under 250 lines
wc -l src/admin/views/ContentTreeClient.tsx    # Target: <250
```

---

## Workflow

1. Read MASTER_TODO.md → find the "Layer 0" section → read all task entries
2. If Layer 0 section doesn't exist yet, ADD IT to MASTER_TODO.md with all 14 tasks as `[ ]` items following the existing format
3. Find the first `[ ]` task
4. Mark it `[~]` in MASTER_TODO.md
5. Build/fix it
6. Run per-task validation
7. If passes: mark `[x]`, create commit `feat(layer-0): task 0.N — [short description]`
8. If fails: apply 3-strike rule, mark `[!]` on third failure, move to next task
9. When ALL 14 tasks are `[x]`: run full validation suite above → update AUDIT_LOG.md → output stop condition

---

## Stop Condition

When ALL 14 tasks are `[x]` AND all validation gates pass:

1. Update `.ai-reports/AUDIT_LOG.md`:
   - Date: `date '+%Y-%m-%d'`
   - Type: BUILD
   - Layer: 0 — Admin Platform Foundation
   - Tasks: 0.1–0.14
   - Files modified (list them)
   - Any deviations from spec

2. Create summary commit: `feat(layer-0): admin platform foundation — all tasks complete`

3. Output EXACTLY:
```
<promise>LAYER 0 COMPLETE</promise>
```

---

## EXIT PROTOCOL (MANDATORY)

### Per-Task Completion
A task is DONE when ALL of these pass:
1. Every acceptance criterion satisfied
2. Every validation command exits 0
3. `npx tsc --noEmit` passes (zero TypeScript errors)
4. Task status updated to `[x]` in MASTER_TODO.md
5. Git commit created: `feat(layer-0): task 0.N — [short description]`

### Per-Task Failure (3-strike rule)
1. First attempt: diagnose root cause, fix, re-validate
2. Second attempt: try alternative approach, re-validate
3. Third attempt: mark task `[!]` with reason, move to next task
4. Do NOT loop endlessly — 3 attempts max per task

### HARD STOPS
Output `<promise>LAYER 0 ABORTED: [reason]</promise>` if ANY of these occur:
- Dev server won't start after 3 fix attempts
- Unresolvable dependency conflict
- More than 5 structural TypeScript errors (architectural issues, not typos)
- Database connection fails and cannot be recovered
- You detect you're in an infinite loop (same error 3+ times)

### What NOT To Do
- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT mark tasks `[x]` before validation passes
- Do NOT skip reading MASTER_TODO.md at the start
- Do NOT install packages not listed here without documenting why
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push`
