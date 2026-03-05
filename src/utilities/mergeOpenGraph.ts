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
 * - Default OG description/title use FRAS branding
 * - Image falls back to a default OG image (to be added in public/)
 */
import type { Metadata } from 'next'

import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Financial Reporting & Assurance Standards Canada — the standard-setting body for all accountants across Canada.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.png`,
    },
  ],
  siteName: 'FRAS Canada',
  title: 'FRAS Canada',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
