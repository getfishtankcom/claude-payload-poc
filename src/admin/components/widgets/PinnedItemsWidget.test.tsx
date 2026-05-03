/**
 * Unit tests for PinnedItemsWidget.
 *
 * Validates the empty-state copy and that pinned items render with their
 * collection badge + edit-view link, plus the unpin action removes them.
 */
import * as React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import { PinnedItemsWidget } from './PinnedItemsWidget'

const STORAGE_KEY = 'cms_favorites'

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

describe('<PinnedItemsWidget>', () => {
  it('renders the empty-state copy when there are no favorites', () => {
    render(<PinnedItemsWidget />)
    expect(screen.getByText(/No pinned items yet/i)).toBeInTheDocument()
  })

  it('renders pinned items with their title, collection badge, and edit link', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'p-1',
          title: 'Homepage',
          collection: 'pages',
          path: '/admin/collections/pages/p-1',
          pinnedAt: '2026-05-01T00:00:00Z',
        },
      ]),
    )
    render(<PinnedItemsWidget />)
    const link = screen.getByRole('link', { name: 'Homepage' }) as HTMLAnchorElement
    expect(link.getAttribute('href')).toBe('/admin/collections/pages/p-1')
    const widget = screen.getByTestId('widget-pinned-items')
    expect(within(widget).getByText('pages')).toBeInTheDocument()
  })

  it('clicking the unpin button removes the item from the list', () => {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([
        {
          id: 'p-1',
          title: 'Homepage',
          collection: 'pages',
          path: '/admin/collections/pages/p-1',
          pinnedAt: '2026-05-01T00:00:00Z',
        },
      ]),
    )
    render(<PinnedItemsWidget />)
    const unpin = screen.getByRole('button', { name: /Unpin Homepage/ })
    fireEvent.click(unpin)
    expect(screen.queryByText('Homepage')).not.toBeInTheDocument()
    expect(screen.getByText(/No pinned items yet/i)).toBeInTheDocument()
  })
})
