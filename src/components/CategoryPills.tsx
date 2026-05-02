/**
 * @description
 * Category pills component for filtering listing pages.
 * Desktop: horizontal pill row. Mobile (< 768px): collapses to select dropdown.
 *
 * Key features:
 * - "All Items" as first option (default active), resets filter
 * - Active pill: filled dark background, white text
 * - Inactive pill: outline/ghost, dark text
 * - Mobile collapses to native select dropdown
 * - Client component for filter interaction
 *
 * @dependencies
 * - Design tokens from globals.css: colors, typography
 *
 * @notes
 * - Client component due to onChange callback and responsive behavior
 * - onChange fires with the selected value (empty string for "All Items")
 */
'use client'

type CategoryPillOption = {
  /** Display label */
  label: string
  /** Filter value */
  value: string
  /** Whether this pill is currently active */
  isActive: boolean
}

type CategoryPillsProps = {
  /** Array of category filter options */
  options: CategoryPillOption[]
  /** Callback when a category is selected */
  onChange: (value: string) => void
  className?: string
}

export function CategoryPills({ options, onChange, className = '' }: CategoryPillsProps) {
  return (
    <div className={className} data-testid="category-pills">
      {/* Desktop: pill row */}
      <nav
        aria-label="Category filter"
        role="group"
        className="hidden flex-wrap gap-2 md:flex"
        data-testid="category-pills-desktop"
      >
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              option.isActive
                ? 'bg-gray-900 text-white'
                : 'border border-gray-400 text-gray-900 hover:bg-gray-100'
            }`}
            aria-pressed={option.isActive}
            data-testid={`category-pill-${option.value || 'all'}`}
          >
            {option.label}
          </button>
        ))}
      </nav>

      {/* Mobile: select dropdown */}
      <div className="md:hidden" data-testid="category-pills-mobile">
        <label htmlFor="category-select" className="sr-only">
          Category filter
        </label>
        <select
          id="category-select"
          value={options.find((o) => o.isActive)?.value ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-sm border border-gray-300 px-3 py-2 text-sm text-text-primary"
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
