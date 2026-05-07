/**
 * Board membership queries. Use Payload's relationship-traversal in WHERE
 * (`'board.slug'`) to filter board-members and committees by their parent
 * board's slug in a single round trip — the same pattern news.ts and
 * events.ts use for their board-scoped paginated listings.
 *
 * Locale behavior matches the previous two-query implementation: WHERE
 * runs against the default locale's slug field. If FR slug filtering is
 * needed later, add an optional `locale` param and pass it through.
 */
import type { BoardMember, Committee } from '@/payload-types'
import { withPayload } from './client'

export async function getBoardMembersByBoardSlug(boardSlug: string): Promise<BoardMember[]> {
  return withPayload<BoardMember[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'board-members',
        where: { 'board.slug': { equals: boardSlug } },
        sort: 'sortOrder',
        limit: 100,
        depth: 2,
      })
      return result.docs
    },
    [],
  )
}

export async function getCommitteesByBoardSlug(boardSlug: string): Promise<Committee[]> {
  return withPayload<Committee[]>(
    async (payload) => {
      const result = await payload.find({
        collection: 'committees',
        where: {
          and: [
            { 'board.slug': { equals: boardSlug } },
            { status: { equals: 'active' } },
          ],
        },
        sort: 'sortOrder',
        limit: 100,
        depth: 1,
      })
      return result.docs
    },
    [],
  )
}
