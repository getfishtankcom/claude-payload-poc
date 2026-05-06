/**
 * Event queries (meetings, webinars, deadlines, decision summaries — see
 * `Events.ts` collection for the type enum).
 */
import type { Where } from 'payload'
import type { Event } from '@/payload-types'
import { withPayload, type PayloadLocale } from './client'

export async function getUpcomingEvents(
  limit = 5,
  locale: PayloadLocale = 'en',
): Promise<Event[]> {
  return withPayload<Event[]>(
    async (payload) => {
      const now = new Date().toISOString()
      const result = await payload.find({
        collection: 'events',
        where: { date: { greater_than: now } },
        sort: 'date',
        limit,
        locale,
      })
      return result.docs
    },
    [],
  )
}

export async function getEventsByBoard(
  boardId: number,
  limit = 3,
  locale: PayloadLocale = 'en',
): Promise<Event[]> {
  return withPayload<Event[]>(
    async (payload) => {
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
      return result.docs
    },
    [],
  )
}

export type MeetingsListingResult = {
  docs: Event[]
  totalDocs: number
  totalPages: number
  page: number
}

export async function getMeetingsListing(params: {
  board?: string
  timeframe?: 'upcoming' | 'past'
  page?: number
  limit?: number
}): Promise<MeetingsListingResult> {
  return withPayload<MeetingsListingResult>(
    async (payload) => {
      const now = new Date().toISOString()
      const where: Where = {}
      if (params.board) where['board.slug'] = { equals: params.board }
      where.date = params.timeframe === 'upcoming' ? { greater_than_equal: now } : { less_than: now }
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
    },
    { docs: [], totalDocs: 0, totalPages: 0, page: 1 },
  )
}
