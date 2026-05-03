/**
 * @description
 * Server action for contact form submission.
 * Validates input, verifies reCAPTCHA, checks honeypot,
 * and stores submission in Payload CMS form-submissions collection.
 *
 * Key features:
 * - Server-side validation of required fields and email format
 * - reCAPTCHA v3 token verification
 * - Honeypot bot detection
 * - Stores submission in form-submissions collection
 *
 * @dependencies
 * - Payload CMS local API
 * - src/lib/recaptcha.ts: Server-side reCAPTCHA verification
 *
 * @notes
 * - This is a server action (runs on the server only)
 * - Returns ContactFormState for client-side state management
 */
'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
import { verifyRecaptcha } from '@/lib/recaptcha'
import type { ContactFormState } from '@/components/ContactForm'

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Honeypot check — if filled, it's a bot
  const honeypot = formData.get('website') as string
  if (honeypot) {
    // Silently accept to not tip off bots
    return { success: true, message: 'Thank you for contacting us. We will respond shortly.' }
  }

  // Extract fields
  const fullName = (formData.get('fullName') as string)?.trim() || ''
  const title = (formData.get('title') as string)?.trim() || ''
  const organization = (formData.get('organization') as string)?.trim() || ''
  const email = (formData.get('email') as string)?.trim() || ''
  const businessPhone = (formData.get('businessPhone') as string)?.trim() || ''
  const comments = (formData.get('comments') as string)?.trim() || ''
  const recaptchaToken = (formData.get('recaptchaToken') as string) || ''

  // Server-side validation
  const errors: Record<string, string> = {}

  if (!fullName) errors.fullName = 'Full Name is required.'
  if (!email) {
    errors.email = 'Email Address is required.'
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) errors.email = 'Please enter a valid email address.'
  }
  if (!comments) errors.comments = 'Comments are required.'

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: 'Please fix the errors below.',
      errors,
    }
  }

  // Verify reCAPTCHA token
  const recaptchaResult = await verifyRecaptcha(recaptchaToken, 'contact_submit')
  if (!recaptchaResult.success) {
    return {
      success: false,
      message: 'reCAPTCHA verification failed. Please try again.',
    }
  }

  // Store submission in Payload CMS — public form, so we explicitly bypass collection access control
  try {
    const payload = await getPayload({ config })
    await payload.create({
      collection: 'form-submissions',
      data: {
        fullName,
        title,
        organization,
        email,
        businessPhone,
        comments,
        status: 'new',
        submittedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    return {
      success: true,
      message: 'Thank you for contacting us. We will respond shortly.',
    }
  } catch (error) {
    console.error('[Contact Form] Submission error:', error)
    return {
      success: false,
      message: 'Something went wrong. Please try again later.',
    }
  }
}
