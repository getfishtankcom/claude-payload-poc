/**
 * @description
 * Login page using Clerk's SignIn component.
 * Replaces the custom Aptify login form.
 *
 * @dependencies
 * - @clerk/nextjs: SignIn
 *
 * @notes
 * - Clerk handles all auth flows (email/password, social, MFA)
 * - No custom form needed — Clerk provides the UI
 * - Protected by middleware — redirects here when unauthenticated
 */
import { SignIn } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Account — Login — FRAS Canada',
  description: 'Log in to your FRAS Canada account to access member-only features.',
}

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <SignIn />
    </div>
  )
}
