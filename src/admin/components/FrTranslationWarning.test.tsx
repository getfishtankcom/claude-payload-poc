/**
 * Tests for `<FrTranslationWarning>` after the #84 (QA-014) rewrite.
 *
 * Old contract was wrong: it read a `title_fr` field that doesn't exist on
 * Payload-localized schemas, so the heuristic was always-show or
 * never-show against real data, and a successful Translate to FR never
 * cleared the flag. New contract:
 *
 *   1. On mount, fetch `/api/{slug}/{id}?locale=fr&depth=0` and compare
 *      `frDoc.title` against the active-locale title from `useDocumentInfo`.
 *   2. Re-fetch when a `fras:translation-completed` window event fires for
 *      this doc.
 *   3. While the FR fetch is in flight, render nothing (no flash of the
 *      warning during initial mount).
 */
import * as React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  FR_TRANSLATION_COMPLETED_EVENT,
  emitFrTranslationCompleted,
} from '../lib/fr-translation-events'

let mockDocInfo: Record<string, unknown>

vi.mock('@payloadcms/ui', () => ({
  useDocumentInfo: () => mockDocInfo,
}))

import { FrTranslationWarning } from './FrTranslationWarning'

function mockFrFetch(frTitle?: string, status = 200) {
  return vi.fn(async () => {
    if (status !== 200) {
      return new Response('', { status })
    }
    return new Response(
      JSON.stringify(frTitle === undefined ? {} : { title: frTitle }),
      { status: 200, headers: { 'content-type': 'application/json' } },
    )
  }) as unknown as typeof fetch
}

beforeEach(() => {
  mockDocInfo = {}
})
afterEach(() => {
  vi.restoreAllMocks()
})

describe('<FrTranslationWarning>', () => {
  it('renders the warning when the FR-locale doc has no title', async () => {
    mockDocInfo = { id: 7, collectionSlug: 'pages', title: 'About Us' }
    vi.stubGlobal('fetch', mockFrFetch(undefined))

    render(<FrTranslationWarning />)
    const link = await screen.findByRole('link', { name: /Missing French translation/i })
    expect(link).toHaveAttribute('href', '/admin/collections/pages/7?locale=fr')
  })

  it('renders the warning when the FR title is the same as EN (placeholder copy)', async () => {
    mockDocInfo = { id: 7, collectionSlug: 'pages', title: 'About' }
    vi.stubGlobal('fetch', mockFrFetch('About'))

    render(<FrTranslationWarning />)
    expect(await screen.findByRole('link', { name: /Missing French translation/i })).toBeInTheDocument()
  })

  it('renders nothing when a real FR translation exists', async () => {
    mockDocInfo = { id: 7, collectionSlug: 'pages', title: 'About' }
    vi.stubGlobal('fetch', mockFrFetch('À propos'))

    const { container } = render(<FrTranslationWarning />)
    // Wait for the fetch to settle so `loaded` flips true
    await waitFor(() => {
      expect(container).toBeEmptyDOMElement()
    })
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })

  it('renders nothing when there is no document id', async () => {
    mockDocInfo = { collectionSlug: 'pages', title: 'About' }
    vi.stubGlobal('fetch', mockFrFetch(undefined))

    const { container } = render(<FrTranslationWarning />)
    expect(container).toBeEmptyDOMElement()
  })

  it('hits the right URL — Payload localized read by query param, not field suffix', async () => {
    mockDocInfo = { id: 42, collectionSlug: 'news', title: 'Hello' }
    const fetchSpy = mockFrFetch('Bonjour')
    vi.stubGlobal('fetch', fetchSpy)

    render(<FrTranslationWarning />)
    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalled()
    })
    const [url, init] = (fetchSpy as unknown as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toBe('/api/news/42?locale=fr&depth=0')
    expect(init.credentials).toBe('same-origin')
  })

  it('re-fetches and clears the warning when fras:translation-completed fires for this doc', async () => {
    mockDocInfo = { id: 7, collectionSlug: 'pages', title: 'About' }

    let frTitle: string | undefined = undefined
    const fetchSpy = vi.fn(async () => {
      return new Response(
        JSON.stringify(frTitle === undefined ? {} : { title: frTitle }),
        { status: 200, headers: { 'content-type': 'application/json' } },
      )
    }) as unknown as typeof fetch
    vi.stubGlobal('fetch', fetchSpy)

    render(<FrTranslationWarning />)
    await screen.findByRole('link', { name: /Missing French translation/i })

    // Translate happens — FR doc now has a real title.
    frTitle = 'À propos'
    act(() => {
      emitFrTranslationCompleted({ collectionSlug: 'pages', docId: 7 })
    })
    await waitFor(() => {
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })
    // The button should have triggered a second fetch.
    expect((fetchSpy as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBeGreaterThanOrEqual(2)
  })

  it('ignores the event when it fires for a different doc', async () => {
    mockDocInfo = { id: 7, collectionSlug: 'pages', title: 'About' }
    const fetchSpy = mockFrFetch(undefined)
    vi.stubGlobal('fetch', fetchSpy)

    render(<FrTranslationWarning />)
    await screen.findByRole('link')
    const callsAfterMount = (fetchSpy as unknown as ReturnType<typeof vi.fn>).mock.calls.length

    act(() => {
      // Different doc id
      emitFrTranslationCompleted({ collectionSlug: 'pages', docId: 999 })
    })
    // No additional fetch should fire.
    expect((fetchSpy as unknown as ReturnType<typeof vi.fn>).mock.calls.length).toBe(callsAfterMount)
  })

  it('exposes a stable event name so TranslateButton and the warning stay in sync', () => {
    expect(FR_TRANSLATION_COMPLETED_EVENT).toBe('fras:translation-completed')
  })
})
