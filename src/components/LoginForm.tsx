/**
 * @description
 * Login form component for the Authentication page (T16).
 * Username + password fields with forgot links and "Log in" button.
 *
 * Key features:
 * - Username input (type="text", label: "User Name (email address):")
 * - Password input (type="password")
 * - "Forgot your User Name?" and "Forgot your Password?" links
 * - "Log in" button (two words, full-width purple)
 * - Generic error message (never field-specific)
 * - No CAPTCHA, no "Remember me"
 *
 * @dependencies
 * - Input: Reusable form input
 * - Button: Reusable button
 *
 * @notes
 * - Form labels are UI chrome (hardcoded)
 * - Error message is always generic per security best practices
 * - Uses useActionState for server action integration
 */
'use client'

import React, { useActionState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export type LoginFormState = {
  success: boolean
  message: string
}

type LoginFormProps = {
  /** Server action for login */
  action: (prevState: LoginFormState, formData: FormData) => Promise<LoginFormState>
  /** URL for forgot username page */
  forgotUsernameUrl?: string
  /** URL for forgot password page */
  forgotPasswordUrl?: string
  'data-testid'?: string
}

const initialState: LoginFormState = {
  success: false,
  message: '',
}

export function LoginForm({
  action,
  forgotUsernameUrl = '/my-account/forgot-username',
  forgotPasswordUrl = '/my-account/forgot-my-password',
  ...props
}: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)

  return (
    <form
      action={formAction}
      data-testid={props['data-testid'] || 'login-form'}
      className="flex flex-col gap-6"
      noValidate
    >
      <Input
        id="username"
        name="username"
        label="User Name (email address):"
        type="text"
        required
        autoComplete="username"
      />

      <Input
        id="password"
        name="password"
        label="Password:"
        type="password"
        required
        autoComplete="current-password"
      />

      <div className="flex flex-col gap-2 text-sm">
        <a
          href={forgotUsernameUrl}
          className="text-primary hover:text-primary-vivid underline"
        >
          Forgot your User Name?
        </a>
        <a
          href={forgotPasswordUrl}
          className="text-primary hover:text-primary-vivid underline"
        >
          Forgot your Password?
        </a>
      </div>

      {state.message && !state.success && (
        <p className="text-sm text-red-600" role="alert">
          {state.message}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending}
        data-testid="login-submit"
      >
        {isPending ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  )
}
