/**
 * @description
 * Recent news sidebar widget for Board Detail and Project Detail pages.
 * Shows a "View All →" header link and a list of recent news items.
 *
 * Key features:
 * - "View All →" link with URL derived from board slug (not hardcoded)
 * - Reuses <NewsItem /> component for each news entry
 * - News items sorted by date descending (newest first) — sorting done by caller
 * - Displays max 3-5 items
 * - Empty state: section hidden when no news
 *
 * @dependencies
 * - NewsItem component for individual news rendering
 * - next/link for client-side navigation
 *
 * @notes
 * - Server component (no interactivity)
 * - Extends/reuses the existing NewsItem component from src/components/
 */
import React from 'react'
import Link from 'next/link'
import { NewsItem } from '@/components/NewsItem'

export type RecentNewsItem = {
  title: string
  date: string
  excerpt: string
  slug: string
  category?: string
  board?: { abbreviation: string }
}

type RecentNewsProps = {
  /** News items from CMS, pre-sorted by date descending */
  news: RecentNewsItem[]
  /** Board slug for constructing "View All" link */
  boardSlug: string
  className?: string
}

export function RecentNews({ news, boardSlug, className = '' }: RecentNewsProps) {
  if (news.length === 0) return null

  const viewAllUrl = `/news?board=${boardSlug}`

  return (
    <div className={`${className}`.trim()} data-testid="recent-news">
      {/* Header with View All link */}
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider text-text-heading">
          Most Recent News
        </h3>
        <Link
          href={viewAllUrl}
          className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-vivid"
        >
          View All
          <span className="ml-1" aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      {/* News items list */}
      <div className="space-y-5">
        {news.map((item) => (
          <NewsItem
            key={item.slug}
            news={item}
            showExcerpt
            className="border-b border-gray-200 pb-4 last:border-b-0"
          />
        ))}
      </div>
    </div>
  )
}
