/**
 * @description
 * API route for paginated meetings/events listing.
 * Supports board, timeframe (upcoming/past), and pagination parameters.
 *
 * @notes
 * - GET /api/meetings?board=...&timeframe=upcoming|past&page=...&limit=...
 * - Upcoming: date >= today, sort ascending
 * - Past: date < today, sort descending
 * - Returns { docs, totalDocs, totalPages, page }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getMeetingsListing } from '@/lib/payload-helpers'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const timeframe = searchParams.get('timeframe') as 'upcoming' | 'past' | null

  const result = await getMeetingsListing({
    board: searchParams.get('board') || undefined,
    timeframe: timeframe || 'past',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
  })

  return NextResponse.json(result)
}
