/**
 * @description
 * Client-side registration form with validation.
 *
 * Key features:
 * - Email, password, confirm password, first name, last name fields
 * - Client-side validation before server submission
 * - Success state with redirect prompt
 *
 * @dependencies
 * - Input, Button: UI components
 *
 * @notes
 * - Uses useActionState for server action integration
 */
'use client'

import React, { useActionState } from 'react'
import Link from 'next/link'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type AuthFormState = {
  success: boolean
  message: string
}

type RegisterFormClientProps = {
  action: (prevState: AuthFormState, formData: FormData) => Promise<AuthFormState>
}

const initialState: AuthFormState = { success: false, message: '' }

export function RegisterFormClient({ action }: RegisterFormClientProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)

  if (state.success) {
    return (
      <div className="rounded-md bg-green-50 border border-green-200 p-6 text-center" role="status">
        <p className="text-lg font-semibold text-green-800">{state.message}</p>
        <Link href="/my-account/login" className="mt-4 inline-block text-primary underline">
          Go to Login
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate data-testid="register-form">
      <Input id="firstName" name="firstName" label="First Name *" type="text" required />
      <Input id="lastName" name="lastName" label="Last Name *" type="text" required />
      <Input id="email" name="email" label="Email (Username) *" type="email" required />
      <Input id="password" name="password" label="Password *" type="password" required autoComplete="new-password" />
      <Input id="confirmPassword" name="confirmPassword" label="Confirm Password *" type="password" required autoComplete="new-password" />

      {state.message && !state.success && (
        <p className="text-sm text-red-600" role="alert">{state.message}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  )
}
