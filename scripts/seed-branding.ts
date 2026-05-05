/**
 * Seed the Branding global with per-locale logo uploads.
 *
 * For each locale (en, fr):
 * - Looks up the canonical FRAS footer logo (`fras-footer-logo-<locale>.png`)
 *   in the Media collection.
 * - If the file is on disk in `src/seed/media-assets/` but not yet in
 *   Media, uploads it (idempotent — skipped when an upload with the same
 *   filename already exists).
 * - Updates the Branding global for that locale to point at the doc.
 *
 * The FR fallback is the EN doc when no FR upload exists — keeps the
 * site bootable on partial seeds rather than rendering the text wordmark.
 *
 * Run via: npx tsx scripts/seed-branding.ts
 *
 * Idempotent — re-running just re-points to the same media doc IDs.
 */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { getPayload } from 'payload'
import config from '../src/payload.config'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = path.resolve(__dirname, '../src/seed/media-assets')

type LocaleCfg = {
  locale: 'en' | 'fr'
  filename: string
  alt: string
  title: string
}

const LOGOS: LocaleCfg[] = [
  {
    locale: 'en',
    filename: 'fras-footer-logo-en.png',
    alt: 'RAS Canada',
    title: 'RAS Canada Footer Logo (English)',
  },
  {
    locale: 'fr',
    filename: 'fras-footer-logo-fr.png',
    alt: 'NIFC Canada',
    title: 'RAS Canada Footer Logo (French)',
  },
]

async function main() {
  const payload = await getPayload({ config })

  const idsByLocale: Record<'en' | 'fr', number | null> = { en: null, fr: null }

  for (const cfg of LOGOS) {
    // Look up an existing Media doc by filename
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: cfg.filename } },
      limit: 1,
    })

    let id = existing.docs[0]?.id as number | undefined

    if (!id) {
      const filePath = path.join(ASSETS_DIR, cfg.filename)
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⏭  ${cfg.filename} — not in Media and not on disk; falling back to other locale`)
        continue
      }
      const buffer = fs.readFileSync(filePath)
      const created = await payload.create({
        collection: 'media',
        data: { alt: cfg.alt, title: cfg.title },
        file: {
          data: buffer,
          mimetype: 'image/png',
          name: cfg.filename,
          size: buffer.length,
        },
      })
      id = created.id as number
      console.log(`  ⬆️   uploaded ${cfg.filename} (id=${id})`)
    } else {
      console.log(`  ✓ found existing ${cfg.filename} (id=${id})`)
    }

    idsByLocale[cfg.locale] = id
  }

  // FR falls back to EN if no FR doc exists
  const enId = idsByLocale.en
  const frId = idsByLocale.fr ?? enId

  if (!enId) {
    console.error('No EN logo available — aborting Branding global update.')
    process.exit(1)
  }

  await payload.updateGlobal({ slug: 'branding', data: { logo: enId }, locale: 'en' })
  await payload.updateGlobal({ slug: 'branding', data: { logo: frId }, locale: 'fr' })

  console.log(`✅ Branding global: EN=media#${enId}, FR=media#${frId}${frId === enId ? ' (FR falls back to EN)' : ''}`)
  process.exit(0)
}

main().catch((err) => {
  console.error('seed-branding failed:', err)
  process.exit(1)
})
