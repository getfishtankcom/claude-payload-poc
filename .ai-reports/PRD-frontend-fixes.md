# PRD — Frontend Fixes (post-dogfood)

**Date:** 2026-05-02
**Status:** Decisions locked. Ready for Ralph loop.
**Source:** `dogfood-output/v2-admin-2026-05-02/report.md` (30-issue dogfood QA pass)
**Scope:** the 14 frontend issues filed as #76, #77, #78, #79, #80, #81, #82, #90, #91, #92, #94, #97, #98, #99
**Estimated effort:** ~3 weeks across 7 phases

---

## Problem Statement

The dogfood QA pass on the FRAS Canada PoC surfaced 30 issues. 16 are admin-side and slot into the existing Admin Shell v2 Ralph layers (layer-0 fix-ups, layer-2 migration sweep, layer-3 workflow wiring, layer-7 branded auth). The remaining 14 are public-frontend bugs that have no home in the admin campaign and won't be touched by it.

Two of those 14 are P0 — every visitor reading a project detail page sees the literal string `Rich text content will render here when Lexical serializer is configured.` (#79), and every contact form submission is a stub that returns a success banner without persisting anything (#97). Several others break basic navigation:

- News listings link to `/news/<slug>` URLs that 404 (#80)
- Document detail pages 404 even with valid slugs (#94)
- RSS feeds emit URLs that 404 for every subscriber (#90)
- Board detail page (`/en/acsb`) renders only the H1 + a viewport-tall empty band (#82)

Plus three i18n bugs of the same family (CNC on EN pages, RASOC leaking into FR sidebar, FR UI chrome untranslated) and a baseline accessibility deficit on the homepage (6 axe violations including duplicate `<main>`).

The fix is a focused 7-phase Ralph campaign that lands these as small, independently-mergeable PRs. Frontend doesn't need a full rewrite — each bug has a localized cause.

## Solution

Seven phases, each sized to be one or two Ralph-loop PRs. Phases run in dependency order — `routing` blocks `RSS` (since RSS link generation depends on the routes existing), and `lexical-render` is reused by both `phase-1-content-stops` and `phase-4-board-detail`. Otherwise phases are independent and can run in parallel.

| Phase | Issues | PRs | Why grouped |
|---|---|---|---|
| 1. Content stops (P0) | #79, #97, #98 | 3 | All three are visible-on-load to every visitor. Ship as fast as possible. |
| 2. Routing | #80, #94 | 2 | Same family — missing `[slug]` routes + slug resolver bugs. Build once, both fixed. |
| 3. RSS links | #90 | 1 | Depends on phase 2 (target routes must exist before generator can use them). |
| 4. Board detail body | #82 | 1 | Single broken page. After phase 1 the Lexical serializer is reusable here. |
| 5. i18n correctness | #77, #78, #81, #92 | 3 | All four trace back to locale-aware data lookup + next-intl messages dictionary. |
| 6. Search index | #76 | 1 | Isolated — Meilisearch reindex + verify the payload-meilisearch sync hook. |
| 7. A11y baseline | #99 | 2 | Homepage layout structural fix + heading audit. |
| Polish | #91 | 1 | Footer "Quick Links" duplicate header. Bundle with phase 7 if rooms allow. |

**Total:** 14 PRs / 7 phases.

## User Stories

1. As a visitor reading any active project, I want the project Summary to render the actual rich-text body, so that I'm not staring at debug placeholder copy.
2. As a visitor sending a contact-form message, I want my message to be persisted and a real confirmation to be visible, so that I know FRAS received it.
3. As a visitor reading any public page, I want the legal copyright in the footer to read the current organization name (`Reporting and Assurance Standards Canada`), so that the brand is consistent.
4. As a visitor browsing /en/news-listings, I want to click a headline and land on the article body, so that the listing isn't a dead end.
5. As an RSS subscriber, I want every feed item link to resolve to a working page, so that the feed is usable.
6. As a visitor reading /en/[board], I want the board page to show the board's about copy, recent news, current projects, and committee/member listings, so that the board landing page is informative.
7. As a French-speaking visitor, I want every UI string (page headings, filter labels, form placeholders, status badges) translated, so that I'm not reading mixed EN/FR copy.
8. As a French-speaking visitor browsing /fr/active-projects, I don't want RASOC in the boards filter, since RASOC is an oversight council and not a standards board.
9. As an English-speaking visitor reading any /en/[board]/* page, I want the breadcrumb to use the English board abbreviation (e.g. `AcSB` not `CNC`), so that breadcrumbs match the locale.
10. As a visitor searching the site, I want to find pages that match my query (instead of 0 results), so that search is useful.
11. As a screen-reader user, I want the homepage to expose exactly one `<main>` landmark and a clean heading order, so that I can navigate and skim the page.

## Implementation Decisions

### Architecture

- **No new routes in admin.** All work is under `src/app/(frontend)/[locale]/(frontend)/**` plus a few helpers in `src/lib/` and `src/components/`.
- **Lexical → HTML/JSX serializer is the keystone.** Phase 1 builds it once (likely via `@payloadcms/richtext-lexical/react`'s `RichText` component); phases 4 + 6 reuse it.
- **i18n bugs share a root cause:** the board record's English abbreviation either doesn't exist or isn't being read. Phase 5 fixes the lookup once and the four downstream pages clear together.
- **next-intl messages dictionary** is the second i18n surface. Add the missing FR strings; verify EN strings aren't being skipped via fallback path.
- **No data migrations.** The seed data is fine; bugs are in render code + route files + middleware.
- **No API rewrites.** RSS and Meilisearch fixes are cleanups, not redesigns.

### Phase 1 — Critical content stops (P0)

**1.1 Lexical → JSX serializer (#79)**
Wire `@payloadcms/richtext-lexical/react`'s `RichText` (or build a tiny custom serializer that walks Lexical JSON and emits JSX) into the project detail Summary slot. Replace the placeholder string. Same component will be reused in phase 4 for Board detail body.

**1.2 Contact form action (#97)**
Replace the stub `[FRAS] Submit for Review (stub)` action with a real Server Action that writes to the `FormSubmissions` collection. Surface real success/error state. Keep the success copy but make it appear only after a real persistence ack.

**1.3 Footer copyright (#98)**
Find the hardcoded `Financial Reporting & Assurance Standards Canada` string in the footer copyright. Replace with `BRAND.fullName` from `src/config/brand.ts`. Also update the `© 2026` year-rendering to use the current year if it's hardcoded.

### Phase 2 — Routing

**2.1 News detail route (#80)**
Add `src/app/(frontend)/[locale]/(frontend)/news/[slug]/page.tsx`. Read `slug` param, lookup `News` collection by `slug` field, render. If not found, `notFound()`. Reuses the Lexical serializer from phase 1.

**2.2 Document detail slug resolver (#94)**
Route file already exists at `(frontend)/[locale]/(frontend)/[board]/documents/[docSlug]/page.tsx`. Diagnose why the lookup returns 404 — likely a slug mismatch between what the listing links to (`ed-crypto-assets-dfc`) and what the collection stores (potentially under a different field like `path` or with locale suffix). Fix the lookup query.

### Phase 3 — RSS link generation

**3.1 RSS link generator (#90)**
Update `src/app/api/rss/route.ts` and `src/app/api/rss/[board]/route.ts` to:
- Prepend `/<locale>/` to each `<link>` (default `en`)
- Generate URLs against the routes that now exist (post phase 2): `/en/news/<slug>`, `/en/<board>/documents/<docSlug>`, `/en/<board>/meetings-and-events/<slug>`. **Note:** `/en/<board>/meetings-and-events/<slug>` doesn't exist yet — either add the route in this phase or change RSS to link to the listings (e.g. `/en/<board>/meetings-and-events`) until that detail page lands.

### Phase 4 — Board detail body

**4.1 Board detail page (#82)**
`/en/acsb` currently renders only the H1. Find the board template page (likely `(frontend)/[locale]/(frontend)/[board]/page.tsx`) and wire in:
- About copy (board.about field, rendered via the phase-1 Lexical serializer)
- Recent news (top 5 from News filtered by board)
- Current projects (top 5 from Projects filtered by board, status=active)
- Committee/member listings link
- Quick actions sidebar (already shipped per the project detail page)

Also fix the breadcrumb capitalization — `Acsb` → `AcSB` (see phase 5 i18n fix; same data path).

### Phase 5 — i18n correctness

**5.1 Board abbreviation locale lookup (#81 + #92)**
EN pages render `CNC` (FR abbreviation) in breadcrumbs and sidebars. Trace the data path: `boards` collection → `abbreviation` field → is it localized? If yes, the renderer is reading the wrong locale. If no, the boards have an FR-only `abbreviation` and need EN values added. Fix once; both #81 and #92 clear together.

**5.2 RASOC exclusion at the data layer (#78)**
EN view excludes RASOC from the boards filter; FR view leaks it. Find the boards loader for the Active Projects sidebar and apply the RASOC exclusion at the data layer (not in a per-locale filter). Single fix; locale-agnostic.

**5.3 next-intl FR messages (#77)**
Audit the next-intl messages dictionary for the FR locale. Fill in missing keys for: page H1s, sidebar labels (`BOARDS`, `STANDARDS`, `QUICK LINKS`), filter chips (`All Boards`, `All Standards`), input placeholders (`Filter projects by name…`), status badges (`PUBLIC COMMENT`, `EXPOSURE DRAFT`, etc.). Add a unit test that asserts every key in the EN messages file has a matching FR key.

### Phase 6 — Search index

**6.1 Meilisearch index repair (#76)**
Verify `payload-meilisearch` plugin is configured + running. Trigger a full reindex via the admin or a one-time script. Confirm a query for `board` returns >0 results. Add a healthcheck endpoint that exposes index doc count for monitoring.

### Phase 7 — A11y baseline

**7.1 Single `<main>` landmark + landmark hygiene (#99)**
Audit the homepage layout (`(frontend)/[locale]/(frontend)/page.tsx` + `(frontend)/[locale]/(frontend)/layout.tsx`). Find the duplicate `<main>` and the nested `<main>`-in-landmark. Pick one canonical `<main>` location (probably the layout, not the page). Wrap orphan content in semantic landmarks (`<aside>`, `<section aria-labelledby="...">`).

**7.2 Heading order + empty headings (#99)**
Walk the rendered DOM and find:
- The 4 empty `<hN>` tags — likely placeholder rendering artifacts; remove them
- The heading-level skip — likely a section that uses `<h3>` directly without an `<h2>` above it; restructure

Add an axe-core e2e test that fails the build if homepage violations regress.

**7.3 Footer "Quick Links" deduplication (#91)** *(bundled with phase 7)*
Rename the second `Quick Links` column heading. Probably `Legal` (Privacy / Terms / Accessibility / Sitemap) or `Resources`.

## Testing Decisions

### What makes a good test here

Each PR should land with one of three test types:

1. **Regression unit test (Vitest)** for any data-layer fix (i18n lookups, RASOC exclusion, slug resolvers).
2. **Playwright e2e** for any flow fix (contact form persists, news listing → detail navigation, RSS link round-trip).
3. **axe-core scan in CI** for a11y fixes.

### Modules to be unit-tested

1. **Lexical → JSX serializer** (Phase 1.1) — rendering with valid Lexical JSON, empty document fallback, unknown node type fallback.
2. **Board abbreviation locale lookup helper** (Phase 5.1) — returns EN abbrev for /en, FR abbrev for /fr, falls back gracefully when a locale field is missing.
3. **RSS link generator** (Phase 3.1) — generates correctly-prefixed URLs for news / documents / meetings.
4. **next-intl messages parity test** (Phase 5.3) — every EN key has a matching FR key.

### Modules covered by Playwright e2e (no unit tests)

- Contact form end-to-end (submit → toast → DB write verified via API call)
- News listings → detail navigation
- Board detail body has all five sections rendered
- Search results page returns >0 results for `board`
- Homepage axe-core scan returns 0 violations

### Acceptance gates (per phase + final)

- **Per PR:** unit tests passing, axe-core 0 violations on the affected page, Lighthouse perf+a11y ≥ 90.
- **Final gate:** the dogfood report's reproduction steps for each of the 14 issues no longer reproduce. Re-run the axe-core scan against /en, /en/active-projects, /en/news-listings, /en/[board], /en/[board]/about/members; expect 0 violations on every page.

## Out of Scope

- **Admin platform issues.** The 16 admin-side issues from the same dogfood pass have their own homes in the Admin Shell v2 layers (#71-72, 75, 84-87, 95-96, 100 → layer-2; 73-74 → layer-0 fix-ups; 83 → layer-3; 88-89 → layer-7; 93 → housekeeping).
- **New frontend features.** Hero search variant, Listing Config builder, mobile-specific layouts — all separate work.
- **Performance tuning beyond Lighthouse-passing.** Dedicated perf work happens after the bug-fix campaign.
- **Translation content.** This PRD fixes the i18n *plumbing*; it doesn't translate any content. Page-content translation is the existing translation pipeline's job.

## Further Notes

### Risk register

1. **Lexical serializer parity** (Phase 1.1) — a custom serializer might not handle every Lexical node type (custom blocks, embedded media). Mitigation: use `@payloadcms/richtext-lexical/react`'s built-in `RichText` first; only build custom if that doesn't fit.
2. **Slug uniqueness** (Phase 2.2) — if two News articles share a slug across boards, `/en/news/[slug]` is ambiguous. Mitigation: scope slug-uniqueness by collection or namespace by board path.
3. **Meilisearch reindex on a busy DB** (Phase 6.1) — reindexing while content is changing can desync. Mitigation: run during a quiet window; add a doc-count health check post-reindex.
4. **next-intl key drift** (Phase 5.3) — adding a parity test means adding new EN keys requires adding the FR placeholder before commits land. Mitigation: pre-commit hook or CI check.

### Dependency graph

```
phase-1 (content stops) ──┬─→ phase-4 (board detail body)
                          └─→ reused by phase-2 + phase-6 detail bodies
phase-2 (routing) ────────→ phase-3 (RSS — needs target routes to exist)
phase-5 (i18n) — independent
phase-6 (search) — independent
phase-7 (a11y) — independent (can run in parallel)
```

### Filed-issues reference

| Phase | GitHub issues |
|---|---|
| 1 | #79 (CRITICAL), #97 (CRITICAL), #98 |
| 2 | #80, #94 |
| 3 | #90 |
| 4 | #82 |
| 5 | #77, #78, #81, #92 |
| 6 | #76 |
| 7 | #91, #99 |

### Sequencing rationale

Phase 1 ships first because both P0s are visible-on-load and embarrassing.
Phase 2 + 3 ship together (routing pulls RSS along).
Phase 4 needs phase 1's Lexical serializer.
Phases 5, 6, 7 are independent of each other and of phases 1–4 — Ralph can fan out.

### References

- `dogfood-output/v2-admin-2026-05-02/report.md` — full repro steps + screenshots + videos for every issue
- GitHub issues #71–#100 (label: `dogfood`)
- `src/config/brand.ts` — canonical brand strings (used by phase 1.3)
- `CLAUDE.md` § "RASOC Rules" — phase 5.2 acceptance criteria
- `CLAUDE.md` § "Component Architecture Rules" — Phase 1.2 form persistence pattern
- `.ai-reports/PRD-admin-shell-v2.md` — sibling PRD (admin track)
