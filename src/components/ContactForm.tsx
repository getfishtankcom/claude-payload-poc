/**
 * @description
 * Contact form with vertical stacked layout, client-side validation,
 * and server action submission. Used on the Contact Us page (T15).
 *
 * Key features:
 * - 6 fields: Full Name*, Title, Organization, Email*, Business Phone, Comments*
 * - Client-side validation with inline error messages below each invalid field
 * - Tab order follows field order → CAPTCHA → Submit
 * - Handles submission via server action passed as prop
 * - Success/error state display after submission
 *
 * @dependencies
 * - Input: Reusable form input component
 * - Button: Reusable button component
 *
 * @notes
 * - Form field labels are UI chrome (hardcoded)
 * - Required fields marked with asterisk (*)
 * - Uses useActionState for server action integration
 * - Honeypot field included as bot prevention fallback
 */
'use client'

import React, { useActionState, useRef, useEffect } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export type ContactFormState = {
  success: boolean
  message: string
  errors?: Record<string, string>
}

type ContactFormProps = {
  /** Server action to handle form submission */
  action: (prevState: ContactFormState, formData: FormData) => Promise<ContactFormState>
  /** ReCaptcha token getter (from ReCaptcha component) */
  getRecaptchaToken?: () => Promise<string>
  /** Test ID for automated testing */
  'data-testid'?: string
}

const initialState: ContactFormState = {
  success: false,
  message: '',
}

function validateField(name: string, value: string): string {
  switch (name) {
    case 'fullName':
      return value.trim() ? '' : 'Full Name is required.'
    case 'email': {
      if (!value.trim()) return 'Email Address is required.'
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return emailRegex.test(value) ? '' : 'Please enter a valid email address.'
    }
    case 'comments':
      return value.trim() ? '' : 'Comments are required.'
    default:
      return ''
  }
}

export function ContactForm({ action, getRecaptchaToken, ...props }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)
  const [clientErrors, setClientErrors] = React.useState<Record<string, string>>({})
  const formRef = useRef<HTMLFormElement>(null)

  // Scroll to first error on server-side validation failure
  useEffect(() => {
    if (state.errors) {
      const firstErrorField = Object.keys(state.errors)[0]
      if (firstErrorField) {
        const el = document.getElementById(firstErrorField)
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        el?.focus()
      }
    }
  }, [state.errors])

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    const error = validateField(name, value)
    setClientErrors((prev) => ({ ...prev, [name]: error }))
  }

  async function handleSubmit(formData: FormData) {
    // Client-side validation
    const fields = ['fullName', 'email', 'comments'] as const
    const errors: Record<string, string> = {}
    let hasErrors = false

    for (const field of fields) {
      const value = formData.get(field) as string || ''
      const error = validateField(field, value)
      if (error) {
        errors[field] = error
        hasErrors = true
      }
    }

    if (hasErrors) {
      setClientErrors(errors)
      const firstErrorField = Object.keys(errors)[0]
      const el = document.getElementById(firstErrorField)
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      el?.focus()
      return
    }

    // Clear client errors
    setClientErrors({})

    // Get reCAPTCHA token if available
    if (getRecaptchaToken) {
      try {
        const token = await getRecaptchaToken()
        formData.set('recaptchaToken', token)
      } catch {
        // Fallback: honeypot field handles bot prevention
      }
    }

    // Submit via server action
    formAction(formData)
  }

  // Merge client and server errors (client takes priority while interacting)
  const errors = { ...state.errors, ...clientErrors }

  if (state.success) {
    return (
      <div
        data-testid={props['data-testid'] ? `${props['data-testid']}-success` : 'contact-form-success'}
        className="rounded-md bg-green-50 border border-green-200 p-6 text-center"
        role="status"
      >
        <p className="text-lg font-semibold text-green-800">{state.message}</p>
      </div>
    )
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      data-testid={props['data-testid'] || 'contact-form'}
      className="flex flex-col gap-6"
      noValidate
    >
      {/* Error announcement for screen readers */}
      {Object.keys(errors).length > 0 && (
        <div role="alert" className="sr-only">
          Please correct {Object.keys(errors).length} error{Object.keys(errors).length > 1 ? 's' : ''} in the form.
        </div>
      )}

      <Input
        id="fullName"
        name="fullName"
        label="Full Name *"
        type="text"
        required
        error={errors?.fullName}
        onBlur={handleBlur}
      />

      <Input
        id="title"
        name="title"
        label="Title"
        type="text"
        onBlur={handleBlur}
      />

      <Input
        id="organization"
        name="organization"
        label="Organization"
        type="text"
        onBlur={handleBlur}
      />

      <Input
        id="email"
        name="email"
        label="Email Address *"
        type="email"
        required
        error={errors?.email}
        onBlur={handleBlur}
      />

      <Input
        id="businessPhone"
        name="businessPhone"
        label="Business Phone"
        type="tel"
        onBlur={handleBlur}
      />

      <Input
        id="comments"
        name="comments"
        label="Comments *"
        type="textarea"
        required
        rows={6}
        error={errors?.comments}
        onBlur={handleBlur}
      />

      {/* Honeypot field — hidden from users, catches bots */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
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
        className="w-full uppercase"
        disabled={isPending}
        data-testid="contact-form-submit"
      >
        {isPending ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  )
}
