/**
 * @description
 * Shared member-only form component for 3 form variants:
 * - Document Comment Submission
 * - Event Registration
 * - Volunteer Registration
 *
 * Key features:
 * - Common fields: Name, Email, Organization
 * - Variant-specific fields (textarea, file upload, event selection)
 * - Auth gate: requires authenticated Aptify session
 * - Server action: validates session, sends email with attachments
 *
 * @dependencies
 * - Input, Button: UI components
 *
 * @notes
 * - All 3 forms share identical UI pattern (form → email with attachment)
 * - No database storage — submissions trigger emails only
 * - File upload for Document Comment (PDF/Word) and Volunteer (CV)
 */
'use client'

import React, { useActionState } from 'react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export type MemberFormVariant = 'document-comment' | 'event-registration' | 'volunteer-registration'

export type MemberFormState = {
  success: boolean
  message: string
}

type MemberOnlyFormProps = {
  variant: MemberFormVariant
  action: (prevState: MemberFormState, formData: FormData) => Promise<MemberFormState>
  /** Pre-filled email from session */
  userEmail?: string
  /** Pre-filled name from session */
  userName?: string
  'data-testid'?: string
}

const variantConfig: Record<MemberFormVariant, {
  heading: string
  submitLabel: string
  showFileUpload: boolean
  fileLabel: string
  showComments: boolean
  commentsLabel: string
  showEventSelect: boolean
}> = {
  'document-comment': {
    heading: 'Submit a Comment',
    submitLabel: 'Submit Comment',
    showFileUpload: true,
    fileLabel: 'Attachment (PDF or Word)',
    showComments: true,
    commentsLabel: 'Your Comment *',
    showEventSelect: false,
  },
  'event-registration': {
    heading: 'Register for Event',
    submitLabel: 'Register',
    showFileUpload: false,
    fileLabel: '',
    showComments: true,
    commentsLabel: 'Additional Comments',
    showEventSelect: true,
  },
  'volunteer-registration': {
    heading: 'Volunteer Registration of Interest',
    submitLabel: 'Submit Application',
    showFileUpload: true,
    fileLabel: 'CV / Resume (PDF or Word)',
    showComments: true,
    commentsLabel: 'Why are you interested? *',
    showEventSelect: false,
  },
}

const initialState: MemberFormState = { success: false, message: '' }

export function MemberOnlyForm({
  variant,
  action,
  userEmail = '',
  userName = '',
  ...props
}: MemberOnlyFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState)
  const config = variantConfig[variant]

  if (state.success) {
    return (
      <div
        data-testid={props['data-testid'] ? `${props['data-testid']}-success` : 'member-form-success'}
        className="rounded-md bg-green-50 border border-green-200 p-6 text-center"
        role="status"
      >
        <p className="text-lg font-semibold text-green-800">{state.message}</p>
      </div>
    )
  }

  return (
    <form
      action={formAction}
      data-testid={props['data-testid'] || `member-form-${variant}`}
      className="flex flex-col gap-6"
      noValidate
      encType="multipart/form-data"
    >
      <input type="hidden" name="variant" value={variant} />

      <Input
        id="name"
        name="name"
        label="Full Name *"
        type="text"
        required
        defaultValue={userName}
      />

      <Input
        id="email"
        name="email"
        label="Email Address *"
        type="email"
        required
        defaultValue={userEmail}
      />

      <Input
        id="organization"
        name="organization"
        label="Organization"
        type="text"
      />

      {config.showComments && (
        <Input
          id="comments"
          name="comments"
          label={config.commentsLabel}
          type="textarea"
          rows={6}
          required={variant !== 'event-registration'}
        />
      )}

      {config.showFileUpload && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="attachment" className="text-sm font-semibold text-text-secondary">
            {config.fileLabel}
          </label>
          <input
            id="attachment"
            name="attachment"
            type="file"
            accept=".pdf,.doc,.docx"
            className="text-sm text-text-secondary file:mr-4 file:rounded file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:text-white hover:file:bg-primary-vivid"
          />
        </div>
      )}

      {state.message && !state.success && (
        <p className="text-sm text-red-600" role="alert">{state.message}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? 'Submitting...' : config.submitLabel}
      </Button>
    </form>
  )
}
