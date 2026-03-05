/**
 * @description
 * Access control: allow authenticated users OR return only published content.
 * Authenticated users see all drafts; anonymous users only see _status: 'published'.
 *
 * @notes
 * - From Payload website template pattern
 * - Use for: read access on collections with draft/publish workflow
 * - Requires collection to have `versions.drafts: true` enabled
 */
import type { Access } from 'payload'

export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
