import { render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

// next-intl's server helpers require a request context that's not available
// in jsdom. Map keys → "namespace.key" so the existing assertions keep
// working (the legal heading falls back to "footer.legal", which still
// matches the /Quick Links|Legal/i regex used below).
vi.mock('next-intl/server', () => ({
  getTranslations: async ({ namespace }: { namespace?: string } = {}) => {
    return (key: string) => (namespace ? `${namespace}.${key}` : key)
  },
}))

import { SiteFooter } from './SiteFooter'
import { BRAND } from '@/config/brand'
import type { Footer } from '@/payload-types'

describe('<SiteFooter>', () => {
  it('renders the copyright with BRAND.fullName (no legacy "Financial Reporting" prefix)', async () => {
    render(await SiteFooter({ footer: null }))
    const bar = screen.getByTestId('footer-copyright')
    expect(bar).toHaveTextContent(BRAND.fullName)
    expect(bar).not.toHaveTextContent('Financial Reporting')
  })

  it('renders the current year in the copyright', async () => {
    render(await SiteFooter({ footer: null }))
    const year = String(new Date().getFullYear())
    expect(screen.getByTestId('footer-copyright')).toHaveTextContent(year)
  })

  it('renders the logo strip when a Branding logo is supplied', async () => {
    const logo = { url: '/media/fras-banner-en.png', alt: 'RAS Canada', width: 304, height: 75 }
    render(await SiteFooter({ footer: null, logo }))
    const strip = screen.getByTestId('footer-logo')
    const img = within(strip).getByRole('img', { name: 'RAS Canada' }) as HTMLImageElement
    expect(img.getAttribute('src')).toContain('fras-banner-en.png')
  })

  it('omits the logo strip when no logo is supplied (text wordmark fallback path)', async () => {
    render(await SiteFooter({ footer: null }))
    expect(screen.queryByTestId('footer-logo')).toBeNull()
  })

  it('does not render the "Quick Links" heading twice when both nav + legal are populated (#91)', async () => {
    // QA-021 regression: column 2 (CMS-driven nav shortcuts) and column 4
    // (the `quick_links` legal column) both used to show "Quick Links" as
    // the heading. The legal column was renamed to "Legal" so each footer
    // column has a unique heading.
    const footer = {
      columns: [
        {
          id: 'col-nav',
          heading: 'Quick Links',
          links: [{ id: 'l-1', label: 'Active Projects', url: '/active-projects' }],
        },
      ],
      boards_links: [],
      quick_links: [
        { id: 'q-1', label: 'Privacy Policy', url: '/privacy' },
      ],
    } as unknown as Footer
    render(await SiteFooter({ footer }))
    const main = screen.getByTestId('site-footer')
    const headings = within(main)
      .getAllByText(/Quick Links|footer\.legal|Legal/i)
      .map((el) => el.textContent?.trim())
    // Exactly one "Quick Links" (the CMS-driven nav column) and exactly
    // one Legal heading (the `quick_links` field column). The mock
    // returns the namespaced key so we look for either "Legal" or
    // "footer.legal" depending on whether translations resolve at runtime.
    expect(headings.filter((h) => h === 'Quick Links')).toHaveLength(1)
    expect(headings.filter((h) => h === 'Legal' || h === 'footer.legal')).toHaveLength(1)
  })
})
