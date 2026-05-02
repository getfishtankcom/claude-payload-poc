#!/usr/bin/env node
// Re-writes the bodies of issues created by create-admin-shell-v2-issues.mjs.
// Original creation used --body with shell expansion, which mangled backticks.
// This rewrite uses --body-file to avoid all shell parsing.

import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const REPO = 'cg-fishtank/claude-payload-poc';
const PARENT_EPIC = 1;
const MAP = JSON.parse(readFileSync('.ai-reports/admin-shell-v2-issue-map.json', 'utf8'));

// Inline the issue specs again — single source of truth for bodies.
const ISSUES = [
  {
    key: 'L0-brand-tokens',
    body: `## What to build
Lift \`src/config/brand.ts\` constants into CSS custom properties on \`<html>\` and wire them into Tailwind v4's \`@theme\` block. Add semantic tokens for workflow states (draft, review, revision, approved, published), lock state, language warning, and per-board accent colors (#601F5B FRAS purple, #00438C councils blue, #983232 boards red-brown).

## Acceptance criteria
- [ ] CSS variables defined on \`:root\` for all brand + semantic tokens
- [ ] Tailwind \`@theme\` block consumes the CSS vars
- [ ] \`grep -r "#601F5B" src/admin/\` returns zero hits (all references via tokens)
- [ ] Storybook example demonstrates token usage
- [ ] \`tsc --noEmit\` clean

## Implementation notes
Tailwind v4 supports CSS-first config via \`@theme\`. Keep the bridge in a single CSS file imported once at the admin layout level.

## Out of scope
Brand token usage in component refactors — that happens as each component is built.`,
    blockedBy: [],
    stories: [],
  },
  {
    key: 'L0-admin-shell',
    body: `## What to build
Outer chrome component owning the entire \`/admin/*\` experience: top header (logo, language switcher slot, user menu, command palette trigger, notification bell), persistent left rail (collapsible), workspace slot, sticky bottom action bar slot, status gutter at far left.

## Acceptance criteria
- [ ] \`<AdminShell>\` renders with brand tokens
- [ ] All slot props accept React children
- [ ] Storybook story showing default layout + collapsed left rail variant
- [ ] Responsive: narrow viewport collapses left rail to drawer
- [ ] \`tsc --noEmit\` clean

## Implementation notes
Composition-only at this stage. Slots get filled by other layer issues.

## Out of scope
Slot contents — those land in their own issues (left tree #L0-tree-spine, action bar #L0-action-bar, etc.).`,
    blockedBy: ['L0-brand-tokens'],
    stories: [1, 5],
  },
  {
    key: 'L0-routes',
    body: `## What to build
Move custom views out of Payload's \`admin.components.views\` registration into Next.js routes under a new \`/admin/*\` layout that mounts \`<AdminShell>\`. Payload's catch-all \`(payload)/admin/[[...segments]]/page.tsx\` continues to handle anything not matched by our routes (temporarily — Layer 8 retires it).

## Acceptance criteria
- [ ] New layout at \`src/app/(payload)/admin/layout.tsx\` mounts \`<AdminShell>\`
- [ ] At least one custom route (e.g. \`/admin/tree\`) renders inside the shell
- [ ] Payload's catch-all still renders for collection routes (transitional)
- [ ] \`tsc --noEmit\` clean

## Implementation notes
Don't drop the Payload registrations yet — Layer 2 does that after all custom views move.

## Out of scope
Migrating each existing custom view — those are individual tasks under Layer 2.`,
    blockedBy: ['L0-admin-shell'],
    stories: [1],
  },
  {
    key: 'L0-tree-spine',
    body: `## What to build
Mount the existing Content Tree as a permanent left-rail spine in \`<AdminShell>\`. Tree state (selection, expansion, search, scroll) survives navigation between any \`/admin/*\` route. Selecting a node deep-links to \`/admin/edit/:collection/:id\`.

## Acceptance criteria
- [ ] Tree visible on every \`/admin/*\` route
- [ ] Selection / expansion / search persist across navigation
- [ ] Clicking a node navigates without remounting tree
- [ ] Gutter icons render (workflow state, lock, FR-missing)
- [ ] Right-click context menu functional with valid-child-type filter
- [ ] \`tsc --noEmit\` clean

## Implementation notes
Use Zustand-style state store (deep module per PRD). Existing \`ContentTreeClient.tsx\` virtualization preserved.

## Out of scope
The native edit view destination (Layer 3). Until that lands, tree clicks land on the existing iframe-based Payload edit form.`,
    blockedBy: ['L0-admin-shell', 'L0-routes'],
    stories: [1, 2, 3],
  },
  {
    key: 'L0-action-bar',
    body: `## What to build
Sticky bottom strip (~56px) styled with brand tokens. Slot-based: each edit view contributes verbs (Save Draft, Submit, Approve, Reject, Publish, Schedule, Preview, Open in Page Builder). Each verb declares visibility conditions against the current record's workflow state — only applicable verbs render.

## Acceptance criteria
- [ ] \`<ActionBar>\` accepts verb contributions via slot system
- [ ] Verbs filter by workflow-state predicate
- [ ] Storybook stories: empty state, draft state, review state, approved state, published state
- [ ] Sticky on scroll, mobile-friendly
- [ ] \`tsc --noEmit\` clean

## Implementation notes
Deep module — testable in isolation per PRD §Testing Decisions.

## Out of scope
Wiring to actual workflow hooks (those land in Layer 3 and downstream).`,
    blockedBy: ['L0-admin-shell'],
    stories: [5, 6],
  },
  {
    key: 'L0-language-switcher',
    body: `## What to build
EN/FR toggle in the top header bar. Banner appears in the workspace when the current item is missing the other locale. Locale state syncs to \`?locale=\` URL param.

## Acceptance criteria
- [ ] Language switcher visible on every admin route
- [ ] Toggling updates URL + reloads workspace data with new locale
- [ ] Banner renders when current item lacks the other locale
- [ ] Storybook stories for both locale states + banner state
- [ ] \`tsc --noEmit\` clean

## Out of scope
Field-level EN/FR side-by-side rendering — that's the LocalizedField wrapper task in Layer 1.`,
    blockedBy: ['L0-admin-shell'],
    stories: [7, 17],
  },
  {
    key: 'L0-tailwind-source',
    body: `## What to build
Currently \`admin-tailwind.css\` only covers builder + PageBuilder views. Expand the \`@source\` directives to include all of \`src/admin/**\` so new components get Tailwind processing.

## Acceptance criteria
- [ ] \`@source\` covers \`src/admin/**/*.tsx\` and \`src/admin/**/*.ts\`
- [ ] Build size sanity-checked (no excessive CSS bloat)
- [ ] \`npm run build\` clean`,
    blockedBy: [],
    stories: [],
  },
  {
    key: 'L0-auth-bridge',
    body: `## What to build
\`<AdminShell>\` reads \`payload.auth({ headers })\` server-side. Unauthenticated requests redirect to \`/admin/login\` (which doesn't exist yet — Layer 7; until then, redirect to existing Payload login). Middleware exclusion preserved.

## Acceptance criteria
- [ ] Unauthenticated request to \`/admin/*\` redirects to login
- [ ] Authenticated request renders shell with user info available in context
- [ ] User context exposed to children via React context
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L0-admin-shell', 'L0-routes'],
    stories: [],
  },
  {
    key: 'L1-form-provider',
    body: `## What to build
The deep module that owns dirty state, validation aggregation, autosave debouncing (configurable, default 800ms), undo/redo stack, and submit lifecycle (idle → submitting → success | error). All Layer 1 field components consume this provider's context.

## Acceptance criteria
- [ ] Vitest coverage: dirty tracking, validation aggregation, autosave debouncing, undo/redo correctness, submit lifecycle state machine
- [ ] Mock field consumer demonstrates context wiring
- [ ] Optimistic submit with rollback on error
- [ ] \`tsc --noEmit\` clean

## Implementation notes
Deep module per PRD §Testing Decisions. Single most important testable surface in the project.

## Out of scope
Specific field implementations — those depend on this.`,
    blockedBy: [],
    stories: [14, 15, 16],
  },
  {
    key: 'L1-text-field',
    body: `## What to build
Custom \`<TextField>\` accepting Payload field config + value + onChange + locale + lockState + validation. Single-line and multi-line variants. Read-only when locked. Inline validation error surface.

## Acceptance criteria
- [ ] Vitest: rendering with valid/invalid value, onChange dispatch, locale-split rendering, lock interaction, validation error surface
- [ ] Storybook: default, with-value, validation-error, locked, locale-split variants
- [ ] No \`@payloadcms/ui\` imports
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 10, 11, 16],
  },
  {
    key: 'L1-number-field',
    body: `## What to build
Int + decimal variants with min/max validation. Same uniform interface as \`<TextField>\`.

## Acceptance criteria
- [ ] Vitest: int + decimal handling, min/max validation, onChange dispatch
- [ ] Storybook: default, with-value, validation-error, locked variants
- [ ] No \`@payloadcms/ui\` imports
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 16],
  },
  {
    key: 'L1-select-field',
    body: `## What to build
Single + multi variants. Option-group support. Searchable variant for option lists >10 items.

## Acceptance criteria
- [ ] Vitest: single + multi selection, option-group rendering, search filter
- [ ] Storybook: 5 variants (single, multi, grouped, searchable, locked)
- [ ] No \`@payloadcms/ui\` imports
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 16],
  },
  {
    key: 'L1-date-field',
    body: `## What to build
Calendar picker, timezone-aware date+time variant. Keyboard accessible.

## Acceptance criteria
- [ ] Vitest: date parsing, timezone handling, onChange dispatch
- [ ] Storybook: date-only, datetime, locked, validation-error variants
- [ ] axe-core 0 violations on Storybook
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 16],
  },
  {
    key: 'L1-checkbox-radio-toggle',
    body: `## What to build
Three boolean/choice primitives sharing a common interface.

## Acceptance criteria
- [ ] Vitest: each component handles checked/unchecked, group selection (radio), validation
- [ ] Storybook stories for each variant
- [ ] WCAG 2.2 AA target-size compliance (≥24×24)
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 16],
  },
  {
    key: 'L1-relationship-field',
    body: `## What to build
Search/autocomplete with debouncing. Tree-picker variant for hierarchical collections. Ancestor breadcrumb display ("FRAS > Boards > AcSB"). Create-on-the-fly support.

## Acceptance criteria
- [ ] Vitest: search debouncing, single + multi selection, tree-picker mode, create-on-the-fly callback
- [ ] Storybook: 5 variants
- [ ] Loads from REST endpoint with collection-config awareness
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [13, 16],
  },
  {
    key: 'L1-upload-field',
    body: `## What to build
Opens existing Media Library modal (already built — \`MediaPickerModal.tsx\`). Shows thumbnail, alt-text inline. Drag-and-drop new uploads.

## Acceptance criteria
- [ ] Vitest: file selection callback, alt-text edit, removal
- [ ] Storybook: empty, with-image, locked, validation-error variants
- [ ] Reuses existing MediaPickerModal
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 16],
  },
  {
    key: 'L1-rich-text-field',
    body: `## What to build
Lexical re-wrap with full toolbar (B/I/U/Link/Heading/List/Quote/Code), our existing Lexical config nodes preserved. Image embed via \`<UploadField>\`'s Media Library modal. Link picker via \`<RelationshipField>\`.

## Acceptance criteria
- [ ] Vitest: serialization round-trip matches expected JSON
- [ ] Playwright: type sample content, assert serialized output
- [ ] Storybook: empty, with-content, locked, validation-error variants
- [ ] Lexical config 1:1 with current implementation (no behavior regression)
- [ ] \`tsc --noEmit\` clean

## Implementation notes
Risk: Lexical fidelity. Copy current config 1:1, swap only surrounding chrome.`,
    blockedBy: ['L1-form-provider', 'L1-upload-field', 'L1-relationship-field'],
    stories: [12, 16],
  },
  {
    key: 'L1-array-field',
    body: `## What to build
Repeater with @dnd-kit drag-and-drop reordering. Add/remove rows. Per-row collapse/expand. Generic over the inner row schema.

## Acceptance criteria
- [ ] Vitest: add/remove/reorder mutations, dirty tracking
- [ ] Storybook: empty, with-rows, reordering interaction, validation-error variants
- [ ] @dnd-kit integration uses keyboard accessibility
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 16],
  },
  {
    key: 'L1-blocks-field',
    body: `## What to build
Payload's blocks pattern: type picker, per-block field renderers (composing other Layer 1 primitives), DnD reordering. The foundation Page Builder leans on for body content.

## Acceptance criteria
- [ ] Vitest: block type picker, per-type field rendering, DnD
- [ ] Storybook: empty, with-mixed-blocks, locked variants
- [ ] Composes other Layer 1 primitives (no \`@payloadcms/ui\`)
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider', 'L1-array-field'],
    stories: [9, 16],
  },
  {
    key: 'L1-join-field',
    body: `## What to build
Read-only display of joined relations (e.g. "Pages that reference this Project"). Click-through to related record.

## Acceptance criteria
- [ ] Vitest: rendering with joined data, link generation
- [ ] Storybook: empty, with-relations, locked variants
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider', 'L1-relationship-field'],
    stories: [9],
  },
  {
    key: 'L1-layout-primitives',
    body: `## What to build
Three layout container primitives matching Payload's TabsField/GroupField/RowField patterns. Generic — they group other field components.

## Acceptance criteria
- [ ] Vitest: each renders children, tab switching, collapsible group
- [ ] Storybook: each in isolation + composed example
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9],
  },
  {
    key: 'L1-localized-field-wrapper',
    body: `## What to build
Wraps any field component, renders EN/FR side-by-side OR via locale toggle (configurable). Syncs to \`?locale=\` URL param. Per-locale dirty tracking.

## Acceptance criteria
- [ ] Vitest: side-by-side rendering, locale toggle, per-locale onChange dispatch
- [ ] Storybook: side-by-side, toggle, validation-error variants
- [ ] Composable around any Layer 1 field
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider', 'L1-text-field'],
    stories: [11, 17],
  },
  {
    key: 'L1-section-chrome',
    body: `## What to build
Collapsible field sections mirroring template groupings (Content / SEO / Layout / Workflow). Section headers driven by collection field grouping. "Shared field" badge when localization is off. Lock indicator inline per field.

## Acceptance criteria
- [ ] Vitest: section collapse/expand, badge rendering conditions
- [ ] Storybook: collapsed, expanded, with-shared-fields, with-locked-fields variants
- [ ] No "Standard Fields hidden" behavior — all fields visible by default
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-form-provider'],
    stories: [9, 10, 11],
  },
  {
    key: 'L2-migrate-views',
    body: `## What to build
Migrate every existing custom view (Content Tree, Workbox, Page Builder, Media Library, Schedule, Language Audit, Dashboard) out of Payload's view-injection registration into the new shell layout. Drop \`admin.components.views\` registrations from \`payload.config.ts\`. Drop \`admin.components.Nav\` (CustomNav becomes the shell's left rail).

## Acceptance criteria
- [ ] All 7 views render inside \`<AdminShell>\` with no Payload chrome
- [ ] Views still work: Tree DnD, Workbox actions, Page Builder, Media browse, Schedule view, Lang Audit
- [ ] \`payload.config.ts\` has zero \`admin.components.views\` entries
- [ ] \`tsc --noEmit\` clean
- [ ] vitest passes`,
    blockedBy: ['L0-admin-shell', 'L0-routes', 'L0-tree-spine', 'L0-action-bar', 'L0-language-switcher', 'L0-auth-bridge'],
    stories: [1, 8],
  },
  {
    key: 'L3-pages-edit',
    body: `## What to build
\`/admin/edit/pages/:id\` route — three-pane: persistent tree left, fields center (Layer 1 primitives), action bar bottom. Section grouping driven by Pages collection config. Locale toggle wired. Lock indicator + take-over flow. Workflow action bar wired to existing workflow hooks. Version diff button → existing modal. "Open in Page Builder" button. Wire Tree right panel + Workbox + Schedule "Open in Editor" → this route. **Iframe deleted.**

## Acceptance criteria
- [ ] Page can be created, edited, translated, locked, submitted, approved, published, scheduled, previewed, opened in Page Builder
- [ ] \`grep -rn "iframe" src/admin/\` returns 0 matches
- [ ] All workflow hooks fire correctly (existing tests pass)
- [ ] axe-core 0 violations on the edit view
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: [
      'L1-text-field', 'L1-rich-text-field', 'L1-relationship-field', 'L1-upload-field',
      'L1-blocks-field', 'L1-localized-field-wrapper', 'L1-section-chrome',
      'L2-migrate-views',
    ],
    stories: [9, 10, 11, 12, 13, 14, 15, 16, 17, 23, 31],
  },
  {
    key: 'L4-news-edit',
    body: `## What to build
Templated from the Pages edit view (Layer 3). \`/admin/edit/news/:id\`. News-specific section grouping (Content / Categorization / SEO / Workflow / Translation).

## Acceptance criteria
- [ ] News records fully editable in new shell, no Payload form
- [ ] Locale toggle, lock, version diff, action bar all functional
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L3-pages-edit'],
    stories: [9, 10, 11, 12, 13, 16, 17],
  },
  {
    key: 'L4-projects-edit',
    body: `## What to build
Templated from the Pages edit view (Layer 3). \`/admin/edit/projects/:id\`. Projects-specific: 7-stage timeline UI, board badge, status pill.

## Acceptance criteria
- [ ] Projects records fully editable in new shell
- [ ] Timeline editor functional (tri-state per stage)
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L3-pages-edit'],
    stories: [9, 10, 11, 13, 16, 17],
  },
  {
    key: 'L4-boards-edit',
    body: `## What to build
Templated from the Pages edit view (Layer 3). \`/admin/edit/boards/:id\`. Board-specific: per-board accent color preview, member listing, committee listing.

## Acceptance criteria
- [ ] Board records fully editable in new shell
- [ ] Board color preview functional
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L3-pages-edit'],
    stories: [9, 10, 11, 13, 16, 17],
  },
  {
    key: 'L4-docs-edit',
    body: `## What to build
Templated from the Pages edit view (Layer 3). \`/admin/edit/documents-for-comment/:id\`. Doc-specific: comment deadline, comment letter upload, related project relation.

## Acceptance criteria
- [ ] DocumentsForComment records fully editable in new shell
- [ ] Comment deadline + upload fields functional
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L3-pages-edit'],
    stories: [9, 10, 11, 12, 13, 16, 17],
  },
  {
    key: 'L5-data-table',
    body: `## What to build
Deep module driven by collection config: column picker, sort, filter, paginate, bulk actions, gutter icons (workflow state, lock, FR-missing). Slot system for collection-specific overrides.

## Acceptance criteria
- [ ] Vitest: sort/filter/paginate state transitions, bulk-action selection, column-picker persistence, slot composition
- [ ] Storybook: default, with-data, empty, loading, with-bulk-action, with-slot-override variants
- [ ] No \`@payloadcms/ui\` imports
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L0-admin-shell', 'L0-action-bar'],
    stories: [18, 20, 21, 22],
  },
  {
    key: 'L5-pages-list',
    body: `## What to build
Composes \`<DataTable>\` with Pages-specific overrides: tree-aware (indent per ancestor), board badge, status pill, last-edited timestamp, FR status icon.

## Acceptance criteria
- [ ] Pages list renders with tree-style indent
- [ ] All Pages-specific columns visible by default
- [ ] Bulk actions: publish, archive, translate-FR
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L5-data-table'],
    stories: [19, 21],
  },
  {
    key: 'L5-news-list',
    body: `## What to build
News list with thumbnail, headline, board badge, date, status pill, FR status icon.

## Acceptance criteria
- [ ] News list renders with thumbnails (via UploadField pattern)
- [ ] Sortable by date, board, status
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L5-data-table'],
    stories: [19, 21],
  },
  {
    key: 'L5-projects-list',
    body: `## What to build
Projects list with timeline pill (which stage is in progress), board badge, deadline, status pill.

## Acceptance criteria
- [ ] Projects list renders with timeline pill component
- [ ] Sortable by deadline, board, stage
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L5-data-table'],
    stories: [19, 21],
  },
  {
    key: 'L5-events-list',
    body: `## What to build
Events list with date/time, type icon (meeting/webinar/deadline/decision-summary), board badge, status pill.

## Acceptance criteria
- [ ] Events list renders with type-icon + date/time
- [ ] Sortable by date, type, board, status
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L5-data-table'],
    stories: [19, 21],
  },
  {
    key: 'L5-generic-mounts',
    body: `## What to build
Wire generic \`<DataTable>\` into list routes for: Resources, BoardMembers, Committees, Contacts, Standards, StandardsSections, Consultations, JobPostings, Redirects, Notifications, Dictionary. Port existing list-injected components (BoardFilterBar, RedirectsImportButton, FrTranslationWarning) into the slot system.

## Acceptance criteria
- [ ] All 11+ collections list inside \`<AdminShell>\` via generic \`<DataTable>\`
- [ ] Filter/sort/paginate/bulk consistent across all
- [ ] BoardFilterBar + RedirectsImportButton + FrTranslationWarning ported
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L5-data-table'],
    stories: [18, 20],
  },
  {
    key: 'L6-remaining-collections',
    body: `## What to build
Native edit views for: Resources, BoardMembers, Committees, Contacts, Standards, StandardsSections, Events, Consultations, JobPostings, Redirects, Notifications, Dictionary. Templated from Pages (Layer 3) + Layer 4 collections.

## Acceptance criteria
- [ ] All 12 remaining collections fully editable in shell
- [ ] axe-core 0 violations across all 12
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L4-news-edit', 'L4-projects-edit', 'L4-boards-edit', 'L4-docs-edit'],
    stories: [9, 10, 11, 16],
  },
  {
    key: 'L6-globals',
    body: `## What to build
Native edit views for: Navigation, Footer, Homepage, SearchConfig, AuthConfig, SiteAlert. Globals don't have list views — only edit.

## Acceptance criteria
- [ ] All 6 globals fully editable in shell
- [ ] Save/publish flow works for globals
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L4-news-edit', 'L4-projects-edit', 'L4-boards-edit', 'L4-docs-edit'],
    stories: [9, 10, 11, 16],
  },
  {
    key: 'L7-login',
    body: `## What to build
\`/admin/login\` with FRAS Canada logo, brand purple (#601F5B), copy "Sign in to Reporting and Assurance Standards Canada". Email + password fields using Layer 1 primitives. Calls Payload's \`/api/users/login\` endpoint.

## Acceptance criteria
- [ ] Login page renders with brand
- [ ] Successful login redirects to \`/admin\`
- [ ] Failed login shows inline error
- [ ] Playwright e2e: login flow end-to-end
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L1-text-field', 'L1-form-provider'],
    stories: [26],
  },
  {
    key: 'L7-forgot',
    body: `## What to build
\`/admin/forgot-password\` with same shell. Email field, submit triggers Payload's reset flow.

## Acceptance criteria
- [ ] Page renders with brand
- [ ] Submit triggers reset email via Payload
- [ ] Success state shown after submit
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L7-login'],
    stories: [27],
  },
  {
    key: 'L7-reset',
    body: `## What to build
\`/admin/reset-password/:token\` with same shell. New password + confirm fields. Calls Payload's reset endpoint.

## Acceptance criteria
- [ ] Page renders with brand
- [ ] Token validation handled
- [ ] Success redirects to login
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L7-login'],
    stories: [27],
  },
  {
    key: 'L7-account',
    body: `## What to build
\`/admin/account\` — name, email, password change, locale preference. Uses Layer 1 primitives.

## Acceptance criteria
- [ ] Account fields editable + saveable
- [ ] Password change requires current-password verification
- [ ] axe-core 0 violations
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L7-login'],
    stories: [27],
  },
  {
    key: 'L8-payload-backdoor',
    body: `## What to build
Move Payload's catch-all from \`/admin/[[...segments]]\` to \`/admin/_payload/[[...segments]]\`. Role-gate to admin role only. Add a banner: "You are using the Payload developer backdoor. The official admin is at /admin."

## Acceptance criteria
- [ ] \`/admin/_payload/*\` shows Payload UI for admin-role users
- [ ] Non-admin users 403 from \`/admin/_payload/*\`
- [ ] Banner visible on every Payload backdoor page
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L6-remaining-collections', 'L6-globals', 'L7-account'],
    stories: [28],
  },
  {
    key: 'L8-retire-cms',
    body: `## What to build
Add 301 redirect \`/cms\` → \`/admin\`. Delete \`src/app/(payload)/cms/page.tsx\`. Remove \`/cms\` exclusion from \`middleware.ts\` matcher. Update CLAUDE.md, all PRDs, and \`.ai-reports/\` doc map to remove \`/cms\` references.

## Acceptance criteria
- [ ] curl \`/cms\` returns 301 to \`/admin\`
- [ ] No \`/cms\` references in CLAUDE.md or PRDs
- [ ] \`tsc --noEmit\` clean`,
    blockedBy: ['L6-remaining-collections', 'L6-globals', 'L7-account'],
    stories: [34],
  },
  {
    key: 'L8-final-cleanup',
    body: `## What to build
Verification + cleanup pass. Remove any remaining \`@payloadcms/ui\` imports in \`src/admin/**\`. Remove any \`<iframe>\` elements in \`src/admin/**\`. Run final Lighthouse + axe-core sweep across all admin routes.

## Acceptance criteria
- [ ] \`grep -rn "@payloadcms/ui" src/admin/\` returns 0 matches
- [ ] \`grep -rn "iframe" src/admin/\` returns 0 matches
- [ ] Lighthouse perf+a11y ≥ 90 on \`/admin\`, \`/admin/login\`, all 15+ list views, all 15+ edit views
- [ ] axe-core 0 violations on all admin pages
- [ ] All Layer 5 Gate green checks still passing
- [ ] \`tsc --noEmit\` clean
- [ ] Output \`<promise>ADMIN SHELL V2 COMPLETE</promise>\``,
    blockedBy: ['L8-payload-backdoor', 'L8-retire-cms'],
    stories: [33],
  },
];

console.log(`Will rewrite bodies for ${ISSUES.length} issues.`);

let success = 0;
let fail = 0;

for (const issue of ISSUES) {
  const issueNumber = MAP[issue.key];
  if (!issueNumber) {
    console.error(`✗ NO MAPPING for key ${issue.key} — skipping`);
    fail++;
    continue;
  }

  const blockedByList = issue.blockedBy
    .map((key) => MAP[key])
    .filter(Boolean);
  const blockedByText = blockedByList.length
    ? blockedByList.map((n) => `- #${n}`).join('\n')
    : '- None — can start immediately';

  const storiesText = issue.stories.length
    ? issue.stories.map((n) => `- User story ${n}`).join('\n')
    : '- (cross-cutting infrastructure)';

  const fullBody = `${issue.body}

## Blocked by

${blockedByText}

## User stories addressed

${storiesText}

## Parent epic

#${PARENT_EPIC}
`;

  const tmpfile = join(tmpdir(), `issue-body-${issueNumber}-${Date.now()}.md`);
  writeFileSync(tmpfile, fullBody);

  try {
    execSync(
      `gh issue edit ${issueNumber} --repo ${REPO} --body-file ${tmpfile}`,
      { encoding: 'utf8', stdio: 'pipe' }
    );
    console.log(`✓ #${issueNumber} ${issue.key}`);
    success++;
  } catch (err) {
    console.error(`✗ FAILED #${issueNumber} ${issue.key}: ${err.message}`);
    fail++;
  } finally {
    try { unlinkSync(tmpfile); } catch {}
  }
}

console.log(`\nDone. ${success} succeeded, ${fail} failed.`);
