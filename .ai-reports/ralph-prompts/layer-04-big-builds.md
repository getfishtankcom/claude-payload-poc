# Ralph Loop Prompt — Layer 4: Big Builds

## Your Mission

Build 4 major features that represent the most architecturally ambitious work in the admin platform. These tasks are sequential — each depends on the previous. Read the full spec for all 4 before starting task 4.1 so you understand the full arc: WYSIWYG preview → native field editing (key fields) → native field editing (full Payload components) → standalone CMS shell.

**Estimated tasks:** 4 (4.1–4.4)
**Stop condition:** `<promise>LAYER 4 COMPLETE</promise>`
**Gate required:** Yes — human review required after 4.1 (live preview) and after 4.4 (CMS shell) before proceeding.

---

## Context Files (READ THESE FIRST, IN ORDER)

1. `CLAUDE.md` — project rules, Payload skill priority, Ralph loop workflow
2. `.ai-reports/MASTER_TODO.md` — find the "Layer 4" section; read every task entry
3. `.ai-reports/PRD-admin-panel.md` — Section 6 (Page Builder) especially 6.3 (Canvas) and 6.4 (Props Drawer)
4. `src/admin/views/PageBuilderClient.tsx` — existing page builder client; understand current postMessage implementation
5. `src/admin/components/builder/registry.ts` — component registry; renderComponent is the live preview component

---

## Skills to Invoke

- `payload-super` — before 4.3 and 4.4 (Payload component APIs, custom admin shell)
- `/ui` — for any styling/animation questions
- `improve-codebase-architecture` — before 4.4 (CMS shell is a new module boundary)
- `nextjs-app-router-patterns` — before 4.4 (standalone shell is a separate Next.js route group)
- `motion` — for 4.1 editing chrome animations (slide-in, highlight transitions)

---

## Key Context

### Task Dependency Chain
```
4.1 Live WYSIWYG Preview
    ↓ (establishes postMessage bridge)
4.2 Native Field Editing Level 2 (key-fields card)
    ↓ (demonstrates hybrid iframe + card pattern)
4.3 Native Field Editing Level 3 (full Payload UI components)
    ↓ (proves full replacement of iframe form)
4.4 /cms standalone admin shell
    (wraps everything in a production-ready shell)
```

Do NOT start 4.2 until 4.1 is complete and validated.
Do NOT start 4.3 until 4.2 is complete and validated.
Do NOT start 4.4 until 4.3 is complete and validated.

### PostMessage Bridge Architecture
The current page builder uses a simple postMessage channel. This layer expands it significantly. Document the message types in `src/admin/lib/builder-messages.ts`:

```typescript
// Admin → iframe
type AdminMessage =
  | { type: 'HIGHLIGHT_COMPONENT'; componentId: string }
  | { type: 'SELECT_COMPONENT'; componentId: string }
  | { type: 'UPDATE_COMPONENT'; componentId: string; props: Record<string, unknown> }
  | { type: 'DESELECT_ALL' }
  | { type: 'SET_LOCALE'; locale: 'en' | 'fr' }
  | { type: 'SET_PREVIEW_MODE'; mode: 'preview' | 'edit' }

// iframe → admin
type IframeMessage =
  | { type: 'COMPONENT_CLICKED'; componentId: string; zone: string; rect: DOMRect }
  | { type: 'COMPONENT_HOVERED'; componentId: string }
  | { type: 'COMPONENT_BLURRED' }
  | { type: 'ZONE_DIMENSIONS'; zone: string; rect: DOMRect }
  | { type: 'PAGE_READY' }
  | { type: 'FIELD_CHANGED'; componentId: string; fieldPath: string; value: unknown }
```

### Native Field Editing Philosophy
The three levels (4.1, 4.2, 4.3) represent a progressive enhancement path:
- **Level 1** (already built): Props Drawer / InspectorPanel — admin-side form, no iframe interaction
- **Level 2** (4.2): Key-fields card — small floating card overlay on the selected component showing the 2-3 most important fields. Hybrid: card is admin React, iframe shows live preview.
- **Level 3** (4.3): Full native editing — Payload's own field components rendered inline in the canvas chrome. The iframe iframe form disappears; you edit directly in the admin.

---

## Tasks

### 4.1 Live WYSIWYG Preview
**What:** Upgrade the page builder canvas from a static postMessage bridge to a fully live WYSIWYG editing experience. When an editor changes a component's props, the canvas updates without a page reload.

**Spec:**

**Edit / Preview Mode Toggle:**
- The builder toolbar gains a toggle: [Edit Mode] / [Preview Mode]
- **Edit Mode** (default): Canvas shows component chrome (labels, gear icon, handles, X). Clicks on the canvas select components.
- **Preview Mode**: Canvas hides all editing chrome. The page renders exactly as it will look to visitors. No component selection.
- Transition between modes: smooth fade of editing overlays (use `motion` for opacity transitions)
- `data-testid="mode-toggle"`, `data-testid="mode-edit"`, `data-testid="mode-preview"`

**Live Update on Prop Change:**
- When a prop changes in the InspectorPanel (Apply button clicked), instead of a full iframe reload:
  1. Admin sends `UPDATE_COMPONENT` postMessage to iframe
  2. Iframe has a React context (`BuilderContext`) that holds the current layout JSON
  3. On `UPDATE_COMPONENT`, the iframe updates its `BuilderContext` state
  4. The affected component re-renders in place (no page navigation, no layout shift for other components)
- This requires the frontend page to have a `?editing=true` mode that wraps all components in a `BuilderContext.Provider` and listens for postMessages

**Editing Chrome Injection (Frontend Side):**
The Next.js frontend pages need to detect `?editing=true` and:
1. Add `data-component-id`, `data-component-type`, `data-zone` attributes to each component wrapper
2. On hover: send `COMPONENT_HOVERED` postMessage
3. On click: send `COMPONENT_CLICKED` postMessage with `componentId` + bounding rect
4. Listen for `HIGHLIGHT_COMPONENT` and apply a blue border via CSS class
5. Listen for `UPDATE_COMPONENT` and update the BuilderContext state

**Frontend files to modify:**
- Create `src/contexts/BuilderContext.tsx` — holds layout JSON, selected component, editing mode
- Create `src/components/BuilderEditingChrome.tsx` — wraps each component in edit mode with hover/click handlers + visual chrome
- Modify the page route's data fetch to pass `?editing=true` into the render tree
- Create `src/lib/builder-messages.ts` — typed message definitions (shared between admin and frontend)

**Admin files to modify:**
- `src/admin/views/PageBuilderClient.tsx` — wire mode toggle, handle `COMPONENT_CLICKED` messages to select components, send `UPDATE_COMPONENT` on Apply
- `src/admin/components/builder/BuilderCanvas.tsx` — add mode toggle to toolbar

**Validation:**
- Change a Rich Text component's content in InspectorPanel → click Apply → canvas updates without iframe reload
- Click Edit→Preview mode → chrome disappears
- Click Preview→Edit mode → chrome reappears

**Output:** Live WYSIWYG canvas with mode toggle and prop-level updates.

---

### 4.2 Native Field Editing Level 2 — Key-Fields Card
**What:** When a component is selected in the canvas, show a small floating "key fields" card directly over the component (in the canvas, not in the side panel). This card shows the 2-3 most important props for quick editing without opening the full InspectorPanel.

**Spec:**

**Key Fields Definition:**
Each component in the registry gets an optional `keyFields: string[]` property listing which fields to surface in the card. Examples:
- `rich-text`: `['content']`
- `heading`: `['text', 'level']`
- `card-grid`: `['columns']`
- `hero-banner`: `['heading', 'subheading']`
- `news-card-widget`: `['headline', 'limit']`
- Any component without `keyFields` defined: shows nothing (falls back to InspectorPanel only)

**Card Behavior:**
- A small card (~280px wide) appears floating above the selected component in the canvas (positioned using the `COMPONENT_CLICKED` rect from postMessage)
- The card is rendered in the admin React tree (NOT inside the iframe) — it's an overlay positioned relative to the canvas container using `position: absolute` and the received bounding rect
- Card shows: component type label + 2-3 key fields as minimal inline inputs
- Each field renders based on its type:
  - `text/textarea`: `<input>` or `<textarea>`
  - `select`: `<select>`
  - `number`: `<input type="number">`
  - `richtext`: NOT shown in key-fields card (too complex — show "Open Full Editor →" link instead)
- Typing in the card sends `UPDATE_COMPONENT` to the iframe in real-time (debounced 300ms) — live preview updates as you type
- Card has a "More fields →" link that opens the full InspectorPanel
- Card has an "×" close button
- Card must not cover the component — position it above or below, with smart flip if near viewport edge
- `data-testid="key-fields-card"`, `data-testid="key-field-{fieldName}"`

**Animation:**
- Card slides in from top (or bottom) with a spring animation (~150ms)
- Card fades out on close/deselect

**Files to create/modify:**
- `src/admin/components/builder/KeyFieldsCard.tsx` — the floating card component
- Update `src/admin/components/builder/registry.ts` — add `keyFields` to relevant component registrations
- Update `src/admin/views/PageBuilderClient.tsx` — show KeyFieldsCard when component is selected via canvas click; position using bounding rect

**Storybook stories:**
- `KeyFieldsCard.stories.tsx` — WithTextField + WithSelectField + WithNumberField + WithRichtextFallback + AboveComponent + BelowComponent (smart positioning)

**Playwright E2E:**
- Click a Heading component in canvas → KeyFieldsCard appears above/below the component
- Type in the "Text" field → canvas heading updates in real-time (debounced)
- Click "More fields →" → InspectorPanel opens

---

### 4.3 Native Field Editing Level 3 — Payload UI Components
**What:** Replace the custom field renderers in the InspectorPanel with Payload's own `@payloadcms/ui` field components. This means the same field UI used in Payload's default collection edit views is used inside the page builder's component editor.

**Why this matters:** Payload's field components handle validation, error display, relationship pickers, media pickers, and Lexical rich text — all for free. Custom renderers need to re-implement all of this.

**Spec:**

**Payload UI Field Components:**
Payload exports field components from `@payloadcms/ui`:
```typescript
import {
  TextField,
  TextareaField,
  SelectField,
  NumberField,
  CheckboxField,
  RelationshipField,
  UploadField,
  RichTextField,
  ArrayField,
} from '@payloadcms/ui'
```
Each component requires a Payload `ClientField` config + `FormStateContext`. The page builder must provide this context.

**Implementation:**
1. Create `src/admin/components/builder/PayloadFieldContext.tsx` — a context provider that wraps the InspectorPanel and provides the minimal Payload form context needed for `@payloadcms/ui` components
2. Update `src/admin/components/builder/PropsFormFields.tsx` (the file that renders props schema fields) to use Payload UI components instead of custom `<input>` / `<select>` elements:
   - `{ type: 'text' }` → `<TextField />`
   - `{ type: 'textarea' }` → `<TextareaField />`
   - `{ type: 'select' }` → `<SelectField />`
   - `{ type: 'number' }` → `<NumberField />`
   - `{ type: 'checkbox' }` → `<CheckboxField />`
   - `{ type: 'relationship' }` → `<RelationshipField />`
   - `{ type: 'media' }` → `<UploadField />`
   - `{ type: 'richtext' }` → `<RichTextField />` (Lexical)
   - `{ type: 'array' }` → `<ArrayField />`
3. The Apply button reads values from the Payload form state context (not from local React state)
4. Validation errors from Payload field components appear inline (same as in the standard edit view)
5. Relationship pickers open the media/document browser (uses existing MediaPickerModal)

**Important:** Consult `~/.claude/skills/payload-super/reference/ADVANCED.md` for the correct way to mount Payload UI field components outside the standard edit view. This is the most technically complex part of this task — check if the approach is feasible and document any limitations.

**Fallback:** If `@payloadcms/ui` field components cannot be mounted in this context without the full Payload edit view tree, document why and keep the custom renderers for affected field types. Focus effort on the highest-value fields: richtext (Lexical), relationship, and upload.

**Files to create/modify:**
- `src/admin/components/builder/PayloadFieldContext.tsx` — form context provider
- `src/admin/components/builder/PropsFormFields.tsx` — updated to use Payload UI components
- `src/admin/components/builder/InspectorPanel.tsx` — wrap with `PayloadFieldContext.Provider`

**Storybook stories:**
- `PropsFormFields.stories.tsx` — AllFieldTypes (one story showing each field type from a sample schema)

**Playwright E2E:**
- Open InspectorPanel for a component with a richtext field → Lexical editor renders
- Open InspectorPanel for a component with a relationship field → relationship picker opens on click
- Change a value, Apply → canvas updates

---

### 4.4 /cms Standalone Admin Shell
**What:** Create a `/cms` route that provides a minimal, distraction-free editing shell — separate from the full Payload admin at `/admin`. This is the primary interface for content authors who don't need the full Payload power.

**Design goals:**
- Focused on content editing + page building — no collection management, no system settings
- Faster to load than the full Payload admin (no heavy Payload admin JS where not needed)
- Mobile-accessible (at least functional at tablet width)
- Can be white-labeled (uses `BRAND.*` constants from `src/lib/brand.ts`)

**Spec:**

**Route Structure:**
```
/cms                    → Redirects to /cms/dashboard
/cms/dashboard          → Dashboard (same 4 widgets as /admin dashboard)
/cms/tree               → Content Tree
/cms/workbox            → Workbox
/cms/builder/:id        → Page Builder
/cms/media              → Media Library
/cms/schedule           → Publishing Schedule (from Layer 3)
/cms/labels             → Dictionary / Labels Manager (from Layer 3)
```

**Shell Layout:**
```
+------ TOP BAR (64px) ------+
| [RAS Canada CMS logo]       |  [Username] [Bell] [Sign Out]  |
+----+------- MAIN AREA ------+
     |                        |
     | LEFT NAV (240px)       |   CONTENT AREA
     |                        |   (router outlet — one of the
     | Dashboard              |   views above renders here)
     | Content Tree           |
     | Workbox        (5)     |
     | ---                    |
     | Media                  |
     | Schedule               |
     | Labels                 |
     | ---                    |
     | ⚙ Settings (Admin)     |
     |                        |
+----+------------------------+
```

**Implementation:**
- New Next.js route group: `src/app/(cms)/layout.tsx` — the shell layout (top bar + left nav + content outlet)
- The views mounted under `/cms` are the SAME components as under `/admin` — reuse `WorkboxClient`, `ContentTreeClient`, `MediaLibraryClient`, `PageBuilderClient`, etc. Do NOT duplicate them.
- The shell is a thin layout wrapper that provides navigation chrome
- Auth check: same as `/admin` — redirect to `/admin/login` if not authenticated
- The `/cms` shell uses Payload's auth API to check the session (same JWT)
- Left nav collapses to icons at `<768px` (tablet) with icon+tooltip
- Brand logo: `BRAND.adminTitle` from `src/lib/brand.ts`
- Notification bell: same `NotificationBell` component from Layer 3

**Technical approach:**
- `/cms` is a separate Next.js route group — it does NOT use Payload's admin provider or Payload's component system
- Components rendered under `/cms` that currently use Payload's admin context (e.g., `@payloadcms/ui` fields) will need the `PayloadFieldContext` provider from task 4.3
- Use `next/navigation` `usePathname` + `useRouter` for client-side navigation within the shell
- Protect with middleware: `src/middleware.ts` should check auth for `/(cms)/**` paths

**Files to create:**
- `src/app/(cms)/layout.tsx` — shell layout
- `src/app/(cms)/dashboard/page.tsx` — wrapper for Dashboard view
- `src/app/(cms)/tree/page.tsx` — wrapper for ContentTree view
- `src/app/(cms)/workbox/page.tsx` — wrapper for Workbox view
- `src/app/(cms)/builder/[id]/page.tsx` — wrapper for PageBuilder view
- `src/app/(cms)/media/page.tsx` — wrapper for MediaLibrary view
- `src/app/(cms)/schedule/page.tsx` — wrapper for ScheduleView
- `src/app/(cms)/labels/page.tsx` — wrapper for LabelsView
- `src/admin/components/CmsNavigation.tsx` — left nav component (reuse logic from CustomNav but CMS-styled)
- `src/admin/components/CmsTopBar.tsx` — top bar with logo, user, bell, sign out

**Storybook stories:**
- `CmsNavigation.stories.tsx` — Default + Collapsed + WithNotifications
- `CmsTopBar.stories.tsx` — Default + WithUser + WithBadge

**Playwright E2E:**
- Navigate to `/cms` → redirects to `/cms/dashboard`
- Unauthenticated visit to `/cms/workbox` → redirects to login
- Click "Content Tree" in left nav → navigates to `/cms/tree`
- Left nav collapses at 768px viewport width

---

## Validation Gates (Layer 4 is complete when ALL of these pass)

```bash
# TypeScript clean
npx tsc --noEmit

# Production build
npm run build

# Tests passing
npx vitest run

# Storybook builds
npx storybook build --quiet

# E2E tests
npx playwright test --grep "wysiwyg|key-fields|payload-fields|cms-shell"

# /cms route accessible
curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/cms/dashboard
# Expected: 200 (authenticated) or 302 (redirect to login if not authenticated)
```

---

## Gate Points

Task 4.1 (Live WYSIWYG Preview) requires human review before proceeding to 4.2. After 4.1 is marked `[x]`, output:
```
GATE: Live WYSIWYG Preview complete. Human review required before native field editing begins.
Awaiting approval to proceed to task 4.2.
```
Then wait for instructions before continuing.

Task 4.4 (/cms shell) requires human review after completion. After 4.4 is marked `[x]`, output the stop condition and await approval.

---

## Workflow

1. Read MASTER_TODO.md → find the "Layer 4" section → read all task entries
2. If Layer 4 section doesn't exist yet, ADD IT with tasks 4.1–4.4 as `[ ]` items
3. Work through tasks IN ORDER (4.1 → 4.2 → 4.3 → 4.4) — do NOT skip ahead
4. After 4.1: mark `[x]`, commit, output gate message, STOP until approved
5. After approval: continue with 4.2 → 4.3 → 4.4

---

## Stop Condition

When ALL 4 tasks are `[x]` AND all validation gates pass:

1. Update `.ai-reports/AUDIT_LOG.md` (date, Type: BUILD, Layer 4, tasks, files, deviations)
2. Create summary commit: `feat(layer-4): big builds — all tasks complete`
3. Output EXACTLY:
```
<promise>LAYER 4 COMPLETE</promise>
```

---

## EXIT PROTOCOL (MANDATORY)

### Per-Task Completion
A task is DONE when ALL of these pass:
1. Feature works end-to-end in browser
2. Unit tests pass (where specified)
3. Storybook stories compile
4. Playwright E2E passes
5. `npx tsc --noEmit` passes
6. Task updated to `[x]` in MASTER_TODO.md
7. Git commit created: `feat(layer-4): task 4.N — [short description]`

### Per-Task Failure (3-strike rule)
1. First attempt: diagnose, fix, re-validate
2. Second attempt: alternative approach, re-validate
3. Third attempt: mark `[!]` with reason — for Layer 4, document the limitation clearly and move to next task

### HARD STOPS
Output `<promise>LAYER 4 ABORTED: [reason]</promise>` if:
- Dev server won't start after 3 fix attempts
- postMessage bridge cannot be established (fundamental architecture failure)
- Payload UI components cannot be mounted outside the Payload admin tree after 3 approaches
- More than 5 structural TypeScript errors
- You detect you're in an infinite loop

### What NOT To Do
- Do NOT output `<promise>` until ALL tasks are verified
- Do NOT start 4.2 before 4.1 is complete and gate is cleared
- Do NOT skip the gate output after task 4.1
- Do NOT modify `.env` — only `.env.example`
- Do NOT run `git push`
