/**
 * @description
 * News item component displaying date, linked title, excerpt, and "Read More" link.
 * Used in Board Detail sidebar, Homepage news section, and Search Results.
 *
 * @dependencies
 * - next/link: Client-side navigation for news links
 * - Design tokens from globals.css: text colors, typography
 *
 * @notes
 * - Date formatted using Intl.DateTimeFormat for locale-aware display
 * - Link destination: /news/{slug}
 * - Server component by default (no interactivity needed)
 * - Excerpt can be hidden with showExcerpt=false for compact listings
 */
import React from 'react'
import { Link } from '@/i18n/navigation'

type NewsItemData = {
  title: string
  date: string
  excerpt: string
  slug: string
  category?: string
  board?: { abbreviation: string }
}

type NewsItemProps = {
  /** News data object */
  news: NewsItemData
  /** Whether to show the excerpt paragraph */
  showExcerpt?: boolean
  className?: string
}

/**
 * Formats an ISO date string to a human-readable format.
 * Example: '2026-02-15T00:00:00.000Z' -> 'February 15, 2026'
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function NewsItem({ news, showExcerpt = true, className = '' }: NewsItemProps) {
  const { title, date, excerpt, slug } = news
  const newsUrl = `/news/${slug}`

  return (
    <article className={`${className}`.trim()} data-testid="news-item">
      {/* Date */}
      <time dateTime={date} className="text-sm text-text-muted">
        {formatDate(date)}
      </time>

      {/* Title as link */}
      <h3 className="mt-1">
        <Link
          href={newsUrl}
          className="text-lg font-semibold text-primary hover:underline"
        >
          {title}
        </Link>
      </h3>

      {/* Excerpt */}
      {showExcerpt && excerpt && (
        <p className="mt-2 text-base text-text-primary line-clamp-3">{excerpt}</p>
      )}

      {/* Read More link */}
      <Link
        href={newsUrl}
        className="mt-2 inline-flex items-center text-sm font-medium text-primary hover:text-primary-vivid"
      >
        Read More
        <span className="ml-1" aria-hidden="true">
          &rarr;
        </span>
      </Link>
    </article>
  )
}
