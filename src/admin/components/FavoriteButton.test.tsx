/**
 * Unit tests for FavoriteButton.
 *
 * Validates:
 * - Initial state reflects localStorage (filled vs outline + aria-pressed)
 * - Click toggles the pinned state and updates aria-label / aria-pressed
 * - The button persists its change to the `cms_favorites` localStorage key
 */
import * as React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { FavoriteButton } from './FavoriteButton'

const STORAGE_KEY = 'cms_favorites'

const props = {
  id: 'page-1',
  title: 'About Us',
  collection: 'pages',
  path: '/admin/collections/pages/page-1',
}

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('<FavoriteButton>', () => {
  it('renders unpinned by default with the correct aria-label', () => {
    render(<FavoriteButton {...props} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    expect(btn).toHaveAttribute('aria-label', 'Pin to favorites')
  })

  it('renders pinned when localStorage already contains the item', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...props, pinnedAt: '2026-05-01T00:00:00Z' }]),
    )
    render(<FavoriteButton {...props} />)
    const btn = screen.getByRole('button')
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    expect(btn).toHaveAttribute('aria-label', 'Unpin from favorites')
  })

  it('clicking toggles the pinned state and writes to localStorage', () => {
    render(<FavoriteButton {...props} />)
    const btn = screen.getByRole('button')

    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'true')
    const after = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(after).toHaveLength(1)
    expect(after[0].id).toBe('page-1')

    fireEvent.click(btn)
    expect(btn).toHaveAttribute('aria-pressed', 'false')
    const empty = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
    expect(empty).toHaveLength(0)
  })
})
