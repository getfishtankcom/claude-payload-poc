/**
 * @description
 * Forgot Password page — initiates password reset via Aptify.
 * AuthLayout wrapper with single username/email field.
 *
 * Key features:
 * - Single field: Username (email)
 * - Server action: POST to Aptify DB API for password reset
 * - Success: "A password reset link has been sent to your email" message
 *
 * @dependencies
 * - AuthLayout: Centered card wrapper
 * - resetPasswordAction: Server action
 *
 * @notes
 * - Generic success message prevents username enumeration
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { ForgotPasswordFormClient } from './ForgotPasswordFormClient'
import { resetPasswordAction } from '@/app/(frontend)/actions/auth'

export const metadata: Metadata = {
  title: 'Forgot Password — FRAS Canada',
  description: 'Reset your FRAS Canada password.',
}

export default function ForgotPasswordPage() {
  return (
    <AuthLayout data-testid="page-forgot-password">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-text-primary">Forgot Your Password?</h1>
        <p className="text-text-secondary">
          Enter your username (email address) and we&apos;ll send you a link to reset your password.
        </p>

        <ForgotPasswordFormClient action={resetPasswordAction} />

        <div className="border-t border-gray-200 pt-6 text-center">
          <Link href="/my-account/login" className="text-sm text-primary hover:text-primary-vivid underline">
            Back to Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  )
}
