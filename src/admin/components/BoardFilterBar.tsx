/**
 * Board filter bar for Payload admin collection list views.
 *
 * Renders a horizontal row of board buttons (All / AcSB / PSAB / CSSB / AASB / RASOC).
 * Clicking a board appends `?where[board][equals]=<slug>` to the URL; All clears it.
 * The active board is read directly from the URL so the filter survives pagination
 * and refreshes.
 *
 * Registered per-collection via admin.components.beforeListTable.
 */
'use client'

import React, { useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface BoardOption {
  slug: string | null
  label: string
}

const BOARDS: BoardOption[] = [
  { slug: null, label: 'All' },
  { slug: 'acsb', label: 'AcSB' },
  { slug: 'psab', label: 'PSAB' },
  { slug: 'cssb', label: 'CSSB' },
  { slug: 'aasb', label: 'AASB' },
  { slug: 'rasoc', label: 'RASOC' },
]

const WHERE_KEY = 'where[board][equals]'

export function BoardFilterBar() {
  const router = useRouter()
  const params = useSearchParams()
  const active = params?.get(WHERE_KEY) ?? null

  // Build "click handler that swaps the where param while preserving everything else."
  const handleClick = useMemo(
    () => (slug: string | null) => {
      const usp = new URLSearchParams(params?.toString() ?? '')
      if (slug) usp.set(WHERE_KEY, slug)
      else usp.delete(WHERE_KEY)
      // Reset pagination when the filter changes.
      usp.delete('page')
      const qs = usp.toString()
      router.push(qs ? `?${qs}` : window.location.pathname)
    },
    [params, router],
  )

  return (
    <div
      data-testid="admin-board-filter"
      style={{
        display: 'flex',
        gap: '6px',
        alignItems: 'center',
        padding: '8px 0 12px',
        borderBottom: '1px solid var(--theme-elevation-150)',
        marginBottom: '12px',
        flexWrap: 'wrap',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          color: 'var(--theme-elevation-500)',
          marginRight: '4px',
        }}
      >
        Board:
      </span>
      {BOARDS.map((b) => {
        const isActive = active === b.slug || (active == null && b.slug == null)
        return (
          <button
            key={b.label}
            type="button"
            onClick={() => handleClick(b.slug)}
            aria-pressed={isActive}
            style={{
              padding: '4px 10px',
              borderRadius: '4px',
              border: '1px solid var(--theme-elevation-200)',
              fontSize: '12px',
              fontWeight: isActive ? 600 : 500,
              cursor: 'pointer',
              background: isActive ? '#601F5B' : 'var(--theme-elevation-0)',
              color: isActive ? '#ffffff' : 'var(--theme-elevation-700)',
              transition: 'background 120ms ease, color 120ms ease',
            }}
          >
            {b.label}
          </button>
        )
      })}
    </div>
  )
}

export default BoardFilterBar
