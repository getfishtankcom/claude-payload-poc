/**
 * @description
 * Search result card component for the Search Results page.
 * Displays a single search result with content type badge, metadata, and CTA.
 *
 * Key features:
 * - Content type badge (Standard, News, Webinar, etc.) using Badge component
 * - Board name and date display
 * - Linked title heading
 * - Truncated description text
 * - File info row for documents (e.g., "PDF · 2.4 MB")
 * - CTA link text varies by content type
 *
 * @dependencies
 * - Badge: Content type badge component from ui/
 * - next/link: Client-side navigation for title link and CTA
 *
 * @notes
 * - CTA text mapping: project→"Read More", news→"Read More", document-for-comment→"View Document",
 *   resource→"Download Guide", webinar→"Watch Recording", meeting→"Read Summary",
 *   guidance→"View Document", standard→"View Document"
 * - File info row only renders when fileType and fileSize are provided
 * - Description is truncated with line-clamp-2
 */
import React from 'react'
import { Link } from '@/i18n/navigation'
import { Badge } from '@/components/ui'

type ContentType =
  | 'standard'
  | 'news'
  | 'webinar'
  | 'meeting'
  | 'guidance'
  | 'consultation'
  | 'decision'
  | 'deadline'
  | 'resource'

type SearchResultCardProps = {
  /** Content type for the badge */
  contentType: ContentType
  /** Display label for the badge (overrides contentType if provided) */
  badgeLabel?: string
  /** Board name (e.g., "AcSB") */
  board?: string
  /** Formatted date string */
  date?: string
  /** Result title */
  title: string
  /** URL to the full result page */
  href: string
  /** Description/excerpt text */
  description?: string
  /** File type label (e.g., "PDF") — shown for documents */
  fileType?: string
  /** File size string (e.g., "2.4 MB") — shown for documents */
  fileSize?: string
  className?: string
}

/** Maps content type to CTA link text */
const ctaTextMap: Record<ContentType, string> = {
  standard: 'View Document',
  news: 'Read More',
  webinar: 'Watch Recording',
  meeting: 'Read Summary',
  guidance: 'View Document',
  consultation: 'View Document',
  decision: 'Read Summary',
  deadline: 'View Details',
  resource: 'Download Guide',
}

/** Maps content type to a human-readable badge label */
const badgeLabelMap: Record<ContentType, string> = {
  standard: 'Standard',
  news: 'News',
  webinar: 'Webinar',
  meeting: 'Meeting Summary',
  guidance: 'Guidance',
  consultation: 'Document for Comment',
  decision: 'Decision Summary',
  deadline: 'Deadline',
  resource: 'Resource',
}

export function SearchResultCard({
  contentType,
  badgeLabel,
  board,
  date,
  title,
  href,
  description,
  fileType,
  fileSize,
  className = '',
}: SearchResultCardProps) {
  const ctaText = ctaTextMap[contentType] || 'Read More'
  const displayBadge = badgeLabel || badgeLabelMap[contentType] || contentType

  return (
    <article
      className={`border-b border-gray-200 py-5 first:pt-0 last:border-b-0 ${className}`.trim()}
      data-testid="search-result-card"
    >
      {/* Top row: badge + board + date */}
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <Badge variant={contentType}>{displayBadge}</Badge>
        {board && (
          <span className="text-xs font-medium text-text-muted">{board}</span>
        )}
        {date && (
          <>
            <span className="text-xs text-gray-300" aria-hidden="true">·</span>
            <span className="text-xs text-text-muted">{date}</span>
          </>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-1.5">
        <Link
          href={href}
          className="text-base font-semibold text-text-heading hover:text-primary"
        >
          {title}
        </Link>
      </h3>

      {/* Description */}
      {description && (
        <p className="mb-2 text-sm text-text-muted line-clamp-2">{description}</p>
      )}

      {/* File info row — documents only */}
      {fileType && (
        <p className="mb-2 text-xs text-text-muted">
          {fileType}
          {fileSize && (
            <>
              <span className="mx-1" aria-hidden="true">·</span>
              {fileSize}
            </>
          )}
        </p>
      )}

      {/* CTA link */}
      <Link
        href={href}
        className="text-sm font-medium text-primary hover:text-primary-vivid"
      >
        {ctaText}
        <span className="ml-1" aria-hidden="true">→</span>
      </Link>
    </article>
  )
}
