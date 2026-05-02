/**
 * @description
 * Collection hook: auto-populate publishedAt timestamp on create/update.
 * Sets the publishedAt field to the current date if not already set.
 *
 * @notes
 * - From Payload website template pattern
 * - Attach to any collection that has a publishedAt field
 * - Only sets on first publish — does not overwrite existing values
 */
import type { CollectionBeforeChangeHook } from 'payload'

export const populatePublishedAt: CollectionBeforeChangeHook = ({ data, operation, req }) => {
  if (operation === 'create' || operation === 'update') {
    if (req.data && !req.data.publishedAt) {
      return {
        ...data,
        publishedAt: new Date(),
      }
    }
  }

  return data
}
