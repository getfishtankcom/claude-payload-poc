/**
 * Back-to-top button. Appears once the user has scrolled past 400px;
 * smooth-scrolls to the top of the page on click.
 *
 * Uses an IntersectionObserver on a sentinel element near the page top
 * for cheap show/hide signal — no per-pixel scroll listeners.
 */
'use client'

import React, { useEffect, useRef, useState } from 'react'

export interface BackToTopProps {
  /** Pixels from the top after which the button appears. Default 400. */
  threshold?: number
  /** Override the default brand color via inline style. */
  className?: string
}

export function BackToTop({ threshold = 400, className }: BackToTopProps) {
  const [visible, setVisible] = useState(false)
  const sentinelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // The sentinel is inserted at `threshold` pixels into the page; when it
    // scrolls OUT of view, the user is below the threshold so we show the button.
    const sentinel = document.createElement('div')
    sentinel.style.position = 'absolute'
    sentinel.style.top = `${threshold}px`
    sentinel.style.left = '0'
    sentinel.style.width = '1px'
    sentinel.style.height = '1px'
    sentinel.style.pointerEvents = 'none'
    document.body.appendChild(sentinel)
    sentinelRef.current = sentinel

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        // Visible button when the sentinel is NOT intersecting (scrolled past).
        setVisible(!entry.isIntersecting)
      },
      { rootMargin: '0px' },
    )
    observer.observe(sentinel)

    return () => {
      observer.disconnect()
      sentinel.remove()
      sentinelRef.current = null
    }
  }, [threshold])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Back to top"
      className={className}
      style={{
        position: 'fixed',
        right: '24px',
        bottom: '24px',
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: '#601F5B',
        color: '#ffffff',
        border: 'none',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
      }}
    >
      <svg width={20} height={20} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fillRule="evenodd"
          d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}
