/**
 * @description
 * Forgot Username page — sends username recovery email via Aptify.
 * AuthLayout wrapper with single email field.
 *
 * Key features:
 * - Single field: Email address
 * - Server action: POST to Aptify DB API for username recovery
 * - Success: "An email has been sent with your username" message
 *
 * @dependencies
 * - AuthLayout: Centered card wrapper
 * - recoverUsernameAction: Server action
 *
 * @notes
 * - Generic success message prevents email enumeration
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { ForgotUsernameFormClient } from './ForgotUsernameFormClient'
import { recoverUsernameAction } from '@/actions/auth'

export const metadata: Metadata = {
  title: 'Forgot Username — FRAS Canada',
  description: 'Recover your FRAS Canada username.',
}

export default function ForgotUsernamePage() {
  return (
    <AuthLayout data-testid="page-forgot-username">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-text-primary">Forgot Your User Name?</h1>
        <p className="text-text-secondary">
          Enter the email address associated with your account and we&apos;ll send you your username.
        </p>

        <ForgotUsernameFormClient action={recoverUsernameAction} />

        <div className="border-t border-gray-200 pt-6 text-center">
          <Link href="/my-account/login" className="text-sm text-primary hover:text-primary-vivid underline">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
