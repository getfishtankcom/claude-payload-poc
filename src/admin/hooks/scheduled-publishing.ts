/**
 * @description
 * Scheduled publishing system for FRAS Canada CMS.
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
        const docWithHistory = doc as { id: string; workflowHistory?: unknown[] }
        try {
          await payload.update({
            collection,
            id: docWithHistory.id,
            data: {
              workflowState: 'published',
              workflowHistory: [
                ...(docWithHistory.workflowHistory || []),
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
          payload.logger.info(`Auto-published ${collection}/${docWithHistory.id}`)
        } catch (err) {
          payload.logger.error(`Failed to auto-publish ${collection}/${docWithHistory.id}: ${err}`)
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
        const docWithHistory = doc as { id: string; workflowHistory?: unknown[] }
        try {
          await payload.update({
            collection,
            id: docWithHistory.id,
            data: {
              workflowState: 'unpublished',
              workflowHistory: [
                ...(docWithHistory.workflowHistory || []),
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
          payload.logger.info(`Auto-unpublished ${collection}/${docWithHistory.id}`)
        } catch (err) {
          payload.logger.error(`Failed to auto-unpublish ${collection}/${docWithHistory.id}: ${err}`)
        }
      }
    } catch (err) {
      // Collection may not exist yet — skip silently
      payload.logger.warn(`Scheduled publishing skipped ${collection}: ${err}`)
    }
  }
}
