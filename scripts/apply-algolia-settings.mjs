#!/usr/bin/env node
/**
 * Push the settings-as-code from `infrastructure/algolia/settings.ts`
 * to Algolia. Called from CI on merge to main.
 *
 * Idempotent: Algolia merges partial settings server-side, so re-running
 * is safe.
 *
 * Usage:
 *   node scripts/apply-algolia-settings.mjs                # all collections
 *   node scripts/apply-algolia-settings.mjs --collection=news
 *
 * (#173 / Algolia migration Slice 2.)
 */
import { algoliasearch } from 'algoliasearch'

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
    console.error('[apply-algolia-settings] ALGOLIA_APP_ID / ALGOLIA_ADMIN_API_KEY missing — aborting.')
    process.exit(1)
  }

  const algolia = algoliasearch(appId, adminKey)

  // Dynamic import so the script can be called from a plain Node runner
  // without a TS compile step (CI uses `tsx` to run this — see workflow).
  const settings = (await import('../infrastructure/algolia/settings.ts')).ALGOLIA_INDEX_SETTINGS

  const filter = argv.collection
  const targets = filter
    ? settings.filter((entry) => entry.collection === filter)
    : settings

  if (targets.length === 0) {
    console.error(`[apply-algolia-settings] no settings entry for --collection=${filter}`)
    process.exit(1)
  }

  for (const { collection, settings: indexSettings } of targets) {
    for (const locale of LOCALES) {
      const indexName = `${collection}_${locale}`
      const algoliaSettings = {
        searchableAttributes: indexSettings.searchableAttributes,
        attributesForFaceting: indexSettings.filterableAttributes,
        ...(indexSettings.sortableAttributes
          ? { customRanking: indexSettings.sortableAttributes.map((a) => `desc(${a})`) }
          : {}),
      }
      await algolia.setSettings({ indexName, indexSettings: algoliaSettings })
      console.log(`  ✓ pushed settings to ${indexName}`)
    }
  }

  console.log('[apply-algolia-settings] done.')
  process.exit(0)
}

main().catch((err) => {
  console.error('[apply-algolia-settings] fatal:', err)
  process.exit(1)
})
