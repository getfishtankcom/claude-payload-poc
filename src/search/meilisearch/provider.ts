/**
 * @description
 * `MeilisearchProvider` — `SearchProvider` implementation conforming to
 * `src/search/types.ts`. Wraps the Meilisearch client + sync helpers +
 * InstantSearch frontend connector.
 *
 * Introduced in #172 / Algolia migration Slice 1 as part of the
 * provider-agnostic abstraction.
 *
 * @deprecated since Slice 8 (#179). Algolia is the production search
 * provider after the cutover (Slice 6 / #177). This implementation
 * stays for the documented recovery path:
 *
 *   1. Set `SEARCH_PROVIDER=meilisearch` in production env
 *   2. Re-deploy
 *   3. Run `node scripts/reindex-meilisearch.mjs` to backfill any time
 *      gap from when Meilisearch stopped receiving dual-writes
 *
 * Do NOT add new features here; non-trivial changes belong in the
 * Algolia provider. Keeping the adapter (and its conformance tests)
 * in the codebase is intentional — it is the rollback path.
 */
import { instantMeiliSearch } from '@meilisearch/instant-meilisearch'

import type {
  IndexSettings,
  ProviderLocale,
  SearchClient,
  SearchProvider,
  SyncHooks,
  SyncHooksConfig,
} from '../types'
import { applyMeilisearchSettings, buildMeilisearchSyncHooks } from './sync'

/** Lazily build a resilient InstantSearch client wrapping Meilisearch.
    The wrapper swallows network errors so a Meilisearch outage renders
    "0 results" instead of throwing in the React tree. */
function buildResilientClient(host: string, key: string): SearchClient {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { searchClient: rawClient } = instantMeiliSearch(host, key)
  return {
    ...rawClient,
    search: async (requests: any) => {
      try {
        return await (rawClient as any).search(requests)
      } catch {
        return {
          results: (requests as Array<{ indexName: string }>).map((req) => ({
            hits: [],
            nbHits: 0,
            page: 0,
            nbPages: 0,
            hitsPerPage: 20,
            exhaustiveNbHits: true,
            query: '',
            params: '',
            processingTimeMs: 0,
            index: req.indexName,
          })),
        }
      }
    },
  } as unknown as SearchClient
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/** @deprecated since Slice 8 (#179) — kept as recovery path. See module-level comment. */
export const meilisearchProvider: SearchProvider = {
  name: 'meilisearch',

  getSyncHooks(config: SyncHooksConfig): SyncHooks {
    return buildMeilisearchSyncHooks(config)
  },

  getSearchClient(_locale: ProviderLocale): SearchClient {
    // FR-locale support comes online with Slice 3 — for now both locales
    // hit the same `_en` indexes; the locale param is accepted so the
    // signature matches the future Algolia provider one-for-one.
    void _locale
    const host = process.env.NEXT_PUBLIC_MEILISEARCH_HOST || 'http://localhost:7700'
    const key = process.env.NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY || ''
    return buildResilientClient(host, key)
  },

  async applySettings(indexName: string, settings: IndexSettings): Promise<void> {
    await applyMeilisearchSettings(indexName, settings)
  },
}
