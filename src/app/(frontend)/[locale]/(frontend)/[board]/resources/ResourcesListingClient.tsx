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

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
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

/** Resource-specific categories. The `apiValue` is what the API filters
    by (must stay EN to match the indexed value); the displayed label is
    looked up via `listings.resourceCategories.<key>` at render. */
const CATEGORY_DEFS: ReadonlyArray<{ key: string; apiValue: string }> = [
  { key: 'all', apiValue: '' },
  { key: 'article', apiValue: 'Article' },
  { key: 'guidance', apiValue: 'Guidance' },
  { key: 'inBrief', apiValue: 'In Brief' },
  { key: 'other', apiValue: 'Other' },
  { key: 'webinar', apiValue: 'Webinar' },
]

/** Resource-type filter — same value/label split. Translated via
    `listings.resourceTypes.<key>`. */
const TYPE_DEFS: ReadonlyArray<{ key: string; apiValue: string }> = [
  { key: 'all', apiValue: '' },
  { key: 'audio', apiValue: 'Audio' },
  { key: 'externalLink', apiValue: 'External Link' },
  { key: 'pdf', apiValue: 'PDF' },
  { key: 'video', apiValue: 'Video' },
  { key: 'webpage', apiValue: 'Webpage' },
]

export function ResourcesListingClient({ standardSlug }: ResourcesListingClientProps) {
  const t = useTranslations('listings')
  const tCats = useTranslations('listings.resourceCategories')
  const tTypes = useTranslations('listings.resourceTypes')
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

  const sortOptions = useMemo(
    () => [
      { label: t('sortNewest'), value: 'newest' },
      { label: t('sortOldest'), value: 'oldest' },
    ],
    [t],
  )

  const itemsPerPageOptions = useMemo(
    () => [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '30', value: '30' },
      { label: t('allItems'), value: 'all' },
    ],
    [t],
  )

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

  const categoryPillOptions = CATEGORY_DEFS.map((def) => ({
    label: def.key === 'all' ? t('allItems') : tCats(def.key),
    value: def.apiValue,
    isActive: def.apiValue === '' ? category === '' : category === def.apiValue,
  }))

  const typeFilterOptions = TYPE_DEFS.map((def) => ({
    label: def.key === 'all' ? tTypes('all') : tTypes(def.key),
    value: def.apiValue,
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
        sortOptions={sortOptions}
        sortValue={sort}
        onSortChange={setSort}
        itemsPerPageOptions={itemsPerPageOptions}
        itemsPerPageValue={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        typeFilterOptions={typeFilterOptions}
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
          <div className="py-8 text-center text-text-muted">{t('loading')}</div>
        ) : docs.length === 0 ? (
          <div className="py-8 text-center text-text-muted">{t('noResources')}</div>
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
