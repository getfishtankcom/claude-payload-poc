/**
 * @description
 * Pagination component with numbered page buttons, prev/next arrows,
 * and "Showing X-Y of Z results" summary text.
 *
 * Features:
 * - Ellipsis truncation when total pages > 7
 * - Prev/next buttons disabled at boundaries
 * - Current page visually highlighted with primary color
 * - Accessible with aria-labels on all buttons
 *
 * @dependencies
 * - Design tokens from globals.css: --color-primary, text colors
 *
 * @notes
 * - Uses client-side interactivity (onChange callback)
 * - Truncation algorithm: always show first, last, and 2 pages around current
 */
'use client'

import React from 'react'

type PaginationProps = {
  /** Total number of items across all pages */
  totalItems: number
  /** Number of items displayed per page */
  itemsPerPage?: number
  /** Current active page (1-indexed) */
  currentPage: number
  /** Callback when page changes */
  onChange: (page: number) => void
  className?: string
}

/**
 * Generates the page numbers to display, with ellipsis gaps.
 * Returns an array of numbers and null values (null = ellipsis).
 */
function getPageNumbers(current: number, total: number): (number | null)[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const pages: (number | null)[] = []

  // Always show page 1
  pages.push(1)

  // Determine the range around current page
  const rangeStart = Math.max(2, current - 1)
  const rangeEnd = Math.min(total - 1, current + 1)

  // Ellipsis before range if needed
  if (rangeStart > 2) {
    pages.push(null)
  }

  // Pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i)
  }

  // Ellipsis after range if needed
  if (rangeEnd < total - 1) {
    pages.push(null)
  }

  // Always show last page
  pages.push(total)

  return pages
}

export function Pagination({
  totalItems,
  itemsPerPage = 10,
  currentPage,
  onChange,
  className = '',
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Don't render pagination for single page or empty results
  if (totalPages <= 1) return null

  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)
  const pageNumbers = getPageNumbers(currentPage, totalPages)

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const baseButtonClasses =
    'inline-flex items-center justify-center min-w-[40px] h-10 rounded-sm text-sm font-medium transition-colors duration-150'

  return (
    <nav
      aria-label="Pagination"
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between ${className}`.trim()}
      data-testid="pagination"
    >
      {/* Results summary */}
      <p className="text-sm text-text-muted">
        Showing <span className="font-semibold text-text-primary">{startItem}</span>
        {' \u2013 '}
        <span className="font-semibold text-text-primary">{endItem}</span>
        {' of '}
        <span className="font-semibold text-text-primary">{totalItems}</span> results
      </p>

      {/* Page buttons */}
      <div className="flex items-center gap-1" role="group" aria-label="Page navigation">
        {/* Previous button */}
        <button
          type="button"
          onClick={() => onChange(currentPage - 1)}
          disabled={isFirstPage}
          className={`${baseButtonClasses} px-2 ${
            isFirstPage
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-text-primary hover:bg-gray-100 cursor-pointer'
          }`}
          aria-label="Go to previous page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, idx) => {
          if (page === null) {
            return (
              <span key={`ellipsis-${idx}`} className="px-1 text-text-muted" aria-hidden="true">
                &hellip;
              </span>
            )
          }

          const isCurrent = page === currentPage
          return (
            <button
              key={page}
              type="button"
              onClick={() => onChange(page)}
              className={`${baseButtonClasses} ${
                isCurrent
                  ? 'bg-primary text-white cursor-default'
                  : 'text-text-primary hover:bg-gray-100 cursor-pointer'
              }`}
              aria-label={`Go to page ${page}`}
              aria-current={isCurrent ? 'page' : undefined}
            >
              {page}
            </button>
          )
        })}

        {/* Next button */}
        <button
          type="button"
          onClick={() => onChange(currentPage + 1)}
          disabled={isLastPage}
          className={`${baseButtonClasses} px-2 ${
            isLastPage
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-text-primary hover:bg-gray-100 cursor-pointer'
          }`}
          aria-label="Go to next page"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
