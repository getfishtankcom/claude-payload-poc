# Layer 5 — Task 5.1: UI / WCAG 2.2 AA / Performance Audit

> Auto-generated audit pass over the admin platform built in Layers 0–4.
> Scope: admin views, shared components, and the public /cms shell.

## Summary

| Area | Status | Notes |
|---|---|---|
| WCAG 2.2 AA | **Most-pass / 4 gaps** | Color contrast, focus visibility, target size, dragging |
| Core Web Vitals | **Untested** | LCP / INP / CLS need measurement against a built deploy |
| Component visual quality | **Pass with notes** | Inline styles dominate — Tailwind migration recommended |
| Keyboard navigation | **Mostly-pass / 2 gaps** | Custom tree DnD + cmdk palette need real-key audit |
| Storybook coverage | **Pass** | All Layer-0/1/2 utilities have co-located `.stories.tsx` |

## WCAG 2.2 AA gaps to fix before launch

1. **2.4.11 Focus Appearance (AA)** — Several admin buttons rely on browser-default focus rings that may not meet the 2px / 3:1 contrast minimum on `var(--theme-elevation-100)` backgrounds. Add an explicit `:focus-visible` outline rule to:
   - `BoardFilterBar` pills
   - `InlineButton` / `BulkActionButton` (`src/admin/components/ui/ActionButton.tsx`)
   - `ModalButton` ghost variant — currently `border: 1px solid var(--theme-elevation-200)` only

2. **2.5.7 Dragging Movements (AA)** — The Content Tree DnD via `@dnd-kit` and the Page Builder canvas DnD currently have **no keyboard alternative**. Each draggable needs a complementary keyboard pathway:
   - Tree: a "Move to…" context-menu action (already exists for nodes — confirm coverage on every draggable surface)
   - Builder canvas: keyboard reorder (Up/Down arrows on a focused component) is missing

3. **2.5.8 Target Size Minimum (AA)** — Several inline buttons are below the 24×24 CSS-px floor:
   - `FavoriteButton` (default size 18px star, padding 4px → 26×26 — passes once padding is included, but verify)
   - `NotificationBell` close `×` icons in dropdown items (currently `font-size: 14px, padding 0 4px`) — likely fails
   - Tree gutter dots in `ContentTreeClient.tsx` (8px workflow dots inside 24px row — informational, not interactive — passes)

4. **1.4.11 Non-text Contrast** — Verify the orange flag `#F97316` used by `FrTranslationWarning` reaches 3:1 against admin background. On `var(--theme-elevation-0)` (white in light mode) it does; on dark theme it likely fails.

## Performance findings (static analysis — runtime untested)

- **`MediaLibraryClient.tsx` is still ~1334 lines** even after Layer 0 task 0.9. The state machine + dialog components aren't extracted yet. This is a re-render hot-spot; recommend completing the state-hook extraction.
- **`/api/admin/language-audit` issues 2 fetches per audited collection × 3 collections = 6 sequential round-trips.** Pull EN+FR docs in one find call with `locale: 'all'` if the Payload API supports it, or run all 6 in `Promise.all` (already partially done with `Promise.allSettled` per-collection).
- **`/api/preview` HTML is small (~3KB) and cache-friendly** — set explicit `Cache-Control: private, no-cache` to prevent stale builder previews.
- **Admin dashboard renders 5 widgets, each polling on its own cadence** — coordinate via TanStack Query `queryKey` re-use to avoid redundant network.

## Component visual quality notes

- Heavy use of inline styles in admin views. Recommended migration path:
  1. New components built with Tailwind utilities (already true for some).
  2. Convert inline-style modules incrementally as they're touched.
  3. Eventually deprecate the `style={{...}}` pattern in admin entirely.
- Admin shell uses Payload's `var(--theme-elevation-*)` ramp consistently — keep this.
- Brand purple `#601F5B` is duplicated as a literal in many admin components. Promote to a CSS variable on the admin layout.

## Keyboard navigation review

- **Cmd+K Command Palette** — relies on `cmdk` library; arrow-key navigation works but Tab into the palette behavior isn't tested.
- **Tree context menu** — opens at cursor; **no keyboard equivalent** to right-click. Add Shift+F10 or Menu-key handler.
- **Modal Overlay** — Escape close ✓, click-outside close ✓, focus restore on close NOT verified.
- **Workbox table** — checkboxes are native; bulk-action buttons are accessible.

## Recommended next actions

1. Add a global admin focus style to `src/app/(payload)/admin-tailwind.css` (one CSS rule fixes most of WCAG 2.4.11 in one pass).
2. Run an automated axe-core scan against a built admin shell once Postgres is available.
3. Tackle MediaLibraryClient state extraction (Layer 0 Task 0.9 follow-up) before this audit can definitively pass.
4. Add `aria-label` audit pass: every icon-only button.

## What was NOT audited

- Live runtime measurement of LCP/INP/CLS (requires running app + Postgres).
- Cross-browser smoke tests (Chrome only, by inspection).
- Screen-reader regression (NVDA/VoiceOver).

## Sign-off

This is a **scoping audit** suitable for prioritising remediation work. It is **not** a launch-ready certification. Proceed to Task 5.2 (security audit) and 5.3 (plugin scoping) before declaring the platform release-ready.
