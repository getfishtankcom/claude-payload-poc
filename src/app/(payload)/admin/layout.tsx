/**
 * @description
 * Layout for `/admin/*` routes. Pure passthrough during the transitional
 * period — Payload's stock catch-all (`[[...segments]]`) renders its
 * own chrome via `(payload)/layout.tsx → <RootLayout>`, and v2 custom
 * routes opt into `<AdminShell>` themselves.
 *
 * @notes
 * - Wrapping every /admin/* route with AdminShell here would render
 *   AdminShell's chrome alongside Payload's stock CustomNav + dashboard,
 *   which produces a three-column nav collision and leaks tree contents
 *   to unauthenticated users on /admin/login.
 * - Layer 8's cutover retires Payload's catch-all, at which point
 *   AdminShell is promoted back to the layout level as the universal
 *   chrome. Until then, this layout stays a passthrough.
 */

import * as React from 'react'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>

export default Layout
