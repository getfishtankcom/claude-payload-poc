/**
 * @description
 * Typed CMS fetch helpers for Payload CMS data access.
 * All helpers use the Payload local API via getPayload + config pattern.
 * Returns strongly typed results matching the generated payload-types.ts.
 *
 * Key features:
 * - Every helper accepts an optional `locale` param for bilingual content
 * - getHomepage(locale): Fetches homepage global (hero + layout blocks)
 * - getNavigation(locale): Fetches navigation global (utility links, primary nav, mega menu)
 * - getFooter(locale): Fetches footer global (columns, board links, quick links, newsletter)
 * - getPageBySlug(slug, locale): Fetches a page from pages collection by slug
 * - getLatestNews(limit, locale): Fetches news sorted by date desc
 * - getUpcomingEvents(limit, locale): Fetches future events sorted by date asc
 * - getStandardsByCategory(locale): Fetches standards grouped by category
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
 * - locale defaults to 'en' if not provided
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import type {
  Homepage,
  Navigation,
  Footer,
  SearchConfig,
  Page,
  News,
  Event,
  Standard,
  Board,
  Project,
  Consultation,
} from '@/payload-types'

/**
 * Fetches the homepage global (hero + layout blocks).
 * Returns null if not configured yet.
 */
export async function getHomepage(locale = 'en'): Promise<Homepage | null> {
  try {
    const payload = await getPayload({ config })
    const homepage = await payload.findGlobal({
      slug: 'homepage',
      locale,
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
export async function getNavigation(locale = 'en'): Promise<Navigation | null> {
  try {
    const payload = await getPayload({ config })
    const navigation = await payload.findGlobal({
      slug: 'navigation',
      locale,
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
export async function getFooter(locale = 'en'): Promise<Footer | null> {
  try {
    const payload = await getPayload({ config })
    const footer = await payload.findGlobal({
      slug: 'footer',
      locale,
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
export async function getPageBySlug(slug: string, locale = 'en'): Promise<Page | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: { equals: slug },
      },
      limit: 1,
      locale,
    })
    return (result.docs[0] as unknown as Page) || null
  } catch {
    return null
  }
}

/**
 * Fetches the latest news items sorted by publishedDate descending.
 */
export async function getLatestNews(limit = 3, locale = 'en'): Promise<News[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'news',
      sort: '-publishedDate',
      limit,
      locale,
    })
    return result.docs as unknown as News[]
  } catch {
    return []
  }
}

/**
 * Fetches upcoming events (future dates) sorted by date ascending.
 */
export async function getUpcomingEvents(limit = 5, locale = 'en'): Promise<Event[]> {
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
      locale,
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
export async function getStandardsByCategory(locale = 'en'): Promise<Record<string, Standard[]>> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'standards',
      limit: 100,
      sort: 'title',
      locale,
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

/**
 * Fetches the search-config global (popular tags, default filters).
 * Returns null if not configured yet.
 */
export async function getSearchConfig(locale = 'en'): Promise<SearchConfig | null> {
  try {
    const payload = await getPayload({ config })
    const searchConfig = await payload.findGlobal({
      slug: 'search-config',
      locale,
    })
    return searchConfig as unknown as SearchConfig
  } catch {
    return null
  }
}

// ── Board-specific helpers (Epic 6-9) ────────────────────────────────────

/**
 * Fetches a board by slug with all fields.
 */
export async function getBoardBySlug(slug: string, locale = 'en'): Promise<Board | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'boards',
      where: { slug: { equals: slug } },
      limit: 1,
      locale,
    })
    return (result.docs[0] as unknown as Board) || null
  } catch {
    return null
  }
}

/**
 * Fetches all boards (for generateStaticParams and board nav).
 */
export async function getAllBoards(locale = 'en'): Promise<Board[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'boards',
      limit: 100,
      sort: 'name',
      locale,
    })
    return result.docs as unknown as Board[]
  } catch {
    return []
  }
}

/**
 * Fetches projects filtered by board, with populated relationships.
 */
export async function getProjectsByBoard(boardId: number, limit = 20, locale = 'en'): Promise<Project[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'projects',
      where: { board: { equals: boardId } },
      sort: 'title',
      limit,
      depth: 2,
      locale,
    })
    return result.docs as unknown as Project[]
  } catch {
    return []
  }
}

/**
 * Fetches all active projects with populated board/standard relationships.
 */
export async function getAllActiveProjects(locale = 'en'): Promise<Project[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'Active' } },
      sort: 'title',
      limit: 200,
      depth: 2,
      locale,
    })
    return result.docs as unknown as Project[]
  } catch {
    return []
  }
}

/**
 * Fetches a project by board slug and project slug with full depth.
 */
export async function getProjectBySlug(projectSlug: string, locale = 'en'): Promise<Project | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'projects',
      where: { slug: { equals: projectSlug } },
      limit: 1,
      depth: 3,
      locale,
    })
    return (result.docs[0] as unknown as Project) || null
  } catch {
    return null
  }
}

/**
 * Fetches news items filtered by board, sorted newest first.
 */
export async function getNewsByBoard(boardId: number, limit = 4, locale = 'en'): Promise<News[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'news',
      where: { board: { equals: boardId } },
      sort: '-date',
      limit,
      locale,
    })
    return result.docs as unknown as News[]
  } catch {
    return []
  }
}

/**
 * Fetches upcoming events filtered by board, sorted by date ascending.
 */
export async function getEventsByBoard(boardId: number, limit = 3, locale = 'en'): Promise<Event[]> {
  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()
    const result = await payload.find({
      collection: 'events',
      where: {
        and: [
          { board: { equals: boardId } },
          { date: { greater_than: now } },
        ],
      },
      sort: 'date',
      limit,
      locale,
    })
    return result.docs as unknown as Event[]
  } catch {
    return []
  }
}

/**
 * Fetches open consultations (deadline in the future), sorted by deadline ascending.
 */
export async function getOpenConsultations(locale = 'en'): Promise<Consultation[]> {
  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()
    const result = await payload.find({
      collection: 'consultations',
      where: { deadline_date: { greater_than: now } },
      sort: 'deadline_date',
      limit: 100,
      depth: 2,
      locale,
    })
    return result.docs as unknown as Consultation[]
  } catch {
    return []
  }
}

/**
 * Fetches all consultations (including closed), sorted by deadline.
 */
export async function getAllConsultations(locale = 'en'): Promise<Consultation[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'consultations',
      sort: 'deadline_date',
      limit: 200,
      depth: 2,
      locale,
    })
    return result.docs as unknown as Consultation[]
  } catch {
    return []
  }
}

/**
 * Fetches all standards (for filter dropdowns).
 */
export async function getAllStandards(locale = 'en'): Promise<Standard[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'standards',
      limit: 100,
      sort: 'name',
      locale,
    })
    return result.docs as unknown as Standard[]
  } catch {
    return []
  }
}
