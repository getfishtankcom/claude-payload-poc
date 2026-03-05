/**
 * @description
 * Registration form page — create a new Aptify account.
 * AuthLayout wrapper with email, password, name fields.
 *
 * Key features:
 * - Email (username), password, confirm password, first name, last name
 * - Client-side validation: email format, password match, required fields
 * - Server action: POST to Aptify DB API for account creation
 * - Success: redirect to login with confirmation message
 *
 * @dependencies
 * - AuthLayout: Centered card wrapper
 * - Input: Form input component
 * - Button: CTA button
 * - registerAction: Server action for Aptify registration
 * - getAuthConfig: CMS global fetch
 *
 * @notes
 * - Form field labels are UI chrome (hardcoded)
 * - Registration CTA from auth-config global
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { RegisterFormClient } from './RegisterFormClient'
import { registerAction } from '@/app/(frontend)/actions/auth'
import { getAuthConfig } from '@/lib/payload-helpers'

export const metadata: Metadata = {
  title: 'Create Account — FRAS Canada',
  description: 'Create a new FRAS Canada account.',
}

export default async function RegisterPage() {
  const authConfig = await getAuthConfig()

  return (
    <AuthLayout data-testid="page-register">
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-bold text-text-primary">Create My Account</h1>

        <RegisterFormClient action={registerAction} />

        <div className="border-t border-gray-200 pt-6 text-center">
          <p className="text-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              href={authConfig?.forgotUsernameUrl ? '/my-account/login' : '/my-account/login'}
              className="font-semibold text-primary hover:text-primary-vivid underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </AuthLayout>
  )
}
