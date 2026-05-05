/**
 * One-shot script: link the existing fras-banner-en.png Media doc to the
 * Branding global for both EN and FR locales.
 *
 * Run via: npx tsx scripts/seed-branding.ts
 *
 * Idempotent — re-running just re-points to the same media doc. Safe to
 * delete once the main seed (`src/seed/index.ts`) has been run on this DB
 * since that script now configures the global itself.
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../src/payload.config'

async function main() {
  const payload = await getPayload({ config })

  const banner = await payload.find({
    collection: 'media',
    where: { filename: { equals: 'fras-footer-logo-en.png' } },
    limit: 1,
  })

  const id = banner.docs[0]?.id
  if (!id) {
    console.error('No fras-footer-logo-en.png in Media — run `npx tsx src/seed/seed-media.ts` first.')
    process.exit(1)
  }

  await payload.updateGlobal({ slug: 'branding', data: { logo: id }, locale: 'en' })
  await payload.updateGlobal({ slug: 'branding', data: { logo: id }, locale: 'fr' })
  console.log(`✅ Branding global linked to media id=${id} for EN + FR`)
  process.exit(0)
}

main().catch((err) => {
  console.error('seed-branding failed:', err)
  process.exit(1)
})
