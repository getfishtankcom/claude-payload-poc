# RAS Canada — Custom CMS Platform Build Plan

> **Phase:** Admin Platform Modules, Architecture Fixes & Custom CMS Shell
> **Replaces:** Original Phase 1+2 BUILD_PLAN (Epics 0–27 — complete)
> **Stack:** Next.js 16 + Payload CMS 3.84 + PostgreSQL + Tailwind CSS v4 + TanStack Query
> **Date:** 2026-04-27
> **Total Tasks:** 32 (14 + 4 + 6 + 5 + 4 + 3 across 6 layers)

---

## Table of Contents

1. [Context](#context)
2. [Design Decisions](#design-decisions)
3. [Technology Stack](#technology-stack)
4. [Architecture Audit Findings](#architecture-audit-findings)
5. [Component Registry Target (53 components)](#component-registry-target)
6. [Information Architecture](#information-architecture)
7. [Layer Structure](#layer-structure)
   - [Layer 0 — Foundation](#layer-0--foundation-14-tasks)
   - [Layer 1 — Registry Expansion](#layer-1--registry-expansion-4-tasks)
   - [Layer 2 — Admin Quick Wins](#layer-2--admin-quick-wins-6-tasks)
   - [Layer 3 — Admin Medium Lifts](#layer-3--admin-medium-lifts-5-tasks)
   - [Layer 4 — Big Builds](#layer-4--big-builds-4-tasks)
   - [Layer 5 — Polish](#layer-5--polish-3-tasks)
8. [Dependency Graph](#dependency-graph)
9. [Skills Per Layer](#skills-per-layer)

---

## Context

Phase 1 and Phase 2 (original Epics 0–27, 142 tasks) are complete. The site has:
- Full Next.js 15 frontend (17 page templates, bilingual EN/FR via next-intl)
- Payload CMS 3.x with 21 collections + 5 globals
- Custom admin layer: Content Tree, Media Library, Page Builder (31 components), Workbox (5-state workflow)
- Meilisearch integration, HubSpot newsletter, Aptify auth, ReCaptcha v3

This plan extends the custom admin layer into a **full custom CMS shell** — Sitecore-parity admin that editors use as their primary interface, with `/admin` relegated to developer use only.

A discovery sanity check (2026-04-27) produced 30 architectural findings that must be addressed before extending the platform. Those findings are catalogued in the Architecture Audit section below and assigned to specific tasks.

---

## Design Decisions

Each decision is numbered to match references elsewhere in this document.

### D1 — Distribution: Build First, Extract Later
Build all custom modules as first-party code inside this repo. Extraction into independent `@ras-canada/payload-*` plugins is backlogged for Phase 4. Rationale: extracting too early adds abstraction overhead before patterns have stabilized.

### D2 — All Components Builder-Droppable
Every component type in the registry is droppable on the page builder canvas (allowedZones: []). Templates enforce constraints via the zone's `allowedComponents` list, NOT at the component level. Rationale: maximum flexibility for editors; the template system is where editorial guardrails live.

### D3 — Component Inventory: 53 Total
31 existing + 22 new, plus 9 fixes to existing components. Project timeline now supports up to 10 stages (not the original 7). See the full table in the Component Registry section.

### D4 — Zone Enforcement Pattern
All components keep `allowedZones: []` (allowed everywhere). Template zone configs in `src/admin/templates/index.ts` define `allowedComponents: string[]` per zone. This separation of concerns means the registry is not coupled to any template's editorial constraints.

### D5 — Build ALL Sitecore Admin Gaps
Nothing is deferred from the admin parity list. All 30 audit findings are scheduled into specific layers. No finding is marked "future phase."

### D6 — 5-Layer Build Sequence with Dependency Gates
Foundation (L0) must pass its gate before Registry (L1). Registry must be stable before Quick Wins (L2). All layers are gated; no parallel work on a later layer while an earlier layer's gate is open. Worktrees may parallelize tasks within a single layer.

### D7 — Dependency Updates
- Next.js: 15 → 16.2.4
- Payload: 3.79 → 3.84.1
- All other packages: semver patch bumps only (no minor/major jumps outside Next.js + Payload)
- Rationale: Next.js 16 async `params`/`searchParams` API is the only breaking change we must absorb. Payload 3.84 has workflow improvements and bug fixes relevant to our admin layer.

### D8 — Live WYSIWYG Preview Architecture
PostMessage iframe bridge. Preview route at `/preview/[pageId]` renders actual Next.js page. Parent builder sends layout JSON via `window.postMessage`. Iframe listener hydrates and re-renders. Thin overlay script on the preview page finds `[data-builder-id]` attributes, draws hover/click chrome borders. Click events on chrome send `{ type: 'SELECT_COMPONENT', id }` back to parent. Edit/Preview toggle with Ctrl+P shortcut.

```typescript
// PostMessage bridge interface
interface BuilderMessage {
  type: 'LAYOUT_UPDATE' | 'SELECT_COMPONENT' | 'READY'
  payload: LayoutUpdatePayload | SelectComponentPayload | null
}

interface LayoutUpdatePayload {
  zones: Record<string, BuilderComponent[]>
  pageId: string
}

interface SelectComponentPayload {
  id: string
  type: string
}
```

### D9 — Native Field Editing: Level 2 Now, Level 3 Endgame
- **Level 1 (done):** Iframe of full Payload edit view in tree right panel.
- **Level 2 (this phase, task 4.2):** Key-fields card at top of tree right panel (title, slug, workflow state, board, publish date). Editable inline, saves via Payload REST API. "Full Editor" button opens complete form. Iframe below.
- **Level 3 (task 4.3, endgame):** Replace iframe with `@payloadcms/ui` field components rendered inside the custom shell. Full save/publish from tree panel. Schema loaded from `/api/tree/fields?nodeId=X`.

### D10 — Custom Admin Shell
- `/cms` — primary entry point for editors. Loads custom shell with full navigation, all custom views.
- `/admin` — Payload's native admin. Role-gated: `author` and `editor` roles are redirected to `/cms`. Only `admin` role can access `/admin`.
- Rationale: editors should never encounter Payload's raw collection list UI. The `/cms` shell provides the Sitecore-familiar experience.

### D11 — Field Components: Reuse @payloadcms/ui
For Level 3 field editing (task 4.3), reuse `@payloadcms/ui` field components (`TextField`, `SelectField`, `DateTimeField`, etc.) inside the custom shell. Write custom wrappers only where `@payloadcms/ui` doesn't provide what we need (e.g., the tree-specific key-fields card). Rationale: avoids re-implementing Payload's field validation, error display, and upload logic.

### D12 — Brand Constants: brand.ts
Single source of truth for the organization name. No string literal "RAS Canada" or "FRAS Canada" anywhere except this file.

```typescript
// src/config/brand.ts
export const BRAND = {
  fullName: 'Reporting and Assurance Standards (RAS) Canada',
  shortName: 'RAS Canada',
  abbreviation: 'RAS',
  frenchFullName: 'Normes de réglementation et d\'assurance (NRA) Canada',
  frenchShortName: 'NRA Canada',
  frenchAbbreviation: 'NRA',
  copyright: (year: number) => `© ${year} RAS Canada`,
  legacyName: 'FRAS Canada',
} as const
```

### D13 — WCAG 2.2 AA (Not 2.1)
All accessibility targets are updated to WCAG 2.2 AA. This affects NFRs in all PRDs, acceptance criteria in all tasks that include a11y gates, and the axe-core test configuration. WCAG 2.2 adds 9 new criteria over 2.1; the most relevant for our admin UI are 2.4.11 (Focus Not Obscured), 2.4.12 (Focus Not Obscured — Enhanced), and 3.2.6 (Consistent Help).

### D14 — Data Fetching: TanStack Query
React Query (TanStack Query v5) is the data fetching layer for all custom admin views. Replaces ad-hoc `fetch` calls and scattered loading/error state. Key reasons over SWR: `useMutation` lifecycle hooks for write-heavy admin operations, cross-view cache invalidation via `queryClient.invalidateQueries`, dependent queries (`enabled` flag), and `useInfiniteQuery` for tree lazy-loading.

```typescript
// Pattern: standard admin query
const { data, isLoading, error } = useQuery({
  queryKey: ['tree', parentId],
  queryFn: () => fetch(`/api/tree?parentId=${parentId}`).then(r => r.json()),
  staleTime: 30_000,
})

// Pattern: mutation with cache invalidation
const moveMutation = useMutation({
  mutationFn: (payload: MovePayload) =>
    fetch('/api/tree/move', { method: 'POST', body: JSON.stringify(payload) }).then(r => r.json()),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tree'] })
  },
})
```

### D15 — Testing Stack
- **Vitest:** Unit and integration tests. TDD for pure functions (reducers, registry helpers, workflow transitions, brand constants). Co-located `*.test.ts` files.
- **Storybook:** Component stories. Every new component gets at least one story. Existing admin components get stories in Layer 5 pass.
- **Playwright:** E2E tests for golden paths. Every Layer 2–4 feature ships with at least one E2E test.
- **axe-core:** WCAG 2.2 AA automated checks, run via Playwright. Zero critical/serious violations required.

### D16 — Information Architecture: Content-Type-First
Centralized listing pages replace board-siloed navigation for content discovery. URL patterns:

```
/en/projects                         → all active projects (filterable by board via ?board=)
/en/documents-for-comment            → all open consultations
/en/news                             → all news
/en/events                           → all events
/en/[board]/                         → board landing (links to filtered centralized listings)
/en/[board]/about/                   → board about pages
```

Board pages do NOT own their content — they link to centralized listings with pre-applied filters. This resolves the "board-first vs. content-first IA tension" identified in the discovery sanity check.

### D17 — Admin Styling: Tailwind CSS v4 + CSS Variables Bridge
Payload's admin panel uses CSS custom properties (`--theme-elevation-*`, `--theme-text-*`, etc.). Our custom shell uses Tailwind CSS v4. We bridge them in `src/app/(payload)/admin-tailwind.css` by mapping Payload theme variables to our Tailwind tokens. This prevents visual inconsistency between custom views and Payload's native components when they appear side-by-side.

### D18 — UI.sh: Pass on Existing Code, Per-Component Going Forward
Do not run a UI.sh pass over Phase 1+2 code in this phase (too wide a blast radius). Invoke the `/ui` skill for every new component built in this phase. A full pass over all components runs in Layer 5 (task 5.1).

### D19 — Skills Per Layer
See the Skills Per Layer table in its own section below.

### D20 — @pierre/diffs for Version Comparison
- `@pierre/diffs` for text field version comparison (split pane + unified diff view). This is `diff-match-patch` wrapped with a React component interface.
- `diff-match-patch` directly for Lexical rich text diffs (annotated prose diff — additions in green, deletions in red, unchanged in gray).
- Side-by-side EN/FR language version viewer does NOT show diff highlighting — it shows two full versions for reading comparison.

### D21 — @pierre/trees NOT Adopted
`trees.software` uses a path-first data model incompatible with our relationship-based tree. We borrow its conceptual patterns (model/view separation, `preparedInput` transformation step before render) but implement them natively. No library dependency.

### D22 — TanStack Query over SWR
See D14. Specific reasons TanStack Query wins: `useMutation` provides `onMutate`/`onSuccess`/`onError`/`onSettled` hooks needed for optimistic UI with rollback. SWR's `mutate` is less ergonomic for this pattern. Dependent query chains (`enabled: !!parentId`) are cleaner with TanStack. Cross-view cache invalidation (`queryClient.invalidateQueries({ queryKey: ['workbox'] })`) prevents stale data in the Workbox when a tree operation completes.

### D23 — Archive Strategy for Old Plan Docs
The original `BUILD_PLAN.md` is replaced by this document. The original `MASTER_TODO.md` will be updated to:
1. Retain Phase 1+2 tasks as read-only history (marked `[x]` — already complete)
2. Add this phase's tasks as new sections at the bottom with fresh `[ ]` entries

Both documents are canonical; this BUILD_PLAN is the spec, MASTER_TODO is the execution tracker.

---

## Technology Stack

| Category | Technology | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 16.2.4 | App Router, RSC |
| CMS | Payload CMS | 3.84.1 | PostgreSQL adapter |
| Database | PostgreSQL | 16 | via Neon/Railway |
| ORM | Drizzle | 0.30+ | via Payload adapter |
| Styling | Tailwind CSS | v4 | `@theme inline` tokens |
| Data Fetching (admin) | TanStack Query | v5 | React Query |
| Search | Meilisearch | v1.x | `payload-meilisearch` plugin |
| Auth | Aptify DB API | — | Direct HTTP, JWT sessions |
| i18n | next-intl | 4.8+ | `[locale]` routing |
| Testing — Unit | Vitest | 2.x | Co-located `*.test.ts` |
| Testing — E2E | Playwright | 1.4x | `tests/e2e/` |
| Testing — Components | Storybook | 8.x | `react-vite` |
| Testing — A11y | axe-core | 4.x | via `@axe-core/playwright` |
| Version Diff | diff-match-patch | 1.x | Lexical rich text diffs |
| Version Diff (text) | @pierre/diffs | latest | Split/unified text diffs |
| Animation | Motion | 11.x | `motion/react` |
| Icons | Heroicons | 2.x | `@heroicons/react` |
| DnD | @dnd-kit | 6.x | Canvas + tree |
| Newsletter | HubSpot Forms API | v3 | Server action |
| CAPTCHA | ReCaptcha v3 | — | `react-google-recaptcha-v3` |
| Analytics | GA4 | — | `@next/third-parties` |
| Cookie Consent | OneTrust | — | Script tag |
| Brand | brand.ts | — | `src/config/brand.ts` |

---

## Architecture Audit Findings

30 findings from the 2026-04-27 discovery sanity check, grouped by severity and assigned to layers.

### Critical (C) — 4 findings

| ID | Finding | Layer/Task |
|---|---|---|
| C1 | N+1 query bug in `/api/tree` — 87+ DB queries per tree load (one per node) instead of single `payload.find` + in-memory tree build | L0 / 0.7 |
| C2 | N+1 query bug in `/api/tree/search` — 150+ sequential queries per search (one per ancestor in chain) instead of in-memory resolution | L0 / 0.8 |
| C3 | `MediaLibraryClient.tsx` is 1,866 lines — unmaintainable monolith; violates single-responsibility | L0 / 0.9 |
| C4 | 4–6 duplicate type definitions for `WorkflowState`, `UserWithRole`, `TreeNode` scattered across files — type drift risk | L0 / 0.10 |

### High (H) — 11 findings

| ID | Finding | Layer/Task |
|---|---|---|
| H1 | 9 component registry bugs (hero-banner, cta-banner, consultation-countdown, project-list, event-calendar, newsletter-signup, contact-card, board-members-grid, document-table) | L0 / 0.3 |
| H2 | 5 missing color tokens (councils blue, councils tint, boards red-brown, boards tint, neutral gray) | L0 / 0.4 |
| H3 | WCAG 2.2 targets throughout all docs — must update to 2.2 AA | L0 / 0.5 |
| H4 | TanStack Query not installed — admin views use ad-hoc fetch with no caching, dedup, or mutation lifecycle | L0 / 0.11 |
| H5 | No shared Modal component — each view reimplements its own modal | L0 / 0.12 |
| H6 | Dead code: `PropsDrawer.tsx` and `ComponentToolbox.tsx` have zero imports (superseded by `InspectorPanel.tsx` and `AddComponentModal.tsx`) | L0 / 0.13 |
| H7 | 8 silent `catch` blocks in `ContentTreeClient.tsx` — errors lost | L0 / 0.14 |
| H8 | `prompt()` native dialogs in tree operations — inaccessible, blocks UI thread | L0 / 0.14 |
| H9 | FRAS→RAS naming pervasive across all docs and seed data — brand violation | L0 / 0.2 |
| H10 | 22 component types missing from registry (full list in Component Registry section) | L1 / 1.1 |
| H11 | `allowedComponents` on template zones empty/unconfigured — zone enforcement not working | L1 / 1.3 |

### Medium (M) — 10 findings

| ID | Finding | Layer/Task |
|---|---|---|
| M1 | No Vitest test suite — zero unit tests for pure functions | L0 / 0.6 |
| M2 | No board filter in Workbox — can't scope workflow queue by board | L2 / 2.1 |
| M3 | No FR translation status indicator in tree — editors can't see which nodes lack FR | L2 / 2.2 |
| M4 | No bookmarks/favorites — editors must navigate to frequently-used items every time | L2 / 2.3 |
| M5 | No command palette — common actions require full navigation | L2 / 2.4 |
| M6 | Tree context menu "Insert" shows all types regardless of parent template — invalid child types shown | L2 / 2.5 |
| M7 | No redirect manager UI — editors can't manage 301/302 redirects without developer help | L2 / 2.6 |
| M8 | No publishing schedule calendar view — editors can't visualize what publishes when | L3 / 3.1 |
| M9 | No language version audit view — no way to assess FR completeness across the site | L3 / 3.2 |
| M10 | No version comparison UI — workflow reviewers can't see what changed between versions | L3 / 3.3 |

### Low (L) — 5 findings

| ID | Finding | Layer/Task |
|---|---|---|
| L1 | No notification system — approvals and rejections are silent | L3 / 3.4 |
| L2 | No dictionary/labels manager — i18n UI strings require code deploys to update | L3 / 3.5 |
| L3 | No live WYSIWYG preview — editors must open a separate browser tab | L4 / 4.1 |
| L4 | No native field editing in tree — "Full Editor" is the only option (heavy iframe) | L4 / 4.2 + 4.3 |
| L5 | Editors see Payload's `/admin` collection list — alien UI, not RAS-branded | L4 / 4.4 |

---

## Component Registry Target

53 total component types. 31 existing (in `src/admin/components/builder/registry.ts`) + 22 new additions. 9 existing components also require bug fixes (see L0/0.3).

### Existing Components (31) — Status After 0.3 Bug Fixes

| # | Type | Category | Status |
|---|---|---|---|
| 1 | `rich-text` | Content | Keep as-is |
| 2 | `heading` | Content | Keep as-is |
| 3 | `image` | Content | Keep as-is |
| 4 | `video` | Content | Keep as-is |
| 5 | `accordion` | Content | Keep as-is |
| 6 | `tabs` | Content | Keep as-is |
| 7 | `table` | Content | Keep as-is |
| 8 | `blockquote` | Content | Keep as-is |
| 9 | `divider` | Content | Keep as-is |
| 10 | `image-grid` | Content | Keep as-is |
| 11 | `card-grid` | Layout | Keep as-is |
| 12 | `two-column` | Layout | Keep as-is |
| 13 | `three-column` | Layout | Keep as-is |
| 14 | `hero-banner` | Layout | FIX: add `showProjectSearch` bool + `searchPlaceholder` text |
| 15 | `cta-banner` | Layout | FIX: add `backgroundImage` media field |
| 16 | `feature-row` | Layout | Keep as-is |
| 17 | `stats-bar` | Layout | Keep as-is |
| 18 | `project-list` | Data | FIX: add `deferred` to `statusFilter` options |
| 19 | `news-feed` | Data | Keep as-is |
| 20 | `event-calendar` | Data | FIX: add `decision-summary` to `eventTypeFilter` options |
| 21 | `document-table` | Data | FIX: add `grouping: 'by-type'` + `showGroupHeaders` bool |
| 22 | `contact-card` | Data | FIX: add `layout: 'sidebar-sticky'` variant + `contacts` array field |
| 23 | `board-members-grid` | Data | FIX: add `groupByRole` bool for Chair/Vice-Chair/Voting section labels |
| 24 | `consultation-countdown` | Data | FIX: change `relationTo: 'consultations'` → `'document-for-comment'` |
| 25 | `standards-list` | Data | Keep as-is |
| 26 | `effective-dates-table` | Data | Keep as-is |
| 27 | `search-bar` | Interactive | Keep as-is |
| 28 | `filter-panel` | Interactive | Keep as-is |
| 29 | `newsletter-signup` | Interactive | FIX: add `linkedinUrl` text field |
| 30 | `download-button` | Interactive | Keep as-is |
| 31 | `anchor-link` | Interactive | Keep as-is |

### New Components (22) — Added in Layer 1

| # | Type | Category | Description |
|---|---|---|---|
| 32 | `project-timeline` | Data | 10-stage stepper, tri-state (complete/in-progress/not-started). Stage count configurable 1–10. Authors curate stage labels/dates. |
| 33 | `quick-links` | Interactive | Vertical link list for right rails. Used on Board Detail AND Project Detail (same component, different content). Props: title, links array (label, url, icon). |
| 34 | `page-header` | Layout | Breadcrumb (derived from content tree) + H1 page title. Props: title, subtitle, icon. |
| 35 | `news-card-widget` | Data | Homepage 3-up news cards. Auto-populated from `news` collection with optional manual override. Props: title, limit (default 3), boardFilter, manualItems array, showViewAll bool, viewAllUrl. |
| 36 | `drafts-card` | Data | Homepage exposure drafts widget. Shows items from `document-for-comment` with Due Date field. Props: title, limit, statusFilter (open/closed/all). |
| 37 | `events-card` | Data | Homepage upcoming events widget. Start Time field shows only when `type === 'webinar'` (conditional). Props: title, limit, eventTypeFilter. |
| 38 | `promo-card-grid` | Layout | Homepage-only 4-column board link grid. NOT reusable across page types by design. Props: cards array (label, url, color, description). |
| 39 | `news-events-grid` | Layout | 3-panel homepage widget container: left = News Card Widget, center = Drafts Card, right = Events Card. Composite block. |
| 40 | `browse-by-standard` | Data | 4-column standard category cards (Sustainability, Accounting, Public Sector, Assurance). Auto-populated from `standards` collection. Props: title, showDescriptions. |
| 41 | `right-rail-events-list` | Data | Sidebar events widget. Curated list, not auto-populated. Props: title, items array (date, title, type, url), viewAllUrl. `allowedZones` enforced by template — sidebar only. |
| 42 | `right-rail-resource-list` | Data | Sidebar resources widget. Auto-detects content type from URL for icon. Props: title, resources relationship field (hasMany), viewAllUrl. |
| 43 | `subscribe-banner` | Interactive | Full-width HubSpot email subscription + LinkedIn CTA. Distinct from `newsletter-signup` (simpler inline version). Props: heading, description, hubspotFormId, linkedinUrl, variant (light/dark/purple). |
| 44 | `event-summary-table` | Data | Tabular meeting summary view with date, type, link columns. Replica of meeting summary table pattern. Props: board relationship, limit, showPast bool. |
| 45 | `member-action-form` | Interactive | Shared UI for 3 member-only forms. Props: variant (document-comment/event-registration/volunteer-registration), heading, introText. Login gate renders automatically when user is not authenticated. |
| 46 | `category-pills` | Interactive | Horizontal pill filter tabs. Supports Open/Closed toggle and multi-value. Props: options array (label, value), activeValue, queryParam. |
| 47 | `anchor-nav` | Interactive | Scroll-spy table of contents with auto-highlight. Props: items array (label, targetId), sticky bool, mobileCollapse bool. |
| 48 | `meeting-topics-table` | Data | Meeting agenda table with topics, decisions, action items. Props: meeting relationship field OR manual items array. |
| 49 | `disclaimer` | Content | Styled disclaimer block (black bg, white text variant OR inline variant). Props: content richtext, variant (dark/inline). |
| 50 | `social-share` | Interactive | Social sharing buttons (LinkedIn, email, copy-link). Props: showLinkedIn bool, showEmail bool, showCopyLink bool. |
| 51 | `related-content` | Data | "Related" sidebar widget — links to related projects, news, or documents. Props: heading, items relationship (polymorphic), maxItems. |
| 52 | `site-alert` | Interactive | Global sitewide alert banner (show/hide, message, link, severity). Maps to `SiteAlert` global. Props: severity (info/warning/critical), message, linkLabel, linkUrl. |
| 53 | `back-to-top` | Interactive | Scroll-to-top button. Appears after 300px scroll. Props: label (default "Back to top"). |

**Final count by category:**
- Content Blocks: 11 (10 existing + 1 new: `disclaimer`)
- Layout Components: 10 (7 existing + 3 new: `page-header`, `promo-card-grid`, `news-events-grid`)
- Data-Driven Widgets: 18 (9 existing + 9 new: `project-timeline`, `news-card-widget`, `drafts-card`, `events-card`, `browse-by-standard`, `right-rail-events-list`, `right-rail-resource-list`, `event-summary-table`, `meeting-topics-table`)
- Interactive Elements: 14 (5 existing + 9 new: `quick-links`, `anchor-nav`, `member-action-form`, `category-pills`, `subscribe-banner`, `social-share`, `related-content`, `site-alert`, `back-to-top`)

---

## Information Architecture

### Content-Type-First URL Schema

The site uses centralized listing pages as the primary discovery mechanism. Board pages link OUT to filtered centralized listings rather than hosting their own content.

```
/[locale]/
├── projects/                      # All active projects (canonical listing)
│   ├── ?board=acsb                # Board filter via query param
│   └── [board]/[slug]/            # Project detail
├── documents-for-comment/         # All open consultations (canonical listing)
│   ├── ?board=acsb
│   └── [slug]/                    # Document detail
├── news/                          # All news (canonical listing)
│   ├── ?board=acsb
│   └── [slug]/
├── events/                        # All events (canonical listing)
│   ├── ?board=acsb
│   └── [slug]/
├── resources/                     # All resources
│   └── [slug]/
├── standards/                     # Standards sections
│   └── [standard]/
│       ├── projects/
│       ├── documents/
│       └── effective-dates/
├── [board]/                       # Board landing (links to filtered centralized pages)
│   ├── about/
│   │   ├── members/
│   │   └── committees/
│   ├── decision-summaries/
│   └── annual-report/
├── search/
├── contact-us/
├── job-opportunities/
└── my-account/
    ├── login/
    ├── register/
    └── forgot-*/
```

### Admin Shell URL Schema

```
/cms/                              # Custom editor shell (primary)
├── tree/                          # Content tree
├── media/                         # Media library
├── builder/[pageId]/              # Page builder
├── workbox/                       # Workflow queue
├── schedule/                      # Publishing schedule (Layer 3)
├── translations/                  # Language version audit (Layer 3)
├── redirects/                     # Redirect manager (Layer 2)
├── dictionary/                    # i18n labels manager (Layer 3)
└── notifications/                 # Notification center (Layer 3)

/admin/                            # Payload native (developer-only, role-gated)
```

### RASOC Rules (Unchanged)
RASOC is an oversight council. It does NOT get a Board Detail page, is NOT shown in Active Projects listing, is NOT a search facet. It IS in the footer, About Us nav, and volunteer tabs.

---

## Layer Structure

---

## Layer 0 — Foundation (14 tasks)

**Purpose:** Fix all critical and high architectural findings. Upgrade dependencies. Establish testing infrastructure. Refactor before extending.

**Gate:** ALL of the following must pass before Layer 1 begins:
```bash
npm run build                        # zero errors
npx tsc --noEmit                     # zero errors
npx vitest run                       # all tests pass
npx storybook build --quiet          # exits 0
grep -r "FRAS Canada" src/           # zero hits
cat src/config/brand.ts              # file exists with BRAND export
```

---

### 0.1 — Dependency Updates

**Description:**
Update Next.js from 15 to 16.2.4, Payload from 3.79 to 3.84.1, and apply semver patch bumps to all other dependencies.

**Steps:**
1. `npm install next@16.2.4` — Next.js 16 changes `params` and `searchParams` to be async Promises (breaking change). All page components using `params.locale`, `params.board`, etc. must be updated to `const { locale } = await params`.
2. `npm install payload@3.84.1 @payloadcms/next@3.84.1 @payloadcms/ui@3.84.1 @payloadcms/db-postgres@3.84.1 @payloadcms/richtext-lexical@3.84.1`
3. Run `npm outdated` — apply patch updates for all other packages (no minor/major bumps).
4. Run `npx payload generate:types` after Payload update.
5. Run `npm run build` — fix any type errors introduced by the updates.

**Key Next.js 16 migration:**
```typescript
// Before (Next.js 15):
export default function Page({ params }: { params: { locale: string } }) {
  const { locale } = params
}

// After (Next.js 16):
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
}
```

**Acceptance Criteria:**
- `package.json` shows `"next": "^16.2.4"` and `"payload": "^3.84.1"`
- `npm run build` passes with zero errors
- `npx tsc --noEmit` passes with zero errors
- All page routes that use `params` are updated to async destructuring
- No console errors on dev server start

**Validation:**
```bash
node -e "const pkg = require('./package.json'); console.log(pkg.dependencies.next, pkg.dependencies.payload)"
npm run build 2>&1 | tail -5
npx tsc --noEmit 2>&1 | grep -c error || echo "0 errors"
```

---

### 0.2 — FRAS → RAS Rename

**Description:**
Complete rename from "FRAS Canada" to "Reporting and Assurance Standards (RAS) Canada" across all source files, seed data, UI strings, and documentation. Create `src/config/brand.ts` as the single source of truth.

**Steps:**
1. Create `src/config/brand.ts` with the `BRAND` constant (see D12 above for the exact shape).
2. Search and replace all user-facing "FRAS Canada" strings in `src/` with `BRAND.shortName` or `BRAND.fullName` imports.
3. Update seed data in `src/seed/` — any hardcoded "FRAS Canada" text in seed records.
4. Update `.ai-reports/` documents: titles of PRD.md, PRD-phase2.md, BUILD_PLAN.md, MASTER_TODO.md headers.
5. Update `CLAUDE.md` — ensure all project references use "RAS Canada."
6. Verify `messages/en.json` and `messages/fr.json` have no "FRAS Canada" in user-visible strings.

**Note:** Do not rename file paths or collection slugs — `frasIdNumber` fields on collections are Sitecore legacy IDs that must remain for content migration, not brand references.

**Acceptance Criteria:**
- `src/config/brand.ts` exists and exports `BRAND` constant
- `grep -r "FRAS Canada" src/` returns zero hits
- `grep -r "FRAS Canada" messages/` returns zero hits
- `cat src/config/brand.ts` shows correct full official name
- Dev server starts without errors

**Validation:**
```bash
grep -r "FRAS Canada" src/ messages/ | grep -v ".ai-reports" | wc -l  # must be 0
cat src/config/brand.ts | grep fullName
```

---

### 0.3 — Fix 9 Registry Bugs

**Description:**
Fix the 9 known defects in `src/admin/components/builder/registry.ts` identified in the architecture audit. Each fix is a targeted propsSchema change — no component logic changes.

**Fixes:**
1. **hero-banner:** Add `{ name: 'showProjectSearch', label: 'Show Project Search', type: 'checkbox', defaultValue: false }` and `{ name: 'searchPlaceholder', label: 'Search Placeholder', type: 'text', defaultValue: 'Search active projects...' }` to propsSchema.
2. **cta-banner:** Add `{ name: 'backgroundImage', label: 'Background Image', type: 'media' }` to propsSchema.
3. **consultation-countdown:** Change `relationTo: 'consultations'` to `relationTo: 'document-for-comment'`.
4. **project-list:** Add `{ label: 'Deferred', value: 'deferred' }` to `statusFilter` options array.
5. **event-calendar:** Add `{ label: 'Decision Summary', value: 'decision-summary' }` to `eventTypeFilter` options array.
6. **newsletter-signup:** Add `{ name: 'linkedinUrl', label: 'LinkedIn URL', type: 'text' }` to propsSchema.
7. **contact-card:** Add `{ label: 'Sidebar Sticky', value: 'sidebar-sticky' }` to `layout` options. Add `{ name: 'contacts', label: 'Contacts (array)', type: 'array', fields: [{ name: 'contact', label: 'Contact', type: 'relationship', relationTo: 'contacts' }] }`.
8. **board-members-grid:** Add `{ name: 'groupByRole', label: 'Group by Role', type: 'checkbox', defaultValue: false, description: 'Shows Chair / Vice-Chair / Voting Member section headers' }`.
9. **document-table:** Add `{ name: 'grouping', label: 'Grouping', type: 'select', options: [{ label: 'None', value: 'none' }, { label: 'By Type', value: 'by-type' }], defaultValue: 'none' }` and `{ name: 'showGroupHeaders', label: 'Show Group Headers', type: 'checkbox', defaultValue: true }`.

**Acceptance Criteria:**
- `grep -c 'showProjectSearch' src/admin/components/builder/registry.ts` returns 1
- `grep 'document-for-comment' src/admin/components/builder/registry.ts` exists (no more 'consultations')
- `grep 'deferred' src/admin/components/builder/registry.ts` exists
- `grep 'decision-summary' src/admin/components/builder/registry.ts` exists
- `grep 'sidebar-sticky' src/admin/components/builder/registry.ts` exists
- `grep 'groupByRole' src/admin/components/builder/registry.ts` exists
- Unit tests for `getComponentType('hero-banner').propsSchema` verify new fields present

**Validation:**
```bash
npx tsc --noEmit
npx vitest run --reporter=dot src/admin/components/builder/registry.test.ts
```

---

### 0.4 — Add 5 Missing Color Tokens

**Description:**
Add the 5 board/council brand color tokens documented in the 2017 FRAS brand guidelines to `src/app/(frontend)/globals.css` (or the appropriate design tokens file). These tokens are referenced in CLAUDE.md `sitecore-dump-analysis.md` Section 4.2 but are absent from the current token set.

**Tokens to add:**
```css
/* In the @theme inline block */
--color-brand-councils: #00438C;        /* Blue — PSAB/AASB oversight councils */
--color-brand-councils-tint: #7986B9;   /* Blue 50% tint */
--color-brand-boards: #983232;          /* Red-brown — AcSB/AASB/PSAB boards */
--color-brand-boards-tint: #C98578;     /* Red-brown 50% tint */
--color-brand-gray: #A7A9AB;            /* Supporting neutral gray */
```

Also update `.ai-reports/dogfood-frascanada/design-tokens.md` to document these tokens.

**Acceptance Criteria:**
- All 5 token names appear in `globals.css` `@theme inline` block
- `grep 'color-brand-councils' src/app/\(frontend\)/globals.css` returns match
- Token values match the hex values listed above exactly
- `npm run build` still passes

**Validation:**
```bash
grep -c 'color-brand-councils\|color-brand-boards\|color-brand-gray' src/app/\(frontend\)/globals.css
# must return 5
```

---

### 0.5 — Update WCAG 2.2 → 2.2 AA

**Description:**
Update all accessibility targets from WCAG 2.2 AA to WCAG 2.2 AA across docs and test configs. No code changes required — this is a docs/config task.

**Steps:**
1. Search all `.ai-reports/` files for "WCAG 2.2" and replace with "WCAG 2.2".
2. Update `playwright.config.ts` axe-core configuration: `runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'] }`.
3. Update `CLAUDE.md` WCAG reference.
4. Note: The 9 new WCAG 2.2 criteria most relevant to admin UI: 2.4.11 (Focus Not Obscured), 2.4.12 (Focus Not Obscured Enhanced), 3.2.6 (Consistent Help). Verify admin components satisfy these.

**Acceptance Criteria:**
- `grep -r "WCAG 2.2" .ai-reports/` returns zero hits
- `grep -r "WCAG 2.2" src/` returns zero hits
- `playwright.config.ts` includes `wcag22aa` tag in axe configuration

**Validation:**
```bash
grep -r "WCAG 2.2" .ai-reports/ src/ | wc -l  # must be 0
grep 'wcag22aa' playwright.config.ts
```

---

### 0.6 — Set Up Vitest + Initial Test Suite

**Description:**
Install and configure Vitest. Write unit tests for pure functions that are currently untested: `useBuilderState` reducer, registry helper functions, workflow transition logic, and the new `brand.ts` constants.

**Steps:**
1. Install: `npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/user-event jsdom`
2. Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
})
```
3. Add `"test": "vitest run"` and `"test:watch": "vitest"` to `package.json` scripts.
4. Write `src/config/brand.test.ts` — verify all BRAND fields are defined and non-empty strings.
5. Write `src/admin/components/builder/useBuilderState.test.ts` — test `ADD_COMPONENT`, `REMOVE_COMPONENT`, `UNDO`, `REDO`, `MOVE_COMPONENT` reducer actions with before/after state snapshots.
6. Write `src/admin/components/builder/registry.test.ts` — test `getComponentType`, `getComponentsByCategory`, `searchComponents`, `getComponentsForZone`.
7. Write `src/admin/hooks/workflow.test.ts` (create this file) — test state machine valid transitions: Draft→InReview, InReview→NeedsRevision, InReview→Approved, Approved→Published.

**Acceptance Criteria:**
- `npx vitest run` exits 0
- At least 20 test cases across the 4 test files
- Coverage for `useBuilderState` reducer: all action types covered
- Coverage for registry helpers: all 4 exported functions covered
- `brand.test.ts` verifies `fullName` includes "RAS"

**Validation:**
```bash
npx vitest run --reporter=verbose 2>&1 | tail -20
```

---

### 0.7 — Fix N+1 Queries in /api/tree

**Description:**
The `/api/tree` route currently fetches one document per node to build the tree (87+ queries for a typical tree). Rewrite to use a single `payload.find` with high `limit`, then build the tree in memory.

**Current (broken) pattern:**
```typescript
// Pseudocode of current approach — 87 queries
const root = await payload.findByID({ collection: 'pages', id: rootId })
async function fetchChildren(id: string) {
  const children = await payload.find({ collection: 'pages', where: { parent: { equals: id } } })
  // recurse...
}
```

**Target pattern:**
```typescript
// Single query — in-memory tree build
export async function GET(req: NextRequest) {
  const allNodes = await payload.find({
    collection: 'pages',
    limit: 2000,
    depth: 0,          // no relationship resolution — we only need scalar fields
    select: {
      id: true, title: true, slug: true, parent: true, sortOrder: true,
      contentType: true, workflowState: true, _status: true,
    },
  })

  // Build tree in memory — O(n) with Map
  const nodeMap = new Map(allNodes.docs.map(n => [n.id, { ...n, children: [] }]))
  const roots: TreeNode[] = []
  for (const node of nodeMap.values()) {
    if (node.parent?.id) {
      nodeMap.get(node.parent.id)?.children.push(node)
    } else {
      roots.push(node)
    }
  }
  // Sort children by sortOrder
  for (const node of nodeMap.values()) {
    node.children.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  }
  return NextResponse.json({ docs: roots })
}
```

**Acceptance Criteria:**
- `/api/tree` response time < 200ms on a tree of 200 nodes (measured with `curl -w "%{time_total}"`)
- Query count verified via Payload query logging: exactly 1 DB query per request
- Tree structure identical to current output (same nesting, same node fields)
- Existing ContentTreeClient.tsx works without changes

**Validation:**
```bash
# With dev server running:
time curl -s http://localhost:3000/api/tree | jq '.docs | length'
```

---

### 0.8 — Fix N+1 Queries in /api/tree/search

**Description:**
The `/api/tree/search` route currently resolves the ancestor chain of each result with one query per ancestor (150+ queries for a deep tree). Rewrite to resolve ancestors in-memory using the same flat-fetch-then-build approach.

**Target pattern:**
```typescript
export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get('q') ?? ''

  // 1. Fetch ALL nodes in one query (same as 0.7)
  const allNodes = await payload.find({ collection: 'pages', limit: 2000, depth: 0, select: { ... } })
  const nodeMap = new Map(allNodes.docs.map(n => [n.id, n]))

  // 2. Filter matches in memory
  const matches = allNodes.docs.filter(n =>
    n.title?.toLowerCase().includes(q.toLowerCase()) ||
    n.slug?.toLowerCase().includes(q.toLowerCase())
  )

  // 3. Resolve ancestor chain in-memory for each match
  function getAncestors(id: string): string[] {
    const node = nodeMap.get(id)
    if (!node?.parent?.id) return []
    return [...getAncestors(node.parent.id), node.parent.id]
  }

  const results = matches.map(n => ({
    ...n,
    ancestorIds: getAncestors(n.id),
  }))

  return NextResponse.json({ results })
}
```

**Acceptance Criteria:**
- `/api/tree/search?q=about` responds in < 100ms
- Query count: exactly 1 DB query per search request
- Each result includes `ancestorIds` array for client-side auto-expand
- Existing tree search in ContentTreeClient.tsx works without changes

**Validation:**
```bash
time curl -s "http://localhost:3000/api/tree/search?q=about" | jq '.results | length'
```

---

### 0.9 — Decompose MediaLibraryClient.tsx

**Description:**
`MediaLibraryClient.tsx` is 1,866 lines — a single React component handling folder tree, media grid, upload, search, filters, bulk selection, modals, and all state. Decompose into an orchestrator (~200 lines) + extracted modules.

**Target structure:**
```
src/admin/views/
  MediaLibrary.tsx                  # Server wrapper (unchanged)
  MediaLibraryClient.tsx            # Orchestrator (~200 lines) — wires modules together

src/admin/components/media/
  FolderPanel.tsx                   # Left panel: folder tree, add/rename/delete
  MediaGrid.tsx                     # Right panel: grid/list toggle, item tiles
  MediaToolbar.tsx                  # Search input + type filter + view toggle
  BulkActionsBar.tsx                # Appears when items selected: count + Move/Delete
  useMediaLibraryState.ts           # All useState/useReducer for the view
  dialogs/
    NewFolderDialog.tsx
    RenameFolderDialog.tsx
    MoveMediaDialog.tsx
    DeleteConfirmDialog.tsx
```

**Extraction rules:**
- No prop drilling beyond 2 levels — use a context or lift to orchestrator
- `useMediaLibraryState` hook owns all state (folder selection, grid/list toggle, selected items, upload progress, search query, type filter)
- Each dialog is self-contained: receives open/onClose/onConfirm props

**Acceptance Criteria:**
- `MediaLibraryClient.tsx` is under 250 lines after decomposition
- All 9 Epic 24 tasks still pass their validation commands
- `npx tsc --noEmit` zero errors
- `npx storybook build --quiet` exits 0
- Media library works end-to-end in browser (upload, folder create, bulk select, detail panel)

**Validation:**
```bash
wc -l src/admin/views/MediaLibraryClient.tsx   # must be < 250
npx tsc --noEmit 2>&1 | grep -c error || echo "0"
```

---

### 0.10 — Create Shared Type Files

**Description:**
Currently `WorkflowState`, `UserWithRole`, `STATE_COLORS`, `STATE_LABELS`, `TreeNode`, and `FolderNode` are defined in multiple files (4–6 duplicate definitions counted). Extract to canonical shared type files.

**Files to create:**
```typescript
// src/admin/types/workflow.ts
export type WorkflowState = 'draft' | 'in_review' | 'needs_revision' | 'approved' | 'published'

export interface UserWithRole {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'author'
}

export const STATE_COLORS: Record<WorkflowState, string> = {
  draft: 'gray',
  in_review: 'blue',
  needs_revision: 'yellow',
  approved: 'green',
  published: 'purple',
}

export const STATE_LABELS: Record<WorkflowState, string> = {
  draft: 'Draft',
  in_review: 'In Review',
  needs_revision: 'Needs Revision',
  approved: 'Approved',
  published: 'Published',
}

// Valid state transitions
export const VALID_TRANSITIONS: Record<WorkflowState, WorkflowState[]> = {
  draft: ['in_review'],
  in_review: ['needs_revision', 'approved'],
  needs_revision: ['in_review'],
  approved: ['published'],
  published: [],
}
```

```typescript
// src/admin/types/tree.ts
export interface TreeNode {
  id: string
  title: string
  slug: string
  contentType: 'page' | 'folder' | 'news' | 'project' | 'event' | 'document' | 'media' | 'settings'
  workflowState: WorkflowState
  parent?: { id: string } | null
  sortOrder: number
  children: TreeNode[]
  isLocked?: boolean
  hasFrTranslation?: boolean     // Added for L2/2.2
}

export interface FolderNode {
  id: string
  name: string
  parent?: { id: string } | null
  sortOrder: number
  children: FolderNode[]
}
```

**Steps:**
1. Create the two files above.
2. Search all files importing or defining these types — replace with imports from the canonical files.
3. Delete the duplicate inline definitions.

**Acceptance Criteria:**
- `src/admin/types/workflow.ts` and `src/admin/types/tree.ts` exist
- `grep -r "WorkflowState = '" src/ | grep -v 'types/workflow.ts' | wc -l` returns 0
- `npx tsc --noEmit` zero errors

**Validation:**
```bash
grep -r "type WorkflowState" src/ | grep -v "types/workflow.ts"  # must be empty
```

---

### 0.11 — Install TanStack Query + Migrate First View

**Description:**
Install TanStack Query v5. Create a `QueryClientProvider` wrapper. Migrate `ContentTreeClient.tsx` as the first proof-of-pattern, replacing its ad-hoc `fetch` calls with `useQuery`/`useMutation`.

**Steps:**
1. `npm install @tanstack/react-query`
2. `npm install -D @tanstack/react-query-devtools`
3. Create `src/admin/providers/QueryProvider.tsx`:
```typescript
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useState } from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
    },
  }))
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
```
4. Wrap the admin layout (or each custom view's client component) with `<QueryProvider>`.
5. In `ContentTreeClient.tsx`, replace the tree-fetch `useEffect` with:
```typescript
const { data: treeData, isLoading, error } = useQuery({
  queryKey: ['tree'],
  queryFn: () => fetch('/api/tree').then(r => r.json()),
  staleTime: 30_000,
})
```
6. Replace the search `useEffect` with `useQuery({ queryKey: ['tree', 'search', query], queryFn: ... })`.
7. Replace tree mutation operations (rename, move, delete) with `useMutation` hooks.

**Acceptance Criteria:**
- `@tanstack/react-query` is in `package.json`
- `ContentTreeClient.tsx` has zero `useEffect` calls for data fetching
- `QueryProvider` wraps the admin layout
- Tree loads and works in browser with TanStack Query powering data

**Validation:**
```bash
grep '@tanstack/react-query' package.json
grep -c 'useEffect' src/admin/views/ContentTreeClient.tsx  # should be low/zero
```

---

### 0.12 — Extract Shared Modal + WorkflowHistoryModal

**Description:**
Multiple admin views implement their own modal patterns. Extract a shared `Modal` component from `WorkboxClient.tsx` and a standalone `WorkflowHistoryModal`.

**Target:**
```typescript
// src/admin/components/ui/Modal.tsx
interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  footer?: React.ReactNode
}

// Usage:
<Modal open={showHistory} onClose={() => setShowHistory(false)} title="Workflow History" size="lg">
  <WorkflowHistoryTimeline transitions={item.workflowHistory} />
</Modal>
```

```typescript
// src/admin/components/workflow/WorkflowHistoryModal.tsx
interface WorkflowHistoryModalProps {
  open: boolean
  onClose: () => void
  itemId: string
  collectionSlug: string
}
```

**Steps:**
1. Create `src/admin/components/ui/Modal.tsx` using `@headlessui/react` Dialog primitive (already installed).
2. Extract the workflow history timeline from `WorkboxClient.tsx` into `src/admin/components/workflow/WorkflowHistoryTimeline.tsx`.
3. Create `src/admin/components/workflow/WorkflowHistoryModal.tsx` as a wrapper.
4. Replace inline modal code in `WorkboxClient.tsx` with `<Modal>` and `<WorkflowHistoryModal>`.
5. Write Storybook stories for `Modal` (empty, with footer, sizes) and `WorkflowHistoryModal`.

**Acceptance Criteria:**
- `src/admin/components/ui/Modal.tsx` exists
- `src/admin/components/workflow/WorkflowHistoryModal.tsx` exists
- `WorkboxClient.tsx` no longer has inline modal implementation (uses shared `<Modal>`)
- Storybook stories for both components build and render
- Keyboard accessibility: Escape closes, focus trapped inside modal

**Validation:**
```bash
npx tsc --noEmit
npx storybook build --quiet
```

---

### 0.13 — Delete Dead Code

**Description:**
Remove `PropsDrawer.tsx` and `ComponentToolbox.tsx`. Both were superseded by `InspectorPanel.tsx` and `AddComponentModal.tsx` respectively and have zero imports in the codebase.

**Steps:**
1. Verify: `grep -r "PropsDrawer" src/ --include="*.tsx" --include="*.ts" | grep -v "PropsDrawer.tsx"` — must return empty.
2. Verify: `grep -r "ComponentToolbox" src/ --include="*.tsx" --include="*.ts" | grep -v "ComponentToolbox.tsx"` — must return empty.
3. Delete `src/admin/components/builder/PropsDrawer.tsx`.
4. Delete `src/admin/components/builder/ComponentToolbox.tsx`.
5. Delete any corresponding `*.stories.tsx` files for these components if they exist.
6. Run `npx tsc --noEmit` to confirm no broken imports.

**Acceptance Criteria:**
- Both files no longer exist
- `npx tsc --noEmit` zero errors
- `npm run build` passes

**Validation:**
```bash
ls src/admin/components/builder/PropsDrawer.tsx 2>/dev/null && echo "ERROR: file exists" || echo "OK: deleted"
ls src/admin/components/builder/ComponentToolbox.tsx 2>/dev/null && echo "ERROR: file exists" || echo "OK: deleted"
```

---

### 0.14 — Fix ContentTreeClient Error Handling + Dialogs

**Description:**
`ContentTreeClient.tsx` has 8 silent `catch` blocks that swallow errors silently. It also uses native `prompt()` dialogs for rename operations which are inaccessible (can't be styled, blocked by some browsers). Fix both.

**Steps:**
1. Install or verify `react-hot-toast` is available (preferred for admin toasts, or use `sonner`). Create `src/admin/components/ui/Toast.tsx` wrapper.
2. Replace all 8 `catch (e) { /* silent */ }` blocks with `catch (e) { toast.error('Failed to [action]: ' + getErrorMessage(e)) }`.
3. Create a utility: `function getErrorMessage(e: unknown): string { return e instanceof Error ? e.message : String(e) }`.
4. Replace `prompt('Enter new name:', currentTitle)` with a proper modal dialog using the `<Modal>` component from task 0.12.
5. Create `src/admin/components/tree/RenameDialog.tsx` — input field with confirm/cancel buttons.
6. Add `AbortController` to the tree search `fetch` call so navigating away cancels in-flight searches:
```typescript
const controllerRef = useRef<AbortController>()
useEffect(() => {
  controllerRef.current?.abort()
  controllerRef.current = new AbortController()
  fetch(`/api/tree/search?q=${query}`, { signal: controllerRef.current.signal })
    .then(...)
    .catch(e => { if (e.name !== 'AbortError') toast.error(...) })
}, [query])
```

**Acceptance Criteria:**
- `grep -c "catch.*{}" src/admin/views/ContentTreeClient.tsx` returns 0 (no silent catches)
- `grep "prompt(" src/admin/views/ContentTreeClient.tsx` returns empty (no native prompts)
- `RenameDialog.tsx` exists and is used for rename operations
- Error toasts appear when API calls fail
- AbortController cancels stale search requests

**Validation:**
```bash
grep -c "catch" src/admin/views/ContentTreeClient.tsx
grep "prompt(" src/admin/views/ContentTreeClient.tsx | wc -l  # must be 0
```

---

## Layer 1 — Registry Expansion (4 tasks)

**Purpose:** Add the 22 new component types and fix zone enforcement.

**Gate:**
```bash
# registry.ts exports exactly 53 component types
node -e "const r = require('./src/admin/components/builder/registry'); console.log(r.componentRegistry.length)"  # 53
npx vitest run src/admin/components/builder/registry.test.ts
npx storybook build --quiet
```

**Dependency:** Layer 0 gate must be closed.

---

### 1.1 — Add 22 New Component Types to Registry

**Description:**
Add all 22 new component types (items 32–53 from the Component Registry table) to `src/admin/components/builder/registry.ts` with complete `propsSchema` definitions.

**Key implementation notes per component:**

`project-timeline` (10 stages):
```typescript
propsSchema: [
  { name: 'stageCount', label: 'Number of Stages', type: 'number', min: 1, max: 10, defaultValue: 5 },
  { name: 'currentStage', label: 'Current Stage (1-based)', type: 'number', min: 1, max: 10, defaultValue: 1 },
  {
    name: 'stages', label: 'Stages', type: 'array',
    fields: [
      { name: 'label', label: 'Stage Label', type: 'text', required: true },
      { name: 'date', label: 'Target Date', type: 'text' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'ctaLabel', label: 'CTA Button Label', type: 'text' },
      { name: 'ctaUrl', label: 'CTA Button URL', type: 'text' },
    ],
  },
]
```

`member-action-form`:
```typescript
propsSchema: [
  {
    name: 'variant', label: 'Form Variant', type: 'select', required: true,
    options: [
      { label: 'Document Comment Submission', value: 'document-comment' },
      { label: 'Event Registration', value: 'event-registration' },
      { label: 'Volunteer Registration', value: 'volunteer-registration' },
    ],
  },
  { name: 'heading', label: 'Form Heading', type: 'text' },
  { name: 'introText', label: 'Introduction Text', type: 'textarea' },
]
```

`subscribe-banner`:
```typescript
propsSchema: [
  { name: 'heading', label: 'Heading', type: 'text', required: true },
  { name: 'description', label: 'Description', type: 'textarea' },
  { name: 'hubspotFormId', label: 'HubSpot Form ID', type: 'text', required: true },
  { name: 'linkedinUrl', label: 'LinkedIn URL', type: 'text' },
  {
    name: 'variant', label: 'Style', type: 'select', defaultValue: 'light',
    options: [{ label: 'Light', value: 'light' }, { label: 'Dark', value: 'dark' }, { label: 'Purple', value: 'purple' }],
  },
]
```

**Acceptance Criteria:**
- `componentRegistry.length === 53`
- Every new component has: `type`, `label`, `category`, `icon`, `description`, `allowedZones: []`, `propsSchema`
- `npx tsc --noEmit` zero errors
- All registry helper functions (`getComponentsByCategory`, `searchComponents`) work with 53 entries

**Validation:**
```bash
node -e "const { componentRegistry } = require('./src/admin/components/builder/registry'); console.log(componentRegistry.length)"
npx tsc --noEmit 2>&1 | grep -c error || echo "0 errors"
```

---

### 1.2 — Add Preview Renderers for 22 New Components

**Description:**
Add preview renderer entries to `src/admin/components/builder/previews/` for all 22 new component types. Each renderer renders a compact, non-interactive visual mockup of the component in the page builder canvas.

**Pattern (extend existing previews):**
```typescript
// In data-previews.tsx:
export function ProjectTimelinePreview({ props }: PreviewProps) {
  const stages = props.stageCount ?? 5
  const current = props.currentStage ?? 2
  return (
    <div className="space-y-2 p-3">
      {Array.from({ length: stages }).map((_, i) => (
        <div key={i} className={cn('flex items-center gap-2 text-xs',
          i + 1 < current ? 'text-green-600' : i + 1 === current ? 'text-blue-600 font-semibold' : 'text-gray-400'
        )}>
          <span className="w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px]">
            {i + 1 < current ? '✓' : i + 1}
          </span>
          <span>{(props.stages?.[i]?.label) ?? `Stage ${i + 1}`}</span>
        </div>
      ))}
    </div>
  )
}
```

**Acceptance Criteria:**
- `PreviewRenderer.tsx` case map includes all 53 types (no "Unknown Component" fallbacks for known types)
- All preview renderers compile without TypeScript errors
- Storybook `PreviewRenderer` stories render all 53 types without errors

**Validation:**
```bash
npx storybook build --quiet
grep -c "case '" src/admin/components/builder/previews/PreviewRenderer.tsx  # >= 53
```

---

### 1.3 — Configure Template Zone allowedComponents

**Description:**
Update `src/admin/templates/index.ts` to add proper `allowedComponents` constraints to each template zone. This makes the zone enforcement system actually functional (currently all zones have `allowedComponents: []` meaning no constraints).

**Template zone configurations:**

```typescript
// Homepage template — hero zone only allows homepage-specific blocks
{
  name: 'hero',
  label: 'Hero Zone',
  locked: false,
  allowedComponents: ['hero-banner', 'news-events-grid', 'promo-card-grid'],
},
{
  name: 'mainContent',
  label: 'Main Content',
  locked: false,
  allowedComponents: ['rich-text', 'heading', 'browse-by-standard', 'subscribe-banner', 'stats-bar', 'card-grid'],
},

// Board Detail template — sidebar zone restricted to right-rail widgets
{
  name: 'sidebar',
  label: 'Right Rail',
  locked: false,
  allowedComponents: ['right-rail-events-list', 'right-rail-resource-list', 'quick-links', 'contact-card', 'newsletter-signup', 'subscribe-banner', 'anchor-nav'],
},

// Project Detail template
{
  name: 'timelineZone',
  label: 'Timeline',
  locked: false,
  allowedComponents: ['project-timeline'],
  maxComponents: 1,
},
```

**Acceptance Criteria:**
- Every template zone that should restrict components has a non-empty `allowedComponents` array
- Right-rail-only widgets (`right-rail-events-list`, `right-rail-resource-list`) are NOT in mainContent zones
- `project-timeline` is restricted to `timelineZone` zones only
- `promo-card-grid` is only in Homepage template zones
- Template zone config tests pass

**Validation:**
```bash
npx tsc --noEmit
npx vitest run src/admin/templates/index.test.ts
```

---

### 1.4 — Add SiteAlert Global + Utility Components

**Description:**
Add a `SiteAlert` Payload global for sitewide alert banners. Add `back-to-top` as a utility that auto-renders on all frontend pages (not just when dropped in builder). Add RSS link component for listing/footer templates.

**Steps:**
1. Create `src/globals/SiteAlert.ts` Payload global:
```typescript
export const SiteAlert: GlobalConfig = {
  slug: 'site-alert',
  admin: { group: 'Site Settings' },
  fields: [
    { name: 'enabled', type: 'checkbox', defaultValue: false },
    { name: 'message', type: 'text', required: true },
    { name: 'linkLabel', type: 'text' },
    { name: 'linkUrl', type: 'text' },
    {
      name: 'severity', type: 'select', defaultValue: 'info',
      options: [
        { label: 'Info', value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Critical', value: 'critical' },
      ],
    },
  ],
}
```
2. Register in `payload.config.ts`.
3. Add `site-alert` and `back-to-top` component types to registry (already listed as items 52–53).
4. Create `src/components/SiteAlertBanner.tsx` — reads `site-alert` global, renders dismissible banner in root layout if `enabled: true`.
5. Create `src/components/BackToTop.tsx` — fixed position button, appears after 300px scroll via IntersectionObserver sentinel.

**Acceptance Criteria:**
- `site-alert` global visible in Payload admin
- `SiteAlertBanner` renders in root layout when `enabled: true`
- `BackToTop` button appears when scrolled past 300px, disappears at top
- Both are WCAG 2.2 AA compliant (keyboard-accessible, proper ARIA)

**Validation:**
```bash
npx tsc --noEmit
grep 'SiteAlert' src/payload.config.ts
```

---

## Layer 2 — Admin Quick Wins (6 tasks)

**Purpose:** Sitecore admin parity improvements — each independently deliverable. Parallelizable via git worktrees.

**Gate per task:** Unit tests pass, at least one Storybook story, Playwright E2E for golden path, `npx tsc --noEmit` passes, feature works in browser.

**Overall Layer 2 Gate:**
```bash
npx tsc --noEmit
npx vitest run
npx playwright test tests/e2e/admin/
npx storybook build --quiet
```

**Dependency:** Layer 0 gate must be closed. Layer 1 can be in progress (worktrees).

---

### 2.1 — Board Filter in Workbox

**Description:**
Add a Board dropdown filter to the Workbox view alongside the existing Type/Author filters. Filters the workflow queue by `board` relationship field on content items.

**Implementation:**
- Add `boardFilter` state to WorkboxClient.tsx
- Fetch boards from Payload API on mount: `useQuery({ queryKey: ['boards'], queryFn: () => fetch('/api/boards-list').then(r => r.json()) })`
- Create `/api/boards-list` endpoint returning `[{ id, name, abbreviation }]` for all 5 boards
- Pass `boardFilter` to the existing parallel-fetch logic in WorkboxClient: `where: { board: { equals: boardFilter } }` when filter is set
- UI: `<select>` dropdown with "All Boards" + board abbreviations

**Acceptance Criteria:**
- Board dropdown renders alongside Type/Author filters
- Selecting a board filters the queue to only that board's items
- "All Boards" shows all items (existing behavior)
- Storybook story: Workbox with board filter active
- Playwright test: select board filter, verify item count changes

**Validation:**
```bash
npx vitest run src/admin/views/Workbox.test.ts
npx playwright test tests/e2e/admin/workbox-board-filter.spec.ts
```

---

### 2.2 — FR Translation Status in Tree

**Description:**
Add a globe icon gutter indicator to each content tree row showing French translation completeness. Gray globe = no FR translation. Colored globe = FR exists.

**Implementation:**
1. Update `/api/tree` response to include `hasFrTranslation: boolean` per node.
2. In the single `payload.find` call (from task 0.7), add a locale-aware check:
```typescript
// After fetching all nodes in EN, check which ones have FR locale populated
const frCheck = await payload.find({
  collection: 'pages',
  locale: 'fr',
  limit: 2000,
  depth: 0,
  select: { id: true, title: true },
})
const frIds = new Set(frCheck.docs.filter(n => n.title).map(n => n.id))
// Add hasFrTranslation to each node in nodeMap
for (const node of nodeMap.values()) {
  node.hasFrTranslation = frIds.has(node.id)
}
```
3. In `TreeRow` component (within `ContentTreeClient.tsx` or `StructureTree.tsx`): render globe icon based on `hasFrTranslation`.

**Acceptance Criteria:**
- Each tree row shows globe icon: gray = missing FR, blue = FR exists
- Icon has `title` attribute explaining what it means (a11y)
- `/api/tree` response includes `hasFrTranslation` on each node
- Storybook story for `TreeRow` with translation status variants

**Validation:**
```bash
curl -s http://localhost:3000/api/tree | jq '.docs[0] | keys | contains(["hasFrTranslation"])'
```

---

### 2.3 — Favorites / Bookmarks

**Description:**
Allow editors to star/bookmark frequently-visited content items. Stars are per-user, stored in localStorage keyed by user ID. Starred items appear in a Favorites section in the CustomNav sidebar.

**Implementation:**
1. Create `src/admin/hooks/useFavorites.ts`:
```typescript
export function useFavorites(userId: string) {
  const key = `ras-admin-favorites-${userId}`
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => {
    try { return JSON.parse(localStorage.getItem(key) ?? '[]') } catch { return [] }
  })
  const addFavorite = (item: FavoriteItem) => { ... }
  const removeFavorite = (id: string) => { ... }
  const isFavorite = (id: string): boolean => { ... }
  return { favorites, addFavorite, removeFavorite, isFavorite }
}

interface FavoriteItem {
  id: string
  title: string
  contentType: string
  url: string
  addedAt: string
}
```
2. Add star icon button to tree row hover state (next to workflow dot gutter).
3. Add "Favorites" section to `CustomNav.tsx` — collapsible list of starred items, each with remove button and navigate link.
4. Limit: 20 favorites maximum. If at limit, show toast: "Remove a favorite to add another."

**Acceptance Criteria:**
- Clicking star on tree item adds it to favorites
- Favorites section appears in CustomNav with all starred items
- Clicking favorite item navigates to it in the tree
- Star state persists across page refreshes (localStorage)
- Max 20 favorites enforced with user-facing message
- Storybook story: CustomNav with favorites section populated

**Validation:**
```bash
npx vitest run src/admin/hooks/useFavorites.test.ts
npx playwright test tests/e2e/admin/favorites.spec.ts
```

---

### 2.4 — Command Palette (Cmd+K)

**Description:**
Global keyboard shortcut `Cmd+K` (Mac) / `Ctrl+K` (Windows/Linux) opens a command palette with search across content items, recent items, and quick action shortcuts.

**Implementation:**
1. Create `src/admin/components/CommandPalette.tsx` — full-screen overlay with search input.
2. Register global `keydown` listener in the custom admin layout client component.
3. Search behavior: debounced 300ms, queries `/api/tree/search?q=` as user types.
4. Recent items: last 10 items visited, stored in localStorage (`ras-admin-recent`).
5. Quick actions (static list, no search filtering):
   - "New Page" → `/admin/collections/pages/create`
   - "New News" → `/admin/collections/news/create`
   - "New Event" → `/admin/collections/events/create`
   - "Go to Workbox" → `/admin/workbox`
   - "Go to Media Library" → `/admin/media`
6. Keyboard navigation: arrow up/down, Enter to select, Escape to close.
7. Sections: Quick Actions (top), Recent Items, Search Results (appear on query).

**Acceptance Criteria:**
- `Cmd+K` opens palette, `Escape` closes it
- Typing searches tree items with 300ms debounce
- Arrow keys navigate items, Enter opens selected
- Recent items list shows last 10 visited
- Quick actions always visible at top
- Focus trapped inside palette while open (WCAG 2.2)
- Storybook story: palette open with results
- Playwright E2E: open palette, type query, select result

**Validation:**
```bash
npx playwright test tests/e2e/admin/command-palette.spec.ts
```

---

### 2.5 — Insert Options Enforcement in Tree Context Menu

**Description:**
The tree context menu's "Insert" submenu currently shows all content types regardless of the parent node's template type. Restrict insert options to only valid child types based on parent template.

**Parent → valid child types mapping:**
```typescript
const VALID_CHILDREN: Record<string, string[]> = {
  'page': ['page', 'folder'],
  'folder': ['page', 'news', 'project', 'event', 'document', 'folder'],
  'news': [],                // leaf nodes — no children
  'project': ['document'],
  'event': [],
  'document': [],
  'media': [],
  'settings': ['page'],
}
```

**Implementation:**
1. Update `TreeContextMenu.tsx` — the "Insert" submenu items filter based on `VALID_CHILDREN[parentNode.contentType]`.
2. If `VALID_CHILDREN[type]` is empty, grey out / hide the "Insert" menu item entirely.
3. Export `VALID_CHILDREN` constant to `src/admin/types/tree.ts` for reuse in tests.

**Acceptance Criteria:**
- Right-clicking a `news` node shows no "Insert" option (leaf node)
- Right-clicking a `page` node shows only "Page" and "Folder" insert options
- Right-clicking a `folder` node shows all valid types
- Storybook story: context menu for different node types showing filtered options
- Vitest unit test: `getValidChildren(contentType)` returns correct arrays

**Validation:**
```bash
npx vitest run src/admin/components/TreeContextMenu.test.ts
```

---

### 2.6 — Redirect Manager

**Description:**
Create a Redirect Manager admin view at `/admin/redirects` for CRUD management of 301/302 redirects. Maps to a `redirects` Payload collection.

**Implementation:**
1. Create `src/collections/Redirects.ts`:
```typescript
export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: { useAsTitle: 'from', group: 'Site Settings' },
  fields: [
    { name: 'from', type: 'text', required: true, index: true },
    { name: 'to', type: 'text', required: true },
    {
      name: 'type', type: 'select', defaultValue: '301',
      options: [{ label: 'Permanent (301)', value: '301' }, { label: 'Temporary (302)', value: '302' }],
    },
    { name: 'note', type: 'text' },
    { name: 'createdAt', type: 'date', admin: { readOnly: true } },
  ],
}
```
2. Register in `payload.config.ts`.
3. Create custom admin view at `/admin/redirects` (separate from Payload's collection CRUD, more table-focused):
   - `RedirectsManager.tsx` (server) + `RedirectsClient.tsx`
   - Table: From Path | To Path | Type | Note | Created | Actions (Edit, Delete)
   - "Add Redirect" button → inline row or modal form
   - Import CSV option (batch create)
4. Wire Next.js middleware to read from `redirects` collection at build time (or via on-demand ISR) and handle redirects.
5. Register in `CustomNav.tsx` under "Site Settings."

**Acceptance Criteria:**
- `redirects` collection in Payload with 4 fields
- Custom table view at `/admin/redirects` showing all redirects
- Create, edit, delete operations work
- Storybook story: redirect table with sample rows
- Playwright E2E: create redirect, verify it appears in table

**Validation:**
```bash
npx tsc --noEmit
npx playwright test tests/e2e/admin/redirects.spec.ts
```

---

## Layer 3 — Admin Medium Lifts (5 tasks)

**Purpose:** Publishing schedule, language audit, version comparison, notifications, dictionary.

**Gate (same as Layer 2 per task):**
```bash
npx tsc --noEmit
npx vitest run
npx playwright test tests/e2e/admin/
npx storybook build --quiet
```

**Dependency:** Layer 0 + Layer 1 closed.

---

### 3.1 — Publishing Schedule View

**Description:**
Create a `/admin/schedule` view showing all content items with `publishOn` (scheduled publish) dates in a calendar/list view. Editors can see what's scheduled, click to preview, and cancel scheduled publishing.

**Implementation:**
1. Create `src/admin/views/Schedule.tsx` (server) + `ScheduleClient.tsx`.
2. Query: `payload.find` across all 12 workflow-enabled collections where `workflowState === 'approved'` and `publishOn` field is set. Use `Promise.allSettled` pattern from WorkboxClient.
3. Display: dual-mode — calendar grid (default) and list view.
4. Calendar: monthly view, each day cell shows items scheduled for that day. Click day to see item list.
5. List: grouped by date, each item shows: title, collection, board, scheduled time, "Preview" link, "Cancel Schedule" button.
6. "Cancel Schedule" sets `publishOn` to null, sets `workflowState` back to `'approved'` — editor must re-schedule or manually publish.
7. Use TanStack Query with `queryKey: ['schedule']` and invalidate on cancel.

**Acceptance Criteria:**
- `/admin/schedule` route accessible from CustomNav
- Calendar view renders current month with scheduled items on correct days
- List view shows same items in date order
- Preview link opens the content item in a new tab
- Cancel schedule removes item from calendar and shows confirmation toast
- Storybook story: schedule view with sample items on calendar

**Validation:**
```bash
npx playwright test tests/e2e/admin/schedule.spec.ts
```

---

### 3.2 — Language Version Audit View

**Description:**
Create a `/admin/translations` view showing a grid of all content items with EN/FR translation completeness percentages. Editors can identify and address translation gaps.

**Implementation:**
1. Create `src/admin/views/Translations.tsx` (server) + `TranslationsClient.tsx`.
2. For each content item, calculate FR completeness: count localized fields with FR values ÷ total localized fields. Express as percentage.
3. Create `/api/translations-audit` endpoint:
```typescript
// Returns items with completeness score
interface TranslationAuditItem {
  id: string
  title: string
  collection: string
  board?: string
  enComplete: number  // always 100 if published
  frComplete: number  // 0-100
  missingFields: string[]
}
```
4. UI: filterable table. Columns: Title | Collection | Board | EN | FR (progress bar) | Actions.
5. "Edit FR" button opens Payload edit view with `?locale=fr` pre-selected.
6. Filter by collection, board, completeness threshold (< 50%, < 100%, etc.).
7. Sort by FR completeness ascending (surfacing least-translated items first).

**Acceptance Criteria:**
- `/admin/translations` route shows translation grid
- Each row shows FR completeness as percentage + progress bar
- "Edit FR" opens correct Payload edit view with FR locale
- Filter and sort controls work
- Zero items with 100% FR completeness are incorrectly flagged as incomplete
- Storybook story: translation grid with mixed completeness values

**Validation:**
```bash
npx playwright test tests/e2e/admin/translations.spec.ts
```

---

### 3.3 — Version Comparison UI

**Description:**
Add version comparison to workflow review — reviewers can see what changed between the current version and previous version. Uses `@pierre/diffs` for text fields and `diff-match-patch` for Lexical rich text.

**Implementation:**
1. Install: `npm install diff-match-patch` (likely already installed) and `@pierre/diffs` if available, else implement split-pane diff component.
2. Create `src/admin/components/workflow/VersionDiff.tsx`:
   - Props: `{ fieldName: string; fieldType: 'text' | 'richtext' | 'locale'; prevValue: string; nextValue: string; mode: 'split' | 'unified' }`
   - For `type: 'text'`: render split pane with additions (green bg) / deletions (red strikethrough)
   - For `type: 'richtext'`: use `diff-match-patch` to compute diff on plain-text extracted from Lexical JSON, annotate
   - For `type: 'locale'`: render two full versions side-by-side (EN left, FR right) — no diff highlights
3. Create `src/admin/components/workflow/VersionCompareModal.tsx` — opens from workflow action bar. Shows all changed fields with their diff views.
4. Add "Compare with Previous" button to `WorkflowActionBar.tsx` (visible when reviewing In Review items).
5. Create `/api/tree/versions?nodeId=X&versionA=Y&versionB=Z` endpoint that fetches two Payload versions and returns field-by-field comparison.

**Acceptance Criteria:**
- "Compare" button in workflow action bar opens version diff modal
- Text field diffs show additions (green) and deletions (red) correctly
- Rich text diffs render as annotated prose
- EN/FR side-by-side view renders without diff highlights
- Modal is keyboard-navigable and screen reader accessible
- Storybook story: VersionDiff with text, richtext, and locale variants

**Validation:**
```bash
npx vitest run src/admin/components/workflow/VersionDiff.test.ts
npx storybook build --quiet
```

---

### 3.4 — Admin Notification Center

**Description:**
In-app notification system for workflow events. Bell icon in CustomNav nav bar shows unread count. Slide-out panel shows notification history. Notifications triggered by workflow state changes.

**Implementation:**
1. Create `src/collections/Notifications.ts` Payload collection:
```typescript
fields: [
  { name: 'recipient', type: 'relationship', relationTo: 'users', required: true },
  { name: 'type', type: 'select', options: ['item_approved', 'item_rejected', 'item_submitted', 'item_published'] },
  { name: 'message', type: 'text', required: true },
  { name: 'itemId', type: 'text' },
  { name: 'itemCollection', type: 'text' },
  { name: 'read', type: 'checkbox', defaultValue: false },
  { name: 'createdAt', type: 'date' },
]
```
2. Register in `payload.config.ts`.
3. Add `afterChange` hook to workflow state transition logic — when state changes, create notification for relevant user(s):
   - Submitted for review → notify editors
   - Approved → notify original author
   - Rejected → notify original author
   - Published → notify original author
4. Create `src/admin/components/NotificationBell.tsx` — bell icon with unread count badge in CustomNav header area.
5. Create `src/admin/components/NotificationPanel.tsx` — slide-out (right edge, 320px) showing last 50 notifications, newest first. Mark as read on open. "Mark all read" button.
6. Notifications are per-user: query `where: { recipient: { equals: currentUserId } }`.
7. Poll for new notifications every 30 seconds using TanStack Query `refetchInterval: 30000`.

**Acceptance Criteria:**
- Bell icon in nav shows unread count badge
- Opening panel marks notifications as read (unread count resets)
- Workflow approval triggers notification to original author
- Workflow rejection triggers notification with the rejection comment in message
- "Mark all read" works
- Panel is keyboard-accessible and dismissible
- Storybook story: notification bell with count, panel open with items

**Validation:**
```bash
npx playwright test tests/e2e/admin/notifications.spec.ts
```

---

### 3.5 — Dictionary / Labels Manager

**Description:**
Create a `/admin/dictionary` view for managing i18n UI strings (the keys in `messages/en.json` and `messages/fr.json`). Editors can update UI strings without code deploys.

**Implementation:**
1. Create `src/collections/Dictionary.ts` Payload collection:
```typescript
fields: [
  { name: 'key', type: 'text', required: true, index: true, unique: true },
  { name: 'enValue', type: 'text', required: true, localized: false },
  { name: 'frValue', type: 'text', localized: false },
  { name: 'section', type: 'select', options: ['nav', 'footer', 'forms', 'search', 'admin', 'error', 'misc'] },
  { name: 'notes', type: 'text' },
]
```
2. Register in `payload.config.ts`.
3. Create import script `scripts/import-dictionary.ts` — reads `messages/en.json` and `messages/fr.json`, creates Dictionary records for all keys.
4. Create `src/admin/views/Dictionary.tsx` + `DictionaryClient.tsx` — split-pane editor: left = EN value, right = FR value. Both editable inline.
5. Add "Export" button — downloads updated JSON files.
6. Create API endpoint `/api/dictionary/export` that generates `messages/en.json` and `messages/fr.json` from current database values.
7. Update `src/i18n/request.ts` to fetch from database in production (with in-memory cache, 5-minute TTL) instead of reading static JSON files.

**Acceptance Criteria:**
- `/admin/dictionary` shows all keys with EN/FR values
- Editing EN or FR values updates the database
- Export generates valid JSON files matching next-intl message format
- Section filter works (show only 'nav' keys, etc.)
- Search by key name works
- Storybook story: dictionary editor with sample keys

**Validation:**
```bash
npx playwright test tests/e2e/admin/dictionary.spec.ts
```

---

## Layer 4 — Big Builds (4 tasks)

**Purpose:** Live preview, native field editing, and `/cms` custom shell. These are sequential — each depends on the previous.

**Gate:**
```bash
npm run build
npx tsc --noEmit
npx playwright test tests/e2e/admin/
```

**Dependency:** Layers 0, 1, 2, 3 complete.

---

### 4.1 — Live WYSIWYG Preview

**Description:**
PostMessage iframe architecture for live page preview within the builder. The preview route renders the actual Next.js frontend page; a parent overlay lets editors click components directly.

**Architecture:**

```
PageBuilderClient (parent)
  ├── BuilderCanvas (left panel)
  ├── StructurePanel (right panel)
  └── PreviewPane (center, when in Preview mode)
       └── <iframe src="/preview/[pageId]" />
            ↕ window.postMessage
       PreviewPage (/preview/[pageId])
            └── Actual Next.js page rendered
                 └── data-builder-id="[componentId]" on each component root
                 └── builder-overlay.js (thin script)
                      ├── Draws hover/click chrome borders
                      └── postMessage({ type: 'SELECT_COMPONENT', id }) on click
```

**Implementation:**
1. Create `/preview/[pageId]/page.tsx` route — fetches the page's `builderLayout` from Payload, renders actual components using the same `RenderBlocks` pipeline as the frontend.
2. Add `data-builder-id={component.id}` to component root elements in all builder-rendered components.
3. Create `public/builder-overlay.js` — injected by the preview route. Uses `MutationObserver` + `querySelectorAll('[data-builder-id]')` to find components. On hover: draw blue border overlay. On click: `window.parent.postMessage({ type: 'SELECT_COMPONENT', id: el.dataset.builderId }, '*')`.
4. In `PageBuilderClient.tsx`: listen for postMessage from iframe. On `SELECT_COMPONENT`: update selected component ID in builder state (selects on canvas + opens in InspectorPanel).
5. Send layout updates to iframe: when builder state changes, `iframeRef.current.contentWindow.postMessage({ type: 'LAYOUT_UPDATE', payload: { zones, pageId } }, '*')`. Preview page listens and re-renders without full page reload.
6. Add Edit/Preview toggle to builder toolbar:
   - **Edit mode:** 3-panel layout (StructurePanel + Canvas + InspectorPanel)
   - **Preview mode:** Preview pane fills center, StructurePanel collapsed
   - `Ctrl+P` (Windows) / `Cmd+P` (Mac) toggles modes
7. Add "Open in New Tab" link pointing to `/preview/[pageId]`.

**Acceptance Criteria:**
- Clicking "Preview" in toolbar shows live preview iframe
- `Ctrl+P` toggles between Edit and Preview modes
- Clicking a component in the preview iframe selects it in the builder
- Making a prop change in InspectorPanel reflects in preview within 500ms
- Preview renders actual frontend page (same design/CSS as public site)
- No CORS errors in browser console
- Playwright E2E: toggle preview mode, verify iframe loads

**Validation:**
```bash
npx playwright test tests/e2e/admin/builder-preview.spec.ts
npx tsc --noEmit
```

---

### 4.2 — Native Field Editing Level 2

**Description:**
Add a "key-fields card" at the top of the tree right panel (above the existing Payload iframe). This card shows the most important fields for any content item and allows inline editing without opening the full form.

**Key fields by content type:**
- All: title (text), slug (text), workflowState (select), publishOn (datetime)
- pages: board (relationship), template (select)
- news: date (date), category (select)
- projects: status (select), board (relationship)
- events: startDate (date), type (select)

**Implementation:**
1. Create `/api/tree/fields?nodeId=X` endpoint:
   - Reads the node's `contentType`
   - Returns field schema for "key fields" (hardcoded per content type — not full schema)
   - Returns current field values from Payload
2. Create `src/admin/components/tree/KeyFieldsCard.tsx`:
   - Renders each key field using appropriate `@payloadcms/ui` field component OR a lightweight custom renderer
   - "Save" button: `PATCH /api/{collection}/{id}` with changed fields only
   - "Full Editor" button: opens Payload edit form in the iframe below
   - Shows save success toast on success, error toast on failure
3. Place `KeyFieldsCard` above the existing iframe in the tree right panel.
4. The iframe remains for full-form access — `KeyFieldsCard` is a fast path for common edits.

**Key fields card shape:**
```typescript
interface KeyFieldsCardProps {
  nodeId: string
  contentType: ContentType
  initialValues: Record<string, unknown>
  onSave: (values: Record<string, unknown>) => Promise<void>
}
```

**Acceptance Criteria:**
- Key fields card appears above iframe in tree right panel
- Editing title and clicking Save updates the node's title in Payload
- Workflow state dropdown is functional (respects valid transitions from VALID_TRANSITIONS map)
- "Full Editor" button scrolls to / opens the iframe below
- Optimistic update: tree row title updates immediately before API confirms
- Error toast on save failure with rollback
- Storybook story: KeyFieldsCard with different content types

**Validation:**
```bash
npx playwright test tests/e2e/admin/key-fields-card.spec.ts
```

---

### 4.3 — Native Field Editing Level 3

**Description:**
Replace the Payload iframe in the tree right panel with `@payloadcms/ui` field components rendered directly in the custom shell. Fields grouped into collapsible sections. Full save/publish from the panel.

**Implementation:**
1. Extend `/api/tree/fields?nodeId=X` to return the FULL field schema for the content type (not just key fields). This means reading the Payload collection config.
2. Create `src/admin/components/tree/NativeFieldEditor.tsx`:
   - Renders all fields using `@payloadcms/ui` field components
   - Groups fields into collapsible sections: "Content", "Settings", "SEO", "Workflow"
   - Save button: `PUT /api/{collection}/{id}` with all changed fields
   - Publish button: saves + sets `workflowState: 'published'`
3. Remove the iframe from the tree right panel.
4. Handle all field types: text, textarea, richtext (Lexical), select, relationship, date, media, array, blocks.
5. For relationship fields: show searchable dropdown using `@payloadcms/ui`'s `RelationshipField` component.
6. For rich text: use Lexical editor from `@payloadcms/richtext-lexical` in read-only-first mode.

**Important:** This task requires reading `@payloadcms/ui` documentation carefully via `payload-super` skill and Context7. The component API changes between minor versions.

**Acceptance Criteria:**
- Iframe is removed from tree right panel
- All content fields render correctly via `@payloadcms/ui` components
- Saving updates the item in Payload
- Publishing sets workflow state and triggers publication
- Lexical rich text editor works (can type, format, save)
- No visual regression on existing tree functionality
- Playwright E2E: edit a field, save, verify change persists

**Validation:**
```bash
npx playwright test tests/e2e/admin/native-field-editor.spec.ts
npm run build  # must pass
```

---

### 4.4 — /cms Custom Admin Shell

**Description:**
Create `/cms` as a standalone custom admin entry point that replaces `/admin` for editors. Role gate: `author` and `editor` roles get redirected from `/admin` to `/cms`.

**Implementation:**
1. Create `src/app/(cms)/layout.tsx` — standalone layout, NOT inside the Payload `(payload)` route group. Renders `CustomNav`, no Payload chrome.
2. Create `src/app/(cms)/page.tsx` — dashboard redirect → `/cms/tree`.
3. Mount all existing custom views under `/cms`:
   - `/cms/tree` → ContentTree
   - `/cms/media` → MediaLibrary
   - `/cms/builder/[pageId]` → PageBuilder
   - `/cms/workbox` → Workbox
   - `/cms/schedule` → Schedule (from 3.1)
   - `/cms/translations` → Translations (from 3.2)
   - `/cms/redirects` → Redirects (from 2.6)
   - `/cms/dictionary` → Dictionary (from 3.5)
4. Update `CustomNav.tsx` to use `/cms` prefix for all links.
5. Create middleware in `src/middleware.ts` (or extend existing):
   - If request is to `/admin/*` and user role is `author` or `editor`: redirect to `/cms`.
   - If request is to `/cms/*` and user is not authenticated: redirect to `/admin/login`.
6. Keep `/admin` fully functional for `admin` role users (developer access).

**Note:** The `/admin` route prefix is controlled by Payload. The redirect must happen in Next.js middleware, not in Payload hooks.

**Acceptance Criteria:**
- `/cms` loads for authenticated users (all roles)
- Author/editor visiting `/admin` are immediately redirected to `/cms`
- Admin role can access `/admin` without redirect
- All custom views accessible under `/cms/` prefix
- `CustomNav` links all point to `/cms/` versions
- Login redirect: unauthenticated `/cms` access → `/admin/login` (Payload handles auth)
- Playwright E2E: author role visits `/admin`, gets redirected to `/cms`

**Validation:**
```bash
npx playwright test tests/e2e/admin/cms-shell.spec.ts
curl -I -H "Cookie: payload-token=<author-jwt>" http://localhost:3000/admin
# Should return 302 to /cms
```

---

## Layer 5 — Polish (3 tasks)

**Purpose:** Accessibility audit, UI.sh pass, security audit, and plugin extraction scoping.

**Gate:**
```bash
npx playwright test tests/e2e/a11y/  # axe-core WCAG 2.2 AA: zero critical/serious
# Lighthouse CI: >= 90 on all pages
npx vitest run                        # all tests pass
npm run build                         # zero errors
```

**Dependency:** All previous layers complete.

---

### 5.1 — UI.sh Full Pass

**Description:**
Run the `/ui` skill against all frontend and admin components built in this phase (Layers 1–4). Review for visual consistency, spacing, typographic scale, and Tailwind v4 token usage.

**Scope:** All components created or modified in Layers 0–4 of this phase. NOT Phase 1+2 components (too wide).

**Steps:**
1. For each component directory: invoke `/ui` skill with the component file + relevant design tokens.
2. Fix any UI.sh suggestions (typically: replace hardcoded spacing with tokens, improve hover/focus states, ensure responsive behavior).
3. Run Storybook to verify no visual regressions.
4. Update Storybook stories to reflect polished UI.

**Acceptance Criteria:**
- All `/ui` suggestions addressed or explicitly documented as won't-fix with rationale
- No hardcoded hex colors in any component (all via CSS variables or Tailwind tokens)
- All interactive states (hover, focus, active, disabled) implemented for interactive components
- Responsive behavior verified at 390px, 768px, 1024px, 1440px

**Validation:**
```bash
npx storybook build --quiet
```

---

### 5.2 — Final Architecture + Security Audit

**Description:**
Run the `improve-codebase-architecture` skill and `security-audit-orchestrator` skill against all code added in this phase. Fix all critical and high findings.

**Architecture audit focus areas:**
- Bundle size analysis (new admin components — watch for large imports in client components)
- Server/client component boundary violations (admin components using `fetch` server-side without proper caching)
- TanStack Query cache key consistency (ensure no cache key typos causing stale data)
- Type safety gaps (any `any` or `unknown` casts added in this phase)

**Security audit focus areas:**
- `/api/tree/fields` endpoint — ensure it respects Payload access control (authenticated-only, role-filtered)
- `/cms` route access control — ensure role gate cannot be bypassed
- PostMessage bridge — validate origin before processing messages from preview iframe
- Redirect manager — validate redirect `to` URLs against allowlist (prevent open redirect attacks)
- Dictionary export endpoint — ensure only admins can export message files

**PostMessage security hardening:**
```typescript
// In preview iframe listener — validate origin
window.addEventListener('message', (event) => {
  // Only accept messages from our own origin
  if (event.origin !== window.location.origin) return
  handleBuilderMessage(event.data)
})
```

**Acceptance Criteria:**
- Zero critical architecture findings unaddressed
- Zero high security findings unaddressed
- All API endpoints in this phase have proper authentication checks
- PostMessage bridge validates origin
- `npm run build` passes after fixes

**Validation:**
```bash
npx tsc --noEmit
npm run build
```

---

### 5.3 — Plugin Extraction Scoping (Backlog Documentation)

**Description:**
Document the work required to extract custom admin modules into reusable Payload plugins. This is DOCUMENTATION ONLY — no code changes. Scoping for Phase 4.

**Output document:** `.ai-reports/plugin-extraction-plan.md`

**Modules to scope for extraction:**
1. `@ras-canada/payload-content-tree` — ContentTree view, `/api/tree`, `/api/tree/search`, `/api/tree/fields`, TreeNode types
2. `@ras-canada/payload-media-library` — MediaLibrary view, MediaFolders collection, `/api/media-folders/tree`, folder management
3. `@ras-canada/payload-page-builder` — PageBuilder view, component registry, template system, preview bridge
4. `@ras-canada/payload-workbox` — Workbox view, workflow collections extension, notification system
5. `@ras-canada/payload-cms-shell` — `/cms` route, CustomNav, all custom views mounting, role-based redirect

**For each plugin, document:**
- Public API surface (exports, configuration options)
- Peer dependency requirements
- What it registers in Payload (`collections`, `globals`, `admin.components`, `endpoints`)
- What it adds to Next.js app (`app/` routes, `middleware.ts` additions)
- Estimated extraction effort (days)

**Acceptance Criteria:**
- `.ai-reports/plugin-extraction-plan.md` exists
- All 5 modules have extraction estimates
- Public API surface documented for each plugin
- No code changes in this task

**Validation:**
```bash
ls .ai-reports/plugin-extraction-plan.md
```

---

## Dependency Graph

```
Layer 0 — Foundation
  ├── 0.1  Dependency updates (prerequisite for everything)
  ├── 0.2  FRAS→RAS rename (brand.ts) [depends on 0.1]
  ├── 0.3  Fix 9 registry bugs [depends on 0.1]
  ├── 0.4  Add 5 color tokens [depends on 0.1]
  ├── 0.5  WCAG 2.2→2.2 update [independent, parallelizable]
  ├── 0.6  Vitest setup [depends on 0.1]
  ├── 0.7  Fix /api/tree N+1 [depends on 0.1]
  ├── 0.8  Fix /api/tree/search N+1 [depends on 0.7]
  ├── 0.9  Decompose MediaLibraryClient [depends on 0.1]
  ├── 0.10 Shared type files [depends on 0.1, blocks 0.11, 0.12, 0.14]
  ├── 0.11 TanStack Query install [depends on 0.10]
  ├── 0.12 Extract Modal component [depends on 0.10]
  ├── 0.13 Delete dead code [depends on 0.1]
  └── 0.14 Fix tree error handling [depends on 0.12]

  ↓ [Layer 0 Gate: build + tsc + vitest + storybook all pass, FRAS grep = 0]

Layer 1 — Registry Expansion
  ├── 1.1  Add 22 new component types [depends on L0 gate]
  ├── 1.2  Add preview renderers [depends on 1.1]
  ├── 1.3  Configure template zones [depends on 1.1]
  └── 1.4  SiteAlert global + utilities [depends on L0 gate]

  ↓ [Layer 1 Gate: registry.length === 53, storybook builds]

Layer 2 — Admin Quick Wins (parallelizable via worktrees)
  ├── 2.1  Board filter in Workbox [depends on L0 gate, L1 not required]
  ├── 2.2  FR translation gutter icon [depends on 0.7 + 0.8]
  ├── 2.3  Favorites/bookmarks [depends on L0 gate]
  ├── 2.4  Command palette [depends on 0.7 + 0.8]
  ├── 2.5  Insert options enforcement [depends on 0.10]
  └── 2.6  Redirect manager [depends on L0 gate]

  ↓ [Layer 2 Gate: all 6 tasks pass their individual gates]

Layer 3 — Admin Medium Lifts (parallelizable via worktrees)
  ├── 3.1  Publishing schedule [depends on L2 gate]
  ├── 3.2  Language audit view [depends on 2.2]
  ├── 3.3  Version comparison [depends on L2 gate]
  ├── 3.4  Notification center [depends on L2 gate]
  └── 3.5  Dictionary manager [depends on L2 gate]

  ↓ [Layer 3 Gate: all 5 tasks pass their individual gates]

Layer 4 — Big Builds (SEQUENTIAL — each blocks the next)
  4.1  Live WYSIWYG preview [depends on L3 gate]
    ↓
  4.2  Native field editing L2 [depends on 4.1]
    ↓
  4.3  Native field editing L3 [depends on 4.2]
    ↓
  4.4  /cms custom shell [depends on 4.3]

  ↓ [Layer 4 Gate: all 4 tasks pass + Playwright E2E suite passes]

Layer 5 — Polish (parallelizable)
  ├── 5.1  UI.sh full pass [depends on L4 gate]
  ├── 5.2  Architecture + security audit [depends on L4 gate]
  └── 5.3  Plugin extraction scoping [depends on L4 gate]

  ↓ [Layer 5 Gate: WCAG 2.2 zero critical/serious, Lighthouse ≥90, security audit passes]
```

---

## Skills Per Layer

| Layer | Primary Skills | Secondary Skills |
|---|---|---|
| L0 — Foundation | `improve-codebase-architecture`, `payload-super`, `typescript-advanced-types` | `javascript-testing-patterns`, `next-best-practices` |
| L1 — Registry | `payload-super`, `storybook-story-writing`, `/ui` | `react-best-practices` |
| L2 — Quick Wins | `payload-super`, `/ui`, `accessibility` | `motion`, `e2e-testing-patterns` |
| L3 — Medium Lifts | `payload-super`, `/ui`, `accessibility` | `e2e-testing-patterns`, `javascript-testing-patterns` |
| L4 — Big Builds | `payload-super`, `/ui`, `improve-codebase-architecture` | `nextjs-app-router-patterns`, `motion`, `security-audit-orchestrator` |
| L5 — Polish | `/ui`, `accessibility`, `core-web-vitals` | `security-audit-orchestrator`, `dogfood`, `improve-codebase-architecture` |

**Skill invocation rule:** Always invoke the relevant skill at the START of a task, not after writing code. The skill provides patterns that shape the implementation.

---

## Estimated Task Count

| Layer | Tasks | Parallelizable | Sequential | Key Gate |
|---|---|---|---|---|
| L0 — Foundation | 14 | 0.1–0.6 in parallel; 0.7→0.8; 0.10→0.11,0.12,0.14 | 0.7→0.8; 0.10→0.11 | `npm run build` + `tsc` + `vitest` + Storybook all pass, FRAS grep = 0 |
| L1 — Registry | 4 | 1.1→1.2,1.3 in parallel; 1.4 independent | 1.1→1.2 | `registry.length === 53` |
| L2 — Quick Wins | 6 | All 6 parallelizable | None | All individual task gates pass |
| L3 — Medium Lifts | 5 | All 5 parallelizable | None | All individual task gates pass |
| L4 — Big Builds | 4 | None | All sequential | Playwright E2E suite passes |
| L5 — Polish | 3 | All 3 parallelizable | None | WCAG 2.2 zero critical, Lighthouse ≥90 |
| **Total** | **36** | | | |

---

*Archive note: The original BUILD_PLAN.md covering Epics 0–10 (Phase 1) and BUILD_PLAN-phase2.md covering Epics 11–27 (Phase 2) are complete and superseded. Their full content remains in version control history. MASTER_TODO.md retains all Phase 1+2 completed tasks as historical record.*
