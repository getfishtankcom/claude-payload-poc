/**
 * Client component for the Resources listing page. Fetch loop + pagination
 * state are owned by `usePaginatedListing` — this file is rendering only.
 * Category and type filters localize their labels via the
 * `listings.resourceCategories.*` / `listings.resourceTypes.*` keys; the
 * `apiValue` stays EN to match the indexed value.
 */
'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CategoryPills } from '@/components/CategoryPills'
import { SortFilterBar } from '@/components/SortFilterBar'
import { ListingItem } from '@/components/ListingItem'
import { Pagination } from '@/components/Pagination'
import { usePaginatedListing } from '@/hooks/usePaginatedListing'

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
  const [typeFilter, setTypeFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

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
  } = usePaginatedListing<ResourceDoc>({
    endpoint: '/api/resources',
    filters: { category, type: typeFilter, sort, startDate, endDate },
  })

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

  const categoryPillOptions = CATEGORY_DEFS.map((def) => ({
    label: def.key === 'all' ? t('allItems') : tCats(def.key),
    value: def.apiValue,
    isActive: def.apiValue === '' ? category === '' : category === def.apiValue,
  }))

  const typeFilterOptions = TYPE_DEFS.map((def) => ({
    label: def.key === 'all' ? tTypes('all') : tTypes(def.key),
    value: def.apiValue,
  }))

  return (
    <div className="mt-6">
      <CategoryPills options={categoryPillOptions} onChange={(val) => setCategory(val)} />

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
        onDateRangeChange={(s, e) => {
          setStartDate(s)
          setEndDate(e)
        }}
      />

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
