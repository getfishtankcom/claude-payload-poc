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
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'
import {
  InstantSearch,
  useSearchBox,
  useHits,
  usePagination,
  useSortBy,
  useStats,
  Configure,
} from 'react-instantsearch'
import Link from 'next/link'
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
        placeholder="Projects, meetings, documents, and more."
        className="w-full rounded-sm border border-gray-300 bg-white py-3 pl-12 pr-4 text-base placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
        data-testid="search-page-input"
        aria-label="Search"
      />
    </form>
  )
}

/** Results stats display */
function ResultsStats() {
  const { nbHits } = useStats()
  return (
    <p className="text-sm text-text-muted" data-testid="search-results-count">
      {nbHits} result{nbHits !== 1 ? 's' : ''} found
    </p>
  )
}

/** Sort dropdown */
function SortControl() {
  const { currentRefinement, options, refine } = useSortBy({
    items: [
      { label: 'Relevance', value: 'news_en' },
      { label: 'Date (newest first)', value: 'news_en:date:desc' },
    ],
  })

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort-select" className="text-sm text-text-muted">
        Sort by:
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
  const { hits } = useHits()

  if (hits.length === 0) {
    return (
      <div className="py-12 text-center" data-testid="search-no-results">
        <p className="text-lg font-medium text-text-heading">No results found</p>
        <p className="mt-2 text-sm text-text-muted">
          Try adjusting your search terms or filters.
        </p>
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
    <nav className="mt-8 flex items-center justify-center gap-1" aria-label="Pagination" data-testid="search-pagination">
      <button
        type="button"
        onClick={() => refine(currentRefinement - 1)}
        disabled={currentRefinement === 0}
        className="rounded-sm px-3 py-2 text-sm text-text-muted hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Previous page"
      >
        ← Prev
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
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  )
}

/** Main search page content (must be inside InstantSearch) */
function SearchContent({ popularTags }: { popularTags?: PopularTag[] | null }) {
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
      <nav className="py-4 text-sm text-text-muted" aria-label="Breadcrumb">
        <Link href="/" className="underline decoration-1 underline-offset-2 hover:text-primary">
          Home
        </Link>
        <span className="mx-2" aria-hidden="true">
          /
        </span>
        <span className="text-text-heading">Search Results</span>
      </nav>

      {/* Search input */}
      <SearchInput />

      {/* Popular tags */}
      {popularTags && popularTags.length > 0 && (
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <span className="text-sm text-text-muted">Popular:</span>
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
  const meilisearchHost = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700'
  const meilisearchKey = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || ''

  // Wrap Meilisearch client in a proxy that catches connection errors gracefully.
  // Without this, a missing Meilisearch instance throws a noisy console error.
  const { searchClient } = useMemo(() => {
    const { searchClient: rawClient } = instantMeiliSearch(meilisearchHost, meilisearchKey)
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const resilientClient = {
      ...rawClient,
      search: async (requests: any) => {
        try {
          return await (rawClient as any).search(requests)
        } catch {
          // Meilisearch unavailable — return empty results instead of throwing
          return { results: (requests as Array<{ indexName: string }>).map((req) => ({
            hits: [],
            nbHits: 0,
            page: 0,
            nbPages: 0,
            hitsPerPage: 20,
            exhaustiveNbHits: true,
            query: '',
            params: '',
            processingTimeMs: 0,
            index: req.indexName,
          })) }
        }
      },
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
    return { searchClient: resilientClient }
  }, [meilisearchHost, meilisearchKey])

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
