#!/usr/bin/env node
/**
 * One-shot Algolia backfill for the News collection (Slice 2 POC).
 *
 * Usage:
 *   node scripts/algolia-backfill.mjs                  # all news, both locales
 *   node scripts/algolia-backfill.mjs --locale=fr      # FR only
 *   node scripts/algolia-backfill.mjs --collections=news,projects   # multi
 *
 * Idempotent: re-running produces the same Algolia state — `objectID`
 * is the Payload doc id, so saveObjects upserts in place.
 *
 * Reads the EXACT same env vars that the runtime sync uses
 * (`ALGOLIA_APP_ID`, `ALGOLIA_ADMIN_API_KEY`); no separate config.
 *
 * (#173 / Algolia migration Slice 2.)
 */
import { algoliasearch } from 'algoliasearch'
import { getPayload } from 'payload'

const argv = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    if (!arg.startsWith('--')) return [arg, true]
    const [key, ...rest] = arg.slice(2).split('=')
    return [key, rest.length ? rest.join('=') : true]
  }),
)

const COLLECTIONS = (argv.collections ? String(argv.collections).split(',') : ['news']).map((s) =>
  s.trim(),
)
const LOCALES = argv.locale ? [String(argv.locale)] : ['en', 'fr']

function transform(doc) {
  const board = doc.board && typeof doc.board === 'object' ? doc.board : null
  const boardAbbreviation = board ? board.abbreviation : doc.board
  return {
    objectID: String(doc.id),
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

async function main() {
  const appId = process.env.ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY
  if (!appId || !adminKey) {
    console.error('[algolia-backfill] ALGOLIA_APP_ID / ALGOLIA_ADMIN_API_KEY missing — aborting.')
    process.exit(1)
  }

  const algolia = algoliasearch(appId, adminKey)

  const payloadConfig = (await import('../src/payload.config.ts')).default
  const payload = await getPayload({ config: await payloadConfig })

  let total = 0
  for (const collection of COLLECTIONS) {
    for (const locale of LOCALES) {
      const indexName = `${collection}_${locale}`
      console.log(`[algolia-backfill] → ${indexName}`)

      const all = await payload.find({
        collection,
        limit: 5000,
        depth: 3,
        locale,
        overrideAccess: true,
        pagination: false,
      })

      const records = all.docs
        .filter((doc) => doc.title || doc.slug)
        .map((doc) => transform(doc))

      if (records.length === 0) {
        console.log(`  (skipped — 0 docs with content for ${locale})`)
        continue
      }

      await algolia.saveObjects({ indexName, objects: records })
      console.log(`  ✓ ${records.length} records pushed`)
      total += records.length
    }
  }

  console.log(`[algolia-backfill] done — ${total} record(s) total.`)
  process.exit(0)
}

main().catch((err) => {
  console.error('[algolia-backfill] fatal:', err)
  process.exit(1)
})
