/**
 * @description
 * Mounts in the real Next.js page route when in draft mode. Listens for
 * `postMessage` events from Payload's Live Preview iframe parent (the
 * builder admin view) and calls `router.refresh()` to re-run SSR with the
 * latest draft data. This is the same pattern the Payload website template
 * uses on Pages.
 *
 * Reference: https://payloadcms.com/docs/live-preview/server
 */
'use client'

import { RefreshRouteOnSave } from '@payloadcms/live-preview-react'
import { useRouter } from 'next/navigation'

export const LivePreviewListener = () => {
  const router = useRouter()
  return (
    <RefreshRouteOnSave
      refresh={() => router.refresh()}
      serverURL={process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'}
    />
  )
}
