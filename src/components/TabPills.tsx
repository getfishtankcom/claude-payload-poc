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
 *
 * @dependencies
 * - next/link: For query param navigation without full page reload
 *
 * @notes
 * - Server component — no client-side state
 * - Used on Documents for Comment listing (Template 8) for Open/Closed toggle
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
  return (
    <nav
      aria-label="Tab navigation"
      className={`flex flex-wrap gap-2 ${className}`.trim()}
      data-testid="tab-pills"
      role="tablist"
    >
      {options.map((option) => {
        const href = option.queryValue
          ? `${basePath}?${paramName}=${option.queryValue}`
          : basePath

        return (
          <Link
            key={option.queryValue}
            href={href}
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
        )
      })}
    </nav>
  )
}
