# PRD — Admin Shell v2 (Sitecore-flavored Custom Admin)

**Date:** 2026-05-02
**Status:** Decisions locked. Ready to break into GitHub issues + Ralph loops.
**Source spike:** `.ai-reports/spike-admin-shell-replacement.md`
**Source build plan:** `.ai-reports/BUILD_PLAN-admin-shell-v2.md`
**Sibling:** `.ai-reports/PRD-admin-panel.md` (Admin Platform v1, feature-complete)
**Estimated effort:** ~15-20 weeks across 9 layers

---

## Problem Statement

The FRAS Canada admin platform is a hybrid: we own a handful of custom views (Content Tree, Workbox, Page Builder, Media Library, Schedule, Language Audit, Dashboard) but they all render *inside* Payload's outer shell. Every collection edit page, list page, login page, account page, and global is 100% stock Payload UI. The Content Tree's right panel is even an `<iframe>` into Payload's edit form.

From an author's perspective, this means:
- Two visual languages collide every session — our brand-token-driven Tailwind shell vs Payload's default SCSS.
- The promise that "everything flows through `/admin`" is half-true. Authors learn one set of muscle-memory for our custom views and a second for Payload's edit forms.
- Workflow controls, language indicators, and lock state are invisible or buried in Payload's edit forms; visible and prominent in our custom views. The inconsistency erodes trust.
- Sitecore-trained authors (the 6 personas: Amanda, Chris, Melissa, Mohamed, Philip, Shari) lose the Sitecore mental model the moment they leave Tree/Workbox/Media for any "real" content edit.

The goal: a single, custom admin at `/admin` that absorbs every surface Payload's UI currently owns. Sitecore mental model (tree-first, workspace, action bar, gutter for status) with modern polish (Cmd+K, optimistic UI, skeleton loading, inline diffs). Payload remains the data layer; its UI moves to a developer-only backdoor at `/admin/_payload/*`.

## Solution

Build `<AdminShell>` — a custom React shell that owns the entire `/admin/*` surface. Replace Payload's stock UI piece-by-piece across 9 layers:

1. Outer chrome, brand tokens, persistent left tree spine, top-bar language switcher, sticky-bottom action bar.
2. Library of 13 custom field renderer primitives (TextField, RichTextField, RelationshipField, BlocksField, etc.) — built from scratch against Payload's REST API + hooks, *not* composed from `@payloadcms/ui`. This unlocks plugin extraction in v2.
3. Move existing custom views (Tree, Workbox, Builder, Media, Schedule, Language Audit, Dashboard) into the new shell.
4. Build a native edit view for the Pages collection — kills the iframe seam.
5. Templated native edit views for News, Projects, Boards, DocumentsForComment.
6. Custom `<DataTable>` for list views — generic component driven by collection config + bespoke layouts for the 4 highest-traffic collections.
7. Native edit views for the remaining 11+ collections + 6 globals.
8. Branded auth pages — login, forgot password, reset, account — with FRAS Canada logo + brand purple (#601F5B).
9. Cutover — Payload's UI moves to `/admin/_payload/*`, `/cms` returns 301 to `/admin`, all `@payloadcms/ui` imports purged from `src/admin/**`.

The end state: zero stock Payload pages, zero iframes, zero `@payloadcms/ui` imports in our admin code. One coherent, brand-perfect, Sitecore-flavored editing experience.

## User Stories

### Authoring & navigation

1. As a content author, I want a persistent left-side content tree visible from every admin route, so that I can navigate the site hierarchy without losing context.
2. As a content author, I want gutter icons next to each tree item showing workflow state, lock status, and missing-translation warnings, so that I can scan the site's editorial state at a glance.
3. As a content author, I want to right-click any tree item to insert a new child of a valid type only, so that I cannot accidentally create an invalid hierarchy.
4. As a content author, I want a Cmd+K command palette accessible from any admin route, so that I can jump to any record, view, or action without using the mouse.
5. As a content author, I want a sticky action bar at the bottom of every edit view containing Save Draft / Submit for Review / Approve / Reject / Publish / Schedule / Preview, so that I always know where the verbs are.
6. As a content author, I want to see only the verbs that apply to the current record's workflow state, so that I never click a button that fails or does nothing.
7. As a content author, I want the language switcher in the top bar with a banner when the current item is missing the other locale, so that I never accidentally edit in the wrong language.
8. As a content editor, I want a Workbox dashboard listing every item in flight grouped by workflow state, so that I can triage approvals without hunting through collections.

### Field editing

9. As a content author, I want field sections that mirror the collection's template grouping (Content / SEO / Layout / Workflow), collapsible, with the layout I'd expect from Sitecore's Content Editor, so that the form is scannable.
10. As a content author, I want all fields visible by default — no hidden Standard Fields tab — so that I never wonder where workflow or publishing controls went.
11. As a content author, I want shared (non-localized) fields visually distinguished from localized fields, so that I understand which edits affect both languages.
12. As a content author, I want a rich text editor with parity to current Lexical config (toolbar, headings, lists, links, image embeds via Media Library), so that nothing regresses from today's editing experience.
13. As a content author, I want relationship pickers that show ancestor breadcrumbs (e.g., "FRAS > Boards > AcSB"), search, and create-on-the-fly, so that I can find or create related records without leaving the form.
14. As a content author, I want autosave on field changes with explicit Save Draft for major commits, so that I never lose work but also never get unwanted version bloat.
15. As a content author, I want undo/redo in the form context for any field change, so that I can experiment without fear.
16. As a content author, I want validation errors inline beside each field with a summary at the top, so that I can fix problems without scrolling.
17. As a translator, I want EN/FR side-by-side or via locale toggle on every localized field, so that I can see source and target together.

### List views

18. As a content author, I want a custom list view per collection styled to match the rest of the admin, so that I never see a stock Payload table.
19. As a content author, I want bespoke list layouts for high-traffic collections (Pages tree-aware; News with thumbnail + headline + board + date; Projects with timeline pill; Events with date/time + type icon), so that the list view actively helps me find what I'm looking for.
20. As a content author, I want column picker / sort / filter / paginate / bulk actions consistent across every list, so that I have one mental model for browsing.
21. As a content author, I want gutter icons in the list view matching the tree (workflow state, lock, FR-missing), so that scanning state is consistent everywhere.
22. As a content editor, I want bulk-publish, bulk-archive, bulk-translate-FR available from list views, so that I can manage queues efficiently.

### Page Builder integration

23. As a content author editing a Page, I want an "Open in Page Builder" button in the action bar, so that I can switch to visual layout editing without leaving the record.
24. As a content author, I want Page Builder also reachable from a top-level nav item at `/admin/builder`, so that I can jump straight into visual editing of a known page.
25. As a content author in Page Builder, I want the action bar to remain available with the same Save / Submit / Publish verbs, so that workflow does not require leaving Page Builder.

### Authentication & account

26. As a content author, I want the login page branded with the FRAS Canada logo and brand purple (#601F5B), so that the admin feels like part of FRAS, not a generic CMS.
27. As a content author, I want forgot-password / reset-password / account-edit pages branded consistently with login, so that the experience is coherent end-to-end.
28. As a developer, I want Payload's stock admin still reachable at `/admin/_payload/*` (admin role only) for debugging, so that I retain the developer backdoor.

### Cross-cutting expectations

29. As a content author, I want skeleton loading states on every list, tree, and edit view, so that the UI never appears frozen.
30. As a content author, I want optimistic UI on tree mutations (drag, rename, delete) with rollback on error, so that interactions feel instant.
31. As a content author, I want inline version diff accessible from the action bar of any edit view, so that I can compare before publishing.
32. As a content author, I want recent items and pinned items widgets on the dashboard, so that I can return quickly to in-flight work.
33. As a content editor, I want all admin pages WCAG 2.2 AA compliant (axe-core 0 violations) and Lighthouse-passing on perf/a11y, so that the editorial experience meets the same standards as the public site.
34. As a content author, I want `/cms` redirected (301) to `/admin`, so that there is one canonical URL for the admin.

## Implementation Decisions

### Architecture

- **Single admin URL** — `/admin/*` owns everything. `/cms` is retired with a 301 redirect.
- **Payload UI moves to `/admin/_payload/[[...segments]]`** — admin role gated. Banner indicates this is the dev backdoor.
- **No `@payloadcms/ui` imports in `src/admin/**`** — verified by grep at Layer 8 sign-off. Field renderers built from scratch against Payload's REST API + `useDocumentInfo`-style hooks (or pure REST).
- **Tailwind v4 + CSS custom properties bridge** — brand tokens lifted from `src/config/brand.ts` into `:root` CSS variables, wired to Tailwind's `@theme` block. Per-board accent colors expressed as semantic tokens (workflow-draft, workflow-approved, etc.).
- **TanStack Query** for all admin data fetching — no raw `fetch()` in admin views (existing convention).
- **Auth bridge** — `<AdminShell>` reads `payload.auth({ headers })` server-side, redirects unauthenticated to `/admin/login`. Middleware exclusion preserved.

### Modules

**Deep modules (built with extraction in mind, unit tested in isolation):**

- **`<EditFormProvider>`** — owns dirty state, validation aggregation, autosave debouncing, undo/redo stack, optimistic submit lifecycle. Single source of truth for "is this form dirty / valid / submitting / pending."
- **Field renderer primitive library** — 13 components, uniform interface `(config, value, onChange, locale, lockState, validation)`. Each independently usable. Lexical, Relationship, Upload, Blocks, Array reimplemented from scratch. This is the library extracted as a Payload plugin in v2.
- **`<DataTable>` engine** — generic list view driven by collection config. Sort, filter, paginate, bulk actions, gutter icons. Bespoke list views (Pages, News, Projects, Events) compose `<DataTable>` with collection-specific overrides.
- **Persistent tree state store** — Zustand-style; selected node, expanded set, search query, scroll position survive navigation across `/admin/*`. Tree component subscribes; mutations are optimistic.
- **Action bar slot system** — bottom-strip component receives verb contributions from each edit view. Each verb declares visibility conditions against the current record's workflow state. Renders only applicable verbs.

**Shallow modules (composition / config / markup):**

- **`<AdminShell>`** — outer chrome (header, left rail, workspace slot, action bar slot, status gutter). Storybook + e2e covered, no unit tests.
- **Locale toggle / language switcher / language-missing banner** — small UI primitives.
- **Branded auth pages** — login, forgot, reset, account. Markup + form submit; e2e flows cover behavior.
- **Cutover routes** — Payload UI to `/admin/_payload/*`; `/cms` 301 to `/admin`. Config only.

### Field renderer scope (Layer 1 — biggest layer)

13 field types, each with locale-aware, lock-aware, validation-aware, dirty-tracking variants:

- TextField (single-line, multi-line)
- NumberField (int, decimal)
- SelectField (single, multi, searchable)
- DateField, DateTimeField
- CheckboxField, RadioField, ToggleField
- RelationshipField (single, multi, tree-picker, ancestor breadcrumb, create-on-the-fly)
- UploadField (Media Library modal integration)
- RichTextField (Lexical re-wrap with full toolbar + plugins)
- ArrayField (DnD reordering via @dnd-kit)
- BlocksField (Payload's blocks pattern; foundation Page Builder leans on)
- JoinField (read-only display)
- TabsField, GroupField, RowField (layout primitives)

Plus `<LocalizedField>` wrapper, form section chrome (collapsible sections, shared-field badges, lock indicators inline), Storybook coverage for all 13 components.

### List view scope (Layer 5)

- Generic `<DataTable>` mounts for all 15+ collections by default (no per-collection bespoke layout).
- Bespoke list view layouts for **Pages** (tree-aware), **News** (thumbnail + headline + board + date), **Projects** (timeline pill), **Events** (date/time + type icon). The 4 highest-traffic collections.
- Existing list-injected components (BoardFilterBar, RedirectsImportButton, FrTranslationWarning) port into `<DataTable>` slot system.

### Page Builder integration (Layer 3)

- "Open in Page Builder" button in the action bar on Pages-collection edit views. Full-screen takeover; returns to fields on close.
- Top-level nav item at `/admin/builder` for direct entry to Page Builder when the page is already known.
- Action bar persists in Page Builder — Save / Submit / Publish always available.

### Workflow & translation (existing — re-wired)

- Workflow state machine, workflow hooks, scheduled-publishing hooks, locking hooks, translation pipeline are all already built (Admin Platform v1). Layer 3 wires them into the new edit views via the action bar slot system. No re-implementation.

### Out of `<AdminShell>` (preserved)

- Existing `/api/tree`, `/api/tree/search`, `/api/media-folders/tree`, `/api/admin/schedule`, `/api/admin/language-audit`, `/api/admin/translate` stay as-is. Auth checks already added in Layer 5 Gate fix.
- Payload's REST + GraphQL APIs unchanged.
- Frontend (`/(frontend)/*`) untouched.
- Clerk gating on `/my-account/*` untouched.

## Testing Decisions

### What makes a good test here

Test **external behavior**, not implementation details. For each deep module: simulate the inputs a real caller would provide (collection config, user action, network response), assert the observable output (rendered DOM, emitted events, persisted state). Avoid testing internals like state-shape or method-call counts.

Prior art in this codebase:
- **Vitest unit tests:** `src/lib/translation/field-picker.test.ts` (19 tests, pure logic), `src/admin/builder/*.test.ts` (now deleted but pattern established).
- **Storybook:** `src/components/**/*.stories.tsx` (existing convention, 31+ story files).
- **Playwright e2e:** `tests/e2e/phase2/*.spec.ts` (existing convention).
- **axe-core:** Layer 5 runtime scan against 6 public pages (now 0 violations).

### Modules to be unit-tested (Vitest)

1. **`<EditFormProvider>`** — dirty tracking, validation aggregation, autosave debouncing, undo/redo correctness, submit lifecycle (idle → submitting → success/error). Mock field consumers.
2. **Field renderer primitives** — for each of the 13 components: rendering with valid/invalid value, onChange dispatching correct payload, locale-split rendering, lock-state interaction (read-only when locked), validation error surface.
3. **`<DataTable>` engine** — sort/filter/paginate state transitions, bulk-action selection, column-picker persistence, slot composition.
4. **Persistent tree state store** — node selection, expansion, search, mutation optimism + rollback.
5. **Action bar slot system** — verb registration, visibility filter against workflow state, slot composition.

### Modules covered by Storybook + e2e (no unit tests)

- `<AdminShell>` composition — visual regression via Storybook chromatic-style review.
- Branded auth pages — Playwright covers login → admin → logout flows.
- Locale toggle / language switcher — Storybook + e2e.
- Lexical re-wrap fidelity — Playwright type-test with sample content; assert serialized output matches expected JSON.

### Acceptance gates (per layer + final)

- **Per layer:** all unit tests passing, Storybook builds clean, `tsc --noEmit` clean, `npm run build` clean.
- **Layer 8 final gate:** Lighthouse perf+a11y ≥ 90 on `/admin`, `/admin/login`, all 15+ collection list views, all 15+ collection edit views; axe-core 0 violations; zero `@payloadcms/ui` imports in `src/admin/**` (grep verified); zero `<iframe>` elements in `src/admin/**` (grep verified).

## Out of Scope

- **Content migration (Phase 3)** — separate ~2,700-item migration, separate plan.
- **Plugin extraction to npm** — the field renderer library is built *with extraction in mind* (no FRAS-specific imports inside primitives, collection-config-driven, brand tokens via CSS variables) but the actual workspace package split + npm publish happens in v2 post-launch.
- **Payload core changes** — no fork, no patch. We work against Payload 3.84.x's published API.
- **Backend API changes** — collection schemas, hooks, access control all stay as-is.
- **Frontend (`/(frontend)/*`)** — public site untouched.
- **Performance tuning beyond Lighthouse-passing** — dedicated perf work happens after cutover.
- **Authoring of new content types** — schemas already defined; this PRD only changes the UI for editing existing types.

## Further Notes

### Risk register (from BUILD_PLAN-admin-shell-v2.md §Risk register)

1. **Lexical re-wrap fidelity** (Layer 1.8) — risk that our reimplementation diverges from current behavior. Mitigation: copy current Lexical config 1:1, swap only the surrounding chrome.
2. **Form context autosave correctness** (Layer 1.14) — autosave is hard to get right across edge cases (network drop, conflict, unmount mid-save). Mitigation: comprehensive Vitest coverage on dirty-tracking, validation aggregation, submit lifecycle.
3. **Tree-as-permanent-left-rail performance** (Layer 0.4) — keeping the tree mounted across all routes adds memory pressure. Mitigation: virtualize tree nodes (already done in current implementation), defer rendering of collapsed branches.
4. **Login page broke auth flow** (Layer 7) — replacing Payload's login could subtly break cookie/session handling. Mitigation: test against Payload's actual `/api/users/login` early; don't reimplement the auth API.
5. **Plugin extraction temptation** (cross-cutting) — building toward extraction can slow v1 ship. Mitigation: build plain, document extraction surface, defer actual workspace split to v2.

### Dependency graph

Layers 0 + 1 must complete before Layer 3 starts. Layers 2 + 3 can run in parallel once Layer 1 is done. Layers 4 + 5 can run in parallel after Layer 3.

### Personas (from CLAUDE.md, mapped to admin actors)

The 6 public personas (Amanda, Chris, Melissa, Mohamed, Philip, Shari) are the *consumers* of content. The admin actors are FRAS staff (content authors, editors, translators, site admins) plus contracted developers. Admin UX optimizes for staff who have used Sitecore for years.

### Sitecore patterns explicitly imported

- Persistent left tree as the spine
- Gutter icons (workflow / lock / language)
- Right-click insert filtered by valid child types
- Workbox dashboard
- Language switcher in top bar
- Visual editor reachable from any record
- Media picker as modal

### Sitecore patterns explicitly rejected

- Hidden Standard Fields tab
- Lock-creates-a-version model
- Multiple publish modes (Smart vs Republish vs Incremental)
- Raw Values toggle, Presentation Details XML dialog, Item Buckets
- Heavy ribbon (replaced with action bar)
- RTE that mangles Word paste

### Modern patterns added on top of Sitecore

- Cmd+K command palette
- Skeleton loading
- Optimistic UI on tree mutations
- Inline version diff
- Recent + pinned items widgets

### References

- `.ai-reports/spike-admin-shell-replacement.md` — full spike with locked decisions
- `.ai-reports/BUILD_PLAN-admin-shell-v2.md` — 9-layer task breakdown
- `.ai-reports/research-sitecore-admin-interface.md` — Sitecore UX research
- `.ai-reports/PRD-admin-panel.md` — Admin Platform v1 PRD (sibling)
- `.ai-reports/layer-5-plugin-extraction-scoping.md` — long-term plugin extraction roadmap
- `.ai-reports/sitecore-dump/SYNTHESIS.md` — FRAS's actual Sitecore patterns extracted
