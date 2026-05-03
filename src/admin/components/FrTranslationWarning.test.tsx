/**
 * Unit tests for FrTranslationWarning.
 *
 * The icon must:
 * - Render when the FR title is missing OR equal to the EN title
 * - NOT render when a real FR translation exists
 * - NOT render when there's no document context (id / collectionSlug)
 * - Link to the matching edit view with `?locale=fr`
 */
import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

let mockDocInfo: Record<string, unknown>

vi.mock('@payloadcms/ui', () => ({
  useDocumentInfo: () => mockDocInfo,
}))

import { FrTranslationWarning } from './FrTranslationWarning'

afterEach(() => {
  mockDocInfo = {}
})

describe('<FrTranslationWarning>', () => {
  it('renders when title_fr is missing', () => {
    mockDocInfo = { id: '7', collectionSlug: 'pages', title: 'About Us' }
    render(<FrTranslationWarning />)
    const link = screen.getByRole('link', { name: /Missing French translation/i })
    expect(link).toHaveAttribute('href', '/admin/collections/pages/7?locale=fr')
  })

  it('renders when title_fr matches title_en (placeholder copy)', () => {
    mockDocInfo = { id: '7', collectionSlug: 'pages', title: 'About', title_fr: 'About' }
    render(<FrTranslationWarning />)
    expect(screen.getByRole('link')).toBeInTheDocument()
  })

  it('renders nothing when a real FR translation exists', () => {
    mockDocInfo = { id: '7', collectionSlug: 'pages', title: 'About', title_fr: 'À propos' }
    const { container } = render(<FrTranslationWarning />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders nothing when there is no document id', () => {
    mockDocInfo = { collectionSlug: 'pages', title: 'About' }
    const { container } = render(<FrTranslationWarning />)
    expect(container).toBeEmptyDOMElement()
  })
})
