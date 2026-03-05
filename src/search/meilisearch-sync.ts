/**
 * @description
 * Meilisearch sync hooks for Payload CMS collections.
 * Provides afterChange and afterDelete hooks that sync documents
 * to Meilisearch indexes automatically.
 *
 * Key features:
 * - syncToMeilisearch() returns afterChange + afterDelete hooks
 * - Bilingual indexes: {collection}_en, {collection}_fr
 * - Configurable searchable and filterable attributes per collection
 * - Graceful error handling — sync failures don't block CMS saves
 *
 * @dependencies
 * - meilisearch-client: Singleton Meilisearch client
 *
 * @notes
 * - Custom hooks (NOT payload-meilisearch plugin — only supports Payload 1.x)
 * - Indexes are created on first document sync if they don't exist
 * - Filterable attributes: board, standard, content_type, file_type, date
 * - Searchable attributes: title, body, excerpt
 * - Document ID in Meilisearch = Payload document ID
 */
import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
} from 'payload'

import { getMeilisearchClient } from './meilisearch-client'

type SyncConfig = {
  /** The Meilisearch index name (e.g., 'projects', 'news') */
  indexName: string
  /** Function to transform Payload doc into Meilisearch document */
  transform?: (doc: Record<string, unknown>) => Record<string, unknown>
}

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

/**
 * Default transform — extracts common fields from a Payload document
 * into a flat Meilisearch document.
 */
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

/**
 * Configures Meilisearch index settings (filterable, searchable attributes).
 * Called once per index on first sync.
 */
async function ensureIndexSettings(indexName: string): Promise<void> {
  const client = getMeilisearchClient()
  if (!client) return

  try {
    // Create index if it doesn't exist (no-op if exists)
    await client.createIndex(indexName, { primaryKey: 'id' })

    // Configure filterable and searchable attributes
    const index = client.index(indexName)
    await index.updateFilterableAttributes(DEFAULT_FILTERABLE_ATTRIBUTES)
    await index.updateSearchableAttributes(DEFAULT_SEARCHABLE_ATTRIBUTES)
  } catch (error) {
    // Index may already exist with settings — that's fine
    console.warn(`[Meilisearch] Index setup for '${indexName}':`, error)
  }
}

// Track which indexes have been configured
const configuredIndexes = new Set<string>()

/**
 * Creates afterChange and afterDelete hooks for syncing a Payload collection
 * to Meilisearch. Register these hooks on searchable collections.
 *
 * Usage:
 *   const { afterChange, afterDelete } = syncToMeilisearch({ indexName: 'news' })
 *   // Add to collection config: hooks: { afterChange: [afterChange], afterDelete: [afterDelete] }
 */
export function syncToMeilisearch(config: SyncConfig) {
  const { indexName, transform = defaultTransform } = config

  // For bilingual support, we use {indexName}_en
  // FR index support will be added when i18n is implemented (Epic 18)
  const enIndexName = `${indexName}_en`

  const afterChange: CollectionAfterChangeHook = async ({ doc }) => {
    const client = getMeilisearchClient()
    if (!client) return doc

    try {
      // Ensure index is configured on first sync
      if (!configuredIndexes.has(enIndexName)) {
        await ensureIndexSettings(enIndexName)
        configuredIndexes.add(enIndexName)
      }

      const meilisearchDoc = transform(doc as Record<string, unknown>)
      const index = client.index(enIndexName)
      await index.addDocuments([meilisearchDoc])
    } catch (error) {
      // Don't block CMS save on sync failure
      console.error(`[Meilisearch] Failed to sync document to '${enIndexName}':`, error)
    }

    return doc
  }

  const afterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
    const client = getMeilisearchClient()
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
