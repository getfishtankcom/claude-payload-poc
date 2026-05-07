/**
 * News queries — single-item lookup, board-scoped lists, and the paginated
 * listing used by /news.
 */
import type { Where } from 'payload'
import type { News } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getNewsBySlug(
  slug: string,
  locale: PayloadLocale = 'en',
): Promise<News | null> {
  return withPayload<News | null>(
    async (payload) => {
      const result = await payload.find({
        collection: 'news',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 2,
        locale,
      })
      return result.docs[0] ?? null
    },
    null,
  )
}

export async function getNewsByBoard(
  boardId: number,
  limit = 4,
  locale: PayloadLocale = 'en',
): Promise<News[]> {
  return withPayload<News[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'news',
        where: { board: { equals: boardId } },
        sort: '-date',
        limit,
        locale,
      })
      return result.docs
    },
    [],
  )
}

export async function getLatestNews(
  limit = 3,
  locale: PayloadLocale = 'en',
): Promise<News[]> {
  return withPayload<News[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'news',
        sort: '-publishedDate',
        limit,
        locale,
      })
      return result.docs
    },
    [],
  )
}

export type NewsListingResult = {
  docs: News[]
  totalDocs: number
  totalPages: number
  page: number
}

export async function getNewsListing(params: {
  board?: string
  category?: string
  sort?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  isVolunteerOpportunity?: boolean
}): Promise<NewsListingResult> {
  return withPayload<NewsListingResult>(
    async (payload) => {
      const where: Where = {}
      if (params.board) where['board.slug'] = { equals: params.board }
      if (params.category) where.category = { equals: params.category }
      if (params.isVolunteerOpportunity) where.isVolunteerOpportunity = { equals: true }
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
    },
    { docs: [], totalDocs: 0, totalPages: 0, page: 1 },
  )
}
