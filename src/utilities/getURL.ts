/**
 * @description
 * URL resolution utilities for server-side and client-side contexts.
 * Returns the application base URL with appropriate fallbacks.
 *
 * @notes
 * - Adapted from Payload website template
 * - Server: uses NEXT_PUBLIC_SERVER_URL env var
 * - Client: reads from window.location for accurate protocol/port
 */
import { canUseDOM } from './canUseDOM'

export const getServerSideURL = (): string => {
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export const getClientSideURL = (): string => {
  if (canUseDOM) {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
