/**
 * @description
 * Client component for the Resources listing page.
 * Handles interactive filtering, sorting, and pagination via API route.
 *
 * @dependencies
 * - CategoryPills, SortFilterBar, ListingItem, Pagination
 * - API: GET /api/resources
 *
 * @notes
 * - Fetches data on mount and when filters change
 * - Category pills for content type filtering
 * - Sort/filter bar with type filter and date range
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { CategoryPills } from '@/components/CategoryPills'
import { SortFilterBar } from '@/components/SortFilterBar'
import { ListingItem } from '@/components/ListingItem'
import { Pagination } from '@/components/Pagination'

type ResourceDoc = {
  id: string
  title: string
  slug: string
  category: string
  resourceType?: string
  date: string
  excerpt?: string
  externalUrl?: string
}

type ResourcesListingClientProps = {
  standardSlug: string
}

const CATEGORY_OPTIONS = [
  'All Items', 'Article', 'Guidance', 'In Brief', 'Other', 'Webinar',
]

const TYPE_OPTIONS = [
  { label: 'All Types', value: '' },
  { label: 'Audio', value: 'Audio' },
  { label: 'External Link', value: 'External Link' },
  { label: 'PDF', value: 'PDF' },
  { label: 'Video', value: 'Video' },
  { label: 'Webpage', value: 'Webpage' },
]

const SORT_OPTIONS = [
  { label: 'Publication date: Newest', value: 'newest' },
  { label: 'Publication date: Oldest', value: 'oldest' },
]

const ITEMS_PER_PAGE_OPTIONS = [
  { label: '10', value: '10' },
  { label: '20', value: '20' },
  { label: '30', value: '30' },
  { label: 'All', value: 'all' },
]

export function ResourcesListingClient({ standardSlug }: ResourcesListingClientProps) {
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState('newest')
  const [itemsPerPage, setItemsPerPage] = useState('10')
  const [typeFilter, setTypeFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<ResourceDoc[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (category) params.set('category', category)
    if (typeFilter) params.set('type', typeFilter)
    if (sort) params.set('sort', sort)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    if (itemsPerPage !== 'all') {
      params.set('limit', itemsPerPage)
      params.set('page', String(page))
    } else {
      params.set('limit', '500')
    }

    try {
      const res = await fetch(`/api/resources?${params.toString()}`)
      const data = await res.json()
      setDocs(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
    } catch {
      setDocs([])
      setTotalDocs(0)
    } finally {
      setLoading(false)
    }
  }, [category, sort, itemsPerPage, typeFilter, startDate, endDate, page])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [category, sort, itemsPerPage, typeFilter, startDate, endDate])

  const categoryPillOptions = CATEGORY_OPTIONS.map((cat) => ({
    label: cat,
    value: cat === 'All Items' ? '' : cat,
    isActive: cat === 'All Items' ? category === '' : category === cat,
  }))

  const currentLimit = itemsPerPage === 'all' ? 500 : Number(itemsPerPage)

  return (
    <div className="mt-6">
      {/* Category pills */}
      <CategoryPills
        options={categoryPillOptions}
        onChange={(val) => setCategory(val)}
      />

      {/* Sort/filter bar */}
      <SortFilterBar
        className="mt-4"
        sortOptions={SORT_OPTIONS}
        sortValue={sort}
        onSortChange={setSort}
        itemsPerPageOptions={ITEMS_PER_PAGE_OPTIONS}
        itemsPerPageValue={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        typeFilterOptions={TYPE_OPTIONS}
        typeFilterValue={typeFilter}
        onTypeFilterChange={setTypeFilter}
        showDateRange
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={(s, e) => { setStartDate(s); setEndDate(e) }}
      />

      {/* Results */}
      <div className="mt-6" data-testid="section-listing-results">
        {loading ? (
          <div className="py-8 text-center text-text-muted">Loading resources...</div>
        ) : docs.length === 0 ? (
          <div className="py-8 text-center text-text-muted">No resources found</div>
        ) : (
          <div className="space-y-0">
            {docs.map((doc) => (
              <ListingItem
                key={doc.id}
                item={{
                  date: doc.date,
                  categories: doc.category ? [doc.category] : [],
                  title: doc.title,
                  href: doc.externalUrl || `/${standardSlug}/resources/${doc.slug}`,
                  excerpt: doc.excerpt || '',
                  isExternal: !!doc.externalUrl,
                }}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalDocs > 0 && itemsPerPage !== 'all' && (
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
