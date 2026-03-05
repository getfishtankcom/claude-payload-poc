/**
 * @description
 * Client-side forgot username form.
 *
 * @dependencies
 * - Input, Button: UI components
 */
'use client'

import React, { useActionState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

type AuthFormState = {
  success: boolean
  message: string
}

type Props = {
  action: (prevState: AuthFormState, formData: FormData) => Promise<AuthFormState>
}

const initialState: AuthFormState = { success: false, message: '' }

export function ForgotUsernameFormClient({ action }: Props) {
  const [state, formAction, isPending] = useActionState(action, initialState)

  if (state.success) {
    return (
      <div className="rounded-md bg-green-50 border border-green-200 p-6 text-center" role="status">
        <p className="text-base text-green-800">{state.message}</p>
      </div>
    )
  }

  return (
    <form action={formAction} className="flex flex-col gap-6" noValidate data-testid="forgot-username-form">
      <Input id="email" name="email" label="Email Address *" type="email" required />

      {state.message && !state.success && (
        <p className="text-sm text-red-600" role="alert">{state.message}</p>
      )}

      <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isPending}>
        {isPending ? 'Sending...' : 'Send My Username'}
      </Button>
    </form>
  )
}
