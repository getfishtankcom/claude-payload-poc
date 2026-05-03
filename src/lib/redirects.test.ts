/**
 * Unit tests for the middleware redirect lookup.
 *
 * `findRedirect` fetches active redirect rules from /api/redirects and
 * caches them with a 5-minute TTL. These tests exercise:
 * - First-call fetch + match
 * - Cache hit on second call (no second fetch)
 * - Inactive / inflight dedup behaviour
 * - Unknown paths return null
 * - invalidateRedirectCache forces a re-fetch
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { findRedirect, invalidateRedirectCache } from './redirects'

const SERVER = 'https://example.test'

const mockFetchOnce = (docs: Array<Record<string, unknown>>) => {
  return vi.fn(
    async () =>
      new Response(JSON.stringify({ docs }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
  )
}

beforeEach(() => {
  invalidateRedirectCache()
})

afterEach(() => {
  vi.restoreAllMocks()
  invalidateRedirectCache()
})

describe('findRedirect()', () => {
  it('returns a matching rule on first call', async () => {
    const fetchSpy = mockFetchOnce([
      { from: '/old-path', to: '/new-path', type: '301', active: true },
    ])
    vi.stubGlobal('fetch', fetchSpy)

    const rule = await findRedirect('/old-path', SERVER)
    expect(rule?.to).toBe('/new-path')
    expect(rule?.type).toBe('301')
    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('serves subsequent calls from the in-memory cache', async () => {
    const fetchSpy = mockFetchOnce([
      { from: '/a', to: '/b', type: '301', active: true },
    ])
    vi.stubGlobal('fetch', fetchSpy)

    await findRedirect('/a', SERVER)
    await findRedirect('/a', SERVER)
    await findRedirect('/a', SERVER)

    expect(fetchSpy).toHaveBeenCalledTimes(1)
  })

  it('returns null for a path that has no rule', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetchOnce([{ from: '/known', to: '/known-new', type: '301', active: true }]),
    )
    expect(await findRedirect('/unknown', SERVER)).toBeNull()
  })

  it('drops rules whose active flag is false during ingestion', async () => {
    vi.stubGlobal(
      'fetch',
      mockFetchOnce([
        { from: '/inactive', to: '/elsewhere', type: '301', active: false },
        { from: '/live', to: '/elsewhere', type: '302', active: true },
      ]),
    )
    expect(await findRedirect('/inactive', SERVER)).toBeNull()
    expect((await findRedirect('/live', SERVER))?.type).toBe('302')
  })

  it('invalidateRedirectCache forces a fresh fetch', async () => {
    const fetchSpy = mockFetchOnce([
      { from: '/x', to: '/y', type: '301', active: true },
    ])
    vi.stubGlobal('fetch', fetchSpy)

    await findRedirect('/x', SERVER)
    invalidateRedirectCache()
    await findRedirect('/x', SERVER)

    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('returns null when the upstream API errors', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('boom', { status: 500 })),
    )
    expect(await findRedirect('/whatever', SERVER)).toBeNull()
  })
})
