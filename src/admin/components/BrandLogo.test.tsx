/**
 * Pin the FRAS-branded admin login logo against issue #40.
 *
 * The logo is mounted via `admin.components.graphics.Logo` and inherits
 * across login + forgot-password + reset-password by Payload's design.
 * If a future refactor renames a brand constant or hardcodes a string, we
 * want to fail here before a screenshot regression.
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BRAND } from '@/config/brand'

import { BrandLogo } from './BrandLogo'

describe('<BrandLogo>', () => {
  it('renders the canonical short brand name from BRAND.name', () => {
    render(<BrandLogo />)
    // Pinning to the constant rather than the literal string so a brand
    // rename only has to touch src/config/brand.ts.
    expect(screen.getByText(BRAND.name)).toBeInTheDocument()
    expect(BRAND.name).toBe('RAS Canada')
  })

  it('renders the admin-panel sub-label from BRAND.adminTitle', () => {
    render(<BrandLogo />)
    expect(screen.getByText(BRAND.adminTitle)).toBeInTheDocument()
  })

  it('exposes a stable testid hook for e2e selectors', () => {
    const { container } = render(<BrandLogo />)
    const root = container.querySelector('[data-testid="admin-brand-logo"]')
    expect(root).not.toBeNull()
  })

  it('uses the brand-purple CSS variable (not a hardcoded teal Payload default)', () => {
    const { container } = render(<BrandLogo />)
    const html = container.innerHTML
    expect(html).toContain('var(--brand-fras')
    // Defensive guard: Payload's default theme uses teal — make sure we
    // didn't accidentally inline that hex value when authoring this file.
    expect(html).not.toContain('#0D9488')
    expect(html).not.toContain('#14B8A6')
  })
})
