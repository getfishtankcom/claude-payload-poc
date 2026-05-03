/**
 * @description
 * Pure helpers for building the RSS feed: item link generators (one per
 * collection), the Payload-backed item collector, the XML escaper, and
 * the channel envelope renderer.
 *
 * Pulled out of the route handlers so the link logic is unit-testable and
 * the global + per-board endpoints don't duplicate ~80% of code.
 *
 * @notes
 * - Item links are prefixed with /<locale>/ and point at routes that
 *   exist today. There is no /meetings-and-events/<slug> detail route,
 *   so events link to the board's listing page (or skip if the event
 *   has no board populated).
 * - Documents-for-comment use the standard slug as the [board] segment
 *   per the existing routing convention (see
 *   `(frontend)/[locale]/(frontend)/[board]/documents/page.tsx`).
 */
import type { Payload, Where } from 'payload'

export type FeedLocale = 'en' | 'fr'

export type FeedItem = {
  title: string
  link: string
  description: string
  pubDate: string
  category: string
}

type RelationLike = { slug?: string | null } | number | null | undefined

function getRelationSlug(value: RelationLike): string | null {
  if (!value || typeof value === 'number') return null
  return typeof value.slug === 'string' && value.slug.length > 0 ? value.slug : null
}

/** /{locale}/news/{slug} — route exists at (frontend)/[locale]/news/[slug]. */
export function buildNewsLink(baseUrl: string, locale: FeedLocale, slug: string): string {
  return `${baseUrl}/${locale}/news/${slug}`
}

/**
 * /{locale}/{boardSlug}/meetings-and-events — listing page. There is no
 * meeting/event detail route yet, so we link to the board's listing.
 * Returns null when no board is populated; the caller should drop the
 * item rather than emit a broken link.
 */
export function buildEventLink(
  baseUrl: string,
  locale: FeedLocale,
  boardSlug: string | null,
): string | null {
  if (!boardSlug) return null
  return `${baseUrl}/${locale}/${boardSlug}/meetings-and-events`
}

/**
 * /{locale}/{standardOrBoardSlug}/documents/{docSlug} — detail route exists
 * at (frontend)/[locale]/[board]/documents/[docSlug]. The first URL segment
 * after locale is the standard slug per the listing's generateStaticParams,
 * but it also accepts a board slug as a fallback.
 */
export function buildDocumentForCommentLink(
  baseUrl: string,
  locale: FeedLocale,
  scopeSlug: string | null,
  docSlug: string,
): string | null {
  if (!scopeSlug) return null
  return `${baseUrl}/${locale}/${scopeSlug}/documents/${docSlug}`
}

export function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

type FeedDoc = Record<string, unknown>

export async function buildFeedItemsForLocale(
  payload: Payload,
  baseUrl: string,
  locale: FeedLocale,
  boardSlug?: string,
): Promise<FeedItem[]> {
  const items: FeedItem[] = []
  const boardFilter: Where | undefined = boardSlug
    ? { 'board.slug': { equals: boardSlug } }
    : undefined

  // News
  try {
    const news = await payload.find({
      collection: 'news',
      limit: 20,
      sort: '-date',
      where: boardFilter || {},
      depth: 1,
      locale,
    })
    for (const item of news.docs as unknown as FeedDoc[]) {
      const slug = item.slug as string | undefined
      if (!slug) continue
      const pub = (item.publishedDate as string) || (item.date as string) || new Date().toISOString()
      items.push({
        title: (item.title as string) || '',
        link: buildNewsLink(baseUrl, locale, slug),
        description: (item.excerpt as string) || '',
        pubDate: new Date(pub).toUTCString(),
        category: 'News',
      })
    }
  } catch {
    /* collection may not exist yet */
  }

  // Events — listing-only link until detail route lands
  try {
    const events = await payload.find({
      collection: 'events',
      limit: 20,
      sort: '-date',
      where: boardFilter || {},
      depth: 1,
      locale,
    })
    for (const item of events.docs as unknown as FeedDoc[]) {
      const slug = item.slug as string | undefined
      if (!slug) continue
      const itemBoardSlug = getRelationSlug(item.board as RelationLike) || boardSlug || null
      const link = buildEventLink(baseUrl, locale, itemBoardSlug)
      if (!link) continue
      const pub = (item.date as string) || new Date().toISOString()
      items.push({
        title: (item.title as string) || '',
        link,
        description: (item.excerpt as string) || '',
        pubDate: new Date(pub).toUTCString(),
        category: 'Events',
      })
    }
  } catch {
    /* collection may not exist yet */
  }

  // Documents for comment (skipped on per-board feed since the detail
  // route is keyed by standard slug, not board slug)
  if (!boardSlug) {
    try {
      const docs = await payload.find({
        collection: 'documents-for-comment',
        limit: 20,
        sort: '-publishedDate',
        depth: 1,
        locale,
      })
      for (const item of docs.docs as unknown as FeedDoc[]) {
        const docSlug = item.slug as string | undefined
        if (!docSlug) continue
        const standardSlug =
          getRelationSlug(item.standard as RelationLike) ||
          getRelationSlug(item.board as RelationLike)
        const link = buildDocumentForCommentLink(baseUrl, locale, standardSlug, docSlug)
        if (!link) continue
        const pub = (item.publishedDate as string) || new Date().toISOString()
        items.push({
          title: (item.title as string) || '',
          link,
          description: (item.title as string) || '',
          pubDate: new Date(pub).toUTCString(),
          category: 'Documents for Comment',
        })
      }
    } catch {
      /* collection may not exist yet */
    }
  }

  items.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
  return items
}

export function buildRssXml(args: {
  items: FeedItem[]
  title: string
  description: string
  link: string
  selfLink: string
  language: string
}): string {
  const itemsXml = args.items
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
    <title>${escapeXml(args.title)}</title>
    <description>${escapeXml(args.description)}</description>
    <link>${escapeXml(args.link)}</link>
    <language>${escapeXml(args.language)}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(args.selfLink)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>`
}
