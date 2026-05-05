/**
 * Pin the FRAS-branded admin login mark against issue #40.
 *
 * The mark is mounted via `admin.components.graphics.Logo` and inherits
 * across login + forgot-password + reset-password by Payload's design.
 * If a future refactor renames a brand constant or hardcodes a string we
 * want to fail here before a screenshot regression.
 *
 * Tests target `BrandLogoView` (the sync render) directly — the async
 * `BrandLogo` wrapper just fetches the Branding global and forwards.
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BRAND } from '@/config/brand'

import { BrandLogoView } from './BrandLogo'

describe('<BrandLogoView>', () => {
  describe('text fallback (no logo uploaded)', () => {
    it('renders the canonical short brand name from BRAND.name', () => {
      render(<BrandLogoView />)
      expect(screen.getByText(BRAND.name)).toBeInTheDocument()
      expect(BRAND.name).toBe('RAS Canada')
    })

    it('renders the admin-panel sub-label from BRAND.adminTitle', () => {
      render(<BrandLogoView />)
      expect(screen.getByText(BRAND.adminTitle)).toBeInTheDocument()
    })

    it('uses the brand-purple CSS variable (not a hardcoded teal Payload default)', () => {
      const { container } = render(<BrandLogoView />)
      const html = container.innerHTML
      expect(html).toContain('var(--brand-fras')
      expect(html).not.toContain('#0D9488')
      expect(html).not.toContain('#14B8A6')
    })
  })

  describe('image render (logo uploaded)', () => {
    const logo = {
      url: '/media/fras-banner-en.png',
      alt: 'RAS Canada',
      width: 304,
      height: 75,
    }

    it('renders an <img> with the uploaded URL', () => {
      render(<BrandLogoView logo={logo} />)
      const img = screen.getByRole('img', { name: 'RAS Canada' }) as HTMLImageElement
      expect(img.getAttribute('src')).toBe('/media/fras-banner-en.png')
    })

    it('falls back to BRAND.name for alt when the upload has no alt set', () => {
      render(<BrandLogoView logo={{ ...logo, alt: '' }} />)
      const img = screen.getByRole('img', { name: BRAND.name }) as HTMLImageElement
      expect(img).toBeInTheDocument()
    })

    it('omits the text wordmark when an image is present', () => {
      render(<BrandLogoView logo={logo} />)
      expect(screen.queryByText(BRAND.adminTitle)).toBeNull()
    })
  })

  it('exposes a stable testid hook for e2e selectors regardless of render mode', () => {
    const { container } = render(<BrandLogoView />)
    expect(container.querySelector('[data-testid="admin-brand-logo"]')).not.toBeNull()
  })
})
