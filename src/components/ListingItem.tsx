/**
 * @description
 * Listing item component for Resources, News, and other listing pages.
 * Shows date, category badges, linked title, and excerpt.
 *
 * Key features:
 * - Date formatted "Month DD, YYYY" above title
 * - Category badge/chip(s) rendered
 * - Title as purple linked text
 * - External link icon when isExternal is true
 * - 2-3 sentence excerpt, text only
 *
 * @dependencies
 * - next/link: Client-side navigation
 * - Badge: From ui/ for category chips
 *
 * @notes
 * - Server component — no interactivity
 * - Date uses Intl.DateTimeFormat for locale-aware formatting
 */
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
 * Formats an ISO date string to "Month DD, YYYY" format.
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date)
}

export function ListingItem({ item, className = '' }: ListingItemProps) {
  const { date, categories, title, href, excerpt, isExternal } = item

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
        {formatDate(date)}
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
              {cat}
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
