import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SiteFooter } from './SiteFooter'
import { BRAND } from '@/config/brand'
import type { Footer } from '@/payload-types'

describe('<SiteFooter>', () => {
  it('renders the copyright with BRAND.fullName (no legacy "Financial Reporting" prefix)', () => {
    render(<SiteFooter footer={null} />)
    const bar = screen.getByTestId('footer-copyright')
    expect(bar).toHaveTextContent(BRAND.fullName)
    expect(bar).not.toHaveTextContent('Financial Reporting')
  })

  it('renders the current year in the copyright', () => {
    render(<SiteFooter footer={null} />)
    const year = String(new Date().getFullYear())
    expect(screen.getByTestId('footer-copyright')).toHaveTextContent(year)
  })

  it('does not render the "Quick Links" heading twice when both nav + legal are populated (#91)', () => {
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
    render(<SiteFooter footer={footer} />)
    const main = screen.getByTestId('site-footer')
    const headings = within(main)
      .getAllByText(/Quick Links|Legal/i)
      .map((el) => el.textContent?.trim())
    // Exactly one "Quick Links" (the nav column) and exactly one "Legal".
    expect(headings.filter((h) => h === 'Quick Links')).toHaveLength(1)
    expect(headings.filter((h) => h === 'Legal')).toHaveLength(1)
  })
})
