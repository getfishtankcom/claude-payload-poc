# Layer 5 — Task 5.3: Plugin Extraction Scoping

> Scoping document only. No code changes. Identifies parts of the admin
> platform that are reusable across Payload projects and could be packaged
> as standalone Payload plugins.

## Candidates by reuse potential

### High reuse (recommend extracting)

#### 1. `payload-plugin-workflow` — workflow state + history + transitions

**What:** The 6-state workflow (draft / in_review / needs_revision / approved / published / unpublished), `validateWorkflowTransition` beforeChange hook, role-based transition rules, history entry append, plus the `WorkflowActionBar` field component.

**Source files:**
- `src/admin/types/workflow.ts` (types + STATE_LABELS + STATE_COLORS + WORKFLOW_TRANSITIONS)
- `src/admin/hooks/workflow-hooks.ts`
- `src/admin/components/WorkflowActionBar.tsx`
- `src/admin/components/WorkflowActionBarField.tsx`
- `src/admin/components/WorkflowHistoryModal.tsx`

**Plugin shape:**
```ts
import { workflowPlugin } from 'payload-plugin-workflow'

plugins: [
  workflowPlugin({
    collections: ['pages', 'news', 'projects'],
    states: ['draft', 'in_review', 'approved', 'published'],
    notifyOnTransitions: true,
  }),
]
```

**Why extract:** Workflow is universally needed. The current implementation is project-agnostic — no FRAS/RAS-specific logic in the hooks themselves.

**Effort:** **Small** (2–3 days). Mostly file relocation + a `withFields` helper that injects the workflow fields into target collections.

---

#### 2. `payload-plugin-content-tree` — Sitecore-style tree view

**What:** Hierarchical content browser with DnD, lazy-loading, search, context menu, gutter indicators, lock state, FR translation warning.

**Source files:**
- `src/admin/views/ContentTree.tsx` + `ContentTreeClient.tsx`
- `src/admin/components/TreeContextMenu.tsx`
- `src/admin/components/TreeDndWrapper.tsx`
- `src/admin/types/tree.ts`
- `src/admin/config/insertOptions.ts`
- `src/app/api/tree/route.ts` + `tree/search/route.ts`

**Plugin shape:**
```ts
import { contentTreePlugin } from 'payload-plugin-content-tree'

plugins: [
  contentTreePlugin({
    parentField: 'parent',
    contentTypes: { folder: ['page', 'folder'], page: ['page'] },
  }),
]
```

**Why extract:** Sitecore-shaped admin UX is rare in Payload land and would attract usage. Adds significant value over the default Payload list.

**Effort:** **Medium** (1–2 weeks). Tree code has some FRAS-specific assumptions (insertOptions table is hard-coded for our content types) — needs config-ification.

---

#### 3. `payload-plugin-redirects` — 301 / 302 manager + middleware integration

**What:** Redirects collection + middleware adapter + 5-minute in-memory cache.

**Source files:**
- `src/collections/Redirects.ts`
- `src/lib/redirects.ts`

**Plugin shape:**
```ts
plugins: [redirectsPlugin({ collectionSlug: 'redirects', cacheTtlMs: 5 * 60_000 })]
```
Plus a Next.js middleware helper users can wire into their own middleware:
```ts
import { handleRedirect } from 'payload-plugin-redirects/middleware'
const redirect = await handleRedirect(req)
if (redirect) return redirect
```

**Why extract:** Tiny but high-value. Easy first plugin to publish.

**Effort:** **Small** (1–2 days).

### Medium reuse (extract later)

#### 4. `payload-plugin-language-audit` — translation completeness dashboard

**What:** /admin/language-audit view + API endpoint scoring per-collection translation status.

**Source files:**
- `src/admin/views/LanguageAuditView.tsx` + `LanguageAuditViewClient.tsx`
- `src/app/(payload)/api/admin/language-audit/route.ts`

**Why later:** Useful for any localized Payload project but the field-completeness heuristic is a bit project-specific (which fields count as "translated"). Needs a config callback.

#### 5. `payload-plugin-favorites` — pin-and-recall items across the admin

**What:** useFavorites hook + FavoriteButton + PinnedItemsWidget.

**Why later:** Trivial implementation, but the value-prop is small enough that bundling it alone is overkill. Could fold into a larger "admin productivity" plugin.

### Low reuse (don't extract)

- **Page Builder** — too coupled to FRAS template structure and 53-component registry. Keep in-tree.
- **Workbox** — relies on knowing FRAS's specific 12 collections + the workflow plugin. Becomes worth extracting AFTER `payload-plugin-workflow` exists.
- **Schedule view** — small enough that it's not worth a plugin boundary.
- **Notifications collection + bell** — could go into the workflow plugin's "extras" rather than ship standalone.

## Suggested order

1. **`payload-plugin-redirects`** — smallest, lowest risk, validates the extraction pipeline.
2. **`payload-plugin-workflow`** — highest value-per-effort. Foundation for further plugin work.
3. **`payload-plugin-content-tree`** — biggest UX differentiator; extract after workflow plugin is stable.

## Cross-cutting decisions to make first

- **Monorepo or separate repos?** — recommend a `packages/` workspace inside this repo while iterating; promote to standalone repos when the API stabilises.
- **Versioning** — pin to Payload 3.x major, follow Payload's semver.
- **Storybook** — bundle `*.stories.tsx` so consumers can preview.
- **Tests** — Vitest config used here is plugin-friendly; ship it.
- **License** — MIT recommended; matches Payload itself.

## Out of scope for this scoping doc

- Implementation of the plugin packages (separate effort).
- Migration story from in-tree implementation to plugin import (will require a parallel branch).
- Naming + npm-org coordination.
