/**
 * @description
 * Merges page-specific Open Graph metadata with site-wide defaults.
 * Ensures every page has OG tags even if not explicitly set.
 *
 * @dependencies
 * - getServerSideURL for absolute image URLs
 *
 * @notes
 * - Adapted from Payload website template
 * - Default OG description/title use RAS branding
 * - Image falls back to a default OG image (to be added in public/)
 */
import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'
import { BRAND } from '@/config/brand'

// Default OG metadata applied by `mergeOpenGraph` when a page-level
// override doesn't provide its own. Brand string is the canonical
// `BRAND.fullName` — never the legacy "Financial Reporting &
// Assurance Standards" copy. (#149 / QA-101)
const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    `${BRAND.fullName} — the standard-setting body for all accountants across Canada.`,
  images: [
    {
      url: `${getServerSideURL()}/og-default.png`,
    },
  ],
  siteName: BRAND.name,
  title: BRAND.name,
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
