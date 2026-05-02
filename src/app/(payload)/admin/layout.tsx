/**
 * @description
 * Layout for `/admin/*` routes. Mounts `<AdminShell>` as the outer chrome.
 * Custom routes (e.g. `/admin/tree`) render inside the shell. Payload's
 * existing `[[...segments]]` catch-all still resolves anything else under
 * `/admin/*` (transitional — Layer 8 retires it).
 *
 * @notes
 * - This layout sits *inside* Payload's `(payload)/layout.tsx → <RootLayout>`,
 *   so Payload's stock pages (rendered by the catch-all) will visually
 *   nest within `<AdminShell>`. The doubled chrome is intentional for the
 *   transitional period and disappears once each surface migrates to a
 *   native edit view.
 * - Slot props left empty here are filled by sibling Layer 0 issues
 *   (#6 left tree, #7 action bar, #8 language switcher, #10 auth bridge).
 */

import * as React from 'react'

import { AdminShell } from '../../../admin/components/shell/AdminShell'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AdminShell>{children}</AdminShell>
)

export default Layout
