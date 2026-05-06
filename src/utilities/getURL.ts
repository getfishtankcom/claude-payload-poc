/**
 * URL resolution utilities for server-side and client-side contexts.
 *
 * @notes
 * - Server: uses NEXT_PUBLIC_SERVER_URL env var
 * - Client: reads from window.location for accurate protocol/port
 */
const isBrowser =
  typeof window !== 'undefined' && !!window.document?.createElement

export const getServerSideURL = (): string => {
  return process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
}

export const getClientSideURL = (): string => {
  if (isBrowser) {
    const { protocol, hostname, port } = window.location
    return `${protocol}//${hostname}${port ? `:${port}` : ''}`
  }

  return process.env.NEXT_PUBLIC_SERVER_URL || ''
}
