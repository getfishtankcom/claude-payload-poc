/**
 * @description
 * Client component for the News listing page.
 * Handles interactive filtering, sorting, and pagination via API route.
 *
 * Key features:
 * - Category pills for content type filtering
 * - Sort/filter bar (items per page + sort + date range, NO type filter)
 * - Supports board-specific and volunteer variants via props
 *
 * @dependencies
 * - CategoryPills, SortFilterBar, ListingItem, Pagination, TabPills
 * - API: GET /api/news
 *
 * @notes
 * - Board-specific mode: pre-filters by board slug, shows same category pills
 * - Volunteer mode: shows board tabs instead of category pills, pre-filters isVolunteerOpportunity
 */
'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useTranslations } from 'next-intl'
import { CategoryPills } from '@/components/CategoryPills'
import { SortFilterBar } from '@/components/SortFilterBar'
import { ListingItem } from '@/components/ListingItem'
import { Pagination } from '@/components/Pagination'
import { TabToggle } from '@/components/TabToggle'

type NewsDoc = {
  id: string
  title: string
  slug: string
  category?: string
  date: string
  excerpt?: string
  externalUrl?: string
  board?: { slug: string; abbreviation: string }
}

type NewsListingClientProps = {
  /** Pre-filter by board slug (board-specific news page) */
  boardSlug?: string
  /** Show volunteer mode with board tabs */
  isVolunteerMode?: boolean
}

/** Category id → translation key under listings.newsCategories.
    Display labels are pulled at render time so locale changes don't
    require remounting. The category VALUE sent to the API matches the
    raw English string the news collection is filtered by — only the
    label is localized. */
const NEWS_CATEGORY_DEFS: ReadonlyArray<{ id: string; apiValue: string }> = [
  { id: 'allItems', apiValue: '' },
  { id: 'documentForComment', apiValue: 'Document for Comment' },
  { id: 'internationalActivity', apiValue: 'International Activity' },
  { id: 'meetingSummary', apiValue: 'Meeting Summary' },
  { id: 'news', apiValue: 'News' },
  { id: 'resource', apiValue: 'Resource' },
]

const BOARD_TABS = ['AASB', 'CSSB', 'PSAB', 'RASOC', 'AcSB']

export function NewsListingClient({ boardSlug, isVolunteerMode }: NewsListingClientProps) {
  const tListings = useTranslations('listings')
  const tCategories = useTranslations('listings.newsCategories')
  const [category, setCategory] = useState('')
  const [volunteerBoard, setVolunteerBoard] = useState(BOARD_TABS[0].toLowerCase())
  const [sort, setSort] = useState('newest')
  const [itemsPerPage, setItemsPerPage] = useState('10')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<NewsDoc[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)

  const sortOptions = useMemo(
    () => [
      { label: tListings('sortNewest'), value: 'newest' },
      { label: tListings('sortOldest'), value: 'oldest' },
    ],
    [tListings],
  )

  const itemsPerPageOptions = useMemo(
    () => [
      { label: '10', value: '10' },
      { label: '20', value: '20' },
      { label: '30', value: '30' },
      { label: tListings('allItems'), value: 'all' },
    ],
    [tListings],
  )

  const fetchData = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()

    // Board filtering
    if (isVolunteerMode) {
      params.set('board', volunteerBoard)
      params.set('volunteer', 'true')
    } else if (boardSlug) {
      params.set('board', boardSlug)
    }

    if (category) params.set('category', category)
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
      const res = await fetch(`/api/news?${params.toString()}`)
      const data = await res.json()
      setDocs(data.docs || [])
      setTotalDocs(data.totalDocs || 0)
    } catch {
      setDocs([])
      setTotalDocs(0)
    } finally {
      setLoading(false)
    }
  }, [category, sort, itemsPerPage, startDate, endDate, page, boardSlug, isVolunteerMode, volunteerBoard])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [category, sort, itemsPerPage, startDate, endDate, volunteerBoard])

  const currentLimit = itemsPerPage === 'all' ? 500 : Number(itemsPerPage)

  return (
    <div className="mt-6">
      {/* Category pills or volunteer board tabs */}
      {isVolunteerMode ? (
        <TabToggle
          options={BOARD_TABS.map((tab) => ({
            label: tab,
            value: tab.toLowerCase(),
            isActive: volunteerBoard === tab.toLowerCase(),
          }))}
          onChange={setVolunteerBoard}
        />
      ) : (
        <CategoryPills
          options={NEWS_CATEGORY_DEFS.map((def) => ({
            label: def.id === 'allItems' ? tListings('allItems') : tCategories(def.id),
            value: def.apiValue,
            isActive: def.apiValue === '' ? category === '' : category === def.apiValue,
          }))}
          onChange={setCategory}
        />
      )}

      {/* Sort/filter bar */}
      <SortFilterBar
        className="mt-4"
        sortOptions={sortOptions}
        sortValue={sort}
        onSortChange={setSort}
        itemsPerPageOptions={itemsPerPageOptions}
        itemsPerPageValue={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
        showDateRange
        startDate={startDate}
        endDate={endDate}
        onDateRangeChange={(s, e) => { setStartDate(s); setEndDate(e) }}
      />

      {/* Results */}
      <div className="mt-6" data-testid="section-listing-results">
        {loading ? (
          <div className="py-8 text-center text-text-muted">{tListings('loading')}</div>
        ) : docs.length === 0 ? (
          <div className="py-8 text-center text-text-muted">{tListings('noNews')}</div>
        ) : (
          <div className="space-y-0">
            {docs.map((doc) => (
              <ListingItem
                key={doc.id}
                item={{
                  date: doc.date,
                  categories: doc.category ? [doc.category] : [],
                  title: doc.title,
                  href: doc.externalUrl || `/news/${doc.slug}`,
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
