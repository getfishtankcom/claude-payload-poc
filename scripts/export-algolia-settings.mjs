#!/usr/bin/env node
/**
 * Pull live Algolia dashboard state back into a reviewable diff
 * against `infrastructure/algolia/settings.ts`. Run quarterly.
 *
 * Output: `.ai-reports/algolia-settings-export.md` — a markdown
 * report listing every index's live searchable / faceting / ranking
 * config and any drift from the committed settings.
 *
 * Usage:
 *   node scripts/export-algolia-settings.mjs
 *   node scripts/export-algolia-settings.mjs --collection=news
 *
 * (#178 / Algolia migration Slice 7.)
 */
import { algoliasearch } from 'algoliasearch'
import { writeFileSync } from 'node:fs'

const argv = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    if (!arg.startsWith('--')) return [arg, true]
    const [key, ...rest] = arg.slice(2).split('=')
    return [key, rest.length ? rest.join('=') : true]
  }),
)

const LOCALES = ['en', 'fr']

async function main() {
  const appId = process.env.ALGOLIA_APP_ID
  const adminKey = process.env.ALGOLIA_ADMIN_API_KEY
  if (!appId || !adminKey) {
    console.error('[export] ALGOLIA_APP_ID / ALGOLIA_ADMIN_API_KEY missing — aborting.')
    process.exit(1)
  }

  const algolia = algoliasearch(appId, adminKey)
  const committed = (await import('../infrastructure/algolia/settings.ts')).ALGOLIA_INDEX_SETTINGS

  const filter = argv.collection
  const targets = filter
    ? committed.filter((entry) => entry.collection === filter)
    : committed

  const sections = []
  let driftCount = 0

  for (const { collection, settings: committedSettings } of targets) {
    for (const locale of LOCALES) {
      const indexName = `${collection}_${locale}`
      let live
      try {
        live = await algolia.getSettings({ indexName })
      } catch (err) {
        sections.push(`### ${indexName}\n\n_(error reading settings: ${err.message})_\n`)
        continue
      }

      const liveSearchable = live.searchableAttributes ?? []
      const liveFaceting = live.attributesForFaceting ?? []
      const liveRanking = live.customRanking ?? []
      const committedSearchable = committedSettings.searchableAttributes ?? []
      const committedFaceting = committedSettings.filterableAttributes ?? []

      const searchableDrift = !arrayEqual(liveSearchable, committedSearchable)
      const facetingDrift = !arrayEqual(liveFaceting, committedFaceting)
      if (searchableDrift || facetingDrift) driftCount += 1

      sections.push(
        [
          `### \`${indexName}\``,
          '',
          `**Drift:** ${searchableDrift || facetingDrift ? '✗ DRIFT' : '✓ in sync'}`,
          '',
          '| Setting | Live (dashboard) | Committed (`settings.ts`) |',
          '|---------|------------------|---------------------------|',
          `| searchableAttributes | \`${liveSearchable.join(', ')}\` | \`${committedSearchable.join(', ')}\` |`,
          `| attributesForFaceting | \`${liveFaceting.join(', ')}\` | \`${committedFaceting.join(', ')}\` |`,
          `| customRanking | \`${liveRanking.join(', ') || '(none)'}\` | _(derived from sortableAttributes)_ |`,
          '',
        ].join('\n'),
      )
    }
  }

  const md = [
    '# Algolia Settings Export',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `**Drift summary:** ${driftCount === 0 ? '✓ all indexes in sync' : `✗ ${driftCount} index(es) drifted from committed settings.ts`}`,
    '',
    'Per the editor guide, dashboard wins for synonyms + query rules + ranking; committed settings.ts wins for searchable + faceting attributes. If drift appears in searchable/faceting, the dashboard change should be reverted OR the committed file should be updated via PR.',
    '',
    '---',
    '',
    ...sections,
  ].join('\n')

  writeFileSync('.ai-reports/algolia-settings-export.md', md)
  console.log('[export] wrote .ai-reports/algolia-settings-export.md')
  console.log(`[export] verdict: ${driftCount === 0 ? 'IN SYNC' : `DRIFT (${driftCount})`}`)
  process.exit(0)
}

function arrayEqual(a, b) {
  if (a.length !== b.length) return false
  return a.every((value, idx) => value === b[idx])
}

main().catch((err) => {
  console.error('[export] fatal:', err)
  process.exit(1)
})
