#!/usr/bin/env node
/**
 * Restore the canonical English board abbreviations on the `boards` base
 * table.
 *
 * Background: `boards.abbreviation` is NOT localized — it lives as a
 * single column on the base `boards` table. The 2026-05-01 translation
 * batch translated it to French (CNC, CCSP, CNAC, CCNID, CSNIC),
 * overwriting the EN values that every public render relies on. This
 * script rewrites them back to AcSB / PSAB / AASB / CSSB / RASOC by
 * looking up each row's English slug.
 *
 * Idempotent: safe to run any time. The future-proof fix is in
 * `src/lib/translation/field-picker.ts` where `abbreviation` is now in
 * `SYSTEM_FIELDS`, so the next translation batch leaves it alone.
 *
 * Usage:
 *   node scripts/restore-board-abbreviations.mjs
 */

import { getPayload } from 'payload'
import config from '../src/payload.config.ts'

const CANONICAL = {
  acsb: 'AcSB',
  psab: 'PSAB',
  aasb: 'AASB',
  cssb: 'CSSB',
  rasoc: 'RASOC',
}

async function main() {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'boards',
    locale: 'en',
    limit: 100,
    depth: 0,
    overrideAccess: true,
  })

  let updated = 0
  for (const board of result.docs) {
    const slug = board.slug
    const expected = CANONICAL[slug]
    if (!expected) {
      console.warn(`  ⚠ ${slug}: no canonical abbreviation mapping (skipping)`)
      continue
    }
    if (board.abbreviation === expected) {
      console.log(`  ✓ ${slug}: already ${expected}`)
      continue
    }
    await payload.update({
      collection: 'boards',
      id: board.id,
      data: { abbreviation: expected },
      overrideAccess: true,
    })
    console.log(`  ✓ ${slug}: ${board.abbreviation} → ${expected}`)
    updated += 1
  }
  console.log(`\nDone. ${updated} board(s) updated.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
