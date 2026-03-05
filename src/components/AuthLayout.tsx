/**
 * @description
 * Centered card layout wrapper for authentication pages.
 * Used by login, register, forgot-password, and forgot-username pages.
 *
 * Key features:
 * - Centered container with ~480px max-width
 * - White card background with padding
 * - Responsive — stretches full width on mobile with padding
 *
 * @dependencies
 * - Container: Max-width wrapper
 *
 * @notes
 * - max-width is 480px per spec
 * - No sidebar, no navigation beyond what's in the header/footer
 */
import React from 'react'

type AuthLayoutProps = {
  children: React.ReactNode
  'data-testid'?: string
}

export function AuthLayout({ children, ...props }: AuthLayoutProps) {
  return (
    <div
      data-testid={props['data-testid'] || 'auth-layout'}
      className="flex min-h-[60vh] items-start justify-center px-6 py-12 md:py-16"
    >
      <div className="w-full max-w-[480px]">
        {children}
      </div>
    </div>
  )
}
