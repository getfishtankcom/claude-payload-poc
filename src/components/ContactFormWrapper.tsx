/**
 * @description
 * Client wrapper that integrates ContactForm with ReCaptcha.
 * Provides the reCAPTCHA token getter to ContactForm and wraps
 * everything in the ReCaptchaProvider.
 *
 * Key features:
 * - Wraps ContactForm with ReCaptchaProvider
 * - Passes getToken to ContactForm for reCAPTCHA integration
 * - Server action passed through as prop
 *
 * @dependencies
 * - ContactForm: Form component
 * - ReCaptchaProvider, useReCaptcha: ReCaptcha v3 integration
 *
 * @notes
 * - This is a client component ('use client')
 * - Separated from ContactForm to keep form testable without ReCaptcha
 */
'use client'

import React from 'react'
import { ContactForm, type ContactFormState } from '@/components/ContactForm'
import { ReCaptchaProvider, useReCaptcha } from '@/components/ReCaptcha'

type ContactFormWrapperProps = {
  action: (prevState: ContactFormState, formData: FormData) => Promise<ContactFormState>
}

function ContactFormInner({ action }: ContactFormWrapperProps) {
  const { getToken } = useReCaptcha()

  return (
    <ContactForm
      action={action}
      getRecaptchaToken={() => getToken('contact_submit')}
      data-testid="contact-form"
    />
  )
}

export function ContactFormWrapper({ action }: ContactFormWrapperProps) {
  return (
    <ReCaptchaProvider>
      <ContactFormInner action={action} />
    </ReCaptchaProvider>
  )
}
