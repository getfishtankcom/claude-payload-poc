/**
 * @description
 * Client component for Decision Summaries listing with pagination.
 *
 * Key features:
 * - Client-side pagination via Pagination component
 * - Items per page selection
 * - Empty state handling
 *
 * @dependencies
 * - Pagination: Pagination controls
 */
'use client'

import React, { useState } from 'react'
import { Pagination } from '@/components/Pagination'

type DecisionSummary = Record<string, unknown>

type DecisionSummariesClientProps = {
  items: DecisionSummary[]
  boardSlug: string
}

export function DecisionSummariesClient({ items, boardSlug }: DecisionSummariesClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalItems = items.length
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const start = (currentPage - 1) * itemsPerPage
  const paginatedItems = items.slice(start, start + itemsPerPage)

  if (items.length === 0) {
    return (
      <p className="text-text-muted italic">
        No decision summaries available for this board.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Items per page selector */}
      <div className="flex items-center gap-2 text-sm text-text-muted">
        <label htmlFor="items-per-page">Items per page:</label>
        <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={(e) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="rounded border border-gray-300 px-2 py-1 text-sm"
        >
          {[5, 10, 25, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="ml-auto">
          Showing {start + 1}–{Math.min(start + itemsPerPage, totalItems)} of {totalItems}
        </span>
      </div>

      {/* Decision summaries list */}
      <ul className="flex flex-col gap-4">
        {paginatedItems.map((doc) => (
          <li
            key={doc.id as string}
            className="rounded-md border border-gray-200 p-4 hover:bg-surface-subtle transition-colors"
          >
            <a href={`/${boardSlug}/decision-summaries/${doc.slug}`} className="block">
              <h2 className="text-lg font-semibold text-primary hover:text-primary-vivid">
                {doc.title as string}
              </h2>
              {typeof doc.publishedDate === 'string' && (
                <p className="mt-1 text-sm text-text-muted">
                  {new Date(doc.publishedDate).toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
              {typeof doc.summary === 'string' && (
                <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                  {doc.summary}
                </p>
              )}
            </a>
          </li>
        ))}
      </ul>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onChange={setCurrentPage}
        />
      )}
    </div>
  )
}
