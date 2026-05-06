/**
 * @description
 * API route for paginated, filtered news listing.
 * Supports board, category, date range, sort, and pagination parameters.
 *
 * @notes
 * - GET /api/news?board=...&category=...&sort=...&startDate=...&endDate=...&page=...&limit=...
 * - Returns { docs, totalDocs, totalPages, page }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getNewsListing } from '@/lib/cms'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const result = await getNewsListing({
    board: searchParams.get('board') || undefined,
    category: searchParams.get('category') || undefined,
    sort: searchParams.get('sort') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    isVolunteerOpportunity: searchParams.get('volunteer') === 'true' || undefined,
  })

  return NextResponse.json(result)
}
