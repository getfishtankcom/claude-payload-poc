/**
 * @description
 * Provider-agnostic search interface for FRAS Canada.
 *
 * Currently one implementation: `AlgoliaProvider` in `src/search/algolia/`.
 * The interface is preserved (rather than inlined into algolia/) so a
 * future swap or A/B doesn't require touching every collection +
 * search-page caller.
 *
 * Code that synchronizes Payload collections or hydrates a search client
 * should depend on this interface via `getSearchProvider()` from
 * `./index.ts` — never on a specific provider's exports.
 */
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

/** Configuration handed to `getSyncHooks`. */
export type SyncHooksConfig = {
  /** Logical index name (e.g. 'news', 'projects'). The provider appends
      a per-locale suffix internally (Algolia: `news_en` + `news_fr`). */
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

/** Minimal Algoliasearch-compatible client shape that `react-instantsearch`
    accepts. The Algolia provider returns `algoliasearch/lite`'s `liteClient`
    cast to this. */
export type SearchClient = {
  search: (requests: unknown) => Promise<unknown>
  // Provider-specific extensions are allowed as additional properties.
  [key: string]: unknown
}

/** Provider locale tag — kept narrow to match Payload's locale codes. */
export type ProviderLocale = 'en' | 'fr'

/** The interface every search provider conforms to. */
export interface SearchProvider {
  /** Stable identifier for logs / metrics. */
  readonly name: 'algolia'

  /** Build Payload `afterChange` + `afterDelete` hooks for a collection. */
  getSyncHooks(config: SyncHooksConfig): SyncHooks

  /** Return an InstantSearch-compatible client for the frontend. */
  getSearchClient(locale: ProviderLocale): SearchClient

  /** Push index settings (searchable / filterable / sortable). Idempotent
      — providers should treat this as "ensure these settings". */
  applySettings(indexName: string, settings: IndexSettings): Promise<void>
}

/** Allowed values for the provider's `name` discriminator. Single-entry
    after Meilisearch removal — kept as a typed alias so a future second
    provider can re-expand the union without ripple changes. */
export type SearchProviderName = SearchProvider['name']
