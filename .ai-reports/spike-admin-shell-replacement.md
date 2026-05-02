# Spike — Replacing Payload's `/admin` with a Sitecore-flavored Custom Shell

**Date:** 2026-05-01
**Author:** Claude (under cgron@getfishtank.ca direction)
**Status:** ✅ Decisions locked 2026-05-02. Promoted to `BUILD_PLAN-admin-shell-v2.md`.
**Supersedes:** Nothing yet. Builds on `research-sitecore-admin-interface.md`, `sitecore-dump/SYNTHESIS.md`, `PRD-admin-panel.md`, `layer-5-plugin-extraction-scoping.md`.

---

## 1. Problem Statement

Today the admin platform is a hybrid:

- We own a handful of full-page custom views (Tree, Workbox, Page Builder, Media Library, Schedule, Language Audit, Dashboard) — but they all render **inside Payload's outer shell** because they're registered through Payload's `admin.components.views` injection point (`payload.config.ts:99–127`).
- Every collection edit page, list page, login page, account page, and global is **100% Payload UI**. Our Content Tree even points at Payload's edit form via an `<iframe>` (`ContentTreeClient.tsx:931`) for the right-hand panel.
- Authors therefore see two visual languages: ours (modern, brand-tokens, Tailwind) and Payload's (default Payload SCSS, generic fields). The seam is jarring and the muscle-memory promise of "everything flows through `/admin`" is half-true at best.

The goal is to make `/admin` a single, custom shell — Sitecore's mental model of *tree-first, contextual workspace, ribbon for verbs, status in the gutter* — with thoughtful modern polish. Payload remains the data layer and stays available as a developer backdoor, but no content author should ever see a stock Payload page.

## 2. The Sitecore Patterns Worth Keeping (and the Ones to Skip)

Distilled from the research audit (citations live in `research-sitecore-admin-interface.md` and `sitecore-dump/SYNTHESIS.md`):

**Keep:**
1. **Persistent left-side content tree** as the spine of the app. Right-click context menu with Insert filtered by valid child types ("insert options"). Gutter icons left of each node for workflow state, lock, and language-missing.
2. **Workspace area** with breadcrumb header, collapsible field sections that mirror template sections, and shared/localized field labels always visible inline.
3. **Action bar at the bottom** of the workspace — *not* a thick ribbon. Save / Submit / Approve / Reject / Publish / Schedule / Preview / Open in Page Builder. The PRD already specifies this and it's the right call (`PRD-admin-panel.md:283–295`).
4. **Workbox** as a separate workflow dashboard route (already built — keep).
5. **Language switcher in the top bar** with a banner when the current item is missing a translation. Authors shouldn't have to hunt for language state.
6. **Visual editor (Page Builder) reachable from any page** via a single button in the action bar — the Sitecore "Experience Editor" entry but cleaner.
7. **Media picker as a modal dialog** invokable from any image/file field, not a separate page.

**Explicitly skip:**
1. **Standard Fields hidden by default** — bury workflow controls and authors think "I clicked Publish, why isn't it live?" Show them inline.
2. **Lock-creates-a-version model** — auto-save with explicit "Save Draft" button, no version bloat.
3. **Smart vs Republish vs Incremental publish modes** — one Publish button, do the right thing under the hood.
4. **Raw Values toggle, Presentation Details XML dialog, Item Buckets** — developer-targeted UX leaks. Page Builder absorbs presentation; nothing replaces buckets (we have search instead).
5. **Sitecore's ribbon (Tabs > Strips > Chunks > Buttons)** — too heavy. The action bar pattern from the PRD is the modern equivalent.
6. **Rich Text Editor that mangles Word paste** — Lexical handles this better natively; don't import Sitecore's RTE pain.

**Modern sprinkles to layer on top** (not in Sitecore, worth adding):
- Cmd+K command palette (already built — promote it to first-class navigation).
- Skeleton loading states everywhere (Payload's blocking spinners are jarring).
- Optimistic UI on tree mutations (drag, rename, delete).
- Inline diff view for version comparison (already built — surface it from the action bar, not buried).
- "Recent items" and "Pinned items" widgets on the dashboard (built — reinforce them).

## 3. What We'd Be Replacing

From the architecture recon, these are the surfaces Payload owns today that the new shell needs to absorb:

| Surface | Today | Replacement strategy |
|---|---|---|
| Outer page chrome (header, nav frame, footer) | `RootLayout` from `@payloadcms/next/layouts` in `(payload)/layout.tsx:14` | Custom `<AdminShell>` component — header, persistent left tree, workspace slot, status bar |
| Sidebar nav | `CustomNav.tsx` (already ours, but injected into Payload's frame) | Promote to first-class — owns its own routing |
| Collection list views (15+ collections) | Payload's auto-generated tables | Custom list view per collection OR generic data-grid driven by collection config |
| Collection edit forms (15+ collections) | Payload's auto-generated field renderers | Either: compose `@payloadcms/ui` field primitives into our shell, or build native field renderers |
| Global edit forms (Navigation, Footer, Homepage, etc.) | Payload's global edit UI | Same as collection edit |
| Login / forgot password / account | Payload's auth pages | Custom branded pages calling `payload.auth()` |
| Media collection upload | Payload's native form | Already replaced for browsing; need to absorb upload form |
| Right panel of Content Tree | `<iframe src="/admin/collections/pages/:id">` (`ContentTreeClient.tsx:931`) | The iframe goes away once we have native edit forms |

Two non-negotiables from the spike:
- **`@payloadcms/ui` is our friend.** It exports React components for every field type (TextInput, RichText, Relationship, etc.) that already speak Payload's data shape. Reusing them gets us 80% of the field renderer work for free. The remaining 20% is composing them into our visual language and adding our own chrome.
- **Auth stays Payload-native** for `/admin`. `payload.auth({ headers })` with cookie sessions. Clerk continues to gate frontend `/my-account/*` only. This is already how things work — don't disturb it.

## 4. Three Sequencing Options

### Option A — Shell-First ("Wrap then Replace")

**Step 1.** Build a new `<AdminShell>` that owns the outer chrome (top bar, persistent left tree spine, workspace slot, action bar, status gutter). Mount it as a layout for `/admin/*`.
**Step 2.** Move every existing custom view (Tree, Workbox, Builder, Media, Schedule, Language Audit, Dashboard) into the new shell. Drop them out of Payload's `admin.components.views` registration; instead route them through Next.js routes inside the shell layout.
**Step 3.** For every collection edit/list page, render Payload's `RootPage` *inside* a workspace slot of our shell — visually framed by our chrome but functionally still Payload underneath. The seam is the inner edit area only.
**Step 4.** Replace Payload's inner edit forms one collection at a time, sorted by author traffic. The shell never changes; only the contents of the workspace slot does.
**Step 5.** When the last collection migrates, retire Payload's view layer entirely. Payload's `RootPage` survives only at `/admin/_payload/*` as the dev backdoor.

**Pros:** Lowest risk per step. Authors get the new shell on day one even though forms look the same. Easy to ship in two-week increments. Page Builder and Tree don't have to change at all initially.
**Cons:** Mixed visual language during the transition (our chrome + Payload forms). The "wrap Payload's RootPage in our shell" trick may fight against Payload's own layout assumptions — needs a quick spike to confirm it's tractable.

### Option B — Forms-First ("Native Editor Beachhead")

**Step 1.** Pick one high-traffic collection (Pages is the obvious candidate — it powers Page Builder, Tree, Workbox, Schedule). Build a fully native edit view for Pages that uses `@payloadcms/ui` field components composed into a Sitecore-style three-pane: tree on left, fields in center, action bar at bottom, language switcher + lock + version status in a top strip.
**Step 2.** Wire the Content Tree's right panel to the new native view (kill the iframe). Wire Workbox's "Open in Editor" to the same view.
**Step 3.** Repeat for the next-highest-traffic collection (News, then Projects, then Boards). Each one lives at `/admin/edit/:collection/:id` in our shell.
**Step 4.** Once 5+ collections are native, build the outer shell that owns everything. List views and remaining collections come later.
**Step 5.** Final cleanup — replace Payload's login, account, etc.

**Pros:** Solves the most painful seam first (the iframe). Authors immediately see a native, polished edit experience for the content they touch most. Forces us to validate that `@payloadcms/ui` composes cleanly inside our shell early.
**Cons:** Authors live in two visual worlds for longer (new edit views + old Payload everything else). Higher per-step build cost — each native edit view is a meaningful chunk of work. The shell question doesn't get answered until late.

### Option C — Greenfield at `/cms`, Cutover Later

**Step 1.** Promote `/cms` from "branded landing page" into the new full custom admin. Build the shell, the tree, the native edit views — everything — at `/cms/*`, with no constraint to coexist with Payload.
**Step 2.** While building, `/admin` keeps working as today (Payload + our injected views) so authors aren't blocked.
**Step 3.** When `/cms` reaches feature parity, redirect `/admin` → `/cms` and demote Payload to `/admin/_dev` or similar.
**Step 4.** Eventually retire `/cms` as a separate URL — fold it into `/admin`.

**Pros:** Maximum freedom. No fights with Payload's layout assumptions. Can be developed in parallel by a separate workstream. Cleanest end state.
**Cons:** Highest total build cost. Two admins running side-by-side for a long time. Risk of `/cms` and `/admin` drifting and never reaching parity. Authors get nothing until cutover day. We've already burned `/cms` on a different concept (a branded landing page) — repurposing it adds confusion.

## 5. Recommendation

**Option A (Shell-First) with one piece of B borrowed up front.**

Reasoning:
- The outer shell is the highest-leverage change — it sets the visual language, establishes the persistent tree, gives us the action bar, fixes the language switcher placement. One sprint of work flips the whole admin's feel.
- Wrapping Payload forms in our shell is a known pattern (it's how Payload's view injection points work today, just inverted). The risk is bounded and we'll know in a one-day spike whether wrapping `RootPage` in our layout is tractable. If it's not, we fall back to Option B for the affected pages.
- Borrowing from B: build a **native edit view for Pages** in parallel with the shell, because the Tree-iframe seam is the single ugliest thing in the current admin and it powers Page Builder, Workbox, and Schedule downstream. This lets us kill the iframe by end of the first phase.
- Defer Option C — `/cms` as a parallel admin doubles the surface area. We don't need that escape hatch.

## 6. Proposed Layer Breakdown (if we proceed)

This is sketch-level; turning it into a `BUILD_PLAN.md` is a separate session.

- **Layer 0 — Shell foundations.** `<AdminShell>` component (header, left rail with tree, workspace slot, action bar, status gutter). Tailwind-first, brand tokens lifted from `src/config/brand.ts` into CSS variables. Routes restructured under `/admin/*` with our layout.
- **Layer 1 — Move existing custom views into the shell.** Tree, Workbox, Builder, Media, Schedule, Language Audit, Dashboard. Drop the Payload view-injection registrations.
- **Layer 2 — Wrap Payload edit/list pages in the shell.** Workspace slot embeds `RootPage` for collections without native views yet. Validate the wrapping pattern.
- **Layer 3 — Native edit view for Pages.** Three-pane, action bar wired to existing workflow hooks, language switcher, version diff button, lock indicator — all already built as components, just needs assembly. Iframe dies.
- **Layer 4 — Native edit views for the next 4 collections** (News, Projects, Boards, DocumentsForComment) — pattern from L3 templated.
- **Layer 5 — Native list views.** Generic list view component driven by collection config; per-collection overrides where needed (BoardFilterBar, FrTranslationWarning).
- **Layer 6 — Remaining collections + globals + auth pages.** The long tail.
- **Layer 7 — Retire Payload's view layer.** Remove `admin.components.views` registrations. Payload survives at `/admin/_payload/*` as dev backdoor only.

Rough order-of-magnitude: similar shape to the original Admin Platform layers. ~6–8 weeks of focused work, dependent on how much of the field-renderer work we can lean on `@payloadcms/ui` for.

## 7. Decisions (locked 2026-05-02)

1. **Single `/admin`** — retire `/cms`. CLAUDE.md doc-map updated separately.
2. **All list views custom** — accepts +3-4 weeks for full visual consistency. No Payload tables in the final state.
3. **Branded login page in scope** — FRAS Canada logo + brand colors (#601F5B FRAS purple, #00438C councils blue, #983232 boards red-brown). Replaces Payload's stock login.
4. **Path 2 — full custom field renderers from day one.** Brand-perfect, plugin-extractable per `layer-5-plugin-extraction-scoping.md`. Adds +6-8 weeks but unlocks the long-term plugin story. Lexical, Relationship, Upload, Blocks, Array, Localized — all reimplemented against Payload's REST API + `useDocumentInfo` hooks (or pure REST), not via `@payloadcms/ui`.
5. **Hybrid Page Builder entry** — (a) "Open in Page Builder" button in the action bar on Pages-collection edit views, AND (b) top-level nav item at `/admin/builder` for direct entry to "edit a known page's layout right now." Two ways in, both first-class.
6. **Action bar at the bottom** — modern pattern, matches PRD. ~56px sticky strip with Save Draft / Submit / Approve / Reject / Publish / Schedule / Preview / Open in Page Builder. Verbs context-filtered by record state. No ribbon.

**Revised total timeline estimate:** ~15-20 weeks (base 6-8 + custom lists 3-4 + custom field renderers 6-8).

---

## 8. References

- `research-sitecore-admin-interface.md` — full Sitecore Content Editor / Experience Editor research
- `sitecore-dump/SYNTHESIS.md` — extracted from FRAS's actual Sitecore instance; workflow states, branching, language counts
- `sitecore-dump/workflows-content.md` — FRAS's specific 3-state workflow + email recipients
- `sitecore-dump/media-library.md` — FRAS's 1,275 media items, board-folder structure
- `PRD-admin-panel.md` — original admin PRD specifying tree + fields + action bar pattern
- `layer-5-plugin-extraction-scoping.md` — long-term roadmap for extracting reusable pieces as Payload plugins
- `spike-content-tree-plugin.md` — sister spike on extracting Content Tree as a standalone plugin (compatible with this work)
