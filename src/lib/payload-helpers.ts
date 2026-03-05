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
import { getPayload, type Where } from 'payload'
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

/**
 * Fetches the search-config global (popular tags, default filters).
 * Returns null if not configured yet.
 */
export async function getSearchConfig(): Promise<SearchConfig | null> {
  try {
    const payload = await getPayload({ config })
    const searchConfig = await payload.findGlobal({
      slug: 'search-config',
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
export async function getBoardBySlug(slug: string): Promise<Board | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'boards',
      where: { slug: { equals: slug } },
      limit: 1,
    })
    return (result.docs[0] as unknown as Board) || null
  } catch {
    return null
  }
}

/**
 * Fetches all boards (for generateStaticParams and board nav).
 */
export async function getAllBoards(): Promise<Board[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'boards',
      limit: 100,
      sort: 'name',
    })
    return result.docs as unknown as Board[]
  } catch {
    return []
  }
}

/**
 * Fetches projects filtered by board, with populated relationships.
 */
export async function getProjectsByBoard(boardId: number, limit = 20): Promise<Project[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'projects',
      where: { board: { equals: boardId } },
      sort: 'title',
      limit,
      depth: 2,
    })
    return result.docs as unknown as Project[]
  } catch {
    return []
  }
}

/**
 * Fetches all active projects with populated board/standard relationships.
 */
export async function getAllActiveProjects(): Promise<Project[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'projects',
      where: { status: { equals: 'Active' } },
      sort: 'title',
      limit: 200,
      depth: 2,
    })
    return result.docs as unknown as Project[]
  } catch {
    return []
  }
}

/**
 * Fetches a project by board slug and project slug with full depth.
 */
export async function getProjectBySlug(projectSlug: string): Promise<Project | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'projects',
      where: { slug: { equals: projectSlug } },
      limit: 1,
      depth: 3,
    })
    return (result.docs[0] as unknown as Project) || null
  } catch {
    return null
  }
}

/**
 * Fetches news items filtered by board, sorted newest first.
 */
export async function getNewsByBoard(boardId: number, limit = 4): Promise<News[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'news',
      where: { board: { equals: boardId } },
      sort: '-date',
      limit,
    })
    return result.docs as unknown as News[]
  } catch {
    return []
  }
}

/**
 * Fetches upcoming events filtered by board, sorted by date ascending.
 */
export async function getEventsByBoard(boardId: number, limit = 3): Promise<Event[]> {
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
    })
    return result.docs as unknown as Event[]
  } catch {
    return []
  }
}

/**
 * Fetches open consultations (deadline in the future), sorted by deadline ascending.
 */
export async function getOpenConsultations(): Promise<Consultation[]> {
  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()
    const result = await payload.find({
      collection: 'consultations',
      where: { deadline_date: { greater_than: now } },
      sort: 'deadline_date',
      limit: 100,
      depth: 2,
    })
    return result.docs as unknown as Consultation[]
  } catch {
    return []
  }
}

/**
 * Fetches all consultations (including closed), sorted by deadline.
 */
export async function getAllConsultations(): Promise<Consultation[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'consultations',
      sort: 'deadline_date',
      limit: 200,
      depth: 2,
    })
    return result.docs as unknown as Consultation[]
  } catch {
    return []
  }
}

/**
 * Fetches all standards (for filter dropdowns).
 */
export async function getAllStandards(): Promise<Standard[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'standards',
      limit: 100,
      sort: 'name',
    })
    return result.docs as unknown as Standard[]
  } catch {
    return []
  }
}

// ── Epic 15-16: Document Workflow + Listings ──────────────────────────────

/**
 * Fetches documents for comment filtered by status.
 */
export async function getDocumentsForComment(
  status?: 'open' | 'closed',
): Promise<unknown[]> {
  try {
    const payload = await getPayload({ config })
    const where: Where = {}
    if (status) {
      where.status = { equals: status }
    }
    const result = await payload.find({
      collection: 'documents-for-comment',
      where,
      sort: 'sortOrder',
      limit: 200,
      depth: 2,
    })
    return result.docs
  } catch {
    return []
  }
}

/**
 * Fetches a document detail by slug with full depth for relationships.
 */
export async function getDocumentDetailBySlug(slug: string): Promise<unknown | null> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'document-details',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    })
    return result.docs[0] || null
  } catch {
    return null
  }
}

/**
 * Fetches paginated resources with optional filters.
 */
export async function getResources(params: {
  category?: string
  resourceType?: string
  sort?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}): Promise<{ docs: unknown[]; totalDocs: number; totalPages: number; page: number }> {
  try {
    const payload = await getPayload({ config })
    const where: Where = {
      status: { equals: 'published' },
    }
    if (params.category) {
      where.category = { equals: params.category }
    }
    if (params.resourceType) {
      where.resourceType = { equals: params.resourceType }
    }
    if (params.startDate || params.endDate) {
      const dateFilter: Where[string] = {}
      if (params.startDate) dateFilter.greater_than_equal = params.startDate
      if (params.endDate) dateFilter.less_than_equal = params.endDate
      where.date = dateFilter
    }
    const sortField = params.sort === 'oldest' ? 'date' : '-date'
    const result = await payload.find({
      collection: 'resources',
      where,
      sort: sortField,
      page: params.page || 1,
      limit: params.limit || 10,
      depth: 1,
    })
    return {
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page || 1,
    }
  } catch {
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  }
}

/**
 * Fetches paginated news with optional filters.
 */
export async function getNewsListing(params: {
  board?: string
  category?: string
  sort?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  isVolunteerOpportunity?: boolean
}): Promise<{ docs: unknown[]; totalDocs: number; totalPages: number; page: number }> {
  try {
    const payload = await getPayload({ config })
    const where: Where = {}
    if (params.board) {
      where['board.slug'] = { equals: params.board }
    }
    if (params.category) {
      where.category = { equals: params.category }
    }
    if (params.isVolunteerOpportunity) {
      where.isVolunteerOpportunity = { equals: true }
    }
    if (params.startDate || params.endDate) {
      const dateFilter: Where[string] = {}
      if (params.startDate) dateFilter.greater_than_equal = params.startDate
      if (params.endDate) dateFilter.less_than_equal = params.endDate
      where.date = dateFilter
    }
    const sortField = params.sort === 'oldest' ? 'date' : '-date'
    const result = await payload.find({
      collection: 'news',
      where,
      sort: sortField,
      page: params.page || 1,
      limit: params.limit || 10,
      depth: 1,
    })
    return {
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page || 1,
    }
  } catch {
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  }
}

/**
 * Fetches paginated events/meetings with timeframe filter.
 */
export async function getMeetingsListing(params: {
  board?: string
  timeframe?: 'upcoming' | 'past'
  page?: number
  limit?: number
}): Promise<{ docs: unknown[]; totalDocs: number; totalPages: number; page: number }> {
  try {
    const payload = await getPayload({ config })
    const now = new Date().toISOString()
    const where: Where = {}
    if (params.board) {
      where['board.slug'] = { equals: params.board }
    }
    if (params.timeframe === 'upcoming') {
      where.date = { greater_than_equal: now }
    } else {
      where.date = { less_than: now }
    }
    const sortField = params.timeframe === 'upcoming' ? 'date' : '-date'
    const result = await payload.find({
      collection: 'events',
      where,
      sort: sortField,
      page: params.page || 1,
      limit: params.limit || 10,
      depth: 1,
    })
    return {
      docs: result.docs,
      totalDocs: result.totalDocs,
      totalPages: result.totalPages,
      page: result.page || 1,
    }
  } catch {
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1 }
  }
}

/**
 * Fetches all standards sections slugs (for generateStaticParams).
 */
export async function getAllStandardsSlugs(): Promise<string[]> {
  try {
    const payload = await getPayload({ config })
    const result = await payload.find({
      collection: 'standards',
      limit: 100,
      depth: 0,
    })
    return result.docs.map((s) => (s as unknown as { slug?: string }).slug || '').filter(Boolean)
  } catch {
    return []
  }
}
