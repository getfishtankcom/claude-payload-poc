# Phase 0 — Outcomes & Next Steps

> **Date:** 2026-05-01
> **Branch:** `feat/admin-platform-layer-0`
> **Companion docs:** `spike-admin-platform-layer-0.md` (decisions G1–G18), `PHASE_0_POC_TICKETS.md` (POC plan), `PRD-admin-panel.md` (PRD), `BUILD_PLAN.md` (Phase 1 epics)
> **Status:** Phase 0 architectural verification complete; runtime verification pending; Phase 1A clear to start

---

## 1. Phase 0 outcomes — what was proved

### 1.1 All 4 POCs passed static verification

| POC | Goal | Verdict |
|---|---|---|
| **POC-1** | Custom admin route shell with auth-gate | ✅ PASS — `/admin/tree` renders inside Payload admin chrome via `DefaultTemplate`; `payload.auth({ headers })` gates RSC; `nestedDocsPlugin` adds `parent` + `breadcrumbs` to Pages |
| **POC-2** | Content tree with DnD | ✅ PASS (inline) — `react-arborist@3.5.0` mounted; `GET /api/admin/tree` lazy-loads children; drag-reorder PATCHes `sortOrder`; drag-to-new-parent triggers nested-docs cascade. Same code structure the eventual `@fishtank/payload-plugin-content-tree` v0.1 will encapsulate — drop-in swap when v0.1 ships |
| **POC-3** | Puck builder + chrome ceiling | ✅ PASS — all 5 Required tests cleared. Puck inline + Payload Live Preview drawer alongside (R3 revised after verifying Puck's `IframeConfig` has no `src` option) |
| **POC-4** | Live Preview on a non-page collection | ✅ PASS — News collection + `/[locale]/news/[slug]` route reuses the same `RefreshRouteOnSave` mechanism. Pattern is now: any collection adds `admin.livePreview.url` + a corresponding Next.js page route — ~½ day per collection |

**No pivot triggered.** Puck commitment confirmed. dnd-kit fallback path remains documented but unused.

### 1.2 G10 Required tests — all 5 passed

| # | Test | How verified |
|---|---|---|
| **R1** | Replace Puck's default toolbar via `overrides` | `overrides.header` + `overrides.headerActions` set to empty fragments; custom `<FRASActionBar>` rendered above Puck. TypeScript types check against Puck's `RenderFunc<{actions, children}>` |
| **R2** | Custom Puck field types with Payload integration | `LocalizedText` field implemented (EN/FR tabbed editor + `pickLocalizedText` resolver). `payloadRelationship` + `payloadFilter` deferred to Epic 25.7 (CustomField pattern proven via LocalizedText) |
| **R3** | Real Next.js page route iframed alongside Puck (revised) | Live Preview drawer iframes `/[locale]/[slug]?draft=true&_edit=1`; the page route uses `<Render>` from `@measured/puck/rsc` for SSR + `<LivePreviewListener>` for `postMessage` → `router.refresh()` |
| **R4** | Read-only mode when locked by another | RSC computes `lockedByOther` from 60s freshness window; client gates Puck via `permissions={{ delete: !readOnly, drag: !readOnly, ... }}`; FRASActionBar disables Submit/Publish |
| **R5** | 5s debounced autosave, no per-save versions | `versions.drafts.autosave.interval: 5000` on Pages; client debounces `Puck.onChange` via `setTimeout(..., 5000)`; PATCHes with `?autosave=true` |

### 1.3 R3 architecture revision (locked into spike + tickets + Ralph prompts)

Original R3 assumed `<Puck iframe={{ src: '...' }}>`. Verified directly against Puck 0.20.2 type definitions: **no `src` prop exists** in `IframeConfig`. Puck's iframe is a CSS sandbox for its own internal preview only.

Working pattern adopted:
- **Puck inline** (`iframe.enabled: false`) on the left/center as the editor surface
- **Payload Live Preview drawer** on the right (via `@payloadcms/live-preview-react`) loads the real Next.js page route
- Same `postMessage` → `router.refresh()` mechanism the Payload website template uses on Pages
- One mechanism shared across pages and non-pages

### 1.4 Design-system primitives wired into the WYSIWYG

Initial puckConfig used inline-styled stub components. Now replaced with real primitives from `src/components/ui/`:

| Puck component | Real primitives used |
|---|---|
| Heading | Tailwind text scale + `--color-primary` token; eyebrow variant uses brand purple |
| RichText | `text-base leading-relaxed text-text-primary` |
| CTAButton | Full polymorphic `<Button>` — 4 variants × 3 sizes |
| ContentBadge | All 9 `<Badge>` content-type variants |
| FeatureCard | `<Card>` + `<Card.Body>` + `<Card.Footer>` + `<Stack>` + `<Button>` |
| Section | `<Container>` wrapping a Puck `slot` DropZone (drop other components inside) |
| CardGrid | Manual-mode 2/3/4-column grid of `<Card>` cells with inline configurable cards |

Tailwind v4 + design tokens loaded into the Puck editor surface via `import '@/app/(frontend)/globals.css'` in `PageBuilderClient.tsx` — scoped to `/admin/builder/:id` route only.

### 1.5 Storybook 10 catalog

`@storybook/nextjs-vite` framework with addon-docs + addon-themes; design tokens loaded via `.storybook/preview.ts`. Stories exist for:

- All 6 `src/components/ui/` primitives (Button, Badge, Card, Container, Stack, Input)
- Full Puck-components catalog at `src/admin/builder/PuckComponents.stories.tsx` — every registered Puck component rendered through `<Render>` from `@measured/puck/rsc`

Run with `npm run storybook` (port 6006). Builds clean via `npm run build-storybook`.

---

## 2. What's still pending

### 2.1 Runtime verification (needs DB + login + seeded data)

| Surface | Verify |
|---|---|
| `/admin/tree` | Anonymous → login redirect; sidebar nav link visible; list shows seeded pages |
| Drag-reorder | `sortOrder` updates; lock badge appears for second user editing same page |
| Drag-to-new-parent | nested-docs cascades breadcrumbs on all descendants |
| `/admin/builder/:id` | Real shell visible in Live Preview drawer; Puck's default toolbar hidden; `<FRASActionBar>` rendered |
| Save loop | Drag a Heading; draft saves at 5s; reloading sees same JSON; version count doesn't grow per autosave |
| Two-user lock | Second user opens same builder → loads in read-only mode with "Locked by X" banner |
| LocalizedText | EN/FR tabs swap text without bleeding values; `pickLocalizedText` resolves correctly |
| Live Preview drawer | Drawer iframe shows real SSR'd page; `router.refresh()` fires within ~1s of save |
| News collection | Same Live Preview drawer pattern works on a non-page collection |

### 2.2 Plugin extraction (parallel worktree)

The content tree code in `src/admin/views/ContentTreeClient.tsx` + `src/app/(payload)/api/admin/tree/route.ts` is a candidate for lifting into `@fishtank/payload-plugin-content-tree`. The plugin spike lives in the `merry-scribbling-hejlsberg` worktree; v0.1 has not been tagged. When it ships, swap the inline tree for the plugin import — same data shape, same endpoint contract, drop-in.

### 2.3 Operational items (G11–G13 deferred decisions)

| # | Topic | Status |
|---|---|---|
| G11 | Quick Publish UX | Locked default; UI not yet built (Epic 22) |
| G12 | Translation × branch model | Locked default; staleness hint UI not yet built (Epic 22) |
| G13 | Designer review | Optional; not a blocker |

---

## 3. Next steps — sequencing

### 3.1 Immediate (this session or next, before Phase 1A)

1. **Set up `.env`** with `DATABASE_URI` + `PAYLOAD_SECRET`. (Per CLAUDE.md rule, user does this manually.)
2. **Run `npm run dev`** and walk through the runtime verification checklist (§2.1). Capture any breakage.
3. **Commit Phase 0 in logical units** — suggested split:
   - `feat(poc-1): custom admin route shell + nested-docs plugin`
   - `feat(poc-3): puck builder + payload live preview drawer`
   - `feat(poc-2): inline content tree (react-arborist)`
   - `feat(poc-4): live preview on news collection`
   - `chore(storybook): install storybook 10 + primitive stories`
   - `feat(builder): wire section + cardgrid puck components`
4. **Push branch + open PR** for Phase 0 review.

### 3.2 Short-term (Phase 1A kickoff — Epic 22 Admin Foundation)

Epic 22 is the next Ralph loop. Its updated prompt (`.ai-reports/ralph-prompts/epic-22-admin-foundation.md`) bakes in G1, G6, G8, G9, G11, G14, G15, G16, G18. Tasks in priority order:

| Order | Task | Why first |
|---|---|---|
| 22.1 | Custom sidebar nav | Foundation — every other admin route depends on it |
| 22.3 | Workflow state field + transitions | Backbone of the 5-state model; FRASActionBar wires to these endpoints |
| 22.8 | Role-based access control | Gates everything else; needed before publish/approve flows mean anything |
| 22.4 | Workflow action bar (real backend wires) | Connects POC-3 stub action bar to real workflow + email notifications |
| 22.5 | Item locking system (real backend) | POC-3 stubbed heartbeat; Epic 22 wires admin force-unlock + read-only field-editor view |
| 22.2 | Custom dashboard | Editor's landing page — workflow queue + recent items |
| 22.6 | Language switcher | EN/FR field editor toggle; Puck builder already has a locale switcher in FRASActionBar |
| 22.7 | Scheduled publishing cron | Background job; can come last |

Epic 22 estimated ~10 working days.

### 3.3 Mid-term (Phase 1A continues)

After Epic 22 (gate):

| Order | Epic | Notes |
|---|---|---|
| 1 | Epic 1 (CMS Collections) | Required before pages have real fields. Bumps Pages collection from POC-3's minimum schema to PRD §6.2 full field set; adds projects, news, events, contacts, documents, board-members, consultations, standards-sections. Each gets `livePreview.url` per the POC-4 pattern. |
| 2 | Epic 2 (Shared Layout Components) | Replaces the stub `<Header>` + `<Footer>` in `src/app/(frontend)/[locale]/[slug]/page.tsx` with the real `<SiteHeader>` + `<SiteFooter>` from PRD §10. |
| 3 | Epic 23 (Content Tree, full) | Pick up tree plugin v0.1 if shipped, OR continue extending the inline tree. Add right-click context menu, search, gutter dual-state for branch model (G9). |
| 4 | Epic 24 (Media Library) | Folder-based media browser; required for `payloadRelationship` field's media picker (Epic 25.7). |
| 5 | Epics 25 + 26 (Page Builder full) | Expand Puck registry from 7 components to all 31 from PRD §6.2. Add `payloadRelationship` + `payloadFilter` custom fields (G7). Wire data-driven widgets (Project List, News Feed, Contact Card, etc.). Build the 3 builder-eligible templates: Homepage, Board Detail, Project Detail. |
| 6 | Epic 27 (Workbox) | Workflow management dashboard; depends on Epic 22 workflow state. |
| 7 | Epics 4 + 5 + 6–9 + 10 | Public-site epics — homepage, search, board pages, listings. |

### 3.4 Long-term (Phase 2)

Phase 2 (epics 11–21) is unaffected by Phase 0 decisions. Reference `BUILD_PLAN-phase2.md` and `MASTER_TODO.md` for the 73 Phase 2 tasks.

---

## 4. Decisions still pending

| # | Decision | When needed | Recommendation |
|---|---|---|---|
| D-A | Plugin extraction timing | Before Epic 23 starts | If `@fishtank/payload-plugin-content-tree` v0.1 has shipped, swap inline tree for plugin. If not, continue extending inline. |
| D-B | Real `<SiteHeader>` + `<SiteFooter>` ready by Epic 25 | Epic 25 task 25.5 | Epic 2 (layout components) should land before page builder Puck configs depend on real shell components. Sequence Epic 2 between Epic 22 and Epic 25. |
| D-C | Production deployment env | Before any beta | Vercel + Neon (or Supabase / Railway) per `BUILD_PLAN.md` 0.3. Provision early so CI/CD lands before Phase 1A epics ship. |
| D-D | Aptify auth integration approach | Before Epic 17 (auth gate) | Direct DB API per CLAUDE.md ("NOT OAuth/SAML"). Spike during Phase 1A; not a Phase 0 item. |
| D-E | Email transport for workflow notifications | Before Epic 22.3 | Payload's email adapter (Nodemailer) per PRD §7.7. Production transport: SendGrid / Resend / SES — pick during Epic 22.3. |

---

## 5. Risks for Phase 1A

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Puck component count grows the admin bundle past 1MB | High | Medium | Monitor; lazy-load FRASActionBar + PuckComponents catalog if bundle hits 1MB. Code-split per template if needed. |
| `.env` setup blocker — missing DB or secrets | Medium | High | Document setup in `README.md`; ensure local Postgres works with the Drizzle adapter on macOS without manual schema migration |
| Tailwind v4 + Storybook + Next.js + React 19 stack drift | Medium | Medium | Pin major versions in `package.json`; don't auto-upgrade unless tested |
| nested-docs plugin breaks on >1000 children | Low | High | POC-2 success criteria already includes lazy-load on expand; bucketing pattern (PRD §4.4) handles 100+ siblings |
| Drift between Puck config and Storybook catalog | Medium | Medium | Add a CI check in Phase 1A: every Puck component in `puckConfig.ts` must have a story in `PuckComponents.stories.tsx` |
| Live Preview drawer iframe doesn't refresh fast enough on slow connections | Low | Low | Already 5s debounce + ~1s SSR round-trip = ~6s total; acceptable. If slower in production, tune autosave interval down. |

---

## 6. Files to commit (current branch state)

### NEW (Phase 0)

```
.storybook/main.ts
.storybook/preview.ts

src/admin/builder/FRASActionBar.tsx
src/admin/builder/PuckComponents.stories.tsx
src/admin/builder/fields/LocalizedText.tsx
src/admin/builder/puckConfig.tsx

src/admin/components/TreeNavLink.tsx

src/admin/views/ContentTree.tsx
src/admin/views/ContentTreeClient.tsx
src/admin/views/PageBuilder.tsx
src/admin/views/PageBuilderClient.tsx

src/app/(frontend)/[locale]/[slug]/page.tsx
src/app/(frontend)/[locale]/news/[slug]/page.tsx
src/app/(payload)/api/admin/tree/route.ts
src/app/(payload)/api/pages/[id]/heartbeat/route.ts

src/collections/News.ts
src/collections/Pages.ts

src/components/LivePreviewListener.tsx

src/components/ui/Badge.stories.tsx
src/components/ui/Button.stories.tsx
src/components/ui/Card.stories.tsx
src/components/ui/Container.stories.tsx
src/components/ui/Input.stories.tsx
src/components/ui/Stack.stories.tsx

public/.gitkeep

.ai-reports/PHASE_0_OUTCOMES_AND_NEXT_STEPS.md  ← this file
.ai-reports/PHASE_0_POC_TICKETS.md
.ai-reports/spike-admin-platform-layer-0.md
```

### MODIFIED

```
.gitignore                                  (storybook-static/)
package.json + package-lock.json            (4 new deps + 2 new scripts)
src/payload.config.ts                       (registered Pages, News, custom views, plugins, Live Preview breakpoints)

.ai-reports/AUDIT_LOG.md                    (Phase 0 entries)
.ai-reports/BUILD_PLAN.md                   (Phase 0 header)
.ai-reports/PRD-admin-panel.md              (superseded callout pointing at spike)
.ai-reports/ralph-prompts/README.md         (Phase 0 in execution order)
.ai-reports/ralph-prompts/epic-22-admin-foundation.md   (G-decisions PRECONDITION)
.ai-reports/ralph-prompts/epic-23-content-tree.md       (rewritten as plugin-consumption epic)
.ai-reports/ralph-prompts/epic-25-26-page-builder.md    (Puck + revised R3 architecture)
```

### AUTO-GENERATED (gitignored)

```
src/payload-types.ts
src/app/(payload)/admin/importMap.js
storybook-static/
```

---

## 7. Acceptance for Phase 0 done

Phase 0 is "done" when:

- [x] All 4 POCs pass static verification
- [x] G-decisions G1–G18 all locked in spike with implications + tasks
- [x] Ralph prompts for Epics 22, 23, 25–26 updated to reflect G-decisions
- [x] Phase 0 ready-to-build kit: tickets, build plan header, README order
- [x] Components in WYSIWYG render with real FRAS branding
- [x] Storybook installed with primitive + Puck-catalog stories
- [ ] Runtime verification on a real DB (USER ACTION)
- [ ] Phase 0 commits pushed; PR opened (USER ACTION)
- [ ] Project lead approves Phase 0 outcomes (USER ACTION)

After approval, run Ralph loop on `.ai-reports/ralph-prompts/epic-22-admin-foundation.md`.
