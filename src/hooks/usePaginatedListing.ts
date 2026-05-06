/**
 * Shared paginated-listing fetch loop for the frontend listing pages
 * (News, Resources, Meetings, etc.). Owns the items-per-page + page state
 * and the URLSearchParams + fetch + setLoading dance — call sites pass
 * their own filter values and render their own chrome and result rows.
 *
 * Why this exists: every listing page used to hand-roll the same
 * useState/useEffect/useCallback/fetch pattern, drift between them was
 * common (different error swallowing, different "all" limits, no shared
 * fix when pagination behavior needs to change). Concentrating the
 * fetch loop here makes the listing pages render-only.
 */
'use client'

import { useCallback, useEffect, useState } from 'react'

/** All values are coerced to strings before going into URLSearchParams.
 *  `undefined` / `''` / `false` keys are dropped. */
export type ListingFilters = Record<string, string | boolean | undefined>

export type UsePaginatedListingOptions = {
  /** API endpoint path, e.g. '/api/news'. */
  endpoint: string
  /** Filter values from the caller. Hook re-fetches when these change. */
  filters: ListingFilters
  /** Default items-per-page. Pass 'all' to bypass pagination cap. */
  defaultItemsPerPage?: string
  /** Limit sent to the API when itemsPerPage === 'all'. Default 500. */
  allLimit?: number
}

export type UsePaginatedListingResult<TDoc> = {
  docs: TDoc[]
  totalDocs: number
  loading: boolean
  page: number
  setPage: (n: number) => void
  itemsPerPage: string
  setItemsPerPage: (s: string) => void
  /** Numeric items-per-page for Pagination component. */
  currentLimit: number
  /** False when itemsPerPage === 'all' (no pagination chrome). */
  showPagination: boolean
}

function buildSearchParams(
  filters: ListingFilters,
  itemsPerPage: string,
  page: number,
  allLimit: number,
): string {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value === undefined || value === '' || value === false) continue
    params.set(key, value === true ? 'true' : value)
  }
  if (itemsPerPage === 'all') {
    params.set('limit', String(allLimit))
  } else {
    params.set('limit', itemsPerPage)
    params.set('page', String(page))
  }
  return params.toString()
}

/** Stable key for re-running the fetch effect when filters change. */
function filtersKey(filters: ListingFilters): string {
  return JSON.stringify(
    Object.entries(filters)
      .filter(([, v]) => v !== undefined && v !== '' && v !== false)
      .sort(([a], [b]) => a.localeCompare(b)),
  )
}

export function usePaginatedListing<TDoc>(
  options: UsePaginatedListingOptions,
): UsePaginatedListingResult<TDoc> {
  const { endpoint, filters, defaultItemsPerPage = '10', allLimit = 500 } = options

  const [itemsPerPage, setItemsPerPage] = useState(defaultItemsPerPage)
  const [page, setPage] = useState(1)
  const [docs, setDocs] = useState<TDoc[]>([])
  const [totalDocs, setTotalDocs] = useState(0)
  const [loading, setLoading] = useState(true)

  const fKey = filtersKey(filters)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const qs = buildSearchParams(filters, itemsPerPage, page, allLimit)
    try {
      const res = await fetch(`${endpoint}?${qs}`)
      const data = await res.json()
      setDocs((data.docs as TDoc[]) ?? [])
      setTotalDocs((data.totalDocs as number) ?? 0)
    } catch {
      setDocs([])
      setTotalDocs(0)
    } finally {
      setLoading(false)
    }
    // `filters` is captured by reference but `fKey` makes the dep change-tracking
    // explicit — when filter values flip, fKey changes, fetch reruns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, fKey, itemsPerPage, page, allLimit])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Reset to page 1 when any filter (or itemsPerPage) changes.
  useEffect(() => {
    setPage(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fKey, itemsPerPage])

  const currentLimit = itemsPerPage === 'all' ? allLimit : Number(itemsPerPage)
  const showPagination = itemsPerPage !== 'all' && totalDocs > 0

  return {
    docs,
    totalDocs,
    loading,
    page,
    setPage,
    itemsPerPage,
    setItemsPerPage,
    currentLimit,
    showPagination,
  }
}
