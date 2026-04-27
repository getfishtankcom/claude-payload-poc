/**
 * @description
 * Server component wrapper for the Workbox admin view (Epic 27).
 * Registered in payload.config.ts as a custom admin view at /admin/workbox.
 * Delegates all UI to WorkboxClient.
 *
 * @notes
 * - Same pattern as Dashboard.tsx, PageBuilder.tsx, ContentTree.tsx
 * - Absorbs Payload's non-serializable props
 */
import React from 'react'
import { WorkboxClient } from './WorkboxClient'

const Workbox: React.FC = () => {
  return <WorkboxClient />
}

export default Workbox
