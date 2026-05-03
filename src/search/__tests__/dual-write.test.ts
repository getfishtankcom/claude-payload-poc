/**
 * @description
 * Pins the dual-write provider's correctness invariants:
 *
 * - Both providers' `afterChange` and `afterDelete` hooks fire on every
 *   write.
 * - A primary failure does NOT swallow the secondary write (and vice
 *   versa).
 * - Reads return the primary client.
 *
 * (#176 / Algolia migration Slice 5.)
 */
import { describe, expect, it, vi } from 'vitest'

import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  PayloadRequest,
} from 'payload'

import { buildDualWriteProvider } from '../dual-write'
import type {
  IndexSettings,
  ProviderLocale,
  SearchClient,
  SearchProvider,
} from '../types'

type Counters = {
  changeCalls: number
  deleteCalls: number
  settingsCalls: Array<{ indexName: string; settings: IndexSettings }>
}

function makeMockProvider(
  name: 'meilisearch' | 'algolia',
  opts: { changeBehavior?: 'ok' | 'throw'; deleteBehavior?: 'ok' | 'throw' } = {},
): { provider: SearchProvider; counters: Counters } {
  const counters: Counters = { changeCalls: 0, deleteCalls: 0, settingsCalls: [] }
  const provider: SearchProvider = {
    name,
    getSyncHooks: () => {
      const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
        counters.changeCalls += 1
        if (opts.changeBehavior === 'throw') throw new Error(`${name} change failure`)
        return doc
      }
      const afterDelete: CollectionAfterDeleteHook = async () => {
        counters.deleteCalls += 1
        if (opts.deleteBehavior === 'throw') throw new Error(`${name} delete failure`)
      }
      return { afterChange, afterDelete }
    },
    getSearchClient: (_locale: ProviderLocale): SearchClient =>
      ({ search: async () => ({ results: [], _from: name }) }) as SearchClient,
    applySettings: async (indexName: string, settings: IndexSettings) => {
      counters.settingsCalls.push({ indexName, settings })
    },
  }
  return { provider, counters }
}

function fakeReq(): PayloadRequest {
  return {} as unknown as PayloadRequest
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HOOK_ARGS_BASE = {} as any

describe('buildDualWriteProvider (#176)', () => {
  it('fans afterChange to both providers', async () => {
    const p = makeMockProvider('meilisearch')
    const s = makeMockProvider('algolia')
    const dual = buildDualWriteProvider(p.provider, s.provider)
    const { afterChange } = dual.getSyncHooks({ indexName: 'news' })

    await afterChange({ doc: { id: 1, title: 't' }, req: fakeReq(), ...HOOK_ARGS_BASE })
    await new Promise((r) => setTimeout(r, 0))

    expect(p.counters.changeCalls).toBe(1)
    expect(s.counters.changeCalls).toBe(1)
  })

  it('fans afterDelete to both providers', async () => {
    const p = makeMockProvider('meilisearch')
    const s = makeMockProvider('algolia')
    const dual = buildDualWriteProvider(p.provider, s.provider)
    const { afterDelete } = dual.getSyncHooks({ indexName: 'news' })

    await afterDelete({ doc: { id: 1 }, req: fakeReq(), id: 1, ...HOOK_ARGS_BASE })
    await new Promise((r) => setTimeout(r, 0))

    expect(p.counters.deleteCalls).toBe(1)
    expect(s.counters.deleteCalls).toBe(1)
  })

  it('secondary failure does NOT throw out of afterChange (best-effort)', async () => {
    const p = makeMockProvider('meilisearch')
    const s = makeMockProvider('algolia', { changeBehavior: 'throw' })
    const dual = buildDualWriteProvider(p.provider, s.provider)
    const { afterChange } = dual.getSyncHooks({ indexName: 'news' })

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const result = await afterChange({ doc: { id: 1 }, req: fakeReq(), ...HOOK_ARGS_BASE })
    await new Promise((r) => setTimeout(r, 0))

    expect(result).toEqual({ id: 1 })
    expect(p.counters.changeCalls).toBe(1)
    expect(s.counters.changeCalls).toBe(1)
    consoleError.mockRestore()
  })

  it('primary failure does NOT prevent secondary writes (best-effort)', async () => {
    const p = makeMockProvider('meilisearch', { changeBehavior: 'throw' })
    const s = makeMockProvider('algolia')
    const dual = buildDualWriteProvider(p.provider, s.provider)
    const { afterChange } = dual.getSyncHooks({ indexName: 'news' })

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    await afterChange({ doc: { id: 1 }, req: fakeReq(), ...HOOK_ARGS_BASE })
    await new Promise((r) => setTimeout(r, 0))

    expect(p.counters.changeCalls).toBe(1)
    expect(s.counters.changeCalls).toBe(1)
    consoleError.mockRestore()
  })

  it('getSearchClient returns the primary client', async () => {
    const p = makeMockProvider('meilisearch')
    const s = makeMockProvider('algolia')
    const dual = buildDualWriteProvider(p.provider, s.provider)
    const client = dual.getSearchClient('en')
    const result = (await client.search([])) as { _from: string }
    expect(result._from).toBe('meilisearch')
  })

  it('applySettings calls both providers in turn', async () => {
    const p = makeMockProvider('meilisearch')
    const s = makeMockProvider('algolia')
    const dual = buildDualWriteProvider(p.provider, s.provider)

    await dual.applySettings('news_en', { searchableAttributes: ['title'] })

    expect(p.counters.settingsCalls).toEqual([
      { indexName: 'news_en', settings: { searchableAttributes: ['title'] } },
    ])
    expect(s.counters.settingsCalls).toEqual([
      { indexName: 'news_en', settings: { searchableAttributes: ['title'] } },
    ])
  })

  it("name reports the primary provider's name (for telemetry)", () => {
    const p = makeMockProvider('meilisearch')
    const s = makeMockProvider('algolia')
    const dual = buildDualWriteProvider(p.provider, s.provider)
    expect(dual.name).toBe('meilisearch')
  })
})
