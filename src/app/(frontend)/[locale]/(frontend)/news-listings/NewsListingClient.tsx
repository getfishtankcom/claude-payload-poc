/**
 * Client component for the News listing page. Fetch loop + pagination
 * state are owned by `usePaginatedListing` — this file is rendering
 * (filter chrome + list) only.
 *
 * @notes
 * - Board-specific mode pre-filters by board slug, shows the same category pills
 * - Volunteer mode shows board tabs in place of category pills, pre-filters
 *   `isVolunteerOpportunity`
 */
'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CategoryPills } from '@/components/CategoryPills'
import { SortFilterBar } from '@/components/SortFilterBar'
import { ListingItem } from '@/components/ListingItem'
import { Pagination } from '@/components/Pagination'
import { TabToggle } from '@/components/TabToggle'
import { usePaginatedListing } from '@/hooks/usePaginatedListing'

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
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filters = isVolunteerMode
    ? { board: volunteerBoard, volunteer: true, category, sort, startDate, endDate }
    : { board: boardSlug, category, sort, startDate, endDate }

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
  } = usePaginatedListing<NewsDoc>({ endpoint: '/api/news', filters })

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

  return (
    <div className="mt-6">
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
        onDateRangeChange={(s, e) => {
          setStartDate(s)
          setEndDate(e)
        }}
      />

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
