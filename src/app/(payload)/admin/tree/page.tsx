/**
 * @description
 * `/admin/tree` — first custom route inside the new `<AdminShell>`.
 * Hard-gates via `requireAdminUser()` (redirects unauthenticated to
 * /admin/login) and explicitly wraps the workspace with AdminShell +
 * UserProvider + the persistent left tree spine.
 *
 * @notes
 * - AdminShell is mounted at the page level (not the layout level)
 *   during the v1↔v2 transitional period so Payload's stock chrome
 *   isn't double-rendered alongside ours. Layer 8 promotes AdminShell
 *   back to the layout once Payload's catch-all is retired.
 */

import * as React from 'react'

import { AdminShell } from '../../../../admin/components/shell/AdminShell'
import { UserProvider } from '../../../../admin/components/shell/UserContext'
import { TreeSpineDefault } from '../../../../admin/components/tree/TreeSpineDefault'
import { requireAdminUser } from '../../../../admin/lib/auth-gate'

const Page = async () => {
  const user = await requireAdminUser()

  return (
    <UserProvider user={user}>
      <AdminShell leftRail={<TreeSpineDefault />}>
        <div style={{ padding: 24, color: 'var(--text-primary)' }}>
          <h1 style={{ marginTop: 0, fontSize: 22 }}>Content tree</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Signed in as <strong>{user.email}</strong>. The persistent left tree spine
            is active in the rail. Native tree workspace lands in a follow-on.
          </p>
        </div>
      </AdminShell>
    </UserProvider>
  )
}

export default Page
