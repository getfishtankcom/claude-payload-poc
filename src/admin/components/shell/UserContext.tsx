'use client'

/**
 * @description
 * React context exposing the authenticated admin user to descendants
 * of `<AdminShell>`. Populated by the server-side auth gate and
 * consumed via `useAdminUser()`.
 *
 * @notes
 * - Minimal user shape — id + email + collection slug. Routes that
 *   need richer profile data should re-query Payload directly via
 *   TanStack Query rather than threading it through context.
 */

import * as React from 'react'

export type AdminUser = {
  id: number | string
  email: string
  collection: string
}

const Context = React.createContext<AdminUser | null>(null)

export const UserProvider: React.FC<React.PropsWithChildren<{ user: AdminUser }>> = ({
  user,
  children,
}) => <Context.Provider value={user}>{children}</Context.Provider>

/**
 * Returns the current admin user. Throws when called outside of
 * `<UserProvider>` — that's an authoring bug, not a runtime case.
 */
export const useAdminUser = (): AdminUser => {
  const user = React.useContext(Context)
  if (!user) {
    throw new Error('useAdminUser must be called inside <UserProvider>')
  }
  return user
}

/**
 * Returns the current admin user or null. Use when the calling
 * component needs to handle a missing provider gracefully (e.g.
 * during Storybook isolation).
 */
export const useAdminUserOrNull = (): AdminUser | null => React.useContext(Context)
