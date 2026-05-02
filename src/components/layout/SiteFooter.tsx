/**
 * @description
 * Site footer component driven by CMS `footer` global data.
 * Displays columns of links, board links, quick links, newsletter CTA, and copyright.
 *
 * Structure:
 * - Dynamic columns from CMS (heading + links)
 * - Board links from CMS (all 5 boards including RASOC)
 * - Quick links from CMS
 * - Newsletter CTA row (heading + description from CMS)
 * - Copyright bar (static UI chrome)
 *
 * @dependencies
 * - NewsletterCTA: Newsletter subscription component
 * - Container: Layout container from ui/
 * - next/link: Client-side navigation
 *
 * @notes
 * - Footer data comes from CMS `footer` global via props
 * - Empty state renders a minimal footer when no data exists
 * - Copyright text is UI chrome (acceptable hardcoded string)
 * - Policy links are UI chrome (hardcoded structural links)
 */
import React from 'react'
import Link from 'next/link'
import { Container } from '@/components/ui'
import { NewsletterCTA } from '@/components/NewsletterCTA'
import type { Footer } from '@/payload-types'

type SiteFooterProps = {
  footer?: Footer | null
}

export function SiteFooter({ footer }: SiteFooterProps) {
  const currentYear = new Date().getFullYear()

  const columns = footer?.columns || []
  const boardsLinks = footer?.boards_links || []
  const quickLinks = footer?.quick_links || []
  const newsletterHeading = footer?.newsletter_heading
  const newsletterDescription = footer?.newsletter_description

  // Calculate grid columns based on available data
  const hasBoards = boardsLinks.length > 0
  const hasQuickLinks = quickLinks.length > 0
  const hasColumns = columns.length > 0
  const hasAnyContent = hasBoards || hasQuickLinks || hasColumns

  return (
    <footer className="bg-footer" data-testid="site-footer">
      {/* Main footer content */}
      {hasAnyContent && (
        <Container>
          <div className="grid grid-cols-1 gap-8 py-12 lg:grid-cols-4">
            {/* CMS columns */}
            {columns.map((col, i) => (
              <div key={col.id || i}>
                {col.heading && (
                  <p className="text-sm font-bold text-text-primary uppercase tracking-wide">
                    {col.heading}
                  </p>
                )}
                {col.links && col.links.length > 0 && (
                  <ul className="mt-3 space-y-2">
                    {col.links.map((link, j) => (
                      <li key={link.id || j}>
                        <Link
                          href={link.url}
                          className="text-sm text-text-muted hover:text-primary hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Boards column */}
            {hasBoards && (
              <div>
                <p className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  Boards
                </p>
                <ul className="mt-3 space-y-2">
                  {boardsLinks.map((board, i) => (
                    <li key={board.id || i}>
                      <Link
                        href={board.url}
                        className="text-sm text-text-muted hover:text-primary hover:underline"
                      >
                        {board.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Quick Links column */}
            {hasQuickLinks && (
              <div>
                <p className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  Quick Links
                </p>
                <ul className="mt-3 space-y-2">
                  {quickLinks.map((link, i) => (
                    <li key={link.id || i}>
                      <Link
                        href={link.url}
                        className="text-sm text-text-muted hover:text-primary hover:underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Container>
      )}

      {/* Empty state */}
      {!hasAnyContent && (
        <Container>
          <div className="py-8 text-center text-sm text-text-muted">
            Footer not configured.
          </div>
        </Container>
      )}

      {/* Newsletter CTA row */}
      {(newsletterHeading || newsletterDescription) && (
        <div className="border-t border-gray-300" data-testid="footer-newsletter">
          <Container>
            <div className="py-8">
              <NewsletterCTA
                heading={newsletterHeading || ''}
                description={newsletterDescription || ''}
              />
            </div>
          </Container>
        </div>
      )}

      {/* Copyright bar */}
      <div className="border-t border-gray-300 bg-gray-200" data-testid="footer-copyright">
        <Container>
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-text-muted">
              &copy; {currentYear} Financial Reporting &amp; Assurance Standards Canada. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-text-muted hover:text-primary hover:underline">
                Privacy Policy
              </Link>
              <Link href="/cookies" className="text-xs text-text-muted hover:text-primary hover:underline">
                Cookie Policy
              </Link>
              <Link href="/terms" className="text-xs text-text-muted hover:text-primary hover:underline">
                Terms of Use
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
