/**
 * @description
 * Stories for AuthLayout — centered card wrapper for auth pages.
 *
 * @dependencies
 * - AuthLayout: Component under test
 */
import type { Meta, StoryObj } from '@storybook/react'
import { AuthLayout } from './AuthLayout'

const meta = {
  title: 'Layout/AuthLayout',
  component: AuthLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AuthLayout>

export default meta
type Story = StoryObj<typeof meta>

/** Default with placeholder content */
export const Default: Story = {
  args: {
    children: (
      <div className="rounded-md border border-gray-200 bg-white p-8">
        <h1 className="mb-4 text-2xl font-bold">Login</h1>
        <p className="text-text-muted">Auth form content goes here.</p>
      </div>
    ),
  },
}

/** With full login form mock */
export const WithForm: Story = {
  args: {
    children: (
      <div className="flex flex-col gap-6 rounded-md border border-gray-200 bg-white p-8">
        <h1 className="text-2xl font-bold">My Account</h1>
        <div className="flex flex-col gap-4">
          <label className="text-sm font-semibold">
            User Name (email address):
            <input type="text" className="mt-1 w-full rounded border p-2" />
          </label>
          <label className="text-sm font-semibold">
            Password:
            <input type="password" className="mt-1 w-full rounded border p-2" />
          </label>
        </div>
        <button className="w-full rounded bg-primary p-3 text-white">Log in</button>
      </div>
    ),
  },
}

/** Mobile viewport */
export const Mobile: Story = {
  args: {
    children: (
      <div className="rounded-md border border-gray-200 bg-white p-6">
        <h1 className="mb-4 text-xl font-bold">Login</h1>
        <p className="text-text-muted">Mobile auth layout stretches full width.</p>
      </div>
    ),
  },
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
}
