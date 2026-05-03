/**
 * @description
 * Per-board RSS feed endpoint. Generates XML feed filtered by board slug.
 *
 * Key features:
 * - Board-specific feed items
 * - Same format as main /api/rss feed
 * - Content-Type: application/rss+xml
 * - Locale-aware: ?lang=fr serves the French feed; defaults to 'en'
 *
 * @dependencies
 * - Payload CMS local API
 *
 * @notes
 * - Route: /api/rss/[board] (e.g., /api/rss/acsb)
 * - Channel <link> points at the board landing page (/<locale>/<boardSlug>),
 *   not /boards/<slug> (which is a different placeholder).
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  buildFeedItemsForLocale,
  buildRssXml,
  type FeedLocale,
} from '../feed-builder'

// Force dynamic rendering — same reasoning as /api/rss; do not prerender.
export const dynamic = 'force-dynamic'
export const revalidate = 300

function resolveLocale(value: string | null): FeedLocale {
  return value === 'fr' ? 'fr' : 'en'
}

type RouteParams = {
  params: Promise<{ board: string }>
}

export async function GET(request: Request, { params }: RouteParams) {
  const { board: boardSlug } = await params
  const url = new URL(request.url)
  const locale = resolveLocale(url.searchParams.get('lang'))
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'

  const payload = await getPayload({ config })
  const items = await buildFeedItemsForLocale(payload, baseUrl, locale, boardSlug)

  const boardName = boardSlug.toUpperCase()
  const xml = buildRssXml({
    items,
    title: `RAS Canada — ${boardName} Updates`,
    description: `News and events from ${boardName}`,
    link: `${baseUrl}/${locale}/${boardSlug}`,
    selfLink: `${baseUrl}/api/rss/${boardSlug}${locale === 'fr' ? '?lang=fr' : ''}`,
    language: locale === 'fr' ? 'fr-CA' : 'en-CA',
  })

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
