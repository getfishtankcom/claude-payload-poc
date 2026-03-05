/**
 * @description
 * Per-board RSS feed endpoint. Generates XML feed filtered by board slug.
 *
 * Key features:
 * - Board-specific feed items
 * - Same format as main /api/rss feed
 * - Content-Type: application/rss+xml
 *
 * @dependencies
 * - Payload CMS local API
 *
 * @notes
 * - Route: /api/rss/[board] (e.g., /api/rss/acsb)
 */
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 300

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

type FeedItem = {
  title: string
  link: string
  description: string
  pubDate: string
  category: string
}

async function getBoardFeedItems(boardSlug: string): Promise<FeedItem[]> {
  const payload = await getPayload({ config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'
  const items: FeedItem[] = []

  // Fetch news for board
  try {
    const news = await payload.find({
      collection: 'news',
      limit: 20,
      sort: '-publishedDate',
      where: { 'board.slug': { equals: boardSlug } },
      depth: 1,
    })
    for (const item of news.docs) {
      const doc = item as Record<string, unknown>
      items.push({
        title: (doc.title as string) || '',
        link: `${baseUrl}/news/${doc.slug}`,
        description: (doc.summary as string) || '',
        pubDate: new Date((doc.publishedDate as string) || Date.now()).toUTCString(),
        category: 'News',
      })
    }
  } catch { /* collection may not exist yet */ }

  // Fetch events for board
  try {
    const events = await payload.find({
      collection: 'events',
      limit: 20,
      sort: '-date',
      where: { 'board.slug': { equals: boardSlug } },
      depth: 1,
    })
    for (const item of events.docs) {
      const doc = item as Record<string, unknown>
      items.push({
        title: (doc.title as string) || '',
        link: `${baseUrl}/meetings-and-events/${doc.slug}`,
        description: (doc.summary as string) || '',
        pubDate: new Date((doc.date as string) || Date.now()).toUTCString(),
        category: 'Events',
      })
    }
  } catch { /* collection may not exist yet */ }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  return items
}

function buildRssXml(items: FeedItem[], title: string, description: string, link: string, selfUrl: string): string {
  const itemsXml = items
    .map(
      (item) => `    <item>
      <title>${escapeXml(item.title)}</title>
      <link>${escapeXml(item.link)}</link>
      <description>${escapeXml(item.description)}</description>
      <pubDate>${item.pubDate}</pubDate>
      <category>${escapeXml(item.category)}</category>
    </item>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${escapeXml(link)}</link>
    <language>en-CA</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(selfUrl)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`
}

type RouteParams = {
  params: Promise<{ board: string }>
}

export async function GET(_request: Request, { params }: RouteParams) {
  const { board: boardSlug } = await params
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'
  const items = await getBoardFeedItems(boardSlug)
  const boardName = boardSlug.toUpperCase()

  const xml = buildRssXml(
    items,
    `FRAS Canada — ${boardName} Updates`,
    `News and events from ${boardName}`,
    `${baseUrl}/boards/${boardSlug}`,
    `${baseUrl}/api/rss/${boardSlug}`,
  )

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
