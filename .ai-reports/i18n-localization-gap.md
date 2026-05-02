# i18n Localization Gap — `/fr` Renders English (Dogfood ISSUE-002)

| Field | Value |
|-------|-------|
| **Date** | 2026-05-01 |
| **Severity** | high |
| **Source** | `.ai-reports/dogfood-2026-05-01/report.md` ISSUE-002 |
| **Status** | root-caused; fix scoped; not applied (schema change needs sign-off) |

## TL;DR

`/fr` renders identical English content to `/en`. The cause is **two distinct gaps**:

1. **Schema gap:** 11 user-visible text fields in shared field configs (`hero.richText`, link labels, all 5 block content fields) are not marked `localized: true`. Even if FR content existed, these fields can only store one value across all locales.
2. **Content gap:** The seed never populates FR locale data. Every `payload.create` / `payload.updateGlobal` call uses the default locale (EN). So even the 106 fields that ARE marked `localized: true` show EN on `/fr` because Payload falls back when a locale row doesn't exist.

Either gap alone would cause the visible bug. Both need to close before `/fr` actually shows French content.

## Verification

Confirmed via DB inspection:
```
fras=# \dt homepage*
        homepage                    -- single row table
        homepage_blocks_*           -- block tables, no _locales suffix
        homepage_hero_links         -- still no locale partition
        homepage_rels
```

There is **no `homepage_locales` table**, so the Payload schema generator has not been told the hero or any block field needs locale-partitioned storage. With Payload's `push: true` in dev, this means the schema reflects the field configs accurately — the field configs themselves are missing `localized: true`.

## Gap detail (precise)

### A. Schema gap — fields that need `localized: true`

| File | Line | Field | Visible where |
|---|---|---|---|
| `src/heros/config.ts` | 55–67 | `hero.richText` (richText) | Homepage hero, every Page hero |
| `src/fields/link.ts` | 122 | `link.label` (text) | Every CTA, mega-menu, footer link, hero button, news card |
| `src/fields/link.ts` | 106 | `link.url` (text) | Every link (FR slugs differ — `/cnc` vs `/acsb`) |
| `src/blocks/CTABlock/config.ts` | 1 richText field | CTA banners on every page using the layout blocks |
| `src/blocks/RichTextBlock/config.ts` | 1 richText field | Inline rich-text blocks |
| `src/blocks/ContentBlock/config.ts` | 1 richText field | Multi-column content layouts |
| `src/blocks/NewsGridBlock/config.ts` | 1 text field (heading) | News grid headings |
| `src/blocks/BrowseByStandardBlock/config.ts` | 4 text fields | Browse-by-standard category headings + descriptions |

**11 fields total.**

### B. Content gap — seed never writes FR

`grep -nE "locale:|payload\.(create|updateGlobal|update).*locale" src/seed/index.ts` returns **0 matches**. Every write call uses the default locale only.

Result: the 106 collection-level fields that ARE marked `localized: true` (Boards, News, Projects, Resources, Standards, Pages, Events, Committees, etc.) only have an EN row. Payload falls back to EN when querying with `locale: 'fr'`.

## What's actually correct already

| Layer | Status |
|---|---|
| `next-intl` chrome strings (nav, footer copyright, language switcher) | ✅ Both `messages/en.json` (49 keys) + `messages/fr.json` (49 keys) populated. Verified live: footer reads "© 2026 RAS Canada" and language switcher reads "Français" on `/en`. |
| `next-intl` routing | ✅ `src/i18n/routing.ts` `localePrefix: 'always'` works; `/fr` URL prefix is recognized. |
| `next-intl` request config | ✅ `src/i18n/request.ts` correctly loads the right messages file per locale. |
| Payload localization config | ✅ `src/payload.config.ts` has `localization.locales: [en, fr]` with `fallback: true`. |
| `getHomepage(locale)` helper | ✅ Passes locale through to `payload.findGlobal`. |
| `toPayloadLocale` helper | ✅ Maps `'fr'` → `'fr'`, `'en'` → `'en'` correctly. |

The plumbing is correct. Only the field configs and the seed are incomplete.

## Proposed fix (phased, with explicit sign-off gates)

### Phase 1 — Schema (1 hour, needs sign-off before applying)

Add `localized: true` to the 11 fields in section A. This is an 11-line code change but a real schema migration:

- In dev with `push: true`, restarting the Payload server will auto-push schema. Existing rows in `homepage`, `homepage_blocks_*`, `pages`, `pages_blocks_*` get their content moved into a default-locale row of new `_locales` tables.
- In prod, this needs a proper Payload migration file (`payload migrate:create`).

After Phase 1, `/fr` still shows EN content (fallback), but the schema is structurally correct and ready for FR content.

**Gate:** confirm before applying — schema migrations on a running DB are not safe to do autonomously.

### Phase 2 — Seed (30 min, after Phase 1)

Update `src/seed/index.ts` so every call that writes localized content has a parallel FR write. Two patterns:

```ts
// Pattern 1: per-call locale
await payload.updateGlobal({ slug: 'homepage', data: { hero: enHero }, locale: 'en' })
await payload.updateGlobal({ slug: 'homepage', data: { hero: frHero }, locale: 'fr' })

// Pattern 2: helper
async function seedLocalizedGlobal(slug, en, fr) {
  await payload.updateGlobal({ slug, data: en, locale: 'en' })
  await payload.updateGlobal({ slug, data: fr, locale: 'fr' })
}
```

For the demo, the FR content can be machine-translated placeholders. Real translations come from the AI-assisted workflow described in `.ai-reports/PRD-translation.md`.

**Gate:** decide on the FR content source for the demo (machine translation? human reviewer? leave blank and let fallback show?).

### Phase 3 — Validate (15 min)

After Phase 1 + 2 + a re-seed:
1. `curl http://localhost:3000/fr | grep -i "<h1>"` should NOT match the English headline.
2. The dogfood `/fr renders English` finding should close.

## What I am NOT doing in this round

- Applying Phase 1 schema changes (needs sign-off; a wrong migration risks the `homepage` global content).
- Writing FR seed translations (needs a content-source decision).
- Touching `payload migrate:create` (production migration generation).

## Recommended next step

User decides: do Phase 1 now (low-risk; rollback path is clear) or schedule it for a content-and-schema milestone alongside the AI-translation workflow.
