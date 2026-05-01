/**
 * @description
 * Server component wrapper for the Page Builder admin view (Epic 25).
 * Registered in payload.config.ts as a custom admin view at /admin/builder/:id.
 *
 * @notes
 * - Same pattern as Dashboard.tsx, ContentTree.tsx, MediaLibrary.tsx
 * - Default export — required by Payload's view registration string
 *   `/admin/views/PageBuilder` which resolves to the default export
 * - Auth-gating happens here (RSC) so unauthenticated users can't reach
 *   the editor at all. The client island is mounted only after the
 *   session is verified.
 * - Switched from custom @dnd-kit-based builder to Puck-based builder
 *   (G2 from spike-admin-platform-layer-0.md §13). The dnd-kit-based
 *   builder under src/admin/components/builder/* is now unused; cleanup
 *   is a follow-up commit.
 */
import React from 'react'
import { PageBuilderClient } from './PageBuilderClient'

const PageBuilder: React.FC = () => {
  return <PageBuilderClient />
}

export default PageBuilder
