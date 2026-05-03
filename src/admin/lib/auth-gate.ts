/**
 * @description
 * Server-only auth bridge for the AdminShell. Reads the current request's
 * cookies via Next's `headers()` and asks Payload to resolve the user.
 * Unauthenticated requests redirect to `/admin/login` (Payload's stock
 * login until Layer 7 ships the branded replacement).
 *
 * @notes
 * - Pure server-side. Do not import from client components.
 * - Returning the resolved user lets the layout populate `<UserProvider>`
 *   for client descendants that need user info without a round trip.
 */

import { redirect } from 'next/navigation'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { AdminUser } from '../components/shell/UserContext'

/**
 * Resolves the current admin user without redirecting. Returns null
 * when the request is unauthenticated. Use this at the layout level
 * where some children are public (e.g. /admin/login).
 */
export const getAdminUser = async (): Promise<AdminUser | null> => {
  const payload = await getPayload({ config })
  const headers = await nextHeaders()
  const { user } = await payload.auth({ headers })
  if (!user) return null
  return {
    id: user.id,
    email: user.email ?? '',
    collection: user.collection,
  }
}

/**
 * Hard-gate variant: redirects to /admin/login when the request is
 * unauthenticated. Use this at the page level for routes that must
 * never render to unauthenticated users.
 */
export const requireAdminUser = async (): Promise<AdminUser> => {
  const user = await getAdminUser()
  if (!user) redirect('/admin/login')
  return user
}
