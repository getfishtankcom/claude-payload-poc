# Phase 0 — POC Tickets

> **Purpose:** Actionable engineering tickets for the four Phase 0 POCs that gate Phase 1A. Each ticket is self-contained — branch off, build, test against success criteria, merge or pivot.
> **Source:** `spike-admin-platform-layer-0.md` §10 + §13 (G1–G18)
> **Branch:** `feat/admin-platform-layer-0` (this worktree)
> **Date:** 2026-04-30
> **Total estimated effort:** 5.5 working days, partially parallelizable (POC-1, POC-3, POC-4 independent; POC-2 blocked on tree plugin v0.1)

---

## Ground rules

1. **Each POC is a separate commit on `feat/admin-platform-layer-0`.** Squash-merge if the POC passes; revert cleanly if it fails.
2. **No production code.** Phase 0 is exploration. Code from passing POCs is rewritten in Phase 1A under the proper Epic structure (Epics 22–27).
3. **Success is binary.** Each POC has explicit pass criteria. Don't ship a POC that "mostly" passes.
4. **Pivot triggers are real.** POC-3 has 5 Required tests (G10). Any failure → pivot to custom dnd-kit, +2.5 weeks, *do not* try to make Puck work.
5. **Update `.ai-reports/AUDIT_LOG.md` after each POC** — type `Research`, with pass/fail summary.
6. **Follow `CLAUDE.md` rules.** Do NOT modify `.env`; only `.env.example`. All AI-generated reports go in `.ai-reports/`.

---

## POC-1 — Custom admin route shell

| Field | Value |
|---|---|
| **Estimate** | 1 working day |
| **Dependencies** | None — can start immediately |
| **Risk** | Low |
| **Pivot trigger** | None — Payload's custom views API is documented and stable |
| **Decisions exercised** | §3 (Payload extension surface), G14 (security) |

### Goal

Mount a custom Root view at `/admin/tree` inside the running Payload admin, prove auth-gating works, prove `@payloadcms/ui` chrome is reusable, and prove `generate:importmap` wiring.

### Steps

1. **Install nested-docs plugin** (we'll need it across multiple POCs)
   ```bash
   npm install @payloadcms/plugin-nested-docs
   ```

2. **Create a placeholder `pages` collection** at `src/collections/Pages.ts` with these minimum fields (we'll expand in Epic 1):
   - `title: text` (required)
   - `slug: text` (required, unique)
   - `_status: 'draft' | 'published'` (Payload's built-in via `versions: { drafts: true }`)

3. **Configure plugin in `src/payload.config.ts`**:
   ```ts
   import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
   // ...
   plugins: [
     nestedDocsPlugin({
       collections: ['pages'],
       generateLabel: (_, doc) => doc.title as string,
       generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
     }),
   ]
   ```

4. **Create the custom view** at `src/admin/views/ContentTree.tsx`:
   ```tsx
   import { redirect } from 'next/navigation'
   import { headers as nextHeaders } from 'next/headers'
   import { getPayload } from 'payload'
   import config from '@/payload.config'
   import { DefaultTemplate } from '@payloadcms/next/templates'
   import { ContentTreeClient } from './ContentTreeClient'

   export const ContentTree = async ({ initPageResult }) => {
     const headers = await nextHeaders()
     const payload = await getPayload({ config })
     const { user } = await payload.auth({ headers })
     if (!user) redirect('/admin/login?redirect=/admin/tree')

     return (
       <DefaultTemplate {...initPageResult}>
         <ContentTreeClient user={user} />
       </DefaultTemplate>
     )
   }
   ```

   And the client island at `src/admin/views/ContentTreeClient.tsx`:
   ```tsx
   'use client'
   export const ContentTreeClient = ({ user }) => (
     <div style={{ padding: 24 }}>
       <h1>Content Tree</h1>
       <p>Hello, {user.email}. Tree will mount here in POC-2.</p>
     </div>
   )
   ```

5. **Wire it into `payload.config.ts`** under `admin.components.views`:
   ```ts
   admin: {
     user: Users.slug,
     importMap: { baseDir: path.resolve(dirname) },
     components: {
       views: {
         contentTree: {
           Component: '/admin/views/ContentTree#ContentTree',
           path: '/tree',
         },
       },
       beforeNavLinks: [
         '/admin/components/TreeNavLink#TreeNavLink',
       ],
     },
   },
   ```

6. **Add the sidebar nav link** at `src/admin/components/TreeNavLink.tsx`:
   ```tsx
   'use client'
   import Link from 'next/link'
   export const TreeNavLink = () => (
     <Link href="/admin/tree" style={{ display: 'block', padding: '8px 16px' }}>
       Content Tree
     </Link>
   )
   ```

7. **Regenerate types and importmap**:
   ```bash
   npm run generate:types
   npm run generate:importmap
   ```

8. **Run the dev server** and manually verify each success criterion below.

### Success criteria (all must pass)

- [ ] `npm run dev` starts without errors
- [ ] Anonymous request to `/admin/tree` redirects to `/admin/login?redirect=/admin/tree`
- [ ] After login, `/admin/tree` renders inside the standard Payload admin chrome (sidebar, header, theme)
- [ ] The "Content Tree" link appears in the admin sidebar
- [ ] Page shows the logged-in user's email (proves auth context works in RSC)
- [ ] No browser console errors
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes

### On pass
- Commit with message `feat(poc-1): custom admin route shell with auth-gate`
- Update audit log
- Move to POC-3 and POC-4 in parallel (POC-2 still blocked)

### On fail
- Document the blocker in audit log as type `BLOCKED`
- Most likely failure modes: importmap path mismatch (check `baseDir`), missing `'use client'` boundary on the nav link component, `payload.auth()` returns null (check session cookie domain)

---

## POC-2 — Consume the content-tree plugin

| Field | Value |
|---|---|
| **Estimate** | ½–1 working day |
| **Dependencies** | `@fishtank/payload-plugin-content-tree` v0.1 tag (parallel worktree `merry-scribbling-hejlsberg`) |
| **Risk** | Low — plugin is purpose-built for this consumer |
| **Pivot trigger** | None — if plugin is broken, file an issue against the plugin worktree, not this one |
| **Decisions exercised** | D1, D2 (collapsed to plugin), G5, G18 |

### Goal

Replace POC-1's stub `<ContentTreeClient />` with the real tree plugin rendering FRAS pages data, prove drag-reorder + drag-to-new-parent + breadcrumb cascade work end-to-end, prove the click-to-builder bridge.

### Steps

1. **Wait for v0.1 tag** from the plugin worktree. Check via:
   ```bash
   gh api repos/getfishtank/payload-plugin-content-tree/releases/latest --jq .tag_name
   ```

2. **Install via tagged GitHub URL**:
   ```bash
   npm install github:getfishtank/payload-plugin-content-tree#v0.1.0
   ```
   (npm publish is v0.2, not v0.1; we install from tag during Phase 0.)

3. **Configure in `payload.config.ts`**:
   ```ts
   import { contentTreePlugin } from '@fishtank/payload-plugin-content-tree'
   // ...
   plugins: [
     nestedDocsPlugin({ /* ...as in POC-1 */ }),
     contentTreePlugin({
       collectionSlug: 'pages',
       editUrlBuilder: (doc) => `/admin/builder/${doc.id}`,
       rootLabel: 'Site Pages',
       maxDepth: 5,
     }),
   ]
   ```

4. **Replace `ContentTreeClient`** with the plugin's exported tree component (refer to plugin's `examples/basic` for the exact import path; the plugin owns the API).

5. **Seed test data** via a one-off script `scripts/seed-poc2.mjs`:
   ```js
   // 20 pages, 3-level hierarchy, real FRAS structure
   // Home > About > {Due Process, International Activities}
   // Home > Boards & Councils > {AcSB, PSAB, AASB, CSSB, RASOC}
   // AcSB > {Members, Strategic Plan}
   // ... etc
   ```

### Success criteria (all must pass)

- [ ] Tree renders with 20 seeded pages across 3 levels
- [ ] Expand/collapse persists across page reloads (plugin handles via localStorage)
- [ ] Drag-reorder within a parent updates `sortOrder` in DB
- [ ] Drag to a new parent updates `parent` in DB AND triggers nested-docs `breadcrumbs` cascade on all descendants
- [ ] Single-click on a page navigates to `/admin/builder/:id` (404s in POC-2 — that's fine, POC-3 builds the destination)
- [ ] No fork or local patches needed — plugin works as-installed

### On pass
- Commit `feat(poc-2): consume content-tree plugin v0.1`
- Update audit log

### On fail
- File issue against plugin worktree with repro
- Document blocker; this POC is unblocked when plugin patches

---

## POC-3 — Puck builder with real-page-route iframe + chrome ceiling

| Field | Value |
|---|---|
| **Estimate** | 2 working days |
| **Dependencies** | None — can start immediately, in parallel with POC-1 |
| **Risk** | Medium — Puck's `overrides` API limits unknown until tested |
| **Pivot trigger** | **Any of the 5 Required tests below fails** → pivot to custom dnd-kit-based editor, +2.5 weeks Phase 0 |
| **Decisions exercised** | D3, D4, G2, G4, G6, G7, G8, G9, G10, G14, G15 |

### Goal

Prove Puck can serve as the page builder engine WITH all G-decisions implementable via its documented `overrides` API. This is the most consequential POC — it determines whether we ship Puck or pivot.

### Steps

1. **Install Puck**:
   ```bash
   npm install @measured/puck
   ```
   Verify React 19 compat. If incompatible, pin React 18 in the builder route only (acceptable workaround).

2. **Add `layout` field to `pages` collection** (POC-1 placeholder):
   ```ts
   { name: 'layout', type: 'json', admin: { hidden: true } },
   { name: 'lockedBy', type: 'relationship', relationTo: 'users', admin: { hidden: true } },
   { name: 'lockedAt', type: 'date', admin: { hidden: true } },
   ```
   Configure `versions: { drafts: { autosave: { interval: 5000 } } }` on the collection.

3. **Define minimal Puck config** at `src/admin/builder/puckConfig.ts` with 3 components:
   - `RichText` (Lexical) — Puck inline edit
   - `Heading` — `level: select(1-6)`, `text: text` (with G16 `variant` field at top)
   - `ImageGrid` — proves the relationship-picker custom field type

4. **Implement custom Puck field types** at `src/admin/builder/fields/`:
   - `LocalizedText.tsx` — `{ en, fr }` shape, EN/FR tabbed editor (G4)
   - `payloadRelationship.tsx` — opens Payload relationship picker, stores `{collection, id}` (G7)
   - `payloadFilter.tsx` — filter spec form, stores `{collection, where, limit, sort}` (G7)

5. **Build the builder route** at `src/admin/views/PageBuilder.tsx`:
   ```tsx
   // RSC: auth-gate via payload.auth(), find page by id, lock check
   // → render <PageBuilderClient initialDoc={...} config={puckConfig} />
   ```

6. **Build the builder client** with custom toolbar (G6) replacing Puck's default — this is **G10 R1**. Puck runs **inline** (`iframe.enabled: false`); the Live Preview drawer (R3) renders next to it:
   ```tsx
   <div style={{ display: 'grid', gridTemplateColumns: '1fr 480px' }}>
     <Puck
       data={initialDoc.layout}
       config={puckConfig}
       iframe={{ enabled: false }}                        // ← inline; Puck has no src option (see R3 finding)
       overrides={{
         headerActions: () => <FRASActionBar />,          // ← G10 R1
       }}
       onChange={debounce(saveAutoDraft, 5000)}           // ← G10 R5, G15
       permissions={{ delete: !readOnly, drag: !readOnly }} // ← G10 R4
     />
     <LivePreviewDrawer
       url={`/${locale}/${slug}?draft=true&_edit=1`}      // ← G10 R3 (revised)
     />
   </div>
   ```

7. **Build the real Next.js page route** at `src/app/(frontend)/[locale]/[...slug]/page.tsx` — this is what the Live Preview drawer iframes:
   - Reads `pages` doc by slug; respects draft mode + `?_edit=1` (G14)
   - Renders site shell (stub `<Header/>` + `<Footer/>` is fine for POC)
   - Renders editable zones via `<Render config={puckConfig} data={page.layout} />` (Puck's `Render` for SSR — no editor chrome)
   - Mounts `<RefreshRouteOnSave>` from `@payloadcms/live-preview-react` so it re-renders on Payload save events
   - Sets `Content-Security-Policy: frame-ancestors 'self'` and `X-Frame-Options: SAMEORIGIN` headers (G14)

8. **Add `livePreview.url` to the Pages collection config** so Payload's existing Live Preview infrastructure handles the `postMessage` round trip:
   ```ts
   admin: {
     livePreview: {
       url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/${data.locale ?? 'en'}/${data.slug}?draft=true&_edit=1`,
     },
   }
   ```

9. **Add lock heartbeat** at `src/app/(payload)/api/lock-heartbeat/route.ts` — POST every 30s while builder open; updates `pages.lockedAt`. On read-only mode trigger when another user holds the lock (G8) — **G10 R4**.

10. **Add Open Preview button** that hits `/api/draft` to set draft cookie, opens `/${locale}/${slug}` in new tab.

### Required pivot-trigger checklist (G10 — any fail → pivot)

| # | Test | Pass = |
|---|---|---|
| **R1** | Replace Puck's default toolbar with custom toolbar (Save Draft, Submit, Approve, Reject, Publish, Schedule, Lock badge, Locale switcher) via `overrides` | All 8 buttons render, click handlers fire, no Puck default toolbar visible |
| **R2** | Custom field types `payloadRelationship`, `payloadFilter`, `LocalizedText` render in props drawer | Relationship picker opens, queries Payload Local API, stores correct shape; LocalizedText shows EN/FR tabs |
| **R3** | **Payload Live Preview drawer** loads our real Next.js page route at `/[locale]/[slug]?draft=true&_edit=1` alongside inline Puck. **Revised 2026-05-01:** Puck 0.20.2's `IframeConfig` has no `src` option (verified directly against type defs); the drawer model uses `@payloadcms/live-preview-react` — same mechanism the Payload website template uses on Pages. | Drawer iframe shows real SSR'd Next.js page (Header, Footer, Tailwind); on Puck save, drawer re-renders within ~1s via Payload's `postMessage` → `router.refresh()` round trip |
| **R4** | Read-only mode when another editor holds heartbeat lock | Builder loads layout, all interactions disabled, "Locked by X" banner visible |
| **R5** | Auto-save via 5s debounce → Payload's draft autosave, no new version per save | Multiple saves create no new versions; only Submit/Publish create version snapshots |

### Nice-to-have checklist (any fail → drop feature, no pivot)

| # | Test | Fallback if fails |
|---|---|---|
| N1 | Per-component status indicator (workflow dot on each component in canvas) | Drop; rely on global page status |
| N2 | Board-color canvas theming (purple/blue/red-brown by board) | Drop; canvas neutral |
| N3 | Custom right-click context menu on canvas components | Use Puck default |
| N4 | Sitecore-style gutter column (component list with click-to-jump) | Skip |

### On full pass (5/5 Required + any Nice-to-Haves)
- Commit `feat(poc-3): puck builder with real-page iframe + chrome verified`
- Update audit log with which Nice-to-Haves passed/failed
- Phase 0 effectively done; Phase 1A clear to start

### On Required failure
- **STOP. Do not try to make it work via forking.**
- Document the failed test(s) in audit log as `BLOCKED`
- Open a follow-up spike for "custom dnd-kit-based editor" — pivot path
- Phase 0 extends by ~2.5 weeks
- POC-1, POC-2, POC-4 stay valid (engine is independent of tree, auth, Live Preview)

---

## POC-4 — Payload Live Preview on a non-page collection

| Field | Value |
|---|---|
| **Estimate** | ½ working day |
| **Dependencies** | None — can start immediately, in parallel with POC-1 and POC-3 |
| **Risk** | Low — Payload Live Preview is well-documented and shipped |
| **Pivot trigger** | None — if Live Preview fails for `news`, fall back to "click Preview button to new tab" model |
| **Decisions exercised** | D4 (the non-page half), G1 (everything-not-builder uses OOTB) |

### Goal

Prove the second half of D4: OOTB Payload edit views show a live SSR preview drawer for non-page collections, matching the Payload website template pattern. This is the model we'll repeat for `news`, `projects`, `events`, `contacts`, `documents`, `board-members`, `consultations` in Phase 1A.

### Steps

1. **Create a minimal `news` collection** at `src/collections/News.ts`:
   ```ts
   {
     slug: 'news',
     versions: { drafts: true },
     admin: {
       livePreview: {
         url: ({ data }) => `${process.env.NEXT_PUBLIC_SERVER_URL}/news/${data.slug}?draft=true`,
         breakpoints: [
           { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
           { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
           { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
         ],
       },
     },
     fields: [
       { name: 'title', type: 'text', required: true },
       { name: 'slug', type: 'text', required: true },
       { name: 'body', type: 'richText' },
       { name: 'publishedDate', type: 'date' },
     ],
   }
   ```

2. **Create the news page route** at `src/app/(frontend)/news/[slug]/page.tsx`:
   - Reads `news` by slug
   - Respects `?draft=true` query param + draft mode cookie
   - Renders `<RefreshRouteOnSave />` client component for live re-render
   - Sets up `router.refresh()` on `postMessage` from admin per [server-side Live Preview docs](https://payloadcms.com/docs/live-preview/server)

3. **Add `RefreshRouteOnSave`** at `src/components/RefreshRouteOnSave.tsx`:
   ```tsx
   'use client'
   import { useRouter } from 'next/navigation'
   import { RefreshRouteOnSave as PayloadRefresh } from '@payloadcms/live-preview-react'
   export const RefreshRouteOnSave = () => {
     const router = useRouter()
     return <PayloadRefresh refresh={() => router.refresh()} serverURL={process.env.NEXT_PUBLIC_SERVER_URL!} />
   }
   ```

4. **Install `@payloadcms/live-preview-react`** if not present.

5. **Seed 1 test news article** via Local API.

### Success criteria

- [ ] Editing a field in the news edit view causes the drawer iframe to re-render via SSR within ~1s of save
- [ ] Breakpoint toggle (Mobile/Tablet/Desktop) resizes the drawer iframe correctly
- [ ] Drawer shows the real `news/[slug]` page including any styling/layout it'll have in production
- [ ] Pop-out window mode works (drawer can be detached)
- [ ] No console errors during the postMessage exchange

### On pass
- Commit `feat(poc-4): payload live preview on news collection`
- Document the pattern in audit log; this is the recipe we apply to all 7 non-page collections in Phase 1A
- Total time per collection in Phase 1A: ~½ day (matches §13 task #6 estimate)

### On fail
- Most likely cause: env var `NEXT_PUBLIC_SERVER_URL` mismatch or draft mode cookie not set
- Document; fall back to "Preview button → new tab" model for this collection in Phase 1A

---

## Phase 0 exit checklist

When all four POCs have shipped a verdict (pass or pivot-documented):

- [ ] All four POCs have committed code on `feat/admin-platform-layer-0`
- [ ] Audit log has entries for each POC with pass/fail status
- [ ] If POC-3 pivoted, follow-up spike for custom dnd-kit-based editor is scheduled
- [ ] If any blocker found, it's documented in `spike-admin-platform-layer-0.md` §11 Risks with a mitigation
- [ ] Spike doc's "Status" line at top updated from "Discovery" to "Phase 0 complete — Phase 1A clear to start" (or similar)
- [ ] PRD-admin-panel.md is unchanged (the spike's superseding callout still routes readers correctly)
- [ ] Decision: schedule Phase 1A kickoff OR schedule pivot spike

When Phase 0 exits clean, run Ralph loop on Epic 22 (admin foundation) per `.ai-reports/ralph-prompts/epic-22-admin-foundation.md`.

---

## Engineering notes

### Branch hygiene
This worktree (`feat/admin-platform-layer-0`) holds Phase 0 only. Phase 1A starts on a separate branch `feat/epic-22-admin-foundation` after the gate.

### Don't get fancy
Phase 0 code is throwaway. No tests, no a11y polish, no design tokens, no copy review, no FR strings, no error states. Build the minimum that proves the architectural claim.

### Cache the intermediate state
After each POC commit, save the working dev-mode browser tab (DevTools open) to a file via `mcp__claude-in-chrome__gif_creator` — useful for the audit log entry and for showing stakeholders.

### What "reasonable attempt" means for Puck overrides
Read `puckeditor.com/docs` end-to-end before any "Puck can't do this" claim. The `overrides`, `plugins`, `permissions`, and `headerComponents` APIs are layered — try the right one before declaring failure. Forking Puck is OUT of bounds; everything else is in bounds.

### Audit log entry shape
After each POC:
```
| 2026-MM-DD | Research | POC-N — [pass/fail] — [one-sentence summary]. [Key finding]. | <files touched> | [Phase 0 status] |
```
