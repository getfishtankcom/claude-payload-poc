/**
 * @description
 * Template 16: Authentication Page — Login.
 * Centered AuthLayout with LoginForm, registration CTA,
 * CPA explanation, and support contact block.
 *
 * Key features:
 * - LoginForm with Aptify DB API via server action
 * - "Not registered yet?" + "Create My account" link
 * - CpaExplanationBlock with CPA Canada login link
 * - SupportContactBlock with email and phone numbers
 * - All labels/URLs from auth-config global
 * - HTTP-only JWT cookie session after successful login
 * - Rate limiting: 5 attempts per 15 minutes
 *
 * @dependencies
 * - AuthLayout: Centered 480px card wrapper
 * - LoginForm: Username + password form
 * - CpaExplanationBlock: Shared auth explanation
 * - SupportContactBlock: Support contact info
 * - loginAction: Server action for Aptify authentication
 * - getAuthConfig: CMS global fetch
 *
 * @notes
 * - Full-width AuthLayout, no sidebar
 * - "Create My account" — capital M, lowercase a (per spec)
 * - Server action handles CSRF automatically
 */
import type { Metadata } from 'next'
import Link from 'next/link'

import { AuthLayout } from '@/components/AuthLayout'
import { LoginForm } from '@/components/LoginForm'
import { CpaExplanationBlock } from '@/components/CpaExplanationBlock'
import { SupportContactBlock } from '@/components/SupportContactBlock'
import { loginAction } from '@/app/(frontend)/actions/auth'
import { getAuthConfig } from '@/lib/payload-helpers'
import { RichText } from '@/components/RichText'

export const metadata: Metadata = {
  title: 'My Account — Login — FRAS Canada',
  description: 'Log in to your FRAS Canada account to access member-only features.',
}

export default async function LoginPage() {
  const authConfig = await getAuthConfig()

  return (
    <AuthLayout data-testid="page-login">
      <div className="flex flex-col gap-8">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-text-primary">My Account</h1>

        {/* Login Form */}
        <LoginForm
          action={loginAction}
          forgotUsernameUrl={authConfig?.forgotUsernameUrl || '/my-account/forgot-username'}
          forgotPasswordUrl={authConfig?.forgotPasswordUrl || '/my-account/forgot-my-password'}
        />

        {/* Registration CTA */}
        <div className="border-t border-gray-200 pt-6">
          <p className="text-base text-text-secondary">
            Not registered yet?{' '}
            <Link
              href={authConfig?.registerUrl || '/my-account/register'}
              className="font-semibold text-primary hover:text-primary-vivid underline"
            >
              Create My account
            </Link>
          </p>
        </div>

        {/* CPA Canada Explanation */}
        <div className="border-t border-gray-200 pt-6">
          <CpaExplanationBlock
            content={
              authConfig?.cpaExplanation ? (
                <RichText content={authConfig.cpaExplanation} />
              ) : (
                <p>
                  FRAS Canada uses the CPA Canada authentication system.
                  If you already have a CPA Canada account, you can use those
                  same credentials to log in here.
                </p>
              )
            }
            cpaLoginUrl={authConfig?.cpaLoginUrl || undefined}
          />
        </div>

        {/* Support Contact */}
        <div className="border-t border-gray-200 pt-6">
          <SupportContactBlock
            heading={authConfig?.supportHeading || 'Need Help?'}
            email={authConfig?.supportEmail || 'customerservice@cpacanada.ca'}
            phoneTollFree={authConfig?.supportPhoneTollFree || '1 (800) 268-3793'}
            phoneIntl={authConfig?.supportPhoneIntl || '+1 (416) 977-0748'}
          />
        </div>
      </div>
    </AuthLayout>
  )
}
