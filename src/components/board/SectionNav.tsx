/**
 * @description
 * Vertical section navigation sidebar for Board Detail and Project Detail pages.
 * Renders a list of navigation items with active state highlighting.
 * On mobile (< 1024px), collapses into a dropdown selector.
 *
 * Key features:
 * - Vertical nav with active item highlighting (left border + bold)
 * - Sticky positioning on desktop scroll
 * - Mobile: renders as a <select> dropdown
 * - Accepts items from CMS board.tabs data
 *
 * @dependencies
 * - @heroicons/react: ChevronDownIcon for mobile dropdown indicator
 *
 * @notes
 * - Server component wrapper with client interactivity for mobile dropdown
 * - Items come from board tabs data — no hardcoded labels
 * - variant prop supports 'sidebar' (vertical) and 'tabs' (horizontal) layouts
 */
'use client'

import React, { useState } from 'react'

export type SectionNavItem = {
  /** Display label for the nav item */
  label: string
  /** URL hash or slug for navigation target */
  slug: string
}

type SectionNavProps = {
  /** Navigation items from CMS board.tabs data */
  items: SectionNavItem[]
  /** Currently active item slug */
  activeItem?: string
  /** Called when a nav item is selected */
  onItemSelect?: (slug: string) => void
  /** Board name displayed above nav items (optional) */
  boardName?: string
  className?: string
}

export function SectionNav({
  items,
  activeItem,
  onItemSelect,
  boardName,
  className = '',
}: SectionNavProps) {
  const [mobileValue, setMobileValue] = useState(activeItem || items[0]?.slug || '')

  function handleMobileChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value
    setMobileValue(slug)
    onItemSelect?.(slug)
  }

  function handleDesktopClick(slug: string) {
    onItemSelect?.(slug)
  }

  if (items.length === 0) return null

  return (
    <nav
      className={`${className}`.trim()}
      data-testid="sidebar-nav"
      data-section-nav=""
      aria-label="Section navigation"
    >
      {/* Desktop: vertical nav list (hidden below lg) */}
      <div className="hidden lg:block sticky top-8">
        {boardName && (
          // No `uppercase` utility — boardName comes in as a brand-cased
          // abbreviation (AcSB / AASB / etc.) and CSS uppercase mangles
          // it to ACSB. Use letter-spacing for the small-caps emphasis
          // instead. (#158 / QA-110)
          <p className="mb-3 text-xs font-bold tracking-[0.18em] text-text-muted">
            {boardName}
          </p>
        )}
        <ul className="space-y-1" role="list">
          {items.map((item) => {
            const isActive = item.slug === (activeItem ?? items[0]?.slug)
            return (
              <li key={item.slug}>
                <button
                  type="button"
                  onClick={() => handleDesktopClick(item.slug)}
                  className={`block w-full text-left px-4 py-2.5 text-sm rounded-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'border-l-3 border-primary bg-alt font-semibold text-primary'
                      : 'border-l-3 border-transparent text-text-primary hover:bg-gray-50 hover:text-primary'
                  }`}
                  aria-current={isActive ? 'true' : undefined}
                  data-testid={`section-nav-item-${item.slug}`}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Mobile: dropdown selector (visible below lg) */}
      <div className="lg:hidden">
        {boardName && (
          <p className="mb-2 text-xs font-bold tracking-[0.18em] text-text-muted">
            {boardName}
          </p>
        )}
        <select
          value={mobileValue}
          onChange={handleMobileChange}
          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2.5 text-sm text-text-primary focus:border-primary focus:ring-1 focus:ring-primary"
          aria-label="Section navigation"
          data-testid="section-nav-mobile"
        >
          {items.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </select>
      </div>
    </nav>
  )
}
