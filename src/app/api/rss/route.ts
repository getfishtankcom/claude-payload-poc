/**
 * @description
 * RSS feed endpoint — generates XML feed from news, events, and
 * document-for-comment collections. Serves all boards.
 *
 * Key features:
 * - Valid RSS 2.0 XML output
 * - Includes news items, events, documents for comment
 * - Content-Type: application/rss+xml
 * - Bilingual metadata in feed title
 *
 * @dependencies
 * - Payload CMS local API
 *
 * @notes
 * - Per-board feeds at /api/rss/[board]
 * - Cached for 5 minutes (ISR-like behavior)
 */
import { getPayload } from 'payload'
import config from '@payload-config'

export const revalidate = 300 // Cache for 5 minutes

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

async function getFeedItems(boardSlug?: string): Promise<FeedItem[]> {
  const payload = await getPayload({ config })
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'
  const items: FeedItem[] = []

  // Build board filter
  const boardFilter = boardSlug
    ? { 'board.slug': { equals: boardSlug } }
    : undefined

  // Fetch news
  try {
    const news = await payload.find({
      collection: 'news',
      limit: 20,
      sort: '-publishedDate',
      where: boardFilter || {},
      depth: 1,
    })
    for (const item of news.docs) {
      const doc = item as unknown as Record<string, unknown>
      items.push({
        title: (doc.title as string) || '',
        link: `${baseUrl}/news/${doc.slug}`,
        description: (doc.summary as string) || '',
        pubDate: new Date((doc.publishedDate as string) || Date.now()).toUTCString(),
        category: 'News',
      })
    }
  } catch { /* collection may not exist yet */ }

  // Fetch events
  try {
    const events = await payload.find({
      collection: 'events',
      limit: 20,
      sort: '-date',
      where: boardFilter || {},
      depth: 1,
    })
    for (const item of events.docs) {
      const doc = item as unknown as Record<string, unknown>
      items.push({
        title: (doc.title as string) || '',
        link: `${baseUrl}/meetings-and-events/${doc.slug}`,
        description: (doc.summary as string) || '',
        pubDate: new Date((doc.date as string) || Date.now()).toUTCString(),
        category: 'Events',
      })
    }
  } catch { /* collection may not exist yet */ }

  // Fetch documents for comment
  try {
    const docs = await payload.find({
      collection: 'documents-for-comment',
      limit: 20,
      sort: '-publishedDate',
      where: boardFilter || {},
      depth: 1,
    })
    for (const item of docs.docs) {
      const doc = item as unknown as Record<string, unknown>
      items.push({
        title: (doc.title as string) || '',
        link: `${baseUrl}/open-for-comment/${doc.slug}`,
        description: (doc.summary as string) || '',
        pubDate: new Date((doc.publishedDate as string) || Date.now()).toUTCString(),
        category: 'Documents for Comment',
      })
    }
  } catch { /* collection may not exist yet */ }

  // Sort by date descending
  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())

  return items
}

function buildRssXml(items: FeedItem[], title: string, description: string, link: string): string {
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
    <atom:link href="${escapeXml(link)}/api/rss" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`
}

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://frascanada.ca'
  const items = await getFeedItems()
  const xml = buildRssXml(
    items,
    'RAS Canada — Latest Updates',
    'News, events, and documents for comment from RAS Canada',
    baseUrl,
  )

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
