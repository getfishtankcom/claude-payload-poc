/**
 * @description
 * Sort and filter bar for listing pages (Resources, News).
 * Provides Sort By, Items Per Page, optional Type filter, and optional Date Range inputs.
 *
 * Key features:
 * - Sort By dropdown (Publication date: Newest / Oldest)
 * - Items Per Page dropdown (10, 20, 30, All)
 * - Optional Type filter dropdown
 * - Optional Date range inputs (start/end, date type inputs)
 * - Mobile: all fields stack vertically
 *
 * @dependencies
 * - Design tokens from globals.css
 *
 * @notes
 * - Client component for interactive form elements
 * - Controlled component — all values managed by parent
 */
'use client'

import { useTranslations } from 'next-intl'

type SelectOption = {
  label: string
  value: string
}

type SortFilterBarProps = {
  /** Sort options for the Sort By dropdown */
  sortOptions: SelectOption[]
  /** Current sort value */
  sortValue: string
  /** Callback when sort changes */
  onSortChange: (value: string) => void
  /** Items per page options */
  itemsPerPageOptions: SelectOption[]
  /** Current items per page value */
  itemsPerPageValue: string
  /** Callback when items per page changes */
  onItemsPerPageChange: (value: string) => void
  /** Optional type filter options */
  typeFilterOptions?: SelectOption[]
  /** Current type filter value */
  typeFilterValue?: string
  /** Callback when type filter changes */
  onTypeFilterChange?: (value: string) => void
  /** Whether to show date range inputs */
  showDateRange?: boolean
  /** Current start date value */
  startDate?: string
  /** Current end date value */
  endDate?: string
  /** Callback when date range changes */
  onDateRangeChange?: (start: string, end: string) => void
  className?: string
}

export function SortFilterBar({
  sortOptions,
  sortValue,
  onSortChange,
  itemsPerPageOptions,
  itemsPerPageValue,
  onItemsPerPageChange,
  typeFilterOptions,
  typeFilterValue = '',
  onTypeFilterChange,
  showDateRange = false,
  startDate = '',
  endDate = '',
  onDateRangeChange,
  className = '',
}: SortFilterBarProps) {
  const t = useTranslations('listings')
  return (
    <div
      className={`flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end ${className}`.trim()}
      data-testid="sort-filter-bar"
    >
      {/* Sort By */}
      <div className="flex flex-col gap-1">
        <label htmlFor="sort-by" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t('sortBy')}
        </label>
        <select
          id="sort-by"
          value={sortValue}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-text-primary"
          data-testid="sort-select"
        >
          {sortOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Items Per Page */}
      <div className="flex flex-col gap-1">
        <label htmlFor="items-per-page" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
          {t('itemsPerPage')}
        </label>
        <select
          id="items-per-page"
          value={itemsPerPageValue}
          onChange={(e) => onItemsPerPageChange(e.target.value)}
          className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-text-primary"
          data-testid="items-per-page-select"
        >
          {itemsPerPageOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Optional Type filter */}
      {typeFilterOptions && onTypeFilterChange && (
        <div className="flex flex-col gap-1">
          <label htmlFor="type-filter" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            {t('type')}
          </label>
          <select
            id="type-filter"
            value={typeFilterValue}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-text-primary"
            data-testid="type-filter-select"
          >
            {typeFilterOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Optional Date Range */}
      {showDateRange && onDateRangeChange && (
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:gap-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="start-date" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              {t('startDate')}
            </label>
            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => onDateRangeChange(e.target.value, endDate)}
              className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-text-primary"
              data-testid="start-date-input"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="end-date" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
              {t('endDate')}
            </label>
            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => onDateRangeChange(startDate, e.target.value)}
              className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-text-primary"
              data-testid="end-date-input"
            />
          </div>
        </div>
      )}
    </div>
  )
}
