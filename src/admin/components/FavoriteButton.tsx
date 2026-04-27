/**
 * Star toggle for pinning the current admin doc as a favorite.
 *
 * Renders a filled star when pinned, outline when not. Fully keyboard-
 * accessible — `aria-pressed` reflects state and `aria-label` flips
 * between "Pin" / "Unpin".
 */
'use client'

import React from 'react'
import { useFavorites, type FavoriteItem } from '../hooks/useFavorites'

export interface FavoriteButtonProps extends Omit<FavoriteItem, 'pinnedAt'> {
  /** Override icon size in pixels. Defaults to 18. */
  size?: number
}

export function FavoriteButton({ id, title, collection, path, size = 18 }: FavoriteButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const pinned = isFavorite(id, collection)

  return (
    <button
      type="button"
      onClick={() =>
        toggleFavorite({ id, title, collection, path, pinnedAt: new Date().toISOString() })
      }
      aria-pressed={pinned}
      aria-label={pinned ? 'Unpin from favorites' : 'Pin to favorites'}
      title={pinned ? 'Pinned' : 'Pin to favorites'}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        padding: '4px',
        color: pinned ? '#F59E0B' : 'var(--theme-elevation-400)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill={pinned ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
    </button>
  )
}
