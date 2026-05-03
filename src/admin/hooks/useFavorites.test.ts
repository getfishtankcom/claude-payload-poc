/**
 * Unit tests for the useFavorites hook.
 *
 * Validates:
 * - Reads from / writes to `cms_favorites` localStorage key
 * - toggleFavorite adds when missing, removes when present
 * - isFavorite respects the optional `collection` filter so two docs
 *   with the same numeric id but different collections don't collide
 * - Cross-tab sync via the `storage` event refreshes state
 */
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { useFavorites } from './useFavorites'

const STORAGE_KEY = 'cms_favorites'

const sample = {
  id: 'page-1',
  title: 'About Us',
  collection: 'pages',
  path: '/admin/collections/pages/page-1',
  pinnedAt: '2026-05-01T00:00:00Z',
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('useFavorites', () => {
  it('starts empty when localStorage is empty', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
    expect(result.current.isFavorite('page-1')).toBe(false)
  })

  it('toggleFavorite adds an item and persists it', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(sample))
    expect(result.current.favorites).toHaveLength(1)
    expect(result.current.favorites[0]?.id).toBe('page-1')
    expect(result.current.isFavorite('page-1', 'pages')).toBe(true)

    const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0].id).toBe('page-1')
  })

  it('toggleFavorite removes an item the second time it is called', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(sample))
    act(() => result.current.toggleFavorite(sample))
    expect(result.current.favorites).toHaveLength(0)
    expect(result.current.isFavorite('page-1')).toBe(false)
  })

  it('isFavorite scopes by collection when provided', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite(sample))
    expect(result.current.isFavorite('page-1', 'pages')).toBe(true)
    // Same numeric id under a different collection must NOT match.
    expect(result.current.isFavorite('page-1', 'news')).toBe(false)
  })

  it('storage events from other tabs refresh the in-memory list', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([sample]))
      window.dispatchEvent(
        new StorageEvent('storage', {
          key: STORAGE_KEY,
          newValue: JSON.stringify([sample]),
        }),
      )
    })
    expect(result.current.favorites).toHaveLength(1)
  })

  it('returns empty list when localStorage value is malformed', () => {
    window.localStorage.setItem(STORAGE_KEY, 'not-json')
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites).toEqual([])
  })
})
