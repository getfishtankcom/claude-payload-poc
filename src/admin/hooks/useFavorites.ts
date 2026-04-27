/**
 * useFavorites — localStorage-backed pinned items list for the admin shell.
 *
 * Keys: `cms_favorites` → JSON array of FavoriteItem.
 *
 * The hook subscribes to the `storage` event so multiple admin tabs stay
 * in sync, and exposes `toggleFavorite` / `isFavorite` for callers.
 */
'use client'

import { useCallback, useEffect, useState } from 'react'

export interface FavoriteItem {
  id: string
  title: string
  collection: string
  path: string
  pinnedAt: string
}

const STORAGE_KEY = 'cms_favorites'

function readFavorites(): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x): x is FavoriteItem =>
        typeof x === 'object' && x !== null && 'id' in x && 'title' in x && 'collection' in x,
    )
  } catch {
    return []
  }
}

function writeFavorites(items: FavoriteItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => readFavorites())

  // Cross-tab sync: react to storage events from other admin tabs.
  useEffect(() => {
    if (typeof window === 'undefined') return
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        setFavorites(readFavorites())
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const toggleFavorite = useCallback((item: FavoriteItem) => {
    setFavorites((prev) => {
      const idx = prev.findIndex((f) => f.id === item.id && f.collection === item.collection)
      const next =
        idx >= 0
          ? prev.filter((_, i) => i !== idx)
          : [{ ...item, pinnedAt: new Date().toISOString() }, ...prev]
      writeFavorites(next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (id: string, collection?: string) =>
      favorites.some((f) => f.id === id && (!collection || f.collection === collection)),
    [favorites],
  )

  return { favorites, toggleFavorite, isFavorite }
}
