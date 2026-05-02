/**
 * @description
 * Stories for the Input component — text, email, textarea, error states.
 * Demonstrates the label + input + error message accessibility pattern.
 *
 * @dependencies
 * - Input: Component under test
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { Input } from './Input'

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'tel', 'search', 'url', 'password', 'textarea'],
    },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

/** Standard text input with label */
export const Text: Story = {
  args: {
    id: 'name',
    label: 'Full Name',
    type: 'text',
    placeholder: 'Enter your full name',
  },
}

/** Email input with appropriate type */
export const Email: Story = {
  args: {
    id: 'email',
    label: 'Email Address',
    type: 'email',
    placeholder: 'you@example.com',
  },
}

/** Textarea for multi-line input (renders as <textarea>) */
export const Textarea: Story = {
  args: {
    id: 'comment',
    label: 'Your Comment',
    type: 'textarea',
    placeholder: 'Write your comment here...',
  },
}

/** Error state — red border + error message below */
export const WithError: Story = {
  args: {
    id: 'email-error',
    label: 'Email Address',
    type: 'email',
    error: 'Please enter a valid email address.',
    placeholder: 'you@example.com',
  },
}

/** Disabled state */
export const Disabled: Story = {
  args: {
    id: 'disabled',
    label: 'Disabled Field',
    type: 'text',
    disabled: true,
    placeholder: 'This field is disabled',
  },
}

/** Search input type */
export const Search: Story = {
  args: {
    id: 'search',
    label: 'Search Projects',
    type: 'search',
    placeholder: 'Search by keyword...',
  },
}
