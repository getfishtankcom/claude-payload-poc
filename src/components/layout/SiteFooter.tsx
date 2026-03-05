/**
 * @description
 * Site footer component with 4-column layout, newsletter CTA, and copyright bar.
 *
 * Structure:
 * - Column 1: Org info (FRAS Canada description + LinkedIn icon)
 * - Column 2: Boards (links to each board page, full names)
 * - Column 3: Quick Links (About Us, Research, News, Jobs, Volunteer, Contact, Newsletter)
 * - Column 4: Account (Sign In, Français)
 * - Newsletter CTA row: heading + email input + Subscribe button
 * - Copyright bar: copyright text + Privacy Policy, Cookie Policy, Terms links
 *
 * @dependencies
 * - NewsletterCTA: Newsletter subscription component
 * - Container: Layout container from ui/
 * - next/link: Client-side navigation
 *
 * @notes
 * - Background uses bg-footer semantic token (light gray)
 * - Text color is dark (text-text-primary) since footer bg is light
 * - Mobile: 4 columns stack to single column
 * - Navigation data is hardcoded; will be wired to `footer` global
 */
import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui'
import { NewsletterCTA } from '@/components/NewsletterCTA'

/** Footer column data — will be replaced by CMS footer global */
const BOARDS = [
  { label: 'Canadian Sustainability Standards Board', href: '/boards/cssb' },
  { label: 'Accounting Standards Board', href: '/boards/acsb' },
  { label: 'Public Sector Accounting Board', href: '/boards/psab' },
  { label: 'Auditing and Assurance Standards Board', href: '/boards/aasb' },
  { label: 'Regulatory and Accounting Standards Oversight Council', href: '/about/oversight-council' },
]

const QUICK_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Research Program', href: '/about/research' },
  { label: 'News', href: '/news' },
  { label: 'Jobs', href: '/about/jobs' },
  { label: 'Volunteer', href: '/volunteer' },
  { label: 'Contact', href: '/contact' },
  { label: 'Newsletter', href: '/newsletter' },
]

const POLICY_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/cookies' },
  { label: 'Terms of Use', href: '/terms' },
]

export function SiteFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-footer" data-testid="site-footer">
      {/* Main footer columns */}
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-4">
          {/* Column 1: Org info */}
          <div>
            <p className="text-lg font-bold text-text-primary">FRAS Canada</p>
            <p className="mt-2 text-sm text-text-muted">
              Financial Reporting &amp; Assurance Standards Canada
            </p>
            {/* LinkedIn icon */}
            <a
              href="https://www.linkedin.com/company/fras-canada"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-vivid"
              aria-label="FRAS Canada on LinkedIn"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          </div>

          {/* Column 2: Boards */}
          <div>
            <p className="text-sm font-bold text-text-primary uppercase tracking-wide">Boards</p>
            <ul className="mt-3 space-y-2">
              {BOARDS.map((board) => (
                <li key={board.label}>
                  <Link href={board.href} className="text-sm text-text-muted hover:text-primary hover:underline">
                    {board.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div>
            <p className="text-sm font-bold text-text-primary uppercase tracking-wide">Quick Links</p>
            <ul className="mt-3 space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-text-muted hover:text-primary hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Account */}
          <div>
            <p className="text-sm font-bold text-text-primary uppercase tracking-wide">Account</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/login" className="text-sm text-text-muted hover:text-primary hover:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/fr" className="text-sm text-text-muted hover:text-primary hover:underline">
                  Fran&ccedil;ais
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Newsletter CTA row */}
      <div className="border-t border-gray-300" data-testid="footer-newsletter">
        <Container>
          <div className="py-8">
            <NewsletterCTA
              heading="Stay informed with our weekly updates"
              description="Get critical updates on regulatory changes and new standard releases."
            />
          </div>
        </Container>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-gray-300 bg-gray-200" data-testid="footer-copyright">
        <Container>
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">
              &copy; {currentYear} Financial Reporting &amp; Assurance Standards Canada. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {POLICY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-xs text-text-muted hover:text-primary hover:underline"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
