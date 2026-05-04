/**
 * @description
 * Scroll-spy sidebar navigation for committee directory (Template 14).
 * Renders "On this page" heading with anchor links corresponding to H2 headings.
 * Uses Intersection Observer for scroll-spy active state highlighting.
 *
 * Key features:
 * - "On this page" heading with vertical anchor link list
 * - Active state highlights current section via Intersection Observer
 * - Sticky positioning on desktop
 * - Mobile: collapsible "On this page" accordion
 *
 * @dependencies
 * - React hooks: useState, useEffect, useRef
 *
 * @notes
 * - Client component due to IntersectionObserver and interactive state
 * - Anchor IDs must match the IDs on the target H2 elements
 */
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'

export type AnchorNavItem = {
  label: string
  id: string
}

export type AnchorNavProps = {
  /** Anchor items corresponding to H2 headings on the page */
  items: AnchorNavItem[]
}

export function AnchorNav({ items }: AnchorNavProps) {
  const t = useTranslations('a11y')
  const [activeId, setActiveId] = useState<string>(items[0]?.id || '')
  const [isExpanded, setIsExpanded] = useState(false)
  const onThisPage = t('onThisPage')

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    // Find the first intersecting entry (topmost visible section)
    const visibleEntries = entries.filter((entry) => entry.isIntersecting)
    if (visibleEntries.length > 0) {
      setActiveId(visibleEntries[0].target.id)
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0,
    })

    items.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => observer.disconnect()
  }, [items, handleObserver])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <nav data-testid="anchor-nav" aria-label={onThisPage}>
      {/* Desktop: sticky sidebar */}
      <div className="hidden md:block sticky top-8">
        <p className="mb-3 text-sm font-semibold text-text-primary">{onThisPage}</p>
        <hr className="mb-3 border-gray-200" />
        <ul className="space-y-1.5" role="list">
          {items.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`block py-1 text-sm transition-colors ${
                  activeId === item.id
                    ? 'font-bold text-primary'
                    : 'text-text-muted hover:text-primary'
                }`}
                aria-current={activeId === item.id ? 'true' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile: expandable accordion */}
      <div className="md:hidden mb-6">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex w-full items-center justify-between rounded-md border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-text-primary"
          aria-expanded={isExpanded}
          data-testid="anchor-nav-toggle"
        >
          <span>{onThisPage}</span>
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {isExpanded && (
          <div className="mt-1 rounded-md border border-gray-200 bg-white p-3">
            <ul className="space-y-1.5" role="list">
              {items.map((item) => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    className={`block py-1 text-sm transition-colors ${
                      activeId === item.id
                        ? 'font-bold text-primary'
                        : 'text-text-muted hover:text-primary'
                    }`}
                    onClick={() => setIsExpanded(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  )
}
