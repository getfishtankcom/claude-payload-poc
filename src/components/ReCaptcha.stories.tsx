/**
 * @description
 * Stories for ReCaptcha components — provider and hook usage.
 * Since ReCaptcha v3 is invisible, stories demonstrate the provider wrapper.
 *
 * @dependencies
 * - ReCaptchaProvider: Provider component
 * - @storybook/react: Meta/StoryObj types
 */
import type { Meta, StoryObj } from '@storybook/react'
import { ReCaptchaProvider } from './ReCaptcha'

const meta = {
  title: 'Forms/ReCaptcha',
  component: ReCaptchaProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Invisible Google ReCaptcha v3 provider. Wraps the app to enable token generation on form submit. No visible UI — the badge is hidden per Google guidelines.',
      },
    },
  },
} satisfies Meta<typeof ReCaptchaProvider>

export default meta
type Story = StoryObj<typeof meta>

/** Provider without site key (dev mode — renders children only) */
export const Default: Story = {
  args: {
    children: (
      <div className="rounded-md border border-gray-200 p-6 text-center text-text-muted">
        <p className="text-sm">
          ReCaptcha v3 Provider — invisible. No site key configured (dev mode).
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Set NEXT_PUBLIC_RECAPTCHA_SITE_KEY to enable Google ReCaptcha.
        </p>
      </div>
    ),
  },
}
