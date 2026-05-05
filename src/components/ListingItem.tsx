/**
 * @description
 * Listing item component for Resources, News, and other listing pages.
 * Shows date, category badges, linked title, and excerpt.
 *
 * Key features:
 * - Date formatted "Month DD, YYYY" above title (locale-aware)
 * - Category badge/chip(s) rendered with translated labels for known
 *   news/resource category strings
 * - Title as purple linked text
 * - External link icon when isExternal is true
 * - 2-3 sentence excerpt, text only
 *
 * @notes
 * - Client component — uses `useLocale` for fr-CA / en-CA date formatting
 *   and `useTranslations` to translate category badge labels. Categories
 *   that aren't in the dictionary fall back to the raw EN value.
 */
'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type ListingItemProps = {
  /** Item data */
  item: {
    /** ISO date string */
    date: string
    /** Category labels for badge display */
    categories: string[]
    /** Item title */
    title: string
    /** Link destination */
    href: string
    /** Short summary excerpt */
    excerpt: string
    /** Whether this links to an external resource */
    isExternal?: boolean
  }
  className?: string
}

/**
 * Formats an ISO date string to "Month DD, YYYY" in the active locale.
 * fr-CA renders "16 avril 2026" — month-name lowercase per French convention.
 */
function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  const intlLocale = locale === 'fr' ? 'fr-CA' : 'en-CA'
  return new Intl.DateTimeFormat(intlLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

/** Map raw EN category strings (the API/CMS values) to translation keys
    under `listings.newsCategories.*` + `listings.resourceCategories.*`.
    Anything not listed falls through to the raw value (back-compat for
    new category strings the dictionary hasn't caught up with yet). */
const CATEGORY_TO_TRANSLATION_KEY: Record<string, string> = {
  // News
  'Document for Comment': 'newsCategories.documentForComment',
  'International Activity': 'newsCategories.internationalActivity',
  'Meeting Summary': 'newsCategories.meetingSummary',
  News: 'newsCategories.news',
  Resource: 'newsCategories.resource',
  // Resources
  Article: 'resourceCategories.article',
  Guidance: 'resourceCategories.guidance',
  'In Brief': 'resourceCategories.inBrief',
  Other: 'resourceCategories.other',
  Webinar: 'resourceCategories.webinar',
}

export function ListingItem({ item, className = '' }: ListingItemProps) {
  const { date, categories, title, href, excerpt, isExternal } = item
  const locale = useLocale()
  const tListings = useTranslations('listings')

  function categoryLabel(raw: string): string {
    const key = CATEGORY_TO_TRANSLATION_KEY[raw]
    if (!key) return raw
    const value = tListings(key)
    // next-intl returns the key path on miss — never leak that.
    return value && value !== key ? value : raw
  }

  const titleContent = (
    <>
      {title}
      {isExternal && (
        <svg
          className="ml-1 inline-block h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          aria-label="External link"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
          />
        </svg>
      )}
    </>
  )

  return (
    <article
      className={`border-b border-gray-200 pb-5 ${className}`.trim()}
      data-testid="listing-item"
    >
      {/* Date */}
      <time dateTime={date} className="text-sm text-text-muted">
        {formatDate(date, locale)}
      </time>

      {/* Category badges */}
      {categories.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <span
              key={cat}
              className="inline-block rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-text-primary"
              data-testid={`listing-badge-${cat.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {categoryLabel(cat)}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h3 className="mt-2">
        {isExternal ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-semibold text-primary hover:underline"
            data-testid="listing-item-title"
          >
            {titleContent}
          </a>
        ) : (
          <Link
            href={href}
            className="text-lg font-semibold text-primary hover:underline"
            data-testid="listing-item-title"
          >
            {titleContent}
          </Link>
        )}
      </h3>

      {/* Excerpt */}
      {excerpt && (
        <p className="mt-2 text-base leading-relaxed text-text-primary line-clamp-3">
          {excerpt}
        </p>
      )}
    </article>
  )
}
