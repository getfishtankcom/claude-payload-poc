# Spike — Extracting the Content Tree Viewer as a Payload Plugin

> **Purpose:** Hackathon-ready research for shipping the FRAS content tree as a reusable Payload 3.x plugin (`@fishtank/payload-plugin-content-tree`). Builds on `.ai-reports/layer-5-plugin-extraction-scoping.md` (see Candidate #2) — adds the concrete config schema, decoupling work, and a phased extraction plan.
>
> **TL;DR:** Plugin (not module). Two-day MVP path is realistic; it ships as a workspace package the team can `pnpm link` during the hack-a-thon, then promote to npm later.

---

## 1. What "the tree viewer" actually is

A Sitecore-style hierarchical content browser registered as a custom Payload admin view at `/admin/tree`. Three-pane behaviour: search bar, left tree, right edit iframe. Features: lazy-load children, DnD reorder/reparent, right-click context menu (insert/duplicate/rename/move/lock/delete), gutter indicators (workflow dot, lock icon), keyboard friendly, persisted expand state.

**Source files (parent repo, on `feat/admin-platform-layer-X` branches):**

| Path | LOC | Role |
|---|---|---|
| `src/admin/views/ContentTree.tsx` | 19 | Server-component shell registered in payload config |
| `src/admin/views/ContentTreeClient.tsx` | 1067 | Main client view — tree state, search, DnD, context menu, edit iframe |
| `src/admin/components/TreeContextMenu.tsx` | 375 | Right-click menu, gated by role + insert-options table |
| `src/admin/components/TreeDndWrapper.tsx` | 351 | `@dnd-kit` wrapper, drop-zone math, sortOrder calc |
| `src/admin/types/tree.ts` | 32 | `TreeNode` / `FolderNode` types |
| `src/admin/config/insertOptions.ts` | 92 | Parent-type → allowed-child-type table (Sitecore "insert options") |
| `src/app/api/tree/route.ts` | 119 | `GET /api/tree` — full tree + lazy children |
| `src/app/api/tree/search/route.ts` | 126 | `GET /api/tree/search` — deep search + ancestor expand IDs |

**Backing data:** the `pages` collection. Required fields: `parent` (self-relation), `sortOrder` (number), `contentType` (select), `title`, `slug`. Optional fields the tree currently reads: `workflowState`, `lockedBy`, `board`, `hasTranslation`.

---

## 2. Module vs Plugin — recommend Plugin

| | Module (copy/paste folder, drop into `src/`) | **Plugin (npm package + Payload plugin fn)** |
|---|---|---|
| Time to share at hack-a-thon | 1 hr (zip the folder, paste a README) | 1–2 days (proper API, config, decouple) |
| Activation effort for consumer | 7 file moves, 6 imports, manual route registration, `payload.config.ts` edits | One import + one entry in `plugins: []` |
| Maintenance | Forks diverge instantly | Single source of truth |
| Hard-coded `pages` slug | Stays hard-coded — consumer hand-edits | Becomes `collectionSlug` config |
| Workflow / lock fields | Required — breaks if missing | Optional via field-map config |
| Marketing | "We have a tree component" | "We have a Payload plugin" |

**Recommendation: Plugin.** Module path encourages forks-by-paste and gets stale within weeks. Plugin path is only ~1 day more effort, and hack-a-thon dev experience is dramatically better (`pnpm add` + 6 lines of config). The scoping doc already names this `payload-plugin-content-tree` — keep that name.

---

## 3. Proposed plugin API

Single function with one config object. Sane defaults so a new project can call `contentTreePlugin()` with nothing if their collection happens to be named `pages` and uses the same field names.

```ts
// payload.config.ts (consumer-side)
import { contentTreePlugin } from '@fishtank/payload-plugin-content-tree'

export default buildConfig({
  // ...
  plugins: [
    contentTreePlugin({
      // REQUIRED
      collectionSlug: 'pages',

      // OPTIONAL — field name overrides (defaults shown)
      fields: {
        parent: 'parent',
        sortOrder: 'sortOrder',
        contentType: 'contentType',
        title: 'title',
        slug: 'slug',
        workflowState: 'workflowState', // set false to disable gutter dot
        lockedBy: 'lockedBy',           // set false to disable lock icon
      },

      // OPTIONAL — admin route mount path (default: '/tree')
      adminPath: '/tree',

      // OPTIONAL — Sitecore-style insert options
      // Maps parent contentType (or slug pattern) → allowed child types.
      // If omitted, every contentType can host every other.
      insertOptions: {
        root: ['page', 'folder'],
        folder: ['page', 'folder'],
        page: ['page'],
      },
      contentTypeLabels: {
        page: 'Page',
        folder: 'Folder',
      },
      maxDepth: 5,

      // OPTIONAL — auto-inject the required tree fields onto the collection
      // (parent, sortOrder, contentType). Default: true. Set false if your
      // collection already has them under different names mapped above.
      injectFields: true,

      // OPTIONAL — disable DnD or context menu features individually
      features: {
        dragAndDrop: true,
        contextMenu: true,
        deepSearch: true,
      },
    }),
  ],
})
```

### What the plugin does at config-build time

1. **Validates** the target collection exists and exposes the required fields (or injects them if `injectFields: true`).
2. **Registers a custom admin view** under `admin.components.views.contentTree` at `adminPath`.
3. **Registers two Payload REST endpoints** via the `endpoints` config (NOT Next.js route files): `GET /api/{adminPath}` and `GET /api/{adminPath}/search`. This is the key portability win — no `src/app/api/...` files in the consumer's repo.
4. **Bundles the React tree UI** as the view component (DnD wrapper, context menu, etc.).

### Optional companion: a hook helper

```ts
// for consumers who want to surface the tree elsewhere (e.g. a sidebar in PageBuilder)
import { useContentTree } from '@fishtank/payload-plugin-content-tree/client'
const { tree, expand, collapse, refetch } = useContentTree({ root: 'home' })
```

---

## 4. Decoupling work — what's hard-coded today

Four cuts have to be made before the plugin can be project-agnostic:

### 4.1 Hard-coded collection slug
- `app/api/tree/route.ts:67` and `search/route.ts:60` call `payload.find({ collection: 'pages', ... })`.
- **Fix:** read `collectionSlug` from plugin options closure when registering endpoints.

### 4.2 Hard-coded field names + inferred shape
- `toTreeNode()` in `route.ts` reads `parent`, `board`, `slug`, `contentType`, `workflowState`, `lockedBy`. `board` is FRAS-specific.
- **Fix:** field-map config from §3. Drop `board` to a generic `extraFields: string[]` array that the consumer can opt into; render any extras as plain badges.

### 4.3 FRAS-specific INSERT_OPTIONS
- `admin/config/insertOptions.ts` hard-codes `'boards-folder'`, `'projects-folder'`, etc. — useless to anyone else.
- **Fix:** ship the table as **default = empty** (i.e. "any can host any"). Consumer passes their own table via config. Move `getAllowedInserts()` / `getInsertOptionsLabelled()` into the plugin runtime so it consumes the config object.

### 4.4 Workflow / lock dependency
- `ContentTreeClient.tsx:34` imports `UserWithRole` from `../types/workflow`. Gutter dot + lock icon assume `workflowState` and `lockedBy` exist.
- **Fix:** make both fields optional. Skip rendering the dot if `fields.workflowState === false`. Same for lock. Replace `UserWithRole` with a minimal in-plugin type `{ id; role?: string }`.

### 4.5 Mutation endpoints
- The view PATCHes `/api/pages/:id`, POSTs `/api/pages`, DELETEs `/api/pages/:id` directly. These are Payload's REST routes for `pages` — they only work because the host has a `pages` collection.
- **Fix:** parameterise the base path: `apiBase = ` /api/${collectionSlug}``. No extra plugin code needed; just pass the slug to the client view via the registered admin component's props (Payload allows `clientProps` on custom views in 3.x).

### 4.6 TanStack Query provider requirement
- The view uses `useQuery` and assumes a `QueryClientProvider` is present (set up in the FRAS shell via `QueryProvider.tsx`).
- **Fix:** detect-or-create. The plugin's view component wraps itself in its own `QueryClientProvider` if there isn't one in scope. Cheap to add.

### 4.7 Local UI primitives
- `ContentTreeClient.tsx:37` imports `ModalOverlay`, `ModalButton` from `../components/ui/Modal`.
- **Fix:** copy those small components into the plugin package (or replace with a 30-line internal modal). Don't try to make them themable for v0.1.

---

## 5. Extraction plan — phased

### Phase A: Hack-a-thon MVP (target: 1 working day)

**Goal:** the dev team can `pnpm add file:../payload-plugin-content-tree` and have a working tree against any Payload collection with `parent` + `sortOrder` + `contentType` fields.

1. Create `packages/payload-plugin-content-tree/` workspace inside this repo (tsup build, single ESM entry).
2. Copy the 8 source files in §1 verbatim. Keep tree types as-is.
3. Apply the four "must-have" decouples: §4.1, §4.2, §4.3 default-empty, §4.5 base-path.
4. Convert the two Next route handlers into Payload `endpoints` (`config.endpoints.push(...)`). Same logic, different entry shape. ~30 min each.
5. Write the plugin function: collection lookup, optional field injection, view registration, endpoint registration.
6. Replace `useAuth` consumption with the simpler `{ id, role? }` shape (see §4.4).
7. Build, `pnpm pack`, hand around the tarball OR add as a workspace dep.
8. Smoke test in a fresh Payload sandbox: collection with three fields → tree view shows up.

Skip for MVP: theme tokens, deep-link to selected node, keyboard navigation polish, virtualization, i18n of menu labels.

### Phase B: Public-ready (target: 1 week after hack-a-thon)

- Add `injectFields` auto-injection (4.4 leftover).
- Storybook stories ported from `*.stories.tsx`.
- Vitest tests for `getAllowedInserts`, depth cap, ancestor resolution.
- README with copy-paste config + GIF.
- CI: lint, typecheck, build, publish-on-tag.
- Theme variables namespaced under `--ct-*` so consumers can restyle without forking.

### Phase C: Publish

- npm scope (`@fishtank/`) — confirm with leadership.
- Pin peer deps: `payload@^3.0.0`, `react@^18 || ^19`, `@payloadcms/ui@^3`.
- MIT license. Drop in the PRD's footer line: "Built for FRAS Canada by Fishtank."

---

## 6. Risk register

| Risk | Mitigation |
|---|---|
| Payload 3.x custom-view API changes between minor versions | Pin `payload@^3.84` for v0.1; bump on each Payload upgrade |
| `@dnd-kit` peer-dep mismatch with consumer | Mark as `peerDependency` and document |
| Bundle size (TanStack Query + dnd-kit ~80kB) | Acceptable inside admin; document. v0.2 can lazy-load DnD |
| Field-map mistakes silently break the view | Validate field types at `buildConfig` time and throw with a clear error |
| Hardcoded English in context menu | Phase B — accept `labels` config object |

---

## 7. What we ship to the hack-a-thon

A 5-line README + the plugin tarball:

```bash
pnpm add @fishtank/payload-plugin-content-tree
```

```ts
// payload.config.ts
import { contentTreePlugin } from '@fishtank/payload-plugin-content-tree'

export default buildConfig({
  // ...
  plugins: [contentTreePlugin({ collectionSlug: 'pages' })],
})
```

Visit `/admin/tree`. Done.

---

## 8. Open questions for the team

1. **Naming / scope.** `@fishtank/payload-plugin-content-tree` vs `@frascanada/...` vs unscoped `payload-plugin-content-tree`. (Recommend `@fishtank/` — survives client churn.)
2. **Workspace layout.** Add `packages/` and convert this repo to npm workspaces, or extract to its own repo on day 1? (Recommend monorepo `packages/` for hack-a-thon, separate repo for npm publish.)
3. **License.** MIT (recommended, matches Payload).
4. **Multi-collection trees.** v0.1 = one collection per plugin instance. Multi-collection (e.g. mixing `pages` + `media`) is a v0.3 feature; skip for now.
5. **Aptify role gating.** TreeContextMenu has FRAS-specific `'admin' | 'editor' | 'author'` role checks. Ship as a `canPerformAction(action, user, node) => boolean` callback in plugin config; default = always-true.

---

## 9. References

- `.ai-reports/layer-5-plugin-extraction-scoping.md` §2 — scoping recommendation
- `.ai-reports/PRD-admin-panel.md` §4.4 — insert-options table source of truth
- Payload docs: [Plugin development](https://payloadcms.com/docs/plugins/overview), [Custom views](https://payloadcms.com/docs/admin/views), [Endpoints](https://payloadcms.com/docs/rest-api/overview#custom-endpoints)
