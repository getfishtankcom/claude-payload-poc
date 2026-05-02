/**
 * @description
 * Server component wrapper for the Content Tree admin view (Epic 23).
 * Registered in payload.config.ts as a custom admin view at /admin/tree.
 * Delegates all UI to the client component ContentTreeClient.
 *
 * @notes
 * - Same pattern as Dashboard.tsx — absorbs Payload's non-serializable props
 * - The actual tree UI lives in ContentTreeClient.tsx
 */
import React from 'react'
import { ContentTreeClient } from './ContentTreeClient'

const ContentTree: React.FC = () => {
  return <ContentTreeClient />
}

export default ContentTree
