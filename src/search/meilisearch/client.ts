/**
 * @description
 * Meilisearch server client singleton (admin key — full read/write).
 * Used by sync hooks + `applySettings` for index management.
 *
 * Moved from `src/search/meilisearch-client.ts` as part of the
 * `SearchProvider` abstraction (#172 / Algolia migration Slice 1).
 *
 * @notes
 * - Server-side only — never import in client components.
 * - `getSearchClient(locale)` for the frontend builds an InstantSearch
 *   client with the search-only key (see `./provider.ts`).
 * - Returns null if `MEILISEARCH_HOST` is unset (graceful degradation).
 */
import { MeiliSearch } from 'meilisearch'

let client: MeiliSearch | null = null

export function getMeilisearchAdminClient(): MeiliSearch | null {
  if (client) return client

  const host = process.env.MEILISEARCH_HOST
  const apiKey = process.env.MEILISEARCH_API_KEY

  if (!host) {
    console.warn('[Meilisearch] MEILISEARCH_HOST not configured — search sync disabled')
    return null
  }

  client = new MeiliSearch({
    host,
    apiKey: apiKey || undefined,
  })

  return client
}
