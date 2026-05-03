/**
 * @description
 * Client-side search page component wired to Meilisearch via react-instantsearch.
 * Renders the full search experience: search bar, filter sidebar, results list,
 * sort controls, and pagination.
 *
 * Key features:
 * - InstantSearch wrapper connected to Meilisearch via @meilisearch/instant-meilisearch
 * - Search bar pre-filled with URL query param
 * - 2-column layout: FilterSidebar (left) + results (right)
 * - Sort dropdown: Relevance, Date (newest first)
 * - Pagination with "Showing X-Y of Z results"
 * - Recent/popular tag chips below search bar
 *
 * @dependencies
 * - react-instantsearch: InstantSearch, useSearchBox, useHits, usePagination, useSortBy
 * - @meilisearch/instant-meilisearch: instantMeiliSearch connector
 * - FilterSidebar: Faceted filter accordion
 * - SearchResultCard: Individual result display
 * - TagChip: Pill chips for tags
 * - Container: Layout wrapper
 *
 * @notes
 * - Client component (react-instantsearch requires client-side rendering)
 * - Meilisearch host and search key come from NEXT_PUBLIC_ env vars
 * - Searches across all _en indexes via multi-index search
 * - Filter refinements are applied via Meilisearch filter syntax
 */
'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { getSearchProvider } from '@/search'
import type { ProviderLocale } from '@/search/types'
import {
  InstantSearch,
  useSearchBox,
  useHits,
  usePagination,
  useSortBy,
  useStats,
  Configure,
} from 'react-instantsearch'
import { Link } from '@/i18n/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { Container } from '@/components/ui'
import { FilterSidebar } from '@/components/FilterSidebar'
import { SearchResultCard } from '@/components/SearchResultCard'
import { TagChip } from '@/components/TagChip'

type PopularTag = {
  label: string
  query: string
  id?: string
}

type SearchPageClientProps = {
  popularTags?: PopularTag[] | null
}

/** Maps Meilisearch index prefixes to SearchResultCard content types */
function inferContentType(
  hit: Record<string, unknown>,
): 'news' | 'resource' | 'consultation' | 'standard' | 'webinar' | 'meeting' | 'guidance' | 'decision' | 'deadline' {
  const contentType = hit.content_type as string | undefined
  if (contentType) {
    const typeMap: Record<string, 'news' | 'resource' | 'consultation' | 'standard' | 'webinar' | 'meeting' | 'guidance' | 'decision' | 'deadline'> = {
      news: 'news',
      project: 'standard',
      resource: 'resource',
      consultation: 'consultation',
      webinar: 'webinar',
      meeting: 'meeting',
      guidance: 'guidance',
      decision: 'decision',
      deadline: 'deadline',
    }
    return typeMap[contentType.toLowerCase()] || 'news'
  }
  return 'news'
}

/** Format a date string for display */
function formatDate(dateStr: unknown): string {
  if (!dateStr || typeof dateStr !== 'string') return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-CA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

/** Custom search box that syncs with URL */
function SearchInput() {
  const t = useTranslations('search')
  const { query, refine } = useSearchBox()
  const searchParams = useSearchParams()
  const [inputValue, setInputValue] = useState(query)

  // Sync from URL on mount
  useEffect(() => {
    const urlQuery = searchParams.get('q') || ''
    if (urlQuery && urlQuery !== query) {
      refine(urlQuery)
      setInputValue(urlQuery)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    refine(inputValue)
  }

  return (
    <form onSubmit={handleSubmit} className="relative mb-4">
      <MagnifyingGlassIcon
        className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />
      <input
        type="search"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value)
          refine(e.target.value)
        }}
        placeholder={t('searchInputPlaceholder')}
        className="w-full rounded-sm border border-gray-300 bg-white py-3 pl-12 pr-4 text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
        data-testid="search-page-input"
        aria-label={t('ariaLabel')}
      />
    </form>
  )
}

/** Results stats display */
function ResultsStats() {
  const t = useTranslations('search')
  const { nbHits } = useStats()
  return (
    <p className="text-sm text-text-muted" data-testid="search-results-count">
      {t('resultsFound', { count: nbHits, plural: nbHits !== 1 ? 's' : '' })}
    </p>
  )
}

/** Sort dropdown — hidden when there are no hits, since sort is a no-op against an empty result set */
function SortControl() {
  const t = useTranslations('search')
  const { nbHits } = useStats()
  // Sort option labels rebuild from translations on every render so they
  // re-evaluate on locale change; values stay stable (Meilisearch index keys).
  const { currentRefinement, options, refine } = useSortBy({
    items: [
      { label: t('sortRelevance'), value: 'news_en' },
      { label: t('sortDate'), value: 'news_en:date:desc' },
    ],
  })

  if (nbHits === 0) return null

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-text-muted">
        {t('sortBy')}
      </label>
      <select
        id="sort-select"
        value={currentRefinement}
        onChange={(e) => refine(e.target.value)}
        className="rounded-sm border border-gray-300 bg-white px-3 py-1.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
        data-testid="search-sort"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/** Hits list rendering */
function HitsList() {
  const t = useTranslations('search')
  const { hits } = useHits()

  if (hits.length === 0) {
    return (
      <div className="py-12 text-center" data-testid="search-no-results">
        <p className="text-lg font-medium text-text-heading">{t('noResultsFound')}</p>
        <p className="mt-2 text-sm text-text-muted">{t('tryAdjusting')}</p>
      </div>
    )
  }

  return (
    <div data-testid="search-results-list">
      {hits.map((hit) => {
        const hitData = hit as unknown as Record<string, unknown>
        return (
          <SearchResultCard
            key={hit.objectID}
            contentType={inferContentType(hitData)}
            board={(hitData.board as string) || ''}
            date={formatDate(hitData.date || hitData.updatedAt)}
            title={(hitData.title as string) || 'Untitled'}
            href={`/${hitData.slug || hit.objectID}`}
            description={(hitData.summary as string) || (hitData.body as string)?.slice(0, 200) || ''}
          />
        )
      })}
    </div>
  )
}

/** Pagination controls */
function SearchPagination() {
  const tPagination = useTranslations('pagination')
  const { currentRefinement, nbPages, refine } = usePagination()

  if (nbPages <= 1) return null

  // Show up to 5 page numbers centered around current page
  const maxVisible = 5
  const half = Math.floor(maxVisible / 2)
  let start = Math.max(0, currentRefinement - half)
  const end = Math.min(nbPages, start + maxVisible)
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible)
  }

  const pages = Array.from({ length: end - start }, (_, i) => start + i)

  return (
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label={tPagination('previous')} data-testid="search-pagination">
      <button
        type="button"
        onClick={() => refine(currentRefinement - 1)}
        disabled={currentRefinement === 0}
        className="rounded-sm px-3 py-2 text-sm text-text-muted hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={tPagination('previous')}
      >
        ← {tPagination('previous')}
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => refine(page)}
          className={`rounded-sm px-3 py-2 text-sm ${
            page === currentRefinement
              ? 'bg-primary text-white font-semibold'
              : 'text-text-primary hover:bg-gray-100'
          }`}
          aria-label={`Page ${page + 1}`}
          aria-current={page === currentRefinement ? 'page' : undefined}
        >
          {page + 1}
        </button>
      ))}

      <button
        type="button"
        onClick={() => refine(currentRefinement + 1)}
        disabled={currentRefinement >= nbPages - 1}
        className="rounded-sm px-3 py-2 text-sm text-text-muted hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label={tPagination('next')}
      >
        {tPagination('next')} →
      </button>
    </nav>
  )
}

/** Main search page content (must be inside InstantSearch) */
function SearchContent({ popularTags }: { popularTags?: PopularTag[] | null }) {
  const tSearch = useTranslations('search')
  const tBreadcrumb = useTranslations('breadcrumb')
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({})
  const { refine } = useSearchBox()

  const handleTagClick = useCallback(
    (query: string) => {
      refine(query)
    },
    [refine],
  )

  const handleClearAll = useCallback(() => {
    setActiveFilters({})
  }, [])

  const handleFilterChange = useCallback((sectionId: string, values: string[]) => {
    setActiveFilters((prev) => ({ ...prev, [sectionId]: values }))
  }, [])

  // Build Meilisearch filter string from active filters
  const filterString = useMemo(() => {
    const parts: string[] = []
    for (const [key, values] of Object.entries(activeFilters)) {
      if (values.length === 0) continue
      if (key === 'date') {
        // Date filters are handled differently — not a facet filter
        continue
      }
      const conditions = values.map((v) => `${key} = "${v}"`).join(' OR ')
      parts.push(`(${conditions})`)
    }
    return parts.join(' AND ')
  }, [activeFilters])

  return (
    <Container>
      {/* Breadcrumb */}
      <nav className="py-4 text-sm text-text-muted" aria-label={tBreadcrumb('home')}>
        <Link href="/" className="underline decoration-1 underline-offset-2 hover:text-primary">
          {tBreadcrumb('home')}
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-text-heading">{tSearch('title')}</span>
      </nav>

      {/* Search input */}
      <SearchInput />

      {/* Popular tags */}
      {popularTags && popularTags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-muted">{tSearch('popularPrefix')}</span>
          {popularTags.map((tag) => (
            <TagChip
              key={tag.id || tag.query}
              label={tag.label}
              onClick={() => handleTagClick(tag.query)}
            />
          ))}
        </div>
      )}

      {/* Configure filter string */}
      {filterString && <Configure {...({ filters: filterString } as Record<string, string>)} />}

      {/* 2-column layout: filters + results */}
      <div className="flex flex-col gap-6 pb-16 lg:flex-row">
        {/* Filter sidebar — stacks above on mobile, left column on desktop */}
        <div className="w-full lg:w-72 lg:flex-shrink-0">
          <FilterSidebar
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearAll={handleClearAll}
          />
        </div>

        {/* Results column */}
        <div className="flex-1">
          {/* Stats + Sort row */}
          <div className="mb-4 flex items-center justify-between">
            <ResultsStats />
            <SortControl />
          </div>

          {/* Results list */}
          <HitsList />

          {/* Pagination */}
          <SearchPagination />
        </div>
      </div>
    </Container>
  )
}

export function SearchPageClient({ popularTags }: SearchPageClientProps) {
  const locale = useLocale() as ProviderLocale

  // Dev-only console warning when the Meilisearch search key is missing
  // (the active default provider). Once Slice 2+ ships Algolia behind a
  // flag this check moves into the provider itself. (#160 / QA-112)
  const meilisearchKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || ''
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development' && !meilisearchKey) {
    // eslint-disable-next-line no-console
    console.warn(
      '[FRAS] NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY is empty. Search will return 0 results. ' +
        'Copy `.env.example` → `.env` (or fill in the existing key from .env.example) and restart.',
    )
  }

  // Provider-agnostic search client — `getSearchProvider()` reads the
  // SEARCH_PROVIDER env var and dispatches to the right adapter
  // (Meilisearch today; Algolia per #173+). The locale is forwarded for
  // when FR indexes come online in Slice 3. (#172 / Algolia Slice 1)
  const searchClient = useMemo(
    () => getSearchProvider().getSearchClient(locale),
    [locale],
  )

  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''

  return (
    <InstantSearch
      indexName="news_en"
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      searchClient={searchClient as any}
      initialUiState={{
        news_en: { query: initialQuery },
      }}
    >
      <SearchContent popularTags={popularTags} />
    </InstantSearch>
  )
}
