/**
 * @description
 * Meilisearch sync — Payload `afterChange` + `afterDelete` hooks that
 * mirror Payload documents into Meilisearch indexes.
 *
 * Moved from `src/search/meilisearch-sync.ts` as part of the
 * `SearchProvider` abstraction (#172 / Algolia migration Slice 1). The
 * public surface is now `meilisearchProvider.getSyncHooks(config)` —
 * collection configs no longer import this module directly.
 *
 * @notes
 * - Bilingual indexes: `{collection}_en` (FR comes online with Slice 3).
 * - Filterable: board / standard / content_type / file_type / date / status.
 * - Searchable: title / body / excerpt / summary.
 * - Failures are swallowed so a Meilisearch outage doesn't block CMS saves.
 */
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

import type { IndexSettings, SyncHooks, SyncHooksConfig } from '../types'
import { getMeilisearchAdminClient } from './client'

/** Default filterable attributes for all searchable collections */
const DEFAULT_FILTERABLE_ATTRIBUTES = [
  'board',
  'standard',
  'content_type',
  'file_type',
  'date',
  'status',
]

/** Default searchable attributes */
const DEFAULT_SEARCHABLE_ATTRIBUTES = [
  'title',
  'body',
  'excerpt',
  'summary',
]

/** Default transform — extracts common fields from a Payload document
    into a flat Meilisearch document. */
function defaultTransform(doc: Record<string, unknown>): Record<string, unknown> {
  const board = doc.board as Record<string, unknown> | string | undefined
  const boardAbbreviation = typeof board === 'object' && board ? board.abbreviation : board

  return {
    id: doc.id,
    title: doc.title || '',
    slug: doc.slug || '',
    summary: doc.summary || doc.excerpt || '',
    body: doc.content || doc.body || '',
    board: boardAbbreviation || '',
    status: doc.status || '',
    date: doc.publishedDate || doc.date || doc.createdAt || '',
    content_type: doc.type || '',
    updatedAt: doc.updatedAt || '',
  }
}

/** Track which Meilisearch indexes have already had settings pushed
    so we don't re-issue the same settings call on every sync. */
const configuredIndexes = new Set<string>()

/** Push searchable + filterable settings to a Meilisearch index. Used by
    both the auto-configure path (first sync) and the
    `MeilisearchProvider.applySettings` API. */
export async function applyMeilisearchSettings(
  indexName: string,
  settings: IndexSettings = {},
): Promise<void> {
  const client = getMeilisearchAdminClient()
  if (!client) return

  const filterable = settings.filterableAttributes ?? DEFAULT_FILTERABLE_ATTRIBUTES
  const searchable = settings.searchableAttributes ?? DEFAULT_SEARCHABLE_ATTRIBUTES

  try {
    await client.createIndex(indexName, { primaryKey: 'id' })
    const index = client.index(indexName)
    await index.updateFilterableAttributes(filterable)
    await index.updateSearchableAttributes(searchable)
    if (settings.sortableAttributes) {
      await index.updateSortableAttributes(settings.sortableAttributes)
    }
  } catch (error) {
    console.warn(`[Meilisearch] Index setup for '${indexName}':`, error)
  }
}

/**
 * Build Meilisearch sync hooks for a Payload collection.
 *
 * Exposed via `MeilisearchProvider.getSyncHooks(config)`; not normally
 * imported directly.
 */
export function buildMeilisearchSyncHooks(config: SyncHooksConfig): SyncHooks {
  const { indexName, transform = defaultTransform } = config
  // Bilingual indexes — FR comes online with Slice 3.
  const enIndexName = `${indexName}_en`

  const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
    const client = getMeilisearchAdminClient()
    if (!client) return doc

    try {
      if (!configuredIndexes.has(enIndexName)) {
        await applyMeilisearchSettings(enIndexName)
        configuredIndexes.add(enIndexName)
      }

      const meilisearchDoc = transform(doc as Record<string, unknown>)
      const index = client.index(enIndexName)
      await index.addDocuments([meilisearchDoc])
    } catch (error) {
      console.error(`[Meilisearch] Failed to sync document to '${enIndexName}':`, error)
    }

    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    const client = getMeilisearchAdminClient()
    if (!client || !doc) return

    try {
      const index = client.index(enIndexName)
      await index.deleteDocument(String(doc.id))
    } catch (error) {
      console.error(`[Meilisearch] Failed to delete document from '${enIndexName}':`, error)
    }
  }

  return { afterChange, afterDelete }
}
