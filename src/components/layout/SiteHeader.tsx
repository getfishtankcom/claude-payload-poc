/**
 * @description
 * Site header component with 3 rows:
 * - Row 1 (Utility bar): Secondary links — About Us, Boards, Contact, Newsletter, Volunteer, FR, Sign In
 * - Row 2 (Main bar): FRAS Canada logo + persistent search input
 * - Row 3 (Primary nav): Active Projects, Open Consultations, News
 *
 * Mobile: Collapses to logo + search icon + hamburger (below lg breakpoint).
 * Rows 1 and 3 hidden on mobile, replaced by MobileMenu.
 *
 * @dependencies
 * - @heroicons/react: MagnifyingGlassIcon, Bars3Icon, UserIcon
 * - MegaMenu: Dropdown menus for About Us, Boards, Active Projects
 * - MobileMenu: Full-screen mobile overlay
 * - Container: Layout container from ui/
 * - next/link: Client-side navigation
 *
 * @notes
 * - Client component due to mobile menu state management
 * - Navigation data is hardcoded for now; will be wired to `navigation` global
 * - Search input is visual only — will connect to SearchModal in later epic
 * - Sticky header not implemented yet (optional, configurable in later iteration)
 */
'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { MagnifyingGlassIcon, Bars3Icon, UserIcon } from '@heroicons/react/24/outline'
import { Container } from '@/components/ui'
import { MegaMenu } from './MegaMenu'
import { MobileMenu } from './MobileMenu'

/** Navigation data — will be replaced by CMS global data */
const ABOUT_US_ITEMS = [
  { label: 'About FRAS Canada', href: '/about' },
  { label: 'Oversight Council', href: '/about/oversight-council' },
  { label: 'Research Program', href: '/about/research' },
  { label: 'Jobs', href: '/about/jobs' },
]

const BOARDS_ITEMS = [
  {
    label: 'CSSB',
    href: '/boards/cssb',
    children: [
      { label: 'Overview', href: '/boards/cssb' },
      { label: 'Consultations', href: '/boards/cssb/consultations' },
      { label: 'Projects & Initiatives', href: '/boards/cssb/projects' },
      { label: 'Resources', href: '/boards/cssb/resources' },
      { label: 'Meetings & Decisions', href: '/boards/cssb/meetings' },
      { label: 'Committees', href: '/boards/cssb/committees' },
      { label: 'Volunteer', href: '/boards/cssb/volunteer' },
    ],
  },
  {
    label: 'AcSB',
    href: '/boards/acsb',
    children: [
      { label: 'Overview', href: '/boards/acsb' },
      { label: 'Consultations', href: '/boards/acsb/consultations' },
      { label: 'Projects & Initiatives', href: '/boards/acsb/projects' },
      { label: 'Resources', href: '/boards/acsb/resources' },
      { label: 'Meetings & Decisions', href: '/boards/acsb/meetings' },
      { label: 'Committees', href: '/boards/acsb/committees' },
      { label: 'Volunteer', href: '/boards/acsb/volunteer' },
    ],
  },
  {
    label: 'PSAB',
    href: '/boards/psab',
    children: [
      { label: 'Overview', href: '/boards/psab' },
      { label: 'Consultations', href: '/boards/psab/consultations' },
      { label: 'Projects & Initiatives', href: '/boards/psab/projects' },
      { label: 'Resources', href: '/boards/psab/resources' },
      { label: 'Meetings & Decisions', href: '/boards/psab/meetings' },
      { label: 'Committees', href: '/boards/psab/committees' },
      { label: 'Volunteer', href: '/boards/psab/volunteer' },
    ],
  },
  {
    label: 'AASB',
    href: '/boards/aasb',
    children: [
      { label: 'Overview', href: '/boards/aasb' },
      { label: 'Consultations', href: '/boards/aasb/consultations' },
      { label: 'Projects & Initiatives', href: '/boards/aasb/projects' },
      { label: 'Resources', href: '/boards/aasb/resources' },
      { label: 'Meetings & Decisions', href: '/boards/aasb/meetings' },
      { label: 'Committees', href: '/boards/aasb/committees' },
      { label: 'Volunteer', href: '/boards/aasb/volunteer' },
    ],
  },
]

const ACTIVE_PROJECTS_ITEMS = [
  { label: 'Canadian Sustainability Standards Board', href: '/boards/cssb/projects' },
  { label: 'Accounting Standards Board', href: '/boards/acsb/projects' },
  { label: 'Public Sector Accounting Board', href: '/boards/psab/projects' },
  { label: 'Auditing and Assurance Standards Board', href: '/boards/aasb/projects' },
]

export function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="w-full border-b border-gray-200 bg-white" data-testid="site-header">
      {/* Row 1: Utility bar — hidden on mobile */}
      <div className="hidden lg:block border-b border-gray-200 bg-gray-50" data-testid="utility-bar">
        <Container>
          <div className="flex items-center justify-end gap-1 py-2 text-sm text-text-muted">
            <MegaMenu trigger="About Us" items={ABOUT_US_ITEMS} variant="single-column" />
            <span className="text-gray-300 px-1" aria-hidden="true">|</span>
            <MegaMenu trigger="Boards" items={BOARDS_ITEMS} variant="multi-column" />
            <span className="text-gray-300 px-1" aria-hidden="true">|</span>
            <Link href="/contact" className="px-2 py-1 hover:text-primary">Contact</Link>
            <span className="text-gray-300 px-1" aria-hidden="true">|</span>
            <Link href="/newsletter" className="px-2 py-1 hover:text-primary">Newsletter</Link>
            <span className="text-gray-300 px-1" aria-hidden="true">|</span>
            <Link href="/volunteer" className="px-2 py-1 hover:text-primary">Volunteer</Link>
            <span className="text-gray-300 px-2" aria-hidden="true">|</span>
            <Link href="/fr" className="px-2 py-1 font-medium hover:text-primary">FR</Link>
            <span className="text-gray-300 px-1" aria-hidden="true">|</span>
            <Link href="/login" className="inline-flex items-center gap-1.5 px-2 py-1 hover:text-primary">
              <UserIcon className="h-4 w-4" aria-hidden="true" />
              Sign In
            </Link>
          </div>
        </Container>
      </div>

      {/* Row 2: Logo + Search */}
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0" data-testid="site-logo">
            <span className="text-xl font-bold text-primary">FRAS Canada</span>
          </Link>

          {/* Search input — desktop only */}
          <div className="hidden lg:block flex-1 max-w-md ml-auto">
            <div className="relative">
              <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-muted"
                aria-hidden="true"
              />
              <input
                type="search"
                placeholder="Projects, standards, and more..."
                className="w-full rounded-sm border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm placeholder:text-text-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-bright/30"
                data-testid="header-search"
              />
            </div>
          </div>

          {/* Mobile: search icon + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
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
      <div className="hidden lg:block border-t border-gray-200" data-testid="primary-nav">
        <Container>
          <nav className="flex items-center gap-6 py-3" aria-label="Primary navigation">
            <MegaMenu trigger="Active Projects" items={ACTIVE_PROJECTS_ITEMS} variant="single-column" />
            <Link
              href="/consultations"
              className="text-sm font-medium text-text-primary hover:text-primary"
            >
              Open Consultations
            </Link>
            <Link
              href="/news"
              className="text-sm font-medium text-text-primary hover:text-primary"
            >
              News
            </Link>
          </nav>
        </Container>
      </div>

      {/* Mobile menu overlay */}
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </header>
  )
}
