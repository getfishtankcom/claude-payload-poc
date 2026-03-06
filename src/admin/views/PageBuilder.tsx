/**
 * @description
 * Server component wrapper for the Page Builder admin view (Epic 25).
 * Registered in payload.config.ts as a custom admin view at /admin/builder/:id.
 * Delegates all UI to the client component PageBuilderClient.
 *
 * @notes
 * - Same pattern as Dashboard.tsx, ContentTree.tsx, MediaLibrary.tsx
 * - Absorbs Payload's non-serializable props
 * - The actual UI lives in PageBuilderClient.tsx
 */
import React from 'react'
import { PageBuilderClient } from './PageBuilderClient'

const PageBuilder: React.FC = () => {
  return <PageBuilderClient />
}

export default PageBuilder
