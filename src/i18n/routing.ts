/**
 * @description
 * Core i18n routing configuration for next-intl.
 * Defines supported locales, default locale, and prefix strategy.
 *
 * Key features:
 * - EN/FR bilingual support
 * - 'always' prefix strategy: all routes include /en/ or /fr/
 * - Locale cookie for remembering user preference
 *
 * @dependencies
 * - next-intl/routing: defineRouting
 *
 * @notes
 * - Default locale is 'en'
 * - 'always' prefix ensures /en/ and /fr/ appear in URLs for SEO
 * - Pathnames are not localized here (kept 1:1) — FR slug mapping
 *   is handled at the CMS/content level, not route level
 */
import { defineRouting } from 'next-intl/routing'

export const locales = ['en', 'fr'] as const
export type Locale = (typeof locales)[number]

export const routing = defineRouting({
  locales,
  defaultLocale: 'en',

  // Always show locale prefix in URL for clear bilingual SEO
  localePrefix: 'always',

  // Remember user's locale preference
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  },
})
