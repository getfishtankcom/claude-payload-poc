/**
 * @description
 * Quick one-off script to assign page builder templates to key seeded pages.
 * Needed for testing Epic 25-26 Page Builder view.
 *
 * @notes
 * - Run via: npx tsx src/seed/assign-templates.ts
 */
import 'dotenv/config'
import { getPayload } from 'payload'
import config from '../payload.config'

async function main() {
  const payload = await getPayload({ config })

  const updates = [
    { id: 139, template: 'content-page' },
    { id: 3, template: 'homepage' },
    { id: 42, template: 'content-page' },
    { id: 6, template: 'board-detail' },
    { id: 49, template: 'content-page' },
    { id: 53, template: 'content-page' },
    { id: 80, template: 'active-projects' },
    { id: 90, template: 'flexible-page' },
  ]

  for (const u of updates) {
    try {
      const doc = await payload.update({
        collection: 'pages',
        id: u.id,
        data: { template: u.template as 'homepage' | 'board-detail' | 'project-detail' | 'active-projects' | 'open-consultations' | 'search-results' | 'content-page' | 'flexible-page' },
        context: { skipWorkflowValidation: true, skipWorkflowLogging: true },
      })
      console.log(`  OK: ${(doc as { title?: string }).title} → ${u.template}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  FAIL: id=${u.id} — ${msg}`)
    }
  }

  process.exit(0)
}

main()
