# Admin Platform — Layer 0 Spike & Discovery

> **Purpose:** Pin down the technical architecture for the Sitecore-style admin (content tree + visual page builder) before Phase 1A starts. This document EXTENDS — it does not replace — `PRD-admin-panel.md`. The PRD covers WHAT to build (surfaces, workflows, permissions). This spike covers HOW to build it (libraries, extension points, storage model, build-vs-buy).
> **Date:** 2026-04-30
> **Branch:** `feat/admin-platform-layer-0`
> **Companion docs:**
> - `research-sitecore-admin-interface.md` — Sitecore reference (774 lines)
> - `PRD-admin-panel.md` — admin panel PRD (1,073 lines)
> - `BUILD_PLAN.md` / `MASTER_TODO.md` — Phase 1 tasks
> **Status:** Discovery — needs human review before Phase 0 POCs are executed

> **⚠ Update — 2026-04-30 (post-grill-me on `merry-scribbling-hejlsberg`):**
> **D2 (Tree UI library) collapses to "consume the plugin."** The content tree is being extracted as a standalone OSS plugin: `@fishtank/payload-plugin-content-tree` (public repo on `getfishtank` org, MIT, install via tagged GitHub URL in v0.1, npm publish in v0.2). The plugin itself is built on `react-arborist` — same recommendation §5.2 reaches independently — so this worktree no longer needs to integrate arborist directly. When Phase 1A starts:
> - Section 5 (D2) becomes: `plugins: [contentTreePlugin({ collectionSlug: 'pages', ... })]` in `payload.config.ts`.
> - Section 4 (D1, nested-docs) is unaffected — the plugin operates on top of any self-referencing parent field, so nested-docs still backs the data model.
> - Section 3 (D3, Puck) is unaffected — Puck integrates via the plugin's `editUrlBuilder` config, pointing the right-rail iframe at `/admin/builder/:id`.
> - Section 6.5 / Phase 0 POC for the tree should be replaced with: "consume the plugin's `examples/basic` sandbox, then swap FRAS to it via the FRAS-swap PR."
>
> Plugin design + day-1 build order: see `merry-scribbling-hejlsberg` worktree → `.ai-reports/spike-content-tree-plugin.md` (what & why) and `spike-content-tree-plugin-sketch.md` (file-by-file code skeleton).
>
> **Sequencing:** plugin v0.1 ships first; this worktree's Phase 1A picks it up after the v0.1 tag.

---

## 1. Why this spike exists

`PRD-admin-panel.md` was written on 2026-03-05 and is mature on requirements (5-state workflow, locking, page templates with locked + editable zones, the workbox, the media library) but it makes only loose technical commitments:

- "Custom Payload admin views" — but doesn't pin down the Payload 3 extension surface or the auth/SSR model
- "`react-arborist` or custom" for the tree — undecided
- "Component placement stored as JSON in a `layout` field" — invents a custom shape rather than evaluating Puck / similar
- Doesn't address that the `nested-docs` plugin already solves the parent/breadcrumbs problem
- Doesn't address that Payload's **official Tree View RFC** (#13982) is in active development as of Feb 2026

The user is also explicit: **do not use the OOTB Payload Blocks UI** for the page builder. We need a Sitecore Experience Editor / SXA-style experience that pairs cleanly with the content tree.

This spike resolves four decisions and produces a Phase 0 POC checklist.

---

## 2. Decisions to make

| # | Decision | Options | Recommendation |
|---|----------|---------|----------------|
| D1 | Tree storage model | (a) `nested-docs` plugin (parent + breadcrumbs); (b) Postgres `ltree` materialized path; (c) wait for native `treeView: true` | **(a) nested-docs now**, with a thin abstraction so we can swap to native tree view later |
| D2 | Tree UI library | (a) `react-arborist`; (b) `react-complex-tree`; (c) custom on `@dnd-kit/core` | **(a) react-arborist** — most OOTB features (virtualization, DnD, search), MIT, actively maintained |
| D3 | Page builder engine | (a) Puck (`@measured/puck`); (b) custom on `@dnd-kit` + Payload JSON field; (c) Payload Blocks (rejected by user) | **(a) Puck**, wrapped in a custom Payload admin route that proxies the JSON to a Payload field |
| D4 | Live preview architecture | (a) Puck-only canvas; (b) Payload Live Preview-only (drawer); (c) hybrid — Puck canvas IS the preview for pages, Payload Live Preview for non-page collections | **(c) hybrid**, with the Puck iframe loading the *real* Next.js page route (not an isolated `<Puck.Render>`) so editor chrome overlays the real shell, header, footer, and styling |

The rest of this doc justifies each decision and lists the work needed to prove them.

---

## 3. Payload 3.x admin extension surface (the HOW)

Confirmed mechanics for Payload `^3.77.0` (current dependency in `package.json`):

### 3.1 Mounting custom Root views

```ts
// payload.config.ts
export default buildConfig({
  admin: {
    components: {
      views: {
        // Replace the default dashboard
        dashboard: { Component: '/admin/views/Dashboard#Dashboard' },
        // Add brand-new top-level routes under /admin
        contentTree: {
          Component: '/admin/views/ContentTree#ContentTree',
          path: '/tree',
        },
        pageBuilder: {
          Component: '/admin/views/PageBuilder#PageBuilder',
          path: '/builder/:id',
        },
        workbox: {
          Component: '/admin/views/Workbox#Workbox',
          path: '/workbox',
        },
        mediaLibrary: {
          Component: '/admin/views/MediaLibrary#MediaLibrary',
          path: '/media',
        },
      },
    },
  },
})
```

### 3.2 Critical gotchas

1. **Custom views are public by default.** Payload does NOT auth-gate them. Every custom view must call `payload.auth({ headers })` server-side and 302 to `/admin/login` if no user. This belongs in a shared `requireAuth()` helper.
2. **Server vs client split.** Custom views are React Server Components by default. Anything that needs DnD, drag handles, or `postMessage` (i.e. all four custom views) needs `'use client'` boundaries. Pattern: keep the route export as RSC for auth + initial data fetch, then render a `<TreeClient initialData={…} />` etc.
3. **Use `@payloadcms/ui` primitives** so chrome (sidebar, header, theming, gravatar) is consistent with OOTB views. Already in deps.
4. **Type-safe data via Local API.** Inside an RSC view, import `getPayload` from `payload` and call `payload.find/findByID/update` directly — no HTTP, no fetch token, runs in-process.
5. **Generated types.** Re-run `npm run generate:types` and `generate:importmap` whenever views or fields change — the importmap is what wires the string `'/admin/views/Dashboard#Dashboard'` to the actual module at runtime.
6. **Sidebar navigation.** Add tree/builder/workbox/media links via `admin.components.beforeNavLinks` — they don't auto-appear from the `views` config.

### 3.3 Reference

- [Customizing Views | Payload docs](https://payloadcms.com/docs/custom-components/custom-views)
- [Swap in your own React components | Payload docs](https://payloadcms.com/docs/admin/components)
- [Payload Admin UI guide | Build with Matija](https://www.buildwithmatija.com/blog/payload-cms-custom-admin-ui-components-guide)

---

## 4. D1 — Tree storage model

### 4.1 What `@payloadcms/plugin-nested-docs` gives us

- Adds `parent` relationship field to the configured collection(s)
- Adds `breadcrumbs` array auto-populated from the parent chain (label, url, doc id)
- Cascades updates: rename or move a parent → children breadcrumbs recompute
- Localized by default if `localization` is enabled (we have EN/FR)
- Custom URL generator hook (we'll plug our slug strategy here)

This handles the entire "tree as data" layer for `pages` and any other hierarchical collection (e.g. standards sections).

### 4.2 What it does NOT give us

- A tree UI in admin (it just renders a parent dropdown in the doc edit view)
- Sort order between siblings (we add a `sortOrder` integer field)
- Cross-collection unification — Sitecore's tree mixes pages, data items, settings, media in one view. Nested-docs is per-collection.

### 4.3 Cross-collection unification strategy

Sitecore mental model: **one tree, many item types**. We don't need to flatten everything into one collection — that loses Payload's per-collection field schemas. Instead:

- Tree UI **virtually merges** roots: `pages`, `boards`, `projects`, `consultations`, `news`, `events`, `documents`, `contacts`, `members`, `media`, `settings` each appear as a top-level node.
- Under each root, that collection's nested-docs hierarchy renders.
- Insert Options (PRD §4.4) are computed from the parent's collection + a small `treeRules` config: e.g. `pages` accepts only `pages` as children; `boards` root accepts `boards` only.
- A single REST endpoint `GET /api/admin/tree?root=:collection&parent=:id` returns the children of a node (lazy load on expand).

### 4.4 Why not Postgres `ltree` / materialized path?

- The official RFC explicitly **rejects** stored materialized paths for cascade-vs-draft reasons. We should not pre-empt that decision.
- `nested-docs` already does breadcrumb computation; performance is fine up to thousands of items with proper indexes.
- The Sitecore dump shows ~1,400 items total — well within parent-pointer + lazy-load capacity.

### 4.5 Migration to native Tree View

When Payload ships `treeView: true` (PR #15470, no release date):
- The `parent` + `breadcrumbs` fields are likely the same data shape — migration should be a config flag flip, not a data migration.
- Our custom `<ContentTree>` view becomes a candidate for replacement; the custom right-click menu, gutter indicators, and cross-collection unification probably stay on top of the native primitive.

### 4.6 Reference

- [Nested Docs Plugin docs](https://payloadcms.com/docs/plugins/nested-docs)
- [Tree View RFC #13982](https://github.com/payloadcms/payload/discussions/13982)

---

## 5. D2 — Tree UI library

> **Superseded 2026-04-30:** see top-of-doc update — D2 collapses to consuming `@fishtank/payload-plugin-content-tree` (which is itself built on react-arborist, validating §5.2 below). Analysis preserved for context.

### 5.1 Comparison

| Library | Virtualization | DnD | Search | A11y | React 19 | License | Bundle |
|---------|---------------|-----|--------|------|----------|---------|--------|
| **react-arborist** | yes (built-in) | yes (built-in) | yes (built-in) | good | yes | MIT | ~25 kB |
| **react-complex-tree** | yes | yes | manual | excellent | yes | MIT | ~30 kB |
| **dnd-kit** custom | manual | yes (composable) | manual | manual | yes | MIT | ~20 kB + your code |

### 5.2 Recommendation — `react-arborist`

- Fastest path to the PRD §4.2 feature set: virtualized rendering, drag-to-reorder, drag-to-different-parent, search-as-filter, expand state, keyboard nav — all built in.
- `Tree` component takes a flat array + `childrenAccessor`, so it pairs cleanly with our lazy-loaded `/api/admin/tree` endpoint.
- Custom node renderer means we own the look (gutter icons, type icons, lock badge, workflow dot), the right-click context menu (PRD §4.3), and the inline rename UI.
- Trade-off: less customizable than dnd-kit. If we need exotic interactions later (multi-select drag with checkboxes, copy-on-drag, etc.) we'd hit limits.

### 5.3 Reference

- [react-arborist on GitHub](https://github.com/brimdata/react-arborist)
- [Build a tree view with react-arborist (DEV)](https://dev.to/igorfilippov3/build-tree-view-with-react-arborist-part-1-b5l)
- [Tree library comparison (npm-compare)](https://npm-compare.com/react-complex-tree,react-sortable-tree,react-treebeard)

---

## 6. D3 — Page builder engine

### 6.1 Why not Payload Blocks

User explicitly rejected. Beyond user preference, the structural reasons:

- Blocks render as **stacked form sections** in admin — no canvas, no live preview, no drag-onto-page paradigm
- No notion of locked vs editable zones — every block is freely deletable/reorderable
- No component categories or toolbox — just a flat "add block" picker
- No responsive preview, no inline text editing, no chrome overlays

### 6.2 Why Puck

Puck (MIT, [puckeditor.com](https://puckeditor.com)) maps almost 1:1 onto the SXA Experience Editor model:

| Sitecore SXA concept | Puck equivalent |
|----------------------|-----------------|
| Toolbox (categorized rendering palette) | Sidebar with Categories |
| Placeholder (named drop region on a page) | DropZone |
| Rendering / Component | Puck component config (`render` + `fields`) |
| Datasource (rendering points to a data item) | External Data Source / adaptor |
| Page Design (template defining placeholders) | Root config + DropZones |
| Partial Design (header/footer reused) | Root component or page-template wrapper |
| Rendering Variant | `variant` field in component config |
| Component properties dialog | Right-side fields panel |
| Device preview (desktop/tablet/mobile) | Built-in viewport switcher |
| Save as JSON (presentation details) | Puck's `Data` JSON output |
| Insert Options (allowed components in zone) | `permissions` + `inline` config per component/zone |

Output is a portable JSON document. Render with `<Render data={data} config={config} />` in any React/Next.js context — perfect fit for our existing Next.js 15 App Router frontend.

### 6.3 Wrapping Puck inside a custom Payload view

```
/admin/builder/:id  (custom Payload Root view, RSC)
  └─ requireAuth(), payload.findByID({ collection:'pages', id })
  └─ <PageBuilderClient initialDoc={...} config={puckConfig} />
        ├─ Top toolbar: Save, Save Draft, Submit for Review, Preview, Lang switch
        ├─ Puck <Editor data={doc.layout} config={puckConfig} onPublish={save}>
        │     ├─ Sidebar: categorized component toolbox
        │     ├─ Iframe canvas: src="/[locale]/[slug]?_edit=1" — the REAL page route
        │     └─ Right panel: field props for selected component
        └─ Footer: lock indicator, conflict banner
```

Save path: `Puck.onPublish` → `PATCH /api/pages/:id` with `{ layout: data, _status: 'draft' }` — uses Payload's existing draft + version system, no parallel storage.

The iframe loading the real page route (not an isolated `<Puck.Render>`) is intentional and important — see §7 for why.

### 6.4 Sitecore parity additions on top of Puck

Things Puck doesn't ship that the PRD requires:

| Feature | Approach |
|---------|----------|
| Locked zones (header/footer) | Render them OUTSIDE Puck's editable area in the iframe shell; Puck only owns the editable DropZones. |
| Page templates (PRD §6.5) | Each template = a different `puckConfig` + a different shell. Page collection has `template` enum that picks which config to load. |
| Insert Options per zone | Use Puck's per-DropZone `allow`/`disallow` arrays, computed from the template definition. |
| Datasource (Sitecore-style content reference) | Custom Puck field type `relationship` that opens Payload's relationship picker and stores `{collection, id}` — component fetches at render time via External Data adaptor. |
| Rendering Variants | `variant` field on each component, branched in `render`. Stylistically same as SXA. |
| Component locking by role | Puck `permissions` API hides delete/duplicate based on `usePermissions()` hook calling `payload.auth()`. |
| Inline text editing | Puck supports inline editing for `text`/`textarea` fields out of the box. |

### 6.5 Build-vs-buy summary

Building the page builder from scratch on dnd-kit + a custom JSON schema is realistic but is **3–6 weeks of work** for the minimum (toolbox + drop zones + component chrome + props drawer + iframe + postMessage + responsive preview + undo/redo). Puck delivers all of that on day one — the work becomes wiring it to Payload, defining the component config, and styling the chrome. Estimated saving: **4 weeks**.

### 6.6 Risks

- Puck's iframe rendering needs the canvas to load our Next.js page in a special "edit mode" that ignores auth / loads draft data. Doable but needs a dedicated route like `/_edit/[slug]`.
- Puck's data shape is its own — if we ever leave Puck we have a migration. Mitigation: write a thin transform layer between Puck JSON and our `pages.layout` field so the field shape is ours, not Puck's.
- React 19 compatibility — Puck supports React 18; React 19 support is the current Puck issue tracker's top item. POC must verify before commit.

### 6.7 Reference

- [Puck docs](https://puckeditor.com/docs)
- [Puck on GitHub](https://github.com/puckeditor/puck)
- [Puck + Tailwind v4 guide](https://puckeditor.com/blog/how-to-build-a-react-page-builder-puck-and-tailwind-4)
- [Top 5 React page builders 2026 (DEV)](https://dev.to/fede_bonel_tozzi/top-5-page-builders-for-react-190g)

---

## 7. D4 — Live preview architecture

This deserves real attention because there are two valid technologies (Puck's canvas; Payload Live Preview) doing two genuinely different jobs. The question is not "which one" — it's "which surfaces use which."

### 7.1 The two technologies

**Puck's canvas** is an iframe + `postMessage` system that re-renders **on every keystroke / drag**, not on save. It's how the editor selects, drags, deletes, and inline-edits components. It's the WYSIWYG. Without it Puck isn't Puck.

**Payload Live Preview** is an iframe + `postMessage` system that re-renders **on save / autosave / publish** by calling `router.refresh()` in the Next.js page, which re-runs SSR with the new draft data via the Local API. It's what the Payload website template uses for blog posts, pages, etc. — full SSR fidelity, real components, real CSS, real header/footer, no Puck involved. ([Live Preview docs](https://payloadcms.com/docs/live-preview/overview))

These look similar from the outside — both are iframes that update as you edit — but the mechanism, latency, and fidelity ceiling are different.

| | Puck canvas | Payload Live Preview |
|---|---|---|
| Re-render trigger | Every edit (instant) | Save / autosave (~500ms debounce) |
| Renders | Whatever Puck's `<Render config>` outputs | Real Next.js page route, full SSR |
| Header / footer / shell | Whatever wrapper you build | Real shell, free |
| Drag / drop / inline edit | Yes (the whole point) | No — read-only preview |
| Works on non-page collections | No (Puck is for compositions) | Yes (any collection) |
| Setup cost | Define `puckConfig` per template | Add `livePreview` block to collection config |

### 7.2 Surface-by-surface mapping

| Editing surface | Live preview mechanism | Why |
|---|---|---|
| **Page Builder route** (`/admin/builder/:id`, pages collection) | **Puck inline (no Puck iframe) + Payload Live Preview drawer alongside** loading the real Next.js page route | **Revised 2026-05-01 (POC-3 finding):** Puck 0.20.2's `IframeConfig` has only `enabled` + `waitForStyles` — no `src` URL option. The original "Puck iframe loads external URL" plan was wrong about Puck's API. Solution: use Payload Live Preview's iframe drawer for the external-URL surface (the same mechanism the Payload website template uses on Pages), and run Puck inline on the left as the editor surface. Communication: Puck `onChange` (5s debounced) → save draft → Payload Live Preview postMessage → Next.js page `router.refresh()` → SSR re-render. |
| **OOTB collection edit views** (news, projects, events, contacts, documents, board members — anything with a fixed field schema, no composition) | Payload Live Preview, drawer mode | Same pattern as the Payload website template. Free out of the box. Editors get instant SSR-quality preview while filling fields. |
| **OOTB global edit views** (header, footer, site settings) | Payload Live Preview, drawer mode | Same as collections. |
| **Tree view** (`/admin/tree`) — when an item is selected | None in the tree itself; clicking "Edit" opens the appropriate surface above | The tree is navigation, not editing. |
| **"Open Preview" button** (any surface) | New tab → `/[locale]/[slug]` with Next.js draft mode cookie set | Full-fidelity, no admin chrome, shareable link, works in any browser including mobile for stakeholder review. |

### 7.3 The key implementation detail — Puck inline + Payload Live Preview drawer

> **Revised 2026-05-01:** the original plan in this section assumed Puck's iframe could be pointed at an external URL. POC-3 verified directly against Puck 0.20.2 type definitions that this is false: `IframeConfig` is `{ enabled?: boolean; waitForStyles?: boolean }` with no `src`. Puck's iframe is a CSS sandbox for its own internal preview only. The architecture below is the working pattern adopted in its place.

We split the two jobs across two surfaces in the same builder route:

**Left/center: Puck (inline, `iframe.enabled: false`).** Puck renders directly into the admin route DOM. This is the editor — drag/drop, drop zones, prop drawer, undo/redo. Real Tailwind cascades from the admin shell. CSS isolation is not needed because we control both sides.

**Right (drawer): Payload Live Preview iframe.** Loads our actual Next.js page route at `/[locale]/[slug]?draft=true&_edit=1`. This is the same mechanism the Payload website template uses on its Pages collection — `admin.livePreview.url` returns the URL, the iframe loads it, Payload sends `postMessage` events on save, the Next.js page calls `router.refresh()` to re-render SSR with the latest draft. Drawer supports breakpoint switching (Mobile/Tablet/Desktop) and pop-out window — both come from `@payloadcms/live-preview-react`.

```
/admin/builder/:id (custom Payload Root view)
├─ requireAuth(), payload.findByID('pages', id), check lock state
└─ <PageBuilderClient initialDoc={...} config={puckConfig} readOnly={...}>
      ├─ LEFT/CENTER: Puck (inline, no iframe)
      │     ├─ Sidebar: categorized component toolbox
      │     ├─ Editor surface: the page rendered with our root.render
      │     │  shell (just for Puck's drag context — does NOT need to be SSR'd
      │     │  with real data; the Live Preview drawer handles fidelity)
      │     └─ Right field panel: component props (with custom field types)
      └─ RIGHT (drawer): <LivePreviewListener url="/[locale]/[slug]?draft=true&_edit=1">
            └─ iframe loads the real Next.js page route, SSR'd with draft data
            └─ postMessage on save → router.refresh() in the iframe

Communication:
  Puck onChange → debounced 5s → payload.update({ collection:'pages', id, data:{ layout, _status:'draft' } })
                              → Payload's autosave triggers postMessage to the Live Preview iframe
                              → Next.js page receives, router.refresh()
                              → SSR re-render with the new draft layout JSON
                              → Live Preview drawer shows the updated page
```

**Why this is better than the original "Puck iframes external URL" plan:**
1. Uses Payload's officially supported, working-in-production mechanism (the website template's exact pattern)
2. Eliminates one iframe (no double-iframing)
3. Full SSR fidelity in the drawer — same as production
4. Pages and non-page collections (POC-4) share the same Live Preview mechanism — consistent UX, single mental model
5. No hacks against Puck's internals; uses only documented APIs

**Trade-offs (real but small):**
- The Puck editor itself does NOT show the real header/footer/Tailwind in the editing surface (that's in the drawer). Puck's drag context shows a simplified shell or just the editable zones. Editors visually composite the layout in their head from "Puck on left + drawer on right."
- This is closer to Storyblok / Builder.io's split-pane model than to Sitecore Experience Editor's overlay model. We trade overlay fidelity for SSR fidelity.

### 7.4 What we get for free vs what we build

| Capability | Source | Effort |
|---|---|---|
| Live Preview for `news`, `projects`, `events`, `contacts`, `documents`, `board-members`, `globals` | Payload + Next.js draft mode | Config only — `~30 min` per collection |
| WYSIWYG editing for `pages` with real shell | Puck + custom Next.js edit-mode route | POC-3 + the page-template Next.js route work |
| Full-fidelity new-tab preview from any surface | Next.js draft mode | A single button + a `/api/draft` route |
| Cross-locale preview (EN ↔ FR toggle in preview) | Payload Live Preview supports `locale` param; Puck supports re-init with new data | Wire locale switcher to both |

### 7.5 Risks specific to live preview

| Risk | Mitigation |
|---|---|
| Edit-mode route accidentally serves draft content publicly | Require valid Payload session cookie before reading drafts; reject anonymous traffic to `?_edit=1`; security review covered by `SECURITY.md` |
| Puck's iframe + Next.js dev server hot-reload race conditions | Disable Fast Refresh in the edit-mode route or test with `next start` during POC |
| Payload Live Preview server-side mode requires App Router data fetching to use Payload Local API in RSC — works fine in our setup | Verify in POC-3; this is the Payload website template's exact pattern |
| Two different preview UIs (Puck canvas for pages, Payload drawer for everything else) is a UX inconsistency | Documented for editors; both feel "live" so the cognitive cost is small |
| Live Preview drawer competes with screen real estate on smaller laptops | Drawer is collapsible; pop-out window mode available |

### 7.6 Reference

- [Live Preview overview | Payload docs](https://payloadcms.com/docs/live-preview/overview)
- [Server-side Live Preview | Payload docs](https://payloadcms.com/docs/live-preview/server)
- [Client-side Live Preview | Payload docs](https://payloadcms.com/docs/live-preview/client)
- [Preview URL config | Payload docs](https://payloadcms.com/docs/admin/preview)
- [Payload Website Starter (Vercel template)](https://vercel.com/templates/next.js/payload-website-starter)
- [Learn advanced Next.js with Payload's website template | Payload blog](https://payloadcms.com/posts/guides/learn-advanced-nextjs-with-payloads-website-template)

---

## 8. Data model deltas vs `PRD-admin-panel.md`

The PRD specifies a `layout: { type: 'json' }` field. The spike refines this:

```ts
// pages collection (additions to PRD §11.3)
{
  template: { type: 'select', options: [...] },           // unchanged
  parent:    { type: 'relationship', relationTo: 'pages' }, // PROVIDED BY nested-docs plugin
  breadcrumbs: { type: 'array' },                         // PROVIDED BY nested-docs plugin
  sortOrder: { type: 'number', defaultValue: 0 },         // we add — siblings ordering
  layout: {                                               // Puck data + version tag
    type: 'json',
    typescriptSchema: [PuckDataSchema],
    admin: { hidden: true },                              // edited via builder route, not field UI
  },
  layoutVersion: { type: 'text', defaultValue: '1' },     // for future migrations
  // workflow + locking fields per PRD §11.3 unchanged
}
```

`treeRules` is a code-only config (not a CMS collection):

```ts
// src/admin/treeRules.ts
export const treeRules: Record<string /* collection */, {
  allowedChildren: string[];
  rootLabel: string;
  icon: string;
  maxDepth?: number;        // PRD §14 Q4: 5 levels for pages
  bucketAfter?: number;     // hide flat children behind search after N items
}> = {
  pages:           { rootLabel: 'Site Pages', allowedChildren: ['pages'], icon: 'document', maxDepth: 5 },
  boards:          { rootLabel: 'Boards & Councils', allowedChildren: [], icon: 'org', maxDepth: 1 },
  projects:        { rootLabel: 'Projects', allowedChildren: [], icon: 'project', bucketAfter: 50 },
  news:            { rootLabel: 'News', allowedChildren: [], icon: 'news', bucketAfter: 100 },
  // ...etc per PRD §4.4
}
```

---

## 9. Open questions

> **Status:** Most original Q1–Q6 are resolved by the post-grill decisions in §14. Remaining unresolved items are listed under "Still open" below.

### 9.1 Resolved during grill (2026-04-30)

| Original | Resolution | See §14 |
|---|---|---|
| Q1 (which collections get page builder) | Pages + Board Detail + Project Detail templates; all other collections use OOTB Payload edit views | G1 |
| Q2 (media in tree) | Media stays as its own dedicated surface; tree contains pages + standards-sections + globals only | G5 |
| Q3 (datasources first-class) | Yes — components reference real content collections via `payloadRelationship` and `payloadFilter` custom fields. No abstract `content-blocks` collection. | G7 |
| Q4 (layout localization) | Shared layout, localized content via custom `LocalizedText` Puck field. `pages.layout` is NOT `localized: true`. | G4 |
| Q5 (real-app POC vs Storybook) | Real-app POC against the live Payload scaffold — accepted implicitly in the POC-1 checklist (§10). | — |
| Q6 (designer review before build) | Deferred to G13: ship from PRD wireframes; designer review optional. | G13 |

### 9.2 Resolved as defaults (2026-04-30 dial-in)

These were left "still open" after the grill. With no objections raised, they are locked as defaults and added to the decisions log (G11–G13). Any of these can be revisited before POC-3 starts; until then, build assumes the locked answer.

| # | Question | Locked default |
|---|----------|---------------|
| O1 → G11 | Quick Publish bypass for typo fixes | Allow for Editor+ role on already-Published pages only. Confirmation modal. Audit-logged in `workflowHistory` with `quickPublish: true` flag. |
| O2 → G12 | Translation × branch-model interaction | FR draft inherits new layout automatically (shared JSON tree). FR text fields display "Last translated against EN version X" hint when EN published version is newer than the EN that FR was last translated against. FR republish is manual. |
| O3 → G13 | Designer review before POC-3 | Default: ship from PRD wireframes + Sitecore research doc. Flag for the project lead to schedule designer time if budget allows; not a blocker for POC-1, POC-2, or POC-4 which can run regardless. |

### 9.3 Minor design choices (locked by default — see G14–G18)

Resolved without grilling; previously called out as "obvious right answers" during the dial-in. Recorded here for traceability.

| # | Topic | Locked answer |
|---|-------|---------------|
| G14 | Edit-mode iframe security | Cookie-based session check (Payload native) + same-origin only + `Content-Security-Policy: frame-ancestors 'self'` + `X-Frame-Options: SAMEORIGIN` headers on the edit-mode route. Reject `?_edit=1` requests without a valid Payload session. No signed-token complexity unless we ever need cross-origin (we don't). |
| G15 | Auto-save throttle | 5s debounce on Puck's `onChange` → Payload's autosave. On-blur saves immediately to flush pending changes. Heartbeat ping every 30s (independent of autosave) keeps the lock alive. |
| G16 | Variant naming convention | All variant-having components use a standardized `variant` enum field. Same field name everywhere. UI convention: `variant` always renders at the top of the props drawer. Editors learn one pattern. |
| G17 | Per-zone component allowlist | Declared **on the component** via `allowedZones: string[]`. Templates declare which zones exist; components declare which zones they belong in. Effective allowlist = intersection. Adding a new component touches one config, not every template. |
| G18 | Tree click default action | Single-click in the tree opens the page in the **field editor** (OOTB Payload edit view with workflow + metadata fields). Field editor has prominent "Open in Page Builder" button (PRD-admin-panel §5.4) for layout work. Rationale: field editor surfaces metadata + workflow that the builder hides; builder is for composition only. |

---

## 10. Phase 0 deliverables (POC checklist)

Four POCs, each in its own commit on `feat/admin-platform-layer-0`. Each POC has a binary success criterion. Total estimated time: **5.5 working days**.

### POC-1 — Custom admin route shell (1 day)
- [ ] Add `nested-docs` plugin to `payload.config.ts` configured for `pages`
- [ ] Add a single custom Root view at `/admin/tree` rendering "Hello Tree" inside `<DefaultTemplate>` from `@payloadcms/ui`
- [ ] Auth-gate the view server-side; unauthenticated → 302 to `/admin/login`
- [ ] Add a sidebar nav link to it via `admin.components.beforeNavLinks`
- **Success:** route renders, only logged-in users see it, sidebar link appears, no console errors, `npm run build` passes

### POC-2 — Consume the content-tree plugin (½–1 day)
> **Note:** Per the upstream sequencing change at the top of this doc, the tree is now an external OSS plugin (`@fishtank/payload-plugin-content-tree`) built on `react-arborist`. POC-2 changes from "build the tree from scratch" to "consume the plugin and prove FRAS-shaped data."
- [ ] Wait for plugin v0.1 tag from the `merry-scribbling-hejlsberg` worktree
- [ ] Install via tagged GitHub URL; configure `contentTreePlugin({ collectionSlug: 'pages', ... })` in `payload.config.ts`
- [ ] Seed 20 nested page docs across 3 levels via Payload Local API (same fixture as plugin's `examples/basic`)
- [ ] Verify tree renders against FRAS data; lazy load on expand works; drag-reorder updates `sortOrder`; drag-to-new-parent updates `parent` and cascades breadcrumbs
- [ ] Verify plugin's `editUrlBuilder` config can target `/admin/builder/:id` — sets up the click-to-builder bridge for POC-3
- **Success:** plugin renders FRAS pages tree; all DnD operations work against real Payload data; clicking a page in the tree routes to a stub builder URL; no fork or local patches needed

### POC-3 — Puck builder with real-page-route iframe + chrome-ceiling test (2 days)

**Setup tasks:**
- [ ] Install `@measured/puck`; verify React 19 compatibility (or pin React 18 in builder bundle if needed)
- [ ] Define `puckConfig` with 3 sample components (RichText, Heading, ImageGrid) in 1 category
- [ ] Add custom Root view `/admin/builder/:id` that loads `pages.layout` JSON, renders Puck `<Editor>`, saves via `payload.update`
- [ ] Build a real Next.js page route `app/[locale]/[...slug]/page.tsx` that:
  - Renders the site shell (a stub Header + Footer is fine for the POC)
  - Reads draft data when `?_edit=1` + valid Payload session cookie
  - Renders editable zones via `<Puck.DropZone zone="main">` inside `<Puck.Render>`
- [ ] Point Puck's iframe at that real route — verify the editor sees the real shell, not a bare canvas
- [ ] Add one DropZone (`main`); verify drag-to-zone works AND the changes appear inside the real-page iframe in real time
- [ ] Add an "Open Preview" button that sets the draft cookie via `/api/draft` and opens `/[locale]/[slug]` in a new tab with no admin chrome

**Required pivot-trigger checklist (locked by G10 — any failure → pivot to custom dnd-kit, +2.5 weeks):**

| # | Test | Why required |
|---|---|---|
| R1 | Replace Puck's default toolbar with our custom toolbar (Save Draft, Submit for Review, Approve, Reject, Publish, Schedule, Lock badge, Locale switcher) using `overrides` API — without forking Puck | G6 commits us to the workflow action bar in the builder. |
| R2 | Define custom field types `payloadRelationship`, `payloadFilter`, `LocalizedText` — render in props drawer with full Payload integration | G4 + G7 commit us to these field types. |
| R3 | **Live Preview drawer** loads our real Next.js page route at `/[locale]/[slug]?draft=true&_edit=1` via `@payloadcms/live-preview-react`, mounted alongside Puck (Puck runs inline, `iframe.enabled: false`). Saves to Payload propagate to the drawer iframe via Payload's existing `postMessage` → `router.refresh()` mechanism. **Revised 2026-05-01** — the original "Puck iframes external URL" plan was wrong about Puck's API; Puck's iframe has no `src` option. The drawer model uses the same mechanism the Payload website template uses on Pages. | The entire D4 hybrid architecture rests on the iframe + external URL + `postMessage` round trip. The mechanism is achievable via Payload Live Preview, not via Puck's iframe. |
| R4 | Read-only mode: when another editor holds the heartbeat lock, builder loads layout but disables all interactions and shows "Locked by X" banner | G8 commits us to heartbeat hard locks. |
| R5 | Auto-save integrated with Payload draft autosave on a 5s debounce, no new version per save (versions only on Submit/Publish per G6) | G6 + G9 commit us to overwrite-current-draft semantics. |

**Nice-to-have (any failure → drop the feature, no pivot):**

| # | Test | Fallback |
|---|---|---|
| N1 | Per-component status indicator (workflow dot on each component in canvas) | Drop; rely on global page status |
| N2 | Board-color canvas theming (purple for AcSB, blue for councils, etc.) | Drop; canvas stays neutral |
| N3 | Custom right-click context menu on components | Use Puck's default menu |
| N4 | Sitecore-style gutter column (list of components with click-to-jump) | Skip; rely on Puck's default selection |

- **Success:** all 5 Required tests pass + builder edits visible in real-page iframe + Preview button works. Nice-to-have failures are noted as Phase 1A backlog items, not blockers.
- **Pivot trigger:** any Required test fails after a reasonable attempt (Puck `overrides` API + standard React composition; no forking).

### POC-4 — Payload Live Preview on a non-page collection (½ day)
- [ ] Pick one OOTB collection — `news` is a good fit (real fields, no Puck involvement)
- [ ] Add `livePreview` config to the collection: `{ url: ({ data }) => '/news/' + data.slug, breakpoints: [...] }`
- [ ] Wire the corresponding Next.js page route to support draft mode + `router.refresh()` on `postMessage` per the [server-side Live Preview docs](https://payloadcms.com/docs/live-preview/server)
- [ ] Verify: editing a field in the news edit view → drawer iframe re-renders SSR within ~1s of save
- [ ] Verify: breakpoint toggle (desktop/tablet/mobile) works in the drawer
- **Success:** editing a news article in the OOTB Payload form shows a live SSR preview in a side drawer; this is the pattern we'll repeat for every non-page collection

### Exit criteria for the spike

If all 4 POCs pass:
- D1–D4 are confirmed; PRD-admin-panel.md gets a small amendment pointing to this doc for the technical choices
- Phase 1A (per PRD §13) can start
- Audit log entry written

If any POC fails:
- Document the blocker; either revise the decision (e.g. swap Puck for custom builder; fall back to Payload Live Preview-only and accept losing in-builder WYSIWYG) or escalate to a follow-up spike
- Do NOT proceed to Phase 1A on a failed assumption

---

## 11. Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Puck React 19 incompatibility | Medium | High | POC-3 verifies before commit; fallback is React 18 island in builder route only |
| Payload Tree View ships mid-build and obsoletes our tree | Medium | Low–Medium | Storage layer is `nested-docs` (compatible); only the UI shell would be replaced |
| Cross-collection tree unification UX is confusing | Medium | Medium | POC-2 should include at least 2 collections; usability check with one editor before Phase 1A |
| Iframe edit-mode route leaks draft data to public | Low | High | Edit route requires session cookie; same-origin only; `frame-ancestors 'self'` + `X-Frame-Options: SAMEORIGIN` headers; never indexed; SECURITY.md applies |
| Puck's iframe can't load our real Next.js page route in edit mode | Low | High | Verified by POC-3 R3; if it fails, pivot to custom dnd-kit per G10 |
| Puck's `overrides` API can't deliver Required chrome (G10 R1–R5) | Medium | High | POC-3 verifies before commit; pivot to custom dnd-kit, +2.5 weeks Phase 0 |
| Tree plugin v0.1 slips and blocks our Phase 1A start | Medium | Medium | POC-1 + POC-3 + POC-4 are independent of tree plugin and can run in parallel; only POC-2 is blocked. Worst case: Phase 1A starts with builder + Live Preview ready, tree integrates when v0.1 lands. |
| Two preview UIs (Puck canvas + Payload Live Preview drawer) confuse editors | Medium | Low | Each surface only ever uses one mechanism; editors don't see both at once |
| Heartbeat lock fails to release (browser crash, network drop) | Low | Low | Heartbeat timeout = 30s; admin force-unlock available; no idle timeout reproduces Sitecore's worst pain |
| Sitecore editors find the new model "different" despite parity | High | Medium | Designer review (O3) + editor onboarding plan; not a build issue |

---

## 12. What this doc does NOT cover

- The Workbox view (PRD §8) — no new technical decisions; standard Payload custom view
- The custom dashboard (PRD §3) — same
- Email notifications (PRD §7.7) — separate spike if/when needed
- Translation workflow (covered by `PRD-translation.md`)
- Search admin (covered by `research-search-solutions.md`)

---

## 13. Decisions log — post-grill 2026-04-30

> Worked through `/grill-me` interview on 2026-04-30 to resolve the load-bearing decisions before Phase 0 starts. Each entry below is locked unless explicitly revisited and re-logged.

| # | Decision | Locked answer | Implication |
|---|---|---|---|
| **G1** | Page-builder scope: which collections use Puck? | **Pages + Board Detail + Project Detail templates only.** All other collections (news, projects, events, contacts, documents, board-members, members, consultations) use OOTB Payload edit views with Live Preview drawer. | 3 Puck configs needed (one per template type), not 1. Component allowlists per zone defined per template. |
| **G2** | Build vs buy the editor engine | **Puck (`@measured/puck`)** with explicit pivot trigger (G10). Rejected building on dnd-kit primitives despite Payload-orphan concerns — accepted the integration glue cost in exchange for day-1 productivity. | Maintain glue layer for: save adapter (Puck JSON ↔ Payload draft+version), locale-aware data layer, Payload relationship picker as Puck custom field, lock-state read-only mode, theme overrides. |
| **G3** | Page templates: code-defined or admin-extensible? | **Code-defined enum.** 8 templates per PRD-admin-panel §6.5 are a fixed select field on `pages.template`. Each maps to a registered Puck config + a registered Next.js layout. New templates = PR. | No `page-templates` collection. Template + Puck config + Next.js layout are tightly coupled in code. Editors never create templates. |
| **G4** | Layout JSON localization | **Shared layout, localized content via custom `LocalizedText` Puck field.** `pages.layout` is NOT marked `localized: true` in Payload. Localized text fields inside Puck props use `{ en: '...', fr: '...' }` shape; renderer picks side from Next.js locale context. | Need custom Puck field types: `LocalizedText`, `LocalizedRichText`. Single Puck JSON tree per page. Locale switcher in builder reloads displayed text without reloading the tree. |
| **G5** | Tree contents | **Pages + Standards Sections + Globals/Settings only.** Flat collections (news, events, projects, consultations, documents, contacts, members) stay in OOTB sidebar list views. Media stays as its own dedicated `/admin/media` surface. | `nested-docs` plugin runs on `pages` and `standards-sections` only. The earlier `treeRules` config in §8 is reduced — only collections that genuinely benefit from hierarchy appear. |
| **G6** | Workflow integration with the builder | **Full workflow action bar replaces Puck's default toolbar.** Save Draft, Submit for Review, Approve, Reject, Publish, Schedule — same set as PRD §5.4 field editor — filtered by user role via `overrides` API. Auto-save every ~5s overwrites current draft (no new version). New version snapshot only on Submit for Review or Publish. | Puck's `onChange` debounced into Payload's autosave on the `pages` collection (`versions: { drafts: { autosave: { interval: 5000 } } }`). Versioning aligns with workflow boundaries — avoids Sitecore version bloat. |
| **G7** | Datasources: how do data-driven widgets reference content? | **Reference real content collections via `payloadRelationship` + `payloadFilter` custom Puck fields. Inline data for layout components.** No abstract `content-blocks` collection. Dynamic mode resolves at render time via `payload.find` in the Next.js page route. | Custom Puck field types: `payloadRelationship`, `payloadFilter`. Hero/CTA/Feature Row/Card Grid carry inline data. Project List / News Feed / Contact Card / Board Members Grid / Standards List reference real docs. |
| **G8** | Locking model | **Hybrid: heartbeat hard lock for Puck builder, optimistic last-write-wins for OOTB edit views.** Builder lock released when tab closes (heartbeat stops, no idle timeout). Admin force-unlock available. OOTB edit views show "Modified by X at [time]" warning on conflict, with [Save Anyway] / [Reload First]. | Two concurrency models — each surface gets the right tool for its data shape. Eliminates Sitecore's idle-timeout pain. JSON-tree corruption risk in builder fully avoided. |
| **G9** | Editing an Approved or Published page | **Branch model via Payload's draft+published versioning.** Editing creates a draft alongside the live version; live page untouched until republish. Workflow state lives on the draft. Tree gutter shows dual indicator when a draft-in-progress exists for a published page. | `pages` collection requires `versions: { drafts: true }`. UI shows "Editing draft • Currently published version by [User] on [Date]" banner in builder. Optional "Quick Publish" fast lane for Editor+ role on typo-class fixes (open question O1). |
| **G10** | POC-3 pivot trigger | **5 Required tests + 4 Nice-to-Have tests** (full list in POC-3 above). Any Required failure → pivot to custom dnd-kit-based editor, Phase 0 extends by ~2.5 weeks, Phase 1A start slips correspondingly. Nice-to-Have failures dropped to Phase 1A backlog. **R3 revised 2026-05-01:** the original test assumed Puck supported external-URL iframe; verified directly against Puck 0.20.2 types that it does not. Test reframed to "Live Preview drawer loads real Next.js page route alongside inline Puck" — same architectural goal, achievable via Payload's officially supported `@payloadcms/live-preview-react` package. R3 passes under the revised mechanism; not a pivot. | Defines the precise pass/fail bar so the Puck commitment is testable, not faith-based. Reasonable-attempt scope = Puck `overrides` API + standard React composition + Payload's Live Preview; no forking. |
| **G11** | Quick Publish for typo fixes | **Allow for Editor+ role on already-Published pages only.** Confirmation modal. Bypasses In Review / Approved transitions. Audit-logged in `workflowHistory` with `quickPublish: true`. | Adds a one-button Draft → Published path on Published pages. Solves the "fix the homepage typo NOW" use case without removing the workflow ceremony from initial publishes. |
| **G12** | Translation × branch model | **FR draft inherits new layout automatically** (shared Puck tree per G4). FR text fields display "Last translated against EN version X" hint when EN published version is newer than the EN reference of the FR translation. **FR republish is manual** — translators decide when to push. | No automatic FR republish on EN publish. Translators see staleness hints in the field editor. Detailed mechanism continues to live in `PRD-translation.md`. |
| **G13** | Designer review before POC-3 | **Default: ship from PRD wireframes + Sitecore research doc.** Flag for project lead — schedule designer time if available. Not a blocker for POC-1, POC-2, or POC-4. | If designer time becomes available, scope the review to G10 R1 (toolbar) + R4 (read-only mode) + the four Nice-to-Haves N1–N4. |
| **G14** | Edit-mode iframe security | **Cookie session check + same-origin + `frame-ancestors 'self'` + `X-Frame-Options: SAMEORIGIN`.** No signed-token mechanism. Reject `?_edit=1` from anonymous traffic. | Edit-mode route returns the published version (or 404 if none) for unauthenticated requests. SECURITY.md compliance covered. |
| **G15** | Auto-save behavior | **5s debounce on Puck `onChange` → Payload autosave. Save-on-blur for immediate flush. 30s heartbeat ping (independent) keeps the lock alive.** | Three independent timers: debounce (Puck → Payload), blur-flush (Puck), heartbeat (lock). All small, all separately-implementable. |
| **G16** | Variant convention | **Standardized `variant` enum field name across all variant-having components.** Always at the top of the props drawer. | One mental model for editors: "find the Variant dropdown." Component config schema enforces this via shared field type. |
| **G17** | Per-zone component allowlist | **Declared on the component via `allowedZones: string[]`.** Templates declare which zones exist; components declare which zones they accept. Effective allowlist is the intersection. | Adding a new component = one config touch, not edits to every template. Templates stay simple. |
| **G18** | Tree click default action | **Single-click in tree → field editor (OOTB Payload edit view).** Field editor has prominent "Open in Page Builder" button. | Field editor surfaces workflow + metadata that the builder hides. Builder is for composition only. Discovery cost: one extra click to open the builder; saves many "where did the publish button go" support tickets. |

### Implementation tasks newly committed by these decisions

The following tasks are now load-bearing for Phase 1A and need to land in `BUILD_PLAN.md` / `MASTER_TODO.md` when Phase 0 exits. Estimates are calendar working days for one engineer; many are parallelizable.

| # | Task | Est. days | Source |
|---|---|---|---|
| 1 | Custom Puck field types: `LocalizedText`, `LocalizedRichText`, `payloadRelationship`, `payloadFilter` | 3 | G4, G7 |
| 2 | Workflow action bar component replacing Puck's toolbar via `overrides` API (Save Draft, Submit, Approve, Reject, Publish, Schedule, Quick Publish, Lock badge, Locale switcher) | 2 | G6, G11 |
| 3 | Heartbeat lock service: `pages.lockedBy` + `pages.lockedAt` + 30s ping endpoint + read-only mode in builder + admin force-unlock | 2 | G8, G15 |
| 4 | Branch-model UI: dual gutter indicator in tree, "Editing draft of Published" banner in builder, workbox flag for "Replaces Published" drafts, "Last translated against EN version X" hint on FR fields | 2 | G9, G12 |
| 5 | Edit-mode iframe security: same-origin, `frame-ancestors 'self'` CSP, `X-Frame-Options: SAMEORIGIN`, session-cookie gate on `?_edit=1`, anon → published-or-404 fallback | 1 | G14 |
| 6 | Live Preview config on every non-page collection (news, projects, events, contacts, documents, board-members, consultations) — ~½ day per collection × 7 | 3.5 | D4 |
| 7 | Three Puck configs (Homepage, Board Detail, Project Detail templates) with locked + editable zones declared per template | 5 | G1, G3, G17 |
| 8 | Datasource render-time resolution helper: shared util that takes a `payloadFilter` spec and returns docs in the Next.js page route via Local API | 1 | G7 |
| 9 | Tree-click → field editor wiring + "Open in Page Builder" button on field editor (auth-aware deep link to `/admin/builder/:id`) | ½ | G18 |
| 10 | Variant convention enforcement: shared field-type definition for `variant`, props-drawer ordering convention | ½ | G16 |
| 11 | Quick Publish modal + audit-log integration in `workflowHistory` | 1 | G11 |

**Total: ~21.5 working days of net-new work** in Phase 1A driven by these decisions, on top of the original Phase 1A scope. Several pairs (1+2, 3+4, 5+6) are independently parallelizable across two engineers.

---

## 14. Sources

- [Customizing Views | Payload docs](https://payloadcms.com/docs/custom-components/custom-views)
- [The Admin Panel | Payload docs](https://payloadcms.com/docs/admin/overview)
- [Swap in your own React components | Payload docs](https://payloadcms.com/docs/admin/components)
- [Document Views | Payload docs](https://payloadcms.com/docs/custom-components/document-views)
- [Nested Docs Plugin | Payload docs](https://payloadcms.com/docs/plugins/nested-docs)
- [RFC: Tree View — Payload Discussion #13982](https://github.com/payloadcms/payload/discussions/13982)
- [Custom admin view rendering — Discussion #15165](https://github.com/payloadcms/payload/discussions/15165)
- [Payload Admin UI Custom Components Guide | Build with Matija](https://www.buildwithmatija.com/blog/payload-cms-custom-admin-ui-components-guide)
- [Puck — open-source visual editor for React](https://puckeditor.com)
- [Puck docs](https://puckeditor.com/docs)
- [Puck on GitHub](https://github.com/puckeditor/puck)
- [Puck + Tailwind v4 guide](https://puckeditor.com/blog/how-to-build-a-react-page-builder-puck-and-tailwind-4)
- [Top 5 React page builders 2026 | DEV](https://dev.to/fede_bonel_tozzi/top-5-page-builders-for-react-190g)
- [react-arborist on GitHub](https://github.com/brimdata/react-arborist)
- [Build a tree view with react-arborist | DEV](https://dev.to/igorfilippov3/build-tree-view-with-react-arborist-part-1-b5l)
- [React tree library comparison | npm-compare](https://npm-compare.com/react-complex-tree,react-sortable-tree,react-treebeard)
