/**
 * @description
 * RSS feed endpoint — generates XML feed from news, events, and
 * document-for-comment collections. Serves all boards.
 *
 * Key features:
 * - Valid RSS 2.0 XML output
 * - Includes news items, events, documents for comment
 * - Content-Type: application/rss+xml
 * - Locale-aware: ?lang=fr serves the French feed; defaults to 'en'
 *
 * @dependencies
 * - Payload CMS local API
 *
 * @notes
 * - Per-board feeds at /api/rss/[board]
 * - Cached for 5 minutes (ISR-like behavior)
 * - All <link> URLs are prefixed with /<locale>/ and point at routes
 *   that actually exist (no /meetings-and-events/<slug> detail page yet —
 *   we link to the per-board listing until that route lands).
 */
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  buildFeedItemsForLocale,
  buildRssXml,
  type FeedLocale,
} from './feed-builder'

// Force dynamic rendering — the feed reads from Payload at request time,
// so it must not be prerendered at build time (which would require the
// database to be reachable during the build).
export const dynamic = 'force-dynamic'
export const revalidate = 300 // Cache for 5 minutes at the edge.

function resolveLocale(value: string | null): FeedLocale {
  return value === 'fr' ? 'fr' : 'en'
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const locale = resolveLocale(url.searchParams.get('lang'))
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'

  const payload = await getPayload({ config })
  const items = await buildFeedItemsForLocale(payload, baseUrl, locale)

  const xml = buildRssXml({
    items,
    title: locale === 'fr' ? 'NIFC Canada — Dernières mises à jour' : 'RAS Canada — Latest Updates',
    description:
      locale === 'fr'
        ? 'Nouvelles, événements et documents pour commentaires de NIFC Canada'
        : 'News, events, and documents for comment from RAS Canada',
    link: `${baseUrl}/${locale}`,
    selfLink: `${baseUrl}/api/rss${locale === 'fr' ? '?lang=fr' : ''}`,
    language: locale === 'fr' ? 'fr-CA' : 'en-CA',
  })

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
