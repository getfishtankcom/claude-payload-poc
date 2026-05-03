/**
 * Locks in the Compare Versions modal's REST URL against Payload's actual
 * surface. Regression guard for issue #95 (QA-025): the previous build
 * hit `/api/{collection}/{id}/versions` (which doesn't exist in Payload's
 * REST router), so the modal opened to "Versions fetch failed: 404" for
 * every author. Payload exposes versions at the collection root and filters
 * by parent doc via `where[parent][equals]`.
 */

import { describe, expect, it } from 'vitest'

import { buildVersionsListUrl } from './VersionDiffModal'

describe('buildVersionsListUrl', () => {
  it('points at the collection-level versions route, not a per-doc route', () => {
    const url = buildVersionsListUrl('news', 60)
    expect(url.startsWith('/api/news/versions?')).toBe(true)
    // The bad shape that caused the 404 must never come back.
    expect(url).not.toContain('/api/news/60/versions')
    expect(url).not.toMatch(/\/api\/news\/\d+\/versions/)
  })

  it('filters by parent doc id so we only get versions of this doc', () => {
    const url = buildVersionsListUrl('pages', 'abc123')
    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('where[parent][equals]')).toBe('abc123')
  })

  it('passes the requested limit and a sort that puts newest first', () => {
    const url = buildVersionsListUrl('events', 1, 5)
    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('limit')).toBe('5')
    expect(params.get('sort')).toBe('-updatedAt')
    expect(params.get('depth')).toBe('0')
  })

  it('defaults to limit=20 when no limit is supplied', () => {
    const url = buildVersionsListUrl('news', 1)
    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('limit')).toBe('20')
  })

  it('coerces numeric ids to strings safely (URLSearchParams demands strings)', () => {
    const url = buildVersionsListUrl('projects', 42)
    const params = new URLSearchParams(url.split('?')[1])
    expect(params.get('where[parent][equals]')).toBe('42')
  })
})
