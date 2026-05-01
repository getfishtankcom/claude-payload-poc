/**
 * @description
 * Scheduled publishing system for RAS Canada CMS.
 * Runs on a 5-minute interval to auto-publish/unpublish content.
 *
 * Key features:
 * - Queries items where workflowState=approved AND publishOn <= now
 * - Transitions matching items to 'published', logs in workflowHistory
 * - Queries items where workflowState=published AND unpublishOn <= now
 * - Transitions to 'unpublished'
 *
 * @dependencies
 * - Payload local API for querying and updating documents
 *
 * @notes
 * - Registered via payload.config.ts onInit hook
 * - Uses setInterval (5 min) — not a Payload job (simpler for PoC)
 * - Context flag skipWorkflowValidation bypasses role checks for system transitions
 * - Only runs on pages collection for now — can be extended to other collections
 */
import type { Payload } from 'payload'

const INTERVAL_MS = 5 * 60 * 1000 // 5 minutes
const WORKFLOW_COLLECTIONS = [
  'pages',
  'news',
  'projects',
  'events',
  'consultations',
  'documents',
  'resources',
  'board-members',
  'committees',
  'documents-for-comment',
  'document-details',
  'job-postings',
] as const

/**
 * Initialize scheduled publishing by setting up a recurring check.
 * Call this from payload.config.ts onInit.
 */
export function initScheduledPublishing(payload: Payload): void {
  // Run immediately on startup, then every 5 minutes
  runScheduledPublishing(payload)
  setInterval(() => runScheduledPublishing(payload), INTERVAL_MS)
  payload.logger.info('Scheduled publishing initialized (5-minute interval)')
}

async function runScheduledPublishing(payload: Payload): Promise<void> {
  const now = new Date().toISOString()

  for (const collection of WORKFLOW_COLLECTIONS) {
    try {
      // Auto-publish: approved items past their publishOn date
      const toPublish = await payload.find({
        collection,
        where: {
          and: [
            { workflowState: { equals: 'approved' } },
            { publishOn: { less_than_equal: now } },
          ],
        },
        limit: 100,
      })

      for (const doc of toPublish.docs) {
        const docId = (doc as unknown as { id: number }).id
        const existingHistory = (doc as unknown as { workflowHistory?: Record<string, unknown>[] }).workflowHistory || []
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (payload.update as any)({
            collection,
            id: docId,
            data: {
              workflowState: 'published',
              workflowHistory: [
                ...existingHistory,
                {
                  from: 'approved',
                  to: 'published',
                  user: null,
                  date: now,
                  comment: 'Auto-published by scheduled publishing system',
                },
              ],
            },
            context: {
              skipWorkflowValidation: true,
              skipWorkflowLogging: true,
            },
          })
          payload.logger.info(`Auto-published ${collection}/${docId}`)
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          payload.logger.error(`Failed to auto-publish ${collection}/${docId}: ${msg}`)
        }
      }

      // Auto-unpublish: published items past their unpublishOn date
      const toUnpublish = await payload.find({
        collection,
        where: {
          and: [
            { workflowState: { equals: 'published' } },
            { unpublishOn: { less_than_equal: now } },
          ],
        },
        limit: 100,
      })

      for (const doc of toUnpublish.docs) {
        const docId = (doc as unknown as { id: number }).id
        const existingHistory = (doc as unknown as { workflowHistory?: Record<string, unknown>[] }).workflowHistory || []
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (payload.update as any)({
            collection,
            id: docId,
            data: {
              workflowState: 'unpublished',
              workflowHistory: [
                ...existingHistory,
                {
                  from: 'published',
                  to: 'unpublished',
                  user: null,
                  date: now,
                  comment: 'Auto-unpublished by scheduled publishing system',
                },
              ],
            },
            context: {
              skipWorkflowValidation: true,
              skipWorkflowLogging: true,
            },
          })
          payload.logger.info(`Auto-unpublished ${collection}/${docId}`)
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err)
          payload.logger.error(`Failed to auto-unpublish ${collection}/${docId}: ${msg}`)
        }
      }
    } catch (err) {
      // Collection may not exist yet — skip silently
      const msg = err instanceof Error ? err.message : String(err)
      payload.logger.warn(`Scheduled publishing skipped ${collection}: ${msg}`)
    }
  }
}
