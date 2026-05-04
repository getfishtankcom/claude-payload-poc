/**
 * @description
 * Provider-agnostic search interface for FRAS Canada.
 *
 * Two implementations live behind this:
 * - `MeilisearchProvider` (default, current production) — `src/search/meilisearch/`
 * - `AlgoliaProvider` (in-progress per #171) — `src/search/algolia/`
 *
 * The `getSearchProvider()` factory in `./index.ts` reads `SEARCH_PROVIDER`
 * env var and dispatches to the right one. Code that synchronizes
 * Payload collections or hydrates a search client should depend on this
 * interface — never on a specific provider's exports.
 *
 * @notes
 * - Server-only: this file is imported from Payload collection configs
 *   (`afterChange` / `afterDelete` hooks) and from frontend client
 *   components (`getSearchClient` only). The factory checks the env at
 *   call time so flipping `SEARCH_PROVIDER` requires only a server
 *   restart, not a rebuild.
 */
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

/** Configuration handed to `getSyncHooks`. */
export type SyncHooksConfig = {
  /** Logical index name (e.g. 'news', 'projects'). The provider may
      append a locale suffix internally (Meilisearch: `news_en`,
      Algolia: `news_en` + `news_fr`). */
  indexName: string
  /** Payload collection slug — required by per-locale providers
      (Algolia) so the hook can re-fetch under each locale to detect
      which locales have content. Defaults to `indexName`. */
  collectionSlug?: string
  /** Optional transform from a populated Payload doc to the search
      record. Falls back to a provider-specific default. */
  transform?: (doc: Record<string, unknown>) => Record<string, unknown>
}

/** What every provider must return for sync. */
export type SyncHooks = {
  afterChange: CollectionAfterChangeHook
  afterDelete: CollectionAfterDeleteHook
}

/** Index-settings shape — small per-provider supersets. Both providers
    accept this minimal shape and ignore unknown fields. */
export type IndexSettings = {
  searchableAttributes?: string[]
  filterableAttributes?: string[]
  sortableAttributes?: string[]
}

/** Minimal Algoliasearch-compatible client shape that
    `react-instantsearch` accepts. Both Meilisearch (via
    `@meilisearch/instant-meilisearch`) and Algolia (via `algoliasearch`)
    return this same shape. */
export type SearchClient = {
  search: (requests: unknown) => Promise<unknown>
  // Provider-specific extensions are allowed as additional properties.
  [key: string]: unknown
}

/** Provider locale tag — kept narrow to match Payload's locale codes. */
export type ProviderLocale = 'en' | 'fr'

/** The interface every search provider conforms to. */
export interface SearchProvider {
  /** Stable identifier for logs / metrics — e.g. 'meilisearch', 'algolia'. */
  readonly name: 'meilisearch' | 'algolia'

  /** Build Payload `afterChange` + `afterDelete` hooks for a collection. */
  getSyncHooks(config: SyncHooksConfig): SyncHooks

  /** Return an InstantSearch-compatible client for the frontend. */
  getSearchClient(locale: ProviderLocale): SearchClient

  /** Push index settings (searchable / filterable / sortable). Idempotent
      — providers should treat this as "ensure these settings". */
  applySettings(indexName: string, settings: IndexSettings): Promise<void>
}

/** Env-var key that selects the provider on the server. Default: `meilisearch`. */
export const SEARCH_PROVIDER_ENV = 'SEARCH_PROVIDER'

/** Same selector for client components (Next.js only inlines NEXT_PUBLIC_* into
    client bundles). Must match SEARCH_PROVIDER server-side or reads/writes drift. */
export const SEARCH_PROVIDER_PUBLIC_ENV = 'NEXT_PUBLIC_SEARCH_PROVIDER'

/** Allowed values for `SEARCH_PROVIDER`. */
export type SearchProviderName = SearchProvider['name']
