/**
 * @description
 * Client component for the Meetings & Events listing page.
 * Handles Upcoming/Past tab toggle, items per page, and pagination via API route.
 *
 * Key features:
 * - TabToggle for Upcoming/Past switching
 * - Items Per Page dropdown (10 default)
 * - Meeting items displayed as linked title + excerpt
 * - Server-side pagination for large datasets (180+ items)
 *
 * @dependencies
 * - TabToggle, Pagination
 * - API: GET /api/meetings
 *
 * @notes
 * - Default view: Past meetings tab active
 * - No category filters, no sort, no date range
 * - Upcoming: date >= today, sort ascending
 * - Past: date < today, sort descending
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { TabToggle } from '@/components/TabToggle'
import { Pagination } from '@/components/Pagination'

type MeetingDoc = {
  id: string
  title: string
  slug: string
  date: string
  excerpt?: string
  type: string
}

type MeetingsListingClientProps = {
  boardSlug: string
}

const ITEMS_PER_PAGE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '30', value: '30' },
]

export function MeetingsListingClient({ boardSlug }: MeetingsListingClientProps) {
  const [timeframe, setTimeframe] = useState<'upcoming' | 'past'>('past')
  const [itemsPerPage, setItemsPerPage] = useState('10')
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<MeetingDoc[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    params.set('board', boardSlug)
    params.set('timeframe', timeframe)
    params.set('limit', itemsPerPage)
    params.set('page', String(page))

    try {
      const res = await fetch(`/api/meetings?${params.toString()}`)
      const data = await res.json()
      setDocs(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
    } catch {
      setDocs([])
      setTotalDocs(0)
    } finally {
      setLoading(false)
    }
  }, [boardSlug, timeframe, itemsPerPage, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page when tab or items per page changes
  useEffect(() => {
    setPage(1)
  }, [timeframe, itemsPerPage])

  const currentLimit = Number(itemsPerPage)

  return (
    <div className="mt-6">
      {/* Tab toggle + Items per page */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabToggle
          options={[
            { label: 'Upcoming', value: 'upcoming', isActive: timeframe === 'upcoming' },
            { label: 'Past', value: 'past', isActive: timeframe === 'past' },
          ]}
          onChange={(val) => setTimeframe(val as 'upcoming' | 'past')}
        />

        <div className="flex items-center gap-2">
          <label htmlFor="meetings-per-page" className="text-xs font-semibold uppercase tracking-wide text-text-muted">
            Items Per Page
          </label>
          <select
            id="meetings-per-page"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(e.target.value)}
            className="rounded-sm border border-gray-300 px-3 py-2 text-sm text-text-primary"
            data-testid="meetings-items-per-page"
          >
            {ITEMS_PER_PAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="mt-6" data-testid="section-meetings-results">
        {loading ? (
          <div className="py-8 text-center text-text-muted">Loading meetings...</div>
        ) : docs.length === 0 ? (
          <div className="py-8 text-center text-text-muted">
            No {timeframe} meetings & events found
          </div>
        ) : (
          <div className="space-y-6">
            {docs.map((doc) => (
              <article key={doc.id} className="border-b border-gray-200 pb-5" data-testid="meeting-item">
                <h2 className="text-lg">
                  <Link
                    href={`/${boardSlug}/meetings-and-events/${doc.slug}`}
                    className="font-semibold text-primary hover:underline"
                    data-testid="meeting-item-title"
                  >
                    {doc.title}
                  </Link>
                </h2>
                {doc.excerpt && (
                  <p className="mt-2 text-base leading-relaxed text-text-primary">
                    {doc.excerpt}
                  </p>
                )}
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalDocs > 0 && (
          <Pagination
            className="mt-6"
            totalItems={totalDocs}
            itemsPerPage={currentLimit}
            currentPage={page}
            onChange={setPage}
          />
        )}
      </div>
    </div>
  )
}
