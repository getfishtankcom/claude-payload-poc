/**
 * @description
 * Full-screen mobile navigation overlay with search, language toggle,
 * sign in, and expandable accordion navigation sections.
 *
 * Features:
 * - Full-screen overlay with dark backdrop
 * - Close button (X) in top-right corner
 * - Search input at top
 * - FR language toggle + Sign In link
 * - Expandable accordion sections for nested navigation
 * - Static links for Open Consultations, News, Contact, Newsletter, Volunteer
 * - Focus trapped inside when open
 * - Escape key closes menu
 * - Body scroll locked when open
 *
 * @dependencies
 * - @headlessui/react: Dialog for overlay, Disclosure for accordions
 * - @heroicons/react: XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon
 * - next/link: Client-side navigation
 *
 * @notes
 * - Uses Dialog for focus trapping and scroll locking
 * - Slide-in from right animation via CSS transitions
 * - Navigation data is hardcoded for now; will be wired to CMS globals
 */
'use client'

import React from 'react'
import Link from 'next/link'
import {
  Dialog,
  DialogPanel,
  DialogBackdrop,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react'
import { XMarkIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline'

type MobileMenuProps = {
  /** Whether the menu is open */
  isOpen: boolean
  /** Callback to close the menu */
  onClose: () => void
}

/** Navigation sections with expandable children */
const NAV_SECTIONS = [
  {
    label: 'About Us',
    children: [
      { label: 'About FRAS Canada', href: '/about' },
      { label: 'Oversight Council', href: '/about/oversight-council' },
      { label: 'Research Program', href: '/about/research' },
      { label: 'Jobs', href: '/about/jobs' },
    ],
  },
  {
    label: 'Boards',
    children: [
      { label: 'CSSB — Canadian Sustainability Standards Board', href: '/boards/cssb' },
      { label: 'AcSB — Accounting Standards Board', href: '/boards/acsb' },
      { label: 'PSAB — Public Sector Accounting Board', href: '/boards/psab' },
      { label: 'AASB — Auditing and Assurance Standards Board', href: '/boards/aasb' },
    ],
  },
  {
    label: 'Active Projects',
    children: [
      { label: 'Canadian Sustainability Standards Board', href: '/boards/cssb/projects' },
      { label: 'Accounting Standards Board', href: '/boards/acsb/projects' },
      { label: 'Public Sector Accounting Board', href: '/boards/psab/projects' },
      { label: 'Auditing and Assurance Standards Board', href: '/boards/aasb/projects' },
    ],
  },
]

/** Static (non-expandable) navigation links */
const STATIC_LINKS = [
  { label: 'Open Consultations', href: '/consultations' },
  { label: 'News', href: '/news' },
  { label: 'Contact', href: '/contact' },
  { label: 'Newsletter', href: '/newsletter' },
  { label: 'Volunteer', href: '/volunteer' },
]

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50 lg:hidden" data-testid="mobile-menu">
      {/* Backdrop */}
      <DialogBackdrop
        className="fixed inset-0 bg-black/40 transition-opacity duration-300 data-[closed]:opacity-0"
      />

      {/* Panel */}
      <div className="fixed inset-0 flex justify-end">
        <DialogPanel
          className="w-full max-w-sm bg-white shadow-lg overflow-y-auto transition-transform duration-300 data-[closed]:translate-x-full"
        >
          {/* Header: close button */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <span className="text-lg font-semibold text-text-primary">Menu</span>
            <button
              type="button"
              onClick={onClose}
              className="rounded-sm p-1 text-text-muted hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-bright cursor-pointer"
              aria-label="Close menu"
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
                placeholder="Search projects, standards..."
                className="w-full rounded-sm border border-gray-300 bg-white py-2.5 pl-10 pr-4 text-sm placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
                data-testid="mobile-menu-search"
              />
            </div>
          </div>

          {/* Language toggle + Sign In */}
          <div className="flex items-center gap-4 px-6 py-3 border-b border-gray-200 text-sm">
            <Link
              href="/fr"
              className="font-medium text-primary hover:underline"
              onClick={onClose}
            >
              FR
            </Link>
            <span className="text-gray-300" aria-hidden="true">|</span>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
              onClick={onClose}
            >
              Sign In
            </Link>
          </div>

          {/* Accordion sections */}
          <nav className="px-6 py-4" aria-label="Mobile navigation">
            <div className="space-y-1">
              {NAV_SECTIONS.map((section) => (
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
                            <li key={child.label}>
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

            {/* Static links */}
            <div className="mt-4 border-t border-gray-200 pt-4 space-y-1">
              {STATIC_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block rounded-sm px-3 py-3 text-sm font-medium text-text-primary hover:bg-gray-50 hover:text-primary"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
