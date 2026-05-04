/**
 * @description
 * Algolia sync — Payload `afterChange` + `afterDelete` hooks that mirror
 * Payload documents into per-locale Algolia indexes. Locale-isolated:
 * a doc with only EN populated lands in `<index>_en` only, never in
 * `<index>_fr` (per User Story 18).
 *
 * Sister to `src/search/meilisearch/sync.ts` — both implementations
 * share the `SearchProvider` interface from `../types.ts`. Slice 2
 * (#173) wires this up for the `news` collection only as a POC; Slice 3
 * (#174) expands to the remaining 7 searchable collections.
 *
 * @notes
 * - Per-locale tokenization happens server-side in Algolia; the
 *   transformer just emits a flat record. The `_en` / `_fr` suffix on
 *   the index drives Algolia's per-language stop-words + stemming.
 * - Failures are swallowed so an Algolia outage doesn't block CMS saves
 *   (matches the Meilisearch behavior + dual-write Slice 5 expectation).
 */
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

import type { IndexSettings, ProviderLocale, SyncHooks, SyncHooksConfig } from '../types'
import { getAlgoliaAdminClient } from './client'

/** Default filterable / facet attributes — kept identical to the
    Meilisearch defaults so a flag flip doesn't change facet behavior. */
const DEFAULT_ATTRIBUTES_FOR_FACETING = [
  'board',
  'standard',
  'content_type',
  'file_type',
  'date',
  'status',
]

/** Default searchable attributes — Algolia ranks by attribute order, so
    `title` first, then `summary`/`excerpt`, then body. */
const DEFAULT_SEARCHABLE_ATTRIBUTES = [
  'title',
  'summary',
  'excerpt',
  'body',
]

const LOCALES: ProviderLocale[] = ['en', 'fr']

/** Default transform — extracts common fields from a Payload document
    into a flat Algolia record. Mirror of `meilisearch/sync.ts` so the
    record shape is provider-agnostic. */
function defaultTransform(doc: Record<string, unknown>): Record<string, unknown> {
  const board = doc.board as Record<string, unknown> | string | undefined
  const boardAbbreviation = typeof board === 'object' && board ? board.abbreviation : board

  // Standards are populated relationships at depth>=1; pull `code` (e.g. "IFRS",
  // "ASPE") which matches the FilterSidebar's option values. Fall back to
  // `abbreviation` then `name` then the raw id.
  const standard = doc.standard as Record<string, unknown> | string | undefined
  const standardCode =
    typeof standard === 'object' && standard
      ? standard.code || standard.abbreviation || standard.name
      : standard

  return {
    objectID: String(doc.id),
    title: doc.title || '',
    slug: doc.slug || '',
    summary: doc.summary || doc.excerpt || '',
    body: doc.content || doc.body || '',
    board: boardAbbreviation || '',
    standard: standardCode || '',
    status: doc.status || '',
    date: doc.publishedDate || doc.date || doc.createdAt || '',
    content_type: doc.type || doc.collection || '',
    updatedAt: doc.updatedAt || '',
  }
}

/** Heuristic: a doc "has FR content" if either `slug.fr` or `title.fr`
    is populated when the doc was fetched with `locale: 'all'`. We only
    write to `<index>_fr` when this is true so we never index a stub
    record into the FR locale. */
function localeHasContent(doc: Record<string, unknown>, locale: ProviderLocale): boolean {
  const lookup = (key: string) => {
    const value = doc[key]
    if (!value) return false
    if (typeof value === 'string') return locale === 'en'
    if (typeof value === 'object' && value !== null && locale in value) {
      return Boolean((value as Record<string, unknown>)[locale])
    }
    return false
  }
  return lookup('title') || lookup('slug')
}

/** Track configured indexes so we don't re-issue settings on every sync. */
const configuredIndexes = new Set<string>()

/** Push searchable + faceting settings to an Algolia index. Idempotent
    — Algolia merges the partial settings server-side. Used by both the
    auto-configure path (first sync) and `AlgoliaProvider.applySettings`. */
export async function applyAlgoliaSettings(
  indexName: string,
  settings: IndexSettings = {},
): Promise<void> {
  const client = getAlgoliaAdminClient()
  if (!client) return

  const searchable = settings.searchableAttributes ?? DEFAULT_SEARCHABLE_ATTRIBUTES
  const faceting = settings.filterableAttributes ?? DEFAULT_ATTRIBUTES_FOR_FACETING

  try {
    await client.setSettings({
      indexName,
      indexSettings: {
        searchableAttributes: searchable,
        attributesForFaceting: faceting,
        ...(settings.sortableAttributes
          ? { customRanking: settings.sortableAttributes.map((attr) => `desc(${attr})`) }
          : {}),
      },
    })
  } catch (error) {
    console.warn(`[Algolia] setSettings('${indexName}') failed:`, error)
  }
}

/**
 * Build Algolia sync hooks for a Payload collection. Splits writes
 * across `<indexName>_en` and `<indexName>_fr` based on which locales
 * have populated content on the doc.
 *
 * Exposed via `algoliaProvider.getSyncHooks(config)`; not normally
 * imported directly.
 */
export function buildAlgoliaSyncHooks(config: SyncHooksConfig): SyncHooks {
  const { indexName, collectionSlug = indexName, transform = defaultTransform } = config

  const afterChange: CollectionAfterChangeHook = async ({ doc, req }) => {
    const client = getAlgoliaAdminClient()
    if (!client) return doc

    try {
      // Re-fetch with `locale: 'all'` so we can detect which locales
      // have content (Payload's hook `doc` is locale-flattened).
      const allLocales = (await req.payload.findByID({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        collection: collectionSlug as any,
        id: (doc as Record<string, unknown>).id as string | number,
        depth: 0,
        locale: 'all',
        overrideAccess: true,
      })) as unknown as Record<string, unknown>

      for (const locale of LOCALES) {
        const localizedIndex = `${indexName}_${locale}`
        if (!localeHasContent(allLocales, locale)) continue

        // Re-fetch under each locale so transform sees the localized
        // strings rather than the locale='all' object map.
        const localized = (await req.payload.findByID({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          collection: collectionSlug as any,
          id: allLocales.id as string | number,
          depth: 3,
          locale,
          overrideAccess: true,
        })) as unknown as Record<string, unknown>

        if (!configuredIndexes.has(localizedIndex)) {
          await applyAlgoliaSettings(localizedIndex)
          configuredIndexes.add(localizedIndex)
        }

        await client.saveObject({
          indexName: localizedIndex,
          body: transform(localized),
        })
      }
    } catch (error) {
      console.error(`[Algolia] Failed to sync document to '${indexName}':`, error)
    }

    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    const client = getAlgoliaAdminClient()
    if (!client || !doc) return

    for (const locale of LOCALES) {
      const localizedIndex = `${indexName}_${locale}`
      try {
        await client.deleteObject({
          indexName: localizedIndex,
          objectID: String((doc as Record<string, unknown>).id),
        })
      } catch (error) {
        console.error(`[Algolia] Failed to delete document from '${localizedIndex}':`, error)
      }
    }
  }

  return { afterChange, afterDelete }
}
