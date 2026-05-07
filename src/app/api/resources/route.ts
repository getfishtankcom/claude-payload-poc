/**
 * @description
 * API route for paginated, filtered resources listing.
 * Supports category, type, date range, sort, and pagination parameters.
 *
 * @notes
 * - GET /api/resources?category=...&type=...&sort=...&startDate=...&endDate=...&page=...&limit=...
 * - Returns { docs, totalDocs, totalPages, page }
 */
import { NextRequest, NextResponse } from 'next/server'
import { getResources } from '@/lib/cms'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const result = await getResources({
    category: searchParams.get('category') || undefined,
    resourceType: searchParams.get('type') || undefined,
    sort: searchParams.get('sort') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
    limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
  })

  return NextResponse.json(result)
}
