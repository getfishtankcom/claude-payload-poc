import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { SiteFooter } from './SiteFooter'
import { BRAND } from '@/config/brand'

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
})
