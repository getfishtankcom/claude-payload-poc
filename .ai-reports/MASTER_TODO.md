# FRAS Canada — Master TODO

> **Total Tasks:** 142 (Phase 1 + Phase 2) + 47 Admin Platform (Layers 0–5)
> **Stack:** Next.js 15 (App Router) + Payload CMS 3.x + PostgreSQL + Tailwind CSS v4 + Meilisearch
> **Last Updated:** 2026-04-27

## How This Document Works

This is the single source of truth for build progress. Each task has:
- **Status:** `[ ]` pending, `[~]` in progress, `[x]` complete, `[!]` blocked
- **Acceptance Criteria:** What "done" looks like — specific, testable conditions
- **Validation:** Commands or checks to verify completion
- **Ralph Stop:** The condition that signals a Ralph loop to output `<promise>DONE</promise>`

---

# Phase 1 (58 tasks across 11 epics)

---

## Epic 0: Project Scaffolding + Design System (5 tasks)

### 0.1 Initialize Next.js + Payload CMS project

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- `create-payload-app` scaffolded with Next.js template in project root
- `.env.example` contains `DATABASE_URI`, `PAYLOAD_SECRET`, `NEXT_PUBLIC_SERVER_URL` variables
- PostgreSQL connection string configured in `.env.example` with placeholder values
- Tailwind CSS v4 installed with `@tailwindcss/postcss` in `postcss.config.mjs`
- Project structure exists: `src/app/`, `src/collections/`, `src/globals/`, `src/components/`
- ESLint configured with `@typescript-eslint/parser` and strict rules
- Prettier configured with `.prettierrc`
- `tsconfig.json` has `strict: true`
- Dev server starts without errors on `http://localhost:3000`
- Payload admin panel accessible at `http://localhost:3000/admin`

**Validation:**
```bash
ls src/app src/collections src/globals src/components
npm run dev & sleep 8 && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin && kill %1
grep '"strict": true' tsconfig.json
```

**Ralph Stop:** Dev server runs, `/admin` returns 200, all 4 directories exist.

---

### 0.2 Configure Tailwind CSS v4 design system

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- `globals.css` contains `@theme inline` block with all design tokens
- Brand color CSS custom properties defined:
  - `--color-primary: #601F5B`
  - `--color-primary-bright: #A53B9D`
  - `--color-primary-medium: #8E3387`
  - `--color-primary-vivid: #800080`
- Hero gradient token defined:
  - `--gradient-hero: linear-gradient(90deg, #9F2528 12%, #8A2339 32%, #60205B 49%, #243E90 86%)`
- Neutral palette tokens: `--color-gray-50` through `--color-gray-900`, `--color-black`, `--color-white`
- Semantic tokens defined
- Typography configured with Inter font
- Spacing, breakpoints, border radius, shadow tokens present
- Badge color tokens defined

**Validation:**
```bash
grep '@theme inline' src/app/globals.css
grep '#601F5B' src/app/globals.css
grep 'gradient-hero' src/app/globals.css
grep -r 'Inter' src/app/layout.tsx
```

**Ralph Stop:** `globals.css` contains `@theme inline` with all tokens. Tailwind utilities resolve to correct values.

---

### 0.2.1 Install and configure Tailwind UI

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- `@headlessui/react` installed
- `@heroicons/react` installed
- Both importable without TypeScript errors

**Validation:**
```bash
grep '@headlessui/react' package.json
grep '@heroicons/react' package.json
npx tsc --noEmit 2>&1 | head -20
```

**Ralph Stop:** Both packages in `package.json`, importable without TypeScript errors.

---

### 0.2.2 Build design primitives

- [x] **Status:** Complete (2026-03-05)

**Acceptance Criteria:**
- 6 primitives: `Button`, `Badge`, `Input`, `Card`, `Container`, `Stack` at `src/components/ui/`
- All exported from `src/components/ui/index.ts` barrel file

**Validation:**
```bash
ls src/components/ui/Button.tsx src/components/ui/Badge.tsx src/components/ui/Input.tsx src/components/ui/Card.tsx src/components/ui/Container.tsx src/components/ui/Stack.tsx src/components/ui/index.ts
npx tsc --noEmit
```

**Ralph Stop:** All 6 component files exist, barrel export works, `tsc --noEmit` passes.

---

### 0.3 Set up deployment pipeline

- [ ] **Status:** Pending

**Acceptance Criteria:**
- `.env.example` contains all required environment variable keys with descriptions
- `npm run build` exits 0

**Validation:**
```bash
grep -c '=' .env.example
npm run build 2>&1 | tail -5
```

**Ralph Stop:** `npm run build` exits 0, `.env.example` contains all environment variable keys.

---

### 0.5 Set up Storybook

- [x] **Status:** Complete

**Acceptance Criteria:**
- Storybook configured and running on port 6006
- 6 primitive stories exist
- `npm run storybook:build` exits 0

**Validation:**
```bash
npm run storybook:build
npx tsc --noEmit
```

**Ralph Stop:** Storybook builds cleanly, all 6 primitive stories render.

---

## Epic 1: CMS Collections & Globals (11 tasks)

### 1.1–1.11: All complete

- [x] **Status:** All complete (2026-03-05)
- Covers: `boards`, `standards`, `projects`, `consultations`, `news`, `events`, `documents`, `decision-summaries`, `contacts`, `pages` collections, and Navigation/Footer/Homepage/SearchConfig globals.

---

## Epic 2: Shared Layout Components (6 tasks)

### 2.1–2.6: All complete

- [x] **Status:** All complete (2026-03-05)
- Covers: `SiteHeader`, `SiteFooter`, `MobileMenu`, `MegaMenu`, `Breadcrumb`, root layout.

---

## Epic 3: Utility / Atomic Components (6 tasks)

### 3.1–3.6: All complete

- [x] **Status:** All complete (2026-03-05)
- Covers: `ContentTypeBadge`, `TagChip`, `Pagination`, `PageHeader`, `NewsletterCTA`, `NewsItem`.

---

## Epic 4: Homepage (5 tasks)

### 4.1–4.5: All complete

- [x] **Status:** All complete (2026-03-05)

---

## Epic 5: CMS Data Integration & Search (11 tasks)

### 5.1–5.11: All complete

- [x] **Status:** All complete

---

## Epic 6: Board Detail Page (6 tasks)

### 6.1–6.6: All complete

- [x] **Status:** All complete (2026-03-05)

---

## Epic 7: Project Detail Page (2 tasks)

### 7.1–7.2: All complete

- [x] **Status:** All complete (2026-03-05)

---

## Epic 8: Active Projects Listing (3 tasks)

### 8.1–8.3: All complete

- [x] **Status:** All complete (2026-03-05)

---

## Epic 9: Open Consultations Listing (2 tasks)

### 9.1–9.2: All complete

- [x] **Status:** All complete (2026-03-05)

---

## Epic 10: Integration & Polish + HubSpot (5 tasks)

### 10.1–10.5: All complete

- [x] **Status:** All complete (2026-03-05)

---

# Phase 2 (73 tasks across 10 epics)

---

## Epic 11: Phase 2 CMS Collections (13 tasks)

### 11.1–11.13: All complete

- [x] **Status:** All complete (2026-03-05)

---

## Epics 12–21: All complete

- [x] **Status:** All complete (2026-03-05 through 2026-03-06)

---

## Epics 22–26: Admin Foundation, Content Tree, Media Library, Page Builder Core & Polish

- [x] **Status:** All complete (2026-03-05 through 2026-03-06)

---

## Epic 27: Workbox (6 tasks)

### 27.1–27.6: All complete

- [x] **Status:** All complete (2026-03-06)

---

---
---

# Admin Platform Build — Layers 0–5

> **Purpose:** Debt-reduction, correctness fixes, registry expansion, and feature additions for the custom admin panel.
> **Approach:** Ralph-loop compatible. Each task is independently completable. Layers are ordered by dependency — complete Layer 0 before starting Layer 1, etc.
> **Current state:** Epics 22–27 built the admin platform foundations. These layers improve quality and add features on top.

---

## Layer 0 — Foundation (14 tasks)

> Fix debt, upgrade dependencies, establish testing infrastructure, and harden the codebase. No visible features added — all internal quality.

---

### Task 0.1: Upgrade Next.js + Payload + semver patches

- **Status:** [~] Partial — upgrades applied (next 16.2.4, payload + 4 @payloadcms pkgs at 3.84.1), tsc clean, Storybook builds. `npm run build` blocks on Postgres for `/api/rss` prerender; verify after Docker is started. Did NOT do full `npm outdated` semver sweep.
- **Dependencies:** none
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `next` updated to `16.2.4` in `package.json`
  - [ ] `payload` updated to `^3.84.1` in `package.json`
  - [ ] All other packages with available semver patch/minor updates applied (`npm outdated` shows clean list for non-breaking upgrades)
  - [ ] `npm run build` exits 0 with zero errors
  - [ ] `npx tsc --noEmit` reports zero errors
  - [ ] Dev server starts and `/admin` responds 200
  - [ ] All existing Storybook stories still render (`npx storybook build --quiet` exits 0)
  - [ ] No deprecated Payload API calls remain (check Payload 3.84 changelog)
- **Validation Commands:**
  ```bash
  grep '"next":' package.json
  grep '"payload":' package.json
  npm run build
  npx tsc --noEmit
  npx storybook build --quiet
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
  ```
- **Stop Condition:** All validation commands pass. Output `<promise>TASK 0.1 COMPLETE</promise>`
- **Files to create/modify:**
  - `package.json` — update version ranges
  - `package-lock.json` — regenerated by npm install

---

### Task 0.2: FRAS → RAS brand rename

- **Status:** [ ] Not started
- **Dependencies:** 0.1 (stable platform)
- **Skills:** none
- **Acceptance Criteria:**
  - [ ] `src/config/brand.ts` created and exports `BRAND` constant with fields:
    - `name: 'RAS Canada'`
    - `fullName: 'Reporting and Assurance Standards (RAS) Canada'`
    - `nameFr: 'NIFC Canada'` (placeholder — design team to confirm)
    - `domain: 'frascanada.ca'`
    - `adminTitle: 'RAS Canada CMS'`
  - [ ] All hardcoded `"FRAS Canada"` strings in `src/` replaced with `BRAND.name` or `BRAND.adminTitle` imports
  - [ ] Seed data files updated to reference `BRAND` constant rather than literal strings
  - [ ] Admin UI strings (CustomNav title, Dashboard heading, etc.) use brand constant
  - [ ] `grep -r "FRAS Canada" src/` returns zero hits
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/config/brand.ts
  grep -r "FRAS Canada" src/
  npx tsc --noEmit
  ```
- **Stop Condition:** `grep -r "FRAS Canada" src/` returns zero hits, brand.ts exists and exports BRAND constant. Output `<promise>TASK 0.2 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/config/brand.ts` — NEW: brand constant
  - `src/admin/components/CustomNav.tsx` — import BRAND
  - `src/admin/views/DashboardClient.tsx` — import BRAND
  - `src/globals/Navigation.ts` — update seed/default strings
  - `src/globals/Footer.ts` — update seed/default strings
  - `src/globals/Homepage.ts` — update seed/default strings
  - `src/globals/AuthConfig.ts` — update seed/default strings
  - `src/globals/SearchConfig.ts` — update seed/default strings
  - `src/__mocks__/cms-data.ts` — update mock strings
  - `src/seed/index.ts` — import BRAND
  - `src/seed/seed-tree.ts` — import BRAND
  - `src/seed/seed-media.ts` — import BRAND
  - `src/app/(frontend)/[locale]/(frontend)/page.tsx` — import BRAND

---

### Task 0.3: Fix 9 registry bugs

- **Status:** [ ] Not started
- **Dependencies:** none (can run parallel with 0.2)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `hero-banner`: `showProjectSearch` checkbox prop added + `searchPlaceholder` text prop added to `propsSchema`. Note in description that search is scoped to Projects only.
  - [ ] `cta-banner`: `backgroundImage` media prop added to `propsSchema` (type: `media`, required: false)
  - [ ] `consultation-countdown`: `relationTo` corrected from `'consultations'` to `'document-for-comment'` in the relationship prop
  - [ ] `project-list`: `'deferred'` added to `statusFilter` select options (alongside Active, Completed, Paused)
  - [ ] `event-calendar`: `'decision-summary'` added to `eventTypeFilter` select options
  - [ ] `newsletter-signup`: `linkedinUrl` text prop added to `propsSchema`
  - [ ] `contact-card`: `layout` select prop options expanded to include `'sidebar-sticky'` variant; `multiContact` boolean prop added enabling array of contacts
  - [ ] `board-members-grid`: `groupByRole` boolean prop added (default false)
  - [ ] `document-table`: `grouping` select prop options expanded to include `'by-type'`; `showGroupHeaders` boolean prop added
  - [ ] `npx tsc --noEmit` passes with zero errors
- **Validation Commands:**
  ```bash
  grep -A5 "hero-banner" src/admin/components/builder/registry.ts | grep "showProjectSearch"
  grep -A5 "cta-banner" src/admin/components/builder/registry.ts | grep "backgroundImage"
  grep "document-for-comment" src/admin/components/builder/registry.ts
  grep "deferred" src/admin/components/builder/registry.ts
  grep "decision-summary" src/admin/components/builder/registry.ts
  grep "linkedinUrl" src/admin/components/builder/registry.ts
  grep "sidebar-sticky" src/admin/components/builder/registry.ts
  grep "groupByRole" src/admin/components/builder/registry.ts
  grep "by-type" src/admin/components/builder/registry.ts
  npx tsc --noEmit
  ```
- **Stop Condition:** All 9 grep checks return a hit, `tsc --noEmit` passes. Output `<promise>TASK 0.3 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/builder/registry.ts` — 9 targeted edits

---

### Task 0.4: Add 5 missing color tokens

- **Status:** [ ] Not started
- **Dependencies:** none
- **Skills:** none
- **Acceptance Criteria:**
  - [ ] `.ai-reports/dogfood-frascanada/design-tokens.md` updated with 5 new board/council color tokens:
    - `--color-brand-councils: #00438C` (PSAB, CSSB, RASOC blue)
    - `--color-brand-councils-tint: #7986B9`
    - `--color-brand-boards: #983232` (AcSB, AASB red-brown)
    - `--color-brand-boards-tint: #C98578`
    - `--color-brand-gray: #A7A9AB`
  - [ ] `src/app/(payload)/admin-tailwind.css` (or equivalent admin CSS) updated with the 5 tokens in the `@theme inline` block
  - [ ] Tokens documented with usage note: "Use council color for PSAB/CSSB/RASOC board pages; board color for AcSB/AASB board pages"
  - [ ] `npx tsc --noEmit` passes (CSS-only change, but confirm no broken imports)
- **Validation Commands:**
  ```bash
  grep "color-brand-councils" .ai-reports/dogfood-frascanada/design-tokens.md
  grep "color-brand-boards" .ai-reports/dogfood-frascanada/design-tokens.md
  grep "#00438C" src/app/'(payload)'/admin-tailwind.css
  grep "#983232" src/app/'(payload)'/admin-tailwind.css
  npx tsc --noEmit
  ```
- **Stop Condition:** All 5 tokens present in both design-tokens.md and admin CSS. Output `<promise>TASK 0.4 COMPLETE</promise>`
- **Files to create/modify:**
  - `.ai-reports/dogfood-frascanada/design-tokens.md` — add 5 tokens
  - `src/app/(payload)/admin-tailwind.css` — add 5 tokens to `@theme inline`

---

### Task 0.5: Update WCAG 2.1 → 2.2 AA references

- **Status:** [ ] Not started
- **Dependencies:** none
- **Skills:** none
- **Acceptance Criteria:**
  - [ ] All references to "WCAG 2.1" in `.ai-reports/PRD.md` updated to "WCAG 2.2"
  - [ ] All references to "WCAG 2.1" in `.ai-reports/PRD-phase2.md` updated to "WCAG 2.2"
  - [ ] All references to "WCAG 2.1" in `.ai-reports/BUILD_PLAN.md` updated to "WCAG 2.2"
  - [ ] All references to "WCAG 2.1" in `.ai-reports/PRD-admin-panel.md` updated to "WCAG 2.2"
  - [ ] All references to "WCAG 2.1" in `src/` code files (comments, JSDoc, etc.) updated to "WCAG 2.2"
  - [ ] `grep -r "WCAG 2.1" .ai-reports/ src/` returns zero hits
  - [ ] Note added in PRD NFR sections: "WCAG 2.2 AA — key new criteria include Focus Appearance (2.4.11), Dragging Movements (2.5.7), Target Size Minimum (2.5.8)"
- **Validation Commands:**
  ```bash
  grep -r "WCAG 2.1" .ai-reports/
  grep -r "WCAG 2.1" src/
  grep "WCAG 2.2" .ai-reports/PRD.md
  ```
- **Stop Condition:** `grep -r "WCAG 2.1"` returns zero hits in both directories. Output `<promise>TASK 0.5 COMPLETE</promise>`
- **Files to create/modify:**
  - `.ai-reports/PRD.md`
  - `.ai-reports/PRD-phase2.md`
  - `.ai-reports/BUILD_PLAN.md`
  - `.ai-reports/PRD-admin-panel.md`
  - Any `src/` files with WCAG 2.1 references in comments

---

### Task 0.6: Set up Vitest + initial test suite

- **Status:** [ ] Not started
- **Dependencies:** 0.1 (stable platform needed for install)
- **Skills:** javascript-testing-patterns
- **Acceptance Criteria:**
  - [ ] `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@vitejs/plugin-react` installed as devDependencies
  - [ ] `vitest.config.ts` created at project root with:
    - `environment: 'jsdom'`
    - `setupFiles: ['./src/__tests__/setup.ts']`
    - `include: ['src/**/*.test.{ts,tsx}']`
    - Path aliases matching `tsconfig.json` `paths`
  - [ ] `src/__tests__/setup.ts` created importing `@testing-library/jest-dom/vitest`
  - [ ] `npm test` script added to `package.json` pointing to `vitest run`
  - [ ] Test: `src/admin/components/builder/useBuilderState.test.ts` — tests all 13 action types in the `useBuilderState` reducer (ADD_COMPONENT, REMOVE_COMPONENT, MOVE_COMPONENT, UPDATE_PROPS, SET_ACTIVE_ZONE, CLEAR_ACTIVE, UNDO, REDO, CLEAR_HISTORY, SET_BREAKPOINT, SET_LANGUAGE, LOAD_LAYOUT, RESET)
  - [ ] Test: `src/admin/components/builder/registry.test.ts` — tests 5 helper functions: `getComponentType`, `getComponentsByCategory`, `searchComponents`, `getComponentsForZone`, `componentsByType` index
  - [ ] Test: `src/config/brand.test.ts` — tests that all BRAND fields are non-empty strings and domain is valid
  - [ ] `npx vitest run` passes with coverage ≥ 90% on `useBuilderState` reducer
- **Validation Commands:**
  ```bash
  grep '"vitest"' package.json
  test -f vitest.config.ts
  test -f src/__tests__/setup.ts
  npx vitest run
  npx vitest run --coverage 2>&1 | grep "useBuilderState"
  ```
- **Stop Condition:** `npx vitest run` passes all tests. Output `<promise>TASK 0.6 COMPLETE</promise>`
- **Files to create/modify:**
  - `package.json` — add vitest, testing-library, scripts
  - `vitest.config.ts` — NEW
  - `src/__tests__/setup.ts` — NEW
  - `src/admin/components/builder/useBuilderState.test.ts` — NEW
  - `src/admin/components/builder/registry.test.ts` — NEW
  - `src/config/brand.test.ts` — NEW (after 0.2)

---

### Task 0.7: Fix N+1 in /api/tree

- **Status:** [ ] Not started
- **Dependencies:** none
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `GET /api/tree` executes exactly ONE database query (single `payload.find({ collection: 'pages', limit: 0, depth: 1 })`)
  - [ ] Tree is built in-memory from the flat result: group by `parent.id`, compute `hasChildren` from the parent-child map (no separate count queries)
  - [ ] Response structure identical to before: `{ nodes: TreeNode[], total: number }`
  - [ ] `TreeNode.hasChildren` is boolean, computed accurately from the in-memory map
  - [ ] Response time on a 100-item dataset is < 200ms (add logging to verify)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  npx tsc --noEmit
  curl -s http://localhost:3000/api/tree | python3 -c "import sys,json; d=json.load(sys.stdin); print('nodes:', len(d.get('nodes',d.get('docs',[]))))"
  # Check server logs show only 1 DB query per /api/tree request
  ```
- **Stop Condition:** Single DB query confirmed, response structure correct, `tsc --noEmit` passes. Output `<promise>TASK 0.7 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/app/(payload)/api/tree/route.ts` (or wherever the /api/tree endpoint lives — locate first with `grep -r "api/tree" src/`)

---

### Task 0.8: Fix N+1 in /api/tree/search

- **Status:** [ ] Not started
- **Dependencies:** 0.7 (shares the tree fetch pattern)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `GET /api/tree/search?q=...` builds a parent-lookup `Map<id, TreeNode>` from a single bulk fetch, not recursive DB calls
  - [ ] Ancestor chains (breadcrumb path to each result) resolved entirely from the in-memory Map
  - [ ] No `payload.findByID` calls inside any loop
  - [ ] Response includes `{ results: SearchResult[], total: number }` where each `SearchResult` has `{ node: TreeNode, ancestors: TreeNode[] }`
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  npx tsc --noEmit
  curl -s "http://localhost:3000/api/tree/search?q=about" | python3 -c "import sys,json; d=json.load(sys.stdin); print('results:', len(d.get('results', [])))"
  # Check server logs: only 1 DB query regardless of how many results are returned
  ```
- **Stop Condition:** Single DB query confirmed, search results include ancestor chains, `tsc --noEmit` passes. Output `<promise>TASK 0.8 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/app/(payload)/api/tree/search/route.ts` (locate with `grep -r "tree/search" src/`)

---

### Task 0.9: Decompose MediaLibraryClient.tsx

- **Status:** [ ] Not started
- **Dependencies:** none
- **Skills:** none
- **Acceptance Criteria:**
  - [ ] `MediaLibraryClient.tsx` reduced to < 300 lines — orchestrator only (renders extracted components, wires state)
  - [ ] `src/admin/views/media/FolderPanel.tsx` extracted: folder tree rendering, folder CRUD (create, rename, delete), folder context menu
  - [ ] `src/admin/views/media/MediaGrid.tsx` extracted: thumbnail grid view with lazy-loading, item selection, drop zone
  - [ ] `src/admin/views/media/MediaList.tsx` extracted: list view with table columns
  - [ ] `src/admin/hooks/useMediaLibraryState.ts` extracted: all 14 state variables + fetch logic + upload logic (removes them from MediaLibraryClient)
  - [ ] `src/admin/views/media/dialogs/BulkMoveDialog.tsx` extracted
  - [ ] `src/admin/views/media/dialogs/BulkDeleteDialog.tsx` extracted
  - [ ] `src/admin/views/media/dialogs/RenameFolderDialog.tsx` extracted
  - [ ] All media library features still work end-to-end (upload, search, filter, grid/list, detail panel, bulk ops)
  - [ ] `npx tsc --noEmit` passes with zero errors
  - [ ] Storybook still builds (`npx storybook build --quiet`)
- **Validation Commands:**
  ```bash
  wc -l src/admin/views/MediaLibraryClient.tsx
  test -f src/admin/views/media/FolderPanel.tsx
  test -f src/admin/views/media/MediaGrid.tsx
  test -f src/admin/views/media/MediaList.tsx
  test -f src/admin/hooks/useMediaLibraryState.ts
  test -f src/admin/views/media/dialogs/BulkMoveDialog.tsx
  npx tsc --noEmit
  npx storybook build --quiet
  ```
- **Stop Condition:** `wc -l MediaLibraryClient.tsx` < 300, all extracted files exist, all features work, `tsc` clean. Output `<promise>TASK 0.9 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/views/MediaLibraryClient.tsx` — heavily reduced
  - `src/admin/views/media/FolderPanel.tsx` — NEW (extracted)
  - `src/admin/views/media/MediaGrid.tsx` — NEW (extracted)
  - `src/admin/views/media/MediaList.tsx` — NEW (extracted)
  - `src/admin/hooks/useMediaLibraryState.ts` — NEW (extracted)
  - `src/admin/views/media/dialogs/BulkMoveDialog.tsx` — NEW (extracted)
  - `src/admin/views/media/dialogs/BulkDeleteDialog.tsx` — NEW (extracted)
  - `src/admin/views/media/dialogs/RenameFolderDialog.tsx` — NEW (extracted)

---

### Task 0.10: Create shared admin types

- **Status:** [ ] Not started
- **Dependencies:** none (can run in parallel with any other 0.x task)
- **Skills:** typescript-advanced-types
- **Acceptance Criteria:**
  - [ ] `src/admin/types/workflow.ts` created and exports:
    - `WorkflowState` enum/type: `'draft' | 'in_review' | 'needs_revision' | 'approved' | 'published' | 'unpublished'`
    - `UserWithRole` interface: `{ id: string; email: string; name: string; role: 'author' | 'editor' | 'admin' }`
    - `STATE_COLORS` constant: maps each `WorkflowState` to a Tailwind color class string (e.g., `'text-gray-500'`)
    - `STATE_LABELS` constant: maps each `WorkflowState` to a human-readable label string
    - `WORKFLOW_TRANSITIONS` constant: maps each `WorkflowState` to an array of valid target states for each actor role (matches PRD Section 7.2 transitions table exactly)
  - [ ] `src/admin/types/tree.ts` created and exports:
    - `TreeNode` interface: `{ id: string; title: string; contentType: string; workflowState: WorkflowState; lockedBy?: string; hasChildren: boolean; sortOrder: number; parent?: string; slug?: string }`
    - `FolderNode` interface: `{ id: string; name: string; parent?: string; sortOrder: number; hasChildren: boolean }`
  - [ ] All 4-6 duplicate local `WorkflowState`/`UserWithRole`/`TreeNode` type definitions across `ContentTreeClient.tsx`, `WorkboxClient.tsx`, `DashboardClient.tsx`, `WorkflowActionBar.tsx`, `WorkflowQueueWidget.tsx` removed and replaced with imports from the new type files
  - [ ] `npx tsc --noEmit` passes with zero errors
- **Validation Commands:**
  ```bash
  test -f src/admin/types/workflow.ts
  test -f src/admin/types/tree.ts
  grep -r "type WorkflowState\|WorkflowState =" src/admin/components/ src/admin/views/  # should return 0 local defs
  npx tsc --noEmit
  ```
- **Stop Condition:** Both type files exist, no local type duplicates remain, `tsc` clean. Output `<promise>TASK 0.10 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/types/workflow.ts` — NEW
  - `src/admin/types/tree.ts` — NEW
  - `src/admin/views/ContentTreeClient.tsx` — remove local types, import from types/
  - `src/admin/views/WorkboxClient.tsx` — remove local types, import from types/
  - `src/admin/views/DashboardClient.tsx` — remove local types, import from types/
  - `src/admin/components/WorkflowActionBar.tsx` — remove local types, import from types/
  - `src/admin/components/widgets/WorkflowQueueWidget.tsx` — remove local types, import from types/

---

### Task 0.11: Install + configure TanStack Query

- **Status:** [ ] Not started
- **Dependencies:** 0.1 (stable platform)
- **Skills:** react-best-practices
- **Acceptance Criteria:**
  - [ ] `@tanstack/react-query` and `@tanstack/react-query-devtools` installed as dependencies
  - [ ] `src/admin/providers/QueryProvider.tsx` created: wraps `QueryClientProvider` with a `QueryClient` configured with sensible defaults (`staleTime: 30_000`, `gcTime: 5 * 60_000`, `retry: 1`)
  - [ ] `src/app/(payload)/layout.tsx` (admin layout) wraps children with `<QueryProvider>`
  - [ ] `ContentTreeClient.tsx` migrated to use `useQuery` for tree fetch and `useMutation` for CRUD operations — no raw `fetch()` calls remain for data-fetching in this file
  - [ ] React Query DevTools visible at bottom of admin pages in development mode (hidden in production via `process.env.NODE_ENV !== 'production'` guard)
  - [ ] Comment in `QueryProvider.tsx` documents the pattern: "All admin data fetching should use TanStack Query hooks. See ContentTreeClient.tsx for the reference pattern."
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  grep '"@tanstack/react-query"' package.json
  test -f src/admin/providers/QueryProvider.tsx
  grep "useQuery\|useMutation" src/admin/views/ContentTreeClient.tsx
  grep "fetch(" src/admin/views/ContentTreeClient.tsx  # should return 0 or only fetch inside useQuery/useMutation
  npx tsc --noEmit
  ```
- **Stop Condition:** TanStack Query installed, QueryProvider in admin layout, ContentTreeClient uses hooks, DevTools visible in dev. Output `<promise>TASK 0.11 COMPLETE</promise>`
- **Files to create/modify:**
  - `package.json` — add @tanstack/react-query, @tanstack/react-query-devtools
  - `src/admin/providers/QueryProvider.tsx` — NEW
  - `src/app/(payload)/layout.tsx` — add QueryProvider wrapper
  - `src/admin/views/ContentTreeClient.tsx` — migrate to useQuery/useMutation

---

### Task 0.12: Extract shared Modal + WorkflowHistoryModal components

- **Status:** [ ] Not started
- **Dependencies:** 0.10 (shared types needed)
- **Skills:** react-best-practices
- **Acceptance Criteria:**
  - [ ] `src/admin/components/ui/Modal.tsx` created with:
    - `ModalOverlay` component: full-screen backdrop (`fixed inset-0 bg-black/50 z-50`) wrapping children, closes on Escape or backdrop click
    - `ModalButton` component: small inline button (configurable variant: `'primary' | 'danger' | 'ghost'`)
    - Both exported from the file
  - [ ] `src/admin/components/ui/ActionButton.tsx` created with:
    - `InlineButton` component: small text button for table rows / item actions
    - `BulkActionButton` component: for bulk action toolbars with icon support
  - [ ] `src/admin/components/WorkflowHistoryModal.tsx` created: renders chronological workflow history timeline; accepts `history: WorkflowHistoryEntry[]` prop; each entry shows `from → to` state arrow with colored dot, user name, relative timestamp, optional comment
  - [ ] `WorkboxClient.tsx` updated to import `ModalOverlay`, `InlineButton`, `BulkActionButton` from shared files instead of defining them locally — local definitions removed
  - [ ] `npx tsc --noEmit` passes
  - [ ] `npx storybook build --quiet` exits 0
- **Validation Commands:**
  ```bash
  test -f src/admin/components/ui/Modal.tsx
  test -f src/admin/components/ui/ActionButton.tsx
  test -f src/admin/components/WorkflowHistoryModal.tsx
  grep "ModalOverlay\|InlineButton\|BulkActionButton" src/admin/views/WorkboxClient.tsx | grep "import"
  npx tsc --noEmit
  npx storybook build --quiet
  ```
- **Stop Condition:** All 3 new files exist, WorkboxClient imports from shared components, `tsc` clean, Storybook builds. Output `<promise>TASK 0.12 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/ui/Modal.tsx` — NEW
  - `src/admin/components/ui/ActionButton.tsx` — NEW
  - `src/admin/components/WorkflowHistoryModal.tsx` — NEW
  - `src/admin/views/WorkboxClient.tsx` — remove local definitions, import from shared files

---

### Task 0.13: Delete dead code

- **Status:** [ ] Not started
- **Dependencies:** 0.11 (confirm nothing still imports these files)
- **Skills:** none
- **Acceptance Criteria:**
  - [ ] `src/admin/components/builder/PropsDrawer.tsx` deleted
  - [ ] `src/admin/components/builder/PropsDrawer.stories.tsx` deleted
  - [ ] `src/admin/components/builder/ComponentToolbox.tsx` deleted
  - [ ] `src/admin/components/builder/ComponentToolbox.stories.tsx` deleted
  - [ ] No remaining imports of `PropsDrawer` or `ComponentToolbox` anywhere in `src/` (verify with grep before deleting)
  - [ ] `npx tsc --noEmit` passes with zero errors (no broken imports)
  - [ ] `npx storybook build --quiet` exits 0 (Storybook doesn't reference deleted stories)
- **Validation Commands:**
  ```bash
  grep -r "PropsDrawer\|ComponentToolbox" src/ --include="*.ts" --include="*.tsx" | grep "import\|from"
  # Run above BEFORE deleting — must return 0 live import references
  test ! -f src/admin/components/builder/PropsDrawer.tsx
  test ! -f src/admin/components/builder/ComponentToolbox.tsx
  npx tsc --noEmit
  npx storybook build --quiet
  ```
- **Stop Condition:** Files deleted, no broken imports, `tsc` clean, Storybook builds. Output `<promise>TASK 0.13 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/builder/PropsDrawer.tsx` — DELETE
  - `src/admin/components/builder/PropsDrawer.stories.tsx` — DELETE
  - `src/admin/components/builder/ComponentToolbox.tsx` — DELETE
  - `src/admin/components/builder/ComponentToolbox.stories.tsx` — DELETE

---

### Task 0.14: Error handling + AbortController + stale closure fixes

- **Status:** [ ] Not started
- **Dependencies:** 0.11 (TanStack Query preferred), 0.12 (shared Modal for replacing prompt())
- **Skills:** react-best-practices
- **Acceptance Criteria:**
  - [ ] **ContentTreeClient — silent catches → user-visible errors:** All `catch {}` blocks (currently 8) in `ContentTreeClient.tsx` now call a `showError(message)` toast/notification function instead of silently swallowing errors. Use a simple inline toast state if no toast library is installed.
  - [ ] **ContentTreeClient — AbortController on search:** Tree search debounce adds `AbortController`; previous search is cancelled when a new search query is typed. Verify by checking that rapid typing doesn't result in stale results.
  - [ ] **ContentTreeClient — replace prompt() dialogs:** `handleMoveTo` and `handleRename` (lines ~578–596) replace `prompt()` with proper modal dialogs using the shared `ModalOverlay` component from Task 0.12. Each dialog has a text input, OK/Cancel buttons, and validates non-empty input.
  - [ ] **WorkboxClient — stale closure fix:** `performTransition` function uses functional state updates (`setState(prev => ...)`) instead of closing over current state. This prevents the bug where rapid transitions could use stale item lists.
  - [ ] **Workflow afterChange hook — double-write fix:** The workflow `afterChange` hook in `src/admin/hooks/workflow-hooks.ts` (or wherever it lives) includes the initial `workflowHistory` entry in the first PATCH rather than performing a second separate PATCH. Bulk transitions should generate exactly N writes for N items, not 2N.
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  grep -n "catch {}" src/admin/views/ContentTreeClient.tsx  # should return 0
  grep "AbortController" src/admin/views/ContentTreeClient.tsx  # should return ≥1 hit
  grep "prompt(" src/admin/views/ContentTreeClient.tsx  # should return 0
  grep "functional.*update\|setState.*prev\|setItems.*prev" src/admin/views/WorkboxClient.tsx | head -5
  npx tsc --noEmit
  ```
- **Stop Condition:** No silent catches, no prompt() calls, AbortController on search, WorkboxClient uses functional updates, double-write eliminated. Output `<promise>TASK 0.14 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/views/ContentTreeClient.tsx` — replace 8 silent catches, add AbortController, replace 2 prompt() with modal dialogs
  - `src/admin/views/WorkboxClient.tsx` — fix stale closure in performTransition
  - `src/admin/hooks/workflow-hooks.ts` — fix double-write on initial history entry

---

### Layer 0 Gate

All 14 tasks complete before starting Layer 1.

```bash
npm run build
npx tsc --noEmit
npx vitest run
npx storybook build --quiet
grep -r "FRAS Canada" src/   # must return zero
test -f src/config/brand.ts  # must exist
```

**Gate Stop:** All commands pass. Output `<promise>LAYER 0 COMPLETE</promise>`

---

## Layer 1 — Registry Expansion (4 tasks)

> Add the 22 components from the PRD that are missing from the current 31-component registry. Bring the registry to 53 total. Update preview renderers and template zone allowedComponents.

---

### Task 1.1: Add 22 new components to registry.ts

- **Status:** [ ] Not started
- **Dependencies:** 0.3 (registry bug fixes done first)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] All 22 new components added to `componentRegistry` array in `registry.ts`:
    1. `project-timeline` — category: `data`, propsSchema: `stageCount` (number, 1-10, default 5), `currentStage` (number), `stages` (array: label, date, description, ctaLabel, ctaUrl)
    2. `quick-links` — category: `layout`, propsSchema: `heading` (text), `links` (array: label, url, icon)
    3. `page-header` — category: `layout`, propsSchema: `icon` (text, Heroicon name), `title` (text, required), `subtitle` (text)
    4. `news-card-widget` — category: `data`, propsSchema: `heading` (text), `boardFilter` (relationship to boards), `limit` (number, default 3), `showExcerpt` (boolean, default true)
    5. `drafts-card` — category: `data`, propsSchema: `heading` (text, default "My Drafts"), `limit` (number, default 5)
    6. `events-card` — category: `data`, propsSchema: `heading` (text), `boardFilter` (relationship), `limit` (number, default 3), `showStartTime` (boolean, default false, only for webinars)
    7. `promo-card-grid` — category: `layout`, allowedZones: `['main']`, propsSchema: `cards` (array: image media, heading, description, ctaLabel, ctaUrl), `columns` (select: 2|3|4, default 3)
    8. `news-events-grid` — category: `data`, propsSchema: `newsLimit` (number, default 3), `eventsLimit` (number, default 3), `boardFilter` (relationship)
    9. `browse-by-standard` — category: `data`, propsSchema: `heading` (text), `showDescriptions` (boolean)
    10. `right-rail-events-list` — category: `data`, allowedZones: `['sidebar', 'right-rail']`, propsSchema: `boardFilter` (relationship), `limit` (number, default 5), `heading` (text)
    11. `right-rail-resource-list` — category: `data`, allowedZones: `['sidebar', 'right-rail']`, propsSchema: `boardFilter` (relationship), `typeFilter` (select: pdf|link|video|all), `limit` (number, default 5)
    12. `subscribe-banner` — category: `interactive`, propsSchema: `heading` (text), `description` (text), `hubspotFormId` (text, required), `linkedinUrl` (text)
    13. `event-summary-table` — category: `data`, propsSchema: `source` (select: manual|dynamic), `rows` (array: date, topic, decision), `boardFilter` (relationship), `eventId` (relationship to events)
    14. `member-action-form` — category: `interactive`, propsSchema: `formVariant` (select: attend|observe|volunteer|document-comment, required), `heading` (text), `requireAuth` (boolean, default true)
    15. `category-pills` — category: `interactive`, propsSchema: `options` (array: label, value), `defaultValue` (text, default "all"), `paramName` (text, required)
    16. `anchor-nav` — category: `interactive`, propsSchema: `heading` (text, default "On this page"), `autoDetect` (boolean, default true, reads H2 tags from page)
    17. `meeting-topics-table` — category: `data`, propsSchema: `source` (select: manual|dynamic), `rows` (array: topic, description, status)
    18. `disclaimer` — category: `content`, propsSchema: `content` (richtext, required), `style` (select: info|warning|legal, default info)
    19. `social-share` — category: `interactive`, propsSchema: `platforms` (array of select: linkedin|twitter|facebook|email), `showCount` (boolean, default false)
    20. `related-content` — category: `data`, propsSchema: `heading` (text, default "Related Content"), `items` (relationship to pages, hasMany, max 6), `layout` (select: cards|list)
    21. `meeting-detail` — category: `data`, propsSchema: `meetingId` (relationship to events, required), `showTopics` (boolean, default true), `showDocuments` (boolean, default true)
    22. `rss-link` — category: `interactive`, allowedZones: `['footer', 'sidebar']`, propsSchema: `feedUrl` (text, required), `label` (text, default "Subscribe via RSS"), `boardFilter` (relationship)
  - [ ] `componentRegistry.length === 53` (31 existing + 22 new)
  - [ ] `componentsByType` index includes all 53 types
  - [ ] `npx tsc --noEmit` passes with zero errors
- **Validation Commands:**
  ```bash
  node -e "const r = require('./src/admin/components/builder/registry'); console.log('total:', r.componentRegistry.length)"
  # Expected: total: 53
  grep "project-timeline\|quick-links\|page-header\|rss-link" src/admin/components/builder/registry.ts | wc -l
  npx tsc --noEmit
  ```
- **Stop Condition:** `componentRegistry.length === 53`, all 22 types present by name, `tsc` clean. Output `<promise>TASK 1.1 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/builder/registry.ts` — add 22 component definitions

---

### Task 1.2: Preview renderers for 22 new components

- **Status:** [ ] Not started
- **Dependencies:** 1.1
- **Skills:** react-best-practices
- **Acceptance Criteria:**
  - [ ] Each of the 22 new component types has a preview renderer exported from the appropriate file in `src/admin/components/builder/previews/`:
    - `content-previews.tsx` — add `disclaimer`
    - `data-previews.tsx` — add `project-timeline`, `news-card-widget`, `drafts-card`, `events-card`, `news-events-grid`, `browse-by-standard`, `right-rail-events-list`, `right-rail-resource-list`, `event-summary-table`, `meeting-topics-table`, `meeting-detail`
    - `layout-previews.tsx` — add `quick-links`, `page-header`, `promo-card-grid`
    - `interactive-previews.tsx` — add `subscribe-banner`, `member-action-form`, `category-pills`, `anchor-nav`, `social-share`, `rss-link`
    - A new `misc-previews.tsx` or `data-previews.tsx` entry — add `related-content`
  - [ ] `PreviewRenderer.tsx` switch statement (or map) updated to handle all 53 component types — no `undefined` or "unknown component" renders for any type in the registry
  - [ ] Each preview renders a schematic card showing: component name, category color strip, and key prop summary (e.g., "3 columns" or "Dynamic: boards filter")
  - [ ] `npx tsc --noEmit` passes
  - [ ] `npx storybook build --quiet` exits 0
- **Validation Commands:**
  ```bash
  grep "project-timeline\|rss-link\|member-action-form" src/admin/components/builder/previews/data-previews.tsx src/admin/components/builder/previews/interactive-previews.tsx
  grep "project-timeline\|rss-link" src/admin/components/builder/previews/PreviewRenderer.tsx
  npx tsc --noEmit
  npx storybook build --quiet
  ```
- **Stop Condition:** All 22 new components have preview renderers, PreviewRenderer handles all 53 types, Storybook builds. Output `<promise>TASK 1.2 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/builder/previews/content-previews.tsx`
  - `src/admin/components/builder/previews/data-previews.tsx`
  - `src/admin/components/builder/previews/layout-previews.tsx`
  - `src/admin/components/builder/previews/interactive-previews.tsx`
  - `src/admin/components/builder/previews/PreviewRenderer.tsx`

---

### Task 1.3: Template zone allowedComponents

- **Status:** [ ] Not started
- **Dependencies:** 1.1 (all 53 components must exist before assigning them to zones)
- **Skills:** none
- **Acceptance Criteria:**
  - [ ] Each template in `src/admin/templates/index.ts` (or wherever template configs live — locate with `find src/admin/templates -name "*.ts"`) has explicit `allowedComponents` arrays on each editable zone, not empty arrays
  - [ ] Zone restrictions follow these rules:
    - `right-rail` / `sidebar` zones: restrict to `['right-rail-events-list', 'right-rail-resource-list', 'contact-card', 'board-members-grid', 'quick-links', 'subscribe-banner', 'rss-link', 'anchor-nav', 'disclaimer', 'related-content']`
    - `main` / `body` zones: allow all content + layout + data components (exclude right-rail-only)
    - `hero` zones: restrict to `['hero-banner', 'page-header']`
    - `footer` zones: restrict to `['newsletter-signup', 'rss-link', 'subscribe-banner']`
    - `full-body` zones (Flexible Page): allow all 53 components
  - [ ] Existing templates updated: Homepage, Board Detail, Project Detail, Active Projects, Open Consultations, Search Results, Content Page, Flexible Page (8 total)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  find src/admin/templates -name "*.ts" -o -name "*.tsx" | head -5
  grep "allowedComponents" src/admin/templates/index.ts | wc -l
  # Expected: > 0 (zones have explicit allowedComponents)
  npx tsc --noEmit
  ```
- **Stop Condition:** All 8 templates have zone allowedComponents populated, right-rail zones are restricted, `tsc` clean. Output `<promise>TASK 1.3 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/templates/index.ts` (or equivalent template config file)

---

### Task 1.4: SiteAlert global + utilities

- **Status:** [ ] Not started
- **Dependencies:** 0.1 (Payload version for global schema)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `src/globals/SiteAlert.ts` created and registered in `payload.config.ts` under `globals` array
  - [ ] SiteAlert global fields:
    - `show` — type: `checkbox`, defaultValue: false, label: "Show alert bar"
    - `message` — type: `text`, required: true, label: "Alert message text"
    - `link` — group with `url` (text) and `label` (text, default "Learn more")
    - `severity` — type: `select`, options: `['info', 'warning', 'urgent']`, defaultValue: `'info'`, label: "Severity"
  - [ ] `src/components/SiteAlert.tsx` created: renders a full-width banner at top of page when `show === true`; `info` = blue bg; `warning` = yellow bg; `urgent` = red bg; dismissable via localStorage; WCAG 2.2 AA contrast compliant
  - [ ] `src/components/BackToTop.tsx` created: button that appears after scrolling 400px (using `IntersectionObserver` on a sentinel element), smooth scrolls to top, styled with `bg-primary text-white`, accessible with `aria-label="Back to top"`
  - [ ] `src/components/RssLink.tsx` created: renders an RSS icon + "RSS Feed" text link; accepts `feedUrl: string` and `label?: string` props; opens in new tab
  - [ ] All 3 components have co-located `.stories.tsx` files
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/globals/SiteAlert.ts
  grep "SiteAlert" src/payload.config.ts
  test -f src/components/SiteAlert.tsx
  test -f src/components/BackToTop.tsx
  test -f src/components/RssLink.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** SiteAlert global registered, all 3 components exist, `tsc` clean. Output `<promise>TASK 1.4 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/globals/SiteAlert.ts` — NEW
  - `src/payload.config.ts` — add SiteAlert to globals array
  - `src/components/SiteAlert.tsx` — NEW
  - `src/components/SiteAlert.stories.tsx` — NEW
  - `src/components/BackToTop.tsx` — NEW
  - `src/components/BackToTop.stories.tsx` — NEW
  - `src/components/RssLink.tsx` — NEW
  - `src/components/RssLink.stories.tsx` — NEW

---

### Layer 1 Gate

```bash
npx tsc --noEmit
npx vitest run
npx storybook build --quiet
node -e "const r = require('./src/admin/components/builder/registry'); console.log(r.componentRegistry.length)"
# Expected output: 53
```

**Gate Stop:** All commands pass, registry has 53 components. Output `<promise>LAYER 1 COMPLETE</promise>`

---

## Layer 2 — Admin Quick Wins (6 tasks)

> Independent features, each < 1 day of work. Can be parallelized in separate git worktrees.

---

### Task 2.1: Board filter in admin collection list views

- **Status:** [ ] Not started
- **Dependencies:** 0.1
- **Skills:** payload-super
- **Can parallelize:** YES (independent worktree)
- **Acceptance Criteria:**
  - [ ] A custom Payload admin list view component `src/admin/components/BoardFilterBar.tsx` created: renders a horizontal row of board abbreviation buttons (All, AcSB, PSAB, CSSB, AASB, RASOC), each toggles a `where[board][equals]=boardId` query param on the collection list view URL
  - [ ] `BoardFilterBar` registered via `admin.components.BeforeListTable` or `admin.components.views.list.BeforeTable` override in `payload.config.ts` for the following collections: `projects`, `news`, `events`, `resources`, `documents`, `board-members`, `committees`, `meetings`
  - [ ] "All" button clears the board filter (removes query param)
  - [ ] Active board button is visually highlighted with `bg-primary text-white`
  - [ ] Filter persists across pagination (appended to page URL)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/components/BoardFilterBar.tsx
  grep "BoardFilterBar" src/payload.config.ts
  npx tsc --noEmit
  # Manual: navigate to /admin/collections/projects, click "AcSB" — list filters
  ```
- **Stop Condition:** BoardFilterBar renders in collection list views and filters by board. Output `<promise>TASK 2.1 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/BoardFilterBar.tsx` — NEW
  - `src/payload.config.ts` — register BoardFilterBar on 8 collections

---

### Task 2.2: FR gutter icon with language audit

- **Status:** [ ] Not started
- **Dependencies:** 0.10 (shared types), 0.14 (error handling)
- **Skills:** none
- **Can parallelize:** YES
- **Acceptance Criteria:**
  - [ ] Tree gutter in `ContentTreeClient.tsx` already shows a warning icon for missing FR. Enhance this: the icon now also appears in Payload's collection list view gutter for items where the French locale has no `title` (i.e., `title_fr` is null or empty). This requires a custom `admin.components.RowLabel` or list cell that checks locale completeness.
  - [ ] `src/admin/components/FrTranslationWarning.tsx` created: renders a small orange flag icon with tooltip "Missing French translation" when the item's FR title is empty
  - [ ] Registered on `pages`, `news`, `projects` collections (the 3 highest-priority for translation)
  - [ ] Clicking the icon navigates to the item's edit view with `?locale=fr` pre-selected (so the editor can immediately translate)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/components/FrTranslationWarning.tsx
  grep "FrTranslationWarning" src/payload.config.ts
  npx tsc --noEmit
  ```
- **Stop Condition:** FR warning icon appears in list views for untranslated pages/news/projects, click navigates to FR edit view. Output `<promise>TASK 2.2 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/FrTranslationWarning.tsx` — NEW
  - `src/payload.config.ts` — register on pages, news, projects

---

### Task 2.3: Favorites / pinned items

- **Status:** [ ] Not started
- **Dependencies:** 0.12 (shared UI components available)
- **Skills:** react-best-practices
- **Can parallelize:** YES
- **Acceptance Criteria:**
  - [ ] `src/admin/hooks/useFavorites.ts` created: stores pinned item IDs in `localStorage` key `'cms_favorites'`; exports `favorites: FavoriteItem[]`, `toggleFavorite(item: FavoriteItem) => void`, `isFavorite(id: string) => boolean`
  - [ ] `FavoriteItem` type: `{ id: string; title: string; collection: string; path: string; pinnedAt: string }`
  - [ ] `src/admin/components/FavoriteButton.tsx` created: star icon button (filled = favorited, outline = not); toggles on click; `aria-label` changes based on state
  - [ ] `FavoriteButton` added to the toolbar area of Payload's edit view via `admin.components.views.edit.BeforeDocumentControls` (or equivalent override)
  - [ ] Dashboard widget "Pinned Items" added to `src/admin/components/widgets/PinnedItemsWidget.tsx`: shows up to 10 favorites with title, collection type badge, and link to edit view; "No pinned items yet" empty state
  - [ ] `DashboardClient.tsx` updated to include `PinnedItemsWidget` in the dashboard grid (replaces or adds below existing 4 widgets)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/hooks/useFavorites.ts
  test -f src/admin/components/FavoriteButton.tsx
  test -f src/admin/components/widgets/PinnedItemsWidget.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** Star button appears in edit views, favorites persist in localStorage, Dashboard shows Pinned Items widget. Output `<promise>TASK 2.3 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/hooks/useFavorites.ts` — NEW
  - `src/admin/components/FavoriteButton.tsx` — NEW
  - `src/admin/components/widgets/PinnedItemsWidget.tsx` — NEW
  - `src/admin/views/DashboardClient.tsx` — add PinnedItemsWidget

---

### Task 2.4: Command palette (Ctrl+K)

- **Status:** [ ] Not started
- **Dependencies:** 0.1 (package install), 0.12 (shared Modal)
- **Skills:** react-best-practices
- **Can parallelize:** YES
- **Acceptance Criteria:**
  - [ ] `cmdk` package installed as a dependency
  - [ ] `src/admin/components/CommandPalette.tsx` created using `cmdk`'s `Command` component:
    - Opens on `Ctrl+K` (or `Cmd+K` on Mac) — global keyboard shortcut registered via `useEffect` with `keydown` listener
    - Closes on `Escape` or click-outside
    - Search field pre-focused on open
    - **Search groups:**
      - "Navigate" — static links: Dashboard, Content Tree, Workbox, Media Library, each collection
      - "Recent Items" — last 5 items from `useRecentItems` hook (localStorage, same as Dashboard widget)
      - "Create New" — shortcuts: New Page, New News Article, New Project, New Event (links to `/admin/collections/{slug}/create`)
    - Keyboard navigation: Up/Down arrows move through results, Enter opens selected item
    - Each result shows icon + label + optional badge (e.g., "Page", "News")
  - [ ] `src/admin/hooks/useCommandPalette.ts` created: manages `isOpen` state, exposes `open()` and `close()` functions
  - [ ] `CommandPalette` rendered in `src/app/(payload)/layout.tsx` (admin layout, outside all routing) so it's accessible from any admin page
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  grep '"cmdk"' package.json
  test -f src/admin/components/CommandPalette.tsx
  test -f src/admin/hooks/useCommandPalette.ts
  grep "CommandPalette" src/app/'(payload)'/layout.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** `Ctrl+K` opens palette, navigation items work, recent items appear, keyboard navigation functions. Output `<promise>TASK 2.4 COMPLETE</promise>`
- **Files to create/modify:**
  - `package.json` — add cmdk
  - `src/admin/components/CommandPalette.tsx` — NEW
  - `src/admin/hooks/useCommandPalette.ts` — NEW
  - `src/app/(payload)/layout.tsx` — render CommandPalette

---

### Task 2.5: Insert options (Sitecore parity)

- **Status:** [ ] Not started
- **Dependencies:** 0.10 (shared types), 0.14 (replace prompt() dialogs)
- **Skills:** payload-super
- **Can parallelize:** YES
- **Acceptance Criteria:**
  - [ ] `src/admin/config/insertOptions.ts` created: exports `INSERT_OPTIONS` map (matching PRD Section 4.4 table exactly):
    ```typescript
    export const INSERT_OPTIONS: Record<string, string[]> = {
      'root': ['page', 'folder'],
      'boards-folder': ['board-detail'],
      'board-detail': ['page'],
      'projects-folder': ['project'],
      'news-folder': ['news'],
      'events-folder': ['event'],
      'documents-folder': ['document'],
      'consultations-folder': ['consultation'],
      'settings': ['global-config'],
      'data-folder': ['contact', 'standard', 'decision-summary'],
      'page': ['page'],
    }
    ```
  - [ ] `TreeContextMenu.tsx` updated: "Insert >" submenu now dynamically filters options using `INSERT_OPTIONS[node.contentType]` — shows only valid child types for the selected node; shows "(no insert options)" for node types not in the map
  - [ ] Depth limit enforced: nodes at depth ≥ 5 have Insert option hidden entirely
  - [ ] Each insert option shows a human-readable label (e.g., "Page", "News Article", "Project")
  - [ ] Clicking an insert option navigates to `/admin/collections/{collectionSlug}/create?parent={nodeId}` — pre-fills the parent relationship
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/config/insertOptions.ts
  grep "INSERT_OPTIONS" src/admin/components/TreeContextMenu.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** Context menu Insert submenu shows only valid child types per node type, depth limit works, insert navigates to create view. Output `<promise>TASK 2.5 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/config/insertOptions.ts` — NEW
  - `src/admin/components/TreeContextMenu.tsx` — update Insert submenu

---

### Task 2.6: Redirect manager

- **Status:** [ ] Not started
- **Dependencies:** 0.1, payload-super skill
- **Skills:** payload-super
- **Can parallelize:** YES
- **Acceptance Criteria:**
  - [ ] `src/collections/Redirects.ts` created and registered in `payload.config.ts`:
    - `from` — type: `text`, required: true, unique: true (the old URL path, e.g., `/en/old-page`)
    - `to` — type: `text`, required: true (the new URL path or external URL)
    - `type` — type: `select`, options: `['301', '302']`, defaultValue: `'301'`
    - `active` — type: `checkbox`, defaultValue: true
    - `note` — type: `text` (internal note for editors)
  - [ ] `src/middleware.ts` (or Next.js middleware) updated to check the `redirects` collection on each request: if `from` matches the request pathname and `active === true`, respond with the configured redirect status and `to` URL
  - [ ] Redirects cached in memory (re-fetched on `revalidateTag('redirects')` or every 5 minutes) to avoid a DB query on every request
  - [ ] `src/admin/components/RedirectsImportButton.tsx` created: CSV import button in the Redirects collection list view (`admin.components.BeforeListTable`) — parses a CSV file with columns `from,to,type` and bulk-inserts records
  - [ ] The admin panel shows Redirects under the "Tools" nav section (update `CustomNav.tsx`)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/collections/Redirects.ts
  grep "Redirects" src/payload.config.ts
  grep "redirects" src/middleware.ts
  test -f src/admin/components/RedirectsImportButton.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** Redirect collection exists in admin, middleware handles redirects, CSV import button present. Output `<promise>TASK 2.6 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/collections/Redirects.ts` — NEW
  - `src/payload.config.ts` — add Redirects collection
  - `src/middleware.ts` — add redirect lookup + caching
  - `src/admin/components/RedirectsImportButton.tsx` — NEW
  - `src/admin/components/CustomNav.tsx` — add Redirects link under Tools

---

## Layer 3 — Admin Medium Lifts (5 tasks)

> Each task is 1–3 days of work. Sequential within the layer (or parallelized in worktrees if you have them).

---

### Task 3.1: Publishing schedule (admin view)

- **Status:** [ ] Not started
- **Dependencies:** 0.11 (TanStack Query), 0.12 (shared Modal)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `src/admin/views/ScheduleView.tsx` and `src/admin/views/ScheduleViewClient.tsx` created: registered as a custom Payload admin view at `/admin/schedule`
  - [ ] Calendar-based UI showing scheduled publishes grouped by day (for the next 30 days)
  - [ ] Each scheduled item shows: content type icon, title (linked to edit view), scheduled time, board badge
  - [ ] "Today", "This Week", "This Month" tab filter
  - [ ] Clicking an item in the calendar opens a quick-edit popover with: current `publishOn` datetime picker, "Remove Schedule" button (clears `publishOn`, reverts to approved state), "Publish Now" button
  - [ ] Data fetched via TanStack Query from a new API endpoint `GET /api/admin/schedule?from=YYYY-MM-DD&to=YYYY-MM-DD` that queries all workflow-enabled collections for `workflowState=approved AND publishOn IS NOT NULL`
  - [ ] New API route `src/app/(payload)/api/admin/schedule/route.ts` created
  - [ ] Added to `CustomNav.tsx` under the Tools section
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/views/ScheduleView.tsx
  test -f src/admin/views/ScheduleViewClient.tsx
  test -f src/app/'(payload)'/api/admin/schedule/route.ts
  grep "schedule" src/admin/components/CustomNav.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** `/admin/schedule` renders calendar with scheduled items, quick-edit popover works, "Publish Now" transitions state. Output `<promise>TASK 3.1 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/views/ScheduleView.tsx` — NEW (server wrapper)
  - `src/admin/views/ScheduleViewClient.tsx` — NEW (client view)
  - `src/app/(payload)/api/admin/schedule/route.ts` — NEW
  - `src/admin/components/CustomNav.tsx` — add Schedule link
  - `src/payload.config.ts` — register ScheduleView

---

### Task 3.2: Language audit view

- **Status:** [ ] Not started
- **Dependencies:** 0.11 (TanStack Query)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `src/admin/views/LanguageAuditView.tsx` and `src/admin/views/LanguageAuditViewClient.tsx` created: registered at `/admin/language-audit`
  - [ ] Displays a table of all content items (pages, news, projects) with their translation status:
    - Columns: Title (EN), FR Status, Collection, Board, Last Updated
    - FR Status: `Translated` (green) / `Partial` (yellow, some FR fields filled) / `Missing` (red, no FR content)
  - [ ] Filter by: Collection (dropdown), Board (dropdown), FR Status (All/Translated/Partial/Missing)
  - [ ] Batch actions: "Mark as needs translation" (creates a TODO tag on the item), "Open in Editor → FR" (navigates to edit view with `?locale=fr`)
  - [ ] Data fetched via TanStack Query from `GET /api/admin/language-audit?collection=...&board=...&status=...`
  - [ ] New API endpoint `src/app/(payload)/api/admin/language-audit/route.ts` created: queries Payload with `locale=fr`, checks which items have empty `title` in FR locale
  - [ ] Summary cards at top: "X of Y pages translated", "X of Y news items translated", "X of Y projects translated"
  - [ ] Added to `CustomNav.tsx` under Tools section
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/views/LanguageAuditView.tsx
  test -f src/app/'(payload)'/api/admin/language-audit/route.ts
  grep "language-audit" src/admin/components/CustomNav.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** `/admin/language-audit` renders table with FR status per item, filters work, batch "Open in FR editor" works. Output `<promise>TASK 3.2 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/views/LanguageAuditView.tsx` — NEW
  - `src/admin/views/LanguageAuditViewClient.tsx` — NEW
  - `src/app/(payload)/api/admin/language-audit/route.ts` — NEW
  - `src/admin/components/CustomNav.tsx` — add Language Audit link
  - `src/payload.config.ts` — register LanguageAuditView

---

### Task 3.3: Version comparison (diff view)

- **Status:** [ ] Not started
- **Dependencies:** 0.12 (shared Modal)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `src/admin/components/VersionDiffModal.tsx` created:
    - Opens as a modal overlay (using shared `ModalOverlay`)
    - Left panel: fields at Version A (older), Right panel: fields at Version B (newer)
    - Changed fields highlighted with a yellow background; unchanged fields shown in gray
    - Supports text fields, rich text (rendered as HTML diff), select fields, relationships (show label, not ID)
    - "Restore this version" button on any older version (transitions item back to draft with that version's content)
  - [ ] Version comparison button added to Payload's edit view versions panel via `admin.components.views.edit.BeforeDocumentControls` or a custom `VersionsTable` override — appears as "Compare" next to each version in the list
  - [ ] Uses Payload's existing versions API: `GET /api/{collection}/{id}/versions` to fetch version list; `GET /api/{collection}/{id}/versions/{versionId}` for specific version content
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/components/VersionDiffModal.tsx
  grep "VersionDiff\|compare" src/admin/components/VersionDiffModal.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** Diff modal opens for any two versions of a page, changed fields highlighted, restore button works. Output `<promise>TASK 3.3 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/VersionDiffModal.tsx` — NEW
  - `src/payload.config.ts` — register VersionDiffModal on pages, news, projects collections

---

### Task 3.4: Notification center

- **Status:** [ ] Not started
- **Dependencies:** 0.10 (shared types), 0.12 (shared Modal), 0.14 (error handling)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `src/collections/Notifications.ts` created and registered: fields: `recipient` (relationship to users), `type` (select: workflow_transition | lock_alert | system | mention), `message` (text), `link` (text, URL to relevant item), `read` (checkbox, default false), `createdAt` (date, auto)
  - [ ] `src/admin/components/NotificationBell.tsx` created: bell icon in admin header showing unread count badge; click opens a dropdown panel listing recent notifications (last 20); each notification has message, timestamp, "Go to item" link, "Mark as read" button; "Mark all read" button at top of panel
  - [ ] Notification bell added to admin header/nav via `admin.components.Nav` override in `CustomNav.tsx`
  - [ ] Workflow `afterChange` hook creates Notification records when transitions occur:
    - `draft → in_review`: notify all Editors and Admins
    - `in_review → needs_revision`: notify the author who submitted
    - `in_review → approved` or `approved → published`: notify the original author
  - [ ] Notifications polled every 60 seconds (using `setInterval` in NotificationBell, not a websocket)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/collections/Notifications.ts
  grep "Notifications" src/payload.config.ts
  test -f src/admin/components/NotificationBell.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** Bell renders in admin header, workflow transitions create notifications, unread count badge updates, "Mark all read" clears badge. Output `<promise>TASK 3.4 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/collections/Notifications.ts` — NEW
  - `src/payload.config.ts` — register Notifications collection
  - `src/admin/components/NotificationBell.tsx` — NEW
  - `src/admin/components/CustomNav.tsx` — add NotificationBell to header area
  - `src/admin/hooks/workflow-hooks.ts` — add notification creation on transitions

---

### Task 3.5: Dictionary manager (glossary CMS)

- **Status:** [ ] Not started
- **Dependencies:** 0.1 (Payload version)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] `src/collections/Dictionary.ts` created and registered in `payload.config.ts`:
    - `term` — type: `text`, required: true (EN term)
    - `termFr` — type: `text` (FR equivalent)
    - `definition` — type: `richText` (EN definition)
    - `definitionFr` — type: `richText` (FR definition)
    - `category` — type: `select`, options: `['accounting', 'auditing', 'sustainability', 'general']`
    - `relatedTerms` — type: `relationship`, relationTo: `dictionary`, hasMany: true
    - `status` — type: `select`, options: `['draft', 'published']`, defaultValue: `'draft'`
  - [ ] `src/components/GlossaryTooltip.tsx` created: inline component that wraps a term in a `<abbr>` tag with a tooltip showing the definition; pulls definition from a client-side cache (fetched once on page load from `/api/dictionary`)
  - [ ] `GET /api/dictionary` public endpoint returning all published terms for client-side caching
  - [ ] Seed data: 20+ terms covering IFRS, ASPE, sustainability, and auditing concepts
  - [ ] Added to `CustomNav.tsx` under the Collections section
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/collections/Dictionary.ts
  grep "Dictionary\|dictionary" src/payload.config.ts
  test -f src/components/GlossaryTooltip.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** Dictionary collection in admin with CRUD working, GlossaryTooltip renders definition on hover, seed data visible. Output `<promise>TASK 3.5 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/collections/Dictionary.ts` — NEW
  - `src/payload.config.ts` — register Dictionary collection
  - `src/components/GlossaryTooltip.tsx` — NEW
  - `src/app/(payload)/api/dictionary/route.ts` — NEW public endpoint
  - `src/admin/components/CustomNav.tsx` — add Dictionary link

---

## Layer 4 — Big Builds (4 tasks, sequential)

> Major features. Each requires careful planning before execution. Run one at a time. Do NOT parallelize these — they share state across multiple files.

---

### Task 4.1: Live WYSIWYG preview (iframe-based)

- **Status:** [ ] Not started
- **Dependencies:** Layer 1 complete (all 53 components registered), 0.11 (TanStack Query)
- **Skills:** next-best-practices, payload-super
- **Acceptance Criteria:**
  - [ ] Page builder canvas (`BuilderCanvas.tsx`) enhanced to render an actual Next.js preview iframe instead of schematic component previews:
    - Canvas renders `<iframe src="/api/preview?id={pageId}&secret={PREVIEW_SECRET}" />` within the canvas container
    - `PREVIEW_SECRET` env var added to `.env.example`
    - Next.js draft mode / preview route enabled at `src/app/api/preview/route.ts`
  - [ ] `postMessage` bridge implemented: page builder posts `{ type: 'LAYOUT_UPDATE', payload: layoutJSON }` to the iframe on every component add/remove/reorder/prop change; the preview route receives this and re-renders without a full reload
  - [ ] Preview route `src/app/(frontend)/[locale]/(frontend)/[...slug]/preview.tsx` (or equivalent) reads the `postMessage` layout and renders it using `RenderBlocks`
  - [ ] Canvas iframe width changes match the responsive preview breakpoints (Desktop: 1440px, Tablet: 768px, Mobile: 375px) using `style={{ width: breakpointWidth }}`
  - [ ] "Open Preview in New Tab" button in builder toolbar opens the live preview URL in a new tab
  - [ ] `npx tsc --noEmit` passes
  - [ ] No regression: all existing builder features (undo/redo, drag-drop, props drawer) still work
- **Validation Commands:**
  ```bash
  test -f src/app/api/preview/route.ts
  grep "PREVIEW_SECRET" .env.example
  grep "postMessage\|LAYOUT_UPDATE" src/admin/views/PageBuilderClient.tsx
  npx tsc --noEmit
  npm run build  # must pass
  ```
- **Stop Condition:** Builder canvas shows actual rendered page preview, layout changes reflected live in iframe, breakpoint toggle resizes iframe. Output `<promise>TASK 4.1 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/app/api/preview/route.ts` — NEW
  - `src/admin/views/BuilderCanvas.tsx` — add iframe + postMessage
  - `src/admin/views/PageBuilderClient.tsx` — post LAYOUT_UPDATE on state changes
  - `.env.example` — add PREVIEW_SECRET

---

### Task 4.2: Field editing Level 2 (inline editing)

- **Status:** [ ] Not started
- **Dependencies:** 4.1 (iframe must be working first)
- **Skills:** react-best-practices, payload-super
- **Acceptance Criteria:**
  - [ ] Text content (headings, body paragraphs) in the preview iframe is clickable for inline editing:
    - `iframe` JavaScript sends a `HOVER_ELEMENT` message when the user hovers over an editable element (identified by `data-builder-field` attribute)
    - Hovered elements show a subtle blue outline
    - Click sends a `SELECT_ELEMENT` message to the parent page builder
    - Parent page builder opens the Props Drawer for that component and auto-focuses the correct field
  - [ ] `src/app/(frontend)/[locale]/(frontend)/[...slug]/preview.tsx` updated to inject editing attributes (`data-builder-zone`, `data-builder-component-id`, `data-builder-field`) into rendered HTML when `?editing=true` query param is present
  - [ ] Image components in preview show a "Replace Image" overlay on hover that opens the Media Picker Modal
  - [ ] All edits still go through the Props Drawer → Apply flow (no direct DOM mutation)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  grep "data-builder-field\|HOVER_ELEMENT\|SELECT_ELEMENT" src/app/'(frontend)'/
  grep "data-builder-component-id" src/app/'(frontend)'/
  npx tsc --noEmit
  ```
- **Stop Condition:** Hovering elements in iframe shows highlight, clicking opens correct Props Drawer field, image hover shows replace overlay. Output `<promise>TASK 4.2 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/app/(frontend)/[locale]/(frontend)/[...slug]/preview.tsx` — add editing attributes
  - `src/admin/views/BuilderCanvas.tsx` — handle HOVER_ELEMENT and SELECT_ELEMENT messages

---

### Task 4.3: Field editing Level 3 (contenteditable rich text)

- **Status:** [ ] Not started
- **Dependencies:** 4.2 (Level 2 inline editing must be working)
- **Skills:** react-best-practices
- **Acceptance Criteria:**
  - [ ] Rich text fields in preview iframe become `contenteditable` when in editing mode:
    - `<p>`, `<h2>`, `<h3>` elements with `data-builder-field` receive `contenteditable="true"` attribute
    - A mini floating toolbar appears above the selected text with Bold, Italic, Link buttons
    - On blur, the `innerHTML` is serialized and sent via `postMessage` as a `FIELD_UPDATE` message to the parent builder
    - Parent builder updates the component's `propsSchema` field value and marks the layout as dirty (triggers save indicator)
  - [ ] A floating mini-toolbar `src/admin/components/builder/InlineEditToolbar.tsx` renders at cursor position with Bold, Italic, Underline, Link
  - [ ] Changes trigger undo history (treated as a FIELD_UPDATE action in `useBuilderState`)
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/admin/components/builder/InlineEditToolbar.tsx
  grep "contenteditable\|FIELD_UPDATE" src/app/'(frontend)'/
  grep "FIELD_UPDATE" src/admin/views/BuilderCanvas.tsx
  npx tsc --noEmit
  ```
- **Stop Condition:** Rich text in preview is directly editable, floating toolbar appears, changes sync to props drawer and undo history. Output `<promise>TASK 4.3 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/admin/components/builder/InlineEditToolbar.tsx` — NEW
  - `src/admin/views/BuilderCanvas.tsx` — handle FIELD_UPDATE from iframe
  - `src/admin/views/PageBuilderClient.tsx` — dispatch FIELD_UPDATE to reducer
  - `src/admin/components/builder/useBuilderState.ts` — add FIELD_UPDATE action

---

### Task 4.4: /cms shell page (admin quick-start)

- **Status:** [ ] Not started
- **Dependencies:** Layer 2 complete (redirects, command palette available), 0.2 (brand constant)
- **Skills:** next-best-practices
- **Acceptance Criteria:**
  - [ ] Route `src/app/(payload)/cms/page.tsx` created: a public-facing, unauthenticated "admin quick-start" page at `/cms`
  - [ ] Page renders a clean branded shell with:
    - RAS Canada logo and "Content Management" heading
    - Quick links grid: "Go to Admin Panel" (`/admin`), "Content Tree" (`/admin/tree`), "Page Builder" (`/admin/builder`), "Workbox" (`/admin/workbox`), "Media Library" (`/admin/media`), "Style Guide" (`/storybook` if available)
    - "Status" section showing: database connection health, Payload version, Next.js version (from `package.json`), last deployment time (from build-time env var `NEXT_PUBLIC_BUILD_TIME`)
    - Recent deployments section (placeholder for CI/CD webhook data)
  - [ ] Page accessible without authentication (no Payload auth check on this route)
  - [ ] Page linked from `CustomNav.tsx` footer area
  - [ ] `NEXT_PUBLIC_BUILD_TIME` added to `.env.example` with description
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  test -f src/app/'(payload)'/cms/page.tsx
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms
  # Expected: 200 without authentication
  grep "NEXT_PUBLIC_BUILD_TIME" .env.example
  npx tsc --noEmit
  ```
- **Stop Condition:** `/cms` returns 200 without auth, all quick links present, version info visible. Output `<promise>TASK 4.4 COMPLETE</promise>`
- **Files to create/modify:**
  - `src/app/(payload)/cms/page.tsx` — NEW
  - `.env.example` — add NEXT_PUBLIC_BUILD_TIME
  - `src/admin/components/CustomNav.tsx` — add `/cms` link in footer

---

## Layer 5 — Polish (3 tasks)

> Final quality pass before considering the admin platform "production ready."

---

### Task 5.1: UI.sh design pass

- **Status:** [ ] Not started
- **Dependencies:** Layer 4 complete
- **Skills:** ui, web-design-guidelines, userinterface-wiki
- **Acceptance Criteria:**
  - [ ] All custom admin components audited against UI.sh patterns and project design tokens:
    - Consistent spacing: all gaps/paddings use design system spacing tokens (not arbitrary px values)
    - Consistent typography: all text uses `text-sm`, `text-base`, `text-lg` utility classes (not arbitrary font-size)
    - Consistent interactive states: all buttons have visible focus rings; all inputs have focus border using `--color-primary`
    - Consistent status colors: all workflow state colors use `STATE_COLORS` map from shared types
  - [ ] Admin dark mode: verify all custom components look correct in Payload's dark mode (if Payload admin uses dark mode)
  - [ ] Loading states: all data-fetching views (Dashboard, Workbox, ContentTree, LanguageAudit, Schedule) have skeleton loading states, not blank flash-of-content
  - [ ] Empty states: all list views have illustrated empty state messages (not just blank areas)
  - [ ] Error states: all async operations have visible error messages with retry actions
  - [ ] WCAG 2.2 AA: all interactive elements ≥ 24×24px, all text contrast ≥ 4.5:1, all focus indicators visible
  - [ ] `npx tsc --noEmit` passes
  - [ ] `npx storybook build --quiet` exits 0
- **Validation Commands:**
  ```bash
  npx tsc --noEmit
  npx storybook build --quiet
  # Manual: audit each admin view for spacing, typography, and state consistency
  ```
- **Stop Condition:** All admin views have consistent design, loading/empty/error states present, WCAG 2.2 checks pass. Output `<promise>TASK 5.1 COMPLETE</promise>`
- **Files to create/modify:**
  - Multiple admin component files — targeted CSS/class corrections
  - Loading skeleton components added where missing

---

### Task 5.2: Architecture + security audit

- **Status:** [ ] Not started
- **Dependencies:** Layer 4 complete
- **Skills:** security-audit-orchestrator, security-audit-authentication, security-audit-api-encryption
- **Acceptance Criteria:**
  - [ ] All admin API routes (`/api/tree`, `/api/tree/search`, `/api/admin/*`) protected by Payload auth middleware — unauthenticated requests return 401
  - [ ] CSRF protection verified: all mutation endpoints (workflow transitions, tree moves, bulk operations) require POST/PATCH/DELETE methods (not GET)
  - [ ] `PREVIEW_SECRET` used correctly: preview route validates the secret before enabling draft mode
  - [ ] No secrets in client-side code: scan with `grep -r "process.env\." src/` — only `NEXT_PUBLIC_*` vars should appear in `'use client'` files
  - [ ] Rate limiting on workflow transition endpoint: max 30 transitions per user per minute (use simple in-memory counter or Payload's beforeOperation hook)
  - [ ] SQL injection impossible: all Payload `where` clauses use typed Payload query builders, not raw SQL strings
  - [ ] Audit report written to `.ai-reports/AUDIT_LOG.md` with findings and remediations
  - [ ] `npx tsc --noEmit` passes
- **Validation Commands:**
  ```bash
  curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/tree
  # Expected: 401 (unauthenticated)
  grep -r "process\.env\.[^N]" src/admin/  # Should return 0 (no non-NEXT_PUBLIC env in admin client code)
  npx tsc --noEmit
  ```
- **Stop Condition:** All admin APIs return 401 unauthenticated, no server secrets in client code, audit findings documented. Output `<promise>TASK 5.2 COMPLETE</promise>`
- **Files to create/modify:**
  - Various API route files — add auth guards
  - `src/app/(payload)/api/preview/route.ts` — validate PREVIEW_SECRET
  - `.ai-reports/AUDIT_LOG.md` — document findings

---

### Task 5.3: Plugin extraction scoping

- **Status:** [ ] Not started
- **Dependencies:** Layer 4 complete, 5.2 (security issues resolved first)
- **Skills:** payload-super
- **Acceptance Criteria:**
  - [ ] Scoping document written to `.ai-reports/plugin-extraction-scope.md` analyzing which admin features could be extracted as reusable Payload plugins:
    - `payload-admin-tree` — ContentTree view, tree API, drag-and-drop, context menu
    - `payload-admin-workbox` — Workbox view, workflow state machine, workflow hooks, rejection modal
    - `payload-admin-builder` — Page builder view, component registry pattern, preview iframe bridge
    - `payload-admin-media-folders` — MediaLibrary view with folder hierarchy on top of Payload's built-in media
  - [ ] For each candidate plugin, the document covers:
    - What Payload internals it depends on (admin components, hooks, collections, globals)
    - What project-specific code would need to be extracted into config options
    - Estimated effort to extract (S/M/L)
    - Whether it would be valuable to open source
  - [ ] Document identifies the shared `useBuilderState` reducer and `componentRegistry` as the most reusable pieces
  - [ ] No code changes — this is a planning/scoping task only
  - [ ] Document saved at `.ai-reports/plugin-extraction-scope.md`
- **Validation Commands:**
  ```bash
  test -f .ai-reports/plugin-extraction-scope.md
  wc -l .ai-reports/plugin-extraction-scope.md
  # Expected: > 50 lines (substantive document)
  ```
- **Stop Condition:** Scoping document exists with analysis of all 4 plugin candidates and effort estimates. Output `<promise>TASK 5.3 COMPLETE</promise>`
- **Files to create/modify:**
  - `.ai-reports/plugin-extraction-scope.md` — NEW

---

## Layer 5 Gate (Admin Platform Complete)

```bash
npm run build
npx tsc --noEmit
npx vitest run
npx storybook build --quiet
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/admin
# Expected: 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/tree
# Expected: 401 (protected)
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms
# Expected: 200 (public)
grep -r "FRAS Canada" src/
# Expected: zero results
```

**Final Gate Stop:** All commands pass. Output `<promise>ADMIN PLATFORM COMPLETE</promise>`

---

## Ralph Loop Session Rules (Admin Platform Layers)

**Before doing any work in a session:**
1. Read this file — find the first `[ ]` task in your assigned layer
2. Check git status to understand what was changed in prior sessions
3. Read the relevant source files before editing them
4. Check dependencies — if a task lists dependency tasks, verify those are `[x]` first

**While working:**
1. Mark the current task as `[~]` in this file
2. Build the thing — follow acceptance criteria exactly
3. Run the validation commands listed in the task
4. If validation passes: mark `[x]` in this file, update `AUDIT_LOG.md`
5. If validation fails: fix the issue, re-validate. Do NOT mark `[x]` until passing
6. Move to the next `[ ]` task

**After completing a layer:**
1. Run the Layer Gate commands
2. All must pass before starting the next layer
3. Git commit with message: `feat(admin-layer-N): [brief description]`
4. Update `AUDIT_LOG.md` with summary of what was built

**Task-level stop condition:** Output `<promise>TASK N.X COMPLETE</promise>`
**Layer-level stop condition:** Output `<promise>LAYER N COMPLETE</promise>`
**Platform-level stop condition:** Output `<promise>ADMIN PLATFORM COMPLETE</promise>`
