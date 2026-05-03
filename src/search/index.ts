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
  if (raw === 'algolia') {
    // Slice 2+ ships the Algolia adapter behind a flag; until then,
    // explicitly opting in falls through to the default + a warning so
    // a misconfigured env doesn't silently disable search.
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[search] SEARCH_PROVIDER=algolia is reserved (see #173). Falling back to 'meilisearch'.`,
      )
    }
    return 'meilisearch'
  }
  return 'meilisearch'
}

export function getSearchProvider(): SearchProvider {
  const name = resolveProviderName()
  const cached = cache.get(name)
  if (cached) return cached
  // Currently `meilisearch` is the only registered provider; Slice 2+
  // will add an `algolia` case below. The factory uses the env-driven
  // name as the cache key so a future `SEARCH_PROVIDER=algolia` flip
  // doesn't recompute Meili's resilient client.
  const provider: SearchProvider = meilisearchProvider
  cache.set(name, provider)
  return provider
}

export type { SearchProvider, SyncHooks, SyncHooksConfig, IndexSettings, SearchClient } from './types'
