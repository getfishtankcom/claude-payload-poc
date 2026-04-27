/**
 * @description
 * Generates Next.js Metadata for a page/post from Payload CMS document fields.
 * Combines document meta fields with site-wide OG defaults.
 *
 * @dependencies
 * - mergeOpenGraph for OG tag merging
 * - getServerSideURL for absolute URLs
 *
 * @notes
 * - Adapted from Payload website template
 * - Expects documents with meta.title, meta.description, meta.image fields
 * - Will be updated when SEO plugin is added (Epic 10)
 */
import type { Metadata } from 'next'

import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

type MetaImage = {
  url?: string | null
  sizes?: { og?: { url?: string | null } }
}

type MetaDoc = {
  slug?: string
  meta?: {
    title?: string | null
    description?: string | null
    image?: MetaImage | string | null
  }
}

const getImageURL = (image?: MetaImage | string | null): string => {
  const serverUrl = getServerSideURL()

  // Default fallback OG image
  let url = `${serverUrl}/og-default.png`

  if (image && typeof image === 'object' && 'url' in image) {
    const ogUrl = image.sizes?.og?.url
    url = ogUrl ? `${serverUrl}${ogUrl}` : `${serverUrl}${image.url}`
  }

  return url
}

export const generateMeta = async (args: { doc: MetaDoc | null }): Promise<Metadata> => {
  const { doc } = args

  const ogImage = getImageURL(doc?.meta?.image ?? null)

  const title = doc?.meta?.title
    ? `${doc.meta.title} | RAS Canada`
    : 'RAS Canada — Financial Reporting & Assurance Standards'

  return {
    description: doc?.meta?.description,
    openGraph: mergeOpenGraph({
      description: doc?.meta?.description || '',
      images: ogImage ? [{ url: ogImage }] : undefined,
      title,
      url: Array.isArray(doc?.slug) ? doc?.slug.join('/') : '/',
    }),
    title,
  }
}
