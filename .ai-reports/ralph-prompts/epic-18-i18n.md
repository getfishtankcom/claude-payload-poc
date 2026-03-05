# Ralph Loop Prompt — Epic 18: Bilingual (i18n)

## Your Mission

Add full EN/FR bilingual support: Next.js locale routing, Payload CMS localization, language switcher, translation strings, hreflang metadata.

## Context Files (READ THESE FIRST)

1. `CLAUDE.md` — project rules
2. `.ai-reports/MASTER_TODO.md` — find Epic 18 tasks (18.1–18.5)
3. `.ai-reports/BUILD_PLAN-phase2.md` — Epic 18 task details
4. `.ai-reports/PRD.md` — Q2 bilingual strategy (RESOLVED)
5. `data/fr-slug-mapping.json` — FR URL slug translations

## What to Build

### 18.1 Configure Next.js i18n routing
- App Router `[locale]` segment: `app/[locale]/(frontend)/...`
- Middleware for locale detection and redirect
- Default locale: `en`

### 18.2 Add locale support to Payload CMS
- Enable `localization: { locales: ['en', 'fr'], defaultLocale: 'en' }` in payload.config.ts
- All text/richtext fields get locale support
- Admin panel locale switcher

### 18.3 Language switcher component
- Toggle between EN/FR preserving current page path
- Integrate with SiteHeader utility bar and MobileMenu
- Handle pages that exist in only one locale

### 18.4 FR translation strings
- `messages/en.json` and `messages/fr.json`
- All UI text: nav labels, buttons, form labels, error messages, empty states
- FR URL slug mappings from `data/fr-slug-mapping.json`

### 18.5 hreflang and locale metadata
- `<link rel="alternate" hreflang="en/fr">` on all pages
- `<html lang="...">` per locale
- Locale in OpenGraph/Twitter metadata
- Sitemap with hreflang entries

## IMPORTANT
- This is an APPROVAL GATE epic — locale routing affects ALL pages
- Use `next-intl` or similar i18n library (check Context7 for Next.js 15 patterns)
- Don't translate CMS content — that's a content migration task
- Only translate UI strings (chrome, labels, buttons)

## Stop Condition

When ALL 5 tasks `[x]`: update AUDIT_LOG.md, output:
```
<promise>EPIC 18 COMPLETE</promise>
```
