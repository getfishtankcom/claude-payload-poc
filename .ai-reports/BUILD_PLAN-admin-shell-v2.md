# Build Plan — Admin Shell v2 (Sitecore-flavored Custom Admin)

**Date opened:** 2026-05-02
**Source spike:** `.ai-reports/spike-admin-shell-replacement.md` (decisions locked 2026-05-02)
**Sibling:** `.ai-reports/BUILD_PLAN.md` (Admin Platform v1 — feature-complete with two known partials)
**Target:** Replace Payload's `/admin` UI entirely. Custom shell, custom field renderers, custom list views, custom auth pages. Payload survives at `/admin/_payload/*` as the dev backdoor only.

---

## Locked Decisions (from spike)

| # | Decision |
|---|----------|
| 1 | Single `/admin` URL — retire `/cms` |
| 2 | All list views custom — no Payload tables in final state |
| 3 | Branded login + brand colors (#601F5B / #00438C / #983232) + FRAS Canada logo |
| 4 | Full custom field renderers from day one — plugin-extractable |
| 5 | Hybrid Page Builder entry — action-bar button on Pages + top-level nav item |
| 6 | Action bar at bottom — no ribbon |

**Estimated total effort:** ~15-20 weeks across 9 layers.

---

## Layer 0 — Shell Foundations (3 weeks)

Outer chrome that owns the whole `/admin` experience. Everything else mounts inside this.

### Tasks
- **0.1** — Brand token system. Lift `src/config/brand.ts` constants into CSS custom properties on `<html>`. Wire to Tailwind v4 `@theme` block. Tokens: brand-fras (#601F5B), brand-councils (#00438C), brand-boards (#983232), brand-gray-{50..900}, semantic tokens (workflow-draft, workflow-review, workflow-revision, workflow-approved, workflow-published, lock, language-warning).
- **0.2** — `<AdminShell>` component skeleton. Header (logo, language switcher, user menu, command palette trigger, notification bell), persistent left rail (collapsible), workspace slot, bottom action bar slot, status gutter at far left.
- **0.3** — Restructure routes. Move `(payload)/admin/[[...segments]]/page.tsx` to a layout that mounts `<AdminShell>` and renders children. Custom views move from Payload's `admin.components.views` registration into Next.js routes under the new layout.
- **0.4** — Persistent left tree. Mount the existing Content Tree as a permanent left-rail spine (collapsible). Tree state survives navigation between any `/admin/*` route. Selecting a node deep-links to `/admin/edit/:collection/:id`.
- **0.5** — Action bar component. Sticky bottom strip, brand-token styled, slot-based so each edit view contributes its verbs. Default verbs come from workflow state machine.
- **0.6** — Top-bar language switcher. EN/FR toggle, banner when current item is missing the other locale.
- **0.7** — Tailwind `@source` paths expanded to cover all of `src/admin/**` (currently scoped to builder + PageBuilder views only).
- **0.8** — Auth bridge. `<AdminShell>` reads `payload.auth()` server-side, redirects unauthenticated to `/admin/login`. Bypasses middleware (already excluded).

**Layer 0 Gate:** New shell renders at `/admin` with placeholder workspace; left tree spine visible; action bar visible; brand colors live; language switcher functional; tsc clean.

---

## Layer 1 — Field Renderer Primitives (5 weeks — biggest layer)

The foundational invest. Without these, no native edit view ships.

### Tasks
- **1.1** — `<TextField>` — single-line, multi-line; locale-aware; lock-aware; validation surface; dirty tracking.
- **1.2** — `<NumberField>` — int + decimal; min/max validation.
- **1.3** — `<SelectField>` — single + multi; option groups; searchable variant for >10 options.
- **1.4** — `<DateField>` + `<DateTimeField>` — calendar picker, timezone-aware.
- **1.5** — `<CheckboxField>` + `<RadioField>` + `<ToggleField>`.
- **1.6** — `<RelationshipField>` — single + multi; search/autocomplete; tree-picker variant; ancestor breadcrumb display; create-on-the-fly.
- **1.7** — `<UploadField>` — opens existing Media Library modal (already built); shows thumbnail; alt-text inline.
- **1.8** — `<RichTextField>` — Lexical re-wrap. Toolbar (B/I/U/Link/Heading/List/Quote/Code), our existing Lexical config nodes, image embed via Media Library modal, link picker via Relationship picker.
- **1.9** — `<ArrayField>` — repeater with DnD reordering (@dnd-kit), add/remove, collapsed/expanded per row.
- **1.10** — `<BlocksField>` — Payload's blocks pattern; type picker; per-block field renderers; DnD; the foundation Page Builder leans on.
- **1.11** — `<JoinField>` (read-only display of joined relations).
- **1.12** — `<TabsField>` + `<GroupField>` + `<RowField>` — layout primitives; collapsible sections.
- **1.13** — `<LocalizedField>` wrapper — wraps any field, renders EN/FR side-by-side or via locale toggle, syncs to `?locale=` URL param.
- **1.14** — Form context provider (`<EditFormProvider>`) — owns dirty state, validation aggregation, submit lifecycle, autosave wiring, undo/redo stack.
- **1.15** — Field section chrome — collapsible sections, section headers driven by collection field groupings, "shared field" badge when localization is off, lock indicator inline.
- **1.16** — Storybook coverage for all 13 field components — every variant, locked state, validation error state, dirty state, locale-split state.

**Layer 1 Gate:** All 13 field types render in Storybook, accept Payload's field-config shape, save data via REST, dirty/validation/autosave all functional. Lexical parity with current implementation verified.

**Why this is the biggest layer:** Lexical alone is ~1.5 weeks. Relationship picker with ancestor breadcrumb is ~1 week. Blocks with DnD is ~1 week. Form context with autosave/undo is ~1 week. Plus 13 field types polished + Storybook = the rest.

---

## Layer 2 — Move Existing Custom Views into the Shell (1 week)

### Tasks
- **2.1** — Migrate Tree to `/admin` (replace dashboard? or render as permanent left rail per Layer 0.4 with a separate `/admin/tree` deep-link for full-screen tree view).
- **2.2** — Migrate Workbox to `/admin/workbox` inside the shell.
- **2.3** — Migrate Page Builder to `/admin/builder/:id` + add top-level `/admin/builder` index per decision Q5.
- **2.4** — Migrate Media Library to `/admin/media`.
- **2.5** — Migrate Schedule + Language Audit + Notifications + Dashboard widgets.
- **2.6** — Drop all `admin.components.views` registrations from `payload.config.ts`. Drop `admin.components.Nav` (CustomNav becomes the shell's left-rail header, not a Payload-injected nav).

**Layer 2 Gate:** Every existing custom view renders inside `<AdminShell>` with no Payload chrome visible; tsc clean; all views functional.

---

## Layer 3 — Native Edit View for Pages (2 weeks) — kills the iframe

### Tasks
- **3.1** — `/admin/edit/pages/:id` route + page component. Three-pane: persistent tree left, fields center, action bar bottom. Uses Layer 1 field primitives.
- **3.2** — Section grouping driven by Pages collection config (Content / SEO / Layout / Workflow / Translation).
- **3.3** — Locale toggle in top bar wired to fields.
- **3.4** — Lock indicator + take-over flow.
- **3.5** — Workflow action bar wires to existing workflow hooks (already built).
- **3.6** — Version diff button → existing modal.
- **3.7** — "Open in Page Builder" button (decision Q5) — full-screen takeover, returns to fields on close.
- **3.8** — Wire Content Tree's right panel from iframe (`ContentTreeClient.tsx:931`) → React-Router-style navigation to `/admin/edit/pages/:id`. **Iframe deleted.**
- **3.9** — Wire Workbox + Schedule "Open in Editor" buttons to the new route.

**Layer 3 Gate:** A page can be created, edited, translated, locked, submitted, approved, published, scheduled, preview-ed, and opened in Page Builder — all from the new native view. `<iframe>` references in `src/admin/views/` = 0.

---

## Layer 4 — Native Edit Views for Top 4 Collections (2 weeks)

Templated from Layer 3. One per high-traffic collection.

### Tasks
- **4.1** — News native edit view (`/admin/edit/news/:id`).
- **4.2** — Projects native edit view (`/admin/edit/projects/:id`).
- **4.3** — Boards native edit view (`/admin/edit/boards/:id`).
- **4.4** — DocumentsForComment native edit view (`/admin/edit/documents-for-comment/:id`).

**Layer 4 Gate:** All 4 collections fully editable in the new shell. No Payload edit forms used for these collections.

---

## Layer 5 — Native List Views (3 weeks per decision Q2)

### Tasks
- **5.1** — `<DataTable>` generic component. Driven by collection config: column picker, sort, filter, paginate, bulk actions, gutter icons (workflow state, lock, FR-missing). Uses Layer 0 brand tokens.
- **5.2** — Bespoke list view: Pages — tree-aware, board badge, status pill, last-edited, FR status.
- **5.3** — Bespoke list view: News — thumbnail, headline, board, date, status.
- **5.4** — Bespoke list view: Projects — timeline pill (which stage), board, deadline, status.
- **5.5** — Bespoke list view: Events — date/time, type icon (meeting/webinar/deadline), board, status.
- **5.6** — Generic `<DataTable>` mounted for the remaining 11+ collections (Resources, BoardMembers, Committees, Contacts, Standards, StandardsSections, Consultations, JobPostings, Redirects, Notifications, Dictionary).
- **5.7** — Existing list-injected components (BoardFilterBar, RedirectsImportButton, FrTranslationWarning) ported into `<DataTable>` slot system.

**Layer 5 Gate:** Every collection has a native list view inside `<AdminShell>`. No Payload list views reachable except via `/admin/_payload/*` backdoor.

---

## Layer 6 — Remaining Edit Views + Globals (2 weeks)

### Tasks
- **6.1** — Native edit views for the remaining 11+ collections (Resources, BoardMembers, Committees, Contacts, Standards, StandardsSections, Events, Consultations, JobPostings, Redirects, Notifications, Dictionary).
- **6.2** — Native edit views for all 6 globals (Navigation, Footer, Homepage, SearchConfig, AuthConfig, SiteAlert).

**Layer 6 Gate:** No Payload edit page renders inside `/admin/*`. Every collection + global has a native view.

---

## Layer 7 — Branded Auth Pages (1 week per decision Q3)

### Tasks
- **7.1** — `/admin/login` — branded layout. FRAS Canada logo, brand purple (#601F5B), "Sign in to Reporting and Assurance Standards Canada" copy. Email + password fields using Layer 1 field primitives. Calls Payload's `/api/users/login` endpoint.
- **7.2** — `/admin/forgot-password` — same shell, simpler form.
- **7.3** — `/admin/reset-password/:token` — same shell.
- **7.4** — `/admin/account` — user profile edit (name, email, password change, locale preference).

**Layer 7 Gate:** No Payload auth UI ever visible. New auth pages WCAG 2.2 AA pass via axe-core.

---

## Layer 8 — Retire Payload's View Layer + Cutover (1 week per decision Q1)

### Tasks
- **8.1** — Move Payload's catch-all from `/admin/[[...segments]]` to `/admin/_payload/[[...segments]]`. Role-gate to admin role only.
- **8.2** — Add a `/admin/_payload` warning banner: "You are using the Payload developer backdoor. The official admin is at /admin."
- **8.3** — Retire `/cms` route entirely. Add 301 redirect `/cms` → `/admin`.
- **8.4** — Remove `/cms` references from CLAUDE.md, all PRDs, `.ai-reports/` doc map.
- **8.5** — Remove `/cms` exclusion from `middleware.ts` matcher.
- **8.6** — Final pass: search codebase for `@payloadcms/ui` imports in `src/admin/**` — should be zero. (We agreed Path 2: pure custom field renderers, no `@payloadcms/ui`.)

**Layer 8 Gate / Final Sign-off:**
- `/admin` lands on the new shell unconditionally
- `/cms` returns 301 to `/admin`
- `/admin/_payload` shows the dev backdoor (admin-only)
- Zero `@payloadcms/ui` imports in `src/admin/**`
- Zero `<iframe>` elements in `src/admin/**`
- Lighthouse + axe-core pass on `/admin`, `/admin/login`, all 15+ collection list views, all 15+ collection edit views
- All Layer 5 Gate green checks still passing

---

## Cross-Cutting Concerns

### Plugin extractability (decision Q4 implication)
Per `layer-5-plugin-extraction-scoping.md`, the field renderer library (Layer 1) and the shell (Layer 0) are the two highest-value extraction candidates. Build them with extraction in mind: no FRAS-specific imports inside the field primitives; collection-config-driven, not hardcoded; brand tokens injected via CSS variables, not hardcoded values. v2 (post-launch) opens a separate workspace package for npm publication.

### Migration of existing data
None. This is a UI replacement only. Data shape is unchanged. Payload remains the data layer.

### Risk register
1. **Lexical re-wrap fidelity** (Layer 1.8) — risk that our Lexical implementation diverges from current behavior. Mitigation: copy current Lexical config 1:1, swap only the surrounding chrome.
2. **Form context autosave correctness** (Layer 1.14) — autosave is hard. Mitigation: Vitest coverage on dirty-tracking, validation aggregation, and submit lifecycle from day one.
3. **Tree-as-permanent-left-rail performance** (Layer 0.4) — keeping the tree mounted across all routes adds memory pressure. Mitigation: virtualize tree nodes (already done in current implementation), defer rendering of collapsed branches.
4. **Login page broke auth flow** (Layer 7) — replacing Payload's login could subtly break cookie/session handling. Mitigation: test the new login against Payload's actual `/api/users/login` early; don't reimplement the auth API itself.
5. **Plugin extraction temptation** (cross-cutting) — building toward extraction can slow v1 ship. Mitigation: build plain, document extraction surface, defer actual workspace split to v2.

---

## Dependencies + Sequencing

```
Layer 0 (shell foundations) ────────────────┐
        │                                   │
        ▼                                   │
Layer 1 (field primitives) ─────┐           │
        │                       │           │
        ▼                       ▼           ▼
Layer 2 (move custom views) ──┬──► Layer 3 (Pages edit)
        │                     │           │
        │                     │           ▼
        │                     │     Layer 4 (4 collections edit)
        │                     │           │
        │                     │           ▼
        │                     └─► Layer 5 (list views)
        │                                 │
        │                                 ▼
        │                           Layer 6 (remaining edit + globals)
        │                                 │
        │                                 ▼
        │                           Layer 7 (auth pages)
        │                                 │
        ▼                                 ▼
Layer 8 (cutover + retire Payload UI) ◄───┘
```

Layers 0 + 1 must complete before Layer 3 starts. Layers 2 + 3 can run in parallel once Layer 1 is done. Layers 4 + 5 can run in parallel after Layer 3.

---

## What This Build Plan Does NOT Cover

- **Content Migration (Phase 3)** — separate ~2,700-item migration, separate plan.
- **Plugin extraction to npm** — defer to v2, post-launch.
- **The two existing Layer 0 partials** (`npm run build` RSS prerender; `MediaLibraryClient.tsx` decomposition) — closed in a separate cleanup pass before this plan starts, or absorbed into Layer 0.
- **Performance tuning** (LCP/INP/CLS) — Layer 8 sign-off includes Lighthouse pass, but dedicated perf work happens after.

---

## Next Step

Open a `MASTER_TODO-admin-shell-v2.md` with task-level acceptance criteria + Ralph stop conditions, mirroring the existing `MASTER_TODO.md` structure. Layer 0 is ready to start once that's drafted.
