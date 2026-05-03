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
      sortableAttributes: ['date', 'updatedAt'],
    },
  },
  {
    collection: 'projects',
    settings: {
      // Projects: title + summary lead, key proposals supplement.
      searchableAttributes: ['title', 'summary', 'key_proposals', 'body'],
      filterableAttributes: ['board', 'standard', 'content_type', 'date', 'status'],
      sortableAttributes: ['date', 'updatedAt'],
    },
  },
  {
    collection: 'consultations',
    settings: {
      searchableAttributes: ['title', 'summary', 'excerpt', 'body'],
      filterableAttributes: ['board', 'standard', 'content_type', 'file_type', 'date', 'status'],
      sortableAttributes: ['deadline_date', 'date', 'updatedAt'],
    },
  },
  {
    collection: 'documents',
    settings: {
      // Documents-for-comment / exposure drafts: title + body, plus
      // extracted PDF text (populated by `extractDocumentText` hook).
      searchableAttributes: ['title', 'summary', 'extracted_text', 'body'],
      filterableAttributes: ['board', 'standard', 'content_type', 'file_type', 'date', 'status'],
      sortableAttributes: ['date', 'updatedAt'],
    },
  },
  {
    collection: 'events',
    settings: {
      // Meetings / webinars / decision summaries — title + description
      // are the search-relevant fields.
      searchableAttributes: ['title', 'description', 'summary', 'body'],
      filterableAttributes: ['board', 'standard', 'content_type', 'date', 'status', 'event_type'],
      sortableAttributes: ['date', 'updatedAt'],
    },
  },
  {
    collection: 'pages',
    settings: {
      // CMS-authored pages — title + meta description, layout block content.
      searchableAttributes: ['title', 'description', 'body'],
      filterableAttributes: ['board', 'content_type', 'status'],
      sortableAttributes: ['updatedAt'],
    },
  },
  {
    collection: 'resources',
    settings: {
      searchableAttributes: ['title', 'summary', 'body'],
      filterableAttributes: ['board', 'standard', 'content_type', 'file_type', 'date', 'status'],
      sortableAttributes: ['date', 'updatedAt'],
    },
  },
]

// `board-members` and `contacts` are intentionally excluded — staff
// records are surfaced via dedicated UI, not faceted search. The
// settings-presence test in `scripts/__tests__/algolia-settings.test.ts`
// guards against a future regression that adds them.
export const ALGOLIA_EXCLUDED_COLLECTIONS = ['board-members', 'contacts'] as const
