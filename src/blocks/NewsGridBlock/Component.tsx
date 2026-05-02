/**
 * @description
 * Renders the News Grid block as a list of news items.
 * Fetches data server-side when populateBy is 'collection'.
 *
 * Key features:
 * - Auto-population from news collection (sorted by date desc)
 * - Manual selection mode for curated content
 * - Optional "View All" link to full news listing
 * - Empty state handling when no news exists
 *
 * @dependencies
 * - Container from ui components
 * - Button for "View All" link
 * - getLatestNews from payload-helpers
 *
 * @notes
 * - This is an async server component (like Payload template's ArchiveBlock)
 * - Data fetching happens at render time via Payload local API
 * - News items display board abbreviation, title, date
 */
import React from 'react'

import { Container, Button } from '@/components/ui'
import { getLatestNews } from '@/lib/payload-helpers'

type NewsGridBlockProps = {
  heading?: string | null
  news_count?: number | null
  show_view_all?: boolean | null
  populateBy?: 'collection' | 'selection' | null
  selectedNews?: Array<{ id: string; title: string; slug: string; publishedDate?: string; board?: { abbreviation?: string } }> | null
  blockType: 'newsGrid'
}

export const NewsGridBlockComponent: React.FC<NewsGridBlockProps> = async ({
  heading,
  news_count = 3,
  show_view_all,
  populateBy = 'collection',
  selectedNews,
}) => {
  // For 'collection' mode, fetch latest news from CMS
  // For 'selection' mode, use the manually curated selectedNews
  let newsItems: Array<{ id: string; title: string; slug: string; publishedDate?: string; board?: { abbreviation?: string } }> = []

  if (populateBy === 'collection') {
    const news = await getLatestNews(news_count || 3)
    newsItems = news.map((n) => {
      const item = n as unknown as Record<string, unknown>
      const board = item.board as Record<string, unknown> | undefined
      return {
        id: String(item.id),
        title: String(item.title || ''),
        slug: String(item.slug || ''),
        publishedDate: item.publishedDate as string | undefined,
        board: board ? { abbreviation: String(board.abbreviation || '') } : undefined,
      }
    })
  } else if (selectedNews) {
    newsItems = selectedNews
  }

  return (
    <div data-testid="block-news-grid">
      <Container>
        {/* Header row */}
        <div className="mb-6 flex items-center justify-between">
          {heading && (
            <h2 className="text-2xl font-bold text-text-primary">{heading}</h2>
          )}
          {show_view_all && (
            <Button variant="ghost" href="/news">
              View All
            </Button>
          )}
        </div>

        {/* News items list */}
        {newsItems.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-3">
            {newsItems.slice(0, news_count || 3).map((item) => (
              <li key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                {item.board?.abbreviation && (
                  <p className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                    {item.board.abbreviation}
                  </p>
                )}
                <a
                  href={`/news/${item.slug}`}
                  className="mt-1 block text-sm font-semibold leading-snug text-primary hover:text-primary-vivid"
                >
                  {item.title}
                </a>
                {item.publishedDate && (
                  <p className="mt-1 text-xs text-text-muted">
                    {new Intl.DateTimeFormat('en-CA', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    }).format(new Date(item.publishedDate))}
                  </p>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-muted">No news available.</p>
        )}
      </Container>
    </div>
  )
}
