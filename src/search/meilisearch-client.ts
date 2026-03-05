/**
 * @description
 * Meilisearch client singleton for server-side operations.
 * Uses the meilisearch JS client directly (NOT payload-meilisearch plugin,
 * which only supports Payload 1.x).
 *
 * Key features:
 * - Singleton instance for reuse across hooks
 * - Configured from environment variables
 * - Admin API key for indexing operations
 *
 * @dependencies
 * - meilisearch: Official Meilisearch JS client
 *
 * @notes
 * - Server-side only — never import in client components
 * - Uses MEILISEARCH_HOST and MEILISEARCH_API_KEY from env
 * - Returns null if env vars are not configured (graceful degradation)
 */
import { MeiliSearch } from 'meilisearch'

let client: MeiliSearch | null = null

export function getMeilisearchClient(): MeiliSearch | null {
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
