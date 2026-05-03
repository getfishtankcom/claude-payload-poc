/**
 * @description
 * Algolia server client singleton (admin API key — full read/write).
 * Used by sync hooks + `applySettings` for index management.
 *
 * Lazy: never reads the env or constructs the client until first call,
 * so importing this module is side-effect-free and safe to bundle in
 * environments where Algolia credentials may not be set yet (CI without
 * secrets, dev without account, etc.). Returns null in that case so
 * callers can no-op gracefully — the same shape `getMeilisearchAdminClient`
 * uses.
 *
 * (#173 / Algolia migration Slice 2 — News POC.)
 *
 * @notes
 * - Server-side only — never import in client components.
 * - The frontend gets a search-only client via the provider's
 *   `getSearchClient(locale)` (different key, public-safe).
 */
import { algoliasearch, type Algoliasearch } from 'algoliasearch'

let client: Algoliasearch | null = null
let triedInit = false

export function getAlgoliaAdminClient(): Algoliasearch | null {
  if (client) return client
  if (triedInit) return null
  triedInit = true

  const appId = process.env.ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY

  if (!appId || !adminKey) {
    if (process.env.NODE_ENV !== 'test') {
      console.warn(
        '[Algolia] ALGOLIA_APP_ID / ALGOLIA_ADMIN_API_KEY not configured — sync disabled. ' +
          'Set both in `.env` and restart. (#173 / Algolia Slice 2)',
      )
    }
    return null
  }

  client = algoliasearch(appId, adminKey)
  return client
}

/** Test-only — clears the memoized client. */
export function __resetAlgoliaClientForTests(): void {
  client = null
  triedInit = false
}
