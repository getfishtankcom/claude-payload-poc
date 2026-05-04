/**
 * @description
 * `getSearchProvider()` — the only thing collection configs and frontend
 * search clients should call. Returns the conforming `SearchProvider`.
 *
 * Single-provider since Meilisearch was removed (chore: remove Meilisearch).
 * The provider abstraction is kept so a future swap doesn't require touching
 * every collection + the search page again.
 *
 * Adding a second provider:
 * 1. Implement the `SearchProvider` interface from `./types.ts` in
 *    `src/search/<provider>/provider.ts`.
 * 2. Re-introduce `resolveProviderName()` reading `SEARCH_PROVIDER` +
 *    `NEXT_PUBLIC_SEARCH_PROVIDER` (literal property access — Next inlines
 *    NEXT_PUBLIC_* only when accessed by literal name) and dispatch.
 * 3. Document the env var contract in `.env.example`.
 */
import { algoliaProvider } from './algolia'
import type { SearchProvider } from './types'

export function getSearchProvider(): SearchProvider {
  return algoliaProvider
}

export type { SearchProvider, SyncHooks, SyncHooksConfig, IndexSettings, SearchClient } from './types'
