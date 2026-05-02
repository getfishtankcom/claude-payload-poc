#!/usr/bin/env node
/**
 * Batch translator for the FRAS Canada bilingual workflow (PRD §13.H).
 *
 * Iterates over collections in priority order, translates EN docs into
 * FR via the same Translator class the /api/admin/translate route uses.
 * Honors every safeguard:
 *   - TRANSLATION_DISABLED → bail immediately
 *   - TRANSLATION_COST_CEILING_USD → throws CostCeilingExceededError
 *   - TRANSLATION_PER_CALL_USD_CAP → per-call worst-case ceiling
 *   - TRANSLATION_DRY_RUN → synthesize FR locally, $0 spend
 *   - TRANSLATION_MIN_DELAY_MS → paces calls
 *   - .ai-reports/translation-cost.log seeded as lifetime budget
 *
 * Usage:
 *   node scripts/batch-translate.mjs                    # all collections + globals
 *   node scripts/batch-translate.mjs --collection news  # single collection
 *   node scripts/batch-translate.mjs --globals-only     # just the 6 globals
 *   node scripts/batch-translate.mjs --dry-run          # synthetic FR, $0
 *   node scripts/batch-translate.mjs --limit 5          # cap docs per collection
 *   node scripts/batch-translate.mjs --resume           # only translationStatus = 'untranslated'
 *
 * Exit codes:
 *   0 = clean
 *   1 = unrecoverable error
 *   2 = cost ceiling hit (partial run)
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config.ts'
import { Translator, CostCeilingExceededError } from '../src/lib/translation/translator.ts'
import {
  pickTranslatableFields,
  SLUG_FIELDS,
} from '../src/lib/translation/field-picker.ts'

const COLLECTION_PRIORITY = [
  'news',
  'projects',
  'boards',
  'standards',
  'standards-sections',
  'events',
  'resources',
  'board-members',
  'committees',
  'documents-for-comment',
  'document-details',
  'consultations',
  'decision-summaries',
  'pages',
  'documents',
  'job-postings',
]

const GLOBALS_TO_TRANSLATE = [
  'navigation',
  'footer',
  'site-alert',
  'auth-config',
  'search-config',
  // homepage already FR-seeded via src/seed/index.ts; will be re-translated harmlessly
  'homepage',
]

const args = process.argv.slice(2)
function flag(name) {
  return args.includes(`--${name}`)
}
function arg(name, fallback = null) {
  const i = args.indexOf(`--${name}`)
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback
}

const onlyCollection = arg('collection')
const limitPerCollection = arg('limit') ? Number(arg('limit')) : null
const isDryRun = flag('dry-run')
const isResume = flag('resume')
const globalsOnly = flag('globals-only')
const skipGlobals = flag('skip-globals')

if (isDryRun) process.env.TRANSLATION_DRY_RUN = 'true'

const yellow = (s) => `\x1b[33m${s}\x1b[0m`
const green = (s) => `\x1b[32m${s}\x1b[0m`
const red = (s) => `\x1b[31m${s}\x1b[0m`
const dim = (s) => `\x1b[2m${s}\x1b[0m`

async function translateGlobal(payload, translator, slug) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const enDoc = await payload.findGlobal({ slug, locale: 'en', depth: 0 })
  if (!enDoc) return { skipped: true, reason: 'global not found' }
  const fields = pickTranslatableFields(enDoc)
  if (Object.keys(fields).length === 0) return { skipped: true, reason: 'no translatable fields' }
  const result = await translator.translate({
    fields,
    collection: `global:${slug}`,
    slugFields: SLUG_FIELDS,
  })
  await payload.updateGlobal({
    slug,
    locale: 'fr',
    data: result.fields,
  })
  return {
    success: true,
    cost: result.cost.usd,
    fields: Object.keys(result.fields),
  }
}

async function translateCollection(payload, translator, slug, opts = {}) {
  const { limit = null, resume = false } = opts
  const where = resume ? { translationStatus: { equals: 'untranslated' } } : undefined
  const enResult = await payload.find({
    collection: slug,
    locale: 'en',
    limit: limit ?? 100,
    depth: 0,
    where,
  })
  const docs = enResult.docs
  console.log(dim(`  ${docs.length} docs to translate in '${slug}'`))

  let translated = 0
  let skipped = 0
  let failed = 0
  let collectionCost = 0

  for (const doc of docs) {
    const id = doc.id
    const fields = pickTranslatableFields(doc)
    if (Object.keys(fields).length === 0) {
      skipped++
      continue
    }
    try {
      const result = await translator.translate({
        fields,
        collection: slug,
        slugFields: SLUG_FIELDS,
        docId: id,
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await payload.update({
        collection: slug,
        id,
        locale: 'fr',
        data: { ...result.fields, translationStatus: 'pending_review' },
        context: { skipWorkflowValidation: true, skipWorkflowLogging: true },
      })
      translated++
      collectionCost += result.cost.usd
      const cumStr = `cum=$${result.cumulativeUsd.toFixed(4)}`
      console.log(
        `  ${green('✓')} ${slug}#${id} — $${result.cost.usd.toFixed(4)} (${cumStr})`,
      )
    } catch (err) {
      if (err instanceof CostCeilingExceededError) {
        console.log(red(`  ✗ COST CEILING HIT — stopping batch (spent $${err.spent.toFixed(4)})`))
        throw err
      }
      const msg = err instanceof Error ? err.message : String(err)
      console.log(red(`  ✗ ${slug}#${id} failed: ${msg.slice(0, 120)}`))
      failed++
    }
  }

  return { translated, skipped, failed, collectionCost }
}

async function main() {
  if (process.env.TRANSLATION_DISABLED === 'true') {
    console.error(red('TRANSLATION_DISABLED=true — exiting'))
    process.exit(1)
  }
  if (!process.env.ANTHROPIC_API_KEY && !isDryRun) {
    console.error(red('ANTHROPIC_API_KEY missing — set it or pass --dry-run'))
    process.exit(1)
  }

  console.log(green('=== Batch Translate (PRD §13.H) ==='))
  console.log(`  mode:           ${isDryRun ? yellow('DRY-RUN ($0)') : green('LIVE')}`)
  console.log(`  resume:         ${isResume ? 'only translationStatus=untranslated' : 'all docs'}`)
  console.log(`  scope:          ${onlyCollection ? `--collection ${onlyCollection}` : globalsOnly ? 'globals only' : 'globals + collections'}`)
  if (limitPerCollection) console.log(`  limit per coll: ${limitPerCollection}`)
  console.log()

  const payload = await getPayload({ config })
  const translator = new Translator()

  const startUsd = translator.getCumulativeCost()
  const ceilingUsd = translator.getCostCeiling()
  console.log(
    `  Lifetime cost log: $${startUsd.toFixed(4)} / $${ceilingUsd.toFixed(2)} ceiling ` +
      `(remaining: $${(ceilingUsd - startUsd).toFixed(4)})`,
  )
  console.log()

  let globalsDone = 0
  let collsDone = 0

  try {
    // 1. GLOBALS — drives nav/footer/homepage which appear on every page
    if (!skipGlobals && !onlyCollection) {
      console.log(yellow('Phase 1 — Globals (6)'))
      for (const slug of GLOBALS_TO_TRANSLATE) {
        try {
          const r = await translateGlobal(payload, translator, slug)
          if (r.success) {
            console.log(`  ${green('✓')} global:${slug} — $${r.cost.toFixed(4)} (${r.fields.length} fields)`)
            globalsDone++
          } else {
            console.log(dim(`  - global:${slug} skipped (${r.reason})`))
          }
        } catch (err) {
          if (err instanceof CostCeilingExceededError) throw err
          const msg = err instanceof Error ? err.message : String(err)
          console.log(red(`  ✗ global:${slug} failed: ${msg.slice(0, 120)}`))
        }
      }
      console.log()
    }

    if (globalsOnly) {
      console.log(green(`Done. Globals: ${globalsDone}`))
      process.exit(0)
    }

    // 2. COLLECTIONS — priority order
    console.log(yellow('Phase 2 — Collections'))
    const targets = onlyCollection ? [onlyCollection] : COLLECTION_PRIORITY
    let totalTranslated = 0
    let totalFailed = 0
    let totalSkipped = 0
    for (const slug of targets) {
      console.log(`\n  → ${slug}`)
      const r = await translateCollection(payload, translator, slug, {
        limit: limitPerCollection,
        resume: isResume,
      })
      totalTranslated += r.translated
      totalFailed += r.failed
      totalSkipped += r.skipped
      collsDone += 1
    }

    const finalUsd = translator.getCumulativeCost()
    console.log()
    console.log(green('=== Done ==='))
    console.log(`  globals translated:   ${globalsDone}`)
    console.log(`  collections done:     ${collsDone}`)
    console.log(`  docs translated:      ${totalTranslated}`)
    console.log(`  docs skipped:         ${totalSkipped}`)
    console.log(`  docs failed:          ${totalFailed}`)
    console.log(`  spend this run:       $${(finalUsd - startUsd).toFixed(4)}`)
    console.log(`  total lifetime spend: $${finalUsd.toFixed(4)} / $${ceilingUsd.toFixed(2)}`)
    process.exit(0)
  } catch (err) {
    if (err instanceof CostCeilingExceededError) {
      const finalUsd = translator.getCumulativeCost()
      console.log()
      console.log(red('=== STOPPED — cost ceiling reached ==='))
      console.log(`  spend this run:       $${(finalUsd - startUsd).toFixed(4)}`)
      console.log(`  total lifetime spend: $${finalUsd.toFixed(4)} / $${ceilingUsd.toFixed(2)}`)
      console.log(`  Resume with:  node scripts/batch-translate.mjs --resume`)
      process.exit(2)
    }
    console.error(red(`Unrecoverable: ${err instanceof Error ? err.message : err}`))
    if (err instanceof Error && err.stack) console.error(dim(err.stack))
    process.exit(1)
  }
}

main()
