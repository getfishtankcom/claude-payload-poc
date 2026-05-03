/**
 * @description
 * `getSearchProvider()` — the only thing collection configs and frontend
 * search clients should call. Reads `SEARCH_PROVIDER` from the env (default
 * `meilisearch`) and returns the conforming `SearchProvider`.
 *
 * Adding a new provider:
 * 1. Implement the `SearchProvider` interface from `./types.ts` in
 *    `src/search/<provider>/provider.ts`.
 * 2. Add a case below.
 * 3. Document the env var contract in `.env.example`.
 *
 * The factory is intentionally side-effect-free at module load — provider
 * construction happens on first call so test harnesses can stub the env.
 *
 * (#172 / Algolia migration Slice 1.)
 */
import { algoliaProvider } from './algolia'
import { meilisearchProvider } from './meilisearch'
import {
  SEARCH_PROVIDER_ENV,
  type SearchProvider,
  type SearchProviderName,
} from './types'

/** Memoize per provider name so we don't rebuild the resilient client
    on every render. */
const cache = new Map<SearchProviderName, SearchProvider>()

function resolveProviderName(): SearchProviderName {
  const raw = process.env[SEARCH_PROVIDER_ENV]?.toLowerCase().trim()
  if (raw === 'algolia') return 'algolia'
  return 'meilisearch'
}

export function getSearchProvider(): SearchProvider {
  const name = resolveProviderName()
  const cached = cache.get(name)
  if (cached) return cached
  let provider: SearchProvider
  switch (name) {
    case 'meilisearch':
      provider = meilisearchProvider
      break
    case 'algolia':
      provider = algoliaProvider
      break
    default: {
      const exhaustive: never = name
      throw new Error(`Unknown SEARCH_PROVIDER: ${exhaustive as string}`)
    }
  }
  cache.set(name, provider)
  return provider
}

export type { SearchProvider, SyncHooks, SyncHooksConfig, IndexSettings, SearchClient } from './types'
