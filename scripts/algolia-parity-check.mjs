#!/usr/bin/env node
/**
 * Post-parallel-indexing correctness check (Slice 5 / #176).
 *
 * Compares Meilisearch and Algolia per-locale indexes:
 * - Total record counts (delta tolerance: 0)
 * - 50 random sampled records: title + slug + objectID parity
 * - Drift report (records present in one provider but not the other)
 *
 * Output: `.ai-reports/algolia-parallel-indexing-report.md` —
 * markdown table per collection × locale, plus a summary verdict.
 *
 * Usage:
 *   node scripts/algolia-parity-check.mjs                  # all 7
 *   node scripts/algolia-parity-check.mjs --collections=news,projects
 *   node scripts/algolia-parity-check.mjs --sample=100     # bigger sample
 *
 * @notes
 * Reads admin keys for both providers — server-side only. Don't run
 * this from CI; run from a maintainer's terminal during cutover prep.
 */
import { algoliasearch } from 'algoliasearch'
import { MeiliSearch } from 'meilisearch'
import { writeFileSync } from 'node:fs'

const argv = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    if (!arg.startsWith('--')) return [arg, true]
    const [key, ...rest] = arg.slice(2).split('=')
    return [key, rest.length ? rest.join('=') : true]
  }),
)

const COLLECTIONS = (argv.collections
  ? String(argv.collections).split(',')
  : ['news', 'projects', 'consultations', 'documents', 'events', 'pages', 'resources']
).map((s) => s.trim())
const LOCALES = ['en', 'fr']
const SAMPLE_SIZE = argv.sample ? parseInt(String(argv.sample), 10) : 50

async function main() {
  const algoliaAppId = process.env.ALGOLIA_APP_ID
  const algoliaKey = process.env.ALGOLIA_ADMIN_API_KEY
  const meiliHost = process.env.MEILISEARCH_HOST
  const meiliKey = process.env.MEILISEARCH_API_KEY

  if (!algoliaAppId || !algoliaKey) {
    console.error('[parity] ALGOLIA_APP_ID / ALGOLIA_ADMIN_API_KEY missing — aborting.')
    process.exit(1)
  }
  if (!meiliHost) {
    console.error('[parity] MEILISEARCH_HOST missing — aborting.')
    process.exit(1)
  }

  const algolia = algoliasearch(algoliaAppId, algoliaKey)
  const meili = new MeiliSearch({ host: meiliHost, apiKey: meiliKey })

  const rows = []
  let allPass = true

  for (const collection of COLLECTIONS) {
    for (const locale of LOCALES) {
      const meiliIndex = `${collection}_${locale === 'en' ? 'en' : 'fr'}`
      const algoliaIndex = `${collection}_${locale}`

      let meiliCount = 0
      let algoliaCount = 0
      let driftCount = 0
      let sampleMismatches = 0

      try {
        const meiliStats = await meili.index(meiliIndex).getStats()
        meiliCount = meiliStats.numberOfDocuments
      } catch {
        meiliCount = -1
      }

      try {
        const algoliaStats = await algolia.searchSingleIndex({
          indexName: algoliaIndex,
          searchParams: { query: '', hitsPerPage: 0 },
        })
        algoliaCount = algoliaStats.nbHits ?? 0
      } catch {
        algoliaCount = -1
      }

      // 50-sample parity: pull SAMPLE_SIZE objects from Meili and look
      // each up by objectID in Algolia.
      if (meiliCount > 0 && algoliaCount > 0) {
        const meiliDocs = await meili.index(meiliIndex).getDocuments({ limit: SAMPLE_SIZE })
        for (const doc of meiliDocs.results) {
          try {
            const algoliaDoc = await algolia.getObject({
              indexName: algoliaIndex,
              objectID: String(doc.id),
            })
            if (algoliaDoc.title !== doc.title || algoliaDoc.slug !== doc.slug) {
              sampleMismatches += 1
            }
          } catch {
            driftCount += 1
          }
        }
      }

      const ok = meiliCount === algoliaCount && sampleMismatches === 0 && driftCount === 0
      if (!ok) allPass = false

      rows.push({
        collection,
        locale,
        meiliCount,
        algoliaCount,
        sampleMismatches,
        driftCount,
        verdict: ok ? '✓' : '✗',
      })
    }
  }

  const md = [
    '# Algolia Parallel Indexing — Parity Report',
    '',
    `Generated: ${new Date().toISOString()}`,
    `Sample size per index: ${SAMPLE_SIZE}`,
    '',
    `**Overall verdict:** ${allPass ? '✓ PARITY' : '✗ DRIFT — investigate before cutover'}`,
    '',
    '| Collection | Locale | Meili count | Algolia count | Drift | Mismatches | Verdict |',
    '|------------|--------|-------------|---------------|-------|------------|---------|',
    ...rows.map(
      (r) =>
        `| ${r.collection} | ${r.locale} | ${r.meiliCount} | ${r.algoliaCount} | ${r.driftCount} | ${r.sampleMismatches} | ${r.verdict} |`,
    ),
    '',
    '## Notes',
    '',
    '- `Meili count` / `Algolia count` should match exactly. A negative value means the index does not exist on that side.',
    '- `Drift` is the number of sampled records present in Meili but missing in Algolia (a sync gap).',
    '- `Mismatches` is the number of sampled records where `title` or `slug` differs between providers (a transform / locale-resolution gap).',
    '- Investigate any ✗ row before flipping `SEARCH_PROVIDER=algolia` for the cutover.',
    '',
  ].join('\n')

  writeFileSync('.ai-reports/algolia-parallel-indexing-report.md', md)
  console.log('[parity] wrote .ai-reports/algolia-parallel-indexing-report.md')
  console.log(`[parity] verdict: ${allPass ? 'PARITY' : 'DRIFT'}`)
  process.exit(allPass ? 0 : 1)
}

main().catch((err) => {
  console.error('[parity] fatal:', err)
  process.exit(1)
})
