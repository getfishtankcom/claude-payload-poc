/**
 * @description
 * Stories for MemberOnlyForm — all 3 form variants.
 *
 * @dependencies
 * - MemberOnlyForm: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { MemberOnlyForm, type MemberFormState } from './MemberOnlyForm'

const noopAction = async (): Promise<MemberFormState> => ({
  success: false,
  message: '',
})

const successAction = async (): Promise<MemberFormState> => ({
  success: true,
  message: 'Your submission has been received. Thank you!',
})

const meta = {
  title: 'Forms/MemberOnlyForm',
  component: MemberOnlyForm,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  decorators: [
    (Story) => (
      <div className="max-w-2xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof MemberOnlyForm>

export default meta
type Story = StoryObj<typeof meta>

/** Document Comment Submission */
export const DocumentComment: Story = {
  args: {
    variant: 'document-comment',
    action: noopAction,
  },
}

/** Event Registration */
export const EventRegistration: Story = {
  args: {
    variant: 'event-registration',
    action: noopAction,
  },
}

/** Volunteer Registration */
export const VolunteerRegistration: Story = {
  args: {
    variant: 'volunteer-registration',
    action: noopAction,
  },
}

/** Success state */
export const Success: Story = {
  args: {
    variant: 'document-comment',
    action: successAction,
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    variant: 'document-comment',
    action: noopAction,
  },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}
