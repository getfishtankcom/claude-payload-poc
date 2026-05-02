/**
 * @description
 * `/admin/tree` — first custom route inside the new `<AdminShell>`.
 * Server-gates via `requireAdminUser()` (see #10) and exposes the
 * resolved user to client descendants via `<UserProvider>`. Placeholder
 * workspace until #6 lands the persistent left tree spine.
 *
 * @notes
 * - Auth gate is opt-in per route (not layout-wide) so we don't break
 *   the unauthenticated entry to Payload's stock `/admin/login` page,
 *   which still resolves through the catch-all in this transitional
 *   period.
 */

import * as React from 'react'

import { UserProvider } from '../../../../admin/components/shell/UserContext'
import { requireAdminUser } from '../../../../admin/lib/auth-gate'

const Page = async () => {
  const user = await requireAdminUser()

  return (
    <UserProvider user={user}>
      <div style={{ padding: 24, color: 'var(--text-primary)' }}>
        <h1 style={{ marginTop: 0, fontSize: 22 }}>Content tree</h1>
        <p style={{ color: 'var(--text-muted)' }}>
          Signed in as <strong>{user.email}</strong>. The persistent left tree spine and inline
          tree workspace land in #6.
        </p>
      </div>
    </UserProvider>
  )
}

export default Page
