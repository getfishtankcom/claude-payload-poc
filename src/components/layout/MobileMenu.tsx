/**
 * @description
 * Full-screen mobile navigation overlay driven by CMS navigation data.
 * Search, language toggle, sign in, and expandable accordion sections.
 *
 * Key features:
 * - Full-screen overlay with dark backdrop
 * - Close button (X) in top-right corner
 * - Search input at top
 * - Expandable accordion sections from CMS mega_menu data
 * - Static links from CMS primary_nav (non-dropdown items)
 * - Focus trapped inside when open
 * - Escape key closes menu
 *
 * @dependencies
 * - @headlessui/react: Dialog for overlay, Disclosure for accordions
 * - @heroicons/react: XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon
 * - next/link: Client-side navigation
 *
 * @notes
 * - Navigation data comes from CMS `navigation` global via props
 * - When no navigation data, renders empty menu with search only
 * - Builds accordion sections from mega_menu entries
 */
'use client'

import React from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { LanguageSwitcher } from './LanguageSwitcher'
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import type { Navigation } from '@/payload-types'

type MobileMenuProps = {
  isOpen: boolean
  onClose: () => void
  navigation?: Navigation | null
}

type NavSection = {
  label: string
  children: { label: string; href: string }[]
}

/**
 * Builds accordion sections from the mega_menu entries.
 */
function buildNavSections(navigation: Navigation | null | undefined): NavSection[] {
  if (!navigation?.mega_menu) return []

  return navigation.mega_menu.map((entry) => ({
    label: entry.trigger_label,
    children: (entry.columns || []).flatMap((col) =>
      (col.links || []).map((link) => ({
        label: link.label,
        href: link.url,
      })),
    ),
  }))
}

/**
 * Builds static links from non-dropdown nav items.
 */
function buildStaticLinks(navigation: Navigation | null | undefined): { label: string; href: string }[] {
  if (!navigation) return []

  const links: { label: string; href: string }[] = []

  if (navigation.primary_nav) {
    for (const item of navigation.primary_nav) {
      if (!item.has_dropdown) {
        links.push({ label: item.label, href: item.url })
      }
    }
  }

  if (navigation.utility_links) {
    for (const item of navigation.utility_links) {
      if (!item.has_dropdown) {
        links.push({ label: item.label, href: item.url })
      }
    }
  }

  return links
}

export function MobileMenu({ isOpen, onClose, navigation }: MobileMenuProps) {
  const tNav = useTranslations('nav')
  const tSearch = useTranslations('search')
  const navSections = buildNavSections(navigation)
  const staticLinks = buildStaticLinks(navigation)

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 lg:hidden" data-testid="mobile-menu">
      <DialogBackdrop
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          className="w-full max-w-sm bg-white shadow-lg overflow-y-auto transition-transform duration-300 data-[closed]:translate-x-full"
        >
          {/* Header: close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-text-primary">{tNav('menu')}</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm p-1 text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright cursor-pointer"
              aria-label={tNav('closeMenu')}
              data-testid="mobile-menu-close"
            >
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>

          {/* Search input */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder={tSearch('mobilePlaceholder')}
                className="w-full rounded-sm border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
                data-testid="mobile-menu-search"
              />
            </div>
          </div>

          {/* Language toggle + Sign In */}
          <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 text-sm">
            <LanguageSwitcher variant="inline" onSwitch={onClose} />
            <span className="text-gray-300" aria-hidden="true">|</span>
            <Link href="/login" className="font-medium text-primary hover:underline" onClick={onClose}>
              Sign In
            </Link>
          </div>

          {/* Navigation sections */}
          <nav className="px-6 py-4" aria-label={tNav('mobileNavLabel')}>
            {navSections.length > 0 && (
              <div className="space-y-1">
                {navSections.map((section) => (
                  <Disclosure key={section.label} as="div">
                    {({ open }) => (
                      <>
                        <DisclosureButton
                          className="flex w-full items-center justify-between rounded-sm px-3 py-3 text-left text-sm font-medium text-text-primary hover:bg-gray-50 cursor-pointer"
                          data-testid={`mobile-nav-${section.label.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {section.label}
                          <ChevronDownIcon
                            className={`h-4 w-4 text-text-muted transition-transform duration-150 ${
                              open ? 'rotate-180' : ''
                            }`}
                            aria-hidden="true"
                          />
                        </DisclosureButton>
                        <DisclosurePanel className="pl-4 pb-2">
                          <ul className="space-y-1">
                            {section.children.map((child) => (
                              <li key={child.href}>
                                <Link
                                  href={child.href}
                                  className="block rounded-sm px-3 py-2 text-sm text-text-muted hover:text-primary hover:bg-gray-50"
                                  onClick={onClose}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                ))}
              </div>
            )}

            {staticLinks.length > 0 && (
              <div className="mt-4 border-t border-gray-200 pt-4 space-y-1">
                {staticLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block rounded-sm px-3 py-3 text-sm font-medium text-text-primary hover:bg-gray-50 hover:text-primary"
                    onClick={onClose}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {navSections.length === 0 && staticLinks.length === 0 && (
              <p className="px-3 py-4 text-sm text-text-muted">
                No navigation configured.
              </p>
            )}
          </nav>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
