/**
 * @description
 * Site header component with 3 rows:
 * - Row 1 (Utility bar): Secondary links from CMS navigation global
 * - Row 2 (Main bar): FRAS Canada logo + persistent search input
 * - Row 3 (Primary nav): Primary navigation links from CMS
 *
 * Mobile: Collapses to logo + search icon + hamburger (below lg breakpoint).
 * Rows 1 and 3 hidden on mobile, replaced by MobileMenu.
 *
 * @dependencies
 * - @heroicons/react: MagnifyingGlassIcon, Bars3Icon
 * - MegaMenu: Dropdown menus for items with dropdowns
 * - MobileMenu: Full-screen mobile overlay
 * - Container: Layout container from ui/
 * - next/link: Client-side navigation
 *
 * @notes
 * - Client component due to mobile menu state management
 * - Navigation data comes from CMS `navigation` global via props
 * - Empty state renders a minimal header when no navigation data exists
 */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, Bars3Icon } from '@heroicons/react/24/outline'
import { Container } from '@/components/ui'
import { MegaMenu } from './MegaMenu'
import type { MegaMenuItem } from './MegaMenu'
import { MobileMenu } from './MobileMenu'
import { SearchModal } from '@/components/SearchModal'
import type { Navigation, SearchConfig } from '@/payload-types'

type SiteHeaderProps = {
  navigation?: Navigation | null
  popularTags?: SearchConfig['popular_tags']
}

/**
 * Builds MegaMenu items from a mega_menu entry's columns.
 * Multi-column: each column becomes a top-level item with children from its links.
 */
function buildMegaMenuItems(
  megaMenu: Navigation['mega_menu'],
  triggerLabel: string,
): MegaMenuItem[] {
  if (!megaMenu) return []
  const entry = megaMenu.find((m) => m.trigger_label === triggerLabel)
  if (!entry?.columns) return []

  return entry.columns.map((col) => ({
    label: col.heading || '',
    href: col.links?.[0]?.url || '#',
    children: col.links?.map((link) => ({
      label: link.label,
      href: link.url,
    })),
  }))
}

/**
 * Builds simple flat items from a mega_menu entry's all links.
 */
function buildFlatMenuItems(
  megaMenu: Navigation['mega_menu'],
  triggerLabel: string,
): MegaMenuItem[] {
  if (!megaMenu) return []
  const entry = megaMenu.find((m) => m.trigger_label === triggerLabel)
  if (!entry?.columns) return []

  return entry.columns.flatMap((col) =>
    (col.links || []).map((link) => ({
      label: link.label,
      href: link.url,
    })),
  )
}

export function SiteHeader({ navigation, popularTags }: SiteHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchModalOpen, setSearchModalOpen] = useState(false)

  const utilityLinks = navigation?.utility_links || []
  const primaryNav = navigation?.primary_nav || []
  const megaMenu = navigation?.mega_menu || []

  return (
    <header className="w-full border-b border-gray-200 bg-white" data-testid="site-header">
      {/* Row 1: Utility bar — hidden on mobile */}
      {utilityLinks.length > 0 && (
        <div className="hidden lg:block border-b border-gray-200 bg-gray-50" data-testid="utility-bar">
          <Container>
            <div className="flex items-center justify-end gap-1 py-2 text-sm text-text-muted">
              {utilityLinks.map((item, i) => {
                const hasMegaMenu = megaMenu.some((m) => m.trigger_label === item.label)

                if (item.has_dropdown && hasMegaMenu) {
                  const entry = megaMenu.find((m) => m.trigger_label === item.label)
                  const isMultiColumn = entry?.columns && entry.columns.length > 1 && entry.columns.some((c) => c.heading)

                  const items = isMultiColumn
                    ? buildMegaMenuItems(megaMenu, item.label)
                    : buildFlatMenuItems(megaMenu, item.label)

                  return (
                    <React.Fragment key={item.id || i}>
                      {i > 0 && <span className="text-gray-300 px-1" aria-hidden="true">|</span>}
                      <MegaMenu
                        trigger={item.label}
                        items={items}
                        variant={isMultiColumn ? 'multi-column' : 'single-column'}
                      />
                    </React.Fragment>
                  )
                }

                return (
                  <React.Fragment key={item.id || i}>
                    {i > 0 && <span className="text-gray-300 px-1" aria-hidden="true">|</span>}
                    <Link href={item.url} className="px-2 py-1 hover:text-primary">
                      {item.label}
                    </Link>
                  </React.Fragment>
                )
              })}
            </div>
          </Container>
        </div>
      )}

      {/* Row 2: Logo + Search */}
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          <Link href="/" className="flex-shrink-0" data-testid="site-logo">
            <span className="text-xl font-bold text-primary">FRAS Canada</span>
          </Link>

          <div className="hidden lg:block flex-1 max-w-md ml-auto">
            <div className="relative">
              <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Projects, standards, and more..."
                className="w-full rounded-sm border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30 cursor-pointer"
                data-testid="header-search"
                readOnly
                onClick={() => setSearchModalOpen(true)}
                onFocus={() => setSearchModalOpen(true)}
              />
            </div>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="rounded-sm p-2 text-text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright cursor-pointer"
              aria-label="Search"
              data-testid="mobile-search-toggle"
            >
              <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-sm p-2 text-text-muted hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright cursor-pointer"
              aria-label="Open navigation menu"
              data-testid="mobile-menu-toggle"
            >
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Container>

      {/* Row 3: Primary navigation — hidden on mobile */}
      {primaryNav.length > 0 && (
        <div className="hidden lg:block border-t border-gray-200" data-testid="primary-nav">
          <Container>
            <nav className="flex items-center gap-6 py-3" aria-label="Primary navigation">
              {primaryNav.map((item, i) => {
                const hasMegaMenu = megaMenu.some((m) => m.trigger_label === item.label)

                if (item.has_dropdown && hasMegaMenu) {
                  const items = buildFlatMenuItems(megaMenu, item.label)
                  return (
                    <MegaMenu
                      key={item.id || i}
                      trigger={item.label}
                      items={items}
                      variant="single-column"
                    />
                  )
                }

                return (
                  <Link
                    key={item.id || i}
                    href={item.url}
                    className="text-sm font-medium text-text-primary hover:text-primary"
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </Container>
        </div>
      )}

      {/* Mobile menu overlay */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navigation={navigation}
      />

      {/* Search modal overlay */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        popularTags={popularTags}
      />
    </header>
  )
}
