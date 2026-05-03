#!/usr/bin/env node
/**
 * One-shot Meilisearch reindex for the searchable collections.
 *
 * Background: search was returning 0 results because Meilisearch had no
 * indexes — the per-collection `afterChange` sync hook only fires on
 * save, so documents seeded before the hook was wired in never made it
 * to Meili. This script walks each searchable collection, transforms
 * every doc the same way the live hook would, and bulk-uploads to the
 * `<collection>_en` index.
 *
 * Idempotent: re-running just re-uploads (Meili upserts by `id`).
 *
 * Usage:
 *   node scripts/reindex-meilisearch.mjs
 *   node scripts/reindex-meilisearch.mjs --collections=news,projects   # subset
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import { MeiliSearch } from 'meilisearch'
import config from '../src/payload.config.ts'

const COLLECTIONS = [
  { slug: 'news', indexName: 'news' },
  { slug: 'projects', indexName: 'projects' },
  { slug: 'pages', indexName: 'pages' },
  { slug: 'consultations', indexName: 'consultations' },
  { slug: 'documents', indexName: 'documents' },
  { slug: 'events', indexName: 'events' },
]

const FILTERABLE_ATTRIBUTES = [
  'board',
  'standard',
  'content_type',
  'file_type',
  'date',
  'status',
]

const SEARCHABLE_ATTRIBUTES = ['title', 'body', 'excerpt', 'summary']

function transform(doc) {
  const board = doc.board
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

async function ensureIndex(client, indexName) {
  try {
    await client.createIndex(indexName, { primaryKey: 'id' })
  } catch {
    /* already exists */
  }
  const index = client.index(indexName)
  await index.updateFilterableAttributes(FILTERABLE_ATTRIBUTES)
  await index.updateSearchableAttributes(SEARCHABLE_ATTRIBUTES)
  return index
}

async function reindex(payload, client, slug, indexName) {
  const enIndexName = `${indexName}_en`
  const enIndex = await ensureIndex(client, enIndexName)
  const result = await payload.find({
    collection: slug,
    locale: 'en',
    depth: 1,
    limit: 1000,
    overrideAccess: true,
  })
  if (result.docs.length === 0) {
    console.log(`  ${slug}: 0 docs (skipped)`)
    return 0
  }
  const docs = result.docs.map(transform)
  await enIndex.addDocuments(docs)
  console.log(`  ${slug} → ${enIndexName}: ${docs.length} docs uploaded`)
  return docs.length
}

async function main() {
  const filterArg = process.argv.find((a) => a.startsWith('--collections='))
  const filter = filterArg
    ? new Set(filterArg.split('=')[1].split(',').map((s) => s.trim()))
    : null
  const targets = filter
    ? COLLECTIONS.filter((c) => filter.has(c.slug))
    : COLLECTIONS

  const apiKey = process.env.MEILISEARCH_API_KEY || 'fras-dev-master-key'
  const host = process.env.MEILISEARCH_HOST || 'http://localhost:7700'
  const client = new MeiliSearch({ host, apiKey })

  const payload = await getPayload({ config })

  console.log(`Reindexing ${targets.length} collection(s) to ${host}...`)
  let total = 0
  for (const { slug, indexName } of targets) {
    try {
      total += await reindex(payload, client, slug, indexName)
    } catch (err) {
      console.error(`  ${slug}: failed —`, err.message)
    }
  }
  console.log(`\nDone. ${total} document(s) indexed.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
