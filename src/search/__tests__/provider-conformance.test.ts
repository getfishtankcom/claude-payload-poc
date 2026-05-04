/**
 * @description
 * Conformance tests for the Algolia `SearchProvider` implementation.
 * Pins the interface contract from `../types.ts`.
 *
 * Was parameterized over both Meilisearch and Algolia until Meilisearch
 * was removed (chore: remove Meilisearch). Kept as a single-provider
 * table so a future second provider can re-expand without restructuring.
 */
import { describe, expect, it } from 'vitest'

import { algoliaProvider } from '../algolia'
import type { SearchProvider } from '../types'

const PROVIDERS: Array<[string, SearchProvider]> = [['algolia', algoliaProvider]]

describe.each(PROVIDERS)('SearchProvider conformance — %s', (_name, provider) => {
  it('exposes a stable string `name`', () => {
    expect(typeof provider.name).toBe('string')
    expect(provider.name.length).toBeGreaterThan(0)
  })

  it('returns sync hooks with `afterChange` and `afterDelete`', () => {
    const hooks = provider.getSyncHooks({ indexName: 'unit-test-index' })
    expect(typeof hooks.afterChange).toBe('function')
    expect(typeof hooks.afterDelete).toBe('function')
  })

  it("each search client exposes a callable `.search`", () => {
    const en = provider.getSearchClient('en')
    const fr = provider.getSearchClient('fr')
    expect(typeof en.search).toBe('function')
    expect(typeof fr.search).toBe('function')
  })

  it('`applySettings` is awaitable and returns void', async () => {
    // Provider's settings call is expected to no-op when admin
    // credentials aren't configured (unit tests don't hit live Algolia).
    // This pins the return contract, not the side effect.
    const result = await provider.applySettings('unit-test-index', {
      filterableAttributes: ['board'],
    })
    expect(result).toBeUndefined()
  })
})
