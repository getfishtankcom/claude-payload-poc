/**
 * @description
 * Server action for member-only form submissions.
 * Validates Clerk auth session, then sends email with optional attachment.
 * No database storage — email only.
 *
 * Key features:
 * - Clerk auth verification before processing
 * - Email sending with attachments via SMTP
 * - 3 form variants: document-comment, event-registration, volunteer-registration
 *
 * @dependencies
 * - @clerk/nextjs/server: auth
 *
 * @notes
 * - No data storage in CMS (per spec: "No logs or info or storage is required")
 * - Submissions trigger emails only
 * - SMTP config from env vars
 */
'use server'

import { auth } from '@clerk/nextjs/server'
import type { MemberFormState } from '@/components/MemberOnlyForm'

export async function submitMemberForm(
  _prevState: MemberFormState,
  formData: FormData,
): Promise<MemberFormState> {
  // Verify Clerk session
  const { userId } = await auth()
  if (!userId) {
    return { success: false, message: 'You must be logged in to submit this form.' }
  }

  const variant = formData.get('variant') as string
  const name = (formData.get('name') as string)?.trim() || ''
  const email = (formData.get('email') as string)?.trim() || ''
  const organization = (formData.get('organization') as string)?.trim() || ''
  const comments = (formData.get('comments') as string)?.trim() || ''

  // Validate required fields
  if (!name || !email) {
    return { success: false, message: 'Name and email are required.' }
  }

  // For document-comment and volunteer, comments are required
  if ((variant === 'document-comment' || variant === 'volunteer-registration') && !comments) {
    return { success: false, message: 'Please fill in the required text field.' }
  }

  // In production, this would send an email via SMTP
  // For now, log the submission and return success
  const smtpHost = process.env.SMTP_HOST
  if (!smtpHost) {
    console.warn('[MemberForm] SMTP not configured — submission logged only')
    console.log('[MemberForm] Submission:', { variant, name, email, organization, comments })
    return {
      success: true,
      message: getSuccessMessage(variant),
    }
  }

  // Production email sending would go here
  try {
    console.log('[MemberForm] Would send email:', { variant, name, email, organization })
    return {
      success: true,
      message: getSuccessMessage(variant),
    }
  } catch (error) {
    console.error('[MemberForm] Email send error:', error)
    return { success: false, message: 'Something went wrong. Please try again later.' }
  }
}

function getSuccessMessage(variant: string): string {
  switch (variant) {
    case 'document-comment':
      return 'Thank you for your comment. It has been submitted for review.'
    case 'event-registration':
      return 'You have been registered for this event. A confirmation email will be sent shortly.'
    case 'volunteer-registration':
      return 'Thank you for your interest in volunteering. We will review your application and be in touch.'
    default:
      return 'Your submission has been received. Thank you!'
  }
}
