/**
 * @description
 * Stories for LoginForm — default, error state, and mobile viewport.
 *
 * @dependencies
 * - LoginForm: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { LoginForm, type LoginFormState } from './LoginForm'

const noopAction = async (): Promise<LoginFormState> => ({
  success: false,
  message: '',
})

const errorAction = async (): Promise<LoginFormState> => ({
  success: false,
  message: 'Invalid user name or password. Please try again.',
})

const meta = {
  title: 'Forms/LoginForm',
  component: LoginForm,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-[480px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginForm>

export default meta
type Story = StoryObj<typeof meta>

/** Default empty login form */
export const Default: Story = {
  args: {
    action: noopAction,
  },
}

/** Error state after failed login */
export const WithError: Story = {
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
