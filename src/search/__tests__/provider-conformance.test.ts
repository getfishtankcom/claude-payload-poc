/**
 * @description
 * Parameterized conformance tests for every `SearchProvider`
 * implementation. Pins the interface contract so a new provider can't
 * land without satisfying the same shape.
 *
 * Slice 1 (#172) registers only `meilisearchProvider`; the table below
 * grows when Slice 2 (#173) lands the Algolia provider.
 */
import { describe, expect, it } from 'vitest'

import { meilisearchProvider } from '../meilisearch'
import type { SearchProvider } from '../types'

const PROVIDERS: Array<[string, SearchProvider]> = [
  ['meilisearch', meilisearchProvider],
]

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
    // We don't have a live Meilisearch instance in unit tests; the
    // provider's settings call is expected to no-op when the host is
    // unreachable. This test pins the return contract, not the side
    // effect — that's covered by integration tests at deploy time.
    const result = await provider.applySettings('unit-test-index', {
      filterableAttributes: ['board'],
    })
    expect(result).toBeUndefined()
  })
})
