/**
 * @description
 * `algoliaProvider` — `SearchProvider` implementation backed by Algolia.
 * Activated when `SEARCH_PROVIDER=algolia` and the registry in
 * `src/search/index.ts` includes the case (Slice 2 / #173 onwards).
 *
 * Slice 2 ships this for News only; Slice 3 (#174) wires up the
 * remaining 7 collections.
 */
import { liteClient } from 'algoliasearch/lite'

import type {
  IndexSettings,
  ProviderLocale,
  SearchClient,
  SearchProvider,
  SyncHooks,
  SyncHooksConfig,
} from '../types'
import { applyAlgoliaSettings, buildAlgoliaSyncHooks } from './sync'

/** Build a frontend search-only client for a given locale. Keys are
    deliberately separated: the admin key never leaves the server, the
    NEXT_PUBLIC_ search-only key is safe to ship to the browser.

    Uses `algoliasearch/lite` (the InstantSearch-compatible v4-shape
    client). The full `algoliasearch` v5 default export is NOT compatible
    with react-instantsearch v7 — its `search()` signature differs and
    InstantSearch silently dispatches no requests. */
function buildSearchClient(_locale: ProviderLocale): SearchClient {
  void _locale
  const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID || process.env.ALGOLIA_APP_ID || ''
  const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY || ''
  // When credentials aren't configured, fall back to a stub that
  // returns empty results — same behavior as the Meilisearch provider's
  // resilient client when its host is unreachable.
  if (!appId || !searchKey) {
    return {
      search: async () => ({ results: [] }),
    } as SearchClient
  }
  const client = liteClient(appId, searchKey)
  return client as unknown as SearchClient
}

export const algoliaProvider: SearchProvider = {
  name: 'algolia',

  getSyncHooks(config: SyncHooksConfig): SyncHooks {
    return buildAlgoliaSyncHooks(config)
  },

  getSearchClient(locale: ProviderLocale): SearchClient {
    return buildSearchClient(locale)
  },

  async applySettings(indexName: string, settings: IndexSettings): Promise<void> {
    await applyAlgoliaSettings(indexName, settings)
  },
}
