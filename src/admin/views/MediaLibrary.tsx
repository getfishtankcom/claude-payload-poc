/**
 * @description
 * Server component wrapper for the Media Library admin view (Epic 24).
 * Registered in payload.config.ts as a custom admin view at /admin/media.
 * Delegates all UI to the client component MediaLibraryClient.
 *
 * @notes
 * - Same pattern as Dashboard.tsx and ContentTree.tsx
 * - Absorbs Payload's non-serializable props
 * - The actual UI lives in MediaLibraryClient.tsx
 */
import React from 'react'
import { MediaLibraryClient } from './MediaLibraryClient'

const MediaLibrary: React.FC = () => {
  return <MediaLibraryClient />
}

export default MediaLibrary
