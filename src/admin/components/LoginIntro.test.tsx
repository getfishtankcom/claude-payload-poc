/**
 * Pin the "Sign in to <full brand name>" headline that issue #40
 * specifically calls out, and the no-hardcoded-name rule from CLAUDE.md
 * (the headline must come from BRAND.fullName, not a literal string).
 */

import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { BRAND } from '@/config/brand'

import { LoginIntro } from './LoginIntro'

describe('<LoginIntro>', () => {
  it('renders the issue-mandated headline using BRAND.fullName', () => {
    render(<LoginIntro />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(`Sign in to ${BRAND.fullName}`)
    // Sanity-check the constant itself so a brand rename is loud.
    expect(BRAND.fullName).toBe('Reporting and Assurance Standards (RAS) Canada')
  })

  it('renders helper copy below the headline so the form has context', () => {
    render(<LoginIntro />)
    expect(screen.getByText(/Use your CMS account/i)).toBeInTheDocument()
  })

  it('exposes a stable testid hook for e2e selectors', () => {
    const { container } = render(<LoginIntro />)
    expect(container.querySelector('[data-testid="admin-login-intro"]')).not.toBeNull()
  })

  it('does not hardcode the brand name — must flow from BRAND.fullName', () => {
    render(<LoginIntro />)
    // Defensive: if someone replaces the import with a literal, the test
    // catches it the next time the brand string changes.
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading.textContent).toContain(BRAND.fullName)
  })
})
