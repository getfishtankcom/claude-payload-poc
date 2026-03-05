/**
 * @description
 * Helper for adding locale-specific metadata (hreflang alternates, OG locale)
 * to Next.js page metadata objects.
 *
 * @notes
 * - Used by pages under [locale] route group
 * - Adds hreflang alternates for EN/FR
 */
import type { Metadata } from 'next'
import { locales } from '@/i18n/routing'

const BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'

/**
 * Wraps a metadata object with locale-specific alternates and OG locale.
 * @param metadata - Base metadata from the page
 * @param pathname - The page path without locale prefix (e.g., '/active-projects/acsb/revenue')
 * @param locale - Current locale ('en' or 'fr')
 */
export function withLocaleMetadata(
  metadata: Metadata,
  pathname: string,
  locale: string,
): Metadata {
  const languages: Record<string, string> = {}
  for (const loc of locales) {
    languages[loc] = `${BASE_URL}/${loc}${pathname}`
  }

  return {
    ...metadata,
    alternates: {
      ...metadata.alternates,
      languages,
    },
    openGraph: {
      ...(typeof metadata.openGraph === 'object' ? metadata.openGraph : {}),
      locale: locale === 'fr' ? 'fr_CA' : 'en_CA',
    },
  }
}
