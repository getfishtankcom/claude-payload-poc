/**
 * Dashboard widget — shows the current user's pinned items.
 *
 * Reads from useFavorites (localStorage). Empty state when nothing is
 * pinned yet. Items link to the corresponding edit view.
 */
'use client'

import React from 'react'
import { useFavorites } from '../../hooks/useFavorites'
import { WidgetCard } from './WidgetCard'

export function PinnedItemsWidget() {
  const { favorites, toggleFavorite } = useFavorites()
  const items = favorites.slice(0, 10)

  return (
    <WidgetCard title="Pinned Items" testId="widget-pinned-items">
      {items.length === 0 ? (
        <p
          style={{
            fontSize: '13px',
            color: 'var(--text-secondary)',
            margin: '12px 0',
          }}
        >
          No pinned items yet. Click the star on any doc to pin it.
        </p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {items.map((item) => (
            <li
              key={`${item.collection}:${item.id}`}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}
            >
              <span
                style={{
                  fontSize: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.4px',
                  background: 'var(--surface-sunken)',
                  color: 'var(--text-secondary)',
                  padding: '2px 6px',
                  borderRadius: '3px',
                  flexShrink: 0,
                }}
              >
                {item.collection}
              </span>
              <a
                href={item.path}
                style={{
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {item.title}
              </a>
              <button
                type="button"
                onClick={() => toggleFavorite(item)}
                aria-label={`Unpin ${item.title}`}
                title="Unpin"
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  // --text-muted (#696969 on white = 5.7:1) clears AA for the
                  // 14px close glyph, where --theme-elevation-400 (~3:1) did not.
                  color: 'var(--text-muted)',
                  fontSize: '14px',
                  padding: '0 4px',
                }}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </WidgetCard>
  )
}
