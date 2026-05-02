/**
 * Core i18n routing configuration for next-intl.
 * Defines supported locales, default locale, prefix strategy, and the
 * EN ⇄ FR pathnames map for static routes (per Government of Canada
 * Official Languages Act convention).
 *
 * Static routes get true French URL segments via the `pathnames` map
 * (e.g. /fr/projets-actifs renders /active-projects/page.tsx). Dynamic
 * routes ([slug], [board], etc.) don't need a pathnames entry — they
 * resolve through Payload's per-locale slug fields (PRD §13.B).
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

  // Internal pathname → per-locale URL segment override.
  // Per next-intl v4: keys are the internal Next.js paths (which double
  // as the EN URL since EN is default). Only non-default locale paths
  // (FR) need to be specified.
  // FR mappings sourced from data/fr-slug-mapping.json where possible;
  // otherwise hand-picked Canadian French equivalents.
  pathnames: {
    '/': '/',
    '/active-projects': { fr: '/projets-actifs' },
    '/open-consultations': { fr: '/consultations-ouvertes' },
    '/news-listings': { fr: '/nouvelles' },
    '/contact-us': { fr: '/nous-joindre' },
    '/job-opportunities': { fr: '/possibilites-emploi' },
    '/search': { fr: '/recherche' },
    '/my-account/login': { fr: '/mon-compte/connexion' },
    '/my-account/register': { fr: '/mon-compte/inscription' },
    '/my-account/forgot-username': { fr: '/mon-compte/identifiant-oublie' },
    '/my-account/forgot-my-password': { fr: '/mon-compte/mot-de-passe-oublie' },
  },
})
