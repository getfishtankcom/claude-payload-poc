/**
 * Page collection lookups. `getPageByFullSlug` joins catch-all `[...slug]`
 * route segments with "/" to match the pages collection's slug field.
 */
import type { Page } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getPageBySlug(
  slug: string,
  locale: PayloadLocale = 'en',
): Promise<Page | null> {
  return withPayload<Page | null>(
    async (payload) => {
      const result = await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        locale,
      })
      return result.docs[0] ?? null
    },
    null,
  )
}

export async function getPageByFullSlug(slugSegments: string[]): Promise<Page | null> {
  return getPageBySlug(slugSegments.join('/'))
}
