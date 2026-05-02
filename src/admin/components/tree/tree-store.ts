'use client'

/**
 * @description
 * Persistent tree state store. Selection, expanded set, search query, and
 * scroll position survive navigation between any `/admin/*` route because
 * the store is module-scoped — its lifetime is the tab session, not any
 * single route.
 *
 * Implemented with a hand-rolled external store + `useSyncExternalStore`
 * to avoid pulling in zustand at this scaffolding stage. The shape is
 * intentionally close to zustand's so swapping is mechanical when the
 * dep lands.
 *
 * @notes
 * - Pure client module. The tree spine renders inside a 'use client' tree.
 * - Persisted to `sessionStorage` under one key so a hard reload restores
 *   selection + expansion. SSR-safe — guarded by `typeof window`.
 */

import * as React from 'react'

const STORAGE_KEY = 'fras.admin.tree.v1'

export type TreeState = {
  selectedId: string | null
  expanded: ReadonlySet<string>
  query: string
  scrollTop: number
}

const initialState: TreeState = {
  selectedId: null,
  expanded: new Set<string>(),
  query: '',
  scrollTop: 0,
}

const readPersisted = (): TreeState => {
  if (typeof window === 'undefined') return initialState
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return initialState
    const parsed = JSON.parse(raw) as {
      selectedId: string | null
      expanded: string[]
      query: string
      scrollTop: number
    }
    return {
      selectedId: parsed.selectedId ?? null,
      expanded: new Set(parsed.expanded ?? []),
      query: parsed.query ?? '',
      scrollTop: parsed.scrollTop ?? 0,
    }
  } catch {
    return initialState
  }
}

const writePersisted = (state: TreeState) => {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedId: state.selectedId,
        expanded: Array.from(state.expanded),
        query: state.query,
        scrollTop: state.scrollTop,
      }),
    )
  } catch {
    /* swallow quota errors — losing tree state is recoverable */
  }
}

let state: TreeState = readPersisted()
const listeners = new Set<() => void>()

const setState = (next: Partial<TreeState>) => {
  state = { ...state, ...next }
  writePersisted(state)
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => {
    listeners.delete(l)
  }
}

const getSnapshot = () => state
const getServerSnapshot = () => initialState

/**
 * Hook reading the full tree state. Components that only need a slice
 * should read from this and select with their own memo / equality check.
 */
export const useTreeState = (): TreeState =>
  React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

export const treeActions = {
  select: (id: string | null) => setState({ selectedId: id }),
  toggleExpanded: (id: string) => {
    const next = new Set(state.expanded)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setState({ expanded: next })
  },
  expand: (ids: string[]) => {
    const next = new Set(state.expanded)
    ids.forEach((id) => next.add(id))
    setState({ expanded: next })
  },
  setQuery: (query: string) => setState({ query }),
  setScrollTop: (scrollTop: number) => setState({ scrollTop }),
  reset: () => setState({ ...initialState, expanded: new Set() }),
}
