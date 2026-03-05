'use client'

/**
 * @description
 * Tab pills component for toggling between views using URL query parameters.
 * Uses full page navigation (server-side) rather than client-side state.
 *
 * Key features:
 * - Active pill: filled dark background, white text
 * - Inactive pill: outline/ghost styling, dark text
 * - Tab switching via query params (e.g., ?tab=closed-for-comment)
 * - Accessible with proper aria roles and labels
 * - Responsive: pills on desktop (md+), select dropdown on mobile
 *
 * @dependencies
 * - next/link: For query param navigation without full page reload
 *
 * @notes
 * - Server component — no client-side state
 * - Used on Documents for Comment listing (Template 8) for Open/Closed toggle
 * - Mobile dropdown navigates via standard <a> redirect
 */
import Link from 'next/link'

type TabPillOption = {
  /** Display label for the pill */
  label: string
  /** Query parameter value to set when this pill is clicked */
  queryValue: string
  /** Whether this pill is currently active */
  isActive: boolean
}

type TabPillsProps = {
  /** Array of tab options to render */
  options: TabPillOption[]
  /** Name of the query parameter to use (e.g., "tab") */
  paramName: string
  /** Base path for the link (current page path) */
  basePath: string
  className?: string
}

export function TabPills({ options, paramName, basePath, className = '' }: TabPillsProps) {
  // Build href for a given option
  function buildHref(queryValue: string) {
    return queryValue ? `${basePath}?${paramName}=${queryValue}` : basePath
  }

  const activeOption = options.find((o) => o.isActive)

  return (
    <div className={className} data-testid="tab-pills">
      {/* Desktop: pill row (hidden below md) */}
      <nav
        aria-label="Tab navigation"
        className="hidden flex-wrap gap-2 md:flex"
        role="tablist"
      >
        {options.map((option) => (
          <Link
            key={option.queryValue}
            href={buildHref(option.queryValue)}
            role="tab"
            aria-selected={option.isActive}
            className={`inline-flex items-center rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-150 ${
              option.isActive
                ? 'bg-gray-900 text-white'
                : 'border border-gray-400 text-gray-900 hover:bg-gray-100'
            }`}
            data-testid={`tab-pill-${option.queryValue}`}
          >
            {option.label}
          </Link>
        ))}
      </nav>

      {/* Mobile: select dropdown (visible below md) */}
      <div className="md:hidden">
        <label htmlFor="tab-pills-mobile" className="sr-only">
          Select tab
        </label>
        {/* Use a native select that redirects on change via JS */}
        <select
          id="tab-pills-mobile"
          defaultValue={activeOption?.queryValue ?? ''}
          onChange={(e) => {
            // Navigate to the selected tab's URL
            const href = buildHref(e.target.value)
            window.location.href = href
          }}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 focus:border-primary focus:ring-1 focus:ring-primary"
          data-testid="tab-pills-mobile"
        >
          {options.map((option) => (
            <option key={option.queryValue} value={option.queryValue}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
