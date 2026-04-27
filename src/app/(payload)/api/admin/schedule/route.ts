/**
 * GET /api/admin/schedule?from=YYYY-MM-DD&to=YYYY-MM-DD
 *
 * Returns scheduled-publish items across all workflow-enabled collections
 * where workflowState = 'approved' AND publishOn falls inside the window.
 */
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

const SCHEDULABLE_COLLECTIONS = [
  'pages',
  'news',
  'projects',
  'events',
  'documents',
  'resources',
] as const

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const { searchParams } = request.nextUrl
    const from = searchParams.get('from') ?? new Date().toISOString().slice(0, 10)
    const to =
      searchParams.get('to') ??
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10)
    const fromIso = `${from}T00:00:00.000Z`
    const toIso = `${to}T23:59:59.999Z`

    const results = await Promise.allSettled(
      SCHEDULABLE_COLLECTIONS.map(async (slug) => {
        const found = await payload.find({
          collection: slug,
          where: {
            and: [
              { workflowState: { equals: 'approved' } },
              { publishOn: { greater_than_equal: fromIso } },
              { publishOn: { less_than_equal: toIso } },
            ],
          },
          limit: 200,
          depth: 1,
          sort: 'publishOn',
        })
        return found.docs.map((d) => ({
          id: (d as { id: string | number }).id,
          title: ((d as { title?: string }).title ?? `${slug} item`),
          publishOn: (d as { publishOn?: string }).publishOn ?? null,
          collection: slug,
          board:
            ((d as { board?: { title?: string; slug?: string } | null }).board ?? null),
        }))
      }),
    )

    const items = results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []))
    items.sort((a, b) => String(a.publishOn).localeCompare(String(b.publishOn)))

    return NextResponse.json({ items, total: items.length })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
