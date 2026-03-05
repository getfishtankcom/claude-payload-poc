/**
 * @description
 * Typed CMS fetch helpers for Payload CMS data access.
 * All helpers use the Payload local API via getPayload + config pattern.
 * Returns strongly typed results matching the generated payload-types.ts.
 *
 * Key features:
 * - getHomepage(): Fetches homepage global (hero + layout blocks)
 * - getNavigation(): Fetches navigation global (utility links, primary nav, mega menu)
 * - getFooter(): Fetches footer global (columns, board links, quick links, newsletter)
 * - getPageBySlug(slug): Fetches a page from pages collection by slug
 * - getLatestNews(limit): Fetches news sorted by date desc
 * - getUpcomingEvents(limit): Fetches future events sorted by date asc
 * - getStandardsByCategory(): Fetches standards grouped by category
 *
 * @dependencies
 * - payload: getPayload function for local API access
 * - @payload-config: Payload configuration
 *
 * @notes
 * - All helpers run server-side only (no 'use client')
 * - Use in server components and page routes only
 * - Wraps Payload local API calls with type-safe return values
 * - Errors are caught and return null/empty to prevent page crashes
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import type {
  Homepage,
  Navigation,
  Footer,
  Page,
  News,
  Event,
  Standard,
} from '@/payload-types'

/**
 * Fetches the homepage global (hero + layout blocks).
 * Returns null if not configured yet.
 */
export async function getHomepage(): Promise<Homepage | null> {
  try {
    const payload = await getPayload({ config })
    const homepage = await payload.findGlobal({
      slug: 'homepage',
    })
    return homepage as unknown as Homepage
  } catch {
    return null
  }
}

/**
 * Fetches the navigation global.
 * Returns null if not configured yet.
 */
export async function getNavigation(): Promise<Navigation | null> {
  try {
    const payload = await getPayload({ config })
    const navigation = await payload.findGlobal({
      slug: 'navigation',
    })
    return navigation as unknown as Navigation
  } catch {
    return null
  }
}

/**
 * Fetches the footer global.
 * Returns null if not configured yet.
 */
export async function getFooter(): Promise<Footer | null> {
  try {
    const payload = await getPayload({ config })
    const footer = await payload.findGlobal({
      slug: 'footer',
    })
    return footer as unknown as Footer
  } catch {
    return null
  }
}

/**
 * Fetches a page from the pages collection by slug.
 * Returns the page with hero + layout blocks, or null if not found.
 */
export async function getPageBySlug(slug: string): Promise<Page | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
    })
    return (result.docs[0] as unknown as Page) || null
  } catch {
    return null
  }
}

/**
 * Fetches the latest news items sorted by publishedDate descending.
 */
export async function getLatestNews(limit = 3): Promise<News[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'news',
      sort: '-publishedDate',
      limit,
    })
    return result.docs as unknown as News[]
  } catch {
    return []
  }
}

/**
 * Fetches upcoming events (future dates) sorted by date ascending.
 */
export async function getUpcomingEvents(limit = 5): Promise<Event[]> {
  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()
    const result = await payload.find({
      collection: 'events',
      where: {
        date: { greater_than: now },
      },
      sort: 'date',
      limit,
    })
    return result.docs as unknown as Event[]
  } catch {
    return []
  }
}

/**
 * Fetches all standards grouped by category.
 * Returns an object keyed by category with arrays of standards.
 */
export async function getStandardsByCategory(): Promise<Record<string, Standard[]>> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'standards',
      limit: 100,
      sort: 'title',
    })
    const standards = result.docs as unknown as Standard[]

    // Group by category
    const grouped: Record<string, Standard[]> = {}
    for (const standard of standards) {
      const category = standard.category || 'Uncategorized'
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(standard)
    }
    return grouped
  } catch {
    return {}
  }
}
