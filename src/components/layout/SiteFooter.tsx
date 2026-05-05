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
 * - Copyright org name is sourced from BRAND.fullName so the rebrand stays in lockstep
 * - Policy links are UI chrome (hardcoded structural links)
 */
import React from 'react'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Container } from '@/components/ui'
import { NewsletterCTA } from '@/components/NewsletterCTA'
import { BRAND } from '@/config/brand'
import type { Footer } from '@/payload-types'

/** Same shape as `HeaderLogo` in SiteHeader — kept inline rather than
    sharing a type since this is a server component and we don't want to
    pull a client module just for a structural type. */
type FooterLogo = {
  url?: string | null
  alt?: string | null
  width?: number | null
  height?: number | null
} | null

type SiteFooterProps = {
  footer?: Footer | null
  /** Forwarded by the layout so server-side translations resolve to the
      request locale (see PR #143). Defaults to 'en' if a legacy caller
      hasn't passed it through yet. */
  locale?: string
  logo?: FooterLogo
}

export async function SiteFooter({ footer, locale, logo }: SiteFooterProps) {
  const currentYear = new Date().getFullYear()
  const resolvedLocale = locale ?? 'en'
  const [tFooter, tNav, tCommon] = await Promise.all([
    getTranslations({ locale: resolvedLocale, namespace: 'footer' }),
    getTranslations({ locale: resolvedLocale, namespace: 'nav' }),
    getTranslations({ locale: resolvedLocale, namespace: 'common' }),
  ])

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
      {/* Logo strip — only renders when the Branding global has a logo
          uploaded for this locale. Sits above the columns rather than
          inside one so it stays visually anchored even when the column
          layout reflows on smaller breakpoints. */}
      {logo?.url && (
        <Container>
          <div className="pt-10" data-testid="footer-logo">
            <Link href="/" aria-label={tCommon('siteName')} className="inline-block">
              <Image
                src={logo.url}
                alt={logo.alt || tCommon('siteName')}
                width={logo.width || 304}
                height={logo.height || 75}
                className="h-16 w-auto"
              />
            </Link>
          </div>
        </Container>
      )}

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
                  {tNav('boards')}
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

            {/* Legal / utility column — backed by the `quick_links` field
                in the Footer global. Heading is "Legal" rather than
                "Quick Links" so it doesn't collide with the CMS-driven
                navigation column that already uses "Quick Links" (#91 /
                QA-021). The field name stays `quick_links` to avoid a
                destructive schema migration. */}
            {hasQuickLinks && (
              <div>
                <p className="text-sm font-bold text-text-primary uppercase tracking-wide">
                  {tFooter('legal')}
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
            {tFooter('notConfigured')}
          </div>
        </Container>
      )}

      {/* Newsletter CTA row */}
      {(newsletterHeading || newsletterDescription) && (
        <div className="border-t border-gray-300" data-testid="footer-newsletter">
          <Container>
            <div className="py-8">
              <NewsletterCTA
                heading={newsletterHeading || undefined}
                description={newsletterDescription || undefined}
              />
            </div>
          </Container>
        </div>
      )}

      {/* Copyright bar */}
      <div className="border-t border-gray-300 bg-gray-200" data-testid="footer-copyright">
        <Container>
          <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Copyright string is split: BRAND.fullName stays interpolated
                so we keep the full org name (per PR #98) on both locales,
                but the trailing "All rights reserved." now translates via
                `footer.allRightsReserved`. (#188 / dogfood-2026-05-03) */}
            <p className="text-xs text-text-muted">
              &copy; {currentYear} {BRAND.fullName}. {tFooter('allRightsReserved')}
            </p>
            <div className="flex items-center gap-4">
              <Link href="/privacy" className="text-xs text-text-muted hover:text-primary hover:underline">
                {tFooter('privacyPolicy')}
              </Link>
              <Link href="/cookies" className="text-xs text-text-muted hover:text-primary hover:underline">
                {tFooter('cookiePolicy')}
              </Link>
              <Link href="/terms" className="text-xs text-text-muted hover:text-primary hover:underline">
                {tFooter('termsOfUse')}
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </footer>
  )
}
