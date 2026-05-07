/**
 * Client component for the Meetings & Events listing page. Tab toggle owns
 * timeframe; fetch loop and pagination state are owned by
 * `usePaginatedListing`.
 *
 * @notes
 * - Default view: Past meetings tab active
 * - No category filters, no sort, no date range
 * - Upcoming: date >= today, sort ascending
 * - Past: date < today, sort descending
 */
'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'
import { TabToggle } from '@/components/TabToggle'
import { Pagination } from '@/components/Pagination'
import { usePaginatedListing } from '@/hooks/usePaginatedListing'

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

  const {
    docs,
    totalDocs,
    loading,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    currentLimit,
    showPagination,
  } = usePaginatedListing<MeetingDoc>({
    endpoint: '/api/meetings',
    filters: { board: boardSlug, timeframe },
  })

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <TabToggle
          options={[
            { label: 'Upcoming', value: 'upcoming', isActive: timeframe === 'upcoming' },
            { label: 'Past', value: 'past', isActive: timeframe === 'past' },
          ]}
          onChange={(val) => setTimeframe(val as 'upcoming' | 'past')}
        />

        <div className="flex items-center gap-2">
          <label
            htmlFor="meetings-per-page"
            className="text-xs font-semibold uppercase tracking-wide text-text-muted"
          >
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
              <article
                key={doc.id}
                className="border-b border-gray-200 pb-5"
                data-testid="meeting-item"
              >
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
                  <p className="mt-2 text-base leading-relaxed text-text-primary">{doc.excerpt}</p>
                )}
              </article>
            ))}
          </div>
        )}

        {showPagination && (
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
