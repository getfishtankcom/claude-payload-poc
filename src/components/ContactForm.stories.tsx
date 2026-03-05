/**
 * @description
 * Stories for ContactForm component — default, validation error, and success states.
 *
 * @dependencies
 * - ContactForm: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ContactForm, type ContactFormState } from './ContactForm'

const noopAction = async (): Promise<ContactFormState> => ({
  success: false,
  message: '',
})

const successAction = async (): Promise<ContactFormState> => ({
  success: true,
  message: 'Thank you for contacting us. We will respond shortly.',
})

const errorAction = async (): Promise<ContactFormState> => ({
  success: false,
  message: 'Something went wrong. Please try again.',
  errors: {
    fullName: 'Full Name is required.',
    email: 'Please enter a valid email address.',
    comments: 'Comments are required.',
  },
})

const meta = {
  title: 'Forms/ContactForm',
  component: ContactForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof ContactForm>

export default meta
type Story = StoryObj<typeof meta>

/** Default empty form */
export const Default: Story = {
  args: {
    action: noopAction,
  },
}

/** Form after successful submission */
export const Success: Story = {
  args: {
    action: successAction,
  },
}

/** Form with server-side validation errors */
export const WithErrors: Story = {
  args: {
    action: errorAction,
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    action: noopAction,
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
