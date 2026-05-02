/**
 * @description
 * `/admin/tree` — first custom route inside the new `<AdminShell>`.
 * Placeholder workspace until #6 lands the persistent left tree spine.
 *
 * @notes
 * - Rendered inside `<AdminShell>` via `(payload)/admin/layout.tsx`.
 * - When #6 ships, this route's role shifts to whatever appears in the
 *   workspace when the user is browsing tree-only context.
 */

import * as React from 'react'

const Page: React.FC = () => (
  <div style={{ padding: 24, color: 'var(--text-primary)' }}>
    <h1 style={{ marginTop: 0, fontSize: 22 }}>Content tree</h1>
    <p style={{ color: 'var(--text-muted)' }}>
      This route renders inside <code>{'<AdminShell>'}</code>. The persistent left tree
      spine and inline tree workspace land in #6.
    </p>
  </div>
)

export default Page
