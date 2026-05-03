/**
 * @description
 * Algolia index-settings-as-code. Source of truth for every Algolia
 * index FRAS uses. The CI pipeline calls `apply-algolia-settings.mjs`
 * on merges to main; the script reads this object and pushes settings
 * to Algolia.
 *
 * Slice 2 (#173) seeds `news` only. Slice 3 (#174) adds the remaining
 * collections. Slice 4 (#175) tightens the search-only key against the
 * indexes listed here.
 *
 * @notes
 * - Per-locale indexes — `news_en`, `news_fr`. Per-language tokenization
 *   driven by Algolia's `indexLanguages` once Slice 3's expansion lands.
 * - `attributesForFaceting` enables `filterOnly()` syntax for filters
 *   the UI doesn't render as facet counts (board / status etc.).
 */
import type { IndexSettings } from '@/search/types'

export type AlgoliaCollectionSettings = {
  /** Logical Payload collection slug — used to derive `<slug>_en` /
      `<slug>_fr` index names. */
  collection: string
  /** Settings applied identically to both locale-specific indexes. */
  settings: IndexSettings
}

export const ALGOLIA_INDEX_SETTINGS: readonly AlgoliaCollectionSettings[] = [
  {
    collection: 'news',
    settings: {
      // Ranked by attribute order — title first, summary, then body.
      searchableAttributes: ['title', 'summary', 'excerpt', 'body'],
      // Faceted filters surfaced in `FilterSidebar`.
      filterableAttributes: ['board', 'standard', 'content_type', 'date', 'status'],
      // Sort dropdown surfaces these.
      sortableAttributes: ['date', 'updatedAt'],
    },
  },
]
